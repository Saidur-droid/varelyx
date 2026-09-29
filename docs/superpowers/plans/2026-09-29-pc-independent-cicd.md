# PC-Independent CI/CD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Varelyx build, test, preview-deploy, and smoke-test without depending on the user's Windows PC.

**Architecture:** Keep Firebase/Google Cloud as the submitted runtime. Add GitHub Actions for CI and Firebase preview deployment, GitHub Codespaces for interactive cloud development, Playwright for browser smoke testing, and Google Workload Identity Federation for short-lived GitHub-to-Google authentication.

**Tech Stack:** GitHub Actions, GitHub Codespaces/devcontainers, Node 22, Python 3.12, Playwright, Firebase CLI, Google Cloud Workload Identity Federation, Firebase Hosting.

**Spec:** `docs/superpowers/specs/2026-09-29-pc-independent-cicd-design.md`

## Global Constraints

- Primary runtime remains Google Cloud / Firebase.
- Gemini remains the primary GenAI integration.
- GitHub Actions is CI/CD automation only, not product runtime.
- GitHub Codespaces is a development/debugging environment only.
- Playwright is testing/QA tooling only.
- Do not deploy the competition prototype primarily to a non-Google cloud.
- Do not store service-account JSON or Firebase CLI login tokens in the repository.
- Prefer GitHub OIDC -> Google Workload Identity Federation -> dedicated deploy service account.
- Production Firebase deployment must remain manually gated and is not part of this first pass.
- Do not weaken Firebase Auth, App Check, or Realtime Database rules to make preview deployment work.
- Preview deployment must stop on failed tests or failed authentication.

## Review Focus

- GitHub Actions receives a forked/untrusted PR: deployment job must not obtain Google credentials or deploy a preview unless the workflow explicitly allows the trusted repository context.
- WIF variables are absent or malformed: the workflow must fail before Firebase deployment with a clear authentication/configuration error.
- Playwright runs against a page with a long proof receipt or wide strategy table: page-level mobile overflow must still be rejected while local table scrolling remains allowed.
- Firebase preview deploy succeeds but browser QA fails: the workflow must report failure and retain/surface the preview URL for debugging, without promoting production.
- Existing GitHub-hosted jobs still return no runner / `steps: null`: documentation must distinguish runner/account failure from application test failure and keep Codespaces as the interactive fallback.

---

### Task 1: Extend CI to run the complete local verification suite

**Files:**
- Modify: `.github/workflows/ci.yml`
- Create: `package.json`
- Create: `playwright.config.mjs`
- Create: `tests/e2e/smoke.spec.mjs`

**Interfaces:**
- Produces npm scripts:
  - `npm run test:node`
  - `npm run test:e2e`
  - `npm run check:js`
- Playwright accepts `BASE_URL`; defaults to a local server URL only when explicitly started by the caller.

- [ ] **Step 1: Add the failing browser/CI contracts**

Create tests that assert:
- 1440x900, 1280x720, and 390x844 projects exist;
- the smoke test checks Command Center visibility;
- KNOW / ASK / DECIDE / PROVE / ACT text is visible;
- human authorization and controlled-simulation copy exists;
- mobile page-level horizontal overflow is rejected;
- browser console/page errors fail the test.

- [ ] **Step 2: Run the new Playwright/config validation and confirm the initial failure**

Run:
```bash
npm run test:e2e
```

Expected: FAIL before dependency/config setup is complete or before a target server is available.

- [ ] **Step 3: Create `package.json`**

Pin only the required dev dependency:
- `@playwright/test`

Add:
- `test:node`: `node --test tests/web.test.mjs tests/ui-state.test.mjs tests/ui-contract.test.mjs tests/analytics.test.mjs`
- `check:js`: syntax-check all `public/*.js` and `public/*.mjs`
- `test:e2e`: `playwright test`

- [ ] **Step 4: Create Playwright config and smoke test**

The smoke test must use `process.env.BASE_URL` and must not attempt authenticated Firebase behavior yet.

- [ ] **Step 5: Extend `.github/workflows/ci.yml`**

The web job must:
1. checkout;
2. Node 22;
3. `npm ci`;
4. `npm run check:js`;
5. `npm run test:node`.

