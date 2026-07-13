# Runtime Ownership Transition Readiness Consolidation

Version: `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`

Date: 2026-07-12

Status: approved documentation-only readiness decision; no runtime behavior changed

## 1. Decision

Select **player travel/movement** as the first engine-owned consumer for `v0.6.x`.

The current playable shell already exposes a complete ownership seam: `WorldPanel.tsx` sends a selected location to `apps/rpg-ui/src/game-shell/gameplayLoop.ts`, and that UI-owned module validates the request, advances the clock and body state, mutates player location/resources/geographic knowledge, updates session activity and quest-operation state, and appends notifications and Chronicle records. Shared and engine packages already own the clock, player body and Knowledge helpers, state contracts, event envelope, snapshot serialization, and deterministic test surfaces needed to move that behavior behind one engine command.

The first implementation package must preserve current behavior and current authored locations. It must not add routes, places, encounters, hazards, survival mechanics, static authorities, save fields, or canon.

Next route:

- `Version 0.6.0 - Engine-Owned Player Travel Command`

No user decision or Deep Research is required.

## 2. Exact Current Ownership Map

| Surface | Current owner | Current behavior | Readiness boundary |
| --- | --- | --- | --- |
| App/session lifecycle | `apps/rpg-ui/src/App.tsx`, `game-shell/state.ts` | Owns screen routing, active snapshot, dirty state, save/load invocation, and account handoff. | UI shell remains adapter and persistence coordinator; it must not resolve gameplay commands. |
| UI session projection | `runtime/GameSessionContext.tsx`, `runtime/uiViewModel.ts` | Projects `SaveSnapshot` and exposes `updateSnapshot(...)`. | Presentation only; accepts an engine result but does not author state transitions. |
| Demo/gameplay orchestration | `game-shell/gameplayLoop.ts` | Directly owns travel, quest acceptance/tracking/turn-in, activity advancement, rest, clock advancement, rewards, session records, and notices. | Primary ownership debt. Extract one command at a time, beginning with travel. |
| Travel UI | `features/WorldPanel.tsx` | Selects a known location, calls `travelToKnownLocation(...)`, then applies returned snapshot and notice. | Retain selection and notice rendering; replace resolver import with an engine adapter. |
| Quest UI | `features/QuestsPanel.tsx` | Calls UI-owned quest command helpers. | Later consumer; not part of first travel package except preservation of arrival hooks already executed by travel. |
| Activity UI | `features/ActivityPanel.tsx` | Calls UI-owned activity/rest helpers. | Later consumer; no first-package expansion. |
| Game orchestration | `packages/engines/game-engine/src/index.ts` | Runs world, civilization, player, and combat ticks and aggregates deltas/events. | Natural exported boundary for a game command handler; existing tick order is unchanged. |
| Player runtime | `packages/engines/player-engine/src/index.ts` and focused helpers | Owns player resource/body synchronization, reputation, geographic-knowledge grants, progression, and player tick deltas. | Reuse helpers; travel handler coordinates them without duplicating their rules. |
| World runtime | `packages/engines/world-engine/src/index.ts` | Owns weather/spawn tick output, not player travel. | Supplies world context only when required; no pathfinding or spawn expansion. |
| Civilization runtime | `packages/engines/civilization-engine/src/index.ts` | Owns economy, market, transport, autonomous trade, and generated quest-offer ticks. | Separate from player travel. Caravan/transport state is not the player journey owner. |
| Shared state contracts | `packages/shared/types/src/contracts.ts` | Defines game, player, world, civilization, session, tick result, event, and save-snapshot shapes. | Add only a narrow travel command/result contract if needed; no persisted-field change. |
| Event envelope | `packages/shared/events/src/index.ts` | Defines typed event names and `GameEventEnvelope` construction. | Add a travel completion event only as part of the selected implementation; rejection remains a result, not an emitted world fact. |
| Save snapshot | `packages/engines/game-engine/src/save-snapshot.ts` | Captures game/player/world/civilization/session state. | Persist the already-existing changed fields through the existing snapshot. |
| Serialization | `packages/shared/persistence/src/index.ts` | JSON serialize/deserialize only. | No migration or compatibility policy; prove current-data roundtrip after travel. |
| Browser persistence | `game-shell/saveManager.ts`, `accountProfileManager.ts` | Validates current snapshot version and stores snapshots/account profiles in local storage. | Remains storage owner; must not interpret travel results. |
| Account state | game-engine account helpers plus UI managers | Owns Legacy, achievements, history, estate, payout, and local account persistence. | Travel does not mutate account state in the first package. |
| Deterministic simulation | `tools/scenario-runner`, `tests/simulation/deterministic-scenario.test.mjs` | Proves identical scenario output for the same seed. | Retain; add direct deterministic travel coverage rather than routing travel through the scenario runner. |

