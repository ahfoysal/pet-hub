import 'dart:async';
import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:petzy_app/core/constants/api_endpoints.dart';
import 'package:petzy_app/core/constants/app_constants.dart';
import 'package:petzy_app/core/constants/storage_keys.dart';
import 'package:petzy_app/core/enums/user_role.dart';
import 'package:petzy_app/core/google_signin/google_signin_service.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/phone_auth/phone_auth_service.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/auth/data/models/signup_request.dart';
import 'package:petzy_app/features/auth/domain/entities/user.dart';
import 'package:petzy_app/features/auth/domain/entities/user_exists_response.dart';
import 'package:petzy_app/features/auth/domain/repositories/auth_repository.dart';

/// Remote implementation of [AuthRepository] for actual API calls.
///
/// Expected response for login endpoints:
/// ```json
/// {"token": "jwt", "refresh_token": "refresh", "user": {...}}
/// ```
class AuthRepositoryRemote implements AuthRepository {
  /// Creates a [AuthRepositoryRemote] instance.
  AuthRepositoryRemote({
    required final ApiClient apiClient,
    required this.secureStorage,
  }) : _apiClient = apiClient;

  final ApiClient _apiClient;

  /// Secure storage for storing tokens.
  final FlutterSecureStorage secureStorage;

  @override
  Future<Result<UserExistsResponse>> checkUserExistsByEmail(
    final String email,
  ) async {
    final result = await _apiClient.post<Map<String, dynamic>>(
      ApiEndpoints.checkUserExistsByEmail,
      data: {'email': email},
      fromJson: (final json) => json as Map<String, dynamic>,
    );

    return result.fold(
      onSuccess: (final response) {
        AppLogger.instance.i('📧 User existence check response: $response');
        final existsResponse = UserExistsResponse.fromJson(response);
        AppLogger.instance.i(
          '📧 Parsed: isUserExists=${existsResponse.isUserExists}, '
          'role=${existsResponse.user?.role}, '
          'hasToken=${existsResponse.accessToken != null}',
        );
        return Success(existsResponse);
      },
      onFailure: Failure.new,
    );
  }

  @override
  Future<Result<UserExistsResponse>> checkUserExistsByPhone(
    final String phone,
  ) async {
    final result = await _apiClient.post<Map<String, dynamic>>(
      ApiEndpoints.checkUserExistsByPhone,
      data: {'phone': phone},
      fromJson: (final json) => json as Map<String, dynamic>,
    );

    return result.fold(
      onSuccess: (final response) {
        final existsResponse = UserExistsResponse.fromJson(response);
        return Success(existsResponse);
      },
      onFailure: Failure.new,
    );
  }

  @override
  Future<Result<User>> login(final String email, final String password) async {
    final result = await _apiClient.post<Map<String, dynamic>>(
      ApiEndpoints.login,
      data: {'email': email, 'password': password},
      fromJson: (final json) => json as Map<String, dynamic>,
    );

    return result.fold(
      onSuccess: _handleAuthResponse,
      onFailure: Failure.new,
    );
  }

