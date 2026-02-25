import 'package:flutter/material.dart';
import 'package:petzy_app/core/extensions/extensions.dart';
import 'package:petzy_app/core/widgets/spacing.dart';
import 'package:petzy_app/features/home/presentation/widgets/services_showcase.dart';

/// Menu page displaying top services.
class MenuPage extends StatelessWidget {
  /// Creates a [MenuPage] instance.
  const MenuPage({super.key});

  @override
  Widget build(final BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Menu'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Top Services',
                style: context.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const VerticalSpace.md(),
              const ServicesShowcase(),
            ],
          ),
        ),
      ),
    );
  }
}
