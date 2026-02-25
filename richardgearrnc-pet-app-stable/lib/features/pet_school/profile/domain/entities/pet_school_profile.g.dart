// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pet_school_profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PetSchoolProfile _$PetSchoolProfileFromJson(Map<String, dynamic> json) =>
    _PetSchoolProfile(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      description: json['description'] as String,
      images:
          (json['images'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      status:
          $enumDecodeNullable(_$ProfileStatusEnumMap, json['status']) ??
          ProfileStatus.active,
      isVerified: json['isVerified'] as bool? ?? false,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: (json['reviewCount'] as num?)?.toInt() ?? 0,
      analytics: json['analytics'],
      reductionList: json['reductionList'] as List<dynamic>? ?? const [],
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      addresses:
          (json['addresses'] as List<dynamic>?)
              ?.map((e) => Address.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$PetSchoolProfileToJson(_PetSchoolProfile instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'description': instance.description,
      'images': instance.images,
      'status': _$ProfileStatusEnumMap[instance.status]!,
      'isVerified': instance.isVerified,
      'rating': instance.rating,
      'reviewCount': instance.reviewCount,
      'analytics': instance.analytics,
      'reductionList': instance.reductionList,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'addresses': instance.addresses,
    };

const _$ProfileStatusEnumMap = {
  ProfileStatus.active: 'ACTIVE',
  ProfileStatus.inactive: 'INACTIVE',
  ProfileStatus.pending: 'PENDING',
};
