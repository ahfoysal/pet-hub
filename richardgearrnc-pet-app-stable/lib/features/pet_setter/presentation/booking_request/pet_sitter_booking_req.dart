// ignore_for_file: public_member_api_docs

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/features/pet_setter/providers/pet_sitter_profile_notifier.dart';
import 'package:petzy_app/features/pet_setter/providers/pet_sitter_search_notifier.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_card_list.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_constants.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_filter_grid.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_header.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_section_card.dart';

class PetServicesBookingSearchPage extends HookConsumerWidget {
  const PetServicesBookingSearchPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final tabController = useTabController(initialLength: 2);

    // Watch services and packages
    final servicesAsync = ref.watch(petSitterServicesProvider);
    final packagesAsync = ref.watch(petSitterPackagesProvider);

    // Watch search state
    final searchState = ref.watch(petSitterSearchProvider);

    useEffect(() {
      tabController.addListener(() {
        if (!tabController.indexIsChanging) {
          ref
              .read(petSitterSearchProvider.notifier)
              .setTabIndex(tabController.index);
        }
      });

      tabController.index = searchState.tabIndex;
      return null;
    }, []);

    return Scaffold(
      backgroundColor: petServicesBgLight,
      body: SafeArea(
        top: false,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: Stack(
              children: [
                Column(
                  children: [
                    PetServicesBookingHeader(
                      title: 'Find a Trusted Pet Sitter',
                      subtitle: 'Caring professionals near you',
                      imageUrl:
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuCNXfY6ItwyvE4CUrC4Sd2eK1Ftm6Qh5iCjfuwSDc3rmMQrWAfXCFcIawBsuh4rgqpOS5p2n2BeQB5Dscj1gDMQVIriSrd9R-jw2BPvIhsEfOyVgby8yjhRGWj9XXRqzoURtCm2AuvnUKJWMhXgSFPSYCk8WtzC-bEp-dtcstuA5bIh5d-8xB7ZVyNF91wMeKyRr__H_TFrjTlTZ29KdWZjk00yAAfeQ0RAR5zpfUDyQJBAEy_fijdQffJ0CukjU7mpjor66rwfIIc',
                      onBack: () => Navigator.of(context).pop(),
                    ),
                    Expanded(
                      child: SingleChildScrollView(
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              const SizedBox(height: 12),
                              // Tab pills
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                ),
                                height: 44,
                                child: TabBar(
                                  controller: tabController,
                                  tabs: const [
                                    Tab(text: 'Services'),
                                    Tab(text: 'Packages'),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 18),
                              PetServicesBookingSectionCard(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: const [
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.filter_list,
                                          size: 18,
                                          color: Color(0xFF6B7280),
                                        ),
                                        SizedBox(width: 8),
                                        Text(
                                          'Filters',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w800,
                                            fontSize: 16,
                                            color: Color(0xFF111827),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 14),
                                    PetServicesBookingFilterGrid(),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 18),
                              // Tab content
                              Container(
                                height:
                                    MediaQuery.of(context).size.height * 0.65,
                                child: TabBarView(
                                  controller: tabController,
                                  children: [
                                    // Services tab
                                    servicesAsync.when(
                                      loading: () => const Center(
                                        child: CircularProgressIndicator(),
                                      ),
                                      error: (final error, final stackTrace) =>
                                          Center(
                                            child: Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                Text(
                                                  'Failed to load services',
                                                  textAlign: TextAlign.center,
                                                  style: const TextStyle(
                                                    fontSize: 14,
                                                    color: Color(0xFF6B7280),
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                ),
                                                const SizedBox(height: 12),
                                                ElevatedButton(
                                                  onPressed: () => ref.refresh(
                                                    petSitterServicesProvider,
                                                  ),
                                                  child: const Text('Retry'),
                                                ),
                                              ],
                                            ),
                                          ),
                                      data: (final services) {
                                        if (services.isEmpty) {
                                          return const Center(
                                            child: Text(
                                              'No services found.',
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: Color(0xFF6B7280),
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          );
                                        }
                                        return PetServicesBookingCardList(
                                          items: services,
                                          onView: (final item) {
                                            final serviceItem =
                                                item as PetSitterService;
                                            GoRouter.of(context).push(
                                              AppRoute.bookingDetails.path,
                                              extra: serviceItem.id,
                                            );
                                          },
                                          onMessage: (final item) {
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              const SnackBar(
                                                content: Text('Message sent'),
                                              ),
                                            );
                                          },
                                          onProviderTap: (final item) {
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              const SnackBar(
                                                content: Text(
                                                  'Provider profile',
                                                ),
                                              ),
                                            );
                                          },
                                        );
                                      },
                                    ),
                                    // Packages tab
                                    packagesAsync.when(
                                      loading: () => const Center(
                                        child: CircularProgressIndicator(),
                                      ),
                                      error: (final error, final stackTrace) =>
                                          Center(
                                            child: Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                Text(
                                                  'Failed to load packages',
                                                  textAlign: TextAlign.center,
                                                  style: const TextStyle(
                                                    fontSize: 14,
                                                    color: Color(0xFF6B7280),
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                ),
                                                const SizedBox(height: 12),
                                                ElevatedButton(
                                                  onPressed: () => ref.refresh(
                                                    petSitterPackagesProvider,
                                                  ),
                                                  child: const Text('Retry'),
                                                ),
                                              ],
                                            ),
                                          ),
                                      data: (final packages) {
                                        if (packages.isEmpty) {
                                          return const Center(
                                            child: Text(
                                              'No packages found.',
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: Color(0xFF6B7280),
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          );
                                        }
                                        return PetServicesBookingCardList(
                                          items: packages,
                                          isPackage: true,
                                          onView: (final item) {
                                            final packageItem =
                                                item as PetSitterPackage;
                                            GoRouter.of(context).push(
                                              AppRoute.packageDetails.path,
                                              extra: packageItem.id,
                                            );
                                          },
                                          onMessage: (final item) {
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              const SnackBar(
                                                content: Text('Message sent'),
                                              ),
                                            );
                                          },
                                          onProviderTap: (final item) {
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              const SnackBar(
                                                content: Text(
                                                  'Provider profile',
                                                ),
                                              ),
                                            );
                                          },
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
