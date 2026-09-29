# Premium Decision Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and preview-deploy a premium, judge-ready Varelyx decision workspace that preserves the existing Firebase/Gemini reliability guarantees while making the competition value proposition legible in 60–90 seconds.

**Architecture:** Keep `public/core.mjs`, `public/session.mjs`, and `public/firebase-transport.mjs` as the reliability core. Move presentation-only state mapping into focused UI modules, rebuild the application shell around Command Center → Evidence → Scenarios → Proof → Actions → Audit, and instrument non-blocking analytics behind an isolated adapter. Deploy first to a Firebase Hosting preview channel; production is untouched until explicit approval.

**Tech Stack:** Firebase Hosting, Firebase Anonymous Auth, Firebase App Check, Firebase AI Logic/Gemini, Firebase Realtime Database, vanilla ES modules, CSS, Node 22 test runner.

**Spec:** `docs/superpowers/specs/2026-09-29-premium-decision-workspace-design.md`

## Global Constraints

- Primary runtime remains Google Cloud / Firebase.
- Gemini remains the primary GenAI integration; Antigravity is optional, not required.
- The product must remain a working prototype, not a mockup-only submission.
- Do not introduce a competing-cloud dependency as the primary runtime.
- Do not claim real retailer/customer/revenue outcomes without evidence.
- Do not imply sandbox actions were sent to suppliers or ERP systems.
- Do not describe the current client-side Proof Gate as server-authoritative procurement control.
- Analytics must never block the judge flow and must not capture raw supplier evidence by default.
- Existing reliability semantics stay intact: stale evidence invalidates proof; Gemini does not own executable quantities; Firebase save is successful only after verified remote read-back.
- Production must not be overwritten before the user approves a Firebase Hosting preview.
- UI copy must remain submission-safe: simulated metrics are labelled **Controlled simulation**.

## Review Focus

- **Edited evidence after PASS:** existing proof becomes visibly stale and approval is blocked; Task 2 adds a UI-state test.
- **Firebase save/read-back failure:** global status must show NOT VERIFIED with recovery guidance; Task 3 adds the rendering test.
- **Small-screen flow at 390px width:** no horizontal scroll and primary actions remain reachable; Task 5 adds static/layout checks plus manual QA.
- **Color-independent state communication:** PASS/HOLD/BLOCK and connection states include text/icon/labels, not color only; Task 4 adds DOM assertions.
- **Analytics outage or unconfigured analytics:** core flow still completes without thrown errors; Task 6 adds adapter failure tests.

---

### Task 1: Freeze the reliability baseline and visual preview target

**Files:**
- Modify: `tests/web.test.mjs`
- Create: `tests/ui-contract.test.mjs`
- Modify: `PROJECT_HANDOFF.md`

**Interfaces:**
- Consumes: existing exports from `public/core.mjs`, `public/session.mjs`, `public/firebase-transport.mjs`.
- Produces: regression contract that later UI work must preserve.

- [ ] **Step 1: Add failing UI contract tests**

Add tests asserting the future document includes stable anchors:
`#appShell`, `#commandCenter`, `#evidenceWorkspace`, `#scenarioWorkspace`, `#proofWorkspace`, `#actionWorkspace`, `#auditWorkspace`, and `#systemStatusBar`.

- [ ] **Step 2: Run the new contract test and verify it fails**

Run: `node --test tests/ui-contract.test.mjs`

Expected: FAIL because the premium shell anchors do not exist yet.

- [ ] **Step 3: Re-run the existing reliability suite before UI work**

Run: `node --test tests/web.test.mjs`

Expected: 31 existing tests PASS.

- [ ] **Step 4: Update handoff with redesign branch intent**

Record that production remains unchanged, the redesign will ship to a preview channel first, and no live compliance claim is made by the UI work itself.

- [ ] **Step 5: Commit**

```bash
git add tests/ui-contract.test.mjs tests/web.test.mjs PROJECT_HANDOFF.md
git commit -m "test: lock premium workspace regression contract"
```

---

### Task 2: Extract presentation state from business logic