Add a browser job that:
1. depends on web;
2. installs Playwright Chromium;
3. serves `public/` locally with a minimal static server;
4. runs the smoke tests.

Keep the Python job unchanged except for clear job naming.

- [ ] **Step 6: Run Node and Playwright smoke verification locally**

Run:
```bash
npm ci
npm run check:js
npm run test:node
npx playwright install chromium
python -m http.server 4173 -d public &
BASE_URL=http://127.0.0.1:4173 npm run test:e2e
```

Expected: all commands PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json playwright.config.mjs tests/e2e/smoke.spec.mjs .github/workflows/ci.yml
git commit -m "ci: add full web and browser verification"
```

---

### Task 2: Add a reproducible GitHub Codespaces environment

**Files:**
- Create: `.devcontainer/devcontainer.json`
- Create: `.devcontainer/post-create.sh`
- Modify: `.gitignore`
- Modify: `README.md`

**Interfaces:**
- Codespace post-create command installs Python requirements and npm dependencies.
- Firebase CLI remains invoked with `npx firebase-tools@latest` rather than globally persisting credentials.

- [ ] **Step 1: Add a failing static contract test**

Add a small Node test or shell validation that asserts:
- devcontainer uses a Node 22-compatible image;
- Python 3.12 feature is configured;
- post-create script installs both `requirements.txt` and npm dependencies;
- no Firebase token/service-account secret is embedded.

- [ ] **Step 2: Run the contract and confirm failure**

Expected: FAIL because devcontainer files do not exist.

- [ ] **Step 3: Create devcontainer files**

Use a standard Microsoft devcontainer base and keep configuration minimal.

Post-create must run:
```bash
python -m pip install -r requirements.txt
npm ci
```

Document Playwright browser installation as:
```bash
npx playwright install --with-deps chromium
```

- [ ] **Step 4: Update README**

Add a short **Cloud Development** section covering:
- opening Codespaces;
- verification commands;
- Firebase CLI project check;
- no local PC dependency.

- [ ] **Step 5: Run the static contract again**

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .devcontainer .gitignore README.md
git commit -m "dev: add reproducible Codespaces environment"
```

---

### Task 3: Add a safe Firebase preview deployment workflow

**Files:**
- Create: `.github/workflows/firebase-preview.yml`
- Create: `scripts/extract-firebase-preview-url.mjs`
- Create: `tests/firebase-preview-workflow.test.mjs`

**Interfaces:**
- Workflow inputs:
  - optional `channel_id`, default `premium-workspace`
