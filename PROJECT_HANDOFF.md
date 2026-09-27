# Varelyx - Project Handoff / Single Source of Truth

**Last updated:** 2026-09-27  
**Competition:** Google Cloud AI Builder Cup 2026, powered by Hack2skill  
**Theme:** Retail & Commerce - Intelligent Customer and Business Experiences  
**Live app:** https://varelyx-ai-builder-cup.web.app  
**Firebase project:** `varelyx-ai-builder-cup`

> Read this file first in every future work session. It is the durable status/next-step handoff.

## North-star product

Varelyx is an evidence-driven retail continuity system:

**KNOW -> ASK -> PROVE -> ACT**

Gemini interprets messy disruption evidence and identifies the most decision-critical unknown. Deterministic logic owns operational quantities and hard constraints. The Proof Gate can PASS/HOLD/BLOCK. Human approval is required before execution-ready actions are persisted.

## Competition goals

1. **Rule compliance:** never jeopardize eligibility or submission validity.
2. **Top-tier product quality:** optimize the product and demo against the published judging criteria, especially meaningful GenAI implementation.

## Official rules snapshot - checked 2026-09-27

Current official AI Builder Cup pages state:

- Team formation: **2-4 members** by **2026-10-11**.
- Participants: **21+**, based in **JAPAC**.
- This edition is for **working professionals**; students are not eligible.
- Prototype submission deadline: **2026-10-18**.
- Prototype must meaningfully use Google AI such as Gemini/Gemma or an eligible agentic platform.
- Prototype must be deployed on Google Cloud using Cloud Run/GCP/Firebase.
- Submission requires a compelling proposal/deck converted to PDF, a functional deployed prototype, and a **3-minute** public demo link (YouTube/Vimeo/public Google Drive).
- Submission materials must be in English.
- Current judging weights:
  - Technical Merit & Gen AI Implementation: **40%**
  - Problem Alignment & Impact: **25%**
  - Innovation & Creativity: **25%**
  - User Experience & Solution Design: **10%**

Official sources:
- https://aibuildercup.com/
- https://aibuildercup.com/themes.html

If the live competition portal or organizer publishes a newer requirement, the newest official requirement wins and this file must be updated.

## DONE

### Product / infrastructure
- [x] Retail & Commerce positioning locked.
- [x] Firebase project created: `varelyx-ai-builder-cup`.
- [x] Firebase Hosting configured and deployed.
- [x] Public URL live: https://varelyx-ai-builder-cup.web.app
- [x] Firebase Realtime Database configured in `asia-southeast1`.
- [x] Database rules deployed successfully.
- [x] Anonymous Firebase Authentication enabled.
- [x] Firebase AI Logic configured.
- [x] Gemini Developer API path configured.
- [x] Firebase App Check registered with reCAPTCHA Enterprise.
- [x] Windows one-command deploy helper fixed to run from the repository directory.
- [x] Competition proposal deck/PDF prepared.
- [x] Submission portal copy drafted.
- [x] Final QA and submission-gate documents prepared.

### Product behavior implemented/intended for final proof
- Gemini disruption analysis.
- Known / Estimated / Unknown evidence separation.
- Critical missing-fact question.
- Supplier-capacity confirmation.
- Deterministic strategy recomputation.
- Proof Gate PASS/BLOCK behavior.
- Human approval.
- Firebase persistence.
- Controlled-simulation disclosure.

## CURRENT P0 - do these next

### P0.1 Live technical proof
Open https://varelyx-ai-builder-cup.web.app and prove, in this order:

1. Firebase connected / Gemini ready.
2. Click **Analyze disruption with Gemini**.
3. Confirm **LIVE GEMINI VERIFIED**.
4. Confirm Supplier B Thursday capacity = **120 cases**.
5. Recompute strategies.
6. Run balanced plan -> **PASS**.
7. Run unsafe proposal -> **BLOCK**.
8. Approve the verified plan.
9. Confirm action objects are persisted.
10. Refresh the browser and confirm state/actions remain.

Capture screenshots of the important proof states. If any step fails, fixing it is the next engineering task; do not record the final video yet.

### P0.2 Eligibility / team
Before **2026-10-11**:
- Confirm **2-4 eligible real team members**.
- Every member must satisfy the current official age/region/professional eligibility.
- Ensure no ineligible student is on the team.
- Complete team formation in the official portal.

This requires real people and the entrant's account; it cannot be automated truthfully from the repository.

### P0.3 Public repository check
Before final submission:
- Confirm the repository visibility and source-code requirements shown in the live submission portal.
- Remove secrets/private credentials before any visibility change.
- Keep Firebase client configuration only where appropriate; never commit service-account/private keys.

### P0.4 Final demo video
Only after P0.1 passes:
- Record the live product, not a slide-only pitch.
- Keep the final video within the official **3-minute** requirement.
- Show: problem -> live Gemini -> missing evidence -> Proof Gate PASS -> unsafe BLOCK -> approval/persistence -> differentiation/scale.
- Publish using an accepted public link.
- Verify the link in an incognito/private browser.

Use `docs/DEMO_VIDEO_SCRIPT.md`.

### P0.5 Final portal submission
Before **2026-10-18**:
- Upload proposal PDF.
- Add deployed prototype URL.
- Add repository URL as required by the portal.
- Add public demo-video URL.
- Select/confirm Retail & Commerce and the exact problem statement.
- Paste the polished submission copy.
- Complete declarations.
- Submit.
- Save the portal confirmation screenshot/email.

## Definition of 100% DONE

Do **not** call the competition entry 100% complete until all are true:

- [ ] Live Gemini verified.
- [ ] PASS/BLOCK verified.
- [ ] Approval + persistence verified after refresh.
- [ ] Eligible team finalized.
- [ ] Public demo video published and link tested.
- [ ] Proposal PDF final.
- [ ] Portal fields complete.
- [ ] Final submission accepted by the portal.
- [ ] Confirmation evidence saved.

## Files to read next

1. `PROJECT_HANDOFF.md` - this file.
2. `NEXT_STEPS.md` - immediate execution queue.
3. `docs/FINAL_LIVE_QA.md` - technical smoke test.
4. `docs/DEMO_VIDEO_SCRIPT.md` - recording script.
5. `docs/SUBMISSION_PORTAL_COPY.md` - ready-to-paste copy.
6. `docs/FINAL_SUBMISSION_GATE.md` - final stop/go gate.
7. `DEPLOYMENT_STATUS.md` - deployment record.
8. `COMPETITION_RULES_LOCK.md` - competition guardrails.

## Instructions for future ChatGPT/Codex sessions

When given this repository:
- Read `PROJECT_HANDOFF.md` first.
- Preserve the two competition goals: rule compliance and top-tier product quality.
- Never claim a real pilot, customer, revenue, or observed impact without evidence.
- Keep simulation values explicitly labelled as simulation.
- Do not let Gemini directly invent operational quantities; deterministic constraints/Proof Gate own executable decisions.
- Prioritize the P0 queue before adding unrelated features.
- Update this handoff whenever a P0 item changes state.
