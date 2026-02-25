import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/features/settings/domain/entities/app_settings.dart';

/// Repository interface for user settings.
abstract class SettingsRepository {
  /// Fetch the current user's settings.
  Future<Result<AppSettings>> fetchSettings();

  /// Update notification settings.
  Future<Result<AppSettings>> updateNotificationSettings(
    final Map<String, dynamic> data,
  );

  /// Update privacy settings.
  Future<Result<AppSettings>> updatePrivacySettings(
    final Map<String, dynamic> data,
  );
}
