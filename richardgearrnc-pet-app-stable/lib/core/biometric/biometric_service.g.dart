// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'biometric_service.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Provider for BiometricService.

@ProviderFor(biometricService)
final biometricServiceProvider = BiometricServiceProvider._();

/// Provider for BiometricService.

final class BiometricServiceProvider
    extends
        $FunctionalProvider<
          BiometricService,
          BiometricService,
          BiometricService
        >
    with $Provider<BiometricService> {
  /// Provider for BiometricService.
  BiometricServiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'biometricServiceProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$biometricServiceHash();

  @$internal
  @override
  $ProviderElement<BiometricService> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  BiometricService create(Ref ref) {
    return biometricService(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(BiometricService value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<BiometricService>(value),
    );
  }
}

String _$biometricServiceHash() => r'edc1f982bb228f561a4f4cfe11f91bcc8aad8cbe';

/// Provider for checking available biometric types.

@ProviderFor(availableBiometrics)
final availableBiometricsProvider = AvailableBiometricsProvider._();

/// Provider for checking available biometric types.

final class AvailableBiometricsProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<BiometricType>>,
          List<BiometricType>,
          FutureOr<List<BiometricType>>
        >
    with
        $FutureModifier<List<BiometricType>>,
        $FutureProvider<List<BiometricType>> {
  /// Provider for checking available biometric types.
  AvailableBiometricsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'availableBiometricsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$availableBiometricsHash();

  @$internal
  @override
  $FutureProviderElement<List<BiometricType>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<BiometricType>> create(Ref ref) {
    return availableBiometrics(ref);
  }
}

String _$availableBiometricsHash() =>
    r'878fd95f8024c11ff8345acc34d121a2cf147ce6';

/// Provider for checking if biometric auth is available and enrolled.

@ProviderFor(canUseBiometrics)
final canUseBiometricsProvider = CanUseBiometricsProvider._();

/// Provider for checking if biometric auth is available and enrolled.

final class CanUseBiometricsProvider
    extends $FunctionalProvider<AsyncValue<bool>, bool, FutureOr<bool>>
    with $FutureModifier<bool>, $FutureProvider<bool> {
  /// Provider for checking if biometric auth is available and enrolled.
  CanUseBiometricsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'canUseBiometricsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$canUseBiometricsHash();

  @$internal
  @override
  $FutureProviderElement<bool> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<bool> create(Ref ref) {
    return canUseBiometrics(ref);
  }
}

String _$canUseBiometricsHash() => r'27277c6a39873214b5151246733d1aadaeeed3df';

/// Provider for checking if user has enabled biometric auth in settings.

@ProviderFor(biometricEnabled)
final biometricEnabledProvider = BiometricEnabledProvider._();

/// Provider for checking if user has enabled biometric auth in settings.

final class BiometricEnabledProvider
    extends $FunctionalProvider<AsyncValue<bool>, bool, FutureOr<bool>>
    with $FutureModifier<bool>, $FutureProvider<bool> {
  /// Provider for checking if user has enabled biometric auth in settings.
  BiometricEnabledProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'biometricEnabledProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$biometricEnabledHash();

  @$internal
  @override
  $FutureProviderElement<bool> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<bool> create(Ref ref) {
    return biometricEnabled(ref);
  }
}

String _$biometricEnabledHash() => r'cf942e48be6b1f6aefd57a5f1c69832cd3971993';
