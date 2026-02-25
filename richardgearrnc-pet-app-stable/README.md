<div align="center">

# 🚀 Flutter Riverpod Boilerplate

### A Production-Ready, Opinionated Flutter Starter Template

![Flutter](https://img.shields.io/badge/Flutter-3.10+-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-3.x-0175C2?style=for-the-badge&logo=dart&logoColor=white)
![Riverpod](https://img.shields.io/badge/Riverpod-3.x-0553B1?style=for-the-badge)
![GoRouter](https://img.shields.io/badge/GoRouter-17.x-4CAF50?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-9C27B0?style=for-the-badge)

**A modern Flutter boilerplate with production-grade architecture, state management, and built-in Firebase integration.**

</div>

---

## 📖 Overview

This boilerplate provides a **feature-first clean architecture** foundation for Flutter applications. It enforces best practices, ensures consistency, and accelerates development with pre-built core modules and reusable components.

**Key Highlights:**

- 🏗️ **Clean Architecture** - Feature-first modular design
- ⚡ **Modern State Management** - Riverpod 3.0 with code generation
- 🎨 **Rich UI Components** - 25+ reusable widgets and animations
- 🔐 **Enterprise-Grade Security** - Biometric auth, secure storage, token management
- 🌐 **Offline-First** - Built-in caching with Drift ORM
- 📊 **Firebase Suite** - Analytics, Crashlytics, Performance, Remote Config
- 🌍 **Internationalization** - Multi-language support (en/bn)
- 🧪 **Testing Ready** - Unit, widget, golden, and integration tests

---

## 🛠️ Tech Stack

### Core Technologies

| Category          | Technology             | Purpose                                 |
| :---------------- | :--------------------- | :-------------------------------------- |
| **Framework**     | Flutter 3.10+          | Cross-platform UI toolkit               |
| **Language**      | Dart 3.10+             | Null-safe, modern language              |
| **State**         | Riverpod 3.0           | Compile-safe state management           |
| **Routing**       | GoRouter 17.x          | Declarative navigation with auth guards |
| **Networking**    | Dio + Native Adapter   | HTTP/3 client with interceptors         |
| **Database**      | Drift (SQLite)         | Reactive offline-first persistence      |
| **Serialization** | Freezed + JSON Serial. | Immutable models with codegen           |

### Additional Tools

- **Forms:** reactive_forms
- **Hooks:** flutter_hooks
- **Auth:** local_auth (biometric)
- **Animations:** flutter_animate
- **Linting:** very_good_analysis (500+ rules)
- **Testing:** mocktail + flutter_test
- **i18n:** flutter_localizations (ARB)

---

## 🏛️ Architecture

This project follows **Feature-First Clean Architecture**:

```
lib/
├── app/                   # Global app configuration
│   ├── router/            # GoRouter setup & routes
│   └── startup/           # App lifecycle logic
├── config/                # Environment configuration
├── core/                  # Shared kernel (27 modules)
│   ├── analytics/         # Firebase Analytics
│   ├── biometric/         # Face ID / Touch ID
│   ├── cache/             # Offline caching (Drift)
│   ├── constants/         # App constants, endpoints
│   ├── deep_link/         # Universal/app links
│   ├── extensions/        # Dart/Flutter extensions
│   ├── feedback/          # Snackbars/dialogs
│   ├── hooks/             # Custom Flutter Hooks
│   ├── network/           # API client, interceptors
│   ├── performance/       # Firebase Performance
│   ├── remote_config/     # Feature flags
│   ├── storage/           # Secure storage
│   ├── theme/             # Material 3 theming
│   ├── utils/             # Validators, logger
│   ├── version/           # App version & force update
│   └── widgets/           # 25+ reusable components
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   ├── home/              # Home screen
│   ├── onboarding/        # Onboarding flow
│   └── settings/          # App settings
└── l10n/                  # Localization (ARB files)
```

### Feature Module Structure

Each feature follows this pattern:

```
features/<feature>/
├── data/               # Repository implementations
├── domain/             # Entities & repository interfaces
└── presentation/       # Pages, widgets, providers
```

**Dependency Rule:** Domain → Pure Dart | Data → Implements Domain | Presentation → Uses Both

---

## ✨ Core Features

### State Management (Riverpod 3.0)

- **Code Generation:** Type-safe providers with `@riverpod`
- **Offline Persistence:** `@JsonPersist()` for automatic caching
- **Mutations API:** Declarative loading/error states for write operations
- **Auto-dispose:** Automatic cleanup for page-scoped state

### Networking & Caching

- **HTTP/3 Support:** Native Cronet adapter on Android
- **Auto Token Refresh:** Concurrent-safe token renewal
- **Offline-First:** Drift ORM with ETag caching
- **Retry Logic:** Exponential backoff for failed requests

### Security

- **Biometric Auth:** Face ID / Touch ID integration
- **Secure Storage:** Encrypted token management
- **Session Management:** Auto-expiry and restoration
- **iOS Keychain Handler:** Fresh install detection

### UI/UX Components

**25+ Reusable Widgets:**

- **Async State:** `AsyncValueWidget`, `LoadingWidget`, `AppErrorWidget`
- **Buttons:** `AppButton`, `AppIconButton` with variants
- **Forms:** `AppTextField`, `AppSearchField`, `AppChip`
- **Animations:** Entry, attention, flip, expand, shimmer
- **Dialogs:** Confirm, alert, input, loading, selection
- **Layout:** `ResponsiveBuilder`, `ContentContainer`, spacing utilities

### Firebase Integration

- **Analytics:** User tracking & event logging
- **Crashlytics:** Crash reporting with custom logs
- **Performance:** Screen traces & HTTP monitoring
- **Remote Config:** Feature flags & A/B testing

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ShahriarHossainRifat/riverpod_go_router_boilerplate.git my_app
cd my_app

# Rename project
make rename NAME=my_app ORG=com.example DISPLAY="My Awesome App"

# Setup dependencies & generate code
make prepare

# Run the app
flutter run
```

---

## 💻 Commands

| Command               | Description                    |
| :-------------------- | :----------------------------- |
| `make prepare`        | Full setup (clean + gen code)  |
| `make gen`            | Run code generation            |
| `make watch`          | Run build_runner in watch mode |
| `make format`         | Format code & apply fixes      |
| `make lint`           | Run static analysis            |
| `make test`           | Run all tests                  |
| `make feature NAME=x` | Create new feature module      |
| `make ci`             | Run CI checks (lint + test)    |

---

## 📝 Development Principles

### Best Practices Enforced

1. **No Magic Numbers** - All values use constants (`AppConstants`, `AppSpacing`)
2. **No Hardcoded Strings** - All text uses localization (`l10n`)
3. **No Direct Colors** - Use `context.colorScheme.primary`
4. **Result Pattern** - Use `Result<T>` monad for error handling
5. **Analytics on Mount** - Use `useOnMount()` hook, never in `build()`
6. **Reusability First** - Use existing components before creating new ones

### Code Review Checklist

- ✅ Unit tests for business logic
- ✅ Widget tests for UI components
- ✅ No magic numbers or hardcoded strings
- ✅ All API calls use `ApiEndpoints` constants
- ✅ Proper error handling with `Result<T>`
- ✅ Analytics tracking on mount
- ✅ Code formatted (`make format`)
- ✅ Zero lint errors (`make lint`)

---

## 🧪 Testing

```bash
# Run all tests
make test

# Run specific test file
flutter test test/core/validators_test.dart

# Run with coverage
flutter test --coverage
```

**Test Types:**

- **Unit Tests:** Business logic, repositories, services
- **Widget Tests:** UI components and pages
- **Golden Tests:** Visual regression testing
- **Integration Tests:** End-to-end user flows

---

## 📦 Project Structure Highlights

### Constants (`lib/core/constants/`)

- `app_constants.dart` - Durations, dimensions, validation
- `api_endpoints.dart` - All API endpoint paths
- `assets.dart` - Image, icon, animation paths
- `storage_keys.dart` - Secure storage keys

### Reusable Widgets (`lib/core/widgets/`)

Organized into dedicated files:

- `async_value_widget.dart` - Loading/error/data states
- `buttons.dart` - Primary, secondary, icon buttons
- `text_fields.dart` - Input fields with validation
- `animations.dart` - Entry, attention, flip animations
- `dialogs.dart` - Confirmation, alert, input dialogs
- `spacing.dart` - Vertical/horizontal spacing

### Extensions (`lib/core/extensions/`)

Convenient extensions for cleaner code:

- `context.colorScheme` - Theme access
- `context.screenWidth` - Media query shortcuts
- `'text'.capitalized` - String utilities
- `DateTime.now().timeAgo` - Date formatting

---

## 🔥 Firebase Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Install FlutterFire CLI: `dart pub global activate flutterfire_cli`
4. Run: `flutterfire configure`
5. Enable services: Analytics, Crashlytics, Performance, Remote Config

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

<div align="center">

**Built with ❤️ for the Flutter community**

⭐ Star this repo if you find it helpful!

</div>
