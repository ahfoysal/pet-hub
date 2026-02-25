import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_school/profile/domain/entities/pet_school_profile.dart';
import 'package:petzy_app/features/pet_school/profile/presentation/providers/pet_school_profile_provider.dart';
import 'package:petzy_app/features/pet_school/profile/presentation/widgets/profile_header.dart';
import 'package:petzy_app/features/pet_school/profile/presentation/widgets/profile_info_section.dart';
import 'package:petzy_app/features/pet_school/profile/presentation/widgets/profile_stats_card.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Pet School Profile page displaying school information and details.
///
/// This page follows the brand guidelines with coral accents and displays:
/// - School profile header with image and verification badge
/// - Statistics (rating, reviews, verification status)
/// - Contact information
/// - Description
/// - Address information
class PetSchoolProfilePage extends HookConsumerWidget {
  /// Creates a [PetSchoolProfilePage] instance.
  const PetSchoolProfilePage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final profileAsync = ref.watch(petSchoolProfileProvider);
    final l10n = AppLocalizations.of(context);

    // Track screen view once on mount
    useOnMount(() {
      ref
          .read(analyticsServiceProvider)
          .logScreenView(screenName: 'pet_school_profile');
    });

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.petSchoolProfile),
        actions: [
          AppIconButton(
            icon: Icons.edit_outlined,
            onPressed: () {
              // TODO: Navigate to edit profile page
              ref.read(feedbackServiceProvider).showInfo(l10n.editProfile);
            },
          ),
        ],
      ),
      body: AsyncValueWidget<PetSchoolProfile>(
        value: profileAsync,
        data: (final profile) => _ProfileContent(profile: profile),
      ),
    );
  }
}

class _ProfileContent extends StatelessWidget {
  const _ProfileContent({required this.profile});

  final PetSchoolProfile profile;

  @override
  Widget build(final BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return ResponsivePadding(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const VerticalSpace.md(),

            // Profile Header with Image
            ProfileHeader(
              name: profile.name,
              imageUrl: profile.images.isNotEmpty ? profile.images.first : null,
              isVerified: profile.isVerified,
            ),

            const VerticalSpace.lg(),

            // Statistics Card
            ProfileStatsCard(
              rating: profile.rating,
              reviewCount: profile.reviewCount,
              isVerified: profile.isVerified,
            ),

            const VerticalSpace.lg(),

            // Contact Information Section
            ProfileInfoSection(
              title: l10n.contactInformation,
              delay: AppConstants.staggerDelay * 2,
              children: [
                InfoRow(
                  label: l10n.email,
                  value: profile.email,
                  icon: Icons.email_outlined,
                ),
                InfoRow(
                  label: l10n.phoneNumber,
                  value: profile.phone,
                  icon: Icons.phone_outlined,
                ),
              ],
            ),

            const VerticalSpace.lg(),

            // School Information Section
            ProfileInfoSection(
              title: l10n.schoolInformation,
              delay: AppConstants.staggerDelay * 3,
              children: [
                InfoRow(
                  label: l10n.description,
                  value: profile.description,
                  icon: Icons.info_outlined,
                ),
                InfoRow(
                  label: l10n.status,
                  value: _getStatusLabel(profile.status, l10n),
                  icon: Icons.toggle_on_outlined,
                ),
                if (profile.createdAt != null)
                  InfoRow(
                    label: l10n.memberSince,
                    value: DateFormat(
                      'MMMM dd, yyyy',
                    ).format(profile.createdAt!),
                    icon: Icons.calendar_today_outlined,
                  ),
              ],
            ),

            const VerticalSpace.lg(),

            // Address Information Section
            if (profile.addresses.isNotEmpty)
              ProfileInfoSection(
                title: l10n.addressInformation,
                delay: AppConstants.staggerDelay * 4,
                children: [
                  InfoRow(
                    label: l10n.streetAddress,
                    value: profile.addresses.first.streetAddress,
                    icon: Icons.location_on_outlined,
                  ),
                  InfoRow(
                    label: l10n.city,
                    value: profile.addresses.first.city,
                  ),
                  InfoRow(
                    label: l10n.country,
                    value: profile.addresses.first.country,
                  ),
                  InfoRow(
                    label: l10n.postalCode,
                    value: profile.addresses.first.postalCode,
                  ),
                ],
              )
            else
              SlideIn(
                direction: SlideDirection.fromLeft,
                delay: AppConstants.staggerDelay * 4,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(
                      AppConstants.borderRadiusLG,
                    ),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.location_off_outlined,
                        color: AppColors.onSurfaceVariant,
                      ),
                      const HorizontalSpace.md(),
                      Expanded(
                        child: Text(
                          l10n.noAddress,
                          style: context.theme.textTheme.bodyMedium?.copyWith(
                            color: AppColors.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            const VerticalSpace.xl(),
          ],
        ),
      ),
    );
  }

  String _getStatusLabel(
    final ProfileStatus status,
    final AppLocalizations l10n,
  ) {
    return switch (status) {
      ProfileStatus.active => l10n.active,
      ProfileStatus.inactive => l10n.inactive,
      ProfileStatus.pending => l10n.pending,
    };
  }
}
