import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnalyticsAdapter} from '../public/analytics.mjs';

test('unconfigured analytics never throws', () => {
  const a=createAnalyticsAdapter();
  assert.doesNotThrow(()=>a.capture('demo_session_started',{mode:'demo'}));
});

test('provider failures never block product flow', () => {
  const a=createAnalyticsAdapter({capture(){throw Error('down')}});
  assert.doesNotThrow(()=>a.capture('proof_passed',{status:'PASS'}));
});

test('raw supplier evidence is stripped', () => {
  let seen;
  const a=createAnalyticsAdapter({capture(name,props){seen={name,props}}});
  a.capture('gemini_analysis_verified',{source:'secret supplier text',rawEvidence:'secret',routes:2});
  assert.equal(seen.name,'gemini_analysis_verified');
  assert.equal(seen.props.source,undefined);
  assert.equal(seen.props.rawEvidence,undefined);
  assert.equal(seen.props.routes,2);
});
