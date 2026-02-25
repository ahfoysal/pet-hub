import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:petzy_app/features/pet_school/profile/domain/entities/address.dart';

part 'pet_school_profile.freezed.dart';
part 'pet_school_profile.g.dart';

/// Represents the profile status of a pet school.
enum ProfileStatus {
  @JsonValue('ACTIVE')
  active,
  @JsonValue('INACTIVE')
  inactive,
  @JsonValue('PENDING')
  pending,
}

/// Represents a pet school profile.
///
/// Uses Freezed for:
/// - Immutability
/// - Value equality
/// - copyWith
/// - JSON serialization
@freezed
abstract class PetSchoolProfile with _$PetSchoolProfile {
  /// Creates a [PetSchoolProfile] instance.
  const factory PetSchoolProfile({
    required final String id,
    @JsonKey(name: 'userId') required final String userId,
    required final String name,
    required final String email,
    required final String phone,
    required final String description,
    @Default([]) final List<String> images,
    @Default(ProfileStatus.active) final ProfileStatus status,
    @JsonKey(name: 'isVerified') @Default(false) final bool isVerified,
    @Default(0.0) final double rating,
    @JsonKey(name: 'reviewCount') @Default(0) final int reviewCount,
    final dynamic analytics,
    @JsonKey(name: 'reductionList')
    @Default([])
    final List<dynamic> reductionList,
    @JsonKey(name: 'createdAt') final DateTime? createdAt,
    @JsonKey(name: 'updatedAt') final DateTime? updatedAt,
    @Default([]) final List<Address> addresses,
  }) = _PetSchoolProfile;

  /// Creates a [PetSchoolProfile] instance from JSON.
  factory PetSchoolProfile.fromJson(final Map<String, dynamic> json) =>
      _$PetSchoolProfileFromJson(json);
}
