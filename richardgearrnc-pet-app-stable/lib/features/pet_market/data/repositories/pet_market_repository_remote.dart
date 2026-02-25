import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/pet_market/domain/repositories/pet_market_repository.dart';

export 'package:petzy_app/features/pet_market/domain/repositories/pet_market_repository.dart';

/// Remote implementation of [PetMarketRepository].
class PetMarketRepositoryRemote implements PetMarketRepository {
  PetMarketRepositoryRemote({required this.apiClient});

  final ApiClient apiClient;

  static const String _productsEndpoint = '/products';

  @override
  Future<Result<List<MarketProduct>>> fetchProducts({
    final int limit = 20,
    final int page = 1,
    final String? search,
    final String? category,
  }) async {
    try {
      final queryParams = <String, String>{
        'limit': limit.toString(),
        'page': page.toString(),
      };
      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (category != null && category.isNotEmpty) {
        queryParams['category'] = category;
      }

      final response = await apiClient.get<Map<String, dynamic>>(
        _productsEndpoint,
        queryParameters: queryParams,
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final rawItems = data['data'];
          final List<dynamic> items;

          if (rawItems is List) {
            items = rawItems;
          } else if (rawItems is Map && rawItems['items'] is List) {
            items = rawItems['items'] as List<dynamic>;
          } else {
            items = [];
          }

          final products = items
              .whereType<Map<String, dynamic>>()
              .map(MarketProduct.fromJson)
              .toList();
          return Success(products);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching products: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch products: $e'),
      );
    }
  }

  @override
  Future<Result<MarketProduct>> fetchProductById(
    final String productId,
  ) async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        '$_productsEndpoint/$productId',
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final productData = data['data'] as Map<String, dynamic>? ?? data;
          return Success(MarketProduct.fromJson(productData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching product $productId: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch product: $e'),
      );
    }
  }
}
