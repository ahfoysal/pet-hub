import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/core/enums/user_role.dart';

/// Extensions for [UserRole] to provide role-specific navigation routes.
extension UserRoleNavigation on UserRole {
  /// Get the role-specific profile route.
  AppRoute get profileRoute {
    return switch (this) {
      UserRole.petOwner => AppRoute.profileOwner,
      UserRole.petSitter => AppRoute.profileSitter,
      UserRole.petSchool => AppRoute.profileSchool,
      UserRole.petHotel => AppRoute.profileHotel,
    };
  }

  /// Get the role-specific bookings route.
  AppRoute get bookingsRoute {
    return switch (this) {
      UserRole.petOwner => AppRoute.bookingsOwner,
      UserRole.petSitter => AppRoute.bookingsSitter,
      UserRole.petSchool => AppRoute.bookingsSchool,
      UserRole.petHotel => AppRoute.bookingsHotel,
    };
  }

  /// Get the default route to navigate to after login for this role.
  /// Currently returns the profile route, but can be customized per role.
  AppRoute get defaultRoute {
    // You can customize this to go to different pages for different roles
    // For example, pet owners might go to home, while service providers go to bookings
    return switch (this) {
      UserRole.petOwner => AppRoute.home,
      UserRole.petSitter => profileRoute,
      UserRole.petSchool => profileRoute,
      UserRole.petHotel => profileRoute,
    };
  }
}
