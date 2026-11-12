# Starfall first-area map alignment and base economy bootstrap

Date: 2026-11-12. Source: active development `master`.  
Status: **Starfall anchor polygons source-checked; raster height sampling and local coastline/relief alignment NOT YET VERIFIED. Existing civilization economy engine reused through a read-only Starfall preview; no market writes or purchasable stock.**

## 1. Map and spatial authority

The accepted map reference `world_map.first_world` is 2048×1152 pixels, with a descriptive distance ruler of about 9.765625 kilometers per reference pixel. The source assets remain:
- `packages/content/base/world/map_assets/First World Biome.png`
- `packages/content/base/world/map_assets/First World Elevation.png`
- `packages/content/base/world/world_map_features.json`: 1 source-aligned feature aggregate with region polygons, coastlines, 19 climate zones, 230 biome zone parts, and crossings
- `packages/content/base/world/settlements.json`: actual settlement visual-map anchors, not local tile positions.

**Read-only polygon point-in-polygon verification** used half-pixel centers of five canonical settlement anchors (to avoid edge ambiguity). Every point matched exactly one Myridian footprint part, one Myridian chaparral biome part, and `map_climate.first_world.myridian_chain` (`climate.mild_winter`).

| Settlement | Canonical pixel (x,y) | Island footprint | Biome part | Region / locality |
| --- | --- | --- | --- | --- |
| Starfall Port | 825,245 | `feature.region_myridian_chain.part_7` | `map_biome.first_world.myridian_chain_chaparral.part_8` | `region.starfall_isle` / `region_locality.myridian_ports` |
| Harbormast Quay | 905,270 | `feature.region_myridian_chain.part_24` | `map_biome.first_world.myridian_chain_chaparral.part_28` | `region.starfall_isle` / `region_locality.myridian_ports` |
| Foammarket Ferry | 760,355 | `feature.region_myridian_chain.part_36` | `map_biome.first_world.myridian_chain_chaparral.part_41` | `region.starfall_isle` / `region_locality.myridian_ports` |
| Pearlwake | 735,315 | `feature.region_myridian_chain.part_28` | `map_biome.first_world.myridian_chain_chaparral.part_32` | `region.pearlwake_keys` / `region_locality.myridian_pearl_shoals` |
| Chainlight Bastion | 965,170 | `feature.region_myridian_chain.part_11` | `map_biome.first_world.myridian_chain_chaparral.part_13` | `region.zenith_isle` / `region_locality.myridian_beacon_bastions` |

The Starfall anchor's specific chaparral polygon part 8 has pixel bounds **x=780..852, y=140..250**, and the point (825.5,245.5) is *inside*, near its southern edge. Its visual biome ID is **`biome.shrublands.chaparral`**. The separate high-level `world_hex.myridian_ports` record labels the macro-biome `mixed_forest_archipelago`. This is a real source-layer mismatch in level of detail, **not an authorization to replace one with the other**. For actual on-map terrain, use the explicit chaparral polygon; treat local timber/forest pockets as deliberately authored smaller-scale features requiring their own placement evidence.

**Height verification is a separate outstanding task.** The binary elevation PNG is present, but the GitHub text connector cannot decode its PNG pixels or infer a grayscale/color-to-meter transform. The area record now pins exact raster paths, verified biome/footprint part IDs, climate and map coordinate and explicitly leaves `elevationSample=null` and `localAreaFootprintOnRaster=null`. Do not claim 28×18 local road/shore/rock tiles are a measured elevation-derived crop. Source description only supports a sheltered harbor island and `world_hex` `upland` band; it does not establish local heights, slope, flood limits, cliffs or water depth.

**Next physical-map witness:** on a real local checkout, run `node scripts/audit-starfall-raster.mjs` to emit raw pixel color/channel values for both PNGs at the five settlements and ±10 reference pixels around Starfall; independently confirm the source layer encoding and height scale/sea level before converting colors to elevation units. Add a bounded map-view overlay or cartographic analysis for a small Starfall coastal polygon (not the whole Myridian archipelago), then correlate shoreline with Starfall's 28×18 proposed harbor-approach local grid. The script is read-only and never invents elevation from RGB.

## 2. Pearlwake, Foammarket and actual route semantics

- **Pearlwake**: a harbor settlement in **The Pearlwake Keys** (`region.pearlwake_keys`), itself a Myridian Chain subregion; locality **Pearl Shoals** (`region_locality.myridian_pearl_shoals`), hex `world_hex.myridian_pearl_shoals`. The Pearlwake Keys are described as low coral keys and shoal villages specializing in pearl diving, cured fish and reef piloting.
- **Foammarket Ferry**: a ferry post in **Starfall Isle** (`region.starfall_isle`), locality Starfall Ports, hex Myridian Ports. `feature.crossing_foammarket_ferry` at (760,355) is explicitly an inter-island ferry control point for cargo and passengers. The settlement's **authored trade partner is Pearlwake**: `domesticTradeFlows` lists exchange of fish, pack support and toll services, with coastal/sea-lane modes.
- **Not yet true:** the crossing record does **not** name two ferry landing terminals, or a fare/timetable/usable passenger service. `travel_network.first_world` contains no direct `Foammarket Ferry` route. A separate `world_hex_edge.myridian_ports_myridian_pearl_shoals` labels a macro **road** corridor with foot/wagon modes, but it is not a physically vetted walkable bridge between islands. The ferry/road discrepancy must be resolved at a route topology gate, not silently converted to instant over-water walking.

