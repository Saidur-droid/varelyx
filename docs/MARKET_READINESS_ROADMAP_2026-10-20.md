# Varelyx Market-Readiness Roadmap

Last updated: 2026-10-20  
Primary execution mode: VALIDATION  
Status: PLANNED - five tracked workstreams, not a product release  
Joint delivery owners: **Saidur (@Saidur-droid) and Tan Bunchhay (@Parameow3)**

## Purpose and continuity

Turn the working Varelyx prototype into a reliable product for distributors and multi-location retail operators. Preserve the locked direction: evidence-driven disruption response alongside existing systems, not a generic chatbot or full ERP replacement.

Saidur has driven Varelyx from its initial concept to the current foundation and remains actively involved in building the product. Tan's contributions to usability, localization, persistence, testing and release verification strengthen that foundation. Both share product and engineering delivery; this roadmap does not reduce either person to sales-only work or assign all development to one person. Detailed task splits and schedules will be agreed together.

After the agreed market-readiness gates are met, **Saidur leads local customer relationships and commercial execution in Bangladesh; Tan leads them in Cambodia**. Both feed customer learning into the same product. Assignment is requested shared ownership, not a claim that Tan has accepted a deadline or that a legal ownership/equity arrangement exists.

## What exists and what is not yet established

The current reviewed source contains supplier evidence interpretation, Known/Estimated/Unknown information, focused evidence review, deterministic plan comparison, PASS/HOLD/BLOCK checks, explicit human approval and persisted sandbox actions. It also contains multilingual/mobile usability and save/reload improvements. PR [#7](https://github.com/Saidur-droid/varelyx/pull/7) merged on 2026-10-18 at `b1f74e60add9e816464ab03570be36005e9f7f40`.

The [current architecture](ARCHITECTURE.md) still describes fixed demo scenarios, anonymous browser-private sessions, client-side proof and sandbox actions without supplier/ERP execution. Display currency is not proof of correct customer-specific multi-currency operations. Older deployment notes and passing test reports are historical evidence, not fresh production certification.

The founder reports the competition submission was completed. Preserve the competition evidence separately; this roadmap does not independently certify portal acceptance, current live-service health, real customer outcomes or revenue.

## Five priorities and shared ownership

All five GitHub issues are assigned to **both @Saidur-droid and @Parameow3**. Detailed acceptance checklists, dependencies and evidence requirements are in each issue. All are initially PLANNED/open.

| Priority | Work to deliver | Customer value | Owners | Tracking |
|---|---|---|---|---|
| 1. Real data, quick start | Validated CSV intake for stock, sales, suppliers and policies; explicit handling of stale/missing data, units, duplicates and provenance. Replace fixed demo assumptions only for the supported workflow. | Use the customer's own operation, not a demonstration dataset. | Saidur + Tan | [#8](https://github.com/Saidur-droid/varelyx/issues/8) |
| 2. Simple Action Inbox | Retain the existing UI foundation; show the problem, next useful question, recommended plan and approval in one clear flow. Reveal detailed evidence on demand. | Less navigation, repeated entry and manual information assembly. | Saidur + Tan | [#9](https://github.com/Saidur-droid/varelyx/issues/9) |
| 3. Trusted team workflow | Business accounts, isolated customer data, user roles, shared decisions, server-side revalidation, audit, monitoring and verified backup/restore. | Safe collaboration and an authoritative approval boundary outside the browser. | Saidur + Tan | [#10](https://github.com/Saidur-droid/varelyx/issues/10) |
| 4. Action follow-through | Approved purchase-order/transfer draft export, responsible person, authorized status updates and completion/failure evidence. | Close the gap between a recommendation and work actually completed. | Saidur + Tan | [#11](https://github.com/Saidur-droid/varelyx/issues/11) |
| 5. Real Value Ledger | Separate baseline process, recommendation, action taken and subsequent outcome, with provenance and uncertainty. | Understand supported value and whether continued paid use is worthwhile. | Saidur + Tan | [#12](https://github.com/Saidur-droid/varelyx/issues/12) |

## Delivery sequence

1. **Review the baseline.** Confirm the source-to-host release state and complete live AI -> proof -> approval -> save -> reload checks before using the existing deployment as launch evidence. Reconcile each issue with implemented code before duplicating work. Review architecture for new trust boundaries before coding.
2. **Establish the foundation.** Work on #10 with the #8 schema and validation design. Use synthetic fixtures until permissions, customer-data isolation and handling are verified. Make policy, units and currency correct for the first supported business scope.
3. **Complete one operational journey.** Connect #8, #9 and #11 so approved drafts and action status use the same trusted evidence/plan versions. Export is not dispatch, and dispatch is not completion. Keep high-impact actions human-approved.
4. **Connect measurement and validate.** Define #12's evidence model early and connect it to decisions/actions. Exercise the workflow with permitted representative data in a controlled validation setting before broad public release.
5. **Release the bounded product.** Once the joint release gate passes, begin controlled market rollout in the respective countries, collect outcomes and willingness-to-pay evidence, and expand only from demonstrated value.

These are dependencies and milestones, not fabricated dates or delivery promises. Market-ready means reliable for the first supported customer workflow, not every future feature finished.

## Joint market-readiness gate

Keep every box open until the relevant evidence exists:

- [ ] Representative data imports correctly without hidden demo-data assumptions; critical unknowns or stale facts cause clarification/HOLD.
- [ ] The supported journey works end to end on the intended production build, including missing evidence, a blocked plan, authorized approval, persistence and reload.
- [ ] Direct-request negative tests prove cross-tenant isolation, role enforcement, server revalidation and stale/replayed/duplicate-action protection.
- [ ] Approved exports are correct, actions have owners and auditable states, and external execution cannot be implied by a UI success message.
- [ ] Backup restore, representative failure recovery, monitoring and deployment/rollback procedures have fresh evidence.
- [ ] Target-language/mobile usability and required units/currency semantics are verified for each launch market.
- [ ] The Value Ledger distinguishes simulation, estimates and observed outcomes, with a reproducible baseline method.
- [ ] First-release scope, onboarding, support, incident ownership and commercial terms are jointly reviewed. No customer or revenue claims precede evidence.
- [ ] Saidur and Tan review the evidence and agree the supported release is ready for controlled market rollout.

## The 50x ambition

Aim for a dramatically easier workflow, not 50 more features. **50x is an internal ambition for a defined metric, not an established result or public competitor-superiority claim.**

Compare equivalent cases with the same data, business rules and approval requirements. Record active operator effort, preparation, corrections, manual steps, errors and end-to-end time; report external supplier waiting separately. A manual-process comparison is not a benchmark against a competing product. Do not multiply unrelated improvements into an invented overall score.

## Commercial continuity and boundaries

Retain the existing [Business and GTM Plan](BUSINESS_AND_GTM.md): Shadow Audit -> Value Ledger -> Proof of Value -> paid rollout. Both founders work locally in their respective countries after the agreed readiness gate. No broad launch before reliability evidence; no guarantee of earnings, savings or retention.

Do not add a full ERP, generic agent platform, every possible integration or autonomous purchasing to this milestone. Do not migrate infrastructure just because a tool is available. Never publish private customer data, credentials or unapproved supplier communications in this public repository.

## Status and evidence discipline

This update creates planning documentation and five assigned issues only. It does not implement the features, deploy the application, relax security controls or certify current production health. Historical prototype tests must not be relabelled as verification of these planned updates.

For each workstream, record implementation PRs/commits, fresh test results, supported limitations and any required approval in its issue. Update [NEXT_STEPS.md](../NEXT_STEPS.md) and [PROJECT_MODE.md](PROJECT_MODE.md) when the evidence changes.
