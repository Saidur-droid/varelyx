# Firebase reliability implementation report

Date: 2026-09-29
Branch: `fix/firebase-verification-20260929`
Base reviewed: `363155d929bccf13e8d3845ded8ee4289ef031be`

## Release status

Implementation changes are on this review branch. This report does NOT certify a production deployment, successful live Gemini request, successful real Firebase write, or final competition submission. Do not merge or label the entry submission-ready until the live gates below pass.

The existing `public/firebase-config.js` already identifies `varelyx-ai-builder-cup`. Its configuration, existing App Check site key, Firebase project binding, and deployed database rules were not replaced. No new cloud service, billing upgrade, public repository visibility change, or external order dispatch was performed.

## Implemented changes

### Firebase connection and persistence

- Reuse the persisted Anonymous Auth user after `authStateReady()` instead of racing authentication initialization.
- Load SDK modules inside error handling, with a deadline and a visible connection failure state.
- Require an authenticated server read before claiming a Firebase connection.
- Use owner-scoped REST reads at `demoSessions/{uid}/verified_v2`; do not restore operational state from localStorage.
- Serialize state inside a JSON envelope to preserve empty arrays and explicit null values through Realtime Database.
- Use ETag/If-Match conditional writes and revision checks to reject stale-tab updates.
- Read back the commit ID, revision and payload from the server before displaying SAVE VERIFIED.
- On an uncertain or failed write, show NOT VERIFIED, retain the prior displayed state and block further writes until reload/reconciliation.
- Preserve legacy records at their existing location. Version 2 starts separately; there is no silent migration of old unverified approvals.

### Evidence and planning

- Request JSON Schema-constrained Gemini responses and validate field types, numeric limits, confidence and supporting source quotations.
- Support Bengali digits in numeric source quotations. Written-out number words and ambiguous units need operator clarification; this is not a complete natural-language grounding verifier.
- Apply extracted delay/routes/supplier to the evidence board instead of leaving the board fixed at initial demo values.
- Invalidate the previous evidence review and proof before analyzing a new message. Failed or low-confidence analysis must not authorize a decision.
- Require operator review and capacity confirmation before approval. Supplier B is the only supported supplier for this controlled scenario.
- Feed the affected-route count into an explicitly disclosed simulation policy: transferable route capacity = min(90, max(0, 150 - 30 * affected routes)). This is a controlled assumption, NOT an empirically fitted logistics model.
- Rank two supported unknowns through bounded one-variable re-solving, reporting simulated shortage sensitivity. This is an improvement over a fixed score, not completion of the original full Evidence Scout plan.
- Use the same demand scenario calculation for both sides of Shadow Mode: current expected shortage is 290 cases; the reviewed 120-capacity / 2-route balanced example is 30 cases. Neither figure is observed retailer performance.

### Proof Gate and action records

- Check nonnegative integer quantities, pack size, MOQ, donor safety, route capacity, supplier capacity, emergency capacity and independently recomputed cash.
- Generate deterministic SHA-256 receipts bound to the policy, full plan, source evidence, confirmation and proof checks.
- Keep approved proof payloads in a receipt archive.
- Use receipt-derived action IDs and reject duplicate approval of the same decision within a run.
- Label actions APPROVED_SANDBOX. No supplier, ERP or payment integration sends real orders.
- Export QA evidence as JSON without credentials.
- Escape dynamic HTML and use textContent for generated questions/evidence output.

## Verification actually performed

`node --test tests/web.test.mjs`

Result observed in the implementation session: 31 tests, 31 passed, 0 failed. The suite also iterates over 7 capacities x 5 route conditions x 4 plans to check encoded proof constraints.

These tests cover deterministic logic and mocked persistence/REST contracts. They do NOT verify live Google services, App Check enforcement, actual Firebase CORS/ETag behavior, or visual browser behavior.

A Playwright browser smoke-test attempt was blocked by the execution environment with `net::ERR_BLOCKED_BY_ADMINISTRATOR` before the local test page loaded. Therefore no browser PASS, live proof screenshot, mobile visual certification or final demo recording is claimed.

The live Hosting URL could not be fetched from this execution environment. No authenticated Firebase CLI/cloud-management connection was available, and no applicable Firebase-management plugin was found. No deploy command was executed.

