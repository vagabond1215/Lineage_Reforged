# Core World Entry Exact Geography Anchor Candidate Inventory

Date: 2026-11-09  
Connector source: `603cba012bcc16c6ca24bbce2dcfebe91ac688c6` (live default `master` at review)  
Disposition: **STATIC_GEOGRAPHY_LINKS_VERIFIED; CORE_SITE_PLACEMENT_AND_INTERACTIVE_SPAWN_NOT_AUTHORIZED**  
Execution: read-only GitHub source and document-only connector safe follow-on. No runtime, schema, content, Save, Codex prompt, branch, PR or Site change.

Follows the [owner direction](core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md), [environmental feasibility audit](core-world-entry-environmental-feasibility-and-authoring-gap-review-2026-11-09.md), and [proposed scenario/editorial seed](core-world-entry-scenario-contract-and-editorial-seed-2026-11-09.md).

## 1. Exact source observations

The connector's path-oriented `fetch_file` returned empty content for the two largest world JSON files, but a **second bounded fetch by their exact blob SHAs recovered the full source**. This inventory therefore supersedes that older read limitation; it does not depend on guessed settlement descriptions.

| Live collection | Verified direct source count | What it owns / limits |
| --- | --- | --- |
| `settlements.json` | **88 settlements** | Named settleable places, region/locality/hex linkage, `siteContext`, `siteClass`, `visualMapRef.climateZoneId`, economy/survival descriptors |
| `world_hexes.json` | **47 world-hex/locality bands** | Coarse environment; does not establish player exact location |
| `world_hex_edges.json` | **49 edges** | Authored adjacent corridors and travel restrictions; not automatically an available current movement |
| `region_localities.json` | **47 localities** | Region-bounded locality identity |
| `world_map_features.json` | **one map-feature aggregate, 19 climate zones** | Visual/reference climate zones mapping to climate profile IDs; not active local weather |
| `climate_profiles.json` | **18 profiles** | Seasonal climate-reference bands, not observed current temperature |
| `settlement_sites.json` | **20 named static sites** | Physical named site descriptions, not functional room, worker, NPC, stock, loot or world-action owners |
| `settlement_districts.json` | **14 named districts** | District identity, not room-scale interactive environment |

Source blob for settlement record retrieval: `7e00f4243e96909e161ec09a2e8a4c3395f89216`; map-feature blob: `9cd6752e9dbca00796e5f7c013066bb0e5a96175`. Count observations apply to this inspected source, not a future native-v3 integrated branch.

The 20 static site records cover wharves, guildhalls, markets, watch posts, bridgeheads, warehouses, workshop clusters, mills, palace/landmarks and plaza. **None of these records alone provides a playable inn room, charity-bed interior, wilderness wreck, isolated camp, shoreline salvage instance or a present caretaker NPC.** Do not infer them from `siteContext`, `functionalTags` or a static site name.

## 2. Exact candidate settlement/geography links

The table proves **authoring-relevant nearby geography**, *not* that any Core story or Hardcore wilderness start is currently eligible. Each candidate requires character-creator start access, an actual story-specific local site or wilderness anchor, owner-backed actions and authored facts.

| Existing settlement | World-hex anchor | Reference climate profile | Suitable investigation, **not** active intro |
| --- | --- | --- | --- |
| `settlement.starfall_port` (Starfall Port) | `world_hex.myridian_ports` | `climate.mild_winter` | Best reuse of existing proven regional gameplay hub; ordinary near-port scenario |
| `settlement.aurelis` (Aurelis) | `world_hex.verdant_thalos_coastal_bays` | `climate.mild_winter` | Inhabited coastal starting choices; hull-yard and guildhall static sites exist, not lodging |
| `settlement.redcliff_quay` (Redcliff Quay) | `world_hex.verdant_thalos_coastal_bays` | `climate.mild_winter` | Coastal village/port context; named wharf/watch site is descriptive only |
| `settlement.breaksail` (Breaksail) | `world_hex.stormcap_coast_storm_harbors` | `climate.mild_winter` | Harbor refuge/rescue concept; `storm_harbor` is geography, not active weather |
| `settlement.ashsaddle` (Ashsaddle) | `world_hex.embersteppe_herd_plains` | `climate.dry_year` | Steppe market/crossing; ordinary caravan arrival or separately anchored remote wagon |
| `settlement.stepwell_redoubt` (Stepwell Redoubt) | `world_hex.embersteppe_stepwell_corridors` | `climate.dry_year` | Dry steppe/well corridor; cannot assert nearby drinkable well or campsite |
| `settlement.northpass_redoubt` (Northpass Redoubt) | `world_hex.windward_spine_alpine_passes` | `climate.cold` | Mountain-pass context; winter scene requires suitable season/current facts |
| `settlement.headwater_bastion` (Headwater Bastion) | `world_hex.crownlands_headwater_passes` | `climate.cold` | Cold/taiga/highland context; presence of river does not prove potable water |
| `settlement.highcrown` (Highcrown) | `world_hex.sapphire_rivers_royal_floodplain` | `climate.wet_year` | River city context; static barge quays, not active riverboat or drivable craft |
| `settlement.verdeward` (Verdeward) | `world_hex.green_reach_heartwood` | `climate.wet_year` | Forest settlement context; no real wilderness camp or forest NPC spawned by tag |

