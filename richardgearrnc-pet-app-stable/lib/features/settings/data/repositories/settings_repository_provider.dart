import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/core/network/api_client.dart';
import 'package:petzy_app/features/settings/data/repositories/settings_repository_remote.dart';

/// Provides an instance of [SettingsRepository].
final settingsRepositoryProvider = Provider<SettingsRepository>((final ref) {
  final apiClient = ref.watch(apiClientProvider);
  return SettingsRepositoryRemote(apiClient: apiClient);
});
