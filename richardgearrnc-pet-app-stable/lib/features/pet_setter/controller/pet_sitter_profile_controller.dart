// ignore_for_file: public_member_api_docs

import 'package:get/get.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';

class PetSitterProfileController extends GetxController {
  PetSitterProfileController({required final PetSitterServicesApi api})
    : _api = api;

  final PetSitterServicesApi _api;

  final isLoading = false.obs;
  final error = RxnString();
  final profiles = <PetSitterDirectoryProfile>[].obs;
  bool _hasLoaded = false;

  PetSitterDirectoryProfile? get primaryProfile =>
      profiles.isNotEmpty ? profiles.first : null;

  Future<void> fetchProfiles({final bool force = false}) async {
    if (isLoading.value) return;
    if (!force && _hasLoaded) return;

    isLoading.value = true;
    error.value = null;

    try {
      final results = await _api.fetchPetSitterProfiles();
      profiles.assignAll(results);
      _hasLoaded = true;
    } catch (_) {
      error.value = 'Failed to load profile. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }
}
