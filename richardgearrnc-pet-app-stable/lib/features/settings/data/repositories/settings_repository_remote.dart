import 'package:petzy_app/core/constants/api_endpoints.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/settings/domain/entities/app_settings.dart';
import 'package:petzy_app/features/settings/domain/repositories/settings_repository.dart';

export 'package:petzy_app/features/settings/domain/repositories/settings_repository.dart';

/// Remote implementation of [SettingsRepository].
class SettingsRepositoryRemote implements SettingsRepository {
  /// Creates a [SettingsRepositoryRemote] instance.
  SettingsRepositoryRemote({required this.apiClient});

  /// API client for making requests.
  final ApiClient apiClient;

  @override
  Future<Result<AppSettings>> fetchSettings() async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        ApiEndpoints.settings,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final settingsData = data['data'] as Map<String, dynamic>? ?? data;
          return Success(AppSettings.fromJson(settingsData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching settings: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch settings: $e'),
      );
    }
  }

  @override
  Future<Result<AppSettings>> updateNotificationSettings(
    final Map<String, dynamic> data,
  ) async {
    try {
      final response = await apiClient.patch<Map<String, dynamic>>(
        ApiEndpoints.notificationSettings,
        data: data,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final responseData) {
          final settingsData =
              responseData['data'] as Map<String, dynamic>? ?? responseData;
          return Success(AppSettings.fromJson(settingsData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error updating notification settings: $e');
      return Failure(
        UnexpectedException(
          message: 'Failed to update notification settings: $e',
        ),
      );
    }
  }

  @override
  Future<Result<AppSettings>> updatePrivacySettings(
    final Map<String, dynamic> data,
  ) async {
    try {
      final response = await apiClient.patch<Map<String, dynamic>>(
        ApiEndpoints.privacySettings,
        data: data,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final responseData) {
          final settingsData =
              responseData['data'] as Map<String, dynamic>? ?? responseData;
          return Success(AppSettings.fromJson(settingsData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error updating privacy settings: $e');
      return Failure(
        UnexpectedException(
          message: 'Failed to update privacy settings: $e',
        ),
      );
    }
  }
}
