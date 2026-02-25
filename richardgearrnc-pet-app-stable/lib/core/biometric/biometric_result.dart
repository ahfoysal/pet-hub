/// Storage key for biometric authentication preference.
const biometricEnabledKey = 'biometric_enabled';

/// Result of a biometric authentication attempt.
enum BiometricResult {
  /// Authentication was successful.
  success,

  /// User cancelled the authentication.
  cancelled,

  /// Authentication failed (wrong fingerprint, face, etc.).
  failed,

  /// Biometric authentication is not available on this device.
  notAvailable,

  /// Biometric authentication is not set up on this device.
  notEnrolled,

  /// Device security is not set up (no passcode/PIN).
  noDeviceSecurity,

  /// Too many failed attempts, locked out.
  lockedOut,

  /// Permanent lockout (requires device unlock).
  permanentlyLockedOut,

  /// An unknown error occurred.
  error,
}

/// Extension for convenient result checking.
extension BiometricResultExtension on BiometricResult {
  /// Whether the authentication was successful.
  bool get isSuccess => this == BiometricResult.success;

  /// Whether the user cancelled the authentication.
  bool get isCancelled => this == BiometricResult.cancelled;

  /// Whether biometrics are unavailable or not set up.
  bool get isUnavailable =>
      this == BiometricResult.notAvailable ||
      this == BiometricResult.notEnrolled ||
      this == BiometricResult.noDeviceSecurity;

  /// Whether there was a lockout due to too many failed attempts.
  bool get isLockedOut =>
      this == BiometricResult.lockedOut ||
      this == BiometricResult.permanentlyLockedOut;

  /// Get a user-friendly message for this result.
  String get message => switch (this) {
    BiometricResult.success => 'Authentication successful',
    BiometricResult.cancelled => 'Authentication cancelled',
    BiometricResult.failed => 'Authentication failed',
    BiometricResult.notAvailable => 'Biometric authentication not available',
    BiometricResult.notEnrolled =>
      'No biometrics enrolled. Please set up fingerprint or face recognition.',
    BiometricResult.noDeviceSecurity =>
      'Device security not set up. Please set a PIN or password.',
    BiometricResult.lockedOut => 'Too many attempts. Please try again later.',
    BiometricResult.permanentlyLockedOut =>
      'Biometrics locked. Please unlock your device first.',
    BiometricResult.error => 'An error occurred. Please try again.',
  };
}
