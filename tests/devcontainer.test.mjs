import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=p=>readFile(new URL('../'+p, import.meta.url),'utf8');

test('devcontainer pins cloud development prerequisites without embedded secrets', async()=>{
  const raw=await read('.devcontainer/devcontainer.json');
  const config=JSON.parse(raw);
  const post=await read('.devcontainer/post-create.sh');
  assert.match(config.image,/node:22/);
  assert.equal(config.features['ghcr.io/devcontainers/features/python:1'].version,'3.12');
  assert.ok(config.features['ghcr.io/dhoeric/features/google-cloud-cli:1']);
  assert.match(post,/pip install -r requirements\.txt/);
  assert.match(post,/npm install/);
  assert.doesNotMatch(raw+post,/FIREBASE_TOKEN|service.account.*json|private_key/i);
});