# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused civic evidence audit:

`Version 0.5.341 - Government Jurisdiction Authority Evidence Audit`

## Current accepted repo state

- Latest completed primary: `Version 0.5.340 - Roadmap Post-Business Deferral Selection`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.341 - Government Jurisdiction Authority Evidence Audit`
- Two planned polity records are live and normally validated.
- Polity identity, government organization, jurisdiction applicability, law, force, and mutable runtime state are separate owners.
- Institution and office are separate; office remains not schema-ready.
- Law requires jurisdiction first; force/enforcement remains a separate future lane.
- Existing authored-input gates, pauses, rejections, closures, and runtime maturity gates remain in force.

## Purpose

Audit current repository evidence for future government organization and jurisdiction applicability authorities. Classify exact sources and owner boundaries without promoting presentation, place, polity, prose, derived, property/legal-label, runtime, UI, demo, or test surfaces. Decide whether either layer has enough durable evidence for one later boundary decision, or whether zero candidates and a fail-closed deferral are required. Do not implement anything.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md` and `README.md`;
- current output, handoff, prompt, sequence, roadmap, and backlog;
- `docs/design/roadmap-post-business-deferral-selection.md`;
- `docs/design/civic-authority-boundary-decision.md`;
- `docs/design/polity-schema-decision.md` and the live polity records/schema/validator posture;
- `docs/design/institution-office-authority-boundary-decision.md`;
- exact settlement administrative-role/government-like fields, quest office/civic anchors, derived civil/military authority strings, property/legal/access vocabulary, player lawful-standing/reputation surfaces, and relevant tests/examples;
- law, court, force, diplomacy/conflict, Knowledge, runtime, UI, save/account, and gameplay surfaces only as needed to classify ownership and non-authority.

Keep searches targeted. Do not repeat unrelated authority audits or broad discovery.

## Expected output

Add:

- `docs/design/government-jurisdiction-authority-evidence-audit.md`

## Required audit decisions

- inventory exact government-like and jurisdiction-like authored, presentation, place, polity, derived, property/legal-label, runtime, UI/demo/test, and hypothetical evidence;
- distinguish durable government organization from polity form, rulers/offices, institutions, settlement administration, synthetic civil authorities, and prose;
- distinguish jurisdiction applicability from physical place, polity anchors/claims/control, law text, courts, force coverage, property legal labels, access, and runtime lawful standing;
- preserve law as downstream of jurisdiction and preserve force/enforcement as separate;
- identify exact current candidate ids only if durable canonical identity and complete owner placement are supported; otherwise carry forward zero ids;
- decide whether government, jurisdiction, both separately, or neither is ready for one later boundary/schema-planning route;
- protect every current owner and reject prefix normalization, aliases, migrations, references, and consumer enablement;
- decide Deep Research, explicit-user-question, support-suffix, and exact next-route posture;
- make an explicit cleanup decision for any temporary guardrail doc encountered.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent government or jurisdiction names, infer identity from polity/settlement/prose/derived strings, create law or force candidates, add references, normalize prefixes, or enable consumers. Do not reopen authored-input-gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/government-jurisdiction-authority-evidence-audit.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/polity-validation.test.mjs
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, unchanged polity/institution and current-owner surfaces, no government/jurisdiction/law/force content or schema changes, no candidates/references/migrations/consumer changes unless explicitly proven in the audit document only, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(civic): audit government jurisdiction evidence`
