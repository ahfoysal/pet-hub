// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'course.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Course {

 String get id; String get schoolId; String get name; String get details;@JsonKey(name: 'thumbnailImg') String get thumbnailImg;@JsonKey(name: 'startingTime') DateTime get startingTime;@JsonKey(name: 'endingTime') DateTime get endingTime; double get price;@JsonKey(name: 'availableSeats') int get availableSeats;@JsonKey(name: 'courseFor') String get courseFor; String get discount; int get duration;@JsonKey(name: 'trainerId') String get trainerId;@JsonKey(name: 'courseLevel') CourseLevel get courseLevel;@JsonKey(name: 'createdAt') DateTime? get createdAt;@JsonKey(name: 'updatedAt') DateTime? get updatedAt; Trainer get trainer;
/// Create a copy of Course
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CourseCopyWith<Course> get copyWith => _$CourseCopyWithImpl<Course>(this as Course, _$identity);

  /// Serializes this Course to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Course&&(identical(other.id, id) || other.id == id)&&(identical(other.schoolId, schoolId) || other.schoolId == schoolId)&&(identical(other.name, name) || other.name == name)&&(identical(other.details, details) || other.details == details)&&(identical(other.thumbnailImg, thumbnailImg) || other.thumbnailImg == thumbnailImg)&&(identical(other.startingTime, startingTime) || other.startingTime == startingTime)&&(identical(other.endingTime, endingTime) || other.endingTime == endingTime)&&(identical(other.price, price) || other.price == price)&&(identical(other.availableSeats, availableSeats) || other.availableSeats == availableSeats)&&(identical(other.courseFor, courseFor) || other.courseFor == courseFor)&&(identical(other.discount, discount) || other.discount == discount)&&(identical(other.duration, duration) || other.duration == duration)&&(identical(other.trainerId, trainerId) || other.trainerId == trainerId)&&(identical(other.courseLevel, courseLevel) || other.courseLevel == courseLevel)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.trainer, trainer) || other.trainer == trainer));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,schoolId,name,details,thumbnailImg,startingTime,endingTime,price,availableSeats,courseFor,discount,duration,trainerId,courseLevel,createdAt,updatedAt,trainer);

@override
String toString() {
  return 'Course(id: $id, schoolId: $schoolId, name: $name, details: $details, thumbnailImg: $thumbnailImg, startingTime: $startingTime, endingTime: $endingTime, price: $price, availableSeats: $availableSeats, courseFor: $courseFor, discount: $discount, duration: $duration, trainerId: $trainerId, courseLevel: $courseLevel, createdAt: $createdAt, updatedAt: $updatedAt, trainer: $trainer)';
}


}

