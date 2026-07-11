# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the next docs-first roadmap selection:

`Version 0.5.327 - Roadmap Post-Faction Deferral Selection`

## Current accepted repo state

Latest completed primary:

- `Version 0.5.326 - Faction Authority Seed Evidence Deferral`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`

Current guardrails:

- Faction validation scaffolding is complete, but seed/content/registration are deferred until an explicit user-authored canonical list or new durable source meets the full gate.
- Zero faction candidate ids are carried forward; do not repeat weak-source scans.
- People/NPC is paused behind a new-authored-input gate.
- Service, resource/commodity, and combat-health lanes are stable and paused after registration/expansion gates.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- A general organization umbrella remains rejected.
- Institution/office, government/jurisdiction/law/force, business/company, provider, membership/affiliation, and local-reputation authorities remain deferred behind separate boundary decisions.
- Do not transition to `0.6.0` without a dedicated runtime-readiness decision.

## Purpose

Create a docs-only roadmap selection that compares eligible remaining authority/planning lanes after the faction deferral and selects exactly one immediate next primary route.

Do not implement content, schemas, validators, tests, registration, runtime, UI, save/account, or gameplay.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Then read at minimum:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`
- `docs/design/faction-authority-seed-evidence-deferral.md`
- `docs/design/roadmap-post-people-npc-deferral-selection.md`
- `docs/design/roadmap-next-authority-selection.md`
- `docs/design/static-authority-validation-consolidation-audit.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- relevant permanent boundary/gate docs for each serious candidate lane.

Inspect current repository state only as needed to compare candidates. Do not reopen or repeat completed evidence audits without a changed prerequisite.

## Expected output

Add:

- `docs/design/roadmap-post-faction-deferral-selection.md`

## Required comparison

Compare at minimum:

- faction (deferred; new authored input required);
- People/NPC (deferred; new authored input required);
- service (paused);
- resource/commodity (paused);
- combat health (paused);
- generic POI/discovery (rejected/gated);
- Highcrown Knowledge (closed);
- institution/office;
- business/company;
- provider/service organization;
- membership/affiliation/rank/office-holder links;
- local reputation/standing/favorability;
- government/jurisdiction/law/force;
- location/place specialization beyond rejected generic POIs;
- family/lineage/household continuation;
- property/construction;
- social/relationship/dialogue/companion;
- agriculture;
- maritime;
- temporal/weather/festivals;
- progression/advancement;
- runtime ownership transition;
- any other concrete backlog lane that is more ready than these.

For each serious candidate, state:

- current authority/readiness;
- unmet prerequisites;
- whether Deep Research is needed now;
- whether a docs-only evidence audit, boundary decision, schema plan, or preservation gate is the smallest safe next step;
- why it should or should not be selected immediately.

Select exactly one route. Prefer the smallest coherent docs-first run with repository-local evidence and no blocked authored-input prerequisite.

## Required questions

Answer:

1. Which lanes are paused, rejected, closed, or authored-input blocked?
2. Which remaining lanes are genuinely eligible now?
3. Which candidate has the clearest unresolved owner boundary?
4. Which candidate has enough repository evidence for a docs-only next step?
5. Is Deep Research required before the selected route?
6. Is a support-suffix run needed?
7. Is an explicit user question needed?
8. Does the selected route change content or implementation?
9. What exact next version/name is selected?
10. Which guardrails must be carried into that prompt?

## Selection constraints

Do not select a lane merely because it has many mentions. Do not select implementation where a boundary/evidence/plan step is still required. Preserve all accepted deferrals and owner boundaries.

Do not reopen faction or People/NPC without their required new authored input. Do not reopen service, resource/commodity, combat health, generic `world.pois`, or Highcrown Knowledge without a changed prerequisite documented in the repository.

Do not route directly to runtime, UI, save/account, gameplay, or `0.6.0`.

## Allowed changes

Allowed new doc:

- `docs/design/roadmap-post-faction-deferral-selection.md`

Allowed coordination docs:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Also verify docs-only scope, no implementation changes, no Deep Research artifacts, no conflict markers/trailing whitespace, and aligned next-version pointers.

## Final output

Update the current output, handoff, sequence, roadmap, backlog, and active prompt consistently. The active prompt must contain the newly selected next runnable route.

## Suggested commit message

`docs(roadmap): select post-faction deferral route`
