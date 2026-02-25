/// Remote Config key constants.
///
/// Define all your Remote Config keys here for type safety and consistency.
///
/// ## Naming Convention:
/// - Use snake_case for Firebase Console compatibility
/// - Group related keys with common prefixes
/// - Keep names descriptive but concise
///
/// ## Usage:
///
/// ```dart
/// final isEnabled = remoteConfig.getBool(RemoteConfigKeys.newFeatureEnabled);
/// ```
abstract final class RemoteConfigKeys {
  // ─────────────────────────────────────────────────────────────────────────────
  // MAINTENANCE & FORCE UPDATE
  // ─────────────────────────────────────────────────────────────────────────────

  /// Whether the app is in maintenance mode.
  /// Show a maintenance screen when true.
  static const maintenanceMode = 'maintenance_mode';

  /// Whether to force users to update.
  static const forceUpdateEnabled = 'force_update_enabled';

  /// Minimum required app version (e.g., "1.2.0").
  static const minAppVersion = 'min_app_version';

  /// Custom message for the update dialog.
  static const updateMessage = 'update_message';

  /// URL to redirect users for update.
  static const updateUrl = 'update_url';

  // ─────────────────────────────────────────────────────────────────────────────
  // FEATURE FLAGS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Whether a new feature is enabled.
  static const newFeatureEnabled = 'new_feature_enabled';

  /// Whether beta features are enabled.
  static const betaFeaturesEnabled = 'beta_features_enabled';

  /// Whether dark mode is available.
  static const darkModeEnabled = 'dark_mode_enabled';

  /// Whether push notifications are enabled.
  static const pushNotificationsEnabled = 'push_notifications_enabled';

  /// Whether in-app purchases are enabled.
  static const iapEnabled = 'iap_enabled';

  /// Whether social login is enabled.
  static const socialLoginEnabled = 'social_login_enabled';

  /// Whether biometric login is enabled.
  static const biometricLoginEnabled = 'biometric_login_enabled';

  // ─────────────────────────────────────────────────────────────────────────────
  // API CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────

  /// API version (e.g., "v1", "v2").
  static const apiVersion = 'api_version';

  /// API base URL (for A/B testing backends).
  static const apiBaseUrl = 'api_base_url';

  /// Maximum number of API retries.
  static const maxApiRetries = 'max_api_retries';

  /// API timeout in seconds.
  static const apiTimeoutSeconds = 'api_timeout_seconds';

  // ─────────────────────────────────────────────────────────────────────────────
  // UI CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────

  /// Whether to show ads.
  static const showAds = 'show_ads';

  /// Whether to show a promotional banner.
  static const showPromotion = 'show_promotion';

  /// Promotional message text.
  static const promotionMessage = 'promotion_message';

  /// Promotional URL.
  static const promotionUrl = 'promotion_url';

  /// Home screen layout variant (for A/B testing).
  static const homeLayoutVariant = 'home_layout_variant';

  /// Onboarding flow variant.
  static const onboardingVariant = 'onboarding_variant';

  // ─────────────────────────────────────────────────────────────────────────────
  // FEATURE LIMITS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Maximum upload file size in MB.
  static const maxUploadSizeMb = 'max_upload_size_mb';

  /// Maximum items per page for pagination.
  static const maxItemsPerPage = 'max_items_per_page';

  /// Maximum search results to show.
  static const maxSearchResults = 'max_search_results';

  /// Free tier item limit.
  static const freeTierItemLimit = 'free_tier_item_limit';

  // ─────────────────────────────────────────────────────────────────────────────
  // A/B TESTING
  // ─────────────────────────────────────────────────────────────────────────────

  /// Experiment group (e.g., "control", "variant_a", "variant_b").
  static const experimentGroup = 'experiment_group';

  /// Checkout flow variant.
  static const checkoutFlowVariant = 'checkout_flow_variant';

  /// Pricing experiment variant.
  static const pricingVariant = 'pricing_variant';

  // ─────────────────────────────────────────────────────────────────────────────
  // SUPPORT & LEGAL
  // ─────────────────────────────────────────────────────────────────────────────

  /// Support email address.
  static const supportEmail = 'support_email';

  /// Support URL.
  static const supportUrl = 'support_url';

  /// Privacy policy URL.
  static const privacyPolicyUrl = 'privacy_policy_url';

  /// Terms of service URL.
  static const termsOfServiceUrl = 'terms_of_service_url';

  // ─────────────────────────────────────────────────────────────────────────────
  // CACHE CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────

  /// Cache duration in minutes.
  static const cacheDurationMinutes = 'cache_duration_minutes';

  /// Whether offline mode is enabled.
  static const offlineModeEnabled = 'offline_mode_enabled';
}
