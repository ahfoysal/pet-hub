import 'dart:convert';

import 'package:petzy_app/core/cache/cache_service.dart';
import 'package:petzy_app/core/constants/app_constants.dart';

/// Extension for convenient caching of typed objects.
extension CacheServiceExtensions on CacheService {
  /// Cache a JSON-serializable object.
  Future<void> putObject<T>(
    final String key,
    final T object,
    final Map<String, dynamic> Function(T) toJson, {
    final Duration duration = AppConstants.cacheExpiry,
    final String? etag,
    final String boxName = defaultCacheBoxName,
  }) async {
    final json = jsonEncode(toJson(object));
    await put(key, json, duration: duration, etag: etag, boxName: boxName);
  }

  /// Get a cached object with type conversion.
  Future<T?> getObject<T>(
    final String key,
    final T Function(Map<String, dynamic>) fromJson, {
    final String boxName = defaultCacheBoxName,
  }) async {
    final data = await getIfValid(key, boxName: boxName);
    if (data == null) return null;

    try {
      return fromJson(jsonDecode(data) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  /// Cache a list of JSON-serializable objects.
  Future<void> putList<T>(
    final String key,
    final List<T> list,
    final Map<String, dynamic> Function(T) toJson, {
    final Duration duration = AppConstants.cacheExpiry,
    final String? etag,
    final String boxName = defaultCacheBoxName,
  }) async {
    final json = jsonEncode(list.map(toJson).toList());
    await put(key, json, duration: duration, etag: etag, boxName: boxName);
  }

  /// Get a cached list with type conversion.
  Future<List<T>?> getList<T>(
    final String key,
    final T Function(Map<String, dynamic>) fromJson, {
    final String boxName = defaultCacheBoxName,
  }) async {
    final data = await getIfValid(key, boxName: boxName);
    if (data == null) return null;

    try {
      final list = jsonDecode(data) as List<dynamic>;
      return list
          .map((final e) => fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return null;
    }
  }
}
