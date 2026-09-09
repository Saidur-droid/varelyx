# Varelyx Google Cloud Plan

## Principle

Google technology must be part of the product's critical path, not added for competition compliance after the product is built.

## Service map

### Gemini
Use for:
- multimodal extraction from supplier PDF/text/audio;
- Bangla/English operational understanding;
- ambiguity detection;
- policy interpretation;
- structuring disruptions into machine-readable events;
- identifying missing facts;
- generating the Next Best Question;
- bounded tool orchestration;
- evidence-grounded explanation of the chosen plan.

Do **not** use Gemini to invent order quantities or override deterministic constraints.

### Google ADK
Use as the bounded orchestration layer.

Preferred design: one main orchestrator with explicit tools, not a decorative collection of agents.

Planned tools:

```text
get_retail_state()
extract_disruption()
forecast_demand()
rank_unknowns_by_information_value()
request_evidence()
simulate_scenarios()
optimize_response()
verify_plan()
create_action_objects()
```

### BigQuery
Primary analytical store for:
- sales history;
- inventory snapshots;
- supplier history;
- event/disruption tables;
- scenario outputs;
- benchmark data;
- model evaluation metrics;
- Value Ledger analytical results.

### BigQuery ML
Planned use:
- event-aware time-series forecasting;
- prediction intervals;
- multi-series SKU/location forecasting where appropriate;
- baseline forecasting that can be evaluated reproducibly.

Potential model path: `ARIMA_PLUS_XREG` for series where external regressors such as holidays/events are useful.

Sparse/intermittent SKUs may need a fallback model rather than forcing a single forecasting method across all series.

### Google OR-Tools
Use for deterministic optimization.

Potential formulations:
- min-cost flow for inventory transfer networks;
- linear / mixed-integer optimization for replenishment and policy constraints;
- scenario-aware robust decision selection.

Hard constraints must be solver-verified where possible.

### Cloud Run
Deploy:
- API service;
- ADK/orchestration service;
- optimizer service;
- scenario service;
- proof service;
- optional Next.js web app if not hosted via Firebase.

### Cloud Storage
Store:
- uploaded CSVs;
- supplier PDFs;
- audio evidence;
- immutable evidence snapshots;
- benchmark artifacts where appropriate.

### Firestore
Store transactional product state:
- decision records;
- approvals;
- Proof Gate results;
- Decision Receipts;
- execution objects;
- audit events;
- demo sandbox supplier responses.

### Firebase
Use for frontend hosting/auth/app integration if it speeds the competition build. Cloud Run is also acceptable for the web app if the team prefers a unified deployment path.

### Vertex AI / Agent Evaluation
Use where practical to evaluate:
- tool-use correctness;
- hallucination;
- safety;
- task completion;
- response quality.

## Reference architecture

```text
Premium Web UI
      |
      v
Cloud Run / Firebase
      |
      v
Cloud Run API
      |
      +-------------------+-------------------+
      |                   |                   |
      v                   v                   v
Cloud Storage          BigQuery            Firestore
Evidence files      analytical state     decisions/actions
      |
      v
Gemini + Google ADK Orchestrator
      |
      +-----------+-------------+--------------+
      |           |             |              |
      v           v             v              v
Forecast Tool  Scenario Tool  Evidence-VOI  Policy/State Tool
 BigQuery ML     Monte Carlo      Tool
      \           |              /
       \          |             /
        +---------+------------+
                  v
             OR-Tools
          Robust Optimizer
                  |
                  v
              Proof Gate
          PASS / HOLD / BLOCK
                  |
                  v
           Decision Receipt
                  |
                  v
            Human Approval
                  |
                  v
          Execution Objects
```

## Engineering guardrails

1. Every Gemini output that drives an action should use structured schemas where possible.
2. Tool arguments must be validated before execution.
3. Quantities, capacities, and cash rules come from verified state and solver outputs.
4. High-risk ambiguity should result in `HOLD`, not hallucinated certainty.
5. Evidence sources should be traceable into the Decision Receipt.
6. The demo must remain functional if one non-critical generative step fails; use graceful fallback/cached controlled inputs where allowed.
7. Secrets and project credentials never belong in the public repository.

## Competition alignment

The architecture is intentionally designed around meaningful Google AI usage plus deployment on Google Cloud. The final submission should make the critical role of Gemini/ADK/BigQuery/Cloud Run visible in both the architecture diagram and live demo.

## Build priority

Google integration order:

1. Cloud project / IAM / deployment skeleton.
2. BigQuery schemas and benchmark import.
3. Cloud Run API.
4. Forecasting tool.
5. OR-Tools optimizer service.
6. Proof Gate.
7. Gemini structured evidence extraction.
8. ADK orchestration and function calling.
9. Firestore audit/action objects.
10. Vertex/agent evaluations and observability.

The product should be deployable early, not moved to Google Cloud at the end.
