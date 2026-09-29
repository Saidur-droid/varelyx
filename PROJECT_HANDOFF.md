# Varelyx - Project Handoff / Single Source of Truth

Last updated: 2026-09-29
Competition: Google Cloud AI Builder Cup 2026, powered by Hack2skill
Theme: Retail & Commerce - Intelligent Customer and Business Experiences
Firebase project: `varelyx-ai-builder-cup`
Production URL recorded in the prior deployment handoff: https://varelyx-ai-builder-cup.web.app

## Read this first

The reliability implementation and premium decision-workspace redesign are on `fix/firebase-verification-20260929`. They are not certified as deployed or production-ready. Read `docs/FIREBASE_FIX_REPORT_2026-09-29.md`, `docs/superpowers/specs/2026-09-29-premium-decision-workspace-design.md`, `docs/superpowers/plans/2026-09-29-decision-command-center-uiux.md`, and `docs/PREVIEW_REVIEW_CHECKLIST.md`.

Do not treat the existing `NEXT_STEPS.md`, `DEPLOYMENT_STATUS.md` or prepared submission copy as evidence that the new branch has passed live QA.

## Product and non-negotiable goals

KNOW -> ASK -> DECIDE -> PROVE -> ACT.

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

## Premium decision-workspace redesign implemented on the branch

- Operations-first Decision Command Center with the Varelyx sequence **KNOW -> ASK -> DECIDE -> PROVE -> ACT**.
- Persistent Firebase / Gemini / Evidence / Proof / Save status bar.
- Signal + Evidence investigation workspace with Confirmed / Estimated / Unknown / Stale states, source-grounded evidence, and visible evidence freshness.
- Evidence Scout promoted as the decision-critical missing-fact workflow.
- DECIDE workspace with a non-superlative **Balanced demo candidate**, compact alternatives, and a direct trade-off matrix.
- Signature Proof Gate presentation with PASS / HOLD / BLOCK, constraint details and copyable SHA-256 receipt.
- Explicit AI analysis -> deterministic proof -> **human authorization** boundary, approval summary and sandbox-only action ledger.
- Shadow Mode and chronological audit timeline.
- Responsive 1440 / 1280 / 390 design contracts, visible keyboard focus, reduced-motion support and text-labelled status states.
- Privacy-safe optional analytics adapter; analytics failure cannot block the judge flow and raw supplier evidence is stripped.
- Existing Figma review file: https://www.figma.com/design/L96hoZxuZmi4I45jeP6Iqy . Final sync to the latest Decision Command Center was blocked by the Figma Starter-plan MCP call limit; GitHub is authoritative.
- Production has NOT been overwritten. Firebase preview deployment is the next release gate.

## Verification actually obtained

Local reconstructed verification mirror results observed after the Decision Command Center work:
- **77/77 Node tests passed** across reliability, UI-state, UI-contract and analytics suites.
- **13/13 Python pytest tests passed** for the retained reference backend/rule checks.
- All current public JS/MJS files passed `node --check`.
- DOM scan: no duplicate IDs and no missing element IDs referenced by `app.js`.
- CSS structural parse: balanced braces and no reported top-level parser errors.

These results verify the reconstructed test mirror, not a deployed Firebase environment. The authorized Windows device is currently offline, so an exact-checkout run on that machine remains a release gate.

NOT verified: real Firebase writes on the redesigned preview, real Gemini inference on the redesigned preview, App Check preview-domain behavior, actual visual browser QA at 1440/1280/390, production deployment or final submission. Local headless Chromium did not complete in this execution environment. No live screenshot or video was fabricated.

The latest redesign PR run (GitHub Actions run **36595560628**) also completed as failure before reported job steps: both `web` and `test` jobs returned no runner and `steps: null`. This still does not establish a test assertion failure. Root cause remains unconfirmed.

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

The current public homepage lists teams of 2-4, team formation/registration through October 11, 2026, and prototype submission through October 18, 2026. The linked official Terms & Conditions also require teams of 2-4 but state that roster additions/replacements close October 4 and that those Terms prevail over inconsistent promotional material. Use **October 4 as the conservative roster-change cutoff** unless the organizer gives written clarification. Do not confuse the original internal October 3 target with the published prototype submission deadline.

Participants must be 21+, based in JAPAC and eligible working professionals. Students are not eligible. Use Google AI/eligible agentic tooling and deploy a working prototype on Google Cloud/Cloud Run/Firebase. Submission materials are English: proposal PDF, deployed prototype and public three-minute demo. Judging weights are technical/GenAI 40%, problem alignment/impact 25%, innovation 25%, UX/design 10%.

Confirm the exact Retail & Commerce statement in the portal; the themes page has inconsistent generic category examples. Check source-code visibility/access requirements before changing the private repository, and review credentials before any public release.

## Remaining full-product work

Real sales/inventory ingestion driving forecasts, empirical forecasting benchmarks, general question ranking, realistic scenario generation, ADK orchestration, stronger server-authoritative enforcement, broader reliability testing and a real outcome ledger remain unfinished. Do not describe them as completed by this reliability patch.

The client-side Proof Gate is not a trusted server attestation. A malicious user can alter their own demo records. Real purchasing needs server-side authorization and validation.

## Submission assets and completion gate

Earlier documentation reports a proposal deck/PDF prepared; their final files were not re-certified here. `docs/DEMO_VIDEO_SCRIPT.md` and `docs/SUBMISSION_PORTAL_COPY.md` remain starting points and must be reconciled with the v2 behavior and honest claims.

100% complete requires live Gemini proof, PASS/BLOCK proof, verified remote persistence after reload, eligible team, final PDF, tested public video link, completed portal fields, accepted submission and saved confirmation evidence. These final gates remain open.

After submission, tag the accepted commit, save final materials offline and keep the deployment stable through evaluation.
