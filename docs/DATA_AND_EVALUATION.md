# Varelyx Data and Evaluation Plan

## Credibility principle

Varelyx must never present simulation-derived numbers as real retailer outcomes.

Every metric shown to judges, customers, or investors should have provenance:
- real benchmark result;
- controlled simulation result;
- observed pilot result;
- target/hypothesis.

## Dataset strategy

### Bangladesh retail geography / realism
Use the open-access Bangladesh retail dataset referenced during concept validation for network geography, store metadata, and market realism.

Known useful characteristics from the research phase:
- hundreds of thousands of real retail outlets;
- Bangladesh administrative/geographic coverage;
- store/product attributes;
- product-level target information;
- open license reported as CC BY 4.0.

This dataset is useful for geography and network realism, **not** as a complete substitute for store-SKU historical sell-through + live inventory + supplier lead-time data.

### FreshRetailNet-50K
Use for real demand/stockout behavior benchmarking.

Research notes preserved from concept validation:
- hundreds of stores;
- hundreds of SKUs;
- 50,000 store-product series;
- millions of observations;
- stockout annotations;
- promotions;
- precipitation;
- hourly sales/stock status;
- open license reported as CC BY 4.0.

Use for:
- forecasting benchmark;
- stockout-risk evaluation;
- censored-demand behavior;
- robustness testing.

### DataCo Smart Supply Chain
Use for supply/delivery behavior and logistics-related benchmark components where appropriate.

Research notes:
- sales/distribution/provisioning/shipment timing/delivery behavior;
- open-license source reported during research.

Use for:
- delivery-delay behavior;
- supply/distribution features;
- disruption module validation.

## Do not fake-merge unrelated datasets

The data sources above were collected for different purposes and should not be stitched together and presented as one real retailer.

Correct approach:

### Module validation
- Demand / stockout model → real stockout benchmark.
- Bangladesh map/network realism → Bangladesh retail geography dataset.
- Delivery/disruption behavior → supply-chain dataset.

### End-to-end demo
Create a clearly labelled **Bangladesh Continuity Twin**:
- realistic Bangladesh geography;
- empirically plausible demand distributions;
- empirically plausible disruption distributions;
- controlled scenario inputs;
- explicit label that it is a simulation built from open retail benchmarks.

## Core evaluation metrics

### Forecast layer
- WAPE;
- MAE;
- coverage of prediction intervals;
- performance by dense vs intermittent SKU classes.

### Stockout/risk layer
- precision;
- recall;
- F1 where useful;
- lead time before failure detection.

### Evidence Scout
- useful-question accuracy;
- percentage of questions whose answers can materially change the selected action;
- rank correlation between predicted information value and actual decision change;
- unnecessary-question rate.

### Scenario engine
- scenario coverage;
- sensitivity to demand/supplier/route uncertainty;
- robustness score of selected plan;
- regret versus hindsight-optimal plan where measurable.

### Optimizer
- feasible-plan rate;
- objective value;
- runtime;
- solution stability;
- infeasibility explanation quality.

### Proof Gate
- constraint violation rate — target **0** in tested execution paths;
- false PASS rate — target **0** for encoded hard constraints;
- HOLD/BLOCK reason clarity.

### Agent/orchestration
- correct tool selection;
- tool argument validity;
- structured-output validity;
- groundedness/hallucination;
- end-to-end task success;
- retry/failure behavior.

### Product
- time to decision;
- number of operator interventions;
- number of questions asked before decision;
- percentage of decisions resolved without unnecessary data collection.

## Baselines

Compare against simple baselines, not strawmen:
- last-period / moving-average forecast;
- simple reorder-point policy;
- no-transfer baseline;
- cheapest feasible plan;
- current/baseline plan in Shadow Mode.

## Claims language

Allowed:
> In our controlled benchmark, Varelyx reduced simulated stockout exposure by X relative to baseline.

Allowed:
> On FreshRetailNet-50K, the forecasting module achieved Y WAPE on the selected evaluation slice.

Not allowed unless supported by real pilot evidence:
> Varelyx reduces retailer stockouts by 47%.

## Evidence logging

Every demo/evaluation run should persist:
- dataset/version;
- code/model version;
- scenario seed;
- input parameters;
- forecast output;
- optimizer output;
- proof output;
- final action;
- runtime.

This makes the competition demo reproducible and strengthens technical credibility.
