import 'package:flutter/foundation.dart' show immutable;

/// Represents the user's app settings.
@immutable
class AppSettings {
  /// Creates an [AppSettings] instance.
  const AppSettings({
    this.notificationsEnabled = true,
    this.emailNotifications = true,
    this.pushNotifications = true,
    this.profileVisibility = 'public',
    this.showLocation = true,
  });

  /// Whether notifications are enabled.
  final bool notificationsEnabled;

  /// Whether email notifications are enabled.
  final bool emailNotifications;

  /// Whether push notifications are enabled.
  final bool pushNotifications;

  /// Profile visibility (public, private, friends).
  final String profileVisibility;

  /// Whether to show location data.
  final bool showLocation;

  /// Creates [AppSettings] from JSON.
  factory AppSettings.fromJson(final Map<String, dynamic> json) {
    return AppSettings(
      notificationsEnabled: json['notificationsEnabled'] as bool? ?? true,
      emailNotifications: json['emailNotifications'] as bool? ?? true,
      pushNotifications: json['pushNotifications'] as bool? ?? true,
      profileVisibility: json['profileVisibility'] as String? ?? 'public',
      showLocation: json['showLocation'] as bool? ?? true,
    );
  }

  /// Converts to JSON map.
  Map<String, dynamic> toJson() => {
        'notificationsEnabled': notificationsEnabled,
        'emailNotifications': emailNotifications,
        'pushNotifications': pushNotifications,
        'profileVisibility': profileVisibility,
        'showLocation': showLocation,
      };
}
