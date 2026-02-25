import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_school/profile/domain/entities/pet_school_profile.dart';

/// Repository interface for pet school profile operations.
///
/// This defines the contract for fetching and updating pet school profiles.
abstract class PetSchoolProfileRepository {
  /// Fetches the pet school profile.
  ///
  /// Returns [Result.success] with [PetSchoolProfile] on success,
  /// or [Result.failure] with [NetworkException] on error.
  Future<Result<PetSchoolProfile>> getProfile();

  /// Updates the pet school profile.
  ///
  /// Returns [Result.success] with updated [PetSchoolProfile] on success,
  /// or [Result.failure] with [NetworkException] on error.
  Future<Result<PetSchoolProfile>> updateProfile({
    required final String name,
    required final String description,
    required final String phone,
    final List<String>? images,
  });
}
