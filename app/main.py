from __future__ import annotations

import csv
import io
import uuid
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .engine import blocked_candidate, build_strategies, prove, rank_unknowns
from .gemini import extract_disruption, extract_disruption_audio, generate_next_best_question
from .models import ActionObject, DemoAnswer, EvidenceItem, Strategy, now_iso
from .storage import StateStore

app = FastAPI(title="Varelyx", version="0.9.0")
store = StateStore()
STATIC = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=STATIC), name="static")


def initial_state() -> dict:
    evidence = [
        EvidenceItem(key="eid_window", label="Eid demand event", value="6 days away", classification="KNOWN", confidence=1, source="demo scenario").model_dump(),
        EvidenceItem(key="supplier_delay", label="Supplier B delivery delay", value="48 hours", classification="KNOWN", confidence=.94, source="supplier voice/text").model_dump(),
        EvidenceItem(key="route_disruption", label="Affected routes", value=2, classification="KNOWN", confidence=.96, source="operations alert").model_dump(),
        EvidenceItem(key="demand_uplift", label="Demand uplift range", value="+12% to +28%", classification="ESTIMATED", confidence=.78, source="controlled scenario model").model_dump(),
        EvidenceItem(key="supplier_b_thursday_capacity", label="Supplier B Thursday capacity", value=None, classification="UNKNOWN", confidence=0, source="supplier confirmation required").model_dump(),
    ]
    return {
        "meta": {"network": "Bangladesh Continuity Twin", "stores": 250, "skus": 1200, "suppliers": 6, "simulation": True, "updated_at": now_iso()},
        "phase": "EVIDENCE_REQUIRED",
        "evidence": evidence,
        "supplier_b_thursday_capacity": None,
        "unknowns": rank_unknowns(None),
        "strategies": [s.model_dump() for s in build_strategies(None)],
        "blocked_candidate": blocked_candidate(None).model_dump(),
        "proof": None,
        "actions": [],
        "audit": [{"event": "DEMO_RESET", "at": now_iso()}],
        "ingestion": {"sales_rows": 0, "inventory_rows": 0},
        "shadow": {"label": "Controlled scenario comparison", "baseline_stockout_cases": 270, "varelyx_stockout_cases": None, "observed_outcome": None},
    }


def get_state() -> dict:
    state = store.get()
    if not state:
        state = initial_state()
        store.set(state)
    return state


def save(state: dict) -> dict:
    state["meta"]["updated_at"] = now_iso()
    return store.set(state)


@app.get("/")
def index():
    return FileResponse(STATIC / "index.html")


@app.get("/health")
def health():
    return {"ok": True, "service": "varelyx", "version": app.version}


@app.get("/api/state")
def api_state():
    return get_state()


@app.post("/api/reset")
def reset():
    state = initial_state()
    save(state)
    return state


@app.post("/api/evidence/extract")
def evidence_extract(payload: dict):
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(400, "text is required")
    result, mode = extract_disruption(text)
    state = get_state()
    state["audit"].append({"event": "DISRUPTION_EXTRACTED", "mode": mode, "result": result.model_dump(), "at": now_iso()})
    if state["unknowns"]:
        q, qmode = generate_next_best_question(state["unknowns"][0]["label"], state["unknowns"][0]["why"])
        state["unknowns"][0]["question"] = q
        state["audit"].append({"event": "NEXT_BEST_QUESTION_GENERATED", "mode": qmode, "at": now_iso()})
    if result.capacity_confirmed is not None:
        _apply_capacity(state, result.capacity_confirmed)
    save(state)
    return {"extraction": result, "mode": mode, "state": state}


@app.post("/api/evidence/audio")
async def evidence_audio(file: UploadFile = File(...)):
    raw = await file.read()
    if not raw:
        raise HTTPException(400, "audio file is empty")
    result, mode = extract_disruption_audio(raw, file.content_type or "audio/mpeg")
    state = get_state()
    state["audit"].append({"event": "AUDIO_EVIDENCE_EXTRACTED", "mode": mode, "filename": file.filename, "result": result.model_dump(), "at": now_iso()})
    if result.capacity_confirmed is not None:
        _apply_capacity(state, result.capacity_confirmed)
    save(state)
    return {"extraction": result, "mode": mode, "state": state}


def _apply_capacity(state: dict, capacity: int) -> None:
    state["supplier_b_thursday_capacity"] = capacity
    for item in state["evidence"]:
        if item["key"] == "supplier_b_thursday_capacity":
            item.update({"value": capacity, "classification": "KNOWN", "confidence": 1, "source": "supplier confirmation"})
    state["unknowns"] = rank_unknowns(capacity)
    state["strategies"] = [s.model_dump() for s in build_strategies(capacity)]
    state["blocked_candidate"] = blocked_candidate(capacity).model_dump()
    state["phase"] = "PLAN_READY"
    balanced = next(s for s in state["strategies"] if s["id"] == "balanced")
    state["shadow"]["varelyx_stockout_cases"] = balanced["expected_stockout_cases"]
    state["audit"].append({"event": "EVIDENCE_RESOLVED", "key": "supplier_b_thursday_capacity", "value": capacity, "at": now_iso()})


