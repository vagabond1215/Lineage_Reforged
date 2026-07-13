# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the documentation-only readiness consolidation:

`Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`

## Current accepted repo state

- Latest completed primary: `Version 0.5.356 - Tool Surface Test Boundary Repair`.
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`.
- Immediate next primary route: `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`.
- `docs/design/streamlined-pipeline-roadmap-decision.md` controls immediate sequencing where older coordination files still name a primary post-repair audit.
- The tool-surface lane is treated as complete from the landed source shape and the focused validation recorded in `docs/dev/current-codex-output.md`.
- A post-repair audit is optional support work only as `Version 0.5.356.1` if fresh local focused verification contradicts the handoff.
- The other fourteen accepted full-suite failures and broad UI/workspace typecheck debt remain owner-specific debt, not universal blockers.
- Static zero-id authority lanes retain their authored-input and ready-consumer gates.
- The project remains in `v0.5.x` foundation stabilization and ownership hardening. This run may define `v0.6.x` entry conditions but must not implement the transition.

## Purpose

Replace repeated authority selection and micro-audit routing with one repository-local readiness decision for the first `v0.6.x` runtime-ownership transition.

Map existing UI/demo orchestration, engine/helper boundaries, authoritative state owners, results/events, save/load, deterministic simulation, validation, and candidate consumer seams. Compare only evidence-backed candidates and select exactly one first engine-owned path, or return exactly one narrow decision-ready blocker card when repository evidence cannot choose safely.

Do not invent a quest, NPC, monster, faction, organization, business, government, force, conflict, currency, item, location, spell, combat style, save scope, UI mode, or other canon/product requirement.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md`;
- `README.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/project-roadmap.md`;
- `docs/dev/project-vision-and-continuity-brief.md`;
- `docs/future_content_backlog.md`;
- `docs/design/streamlined-pipeline-roadmap-decision.md`;
- `docs/dev/tmp-deep-research-streamlined-pipeline-review-2026-07-12.md`;
- `docs/design/future-system-design-ledger.md`;
- `docs/design/pipeline-roadmap-consolidation-decision.md`;
- `docs/design/validation-source-map.md`;
- `docs/design/validation-command-matrix-plan.md`;
- `docs/design/tool-surface-test-boundary-decision.md`;
- the existing runtime ownership, command, event, save/account, Chronicle, quest, discovery, travel/movement, economy-tick, session, and UI orchestration plans/source needed to evaluate candidates;
- relevant game/player/world/civilization/session contracts, save snapshot and roundtrip tests, deterministic simulation tests, UI game-shell mutation seams, and engine exports.

Use repository search to locate current command/intention, emitted-event/result, state mutation, persistence, and UI-owned orchestration seams. Do not rely on filenames alone.

## Required output

Add:

- `docs/design/runtime-ownership-transition-readiness-consolidation.md`

The new document must include:

1. exact current ownership map across UI/demo orchestration, engine/shared packages, game/player/world/civilization/session state, commands/intentions, result/event envelopes, save snapshots, account state, and deterministic simulation;
2. a candidate table containing only repository-evidenced first-consumer paths;
3. a transparent score for each candidate using player/session-loop contribution, reuse of existing foundations, dependency-unblocking value, player-visible value, persistence readiness, deterministic-test readiness, UI-adapter clarity, owner clarity, architectural/runtime risk, user-input dependency, research dependency, scope/coordination cost, reversibility, and planning-loop risk;
4. exactly one selected first engine-owned consumer, or exactly one narrow user decision card if evidence produces a material tie or product choice;
5. exact input, output, state, event/result, persistence, UI-adapter, validation, failure, rollback/reversibility, and stop-condition boundaries for the selected path;
6. a dependency graph from the current `0.5.356` state through `v0.6.x` readiness, `v0.7.x` integration, and `v0.8.x` vertical-slice hardening without reserving dozens of micro-versions;
7. a bounded list of current full-suite/typecheck failures that directly affect the selected path, with unrelated debt explicitly excluded;
8. the minimum conditions required before the first `v0.6.x` implementation package;
9. a milestone-sized recommended `v0.6.x` package sequence, combining deterministic steps where safe and preserving separate gates for high-risk mutation;
10. a cleanup/retirement disposition for the temporary Deep Research intake and any superseded planning-only pointers;
11. a source-of-truth reconciliation for current execution, near-term queue, long-term roadmap, durable design criteria, validation routing, backlog, user decisions, and research inputs.

## Candidate rules

