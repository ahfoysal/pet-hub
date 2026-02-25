import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'pet_sitter_search_notifier.g.dart';

/// UI state for the pet sitter search page.
class PetSitterSearchState {
  const PetSitterSearchState({
    this.selectedServiceId,
    this.selectedPackageId,
    this.tabIndex = 0,
  });

  final String? selectedServiceId;
  final String? selectedPackageId;
  final int tabIndex;

  PetSitterSearchState copyWith({
    final String? selectedServiceId,
    final String? selectedPackageId,
    final int? tabIndex,
  }) {
    return PetSitterSearchState(
      selectedServiceId: selectedServiceId ?? this.selectedServiceId,
      selectedPackageId: selectedPackageId ?? this.selectedPackageId,
      tabIndex: tabIndex ?? this.tabIndex,
    );
  }
}

/// Manages the pet sitter search page state.
@riverpod
class PetSitterSearchNotifier extends _$PetSitterSearchNotifier {
  @override
  PetSitterSearchState build() {
    return const PetSitterSearchState();
  }

  /// Select a service.
  void selectService(final String serviceId) {
    state = state.copyWith(selectedServiceId: serviceId);
  }

  /// Select a package.
  void selectPackage(final String packageId) {
    state = state.copyWith(selectedPackageId: packageId);
  }

  /// Change the tab index.
  void setTabIndex(final int index) {
    state = state.copyWith(tabIndex: index);
  }

  /// Clear selections.
  void clearSelections() {
    state = const PetSitterSearchState();
  }
}
