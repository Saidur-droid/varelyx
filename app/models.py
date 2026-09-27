from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal
from pydantic import BaseModel, Field

EvidenceClass = Literal["KNOWN", "ESTIMATED", "UNKNOWN"]
ProofStatus = Literal["PASS", "HOLD", "BLOCK"]

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class EvidenceItem(BaseModel):
    key: str
    label: str
    value: str | int | float | None = None
    classification: EvidenceClass
    confidence: float = Field(ge=0, le=1)
    source: str
    material: bool = True

class DemoAnswer(BaseModel):
    supplier_b_thursday_capacity: int = Field(ge=0, le=10000)

class Strategy(BaseModel):
    id: str
    name: str
    objective: str
    transfer_cases: int
    supplier_b_cases: int
    emergency_cases: int
    shortage_cases: int
    cash_required_bdt: int
    operating_cost_bdt: int
    robustness_pct: int
    expected_stockout_cases: int
    verified: bool = False

class ProofCheck(BaseModel):
    name: str
    status: Literal["PASS", "HOLD", "BLOCK"]
    detail: str

class ProofResult(BaseModel):
    status: ProofStatus
    checks: list[ProofCheck]
    strategy_id: str
    receipt_hash: str
    created_at: str = Field(default_factory=now_iso)

class ActionObject(BaseModel):
    id: str
    type: Literal["TRANSFER_ORDER", "PURCHASE_ORDER_DRAFT", "SUPPLIER_ESCALATION", "MANAGER_TASK"]
    status: Literal["DRAFT", "APPROVED", "DISPATCHED"] = "DISPATCHED"
    payload: dict
    created_at: str = Field(default_factory=now_iso)

class DisruptionExtraction(BaseModel):
    delay_hours: int | None = None
    affected_routes: int | None = None
    supplier: str | None = None
    capacity_confirmed: int | None = None
    summary: str
    confidence: float = Field(ge=0, le=1)
