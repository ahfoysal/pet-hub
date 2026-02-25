// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'pet_school_profile.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PetSchoolProfile {

 String get id;@JsonKey(name: 'userId') String get userId; String get name; String get email; String get phone; String get description; List<String> get images; ProfileStatus get status;@JsonKey(name: 'isVerified') bool get isVerified; double get rating;@JsonKey(name: 'reviewCount') int get reviewCount; dynamic get analytics;@JsonKey(name: 'reductionList') List<dynamic> get reductionList;@JsonKey(name: 'createdAt') DateTime? get createdAt;@JsonKey(name: 'updatedAt') DateTime? get updatedAt; List<Address> get addresses;
/// Create a copy of PetSchoolProfile
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PetSchoolProfileCopyWith<PetSchoolProfile> get copyWith => _$PetSchoolProfileCopyWithImpl<PetSchoolProfile>(this as PetSchoolProfile, _$identity);

  /// Serializes this PetSchoolProfile to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PetSchoolProfile&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other.images, images)&&(identical(other.status, status) || other.status == status)&&(identical(other.isVerified, isVerified) || other.isVerified == isVerified)&&(identical(other.rating, rating) || other.rating == rating)&&(identical(other.reviewCount, reviewCount) || other.reviewCount == reviewCount)&&const DeepCollectionEquality().equals(other.analytics, analytics)&&const DeepCollectionEquality().equals(other.reductionList, reductionList)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&const DeepCollectionEquality().equals(other.addresses, addresses));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,userId,name,email,phone,description,const DeepCollectionEquality().hash(images),status,isVerified,rating,reviewCount,const DeepCollectionEquality().hash(analytics),const DeepCollectionEquality().hash(reductionList),createdAt,updatedAt,const DeepCollectionEquality().hash(addresses));

@override
String toString() {
  return 'PetSchoolProfile(id: $id, userId: $userId, name: $name, email: $email, phone: $phone, description: $description, images: $images, status: $status, isVerified: $isVerified, rating: $rating, reviewCount: $reviewCount, analytics: $analytics, reductionList: $reductionList, createdAt: $createdAt, updatedAt: $updatedAt, addresses: $addresses)';
}


}

/// @nodoc
abstract mixin class $PetSchoolProfileCopyWith<$Res>  {
  factory $PetSchoolProfileCopyWith(PetSchoolProfile value, $Res Function(PetSchoolProfile) _then) = _$PetSchoolProfileCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'userId') String userId, String name, String email, String phone, String description, List<String> images, ProfileStatus status,@JsonKey(name: 'isVerified') bool isVerified, double rating,@JsonKey(name: 'reviewCount') int reviewCount, dynamic analytics,@JsonKey(name: 'reductionList') List<dynamic> reductionList,@JsonKey(name: 'createdAt') DateTime? createdAt,@JsonKey(name: 'updatedAt') DateTime? updatedAt, List<Address> addresses
});




}
/// @nodoc
class _$PetSchoolProfileCopyWithImpl<$Res>
    implements $PetSchoolProfileCopyWith<$Res> {
  _$PetSchoolProfileCopyWithImpl(this._self, this._then);

  final PetSchoolProfile _self;
  final $Res Function(PetSchoolProfile) _then;

/// Create a copy of PetSchoolProfile
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? userId = null,Object? name = null,Object? email = null,Object? phone = null,Object? description = null,Object? images = null,Object? status = null,Object? isVerified = null,Object? rating = null,Object? reviewCount = null,Object? analytics = freezed,Object? reductionList = null,Object? createdAt = freezed,Object? updatedAt = freezed,Object? addresses = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,images: null == images ? _self.images : images // ignore: cast_nullable_to_non_nullable
as List<String>,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as ProfileStatus,isVerified: null == isVerified ? _self.isVerified : isVerified // ignore: cast_nullable_to_non_nullable
as bool,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as double,reviewCount: null == reviewCount ? _self.reviewCount : reviewCount // ignore: cast_nullable_to_non_nullable
as int,analytics: freezed == analytics ? _self.analytics : analytics // ignore: cast_nullable_to_non_nullable
as dynamic,reductionList: null == reductionList ? _self.reductionList : reductionList // ignore: cast_nullable_to_non_nullable
as List<dynamic>,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,addresses: null == addresses ? _self.addresses : addresses // ignore: cast_nullable_to_non_nullable
as List<Address>,
  ));
}

}


