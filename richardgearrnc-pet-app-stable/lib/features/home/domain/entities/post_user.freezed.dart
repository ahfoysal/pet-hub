// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'post_user.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PostUser {

@JsonKey(defaultValue: '') String get id;@JsonKey(name: 'fullName', defaultValue: '') String get fullName; String? get image;@JsonKey(name: 'userName', defaultValue: '') String get userName;
/// Create a copy of PostUser
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PostUserCopyWith<PostUser> get copyWith => _$PostUserCopyWithImpl<PostUser>(this as PostUser, _$identity);

  /// Serializes this PostUser to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PostUser&&(identical(other.id, id) || other.id == id)&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.image, image) || other.image == image)&&(identical(other.userName, userName) || other.userName == userName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,fullName,image,userName);

@override
String toString() {
  return 'PostUser(id: $id, fullName: $fullName, image: $image, userName: $userName)';
}


}

/// @nodoc
abstract mixin class $PostUserCopyWith<$Res>  {
  factory $PostUserCopyWith(PostUser value, $Res Function(PostUser) _then) = _$PostUserCopyWithImpl;
@useResult
$Res call({
@JsonKey(defaultValue: '') String id,@JsonKey(name: 'fullName', defaultValue: '') String fullName, String? image,@JsonKey(name: 'userName', defaultValue: '') String userName
});




}
/// @nodoc
class _$PostUserCopyWithImpl<$Res>
    implements $PostUserCopyWith<$Res> {
  _$PostUserCopyWithImpl(this._self, this._then);

  final PostUser _self;
  final $Res Function(PostUser) _then;

/// Create a copy of PostUser
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? fullName = null,Object? image = freezed,Object? userName = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,image: freezed == image ? _self.image : image // ignore: cast_nullable_to_non_nullable
as String?,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [PostUser].
extension PostUserPatterns on PostUser {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PostUser value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PostUser() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PostUser value)  $default,){
final _that = this;
switch (_that) {
case _PostUser():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PostUser value)?  $default,){
final _that = this;
switch (_that) {
case _PostUser() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(defaultValue: '')  String id, @JsonKey(name: 'fullName', defaultValue: '')  String fullName,  String? image, @JsonKey(name: 'userName', defaultValue: '')  String userName)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PostUser() when $default != null:
return $default(_that.id,_that.fullName,_that.image,_that.userName);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(defaultValue: '')  String id, @JsonKey(name: 'fullName', defaultValue: '')  String fullName,  String? image, @JsonKey(name: 'userName', defaultValue: '')  String userName)  $default,) {final _that = this;
switch (_that) {
case _PostUser():
return $default(_that.id,_that.fullName,_that.image,_that.userName);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(defaultValue: '')  String id, @JsonKey(name: 'fullName', defaultValue: '')  String fullName,  String? image, @JsonKey(name: 'userName', defaultValue: '')  String userName)?  $default,) {final _that = this;
switch (_that) {
case _PostUser() when $default != null:
return $default(_that.id,_that.fullName,_that.image,_that.userName);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PostUser implements PostUser {
  const _PostUser({@JsonKey(defaultValue: '') required this.id, @JsonKey(name: 'fullName', defaultValue: '') required this.fullName, this.image, @JsonKey(name: 'userName', defaultValue: '') required this.userName});
  factory _PostUser.fromJson(Map<String, dynamic> json) => _$PostUserFromJson(json);

@override@JsonKey(defaultValue: '') final  String id;
@override@JsonKey(name: 'fullName', defaultValue: '') final  String fullName;
@override final  String? image;
@override@JsonKey(name: 'userName', defaultValue: '') final  String userName;

/// Create a copy of PostUser
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PostUserCopyWith<_PostUser> get copyWith => __$PostUserCopyWithImpl<_PostUser>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PostUserToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _PostUser&&(identical(other.id, id) || other.id == id)&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.image, image) || other.image == image)&&(identical(other.userName, userName) || other.userName == userName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,fullName,image,userName);

@override
String toString() {
  return 'PostUser(id: $id, fullName: $fullName, image: $image, userName: $userName)';
}


}

/// @nodoc
abstract mixin class _$PostUserCopyWith<$Res> implements $PostUserCopyWith<$Res> {
  factory _$PostUserCopyWith(_PostUser value, $Res Function(_PostUser) _then) = __$PostUserCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(defaultValue: '') String id,@JsonKey(name: 'fullName', defaultValue: '') String fullName, String? image,@JsonKey(name: 'userName', defaultValue: '') String userName
});




}
/// @nodoc
class __$PostUserCopyWithImpl<$Res>
    implements _$PostUserCopyWith<$Res> {
  __$PostUserCopyWithImpl(this._self, this._then);

  final _PostUser _self;
  final $Res Function(_PostUser) _then;

/// Create a copy of PostUser
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? fullName = null,Object? image = freezed,Object? userName = null,}) {
  return _then(_PostUser(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,image: freezed == image ? _self.image : image // ignore: cast_nullable_to_non_nullable
as String?,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
