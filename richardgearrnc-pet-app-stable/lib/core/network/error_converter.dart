import 'dart:io';

import 'package:dio/dio.dart';
import 'package:petzy_app/core/result/result.dart';

/// Interface for converting API errors to app exceptions.
///
/// Implement this to customize error handling for different APIs.
/// For example, a Stripe API might return errors in a different format
/// than your main backend.
///
/// Usage:
/// ```dart
/// class StripeErrorConverter implements ErrorConverter {
///   @override
///   String? extractErrorMessage(dynamic data) {
///     if (data is Map<String, dynamic>) {
///       return data['error']?['message'] as String?;
///     }
///     return null;
///   }
/// }
/// ```
abstract interface class ErrorConverter {
  /// Convert a DioException to a NetworkException.
  NetworkException convertDioException(
    final DioException e,
    final StackTrace stackTrace,
  );

  /// Convert a SocketException to a NetworkException.
  NetworkException convertSocketException(
    final SocketException e,
    final StackTrace stackTrace,
  );

  /// Convert an unknown error to an UnexpectedException.
  AppException convertUnknownError(
    final Object error,
    final StackTrace stackTrace,
  );

  /// Extract error message from response data.
  String? extractErrorMessage(final dynamic data);

  /// Map HTTP status code to a NetworkException.
  NetworkException mapStatusCode(
    final int? statusCode,
    final dynamic data,
    final StackTrace stackTrace,
  );
}

/// Default error converter for standard REST APIs.
///
/// Expects error responses in one of these formats:
/// - `{"message": "Error message"}`
/// - `{"error": "Error message"}`
/// - `{"errors": ["Error 1", "Error 2"]}`
class DefaultErrorConverter implements ErrorConverter {
  /// Creates a [DefaultErrorConverter] instance.
  const DefaultErrorConverter();

  @override
  NetworkException convertDioException(
    final DioException e,
    final StackTrace stackTrace,
  ) {
    return switch (e.type) {
      DioExceptionType.connectionTimeout ||
      DioExceptionType.sendTimeout ||
      DioExceptionType.receiveTimeout => NetworkException.timeout(),
      DioExceptionType.connectionError => NetworkException.noConnection(),
      DioExceptionType.badResponse => mapStatusCode(
        e.response?.statusCode,
        e.response?.data,
        stackTrace,
      ),
      _ => NetworkException(
        message: e.message ?? 'Network error occurred',
        stackTrace: stackTrace,
      ),
    };
  }

  @override
  NetworkException convertSocketException(
    final SocketException e,
    final StackTrace stackTrace,
  ) {
    return NetworkException(
      message: 'No internet connection',
      code: 'NO_CONNECTION',
      stackTrace: stackTrace,
    );
  }

  @override
  AppException convertUnknownError(
    final Object error,
    final StackTrace stackTrace,
  ) {
    return UnexpectedException(
      message: 'An unexpected error occurred',
      originalError: error,
      stackTrace: stackTrace,
    );
  }

  @override
  String? extractErrorMessage(final dynamic data) {
    if (data is Map<String, dynamic>) {
      // Try common error message field names
      // Handle case where message might be a List (validation errors)
      final message = data['message'];
      if (message is String) {
        return message;
      }
      if (message is List) {
        return message.map((final e) => e.toString()).join(', ');
      }

      final error = data['error'];
      if (error is String) {
        return error;
      }
      if (error is List) {
        return error.map((final e) => e.toString()).join(', ');
      }

      final detail = data['detail'];
      if (detail is String) {
        return detail;
      }
      if (detail is List) {
        return detail.map((final e) => e.toString()).join(', ');
      }

      return _extractErrors(data['errors']);
    }
    if (data is String) {
      return data;
    }
    return null;
  }

  String? _extractErrors(final dynamic errors) {
    if (errors is List) {
      return errors.map((final e) => e.toString()).join(', ');
    }
    if (errors is Map) {
      return errors.values.map((final e) => e.toString()).join(', ');
    }
    return errors?.toString();
  }

  @override
  NetworkException mapStatusCode(
    final int? statusCode,
    final dynamic data,
    final StackTrace stackTrace,
  ) {
    final message = extractErrorMessage(data);

    return switch (statusCode) {
      400 => NetworkException(
        message: message ?? 'Bad request',
        statusCode: statusCode,
        code: 'BAD_REQUEST',
        stackTrace: stackTrace,
      ),
      401 => NetworkException.unauthorized(),
      403 => NetworkException(
        message: message ?? 'Forbidden',
        statusCode: statusCode,
        code: 'FORBIDDEN',
        stackTrace: stackTrace,
      ),
      404 => NetworkException(
        message: message ?? 'Not found',
        statusCode: statusCode,
        code: 'NOT_FOUND',
        stackTrace: stackTrace,
      ),
      422 => NetworkException(
        message: message ?? 'Validation failed',
        statusCode: statusCode,
        code: 'VALIDATION_ERROR',
        stackTrace: stackTrace,
      ),
      429 => NetworkException(
        message: message ?? 'Too many requests',
        statusCode: statusCode,
        code: 'RATE_LIMITED',
        stackTrace: stackTrace,
      ),
      _ when statusCode != null && statusCode >= 500 =>
        NetworkException.serverError(statusCode),
      _ => NetworkException(
        message: message ?? 'Request failed',
        statusCode: statusCode,
        stackTrace: stackTrace,
      ),
    };
  }
}
