import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import 'package:petzy_app/core/constants/app_constants.dart';
import 'package:petzy_app/core/utils/logger.dart';

/// Service responsible for authenticating users via Firebase Phone Authentication.
///
/// Handles the complete phone verification flow:
/// 1. `verifyPhoneNumber()` - Sends OTP to the provided phone number
/// 2. `verifyOtpCode()` - Verifies the OTP and signs in with Firebase
/// 3. `resendOtp()` - Resends OTP using Firebase's resend token
///
/// Compatible with:
/// - firebase_auth ^6.1.4
///
/// Platform Behavior:
/// - **Android**: Supports auto-retrieval of SMS codes
/// - **iOS**: Manual OTP entry only (Apple restrictions)
///
/// This service is UI-agnostic and safe to use with Riverpod.
class PhoneAuthService {
  /// Creates a [PhoneAuthService].
  ///
  /// Dependencies can be injected for testing.
  PhoneAuthService({
    final firebase_auth.FirebaseAuth? firebaseAuth,
  }) : _firebaseAuth = firebaseAuth ?? firebase_auth.FirebaseAuth.instance;

  final firebase_auth.FirebaseAuth _firebaseAuth;

  /// Current verification ID from Firebase.
  /// Required to verify OTP codes.
  String? _verificationId;

  /// Resend token from Firebase for resending OTP.
  /// Only available on Android.
  int? _resendToken;

  /// Completer to handle async verification flow.
  Completer<void>? _verificationCompleter;

  /// Stream controller for auto-verification events (Android).
  final _autoVerificationController =
      StreamController<firebase_auth.UserCredential>.broadcast();

  /// Stream that emits when phone number is auto-verified (Android only).
  ///
  /// Subscribe to this stream to handle automatic sign-in when SMS is
  /// automatically detected on the device.
  Stream<firebase_auth.UserCredential> get onAutoVerificationCompleted =>
      _autoVerificationController.stream;

  /// Gets the current verification ID.
  ///
  /// Returns null if [verifyPhoneNumber] hasn't been called or failed.
  String? get verificationId => _verificationId;

  /// Initiates phone number verification with Firebase.
  ///
  /// This triggers Firebase to send an SMS with a verification code to
  /// the provided [phoneNumber].
  ///
  /// The [phoneNumber] must be in E.164 format (e.g., '+14155552671').
  ///
  /// Throws [PhoneAuthException] on failure with specific error codes:
  /// - `invalid-phone-number`: Phone number format is invalid
  /// - `quota-exceeded`: SMS quota exceeded
  /// - `too-many-requests`: Rate limiting
  ///
  /// Platform-specific behavior:
  /// - **Android**: May auto-complete verification via SMS retriever
  /// - **iOS**: Always requires manual OTP entry
  Future<void> verifyPhoneNumber(final String phoneNumber) async {
    _verificationCompleter = Completer<void>();

    try {
      await _firebaseAuth.verifyPhoneNumber(
        phoneNumber: phoneNumber,
        timeout: AppConstants.phoneAuthTimeout,
        // Called when verification is automatically completed (Android only)
        // This happens when the SMS is auto-retrieved and verified
        verificationCompleted:
            (final firebase_auth.PhoneAuthCredential credential) async {
              AppLogger.instance.i('Phone verification auto-completed');
              try {
                final userCredential = await _firebaseAuth.signInWithCredential(
                  credential,
                );
                _autoVerificationController.add(userCredential);
                // Complete the verification if still pending
                _completeVerification();
              } catch (e, stack) {
                AppLogger.instance.e(
                  'Auto-verification sign-in failed',
                  error: e,
                  stackTrace: stack,
                );
                _failVerification(
                  PhoneAuthException(
                    message: 'Auto-verification failed: $e',
                    code: 'auto-verification-failed',
                  ),
                );
              }
            },
        // Called when verification fails
        verificationFailed:
            (final firebase_auth.FirebaseAuthException exception) {
              AppLogger.instance.e(
                'Phone verification failed',
                error: exception,
                stackTrace: exception.stackTrace,
              );
              _failVerification(
                PhoneAuthException.fromFirebaseException(exception),
              );
            },
        // Called when OTP is successfully sent
        codeSent: (final String verificationId, final int? resendToken) {
          AppLogger.instance.i(
            'OTP sent successfully, verificationId: $verificationId',
          );
          _verificationId = verificationId;
          _resendToken = resendToken;
          _completeVerification();
        },
        // Called when auto-retrieval timeout expires (Android)
        codeAutoRetrievalTimeout: (final String verificationId) {
          AppLogger.instance.i('Auto-retrieval timeout for OTP');
          _verificationId = verificationId;
          // Don't fail - user can still enter OTP manually
        },
        // Use resend token if available
        forceResendingToken: _resendToken,
      );

      // Wait for either codeSent or verificationFailed callback
      await _verificationCompleter!.future;
    } on firebase_auth.FirebaseAuthException catch (e, stack) {
      AppLogger.instance.e(
        'FirebaseAuthException during phone verification',
        error: e,
        stackTrace: stack,
      );
      throw PhoneAuthException.fromFirebaseException(e);
    } catch (e, stack) {
      if (e is PhoneAuthException) rethrow;

      AppLogger.instance.e(
        'Unexpected error during phone verification',
        error: e,
        stackTrace: stack,
      );
      throw PhoneAuthException(
        message: 'Phone verification failed: $e',
        code: 'unknown',
      );
    }
  }

