# AI Builder Cup 2026 — Competition Rules Lock

Last verified: 2026-09-27 (Asia/Dhaka)

This file is the repository-level competition guardrail for Varelyx.

## Authority rule

1. Official AI Builder Cup / Hack2skill competition pages and the submission portal are authoritative.
2. If this repository conflicts with an official rule, the official rule wins immediately.
3. If the public website is internally inconsistent, do not guess. Preserve the ambiguity, use the live submission portal field as the operational source of truth, and contact the organizer if needed.
4. Do not weaken a mandatory competition requirement for implementation convenience.

Official public sources verified on 2026-09-27:
- https://aibuildercup.com/
- https://aibuildercup.com/themes.html

## Locked eligibility requirements

- Region: JAPAC.
- Minimum age: 21+.
- Team size: 2–4 members.
- Team formation deadline: 2026-10-11.
- This edition is for working professionals; students are not eligible.
- Eligibility may be verified by the organizer.
- If shortlisted, only two team members travel to the Singapore finale according to the public competition page.

These are participant/account requirements and cannot be proven by repository code. The team owner must verify every member before submission.

## Locked competition dates

- Registration and team formation: 2026-09-01 through 2026-10-11.
- Prototype building and submission: 2026-09-07 through 2026-10-18.
- Prototype submission deadline: 2026-10-18.
- Evaluation: 2026-10-19 through 2026-11-06.
- Finalists announcement: 2026-11-07.
- Grand Finale / Demo Day in Singapore: 2026-12-04.

Internal target must remain earlier than the official deadline. Do not plan final upload for the last minute.

## Locked Varelyx theme

Primary theme:
**Retail & Commerce: Intelligent Customer and Business Experiences**

Varelyx must stay clearly aligned to retail operational efficiency, demand/inventory continuity, and business decision-making.

Do not silently switch theme or problem statement without updating this file, the submission package, and the portal selection together.

### Official-site inconsistency

The official themes page lists Retail & Commerce as a valid 2026 theme, while a lower "Category Specification" block contains older category wording such as Healthcare, Education, Sustainability, Accessibility, and Social Good.

Operational rule:
- Keep Varelyx aligned to the current Retail & Commerce theme list.
- At final submission, use the exact category/problem options shown in the live portal.
- If the portal conflicts materially with the public theme list, pause submission and request organizer clarification rather than inventing a category.

## Mandatory build requirements

The final submission must be a **working prototype**, not only a pitch deck or mockup.

The product must:
- meaningfully integrate Google AI such as Gemini or Gemma, or an accepted Google agentic platform;
- deploy the working prototype on Google Cloud using Cloud Run or Firebase/GCP;
- be functional and technically sound;
- present a clear solution to the selected problem;
- be user-friendly and reasonably accessible;
- show scalability / future-development potential.

### Varelyx architecture rule

For this repo:
- Gemini/Vertex AI handles messy language/audio evidence, ambiguity, structured extraction, and focused question generation.
- Deterministic optimization handles quantities and feasibility.
- Proof Gate verifies encoded hard constraints.
- Human approval is required before high-risk execution.
- Cloud Run is the primary deployment target.
- Firestore may be used for durable state.
- Vercel and Supabase are not required and should not be introduced unless an official rule or demonstrated product need changes.

A fallback may exist for resilience, but the submitted live prototype must demonstrate real Google AI integration. A deterministic-only demo is not sufficient for final compliance.

## Mandatory submission package

Before final submission, confirm all of the following:

- Working live prototype deployed on Google Cloud / Cloud Run / Firebase.
- Meaningful live Google AI integration.
- Proposal/deck converted to PDF.
- Proposal clearly explains problem, solution, positive impact, feasibility, and scalability.
- Public demo video link using YouTube, Vimeo, or public Google Drive.
- Demo video duration: 3 minutes maximum according to the public requirements.
- Chosen problem/theme clearly specified in the submission portal.
- All submission materials, including code, documentation, and presentation, are in English.
- No private credential, API key, service-account key, or secret committed to the repository.

## Judging optimization — locked weights

Every major product decision should be checked against:

- Technical Merit & Gen AI Implementation — 40%
- Problem Alignment & Impact — 25%
- Innovation & Creativity — 25%
- User Experience & Solution Design — 10%

This is not permission to fake metrics or add decorative AI. Google AI must be meaningful and the product must remain functional.

## Claims and evidence rules

- Never present controlled simulation as observed retailer impact.
- Never invent a customer, pilot, deployment, benchmark, revenue number, or production result.
- Label demo metrics with provenance.
- Do not claim real-world stockout reduction without real-world evidence.
- Do not use fake buttons for critical actions.
- Approval must create backend action objects.
- Proof Gate must be able to reject an unsafe/infeasible proposal.
- Quantities must not be invented by an LLM.

## Final compliance gate

The repository can be called "submission-ready" only when all repository-testable requirements pass.

The overall competition submission can be called "100% complete" only after owner/account-bound requirements are also completed:
- eligible team of 2–4;
- registration/team formation complete;
- Google Cloud project/account active;
- live Cloud Run/Firebase deployment;
- live Gemini/Gemma/accepted Google AI path verified;
- final PDF prepared;
- public <=3-minute demo video prepared;
- portal theme/problem selection confirmed;
- final portal submission accepted before deadline.

Until those are verified, do not state "100% competition compliant."

## Change-control rule

Every future feature, refactor, demo edit, deck edit, claim, deployment change, or submission change must preserve this rules lock.

If an official rule changes:
1. update `competition_rules.json`;
2. update this document;
3. update affected tests/docs/product behavior;
4. record the change in the commit message;
5. follow the newer official rule.