## 3. Candidate Selection

Scoring uses `0`-`3`, where `3` is best. For risk, dependency, and cost columns, `3` means low risk/dependency/cost. Every criterion is equally weighted because no repository decision assigns different weights.

| Candidate | Loop | Reuse | Unblocks | Visible | Persist | Deterministic | UI seam | Owner clarity | Low risk | No user input | No research | Low cost | Reversible | Avoids planning loop | Total / 42 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Player travel/movement | 3 | 3 | 3 | 3 | 3 | 2 | 3 | 3 | 2 | 3 | 3 | 2 | 3 | 3 | **39** |
| Quest accept/track | 2 | 3 | 2 | 3 | 3 | 3 | 3 | 2 | 2 | 3 | 3 | 3 | 3 | 2 | 37 |
| Session start/continue | 2 | 3 | 2 | 2 | 3 | 3 | 2 | 2 | 2 | 3 | 3 | 2 | 3 | 2 | 34 |
| Activity advancement/rest | 3 | 3 | 2 | 3 | 3 | 2 | 3 | 2 | 1 | 3 | 3 | 1 | 2 | 2 | 33 |
| Civilization economy tick projection | 2 | 3 | 3 | 2 | 2 | 3 | 1 | 3 | 0 | 3 | 3 | 0 | 2 | 1 | 28 |

### Selection rationale

Travel is the strongest first consumer because it is already player-visible, snapshot-persisted, bounded by one clear UI call, and composed largely from existing deterministic helpers. It exercises the ownership transition across command validation, multi-owner state coordination, events, persistence, and UI adaptation without requiring new canon.

Quest acceptance is simpler but proves less of the engine boundary and remains coupled to UI-authored quest/session records. Session start/continue is persistence-heavy but does not prove an engine-owned gameplay transition. Activity/rest has broader reward, recovery, skill, and quest branching risk. Civilization ticks are already engine-owned and therefore do not expose the UI-to-engine transition this milestone must prove.

Discovery is not a standalone candidate: current discovery mutation is embedded in the authored survey activity. Chronicle projection is also not a first command because it is an output consumer, not the initiating gameplay transition.

## 4. Selected Command Boundary

### Input

The UI supplies intention only:

- command kind: player travel;
- current player/character id from the active snapshot;
- destination location id selected from the current known-location projection;
- expected snapshot tick (or equivalent revision guard);
- current `SaveSnapshot` or an engine context constructed from it.

The UI must not supply travel duration, costs, destination region/settlement, rewards, activity text, Knowledge grants, Chronicle effects, or quest-operation mutations.

### Validation

The engine-owned handler validates:

- command kind and required identifiers;
- player id matches the snapshot owner;
- expected tick/revision matches current state;
- destination exists in the current implemented travel rules;
- destination is known in `sessionState.knownLocations`;
- destination is not already current;
- required state owners are present and internally coherent.

No pathfinding, general route planning, route-security, hazard, weather, encounter, provision, vehicle, party, or economy check is added.

### State transition

On acceptance, one atomic handler preserves the current behavior now in `travelToKnownLocation(...)`:

- advance the existing clock by the current destination rule;
- reuse existing player body/resource/stat-growth synchronization;
- apply current HP/MP/stamina travel costs;
- update player region and location;
- grant the current settlement-level geographic Knowledge through the existing player-engine helper;
- update current activity and known-location state;
- preserve the two existing quest-specific arrival operation/activity hooks;
- append the current notification and Chronicle projection through an engine/session-owned helper, not UI-authored mutation;
- return the next snapshot only after all owner checks succeed.

The implementation may relocate current rule data from the UI-owned module to an engine-owned module. It must not change values, labels, ids, costs, timing, quest behavior, or authored text in that move.

### Output

Return a discriminated result with:

