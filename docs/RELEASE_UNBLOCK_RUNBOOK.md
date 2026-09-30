# Varelyx release-unblock runbook

Status: **production remains protected**. Product PR #1 stays draft until cloud proof passes.

## 1. Diagnose GitHub-hosted Actions

Run from Codespaces or any authenticated shell:

```bash
bash scripts/diagnose-actions.sh
```

If jobs still show no runner and no steps, fix the repository/account Actions policy, private-repo minutes/usage, spending limit, payment, or entitlement. Do not modify application code to compensate for a job that never started.

## 2. Bootstrap least-privilege Google WIF

Run in Google Cloud Shell with an account authorized for `varelyx-ai-builder-cup`:

```bash
gcloud auth login
bash scripts/bootstrap-wif-preview.sh
```

The script is idempotent. It creates/updates only the GitHub OIDC pool/provider, the preview deploy service account, and the minimum Firebase Hosting/service-usage roles. It never creates a JSON key and never grants Owner.

## 3. Re-run PR #1 CI

Once hosted runners execute steps, re-run the failed CI for `fix/firebase-verification-20260929`. Require Node, Python, and browser jobs to execute rather than merely queue.

## 4. Dispatch the trusted preview

```bash
gh workflow run "Firebase Preview" --repo Saidur-droid/varelyx --ref main \
  -f target_ref=fix/firebase-verification-20260929 \
  -f channel_id=premium-workspace
```

Keep the preview URL from the deploy summary. Do not deploy production.

## 5. Live proof gate

On the preview verify all of the following with synthetic demo data:

- real Gemini analysis;
- evidence review and missing-evidence HOLD;
- balanced plan PASS;
- unsafe proposal BLOCK;
- human approval;
- SAVE VERIFIED only after Firebase write/read-back;
- refresh restores the same server state;
- forced write/network failure shows NOT VERIFIED;
- separate anonymous users cannot read each other's records;
- concurrent tabs conflict instead of silently overwriting;
- App Check/Auth accept the preview host without weakening security.

## 6. Visual QA

Capture evidence at 1440x900, 1280x720, and 390x844. Check console errors, receipt wrapping, keyboard flow, loading/error states, and controlled-simulation disclosure.

## 7. Promotion rule

Only after the above passes:
1. sync PR #1 with current `main`;
2. review the final diff;
3. merge PR #1;
4. deploy production separately;
5. rerun the live proof gate on production;
6. update screenshots, demo video, PDF claims, and submission copy from observed behavior only.

Never claim release-ready, live-verified, secure, or competition-complete without the corresponding evidence.
