import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/auth/data/repositories/auth_repository_provider.dart';
import 'package:petzy_app/features/auth/domain/entities/user.dart';
import 'package:petzy_app/features/auth/domain/repositories/auth_repository.dart';
import 'package:petzy_app/features/auth/presentation/providers/signup_intent_provider.dart';

part 'auth_notifier.g.dart';

/// Manages authentication state.
///
/// Use this to:
/// - Check if user is logged in
/// - Login/logout
/// - Access current user
///
/// ## Why `keepAlive: true`?
///
/// Auth state should persist for the entire app lifecycle because:
/// - Auth state is needed across all screens for route guards
/// - Prevents unnecessary session restoration on every navigation
/// - Session should survive screen transitions
///
/// **Note:** Most presentation-layer providers (ViewModels, page-specific notifiers)
/// should NOT use `keepAlive: true`. Use `autoDispose` (default) to free memory
/// when the user navigates away. Only use `keepAlive` for:
/// - Global app state (auth, theme, user preferences)
/// - Expensive services (network clients, database connections)
/// - State that must survive navigation (audio player, download manager)
@Riverpod(keepAlive: true)
class AuthNotifier extends _$AuthNotifier {
  late final AuthRepository _repo;
  StreamSubscription<dynamic>? _autoVerificationSub;

  @override
  Future<User?> build() async {
    _repo = ref.watch(authRepositoryProvider);

    // Listen for auto-verification events (Android SMS retriever)
    _setupAutoVerificationListener();

    // Ensure cleanup when provider is disposed
    ref.onDispose(_cleanup);

    try {
      // Use timeout at the Future level, not at the Result level
      final result = await _repo.restoreSession().timeout(
        AppConstants.sessionRestoreNotifierTimeout,
      );
      return result.dataOrNull;
    } on TimeoutException catch (error, stackTrace) {
      // Handle timeout gracefully - treat as not authenticated
      AppLogger.instance.e(
        'Session restoration timed out',
        error: error,
        stackTrace: stackTrace,
      );
      return null;
    } catch (error, stackTrace) {
      // If session restoration throws, log it and treat as not authenticated
      AppLogger.instance.e(
        'Failed to restore session',
        error: error,
        stackTrace: stackTrace,
      );
      return null;
    }
  }

  void _setupAutoVerificationListener() {
    final phoneAuthService = ref.read(phoneAuthServiceProvider);
    _autoVerificationSub = phoneAuthService.onAutoVerificationCompleted.listen(
      (final userCredential) async {
        AppLogger.instance.i('Auto-verification completed, authenticating...');
        // When auto-verified, get the ID token and complete auth
        // The userCredential is a firebase_auth.UserCredential, but we access it
        // through dynamic to avoid importing firebase_auth in this file
        final firebaseUser = userCredential.user;
        if (firebaseUser != null) {
          try {
            final idToken = await firebaseUser.getIdToken();
            if (idToken != null) {
              // The auto-verification flow needs to exchange token with backend
              // For now, just mark the verification as complete
              // The OTP page will handle the backend exchange
              AppLogger.instance.i('Auto-verification ID token obtained');
            }
          } catch (e, stack) {
            AppLogger.instance.e(
              'Failed to get ID token after auto-verification',
              error: e,
              stackTrace: stack,
            );
          }
        }
      },
      onError: (final Object error, final StackTrace stackTrace) {
        AppLogger.instance.e(
          'Auto-verification stream error',
          error: error,
          stackTrace: stackTrace,
        );
      },
    );
  }

  void _cleanup() {
    _autoVerificationSub?.cancel();
    _autoVerificationSub = null;
  }

  /// Attempt to login with credentials.
  Future<void> login(final String email, final String password) async {
    state = const AsyncLoading();

    final result = await _repo.login(email, password);

    state = result.fold(
      onSuccess: (final user) => AsyncData<User?>(user),
      onFailure: (final error) => AsyncError(error, StackTrace.current),
    );

    // Track login event (success or failure)
    if (state.value != null) {
      ref.read(analyticsServiceProvider).logEvent(AnalyticsEvents.login);
    }
  }

  /// Attempt to login with phone number using Firebase Phone Auth.
  /// This sends an OTP to the phone number via Firebase.
  ///
  /// Unlike the old API-based flow, this uses Firebase's verifyPhoneNumber
  /// which handles SMS sending and auto-retrieval on Android.
  Future<void> loginWithPhone(final String phoneNumber) async {
    // Inject PhoneAuthService from Riverpod
    final phoneAuthService = ref.read(phoneAuthServiceProvider);

    final result = await _repo.loginWithPhone(
      phoneAuthService: phoneAuthService,
      phoneNumber: phoneNumber,
    );

    result.fold(
      onSuccess: (_) {
        // OTP sent successfully - don't set user state yet
        // User will be authenticated after OTP verification
      },
      onFailure: (final error) {
        throw error;
      },
    );
  }

