import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:petzy_app/features/home/domain/entities/post_user.dart';

part 'comment.freezed.dart';
part 'comment.g.dart';

/// Represents a comment on a community post.
///
/// Uses Freezed for immutability and JSON serialization.
@freezed
abstract class Comment with _$Comment {
  /// Creates a [Comment] instance.
  const factory Comment({
    @JsonKey(defaultValue: '') required final String id,
    @JsonKey(defaultValue: '') required final String content,
    @JsonKey(name: 'author') required final PostUser user,
    @JsonKey(name: 'createdAt', defaultValue: null) final DateTime? createdAt,
    @Default([]) final List<Comment> replies,
    @Default(0) final int replyCount,
    @Default(0) final int likeCount,
    @Default(false) final bool isLiked,
  }) = _Comment;

  /// Creates a [Comment] instance from JSON.
  factory Comment.fromJson(final Map<String, dynamic> json) =>
      _$CommentFromJson(json);
}
