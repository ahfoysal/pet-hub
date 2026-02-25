import 'package:flutter/material.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Welcome card displayed on the home page.
///
/// Shows a success message with a welcome icon to greet the user
/// after successful authentication. Demonstrates `ScaleIn` and `FadeIn`
/// animation widgets.
class WelcomeCard extends StatelessWidget {
  /// Creates a [WelcomeCard] instance.
  const WelcomeCard({required this.theme, super.key});

  /// The theme data for styling.
  final ThemeData theme;

  @override
  Widget build(final BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return FadeIn(
      child: Card(
        child: ResponsivePadding(
          child: Column(
            children: [
              ScaleIn(
                delay: AppConstants.animationFast,
                child: Bounce(
                  delay: AppConstants.animationNormal,
                  child: Icon(
                    Icons.check_circle,
                    size: AppConstants.iconSizeXL,
                    color: theme.colorScheme.primary,
                  ),
                ),
              ),
              const VerticalSpace.md(),
              SlideIn(
                delay: AppConstants.staggerDelay * 4,
                direction: .fromBottom,
                child: Text(
                  l10n.youAreAllSet,
                  style: theme.textTheme.titleLarge,
                ),
              ),
              const VerticalSpace.sm(),
              FadeIn(
                delay: AppConstants.staggerDelay * 6,
                child: Text(
                  l10n.startBuilding,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
