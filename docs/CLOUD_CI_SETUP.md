# Varelyx Cloud-Only CI/CD Setup

Target: **GitHub Actions -> Google OIDC/WIF -> Firebase Hosting preview -> Playwright QA**. Codespaces is the interactive cloud fallback. Remote Desktop is optional.

Do **not** create or upload service-account JSON. Do **not** use `FIREBASE_TOKEN`.

## 0. Bootstrap the trusted controller

GitHub only accepts `workflow_dispatch` for workflows that exist on the default branch. Merge the infrastructure-only PR that adds `.github/workflows/firebase-preview.yml` to `main`. This does not merge the product redesign and does not deploy production.

The controller runs from `main`, only accepts `target_ref=fix/firebase-verification-20260929`, runs tests before authentication, rejects Firebase `predeploy` hooks, deploys only a Hosting preview channel, and performs Playwright QA in a separate job with no Google OIDC permission.

## A. One-time Google Cloud bootstrap

Run this whole block in Google Cloud Shell.

```bash
set -euo pipefail

PROJECT_ID="varelyx-ai-builder-cup"
GITHUB_REPO="Saidur-droid/varelyx"
GITHUB_REPOSITORY_ID="1363183610"
GITHUB_OWNER_ID="306319519"
WORKLOAD_IDENTITY_POOL="github-actions"
WORKLOAD_IDENTITY_PROVIDER="varelyx"
SERVICE_ACCOUNT_NAME="varelyx-github-deploy"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
WORKFLOW_REF="Saidur-droid/varelyx/.github/workflows/firebase-preview.yml@refs/heads/main"

gcloud auth login
gcloud config set project "$PROJECT_ID"

gcloud services enable   iamcredentials.googleapis.com   sts.googleapis.com   firebasehosting.googleapis.com   firebase.googleapis.com   serviceusage.googleapis.com

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"

gcloud iam workload-identity-pools describe "$WORKLOAD_IDENTITY_POOL"   --project="$PROJECT_ID" --location=global >/dev/null 2>&1 || gcloud iam workload-identity-pools create "$WORKLOAD_IDENTITY_POOL"   --project="$PROJECT_ID" --location=global --display-name="GitHub Actions"

ATTRIBUTE_MAPPING="google.subject=assertion.repository_id,attribute.repository_id=assertion.repository_id,attribute.repository_owner_id=assertion.repository_owner_id,attribute.ref=assertion.ref,attribute.environment=assertion.environment,attribute.workflow_ref=assertion.workflow_ref,attribute.event_name=assertion.event_name"
ATTRIBUTE_CONDITION="assertion.repository_id=='$GITHUB_REPOSITORY_ID' && assertion.repository_owner_id=='$GITHUB_OWNER_ID' && assertion.ref=='refs/heads/main' && assertion.environment=='preview' && assertion.event_name=='workflow_dispatch' && assertion.workflow_ref=='$WORKFLOW_REF'"

if gcloud iam workload-identity-pools providers describe "$WORKLOAD_IDENTITY_PROVIDER"   --project="$PROJECT_ID" --location=global   --workload-identity-pool="$WORKLOAD_IDENTITY_POOL" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers update-oidc "$WORKLOAD_IDENTITY_PROVIDER"     --project="$PROJECT_ID"     --location=global     --workload-identity-pool="$WORKLOAD_IDENTITY_POOL"     --issuer-uri="https://token.actions.githubusercontent.com"     --attribute-mapping="$ATTRIBUTE_MAPPING"     --attribute-condition="$ATTRIBUTE_CONDITION"
else
  gcloud iam workload-identity-pools providers create-oidc "$WORKLOAD_IDENTITY_PROVIDER"     --project="$PROJECT_ID"     --location=global     --workload-identity-pool="$WORKLOAD_IDENTITY_POOL"     --display-name="Varelyx GitHub Actions"     --issuer-uri="https://token.actions.githubusercontent.com"     --attribute-mapping="$ATTRIBUTE_MAPPING"     --attribute-condition="$ATTRIBUTE_CONDITION"
fi

gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL"   --project="$PROJECT_ID" >/dev/null 2>&1 || gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME"   --project="$PROJECT_ID"   --display-name="Varelyx GitHub Firebase Preview Deployer"

POOL_NAME="$(gcloud iam workload-identity-pools describe "$WORKLOAD_IDENTITY_POOL"   --project="$PROJECT_ID" --location=global --format='value(name)')"
PROVIDER_NAME="$(gcloud iam workload-identity-pools providers describe "$WORKLOAD_IDENTITY_PROVIDER"   --project="$PROJECT_ID" --location=global   --workload-identity-pool="$WORKLOAD_IDENTITY_POOL" --format='value(name)')"

gcloud iam service-accounts add-iam-policy-binding "$SERVICE_ACCOUNT_EMAIL"   --project="$PROJECT_ID"   --role="roles/iam.workloadIdentityUser"   --member="principalSet://iam.googleapis.com/$POOL_NAME/attribute.repository_id/$GITHUB_REPOSITORY_ID"

gcloud projects add-iam-policy-binding "$PROJECT_ID"   --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL"   --role="roles/firebasehosting.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID"   --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL"   --role="roles/serviceusage.serviceUsageConsumer"

printf '\nGCP_WORKLOAD_IDENTITY_PROVIDER=%s\nGCP_SERVICE_ACCOUNT=%s\n'   "$PROVIDER_NAME" "$SERVICE_ACCOUNT_EMAIL"
```

