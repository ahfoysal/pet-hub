// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'community_cursor_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Riverpod notifier for managing paginated community posts with cursor-based pagination.

@ProviderFor(CommunityCursor)
final communityCursorProvider = CommunityCursorProvider._();

/// Riverpod notifier for managing paginated community posts with cursor-based pagination.
final class CommunityCursorProvider
    extends $NotifierProvider<CommunityCursor, CommunityCursorState> {
  /// Riverpod notifier for managing paginated community posts with cursor-based pagination.
  CommunityCursorProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'communityCursorProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$communityCursorHash();

  @$internal
  @override
  CommunityCursor create() => CommunityCursor();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(CommunityCursorState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<CommunityCursorState>(value),
    );
  }
}

String _$communityCursorHash() => r'978a12f4aad911a26a0689d8c570f3678519ff08';

/// Riverpod notifier for managing paginated community posts with cursor-based pagination.

abstract class _$CommunityCursor extends $Notifier<CommunityCursorState> {
  CommunityCursorState build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<CommunityCursorState, CommunityCursorState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<CommunityCursorState, CommunityCursorState>,
              CommunityCursorState,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
