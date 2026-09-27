from app.engine import CASH_CEILING, DONOR_TRANSFER_CAP, build_strategies, blocked_candidate, prove, rank_unknowns

def test_unknown_ranked_before_decision():
    rows = rank_unknowns(None)
    assert rows and rows[0]["key"] == "supplier_b_thursday_capacity"

def test_balanced_plan_respects_hard_constraints():
    plan = next(x for x in build_strategies(120) if x.id == "balanced")
    assert plan.cash_required_bdt <= CASH_CEILING
    assert plan.transfer_cases <= DONOR_TRANSFER_CAP
    assert plan.supplier_b_cases <= 120

def test_proof_holds_when_critical_evidence_missing():
    plan = next(x for x in build_strategies(None) if x.id == "balanced")
    assert prove(plan, None, ["Supplier B Thursday capacity"]).status == "HOLD"

def test_proof_passes_solver_plan_after_capacity_confirmation():
    plan = next(x for x in build_strategies(120) if x.id == "balanced")
    assert prove(plan, 120, []).status == "PASS"

def test_proof_blocks_unverified_aggressive_candidate():
    result = prove(blocked_candidate(120), 120, [])
    assert result.status == "BLOCK"
    assert any(c.status == "BLOCK" for c in result.checks)
