from __future__ import annotations

import hashlib
import json
import math
from typing import Iterable

try:
    from ortools.linear_solver import pywraplp
except Exception:
    pywraplp = None

from .models import ProofCheck, ProofResult, Strategy

PACK = 10
BASE_DEMAND = 420
STARTING_AT_RISK_INVENTORY = 150
DONOR_TRANSFER_CAP = 90
CASH_CEILING = 240_000
SUPPLIER_CASE_COST = 820
EMERGENCY_CASE_COST = 1_280
TRANSFER_CASE_COST = 120
SUPPLIER_MOQ = 50
ROUTE_TRANSFER_CAP = 90
SCENARIO_DEMAND = [380, 420, 460, 500]


def _round_pack(value: float) -> int:
    return int(math.ceil(max(0, value) / PACK) * PACK)


def _solve(capacity: int, shortage_penalty: int, emergency_penalty: int = 0, target_demand: int = BASE_DEMAND) -> Strategy:
    solver = pywraplp.Solver.CreateSolver("CBC_MIXED_INTEGER_PROGRAMMING") if pywraplp is not None else None

    if solver is not None:
        transfer_units = solver.IntVar(0, DONOR_TRANSFER_CAP // PACK, "transfer_units")
        supplier_units = solver.IntVar(0, capacity // PACK, "supplier_units")
        emergency_units = solver.IntVar(0, 100 // PACK, "emergency_units")
        shortage_units = solver.IntVar(0, max(target_demand, BASE_DEMAND) // PACK, "shortage_units")
        transfer = transfer_units * PACK
        supplier = supplier_units * PACK
        emergency = emergency_units * PACK
        shortage = shortage_units * PACK
        solver.Add(transfer <= ROUTE_TRANSFER_CAP)
        solver.Add(STARTING_AT_RISK_INVENTORY + transfer + supplier + emergency + shortage >= target_demand)
        solver.Add(transfer * TRANSFER_CASE_COST + supplier * SUPPLIER_CASE_COST + emergency * EMERGENCY_CASE_COST <= CASH_CEILING)
        use_supplier = solver.IntVar(0, 1, "use_supplier")
        solver.Add(supplier_units <= (capacity // PACK) * use_supplier)
        solver.Add(supplier_units >= (SUPPLIER_MOQ // PACK) * use_supplier)
        operating = transfer * TRANSFER_CASE_COST + supplier * SUPPLIER_CASE_COST + emergency * EMERGENCY_CASE_COST
        solver.Minimize(operating + shortage * shortage_penalty + emergency * emergency_penalty)
        status = solver.Solve()
        if status not in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
            raise RuntimeError("No feasible strategy under encoded constraints")
        t = int(round(transfer.solution_value()))
        s = int(round(supplier.solution_value()))
        e = int(round(emergency.solution_value()))
        sh = int(round(shortage.solution_value()))
    else:
        best = None
        for t in range(0, min(DONOR_TRANSFER_CAP, ROUTE_TRANSFER_CAP) + 1, PACK):
            for s in range(0, capacity + 1, PACK):
                if 0 < s < SUPPLIER_MOQ:
                    continue
                for e in range(0, 101, PACK):
                    cash = t * TRANSFER_CASE_COST + s * SUPPLIER_CASE_COST + e * EMERGENCY_CASE_COST
                    if cash > CASH_CEILING:
                        continue
                    sh = _round_pack(max(0, target_demand - STARTING_AT_RISK_INVENTORY - t - s - e))
                    score = cash + sh * shortage_penalty + e * emergency_penalty
                    candidate = (score, cash, sh, t, s, e)
                    if best is None or candidate < best:
                        best = candidate
        if best is None:
            raise RuntimeError("No feasible strategy under encoded constraints")
        _, _, sh, t, s, e = best

    cash = t * TRANSFER_CASE_COST + s * SUPPLIER_CASE_COST + e * EMERGENCY_CASE_COST
    return Strategy(
        id="",
        name="",
        objective="",
        transfer_cases=t,
        supplier_b_cases=s,
        emergency_cases=e,
        shortage_cases=sh,
        cash_required_bdt=cash,
        operating_cost_bdt=cash,
        robustness_pct=_robustness(t, s, e),
        expected_stockout_cases=_expected_shortage(t, s, e),
    )


def _robustness(transfer: int, supplier: int, emergency: int) -> int:
    available = STARTING_AT_RISK_INVENTORY + transfer + supplier + emergency
    survived = sum(1 for d in SCENARIO_DEMAND if available >= d)
    return round(100 * survived / len(SCENARIO_DEMAND))


def _expected_shortage(transfer: int, supplier: int, emergency: int) -> int:
    available = STARTING_AT_RISK_INVENTORY + transfer + supplier + emergency
    return round(sum(max(0, d - available) for d in SCENARIO_DEMAND) / len(SCENARIO_DEMAND))


def build_strategies(capacity: int | None) -> list[Strategy]:
    cap = capacity or 0
    current = Strategy(
        id="current",
        name="Current plan",
        objective="No disruption response",
        transfer_cases=0,
        supplier_b_cases=0,
        emergency_cases=0,
        shortage_cases=max(0, BASE_DEMAND - STARTING_AT_RISK_INVENTORY),
        cash_required_bdt=0,
        operating_cost_bdt=0,
        robustness_pct=_robustness(0, 0, 0),
        expected_stockout_cases=_expected_shortage(0, 0, 0),
    )
    cheapest = _solve(cap, shortage_penalty=900, emergency_penalty=350, target_demand=380)
    cheapest.id, cheapest.name, cheapest.objective = "cheapest", "Cheapest feasible", "Minimize cash while limiting severe stockout"
    balanced = _solve(cap, shortage_penalty=2500, emergency_penalty=80, target_demand=420)
    balanced.id, balanced.name, balanced.objective = "balanced", "Balanced robust", "Balance service resilience and working capital"
    max_avail = _solve(cap, shortage_penalty=10000, emergency_penalty=0, target_demand=500)
    max_avail.id, max_avail.name, max_avail.objective = "max-availability", "Maximum availability", "Prioritize service continuity under hard constraints"
    return [current, cheapest, balanced, max_avail]


def blocked_candidate(capacity: int | None) -> Strategy:
    cap = capacity or 0
    supplier = _round_pack(max(SUPPLIER_MOQ, cap + 80))
    emergency = 100
    transfer = DONOR_TRANSFER_CAP + 40
    cash = transfer * TRANSFER_CASE_COST + supplier * SUPPLIER_CASE_COST + emergency * EMERGENCY_CASE_COST
    return Strategy(
        id="unverified-aggressive",
        name="Unverified aggressive proposal",
        objective="Demonstrate independent proof-gate rejection",
        transfer_cases=transfer,
        supplier_b_cases=supplier,
        emergency_cases=emergency,
        shortage_cases=0,
        cash_required_bdt=cash,
        operating_cost_bdt=cash,
        robustness_pct=100,
        expected_stockout_cases=0,
    )


def rank_unknowns(capacity: int | None) -> list[dict]:
    if capacity is not None:
        return []
    outcomes = []
    for cap in [0, 60, 120, 180]:
        s = _solve(cap, shortage_penalty=2500, emergency_penalty=80, target_demand=420)
        outcomes.append(s.expected_stockout_cases)
    spread = max(outcomes) - min(outcomes)
    return [
        {
            "key": "supplier_b_thursday_capacity",
            "label": "Supplier B Thursday confirmed capacity",
            "decision_value_score": min(100, 40 + spread),
            "why": f"Across plausible capacities, expected stockout exposure changes by {spread} cases.",
            "question": "Supplier B: what is the maximum confirmed number of cases you can deliver by Thursday?",
        },
        {
            "key": "route_recovery_window",
            "label": "Route recovery window",
            "decision_value_score": 42,
            "why": "Useful, but the current transfer cap is already bounded by the disruption assumption.",
            "question": "When is the affected route expected to reopen for normal truck movement?",
        },
    ]


def prove(strategy: Strategy, capacity: int | None, unresolved_unknowns: Iterable[str] = ()) -> ProofResult:
    checks: list[ProofCheck] = []
    unresolved = list(unresolved_unknowns)
    if unresolved:
        checks.append(ProofCheck(name="Decision-critical evidence", status="HOLD", detail=f"Unresolved: {', '.join(unresolved)}"))
    else:
        checks.append(ProofCheck(name="Decision-critical evidence", status="PASS", detail="All material evidence required for this plan is resolved."))
    checks.append(ProofCheck(name="Working-capital ceiling", status="PASS" if strategy.cash_required_bdt <= CASH_CEILING else "BLOCK", detail=f"BDT {strategy.cash_required_bdt:,} required vs BDT {CASH_CEILING:,} ceiling."))
    checks.append(ProofCheck(name="Supplier B capacity", status="PASS" if strategy.supplier_b_cases <= (capacity or 0) else "BLOCK", detail=f"Plan uses {strategy.supplier_b_cases} cases vs confirmed {(capacity or 0)}."))
    checks.append(ProofCheck(name="Donor safety stock / transfer cap", status="PASS" if strategy.transfer_cases <= DONOR_TRANSFER_CAP else "BLOCK", detail=f"Plan transfers {strategy.transfer_cases} cases vs safe transferable {DONOR_TRANSFER_CAP}."))
    checks.append(ProofCheck(name="Route availability", status="PASS" if strategy.transfer_cases <= ROUTE_TRANSFER_CAP else "BLOCK", detail=f"Route-constrained transfer limit is {ROUTE_TRANSFER_CAP} cases."))
    moq_ok = strategy.supplier_b_cases == 0 or strategy.supplier_b_cases >= SUPPLIER_MOQ
    pack_ok = all(x % PACK == 0 for x in [strategy.transfer_cases, strategy.supplier_b_cases, strategy.emergency_cases])
    checks.append(ProofCheck(name="MOQ and pack size", status="PASS" if moq_ok and pack_ok else "BLOCK", detail=f"Supplier MOQ {SUPPLIER_MOQ}; pack size {PACK}."))
    statuses = {c.status for c in checks}
    status = "BLOCK" if "BLOCK" in statuses else ("HOLD" if "HOLD" in statuses else "PASS")
    payload = {"strategy": strategy.model_dump(), "capacity": capacity, "checks": [c.model_dump() for c in checks]}
    receipt_hash = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()[:20]
    return ProofResult(status=status, checks=checks, strategy_id=strategy.id, receipt_hash=receipt_hash)
