import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/core/phone_auth/phone_auth_service.dart';

part 'phone_auth_service_provider.g.dart';

/// Riverpod provider for [PhoneAuthService].
///
/// This provider:
/// - Ensures a single instance is reused across app lifecycle
/// - Keeps phone authentication logic out of UI
/// - Maintains Firebase Phone Auth state
/// - Auto-disposes and cleans up when no longer needed
///
/// Usage:
/// ```dart
/// final phoneAuthService = ref.read(phoneAuthServiceProvider);
/// await phoneAuthService.verifyPhoneNumber('+14155552671');
/// final token = await phoneAuthService.verifyOtpCode('123456');
/// ```
///
/// For listening to auto-verification (Android):
/// ```dart
/// ref.read(phoneAuthServiceProvider).onAutoVerificationCompleted.listen(
///   (credential) => handleAutoVerification(credential),
/// );
/// ```
@Riverpod(keepAlive: true)
PhoneAuthService phoneAuthService(final Ref ref) {
  final service = PhoneAuthService();

  // Dispose service when provider is destroyed
  ref.onDispose(service.dispose);

  return service;
}
