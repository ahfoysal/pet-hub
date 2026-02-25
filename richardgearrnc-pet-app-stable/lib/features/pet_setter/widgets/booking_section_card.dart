// ignore_for_file: public_member_api_docs

import 'package:flutter/material.dart';

class PetServicesBookingSectionCard extends StatelessWidget {
  const PetServicesBookingSectionCard({required this.child, super.key});
  final Widget child;

  @override
  Widget build(final BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF3F4F6)),
        boxShadow: const [
          BoxShadow(
            blurRadius: 10,
            offset: Offset(0, 2),
            color: Color(0x0D000000),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: child,
    );
  }
}
