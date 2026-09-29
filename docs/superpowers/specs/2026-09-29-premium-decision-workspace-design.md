# Varelyx Premium Decision Workspace — Product & UX Design Spec

Date: 2026-09-29
Branch: fix/firebase-verification-20260929
Status: Design specification for review before implementation

## 1. Purpose

Turn Varelyx from a technically credible demo into a premium, judge-ready retail decision workspace that can also become a commercial product after the AI Builder Cup.

The product must make its value understandable within 60–90 seconds:

**Signal -> Missing Evidence -> Decision -> Proof -> Human Approval -> Verified Persistence**

Varelyx must not present itself as a generic AI dashboard or forecasting clone. Its differentiated promise is:

> When evidence is incomplete, Varelyx shows what is known, what is uncertain, asks for the fact most likely to change the decision, computes operational quantities deterministically, proves encoded constraints, and requires human approval before persisting sandbox actions.

## 2. Competition alignment

The UI and demo must visibly support the published judging rubric:

### Technical Merit & GenAI Implementation — 40%
The product must visibly prove:
- Live Gemini analysis rather than decorative AI copy.
- Structured evidence extraction.
- Grounded source evidence and uncertainty.
- Human evidence review before executable decisions.
- Deterministic planning logic separate from Gemini.
- Proof Gate PASS / HOLD / BLOCK.
- Firebase App Check / authenticated persistence status.
- Verified Firebase read-back after writes.
- Receipt-linked sandbox actions.

### Problem Alignment & Impact — 25%
The workspace must make the retailer problem obvious:
- Supplier disruption.
- Stockout exposure.
- Limited supplier capacity.
- Route constraints.
- Cash trade-offs.
- Actionable continuity response.

Impact numbers must remain labelled **controlled simulation**, never observed customer outcomes.

### Innovation & Creativity — 25%
The interface must spotlight the differentiators:
- Known / Estimated / Unknown evidence separation.
- Decision-critical next question.
- Evidence changes invalidating stale proofs.
- Proof Gate that can explicitly block unsafe plans.
- Verifiable decision receipt.
- Human-in-the-loop approval.
- Shadow Mode comparison.

### User Experience & Solution Design — 10%
The product must:
- Be understandable without reading documentation.
- Use progressive disclosure instead of a long technical page.
- Show system state and next action clearly.
- Work on laptop and mobile.
- Meet accessible contrast and keyboard/focus expectations.
- Never hide failure states behind console-only messages.

## 3. Competition guardrails

- Primary runtime remains Google Cloud / Firebase.
- Gemini remains the primary GenAI integration.
- Antigravity is optional, not required.
- The product must remain a working prototype, not a mockup-only submission.
- The design must not introduce a competing-cloud dependency that becomes the primary runtime.
- No real retailer/customer/revenue claims without evidence.
- No claim that sandbox actions were sent to suppliers or ERP systems.
- No claim that current client-side Proof Gate is a server-authoritative purchasing control.
- Any new analytics must not become a critical runtime dependency for the judge flow.
- The final submission must eventually satisfy the separate public-repository, team eligibility, live URL, deck and sub-three-minute video requirements before release/submission.

## 4. Product experience principles

### 4.1 Decision-first, not dashboard-first
The first screen answers:
1. What changed?
2. What do we know?
3. What is missing?
4. What decision is being considered?
5. Can it be proven safe?
6. What happens after approval?

### 4.2 Confidence is visible
Uncertainty is never buried. Every material fact has one of:
- Confirmed
- Estimated
- Unknown
- Stale

### 4.3 AI is useful but bounded
Gemini structures messy text, identifies evidence and supports the question-selection workflow.
Gemini does not invent executable order quantities.
Deterministic logic owns operational quantities and hard constraints.

### 4.4 Every action has provenance
Important decisions expose:
- evidence source
- reviewed state
- strategy
- checks
- receipt hash
- save verification
- timestamp

## 5. Information architecture

The current single long page becomes a focused application shell.

### Global shell
Left navigation:
- Command Center
- Evidence
- Scenarios
- Proof Gate
- Actions
- Audit

Top bar:
- Varelyx logo
- Scenario name
- Firebase status
- Gemini status
- Evidence status
- Save status
- Reset / Export

