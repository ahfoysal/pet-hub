import 'package:flutter/material.dart';

class CategoryChips extends StatelessWidget {
  const CategoryChips({super.key});

  @override
  Widget build(final BuildContext context) {
    final categories = [
      {'label': 'All', 'icon': Icons.shopping_cart, 'color': Colors.red},
      {'label': 'Food', 'icon': Icons.fastfood, 'color': null},
      {'label': 'Toys', 'icon': Icons.sports_esports, 'color': null},
      {'label': 'Accessories', 'icon': Icons.card_giftcard, 'color': null},
    ];

    return SizedBox(
      height: 48, // adjust as needed
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: categories.length,
        itemBuilder: (final context, final index) {
          final item = categories[index];
          final isAll = item['label'] == 'All';
          final hasColor = item['color'] != null;

          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Material(
              color: isAll ? Colors.red : Colors.white,
              borderRadius: BorderRadius.circular(30),
              elevation: isAll ? 2 : 1,
              shadowColor: Colors.black.withOpacity(0.1),
              child: InkWell(
                borderRadius: BorderRadius.circular(30),
                onTap: () {
                  // handle category tap
                  debugPrint('${item['label']} tapped');
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(30),
                    border: !isAll
                        ? Border.all(color: Colors.grey.shade300, width: 1)
                        : null,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        item['icon'] as IconData,
                        size: 20,
                        color: isAll ? Colors.white : Colors.black87,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        item['label'] as String,
                        style: TextStyle(
                          color: isAll ? Colors.white : Colors.black87,
                          fontWeight: isAll ? FontWeight.w600 : FontWeight.w500,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
