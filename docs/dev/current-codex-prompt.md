# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused validation boundary pass:

`Version 0.5.355 - Tool Surface Test Boundary Decision`

## Current accepted repo state

- Latest completed primary: `Version 0.5.354 - Validation Command Matrix Plan`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.355 - Tool Surface Test Boundary Decision`
- Standalone content lint is green at 67 files.
- `tests/integration/tool-surfaces.test.mjs` expects 56 files and executes content lint, DB build, and scenario runner.
- Full `npm test` is a known-failing, side-effectful audit; the other 14 accepted failures remain outside this route.
- Broad typechecks remain known-failing audits.

## Purpose

Decide the smallest coherent future test boundary for tool execution, content-lint output, DB-build side effects, scenario smoke, and generated-output verification. Select at most one later narrow repair route. Do not edit tests, tools, scripts, generated output, or behavior.

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
- `tests/integration/tool-surfaces.test.mjs`;
- root package scripts;
- content-lint, DB-build, and scenario-runner entrypoints;
- `.gitignore` generated-output paths;
- focused tool/scenario tests only as needed to distinguish owners.

Do not execute DB build, full suite, broad typechecks, UI build, package installation, or network-dependent commands.

## Expected output

Add:

- `docs/design/tool-surface-test-boundary-decision.md`

## Required decisions

- decide whether generic tool execution smoke, exact content-lint output/count, DB generated-output verification, and scenario determinism belong together or in separate focused tests;
- decide whether `67` is a durable exact integration assertion, should be derived from one registration authority, or should not be asserted by generic tool smoke;
- define how a future DB-build test avoids silent ignored-output mutation in ordinary/full-suite runs, or explicitly classifies the mutation as opt-in;
- decide whether scenario-runner execution belongs in generic tool smoke or its existing deterministic simulation owner;
- define exact allowed future implementation files, tests, generated-output handling, and stop conditions;
- keep the other 14 full-suite failures, typecheck debt, package scripts, and all feature lanes outside scope;
- select at most one later narrow repair route, or no immediate follow-up.

## Guardrails

Docs only. Do not add/edit package scripts, tools, dependencies, configs, source, content, schemas, validators, tests, normal-lint registration, generated/vendor files, runtime, UI, account state, save/account, or gameplay. Do not run the full suite, broad typechecks, UI build, DB build, package installation, network-dependent commands, or Deep Research. Do not reopen gated lanes or transition to `0.6.0`.

## Allowed changes

- `docs/design/tool-surface-test-boundary-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/polity-validation.test.mjs
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, unchanged scripts/tools/config/dependencies/source/content/schemas/validators/tests/generated output, no unrelated failure triage, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers.

Suggested commit message:

`docs(validation): decide tool surface test boundary`