**Files:**
- Create: `public/ui-state.mjs`
- Create: `tests/ui-state.test.mjs`
- Modify: `public/app.js`

**Interfaces:**
- Consumes: `issues(state)`, `plansFor(state)`, `nextQuestion(state)` from `public/core.mjs`.
- Produces:
  - `buildViewModel(state, draftSource: string, connected: boolean, saveState: object | null) -> object`
  - `getStageState(viewModel) -> {signal,evidence,decision,proof,action}`
  - `getPrimaryAction(viewModel) -> {id,label,disabled,reason}`

- [ ] **Step 1: Write failing view-model tests**

Cover:
- fresh session → Signal active, Gemini not run;
- verified extraction but not reviewed → Evidence active / HOLD;
- reviewed evidence → Decision ready;
- proof PASS → Proof completed / Action active;
- edited evidence after PASS → proof stale, approval disabled.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test tests/ui-state.test.mjs`

Expected: FAIL because `public/ui-state.mjs` is absent.

- [ ] **Step 3: Implement the view-model API**

Keep copy decisions here, not calculation logic. No DOM access in this module.

- [ ] **Step 4: Refactor `public/app.js` to consume the view model**

Preserve all existing Firebase/Gemini/save behavior; change only presentation-state derivation.

- [ ] **Step 5: Run reliability + UI-state tests**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public/ui-state.mjs public/app.js tests/ui-state.test.mjs
git commit -m "refactor: isolate decision workspace presentation state"
```

---

### Task 3: Build the premium application shell and command center

**Files:**
- Modify: `public/index.html`
- Modify: `public/styles.css`
- Modify: `public/app.js`
- Modify: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: `buildViewModel(...)` and `getPrimaryAction(...)` from Task 2.
- Produces: stable DOM regions and semantic status components used by Tasks 4–7.

- [ ] **Step 1: Expand failing DOM contract tests**

Assert:
- application shell/nav anchors;
- five-stage decision rail;
- top system status bar;
- one primary command-center CTA region;
- four controlled-simulation impact metrics;
- persistent status/error region with `aria-live`.

- [ ] **Step 2: Run contract test and verify failure**

Run: `node --test tests/ui-contract.test.mjs`

Expected: FAIL on missing premium shell elements.

- [ ] **Step 3: Rebuild `public/index.html`**

Create:
- sidebar navigation;
- top system status bar;
- Command Center;
- decision-stage rail;
- impact strip;
- section anchors for Evidence, Scenarios, Proof, Actions, Audit.

Keep all existing input/button IDs required by behavior unless corresponding code/tests are deliberately migrated in the same step.

- [ ] **Step 4: Rebuild base styling in `public/styles.css`**

Lock:
- dark neutral foundation;
- warm off-white typography;
- emerald=confirmed/pass;
- amber=hold/uncertain;
- red=block/destructive;
- indigo/blue only for Gemini identity;
- visible keyboard focus;
- desktop and mobile grids;
- restrained animation honoring `prefers-reduced-motion`.

- [ ] **Step 5: Update rendering in `public/app.js`**

Render Command Center and global status from the view model. Save/read-back failure must visibly show `SAVE NOT VERIFIED` and the recovery action.

