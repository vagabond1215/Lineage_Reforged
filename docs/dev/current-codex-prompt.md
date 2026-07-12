# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Select the next safe roadmap lane:

`Version 0.5.333 - Roadmap Post-Institution Deferral Selection`

## Current accepted repo state

- Latest completed primary: `Version 0.5.332 - Institution Authority Seed Evidence Deferral`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.333 - Roadmap Post-Institution Deferral Selection`
- Institution, faction, and People/NPC seed lanes are authored-input gated with zero approved ids.
- Institution schema/validator/test scaffolding exists but live content and normal registration remain absent.
- Service, resource/commodity, and combat health are paused after stable registered slices.
- Generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed.
- Office remains not schema-ready.

## Purpose

Perform a docs-only roadmap selection after institution deferral. Compare remaining lanes using current authority, dependency, evidence, consumer, and maturity posture. Select exactly one smallest safe next route without implementation or reopening a gated lane by default.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md`
- `README.md`
- current output, handoff, prompt, sequence, roadmap, and backlog;
- `docs/design/institution-authority-seed-evidence-deferral.md`;
- faction and People/NPC deferrals;
- service, resource/commodity, and combat-health pause/expansion gates;
- generic POI rejection and Highcrown Knowledge closure;
- organization/institution/office, civic, economy, social, settlement/place, provider, membership/link, reputation, business/company, government/legal/force, property/construction, progression, temporal, agriculture, maritime, and runtime-ownership boundaries relevant to candidate selection;
- `docs/design/pipeline-roadmap-consolidation-decision.md` and current future-system ledger when needed.

Use existing focused decisions; do not repeat completed evidence audits.

## Expected output

Add:

- `docs/design/roadmap-post-institution-deferral-selection.md`

## Required selection decisions

- classify each plausible lane as eligible, blocked, paused, rejected, closed, research-gated, user-authorship-gated, or runtime-maturity-gated;
- preserve all existing owner boundaries and gates;
- compare at least office, government/jurisdiction/law/force, business/company, provider, membership/affiliation/office-holder links, local reputation/standing, place/facility/property/construction, social systems, agriculture, maritime, temporal/age, progression, remaining Knowledge/magic, runtime ownership, and other roadmap candidates;
- avoid selecting a schema/content run where owner identity or authored canon is missing;
- decide whether one narrow docs-first boundary, evidence, source-map, stabilization, or readiness run is eligible;
- decide whether Deep Research, an explicit user question, or a support-suffix run is required before the selected route;
- select exactly one next primary version and name;
- do not advance to `0.6.0` unless a dedicated readiness decision proves the runtime ownership transition milestone.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, runtime, UI, save/account, or gameplay. Do not invent candidate ids or reopen institution, faction, People/NPC, service, resource/commodity, combat health, generic POI, Highcrown Knowledge, office, or another gated lane without new qualifying evidence. Do not run Deep Research unless the selection identifies a precise external question and direct downstream consumer.

## Allowed changes

- `docs/design/roadmap-post-institution-deferral-selection.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, unchanged gated scaffolds and live content, no candidate ids or behavior changes, no repeated audit/research artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(roadmap): select post-institution lane`
