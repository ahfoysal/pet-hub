import 'package:flutter/foundation.dart' show immutable;
import 'package:petzy_app/core/result/result.dart';

/// Represents a pet booking.
@immutable
class Booking {
  const Booking({
    required this.id,
    required this.status,
    this.serviceType,
    this.providerName,
    this.petName,
    this.startDate,
    this.endDate,
    this.totalPrice = 0,
    this.notes,
    this.createdAt,
  });

  final String id;
  final String status;
  final String? serviceType;
  final String? providerName;
  final String? petName;
  final DateTime? startDate;
  final DateTime? endDate;
  final int totalPrice;
  final String? notes;
  final DateTime? createdAt;

  factory Booking.fromJson(final Map<String, dynamic> json) {
    return Booking(
      id: json['id'] as String? ?? '',
      status: json['status'] as String? ?? 'PENDING',
      serviceType: json['serviceType'] as String?,
      providerName: json['providerName'] as String? ??
          json['petSitter']?['fullName'] as String? ??
          json['hotelProfile']?['hotelName'] as String?,
      petName: json['pet']?['name'] as String? ?? json['petName'] as String?,
      startDate: json['startDate'] != null
          ? DateTime.tryParse(json['startDate'] as String)
          : null,
      endDate: json['endDate'] != null
          ? DateTime.tryParse(json['endDate'] as String)
          : null,
      totalPrice: json['totalPrice'] as int? ?? 0,
      notes: json['notes'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
    );
  }
}

/// Repository interface for bookings.
abstract class BookingsRepository {
  /// Fetch the current user's bookings.
  Future<Result<List<Booking>>> fetchBookings({
    final int limit = 20,
    final int page = 1,
  });

  /// Fetch a specific booking by ID.
  Future<Result<Booking>> fetchBookingById(final String bookingId);

  /// Cancel a booking.
  Future<Result<void>> cancelBooking(final String bookingId);
}