- [ ] **Step 6: Run tests**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/index.html public/styles.css public/app.js tests/ui-contract.test.mjs
git commit -m "feat: build premium decision command center"
```

---

### Task 4: Redesign Evidence, Scenario, and Proof Gate workspaces

**Files:**
- Modify: `public/index.html`
- Modify: `public/styles.css`
- Modify: `public/app.js`
- Modify: `tests/ui-contract.test.mjs`
- Modify: `tests/ui-state.test.mjs`

**Interfaces:**
- Consumes: Task 2 view model; existing `prove()`, `unsafePlan()`, `plansFor()`.
- Produces: accessible Evidence Scout, comparison hierarchy, and Proof Gate presentation.

- [ ] **Step 1: Add failing evidence/proof UI tests**

Assert rendered markup/copy supports:
- Confirmed / Estimated / Unknown groups;
- source quote + confidence for extracted facts;
- one elevated decision-critical question card;
- “Controlled simulation” labels;
- “Balanced demo candidate” wording instead of “best”;
- PASS/HOLD/BLOCK text labels;
- constraint rows containing rule, observed value, result;
- receipt disclaimer.

- [ ] **Step 2: Run tests and verify failure**

Run:
```bash
node --test tests/ui-contract.test.mjs tests/ui-state.test.mjs
```

Expected: FAIL on new presentation requirements.

- [ ] **Step 3: Implement Evidence workspace**

Render each fact with status, provenance, quote, confidence, and review state. Elevate the current `nextQuestion()` result into the Evidence Scout card.

- [ ] **Step 4: Implement Scenario workspace**

Make Balanced the selected demo candidate visually, not an AI-declared winner. Show alternatives compactly and provide a direct comparison table.

- [ ] **Step 5: Implement Proof Gate workspace**

Make PASS/HOLD/BLOCK memorable, show each constraint and observed value, keep unsafe proposal as an explicit secondary demonstration, and expose copy/export receipt controls.

- [ ] **Step 6: Verify color-independent accessibility**

DOM test must find visible PASS/HOLD/BLOCK text and descriptive labels independent of CSS classes.

- [ ] **Step 7: Run all Node tests**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add public/index.html public/styles.css public/app.js tests/ui-contract.test.mjs tests/ui-state.test.mjs
git commit -m "feat: redesign evidence scenarios and proof gate"
```

---

### Task 5: Redesign Action Center, Shadow Mode, audit trail, and responsive behavior

**Files:**
- Modify: `public/index.html`
- Modify: `public/styles.css`
- Modify: `public/app.js`
- Modify: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: state actions, audit entries, proof receipt, save verification metadata.
- Produces: human-approval boundary, audit timeline, controlled impact comparison, responsive/mobile shell.

- [ ] **Step 1: Add failing UI tests**

Assert:
- “Human approval required” appears before approval;
- action status says `APPROVED_SANDBOX`;
- no copy implies external supplier/ERP dispatch;
- Shadow Mode always includes “Controlled simulation. Not observed retailer outcomes.”;
- audit region exposes the ordered event timeline;
- mobile stylesheet contains no fixed-width layout that forces >390px content width;
- focus-visible style exists.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test tests/ui-contract.test.mjs`

Expected: FAIL until new sections/copy exist.

- [ ] **Step 3: Implement Action Center**

Add an approval summary dialog before calling the existing approval path. Keep action generation behavior unchanged.

- [ ] **Step 4: Implement Shadow Mode and audit timeline**

Use the same-scenario baseline and balanced output. Render audit entries chronologically with revision/receipt metadata where available.

- [ ] **Step 5: Implement responsive behavior**

Validate at CSS level for:
- 1440×900;
- 1280×720;
- 390×844;
and ensure mobile preserves the five-stage narrative as a vertical rail.

- [ ] **Step 6: Run full Node tests**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/index.html public/styles.css public/app.js tests/ui-contract.test.mjs
git commit -m "feat: finish approval audit and responsive experience"
```

---

### Task 6: Add non-blocking product analytics instrumentation

**Files:**
- Create: `public/analytics.mjs`
- Create: `tests/analytics.test.mjs`
- Modify: `public/app.js`
- Modify: `public/firebase-config.js` only if a safe public analytics configuration field is needed

**Interfaces:**
- Produces:
  - `createAnalyticsAdapter(config?) -> {capture(name: string, properties?: object): void}`
  - no-op behavior when analytics is absent/unavailable.
- Consumes: only sanitized event metadata; never raw supplier evidence by default.

- [ ] **Step 1: Write failing analytics adapter tests**

Assert:
- unconfigured adapter never throws;
- provider failure is swallowed/logged without blocking app flow;
- raw `source` / supplier-message text is rejected or stripped from event properties;
- approved event names can be emitted.

- [ ] **Step 2: Run and verify failure**

Run: `node --test tests/analytics.test.mjs`

