# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.3.2 - Engine-Owned Activity Selection Collision Regression Repair`

## Accepted State

- Player travel, quest acceptance, and repaired quest tracking are engine-owned and accepted.
- `Version 0.6.3 - Engine-Owned Activity Selection Command` moved only activity-record selection behind one browser-safe engine resolver, deterministic transient command, atomic synchronized result, and typed accepted event.
- `Version 0.6.3.1 - Engine-Owned Activity Selection Post-Transition Audit` confirmed every runtime, authority, behavior, atomicity, event, persistence/browser, UI-adapter, scope, and hygiene gate at 45/45 focused tests.
- A read-only probe proved runtime collision safety when two different record ids use the same snapshot and explicit sequence.
- The transition is not accepted because the committed collision test uses different sequences (`31` and `32`) and therefore lacks permanent equal-sequence regression coverage.
- No Deep Research or user decision is required.

## Purpose

Make the smallest test-only correction that permanently proves activity record identity prevents command and event collisions when every non-record identity input is equal.

Do not change production runtime, UI, shared contracts, events, characterization hashes, content, schemas, saves, dependencies, or generated output.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, README, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, and backlog.
3. Inspect `tests/unit/player-activity-selection-command.test.mjs`, especially `identical fixtures are deterministic and distinct same-tick selections remain distinct`, plus command/event identity construction in `packages/engines/game-engine/src/player-activity-selection.ts`.
4. Confirm the current test creates the different-record commands with sequences `31` and `32` before editing.

## Required Repair

Edit only `tests/unit/player-activity-selection-command.test.mjs` among source/test files.

In the existing deterministic/collision test:

- Preserve the identical-fixture deterministic assertion.
- Create two commands from the same unchanged snapshot for `job.harbor_surveyor` and `business.gannet_cutter` using the same explicit command sequence.
- Inspect the command objects before execution and assert their tick, sequence, player id, snapshot version, and full snapshot revision are equal.
- Assert the record ids differ and the command ids differ.
- Execute both commands against equivalent clones of that same source snapshot.
- Assert both results are accepted, both applied ticks are equal, result command ids remain distinct, and emitted event ids are distinct.
- Keep the test deterministic and independent of wall-clock time or random identity.

Do not alter command construction, event construction, resolver behavior, result types, notification behavior, UI code, exports, or the characterization test. Do not add a new test file when the existing collision test can express the required property directly.

## Required Validation

Run:

`node --test tests/unit/player-activity-selection-command.test.mjs tests/unit/player-activity-selection-characterization.test.mjs tests/unit/player-quest-tracking-command.test.mjs tests/unit/player-quest-tracking-characterization.test.mjs tests/unit/player-quest-acceptance-command.test.mjs tests/unit/player-quest-acceptance-characterization.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Also run `git diff --check`, inspect the complete changed-path set, and confirm no production file changed.

Do not run the full suite, DB build, UI build, package installation, servers, generated-output refresh, or typecheck unless an unexpected focused failure materially requires diagnosis.

## Acceptance

Accept this repair only if:

- the focused group passes;
- the edited committed test holds sequence and every non-record identity input constant;
- command ids and event ids remain distinct because record ids differ;
- only the one focused command test changes among source/test files;
- no runtime or player-visible behavior changes.

If an unexpected defect requires production changes, stop and report it instead of broadening this repair.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and overwrite this file with an exact read-only `Version 0.6.3.3 - Engine-Owned Activity Selection Post-Repair Audit` prompt. Record source/run/date, starting status, exact test correction, checks, changed paths, behavior confirmation, risks, next version, and suggested commit.

Do not select `0.6.4` during this repair. Activity advancement/preview, rest/preview, quest turn-in, generic delivery/replay, and queued documentation maintenance remain deferred until the post-repair audit accepts the transition.

Suggested commit message:

`test(runtime): lock equal-sequence activity selection identity`
