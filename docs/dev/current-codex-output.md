# Current Codex Output

Date: 2026-07-26

Source run: `Version 0.6.6 Fail-Closed Preflight Review And Support Routing`

Run classification: unversioned documentation-only inspection and coordination correction

Parent version: `0.6.6`

Milestone impact: `supports_current_band`

## Inspected State

Codex inspected the clean synchronized repository at:

`36f83d0856eb59446af9dfe597cf4e503470a158`

The exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt was not executed because its mandatory untouched baseline failed.

No production content, runtime, schema, validator, test, save, migration, dependency, UI, generated, asset, or gameplay file was changed by the preflight.

## Accepted Preflight Findings

The preflight confirmed:

- the exact nine-row monster/ecology matrix is internally correct;
- all named content references resolve;
- baseline counts are correct;
- the exact source-output rule produces 28 new drop rows;
- `npm.cmd run tool:content-lint` passes at 67 checked files;
- the required focused command passes 142 of 146 tests;
- all four failures are JSON parse failures caused by optional leading UTF-8 BOMs.

The required command was:

`node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

## Independent Repository Verification

The reported cause matches the live repository:

- `tests/unit/region-first-world-data.test.mjs` reads UTF-8 text and calls `JSON.parse(raw)` directly;
- `tests/unit/slug-content.test.mjs` does the same;
- `regional_ecology_profiles.json` begins with UTF-8 BOM bytes;
- `region_localities.json` begins with UTF-8 BOM bytes;
- `flora.json` begins with `U+FEFF`;
- `minerals.json` begins with `U+FEFF`.

The JSON files are valid BOM-bearing fixtures. The defect is the narrow test-reader assumption, not the `0.6.6` content target.

## Routing Decision

Activated support suffix:

`Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`

Active prompt blob:

`93d2a29e1cbc8dd931a243becfbbeab2ed8a69a0`

Preserved exact parent prompt blob:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

`0.6.6.1` changes only:

- `tests/unit/region-first-world-data.test.mjs`;
- `tests/unit/slug-content.test.mjs`;
- completion coordination documents.

The repair removes at most one optional leading `U+FEFF` before `JSON.parse`. It may not edit JSON content, broadly trim input, weaken assertions, create a production parser, add dependencies, or author the parent content package.

## Required Acceptance

The support run must:

1. reproduce the four baseline failures before editing;
2. repair only the two test readers;
3. pass the two focused tests;
4. pass content lint at 67 files;
5. pass the exact parent command at 146/146;
6. prove all content files are byte-unchanged;
7. pass `git diff --check` and complete changed-path review;
8. restore `docs/dev/current-codex-prompt.md` byte-for-byte from parent blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`;
9. stop without executing `0.6.6` in the same run.

## Coordination Updated

Updated:

- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/project-vision-and-continuity-brief.md`;
- `docs/dev/current-codex-output.md`.

The static-content program remains semantically correct: `0.6.6` is still the active primary and `0.6.7` remains reserved next. The new suffix is a fail-closed prerequisite repair, not a new content milestone.

## Near-Term Sequence

1. complete `0.6.6.1`;
2. restore and run exact `0.6.6`;
3. run `0.6.7`;
4. run Geography/recognition planning;
5. run Activity Resolution reuse audit;
6. run the Mortal Crisis receipt contract;
7. run bounded lethal-process/stabilization research only when that contract confirms readiness;
8. proceed through separately authorized owner-specific packages.

## Active Prompt

`Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`

Suggested commit:

`test(content): tolerate utf-8 bom in json fixtures`
