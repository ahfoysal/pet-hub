import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import 'package:petzy_app/core/enums/user_role.dart';
import 'package:petzy_app/features/auth/presentation/providers/auth_notifier.dart';
import 'package:petzy_app/features/bookings/presentation/pages/pet_hotel_bookings_page.dart';
import 'package:petzy_app/features/bookings/presentation/pages/pet_owner_bookings_page.dart';
import 'package:petzy_app/features/pet_school/courses/presentation/pages/courses_page.dart';
import 'package:petzy_app/features/pet_setter/presentation/booking_request/pet_sitter_booking_req.dart';

class BookingsWrapperPage extends ConsumerWidget {
  const BookingsWrapperPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return authState.when(
      data: (final user) {
        if (user == null) {
          return const _LoadingView(); // Or redirect to login
        }

        return switch (user.role) {
          UserRole.petOwner => const PetOwnerBookingsPage(),
          UserRole.petSitter => const PetServicesBookingSearchPage(),
          UserRole.petSchool => const CoursesPage(),
          UserRole.petHotel => const PetHotelBookingsPage(),
        };
      },
      loading: () => const _LoadingView(),
      error: (final error, final stack) => Center(child: Text('Error: $error')),
    );
  }
}

class _LoadingView extends StatelessWidget {
  const _LoadingView();

  @override
  Widget build(final BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