/// Adds pattern-matching-related methods to [PetSchoolProfile].
extension PetSchoolProfilePatterns on PetSchoolProfile {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PetSchoolProfile value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PetSchoolProfile() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PetSchoolProfile value)  $default,){
final _that = this;
switch (_that) {
case _PetSchoolProfile():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PetSchoolProfile value)?  $default,){
final _that = this;
switch (_that) {
case _PetSchoolProfile() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'userId')  String userId,  String name,  String email,  String phone,  String description,  List<String> images,  ProfileStatus status, @JsonKey(name: 'isVerified')  bool isVerified,  double rating, @JsonKey(name: 'reviewCount')  int reviewCount,  dynamic analytics, @JsonKey(name: 'reductionList')  List<dynamic> reductionList, @JsonKey(name: 'createdAt')  DateTime? createdAt, @JsonKey(name: 'updatedAt')  DateTime? updatedAt,  List<Address> addresses)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PetSchoolProfile() when $default != null:
return $default(_that.id,_that.userId,_that.name,_that.email,_that.phone,_that.description,_that.images,_that.status,_that.isVerified,_that.rating,_that.reviewCount,_that.analytics,_that.reductionList,_that.createdAt,_that.updatedAt,_that.addresses);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'userId')  String userId,  String name,  String email,  String phone,  String description,  List<String> images,  ProfileStatus status, @JsonKey(name: 'isVerified')  bool isVerified,  double rating, @JsonKey(name: 'reviewCount')  int reviewCount,  dynamic analytics, @JsonKey(name: 'reductionList')  List<dynamic> reductionList, @JsonKey(name: 'createdAt')  DateTime? createdAt, @JsonKey(name: 'updatedAt')  DateTime? updatedAt,  List<Address> addresses)  $default,) {final _that = this;
switch (_that) {
case _PetSchoolProfile():
return $default(_that.id,_that.userId,_that.name,_that.email,_that.phone,_that.description,_that.images,_that.status,_that.isVerified,_that.rating,_that.reviewCount,_that.analytics,_that.reductionList,_that.createdAt,_that.updatedAt,_that.addresses);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'userId')  String userId,  String name,  String email,  String phone,  String description,  List<String> images,  ProfileStatus status, @JsonKey(name: 'isVerified')  bool isVerified,  double rating, @JsonKey(name: 'reviewCount')  int reviewCount,  dynamic analytics, @JsonKey(name: 'reductionList')  List<dynamic> reductionList, @JsonKey(name: 'createdAt')  DateTime? createdAt, @JsonKey(name: 'updatedAt')  DateTime? updatedAt,  List<Address> addresses)?  $default,) {final _that = this;
switch (_that) {
case _PetSchoolProfile() when $default != null:
return $default(_that.id,_that.userId,_that.name,_that.email,_that.phone,_that.description,_that.images,_that.status,_that.isVerified,_that.rating,_that.reviewCount,_that.analytics,_that.reductionList,_that.createdAt,_that.updatedAt,_that.addresses);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PetSchoolProfile implements PetSchoolProfile {
  const _PetSchoolProfile({required this.id, @JsonKey(name: 'userId') required this.userId, required this.name, required this.email, required this.phone, required this.description, final  List<String> images = const [], this.status = ProfileStatus.active, @JsonKey(name: 'isVerified') this.isVerified = false, this.rating = 0.0, @JsonKey(name: 'reviewCount') this.reviewCount = 0, this.analytics, @JsonKey(name: 'reductionList') final  List<dynamic> reductionList = const [], @JsonKey(name: 'createdAt') this.createdAt, @JsonKey(name: 'updatedAt') this.updatedAt, final  List<Address> addresses = const []}): _images = images,_reductionList = reductionList,_addresses = addresses;
  factory _PetSchoolProfile.fromJson(Map<String, dynamic> json) => _$PetSchoolProfileFromJson(json);

@override final  String id;
@override@JsonKey(name: 'userId') final  String userId;
@override final  String name;
@override final  String email;
@override final  String phone;
@override final  String description;
 final  List<String> _images;
@override@JsonKey() List<String> get images {
  if (_images is EqualUnmodifiableListView) return _images;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_images);
}

@override@JsonKey() final  ProfileStatus status;
@override@JsonKey(name: 'isVerified') final  bool isVerified;
@override@JsonKey() final  double rating;
@override@JsonKey(name: 'reviewCount') final  int reviewCount;
@override final  dynamic analytics;
 final  List<dynamic> _reductionList;
@override@JsonKey(name: 'reductionList') List<dynamic> get reductionList {
  if (_reductionList is EqualUnmodifiableListView) return _reductionList;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_reductionList);
}

@override@JsonKey(name: 'createdAt') final  DateTime? createdAt;
@override@JsonKey(name: 'updatedAt') final  DateTime? updatedAt;
 final  List<Address> _addresses;
@override@JsonKey() List<Address> get addresses {
  if (_addresses is EqualUnmodifiableListView) return _addresses;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_addresses);
}


