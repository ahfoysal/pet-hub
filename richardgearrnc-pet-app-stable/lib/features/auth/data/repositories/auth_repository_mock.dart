import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:petzy_app/core/constants/storage_keys.dart';
import 'package:petzy_app/core/constants/app_constants.dart';
import 'package:petzy_app/core/google_signin/google_signin_service.dart';
import 'package:petzy_app/core/phone_auth/phone_auth_service.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/features/auth/domain/entities/user.dart';
import 'package:petzy_app/features/auth/domain/entities/user_exists_response.dart';
import 'package:petzy_app/features/auth/domain/repositories/auth_repository.dart';

/// Mock implementation of [AuthRepository].
///
/// This implementation simulates API calls with artificial delays.
/// Use this for development and testing.
///
/// Features:
/// - Simulates network latency (200ms default)
/// - Returns mock user data
/// - Stores mock tokens in secure storage
/// - Can simulate errors by using special email addresses
///
/// Special email addresses for testing:
/// - "error@test.com" - Simulates a login error
/// - "slow@test.com" - Simulates a slow network (500ms delay)
/// - Any other email - Successful login
class AuthRepositoryMock implements AuthRepository {
  /// Creates a [AuthRepositoryMock] instance.
  AuthRepositoryMock({required this.secureStorage});

  /// Secure storage for storing mock tokens.
  final FlutterSecureStorage secureStorage;

  /// Stores the phone number for mock OTP verification.
  String? _pendingPhoneNumber;

  @override
  Future<Result<UserExistsResponse>> checkUserExistsByEmail(
    final String email,
  ) async {
    await Future<void>.delayed(AppConstants.mockNetworkDelay);

    // Simulate different scenarios based on email
    // For mock purposes, consider user exists if email doesn't contain "new"
    final userExists = !email.toLowerCase().contains('new');

    if (userExists) {
      // Return response with user data and tokens
      final user = User(
        id: 'mock_user_${email.hashCode}',
        email: email,
        name: _extractNameFromEmail(email),
      );

      return Success(
        UserExistsResponse(
          success: true,
          message: 'User found',
          isUserExists: true,
          user: user,
          accessToken:
              'mock_access_token_${DateTime.now().millisecondsSinceEpoch}',
          refreshToken:
              'mock_refresh_token_${DateTime.now().millisecondsSinceEpoch}',
        ),
      );
    }

    // User doesn't exist
    return const Success(
      UserExistsResponse(
        success: true,
        message: 'User not found',
        isUserExists: false,
      ),
    );
  }

  @override
  Future<Result<UserExistsResponse>> checkUserExistsByPhone(
    final String phone,
  ) async {
    await Future<void>.delayed(AppConstants.mockNetworkDelay);

    // Simulate different scenarios based on phone
    // For mock purposes, consider user exists if phone doesn't contain "000"
    final userExists = !phone.contains('000');

    if (userExists) {
      // Return response with user data and tokens
      final user = User(
        id: 'mock_user_${phone.hashCode}',
        email: '$phone@phone.local',
        name: 'Phone User',
      );

      return Success(
        UserExistsResponse(
          success: true,
          message: 'User found',
          isUserExists: true,
          user: user,
          accessToken:
              'mock_access_token_${DateTime.now().millisecondsSinceEpoch}',
          refreshToken:
              'mock_refresh_token_${DateTime.now().millisecondsSinceEpoch}',
        ),
      );
    }

    // User doesn't exist
    return const Success(
      UserExistsResponse(
        success: true,
        message: 'User not found',
        isUserExists: false,
      ),
    );
  }

  @override
  Future<Result<User>> login(final String email, final String password) async {
    // Simulate slow network for testing
    final delay = email == 'slow@test.com'
        ? AppConstants.mockSlowNetworkDelay
        : AppConstants.mockNetworkDelay;
    await Future<void>.delayed(delay);

    // Simulate error for testing
    if (email == 'error@test.com') {
      return const Failure(AuthException(message: 'Invalid credentials'));
    }

    // Simulate empty password validation
    if (password.isEmpty) {
      return const Failure(AuthException(message: 'Password is required'));
    }

    // Generate mock token
    final token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
    await secureStorage.write(key: StorageKeys.accessToken, value: token);

    // Return mock user
    final user = User(
      id: 'mock_user_${email.hashCode}',
      email: email,
      name: _extractNameFromEmail(email),
    );

    await secureStorage.write(key: StorageKeys.userId, value: user.id);

    return Success(user);
  }

  @override
  Future<Result<void>> loginWithPhone({
    required final PhoneAuthService phoneAuthService,
    required final String phoneNumber,
  }) async {
    await Future<void>.delayed(AppConstants.mockNetworkDelay);

    // Simulate error for testing
    if (phoneNumber.contains('000')) {
      return const Failure(AuthException(message: 'Invalid phone number'));
    }

    // Store phone number for mock OTP verification
    _pendingPhoneNumber = phoneNumber;

    // OTP sent successfully - do NOT store any tokens or user data
    // User will be authenticated only after OTP verification with verifyOtp()
    return const Success(null);
  }

