import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:petzy_app/core/enums/user_role.dart';

part 'user.freezed.dart';
part 'user.g.dart';

/// Represents an authenticated user.
///
/// Uses Freezed for:
/// - Immutability
/// - Value equality
/// - copyWith
/// - JSON serialization
///
/// JSON fields use snake_case (e.g., 'is_email_verified', 'created_at')
/// and are automatically mapped to camelCase Dart properties.
@freezed
abstract class User with _$User {
  /// Creates a [User] instance.
  const factory User({
    required final String id,
    required final String email,
    @JsonKey(name: 'fullName', defaultValue: null) final String? name,
    @JsonKey(name: 'image') final String? avatarUrl,
    @JsonKey(name: 'isEmailVerified')
    @Default(false)
    final bool isEmailVerified,
    @JsonKey(name: 'created_at') final DateTime? createdAt,
    @JsonKey(fromJson: _roleFromJson, toJson: _roleToJson)
    @Default(UserRole.petOwner)
    final UserRole role,
  }) = _User;

  /// Creates a [User] instance from JSON.
  factory User.fromJson(final Map<String, dynamic> json) =>
      _$UserFromJson(json);
}

/// Convert JSON string to [UserRole].
UserRole _roleFromJson(final dynamic value) {
  if (value is String) {
    return UserRole.fromString(value) ?? UserRole.petOwner;
  }
  return UserRole.petOwner;
}

/// Convert [UserRole] to JSON string.
String _roleToJson(final UserRole role) => role.toJsonString();
