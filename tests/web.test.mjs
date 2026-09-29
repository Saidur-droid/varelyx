import test from 'node:test';
import assert from 'node:assert/strict';
import {POLICY, capacityInput, initialState, applyExtraction, confirmEvidence, plansFor, metrics, cost,
  prove, unsafePlan, prepareApproval, validateExtraction, nextQuestion, restore, strategies} from '../public/core.mjs';
import {VerifiedSession, deadline} from '../public/session.mjs';
import {createRestTransport} from '../public/firebase-transport.mjs';

const source = 'Supplier B delivery 48 hours late. 2 routes affected. Thursday capacity not confirmed.';
const raw = () => ({supplier:'Supplier B', delay_hours:48, affected_routes:2, capacity_confirmed:null,
  summary:'Supplier delay and affected routes. Capacity unknown.', confidence:0.95,
  evidence_quotes:{delay_hours:'48 hours late',affected_routes:'2 routes affected',capacity_confirmed:null}});
const analyzed = () => applyExtraction(initialState(), raw(), source);
const ready = () => confirmEvidence(analyzed(), 120);
const balanced = s => plansFor(s).find(p => p.id === 'balanced');
function memory() {
  let data = null;
  return {read:async () => structuredClone(data), write:async (next, revision) => {
    if ((data?.revision ?? 0) !== revision) throw Error('conflict'); data = structuredClone(next);
  }};
}
test('baseline is 290 using the same scenarios as alternatives', () => {
  assert.equal(metrics(0,0,0).expected_stockout_cases,290);
  assert.equal(plansFor(ready())[0].expected_stockout_cases,290);
});
test('hero balanced plan retains expected quantities', () => {
  const p = balanced(ready());
  assert.deepEqual([p.transfer_cases,p.supplier_b_cases,p.emergency_cases,p.cash_required_bdt,p.expected_stockout_cases],[90,120,60,186000,30]);
});
test('empty capacity is not interpreted as zero', () => {
  for (const input of ['', ' ', '-1', '1.5', 'NaN', 'Infinity', '10001', '1e2']) assert.throws(() => capacityInput(input));
  assert.equal(capacityInput('0'),0); assert.equal(capacityInput('120'),120);
});
test('Gemini numbers require operator confirmation', () => {
  const s=analyzed(); assert.equal(s.supplierCapacity,null); assert.equal(s.evidenceReviewed,false);
  assert.equal(confirmEvidence(s,120).supplierCapacity,120);
});
test('low confidence remains HOLD and cannot be confirmed', async () => {
  const s=applyExtraction(initialState(),{...raw(),confidence:0.5},source);
  assert.throws(() => confirmEvidence(s,120),/Low-confidence/);
  assert.equal((await prove(balanced(s),s)).status,'HOLD');
});
test('missing routes prevents confirmation', () => {
  const r=raw(); r.affected_routes=null;
  assert.throws(() => confirmEvidence(applyExtraction(initialState(),r,source),120),/route count/);
});
test('unknown supplier is not silently treated as Supplier B', () => {
  assert.throws(() => confirmEvidence(applyExtraction(initialState(),{...raw(),supplier:null},source),120),/Supplier B only/);
});
test('unsupported fields, numbers and source quotations are rejected', () => {
  for (const value of [-10,1.5,'48',undefined,Infinity]) assert.throws(() => validateExtraction({...raw(),delay_hours:value},source));
  assert.throws(() => validateExtraction({...raw(),delay_hours:72},source),/Unsupported number/);
  const r=raw(); r.evidence_quotes.delay_hours='48 hours missing from source';
  assert.throws(() => validateExtraction(r,source),/Ungrounded/);
  assert.throws(() => validateExtraction({...raw(),confidence:2},source));
});
test('Bangla digits are grounded without changing the source', () => {
  const r=raw(); r.evidence_quotes.delay_hours='\u09ea\u09ee hours late'; r.evidence_quotes.affected_routes='\u09e8 routes affected';
  assert.equal(validateExtraction(r,'Supplier B \u09ea\u09ee hours late. \u09e8 routes affected.').delay_hours,48);
});
test('updated evidence invalidates previous confirmation and proof', async () => {
  let s=ready(); s.proof=await prove(balanced(s),s);
  s=applyExtraction(s,raw(),source);
  assert.equal(s.proof,null); assert.equal(s.supplierCapacity,null); assert.equal(s.evidenceReviewed,false);
});
test('route evidence changes computed feasible transfer limit', () => {
  const r=raw(); r.affected_routes=5; r.evidence_quotes.affected_routes='5 routes affected';
  const s=confirmEvidence(applyExtraction(initialState(),r,source.replace('2 routes','5 routes')),120);
  assert.equal(balanced(s).transfer_cases,0);
});
test('next question uses re-solving, not an invented score', () => {
  const q=nextQuestion(initialState()); assert.equal(q.top.key,'supplier_b_thursday_capacity');
  assert.ok(q.top.score>0); assert.equal(q.candidates.length,2);
  assert.equal(nextQuestion(ready()).top,null);
});
test('proof holds without evidence and passes reviewed hero flow', async () => {
  const empty=initialState(); assert.equal((await prove(balanced(empty),empty)).status,'HOLD');
  const s=ready(); assert.equal((await prove(balanced(s),s)).status,'PASS');
});
test('unsafe proposal is blocked', async () => { assert.equal((await prove(unsafePlan(),ready())).status,'BLOCK'); });
test('negative, fractional and nonfinite quantities are blocked', async () => {
  const s=ready(); for (const value of [-10,1.5,NaN,Infinity]) assert.equal((await prove({...balanced(s),transfer_cases:value},s)).status,'BLOCK');
});
test('cash is independently recalculated, not trusted', async () => {
  const s=ready(); assert.equal((await prove({...balanced(s),cash_required_bdt:0},s)).status,'BLOCK');
});
test('emergency capacity is independently checked', async () => {
  const s=ready(); const p={...balanced(s),supplier_b_cases:0,emergency_cases:110}; p.cash_required_bdt=cost(p);
  const proof=await prove(p,s); assert.equal(proof.status,'BLOCK');
  assert.equal(proof.checks.find(c=>c.name==='Emergency supplier capacity').status,'BLOCK');
});
test('receipt is reproducible, full SHA-256 and bound to inputs', async () => {
  const s=ready(), p=balanced(s), a=await prove(p,s), b=await prove(p,s);
  assert.match(a.receipt_hash,/^[a-f0-9]{64}$/); assert.equal(a.receipt_hash,b.receipt_hash);
  const changed={...p,emergency_cases:50}; changed.cash_required_bdt=cost(changed);
  assert.notEqual(a.receipt_hash,(await prove(changed,s)).receipt_hash);
  assert.notEqual(a.receipt_hash,(await prove(p,{...s,source:source+' New message.'})).receipt_hash);
});
test('approval is sandbox-only and exact decision replay is blocked', async () => {
  const approved=await prepareApproval(ready()); assert.equal(approved.actions.length,5);
  assert.ok(approved.actions.every(a=>a.status==='APPROVED_SANDBOX'));
  await assert.rejects(()=>prepareApproval(approved),/already been recorded/);
  await assert.rejects(()=>prepareApproval(initialState()),/Approval blocked/);
});
test('zero capacity, MOQ boundaries and route scenarios never violate encoded constraints', async () => {
  for (const cap of [0,1,49,50,51,120,10000]) for (const routes of [0,2,3,5,10]) {
    const r=raw(); r.affected_routes=routes; r.evidence_quotes.affected_routes=routes+' routes affected';
    const s=confirmEvidence(applyExtraction(initialState(),r,source.replace('2 routes',routes+' routes')),cap);
    for (const p of plansFor(s)) assert.equal((await prove(p,s)).status,'PASS',JSON.stringify({cap,routes,p}));
  }
});
test('invalid solver capacity is rejected', () => { assert.throws(()=>strategies(-1,2)); });
test('empty arrays survive JSON envelope restoration', () => {
  const restored=restore(JSON.stringify(initialState())); assert.deepEqual(restored.actions,[]);
  assert.throws(()=>restore('{}')); assert.throws(()=>restore('not json'));
});
test('save succeeds only after matching remote read-back', async () => {
  const m=memory(), s=new VerifiedSession(m); await s.load(); const envelope=await s.save(ready());
  assert.equal(envelope.revision,1); assert.equal(s.revision,1);
  const fresh=new VerifiedSession(m); const payload=await fresh.load(); assert.equal(restore(payload).supplierCapacity,120);
});
test('permission denied is visible and blocks automatic retries', async () => {
  const s=new VerifiedSession({read:async()=>null,write:async()=>{throw Error('permission denied');}});
  await assert.rejects(()=>s.save(ready()),/NOT VERIFIED/); assert.equal(s.blocked,true);
  await assert.rejects(()=>s.save(ready()),/Reload/);
});
test('read-back mismatch never claims success', async () => {
  const s=new VerifiedSession({read:async()=>null,write:async()=>{}});
  await assert.rejects(()=>s.save(ready()),/did not verify/); assert.equal(s.revision,0);
});
test('concurrent tabs cannot overwrite a newer revision', async () => {
  const m=memory(), a=new VerifiedSession(m), b=new VerifiedSession(m); await a.load(); await b.load();
  await a.save(ready()); await assert.rejects(()=>b.save(ready()),/conflict/);
});
test('timeout rejects instead of pretending success', async () => { await assert.rejects(()=>deadline(new Promise(()=>{}),5),/timed out/); });
function restFixture(options={}) {
  const calls=[]; let data=null, etag='"0"';
  const transport=createRestTransport({databaseURL:'https://test.firebasedatabase.app',user:{uid:'test-user',getIdToken:async()=>'test-id-token'},
    appCheckToken:async()=>'test-appcheck',fetchImpl:async(url, init)=>{
      calls.push({url,init});
      if (options.denied) return new Response('{}',{status:401});
      if (init.method==='GET') return new Response(JSON.stringify(data),{headers:options.missingEtag?{}:{etag}});
      if (options.conflict || init.headers['if-match']!==etag) return new Response('{}',{status:412});
      data=JSON.parse(init.body); etag='"'+data.revision+'"'; return new Response(JSON.stringify(data));
    }});
  return {transport,calls};
}
test('Firebase transport uses scoped authenticated no-cache reads and conditional writes', async () => {
  const {transport,calls}=restFixture(), session=new VerifiedSession(transport); await session.load(); await session.save(ready());
  assert.ok(calls.every(c=>new URL(c.url).pathname==='/demoSessions/test-user/verified_v2.json'));
  assert.ok(calls.every(c=>c.init.cache==='no-store' && c.init.headers['X-Firebase-AppCheck']==='test-appcheck'));
  assert.ok(calls.some(c=>c.init.method==='PUT' && c.init.headers['if-match']==='"0"'));
});
test('Firebase denied read is not mistaken for an empty session', async () => {
  await assert.rejects(()=>restFixture({denied:true}).transport.read(),/HTTP 401/);
});
test('Firebase missing ETag never falls back to unconditional write', async () => {
  await assert.rejects(()=>restFixture({missingEtag:true}).transport.write({revision:1},0),/ETag missing/);
});
test('Firebase conditional conflict is reported', async () => {
  await assert.rejects(()=>restFixture({conflict:true}).transport.write({revision:1},0),/another tab/);
});
