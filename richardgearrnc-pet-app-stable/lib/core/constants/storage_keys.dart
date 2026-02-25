/// Storage keys for secure storage and shared preferences.
///
/// Centralizes all storage keys to avoid hardcoding strings
/// and ensure consistency across the app.
abstract class StorageKeys {
  // ─────────────────────────────────────────────────────────────────────────────
  // AUTHENTICATION
  // ─────────────────────────────────────────────────────────────────────────────

  /// Access token for API authentication.
  static const String accessToken = 'access_token';

  /// Refresh token for token renewal.
  static const String refreshToken = 'refresh_token';

  /// Token expiration timestamp.
  static const String tokenExpiry = 'token_expiry';

  /// Current user ID.
  static const String userId = 'user_id';

  /// Current user email (for display/auto-fill).
  static const String userEmail = 'user_email';

  // ─────────────────────────────────────────────────────────────────────────────
  // USER PREFERENCES
  // ─────────────────────────────────────────────────────────────────────────────

  /// Theme mode preference (light/dark/system).
  static const String themeMode = 'theme_mode';

  /// Locale/language preference.
  static const String locale = 'locale';

  /// Notifications enabled preference.
  static const String notificationsEnabled = 'notifications_enabled';

  /// Biometric authentication enabled.
  static const String biometricEnabled = 'biometric_enabled';

  /// Analytics consent.
  static const String analyticsConsent = 'analytics_consent';

  // ─────────────────────────────────────────────────────────────────────────────
  // APP STATE
  // ─────────────────────────────────────────────────────────────────────────────

  /// Whether onboarding has been completed.
  static const String onboardingCompleted = 'onboarding_completed';

  /// First app launch timestamp.
  static const String firstLaunch = 'first_launch';

  /// Last app launch timestamp.
  static const String lastLaunch = 'last_launch';

  /// App launch count.
  static const String launchCount = 'launch_count';

  /// Whether user has rated the app.
  static const String hasRatedApp = 'has_rated_app';

  /// Last review prompt timestamp.
  static const String lastReviewPrompt = 'last_review_prompt';

  /// App version at last launch (for migration).
  static const String lastAppVersion = 'last_app_version';

  // ─────────────────────────────────────────────────────────────────────────────
  // CACHE
  // ─────────────────────────────────────────────────────────────────────────────

  /// User profile cache.
  static const String cachedUserProfile = 'cached_user_profile';

  /// Last sync timestamp.
  static const String lastSyncTimestamp = 'last_sync_timestamp';

  /// Pending sync queue.
  static const String pendingSyncQueue = 'pending_sync_queue';

  // ─────────────────────────────────────────────────────────────────────────────
  // NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────────────────────

  /// FCM device token.
  static const String fcmToken = 'fcm_token';

  /// Notification badge count.
  static const String badgeCount = 'badge_count';

  /// Last notification read timestamp.
  static const String lastNotificationRead = 'last_notification_read';

  // ─────────────────────────────────────────────────────────────────────────────
  // FEATURE FLAGS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Cached feature flags.
  static const String featureFlags = 'feature_flags';

  /// Feature flags fetch timestamp.
  static const String featureFlagsTimestamp = 'feature_flags_timestamp';
}

/// Shared Preferences keys (non-sensitive data).
///
/// Use for data that doesn't require encryption.
abstract class PrefsKeys {
  // ─────────────────────────────────────────────────────────────────────────────
  // UI STATE
  // ─────────────────────────────────────────────────────────────────────────────

  /// Last selected tab index.
  static const String lastTabIndex = 'last_tab_index';

  /// List view mode (grid/list).
  static const String listViewMode = 'list_view_mode';

  /// Sort order preference.
  static const String sortOrder = 'sort_order';

  /// Filter preferences.
  static const String filterPrefs = 'filter_prefs';

  /// Collapsed sections state.
  static const String collapsedSections = 'collapsed_sections';

  // ─────────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────────────────────────────────────

  /// Recent searches.
  static const String recentSearches = 'recent_searches';

  /// Search filters.
  static const String searchFilters = 'search_filters';

  // ─────────────────────────────────────────────────────────────────────────────
  // TOOLTIPS & HINTS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Shown feature tooltips.
  static const String shownTooltips = 'shown_tooltips';

  /// Dismissed banners.
  static const String dismissedBanners = 'dismissed_banners';

  /// Coach marks completion state.
  static const String coachMarksCompleted = 'coach_marks_completed';
}
