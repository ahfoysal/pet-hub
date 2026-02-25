import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:go_router/go_router.dart';
import 'package:petzy_app/core/theme/app_colors.dart';
import 'package:petzy_app/features/pet_market/controller/product_controller.dart';
import 'package:petzy_app/features/pet_market/views/widget/category_chip.dart';
import 'package:petzy_app/features/pet_market/views/widget/pet_product_card.dart';

class PetMarketScreen extends StatelessWidget {
  const PetMarketScreen({super.key});

  @override
  Widget build(final BuildContext context) {
    final controller = Get.put(ProductController());

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
                  onPressed: () => context.pop(),
                  icon: const Icon(Icons.arrow_back_rounded, size: 25),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'Pet Market',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      'Discover premium pet products',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF828282),
                      ),
                    ),
                  ],
                ),
                Container(
                  height: 40,
                  width: 40,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Icon(
                    Icons.shopping_cart_sharp,
                    size: 24,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
        body: Obx(() {
          if (controller.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }

          if (controller.hasError.value) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 60, color: Colors.red[300]),
                  const SizedBox(height: 16),
                  Text(
                    controller.errorMessage.value,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.redAccent,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: controller.refresh,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (controller.products.isEmpty) {
            return const Center(child: Text('No products found'));
          }

          return RefreshIndicator(
            onRefresh: controller.refresh,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),

                    // Search
                    TextField(
                      decoration: InputDecoration(
                        hintText: 'Search for pet products...',
                        prefixIcon: const Icon(
                          Icons.search,
                          color: Colors.grey,
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(
                          vertical: 15,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: const BorderSide(
                            color: Colors.grey,
                            width: 0.5,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    const CategoryChips(),

                    const SizedBox(height: 24),

                    // Grid of products
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 16,
                            childAspectRatio:
                                0.62, // taller cards - prevents overflow
                          ),
                      itemCount: controller.products.length,
                      itemBuilder: (final context, final index) {
                        final product = controller.products[index];
                        final variant = product.variants.isNotEmpty
                            ? product.variants.first
                            : null;

                        return PetProductCard(
                          imageUrl: product.images.isNotEmpty
                              ? product.images.first
                              : 'https://via.placeholder.com/300x160?text=No+Image',
                          title: product.name,
                          description: product.description,
                          rating: product.avgRating.toDouble(),
                          price: variant?.sellingPrice ?? 0,
                          originalPrice: variant?.originalPrice,
                          onBuyNow: () {
                            Get.snackbar('Buy Now', product.name);
                          },
                          onAddToCart: () {
                            Get.snackbar('Cart', '${product.name} added');
                          },
                          onFavoriteTap: () {
                            Get.snackbar('Favorite', product.name);
                          },
                        );
                      },
                    ),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}
