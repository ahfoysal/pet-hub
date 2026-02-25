// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'community_feed_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CommunityFeedResponse _$CommunityFeedResponseFromJson(
  Map<String, dynamic> json,
) => _CommunityFeedResponse(
  items: (json['items'] as List<dynamic>)
      .map((e) => Post.fromJson(e as Map<String, dynamic>))
      .toList(),
  nextCursor: json['nextCursor'] as String?,
);

Map<String, dynamic> _$CommunityFeedResponseToJson(
  _CommunityFeedResponse instance,
) => <String, dynamic>{
  'items': instance.items,
  'nextCursor': instance.nextCursor,
};
