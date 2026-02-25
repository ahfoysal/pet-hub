// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'address.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Address _$AddressFromJson(Map<String, dynamic> json) => _Address(
  id: json['id'] as String,
  streetAddress: json['streetAddress'] as String,
  city: json['city'] as String,
  country: json['country'] as String,
  postalCode: json['postalCode'] as String,
  vendorProfileId: json['vendorProfileId'] as String?,
  hotelProfileId: json['hotelProfileId'] as String?,
  petSchoolProfileId: json['petSchoolProfileId'] as String?,
);

Map<String, dynamic> _$AddressToJson(_Address instance) => <String, dynamic>{
  'id': instance.id,
  'streetAddress': instance.streetAddress,
  'city': instance.city,
  'country': instance.country,
  'postalCode': instance.postalCode,
  'vendorProfileId': instance.vendorProfileId,
  'hotelProfileId': instance.hotelProfileId,
  'petSchoolProfileId': instance.petSchoolProfileId,
};
