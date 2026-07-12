# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused force/public-order evidence audit:

`Version 0.5.345 - Force Public Order Authority Evidence Audit`

## Current accepted repo state

- Latest completed primary: `Version 0.5.344 - Roadmap Post-Government-Jurisdiction Deferral Selection`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.345 - Force Public Order Authority Evidence Audit`
- No dedicated force/public-order collection, schema, validator, test, or registration is approved.
- Current signals span quest presentation, settlement/place descriptors, route-security posture, synthetic authority projections, combat vocabulary, prose, UI, and runtime.
- Static force identity remains separate from government, jurisdiction, law, institution, office, place, and enforcement/runtime.
- All current authored-input gates, pauses, rejections, closures, and runtime maturity boundaries remain in force.

## Purpose

Audit current repository evidence for a future static force/public-order identity owner. Classify exact authored, presentation, place, route-security, derived, combat, prose, UI/demo/test, and runtime signals without promoting them. Decide whether one force family, multiple separate families, or a zero-candidate deferral/boundary route is justified. Do not implement anything.

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
- `docs/design/roadmap-post-government-jurisdiction-deferral-selection.md`;
- `docs/design/civic-authority-boundary-decision.md`;
- government/jurisdiction and institution/office boundaries/deferrals;
- exact Aurelis Civic Watch quest evidence;
- exact settlement fort/watch/garrison descriptors and relevant building/infrastructure/place vocabulary;
- exact route-security/hazard authority posture;
- exact synthetic `military_authority` and `authority.*.garrison*` projections;
- combat guard/role/tactics/encounter/spawn vocabulary, backstory prose, reputation targets, UI/demo/tests, and runtime surfaces only as needed to classify ownership.

Keep searches targeted. Do not repeat unrelated authority audits or broad discovery.

## Expected output

Add:

- `docs/design/force-public-order-authority-evidence-audit.md`

## Required audit decisions

- inventory exact force/public-order-like authored, presentation, place, route-security, derived, combat, prose, consumer, test, and hypothetical signals;
- distinguish enduring named force identity from government, jurisdiction, law, institution, office, guild/order/faction, place/facility, profession/role, combat unit/actor, route-security overlay, quest giver, reputation target, and synthetic projection;
- distinguish static identity from affiliation, mandate, coverage, headquarters, readiness, membership, rank, office-holders, roster, schedule, patrol, spawn, encounter, AI, arrest, enforcement, cases, law, access, reputation, runtime, UI, save/account, and gameplay;
- decide whether guard/watch, militia, garrison, military force/order, route-security body, and other public-order concepts belong to one future family or require separate later owners;
- identify exact candidate ids only if durable canonical identity and complete owner placement are supported; otherwise carry forward zero ids;
- decide whether a later boundary decision, schema plan, authored-input deferral, or another route is justified;
- protect every current owner and reject prefix normalization, aliases, migrations, references, and consumer enablement;
- decide Deep Research, explicit-user-question, support-suffix, and exact next-route posture;
- make an explicit temporary-guardrail cleanup decision.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent force names or candidates, infer identity from place/prose/generated strings, create government/jurisdiction/law/office candidates, add references, normalize prefixes, enable consumers, or plan enforcement/runtime behavior. Do not reopen authored-input-gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/force-public-order-authority-evidence-audit.md`
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

Verify docs-only scope, unchanged code/content/scaffolds/current owners, no force/public-order/government/jurisdiction/law/office content or schema changes, no candidates/references/migrations/consumer changes unless explicitly proven in the audit document only, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(civic): audit force public-order evidence`
