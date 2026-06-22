# Current GPT Handoff

Source version/run: Version 0.5.225 - Polity Schema Decision
Date: 2026-06-22
Status: documentation-only decision completed; no implementation occurred

## Authority Rules

- Future `world.polities` owns stable authored political identity.
- Future paths are `packages/content/base/world/polities.json` and `packages/schemas/world/polity.schema.json`.
- Records use `polity.<slug>`, strict records-only wrapping, and `planned`/`active`/`retired` lifecycle.
- Minimum records contain identity, aliases, summary, controlled `polityForm`, typed region/locality/settlement `placeAnchors`, provenance, and notes.
- Polity forms do not encode vassalage, dispute, or occupation. Those remain later overlays.
- Government, settlement government, jurisdictions, laws, factions, institutions, families/noble houses/dynasties, religions/orders, forces, claims/borders/control, diplomacy/conflict, taxation, enforcement, and player state remain separate.
- Autonomous settlements require explicit polity records; settlement type/administrative role/tags/prose cannot create political identity.
- Existing map conflict zones, derived civil/military authorities, property legal labels, and fame/notoriety are not polity authority.
- All polity records remain descriptive-only.

## Current Anchor

Latest completed:

- `Version 0.5.225 - Polity Schema Decision`

Immediate next:

- `Version 0.5.226 - Household vs Family Schema Decision`

## Polity Decision Result

- Live inventory: 88 settlements, 41 regions, 47 localities, four embedded map conflict zones, 18 guilds, and no polity/government/law/faction schema.
- First-pass anchor types are region, region locality, and settlement; anchors do not imply claims/control/jurisdiction.
- First forms are kingdom, realm, city-state, republic, confederation, tribal confederacy, empire, principality, temporal religious state, trade league, and autonomous settlement.
- Conditional implementation remains `0.5.237 - Polity Schema And Validator`; the first seed plan remains `0.5.247`.
- `docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` was deleted after full promotion and has no remaining consumer.

## Consolidated Near-Term Queue

1. `0.5.226 - Household vs Family Schema Decision`
2. `0.5.227 - Settlement Economy Schema Decision`
3. `0.5.228 - World Map Feature Authority Schema Decision`
4. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. GPT-DR labels remain non-Codex labels and do not consume `0.5.x` numbers. Permanent prompt-pack guidance remains active but does not interrupt the numbered queue.

## Next Route Boundary

`Version 0.5.226 - Household vs Family Schema Decision` remains documentation-only. It must define exact household/family paths, wrappers, ids, minimum fields, person-membership and kinship boundaries, status/provenance, forbidden state, staging, and family research artifact disposition.

It must not implement schemas, validators, content, tests, household/family/kinship runtime, marriage, offspring, inheritance, estate/property transfer, Prestige, UI, storage, migration, or gameplay behavior.
