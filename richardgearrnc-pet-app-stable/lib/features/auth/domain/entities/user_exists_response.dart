import 'package:petzy_app/core/enums/user_role.dart';
import 'package:petzy_app/features/auth/domain/entities/user.dart';

/// Response model for user existence check API.
///
/// Expected API response format when user DOES NOT exist:
/// ```json
/// {
///   "success": true,
///   "message": "User not found",
///   "data": {
///     "isUserExists": false
///   }
/// }
/// ```
///
/// Expected API response format when user EXISTS:
/// ```json
/// {
///   "success": true,
///   "message": "User found",
///   "data": {
///     "isUserExists": true,
///     "role": "petOwner",
///     "accessToken": "...",
///     "refreshToken": "..."
///   }
/// }
/// ```
class UserExistsResponse {
  /// Creates a [UserExistsResponse] instance.
  const UserExistsResponse({
    required this.success,
    required this.message,
    required this.isUserExists,
    this.user,
    this.accessToken,
    this.refreshToken,
  });

  /// Whether the API request was successful.
  final bool success;

  /// Message from the API.
  final String message;

  /// Whether the user exists in the system.
  final bool isUserExists;

  /// User data (only present if user exists).
  final User? user;

  /// Access token (only present if user exists).
  final String? accessToken;

  /// Refresh token (only present if user exists).
  final String? refreshToken;

  /// Creates a [UserExistsResponse] from JSON.
  factory UserExistsResponse.fromJson(final Map<String, dynamic> json) {
    final data = json['data'] as Map<String, dynamic>? ?? {};
    final isUserExists = data['isUserExists'] as bool? ?? false;

    // If user exists, parse user data and tokens
    User? user;
    String? accessToken;
    String? refreshToken;

    if (isUserExists) {
      // Try to get full user object first
      final userData = data['user'] as Map<String, dynamic>?;

      if (userData != null) {
        // Full user data available
        user = User.fromJson(userData);
      } else {
        // Fallback: construct minimal user from available fields
        final role = data['role'] as String?;
        final id =
            data['id'] as String? ?? data['userId'] as String? ?? 'temp_id';
        final email = data['email'] as String? ?? 'temp@email.com';

        user = User(
          id: id,
          email: email,
          role: role != null
              ? (UserRole.fromString(role) ?? UserRole.petOwner)
              : UserRole.petOwner,
        );
      }

      accessToken = data['accessToken'] as String?;
      refreshToken = data['refreshToken'] as String?;
    }

    return UserExistsResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      isUserExists: isUserExists,
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
  }

  /// Converts this [UserExistsResponse] to JSON.
  Map<String, dynamic> toJson() {
    final data = <String, dynamic>{
      'isUserExists': isUserExists,
    };

    if (user != null) {
      data['role'] = user!.role.name;
    }
    if (accessToken != null) {
      data['accessToken'] = accessToken;
    }
    if (refreshToken != null) {
      data['refreshToken'] = refreshToken;
    }

    return {
      'success': success,
      'message': message,
      'data': data,
    };
  }
}
