# Decision Command Center UI/UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing Varelyx premium workspace into a distinctive, competitor-informed **Decision Command Center** that makes KNOW -> ASK -> DECIDE -> PROVE -> ACT immediately legible while preserving all Firebase/Gemini reliability guarantees.

**Architecture:** Keep `public/core.mjs`, `public/session.mjs`, and `public/firebase-transport.mjs` as the decision/persistence core. Evolve `public/ui-state.mjs` into the source of presentation state, restructure `public/index.html` and `public/styles.css` around an operational command-center hierarchy, and keep `public/app.js` as orchestration/rendering glue. No competitor layout or proprietary interaction is copied; the design synthesizes generic enterprise UX principles around Varelyx-specific evidence uncertainty, Proof Gate, and verified persistence.

**Tech Stack:** Firebase Hosting, Firebase Anonymous Auth, Firebase App Check, Firebase AI Logic/Gemini, Firebase Realtime Database, vanilla ES modules, CSS, Node 22 test runner.

**Spec:** `docs/superpowers/specs/2026-09-29-premium-decision-workspace-design.md`

## Global Constraints

- Primary runtime remains Google Cloud / Firebase.
- Gemini remains the primary GenAI integration.
- Antigravity is optional, not required.
- The product must remain a working prototype, not a mockup-only submission.
- Do not introduce a competing-cloud dependency that becomes the primary runtime.
- No real retailer/customer/revenue claims without evidence.
- No claim that sandbox actions were sent to suppliers or ERP systems.
- No claim that current client-side Proof Gate is a server-authoritative purchasing control.
- Analytics must not become a critical runtime dependency.
- Simulated impact values must remain labelled **Controlled simulation**.
- The design must not reproduce any competitor's page structure, branded interaction, wording, illustration, chart, or component arrangement one-for-one.
- Varelyx's own product sequence is **KNOW -> ASK -> DECIDE -> PROVE -> ACT**.
- Production remains untouched until a Firebase Hosting preview is reviewed and explicitly approved by the user.

## File Structure

- `public/index.html` — semantic application shell and stable interaction anchors.
- `public/styles.css` — Varelyx visual system, layout, responsiveness, state styling.
- `public/ui-state.mjs` — presentation-only derived state: incident summary, unresolved evidence count, decision state, next action, stage status.
- `public/app.js` — Firebase/Gemini orchestration plus DOM rendering from view-model data.
- `public/analytics.mjs` — existing non-blocking, privacy-safe telemetry adapter.
- `tests/ui-state.test.mjs` — view-model and stale-state behavior.
- `tests/ui-contract.test.mjs` — semantic HTML/accessibility/design contract.
- `tests/web.test.mjs` — existing deterministic decision and persistence reliability.
- `tests/analytics.test.mjs` — existing analytics safety.
- `docs/PREVIEW_REVIEW_CHECKLIST.md` — preview acceptance evidence.

## Review Focus

- Edited supplier evidence after a PASS must immediately present proof as stale and remove approval as the next action.
- Disconnected or failed Firebase state must not visually imply the workspace is safe to approve or saved.
- Very long evidence text / proof receipt / constraint detail must wrap or scroll locally without breaking the 390px viewport.
- Unknown or partially extracted evidence must remain visibly Unknown/HOLD instead of silently appearing confirmed.
- A competitor-inspired visual enhancement must not remove or obscure Varelyx's original KNOW -> ASK -> DECIDE -> PROVE -> ACT hierarchy.

---

### Task 1: Make the view model operational, not dashboard-oriented

**Files:**
- Modify: `public/ui-state.mjs`
- Modify: `tests/ui-state.test.mjs`

**Interfaces:**
- Consumes: `issues(state)`, `plansFor(state)`, `nextQuestion(state)`.
- Produces:
  - `buildViewModel(state, draftSource, connected, saveState)`
  - `getStageState(viewModel)`
  - `getPrimaryAction(viewModel)`
  - new fields: `incident`, `unresolvedEvidenceCount`, `decisionState`, `nextAction`, `proofFreshness`.

- [ ] **Step 1: Write failing tests**

Add tests asserting:
- fresh state reports an incident status of `UNANALYZED`;
- analyzed but unreviewed state reports unresolved evidence > 0;
- reviewed state reports `READY_FOR_PROOF`;
- PASS reports `READY_FOR_HUMAN_APPROVAL`;
- edited source after PASS reports `STALE_PROOF` and primary action `analyze`;
- disconnected Firebase keeps primary action disabled.

- [ ] **Step 2: Run the view-model tests**

Run: `node --test tests/ui-state.test.mjs`

Expected: FAIL on the new fields/statuses.

