#!/bin/bash
REPOS=(
  "marketing-landing"
  "super-admin-dashboard"
  "pet-hotel-admin-dashboard"
  "vendor-admin"
  "pet-sitter-admin-dashboard"
  "pet-school-admin"
  "owner-dashboard"
  "auth-and-kyc"
  "richardhan-server"
)

for repo in "${REPOS[@]}"; do
  echo "======================================"
  echo "Installing & Building: $repo"
  echo "======================================"
  cd "/Users/foysal/Documents/FOYSAL/Projects/$repo" || exit 1
  npm install || { echo "npm install failed for $repo"; exit 1; }
  npm run build || { echo "Build failed for $repo"; exit 1; }
done
echo "All builds finished successfully!"
