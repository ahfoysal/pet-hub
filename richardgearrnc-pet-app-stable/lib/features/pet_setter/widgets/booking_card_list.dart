// ignore_for_file: public_member_api_docs

import 'package:flutter/material.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';
import 'package:petzy_app/features/pet_setter/widgets/service_card.dart';

class PetServicesBookingCardList extends StatelessWidget {
  const PetServicesBookingCardList({
    required this.items,
    required this.onView,
    required this.onMessage,
    required this.onProviderTap,
    this.isPackage = false,
    super.key,
  });

  final List<dynamic> items;
  final Function(dynamic item) onView;
  final Function(dynamic item) onMessage;
  final Function(dynamic item) onProviderTap;
  final bool isPackage;

  @override
  Widget build(final BuildContext context) {
    return ListView.separated(
      itemCount: items.length,
      physics: const NeverScrollableScrollPhysics(),
      separatorBuilder: (_, final __) => const SizedBox(height: 14),
      itemBuilder: (final context, final i) {
        final it = items[i];
        return ServiceCard(
          item: it as ServiceItem,
          onBook: () {},
          onMessage: () => onMessage(it),
          onProviderTap: () => onProviderTap(it),
          onView: () => onView(it),
        );
      },
    );
  }
}
