# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial boilerplate release

## [1.0.0] - 2026-01-17

### Added

#### Core Architecture

- Feature-first Clean Architecture with Riverpod state management
- GoRouter navigation with type-safe routes (`AppRoute` enum)
- Startup state machine for app initialization flow
- Environment configuration (dev/staging/prod)

#### Core Modules (27 modules)

- **Analytics** - Firebase Analytics integration with screen tracking
- **Biometric** - Face ID / Touch ID authentication
- **Cache** - Offline-first caching with Drift database
- **Constants** - Centralized app constants, endpoints, assets, storage keys
- **Crashlytics** - Firebase Crashlytics for crash reporting
- **Deep Link** - Universal links & app links handling
- **Extensions** - Dart/Flutter extensions for cleaner code
- **Feedback** - Context-free snackbars & dialogs
- **Forms** - Reactive Forms configurations
- **Hooks** - Custom Flutter Hooks (`useOnMount`, `useDebounce`, etc.)
- **Localization** - Multi-language support (English, Bengali)
- **Network** - Dio HTTP client with interceptors, retry logic
- **Notifications** - Local push notifications
- **Performance** - Firebase Performance monitoring
- **Permissions** - Runtime permission handling
- **Remote Config** - Firebase Remote Config for feature flags
- **Result** - Result monad for type-safe error handling
- **Review** - Smart in-app review prompting
- **Session** - Session state management with token refresh
- **Storage** - Secure storage utilities (FlutterSecureStorage)
- **Theme** - Material 3 theming with dark mode support
- **Utils** - Validators, logger, and utilities
- **Version** - App version check & force update logic
- **Widgets** - 25+ reusable UI components

#### Reusable Widgets

- `AsyncValueWidget` - Handles Riverpod `AsyncValue` states
- `LoadingWidget` / `AppErrorWidget` / `EmptyWidget` - Standard states
- `AppButton` / `AppIconButton` - Consistent button styles
- `VerticalSpace` / `HorizontalSpace` - Spacing widgets
- `AppTextField` / `AppSearchField` - Input fields
- `CachedImage` - Network image caching
- `ResponsiveBuilder` - Adaptive layouts
- Animation widgets: `FadeIn`, `SlideIn`, `ScaleIn`, `Bounce`, `Pulse`, `ShakeWidget`
- `ShimmerLoading` - Skeleton loading states
- `AppDialogs` / `AppBottomSheets` - Dialogs and bottom sheets

#### Features

- **Auth** - Login/logout with session management
- **Home** - Home screen template
- **Onboarding** - Onboarding flow with page indicators
- **Settings** - Settings with theme toggle, language selection

#### Developer Experience

- Code generation with `build_runner` and `freezed`
- Makefile commands (`make gen`, `make format`, `make lint`, `make test`)
- Feature generator script (`make feature NAME=my_feature`)
- Project rename script (`scripts/rename_project.sh`)
- Comprehensive test suite with mocktail
- CI/CD pipeline with GitHub Actions
  - Automated testing and linting
  - Split APK builds per architecture
  - GitHub Releases (main) and Pre-releases (dev)

#### Documentation

- README.md with full setup instructions
- DEVELOPER_GUIDE.md with component documentation
- AI instructions (`.github/copilot-instructions.md`)

### Security

- Secure token storage with FlutterSecureStorage
- iOS Keychain fresh install handling
- Auth interceptor with automatic token refresh
- Android Cronet adapter for HTTP/3 support

---

## Version Format

```
X.Y.Z+N
```

- **X** (Major): Breaking changes, major rewrites
- **Y** (Minor): New features, backward compatible
- **Z** (Patch): Bug fixes, minor improvements
- **+N** (Build): Optional build number for tracking

## How to Update

When releasing a new version:

1. Add a new section under `[Unreleased]` or create a new version header
2. Use these categories: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`
3. Update `pubspec.yaml` version
4. Commit with message: `chore: release vX.Y.Z`
5. CI will automatically create GitHub Release with changelog

[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