  @override
  Future<Result<void>> loginWithPhone({
    required final PhoneAuthService phoneAuthService,
    required final String phoneNumber,
  }) async {
    try {
      AppLogger.instance.i(
        '📱 Initiating Firebase Phone Auth for: $phoneNumber',
      );
      print('\n📱 Initiating Firebase Phone Auth for: $phoneNumber');

      // Use Firebase Phone Auth to send OTP
      await phoneAuthService.verifyPhoneNumber(phoneNumber);

      // OTP sent successfully - do NOT store any tokens or user data
      // User will be authenticated only after OTP verification with verifyOtp()
      AppLogger.instance.i('✅ OTP sent successfully to: $phoneNumber');
      print('✅ OTP sent successfully to: $phoneNumber');
      print('⏳ Waiting for user to enter OTP code...\n');
      return const Success(null);
    } on PhoneAuthException catch (e) {
      return Failure(
        AuthException(
          message: e.message,
          code: e.code,
        ),
      );
    } catch (e, stackTrace) {
      return Failure(
        AuthException(
          message: 'Phone verification failed: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<User>> loginWithGoogle({
    required final GoogleSignInService googleSignInService,
  }) async {
    try {
      // 1. Authenticate with Google and get user email + Firebase ID token
      final googleSignInResult = await googleSignInService.signIn();

      // 🔐 Log Firebase Google Sign-In response
      AppLogger.instance.i(
        '🔐 Firebase Google Sign-In Response:\n'
        '  Email: ${googleSignInResult.email}\n'
        '  Firebase ID Token length: ${googleSignInResult.firebaseIdToken.length}',
      );
      print('\n🔐 Firebase Google Sign-In Response:');
      print('  Email: ${googleSignInResult.email}');
      print('  Firebase ID Token:\n  ${googleSignInResult.firebaseIdToken}');
      print('');

      // 2. Check if user exists by sending email to backend
      final existsResult = await checkUserExistsByEmail(
        googleSignInResult.email,
      );

      // Handle existence check result
      return existsResult.fold(
        onSuccess: (final existsResponse) async {
          // 🔐 Log user existence check response
          AppLogger.instance.i(
            '🔐 User Existence Check Response:\n'
            '  isUserExists: ${existsResponse.isUserExists}\n'
            '  hasAccessToken: ${existsResponse.accessToken != null}\n'
            '  hasRefreshToken: ${existsResponse.refreshToken != null}\n'
            '  userRole: ${existsResponse.user?.role}\n'
            '  userName: ${existsResponse.user?.name}\n'
            '  userId: ${existsResponse.user?.id}',
          );
          print('\n🔐 User Existence Check Response:');
          print('  isUserExists: ${existsResponse.isUserExists}');
          print('  hasAccessToken: ${existsResponse.accessToken != null}');
          print('  hasRefreshToken: ${existsResponse.refreshToken != null}');
          print('  userRole: ${existsResponse.user?.role}');
          print('  userName: ${existsResponse.user?.name}');
          print('  userId: ${existsResponse.user?.id}\n');

          // If user doesn't exist, return failure indicating signup needed
          if (!existsResponse.isUserExists) {
            print('⚠️  User needs to complete signup signup flow\n');
            return Failure(
              AuthException.userNeedsSignup(
                identifier: googleSignInResult.email,
              ),
            );
          }

          // User exists - store tokens and return user
          if (existsResponse.accessToken != null &&
              existsResponse.refreshToken != null &&
              existsResponse.user != null) {
            await _storeTokens(
              existsResponse.accessToken!,
              existsResponse.refreshToken!,
            );
            print('✅ Google login successful, tokens stored and user set\n');
            return Success(existsResponse.user!);
          }

          // User exists but tokens missing - this shouldn't happen
          return Failure(
            AuthException(
              message: 'User exists but authentication data incomplete',
              code: 'INCOMPLETE_AUTH_DATA',
            ),
          );
        },
        onFailure: Failure.new,
      );
    } on GoogleSignInException catch (e) {
      // Preserve cancellation flag in exception code
      return Failure(
        AuthException.googleAuth(
          message: e.message,
          isCancelled: e.isCancelled,
        ),
      );
    } catch (e, stackTrace) {
      return Failure(
        AuthException(
          message: 'Google sign-in failed: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<User>> verifyOtp({
    required final PhoneAuthService phoneAuthService,
    required final String smsCode,
  }) async {
    try {
      // 1. Verify OTP with Firebase and get ID token
      final firebaseIdToken = await phoneAuthService.verifyOtpCode(smsCode);

      // 🔐 Log Firebase OTP verification response
      AppLogger.instance.i(
        '🔐 Firebase OTP Verification Response:\n'
        '  ID Token length: ${firebaseIdToken.length}',
      );
      print('\n🔐 Firebase OTP Verification Response:');
      print('  Firebase ID Token:\n  $firebaseIdToken');
      print('');
      print(
        '  Sending token to backend at ${ApiEndpoints.loginPhoneFirebase}\n',
      );

      // 2. Exchange Firebase ID token for app auth token (same as Google flow)
      final result = await _apiClient.post<Map<String, dynamic>>(
        ApiEndpoints.loginPhoneFirebase,
        data: {'id_token': firebaseIdToken},
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return result.fold(
        onSuccess: (final response) {
          print('\n🔐 Backend Phone Login Response:');
          final keysList = response.keys.join(', ');
          print('  Response keys: $keysList');
          if (response.containsKey('token')) {
            print('  token: ${response['token']}');
          }
          if (response.containsKey('refresh_token')) {
            print('  refresh_token: ${response['refresh_token']}');
          }
          if (response.containsKey('user')) {
            final user = response['user'] as Map<String, dynamic>?;
            print('  user: $user');
          }
          print('');
          AppLogger.instance.i('🔐 Backend Phone Login Response received');
          return _handleAuthResponse(response);
        },
        onFailure: Failure.new,
      );
    } on PhoneAuthException catch (e) {
      return Failure(
        AuthException(
          message: e.message,
          code: e.code,
        ),
      );
    } catch (e, stackTrace) {
      return Failure(
        AuthException(
          message: 'OTP verification failed: $e',
          stackTrace: stackTrace,
        ),
      );
    }
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
    try {
      AppLogger.instance.i('🔐 Starting signup for email: $email');

      // Create signup request
      final request = SignupRequest(
        email: email,
        fullName: fullName,
        phone: phone,
        userName: userName,
        streetAddress: streetAddress,
        city: city,
        country: country,
        postalCode: postalCode,
      );

      AppLogger.instance.d('📤 Signup request: ${request.toJson()}');

      // Call signup endpoint
      final result = await _apiClient.post<Map<String, dynamic>>(
        ApiEndpoints.petOwnerSignup,
        data: request.toJson(),
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return result.fold(
        onSuccess: (final response) async {
          AppLogger.instance.i('📝 Signup API response: $response');

          // Check if response has success field
          final success = response['success'] as bool?;
          final message = response['message'] as String?;
          final data = response['data'] as Map<String, dynamic>?;

          AppLogger.instance.i(
            '📊 Parsed signup - success: $success, message: $message, hasData: ${data != null}',
          );

          // Check for successful signup based on message or success flag
          if (success == true &&
              message != null &&
              message.toLowerCase().contains('successfully') &&
              data != null) {
            // Extract tokens and role from data
            final accessToken = data['accessToken'] as String?;
            final refreshToken = data['refreshToken'] as String?;
            final roleStr = data['role'] as String?;

            AppLogger.instance.i(
              '🔑 Tokens - access: ${accessToken != null}, refresh: ${refreshToken != null}, role: $roleStr',
            );

            if (accessToken == null ||
                refreshToken == null ||
                roleStr == null) {
              return Failure(
                AuthException(
                  message: 'Incomplete signup response: missing tokens or role',
                ),
              );
            }

            // Store tokens
            await _storeTokens(accessToken, refreshToken);

            // Parse role
            UserRole? userRole;
            try {
              // Convert backend format (e.g., "PET_OWNER") to enum
              final roleEnum = roleStr.replaceAll('_', '').toLowerCase();
              userRole = UserRole.values.firstWhere(
                (final r) => r.name.toLowerCase() == roleEnum,
                orElse: () => UserRole.petOwner,
              );
            } catch (e) {
              AppLogger.instance.w(
                '⚠️ Failed to parse role: $roleStr, defaulting to petOwner',
              );
              userRole = UserRole.petOwner;
            }

            // Create user entity
            final user = User(
              id:
                  data['userId'] as String? ??
                  '', // Use userId from backend if available
              email: email,
              name: fullName,
              role: userRole,
            );

            AppLogger.instance.i(
              '✅ Signup successful: role=${user.role}, email=$email, userId=${user.id}',
            );

            return Success(user);
          }

          // If we reach here, signup failed
          final errorMessage = message ?? 'Signup failed';
          AppLogger.instance.e('❌ Signup failed: $errorMessage');

          return Failure(
            AuthException(message: errorMessage),
          );
        },
        onFailure: (final error) {
          AppLogger.instance.e('❌ Signup API call failed: $error');
          return Failure(error);
        },
      );
    } catch (e, stackTrace) {
      AppLogger.instance.e('❌ Signup exception: $e', stackTrace: stackTrace);
      return Failure(
        AuthException(
          message: 'Signup failed: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<void>> resendOtp({
    required final PhoneAuthService phoneAuthService,
    required final String phoneNumber,
  }) async {
    try {
      await phoneAuthService.resendOtp(phoneNumber);
      return const Success(null);
    } on PhoneAuthException catch (e) {
      return Failure(
        AuthException(
          message: e.message,
          code: e.code,
        ),
      );
    } catch (e, stackTrace) {
      return Failure(
        AuthException(
          message: 'Failed to resend OTP: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<User>> restoreSession() async {
    final token = await secureStorage.read(key: StorageKeys.accessToken);

    if (token == null) {
      return Failure(AuthException.noSession());
    }

    // Validate token by fetching current user with timeout
    try {
      final result = await _apiClient
          .get<Map<String, dynamic>>(
            ApiEndpoints.currentUserProfile,
            fromJson: (final json) => json as Map<String, dynamic>,
          )
          .timeout(AppConstants.sessionRestoreTimeout);

      return result.fold(
        onSuccess: (final data) async {
          try {
            // Handle both nested structure (data.user) and direct structure (data is user)
            final userData = _extractUserData(data);

            if (userData == null) {
              throw Exception('Invalid user data structure from API');
            }

            // Validate required fields before creating User
            final id = userData['id'] as String?;
            final email = userData['email'] as String?;

            if (id == null || id.isEmpty || email == null || email.isEmpty) {
              throw Exception(
                'Missing required user fields: id=$id, email=$email',
              );
            }

            final user = User.fromJson(userData);

            // Update cached profile with fresh data
            await secureStorage.write(
              key: StorageKeys.cachedUserProfile,
              value: jsonEncode(userData),
            );

            return Success(user);
          } catch (e, stackTrace) {
            AppLogger.instance.e(
              '⚠️ Failed to parse user from API response: $e',
              stackTrace: stackTrace,
            );

            // Try fallback: use cached user profile if available
            return _tryUsingCachedProfile('API response parsing failed: $e');
          }
        },
        onFailure: (final error) async {
          // Clear tokens on 401 (fire-and-forget) to avoid fold type issues
          if (error is NetworkException && error.statusCode == 401) {
            unawaited(
              _clearTokens(),
            ); // Not awaited to prevent fold type signature issues
          }

          // Try fallback: use cached user profile if available
          final cachedResult = await _tryUsingCachedProfile(
            'API call failed: $error',
          );
          if (cachedResult is Success) {
            return cachedResult;
          }

          return Failure(error);
        },
      );
    } on TimeoutException catch (_) {
      // Session validation timed out - try cached user as fallback
      final cachedResult = await _tryUsingCachedProfile(
        'Session restore timed out',
      );
      return cachedResult;
    } catch (e) {
      // Network error or other exception - try cached user as fallback
      final cachedResult = await _tryUsingCachedProfile(
        'Session restore failed: $e',
      );
      return cachedResult;
    }
  }

  /// Extracts user data from API response, handling various response structures.
  /// Handles: {data: {...}}, {user: {...}}, or direct user object
  Map<String, dynamic>? _extractUserData(final Map<String, dynamic> data) {
    // Try data.data structure (envelope response: {success, message, data: {...}})
    final dataEnvelope = data['data'] as Map<String, dynamic>?;
    if (dataEnvelope != null && dataEnvelope.isNotEmpty) {
      return dataEnvelope;
    }

    // Try nested user structure (data['user'])
    final nestedUser = data['user'] as Map<String, dynamic>?;
    if (nestedUser != null && nestedUser.isNotEmpty) {
      return nestedUser;
    }

    // Fall back to direct structure (data is the user object)
    if (data.isNotEmpty &&
        data.containsKey('id') &&
        data.containsKey('email')) {
      return data;
    }

    return null;
  }

  /// Attempts to restore user from cached profile.
  /// Returns fallback user on success, or failure with the provided reason if cache doesn't exist or is invalid.
  Future<Result<User>> _tryUsingCachedProfile(final String reason) async {
    try {
      final cachedUserJson = await secureStorage.read(
        key: StorageKeys.cachedUserProfile,
      );

      if (cachedUserJson != null && cachedUserJson.isNotEmpty) {
        try {
          final userData = jsonDecode(cachedUserJson) as Map<String, dynamic>?;
          if (userData != null && userData.isNotEmpty) {
            // Validate required fields
            final id = userData['id'] as String?;
            final email = userData['email'] as String?;

            if (id != null &&
                id.isNotEmpty &&
                email != null &&
                email.isNotEmpty) {
              final user = User.fromJson(userData);
              AppLogger.instance.i(
                '✅ Restored user from cached profile (Reason: $reason)',
              );
              return Success(user);
            } else {
              AppLogger.instance.w(
                '⚠️ Cached profile has missing required fields: id=$id, email=$email',
              );
            }
          }
        } catch (parseError, stackTrace) {
          AppLogger.instance.w(
            '⚠️ Cached profile deserialization failed: $parseError',
            stackTrace: stackTrace,
          );
          // Fall through to failure below
        }
      } else {
        AppLogger.instance.w('⚠️ No cached profile found');
      }
    } catch (e) {
      AppLogger.instance.w('⚠️ Failed to read cached profile: $e');
    }

    return Failure(
      AuthException(message: 'Failed to restore session: $reason'),
    );
  }

  @override
  Future<Result<void>> logout() async {
    try {
      // Optionally notify backend (ignore errors)
      await _apiClient.post<void>(ApiEndpoints.logout);
    } catch (_) {
      // Ignore logout API errors - we still want to clear local state
    }

    return _clearTokens();
  }

  @override
  Future<bool> isAuthenticated() async {
    final token = await secureStorage.read(key: StorageKeys.accessToken);
    return token != null;
  }

  /// Handles successful auth responses by storing tokens and user data.
  /// Shared by [login] and [verifyOtp].
  Future<Result<User>> _handleAuthResponse(
    final Map<String, dynamic> data,
  ) async {
    try {
      // 🔍 Log full response
      final keysString = data.keys.join(', ');
      AppLogger.instance.d('📋 Auth Response Keys: $keysString');
      print('\n📋 Auth Response Keys: $keysString');

      // 1. Store tokens
      final token = data['token'] as String?;
      final refreshToken = data['refresh_token'] as String?;

      AppLogger.instance.i(
        '🔑 Tokens from response\n'
        '  Access Token length: ${token?.length ?? 0}\n'
        '  Refresh Token length: ${refreshToken?.length ?? 0}',
      );
      print('🔑 Tokens from response:');
      if (token != null) {
        print('  access_token: $token');
      } else {
        print('  access_token: null');
      }
      if (refreshToken != null) {
        print('  refresh_token: $refreshToken');
      } else {
        print('  refresh_token: null');
      }

      if (token != null) {
        await secureStorage.write(key: StorageKeys.accessToken, value: token);
      }
      if (refreshToken != null) {
        await secureStorage.write(
          key: StorageKeys.refreshToken,
          value: refreshToken,
        );
      }

      // 2. Parse and store user
      final userData = data['user'] as Map<String, dynamic>?;
      if (userData == null) {
        return const Failure(
          AuthException(message: 'Invalid response: missing user data'),
        );
      }

      final userId = userData['id'] ?? '';
      final userName = userData['name'] ?? '';
      final userEmail = userData['email'] ?? '';
      final userRole = userData['role'] ?? '';

      AppLogger.instance.i(
        '👤 User Data from response\n'
        '  ID: $userId\n'
        '  Name: $userName\n'
        '  Email: $userEmail\n'
        '  Role: $userRole',
      );
      print('👤 User Data from response:');
      print('  ID: $userId');
      print('  Name: $userName');
      print('  Email: $userEmail');
      print('  Role: $userRole');

      final user = User.fromJson(userData);

      // Store all user data for offline access and quick restoration
      await Future.wait([
        secureStorage.write(key: StorageKeys.userId, value: user.id),
        secureStorage.write(key: StorageKeys.userEmail, value: user.email),
        secureStorage.write(
          key: StorageKeys.cachedUserProfile,
          value: jsonEncode(userData),
        ),
      ]);

      AppLogger.instance.i('✅ Authentication response processed successfully');
      print('✅ Authentication response processed successfully\n');

      return Success(user);
    } catch (e, stackTrace) {
      return Failure(
        CacheException(
          message: 'Failed to process authentication response: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  /// Stores authentication tokens in secure storage.
  Future<void> _storeTokens(
    final String accessToken,
    final String refreshToken,
  ) async {
    await Future.wait([
      secureStorage.write(key: StorageKeys.accessToken, value: accessToken),
      secureStorage.write(key: StorageKeys.refreshToken, value: refreshToken),
    ]);
  }

  /// Clears all stored authentication tokens and user data asynchronously.
  Future<Result<void>> _clearTokens() async {
    try {
      await Future.wait([
        secureStorage.delete(key: StorageKeys.accessToken),
        secureStorage.delete(key: StorageKeys.refreshToken),
        secureStorage.delete(key: StorageKeys.userId),
        secureStorage.delete(key: StorageKeys.cachedUserProfile),
      ]);
      return const Success(null);
    } catch (e, stackTrace) {
      return Failure(
        CacheException(message: 'Clear session failed', stackTrace: stackTrace),
      );
    }
  }
}
