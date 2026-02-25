import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_school/courses/domain/entities/course.dart';
import 'package:petzy_app/features/pet_school/courses/domain/repositories/courses_repository.dart';

/// Implementation of [CoursesRepository] using API client.
///
/// Handles:
/// - API communication for courses
/// - Response parsing
/// - Error handling
class CoursesRepositoryImpl implements CoursesRepository {
  /// Creates a [CoursesRepositoryImpl] instance.
  const CoursesRepositoryImpl({
    required this.apiClient,
  });

  /// The API client for network requests.
  final ApiClient apiClient;

  @override
  Future<Result<List<Course>>> getCourses() async {
    try {
      final response = await apiClient.get<Map<String, dynamic>>(
        '/course/my-courses?page=1&limit=10',
        fromJson: (final json) => json as Map<String, dynamic>,
      );

      return response.map((final data) {
        // Response structure: { success, message, data: { data: [], meta: {} } }
        final responseData = data['data'] as Map<String, dynamic>;
        final coursesData = responseData['data'] as List;
        return coursesData
            .map(
              (final courseJson) =>
                  Course.fromJson(courseJson as Map<String, dynamic>),
            )
            .toList();
      });
    } catch (e, stack) {
      return Failure(
        NetworkException(
          message: e.toString(),
          stackTrace: stack,
        ),
      );
    }
  }
}
