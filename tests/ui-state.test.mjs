import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState, applyExtraction, confirmEvidence, plansFor, prove} from '../public/core.mjs';
import {buildViewModel, getStageState, getPrimaryAction} from '../public/ui-state.mjs';

const source = 'Supplier B delivery 48 hours late. 2 routes affected. Thursday capacity not confirmed.';
const raw = () => ({supplier:'Supplier B',delay_hours:48,affected_routes:2,capacity_confirmed:null,
  summary:'Supplier delay and affected routes. Capacity unknown.',confidence:0.95,
  evidence_quotes:{delay_hours:'48 hours late',affected_routes:'2 routes affected',capacity_confirmed:null}});
const analyzed = () => applyExtraction(initialState(), raw(), source);
const ready = () => confirmEvidence(analyzed(),120);

test('fresh session keeps Signal active and asks for analysis', () => {
  const vm=buildViewModel(initialState(),'',true,null);
  assert.equal(getStageState(vm).signal,'active');
  assert.equal(getPrimaryAction(vm).id,'analyze');
  assert.equal(vm.system.gemini,'NOT_RUN');
});

test('disconnected workspace disables primary analysis action', () => {
  const vm=buildViewModel(initialState(),'',false,null);
  assert.equal(getPrimaryAction(vm).disabled,true);
});

test('verified extraction without review keeps Evidence active and HOLD', () => {
  const vm=buildViewModel(analyzed(),source,true,null);
  assert.equal(getStageState(vm).evidence,'active');
  assert.equal(vm.decision.status,'HOLD');
  assert.equal(getPrimaryAction(vm).id,'review-evidence');
});

test('reviewed evidence marks Decision ready', () => {
  const vm=buildViewModel(ready(),source,true,null);
  assert.equal(getStageState(vm).decision,'active');
  assert.equal(vm.decision.status,'READY');
  assert.equal(getPrimaryAction(vm).id,'prove-balanced');
});

test('PASS moves Action to active', async () => {
  const state=ready();
  state.proof=await prove(plansFor(state).find(p=>p.id==='balanced'),state);
  const vm=buildViewModel(state,source,true,{verified:true});
  assert.equal(getStageState(vm).proof,'complete');
  assert.equal(getStageState(vm).action,'active');
  assert.equal(getPrimaryAction(vm).id,'approve');
  assert.equal(vm.system.save,'VERIFIED');
});

test('edited evidence after PASS marks proof stale and prevents approval', async () => {
  const state=ready();
  state.proof=await prove(plansFor(state).find(p=>p.id==='balanced'),state);
  const vm=buildViewModel(state,source+' changed',true,{verified:true});
  assert.equal(vm.decision.stale,true);
  assert.equal(vm.system.proof,'STALE');
  assert.notEqual(getPrimaryAction(vm).id,'approve');
});
