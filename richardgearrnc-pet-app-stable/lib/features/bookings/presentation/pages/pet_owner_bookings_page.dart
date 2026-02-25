import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Bookings page for pet owners.
///
/// Features:
/// - View upcoming pet sitting bookings
/// - Past bookings history
/// - Cancel or reschedule bookings
class PetOwnerBookingsPage extends HookConsumerWidget {
  /// Creates a [PetOwnerBookingsPage] instance.
  const PetOwnerBookingsPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final l10n = AppLocalizations.of(context);

    useOnMount(() {
      ref
          .read(analyticsServiceProvider)
          .logScreenView(
            screenName: 'bookings_owner',
          );
    });

    return Scaffold(
      appBar: AppBar(
        title: Text('${l10n.bookings} - Pet Owner'),
        actions: [
          AppIconButton(
            icon: Icons.add_circle_outline,
            onPressed: () {
              ref
                  .read(feedbackServiceProvider)
                  .showInfo('Booking a pet sitter...');
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Upcoming Bookings',
            style: context.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const VerticalSpace.md(),
          for (final booking in _mockOwnerBookings)
            _OwnerBookingCard(booking: booking),
        ],
      ),
    );
  }
}

class _OwnerBookingCard extends StatelessWidget {
  const _OwnerBookingCard({required this.booking});

  final _OwnerBooking booking;

  @override
  Widget build(final BuildContext context) {
    final theme = context.theme;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: theme.colorScheme.primaryContainer,
                  child: Icon(Icons.person, color: theme.colorScheme.primary),
                ),
                const HorizontalSpace.md(),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        booking.sitterName,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        booking.petName,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
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
                    color: booking.status == 'Confirmed'
                        ? Colors.green.shade100
                        : Colors.amber.shade100,
                    borderRadius: BorderRadius.circular(
                      AppConstants.borderRadiusSM,
                    ),
                  ),
                  child: Text(
                    booking.status,
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: booking.status == 'Confirmed'
                          ? Colors.green.shade700
                          : Colors.amber.shade700,
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
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                const HorizontalSpace.sm(),
                Text(
                  booking.date,
                  style: theme.textTheme.bodySmall,
                ),
                const HorizontalSpace.lg(),
                Icon(
                  Icons.access_time,
                  size: 16,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                const HorizontalSpace.sm(),
                Text(
                  booking.time,
                  style: theme.textTheme.bodySmall,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _OwnerBooking {
  const _OwnerBooking({
    required this.sitterName,
    required this.petName,
    required this.date,
    required this.time,
    required this.status,
  });

  final String sitterName;
  final String petName;
  final String date;
  final String time;
  final String status;
}

final _mockOwnerBookings = [
  _OwnerBooking(
    sitterName: 'Sarah Johnson',
    petName: 'Luna',
    date: 'Feb 15, 2026',
    time: '2:00 PM - 6:00 PM',
    status: 'Confirmed',
  ),
  _OwnerBooking(
    sitterName: 'Mike Chen',
    petName: 'Max',
    date: 'Feb 18, 2026',
    time: '10:00 AM - 3:00 PM',
    status: 'Pending',
  ),
];
