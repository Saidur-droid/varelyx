#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-varelyx-ai-builder-cup}"
GITHUB_REPO="${GITHUB_REPO:-Saidur-droid/varelyx}"
GITHUB_REPOSITORY_ID="${GITHUB_REPOSITORY_ID:-1363183610}"
GITHUB_OWNER_ID="${GITHUB_OWNER_ID:-306319519}"
POOL="${WORKLOAD_IDENTITY_POOL:-github-actions}"
PROVIDER="${WORKLOAD_IDENTITY_PROVIDER:-varelyx}"
SA_NAME="${SERVICE_ACCOUNT_NAME:-varelyx-github-deploy}"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
WORKFLOW_REF="$GITHUB_REPO/.github/workflows/firebase-preview.yml@refs/heads/main"

command -v gcloud >/dev/null || { echo "gcloud CLI is required" >&2; exit 2; }
ACTIVE_ACCOUNT="$(gcloud auth list --filter=status:ACTIVE --format='value(account)' | head -n1)"
[ -n "$ACTIVE_ACCOUNT" ] || { echo "Authenticate first with: gcloud auth login" >&2; exit 3; }

gcloud config set project "$PROJECT_ID" >/dev/null
gcloud services enable iamcredentials.googleapis.com sts.googleapis.com firebasehosting.googleapis.com firebase.googleapis.com serviceusage.googleapis.com

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"

gcloud iam workload-identity-pools describe "$POOL" --project="$PROJECT_ID" --location=global >/dev/null 2>&1 ||
  gcloud iam workload-identity-pools create "$POOL" --project="$PROJECT_ID" --location=global --display-name="GitHub Actions"

MAPPING="google.subject=assertion.repository_id,attribute.repository_id=assertion.repository_id,attribute.repository_owner_id=assertion.repository_owner_id,attribute.ref=assertion.ref,attribute.environment=assertion.environment,attribute.workflow_ref=assertion.workflow_ref,attribute.event_name=assertion.event_name"
CONDITION="assertion.repository_id=='$GITHUB_REPOSITORY_ID' && assertion.repository_owner_id=='$GITHUB_OWNER_ID' && assertion.ref=='refs/heads/main' && assertion.environment=='preview' && assertion.event_name=='workflow_dispatch' && assertion.workflow_ref=='$WORKFLOW_REF'"

if gcloud iam workload-identity-pools providers describe "$PROVIDER" --project="$PROJECT_ID" --location=global --workload-identity-pool="$POOL" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers update-oidc "$PROVIDER" --project="$PROJECT_ID" --location=global --workload-identity-pool="$POOL" --issuer-uri="https://token.actions.githubusercontent.com" --attribute-mapping="$MAPPING" --attribute-condition="$CONDITION"
else
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" --project="$PROJECT_ID" --location=global --workload-identity-pool="$POOL" --display-name="Varelyx GitHub Actions" --issuer-uri="https://token.actions.githubusercontent.com" --attribute-mapping="$MAPPING" --attribute-condition="$CONDITION"
fi

gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" >/dev/null 2>&1 ||
  gcloud iam service-accounts create "$SA_NAME" --project="$PROJECT_ID" --display-name="Varelyx GitHub Firebase Preview Deployer"

POOL_NAME="$(gcloud iam workload-identity-pools describe "$POOL" --project="$PROJECT_ID" --location=global --format='value(name)')"
PROVIDER_NAME="$(gcloud iam workload-identity-pools providers describe "$PROVIDER" --project="$PROJECT_ID" --location=global --workload-identity-pool="$POOL" --format='value(name)')"

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" --project="$PROJECT_ID" --role="roles/iam.workloadIdentityUser" --member="principalSet://iam.googleapis.com/$POOL_NAME/attribute.repository_id/$GITHUB_REPOSITORY_ID" >/dev/null
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$SA_EMAIL" --role="roles/firebasehosting.admin" >/dev/null
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$SA_EMAIL" --role="roles/serviceusage.serviceUsageConsumer" >/dev/null

echo "FIREBASE_PROJECT_ID=$PROJECT_ID"
echo "GCP_WORKLOAD_IDENTITY_PROVIDER=$PROVIDER_NAME"
echo "GCP_SERVICE_ACCOUNT=$SA_EMAIL"

if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  gh variable set FIREBASE_PROJECT_ID --repo "$GITHUB_REPO" --body "$PROJECT_ID"
  gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --repo "$GITHUB_REPO" --body "$PROVIDER_NAME"
  gh variable set GCP_SERVICE_ACCOUNT --repo "$GITHUB_REPO" --body "$SA_EMAIL"
  gh api --method PUT "repos/$GITHUB_REPO/environments/preview" >/dev/null
  echo "GitHub variables and preview environment configured."
else
  echo "gh CLI is not authenticated; set the three printed repository variables manually."
fi
