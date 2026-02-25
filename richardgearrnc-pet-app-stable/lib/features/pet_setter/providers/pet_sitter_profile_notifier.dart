import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/features/pet_setter/providers/pet_sitter_service_provider.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';

part 'pet_sitter_profile_notifier.g.dart';

/// Provides a list of pet sitter profiles (current user's profile).
///
/// Fetches from the API and caches the results. Use [invalidatePetSitterProfiles]
/// to refresh the data.
@riverpod
class PetSitterProfiles extends _$PetSitterProfiles {
  @override
  Future<List<PetSitterDirectoryProfile>> build() async {
    final api = ref.watch(petSitterServicesApiProvider);
    final profile = await api.fetchMyProfile();
    return profile != null ? [profile] : [];
  }

  /// Refresh the pet sitter profiles list.
  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final api = ref.read(petSitterServicesApiProvider);
      return api.fetchPetSitterProfiles();
    });
  }
}

/// Provides a single pet sitter service by ID.
@riverpod
Future<PetSitterServiceDetails?> petSitterServiceDetails(
  final Ref ref,
  final String serviceId,
) async {
  if (serviceId.isEmpty) return null;
  final api = ref.watch(petSitterServicesApiProvider);
  return api.fetchServiceDetails(serviceId);
}

/// Provides a list of pet sitter services (for current user or filtered list).
@riverpod
class PetSitterServices extends _$PetSitterServices {
  @override
  Future<List<PetSitterService>> build() async {
    final api = ref.watch(petSitterServicesApiProvider);
    return api.fetchMyServices();
  }

  /// Refresh the services list.
  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final api = ref.read(petSitterServicesApiProvider);
      return api.fetchMyServices();
    });
  }
}

/// Provides a list of pet sitter packages (for current user).
@riverpod
class PetSitterPackages extends _$PetSitterPackages {
  @override
  Future<List<PetSitterPackage>> build() async {
    final api = ref.watch(petSitterServicesApiProvider);
    return api.fetchMyPackages();
  }

  /// Refresh the packages list.
  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final api = ref.read(petSitterServicesApiProvider);
      return api.fetchMyPackages();
    });
  }
}

/// Provides a single package by ID.
@riverpod
Future<PetSitterPackageDetails?> petSitterPackageDetails(
  final Ref ref,
  final String packageId,
) async {
  if (packageId.isEmpty) return null;
  final api = ref.watch(petSitterServicesApiProvider);
  return api.fetchPackageDetails(packageId);
}
