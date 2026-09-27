# Varelyx

**Know what matters. Ask what is missing. Prove what works. Then act.**

Varelyx is an evidence-driven retail continuity prototype for the Google Cloud AI Builder Cup 2026, Retail & Commerce theme. It turns disruption and incomplete evidence into proof-gated, execution-ready actions.

## Working MVP

The repository now contains a runnable end-to-end prototype:

disruption -> structured evidence -> Known/Estimated/Unknown -> Next Best Question -> confirmed evidence -> OR-Tools strategies -> Proof Gate -> human approval -> persistent action objects

### What works

- Command-center UI with Evidence Board, Scenario Room, Proof Gate, Action Center, and Shadow Mode.
- Bangla, Banglish, and English disruption extraction through Gemini when Vertex AI or API credentials are available, with deterministic fallback.
- Audio evidence endpoint for prerecorded supplier notes.
- Decision-critical unknown ranking and Gemini-generated Next Best Question with safe fallback.
- Deterministic OR-Tools optimization under working-capital, supplier capacity, MOQ/pack, donor-safety-stock, and route constraints.
- Independent Proof Gate with PASS, HOLD, and BLOCK.
- Deliberately unsafe proposal that the gate rejects to prove AI cannot bypass mathematics.
- Human approval that creates real backend transfer orders, purchase-order drafts, supplier escalations, and manager tasks.
- Idempotent approval path.
- CSV ingestion endpoints for sales and inventory.
- File persistence locally; optional Firestore persistence on Google Cloud.
- Cloud Run Docker deployment.
- GitHub Actions CI and engine/API tests covering the hero flow and critical constraints.

## No Vercel or Supabase required

Neither is used. The competition deployment path is Cloud Run plus Vertex AI Gemini, with optional Firestore for durable state.

## Run locally

Create a Python 3.12 virtual environment, install requirements.txt, run pytest, then launch:

    uvicorn app.main:app --reload --port 8080

Open http://localhost:8080.

## Cloud Run

See docs/DEPLOY_GCP.md.

## Demo

1. Reset demo.
2. Analyze disruption.
3. Confirm Supplier B Thursday capacity = 120.
4. Compare current, cheapest, balanced, and maximum-availability strategies.
5. Prove balanced plan -> PASS.
6. Try unverified aggressive proposal -> BLOCK.
7. Approve and dispatch balanced plan.
8. Inspect persistent backend action objects and Shadow Mode.

The Bangladesh Continuity Twin and its impact numbers are explicitly controlled-simulation outputs, not claims of observed retailer results.
