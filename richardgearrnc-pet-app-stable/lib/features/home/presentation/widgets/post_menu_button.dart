import 'package:flutter/material.dart';
import 'package:petzy_app/core/core.dart';

/// Callback type for post menu actions.
typedef PostMenuAction = Future<void> Function();

/// Menu options for a post.
enum PostMenuOption {
  edit('Edit', Icons.edit_outlined),
  delete('Delete', Icons.delete_outlined),
  report('Report', Icons.flag_outlined)
  ;

  const PostMenuOption(this.label, this.icon);
  final String label;
  final IconData icon;
}

/// Post menu button with options.
class PostMenuButton extends StatelessWidget {
  /// Creates a [PostMenuButton] instance.
  const PostMenuButton({
    required this.onEdit,
    required this.onDelete,
    required this.onReport,
    this.showEdit = true,
    this.showDelete = true,
  });

  /// Callback when edit is selected.
  final PostMenuAction onEdit;

  /// Callback when delete is selected.
  final PostMenuAction onDelete;

  /// Callback when report is selected.
  final PostMenuAction onReport;

  /// Whether to show the edit option.
  final bool showEdit;

  /// Whether to show the delete option.
  final bool showDelete;

  @override
  Widget build(final BuildContext context) {
    return PopupMenuButton<PostMenuOption>(
      onSelected: (final option) => _handleMenuAction(context, option),
      itemBuilder: (final context) => <PopupMenuEntry<PostMenuOption>>[
        if (showEdit)
          PopupMenuItem<PostMenuOption>(
            value: PostMenuOption.edit,
            child: Row(
              children: [
                Icon(
                  PostMenuOption.edit.icon,
                  size: AppConstants.iconSizeMD,
                ),
                const HorizontalSpace.md(),
                Text(PostMenuOption.edit.label),
              ],
            ),
          ),
        if (showDelete)
          PopupMenuItem<PostMenuOption>(
            value: PostMenuOption.delete,
            child: Row(
              children: [
                Icon(
                  PostMenuOption.delete.icon,
                  size: AppConstants.iconSizeMD,
                  color: Colors.red,
                ),
                const HorizontalSpace.md(),
                Text(
                  PostMenuOption.delete.label,
                  style: const TextStyle(color: Colors.red),
                ),
              ],
            ),
          ),
        PopupMenuItem<PostMenuOption>(
          value: PostMenuOption.report,
          child: Row(
            children: [
              Icon(
                PostMenuOption.report.icon,
                size: AppConstants.iconSizeMD,
                color: Colors.orange,
              ),
              const HorizontalSpace.md(),
              Text(
                PostMenuOption.report.label,
                style: const TextStyle(color: Colors.orange),
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// Handle menu action selection.
  Future<void> _handleMenuAction(
    final BuildContext context,
    final PostMenuOption option,
  ) async {
    try {
      switch (option) {
        case PostMenuOption.edit:
          await onEdit();
          break;
        case PostMenuOption.delete:
          // Show confirmation dialog
          final confirmed = await _showConfirmationDialog(
            context,
            'Delete Post',
            'Are you sure you want to delete this post?',
          );
          if (confirmed) {
            await onDelete();
          }
          break;
        case PostMenuOption.report:
          // Show report dialog
          await _showReportDialog(context);
          break;
      }
    } catch (e) {
      if (context.mounted) {
        context.showErrorSnackBar('An error occurred: $e');
      }
    }
  }

  /// Show a confirmation dialog.
  static Future<bool> _showConfirmationDialog(
    final BuildContext context,
    final String title,
    final String message,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (final context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    return result ?? false;
  }

  /// Show a report dialog.
  static Future<void> _showReportDialog(final BuildContext context) async {
    final reason = await showDialog<String>(
      context: context,
      builder: (final context) => _ReportDialog(),
    );

    if (reason != null && reason.isNotEmpty && context.mounted) {
      context.showSnackBar('Post reported: $reason');
      // TODO: Send report to backend
    }
  }
}

/// Dialog for reporting a post.
class _ReportDialog extends StatelessWidget {
  @override
  Widget build(final BuildContext context) {
    final controller = TextEditingController();
    const reasons = [
      'Inappropriate content',
      'Spam',
      'Harassment',
      'Copyright infringement',
      'Other',
    ];

    return AlertDialog(
      title: const Text('Report Post'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Why are you reporting this post?'),
          const VerticalSpace.md(),
          ...reasons.map(
            (final reason) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(reason),
                onTap: () => Navigator.pop(context, reason),
              ),
            ),
          ),
          const VerticalSpace.md(),
          TextField(
            controller: controller,
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Additional details (optional)',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(
                  AppConstants.borderRadiusMD,
                ),
              ),
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () => Navigator.pop(
            context,
            controller.text.isEmpty
                ? 'Other'
                : '${controller.text} (description)',
          ),
          child: const Text('Report'),
        ),
      ],
    );
  }
}