Primary status indicators:
- Firebase Verified / Not Verified
- Gemini Live / Not Run / Failed
- Evidence Reviewed / Review Required
- Proof PASS / HOLD / BLOCK
- Save Verified / Not Verified

## 6. Hero screen — Command Center

### Header
Eyebrow: Retail Continuity Decision Workspace

Headline:
**Turn disruption into a decision you can prove.**

Supporting copy:
Gemini structures messy supplier evidence. Varelyx exposes uncertainty, asks for decision-changing facts, computes feasible responses and blocks plans that violate encoded constraints.

Primary CTA:
**Analyze disruption**

Secondary CTA:
**View demo flow**

### Decision timeline
A horizontal five-stage rail:
1. Signal
2. Evidence
3. Decision
4. Proof
5. Action

Each stage visibly changes state:
- waiting
- active
- completed
- blocked

### Executive impact strip
Four cards:
- Stockout exposure
- Confirmed supplier capacity
- Expected stockout under balanced plan
- Robustness

All simulated values carry a small “Controlled simulation” label.

## 7. Evidence workspace

Three-column evidence board:

### Confirmed
Facts explicitly reviewed by the operator.

### Estimated
Facts extracted by Gemini but not yet operator-confirmed.

### Unknown
Decision-critical missing information.

Each evidence item contains:
- fact name
- value
- source quote
- confidence
- status
- provenance

### Evidence Scout
The highest-value missing question is elevated as a single card:
**What maximum number of cases can Supplier B deliver by Thursday?**

Show:
- why this matters
- sensitivity result
- assumption disclosure
- answer input
- review/confirm action

Do not show a fake “AI score” without explanation.

## 8. Scenario workspace

Replace four dense equal cards with a comparison hierarchy:

### Primary recommendation card
Balanced robust strategy gets the visual emphasis because it is the controlled demo’s hero candidate, not because AI selected it arbitrarily.

Shows:
- Transfer cases
- Supplier B cases
- Emergency cases
- Cash required
- Expected stockout
- Robustness
- constraint summary

CTA:
**Send to Proof Gate**

### Alternatives
Compact comparison cards:
- Current response
- Cheapest feasible
- Maximum availability

A comparison table allows direct side-by-side trade-offs.

No false “best” wording. Use “Balanced demo candidate” or “Selected for proof”.

## 9. Proof Gate

This is the product’s signature screen.

### Proof result header
Large state:
- PASS
- HOLD
- BLOCK

### Constraint checklist
Each check shows:
- constraint
- expected rule
- observed value
- result

Example:
Supplier capacity
120 <= 120 confirmed
PASS

### Unsafe proposal demo
A secondary destructive test:
**Test unsafe proposal**

The UI must make the resulting BLOCK visually memorable without feeling like an error page.

### Decision receipt
After proof:
- SHA-256 receipt
- evidence revision
- strategy ID
- timestamp
- copy receipt
- export proof JSON

Explain:
“Receipt binds the current controlled evidence, plan and checks. It is not a blockchain attestation or server-authoritative procurement approval.”

## 10. Action Center

Human approval is visually separate from AI and Proof Gate.

Before approval:
**Human approval required**

Approval CTA:
**Approve sandbox actions**

Confirmation modal summarizes:
- selected strategy
- total cash
- actions to be recorded
- simulation disclaimer

After verified Firebase persistence:
- TRANSFER ORDER — Sandbox approved
- PURCHASE ORDER DRAFT — Sandbox approved
- SUPPLIER ESCALATION — Sandbox approved
- MANAGER TASK — Sandbox approved

Global banner only shows **SAVE VERIFIED** after remote read-back matches the write.

## 11. Shadow Mode

Use an elegant before/after visualization:
- Current response
- Varelyx balanced response

Show expected stockout under the same fixed scenario set.

Always show:
“Controlled simulation. Not observed retailer outcomes.”

Do not overstate ROI.

## 12. Audit timeline

A compact timeline makes technical rigor legible:
- Firebase session established
- Live Gemini evidence extracted
- Operator reviewed evidence
- Strategy recomputed
- Proof generated
- Human approval recorded
- Firebase save verified

Every event includes time and relevant receipt/revision where available.

## 13. Visual direction

