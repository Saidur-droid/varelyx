# Varelyx

> **Retail decision intelligence that turns disruption and uncertainty into verified actions.**

Varelyx is an evidence-driven retail continuity platform built for moments when the operating plan stops matching reality.

When demand shifts, suppliers slip, routes fail, inventory becomes uncertain, or working-capital limits tighten, Varelyx does not simply generate advice. It identifies what is known, what is estimated, and what is missing; determines which missing fact is worth resolving; simulates plausible futures; computes a feasible response under hard business constraints; proves that response; and turns an approved plan into execution-ready actions.

## Product thesis

**Retail Crisis → Evidence → Decision → Proof → Action**

The hero idea is not “another retail AI agent.” The hero idea is **decision-making under uncertainty**.

Varelyx is designed around four signature capabilities:

1. **Evidence Scout** — separates Known / Estimated / Unknown facts and finds the next best question whose answer could materially change the decision.
2. **Continuity Twin** — simulates multiple plausible futures instead of trusting one point forecast.
3. **Robust Decision Engine** — uses deterministic optimization to select feasible transfers, replenishment, deferrals, and escalation actions under cash, capacity, lead-time, MOQ, safety-stock, route, and policy constraints.
4. **Proof Gate** — blocks unsafe or infeasible AI proposals and creates a Decision Receipt showing what was known, assumed, verified, and approved.

## Signature experience

A supplier sends a Bangla voice note saying a delivery will be delayed, Eid is six days away, a route is disrupted, and the operator has a fixed working-capital ceiling.

Varelyx may respond:

> **DECISION NOT READY**
>
> One critical unknown can materially change the recovery plan: Supplier B Thursday capacity.

It asks only the highest-value question, receives the answer, recomputes the scenario space, proposes multiple strategies, blocks infeasible options, proves the recommended plan, and creates execution-ready transfer orders, purchase-order drafts, supplier escalations, and manager tasks.

**AI should know what it does not know, know which question is worth asking, and earn permission to act.**

## Why this is stronger than the earlier concept

The project started as a broad retail forecasting / replenishment / “AI operating system” idea. Red-team analysis showed that those positions were too crowded and too easy to dismiss as another forecasting dashboard or agent wrapper.

The upgraded Varelyx concept narrows the wedge to a harder, more defensible job:

- short-horizon disruption response instead of replacing the whole planning stack;
- incomplete evidence instead of assuming perfect ERP data;
- explicit uncertainty instead of a single confident answer;
- active evidence acquisition instead of guessing missing facts;
- deterministic optimization instead of LLM-generated quantities;
- proof-gated execution instead of “trust the AI”;
- Shadow Mode and a Value Ledger instead of demanding a risky rip-and-replace migration.

See [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md) for the full evolution.

## Google-first build

Varelyx is intentionally designed so Google technology is part of the product core, not competition decoration.

Planned stack:

- **Gemini** for multimodal evidence extraction, ambiguity detection, policy interpretation, next-best-question generation, tool orchestration, and grounded explanation.
- **Google ADK** for the bounded orchestration layer and tool-calling workflow.
- **BigQuery** for retail state, historical observations, benchmark results, scenario outputs, and analytics.
- **BigQuery ML** for event-aware demand/risk forecasting and prediction intervals.
- **Google OR-Tools** for constrained inventory, transfer, replenishment, and robust-response optimization.
- **Cloud Run** for APIs, orchestration services, optimization services, and the deployed prototype.
- **Cloud Storage** for CSV/PDF/audio inputs and immutable evidence snapshots.
- **Firestore** for decisions, approvals, audit events, and execution objects.
- **Firebase / Cloud Run** for the web experience.
- **Vertex AI evaluation tooling** where useful for tool-use, hallucination, safety, and response-quality evaluation.

This also aligns with AI Builder Cup requirements: submissions must meaningfully use Google AI such as Gemini/Gemma or agentic Google platforms and deploy the working prototype on Google Cloud through Cloud Run or Firebase.

See [`docs/GOOGLE_CLOUD_PLAN.md`](docs/GOOGLE_CLOUD_PLAN.md).

## MVP that must ship

1. CSV sales/inventory ingestion.
2. Bangla/English disruption text or prerecorded voice ingestion.
3. Known / Estimated / Unknown evidence board.
4. Demand/risk forecast with uncertainty.
5. Evidence Scout / Next Best Question.
6. Scenario generation.
7. Constraint-aware optimizer.
8. Proof Gate + Decision Receipt.
9. Shadow comparison / Value Ledger.
10. Approve → real backend action objects.

