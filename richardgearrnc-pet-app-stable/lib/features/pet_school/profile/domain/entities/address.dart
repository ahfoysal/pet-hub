import 'package:freezed_annotation/freezed_annotation.dart';

part 'address.freezed.dart';
part 'address.g.dart';

/// Represents an address for a pet school.
///
/// Uses Freezed for:
/// - Immutability
/// - Value equality
/// - copyWith
/// - JSON serialization
@freezed
abstract class Address with _$Address {
  /// Creates an [Address] instance.
  const factory Address({
    required final String id,
    @JsonKey(name: 'streetAddress') required final String streetAddress,
    required final String city,
    required final String country,
    @JsonKey(name: 'postalCode') required final String postalCode,
    @JsonKey(name: 'vendorProfileId') final String? vendorProfileId,
    @JsonKey(name: 'hotelProfileId') final String? hotelProfileId,
    @JsonKey(name: 'petSchoolProfileId') final String? petSchoolProfileId,
  }) = _Address;

  const Address._();

  /// Creates an [Address] instance from JSON.
  factory Address.fromJson(final Map<String, dynamic> json) =>
      _$AddressFromJson(json);
}
