import json
from pathlib import Path

RULES = json.loads((Path(__file__).resolve().parents[1] / "competition_rules.json").read_text())


def test_authoritative_rule_override_is_locked():
    assert RULES["authority"]["official_overrides_repo"] is True
    assert RULES["authority"]["portal_is_authoritative_for_final_form_fields"] is True


def test_eligibility_and_deadlines_are_locked():
    e = RULES["eligibility"]
    assert (e["team_min"], e["team_max"]) == (2, 4)
    assert e["minimum_age"] == 21
    assert e["region"] == "JAPAC"
    assert e["working_professionals_only"] is True
    assert e["students_eligible"] is False
    assert e["team_formation_deadline"] == "2026-10-11"
    assert RULES["timeline"]["prototype_submission_deadline"] == "2026-10-18"


def test_varelyx_competition_path_is_locked():
    v = RULES["varelyx"]
    assert v["theme"].startswith("Retail & Commerce")
    assert v["google_ai_required"] is True
    assert v["cloud_deployment_required"] is True
    assert v["primary_deployment"] == "Cloud Run"
    assert v["live_google_ai_must_be_verified_before_submission"] is True
    assert v["vercel_required"] is False
    assert v["supabase_required"] is False


def test_submission_package_requirements_are_locked():
    s = RULES["submission"]
    assert s["working_prototype_required"] is True
    assert s["proposal_pdf_required"] is True
    assert s["public_demo_video_required"] is True
    assert s["demo_video_max_minutes"] == 3
    assert s["english_materials_required"] is True


def test_judging_weights_total_100():
    j = RULES["judging"]
    assert sum(j.values()) == 100


def test_integrity_guardrails_are_locked():
    i = RULES["integrity"]
    assert all(i.values())
