import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/features/bookings/data/repositories/bookings_repository_remote.dart';

/// Provides an instance of [BookingsRepository].
final bookingsRepositoryProvider = Provider<BookingsRepository>((final ref) {
  final apiClient = ref.watch(apiClientProvider);
  return BookingsRepositoryRemote(apiClient: apiClient);
});
