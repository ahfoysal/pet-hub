import 'package:flutter_test/flutter_test.dart';
import 'package:petzy_app/core/session/session_state.dart';

void main() {
  group('SessionState', () {
    group('SessionLoading', () {
      test('isAuthenticated returns false', () {
        const state = SessionLoading();
        expect(state.isAuthenticated, false);
      });

      test('isLoading returns true', () {
        const state = SessionLoading();
        expect(state.isLoading, true);
      });

      test('isExpired returns false', () {
        const state = SessionLoading();
        expect(state.isExpired, false);
      });

      test('toString formats correctly', () {
        const state = SessionLoading();
        expect(state.toString(), 'SessionLoading()');
      });
    });

    group('SessionActive', () {
      test('isAuthenticated returns true', () {
        const state = SessionActive(userId: 'user123');
        expect(state.isAuthenticated, true);
      });

      test('isLoading returns false', () {
        const state = SessionActive(userId: 'user123');
        expect(state.isLoading, false);
      });

      test('isExpired returns false', () {
        const state = SessionActive(userId: 'user123');
        expect(state.isExpired, false);
      });

      test('contains userId', () {
        const state = SessionActive(userId: 'user123');
        expect(state.userId, 'user123');
      });

      test('isExpiringSoon returns false when no expiresAt', () {
        const state = SessionActive(userId: 'user123');
        expect(state.isExpiringSoon, false);
      });

      test('isExpiringSoon returns true when expiring within 5 minutes', () {
        final state = SessionActive(
          userId: 'user123',
          expiresAt: DateTime.now().add(const Duration(minutes: 3)),
        );
        expect(state.isExpiringSoon, true);
      });

      test('isExpiringSoon returns false when more than 5 minutes away', () {
        final state = SessionActive(
          userId: 'user123',
          expiresAt: DateTime.now().add(const Duration(minutes: 10)),
        );
        expect(state.isExpiringSoon, false);
      });
    });

    group('SessionInactive', () {
      test('isAuthenticated returns false', () {
        const state = SessionInactive();
        expect(state.isAuthenticated, false);
      });

      test('isLoading returns false', () {
        const state = SessionInactive();
        expect(state.isLoading, false);
      });

      test('isExpired returns false', () {
        const state = SessionInactive();
        expect(state.isExpired, false);
      });

      test('toString formats correctly', () {
        const state = SessionInactive();
        expect(state.toString(), 'SessionInactive()');
      });
    });

    group('SessionExpired', () {
      test('isAuthenticated returns false', () {
        const state = SessionExpired();
        expect(state.isAuthenticated, false);
      });

      test('isLoading returns false', () {
        const state = SessionExpired();
        expect(state.isLoading, false);
      });

      test('isExpired returns true', () {
        const state = SessionExpired();
        expect(state.isExpired, true);
      });

      test('contains reason when provided', () {
        const state = SessionExpired(reason: 'Token expired');
        expect(state.reason, 'Token expired');
      });

      test('toString formats correctly with reason', () {
        const state = SessionExpired(reason: 'Token expired');
        expect(state.toString(), 'SessionExpired(reason: Token expired)');
      });

      test('toString formats correctly without reason', () {
        const state = SessionExpired();
        expect(state.toString(), 'SessionExpired(reason: null)');
      });
    });
  });
}
