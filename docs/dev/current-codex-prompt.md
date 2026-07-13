# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the narrow validation repair:

`Version 0.5.356 - Tool Surface Test Boundary Repair`

## Current accepted repo state

- Latest completed primary: `Version 0.5.355 - Tool Surface Test Boundary Decision`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.356 - Tool Surface Test Boundary Repair`
- Standalone content lint is green at 67 files.
- Generic tool smoke should own only side-effect-free content-lint execution and stable success-output shape.
- DB build is an explicit side-effectful generator and must leave automatic discovery.
- Scenario execution/determinism is owned by `tests/simulation/deterministic-scenario.test.mjs`.
- The other 14 full-suite failures and broad typecheck debt remain outside scope.

## Purpose

Implement the exact one-test-file boundary from `0.5.355`: make generic tool smoke side-effect-free, remove stale count drift, and preserve scenario ownership. Do not change tools or production behavior.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md` and `README.md`;
- current output, handoff, prompt, sequence, roadmap, and backlog;
- `docs/design/validation-source-map.md`;
- `docs/design/validation-command-matrix-plan.md`;
- `docs/design/tool-surface-test-boundary-decision.md`;
- `tests/integration/tool-surfaces.test.mjs`;
- `tests/simulation/deterministic-scenario.test.mjs`;
- content-lint, DB-build, and scenario entrypoints only as needed to reconfirm the approved boundary.

## Required implementation

Edit only `tests/integration/tool-surfaces.test.mjs` among test/source files:

- remove DB-build execution;
- remove scenario-runner execution;
- keep one clearly named content-lint process smoke;
- require exit status zero and include stderr in failure diagnostics;
- assert one anchored success line matching `content-lint: ok (<positive integer> files checked)`;
- do not hardcode `67` or any exact total;
- do not add helpers, dependencies, package scripts, cleanup logic, temp output, or generated-output behavior.

## Allowed changes

- `tests/integration/tool-surfaces.test.mjs`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Guardrails

Do not edit content-lint, DB-build, scenario-runner, package scripts, dependencies, configs, content, schemas, validators, generated/vendor files, runtime, UI, account state, save/account, or gameplay. Do not triage/fix the other 14 failures or broad typecheck debt. Do not run full suite, DB build, broad typechecks, UI build, package installation, network-dependent commands, or Deep Research. Do not reopen gated lanes or transition to `0.6.0`.

## Validation

Run:

```bash
node --test tests/integration/tool-surfaces.test.mjs
node --test tests/simulation/deterministic-scenario.test.mjs
node --test tests/unit/polity-validation.test.mjs
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify the changed integration test contains no DB-build or scenario-runner entry, does not hardcode `56` or `67`, and cannot write generated output. Verify unchanged tools/scripts/config/dependencies/source/content/schemas/validators/generated output, no unrelated failure changes, no conflict markers/trailing whitespace, and aligned route pointers.

Suggested commit message:

`test(tools): isolate side-effect-free tool smoke`
