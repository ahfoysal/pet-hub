import 'package:flutter/material.dart';

import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:petzy_app/app/router/app_router.dart';
import 'package:petzy_app/core/core.dart';
import 'package:petzy_app/core/enums/user_role.dart';
import 'package:petzy_app/features/auth/domain/entities/user.dart';
import 'package:petzy_app/features/auth/presentation/providers/auth_notifier.dart';
import 'package:petzy_app/features/home/presentation/providers/comments_cursor_notifier.dart';
import 'package:petzy_app/features/home/presentation/providers/community_cursor_notifier.dart';
import 'package:petzy_app/features/home/presentation/widgets/home_feed.dart' show PostCard;
import 'package:petzy_app/features/home/presentation/widgets/services_showcase.dart';
import 'package:petzy_app/features/home/presentation/widgets/stories_row.dart';
import 'package:petzy_app/features/shorts/presentation/pages/shorts_page.dart';
import 'package:petzy_app/l10n/generated/app_localizations.dart';

/// Home page - main entry point of the app.
///
/// Features:
/// - Accessible to all users (logged in and anonymous)
/// - Tabs: Shorts and Home feed
/// - Service showcase section
/// - Stories section
/// - Home feed with posts
class HomePage extends HookConsumerWidget {
  /// Creates a [HomePage] instance.
  const HomePage({super.key});

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final l10n = AppLocalizations.of(context);

    // Track screen view once on mount
    useOnMount(() {
      ref.read(analyticsServiceProvider).logScreenView(screenName: 'home');
    });

