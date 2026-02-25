import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/auth/data/repositories/auth_repository_provider.dart';
import 'package:petzy_app/features/auth/presentation/providers/auth_notifier.dart';
import 'package:petzy_app/features/auth/presentation/providers/signup_intent_provider.dart';

/// Signup page for new users to complete their profile information.
///
/// This page is shown when a user successfully authenticates with
/// Google or Phone but doesn't exist in the system yet.
class SignupPage extends HookConsumerWidget {
  /// Creates a [SignupPage] instance.
  const SignupPage({
    super.key,
    this.email,
    this.phoneNumber,
  });

  /// Pre-filled email from Google Sign-In (optional).
  final String? email;

  /// Pre-filled phone number from Phone Auth (optional).
  final String? phoneNumber;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    useOnMount(() {
      ref.read(analyticsServiceProvider).logScreenView(screenName: 'signup');
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Complete Your Profile'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Welcome!',
                style: context.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Please complete your profile to continue',
                style: context.textTheme.bodyMedium?.copyWith(
                  color: context.colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.xxl),
              _SignupForm(
                email: email,
                phoneNumber: phoneNumber,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Form widget for signup page.
class _SignupForm extends HookConsumerWidget {
  const _SignupForm({
    this.email,
    this.phoneNumber,
  });

  final String? email;
  final String? phoneNumber;

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final nameController = useTextEditingController();
    final emailController = useTextEditingController(text: email);
    final phoneController = useTextEditingController(text: phoneNumber);
    final userNameController = useTextEditingController();
    final streetAddressController = useTextEditingController();
    final cityController = useTextEditingController();
    final countryController = useTextEditingController();
    final postalCodeController = useTextEditingController();
    final isLoading = useState(false);

    Future<void> handleSubmit() async {
      // Validate required fields
      if (nameController.text.trim().isEmpty) {
        context.showErrorSnackBar('Please enter your name');
        return;
      }

      if (emailController.text.trim().isEmpty) {
        context.showErrorSnackBar('Please enter your email');
        return;
      }

      if (phoneController.text.trim().isEmpty) {
        context.showErrorSnackBar('Please enter your phone number');
        return;
      }

      if (userNameController.text.trim().isEmpty) {
        context.showErrorSnackBar('Please enter a username');
        return;
      }

      if (streetAddressController.text.trim().isEmpty) {
        context.showErrorSnackBar('Please enter your street address');
        return;
      }

      if (cityController.text.trim().isEmpty) {
        context.showErrorSnackBar('Please enter your city');
        return;
      }

      if (countryController.text.trim().isEmpty) {
        context.showErrorSnackBar('Please enter your country');
        return;
      }

      if (postalCodeController.text.trim().isEmpty) {
        context.showErrorSnackBar('Please enter your postal code');
        return;
      }

      isLoading.value = true;

      try {
        debugPrint('📝 Starting signup process...');
        debugPrint('   Email: ${emailController.text.trim()}');
        debugPrint('   Name: ${nameController.text.trim()}');
        debugPrint('   Phone: ${phoneController.text.trim()}');

        // Call signup API
        final authRepository = ref.read(authRepositoryProvider);
        final result = await authRepository.signup(
          email: emailController.text.trim(),
          fullName: nameController.text.trim(),
          phone: phoneController.text.trim(),
          userName: userNameController.text.trim(),
          streetAddress: streetAddressController.text.trim(),
          city: cityController.text.trim(),
          country: countryController.text.trim(),
          postalCode: postalCodeController.text.trim(),
        );

        if (!context.mounted) return;

        result.fold(
          onSuccess: (final user) {
            debugPrint('✅ Signup successful!');
            debugPrint('   User role: ${user.role}');
            debugPrint('   Navigating to: ${user.role.defaultRoute}');

            // Clear the signup intent
            ref.read(signupIntentProvider.notifier).clear();

            // Invalidate auth state to refresh with new user
            ref.invalidate(authProvider);

            // Navigate to role-specific home
            context.goRoute(user.role.defaultRoute);
          },
          onFailure: (final error) {
            debugPrint('❌ Signup failed: $error');
            context.showErrorSnackBar(error.toString());
          },
        );
      } catch (e) {
        debugPrint('❌ Signup exception: $e');
        if (!context.mounted) return;
        context.showErrorSnackBar('Signup failed: $e');
      } finally {
        isLoading.value = false;
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Name field
        TextField(
          controller: nameController,
          decoration: const InputDecoration(
            labelText: 'Full Name',
            hintText: 'Enter your full name',
            prefixIcon: Icon(Icons.person_outline),
            border: OutlineInputBorder(),
          ),
          textInputAction: TextInputAction.next,
          textCapitalization: TextCapitalization.words,
        ),
        const SizedBox(height: AppSpacing.md),

        // Email field
        TextField(
          controller: emailController,
          decoration: const InputDecoration(
            labelText: 'Email',
            hintText: 'Enter your email',
            prefixIcon: Icon(Icons.email_outlined),
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          enabled: email == null, // Disable if pre-filled from Google
        ),
        const SizedBox(height: AppSpacing.md),

        // Phone field
        TextField(
          controller: phoneController,
          decoration: const InputDecoration(
            labelText: 'Phone Number',
            hintText: 'Enter your phone number',
            prefixIcon: Icon(Icons.phone_outlined),
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.phone,
          textInputAction: TextInputAction.next,
          enabled: phoneNumber == null, // Disable if pre-filled from Phone Auth
        ),
        const SizedBox(height: AppSpacing.md),

        // Username field
        TextField(
          controller: userNameController,
          decoration: const InputDecoration(
            labelText: 'Username',
            hintText: 'Choose a username',
            prefixIcon: Icon(Icons.alternate_email),
            border: OutlineInputBorder(),
          ),
          textInputAction: TextInputAction.next,
        ),
        const SizedBox(height: AppSpacing.md),

        // Street Address field
        TextField(
          controller: streetAddressController,
          decoration: const InputDecoration(
            labelText: 'Street Address',
            hintText: 'Enter your street address',
            prefixIcon: Icon(Icons.home_outlined),
            border: OutlineInputBorder(),
          ),
          textInputAction: TextInputAction.next,
        ),
        const SizedBox(height: AppSpacing.md),

        // City field
        TextField(
          controller: cityController,
          decoration: const InputDecoration(
            labelText: 'City',
            hintText: 'Enter your city',
            prefixIcon: Icon(Icons.location_city_outlined),
            border: OutlineInputBorder(),
          ),
          textInputAction: TextInputAction.next,
          textCapitalization: TextCapitalization.words,
        ),
        const SizedBox(height: AppSpacing.md),

        // Country field
        TextField(
          controller: countryController,
          decoration: const InputDecoration(
            labelText: 'Country',
            hintText: 'Enter your country',
            prefixIcon: Icon(Icons.public),
            border: OutlineInputBorder(),
          ),
          textInputAction: TextInputAction.next,
          textCapitalization: TextCapitalization.words,
        ),
        const SizedBox(height: AppSpacing.md),

        // Postal Code field
        TextField(
          controller: postalCodeController,
          decoration: const InputDecoration(
            labelText: 'Postal Code',
            hintText: 'Enter your postal code',
            prefixIcon: Icon(Icons.markunread_mailbox_outlined),
            border: OutlineInputBorder(),
          ),
          textInputAction: TextInputAction.done,
        ),
        const SizedBox(height: AppSpacing.xl),

        // Submit button
        ElevatedButton(
          onPressed: isLoading.value ? null : handleSubmit,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
          ),
          child: isLoading.value
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Complete Signup'),
        ),
      ],
    );
  }
}
