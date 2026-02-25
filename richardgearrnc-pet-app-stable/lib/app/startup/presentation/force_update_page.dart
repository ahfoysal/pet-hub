import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/constants/app_constants.dart';
import 'package:petzy_app/core/extensions/context_extensions.dart';
import 'package:petzy_app/core/review/in_app_review_service.dart';
import 'package:petzy_app/core/version/app_version_service.dart';
import 'package:petzy_app/core/widgets/buttons.dart';
import 'package:petzy_app/core/widgets/spacing.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Force update page shown when app version is below minimum required.
///
/// This page blocks all app functionality until the user updates.
/// It displays:
/// - Current vs. minimum required version
/// - A clear call-to-action to open the app store
class ForceUpdatePage extends ConsumerWidget {
  /// Creates a [ForceUpdatePage] widget.
  const ForceUpdatePage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final versionAsync = ref.watch(versionInfoProvider);

    return Scaffold(
      body: SafeArea(
        child: ResponsivePadding(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.lg,
          child: Column(
            mainAxisAlignment: .center,
            children: [
              const Spacer(),
              _buildUpdateIcon(context),
              const VerticalSpace.xl(),
              _buildTitle(context),
              const VerticalSpace.md(),
              _buildDescription(context),
              const VerticalSpace.lg(),
              _buildVersionInfo(context, versionAsync),
              const Spacer(),
              _buildUpdateButton(ref, context),
              const VerticalSpace.md(),
            ],
          ),
        ),
      ),
    );
  }

  /// Builds the update icon container.
  Widget _buildUpdateIcon(final BuildContext context) {
    final colorScheme = context.colorScheme;

    return Container(
      padding: const .all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: colorScheme.primaryContainer,
        shape: .circle,
      ),
      child: Icon(
        Icons.system_update,
        size: 64,
        color: colorScheme.primary,
      ),
    );
  }

  /// Builds the title text.
  Widget _buildTitle(final BuildContext context) {
    final textTheme = context.textTheme;
    final l10n = AppLocalizations.of(context);

    return Text(
      l10n.updateRequired,
      style: textTheme.headlineMedium?.copyWith(
        fontWeight: .bold,
      ),
      textAlign: .center,
    );
  }

  /// Builds the description text.
  Widget _buildDescription(final BuildContext context) {
    final colorScheme = context.colorScheme;
    final textTheme = context.textTheme;
    final l10n = AppLocalizations.of(context);

    return Text(
      l10n.updateRequiredDescription,
      style: textTheme.bodyLarge?.copyWith(
        color: colorScheme.onSurfaceVariant,
      ),
      textAlign: .center,
    );
  }

  /// Builds the version info container.
  Widget _buildVersionInfo(
    final BuildContext context,
    final AsyncValue<VersionInfo> versionAsync,
  ) {
    return versionAsync.when(
      data: (final info) => _VersionInfoContainer(info: info),
      loading: () => const SizedBox.shrink(),
      error: (_, final __) => const SizedBox.shrink(),
    );
  }

  /// Builds the update button.
  Widget _buildUpdateButton(final WidgetRef ref, final BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return AppButton(
      variant: .primary,
      size: .large,
      isExpanded: true,
      onPressed: () => _openStore(ref),
      icon: Icons.download,
      label: l10n.updateNow,
    );
  }

  /// Opens the app store listing.
  Future<void> _openStore(final WidgetRef ref) async {
    final reviewService = ref.read(inAppReviewServiceProvider);
    await reviewService.openStoreListing();
  }
}

/// Container displaying current and minimum version information.
class _VersionInfoContainer extends StatelessWidget {
  const _VersionInfoContainer({required this.info});

  final VersionInfo info;

  @override
  Widget build(final BuildContext context) {
    final colorScheme = context.colorScheme;
    final textTheme = context.textTheme;

    return Container(
      padding: const .symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm + AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerHighest,
        borderRadius: .circular(AppConstants.borderRadiusMedium),
      ),
      child: Row(
        mainAxisSize: .min,
        children: [
          Text(
            'v${info.currentVersion}',
            style: textTheme.bodyMedium?.copyWith(
              color: colorScheme.error,
              decoration: .lineThrough,
            ),
          ),
          const HorizontalSpace.sm(),
          Icon(
            Icons.arrow_forward,
            size: 16,
            color: colorScheme.onSurfaceVariant,
          ),
          const HorizontalSpace.sm(),
          Text(
            'v${info.minimumVersion ?? 'Latest'}',
            style: textTheme.bodyMedium?.copyWith(
              color: colorScheme.primary,
              fontWeight: .bold,
            ),
          ),
        ],
      ),
    );
  }
}
