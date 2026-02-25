import 'package:flutter/foundation.dart';

/// Runtime signals that influence startup behavior.
///
/// These are NOT states, only inputs to the [StartupStateResolver].
/// The resolver uses these signals to determine the current [StartupState].
///
/// Example:
/// ```dart
/// final signals = StartupSignals(
///   isAuthenticated: sessionState.isAuthenticated,
///   hasCompletedOnboarding: await storage.read(key: 'onboarding_completed') == 'true',
///   isInMaintenance: remoteConfig.getBool('maintenance_enabled'),
///   requiresForceUpdate: versionInfo.requiresForceUpdate,
///   isOnboardingEnabled: AppConfig.onboardingEnabled,
///   isAuthEnabled: AppConfig.authEnabled,
/// );
/// ```
@immutable
class StartupSignals {
  /// Creates a [StartupSignals] instance.
  const StartupSignals({
    required this.isAuthenticated,
    required this.hasCompletedOnboarding,
    required this.isInMaintenance,
    this.maintenanceMessage,
    this.requiresForceUpdate = false,
    this.currentVersion,
    this.minimumVersion,
    required this.isOnboardingEnabled,
    required this.isAuthEnabled,
  });

  /// Whether the user is currently authenticated.
  /// Usually determined by checking if a valid session exists.
  final bool isAuthenticated;

  /// Whether the user has completed the onboarding flow.
  /// Read from persistent storage.
  final bool hasCompletedOnboarding;

  /// Whether the app is in maintenance mode.
  /// Usually controlled by remote config/feature flags.
  final bool isInMaintenance;

  /// Optional maintenance message to display.
  final String? maintenanceMessage;

  /// Whether a force update is required.
  /// Determined by comparing app version to remote config minimum version.
  final bool requiresForceUpdate;

  /// Current app version.
  final String? currentVersion;

  /// Minimum required app version from remote config.
  final String? minimumVersion;

  /// Whether onboarding is enabled for this app.
  /// Static configuration from [AppConfig].
  final bool isOnboardingEnabled;

  /// Whether authentication is required for this app.
  /// Static configuration from [AppConfig].
  final bool isAuthEnabled;

  @override
  bool operator ==(final Object other) =>
      identical(this, other) ||
      other is StartupSignals &&
          runtimeType == other.runtimeType &&
          isAuthenticated == other.isAuthenticated &&
          hasCompletedOnboarding == other.hasCompletedOnboarding &&
          isInMaintenance == other.isInMaintenance &&
          maintenanceMessage == other.maintenanceMessage &&
          requiresForceUpdate == other.requiresForceUpdate &&
          currentVersion == other.currentVersion &&
          minimumVersion == other.minimumVersion &&
          isOnboardingEnabled == other.isOnboardingEnabled &&
          isAuthEnabled == other.isAuthEnabled;

  @override
  int get hashCode => Object.hash(
    isAuthenticated,
    hasCompletedOnboarding,
    isInMaintenance,
    maintenanceMessage,
    requiresForceUpdate,
    currentVersion,
    minimumVersion,
    isOnboardingEnabled,
    isAuthEnabled,
  );

  @override
  String toString() =>
      'StartupSignals('
      'isAuthenticated: $isAuthenticated, '
      'hasCompletedOnboarding: $hasCompletedOnboarding, '
      'isInMaintenance: $isInMaintenance, '
      'requiresForceUpdate: $requiresForceUpdate, '
      'isOnboardingEnabled: $isOnboardingEnabled, '
      'isAuthEnabled: $isAuthEnabled)';
}
