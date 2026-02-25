import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/pet_sitter/views/widgets/rating_summery_widget.dart';

class ServiceDetails extends StatelessWidget {
  const ServiceDetails({super.key, this.serviceId});

  final String? serviceId;

  @override
  Widget build(final BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary.withOpacity(0.2),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: 14,
            ),
            // image
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: Image.network(
                    height: 360,
                    width: double.maxFinite,
                    fit: BoxFit.cover,
                    'https://img.freepik.com/free-photo/shot-adorable-white-golden-retriever-puppy-sitting-snow_181624-44122.jpg?semt=ais_hybrid&w=740&q=80',
                  ),
                ),

                Positioned(
                  right: 20,
                  top: 20,
                  child: Container(
                    height: 20,
                    width: 20,
                    padding: EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.favorite_outline,
                      size: 13,
                    ),
                  ),
                ),
              ],
            ),

            SizedBox(
              height: 24,
            ),

            Text(
              'Full Grooming',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w400),
            ),

            SizedBox(
              height: 8,
            ),

            Container(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 9),
              decoration: BoxDecoration(
                color: Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(50),
              ),
              child: Text(
                'Grooming',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFFFF7176),
                ),
              ),
            ),

            SizedBox(
              height: 23,
            ),

            Row(
              children: [
                Icon(
                  Icons.star,
                  size: 19,
                  color: Colors.orange,
                ),
                SizedBox(
                  width: 5,
                ),
                Text(
                  '4.8',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF101828),
                  ),
                ),

                SizedBox(
                  width: 5,
                ),

                Text(
                  '(234 reviews)',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF6A7282),
                  ),
                ),
              ],
            ),
            SizedBox(
              height: 23,
            ),
            Container(
              padding: EdgeInsets.all(13),
              height: 87,
              width: double.maxFinite,
              decoration: BoxDecoration(
                color: Color(0xFFFAF5FF),
                borderRadius: BorderRadius.circular(16),
              ),

              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.timelapse_rounded,
                        size: 20,
                      ),

                      SizedBox(
                        width: 5,
                      ),
                      Text(
                        'Duration: 2 hours',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Price',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      SizedBox(
                        width: 5,
                      ),
                      Text(
                        '1200',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFFFF7176),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            SizedBox(
              height: 23,
            ),

            Text(
              'Description',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w400),
            ),
            SizedBox(
              height: 13,
            ),
            Text(
              'Complete grooming service including bath, haircut, nail trim, and ear cleaning',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: Color(0xFF4A5565),
              ),
            ),

            SizedBox(
              height: 23,
            ),

            Text(
              "What's Included",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w400),
            ),
            SizedBox(
              height: 12,
            ),
            _buildIncludedItem('Professional care specialist'),
            _buildIncludedItem('Professional care specialist'),
            _buildIncludedItem('Professional care specialist'),
            _buildIncludedItem('Professional care specialist'),

            SizedBox(
              height: 23,
            ),
            Text(
              "What's Included",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w400),
            ),
            RatingSummaryWidget(),
          ],
        ).paddingSymmetric(horizontal: 16),
      ),
    );
  }

  Widget _buildIncludedItem(final String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          const Icon(Icons.check, color: Colors.green, size: 24),
          const SizedBox(width: 12),
          Text(
            text,
            style: const TextStyle(fontSize: 16, color: Colors.black87),
          ),
        ],
      ),
    );
  }
}
