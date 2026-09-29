# Varelyx Cloud-Only CI/CD Setup

This removes the Windows PC from the release path.

Target: **GitHub Actions -> Google OIDC/WIF -> Firebase Hosting preview -> Playwright QA**.
Codespaces is the interactive cloud fallback. Remote Desktop is optional.

Do **not** create/upload service-account JSON. Do **not** use `FIREBASE_TOKEN`.

## A. One-time Google Cloud bootstrap

Recommended: open Google Cloud Shell and run this entire block.

```bash
set -euo pipefail

PROJECT_ID="varelyx-ai-builder-cup"
GITHUB_REPO="Saidur-droid/varelyx"
WORKLOAD_IDENTITY_POOL="github-actions"
WORKLOAD_IDENTITY_PROVIDER="varelyx"
SA_NAME="varelyx-github-deploy"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

gcloud auth login
gcloud config set project "$PROJECT_ID"

gcloud services enable   iamcredentials.googleapis.com   sts.googleapis.com   firebasehosting.googleapis.com   firebase.googleapis.com   serviceusage.googleapis.com

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"

gcloud iam workload-identity-pools describe "$WORKLOAD_IDENTITY_POOL"   --project="$PROJECT_ID" --location=global >/dev/null 2>&1 || gcloud iam workload-identity-pools create "$WORKLOAD_IDENTITY_POOL"   --project="$PROJECT_ID" --location=global --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers describe "$WORKLOAD_IDENTITY_PROVIDER"   --project="$PROJECT_ID" --location=global   --workload-identity-pool="$WORKLOAD_IDENTITY_POOL" >/dev/null 2>&1 || gcloud iam workload-identity-pools providers create-oidc "$WORKLOAD_IDENTITY_PROVIDER"   --project="$PROJECT_ID"   --location=global   --workload-identity-pool="$WORKLOAD_IDENTITY_POOL"   --display-name="Varelyx GitHub Actions"   --issuer-uri="https://token.actions.githubusercontent.com"   --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner,attribute.ref=assertion.ref"   --attribute-condition="assertion.repository=='Saidur-droid/varelyx'"

gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" >/dev/null 2>&1 || gcloud iam service-accounts create "$SA_NAME"   --project="$PROJECT_ID"   --display-name="Varelyx GitHub Firebase Preview Deployer"

POOL_NAME="$(gcloud iam workload-identity-pools describe "$WORKLOAD_IDENTITY_POOL"   --project="$PROJECT_ID" --location=global --format='value(name)')"

PROVIDER_NAME="$(gcloud iam workload-identity-pools providers describe "$WORKLOAD_IDENTITY_PROVIDER"   --project="$PROJECT_ID" --location=global   --workload-identity-pool="$WORKLOAD_IDENTITY_POOL" --format='value(name)')"

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL"   --project="$PROJECT_ID"   --role="roles/iam.workloadIdentityUser"   --member="principalSet://iam.googleapis.com/$POOL_NAME/attribute.repository/$GITHUB_REPO"

gcloud projects add-iam-policy-binding "$PROJECT_ID"   --member="serviceAccount:$SA_EMAIL"   --role="roles/firebasehosting.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID"   --member="serviceAccount:$SA_EMAIL"   --role="roles/serviceusage.serviceUsageConsumer"

echo "PROJECT_NUMBER=$PROJECT_NUMBER"
echo "GCP_WORKLOAD_IDENTITY_PROVIDER=$PROVIDER_NAME"
echo "GCP_SERVICE_ACCOUNT=$SA_EMAIL"
```

The printed **PROJECT_NUMBER**, **WORKLOAD_IDENTITY_POOL**, **WORKLOAD_IDENTITY_PROVIDER**, and **SERVICE_ACCOUNT_EMAIL** values are identifiers, not passwords.

## B. GitHub variables and preview environment

Run from Codespaces or any shell with GitHub CLI:

