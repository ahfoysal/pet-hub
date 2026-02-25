import 'package:petzy_app/core/result/result.dart';

/// Represents a pet sitter profile in the directory.
class PetSitterProfile {
  /// Creates a [PetSitterProfile] instance.
  const PetSitterProfile({
    required this.id,
    required this.fullName,
    this.avatar,
    this.bio,
    this.rating = 0.0,
    this.reviewCount = 0,
    this.servicesCount = 0,
    this.packagesCount = 0,
    this.isVerified = false,
    this.location,
  });

  final String id;
  final String fullName;
  final String? avatar;
  final String? bio;
  final double rating;
  final int reviewCount;
  final int servicesCount;
  final int packagesCount;
  final bool isVerified;
  final String? location;

  factory PetSitterProfile.fromJson(final Map<String, dynamic> json) {
    return PetSitterProfile(
      id: json['id'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      avatar: json['avatar'] as String?,
      bio: json['bio'] as String?,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: json['reviewCount'] as int? ?? 0,
      servicesCount: json['servicesCount'] as int? ?? 0,
      packagesCount: json['packagesCount'] as int? ?? 0,
      isVerified: json['isVerified'] as bool? ?? false,
      location: json['location'] as String?,
    );
  }
}

/// Represents a pet sitter service.
class PetSitterService {
  const PetSitterService({
    required this.id,
    required this.name,
    this.description,
    this.price = 0,
    this.category,
  });

  final String id;
  final String name;
  final String? description;
  final int price;
  final String? category;

  factory PetSitterService.fromJson(final Map<String, dynamic> json) {
    return PetSitterService(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String?,
      price: json['price'] as int? ?? 0,
      category: json['category'] as String?,
    );
  }
}

/// Represents a pet sitter package.
class PetSitterPackage {
  const PetSitterPackage({
    required this.id,
    required this.name,
    this.description,
    this.price = 0,
    this.duration,
    this.services = const [],
  });

  final String id;
  final String name;
  final String? description;
  final int price;
  final String? duration;
  final List<String> services;

  factory PetSitterPackage.fromJson(final Map<String, dynamic> json) {
    return PetSitterPackage(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String?,
      price: json['price'] as int? ?? 0,
      duration: json['duration'] as String?,
      services: (json['services'] as List<dynamic>?)
              ?.map((final s) => s.toString())
              .toList() ??
          [],
    );
  }
}

/// Repository interface for pet sitter discovery.
abstract class PetSitterRepository {
  /// Get the pet sitter directory (list of all sitters).
  Future<Result<List<PetSitterProfile>>> fetchSitterDirectory();

  /// Get a specific sitter's profile.
  Future<Result<PetSitterProfile>> fetchSitterProfile(final String sitterId);

  /// Get a sitter's services.
  Future<Result<List<PetSitterService>>> fetchSitterServices(
    final String sitterId,
  );

  /// Get a sitter's packages.
  Future<Result<List<PetSitterPackage>>> fetchSitterPackages(
    final String sitterId,
  );
}
