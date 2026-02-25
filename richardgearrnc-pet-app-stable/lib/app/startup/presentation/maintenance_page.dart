import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/config/remote_config_service.dart';
import 'package:petzy_app/core/extensions/context_extensions.dart';
import 'package:petzy_app/core/widgets/spacing.dart';

/// Maintenance page shown when the app is under scheduled maintenance.
///
/// This page blocks all app functionality until maintenance is complete.
/// It displays:
/// - Maintenance message (default or from Remote Config)
/// - A retry button to check if maintenance is over
class MaintenancePage extends ConsumerWidget {
  /// Creates a [MaintenancePage] widget.
  const MaintenancePage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final maintenanceMessage = ref.watch(maintenanceMessageProvider);

    return Scaffold(
      body: SafeArea(
        child: ResponsivePadding(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.lg,
          child: Column(
            mainAxisAlignment: .center,
            children: [
              const Spacer(),
              _buildMaintenanceIcon(context),
              const VerticalSpace.xl(),
              _buildTitle(context),
              const VerticalSpace.md(),
              _buildDescription(context, maintenanceMessage),
              const Spacer(),
              _buildRetryButton(ref),
              const VerticalSpace.md(),
            ],
          ),
        ),
      ),
    );
  }

  /// Builds the maintenance icon container.
  Widget _buildMaintenanceIcon(final BuildContext context) {
    final colorScheme = context.colorScheme;

    return Container(
      padding: const .all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: colorScheme.secondaryContainer,
        shape: .circle,
      ),
      child: Icon(
        Icons.construction_rounded,
        size: 64,
        color: colorScheme.secondary,
      ),
    );
  }

  /// Builds the title text.
  Widget _buildTitle(final BuildContext context) {
    final textTheme = context.textTheme;

    return Text(
      'Under Maintenance',
      style: textTheme.headlineMedium?.copyWith(
        fontWeight: .bold,
      ),
      textAlign: .center,
    );
  }

  /// Builds the description text with optional custom message.
  Widget _buildDescription(
    final BuildContext context,
    final String? maintenanceMessage,
  ) {
    final colorScheme = context.colorScheme;
    final textTheme = context.textTheme;

    return Text(
      maintenanceMessage ??
          'We\'re currently performing scheduled maintenance. '
              'Please check back shortly.',
      style: textTheme.bodyLarge?.copyWith(
        color: colorScheme.onSurfaceVariant,
      ),
      textAlign: .center,
    );
  }

  /// Builds the retry button.
  Widget _buildRetryButton(final WidgetRef ref) {
    return SizedBox(
      width: .infinity,
      child: OutlinedButton.icon(
        onPressed: () => _handleRetry(ref),
        icon: const Icon(Icons.refresh),
        label: const Text('Try Again'),
        style: OutlinedButton.styleFrom(
          padding: const .symmetric(
            vertical: AppSpacing.md,
          ),
        ),
      ),
    );
  }

  /// Handles the retry action.
  Future<void> _handleRetry(final WidgetRef ref) async {
    // Refresh remote config to check if maintenance is over
    final remoteConfigService = ref.read(remoteConfigServiceProvider);
    await remoteConfigService.fetch();
  }
}
