import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Messages/Chat screen for communicating with other users.
///
/// Features:
/// - List of active conversations
/// - Search conversations
/// - View message counts and last message preview
/// - Access to chat screen (placeholder)
class MessagesPage extends HookConsumerWidget {
  /// Creates a [MessagesPage] instance.
  const MessagesPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final l10n = AppLocalizations.of(context);

    // Track screen view once on mount
    useOnMount(() {
      ref.read(analyticsServiceProvider).logScreenView(screenName: 'messages');
    });

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.messages),
        actions: [
          AppIconButton(
            icon: Icons.add_circle_outline,
            onPressed: () {
              // TODO: Start new conversation
              ref
                  .read(feedbackServiceProvider)
                  .showInfo('Starting new chat...');
            },
          ),
        ],
      ),
      body: ListView(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: AppSearchField(
              hint: l10n.searchMessages,
              onChanged: (final value) {
                // TODO: Filter messages
              },
            ),
          ),

          // Conversations list
          for (final conversation in _mockConversations)
            _ConversationTile(conversation: conversation),
        ],
      ),
    );
  }
}

/// Individual conversation tile widget.
class _ConversationTile extends StatelessWidget {
  const _ConversationTile({required this.conversation});

  final _MockConversation conversation;

  @override
  Widget build(final BuildContext context) {
    final theme = context.theme;

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      leading: CircleAvatar(
        radius: 28,
        backgroundColor: theme.colorScheme.primaryContainer,
        child: Icon(
          Icons.person,
          color: theme.colorScheme.primary,
        ),
      ),
      title: Text(
        conversation.name,
        style: theme.textTheme.bodyLarge?.copyWith(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        conversation.lastMessage,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: theme.textTheme.bodySmall?.copyWith(
          color: theme.colorScheme.onSurfaceVariant,
        ),
      ),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text(
            conversation.time,
            style: theme.textTheme.labelSmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
          if (conversation.unreadCount > 0) ...[
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                conversation.unreadCount.toString(),
                style: theme.textTheme.labelSmall?.copyWith(
                  color: theme.colorScheme.onPrimary,
                ),
              ),
            ),
          ],
        ],
      ),
      onTap: () {
        // TODO: Navigate to chat screen
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Opening chat with ${conversation.name}')),
        );
      },
    );
  }
}

/// Mock conversation data.
class _MockConversation {
  const _MockConversation({
    required this.name,
    required this.lastMessage,
    required this.time,
    required this.unreadCount,
  });

  final String name;
  final String lastMessage;
  final String time;
  final int unreadCount;
}

/// Mock conversations list.
final _mockConversations = [
  _MockConversation(
    name: 'Sarah Johnson',
    lastMessage: 'Thanks for the great service! Luna was very happy.',
    time: '2m',
    unreadCount: 0,
  ),
  _MockConversation(
    name: 'Pet Sitter Mike',
    lastMessage: 'Your dog is doing great! Very well-behaved.',
    time: '1h',
    unreadCount: 1,
  ),
  _MockConversation(
    name: 'Happy Paws School',
    lastMessage: 'Class time scheduled for Friday at 4:00 PM',
    time: '3h',
    unreadCount: 0,
  ),
  _MockConversation(
    name: 'Downtown Pet Hotel',
    lastMessage: 'We have availability for your dates. Want to book?',
    time: '5h',
    unreadCount: 2,
  ),
  _MockConversation(
    name: 'Emma Wilson',
    lastMessage: 'Can you take care of my dog next weekend?',
    time: 'Yesterday',
    unreadCount: 0,
  ),
];
