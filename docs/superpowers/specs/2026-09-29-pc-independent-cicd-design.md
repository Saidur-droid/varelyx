# Varelyx PC-Independent CI/CD Design

Date: 2026-09-29
Status: Design specification for review
Branch: `fix/firebase-verification-20260929`

## 1. Goal

Remove the Windows desktop as a release dependency.

The target operating model is:

**GitHub -> GitHub Actions -> Firebase Hosting preview -> automated browser QA**

with **GitHub Codespaces** as the interactive development/debugging environment and **Remote Desktop** as an optional fallback only.

The product runtime remains Firebase / Google Cloud and Gemini remains the primary GenAI integration.

## 2. Competition compliance

This architecture is compatible with the published AI Builder Cup 2026 requirements because:

- the working prototype remains deployed on Google Cloud / Firebase;
- Varelyx continues to integrate Gemini through Firebase AI Logic;
- GitHub Actions is only CI/CD automation, not the product runtime;
- GitHub Codespaces is only a development environment, not the submitted deployment;
- Playwright is only testing/QA tooling;
- the final submission can still expose the required deployed prototype, public GitHub repository, deck and public demo video.

Do not migrate the submitted product runtime to GitHub Pages, Vercel, Render, Supabase or another non-Google primary hosting platform.

Official rule references checked on 2026-09-29:
- AI Builder Cup FAQ: working prototype must be deployed on Cloud Run / GCP / Firebase and built on Google Cloud tech stack.
- AI Builder Cup Themes: submissions must use Google AI models such as Gemini/Gemma or eligible agentic platforms and deploy on Google Cloud via Cloud Run or Firebase.

## 3. Target architecture

### Pull request flow

```
Pull request / feature branch
        |
        v
GitHub Actions
  - syntax checks
  - Node tests
  - Python tests
  - Playwright static/browser smoke
        |
        v
Firebase Hosting preview channel
        |
        v
Preview smoke checks
        |
        v
Preview URL published to workflow summary / PR
```

### Production flow

```
Approved merge / manual workflow dispatch
        |
        v
GitHub Environment: production
        |
        v
manual reviewer approval
        |
        v
Firebase Hosting production deployment
```

Production deployment is not part of the first implementation pass. The immediate target is preview deployment only.

## 4. Authentication design

Preferred authentication:

**GitHub OpenID Connect -> Google Cloud Workload Identity Federation -> dedicated deploy service account**

Properties:

- no long-lived service-account JSON committed to the repository;
- no developer workstation Firebase login required for CI;
- GitHub Actions receives short-lived Google credentials;
- trust is restricted to this repository and, where practical, the intended branch/environment.

Do not store:
- service-account JSON in the repository;
- Firebase CLI login tokens in GitHub secrets;
- personal Google credentials in Codespaces.

If Workload Identity Federation cannot support a required Firebase CLI operation cleanly, stop and document the exact blocker before adopting any long-lived credential fallback.

## 5. GitHub Actions design

### Existing CI

Keep and extend `.github/workflows/ci.yml`.

It must run:
- JavaScript syntax checks;
- all Node test files;
- Python compile/test suite.

### Preview workflow

Create `.github/workflows/firebase-preview.yml`.

Trigger:
- `workflow_dispatch`;
- optionally pull requests after authentication is proven.

Workflow responsibilities:
1. checkout exact commit;
2. set up Node 22;
3. set up Python 3.12;
4. run full tests;
5. authenticate to Google via OIDC/WIF;
6. install/use Firebase CLI;
7. deploy Hosting preview channel `premium-workspace`;
8. capture returned preview URL;
9. run Playwright smoke tests against that URL;
10. publish URL and QA result into the Actions job summary.

The workflow must never run production `firebase deploy` without an explicit separate production gate.

## 6. Codespaces design

Create:
- `.devcontainer/devcontainer.json`

Codespace includes:
- Node 22;
- Python 3.12;
- Git;
- Firebase CLI availability through `npx firebase-tools`;
- Playwright dependencies or documented install step.

Codespaces is used for:
- running exact-branch tests;
- inspecting and fixing UI;
- manual Firebase preview troubleshooting;
- opening forwarded local ports.

Codespaces is not the production runtime.

