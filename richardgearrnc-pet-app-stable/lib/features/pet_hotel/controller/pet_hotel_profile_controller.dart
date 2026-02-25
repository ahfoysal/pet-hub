// lib/controllers/pet_hotel_profile_controller.dart

import 'package:get/get.dart';
import 'package:petzy_app/features/pet_hotel/data/model/pet_hotel_profile_model.dart';
import 'package:petzy_app/features/pet_hotel/data/service/pet_hotel_profile_service.dart';

class PetHotelProfileController extends GetxController {
  final PetHotelProfileService _service = PetHotelProfileService();

  final Rx<PetHotelProfile?> _profile = Rx<PetHotelProfile?>(null);
  final RxBool _loading = false.obs;
  final RxString _error = ''.obs;

  PetHotelProfile? get profile => _profile.value;
  bool get loading => _loading.value;
  String get error => _error.value;

  Future<void> fetchProfile() async {
    try {
      _loading.value = true;
      _error.value = '';

      final result = await _service.getProfile();
      if (result.success && result.data != null) {
        _profile.value = result.data;
      } else {
        _error.value = result.message;
      }
    } catch (e) {
      _error.value = e.toString();
    } finally {
      _loading.value = false;
    }
  }
}
