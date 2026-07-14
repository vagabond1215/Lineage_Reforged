# Current GPT Handoff

Source version/run: Version 0.6.3 - Engine-Owned Activity Selection Command
Date: 2026-07-13

## Status

Latest completed primary:

- `Version 0.6.3 - Engine-Owned Activity Selection Command`

Latest completed support/audit run:

- `Version 0.6.2.3 - Engine-Owned Quest Tracking Post-Repair Audit`

Immediate next support/audit route:

- `Version 0.6.3.1 - Engine-Owned Activity Selection Post-Transition Audit`

## Implementation Result

Activity-record selection now has one browser-safe engine resolver, deterministic transient command with expected tick/version/full snapshot revision, atomic synchronized result, and typed `player.activity.selected` event. The UI gameplay-loop adapter projects notices but no longer performs record lookup, category derivation, selection mutation, or notification append. `ActivityPanel.tsx` applies snapshots only on acceptance and still displays every returned notice.

Exact success and missing-record behavior remained stable across extraction. The locked success snapshot hash is `1f2f5178d3ac4d9c592184f714bdec5c71f421012608b6850d548ed300e5fc40`, success notice hash is `ca04212b7f64e83b8462653ab090144b4710a6e98b7ae64aa68f6846b04415ee`, and missing-record notice hash is `31bafd513a34fce0bceb4c7c3b779e89da098cdb1b18b1e669b078ae4d13ed77`. Selection tests pass 10/10 and the prescribed focused group passes 45/45.

## Preserved Boundaries

- Accepted events contain only `commandId`, `playerId`, `recordId`, `previousActivityId`, and `selectedActivityId`; presentation facts remain in result/notice projection.
- Selection preserves the exact capped notification and synchronization behavior, repeated-selection acceptance, Chronicle state, serialization roundtrip, and atomic rejection.
- Activity advancement/preview, rest/preview, quest turn-in, and every other owner-specific `currentActivity` writer remain untouched.
- No save/schema/content/dependency/compatibility/generic command-bus/event-dispatch/replay behavior was added.

## Next Route

Run the read-only `Version 0.6.3.1 - Engine-Owned Activity Selection Post-Transition Audit`. Reconfirm authority, exact hashes, command identity, atomicity, notification/event boundaries, persistence/browser safety, UI adaptation, and hygiene. If accepted, compare advancement, rest, and turn-in from current evidence and select exactly one bounded `0.6.4` consumer; otherwise choose the smallest `0.6.3.2` repair.

The remotely added `docs/dev/queued-codex-cleanup-prompt.md` remains untouched and queued as documentation maintenance; it did not replace the active runtime audit route.

Suggested next commit:

`docs(audit): verify engine-owned activity selection transition`
