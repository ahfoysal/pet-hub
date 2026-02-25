// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'address.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Address {

 String get id;@JsonKey(name: 'streetAddress') String get streetAddress; String get city; String get country;@JsonKey(name: 'postalCode') String get postalCode;@JsonKey(name: 'vendorProfileId') String? get vendorProfileId;@JsonKey(name: 'hotelProfileId') String? get hotelProfileId;@JsonKey(name: 'petSchoolProfileId') String? get petSchoolProfileId;
/// Create a copy of Address
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AddressCopyWith<Address> get copyWith => _$AddressCopyWithImpl<Address>(this as Address, _$identity);

  /// Serializes this Address to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Address&&(identical(other.id, id) || other.id == id)&&(identical(other.streetAddress, streetAddress) || other.streetAddress == streetAddress)&&(identical(other.city, city) || other.city == city)&&(identical(other.country, country) || other.country == country)&&(identical(other.postalCode, postalCode) || other.postalCode == postalCode)&&(identical(other.vendorProfileId, vendorProfileId) || other.vendorProfileId == vendorProfileId)&&(identical(other.hotelProfileId, hotelProfileId) || other.hotelProfileId == hotelProfileId)&&(identical(other.petSchoolProfileId, petSchoolProfileId) || other.petSchoolProfileId == petSchoolProfileId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,streetAddress,city,country,postalCode,vendorProfileId,hotelProfileId,petSchoolProfileId);

@override
String toString() {
  return 'Address(id: $id, streetAddress: $streetAddress, city: $city, country: $country, postalCode: $postalCode, vendorProfileId: $vendorProfileId, hotelProfileId: $hotelProfileId, petSchoolProfileId: $petSchoolProfileId)';
}


}

