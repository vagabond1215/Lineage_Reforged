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

`docs(validation): accept climate repair against known typecheck baseline`

## Purpose

The region climate/population implementation is committed at:

`232d3c2f466e3ec18e620e29a47f4466ae05b84d`

That commit changes exactly:

- `packages/content/base/world/regions.json`;
- `packages/engines/civilization-engine/src/content.ts`;
- `packages/shared/types/src/settlement-institutions.ts`;
- `tests/unit/region-first-world-data.test.mjs`.

The committed implementation performs exactly the five authorized scalar-to-singleton-array migrations, moves the stale population-capacity assertion to `simulationProfile.populationCapacity`, changes the engine climate contract to `string[]`, and narrows the shared compatibility union to `string[]`.

The first `0.6.6.4` validation attempt established:

- local and `origin/master` synchronized at `232d3c2f466e3ec18e620e29a47f4466ae05b84d`;
- focused tests passed `5/5`;
- normal content lint passed with `67` files checked;
- `npm.cmd run typecheck:workspace` exited nonzero with the same broad, unrelated `173`-diagnostic TypeScript baseline;
- exactly four known unrelated diagnostics were present across the two changed TypeScript files;
- the `146`-test parent baseline was not run after that failure;
- the exact parent prompt was not restored;
- no files changed during the failed validation attempt.

The first installed `0.6.6.5` prompt incorrectly required zero diagnostics in the two changed TypeScript files. It was not executed. Local and `origin/master` were synchronized at `1d6880f5a2d7bcdc5c843e64b50bcd25d6883525`, and the worktree remained clean when this acceptance-gate correction was requested.

The repository's approved validation authorities classify `npm.cmd run typecheck:workspace` as a known-failing audit, not a universal green gate:

- `docs/design/validation-command-matrix-plan.md` says the command is expected to expose accepted broad NodeNext/config/strictness debt and should block narrow work only on new or changed failures;
- `docs/design/validation-source-map.md` records that the workspace audit is already non-green on broad existing debt;
- `docs/dev/typecheck-blocker-triage-plan.md` explicitly says future prompts must not require broad workspace typecheck success for narrow feature work until the separate cleanup tracks are resolved.

This pass must classify the current audit correctly, allow only the exact four known unrelated changed-file diagnostics from the clean `0.6.6.4` baseline capture, prove that the climate/population change introduced no new or contract-related diagnostic, finish the deferred green gates, restore the exact parent prompt only after success, and stop.

## Pinned Repository Evidence

Starting implementation head:

`232d3c2f466e3ec18e620e29a47f4466ae05b84d`

Pre-implementation `0.6.6.4` coordination head:

`047bc073900eacae9892b01994796ad9011b5b24`

First installed but unexecuted `0.6.6.5` coordination head:

`1d6880f5a2d7bcdc5c843e64b50bcd25d6883525`

Landed partial schema repair:

`56932eecedd7b28216b23cb5bf211fea7b01df46`

Landed partial focused climate assertion repair:

`e71f8f6b625f7b6744492cc8b19ab695f788d89c`

BOM reader repair:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Pre-repair coordination head:

`895c02df40332c813a8403bd489af6184111ccba`

Blocked predecessor prompt blob:

`1fce964f515a64f0b7e97ea96a5604e858d7b9f0`

Superseded unexecuted `0.6.6.5` prompt blob:

`ff436c355268d21783f2dd5d87835e75b7542d92`

Exact parent `0.6.6` prompt blob to restore after success:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

Accepted BOM operation:

```js
JSON.parse(raw.replace(/^\uFEFF/, ""))
```

## Validation Classification Decision

`npm.cmd run typecheck:workspace` is a **known-failing audit** for this pass, not a green gate.

The authoritative changed-file baseline is the complete non-pretty `173`-diagnostic output captured from the clean `0.6.6.4` validation run at implementation head `232d3c2f466e3ec18e620e29a47f4466ae05b84d`.

Before rerunning the command:

1. locate that complete baseline capture;
2. extract the exact four diagnostic tuples reported in:
   - `packages/engines/civilization-engine/src/content.ts`;
   - `packages/shared/types/src/settlement-institutions.ts`;
3. preserve, for each tuple:
   - repository-relative path;
   - line;
   - column;
   - TypeScript diagnostic code;
   - complete diagnostic message;
4. record those four tuples verbatim in the run notes before comparison.

Normalize only:

- the absolute workspace prefix to the repository-relative path;
- CRLF versus LF line endings in the captured output.

Do not normalize line numbers, columns, diagnostic codes, spacing inside messages, quoted symbols, or message text.

If the complete prior capture is unavailable, truncated, or does not unambiguously yield exactly four changed-file diagnostic tuples, stop without further validation or coordination changes. Do not reconstruct the tuples from memory or infer them from source.

The rerun audit is acceptable only when all of the following are true:

1. it reports exactly `173` TypeScript diagnostics under the same installed dependency and compiler state;
2. it reports exactly four diagnostics across the two changed TypeScript files;
3. those four normalized tuples match the pinned baseline tuples exactly;
4. no additional diagnostic is reported in either changed TypeScript file;
5. no diagnostic message anywhere mentions:
   - `climateTendencies`;
   - `RegionContentRecord`;
   - `InstitutionRegionRecord`;
6. no new or changed diagnostic can reasonably be attributed to commit `232d3c2f466e3ec18e620e29a47f4466ae05b84d`;
7. the command is reported as `ran; accepted baseline unchanged`, never as passed.

Any mismatch in total count, changed-file diagnostic count, tuple identity, dependency/compiler state, forbidden identifier search, diagnostic family, or attribution is unexpected and blocks completion.

