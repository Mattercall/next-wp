#!/usr/bin/env bash
set -euo pipefail

SERVICE="mattercall-frontend.service"
APP_DIR="/var/www/frontend.mattercall.com"

echo "==> Stopping service: $SERVICE"
sudo systemctl stop "$SERVICE" || true

echo "==> Switching to app directory: $APP_DIR"
cd "$APP_DIR"

# Save current commit so we can detect what changed after pull
BEFORE_SHA="$(git rev-parse HEAD)"

echo "==> Pulling latest code"
git pull

AFTER_SHA="$(git rev-parse HEAD)"

echo "==> Clearing Next.js build cache (.next)"
rm -rf .next

# Detect if dependency files changed
CHANGED_FILES="$(git diff --name-only "$BEFORE_SHA" "$AFTER_SHA" || true)"

if echo "$CHANGED_FILES" | grep -qE '^(package\.json|package-lock\.json)$'; then
  echo "==> Dependencies changed -> installing with npm ci"
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
else
  echo "==> Dependencies unchanged -> skipping npm install"
fi

echo "==> Building"
npm run build

echo "==> Starting service: $SERVICE"
sudo systemctl start "$SERVICE"

echo "==> Service status"
sudo systemctl status "$SERVICE" --no-pager
echo "✅ Done."
