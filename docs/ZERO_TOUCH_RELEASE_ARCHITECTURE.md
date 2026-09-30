# Varelyx zero-touch release architecture

## Competition rule boundary

The judged/final prototype remains on **Firebase or Cloud Run**. Render/Vercel may be used for preview, CI, synthetic browser QA, smoke monitoring, and evidence generation, but not as the only final judged deployment when the competition requires Google Cloud deployment.

## Target flow

Git push to product branch
-> Render auto-deploy preview
-> Render build runs JS/Node verification
-> Preview URL available
-> automated browser QA against preview
-> failure blocks promotion
-> approved release candidate
-> Firebase/Cloud Run official final deployment
-> automated production smoke
-> evidence bundle for judging/submission

## Manual work target

Recurring/manual engineering work: **zero**.

One-time account authorization cannot be removed safely:
- Render must be authorized to read the private GitHub repository.
- Google/Firebase must have a trusted deploy identity or authenticated service connection.

After those one-time trust grants, all normal deploy/test/smoke flows should run automatically.

## Render blueprint

`render.yaml` defines an auto-deploying preview service for `fix/firebase-verification-20260929`.

Build gate:
- JavaScript syntax/contracts
- Node test suite

Runtime:
- serves `public/` over HTTPS

Extended QA:
- `scripts/render-preview-qa.sh`
- public URL reachability
- Node checks
- Python tests
- Playwright browser smoke

## Final release gate

Do not promote the product PR unless:
- Render preview build is green;
- browser QA passes;
- Firebase/Cloud Run final deployment exists;
- real Gemini flow passes;
- Firebase persistence/read-back and refresh restore pass;
- HOLD/PASS/BLOCK behavior is proven;
- user isolation and concurrent-write conflict behavior pass;
- responsive screenshots are captured at 1440x900, 1280x720, 390x844.

## Zero-touch production monitoring

Recommended monitor cadence after final deployment:
- every 15 minutes: production root/health smoke;
- daily: synthetic judge flow where safe;
- on failure: open/update a GitHub incident issue automatically;
- on recovery: close the incident automatically.

This keeps the final competition deployment on Google Cloud while outsourcing preview/verification execution to Render.
