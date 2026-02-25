import 'package:flutter/material.dart';
import 'package:petzy_app/core/core.dart';

/// A widget that displays an information section with a title and content.
///
/// Used for displaying contact info, description, and address details.
class ProfileInfoSection extends StatelessWidget {
  /// Creates a [ProfileInfoSection] instance.
  const ProfileInfoSection({
    required this.title,
    required this.children,
    this.delay = Duration.zero,
    super.key,
  });

  /// The section title.
  final String title;

  /// The list of widgets to display in the section.
  final List<Widget> children;

  /// Animation delay for staggered animations.
  final Duration delay;

  @override
  Widget build(final BuildContext context) {
    final theme = context.theme;

    return SlideIn(
      direction: SlideDirection.fromLeft,
      delay: delay,
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section Title
            Text(
              title,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
            const VerticalSpace.md(),

            // Section Content
            ...children,
          ],
        ),
      ),
    );
  }
}

/// A widget that displays a single info row with a label and value.
class InfoRow extends StatelessWidget {
  /// Creates an [InfoRow] instance.
  const InfoRow({
    required this.label,
    required this.value,
    this.icon,
    super.key,
  });

  /// The label text.
  final String label;

  /// The value text.
  final String value;

  /// Optional icon to display.
  final IconData? icon;

  @override
  Widget build(final BuildContext context) {
    final theme = context.theme;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (icon != null) ...[
            Icon(
              icon,
              size: AppConstants.iconSizeSM,
              color: AppColors.primary,
            ),
            const HorizontalSpace.sm(),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: AppColors.onSurfaceVariant,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: AppColors.onSurface,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