  @override
  Future<Result<User>> verifyOtp({
    required final PhoneAuthService phoneAuthService,
    required final String smsCode,
  }) async {
    await Future<void>.delayed(AppConstants.mockNetworkDelay);

    // Simulate error for testing
    if (smsCode == '000000') {
      return const Failure(AuthException(message: 'Invalid OTP code'));
    }

    // Generate mock token
    final token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
    await secureStorage.write(key: StorageKeys.accessToken, value: token);

    // Return mock user using stored phone number
    final phoneNumber = _pendingPhoneNumber ?? '+1234567890';
    final user = User(
      id: 'mock_user_${phoneNumber.hashCode}',
      email: '$phoneNumber@phone.local',
      name: 'Phone User',
    );

    await secureStorage.write(key: StorageKeys.userId, value: user.id);
    _pendingPhoneNumber = null;

    return Success(user);
  }

  @override
  Future<Result<void>> resendOtp({
    required final PhoneAuthService phoneAuthService,
    required final String phoneNumber,
  }) async {
    await Future<void>.delayed(AppConstants.mockNetworkDelay);

    // Simulate error for testing
    if (phoneNumber.contains('000')) {
      return const Failure(AuthException(message: 'Invalid phone number'));
    }

    // Store phone number for mock OTP verification
    _pendingPhoneNumber = phoneNumber;

    // In a real app, this would trigger an OTP to be sent
    // For mock, we just return success after a delay
    return const Success(null);
  }

  @override
  Future<Result<User>> loginWithGoogle({
    required final GoogleSignInService googleSignInService,
  }) async {
    await Future<void>.delayed(AppConstants.mockNetworkDelay);

    // Generate mock token
    final token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
    await secureStorage.write(key: StorageKeys.accessToken, value: token);

    // Return mock user
    final user = User(
      id: 'mock_google_user_${DateTime.now().millisecondsSinceEpoch}',
      email: 'google.user@example.com',
      name: 'Google User',
    );

    await secureStorage.write(key: StorageKeys.userId, value: user.id);

    return Success(user);
  }

  @override
  Future<Result<User>> signup({
    required final String email,
    required final String fullName,
    required final String phone,
    required final String userName,
    required final String streetAddress,
    required final String city,
    required final String country,
    required final String postalCode,
  }) async {
    await Future<void>.delayed(AppConstants.mockNetworkDelay);

    // Simulate error for testing
    if (email == 'error@test.com') {
      return const Failure(AuthException(message: 'Signup failed'));
    }

    // Generate mock tokens
    final accessToken =
        'mock_access_token_${DateTime.now().millisecondsSinceEpoch}';
    final refreshToken =
        'mock_refresh_token_${DateTime.now().millisecondsSinceEpoch}';

    await secureStorage.write(key: StorageKeys.accessToken, value: accessToken);
    await secureStorage.write(
      key: StorageKeys.refreshToken,
      value: refreshToken,
    );

    // Return mock user
    final user = User(
      id: 'mock_user_${email.hashCode}',
      email: email,
      name: fullName,
    );

    await secureStorage.write(key: StorageKeys.userId, value: user.id);

    return Success(user);
  }

  @override
  Future<Result<User>> restoreSession() async {
    await Future<void>.delayed(AppConstants.mockNetworkDelay);

    final token = await secureStorage.read(key: StorageKeys.accessToken);
    final userId = await secureStorage.read(key: StorageKeys.userId);

    if (token == null || userId == null) {
      return Failure(AuthException.noSession());
    }

    // In a real app, you would validate the token here
    // For mock, we just return a user if token exists
    return Success(
      User(id: userId, email: 'restored@test.com', name: 'Restored User'),
    );
  }

  @override
  Future<Result<void>> logout() async {
    await Future<void>.delayed(AppConstants.mockQuickDelay);

    try {
      await secureStorage.delete(key: StorageKeys.accessToken);
      await secureStorage.delete(key: StorageKeys.refreshToken);
      await secureStorage.delete(key: StorageKeys.userId);
      _pendingPhoneNumber = null;
      return const Success(null);
    } catch (e, stackTrace) {
      return Failure(
        CacheException(
          message: 'Failed to clear session',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<bool> isAuthenticated() async {
    final token = await secureStorage.read(key: StorageKeys.accessToken);
    return token != null;
  }

  /// Extract a display name from email address
  String _extractNameFromEmail(final String email) {
    final localPart = email.split('@').first;
    return localPart
        .replaceAll(RegExp('[._-]'), ' ')
        .split(' ')
        .map(
          (final word) => word.isNotEmpty
              ? '${word[0].toUpperCase()}${word.substring(1)}'
              : '',
        )
        .join(' ');
  }
}
