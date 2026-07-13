# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused validation audit:

`Version 0.5.357 - Tool Surface Test Post-Repair Audit`

## Current accepted repo state

- Latest completed primary: `Version 0.5.356 - Tool Surface Test Boundary Repair`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.357 - Tool Surface Test Post-Repair Audit`
- Generic tool smoke executes only content lint and asserts an anchored positive-count success summary.
- DB build no longer runs through the integration test.
- Scenario runner remains owned by the deterministic simulation test.
- The other 14 full-suite failures and broad typecheck debt remain outside scope.

## Purpose

Audit the completed one-test-file repair for exact boundary compliance, green focused validation, and absence of tool/generated-output changes. Decide whether another tool-surface follow-up is needed and select at most one later route. Do not implement anything.

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
- content-lint, DB-build, and scenario entrypoints only as needed to verify non-change and ownership.

Do not run full suite, DB build, broad typechecks, UI build, package installation, or network-dependent commands.

## Expected output

Add:

- `docs/design/tool-surface-test-post-repair-audit.md`

## Required decisions

- confirm generic tool smoke contains only content-lint execution;
- confirm status/stderr and anchored positive-count output-shape assertions;
- confirm no hardcoded checked-file total;
- confirm DB build cannot run through this integration test;
- confirm scenario execution/determinism remains owned and passing in its simulation test;
- confirm tools, scripts, configs, dependencies, content, schemas, validators, and generated output remain unchanged;
- decide whether the tool-surface lane is stable and can close;
- keep the other 14 failures and broad typecheck debt separate;
- select at most one later narrow route or return to roadmap selection.

## Guardrails

Docs only. Do not add/edit scripts, tools, dependencies, configs, source, content, schemas, validators, tests, normal-lint registration, generated/vendor files, runtime, UI, account state, save/account, or gameplay. Do not run full suite, DB build, broad typechecks, UI build, package installation, network-dependent commands, or Deep Research. Do not triage unrelated failures, reopen gated lanes, or transition to `0.6.0`.

## Allowed changes

- `docs/design/tool-surface-test-post-repair-audit.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

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

Verify docs-only scope, unchanged test/tool/script/config/dependency/source/content/schema/validator/generated output, no unrelated failure triage, no conflict markers/trailing whitespace, and aligned route pointers.

Suggested commit message:

`docs(validation): audit tool surface repair`
