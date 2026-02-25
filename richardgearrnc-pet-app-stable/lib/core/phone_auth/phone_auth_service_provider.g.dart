// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'phone_auth_service_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
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

@ProviderFor(phoneAuthService)
final phoneAuthServiceProvider = PhoneAuthServiceProvider._();

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

final class PhoneAuthServiceProvider
    extends
        $FunctionalProvider<
          PhoneAuthService,
          PhoneAuthService,
          PhoneAuthService
        >
    with $Provider<PhoneAuthService> {
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
  PhoneAuthServiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'phoneAuthServiceProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$phoneAuthServiceHash();

  @$internal
  @override
  $ProviderElement<PhoneAuthService> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  PhoneAuthService create(Ref ref) {
    return phoneAuthService(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(PhoneAuthService value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<PhoneAuthService>(value),
    );
  }
}

String _$phoneAuthServiceHash() => r'd9d1c7de8596dd2b74d85cb72fe5e9147c6c4e76';
