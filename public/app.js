import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-ai.js";
import { firebaseConfig, recaptchaEnterpriseSiteKey } from "./firebase-config.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const PACK = 10;
const STARTING = 150;
const DONOR_CAP = 90;
const ROUTE_CAP = 90;
const CASH_CEILING = 240000;
const SUPPLIER_COST = 820;
const EMERGENCY_COST = 1280;
const TRANSFER_COST = 120;
const SUPPLIER_MOQ = 50;
const SCENARIOS = [380, 420, 460, 500];

let firebaseReady = false;
let geminiReady = false;
let db = null;
let uid = null;
let model = null;

function configured() {
  return firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("__") &&
    firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("__");
}

function appCheckConfigured() {
  return recaptchaEnterpriseSiteKey && !recaptchaEnterpriseSiteKey.startsWith("__");
}

function initialState() {
  return {
    phase: "EVIDENCE_REQUIRED",
    supplierCapacity: null,
    geminiVerified: false,
    geminiMode: "not-run",
    evidence: [
      { key:"eid_window", label:"Eid demand event", value:"6 days away", classification:"KNOWN", confidence:1, source:"controlled scenario" },
      { key:"supplier_delay", label:"Supplier B delivery delay", value:"48 hours", classification:"KNOWN", confidence:.94, source:"supplier message" },
      { key:"route_disruption", label:"Affected routes", value:2, classification:"KNOWN", confidence:.96, source:"operations alert" },
      { key:"demand_uplift", label:"Demand uplift range", value:"+12% to +28%", classification:"ESTIMATED", confidence:.78, source:"controlled scenario model" },
      { key:"supplier_b_thursday_capacity", label:"Supplier B Thursday capacity", value:null, classification:"UNKNOWN", confidence:0, source:"supplier confirmation required" }
    ],
    extraction: null,
    question: "Supplier B: what is the maximum confirmed number of cases you can deliver by Thursday?",
    strategies: buildStrategies(null),
    proof: null,
    actions: [],
    audit: [{event:"DEMO_RESET", at:new Date().toISOString()}],
    shadow: { baselineStockout:270, varelyxStockout:null, label:"Controlled scenario comparison" }
  };
}

let state = initialState();

function roundPack(v) { return Math.ceil(Math.max(0, v) / PACK) * PACK; }

function robustness(t,s,e) {
  const available = STARTING + t + s + e;
  return Math.round(100 * SCENARIOS.filter(d => available >= d).length / SCENARIOS.length);
}

function expectedShortage(t,s,e) {
  const available = STARTING + t + s + e;
  return Math.round(SCENARIOS.reduce((a,d)=>a+Math.max(0,d-available),0)/SCENARIOS.length);
}

function solve(capacity, shortagePenalty, emergencyPenalty, targetDemand) {
  let best = null;
  for (let t=0;t<=Math.min(DONOR_CAP,ROUTE_CAP);t+=PACK) {
    for (let s=0;s<=capacity;s+=PACK) {
      if (s>0 && s<SUPPLIER_MOQ) continue;
      for (let e=0;e<=100;e+=PACK) {
        const cash=t*TRANSFER_COST+s*SUPPLIER_COST+e*EMERGENCY_COST;
        if (cash>CASH_CEILING) continue;
        const sh=roundPack(Math.max(0,targetDemand-STARTING-t-s-e));
        const score=cash+sh*shortagePenalty+e*emergencyPenalty;
        const candidate={score,cash,shortage:sh,t,s,e};
        if(!best || candidate.score<best.score || (candidate.score===best.score && candidate.cash<best.cash)) best=candidate;
      }
    }
  }
  if(!best) throw new Error("No feasible plan under encoded constraints");
  return {
    transfer_cases:best.t,
    supplier_b_cases:best.s,
    emergency_cases:best.e,
    shortage_cases:best.shortage,
    cash_required_bdt:best.cash,
    robustness_pct:robustness(best.t,best.s,best.e),
    expected_stockout_cases:expectedShortage(best.t,best.s,best.e)
  };
}

function buildStrategies(capacity) {
  const cap = capacity ?? 0;
  const current={id:"current",name:"Current plan",objective:"No disruption response",transfer_cases:0,supplier_b_cases:0,emergency_cases:0,shortage_cases:270,cash_required_bdt:0,robustness_pct:robustness(0,0,0),expected_stockout_cases:expectedShortage(0,0,0)};
  const cheap={id:"cheapest",name:"Cheapest feasible",objective:"Minimize cash while limiting severe stockout",...solve(cap,900,350,380)};
  const balanced={id:"balanced",name:"Balanced robust",objective:"Balance service resilience and working capital",...solve(cap,2500,80,420)};
  const max={id:"max-availability",name:"Maximum availability",objective:"Prioritize service continuity under hard constraints",...solve(cap,10000,0,500)};
  return [current,cheap,balanced,max];
}