- accepted or rejected status;
- stable result/rejection code;
- command id or deterministic correlation id;
- applied tick;
- previous and destination location ids for accepted results;
- elapsed ticks and applied resource/body summary for accepted results;
- next snapshot for accepted results, or the original snapshot identity for rejected results;
- emitted events;
- presentation-safe facts from which the UI adapter builds `GameShellNotice`.

The engine result must not depend on React or `GameShellNotice`.

### Event boundary

Emit exactly one travel-completed event after a successful atomic transition. Its payload should contain identifiers and resolved facts, not presentation prose or a duplicate snapshot. Rejections return stable result codes and emit no completion event.

Current Chronicle and notification records remain persisted session projections of the accepted result. They must be produced from the resolved result by an engine/session owner in the same package so the UI cannot fabricate history.

### Persistence

- No new persisted fields are required.
- Command and result envelopes are transient.
- The accepted next snapshot uses existing game/player/world/civilization/session owners.
- Existing serialization and browser save ownership remain unchanged.
- A focused roundtrip test must serialize and deserialize a post-travel snapshot and prove the changed clock, player location/resources/Knowledge, and session activity/Chronicle state survive.
- No old-save compatibility, migration alias, or snapshot-version rescue is authorized.

### UI adapter

`WorldPanel.tsx` remains responsible for destination selection, disabled state, confirmation if any already exists, and notice rendering. A narrow adapter invokes the exported engine command and:

- applies `result.nextSnapshot` only when accepted;
- derives the existing notice tone/title/detail from stable result facts/codes;
- leaves the current snapshot untouched on rejection;
- does not duplicate validation or mutation rules.

No broad shell rewrite is allowed.

### Failure behavior

At minimum, reject with no mutation for malformed command, wrong player, stale tick/revision, unknown destination, not-known destination, already-current destination, or incoherent required state. Unexpected internal exceptions must not expose a partially mutated snapshot.

### Reversibility and rollback

Implement the handler as clone/resolve/commit or an equivalent pure transition. The original snapshot remains the rollback unit. Rejection returns the original state unchanged. The UI migration is reversible by one adapter boundary during development, but acceptance requires removing direct travel mutation from the UI-owned path so dual authority cannot remain.

### Stop conditions

Stop the implementation rather than broaden it if:

- preserving current travel behavior requires new canon or route content;
- a persisted-field or snapshot-version change becomes necessary;
- quest arrival hooks cannot be preserved without redesigning quest ownership;
- Chronicle/notification projection cannot be moved without a second independent product decision;
- focused compiler/test failures require broad UI/workspace or full-suite cleanup;
- the patch expands into pathfinding, encounters, survival, economy transport, map reveal, or a shell rewrite.

## 5. Direct Validation Blockers And Excluded Debt

### Directly relevant

- There is no focused travel-command test today. `gameplay-loop-skill-gating.test.mjs` covers adjacent activity and quest behavior, not travel. The `0.6.0` package must add direct accepted/rejected/deterministic/no-partial-mutation travel tests.
- The save roundtrip test is a static JSON roundtrip and does not create a post-command snapshot. Extend focused coverage for the selected result without changing save policy.
- UI and workspace typechecks are accepted non-green audits. Because the package will touch UI-imported engine/shared TypeScript, capture the relevant baseline and treat only new or changed errors in touched modules as direct blockers.

### Explicitly excluded

The fourteen remaining accepted full-suite failures do not directly block player travel based on current ownership:

- Backstory Legacy draft assertions;
- settlement simulation assertion;
- four civilization transport/runtime assertions (caravans are not player travel);
- route-security registration assertion (descriptive static authority, not the current player travel command);
- two region-first world assertions;
- two Renown projection assertions;
- flora and mineral BOM parsing failures.

Broad unrelated optional-property, Node type, JSON import, JSX context, library-target, and module-mode typecheck debt remains excluded unless the exact touched travel modules reproduce a changed error.

## 6. Minimum `v0.6.0` Entry Conditions

All are satisfied or decision-complete by this document:

1. one named first consumer: player travel/movement;
2. explicit command, owner, state, result, event, persistence, UI, validation, and failure boundaries;
3. no user or research dependency;
4. no new canon, schema/content authority, or save field required;
5. existing current-data snapshot ownership and serialization available;
6. focused tests identified, with adjacent gameplay, roundtrip, and deterministic scenario baselines green on 2026-07-12;
7. direct blockers separated from unrelated full-suite/typecheck debt;
8. stop and rollback conditions fixed.

