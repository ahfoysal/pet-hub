import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_school/courses/data/repositories/courses_repository_impl.dart';
import 'package:petzy_app/features/pet_school/courses/domain/entities/course.dart';
import 'package:petzy_app/features/pet_school/courses/domain/repositories/courses_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'courses_provider.g.dart';

/// Provider for courses repository.
@riverpod
CoursesRepository coursesRepository(final Ref ref) {
  return CoursesRepositoryImpl(
    apiClient: ref.watch(apiClientProvider),
  );
}

/// Provider for fetching pet school courses.
///
/// Returns a list of courses for the pet school.
/// Automatically handles loading and error states.
@riverpod
Future<List<Course>> courses(final Ref ref) async {
  final repository = ref.watch(coursesRepositoryProvider);
  final result = await repository.getCourses();

  return result.fold(
    onSuccess: (final List<Course> courses) => courses,
    onFailure: (final AppException error) => throw error,
  );
}
