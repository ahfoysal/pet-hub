// // ignore_for_file: public_member_api_docs

// import 'package:flutter/material.dart';

// class PetServicesBookingSearchBar extends StatelessWidget {
//   const PetServicesBookingSearchBar({required this.controller, super.key});

//   final TextEditingController controller;

//   @override
//   Widget build(final BuildContext context) {
//     return Container(
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(20),
//         boxShadow: const [
//           BoxShadow(
//             blurRadius: 10,
//             offset: Offset(0, 2),
//             color: Color(0x0D000000),
//           ),
//         ],
//       ),
//       padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
//       child: Row(
//         children: [
//           const Icon(Icons.search, color: Color(0xFF9CA3AF)),
//           const SizedBox(width: 10),
//           Expanded(
//             child: TextField(
//               controller: controller,
//               decoration: const InputDecoration(
//                 fillColor: Colors.white,
//                 hintText: 'Search for providers, services, etc...',
//                 border: InputBorder.none,
//                 isDense: true,
//               ),
//               style: const TextStyle(fontSize: 13),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
