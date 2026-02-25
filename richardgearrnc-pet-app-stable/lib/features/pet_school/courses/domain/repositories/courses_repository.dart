import 'package:petzy_app/core/result/result.dart';
import 'package:petzy_app/features/pet_school/courses/domain/entities/course.dart';

/// Repository interface for pet school courses operations.
///
/// Defines the contract for courses data operations.
/// Implementations should handle:
/// - API communication
/// - Error handling
/// - Data transformation
abstract class CoursesRepository {
  /// Fetches the list of courses for the pet school.
  ///
  /// Returns [Result<List<Course>>] containing:
  /// - Success: List of courses
  /// - Failure: Error information
  Future<Result<List<Course>>> getCourses();
}