function unsafeCandidate() {
  const cap = state.supplierCapacity ?? 0;
  const supplier = roundPack(Math.max(SUPPLIER_MOQ, cap+80));
  const transfer = DONOR_CAP+40;
  const emergency = 100;
  const cash = transfer*TRANSFER_COST+supplier*SUPPLIER_COST+emergency*EMERGENCY_COST;
  return {id:"unverified-aggressive",name:"Unverified aggressive proposal",objective:"Proof-gate rejection demo",transfer_cases:transfer,supplier_b_cases:supplier,emergency_cases:emergency,shortage_cases:0,cash_required_bdt:cash,robustness_pct:100,expected_stockout_cases:0};
}

function prove(plan) {
  const checks=[];
  const unresolved=state.supplierCapacity===null;
  checks.push({name:"Decision-critical evidence",status:unresolved?"HOLD":"PASS",detail:unresolved?"Supplier B Thursday capacity unresolved.":"Material evidence resolved."});
  checks.push({name:"Working-capital ceiling",status:plan.cash_required_bdt<=CASH_CEILING?"PASS":"BLOCK",detail:`BDT ${plan.cash_required_bdt.toLocaleString()} required vs BDT ${CASH_CEILING.toLocaleString()} ceiling.`});
  checks.push({name:"Supplier B capacity",status:plan.supplier_b_cases<=(state.supplierCapacity??0)?"PASS":"BLOCK",detail:`Plan uses ${plan.supplier_b_cases} cases vs confirmed ${state.supplierCapacity??0}.`});
  checks.push({name:"Donor safety stock",status:plan.transfer_cases<=DONOR_CAP?"PASS":"BLOCK",detail:`Plan transfers ${plan.transfer_cases} cases vs safe transferable ${DONOR_CAP}.`});
  checks.push({name:"Route availability",status:plan.transfer_cases<=ROUTE_CAP?"PASS":"BLOCK",detail:`Route-constrained limit is ${ROUTE_CAP} cases.`});
  const moqOk=plan.supplier_b_cases===0||plan.supplier_b_cases>=SUPPLIER_MOQ;
  const packOk=[plan.transfer_cases,plan.supplier_b_cases,plan.emergency_cases].every(x=>x%PACK===0);
  checks.push({name:"MOQ and pack size",status:moqOk&&packOk?"PASS":"BLOCK",detail:`Supplier MOQ ${SUPPLIER_MOQ}; pack size ${PACK}.`});
  const statuses=new Set(checks.map(c=>c.status));
  const status=statuses.has("BLOCK")?"BLOCK":statuses.has("HOLD")?"HOLD":"PASS";
  const receipt=[plan.id,state.supplierCapacity,...checks.map(c=>c.status)].join("|").split("").reduce((h,c)=>((h<<5)-h+c.charCodeAt(0))|0,0);
  return {status,checks,strategy_id:plan.id,receipt_hash:Math.abs(receipt).toString(16),created_at:new Date().toISOString()};
}

async function connectFirebase() {
  if(!configured()) {
    $("#setupWarning").classList.remove("hidden");
    $("#cloudState").textContent="Local demo · Firebase config pending";
    return;
  }
  try {
    const app=initializeApp(firebaseConfig);
    if(appCheckConfigured()) {
      initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(recaptchaEnterpriseSiteKey),isTokenAutoRefreshEnabled:true});
    }
    const auth=getAuth(app);
    const cred=await signInAnonymously(auth);
    uid=cred.user.uid;
    db=getDatabase(app);
    const ai=getAI(app,{backend:new GoogleAIBackend()});
    model=getGenerativeModel(ai,{model:"gemini-3.5-flash-lite"});
    firebaseReady=true;
    geminiReady=true;
    $("#cloudState").textContent="Firebase connected · Gemini ready";
    const snap=await get(ref(db,`demoSessions/${uid}`));
    if(snap.exists()) state=snap.val();
  } catch(err) {
    console.error(err);
    $("#cloudState").textContent="Firebase setup incomplete";
    $("#setupWarning").classList.remove("hidden");
  }
}

async function persist() {
  localStorage.setItem("varelyx-demo-state",JSON.stringify(state));
  if(firebaseReady && db && uid) {
    try { await set(ref(db,`demoSessions/${uid}`),state); } catch(err) { console.warn("RTDB persistence failed",err); }
  }
}

