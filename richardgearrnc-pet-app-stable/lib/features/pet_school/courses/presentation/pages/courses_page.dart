import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_school/courses/domain/entities/course.dart';
import 'package:petzy_app/features/pet_school/courses/presentation/providers/courses_provider.dart';
import 'package:petzy_app/features/pet_school/courses/presentation/widgets/course_card.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Pet school courses page displaying list of courses.
///
/// Shows:
/// - List of courses with search and filter
/// - Course cards with thumbnail, details, price
/// - Loading and error states
class CoursesPage extends ConsumerWidget {
  /// Creates a [CoursesPage] widget.
  const CoursesPage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: Text(
          l10n.courses,
          style: TextStyle(
            color: AppColors.onBackground,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      body: AsyncValueWidget<List<Course>>(
        value: ref.watch(coursesProvider),
        data: (final courses) {
          if (courses.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.school_outlined,
                    size: 64,
                    color: AppColors.onSurfaceVariant.withValues(alpha: 0.5),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    l10n.noCourses,
                    style: TextStyle(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(coursesProvider);
            },
            color: AppColors.primary,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: courses.length,
              itemBuilder: (final context, final index) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: CourseCard(course: courses[index]),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
