import 'package:petzy_app/core/constants/api_endpoints.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/pet_hotel/data/model/pet_hotel_profile_model.dart';
import 'package:petzy_app/features/pet_hotel/domain/repositories/pet_hotel_repository.dart';

export 'package:petzy_app/features/pet_hotel/domain/repositories/pet_hotel_repository.dart';

/// Remote implementation of [PetHotelRepository].
///
/// Replaces the legacy [PetHotelProfileService] which used raw http
/// and a hardcoded ngrok URL.
class PetHotelRepositoryRemote implements PetHotelRepository {
  PetHotelRepositoryRemote({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<Result<PetHotelProfile>> fetchHotelProfile() async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        ApiEndpoints.petHotelProfile,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final profileData = data['data'] as Map<String, dynamic>? ?? data;
          return Success(PetHotelProfile.fromJson(profileData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching hotel profile: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch hotel profile: $e'),
      );
    }
  }
}
