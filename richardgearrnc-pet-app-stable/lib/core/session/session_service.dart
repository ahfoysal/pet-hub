import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/session/session_state.dart';
import 'package:petzy_app/features/auth/auth.dart';

/// Provider that exposes the current session state reactively.
///
/// Use this when you need to watch session state changes.
/// This is the single source of truth for session state.
final sessionStateProvider = Provider<SessionState>((final ref) {
  final authState = ref.watch(authProvider);

  return authState.when(
    data: (final user) {
      if (user == null) {
        return const SessionInactive();
      }
      return SessionActive(userId: user.id);
    },
    loading: () => const SessionLoading(),
    error: (final error, _) {
      if (error is AuthException) {
        return SessionExpired(reason: error.message);
      }
      return const SessionInactive();
    },
  );
});

/// Provider that indicates whether user is authenticated.
///
/// Simple boolean for convenience in guards and conditionals.
final isAuthenticatedProvider = Provider<bool>((final ref) {
  return ref.watch(sessionStateProvider).isAuthenticated;
});

/// Callback type for invalidating user-specific providers on logout.
///
/// Implement this to clear any cached user data when the session ends.
typedef InvalidateProvidersCallback = void Function(Ref ref);

/// Service for session operations.
///
/// Use [sessionStateProvider] for reactive state.
/// Use this service for imperative operations like ending session.
///
/// ## Provider Invalidation on Logout
///
/// Register a callback to invalidate user-specific providers:
/// ```dart
/// final sessionService = ref.read(sessionServiceProvider);
/// sessionService.onLogoutInvalidate = (ref) {
///   ref.invalidate(userProfileProvider);
///   ref.invalidate(userSettingsProvider);
/// };
/// ```
class SessionService {
  /// Creates a [SessionService].
  SessionService(this._ref);

  final Ref _ref;

  /// Callback to invalidate user-specific providers on logout.
  ///
  /// Set this to clear any cached user data when the session ends.
  /// Example:
  /// ```dart
  /// sessionService.onLogoutInvalidate = (ref) {
  ///   ref.invalidate(userProfileProvider);
  ///   ref.invalidate(notificationsProvider);
  /// };
  /// ```
  InvalidateProvidersCallback? onLogoutInvalidate;

  /// Get the current session state (non-reactive).
  SessionState get currentState => _ref.read(sessionStateProvider);

  /// Check if the current session is valid.
  Future<bool> validateSession() async {
    final state = currentState;
    if (state is SessionActive) {
      return !state.isExpiringSoon;
    }
    return false;
  }

  /// End the current session (logout).
  ///
  /// This will:
  /// 1. Call the [onLogoutInvalidate] callback to clear cached user data
  /// 2. Call the auth notifier to perform logout
  ///
  /// Any cached user data will be cleared to ensure a clean state.
  Future<void> endSession() async {
    // First, invalidate all user-specific cached data via callback
    onLogoutInvalidate?.call(_ref);

    // Then perform the actual logout
    final notifier = _ref.read(authProvider.notifier);
    await notifier.logout();
  }
}

/// Provider for the SessionService.
final sessionServiceProvider = Provider<SessionService>((final ref) {
  return SessionService(ref);
});
