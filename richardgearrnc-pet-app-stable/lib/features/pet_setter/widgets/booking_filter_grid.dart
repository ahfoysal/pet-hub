// ignore_for_file: public_member_api_docs

import 'package:flutter/material.dart';

class PetServicesBookingFilterGrid extends StatelessWidget {
  const PetServicesBookingFilterGrid({super.key});

  @override
  Widget build(final BuildContext context) {
    return const Column(
      children: [
        Row(
          children: [
            Expanded(child: _FilterTile('Availability')),
            SizedBox(width: 12),
            Expanded(child: _FilterTile('Max Price')),
          ],
        ),
        SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _FilterTile('Rating')),
            SizedBox(width: 12),
            Expanded(child: _FilterTile('Location')),
          ],
        ),
      ],
    );
  }
}

class _FilterTile extends StatelessWidget {
  const _FilterTile(this.text);
  final String text;

  @override
  Widget build(final BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: Color(0xFF6B7280),
        ),
      ),
    );
  }
}
