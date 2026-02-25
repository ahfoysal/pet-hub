// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pet_sitter_search_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Manages the pet sitter search page state.

@ProviderFor(PetSitterSearchNotifier)
final petSitterSearchProvider = PetSitterSearchNotifierProvider._();

/// Manages the pet sitter search page state.
final class PetSitterSearchNotifierProvider
    extends $NotifierProvider<PetSitterSearchNotifier, PetSitterSearchState> {
  /// Manages the pet sitter search page state.
  PetSitterSearchNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'petSitterSearchProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$petSitterSearchNotifierHash();

  @$internal
  @override
  PetSitterSearchNotifier create() => PetSitterSearchNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(PetSitterSearchState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<PetSitterSearchState>(value),
    );
  }
}

String _$petSitterSearchNotifierHash() =>
    r'49a1a75fd3914ae2c0bf6d065fabdbbada6b6b81';

/// Manages the pet sitter search page state.

abstract class _$PetSitterSearchNotifier
    extends $Notifier<PetSitterSearchState> {
  PetSitterSearchState build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<PetSitterSearchState, PetSitterSearchState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<PetSitterSearchState, PetSitterSearchState>,
              PetSitterSearchState,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
