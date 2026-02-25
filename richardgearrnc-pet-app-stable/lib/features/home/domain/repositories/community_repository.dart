import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/home/domain/entities/comment.dart';
import 'package:petzy_app/features/home/domain/entities/community_feed_response.dart';

/// Represents a paginated response of comments.
class CommentResponse {
  /// Creates a [CommentResponse] instance.
  CommentResponse({
    required this.comments,
    required this.nextCursor,
  });

  /// List of comments.
  final List<Comment> comments;

  /// Cursor for next page (null if no more comments).
  final String? nextCursor;

  /// Creates a [CommentResponse] from JSON.
  factory CommentResponse.fromJson(final Map<String, dynamic> json) {
    try {
      // Handle both direct and nested response structures
      List<dynamic>? commentsList;
      String? nextCursor;

      if (json['comments'] is List) {
        // Standard structure: {comments: [...], nextCursor: "..."}
        commentsList = json['comments'] as List<dynamic>;
        nextCursor = json['nextCursor'] as String?;
      } else if (json['data'] is Map) {
        // Envelope structure: {data: {comments: [...], nextCursor: "..."}}
        final dataMap = json['data'] as Map<String, dynamic>;
        commentsList = dataMap['comments'] as List<dynamic>?;
        nextCursor = dataMap['nextCursor'] as String?;
      }

      final parsedComments = (commentsList ?? [])
          .whereType<Map<String, dynamic>>()
          .map((final c) {
            try {
              return Comment.fromJson(c);
            } catch (e) {
              AppLogger.instance.w('Failed to parse comment: $e\nData: $c');
              return null;
            }
          })
          .whereType<Comment>()
          .toList();

      return CommentResponse(
        comments: parsedComments,
        nextCursor: nextCursor,
      );
    } catch (e) {
      AppLogger.instance.e('Failed to parse CommentResponse: $e\nData: $json');
      return CommentResponse(
        comments: [],
        nextCursor: null,
      );
    }
  }
}

/// Repository interface for community posts.
abstract class CommunityRepository {
  /// Fetch community posts with optional cursor for pagination.
  ///
  /// [limit] - Number of posts to fetch (default: 20)
  /// [cursor] - Cursor for pagination (null for first page)
  /// [forceRefresh] - Whether to bypass cache and force a fresh request
  ///
  /// Returns [CommunityFeedResponse] with posts and next cursor.
  Future<Result<CommunityFeedResponse>> fetchCommunityPosts({
    final int limit = 20,
    final String? cursor,
    final bool forceRefresh = false,
  });

  /// Fetch comments for a post with cursor-based pagination.
  ///
  /// [postId] - ID of the post to fetch comments for
  /// [limit] - Number of comments to fetch per page (default: 10)
  /// [cursor] - Cursor for pagination (null for first page)
  /// [forceRefresh] - Whether to bypass cache and force a fresh request
  ///
  /// Returns [CommentResponse] with comments and next cursor.
  Future<Result<CommentResponse>> fetchPostComments({
    required final String postId,
    final int limit = 10,
    final String? cursor,
    final bool forceRefresh = false,
  });

  /// Toggle like status on a post.
  ///
  /// [postId] - ID of the post to toggle like for
  ///
  /// Returns the updated like count.
  Future<Result<int>> togglePostLike(final String postId);

  /// Add a comment to a post.
  ///
  /// [postId] - ID of the post to add comment to
  /// [content] - The comment text content
  ///
  /// Returns the newly created comment.
  Future<Result<Comment>> addComment({
    required final String postId,
    required final String content,
  });
}
