import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/core/google_signin/google_signin_service.dart';

part 'google_signin_provider.g.dart';

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
@Riverpod(keepAlive: true)
GoogleSignInService googleSignInService(final Ref ref) {
  return GoogleSignInService();
}
