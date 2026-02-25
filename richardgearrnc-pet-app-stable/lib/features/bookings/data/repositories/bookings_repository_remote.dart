import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/core/utils/logger.dart';
import 'package:petzy_app/features/bookings/domain/repositories/bookings_repository.dart';

export 'package:petzy_app/features/bookings/domain/repositories/bookings_repository.dart';

/// Remote implementation of [BookingsRepository].
class BookingsRepositoryRemote implements BookingsRepository {
  BookingsRepositoryRemote({required this.apiClient});

  final ApiClient apiClient;

  static const String _bookingsEndpoint = '/bookings';

  @override
  Future<Result<List<Booking>>> fetchBookings({
    final int limit = 20,
    final int page = 1,
  }) async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        '$_bookingsEndpoint/me',
        queryParameters: {
          'limit': limit.toString(),
          'page': page.toString(),
        },
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

          final bookings = items
              .whereType<Map<String, dynamic>>()
              .map(Booking.fromJson)
              .toList();
          return Success(bookings);
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching bookings: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch bookings: $e'),
      );
    }
  }

  @override
  Future<Result<Booking>> fetchBookingById(final String bookingId) async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        '$_bookingsEndpoint/$bookingId',
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final data) {
          final bookingData = data['data'] as Map<String, dynamic>? ?? data;
          return Success(Booking.fromJson(bookingData));
        },
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error fetching booking $bookingId: $e');
      return Failure(
        UnexpectedException(message: 'Failed to fetch booking: $e'),
      );
    }
  }

  @override
  Future<Result<void>> cancelBooking(final String bookingId) async {
    try {
      final response = await apiClient.patch<Map<String, dynamic>>(
        '$_bookingsEndpoint/$bookingId/cancel',
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.fold(
        onSuccess: (final _) => const Success(null),
        onFailure: Failure.new,
      );
    } catch (e) {
      AppLogger.instance.e('Error cancelling booking $bookingId: $e');
      return Failure(
        UnexpectedException(message: 'Failed to cancel booking: $e'),
      );
    }
  }
}
