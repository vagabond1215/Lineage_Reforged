# First World macro-geography: owner-approved direction and lore revision v1

Date: 2026-11-15  
Status: **APPROVED MACRO DESIGN DIRECTION / PROPOSED CANONICAL PROSE / SOURCE GEOMETRY HELD**  
Scope: Five continental and four island-system geographic parents. No child-region, political-state, settlement, route, gameplay, Save, or polygon changes.

## 1. Decision authority and source boundaries

The owner has approved the **second** northern simulator assignment option for Dawnreach, a natural tidal connection between Draemor and Talmyra, independently sovereign merfolk in waters near the detached Myridian island, and an eastern maritime-confederation interpretation of Serpent's Wake.

The colored simulator groups represent large **geographic parents**, which may each contain several political entities. Neither a color nor a `region.*` parent is a proof of a single unified country, sovereign government, coastal jurisdiction or navigable route. Do not create new polity, conflict, military, treaty, underwater-city or species IDs from these descriptions.

Authority remains divided:

- **Owner approval:** broad placements, intended landmass membership, geography-driven trade roles and the specific cross-parent premises below.
- **Existing content:** `packages/content/base/world/regions.json`, `regional_ecology_profiles.json` and `world_maps.json` retain the nine stable top-level parent IDs and describe their earlier ecology and trade structure.
- **Physical source registration:** original biome/elevation assets, current feature geometry and the newer simulator ownership-color export must be independently aligned before any new canonical geographic masks can be approved. A screenshot and an older simulator save are not proof of exact Option 2 island polygons.
- **Later authoring:** final canonical prose/position labels, parent geometry, internal subregions, settlements, travel topology, and diplomacy each have separate review gates.

The existing coordinate-first contract `docs/design/coordinate-first-world-geography-migration-contract-2026-11-13.md` remains in effect. Its 2048×1152 source-image reference space does not independently resolve meter-scale arches, bridges or local tidal channels.

## 2. Nine parent systems and proposed lore

| Existing stable ID | Simulator color | Coarse position | Owner-approved geographical identity |
| --- | --- | --- | --- |
| `region.kaelvar` | Dark green | Northwest | Western continent with dry interior, southern fertile coast and northern maritime fringe |
| `region.valtherion` | Purple | Northeast | Largest continent and eastern agricultural/river supercontinent |
| `region.serathyl` | Pink | Southwest | Western maritime continent, forested and coastally complex |
| `region.draemor` | Orange | South-central | Wet-temperate grain-producing continent on west side of tidal isthmus |
| `region.talmyra` | Brown | Southern/east of Draemor | Distinct hotter tropical frontier continent on east side of tidal isthmus |
| `region.myridian_chain` | Red | Northern intercontinental waters, plus detached island | Naval-oriented island network and one of two rival trade spheres |
| `region.lantern_isles` | Yellow | Central/east-central waters | Warm-water maritime trading sphere, commercial rival to Myridian |
| `region.serpents_wake` | Teal/light green | Remote eastern chain | Attractive yet storm-prone maritime confederation with legitimate and covert seaborne activities |
| `region.dawnreach_isles` | White | Northern polar/subpolar archipelago | Owner-approved **Option 2**, U-shaped northern islands including their eastern connecting arc |

### Kaelvar

Kaelvar occupies the northwestern continental landmass, with an island-studded northern margin, exposed western approaches, a dry interior and greener southern peninsular shores. Its broad ecological distinction between pastoral/mineral uplands and cultivated maritime terrain remains intact. Its offshore islands and northern maritime contacts matter to its geographic identity, but the outdated child-region footprint geometry does not determine the final owner of each shore or island.

### Valtherion

Valtherion remains the vast northeastern supercontinent. River-fed basins, forested expanses, a large productive interior and varied coastal projections make it the greatest single continental mass. Its northern maritime routes connect with Myridian and colder high-latitude waters. The Arctic Dawnreach archipelago remains a **distinct geographic parent**, not a Valtherion subregion simply because it lies near the supercontinent.

### Serathyl

Serathyl remains the southwestern maritime continent, characterized at parent scale by irregular coasts, wooded interior terrain and maritime trade. It bridges western shipbuilding networks to the intercontinental and southern seas. Incorrect historical Windward source footprints on southeastern Kaelvar are not evidence of Serathyl mainland continuity or sovereignty.

### Draemor

Draemor is the fertile south-central continent of broad river basins, productive prairie, deciduous and mixed forests, wet lowlands and abundant water. Its agrarian strength produces bulk grain, livestock and staple trade cargo. The eastern/southeastern edge meets Talmyra at a narrow **natural stone tidal isthmus**, providing an important overland outlet without merging their ecological or geographic identities.

### Talmyra

Talmyra retains its own identity immediately across the tidal isthmus from Draemor. It is hotter, more seasonal and more rugged, with savanna, seasonal tropical forests, rainforest, broken uplands and valleys. Precious materials, spices, exotic forest products and maritime commodities make its trade economically complementary to Draemor's grain and livestock. Their proximity is plausible across a narrow zone of seasonal wetland, estuarine and riverine transition, **without requiring matching dominant biomes**.

