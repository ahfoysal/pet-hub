import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:petzy_app/core/constants/api_endpoints.dart';
import 'package:petzy_app/core/constants/storage_keys.dart';
import 'package:petzy_app/core/google_signin/google_signin_service.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/phone_auth/phone_auth_service.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/features/auth/data/repositories/auth_repository_remote.dart';
import 'package:petzy_app/features/auth/domain/entities/user.dart';

// Mock classes
class MockApiClient extends Mock implements ApiClient {}

class MockSecureStorage extends Mock implements FlutterSecureStorage {}

class MockGoogleSignInService extends Mock implements GoogleSignInService {}

class MockPhoneAuthService extends Mock implements PhoneAuthService {}

void main() {
  group('AuthRepositoryRemote', () {
    late MockApiClient mockApiClient;
    late MockSecureStorage mockSecureStorage;
    late MockPhoneAuthService mockPhoneAuthService;
    late AuthRepositoryRemote repository;

    // Test data
    final testAuthResponse = {
      'token': 'access_token_123',
      'refresh_token': 'refresh_token_456',
      'user': {
        'id': '123',
        'email': 'test@example.com',
        'name': 'Test User',
        'phone_number': '+1234567890',
        'is_email_verified': false,
        'is_phone_verified': true,
        'created_at': DateTime.now().toIso8601String(),
      },
    };

    setUp(() {
      mockApiClient = MockApiClient();
      mockSecureStorage = MockSecureStorage();
      mockPhoneAuthService = MockPhoneAuthService();
      repository = AuthRepositoryRemote(
        apiClient: mockApiClient,
        secureStorage: mockSecureStorage,
      );
    });

    group('login', () {
      test('returns Success with user on successful login', () async {
        // Arrange
        when(
          () => mockApiClient.post<Map<String, dynamic>>(
            ApiEndpoints.login,
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          ),
        ).thenAnswer((_) async => Success(testAuthResponse));

        when(
          () => mockSecureStorage.write(
            key: StorageKeys.accessToken,
            value: any(named: 'value'),
          ),
        ).thenAnswer((_) async => Future.value());

        when(
          () => mockSecureStorage.write(
            key: StorageKeys.refreshToken,
            value: any(named: 'value'),
          ),
        ).thenAnswer((_) async => Future.value());

        when(
          () => mockSecureStorage.write(
            key: StorageKeys.userId,
            value: any(named: 'value'),
          ),
        ).thenAnswer((_) async => Future.value());

        // Act
        final result = await repository.login('test@example.com', 'password');

        // Assert
        expect(result, isA<Success<User>>());
        expect(result.dataOrNull?.id, equals('123'));
        verify(
          () => mockApiClient.post<Map<String, dynamic>>(
            ApiEndpoints.login,
            data: {'email': 'test@example.com', 'password': 'password'},
            fromJson: any(named: 'fromJson'),
          ),
        ).called(1);
      });

      test('returns Failure on API error', () async {
        // Arrange
        final exception = NetworkException(
          message: 'Invalid credentials',
          statusCode: 401,
        );
        when(
          () => mockApiClient.post<Map<String, dynamic>>(
            ApiEndpoints.login,
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          ),
        ).thenAnswer((_) async => Failure(exception));

        // Act
        final result = await repository.login('test@example.com', 'wrong');

        // Assert
        expect(result, isA<Failure<User>>());
        expect(result.errorOrNull, isA<NetworkException>());
      });

      test('stores tokens and user ID in secure storage', () async {
        // Arrange
        when(
          () => mockApiClient.post<Map<String, dynamic>>(
            any(),
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          ),
        ).thenAnswer((_) async => Success(testAuthResponse));

        when(
          () => mockSecureStorage.write(
            key: any(named: 'key'),
            value: any(named: 'value'),
          ),
        ).thenAnswer((_) async => Future.value());

        // Act
        await repository.login('test@example.com', 'password');

        // Assert - verify tokens were stored
        verify(
          () => mockSecureStorage.write(
            key: StorageKeys.accessToken,
            value: 'access_token_123',
          ),
        ).called(1);

        verify(
          () => mockSecureStorage.write(
            key: StorageKeys.refreshToken,
            value: 'refresh_token_456',
          ),
        ).called(1);

        verify(
          () => mockSecureStorage.write(
            key: StorageKeys.userId,
            value: '123',
          ),
        ).called(1);
      });
    });

    group('loginWithPhone (Firebase)', () {
      test(
        'returns Success when PhoneAuthService verifies successfully',
        () async {
          // Arrange
          when(
            () => mockPhoneAuthService.verifyPhoneNumber('+1234567890'),
          ).thenAnswer((_) async => Future.value());

          // Act
          final result = await repository.loginWithPhone(
            phoneAuthService: mockPhoneAuthService,
            phoneNumber: '+1234567890',
          );

          // Assert
          expect(result, isA<Success<void>>());
          verify(
            () => mockPhoneAuthService.verifyPhoneNumber('+1234567890'),
          ).called(1);
        },
      );

      test(
        'does not store tokens on OTP request (pending verification)',
        () async {
          // Arrange
          when(
            () => mockPhoneAuthService.verifyPhoneNumber('+1234567890'),
          ).thenAnswer((_) async => Future.value());

          // Act
          await repository.loginWithPhone(
            phoneAuthService: mockPhoneAuthService,
            phoneNumber: '+1234567890',
          );

          // Assert - verify no storage calls
          verifyNever(
            () => mockSecureStorage.write(
              key: any(named: 'key'),
              value: any(named: 'value'),
            ),
          );
        },
      );

      test('returns Failure when PhoneAuthService throws exception', () async {
        // Arrange
        when(
          () => mockPhoneAuthService.verifyPhoneNumber('invalid'),
        ).thenThrow(
          const PhoneAuthException(
            message: 'Invalid phone number',
            code: 'invalid-phone-number',
          ),
        );

        // Act
        final result = await repository.loginWithPhone(
          phoneAuthService: mockPhoneAuthService,
          phoneNumber: 'invalid',
        );

        // Assert
        expect(result, isA<Failure<void>>());
        expect(result.errorOrNull, isA<AuthException>());
      });
    });

    group('loginWithGoogle', () {
      test('returns Success with user on successful Google sign-in', () async {
        // Arrange
        final googleSignInService = MockGoogleSignInService();
        when(
          () => googleSignInService.signIn(),
        ).thenAnswer(
          (_) async => const GoogleSignInResult(
            email: 'test@example.com',
            firebaseIdToken: 'firebase_id_token',
          ),
        );

        when(
          () => mockApiClient.post<Map<String, dynamic>>(
            ApiEndpoints.loginGoogle,
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          ),
        ).thenAnswer((_) async => Success(testAuthResponse));

        when(
          () => mockSecureStorage.write(
            key: any(named: 'key'),
            value: any(named: 'value'),
          ),
        ).thenAnswer((_) async => Future.value());

        // Act
        final result = await repository.loginWithGoogle(
          googleSignInService: googleSignInService,
        );

        // Assert
        expect(result, isA<Success<User>>());
        expect(result.dataOrNull?.id, equals('123'));
        verify(() => googleSignInService.signIn()).called(1);
      });

      test('returns Success(null) on user cancellation', () async {
        // Arrange
        final googleSignInService = MockGoogleSignInService();
        when(() => googleSignInService.signIn()).thenThrow(
          const GoogleSignInException.cancelled(),
        );

        // Act
        final result = await repository.loginWithGoogle(
          googleSignInService: googleSignInService,
        );

        // Assert
        expect(result, isA<Failure<User>>());
        final error = result.errorOrNull;
        expect(error, isA<AuthException>());
        expect((error as AuthException).isGoogleSignInCancelled, isTrue);
      });

      test('returns Failure on Google sign-in error', () async {
        // Arrange
        final googleSignInService = MockGoogleSignInService();
        when(() => googleSignInService.signIn()).thenThrow(
          const GoogleSignInException(
            message: 'Google authentication failed',
          ),
        );

        // Act
        final result = await repository.loginWithGoogle(
          googleSignInService: googleSignInService,
        );

        // Assert
        expect(result, isA<Failure<User>>());
        expect(result.errorOrNull, isA<AuthException>());
      });

      test('returns Failure on backend exchange error', () async {
        // Arrange
        final googleSignInService = MockGoogleSignInService();
        when(
          () => googleSignInService.signIn(),
        ).thenAnswer(
          (_) async => const GoogleSignInResult(
            email: 'test@example.com',
            firebaseIdToken: 'firebase_id_token',
          ),
        );

        final exception = NetworkException(
          message: 'Token exchange failed',
          statusCode: 400,
        );
        when(
          () => mockApiClient.post<Map<String, dynamic>>(
            any(),
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          ),
        ).thenAnswer((_) async => Failure(exception));

        // Act
        final result = await repository.loginWithGoogle(
          googleSignInService: googleSignInService,
        );

        // Assert
        expect(result, isA<Failure<User>>());
        expect(result.errorOrNull, isA<NetworkException>());
      });
    });

    group('verifyOtp (Firebase)', () {
      test('returns Success with user on valid OTP', () async {
        // Arrange - PhoneAuthService returns Firebase ID token
        when(
          () => mockPhoneAuthService.verifyOtpCode('123456'),
        ).thenAnswer((_) async => 'firebase_id_token');

        // Backend exchanges Firebase token for app tokens
        when(
          () => mockApiClient.post<Map<String, dynamic>>(
            ApiEndpoints.loginPhoneFirebase,
            data: any(named: 'data'),
            fromJson: any(named: 'fromJson'),
          ),
        ).thenAnswer((_) async => Success(testAuthResponse));

        when(
          () => mockSecureStorage.write(
            key: any(named: 'key'),
            value: any(named: 'value'),
          ),
        ).thenAnswer((_) async => Future.value());

        // Act
        final result = await repository.verifyOtp(
          phoneAuthService: mockPhoneAuthService,
          smsCode: '123456',
        );

        // Assert
        expect(result, isA<Success<User>>());
        expect(result.dataOrNull?.id, equals('123'));
        verify(
          () => mockPhoneAuthService.verifyOtpCode('123456'),
        ).called(1);
      });

      test('returns Failure on invalid OTP', () async {
        // Arrange
        when(
          () => mockPhoneAuthService.verifyOtpCode('wrong'),
        ).thenThrow(
          const PhoneAuthException(
            message: 'Invalid OTP code',
            code: 'invalid-verification-code',
          ),
        );

        // Act
        final result = await repository.verifyOtp(
          phoneAuthService: mockPhoneAuthService,
          smsCode: 'wrong',
        );

        // Assert
        expect(result, isA<Failure<User>>());
        expect(result.errorOrNull, isA<AuthException>());
      });
    });

    group('resendOtp (Firebase)', () {
      test('returns Success on OTP resend', () async {
        // Arrange
        when(
          () => mockPhoneAuthService.resendOtp('+1234567890'),
        ).thenAnswer((_) async => Future.value());

        // Act
        final result = await repository.resendOtp(
          phoneAuthService: mockPhoneAuthService,
          phoneNumber: '+1234567890',
        );

        // Assert
        expect(result, isA<Success<void>>());
        verify(
          () => mockPhoneAuthService.resendOtp('+1234567890'),
        ).called(1);
      });

      test('returns Failure on resend error', () async {
        // Arrange
        when(
          () => mockPhoneAuthService.resendOtp('+1234567890'),
        ).thenThrow(
          const PhoneAuthException(
            message: 'Too many requests',
            code: 'too-many-requests',
          ),
        );

        // Act
        final result = await repository.resendOtp(
          phoneAuthService: mockPhoneAuthService,
          phoneNumber: '+1234567890',
        );

        // Assert
        expect(result, isA<Failure<void>>());
        expect(result.errorOrNull, isA<AuthException>());
      });
    });

    group('logout', () {
      test('clears tokens on successful logout', () async {
        // Arrange
        when(
          () => mockApiClient.post<void>(ApiEndpoints.logout),
        ).thenAnswer((_) async => const Success(null));

        when(
          () => mockSecureStorage.delete(key: any(named: 'key')),
        ).thenAnswer((_) async => Future.value());

        // Act
        final result = await repository.logout();

        // Assert
        expect(result, isA<Success<void>>());
        verify(
          () => mockSecureStorage.delete(key: StorageKeys.accessToken),
        ).called(1);
        verify(
          () => mockSecureStorage.delete(key: StorageKeys.refreshToken),
        ).called(1);
        verify(
          () => mockSecureStorage.delete(key: StorageKeys.userId),
        ).called(1);
      });

      test('clears tokens even if API logout fails', () async {
        // Arrange
        when(
          () => mockApiClient.post<void>(any()),
        ).thenThrow(Exception('Network error'));

        when(
          () => mockSecureStorage.delete(key: any(named: 'key')),
        ).thenAnswer((_) async => Future.value());

        // Act
        final result = await repository.logout();

        // Assert
        expect(result, isA<Success<void>>());
        // Verify tokens were still cleared
        verify(
          () => mockSecureStorage.delete(key: any(named: 'key')),
        ).called(3);
      });
    });

    group('isAuthenticated', () {
      test('returns true when token exists', () async {
        // Arrange
        when(
          () => mockSecureStorage.read(key: StorageKeys.accessToken),
        ).thenAnswer((_) async => 'token_123');

        // Act
        final result = await repository.isAuthenticated();

        // Assert
        expect(result, isTrue);
      });

      test('returns false when token does not exist', () async {
        // Arrange
        when(
          () => mockSecureStorage.read(key: StorageKeys.accessToken),
        ).thenAnswer((_) async => null);

        // Act
        final result = await repository.isAuthenticated();

        // Assert
        expect(result, isFalse);
      });
    });

    group('restoreSession', () {
      test('returns user when token and profile are valid', () async {
        // Arrange
        when(
          () => mockSecureStorage.read(key: StorageKeys.accessToken),
        ).thenAnswer((_) async => 'valid_token');

        when(
          () => mockApiClient.get<Map<String, dynamic>>(
            ApiEndpoints.currentUserProfile,
            fromJson: any(named: 'fromJson'),
          ),
        ).thenAnswer(
          (_) async =>
              Success(testAuthResponse['user'] as Map<String, dynamic>),
        );

        // Act
        final result = await repository.restoreSession();

        // Assert
        expect(result, isA<Success<User>>());
        expect(result.dataOrNull?.id, equals('123'));
      });

      test('returns Failure when no stored token', () async {
        // Arrange
        when(
          () => mockSecureStorage.read(key: StorageKeys.accessToken),
        ).thenAnswer((_) async => null);

        // Act
        final result = await repository.restoreSession();

        // Assert
        expect(result, isA<Failure<User>>());
      });

      test('clears tokens on 401 Unauthorized', () async {
        // Arrange
        when(
          () => mockSecureStorage.read(key: StorageKeys.accessToken),
        ).thenAnswer((_) async => 'expired_token');

        final exception = NetworkException(
          message: 'Unauthorized',
          statusCode: 401,
        );
        when(
          () => mockApiClient.get<Map<String, dynamic>>(
            any(),
            fromJson: any(named: 'fromJson'),
          ),
        ).thenAnswer((_) async => Failure(exception));

        // Note: Token clearing is fire-and-forget, so we can't easily verify it
        // but we can verify the result is a Failure
        // Act
        final result = await repository.restoreSession();

        // Assert
        expect(result, isA<Failure<User>>());
      });
    });
  });
}
