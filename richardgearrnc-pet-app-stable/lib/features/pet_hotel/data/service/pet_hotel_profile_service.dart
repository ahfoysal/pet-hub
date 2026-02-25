// lib/services/pet_hotel_profile_service.dart

import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:petzy_app/core/constants/storage_keys.dart';
import 'package:petzy_app/config/env_config.dart';
import 'package:petzy_app/features/pet_hotel/data/model/pet_hotel_profile_model.dart';

class PetHotelProfileService {
  final _secureStorage = const FlutterSecureStorage();

  Future<PetHotelProfileResponse> getProfile({final String? token}) async {
    // Retrieve token from secure storage if not provided
    final authToken =
        token ?? await _secureStorage.read(key: StorageKeys.accessToken);

    if (authToken == null || authToken.isEmpty) {
      throw Exception('Authentication token not found. Please log in again.');
    }

    // Determine base URL, optionally stripping any trailing `/api` if you add `/pet...`
    final baseUrl = EnvConfig.baseUrl.endsWith('/api')
        ? EnvConfig.baseUrl.substring(0, EnvConfig.baseUrl.length - 4)
        : EnvConfig.baseUrl;

    final uri = Uri.parse(
      '$baseUrl/api/pet-hotel/profile',
    );

    final response = await http.get(
      uri,
      headers: {
        'Authorization': 'Bearer $authToken',
        'accept': '*/*',
      },
    );

    if (response.statusCode == 200) {
      final body = json.decode(response.body) as Map<String, dynamic>;
      return PetHotelProfileResponse.fromJson(body);
    } else {
      throw Exception('HTTP ${response.statusCode}: Failed to load profile');
    }
  }
}
