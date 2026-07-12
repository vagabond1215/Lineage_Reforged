# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the post-civic-deferral roadmap selection:

`Version 0.5.344 - Roadmap Post-Government-Jurisdiction Deferral Selection`

## Current accepted repo state

- Latest completed primary: `Version 0.5.343 - Government Jurisdiction Authority Evidence Deferral`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.344 - Roadmap Post-Government-Jurisdiction Deferral Selection`
- Government/jurisdiction, business, faction, institution, and People/NPC are gated on materially new inputs.
- Service, resource/commodity, and combat health remain stable and paused.
- Generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed; office remains not schema-ready.
- Law remains downstream of jurisdiction; force/public order and enforcement remain separate.
- Runtime ownership transition remains a `0.6.x` maturity milestone.

## Purpose

Compare remaining eligible documentation, authority, stabilization, research, and runtime-readiness lanes after the civic deferral. Select exactly one smallest safe next primary route without reopening gated, paused, rejected, or closed work by default. Do not implement the selected route.

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
- `docs/design/government-jurisdiction-authority-evidence-deferral.md`;
- current business, faction, institution, and People/NPC deferrals;
- service, resource/commodity, and combat-health pause decisions;
- generic POI rejection and Highcrown Knowledge closure;
- current force/public-order, office, provider, membership/reputation, place/property/construction, family/household continuation, social, agriculture, maritime, temporal, progression, Knowledge/magic, stabilization, and runtime-transition boundaries/gates only as needed for current eligibility.

Do not repeat completed evidence audits or broad source discovery.

## Expected output

Add:

- `docs/design/roadmap-post-government-jurisdiction-deferral-selection.md`

## Required selection decisions

- inventory serious remaining candidate lanes and current prerequisites;
- preserve every authored-input/ready-consumer gate, pause, rejection, and closure;
- keep law blocked behind jurisdiction and enforcement/runtime separate from static force identity;
- distinguish docs-only owner/boundary work from research-gated, dependency-blocked, runtime-adjacent, and maturity-gated work;
- identify whether a concrete stabilization defect justifies a support suffix instead of a primary route;
- decide Deep Research, explicit-user-question, support-suffix, and version-band posture;
- select exactly one smallest safe next primary route with explicit non-goals;
- do not implement or pre-author the selected lane's content/candidates.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not reopen gated or paused lanes without a materially new qualifying input. Do not restore generic `world.pois`, reopen Highcrown Knowledge, invent candidates, normalize prefixes, add references, or advance to `0.6.0` without a dedicated readiness decision. Do not perform Deep Research in this run; record an exact research gate and consumer if one becomes the selected prerequisite.

## Allowed changes

- `docs/design/roadmap-post-government-jurisdiction-deferral-selection.md`
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

Verify docs-only scope, unchanged code/content/scaffolds/current owners, no gated-lane reopening, no candidates/references/migrations/consumer changes, no repeated evidence scan, retired temporary civic research, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(roadmap): select post-civic deferral route`
