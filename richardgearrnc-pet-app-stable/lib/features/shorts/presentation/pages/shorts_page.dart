import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Shorts/Reels screen showing short-form video content like Instagram Reels.
///
/// Features:
/// - Vertical scrolling through short videos (mocked with images)
/// - Like, comment, share actions per video
/// - Accessible to all users (logged in and anonymous)
class ShortsPage extends HookConsumerWidget {
  /// Creates a [ShortsPage] instance.
  const ShortsPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final l10n = AppLocalizations.of(context);

    // Track screen view once on mount
    useOnMount(() {
      ref.read(analyticsServiceProvider).logScreenView(screenName: 'shorts');
    });

    return Material(
      color: Colors.black, // Shorts usually have dark background
      child: Stack(
        children: [
          // Content
          PageView.builder(
            scrollDirection: Axis.vertical,
            itemCount: _mockShorts.length,
            itemBuilder: (final context, final index) {
              final short = _mockShorts[index];
              return _ShortCard(short: short);
            },
          ),

          // Custom App Bar Overlay
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Title
                    Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: Text(
                        l10n.shorts,
                        style: context.textTheme.titleLarge?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),

                    // Actions
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.search_outlined),
                          color: Colors.white,
                          onPressed: () {
                            // TODO: Implement search for shorts
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.camera_alt_outlined),
                          color: Colors.white,
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Individual short/reel card widget.
class _ShortCard extends ConsumerWidget {
  const _ShortCard({required this.short});

  final _MockShort short;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final theme = context.theme;

    return Stack(
      fit: StackFit.expand,
      children: [
        // Background image (Mocking video content)
        Image.network(
          short.imageAsset, // Using network URL
          fit: BoxFit.cover,
          loadingBuilder: (final context, final child, final loadingProgress) {
            if (loadingProgress == null) return child;
            return Container(
              color: Colors.black,
              child: const Center(
                child: CircularProgressIndicator(color: Colors.white),
              ),
            );
          },
          errorBuilder: (final context, final error, final stackTrace) =>
              Container(
                color: Colors.grey.shade900,
                child: const Center(
                  child: Icon(Icons.error, color: Colors.white),
                ),
              ),
        ),

        // Bottom gradient overlay for text readability
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.black.withValues(alpha: 0.2),
                Colors.transparent,
                Colors.black.withValues(alpha: 0.8),
              ],
              stops: const [0.0, 0.5, 1.0],
            ),
          ),
        ),

        // Content overlay
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // User info
                Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundImage: NetworkImage(short.userImage),
                      backgroundColor: Colors.grey.shade300,
                    ),
                    const HorizontalSpace.sm(),
                    Expanded(
                      child: Text(
                        short.username,
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    OutlinedButton(
                      onPressed: () {},
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.white),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 0,
                        ),
                        minimumSize: const Size(0, 32),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: const Text(
                        'Follow',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ],
                ),
                const VerticalSpace.sm(),

                // Description
                Text(
                  short.description,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.white,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const VerticalSpace.sm(),

                // Hashtags
                Text(
                  short.hashtags.join(' '),
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(
                  height: 60,
                ), // Space for bottom navbar if translucent, or just padding
              ],
            ),
          ),
        ),

        // Right side action buttons
        Positioned(
          right: 12,
          bottom: 120, // Adjusted to sit above bottom nav/text
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _ActionButton(
                icon: Icons.favorite,
                label: short.likes.toString(),
                color: Colors.red,
                onPressed: () {},
              ),
              const SizedBox(height: 16),
              _ActionButton(
                icon: Icons.comment,
                label: short.comments.toString(),
                onPressed: () {},
              ),
              const SizedBox(height: 16),
              _ActionButton(
                icon: Icons.share,
                label: 'Share',
                onPressed: () {},
              ),
              const SizedBox(height: 16),
              _ActionButton(
                icon: Icons.more_vert,
                label: '',
                onPressed: () {},
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Action button for shorts (like, comment, share).
class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.color = Colors.white,
  });

  final IconData icon;
  final String label;
  final VoidCallback onPressed;
  final Color color;

  @override
  Widget build(final BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: color,
              size: 30,
            ),
          ),
          if (label.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              label,
              style: context.textTheme.labelSmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Mock data for shorts.
class _MockShort {
  const _MockShort({
    required this.username,
    required this.userImage,
    required this.location,
    required this.description,
    required this.imageAsset,
    required this.hashtags,
    required this.likes,
    required this.comments,
  });

  final String username;
  final String userImage;
  final String location;
  final String description;
  final String imageAsset;
  final List<String> hashtags;
  final int likes;
  final int comments;
}

/// Mock shorts data.
final _mockShorts = [
  const _MockShort(
    username: 'Luna & Sarah',
    userImage:
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150',
    location: 'Central Dog Park',
    description: 'Playing fetch in the park! 🎾 #doglife',
    imageAsset:
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80', // Vertical dog video/image
    hashtags: ['#dogpark', '#fetch', '#happy'],
    likes: 1205,
    comments: 45,
  ),
  const _MockShort(
    username: 'Max',
    userImage:
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150',
    location: 'Beach',
    description: 'Beach vibes 🌊☀️',
    imageAsset:
        'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&q=80', // Vertical dog beach
    hashtags: ['#beach', '#golden', '#summer'],
    likes: 890,
    comments: 23,
  ),
  const _MockShort(
    username: 'Bella',
    userImage:
        'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=150',
    location: 'Home',
    description: 'Sleepy Sunday... 😴',
    imageAsset:
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&q=80', // Vertical sleeping dog
    hashtags: ['#naptime', '#cute', '#bulldog'],
    likes: 2400,
    comments: 112,
  ),
];
