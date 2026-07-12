# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused civic owner decision:

`Version 0.5.342 - Government Jurisdiction Authority Boundary Decision`

## Current accepted repo state

- Latest completed primary: `Version 0.5.341 - Government Jurisdiction Authority Evidence Audit`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.342 - Government Jurisdiction Authority Boundary Decision`
- Exactly zero government ids and zero jurisdiction ids passed the evidence audit.
- Government-like evidence is limited to polity/place context, two quest presentation anchors, and synthetic authority projections.
- Jurisdiction-like evidence is limited to planning boundaries plus place, property/legal-label, access, and runtime consumer signals.
- Law remains downstream of jurisdiction; force/enforcement remains separate.
- No government or jurisdiction collection, schema, validator, focused test, or registration exists.

## Purpose

Define the exact owner boundary between government organization and jurisdiction applicability. Decide whether government, jurisdiction, both separately, or neither is ready for one later content-independent schema plan. Carry forward zero ids and do not implement anything.

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
- `docs/design/government-jurisdiction-authority-evidence-audit.md`;
- `docs/design/civic-authority-boundary-decision.md`;
- `docs/design/polity-schema-decision.md`;
- `docs/design/institution-office-authority-boundary-decision.md`;
- the live polity records/schema/validator posture;
- exact already-audited settlement, quest, derived authority/property, legal/access/standing, validator, Knowledge, UI/demo/test surfaces only as needed to confirm boundaries.

Do not repeat the evidence audit or broaden discovery.

## Expected output

Add:

- `docs/design/government-jurisdiction-authority-boundary-decision.md`

## Required boundary decisions

- define what a future government identity or governing-arrangement record may own;
- define what a future jurisdiction applicability record may own;
- define cardinality/temporal questions that must remain outside first-pass identity unless decision-complete;
- separate government from polity, institution, office, force, settlement administration, people/rulers, departments/agencies, and runtime;
- separate jurisdiction from physical place, polity anchors, claims/control, government, law, courts, force coverage, property legal labels, access, citizenship/legal standing, and runtime;
- preserve law as downstream of jurisdiction and force/enforcement as separate;
- classify the two quest `office.*` anchors and all synthetic `authority.*` ids as non-canonical;
- carry forward exactly zero `government.*` and zero `jurisdiction.*` ids;
- select at most one later schema-planning route, or a fail-closed authored-input deferral if neither owner is decision-ready;
- decide first-pass references, Deep Research, explicit-user-question, support-suffix, and exact next-route posture;
- keep temporary civic research retired.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent names or candidates, promote quest/generated ids, infer government or jurisdiction from other owners, add references, normalize prefixes, enable consumers, or plan law/force/runtime behavior. Do not reopen authored-input-gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/government-jurisdiction-authority-boundary-decision.md`
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

Verify docs-only scope, unchanged polity/institution/current-owner surfaces, zero candidate ids, no government/jurisdiction/law/force content or schema changes, no references/migrations/consumer changes, no gated-lane reopening, retired temporary civic research, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(civic): decide government jurisdiction boundary`
