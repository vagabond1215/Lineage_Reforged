# Starfall First World: authored local-area and empty World Save seed

> **2026-11-12 mapped biome and economy extension:** The [base economy and geography alignment record](starfall-base-economy-and-map-alignment-2026-11-12.md) now verifies Starfall's map anchor (825,245) falls in `map_biome.first_world.myridian_chain_chaparral.part_8` (`biome.shrublands.chaparral`) and the Myridian island footprint. `world_hex.myridian_ports` independently describes `mixed_forest_archipelago`. The 28×18 local grid is still proposed and **not** aligned to measured raster elevation/coastline; `scripts/audit-starfall-raster.mjs` is the next binary-source witness. Foammarket Ferry trades with Pearlwake but does not yet have a two-terminal registered passenger route. The World JSON carries only a null-state pointer to the **read-only Starfall economy preview** that reuses existing civilization-market and settlement simulation rather than inventing shops/prices/stock. This record supersedes any implication below that the macro biome supplies exact local height or walkable shore geometry.

Date: 2026-11-12  
Status: **Static template authored on master; NOT runtime-registered or accepted as a native-v3 Save artifact.**  
Requested goal: Start a real Chronicle World creation skeleton grounded at Starfall Port, with reproducible local terrain, canonical nearby geography, an empty World state and no fabricated gameplay entities.  
Source file: [`packages/content/base/world/templates/starfall_port_chronicle_v1.json`](../../packages/content/base/world/templates/starfall_port_chronicle_v1.json).  
Guard test: [`tests/unit/starfall-world-template.test.mjs`](../../tests/unit/starfall-world-template.test.mjs).  
Related plan: [First World launcher stage map](first-world-launcher-implementation-process-map-2026-11-11.md) and [World/character loading](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md).

## 1. What is authored now

- **One First World, Chronicle template:** `world_template.first_world.starfall_port.chronicle_v1` with `world_map.first_world`, `region.myridian_chain`, `region.starfall_isle`, `region_locality.myridian_ports`, `world_hex.myridian_ports` and `settlement.starfall_port`. The schema label is deliberately `lineage-reborn.starfall-world-seed.v1`, **not** a claim that native-v3 knows how to save it yet.
- **One proposed local exterior:** `area_template.starfall_port.harbor_approach_v1`, a fixed, rectangular **28 columns × 18 rows** tile grid showing harbor approach streets, bounded structures, wooded verge, coastal uplands, water and an accessible boardwalk. The authored starting tile is **(10,9)**. All **333 walkable cells** can be reached through walkable orthogonal neighbors from that tile. Tile coordinates are newly authored local-grid coordinates; the canonical Starfall `(825,245)` map-pixel reference is **macro-only** and never a local collision coordinate.
- **Terrain glyphs:** `.` open ground; `r` road; `b` quay boardwalk; `f` wooded verge (all walkable). `#` building shell, `^` rocky upland and `~` water are blocked. Shells are not functional interiors, stations, vendors or occupied homes. A walkable boardwalk is not permission to sail. Three exit candidates (track, upland approach and quay edge) are deliberately disabled until real adjoining areas/boat/route owners are assigned.
- **Grounded broad context:** Starfall Port is a `port_city` of 28,000 in existing settlement data with regional/naval trade and developed harbor/market infrastructure. Named **descriptive** guilds: Merchants Exchange, Teamsters Chapterhouse, Shipwrights Guildhouse, Fishers Hall, Scribes and Factors Hall, Starfall Adventurers Hall. The template records no instantiated clerks, merchants, fishing boats or crafting stations.
- **Ecology:** Canonical candidate flora IDs `flora.coconut_palm`, `flora.orange_tree`, `flora.flax`, `flora.river_reed`; fauna `fauna.cod`, `fauna.oyster`, `fauna.crab`, `fauna.reef_lobster`. The region/hex reference includes mixed forest archipelago, sheltered harbors, maritime climate tendency, fish/shellfish/salt affinity and broad wildlife/bandit risk tags. These are **candidate sources only**, not automatically present local plants, catch, harvestables, encounters or current weather.
- **Existing travel graph links only:** Two macro road-hex corridors to Pearl Shoals and Beacon Bastions, Starfall–Harbormast island sea passage, Brineharbor–Starfall and Starfall–Blueflow sea lanes. No source route creates a working local exit or foot-adjacent settlement. Valid mode for sea passage is `travel_mode.sea_vessel` and a ship/service is not generated.

