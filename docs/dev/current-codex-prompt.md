# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.3.3 - Engine-Owned Activity Selection Post-Repair Audit`

## Accepted State

- Player travel, quest acceptance, and repaired quest tracking are engine-owned and accepted.
- `Version 0.6.3 - Engine-Owned Activity Selection Command` is runtime-correct and passed every transition gate except permanent equal-sequence collision coverage.
- `Version 0.6.3.2 - Engine-Owned Activity Selection Collision Regression Repair` is expected to change only the existing activity-selection command test among source/test files.
- The repaired test must hold tick, command sequence, player id, snapshot version, and full snapshot revision constant across different record ids while proving distinct command and event identities.
- `docs/dev/queued-codex-cleanup-prompt.md` and `docs/dev/queued-static-content-expansion-integration-prompt.md` are queued documentation maintenance. Preserve both unchanged during this audit.
- No Deep Research or user decision is required.

## Purpose

Perform one read-only post-repair audit. Decide whether the activity-selection transition is accepted or whether one further smallest repair suffix is required.

Do not modify runtime, UI, shared contracts, events, tests, content, schemas, saves, dependencies, queued prompt files, or generated output in this run.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, README, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, backlog, and both queued maintenance prompts.
3. Inspect the exact committed `0.6.3.2` changed-path set and diff.
4. Inspect `tests/unit/player-activity-selection-command.test.mjs` and command/event identity construction in `packages/engines/game-engine/src/player-activity-selection.ts`.
5. Reinspect the activity-selection resolver/result/event, JS peer and exports, shared event registration, synchronizer, persistence boundary, gameplay-loop bridge, `ActivityPanel.tsx`, characterization coverage, all production `currentActivity` writers, and accepted travel/quest command patterns.

## Repair Audit Gates

### Exact repair and scope

- Confirm only `tests/unit/player-activity-selection-command.test.mjs` changed among source/test files.
- Confirm no production, UI, contract, event, characterization, content, schema, save, dependency, generated-output, or asset file changed in the repair.
- Confirm the existing deterministic/collision test was corrected rather than adding a duplicate test file.
- Confirm identical-fixture deterministic coverage remains present.

### Permanent equal-sequence coverage

- Confirm two commands are created from the same unchanged snapshot for `job.harbor_surveyor` and `business.gannet_cutter`.
- Confirm the explicit command sequence is equal across both commands.
- Confirm expected tick, player id, snapshot version, and full snapshot revision are asserted equal.
- Confirm record ids are asserted different and command ids are asserted different before execution.
- Confirm both commands execute against equivalent clones of the same source snapshot.
- Confirm both results are accepted at the same applied tick, result command ids remain distinct, and event ids remain distinct.
- Confirm command identity still includes `recordId` and event identity still incorporates the command id.

### Complete transition gates

- Reconfirm the locked success snapshot hash `1f2f5178d3ac4d9c592184f714bdec5c71f421012608b6850d548ed300e5fc40`, success notice hash `ca04212b7f64e83b8462653ab090144b4710a6e98b7ae64aa68f6846b04415ee`, and missing notice hash `31bafd513a34fce0bceb4c7c3b779e89da098cdb1b18b1e669b078ae4d13ed77`.
- Reconfirm sole engine selection authority, exact id/label/category/detail derivation, notification id/text/time/tone/order/eight-entry cap, repeated-selection behavior, Chronicle non-mutation, missing-record identity/content, and input immutability.
- Reconfirm malformed, wrong-player, stale tick/version/revision, incoherent, missing-record, and injected-failure atomic rejection with zero events.
- Reconfirm exactly one typed five-key no-prose accepted event, current-data roundtrip, no persisted command correlation, browser-safe imports, TS/JS peer, public exports, shared registration, accepted-only UI application, and visible rejection notices.
- Classify every remaining production `currentActivity` assignment and confirm no duplicate activity-record selection owner.
- Confirm no conflict markers, temporary artifacts, accidental generated/vendor edits, dependency changes, or broad formatting churn.

## Required Tests

Run:

`node --test tests/unit/player-activity-selection-command.test.mjs tests/unit/player-activity-selection-characterization.test.mjs tests/unit/player-quest-tracking-command.test.mjs tests/unit/player-quest-tracking-characterization.test.mjs tests/unit/player-quest-acceptance-command.test.mjs tests/unit/player-quest-acceptance-characterization.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Also run `git show --check` for the repair commit, `git diff --check`, conflict-marker checks, and complete changed-path review.

Verify both queued files remain byte-for-byte unchanged. Their expected SHA-256 hashes are:

- `docs/dev/queued-codex-cleanup-prompt.md`: `365548975A20FC72BA95C92387C7ED1A8A2C45B8EE275F42B230750DD8A91883`
- `docs/dev/queued-static-content-expansion-integration-prompt.md`: `CA3E8B5DB0DC75DECCCD391BF64F63A56C0FE9BEC0E6DE28B7C6175CEF3D2C59`

Do not run the full suite, builds, typechecks, package installation, servers, generators, content lint, or generated-output refresh.

## Decision Rule

- If every gate passes, accept the activity-selection transition.
- Do not compare or select activity advancement, rest, or quest turn-in during this audit.
- On acceptance, preserve both queued files and overwrite `docs/dev/current-codex-prompt.md` with the exact contents of `docs/dev/queued-static-content-expansion-integration-prompt.md` for the immediate unversioned combined maintenance pass `Historical Route Cleanup And Static Content Expansion Pipeline Integration`.
- The combined maintenance pass, not this audit, decides whether readiness permits installing `Version 0.6.4 - World And Settlement Static Content Expansion`.
- If any material gate fails, select the smallest further `0.6.3.x` repair, preserve both queued files, and do not install the maintenance prompt.
- Do not implement a repair, maintenance work, content, or another runtime consumer during this read-only audit.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and update this file according to the decision rule. Record source/run/date, starting status, exact committed repair diff, files inspected, all checks, equal-sequence evidence, behavior confirmation, queue-file hashes, acceptance decision, risks, next route, and suggested commit.

Suggested commit message:

`docs(audit): accept activity selection collision repair`
