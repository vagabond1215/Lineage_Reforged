# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the first runtime-ownership transition:

`Version 0.6.0 - Engine-Owned Player Travel Command`

## Accepted state

- Latest completed primary: `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`.
- Player travel/movement is the selected first engine-owned consumer.
- `docs/design/runtime-ownership-transition-readiness-consolidation.md` owns the exact command, state, event/result, persistence, UI-adapter, validation, failure, rollback, and stop boundaries.
- Current travel behavior is UI-owned in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` and invoked by `features/WorldPanel.tsx`.
- Existing shared/game/player engine helpers and snapshot persistence are the required foundation.

## Purpose

Move the existing player travel transition behind one engine-owned command without changing current behavior or canon. Land one coherent reviewable package containing the narrow command/result contract, atomic handler, current completion event and session projections, focused deterministic/rejection/roundtrip tests, and the narrow `WorldPanel` adapter migration.

## Required first steps

Run branch status, fetch, and fast-forward pull. Read `AGENTS.md`, README, current output/handoff/prompt, the runtime-readiness decision, streamlined pipeline decision, validation source map/matrix, relevant shared/game/player contracts and exports, `gameplayLoop.ts`, `WorldPanel.tsx`, snapshot/persistence owners, and focused gameplay/roundtrip tests.

Before editing, record whether the tree is dirty and preserve unrelated changes.

## Required behavior

- UI sends player id, destination id, current tick/revision, and current state/context only.
- Engine validates owner, revision, implemented destination, known status, and not-already-current status.
- Preserve existing travel timing, costs, clock/body/resource behavior, region/location, geographic Knowledge, current activity, known-location, quest-arrival operation hooks, Chronicle, notifications, ids, labels, and text.
- Successful resolution is atomic and emits one travel-completed event.
- Rejection returns a stable code, emits no completion event, and preserves original state identity/content.
- Command/result envelopes are transient; use existing snapshot fields and persistence.
- UI adapter applies accepted next state and derives notices from result facts/codes without duplicating validation or mutation.
- Remove direct UI ownership of the migrated travel transition; do not leave dual authority.

## Scope

Allowed production scope is limited to the smallest coherent set under:

- shared command/result/event types if required;
- game-engine/player-engine travel handler and exports;
- the existing UI gameplay-loop travel bridge and `WorldPanel` adapter;
- exact focused tests;
- required coordination/output/backlog files.

Do not add dependencies, content JSON, schemas, save fields, migrations, old-save compatibility, routes, locations, encounters, hazards, survival, pathfinding, map reveal, caravan/economy transport, new quest behavior, account behavior, or a broad UI rewrite.

## Stop conditions

Stop rather than broaden if current parity requires new canon, a persisted-field/version change, quest redesign, a separate Chronicle product decision, broad compiler/full-suite cleanup, or expansion into adjacent runtime systems.

## Validation

Run exact new travel tests, existing adjacent gameplay-loop skill-gating tests, post-travel save roundtrip coverage, deterministic scenario coverage, relevant focused event/export tests, and `git diff --check`. Use UI/workspace typecheck only as a baseline audit if it materially clarifies touched-module risk; do not fix unrelated debt. Do not run the full suite, DB build, package installation, or generated-output refresh unless separately authorized.

Verify no behavior drift, no direct UI travel mutation remains, no partial mutation on rejection, no new persistence fields, no unrelated changed paths, and no conflict markers/trailing whitespace.

## Handoff

Overwrite `docs/dev/current-codex-output.md` with source version/run, date, branch/status assumption, files changed, checks run and intentionally omitted, behavior confirmation, direct blockers/excluded debt, temporary-research retirement decision, next recommended version/run, and suggested commit message.

Suggested commit message:

`feat(runtime): move player travel into engine ownership`
