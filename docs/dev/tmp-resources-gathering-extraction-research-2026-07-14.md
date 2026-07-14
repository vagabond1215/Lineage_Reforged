# GPT-DR.resources.gathering-extraction Research

- Date: 2026-07-14
- Gate: `GPT-DR.resources.gathering-extraction`
- Repository baseline: `b4d5932aad7bb305c1276479b04e18b1b4496e32` on clean `master`
- Status: temporary cited research artifact; non-canonical until the cross-domain research integration dispositions it
- Scope: documentation and research only; no content, schema, validator, test, runtime, UI, save, migration, asset, dependency, economy-behavior, gathering, extraction, or gameplay change

## 1. Gate Result

The repository should not treat a resource name, a biological or geological source, a placed source site, an inventory output, a bulk market commodity, and an extraction action as interchangeable concepts. The live repository already has strong item, flora, fauna, mineral, habitat, biome, regional-ecology, production-chain, workplace, tool, skill, and spatial-supply foundations, but only two planned `world.resources` and two planned `world.commodities`. Its 22 extraction-method descriptors and production-chain `extract.*` stages are macro vocabulary, not placed nodes or executable actions.

External evidence supports a relationship-first integration posture:

1. A source is usable only through a particular species or deposit, place, season or environmental window, access regime, technique, tool set, and initial-preparation route.
2. “Renewable” means capable of regeneration under compatible timing, intensity, and management. It does not mean inexhaustible.
3. Geology, hydrology, biology, transport, fuel, water, skill, maintenance, and operating scale are better compatibility tests than a single century label.
4. Initial preparation is not one universal `gather` step. It may include field sorting, trimming, washing, draining, splitting, drying, grading, roughing, hand picking, crushing, or concentration, depending on the source.
5. The strongest likely static gains are explicit source-to-output, source-to-method, method-to-workplace/tool/skill, environment, and preparation relationships. Most common raw outputs already have item identities.
6. Exact yields, depletion, regrowth, stock movement, access enforcement, labor, time, fuel consumption, quality rolls, hazards, contamination events, item creation, and save persistence remain unauthorized runtime or authored-balance decisions.
7. Ordinary extraction remains the baseline. Magic may later assist bounded operations, but cannot create free matter, erase ecology or rights, guarantee safety, or imply universal industrial throughput.

This gate does not authorize new ids or exact transformations. It supplies evidence and candidate dispositions for the later unversioned integration.

## 2. Method, Authority, And Source Quality

### Claim authority

- **Repository fact:** directly observed in the baseline commit and controlling for current ownership.
- **External evidence:** a sourced real-world relationship or case; informative but non-canonical.
- **Design inference:** a repo-compatible interpretation of evidence, explicitly not fact or implementation permission.
- **Integration candidate:** a possible static identity, relationship, or precondition that the later integration must accept, revise, defer, or reject.
- **Runtime reservation:** behavior that requires a future authority and cannot be smuggled into static content.

### External-source quality

- **A1 — primary authority:** government or intergovernmental technical guidance, code, or standard.
- **A2 — peer reviewed:** journal research or formal scholarly synthesis.
- **B1 — official evidence:** government, national-museum, or heritage archaeology and historical-environment evidence.
- **B2 — institutional evidence:** university, professional excavation, or government-extension material with narrower transferability.
- **C — contextual analogue:** a site-specific modern analogue or contextualized historical source; useful for constraints, not a universal baseline.

Modern safety, conservation, and handling guidance is used for physical, biological, and risk relationships. It is not evidence that Lineage: Reforged should copy modern institutions, exact limits, or numerical standards. Historical and archaeological cases demonstrate possibilities and dependencies, not a single universal technological ladder.

## 3. Live Repository Baseline And Owners

### Exact catalog baseline

| Catalog | Live count | Gate-relevant posture |
| --- | ---: | --- |
| `items.items` | 1,372 | Canonical inventory item keys; 1,114 are `commodity` class and 131 are tools. |
| `civilization.market_item_values` | 1,617 | Static value authority; every item key has coverage, plus 245 market-only flora/fauna identity keys. |
| `world.resources` | 2 | Planned descriptive identities only: iron ore and grain. |
| `world.commodities` | 2 | Planned bulk-trade identities paired to those two resources. |
| `world.flora` | 117 | Biological source authority with 199 unique, item-resolved output keys across templates. |
| `world.fauna` | 132 | Biological source authority with 459 unique, item-resolved output keys across templates. |
| `world.minerals` | 56 | Geological source authority; all 56 item keys resolve in items and market values. |
| `world.habitats` | 93 | Habitat authority. |
| `world.biomes` | 36 | Biome authority. |
| `world.regional_ecology_profiles` | 9 | Regional ecology and broad supply-pressure authority. |
| `civilization.extraction_methods` | 22 | Thin macro descriptors: id, resource domain, method, and output multiplier. |
| `civilization.production_chains` | 121 | Macro process context; 71 chains list at least one extraction stage. |
| `civilization.workplaces` | 58 | Static workplace identities; 15 are extraction-category workplaces. |
| `player.skills` | 121 | Static skill identities; 18 are resource spotting, identification, gathering, or extraction skills. |
| `crafting.recipes` | 12 | Planned bounded transformations; unchanged by this gate. |

The current two resource/commodity pairs are:

- `resource.iron_ore` -> item key `iron_ore` -> `commodity.iron_ore_lots`;
- `resource.grain` -> item key `grain_bundle` -> `commodity.grain_bundles`.

Both resource and commodity records explicitly deny nodes, stock, extraction or harvest execution, cargo, storage, runtime, UI, save/account, and gameplay behavior. Neither pair currently links to a production chain. The resource schema can reference flora, fauna, biome, habitat, region, and map-feature ids, but it has no `relatedMineralIds` or regional-ecology-profile reference. Direct mineral or regional-ecology linkage is therefore a `schema_or_validator_precondition`, not something prose should pretend already exists.

### Current owner map

| Concept | Current owner | What it owns | What it does not own |
| --- | --- | --- | --- |
| Stable material/resource identity | `world.resources` | Planned descriptive natural-material identity and allowed static references | A placed deposit, stock, yield, action, price, or inventory instance |
| Species or mineral source | `world.flora`, `world.fauna`, `world.minerals` | Source taxonomy, biological/mineral properties, template outputs | Placed node quantity, access, harvest action, or market aggregation |
| Ecology and geography | habitats, biomes, regional ecology, localities, hexes, settlements | Compatibility and descriptive source/supply context | Canonical resource ids inferred from free-form tags or automatic node placement |
| Harvested or extracted inventory form | `items.items` | Canonical item key, class, stage, roles, tags, and item metadata | Source population, location, depletion, price behavior, or extraction action |
| Static value | `civilization.market_item_values` and relevant source owner | Static value coverage and source/value metadata | A resource identity or real-time price simulation |
| Bulk trade aggregation | `world.commodities` | Planned static trade class paired to item/resource identities | Inventory stack, price, shipment, storage, or vendor behavior |
| Macro process context | `civilization.production_chains` | Stages, broad inputs/outputs, variants, workplaces, and relationships | Automatically inherited recipe ratios or executable gathering/crafting behavior |
| Bounded transformation | `crafting.recipes` | Explicit game-scale input/output quantities when separately authored and accepted | Macro sector simulation or extraction-node behavior |
| Workplace/tool/skill identity | workplaces, items, skills | Static capability vocabulary | Automatic crosswalks, labor simulation, wear, timing, or action execution |
| Spatial resource availability | civilization engine derived state | Read-only derivation of flora/fauna/mineral availability and settlement supply capability | `world.resources`, commodities, extraction methods, nodes, quantities, depletion, actions, or inventory mutation |
| Gathering/extraction execution | No general owner | Nothing yet | Nodes, commands, yields, quality, hazards, rights enforcement, item creation, and persistence |

### Existing spatial consumer: important correction

`packages/engines/civilization-engine/src/spatial-world.ts` already derives 305 flora/fauna/mineral sources, hex availability, settlement access, and supply capability. Shared contracts include `HexResourceAvailabilityState`, `SettlementResourceAccessState`, and `SettlementSupplyCapabilityState`; settlement simulation and economy code consume that derived context.

