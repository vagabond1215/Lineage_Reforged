# First World: authored blueprint, scenario, deterministic genesis and evolving World

Date: 2026-11-17  
Status: **OWNER-SELECTED DESIGN INTENT / CONTENT-INVENTORY AND INITIALIZATION CONTRACT / NO RNG OR SCENARIO RUNTIME AUTHORIZED BY THIS DOCUMENT**  
Scope: What a World is, which facts are authored, which initial conditions may vary, and what L2/L3 actually needs before a playable Chronicle World. This design does **not** publish political boundaries, move settlements, alter source geography, initialize gameplay entities, switch on generation, activate World UI, or approve PR #102 for merge.

## Decision and identity

**One shared, developer-authored First World atlas + one initial default Chronicle global scenario + many durable individual World instances.** Separate:

1. **World blueprint**: enduring geography and source identities, named major places, historical setting, established cultures, religion identities, ecological affinities, rules/allowed operations. Shared, versioned read-only source data, **not** copied in full per instance.
2. **Global World scenario**: an authored historical/calendar starting situation referencing that blueprint. Contains an immutable scenario ID/version, eligible World rules, starting location(s), source-linked overrides and permitted initial-condition variations. **One default scenario at first playable launch**. Future alternative world scenarios can vary geopolitical/religious/cultural *starting conditions*, event hooks and authored primary quest arcs **without duplicating the atlas**; none is approved or exposed now.
3. **World instance**: account-owned World ID and lifecycle, selected blueprint/scenario manifest, deterministic seed/generator versions, committed starting-state/initialization receipts, clock, mutable civilization/ecology/area/character associations, campaign/Save links and authoritative event history. An empty World with zero characters or Saves is legitimate. Loading does not regenerate its history.
4. **Character World Entry scene**: a separate, authored and eligibility-filtered character opening *within* a selected World. The [eight editorial Core entry ideas](core-world-entry-scenario-contract-and-editorial-seed-2026-11-09.md) are NOT eight global World scenarios, and do not activate site, actor, item, reward, or route owners.

Progression **Chronicle vs Persistent** is distinct from World topology **Individual vs future Living World**; scenario ID is different from both, from the atlas/map ID, from a Save slot, and from any World Entry scene. Initially the UI creates **one Chronicle/Individual World per account** as currently planned; Persistent and multiple global scenarios remain disabled. World-owned Hardcore and time policies stay separately gated.

## Existing repository authority and scope

The existing [First World full-atlas evidence](first-world-option2-g2e4a-full-source-global-overview-reproduction-2026-11-17.md) supports a **representative macro map**, not local collisions, claims, foot crossings or shore resource spawns. Nine approved geographic-parent directions are not nine sovereign political borders. The [coordinate-first geography migration contract](coordinate-first-world-geography-migration-contract-2026-11-13.md) and [First World geometry roadmap](first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md) and original source geometry gates remain in force.

Read-only source inventory (not a claim of active gameplay):
- [Settlement cultural/geography audit](first-world-settlement-geography-and-cultural-distribution-audit-2026-11-12.md): 88 named settlement anchors, 41 `regions.json` region records, 47 `region_localities.json` locality bands. Proposed regional distribution target counts total **878 category slots** across 28 subregions. Those are planning targets, **not** authorized spawned towns, an exact census, or guaranteed empty sites.
- `packages/content/base/world/polities.json`: **2 planned descriptive polity identities** (Valtherion, Draemor), **not** executable jurisdiction/sovereignty/diplomacy/war mechanics.
- `world/religions.json`: **1 Elemental Pantheon with 8 deity identities**. `religious_hotspots.json`: 2 hotspots (with differing lifecycle). `sacred_sites.json`: 1 named site. These are not yet a complete faith-by-settlement census or enforceable doctrine, clergy, holy-day, law or favor system.
- `world/regional_ecology_profiles.json`: 9 regional ecology profiles. Flora, fauna, habitats, biomes, climate and resources have authored source collections, not fully instantiated local populations.
- `world/spawn_profiles.json`: 5 profiles; `world/encounter_templates.json`: 6 encounter templates. More is required for broad local encounter coverage, but not for the empty World.
- `civilization/quest_archetypes.json`: 8 archetypes; `quest_templates.json`: 36 templates; `quest_definitions.json`: 6 authored definitions. These do not amount to an approved global main-campaign quest tree.
- `game/events.json`: 2 generic event definitions, not a ready global political/ecology event catalog.
- `world/templates/starfall_port_chronicle_v1.json` is an **authored, currently unregistered / runtime-ineligible** single Starfall Chronicle seed and drafted 28×18 local exterior. Its `world_map.first_world` source, empty character/effect arrays, initial clock and five Starfall economic references are useful for genesis; neither local walkability nor a registered live World follows from this draft.

