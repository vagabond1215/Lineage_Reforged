# Current GPT Handoff

Date: 2026-07-27

## Status

- Latest completed primary remains `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains the active parent primary and has not begun authoring.
- The BOM reader repair landed at `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` and remains limited to the two intended test readers.
- `0.6.6.2` failed closed at `4/5` focused tests and exposed the initial climate scalar-versus-array contract mismatch.
- `0.6.6.3` landed two partial commits: schema repair `56932eecedd7b28216b23cb5bf211fea7b01df46` and focused climate assertion repair `e71f8f6b625f7b6744492cc8b19ab695f788d89c`.
- Local and `origin/master` were synchronized at `e71f8f6b625f7b6744492cc8b19ab695f788d89c` for the blocked `0.6.6.3` validation attempt.
- Focused tests remained `4/5`.
- The current failing assertion expects `populationProfile.populationCapacity`, while the schema and all 37 non-ocean records use `simulationProfile.populationCapacity`.
- Five live records still carry scalar `climateTendencies` values and require exact singleton-array migration.
- `0.6.6.3` correctly stopped on broader migration evidence and validation failure: no further local files changed, the parent prompt was not restored, and `0.6.6` was not executed.
- Active support prompt: `Version 0.6.6.4 - Region Climate Data Migration, Population Assertion Repair, And BOM Acceptance`.
- Active prompt blob: `1fce964f515a64f0b7e97ea96a5604e858d7b9f0`.
- Exact parent prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Current Planning Precedence

Use current execution sources in this order:

1. `docs/dev/current-codex-prompt.md`;
2. this handoff;
3. `docs/dev/current-codex-output.md`;
4. `docs/dev/historical-version-and-deferred-route-register.md`;
5. the most specific focused decision;
6. `docs/design/current-planning-anchor-reconciliation.md` for stale roadmap/sequence current-header conflicts;
7. roadmap and sequenced plan for non-conflicting historical and long-term context.

## BOM Repair Evidence

Pinned pre-repair coordination head:

`895c02df40332c813a8403bd489af6184111ccba`

Pinned repair commit:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Accepted BOM operation:

```js
JSON.parse(raw.replace(/^\uFEFF/, ""))
```

The exact BOM repair range must remain limited to the two named test files and contain no content change.

## Canonical Region Contracts

### Climate tendencies

The canonical field is a non-empty array of normalized string identifiers.

Exact migrations:

- `region.verdant_thalos`: `mild` -> `["mild"]`;
- `region.jade_expanse`: `temperate_open_country` -> `["temperate_open_country"]`;
- `region.sailors_verge`: `mild_maritime` -> `["mild_maritime"]`;
- `region.stormcap_coast`: `storm_washed_maritime` -> `["storm_washed_maritime"]`;
- `region.myridian_chain`: `mild_wet_maritime` -> `["mild_wet_maritime"]`.

Do not rename or reinterpret any value. The integration script already uses `Split-List`; do not change it. The UI compatibility normalization may remain unchanged.

### Population capacity

Canonical absolute capacity is `simulationProfile.populationCapacity`.

Do not add `populationCapacity` to `populationProfile`. Keep `populationCapacityMillions` as the existing million-scale presentation field.

## Exact `0.6.6.4` Scope

Before validation succeeds, implementation edits are limited to:

- `packages/content/base/world/regions.json`, solely for the five exact singleton-array migrations;
- `tests/unit/region-first-world-data.test.mjs`, solely to move the capacity assertion to `simulationProfile`;
- `packages/engines/civilization-engine/src/content.ts`, solely to change the climate type to `string[]`;
- `packages/shared/types/src/settlement-institutions.ts`, solely to narrow `string[] | string` to `string[]` when type-safe.

The landed region schema and climate-array assertion must remain intact.

The pass must not edit any other content, generator, UI normalization, runtime behavior, persistence, save, migration, dependency, asset, generated output, gameplay, monster, ecology, or loot file.

## Required Validation

1. Verify the BOM commit and the two partial `0.6.6.3` commits.
2. Confirm exactly the five pinned scalar records and exact values.
3. Confirm the current focused failure is the stale population-capacity path.
4. Apply only the authorized migration, assertion, and static-type changes.
5. Run:

   `node --test tests/unit/region-first-world-data.test.mjs tests/unit/slug-content.test.mjs`

6. Require `5/5` passing tests unless a legitimate count change is fully explained.
7. Run:

   `npm.cmd run tool:content-lint`

8. Run:

   `npm.cmd run typecheck:workspace`

9. Run:

   `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

10. Require the parent baseline at `146/146` unless a legitimate count change is fully explained.
11. Prove the BOM repair range still has no content change.
12. Prove the post-`e71f8f6b` content diff changes only `regions.json` and exactly the five pinned shapes.
13. Run conflict-marker, trailing-whitespace, `git diff --check`, changed-path, and full-diff checks.
14. Restore the exact parent prompt only after every gate passes.
15. Stop without running `0.6.6` in the same pass.

## Failure Behavior

If the pinned count or values differ, a legitimate scalar producer exists, or any validation fails, do not restore the parent prompt or update completion coordination. Do not broaden the migration. Leave `0.6.6.4` active and report the exact blocker.

## Near-Term Sequence

1. complete `0.6.6.4`, accept the BOM repair, and restore the exact parent prompt;
2. run exact `0.6.6` in a separate Codex pass;
3. run `0.6.7 - Cross-Content Coherence And Coverage Audit`;
4. run Geographic Knowledge Taxonomy And Location Recognition Contract Plan;
5. run Activity Resolution Existing-System Reuse Audit;
6. run Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision;
7. run bounded physiology/first-aid research only before the first executable or balance-bearing lethal-process catalog;
8. proceed to separately authorized owner-specific implementation packages.

## Preserved Authorities And Known Gaps

- occurrence identity, commitment, correction, and consequence idempotency remain design authority but are not broadly implemented;
- campaign/save topology and technical recovery remain design authority but are not implemented in live save envelopes;
- Normal, Committed, Ironbound, Mortal Crisis, resurrection, and final closure remain controlling documentation authority;
- current HP zero may still enter legacy terminal archival and save deletion;
- generic event ids remain collision-prone;
- current random/hash mechanisms are not named uncertainty-channel authority;
- no active functional/lethal/care receipt, injury instance, body/restoration runtime, or correction tooling exists;
- no dynamic monster/ecology/loot behavior is authorized;
- the isolated `0.7` readiness-audit branch is noncontrolling and must not be merged by this support pass.

## Active Prompt

`Version 0.6.6.4 - Region Climate Data Migration, Population Assertion Repair, And BOM Acceptance`

Active prompt blob:

`1fce964f515a64f0b7e97ea96a5604e858d7b9f0`

Suggested implementation commit:

`fix(content): complete region climate array migration`
