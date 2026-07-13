# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.3 - Engine-Owned Activity Selection Command`

## Accepted State

- Player travel, quest acceptance, and repaired quest tracking are engine-owned and have passed their post-transition audits.
- `setCurrentActivityFromRecord(...)` in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` is the selected next consumer.
- Current selection behavior is one activity-record lookup, replacement of `sessionState.currentActivity`, one capped notification, existing snapshot synchronization, and one notice. Missing record rejects with the original snapshot.
- Activity advancement/preview, rest/preview, quest turn-in, and every other `currentActivity` writer remain separate.
- The read-only selection fixture `job.harbor_surveyor` currently produces complete snapshot SHA-256 `1f2f5178d3ac4d9c592184f714bdec5c71f421012608b6850d548ed300e5fc40` and notice SHA-256 `ca04212b7f64e83b8462653ab090144b4710a6e98b7ae64aa68f6846b04415ee`.
- Missing fixture `activity.missing` preserves original snapshot identity/content and produces notice SHA-256 `31bafd513a34fce0bceb4c7c3b779e89da098cdb1b18b1e669b078ae4d13ed77`.
- No Deep Research or user decision is required.

## Purpose

Move only activity selection behind one browser-safe engine resolver, deterministic transient command, atomic synchronized result, and typed accepted event while preserving exact current behavior.

Do not broaden this run into generic activity ownership, advancement, preview, rest, turn-in, notification infrastructure, command infrastructure, or event dispatch.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, README, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, runtime-readiness and travel-clarification sources, and backlog.
3. Inspect `setCurrentActivityFromRecord(...)`, `ActivityPanel.tsx`, `PanelRecordState`/`CurrentActivityState`, demo activity records, notification helpers/caps/time labels, snapshot synchronization, persistence, shared events, accepted travel/quest command patterns, every `currentActivity` writer, and focused tests.
4. Before changing ownership, add characterization coverage locking the complete success and missing-record snapshots/notices, including the hashes above.

## Required Boundary

### Resolver

Create one pure engine-owned resolver for lookup in `snapshot.sessionState.activityRecords` and current selection facts. Return stable plan codes and presentation-safe facts for record id, label, derived category, detail, previous activity id, and selected activity id.

Preserve category derivation exactly from the final `sectionId` segment with underscore/hyphen title-casing and `Unknown` fallback. Do not extract or refactor unrelated UI helpers.

### Command and identity

Create one narrow `player.activity.select` transient command with player id, activity record id, deterministic sequence, expected tick, snapshot version, full snapshot revision, and collision-safe deterministic command id. Follow the accepted travel/quest identity pattern and persist no command correlation.

### Atomic execution

Validate command shape/identity, player, coherent tick state, tick/version/revision freshness, and current resolver eligibility before mutation. On success:

1. clone the snapshot;
2. replace only `sessionState.currentActivity` with the resolved id/label/category/detail;
3. append the exact existing `Current activity set` notification, preserving id, detail, time label, tone, newest-first order, and cap of eight;
4. synchronize through `synchronizeGameplaySnapshot(...)`;
5. construct the accepted result and event.

Missing, malformed, wrong-player, stale, incoherent, or unexpected failure must return the original snapshot identity/content and emit zero events. Setting the already-selected record must preserve current successful behavior, including another notification.

### Event and result

Register and emit exactly one typed `player.activity.selected` event after success. Its payload must contain identifiers/state only: command id, player id, record id, previous activity id, and selected activity id. Do not include label, category, detail, notification text, notice text, or snapshot internals. Add an exact payload-key/no-prose regression assertion.

Return stable accepted/rejected codes, applied tick, presentation-safe result/notice facts, emitted events, and the accepted next snapshot or original rejected snapshot.

### UI adapter

Keep `gameplayLoop.ts` as a narrow command/notice bridge and preserve exact notice tone/title/detail:

- success: `accent`, `Current Activity Updated`, `<record title> is now set as the active process.`
- missing: `warning`, `Activity Missing`, `That activity record is not available in the current session.`

Use narrow stable fallback notices for stale/general command rejection without changing existing reachable behavior. Remove direct selection mutation/notification creation from the UI-owned path. In `ActivityPanel.tsx`, apply the returned snapshot only when accepted and always display the notice.

## Required Tests

Cover at minimum:

- pre/post-extraction complete success and missing snapshot/notice parity using the accepted hashes;
- exact selected `currentActivity` id/label/category/detail;
- exact notification id/title/detail/time/tone, newest-first order, cap behavior, and Chronicle non-mutation;
- already-selected record still accepted with another notification;
- input immutability and new accepted snapshot identity;
- missing, malformed, wrong-player, stale tick/version/revision, incoherent, and injected-failure rejection;
- original identity/content and zero events on every rejection;
- deterministic repeated fixtures and collision-safe distinct same-tick record selections;
- exactly one typed success event with the exact five-key identifier/state payload and no presentation prose;
- current-data serialization roundtrip with transient command correlation absent;
- browser-safe import graph and intentional TS/JS peer alignment;
- no direct activity-selection mutation or notification append in the UI bridge;
- accepted-only `ActivityPanel` snapshot application and notice display.

Run the new selection command/characterization tests plus quest tracking, quest acceptance, player travel, gameplay-loop skill-gating, save/load roundtrip, and deterministic scenario tests. Run typecheck only if it materially clarifies a touched-boundary diagnostic. Do not run the full suite, DB/UI build, package installation, servers, or generated-output refresh.

## Explicit Non-Goals

Do not change activity advancement or preview, rest or preview, quest turn-in, travel, quest acceptance/tracking, other `currentActivity` writers, clock/body/resources, skills, discoveries, flags, operations, rewards, inventory, reputation, standing, notification/Chronicle product behavior, activity records/content, schemas, save fields/versions, migrations, compatibility, generic notification helpers, command bus, replay/idempotency, event dispatch, UI layout, Home/shell, linked records/search, combat presentation, tactics, dependencies, or generated output.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and write the exact `Version 0.6.3.1 - Engine-Owned Activity Selection Post-Transition Audit` prompt. Record source/run/date, starting status, exact files changed, checks, parity, identity, atomicity, notification/event/persistence/browser/UI confirmation, risks, next version, and suggested commit.

Suggested commit message:

`feat(runtime): move activity selection into engine ownership`
