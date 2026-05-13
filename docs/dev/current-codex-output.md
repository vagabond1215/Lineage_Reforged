# Current Codex Output

Source version/run: v0.5.19 - Combat Feedback Display Seam Audit
Date: 2026-05-13
Branch/status assumption: `master`; worktree was clean before the audit/output update.

## Result

Audited the combat feedback and skill-gain message seam. The engine already emits transient combat skill-gain text through combat tick deltas, and the RPG UI already has a pure presenter that maps those delta messages into notification-shaped items without mutating persistent state.

The smallest safe implementation path is notification-first: consume combat tick deltas at the app/UI boundary, convert only `skillGainMessages` through the existing presenter, and surface them through the top-bar notification channel or an equivalent ephemeral UI queue. Do not write these messages to Chronicle, combat history, account state, skill rules, or progression logic in the first display pass.

## Files Changed

- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: clean before audit/output update
- Inspected `packages/engines/game-engine/src/combat/index.ts`
- Inspected `packages/engines/game-engine/src/index.ts`
- Inspected `packages/shared/types/src/contracts.ts`
- Inspected `apps/rpg-ui/src/runtime/combatDeltaPresentation.ts`
- Inspected `apps/rpg-ui/src/runtime/GameSessionContext.tsx`
- Inspected `apps/rpg-ui/src/runtime/uiViewModel.ts`
- Inspected `apps/rpg-ui/src/game-shell/InGameShell.tsx`
- Inspected `apps/rpg-ui/src/game-shell/gameplayLoop.ts`
- Inspected `apps/rpg-ui/src/features/ActivityPanel.tsx`
- Inspected focused tests under `tests/unit/*combat*.mjs`, `tests/unit/*skill*.mjs`, and `tests/unit/*presentation*.mjs`
- Inspected relevant backlog notes in `docs/future_content_backlog.md`
- `npm.cmd run tool:content-lint`: passed
- `node --test tests\unit\*combat*.mjs tests\unit\*skill*.mjs tests\unit\*presentation*.mjs`: passed
- `git diff --check`: passed

## Behavior / Runtime Confirmation

Audit/output-only. No combat math, skill gain rules, progression caps/gates, weapon behavior, stagger behavior, combat actions, UI runtime, save/account schema, content JSON, package files, tests, README, CHANGELOG, or backlog changed.

## Audit Findings

- Combat skill gains are applied in `applyCombatSkillGainsForResolvedActions()` after `resolveFinishedActions()` and before the combat delta is emitted.
- `tickCombatFoundation()` emits `GameDelta` records with `kind: "combat"` and optional `payload.skillGainMessages` when resolved player-owned weapon actions produce applied or blocked skill-gain feedback.
- Current messages are plain strings such as `Sword +1` or `Sword progress requires a breakthrough`.
- `runGameTick()` preserves combat deltas in its returned `TickResult<GameDelta>`, but the RPG UI currently does not call `runGameTick()` or otherwise consume combat tick deltas.
- `apps/rpg-ui/src/runtime/combatDeltaPresentation.ts` already maps combat delta messages into `CombatSkillGainMessageItem[]`, deduping repeated messages by encounter/message within a batch.
- The presenter uses `success` for applied gains and `warning` for breakthrough-blocked progress.
- Existing presenter tests prove it ignores non-combat deltas, invalid messages, and absent messages, and does not mutate session notifications, Chronicle, combat history, account state, or input deltas.
- The top-bar notification path already displays `UiViewModel.notifications`, sourced from body-state ephemeral notifications plus `sessionState.notifications`.
- Chronicle has a combat section, but current combat Chronicle window details still list encounter links, damage logs, and loot results as missing references.
- `gameState.combatHistory` persists only compact resolved encounter summaries, not per-action feedback.
- Activity panel notices are local to activity commands and are not the right owner for combat tick feedback.

## Display Ownership Recommendation

- First implementation target: top-bar notifications or an equivalent UI-session ephemeral queue.
- Keep the first pass transient and player-facing: show applied skill gains and breakthrough-blocked messages without changing combat state.
- Do not use Chronicle in the first pass; Chronicle should wait for structured encounter report ownership, stable event ids, and durable replay semantics.
- Do not use Activity records; combat feedback is not activity/work-loop output.
- Do not use Character skill panel as the primary surface; the character panel should show current skill state, not transient tick messages.
- Encounter summaries can later aggregate structured combat results, but they should not be introduced as part of the first skill-message display slice.

## Smallest Safe Future Implementation Scope

Recommended next run: `Version 0.5.20 - Combat Skill-Gain Notification Consumer Implementation`.

Scope:
- Use the existing `buildCombatSkillGainMessageItems()` presenter.
- Add a small UI/app-layer consumer for `TickResult<GameDelta>` or `GameDelta[]` at the future combat tick boundary.
- Convert only `skillGainMessages` into notification items.
- Prefer ephemeral UI notification state if the call site can support it; otherwise append to existing `sessionState.notifications` with the same cap/dedupe rules already used by gameplay notifications.
- Do not write to `sessionState.chronicle`, `gameState.combatHistory`, account profile, combat history details, player skill rules, or progression policy.
- Add tests proving the consumer adds visible notification items and leaves Chronicle, combat history, account state, combat math, and skill ranks untouched except for the engine-owned skill rank mutation already present in the input tick result.

## Tests Needed

- Existing presenter tests should remain.
- Add a focused consumer test with synthetic combat deltas containing both `Sword +1` and breakthrough-blocked messages.
- Assert dedupe across one consumed batch.
- Assert top-bar notification projection includes the combat items.
- Assert no mutation of Chronicle, combat history, account profile, player skill rules, progression policy, or combat delta payloads.
- If the implementation appends to `sessionState.notifications`, assert cap ordering and stable ids.

## Stale Docs / Backlog Notes

- `docs/future_content_backlog.md` already says the app-side display remains deferred until a real combat tick consumer seam exists. During the future implementation run, update that note to say the notification consumer has started or completed, while structured Chronicle/encounter report ownership remains deferred.

## Risks / Follow-Up

- There is no current RPG UI call site that consumes `runGameTick()` results, so a display implementation must either add a narrow combat tick consumer seam or wait for one.
- Writing combat skill messages into Chronicle too early would make transient training feedback durable without stable event/report semantics.
- Appending messages into `sessionState.notifications` is schema-safe but may persist short-lived feedback in saves; ephemeral UI state is cleaner if the implementation has a concrete in-memory consumer.
- Do not broaden the next run into combat math, weapon/stagger behavior, progression caps, new combat actions, runtime magic, Legacy rewards, or save schema.

## Next Recommended Version

Version 0.5.20 - Combat Skill-Gain Notification Consumer Implementation

## Suggested Commit Message

docs(combat): audit combat feedback display seam
