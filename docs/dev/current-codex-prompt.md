# Current Codex Prompt

## Run Identity

`Version 0.6.6.5 - Workspace Typecheck Baseline Classification And BOM Acceptance`

Parent primary:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`

Predecessor support runs:

- `Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`;
- `Version 0.6.6.2 - BOM Repair Post-Validation And Parent Prompt Restoration`;
- `Version 0.6.6.3 - Region Climate Tendencies Contract Repair And BOM Acceptance`;
- `Version 0.6.6.4 - Region Climate Data Migration, Population Assertion Repair, And BOM Acceptance`.

Run classification: four-segment support suffix attached to `0.6.6`.

Milestone impact: `supports_current_band`.

Suggested coordination commit after successful validation:

`docs(validation): accept climate repair against reproduced typecheck baseline`

## Purpose

The region climate/population implementation is committed at:

`232d3c2f466e3ec18e620e29a47f4466ae05b84d`

That commit changes exactly:

- `packages/content/base/world/regions.json`;
- `packages/engines/civilization-engine/src/content.ts`;
- `packages/shared/types/src/settlement-institutions.ts`;
- `tests/unit/region-first-world-data.test.mjs`.

It performs exactly the five authorized scalar-to-singleton-array migrations, moves the stale population-capacity assertion to `simulationProfile.populationCapacity`, changes the engine climate contract to `string[]`, and narrows the shared compatibility union to `string[]`.

The first `0.6.6.4` validation attempt established:

- focused tests passed `5/5`;
- normal content lint passed with `67` files checked;
- `npm.cmd run typecheck:workspace` remained non-green with `173` broad diagnostics;
- exactly four known unrelated diagnostics occurred across the two changed TypeScript files;
- the `146`-test parent baseline was not run after the nonzero audit;
- the parent prompt was not restored;
- no files changed during the validation attempt.

Two unexecuted `0.6.6.5` prompt corrections followed:

1. the first incorrectly required zero diagnostics in the changed TypeScript files;
2. the second correctly allowed four diagnostics but required locating a complete prior non-pretty capture that does not exist. The earlier terminal output was truncated, and later notes retained only counts and filtered changed-file evidence.

Local and `origin/master` were synchronized at `0f677b78e76905ef8d37eb8b4965b127d93d4db1`; the worktree was clean; neither invalid prompt was run.

Repository validation authority classifies `npm.cmd run typecheck:workspace` as a known-failing audit, not a universal green gate. This corrected prompt therefore authorizes creating a fresh complete baseline capture at the clean current head, proving that its four changed-file diagnostics are unrelated to commit `232d3c2f`, immediately reproducing the complete normalized diagnostic set, finishing the deferred green gates, restoring the exact parent prompt only after success, and stopping.

## Pinned Repository Evidence

Implementation head:

`232d3c2f466e3ec18e620e29a47f4466ae05b84d`

Pre-implementation `0.6.6.4` coordination head:

`047bc073900eacae9892b01994796ad9011b5b24`

First installed `0.6.6.5` coordination head:

`1d6880f5a2d7bcdc5c843e64b50bcd25d6883525`

Second unexecuted correction head:

`0f677b78e76905ef8d37eb8b4965b127d93d4db1`

Schema repair:

`56932eecedd7b28216b23cb5bf211fea7b01df46`

Focused climate assertion repair:

`e71f8f6b625f7b6744492cc8b19ab695f788d89c`

BOM reader repair:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Pre-repair coordination head:

`895c02df40332c813a8403bd489af6184111ccba`

Superseded unexecuted `0.6.6.5` prompt blobs:

- `ff436c355268d21783f2dd5d87835e75b7542d92`;
- `b78d495068e41e4f8ed026fe194e0cafbe4b9b5f`.

Exact parent `0.6.6` prompt blob to restore after success:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

Accepted BOM operation:

```js
JSON.parse(raw.replace(/^\uFEFF/, ""))
```

## Validation Classification Decision

`npm.cmd run typecheck:workspace` is a **known-failing audit** for this pass, not a green gate.

A prior complete diagnostic capture is not required. This pass must create a fresh candidate baseline and an immediate verification capture under the same clean repository, compiler, dependency, and environment state.

### Diagnostic tuple format

Parse each non-pretty TypeScript diagnostic header into this normalized tuple:

1. repository-relative path using `/` separators;
2. line;
3. column;
4. TypeScript diagnostic code;
5. complete diagnostic message from the diagnostic header.

Normalize only:

- an absolute workspace prefix to a repository-relative path;
- `\` path separators to `/`;
- CRLF versus LF line endings.

Do not normalize line numbers, columns, codes, message spacing, quoted symbols, or message text.

### Capture A: establish the candidate baseline

Run:

`npm.cmd run typecheck:workspace -- --pretty false`

Capture complete stdout and stderr to a temporary file outside the repository or an already ignored temporary path. Record the nonzero exit code.

Capture A is eligible only when all of the following hold:

1. exactly `173` diagnostic-header tuples are parsed;
2. exactly four tuples are reported across:
   - `packages/engines/civilization-engine/src/content.ts`;
   - `packages/shared/types/src/settlement-institutions.ts`;
3. no additional diagnostic is reported in either changed TypeScript file;
4. no diagnostic message anywhere mentions:
   - `climateTendencies`;
   - `RegionContentRecord`;
   - `InstitutionRegionRecord`;
5. the four changed-file tuples are recorded verbatim in the run notes;
6. for each of those four tuples, inspect the diagnostic source line, surrounding statement, complete message, and relevant symbol and prove all of the following:
   - the source line is outside the one-line `climateTendencies` change made by commit `232d3c2f`;
   - `git diff --unified=0 047bc073900eacae9892b01994796ad9011b5b24..232d3c2f466e3ec18e620e29a47f4466ae05b84d -- <file>` does not change the diagnostic source line or statement;
   - `git blame -L <line>,<line> -- <file>` does not attribute the diagnostic source line to commit `232d3c2f`;
   - the diagnostic message and referenced symbol do not concern the climate tendency field, the region interfaces named above, or the population-capacity test correction;
7. no diagnostic elsewhere can reasonably be attributed to commit `232d3c2f` after reviewing the complete diagnostic set and the exact four-file implementation diff.

If any Capture A condition fails or cannot be proven, stop. Do not repair TypeScript debt, alter compiler configuration, or infer acceptability.

### Capture B: reproduce the complete baseline

Without changing tracked files, ignored dependency state, compiler version, environment, or command arguments, run the same command again and capture complete output separately.

Capture B is acceptable only when:

1. it also contains exactly `173` normalized diagnostic tuples;
2. its complete normalized tuple multiset matches Capture A exactly, including path, line, column, code, message, and multiplicity;
3. its changed-file subset is exactly the same four tuples;
4. it contains zero forbidden identifier mentions;
5. no new or implementation-attributable diagnostic appears.

When both captures satisfy every condition, report the command as:

`ran twice; fresh 173-diagnostic baseline established and reproduced; no climate-contract or implementation-attributable diagnostics`

Never report the workspace audit as passed.

The broad JSON-import, Node typing, JSX/root-config, target/lib, module-resolution, and strict optional-property backlog remains a separate cleanup route. Do not repair it here.

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output, current handoff, this prompt, the route register, `docs/design/current-planning-anchor-reconciliation.md`, `docs/dev/project-vision-and-continuity-brief.md`, `docs/design/validation-command-matrix-plan.md`, `docs/design/validation-source-map.md`, `docs/dev/typecheck-blocker-triage-plan.md`, and `docs/design/static-content-expansion-program.md`.
2. Run branch status, fetch, and fast-forward pull. Require a clean working tree and record the starting commit.
3. Confirm `232d3c2f466e3ec18e620e29a47f4466ae05b84d`, `1d6880f5a2d7bcdc5c843e64b50bcd25d6883525`, and `0f677b78e76905ef8d37eb8b4965b127d93d4db1` are ancestors of the current branch. Inspect every later change before proceeding.
4. Inspect commit `232d3c2f466e3ec18e620e29a47f4466ae05b84d` and require exactly the four authorized files and intended changes.
5. Confirm the schema, focused climate assertion, and BOM commits remain ancestors with their intended scopes.
6. Confirm no complete prior non-pretty capture exists and record that the prior output was truncated; do not treat this as a blocker under this corrected prompt.
7. Confirm Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` resolves and is the exact held parent prompt.

