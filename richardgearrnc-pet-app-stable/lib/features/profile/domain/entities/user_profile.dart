import 'package:flutter/foundation.dart' show immutable;

/// Represents a user's profile data.
@immutable
class UserProfile {
  /// Creates a [UserProfile] instance.
  const UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone,
    this.avatar,
    this.role,
    this.isVerified = false,
    this.createdAt,
  });

  /// User ID.
  final String id;

  /// Email address.
  final String email;

  /// Full name.
  final String fullName;

  /// Phone number (optional).
  final String? phone;

  /// Avatar URL (optional).
  final String? avatar;

  /// User role.
  final String? role;

  /// Whether the user's email is verified.
  final bool isVerified;

  /// Account creation date.
  final DateTime? createdAt;

  /// Creates a [UserProfile] from JSON.
  factory UserProfile.fromJson(final Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as String? ?? '',
      email: json['email'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      phone: json['phone'] as String?,
      avatar: json['avatar'] as String?,
      role: json['role'] as String?,
      isVerified: json['isVerified'] as bool? ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
    );
  }

  /// Converts this profile to a JSON map (for updates).
  Map<String, dynamic> toJson() {
    return {
      'fullName': fullName,
      if (phone != null) 'phone': phone,
    };
  }
}