Expected: FAIL because adapter does not exist.

- [ ] **Step 3: Implement the adapter**

Instrument:
`demo_session_started`, `firebase_connected`, `gemini_analysis_started`, `gemini_analysis_verified`, `evidence_reviewed`, `decision_ready`, `proof_passed`, `proof_blocked`, `approval_attempted`, `save_verified`, `save_failed`, `reload_restore_verified`, `shadow_mode_viewed`.

If PostHog is not configured, keep no-op mode. Do not add a hard dependency to the judge flow.

- [ ] **Step 4: Wire lifecycle events in `public/app.js`**

Capture only event names and safe categorical/numeric metadata.

- [ ] **Step 5: Run tests**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs tests/analytics.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public/analytics.mjs public/app.js tests/analytics.test.mjs public/firebase-config.js
git commit -m "feat: add privacy-safe nonblocking product analytics"
```

---

### Task 7: Add preview/release QA checklist and deploy a Firebase Hosting preview

**Files:**
- Modify: `docs/FINAL_LIVE_QA.md`
- Create: `docs/PREVIEW_REVIEW_CHECKLIST.md`
- Modify: `PROJECT_HANDOFF.md`

**Interfaces:**
- Consumes: completed UI and existing Firebase project `varelyx-ai-builder-cup`.
- Produces: preview URL and evidence checklist. Production remains untouched.

- [ ] **Step 1: Run all automated tests**

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

- [ ] **Step 3: Update live QA checklist**

Require this exact sequence:
Firebase verified → Gemini live → evidence reviewed → capacity 120 → balanced PASS → unsafe BLOCK → return to verified candidate → human approval → SAVE VERIFIED → reload → server-restored state.

- [ ] **Step 4: Deploy preview channel from an authorized Firebase session**

Run:
```bash
npx firebase-tools@latest hosting:channel:deploy premium-workspace --project varelyx-ai-builder-cup
```

Expected: Firebase returns a preview URL. Do **not** run production `firebase deploy`.

- [ ] **Step 5: Configure/verify preview-domain prerequisites**

Verify Firebase Auth/App Check allow the preview domain. If not, stop and record the blocker rather than weakening production protection.

- [ ] **Step 6: Manual browser QA**

Check:
- 1440×900;
- 1280×720;
- 390×844;
- keyboard-only core flow;
- visible focus;
- PASS/HOLD/BLOCK labels;
- failure states;
- refresh restore;
- concurrent-tab conflict behavior.

- [ ] **Step 7: Capture authentic preview evidence**

Capture screenshots only from the actually deployed preview. Record preview URL and timestamp in `docs/PREVIEW_REVIEW_CHECKLIST.md`.

- [ ] **Step 8: Update handoff**

Mark redesign as **preview-ready**, not production-ready, and leave production approval gate open.

- [ ] **Step 9: Commit documentation**

```bash
git add docs/FINAL_LIVE_QA.md docs/PREVIEW_REVIEW_CHECKLIST.md PROJECT_HANDOFF.md
git commit -m "docs: add premium workspace preview release gate"
```

---

### Task 8: Whole-branch review and user approval gate

**Files:**
- Modify only if review finds defects.

**Interfaces:**
- Consumes: complete redesign branch and preview QA evidence.
- Produces: reviewed branch plus live preview URL for user decision.

- [ ] **Step 1: Perform whole-branch code review**

Focus on:
- reliability regressions;
- misleading competition claims;
- inaccessible state communication;
- accidental analytics PII/raw evidence;
- preview vs production separation.

- [ ] **Step 2: Fix review findings with targeted tests**

Every behavioral fix must add or update a test before implementation.

- [ ] **Step 3: Re-run full verification**

Run:
```bash
node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs tests/analytics.test.mjs
pytest -q
```

Expected: PASS.

- [ ] **Step 4: Present the Firebase preview URL to the user**

No production deploy or merge before explicit user approval of the preview.

- [ ] **Step 5: After approval only, prepare the production merge/release as a separate task**

Production release must remain a distinct decision because it changes the live competition artifact.
