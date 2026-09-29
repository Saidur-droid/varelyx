import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=p=>readFile(new URL('../'+p, import.meta.url),'utf8');

test('cloud CI setup documents complete keyless WIF bootstrap and root-cause diagnostics', async()=>{
  const doc=await read('docs/CLOUD_CI_SETUP.md');
  const required=[
    'gcloud auth login','varelyx-ai-builder-cup','iamcredentials.googleapis.com','sts.googleapis.com',
    'workload-identity-pools create','providers create-oidc','Saidur-droid/varelyx',
    'roles/iam.workloadIdentityUser','roles/firebasehosting.admin','roles/serviceusage.serviceUsageConsumer',
    'GCP_WORKLOAD_IDENTITY_PROVIDER','GCP_SERVICE_ACCOUNT','FIREBASE_PROJECT_ID',
    'gh variable set','gh api','service-account JSON','Troubleshooting',
    'PROJECT_NUMBER','WORKLOAD_IDENTITY_POOL','WORKLOAD_IDENTITY_PROVIDER','SERVICE_ACCOUNT_EMAIL'
  ];
  for(const text of required) assert.ok(doc.toLowerCase().includes(text.toLowerCase()), text);
});