Detailed active World creation design: [Welcome/World/Character entry](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md), [playable vertical slice](first-world-playable-vertical-slice-implementation-plan-2026-11-17.md), and [Starfall economy/geometry boundary](starfall-geography-to-world-economy-owner-contract-2026-11-12.md).

## Logical table inventory: authored versus created versus evolving

A = **authored/immutable at creation**; S = **deterministically seeded once** from an approved weighted/conditional table; L = **instantiated on first eligible local realization**; E = **evolves by authoritative simulation/accepted player events**. These are *logical registries*, not a demand for new IndexedDB stores or JSON files. `Existing` means a source exists, not that an executable randomizer exists.

### I. Fixed World setting, scenario and civic anchors

| Registry / dataset | Authoring owner and fixed identity | Mutable or RNG scope | Readiness |
| --- | --- | --- | --- |
| `world_blueprints` / `geographic_regions` | First World atlas; landmass/island/region names, biome/climate frames and source manifests | **A**; no macro continent/coast RNG at launch | Existing overview; canonical geometry still gated |
| `global_world_scenarios` | Scenario identity/version, initial era/calendar and supported starting sites/rules | **A** default Chronicle/Starfall; alternative scenarios later | **New minimal authoring contract required** |
| `world_generation_policies` | Named deterministic RNG algorithm/stream IDs, content source hashes, field constraints, eligibility | **A**; bounded **S** only when implemented | **New minimal contract required** |
| `polity_definitions` | Historical sovereign identity, government form/capital when accepted | **A**, leaders and stability may **S/E** later | Two descriptive planned records, no live governing owner |
| `territorial_claims` / `border_status` | Explicit polygons/claims/jurisdiction, including disputed/unknown; distinct from geographic color | Authored baseline **A**, control **E** only under political owner | **Held**, never infer from region shading |
| `cultural_profiles` | Recognizable local lineage/culture/language, customs, allowed migration relationships | **A**, bounded **S/E** only after population rules | Regional/settlement facts partial |
| `religious_baselines` | Known pantheon/deities, local faiths, shrines, orders/institutions when accepted | Faith presence **A**; influences **S/E** later | Pantheon/source anchors exist, local distributions incomplete |
| `settlement_anchors` | Names, coordinates, capital/port/site roles, baseline population bands | **A** for 88 named anchors; growth **E** | Existing named records |
| `settlement_hinterlands` / `locality_capacity` | Region/locality food/water access, habitation, ecology, parent/role and settlement capacity | **A** capacity; **S/L/E** dependent minor sites later | Suitability present; explicit dependency ownership not yet implemented |
| `transport_connections` | Approved road/dock/boarding/water routes with modes and local exits | **A** route authority, condition **E** later | Existing route records have unresolved ferry/underwater/sea seams |

### II. Initial-condition RNG candidates

