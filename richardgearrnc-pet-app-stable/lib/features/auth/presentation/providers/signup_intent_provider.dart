import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'signup_intent_provider.g.dart';

/// Holds the email of a user who needs to complete signup.
///
/// This is set when Google/Phone login returns that the user doesn't exist
/// in the system and needs to complete registration.
///
/// The router checks this provider to redirect to the signup page.
@Riverpod(keepAlive: true)
class SignupIntent extends _$SignupIntent {
  @override
  String? build() => null;

  /// Set the email for signup when user doesn't exist
  void setEmail(final String email) {
    state = email;
  }

  /// Clear the signup intent after signup is complete or cancelled
  void clear() {
    state = null;
  }
}
