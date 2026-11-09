# Core World Entry Environmental Feasibility And Authoring Gap Review

Date: 2026-11-09  
Repository: `vagabond1215/Lineage_Reforged`  
Connector review source: `3e345922c23941233705a1d4231555fc93c73ddf` (documentation-only preflight; verify a fresh checkout before implementation)  
Disposition: **CORE_ENTRY_ENVIRONMENTAL_SOURCE_MAPPED; FIRST_AUTHORING_CATALOG_READY_FOR_BOUNDED_DRAFT; WILDERNESS_RUNTIME_SITE_AND_ACTION_OWNERS_MISSING**  
Active protected route: [native-v3 → master isolated integration](../dev/current-codex-prompt.md); no Codex prompt, code, schema, Save, UI, build, deployment, branch or PR changed by this review.

## 1. Purpose and controlling direction

This is the first connector-safe follow-on to [Core World Entries, Hardcore, Prestige, Rewards And Succession](core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md). It inventories the **actual master source** supporting authored geographically varied Core beginnings, names missing owner contracts and proposes the first narrow *non-runtime* authoring batch. It does not accept scenario canon, guarantee present interactable world objects or authorize implementation. The later owner direction supersedes optional/skippable intro posture in historic regional S1.

## 2. Verified current-master owners

| Source | What exists | What it does **not** yet prove |
| --- | --- | --- |
| `apps/rpg-ui/src/game-shell/characterCreationForm.ts` | User selects lineage/appearance, backstory, starter bundle, continent, region and starting settlement; form validates known/selectable backstory, bundle and geography | Core scenario catalog, manual versus Surprise Me selector or isolated wilderness starting site |
| `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts` | `getWorldContinentOptions`, `getWorldRegionOptions`, `getWorldSettlementOptions` and `resolveWorldSelection` resolve available settlements and backstory-specific start access | Site/interior/shoreline presence, live NPC, local pickup, camp, vessel, or exact wilderness arrival |
| `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` | New snapshot derives starting world/settlement, backstory, starter bundle, equipment/inventory, starting known geography; explicit `jobId: null` and `classId: null` | Real World Entry progress/receipt, random-choice receipt, witnessed intro actions or current job/profession |
| `packages/content/base/world/regions.json` | 41 region records, including continents/islands/oceans/subregions | A broad region tag establishing a local story instance |
| `packages/content/base/world/region_localities.json` | 47 locality records | The character's exact current site/interior |
| `packages/content/base/world/world_hexes.json` | 47 authored locality-linked environmental records, with `biomeFamily`, `terrainType`, `elevationBand`, `freshwaterType`, friction/barriers | Character located at a hex, observed resources, water safety, site reachability or validated place of a wreck |
| `packages/content/base/world/regional_ecology_profiles.json` | 9 regional ecology profiles | Observed local habitats, supplies or actual active weather |
| `packages/content/base/world/climate_profiles.json` | 18 climate profiles with seasonal reference bands | General runtime active-profile resolution or current local storm/temperature |
| `packages/content/base/world/travel_networks.json` | 1 travel-network record, with authored mode/route/ship topology | Immediate direct access from a hypothetical wilderness site to settlement without validated owner context |
| `packages/content/base/player/backstories.json` | 27 live backstory records | All being Core eligible, all being without connections or no active occupation, or any single opening being globally compatible |

**Follow-on connector correction (2026-11-09):** the initial path-fetch read of large `settlements.json` and `world_map_features.json` returned no usable content, but **exact-blob retrieval subsequently recovered their full JSON**. The [Exact Geography Anchor Candidate Inventory](core-world-entry-exact-geography-anchor-candidate-inventory-2026-11-09.md) verifies 88 settlement records, 19 climate zones, specific settlement→hex→climate mappings and the 20 static settlement-site limitations. That later focused source check **supersedes the read limitation in this preflight**. It still does not create an actually present NPC, interior, salvage object, wilderness site or playable route; runtime remains held.

## 3. Concrete environment evidence, not spawn authorization

Observed first-world hex/locality examples (verified direct live JSON), each a **candidate environmental context**, not a confirmed authored start site:

