/// Request model for pet owner signup.
///
/// Sent to POST /auth/pet-owner-signup endpoint.
class SignupRequest {
  /// Creates a [SignupRequest] instance.
  const SignupRequest({
    required this.email,
    required this.fullName,
    required this.phone,
    required this.userName,
    required this.streetAddress,
    required this.city,
    required this.country,
    required this.postalCode,
    this.isEmailLogin = true,
  });

  /// User's email address.
  final String email;

  /// User's full name.
  final String fullName;

  /// User's phone number.
  final String phone;

  /// User's username.
  final String userName;

  /// Street address.
  final String streetAddress;

  /// City.
  final String city;

  /// Country.
  final String country;

  /// Postal code.
  final String postalCode;

  /// Whether this is an email login.
  final bool isEmailLogin;

  /// Creates a [SignupRequest] from JSON.
  factory SignupRequest.fromJson(final Map<String, dynamic> json) {
    return SignupRequest(
      email: json['email'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      userName: json['userName'] as String? ?? '',
      streetAddress: json['streetAddress'] as String? ?? '',
      city: json['city'] as String? ?? '',
      country: json['country'] as String? ?? '',
      postalCode: json['postalCode'] as String? ?? '',
      isEmailLogin: json['isEmailLogin'] as bool? ?? true,
    );
  }

  /// Converts to JSON.
  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'fullName': fullName,
      'phone': phone,
      'userName': userName,
      'streetAddress': streetAddress,
      'city': city,
      'country': country,
      'postalCode': postalCode,
      'isEmailLogin': isEmailLogin,
    };
  }
}
