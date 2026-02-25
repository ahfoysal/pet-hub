import 'package:flutter/material.dart';

/// Centralized application color palette.
///
/// This file defines all brand, semantic, and layout-related colors
/// used throughout the app. The palette is tailored for a warm,
/// friendly pet-care experience with a coral-pink brand identity.
///
/// All colors are defined as constants to ensure consistency,
/// accessibility, and easy theming across the application.
abstract class AppColors {
  /// Private constructor to prevent instantiation.
  const AppColors._();

  // ─────────────────────────────────────────────
  // Brand Colors
  // ─────────────────────────────────────────────

  /// Primary brand color (Coral).
  ///
  /// Used for main actions, selected states, highlights,
  /// and key interactive elements.
  static const Color primary = Color(0xFFFF6B72);

  /// Stronger variant of [primary].
  ///
  /// Used sparingly for emphasis such as active icons,
  /// badges, or critical call-to-action accents.
  static const Color primaryStrong = Color(0xFFFF525A);

  /// Color used on top of [primary].
  static const Color onPrimary = Color(0xFFFFFFFF);

  /// Container color for primary elements.
  ///
  /// Used for chips, selected tabs, and subtle backgrounds
  /// that need to reference the primary brand color
  /// without overwhelming the UI.
  static const Color primaryContainer = Color(0xFFFFE4E6);

  /// Color used on top of [primaryContainer].
  static const Color onPrimaryContainer = Color(0xFF3A0A0D);

  // ─────────────────────────────────────────────
  // Secondary Colors
  // ─────────────────────────────────────────────

  /// Secondary brand color (Lavender / Purple).
  ///
  /// Primarily used for authentication flows,
  /// prominent CTAs (e.g. Login, Google sign-in),
  /// and accent actions that should stand out
  /// from the coral primary.
  static const Color secondary = Color(0xFF6C5CE7);

  /// Color used on top of [secondary].
  static const Color onSecondary = Color(0xFFFFFFFF);

  /// Container color for secondary elements.
  ///
  /// Used as a soft background for secondary actions
  /// or supporting UI elements.
  static const Color secondaryContainer = Color(0xFFEDEAFF);

  /// Color used on top of [secondaryContainer].
  static const Color onSecondaryContainer = Color(0xFF1F1A4D);

  // ─────────────────────────────────────────────
  // Semantic Colors
  // ─────────────────────────────────────────────

  /// Success color.
  ///
  /// Used for confirmations, completed states,
  /// and positive feedback.
  static const Color success = Color(0xFF22C55E);

  /// Color used on top of [success].
  static const Color onSuccess = Color(0xFFFFFFFF);

  /// Error color.
  ///
  /// Used for validation errors, failures,
  /// and destructive actions.
  static const Color error = Color(0xFFEF4444);

  /// Color used on top of [error].
  static const Color onError = Color(0xFFFFFFFF);

  // ─────────────────────────────────────────────
  // Background & Surface Colors
  // ─────────────────────────────────────────────

  /// App-wide background color.
  ///
  /// A warm blush off-white that complements the
  /// coral brand identity and feels softer than
  /// a neutral grey background.
  static const Color background = Color(0xFFFFF7F8);

  /// Color used on top of [background].
  static const Color onBackground = Color(0xFF1F1F1F);

  /// Surface color for cards, sheets, and containers.
  static const Color surface = Color(0xFFFFFFFF);

  /// Color used on top of [surface].
  static const Color onSurface = Color(0xFF2B2B2B);

  /// Variant surface color.
  ///
  /// Used for grouped sections, filter panels,
  /// chips, and subtle visual separation.
  static const Color surfaceVariant = Color(0xFFFFEEF0);

  /// Color used on top of [surfaceVariant].
  static const Color onSurfaceVariant = Color(0xFF5A5A5A);

  // ─────────────────────────────────────────────
  // Layout & Utility Colors
  // ─────────────────────────────────────────────

  /// Outline color for borders and dividers.
  static const Color outline = Color(0xFFE5E7EB);

  /// Variant outline color for subtle separators.
  static const Color outlineVariant = Color(0xFFF3F4F6);

  /// Shadow color used for elevation.
  static const Color shadow = Color(0x14000000);

  /// Color used for unselected navigation items
  /// and inactive icons.
  static const Color unselected = Color(0xFF9CA3AF);

  // ─────────────────────────────────────────────
  // Gradients
  // ─────────────────────────────────────────────

  /// Gradient start color.
  ///
  /// Used for splash screens and authentication
  /// backgrounds.
  static const Color gradientStart = Color(0xFFFFC1C7);

  /// Gradient end color.
  ///
  /// Used in combination with [gradientStart]
  /// for warm, friendly gradient backgrounds.
  static const Color gradientEnd = Color(0xFFFF9AA2);
}
