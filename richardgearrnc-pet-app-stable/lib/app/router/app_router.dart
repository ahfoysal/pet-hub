import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:petzy_app/features/pet_market/views/screens/pet_market_screen.dart';
import 'package:petzy_app/features/pet_school/views/screens/pet_school_screen.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:petzy_app/app/app_config.dart';
import 'package:petzy_app/app/presentation/main_wrapper.dart';
import 'package:petzy_app/app/router/auth_routes.dart';
import 'package:petzy_app/app/presentation/pages/error_page.dart';
import 'package:petzy_app/app/router/splash_route.dart';
import 'package:petzy_app/app/startup/app_lifecycle_notifier.dart';
import 'package:petzy_app/app/startup/app_lifecycle_state.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/features/auth/presentation/providers/signup_intent_provider.dart';
import 'package:petzy_app/features/bookings/presentation/pages/bookings_wrapper_page.dart';
import 'package:petzy_app/features/home/presentation/pages/home_page.dart';
import 'package:petzy_app/features/messages/presentation/pages/messages_page.dart';
import 'package:petzy_app/features/onboarding/presentation/pages/onboarding_page.dart';
import 'package:petzy_app/features/profile/presentation/pages/profile_wrapper_page.dart';
import 'package:petzy_app/features/settings/presentation/pages/settings_page.dart';
import 'package:petzy_app/app/presentation/pages/placeholder_page.dart';

import '../../features/pet_sitter/views/screens/pet_sitter_screen.dart';
import '../../features/pet_sitter/views/screens/service_details.dart';
import '../../features/home/presentation/pages/menu_page.dart';

part 'app_router.g.dart';

// ============================================================================
// Route Definitions (Enum-based for compile-time safety)
// ============================================================================

enum AppRoute {
  splash('/splash', requiresAuth: false),
  login('/login', requiresAuth: false),
  signup('/signup', requiresAuth: false),
  otpVerification('/otp-verification/:phoneNumber', requiresAuth: false),
  home('/', requiresAuth: false),

  /// Booking details screen.
  bookingDetails('/booking-details', requiresAuth: false),

  /// Package details screen.
  packageDetails('/package-details', requiresAuth: false),

  /// Onboarding screen shown to new users.
  shorts('/shorts', requiresAuth: false),
  menu('/menu', requiresAuth: false),
  messages('/messages', requiresAuth: true),
  bookings('/bookings', requiresAuth: true),
  profile('/profile', requiresAuth: true),
  onboarding('/onboarding', requiresAuth: false),
  settings('/settings', requiresAuth: true),
  maintenance('/maintenance', requiresAuth: false),
  forceUpdate('/force-update', requiresAuth: false),

  // Legacy role-specific routes (kept for compatibility/deep-links)
  bookingsOwner('/bookings/owner', requiresAuth: true),
  bookingsSitter('/bookings/sitter', requiresAuth: true),
  bookingsSchool('/bookings/school', requiresAuth: true),
  bookingsHotel('/bookings/hotel', requiresAuth: true),
  profileOwner('/profile/owner', requiresAuth: true),
  profileSitter('/profile/sitter', requiresAuth: true),
  profileSchool('/profile/school', requiresAuth: true),
  profileHotel('/profile/hotel', requiresAuth: true),
  petSitter('/pet-sitter', requiresAuth: true),
  petMarket('/pet-market', requiresAuth: true),
  petSchool('/pet-school', requiresAuth: true),
  ;

  const AppRoute(this.path, {required this.requiresAuth});

  final String path;
  final bool requiresAuth;

  String pathWith(final Map<String, String> params) {
    var result = path;
    final paramPattern = RegExp(r':(\w+)');
    final matches = paramPattern.allMatches(path);

    for (final match in matches) {
      final paramName = match.group(1)!;
      final value = params[paramName];
      if (value == null) {
        throw ArgumentError(
          'Missing required path parameter "$paramName" for route $name',
        );
      }
      result = result.replaceFirst(':$paramName', value);
    }
    return result;
  }

