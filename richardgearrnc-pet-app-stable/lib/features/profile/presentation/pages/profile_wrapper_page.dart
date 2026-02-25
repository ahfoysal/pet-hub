import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import 'package:petzy_app/core/enums/user_role.dart';
import 'package:petzy_app/features/auth/presentation/providers/auth_notifier.dart';
import 'package:petzy_app/features/pet_hotel/presentation/screen/pet_hotel_profile_screen.dart';
import 'package:petzy_app/features/pet_setter/presentation/profile/pet_sitter_profile.dart';
import 'package:petzy_app/features/profile/presentation/pages/pet_owner_profile_page.dart';
import 'package:petzy_app/features/pet_school/profile/presentation/pages/pet_school_profile_page.dart';

class ProfileWrapperPage extends ConsumerWidget {
  const ProfileWrapperPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return authState.when(
      data: (final user) {
        if (user == null) {
          return const _LoadingView(); // Or redirect to login
        }

        return switch (user.role) {
          UserRole.petOwner => const PetOwnerProfilePage(),
          UserRole.petSitter => const PetSitterProfilePage(),
          UserRole.petSchool => const PetSchoolProfilePage(),
          UserRole.petHotel => const PetHotelProfileScreen(),
        };
      },
      loading: () => const _LoadingView(),
      error: (final error, final stack) => Center(child: Text('Error: $error')),
    );
  }
}

class _LoadingView extends StatelessWidget {
  const _LoadingView();

  @override
  Widget build(final BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
