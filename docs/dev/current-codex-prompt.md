# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.2.2 - Engine-Owned Quest Tracking Repair`

## Accepted State

- `Version 0.6.2 - Engine-Owned Quest Tracking Command` moved quest track/untrack behind one engine resolver, deterministic transient command, atomic synchronized result, and typed accepted event.
- `Version 0.6.2.1 - Engine-Owned Quest Tracking Post-Transition Audit` passed authority, exact behavior parity, identity, atomicity, persistence/browser, UI-adapter, and hygiene gates at 35/35 focused tests.
- The audit did not accept the transition because `PlayerQuestTrackingChangedEventPayload` and `createTrackingChangedEvent(...)` include the quest display `title`, violating the explicit no-presentation-prose event boundary.
- `PlayerQuestTrackingFacts.title` and `noticeFacts.questTitle` are valid presentation-safe result facts used by the UI notice adapter and must remain.
- No Deep Research or user decision is required.

## Purpose

Apply only the smallest coherent event-contract repair: remove the display title from the typed accepted tracking event and add an exact payload-shape regression guard.

Do not broaden this run into resolver, command identity, synchronization, UI, persistence, quest lifecycle, another consumer, or generic event infrastructure work.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, README, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, and backlog.
3. Inspect `player-quest-tracking.ts`, its JS peer/export, the tracking command and characterization tests, shared event registration, the gameplay-loop notice bridge, and `QuestsPanel.tsx`.

## Required Repair

In `packages/engines/game-engine/src/player-quest-tracking.ts`:

- Remove only `title` from `PlayerQuestTrackingChangedEventPayload`.
- Remove only `title: facts.title` from `createTrackingChangedEvent(...)`.
- Preserve event type, domain, id, tick, command/player/quest identifiers, previous/next tracked quest ids, and resulting `tracked` state.
- Preserve `PlayerQuestTrackingFacts.title`, `PlayerQuestTrackingNoticeFacts`, result facts, resolver facts, and all notice behavior.

In `tests/unit/player-quest-tracking-command.test.mjs`:

- Add an exact accepted-event payload-key assertion covering only `commandId`, `playerId`, `questId`, `previousTrackedQuestId`, `nextTrackedQuestId`, and `tracked`.
- Explicitly confirm no `title` member is present.
- Preserve all existing identity, rejection, atomicity, serialization, browser, JS-peer, and UI-adapter coverage.

Do not edit `gameplayLoop.ts`, `QuestsPanel.tsx`, shared event registration, snapshot synchronization, persistence, the JS re-export peer, content, schemas, saves, migrations, dependencies, or generated output unless a direct compile diagnostic proves the exact two-file repair cannot stand alone. If that occurs, stop and report rather than broadening speculatively.

## Required Validation

Run:

`node --test tests/unit/player-quest-tracking-command.test.mjs tests/unit/player-quest-tracking-characterization.test.mjs tests/unit/player-quest-acceptance-command.test.mjs tests/unit/player-quest-acceptance-characterization.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Also verify:

- the exact track/untrack snapshot and notice hashes remain unchanged;
- the accepted event payload contains exactly the six allowed keys and no presentation prose;
- the result and UI notice facts still retain the quest title;
- no runtime/UI/persistence behavior changes beyond the event payload subtraction;
- browser-safe imports and the intentional TS/JS peer remain aligned;
- the complete changed-path set contains only the engine TypeScript module, focused command test, and required coordination docs;
- no conflict markers, temporary artifacts, generated/vendor changes, trailing whitespace, or unrelated edits exist;
- `git diff --check` passes.

Do not run the full suite, DB build, UI build, package installation, servers, or generated-output refresh. Run typecheck only if it materially clarifies a direct touched-file diagnostic.

## Explicit Non-Goals

Do not change resolver eligibility, toggle semantics, command shape/sequence/revision/id, rejection codes, atomic execution, snapshot synchronization, event type/id/delivery, result/notice facts, UI notice wording, accepted-only UI application, quest acceptance, turn-in, objectives, activity, rest, rewards, notifications, Chronicle, save contracts, command bus, replay/idempotency, Home/shell, linked records/search, combat presentation, or tactics.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and write the exact `Version 0.6.2.3 - Engine-Owned Quest Tracking Post-Repair Audit` prompt. Record source/run/date, starting status, exact files changed, checks, payload-shape confirmation, parity, risks, next version, and suggested commit.

Suggested commit message:

`fix(runtime): remove presentation text from quest tracking event`
