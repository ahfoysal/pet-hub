// ignore_for_file: public_member_api_docs, prefer_final_parameters, inference_failure_on_function_invocation

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:get/get.dart';
import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';

class ServiceItem {
  final String id;
  final String title;
  final double price;
  final double rating;
  final int reviews;
  final double distanceMiles;
  final String provider;
  final String imageUrl;

  const ServiceItem({
    required this.id,
    required this.title,
    required this.price,
    required this.rating,
    required this.reviews,
    required this.distanceMiles,
    required this.provider,
    required this.imageUrl,
  });
}

class PetSearchController extends GetxController
    with GetSingleTickerProviderStateMixin {
  PetSearchController({required final PetSitterServicesApi servicesApi})
    : _servicesApi = servicesApi;

  late final TabController tabController;
  final searchController = TextEditingController();

  // If you want to track selected tab index reactively
  final tabIndex = 0.obs;

  final services = <ServiceItem>[].obs;

  final packages = <ServiceItem>[].obs;

  final PetSitterServicesApi _servicesApi;

  final isLoadingServices = false.obs;
  final servicesError = RxnString();
  bool _hasLoadedServices = false;

  final isLoadingPackages = false.obs;
  final packagesError = RxnString();
  bool _hasLoadedPackages = false;

  final isLoadingServiceDetails = false.obs;
  final serviceDetailsError = RxnString();
  final serviceDetails = Rxn<PetSitterServiceDetails>();
  String? _lastServiceDetailsId;

  final isLoadingPackageDetails = false.obs;
  final packageDetailsError = RxnString();
  final packageDetails = Rxn<PetSitterPackageDetails>();
  String? _lastPackageDetailsId;

  @override
  void onInit() {
    super.onInit();
    tabController = TabController(length: 2, vsync: this);
    tabController.addListener(() {
      if (!tabController.indexIsChanging) {
        tabIndex.value = tabController.index;
        if (tabController.index == 0) {
          unawaited(fetchServices(force: true));
        } else if (tabController.index == 1) {
          unawaited(fetchPackages(force: true));
        }
      }
    });

    if (tabController.index == 0) {
      unawaited(fetchServices());
    } else if (tabController.index == 1) {
      unawaited(fetchPackages());
    }
  }

  Future<void> fetchServices({final bool force = false}) async {
    if (isLoadingServices.value) return;
    if (!force && _hasLoadedServices) return;

    isLoadingServices.value = true;
    servicesError.value = null;

    try {
      final results = await _servicesApi.fetchMyServices();
      services.assignAll(results.map(_mapServiceItem));
      _hasLoadedServices = true;
    } catch (e) {
      servicesError.value = 'Failed to load services. Please try again.';
    } finally {
      isLoadingServices.value = false;
    }
  }

  Future<void> fetchServiceDetails(
    final String serviceId, {
    final bool force = false,
  }) async {
    if (isLoadingServiceDetails.value) return;
    if (!force &&
        _lastServiceDetailsId == serviceId &&
        serviceDetails.value != null) {
      return;
    }

    isLoadingServiceDetails.value = true;
    serviceDetailsError.value = null;
    if (_lastServiceDetailsId != serviceId) {
      serviceDetails.value = null;
    }

    try {
      final details = await _servicesApi.fetchServiceDetails(serviceId);
      if (details == null) {
        serviceDetailsError.value = 'Service details not found.';
      } else {
        serviceDetails.value = details;
        _lastServiceDetailsId = serviceId;
      }
    } catch (e) {
      serviceDetailsError.value =
          'Failed to load service details. Please try again.';
    } finally {
      isLoadingServiceDetails.value = false;
    }
  }

  Future<void> fetchPackages({final bool force = false}) async {
    if (isLoadingPackages.value) return;
    if (!force && _hasLoadedPackages) return;

    isLoadingPackages.value = true;
    packagesError.value = null;

    try {
      final results = await _servicesApi.fetchMyPackages();
      packages.assignAll(results.map(_mapPackageItem));
      _hasLoadedPackages = true;
    } catch (e) {
      packagesError.value = 'Failed to load packages. Please try again.';
    } finally {
      isLoadingPackages.value = false;
    }
  }

  Future<void> fetchPackageDetails(
    final String packageId, {
    final bool force = false,
  }) async {
    if (isLoadingPackageDetails.value) return;
    if (!force &&
        _lastPackageDetailsId == packageId &&
        packageDetails.value != null) {
      return;
    }

    isLoadingPackageDetails.value = true;
    packageDetailsError.value = null;
    if (_lastPackageDetailsId != packageId) {
      packageDetails.value = null;
    }

    try {
      final details = await _servicesApi.fetchPackageDetails(packageId);
      if (details == null) {
        packageDetailsError.value = 'Package details not found.';
      } else {
        packageDetails.value = details;
        _lastPackageDetailsId = packageId;
      }
    } catch (e) {
      packageDetailsError.value =
          'Failed to load package details. Please try again.';
    } finally {
      isLoadingPackageDetails.value = false;
    }
  }

  ServiceItem _mapServiceItem(final PetSitterService service) {
    final parsedPrice = double.tryParse(service.price) ?? 0;

    return ServiceItem(
      id: service.id,
      title: service.name.isNotEmpty ? service.name : 'Service',
      price: parsedPrice,
      rating: 0,
      reviews: 0,
      distanceMiles: 0,
      provider: 'Pet Sitter',
      imageUrl: service.thumbnailImage.isNotEmpty
          ? service.thumbnailImage
          : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&auto=format&fit=crop',
    );
  }

  ServiceItem _mapPackageItem(final PetSitterPackage package) {
    final parsedPrice = double.tryParse(package.offeredPrice) ?? 0;

    return ServiceItem(
      id: package.id,
      title: package.name.isNotEmpty ? package.name : 'Package',
      price: parsedPrice,
      rating: 0,
      reviews: 0,
      distanceMiles: 0,
      provider: 'Pet Package',
      imageUrl: package.image.isNotEmpty
          ? package.image
          : 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80&auto=format&fit=crop',
    );
  }

  void onBack() {
    Get.back();
  }

  void onBook(ServiceItem item) {
    Get.snackbar('Book', 'Booking ${item.title}');
  }

  void onMessage(ServiceItem item) {
    Get.snackbar('Message', 'Messaging ${item.provider}');
  }

  void onProviderTap(ServiceItem item) {
    Get.snackbar('Provider', item.provider);
  }

  void onView(final BuildContext context, final ServiceItem item) {
    GoRouter.of(context).push(
      AppRoute.bookingDetails.path,
      extra: item.id,
    );
  }

  void onViewPackage(final BuildContext context, final ServiceItem item) {
    GoRouter.of(context).push(
      AppRoute.packageDetails.path,
      extra: item.id,
    );
  }

  @override
  void onClose() {
    tabController.dispose();
    searchController.dispose();
    super.onClose();
  }
}