- [ ] **Step 3: Implement the presentation fields**

Keep all business calculations in `core.mjs`; only derive labels/counts/statuses here.

- [ ] **Step 4: Run the tests again**

Run: `node --test tests/ui-state.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/ui-state.mjs tests/ui-state.test.mjs
git commit -m "refactor: add operational command center view state"
```

---

### Task 2: Replace the marketing-style opening with the operational Command Center

**Files:**
- Modify: `public/index.html`
- Modify: `public/styles.css`
- Modify: `public/app.js`
- Modify: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1 view-model fields.
- Produces stable regions:
  - `#incidentCommand`
  - `#decisionStateCard`
  - `#nextActionCard`
  - existing `#systemStatusBar`
  - existing stage rail.

- [ ] **Step 1: Add failing DOM contract tests**

Assert the opening viewport contains:
- active incident statement;
- unresolved evidence count;
- decision state;
- next-best-action region;
- stockout exposure;
- system status;
- KNOW / ASK / DECIDE / PROVE / ACT labels;
- no giant marketing-only hero dependency.

- [ ] **Step 2: Run contract tests**

Run: `node --test tests/ui-contract.test.mjs`

Expected: FAIL on the new command-center anchors/copy.

- [ ] **Step 3: Rebuild the opening HTML**

Use an operations-first two-zone layout:
- left: incident, risk, next action;
- right: decision state and system confidence.
Keep Analyze/Reset behavior IDs stable.

- [ ] **Step 4: Update `app.js` rendering**

Populate incident severity/status from view-model state without inventing unverified claims.

- [ ] **Step 5: Rework CSS**

Use fewer, stronger zones; compact operational hierarchy; no decorative orb dependency; large typography only for incident/proof outcomes.

- [ ] **Step 6: Run tests**

Run:
```bash
node --test tests/ui-state.test.mjs tests/ui-contract.test.mjs tests/web.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/index.html public/styles.css public/app.js tests/ui-contract.test.mjs
git commit -m "feat: make command center operations first"
```

---

### Task 3: Turn Signal & Evidence into Varelyx's signature investigation workflow

**Files:**
- Modify: `public/index.html`
- Modify: `public/styles.css`
- Modify: `public/app.js`
- Modify: `tests/ui-contract.test.mjs`
- Modify: `tests/ui-state.test.mjs`

**Interfaces:**
- Consumes: extraction, source quotes, confidence, evidence review, `nextQuestion(state)`.
- Produces:
  - `#signalPanel`
  - `#evidenceMatrix`
  - `#evidenceScout`
  - source/provenance rendering.

- [ ] **Step 1: Add failing tests**

Assert:
- Signal panel and Evidence Matrix exist;
- Confirmed / Estimated / Unknown remain text-labelled;
- quote and confidence placeholders exist;
- Evidence Scout is visibly marked as Varelyx's decision bottleneck;
- unreviewed extraction cannot appear Confirmed;
- stale evidence is visibly labelled Stale.

- [ ] **Step 2: Run tests**

Run:
```bash
node --test tests/ui-contract.test.mjs tests/ui-state.test.mjs
```

Expected: FAIL on new investigation-workspace contracts.

- [ ] **Step 3: Implement Signal & Evidence layout**

Separate:
1. incoming disruption signal;
2. evidence classification;
3. decision-critical missing fact;
4. operator confirmation.

- [ ] **Step 4: Add “why this matters” presentation**

Use sensitivity output already produced by `nextQuestion(state)`; do not invent an opaque AI score.

- [ ] **Step 5: Verify stale transitions**

Editing source text must visibly downgrade prior proof and evidence state.

- [ ] **Step 6: Run full Node tests**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs tests/analytics.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/index.html public/styles.css public/app.js tests/ui-contract.test.mjs tests/ui-state.test.mjs
git commit -m "feat: elevate evidence investigation and scout"
```

---

### Task 4: Upgrade DECIDE and PROVE into a premium decision surface

**Files:**
- Modify: `public/index.html`
- Modify: `public/styles.css`
- Modify: `public/app.js`
- Modify: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: `plansFor(state)`, `prove(plan,state)`, `unsafePlan()`.
- Produces:
  - dense scenario comparison;
  - selected candidate summary;
  - proof-state centerpiece;
  - constraint result rows;
  - receipt controls.

- [ ] **Step 1: Add failing design-contract tests**

Assert:
- Balanced is labelled `Balanced demo candidate`, never `Best`;
- comparison exposes cash, transfer, supplier, emergency, stockout and robustness;
- PASS/HOLD/BLOCK are visible as text;
- Proof Gate includes rule + observed result;
- receipt disclaimer remains visible;
- unsafe proposal remains secondary and destructive.

- [ ] **Step 2: Run contract tests**

Run: `node --test tests/ui-contract.test.mjs`

Expected: FAIL on the upgraded structure.

- [ ] **Step 3: Implement DECIDE hierarchy**

Use one selected candidate summary + compact alternatives + comparison table. Avoid equal-card dashboard clutter.

- [ ] **Step 4: Implement PROVE hierarchy**

Make Proof Gate visually dominant:
- outcome;
- constraint matrix;
- proof freshness;
- receipt;
- next action.

- [ ] **Step 5: Harden long-content layout**

Receipt hashes and constraint details must wrap or scroll locally without page overflow.

- [ ] **Step 6: Run tests**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/index.html public/styles.css public/app.js tests/ui-contract.test.mjs
git commit -m "feat: refine decision comparison and proof gate"
```

