import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:petzy_app/core/core.dart';

/// Represents a story for display.
class StoryContent {
  const StoryContent({
    required this.username,
    required this.userImage,
    required this.imageUrl,
    required this.createdAt,
  });

  final String username;
  final String userImage;
  final String imageUrl;
  final DateTime createdAt;
}

/// Page for viewing stories.
class StoriesPage extends StatefulWidget {
  /// Creates a [StoriesPage] instance.
  const StoriesPage({
    required this.stories,
    required this.initialIndex,
    super.key,
  });

  /// List of stories to display.
  final List<StoryContent> stories;

  /// Initial story index to display.
  final int initialIndex;

  @override
  State<StoriesPage> createState() => _StoriesPageState();
}

class _StoriesPageState extends State<StoriesPage> {
  late PageController _pageController;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(final BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Stories page view
          PageView.builder(
            controller: _pageController,
            onPageChanged: (final index) {
              setState(() => _currentIndex = index);
            },
            itemCount: widget.stories.length,
            itemBuilder: (final context, final index) {
              final story = widget.stories[index];
              return _StoryViewer(story: story);
            },
          ),

          // Header with user info and close button
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              bottom: false,
              child: _buildHeader(context),
            ),
          ),

          // Progress bars
          Positioned(
            top: kToolbarHeight,
            left: 0,
            right: 0,
            child: _buildProgressBars(context),
          ),

          // Previous/Next buttons
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Center(
              child: AppIconButton(
                icon: Icons.chevron_left,
                onPressed: _currentIndex > 0
                    ? () => _pageController.previousPage(
                        duration: AppConstants.animationNormal,
                        curve: Curves.easeInOut,
                      )
                    : null,
              ),
            ),
          ),
          Positioned(
            right: 0,
            top: 0,
            bottom: 0,
            child: Center(
              child: AppIconButton(
                icon: Icons.chevron_right,
                onPressed: _currentIndex < widget.stories.length - 1
                    ? () => _pageController.nextPage(
                        duration: AppConstants.animationNormal,
                        curve: Curves.easeInOut,
                      )
                    : null,
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Build the header with user info and close button.
  Widget _buildHeader(final BuildContext context) {
    final story = widget.stories[_currentIndex];

    return Container(
      color: Colors.black87,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          CircleAvatar(
            radius: AppConstants.avatarRadiusSM,
            backgroundImage: CachedNetworkImageProvider(story.userImage),
          ),
          const HorizontalSpace.md(),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  story.username,
                  style: context.textTheme.labelLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  story.createdAt.timeAgo,
                  style: context.textTheme.labelSmall?.copyWith(
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: const Icon(
              Icons.close,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  /// Build progress bars showing story progress.
  Widget _buildProgressBars(final BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: List.generate(
          widget.stories.length,
          (final index) => Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              height: 3,
              decoration: BoxDecoration(
                color: index <= _currentIndex ? Colors.white : Colors.white30,
                borderRadius: BorderRadius.circular(1.5),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Widget displaying a single story.
class _StoryViewer extends StatelessWidget {
  const _StoryViewer({required this.story});

  final StoryContent story;

  @override
  Widget build(final BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.pop(context),
      child: Container(
        color: Colors.black,
        child: CachedNetworkImage(
          imageUrl: story.imageUrl,
          fit: BoxFit.cover,
          placeholder: (final context, final url) =>
              const Center(child: CircularProgressIndicator()),
          errorWidget: (final context, final url, final error) => const Center(
            child: Icon(Icons.image_not_supported, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
