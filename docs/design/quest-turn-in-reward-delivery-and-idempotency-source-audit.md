# Quest Turn-In Reward Delivery And Idempotency Source Audit

Date: 2026-08-03

Source route: ChatGPT via GitHub Connector

Original branch baseline: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Inspected live master: `91bd8c2c89c85fb9ea7257b2c96b68ab41231b04`

Branch: `parallel/quest-turn-in-reward-source-audit`

Status: `REFRESHED_CONNECTOR_EVIDENCE_CANDIDATE_INTEGRATION`

Execution posture: connector-only, read-only source audit; no quest, reward, engine, UI, save, content, schema, test, roadmap, or active-route change

## Purpose

Refresh the quest turn-in and reward-delivery source map after quest acceptance, tracking, campaign-session mutation admission, and save publication changed.

This document records current behavior and missing authority only. It does not authorize a quest command or reward implementation.

## Material Post-Baseline Changes

Quest acceptance and quest tracking now use dedicated engine-owned commands and results:

- `createPlayerQuestAcceptanceCommand(...)` / `executePlayerQuestAcceptanceCommand(...)`;
- `createPlayerQuestTrackingCommand(...)` / `executePlayerQuestTrackingCommand(...)`;
- accepted UI application with `ownerKind: engine_result`, command identity, and result identity.

Quest turn-in did not receive the same transition.

## Current Turn-In Owner

The live turn-in path remains in:

- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- `apps/rpg-ui/src/features/QuestsPanel.tsx`.

`turnInQuest(snapshot, questId)`:

1. checks quest existence and active posture;
2. evaluates hard-coded readiness;
3. clones the snapshot;
4. marks the quest completed;
5. applies quest-specific rewards and side effects directly;
6. synchronizes the snapshot;
7. returns only a snapshot and notice.

`QuestsPanel` then calls `updateSnapshot(result.snapshot)` without `engine_result`, command identity, or result identity. The generic session gateway therefore treats the turn-in as a default `legacy_bridge` proposal.

Result:

`TURN_IN_REMAINS_UI_GAMEPLAY_LOOP_OWNED_AND_GENERICALLY_ADMISSION_GATED`

## Supported Turn-Ins

Exactly two quest IDs have hard-coded readiness and reward behavior:

- `quest.ashen_reef_survey`;
- `quest.rivet_shortfall_relief`.

Ashen Reef readiness requires the active quest, three survey sectors, ruins confirmation, and Saltmere location.

Rivet readiness requires the active quest, secured cargo, and Saltmere location.

All other quest IDs are not ready for turn-in.

## Reward Mutation Surface

The current helper directly mutates combinations of:

- quest category and status;
- currency;
- skills;
- standing;
- reputation;
- inventory quantity;
- operations;
- current activity;
- flags;
- tracked quest selection;
- notifications;
- Chronicle entries;
- synchronized derived snapshot state.

These effects have multiple domain owners, but no turn-in plan, occurrence, accepted result, reward receipt, or owner-specific consequence receipt binds them together.

## Idempotency And Replay Boundary

Current protection is limited:

- a completed quest is no longer active, so a later call returns the original snapshot with a warning;
- the session admission gateway will normally reject an unchanged snapshot proposal;
- current quest facts prevent the two hard-coded turn-ins from ordinarily applying twice in one live state.

Missing durable authority includes:

- command/request identity;
- exact equivalent retry fingerprint;
- retained accepted result;
- conflicting request-ID reuse detection;
- reward-delivery receipt;
- restart duplicate lookup;
- correction/supersession posture;
- owner-specific applied versus projection-pending state;
- response replay after later unrelated mutations.

Therefore category change is a practical guard, not a complete idempotency contract.

## Accepted-Only UI Boundary

Acceptance and tracking already apply only accepted engine results.

Turn-in differs:

- the helper returns no explicit `accepted` field;
- `QuestsPanel` calls `updateSnapshot(...)` unconditionally after invoking the helper;
- it switches the visible section to `completed` even when the helper returned an unchanged snapshot and warning.

The campaign gateway prevents an unchanged snapshot from becoming an accepted mutation, but panel transition semantics remain coupled to button readiness and helper assumptions rather than a typed accepted result.

## Current Classification

| Boundary | Classification |
| --- | --- |
| Quest acceptance | `ENGINE_OWNED_COMMAND` |
| Quest tracking | `ENGINE_OWNED_COMMAND` |
| Turn-in readiness | `UI_GAMEPLAY_LOOP_STATIC_RULES` |
| Turn-in mutation | `UI_GAMEPLAY_LOOP_LEGACY_BRIDGE` |
| Generic campaign admission | `PRESENT` |
| Turn-in result identity | `ABSENT` |
| Durable reward receipt | `ABSENT` |
| Restart/equivalent-retry replay | `ABSENT` |
| Correction/supersession | `ABSENT` |
| Accepted-only panel transition | `INCOMPLETE` |

## Smallest Safe Future Decision

A dedicated quest turn-in owner decision must fix:

1. normalized command identity and source revision;
2. readiness and stale-state rules;
3. deterministic reward plan;
4. quest completion occurrence/result identity;
5. atomic multi-owner consequence application;
6. inventory, currency, skill, reputation, standing, operation, activity, Chronicle, and notification receipts;
7. equivalent retry, conflict, restart, later-state replay, and correction behavior;
8. campaign mutation and verified publication integration;
9. accepted-only UI transition;
10. exact scope for the two current quests without inventing a generic quest-action framework.

Do not combine Ashen Reef survey advancement implementation into this audit or infer that generic campaign persistence already supplies quest-domain receipts.

## Named Consumer And Review Trigger

This audit must be read by:

- a quest turn-in and reward-delivery owner-contract decision;
- an Ashen Reef quest completion/turn-in package;
- a representative-loop audit that claims quest rewards are engine-owned and replay-safe;
- a cleanup proposing removal of quest `legacy_bridge` paths;
- a `0.7.0` readiness review using quest completion as evidence.

The consuming run must cite this branch head or an integrated successor and re-inspect `gameplayLoop.ts`, `QuestsPanel.tsx`, campaign-session admission, save publication, and current tests from its own head.

## Branch Disposition

`CANDIDATE_INTEGRATION`

Integration condition:

- compare against current quest and persistence authority;
- confirm no later turn-in implementation supersedes it;
- integrate or re-author during the named owner decision or a dedicated parallel-document coordinator pass.

Retirement condition:

- all findings are integrated or superseded by accepted quest authority;
- named consumers can reach equivalent evidence on master;
- exact branch head and preservation are verified.

No local tests, builds, typechecks, runtime probes, save/restart execution, or UI interaction were run in this connector-only refresh.
