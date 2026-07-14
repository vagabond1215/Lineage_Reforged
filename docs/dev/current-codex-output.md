# Current Codex Output

Source version/run: Version 0.6.3 - Engine-Owned Activity Selection Command
Date: 2026-07-13
Branch/status assumption: `master`; starting commit `f3fc9769`; clean worktree after fetch and fast-forward pull; `origin/master` aligned. The remote-only `docs/dev/queued-codex-cleanup-prompt.md` was preserved untouched and did not displace the active runtime sequence.

## Result

Moved only activity-record selection behind an engine-owned resolver, deterministic transient command, atomic synchronized result, and typed accepted event. The gameplay-loop bridge no longer owns record lookup, category derivation, state mutation, or notification append, and `ActivityPanel.tsx` applies returned snapshots only when accepted.

Exact pre-extraction success and missing-record behavior remains locked. The selection tests pass 10/10 and the prescribed focused transition group passes 45/45.

## Files Changed

- `apps/rpg-ui/src/features/ActivityPanel.tsx`
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`
- `packages/engines/game-engine/src/index.ts`
- `packages/engines/game-engine/src/player-activity-selection.ts` (created)
- `packages/engines/game-engine/src/player-activity-selection.js` (created)
- `packages/shared/events/src/index.ts`
- `tests/unit/player-activity-selection-characterization.test.mjs` (created)
- `tests/unit/player-activity-selection-command.test.mjs` (created)
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`

## Checks Run

- Fetch and fast-forward pull: local and remote `master` aligned at starting commit `f3fc9769`.
- Pre-extraction characterization: 1/1 passed; success snapshot hash `1f2f5178d3ac4d9c592184f714bdec5c71f421012608b6850d548ed300e5fc40`, success notice hash `ca04212b7f64e83b8462653ab090144b4710a6e98b7ae64aa68f6846b04415ee`, and missing notice hash `31bafd513a34fce0bceb4c7c3b779e89da098cdb1b18b1e669b078ae4d13ed77`.
- Post-extraction activity-selection command and characterization tests: 10/10 passed with all locked hashes unchanged.
- Prescribed selection, tracking, acceptance, travel, skill-gating, save/load, and deterministic scenario group: 45/45 passed.
- Confirmed exact id/label/category/detail derivation, notification text/time/tone/newest-first order/eight-entry cap, repeated-selection behavior, Chronicle non-mutation, and input immutability.
- Confirmed deterministic collision-safe command identity, expected tick/version/full revision guards, atomic malformed/wrong-player/stale/incoherent/missing/injected-failure rejection, and one exact five-key no-prose event.
- Confirmed current-data roundtrip, no persisted command correlation, browser-safe imports, TS/JS peer, public exports, shared event registration, accepted-only UI application, and no duplicate selection mutation in the bridge.
- Classified all remaining `currentActivity` writers as pre-existing travel, acceptance, advancement, rest, turn-in, or synchronization owners.
- `git diff --check`, conflict-marker search, browser-import search, and changed-path review passed. Informational LF-to-CRLF conversion warnings were emitted by Git.
- Full suite, DB/UI build, typecheck, dependency installation, servers, and generated-output refresh were intentionally omitted.

## Behavior / Runtime Confirmation

Activity-record selection ownership changed from the UI gameplay loop to the game engine. Accepted selection still changes only `currentActivity`, appends the exact existing capped notification, and applies existing synchronization before return. Missing and stale/error paths preserve original snapshot identity/content and emit no event.

The accepted event is transient and contains exactly `commandId`, `playerId`, `recordId`, `previousActivityId`, and `selectedActivityId`. No save fields, schemas, migrations, compatibility behavior, content, dependencies, advancement, preview, rest, turn-in, reward, or unrelated UI behavior changed.

## Risks / Follow-Up

- The default sequence follows the established transient-command convention using activity-record count; durable delivery, replay, and idempotency remain deferred.
- Other owner-specific `currentActivity` writers intentionally remain and require separate characterization before extraction.
- `Version 0.6.3.1` must perform the required read-only post-transition audit before another consumer is selected.
- `docs/dev/queued-codex-cleanup-prompt.md` remains queued documentation maintenance for a later appropriate run.

## Next Recommended Version

Version 0.6.3.1 - Engine-Owned Activity Selection Post-Transition Audit

## Suggested Commit Message

feat(runtime): move activity selection into engine ownership
