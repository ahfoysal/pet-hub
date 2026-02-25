// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'post.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Post _$PostFromJson(Map<String, dynamic> json) => _Post(
  id: json['id'] as String,
  caption: json['caption'] as String?,
  location: json['location'] as String?,
  media: (json['media'] as List<dynamic>).map((e) => e as String).toList(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  user: PostUser.fromJson(json['user'] as Map<String, dynamic>),
  isLiked: json['isLiked'] as bool? ?? false,
  isSaved: json['isSaved'] as bool? ?? false,
  likeCount: (json['likeCount'] as num?)?.toInt() ?? 0,
  commentCount: (json['commentCount'] as num?)?.toInt() ?? 0,
  visibility: json['visibility'] as String? ?? 'PUBLIC',
);

Map<String, dynamic> _$PostToJson(_Post instance) => <String, dynamic>{
  'id': instance.id,
  'caption': instance.caption,
  'location': instance.location,
  'media': instance.media,
  'createdAt': instance.createdAt.toIso8601String(),
  'user': instance.user,
  'isLiked': instance.isLiked,
  'isSaved': instance.isSaved,
  'likeCount': instance.likeCount,
  'commentCount': instance.commentCount,
  'visibility': instance.visibility,
};
