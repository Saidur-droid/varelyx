# Premium Workspace Preview Review Checklist

Date: 2026-09-29
Branch: `fix/firebase-verification-20260929`
Production deployment: **NOT AUTHORIZED**
Preview channel target: `premium-workspace`

## Build intent

This preview exists so the product owner can review the competition-facing UI/UX before any production merge or Firebase production deploy.

Core narrative:
**Signal -> Evidence -> Decision -> Proof -> Human Approval -> Verified Persistence**

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

- Historical reliability baseline before redesign: **31/31 Node tests passed** in the prior implementation session.
- Red/green TDD evidence obtained for the new UI shell, view-model disconnected state, escaped-markup regression, and analytics adapter.
- Current hosted GitHub Actions run still fails before reported steps: both jobs return no runner name / no steps. This does **not** prove a test assertion failure.
- Full exact-branch test execution remains required on an authorized working machine because the connected Windows device is currently offline.

## Figma reference

Figma file: https://www.figma.com/design/L96hoZxuZmi4I45jeP6Iqy

The Figma design includes Command Center, system status, decision stages, metrics, Evidence Scout, Proof Gate, Scenario workspace, Human Approval, sandbox actions, Shadow Mode, and Audit.

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
Preview deployed at: **PENDING**
Reviewed by product owner: [ ]
Approved for production: [ ]

Production must remain unchanged until the product owner explicitly approves the preview link.
