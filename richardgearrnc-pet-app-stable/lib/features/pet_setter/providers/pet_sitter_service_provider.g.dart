// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pet_sitter_service_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Provider for PetSitterServicesApi.
///
/// Returns an authenticated API client that uses the configured Dio instance
/// with auth interceptors and caching.

@ProviderFor(petSitterServicesApi)
final petSitterServicesApiProvider = PetSitterServicesApiProvider._();

/// Provider for PetSitterServicesApi.
///
/// Returns an authenticated API client that uses the configured Dio instance
/// with auth interceptors and caching.

final class PetSitterServicesApiProvider
    extends
        $FunctionalProvider<
          PetSitterServicesApi,
          PetSitterServicesApi,
          PetSitterServicesApi
        >
    with $Provider<PetSitterServicesApi> {
  /// Provider for PetSitterServicesApi.
  ///
  /// Returns an authenticated API client that uses the configured Dio instance
  /// with auth interceptors and caching.
  PetSitterServicesApiProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'petSitterServicesApiProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$petSitterServicesApiHash();

  @$internal
  @override
  $ProviderElement<PetSitterServicesApi> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  PetSitterServicesApi create(Ref ref) {
    return petSitterServicesApi(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(PetSitterServicesApi value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<PetSitterServicesApi>(value),
    );
  }
}

String _$petSitterServicesApiHash() =>
    r'9ca9d970b3cd5d604569099b748d70cb87a13f66';