@app.post("/api/evidence/answer")
def evidence_answer(answer: DemoAnswer):
    state = get_state()
    _apply_capacity(state, answer.supplier_b_thursday_capacity)
    save(state)
    return state


@app.post("/api/proof/{strategy_id}")
def proof_strategy(strategy_id: str):
    state = get_state()
    candidates = state["strategies"] + [state["blocked_candidate"]]
    found = next((Strategy.model_validate(s) for s in candidates if s["id"] == strategy_id), None)
    if not found:
        raise HTTPException(404, "strategy not found")
    unresolved = [u["label"] for u in state["unknowns"][:1]]
    result = prove(found, state["supplier_b_thursday_capacity"], unresolved)
    state["proof"] = result.model_dump()
    state["phase"] = "PROVED" if result.status == "PASS" else result.status
    state["audit"].append({"event": "PROOF_GATE", "strategy": strategy_id, "status": result.status, "hash": result.receipt_hash, "at": now_iso()})
    save(state)
    return result


@app.post("/api/approve/{strategy_id}")
def approve(strategy_id: str):
    state = get_state()
    found = next((Strategy.model_validate(s) for s in state["strategies"] if s["id"] == strategy_id), None)
    if not found:
        raise HTTPException(404, "strategy not found")
    result = prove(found, state["supplier_b_thursday_capacity"], [u["label"] for u in state["unknowns"][:1]])
    if result.status != "PASS":
        raise HTTPException(409, f"Proof Gate status is {result.status}; approval blocked")
    if any(a.get("strategy_id") == strategy_id for a in state["actions"]):
        return {"idempotent": True, "actions": state["actions"]}

    actions: list[dict] = []
    if found.transfer_cases:
        actions.append(ActionObject(id=f"TR-{uuid.uuid4().hex[:8]}", type="TRANSFER_ORDER", payload={"cases": found.transfer_cases, "from": "safe donor cluster", "to": "at-risk Dhaka cluster"}).model_dump() | {"strategy_id": strategy_id})
    if found.supplier_b_cases:
        actions.append(ActionObject(id=f"PO-{uuid.uuid4().hex[:8]}", type="PURCHASE_ORDER_DRAFT", payload={"supplier": "Supplier B", "cases": found.supplier_b_cases, "due": "Thursday"}).model_dump() | {"strategy_id": strategy_id})
    if found.emergency_cases:
        actions.append(ActionObject(id=f"PO-{uuid.uuid4().hex[:8]}", type="PURCHASE_ORDER_DRAFT", payload={"supplier": "Emergency Supplier C", "cases": found.emergency_cases, "reason": "continuity coverage"}).model_dump() | {"strategy_id": strategy_id})
    actions.append(ActionObject(id=f"SE-{uuid.uuid4().hex[:8]}", type="SUPPLIER_ESCALATION", payload={"supplier": "Supplier B", "reason": "48h delay + Eid service risk"}).model_dump() | {"strategy_id": strategy_id})
    actions.append(ActionObject(id=f"MT-{uuid.uuid4().hex[:8]}", type="MANAGER_TASK", payload={"task": "Review dispatch sequence and exception stores", "priority": "HIGH"}).model_dump() | {"strategy_id": strategy_id})
    state["actions"].extend(actions)
    state["proof"] = result.model_dump()
    state["phase"] = "DISPATCHED"
    state["audit"].append({"event": "APPROVED_AND_DISPATCHED", "strategy": strategy_id, "action_count": len(actions), "at": now_iso()})
    save(state)
    return {"idempotent": False, "actions": actions, "receipt": result}


@app.post("/api/ingest/{kind}")
async def ingest_csv(kind: str, file: UploadFile = File(...)):
    if kind not in {"sales", "inventory"}:
        raise HTTPException(400, "kind must be sales or inventory")
    raw = await file.read()
    try:
        rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig"))))
    except Exception as exc:
        raise HTTPException(400, f"invalid CSV: {exc}")
    if not rows:
        raise HTTPException(400, "CSV has no data rows")
    state = get_state()
    state["ingestion"][f"{kind}_rows"] = len(rows)
    state["audit"].append({"event": "CSV_INGESTED", "kind": kind, "rows": len(rows), "filename": file.filename, "at": now_iso()})
    save(state)
    return {"kind": kind, "rows": len(rows), "columns": list(rows[0].keys())}
