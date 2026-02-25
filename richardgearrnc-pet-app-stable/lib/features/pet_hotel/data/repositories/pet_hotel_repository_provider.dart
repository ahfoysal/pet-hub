import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/features/pet_hotel/data/repositories/pet_hotel_repository_remote.dart';

/// Provides an instance of [PetHotelRepository].
///
/// Replaces direct usage of [PetHotelProfileService].
final petHotelRepositoryProvider = Provider<PetHotelRepository>((final ref) {
  final apiClient = ref.watch(apiClientProvider);
  return PetHotelRepositoryRemote(apiClient: apiClient);
});
