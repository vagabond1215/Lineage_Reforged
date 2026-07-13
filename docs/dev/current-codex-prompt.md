# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.2 - Engine-Owned Quest Tracking Command`

## Accepted State

- Player travel and quest acceptance are engine-owned and have passed their post-transition audits.
- `toggleTrackedQuest(...)` in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` is the selected next consumer.
- Current tracking behavior is one persisted toggle of `sessionState.trackedQuestId` followed by existing snapshot synchronization and notice projection.
- Missing quests and completed or failed quests reject without mutation.
- Quest acceptance, quest turn-in, activity selection/advancement, rest, and rewards remain separate.
- No user decision or Deep Research is required.

## Purpose

Move only quest tracking behind one engine-owned resolver, deterministic transient command, atomic result, and typed accepted event while preserving exact current behavior.

Do not broaden this run into generic quest lifecycle ownership, command infrastructure, event dispatch, or another gameplay consumer.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, `README.md`, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, runtime-ownership readiness, player-travel clarification, and backlog.
3. Inspect the current tracking function, `makeQuestState(...)`, `QuestsPanel.tsx`, snapshot synchronization, quest-acceptance and travel command patterns, shared event types, persistence contracts, and focused tests.
4. Add a pre-extraction characterization test locking the complete tracked and untracked snapshots plus current notices before changing ownership.

## Required Boundary

### Resolver

Create one engine-owned resolver for quest lookup and tracking eligibility. It must return stable plan codes and presentation-safe facts. Preserve current missing, completed, and failed rejection semantics and allow the same currently trackable categories.

### Command and identity

Create one narrow `player.quest.track` or equivalently precise transient command with player id, quest id, deterministic sequence, expected tick, snapshot version, full revision, and collision-safe command id. Follow the accepted travel/acceptance identity pattern; do not persist command correlation.

### Atomic execution

Validate command shape, identity, player, coherent tick state, tick/version/revision freshness, and current resolver eligibility before mutation. Clone, toggle only `sessionState.trackedQuestId`, synchronize through the engine-owned snapshot synchronizer, then construct the result/event. Rejection or unexpected failure must return the original snapshot identity/content and emit zero events.

### Event and result

Emit exactly one typed tracking-changed event after success. Include command/player/quest identifiers and the resulting tracked state, but no snapshot internals or presentation prose. Return stable accepted/rejected codes, applied tick, presentation-safe facts, emitted events, and the accepted next snapshot or original rejected snapshot.

### UI adapter

Keep `gameplayLoop.ts` as a narrow command/notice bridge and `QuestsPanel.tsx` as presentation. Apply the result snapshot only on accepted tracking changes and preserve current notice tone/title/detail exactly. Remove direct tracking mutation from the UI-owned path.

## Required Tests

Cover at minimum:

- pre/post-extraction complete snapshot and notice parity for track and untrack;
- accepted toggle-on and toggle-off behavior;
- input immutability and new accepted snapshot identity;
- missing, completed, failed, malformed, wrong-player, stale, incoherent, and injected-failure rejection;
- original identity/content and zero events on every rejection;
- deterministic repeated fixtures and collision-safe same-tick identities;
- exactly one typed success event with the resulting tracked state;
- notification/Chronicle non-mutation;
- current-data serialization roundtrip with transient correlation absent;
- browser-safe import graph and intentional TS/JS peer alignment;
- no direct tracking mutation in the UI bridge;
- accepted-only UI application.

Run the new focused tests plus quest acceptance, player travel, gameplay-loop skill-gating, save/load roundtrip, and deterministic scenario tests. Run typecheck only if it materially clarifies a touched-boundary diagnostic. Do not run the full suite, DB build, UI build, package installation, servers, or generated-output refresh.

## Explicit Non-Goals

Do not change quest acceptance, turn-in, objectives, activity selection/advancement, rest, rewards, inventory, reputation, standing, progression, notifications, Chronicle, quest content, schemas, save fields/versions, migrations, compatibility behavior, command bus, replay ledger, event dispatch, UI layout, generated output, or dependencies.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and write the exact next audit or smallest repair prompt. Record source/run/date, starting status, files changed, checks, parity, identity, atomicity, event, persistence/browser/UI confirmation, risks, next version, and suggested commit.

Suggested commit message:

`feat(runtime): move quest tracking into engine ownership`
