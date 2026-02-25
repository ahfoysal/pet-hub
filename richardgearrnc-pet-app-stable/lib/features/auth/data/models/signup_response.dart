import 'package:petzy_app/core/enums/user_role.dart';

/// Response model for signup endpoints.
///
/// Expected from POST /auth/pet-owner-signup:
/// ```json
/// {
///   "success": true,
///   "message": "User created successfully",
///   "data": {
///     "role": "PET_OWNER",
///     "accessToken": "...",
///     "refreshToken": "..."
///   }
/// }
/// ```
class SignupResponse {
  /// Creates a [SignupResponse] instance.
  const SignupResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  /// Whether the API request was successful.
  final bool success;

  /// Message from the API.
  final String message;

  /// Data payload with role and tokens.
  final SignupData data;

  /// Creates a [SignupResponse] from JSON.
  factory SignupResponse.fromJson(final Map<String, dynamic> json) {
    return SignupResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      data: SignupData.fromJson(
        json['data'] as Map<String, dynamic>? ?? {},
      ),
    );
  }

  /// Converts to JSON.
  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': data.toJson(),
    };
  }
}

/// Data payload within signup response.
class SignupData {
  /// Creates a [SignupData] instance.
  const SignupData({
    required this.role,
    required this.accessToken,
    required this.refreshToken,
  });

  /// User role (PET_OWNER, PET_SITTER, etc.)
  final UserRole role;

  /// Access token for authentication.
  final String accessToken;

  /// Refresh token for renewing access.
  final String refreshToken;

  /// Creates a [SignupData] from JSON.
  factory SignupData.fromJson(final Map<String, dynamic> json) {
    final roleStr = json['role'] as String?;
    final role = roleStr != null
        ? (UserRole.fromString(roleStr) ?? UserRole.petOwner)
        : UserRole.petOwner;

    return SignupData(
      role: role,
      accessToken: json['accessToken'] as String? ?? '',
      refreshToken: json['refreshToken'] as String? ?? '',
    );
  }

  /// Converts to JSON.
  Map<String, dynamic> toJson() {
    return {
      'role': role.toJsonString(),
      'accessToken': accessToken,
      'refreshToken': refreshToken,
    };
  }
}
