import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:petzy_app/features/home/domain/entities/post.dart';

part 'community_feed_response.freezed.dart';
part 'community_feed_response.g.dart';

/// Response from the community feed API endpoint.
///
/// Contains paginated posts with cursor for the next page.
@freezed
abstract class CommunityFeedResponse with _$CommunityFeedResponse {
  /// Creates a [CommunityFeedResponse] instance.
  const factory CommunityFeedResponse({
    required final List<Post> items,
    @JsonKey(name: 'nextCursor') final String? nextCursor,
  }) = _CommunityFeedResponse;

  /// Creates a [CommunityFeedResponse] instance from JSON.
  factory CommunityFeedResponse.fromJson(final Map<String, dynamic> json) =>
      _$CommunityFeedResponseFromJson(json);
}
