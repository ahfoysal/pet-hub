import 'dart:io';

import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/core/network/dio_provider.dart';
import 'package:petzy_app/core/network/error_converter.dart';
import 'package:petzy_app/core/result/result.dart';

part 'api_client.g.dart';

/// Provider for the default error converter.
@Riverpod(keepAlive: true)
ErrorConverter errorConverter(final Ref ref) {
  return const DefaultErrorConverter();
}

/// Provider for the API client.
@Riverpod(keepAlive: true)
ApiClient apiClient(final Ref ref) {
  return ApiClient(
    ref.watch(dioProvider),
    errorConverter: ref.watch(errorConverterProvider),
  );
}

/// A type-safe API client wrapper around Dio.
/// All network calls return [Result] for consistent error handling.
///
/// The error handling is delegated to an [ErrorConverter], making it
/// easy to customize for different APIs (e.g., Stripe, Google Maps).
///
/// ## Type Safety with Complex Types
///
/// **Important:** Always provide [fromJson] for complex types. Dart's type system
/// cannot verify generic types at runtime due to type erasure.
///
/// ✅ **Correct - Using fromJson:**
/// ```dart
/// // For a single object
/// final result = await apiClient.get<User>(
///   '/users/1',
///   fromJson: (json) => User.fromJson(json as Map<String, dynamic>),
/// );
///
/// // For a list of objects
/// final result = await apiClient.get<List<User>>(
///   '/users',
///   fromJson: (json) => (json as List)
///       .map((e) => User.fromJson(e as Map<String, dynamic>))
///       .toList(),
/// );
/// ```
///
/// ❌ **Incorrect - Will fail at runtime:**
/// ```dart
/// // This will fail! Dart cannot verify List<User> at runtime.
/// final result = await apiClient.get<List<User>>('/users');
/// ```
///
/// **Safe without fromJson:** Only primitives and simple types:
/// - `String`, `int`, `double`, `bool`
/// - `Map<String, dynamic>` (raw JSON)
/// - `List<dynamic>` (raw JSON array)
class ApiClient {
  /// Creates an [ApiClient] instance.
  ApiClient(this._dio, {final ErrorConverter? errorConverter})
    : _errorConverter = errorConverter ?? const DefaultErrorConverter();

  final Dio _dio;
  final ErrorConverter _errorConverter;

  /// Perform a GET request.
  Future<Result<T>> get<T>(
    final String path, {
    final Map<String, dynamic>? queryParameters,
    final Map<String, dynamic>? extra,
    final T Function(dynamic json)? fromJson,
  }) async {
    return _executeRequest(
      () {
        final options = extra != null ? Options(extra: extra) : null;
        return _dio.get<dynamic>(
          path,
          queryParameters: queryParameters,
          options: options,
        );
      },
      fromJson: fromJson,
    );
  }

  /// Perform a POST request.
  Future<Result<T>> post<T>(
    final String path, {
    final Object? data,
    final Map<String, dynamic>? queryParameters,
    final T Function(dynamic json)? fromJson,
  }) async {
    return _executeRequest(
      () => _dio.post<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
      ),
      fromJson: fromJson,
    );
  }

  /// Perform a PUT request.
  Future<Result<T>> put<T>(
    final String path, {
    final Object? data,
    final Map<String, dynamic>? queryParameters,
    final T Function(dynamic json)? fromJson,
  }) async {
    return _executeRequest(
      () => _dio.put<dynamic>(path, data: data, queryParameters: queryParameters),
      fromJson: fromJson,
    );
  }

  /// Perform a PATCH request.
  Future<Result<T>> patch<T>(
    final String path, {
    final Object? data,
    final Map<String, dynamic>? queryParameters,
    final T Function(dynamic json)? fromJson,
  }) async {
    return _executeRequest(
      () => _dio.patch<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
      ),
      fromJson: fromJson,
    );
  }

  /// Perform a DELETE request.
  Future<Result<T>> delete<T>(
    final String path, {
    final Object? data,
    final Map<String, dynamic>? queryParameters,
    final T Function(dynamic json)? fromJson,
  }) async {
    return _executeRequest(
      () => _dio.delete<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
      ),
      fromJson: fromJson,
    );
  }

  /// Execute a request and convert to Result.
  ///
  /// If [fromJson] is provided, it will be used to parse the response.
  /// If [fromJson] is null, the response data must be directly castable to [T].
  ///
  /// **Special Cases:**
  /// - For `void` responses (DELETE, POST with no body), use `T = void`
  /// - For complex types like `List<User>`, always provide [fromJson]
  Future<Result<T>> _executeRequest<T>(
    final Future<Response<dynamic>> Function() request, {
    final T Function(dynamic json)? fromJson,
  }) async {
    try {
      final response = await request();

      // Handle void responses (e.g., DELETE requests that return no body)
      // Check if T is void, Null, or if response has no data
      if (_isVoidType<T>() || response.data == null) {
        // For void type, return null cast to T (which is valid for void)
        return Success(null as T);
      }

      if (fromJson != null) {
        return Success(fromJson(response.data));
      }

      // Safety check: Warn if trying to cast complex types without fromJson
      // This prevents runtime errors when T is a generic type like List<User>
      final data = response.data;
      if (data is! T) {
        // Type mismatch - provide helpful error message
        return Failure(
          UnexpectedException(
            message:
                'Type mismatch: Expected $T but got ${data.runtimeType}. '
                'For complex types, provide a fromJson parameter.',
            code: 'TYPE_MISMATCH',
          ),
        );
      }

      return Success(data);
    } on DioException catch (e, stackTrace) {
      return Failure(_errorConverter.convertDioException(e, stackTrace));
    } on SocketException catch (e, stackTrace) {
      return Failure(_errorConverter.convertSocketException(e, stackTrace));
    } catch (e, stackTrace) {
      return Failure(_errorConverter.convertUnknownError(e, stackTrace));
    }
  }

  /// Check if T is a void-like type (void, Null, or dynamic with null intent).
  bool _isVoidType<T>() {
    // In Dart, void is represented as Null at runtime
    // We also check for explicit Null type
    return null is T;
  }
}
