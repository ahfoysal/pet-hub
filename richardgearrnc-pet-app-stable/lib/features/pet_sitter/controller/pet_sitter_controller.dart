import 'dart:io';

import 'package:petzy_app/config/env_config.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:petzy_app/core/constants/storage_keys.dart';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../model/pet_sitter_model.dart'; // your model

class PetSitterController extends GetxController {
  // ── Observable state ────────────────────────────────────────────
  var isLoading = false.obs;
  var hasError = false.obs;
  var errorMessage = ''.obs;
  var petSitters = <Datum>[].obs;

  final _secureStorage = const FlutterSecureStorage();

  // Dio instance (created once)
  late final Dio _dio;

  @override
  void onInit() {
    super.onInit();

    // Initialize Dio once when controller is created
    _dio = Dio(
      BaseOptions(
        baseUrl: EnvConfig.baseUrl.endsWith('/api')
            ? EnvConfig.baseUrl.substring(0, EnvConfig.baseUrl.length - 4)
            : EnvConfig.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      ),
    );

    // Auto fetch when screen opens
    fetchPetSitters();
  }

  Future<void> fetchPetSitters() async {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = '';

    try {
      final token = await _secureStorage.read(key: StorageKeys.accessToken);

      final response = await _dio.get(
        '/api/pet-sitter',
        options: Options(
          headers: {
            if (token != null) 'Authorization': 'Bearer $token',
          },
        ),
      );

      // Check status code
      if (response.statusCode == 200 || response.statusCode == 201) {
        try {
          final jsonData = response.data;

          if (jsonData == null || jsonData is! Map<String, dynamic>) {
            throw Exception('Invalid JSON response');
          }

          final model = PetSitterModel.fromJson(jsonData);

          if (model.success == true) {
            petSitters.assignAll(model.data.data);
            Get.snackbar(
              'Success',
              'Loaded ${petSitters.length} sitters',
              duration: const Duration(seconds: 2),
            );
          } else {
            hasError.value = true;
            errorMessage.value = model.message;
          }
        } catch (e) {
          hasError.value = true;
          errorMessage.value = 'Failed to parse response: $e';
          Get.snackbar('Parse Error', errorMessage.value);
        }
      } else {
        hasError.value = true;
        errorMessage.value = 'Server error: ${response.statusCode}';
      }
    } on DioException catch (e) {
      hasError.value = true;

      if (e.response != null) {
        // Server responded with error (400, 401, 500, etc.)
        errorMessage.value =
            'Error ${e.response?.statusCode}: ${e.response?.data?['message'] ?? 'No message'}';
      } else if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout) {
        errorMessage.value = 'Connection timeout – check internet';
      } else if (e.error is SocketException) {
        errorMessage.value = 'No internet connection';
      } else {
        errorMessage.value = 'Request failed: ${e.message}';
      }

      Get.snackbar('Error', errorMessage.value, backgroundColor: Colors.red);
    } catch (e) {
      hasError.value = true;
      errorMessage.value = 'Unexpected error: $e';
      Get.snackbar('Crash', errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  }

  // For pull-to-refresh
  Future<void> refresh() => fetchPetSitters();
}
