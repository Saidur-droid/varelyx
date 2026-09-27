# AI Builder Cup 2026 - Submission-ready content

## Theme
Retail & Commerce: Intelligent Customer and Business Experiences

## Product
Varelyx - evidence-driven retail continuity intelligence.

## One-line pitch
When a retail operating plan breaks, Varelyx identifies the evidence that matters, asks for the missing fact most likely to change the decision, explores plausible futures, computes a feasible response, proves it against hard rules, and only then turns it into execution-ready actions.

## Why GenAI is necessary
Operational disruptions arrive as messy language, voice notes, PDFs, and ambiguous supplier messages. Gemini converts that evidence into structured state, detects unresolved facts, and produces focused evidence requests. It does not invent inventory quantities. OR-Tools handles constrained decisions and an independent Proof Gate verifies policy before action.

## Google stack used by this prototype
- Gemini through Google GenAI and Vertex AI for text/audio disruption extraction and focused question generation.
- Cloud Run deployment target.
- Firestore optional durable action/audit storage.
- OR-Tools for deterministic optimization.

## Differentiation
1. Explicit Known / Estimated / Unknown evidence state.
2. Next Best Question ranked by decision value.
3. Scenario robustness instead of a single confident forecast.
4. Mathematical optimization for quantities and feasibility.
5. Independent Proof Gate that can block an AI-style proposal.
6. Human approval before execution objects.
7. Shadow Mode comparison before asking operators to switch systems.

## Three-minute demo flow
1. Show controlled Bangladesh Continuity Twin: 250 stores, 1,200 SKUs, 6 suppliers.
2. Analyze Bangla/Banglish supplier disruption: 48-hour delay, two affected routes, capacity unknown.
3. Show DECISION NOT READY and the highest-value unknown.
4. Confirm Supplier B Thursday capacity = 120 cases.
5. Show current, cheapest, balanced, and maximum-availability strategies.
6. Prove balanced plan -> PASS.
7. Prove unverified aggressive proposal -> BLOCK with exact violated constraints.
8. Approve and dispatch balanced plan -> real backend action objects appear.
9. Show Shadow Mode, explicitly labelled controlled simulation.
10. End on: Know what matters. Ask what is missing. Prove what works. Then act.

## Claims discipline
Do not claim observed retailer impact. Current impact metrics are controlled simulation outputs. Real-world claims require pilot evidence.

## Owner-side submission actions
- Complete eligible team registration in the competition portal.
- Deploy this repository to the owner's Google Cloud project.
- Record and publish the maximum 3-minute demo video.
- Upload the required proposal/deck and live prototype URL.