```bash
gh auth status || gh auth login

REPO="Saidur-droid/varelyx"
FIREBASE_PROJECT_ID="varelyx-ai-builder-cup"

# Replace these two placeholders with the values printed by section A.
GCP_WORKLOAD_IDENTITY_PROVIDER="<projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions/providers/varelyx>"
GCP_SERVICE_ACCOUNT="<SERVICE_ACCOUNT_EMAIL>"

gh variable set FIREBASE_PROJECT_ID --repo "$REPO" --body "$FIREBASE_PROJECT_ID"
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --repo "$REPO" --body "$GCP_WORKLOAD_IDENTITY_PROVIDER"
gh variable set GCP_SERVICE_ACCOUNT --repo "$REPO" --body "$GCP_SERVICE_ACCOUNT"

gh api --method PUT "repos/$REPO/environments/preview" >/dev/null
gh variable list --repo "$REPO"
```

## C. Root-cause checks for current GitHub Actions failure

Current failed jobs show no runner and `steps: null`. That means workflow code never started.

Run:

```bash
REPO="Saidur-droid/varelyx"

gh api "repos/$REPO/actions/permissions"
gh api "repos/$REPO/actions/permissions/workflow"
gh run list --repo "$REPO" --limit 10
```

Then check:
1. Repo -> **Settings -> Actions -> General**: Actions enabled.
2. GitHub account -> **Settings -> Billing and licensing / Usage**: Actions minutes/spending not exhausted or blocked.
3. Repo -> **Actions** -> newest failed run: read the pre-job banner for billing/policy/hosted-runner restrictions.

Do not keep changing application code for a job that never got a runner.

## D. Codespaces verification

Open **Repo -> Code -> Codespaces -> Create codespace**.

The devcontainer provides Node 22, Python 3.12, GitHub CLI, and Google Cloud CLI.

Run:

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

## E. Trigger automatic Firebase preview

After WIF variables exist and GitHub-hosted runners work:

```bash
gh workflow run "Firebase Preview"   --repo Saidur-droid/varelyx   --ref fix/firebase-verification-20260929   -f channel_id=premium-workspace

sleep 5

gh run list   --repo Saidur-droid/varelyx   --workflow "Firebase Preview"   --limit 3
```

Then open the newest run in GitHub Actions. Its job summary will contain the real Firebase preview URL if deployment succeeds.

## F. PC-independent manual fallback

If GitHub-hosted runners are still account-blocked, use Codespaces:

```bash
gcloud auth login
gcloud config set project varelyx-ai-builder-cup

npx --yes firebase-tools@latest projects:list
npx --yes firebase-tools@latest hosting:channel:deploy   premium-workspace   --project varelyx-ai-builder-cup
```

This is still PC-independent, but manual. Automatic GitHub Actions remains the target.

## G. Preview-domain security

After Firebase returns the preview URL:
- verify Firebase Authentication accepts that preview host;
- verify reCAPTCHA Enterprise / App Check permits that preview host;
- do not disable App Check;
- do not loosen Realtime Database rules.

## Troubleshooting

### Failed to generate Google Cloud federated token
Check the WIF provider attribute mapping and condition. `attribute.repository` must map from `assertion.repository`, and the accepted repo is exactly `Saidur-droid/varelyx`.

### Failed to generate OAuth 2.0 Access Token
Check `roles/iam.workloadIdentityUser` on the service account and the exact `principalSet` path.

### Firebase CLI permission denied
Verify the deploy service account has:
- `roles/firebasehosting.admin`
- `roles/serviceusage.serviceUsageConsumer`

Do not grant Owner as a shortcut.

### Jobs still show steps: null
This occurs before workflow code runs. Fix repository Actions policy / account Actions usage or billing. Codespaces remains the cloud fallback.

### Preview deploy succeeds but Playwright fails
Keep the preview URL for debugging, fix the browser/runtime failure, then rerun. Do not promote production.