function fallbackExtract(text) {
  const lower=text.toLowerCase();
  return {
    delay_hours:lower.includes("48")?48:null,
    affected_routes:(lower.includes("2 route")||lower.includes("2 routes"))?2:null,
    supplier:"Supplier B",
    capacity_confirmed:null,
    summary:"Supplier delay detected; confirmed Thursday capacity remains unresolved.",
    confidence:.78
  };
}

async function analyzeWithGemini() {
  const text=$("#disruptionInput").value.trim();
  if(!text) return;
  $("#geminiResult").textContent="Analyzing…";
  let extraction=null;
  let question=null;
  let verified=false;
  let mode="deterministic-fallback";
  if(geminiReady && model) {
    try {
      const prompt=`You are the evidence layer for a retail continuity system. Extract only evidence explicitly supported by the message. Never invent quantities. Return JSON only with keys delay_hours, affected_routes, supplier, capacity_confirmed, summary, confidence. Use null when unknown. Message: ${text}`;
      const result=await model.generateContent(prompt);
      const raw=result.response.text().replaceAll("```json","").replaceAll("```","").trim();
      extraction=JSON.parse(raw);
      const qres=await model.generateContent("Write one concise supplier question that resolves the most decision-critical unknown: Supplier B Thursday delivery capacity. Return only the question.");
      question=qres.response.text().trim();
      verified=true;
      mode="firebase-ai-logic-gemini";
    } catch(err) {
      console.error(err);
    }
  }
  if(!extraction) extraction=fallbackExtract(text);
  state.extraction=extraction;
  state.geminiVerified=verified;
  state.geminiMode=mode;
  state.question=question||"Supplier B: what is the maximum confirmed number of cases you can deliver by Thursday?";
  state.audit.push({event:"EVIDENCE_ANALYZED",mode,verified,at:new Date().toISOString()});
  $("#geminiResult").textContent=(verified?"LIVE GEMINI VERIFIED\n":"LOCAL FALLBACK — final submission must verify live Gemini\n")+JSON.stringify(extraction,null,2);
  await persist();
  render();
}

async function resolveCapacity() {
  const cap=Number($("#capacityInput").value);
  if(!Number.isFinite(cap)||cap<0) return;
  state.supplierCapacity=cap;
  const row=state.evidence.find(x=>x.key==="supplier_b_thursday_capacity");
  row.value=cap; row.classification="KNOWN"; row.confidence=1; row.source="supplier confirmation";
  state.strategies=buildStrategies(cap);
  state.phase="PLAN_READY";
  const balanced=state.strategies.find(x=>x.id==="balanced");
  state.shadow.varelyxStockout=balanced.expected_stockout_cases;
  state.audit.push({event:"EVIDENCE_RESOLVED",value:cap,at:new Date().toISOString()});
  await persist();
  render();
}

async function runProof(id) {
  const plan=id==="unverified-aggressive"?unsafeCandidate():state.strategies.find(x=>x.id===id);
  if(!plan) return;
  state.proof=prove(plan);
  state.phase=state.proof.status==="PASS"?"PROVED":state.proof.status;
  state.audit.push({event:"PROOF_GATE",strategy:id,status:state.proof.status,at:new Date().toISOString()});
  await persist();
  render();
}

async function approve() {
  const plan=state.strategies.find(x=>x.id==="balanced");
  const proof=prove(plan);
  if(proof.status!=="PASS") { alert("Proof Gate is "+proof.status+". Resolve evidence first."); return; }
  if(state.actions.some(a=>a.strategy_id==="balanced")) { alert("Balanced plan already dispatched."); return; }
  const stamp=Date.now().toString(36);
  const actions=[];
  if(plan.transfer_cases) actions.push({id:"TR-"+stamp,type:"TRANSFER_ORDER",strategy_id:"balanced",status:"DISPATCHED",payload:{cases:plan.transfer_cases,from:"safe donor cluster",to:"at-risk Dhaka cluster"}});
  if(plan.supplier_b_cases) actions.push({id:"PO-"+stamp,type:"PURCHASE_ORDER_DRAFT",strategy_id:"balanced",status:"DISPATCHED",payload:{supplier:"Supplier B",cases:plan.supplier_b_cases,due:"Thursday"}});
  if(plan.emergency_cases) actions.push({id:"PE-"+stamp,type:"PURCHASE_ORDER_DRAFT",strategy_id:"balanced",status:"DISPATCHED",payload:{supplier:"Emergency Supplier C",cases:plan.emergency_cases}});
  actions.push({id:"SE-"+stamp,type:"SUPPLIER_ESCALATION",strategy_id:"balanced",status:"DISPATCHED",payload:{supplier:"Supplier B",reason:"48h delay + Eid service risk"}});
  actions.push({id:"MT-"+stamp,type:"MANAGER_TASK",strategy_id:"balanced",status:"DISPATCHED",payload:{task:"Review dispatch sequence and exception stores",priority:"HIGH"}});
  state.actions.push(...actions);
  state.proof=proof;
  state.phase="DISPATCHED";
  state.audit.push({event:"APPROVED_AND_PERSISTED",action_count:actions.length,storage:firebaseReady?"firebase-rtdb":"localStorage",at:new Date().toISOString()});
  await persist();
  render();
}

