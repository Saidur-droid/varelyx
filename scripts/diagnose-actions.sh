#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-Saidur-droid/varelyx}"

command -v gh >/dev/null || { echo "gh CLI is required" >&2; exit 2; }
gh auth status

echo "=== repository Actions permissions ==="
gh api "repos/$REPO/actions/permissions"

echo "=== workflow default permissions ==="
gh api "repos/$REPO/actions/permissions/workflow"

echo "=== recent workflow runs ==="
gh run list --repo "$REPO" --limit 12

echo "=== release-gate run jobs ==="
for run_id in 36603710225 36602990664; do
  echo "--- run $run_id ---"
  gh api "repos/$REPO/actions/runs/$run_id/jobs" --jq '.jobs[] | {id,name,status,conclusion,runner_name,runner_group_name,steps}'
done

cat <<'EOF'

Interpretation:
- If failed jobs have null/empty runner_name and no steps, workflow code never executed.
- Check Repo Settings -> Actions -> General and account Billing/Usage before changing app code.
- Do not mark PR #1 release-ready until a hosted runner actually executes the jobs.
EOF