/// @nodoc
abstract mixin class $CourseCopyWith<$Res>  {
  factory $CourseCopyWith(Course value, $Res Function(Course) _then) = _$CourseCopyWithImpl;
@useResult
$Res call({
 String id, String schoolId, String name, String details,@JsonKey(name: 'thumbnailImg') String thumbnailImg,@JsonKey(name: 'startingTime') DateTime startingTime,@JsonKey(name: 'endingTime') DateTime endingTime, double price,@JsonKey(name: 'availableSeats') int availableSeats,@JsonKey(name: 'courseFor') String courseFor, String discount, int duration,@JsonKey(name: 'trainerId') String trainerId,@JsonKey(name: 'courseLevel') CourseLevel courseLevel,@JsonKey(name: 'createdAt') DateTime? createdAt,@JsonKey(name: 'updatedAt') DateTime? updatedAt, Trainer trainer
});


$TrainerCopyWith<$Res> get trainer;

}
/// @nodoc
class _$CourseCopyWithImpl<$Res>
    implements $CourseCopyWith<$Res> {
  _$CourseCopyWithImpl(this._self, this._then);

  final Course _self;
  final $Res Function(Course) _then;

/// Create a copy of Course
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? schoolId = null,Object? name = null,Object? details = null,Object? thumbnailImg = null,Object? startingTime = null,Object? endingTime = null,Object? price = null,Object? availableSeats = null,Object? courseFor = null,Object? discount = null,Object? duration = null,Object? trainerId = null,Object? courseLevel = null,Object? createdAt = freezed,Object? updatedAt = freezed,Object? trainer = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,schoolId: null == schoolId ? _self.schoolId : schoolId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,details: null == details ? _self.details : details // ignore: cast_nullable_to_non_nullable
as String,thumbnailImg: null == thumbnailImg ? _self.thumbnailImg : thumbnailImg // ignore: cast_nullable_to_non_nullable
as String,startingTime: null == startingTime ? _self.startingTime : startingTime // ignore: cast_nullable_to_non_nullable
as DateTime,endingTime: null == endingTime ? _self.endingTime : endingTime // ignore: cast_nullable_to_non_nullable
as DateTime,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,availableSeats: null == availableSeats ? _self.availableSeats : availableSeats // ignore: cast_nullable_to_non_nullable
as int,courseFor: null == courseFor ? _self.courseFor : courseFor // ignore: cast_nullable_to_non_nullable
as String,discount: null == discount ? _self.discount : discount // ignore: cast_nullable_to_non_nullable
as String,duration: null == duration ? _self.duration : duration // ignore: cast_nullable_to_non_nullable
as int,trainerId: null == trainerId ? _self.trainerId : trainerId // ignore: cast_nullable_to_non_nullable
as String,courseLevel: null == courseLevel ? _self.courseLevel : courseLevel // ignore: cast_nullable_to_non_nullable
as CourseLevel,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,trainer: null == trainer ? _self.trainer : trainer // ignore: cast_nullable_to_non_nullable
as Trainer,
  ));
}
/// Create a copy of Course
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TrainerCopyWith<$Res> get trainer {
  
  return $TrainerCopyWith<$Res>(_self.trainer, (value) {
    return _then(_self.copyWith(trainer: value));
  });
}
}