### Myridian Chain

Myridian is a geographically dispersed, northern and intercontinental island system whose economy and culture place unusually high importance on naval capability, convoy protection, ship service, pilots and customs networks. It occupies the main temperate commercial approaches between Kaelvar and Valtherion and competes with Lantern for trading influence.

The detached, visually jellyfish-shaped central island is assigned to Myridian at **macro geographic-parent level**. Its surface facilities and surrounding trade approaches may be contested intermittently by Lantern interests; no current territorial war or specific legal claim is established by this sentence. Its neighboring underwater merfolk city **does not belong to Myridian**.

### Dawnreach Isles

The owner explicitly selected **Option 2** for Dawnreach's northern boundary. Its two major northern island groups, smaller linking islands and eastern connecting arc form a **U-shaped polar/subpolar archipelago**. The former far-eastern-edge shorthand is superseded.

Dawnreach retains its arctic foundation: long winters, short growing seasons, cold currents, seasonal ice, high-latitude storms, taiga/tundra and cold fisheries. Relative shelter in its inner waters permits limited settlement and seasonal maritime transport. The southern transition toward Myridian is principally climatic, oceanographic and navigational rather than a forced pixel-color ecological classification.

No reassignment of the child area `region.nacre_shelf` occurs at this stage. Its existing cold underwater context must be reviewed separately when child regions and submerged geography are in scope.

### Lantern Isles

Lantern is a warm-water, east-central commercial island network linking the southern continental economies and eastern maritime routes. It competes with Myridian as a **different trade sphere**, not simply as another cluster of ports. Cargo forwarding, marine pilots, merchant associations, tropical commodities and harbor access underpin its influence. Its position need not coincide with the geometric midpoint of the map.

The detached Myridian jellyfish island is **not** reassigned to Lantern. Competition over its surface markets, docking privileges and approaches does not confer underwater sovereignty.

### Serpent's Wake

Serpent's Wake remains the long, remote, serpent-shaped **eastern** archipelago. Its warm coastal habitats, reefs, mangroves, scenic shores and sheltered coves attract legitimate tourists, traders, fishers and mariners; storms and hazardous outer waters remain substantial seasonal risks.

Its intended broad governance is a **maritime confederation** of island authorities, merchant associations, guilds, private maritime contractors and mariner organizations, rather than a uniformly pirate-dominated country or a single necessarily centralized navy. Defense and patrol fleets may be funded and staffed by local associations, guilds or private interests. Lawful escorts, sanctioned privateering, corruption, false-flag raids and covert piracy can coexist, but neither the populace nor every authority is presumed complicit. Criminal operators often benefit from preserving the archipelago's apparently legitimate visitor economy and from avoiding concentrated persecution.

Specific formal political divisions, naval actors, piracy incidents, diplomatic relations and underwater territorial claims remain deferred.

## 3. Draemor–Talmyra tidal rock crossing: approved macro concept

The two continents share a **naturally formed, normally passable stone isthmus** with narrow elevated terrestrial shelves and low tidal arches. Sea water can exchange through its lower channels, particularly at high tide. The rocky, shallow and irregular passages exclude large merchant vessels and warships; very small boats may attempt restricted passages at favorable tides and weather. The existence of arches does not create an approved navigable shipping lane.

- **Terrain and geology:** natural eroded stone, tide pools, submerged reefs and protected brackish-water basins. A remnant of a larger former land connection is a plausible geological explanation, **not a confirmed source-heightmap finding**.
- **Climate:** slightly south of the intended equator; generally accessible throughout the year but threatened by monsoons, seasonal flooding, storm surge and exceptional tides. Weather-related closures and damage can occur without making the crossing ordinarily impassable.
- **Surface transport:** the intact elevated stone portions support normal commercial land transport, including heavy cargo. Exact width, structural load limits, local bridges and tidal safety rules are for the high-resolution crossing design.
- **Shared administration:** Draemor and Talmyra **jointly** manage access, protection and the broad commercial passage. Exact sovereign line, customs statutes, revenues, treaty identities and enforcement agencies are **not** inferred.
- **Ecological role:** calm sheltered tidal pools form a proposed breeding refuge for a dangerous native aquatic/amphibious apex predator. The creature's species, range, aggressiveness, behavior and legal protection remain undesigned.
- **Economic significance:** the land crossing links Draemor's grain/livestock production directly with Talmyra's spices, hardwoods, precious materials and high-value produce, bypassing dangerous or circuitous large-ship routes.

The current world-map scale is approximately **9.765625 km per source pixel**. None of the pictured contact pixels establishes arch dimensions or route safety. Final bridge/rock/sea contours demand registered local geography.

## 4. Myridian's detached island and independent merfolk

The island's **surface land** is within the Myridian geographic parent. A significant neighboring **underwater merfolk city** belongs to an independently sovereign merfolk civilization. Conventional surface nations cannot meaningfully conquer, occupy or administer the deeply submerged polity; economic agreements and diplomatic relationships must be negotiated with it.

