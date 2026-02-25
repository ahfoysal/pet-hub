import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:petzy_app/core/core.dart';

import '../../../../app/router/app_router.dart';

/// Top services showcase widget.
///
/// Displays the 4 main services: Pet Sitter, Pet Market, Pet School, Pet Hotel.
/// This matches the screenshot design.
class ServicesShowcase extends StatelessWidget {
  /// Creates a [ServicesShowcase] instance.
  const ServicesShowcase({super.key});

  @override
  Widget build(final BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: AppSpacing.md),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _ServiceCard(
            icon: Assets.icons.petSitter,
            label: 'Pet sitter',
            onTap: () => context.goNamed(AppRoute.petSitter.name),
          ),
          _ServiceCard(
            icon: Assets.icons.petMarket,
            label: 'Pet Market',
            onTap: () => context.goNamed(AppRoute.petMarket.name),
          ),
          _ServiceCard(
            icon: Assets.icons.petSchool,
            label: 'Pet school',
            onTap: () => context.goNamed(AppRoute.petSchool.name),
          ),
          _ServiceCard(
            icon: Assets.icons.petHotel,
            label: 'Pet hotel',
            onTap: () => context.goNamed(AppRoute.petSitter.name),
          ),
        ],
      ),
    );
  }
}

/// Individual service card in the showcase.
class _ServiceCard extends StatelessWidget {
  const _ServiceCard({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final String icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(final BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: context.colorScheme.primaryContainer,
              shape: BoxShape.circle,
            ),
            child: Image.asset(
              icon,
              fit: BoxFit.contain,
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: 70,
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: context.textTheme.labelSmall?.copyWith(
                color: context.colorScheme.onSurface,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
