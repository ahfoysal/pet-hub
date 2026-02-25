import 'package:petzy_app/core/google_signin/google_signin_service.dart';
import 'package:petzy_app/core/phone_auth/phone_auth_service.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/features/auth/domain/entities/user.dart';
import 'package:petzy_app/features/auth/domain/entities/user_exists_response.dart';

/// Contract for authentication operations.
/// Implemented by [AuthRepositoryImpl] in the data layer.
abstract interface class AuthRepository {
  /// Check if a user exists with the given email.
  ///
  /// Sends {"email": "user@example.com"} to /auth/users/exists/email.
  /// Returns [UserExistsResponse] with isUserExists field.
  Future<Result<UserExistsResponse>> checkUserExistsByEmail(
    final String email,
  );

  /// Check if a user exists with the given phone number.
  ///
  /// Sends {"phone": "+1234567890"} to /auth/users/exists/phone.
  /// Returns [UserExistsResponse] with isUserExists field.
  Future<Result<UserExistsResponse>> checkUserExistsByPhone(
    final String phone,
  );

  /// Attempt to login with email and password.
  Future<Result<User>> login(final String email, final String password);

  /// Attempt to login with phone number using Firebase Phone Auth.
  ///
  /// This triggers Firebase to send an OTP to the phone number.
  /// Returns void on success (OTP sent, user not authenticated yet).
  /// User will be authenticated after calling [verifyOtp].
  ///
  /// Requires [PhoneAuthService] for dependency injection.
  Future<Result<void>> loginWithPhone({
    required final PhoneAuthService phoneAuthService,
    required final String phoneNumber,
  });

  /// Verify OTP code for phone number authentication.
  ///
  /// Uses Firebase credentials to verify, then exchanges the Firebase ID
  /// token with the backend for app session tokens.
  ///
  /// Requires [PhoneAuthService] for dependency injection.
  Future<Result<User>> verifyOtp({
    required final PhoneAuthService phoneAuthService,
    required final String smsCode,
  });

  /// Resend OTP code to the provided phone number.
  ///
  /// Requires [PhoneAuthService] for dependency injection.
  Future<Result<void>> resendOtp({
    required final PhoneAuthService phoneAuthService,
    required final String phoneNumber,
  });

  /// Attempt to login with Google using Firebase Auth.
  ///
  /// Requires [GoogleSignInService] for dependency injection.
  /// This service handles the Firebase auth flow.
  Future<Result<User>> loginWithGoogle({
    required final GoogleSignInService googleSignInService,
  });

  /// Register a new pet owner account.
  ///
  /// Sends signup data to /auth/pet-owner-signup.
  /// Returns [User] with authentication tokens stored.
  Future<Result<User>> signup({
    required final String email,
    required final String fullName,
    required final String phone,
    required final String userName,
    required final String streetAddress,
    required final String city,
    required final String country,
    required final String postalCode,
  });

  /// Restore session from stored credentials.
  Future<Result<User>> restoreSession();

  /// Clear the current session and logout.
  Future<Result<void>> logout();

  /// Check if user is currently authenticated.
  Future<bool> isAuthenticated();
}
