# Current GPT Handoff

Source version/run: Version 0.5.226 - Household vs Family Schema Decision
Date: 2026-06-22
Status: documentation-only decision completed; no implementation occurred

## Authority Rules

- Future `civilization.households` owns stable authored domestic-group identity; future `civilization.families` owns stable authored socially recognized family identity.
- Future household paths are `packages/content/base/civilization/households.json` and `packages/schemas/civilization/household.schema.json`; future family paths are `packages/content/base/civilization/families.json` and `packages/schemas/civilization/family.schema.json`.
- Both collections use strict records-only wrappers and `planned`/`active`/`retired` lifecycle.
- Static ids are `civilization_household.<slug>` and `civilization_family.<slug>`. They must not collide with mutable account `family.*` ids or synthetic settlement `household.*` ids.
- Household membership belongs to future `civilization.household_memberships`; family membership belongs to future `civilization.family_memberships`; direct kin/care facts belong to future `civilization.kinship_links`.
- Future relation records reference canonical `person.<slug>` identities. Household and family identity records do not embed people or membership arrays.
- Existing account families, Family Prestige, run history, estate state, Bloodlines UI, synthetic settlement operators, and player ancestry/species `lineageId` retain current ownership and are not static civilization authority.
- Genealogical lineages, clans, noble houses, dynasties, bloodlines, marriage, offspring, inheritance, succession, property, reputation, runtime, UI, and storage remain separate and deferred.
- All first-pass household and family records remain descriptive-only.

## Current Anchor

Latest completed:

- `Version 0.5.226 - Household vs Family Schema Decision`

Immediate next:

- `Version 0.5.227 - Settlement Economy Schema Decision`

## Household And Family Decision Result

- Two future identity schemas are approved; memberships and kinship are not part of the first schema pass.
- Household place anchors describe domestic association without property or ownership.
- Family place associations describe recognized origin, public center, or historical association without jurisdiction, estate, or residence claims.
- Conditional implementation remains `0.5.238 - Household And Family Schemas And Validators` and is not pre-approved.
- `docs/dev/tmp-family-lineage-systems-research-2026-06-20.md` was deleted after full promotion and has no remaining consumer.

## Consolidated Near-Term Queue

1. `0.5.227 - Settlement Economy Schema Decision`
2. `0.5.228 - World Map Feature Authority Schema Decision`
3. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. GPT-DR labels remain non-Codex labels and do not consume `0.5.x` numbers.

## Next Route Boundary

`Version 0.5.227 - Settlement Economy Schema Decision` remains documentation-only. It must reconcile future settlement-economy authority with live settlement economy fields, market values, production chains, workplaces, guilds, items, and runtime projections, and decide the temporary economy artifact's disposition.

It must not implement schemas, validators, content, tests, pricing, markets, trade simulation, runtime, UI, storage, transactions, or gameplay behavior.
