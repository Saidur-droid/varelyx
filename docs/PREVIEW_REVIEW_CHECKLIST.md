# Premium Workspace Preview Review Checklist

Date: 2026-09-29
Branch: `fix/firebase-verification-20260929`
Production deployment: **NOT AUTHORIZED**
Preview channel target: `premium-workspace`

## Build intent

This preview exists so the product owner can review the competition-facing UI/UX before any production merge or Firebase production deploy.

Core narrative:
**KNOW -> ASK -> DECIDE -> PROVE -> ACT -> Verified Persistence**

## Competition-facing design proof

- [x] GenAI contribution is visible: Gemini structures messy evidence and uncertainty.
- [x] Deterministic logic is visibly separated from Gemini-generated text.
- [x] Evidence Scout surfaces decision-critical missing information.
- [x] Proof Gate presents PASS / HOLD / BLOCK with encoded checks.
- [x] Human approval is explicitly separated from AI.
- [x] All impact metrics are labelled controlled simulation.
- [x] No external-order/ERP dispatch claim is made.
- [x] Mobile and keyboard-accessibility contracts are encoded in the stylesheet/tests.
- [x] Privacy-safe analytics adapter is non-blocking and strips raw evidence fields.

## Automated verification status

- Local reconstructed verification mirror on 2026-09-29: **76/76 Node tests passed**, including the 31 reliability tests plus view-model, UI-contract and analytics tests.
- Local Python regression: **13/13 pytest tests passed**.
- All `public/*.js` and `public/*.mjs` passed `node --check`.
- DOM contract scan found no duplicate IDs and no missing IDs referenced by `app.js`.
- CSS parse check found balanced braces and no top-level parser errors.
- TDD red/green cycles were observed for operational state, Command Center, investigation workspace, DECIDE/PROVE, and ACT/Audit contracts.
- Latest hosted GitHub Actions run **36595560628** still fails before reported steps: both `web` and `test` jobs return `steps: null` and no runner. This does **not** establish a test assertion failure.
- The authorized Windows device remains offline, so full exact-checkout verification, live browser QA, Firebase preview deployment, App Check/Auth preview-domain validation, and real Gemini/Firebase end-to-end QA remain required.

## Figma reference

Figma file: https://www.figma.com/design/L96hoZxuZmi4I45jeP6Iqy

The Figma file remains the earlier premium workspace reference. A final sync attempt hit the Figma Starter-plan MCP call limit, so the **GitHub branch is the authoritative latest Decision Command Center design** until the Figma tool quota resets.

## Preview deployment gate

Run only after the authorized machine reconnects:

```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs tests/analytics.test.mjs
pytest -q
for file in public/*.js public/*.mjs; do node --check "$file"; done
npx firebase-tools@latest hosting:channel:deploy premium-workspace --project varelyx-ai-builder-cup
```

Then verify Auth/App Check accepts the returned preview domain. Do not weaken App Check enforcement merely to make the preview work.

## Live review

Preview URL: **PENDING — authorized device offline**
Browser visual QA: **PENDING — local headless Chromium did not complete in this execution environment**
Preview deployed at: **PENDING**
Reviewed by product owner: [ ]
Approved for production: [ ]

Production must remain unchanged until the product owner explicitly approves the preview link.