Not in the competition MVP: pricing AI, generic customer chatbot, credit scoring, shelf computer vision, broad promotion agent, full ERP replacement.

## Business thesis

Varelyx is not a “sell one SaaS seat to every small shop” business.

Initial ideal customers:

- FMCG distributors;
- regional retail chains;
- multi-location grocery / pharmacy / general-merchandise operators;
- networks with roughly 20–500 owned locations or 500–50,000 serviced retail endpoints.

Typical buyers: COO, Head of Supply Chain, Distribution Head, Inventory Planning Head, Operations Director.

### Adoption wedge: Shadow Mode

**Do not switch first. Let Varelyx prove itself first.**

The customer keeps its current ERP/POS/WMS/Excel/planning process. Varelyx runs read-only in parallel, records the decisions it would change, and compares those recommendations with subsequent outcomes in a **Value Ledger**.

The commercial philosophy is:

> **We earn the switch before asking for it.**

See [`docs/BUSINESS_AND_GTM.md`](docs/BUSINESS_AND_GTM.md).

## Competition thesis

Primary theme: **Retail & Commerce**.

AI Builder Cup judging currently weights:

- Technical Merit & GenAI Implementation — **40%**
- Problem Alignment & Impact — **25%**
- Innovation & Creativity — **25%**
- UX & Solution Design — **10%**

Varelyx is designed to attack each dimension directly. The competition demo is not a deck simulation; the backend must create real decision objects and prove real constraints.

See [`docs/COMPETITION_AND_DEMO.md`](docs/COMPETITION_AND_DEMO.md).

## Execution target

The build plan assumes an internal production freeze before the final AI Builder Cup deadline, not on the deadline itself.

Execution phases:

1. foundation + schemas + benchmark subset;
2. forecasting and risk;
3. scenario engine;
4. optimizer and Proof Gate;
5. Gemini + ADK + Evidence Scout;
6. premium UI + Shadow Mode;
7. execution sandbox;
8. evaluation and backtests;
9. red-team and fixes;
10. deck, demo, README, submission.

See [`docs/EXECUTION_PLAN.md`](docs/EXECUTION_PLAN.md).

## Data strategy

Varelyx should never fake efficacy claims by pretending synthetic simulation is production retailer evidence.

The plan separates:

- **Bangladesh retail geography / realism**;
- **real stockout / demand benchmark behavior**;
- **supply / delivery disruption behavior**;
- **controlled end-to-end Bangladesh Continuity Twin simulation**.

Any simulation-derived metric must be labelled as a controlled simulation. Real-world impact claims require real-world evidence.

See [`docs/DATA_AND_EVALUATION.md`](docs/DATA_AND_EVALUATION.md).

## Core product rule

> **Gemini interprets and orchestrates. Mathematics decides feasibility. The Proof Gate decides what may act. Humans control high-risk execution.**

## Documentation map

- [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) — read this first when resuming the project later.
- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) — detailed product behavior and UX.
- [`docs/GOOGLE_CLOUD_PLAN.md`](docs/GOOGLE_CLOUD_PLAN.md) — Google-first architecture and service responsibilities.
- [`docs/EXECUTION_PLAN.md`](docs/EXECUTION_PLAN.md) — bit-by-bit implementation order and acceptance criteria.
- [`docs/DATA_AND_EVALUATION.md`](docs/DATA_AND_EVALUATION.md) — datasets, benchmarks, metrics, credibility rules.
- [`docs/BUSINESS_AND_GTM.md`](docs/BUSINESS_AND_GTM.md) — customer, pricing logic, Shadow Mode, expansion, moat.
- [`docs/COMPETITION_AND_DEMO.md`](docs/COMPETITION_AND_DEMO.md) — AI Builder Cup strategy and 3-minute demo.
- [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md) — why the idea changed and what is locked.
- [`docs/history/VERALYNQ_NOTES.md`](docs/history/VERALYNQ_NOTES.md) — preserved earlier naming/business note requested by the founder.

## Current status

**Concept: LOCKED.**

The next meaningful work is implementation, not broad idea hunting.

Brand note: **Varelyx** is the current project/repository name. Earlier names such as RELAY and Veralynq are historical context only unless a later documented decision changes the brand.
