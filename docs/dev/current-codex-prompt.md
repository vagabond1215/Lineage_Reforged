# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused roadmap selection:

`Version 0.5.352 - Roadmap Post-Diplomacy-Conflict Deferral Selection`

## Current accepted repo state

- Latest completed primary: `Version 0.5.351 - Diplomacy Conflict Authority Evidence Deferral`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.352 - Roadmap Post-Diplomacy-Conflict Deferral Selection`
- Diplomacy/conflict is gated behind separate materially-new-authored-input or ready-consumer contracts with exactly zero ids.
- Force/public order, government/jurisdiction, business, faction, institution, and People/NPC are gated.
- Service, resource/commodity, and combat health are paused; generic `world.pois` is rejected; Highcrown settlement Knowledge is closed.
- Office is not schema-ready; Living Character Manuscript implementation and runtime ownership transition remain maturity-gated.

## Purpose

Compare the current gated, paused, rejected, closed, research-gated, maturity-gated, and genuinely eligible lanes. Select exactly one smallest safe documentation-first next route without reopening a gated lane by default or implementing anything.

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
- the current deferral/closure documents for diplomacy/conflict, force/public order, government/jurisdiction, business, faction, institution, People/NPC, service, resource/commodity, combat health, generic POI, Highcrown settlement Knowledge, and office;
- Living Character Manuscript and runtime-readiness guardrails only as needed to classify their gates.

Use existing decisions. Do not repeat broad evidence discovery.

## Expected output

Add:

- `docs/design/roadmap-post-diplomacy-conflict-deferral-selection.md`

## Required decisions

- inventory the current lanes by exact posture: gated, paused, rejected, closed, research-gated, maturity-gated, or eligible;
- preserve every existing owner boundary, zero-id result, reopening condition, pause, rejection, closure, and runtime/magic/save/manuscript guardrail;
- identify the smallest coherent eligible docs-first route based on current repository need and evidence, not novelty;
- select exactly one next primary version and define its narrow inputs, outputs, non-goals, validation, and stop conditions;
- do not select implementation merely because a schema or seed exists;
- do not reopen diplomacy/conflict or another gated lane without a named qualifying new input;
- decide whether any explicit user question, Deep Research, support suffix, or temporary guardrail is required before the selected route.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent canon or ids. Do not reopen gated, paused, rejected, closed, research-gated, or maturity-gated work without satisfying its existing gate. Do not transition to `0.6.0`. Do not run Deep Research unless the comparison proves a specific eligible research need and the final selection documents why local evidence is insufficient.

## Allowed changes

- `docs/design/roadmap-post-diplomacy-conflict-deferral-selection.md`
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

Verify docs-only scope, unchanged code/content/scaffolds/current owners, no candidate ids or gated-lane reopening, no implementation permission, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers.

Suggested commit message:

`docs(roadmap): select post-diplomacy deferral route`
