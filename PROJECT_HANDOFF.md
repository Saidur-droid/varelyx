# Varelyx - Project Handoff / Single Source of Truth

Last updated: 2026-09-29
Competition: Google Cloud AI Builder Cup 2026, powered by Hack2skill
Theme: Retail & Commerce - Intelligent Customer and Business Experiences
Firebase project: `varelyx-ai-builder-cup`
Production URL recorded in the prior deployment handoff: https://varelyx-ai-builder-cup.web.app

## Read this first

The reliability implementation is on `fix/firebase-verification-20260929`. It is not certified as deployed or production-ready. Read `docs/FIREBASE_FIX_REPORT_2026-09-29.md` for the code changes, actual tests, security limitations and precise owner-side connection/live QA steps.

Do not treat the existing `NEXT_STEPS.md`, `DEPLOYMENT_STATUS.md` or prepared submission copy as evidence that the new branch has passed live QA.

## Product and non-negotiable goals

KNOW -> ASK -> PROVE -> ACT.

Interpret disruption evidence, expose uncertainty, ask for decision-critical information, compute quantities deterministically, independently verify encoded constraints, and require human approval before storing sandbox action records.

Preserve eligibility/rule compliance and meaningful product/GenAI quality. Never claim real customers, pilots, revenue, observed retailer impact or external order dispatch without evidence. Simulation must remain clearly labelled.

## Existing infrastructure - recorded, not re-certified

The September 27 handoff recorded Hosting and Realtime Database rules deployed, Anonymous Auth and Firebase AI Logic enabled, and App Check registered with reCAPTCHA Enterprise. `public/firebase-config.js` already points to the intended project. Those account-side settings have not been independently re-verified in the September 29 work session.

Primary path remains Firebase Hosting + Firebase AI Logic/Gemini + Anonymous Auth + Realtime Database. No billing upgrade or alternative hosting provider was introduced. The earlier FastAPI/OR-Tools/Cloud Run implementation remains an optional reference, not the current web runtime.

## Implemented on the reliability branch

- Server-only, authenticated Firebase reads; revisioned ETag conditional writes; explicit write/read-back confirmation.
- No operational localStorage fallback that could masquerade as cloud persistence.
- JSON envelopes preserve empty arrays/null state; v2 does not silently trust legacy approvals.
- Schema-constrained Gemini extraction, range/quote checks, human evidence review and stale-proof invalidation.
- Extracted routes affect an explicitly disclosed controlled route-capacity policy.
- Two-unknown sensitivity-based question ranking; not the complete general Evidence Scout.
- Consistent Shadow Mode baseline of 290 expected shortage cases under the fixed demo scenarios.
- Stronger quantity/cash/emergency/MOQ/route checks and reproducible full-plan SHA-256 receipts.
- Receipt-linked sandbox action records, duplicate protection and evidence export.
- Separate Node web tests added to CI; Python asset checks updated for modular files.

## Verification actually obtained

Local Node test result observed during implementation: 31 passed / 31 tests. This covers deterministic logic and mocked transport, including a 140-plan boundary matrix inside one test.

NOT verified: real Firebase writes, real Gemini inference, App Check enforcement, actual browser flow, mobile visuals, production deployment or final submission. Browser navigation was blocked by the execution environment. No live screenshot or video was fabricated.

The prior GitHub main CI failed before any reported job steps; logs were unavailable and the annotations endpoint was not accessible through the connector. Root cause remains unconfirmed. New workflow code does not imply a successful hosted CI run.

## Immediate P0 queue

1. Review the branch and obtain a successful GitHub CI run or diagnose the account/runner block.
2. On an authorized machine, log in to Firebase and confirm access to the intended project; do not paste private credentials into chat.
3. Deploy a Hosting preview, configure its Auth/App Check domains, and run the live QA in the implementation report.
4. Prove actual Gemini -> reviewed evidence -> PASS/BLOCK/HOLD -> approval -> server-confirmed save -> reload restoration.
5. Capture authentic screenshots and export QA JSON. Only after successful review/live QA merge and release to production.
6. Verify the final proposal PDF against actual functionality, record and publish a public three-minute video, and test links signed out.
7. Confirm eligible team members and final portal fields; submit and save confirmation.

## Competition rules and dates

Official sources: https://aibuildercup.com/ and https://aibuildercup.com/themes.html .

Recently indexed official information lists teams of 2-4, team formation through October 11, 2026, and prototype submission through October 18, 2026. Direct retrieval also exposed an older homepage version listing 1-4; confirm the latest rule in the authenticated portal. Do not confuse the original internal October 3 target with the published submission deadline.

Participants must be 21+, based in JAPAC and eligible working professionals. Students are not eligible. Use Google AI/eligible agentic tooling and deploy a working prototype on Google Cloud/Cloud Run/Firebase. Submission materials are English: proposal PDF, deployed prototype and public three-minute demo. Judging weights are technical/GenAI 40%, problem alignment/impact 25%, innovation 25%, UX/design 10%.

Confirm the exact Retail & Commerce statement in the portal; the themes page has inconsistent generic category examples. Check source-code visibility/access requirements before changing the private repository, and review credentials before any public release.

## Remaining full-product work

Real sales/inventory ingestion driving forecasts, empirical forecasting benchmarks, general question ranking, realistic scenario generation, ADK orchestration, stronger server-authoritative enforcement, broader reliability testing and a real outcome ledger remain unfinished. Do not describe them as completed by this reliability patch.

The client-side Proof Gate is not a trusted server attestation. A malicious user can alter their own demo records. Real purchasing needs server-side authorization and validation.

## Submission assets and completion gate

Earlier documentation reports a proposal deck/PDF prepared; their final files were not re-certified here. `docs/DEMO_VIDEO_SCRIPT.md` and `docs/SUBMISSION_PORTAL_COPY.md` remain starting points and must be reconciled with the v2 behavior and honest claims.

100% complete requires live Gemini proof, PASS/BLOCK proof, verified remote persistence after reload, eligible team, final PDF, tested public video link, completed portal fields, accepted submission and saved confirmation evidence. These final gates remain open.

After submission, tag the accepted commit, save final materials offline and keep the deployment stable through evaluation.
