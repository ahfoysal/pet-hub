import 'package:flutter/material.dart';
import 'package:petzy_app/core/constants/app_constants.dart';
import 'package:petzy_app/core/extensions/context_extensions.dart';
import 'package:petzy_app/core/widgets/buttons.dart';
import 'package:petzy_app/core/widgets/spacing.dart';

/// Helper class for showing bottom sheets with consistent styling.
abstract class AppBottomSheets {
  /// Shows a modal bottom sheet.
  static Future<T?> show<T>(
    final BuildContext context, {
    required final Widget child,
    final bool isDismissible = true,
    final bool enableDrag = true,
    final bool isScrollControlled = false,
    final bool useSafeArea = true,
    final Color? backgroundColor,
    final double? elevation,
    final ShapeBorder? shape,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isDismissible: isDismissible,
      enableDrag: enableDrag,
      isScrollControlled: isScrollControlled,
      useSafeArea: useSafeArea,
      backgroundColor: backgroundColor,
      elevation: elevation,
      shape:
          shape ??
          const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(AppConstants.borderRadiusXLarge),
            ),
          ),
      builder: (final context) => child,
    );
  }

  /// Shows a confirmation bottom sheet.
  static Future<bool?> confirm(
    final BuildContext context, {
    required final String title,
    final String? message,
    final String confirmText = 'Confirm',
    final String cancelText = 'Cancel',
    final bool isDangerous = false,
  }) {
    final theme = context.theme;

    return show<bool>(
      context,
      child: SafeArea(
        child: ResponsivePadding(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.lg,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Handle bar
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.outlineVariant,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const VerticalSpace.lg(),
              Text(
                title,
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              if (message != null) ...[
                const VerticalSpace.sm(),
                Text(
                  message,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
              const VerticalSpace.xl(),
              AppButton(
                variant: AppButtonVariant.primary,
                onPressed: () => Navigator.of(context).pop(true),
                label: confirmText,
              ),
              const VerticalSpace.sm(),
              AppButton(
                variant: AppButtonVariant.text,
                onPressed: () => Navigator.of(context).pop(false),
                label: cancelText,
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Shows an action sheet with multiple options.
  static Future<T?> actions<T>(
    final BuildContext context, {
    final String? title,
    required final List<BottomSheetAction<T>> actions,
    final bool showCancel = true,
    final String cancelText = 'Cancel',
  }) {
    final theme = context.theme;

    return show<T>(
      context,
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            const VerticalSpace.sm(),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: theme.colorScheme.outlineVariant,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            if (title != null) ...[
              const VerticalSpace.md(),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: Text(
                  title,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
            const VerticalSpace.sm(),
            ...actions.map(
              (final action) => ListTile(
                leading: action.icon != null
                    ? Icon(
                        action.icon,
                        color: action.isDestructive
                            ? theme.colorScheme.error
                            : null,
                      )
                    : null,
                title: Text(
                  action.label,
                  style: action.isDestructive
                      ? TextStyle(color: theme.colorScheme.error)
                      : null,
                ),
                subtitle: action.subtitle != null
                    ? Text(action.subtitle!)
                    : null,
                onTap: () => Navigator.of(context).pop(action.value),
              ),
            ),
            if (showCancel) ...[
              const Divider(),
              ListTile(
                title: Text(
                  cancelText,
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyLarge,
                ),
                onTap: () => Navigator.of(context).pop(),
              ),
            ],
            const VerticalSpace.sm(),
          ],
        ),
      ),
    );
  }
}

/// An action for action sheets.
class BottomSheetAction<T> {
  /// Creates a [BottomSheetAction].
  const BottomSheetAction({
    required this.value,
    required this.label,
    this.icon,
    this.subtitle,
    this.isDestructive = false,
  });

  /// The value returned when this action is selected.
  final T value;

  /// Display label for the action.
  final String label;

  /// Optional icon for the action.
  final IconData? icon;

  /// Optional subtitle for the action.
  final String? subtitle;

  /// Whether this is a destructive action (shown in red).
  final bool isDestructive;
}
