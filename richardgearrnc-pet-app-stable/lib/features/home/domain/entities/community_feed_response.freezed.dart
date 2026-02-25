// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'community_feed_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CommunityFeedResponse {

 List<Post> get items;@JsonKey(name: 'nextCursor') String? get nextCursor;
/// Create a copy of CommunityFeedResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommunityFeedResponseCopyWith<CommunityFeedResponse> get copyWith => _$CommunityFeedResponseCopyWithImpl<CommunityFeedResponse>(this as CommunityFeedResponse, _$identity);

  /// Serializes this CommunityFeedResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommunityFeedResponse&&const DeepCollectionEquality().equals(other.items, items)&&(identical(other.nextCursor, nextCursor) || other.nextCursor == nextCursor));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(items),nextCursor);

@override
String toString() {
  return 'CommunityFeedResponse(items: $items, nextCursor: $nextCursor)';
}


}

/// @nodoc
abstract mixin class $CommunityFeedResponseCopyWith<$Res>  {
  factory $CommunityFeedResponseCopyWith(CommunityFeedResponse value, $Res Function(CommunityFeedResponse) _then) = _$CommunityFeedResponseCopyWithImpl;
@useResult
$Res call({
 List<Post> items,@JsonKey(name: 'nextCursor') String? nextCursor
});




}
/// @nodoc
class _$CommunityFeedResponseCopyWithImpl<$Res>
    implements $CommunityFeedResponseCopyWith<$Res> {
  _$CommunityFeedResponseCopyWithImpl(this._self, this._then);

  final CommunityFeedResponse _self;
  final $Res Function(CommunityFeedResponse) _then;

/// Create a copy of CommunityFeedResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? items = null,Object? nextCursor = freezed,}) {
  return _then(_self.copyWith(
items: null == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<Post>,nextCursor: freezed == nextCursor ? _self.nextCursor : nextCursor // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [CommunityFeedResponse].
extension CommunityFeedResponsePatterns on CommunityFeedResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommunityFeedResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommunityFeedResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommunityFeedResponse value)  $default,){
final _that = this;
switch (_that) {
case _CommunityFeedResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommunityFeedResponse value)?  $default,){
final _that = this;
switch (_that) {
case _CommunityFeedResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<Post> items, @JsonKey(name: 'nextCursor')  String? nextCursor)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommunityFeedResponse() when $default != null:
return $default(_that.items,_that.nextCursor);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<Post> items, @JsonKey(name: 'nextCursor')  String? nextCursor)  $default,) {final _that = this;
switch (_that) {
case _CommunityFeedResponse():
return $default(_that.items,_that.nextCursor);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<Post> items, @JsonKey(name: 'nextCursor')  String? nextCursor)?  $default,) {final _that = this;
switch (_that) {
case _CommunityFeedResponse() when $default != null:
return $default(_that.items,_that.nextCursor);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CommunityFeedResponse implements CommunityFeedResponse {
  const _CommunityFeedResponse({required final  List<Post> items, @JsonKey(name: 'nextCursor') this.nextCursor}): _items = items;
  factory _CommunityFeedResponse.fromJson(Map<String, dynamic> json) => _$CommunityFeedResponseFromJson(json);

 final  List<Post> _items;
@override List<Post> get items {
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_items);
}

@override@JsonKey(name: 'nextCursor') final  String? nextCursor;

/// Create a copy of CommunityFeedResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommunityFeedResponseCopyWith<_CommunityFeedResponse> get copyWith => __$CommunityFeedResponseCopyWithImpl<_CommunityFeedResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CommunityFeedResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommunityFeedResponse&&const DeepCollectionEquality().equals(other._items, _items)&&(identical(other.nextCursor, nextCursor) || other.nextCursor == nextCursor));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(_items),nextCursor);

@override
String toString() {
  return 'CommunityFeedResponse(items: $items, nextCursor: $nextCursor)';
}


}

/// @nodoc
abstract mixin class _$CommunityFeedResponseCopyWith<$Res> implements $CommunityFeedResponseCopyWith<$Res> {
  factory _$CommunityFeedResponseCopyWith(_CommunityFeedResponse value, $Res Function(_CommunityFeedResponse) _then) = __$CommunityFeedResponseCopyWithImpl;
@override @useResult
$Res call({
 List<Post> items,@JsonKey(name: 'nextCursor') String? nextCursor
});




}
/// @nodoc
class __$CommunityFeedResponseCopyWithImpl<$Res>
    implements _$CommunityFeedResponseCopyWith<$Res> {
  __$CommunityFeedResponseCopyWithImpl(this._self, this._then);

  final _CommunityFeedResponse _self;
  final $Res Function(_CommunityFeedResponse) _then;

/// Create a copy of CommunityFeedResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? items = null,Object? nextCursor = freezed,}) {
  return _then(_CommunityFeedResponse(
items: null == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<Post>,nextCursor: freezed == nextCursor ? _self.nextCursor : nextCursor // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
