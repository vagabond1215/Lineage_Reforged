# Current GPT Handoff

Date: 2026-07-27

## Status

- Latest completed primary remains `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains the active parent primary and has not begun authoring.
- The narrow BOM repair implementation landed at commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` and changes only `tests/unit/region-first-world-data.test.mjs` and `tests/unit/slug-content.test.mjs`.
- Local and `origin/master` were synchronized at `9c7eb636af284905a14dd6162bc3ba49edc43fbd` for the first `0.6.6.2` validation attempt.
- Repair-scope and `packages/content` byte-identity gates passed.
- The mandatory focused command reported `4/5` passing tests.
- The remaining failure is a pre-existing contract mismatch: authored `environmentProfile.climateTendencies` values are arrays, while the focused assertion, region schema, and one engine content interface require a scalar string.
- `0.6.6.2` correctly failed closed: no files changed locally, the parent prompt was not restored, and `0.6.6` was not executed.
- Active support prompt: `Version 0.6.6.3 - Region Climate Tendencies Contract Repair And BOM Acceptance`.
- Active prompt blob: `ab1bc43f258258a91ad478d8de8fefdeadfe7a4f`.
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

The exact repair range must contain only the two named test files and no content change. No broad `trim()`, content normalization, production parser, dependency, assertion weakening, or unrelated test change is allowed.

## Climate Contract Evidence

The canonical contract is a non-empty array of normalized string identifiers:

- `packages/content/base/world/regions.json` authors multiple values per region;
- `scripts/integrate_region_first_world_data.ps1` intentionally assigns `Split-List $row.climateTendencies`;
- `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts` already normalizes array-or-string input and presents multiple values;
- `packages/shared/types/src/settlement-institutions.ts` already admits arrays;
- the stale scalar requirements are in the region schema, focused test assertion, and engine content interface.

Do not rewrite the content as a scalar. Align the contract surfaces to `string[]` and preserve every content byte.

## Exact `0.6.6.3` Scope

Before validation succeeds, implementation edits are limited to:

- `packages/schemas/world/region.schema.json`;
- `tests/unit/region-first-world-data.test.mjs`;
- `packages/engines/civilization-engine/src/content.ts`;
- `packages/shared/types/src/settlement-institutions.ts`, only if the compatibility union can be safely narrowed.

The pass must not edit:

- JSON content;
- the integration script;
- UI normalization code;
- runtime behavior;
- persistence, saves, or migrations;
- dependencies, assets, or generated output;
- gameplay or the parent `0.6.6` content package.

After successful validation only, it may update current output, this handoff, the route register, planning-anchor reconciliation, strategic continuity brief, and restore the exact parent prompt.

## Required Validation

1. Verify the BOM commit and exact two-file repair scope.
2. Confirm the failed focused result is solely the scalar-versus-array mismatch.
3. Align the schema, focused assertion, and static TypeScript contracts to a non-empty normalized string array.
4. Run:

   `node --test tests/unit/region-first-world-data.test.mjs tests/unit/slug-content.test.mjs`

5. Require `5/5` passing tests unless a legitimate count change is fully explained.
6. Run:

   `npm.cmd run tool:content-lint`

7. Run:

   `npm.cmd run typecheck:workspace`

8. Run:

   `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

9. Require the parent baseline at `146/146` unless a legitimate count change is fully explained.
10. Prove `packages/content` remains byte-identical from `895c02df40332c813a8403bd489af6184111ccba`.
11. Run conflict-marker, trailing-whitespace, `git diff --check`, changed-path, and full-diff checks.
12. Restore the exact parent prompt only after every gate passes.
13. Stop without running `0.6.6` in the same pass.

## Failure Behavior

If repository evidence contradicts the array contract or any validation fails, do not restore the parent prompt or update completion coordination. Do not broaden the repair. Leave `0.6.6.3` active and report the exact blocker.

## Near-Term Sequence

1. complete `0.6.6.3`, accept the BOM repair, and restore the exact parent prompt;
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

`Version 0.6.6.3 - Region Climate Tendencies Contract Repair And BOM Acceptance`

Active prompt blob:

`ab1bc43f258258a91ad478d8de8fefdeadfe7a4f`

Suggested commit:

`fix(content): align climate tendencies and accept bom repair`