## CI

The reviewed main-branch job `108607475177` / run `36314838671` failed before any reported steps. A prior log request returned BlobNotFound; the available connector rejected the annotations endpoint. The root cause is still unconfirmed; do not describe this as a known application assertion failure or a fixed runner problem.

This branch adds a separate Node 22 web test job, preserves the Python test job, adds timeouts and read-only repository permissions, and updates static asset tests for the modular client. GitHub CI success must be checked after the PR run; adding a workflow is not proof it passed.

## Required owner-side connection and live QA

Use an authorized development machine. Never paste Firebase tokens, service-account private keys or login credentials into chat or commit them.

From the repository directory:

```sh
git fetch origin
git switch fix/firebase-verification-20260929
node --test tests/web.test.mjs
npx --yes firebase-tools@latest login
npx --yes firebase-tools@latest projects:list
```

Confirm the authorized account can access `varelyx-ai-builder-cup`. In Firebase Console verify Anonymous Auth, the database URL and owner-scoped rules, Firebase AI Logic/Gemini availability and App Check domain registration. Do not disable security enforcement to make a test pass.

For a non-production Hosting preview:

```sh
npx --yes firebase-tools@latest hosting:channel:deploy verification-20260929 --project varelyx-ai-builder-cup --expires 7d
```

Register the generated preview hostname with the relevant Auth/App Check/reCAPTCHA domain controls before testing. Preview Hosting still uses the configured real backend: use only synthetic demo inputs and a dedicated test browser session.

Live gates:
1. Firebase server read verified, without exposing tokens in screenshots.
2. Actual Gemini analysis returns a valid grounded extraction.
3. Review evidence and confirm Supplier B capacity 120.
4. Balanced PASS, unsafe BLOCK and missing/low-confidence evidence HOLD.
5. Approval shows SAVE VERIFIED only after real database write/read-back.
6. Reload restores the same actions from the server with no operational localStorage cache.
7. Deliberate network/write failure shows NOT VERIFIED and blocks further approval.
8. Separate browser users cannot read each other's records; concurrent tabs produce a conflict rather than an overwrite.
9. Check console errors, mobile layout, receipt wrapping and all simulation disclosures.
10. Capture real proof screenshots and export QA evidence.

Only after review and successful live QA should the owner merge and release Hosting to the production channel.

## Remaining scope and limitations

- Proof checks still run in the client. A malicious authenticated user controlling their own client can falsify their own demo records. Firebase ownership rules do not turn client receipts into trusted server attestations. A real purchasing product needs server-authoritative validation and authorization.
- Confidence is model-reported, not statistically calibrated. Quote/number checks do not independently prove semantic interpretation. Human review remains mandatory.
- Historical-sales forecasting, real inventory ingestion, a calibrated route/delay model, general multi-supplier optimization, ADK orchestration and broad empirical evaluation remain unfinished.
- The optional legacy Python backend is not the submitted Firebase runtime and has not been migrated to this v2 state model.
- Real browser QA, live screenshots, final PDF verification, final public three-minute video, eligible team confirmation and portal submission remain pending.

## Competition verification notes

Intended program: Google Cloud AI Builder Cup 2026, powered by Hack2skill.
Intended theme: Retail & Commerce: Intelligent Customer and Business Experiences.

Official sources checked: https://aibuildercup.com/ and https://aibuildercup.com/themes.html .

The recently indexed official homepage lists teams of 2-4, registration/team formation through October 11, 2026, and prototype submission through October 18, 2026. A direct homepage fetch returned an older early-registration version listing 1-4. Prefer the newer official announcement and confirm the final rule in the authenticated portal.

Eligibility: 21+, JAPAC-based working professionals; students are not eligible. Submission: functioning Google AI/eligible-agentic prototype deployed on Google Cloud/Cloud Run/Firebase, proposal deck converted to PDF, public three-minute video, English materials. Judging: technical/GenAI 40%, alignment/impact 25%, innovation 25%, UX/design 10%.

The themes page also contains inconsistent category examples under a generic submission subsection. Confirm the exact Retail & Commerce problem statement shown in the live portal rather than silently selecting those unrelated examples.
