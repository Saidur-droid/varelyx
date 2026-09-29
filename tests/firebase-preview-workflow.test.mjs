import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {extractPreviewUrl} from '../scripts/extract-firebase-preview-url.mjs';

const read=p=>readFile(new URL('../'+p, import.meta.url),'utf8');

test('preview URL parser finds Firebase Hosting URLs and rejects missing URLs',()=>{
  assert.equal(extractPreviewUrl('{"result":{"url":"https://varelyx-ai-builder-cup--premium-workspace-abc.web.app"}}'),'https://varelyx-ai-builder-cup--premium-workspace-abc.web.app');
  assert.equal(extractPreviewUrl('Preview URL: https://example--demo.web.app'),'https://example--demo.web.app');
  assert.throws(()=>extractPreviewUrl('{"status":"ok"}'),/preview URL/i);
});

test('preview workflow uses OIDC, gates deployment, and never deploys production', async()=>{
  const wf=await read('.github/workflows/firebase-preview.yml');
  assert.match(wf,/deploy:[\s\S]*permissions:[\s\S]*id-token:\s*write/);
  assert.match(wf,/smoke:[\s\S]*needs:\s*deploy/);
  assert.match(wf,/smoke:[\s\S]*permissions:[\s\S]*contents:\s*read/);
  assert.match(wf,/PREVIEW_URL:\s*\$\{\{\s*needs\.deploy\.outputs\.preview_url\s*\}\}/);
  assert.match(wf,/contents:\s*read/);
  assert.match(wf,/actions\/checkout@v7/);
  assert.match(wf,/google-github-actions\/auth@v3/);
  assert.match(wf,/project_id:\s*\$\{\{\s*env\.FIREBASE_PROJECT_ID\s*\}\}/);
  assert.match(wf,/GCP_WORKLOAD_IDENTITY_PROVIDER/);
  assert.match(wf,/GCP_SERVICE_ACCOUNT/);
  assert.match(wf,/FIREBASE_PROJECT_ID/);
  assert.match(wf,/npm run test:node/);
  assert.match(wf,/pytest -q/);
  assert.match(wf,/hosting:channel:deploy/);
  assert.match(wf,/predeploy hooks are not permitted/);
  assert.match(wf,/BASE_URL:.*PREVIEW_URL/);
  assert.doesNotMatch(wf,/FIREBASE_TOKEN|service.?account.*json/i);
  assert.doesNotMatch(wf,/firebase-tools@latest\s+deploy(?:\s|$)/);
  assert.match(wf,/target_ref:/);
  assert.match(wf,/ALLOWED_TARGET_REF/);
  assert.match(wf,/ref:\s*\$\{\{\s*inputs\.target_ref\s*\}\}/);
  assert.match(wf,/--ref main/);
  assert.doesNotMatch(wf,/pull_request:/);
  assert.doesNotMatch(wf,/scripts\/extract-firebase-preview-url\.mjs/);
});