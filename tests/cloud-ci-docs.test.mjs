import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p, import.meta.url),'utf8');

test('cloud CI setup pins keyless WIF to immutable repo and trusted main workflow', async()=>{
  const doc=await read('docs/CLOUD_CI_SETUP.md');
  for(const text of [
    'gcloud auth login','varelyx-ai-builder-cup','iamcredentials.googleapis.com','sts.googleapis.com',
    'workload-identity-pools create','providers create-oidc','providers update-oidc',
    'roles/iam.workloadIdentityUser','roles/firebasehosting.admin','roles/serviceusage.serviceUsageConsumer',
    'GCP_WORKLOAD_IDENTITY_PROVIDER','GCP_SERVICE_ACCOUNT','FIREBASE_PROJECT_ID',
    'repository_id','repository_owner_id','workflow_ref','workflow_dispatch','environment',
    '1363183610','306319519','refs/heads/main','firebase-preview.yml@refs/heads/main',
    'attribute.repository_id','gh variable set','service-account JSON','Troubleshooting',
    '--ref main','target_ref=fix/firebase-verification-20260929'
  ]) assert.ok(doc.toLowerCase().includes(text.toLowerCase()), text);
});