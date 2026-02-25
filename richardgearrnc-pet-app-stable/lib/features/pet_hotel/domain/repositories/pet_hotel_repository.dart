import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/features/pet_hotel/data/model/pet_hotel_profile_model.dart';

/// Repository interface for pet hotel discovery (consumer-facing).
abstract class PetHotelRepository {
  /// Fetch the pet hotel profile.
  Future<Result<PetHotelProfile>> fetchHotelProfile();
}
