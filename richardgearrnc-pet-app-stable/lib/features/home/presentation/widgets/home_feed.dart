import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:share_plus/share_plus.dart' as share;
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/auth/presentation/providers/auth_notifier.dart';
import 'package:petzy_app/features/home/domain/entities/post.dart';
import 'package:petzy_app/features/home/presentation/widgets/comments_bottom_sheet_container.dart';
import 'package:petzy_app/features/home/presentation/widgets/post_menu_button.dart';

/// Callback types for post actions.
typedef OnLikeToggle = Future<void> Function(bool);
typedef OnSaveToggle = Future<void> Function(bool);
typedef OnPostEdit = Future<void> Function();
typedef OnPostDelete = Future<void> Function();
typedef OnPostReport = Future<void> Function();
typedef OnViewComments = Future<void> Function(String postId);
typedef OnAddComment = Future<void> Function(String postId, String text);
typedef OnCommentLike = Future<void> Function(String commentId, bool isLiked);
typedef OnSharePost = Future<void> Function(String postId, String postUrl);

/// Individual post card in the feed.
class PostCard extends HookConsumerWidget {
  /// Creates a [PostCard] instance.
  const PostCard({
    required this.post,
    required this.onLikeToggle,
    required this.onSaveToggle,
    this.onEdit,
    this.onDelete,
    this.onReport,
    this.onViewComments,
    this.onAddComment,
    this.onCommentLike,
    this.onShare,
    this.isCurrentUser = false,
  });

  /// The post data.
  final Post post;

  /// Callback when like button is tapped.
  final OnLikeToggle onLikeToggle;

  /// Callback when save button is tapped.
  final OnSaveToggle onSaveToggle;

  /// Callback when edit button is tapped.
  final OnPostEdit? onEdit;

  /// Callback when delete button is tapped.
  final OnPostDelete? onDelete;

  /// Callback when report button is tapped.
  final OnPostReport? onReport;

  /// Callback when view comments is tapped.
  final OnViewComments? onViewComments;

  /// Callback when a comment is added.
  final OnAddComment? onAddComment;

  /// Callback when a comment is liked.
  final OnCommentLike? onCommentLike;

  /// Callback when share button is tapped.
  final OnSharePost? onShare;

  /// Whether this post is owned by the current user.
  final bool isCurrentUser;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final isLiked = useState(post.isLiked);
    final isSaved = useState(post.isSaved);
    final currentImageIndex = useState(0);