async function resetDemo() {
  state=initialState();
  await persist();
  $("#geminiResult").textContent="";
  render();
}

function evidenceCard(x) {
  return `<div class="evidence-card"><b>${x.label}</b><div>${x.value??"Not resolved"}</div><small>${Math.round(x.confidence*100)}% confidence · ${x.source}</small></div>`;
}
function strategyCard(s) {
  return `<div class="strategy ${s.id==="balanced"?"best":""}"><h3>${s.name}</h3><p>${s.objective}</p>
  <div class="kv"><span>Transfer</span><b>${s.transfer_cases} cases</b></div>
  <div class="kv"><span>Supplier B</span><b>${s.supplier_b_cases}</b></div>
  <div class="kv"><span>Emergency</span><b>${s.emergency_cases}</b></div>
  <div class="kv"><span>Cash</span><b>৳${s.cash_required_bdt.toLocaleString()}</b></div>
  <div class="kv"><span>Expected stockout</span><b>${s.expected_stockout_cases}</b></div>
  <div class="kv"><span>Robustness</span><b>${s.robustness_pct}%</b></div></div>`;
}

function render() {
  const balanced=state.strategies.find(x=>x.id==="balanced");
  $("#metrics").innerHTML=[
    ["Network","250 stores"],["SKUs","1,200"],["Gemini",state.geminiVerified?"LIVE":"Pending"],["Balanced robustness",balanced.robustness_pct+"%"]
  ].map(x=>`<div class="metric"><b>${x[1]}</b><span>${x[0]}</span></div>`).join("");

  for(const k of ["known","estimated","unknown"]) {
    $("#"+k).innerHTML=state.evidence.filter(x=>x.classification===k.toUpperCase()).map(evidenceCard).join("")||'<div class="hint">None</div>';
  }

  const ready=state.supplierCapacity!==null;
  $("#decisionBanner").className="decision-banner "+(ready?"pass":"hold");
  $("#decisionBanner").textContent=ready?"DECISION READY — material evidence resolved":"DECISION NOT READY — one critical unknown can change the recovery plan";
  $("#questionBox").innerHTML=ready?'<div class="question">Critical evidence resolved.</div>':`<div class="score">Highest-value unknown</div><div class="question">${state.question}</div><p class="hint">Capacity can materially change the feasible response under the encoded cash, MOQ, transfer and route constraints.</p>`;
  $("#strategies").innerHTML=state.strategies.map(strategyCard).join("");

  $("#proof").innerHTML=state.proof?`<h2 class="${state.proof.status}">${state.proof.status}</h2><small>Receipt ${state.proof.receipt_hash}</small>${state.proof.checks.map(c=>`<div class="check"><div><b>${c.name}</b><div class="hint">${c.detail}</div></div><div class="status ${c.status}">${c.status}</div></div>`).join("")}`:'<p class="hint">No strategy has been proven yet.</p>';

  $("#actions").innerHTML=state.actions.length?state.actions.map(a=>`<div class="action-card"><b>${a.type}</b><div>${a.id}</div><small>${JSON.stringify(a.payload)}</small></div>`).join(""):'<p class="hint">No action objects yet. Approval persists them to Firebase when configured.</p>';

  $("#shadow").innerHTML=`<div class="shadow-bars"><div class="shadow-card"><span>Current response</span><b>${state.shadow.baselineStockout}</b><small>expected stockout cases</small></div><div class="shadow-card"><span>Varelyx balanced</span><b>${state.shadow.varelyxStockout??"—"}</b><small>expected stockout cases</small></div></div>`;
}

$("#resetBtn").onclick=resetDemo;
$("#analyzeBtn").onclick=analyzeWithGemini;
$("#answerBtn").onclick=resolveCapacity;
$$("[data-proof]").forEach(b=>b.onclick=()=>runProof(b.dataset.proof));
$("#approveBtn").onclick=approve;

const cached=localStorage.getItem("varelyx-demo-state");
if(cached){try{state=JSON.parse(cached)}catch{}}
render();
await connectFirebase();
render();
