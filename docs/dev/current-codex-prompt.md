# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused post-force/public-order roadmap selection:

`Version 0.5.348 - Roadmap Post-Force-Public-Order Deferral Selection`

## Current accepted repo state

- Latest completed primary: `Version 0.5.347 - Force Public Order Authority Evidence Deferral`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.348 - Roadmap Post-Force-Public-Order Deferral Selection`
- Force/public order is authored-input/ready-consumer gated with one broad future family and exactly zero ids.
- Government/jurisdiction, business, faction, institution, and People/NPC remain gated.
- Service, resource/commodity, and combat health remain paused.
- Generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed; office remains not schema-ready.
- Living Character Manuscript implementation and runtime ownership transition remain maturity-gated.

## Purpose

Review the current permanent roadmap, sequence, backlog, completed boundaries, pauses, closures, and readiness gates. Select exactly one smallest safe next docs-first route without reopening force/public order or any other gated, paused, rejected, or closed lane. Do not implement anything.

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
- `docs/design/force-public-order-authority-evidence-deferral.md`;
- the latest permanent deferral, pause, rejection, closure, pipeline, and roadmap-selection authorities needed to classify remaining lanes;
- `docs/design/future-system-design-ledger.md` only for durable unresolved criteria, not as implementation permission.

Keep inspection roadmap-focused. Do not repeat completed evidence audits or broaden into content/runtime discovery.

## Expected output

Add:

- `docs/design/roadmap-post-force-public-order-deferral-selection.md`

## Required selection decisions

- inventory current gated, paused, rejected, closed, completed, and genuinely eligible lanes;
- preserve exact reopening conditions for force/public order, government/jurisdiction, business, faction, institution, and People/NPC;
- preserve service, resource/commodity, combat-health, POI, Highcrown Knowledge, office, manuscript, magic-runtime, save/account, and runtime-maturity guardrails;
- compare only currently eligible documentation, authority-boundary, stabilization, research-readiness, or runtime-readiness planning routes;
- select exactly one smallest safe next primary version/run and explain why it is eligible and dependency-correct;
- authorize no schema, content, candidates, references, migrations, consumers, runtime, UI, save/account, or gameplay in this selection pass;
- decide Deep Research, explicit-user-question, support-suffix, and temporary-guardrail posture;
- remain in `0.5.x` unless a dedicated runtime-readiness decision already proves the `0.6.x` transition, which it currently does not.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent candidates, author canon, promote current strings, add references, normalize prefixes, enable consumers, or plan enforcement/patrol/combat/magic runtime behavior. Do not reopen gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/roadmap-post-force-public-order-deferral-selection.md`
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

Verify docs-only scope, unchanged code/content/scaffolds/current owners, no candidate ids, no content/schema/reference/migration/consumer changes, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers.

## Suggested commit message

`docs(roadmap): select post-force deferral route`
