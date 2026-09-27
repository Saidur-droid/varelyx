# Varelyx

**Know what matters. Ask what is missing. Prove what works. Then act.**

Varelyx is an evidence-driven retail continuity prototype for the Google Cloud AI Builder Cup 2026, Retail & Commerce theme.

## Competition deployment path

The final no-card competition path is:

**Firebase Hosting (Spark) -> Firebase AI Logic -> Gemini Developer API -> Anonymous Firebase Auth -> Realtime Database**

No Vercel. No Supabase. No Blaze upgrade is required for the primary submission path.

The public web prototype uses Gemini to interpret messy Bangla/Banglish/English disruption evidence and generate a focused evidence question. Operational quantities are computed by deterministic constrained logic, not invented by the model. An independent Proof Gate can HOLD or BLOCK unsafe plans before human approval.

## Current working flow

1. Analyze a disruption message with Gemini.
2. Separate Known / Estimated / Unknown evidence.
3. Surface the highest-value missing fact.
4. Confirm Supplier B Thursday capacity.
5. Recompute current / cheapest / balanced / maximum-availability plans.
6. Prove the balanced plan -> PASS.
7. Try an intentionally unsafe proposal -> BLOCK.
8. Approve the verified plan.
9. Persist action objects in Firebase Realtime Database.
10. Compare the response in Shadow Mode.

All impact values in the demo are controlled-simulation outputs, not observed retailer results.

## Google/Firebase stack

- Firebase Hosting — public competition web app.
- Firebase AI Logic — client integration to Gemini.
- Gemini Developer API — live generative evidence understanding.
- Firebase App Check + reCAPTCHA Enterprise — abuse protection.
- Firebase Anonymous Authentication — isolated judge/browser demo sessions.
- Firebase Realtime Database — persisted session/action state.
- Deterministic constrained solver + Proof Gate — quantities and hard-rule verification.

The repository also keeps the earlier FastAPI / OR-Tools backend prototype and Cloud Run Docker path as an optional engineering reference. It is **not required** for the no-card competition deployment.

## Firebase project

Project ID:

    varelyx-ai-builder-cup

Expected public URL after deployment:

    https://varelyx-ai-builder-cup.web.app

## Deploy on Windows

The project is already bound in `.firebaserc`.

Double-click:

    deploy-firebase.cmd

The helper uses `npx firebase-tools`, opens Firebase login when needed, and deploys Hosting plus Realtime Database rules.

Manual equivalent:

    npx --yes firebase-tools@latest login
    npx --yes firebase-tools@latest deploy --only hosting,database

Do **not** run `firebase init`; the repository already contains the required Firebase configuration.

## Required production verification

After deployment, verify all of these on the public URL:

- Header reports Firebase connected / Gemini ready.
- Analyze disruption returns **LIVE GEMINI VERIFIED**.
- Supplier capacity 120 resolves the critical unknown.
- Balanced plan -> PASS.
- Unsafe proposal -> BLOCK.
- Approval creates backend action objects.
- Refresh preserves the session state/actions.
- Simulation values remain explicitly labelled.

See:
- `COMPETITION_RULES_LOCK.md`
- `docs/FIREBASE_NO_CARD_DEPLOY.md`
- `docs/SUBMISSION_READY.md`
- `DEPLOYMENT_STATUS.md`
