#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${FIREBASE_PROJECT_ID:-varelyx-ai-builder-cup}"
PRODUCTION_URL="${PRODUCTION_URL:-https://varelyx-ai-builder-cup.web.app}"
CREDENTIAL_JSON="${GCP_SERVICE_ACCOUNT_JSON:-}"

if [ -z "$CREDENTIAL_JSON" ]; then
  echo "GCP_SERVICE_ACCOUNT_JSON is not configured; refusing unauthenticated Firebase deploy." >&2
  exit 78
fi

cleanup() {
  rm -f /tmp/varelyx-gcp-key.json
}
trap cleanup EXIT

printf '%s' "$CREDENTIAL_JSON" > /tmp/varelyx-gcp-key.json
chmod 600 /tmp/varelyx-gcp-key.json
export GOOGLE_APPLICATION_CREDENTIALS=/tmp/varelyx-gcp-key.json

echo "=== VERIFY SOURCE ==="
npm install --ignore-scripts --no-audit --no-fund
npm run check:js
npm run test:node

if command -v python3 >/dev/null 2>&1; then
  python3 -m pip install --user pytest >/dev/null
  PYTHONPATH=. python3 -m pytest -q
elif command -v python >/dev/null 2>&1; then
  python -m pip install --user pytest >/dev/null
  PYTHONPATH=. python -m pytest -q
else
  echo "Python runtime unavailable on Render; skipping Python reference tests in this controller." >&2
fi

echo "=== DEPLOY FIREBASE HOSTING ==="
npx --yes firebase-tools@latest deploy   --only hosting   --project "$PROJECT_ID"   --non-interactive

echo "=== WAIT FOR OFFICIAL HOST TO SERVE LATEST UI ==="
ready=0
for attempt in $(seq 1 24); do
  body="$(curl -fsSL --max-time 20 "$PRODUCTION_URL/" || true)"
  if printf '%s' "$body" | grep -q 'id="commandCenter"'; then
    ready=1
    echo "Official Firebase host is serving the latest Decision Command Center."
    break
  fi
  echo "Attempt $attempt/24: waiting for Firebase Hosting propagation..."
  sleep 5
done
if [ "$ready" -ne 1 ]; then
  echo "Official Firebase host did not serve #commandCenter after deploy." >&2
  exit 1
fi

echo "=== INSTALL BROWSER ==="
npx playwright install chromium

echo "=== LIVE PRODUCTION QA ==="
LIVE_JUDGE_FLOW=1 EVIDENCE_CAPTURE=1 BASE_URL="$PRODUCTION_URL" npm run test:e2e

echo "=== SUCCESS: FIREBASE RELEASE VERIFIED ==="
echo "Project: $PROJECT_ID"
echo "Production: $PRODUCTION_URL"
