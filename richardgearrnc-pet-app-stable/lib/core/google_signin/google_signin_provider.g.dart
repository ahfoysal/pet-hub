// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_signin_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Riverpod provider for [GoogleSignInService].
///
/// This provider:
/// - Ensures a single instance is reused across app lifecycle
/// - Keeps authentication logic out of UI
/// - Maintains Firebase and Google Sign-In state
/// - Uses Android build.gradle resValue for serverClientId configuration
///
/// Android Configuration:
/// - serverClientId is read from: android/app/build.gradle.kts
/// - Set via: resValue("string", "google_sign_in_server_client_id", "...")
/// - Must be your Web OAuth 2.0 Client ID from Google Cloud Console
///
/// iOS Configuration:
/// - Requires GoogleService-Info.plist to be added via Xcode
/// - GIDClientID is automatically configured from the .plist file
///
/// Usage:
/// ```dart
/// final token = await ref.read(googleSignInServiceProvider).signIn();
/// ```

@ProviderFor(googleSignInService)
final googleSignInServiceProvider = GoogleSignInServiceProvider._();

/// Riverpod provider for [GoogleSignInService].
///
/// This provider:
/// - Ensures a single instance is reused across app lifecycle
/// - Keeps authentication logic out of UI
/// - Maintains Firebase and Google Sign-In state
/// - Uses Android build.gradle resValue for serverClientId configuration
///
/// Android Configuration:
/// - serverClientId is read from: android/app/build.gradle.kts
/// - Set via: resValue("string", "google_sign_in_server_client_id", "...")
/// - Must be your Web OAuth 2.0 Client ID from Google Cloud Console
///
/// iOS Configuration:
/// - Requires GoogleService-Info.plist to be added via Xcode
/// - GIDClientID is automatically configured from the .plist file
///
/// Usage:
/// ```dart
/// final token = await ref.read(googleSignInServiceProvider).signIn();
/// ```

final class GoogleSignInServiceProvider
    extends
        $FunctionalProvider<
          GoogleSignInService,
          GoogleSignInService,
          GoogleSignInService
        >
    with $Provider<GoogleSignInService> {
  /// Riverpod provider for [GoogleSignInService].
  ///
  /// This provider:
  /// - Ensures a single instance is reused across app lifecycle
  /// - Keeps authentication logic out of UI
  /// - Maintains Firebase and Google Sign-In state
  /// - Uses Android build.gradle resValue for serverClientId configuration
  ///
  /// Android Configuration:
  /// - serverClientId is read from: android/app/build.gradle.kts
  /// - Set via: resValue("string", "google_sign_in_server_client_id", "...")
  /// - Must be your Web OAuth 2.0 Client ID from Google Cloud Console
  ///
  /// iOS Configuration:
  /// - Requires GoogleService-Info.plist to be added via Xcode
  /// - GIDClientID is automatically configured from the .plist file
  ///
  /// Usage:
  /// ```dart
  /// final token = await ref.read(googleSignInServiceProvider).signIn();
  /// ```
  GoogleSignInServiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'googleSignInServiceProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$googleSignInServiceHash();

  @$internal
  @override
  $ProviderElement<GoogleSignInService> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  GoogleSignInService create(Ref ref) {
    return googleSignInService(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(GoogleSignInService value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<GoogleSignInService>(value),
    );
  }
}

String _$googleSignInServiceHash() =>
    r'f023635d2e440c736d6f7afd6c63f553fdfa71a6';
