import 'package:flutter/material.dart';
import 'package:petzy_app/core/constants/app_constants.dart';
import 'package:petzy_app/core/widgets/entry_animations.dart';

/// A widget that animates a list of items with staggered timing.
class StaggeredList extends StatelessWidget {
  /// Creates a [StaggeredList].
  const StaggeredList({
    required this.children,
    super.key,
    this.itemDuration = AppConstants.animationFast,
    this.staggerDelay = AppConstants.staggerDelay,
    this.curve = Curves.easeOut,
    this.direction = SlideDirection.fromBottom,
  });

  /// Children to animate.
  final List<Widget> children;

  /// Duration for each item's animation.
  final Duration itemDuration;

  /// Delay between each item's animation.
  final Duration staggerDelay;

  /// Animation curve.
  final Curve curve;

  /// Slide direction.
  final SlideDirection direction;

  @override
  Widget build(final BuildContext context) {
    return Column(
      children: children.asMap().entries.map((final entry) {
        return FadeIn(
          duration: itemDuration,
          delay: staggerDelay * entry.key,
          curve: curve,
          child: SlideIn(
            duration: itemDuration,
            delay: staggerDelay * entry.key,
            curve: curve,
            direction: direction,
            offset: AppConstants.slideOffsetDefault,
            child: entry.value,
          ),
        );
      }).toList(),
    );
  }
}
