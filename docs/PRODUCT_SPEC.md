# Varelyx Product Specification

## Product category

Evidence-driven retail continuity and decision intelligence.

## Core job to be done

When a retail operating plan is invalidated by changing conditions, Varelyx should determine what matters, identify what information is missing, acquire or request the highest-value evidence, simulate plausible futures, compute the best feasible response, prove that response against hard rules, and prepare real execution objects.

## Signature workflow

### 1. Intake
Inputs may include:
- sales CSV;
- inventory CSV;
- supplier PDFs;
- text messages;
- Bangla/English voice notes;
- event/disruption notices;
- working-capital and policy constraints.

### 2. Evidence classification
Every important fact is classified as:
- **Known** — directly observed or confirmed;
- **Estimated** — model-derived or uncertain range;
- **Unknown** — missing and potentially decision-relevant.

### 3. Evidence Scout
For each material unknown, estimate whether resolving it could change the recommended action or materially reduce business exposure.

Output:
- ranked unknowns;
- highest-value unknown;
- generated Next Best Question;
- estimated decision value of resolving it.

### 4. Continuity Twin
Generate a set of plausible futures from:
- demand uplift ranges;
- supplier recovery or further delay;
- route availability;
- alternate supplier capacity;
- price/working-capital limits;
- observed forecast uncertainty.

The system must show that a plan can be cheap yet fragile, or more expensive yet robust.

### 5. Robust Decision Engine
Candidate actions:
- inter-store transfer;
- replenishment;
- emergency procurement;
- low-priority purchase deferral;
- supplier escalation;
- manager task creation.

Objective should minimize total business loss/cost, including:
- expected lost margin;
- stockout penalty;
- holding cost;
- transfer cost;
- emergency procurement cost;
- waste/expiry exposure.

Constraints:
- cash ceiling;
- supplier capacity;
- MOQ;
- pack size;
- lead time;
- store capacity;
- donor-store safety stock;
- route availability;
- critical SKU floor;
- manager policy.

### 6. Proof Gate
Before an action can proceed, deterministic checks must verify all hard rules.

Output statuses:
- **PASS** — all required checks satisfied;
- **HOLD** — unresolved high-value evidence or approval required;
- **BLOCK** — infeasible or policy-violating plan.

### 7. Decision Receipt
Must capture:
- evidence snapshot;
- evidence sources;
- known/estimated/unknown classification;
- forecast range;
- scenarios tested;
- chosen objective;
- all hard constraints;
- model/tool versions;
- approval identity/state;
- timestamp;
- input/output hash where practical.

### 8. Approval and execution
The competition MVP should create actual backend action objects:
- `TRANSFER_ORDER`;
- `PURCHASE_ORDER_DRAFT`;
- `SUPPLIER_ESCALATION`;
- `MANAGER_TASK`.

Do not pretend these actions hit a real ERP unless an integration actually exists.

## Main screens

### A. Continuity Command Center
Primary cards:
- revenue at risk;
- stockout exposure;
- excess inventory;
- open decisions;
- unresolved high-value evidence;
- AI confidence / scenario robustness.

### B. Evidence Board
Three columns:
- Known;
- Estimated;
- Unknown.

Hero element: **Next Best Question**.

### C. Scenario Room
Shows:
- current plan;
- cheapest feasible plan;
- balanced robust plan;
- maximum-availability plan;
- scenario robustness for each.

### D. Proof Room
Constraint matrix with visible PASS/HOLD/BLOCK results.

### E. Action Center
Approval and generated action objects.

### F. Shadow Mode / Value Ledger
Current system vs Varelyx decision comparison over time.

## Autonomy ladder

- Level 0 — Observe.
- Level 1 — Diagnose.
- Level 2 — Simulate.
- Level 3 — Recommend.
- Level 4 — Proof-Gated Action with human approval.
- Level 5 — Policy-Bounded Autopilot for pre-approved low-risk actions.

Competition MVP should stop at Level 4.

## Hero demo scenario

Network:
- 250 stores;
- 1,200 SKUs;
- 6 suppliers.

Disruption:
- Eid in 6 days;
- 2 routes affected;
- supplier voice note confirms 48h delay;
- supplier capacity unknown;
- additional-spend ceiling fixed.

Expected experience:
1. Gemini extracts structured facts from Bangla voice note.
2. Varelyx shows `DECISION NOT READY`.
3. It identifies Supplier B Thursday capacity as the highest-value unknown.
4. It generates a short focused supplier question.
5. Supplier sandbox replies.
6. Continuity Twin recalculates.
7. Multiple strategies appear.
8. Robust optimizer selects candidate.
9. Proof Gate blocks an infeasible alternative.
10. Human approves the surviving plan.
11. Backend action objects are created.

## Product principles

- Decision-first, not chatbot-first.
- Explain uncertainty instead of hiding it.
- Use Gemini where language/reasoning/orchestration is genuinely needed.
- Use deterministic math for feasibility and quantities.
- Make trust visible in the UX.
- Preserve operator control.
- Every “wow” moment must correspond to a real backend capability.