Do not repair the broad TypeScript backlog in this pass. The JSON-import, Node typing, JSX/root-config, target/lib, module-resolution, and strict optional-property tracks remain separate cleanup routes.

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output, current handoff, this prompt, the route register, `docs/design/current-planning-anchor-reconciliation.md`, `docs/dev/project-vision-and-continuity-brief.md`, `docs/design/validation-command-matrix-plan.md`, `docs/design/validation-source-map.md`, `docs/dev/typecheck-blocker-triage-plan.md`, and `docs/design/static-content-expansion-program.md`.
2. Run branch status, fetch, and fast-forward pull. Require a clean working tree and record the starting commit.
3. Confirm `232d3c2f466e3ec18e620e29a47f4466ae05b84d` and `1d6880f5a2d7bcdc5c843e64b50bcd25d6883525` are ancestors of the current branch and inspect every later change before proceeding.
4. Inspect commit `232d3c2f466e3ec18e620e29a47f4466ae05b84d` and require exactly the four authorized files and exact intended changes.
5. Confirm the schema commit `56932eecedd7b28216b23cb5bf211fea7b01df46`, focused climate assertion commit `e71f8f6b625f7b6744492cc8b19ab695f788d89c`, and BOM commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` remain ancestors with their intended scopes.
6. Confirm the complete prior non-pretty typecheck capture exists and pin the exact four changed-file diagnostic tuples before rerunning the audit.
7. Confirm Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` resolves and is the exact held `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt.

## Allowed Changes

Before every validation gate succeeds, make no implementation, content, schema, test, TypeScript, config, dependency, generator, UI, runtime, save, migration, gameplay, monster, ecology, or loot change.

Do not edit `package.json`, `tsconfig.json`, app configs, compiler settings, or the 173-error backlog.

After successful validation only, update the authorized coordination files and restore the exact parent prompt as specified below.

## Required Validation

### 1. Reconfirm green gates already observed

Run:

`node --test tests/unit/region-first-world-data.test.mjs tests/unit/slug-content.test.mjs`

Require `5/5` passing tests unless a legitimate current test-count change is fully explained and contains no failure.

Run:

`npm.cmd run tool:content-lint`

Require success with `67` files checked unless a legitimate current registration-count change is fully explained.

### 2. Classify the workspace audit

Capture the complete rerun output to a temporary file outside the repository or an already ignored temporary path:

`npm.cmd run typecheck:workspace -- --pretty false`

Require the exact baseline classification decision above:

- nonzero exit is expected;
- exactly `173` total diagnostics;
- exactly four diagnostics across the two changed TypeScript files;
- the four normalized path/line/column/code/message tuples exactly match the pinned clean `0.6.6.4` capture;
- no additional diagnostic appears in either changed TypeScript file;
- zero diagnostic messages mention the three pinned climate contract identifiers;
- no new, changed, or attributable diagnostic family.

Record the command as `ran; accepted baseline unchanged` when all conditions hold. Include the four exact diagnostic tuples in the completion evidence.

### 3. Run the deferred parent baseline

Run:

`node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

Require `146/146` passing tests unless a legitimate current test-count change is fully explained and contains no failure.

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
- final working tree is clean before coordination changes.

Do not run the full test suite, builds, package installation, servers, generators, or gameplay.

## Failure Behavior

If the prior complete typecheck capture is unavailable, the workspace audit differs from the pinned accepted baseline, any diagnostic mentions or implicates the changed climate contracts, or any green gate fails:

- do not restore the parent prompt;
- do not update completion coordination;
- do not edit implementation or broad TypeScript debt;
- report the exact command, exit code, total diagnostic count, the observed changed-file tuples, the expected pinned tuples when available, relevant forbidden-identifier matches, and smallest follow-up;
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
- the original `0.6.6.2` fail-closed result;
- the two partial `0.6.6.3` commits and blocked result;
- implementation commit `232d3c2f466e3ec18e620e29a47f4466ae05b84d` and its exact four-file scope;
- focused tests `5/5`;
- content lint `67`;
- workspace typecheck audit: nonzero, exactly `173` diagnostics, the exact four pinned changed-file diagnostic tuples unchanged, zero forbidden climate-contract identifier mentions, and no diagnostic attributable to the implementation;
- parent baseline `146/146`;
- BOM-range content identity and exact five-record post-`e71f8f6b` content diff;
- hygiene results;
- confirmation that no broad TypeScript cleanup, config, dependency, generator, UI, runtime, save, gameplay, monster, ecology, or loot change occurred;
- restored parent-prompt blob;
- next run: exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`.

Update coordination so it agrees that:

- `0.6.6.1` landed the BOM-only reader repair;
- `0.6.6.2` failed closed on the initial climate contract mismatch;
- `0.6.6.3` landed two partial contract commits and failed closed on bounded migration evidence;
- `0.6.6.4` landed the exact four-file implementation and passed focused tests/content lint, then stopped because it treated the known-failing workspace audit as a green gate;
- the first installed `0.6.6.5` prompt was corrected before execution because it incorrectly required zero diagnostics in the changed TypeScript files;
- corrected `0.6.6.5` accepted only the exact four pinned unrelated changed-file diagnostics, completed the remaining green gates, and restored the parent prompt;
- `0.6.6` becomes active and unblocked only after every required result above is recorded;
- `0.6.7` remains reserved after accepted `0.6.6`.

## Exact Parent Restoration

After every gate passes, restore `docs/dev/current-codex-prompt.md` directly from Git blob:

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
