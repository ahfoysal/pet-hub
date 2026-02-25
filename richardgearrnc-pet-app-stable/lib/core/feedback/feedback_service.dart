import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/core/constants/app_constants.dart';
import 'package:petzy_app/core/feedback/feedback_config.dart';
import 'package:petzy_app/core/widgets/spacing.dart';

/// Service for showing dialogs and snackbars without BuildContext.
///
/// Uses the global [rootNavigatorKey] from GoRouter to access the overlay.
class FeedbackService {
  /// Creates a [FeedbackService] instance.
  FeedbackService();

  ScaffoldMessengerState? get _scaffoldMessenger {
    final context = rootNavigatorKey.currentContext;
    if (context == null) return null;
    return ScaffoldMessenger.maybeOf(context);
  }

  NavigatorState? get _navigator => rootNavigatorKey.currentState;

  /// Show a snackbar with the given configuration.
  void showSnackbar(final SnackbarConfig config) {
    final messenger = _scaffoldMessenger;
    if (messenger == null) return;

    final snackBar = SnackBar(
      content: Text(config.message),
      duration: config.duration,
      backgroundColor: _getBackgroundColor(config.type),
      behavior: SnackBarBehavior.floating,
      dismissDirection: config.dismissible
          ? DismissDirection.horizontal
          : DismissDirection.none,
      action: config.action != null && config.actionLabel != null
          ? SnackBarAction(
              label: config.actionLabel!,
              textColor: Colors.white,
              onPressed: config.action!,
            )
          : null,
    );

    messenger
      ..hideCurrentSnackBar()
      ..showSnackBar(snackBar);
  }

  /// Show a success snackbar.
  void showSuccess(final String message, {final Duration? duration}) {
    showSnackbar(
      SnackbarConfig(
        message: message,
        type: SnackbarType.success,
        duration: duration ?? AppConstants.snackbarDefaultDuration,
      ),
    );
  }

  /// Show an error snackbar.
  void showError(final String message, {final VoidCallback? onRetry}) {
    showSnackbar(
      SnackbarConfig(
        message: message,
        type: SnackbarType.error,
        duration: AppConstants.snackbarErrorDuration,
        action: onRetry,
        actionLabel: onRetry != null ? 'Retry' : null,
      ),
    );
  }

  /// Show a warning snackbar.
  void showWarning(final String message) {
    showSnackbar(SnackbarConfig(message: message, type: SnackbarType.warning));
  }

  /// Show an info snackbar.
  void showInfo(final String message) {
    showSnackbar(SnackbarConfig(message: message, type: SnackbarType.info));
  }

  /// Hide the current snackbar.
  void hideCurrentSnackbar() => _scaffoldMessenger?.hideCurrentSnackBar();

  /// Show a dialog with the given configuration.
  Future<bool> showDialog(final DialogConfig config) async {
    final navigator = _navigator;
    if (navigator == null) return false;

    final result = await showAdaptiveDialog<bool>(
      context: navigator.context,
      barrierDismissible: config.barrierDismissible,
      builder: (final context) => AlertDialog.adaptive(
        title: Text(config.title),
        content:
            config.content ??
            (config.message != null ? Text(config.message!) : null),
        actions: [
          if (config.cancelLabel != null)
            TextButton(
              onPressed: () {
                config.onCancel?.call();
                Navigator.of(context).pop(false);
              },
              child: Text(config.cancelLabel!),
            ),
          TextButton(
            onPressed: () {
              config.onConfirm?.call();
              Navigator.of(context).pop(true);
            },
            style: config.isDestructive
                ? TextButton.styleFrom(foregroundColor: Colors.red)
                : null,
            child: Text(config.confirmLabel),
          ),
        ],
      ),
    );

    return result ?? false;
  }

  /// Show a simple confirmation dialog.
  Future<bool> showConfirmDialog({
    required final String title,
    final String? message,
    final String confirmLabel = 'Confirm',
    final String cancelLabel = 'Cancel',
    final bool isDestructive = false,
  }) {
    return showDialog(
      DialogConfig(
        title: title,
        message: message,
        confirmLabel: confirmLabel,
        cancelLabel: cancelLabel,
        isDestructive: isDestructive,
      ),
    );
  }

  /// Show an alert dialog (single OK button).
  Future<void> showAlert({
    required final String title,
    final String? message,
    final String buttonLabel = 'OK',
  }) async {
    await showDialog(
      DialogConfig(title: title, message: message, confirmLabel: buttonLabel),
    );
  }

  /// Show a loading dialog. Returns a function to dismiss it.
  VoidCallback showLoading({final String? message}) {
    final navigator = _navigator;
    if (navigator == null) return () {};

    final completer = Completer<void>();

    showAdaptiveDialog<void>(
      context: navigator.context,
      barrierDismissible: false,
      builder: (final context) => PopScope(
        canPop: false,
        child: AlertDialog.adaptive(
          content: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator.adaptive(),
              if (message != null) ...[
                const HorizontalSpace.md(),
                Flexible(child: Text(message)),
              ],
            ],
          ),
        ),
      ),
    ).then((_) {
      if (!completer.isCompleted) completer.complete();
    });

    return () {
      if (!completer.isCompleted) {
        completer.complete();
        navigator.pop();
      }
    };
  }

  /// Show a bottom sheet.
  Future<T?> showBottomSheet<T>({
    required final Widget Function(BuildContext context) builder,
    final bool isDismissible = true,
    final bool enableDrag = true,
    final bool showDragHandle = true,
  }) async {
    final navigator = _navigator;
    if (navigator == null) return null;

    return showModalBottomSheet<T>(
      context: navigator.context,
      isDismissible: isDismissible,
      enableDrag: enableDrag,
      showDragHandle: showDragHandle,
      builder: builder,
    );
  }

  Color _getBackgroundColor(final SnackbarType type) => switch (type) {
    SnackbarType.success => Colors.green.shade700,
    SnackbarType.error => Colors.red.shade700,
    SnackbarType.warning => Colors.orange.shade700,
    SnackbarType.info => Colors.blue.shade700,
  };
}

/// Provider for [FeedbackService].
final feedbackServiceProvider = Provider<FeedbackService>((final ref) {
  return FeedbackService();
});