/// Create a copy of PetSchoolProfile
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PetSchoolProfileCopyWith<_PetSchoolProfile> get copyWith => __$PetSchoolProfileCopyWithImpl<_PetSchoolProfile>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PetSchoolProfileToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _PetSchoolProfile&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other._images, _images)&&(identical(other.status, status) || other.status == status)&&(identical(other.isVerified, isVerified) || other.isVerified == isVerified)&&(identical(other.rating, rating) || other.rating == rating)&&(identical(other.reviewCount, reviewCount) || other.reviewCount == reviewCount)&&const DeepCollectionEquality().equals(other.analytics, analytics)&&const DeepCollectionEquality().equals(other._reductionList, _reductionList)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&const DeepCollectionEquality().equals(other._addresses, _addresses));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,userId,name,email,phone,description,const DeepCollectionEquality().hash(_images),status,isVerified,rating,reviewCount,const DeepCollectionEquality().hash(analytics),const DeepCollectionEquality().hash(_reductionList),createdAt,updatedAt,const DeepCollectionEquality().hash(_addresses));

@override
String toString() {
  return 'PetSchoolProfile(id: $id, userId: $userId, name: $name, email: $email, phone: $phone, description: $description, images: $images, status: $status, isVerified: $isVerified, rating: $rating, reviewCount: $reviewCount, analytics: $analytics, reductionList: $reductionList, createdAt: $createdAt, updatedAt: $updatedAt, addresses: $addresses)';
}


}

/// @nodoc
abstract mixin class _$PetSchoolProfileCopyWith<$Res> implements $PetSchoolProfileCopyWith<$Res> {
  factory _$PetSchoolProfileCopyWith(_PetSchoolProfile value, $Res Function(_PetSchoolProfile) _then) = __$PetSchoolProfileCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'userId') String userId, String name, String email, String phone, String description, List<String> images, ProfileStatus status,@JsonKey(name: 'isVerified') bool isVerified, double rating,@JsonKey(name: 'reviewCount') int reviewCount, dynamic analytics,@JsonKey(name: 'reductionList') List<dynamic> reductionList,@JsonKey(name: 'createdAt') DateTime? createdAt,@JsonKey(name: 'updatedAt') DateTime? updatedAt, List<Address> addresses
});




}
/// @nodoc
class __$PetSchoolProfileCopyWithImpl<$Res>
    implements _$PetSchoolProfileCopyWith<$Res> {
  __$PetSchoolProfileCopyWithImpl(this._self, this._then);

  final _PetSchoolProfile _self;
  final $Res Function(_PetSchoolProfile) _then;

/// Create a copy of PetSchoolProfile
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? userId = null,Object? name = null,Object? email = null,Object? phone = null,Object? description = null,Object? images = null,Object? status = null,Object? isVerified = null,Object? rating = null,Object? reviewCount = null,Object? analytics = freezed,Object? reductionList = null,Object? createdAt = freezed,Object? updatedAt = freezed,Object? addresses = null,}) {
  return _then(_PetSchoolProfile(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,images: null == images ? _self._images : images // ignore: cast_nullable_to_non_nullable
as List<String>,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as ProfileStatus,isVerified: null == isVerified ? _self.isVerified : isVerified // ignore: cast_nullable_to_non_nullable
as bool,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as double,reviewCount: null == reviewCount ? _self.reviewCount : reviewCount // ignore: cast_nullable_to_non_nullable
as int,analytics: freezed == analytics ? _self.analytics : analytics // ignore: cast_nullable_to_non_nullable
as dynamic,reductionList: null == reductionList ? _self._reductionList : reductionList // ignore: cast_nullable_to_non_nullable
as List<dynamic>,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,addresses: null == addresses ? _self._addresses : addresses // ignore: cast_nullable_to_non_nullable
as List<Address>,
  ));
}


}

// dart format on
