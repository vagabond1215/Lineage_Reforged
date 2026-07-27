# Current Codex Prompt

## Run Identity

`Version 0.6.6.3 - Region Climate Tendencies Contract Repair And BOM Acceptance`

Parent primary:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`

Predecessor support runs:

- `Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`;
- `Version 0.6.6.2 - BOM Repair Post-Validation And Parent Prompt Restoration`.

Run classification: four-segment support suffix attached to `0.6.6`.

Milestone impact: `supports_current_band`.

Suggested commit:

`fix(content): align climate tendencies and accept bom repair`

## Purpose

The BOM repair implementation landed correctly, and the first `0.6.6.2` local validation attempt remained fail-closed. Local and `origin/master` were synchronized at `9c7eb636af284905a14dd6162bc3ba49edc43fbd`; repair scope and content byte-identity checks passed; the focused command reported `4/5` passing tests. The remaining failure proved a pre-existing region contract mismatch: authored `environmentProfile.climateTendencies` values are arrays, while one focused assertion, the region JSON schema, and one engine content interface require a scalar string.

Repository evidence makes the canonical direction clear:

- `packages/content/base/world/regions.json` authors multiple climate tendency identifiers per region;
- `scripts/integrate_region_first_world_data.ps1` intentionally builds `climateTendencies` through `Split-List`;
- the world-selection UI already normalizes array-or-string values and presents multiple tendencies;
- the shared institution region type already admits arrays;
- the field name is plural and the authored values are independent normalized identifiers.

This pass must repair that stale contract narrowly, rerun the full BOM acceptance gate, complete the support sequence, restore the exact parent `0.6.6` prompt, and stop.

## Pinned Repository Evidence

Starting remote head and failed-validation head:

`9c7eb636af284905a14dd6162bc3ba49edc43fbd`

BOM repair commit:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Pre-repair coordination head:

`895c02df40332c813a8403bd489af6184111ccba`

Blocked predecessor prompt blob:

`5d4aa0a0961065f4cfea0968317b8e7f0df4c190`

Exact parent `0.6.6` prompt blob to restore after success:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

The exact BOM repair range `895c02df40332c813a8403bd489af6184111ccba..66f12fd6f649f8f218f7f49fc721a8fe545a7a01` must still change only:

- `tests/unit/region-first-world-data.test.mjs`;
- `tests/unit/slug-content.test.mjs`.

The accepted BOM operation remains:

```js
JSON.parse(raw.replace(/^\uFEFF/, ""))
```

## Canonical Contract Decision

`environmentProfile.climateTendencies` is a non-empty array of normalized string identifiers.

The repair must align these contract surfaces:

1. `packages/schemas/world/region.schema.json`
   - change `climateTendencies` from a scalar string to an array;
   - require at least one entry;
   - preserve the existing normalized identifier pattern on every item.
2. `tests/unit/region-first-world-data.test.mjs`
   - replace the stale scalar-type assertion with a non-empty array assertion;
   - require every entry to be a normalized non-empty string;
   - preserve the BOM-only reader repair unchanged.
3. `packages/engines/civilization-engine/src/content.ts`
   - change `RegionContentRecord.environmentProfile.climateTendencies` from `string` to `string[]`.
4. `packages/shared/types/src/settlement-institutions.ts`
   - narrow `InstitutionRegionRecord.environmentProfile.climateTendencies` from `string[] | string` to `string[]` if the workspace typecheck confirms no legitimate scalar producer remains.

Do not edit `packages/content/base/world/regions.json`, the integration script, or the UI normalization code. The compatibility normalization may remain even after the canonical type narrows.

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output, current handoff, this prompt, the route register, `docs/design/current-planning-anchor-reconciliation.md`, `docs/dev/project-vision-and-continuity-brief.md`, and `docs/design/static-content-expansion-program.md`.
2. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state. Preserve unrelated work.
3. Confirm `9c7eb636af284905a14dd6162bc3ba49edc43fbd` is an ancestor of the current branch and inspect every later change before proceeding.
4. Confirm commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` remains an ancestor and still has the exact two-test-file BOM scope.
5. Reproduce or inspect the focused failure and confirm the only remaining failure is the `climateTendencies` scalar-versus-array mismatch.
6. Inspect all repository references to `climateTendencies`. Stop without implementation edits if evidence reveals a legitimate scalar producer, a runtime protocol requiring a scalar, or a broader migration need.
7. Confirm Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` resolves and is the exact held `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt.

## Allowed Implementation Changes

Before validation succeeds, edit only:

- `packages/schemas/world/region.schema.json`;
- `tests/unit/region-first-world-data.test.mjs`;
- `packages/engines/civilization-engine/src/content.ts`;
- `packages/shared/types/src/settlement-institutions.ts`, only if narrowing the compatibility union is type-safe.

No content JSON, generator, UI, runtime behavior, save, migration, dependency, asset, generated output, or gameplay file may change.

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
- `git diff --exit-code 895c02df40332c813a8403bd489af6184111ccba..HEAD -- packages/content` reports no content change;
- no JSON content file is normalized, reformatted, or rewritten;
- the schema requires a non-empty array whose items preserve the prior normalized identifier pattern;
- the focused test verifies the canonical array shape without weakening surrounding coverage;
- the engine and shared static types no longer falsely require or advertise a scalar producer;
- conflict-marker and trailing-whitespace searches pass;
- `git diff --check` passes;
- changed-path and full-diff inspection confirms only the authorized implementation and later coordination files changed.

Do not run the full test suite, builds, package installation, servers, generators, or gameplay.

## Failure Behavior

If repository evidence contradicts the canonical decision or any validation fails:

- do not restore the parent prompt;
- do not update completion coordination;
- do not edit content, generators, UI, runtime behavior, saves, dependencies, or gameplay;
- do not opportunistically broaden the repair;
- report the exact command, failure, changed-path evidence, and smallest follow-up;
- leave this `0.6.6.3` prompt active.

Run-owned implementation edits may remain uncommitted only when they are necessary to show the exact failing state. Do not commit a partial or red repair.

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
- the original `0.6.6.2` fail-closed result: `4/5` focused tests with the scalar-versus-array mismatch;
- exact implementation changed paths;
- the final focused-test result;
- content-lint result;
- workspace-typecheck result;
- parent-baseline result;
- content byte-identity result;
- hygiene results;
- confirmation that no content, generator, UI, runtime behavior, save, dependency, or gameplay file changed;
- restored parent-prompt blob;
- next run: exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`.

Update coordination so it agrees that:

- `0.6.6.1` landed the accepted BOM-only reader repair;
- `0.6.6.2` executed fail-closed and exposed the pre-existing region contract mismatch;
- `0.6.6.3` repaired that mismatch and completed the BOM acceptance gate;
- `0.6.6` is active and unblocked only after every validation succeeds;
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