| Named generation table | Conditional inputs / constraints | Durable outcome | First playable? |
| --- | --- | --- | --- |
| `initial_calendar_and_clock` | Default scenario date, world time/speed/pause policy | World-owned clock/tick (no implicit time skip) | **Required; authored default** |
| `initial_economy_state` | Existing civilization engine + source-pinned Starfall 3 local / 2 external settlement context | **One** complete tick-zero economy snapshot and manifest receipt; never separate prices/shops invented by RNG | **Required; engine-derived, no discretionary RNG** |
| `initial_settlement_conditions` | Authored size/role, locality suitability, economy, trade | Bounded reserves/prosperity/status | **Deferred**, use authored or engine baseline |
| `regional_pressure_weights` | Supported environmental/economic conditions and historical scenario | Food, trade, order or hazard pressure | Deferred |
| `starting_diplomacy_weights` | Real polities, claims, treaties and permitted relations | Diplomatic state/tension | Deferred until political owner |
| `leadership_and_succession_candidates` | Approved offices, people, term and succession law | Leader/officeholder identities | Deferred |
| `religious_influence_weights` | Local faith baselines, institutions, culture, law | Faith/institution strength | Deferred until faith/institution authority |
| `minor_settlement_candidates` | Suitability, parent authority, carrying capacity, route and water access | Stable hamlet/farmstead/mine/camp ID on creation | Deferred; 878 targets are NOT a spawn instruction |
| `demographic_deviation_weights` | Local population bands, migration, access, minority/resident policy | Bounded and persistent local demographic mix | Deferred; major named populations start authored |
| `weather_initialization` | Climate, season, site and accepted weather engine | Initial weather for realized place | **L** later, not world-global arbitrary weather |
| `habitat_resource_placement` | Source biome, local ground, habitat, season, resource and extraction rules | Stable resource nodes; bounded depletion | **L/E** later; never from world pixels alone |
| `local_npc_roles` | Registered settlement/site institution, available role, culture, demographics | Stable person/occupation identity | **L/E** later; no invented shops |
| `encounter_population_weights` | Eligible habitat, encounter profile, difficulty, route and ecology | Stable encounter population/cooldown | **L/E** later; no auto-spawns in draft Starfall |
| `side_quest_offer_weights` | Issuer and quest template authority, needs, actual people/sites and eligibility | Persistent offer ID and accepted quest state | **L/E** later |
| `initial_world_event_candidates` | Global scenario, accepted event catalog and actual actors/claims | Once-only eligible scheduled event | Deferred |

### III. Ongoing simulation and narratives: NOT creation-time rerolls

| Dataset / rules | Fixed authoring | Authoritative World state |
| --- | --- | --- |
| `settlement_growth_and_founding` | Carrying capacity, food/housing, disease/migration and parent/dependency rules | Population, founding, consolidation, abandonment (**E**) |
| `economic_shocks` | Eligible shortages, preservation, route disruption and recovery | Economy event journal/market changes (**E**) |
| `political_events` | Claims, ruler/office, war/treaty prerequisites, consequence rules | Control, diplomacy, succession (**E**) |
| `religious_events` | Institutions, local influence, rites and source-valid festivals | Faith affiliation, influence and standings (**E**) |
| `ecological_dynamics` | Habitat, seasons, carrying capacity, species reproduction/migration | Local population, depletion, restoration (**E**) |
| `primary_quest_chains` | **Authored coherent branching campaigns** and their required story facts, not fragments assembled randomly | Scenario-specific quest flags and world consequences (**E**) |
| `regional_story_arcs` | Authored settlement/culture/ecology/faction dependencies | Persistent regional arc progress (**E**) |
| `world_event_history` | Event definitions and exact-once policy | Append-only accepted causal history and receipts (**E**) |

**Settlement policy:** Preserve locations, names and baseline roles of major authored cities; authored initial population bands for named centers, with bounded later growth/decline. Represent unplaced hinterland population as capacity/aggregate until a local settlement instance is truly needed. Minor dependent communities can eventually be sampled **once**, given stable IDs, approved parents and real local anchors; never re-roll every visit, treat all 878 aspirational category slots as real towns, or turn one world-atlas pixel into a local village.

**Religion/culture policy:** Preserve canonical identities; vary local distributions and tensions only within authored baseline and legal institutional relations. No randomly invented sovereign borders, pantheons, punishments, sacred-site powers or political control.

**Quest/scenario policy:** Global scenarios can later point to distinct *authored* primary quest arcs and accepted historical baselines. Character-entry editorial scenes remain separate. Generated side quests must have real eligible issuers, sites, items and exact-once receipts.

## Determinism and data ownership

- **One master seed** per created World plus **domain-separated, versioned, named generation streams** (for example `economy.initial`, `settlement.minor`, `npc.local`, `ecology.local`, `weather.local`, `quest.offer`). No shared advancing RNG counter whose call-order changes when a new subsystem is added. Names are **proposed**, not current engine IDs.
- Each supported RNG registry must specify source data/hash, generator version, scope/anchor ID, eligibility predicates, weighting and exclusions, max/capacity constraints, fallback/error behavior and immutable output/receipt. Unknown facts fail closed.
- **Resolve once and persist**: same account/creation intent, blueprint/scenario, source hash, seed and generation version yields the same result. A retry of already committed creation **reads** the retained record; a load never rerolls, clones markets, recreates NPCs, advances time, or reconstructs a lived World from the seed.
- **Do not seed everything at create.** Record the allowed future local-stream policy and materialize local NPCs, resources, weather, encounters and side quests when a real authored/local frame needs them. Subsequent visits read state and the simulation evolves it.
- Separate **genesis record** (initial starting state and source hashes), **mutable state** (clock/economy/population etc.), **event journal** (causal actions with receipts), and **materialization manifest** (per-area stable identities, generator/source versions).
- World identity `accountId != worldInstanceId != worldMapId != globalScenarioId != characterEntryScenarioId != characterId != campaignId != saveSlotId != localAreaInstanceId`. Keep native-v3 Save/history owner as-is until its accepted association/migration gate.

