# Current GPT Handoff

Source version/run: Version 0.6.3.2 - Engine-Owned Activity Selection Collision Regression Repair
Date: 2026-07-14

## Status

Latest completed primary:

- `Version 0.6.3 - Engine-Owned Activity Selection Command`

Latest completed support/repair run:

- `Version 0.6.3.2 - Engine-Owned Activity Selection Collision Regression Repair`

Immediate next support/audit route:

- `Version 0.6.3.3 - Engine-Owned Activity Selection Post-Repair Audit`

## Repair Result

The existing collision test now creates `job.harbor_surveyor` and `business.gannet_cutter` commands from the same snapshot with explicit sequence `31`. It asserts equal tick, sequence, player id, snapshot version, and full revision; distinct record and command ids; accepted execution at the same applied tick; and distinct event ids.

Only `tests/unit/player-activity-selection-command.test.mjs` changed among source/test files. No production behavior changed. Activity-selection tests pass 10/10 and the prescribed focused group passes 45/45.

## Queued Future Work

- `docs/dev/queued-codex-cleanup-prompt.md` remains unchanged.
- The user's future static-content expansion plan is preserved in the pipeline-adapted `docs/dev/queued-static-content-expansion-integration-prompt.md`.
- Both prompts must remain unchanged during `0.6.3.3`.
- If `0.6.3.3` accepts activity selection, install the static-content integration prompt as the immediate unversioned combined maintenance pass. That pass consumes the historical cleanup intent, integrates the static-content program, and may then install the reserved `Version 0.6.4 - World And Settlement Static Content Expansion` prompt.

## Next Route

Run read-only `Version 0.6.3.3 - Engine-Owned Activity Selection Post-Repair Audit`. Inspect the committed repair, confirm the equal-sequence property and narrow changed-path set, rerun all 45 focused tests and transition gates, and accept only if all pass. Do not compare or select activity advancement, rest, or quest turn-in during this audit.

Suggested next commit:

`docs(audit): accept activity selection collision repair`
