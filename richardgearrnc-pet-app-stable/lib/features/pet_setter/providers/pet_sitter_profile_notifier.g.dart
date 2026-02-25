// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pet_sitter_profile_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Provides a list of pet sitter profiles (current user's profile).
///
/// Fetches from the API and caches the results. Use [invalidatePetSitterProfiles]
/// to refresh the data.

@ProviderFor(PetSitterProfiles)
final petSitterProfilesProvider = PetSitterProfilesProvider._();

/// Provides a list of pet sitter profiles (current user's profile).
///
/// Fetches from the API and caches the results. Use [invalidatePetSitterProfiles]
/// to refresh the data.
final class PetSitterProfilesProvider
    extends
        $AsyncNotifierProvider<
          PetSitterProfiles,
          List<PetSitterDirectoryProfile>
        > {
  /// Provides a list of pet sitter profiles (current user's profile).
  ///
  /// Fetches from the API and caches the results. Use [invalidatePetSitterProfiles]
  /// to refresh the data.
  PetSitterProfilesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'petSitterProfilesProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$petSitterProfilesHash();

  @$internal
  @override
  PetSitterProfiles create() => PetSitterProfiles();
}

String _$petSitterProfilesHash() => r'850073fb0b2e7021af0380b7ddd74d187b357d93';

/// Provides a list of pet sitter profiles (current user's profile).
///
/// Fetches from the API and caches the results. Use [invalidatePetSitterProfiles]
/// to refresh the data.

