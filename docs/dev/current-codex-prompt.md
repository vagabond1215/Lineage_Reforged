# Current Codex Prompt

## Run Identity

`Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`

Parent primary:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`

Run this as one narrow support repair. Do not author the `0.6.6` monster/ecology/loot content in this pass.

Suggested commit:

`test(content): tolerate utf-8 bom in json fixtures`

## Reason For The Support Run

The fail-closed `0.6.6` preflight at commit `36f83d0856eb59446af9dfe597cf4e503470a158` confirmed:

- repository state was clean and synchronized;
- the exact `0.6.6` content matrix, references, counts, and 28-drop calculation were valid;
- `npm.cmd run tool:content-lint` passed at 67 checked files;
- the mandatory focused command completed 142 of 146 tests;
- four failures came from baseline tests calling `JSON.parse(raw)` on JSON text with an optional leading UTF-8 BOM;
- affected readers are `tests/unit/region-first-world-data.test.mjs` and `tests/unit/slug-content.test.mjs`;
- confirmed BOM-bearing inputs include `regional_ecology_profiles.json`, `region_localities.json`, `flora.json`, and `minerals.json`.

This is a test-harness compatibility defect. It is not permission to normalize, rewrite, reformat, or otherwise edit the content files.

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output, current handoff, this prompt, the route register, `docs/design/static-content-expansion-program.md`, and `docs/design/current-planning-anchor-reconciliation.md`.
2. Resolve and inspect the held `0.6.6` prompt blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`. Preserve it unchanged for restoration after this repair.
3. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
4. Confirm the two test files still pass raw `readFile(..., "utf8")` text directly to `JSON.parse(...)` without removing an optional leading `U+FEFF`.
5. Confirm the named JSON inputs still begin with an optional BOM where reported. Do not edit them.
6. Reproduce the baseline failure with the exact parent command before editing:

   `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

7. Stop without editing if the failure count, failure cause, affected tests, or repository baseline materially differs from the reported four BOM parse failures.

## Exact Repair

Update only the two test readers so an optional leading UTF-8 BOM is removed before `JSON.parse`.

The accepted semantic operation is equivalent to:

```js
const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));
```

A small file-local helper is also acceptable when it performs exactly the same narrow operation.

Requirements:

- remove at most one leading `U+FEFF`;
- preserve all other whitespace and JSON text;
- do not call broad `trim()` or normalize line endings;
- do not change record assertions, expected counts, slug rules, geographic rules, or test coverage;
- do not create a shared production parser or new dependency;
- keep the change local to test harnesses.

## Allowed Files

Test repair:

- `tests/unit/region-first-world-data.test.mjs`
- `tests/unit/slug-content.test.mjs`

Coordination after successful validation only:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/dev/current-codex-prompt.md`, solely to restore the exact parent prompt from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

## Prohibited Scope

Do not modify:

- any JSON content file, including the four BOM-bearing inputs;
- `packages/content/base/world/monsters.json`;
- schemas, validators, lint code, loaders, serializers, runtime parsers, packages, or dependencies;
- production runtime, UI, saves, migrations, generated output, assets, or gameplay;
- existing test assertions beyond the minimal BOM-tolerant parse seam;
- the held parent-prompt blob or held-route file;
- `0.6.7` or any later route.

Do not remove BOMs from repository data as cleanup. This support run fixes readers that explicitly parse repository JSON fixtures as UTF-8 text.

## Validation

After the repair:

1. Run:

   `node --test tests/unit/region-first-world-data.test.mjs tests/unit/slug-content.test.mjs`

2. Run:

   `npm.cmd run tool:content-lint`

3. Rerun the exact parent baseline:

   `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

4. Require all 146 tests to pass. If the total differs because the live baseline legitimately changed, report the exact total and stop before restoring the parent prompt unless every named test passes and no unrelated failure exists.
5. Confirm the four BOM-bearing content files and every other content file are byte-unchanged.
6. Run conflict-marker and trailing-whitespace searches, `git diff --check`, changed-path review, and full diff inspection.
7. Do not run builds, typechecks, package installation, servers, generators, or the full test suite.

## Completion And Parent Restoration

On success:

1. record exact before/after results and changed paths in `docs/dev/current-codex-output.md`;
2. mark `0.6.6.1` complete and exact `0.6.6` unblocked in the handoff and route register;
3. restore `docs/dev/current-codex-prompt.md` byte-for-byte from Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`;
4. do not execute the parent `0.6.6` content package in the same run.

The next run after accepted `0.6.6.1` is the restored exact:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`