## 2. Empty World instance seed, before characters

`proposedInstanceSeed` is a **template initializer**, not an owner-accepted serialized game Save. It explicitly leaves `accountId`, `worldInstanceId`, `creationIntentId`, `createdAt`, `displayName` and source-manifest fingerprint unbound for the authorized World Creator to fill transactionally. It sets `worldRevision=0`, an elapsed-World-time clock of `0` seconds and zero character/campaign Save associations, area materializations, actions, resources, spawned entities, events and receipts. Initial rules are safe proposed **Chronicle / Individual / non-Hardcore**, pause allowed, 1× World-time multiplier, no player-triggered time skip; final policy/calendar epoch and campaign rules must be selected by the World owner, not silently inferred here.

**World template ≠ World instance ≠ campaign Save.** On accepted create:
1. Verify the current account lifecycle/owner and the one-World limit if selected. Validate the fixed authored template ID/version and manifest; disallow Persistent/Hardcore modes until approved.
2. Prepare a stable creation request ID; allocate an account-scoped `worldInstanceId` in one accepted registry/epoch transaction. Bind all null lifecycle fields, pin source version and locked World rules; do not create a character, starter inventory, clock tick or Prestige grant.
3. Commit the empty World record and exact readback once. Interrupted retry must return the **same World**, not make a second one or silently recover as empty on an I/O failure. Store the template reference and a content fingerprint.
4. When an authorized character entry starts later, create/materialize the local area **once** with a stable `areaInstanceId`, verifying this fixed template version and spawn (10,9), and use the existing native-v3 campaign/head/Save owner to associate the character/campaign. Save/reload must preserve consumed, spawned, moved or depleted state rather than re-cloning this blueprint.
5. When the actual area renderer/collision, site/interactables, authoring and camera boundaries exist, enable the area in-game. Until then, the local map is a **usable proposal and reproducible geometry source**, not a claim of a functioning game scene.

Never store this template by writing an unversioned JSON key into localStorage or by making a second parallel Save catalog; L2 needs to choose the accepted epoch-owned World registry format, lifecycle/recovery, migration strategy and Save associations. Existing native-v3 account/campaign records are authoritative for their own state.

## 3. Why hazards, NPCs, resources and economy remain empty

The existing Myridian/Starfall area has no dedicated accepted spawn profile or geometric spawn/admission zones. Current named settlement sites and districts do not instantiate a Starfall starter inn, NPC trader, crafting facility or salvage event. The World template therefore leaves `placedNpcInstances`, `placedMonsterInstances`, `placedResourceInstances`, `activeEncounterSpawnZones`, `serviceProviders`, `craftingStations`, `interactableSiteInstances` and runtime `localWeatherOverride` empty. The descriptive candidate bands and guild presence help future authoring, not game actions.

This avoids introducing phantom collectibles, monsters or staffed buildings when the first empty World is created. Actual flora, fauna, encounter and provider placement requires locally valid content/habitat/access/source IDs, a deterministic published instance ledger and typed action owners. Geographic plausibility is not evidence of placed resources.

## 4. Current validation and next integration gate

New unit test source checks:
- referential integrity across First World map, region, locality, hex, settlement, edges/routes, six named guild references and canonical flora/fauna;
- 28×18 grid shape, safe valid spawn, all walkable cells connected, water/building collision and disabled exits;
- no account, character, campaign Save, NPC, resource, monster, active spawn, quest or money granted at initialization;
- the static template is marked `runtimeEligible=false` and **is not** automatically registered into the selected launcher/gameplay path.

Connector checked authored grid connectivity and source IDs by read-only GitHub source inspection. **No local Node test runner, native-v3 type/build, browser, World creation persistence, area rendering, game clock or exact Save/load test has been performed in this pass.** Do not claim the template is an importable current-format Save.

**Next concrete stage:** implement/approve **L2 World instance registry/save ownership**, explicitly consuming this template. Then L3 create/list/persist a real empty Chronicle World, L4 show it in the World Library, and subsequently hook the existing creator and native-v3 Save/gameplay to this specific World and local area. The welcome path currently cannot access ordinary Save slots through the new route; synthetic end-to-end validation should follow functional World→Character→In Game connectivity rather than pretending unavailable saves are accessible now.

Holds: no schema migration or live runtime activation, no instance/character creation, no selected/hosted deployment, no Game version change, no alteration of real accounts/Saves.
