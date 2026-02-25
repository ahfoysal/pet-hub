import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/auth/presentation/providers/auth_notifier.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Profile page for pet hotels.
///
/// Features:
/// - View pet hotel profile and amenities
/// - Manage rooms and occupancy
/// - View guest reviews
/// - Track revenue
class PetHotelProfilePage extends HookConsumerWidget {
  /// Creates a [PetHotelProfilePage] instance.
  const PetHotelProfilePage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final l10n = AppLocalizations.of(context);

    useOnMount(() {
      ref
          .read(analyticsServiceProvider)
          .logScreenView(
            screenName: 'profile_hotel',
          );
    });

    return Scaffold(
      appBar: AppBar(
        title: Text('${l10n.profile} - Pet Hotel'),
        actions: [
          AppIconButton(
            icon: Icons.settings_outlined,
            onPressed: () => context.pushRoute(AppRoute.settings),
          ),
        ],
      ),
      body: authState.when(
        data: (final user) {
          if (user == null) {
            return Center(child: Text(l10n.login));
          }
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Profile info card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: context.colorScheme.primaryContainer,
                          borderRadius: BorderRadius.circular(
                            AppConstants.borderRadiusMD,
                          ),
                        ),
                        child: Icon(
                          Icons.hotel,
                          size: 50,
                          color: context.colorScheme.primary,
                        ),
                      ),
                      const VerticalSpace.md(),
                      Text(
                        user.name ?? 'Pet Hotel',
                        style: context.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const VerticalSpace.sm(),
                      Text(
                        user.email,
                        style: context.textTheme.bodyMedium?.copyWith(
                          color: context.colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const VerticalSpace.md(),

                      // Rating
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.star, color: Colors.amber, size: 20),
                          const HorizontalSpace.sm(),
                          Text(
                            '4.7',
                            style: context.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const HorizontalSpace.sm(),
                          Text(
                            '(234 reviews)',
                            style: context.textTheme.bodySmall,
                          ),
                        ],
                      ),
                      const VerticalSpace.md(),
                      AppButton(
                        variant: AppButtonVariant.secondary,
                        size: AppButtonSize.medium,
                        isExpanded: true,
                        onPressed: () {
                          ref
                              .read(feedbackServiceProvider)
                              .showInfo('Editing profile...');
                        },
                        label: 'Edit Profile',
                      ),
                    ],
                  ),
                ),
              ),
              const VerticalSpace.lg(),

              // Amenities section
              Text(
                'Amenities',
                style: context.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const VerticalSpace.md(),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _AmenityChip(label: 'WiFi', icon: Icons.wifi),
                  _AmenityChip(label: 'AC', icon: Icons.air),
                  _AmenityChip(label: 'Playground', icon: Icons.sports_soccer),
                  _AmenityChip(label: '24/7 Care', icon: Icons.access_time),
                ],
              ),
              const VerticalSpace.lg(),

              // Stats section
              Text(
                'Statistics',
                style: context.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const VerticalSpace.md(),
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          children: [
                            Text(
                              '12',
                              style: context.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: context.colorScheme.primary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Available Rooms',
                              style: context.textTheme.bodySmall,
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          children: [
                            Text(
                              '8/12',
                              style: context.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Colors.blue.shade600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Currently Occupied',
                              style: context.textTheme.bodySmall,
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const VerticalSpace.md(),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      Text(
                        '\$12,450',
                        style: context.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.green.shade600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Monthly Revenue',
                        style: context.textTheme.bodySmall,
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
              const VerticalSpace.lg(),

              // Account section
              Text(
                'Account',
                style: context.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const VerticalSpace.md(),
              Card(
                child: Column(
                  children: [
                    ListTile(
                      leading: Icon(
                        Icons.calendar_today_outlined,
                        color: context.colorScheme.primary,
                      ),
                      title: const Text('Reservations'),
                      trailing: Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () => context.goRoute(AppRoute.bookingsHotel),
                    ),
                    Divider(height: 1),
                    ListTile(
                      leading: Icon(
                        Icons.notifications_outlined,
                        color: context.colorScheme.primary,
                      ),
                      title: const Text('Notifications'),
                      trailing: Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {},
                    ),
                  ],
                ),
              ),
              const VerticalSpace.lg(),

              // Logout button
              AppButton(
                variant: AppButtonVariant.secondary,
                size: AppButtonSize.large,
                isExpanded: true,
                onPressed: () => _handleLogout(context, ref),
                icon: Icons.logout,
                label: l10n.logout,
              ),
              const VerticalSpace.lg(),
            ],
          );
        },
        loading: () => const LoadingWidget(),
        error: (final error, final stack) => AppErrorWidget.fromError(
          error: error,
          onRetry: () => ref.refresh(authProvider),
        ),
      ),
    );
  }

  Future<void> _handleLogout(
    final BuildContext context,
    final WidgetRef ref,
  ) async {
    final l10n = AppLocalizations.of(context);
    final confirmed = await AppDialogs.confirm(
      context,
      title: l10n.logout,
      message: l10n.confirmLogout,
      confirmText: l10n.logout,
      cancelText: l10n.cancel,
    );

    if (confirmed ?? false) {
      try {
        final authNotifier = ref.read(authProvider.notifier);
        await authNotifier.logout();
      } catch (e) {
        if (context.mounted) {
          ref.read(feedbackServiceProvider).showError(l10n.logoutFailed);
        }
      }
    }
  }
}

class _AmenityChip extends StatelessWidget {
  const _AmenityChip({
    required this.label,
    required this.icon,
  });

  final String label;
  final IconData icon;

  @override
  Widget build(final BuildContext context) {
    return Chip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      backgroundColor: context.colorScheme.primaryContainer,
      labelStyle: context.textTheme.labelSmall?.copyWith(
        color: context.colorScheme.primary,
      ),
    );
  }
}