Premium enterprise decision-intelligence aesthetic:
- Dark neutral foundation rather than neon-heavy sci-fi.
- Warm off-white text.
- Emerald used only for confirmed/pass states.
- Amber for uncertainty/hold.
- Red reserved for block/destructive tests.
- One subtle blue/indigo accent for Gemini/AI identity.
- Spacious grid, strong typography, restrained borders.
- Minimal gradients.
- Data should feel trustworthy, not decorative.

Avoid:
- excessive glassmorphism
- glowing “AI” gimmicks
- too many cards
- giant empty hero areas
- dashboard clutter
- colorful charts with no decision purpose

## 14. Interaction details

- Command Center shows one clear next action at a time.
- Button labels describe outcomes, not generic verbs.
- Loading states explain what is happening.
- Errors are visible inline and persistent enough to act on.
- Edited supplier evidence immediately marks prior proof stale.
- A stale plan can never appear approved.
- Focus states must be visible.
- Keyboard navigation must cover the complete judge flow.
- Mobile stacks into a single decision timeline; status chips remain visible.

## 15. Judge demo choreography

Target: 60–90 seconds for core value, under 3 minutes total submission video.

1. Open Command Center: all system statuses visible.
2. Show messy supplier message.
3. Analyze with live Gemini.
4. Evidence moves into Confirmed / Estimated / Unknown.
5. Evidence Scout surfaces the missing Supplier B capacity.
6. Confirm 120 cases.
7. Scenario workspace recomputes.
8. Send balanced candidate to Proof Gate -> PASS.
9. Test unsafe proposal -> BLOCK.
10. Return to verified candidate.
11. Human approves sandbox actions.
12. Show SAVE VERIFIED.
13. Refresh and show server-restored state.
14. Show Shadow Mode and receipt/audit trail.
15. Close with differentiation: uncertainty-aware decisioning, not a generic chatbot.

## 16. Analytics plan

Analytics is observational only and must not block the product.

Recommended events:
- demo_session_started
- firebase_connected
- gemini_analysis_started
- gemini_analysis_verified
- evidence_reviewed
- decision_ready
- proof_passed
- proof_blocked
- approval_attempted
- save_verified
- save_failed
- reload_restore_verified
- shadow_mode_viewed

Primary funnel:
Session -> Gemini Verified -> Evidence Reviewed -> PASS -> Approval -> Save Verified

Do not capture raw supplier evidence in third-party analytics by default.

## 17. Files expected to change during implementation

Likely:
- public/index.html
- public/styles.css
- public/app.js

Possible new focused modules:
- public/ui-state.mjs
- public/analytics.mjs
- public/components or small renderer modules if app.js becomes too large

Existing reliability logic in:
- public/core.mjs
- public/session.mjs
- public/firebase-transport.mjs

must remain logically isolated and should not be weakened to simplify styling.

## 18. Testing and acceptance

### Functional
- Existing 31 Node tests stay passing.
- Add UI-state tests where logic is extracted.
- Live Gemini flow works.
- PASS / HOLD / BLOCK are all demonstrated.
- Unsafe plan cannot be approved.
- Save succeeds only after Firebase read-back verification.
- Reload restores remote state.
- Stale evidence invalidates proof.

### UX
- Core judge flow understandable without README.
- No horizontal scroll at 360px width.
- Key actions usable by keyboard.
- Visible focus treatment.
- No important status communicated by color alone.
- Failure messages explain recovery.

### Visual QA
Review at:
- 1440x900
- 1280x720
- 390x844

### Release gate
The redesign must first deploy to a Firebase Hosting preview channel.
Production must not be overwritten until the user reviews the preview link and explicitly approves it.

## 19. Future-business readiness

The competition UI should already support an evolution path toward:
- multi-location retailers
- multiple supplier disruptions
- saved incidents
- role-based approvals
- ERP/WMS integrations
- server-authoritative policy validation
- real forecasting and outcome ledger
- portfolio-level operational command center

These are future extensions, not claims about the competition prototype.

## 20. Non-goals for this design pass

Do not add now:
- real external purchase-order dispatch
- broad ERP integration
- paid billing changes
- unrelated AI agents
- a competing-cloud runtime
- fake customer logos/testimonials
- invented retailer KPIs
- unnecessary 3D or animation-heavy visuals

The objective is a reliable, elegant, differentiated decision workspace—not feature volume.
