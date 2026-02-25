import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_school/profile/domain/entities/pet_school_profile.dart';
import 'package:petzy_app/features/pet_school/profile/domain/repositories/pet_school_profile_repository.dart';

/// Repository implementation for pet school profile operations.
///
/// Currently uses demo data but can be extended to use real API endpoints.
class PetSchoolProfileRepositoryImpl implements PetSchoolProfileRepository {
  /// Creates a [PetSchoolProfileRepositoryImpl] instance.
  const PetSchoolProfileRepositoryImpl({
    required this.apiClient,
  });

  /// API client for making network requests.
  final ApiClient apiClient;

  @override
  Future<Result<PetSchoolProfile>> getProfile() async {
    try {
      // Call the actual API endpoint
      final response = await apiClient.get<Map<String, dynamic>>(
        '/pet-school/profile',
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.map((final data) {
        return PetSchoolProfile.fromJson(
          data['data'] as Map<String, dynamic>,
        );
      });
    } catch (e, stack) {
      return Failure(
        NetworkException(
          message: e.toString(),
          stackTrace: stack,
        ),
      );
    }
  }

  @override
  Future<Result<PetSchoolProfile>> updateProfile({
    required final String name,
    required final String description,
    required final String phone,
    final List<String>? images,
  }) async {
    try {
      // TODO: Implement actual API call when endpoint is ready
      final response = await apiClient.put<Map<String, dynamic>>(
        '/pet-school/profile',
        data: {
          'name': name,
          'description': description,
          'phone': phone,
          if (images != null) 'images': images,
        },
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.map((final data) {
        return PetSchoolProfile.fromJson(
          data['data'] as Map<String, dynamic>,
        );
      });
    } catch (e, stack) {
      return Failure(
        NetworkException(
          message: e.toString(),
          stackTrace: stack,
        ),
      );
    }
  }
}

/// Provider for [PetSchoolProfileRepository].
final petSchoolProfileRepositoryProvider = Provider<PetSchoolProfileRepository>(
  (final ref) {
    return PetSchoolProfileRepositoryImpl(
      apiClient: ref.watch(apiClientProvider),
    );
  },
);
