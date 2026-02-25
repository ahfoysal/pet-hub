// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'post_user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PostUser _$PostUserFromJson(Map<String, dynamic> json) => _PostUser(
  id: json['id'] as String? ?? '',
  fullName: json['fullName'] as String? ?? '',
  image: json['image'] as String?,
  userName: json['userName'] as String? ?? '',
);

Map<String, dynamic> _$PostUserToJson(_PostUser instance) => <String, dynamic>{
  'id': instance.id,
  'fullName': instance.fullName,
  'image': instance.image,
  'userName': instance.userName,
};
