import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState} from '../public/core.mjs';
import {buildViewModel, getStageState, getPrimaryAction} from '../public/ui-state.mjs';

test('fresh session keeps Signal active and asks for analysis', () => {
  const vm = buildViewModel(initialState(), '', true, null);
  assert.equal(getStageState(vm).signal, 'active');
  assert.equal(getPrimaryAction(vm).id, 'analyze');
  assert.equal(vm.system.gemini, 'NOT_RUN');
});
