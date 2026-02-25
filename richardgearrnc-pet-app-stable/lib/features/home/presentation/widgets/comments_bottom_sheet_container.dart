import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/hooks/hooks.dart';
import 'package:petzy_app/features/home/presentation/providers/comments_cursor_notifier.dart';
import 'package:petzy_app/features/home/presentation/widgets/comments_bottom_sheet.dart';

/// Callback type for adding a new comment.
typedef OnAddComment = Future<void> Function(String text);

/// Callback type for liking/unliking a comment.
typedef OnCommentLikeToggle =
    Future<void> Function(String commentId, bool isLiked);

/// Container widget that provides comments from Riverpod provider to CommentsBottomSheet.
///
/// This widget manages:
/// - Loading comments from the API using cursor-based pagination
/// - Handling pagination (load more comments on scroll)
/// - Displaying loading/error states
/// - Passing comments data to the CommentsBottomSheet for display
class CommentsBottomSheetContainer extends HookConsumerWidget {
  /// Creates a [CommentsBottomSheetContainer] instance.
  const CommentsBottomSheetContainer({
    required this.postId,
    required this.onAddComment,
    required this.onCommentLikeToggle,
  });

  /// ID of the post whose comments to display.
  final String postId;

  /// Callback when a new comment is added.
  final OnAddComment onAddComment;

  /// Callback when a comment is liked/unliked.
  final OnCommentLikeToggle onCommentLikeToggle;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    // Load comments after widget tree is built
    useOnMount(() {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final notifier = ref.read(commentsCursorProvider(postId).notifier);
        notifier.loadFirstPage();
      });
    });

    // Watch the comments provider for the specific post
    final commentsState = ref.watch(commentsCursorProvider(postId));
    final commentsNotifier = ref.read(commentsCursorProvider(postId).notifier);

    return CommentsBottomSheet(
      comments: commentsState.comments,
      isLoading: commentsState.isLoading,
      onAddComment: onAddComment,
      onCommentLikeToggle: onCommentLikeToggle,
      onLoadMore: commentsState.hasMore
          ? () async {
              await commentsNotifier.loadNextPage();
            }
          : null,
      onRefresh: () async {
        await commentsNotifier.refresh();
      },
    );
  }
}
