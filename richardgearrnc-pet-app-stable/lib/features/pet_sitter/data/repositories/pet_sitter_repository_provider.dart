import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/features/pet_sitter/data/repositories/pet_sitter_repository_remote.dart';

/// Provides an instance of [PetSitterRepository].
final petSitterRepositoryProvider = Provider<PetSitterRepository>((final ref) {
  final apiClient = ref.watch(apiClientProvider);
  return PetSitterRepositoryRemote(apiClient: apiClient);
});
