# Varelyx Deployment Status

Last updated: 2026-09-30

## Live infrastructure

- Firebase project: `varelyx-ai-builder-cup`
- Official Hosting URL: https://varelyx-ai-builder-cup.web.app
- Realtime Database rules: deployed
- Region: `asia-southeast1`
- Firebase Anonymous Authentication: enabled
- Firebase AI Logic: enabled
- Firebase App Check: registered with reCAPTCHA Enterprise
- Render preview: https://varelyx-preview-qa.onrender.com
- Render browser QA: https://varelyx-browser-qa.onrender.com
- Dedicated official-Firebase live QA service: configured

## Verified on the latest product branch

- Render exact-branch preview auto-deploy is live.
- Node/source verification gate is green on Render.
- Browser smoke is green at 1440x900, 1280x720 and 390x844.
- Controlled-simulation disclosure is visible in the judge-facing incident surface.
- Negative unit/transport proofs cover:
  - permission denied -> save NOT VERIFIED;
  - network failure -> NOT VERIFIED + reload reconciliation;
  - read-back mismatch -> no success claim;
  - concurrent revision conflict -> overwrite blocked;
  - separate anonymous UIDs -> separate RTDB paths.
- Preview-domain App Check blocks real Firebase/Gemini access on Render, so the Render preview is intentionally UI/browser QA only.

## Current production gate

The official Firebase URL still serves the older production build. Dedicated official-Firebase Playwright QA cannot find the new Decision Command Center (`#commandCenter`), so the latest product branch has **not** been deployed to production yet.

Do not merge/release PR #1 until the latest branch is deployed to official Firebase with an authorized deploy identity and the live gate below passes.

## Required live production proof

1. Firebase server read verified.
2. Real Gemini analysis -> **LIVE GEMINI VERIFIED**.
3. Missing evidence -> HOLD.
4. Supplier B capacity 120 reviewed by human operator.
5. Balanced candidate -> PASS.
6. Unsafe proposal -> BLOCK.
7. Balanced candidate -> PASS again.
8. Human approval -> sandbox actions only.
9. Firebase write/read-back -> **FIREBASE SAVE VERIFIED**.
10. Reload -> server state/actions restored.
11. Deliberate write/network failure -> **NOT VERIFIED**.
12. Concurrent session/tab conflict blocks stale overwrite.
13. Anonymous-user data remains UID-isolated.
14. Controlled-simulation labels remain visible.

## Competition completion status

Technical implementation is close, but overall submission is not complete until:
- latest product branch is deployed to official Firebase;
- live production proof above passes;
- eligible 2-4 person team is confirmed;
- <=3-minute public demo video is ready;
- final proposal/PDF claims match observed live behavior;
- exact portal category/problem is confirmed;
- final portal submission is accepted before the deadline.
