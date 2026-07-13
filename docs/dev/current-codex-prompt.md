# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.2.1 - Engine-Owned Quest Tracking Post-Transition Audit`

## Accepted State

- `Version 0.6.2 - Engine-Owned Quest Tracking Command` moved only quest track/untrack behind one engine resolver, deterministic transient command, atomic synchronized result, and typed accepted event.
- Exact characterized track/untrack snapshots and notices passed, along with 35/35 focused tests.
- `makeQuestState(...)` now consumes the engine resolver for `canTrack`; `gameplayLoop.ts` is the command/notice bridge; `QuestsPanel.tsx` applies accepted snapshots only.
- Existing quest turn-in cleanup may still clear `trackedQuestId`; it is outside the tracking command and must not be changed in this audit.
- No Deep Research or user decision is required.

## Purpose

Perform one read-only post-transition audit of engine-owned quest tracking. Decide whether the extraction is accepted or whether one smallest repair run is required.

Do not modify runtime, UI, shared contracts, events, tests, content, schemas, saves, dependencies, or generated output in this run.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, `README.md`, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, runtime-ownership readiness, player-travel clarification, and backlog.
3. Inspect the tracking resolver/command/result/event, shared event registration and exports, snapshot synchronizer, UI bridge and application site, characterization/command tests, persistence contracts, and the accepted travel/quest-acceptance patterns.

## Audit Gates

### Authority and scope

- Confirm the engine resolver is the sole owner of tracking lookup and eligibility for both execution and UI `canTrack` projection.
- Confirm the tracking UI bridge contains no direct `trackedQuestId` mutation and only derives notices.
- Classify every remaining `trackedQuestId` assignment by owner. Existing quest turn-in cleanup is allowed; duplicated tracking ownership is not.
- Confirm no unrelated quest lifecycle, activity, rest, reward, notification, Chronicle, UI-layout, or future presentation work entered the patch.

### Behavior parity

- Re-run the locked complete track/untrack snapshot and notice hashes.
- Confirm toggle-on/off semantics, synchronization result, notice tone/title/detail, and input immutability are exact.
- Confirm completed, failed, and missing quests remain unavailable in both resolver and UI projection.

### Command identity and atomicity

- Confirm command shape includes player id, quest id, deterministic sequence, expected tick, snapshot version, full revision, and collision-safe deterministic identity.
- Confirm identical fixtures repeat exactly and distinct same-tick intents cannot collide.
- Confirm malformed, wrong-player, stale, incoherent, missing, completed, failed, and injected-failure paths return the original snapshot identity/content and emit zero events.
- Confirm accepted execution clones, changes only tracking state before existing synchronization, and cannot expose a partial clone.

### Event, persistence, and browser boundary

- Confirm exactly one typed accepted event with command/player/quest identity and resulting tracked state, without presentation prose or snapshot internals.
- Confirm notification and Chronicle state do not change.
- Confirm current-data serialization roundtrip preserves accepted state and persists no command correlation.
- Confirm browser-safe imports, intentional TS/JS peer alignment, event registration, and public exports.

### UI adapter and hygiene

- Confirm `QuestsPanel.tsx` applies returned snapshots only on accepted results and still displays every rejection notice.
- Confirm no conflict markers, temporary artifacts, accidental generated/vendor edits, unrelated refactors, or dependency changes.
- Run `git diff --check` and inspect the complete changed-path set.

## Required Tests

Run:

`node --test tests/unit/player-quest-tracking-command.test.mjs tests/unit/player-quest-tracking-characterization.test.mjs tests/unit/player-quest-acceptance-command.test.mjs tests/unit/player-quest-acceptance-characterization.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Do not run the full suite, DB build, UI build, package installation, servers, or generated-output refresh. Run typecheck only if it materially clarifies a touched-boundary diagnostic.

## Decision Rule

- If all gates pass, accept `0.6.2`, compare activity selection, activity advancement, rest, and quest turn-in using current source evidence, and select exactly one next bounded consumer. Write its implementation prompt.
- If a material defect exists, select `Version 0.6.2.2 - Engine-Owned Quest Tracking Repair`, define only the smallest coherent repair, and do not select another consumer.
- Do not implement a repair during this read-only audit.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and overwrite this file with the exact accepted next implementation or smallest repair prompt. Record source/run/date, starting status, files inspected, checks, gate evidence, decision, risks, next version, and suggested commit.

Suggested commit message:

`docs(audit): verify engine-owned quest tracking transition`
