// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_User _$UserFromJson(Map<String, dynamic> json) => _User(
  id: json['id'] as String,
  email: json['email'] as String,
  name: json['fullName'] as String?,
  avatarUrl: json['image'] as String?,
  isEmailVerified: json['isEmailVerified'] as bool? ?? false,
  createdAt: json['created_at'] == null
      ? null
      : DateTime.parse(json['created_at'] as String),
  role: json['role'] == null ? UserRole.petOwner : _roleFromJson(json['role']),
);

Map<String, dynamic> _$UserToJson(_User instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'fullName': instance.name,
  'image': instance.avatarUrl,
  'isEmailVerified': instance.isEmailVerified,
  'created_at': instance.createdAt?.toIso8601String(),
  'role': _roleToJson(instance.role),
};