| Existing hex | Terrain / biome evidence | Source-compatible *concept* to investigate |
| --- | --- | --- |
| `world_hex.verdant_thalos_coastal_bays` | `coastal_bay`, `mediterranean_woodland`, `coast` | Coastal rescue / shore survival only after actual landing site and origin are authored |
| `world_hex.stormcap_coast_storm_harbors` | `storm_harbor`, `storm_coast`, `coast` | Harbor refuge, but "storm" in a descriptive field **does not** establish current storm |
| `world_hex.embersteppe_herd_plains` | `steppe_plain`, `dry_steppe`, `stream` | Lost trail or broken cart with verified site, route and goods |
| `world_hex.embersteppe_stepwell_corridors` | `water_redoubt`, `dry_steppe`, `stream` | Desert/steppe travel failure; not proof of directly drinkable water or a well beside the player |
| `world_hex.windward_spine_alpine_passes` | `alpine_pass`, `alpine`, `none` freshwater | Mountain trail isolation; shelter/rope/route must be actually authored |
| `world_hex.crownlands_headwater_passes` | `headwater_pass`, `taiga`, `river` | Cold/highland crossing only with a validated current position and safe progression |
| `world_hex.sapphire_rivers_royal_floodplain` | `river_plain`, `alluvial_mixed_forest`, `river` | Riverbank arrival, valid river craft accident only with waterborne approach |
| `world_hex.green_reach_heartwood` | `managed_forest`, `rainforest`, `none` freshwater | Lost forest trail, isolated camp; managed forest **not** proof of a person or lodge |

The 47 hex records include 10 `freshwaterType=coast`, 9 `stream`, 6 `river`, 1 `marsh`, 21 `none`. These are content classifications, not counts of eligible shipwrecks, potable sources or accessible spawn points. They show potential authoring breadth **without** requiring one script per climate/biome.

## 4. Small first Core scenario-authoring batch

Begin with **eight individually authored scenario candidates**, split across ordinary society-adjacent and Hardcore wilderness pools. Each scenario should be reusable across multiple validated contexts, with optional environmental prose variants, and multiple eligible options at the same place when facts support them. Names are working titles and **no NPC, object, site or event is approved as live canon yet**.

| Working scenario | Pool | Distinct premise and action pressure | Required owner facts before runtime |
| --- | --- | --- | --- |
| One Night Paid | Ordinary | Unknown benefactor pays for a final inn night; collect left-behind supplies before leaving | Authored actual lodging/room, donor premise, NPC/owner interaction and gift goods |
| Shelter's Last Bed | Ordinary | Communal shelter/healer has kept the character safe temporarily; caretaker directs them outside | Legitimate shelter/caretaker, goods and local commands |
| Journey's End | Ordinary | Arrive with an overland vehicle after lawful transport/displacement; no comfortable foothold | Authorized settlement arrival, compatible selected backstory, no accidental imposed slavery |
| Roadside Kindness | Ordinary | Passing helper supplies food/cloak near a verified arrival route, not automatically an interior | Route proximity, actual helper/transfer event and truthful geography |
| Broken Wagon | Wilderness | Isolated cart, missing travelers, salvage and terrain reading before seeking people | Owned wilderness site, wreck/route/source items and reachable progression |
| Washed Ashore | Wilderness | One of multiple authored sea/lake/river accident premises; find survival goods and safe direction | Valid shore and approach, authored wreck origin, owner-backed salvage/navigation |
| Abandoned Camp | Wilderness | Empty camp, ambiguous departure and limited supplies; choose what to inspect/salvage | Remote camp site, legitimate ownership/access, actionable goods and exit route |
| Lost Trail | Wilderness | Character separated from travelers or disoriented on trail, needing shelter and navigation | Verified isolated trail, character-history compatibility, actual observable route/direction |

Additional distinct candidates for later coverage: desert oasis caravan, frozen shelter/rescue, river crossing, farmstead loft, isolated marsh landing and supernatural summoning. Do not bundle all variants into one repetitive paragraph or claim that the eight candidates cover all selectable regions. **A false universal "one entry per environment" schema is explicitly rejected.** A supernatural arrival is reserved for separately authorized character and magic canon.