`PROJECT_NUMBER`, `WORKLOAD_IDENTITY_POOL`, `WORKLOAD_IDENTITY_PROVIDER`, and `SERVICE_ACCOUNT_EMAIL` are identifiers, not passwords.

## B. GitHub root-cause diagnostics and variables

Run from Codespaces or another shell with GitHub CLI.

```bash
set -euo pipefail
REPO="Saidur-droid/varelyx"

gh auth status || gh auth login

echo '=== ACTIONS PERMISSIONS ==='
gh api "repos/$REPO/actions/permissions"
echo '=== WORKFLOW DEFAULT PERMISSIONS ==='
gh api "repos/$REPO/actions/permissions/workflow"
echo '=== RECENT RUNS ==='
gh run list --repo "$REPO" --limit 10
```

If Actions reports `enabled: false`, enable it in **Repo -> Settings -> Actions -> General**. If jobs still fail before runner assignment with `steps: null`, check the repository owner's **Settings -> Billing and licensing / Usage** for exhausted private-repo Actions minutes, a zero/blocked spending setting, or a failed payment/entitlement warning. Do not keep modifying app code for a job that never obtained a runner.

Then set the three non-secret repository variables. Replace only the two angle-bracket placeholders with the values printed by section A.

```bash
set -euo pipefail
REPO="Saidur-droid/varelyx"

FIREBASE_PROJECT_ID="varelyx-ai-builder-cup"
GCP_WORKLOAD_IDENTITY_PROVIDER="<projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions/providers/varelyx>"
GCP_SERVICE_ACCOUNT="<SERVICE_ACCOUNT_EMAIL>"

gh variable set FIREBASE_PROJECT_ID --repo "$REPO" --body "$FIREBASE_PROJECT_ID"
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --repo "$REPO" --body "$GCP_WORKLOAD_IDENTITY_PROVIDER"
gh variable set GCP_SERVICE_ACCOUNT --repo "$REPO" --body "$GCP_SERVICE_ACCOUNT"

gh api --method PUT "repos/$REPO/environments/preview" >/dev/null
gh variable list --repo "$REPO"
```

## C. Codespaces exact-branch verification

Open a Codespace on branch `fix/firebase-verification-20260929`, then run:

```bash
set -euo pipefail

npm install --no-audit --no-fund
npm run check:js
npm run test:node
PYTHONPATH=. pytest -q

npx playwright install --with-deps chromium
python -m http.server 4173 -d public >/tmp/varelyx-http.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

for i in {1..20}; do
  curl -fsS http://127.0.0.1:4173/ >/dev/null && break
  sleep 1
done

BASE_URL=http://127.0.0.1:4173 npm run test:e2e
```

## D. Trigger the trusted Firebase Preview workflow

The workflow itself runs from `main`; it checks out the approved product branch through `target_ref`.

```bash
set -euo pipefail

gh workflow run "Firebase Preview"   --repo Saidur-droid/varelyx   --ref main   -f target_ref=fix/firebase-verification-20260929   -f channel_id=premium-workspace

sleep 5

gh run list   --repo Saidur-droid/varelyx   --workflow "Firebase Preview"   --limit 3
```

The deploy job summary preserves the real preview URL even if the later browser-smoke job fails.

## E. PC-independent manual fallback

If GitHub-hosted runners remain account-blocked, Codespaces still removes the PC dependency:

```bash
set -euo pipefail

gcloud auth login
gcloud config set project varelyx-ai-builder-cup
npx --yes firebase-tools@latest projects:list
npx --yes firebase-tools@latest hosting:channel:deploy   premium-workspace   --project varelyx-ai-builder-cup
```

## F. Preview-domain security

After Firebase returns the preview URL:
- verify Firebase Authentication accepts the preview host;
- verify reCAPTCHA Enterprise / App Check permits the preview host;
- do not disable App Check;
- do not loosen Realtime Database rules.

## Troubleshooting

### `workflow_dispatch` is missing
The trusted controller is not on `main` yet. Merge the infrastructure-only bootstrap PR first.

### Failed to generate Google Cloud federated token
Re-run section A. The provider update restores the immutable `repository_id`, `repository_owner_id`, `refs/heads/main`, `preview` environment, `workflow_dispatch`, and exact `workflow_ref` boundary.

### Failed to generate OAuth 2.0 Access Token
Check `roles/iam.workloadIdentityUser` and the `principalSet` using `attribute.repository_id`.

### Firebase CLI permission denied
Verify `roles/firebasehosting.admin` and `roles/serviceusage.serviceUsageConsumer`. Do not grant Owner as a shortcut.

### Jobs show `steps: null`
This occurs before workflow code runs. Fix repository Actions policy or the repository owner's Actions billing/usage entitlement. Codespaces remains the cloud fallback.

### Preview deploy succeeds but Playwright fails
Keep the preview URL, inspect the Playwright trace/screenshot, fix the browser/runtime failure, and rerun. Do not promote production.
