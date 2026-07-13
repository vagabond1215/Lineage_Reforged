# Current GPT Handoff

Source version/run: Version 0.5.357.1 - Player Travel Boundary Clarification
Date: 2026-07-13

## Status

Latest completed primary:

- `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`

Latest completed support clarification:

- `Version 0.5.357.1 - Player Travel Boundary Clarification`

Immediate next primary route:

- `Version 0.6.0 - Engine-Owned Player Travel Command`

`docs/dev/current-codex-output.md` remains the exact latest Codex result for `0.5.357`; this connector-side support clarification did not modify it.

## Decision

Player travel/movement remains the first engine-owned consumer. `docs/design/runtime-ownership-transition-readiness-consolidation.md` owns the base command, state, event/result, persistence, UI-adapter, validation, rollback, and stop boundaries.

`docs/design/player-travel-boundary-clarification.md` is the controlling addendum for `0.6.0` where the two documents differ. It adds three required protections:

1. deterministic collision-safe command and completion-event identities, including accepted same-completion-tick coverage;
2. one pure engine-owned travel resolver shared by preview and execution, with no duplicate UI travel-rule catalog;
3. full parity with the current post-travel `syncSnapshot(...)` result, including derived quest, record, Codex, body, progression, and tracked-quest synchronization.

No user decision or Deep Research is required.

## Required `0.6.0` Shape

Land one coherent implementation package containing:

- a narrow transient travel command and result contract;
- a deterministic command factory/correlation identity;
- one engine-owned travel-plan resolver used by preview and execution;
- atomic engine-owned execution with stable rejection codes;
- one collision-safe completion event per accepted command;
- current notification and Chronicle projections derived from accepted engine facts;
- complete current-result characterization and parity coverage;
- deterministic, rejection, no-partial-mutation, same-tick identity, event, export, and post-travel roundtrip tests;
- a narrow `WorldPanel` adapter migration;
- removal of direct UI travel mutation and duplicate UI travel rules.

Preserve all current destinations, values, ids, text, costs, timing, body/resource behavior, Knowledge, arrival hooks, record projections, and persistence behavior.

## Guardrails

- No new canon, route/place content, schema authority, save field, migration, compatibility behavior, pathfinding, encounter, survival, caravan/economy transport, map reveal, account behavior, or broad shell rewrite.
- UI sends player, destination, expected tick/revision, and state/context intention only. It must not author timing, costs, validation, state mutation, Chronicle facts, or travel-rule identity.
- Preview is read-only and must not be trusted as execution authorization; execution revalidates current state.
- Rejection preserves original snapshot identity/content and emits no event or session projection.
- Do not solve the travel event requirement through an unrelated repository-wide event redesign.
- Treat only new or changed failures in touched travel modules and exact focused tests as blockers. The accepted unrelated full-suite and broad typecheck debt remains excluded.
- Stop if current parity requires new canon, a persistence-contract change, quest/Chronicle redesign, or broad cleanup.

## Coordination

The active prompt is `docs/dev/current-codex-prompt.md`.

Older immediate-route text that omits `0.5.357.1` is superseded for execution by this handoff and the clarification document. Historical chronology remains valid.

The temporary Deep Research intake remains consumed but retained through `0.6.0` acceptance for provenance. The `0.6.0` run must decide whether its retirement trigger has been met.

Suggested next commit:

`feat(runtime): move player travel into engine ownership`
