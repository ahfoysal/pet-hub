import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';

/// A wrapper widget that shows a "No Internet" banner when connectivity is lost.
///
/// Wrap your app's body with this widget to automatically show/hide
/// a connectivity status banner.
///
/// Example:
/// ```dart
/// @override
/// Widget build(BuildContext context) {
///   return MaterialApp(
///     builder: (context, child) {
///       return ConnectivityWrapper(
///         child: child ?? const SizedBox.shrink(),
///       );
///     },
///   );
/// }
/// ```
class ConnectivityWrapper extends ConsumerWidget {
  /// Creates a [ConnectivityWrapper] widget.
  const ConnectivityWrapper({
    required this.child,
    this.bannerPosition = BannerPosition.top,
    this.showBanner = true,
    super.key,
  });

  /// The child widget to wrap.
  final Widget child;

  /// Position of the offline banner.
  final BannerPosition bannerPosition;

  /// Whether to show the banner (can be disabled if needed).
  final bool showBanner;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final isOnline = ref.watch(isOnlineProvider);

    if (!showBanner) return child;

    return Stack(
      children: [
        // Main content
        Positioned.fill(child: child),

        // Offline banner
        if (!isOnline)
          Positioned(
            top: bannerPosition == .top ? 0 : null,
            bottom: bannerPosition == .bottom ? 0 : null,
            left: 0,
            right: 0,
            child: const _OfflineBanner(),
          ),
      ],
    );
  }
}

/// Position for the connectivity banner.
enum BannerPosition {
  /// Banner appears at the top of the screen.
  top,

  /// Banner appears at the bottom of the screen.
  bottom,
}

class _OfflineBanner extends StatelessWidget {
  const _OfflineBanner();

  @override
  Widget build(final BuildContext context) {
    final topPadding = MediaQuery.of(context).viewPadding.top;
    final colorScheme = Theme.of(context).colorScheme;

    return Material(
          color: colorScheme.error,
          child: SafeArea(
            bottom: false,
            child: Container(
              width: .infinity,
              padding: .only(
                top: topPadding > 0 ? 4 : 8,
                bottom: 8,
                left: 16,
                right: 16,
              ),
              child: Row(
                mainAxisAlignment: .center,
                children: [
                  Icon(
                    Icons.wifi_off_rounded,
                    color: colorScheme.onError,
                    size: AppConstants.connectivityIconSize,
                  ),
                  const HorizontalSpace.sm(),
                  Text(
                    'No Internet Connection',
                    style: TextStyle(
                      color: colorScheme.onError,
                      fontWeight: .w500,
                      fontSize: AppConstants.connectivityFontSize,
                    ),
                  ),
                ],
              ),
            ),
          ),
        )
        .animate()
        .slideY(
          begin: -1,
          end: 0,
          duration: AppConstants.animationNormal,
          curve: Curves.easeOut,
        )
        .fadeIn(duration: AppConstants.animationFast);
  }
}

/// A simple indicator widget for showing connectivity status inline.
///
/// Useful for showing in app bars or status sections.
class ConnectivityIndicator extends ConsumerWidget {
  /// Creates a [ConnectivityIndicator] widget.
  const ConnectivityIndicator({
    this.onlineIcon = Icons.wifi,
    this.offlineIcon = Icons.wifi_off,
    this.size = 20,
    this.onlineColor,
    this.offlineColor,
    super.key,
  });

  /// Icon to show when online.
  final IconData onlineIcon;

  /// Icon to show when offline.
  final IconData offlineIcon;

  /// Size of the icon.
  final double size;

  /// Color when online (defaults to theme's primary color).
  final Color? onlineColor;

  /// Color when offline (defaults to red).
  final Color? offlineColor;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final isOnline = ref.watch(isOnlineProvider);
    final colorScheme = context.theme.colorScheme;

    return Icon(
      isOnline ? onlineIcon : offlineIcon,
      size: size,
      color: isOnline
          ? (onlineColor ?? colorScheme.primary)
          : (offlineColor ?? colorScheme.error),
    );
  }
}

/// A wrapper that shows a custom widget when offline.
///
/// Useful for showing offline-specific UI or blocking functionality.
class OfflineAwareWidget extends ConsumerWidget {
  /// Creates an [OfflineAwareWidget].
  const OfflineAwareWidget({
    required this.child,
    this.offlineChild,
    this.showChildWhenOffline = true,
    super.key,
  });

  /// Widget to show when online.
  final Widget child;

  /// Widget to show when offline (if [showChildWhenOffline] is false).
  final Widget? offlineChild;

  /// Whether to still show [child] when offline (with [offlineChild] overlay).
  final bool showChildWhenOffline;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final isOnline = ref.watch(isOnlineProvider);

    if (isOnline) return child;

    if (showChildWhenOffline && offlineChild != null) {
      return Stack(
        children: [
          child,
          offlineChild!,
        ],
      );
    }

    return offlineChild ?? child;
  }
}
