# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.2.3 - Engine-Owned Quest Tracking Post-Repair Audit`

## Accepted State

- `Version 0.6.2 - Engine-Owned Quest Tracking Command` moved track/untrack behind one engine resolver, deterministic transient command, atomic synchronized result, and typed accepted event.
- `Version 0.6.2.1 - Engine-Owned Quest Tracking Post-Transition Audit` found one defect: the accepted event leaked display `title` despite the no-presentation-prose boundary.
- `Version 0.6.2.2 - Engine-Owned Quest Tracking Repair` removed only that event member and construction expression, added an exact six-key/no-title regression guard, preserved result/notice title facts and exact behavior hashes, and passed 35/35 focused tests.
- No Deep Research or user decision is required.

## Purpose

Perform one read-only post-repair audit. Decide whether the repaired quest-tracking transition is accepted or whether one further smallest repair is required.

Do not modify runtime, UI, shared contracts, events, tests, content, schemas, saves, dependencies, or generated output in this run.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, README, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, runtime-ownership readiness, player-travel clarification, and backlog.
3. Inspect the committed `0.6.2.2` diff, tracking resolver/command/result/event, JS peer and public exports, shared event registration, snapshot synchronizer, UI bridge/application site, characterization/command tests, persistence contracts, and accepted travel/quest-acceptance patterns.

## Audit Gates

### Repair exactness

- Confirm the repair changed only `player-quest-tracking.ts`, the focused command test, and coordination docs.
- Confirm production changes are exactly removal of the event payload `title` member and construction expression.
- Confirm the accepted event payload contains exactly `commandId`, `playerId`, `questId`, `previousTrackedQuestId`, `nextTrackedQuestId`, and `tracked`.
- Confirm no presentation prose or snapshot internals remain in the event.
- Confirm `PlayerQuestTrackingFacts.title` and `noticeFacts.questTitle` remain available only for result/adapter presentation.

### Authority and behavior

- Reconfirm the engine resolver is authoritative for tracking lookup/eligibility and UI `canTrack` projection.
- Reconfirm the tracking UI bridge contains no direct mutation and `QuestsPanel.tsx` applies returned snapshots only when accepted while displaying all notices.
- Re-run exact complete track/untrack snapshot and notice hashes and confirm toggle semantics, synchronization result, input immutability, and completed/failed/missing rejection parity.
- Classify every remaining production `trackedQuestId` assignment; existing acceptance, turn-in fallback, and synchronization cleanup owners are allowed and must not be changed.

### Identity, atomicity, persistence, and browser safety

- Reconfirm command shape, deterministic sequence, tick/version/full-revision freshness, repeatability, and collision-safe same-tick identity.
- Reconfirm malformed, wrong-player, stale, incoherent, missing, completed, failed, and injected-failure rejection preserves original snapshot identity/content and emits zero events.
- Reconfirm accepted clone identity, exactly one typed event, notification/Chronicle non-mutation, current-data serialization roundtrip, and absence of persisted command correlation.
- Reconfirm browser-safe imports, intentional TS/JS peer alignment, public exports, and unchanged shared event registration.

### Scope and hygiene

- Confirm no unrelated quest lifecycle, activity, rest, reward, UI-layout, Home/shell, linked-record/search, combat-presentation, tactics, content, schema, save, dependency, generated/vendor, or compatibility work entered the repair.
- Confirm no conflict markers, temporary artifacts, trailing whitespace, or unrelated edits.
- Run `git show --check`, `git diff --check`, and inspect the complete changed-path set.

## Required Tests

Run:

`node --test tests/unit/player-quest-tracking-command.test.mjs tests/unit/player-quest-tracking-characterization.test.mjs tests/unit/player-quest-acceptance-command.test.mjs tests/unit/player-quest-acceptance-characterization.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Do not run the full suite, DB build, UI build, package installation, servers, or generated-output refresh. Run typecheck only if it materially clarifies a direct touched-boundary diagnostic.

## Decision Rule

- If every gate passes, accept the repaired `0.6.2` transition, compare activity selection, activity advancement, rest, and quest turn-in from current source evidence, and select exactly one `Version 0.6.3 - ...` bounded consumer. Write its implementation prompt but do not implement it.
- If any material defect remains, select `Version 0.6.2.4 - Engine-Owned Quest Tracking Repair`, define only the smallest coherent repair, and do not select another consumer.
- Do not implement a repair or next consumer during this read-only audit.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and overwrite this file with the exact accepted next implementation or smallest repair prompt. Record source/run/date, starting status, files inspected, checks, gate evidence, acceptance decision, consumer comparison if allowed, risks, next version, and suggested commit.

Suggested commit message:

`docs(audit): accept repaired quest tracking transition`
