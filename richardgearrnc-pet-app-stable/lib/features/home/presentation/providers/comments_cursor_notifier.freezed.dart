// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'comments_cursor_notifier.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$CommentsCursorState {

 List<Comment> get comments; String? get nextCursor; bool get hasMore; bool get isLoading; String? get error;
/// Create a copy of CommentsCursorState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommentsCursorStateCopyWith<CommentsCursorState> get copyWith => _$CommentsCursorStateCopyWithImpl<CommentsCursorState>(this as CommentsCursorState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommentsCursorState&&const DeepCollectionEquality().equals(other.comments, comments)&&(identical(other.nextCursor, nextCursor) || other.nextCursor == nextCursor)&&(identical(other.hasMore, hasMore) || other.hasMore == hasMore)&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.error, error) || other.error == error));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(comments),nextCursor,hasMore,isLoading,error);

@override
String toString() {
  return 'CommentsCursorState(comments: $comments, nextCursor: $nextCursor, hasMore: $hasMore, isLoading: $isLoading, error: $error)';
}


}

/// @nodoc
abstract mixin class $CommentsCursorStateCopyWith<$Res>  {
  factory $CommentsCursorStateCopyWith(CommentsCursorState value, $Res Function(CommentsCursorState) _then) = _$CommentsCursorStateCopyWithImpl;
@useResult
$Res call({
 List<Comment> comments, String? nextCursor, bool hasMore, bool isLoading, String? error
});




}
/// @nodoc
class _$CommentsCursorStateCopyWithImpl<$Res>
    implements $CommentsCursorStateCopyWith<$Res> {
  _$CommentsCursorStateCopyWithImpl(this._self, this._then);

  final CommentsCursorState _self;
  final $Res Function(CommentsCursorState) _then;

/// Create a copy of CommentsCursorState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? comments = null,Object? nextCursor = freezed,Object? hasMore = null,Object? isLoading = null,Object? error = freezed,}) {
  return _then(_self.copyWith(
comments: null == comments ? _self.comments : comments // ignore: cast_nullable_to_non_nullable
as List<Comment>,nextCursor: freezed == nextCursor ? _self.nextCursor : nextCursor // ignore: cast_nullable_to_non_nullable
as String?,hasMore: null == hasMore ? _self.hasMore : hasMore // ignore: cast_nullable_to_non_nullable
as bool,isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [CommentsCursorState].
extension CommentsCursorStatePatterns on CommentsCursorState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommentsCursorState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommentsCursorState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommentsCursorState value)  $default,){
final _that = this;
switch (_that) {
case _CommentsCursorState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommentsCursorState value)?  $default,){
final _that = this;
switch (_that) {
case _CommentsCursorState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<Comment> comments,  String? nextCursor,  bool hasMore,  bool isLoading,  String? error)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommentsCursorState() when $default != null:
return $default(_that.comments,_that.nextCursor,_that.hasMore,_that.isLoading,_that.error);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<Comment> comments,  String? nextCursor,  bool hasMore,  bool isLoading,  String? error)  $default,) {final _that = this;
switch (_that) {
case _CommentsCursorState():
return $default(_that.comments,_that.nextCursor,_that.hasMore,_that.isLoading,_that.error);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<Comment> comments,  String? nextCursor,  bool hasMore,  bool isLoading,  String? error)?  $default,) {final _that = this;
switch (_that) {
case _CommentsCursorState() when $default != null:
return $default(_that.comments,_that.nextCursor,_that.hasMore,_that.isLoading,_that.error);case _:
  return null;

}
}

}

/// @nodoc


class _CommentsCursorState implements CommentsCursorState {
  const _CommentsCursorState({required final  List<Comment> comments, required this.nextCursor, required this.hasMore, required this.isLoading, required this.error}): _comments = comments;
  

 final  List<Comment> _comments;
@override List<Comment> get comments {
  if (_comments is EqualUnmodifiableListView) return _comments;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_comments);
}

@override final  String? nextCursor;
@override final  bool hasMore;
@override final  bool isLoading;
@override final  String? error;

/// Create a copy of CommentsCursorState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommentsCursorStateCopyWith<_CommentsCursorState> get copyWith => __$CommentsCursorStateCopyWithImpl<_CommentsCursorState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommentsCursorState&&const DeepCollectionEquality().equals(other._comments, _comments)&&(identical(other.nextCursor, nextCursor) || other.nextCursor == nextCursor)&&(identical(other.hasMore, hasMore) || other.hasMore == hasMore)&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.error, error) || other.error == error));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(_comments),nextCursor,hasMore,isLoading,error);

@override
String toString() {
  return 'CommentsCursorState(comments: $comments, nextCursor: $nextCursor, hasMore: $hasMore, isLoading: $isLoading, error: $error)';
}


}

/// @nodoc
abstract mixin class _$CommentsCursorStateCopyWith<$Res> implements $CommentsCursorStateCopyWith<$Res> {
  factory _$CommentsCursorStateCopyWith(_CommentsCursorState value, $Res Function(_CommentsCursorState) _then) = __$CommentsCursorStateCopyWithImpl;
@override @useResult
$Res call({
 List<Comment> comments, String? nextCursor, bool hasMore, bool isLoading, String? error
});




}
/// @nodoc
class __$CommentsCursorStateCopyWithImpl<$Res>
    implements _$CommentsCursorStateCopyWith<$Res> {
  __$CommentsCursorStateCopyWithImpl(this._self, this._then);

  final _CommentsCursorState _self;
  final $Res Function(_CommentsCursorState) _then;

/// Create a copy of CommentsCursorState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? comments = null,Object? nextCursor = freezed,Object? hasMore = null,Object? isLoading = null,Object? error = freezed,}) {
  return _then(_CommentsCursorState(
comments: null == comments ? _self._comments : comments // ignore: cast_nullable_to_non_nullable
as List<Comment>,nextCursor: freezed == nextCursor ? _self.nextCursor : nextCursor // ignore: cast_nullable_to_non_nullable
as String?,hasMore: null == hasMore ? _self.hasMore : hasMore // ignore: cast_nullable_to_non_nullable
as bool,isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
