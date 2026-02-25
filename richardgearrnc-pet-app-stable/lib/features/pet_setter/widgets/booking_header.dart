// ignore_for_file: public_member_api_docs

import 'package:flutter/material.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_constants.dart';

class PetServicesBookingHeader extends StatelessWidget {
  const PetServicesBookingHeader({
    required this.title,
    required this.subtitle,
    required this.imageUrl,
    required this.onBack,
    super.key,
  });

  final String title;
  final String subtitle;
  final String imageUrl;
  final VoidCallback onBack;

  @override
  Widget build(final BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: petServicesHeaderBg,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 18,
        left: 20,
        right: 20,
        bottom: 18,
      ),
      child: Row(
        children: [
          // IconButton(
          //   onPressed: onBack,
          //   icon: const Icon(Icons.arrow_back, color: Color(0xFF111827)),
          // ),
          const SizedBox(width: 6),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF6B7280),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            width: 64,
            height: 64,
            child: Image.network(imageUrl, fit: BoxFit.contain),
          ),
        ],
      ),
    );
  }
}
