import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:petzy_app/config/env_config.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:petzy_app/core/constants/storage_keys.dart';

import '../model/product_model.dart'; // your model file

class ProductController extends GetxController {
  // ── State ────────────────────────────────────────────────────────
  var isLoading = false.obs;
  var hasError = false.obs;
  var errorMessage = ''.obs;
  var products = <Product>[].obs; // ← list from your model

  final _secureStorage = const FlutterSecureStorage();

  // Dio instance
  late final Dio _dio;

  @override
  void onInit() {
    super.onInit();

    _dio = Dio(
      BaseOptions(
        baseUrl: EnvConfig.baseUrl.endsWith('/api')
            ? EnvConfig.baseUrl.substring(0, EnvConfig.baseUrl.length - 4)
            : EnvConfig.baseUrl,
        connectTimeout: const Duration(seconds: 25),
        receiveTimeout: const Duration(seconds: 25),
        headers: {'Accept': 'application/json'},
      ),
    );

    fetchProducts();
  }

  Future<void> fetchProducts() async {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = '';

    try {
      final token = await _secureStorage.read(key: StorageKeys.accessToken);

      final response = await _dio.get(
        '/api/product',
        options: Options(
          headers: {
            if (token != null) 'Authorization': 'Bearer $token',
          },
        ),
      );

      if (response.statusCode == 200) {
        // Safe type check + cast
        final jsonData = response.data;
        if (jsonData is! Map<String, dynamic>) {
          throw Exception('Invalid response format');
        }

        final model = ProductResponse.fromJson(jsonData);

        if (model.success == true) {
          products.assignAll(model.data.data);
          print('Loaded ${products.length} products');
        } else {
          hasError.value = true;
          errorMessage.value = model.message;
        }
      } else {
        hasError.value = true;
        errorMessage.value = 'Server error: ${response.statusCode}';
      }
    } on DioException catch (e) {
      hasError.value = true;
      if (e.response != null) {
        errorMessage.value =
            'Error ${e.response?.statusCode}: ${e.response?.data?['message'] ?? 'No detail'}';
      } else {
        errorMessage.value = 'Network issue: ${e.message}';
      }
      Get.snackbar('Error', errorMessage.value, backgroundColor: Colors.red);
    } catch (e) {
      hasError.value = true;
      errorMessage.value = 'Unexpected: $e';
      Get.snackbar('Crash', errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  }

  // Pull-to-refresh
  Future<void> refresh() => fetchProducts();
}
