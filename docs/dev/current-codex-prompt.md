# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused validation source audit:

`Version 0.5.353 - Validation Source Map`

## Current accepted repo state

- Latest completed primary: `Version 0.5.352 - Roadmap Post-Diplomacy-Conflict Deferral Selection`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.353 - Validation Source Map`
- Static-authority and content-expansion lanes remain gated, paused, rejected, closed, research-gated, or maturity-gated.
- Required focused validation and normal content lint were green in `0.5.352`.
- `docs/design/validation-blocker-inventory.md` is connector-side prep, not implementation authority.

## Purpose

Create a durable repository-local source map of current validation commands, scripts, focused test families, normal content-lint ownership, broad typecheck posture, generated-output boundaries, and known environment/tooling blockers. Classify current surfaces and recommend at most one later docs-first validation planning route. Do not fix or implement anything.

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
- `docs/design/validation-blocker-inventory.md`;
- root and relevant workspace `package.json` files, TypeScript configs, content-lint entrypoints, test directories, and generated-output ignore/ownership guidance only as needed to map validation surfaces.

Use read-only discovery. Do not run package installation or network-dependent commands.

## Expected output

Add:

- `docs/design/validation-source-map.md`

## Required decisions

- inventory current root/workspace scripts for tests, typechecks, builds, content lint, schema checks, and scenarios;
- map normal content-lint ownership and the major focused validator/test families without rewriting an exhaustive test transcript;
- define which current commands are appropriate evidence for docs-only, content, schema/validator, helper/runtime, UI, and generated-output changes;
- classify broad UI/default and workspace typecheck posture using current repository evidence and, only if bounded, observed command results;
- distinguish repository defects from network, certificate, sandbox, Git-metadata, or generated-output limitations;
- identify stale, duplicated, missing, ambiguous, or unowned validation routing without fixing it;
- decide whether the existing connector prep remains useful, is superseded, or needs a later cleanup decision;
- recommend at most one later docs-first route, or explicitly recommend no immediate follow-up;
- preserve all current gated/paused/rejected/closed lanes and runtime/magic/save/manuscript guardrails.

## Stop conditions

Stop and report instead of broadening if mapping would require edits outside allowed docs, package installation, dependency/config/script changes, broad cleanup, generated-output refresh, or triage of a large unrelated failure set. Do not reproduce network-dependent failures. Do not implement a discovered fix.

## Guardrails

Docs only. Do not add/edit package scripts, dependencies, configs, source, content, schemas, validators, tests, normal-lint registration, generated/vendor files, runtime, UI, account state, save/account, or gameplay. Do not reopen gated lanes, invent canon/ids, run Deep Research, or transition to `0.6.0`.

## Allowed changes

- `docs/design/validation-source-map.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run at minimum:

```bash
node --test tests/unit/polity-validation.test.mjs
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Any additional validation command must be local, read-only, bounded, and directly useful to the source map. Record failures as evidence; do not fix them.

Verify docs-only scope, unchanged scripts/config/dependencies/source/content/schemas/validators/tests/generated output, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers.

Suggested commit message:

`docs(validation): map validation command surfaces`