    return SizedBox.expand(
      child: Material(
        color: Theme.of(context).scaffoldBackgroundColor,
        child: DefaultTabController(
          length: 2,
          initialIndex: 1, // Default to Home tab
          child: Column(
            children: [
              _buildAppBar(context, ref, authState),
              // Tabs: Shorts and Home
              TabBar(
                tabs: [
                  Tab(text: l10n.shorts),
                  Tab(text: l10n.home),
                ],
                labelColor: context.colorScheme.primary,
                unselectedLabelColor: context.colorScheme.onSurfaceVariant,
                indicatorColor: context.colorScheme.primary,
                indicatorSize: TabBarIndicatorSize.label,
                labelStyle: context.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              // Tab content
              Expanded(
                child: TabBarView(
                  children: [
                    // Shorts tab
                    const ShortsPage(),

                    // Home tab - feed with services and posts
                    const _HomeTabContent(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Build the app bar with Petzy logo and login button.
  static Widget _buildAppBar(
    final BuildContext context,
    final WidgetRef ref,
    final AsyncValue<User?> authState,
  ) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              AppIconButton(
                icon: Icons.menu,
                onPressed: authState.maybeWhen(
                  data: (final user) =>
                      user != null ? () => context.pushRoute(AppRoute.menu) : null,
                  orElse: () => null,
                ),
              ),
              Text(
                'Petzy',
                style: context.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: context.colorScheme.primary,
                ),
              ),
              authState.when(
                data: (final user) {
                  if (user != null) {
                    // User is logged in - show QR Scanner and Notifications buttons
                    return Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        AppIconButton(
                          icon: Icons.qr_code_scanner,
                          onPressed: () {
                            context.showSnackBar('QR Scanner coming soon');
                          },
                        ),
                        AppIconButton(
                          icon: Icons.notifications_outlined,
                          onPressed: () {
                            context.pushRoute(AppRoute.settings);
                          },
                        ),
                      ],
                    );
                  } else {
                    // User is not logged in - show login button
                    return AppButton(
                      variant: AppButtonVariant.primary,
                      size: AppButtonSize.small,
                      isExpanded: false,
                      onPressed: () => context.pushRoute(AppRoute.login),
                      label: 'Login',
                    );
                  }
                },
                loading: () => const SizedBox.shrink(),
                error: (_, final __) => const SizedBox.shrink(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Home tab content with services and feed.
class _HomeTabContent extends HookConsumerWidget {
  const _HomeTabContent();

  @override
  Widget build(final BuildContext context, final WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final authState = ref.watch(authProvider);
    final state = ref.watch<CommunityCursorState>(communityCursorProvider);
    final notifier = ref.read(communityCursorProvider.notifier);

    final scrollController = ScrollController();

    // Load first page on mount
    useEffect(() {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (state.posts.isEmpty && state.isLoading == false) {
          notifier.loadFirstPage();
        }
      });

      return () => scrollController.dispose();
    }, <dynamic>[]);

    // Listen for app lifecycle changes to refresh feed when app resumes
    useEffect(() {
      final observer = _AppLifecycleObserver(
        onResume: () => notifier.refreshFeed(),
      );
      WidgetsBinding.instance.addObserver(observer);

      return () => WidgetsBinding.instance.removeObserver(observer);
    }, [notifier]);

    // Listen for scroll events to load more posts
    useEffect(() {
      void handleScroll() {
        if (scrollController.position.pixels >=
            scrollController.position.maxScrollExtent - AppConstants.scrollLoadMoreThreshold) {
          notifier.loadNextPage();
        }
      }

      scrollController.addListener(handleScroll);
      return () => scrollController.removeListener(handleScroll);
    }, [scrollController]);

    return RefreshIndicator(
      onRefresh: () => notifier.refreshFeed(),
      child: CustomScrollView(
        controller: scrollController,
        slivers: [
          // Services section - only for pet owners
          if (authState.maybeWhen(
            data: (final user) => user?.role == UserRole.petOwner,
            orElse: () => false,
          ))
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const VerticalSpace.md(),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'Top Services',
                      style: context.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const ServicesShowcase(),
                  // const VerticalSpace.lg(),
                ],
              ),
            ),

          // Stories section
          if (authState.maybeWhen(
            data: (final user) => user != null,
            orElse: () => false,
          ))
            SliverToBoxAdapter(
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: const StoriesRow(),
                  ),
                  const Divider(thickness: 0.5),
                ],
              ),
            ),

          // Feed content
          if (state.posts.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: state.isLoading == true
                  ? const LoadingWidget()
                  : (state.error != null
                        ? AppErrorWidget(
                            message: state.error ?? l10n.unknownError,
                            onRetry: () => notifier.loadFirstPage(),
                          )
                        : EmptyWidget(
                            message: l10n.noPostsFound,
                          )),
            )
          else
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (final context, final index) {
                  if (index == state.posts.length) {
                    return const Padding(
                      padding: EdgeInsets.all(16),
                      child: LoadingWidget(),
                    );
                  }

                  final post = state.posts[index];
                  return PostCard(
                    post: post,
                    onLikeToggle: (final bool isLiked) async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        await notifier.updatePostLike(post.id, isLiked);
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    onSaveToggle: (final bool isSaved) async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        notifier.updatePostSave(post.id, isSaved);
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    onEdit: () async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        // TODO: Implement edit post functionality
                        context.showSnackBar('Edit post coming soon');
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    onDelete: () async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        // TODO: Implement delete post functionality
                        context.showSnackBar('Post deleted');
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    onReport: () async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        // TODO: Implement report post functionality
                        context.showSnackBar('Post reported');
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    onViewComments: (final postId) async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        // TODO: Fetch comments from backend
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    onAddComment: (final postId, final text) async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        await ref.read(commentsCursorProvider(postId).notifier).addComment(text);
                        if (context.mounted) {
                          context.showSnackBar('Comment added');
                        }
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    onCommentLike: (final commentId, final isLiked) async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        // TODO: Implement comment like functionality
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    onShare: (final postId, final postUrl) async {
                      if (authState.maybeWhen(
                        data: (final user) => user != null,
                        orElse: () => false,
                      )) {
                        // TODO: Track share event in analytics
                        // Share event tracking can be added here
                      } else {
                        context.pushRoute(AppRoute.login);
                      }
                    },
                    isCurrentUser: false, // TODO: Check if current user owns post
                  );
                },
                childCount: state.posts.length + (state.isLoading == true ? 1 : 0),
              ),
            ),

          // Bottom padding
          SliverToBoxAdapter(
            child: const SizedBox(height: 16),
          ),
        ],
      ),
    );
  }
}

/// Observer to detect when app comes back to foreground.
/// Used to refresh feed data when user returns to the app.
class _AppLifecycleObserver extends WidgetsBindingObserver {
  /// Creates a [_AppLifecycleObserver].
  _AppLifecycleObserver({required this.onResume});

  /// Callback when app resumes.
  final VoidCallback onResume;

  @override
  void didChangeAppLifecycleState(final AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      onResume();
    }
  }
}
