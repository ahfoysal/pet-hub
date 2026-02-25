import 'package:freezed_annotation/freezed_annotation.dart';

part 'post_user.freezed.dart';
part 'post_user.g.dart';

/// User information in a post.
@freezed
abstract class PostUser with _$PostUser {
  /// Creates a [PostUser] instance.
  const factory PostUser({
    @JsonKey(defaultValue: '') required final String id,
    @JsonKey(name: 'fullName', defaultValue: '') required final String fullName,
    final String? image,
    @JsonKey(name: 'userName', defaultValue: '') required final String userName,
  }) = _PostUser;

  /// Creates a [PostUser] instance from JSON.
  factory PostUser.fromJson(final Map<String, dynamic> json) =>
      _$PostUserFromJson(json);
}
