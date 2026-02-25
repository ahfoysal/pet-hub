import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/home/domain/entities/comment.dart';

/// Individual comment item in a comment list.
class CommentItem extends HookConsumerWidget {
  /// Creates a [CommentItem] instance.
  const CommentItem({
    required this.comment,
    required this.onLikeToggle,
    this.onReply,
  });

  /// The comment data.
  final Comment comment;

  /// Callback when like button is tapped.
  final void Function(bool) onLikeToggle;

  /// Callback when reply button is tapped.
  final VoidCallback? onReply;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final isLiked = useState(comment.isLiked);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // User info and comment header
          Row(
            children: [
              CircleAvatar(
                radius: AppConstants.avatarRadiusSM,
                backgroundColor: context.colorScheme.primaryContainer,
                backgroundImage: comment.user.image != null
                    ? CachedNetworkImageProvider(comment.user.image!)
                    : null,
              ),
              const HorizontalSpace.sm(),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      comment.user.fullName,
                      style: context.textTheme.labelMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      comment.createdAt?.timeAgo ?? 'just now',
                      style: context.textTheme.labelSmall?.copyWith(
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const VerticalSpace.sm(),

          // Comment text
          Text(
            comment.content,
            style: context.textTheme.bodySmall,
          ),
          const VerticalSpace.sm(),

          // Comment actions (like and reply)
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  isLiked.value = !isLiked.value;
                  onLikeToggle(isLiked.value);
                },
                child: Row(
                  children: [
                    Icon(
                      isLiked.value ? Icons.favorite : Icons.favorite_outline,
                      size: AppConstants.iconSizeSM,
                      color: isLiked.value ? Colors.red : null,
                    ),
                    const HorizontalSpace.xs(),
                    Text(
                      '${comment.likeCount + (isLiked.value && !comment.isLiked ? 1 : 0)}',
                      style: context.textTheme.labelSmall,
                    ),
                  ],
                ),
              ),
              const HorizontalSpace.lg(),
              if (onReply != null)
                GestureDetector(
                  onTap: onReply,
                  child: Row(
                    children: [
                      Icon(
                        Icons.reply_outlined,
                        size: AppConstants.iconSizeSM,
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                      const HorizontalSpace.xs(),
                      Text(
                        'Reply',
                        style: context.textTheme.labelSmall?.copyWith(
                          color: context.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