## Allowed Changes

Before every validation condition succeeds, make no implementation, content, schema, test, TypeScript, config, dependency, generator, UI, runtime, save, migration, gameplay, monster, ecology, or loot change.

Do not edit `package.json`, `tsconfig.json`, app configs, compiler settings, or the 173-diagnostic backlog.

Temporary Capture A and Capture B files must remain outside the repository or in an already ignored temporary location and must not be committed.

After successful validation only, update the authorized coordination files and restore the exact parent prompt.

## Required Validation

### 1. Reconfirm green gates

Run:

`node --test tests/unit/region-first-world-data.test.mjs tests/unit/slug-content.test.mjs`

Require `5/5` passing tests unless a legitimate current count change is fully explained and contains no failure.

Run:

`npm.cmd run tool:content-lint`

Require success with `67` files checked unless a legitimate current registration-count change is fully explained.

### 2. Establish and reproduce the workspace audit baseline

Create Capture A and Capture B exactly as specified above. Require every candidate-baseline, attribution, forbidden-identifier, and complete-multiset reproduction condition.

Include the exact four changed-file tuples and the two capture file locations in the local run notes. Do not commit the raw captures.

### 3. Run the deferred parent baseline

Run:

`node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

Require `146/146` passing tests unless a legitimate current count change is fully explained and contains no failure.

### 4. Diff and hygiene gates

Require:

- `git diff --exit-code 895c02df40332c813a8403bd489af6184111ccba..66f12fd6f649f8f218f7f49fc721a8fe545a7a01 -- packages/content` reports no content change in the BOM repair range;
- the complete content diff after `e71f8f6b625f7b6744492cc8b19ab695f788d89c` changes only `packages/content/base/world/regions.json` and exactly the five authorized scalar-to-singleton-array migrations;
- commit `232d3c2f466e3ec18e620e29a47f4466ae05b84d` changes exactly four authorized files;
- no unrelated JSON byte, indentation, ordering, escape sequence, or record change;
- the integration script and UI compatibility normalization remain unchanged;
- conflict-marker and trailing-whitespace scans pass;
- `git diff --check` passes;
- final changed-path and full-diff inspection passes;
- final working tree is clean before coordination changes;
- no Capture A or Capture B artifact is tracked or staged.

Do not run the full test suite, builds, package installation, servers, generators, or gameplay.

## Failure Behavior

If either capture differs from the required `173`/four-diagnostic/zero-forbidden-identifier properties, if the complete tuple multisets differ, if any of the four diagnostics cannot be proven unrelated to `232d3c2f`, if another diagnostic is attributable to the implementation, or if any green gate fails:

- do not restore the parent prompt;
- do not update completion coordination;
- do not edit implementation or broad TypeScript debt;
- report the exact command, exit code, total diagnostic count, four changed-file tuples, forbidden-identifier matches, attribution evidence, tuple-set comparison result, and smallest follow-up;
- leave this corrected `0.6.6.5` prompt active.

## Allowed Coordination Changes After Successful Validation Only

Update only:

- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/project-vision-and-continuity-brief.md`;
- `docs/dev/current-codex-prompt.md`, solely by restoring exact blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Required Completion Updates

