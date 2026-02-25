import 'package:flutter/material.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_school/courses/domain/entities/course.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Course card widget displaying course information.
///
/// Shows:
/// - Course thumbnail image with badges
/// - Course name and trainer
/// - Pet type and duration
/// - Price and view details button
class CourseCard extends StatelessWidget {
  /// Creates a [CourseCard] widget.
  const CourseCard({
    required this.course,
    super.key,
  });

  /// The course to display.
  final Course course;

  @override
  Widget build(final BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return FadeIn(
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadow,
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Course thumbnail with level badge
              Stack(
                children: [
                  AppCachedImage(
                    imageUrl: course.thumbnailImg,
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                  // Discount badge (if available)
                  if (course.discount.isNotEmpty && course.discount != '0%')
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.error,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '${course.discount} ${l10n.off}',
                          style: const TextStyle(
                            color: AppColors.onError,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  // Course level badge
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: _getLevelColor(course.courseLevel),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        _getLevelLabel(course.courseLevel, l10n),
                        style: const TextStyle(
                          color: AppColors.surface,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              // Course details
              Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Course name
                    Text(
                      course.name,
                      style: const TextStyle(
                        color: AppColors.onSurface,
                        fontSize: 19,
                        fontWeight: FontWeight.w700,
                        height: 1.3,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 10),

                    // Trainer info
                    Row(
                      children: [
                        const Icon(
                          Icons.person_outline,
                          size: 17,
                          color: AppColors.onSurfaceVariant,
                        ),
                        const SizedBox(width: 6),
                        Flexible(
                          child: Text(
                            course.trainer.name,
                            style: const TextStyle(
                              color: AppColors.onSurfaceVariant,
                              fontSize: 14,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Pet type and duration
                    Row(
                      children: [
                        // Pet type
                        Expanded(
                          child: Row(
                            children: [
                              const Icon(
                                Icons.pets,
                                size: 17,
                                color: AppColors.primary,
                              ),
                              const SizedBox(width: 6),
                              Flexible(
                                child: Text(
                                  course.courseFor,
                                  style: const TextStyle(
                                    color: AppColors.primary,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Duration
                        Row(
                          children: [
                            const Icon(
                              Icons.access_time,
                              size: 17,
                              color: AppColors.onSurfaceVariant,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              '${course.duration} ${l10n.weeks}',
                              style: const TextStyle(
                                color: AppColors.onSurfaceVariant,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),

                    // Price and view details button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Price
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              l10n.price,
                              style: const TextStyle(
                                color: AppColors.onSurfaceVariant,
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '\$${course.price.toStringAsFixed(0)}',
                              style: const TextStyle(
                                color: AppColors.primary,
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                                height: 1.2,
                              ),
                            ),
                          ],
                        ),

                        // View Details button
                        ElevatedButton(
                          onPressed: () {
                            // context.go(
                            //   AppRoute.courseDetail.pathWith({'id': course.id}),
                            // );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: AppColors.onPrimary,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 22,
                              vertical: 13,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            elevation: 0,
                          ),
                          child: Text(
                            l10n.viewDetails,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              // letterSpacing: 0.2,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Get color for course level badge.
  Color _getLevelColor(final CourseLevel level) {
    switch (level) {
      case CourseLevel.beginner:
        return AppColors.success;
      case CourseLevel.intermediate:
        return AppColors.secondary;
      case CourseLevel.advanced:
        return AppColors.error;
    }
  }

  /// Get label for course level.
  String _getLevelLabel(final CourseLevel level, final AppLocalizations l10n) {
    switch (level) {
      case CourseLevel.beginner:
        return l10n.beginner;
      case CourseLevel.intermediate:
        return l10n.intermediate;
      case CourseLevel.advanced:
        return l10n.advanced;
    }
  }
}
