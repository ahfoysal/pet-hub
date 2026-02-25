import 'package:petzy_app/core/constants/api_endpoints.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/pet_sitter/domain/repositories/pet_sitter_repository.dart';

export 'package:petzy_app/features/pet_sitter/domain/repositories/pet_sitter_repository.dart';

/// Remote implementation of [PetSitterRepository].
class PetSitterRepositoryRemote implements PetSitterRepository {
  PetSitterRepositoryRemote({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<Result<List<PetSitterProfile>>> fetchSitterDirectory() async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        ApiEndpoints.petSitterDirectory,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final items = (data['data'] as List<dynamic>?)
                  ?.whereType<Map<String, dynamic>>()
                  .map(PetSitterProfile.fromJson)
                  .toList() ??
              [];
          return Success(items);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching sitter directory: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch sitter directory: $e'),
      );
    }
  }

  @override
  Future<Result<PetSitterProfile>> fetchSitterProfile(
    final String sitterId,
  ) async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        '${ApiEndpoints.petSitterDirectory}/$sitterId',
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final profileData = data['data'] as Map<String, dynamic>? ?? data;
          return Success(PetSitterProfile.fromJson(profileData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching sitter profile: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch sitter profile: $e'),
      );
    }
  }

  @override
  Future<Result<List<PetSitterService>>> fetchSitterServices(
    final String sitterId,
  ) async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        '${ApiEndpoints.petSitterServices}/$sitterId',
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final items = (data['data'] as List<dynamic>?)
                  ?.whereType<Map<String, dynamic>>()
                  .map(PetSitterService.fromJson)
                  .toList() ??
              [];
          return Success(items);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching sitter services: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch sitter services: $e'),
      );
    }
  }

  @override
  Future<Result<List<PetSitterPackage>>> fetchSitterPackages(
    final String sitterId,
  ) async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        '${ApiEndpoints.petSitterPackages}/$sitterId',
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final items = (data['data'] as List<dynamic>?)
                  ?.whereType<Map<String, dynamic>>()
                  .map(PetSitterPackage.fromJson)
                  .toList() ??
              [];
          return Success(items);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching sitter packages: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch sitter packages: $e'),
      );
    }
  }
}
