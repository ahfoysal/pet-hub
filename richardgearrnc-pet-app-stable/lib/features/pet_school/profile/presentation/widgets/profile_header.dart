import 'package:flutter/material.dart';
import 'package:petzy_app/core/core.dart';

/// A widget that displays a profile header with image and basic information.
///
/// This widget follows the brand guidelines with coral accents and
/// displays the school's profile image, name, and verification badge.
class ProfileHeader extends StatelessWidget {
  /// Creates a [ProfileHeader] instance.
  const ProfileHeader({
    required this.name,
    required this.imageUrl,
    required this.isVerified,
    super.key,
  });

  /// The name of the pet school.
  final String name;

  /// The profile image URL.
  final String? imageUrl;

  /// Whether the school is verified.
  final bool isVerified;

  @override
  Widget build(final BuildContext context) {
    final theme = context.theme;

    return FadeIn(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.gradientStart,
              AppColors.gradientEnd,
            ],
          ),
          borderRadius: BorderRadius.circular(AppConstants.borderRadiusLG),
        ),
        child: Column(
          children: [
            // Profile Image
            Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppColors.surface,
                      width: 4,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: AppColors.shadow,
                        blurRadius: 16,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: AppCachedImage(
                      imageUrl: imageUrl ?? '',
                      width: 120,
                      height: 120,
                      fit: BoxFit.cover,
                      placeholder: Container(
                        width: 120,
                        height: 120,
                        color: AppColors.primaryContainer,
                        child: const Icon(
                          Icons.school,
                          size: 60,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ),
                ),
                // Verification Badge
                if (isVerified)
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Bounce(
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: AppColors.secondary,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.shadow,
                              blurRadius: 8,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.verified,
                          color: AppColors.onSecondary,
                          size: 20,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const VerticalSpace.md(),

            // School Name
            Text(
              name,
              style: theme.textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.onPrimary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
