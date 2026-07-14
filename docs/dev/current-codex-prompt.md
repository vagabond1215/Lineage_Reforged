# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.3.1 - Engine-Owned Activity Selection Post-Transition Audit`

## Accepted State

- Player travel, quest acceptance, and repaired quest tracking are engine-owned and accepted.
- `Version 0.6.3 - Engine-Owned Activity Selection Command` moved only activity-record selection behind one browser-safe engine resolver, deterministic transient command, atomic synchronized result, and typed accepted event.
- The transition is required to preserve the locked success snapshot hash `1f2f5178d3ac4d9c592184f714bdec5c71f421012608b6850d548ed300e5fc40`, success notice hash `ca04212b7f64e83b8462653ab090144b4710a6e98b7ae64aa68f6846b04415ee`, and missing-record notice hash `31bafd513a34fce0bceb4c7c3b779e89da098cdb1b18b1e669b078ae4d13ed77`.
- Activity advancement/preview, rest/preview, quest turn-in, and every other `currentActivity` writer remain separate.
- No Deep Research or user decision is required.

## Known Prior-Run Insufficiency

The committed test named `identical fixtures are deterministic and distinct same-tick selections remain distinct` creates the two different-record commands with different explicit command sequences (`31` and `32`). That proves only that different sequences produce different identities. It does **not** prove that `recordId` prevents collisions when tick, sequence, player, snapshot version, and full revision are otherwise identical.

Treat this as an explicit audit gate, not a suggestion:

- A same-tick comparison using different command sequences does not satisfy collision-safety coverage.
- Run a direct equal-sequence probe using two different activity record ids from the same snapshot and the same explicit sequence, or create both commands from the same snapshot using the same default sequence.
- Confirm both command ids and emitted event ids remain distinct while tick, sequence, player id, snapshot version, and revision are held constant.
- Inspect the identity construction to confirm `recordId` participates in the command identity.
- Permanent committed equal-sequence regression coverage is required for acceptance. A one-off audit probe may prove the runtime is currently correct, but it does not replace a committed regression test.

## Purpose

Perform one read-only post-transition audit of engine-owned activity selection. Decide whether the extraction is accepted or whether one smallest repair run is required.

Do not modify runtime, UI, shared contracts, events, tests, content, schemas, saves, dependencies, or generated output in this run.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, README, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, runtime-readiness and travel-clarification sources, the historical/deferred-route register if present, and backlog.
3. Inspect the committed `0.6.3` changed-path set and exact diff; the activity-selection resolver/command/result/event; JS peer and public exports; shared event registration; snapshot synchronizer; persistence contracts; gameplay-loop bridge; `ActivityPanel.tsx`; characterization/command tests; notification cap/time-label behavior; all production `currentActivity` writers; and accepted travel/quest command patterns.
4. Inspect the actual collision test inputs rather than relying on its test name or the prior output claim. Record whether the committed test holds the command sequence constant across different record ids.

## Audit Gates

### Authority and scope

- Confirm the engine resolver is the sole owner of activity-record lookup, category derivation, and selection eligibility used by execution.
- Confirm the UI bridge contains no direct activity-selection mutation or selection-notification append.
- Confirm `ActivityPanel.tsx` applies returned snapshots only on accepted results and always displays the returned notice.
- Classify every remaining production `currentActivity` assignment by owner. Travel, quest acceptance, activity advancement, rest, quest turn-in, synchronizer cleanup, or other pre-existing owner-specific assignments may remain; duplicate activity-selection ownership may not.
- Confirm no advancement, preview, rest, turn-in, reward, inventory, reputation, clock/body/resource, activity-record content, notification infrastructure, UI-layout, or unrelated refactor entered the patch.

### Behavior parity

- Re-run complete success and missing-record snapshot/notice characterization and confirm the accepted hashes remain exact.
- Confirm selected id, label, derived category, and detail are exact.
- Confirm the exact `Current activity set` notification id, title, detail, time label, tone, newest-first order, and eight-entry cap.
- Confirm Chronicle state is unchanged.
- Confirm selecting an already-selected record remains accepted and appends another notification.
- Confirm missing-record behavior returns the original snapshot identity/content and the exact warning notice.
- Confirm input snapshots remain immutable.

