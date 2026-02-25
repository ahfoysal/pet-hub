import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/app/router/app_router.dart';

import 'package:petzy_app/core/widgets/nav_bar.dart';
import 'package:petzy_app/features/auth/presentation/providers/auth_notifier.dart';

class MainWrapper extends ConsumerWidget {
  const MainWrapper({
    required this.navigationShell,
    super.key,
  });

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final userRole = authState.value?.role;

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: AppNavBar(
        currentIndex: navigationShell.currentIndex,
        onItemTapped: (final index) => _onItemTapped(context, ref, index),
        userRole: userRole,
      ),
    );
  }

  void _onItemTapped(
    final BuildContext context,
    final WidgetRef ref,
    final int index,
  ) {
    if (index == navigationShell.currentIndex) return;

    final authState = ref.read(authProvider);
    final user = authState.value;

    // Guest Mode Check: Only allow Home (index 0) if not logged in
    if (user == null && index != 0) {
      // Show login dialog or snackbar
      _showLoginRequiredDialog(context);
      return;
    }

    // GoBranch handles the switching for StatefulShellRoute
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  void _showLoginRequiredDialog(final BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (final context) => AlertDialog(
        title: const Text('Login Required'),
        content: const Text(
          'You need to be logged in to access Bookings, Messages, and Profile.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.pushRoute(AppRoute.login);
            },
            child: const Text('Login'),
          ),
        ],
      ),
    );
  }
}
