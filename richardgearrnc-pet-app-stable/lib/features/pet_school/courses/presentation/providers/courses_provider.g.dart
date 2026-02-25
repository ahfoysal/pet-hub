// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'courses_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Provider for courses repository.

@ProviderFor(coursesRepository)
final coursesRepositoryProvider = CoursesRepositoryProvider._();

/// Provider for courses repository.

final class CoursesRepositoryProvider
    extends
        $FunctionalProvider<
          CoursesRepository,
          CoursesRepository,
          CoursesRepository
        >
    with $Provider<CoursesRepository> {
  /// Provider for courses repository.
  CoursesRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'coursesRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$coursesRepositoryHash();

  @$internal
  @override
  $ProviderElement<CoursesRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  CoursesRepository create(Ref ref) {
    return coursesRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(CoursesRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<CoursesRepository>(value),
    );
  }
}

String _$coursesRepositoryHash() => r'a7bd3f70daee4ba63f0b14111b949cd195802f73';

/// Provider for fetching pet school courses.
///
/// Returns a list of courses for the pet school.
/// Automatically handles loading and error states.

@ProviderFor(courses)
final coursesProvider = CoursesProvider._();

/// Provider for fetching pet school courses.
///
/// Returns a list of courses for the pet school.
/// Automatically handles loading and error states.

final class CoursesProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<Course>>,
          List<Course>,
          FutureOr<List<Course>>
        >
    with $FutureModifier<List<Course>>, $FutureProvider<List<Course>> {
  /// Provider for fetching pet school courses.
  ///
  /// Returns a list of courses for the pet school.
  /// Automatically handles loading and error states.
  CoursesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'coursesProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$coursesHash();

  @$internal
  @override
  $FutureProviderElement<List<Course>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<Course>> create(Ref ref) {
    return courses(ref);
  }
}

String _$coursesHash() => r'84e1f8058ebd05d985e759281936c5139a7a7ef6';
