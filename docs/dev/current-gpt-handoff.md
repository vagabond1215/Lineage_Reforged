# Current GPT Handoff

Source version/run: Version 0.5.355 - Tool Surface Test Boundary Decision
Date: 2026-07-12

## Status

Latest completed primary:

- `Version 0.5.355 - Tool Surface Test Boundary Decision`

Latest completed support/audit run:

- `Version 0.5.344.1 - Living Character Manuscript Research Integration`

Immediate next primary route:

- `Version 0.5.356 - Tool Surface Test Boundary Repair`

## Boundary Result

Generic automatic smoke should execute only side-effect-free content lint and assert a stable success line with a positive file count. The total `67` is diagnostic, not a hardcoded generic-smoke invariant.

DB build must leave automatic/default test discovery because it writes timestamped ignored output. Scenario runner should leave generic smoke because the existing deterministic simulation test already owns execution and repeatability.

## Remaining Guardrails

The next implementation may edit only `tests/integration/tool-surfaces.test.mjs` among source/test files. Remove DB build and scenario runner, keep one content-lint smoke, and replace the stale exact count with an anchored positive-count output-shape assertion.

Do not edit tools, scripts, generated output, content, schemas, runtime, UI, save/account, or the other 14 failing test families. Do not run full suite, DB build, broad typechecks, UI build, installation, or network-dependent commands.

Suggested next commit:

`test(tools): isolate side-effect-free tool smoke`
