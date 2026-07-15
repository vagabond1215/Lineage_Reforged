# GPT-DR.materials.refinement-processing Research

- Date: 2026-07-14
- Gate: `GPT-DR.materials.refinement-processing`
- Repository baseline: `6640bece7f25e0380f5f44d3da71138fda5468e5` on clean `master`
- Status: temporary cited research artifact; non-canonical until the cross-domain research integration dispositions it
- Scope: research and documentation only; no content, schema, validator, test, runtime, UI, save, migration, dependency, asset, economy, crafting, refinement, or gameplay implementation

## 1. Gate Result

Gate 4 passes as a research gate. The evidence is sufficient to describe dependency-closed material lanes, distinguish live repository authority from external process evidence, and identify issues that may satisfy the post-Gate-6 production-authority audit trigger. It does not authorize a record, recipe, quantity, or behavior.

The strongest material conclusion is that source, raw output, stabilized stock, prepared material, refined material, intermediate, component, finished good, process aid, fuel, salvage, residue, and runtime instance must remain separate. Bast stem is not yarn; fresh hide is not leather or parchment; a log is not seasoned timber; limestone is not lime or mortar; clay is not fired ceramic; sand is not glass; ore is not ingot; a dye source is not pigment, ink, or coating; fatty tissue is not purified oil or wax; rough gemstone is not a mounted focus. External evidence repeatedly supports these separations, but only live canonical sources may seed future identities.

The strongest repository conclusion is more urgent. All 121 production chains are indexed and directly craft-resolvable; 120 can be consulted by current item-value and settlement-market paths, while `chain.forage.wild_harvest.hut` is shadowed by source-derived/first-candidate behavior. Their 311 processing steps contain only 19 explicitly authored input arrays, all in food chains; 292 steps have empty inputs. There are 179 empty output arrays: 97 on workplace stages and 82 on extraction stages. Runtime fills every one of them through workplace or requested-output fallback. The resolver also aggregates tool requirements across every job at a workplace, calculates critical-tool blocking but does not consume the resulting blocked flag, ignores authored workplace tiers and upgrades, treats fuel as a boolean surcharge rather than an item relationship, and returns only the last step's resolved outputs. Default resolution consequently omits 62 declared output occurrences across 17 non-variant chains, while an explicit request for the generic chain primary output fails in 11 variant chains. These are live economic effects, not descriptive-only metadata ([production chains](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/production_chains.json), [workplaces](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/workplaces.json), [runtime economy](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/runtime-economy.ts), [focused tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-runtime-economy.test.mjs)).

Material examples show why this matters. Default `chain.metal.iron_ingot` resolves the smelter step from copper ore, iron ore, gold ore, and charcoal, and its empty smelter outputs expand to ten metal forms plus `slag`; `chain.glass.vial` selects ash but not sand at its glassworks step; `chain.textile.linen` selects flax, fleece, yarn, and wool cloth together; `chain.leather.cured` reaches its final step with no resolved input; and every empty extraction output reports the requested finished target. These results are economy calculations rather than physical item creation, but they are broad enough to affect multiple material families and planned recipes. Gate 4 therefore records potential trigger evidence; Gate 6 must make the final audit-trigger decision.

The live catalog is broad but uneven: 1,372 items, 1,617 market values, 56 minerals, 27 crystal vessels, 121 chains, 58 workplaces, 12 planned recipes across eight families, 131 tool items, and 121 skills. Only 409 items carry the newer stage-and-role layer; its four-stage and six-role vocabularies cannot directly distinguish many material states, components, catalysts, scrap classes, or hazardous residues. Existing content already covers many apparent gaps, so later integration should favor missing relationships and targeted preconditions over indiscriminate identity growth ([items](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/items.json), [item schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/items/item.schema.json), [market values](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/market_item_values.json), [minerals](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/minerals.json), [crystals](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/crystal_catalog.json), [recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/crafting/recipes.json)).

Ordinary technology and scarcity remain primary. Magic may later provide a bounded, canon-routed service such as indication, observation, precision holding, warded storage, or limited stabilization. It may not supply free matter, fuel, heat, purification, perfect quality, lossless work, instant curing, or infinite vessel reuse. Gate 7 owns detailed substitution analysis.

