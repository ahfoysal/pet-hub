// ignore_for_file: public_member_api_docs

import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/features/pet_setter/providers/pet_sitter_profile_notifier.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_constants.dart';

class PetSitterBookingReqDetailsPage extends HookConsumerWidget {
  const PetSitterBookingReqDetailsPage({required this.serviceId, super.key});

  final String serviceId;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    // Watch the service details provider
    final detailsAsync = ref.watch(petSitterServiceDetailsProvider(serviceId));

    return Scaffold(
      backgroundColor: petServicesBgLight,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: detailsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (final error, final stackTrace) => _ErrorState(
                message: 'Failed to load service details. Please try again.',
                onRetry: () => ref.refresh(
                  petSitterServiceDetailsProvider(serviceId),
                ),
              ),
              data: (final details) => _DetailsContent(
                details: details,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _DetailsContent extends StatelessWidget {
  const _DetailsContent({required this.details});

  final PetSitterServiceDetails? details;

  @override
  Widget build(final BuildContext context) {
    final caregiverName =
        (details?.petSitterProfile?.user?.fullName ?? '').isNotEmpty
        ? details!.petSitterProfile!.user!.fullName
        : 'Sarah Johnson';
    final caregiverImage =
        (details?.petSitterProfile?.user?.image ?? '').isNotEmpty
        ? details!.petSitterProfile!.user!.image
        : ((details?.thumbnailImage ?? '').isNotEmpty
              ? details!.thumbnailImage
              : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwUkh0_6LdYDcYWjD5aTCBBMK50nObNfgRcTZ_I6oJbhkgMxMe8FFCZvMnbiCqy6KJtwBf_2rbCTIWrKDpajN3qUW1TJ8VO3MPgopFeZkGyCXoFlwv57my9N1YUYKUe5P4oUp29uYZlajMmwWTZCzMn58CHZfx3z7aQK81FaZcS_H3r4VTyZOlcRFUPqp3ioNPF-nSnaXrwFLhMnrZUsU4hdrD6h1rh2_fEXa-VtXTJJndua9RIvkW17HScRpppJ23l5CHUEM_-AI');
    final tags = details?.tags ?? const <String>[];
    final caregiverSubtitle = tags.isNotEmpty
        ? tags.first
        : ((details?.name ?? '').isNotEmpty ? details!.name : 'Pet Sitter');
    final displayRating = 4.9;
    final displayDistance = 2.3;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _DetailsCard(
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
          _DetailsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Care Giver',
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
                        caregiverImage,
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
                            caregiverName,
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 15,
                              color: Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            caregiverSubtitle,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              const Icon(
                                Icons.star,
                                size: 16,
                                color: Color(0xFFFBBF24),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                displayRating.toStringAsFixed(1),
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF374151),
                                ),
                              ),
                              const SizedBox(width: 14),
                              const Icon(
                                Icons.location_on,
                                size: 16,
                                color: Color(0xFF9CA3AF),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '${displayDistance.toStringAsFixed(1)} km',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF6B7280),
                                ),
                              ),
                            ],
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
          _DetailsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Appointment Details',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
                SizedBox(height: 18),
                _DetailRow(
                  icon: Icons.calendar_today,
                  label: 'Date',
                  value: 'November 16, 2025',
                ),
                SizedBox(height: 16),
                _DetailRow(
                  icon: Icons.schedule,
                  label: 'Time',
                  value: '8:00 AM',
                ),
                SizedBox(height: 16),
                _DetailRow(
                  icon: Icons.location_on,
                  label: 'Location',
                  value: '123 Main Street, New York, NY 10001',
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _DetailsCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Pet Information',
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
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuB0GMf_s3ot4EGHefLuXtt4c-PnXBze6evBf-Qk3UhK6rG2Cuabv6OSHQldG6DJNqSliaF1gL8cGdzDJriXk-bDOOEn94CDIYcUzvtn7RbB00_FsmtgzqHYhfRqTHGRDEpRMVSK_TLR93-eEZHLzfkHN17wSdw6_FJaSG-rpR9uSd5M0HfcHJjhQZz4Pqcyn5gFYoNvoMcvKZxeAypRrnTTwgoHuPxcGqiAGY9AbJYQkBEjj0yX0eRR5YtWrcCN13zvNDk_NxuuTf0',
                        width: 64,
                        height: 64,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Luna',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF111827),
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Persian Cat',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          '3 years',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF9CA3AF),
                          ),
                        ),
                      ],
                    ),
                  ],
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
}

class _DetailsCard extends StatelessWidget {
  const _DetailsCard({required this.child});

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

class _DetailRow extends StatelessWidget {
  const _DetailRow({
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

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

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
