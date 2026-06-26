# Current GPT Handoff

Source version/run: Version 0.5.238 - Household And Family Schemas And Validators
Date: 2026-06-26
Status: future household/family schemas and focused validator completed; no live household/family content, normal content-lint registration, membership, kinship, account-family bridge, inheritance, property, runtime, UI, storage, rewards, commands, events, or gameplay change

## Authority Rules

- `civilization.households` is approved as future static authored domestic/co-residential identity only.
- `civilization.families` is approved as future static authored socially recognized kin-group identity only.
- Household records use `civilization_household.<slug>` ids and strict records-only wrapper shape.
- Family records use `civilization_family.<slug>` ids and strict records-only wrapper shape.
- Household place anchors and family place associations resolve only to current regions, region localities, and settlements.
- Household place anchors are descriptive domestic/place references only; they are not membership, property, housing access, storage, workplace, service, income, or runtime residence state.
- Family place associations are descriptive identity/place references only; they are not membership, kinship, lineage, marriage, inheritance, property, title, account-family identity, or Family Prestige state.
- Account `familyId` values, synthetic `household.*` settlement projections, player `lineageId`, player/account character ids, surnames, source-run fields, UI labels, generated operators, titles, property labels, and prose do not create or bridge authored household/family authority.
- Household membership, family membership, kinship links, genealogical lineages, clans, noble houses, dynasties, bloodlines, estates, inheritance, marriage, offspring, succession, property ownership, economy/service behavior, Knowledge integration, runtime state, UI, storage, commands, events, rewards, and gameplay remain separate future owners.

## Current Anchor

Latest completed:

- `Version 0.5.238 - Household And Family Schemas And Validators`

Immediate next:

- `Version 0.5.239 - Settlement Economy Schema And Validator`

## Household / Family Validation Result

- Added `packages/schemas/civilization/household.schema.json`.
- Added `packages/schemas/civilization/family.schema.json`.
- Added `tools/content-lint/households-families.mjs` as a pure in-memory structural and semantic validator helper.
- Added `tests/unit/household-family-validation.test.mjs`.
- Registered both new schemas in `tests/unit/schema-files.test.mjs`.
- No `packages/content/base/civilization/households.json` or `packages/content/base/civilization/families.json` file was created.
- No normal content-lint registration for future household/family content was added.
- `docs/dev/tmp-family-lineage-systems-research-2026-06-20.md` remains absent.

## Known Test Notes

- `node --test tests\unit\household-family-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` should remain the normal lint check and should not include household/family future content until a later content seed.
- `node --test tests\unit\schema-files.test.mjs` is expected to parse the new schemas, then still fail on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs.

## Next Route

`Version 0.5.239 - Settlement Economy Schema And Validator` is the next queued run. It should use the `0.5.227` Settlement Economy Schema Decision, keep settlement economy static/descriptive and content-free, and avoid live content, normal lint registration, exact pricing, runtime economy simulation, trade mutation, UI, storage, commands, events, rewards, or gameplay behavior unless a later prompt explicitly authorizes them.
