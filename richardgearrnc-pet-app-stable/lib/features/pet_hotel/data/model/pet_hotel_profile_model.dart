// lib/models/pet_hotel_profile_model.dart

class PetHotelProfileResponse {
  final bool success;
  final String message;
  final PetHotelProfile? data;

  PetHotelProfileResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory PetHotelProfileResponse.fromJson(final Map<String, dynamic> json) {
    return PetHotelProfileResponse(
      success: json['success'] as bool,
      message: json['message'] as String,
      data: json['data'] != null
          ? PetHotelProfile.fromJson(json['data'] as Map<String, dynamic>)
          : null,
    );
  }
}

class PetHotelProfile {
  final String id;
  final String userId;
  final String name;
  final String email;
  final String phone;
  final String description;
  final List<String> images;
  final String dayStartingTime;
  final String dayEndingTime;
  final String nightStartingTime;
  final String nightEndingTime;
  final String status;
  final bool isVerified;
  final int rating;
  final int reviewCount;
  final dynamic analytics;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<Address> addresses;

  PetHotelProfile({
    required this.id,
    required this.userId,
    required this.name,
    required this.email,
    required this.phone,
    required this.description,
    required this.images,
    required this.dayStartingTime,
    required this.dayEndingTime,
    required this.nightStartingTime,
    required this.nightEndingTime,
    required this.status,
    required this.isVerified,
    required this.rating,
    required this.reviewCount,
    required this.analytics,
    required this.createdAt,
    required this.updatedAt,
    required this.addresses,
  });

  factory PetHotelProfile.fromJson(final Map<String, dynamic> json) {
    final images =
        (json['images'] as List?)
            ?.map((final e) => (e as String).trim())
            .toList() ??
        [];

    final addressesJson = json['addresses'] as List?;
    final addresses =
        addressesJson
            ?.map((final a) => Address.fromJson(a as Map<String, dynamic>))
            .toList() ??
        [];

    return PetHotelProfile(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      description: json['description'] as String,
      images: images,
      dayStartingTime: json['dayStartingTime'] as String,
      dayEndingTime: json['dayEndingTime'] as String,
      nightStartingTime: json['nightStartingTime'] as String,
      nightEndingTime: json['nightEndingTime'] as String,
      status: json['status'] as String,
      isVerified: json['isVerified'] as bool,
      rating: json['rating'] as int,
      reviewCount: json['reviewCount'] as int,
      analytics: json['analytics'],
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      addresses: addresses,
    );
  }
}

class Address {
  final String id;
  final String city;
  final String country;
  final String streetAddress;
  final String postalCode;

  Address({
    required this.id,
    required this.city,
    required this.country,
    required this.streetAddress,
    required this.postalCode,
  });

  factory Address.fromJson(final Map<String, dynamic> json) {
    return Address(
      id: json['id'] as String,
      city: json['city'] as String,
      country: json['country'] as String,
      streetAddress: json['streetAddress'] as String,
      postalCode: json['postalCode'] as String,
    );
  }
}