## 7. Playwright design

Create:
- `package.json`
- `playwright.config.mjs`
- `tests/e2e/smoke.spec.mjs`

Initial browser QA is intentionally narrow and reliable.

Viewport coverage:
- 1440x900
- 1280x720
- 390x844

Checks:
- page loads without uncaught browser errors;
- Command Center is visible;
- KNOW / ASK / DECIDE / PROVE / ACT are visible;
- important controls remain reachable;
- page-level horizontal overflow does not occur at 390px;
- PASS / HOLD / BLOCK language exists;
- human authorization boundary exists;
- controlled-simulation disclaimer exists;
- proof receipt region can contain long text without page overflow.

Live Gemini/Firebase behavioral QA remains a separate authenticated preview step because it depends on App Check/Auth and live backend state.

## 8. Firebase preview domain requirements

After the first preview URL exists:

- verify Firebase Authentication accepts the preview host;
- verify App Check / reCAPTCHA Enterprise permits the preview host;
- do not disable App Check just to make preview testing easier;
- do not weaken Realtime Database owner-scoped rules.

If preview-domain authorization needs a console-side action, that is a user-owned account step and will be documented exactly.

## 9. GitHub environment and permissions

Required repository-level configuration may include:

- Actions enabled;
- workflow permissions sufficient for `id-token: write` and `contents: read`;
- optional GitHub Environment named `preview`;
- later GitHub Environment named `production` with required reviewer;
- WIF provider/service-account identifiers stored as non-secret repository/environment variables where appropriate.

No secret should be printed in workflow logs.

## 10. Failure behavior

If tests fail:
- do not deploy preview.

If OIDC/WIF authentication fails:
- stop before Firebase deploy and surface the auth error.

If preview deploy succeeds but browser QA fails:
- preserve the preview URL for debugging;
- mark the workflow failed;
- do not promote production.

If App Check/Auth rejects preview:
- do not weaken production protections automatically;
- surface the domain/configuration blocker.

If GitHub-hosted jobs continue to show `steps: null` and no runner:
- treat that as an account/Actions runner issue rather than an application-test failure;
- Codespaces remains the interactive fallback while the GitHub Actions account issue is diagnosed.

## 11. Security boundaries

- Firebase browser API key remains public client configuration; it is not a service-account credential.
- WIF trust is repository-scoped.
- Service-account permissions must be least privilege.
- No long-lived Google key material is committed.
- Analytics remains optional and non-blocking.
- Playwright artifacts must not contain credentials or private Firebase tokens.
- Public-repo conversion must happen only after a secret scan.

## 12. Files expected to change

Create:
- `.devcontainer/devcontainer.json`
- `.github/workflows/firebase-preview.yml`
- `package.json`
- `playwright.config.mjs`
- `tests/e2e/smoke.spec.mjs`
- `docs/CLOUD_CI_SETUP.md`

Modify:
- `.github/workflows/ci.yml`
- `.gitignore` if needed
- `PROJECT_HANDOFF.md`
- `docs/PREVIEW_REVIEW_CHECKLIST.md`

Do not modify the production Firebase configuration or database security rules merely to enable CI.

## 13. Acceptance criteria

The subsystem is complete when:

1. A Codespace can open the repo and run all Node/Python tests without relying on the user's PC.
2. GitHub Actions executes actual job steps instead of failing before runner assignment.
3. CI runs the full Node/Python suites and Playwright smoke checks.
4. GitHub Actions authenticates to Google Cloud using OIDC/WIF.
5. A Firebase Hosting preview channel is deployed from GitHub Actions.
6. The workflow exposes the real preview URL.
7. Playwright runs against the preview URL at desktop and mobile viewports.
8. Production is not deployed automatically.
9. The current Windows machine can be completely offline while steps 1-7 still work.

## 14. User-owned account setup boundary

The user may need to perform one-time Google Cloud / GitHub UI or CLI authorization steps for:

- enabling or configuring Workload Identity Federation;
- creating/binding the deployment service account;
- adding GitHub repository/environment variables;
- authorizing the Firebase preview domain in Auth/App Check if required.

The implementation documentation must provide exact copy-paste commands and click paths for these steps without asking the user to paste secrets into chat.
