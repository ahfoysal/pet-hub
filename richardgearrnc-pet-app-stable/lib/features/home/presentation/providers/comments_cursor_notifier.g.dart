// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'comments_cursor_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Riverpod notifier for managing paginated post comments with cursor-based pagination.

@ProviderFor(CommentsCursor)
final commentsCursorProvider = CommentsCursorFamily._();

/// Riverpod notifier for managing paginated post comments with cursor-based pagination.
final class CommentsCursorProvider
    extends $NotifierProvider<CommentsCursor, CommentsCursorState> {
  /// Riverpod notifier for managing paginated post comments with cursor-based pagination.
  CommentsCursorProvider._({
    required CommentsCursorFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'commentsCursorProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$commentsCursorHash();

  @override
  String toString() {
    return r'commentsCursorProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  CommentsCursor create() => CommentsCursor();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(CommentsCursorState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<CommentsCursorState>(value),
    );
  }

  @override
  bool operator ==(Object other) {
    return other is CommentsCursorProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$commentsCursorHash() => r'94b4563ab75b7ffd0dc11a16a315d37d228c6469';

/// Riverpod notifier for managing paginated post comments with cursor-based pagination.

final class CommentsCursorFamily extends $Family
    with
        $ClassFamilyOverride<
          CommentsCursor,
          CommentsCursorState,
          CommentsCursorState,
          CommentsCursorState,
          String
        > {
  CommentsCursorFamily._()
    : super(
        retry: null,
        name: r'commentsCursorProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// Riverpod notifier for managing paginated post comments with cursor-based pagination.

  CommentsCursorProvider call(String postId) =>
      CommentsCursorProvider._(argument: postId, from: this);

  @override
  String toString() => r'commentsCursorProvider';
}

/// Riverpod notifier for managing paginated post comments with cursor-based pagination.

abstract class _$CommentsCursor extends $Notifier<CommentsCursorState> {
  late final _$args = ref.$arg as String;
  String get postId => _$args;

  CommentsCursorState build(String postId);
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<CommentsCursorState, CommentsCursorState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<CommentsCursorState, CommentsCursorState>,
              CommentsCursorState,
              Object?,
              Object?
            >;
    element.handleCreate(ref, () => build(_$args));
  }
}