On success, record:

- starting and ending commits;
- the `0.6.6.2` and `0.6.6.3` fail-closed results;
- implementation commit `232d3c2f466e3ec18e620e29a47f4466ae05b84d` and its exact four-file scope;
- focused tests `5/5`;
- content lint `67`;
- workspace audit: two nonzero runs, exactly `173` diagnostics each, identical complete normalized tuple multisets, the exact four changed-file tuples, zero forbidden identifier mentions, and no implementation-attributable diagnostic;
- parent baseline `146/146`;
- BOM-range content identity and exact five-record content diff;
- hygiene results and confirmation that temporary captures were not committed;
- confirmation that no broad TypeScript cleanup, config, dependency, generator, UI, runtime, save, gameplay, monster, ecology, or loot change occurred;
- restored parent-prompt blob;
- next run: exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`.

Update coordination so it agrees that:

- `0.6.6.1` landed the BOM reader repair;
- `0.6.6.2` failed closed on the initial climate mismatch;
- `0.6.6.3` landed partial contract repairs and failed closed on bounded migration evidence;
- `0.6.6.4` landed the exact four-file implementation and passed focused tests/content lint;
- two unexecuted `0.6.6.5` prompt variants were superseded because one contradicted the four-diagnostic baseline and the other required a nonexistent complete prior capture;
- corrected `0.6.6.5` established and reproduced a fresh complete baseline, finished the remaining green gates, and restored the parent prompt;
- `0.6.6` becomes active only after every required result is recorded;
- `0.6.7` remains reserved after accepted `0.6.6`.

## Exact Parent Restoration

After every condition passes, restore `docs/dev/current-codex-prompt.md` directly from Git blob:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

Require:

`git hash-object docs/dev/current-codex-prompt.md`

returns exactly:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

Do not add a wrapper, completion note, mode line, or commentary to the restored prompt.

## Stop Condition

After validated completion documentation and exact parent-prompt restoration are committed:

- stop;
- do not execute `0.6.6` in the same run;
- do not begin `0.6.7`;
- do not merge, rebase, or modify the separate parallel `0.7` readiness-audit branch.

The next Codex pass is the restored exact:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`
