// ignore_for_file: public_member_api_docs

import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/features/pet_setter/providers/pet_sitter_profile_notifier.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_constants.dart';

class PetSitterPackageReqDetailsPage extends HookConsumerWidget {
  const PetSitterPackageReqDetailsPage({required this.packageId, super.key});

  final String packageId;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    // Watch the package details provider
    final detailsAsync = ref.watch(petSitterPackageDetailsProvider(packageId));

    return Scaffold(
      backgroundColor: petServicesBgLight,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: detailsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (final error, final stackTrace) => _PackageErrorState(
                message: 'Failed to load package details. Please try again.',
                onRetry: () => ref.refresh(
                  petSitterPackageDetailsProvider(packageId),
                ),
              ),
              data: (final details) => _PackageDetailsContent(
                details: details,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PackageDetailsContent extends StatelessWidget {
  const _PackageDetailsContent({required this.details});

  final PetSitterPackageDetails? details;

  @override
  Widget build(final BuildContext context) {
    final packageName = (details?.name ?? '').isNotEmpty
        ? details!.name
        : 'Package';
    final packageDescription = (details?.description ?? '').isNotEmpty
        ? details!.description
        : 'Package description';
    final packageImage = (details?.image ?? '').isNotEmpty
        ? details!.image
        : 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80&auto=format&fit=crop';
    final durationText = details?.durationInMinutes != null
        ? '${details!.durationInMinutes} mins'
        : '—';
    final offeredPrice = (details?.offeredPrice ?? '').isNotEmpty
        ? details!.offeredPrice
        : '0';
    final calculatedPrice = (details?.calculatedPrice ?? '').isNotEmpty
        ? details!.calculatedPrice
        : '0';

    final services = details?.services ?? const <PetSitterPackageService>[];
    final addons = details?.addons ?? const <PetSitterPackageAddon>[];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _PackageDetailsCard(
            child: Column(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  alignment: Alignment.center,
                  child: const Icon(
                    Icons.check_circle,
                    color: Color(0xFF22C55E),
                    size: 48,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Booking Confirmed!',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Your appointment has been successfully booked',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 13,
                    color: Color(0xFF6B7280),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _PackageDetailsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Package',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    ClipOval(
                      child: Image.network(
                        packageImage,
                        width: 64,
                        height: 64,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            packageName,
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 15,
                              color: Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            packageDescription,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _PackageDetailsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Package Details',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 18),
                _PackageDetailRow(
                  icon: Icons.schedule,
                  label: 'Duration',
                  value: durationText,
                ),
                const SizedBox(height: 16),
                _PackageDetailRow(
                  icon: Icons.payments,
                  label: 'Offered Price',
                  value: '\$$offeredPrice',
                ),
                const SizedBox(height: 16),
                _PackageDetailRow(
                  icon: Icons.attach_money,
                  label: 'Calculated Price',
                  value: '\$$calculatedPrice',
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _PackageDetailsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Package Contents',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 12),
                if (services.isNotEmpty) ...[
                  const Text(
                    'Services',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                  const SizedBox(height: 6),
                  ..._buildServiceLines(services),
                  const SizedBox(height: 12),
                ],
                if (addons.isNotEmpty) ...[
                  const Text(
                    'Addons',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                  const SizedBox(height: 6),
                  ..._buildAddonLines(addons),
                ],
                if (services.isEmpty && addons.isEmpty)
                  const Text(
                    'No package contents available.',
                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFF9CA3AF),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Order cancelled')),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: petServicesPrimary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                'Cancel Order',
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 16,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildServiceLines(
    final List<PetSitterPackageService> services,
  ) {
    final visible = services.take(3).toList();
    final widgets = <Widget>[];

    for (final service in visible) {
      widgets.add(
        _LineItem(
          title: service.name.isNotEmpty ? service.name : 'Service',
          trailing: '\$${service.price}',
        ),
      );
    }

    if (services.length > visible.length) {
      widgets.add(
        Text(
          '+${services.length - visible.length} more',
          style: const TextStyle(
            fontSize: 12,
            color: Color(0xFF9CA3AF),
            fontWeight: FontWeight.w600,
          ),
        ),
      );
    }

    return widgets;
  }

  List<Widget> _buildAddonLines(
    final List<PetSitterPackageAddon> addons,
  ) {
    final visible = addons.take(3).toList();
    final widgets = <Widget>[];

    for (final addon in visible) {
      widgets.add(
        _LineItem(
          title: addon.name.isNotEmpty ? addon.name : 'Addon',
          trailing: '\$${addon.price}',
        ),
      );
    }

    if (addons.length > visible.length) {
      widgets.add(
        Text(
          '+${addons.length - visible.length} more',
          style: const TextStyle(
            fontSize: 12,
            color: Color(0xFF9CA3AF),
            fontWeight: FontWeight.w600,
          ),
        ),
      );
    }

    return widgets;
  }
}

class _LineItem extends StatelessWidget {
  const _LineItem({required this.title, required this.trailing});

  final String title;
  final String trailing;

  @override
  Widget build(final BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF111827),
              ),
            ),
          ),
          Text(
            trailing,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }
}

class _PackageDetailsCard extends StatelessWidget {
  const _PackageDetailsCard({required this.child});

  final Widget child;

  @override
  Widget build(final BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF3F4F6)),
        boxShadow: const [
          BoxShadow(
            blurRadius: 10,
            offset: Offset(0, 2),
            color: Color(0x0D000000),
          ),
        ],
      ),
      child: child,
    );
  }
}

class _PackageDetailRow extends StatelessWidget {
  const _PackageDetailRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(final BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: const Color(0xFFFFE4E6),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 20, color: petServicesPrimary),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label.toUpperCase(),
                style: const TextStyle(
                  fontSize: 10,
                  letterSpacing: 1.1,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF9CA3AF),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _PackageErrorState extends StatelessWidget {
  const _PackageErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(final BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF6B7280),
                fontWeight: FontWeight.w600,
              ),
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: onRetry,
                style: ElevatedButton.styleFrom(
                  backgroundColor: petServicesPrimary,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Retry'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
