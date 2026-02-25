import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/features/profile/domain/entities/user_profile.dart';

/// Repository interface for user profile operations.
abstract class ProfileRepository {
  /// Fetch the current user's profile.
  Future<Result<UserProfile>> fetchProfile();

  /// Update the current user's profile.
  ///
  /// [data] - Map of fields to update (fullName, phone, etc.)
  Future<Result<UserProfile>> updateProfile(final Map<String, dynamic> data);

  /// Change the current user's password.
  ///
  /// [currentPassword] - The current password
  /// [newPassword] - The new password
  Future<Result<void>> changePassword({
    required final String currentPassword,
    required final String newPassword,
  });

  /// Upload a new avatar image.
  ///
  /// [filePath] - Path to the image file on device
  Future<Result<String>> uploadAvatar(final String filePath);
}
