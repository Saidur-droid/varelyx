#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-}"
[ -n "$BASE_URL" ] || { echo "BASE_URL is required" >&2; exit 2; }

curl -fsS --retry 8 --retry-delay 5 "$BASE_URL/" >/tmp/varelyx-preview.html
grep -q "Varelyx" /tmp/varelyx-preview.html

npm install --ignore-scripts --no-audit --no-fund
npm run check:js
npm run test:node
PYTHONPATH=. pytest -q

npx playwright install --with-deps chromium
BASE_URL="$BASE_URL" npm run test:e2e

echo "=== RENDER PREVIEW QA: PASS ==="
echo "Preview: $BASE_URL"
