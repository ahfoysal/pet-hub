import 'package:go_router/go_router.dart';
import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/app/presentation/pages/placeholder_page.dart';
import 'package:petzy_app/features/bookings/presentation/pages/pet_hotel_bookings_page.dart';
import 'package:petzy_app/features/bookings/presentation/pages/pet_owner_bookings_page.dart';
import 'package:petzy_app/features/bookings/presentation/pages/pet_school_bookings_page.dart';
import 'package:petzy_app/features/bookings/presentation/pages/pet_sitter_bookings_page.dart';
import 'package:petzy_app/features/messages/presentation/pages/messages_page.dart';
import 'package:petzy_app/features/onboarding/presentation/pages/onboarding_page.dart';
import 'package:petzy_app/features/pet_setter/presentation/booking_request/pet_sitter_booking_req_details.dart';
import 'package:petzy_app/features/pet_sitter/views/screens/pet_sitter_screen.dart';
import 'package:petzy_app/features/profile/presentation/pages/pet_hotel_profile_page.dart';
import 'package:petzy_app/features/profile/presentation/pages/pet_owner_profile_page.dart';
import 'package:petzy_app/features/pet_school/profile/presentation/pages/pet_school_profile_page.dart';
import 'package:petzy_app/features/profile/presentation/pages/pet_sitter_profile_page.dart';
import 'package:petzy_app/features/settings/presentation/pages/settings_page.dart';
import 'package:petzy_app/features/shorts/presentation/pages/shorts_page.dart';

/// Routes that require authentication OR are accessible to all users.
final protectedRoutes = [
  GoRoute(
    path: AppRoute.home.path,
    name: AppRoute.home.name,
    builder: (final context, final state) => PetSitterScreen(),
  ),
  GoRoute(
    path: AppRoute.shorts.path,
    name: AppRoute.shorts.name,
    builder: (final context, final state) => const ShortsPage(),
  ),
  GoRoute(
    path: AppRoute.messages.path,
    name: AppRoute.messages.name,
    builder: (final context, final state) => const MessagesPage(),
  ),
  // Role-specific bookings pages
  GoRoute(
    path: AppRoute.bookingsOwner.path,
    name: AppRoute.bookingsOwner.name,
    builder: (final context, final state) => const PetOwnerBookingsPage(),
  ),
  GoRoute(
    path: AppRoute.bookingsSitter.path,
    name: AppRoute.bookingsSitter.name,
    builder: (final context, final state) => const PetSitterBookingsPage(),
  ),
  GoRoute(
    path: AppRoute.bookingsSchool.path,
    name: AppRoute.bookingsSchool.name,
    builder: (final context, final state) => const PetSchoolBookingsPage(),
  ),
  GoRoute(
    path: AppRoute.bookingsHotel.path,
    name: AppRoute.bookingsHotel.name,
    builder: (final context, final state) => const PetHotelBookingsPage(),
  ),
  // Generic bookings route (for backward compatibility)
  GoRoute(
    path: AppRoute.bookings.path,
    name: AppRoute.bookings.name,
    builder: (final context, final state) =>
        const PlaceholderPage(title: 'Bookings'),
  ),
  // Role-specific profile pages
  GoRoute(
    path: AppRoute.profileOwner.path,
    name: AppRoute.profileOwner.name,
    builder: (final context, final state) => const PetOwnerProfilePage(),
  ),
  GoRoute(
    path: AppRoute.profileSitter.path,
    name: AppRoute.profileSitter.name,
    builder: (final context, final state) => const PetSitterProfilePage(),
  ),
  GoRoute(
    path: AppRoute.profileSchool.path,
    name: AppRoute.profileSchool.name,
    builder: (final context, final state) => const PetSchoolProfilePage(),
  ),
  GoRoute(
    path: AppRoute.profileHotel.path,
    name: AppRoute.profileHotel.name,
    builder: (final context, final state) => const PetHotelProfilePage(),
  ),
  // Generic profile route (for backward compatibility)
  GoRoute(
    path: AppRoute.profile.path,
    name: AppRoute.profile.name,
    builder: (final context, final state) =>
        const PlaceholderPage(title: 'Profile'),
  ),
  GoRoute(
    path: AppRoute.settings.path,
    name: AppRoute.settings.name,
    builder: (final context, final state) => const SettingsPage(),
  ),
  GoRoute(
    path: AppRoute.onboarding.path,
    name: AppRoute.onboarding.name,
    builder: (final context, final state) => const OnboardingPage(),
  ),
  GoRoute(
    path: AppRoute.bookingDetails.path,
    name: AppRoute.bookingDetails.name,
    builder: (final context, final state) {
      final serviceId = state.extra is String ? state.extra! as String : '';
      return PetSitterBookingReqDetailsPage(serviceId: serviceId);
    },
  ),
];
