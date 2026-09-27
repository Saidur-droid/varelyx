# AI Builder Cup Submission Copy - Varelyx

## Product name
Varelyx

## Theme
Retail & Commerce

## One-line description
Varelyx turns messy retail disruption evidence into proof-gated, human-approved continuity actions using Gemini and Firebase.

## Short description
Retail disruptions rarely arrive as clean data. Supplier messages, route updates, partial capacity information, and inventory constraints create uncertainty exactly when operators need to act quickly. Varelyx uses Gemini to interpret natural-language evidence and identify decision-critical unknowns, then uses deterministic optimization and a Proof Gate to test strategies against hard constraints before a human can approve execution. Approved actions persist in Firebase Realtime Database.

## Problem
Retail operators must make replenishment and continuity decisions while evidence is incomplete. Generic AI can summarize the situation, but a plausible recommendation can still violate supplier capacity, working-capital, MOQ, pack-size, route, or donor-stock constraints.

## Solution
Varelyx follows a four-part loop:
1. KNOW - classify evidence as Known, Estimated, or Unknown.
2. ASK - identify the missing fact with the highest decision value.
3. PROVE - generate feasible strategies and verify hard constraints.
4. ACT - require human approval before persisting execution-ready actions.

## Google AI implementation
Firebase AI Logic connects the web prototype to Gemini. Gemini interprets messy disruption messages, extracts structured evidence, and proposes the next best evidence question. Deterministic logic, rather than the model, owns order quantities and constraint checks. This separation keeps generative reasoning useful without allowing the model to bypass operational controls.

## Firebase implementation
- Firebase Hosting: public prototype.
- Firebase AI Logic: Gemini integration.
- Firebase Anonymous Authentication: session isolation.
- Firebase App Check with reCAPTCHA Enterprise: abuse protection.
- Firebase Realtime Database: persistent approved action objects.

## Innovation
The key innovation is evidence-to-action governance. Varelyx does not treat an AI recommendation as executable merely because it sounds plausible. Its Proof Gate can PASS, HOLD, or BLOCK a plan based on evidence completeness and hard constraints.

## Impact
Varelyx is designed to help retail teams triage disruptions faster, reduce blind decisions, and preserve an auditable path from evidence to approval. Current impact values shown in the prototype are controlled simulations; no real-world pilot or observed-impact claim is asserted.

## Scalability
The current prototype can evolve into an operating layer connected to POS/inventory feeds, supplier systems, enterprise identity, role-based approvals, ERP workflows, audit exports, and multi-region infrastructure.

## Live prototype
https://varelyx-ai-builder-cup.web.app

## Repository
https://github.com/Saidur-droid/varelyx

## Demo video
ADD PUBLIC VIDEO URL BEFORE SUBMISSION

## Proposal PDF
Use the final Varelyx AI Builder Cup proposal PDF generated for submission.
