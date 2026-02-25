// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'course.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Course _$CourseFromJson(Map<String, dynamic> json) => _Course(
  id: json['id'] as String,
  schoolId: json['schoolId'] as String,
  name: json['name'] as String,
  details: json['details'] as String,
  thumbnailImg: json['thumbnailImg'] as String,
  startingTime: DateTime.parse(json['startingTime'] as String),
  endingTime: DateTime.parse(json['endingTime'] as String),
  price: (json['price'] as num).toDouble(),
  availableSeats: (json['availableSeats'] as num).toInt(),
  courseFor: json['courseFor'] as String,
  discount: json['discount'] as String,
  duration: (json['duration'] as num).toInt(),
  trainerId: json['trainerId'] as String,
  courseLevel:
      $enumDecodeNullable(_$CourseLevelEnumMap, json['courseLevel']) ??
      CourseLevel.beginner,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
  trainer: Trainer.fromJson(json['trainer'] as Map<String, dynamic>),
);

Map<String, dynamic> _$CourseToJson(_Course instance) => <String, dynamic>{
  'id': instance.id,
  'schoolId': instance.schoolId,
  'name': instance.name,
  'details': instance.details,
  'thumbnailImg': instance.thumbnailImg,
  'startingTime': instance.startingTime.toIso8601String(),
  'endingTime': instance.endingTime.toIso8601String(),
  'price': instance.price,
  'availableSeats': instance.availableSeats,
  'courseFor': instance.courseFor,
  'discount': instance.discount,
  'duration': instance.duration,
  'trainerId': instance.trainerId,
  'courseLevel': _$CourseLevelEnumMap[instance.courseLevel]!,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
  'trainer': instance.trainer,
};

const _$CourseLevelEnumMap = {
  CourseLevel.beginner: 'BEGINNER',
  CourseLevel.intermediate: 'INTERMEDIATE',
  CourseLevel.advanced: 'ADVANCED',
};
