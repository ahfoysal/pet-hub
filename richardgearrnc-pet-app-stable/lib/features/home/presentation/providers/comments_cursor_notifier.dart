import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/core/cache/cache_service.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/home/domain/entities/comment.dart';
import 'package:petzy_app/features/home/data/repositories/community_repository_provider.dart';

part 'comments_cursor_notifier.freezed.dart';
part 'comments_cursor_notifier.g.dart';

/// Freezed state for paginated post comments.
@freezed
abstract class CommentsCursorState with _$CommentsCursorState {
  /// Creates a [CommentsCursorState] instance.
  const factory CommentsCursorState({
    required final List<Comment> comments,
    required final String? nextCursor,
    required final bool hasMore,
    required final bool isLoading,
    required final String? error,
  }) = _CommentsCursorState;
}

/// Riverpod notifier for managing paginated post comments with cursor-based pagination.
@riverpod
class CommentsCursor extends _$CommentsCursor {
  /// Post ID for which comments are being fetched.
  late String _postId;

  @override
  CommentsCursorState build(final String postId) {
    _postId = postId;
    return const CommentsCursorState(
      comments: [],
      nextCursor: null,
      hasMore: true,
      isLoading: false,
      error: null,
    );
  }

  /// Page size for pagination.
  static const int _pageSize = 10;

  /// Load the first page of comments.
  Future<void> loadFirstPage() async {
    if (state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);

    final repository = ref.read(communityRepositoryProvider);
    final result = await repository.fetchPostComments(
      postId: _postId,
      limit: _pageSize,
    );

    result.fold(
      onSuccess: (final response) {
        state = CommentsCursorState(
          comments: response.comments,
          nextCursor: response.nextCursor,
          hasMore: response.nextCursor != null,
          isLoading: false,
          error: null,
        );
      },
      onFailure: (final error) {
        state = state.copyWith(
          isLoading: false,
          error: error.toString(),
        );
      },
    );
  }

  /// Load the next page of comments.
  Future<void> loadNextPage() async {
    if (state.isLoading || !state.hasMore) return;

    state = state.copyWith(isLoading: true);

    final repository = ref.read(communityRepositoryProvider);
    final result = await repository.fetchPostComments(
      postId: _postId,
      limit: _pageSize,
      cursor: state.nextCursor,
    );

    result.fold(
      onSuccess: (final response) {
        state = CommentsCursorState(
          comments: [...state.comments, ...response.comments],
          nextCursor: response.nextCursor,
          hasMore: response.nextCursor != null,
          isLoading: false,
          error: null,
        );
      },
      onFailure: (final error) {
        state = state.copyWith(
          isLoading: false,
          error: error.toString(),
        );
      },
    );
  }

  /// Refresh comments (reload from first page, bypassing cache).
  Future<void> refresh() async {
    state = const CommentsCursorState(
      comments: [],
      nextCursor: null,
      hasMore: true,
      isLoading: true,
      error: null,
    );

    // Clear the API cache to force fresh fetch from server
    final cacheService = ref.read(cacheServiceProvider);
    await cacheService.clearBox('api_cache');

    final repository = ref.read(communityRepositoryProvider);
    final result = await repository.fetchPostComments(
      postId: _postId,
      limit: _pageSize,
      forceRefresh: true, // Force fresh data, bypass cache
    );

    result.fold(
      onSuccess: (final response) {
        state = CommentsCursorState(
          comments: response.comments,
          nextCursor: response.nextCursor,
          hasMore: response.nextCursor != null,
          isLoading: false,
          error: null,
        );
      },
      onFailure: (final error) {
        state = state.copyWith(
          isLoading: false,
          error: error.toString(),
        );
      },
    );
  }

  /// Update like status for a comment.
  void updateCommentLike(final String commentId, final bool isLiked) {
    final updatedComments = state.comments
        .map(
          (final Comment comment) => comment.id == commentId
              ? comment.copyWith(
                  isLiked: isLiked,
                  likeCount: isLiked ? comment.likeCount + 1 : comment.likeCount - 1,
                )
              : comment,
        )
        .toList();

    state = state.copyWith(comments: updatedComments);
  }

  /// Add a new comment to the post.
  Future<void> addComment(final String content) async {
    if (content.trim().isEmpty) return;

    final repository = ref.read(communityRepositoryProvider);
    final result = await repository.addComment(
      postId: _postId,
      content: content,
    );

    result.fold(
      onSuccess: (final comment) {
        // Add new comment to the top of the list
        state = state.copyWith(
          comments: [comment, ...state.comments],
        );
      },
      onFailure: (final error) {
        AppLogger.instance.e('Failed to add comment: $error');
      },
    );
  }
}