/// Adds pattern-matching-related methods to [Course].
extension CoursePatterns on Course {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Course value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Course() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Course value)  $default,){
final _that = this;
switch (_that) {
case _Course():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Course value)?  $default,){
final _that = this;
switch (_that) {
case _Course() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String schoolId,  String name,  String details, @JsonKey(name: 'thumbnailImg')  String thumbnailImg, @JsonKey(name: 'startingTime')  DateTime startingTime, @JsonKey(name: 'endingTime')  DateTime endingTime,  double price, @JsonKey(name: 'availableSeats')  int availableSeats, @JsonKey(name: 'courseFor')  String courseFor,  String discount,  int duration, @JsonKey(name: 'trainerId')  String trainerId, @JsonKey(name: 'courseLevel')  CourseLevel courseLevel, @JsonKey(name: 'createdAt')  DateTime? createdAt, @JsonKey(name: 'updatedAt')  DateTime? updatedAt,  Trainer trainer)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Course() when $default != null:
return $default(_that.id,_that.schoolId,_that.name,_that.details,_that.thumbnailImg,_that.startingTime,_that.endingTime,_that.price,_that.availableSeats,_that.courseFor,_that.discount,_that.duration,_that.trainerId,_that.courseLevel,_that.createdAt,_that.updatedAt,_that.trainer);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String schoolId,  String name,  String details, @JsonKey(name: 'thumbnailImg')  String thumbnailImg, @JsonKey(name: 'startingTime')  DateTime startingTime, @JsonKey(name: 'endingTime')  DateTime endingTime,  double price, @JsonKey(name: 'availableSeats')  int availableSeats, @JsonKey(name: 'courseFor')  String courseFor,  String discount,  int duration, @JsonKey(name: 'trainerId')  String trainerId, @JsonKey(name: 'courseLevel')  CourseLevel courseLevel, @JsonKey(name: 'createdAt')  DateTime? createdAt, @JsonKey(name: 'updatedAt')  DateTime? updatedAt,  Trainer trainer)  $default,) {final _that = this;
switch (_that) {
case _Course():
return $default(_that.id,_that.schoolId,_that.name,_that.details,_that.thumbnailImg,_that.startingTime,_that.endingTime,_that.price,_that.availableSeats,_that.courseFor,_that.discount,_that.duration,_that.trainerId,_that.courseLevel,_that.createdAt,_that.updatedAt,_that.trainer);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String schoolId,  String name,  String details, @JsonKey(name: 'thumbnailImg')  String thumbnailImg, @JsonKey(name: 'startingTime')  DateTime startingTime, @JsonKey(name: 'endingTime')  DateTime endingTime,  double price, @JsonKey(name: 'availableSeats')  int availableSeats, @JsonKey(name: 'courseFor')  String courseFor,  String discount,  int duration, @JsonKey(name: 'trainerId')  String trainerId, @JsonKey(name: 'courseLevel')  CourseLevel courseLevel, @JsonKey(name: 'createdAt')  DateTime? createdAt, @JsonKey(name: 'updatedAt')  DateTime? updatedAt,  Trainer trainer)?  $default,) {final _that = this;
switch (_that) {
case _Course() when $default != null:
return $default(_that.id,_that.schoolId,_that.name,_that.details,_that.thumbnailImg,_that.startingTime,_that.endingTime,_that.price,_that.availableSeats,_that.courseFor,_that.discount,_that.duration,_that.trainerId,_that.courseLevel,_that.createdAt,_that.updatedAt,_that.trainer);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Course implements Course {
  const _Course({required this.id, required this.schoolId, required this.name, required this.details, @JsonKey(name: 'thumbnailImg') required this.thumbnailImg, @JsonKey(name: 'startingTime') required this.startingTime, @JsonKey(name: 'endingTime') required this.endingTime, required this.price, @JsonKey(name: 'availableSeats') required this.availableSeats, @JsonKey(name: 'courseFor') required this.courseFor, required this.discount, required this.duration, @JsonKey(name: 'trainerId') required this.trainerId, @JsonKey(name: 'courseLevel') this.courseLevel = CourseLevel.beginner, @JsonKey(name: 'createdAt') this.createdAt, @JsonKey(name: 'updatedAt') this.updatedAt, required this.trainer});
  factory _Course.fromJson(Map<String, dynamic> json) => _$CourseFromJson(json);

@override final  String id;
@override final  String schoolId;
@override final  String name;
@override final  String details;
@override@JsonKey(name: 'thumbnailImg') final  String thumbnailImg;
@override@JsonKey(name: 'startingTime') final  DateTime startingTime;
@override@JsonKey(name: 'endingTime') final  DateTime endingTime;
@override final  double price;
@override@JsonKey(name: 'availableSeats') final  int availableSeats;
@override@JsonKey(name: 'courseFor') final  String courseFor;
@override final  String discount;
@override final  int duration;
@override@JsonKey(name: 'trainerId') final  String trainerId;
@override@JsonKey(name: 'courseLevel') final  CourseLevel courseLevel;
@override@JsonKey(name: 'createdAt') final  DateTime? createdAt;
@override@JsonKey(name: 'updatedAt') final  DateTime? updatedAt;
@override final  Trainer trainer;

/// Create a copy of Course
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CourseCopyWith<_Course> get copyWith => __$CourseCopyWithImpl<_Course>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CourseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Course&&(identical(other.id, id) || other.id == id)&&(identical(other.schoolId, schoolId) || other.schoolId == schoolId)&&(identical(other.name, name) || other.name == name)&&(identical(other.details, details) || other.details == details)&&(identical(other.thumbnailImg, thumbnailImg) || other.thumbnailImg == thumbnailImg)&&(identical(other.startingTime, startingTime) || other.startingTime == startingTime)&&(identical(other.endingTime, endingTime) || other.endingTime == endingTime)&&(identical(other.price, price) || other.price == price)&&(identical(other.availableSeats, availableSeats) || other.availableSeats == availableSeats)&&(identical(other.courseFor, courseFor) || other.courseFor == courseFor)&&(identical(other.discount, discount) || other.discount == discount)&&(identical(other.duration, duration) || other.duration == duration)&&(identical(other.trainerId, trainerId) || other.trainerId == trainerId)&&(identical(other.courseLevel, courseLevel) || other.courseLevel == courseLevel)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.trainer, trainer) || other.trainer == trainer));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,schoolId,name,details,thumbnailImg,startingTime,endingTime,price,availableSeats,courseFor,discount,duration,trainerId,courseLevel,createdAt,updatedAt,trainer);