  /// Verify OTP code for phone number authentication.
  ///
  /// Uses Firebase Phone Auth to verify the SMS code, then exchanges
  /// the Firebase ID token with the backend for app authentication.
  Future<void> verifyOtp(final String smsCode) async {
    state = const AsyncLoading();

    // Inject PhoneAuthService from Riverpod
    final phoneAuthService = ref.read(phoneAuthServiceProvider);

    final result = await _repo.verifyOtp(
      phoneAuthService: phoneAuthService,
      smsCode: smsCode,
    );

    state = result.fold(
      onSuccess: (final user) => AsyncData<User?>(user),
      onFailure: (final error) => AsyncError(error, StackTrace.current),
    );

    // Track OTP verification event
    if (state.value != null) {
      ref.read(analyticsServiceProvider).logEvent(AnalyticsEvents.otpVerified);
    }
  }

  /// Attempt to login with Google using Firebase Auth.
  ///
  /// Flow:
  /// 1. Get Google Sign-In service from Riverpod
  /// 2. Pass service to repository (dependency injection)
  /// 3. Repository triggers Google auth and exchanges token with backend
  /// 4. User + tokens stored on success
  ///
  /// Cancellation is handled gracefully and does NOT emit AsyncError.
  /// Instead, returns AsyncData(null) to indicate user cancelled.
  Future<void> loginWithGoogle() async {
    state = const AsyncLoading();

    // Inject Google Sign-In service from Riverpod
    final googleSignInService = ref.read(googleSignInServiceProvider);

    final result = await _repo.loginWithGoogle(
      googleSignInService: googleSignInService,
    );

    // Handle result with single fold
    state = result.fold(
      onSuccess: (final user) {
        // Track successful login
        ref.read(analyticsServiceProvider).logEvent(AnalyticsEvents.login);
        // State is AsyncData(user)
        return AsyncData<User?>(user);
      },
      onFailure: (final error) {
        // Handle Google sign-in cancellation gracefully (not an error)
        if (error is AuthException && error.isGoogleSignInCancelled) {
          return AsyncData<User?>(null);
        }

        // Handle user needs signup - store intent and return null (not an error)
        if (error is AuthException && error.isUserNeedsSignup) {
          debugPrint('🔔 User needs signup - setting signup intent');
          // Extract email from error message
          final email = error.message.replaceFirst(
            'User needs to complete signup: ',
            '',
          );
          debugPrint('   Email for signup: $email');
          // Set the signup intent provider
          ref.read(signupIntentProvider.notifier).setEmail(email);
          // Return null to indicate no user yet (will trigger redirect to signup)
          return AsyncData<User?>(null);
        }

        // Log error details for debugging
        debugPrint('🔴 Auth error: ${error.runtimeType} - $error');
        if (error is AuthException) {
          debugPrint('   Code: ${error.code}');
        }
        // Real errors emit as AsyncError
        return AsyncError<User?>(error, StackTrace.current);
      },
    );
  }

  /// Resend OTP code to the provided phone number.
  Future<void> resendOtp(final String phoneNumber) async {
    // Inject PhoneAuthService from Riverpod
    final phoneAuthService = ref.read(phoneAuthServiceProvider);

    final result = await _repo.resendOtp(
      phoneAuthService: phoneAuthService,
      phoneNumber: phoneNumber,
    );

    result.fold(
      onSuccess: (_) {
        ref.read(analyticsServiceProvider).logEvent(AnalyticsEvents.otpResent);
      },
      onFailure: (final error) {
        if (kDebugMode) {
          debugPrint('Resend OTP error: ${error.message}');
        }
      },
    );
  }

  /// Logout the current user.
  Future<void> logout() async {
    // Also sign out from Firebase Phone Auth
    final phoneAuthService = ref.read(phoneAuthServiceProvider);
    await phoneAuthService.signOut();

    final result = await _repo.logout();

    result.fold(
      onSuccess: (_) {
        state = const AsyncData(null);
        ref.read(analyticsServiceProvider).logEvent(AnalyticsEvents.logout);
      },
      onFailure: (final error) {
        // Still clear local state even if server logout fails
        state = const AsyncData(null);
        ref.read(analyticsServiceProvider).logEvent(AnalyticsEvents.logout);
        if (kDebugMode) {
          debugPrint('Logout error: ${error.message}');
        }
      },
    );
  }

  /// Check if user is currently authenticated.
  bool get isAuthenticated => state.value != null;

  /// Get the current user, or null if not authenticated.
  User? get currentUser => state.value;
}

/// Convenience provider for checking if user is authenticated.
///
/// Usage: `ref.watch(isAuthenticatedProvider)`
@riverpod
bool isAuthenticated(final Ref ref) {
  final authState = ref.watch(authProvider);
  return authState.value != null;
}

/// Convenience provider for getting the current user.
///
/// Returns null if not authenticated or loading.
/// Usage: `ref.watch(currentUserProvider)`
@riverpod
User? currentUser(final Ref ref) {
  return ref.watch(authProvider).value;
}
