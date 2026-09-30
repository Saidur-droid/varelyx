#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-}"
[ -n "$BASE_URL" ] || { echo "BASE_URL is required" >&2; exit 2; }

echo "=== WAIT FOR MATCHING PREVIEW REVISION ==="
READY=0
for attempt in $(seq 1 30); do
  curl -fsS --max-time 20 "$BASE_URL/" >/tmp/varelyx-preview.html || true
  curl -fsS --max-time 20 "$BASE_URL/i18n.mjs" >/tmp/varelyx-i18n.mjs || true
  if grep -q 'id="languageSelect"' /tmp/varelyx-preview.html && grep -q "LIVE RETAIL CONTINUITY INCIDENT" /tmp/varelyx-i18n.mjs; then
    READY=1
    echo "Preview is serving the current bilingual UI."
    break
  fi
  echo "Attempt $attempt/30: preview is still serving an older revision; waiting..."
  sleep 5
done
if [ "$READY" -ne 1 ]; then
  echo "Preview never served the expected current revision." >&2
  exit 1
fi

npm install --ignore-scripts --no-audit --no-fund
npm run check:js
npm run test:node
PYTHONPATH=. pytest -q

npx playwright install --with-deps chromium
BASE_URL="$BASE_URL" npm run test:e2e

echo "=== RENDER PREVIEW QA: PASS ==="
echo "Preview: $BASE_URL"
