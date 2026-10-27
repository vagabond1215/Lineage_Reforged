# Area/Atlas visual inventory, locality canon, and first-resource evidence pilot

Date: 2026-10-26
Status: `CONNECTOR_SOURCE_EVIDENCE; VISUAL/CONTENT PROPOSAL ONLY; NOT CANON APPROVAL`
Inspected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`, with design PR #24 at `995fa6aaf869d04c4d3527478c6bcbf9ebc56c3e`.
This is a targeted expansion of PR #24's Area/Atlas and lore plan, not implementation, asset generation, authored-content approval or a substitute for local rendering. See the accompanying PR #26 Area integration source packet.

## 1. Verified existing graphic inventory and truthful use

| Existing source | Inspected inventory | Safe potential reuse | Missing proof / forbidden interpretation |
| --- | --- | --- | --- |
| `apps/rpg-ui/public/character-creator/settlements/` | **69 settlement PNGs**, including `settlement-stonevein.png`, `settlement-sunspire-reach.png`, `settlement-aurelis.png`; **no `settlement-starfall-port.png`** in the listed directory | Candidate **illustrative atmosphere** for matching actual canonical settlement; accessible fallback remains required | A creator card picture is **not** a surveyed street layout, exact observed building, current NPC, player position or valid interactable map. Art/rights/fit and approved crop must be visually reviewed before reuse. |
| `apps/rpg-ui/public/character-creator/regions/` | **13 region PNGs**, including `region-auric-marches.png`, and other authored region cards | Optional coarse regional atmosphere/Atlas context for exact known region IDs | Region image cannot establish current local site or hidden map contents. No `region-starfall-isle.png` listed. |
| `apps/rpg-ui/public/character-creator/continents/` | **18 images** = ordinary and selected variants for nine named continent/island-system art labels, including `continent-myridian-chain.png` | Atlas broad known geography, character creation consistency | A continent picture cannot serve as Ashen/Starfall local geometry. |
| `apps/rpg-ui/public/character-creator/region-resources/` | **8 illustration PNGs** (field crops, fish and game, garden produce, livestock, orchards, ore, stone, timber) | Region/ecology category UI where known | Not a witnessed local item node, current stock or Gather button. |
| `apps/rpg-ui/public/seasons/` | **6 existing season emblems** | Keep current master/#25 calendar identity and visual continuity | Season icon is not observed weather. |
| `apps/rpg-ui/public/launcher/`, `branding/`, `clock/` | Launcher buttons/backgrounds, three logo assets, two number-tile assets | Existing shell language, as justified | Not location art or local maps. |
| `packages/content/base/world/map_assets/` | **Two** 2048x1152 scale-reference rasters: `First World Biome.png` and `First World Elevation.png` | Larger-scale Atlas reference where rights/visibility and presentation are verified | No validated Area overhead street/reef pathfinding or clickable nearby resource. |
| `assets/weather/source/` | Prior 2026-10-25 master handoff reports 27 user-supplied weather PNGs, not shipped as runtime conditions | Asset provenance review for a future typed weather system | Unavailable live regional weather cannot be inferred from static art. |

`apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts` already supplies asset URLs through `createSettlementCardArt` and explicit region/continent image mappings. That is a **real existing asset routing seam**; a new Area asset resolver should reuse approved canonical associations rather than reconstruct filenames from arbitrary labels. Confirm the exact resolved asset for each Area place and image dimensions/contrast in local UI review.

**Map coordinate nuance:** `packages/content/base/world/world_maps.json` defines the `world_map.first_world` reference as a 2048x1152 grid with a documented world-scale pixel-to-distance relationship, and accepted settlements can have `visualMapRef` pixel coordinates. `world.world_map_features` owns visual reference geometry while `world.map_features` owns planned semantic named-feature identities; neither becomes an autonomous Area click-to-move system. The current `WorldPanel.tsx` mock `location.x/y` percentages are **different UI presentation coordinates** and may not be promoted to canonical positions. Coarse world-map authority does not supply new local pathfinding, room/building, precise reef or resource coordinates.

## 2. Canonical scene dossiers and negative claims

| Character place | Accepted physical/cultural context | Safe image/copy choice now | Must not silently invent |
| --- | --- | --- | --- |
| **Starfall Port** `settlement.starfall_port`, `region.starfall_isle` | `regions.json` says Starfall Isle is the main Myridian Chain customs island with relay harbors, warehouses, ferry slips and deepwater port. `region_localities.json` describes the Starfall archipelago-port *regional* trade/shipbuilding/customs economy. Accepted `ashen-reef-soundings-authored-canon-decision.md` names the **Starfall Harbormaster's Office** and its specific civic pilotage survey commission. | Accurate current place heading, focused harbor-traffic copy based on known facts; **no verified matching settlement PNG**, so use text/neutral fallback or separately reviewed illustrative art | A named present harbormaster, executable office building/site ID, NPC dialogue, live dock seller, existing current storm, exact wharf plan, fish harvest spot |
| **Ashen Reef survey anchorage** `location.ashen_reef` | Existing travel-access owner marks survey approach in Starfall Isle; `ashen-reef-survey-content.ts` records Inshore Approach, Working Reef, Outer Passage, final Ruin Markers; accepted story frames post-seasonal-storm sounding errors. The runtime type `ruin` describes a compatibility location, not a new separate city. | Exact current label and quest-stage conditional wording; no alleged canon overhead reef placement; optional nautical illustration only if accepted | A separate settlement, conservation park, present storm, automatic salvage rights, visual tide-depth measurement, newly spawned Stormglass Bloom resource |
| **Stonevein** `settlement.stonevein`, old `location.westreach` | `player-travel-rules.ts` says current travel label Stonevein in Auric Marches and arrival `Market Ward`. Region-locality source describes mineral-bearing dry uplands and caravan corridors, **not yet a verified fine-grained Stonevein locality assignment**. The creator also has the authored longer descriptive Auric Marches passages and `settlement-stonevein.png`. | Candidate atmospheric image and shorter conservative Area text; title must use actual current settlement fact and avoid adding map coordinates | Current mine access, observed broker, harvestable ore node, specific Market Ward entrance geometry, route closure |
| **Sunspire Reach** `settlement.sunspire_reach`, old `location.crown_bastion` | `player-travel-rules.ts` labels `Gate Muster`; `regions.json` establishes Silver Valleys as river-crossed interior lands with settled agriculture and contest. `settlement-sunspire-reach.png` exists. | Candidate image and truthful valley/settlement-context wording at accepted precision | A specified current gate guard, legal permit requirement, active harvest, ford/field at exact current scene, interactable fortress |

World Selection's longer regional descriptive prose is **authored creator presentation**, not an automatic present-tense Area observer report. Propose separate concise gameplay copy conditioned by player location, current quest/encounter and source certainty.

### Provisional conditional Area copy examples (not canon)
- Starfall, **only when Soundings is actually available**: "The harbor's working routes make dependable soundings valuable. Starfall's Harbormaster's Office has a specific survey contract concerning Ashen Reef."
- Ashen, **only when survey stage is accepted and active**: "From the survey anchorage, the chart work turns to the reef's named approaches. Your active survey record determines the next permitted sounding shift."
- Stonevein, **at validated settlement arrival**: "Stonevein stands in the dry, mineral-bearing Auric Marches. The journey ledger currently identifies the arrival as Market Ward."
- Sunspire, **at validated settlement arrival**: "Sunspire Reach lies within the Silver Valleys. The current journey record labels this arrival Gate Muster."

Do not display a quest office as a current NPC, exact entry/access affordance or explicit physical presence merely because it appears in a summary. All such samples require editorial approval, name/global collision checking for *new* additions, and a real observer/knowledge guard before becoming runtime strings.

## 3. First new material loop: exact catalog reconciliation

- `items/items.json`: **1,372** static item records. Valid existing fungible candidate item keys: `fiber`, `river_reed`, `marsh_fiber`, `bark`, `fish_raw`, `iron_ore`, `grain_bundle`.
- `world/resources.json`: exactly **two static planned resource identities**, `resource.iron_ore` and `resource.grain`. Their content expressly disclaims current stock, resource nodes, extraction and gameplay ownership.
- `crafting/recipes.json`: **28 planned recipes**, all with nonempty `requiredWorkplaceIds`. Examples: `recipe.fiber_to_cloth` at `workplace.loomhouse`; `recipe.fish_raw_and_salt_crystal_to_smoked_fish` at `workplace.smokehouse` with `smoking_rack`. Neither can simply be offered as a field hand-craft command.
- `region_localities.json`: Starfall Ports has strong *regional* fishery, not a per-scene observed fish source; Silver Valleys has river/ford areas, not an instant `river_reed` harvest at Sunspire; Auric ore ridges describe regional resource context, not an open mine.
- `ecology-grounded-contextual-affordance-expansion-plan.md`: `HexResourceAvailabilityState` represents plausibility/availability tier and compatibility, **not** a realized interactable target.

| Shortlist | Existing output | True next source requirement | Recommendation |
| --- | --- | --- | --- |
| Botanical/fiber collect | `item.fiber` | Choose exact reachable place, actual vegetation/observation, legal method/access and persistent source quantity; inventory stack + depletion receipt | **First conditional G3 option** |
| Freshwater reed/fiber collect | `item.river_reed` or `item.marsh_fiber` | Prove one freshwater/marsh habitat at real accessible site with source identity and quantity; do not substitute marine Ashen reef | **Second conditional G3 option** |
| Fishing | `item.fish_raw` | Specific water/site/catch source, gear/catch method, permissions, result, and more QA risk; any processing also requires smokehouse owner | Hold for later |
| Ore collection | `item.iron_ore` | Actual mine/ore node, accessibility/permission, pick/tool, stock and depletion; planned resource identity alone insufficient | Hold for later |

**No G3 material is currently executable from this evidence.** The first accepted resource loop can stop at witnessed source → one authoritative, idempotent collection → exact fungible item and genuine Save/restart. Do not force a 28-recipe workplace system or generated biome stock into that first milestone. If even one source cannot be lawfully/narratively placed without a new authored content decision, stop and seek that exact decision.

## 4. First Area and Atlas visual behavior contract

Desktop main Area: actual full current place heading, concise sourced atmosphere, primary owner-legal current action, quest/activity/encounter priority, known Travel picker and time/resource preview, genuine bounded recent accepted results and lightweight Character/Quests/Atlas shortcuts. Art is supporting atmosphere, not the sole carrier of player context.

Narrow Area: show place heading and legal action **above** any large illustration; verified keyboard/focus/touch. Missing art does not create a blank viewport. Include contrast-safe alt/fallback and image provenance. Atlas keeps broader known geography, optional image/map scale and read-only selected reference; clicking Atlas may navigate back to an Area *travel preview*, but never mutate player position directly.

Area variants to test: Starfall with and without the Soundings offer; Ashen at each real survey stage; Stonevein under ordinary nearby exploration; Sunspire with no fabricated local event; a region-only/unknown-site case; no valid action; missing image; inaccessible/stale travel target; post-restart actual current place.

## 5. Evidence boundaries and next decision

This pass is a connector-only inventory and source-level narrative/resource audit, not visual QA. Filename listing and source mapping do not prove how an image actually looks or whether the content rights allow additional use. No image generated, renamed, relocated, deployed or registered in production. No location, weather state, NPC, quest, gather command, resource stock, canonical place name or Save was modified. Next consumer should visually inspect matching existing images and approve at most one optional Area asset/copy pilot after Current Area projection exists.

Source material for deeper narrative checks already lives in PR #24's `lore-grounded-naming-and-area-content-authoring-plan-2026-10-26.md`; do not produce a second uncontrolled bulk-lore expansion. Reopen only on an authenticated observed place or selected new playable material source.