## 5. First narrative production contract

Each scenario needs: identity and separate family; honest premise; authored opening in connected prose (approximately 2–4 paragraphs as guidance); authored first action response and optional branches; continuity-aware ending; typed `requireAll`/`requireAny`/`excludeAny`/variation inputs; owner facts and their provenance; allowed character identities/backstories; real starting objects/NPC/location/commands; legitimate starter goods and time/body effects; expected tutorial steps, completion/once-only receipt and restart behavior.

The first **editorial** batch should fully draft **two ordinary** and **two wilderness** openings with genuinely different situations, at least two validated environmental variants each, and one action-continuation passage. Do not create generic sentence-fragment templating or describe detailed participant intentions, memories, relationships or current professions without accepted facts. Resolve environmental variants from owned data and keep reader-visible prose natural.

Suggested coverage checks: the same suitable location can have two eligible scenarios; a noncoastal location cannot pass a required shoreline predicate; a compatible coastal hex cannot by itself authorize a shore arrival; a missing climate/weather fact fails closed; a first-entry reward can be issued once, not on each restart; unsupported Use/pickup/travel options remain blocked rather than simulated by UI. If no validated scenario exists, resolve a genuinely authored, fact-compatible fallback or block creation with a truthful message until coverage is authored.

## 6. Missing first gameplay owner contracts

1. **Start-site authority:** current master snapshot sets `playerState.location.settlementId` and `siteLabel`; this is not a verified wilderness site identity. A Core wilderness entry requires an actual exact anchored start and legal exit without treating `siteLabel`/world hex/visual map pixels as arbitrary durable location.
2. **Local item/world-object pickup:** starter bundles currently materialize beginning inventory/equipment. "Pick up from table/wagon" needs real world-object identity or bounded narrative handoff owner and atomic inventory add. Do not subtract from imagined local scenery.
3. **Nutrition/body truth:** eating ration/fruit must invoke the existing permitted item Use/consumption owner and honest effects; neither a tutorial flag nor prose grants nourishment.
4. **Inspect and movement:** current Local Scene Context is read-only projection; local NPC/station/interior ownership remains largely planned. Movement/travel must use an actually legal travel/context command, not fictional room grid controls.
5. **Tutorial and randomness persistence:** store accepted scenario, chosen versus Surprise Me source, relevant authored version/variant, step progress, rewards and idempotent receipts under an explicit owner. Mutate neither UI labels nor Save projections as side effects.
6. **Hardcore admission:** campaign selection must deliberately compose wilderness/Grim play with future restricted-Stakes **permanent actual death** without silently converting legacy Hardcore booleans. Its Save/terminal owner remains a separate scope.
7. **Prestige reward settlement:** final capped/upgradable surprise modifier belongs only to a vetted run-end owner; existing Legacy / Echo / family ledgers are not interchangeable.
8. **Narrative content validation:** scenario applicability rules must be explicit and tested against actual selectable creator start options and authoritative world/site data; literary prose requires human editorial review rather than exact-string snapshots.

## 7. Minimal connector-safe next package and stop rule

**Completed follow-on connector passes:** the [Core World Entry Scenario Contract And Editorial Seed](core-world-entry-scenario-contract-and-editorial-seed-2026-11-09.md) documents the eight candidate situations and four complete proposed opening scenes with authored prose variants and action continuations; the [Exact Geography Anchor Candidate Inventory](core-world-entry-exact-geography-anchor-candidate-inventory-2026-11-09.md) recovers exact large JSON source and verifies settlement/hex/climate/site relationships. Neither approves live canon or owner action. No further generic connector geography preflight is necessary until an accepted native-v3 integration head allows a real starting-site/command owner comparison.

**Implementation remains held.** The current installed native-v3 → master integration task gets priority; no pre-alpha backward save migration is required, but native-v3 current-format Save, identity, exact-once and error handling must stay sound. After tested v3 integration and explicit package selection, the smallest S1 owner-backed introduction can begin. Do not alter `docs/dev/current-codex-prompt.md`, merge or activate v3, change game version, push UI cosmetics or broaden test suites merely to prove foundation.
