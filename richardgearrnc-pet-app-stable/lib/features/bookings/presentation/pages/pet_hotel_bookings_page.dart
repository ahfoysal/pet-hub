import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';

/// Bookings page for pet hotels.
///
/// Features:
/// - View upcoming room reservations
/// - Manage check-ins/check-outs
/// - Track occupancy
class PetHotelBookingsPage extends HookConsumerWidget {
  /// Creates a [PetHotelBookingsPage] instance.
  const PetHotelBookingsPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    useOnMount(() {
      ref
          .read(analyticsServiceProvider)
          .logScreenView(
            screenName: 'bookings_hotel',
          );
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reservations - Pet Hotel'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Current Reservations',
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
                        child: Text(
                          'Rm 5',
                          style: context.textTheme.labelLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: context.colorScheme.primary,
                          ),
                        ),
                      ),
                      const HorizontalSpace.md(),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Sarah Johnson - Buddy',
                              style: context.textTheme.titleSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Golden Retriever',
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
                          color: Colors.blue.shade100,
                          borderRadius: BorderRadius.circular(
                            AppConstants.borderRadiusSM,
                          ),
                        ),
                        child: Text(
                          'Checked In',
                          style: context.textTheme.labelSmall?.copyWith(
                            color: Colors.blue.shade700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const VerticalSpace.md(),
                  Row(
                    children: [
                      Icon(
                        Icons.login,
                        size: 16,
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                      const HorizontalSpace.sm(),
                      Text('Feb 14, 2026', style: context.textTheme.bodySmall),
                      const HorizontalSpace.lg(),
                      Icon(
                        Icons.logout,
                        size: 16,
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                      const HorizontalSpace.sm(),
                      Text('Feb 17, 2026', style: context.textTheme.bodySmall),
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