Source join used `settlement.hexAnchorId`, `settlement.localityBandId`, and `settlement.visualMapRef.climateZoneId` to explicit climate-zone `climateProfileId`. This is a **reference mapping** and must not be presented as active weather or as a runtime-local climate resolver unless a later owner implements one. Linked hex edges show topology around these environments, not an actionable path between a hypothetical wilderness spawn and any settlement.

## 3. Proposed initial coverage plan

For a bounded Core authoring lane after native-v3 integration is accepted:

**Ordinary pilot (Starfall Port first candidate):** author *two distinct* fact-compatible scenes against a **new validated actual starting-site/actor contract**, such as an inn-room gift and a charitable overnight shelter. Both may share the same broad starting settlement while having different initial conditions and NPC/environmental narrative. If neither exact interior exists, author a plausible new one under the proper location/content authority before enabling the story. Starfall's current quest existence does not create the room or caretaker.

**Environmental second pilot:** test a dry/steppe setting such as Ashsaddle and a cold highland setting such as Northpass only after actual start-access and location/site evidence. They validate that predicate rules enable several variations without a one-story-per-biome table and never imply local water, warmth or shelter from profile labels.

**Hardcore wilderness pilot:** select one **actual** isolated location with a stable identity, non-fabricated item/route contents and a lawful exit. The current `newGameSnapshot.ts` creates a player with a selected **settlementId**; it does not admit an exact wilderness start merely because the settlement's `hexAnchorId` identifies surrounding terrain. Introducing a real wilderness starting site and travel/inspection/acquisition transitions is a separate executable owner prerequisite, not an editorial-only variant of `siteLabel`.

**Coastal wreck** remains a specifically gated follow-up. Aurelis or Breaksail being coastal does **not** prove that the player can start on a particular isolated shore, that a ship actually wrecked, that debris belongs to the scene or that a legal path exists inland. A sea/lake/river craft story needs verified geography and tailored prose.

## 4. Minimal acceptance and negative checks

- A scenario claiming a room, shelter, donor, healer, wagon, camp or wreck references a real authored source and legal current presence, not just a settlement's environmental description.
- A location that shares one world hex with a settlement is **not** necessarily inside its walls, standing on the coast or already beside an interactable object.
- `getWorldSettlementOptions` access can differ by selected backstory; future eligibility must check the accepted creator source and its access result.
- If two legitimately authored ordinary scenarios share Starfall, both appear as choices and in the same validated Surprise Me pool; failed predicates do not appear.
- Shipwreck is excluded where shoreline and arrival are missing; snow/rain statements require appropriate owned season/current weather; no fake water source from `freshwaterType`.
- A Hardcore character starts at a true isolated world site, can observe a real viable survival/navigation path, and cannot be resurrected through Save/restart after actual terminal death.
- Focus testing on predicate correctness, owner-backed item/command identity, selected Save/restart and exact-once receipt; do not require finished-world breadth or visual-polish acceptance.

## 5. Decision for the next developer handoff

**`STATIC_ANCHORS_READY_FOR_AUTHORING_COMPARISON; EXACT_LOCAL_SCENE_OWNER_AND_WILDERNESS_START_REQUIRED`.**

The connector has now resolved the large-file read gap and can identify plausible first *geographic contexts*. It cannot independently prove physical local interactable scene identity or the current-v3 integrated game's command execution. The **next executable** package therefore remains held until the active native-v3 consolidation produces an accepted exact-source baseline. At that point compare these rows with the merged creator, Save and starting-place owners, choose one actual bounded starting site, and author/admit only scenarios supported by that site.

No additional generic geography pre-audit is necessary before that milestone. Do not build a new global map/location engine merely to support four Core scenes, and do not alter the current Codex prompt or selected browser data.
