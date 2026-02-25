import 'package:flutter/material.dart';
import 'package:petzy_app/core/extensions/extensions.dart';
import 'package:petzy_app/features/home/presentation/pages/stories_page.dart';

class StoriesRow extends StatelessWidget {
  const StoriesRow({super.key});

  @override
  Widget build(final BuildContext context) {
    return SizedBox(
      height: 100,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: _mockStories.length,
        separatorBuilder: (final context, final index) =>
            const SizedBox(width: 16),
        itemBuilder: (final context, final index) {
          final story = _mockStories[index];
          return GestureDetector(
            onTap: () {
              // Navigate to stories page
              final storiesContent = _mockStories
                  .map(
                    (final s) => StoryContent(
                      username: s.username,
                      userImage: s.imageUrl,
                      imageUrl: s.imageUrl,
                      createdAt: DateTime.now(),
                    ),
                  )
                  .toList();

              Navigator.of(context).push<void>(
                MaterialPageRoute<void>(
                  builder: (final context) => StoriesPage(
                    stories: storiesContent,
                    initialIndex: index,
                  ),
                ),
              );
            },
            child: _StoryItem(story: story),
          );
        },
      ),
    );
  }
}

class _StoryItem extends StatelessWidget {
  const _StoryItem({required this.story});

  final _MockStory story;

  @override
  Widget build(final BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(3),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: story.hasUnseenStory
                  ? context.colorScheme.primary
                  : Colors.grey.shade300,
              width: 2,
            ),
          ),
          child: CircleAvatar(
            radius: 30,
            backgroundImage: NetworkImage(story.imageUrl),
            backgroundColor: Colors.grey.shade200,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          story.username,
          style: context.textTheme.labelSmall,
        ),
      ],
    );
  }
}

class _MockStory {
  const _MockStory({
    required this.username,
    required this.imageUrl,
    this.hasUnseenStory = false,
  });

  final String username;
  final String imageUrl;
  final bool hasUnseenStory;
}

final _mockStories = [
  const _MockStory(
    username: 'My Story',
    imageUrl:
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=150',
    hasUnseenStory: false,
  ),
  const _MockStory(
    username: 'Luna',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150',
    hasUnseenStory: true,
  ),
  const _MockStory(
    username: 'Max',
    imageUrl:
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150',
    hasUnseenStory: true,
  ),
  const _MockStory(
    username: 'Bella',
    imageUrl:
        'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=150',
    hasUnseenStory: true,
  ),
  const _MockStory(
    username: 'Charlie',
    imageUrl:
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150',
    hasUnseenStory: false,
  ),
];