## 7. Milestone-Sized `v0.6.x` Package Sequence

### Package 1: engine-owned player travel (`Version 0.6.0`)

Land one coherent reviewable package containing the command/result contract, engine handler, event, atomic state transition, existing-rule relocation if required, focused deterministic and roundtrip tests, and narrow `WorldPanel` adapter migration. Preserve all current travel behavior.

Keep a separate high-risk gate inside review for snapshot mutation and persistence acceptance; do not split deterministic contract/export/test wiring into artificial primary versions.

### Package 2: travel acceptance/stabilization, only if needed

Use a support suffix for a narrow repair, baseline comparison, or post-implementation audit. Do not reserve a primary version now. Promote a follow-up to primary only if `0.6.0` reveals a material owner or dependency change.

### Package 3: next engine-owned consumer

After travel acceptance, select from the already evidenced UI-owned quest or activity seams based on the dependency unlocked by actual travel results. Do not reopen static authority selection. A later primary package should integrate one coherent consumer, not repeat this readiness audit.

## 8. Dependency Graph

```text
0.5.356 tool boundary repair
  -> 0.5.357 runtime readiness decision (this document)
    -> 0.6.0 engine-owned player travel command
       [command + atomic state + event/result + roundtrip + WorldPanel adapter]
      -> focused acceptance / suffix repair only if evidence requires
      -> later 0.6.x engine-owned quest or activity consumer
        -> v0.7.x bounded integrated player loop
           [travel + selected quest/activity + persistent consequence]
          -> v0.8.x vertical-slice hardening
             [stable save/load + failure UI + minimum content + balance + regressions]
```

No dozens of micro-versions are reserved. `v0.7.x` must connect stable owners through shared contracts. `v0.8.x` must harden one narrow playable path and state explicit exclusions.

## 9. Source-Of-Truth Reconciliation

| Concern | Authority after this run |
| --- | --- |
| Repository rules and maturity bands | `AGENTS.md` |
| Exact latest Codex result | `docs/dev/current-codex-output.md` |
| Immediate route and guardrails | `docs/dev/current-gpt-handoff.md`, `docs/dev/current-codex-prompt.md` |
| Near-term queue | compact current override in `docs/dev/codex-sequenced-implementation-plan.md` |
| Long-term roadmap | compact current override in `docs/dev/project-roadmap.md` |
| Runtime transition decision | this document |
| Pipeline simplification | `docs/design/streamlined-pipeline-roadmap-decision.md` |
| Durable design criteria | `docs/design/future-system-design-ledger.md` |
| Validation routing | validation source map and command matrix |
| Deferred work/reopening triggers | `docs/future_content_backlog.md` and lane-specific decisions |
| Research provenance | temporary Deep Research intake until its retirement trigger |

Historical route chronology remains historical and is not rewritten. Any older pointer naming `0.5.357 - Tool Surface Test Post-Repair Audit` is superseded for current execution. That audit remains an optional `0.5.356.1` support route only if contradictory focused evidence appears.

## 10. Temporary Artifact And Planning Pointer Disposition

`docs/dev/tmp-deep-research-streamlined-pipeline-review-2026-07-12.md` is consumed but retained temporarily. Its useful milestone, named-consumer, support-suffix, validation, and research rules are now durable in the streamlined pipeline decision and this readiness decision. Its rejected speculative examples remain useful provenance through the first implementation.

Retirement trigger: after `Version 0.6.0` is accepted, confirm that no unique useful or rejected-assumption context remains outside durable decisions, then delete the temporary intake in that implementation run or a narrow support cleanup. It must not be used as runtime or canon authority.

The primary post-repair audit pointer is superseded. Repeated unchanged-source authority audits and generic roadmap-selection passes are not current queue items. Zero-id lanes retain their existing reopening gates.

## 11. Checks Supporting This Decision

- repository and required coordination/design/source inspection;
- focused `gameplay-loop-skill-gating` tests: 5 passed;
- save snapshot roundtrip tests: 2 passed;
- deterministic scenario test: 1 passed;
- no full suite, DB build, UI build, broad typecheck, package installation, server, or generated-output refresh.

## 12. Next Recommended Version

`Version 0.6.0 - Engine-Owned Player Travel Command`
