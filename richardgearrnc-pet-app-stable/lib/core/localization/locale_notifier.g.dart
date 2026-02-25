// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'locale_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Provider for managing the app's locale.
///
/// Persists the user's language preference to SharedPreferences.
/// Falls back to the device locale if supported, otherwise defaults to English.
///
/// Usage:
/// ```dart
/// // Get current locale
/// final locale = ref.watch(localeNotifierProvider);
///
/// // Change locale
/// ref.read(localeNotifierProvider.notifier).setLocale(const Locale('es'));
///
/// // Reset to system locale
/// ref.read(localeNotifierProvider.notifier).resetToSystemLocale();
/// ```

@ProviderFor(LocaleNotifier)
final localeProvider = LocaleNotifierProvider._();

/// Provider for managing the app's locale.
///
/// Persists the user's language preference to SharedPreferences.
/// Falls back to the device locale if supported, otherwise defaults to English.
///
/// Usage:
/// ```dart
/// // Get current locale
/// final locale = ref.watch(localeNotifierProvider);
///
/// // Change locale
/// ref.read(localeNotifierProvider.notifier).setLocale(const Locale('es'));
///
/// // Reset to system locale
/// ref.read(localeNotifierProvider.notifier).resetToSystemLocale();
/// ```
final class LocaleNotifierProvider
    extends $NotifierProvider<LocaleNotifier, Locale?> {
  /// Provider for managing the app's locale.
  ///
  /// Persists the user's language preference to SharedPreferences.
  /// Falls back to the device locale if supported, otherwise defaults to English.
  ///
  /// Usage:
  /// ```dart
  /// // Get current locale
  /// final locale = ref.watch(localeNotifierProvider);
  ///
  /// // Change locale
  /// ref.read(localeNotifierProvider.notifier).setLocale(const Locale('es'));
  ///
  /// // Reset to system locale
  /// ref.read(localeNotifierProvider.notifier).resetToSystemLocale();
  /// ```
  LocaleNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'localeProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$localeNotifierHash();

  @$internal
  @override
  LocaleNotifier create() => LocaleNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(Locale? value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<Locale?>(value),
    );
  }
}

String _$localeNotifierHash() => r'edfb973ad6f4c45c2afbc92a536c6e8064bf9a39';

/// Provider for managing the app's locale.
///
/// Persists the user's language preference to SharedPreferences.
/// Falls back to the device locale if supported, otherwise defaults to English.
///
/// Usage:
/// ```dart
/// // Get current locale
/// final locale = ref.watch(localeNotifierProvider);
///
/// // Change locale
/// ref.read(localeNotifierProvider.notifier).setLocale(const Locale('es'));
///
/// // Reset to system locale
/// ref.read(localeNotifierProvider.notifier).resetToSystemLocale();
/// ```

abstract class _$LocaleNotifier extends $Notifier<Locale?> {
  Locale? build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<Locale?, Locale?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<Locale?, Locale?>,
              Locale?,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Provider for SharedPreferences.
/// This should be overridden in main.dart with the initialized instance.

@ProviderFor(sharedPreferences)
final sharedPreferencesProvider = SharedPreferencesProvider._();

/// Provider for SharedPreferences.
/// This should be overridden in main.dart with the initialized instance.

final class SharedPreferencesProvider
    extends
        $FunctionalProvider<
          SharedPreferences,
          SharedPreferences,
          SharedPreferences
        >
    with $Provider<SharedPreferences> {
  /// Provider for SharedPreferences.
  /// This should be overridden in main.dart with the initialized instance.
  SharedPreferencesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'sharedPreferencesProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$sharedPreferencesHash();

  @$internal
  @override
  $ProviderElement<SharedPreferences> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  SharedPreferences create(Ref ref) {
    return sharedPreferences(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SharedPreferences value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<SharedPreferences>(value),
    );
  }
}

String _$sharedPreferencesHash() => r'1bd093e8bf456de8637c2eab230f6bf63716eb48';