---

### Task 5: Finish ACT, Shadow Mode, audit, and responsive enterprise polish

**Files:**
- Modify: `public/index.html`
- Modify: `public/styles.css`
- Modify: `public/app.js`
- Modify: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: proof, actions, audit events, save verification.
- Produces:
  - explicit human approval summary;
  - sandbox action ledger;
  - Shadow Mode;
  - chronological audit trail;
  - responsive/mobile command-center layout.

- [ ] **Step 1: Add failing UI tests**

Assert:
- AI and human approval are visually/textually separated;
- `APPROVED_SANDBOX` stays visible;
- no external dispatch claim exists;
- Shadow Mode includes exact controlled-simulation disclaimer;
- audit trail includes evidence -> proof -> approval -> persistence stages;
- CSS includes 390px rules, focus-visible, reduced-motion;
- long content is contained locally.

- [ ] **Step 2: Run tests**

Run: `node --test tests/ui-contract.test.mjs`

Expected: FAIL until the final ACT/polish structure exists.

- [ ] **Step 3: Implement human approval summary**

Before approval, summarize candidate quantities, cash, simulation scope, and sandbox-only effect.

- [ ] **Step 4: Refine Shadow Mode and audit**

Use same-scenario comparison only; no invented ROI.

- [ ] **Step 5: Finish responsive behavior**

Targets:
- 1440x900;
- 1280x720;
- 390x844.
Allow only local comparison-table horizontal scrolling.

- [ ] **Step 6: Run full Node tests**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs tests/analytics.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/index.html public/styles.css public/app.js tests/ui-contract.test.mjs
git commit -m "feat: complete decision command center experience"
```

---

### Task 6: Verify, preview-deploy, and review the redesigned workspace

**Files:**
- Modify: `docs/PREVIEW_REVIEW_CHECKLIST.md`
- Modify: `docs/FINAL_LIVE_QA.md`
- Modify: `PROJECT_HANDOFF.md`

**Interfaces:**
- Consumes: complete redesign branch.
- Produces: verified preview URL and release evidence. Production remains untouched.

- [ ] **Step 1: Run all automated tests on the exact branch**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs tests/analytics.test.mjs
pytest -q
```

Expected: all tests PASS.

- [ ] **Step 2: Run syntax checks**

Run:
```bash
for file in public/*.js public/*.mjs; do node --check "$file"; done
```

Expected: no syntax errors.

- [ ] **Step 3: Perform browser QA**

Check the real app at:
- 1440x900;
- 1280x720;
- 390x844;
- keyboard-only flow;
- failure/read-back/stale-proof states.

- [ ] **Step 4: Deploy only the Firebase preview channel**

Run:
```bash
npx firebase-tools@latest hosting:channel:deploy premium-workspace --project varelyx-ai-builder-cup
```

Expected: Firebase returns a preview URL.

Do not run production `firebase deploy`.

- [ ] **Step 5: Run live Firebase/Gemini judge flow**

Firebase verified -> live Gemini -> evidence review -> capacity 120 -> scenario recompute -> balanced PASS -> unsafe BLOCK -> restore balanced PASS -> human approval -> SAVE VERIFIED -> refresh -> remote restore.

- [ ] **Step 6: Capture evidence and update docs**

Record preview URL, timestamp, viewport QA, and any remaining limitations.

- [ ] **Step 7: Whole-branch review**

Review specifically for:
- reliability regressions;
- misleading claims;
- competitor imitation;
- inaccessible state communication;
- analytics leakage;
- preview/production separation.

- [ ] **Step 8: Present preview URL to the user**

No production merge/deploy until explicit approval.

- [ ] **Step 9: Commit QA evidence**

```bash
git add docs/PREVIEW_REVIEW_CHECKLIST.md docs/FINAL_LIVE_QA.md PROJECT_HANDOFF.md
git commit -m "docs: record decision command center preview verification"
```
