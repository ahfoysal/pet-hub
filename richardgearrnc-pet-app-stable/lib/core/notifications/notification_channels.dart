import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Default notification channel for Android.
const AndroidNotificationChannel defaultChannel = AndroidNotificationChannel(
  'default_channel',
  'Default Notifications',
  description: 'Default notification channel for general notifications.',
  importance: Importance.defaultImportance,
);

/// High priority notification channel for Android.
const AndroidNotificationChannel highPriorityChannel =
    AndroidNotificationChannel(
      'high_priority_channel',
      'Important Notifications',
      description:
          'Channel for important notifications that require attention.',
      importance: Importance.high,
      playSound: true,
      enableVibration: true,
    );

/// Gets the channel name for a given channel ID.
String getChannelName(final String channelId) {
  switch (channelId) {
    case 'high_priority_channel':
      return highPriorityChannel.name;
    case 'default_channel':
    default:
      return defaultChannel.name;
  }
}
