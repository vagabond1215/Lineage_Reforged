# Current Codex Prompt

## Run Identity

`Version 0.6.6.4 - Region Climate Data Migration, Population Assertion Repair, And BOM Acceptance`

Parent primary:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`

Predecessor support runs:

- `Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`;
- `Version 0.6.6.2 - BOM Repair Post-Validation And Parent Prompt Restoration`;
- `Version 0.6.6.3 - Region Climate Tendencies Contract Repair And BOM Acceptance`.

Run classification: four-segment support suffix attached to `0.6.6`.

Milestone impact: `supports_current_band`.

Suggested implementation commit:

`fix(content): complete region climate array migration`

## Purpose

The BOM reader repair remains narrow and correct. `0.6.6.2` failed closed at `4/5` focused tests and exposed a stale scalar climate contract. `0.6.6.3` then landed two partial repair commits:

- `56932eecedd7b28216b23cb5bf211fea7b01df46` changes the region schema to require a non-empty normalized string array;
- `e71f8f6b625f7b6744492cc8b19ab695f788d89c` changes the focused climate assertion to require that array shape.

Local and `origin/master` were synchronized at `e71f8f6b625f7b6744492cc8b19ab695f788d89c`. The focused command still reported `4/5` passing tests. Repository inspection proved two additional conflicts that `0.6.6.3` was not authorized to repair:

1. five live non-ocean region records still store one normalized climate identifier as a scalar string, while the landed schema and focused assertion now require arrays exclusively;
2. the focused test asserts `populationProfile.populationCapacity`, while the schema and all 37 non-ocean records place canonical absolute capacity at `simulationProfile.populationCapacity`. `populationProfile` instead carries density and million-scale presentation fields.

`0.6.6.3` correctly stopped on broader migration evidence and validation failure. No further files changed, the parent prompt was not restored, and `0.6.6` was not executed.

This pass authorizes the smallest exact data-shape migration, corrects the stale population assertion, aligns the remaining static TypeScript contracts, reruns the complete BOM acceptance gate, restores the exact parent `0.6.6` prompt only after success, and stops.

## Pinned Repository Evidence

Starting head and blocked `0.6.6.3` head:

`e71f8f6b625f7b6744492cc8b19ab695f788d89c`

Landed partial schema repair:

`56932eecedd7b28216b23cb5bf211fea7b01df46`

Landed partial focused-test repair:

`e71f8f6b625f7b6744492cc8b19ab695f788d89c`

BOM repair commit:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Pre-repair coordination head:

`895c02df40332c813a8403bd489af6184111ccba`

Blocked predecessor prompt blob:

`ab1bc43f258258a91ad478d8de8fefdeadfe7a4f`

Exact parent `0.6.6` prompt blob to restore after success:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

The exact BOM repair range `895c02df40332c813a8403bd489af6184111ccba..66f12fd6f649f8f218f7f49fc721a8fe545a7a01` must still change only:

- `tests/unit/region-first-world-data.test.mjs`;
- `tests/unit/slug-content.test.mjs`.

The accepted BOM operation remains:

```js
JSON.parse(raw.replace(/^\uFEFF/, ""))
```

## Canonical Contract Decisions

### Climate tendencies

`environmentProfile.climateTendencies` is a non-empty array of normalized string identifiers.

Exactly five live records require scalar-to-singleton-array migration:

- `region.verdant_thalos`: `"mild"` -> `["mild"]`;
- `region.jade_expanse`: `"temperate_open_country"` -> `["temperate_open_country"]`;
- `region.sailors_verge`: `"mild_maritime"` -> `["mild_maritime"]`;
- `region.stormcap_coast`: `"storm_washed_maritime"` -> `["storm_washed_maritime"]`;
- `region.myridian_chain`: `"mild_wet_maritime"` -> `["mild_wet_maritime"]`.

This is a shape-only migration. Do not rename, split, merge, reinterpret, or otherwise rewrite any identifier.

`scripts/integrate_region_first_world_data.ps1` already produces arrays through `Split-List`; do not edit it. The UI compatibility normalization may remain; do not edit it.

### Population capacity

Canonical absolute population capacity belongs at:

`simulationProfile.populationCapacity`

The focused test must assert that location. Do not add or copy `populationCapacity` into `populationProfile`. Preserve `populationCapacityMillions` as the existing presentation-scale field.

### Static TypeScript contracts

- `packages/engines/civilization-engine/src/content.ts` must change `RegionContentRecord.environmentProfile.climateTendencies` from `string` to `string[]`.
- `packages/shared/types/src/settlement-institutions.ts` may narrow `InstitutionRegionRecord.environmentProfile.climateTendencies` from `string[] | string` to `string[]` only if the workspace typecheck confirms no legitimate scalar producer remains.

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output, current handoff, this prompt, the route register, `docs/design/current-planning-anchor-reconciliation.md`, `docs/dev/project-vision-and-continuity-brief.md`, and `docs/design/static-content-expansion-program.md`.
2. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state. Preserve unrelated work.
3. Confirm `e71f8f6b625f7b6744492cc8b19ab695f788d89c` is an ancestor of the current branch and inspect every later change before proceeding.
4. Confirm the two partial commits have exactly their intended schema and focused-test scope. Do not amend or rewrite them merely to consolidate history.
5. Confirm commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` remains an ancestor and still has the exact two-test-file BOM scope.
6. Reproduce or inspect the focused failure and confirm the current failing assertion is the stale `populationProfile.populationCapacity` path.
7. Enumerate all live `climateTendencies` values. Require exactly the five scalar records and exact scalar values listed above. Stop without implementation edits if the count, ids, or values differ.
8. Confirm the region schema requires `simulationProfile.populationCapacity` and does not define `populationProfile.populationCapacity`.
9. Inspect all TypeScript and UI references for a legitimate scalar producer or scalar-only protocol. Stop without implementation edits if one exists.
10. Confirm Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` resolves and is the exact held `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt.

