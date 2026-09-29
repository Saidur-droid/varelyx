#!/usr/bin/env bash
set -euo pipefail
python -m pip install -r requirements.txt
npm install --no-audit --no-fund
printf '\nVarelyx Codespace ready. Optional browser install: npx playwright install --with-deps chromium\n'
