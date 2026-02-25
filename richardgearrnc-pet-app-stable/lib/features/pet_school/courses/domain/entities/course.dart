import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:petzy_app/features/pet_school/courses/domain/entities/trainer.dart';

part 'course.freezed.dart';
part 'course.g.dart';

/// Represents the level of a course.
enum CourseLevel {
  @JsonValue('BEGINNER')
  beginner,
  @JsonValue('INTERMEDIATE')
  intermediate,
  @JsonValue('ADVANCED')
  advanced,
}

/// Represents a pet school course.
///
/// Uses Freezed for:
/// - Immutability
/// - Value equality
/// - copyWith
/// - JSON serialization
@freezed
abstract class Course with _$Course {
  /// Creates a [Course] instance.
  const factory Course({
    required final String id,
    required final String schoolId,
    required final String name,
    required final String details,
    @JsonKey(name: 'thumbnailImg') required final String thumbnailImg,
    @JsonKey(name: 'startingTime') required final DateTime startingTime,
    @JsonKey(name: 'endingTime') required final DateTime endingTime,
    required final double price,
    @JsonKey(name: 'availableSeats') required final int availableSeats,
    @JsonKey(name: 'courseFor') required final String courseFor,
    required final String discount,
    required final int duration,
    @JsonKey(name: 'trainerId') required final String trainerId,
    @JsonKey(name: 'courseLevel')
    @Default(CourseLevel.beginner)
    final CourseLevel courseLevel,
    @JsonKey(name: 'createdAt') final DateTime? createdAt,
    @JsonKey(name: 'updatedAt') final DateTime? updatedAt,
    required final Trainer trainer,
  }) = _Course;

  /// Creates a [Course] instance from JSON.
  factory Course.fromJson(final Map<String, dynamic> json) =>
      _$CourseFromJson(json);
}