This is a source-authorized **lore constraint**, not literal invulnerability to every possible magical, environmental or geopolitical threat. Myridian surface jurisdiction must not be extended across the seabed by adjacency. Lantern's commercial disputes with Myridian do not grant Lantern control over the merfolk polity. No merfolk city ID, underwater border or formal diplomatic actor is published here.

## 5. Major maritime and land relationships

| Geographic relationship | Intended significance | Explicitly not approved |
| --- | --- | --- |
| Kaelvar–Myridian–Valtherion | Northern trade bridge, naval relay and pilotage | Exact sea routes, tariffs or political alliances |
| Myridian–Dawnreach | Shift from dependable temperate routes into seasonal cold-water northern access | Exact ice limit or Nacre Shelf reassignment |
| Myridian–Lantern | Competing northern/naval and east-southern/commercial trade spheres | Declared war, monopoly or fixed national treaty |
| Draemor–Talmyra | Shared overland gateway across the tidal rock isthmus | Existence of a runnable route, cross-border treaty ID, bridge polygon |
| Lantern–southern continents | Warm-water shipping and resource exchange | Port and convoy path IDs |
| Serpent's Wake–outer eastern trade | Lawful tourism, maritime services and covert shipping activity | Blanket pirate-government classification |
| Myridian detached island–merfolk city | Above-water macro membership beside independent underwater sovereignty | Merfolk subordination or conquest rights |

## 6. Canonical narrative reconciliation ledger

| Currently published or assumed | Proposed disposition | Later integration owner |
| --- | --- | --- |
| Dawnreach `positionLabel: eastern_ocean_isles` | Change to northern polar/U-shaped description and eventual approved label | Parent-level `regions.json` narrative patch; source geometry review |
| Serpent's Wake `positionLabel: southern_island_arc` and pirate-centered summary | Change to remote eastern maritime confederation with hidden piracy | Parent-level narrative patch; no automatic polity schema |
| Myridian old northern-only trade summary | Explicit naval commerce and distant jellyfish island | Parent description and future source-geometry registry |
| Lantern generic central island description | More defined east/south economic rival to Myridian | Parent description and trade narrative |
| Draemor/Talmyra unrelated maritime coast assumptions | Shared natural tidal stone passage, wetland/ecotone logic and mutually useful surface trade | Parent summaries first; local geometry and route review later |
| Nacre Shelf existing Dawnreach parent | **HOLD**, no child reassignment in macro pass | Later region/underwater ecology review |
| Old first-world original PNG polygons | Remain as-is pending simulator Option 2 exact export/registration | Coordinate-first source comparison |
| Nine geographic colors | **Not** nine mandatory unified governments | No implicit political records |
| Independent merfolk city | Surface political parents cannot absorb it | Future dedicated merfolk polity and undersea-location contracts |

## 7. Integration sequence and exit gates

**MG-0: Source registration HOLD.** Preserve the old simulator binary save separately; capture a **new save from the approved Option 2 state** plus its exported color assignment. Hash both. Verify that the proposed new save actually reproduces the accepted screenshot. Neither the old save nor screenshots prove new exact geometry on their own.

**MG-1: This documentation proposal.** Preserve all nine IDs, approved owner decisions, environmental fit and explicit holds. No canonical content changes and no PR merge are authorized by writing this note.

**MG-2: Macro-to-raster review.** Independently register Option 2 exported source to the original First World biome/elevation layers and audited source-crop frame. Keep each disconnected island separately labeled. Resolve overlap and drift without nearest-anchor forced ownership.

**MG-3: Parent narrative-only patch.** Prepare exact old/new parent `summary` and `positionLabel` changes for nine existing top-level records, plus targeted world-map overview text. Keep IDs, child regions, environmental profiles, geometry, settlements, travel, engine and Save formats identical; test structural/content referential invariants before integrating.

**MG-4: Local crossing and sovereignty review.** Independently design tidal-arch micro-geography, storm/monsoon closure rules and source-supported habitat at a suitable local scale. Publish no traversable route or species until audited.

**MG-5: Later world integration.** After source registration and owner acceptance, coordinate the approved macro-parent geometry with the landmass-first R0–R3 regional work. Region/child reconciliation and political-state authoring are separate future changes.

### Explicit non-approvals

No child region ownership or boundary; no Nacre Shelf transfer; no newly named merfolk city; no predator species or encounter; no exact coastal pixel assignment; no ocean-crossing shortcut; no altered canonical Source PNG; no settlement movement; no existing travel-network mutation; no runtime or Save migration; no parent-level political reunification.

## 8. Review disposition

**Approved owner decisions:** Option 2 northern U-shaped Dawnreach, nine geographic parents, jungle/seasonal Talmyra beside fertile Draemor, jointly controlled natural normally passable tidal isthmus subject to monsoons, Myridian's detached jellyfish-shaped island, independent effectively conventionally unconquerable merfolk city, maritime-commercial rivalry with Lantern, eastern Serpent's Wake as tourism/trade-oriented maritime confederation with lawful and concealed privateering/piracy.

**Editorial proposals:** Exact words on this page, whether a geological former land bridge is the best formation history, and any future interpretation of customs/patrol specifics. The design directions are accepted; the precise prose and playable geography have **not** been published as canonical data.
