import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/features/pet_market/data/repositories/pet_market_repository_remote.dart';

/// Provides an instance of [PetMarketRepository].
final petMarketRepositoryProvider = Provider<PetMarketRepository>((final ref) {
  final apiClient = ref.watch(apiClientProvider);
  return PetMarketRepositoryRemote(apiClient: apiClient);
});