The next gate is `GPT-DR.food.processing-preservation`. The seven-artifact integration hold and the block on revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` remain unchanged.

## 2. Method, Authority, Source Quality, And Safety Boundary

### Route and repository verification

The run began from a clean `master` at both local and `origin/master` commit `6640bece7f25e0380f5f44d3da71138fda5468e5`, exactly matching the prompt's expected head. Private-repository access was independently demonstrated through the installed GitHub connector, and local parsing reproduced the connected content. The active and queued cross-domain integration prompts remained byte-identical Git blobs at `9ce61594efe498c78b0b6d0d08fdafccf7cc0c54`; neither is Gate 4 implementation authority. The current handoff and output identify Gate 4 as active after accepted Gates 1-3 and preserve the seven-artifact hold ([current handoff](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-gpt-handoff.md), [current output](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-output.md), [active prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-prompt.md), [queued prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/queued-cross-domain-production-research-integration-prompt.md)).

### Claim authority

- **Repository fact:** directly observed in current content, schema, validation, test, or runtime code; controlling for project state.
- **External evidence:** a cited physical, archaeological, conservation, or technical relationship; informative but never canonical.
- **Design inference:** an explicitly marked repository-compatible interpretation.
- **Integration candidate:** a possible principle, correction, identity, relationship, precondition, or authored question awaiting later disposition.
- **Runtime reservation:** mutable action, quantity, quality, cost, state, instance creation, or persistence that static research cannot own.

Authority order is live repository content and runtime, focused current decisions, current coordination, accepted Gates 1-3, external evidence, then explicit inference. Lexical similarity never creates an alias.

### Method

- Read the mandatory coordination, route, prior-gate, material, production, spatial, validation, and magic authorities.
- Parsed live JSON to reproduce counts, IDs, stage/role distributions, reference closure, market-only identities, regional support, and placeholder state.
- Inspected the production resolver, public exports, consistency consumer, transport price call, and all five focused runtime-economy tests.
- Executed small read-only probes against every chain to compare explicit fields, fallback-derived step inputs/outputs, declared outputs, requested outputs, tool penalties, and resolved results.
- Researched each material lane using government/intergovernmental technical sources, peer-reviewed work, conservation science, museum research, archaeology, and institutional evidence. Search snippets were not evidence.
- Applied collision, repeated-consumer, owner, regional-support, later-gate, and safety filters before classifying any candidate.

### Source quality

- **A1 - primary authority:** binding or first-party primary technical authority.
- **A2 - peer reviewed:** peer-reviewed research or scholarly synthesis.
- **B1 - official evidence:** government, intergovernmental, or formal official technical guidance.
- **B2 - institutional evidence:** museum, university, conservation, professional, or formal project evidence with narrower authority.
- **C - contextual analogue:** bounded contextual evidence usable only for possibility or constraints.

The external register contains 61 works across 61 direct URLs: 11 A2, 30 B1, and 20 B2. No A1 or C source was needed. Modern industrial, environmental, and safety sources support dependencies, distinctions, hazards, and residue classes only; they do not transfer equipment scale, exact formulations, rates, values, or institutions. Archaeological and museum sources demonstrate possibility and process separation, not universal adoption or repository canon.

### Safety boundary

This report stays at design and dependency level. It provides no furnace charge, temperature schedule, alloy percentage, mortar or glaze formulation, toxic pigment recipe, caustic ratio, gas-generation procedure, weapon-construction instruction, poison preparation, hazardous waste treatment, magical capacity, or executable processing instruction. Heat, ventilation, containment, dust, wastewater, caustic, toxic-metal, and high-temperature hazards are identified only as owner and infrastructure requirements.

## 3. Live Repository Baseline And Owners

### Exact catalog baseline

| Catalog or owner | Exact live state | Gate 4 authority and limit |
| --- | ---: | --- |
| Items | 1,372 | Canonical inventory identities; 195 have material-difficulty profiles: 97 metal, 42 leather, 29 textile, 27 wood |
| Item stages | 409 records: 49 raw, 138 processed, 39 refined, 183 finished; 963 unstaged | Optional coarse state vocabulary, not a complete transformation graph |
| Item roles | 1,025 assignments on the same 409 records: 405 trade good, 224 material, 186 ingredient, 144 consumable, 52 reagent, 14 fuel | Roles may co-occur; no component, catalyst, scrap, slag, waste, repair, or tooling role |
| Market values | 1,617 | All 1,372 items plus 245 market-only biological identities: 113 flora and 132 fauna; market identity is not inventory identity |
| Minerals | 56: 18 tier 1, 18 tier 2, 19 tier 3, 1 tier 4 | Geological identity, deposit form, extraction type, and item key; no placed deposit or refining permission |
| Crystal catalog | 27: nine affinities, each with shard, crystal, and cluster tiers | Vessel metadata; `slug` matches a live arcane item key, but no explicit `itemKey` relationship exists |
| Resources / commodities | 2 / 2 | Planned iron-ore and grain authority only; not a general material-node or bulk-stock owner |
| Flora outputs | 199 unique keys across 1,394 occurrences | All item/value-resolved; 23 harvest-part strings remain descriptive and unpaired to outputs |
| Fauna outputs | 459 unique keys across 484 occurrences | All item/value-resolved; source relationship does not authorize processing or domestication |
| Flora/fauna output union | 658 unique keys | No overlap between flora and fauna output sets |
| Monsters / material-looking drops | 24 monsters; 49 drop entries / 37 unique keys; 25 drop occurrences / 20 unique keys whose live item has `itemSubBranch = material` | Static source-local possibility only; no loot roll or item creation |
| Production chains | 121 | All are indexed and directly craft-resolvable; 120 can feed current value/market candidate paths, with `chain.forage.wild_harvest.hut` shadowed |
| Chain stage declarations | 322 references / 71 unique: 229 workplace references to 49 IDs, 93 extraction references to all 22 IDs | Every reference resolves; declaration order is not an exact recipe |
| Processing steps | 311: 227 workplace and 84 extraction | 292 empty inputs, 19 explicit inputs; 179 empty outputs, 132 explicit outputs |
| Recipes / families | 12 planned recipes / 8 families | Bounded static transformations; assembly, baking, leatherworking, metalsmithing, milling, preserving, tailoring, woodworking |
| Workplaces | 58 | Static capability and live fallback input/output/tool source |
| Workplace jobs | 208 jobs / 110 unique job IDs: 64 primary, 98 support, 32 specialist, 14 management | Resolver selects no job; it aggregates requirements across all jobs |
| Workplace tiers and upgrades | 5 `tierProfile` records, all with `{}` tier; all 208 job `requiredTier` fields are `{}`; 25 upgrade profiles with 116 entries and no tier-upgrade requirements | Descriptive/placeholder data; current resolver consumes neither tiers nor upgrades |
| Workplace item I/O | 484 input refs / 315 unique; 365 output refs / 343 unique | Every I/O key resolves to an item; fallback selection does not make the arrays bounded recipes |
| Tools | 131 item records; jobs cite 298 required-tag occurrences / 100 unique tool tags | Portable tool identity; runtime compares supplied tags, not item possession or wear |
| Skills | 121 | Chains use only six crafting skills as primary/step skills: alchemy, blacksmithing, carpentry, cooking, leatherworking, weaving |
| Extraction methods | 22 | Stage vocabulary and references; not extraction execution |
| Guilds | 18 | Static institutions, including miners, smiths, woodwrights, masons, gemcutters, textile, glassworkers, potters, and scribes guilds |
| Civilization infrastructure | 7 | Irrigation, roads, bridges, walls, aqueducts, gates, canals; no generic kiln/furnace/workshop runtime |
| Magic infrastructure | 4 | Bounded service descriptions and prohibited bypasses |
| Knowledge snippets | 28 | Lore/recognition only; not process authority |
| Regional ecology / regions / localities / settlements | 9 / 41 / 47 / 88 | Authored supply, demand, geography, and place context; not stock, process, or instance state |

Counts and owners were reproduced from the connected [flora](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/flora.json), [fauna](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/fauna.json), [monsters](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/monsters.json), [resources](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/resources.json), [commodities](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/commodities.json), [extraction methods](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/extraction_methods.json), [guilds](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/guilds.json), [infrastructure](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/infrastructure.json), [magic infrastructure](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/magic_infrastructure.json), [skills](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/skills.json), [Knowledge snippets](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/knowledge_snippets.json), [regional ecology](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regional_ecology_profiles.json), [regions](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regions.json), [localities](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/region_localities.json), and [settlements](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/settlements.json).

### Existing identity coverage and catalog noise

The reviewed material-facing sets include 24 textile items (19 staged), 30 lumber items, 15 masonry items, 4 glass items, 39 metal items (30 staged), 66 mineral-branch items, 21 stationery items, 7 lighting items, 5 fuel items, 3 assembly materials, 10 accessory components, 27 arcane vessels, and 7 processed-leather items. Representative catalog and chain adjacencies include `flax_bundle` to `linen_thread`, `wool_fleece` to `yarn`/`wool_cloth`, `hide_raw` to `cured_leather` and leather components, `log` to plank/beam/components, `clay_raw` to `clay_vessel`/`fired_brick`, `river_sand` to glass outputs, ore to ingot/metal stock, paper/parchment to books/scrolls, pigments to inks, and beeswax/tallow to candle stock. Named gemstone mineral/item identities also coexist with twelve gemstone-specific `cut_*` identities, but no explicit rough state or source-to-cut relationship connects them. This is coverage evidence, not proof that every link is explicit or correct.

The 20 unique material-subbranch monster drop keys are `boar_bone`, `boar_hide`, `boar_tusk`, `cave_silk`, `centipede_chitin`, `chitin_plate`, `deep_wolf_bone`, `deep_wolf_fur`, `ember_boar_bone`, `ember_boar_hide`, `ember_boar_tusk`, `harpy_feather`, `kobold_scrap`, `rat_tail`, `scorpion_chitin`, `talon_bundle`, `troll_hide`, `troll_tooth`, `wolf_bone`, and `wolf_fur`. This predicate is explicit and reproducible; it does not claim every key is anatomically or technologically equivalent.

Catalog classification is not uniformly trustworthy. `sausage_link` and `smoked_sausage_link` are in the stationery branch; `sausage_coil` is in lighting; `quicklime` and `mineral_brine` carry the fuel role; and material residues such as `slag`, `forge_scale`, `cullet`, `kiln_shard`, `cloth_scrap`, `metal_scrap`, `offcut_lumber`, `sawdust`, `ash`, `dye_residue`, and `spent_reagent` share broad `material` or other roles rather than a common residue model. These are factual audit findings, not correction permission.

### Current runtime owners

The civilization content loader indexes items, values, chains, workplaces, settlements, and skills. `resolveItemRuntimeValue` indexes chain-declared primary, byproduct, and variant outputs, and non-source-derived items can inherit the least-cost consulted chain calculation. Current source-derived and first-candidate rules mean 120 of 121 chains can be consulted by the value/market path; `chain.forage.wild_harvest.hut` is not. `buildSettlementMarketStates` produces a price view over every market key. `resolveLocalMarketPrice` is publicly exported and also feeds transport pricing. `resolveCraftAtSettlement` can calculate all 121 chains directly. `simulation-consistency.ts` treats chain and workplace outputs as production-source evidence. No reviewed owner creates inventory items, executes a physical refinery, tracks material lots, or persists crafting state ([content loader](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/content.ts), [simulation consistency](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/simulation-consistency.ts), [transport runtime](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/transport-runtime.ts)).

## 4. Continuity With Gates 1-3

### Preserved from Gate 1

Gate 1's separation among resource identity, source entity, source site, harvested output, prepared material, commodity, process chain, and runtime action remains controlling. Gate 4 begins after extraction and initial preparation. An ore body is not ore or concentrate; a tree is not a log; a clay deposit is not prepared clay; a source site, regional supply string, or extraction method cannot create an item. The 56 mineral records, two resources, two commodities, and 22 extraction descriptors remain identity or descriptive authority, while placed nodes, source quantities, depletion, ownership, gathering, recovery, and persistence remain unowned ([Gate 1](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md)).

### Preserved and qualified from Gate 2

Gate 2's 658 canonical biological outputs remain the only accepted biological-output pool. A hide output does not automatically become leather; shell does not automatically become purified chitin; bone does not automatically become glue; a gland does not automatically become a reagent; a monster drop does not prove anatomy or retained magic. Fresh/stabilized/prepared states and source relationships remain conditional. The repeated-consumer/trade/hazard/ritual/narrative residue filter remains mandatory. Gate 4 adds process distinctions and confirms that the current item stage/role layer is too coarse to represent all of them without careful owner decisions ([Gate 2](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md)).

### Preserved and qualified from Gate 3

Gate 3's separation among crop or animal, harvested output, stabilized stock, material input, ingredient, commodity, chain stage, bounded recipe, workplace capability, live economic calculation, and physical item generation remains controlling. Raw manure, bedding waste, compost, crop residues, species wool versus generic fleece, blood/fat/sinew/tendon/offal/manure/guano/hair/shell source links, raw pearl/nacre, seed stock, hides, oils, waxes, fibers, and storage dependencies remain unresolved. Gate 4 qualifies one prior shorthand: production chains are not merely descriptive because they and workplaces are live market-value inputs, but their profiles still do not confer exact bounded recipe quantities or inheritance ([Gate 3](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md)).

### Deferred forward

- Gate 5 owns food milling, baking, brewing, dairy, edible oils, sugar, preservation, perishability, and food/feed safety.
- Gate 6 owns the cross-domain tool/workplace/skill/energy capability synthesis and final post-Gate-6 audit-trigger decision.
- Gate 7 owns finite magitech substitution and infrastructure comparison.
- Integration owns identity promotion, schema posture, chain/recipe reconciliation, regional authorship, and the exact revised `0.6.5` target.

## 5. Required Material-State And Authority Separation

| Concept | Meaning in this gate | Current or future owner boundary |
| --- | --- | --- |
| Source identity | Flora, fauna, monster, mineral, or other canonical origin | Existing source catalogs; never inferred from a product name |
| Raw output | Material physically separated from a source | Canonical item/output relationship; no quantity or generated instance |
| Stabilized material | Raw output made less immediately perishable or unstable | Conditional static identity/relationship; method and state must be source-compatible |
| Prepared material | Cleaned, sorted, washed, retted, scoured, seasoned, beneficiated, or otherwise readied | Candidate relationship; not synonymous with raw or refined |
| Refined material | Material whose composition or workability has been materially transformed | Item/chain candidate; exact transformation belongs a bounded recipe or other selected authority |
| Intermediate | A meaningful input to a later stage | Promote only with repeated consumers or distinct handling/value |
| Component | A shaped part assembled into a finished good | Current item role vocabulary has no explicit component role |
| Process aid | Flux, mordant, binder, abrasive, solvent, wash, or other facilitating input | Not a catalyst, fuel, tool, or product by default |
| Fuel | Consumed energy-bearing material | Item role may identify it; runtime currently consumes only a boolean availability signal |
| Catalyst | Material that enables or modifies a process without being the ordinary bulk input | Magic catalyst metadata is separate; mundane catalyst identity requires explicit authority |
| Tool / consumable tooling | Durable implement versus mold, crucible, refractory, jig, wick, filter, or other use-limited tooling | Tool items and workplace capability; wear/consumption reserved |
| Workplace / infrastructure | Facility capability versus broader fixed network or civic service | Workplaces and infrastructure catalogs; not an action or inventory |
| Finished good | End-use object or consumable | Item/recipe destination; may still feed repair or assembly |
| Repair material | Stock reserved for maintenance | Conditional component/relationship, not automatic duplicate identity |
| Salvage / offcut / scrap | Recoverable object or clean fraction with a downstream use | Promote only when sorted, compatible, and consumed |
| Slag / ash / wastewater / hazardous residue / ordinary waste | Process-specific residues with different recovery and hazard posture | Must not be collapsed; mutable generation/disposal reserved |
| Market identity | Static valuation key | Market catalog; never an inventory alias by itself |
| Chain output | Macro production/value declaration | Live economic input, broader than exact recipe authority |
| Recipe output | Bounded authored transformation result | Planned recipe record; no runtime execution today |
| Runtime item instance | A concrete owned quantity/state | No reviewed material-production owner; reserved |

The live item schema has four stages (`raw`, `processed`, `refined`, `finished`) and six roles (`consumable`, `ingredient`, `material`, `reagent`, `trade_good`, `fuel`). It cannot directly state stabilized versus prepared, intermediate versus component, process aid versus catalyst, or clean scrap versus hazardous waste. Free-form branch/subbranch, tags, and processing groups provide vocabulary but do not establish universal semantics. Any later expansion must decide whether relationships are sufficient or a schema/validator precondition is warranted; Gate 4 does not choose the patch.

## 6. Production-Chain, Workplace, And Live-Resolver Authority Audit

### Static fields and reference closure

All 121 chains define stages, a primary output, byproducts, a `recipeProfile`, one primary skill, at least one processing step, and value-propagation vocabulary. Twenty-eight chains define 162 variants. Across 311 steps, 33 opt into variant inputs, 29 into variant primary outputs, and 29 into variant byproducts. Seventeen declared stages across six food chains lack a corresponding processing step. All chain outputs (435 unique), explicit step input/output keys (245 unique), workplace I/O keys (492 unique), stage references, workplace references, extraction references, and skill references resolve. Lint validates those identities and field shapes, but deliberately permits empty step arrays and does not validate dependency closure or resolver fallback equivalence ([content lint](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/index.mjs)).

Only 19 steps have explicit input arrays, and all 19 are in food chains. The other 292 are fallback-capable: 208 workplace steps and 84 extraction steps. Only 11 chains declare any `externalInputs` and only eight declare any `intermediateItems`. Thus every current non-food material process examined by this gate obtains step inputs from variant configuration, workplace selection, or chain fallback rather than a step-level explicit input array.

### Fallback and requested-output behavior

For an empty step input, runtime first considers variant inputs, then selects relevant workplace inputs using item class/branch/subbranch/tags/processing groups and lowest source-value alternatives, then falls back to chain external inputs or the last intermediate. For an empty workplace output, it selects workplace outputs; with a requested target it uses that target if present, otherwise the first workplace output, and classifies other commodity outputs as byproducts. For an empty non-workplace output, it uses variant output where opted in, otherwise the requested target. Consequently all 179 empty output steps produce non-empty output explanations: 97 from workplace fallback and 82 from requested-target/extraction fallback.

This behavior is not dependency-closed. Default probes reproduced:

- `chain.metal.iron_ingot`: the empty extraction step reports `iron_ingot`; the smelter input selector chooses `copper_ore`, `iron_ore`, `gold_ore`, and `charcoal`; its empty output selector expands to eleven ingot/slag outputs; only the final bloomery step explicitly states `iron_ingot`, `slag`, and `forge_scale`.
- `chain.metal.bronze_ingot`, `chain.metal.brass_ingot`, `chain.metal.copper_ingot`, and `chain.metal.aetherite_ingot`: each default smelter calculation chooses the same copper/iron/gold/charcoal set rather than an exact alloy- or ore-specific input authority.
- `chain.glass.vial`: two empty extraction steps each report the finished vial; the final glassworks selector charges `ash` but omits `river_sand`; explicit final outputs include vial, cullet, and sheet.
- `chain.ceramics.vessel`: the two extraction steps each report `clay_vessel`; the pottery kiln selects `clay_raw` and `ash`.
- `chain.textile.linen`: the extraction step reports `linen_thread`; the loomhouse selector consumes `wool_cloth`, `yarn`, `flax_bundle`, and `wool_fleece` together.
- `chain.leather.cured`: the extraction step reports `cured_leather`; the final tannery step resolves no input.
- `chain.apiary.candles`: the gather step reports `candle`; intermediate empty loomhouse and tannery outputs expand to their broad workplace catalogs; the chandlery selects wax, tallow, wick, glass, and metal components together.

These resolver choices are not inventory grants. Selected inputs directly affect material cost, time, labor, scalar waste cost, item value, and market price. Intermediate output fallbacks normally affect explanations only because prior-step outputs are not passed into later steps; the final step's selected output set determines returned outputs and associated value behavior.

### Quantities, output sets, cost, and waste

Processing-step inputs and outputs are strings without bounded quantities. The resolver counts one unit for every resolved input key and uses a neutral final quantity factor of `1` unless a skill check explicitly allows the quantity dimension; each final primary and byproduct receives the same factor. Workplace `quantityPerCycle`, labor-slot, worker-count, and tier fields are not used by this resolver. It computes time, labor cost, processing cost, material cost, and a scalar waste cost from hard-coded bands, material-difficulty metadata, skills, tools, fuel availability, and settlement production capacity. It generates no waste item, consumes no fuel item, records no wear, and creates no inventory instance.

Final results use only the last processing step's resolved output set. For 17 non-variant chains, that omits 62 occurrences named by the chain's primary/byproduct declaration. Material-relevant examples include two omitted glass outputs from `chain.glass.vial`, eight omitted storage outputs from `chain.household.storage`, three bows from `chain.ranged.bows`, thirteen apparel outputs, three cloak outputs, `rope` from textile components, fourteen utility-tool outputs, two armor outputs, three leather-armor outputs, and six weapon outputs. Separately, when the generic primary is explicitly requested from a variant chain, 11 chains return the default variant-specific output instead; the material examples are `chain.lumber.beam` (`timber_beam` becomes `softwood_timber_beam`) and `chain.lumber.plank` (`plank` becomes `softwood_plank`).

### Workplaces, jobs, tiers, skills, tools, and fuel

The resolver uses each step's exact workplace ID but chooses no job or tier. It unions all required tool tags from every job at that workplace. All 208 jobs specify at least one tool; the union is 298 references to 100 unique tool tags. Sixty-four jobs are primary, and 46 of those declare a `no_output` missing-tool mode, but the resolver takes the penalty mode from only the first primary job. It can return `blocked: true` when the unioned requirements are missing under that selected mode, yet the craft loop never reads `blocked`; it applies the returned factor and still emits outputs. A focused probe of `chain.food.bread` with no tool tags reported missing tools from multiple jobs yet still returned bread outputs. This is both a blocking-semantics defect and evidence that all-job aggregation couples support/specialist/management tools to every process at the workplace.

Five workplaces carry tier profiles, all with placeholder `{}` tiers; all 208 job required tiers and the numeric workforce fields are placeholders. Twenty-five workplaces carry 116 descriptive upgrade entries, but the resolver reads none of the tier, progression, efficiency, market, integration, plot, or upgrade profiles. Step skills are explicit for workplace steps and use only six broad crafting skills. Current material chains therefore map masonry to Cooking/Blacksmithing, pottery and glass to Alchemy, stationery chiefly to Weaving, and charcoal's primary chain skill to Cooking while its processing step uses Carpentry. These may be intentional abstractions or vocabulary debt; the research cannot decide.

Fuel is only `fuelAvailable?: boolean`. A false value increases time and processing overhead on `fuel_heavy` steps; there is no fuel identity selection, consumption, compatibility, stock, quantity, ash generation, or emissions owner. Water, ventilation, curing, drying, atmosphere, refractory compatibility, molds, and maintenance are likewise absent from the resolver unless encoded indirectly as workplace prose or item keys.

### Exact recipe authority and tests

The 12 `crafting.recipes` records remain the only bounded static transformations. Their item quantities, required workplace IDs, required tool item keys, skill requirements, and non-inheriting `relatedProductionChainId` fields are not consumed by runtime economy. Chain profiles remain macro economic/process authority and cannot silently supply recipe quantities or inheritance. The current five runtime-economy tests cover skill effects, harder-metal cost, settlement price pressure, structured explanations, and opt-in quantity effects. They do not isolate empty input/output fallback, generic requested outputs, variant selection, last-step output loss, all-job tools, critical-tool blocking, tiers/upgrades, fuel identities, or any Gate 4 material chain.

### Potential post-Gate-6 audit-trigger evidence

Gate 4 finds evidence that may satisfy multiple triggers in the [audit-trigger decision](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/production-chain-workplace-runtime-authority-audit-trigger.md):

1. fallback behavior supplies materially important inputs and outputs across many material and food lanes;
2. exact planned recipe selection can depend on unresolved generic/variant requested-output behavior;
3. live consumption conflicts with documentation that characterizes chain links as purely descriptive or non-inheriting without acknowledging economy calculation;
4. workplace jobs are coupled through all-job tool aggregation, and declared `no_output` penalties do not block output;
5. current tests do not isolate these behaviors;
6. the issues affect multiple material families, the chain system's broad value/market surface, and more than one planned recipe lane.

Gate 4 does not trigger or fix the audit. Gate 6 must reconcile its own evidence, decide whether the trigger is satisfied, and preserve the integration hold accordingly.

## 7. Fibers And Textiles

The live item/workplace vocabulary includes `flax_bundle`, `marsh_fiber`, `river_reed`, `wool_fleece`, `yarn`, `linen_thread`, `rope`, `cloth`, `wool_cloth`, and other cloth goods. Fauna owns `silk_spider_silk`, while `cave_silk` is a monster drop. Exact item keys `flax_thread`, `hemp_thread`, `wool_thread`, and `felt` are absent; those words remain process vocabulary, not canonical identities. This is enough to preserve several lanes, but not to infer that every flora output called `fiber` is textile-suitable: 74 flora records emit that generic string, and the relationship has no suitability or fiber-type qualifier.

For bast textiles, the evidence-supported topology is source plant or harvested stem -> retting or another source-appropriate release step -> breaking/scutching and cleaning -> graded fiber and tow/residue -> spinning or cordage -> yarn/thread -> weaving -> cloth -> optional fulling, finishing, dyeing, or cutting. Retting releases bast bundles from surrounding plant tissue; later separation and cleaning remain distinct. Water use, route choice, effluent, weather, and drying can constrain feasibility, while preparation and spinning quality affect the yarn that a loom can use ([retting review](https://doi.org/10.3390/fib12030028), [flax/hemp yarn life-cycle comparison](https://doi.org/10.1016/j.indcrop.2007.05.003), [Hallstatt textile technology](https://www.nhm.at/hallstatt/en/textiles/technology)). Those sources establish categorical dependencies, not a universal duration, yield, or regional route.

Wool requires a separate animal-fiber lane: fleece sorting -> cleaning/scouring -> drying and preparation -> spinning -> weaving or felting -> optional fulling/finishing. Grease recovery and wastewater are possible process outputs rather than automatic market items, and felt is a distinct consolidation route rather than woven cloth. Modern scouring evidence transfers only those qualitative separations; documented felt and fulling traditions show capabilities, not universal adoption ([UNIDO wool-scouring report](https://www.unido.org/publications/ot/9646100), [UNESCO Kyrgyz felt-carpet practice](https://ich.unesco.org/en/RL/ala-kiyiz-and-shyrdak-art-of-kyrgyz-traditional-felt-carpet-making-00693), [Historic England textile-industry guide](https://historicengland.org.uk/content/docs/education/explorer/teachers-kit-textile-industry-pdf/)).

The current `chain.textile.linen` resolver does not implement that topology: its extraction step can emit `linen_thread` directly, and its loom fallback selects flax, fleece, yarn, and wool cloth together. This must remain audit evidence, not a new recipe. `cave_silk` and `silk_spider_silk` are canonical outputs, but Gate 4 found no authority for a generic silk life cycle, domestication claim, or universal silk-processing lane. Seed, leaf, straw, and rush fibers remain conditional source classes: live seed, straw, reed, and generic-fiber identities do not by themselves establish spinnability. Any future specialty-fiber relationship requires an authored source, repeated consumers, regional support, tool/workplace closure, and a collision audit.

## 8. Hides, Leather, Parchment, Glue, Bone, Horn, Shell, Chitin, And Related Materials

The repository contains named hides, many named furs and scales, `sturgeon_scute`, bones, teeth, tusks, feathers, shells, chitin, cured leather, parchment, and finished leather goods, with biological outputs owned by fauna and monster records. Generic hair, tendon, and sinew item identities are absent even though those are valid research capability terms. It does not canonically equate fresh skin, preserved hide, rawhide, tanned leather, fur-on skin, parchment, or leather components. That separation is physically and authoritatively necessary.

A dependency-safe hide family begins with an identified animal source and a fresh skin/hide output, then branches. Prompt stabilization by a source-appropriate preservation route precedes grading and transport; rawhide is untanned and dried; leather requires an authored tanning lane; fur-on stock retains hair; parchment is untanned skin processed by dehairing, scraping, tension, and drying. These states have different moisture, pest, handling, and deterioration behavior ([FAO hides and skins guidance](https://www.fao.org/unfao/bodies/ccp/hs/98/w9700e.htm), [Canadian Conservation Institute leather, skin, and fur guidance](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/caring-leather-skin-fur.html), [Codex Sinaiticus parchment conservation](https://www.codexsinaiticus.org/en/project/conservation_parchment.aspx)). The evidence does not authorize exact curing agents, baths, ratios, schedules, or yields.

Glue and gelatin are source-qualified products, not aliases for hide, bone, fish, or horn. Collagen-derived adhesives vary with source and preparation; a future identity would therefore need a canonical input, an actual downstream binder consumer, and a bounded recipe owner ([animal-glue review](https://doi.org/10.1179/sic.2007.52.Supplement-1.55)). Bone, ivory, antler, horn, quill, feather, keratin, shell, and sinew also require separate structural and conservation semantics rather than a generic `animal material` identity ([CCI ivory, bone, horn, and antler guidance](https://www.canada.ca/en/conservation-institute/services/conservation-preservation-publications/canadian-conservation-institute-notes/care-ivory-bone-horn-antler.html), [CCI feather, quill, horn, and keratin guidance](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/feathers-quills-horn-keratinous-materials.html), [Te Papa sinew collection](https://collections.tepapa.govt.nz/category/312205), [Smithsonian shell-button research](https://serc.si.edu/research/projects/making-buttons-delmarva-imported-shells)).

Chitinous shell or plate may support cleaning, grading, shaping, or composite use when a canonical source and consumer exist. It does not justify importing modern purified chitin/chitosan chemistry: that conversion has distinct chemical, waste, and safety dependencies and is outside current canon ([chitin/chitosan review](https://doi.org/10.3390/polym14193989)). Likewise, tannin-bearing flora cannot automatically become tannery inputs; tannin composition and suitability are source-specific ([vegetable-tannin review](https://doi.org/10.3390/molecules23051081)). Tannery effluent, caustic materials, dust, odors, and contaminated residues require containment and specialist handling at the design level only ([World Bank tanning and leather-finishing guidance](https://documents1.worldbank.org/curated/en/874161491555046600/pdf/114073-WP-ENGLISH-Tanning-and-Leather-Finishing-PUBLIC.pdf)).

The live `chain.leather.cured` and `chain.leather.exotic_curing` are structurally identical, and the final tannery step of the ordinary cured-leather chain resolves no input. A workplace fallback for parchment selects ash, quicklime, and wax seal but no hide. These are resolver facts relevant to the later authority audit; they are not evidence that those inputs form valid leather or parchment recipes.

## 9. Wood, Timber, Charcoal, Ash, Tar, Pitch, Resin, Cork, Bark, And Paper

Canonical flora relationships include outputs such as `wood`, `bark`, and `resin`; `log` and `river_reed` exist elsewhere in the item/workplace catalog rather than as those generic flora outputs. Item and chain catalogs also include timber forms, planks, beams, charcoal, ash, paper, parchment, ink, stationery, and finished wooden goods. The safe wood topology is identified source tree -> harvested green log or branch -> sorting and conversion to an appropriate form -> seasoning/storage -> worked stock -> component -> finished destination. Green and seasoned wood are materially different; moisture, ambient conditions, storage, section, and species affect stability ([USDA Wood Handbook chapter](https://research.fs.usda.gov/treesearch/62261)).

Charcoal is the cooled and sorted product of controlled limited-air carbonization, not ash. Ash is a mineral residue after more complete combustion and may be a process aid only where an authored consumer exists. Charcoal production depends on fuelwood, controlled airflow, cooling, screening, dry storage, site separation, and fire management; this report deliberately omits operational schedules and yields ([FAO charcoal-making and logistics](https://www.fao.org/4/X5328e/x5328e02.htm)). The live chain's skill split between Cooking and Carpentry and its boolean-fuel treatment remain later audit questions.

Tar and pitch must retain source and consistency qualifiers. Experimental archaeology shows that birch-derived tar terminology and production cannot stand in for every woody feedstock, and natural resin is not interchangeable with gum, tar, pitch, or rosin. Rosin is a processed resin fraction, so it also requires a canonically valid source and route rather than an alias ([birch-tar study](https://doi.org/10.1111/arcm.12820), [CAMEO natural resin](https://cameo.mfa.org/wiki/Natural_resin), [CAMEO rosin](https://cameo.mfa.org/wiki/Rosin)). Cork is likewise source-specific bark tissue; forestry evidence supports a distinct harvest and grading lane only if a suitable canonical tree and repeated consumers exist ([FAO cork overview](https://www.fao.org/4/x5326e/x5326e0b.htm)).

Generic gum, plant-wax, tannin, and binder item identities are absent. They remain conditional source relationships or process-aid candidates; neither a plant name nor generic `resin` output establishes one.

Paper is neither generic fiber nor finished stationery. A defensible route is suitable plant or rag fiber -> sorting/cleaning -> pulp or slurry -> sheet forming -> pressing and drying -> optional sizing or surface finishing -> paper stock -> book, wrapping, or stationery component. Historical machinery, rag composition, waterpower, and sizing vary by place and capability ([German Museum of Technology papermaking](https://technikmuseum.berlin/en/exhibitions/permanent-exhibition/papermaking/), [Library of Congress Fabriano study](https://www.loc.gov/preservation/outreach/tops/albro/index.html)). The final paper-mill step of live `chain.stationery.paper_sheet` derives inputs from ash, cloth scrap, quicklime, and wax seal; earlier steps also select reed/fiber and loom inputs. Those sets are unauthored fallback, not a historical formula.

## 10. Stone, Lime, Plaster, Mortar, Clay, Brick, Tile, Pottery, Ceramics, Glass, Sand, And Abrasives

Stone requires form and use distinctions: quarry block, rubble, dimension stone, aggregate, and stone dust are not substitutes. Cutting, crushing, screening, grading, dressing, and installation require different tools and create dust or offcuts. Limestone may feed a lime cycle, but limestone, burned lime, slaked lime, mortar or plaster, and cured masonry remain distinct states. Substrate, exposure, moisture movement, workmanship, and curing control compatibility; no universal mortar formulation follows ([Getty lime mortars and plasters](https://www.getty.edu/projects/lime-mortars-plasters/), [NPS repointing brief](https://www.nps.gov/orgs/1739/upload/preservation-brief-02-repointing.pdf), [NPS stucco brief](https://home.nps.gov/orgs/1739/upload/preservation-brief-22-stucco.pdf)). Crushing and dressing also require a dust-control dependency without operational exposure guidance ([EPA crushed-stone processing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s1902.pdf), [OSHA crystalline-silica overview](https://www.osha.gov/silica-crystalline)).

Clay and ceramics support a separate topology: selected raw clay -> cleaning, sorting, or levigation where appropriate -> tempered/prepared body -> formed greenware -> controlled drying -> fired ceramic -> optional glaze and refiring -> finished vessel, tile, brick, or specialist component. Workshops, drying areas, kilns, fuel, kiln furniture, refractories, and maintenance are dependencies. Wasters are not automatically reusable grog; only sorted, suitable ceramic fragments with an authored consumer qualify. Archaeological and industrial sources jointly support the categorical stages while differing radically in scale ([Historic England pottery-production sites](https://historicengland.org.uk/images-books/publications/archaeological-and-historic-pottery-production-sites/heag019-pottery-production-sites/), [EPA ceramic-products overview](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf), [EPA refractory-manufacturing overview](https://www.epa.gov/sites/default/files/2020-10/documents/c11s05.pdf), [EPA brick overview](https://gaftp.epa.gov/ap42/ch11/s03/final/c11s03_1995.pdf)).

Glassmaking and glassworking must not be collapsed. Primary glassmaking requires compatible selected batch materials, high-heat containment, melting/refining, conditioning, and a workable glass mass. Secondary glassworking shapes compatible glass or sorted cullet, then anneals and finishes it. Cullet is composition-compatible material intentionally returned to melting, not any broken glass; furnace lining, pots/crucibles, shaping tools, annealing, energy, ventilation, and breakage handling are separate dependencies ([Historic England glassworking evidence](https://historicengland.org.uk/images-books/publications/glassworkingguidelines/heag259-archaeological-evidence-for-glassworking/), [EPA glass-manufacturing overview](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf), [JRC glass best-available-techniques reference](https://doi.org/10.2791/69502)).

Sand is a source class, not automatically glass batch or abrasive. Abrasive fitness depends on particle, hardness, contamination, substrate, and operation, so a generic abrasive identity should remain conditional ([Metropolitan Museum ancient-Egyptian technology study](https://www.metmuseum.org/de/perspectives/ancient-egyptian-technology), [carnelian bead functional analysis](https://doi.org/10.1016/j.jas.2015.03.030)). The live `chain.glass.vial` glassworks fallback selects ash but no sand and can omit declared bottle/jar outputs; `chain.ceramics.vessel` can extract a finished vessel and its kiln fallback combines clay and ash. Those results are audit evidence rather than recipes.

No dedicated pozzolanic-material, mirror, enamel, refractory, or abrasive item identity is present. `tracking_lens` exists, but it does not establish a generic optical-glass or lens chain. These remain conditional capability or identity candidates rather than gaps to fill automatically.

## 11. Ores, Concentrates, Fluxes, Slag, Metals, Alloys, And Metal Intermediates

The repository controls the metal universe. It has 56 minerals, including 14 ore identities; twelve metal ingot items; eleven ingot chains; and staged difficulty metadata for 97 metal items. `adamantite_ingot` has an item identity but no chain. Some stock/component identities already exist--including `metal_plate`, `metal_wire`, `metal_ring`, `blade_blank`, `iron_ring`, and `iron_blade`--while concentrate, metallurgical bloom, billet, generic bar or metal sheet, flux, refractory, and abrasive identities are absent. External evidence may describe these states but cannot promote missing identities.

A repository-compatible metallurgy topology is canonical deposit/mineral -> mined ore -> sorted or prepared ore -> optional concentrate or roasting relationship only where authored -> smelted metal mass or bloom -> consolidation/refining -> ingot, billet, or bar stock where canonical -> shaped blank/component -> finished object. Bloom, slag-bearing mass, cast ingot, wrought stock, alloy, and finished article are not synonyms. Alloy composition, furnace charge, and operating schedule belong to bounded recipe or runtime authority and are excluded here ([Historic England archaeometallurgy guidelines](https://historicengland.org.uk/images-books/publications/archaeometallurgy-guidelines-best-practice/heag003-archaeometallurgy-guidelines/), [JRC non-ferrous-metals reference](https://eippcb.jrc.ec.europa.eu/reference/non-ferrous-metals-industries-0), [JRC smitheries and foundries reference](https://eippcb.jrc.ec.europa.eu/reference/smitheries-and-foundries-industry)).

Slag, dross, scale, swarf, sprues/runners, offcuts, clean scrap, contaminated dust, and spent furnace material are distinct residue classes. Clean sorted scrap may be a secondary input; some metal-bearing residues may be recoverable only after composition and consumer checks; hazardous residues require containment and disposal ownership. Modern regulatory and occupational sources transfer the distinctions and hazard classes, not legal rules or process instructions ([EPA hazardous-waste recycling FAQ](https://www.epa.gov/hw/frequent-questions-related-hazardous-waste-recycling-definition-solid-waste-and-other-exemptions), [OSHA toxic-metals overview](https://www.osha.gov/toxic-metals)).

Default ingot resolution demonstrates the current authority risk. `chain.metal.iron_ingot` reaches a smelter fallback that selects copper ore, iron ore, gold ore, and charcoal together and expands to ten metal forms plus `slag`; bronze, brass, copper, and aetherite ingot requests inherit the same global input set. These are deterministic runtime results, not valid furnace charges. No new concentrate, flux, alloy, or stock-form record should precede the Gate 6 trigger decision and the later integration collision audit.

## 12. Salts, Pigments, Dyes, Inks, Mordants, Tannins, Binders, And Coatings

The live item catalog already contains `salt`, `salt_crystal`, `mineral_brine`, and `saltpeter`; six named color pigments plus `pigment_paste`; generic and colored writing inks; biological `octopus_ink` and `squid_ink`; `dyed_cloth`; and `dye_residue`. It has no exact mordant, tannin, or generic binder item identity, and these concepts lack a complete source-to-formulated-product chain. Existing identities should therefore be related and collision-audited before any catalog expansion.

Salt sources and process routes must remain qualified: rock deposit, natural brine, and saline-water evaporation are different source relationships and infrastructure burdens ([USGS salt statistics and information](https://www.usgs.gov/centers/national-minerals-information-center/salt-statistics-and-information)). A generic salt item may be a trade abstraction, but it cannot silently establish every route or grade.

Pigment, dye, lake, mordant, tannin, binder, ink, paint, glaze, and coating have distinct functions. A pigment is generally a dispersed insoluble colorant; a dye is soluble or substantively bound to a substrate; a lake fixes a dye to a substrate; a mordant mediates dye fixation and may alter color; a binder or vehicle carries and fixes a colorant; ink, paint, glaze, and coating are formulated destinations, not synonyms ([CAMEO pigment](https://cameo.mfa.org/wiki/Pigment), [CAMEO lake](https://cameo.mfa.org/wiki/Lake), [CAMEO mordant](https://cameo.mfa.org/wiki/Mordant), [CAMEO paint types](https://cameo.mfa.org/wiki/Paint_types%2C_generic)). Historical organic glazes further show that visual color names do not by themselves identify material composition ([National Gallery organic glazes, pigments, and paints](https://www.nationalgallery.org.uk/research/publications/technical-bulletin/brown-and-black-organic-glazes-pigments-and-paints)).

Natural dye and tannin relationships must be source- and substrate-specific. Colorant chemistry varies by biological source; overdyeing may combine lanes; mordant effectiveness varies with both fiber and dye; and a tannin-bearing plant is not automatically a suitable tanning input ([historical textile-dye review](https://doi.org/10.1039/b305697j), [natural dyes and mordants review](https://doi.org/10.1007/s10311-024-01716-4), [vegetable-tannin review](https://doi.org/10.3390/molecules23051081)). Exact baths, concentrations, toxic preparations, or promised colors are outside scope.

Inks and coatings require compatible colorant, binder/vehicle, substrate, container, and storage relationships. Iron-gall conservation evidence shows that composition can affect long-term substrate damage, supporting a hazard/maintenance consequence rather than an executable ink formula ([Library of Congress iron-gall-ink research](https://www.loc.gov/preservation/scientists/projects/iron_gall_ink.html)). Spent dye/tanning baths, pigment dust, heavy-metal residues, and contaminated wastewater must be treated as waste or hazard classes unless a safe, authored downstream consumer exists.

## 13. Oils, Waxes, Soap, Candles, Fuels, Solvents, And Process Aids

Live identities include `bluefin_tuna_oil`, `dolphin_oil`, `great_whale_oil`, `oil_flask`, `beeswax`, `honey_bee_beeswax`, `rendered_tallow`, `soap`, `candle`, and multiple fuel-role items such as firewood, charcoal, kindling, peat, straw, twig bundles, and fuel bundles. Gate 2 established that the three named animal oils are direct fauna-output relationships; Gate 4 preserves that as a source-model conflict rather than treating those outputs as proof of a rendering process.

Biological source authority remains with flora, fauna, and later food research. A dependency-safe oil lane is a canonical seed, fruit, fish, or animal source -> sorted and prepared feedstock -> pressing or rendering under an appropriate owner -> settling/filtering -> protected crude or finished oil stock -> food, lighting, binder, coating, soap, or lubricant destination. Press cake is a separate possible output, not automatically edible feed; Gate 5 owns food suitability, spoilage, and preservation implications ([FAO small-scale oilseed processing](https://www.fao.org/4/v5380e/V5380E07.HTM)).

Wax is a family, not a universal substance. Beeswax and other waxes vary in composition and behavior, so substitution requires source and consumer evidence ([wax-analysis technical brief](https://doi.org/10.1039/D1AY90035H)). A candle is a formed wax or tallow body plus a compatible wick and finishing step, distinct from loose wax stock ([British Museum beeswax candle](https://www.britishmuseum.org/collection/object/E_Am1994-13-154)). Soap is a chemically transformed product from fat or oil, alkali, and water, with heat and caustic hazards; this gate records only that topology and safety class, not a ratio or method ([Smithsonian historical soap overview](https://americanhistory.si.edu/explore/stories/suds-how-make-soap-19th-century-style)).

Fuels need identity, compatibility, storage, and residue separation: firewood, charcoal, peat, oil, and other canonical fuels should not be collapsed merely because the resolver accepts a boolean. Solvents, binders, cleaning aids, fluxes, refractory materials, mordants, sizing, lubricants, and polishing media are process aids only when a repeated consumer and bounded authority exist. They may be consumed, recovered, contaminated, or converted; none should be emitted as generic market goods by inference. Food-grade versus industrial-grade oils and alcohols remain a Gate 5 boundary.

## 14. Gemstones, Crystals, Lapidary Components, Conduits, Catalysts, And Enchantment Housings

The mineral and item catalogs own named gemstone identities and twelve gemstone-specific `cut_*` items, alongside generic `cut_stone`, but they do not label the named gems as rough or explicitly connect them to the cut identities. The live crystal catalog is a separate complete nine-affinity by three-form matrix of 27 records: shard, crystal, and cluster for each affinity. Each crystal slug happens to equal an item key, but no explicit crystal-to-item relationship owns that equality. The item catalog separately marks seven conduit items--`battle_staff`, `composite_bow`, `dirk_dagger`, `herb_pouch`, `kite_shield`, `mithrite_focus_ring`, and `orichalcum_relic_chain`--and three catalyst items--`void_crystal`, `elemental_crystal`, and `fire_crystal`. These distinct catalog and metadata authorities must not be collapsed.

Ordinary lapidary supports rough stone/crystal -> selection -> preform or blank -> cut, carved, drilled, or engraved piece -> polishing -> setting or mounting -> finished component. Secure holding, abrasion, drilling/cutting tools, polishing media, skill, loss/breakage, and a separately authored setting are dependencies. The specific abrasive and technique vary and can be archaeologically disputed ([Metropolitan Museum cameo study](https://www.metmuseum.org/met-publications/cameo-appearances), [Metropolitan Museum ancient-Egyptian technology study](https://www.metmuseum.org/de/perspectives/ancient-egyptian-technology), [carnelian bead functional analysis](https://doi.org/10.1016/j.jas.2015.03.030), [medieval polishing study](https://doi.org/10.1007/978-3-319-96379-2_9)). Modern gem guidance supports separate treatment and durability questions, not historical availability or magical efficacy ([GIA gem-treatment overview](https://www.gia.edu/gem-treatment?lang=en), [GIA emerald quality factors](https://www.gia.edu/UK-EN/emerald-quality-factor?lang=en)).

Repository magic canon distinguishes conduit, catalyst, vessel/housing, affinity binding, lapidary/jewelry installation, and permanent-enchantment flows. Its exact conductivity vocabulary is iron, steel, copper, `high_steel`, silver, gold, `platinum`, mithrite, orichalcum, and adamantite. `high_steel` and `platinum` do not resolve to current item or mineral identities and therefore cannot be promoted from design vocabulary ([global rules](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/game/global_rules.json)). Canon does not permit every attractive mineral to become a focus, every crystal to become a reusable battery, or lapidary quality to imply spell power. Any future housing must specify ordinary structural material, compatible mounted component, consumed or retained vessel semantics, owning magic infrastructure, and repair/replacement consequences. Detailed mundane-for-magic substitution remains Gate 7 work.

## 15. Dependency-Closed Source-To-Finished Chain Matrix

The matrix is a research topology, not an item or recipe manifest. A named identity is canonical only when it already exists in the repository; generic terms describe relationships whose future identity remains conditional.

### Matter and output closure

| Major lane | Source | Raw output | Initial preparation | Prepared/refined material | Intermediates and components | Finished destinations | Byproducts, scrap, waste, and hazards |
|---|---|---|---|---|---|---|---|
| Bast and reed textiles | Authored flora relationship | Harvested stem/bundle/reed | Sort, release fiber, dry | Cleaned fiber -> yarn/thread | Tow, cordage, cloth, rope, cut panels | Apparel, sails, containers, stationery | Woody residue, short fiber, wastewater; rot/dust/fire risk |
| Wool and specialty fiber | Authored fauna/monster output | Fleece or `cave_silk` | Sort, clean/scour, dry | Prepared fiber -> yarn; felt as parallel route | Thread, cloth, felt, cord | Garments, blankets, armor lining, furnishings | Grease if actually recovered, short fiber, dirty water; pests/fire |
| Hide and structural animal materials | Authored fauna/monster output | Fresh skin, bone, horn, shell, chitin, sinew | Stabilize, clean, grade, separate | Rawhide, fur-on stock, tanned leather, parchment, shaped structural stock | Straps, panels, cord, adhesive only through source-qualified route | Armor, clothing, book material, tools, ornament | Hair/flesh, offcuts, spent baths, dust, wastewater; biological/caustic hazards |
| Wood and plant industrials | Authored tree/flora output | Green log, branch, bark, exudate | Sort, convert, season or source-qualify | Seasoned timber, plank/beam, charcoal, qualified resin/cork/pulp | Joinery stock, paper sheet, pitch/rosin only through valid route | Buildings, furniture, tools, fuel, vessels, books | Sawdust, bark, offcuts, ash, tar residues, pulping water; fire/smoke |
| Stone, lime, clay, and ceramics | Canonical deposit/mineral/clay source | Block/rubble/aggregate, limestone, raw clay | Dress/crush/sort; burn/slake lime; clean/temper clay | Dimension stone, aggregate, lime binder, prepared body, dry greenware, fired ceramic | Mortar/plaster, brick/tile, vessel blank, refractory or grog if qualified | Masonry, plastered surfaces, pottery, kiln furniture | Dust, stone offcuts, kiln wasters, spent refractory, ash; silica/heat/caustic hazards |
| Glass | Canonical batch source plus compatible glass | Selected batch or sorted cullet | Sort, clean, charge compatible material | Refined/conditioned glass mass | Gather/preform, sheet, container blank | Vials, bottles, jars, panes, beads/components | Cullet, shards, furnace/crucible waste, fumes/dust; heat and cut hazards |
| Metals and alloys | Canonical mineral/ore or sorted scrap | Mined ore or qualified scrap | Sort/beneficiate; optional source-specific preparation | Smelted mass/bloom -> consolidated/refined stock -> canonical ingot/alloy | Billet/bar/sheet/wire/blank only if later authorized | Tools, weapons, armor, fittings, coin/ornament | Slag, dross, scale, swarf, sprues, offcuts, dust; heat/toxic-metal hazards |
| Salts, colorants, tannins, binders, and coatings | Canonical mineral/flora/fauna source | Salt-bearing feed, dye/tannin source, pigment mineral, binder source | Sort, extract or prepare under bounded authority | Salt, dye extract, pigment, lake, mordant, tannin, binder/vehicle as distinct states | Ink, paint, glaze, coating, tanning or dye bath | Colored textiles, writing, art, protection, treated leather | Spent baths, sludge, dust, wastewater; toxicity/corrosion varies |
| Oils, waxes, soap, candles, and process aids | Canonical biological/mineral source | Oil-bearing feed, fat, wax, aid stock | Clean/dry/press/render or source-appropriate preparation | Settled/filtered oil, graded wax, prepared aid | Wick plus candle body; soap only through bounded chemistry; lubricants/binders | Lighting, cleaning, food only after Gate 5, finishing, maintenance | Press cake, sediment, spent aid, caustic wash; fire/rancidity/chemical hazards |
| Gemstones, crystals, and housings | Canonical mineral or crystal record; explicit item relationship where authored | Unqualified named gem or shard/crystal/cluster; rough state remains conditional | Select and grade | Preform -> cut/drilled/engraved -> polished piece | Setting, mundane housing, conduit/catalyst/vessel relationship | Ornament or canon-routed magical installation | Grit, chips, broken stock, worn media; dust, brittleness, security risk |

### Capability, runtime, and authority closure

| Major lane | Tools and workplace | Infrastructure, energy, water, environment, and scale | Live chain/workplace posture | Authority disposition | Later-gate consumer |
|---|---|---|---|---|---|
| Bast and reed textiles | Harvest tools; fiber-preparation, spinning, loom, fulling/finishing capabilities | Dry storage; clean/dirty-water separation where retting/scouring occurs; household to workshop, water-assisted only if regional infrastructure supports it | Textile chains exist, but material inputs are fallback-selected and `cloth` recipe semantics do not match declared outputs | Preserve topology; author source suitability and relationships before identities; reserve runtime correction | Gate 6 audit; Gate 7 substitution; integration |
| Wool and specialty fiber | Sorting/scouring, spindle, loom or felt-working capability | Water, drainage, drying, pest control, fire-safe storage; household/workshop | Wool and linen share broad workplace fallback; no specialty `cave_silk` chain authority | Keep fibers separate; require source and consumer closure | Gates 6-7; integration |
| Hide and animal structural | Scraping/cutting/shaping tools; tannery, parchment, adhesive, bone/horn/shell working as separate capabilities | Water, drainage, ventilation, drying/tension frames, waste isolation; specialist workshop | Two cured-leather chains duplicate semantics; tannery/parchment fallbacks omit essential biological inputs | Correct conceptual separation; author inputs; collision-audit identities | Gate 6; Gate 7; integration |
| Wood and plant industrials | Felling, sawing, hewing, joinery, kiln, resin/pulp/sheet capabilities | Seasoning sheds, dry storage, controlled airflow/heat, waterpower only if local; household to institutional paper mill | Plank/beam requested targets can become default softwood variants; paper inputs are global fallback | Preserve variants but require requested-output semantics and authored inputs | Gate 6; Gate 7; integration |
| Stone, lime, clay, ceramics | Quarry/dressing, lime kiln, mixing, forming, pottery kiln, finishing | Quarry access, dust control, heat/refractory, drying, water/drainage, weather protection; workshop to construction site | Extraction can emit finished targets; kiln inputs use broad fallback; tiers/quantities ignored | Require state and relationship ownership before new catalog depth | Gate 6; integration |
| Glass | Batch preparation, furnace/pot, glassworking, annealing, finishing | High heat, refractory containment, ventilation, compatible cullet storage, cooling/annealing; specialist scale | Glassworks fallback can omit sand and declared containers | Separate primary/secondary work; author inputs and output contract | Gate 6; Gate 7; integration |
| Metals and alloys | Mining/preparation, furnace, bloomery/foundry/smithy, forming and finishing tools | Ore/fuel/flux where canonical, airflow, refractory, water/cooling, ventilation, secure storage; specialist/institutional | Smelter fallback combines unrelated ores and expands output family; recipes and chain skills diverge | Canonical metals only; reserve formula and runtime ownership | Gate 6; Gate 7; integration |
| Colorants and coatings | Sorting/grinding, extraction vessel, dye/tannery/ink/paint capability | Water, drainage, ventilation, light-safe storage, containment; household craft to specialist | Broad skills/workplace IO cannot encode source/substrate compatibility | Require qualified source-to-substrate relationships and waste owner | Gate 5 for food crossover; Gate 6; integration |
| Oils, waxes, soap, aids | Press/render/filter, chandlery, soap/finishing capability | Dry feed storage, heat/fire control, settling vessels, caustic containment, clean/dirty separation | Boolean fuel and broad chandlery fallback do not own identities or quantities | Keep food/industrial grades unresolved; no hazardous formula | Gate 5; Gate 6; Gate 7 |
| Gems, crystals, housings | Lapidary holding/cutting/drilling/polishing; jeweler/installer | Abrasive and water management, dust control, secure storage, ordinary setting/housing; specialist | 27 crystal slugs match items only implicitly; magic infrastructure is descriptive and bounded | Add no magic path; verify explicit identity relation and ordinary mounting dependencies | Gate 7; integration |

## 16. Technology Compatibility Without A Century Label

Capability bands avoid importing a single historical date into a setting whose regions and institutions differ:

1. **Household/manual:** sorting, washing, drying, scraping, hand spinning, simple forming, repair, and low-throughput finishing with portable tools.
2. **Craft workshop:** fixed benches, looms, vats, kilns/hearths, controlled storage, specialist labor, repeatable quality checks, and local waste handling.
3. **Mechanical or site-assisted:** water-, wind-, animal-, gravity-, or landscape-assisted crushing, stamping, sawing, pumping, ventilation, or transport where the live region supports the infrastructure.
4. **Heat-specialist:** controlled kiln, furnace, glasshouse, lime-burner, charcoal site, foundry, or other refractory-dependent operation with dedicated fuel, airflow, containment, maintenance, and fire separation.
5. **Institutional/networked:** capital-intensive or hazardous production requiring supply contracts, transport, guild knowledge, security, inspection, multiple workplaces, or large waste/energy handling.
6. **Bounded magical specialty:** a canon-routed service layered over an ordinary process; finite, maintained, scarce, and never a substitute for matter, fuel, ownership, or skill.

A proposed lane is compatible only if it passes all of these tests:

- **Source:** the repository has a canonical source and an explicit relationship to the raw output.
- **State:** raw, prepared, refined, intermediate, component, finished, residue, and waste identities are not collapsed.
- **Capability:** tools, skill, workplace, infrastructure, energy, water, environment, maintenance, and repair are jointly plausible.
- **Scale:** household, workshop, specialist, or institutional throughput matches storage, transport, labor, and waste burdens.
- **Region:** resources, imports, climate, and infrastructure support the route without inventing placement or culture.
- **Authority:** chain topology, bounded recipe quantities, workplace capability, runtime behavior, and market/value ownership do not overwrite one another.
- **Safety:** hazardous operations remain dependency-level and have containment/waste owners.
- **Gameplay:** the identity or relationship has repeated consumers and a decision, bottleneck, trade, quality, repair, or salvage consequence.
- **Magic:** any assistance satisfies a live route, finite capacity, housing, upkeep, failure, scarcity, access, and non-universality test.

## 17. Regional And Cultural Variation

The nine live regional-ecology profiles provide resource and import constraints, not permission to create industries or traditions:

| Live profile | Canonical material posture | Research-compatible implication |
|---|---|---|
| Kaelvar | Moderate timber/fiber; strong metals/stone; wool, copper, iron, salt | Multiple ordinary material lanes are plausible, but workplace placement and culture still require authored input |
| Valtherion | Strong timber/fiber and metals/stone; flax, timber, steel tools | Supports supply breadth, not automatic mechanization, alloy formulas, or universal guild practice |
| Serathyl | Strong timber/fiber; limited metals/stone; hardwood, ship timber, dyes; imports iron/stone | Wood/colorant specialization and import dependence are plausible relationships; exact industries remain unauthored |
| Draemor | Strong timber/fiber; moderate metals/stone; hides; needs metal/hardwood | Hide supply and import pressure are supported; tanning practice, waste handling, and outputs need authored authority |
| Talmyra | Moderate timber/fiber; strong metals/stone; rare hardwood, resin, precious metals, gems; imports steel/cloth | High-value material access is plausible, but lapidary, resin, and magic routes remain conditional |
| Myridian | Moderate timber/fiber; limited metals/stone; pearls, ship repair; imports metal/timber | Repair and shell/pearl trade can be researched; local source and workshop records must own implementation |
| Lantern | Moderate timber/fiber; limited metals/stone; tropical woods; imports iron | Source-specific wood lanes and metal dependence are plausible; no unlisted species or technique may be inferred |
| Serpent Wake | Limited timber/fiber and metals/stone; mangrove timber/dyestuffs; imports iron/cloth | Scarcity and imported cloth/metal are controlling constraints; dyestuff suitability is not automatic |
| Dawnreach | Moderate timber/fiber; limited metals/stone; furs, conifer, resin; imports textiles/forged metal | Fur/resin source relationships and import dependence are plausible; exact processing remains authored input |

The repository also has 41 regions, 47 localities, and 88 settlements, but Gate 4 does not map every capability onto them. Cultural practice, guild ownership, labor organization, quality traditions, gendered or status labor, trade monopolies, workshop placement, and regional terminology require authored design. External examples demonstrate possible capabilities only.

## 18. Tools, Workplaces, Infrastructure, Energy, Environment, Maintenance, Repair, And Scale

Exact repository identities and generic research capabilities must remain separate. The catalog has 131 tool items, 58 workplace records, 208 job records representing 110 unique job IDs, 121 skills, 22 extraction methods, seven infrastructure records, and four magic-infrastructure records. Chain workplace steps use only Alchemy, Blacksmithing, Carpentry, Cooking, Leatherworking, and Weaving. Other live skills--including Smelting, Tanning, Kiln Operation, Pottery, Masonry, Material Processing, and Charcoal Burning--exist but are not selected by those steps. Research language such as `annealing area`, `retting water management`, or `dust collection` names a capability, not a new workplace record.

| Concern | Exact live posture | Required future boundary |
|---|---|---|
| Tools | Jobs reference 298 `tool.*` capability tags across 100 unique values; all jobs have requirements; a non-authoritative prefix-stripped name diagnostic matches 95 to item keys and leaves `serving_tray`, `kitchen_knife`, `cooking_pot`, `ladle`, and `axe` unmatched | No canonical tag-to-item relationship requires lexical equality; decide job selection and tool authority before enforcing or expanding requirements |
| Workplaces | 58 identities own broad input/output and job profiles | A workplace describes capability; it must not author exact recipe quantities by fallback |
| Jobs and tiers | 208 job occurrences; all required-tier and numeric workforce fields are placeholders | Do not infer staffing, rank gates, or throughput until an owner is chosen |
| Upgrades | 25 workplaces expose 116 upgrade IDs; resolver reads none | Treat as descriptive/planned, not live production modifiers |
| Skills | Six skills used by chains despite more specific canonical skills | Integration must verify abstraction versus mapping debt; Gate 4 does not remap |
| Infrastructure | Seven ordinary and four magic records | Require explicit region/settlement availability and consumer links before runtime gating |
| Energy and fuel | Runtime accepts only `fuelAvailable` and never selects or consumes an item | Fuel identity, compatibility, stock, residue, and scarcity require authored/runtime ownership |
| Water and environment | Mostly prose or implicit; not resolved | Wet/dry separation, drainage, ventilation, weather, atmosphere, contamination, and storage need bounded relationships |
| Maintenance and repair | Tool penalties exist, but wear, refractory life, seals, frames, molds, vessels, and repair inputs are not modeled | Add only if repeated gameplay consumers justify the state and runtime owner |
| Scale | Workplace prose and workforce placeholders; no selected tier | Throughput must follow labor, equipment, storage, transport, energy, and waste capacity, not a century label |

## 19. Residues, Waste, Salvage, Recycling, And Catalog-Noise Filter

Residues should be classified by a real downstream relationship:

1. **Clean sorted salvage:** compatible cullet, known metal offcuts/sprues, reusable dressed stone, or qualified ceramic grog with an explicit consumer.
2. **Recoverable process residue:** composition-dependent metal-bearing slag/dross/dust, grease, fiber tow, press cake, or other material that needs a separate recovery step and market justification.
3. **Hazardous or contaminated residue:** toxic-metal waste, respirable mineral dust, caustic or dye/tanning baths, contaminated water, or incompatible furnace/glass waste requiring containment.
4. **Ordinary discard:** heterogeneous residue with no safe, repeated, gameplay-relevant consumer.

Recovery is not automatic recycling. It requires known composition/source, sorting, storage, a compatible process, energy/labor, a willing consumer, and a value greater than its handling burden. Byproducts that exist only to make every process look complete should remain unmodeled. A static identity should pass the same catalog-noise test: canonical source, collision audit, repeated consumers, item/value coverage, stage/role compatibility, chain and recipe implications, tools/workplace/skill/fuel closure, regional support, and integration approval.

The live catalog itself warns against semantic inference from category placement. `sausage_link` and `smoked_sausage_link` appear in the stationery processing group; `sausage_coil` appears in lighting; `quicklime` and `mineral_brine` carry fuel roles; and several residues have broad role combinations. These are collision-audit signals, not authority to reclassify records during research. Gate 4 reports them for integration or a narrowly scoped later correction.

## 20. Magic Interaction Classification

Ordinary material technology is the baseline. The six required classes apply as follows:

| Class | Gate 4 use | Permitted posture |
|---|---|---|
| `mundane_only` | Default for extraction, preparation, refinement, waste handling, repair, and ordinary finished goods | No magic dependency or benefit is assumed |
| `mundane_baseline_magic_assisted` | Possible for observation, warning, alignment, lifting, temporary preservation, controlled airflow, illumination, or warded storage | Must name a canonical route, finite capacity, ordinary housing, maintenance, failure, scarcity, access, and why mundane work remains necessary |
| `parallel_magical_specialty` | A scarce magical grade or service may coexist with ordinary production | Separate consumer and authority; no automatic replacement or universal quality |
| `magic_equivalent_institutional` | A guild, shrine, or other canonical institution might provide a bounded equivalent service | Requires institutional access, security, throughput, upkeep, and non-universality |
| `magic_exclusive` | Reserved for a result whose live canon explicitly requires magic | Cannot be inferred from crystal appearance, conductivity vocabulary, or external materials evidence |
| `unstable_or_prohibited` | Dangerous, canon-conflicting, unbounded, or ownerless proposals | Reject or quarantine; never a shortcut around source, purity, tool, fuel, skill, infrastructure, scarcity, or waste |

Every later magical proposal must resolve canonical affinity and vessel/conduit/catalyst/spell/ritual/ward/enchantment routing; finite capacity and recharge; target magnitude and duration; ambient conditions and material retention; mundane housing, insulation, seals, framing, drainage, and ventilation; skill, installation, maintenance, failure, transport, security, institutional access, and player value. Gate 4 rejects free matter or fuel, infinite heat or reuse, perfect control or purity, lossless refinement, universal sterilization/conductivity, instant curing, automatic alloying, zero waste, and unlimited lifting.

## 21. Content Candidate And Authority Matrix

The rows are integration candidates only. None authorizes creating or editing a record.

| # | Candidate | Classification | Proposed authority | Gameplay value | Confidence | Disposition | Dependencies | Blockers | Later gate | Audit relevance |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | Preserve raw/prepared/refined/intermediate/component/finished/residue separation | `factual_correction` | Durable design/validation principle | `critical` | high | accept | stage/role review | four-stage vocabulary may be too coarse | integration | Prevents fallback state collapse |
| 2 | Require canonical source relationship before any material identity | `schema_or_validator_precondition` | Source catalog plus validator | `critical` | high | promote conditionally | flora/fauna/mineral/crystal links | fragmented owners | integration | Detects fabricated extraction outputs |
| 3 | Qualify generic flora `fiber` before textile use | `missing_static_relationship` | Flora relationship authority | `high` | high | verify then correct | source suitability, consumers | 74 ambiguous emitters | integration | Avoids global workplace inference |
| 4 | Author bast-fiber preparation relationships | `missing_static_relationship` | Chain topology plus bounded recipe | `high` | high | conditional | source, tools, water, skill | recipe/runtime split | Gates 6-7 | Replaces linen fallback |
| 5 | Keep wool, felt, bast, reed, and cave silk lanes separate | `factual_correction` | Item/source relationships | `high` | high | accept principle | canonical outputs and consumers | sparse specialty relationships | integration | Prevents mixed loom inputs |
| 6 | Distinguish fresh hide, preserved hide, rawhide, leather, fur-on, parchment | `factual_correction` | Item/relationship authority | `critical` | high | accept | source, stabilization, workplace | missing intermediates | integration | Prevents finished extraction fallback |
| 7 | Source-qualify glue/gelatin rather than aliasing animal materials | `missing_static_identity` | Conditional item plus bounded recipe | `medium` | high | defer | repeated binder consumers, value | no current source/output identities | integration | Recipe owner required |
| 8 | Treat bone, horn, shell, sinew, and chitin as distinct capability families | `missing_static_relationship` | Source-to-consumer relationships | `medium` | high | verify | canonical source and uses | uneven outputs | integration | Limits broad material fallback |
| 9 | Reject generic modern purified chitin chemistry | `rejected_complexity` | None | `negative` | high | reject | none | canon, safety, absent consumers | none | Removes hazardous scope |
| 10 | Separate green wood, seasoned stock, forms, components, and goods | `factual_correction` | Item/chain relationship authority | `high` | high | accept principle | species/form, storage, consumers | incomplete stage coverage | integration | Clarifies plank/beam targets |
| 11 | Distinguish charcoal, ash, tar, pitch, resin, rosin, gum, cork, and bark | `factual_correction` | Source-qualified relationships | `high` | high | accept principle | canonical source and consumer | catalog collisions/sparse sources | integration | Prevents fuel/process-aid inference |
| 12 | Author paper pulp-to-sheet topology before expanding stationery | `authored_input_required` | Bounded recipe plus chain topology | `high` | high | correct later | fiber/rag source, water, sizing, workplace | current global fallback | Gate 6/integration | Direct fallback evidence |
| 13 | Separate limestone, burned lime, slaked lime, mortar/plaster, cured masonry | `factual_correction` | Item/relationship authority | `high` | high | accept principle | canonical source, kiln, substrate | missing state identities | integration | Prevents source-to-finished jumps |
| 14 | Preserve clay body, greenware, dried ware, fired ceramic, glazed ware | `missing_static_relationship` | Chain plus recipe authority | `high` | high | conditional | clay source, kiln, tools, fuel | resolver extracts finished vessel | Gate 6/integration | Direct trigger evidence |
| 15 | Separate primary glassmaking, secondary glassworking, compatible cullet | `factual_correction` | Chain/workplace relationship authority | `critical` | high | accept principle | batch source, refractory, annealing | glass fallback omits sand | Gate 6 | Direct trigger evidence |
| 16 | Add generic abrasive identity only with repeated consumers | `missing_static_identity` | Conditional item/recipe authority | `medium` | medium | defer | canonical source, compatibility, value | no live general identity | integration | Avoids heuristic substitution |
| 17 | Preserve ore/concentrate/bloom/ingot/stock/finished distinctions without promoting absent IDs | `factual_correction` | Canonical mineral/item authority | `critical` | high | accept principle | metal-by-metal collision audit | only some states exist | integration | Exposes smelter fallback |
| 18 | Author exact metal inputs/outputs under bounded authority | `authored_input_required` | Recipe/runtime contract | `critical` | high | reserve | canon metals, tools, fuel, skill | Gate 6 trigger decision | Gate 6 | Central trigger evidence |
| 19 | Distinguish slag, dross, scale, swarf, sprues, offcuts, and scrap | `factual_correction` | Residue relationship authority | `high` | high | accept principle | composition, recovery consumer | noisy roles and missing owner | integration | Prevents automatic byproduct value |
| 20 | Keep salt source routes qualified | `missing_static_relationship` | Mineral/resource relationship authority | `medium` | high | verify | deposit/brine/saline source, region | generic trade abstraction | Gate 5/integration | Limits global input inference |
| 21 | Separate pigment, dye, lake, mordant, tannin, binder, ink, paint, glaze, coating | `factual_correction` | Item plus bounded recipe relationships | `high` | high | accept principle | source/substrate/vehicle/consumer | incomplete identities | integration | Prevents category aliasing |
| 22 | Source- and substrate-qualify dye/tannin relationships | `authored_input_required` | Flora/material relationship authority | `high` | high | defer to authorship | regional source, fiber/hide, waste | external evidence cannot create canon | integration | Avoids broad tannery/dye fallback |
| 23 | Split food-grade and industrial oils only after Gate 5 | `missing_static_relationship` | Food/material recipe authorities | `high` | medium | defer | source, spoilage, consumer, safety | Gate 5 unresolved | Gate 5 | Stops cross-gate collision |
| 24 | Keep wax families and candle components distinct | `missing_static_relationship` | Item/recipe authority | `medium` | high | conditional | wax source, wick, chandlery, value | broad fallback inputs | Gate 5/integration | Requires authored candle input |
| 25 | No executable soap, solvent, alloy, furnace, pigment, or waste-treatment formulas | `rejected_complexity` | Safety boundary | `critical` | high | reject | none | hazardous/enabling detail | all | Prevents unsafe implementation |
| 26 | Add explicit crystal-to-item relationship if integration confirms need | `schema_or_validator_precondition` | Crystal schema/content | `medium` | high | verify then promote | slug/item collision audit | equality is implicit today | Gate 7/integration | Avoids magic identity inference |
| 27 | Do not promote conductivity-profile strings lacking canonical identities | `conflicts_with_canon` | None until canon exists | `negative` | high | reject | explicit item/mineral authority | absent identities | Gate 7 | Blocks metadata-as-item leakage |
| 28 | Require ordinary housing and mounting for magical material components | `missing_static_relationship` | Magic infrastructure plus recipe authority | `high` | high | reserve | conduit/catalyst/vessel, mundane setting | Gate 7 substitution work | Gate 7 | Prevents magic bypass |
| 29 | Add validation for empty material-chain inputs/outputs and target mismatches | `schema_or_validator_precondition` | Production-chain validator | `critical` | high | reserve | chosen chain/runtime contract | Gate 6 owns audit decision | Gate 6 | Direct audit trigger |
| 30 | Replace workplace-global fallback with an explicit production input contract | `runtime_owner_required` | Civilization runtime | `critical` | high | reserve, do not implement | recipe/chain precedence decision, tests | post-Gate-6 audit | Gate 6 | Direct audit trigger |
| 31 | Consume critical-tool blocking or redefine `no_output` semantics | `runtime_owner_required` | Civilization runtime | `critical` | high | reserve | job selection, test contract | current flag is ignored | Gate 6 | Direct audit trigger |
| 32 | Select workplace job/tier/upgrades before they affect production | `runtime_owner_required` | Civilization runtime/workplace contract | `high` | high | defer | authored tiers, staffing, upgrades | placeholders and unused fields | Gate 6 | Direct audit trigger |
| 33 | Represent fuel as an identity only after ownership decision | `runtime_owner_required` | Recipe/runtime/inventory contract | `high` | high | defer | fuel compatibility, stock, consumption, residue | boolean-only resolver | Gate 6 | Direct audit trigger |
| 34 | Preserve regional craft descriptions without inventing cultures or placements | `lore_or_description_only` | Authored regional/lore content | `medium` | high | reserve for authorship | region facts, cultural review | research examples are non-canonical | integration | None unless linked to runtime |
| 35 | Avoid one catalog item per dust, shard, bath, slag grade, or stock form | `rejected_complexity` | Catalog-noise filter | `high` | high | reject by default | repeated consumers and value exception | catalog scale/noise | integration | Reduces fallback surface |
| 36 | Record broad resolver defects as potential post-Gate-6 trigger evidence | `runtime_owner_required` | Audit-trigger decision | `critical` | high | accept evidence; reserve decision | Gate 5-6 evidence, focused tests | Gate 6 has final decision | Gate 6 | Direct trigger evidence |

Every conditional identity row remains subject to canonical source, collision audit, repeated consumers, item/value coverage, stage/role compatibility, chain ownership, recipe implications, workplace/tool/skill/fuel dependencies, regional support, later-gate findings, and final integration disposition.

## 22. Uncertainty And Confidence

### High confidence

- The repository counts, identifiers, staged-item distribution, resolver behavior, chain/workplace fallback counts, planned-recipe boundary, and focused-test coverage are reproducible from the fixed baseline.
- The major state distinctions--raw versus prepared/refined/finished, leather versus parchment/rawhide, green versus seasoned wood, limestone versus lime/mortar, clay versus ceramic, batch versus glass, ore versus metal stock, and pigment versus dye/binder--are supported by multiple suitable sources.
- Gate 4 found broad live-consumer evidence potentially relevant to the post-Gate-6 authority-audit trigger.

### Medium confidence

- Which missing intermediates deserve discrete items rather than relationships, tags, or recipe-only states depends on repeated consumers and integration collision checks.
- Some broad live skills and workplaces may be intentional abstractions rather than defects.
- Regional material implications are compatible with live ecology profiles, but industry placement and cultural organization remain unauthored.

### Low or unresolved

- Exact process quantities, yields, grades, quality thresholds, durations, temperatures, staffing, throughput, prices, and residue recovery rates.
- Whether every legacy grouping anomaly is an error versus a deliberate compatibility classification.
- Which optional capability should become infrastructure, workplace prose, tool identity, recipe input, chain relationship, or runtime state.

### Source cautions

- Government industrial and safety documents transfer categorical process, hazard, and waste distinctions, not modern machinery, law, efficiency, or scale.
- Archaeological, museum, and conservation sources may be site-, object-, region-, or preservation-specific and cannot establish universal adoption.
- Peer-reviewed modern materials research supports relationships and variability, not repository availability or exact game balance.

### Repository claims requiring later verification

- Whether the implicit crystal slug/item equality should become explicit.
- Whether `adamantite_ingot` intentionally lacks a chain.
- Whether duplicate cured/exotic leather chain semantics, five non-authoritative normalized tool-name mismatches, category anomalies, and unused specific skills are defects or planned placeholders.
- Whether the 62 omitted declared outputs and 11 requested-target mismatches are intended market abstractions.

### Issues deferred to Gate 5

- Food-grade versus industrial oils, salts, alcohols, smoke, waxes, fats, byproducts, storage, spoilage, contamination, and edible-feed suitability.
- Where processing and preservation boundaries create material identities consumed by both food and craft systems.

### Issues deferred to Gate 6

- Final determination of the production-authority audit trigger.
- Extraction/source-to-material closure, chain/recipe/runtime precedence, empty input/output fallback, requested-output semantics, job/tool/tier behavior, fuel ownership, quantities, byproducts, and focused regression requirements.

### Issues deferred to Gate 7

- Detailed mundane-for-magic substitution; canonical affinities; vessel, conduit, catalyst, ward, ritual, and enchantment routing; finite capacity; recharge; housing; failure; scarcity; and institutional access.

### Issues reserved for integration

- Candidate identity promotion, stage/role/schema changes, regional placement, value coverage, authored cultural practice, catalog collision cleanup, and the scope/order of any later implementation prompt.

### Issues potentially triggering the production-authority audit

- Runtime-wide fallback supplies materially important inputs/outputs; exact target selection can fail; all-job tools are aggregated; `no_output` does not block; fuel is boolean; tiers/upgrades/quantities are ignored; earlier-step outputs disappear; exact planned recipes do not govern the live resolver; and focused tests do not isolate these effects. Gate 4 records this evidence but does not make the final trigger decision.

## 23. Integration Disposition

The later cross-domain integration should:

- **Accept** the state/authority separations, dependency-closure tests, ordinary-technology baseline, safety boundary, source-qualified relationships, and catalog-noise filter.
- **Verify** every candidate against the live baseline at integration time, especially crystal/item linkage, `adamantite_ingot`, tool tags, duplicated leather chains, skills, group anomalies, recipe links, and changed runtime consumers.
- **Correct** only demonstrated factual or semantic defects in a separately authorized pass; do not silently correct live content from this research artifact.
- **Promote** an identity or relationship only after canonical source, collision, consumer, value, stage/role, chain/recipe, capability, region, and later-gate checks close.
- **Defer** food boundaries to Gate 5, final runtime-authority findings to Gate 6, and magic substitution to Gate 7.
- **Reject** universal or source-free material chains, hazardous executable formulas, modern chemistry imported without canon, free or perfect magic, automatic recycling, and catalog detail without gameplay value.
- **Collision-audit** all proposed IDs, broad legacy roles/groups, generic source outputs, chain variants, market-only identities, and cross-gate items before implementation.
- **Reserve** architecture, schema, validator, runtime, recipe, balance, regional-placement, and magic decisions for their owning prompt.

Gate 4 found evidence that may satisfy several post-Gate-6 production-chain/workplace runtime-authority audit triggers: fallback controls important material inputs and outputs; requested-output behavior conflicts with exact selection; workplace job/tool semantics are coupled and blocking is ineffective; and focused tests do not isolate those behaviors. Gate 6 owns the final trigger decision.

The next executable gate is `GPT-DR.food.processing-preservation`. The cross-domain integration prompt, the seven-artifact integration hold, and the block on a revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` remain in force.

