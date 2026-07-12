# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the post-business roadmap selection:

`Version 0.5.340 - Roadmap Post-Business Deferral Selection`

## Current accepted repo state

- Latest completed primary: `Version 0.5.339 - Business Authority Seed Evidence Deferral`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.340 - Roadmap Post-Business Deferral Selection`
- Business, faction, institution, and People/NPC seed lanes are authored-input gated.
- Service, resource/commodity, and combat health are stable and paused.
- Generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed; office remains not schema-ready.
- Runtime ownership transition remains a `0.6.x` maturity milestone, not current permission.

## Purpose

Compare the remaining eligible documentation, authority, stabilization, and runtime-readiness lanes after the business deferral. Select exactly one smallest safe next primary route without reopening gated, paused, rejected, or closed work by default. Do not implement the selected route.

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
- `docs/design/business-authority-seed-evidence-deferral.md`;
- faction, institution, and People/NPC deferrals;
- service, resource/commodity, and combat-health pause/post-registration decisions;
- generic POI rejection and Highcrown Knowledge closure;
- current civic/legal/force, provider, membership/reputation, place/property/construction, social, agriculture, maritime, temporal, progression, magic, and runtime-transition boundary/gate documents only as needed for current eligibility.

Do not repeat completed evidence audits or broad source discovery.

## Expected output

Add:

- `docs/design/roadmap-post-business-deferral-selection.md`

## Required selection decisions

- inventory serious remaining candidate lanes and their current prerequisites;
- preserve business, faction, institution, and People/NPC authored-input gates;
- preserve service, resource/commodity, and combat-health pauses;
- preserve generic POI rejection and Highcrown Knowledge closure;
- distinguish docs-only owner/boundary work from research-gated, dependency-blocked, runtime-adjacent, and maturity-gated work;
- identify whether any concrete stabilization defect justifies a support run instead of a primary route;
- decide Deep Research, explicit-user-question, support-suffix, and version-band posture;
- select exactly one smallest safe next primary route with explicit non-goals;
- do not implement that route or pre-author its content/candidates.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not reopen authored-input-gated or paused lanes without materially new qualifying evidence. Do not restore generic `world.pois`, reopen Highcrown Knowledge, invent candidates, normalize prefixes, add references, or advance to `0.6.0` without a dedicated readiness decision. Do not run Deep Research unless this selection proves one exact research question and downstream consumer; record the gate rather than performing research in this run.

## Allowed changes

- `docs/design/roadmap-post-business-deferral-selection.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/business-validation.test.mjs
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, unchanged code/content/scaffolds/current owners, no gated-lane reopening, no candidates/references/migrations/consumer changes, no repeated evidence scan, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(roadmap): select post-business deferral route`