### Command identity and atomicity

- Confirm command shape includes player id, activity record id, deterministic sequence, expected tick, snapshot version, full snapshot revision, and collision-safe deterministic identity.
- Confirm identical fixtures repeat exactly.
- Confirm two commands created from the same snapshot for different record ids with the **same command sequence** produce distinct command ids.
- Confirm executing those equal-sequence commands produces distinct event ids at the same applied tick.
- Confirm the distinction is attributable to the record identity rather than different sequence, tick, player, version, or revision values.
- Do not count the existing `31` versus `32` comparison as satisfying the equal-sequence gate.
- Confirm malformed, wrong-player, stale tick/version/revision, incoherent, missing-record, and injected-failure paths return the original snapshot identity/content and emit zero events.
- Confirm accepted execution clones before mutation, changes only selection state plus the existing notification before synchronization, and cannot expose a partial clone.

### Event, persistence, and browser boundary

- Confirm exactly one typed `player.activity.selected` event is emitted on acceptance.
- Confirm its payload contains exactly `commandId`, `playerId`, `recordId`, `previousActivityId`, and `selectedActivityId`.
- Confirm no label, category, detail, notification text, notice text, presentation prose, or snapshot internals exist in the event.
- Confirm current-data serialization roundtrip preserves accepted selection and notification state while persisting no command correlation.
- Confirm browser-safe imports, intentional TS/JS peer alignment, public exports, and shared event registration.

### UI adapter and hygiene

- Confirm every rejection notice remains visible while rejected snapshots are not applied.
- Confirm no conflict markers, temporary artifacts, accidental generated/vendor edits, unrelated dependency changes, or broad formatting churn.
- Confirm `docs/dev/queued-codex-cleanup-prompt.md` remains preserved and subordinate to the active runtime sequence.
- Run `git show --check`, `git diff --check`, and inspect the complete changed-path set.

## Required Tests

Run the activity-selection command and characterization tests created by `0.6.3`, plus:

`node --test tests/unit/player-quest-tracking-command.test.mjs tests/unit/player-quest-tracking-characterization.test.mjs tests/unit/player-quest-acceptance-command.test.mjs tests/unit/player-quest-acceptance-characterization.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

If the activity-selection files use the expected names, run them in the same command:

`tests/unit/player-activity-selection-command.test.mjs tests/unit/player-activity-selection-characterization.test.mjs`

Also run a read-only one-off equal-sequence identity probe without editing tracked files. Use the same snapshot, same explicit sequence, and two different live record ids; assert distinct command ids, accepted results, same applied tick, and distinct event ids. Record the exact values or a concise deterministic comparison in the audit output.

Do not run the full suite, DB build, UI build, package installation, servers, or generated-output refresh. Run typecheck only if it materially clarifies a touched-boundary diagnostic.

## Decision Rule

- Accept `0.6.3` only if every runtime gate passes **and** permanent committed regression coverage proves different record ids cannot collide when the command sequence is equal.
- If the runtime is correct but the committed test still uses different sequences, select `Version 0.6.3.2 - Engine-Owned Activity Selection Collision Regression Repair`. Scope it to the smallest test-only correction: hold the sequence constant for two different record ids, assert distinct command and event ids, rerun the focused group, and change no production behavior.
- If another material defect exists, select `Version 0.6.3.2 - Engine-Owned Activity Selection Repair` and define only the smallest coherent repair.
- Do not select `0.6.4` while any required repair remains.
- Only after full acceptance may the audit compare activity advancement, rest, and quest turn-in from current source evidence and select exactly one bounded `Version 0.6.4 - ...` consumer. Larger scope is allowed only when it remains one coherent owner-specific command package with characterization, preview/execution reconciliation where required, atomicity, and focused validation.
- Do not implement a repair or next consumer during this read-only audit.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and overwrite this file with the exact accepted next implementation or smallest repair prompt. Record source/run/date, starting status, files inspected, checks, gate evidence, the equal-sequence probe, whether permanent regression coverage exists, acceptance decision, consumer comparison only if allowed, risks, next version, and suggested commit.

Suggested commit message:

`docs(audit): verify engine-owned activity selection transition`
