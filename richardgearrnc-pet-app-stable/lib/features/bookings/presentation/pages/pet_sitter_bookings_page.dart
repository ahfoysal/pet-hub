import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';

/// Bookings page for pet sitters.
///
/// Features:
/// - View upcoming pet sitting jobs
/// - Accept/decline job requests
/// - Track earnings
class PetSitterBookingsPage extends HookConsumerWidget {
  /// Creates a [PetSitterBookingsPage] instance.
  const PetSitterBookingsPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    useOnMount(() {
      ref
          .read(analyticsServiceProvider)
          .logScreenView(
            screenName: 'bookings_sitter',
          );
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bookings - Pet Sitter'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Upcoming Jobs',
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
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: context.colorScheme.primaryContainer,
                        child: Icon(
                          Icons.person,
                          color: context.colorScheme.primary,
                        ),
                      ),
                      const HorizontalSpace.md(),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Emma Wilson',
                              style: context.textTheme.titleSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Golden Retriever - Max',
                              style: context.textTheme.bodySmall?.copyWith(
                                color: context.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.amber.shade100,
                          borderRadius: BorderRadius.circular(
                            AppConstants.borderRadiusSM,
                          ),
                        ),
                        child: Text(
                          'Pending',
                          style: context.textTheme.labelSmall?.copyWith(
                            color: Colors.amber.shade700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const VerticalSpace.md(),
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                      const HorizontalSpace.sm(),
                      Text('Feb 16, 2026', style: context.textTheme.bodySmall),
                      const HorizontalSpace.lg(),
                      Icon(
                        Icons.access_time,
                        size: 16,
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                      const HorizontalSpace.sm(),
                      Text(
                        '4:00 PM - 8:00 PM',
                        style: context.textTheme.bodySmall,
                      ),
                    ],
                  ),
                  const VerticalSpace.md(),
                  Row(
                    children: [
                      Expanded(
                        child: AppButton(
                          variant: AppButtonVariant.secondary,
                          size: AppButtonSize.medium,
                          onPressed: () {
                            ref
                                .read(feedbackServiceProvider)
                                .showInfo('Booking declined');
                          },
                          label: 'Decline',
                        ),
                      ),
                      const HorizontalSpace.md(),
                      Expanded(
                        child: AppButton(
                          variant: AppButtonVariant.primary,
                          size: AppButtonSize.medium,
                          onPressed: () {
                            ref
                                .read(feedbackServiceProvider)
                                .showInfo('Booking accepted');
                          },
                          label: 'Accept',
                        ),
                      ),
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
