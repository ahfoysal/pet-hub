// lib/screens/pet_hotel_profile_screen.dart

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:petzy_app/features/pet_hotel/controller/pet_hotel_profile_controller.dart';

class PetHotelProfileScreen extends StatelessWidget {
  const PetHotelProfileScreen({super.key});

  @override
  Widget build(final BuildContext context) {
    // Manual controller instantiation (no Bindings)
    final controller = Get.put(PetHotelProfileController());

    // Trigger once
    WidgetsBinding.instance.addPostFrameCallback((_) {
      controller.fetchProfile();
    });

    return Scaffold(
      appBar: AppBar(title: const Text('My Hotel Profile')),
      body: Obx(() {
        if (controller.loading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (controller.error.isNotEmpty) {
          return Center(child: Text('Error: ${controller.error}'));
        }

        final profile = controller.profile;
        if (profile == null) {
          return const Center(child: Text('No data available'));
        }

        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              profile.name,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('📧 ${profile.email}'),
            Text('📞 ${profile.phone}'),
            const SizedBox(height: 12),
            if (profile.images.isNotEmpty)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  profile.images[0],
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, final __, final ___) =>
                      const Icon(Icons.error),
                ),
              ),
            const SizedBox(height: 12),
            Text('🕒 Day: ${profile.dayStartingTime}–${profile.dayEndingTime}'),
            Text(
              '🌙 Night: ${profile.nightStartingTime}–${profile.nightEndingTime}',
            ),
            const SizedBox(height: 12),
            Text('📝 ${profile.description}'),
            const SizedBox(height: 16),
            if (profile.addresses.isNotEmpty)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '📍 Addresses',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  for (var addr in profile.addresses)
                    Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(addr.streetAddress),
                            Text('${addr.city}, ${addr.country}'),
                            Text('PostalCodes: ${addr.postalCode}'),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
          ],
        );
      }),
    );
  }
}
