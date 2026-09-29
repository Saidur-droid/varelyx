import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');

for (const id of [
  'appShell',
  'commandCenter',
  'evidenceWorkspace',
  'scenarioWorkspace',
  'proofWorkspace',
  'actionWorkspace',
  'auditWorkspace',
  'systemStatusBar'
]) {
  test('premium workspace includes #' + id, () => {
    assert.match(html, new RegExp('id=["\\\']' + id + '["\\\']'));
  });
}
