import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ServiceProviderCard extends StatelessWidget {
  final String imageUrl;
  final String serviceName;
  final double rating;
  final int reviewCount;
  final double distance;
  final String price;
  final String providerName;
  final String providerLogoUrl;
  final VoidCallback? onBookNow;
  final VoidCallback? onMessage;

  const ServiceProviderCard({
    super.key,
    required this.imageUrl,
    required this.serviceName,
    required this.rating,
    required this.reviewCount,
    required this.distance,
    required this.price,
    required this.providerName,
    required this.providerLogoUrl,
    this.onBookNow,
    this.onMessage,
  });

  @override
  Widget build(final BuildContext context) {
    return Container(
      // Maximize width to parent
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Service Image
              CircleAvatar(
                radius: 40,
                backgroundImage: NetworkImage(imageUrl),
              ),
              const SizedBox(width: 16),

              // Service Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      serviceName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF2D3142),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 18),
                        const SizedBox(width: 4),
                        Text(
                          rating.toString(),
                          style: const TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 12,
                          ),
                        ),
                        Text(
                          ' ($reviewCount reviews)',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.location_on_outlined,
                          color: Colors.grey[400],
                          size: 12,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '$distance miles away',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Price
              Text(
                '\$$price',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFFE97676),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Provider Row
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: Colors.grey[100],
                backgroundImage: NetworkImage(providerLogoUrl),
              ),
              const SizedBox(width: 8),
              Text(
                'By $providerName',
                style: const TextStyle(
                  color: Color(0xFFE97676),
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const Icon(
                Icons.chevron_right,
                color: Color(0xFFE97676),
                size: 20,
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Action Buttons
          Row(
            children: [
              GestureDetector(
                onTap: onBookNow,
                child: Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFE97676), // Salmon/Red color
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.calendar_today_outlined,
                          size: 18,
                          color: Colors.white,
                        ),
                        SizedBox(
                          width: 10,
                        ),
                        const Text(
                          'Book Now',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ).paddingAll(10),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: const Color(0xFFE97676),
                    ), // Salmon/Red color
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 10,
                      ),
                      const Text(
                        'Message',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFFE97676),
                        ),
                      ),
                    ],
                  ).paddingAll(10),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