abstract class _$PetSitterProfiles
    extends $AsyncNotifier<List<PetSitterDirectoryProfile>> {
  FutureOr<List<PetSitterDirectoryProfile>> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref =
        this.ref
            as $Ref<
              AsyncValue<List<PetSitterDirectoryProfile>>,
              List<PetSitterDirectoryProfile>
            >;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<
                AsyncValue<List<PetSitterDirectoryProfile>>,
                List<PetSitterDirectoryProfile>
              >,
              AsyncValue<List<PetSitterDirectoryProfile>>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Provides a single pet sitter service by ID.

@ProviderFor(petSitterServiceDetails)
final petSitterServiceDetailsProvider = PetSitterServiceDetailsFamily._();

/// Provides a single pet sitter service by ID.

final class PetSitterServiceDetailsProvider
    extends
        $FunctionalProvider<
          AsyncValue<PetSitterServiceDetails?>,
          PetSitterServiceDetails?,
          FutureOr<PetSitterServiceDetails?>
        >
    with
        $FutureModifier<PetSitterServiceDetails?>,
        $FutureProvider<PetSitterServiceDetails?> {
  /// Provides a single pet sitter service by ID.
  PetSitterServiceDetailsProvider._({
    required PetSitterServiceDetailsFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'petSitterServiceDetailsProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$petSitterServiceDetailsHash();

  @override
  String toString() {
    return r'petSitterServiceDetailsProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<PetSitterServiceDetails?> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PetSitterServiceDetails?> create(Ref ref) {
    final argument = this.argument as String;
    return petSitterServiceDetails(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is PetSitterServiceDetailsProvider &&
        other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$petSitterServiceDetailsHash() =>
    r'e1f8fcb0fa0512c16f930c79c0e465c20908c156';

/// Provides a single pet sitter service by ID.

final class PetSitterServiceDetailsFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<PetSitterServiceDetails?>, String> {
  PetSitterServiceDetailsFamily._()
    : super(
        retry: null,
        name: r'petSitterServiceDetailsProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// Provides a single pet sitter service by ID.

  PetSitterServiceDetailsProvider call(String serviceId) =>
      PetSitterServiceDetailsProvider._(argument: serviceId, from: this);

  @override
  String toString() => r'petSitterServiceDetailsProvider';
}

/// Provides a list of pet sitter services (for current user or filtered list).

@ProviderFor(PetSitterServices)
final petSitterServicesProvider = PetSitterServicesProvider._();

/// Provides a list of pet sitter services (for current user or filtered list).
final class PetSitterServicesProvider
    extends $AsyncNotifierProvider<PetSitterServices, List<PetSitterService>> {
  /// Provides a list of pet sitter services (for current user or filtered list).
  PetSitterServicesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'petSitterServicesProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$petSitterServicesHash();

  @$internal
  @override
  PetSitterServices create() => PetSitterServices();
}

String _$petSitterServicesHash() => r'8793138856a34a2fb26b49dcda19487b09a05c1d';

/// Provides a list of pet sitter services (for current user or filtered list).

abstract class _$PetSitterServices
    extends $AsyncNotifier<List<PetSitterService>> {
  FutureOr<List<PetSitterService>> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref =
        this.ref
            as $Ref<AsyncValue<List<PetSitterService>>, List<PetSitterService>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<
                AsyncValue<List<PetSitterService>>,
                List<PetSitterService>
              >,
              AsyncValue<List<PetSitterService>>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Provides a list of pet sitter packages (for current user).

@ProviderFor(PetSitterPackages)
final petSitterPackagesProvider = PetSitterPackagesProvider._();

/// Provides a list of pet sitter packages (for current user).
final class PetSitterPackagesProvider
    extends $AsyncNotifierProvider<PetSitterPackages, List<PetSitterPackage>> {
  /// Provides a list of pet sitter packages (for current user).
  PetSitterPackagesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'petSitterPackagesProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$petSitterPackagesHash();

  @$internal
  @override
  PetSitterPackages create() => PetSitterPackages();
}

String _$petSitterPackagesHash() => r'298c0a495a3cc23457e678da4e6005970442efc5';

/// Provides a list of pet sitter packages (for current user).

abstract class _$PetSitterPackages
    extends $AsyncNotifier<List<PetSitterPackage>> {
  FutureOr<List<PetSitterPackage>> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref =
        this.ref
            as $Ref<AsyncValue<List<PetSitterPackage>>, List<PetSitterPackage>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<
                AsyncValue<List<PetSitterPackage>>,
                List<PetSitterPackage>
              >,
              AsyncValue<List<PetSitterPackage>>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Provides a single package by ID.

@ProviderFor(petSitterPackageDetails)
final petSitterPackageDetailsProvider = PetSitterPackageDetailsFamily._();

/// Provides a single package by ID.

final class PetSitterPackageDetailsProvider
    extends
        $FunctionalProvider<
          AsyncValue<PetSitterPackageDetails?>,
          PetSitterPackageDetails?,
          FutureOr<PetSitterPackageDetails?>
        >
    with
        $FutureModifier<PetSitterPackageDetails?>,
        $FutureProvider<PetSitterPackageDetails?> {
  /// Provides a single package by ID.
  PetSitterPackageDetailsProvider._({
    required PetSitterPackageDetailsFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'petSitterPackageDetailsProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$petSitterPackageDetailsHash();

  @override
  String toString() {
    return r'petSitterPackageDetailsProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<PetSitterPackageDetails?> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PetSitterPackageDetails?> create(Ref ref) {
    final argument = this.argument as String;
    return petSitterPackageDetails(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is PetSitterPackageDetailsProvider &&
        other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$petSitterPackageDetailsHash() =>
    r'ceb5843256a094bee7a567ff29525f16ac319ab9';

/// Provides a single package by ID.

final class PetSitterPackageDetailsFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<PetSitterPackageDetails?>, String> {
  PetSitterPackageDetailsFamily._()
    : super(
        retry: null,
        name: r'petSitterPackageDetailsProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// Provides a single package by ID.

  PetSitterPackageDetailsProvider call(String packageId) =>
      PetSitterPackageDetailsProvider._(argument: packageId, from: this);

  @override
  String toString() => r'petSitterPackageDetailsProvider';
}
