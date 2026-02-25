import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:go_router/go_router.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_sitter/views/widgets/service_card.dart';

import '../../controller/pet_sitter_controller.dart';

class PetSitterScreen extends StatelessWidget {
  const PetSitterScreen({super.key});

  @override
  Widget build(final BuildContext context) {
    // Initialize controller
    final controller = Get.put(PetSitterController());

    return SafeArea(
      child: Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(112),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 15),
            height: 112,
            width: double.maxFinite,
            color: AppColors.primary.withOpacity(0.2),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_rounded, size: 25),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'Find a Trusted Pet Sitter',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      'Caring professionals near you',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF828282),
                      ),
                    ),
                  ],
                ),
                Image.asset(Assets.dogImage, height: 40),
              ],
            ),
          ),
        ),
        body: Obx(() {
          if (controller.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }

          if (controller.petSitters.isEmpty) {
            return const Center(child: Text('No pet sitters found'));
          }

          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  const SizedBox(height: 20),

                  // Search Bar
                  TextField(
                    decoration: InputDecoration(
                      hintText: 'Search for providers, services, etc...',
                      prefixIcon: const Icon(Icons.search, color: Colors.grey),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(vertical: 15),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(15),
                        borderSide: const BorderSide(
                          color: Colors.grey,
                          width: 0.5,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(15),
                        borderSide: const BorderSide(
                          color: Colors.grey,
                          width: 0.5,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Services / Packages Toggle
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(15),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE97676),
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: const Text(
                              'Services',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                        const Expanded(
                          child: Text(
                            'Packages',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Color(0xFF5F6368),
                              fontSize: 18,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Filters
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(
                              Icons.filter_list_outlined,
                              color: Color(0xFF5F6368),
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Filters',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        GridView.count(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          mainAxisSpacing: 10,
                          crossAxisSpacing: 10,
                          childAspectRatio: 2.5,
                          children: [
                            _buildFilterChip('Availability'),
                            _buildFilterChip('Max Price'),
                            _buildFilterChip('Rating'),
                            _buildFilterChip('Location'),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ── REAL DATA LIST ────────────────────────────────────────
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: controller.petSitters.length,
                    itemBuilder: (final context, final index) {
                      final sitter = controller.petSitters[index];

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: ServiceProviderCard(
                          imageUrl:
                              sitter.user.image ??
                              'https://placehold.co/100x100/png',
                          serviceName:
                              sitter.designations, // or "Pet Sitting" etc.
                          rating: 4.8, // ← you can add real rating later
                          reviewCount: 42, // ← placeholder or real later
                          distance: 8.2, // ← placeholder
                          price: "25", // ← placeholder or real
                          providerName: sitter.user.fullName,
                          providerLogoUrl: sitter.user.image ?? '',
                          onBookNow: () {
                            // Navigate to service details
                            context.pushNamed(
                              'service-details',
                              pathParameters: {'serviceId': sitter.id},
                            );
                          },
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildFilterChip(final String label) {
    return Container(
      alignment: Alignment.centerLeft,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F3F6),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Text(
        label,
        style: const TextStyle(color: Color(0xFF3C4043), fontSize: 15),
      ),
    );
  }
}
