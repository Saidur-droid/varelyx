## AI Builder Cup compliance checklist

Before merging any change to Varelyx:

- [ ] I checked `COMPETITION_RULES_LOCK.md`.
- [ ] This change preserves Retail & Commerce alignment.
- [ ] This change does not remove or trivialize meaningful Google AI usage.
- [ ] This change preserves the Cloud Run / Google Cloud deployment path.
- [ ] This change does not introduce Vercel or Supabase without a documented need.
- [ ] This change does not add fake metrics, fake pilot/customer claims, or unlabeled simulation.
- [ ] This change does not allow an LLM to invent operational quantities.
- [ ] This change preserves Proof Gate / hard-constraint verification for risky actions.
- [ ] This change keeps submission-facing material in English.
- [ ] This change does not commit secrets or credentials.
- [ ] If an official competition rule changed, I updated both `COMPETITION_RULES_LOCK.md` and `competition_rules.json`.

Official rules override repository assumptions.
