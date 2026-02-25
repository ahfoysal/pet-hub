// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification_badge_settings.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Notifier for managing notification enabled state.
///
/// In a real app, this would be persisted to secure storage or user preferences.

@ProviderFor(NotificationsEnabled)
final notificationsEnabledProvider = NotificationsEnabledProvider._();

/// Notifier for managing notification enabled state.
///
/// In a real app, this would be persisted to secure storage or user preferences.
final class NotificationsEnabledProvider
    extends $NotifierProvider<NotificationsEnabled, bool> {
  /// Notifier for managing notification enabled state.
  ///
  /// In a real app, this would be persisted to secure storage or user preferences.
  NotificationsEnabledProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'notificationsEnabledProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$notificationsEnabledHash();

  @$internal
  @override
  NotificationsEnabled create() => NotificationsEnabled();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(bool value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<bool>(value),
    );
  }
}

String _$notificationsEnabledHash() =>
    r'25bfd8b4f41411b049a5f8169d18b00d36d5d1e8';

/// Notifier for managing notification enabled state.
///
/// In a real app, this would be persisted to secure storage or user preferences.

abstract class _$NotificationsEnabled extends $Notifier<bool> {
  bool build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<bool, bool>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<bool, bool>,
              bool,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
