// ignore_for_file: public_member_api_docs

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/features/auth/presentation/providers/auth_notifier.dart';
import 'package:petzy_app/features/pet_setter/providers/pet_sitter_profile_notifier.dart';
import 'package:petzy_app/features/pet_setter/services/pet_sitter_services.dart';
import 'package:petzy_app/features/pet_setter/widgets/booking_constants.dart';

class PetSitterProfilePage extends HookConsumerWidget {
  const PetSitterProfilePage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    // Track screen view on mount
    useEffect(() {
      // Note: Add analytics tracking here if needed
      // ref.read(analyticsServiceProvider).logScreenView(screenName: 'pet_sitter_profile');
      return null;
    }, []);

    final profilesAsync = ref.watch(petSitterProfilesProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (final context, final constraints) {
            final maxHeight = constraints.hasBoundedHeight
                ? constraints.maxHeight
                : MediaQuery.of(context).size.height;
            final maxWidth = constraints.hasBoundedWidth
                ? constraints.maxWidth
                : MediaQuery.of(context).size.width;
            final contentWidth = maxWidth > 430 ? 430.0 : maxWidth;
            return Align(
              alignment: Alignment.topCenter,
              child: SizedBox(
                width: contentWidth,
                height: maxHeight,
                child: profilesAsync.when(
                  loading: () => Center(
                    child: CircularProgressIndicator(
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        petServicesPrimary,
                      ),
                      strokeWidth: 3,
                    ),
                  ),
                  error: (final error, final stackTrace) => _ErrorState(
                    message: 'Failed to load profile. Please try again.',
                    onRetry: () => ref.refresh(petSitterProfilesProvider),
                  ),
                  data: (final profiles) {
                    final profile = profiles.isNotEmpty ? profiles.first : null;

                    return CustomScrollView(
                      slivers: [
                        // Modern App Bar
                        SliverAppBar(
                          floating: true,
                          elevation: 0,
                          backgroundColor: Colors.transparent,
                          automaticallyImplyLeading: true,
                          title: const Text(
                            'My Profile',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1F2937),
                              letterSpacing: -0.5,
                            ),
                          ),
                        ),

                        SliverPadding(
                          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                          sliver: SliverList(
                            delegate: SliverChildListDelegate([
                              if (profile == null)
                                const _EmptyState()
                              else ...[
                                _ProfileHeader(profile: profile),
                                const SizedBox(height: 24),
                                _ModernSection(
                                  icon: Icons.info_outline,
                                  title: 'About',
                                  child: Text(
                                    _valueOrFallback(
                                      profile.bio,
                                      'No bio available.',
                                    ),
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: Color(0xFF4B5563),
                                      height: 1.6,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 20),
                                _ModernSection(
                                  icon: Icons.work_outline,
                                  title: 'Experience',
                                  child: Column(
                                    children: [
                                      _ModernInfoRow(
                                        icon: Icons.badge_outlined,
                                        label: 'Designation',
                                        value: _valueOrFallback(
                                          profile.designations,
                                          '-',
                                        ),
                                      ),
                                      const SizedBox(height: 14),
                                      _ModernInfoRow(
                                        icon: Icons.calendar_today_outlined,
                                        label: 'Years',
                                        value: profile.yearsOfExperience > 0
                                            ? '${profile.yearsOfExperience} years'
                                            : '-',
                                      ),
                                      const SizedBox(height: 14),
                                      _ModernInfoRow(
                                        icon: Icons.check_circle_outline,
                                        label: 'Status',
                                        value: _valueOrFallback(
                                          profile.status,
                                          '-',
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 20),
                                _ModernSection(
                                  icon: Icons.language_outlined,
                                  title: 'Languages',
                                  child: _LanguagesWrap(
                                    languages: profile.languages,
                                  ),
                                ),
                                const SizedBox(height: 20),
                                _LogoutButton(),
                              ],
                            ]),
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  const _ProfileHeader({required this.profile});

  final PetSitterDirectoryProfile profile;

  @override
  Widget build(final BuildContext context) {
    final name = _valueOrFallback(profile.user?.fullName, 'Unknown');
    final email = _valueOrFallback(profile.user?.email, 'No email');
    final imageUrl = profile.user?.image ?? '';

    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFFFFFFF),
            Color(0xFFFEF2F2),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: petServicesPrimary.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          _ProfileAvatar(imageUrl: imageUrl),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1F2937),
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(
                      Icons.email_outlined,
                      size: 14,
                      color: const Color(0xFF6B7280),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        email,
                        style: const TextStyle(
                          fontSize: 13,
                          color: Color(0xFF6B7280),
                          fontWeight: FontWeight.w500,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileAvatar extends StatelessWidget {
  const _ProfileAvatar({required this.imageUrl});

  final String imageUrl;

  @override
  Widget build(final BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            petServicesPrimary.withOpacity(0.1),
            petServicesPrimary.withOpacity(0.05),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: petServicesPrimary.withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(3),
      child: imageUrl.isEmpty
          ? Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    petServicesPrimary.withOpacity(0.15),
                    petServicesPrimary.withOpacity(0.25),
                  ],
                ),
              ),
              child: const Icon(
                Icons.person,
                color: petServicesPrimary,
                size: 32,
              ),
            )
          : ClipOval(
              child: Image.network(
                imageUrl,
                width: 64,
                height: 64,
                fit: BoxFit.cover,
                errorBuilder: (final _, final __, final ___) {
                  return Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          petServicesPrimary.withOpacity(0.15),
                          petServicesPrimary.withOpacity(0.25),
                        ],
                      ),
                    ),
                    child: const Icon(
                      Icons.person,
                      color: petServicesPrimary,
                      size: 32,
                    ),
                  );
                },
              ),
            ),
    );
  }
}

class _ModernSection extends StatelessWidget {
  const _ModernSection({
    required this.icon,
    required this.title,
    required this.child,
  });

  final IconData icon;
  final String title;
  final Widget child;

  @override
  Widget build(final BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: petServicesPrimary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                icon,
                size: 18,
                color: petServicesPrimary,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1F2937),
                letterSpacing: -0.3,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          padding: const EdgeInsets.all(16),
          child: child,
        ),
      ],
    );
  }
}

class _ModernInfoRow extends StatelessWidget {
  const _ModernInfoRow({
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
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            size: 16,
            color: Color(0xFF6B7280),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF9CA3AF),
                  fontWeight: FontWeight.w500,
                  letterSpacing: 0.3,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF1F2937),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _LanguagesWrap extends StatelessWidget {
  const _LanguagesWrap({required this.languages});

  final List<String> languages;

  @override
  Widget build(final BuildContext context) {
    if (languages.isEmpty) {
      return const Text(
        'No languages listed.',
        style: TextStyle(
          fontSize: 13,
          color: Color(0xFF9CA3AF),
          fontWeight: FontWeight.w500,
        ),
      );
    }

    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: languages
          .map(
            (final language) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    petServicesPrimary.withOpacity(0.1),
                    petServicesPrimary.withOpacity(0.15),
                  ],
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: petServicesPrimary.withOpacity(0.2),
                  width: 1,
                ),
              ),
              child: Text(
                language,
                style: const TextStyle(
                  fontSize: 12,
                  color: petServicesPrimary,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.2,
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(final BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(20),
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.person_outline,
              size: 48,
              color: Color(0xFF9CA3AF),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'No profile found',
            style: TextStyle(
              fontSize: 16,
              color: Color(0xFF6B7280),
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Create your profile to get started',
            style: TextStyle(
              fontSize: 13,
              color: Color(0xFF9CA3AF),
              fontWeight: FontWeight.w400,
            ),
          ),
        ],
      ),
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
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 20,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEE2E2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.error_outline,
                  color: petServicesPrimary,
                  size: 40,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF6B7280),
                  fontWeight: FontWeight.w500,
                  height: 1.5,
                ),
              ),
              if (onRetry != null) ...[
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: onRetry,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: petServicesPrimary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Try Again',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

String _valueOrFallback(final String? value, final String fallback) {
  if (value == null) return fallback;
  if (value.trim().isEmpty) return fallback;
  return value;
}

class _LogoutButton extends HookConsumerWidget {
  const _LogoutButton();

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () async {
          // Show confirmation dialog
          final confirmed = await showDialog<bool>(
            context: context,
            builder: (final dialogContext) => AlertDialog(
              title: const Text('Logout'),
              content: const Text('Are you sure you want to logout?'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(dialogContext, false),
                  child: const Text('Cancel'),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(dialogContext, true),
                  child: const Text('Logout'),
                ),
              ],
            ),
          );

          if (confirmed ?? false) {
            await ref.read(authProvider.notifier).logout();
            if (context.mounted) {
              context.goRoute(AppRoute.login);
            }
          }
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.red.shade50,
          foregroundColor: Color(0xFFDC2626),
          elevation: 0,
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: Color(0xFFDC2626).withOpacity(0.2)),
          ),
        ),
        child: const Text(
          'Logout',
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
        ),
      ),
    );
  }
}