  static AppRoute? matchPath(final String resolvedPath) {
    for (final route in values) {
      if (_matchesPattern(route.path, resolvedPath)) {
        return route;
      }
    }
    return null;
  }

  static bool _matchesPattern(final String pattern, final String path) {
    final regexPattern = pattern.replaceAllMapped(
      RegExp(r':(\w+)'),
      (final _) => r'([^/]+)',
    );
    return RegExp('^$regexPattern\$').hasMatch(path);
  }

  /// All routes that require authentication.
  static List<AppRoute> get protectedRoutes =>
      values.where((final r) => r.requiresAuth).toList();

  /// All public routes (no auth required).
  static List<AppRoute> get publicRoutes =>
      values.where((final r) => !r.requiresAuth).toList();
}

extension AppRouteNavigation on BuildContext {
  void goRoute(final AppRoute route) => go(route.path);
  void pushRoute(final AppRoute route) => push(route.path);

  /// Navigate to a route with parameters using [GoRouter.push].
  void pushRouteWith(final AppRoute route, final Map<String, String> params) =>
      push(route.pathWith(params));

  /// Replace current route using [GoRouter.pushReplacement].
  void pushReplacementRoute(final AppRoute route) =>
      pushReplacement(route.path);

  /// Replace current route with parameters using [GoRouter.pushReplacement].
  void pushReplacementRouteWith(
    final AppRoute route,
    final Map<String, String> params,
  ) => pushReplacement(route.pathWith(params));
  void goRouteWith(
    final AppRoute route,
    final Map<String, String> params, {
    final Object? extra,
  }) => go(route.pathWith(params), extra: extra);
}

final rootNavigatorKey = GlobalKey<NavigatorState>();

@Riverpod(keepAlive: true)
GoRouter appRouter(final Ref ref) {
  final lifecycleListenable = ref.watch(appLifecycleListenableProvider);
  ref.watch(sessionStateProvider);
  final analyticsObserver = ref.watch(analyticsObserverProvider);

  return GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: AppRoute.splash.path,
    debugLogDiagnostics: true,
    refreshListenable: lifecycleListenable,
    // routes: [splashRoute, ...authRoutes, ...protectedRoutes],
    routes: [
      splashRoute,
      ...authRoutes,

      // Stateful Shell Route for Bottom Navigation
      StatefulShellRoute.indexedStack(
        builder: (final context, final state, final navigationShell) {
          return MainWrapper(navigationShell: navigationShell);
        },
        branches: [
          // Branch 0: Home (Index 0 in Navbar)
          // Inside your StatefulShellRoute → branches → Home branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoute.home.path, // '/'
                name: AppRoute.home.name,
                builder: (final context, final state) => const HomePage(),
                routes: [
                  // ← Pet Sitter Screen (already there or add it)
                  GoRoute(
                    path: 'pet-sitter',
                    name: AppRoute.petSitter.name,
                    builder: (final context, final state) =>
                        const PetSitterScreen(),
                    routes: [
                      // ← THIS IS WHAT WAS MISSING ←
                      GoRoute(
                        path:
                            'service-details/:serviceId', // or just 'service-details' if no ID
                        name: 'service-details', // ← THIS NAME MUST EXIST!
                        builder: (final context, final state) {
                          final serviceId = state.pathParameters['serviceId'];
                          // final extraData = state.extra;   // if you pass a model

                          return ServiceDetails(serviceId: serviceId);
                        },
                      ),
                    ],
                  ),

                  GoRoute(
                    path: 'pet-market',
                    name: AppRoute.petMarket.name,
                    builder: (final context, final state) =>
                        const PetMarketScreen(),
                  ),

                  GoRoute(
                    path: 'pet-school',
                    name: AppRoute.petSchool.name,
                    builder: (final context, final state) =>
                        const PetSchoolScreen(),
                  ),
                ],
              ),
            ],
          ),

          // Branch 1: Bookings (Index 1 in Navbar)
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoute.bookings.path,
                name: AppRoute.bookings.name,
                builder: (final context, final state) =>
                    const BookingsWrapperPage(),
              ),
            ],
          ),

          // Branch 2: Messages (Index 2 in Navbar)
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoute.messages.path,
                name: AppRoute.messages.name,
                builder: (final context, final state) => const MessagesPage(),
              ),
            ],
          ),

          // Branch 3: Profile (Index 3 in Navbar)
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoute.profile.path,
                name: AppRoute.profile.name,
                builder: (final context, final state) =>
                    const ProfileWrapperPage(),
                routes: [
                  GoRoute(
                    path: 'settings',
                    name: AppRoute.settings.name,
                    parentNavigatorKey: rootNavigatorKey,
                    builder: (final context, final state) =>
                        const SettingsPage(),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),

      // Other top-level routes
      GoRoute(
        path: AppRoute.onboarding.path,
        name: AppRoute.onboarding.name,
        builder: (final context, final state) => const OnboardingPage(),
      ),
      // Shorts fullscreen route (if needed, otherwise accessed via Home tab)
      GoRoute(
        path: AppRoute.shorts.path,
        name: AppRoute.shorts.name,
        builder: (final context, final state) =>
            const PlaceholderPage(title: 'Shorts'),
      ),
      // Menu page route
      GoRoute(
        path: AppRoute.menu.path,
        name: AppRoute.menu.name,
        builder: (final context, final state) => const MenuPage(),
      ),
    ],
    redirect: (final context, final state) =>
        _handleRedirect(ref, state.uri.path),
    errorBuilder: (final context, final state) =>
        ErrorPage(path: state.uri.path),
    observers: [
      if (analyticsObserver != null) analyticsObserver,
    ],
  );
}

