// To parse this JSON data, do
//
//     final petSitterModel = petSitterModelFromJson(jsonString);

import 'dart:convert';

PetSitterModel petSitterModelFromJson(final String str) =>
    PetSitterModel.fromJson(json.decode(str) as Map<String, dynamic>);

String petSitterModelToJson(final PetSitterModel data) =>
    json.encode(data.toJson());

class PetSitterModel {
  final bool success;
  final String message;
  final Data data;

  PetSitterModel({
    required this.success,
    required this.message,
    required this.data,
  });

  factory PetSitterModel.fromJson(final Map<String, dynamic> json) {
    return PetSitterModel(
      success: json['success'] as bool,
      message: json['message'] as String,
      data: Data.fromJson(json['data'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'success': success,
    'message': message,
    'data': data.toJson(),
  };
}

class Data {
  final List<Datum> data;
  final String? nextCursor;

  Data({
    required this.data,
    this.nextCursor,
  });

  factory Data.fromJson(final Map<String, dynamic> json) {
    return Data(
      data: (json['data'] as List<dynamic>)
          .map((final e) => Datum.fromJson(e as Map<String, dynamic>))
          .toList(),
      nextCursor: json['nextCursor'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'data': data.map((final e) => e.toJson()).toList(),
    'nextCursor': nextCursor,
  };
}

class Datum {
  final String id;
  final String bio;
  final String designations;
  final List<String> languages;
  final int yearsOfExperience;
  final User user;
  final String status;

  Datum({
    required this.id,
    required this.bio,
    required this.designations,
    required this.languages,
    required this.yearsOfExperience,
    required this.user,
    required this.status,
  });

  factory Datum.fromJson(final Map<String, dynamic> json) {
    return Datum(
      id: json['id'] as String,
      bio: json['bio'] as String,
      designations: json['designations'] as String,
      languages: (json['languages'] as List<dynamic>).cast<String>(),
      yearsOfExperience: json['yearsOfExperience'] as int,
      user: User.fromJson(json['user'] as Map<String, dynamic>),
      status: json['status'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'bio': bio,
    'designations': designations,
    'languages': languages,
    'yearsOfExperience': yearsOfExperience,
    'user': user.toJson(),
    'status': status,
  };
}

class User {
  final String fullName;
  final String email;
  final String?
  image; // ← made nullable (your sample has valid URLs, but better safe)

  User({
    required this.fullName,
    required this.email,
    this.image,
  });

  factory User.fromJson(final Map<String, dynamic> json) {
    return User(
      fullName: json['fullName'] as String,
      email: json['email'] as String,
      image: json['image'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'email': email,
    'image': image,
  };
}
