import 'package:flutter_test/flutter_test.dart';
import 'package:petzy_app/app/startup/startup_events.dart';

void main() {
  group('StartupEvent', () {
    group('AppLaunched', () {
      test('creates correctly', () {
        const event = AppLaunched();
        expect(event.toString(), 'AppLaunched()');
      });
    });

    group('SessionRestored', () {
      test('contains userId', () {
        const event = SessionRestored(userId: 'user123');
        expect(event.userId, 'user123');
        expect(event.toString(), 'SessionRestored(userId: user123)');
      });
    });

    group('UserAuthenticated', () {
      test('contains userId', () {
        const event = UserAuthenticated(userId: 'user456');
        expect(event.userId, 'user456');
        expect(event.toString(), 'UserAuthenticated(userId: user456)');
      });
    });

    group('UserLoggedOut', () {
      test('creates correctly', () {
        const event = UserLoggedOut();
        expect(event.toString(), 'UserLoggedOut()');
      });
    });

    group('SessionExpiredEvent', () {
      test('creates with reason', () {
        const event = SessionExpiredEvent(reason: 'Token expired');
        expect(event.reason, 'Token expired');
        expect(event.toString(), 'SessionExpiredEvent(reason: Token expired)');
      });

      test('creates without reason', () {
        const event = SessionExpiredEvent();
        expect(event.reason, isNull);
        expect(event.toString(), 'SessionExpiredEvent(reason: null)');
      });
    });

    group('OnboardingCompleted', () {
      test('creates correctly', () {
        const event = OnboardingCompleted();
        expect(event.toString(), 'OnboardingCompleted()');
      });
    });

    group('MaintenanceEnabled', () {
      test('creates with message', () {
        const event = MaintenanceEnabled(message: 'System maintenance');
        expect(event.message, 'System maintenance');
        expect(
          event.toString(),
          'MaintenanceEnabled(message: System maintenance)',
        );
      });

      test('creates without message', () {
        const event = MaintenanceEnabled();
        expect(event.message, isNull);
      });
    });

    group('MaintenanceDisabled', () {
      test('creates correctly', () {
        const event = MaintenanceDisabled();
        expect(event.toString(), 'MaintenanceDisabled()');
      });
    });

    group('RemoteConfigUpdated', () {
      test('creates correctly', () {
        const event = RemoteConfigUpdated();
        expect(event.toString(), 'RemoteConfigUpdated()');
      });
    });

    group('DeepLinkReceived', () {
      test('contains path', () {
        const event = DeepLinkReceived(path: '/product/123');
        expect(event.path, '/product/123');
        expect(event.toString(), 'DeepLinkReceived(path: /product/123)');
      });
    });
  });
}