Other existing Starfall references: `route.starfall_port_harbormast_quay` is a sea-vessel route; `lane.brineharbor_starfall_port` and `lane.starfall_port_blueflow` are longer sea lanes. Same macro-hex membership does not mean that Starfall, Harbormast and Foammarket share a local pedestrian tile or land road.

## 3. Economy: reuse the established engine, not duplicate its authority

**New source:** `packages/engines/civilization-engine/src/starfall-base-economy.ts` and JS shim; exported from `packages/engines/civilization-engine/src/index.ts`.

`buildStarfallBaseEconomyPreview(clock)` is an **uncommitted, read-only, deterministic-at-a-fixed-clock preview**, wrapping existing:
`buildEconomyStateFromContent` → `aggregateEconomyHierarchy` → `buildSettlementMarketStates` → `buildSettlementSimulationProfiles`.

It uses three local settlement records **Starfall Port, Harbormast Quay and Foammarket Ferry** plus two named external context settlements **Pearlwake and Chainlight Bastion**, all with canonical settlement IDs. It does not invent a new settlement economy collection or reimplement prices, market stock, production or economic ticks. It accepts an owner-provided `SimulationClock` and does not advance World time, register World records, publish an economy state, grant goods or create shop offers. Derived engine rates/market views remain **simulated projections** until a real World/Save owner accepts and persists them.

For an initial player-oriented economy, group **five focus categories**, preserving the individual exact source goods rather than treating category labels as canonical item IDs:

| Focus family | Exact source keys tracked | Starfall's authored posture |
| --- | --- | --- |
| Fish | `fish`, `salted_fish` | `salted_fish` supply; Foammarket supplies `fish` |
| Grain | `grain` | Strong import/demand posture, no asserted local grain stock |
| Rope / rigging | `rope`, `ship_rigging` | Local supply strength; supports harbor industry |
| Timber | `timber`, `bulk_timber` | Import pressure and limited locality timber catchment |
| Metal / tools | `metal`, `iron_tools` | Metal pressure; nearby Harbormast has iron-tool demand, not a proven local mine |

The model's *authoredPosture* is calculated from `settlement.economicModel`, `domesticResourceProfile` and `tradeDependencyProfile`. It retains the exact authored keys, so no stale speculative new `itemKey` is smuggled into the economic ledger. Actual item IDs, stock units, price rules, merchant inventory and player buying remain with existing items/market/economy/trade owners. **No localStorage market store, duplicate `settlement_economies.json`, initial player coin, vendor, production multiplier, stock quantity or artificial price has been added.**

The Starfall World JSON has an `economyBootstrap` intent referencing the existing economy owner, three local IDs, two external IDs, these five focus families, and **null price/stock/rate state**. On future World creation, instantiate the real owner-backed simulation using a versioned World clock/head and persist it exactly once through an approved World Save registry. Do not recalculate accepted stock on every Load, erase depletion or rewrite dynamic economy merely because static content changed. Reconnection/multi-tab clients must read the one accepted market state.

## 4. Explicit proof and future gates

New test source:
- `tests/unit/starfall-map-geography.test.mjs` (four cases): point-in-polygon map alignment for five settlements, file/dimensions witness for both rasters, source-layer differentiation, unresolved ferry endpoints.
- `tests/unit/starfall-base-economy.test.mjs` (three cases): derive exact focus goods from existing settlement records, reuse existing civilization engine without clock mutation, no fabricated shop/stock ownership.
- Existing `tests/unit/starfall-world-template.test.mjs` (five cases): World seed, geography links, local-grid connectivity, empty owner records and unspawned ecology.

**Connector-only checks:** the point-in-polygon computation was executed read-only in the connected GitHub source context and confirmed all five settlement anchors in the expected Myridian geometry and chaparral/climate parts. Static source inspections found no executable Foammarket ferry route or owner-backed Starfall scene/merchant resources. These do **not** substitute for running `node --test`, a direct Node/Vite build, or decoding the supplied elevation PNG.

**Next local commands:** 
```sh
node --test tests/unit/starfall-map-geography.test.mjs tests/unit/starfall-base-economy.test.mjs tests/unit/starfall-world-template.test.mjs
node scripts/audit-starfall-raster.mjs
npm --prefix ./apps/rpg-ui run typecheck:node
```

The next World/Save stage must approve which World registry/clock owns the result and validate the exact 28×18 *local* area placement against the sampled source coastline and relief. No real player inventory, economic simulation World Save, or World Creator route has yet been registered.
