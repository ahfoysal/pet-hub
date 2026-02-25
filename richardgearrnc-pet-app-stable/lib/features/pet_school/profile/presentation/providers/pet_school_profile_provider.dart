import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/features/pet_school/profile/data/repositories/pet_school_profile_repository_impl.dart';
import 'package:petzy_app/features/pet_school/profile/domain/entities/pet_school_profile.dart';

part 'pet_school_profile_provider.g.dart';

/// Provider for fetching the pet school profile.
///
/// This provider automatically handles loading, error, and data states
/// using Riverpod's AsyncValue.
@riverpod
Future<PetSchoolProfile> petSchoolProfile(final Ref ref) async {
  final repository = ref.watch(petSchoolProfileRepositoryProvider);

  final result = await repository.getProfile();

  return result.fold(
    onSuccess: (final profile) => profile,
    onFailure: (final error) => throw error,
  );
}

/// Provider for updating the pet school profile.
///
/// This is a family provider that takes update parameters.
@riverpod
Future<PetSchoolProfile> updatePetSchoolProfile(
  final Ref ref, {
  required final String name,
  required final String description,
  required final String phone,
  final List<String>? images,
}) async {
  final repository = ref.watch(petSchoolProfileRepositoryProvider);

  final result = await repository.updateProfile(
    name: name,
    description: description,
    phone: phone,
    images: images,
  );

  return result.fold(
    onSuccess: (final profile) {
      // Invalidate the profile provider to refresh the data
      ref.invalidate(petSchoolProfileProvider);
      return profile;
    },
    onFailure: (final error) => throw error,
  );
}
