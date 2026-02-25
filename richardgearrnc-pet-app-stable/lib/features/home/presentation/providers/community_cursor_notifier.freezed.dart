// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'community_cursor_notifier.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$CommunityCursorState {

 List<Post> get posts; String? get nextCursor; bool get hasMore; bool get isLoading; String? get error;
/// Create a copy of CommunityCursorState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommunityCursorStateCopyWith<CommunityCursorState> get copyWith => _$CommunityCursorStateCopyWithImpl<CommunityCursorState>(this as CommunityCursorState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommunityCursorState&&const DeepCollectionEquality().equals(other.posts, posts)&&(identical(other.nextCursor, nextCursor) || other.nextCursor == nextCursor)&&(identical(other.hasMore, hasMore) || other.hasMore == hasMore)&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.error, error) || other.error == error));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(posts),nextCursor,hasMore,isLoading,error);

@override
String toString() {
  return 'CommunityCursorState(posts: $posts, nextCursor: $nextCursor, hasMore: $hasMore, isLoading: $isLoading, error: $error)';
}


}

/// @nodoc
abstract mixin class $CommunityCursorStateCopyWith<$Res>  {
  factory $CommunityCursorStateCopyWith(CommunityCursorState value, $Res Function(CommunityCursorState) _then) = _$CommunityCursorStateCopyWithImpl;
@useResult
$Res call({
 List<Post> posts, String? nextCursor, bool hasMore, bool isLoading, String? error
});




}
/// @nodoc
class _$CommunityCursorStateCopyWithImpl<$Res>
    implements $CommunityCursorStateCopyWith<$Res> {
  _$CommunityCursorStateCopyWithImpl(this._self, this._then);

  final CommunityCursorState _self;
  final $Res Function(CommunityCursorState) _then;

/// Create a copy of CommunityCursorState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? posts = null,Object? nextCursor = freezed,Object? hasMore = null,Object? isLoading = null,Object? error = freezed,}) {
  return _then(_self.copyWith(
posts: null == posts ? _self.posts : posts // ignore: cast_nullable_to_non_nullable
as List<Post>,nextCursor: freezed == nextCursor ? _self.nextCursor : nextCursor // ignore: cast_nullable_to_non_nullable
as String?,hasMore: null == hasMore ? _self.hasMore : hasMore // ignore: cast_nullable_to_non_nullable
as bool,isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [CommunityCursorState].
extension CommunityCursorStatePatterns on CommunityCursorState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommunityCursorState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommunityCursorState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommunityCursorState value)  $default,){
final _that = this;
switch (_that) {
case _CommunityCursorState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommunityCursorState value)?  $default,){
final _that = this;
switch (_that) {
case _CommunityCursorState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<Post> posts,  String? nextCursor,  bool hasMore,  bool isLoading,  String? error)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommunityCursorState() when $default != null:
return $default(_that.posts,_that.nextCursor,_that.hasMore,_that.isLoading,_that.error);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<Post> posts,  String? nextCursor,  bool hasMore,  bool isLoading,  String? error)  $default,) {final _that = this;
switch (_that) {
case _CommunityCursorState():
return $default(_that.posts,_that.nextCursor,_that.hasMore,_that.isLoading,_that.error);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<Post> posts,  String? nextCursor,  bool hasMore,  bool isLoading,  String? error)?  $default,) {final _that = this;
switch (_that) {
case _CommunityCursorState() when $default != null:
return $default(_that.posts,_that.nextCursor,_that.hasMore,_that.isLoading,_that.error);case _:
  return null;

}
}

}

/// @nodoc


class _CommunityCursorState implements CommunityCursorState {
  const _CommunityCursorState({required final  List<Post> posts, required this.nextCursor, required this.hasMore, required this.isLoading, required this.error}): _posts = posts;
  

 final  List<Post> _posts;
@override List<Post> get posts {
  if (_posts is EqualUnmodifiableListView) return _posts;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_posts);
}

@override final  String? nextCursor;
@override final  bool hasMore;
@override final  bool isLoading;
@override final  String? error;

/// Create a copy of CommunityCursorState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommunityCursorStateCopyWith<_CommunityCursorState> get copyWith => __$CommunityCursorStateCopyWithImpl<_CommunityCursorState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommunityCursorState&&const DeepCollectionEquality().equals(other._posts, _posts)&&(identical(other.nextCursor, nextCursor) || other.nextCursor == nextCursor)&&(identical(other.hasMore, hasMore) || other.hasMore == hasMore)&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.error, error) || other.error == error));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(_posts),nextCursor,hasMore,isLoading,error);

@override
String toString() {
  return 'CommunityCursorState(posts: $posts, nextCursor: $nextCursor, hasMore: $hasMore, isLoading: $isLoading, error: $error)';
}


}

/// @nodoc
abstract mixin class _$CommunityCursorStateCopyWith<$Res> implements $CommunityCursorStateCopyWith<$Res> {
  factory _$CommunityCursorStateCopyWith(_CommunityCursorState value, $Res Function(_CommunityCursorState) _then) = __$CommunityCursorStateCopyWithImpl;
@override @useResult
$Res call({
 List<Post> posts, String? nextCursor, bool hasMore, bool isLoading, String? error
});




}
/// @nodoc
class __$CommunityCursorStateCopyWithImpl<$Res>
    implements _$CommunityCursorStateCopyWith<$Res> {
  __$CommunityCursorStateCopyWithImpl(this._self, this._then);

  final _CommunityCursorState _self;
  final $Res Function(_CommunityCursorState) _then;

/// Create a copy of CommunityCursorState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? posts = null,Object? nextCursor = freezed,Object? hasMore = null,Object? isLoading = null,Object? error = freezed,}) {
  return _then(_CommunityCursorState(
posts: null == posts ? _self._posts : posts // ignore: cast_nullable_to_non_nullable
as List<Post>,nextCursor: freezed == nextCursor ? _self.nextCursor : nextCursor // ignore: cast_nullable_to_non_nullable
as String?,hasMore: null == hasMore ? _self.hasMore : hasMore // ignore: cast_nullable_to_non_nullable
as bool,isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
