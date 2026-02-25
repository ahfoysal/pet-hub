// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pet_school_profile_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Provider for fetching the pet school profile.
///
/// This provider automatically handles loading, error, and data states
/// using Riverpod's AsyncValue.

@ProviderFor(petSchoolProfile)
final petSchoolProfileProvider = PetSchoolProfileProvider._();

/// Provider for fetching the pet school profile.
///
/// This provider automatically handles loading, error, and data states
/// using Riverpod's AsyncValue.

final class PetSchoolProfileProvider
    extends
        $FunctionalProvider<
          AsyncValue<PetSchoolProfile>,
          PetSchoolProfile,
          FutureOr<PetSchoolProfile>
        >
    with $FutureModifier<PetSchoolProfile>, $FutureProvider<PetSchoolProfile> {
  /// Provider for fetching the pet school profile.
  ///
  /// This provider automatically handles loading, error, and data states
  /// using Riverpod's AsyncValue.
  PetSchoolProfileProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'petSchoolProfileProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$petSchoolProfileHash();

  @$internal
  @override
  $FutureProviderElement<PetSchoolProfile> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PetSchoolProfile> create(Ref ref) {
    return petSchoolProfile(ref);
  }
}

String _$petSchoolProfileHash() => r'd2ef3049cd53c67bc246ab8f3e1523bdd313d58b';

/// Provider for updating the pet school profile.
///
/// This is a family provider that takes update parameters.

@ProviderFor(updatePetSchoolProfile)
final updatePetSchoolProfileProvider = UpdatePetSchoolProfileFamily._();

/// Provider for updating the pet school profile.
///
/// This is a family provider that takes update parameters.

final class UpdatePetSchoolProfileProvider
    extends
        $FunctionalProvider<
          AsyncValue<PetSchoolProfile>,
          PetSchoolProfile,
          FutureOr<PetSchoolProfile>
        >
    with $FutureModifier<PetSchoolProfile>, $FutureProvider<PetSchoolProfile> {
  /// Provider for updating the pet school profile.
  ///
  /// This is a family provider that takes update parameters.
  UpdatePetSchoolProfileProvider._({
    required UpdatePetSchoolProfileFamily super.from,
    required ({
      String name,
      String description,
      String phone,
      List<String>? images,
    })
    super.argument,
  }) : super(
         retry: null,
         name: r'updatePetSchoolProfileProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$updatePetSchoolProfileHash();

  @override
  String toString() {
    return r'updatePetSchoolProfileProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<PetSchoolProfile> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PetSchoolProfile> create(Ref ref) {
    final argument =
        this.argument
            as ({
              String name,
              String description,
              String phone,
              List<String>? images,
            });
    return updatePetSchoolProfile(
      ref,
      name: argument.name,
      description: argument.description,
      phone: argument.phone,
      images: argument.images,
    );
  }

  @override
  bool operator ==(Object other) {
    return other is UpdatePetSchoolProfileProvider &&
        other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$updatePetSchoolProfileHash() =>
    r'a47d3b1b42bb658fa6b2ba1bf4ba4e9b9702cd9d';

/// Provider for updating the pet school profile.
///
/// This is a family provider that takes update parameters.

final class UpdatePetSchoolProfileFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<PetSchoolProfile>,
          ({
            String name,
            String description,
            String phone,
            List<String>? images,
          })
        > {
  UpdatePetSchoolProfileFamily._()
    : super(
        retry: null,
        name: r'updatePetSchoolProfileProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// Provider for updating the pet school profile.
  ///
  /// This is a family provider that takes update parameters.

  UpdatePetSchoolProfileProvider call({
    required String name,
    required String description,
    required String phone,
    List<String>? images,
  }) => UpdatePetSchoolProfileProvider._(
    argument: (
      name: name,
      description: description,
      phone: phone,
      images: images,
    ),
    from: this,
  );

  @override
  String toString() => r'updatePetSchoolProfileProvider';
}
