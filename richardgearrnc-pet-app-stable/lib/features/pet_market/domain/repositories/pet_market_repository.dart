import 'package:flutter/foundation.dart' show immutable;
import 'package:petzy_app/core/result/result.dart';

/// Represents a product in the pet market.
@immutable
class MarketProduct {
  const MarketProduct({
    required this.id,
    required this.name,
    this.description,
    this.price = 0,
    this.images = const [],
    this.category,
    this.vendorName,
    this.rating = 0.0,
    this.reviewCount = 0,
    this.isAvailable = true,
  });

  final String id;
  final String name;
  final String? description;
  final int price;
  final List<String> images;
  final String? category;
  final String? vendorName;
  final double rating;
  final int reviewCount;
  final bool isAvailable;

  factory MarketProduct.fromJson(final Map<String, dynamic> json) {
    return MarketProduct(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String?,
      price: json['price'] as int? ?? 0,
      images: (json['images'] as List<dynamic>?)
              ?.map((final i) => i.toString())
              .toList() ??
          [],
      category: json['category'] as String?,
      vendorName: json['vendor']?['storeName'] as String? ??
          json['vendorName'] as String?,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: json['reviewCount'] as int? ?? 0,
      isAvailable: json['isAvailable'] as bool? ?? true,
    );
  }
}

/// Repository interface for the pet market (product browsing).
abstract class PetMarketRepository {
  /// Fetch products with optional search and pagination.
  Future<Result<List<MarketProduct>>> fetchProducts({
    final int limit = 20,
    final int page = 1,
    final String? search,
    final String? category,
  });

  /// Fetch a specific product by ID.
  Future<Result<MarketProduct>> fetchProductById(final String productId);
}
