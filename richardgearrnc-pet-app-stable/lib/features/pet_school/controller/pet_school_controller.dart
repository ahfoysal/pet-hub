// lib/features/pet_school/controller/pet_school_controller.dart

import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:petzy_app/config/env_config.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:petzy_app/core/constants/storage_keys.dart';

import '../model/course_response_model.dart';

class PetSchoolController extends GetxController {
  var isLoading = false.obs;
  var hasError = false.obs;
  var errorMessage = ''.obs;
  var courses = <Course>[].obs;

  final _secureStorage = const FlutterSecureStorage();

  late final Dio _dio;

  @override
  void onInit() {
    super.onInit();
    _dio = Dio(
      BaseOptions(
        baseUrl: EnvConfig.baseUrl.endsWith('/api')
            ? EnvConfig.baseUrl.substring(0, EnvConfig.baseUrl.length - 4)
            : EnvConfig.baseUrl,
        connectTimeout: const Duration(seconds: 20),
        receiveTimeout: const Duration(seconds: 20),
      ),
    );

    fetchCourses();
  }

  Future<void> fetchCourses() async {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = '';

    try {
      final token = await _secureStorage.read(key: StorageKeys.accessToken);

      final response = await _dio.get(
        '/api/course/all?limit=10&page=1',
        options: Options(
          headers: {
            if (token != null) 'Authorization': 'Bearer $token',
            'Accept': '*/*',
          },
        ),
      );

      if (response.statusCode == 200) {
        final json = response.data as Map<String, dynamic>;
        final model = CourseResponse.fromJson(json);

        if (model.success) {
          courses.assignAll(model.data.data);
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
      final dynamic responseData = e.response?.data;
      final String? message = responseData is Map<String, dynamic>
          ? responseData['message'] as String?
          : null;

      errorMessage.value = message ?? 'Network error occurred';
    } catch (e) {
      hasError.value = true;
      errorMessage.value = 'Unexpected error: $e';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> refresh() => fetchCourses();
}
