import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:petzy_app/features/home/domain/entities/post_user.dart';

part 'post.freezed.dart';
part 'post.g.dart';

/// Represents a community post in the feed.
///
/// Uses Freezed for immutability and JSON serialization.
@freezed
abstract class Post with _$Post {
  /// Creates a [Post] instance.
  const factory Post({
    required final String id,
    final String? caption,
    final String? location,
    required final List<String> media,
    @JsonKey(name: 'createdAt') required final DateTime createdAt,
    required final PostUser user,
    @Default(false) final bool isLiked,
    @Default(false) final bool isSaved,
    @Default(0) final int likeCount,
    @Default(0) final int commentCount,
    @Default('PUBLIC') final String visibility,
  }) = _Post;

  /// Creates a [Post] instance from JSON.
  factory Post.fromJson(final Map<String, dynamic> json) =>
      _$PostFromJson(json);
}