@override
String toString() {
  return 'Course(id: $id, schoolId: $schoolId, name: $name, details: $details, thumbnailImg: $thumbnailImg, startingTime: $startingTime, endingTime: $endingTime, price: $price, availableSeats: $availableSeats, courseFor: $courseFor, discount: $discount, duration: $duration, trainerId: $trainerId, courseLevel: $courseLevel, createdAt: $createdAt, updatedAt: $updatedAt, trainer: $trainer)';
}


}

/// @nodoc
abstract mixin class _$CourseCopyWith<$Res> implements $CourseCopyWith<$Res> {
  factory _$CourseCopyWith(_Course value, $Res Function(_Course) _then) = __$CourseCopyWithImpl;
@override @useResult
$Res call({
 String id, String schoolId, String name, String details,@JsonKey(name: 'thumbnailImg') String thumbnailImg,@JsonKey(name: 'startingTime') DateTime startingTime,@JsonKey(name: 'endingTime') DateTime endingTime, double price,@JsonKey(name: 'availableSeats') int availableSeats,@JsonKey(name: 'courseFor') String courseFor, String discount, int duration,@JsonKey(name: 'trainerId') String trainerId,@JsonKey(name: 'courseLevel') CourseLevel courseLevel,@JsonKey(name: 'createdAt') DateTime? createdAt,@JsonKey(name: 'updatedAt') DateTime? updatedAt, Trainer trainer
});


@override $TrainerCopyWith<$Res> get trainer;

}
/// @nodoc
class __$CourseCopyWithImpl<$Res>
    implements _$CourseCopyWith<$Res> {
  __$CourseCopyWithImpl(this._self, this._then);

  final _Course _self;
  final $Res Function(_Course) _then;

/// Create a copy of Course
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? schoolId = null,Object? name = null,Object? details = null,Object? thumbnailImg = null,Object? startingTime = null,Object? endingTime = null,Object? price = null,Object? availableSeats = null,Object? courseFor = null,Object? discount = null,Object? duration = null,Object? trainerId = null,Object? courseLevel = null,Object? createdAt = freezed,Object? updatedAt = freezed,Object? trainer = null,}) {
  return _then(_Course(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,schoolId: null == schoolId ? _self.schoolId : schoolId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,details: null == details ? _self.details : details // ignore: cast_nullable_to_non_nullable
as String,thumbnailImg: null == thumbnailImg ? _self.thumbnailImg : thumbnailImg // ignore: cast_nullable_to_non_nullable
as String,startingTime: null == startingTime ? _self.startingTime : startingTime // ignore: cast_nullable_to_non_nullable
as DateTime,endingTime: null == endingTime ? _self.endingTime : endingTime // ignore: cast_nullable_to_non_nullable
as DateTime,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,availableSeats: null == availableSeats ? _self.availableSeats : availableSeats // ignore: cast_nullable_to_non_nullable
as int,courseFor: null == courseFor ? _self.courseFor : courseFor // ignore: cast_nullable_to_non_nullable
as String,discount: null == discount ? _self.discount : discount // ignore: cast_nullable_to_non_nullable
as String,duration: null == duration ? _self.duration : duration // ignore: cast_nullable_to_non_nullable
as int,trainerId: null == trainerId ? _self.trainerId : trainerId // ignore: cast_nullable_to_non_nullable
as String,courseLevel: null == courseLevel ? _self.courseLevel : courseLevel // ignore: cast_nullable_to_non_nullable
as CourseLevel,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,trainer: null == trainer ? _self.trainer : trainer // ignore: cast_nullable_to_non_nullable
as Trainer,
  ));
}

/// Create a copy of Course
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TrainerCopyWith<$Res> get trainer {
  
  return $TrainerCopyWith<$Res>(_self.trainer, (value) {
    return _then(_self.copyWith(trainer: value));
  });
}
}

// dart format on
