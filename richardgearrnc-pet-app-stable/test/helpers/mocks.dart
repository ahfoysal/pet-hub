import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mocktail/mocktail.dart';
import 'package:petzy_app/core/analytics/analytics_service.dart';
import 'package:petzy_app/core/cache/cache_service.dart';
import 'package:petzy_app/core/crashlytics/crashlytics_service.dart';
import 'package:petzy_app/core/google_signin/google_signin_service.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/notifications/local_notification_service.dart';
import 'package:petzy_app/core/performance/performance_service.dart';
import 'package:petzy_app/core/phone_auth/phone_auth_service.dart';
import 'package:petzy_app/features/auth/domain/repositories/auth_repository.dart';

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/// Mock for [FlutterSecureStorage].
class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}

// ─────────────────────────────────────────────────────────────────────────────
// NETWORK MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/// Mock for [ApiClient].
class MockApiClient extends Mock implements ApiClient {}

/// Mock for [GoogleSignInService].
class MockGoogleSignInService extends Mock implements GoogleSignInService {}

/// Mock for [PhoneAuthService].
class MockPhoneAuthService extends Mock implements PhoneAuthService {}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/// Mock for [LocalNotificationService].
class MockLocalNotificationService extends Mock
    implements LocalNotificationService {}

/// Mock for [CacheService].
class MockCacheService extends Mock implements CacheService {}

/// Mock for [AnalyticsService].
class MockAnalyticsService extends Mock implements AnalyticsService {}

/// Mock for [CrashlyticsService].
class MockCrashlyticsService extends Mock implements CrashlyticsService {}

/// Mock for [PerformanceService].
class MockPerformanceService extends Mock implements PerformanceService {}

// ─────────────────────────────────────────────────────────────────────────────
// REPOSITORY MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/// Mock for [AuthRepository].
class MockAuthRepository extends Mock implements AuthRepository {}