## Allowed Implementation Changes

Before validation succeeds, edit only:

- `packages/content/base/world/regions.json`, solely for the five exact scalar-to-singleton-array changes listed above;
- `tests/unit/region-first-world-data.test.mjs`, solely to move the stale population-capacity assertion from `populationProfile` to `simulationProfile`; preserve the landed climate-array assertions and BOM reader operation unchanged;
- `packages/engines/civilization-engine/src/content.ts`, solely to change the climate type from `string` to `string[]`;
- `packages/shared/types/src/settlement-institutions.ts`, solely to narrow `string[] | string` to `string[]` when type-safe.

The landed region schema change is already correct. Do not modify `packages/schemas/world/region.schema.json` unless inspection proves the landed partial commit itself is malformed; if so, stop and report rather than broadening this pass.

No other content record, JSON formatting, generator, UI normalization code, runtime behavior, save, migration, dependency, asset, generated output, gameplay, monster, ecology, or loot file may change.

Do not weaken or remove any unrelated assertion. Do not use `trim()` or alter the accepted BOM reader operation.

## Required Validation

Run the repaired focused command:

`node --test tests/unit/region-first-world-data.test.mjs tests/unit/slug-content.test.mjs`

Require `5/5` passing tests unless a legitimate current test-count change is fully explained and contains no failure.

Run normal content lint:

`npm.cmd run tool:content-lint`

Run the relevant workspace typecheck:

`npm.cmd run typecheck:workspace`

Rerun the exact parent baseline:

`node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

Acceptance requirements:

- every named test passes;
- the parent baseline passes at `146/146` unless a legitimate current test-count change is fully explained and contains no failure;
- normal content lint passes at 67 checked files unless a legitimate current-baseline count change is fully explained;
- workspace typecheck passes;
- `git diff --exit-code 895c02df40332c813a8403bd489af6184111ccba..66f12fd6f649f8f218f7f49fc721a8fe545a7a01 -- packages/content` still reports no content change in the BOM repair range;
- the complete content diff after `e71f8f6b625f7b6744492cc8b19ab695f788d89c` changes only `packages/content/base/world/regions.json` and contains exactly the five scalar-to-singleton-array migrations listed above;
- no unrelated JSON byte, indentation, ordering, escape sequence, newline convention, or record changes;
- the focused test asserts `simulationProfile.populationCapacity` and no longer asserts the nonexistent population-profile field;
- the engine static type requires `string[]`;
- the shared static type no longer advertises a scalar producer when the typecheck proves narrowing safe;
- the integration script and UI compatibility normalization remain unchanged;
- conflict-marker and trailing-whitespace searches pass;
- `git diff --check` passes;
- changed-path and full-diff inspection confirms only the authorized implementation and later coordination files changed.

Do not run the full test suite, builds, package installation, servers, generators, or gameplay.

## Failure Behavior

If repository evidence differs from the pinned five-record migration, a legitimate scalar producer exists, or any validation fails:

- do not restore the parent prompt;
- do not update completion coordination;
- do not broaden the migration or repair;
- do not author monster, ecology, or loot content;
- report the exact command, failure, changed-path evidence, and smallest follow-up;
- leave this `0.6.6.4` prompt active.

Run-owned implementation edits may remain uncommitted only when necessary to show the exact failing state. Do not commit an additional partial or red repair.

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
- the `0.6.6.2` fail-closed result;
- the two partial `0.6.6.3` commits;
- the blocked `0.6.6.3` result: five scalar records, stale population assertion, focused tests at `4/5`, no parent restoration;
- exact implementation changed paths and the five migrated record ids;
- final focused-test, content-lint, workspace-typecheck, parent-baseline, content-diff, and hygiene results;
- confirmation that no generator, UI, runtime behavior, save, dependency, gameplay, monster, ecology, or loot file changed;
- restored parent-prompt blob;
- next run: exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`.

Update coordination so it agrees that:

- `0.6.6.1` landed the BOM-only reader repair;
- `0.6.6.2` executed fail-closed and exposed the initial climate contract mismatch;
- `0.6.6.3` landed two partial contract commits, then failed closed on bounded content migration and a second stale assertion;
- `0.6.6.4` completed the exact migration and BOM acceptance gate;
- `0.6.6` becomes active and unblocked only after every validation succeeds;
- `0.6.7` remains reserved after accepted `0.6.6`;
- no static monster/ecology/loot content was authored by any support suffix.

## Exact Parent Restoration

After every gate passes, restore `docs/dev/current-codex-prompt.md` directly from Git blob:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

Require:

`git hash-object docs/dev/current-codex-prompt.md`

returns exactly:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

Do not add a wrapper, completion note, mode line, or commentary to the restored prompt.

## Stop Condition

After the validated implementation, completion documentation, and exact parent-prompt restoration are committed:

- stop;
- do not execute `0.6.6` in the same run;
- do not begin `0.6.7`;
- do not merge, rebase, or modify the separate parallel `0.7` readiness-audit branch.

The next Codex pass is the restored exact:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`
