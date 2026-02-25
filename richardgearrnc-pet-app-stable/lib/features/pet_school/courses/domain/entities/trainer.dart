import 'package:freezed_annotation/freezed_annotation.dart';

part 'trainer.freezed.dart';
part 'trainer.g.dart';

/// Represents a trainer for courses.
///
/// Uses Freezed for:
/// - Immutability
/// - Value equality
/// - copyWith
/// - JSON serialization
@freezed
abstract class Trainer with _$Trainer {
  /// Creates a [Trainer] instance.
  const factory Trainer({
    required final String id,
    required final String name,
  }) = _Trainer;

  /// Creates a [Trainer] instance from JSON.
  factory Trainer.fromJson(final Map<String, dynamic> json) =>
      _$TrainerFromJson(json);
}
