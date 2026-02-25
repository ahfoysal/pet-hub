import 'package:petzy_app/app/router/app_router.dart';

/// Enum representing different user roles in the application.
enum UserRole {
  /// Pet owner who books pet services
  petOwner,

  /// Pet sitter who provides pet sitting services
  petSitter,

  /// Pet school that offers training services
  petSchool,

  /// Pet hotel that provides boarding services
  petHotel,
  ;

  /// Get the user-friendly display name for the role.
  String get displayName => switch (this) {
    UserRole.petOwner => 'Pet Owner',
    UserRole.petSitter => 'Pet Sitter',
    UserRole.petSchool => 'Pet School',
    UserRole.petHotel => 'Pet Hotel',
  };

  /// Get the default route for this user role after signup/login.
  AppRoute get defaultRoute => AppRoute.home;

  /// Parse a string to UserRole.
  /// Returns null if the string doesn't match any role.
  ///
  /// Supports multiple formats:
  /// - camelCase: "petOwner", "petSitter", "petSchool", "petHotel"
  /// - UPPER_SNAKE_CASE: "PET_OWNER", "PET_SITTER", "PET_SCHOOL", "PET_HOTEL"
  static UserRole? fromString(final String? value) {
    if (value == null) return null;

    // Normalize the input to handle different formats
    final normalized = value.toLowerCase().replaceAll('_', '');

    try {
      return UserRole.values.firstWhere(
        (final role) => role.name.toLowerCase() == normalized,
      );
    } catch (e) {
      return null;
    }
  }

  /// Convert to a JSON-compatible string representation.
  String toJsonString() => name;
}
