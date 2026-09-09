# Varelyx Project Context

This file exists so that a future AI assistant, engineer, founder, judge, investor, or collaborator can understand the project quickly without reconstructing the entire conversation history.

## One-line definition

**Varelyx is evidence-driven retail continuity software that turns disruption and uncertainty into verified, execution-ready actions.**

## The problem

Retail operating plans break when reality changes: supplier delays, demand spikes, route disruption, stale inventory, uncertain capacity, working-capital constraints, and incomplete operational information.

Most planning systems are strongest when the state of the world is already known. Varelyx focuses on the harder moment: **the plan is now wrong, information is incomplete, and a decision must still be made quickly.**

## The core insight

Do not ask AI to confidently guess through uncertainty.

Instead:

1. identify Known / Estimated / Unknown facts;
2. determine which unknown could materially change the decision;
3. ask the next best question;
4. update the evidence state;
5. generate plausible futures;
6. optimize feasible responses under hard constraints;
7. verify the chosen plan;
8. create a Decision Receipt;
9. require human approval for high-risk execution;
10. create real action objects.

The signature idea is **AI that knows what it does not know and knows which question is worth asking.**

## Product pillars

### Evidence Scout
- Multimodal operational evidence intake.
- Known / Estimated / Unknown state.
- Decision-critical uncertainty ranking.
- Next Best Question.
- Evidence request and state update.

### Continuity Twin
- Multiple plausible futures, not one point forecast.
- Demand shocks, supplier recovery/delay, route failure, alternate-supplier availability, etc.
- Measures plan robustness across scenarios.

### Robust Decision Engine
- Deterministic optimization.
- Actions can include transfers, replenishment, emergency procurement, order deferral, escalation.
- Hard constraints include cash, MOQ, pack size, supplier capacity, lead time, route availability, donor safety stock, critical SKU policy, and location capacity.

### Proof Gate
- Separates AI proposal from permitted execution.
- Checks every hard business rule.
- PASS / HOLD / BLOCK.
- Produces Decision Receipt with evidence, assumptions, uncertainty, constraints, tool/model versions, approval, timestamps, hashes.

### Shadow Mode
- Read-only adoption wedge.
- Customer keeps existing ERP/POS/WMS/Excel/planning tool.
- Varelyx runs in parallel.
- Value Ledger records decisions Varelyx would change and compares with subsequent outcomes.

## Why this concept replaced the earlier plan

Earlier direction: generic AI replenishment / inventory operating system.

Red-team result: too crowded, weak differentiation, risk of looking like another agent wrapper, unclear GenAI necessity, potential data credibility problems, and poor adoption strategy if positioned as ERP/planning replacement.

Upgraded direction:

- disruption response, not total planning replacement;
- evidence acquisition, not blind prediction;
- explicit uncertainty, not fake confidence;
- optimization, not LLM quantity generation;
- proof-gated action, not chat recommendations;
- Shadow Mode, not rip-and-replace;
- Value Ledger, not “trust our AI” sales claims.

## Google-first principle

Google technology is not decorative. It is designed into the core workflow.

- Gemini: multimodal evidence understanding, ambiguity, question generation, orchestration, explanation.
- Google ADK: bounded agent/tool orchestration.
- BigQuery: retail state and analytics.
- BigQuery ML: forecasting and prediction intervals.
- OR-Tools: deterministic constrained optimization.
- Cloud Run: deployed services.
- Cloud Storage: evidence files.
- Firestore: decisions, approvals, action objects, audit trail.
- Firebase/Cloud Run: frontend hosting.
- Vertex AI evaluation: tool-use, hallucination, safety, task quality where useful.

Rule: **Gemini interprets and orchestrates. Mathematics decides feasibility. Proof Gate decides what may act.**

## Competition context

Target competition: Google Cloud AI Builder Cup 2026.

Primary theme: Retail & Commerce.

The product must be a working Google Cloud prototype, not a mockup. The competition rewards technical merit, impact, innovation, and UX; Varelyx is intentionally structured around those dimensions.

## Demo hero flow

1. Normal Dhaka retail network.
2. Eid approaching.
3. Route disruption.
4. Bangla supplier voice note says delivery is delayed, capacity unknown.
5. Gemini structures the evidence.
6. Varelyx refuses premature decision: “DECISION NOT READY.”
7. It identifies Supplier B Thursday capacity as the most decision-critical unknown.
8. “ASK” generates a focused question.
9. Supplier response arrives.
10. Scenario space updates.
11. Varelyx compares cheapest / balanced / maximum-availability strategies.
12. Robust optimizer selects candidate.
13. “PROVE THIS PLAN” runs constraint checks.
14. One infeasible plan is visibly blocked.
15. Approved plan creates transfer orders, PO drafts, escalation, manager tasks.
16. End with the brand promise: **Know what matters. Ask what’s missing. Prove what works. Then act.**

## Data credibility rule

Never present simulation output as real retailer impact.

Use open benchmarks for module validation, a clearly labelled controlled Bangladesh Continuity Twin for end-to-end demo, and real-world claims only when real-world evidence exists.

## Initial ICP

Do not sell one-by-one to tiny shops.

Primary customers:
- FMCG distributors;
- regional chains;
- multi-location grocery / pharmacy / general-merchandise networks.

Typical buyer:
- COO;
- Head of Supply Chain;
- Distribution Head;
- Inventory Planning Head;
- Operations Director.

## GTM wedge

Shadow Audit → Value Ledger → Proof of Value → Paid rollout.

Positioning:

**Do not replace your current system first. Let Varelyx run beside it and prove where better decisions exist.**

## Business ambition

This is intended to become a real venture-scale software company, not a one-off competition submission.

Potential expansion path:

Continuity → Daily Exceptions → Replenishment → Supplier Reliability → Network Rebalancing → Procurement → Promotion Response → Working-Capital Optimization → Retail Decision Infrastructure.

Long-term defensibility may come from a proprietary Decision Outcome Graph, Supplier Reliability Graph, Retail Shock Library, and accumulated Evidence Economics.

## Non-negotiable product rules

- No fake metrics.
- No decorative multi-agent architecture.
- No LLM-generated order quantity treated as truth.
- No fake “Execute” toast; actions must become backend objects.
- No claim of replacing enterprise planning in the MVP.
- No broad feature explosion before the core workflow is reliable.
- No autonomy without policy and proof gates.
- No competition-only architecture; design for a real business.

## Current status

- Brand: Varelyx.
- Repository: `Saidur-droid/varelyx`.
- Concept: locked.
- Next step: implementation according to `docs/EXECUTION_PLAN.md`.
