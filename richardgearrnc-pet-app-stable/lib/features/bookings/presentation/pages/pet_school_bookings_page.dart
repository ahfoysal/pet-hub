import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';

/// Bookings page for pet schools.
///
/// Features:
/// - View class schedules
/// - Manage student enrollments
/// - Track attendance
class PetSchoolBookingsPage extends HookConsumerWidget {
  /// Creates a [PetSchoolBookingsPage] instance.
  const PetSchoolBookingsPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    useOnMount(() {
      ref
          .read(analyticsServiceProvider)
          .logScreenView(
            screenName: 'bookings_school',
          );
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Classes - Pet School'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Today\'s Classes',
            style: context.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const VerticalSpace.md(),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: context.colorScheme.primaryContainer,
                          borderRadius: BorderRadius.circular(
                            AppConstants.borderRadiusSM,
                          ),
                        ),
                        child: Icon(
                          Icons.school,
                          color: context.colorScheme.primary,
                        ),
                      ),
                      const HorizontalSpace.md(),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Basic Obedience',
                              style: context.textTheme.titleSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '5 students enrolled',
                              style: context.textTheme.bodySmall?.copyWith(
                                color: context.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const VerticalSpace.md(),
                  Row(
                    children: [
                      Icon(
                        Icons.access_time,
                        size: 16,
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                      const HorizontalSpace.sm(),
                      Text(
                        '10:00 AM - 11:00 AM',
                        style: context.textTheme.bodySmall,
                      ),
                      const HorizontalSpace.lg(),
                      Icon(
                        Icons.location_on,
                        size: 16,
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                      const HorizontalSpace.sm(),
                      Text('Garden Area', style: context.textTheme.bodySmall),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