/// @nodoc
abstract mixin class $AddressCopyWith<$Res>  {
  factory $AddressCopyWith(Address value, $Res Function(Address) _then) = _$AddressCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'streetAddress') String streetAddress, String city, String country,@JsonKey(name: 'postalCode') String postalCode,@JsonKey(name: 'vendorProfileId') String? vendorProfileId,@JsonKey(name: 'hotelProfileId') String? hotelProfileId,@JsonKey(name: 'petSchoolProfileId') String? petSchoolProfileId
});




}
/// @nodoc
class _$AddressCopyWithImpl<$Res>
    implements $AddressCopyWith<$Res> {
  _$AddressCopyWithImpl(this._self, this._then);

  final Address _self;
  final $Res Function(Address) _then;

/// Create a copy of Address
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? streetAddress = null,Object? city = null,Object? country = null,Object? postalCode = null,Object? vendorProfileId = freezed,Object? hotelProfileId = freezed,Object? petSchoolProfileId = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,streetAddress: null == streetAddress ? _self.streetAddress : streetAddress // ignore: cast_nullable_to_non_nullable
as String,city: null == city ? _self.city : city // ignore: cast_nullable_to_non_nullable
as String,country: null == country ? _self.country : country // ignore: cast_nullable_to_non_nullable
as String,postalCode: null == postalCode ? _self.postalCode : postalCode // ignore: cast_nullable_to_non_nullable
as String,vendorProfileId: freezed == vendorProfileId ? _self.vendorProfileId : vendorProfileId // ignore: cast_nullable_to_non_nullable
as String?,hotelProfileId: freezed == hotelProfileId ? _self.hotelProfileId : hotelProfileId // ignore: cast_nullable_to_non_nullable
as String?,petSchoolProfileId: freezed == petSchoolProfileId ? _self.petSchoolProfileId : petSchoolProfileId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [Address].
extension AddressPatterns on Address {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Address value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Address() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Address value)  $default,){
final _that = this;
switch (_that) {
case _Address():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Address value)?  $default,){
final _that = this;
switch (_that) {
case _Address() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'streetAddress')  String streetAddress,  String city,  String country, @JsonKey(name: 'postalCode')  String postalCode, @JsonKey(name: 'vendorProfileId')  String? vendorProfileId, @JsonKey(name: 'hotelProfileId')  String? hotelProfileId, @JsonKey(name: 'petSchoolProfileId')  String? petSchoolProfileId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Address() when $default != null:
return $default(_that.id,_that.streetAddress,_that.city,_that.country,_that.postalCode,_that.vendorProfileId,_that.hotelProfileId,_that.petSchoolProfileId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'streetAddress')  String streetAddress,  String city,  String country, @JsonKey(name: 'postalCode')  String postalCode, @JsonKey(name: 'vendorProfileId')  String? vendorProfileId, @JsonKey(name: 'hotelProfileId')  String? hotelProfileId, @JsonKey(name: 'petSchoolProfileId')  String? petSchoolProfileId)  $default,) {final _that = this;
switch (_that) {
case _Address():
return $default(_that.id,_that.streetAddress,_that.city,_that.country,_that.postalCode,_that.vendorProfileId,_that.hotelProfileId,_that.petSchoolProfileId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'streetAddress')  String streetAddress,  String city,  String country, @JsonKey(name: 'postalCode')  String postalCode, @JsonKey(name: 'vendorProfileId')  String? vendorProfileId, @JsonKey(name: 'hotelProfileId')  String? hotelProfileId, @JsonKey(name: 'petSchoolProfileId')  String? petSchoolProfileId)?  $default,) {final _that = this;
switch (_that) {
case _Address() when $default != null:
return $default(_that.id,_that.streetAddress,_that.city,_that.country,_that.postalCode,_that.vendorProfileId,_that.hotelProfileId,_that.petSchoolProfileId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Address extends Address {
  const _Address({required this.id, @JsonKey(name: 'streetAddress') required this.streetAddress, required this.city, required this.country, @JsonKey(name: 'postalCode') required this.postalCode, @JsonKey(name: 'vendorProfileId') this.vendorProfileId, @JsonKey(name: 'hotelProfileId') this.hotelProfileId, @JsonKey(name: 'petSchoolProfileId') this.petSchoolProfileId}): super._();
  factory _Address.fromJson(Map<String, dynamic> json) => _$AddressFromJson(json);

@override final  String id;
@override@JsonKey(name: 'streetAddress') final  String streetAddress;
@override final  String city;
@override final  String country;
@override@JsonKey(name: 'postalCode') final  String postalCode;
@override@JsonKey(name: 'vendorProfileId') final  String? vendorProfileId;
@override@JsonKey(name: 'hotelProfileId') final  String? hotelProfileId;
@override@JsonKey(name: 'petSchoolProfileId') final  String? petSchoolProfileId;

/// Create a copy of Address
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AddressCopyWith<_Address> get copyWith => __$AddressCopyWithImpl<_Address>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AddressToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Address&&(identical(other.id, id) || other.id == id)&&(identical(other.streetAddress, streetAddress) || other.streetAddress == streetAddress)&&(identical(other.city, city) || other.city == city)&&(identical(other.country, country) || other.country == country)&&(identical(other.postalCode, postalCode) || other.postalCode == postalCode)&&(identical(other.vendorProfileId, vendorProfileId) || other.vendorProfileId == vendorProfileId)&&(identical(other.hotelProfileId, hotelProfileId) || other.hotelProfileId == hotelProfileId)&&(identical(other.petSchoolProfileId, petSchoolProfileId) || other.petSchoolProfileId == petSchoolProfileId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,streetAddress,city,country,postalCode,vendorProfileId,hotelProfileId,petSchoolProfileId);

@override
String toString() {
  return 'Address(id: $id, streetAddress: $streetAddress, city: $city, country: $country, postalCode: $postalCode, vendorProfileId: $vendorProfileId, hotelProfileId: $hotelProfileId, petSchoolProfileId: $petSchoolProfileId)';
}


}

/// @nodoc
abstract mixin class _$AddressCopyWith<$Res> implements $AddressCopyWith<$Res> {
  factory _$AddressCopyWith(_Address value, $Res Function(_Address) _then) = __$AddressCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'streetAddress') String streetAddress, String city, String country,@JsonKey(name: 'postalCode') String postalCode,@JsonKey(name: 'vendorProfileId') String? vendorProfileId,@JsonKey(name: 'hotelProfileId') String? hotelProfileId,@JsonKey(name: 'petSchoolProfileId') String? petSchoolProfileId
});




}
/// @nodoc
class __$AddressCopyWithImpl<$Res>
    implements _$AddressCopyWith<$Res> {
  __$AddressCopyWithImpl(this._self, this._then);

  final _Address _self;
  final $Res Function(_Address) _then;

/// Create a copy of Address
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? streetAddress = null,Object? city = null,Object? country = null,Object? postalCode = null,Object? vendorProfileId = freezed,Object? hotelProfileId = freezed,Object? petSchoolProfileId = freezed,}) {
  return _then(_Address(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,streetAddress: null == streetAddress ? _self.streetAddress : streetAddress // ignore: cast_nullable_to_non_nullable
as String,city: null == city ? _self.city : city // ignore: cast_nullable_to_non_nullable
as String,country: null == country ? _self.country : country // ignore: cast_nullable_to_non_nullable
as String,postalCode: null == postalCode ? _self.postalCode : postalCode // ignore: cast_nullable_to_non_nullable
as String,vendorProfileId: freezed == vendorProfileId ? _self.vendorProfileId : vendorProfileId // ignore: cast_nullable_to_non_nullable
as String?,hotelProfileId: freezed == hotelProfileId ? _self.hotelProfileId : hotelProfileId // ignore: cast_nullable_to_non_nullable
as String?,petSchoolProfileId: freezed == petSchoolProfileId ? _self.petSchoolProfileId : petSchoolProfileId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