Candidates must already have meaningful repository evidence. Possible families to inspect include session start/continue, travel or movement, discovery, generated quest offers and quest state, economy tick output, Chronicle/event projection, or another existing seam. This list is not approval and does not require selecting any named family.

Reject a candidate when it requires invented canon, broad new static authority, unresolved high-risk persistence ownership, major research, or a large UI/runtime rewrite before it can prove one engine-owned transition.

Prefer a candidate that:

- reuses current content, state, helpers, UI, and tests;
- exposes a clear current UI/demo ownership seam that should move into the engine;
- has deterministic inputs and observable outputs;
- can be persisted and round-tripped without inventing a compatibility policy;
- unlocks later integration work;
- can be implemented and validated as one coherent bounded package.

## Pipeline and roadmap reconciliation

Update the active coordination files so they agree on:

- `0.5.356` as the latest completed primary;
- `0.5.357 - Runtime Ownership Transition Readiness Consolidation` as this completed docs route;
- the selected next route from the readiness decision;
- the optional `0.5.356.1` audit only if fresh verification justified it;
- milestone-and-consumer-first routing;
- support suffix use for narrow audits, repairs, retries, validation follow-ups, and coordination-only work;
- no repeated unchanged-source evidence audits;
- named-consumer requirements before new schema/content expansion;
- existing maturity-band meanings from `AGENTS.md`.

Preserve useful historical route data. Do not delete or rewrite completed-route chronology merely to shorten files. Add a compact current queue/override section if that is safer than restructuring long history.

## User decision rule

Do not ask a broad design question. If repository evidence cannot select one candidate because of a material product choice, produce exactly one decision card with:

- decision;
- affected lane and candidate paths;
- why repository evidence cannot answer it;
- minimum choice needed;
- options;
- recommended default;
- what each option unlocks;
- whether other work can continue.

If one candidate is clearly superior by the stated framework, select it without user input.

## Research rule

Do not run Deep Research. Recommend later research only for one exact unresolved question that blocks a scheduled package and has a named durable consumer. External research must not create canon or mechanics.

## Validation and command boundaries

This is a documentation-only route.

Required:

```bash
git diff --check
git status --short --branch
```

Also run conflict-marker, changed-path, active-route-pointer, and temporary-artifact-reference checks over changed files.

You may run existing exact focused, side-effect-free tests only when needed to verify a material candidate claim. Report them precisely. Do not modify tests.

Do not run:

- full `npm.cmd test`;
- DB build;
- UI build;
- broad UI or workspace typechecks;
- package installation;
- network-dependent commands beyond the required Git sync;
- dev or preview servers;
- generated-output refresh.

## Guardrails

Documentation only. Do not add or edit production source, tests, schemas, validators, content JSON, package scripts, configs, dependencies, generated/vendor output, runtime behavior, UI behavior, account state, save/account contracts, commands, events, rewards, or gameplay.

Do not:

- reopen zero-id authored-input lanes without qualifying new input;
- create a schema or content seed;
- fix unrelated validation or typecheck debt;
- invent sample content or mechanics;
- transition to `0.6.0` in this run;
- create another open-ended roadmap-selection chain;
- assign separate future primary versions to trivial coordination or deterministic substeps;
- delete the temporary research intake unless every useful finding has been promoted and its provenance is no longer needed.

## Allowed changes

- `docs/design/runtime-ownership-transition-readiness-consolidation.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md` only if a stale current-anchor/source-map statement must be corrected
- `docs/future_content_backlog.md`
- `docs/design/streamlined-pipeline-roadmap-decision.md` only for a factual correction discovered from local evidence
- `docs/dev/tmp-deep-research-streamlined-pipeline-review-2026-07-12.md` only for status/retirement notes; do not erase preserved findings

## Stop conditions

Stop and report rather than broadening if:

- every candidate depends on invented canon or an unresolved product decision;
- selecting a candidate requires code changes to determine current ownership;
- current save/event/state contracts are contradictory and cannot be resolved docs-only;
- a required source file is missing or materially stale;
- repository state contradicts the accepted `0.5.356` handoff;
- meaningful progress would require broad typecheck/full-suite triage;
- more than one user decision is necessary before a first consumer can be chosen.

## Handoff requirements

Write the detailed result to `docs/dev/current-codex-output.md` using the repository format. State:

- source version/run;
- date;
- branch/status assumption;
- files changed;
- checks run and checks intentionally not run;
- selected first consumer or blocker decision card;
- direct blockers versus excluded debt;
- temporary-artifact disposition;
- next recommended version/run;
- suggested commit message.

Suggested commit message:

`docs(planning): consolidate runtime ownership readiness`