## 24. Sources

### Repository sources

All repository links below were read at the fixed Gate 4 baseline. They are primary authority for project state.

| Repository source | Findings supported |
|---|---|
| [Production chains](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/production_chains.json) | Chain, stage, input/output, skill, variant, and declared-output counts |
| [Workplaces](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/workplaces.json) | Workplace IO, jobs, tiers, upgrades, tools, services, and placeholders |
| [Runtime economy](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/runtime-economy.ts) | Live resolver, fallback, outputs, quantity, tool, fuel, cost, and waste behavior |
| [Runtime-economy tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-runtime-economy.test.mjs) | Existing focused coverage and omissions |
| [Items](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/items.json) | Item totals, IDs, stages, roles, groups, difficulty, conduits, catalysts |
| [Item schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/items/item.schema.json) | Allowed item metadata and validation boundary |
| [Market item values](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/market_item_values.json) | Value coverage and market-only identities |
| [Minerals](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/minerals.json) | Canonical mineral sources and tiers |
| [Crystal catalog](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/crystal_catalog.json) | Crystal affinities/forms and implicit slug/item correspondence |
| [Planned recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/crafting/recipes.json) | Bounded static transformations and reference closure |
| [Current GPT handoff](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-gpt-handoff.md) | Gate route, accepted state, and integration hold |
| [Current Codex output](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-output.md) | Exact prior-run status and next gate |
| [Active prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-prompt.md) | Held integration prompt identity |
| [Queued prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/queued-cross-domain-production-research-integration-prompt.md) | Byte-identical queued integration route |
| [Flora](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/flora.json) | Plant-source relationships and output counts |
| [Fauna](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/fauna.json) | Animal-source relationships and output counts |
| [Monsters](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/monsters.json) | Monster drops, loot, and material-looking outputs |
| [Resources](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/resources.json) | Legacy resource identities |
| [Commodities](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/commodities.json) | Legacy commodity identities |
| [Extraction methods](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/extraction_methods.json) | Canonical extraction identities and chain references |
| [Guilds](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/guilds.json) | Guild identities and service context |
| [Infrastructure](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/infrastructure.json) | Seven ordinary infrastructure identities |
| [Magic infrastructure](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/magic_infrastructure.json) | Four bounded magic-service identities and prohibited bypasses |
| [Skills](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/skills.json) | Canonical skill vocabulary and chain-use comparison |
| [Global rules](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/game/global_rules.json) | Material-conductivity vocabulary and lapidary, jewelry, binding, and enchantment authority |
| [Knowledge snippets](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/knowledge_snippets.json) | Lore count and non-authoritative prose boundary |
| [Regional ecology profiles](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regional_ecology_profiles.json) | Nine material/resource/import profiles |
| [Regions](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regions.json) | Canonical region count and identities |
| [Region localities](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/region_localities.json) | Locality count and placement boundary |
| [Settlements](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/settlements.json) | Settlement count and placement boundary |
| [Civilization content loader](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/content.ts) | Runtime content-loading owner |
| [Simulation consistency](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/simulation-consistency.ts) | Chain/workplace outputs as simulation sources |
| [Transport runtime](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/transport-runtime.ts) | Local-price consumption by transport calculations |
| [Gate 1 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md) | Accepted extraction/source continuity |
| [Gate 2 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md) | Accepted ecology/byproduct continuity |
| [Gate 3 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md) | Accepted agriculture/livestock continuity |
| [Content lint](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/index.mjs) | Reference/vocabulary checks and missing semantic validations |
| [Production-authority audit trigger](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/production-chain-workplace-runtime-authority-audit-trigger.md) | Conditional trigger criteria and Gate 6 decision owner |

