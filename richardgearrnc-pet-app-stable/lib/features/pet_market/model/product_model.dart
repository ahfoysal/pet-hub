// product_response.dart

class ProductResponse {
  final bool success;
  final String message;
  final ProductData data;

  ProductResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory ProductResponse.fromJson(final Map<String, dynamic> json) {
    return ProductResponse(
      success: json['success'] as bool,
      message: json['message'] as String,
      data: ProductData.fromJson(json['data'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': data.toJson(),
    };
  }
}

class ProductData {
  final List<Product> data;
  final Meta meta;

  ProductData({
    required this.data,
    required this.meta,
  });

  factory ProductData.fromJson(final Map<String, dynamic> json) {
    return ProductData(
      data: (json['data'] as List<dynamic>)
          .map((final e) => Product.fromJson(e as Map<String, dynamic>))
          .toList(),
      meta: Meta.fromJson(json['meta'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'data': data.map((final e) => e.toJson()).toList(),
      'meta': meta.toJson(),
    };
  }
}

class Product {
  final String id;
  final String vendorId;
  final String name;
  final List<String> images;
  final String description;
  final String productCategory;
  final String petCategory;
  final List<String> tags;
  final List<String> features;
  final bool inStock;
  final bool isPublish;
  final int avgRating;
  final String createdAt;
  final String updatedAt;
  final List<Variant> variants;
  final Vendor vendor;

  Product({
    required this.id,
    required this.vendorId,
    required this.name,
    required this.images,
    required this.description,
    required this.productCategory,
    required this.petCategory,
    required this.tags,
    required this.features,
    required this.inStock,
    required this.isPublish,
    required this.avgRating,
    required this.createdAt,
    required this.updatedAt,
    required this.variants,
    required this.vendor,
  });

  factory Product.fromJson(final Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      vendorId: json['vendorId'] as String,
      name: json['name'] as String,
      images: (json['images'] as List<dynamic>).cast<String>(),
      description: json['description'] as String,
      productCategory: json['productCategory'] as String,
      petCategory: json['petCategory'] as String,
      tags: (json['tags'] as List<dynamic>).cast<String>(),
      features: (json['features'] as List<dynamic>).cast<String>(),
      inStock: json['inStock'] as bool,
      isPublish: json['isPublish'] as bool,
      avgRating: json['avgRating'] as int,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
      variants: (json['variants'] as List<dynamic>)
          .map((final e) => Variant.fromJson(e as Map<String, dynamic>))
          .toList(),
      vendor: Vendor.fromJson(json['vendor'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'vendorId': vendorId,
      'name': name,
      'images': images,
      'description': description,
      'productCategory': productCategory,
      'petCategory': petCategory,
      'tags': tags,
      'features': features,
      'inStock': inStock,
      'isPublish': isPublish,
      'avgRating': avgRating,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'variants': variants.map((final v) => v.toJson()).toList(),
      'vendor': vendor.toJson(),
    };
  }
}

class Variant {
  final String id;
  final String productId;
  final int originalPrice;
  final int sellingPrice;
  final List<String> images;
  final Map<String, dynamic> attributes;
  final int stock;
  final String createdAt;
  final String updatedAt;

  Variant({
    required this.id,
    required this.productId,
    required this.originalPrice,
    required this.sellingPrice,
    required this.images,
    required this.attributes,
    required this.stock,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Variant.fromJson(final Map<String, dynamic> json) {
    return Variant(
      id: json['id'] as String,
      productId: json['productId'] as String,
      originalPrice: json['originalPrice'] as int,
      sellingPrice: json['sellingPrice'] as int,
      images: (json['images'] as List<dynamic>).cast<String>(),
      attributes: json['attributes'] as Map<String, dynamic>,
      stock: json['stock'] as int,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productId': productId,
      'originalPrice': originalPrice,
      'sellingPrice': sellingPrice,
      'images': images,
      'attributes': attributes,
      'stock': stock,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  // Convenience getter
  String get displayPrice => '\$${sellingPrice}';
  String? get firstImage => images.isNotEmpty ? images.first : null;
}

class Vendor {
  final String id;
  final String userId;
  final String name;
  final String email;
  final String phone;
  final String description;
  final List<String> images;

  Vendor({
    required this.id,
    required this.userId,
    required this.name,
    required this.email,
    required this.phone,
    required this.description,
    required this.images,
  });

  factory Vendor.fromJson(final Map<String, dynamic> json) {
    return Vendor(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      description: json['description'] as String,
      images: (json['images'] as List<dynamic>).cast<String>(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'name': name,
      'email': email,
      'phone': phone,
      'description': description,
      'images': images,
    };
  }

  String? get profileImage => images.isNotEmpty ? images.first : null;
}

class Meta {
  final int total;
  final int page;
  final int limit;
  final int totalPages;
  final bool hasNext;
  final bool hasPrev;

  Meta({
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
    required this.hasNext,
    required this.hasPrev,
  });

  factory Meta.fromJson(final Map<String, dynamic> json) {
    return Meta(
      total: json['total'] as int,
      page: json['page'] as int,
      limit: json['limit'] as int,
      totalPages: json['totalPages'] as int,
      hasNext: json['hasNext'] as bool,
      hasPrev: json['hasPrev'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'total': total,
      'page': page,
      'limit': limit,
      'totalPages': totalPages,
      'hasNext': hasNext,
      'hasPrev': hasPrev,
    };
  }
}