- Repository/environment variables:
  - `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - `GCP_SERVICE_ACCOUNT`
  - `FIREBASE_PROJECT_ID` = `varelyx-ai-builder-cup`
- Produces:
  - Firebase Hosting preview URL in `GITHUB_STEP_SUMMARY`
  - `PREVIEW_URL` for later Playwright step.

- [ ] **Step 1: Write failing workflow-structure tests**

Assert:
- permissions include `contents: read` and `id-token: write`;
- workflow does not use `FIREBASE_TOKEN` or a service-account JSON secret;
- full Node/Python tests run before auth/deploy;
- deploy command uses `hosting:channel:deploy`;
- no plain production `firebase deploy` command exists;
- Playwright runs against extracted preview URL;
- PR-origin gating prevents untrusted fork contexts from receiving deployment credentials.

- [ ] **Step 2: Run workflow test and confirm failure**

Run:
```bash
node --test tests/firebase-preview-workflow.test.mjs
```

Expected: FAIL because the workflow does not exist.

- [ ] **Step 3: Implement preview URL extractor**

Implement a small pure parser:
`extractPreviewUrl(output: string) -> string`

It must fail if no Firebase Hosting preview URL is found.

- [ ] **Step 4: Implement `firebase-preview.yml`**

Order:
1. checkout;
2. Node/Python setup;
3. npm/pip install;
4. syntax + Node tests + Python tests;
5. Google auth action using WIF variables;
6. Firebase preview deploy;
7. extract preview URL;
8. Playwright smoke against preview;
9. publish preview URL and result to summary.

Trigger initially with:
- `workflow_dispatch`

Only enable automatic trusted-repo PR deployment after WIF is confirmed.

- [ ] **Step 5: Run workflow-structure and parser tests**

Run:
```bash
node --test tests/firebase-preview-workflow.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/firebase-preview.yml scripts/extract-firebase-preview-url.mjs tests/firebase-preview-workflow.test.mjs
git commit -m "ci: add oidc firebase preview deployment"
```

---

### Task 4: Document one-time Google Cloud WIF and GitHub configuration

**Files:**
- Create: `docs/CLOUD_CI_SETUP.md`
- Modify: `docs/PREVIEW_REVIEW_CHECKLIST.md`
- Modify: `PROJECT_HANDOFF.md`

**Interfaces:**
- Produces exact user-owned setup steps and copy-paste commands.
- Documentation must never ask the user to paste secret material into chat.

- [ ] **Step 1: Add documentation contract tests**

Assert the setup doc includes:
- `gcloud auth login`;
- project `varelyx-ai-builder-cup`;
- enabling IAM Credentials and STS APIs;
- WIF pool/provider creation;
- GitHub repository attribute condition;
- dedicated deploy service account;
- service-account WIF binding;
- required GitHub variables;
- verification command;
- rollback/troubleshooting section;
- explicit “do not create/upload service-account JSON” guidance.

- [ ] **Step 2: Run docs contract and verify failure**

Expected: FAIL because the setup doc does not exist.

- [ ] **Step 3: Write `docs/CLOUD_CI_SETUP.md`**

Use placeholders only for generated resource identifiers, clearly labelled:
- `<PROJECT_NUMBER>`
- `<WORKLOAD_IDENTITY_POOL>`
- `<WORKLOAD_IDENTITY_PROVIDER>`
- `<SERVICE_ACCOUNT_EMAIL>`

Pin repository identity to:
- owner: `Saidur-droid`
- repository: `varelyx`

Document both:
- Cloud Shell path;
- Codespaces path.

- [ ] **Step 4: Update handoff/checklist**

Make PC-independent preview deployment the preferred path and Remote Desktop the fallback.

- [ ] **Step 5: Run docs contract**

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add docs/CLOUD_CI_SETUP.md docs/PREVIEW_REVIEW_CHECKLIST.md PROJECT_HANDOFF.md
git commit -m "docs: add cloud only ci setup guide"
```

---

### Task 5: Whole-system verification and first cloud handoff

**Files:**
- Modify only if verification finds defects.

**Interfaces:**
- Consumes Tasks 1-4.
- Produces a branch ready for the user's one-time Google/GitHub account configuration.

- [ ] **Step 1: Run all repository tests**

Run:
```bash
npm ci
npm run check:js
npm run test:node
node --test tests/firebase-preview-workflow.test.mjs
PYTHONPATH=. pytest -q
```

Expected: all PASS.

- [ ] **Step 2: Run local browser smoke**

Run:
```bash
python -m http.server 4173 -d public &
BASE_URL=http://127.0.0.1:4173 npm run test:e2e
```

Expected: PASS at all three configured viewports.

- [ ] **Step 3: Inspect GitHub Actions status**

If jobs still fail with no runner and `steps: null`, record this as a GitHub Actions/account blocker, not an application failure.

- [ ] **Step 4: Whole-branch review**

Review for:
- credential leakage;
- unsafe PR privilege escalation;
- accidental production deploy;
- non-Google runtime drift;
- broken existing CI;
- preview URL extraction brittleness.

- [ ] **Step 5: Present the one-time account setup to the user**

The user should perform the documented WIF/GitHub variable steps in `docs/CLOUD_CI_SETUP.md`.

- [ ] **Step 6: After the user completes account setup, run `Firebase Preview` workflow**

Expected:
- actual GitHub-hosted runner receives steps;
- WIF authentication succeeds;
- Firebase preview deploy succeeds;
- preview URL appears in workflow summary;
- Playwright smoke passes against the real preview.

- [ ] **Step 7: Keep production gated**

Do not add or trigger production deploy until the user reviews the actual preview URL and explicitly approves production release.