## Minimal L2-G genesis contract: what actually unlocks World creation

L2-G is an explicit **pre-L3b design/data gate** inside the existing L2→L3 dependency, **not** a new parallel runtime lane, full World generator, or requirement to solve all worldbuilding. A minimum playable default scenario needs:

1. **Authored default global scenario**, stable ID/version and `world_map.first_world` + canonical source/template manifest, with a supported Starfall entry; other global scenarios absent/disabled. Scenario calendar/time and rule compatibility explicit, never silent/unversioned fallback.
2. **Fixed named geography and settlement references**, including source-linked 88 named anchors and current regional/environmental baselines. No need to duplicate all records into the World or mint unknown political/religious data. Mark unimplemented politics/religion as **not initialized**, not empty realms or zero faith.
3. **Genesis/version contract**: hidden World seed and deterministic generator policy/version, initial-condition manifest and receipts for actually created values only, stable creation intent and account lifecycle/revision fence. A seed is **not** a complete Save.
4. **Real tick-zero economy**: use one civilization-engine-produced source-pinned Starfall projection (3 local, 2 external references), compare Node and browser generation from the **same inputs**, persist engine-owned state atomically with World and receipt. No invented stocks, prices, inventory or activated market services.
5. **One empty World**, authoritative clock/rules, zero characters/Saves/local NPCs/quests/resources; a clean exact readback after restart. A World can be created before local Starfall materialization.
6. **Then**, selected World → actual character/native-v3 Save association → separately accepted Starfall local area and real action/Save/reload. No requirement for a worldwide geopolitical simulation, new regions, alternate scenarios, 878 villages or deep ecological spawn catalog.

**Important current implementation blocker (PR #102, draft):** v7→v8 synthetic tests and disposable Chromium v7-account migration/restore/read-only registry QA passed at reviewed head `d3cd548f6b21aff11c40637c3e16026502f8e6e2`, but the economy genesis wrapper currently imports Node filesystem content; *browser World creation remains HELD*. Browser-safe deterministic source inputs must be derived/reconciled to the existing civilization engine, then separately prove real Chromium World create, tab races, restart, backup/restore, failure injection and **historical native-v3 Save parity** before merging or activating L4. No new World state should be committed just because a pure genesis candidate can be constructed.

## Later global scenarios

The content shape for any later `global_world_scenarios` catalog is `{id, version, worldBlueprintId, contentManifest, scenarioStartCalendar, eligibleRules, supportedStartAreaIds, authoredPoliticalBaselineRefs, authoredReligionCultureBaselineRefs, allowedGenesisTableVersions, allowedNarrativeArcIds, sourceNotes}` **as a proposed conceptual interface**, not a checked-in JSON schema. Scenario overrides must be explicit and provenance-linked; they may not mutate the shared blueprint or silently revise source geography. Each later alternative needs separate narrative canon/editorial acceptance, compatibility and state migration policy. No seed editor, alternate scenario picker, purchased templates, historical time skips, Living World, or new atlas at MVP.

## Acceptance and sequencing

- Owner-selected now: **one atlas, one default global scenario, first playable Chronicle World, deterministic future variation under actual source constraints**.
- Not accepted/generated now: sovereign border polygons, political rulers/wars, detailed religious demographics, alternate scenario quest campaigns, full 878-site creation, world-scale ecological simulation, procedural geography, user seed UI.
- Next bounded connector-safe task: review current PR #102 and source owners for **browser-safe, source-pinned tick-zero economy**; map existing data JSON loading/parity and propose/implement only an isolated pure-data seam with executable Node and disposable-browser comparison. Keep all edits in the *existing* draft PR #102 if any, preserve v7 on `master`, and keep the World create gate held until the whole browser proof passes.
- After accepted L3b, L4 World Library surfaces one actual default scenario; later L5-L10 integrate character, local playable Starfall area, Save and resume. Defer optional RNG catalogs to locality/system owner stages and explicit content acceptance.