This is not a gathering system. It does not load `world.resources`, `world.commodities`, or `civilization.extraction_methods`; place resource nodes; track quantities; deplete or regenerate sources; execute harvest actions; roll yields or hazards; create item instances; mutate player inventory; or persist extraction state. The precise baseline statement is therefore: **there is spatial resource-access and supply derivation, but no general gathering/extraction execution owner.**

### Extraction vocabulary is descriptive, not executable

The 22 extraction-method descriptors cover 12 flora, 4 fauna, and 6 mineral domains. Across production chains:

- `stages` contains 93 extraction occurrences using all 22 method ids;
- `recipeProfile.processingSteps` contains 84 extraction occurrences across 66 chains and 21 extraction ids;
- 82 of those 84 extraction steps are empty `gather` steps;
- only the bread and flour chains emit `grain_bundle` from an extraction step;
- no extraction processing step has an input or a skill check;
- five chains list extraction stages without extraction processing steps;
- `extract.salt.brine_evaporator` appears as a macro stage but never as a processing step.

Representative live abstractions are useful but intentionally incomplete:

| Chain | Live abstraction | Gate interpretation |
| --- | --- | --- |
| `chain.forage.wild_harvest` | empty woodland `gather`, then a gatherers-hut step emits several wild outputs | Macro source and sorting context, not evidence that one site or action yields every output. |
| `chain.fuel.firewood_bundle` | empty logging gather, camp/fuel-yard processing, then fuel bundle plus bark, kindling, and ash | Broad chain context; it does not authorize exact coproduct ratios or make ash a harvest output. |
| `chain.lumber.plank` | empty logging gather, sawmill emits plank, sawdust, and resin | Useful downstream relationship; raw resin gathering and incidental resin at a sawmill must not be conflated. |
| `chain.masonry.cut_stone` | empty quarry gather, masons yard emits cut stone, gravel, and tile | Macro quarry-to-masonry route, not a universal quarry yield. |
| `chain.metal.iron_ingot` | empty deep-shaft gather, smelter/forge steps emit ingot, slag, and forge scale | Extraction, dressing, smelting, and forging remain distinct even when a chain compresses them. |
| `chain.ceramics.vessel` | empty clay and peat gathers, pottery-kiln transformation | Clay extraction, clay preparation, fuel supply, and firing are separate dependencies. |
| `chain.reed.thatch` | empty riverbank gather, riverbank and weaving workplaces | A reedbed source, a gathering place, and a weaving workplace should not collapse into one object. |

### Existing identities argue for relationship-first expansion

Common gate-relevant item identities already include `log`, `firewood`, `kindling`, `fuel_bundle`, `bark`, `sawdust`, `charcoal`, `resin`, `clay_raw`, `river_sand`, `gravel`, `stone_block`, `stone_rubble`, `peat_block`, `mineral_brine`, `salt`, `salt_crystal`, multiple metal ores, `river_reed`, wild plant/fungal outputs, and species-specific fish meat, bone, scale, skin, roe, liver, oil, and shell outputs. Residue identities such as ash, slag, forge scale, and scraps also exist.

The artifact must not infer item aliases from market coverage. All 249 flora/fauna identity ids appear as market keys; four flora ids are also canonical item keys, leaving 245 market-only identity keys. Those market-only keys are not inventory aliases. Likewise, locality `resourceCatchment`, hex `resourceAffinityTags`, regional supply terms, settlement supply/demand arrays, and trade-flow goods are descriptive vocabularies that mix materials with services. They are not automatic resource candidates.

Two adjacent value discrepancies were observed (`mineral.gold_ore` versus item/market gold ore, and item versus market handcart values). Values remain with their existing source/item/market owners and are outside this gate; this artifact neither copies nor resolves them.

## 4. Required Conceptual Separation

| Layer | Definition | Example | Persistence/authority posture |
| --- | --- | --- | --- |
| Resource identity | Stable category of naturally sourced material | iron-bearing ore, timber, clay, brine | Possible `world.resources` identity; descriptive only unless later expanded |
| Source entity | Species, organism, population type, or mineral/deposit type that can provide material | birch, salmon, iron ore mineral record | Existing flora/fauna/mineral authority |
| Source site | A particular stand, bed, seam, pit, reef, run, reedbed, fishing ground, or exposed deposit | managed coppice, shallow clay pit, tidal fish weir | No general owner; future static-placement and/or runtime decision |
| Harvested/extracted output | Portable inventory form immediately obtained or field-prepared | log, raw clay, whole catch, selected ore | Existing item authority; source relationship may be missing |
| Prepared material | Output changed enough to suit storage or the next process | seasoned firewood, washed concentrate, cleaned clay | Item or recipe/chain candidate only when a live consumer needs the distinction |
| Market commodity | Bulk trade category grouping one or more item representations | ore lots, bundled grain | Planned commodity authority; not required for every item |
| Process chain | Macro route connecting source, preparation, refinement, and finished use | ore -> concentrate -> ingot -> tool | Existing production-chain authority; non-inheriting for exact recipe quantities |
| Runtime action/state | Player or simulation behavior and changing source state | mine, net, cut, deplete, regrow, grant item | No general extraction owner; explicitly deferred |

A future placed source site must not duplicate the entire flora/fauna/mineral record. It should reference the source authority and add only placement-specific facts such as location, access posture, broad condition, or supported method—if and when a static site authority is approved.

## 5. Evidence Synthesis By Extraction Lane

### 5.1 Wild plants, fungi, and other gathered biological materials

