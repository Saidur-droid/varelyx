# Final Live QA - Varelyx

Production URL (do not overwrite before preview approval): https://varelyx-ai-builder-cup.web.app

The premium workspace must pass on a Firebase Hosting **preview channel first**. Capture evidence only from the actual deployed preview.

## Required preview flow

- [ ] Page loads without console-breaking errors.
- [ ] Top status bar shows **Firebase verified** after an authenticated server read.
- [ ] Click **Analyze disruption**.
- [ ] Gemini produces **LIVE GEMINI VERIFIED** structured evidence.
- [ ] Gemini does not invent executable order quantities.
- [ ] Evidence Board visibly separates Confirmed / Estimated / Unknown.
- [ ] Review evidence and confirm Supplier B Thursday capacity = **120 cases**.
- [ ] Scenario workspace recomputes and labels all impact values as controlled simulation.
- [ ] Balanced demo candidate enters Proof Gate and produces **PASS**.
- [ ] **Test unsafe proposal** produces **BLOCK**.
- [ ] Re-run the balanced candidate and restore **PASS** before approval.
- [ ] Human approval summary explicitly says no supplier/ERP/WMS/external purchasing system is contacted.
- [ ] **Approve sandbox actions** creates receipt-linked action records.
- [ ] Persistence banner shows **FIREBASE SAVE VERIFIED** only after matching remote read-back.
- [ ] Browser refresh restores the same session/actions directly from Firebase.
- [ ] Edit supplier evidence after PASS and confirm the old proof becomes stale / approval is blocked.
- [ ] A denied/failed Firebase write shows **SAVE NOT VERIFIED** with recovery guidance.
- [ ] Controlled-simulation labels remain visible in metrics and Shadow Mode.
- [ ] PASS / HOLD / BLOCK states are readable as text, not communicated by color alone.
- [ ] Keyboard focus is visible through the complete judge flow.
- [ ] No customer, pilot, revenue, or observed-impact claim is presented without evidence.

## Viewport QA

Review the actual preview at:
- [ ] 1440 x 900
- [ ] 1280 x 720
- [ ] 390 x 844

Confirm no page-level horizontal scrolling at 390px. The strategy comparison table may scroll inside its own container.

## Evidence to capture

1. Command Center + system status.
2. LIVE GEMINI VERIFIED evidence.
3. Evidence Scout + confirmed 120 cases.
4. Scenario comparison with Balanced demo candidate.
5. Proof Gate PASS.
6. Unsafe proposal BLOCK.
7. Human approval boundary.
8. Sandbox action records + SAVE VERIFIED.
9. Same state after refresh.
10. Shadow Mode + audit trail.

If any required item fails, do not record the final competition video or deploy this redesign to production.
