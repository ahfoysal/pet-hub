import 'package:flutter/material.dart';

class RatingSummaryWidget extends StatelessWidget {
  const RatingSummaryWidget({super.key});

  @override
  Widget build(final BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left Side: Overall Score
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '4.5',
                  style: TextStyle(
                    fontSize: 56,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                Row(
                  children: List.generate(5, (final index) {
                    return const Icon(
                      Icons.star_rounded,
                      color: Color(0xFFFFC107),
                      size: 24,
                    );
                  }),
                ),
                const SizedBox(height: 8),
                const Text(
                  '234 reviews',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),

          // Right Side: Bar Chart
          Expanded(
            flex: 3,
            child: Column(
              children: [
                _buildRatingBar('5', 0.7, '180'),
                _buildRatingBar('4', 0.2, '40'),
                _buildRatingBar('3', 0.05, '10'),
                _buildRatingBar('2', 0.04, '8'),
                _buildRatingBar('1', 0.06, '12'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingBar(
    final String star,
    final double percent,
    final String count,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          SizedBox(
            width: 25,
            child: Text(
              '$star★',
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Color(0xFF4B5563),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: percent,
                minHeight: 8,
                backgroundColor: const Color(0xFFE5E7EB),
                valueColor: const AlwaysStoppedAnimation<Color>(
                  Color(0xFFFFC107),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(
            width: 30,
            child: Text(
              count,
              textAlign: TextAlign.end,
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
