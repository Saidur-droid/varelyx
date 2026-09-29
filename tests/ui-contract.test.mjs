import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');

for(const id of ['appShell','commandCenter','evidenceWorkspace','scenarioWorkspace','proofWorkspace','actionWorkspace','auditWorkspace','systemStatusBar']) {
  test('premium workspace includes #'+id,()=>assert.match(html,new RegExp('id=["\\\']'+id+'["\\\']')));
}

test('premium HTML contains no literal escaped newline artifacts',()=>assert.doesNotMatch(html,/\\\\n/));

test('scenario workspace includes direct comparison table',()=>assert.match(html,/id=["']strategyComparison["']/));
test('proof workspace exposes a copy receipt control',()=>assert.match(html,/id=["']copyReceiptBtn["']/));
test('human approval boundary is explicit',()=>assert.match(html,/HUMAN APPROVAL REQUIRED/));
test('external dispatch disclaimer is explicit',()=>assert.match(html,/No supplier, ERP, WMS or external purchasing system is contacted/));
test('simulation disclaimer is explicit',()=>assert.match(html,/Controlled simulation\.<\/b> Not observed retailer outcomes\./));
test('system status is text-labelled, not color-only',()=>{
  for(const text of ['Firebase connecting','Gemini not run','Review required','Proof not run','Save not verified']) assert.match(html,new RegExp(text));
});
test('responsive and keyboard accessibility contracts exist',()=>{
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