FAO and USDA syntheses show that non-wood forest products range from subsistence gathering to bulk trade and remain vulnerable to overharvest. Sustainable use depends on the source population, regenerative capacity, harvested part, technique, and local social and cultural context, not merely on classifying a product as wild or renewable ([FAO NWFP](https://www.fao.org/4/y4496e/Y4496E19.htm), A1; [USDA Forest Service synthesis](https://research.fs.usda.gov/treesearch/63162), A2).

WHO guidance supports distinguishing fruit, leaf, bark, root, flower, and other harvested parts because removal pressure and preparation differ. Identification, clean collection, field sorting, protection from soil or contamination, and suitable drying are meaningful relationships; exact collection percentages and calendars remain species- and site-specific ([WHO medicinal-plant guidance](https://www.who.int/publications/i/item/9241546271), A1).

The defensible abstraction is:

`identified species/population + correct habitat/season/part + access -> selective pick/cut/dig/tap -> field sort/trim/clean -> fresh bundle or prepared botanical output -> later drying/extraction/crafting`

Residues include soil, stems, leaves, bark chips, damaged or contaminated material, rejected lookalikes, and spoiled material. Hazards include poisoning or misidentification, thorns/stings, contaminated ground, falls, mould, and damage to the source population. Extension guidance reinforces that wild mushrooms require positive identification and that uncertain specimens should not be consumed ([University of Minnesota Extension](https://extension.umn.edu/gathering-wild-grown-plants-and-fungi/harvesting-morel-mushrooms), B2). Fungal evidence does not justify a universal “cut rather than pick” rule; a long-term study found site-specific effects and showed that trampling can matter independently of the harvest technique ([Egli et al.](https://doi.org/10.1016/j.biocon.2005.10.042), A2).

Raw resin must remain distinct from pitch, rosin, tar, or turpentine; sap must remain distinct from syrup; a fruit body must remain distinct from persistent mycelium; a cut reed or bast stem must remain distinct from retted and separated fiber. A Historic England thatching survey documents region-specific reed supply and preparation ([Historic England thatch survey](https://historicengland.org.uk/research/results/reports/30-2023), B1), while peer-reviewed nettle-fiber work supports retting and fiber separation as post-harvest transformations ([Bodros and Baley](https://doi.org/10.1177/0040517510391698), A2). A modern northeastern North American maple-production analogue likewise separates tapping and sap collection from later syrup processing ([Penn State Extension](https://extension.psu.edu/maple-syrup-production), B2). Nair's FAO proceedings chapter describes species-specific resin-tapping practices and less-damaging approaches; it does not establish one universally safe tapping action ([FAO resin-tapping proceedings](https://www.fao.org/4/y4496e/Y4496E29.htm), B2). These distinctions are strong `missing_static_relationship` candidates and only conditional `missing_static_identity` candidates.

### 5.2 Forestry, wood fuel, and charcoal

Wood is renewable only when regeneration, harvest intensity, browsing pressure, access, and site condition permit it. Coppice is a managed cycle suited to some broadleaves, not a universal behavior for every tree, and exact rotations are species- and site-dependent ([Forest Research silviculture](https://www.forestresearch.gov.uk/tools-and-resources/fthr/biomass-energy-resources/fuel/woodfuel-production-and-supply/woodfuel-production/forestry-for-woodfuel-and-timber/silviculture/), A1). The Westonbirt case shows managed coppice yielding distinct rods, poles, fuel, bark, charcoal feedstock, and timber rather than one generic “wood” output; it is site-specific evidence, not a universal product list ([Forestry England coppice](https://www.forestryengland.uk/westonbirt/coppice), C).

The source-to-finished route is:

`managed stand/coppice or authorized woodland -> select/fell/cut stems -> delimb and sort -> haul -> log/pole/firewood/bark -> split/saw/season -> lumber, fuel bundles, components, or charcoal -> finished construction/craft/fuel use`

Axes, saws, billhooks, wedges, ropes, hooks, carts or sleds, and animal or water-powered transport may all be compatible at different scales. A woodcutters camp, sawpit/sawmill, fuel yard, drying stack, and charcoal platform are distinct persistent facilities. Initial fuel preparation includes splitting and stacking for airflow and rain protection; exact drying time is not portable across species, dimensions, weather, and storage arrangements ([Forest Research woodfuel](https://www.forestresearch.gov.uk/tools-and-resources/fthr/biomass-energy-resources/fuel/woodfuel-production-and-supply/woodfuel-processing/), A1; [USDA Wood Handbook](https://www.fpl.fs.usda.gov/documnts/fplgtr/fplgtr282/chapter_13_fpl_gtr282.pdf), A1).

Brash, bark, chips, sawdust, offcuts, rejected wood, charcoal fines, ash, and smoke are plausible residues at different stages. They should not all be emitted by the harvest action. Charcoal is a transformation requiring prepared wood, a clamp/platform or kiln, restricted air, active monitoring, and quenching; archaeology links charcoal platforms to managed woodland and industrial consumers ([Historic England charcoal platforms](https://historicengland.org.uk/research/results/reports/8912/InvestigationofcharcoalburningplatformsatBarbonParkBarbondaleCumbria), B1).

Routine stump/root extraction is rejected as a default wood-gathering abstraction because it is materially more disruptive than stem harvest and carries different soil and ecological consequences ([Forest Research stump harvesting](https://www.forestresearch.gov.uk/research/stump-harvesting/), A1).

### 5.3 Fishing and aquatic gathering

Small-scale fisheries include capture or harvest, handling, processing, trade, and consumption. Manual or low-cost technology still depends on skill, suitable tools, and infrastructure that prevents loss and keeps catch fresh ([FAO small-scale fisheries value chains](https://www.fao.org/voluntary-guidelines-small-scale-fisheries/key-thematic-areas/value-chains--post-harvest-and-trade/4/en), A1).

The source-to-finished route is:

`species/population + water body/run/tide/season + access + suitable gear -> set/cast/trap/collect -> haul -> sort and return unwanted catch where viable -> wash -> bleed/gut when species and circumstances require -> drain/cool or land promptly -> whole/species output -> later salt, smoke, dry, cook, render, or craft`

Hooks and lines, pots, traps, set nets, seines, boats, oars or sail, baskets, knives, net weights/floats, and clean containers support different scales and selectivity. Gear type, mesh, location, season, soak time, and maintenance affect catch composition, damage, bycatch, habitat effects, and lost-gear risk; this is more defensible than a universal gear-quality ladder ([FAO fishing gear measures](https://www.fao.org/4/Y3427E/y3427e04.htm), A1).

Fish weirs are fixed source-site infrastructure rather than handheld tools. Historic England documents timber, stone, wicker, basket, and net relationships in riverine and tidal fisheries ([Historic England fish weirs](https://historicengland.org.uk/images-books/publications/iha-river-fisheries-coastal-fish-weirs/), B1). UNESCO’s Budj Bim case demonstrates that a fishery can be a maintained hydrological and cultural system tied to seasonal migration, collective knowledge, and customary ownership rather than a generic spawn node ([UNESCO Budj Bim](https://whc.unesco.org/en/list/1577), B1).

Initial catch handling can produce blood, offal, scales, bone, shell, damaged catch, and wastewater, but which coproducts become items is species- and consumer-dependent. FAO handling guidance supports careful sorting, washing, protection from contamination and heat, and context-dependent gutting; it is a modern safety analogue, not a numerical spoilage model ([FAO handling](https://www.fao.org/flw-in-fish-value-chains/value-chain/capture-fisheries/on-board-handling-in-small-scale-fisheries/appropriate-technology/en/), A1). Shellfish require a separate safety boundary: harvest-water status and marine-biotoxin risk cannot be inferred from ordinary freshness or appearance ([FDA seafood guidance](https://www.fda.gov/food/resources-you-food/seafood), A1; [FDA paralytic-shellfish-poison guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cpg-sec-540250-clams-mussels-oysters-fresh-frozen-or-canned-paralytic-shellfish-poison), A1). Fishing hazards include weather, drowning, hooks, entanglement, slippery surfaces, heavy loads, fatigue, and dangerous catch ([FAO occupational hazards](https://www.fao.org/fishing-safety/risk-management/occupational-hazards/en/), A1).

### 5.4 Clay, sand, gravel, and peat

Clay source and preparation vary with geology, accessibility, transport, ownership, material properties, and cultural practice. Archaeometric evidence supports raw, cleaned, mixed, and tempered routes, but also shows that minimally processed clay may be deliberately suitable; mixing is not a universal improvement tier ([Amicone et al.](https://discovery.ucl.ac.uk/id/eprint/10096813/), A2; [Ho and Quinn](https://discovery.ucl.ac.uk/id/eprint/10125531/), A2).

The clay route is:

`clay bed/borrow pit + access -> expose/dig source (remove overburden only where present) -> raw clay -> optional crush/sieve/settle/levigate/mix/temper -> prepared clay body -> form/dry/fire -> vessel, brick, tile, or other ceramic`

Extraction yields coarse rejects, stones, roots, overburden, settling sediment, and wastewater. Puddling, tempering, forming, and firing are later material/crafting operations even if a macro production chain compresses them.

Sand and gravel routes are:

`channel/floodplain/terrace/coastal or pit deposit -> dig/scoop -> optional wash/sieve/grade -> use-specific fraction -> construction, abrasive, mortar, or glass chain`

Mineralogy matters as well as grain size. Washing or sieving can grade a material but cannot make chemically unsuitable sand into glass-quality feedstock ([Historic England glassworking guidance](https://historicengland.org.uk/images-books/publications/glassworkingguidelines/heag259-archaeological-evidence-for-glassworking/), B1; [Freestone](https://discovery.ucl.ac.uk/id/eprint/1543113/1/Freestone%20Glass%20production%20in%20the%20first%20millennium%20CE.pdf), A2). Silt, organic matter, shells, oversize stones, fines, and wastewater are likely residues. Channel alteration and aquatic habitat effects are relevant environmental constraints, but modern in-stream mining evidence does not set a historical technique or gameplay formula ([USGS](https://pubs.usgs.gov/of/2002/ofr-02-153/), C).

Peat is a slowly accumulated fuel source, not renewable on ordinary human gameplay timescales. Forest Research notes that peat accumulation is slow and can continue over millennia, which supports the qualitative classification without supplying a game formula ([Forest Research peatlands factsheet](https://www.forestresearch.gov.uk/publications/factsheet-peatlands-forestry-and-climate-change/), A1). A conservative design-inference route—not a historically sourced universal sequence—is `authorized peatland -> cut turf -> air-dry cut turves -> stack/haul -> peat block -> fuel -> ash/smoke`. Weather, transport, and peatland condition would matter; exact cutting, recovery, or drying parameters remain unresearched for canon. Peatland damage and exposed cuttings are material consequences, not automatic runtime mechanics.

### 5.5 Stone quarrying

Historic and archaeological evidence supports surface collection, open trenches, pits, quarry faces, and deeper workings depending on geology and topography. Natural joints, bedding, intended block form, overburden, tool access, and transport determine whether extraction yields rubble, rough stone, or dimension-quality blocks ([Historic England pre-industrial mines and quarries](https://historicengland.org.uk/images-books/publications/iha-preindustrial-mines-quarries/heag223-pre-industrial-mines-and-quarries/), B1). In-situ wedge evidence demonstrates joint-controlled extraction in a specific case, not a universal method for every stone ([Parker Pearson et al.](https://discovery.ucl.ac.uk/id/eprint/10163289/), A2).

The route is:

`outcrop/boulder/bed + rights and transport access -> clear overburden -> channel/pry/split along workable planes -> rough block or rubble -> on-site roughing and sorting -> haul -> mason dressing -> cut stone/tile/component -> construction or craft use`

Picks, hammers, chisels, wedges, levers, ropes, sledges/carts, cranes or hoists, and animal labor support different block sizes and scales. Quarry camp, face, roughing floor, loading place, road, and masons yard are distinct. Residues include overburden, scree, rejected stone, broken rough-outs, chips, fines, and dust. Hazards include unstable faces, falling stone, heavy loads, tool strikes, dust, and transport failures.

The existing `stone_block`, `stone_rubble`, gravel, and downstream stone identities may already cover the useful game-scale distinction. A new “rough dimension block” identity is justified only if live consumers cannot express that distinction with existing items.

### 5.6 Metal ores and mineral extraction

Archaeological evidence strongly supports separating mine extraction from ore dressing. A defensible order is:

`deposit/lode/seam/placer + rights -> surface collection/open cut/pit/shaft/gallery -> excavate and haul run-of-mine material -> hand-pick ore from waste rock/gangue -> break/crush/grind as needed -> size or gravity separate with water where suitable -> concentrate -> smelt/refine -> ingot and downstream metal product`

Historic England’s Ashnott survey records run-of-mine material moved from shafts to a dressing area, broken to liberate ore, and washed with leat-supplied water, leaving paths, discard mounds, dressing waste, dams, and leats ([Ashnott Lead Mine](https://historicengland.org.uk/research/results/reports/6241/AshnottLeadMineRibbleValleyLancashire_AnArchaeologicalSurveyoftheLandscapeEvidence), B1). A Derbyshire mining landscape further ties ore access, water management, dumping and contaminated-ground controls, and institutional mining law together rather than placing ownership on the material itself ([Historic England designation evidence](https://historicengland.org.uk/listing/the-list/list-entry/1412782), B1). Peer-reviewed studies likewise distinguish waste-rock discard, crushing or grinding, gravity washing, concentrate, and durable contaminated tailings ([Tomczyk et al.](https://onlinelibrary.wiley.com/doi/abs/10.1002/arp.1963), A2; [Hrubý et al.](https://onlinelibrary.wiley.com/doi/full/10.1002/gea.22002), A2).

Manual selection and hammer dressing fit a small specialist operation. Water-powered grinding or stamping requires a reliable watercourse, engineered supply, maintenance, and sufficient throughput. Deep workings further require organized labor, timbering, haulage, drainage, lighting, ventilation, tool maintenance, and secure transport. A mine is therefore not simply a richer surface node.

Residues include overburden, barren waste rock, gangue, coarse dressing waste, fine tailings or slimes, contaminated sediment, and wastewater. ILO guidance confirms that small-scale surface mining still requires deliberate safety controls; this artifact uses it only to classify hazards, not to prescribe procedures or modern regulation ([ILO small-scale mines handbook](https://www.ilo.org/publications/safety-and-health-small-scale-surface-mines-handbook), A1).

An ore-concentrate identity is a plausible `missing_static_identity` only when multiple accepted smelting or trade consumers need it. Exact concentration ratios, grades, and particle-size ladders are not authorized.

### 5.7 Salt and brine

Salt must not collapse into one universal extraction route. Evidence supports at least:

1. `rock-salt deposit -> mine/haul/crush as needed -> rock salt`;
2. `saline spring or natural brine -> settle/concentrate/evaporate or boil -> salt`;
3. `brine-bearing coastal sand/silt -> wash/filter to concentrate brine -> settle/boil -> salt + large sandy waste`.

Historic England describes pre-industrial salterns as source, collection, concentration, evaporation, fuel, vessel, and waste systems; coastal evidence includes filtration material, settling, heated vessels, and substantial waste mounds ([Pre-industrial salterns](https://historicengland.org.uk/images-books/publications/iha-preindustrial-salterns/), B1; [Norfolk coastal archaeology](https://historicengland.org.uk/research/results/reports/8604/TheArchaeologyofNorfolk%E2%80%99sCoastalZone_ResultsoftheNationalMappingProgrammeMainReport), B1). UNESCO’s Hallstatt landscape demonstrates that salt extraction, timber supply, transport, institutions, and regional prosperity can become one coupled cultural system rather than separate flavor labels ([UNESCO Hallstatt](https://whc.unesco.org/en/list/806/), B1).

Solar concentration depends on aridity, humidity, rainfall, the saline source, and basin or shore form. Heated evaporation consumes fuel and requires heat-resistant pans or vessels, clean brine handling, and supervision. Underground salt inherits general mine risks and infrastructure. Residues can include silt, filtration waste, residual brine, combustion ash, broken evaporation vessels or briquetage, vitrified soil, spoil, and mine debris. No route supports an exact universal recipe or yield.

## 6. Source-To-Finished Chain Matrix

The following are relationship maps, not recipes. Arrows show dependency order; no arrow authorizes an item id, integer quantity, duration, or execution behavior.

| Lane | Source through initial preparation | Downstream finished route | Meaningful coproducts/residues | Boundary disposition |
| --- | --- | --- | --- | --- |
| Wild plants | species/population -> identify part/window -> pick/cut/dig -> sort/trim/clean -> fresh bundle | dry, steep, grind, extract, weave, compound, cook | stems, soil, damaged/toxic rejects, spoiled material | Source/part/habitat/season are static candidates; yield/regrowth are runtime reservations. |
| Fungi | habitat/mycelium -> fruiting window -> identify -> ventilated harvest -> sort/trim | cook, dry, medicine or reagent processing | trim waste, rejected lookalikes, spoilage | Keep fruit body distinct from mycelium; no universal harvest rule. |
| Timber | managed stand -> select/fell -> delimb/sort/haul -> log/pole/bark/firewood | saw/split/season -> lumber, components, fuel, charcoal | brash, bark, chips; sawdust/offcuts arise later | Most item identities exist; prioritize management and process relationships. |
| Reeds/bast | reedbed or compatible stem plant -> seasonal cut -> align/sort/dry/bundle | thatch/mat, or retting -> fiber -> textile/cordage | leaves, short stems, shives, tow, retting liquor | Reedbed is not every riverbank; retting belongs to later processing. |
| Resin/sap | compatible mature tree -> controlled tap -> covered collection -> strain/store raw output | resin -> pitch/rosin/etc.; sap -> concentrated product | bark/wood debris, dirty or spoiled material | Preserve raw-versus-processed identities; calendars remain authored input. |
| Fish/shellfish | water/run/tide -> suitable gear -> capture -> sort/wash -> gut/bleed if appropriate -> drain/cool/land | fresh market, salt/smoke/dry/cook/render/craft | bycatch, damaged catch, offal, blood, bone, scales, shells, wastewater | Species templates own outputs; harvest-water/biotoxin safety and source stock, season, and action need future owners. |
| Clay | deposit/pit -> expose/dig, removing overburden only where present -> raw clay -> optional cleaning/mixing/temper | form/dry/fire -> brick, tile, vessel, ceramic | overburden, stones, roots, settling silt, wastewater, firing breakage | Optional branches, not a universal quality ladder. |
| Sand/gravel | deposit -> dig/scoop -> optional wash/sieve/grade | construction, mortar, abrasive, or glass feed | silt, shells, organic matter, oversize, fines, wastewater | Use-specific suitability may be a relationship; avoid grade catalog explosion. |
| Peat | peatland -> cut turf -> air-dry/stack/haul -> peat block | fuel use | vegetation/overburden, cuttings, smoke, ash | Nonrenewable at ordinary play scale; no recovery formula. |
| Stone | outcrop/bed -> clear -> split/pry -> rough block or rubble -> rough/sort/haul | mason dress -> component/building | overburden, reject blocks, chips, fines, dust | Existing block/rubble identities likely suffice; transport is a core constraint. |
| Metal ore | deposit -> excavate/haul -> hand sort -> crush/grind -> wash/separate -> concentrate | smelt/refine -> ingot -> metal good | waste rock, gangue, tailings, slimes, sediment, wastewater, slag later | Concentrate is conditional identity; exact grade and ratio are blocked. |
| Salt | rock salt, natural brine, or saline sediment -> route-specific mine/filter/concentrate -> dry/crush | food, preservation, medicine, craft, trade | silt, sand, residual brine, ash, briquetage, mine spoil | Encode route diversity before any exact recipe. |
| Water/seasonal ice | spring/well/stream/rain/seasonal deposit -> draw/cut -> settle/filter/containerize as appropriate | drink, process water, cooling, transport, later magic-assisted storage | sediment, melt loss, contaminated water, broken containers | Source quality and access matter; purification, spoilage, and magic remain later gates. |

## 7. Technology Compatibility Without A Century Label

### Capability bands

| Access/scale band | Compatible capability | Required dependencies | Examples | Not implied |
| --- | --- | --- | --- | --- |
| 1. Household/subsistence | Portable hand collection and first sorting | Local knowledge, access, simple container/tool, immediate household labor | berries, fungi, shellfish, hook-and-line fish, loose fuelwood | Sustainable surplus, specialist identification, or bulk trade |
| 2. Village/town craft | Repeatable crew work and modest fixed facilities | Maintained tools, animal/human transport, shared drying/storage, local rights | woodcutters camp, clay or peat pit, fishing landing, reed yard, small quarry | Deep mining, continuous water power, or unlimited catchment |
| 3. Urban specialist | Specialized preparation and controlled heat/water | Skilled labor, purpose-built workplace, supply coordination, maintenance | saltern pans, ore dressing floor, charcoal kiln/platform, large sawpit/sawmill | Universal household access or modern precision |
| 4. Guild/temple/academy/military/major merchant | Capital-intensive, hazardous, or networked operation | Legal authority, organized labor, secure transport, timber/fuel/water, inspection/repair | deep shaft, major quarry, fixed fish weir complex, water-powered crushing | Automatic state ownership or identical institutions in every culture |
| 5. Elite/strategic/capital-scale | Rare throughput or strategic infrastructure | Large catchment, high security, specialized maintenance, political control | major salt/mining complex, exceptional lifting/drainage network | Free energy, modern industry, or unbounded output |
| 6. Exceptional/relic | Source-specific or unique capability | Explicit canon, rare expertise/material, failure and replacement posture | magical or ancient extraction aid | A new mundane baseline |

### Cross-cutting compatibility tests

Before a later integration accepts a technique, it should ask:

- Does the source’s geology, species biology, habitat, hydrology, or season support it?
- Is the intended output rubble, whole catch, a selected raw material, a concentrate, or a finished good?
- What transport path exists for bulky material, waste, tools, workers, and fuel?
- Does the process need clean water, running water, tide, wind, solar drying, controlled heat, drainage, or ventilation?
- Is the workplace temporary, seasonal, fixed, portable, or institutional?
- What maintenance, replacement parts, sharpening, cordage, containers, and storage are required?
- At what scale does a hand method become a crew, animal-power, water-power, or infrastructure problem?
- Which residues remain on site, which travel downstream, and which have a real consumer?
- Which rights, taboos, permits, customary claims, or security controls govern access?

Transport is often as important as extraction. Bulky stone, timber, wet clay, run-of-mine rock, fish, and brine can make a technically accessible source economically or institutionally unusable. This is a strong static lore and regional-supply relationship; actual haul cost remains economy/runtime owned.

## 8. Regional And Cultural Variation

### Evidence principle

Regional variation must change source availability, source form, technique, season, workplace, access, outputs, and failure pressure—not merely rename a universal recipe. Budj Bim demonstrates a fishery shaped by hydrology, seasonal animal movement, maintained infrastructure, collective knowledge, and customary ownership. Hallstatt demonstrates salt, mines, timber, transport, settlement, and institutional control as a coupled cultural landscape. FAO’s non-wood forest evidence likewise warns that user rights, processing, trade, ecology, and local knowledge are inseparable.

### Repo-compatible regional readings

These are design inferences from live regional ecology profiles plus external constraints, not new canon or source placement.

| Region/profile | Research-compatible emphasis | Constraint that prevents generic expansion |
| --- | --- | --- |
| Kaelvar | Dry uplands and Mediterranean-style coasts support authored mineral, stone, salt, pastoral, and drought-adapted gathering routes. Solar concentration may be more compatible than in wet regions where a saline source exists. | Dryness, limited bulk timber, water access, transport from uplands, and exact geology still require authored evidence. |
| Valtherion | River basins and mixed forests can support broad forestry, river fishing, clay, aggregate, and water-assisted preparation at settlement scale. | Population pressure, rights, water competition, and local source chemistry prevent “everything everywhere.” |
| Serathyl | Wet coasts and forest interiors fit timber, fish, resin, reeds, and specialized botanical gathering. | Persistent moisture changes drying/storage pressure; live profile explicitly limits metal and construction stone. |
| Draemor | Basin plains and wetlands fit riverbank gathering, reeds, clay, freshwater fishing, and fuel or peat only where a real peatland source is authored. | Agricultural land use, flooding, wetland ecology, and weak ore supply constrain broad extraction. |
| Talmyra | Tropical forest, mangrove, savanna, resin, rare hardwood, plant, and precious-mineral relationships can carry high regional identity. | Heat, humidity, access, source-population damage, contamination, and transport require different preparation and governance. |
| Myridian Chain | Marine capture, shellfish, pearls, seaweed, landings, boat/gear repair, and preserved catch fit the island economy. | Land scarcity, weather, clean water, imported timber/metal, and limited inland source sites dominate capability. |
| Lantern Isles | Warm-island fisheries, intertidal gathering, reeds/mangrove edges, citrus and specialized wood lots can support small-scale diversity. | Fragmentation, storm exposure, reef access, limited draft animals, grain, and iron constrain scale. |
| Serpent’s Wake | Salt fish, mangrove timber, dyestuffs, salvage, and passage services fit a hazardous maritime route. | Political instability, storms, rights/security, and ecological fragility make reliability more important than nominal abundance. |
| Dawnreach Isles | Cold-water fishing, conifer timber, resin, furs, and seasonal harvest windows fit the profile. | Short seasons, weather, transport, cold exposure, limited grain/textiles/forged metal, and low carrying capacity constrain infrastructure. |

Access vocabulary for future authored consideration may include household/private, customary/common, community-managed, leased, guild, temple, crown/state, protected, taboo, disputed, and prohibited. These are not synonyms and must not be assigned by resource type alone. Their enforcement and changing ownership are runtime or narrative-authority questions.

## 9. Tools, Workplaces, Energy, Environment, And Scale

### Static relationship findings

The live repo has 15 extraction-category workplaces and 18 resource skills, but no explicit extraction-method-to-source/output/workplace/tool/skill crosswalk. Extraction workplace jobs use 45 distinct `tool.*` requirement tags; those tags are vocabulary, not guaranteed item references. `tool.axe` does not exactly resolve to an item key even though `lumber_axe` exists, and eight flora harvest-tool descriptors lack item identities. Only `lumber_axe` and `pickaxe` among 131 tool items currently have `useProfiles`.

This does not justify automatically adding tool items. The eight unresolved flora tool descriptors include `axe`, which overlaps the separate abstract `tool.axe` workplace tag. The evidence instead demonstrates a `schema_or_validator_precondition` and `authored_input_required`: decide whether a tool field is a capability tag, an exact item reference, or a separately governed descriptor before expanding it.

### Cross-lane matrix

| Lane | Portable tools | Persistent workplace/infrastructure | Energy/environment | Scale break |
| --- | --- | --- | --- | --- |
| Wild gathering | basket, knife, sickle, digging tool, covered vessel | optional gatherers hut, sorting/drying shed | human labor, solar/wind drying, clean water | commercial volume needs organized access, drying, storage, and transport |
| Forestry | axe, saw, billhook, wedge, rope, hook | camp, sawpit/sawmill, fuel yard, drying stack | human/animal/gravity/water; seasonal ground conditions | large timber and continuous fuel supply require roads, teams, and managed stands |
| Charcoal | shovel, rake, cover material, water | platform/clamp/kiln and guarded storage | biomass heat, restricted air, water, active monitoring | industrial consumers require catchment planning and skilled crews |
| Fishing | hook/line, net, pot/trap, knife, basket | boat, landing, weir, net shed, clean handling bench | human/wind/tide, weather, clean water | offshore, seine, or fixed-weir operations require crew and maintained infrastructure |
| Clay/peat/sand | spade, shovel, basket, screen, barrow | pit, drying ground, settling/washing area | human/animal, water, solar/wind drying | bulk extraction is transport- and land-disturbance limited |
| Quarry | pick, hammer, chisel, wedge, lever, rope | face, roughing/loading floor, road, crane/hoist, camp | human/animal/gravity; geology and drainage | block mass and haul distance force organized labor and infrastructure |
| Mining/ore dressing | pick, hammer, shovel, basket, sieve | cut/pit/shaft, timbering, hoist, drainage, dressing floor, leat, crushing/grinding facility | human/animal/water; lighting, air, drainage | depth and throughput add nonlinear safety, maintenance, timber, and capital requirements |
| Salt | scraper, shovel, bucket, filter, pan/vessel | saltern, brine pit, evaporation pan, mine | solar/wind or fuel heat; salinity, humidity, drainage | heated or underground production requires specialized infrastructure and secure transport |

Persistent workplaces are warranted where a maintained facility, crew base, environmental control, or public identity exists. An individual berry patch, mushroom fruiting, tap, cast net, drying stack, or exposed stone should not automatically become a workplace record.

## 10. Ecology, Seasonality, Hazards, Residues, And Ownership

### Static versus runtime boundary

| Concern | Static content may eventually express | Must remain authored/runtime unless separately approved |
| --- | --- | --- |
| Ecology | compatible source species, habitat/biome, broad source form, destructive-impact class | population counts, recovery, migration, spawning, ecosystem simulation |
| Seasonality | broad qualitative season/window where canonically stable | calendars, weather/tide checks, availability rolls, exact recovery time |
| Access | descriptive customary/institutional posture and lore | permission checks, trespass, changing ownership, enforcement, disputes |
| Hazard | qualitative hazard families and site lore | accident rolls, injury application, contamination events, death or loss formulas |
| Residue | identity or relationship when reused, traded, hazardous, or narratively visible | automatic coproduct yields, pollution accumulation, cleanup simulation |
| Yield/quality | relative or authored static transformation only when a bounded recipe owns it | source yield, grade rolls, depletion, bonuses, exact historical/scientific ratios |
| Labor/time/fuel | qualitative intensity metadata where already owned | worker scheduling, queues, timers, fuel consumption, wages, tool wear |

Residues merit item identities only when at least one of the following is true: a downstream process consumes them; they are traded or salvaged; they materially define a site or hazard; or authored lore repeatedly needs the distinction. Otherwise, “spoil,” “tailings,” “brash,” “offal,” or “silt” can remain process or description vocabulary. Modeling every particle grade, waste chemistry, local name, and intermediate pile is `rejected_complexity`.

## 11. Magic Interaction Classification

This section is **repo-canon design inference**, not external fact. The ordinary process and its constraints remain primary. The dedicated Gate 7 artifact owns deeper magitech research.

| Classification | Gate 1 posture | Examples eligible for later study | Guardrail |
| --- | --- | --- | --- |
| `mundane_only` | Default for source identity and ordinary extraction | hand gathering, forestry, quarrying, fishing, pits, ore sorting | No magic is required merely because the world contains it. |
| `mundane_baseline_magic_assisted` | Preferred class for bounded assistance | temporary light, cold holding, water-quality warning, controlled drying, fire monitoring, limited lifting or drainage | Must retain mundane structure, skill, access, maintenance, failure, and finite capacity. |
| `parallel_magical_specialty` | Possible only with explicit source/capability canon | specialist handling of magical flora/minerals or warded hazardous sites | Cannot be inferred from a tag or replace the ordinary route. |
| `magic_equivalent_institutional` | Defer to Gate 7 and explicit infrastructure authority | fixed pumping, ventilation, hoisting, cold rooms, secured containment | Institutionally rare, maintained, powered, inspected, and failure-prone. |
| `magic_exclusive` | Exceptional only | a source whose canon says mundane extraction is impossible | Requires explicit authored source and consumer; never a default tier upgrade. |
| `unstable_or_prohibited` | Reject | free matter creation, infinite seams, automatic regeneration, zero-cost purification, universal safety, or bypassing rights/ecology | Conflicts with the research-program guardrails. |

For perishable catch or botanical material, an ice-conditioned container is at most `mundane_baseline_magic_assisted`: insulation, seals, drainage, container strength, handling, recharge access, and ordinary cleaning remain necessary. Gate 1 does not assign shard/crystal/cluster capacity, temperature, volume, duration, or formula. Those belong to the later magitech gate and integration.

## 12. Content Candidate And Authority Matrix

Gameplay value uses `critical` (prevents owner/canon error), `high` (supports several systems or strong regional choice), `medium` (useful when a live consumer exists), `low` (mostly flavor), and `negative` (complexity or contradiction exceeds value).

| # | Candidate | Required classification | Proposed authority | Gameplay value | Confidence and disposition |
| ---: | --- | --- | --- | --- | --- |
| 1 | Preserve resource/source-site/output/commodity/action separation | `factual_correction` | Durable synthesis and later authority docs | critical | High; accept in integration. |
| 2 | Link resource identities to canonical source species/deposits and harvested item forms | `missing_static_relationship` | `world.resources` referencing flora/fauna/mineral and items | high | High concept; mineral links first need schema support. |
| 3 | Add mineral and, if justified, regional-ecology reference capability to resources | `schema_or_validator_precondition` | resource schema and validators | high | High gap confidence; exact shape requires later plan, not this gate. |
| 4 | Harden extraction-method records and decide whether their fields are ids or vocabulary | `schema_or_validator_precondition` | extraction-method schema/validator | critical | High; current thin catalog has no standalone schema/semantic validator. |
| 5 | Author method-to-source/output/workplace/tool/skill crosswalks | `missing_static_relationship` + `authored_input_required` | extraction methods with existing source/item/workplace/skill owners | high | High gap confidence; do not derive automatically from names. |
| 6 | Record broad source form and route where it changes the chain | `missing_static_relationship` | resource/mineral/source plus production-chain authority | high | High for salt, quarry, mine, clay, and fishery route diversity. |
| 7 | Record source-compatible habitat/biome/region relationships | `missing_static_relationship` | flora/fauna/mineral/resource and existing ecology owners | high | High for principle; never auto-promote free-form catchment tags. |
| 8 | Link existing flora `harvestableParts` explicitly to the item outputs they produce | `missing_static_relationship` | flora templates and existing item outputs | high | High; all 117 flora already name harvestable parts, but part and output arrays are not explicitly paired. |
| 9 | Record broad renewable-management/destructive-impact class | `authored_input_required` | source/ecology authority after schema decision | medium | Medium; useful for roots, bark, coppice, reeds, and resin. |
| 10 | Preserve raw resin vs processed pitch/rosin/tar and raw sap vs concentrate | `factual_correction` / `missing_static_relationship` | items and production chains | high | High; avoids source/process collapse. |
| 11 | Preserve fruit body vs mycelium and whole catch vs prepared parts | `factual_correction` / `missing_static_relationship` | flora/fauna/items/chains | high | High; existing identities already support much of this. |
| 12 | Add source-specific salt routes rather than one universal salt recipe | `missing_static_relationship` | resources/minerals/production chains | high | High evidence; exact items and recipes require collision/consumer audit. |
| 13 | Add extraction-to-ore-dressing macro relationships | `missing_static_relationship` | production chains | high | High process-order confidence; no exact quantities. |
| 14 | Add ore concentrate only when multiple accepted consumers require it | `missing_static_identity` + `authored_input_required` | items, market values, chains, recipes | medium | Medium; conditional, not pre-authorized. |
| 15 | Preserve rough block/rubble/dressed-stone distinction | `missing_static_relationship` | existing stone items and chains | high | High; likely no new identity needed. |
| 16 | Preserve raw/cleaned/prepared clay as optional branches | `missing_static_relationship` | items/chains/recipes | high | High; prepared-clay identity is conditional on live consumers. |
| 17 | Distinguish use suitability for sand without a universal purity ladder | `authored_input_required` / `optional_depth` | mineral/item/chain relationships | medium | Medium; chemistry matters, but catalog expansion can become noise. |
| 18 | Treat fixed fish weirs, major pits, mines, quarries, salterns, and managed stands as possible persistent source-site/infrastructure classes | `authored_input_required` | future source-site authority plus workplaces where appropriate | high | High concept; no owner exists yet. |
| 19 | Add only residues with reuse, trade, hazard, or repeated narrative consumers | `optional_depth` or `missing_static_identity` | items/chains/lore | medium | High rule; identity decisions remain consumer-driven. |
| 20 | Keep ordinary spoil, tailings, brash, silt, or offal as descriptive process terms when unused | `lore_or_description_only` | chains/site lore | low | High; avoids inventory clutter. |
| 21 | Reconcile abstract `tool.*` and harvest-tool descriptors with canonical items or explicitly keep them as vocabulary | `schema_or_validator_precondition` | tool/item/workplace/template authorities | critical | High; exact item auto-resolution would currently be false. |
| 22 | Place and persist individual nodes/source sites | `runtime_owner_required` + future authority decision | no current general owner | potentially high | Blocked; do not implement in static expansion. |
| 23 | Source quantities, yields, depletion, renewal, regrowth, migration, and seasonal availability | `runtime_owner_required` | future resource/ecology runtime and save owner | potentially high | Blocked; no formulas or exact values from research. |
| 24 | Access, ownership, customary rights, permits, trespass, and disputes | `runtime_owner_required` plus narrative authority | future world/faction/legal runtime | high | Static lore possible; enforcement and changing state blocked. |
| 25 | Gathering/mining/quarrying/fishing/foraging commands and item-instance creation | `runtime_owner_required` | future engine command/session/inventory owner | critical later | Blocked; Gate 1 provides no implementation permission. |
| 26 | Labor, fuel use, timers, queues, tool wear, quality, accident, and contamination rolls | `runtime_owner_required` | future production/extraction runtimes | medium to high later | Blocked and high-risk. |
| 27 | Bounded magical assistance | `authored_input_required` + later runtime owner | Gate 7 magitech synthesis and explicit magic infrastructure | medium/high | Defer; classify case by case. |
| 28 | Free resource creation or generic tag-driven magical extraction | `conflicts_with_canon` / `rejected_complexity` | none | negative | Reject. |
| 29 | One node per flora/fauna/mineral record, universal harvest calendars, or universal grade ladders | `rejected_complexity` | none | negative | Reject; source- and region-specific evidence does not support it. |
| 30 | Treat a chain stage, market-only identity key, or free-form regional good/service term as a canonical resource/item/node | `conflicts_with_canon` | none | negative | Reject. |
| 31 | Expand stable natural-material resource identities only when cross-owner relationships and live consumers justify them | `missing_static_identity` + `authored_input_required` | resources plus the relevant source/item owners | medium | Conditional; collision-audit and consumer evidence are prerequisites. |
| 32 | Add bulk trade-commodity aggregations only where handling or trade meaningfully differs from the portable item | `missing_static_identity` + `authored_input_required` | commodities, items, economy, and chains | medium | Conditional; do not create one commodity record per item. |

## 13. Uncertainty And Confidence

### High confidence

- Live counts, ownership boundaries, extraction-stage sparsity, missing crosswalks, and the spatial-resource consumer are repository facts at the named baseline.
- Source identity, source site, portable output, commodity, process chain, and runtime action require separate authority.
- Broad process order for forestry, fishing, clay, quarrying, ore dressing, and salt is well supported.
- Geology, hydrology, biology, transport, environmental conditions, and operating scale control technical compatibility.
- Renewable sources can be overharvested; source part and method change impact.
- External evidence does not authorize exact recipe or extraction quantities.

### Medium confidence

- Which qualitative season, access, destructive-impact, or source-form fields will provide enough gameplay value to justify schema expansion.
- Which existing item identities fully cover rough blocks, cleaned clay, concentrates, crude salt, and prepared botanical states.
- How modern conservation, food-handling, and safety relationships should be compressed into grounded fantasy metadata.
- Which residues should become items rather than chain or lore terms.

### Low or deliberately unresolved

- Exact yields, loss percentages, purity grades, depletion/regrowth rates, recovery periods, calendars, labor, time, fuel, transport cost, prices, quality, contamination probability, and hazard formulas.
- Final source-site schema, node placement, persistence, ownership, and command owners.
- Final magical throughput, vessel bands, recharge, failure, and accessibility.
- Whether any particular region contains a specific mine, pit, saltern, fishery, or managed stand beyond existing authored canon.

### Known evidence cautions

- Later extraction often destroyed earlier workings; archaeological absence is not proof of technical absence.
- Advanced historical mining descriptions show possible organized systems, not a universal baseline.
- Clay mixing can be difficult to distinguish from natural heterogeneity.
- Modern sand, fish-safety, forestry, medicinal-plant, and conservation sources are constraint analogues, not direct historical templates.
- A technique documented for one lithology, species, culture, or climate must not be generalized to all sources.

## 14. Integration Disposition

This artifact recommends that the later cross-domain integration:

1. accept the conceptual separation and relationship-first posture;
2. correct its baseline to acknowledge the existing spatial resource-access/supply consumer;
3. preserve items, flora, fauna, minerals, ecology, resources, commodities, production chains, recipes, workplaces, tools, skills, values, economy, and future runtime as distinct owners;
4. decide whether resource mineral/regional references and extraction-method validation are prerequisites for any broad static expansion;
5. collision-audit existing items before selecting any new raw, prepared, concentrate, or residue identity;
6. carry process order and qualitative dependencies into the revised `0.6.5` target without importing historical quantities;
7. reserve nodes, actions, yields, depletion, ownership, labor, fuel, time, hazards, quality, inventory mutation, and persistence;
8. keep this artifact temporary until all seven gates are integrated, promoted where durable, and then retired or explicitly retained.

The next executable research work remains `GPT-DR.ecology.flora-fauna-byproducts`. The cross-domain integration prompt remains on hold until all seven cited artifacts exist.

## 15. Sources

All external sources actually relied on above are listed here. Accessed 2026-07-14.

| Source | Quality | Use and limitation |
| --- | --- | --- |
| [Historic England, *Pre-industrial Mines and Quarries*](https://historicengland.org.uk/images-books/publications/iha-preindustrial-mines-quarries/heag223-pre-industrial-mines-and-quarries/) | B1 | Extraction forms, landscape residues, and transport/context; English evidence, not a universal chronology. |
| [Historic England, *Ashnott Lead Mine*](https://historicengland.org.uk/research/results/reports/6241/AshnottLeadMineRibbleValleyLancashire_AnArchaeologicalSurveyoftheLandscapeEvidence) | B1 | Low-mechanized haulage, breaking, washing, water management, and waste. |
| [Historic England, Derbyshire lead-mining landscape](https://historicengland.org.uk/listing/the-list/list-entry/1412782) | B1 | Ore washing, water, contaminated ground, institutional law, and access context. |
| [Tomczyk et al., “Geochemical and Documentary Topography of a Medieval Silver Valley”](https://onlinelibrary.wiley.com/doi/abs/10.1002/arp.1963) | A2 | Mine-to-concentrate sequence and persistent mineralized waste; no game-scale ratios. |
| [Hrubý et al., “Silver mining and landscape changes”](https://onlinelibrary.wiley.com/doi/full/10.1002/gea.22002) | A2 | Sorting, pounding, grinding, washing, tailings, water power, and landscape effects. |
| [Parker Pearson et al., “Reconstructing extraction techniques”](https://discovery.ucl.ac.uk/id/eprint/10163289/) | A2 | Joint-controlled stone extraction in a specific archaeological case. |
| [Amicone et al., “Beneath the surface”](https://discovery.ucl.ac.uk/id/eprint/10096813/) | A2 | Clay geology, selection, access, cleaning, mixing, temper, and minimal processing. |
| [Ho and Quinn, “Intentional clay-mixing”](https://discovery.ucl.ac.uk/id/eprint/10125531/) | A2 | Clay mixing versus temper and the danger of a universal quality ladder. |
| [Historic England, *Archaeological Evidence for Glassworking*](https://historicengland.org.uk/images-books/publications/glassworkingguidelines/heag259-archaeological-evidence-for-glassworking/) | B1 | Silica sources, composition, and preparation; not an extraction recipe. |
| [Freestone, “Glass production in the first millennium CE”](https://discovery.ucl.ac.uk/id/eprint/1543113/1/Freestone%20Glass%20production%20in%20the%20first%20millennium%20CE.pdf) | A2 | Sand versus crushed quartz and source-composition constraints. |
| [USGS, *In-Stream Mining of Sand and Gravel Resources*](https://pubs.usgs.gov/of/2002/ofr-02-153/) | C | Modern geology/environment analogue for channel and habitat effects. |
| [Historic England, *Pre-industrial Salterns*](https://historicengland.org.uk/images-books/publications/iha-preindustrial-salterns/) | B1 | Source, brine, evaporation, facilities, and residue relationships. |
| [Historic England, *The Archaeology of Norfolk’s Coastal Zone*](https://historicengland.org.uk/research/results/reports/8604/TheArchaeologyofNorfolk%E2%80%99sCoastalZone_ResultsoftheNationalMappingProgrammeMainReport) | B1 | Coastal saline-sediment filtration, boiling, fuel, waste, and changing shoreline viability. |
| [UNESCO, Hallstatt-Dachstein/Salzkammergut Cultural Landscape](https://whc.unesco.org/en/list/806/) | B1 | Salt, timber, transport, institutions, settlement, and cultural-landscape interdependence. |
| [Forest Research, silviculture for woodfuel and timber](https://www.forestresearch.gov.uk/tools-and-resources/fthr/biomass-energy-resources/fuel/woodfuel-production-and-supply/woodfuel-production/forestry-for-woodfuel-and-timber/silviculture/) | A1 | Regeneration, management, and coppice constraints; modern management analogue. |
| [Forestry England, coppice at Westonbirt](https://www.forestryengland.uk/westonbirt/coppice) | C | Historic and current coppice products at one managed site; not a universal product list. |
| [Forest Research, woodfuel processing](https://www.forestresearch.gov.uk/tools-and-resources/fthr/biomass-energy-resources/fuel/woodfuel-production-and-supply/woodfuel-processing/) | A1 | Splitting, drying, handling, and storage dependencies; no historical timing transfer. |
| [USDA Forest Products Laboratory, *Wood Handbook*, chapter 13](https://www.fpl.fs.usda.gov/documnts/fplgtr/fplgtr282/chapter_13_fpl_gtr282.pdf) | A1 | Moisture, airflow, drying defects, mould, and storage constraints; modern technical reference. |
| [Historic England, charcoal-burning platforms at Barbon Park](https://historicengland.org.uk/research/results/reports/8912/InvestigationofcharcoalburningplatformsatBarbonParkBarbondaleCumbria) | B1 | Charcoal platforms, managed woodland context, water, and residue evidence. |
| [Forest Research, stump harvesting](https://www.forestresearch.gov.uk/research/stump-harvesting/) | A1 | Soil/ecological distinction between stem harvest and root/stump extraction; modern constraint analogue. |
| [FAO, small-scale fisheries value chains](https://www.fao.org/voluntary-guidelines-small-scale-fisheries/key-thematic-areas/value-chains--post-harvest-and-trade/4/en) | A1 | Manual or low-cost small-scale practice, skills/tools, and infrastructure that limits loss and preserves freshness. |
| [FAO, technical measures and fishing gear](https://www.fao.org/4/Y3427E/y3427e04.htm) | A1 | Gear selectivity, bycatch, condition, habitat, season, and lost-gear relationships. |
| [Historic England, *River Fisheries and Coastal Fish Weirs*](https://historicengland.org.uk/images-books/publications/iha-river-fisheries-coastal-fish-weirs/) | B1 | Fixed weirs, baskets/nets, water context, and archaeological persistence. |
| [UNESCO, Budj Bim Cultural Landscape](https://whc.unesco.org/en/list/1577) | B1 | Seasonal fish migration, maintained hydrology, cultural knowledge, and customary ownership. |
| [FAO, appropriate handling in small-scale fisheries](https://www.fao.org/flw-in-fish-value-chains/value-chain/capture-fisheries/on-board-handling-in-small-scale-fisheries/appropriate-technology/en/) | A1 | Sorting, washing, contamination, damage, heat, and context-dependent gutting; modern handling analogue. |
| [FDA, seafood guidance](https://www.fda.gov/food/resources-you-food/seafood) | A1 | Harvest-source and contamination cautions for seafood; modern public-health boundary, not a historical handling template. |
| [FDA, paralytic shellfish poison guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cpg-sec-540250-clams-mussels-oysters-fresh-frozen-or-canned-paralytic-shellfish-poison) | A1 | Marine-biotoxin risk in bivalve shellfish; regulatory evidence used only to prevent freshness from standing in for safety. |
| [FAO, fishing occupational hazards](https://www.fao.org/fishing-safety/risk-management/occupational-hazards/en/) | A1 | Hazard-family classification only; no gameplay probabilities. |
| [FAO, needs and constraints for non-wood forest products](https://www.fao.org/4/y4496e/Y4496E19.htm) | A1 | Regeneration, harvest technique, social/cultural context, and uncertainty. |
| [USDA Forest Service, *Sustainable Forest Management for Nontimber Products*](https://research.fs.usda.gov/treesearch/63162) | A2 | Ecological, social, cultural, and overharvest dimensions of wild products. |
| [WHO, medicinal-plant good agricultural and collection practices](https://www.who.int/publications/i/item/9241546271) | A1 | Harvested part, clean collection, sorting, preparation, drying, and contamination constraints. |
| [University of Minnesota Extension, harvesting morel mushrooms](https://extension.umn.edu/gathering-wild-grown-plants-and-fungi/harvesting-morel-mushrooms) | B2 | Positive identification and non-consumption of uncertain wild mushrooms; regional extension guidance. |
| [Egli et al., long-term mushroom harvesting study](https://doi.org/10.1016/j.biocon.2005.10.042) | A2 | Site-specific harvesting and trampling evidence; explicitly not universal. |
| [Historic England, thatching-materials report](https://historicengland.org.uk/research/results/reports/30-2023) | B1 | Region-specific reed/thatch sourcing and preparation; not a universal reed route. |
| [Bodros and Baley, nettle-fiber study](https://doi.org/10.1177/0040517510391698) | A2 | Nettle-stem retting and fiber separation as post-harvest transformations; species-specific. |
| [Penn State Extension, maple syrup production](https://extension.psu.edu/maple-syrup-production) | B2 | Modern regional analogue separating tree tapping and sap collection from syrup processing. |
| [Nair, FAO resin-tapping proceedings chapter](https://www.fao.org/4/y4496e/Y4496E29.htm) | B2 | Species-specific tapping and less-damaging approaches; proceedings evidence, not universal safety guidance or a formula. |
| [Forest Research, peatlands, forestry, and climate change](https://www.forestresearch.gov.uk/publications/factsheet-peatlands-forestry-and-climate-change/) | A1 | Slow, long-term peat accumulation and ecosystem constraints; no game-scale recovery rate. |
| [ILO, *Safety and health in small-scale surface mines*](https://www.ilo.org/publications/safety-and-health-small-scale-surface-mines-handbook) | A1 | Mining hazard categories and need for organized controls; no procedural or numerical canon. |
