// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'in_app_review_service.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Provider for [InAppReviewService].

@ProviderFor(inAppReviewService)
final inAppReviewServiceProvider = InAppReviewServiceProvider._();

/// Provider for [InAppReviewService].

final class InAppReviewServiceProvider
    extends
        $FunctionalProvider<
          InAppReviewService,
          InAppReviewService,
          InAppReviewService
        >
    with $Provider<InAppReviewService> {
  /// Provider for [InAppReviewService].
  InAppReviewServiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'inAppReviewServiceProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$inAppReviewServiceHash();

  @$internal
  @override
  $ProviderElement<InAppReviewService> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  InAppReviewService create(Ref ref) {
    return inAppReviewService(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(InAppReviewService value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<InAppReviewService>(value),
    );
  }
}

String _$inAppReviewServiceHash() =>
    r'c6a8a041c9c1cac18b337219a2fa801696039edb';
