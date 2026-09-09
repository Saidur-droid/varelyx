# Varelyx Execution Plan

## Goal

Ship a working Google Cloud prototype that demonstrates the full chain:

**input → structured evidence → uncertainty → forecast → next-best-question → scenarios → constrained optimization → proof receipt → approval → backend action objects**

The project should be built like a real startup MVP, not a disposable hackathon mockup.

## Phase 0 — Foundation

### Tasks
- Create Google Cloud project.
- Configure IAM and service accounts.
- Establish environment-variable/secrets strategy.
- Create Cloud Run deployment skeleton.
- Create BigQuery datasets/tables.
- Create Firestore collections.
- Create Cloud Storage buckets.
- Create Next.js frontend shell.
- Define shared TypeScript/Python schemas for evidence, scenarios, decisions, proof results, actions.

### Exit criteria
- One deploy command produces a live hello-world backend and frontend.
- BigQuery read/write verified.
- Firestore read/write verified.
- Cloud Storage upload verified.

## Phase 1 — Data and state model

### Tables / entities
- stores;
- SKUs;
- suppliers;
- inventory snapshots;
- sales observations;
- supplier commitments;
- routes;
- disruptions;
- policies;
- forecasts;
- scenarios;
- decisions;
- proof checks;
- execution actions;
- outcomes.

### Exit criteria
- Controlled Bangladesh Continuity Twin can load a complete retail state.
- Data provenance identifies which source produced each critical fact.

## Phase 2 — Forecast and risk engine

### Tasks
- Build simple baseline forecast first.
- Add BigQuery ML forecasting path.
- Calculate prediction intervals.
- Detect stockout exposure by store/SKU/time window.
- Add event regressors where justified.
- Add intermittent-demand fallback for sparse series.

### Exit criteria
- Reproducible benchmark against held-out data.
- Forecast response includes range, not just point estimate.
- Risk engine can identify future stockout exposure.

## Phase 3 — Scenario engine

### Tasks
- Define uncertainty variables.
- Generate plausible scenario combinations.
- Support demand uplift ranges.
- Support supplier delay/recovery.
- Support route availability.
- Support alternate supplier capacity.
- Compute plan robustness across scenarios.

### Exit criteria
- At least three clearly distinct strategies can be evaluated under the same scenario set.
- UI/backend can explain “cheap but fragile” vs “more robust.”

## Phase 4 — Robust optimizer

### Tasks
- Define objective function.
- Implement constraints in OR-Tools.
- Support transfers, replenishment, order deferrals.
- Support cash and supplier capacity limits.
- Support MOQ/pack size.
- Support donor safety stock.
- Support route constraints.
- Return infeasibility reasons when possible.

### Exit criteria
- Optimizer never silently violates hard constraints.
- Unit tests cover boundary cases.
- A deliberately impossible plan is rejected.

## Phase 5 — Proof Gate

### Tasks
- Build independent deterministic validator.
- Verify every hard business rule after optimization.
- Return PASS/HOLD/BLOCK.
- Generate Decision Receipt payload.
- Persist proof results and hashes.

### Exit criteria
- Proof result is reproducible from stored inputs.
- Constraint violation target in test suite: zero.
- UI can visibly block a bad plan.

## Phase 6 — Gemini evidence layer

### Tasks
- Ingest supplier text/PDF/audio.
- Extract structured facts with schema validation.
- Classify Known / Estimated / Unknown.
- Detect ambiguity.
- Preserve source references/confidence.
- Support Bangla/English operational inputs.

### Exit criteria
- Demo supplier voice/text becomes valid structured disruption data.
- Low-confidence extraction triggers HOLD or clarification rather than unsafe action.

## Phase 7 — Evidence Scout / Next Best Question

### Tasks
- Enumerate decision-relevant unknowns.
- Estimate decision sensitivity/value for each unknown by re-solving with plausible values.
- Rank unknowns.
- Use Gemini to generate concise operator/supplier question for top unknown.
- Accept sandbox reply and update state.
- Re-run forecast/scenario/optimizer.

