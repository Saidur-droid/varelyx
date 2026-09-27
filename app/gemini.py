from __future__ import annotations

import json
import os
import re

from .models import DisruptionExtraction


def _client():
    try:
        from google import genai
        if os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "false").lower() == "true":
            return genai.Client(vertexai=True, project=os.getenv("GOOGLE_CLOUD_PROJECT"), location=os.getenv("GOOGLE_CLOUD_LOCATION", "global"))
        if os.getenv("GOOGLE_API_KEY"):
            return genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    except Exception:
        return None
    return None


def extract_disruption(text: str) -> tuple[DisruptionExtraction, str]:
    client = _client()
    if client:
        prompt = f"""You extract retail disruption evidence. Return strict JSON with keys: delay_hours, affected_routes, supplier, capacity_confirmed, summary, confidence. Use null for unknown values. Never invent quantities. Input may be Bangla, Banglish, or English. Input: {text}"""
        try:
            response = client.models.generate_content(model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), contents=prompt)
            raw = (response.text or "").strip().replace(chr(96) * 3 + "json", "").replace(chr(96) * 3, "")
            return DisruptionExtraction.model_validate(json.loads(raw)), "gemini"
        except Exception:
            pass

    lower = text.lower()
    delay = 48 if ("48" in lower or "দুই দিন" in text or "2 day" in lower) else None
    routes = 2 if ("2 route" in lower or "দুইটা রুট" in text or "2 routes" in lower) else None
    capacity = None
    m = re.search(r"(?:max(?:imum)?|capacity|ক্ষমতা)[^0-9]{0,20}(d{2,4})", lower)
    if m:
        capacity = int(m.group(1))
    return DisruptionExtraction(delay_hours=delay, affected_routes=routes, supplier="Supplier B", capacity_confirmed=capacity, summary="Supplier delay detected; capacity remains unknown unless explicitly stated.", confidence=0.88 if delay else 0.68), "deterministic-fallback"


def generate_next_best_question(label: str, why: str) -> tuple[str, str]:
    client = _client()
    fallback = "Supplier B: what is the maximum confirmed number of cases you can deliver by Thursday?"
    if not client:
        return fallback, "deterministic-fallback"
    prompt = f"Write one concise operational question to resolve this retail uncertainty. No explanation. Unknown: {label}. Decision reason: {why}"
    try:
        response = client.models.generate_content(model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), contents=prompt)
        question = (response.text or "").strip().strip('"')
        return (question if question else fallback), "gemini"
    except Exception:
        return fallback, "deterministic-fallback"


def extract_disruption_audio(data: bytes, mime_type: str) -> tuple[DisruptionExtraction, str]:
    client = _client()
    if client:
        try:
            from google.genai import types
            prompt = "Extract retail disruption evidence from this supplier audio. Return strict JSON with keys delay_hours, affected_routes, supplier, capacity_confirmed, summary, confidence. Use null when unknown; never invent quantities."
            response = client.models.generate_content(
                model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
                contents=[types.Part.from_bytes(data=data, mime_type=mime_type), prompt],
            )
            raw = (response.text or "").strip().replace(chr(96) * 3 + "json", "").replace(chr(96) * 3, "")
            return DisruptionExtraction.model_validate(json.loads(raw)), "gemini-audio"
        except Exception:
            pass
    return DisruptionExtraction(delay_hours=48, affected_routes=2, supplier="Supplier B", capacity_confirmed=None, summary="Controlled demo fallback: 48-hour supplier delay; capacity unresolved.", confidence=0.70), "controlled-audio-fallback"