    // Check if user is authenticated
    final authState = ref.watch(authProvider);
    final isAuthenticated = authState.maybeWhen(
      data: (final user) => user != null,
      orElse: () => false,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Post header with user info and menu
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: AppConstants.avatarRadiusMD,
                backgroundColor: context.colorScheme.primaryContainer,
                backgroundImage: post.user.image != null
                    ? CachedNetworkImageProvider(post.user.image!)
                    : null,
              ),
              const HorizontalSpace.md(),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name and username
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            post.user.fullName,
                            style: context.textTheme.labelLarge?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    // Username
                    Text(
                      '@${post.user.userName}',
                      style: context.textTheme.labelSmall?.copyWith(
                        color: context.colorScheme.onSurfaceVariant,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const VerticalSpace.xs(),
                    // Time and location
                    Row(
                      children: [
                        Text(
                          post.createdAt.timeAgo,
                          style: context.textTheme.labelSmall?.copyWith(
                            color: context.colorScheme.onSurfaceVariant,
                          ),
                        ),
                        if (post.location?.isNotEmpty ?? false) ...[
                          const HorizontalSpace.xs(),
                          Text(
                            '•',
                            style: context.textTheme.labelSmall?.copyWith(
                              color: context.colorScheme.onSurfaceVariant,
                            ),
                          ),
                          const HorizontalSpace.xs(),
                          Expanded(
                            child: Text(
                              post.location ?? '',
                              style: context.textTheme.labelSmall?.copyWith(
                                color: context.colorScheme.onSurfaceVariant,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              if (onEdit != null || onDelete != null || onReport != null)
                PostMenuButton(
                  showEdit: isCurrentUser,
                  showDelete: isCurrentUser,
                  onEdit: onEdit ?? () async {},
                  onDelete: onDelete ?? () async {},
                  onReport: onReport ?? () async {},
                )
              else
                AppIconButton(
                  icon: Icons.more_vert,
                  onPressed: () {},
                ),
            ],
          ),
        ),

        // Post image carousel with swipe support
        if (post.media.isNotEmpty)
          GestureDetector(
            onHorizontalDragEnd: (final details) {
              // Swipe left = next image
              if (details.velocity.pixelsPerSecond.dx < -500) {
                if (currentImageIndex.value < post.media.length - 1) {
                  currentImageIndex.value++;
                }
              }
              // Swipe right = previous image
              else if (details.velocity.pixelsPerSecond.dx > 500) {
                if (currentImageIndex.value > 0) {
                  currentImageIndex.value--;
                }
              }
            },
            child: Stack(
              children: [
                Container(
                  width: double.infinity,
                  height: AppConstants.postImageHeight,
                  color: context.colorScheme.surfaceContainer,
                  child: CachedNetworkImage(
                    imageUrl: post.media[currentImageIndex.value],
                    fit: BoxFit.cover,
                    placeholder: (final context, final url) =>
                        const LoadingWidget(),
                    errorWidget: (final context, final url, final error) =>
                        const Icon(Icons.image_not_supported),
                  ),
                ),
                // Image indicator dots
                if (post.media.length > 1)
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadiusMD,
                        ),
                      ),
                      child: Text(
                        '${currentImageIndex.value + 1}/${post.media.length}',
                        style: context.textTheme.labelSmall?.copyWith(
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                // Image navigation arrows (kept for accessibility)
                if (post.media.length > 1)
                  Positioned(
                    left: 0,
                    top: 0,
                    bottom: 0,
                    child: Center(
                      child: AppIconButton(
                        icon: Icons.chevron_left,
                        onPressed: () {
                          if (currentImageIndex.value > 0) {
                            currentImageIndex.value--;
                          }
                        },
                      ),
                    ),
                  ),
                if (post.media.length > 1)
                  Positioned(
                    right: 0,
                    top: 0,
                    bottom: 0,
                    child: Center(
                      child: AppIconButton(
                        icon: Icons.chevron_right,
                        onPressed: () {
                          if (currentImageIndex.value < post.media.length - 1) {
                            currentImageIndex.value++;
                          }
                        },
                      ),
                    ),
                  ),
              ],
            ),
          ),

        // Post actions and stats
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Action buttons
              Row(
                children: [
                  GestureDetector(
                    onTap: () async {
                      isLiked.value = !isLiked.value;
                      await onLikeToggle(isLiked.value);
                    },
                    child: Row(
                      children: [
                        Icon(
                          isLiked.value
                              ? Icons.favorite
                              : Icons.favorite_outline,
                          color: isLiked.value ? Colors.red : null,
                          size: AppConstants.iconSizeMD,
                        ),
                        const HorizontalSpace.xs(),
                        Text(
                          '${post.likeCount + (isLiked.value && !post.isLiked ? 1 : 0)}',
                          style: context.textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                  const HorizontalSpace.lg(),
                  GestureDetector(
                    onTap: isAuthenticated && onViewComments != null
                        ? () async {
                            if (context.mounted) {
                              await showModalBottomSheet<void>(
                                context: context,
                                isScrollControlled: true,
                                backgroundColor: Colors.transparent,
                                builder: (final _) {
                                  return CommentsBottomSheetContainer(
                                    postId: post.id,
                                    onAddComment: (final text) async {
                                      if (onAddComment != null) {
                                        await onAddComment!(post.id, text);
                                      }
                                    },
                                    onCommentLikeToggle:
                                        (final commentId, final isLiked) async {
                                          if (onCommentLike != null) {
                                            await onCommentLike!(
                                              commentId,
                                              isLiked,
                                            );
                                          }
                                        },
                                  );
                                },
                              );
                            }
                          }
                        : (isAuthenticated || onViewComments == null)
                        ? null
                        : () {
                            context.showSnackBar(
                              'Please login to view comments',
                              duration: const Duration(seconds: 2),
                            );
                          },
                    child: Row(
                      children: [
                        const Icon(Icons.comment_outlined, size: 24),
                        const HorizontalSpace.xs(),
                        Text(
                          '${post.commentCount}',
                          style: context.textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                  const HorizontalSpace.lg(),
                  GestureDetector(
                    onTap: onShare != null
                        ? () async {
                            final postUrl =
                                'https://petzy.app/posts/${post.id}';
                            try {
                              await share.Share.share(
                                '${post.user.fullName} shared a post: ${post.caption}\n\n$postUrl',
                                subject: 'Check out this post on Petzy',
                              );
                              await onShare!(post.id, postUrl);
                            } catch (e) {
                              context.showErrorSnackBar(
                                'Failed to share: $e',
                              );
                            }
                          }
                        : null,
                    child: const Icon(Icons.share_outlined, size: 24),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () async {
                      isSaved.value = !isSaved.value;
                      await onSaveToggle(isSaved.value);
                    },
                    child: Icon(
                      isSaved.value ? Icons.bookmark : Icons.bookmark_outline,
                      size: AppConstants.iconSizeMD,
                    ),
                  ),
                ],
              ),
              const VerticalSpace.md(),

              // Post description
              if (post.caption?.isNotEmpty ?? false)
                Text(
                  post.caption ?? '',
                  style: context.textTheme.bodyMedium,
                ),
              const VerticalSpace.md(),

              // View comments link
              if (post.commentCount > 0)
                GestureDetector(
                  onTap: isAuthenticated && onViewComments != null
                      ? () async {
                          if (context.mounted) {
                            await showModalBottomSheet<void>(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (final _) {
                                return CommentsBottomSheetContainer(
                                  postId: post.id,
                                  onAddComment: (final text) async {
                                    if (onAddComment != null) {
                                      await onAddComment!(post.id, text);
                                    }
                                  },
                                  onCommentLikeToggle:
                                      (final commentId, final isLiked) async {
                                        if (onCommentLike != null) {
                                          await onCommentLike!(
                                            commentId,
                                            isLiked,
                                          );
                                        }
                                      },
                                );
                              },
                            );
                          }
                        }
                      : (isAuthenticated || onViewComments == null)
                      ? null
                      : () {
                          context.showSnackBar(
                            'Please login to view comments',
                            duration: const Duration(seconds: 2),
                          );
                        },
                  child: Text(
                    'View all ${post.commentCount} comment${post.commentCount > 1 ? 's' : ''}',
                    style: context.textTheme.labelSmall?.copyWith(
                      color: context.colorScheme.primary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
            ],
          ),
        ),

        // Divider
        const Divider(height: 1, indent: 0, endIndent: 0),
      ],
    );
  }
}
