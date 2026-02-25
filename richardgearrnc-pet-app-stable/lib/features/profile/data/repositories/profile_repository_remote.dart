import 'package:dio/dio.dart';
import 'package:petzy_app/core/constants/api_endpoints.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/profile/domain/entities/user_profile.dart';
import 'package:petzy_app/features/profile/domain/repositories/profile_repository.dart';

export 'package:petzy_app/features/profile/domain/repositories/profile_repository.dart';

/// Remote implementation of [ProfileRepository].
///
/// Handles API calls for user profile CRUD operations.
class ProfileRepositoryRemote implements ProfileRepository {
  /// Creates a [ProfileRepositoryRemote] instance.
  ProfileRepositoryRemote({required this.apiClient});

  /// API client for making requests.
  final ApiClient apiClient;

  @override
  Future<Result<UserProfile>> fetchProfile() async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        ApiEndpoints.currentUser,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final profileData = data['data'] as Map<String, dynamic>? ?? data;
          return Success(UserProfile.fromJson(profileData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching profile: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch profile: $e'),
      );
    }
  }

  @override
  Future<Result<UserProfile>> updateProfile(
    final Map<String, dynamic> data,
  ) async {
    try {
      final response = await apiClient.patch<Map<String, dynamic>>(
        ApiEndpoints.updateProfile,
        data: data,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final responseData) {
          final profileData =
              responseData['data'] as Map<String, dynamic>? ?? responseData;
          return Success(UserProfile.fromJson(profileData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error updating profile: $e');
      return Failure(
        UnexpectedException(message: 'Failed to update profile: $e'),
      );
    }
  }

  @override
  Future<Result<void>> changePassword({
    required final String currentPassword,
    required final String newPassword,
  }) async {
    try {
      final response = await apiClient.patch<Map<String, dynamic>>(
        ApiEndpoints.changePassword,
        data: {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        },
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final _) => const Success(null),
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error changing password: $e');
      return Failure(
        UnexpectedException(message: 'Failed to change password: $e'),
      );
    }
  }

  @override
  Future<Result<String>> uploadAvatar(final String filePath) async {
    try {
      final formData = FormData.fromMap({
        'avatar': await MultipartFile.fromFile(filePath),
      });

      final response = await apiClient.post<Map<String, dynamic>>(
        ApiEndpoints.uploadAvatar,
        data: formData,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final avatarUrl = data['data']?['avatar'] as String? ?? '';
          return Success(avatarUrl);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error uploading avatar: $e');
      return Failure(
        UnexpectedException(message: 'Failed to upload avatar: $e'),
      );
    }
  }
}
