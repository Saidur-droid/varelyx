# Varelyx Decision Log

This document records why the current plan exists, which earlier ideas were rejected, and what is now considered locked. It is intentionally durable context for future work.

## Decision 001 — Retail & Commerce is the primary category

**Status:** Locked.

Reason:
- large measurable business pain;
- direct financial impact;
- strong fit for Google AI + optimization;
- global scalability;
- strong demo potential;
- can become a real startup rather than a one-off hackathon project.

Future of Work remains a secondary narrative because Varelyx reduces repetitive operational decision work, but competition positioning stays sharply Retail & Commerce.

## Decision 002 — Reject generic “AI inventory forecasting”

**Rejected.**

Why:
- crowded category;
- incumbents already provide forecasting/replenishment recommendations;
- weak innovation story;
- too easy for judges to dismiss as another dashboard or agent wrapper.

## Decision 003 — Reject broad “AI Retail Operating System”

**Rejected.**

Why:
- too broad for a competition timeline;
- impossible to prove depth across all modules;
- risks looking like marketing rather than engineering;
- unclear wedge for a startup.

## Decision 004 — Reject decorative seven-agent architecture

**Rejected.**

Why:
- agent count does not equal technical merit;
- risk of “agent washing”;
- harder to debug and demonstrate;
- one bounded orchestrator with excellent tools is more credible.

Current plan: one main ADK orchestrator plus deterministic analytical tools, with specialist agents only if a real engineering need later appears.

## Decision 005 — Focus on disruption response

**Locked.**

Varelyx is the response layer for moments when normal planning is invalidated by:
- demand shock;
- supplier delay/failure;
- route disruption;
- incomplete inventory state;
- working-capital pressure;
- policy constraints;
- contradictory or stale evidence.

This avoids positioning against entire ERP/planning suites head-on.

## Decision 006 — Make uncertainty explicit

**Locked.**

Every decision-critical fact is represented as:
- Known;
- Estimated;
- Unknown.

The UI should make this visible instead of hiding uncertainty behind a confident LLM answer.

## Decision 007 — Active evidence acquisition is the hero innovation

**Locked.**

Varelyx should not ask for every missing field.

It should identify the unknown most likely to change the decision, estimate its information value, and generate the **Next Best Question**.

This emerged after red-team analysis showed that “LLM + deterministic math + human approval” alone is not differentiated enough in the 2026 market.

## Decision 008 — Deterministic math owns quantities and feasibility

**Locked.**

Gemini may interpret, reason, orchestrate, and explain.

It must not invent:
- purchase quantities;
- transfer quantities;
- supplier capacities;
- cash availability;
- feasibility.

Use BigQuery ML / forecasting models and OR-Tools / deterministic validators for numerical decisions.

## Decision 009 — Proof Gate is mandatory

**Locked.**

AI proposal is not executable until hard constraints are verified.

Proof Gate statuses:
- PASS;
- HOLD;
- BLOCK.

The Decision Receipt is part of the product, not merely an engineering log.

## Decision 010 — Shadow Mode is the adoption weapon

**Locked.**

Do not demand that retailers replace their current software first.

Varelyx connects read-only, runs beside the existing process, and builds a Value Ledger.

Commercial principle:

> **We earn the switch before asking for it.**

This solves a major business risk in the original plan: migration friction and lack of trust.

## Decision 011 — Initial customer is not the individual micro-retailer

**Locked.**

Primary buyer:
- FMCG distributor;
- regional chain;
- multi-location grocery/pharmacy/general merchandise operator.

Reason:
- one customer can expose the product to hundreds/thousands of endpoints;
- better data availability;
- larger ROI;
- manageable sales/support model.

Micro-retail remains part of the network problem, not necessarily the paying customer.

## Decision 012 — Google-first architecture

**Locked.**

Google services must be critical-path components:
- Gemini;
- Google ADK;
- BigQuery;
- BigQuery ML;
- Cloud Run;
- Cloud Storage;
- Firestore;
- Firebase where useful;
- Vertex AI evaluation where useful;
- OR-Tools.

Do not build elsewhere and bolt Google branding on at submission time.

## Decision 013 — Data credibility over flashy claims

**Locked.**

Do not fake-merge unrelated open datasets into “one real retailer.”

Use:
- real datasets for module benchmarking;
- controlled Bangladesh Continuity Twin for end-to-end demo;
- real pilot data later for real-world impact claims.

Simulation metrics must be labelled as simulation metrics.

## Decision 014 — Real execution objects, not demo toasts

**Locked.**

Approve/dispatch must persist real backend records such as:
- transfer order;
- PO draft;
- supplier escalation;
- manager task.

Do not claim external ERP execution unless that integration actually exists.

## Decision 015 — Company, not competition toy

**Locked.**

The MVP is optimized for AI Builder Cup, but architecture and GTM should support a real business.

Long-term expansion:

Continuity → Daily Exceptions → Replenishment → Supplier Reliability → Network Rebalancing → Procurement → Promotion Response → Working-Capital Optimization → Retail Decision Infrastructure.

## Decision 016 — Brand evolution

Historical names:
- NEXUS — rejected due crowding/conflict risk and weak differentiation.
- RELAY — used as codename for the proof-gated continuity concept.
- Veralynq — explored as a brand; preserved in history notes.
- **Varelyx — current brand/repository name.**

Do not revert branding casually. Any future rename should be documented here with collision/domain/trademark reasoning.

## Current locked statement

> **Varelyx recognizes when reality has invalidated the retail plan; quantifies what it knows and does not know; determines which missing fact is worth obtaining; acquires that evidence; explores plausible futures; mathematically finds a resilient feasible response; proves it against hard business rules; and only then earns permission to act.**

## Current hero assets

- Hero problem: decision under uncertainty.
- Hero feature: Next Best Question.
- Trust weapon: Proof Gate.
- Adoption weapon: Shadow Mode.
- Commercial weapon: Value Ledger.
- Google story: Gemini/ADK + BigQuery ML + OR-Tools + Cloud Run.
- Demo story: chaos → missing evidence → ask → simulate → optimize → prove → approve → action.

## Status

**FULL PRODUCT GO.**

Future work should prioritize implementation and evidence. Broad idea hunting should only restart if a new fatal constraint appears.
