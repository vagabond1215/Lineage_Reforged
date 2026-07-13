# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused validation planning pass:

`Version 0.5.354 - Validation Command Matrix Plan`

## Current accepted repo state

- Latest completed primary: `Version 0.5.353 - Validation Source Map`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.354 - Validation Command Matrix Plan`
- Standalone content lint and required focused suites are green.
- The observed full test suite passed 3,456/3,471 and failed 15; it also executes side-effectful DB build through integration coverage.
- Default/UI and workspace typechecks are known non-green audit surfaces.
- All authority/content/runtime lanes retain their existing gates, pauses, rejections, closures, and maturity boundaries.

## Purpose

Define a durable docs-only validation command matrix for current change classes. Distinguish minimum green gates, conditional audits, known-failing baselines, side-effectful tools, generated-output checks, and environment failures. Recommend at most one later narrow validation route. Do not fix or implement anything.

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
- `docs/design/roadmap-post-diplomacy-conflict-deferral-selection.md`;
- `docs/design/validation-source-map.md`;
- `docs/design/validation-blocker-inventory.md`;
- current root/app package scripts, TypeScript configs, tool-surface integration test, content-lint entrypoint, and ignore/generated-output guidance only as needed to verify the matrix.

Do not rerun the full suite or broad typechecks merely to rediscover the accepted baseline.

## Expected output

Add:

- `docs/design/validation-command-matrix-plan.md`

## Required decisions

- define exact minimum, conditional, and prohibited commands for docs-only, content, schema/validator, helper/runtime, UI/presentation, save/account/high-risk, and generated-output changes;
- distinguish green gate, known-failing audit, side-effectful generator/build, long-running interactive command, and network/environment-dependent command semantics;
- define focused-test selection and baseline-comparison rules without hardcoding an exhaustive test map;
- define how prompts and handoffs report expected failures, unexpected failures, skipped side-effectful commands, and environment limitations;
- define schema-suite and normal content-lint timing;
- define when UI/default or workspace typecheck is useful despite a non-green baseline;
- define when full `npm test` may be run, given its current failures and DB-build side effect;
- decide later routing for the stale tool-surface content-lint expectation and other blockers without fixing them;
- decide whether `docs/design/validation-blocker-inventory.md` remains useful, is superseded, or needs a later cleanup decision;
- recommend at most one later narrow route, or no immediate follow-up.

## Guardrails

Docs only. Do not add/edit package scripts, dependencies, configs, source, content, schemas, validators, tests, normal-lint registration, generated/vendor files, runtime, UI, account state, save/account, or gameplay. Do not run the full test suite, broad typechecks, UI build, DB build, package installation, network-dependent commands, or Deep Research. Do not reopen gated lanes or transition to `0.6.0`.

## Allowed changes

- `docs/design/validation-command-matrix-plan.md`
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

Verify docs-only scope, unchanged scripts/config/dependencies/source/content/schemas/validators/tests/generated output, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers.

Suggested commit message:

`docs(validation): define validation command matrix`
