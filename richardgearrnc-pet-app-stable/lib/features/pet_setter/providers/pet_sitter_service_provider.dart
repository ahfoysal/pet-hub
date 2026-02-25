import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/core/network/dio_provider.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';

part 'pet_sitter_service_provider.g.dart';

/// Provider for PetSitterServicesApi.
///
/// Returns an authenticated API client that uses the configured Dio instance
/// with auth interceptors and caching.
@riverpod
PetSitterServicesApi petSitterServicesApi(final Ref ref) {
  final dioClient = ref.watch(dioProvider);
  return PetSitterServicesApi(dio: dioClient);
}
