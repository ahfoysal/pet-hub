import 'package:petzy_app/core/constants/api_endpoints.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/home/domain/entities/comment.dart';
import 'package:petzy_app/features/home/domain/entities/community_feed_response.dart';
import 'package:petzy_app/features/home/domain/repositories/community_repository.dart';

export 'package:petzy_app/features/home/domain/repositories/community_repository.dart';

/// Remote implementation of [CommunityRepository].
///
/// Handles API calls to fetch community posts with cursor-based pagination.
class CommunityRepositoryRemote implements CommunityRepository {
  /// Creates a [CommunityRepositoryRemote] instance.
  CommunityRepositoryRemote({required this.apiClient});

  /// API client for making requests.
  final ApiClient apiClient;

  /// Default page size for pagination.
  static const int _defaultLimit = 20;

  @override
  Future<Result<CommunityFeedResponse>> fetchCommunityPosts({
    final int limit = _defaultLimit,
    final String? cursor,
    final bool forceRefresh = false,
  }) async {
    try {
      final queryParams = {'limit': limit.toString()};
      if (cursor != null) {
        queryParams['cursor'] = cursor;
      }

      // Add cache-busting parameter when force-refreshing
      if (forceRefresh) {
        queryParams['_t'] = DateTime.now().millisecondsSinceEpoch.toString();
      }

      final response = await apiClient.get<Map<String, dynamic>>(
        ApiEndpoints.communityAll,
        queryParameters: queryParams,
        extra: forceRefresh ? {'forceRefresh': true} : null,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final feedData = data['data'] as Map<String, dynamic>;
          final communityFeed = CommunityFeedResponse.fromJson(feedData);
          return Success(communityFeed);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching community posts: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch community posts: $e'),
      );
    }
  }

  @override
  Future<Result<CommentResponse>> fetchPostComments({
    required final String postId,
    final int limit = 10,
    final String? cursor,
    final bool forceRefresh = false,
  }) async {
    try {
      final queryParams = {'limit': limit.toString()};
      if (cursor != null) {
        queryParams['cursor'] = cursor;
      }

      // Add cache-busting parameter when force-refreshing
      if (forceRefresh) {
        queryParams['_t'] = DateTime.now().millisecondsSinceEpoch.toString();
      }

      final endpoint = '${ApiEndpoints.postComments}/$postId';
      final response = await apiClient.get<Map<String, dynamic>>(
        endpoint,
        queryParameters: queryParams,
        extra: forceRefresh ? {'forceRefresh': true} : null,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final commentData = data['data'] as Map<String, dynamic>;
          final commentResponse = CommentResponse.fromJson(commentData);
          return Success(commentResponse);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching comments for post $postId: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch comments: $e'),
      );
    }
  }

  @override
  Future<Result<int>> togglePostLike(final String postId) async {
    try {
      final endpoint = '${ApiEndpoints.toggleLikePost}/$postId';
      final response = await apiClient.patch<Map<String, dynamic>>(
        endpoint,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final likeData = data['data'] as Map<String, dynamic>;
          final likeCount = (likeData['likeCount'] as num).toInt();
          return Success(likeCount);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error toggling like for post $postId: $e');
      return Failure(
        UnexpectedException(message: 'Failed to toggle like: $e'),
      );
    }
  }

  @override
  Future<Result<Comment>> addComment({
    required final String postId,
    required final String content,
  }) async {
    try {
      final endpoint = '${ApiEndpoints.addComment}/$postId';
      final response = await apiClient.post<Map<String, dynamic>>(
        endpoint,
        data: {'content': content},
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          // Response might be wrapped in 'data' field or direct comment object
          final commentData = (data['data'] is Map<String, dynamic>)
              ? data['data'] as Map<String, dynamic>
              : data;
          final comment = Comment.fromJson(commentData);
          return Success(comment);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error adding comment to post $postId: $e');
      return Failure(
        UnexpectedException(message: 'Failed to add comment: $e'),
      );
    }
  }
}
