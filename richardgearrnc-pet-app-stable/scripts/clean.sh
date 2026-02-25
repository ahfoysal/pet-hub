#!/usr/bin/env bash
set -e

echo "🧹 Cleaning Flutter project..."

flutter clean
rm -rf .dart_tool
rm -rf build

# Remove generated Dart files
echo "🗑️  Removing generated files..."
find . -name "*.g.dart" -type f -delete 2>/dev/null || true
find . -name "*.freezed.dart" -type f -delete 2>/dev/null || true

# Remove iOS/macOS pods cache (optional)
if [ -d "ios/Pods" ]; then
    echo "🍎 Cleaning iOS Pods..."
    rm -rf ios/Pods
    rm -rf ios/.symlinks
    rm -f ios/Podfile.lock
fi

if [ -d "macos/Pods" ]; then
    echo "🍎 Cleaning macOS Pods..."
    rm -rf macos/Pods
    rm -rf macos/.symlinks
    rm -f macos/Podfile.lock
fi

echo "📦 Getting dependencies..."
flutter pub get

echo "✅ Clean complete!"