// Redirect Guards

String? _handleRedirect(final Ref ref, final String path) {
  final lifecycleState = ref.read(appLifecycleNotifierProvider);
  final sessionState = ref.read(sessionStateProvider);
  final signupEmail = ref.read(signupIntentProvider);
  final route = AppRoute.matchPath(path);

  return _guardLoading(route, sessionState) ??
      _guardInitialization(route, lifecycleState) ??
      _guardMaintenance(route) ??
      _guardSplash(route) ??
      _guardSignupIntent(route, signupEmail) ??
      _guardAuth(route, sessionState);
}

/// Guard for signup intent - redirect to signup page if user needs to sign up
String? _guardSignupIntent(final AppRoute? route, final String? signupEmail) {
  // If there's a pending signup intent and we're not already on signup page
  if (signupEmail != null && route != AppRoute.signup) {
    // Redirect to signup with email query parameter
    return '${AppRoute.signup.path}?email=${Uri.encodeComponent(signupEmail)}';
  }
  return null;
}

String? _guardLoading(final AppRoute? route, final SessionState sessionState) {
  if (sessionState.isLoading && route != AppRoute.splash) {
    return null;
  }
  return null;
}

String? _guardInitialization(
  final AppRoute? route,
  final AppLifecycleState lifecycleState,
) {
  if (!lifecycleState.isInitialized) {
    if (route != AppRoute.splash) {
      return AppRoute.splash.path;
    }
    return null;
  }
  return null;
}

String? _guardMaintenance(final AppRoute? route) {
  if (route == AppRoute.maintenance) {
    return null;
  }
  return null;
}

String? _guardSplash(final AppRoute? route) {
  if (route == AppRoute.splash) {
    return null;
  }
  return null;
}

String? _guardAuth(final AppRoute? route, final SessionState sessionState) {
  if (!AppConfig.authEnabled || route == null) {
    return null;
  }

  final isLoggedIn = sessionState.isAuthenticated;

  // Guest Logic:
  // If user is guest, they can access public routes (like Home).
  // If they try to access protected routes (Bookings, Messages, Profile),
  // AND they are doing so via deep link or direct navigation (not via MainWrapper which handles UI restriction),
  // then we redirect to Login.

  if (route.requiresAuth && !isLoggedIn) {
    return AppRoute.login.path;
  }

  if (isLoggedIn && route == AppRoute.login) {
    return AppRoute.home.path;
  }

  return null;
}
