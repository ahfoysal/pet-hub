import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/features/profile/data/repositories/profile_repository_remote.dart';

/// Provides an instance of [ProfileRepository].
final profileRepositoryProvider = Provider<ProfileRepository>((final ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ProfileRepositoryRemote(apiClient: apiClient);
});
