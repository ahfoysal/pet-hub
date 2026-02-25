/// Asset paths for images, icons, animations, and other assets.
///
/// Centralizes all asset paths to avoid hardcoding strings
/// and ensure consistency across the app.
///
/// Usage:
/// ```dart
/// Image.asset(Assets.logo);
/// SvgPicture.asset(Assets.icons.home);
/// ```
abstract class Assets {
  // ─────────────────────────────────────────────────────────────────────────────
  // BASE PATHS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Base path for all assets.
  static const String _basePath = 'assets';

  /// Base path for images.
  static const String imagesPath = '$_basePath/images';

  /// Base path for icons.
  static const String iconsPath = '$_basePath/icons';

  /// Base path for animations (Lottie/Rive).
  static const String animationsPath = '$_basePath/animations';

  /// Base path for fonts.
  static const String fontsPath = '$_basePath/fonts';

  // ─────────────────────────────────────────────────────────────────────────────
  // BRANDING
  // ─────────────────────────────────────────────────────────────────────────────

  /// App logo.
  static const String logo = '$imagesPath/logo.png';

  /// App logo (dark mode variant).
  static const String logoDark = '$imagesPath/logo_dark.png';

  /// App icon.
  static const String appIcon = '$imagesPath/app_icon.png';

  /// Splash screen image.
  static const String splash = '$imagesPath/splash_image.png';

  /// Login screen image.
  static const String loginImage = '$imagesPath/login_image.png';

  /// OTP screen image.
  static const String otpImage = '$imagesPath/otp_image.png';

  /// OTP screen background image.
  static const String otpBackground = '$imagesPath/otp_background.png';

  /// dog image
  static const String dogImage = '$imagesPath/Container.png';

  // ─────────────────────────────────────────────────────────────────────────────
  // PLACEHOLDERS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Generic placeholder image.
  static const String placeholder = '$imagesPath/placeholder.png';

  /// Avatar placeholder.
  static const String avatarPlaceholder = '$imagesPath/avatar_placeholder.png';

  /// Image loading placeholder.
  static const String imagePlaceholder = '$imagesPath/image_placeholder.png';

  // ─────────────────────────────────────────────────────────────────────────────
  // ILLUSTRATIONS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Empty state illustration.
  static const String emptyState = '$imagesPath/empty_state.png';

  /// Error state illustration.
  static const String errorState = '$imagesPath/error_state.png';

  /// No connection illustration.
  static const String noConnection = '$imagesPath/no_connection.png';

  /// Success illustration.
  static const String success = '$imagesPath/success.png';

  /// Onboarding illustrations.
  static const onboarding = _OnboardingAssets();

  /// Service icons.
  static const icons = AppIcons();

  // ─────────────────────────────────────────────────────────────────────────────
  // ANIMATIONS (LOTTIE)
  // ─────────────────────────────────────────────────────────────────────────────

  /// Loading animation.
  static const String loadingAnimation = '$animationsPath/loading.json';

  /// Success animation.
  static const String successAnimation = '$animationsPath/success.json';

  /// Error animation.
  static const String errorAnimation = '$animationsPath/error.json';

  /// Empty state animation.
  static const String emptyAnimation = '$animationsPath/empty.json';

  /// Confetti animation.
  static const String confettiAnimation = '$animationsPath/confetti.json';
}

/// Onboarding-specific assets.
class _OnboardingAssets {
  const _OnboardingAssets();

  /// First onboarding page illustration.
  String get page1 => '${Assets.imagesPath}/onboarding_1.png';

  /// Second onboarding page illustration.
  String get page2 => '${Assets.imagesPath}/onboarding_2.png';

  /// Third onboarding page illustration.
  String get page3 => '${Assets.imagesPath}/onboarding_3.png';
}

/// Icon assets (SVG or PNG).
///
/// Usage:
/// ```dart
/// SvgPicture.asset(AppIcons().home);
/// Image.asset(AppIcons().petSitter);
/// ```
class AppIcons {
  /// Creates [AppIcons].
  const AppIcons();

  /// Base path for icons.
  static const String _path = Assets.iconsPath;

  // ─────────────────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────────

  /// Home icon.
  String get home => '$_path/home.svg';

  /// Search icon.
  String get search => '$_path/search.svg';

  /// Profile icon.
  String get profile => '$_path/profile.svg';

  /// Settings icon.
  String get settings => '$_path/settings.svg';

  /// Menu icon.
  String get menu => '$_path/menu.svg';

  /// Back icon.
  String get back => '$_path/back.svg';

  /// Close icon.
  String get close => '$_path/close.svg';

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Add/plus icon.
  String get add => '$_path/add.svg';

  /// Edit icon.
  String get edit => '$_path/edit.svg';

  /// Delete icon.
  String get delete => '$_path/delete.svg';

  /// Share icon.
  String get share => '$_path/share.svg';

  /// Favorite icon.
  String get favorite => '$_path/favorite.svg';

  /// Bookmark icon.
  String get bookmark => '$_path/bookmark.svg';

  /// Download icon.
  String get download => '$_path/download.svg';

  /// Upload icon.
  String get upload => '$_path/upload.svg';

  // ─────────────────────────────────────────────────────────────────────────────
  // STATUS
  // ─────────────────────────────────────────────────────────────────────────────

  /// Check/success icon.
  String get check => '$_path/check.svg';

  /// Error icon.
  String get error => '$_path/error.svg';

  /// Warning icon.
  String get warning => '$_path/warning.svg';

  /// Info icon.
  String get info => '$_path/info.svg';

  // ─────────────────────────────────────────────────────────────────────────────
  // SOCIAL
  // ─────────────────────────────────────────────────────────────────────────────

  /// Google icon.
  String get google => '$_path/google.svg';

  /// Apple icon.
  String get apple => '$_path/apple.svg';

  /// Facebook icon.
  String get facebook => '$_path/facebook.svg';

  /// Twitter/X icon.
  String get twitter => '$_path/twitter.svg';

  // ─────────────────────────────────────────────────────────────────────────────
  // SERVICES
  // ─────────────────────────────────────────────────────────────────────────────

  /// Pet sitter service icon.
  String get petSitter => '$_path/pet_sitter.png';

  /// Pet market service icon.
  String get petMarket => '$_path/pet_market.png';

  /// Pet school service icon.
  String get petSchool => '$_path/pet_school.png';

  /// Pet hotel service icon.
  String get petHotel => '$_path/pet_hotel.png';
}