### Exit criteria
- The top-ranked question can materially change the chosen plan in the hero demo.
- System does not ask low-value questions when a higher-value unknown exists.

## Phase 8 — ADK orchestration

### Tasks
- Implement one bounded orchestrator.
- Register explicit tools.
- Enforce tool schemas.
- Add state transitions.
- Add failure handling.
- Add audit events.

### Exit criteria
- Orchestrator can complete full hero flow end-to-end.
- Tool calls are traceable.
- It cannot bypass Proof Gate.

## Phase 9 — Premium UI

### Screens
- Continuity Command Center.
- Evidence Board.
- Scenario Room.
- Proof Room.
- Action Center.
- Shadow Mode / Value Ledger.

### UX rule
No generic chatbot as the primary interface. Conversation may be used for evidence/questions, but decisions must be visual and operational.

### Exit criteria
- Judge can understand problem and product with minimal narration.
- Each hero interaction has a real backend counterpart.

## Phase 10 — Execution sandbox

### Tasks
Persist real action objects:
- transfer order;
- purchase-order draft;
- supplier escalation;
- manager task.

### Exit criteria
- `APPROVE & DISPATCH` changes backend state.
- Action objects are visible after page refresh.
- No fake toast-only execution.

## Phase 11 — Shadow Mode / Value Ledger

### Tasks
- Store baseline/current-system plan.
- Store Varelyx recommendation.
- Compare predicted business effects.
- Record later outcome when available.
- Clearly distinguish simulation from observed outcome.

### Exit criteria
- Side-by-side comparison works in demo.
- Metrics have explicit provenance.

## Phase 12 — Evaluation

Minimum metrics:
- forecast WAPE/MAE;
- stockout risk precision/recall;
- useful-question accuracy;
- decision-value ranking quality;
- feasible-plan rate;
- constraint violation rate;
- scenario robustness/regret;
- tool-call success;
- hallucination / groundedness checks;
- end-to-end time-to-decision.

## Phase 13 — Red team

Attack:
- missing fields;
- conflicting supplier information;
- stale inventory;
- insufficient cash;
- impossible MOQ;
- route unavailable;
- supplier capacity zero;
- bad voice extraction;
- Gemini timeout;
- optimizer infeasible;
- malformed tool output;
- duplicated approval;
- replayed actions;
- data-source mismatch.

Fix all critical demo blockers.

## Phase 14 — Competition packaging

- Public/demo-safe GitHub repository as required.
- Architecture diagram.
- Problem/impact evidence.
- Evaluation results.
- Solution deck/PDF.
- <=3-minute demo video.
- Live deployed prototype.
- README with run/deploy instructions.

## Time discipline

Target internal order from the original competition plan:

- Sep 10–12: repo/GCP/data/schema/baseline.
- Sep 13–16: forecast/risk/scenario.
- Sep 17–19: optimizer + Proof Gate.
- Sep 20–21: Gemini + ADK + Evidence Scout.
- Sep 22–24: premium UI + Shadow Mode.
- Sep 25: execution sandbox.
- Sep 26–27: backtests + agent evals.
- Sep 28: break everything.
- Sep 29: fix everything.
- Sep 30: feature freeze.
- Oct 1: video/deck/README.
- Oct 2: dress rehearsal + production freeze.
- Oct 3: submit target.
- Oct 4: emergency buffer only.

If schedule slips, cut optional features before weakening the core chain.

## Must-ship list

1. CSV sales/inventory ingestion.
2. Bangla/English disruption text or prerecorded voice ingestion.
3. Known / Estimated / Unknown evidence board.
4. Demand/risk forecast.
5. Next Best Question.
6. Scenario generation.
7. Constraint-aware optimizer.
8. Proof Gate + Decision Receipt.
9. Shadow comparison.
10. Approval → persistent action objects.

## Explicit non-goals for MVP

- generic chatbot;
- pricing AI;
- credit scoring;
- shelf computer vision;
- full promotion agent;
- autonomous purchasing without approval;
- full ERP replacement;
- broad multi-agent theater.
