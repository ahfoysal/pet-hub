import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/config/env_config.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/storage/secure_storage.dart';
import 'package:petzy_app/features/auth/data/repositories/auth_repository_mock.dart';
import 'package:petzy_app/features/auth/data/repositories/auth_repository_remote.dart';
import 'package:petzy_app/features/auth/domain/repositories/auth_repository.dart';

part 'auth_repository_provider.g.dart';

/// Provider for the auth repository.
///
/// Automatically switches between mock and remote implementation
/// based on the current environment:
/// - Development/Staging: Uses [AuthRepositoryMock]
/// - Production: Uses [AuthRepositoryRemote]
///
/// ## Testing
/// Override this provider in tests for isolation:
/// ```dart
/// ProviderScope(
///   overrides: [
///     authRepositoryProvider.overrideWithValue(MockAuthRepository()),
///   ],
///   child: MyApp(),
/// )
/// ```
///
/// ## Forcing specific implementation
/// You can also override the underlying implementation providers:
/// ```dart
/// // Force mock in production for debugging
/// authRepositoryProvider.overrideWith((ref) => AuthRepositoryMock(...))
/// ```
@Riverpod(keepAlive: true)
AuthRepository authRepository(final Ref ref) {
  final secureStorage = ref.watch(secureStorageProvider);

  // Use mock repository for development and staging
  if (EnvConfig.useMockRepositories) {
    return AuthRepositoryMock(secureStorage: secureStorage);
  }

  // Use real repository for production
  final apiClient = ref.watch(apiClientProvider);
  return AuthRepositoryRemote(
    apiClient: apiClient,
    secureStorage: secureStorage,
  );
}
