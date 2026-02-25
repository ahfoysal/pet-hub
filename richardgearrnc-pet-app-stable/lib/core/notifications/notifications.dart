/// Notification services for local and push notifications.
///
/// This module provides:
/// - Local notifications (always available)
/// - Push notifications (requires Firebase setup)
/// - Badge counter (app icon badge management)
library;

export 'badge_counter.dart';
export 'local_notification_service.dart';
export 'notification_channels.dart';
export 'notification_config.dart';
export 'push_notification_service.dart';
