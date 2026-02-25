import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/app/startup/startup_state_machine.dart';

/// Maps startup states to their corresponding routes.
class StartupRouteMapper {
  const StartupRouteMapper._();

  /// Get the route for a given startup state.
  static String map(final StartupState state) {
    return switch (state) {
      MaintenanceState() => AppRoute.maintenance.path,
      ForceUpdateState() => AppRoute.forceUpdate.path,
      OnboardingState() => AppRoute.onboarding.path,
      UnauthenticatedState() => AppRoute.login.path,
      AuthenticatedState() => AppRoute.home.path,
      PublicState() => AppRoute.home.path,
    };
  }
}
