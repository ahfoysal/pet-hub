import 'package:flutter/material.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// A widget that displays statistics in a card format.
///
/// Shows rating, review count, and verification status.
class ProfileStatsCard extends StatelessWidget {
  /// Creates a [ProfileStatsCard] instance.
  const ProfileStatsCard({
    required this.rating,
    required this.reviewCount,
    required this.isVerified,
    super.key,
  });

  /// The school's rating.
  final double rating;

  /// The number of reviews.
  final int reviewCount;

  /// Whether the school is verified.
  final bool isVerified;

  @override
  Widget build(final BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return SlideIn(
      direction: SlideDirection.fromLeft,
      delay: AppConstants.staggerDelay,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppConstants.borderRadiusLG),
          boxShadow: const [
            BoxShadow(
              color: AppColors.shadow,
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            // Rating
            _StatItem(
              icon: Icons.star,
              iconColor: Colors.amber,
              label: l10n.rating,
              value: rating.toStringAsFixed(1),
            ),

            // Divider
            Container(
              height: 40,
              width: 1,
              color: AppColors.outline,
            ),

            // Reviews
            _StatItem(
              icon: Icons.rate_review,
              iconColor: AppColors.secondary,
              label: l10n.reviews,
              value: reviewCount.toString(),
            ),

            // Divider
            Container(
              height: 40,
              width: 1,
              color: AppColors.outline,
            ),

            // Verification
            _StatItem(
              icon: isVerified ? Icons.verified : Icons.pending,
              iconColor: isVerified ? AppColors.success : AppColors.unselected,
              label: l10n.status,
              value: isVerified ? l10n.verified : l10n.pending,
            ),
          ],
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  const _StatItem({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;

  @override
  Widget build(final BuildContext context) {
    final theme = context.theme;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          color: iconColor,
          size: AppConstants.iconSizeLG,
        ),
        const VerticalSpace.xs(),
        Text(
          value,
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: AppColors.onSurface,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            color: AppColors.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}