### External source register

The external corpus contains 61 works represented by 61 distinct URLs: 11 A2, 30 B1, and 20 B2; no A1 or C source is used.

| # | Title | Author/organization | Link | Class | Findings supported | Transferability limitation |
|---:|---|---|---|:---:|---|---|
| E1 | Retting of Bast Fiber Crops Like Hemp and Flax | Angulu and Gusovius | [DOI](https://doi.org/10.3390/fib12030028) | A2 | Retting, separation, cleaning, refining stages | Modern review; no historical route, duration, or yield |
| E2 | Environmental impacts of hemp and flax textile yarn | van der Werf and Turunen | [DOI](https://doi.org/10.1016/j.indcrop.2007.05.003) | A2 | Route-specific water, energy, and effluent burdens | Modern life-cycle comparison; qualitative transfer only |
| E3 | Hallstatt textile technology | Natural History Museum Vienna | [Source](https://www.nhm.at/hallstatt/en/textiles/technology) | B2 | Preparation, hand spinning, loom weaving, quality | Hallstatt-specific; capability is not universal adoption |
| E4 | Argentina: Survey of Argentine Wool Scouring Methods, Technical Report | UNIDO | [Source](https://www.unido.org/publications/ot/9646100) | B1 | Sorting, scouring, grease recovery, drying, wastewater | Modern industrial analogue; no scale or recovery rates |
| E5 | Ala-kiyiz and Shyrdak felt-carpet practice | UNESCO | [Source](https://ich.unesco.org/en/RL/ala-kiyiz-and-shyrdak-art-of-kyrgyz-traditional-felt-carpet-making-00693) | B1 | Felt as a distinct consolidation and craft route | One living tradition; no universal regional practice |
| E6 | Textile Industry Teachers' Kit | Historic England | [Source](https://historicengland.org.uk/content/docs/education/explorer/teachers-kit-textile-industry-pdf/) | B1 | Fulling and textile-process capability distinctions | Interpretive English guide; not a universal chronology |
| E7 | Hides and skins sector guidance | FAO | [Source](https://www.fao.org/unfao/bodies/ccp/hs/98/w9700e.htm) | B1 | Prompt preservation, drying/salting, handling, grading | Development guidance; qualitative dependencies only |
| E8 | Caring for leather, skin, and fur | Canadian Conservation Institute | [Source](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/caring-leather-skin-fur.html) | B1 | Rawhide, tanned leather, fur-on differences | Conservation behavior, not production recipes |
| E9 | Parchment conservation | Codex Sinaiticus Project | [Source](https://www.codexsinaiticus.org/en/project/conservation_parchment.aspx) | B2 | Parchment as untanned, stretched/scraped skin | Manuscript-grade context; no universal workshop practice |
| E10 | Animal glues: a review | Schellmann | [DOI](https://doi.org/10.1179/sic.2007.52.Supplement-1.55) | A2 | Collagen adhesives differ by source/preparation | Conservation focus; no extraction procedure |
| E11 | Care of ivory, bone, horn, and antler | Canadian Conservation Institute | [Source](https://www.canada.ca/en/conservation-institute/services/conservation-preservation-publications/canadian-conservation-institute-notes/care-ivory-bone-horn-antler.html) | B1 | Structural-material and deterioration distinctions | Conservation guidance; not craft throughput |
| E12 | Feathers, quills, horn, and keratinous materials | Canadian Conservation Institute | [Source](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/feathers-quills-horn-keratinous-materials.html) | B1 | Keratin-family handling distinctions | Conservation guidance; not production authority |
| E13 | Sinew collection category | Museum of New Zealand Te Papa Tongarewa | [Source](https://collections.tepapa.govt.nz/category/312205) | B2 | Sinew as a distinct worked animal material | Collection evidence; no universal process chain |
| E14 | Making buttons on Delmarva from imported shells | Smithsonian Environmental Research Center | [Source](https://serc.si.edu/research/projects/making-buttons-delmarva-imported-shells) | B2 | Shell selection, shaping, trade, and waste context | Regional historical project; not universal practice |
| E15 | Chitin, Chitosan, and Nanochitin: Extraction, Synthesis, and Applications | Michael Kozma, Bishnu Acharya, and Rabin Bissessur | [DOI](https://doi.org/10.3390/polym14193989) | A2 | Purified chitin chemistry has distinct processing | Modern chemistry; cited to reject transfer into canon |
| E16 | Vegetable tannins in historic leathers | Falcao and Araujo | [DOI](https://doi.org/10.3390/molecules23051081) | A2 | Tannin source variation and suitability | No repository species or tanning formula |
| E17 | Tanning and leather finishing EHS guidelines | World Bank Group | [Source](https://documents1.worldbank.org/curated/en/874161491555046600/pdf/114073-WP-ENGLISH-Tanning-and-Leather-Finishing-PUBLIC.pdf) | B1 | Effluent, caustic, dust, odor, containment hazards | Modern safety analogue; no operational process |
| E18 | Wood Handbook, chapter 13 | USDA Forest Products Laboratory | [Source](https://research.fs.usda.gov/treesearch/62261) | B1 | Green wood, seasoning, humidity, dimensional stability | Modern engineering; no schedules/specifications transferred |
| E19 | Charcoal-making and logistics | FAO | [Source](https://www.fao.org/4/X5328e/x5328e02.htm) | B1 | Limited-air carbonization, cooling, screening, storage | Broad technical overview; no temperature/yield/kiln prescription |
| E20 | Birch-tar terminology and production | Schmidt and colleagues | [DOI](https://doi.org/10.1111/arcm.12820) | A2 | Tar/pitch terms depend on source/process/consistency | Birch-focused experimental archaeology |
| E21 | Natural resin | MFA Boston CAMEO | [Source](https://cameo.mfa.org/wiki/Natural_resin) | B2 | Resin distinct from gum, rosin, tar, pitch | Conservation glossary; source availability remains canonical |
| E22 | Rosin | MFA Boston CAMEO | [Source](https://cameo.mfa.org/wiki/Rosin) | B2 | Rosin as a processed resin fraction | Does not authorize every-source processing |
| E23 | Cork | FAO | [Source](https://www.fao.org/4/x5326e/x5326e0b.htm) | B1 | Cork as source-specific bark and graded product | Forestry overview; repository source still required |
| E24 | Papermaking | German Museum of Technology | [Source](https://technikmuseum.berlin/en/exhibitions/permanent-exhibition/papermaking/) | B2 | Pulp/slurry, sheet forming, pressing, drying | Museum overview; raw material and mechanization vary |
| E25 | Papermaking at Fabriano | Library of Congress | [Source](https://www.loc.gov/preservation/outreach/tops/albro/index.html) | B2 | Rag pulp, stamping, forming, gelatin sizing | Renaissance Italian high-skill context |
| E26 | Small-scale oilseed processing | FAO | [Source](https://www.fao.org/4/v5380e/V5380E07.HTM) | B1 | Cleaning, pressing, settling/filtering, press cake | Food manual; safety/suitability deferred to Gate 5 |
| E27 | Wax and wax-like materials - the what, where, and how in heritage collections | Analytical Methods Committee | [DOI](https://doi.org/10.1039/D1AY90035H) | A2 | Wax composition and family variability | Analytical reference; no craft recipe or price |
| E28 | Beeswax candle collection object | British Museum | [Source](https://www.britishmuseum.org/collection/object/E_Am1994-13-154) | B2 | Finished candle as formed wax plus wick | One object; no universal method or economy |
| E29 | Suds: 19th-century-style soap | Smithsonian National Museum of American History | [Source](https://americanhistory.si.edu/explore/stories/suds-how-make-soap-19th-century-style) | B2 | Fat/oil, alkali, water transformation and hazard | High-level historical interpretation; no formula |
| E30 | Natural constituents of historical textile dyes | Ferreira and colleagues | [DOI](https://doi.org/10.1039/b305697j) | A2 | Source-specific dye chemistry and overdyeing | No repository species, recipes, or access |
| E31 | Textile dyeing using natural mordants and dyes: a review | Repon and colleagues | [DOI](https://doi.org/10.1007/s10311-024-01716-4) | A2 | Fiber/colorant-specific affinity and mordant effects | Modern review; no universal baths or outcomes |
| E32 | Lime Mortars and Plasters | Getty Conservation Institute | [Source](https://www.getty.edu/projects/lime-mortars-plasters/) | B2 | Lime-cycle states and compatibility | Conservation context; no universal formulations |
| E33 | Preservation Brief 2: Repointing Mortar Joints | National Park Service | [Source](https://www.nps.gov/orgs/1739/upload/preservation-brief-02-repointing.pdf) | B1 | Substrate, permeability, exposure, curing | Modern conservation; not production recipe authority |
| E34 | Preservation Brief 22: Historic Stucco | National Park Service | [Source](https://home.nps.gov/orgs/1739/upload/preservation-brief-22-stucco.pdf) | B1 | Stucco/plaster/render and repair distinctions | Repair guidance; no universal formulation |
| E35 | AP-42: Crushed Stone Processing | US Environmental Protection Agency | [Source](https://www.epa.gov/sites/default/files/2020-10/documents/c11s1902.pdf) | B1 | Crushing, screening, grading, conveying, dust | Modern industrial scale; categorical transfer only |
| E36 | Crystalline Silica Overview | US Occupational Safety and Health Administration | [Source](https://www.osha.gov/silica-crystalline) | B1 | Cutting/crushing/grinding dust hazard | Modern safety analogue; no exposure procedure here |
| E37 | Archaeological and Historic Pottery Production Sites | Historic England | [Source](https://historicengland.org.uk/images-books/publications/archaeological-and-historic-pottery-production-sites/heag019-pottery-production-sites/) | B1 | Levigation, forming, drying, kilns, furniture, wasters, grog | English archaeological scope |
| E38 | AP-42: Ceramic Products Manufacturing | US Environmental Protection Agency | [Source](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf) | B1 | Ceramic process stages and emissions classes | Modern industry; no equipment or schedules transferred |
| E39 | AP-42: Refractory Manufacturing | US Environmental Protection Agency | [Source](https://www.epa.gov/sites/default/files/2020-10/documents/c11s05.pdf) | B1 | Refractory functions and manufacturing stages | Modern materials may be anachronistic |
| E40 | AP-42: Bricks and Related Clay Products | US Environmental Protection Agency | [Source](https://gaftp.epa.gov/ap42/ch11/s03/final/c11s03_1995.pdf) | B1 | Clay preparation, forming, drying, firing | Modern workflow; qualitative stages only |
| E41 | Archaeological Evidence for Glassworking | Historic England | [Source](https://historicengland.org.uk/images-books/publications/glassworkingguidelines/heag259-archaeological-evidence-for-glassworking/) | B1 | Primary/secondary glasswork, cullet, furnaces, annealing | British archaeological chronology |
| E42 | AP-42: Glass Manufacturing | US Environmental Protection Agency | [Source](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf) | B1 | Batch, melting/refining, forming, annealing, cullet | Modern soda-lime emphasis |
| E43 | BAT Reference Document for the Manufacture of Glass | European Commission Joint Research Centre | [DOI](https://doi.org/10.2791/69502) | B1 | Energy, water, material, waste, recycling dependencies | Modern large installations |
| E44 | Archaeometallurgy: Guidelines for Best Practice | Historic England | [Source](https://historicengland.org.uk/images-books/publications/archaeometallurgy-guidelines-best-practice/heag003-archaeometallurgy-guidelines/) | B1 | Ore preparation, bloom refining, stock, casting, smithing, residues | Technology varies by ore, period, and site |
| E45 | Non-Ferrous Metals Industries BREF | European Commission Joint Research Centre | [Source](https://eippcb.jrc.ec.europa.eu/reference/non-ferrous-metals-industries-0) | B1 | Primary/secondary metals and environmental dependencies | Modern industrial scope |
| E46 | Hazardous Waste Recycling FAQ | US Environmental Protection Agency | [Source](https://www.epa.gov/hw/frequent-questions-related-hazardous-waste-recycling-definition-solid-waste-and-other-exemptions) | B1 | Scrap versus slag, dross, sludge, liquid waste | US regulatory analogy only |
| E47 | Toxic Metals Overview | US Occupational Safety and Health Administration | [Source](https://www.osha.gov/toxic-metals) | B1 | Toxic-metal exposure classes | Modern safety analogue; no operating guidance |
| E48 | Smitheries and Foundries Industry BREF | European Commission Joint Research Centre | [Source](https://eippcb.jrc.ec.europa.eu/reference/smitheries-and-foundries-industry) | B1 | Smithing/foundry distinction and scrap inputs | Modern large-scale context |
| E49 | Salt Statistics and Information | US Geological Survey | [Source](https://www.usgs.gov/centers/national-minerals-information-center/salt-statistics-and-information) | B1 | Rock, brine, and solar salt source distinctions | Modern commodity overview |
| E50 | Pigment | MFA Boston CAMEO | [Source](https://cameo.mfa.org/wiki/Pigment) | B2 | Insoluble colorant and binder distinction | Conservation glossary |
| E51 | Lake | MFA Boston CAMEO | [Source](https://cameo.mfa.org/wiki/Lake) | B2 | Dye fixed/precipitated on a substrate | Generic definition; formulations vary |
| E52 | Mordant | MFA Boston CAMEO | [Source](https://cameo.mfa.org/wiki/Mordant) | B2 | Dye-fixation and color-modification role | Polysemous term; requires context |
| E53 | Paint Types, Generic | MFA Boston CAMEO | [Source](https://cameo.mfa.org/wiki/Paint_types%2C_generic) | B2 | Colorant, binder/vehicle, ink/paint distinctions | Generic and modern-inclusive |
| E54 | Corrosive Media: Iron Gall Ink Corrosion | Library of Congress | [Source](https://www.loc.gov/preservation/scientists/projects/iron_gall_ink.html) | B1 | Composition-sensitive ink/substrate damage | Conservation evidence; no ink recipe |
| E55 | Brown and Black Organic Glazes, Pigments and Paints | Raymond White / National Gallery | [Source](https://www.nationalgallery.org.uk/research/publications/technical-bulletin/brown-and-black-organic-glazes-pigments-and-paints) | B2 | Organic colorant, binder, glaze distinctions | Sampled European artworks |
| E56 | Cameo Appearances | James David Draper / Metropolitan Museum of Art | [Source](https://www.metmuseum.org/met-publications/cameo-appearances) | B2 | Holding, drilling, abrasion, engraving, mounting | Hardstone cameo tradition |
| E57 | Hidden Secrets of Ancient Egyptian Technology | Anna Serotta and Federico Caro / Metropolitan Museum of Art | [Source](https://www.metmuseum.org/de/perspectives/ancient-egyptian-technology) | B2 | Saws, drills, particulate abrasives, polishing | Egyptian context; abrasive identity disputed |
| E58 | Lapidary technology of carnelian beads | Groman-Yaroslavski and Bar-Yosef Mayer | [DOI](https://doi.org/10.1016/j.jas.2015.03.030) | A2 | Multi-stage abrasion, drilling, tumbling | One archaeological context |
| E59 | Polito et Claro: polishing, 1200-1500 | Marjolijn Bol | [DOI](https://doi.org/10.1007/978-3-319-96379-2_9) | A2 | Medieval polishing and faceting development | European textual/craft-history scope |
| E60 | Introduction to Gem Treatments | Robert Weldon / Gemological Institute of America | [Source](https://www.gia.edu/gem-treatment?lang=en) | B2 | Routine cutting/polishing versus treatment, durability | Modern gem-trade guidance |
| E61 | Emerald Quality Factors | Gemological Institute of America | [Source](https://www.gia.edu/UK-EN/emerald-quality-factor?lang=en) | B2 | Brittleness and fracture risks in cutting/setting | Emerald-specific, modern trade context |