  /// Verifies the SMS code and signs in with Firebase.
  ///
  /// [smsCode] is the 6-digit code received via SMS.
  ///
  /// Returns the Firebase ID token on successful verification.
  /// This token should be sent to your backend for session creation.
  ///
  /// Throws [PhoneAuthException] if:
  /// - No verification ID exists (call [verifyPhoneNumber] first)
  /// - SMS code is invalid
  /// - Code has expired
  /// - Credential is malformed
  Future<String> verifyOtpCode(final String smsCode) async {
    if (_verificationId == null) {
      throw const PhoneAuthException(
        message: 'No verification ID. Call verifyPhoneNumber first.',
        code: 'no-verification-id',
      );
    }

    try {
      // Create credential from verification ID and SMS code
      final credential = firebase_auth.PhoneAuthProvider.credential(
        verificationId: _verificationId!,
        smsCode: smsCode,
      );

      // Sign in with the credential
      final userCredential = await _firebaseAuth.signInWithCredential(
        credential,
      );

      final user = userCredential.user;
      if (user == null) {
        throw const PhoneAuthException(
          message: 'Firebase user creation failed',
          code: 'user-creation-failed',
        );
      }

      // Get Firebase ID token for API calls
      final firebaseIdToken = await user.getIdToken();
      if (firebaseIdToken == null) {
        throw const PhoneAuthException(
          message: 'Failed to retrieve Firebase ID token',
          code: 'token-retrieval-failed',
        );
      }

      AppLogger.instance.i('Phone authentication successful');
      return firebaseIdToken;
    } on firebase_auth.FirebaseAuthException catch (e, stack) {
      AppLogger.instance.e(
        'FirebaseAuthException during OTP verification',
        error: e,
        stackTrace: stack,
      );
      throw PhoneAuthException.fromFirebaseException(e);
    } on PhoneAuthException {
      rethrow;
    } catch (e, stack) {
      AppLogger.instance.e(
        'Unexpected error during OTP verification',
        error: e,
        stackTrace: stack,
      );
      throw PhoneAuthException(
        message: 'OTP verification failed: $e',
        code: 'unknown',
      );
    }
  }

  /// Resends the OTP to the same phone number.
  ///
  /// Uses the resend token from the previous request for rate limiting.
  /// On Android, the resend token allows faster delivery.
  ///
  /// [phoneNumber] must be the same number used in [verifyPhoneNumber].
  ///
  /// Throws [PhoneAuthException] on failure.
  Future<void> resendOtp(final String phoneNumber) async {
    // Force resending will use the stored _resendToken
    await verifyPhoneNumber(phoneNumber);
  }

  /// Signs out from Firebase Auth.
  ///
  /// Call this when the user logs out from your app.
  Future<void> signOut() async {
    try {
      await _firebaseAuth.signOut();
      _clearState();
    } catch (e, stack) {
      AppLogger.instance.w(
        'Error during phone auth sign-out',
        error: e,
        stackTrace: stack,
      );
    }
  }

  /// Clears the current verification state.
  ///
  /// Call this if you need to restart the verification flow.
  void clearVerificationState() {
    _clearState();
  }

  /// Disposes resources used by the service.
  void dispose() {
    _autoVerificationController.close();
    _clearState();
  }

  void _completeVerification() {
    if (_verificationCompleter != null &&
        !_verificationCompleter!.isCompleted) {
      _verificationCompleter!.complete();
    }
  }

  void _failVerification(final PhoneAuthException exception) {
    if (_verificationCompleter != null &&
        !_verificationCompleter!.isCompleted) {
      _verificationCompleter!.completeError(exception);
    }
  }

  void _clearState() {
    _verificationId = null;
    _resendToken = null;
    _verificationCompleter = null;
  }
}

/// Exception thrown for Firebase Phone Authentication failures.
class PhoneAuthException implements Exception {
  /// Creates a [PhoneAuthException].
  const PhoneAuthException({
    required this.message,
    this.code,
  });

  /// Factory constructor from Firebase exception.
  ///
  /// Maps Firebase error codes to user-friendly messages.
  factory PhoneAuthException.fromFirebaseException(
    final firebase_auth.FirebaseAuthException exception,
  ) {
    final code = exception.code;
    final message = switch (code) {
      'invalid-phone-number' => 'The phone number format is invalid.',
      'quota-exceeded' => 'SMS quota exceeded. Please try again later.',
      'too-many-requests' =>
        'Too many requests. Please wait before trying again.',
      'operation-not-allowed' =>
        'Phone authentication is not enabled. Contact support.',
      'invalid-verification-code' =>
        'The verification code is incorrect. Please check and try again.',
      'invalid-verification-id' =>
        'Verification session expired. Please request a new code.',
      'session-expired' =>
        'The verification session has expired. Please request a new code.',
      'credential-already-in-use' =>
        'This phone number is already linked to another account.',
      'user-disabled' => 'This account has been disabled.',
      _ => exception.message ?? 'Phone authentication failed.',
    };

    return PhoneAuthException(
      message: message,
      code: code,
    );
  }

  /// Description of the failure.
  final String message;

  /// Firebase error code for categorization.
  final String? code;

  /// Whether this is a quota exceeded error.
  bool get isQuotaExceeded =>
      code == 'quota-exceeded' || code == 'too-many-requests';

  /// Whether this is an invalid phone number error.
  bool get isInvalidPhoneNumber => code == 'invalid-phone-number';

  /// Whether the verification code is invalid.
  bool get isInvalidCode =>
      code == 'invalid-verification-code' || code == 'session-expired';

  @override
  String toString() => 'PhoneAuthException: $message (code: $code)';
}
