// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'signup_intent_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Holds the email of a user who needs to complete signup.
///
/// This is set when Google/Phone login returns that the user doesn't exist
/// in the system and needs to complete registration.
///
/// The router checks this provider to redirect to the signup page.

@ProviderFor(SignupIntent)
final signupIntentProvider = SignupIntentProvider._();

/// Holds the email of a user who needs to complete signup.
///
/// This is set when Google/Phone login returns that the user doesn't exist
/// in the system and needs to complete registration.
///
/// The router checks this provider to redirect to the signup page.
final class SignupIntentProvider
    extends $NotifierProvider<SignupIntent, String?> {
  /// Holds the email of a user who needs to complete signup.
  ///
  /// This is set when Google/Phone login returns that the user doesn't exist
  /// in the system and needs to complete registration.
  ///
  /// The router checks this provider to redirect to the signup page.
  SignupIntentProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'signupIntentProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$signupIntentHash();

  @$internal
  @override
  SignupIntent create() => SignupIntent();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(String? value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<String?>(value),
    );
  }
}

String _$signupIntentHash() => r'a66a050067a0a639f7076a2b50cfb83e659f1d1a';

/// Holds the email of a user who needs to complete signup.
///
/// This is set when Google/Phone login returns that the user doesn't exist
/// in the system and needs to complete registration.
///
/// The router checks this provider to redirect to the signup page.

abstract class _$SignupIntent extends $Notifier<String?> {
  String? build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<String?, String?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<String?, String?>,
              String?,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
