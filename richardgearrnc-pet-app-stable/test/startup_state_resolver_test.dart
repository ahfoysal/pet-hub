import 'package:flutter_test/flutter_test.dart';
import 'package:petzy_app/app/startup/startup_signals.dart';
import 'package:petzy_app/app/startup/startup_state_machine.dart';
import 'package:petzy_app/app/startup/startup_state_resolver.dart';

void main() {
  group('StartupStateResolver', () {
    test('maintenance mode always wins', () {
      final state = StartupStateResolver.resolve(
        const StartupSignals(
          isAuthenticated: true,
          hasCompletedOnboarding: true,
          isInMaintenance: true, // Maintenance enabled
          isOnboardingEnabled: true,
          isAuthEnabled: true,
        ),
      );

      expect(state, isA<MaintenanceState>());
    });

    test('onboarding comes before auth', () {
      final state = StartupStateResolver.resolve(
        const StartupSignals(
          isAuthenticated: false,
          hasCompletedOnboarding: false, // Not completed
          isInMaintenance: false,
          isOnboardingEnabled: true, // Enabled
          isAuthEnabled: true,
        ),
      );

      expect(state, isA<OnboardingState>());
    });

    test('skips onboarding when completed', () {
      final state = StartupStateResolver.resolve(
        const StartupSignals(
          isAuthenticated: false,
          hasCompletedOnboarding: true, // Completed
          isInMaintenance: false,
          isOnboardingEnabled: true,
          isAuthEnabled: true,
        ),
      );

      expect(state, isA<UnauthenticatedState>());
    });

    test('skips onboarding when disabled', () {
      final state = StartupStateResolver.resolve(
        const StartupSignals(
          isAuthenticated: false,
          hasCompletedOnboarding: false,
          isInMaintenance: false,
          isOnboardingEnabled: false, // Disabled
          isAuthEnabled: true,
        ),
      );

      expect(state, isA<UnauthenticatedState>());
    });

    test('returns PublicState when auth disabled', () {
      final state = StartupStateResolver.resolve(
        const StartupSignals(
          isAuthenticated: false,
          hasCompletedOnboarding: true,
          isInMaintenance: false,
          isOnboardingEnabled: false,
          isAuthEnabled: false, // Auth disabled
        ),
      );

      expect(state, isA<PublicState>());
    });

    test('returns UnauthenticatedState when not logged in', () {
      final state = StartupStateResolver.resolve(
        const StartupSignals(
          isAuthenticated: false, // Not authenticated
          hasCompletedOnboarding: true,
          isInMaintenance: false,
          isOnboardingEnabled: false,
          isAuthEnabled: true,
        ),
      );

      expect(state, isA<UnauthenticatedState>());
    });

    test('returns AuthenticatedState when logged in', () {
      final state = StartupStateResolver.resolve(
        const StartupSignals(
          isAuthenticated: true, // Authenticated
          hasCompletedOnboarding: true,
          isInMaintenance: false,
          isOnboardingEnabled: false,
          isAuthEnabled: true,
        ),
      );

      expect(state, isA<AuthenticatedState>());
    });

    test('full happy path - authenticated user', () {
      final state = StartupStateResolver.resolve(
        const StartupSignals(
          isAuthenticated: true,
          hasCompletedOnboarding: true,
          isInMaintenance: false,
          isOnboardingEnabled: true,
          isAuthEnabled: true,
        ),
      );

      expect(state, isA<AuthenticatedState>());
    });
  });

  group('StartupSignals', () {
    test('equality works correctly', () {
      const signals1 = StartupSignals(
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        isInMaintenance: false,
        isOnboardingEnabled: true,
        isAuthEnabled: true,
      );

      const signals2 = StartupSignals(
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        isInMaintenance: false,
        isOnboardingEnabled: true,
        isAuthEnabled: true,
      );

      expect(signals1, equals(signals2));
      expect(signals1.hashCode, equals(signals2.hashCode));
    });

    test('toString includes all fields', () {
      const signals = StartupSignals(
        isAuthenticated: true,
        hasCompletedOnboarding: false,
        isInMaintenance: false,
        isOnboardingEnabled: true,
        isAuthEnabled: true,
      );

      final str = signals.toString();
      expect(str, contains('isAuthenticated: true'));
      expect(str, contains('hasCompletedOnboarding: false'));
      expect(str, contains('isInMaintenance: false'));
      expect(str, contains('isOnboardingEnabled: true'));
      expect(str, contains('isAuthEnabled: true'));
    });
  });
}
