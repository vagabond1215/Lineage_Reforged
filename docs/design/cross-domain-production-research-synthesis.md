# Cross-Domain Production Research Synthesis

Date: 2026-07-17
Status: accepted documentation-only integration authority; revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is next
Source run: unversioned `Cross-Domain Natural Resources, Materials, Production, And Magitech Research Integration`

## 1. Decision Summary

Seven accepted research gates and the accepted production-chain/workplace runtime-authority audit are integrated here against the live repository at commit `24d83b0e47a85fe29e6ad316c05964b5b57914e3`.

The durable decisions are:

1. ordinary technology, labor, material, energy, environment, housing, maintenance, inspection, residue handling, and fallback remain the production baseline;
2. source identity, harvested form, material state, bounded recipe, macro production chain, workplace capability, market value, runtime work order, and inventory mutation remain separate authorities;
3. recipe records own complete explicit game-scale batch transformations; `relatedProductionChainId` is descriptive and non-inheriting;
4. current production chains are broad macro/economic abstractions rather than recipe bills of material, and their disputed resolver behavior is quarantined from revised `0.6.5`;
5. no chain correction is required before revised `0.6.5` because the selected recipes depend only on their explicit fields and canonical reference closure;
6. revised `0.6.5` adds 16 planned standard recipes, taking the live catalog from 12 to 28 recipes and from 8 to 10 represented families;
7. the unsupported pastry-dough and savory-meat-pie rows are removed rather than guessed;
8. all selected quantities are authored game-scale `bounded_design_inference`, not universal historical yields, runtime balance, or chain-derived ratios;
9. magic may provide bounded specialist or institutional alternatives only after a concrete physical effect, vessel, housing, recharge, failure, access, and runtime owner exist; and
10. content, schema, validator, test, runtime, UI, save, economy, combat, medicine, infrastructure, and gameplay behavior are unchanged by this integration.

The accepted production audit disposition remains `NO_NARROW_CORRECTION_REQUIRED_BEFORE_REVISED_0_6_5`, conditional on preserving the quarantine in Section 10.

## 2. Live Repository Inventory And Owners

### Items, values, recipes, and production capability

| Authority | Live state | Owner posture |
| --- | ---: | --- |
| Items | 1,372 | Canonical inventory identities: 24 accessory, 18 armor, 14 clothing, 1,114 commodity, 26 consumable, 131 tool, 10 vehicle, and 35 weapon records. All have static `baseValue`; 1,368 are marketable and four are nonmarketable. |
| Market item values | 1,617 unique item keys | Static value snapshots: all 1,372 item keys plus 245 market-only biological source identities. Market-only identities are not item aliases. |
| Planned recipes | 12 standard records / 8 families | Explicit static transformations only; no engine or app executes them. |
| Workplaces | 58 | Static capability plus macro resolver inputs; not physical facility state or installed capacity. |
| Tool items | 131 | Canonical tool identity; no possession, condition, tier, wear, or substitution runtime. |
| Skills | 121 | Static skill identity/progression vocabulary; no recipe availability or gain behavior. |
| Production chains | 121 | Macro process/economic context. They do not supply recipe quantities by inheritance. |
| Extraction methods | 22 | Thin descriptive vocabulary; no gathering/extraction command owner. |
| Resources / commodities | 2 / 2, all planned | Paused iron-ore and grain identities; no nodes, stock, cargo, harvesting, trading, runtime, UI, or save behavior. |

The recipe contract is the strict records wrapper at `packages/schemas/crafting/recipe.schema.json`. `tools/content-lint/crafting-recipes.mjs` performs semantic and reference validation and is registered once in normal content lint. `tests/unit/crafting-recipes-validation.test.mjs` covers valid standard records, non-mutation, non-inheriting chain references, strict wrapper/record failures, id/slug uniqueness, positive quantities, primary-output rules, item/tool/workplace/skill/chain closure, no-op rejection, the live seed, and lint registration.

### Natural sources and ecology

| Authority | Live state | Owner posture |
| --- | ---: | --- |
| Flora | 117; 199 unique output keys / 1,394 occurrences | Source identity, habitat, lifecycle descriptions, harvest-part vocabulary, and item-resolved output topology. Scalar placeholders provide no yield/rate authority. |
| Fauna | 132; 459 unique output keys / 484 occurrences | Source identity, passive/slaughter topology, and item-resolved outputs. No anatomy, harvest command, or population runtime. |
| Monsters | 24; 49 drop rows / 37 unique keys; 20 loot rows / 6 unique keys | Source-local static probability envelopes only. All 69 rows resolve; no loot generator or inventory creation exists. |
| Habitats / biomes | 93 / 36 | Habitat and biome identity/compatibility. |
| Regional ecology | 9 | Macroregional climate, native lists, strengths, gaps, and supply pressure; not population or trade execution. |
| Minerals | 56 | Geological identities; all item and market-value references resolve. |
| Spatial source derivation | 305 flora/fauna/mineral sources over 47 hexes and 88 settlements | Read-only settlement access/supply context. It does not consume resources, commodities, or extraction methods and does not place or deplete nodes. |

Biological source, part, raw output, prepared material, finished product, market identity, monster loot possibility, and generated item instance are not interchangeable. The research supports part- and source-specific relationships: removal pressure depends on the source, regenerative capacity, harvested part, method, and local context, while identification, clean collection, sorting, protection, and drying remain distinct dependencies ([FAO non-wood forest products](https://www.fao.org/4/y4496e/Y4496E19.htm); [WHO medicinal-plant guidance](https://www.who.int/publications/i/item/9241546271)).

### Knowledge, magic, and infrastructure

| Authority | Live state | Owner posture |
| --- | ---: | --- |
| Knowledge registry / domains / snippets | 7 registry rows (6 active, Arcane Lore planned) / 4 legacy domain records / 28 snippets | Lore and structural subject coverage. No production, identification, or recognition execution. |
| Crystal catalog | 27 = 9 affinities x shard/crystal/cluster | Finite capacity, efficiency, stability, attunement, mismatch, recharge, reuse, and permanent-enchant consumption metadata. Each slug matches a vessel item key, but there is no explicit schema `itemKey`. |
| Spells | 55: 23 ready, 5 partial, 27 deferred | Compatibility metadata and 11 narrow combat-hook allowlist entries; no noncombat production/infrastructure execution. |
| Item magic profiles | 7 conduits / 3 catalysts | Readiness and presentation metadata; no general modifier, charge, reservation, consumption, or recharge policy. |
| Magic skills | 14 of 121 | Identity/progression vocabulary only. |
| Magic infrastructure | 4 records | Static service/infrastructure descriptions and settlement projection inputs; no physical effects or transactions. |
| Mundane infrastructure | 7 records | Bridge, canal, aqueduct, walls, gates, irrigation, and roads; no magical construction record. |
| Guilds / services | 18 / 5 planned provider-independent services | Institutional/provider vocabulary, not universal local placement or execution. |

The settlement institution projection creates 88 profiles, 264 reserve rows, and 352 service rows. It derives availability and charge summaries but does not spend or recharge charge, mutate inventory, execute services, persist installations, or prove authored local access. The general known-spell resolver remains an inert planning envelope; combat separately owns its narrow allowlist.

## 3. Technology-Capability Baseline

Capability is a dependency envelope, not a century label.

| Access band | Typical capability | Required limits |
| --- | --- | --- |
| Household | Hand preparation, sorting, cutting, simple mixing, drying, cooking, repair, and short-term storage using locally available tools and containers. | Small batch, variable quality, household labor, weather and fuel exposure, little redundancy, no automatic specialist precision. |
| Village / town | Shared mill, bakehouse, smokehouse, tannery, forge, kiln, waterwork, store, or managed source site. | Local maintenance, skilled operators, transport catchment, fuel/water access, seasonal bottlenecks, communal or owner access rules. |
| Urban specialist | Dedicated craft shops, measured batches, division of labor, specialized tools, controlled work areas, inspection, repair, and broader material supply. | Skilled labor, market/institution access, waste handling, fire/water/ventilation constraints, replacement parts, no mass-industrial inference. |
| Institutional | Guild, civic, military, religious, estate, or large commercial facilities coordinating storage, records, security, supply, maintenance, and several specialists. | Capital, governance, custody, scheduled access, failure planning, and external supply chains. Availability does not imply universal public use. |
| Elite / strategic | Large, secure, expensive, or politically controlled production and logistics serving warfare, major works, long-distance trade, or prestige goods. | Scarce inputs, expert staff, security, repair depth, and high consequences of interruption. |
| Rare / exceptional | Unique masterwork, relic, experimental, or magical installation. | Explicit canon, named owner, finite throughput, specialist maintenance, observable failure, and an ordinary fallback; never the default technology baseline. |

Scale changes tooling, layout, material movement, workholding, inspection, maintenance, waste, and organizational demands. A larger output is not merely a household recipe multiplied by a number.

## 4. Natural-Source And Byproduct Taxonomy

Use these distinctions before adding identities or relationships:

1. **Biological source:** species, population, organism, stand, colony, herd, catch, or carcass context.
2. **Geological source:** deposit, seam, vein, brine, sediment, clay body, quarry face, or recoverable surface material.
3. **Managed source:** field, pasture, orchard, coppice, fishery, saltern, mine, quarry, or other maintained access system.
4. **Harvested/extracted form:** log, fleece, hide, ore, rough stone, raw clay, catch, plant bundle, sap, resin, or other first portable form.
5. **Primary product:** the intended output of the bounded process.
6. **Coproduct:** a deliberately recovered secondary output with a repeated consumer.
7. **Recoverable residue:** scrap, offcut, bran, pomace, shell, bone, slag, ash, scale, sawdust, or similar stream with trade, reuse, hazard, ritual, or narrative value.
8. **Process waste:** contaminated, degraded, or mixed residue that should remain descriptive unless a concrete consumer exists.
9. **Environmental consequence:** erosion, contaminated ground/water, smoke, silt, habitat damage, depletion, fire risk, or other condition; not automatically an inventory item.

Raw resin is distinct from pitch, rosin, or tar; sap from syrup; fruit body from mycelium; cut stem from retted fiber; run-of-mine material from concentrate; rough block from dressed stone; carcass from cuts; fresh catch from prepared or preserved fish. Archaeological evidence likewise separates mine access, dressing, water management, haulage, discard, and persistent waste rather than treating ore extraction as a one-step item grant ([Historic England, Ashnott Lead Mine](https://historicengland.org.uk/research/results/reports/6241/AshnottLeadMineRibbleValleyLancashire_AnArchaeologicalSurveyoftheLandscapeEvidence)).

Only itemize a residue when at least one repeated craft, trade, hazard, ritual, institutional, quest, or narrative consumer justifies it. This filter prevents anatomically or historically plausible catalog noise from becoming unsupported canon.

## 5. Ingredient And Material-State Taxonomy

State is more useful than a universal quality ladder.

| State lane | Examples | Boundary |
| --- | --- | --- |
| Source form | standing tree, live animal, deposit, crop, catch | Not inventory unless a current owner explicitly says so. |
| Raw portable form | log, hide, fleece, ore, grain bundle, raw fish | Portable identity after extraction/harvest; no implied cleaning or safety. |
| Sorted / cleaned / dressed | selected ore, washed fiber, cleaned grain, prepared carcass part | Removal/separation step; may create rejects or residues. |
| Stabilized | dried, salted, smoked, cured, cooled, sealed | Reduced loss pressure, not permanent safety or timeless preservation. |
| Intermediate | thread, yarn, dough, stave, blade blank, metal ring | Intended for further transformation; may be nonmarketable. |
| Refined material | ingot, cured leather, fine cloth, pitch | Processed feedstock with an explicit material identity. |
| Component | plate, panel, handle, shaft, ring, stave | Assembly input; not automatically interchangeable with raw/refined material. |
| Finished good | tool, weapon, armor, vessel, meal, building component | Product identity; execution, ownership, quality, and durability remain separate. |
| Process aid | salt, flux, temper, binder, oil, water, fuel, abrasive | Include as a recipe input only when the bounded static transformation intentionally owns consumption; otherwise keep it with process/runtime context. |
| Catalyst / conduit | schema-defined recipe roles or item magic profiles | Does not imply generic magical execution or non-consumption. |

Modern standards are used only to confirm that food/material identities and hazards can differ by source and state; they do not set historical recipes, in-world law, or game quantities. For example, Codex distinguishes smoked fish from smoke-flavored and smoke-dried products ([Codex smoked-fish standard](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+311-2013%2FCXS_311e.pdf)), while FAO milling guidance separates cleaning, hulling, meal/flour, dust, storage, power, and maintenance ([FAO, Small Mills in Africa](https://www.fao.org/fileadmin/user_upload/ags/publications/J8482E.pdf)).

## 6. Transformation And Process Taxonomy

The reusable process vocabulary is:

- acquire: gather, harvest, hunt, fish, fell, quarry, mine, pump, collect;
- separate: sort, grade, wash, dress, thresh, winnow, sieve, strain, butcher, split;
- reduce or shape: cut, saw, crush, grind, pound, plane, scrape, draw, spin, weave, forge;
- combine: mix, knead, laminate, alloy, bind, stitch, join, assemble;
- transform with heat: bake, roast, boil, render, smelt, fire, char, smoke;
- transform biologically or chemically: ferment, cure, tan, pickle, leaven, react;
- remove or transfer moisture/heat: drain, dry, cool, freeze, thaw, condense;
- finish: polish, sharpen, coat, seal, decorate, calibrate, inspect;
- store and move: contain, rack, stack, crate, barrel, warehouse, haul, ship;
- recover or dispose: salvage, recycle, rework, compost, neutralize, discard, contain waste.

A process relationship is not a runtime formula. Each future executable process still needs an owner for inputs, outputs, eligibility, time, labor, energy, tools, facility state, quality, loss, events, interruption, inventory mutation, and persistence.

## 7. Tools, Workplaces, Energy, Environment, Loss, And Maintenance

Every production proposal should answer these questions before it becomes executable:

| Concern | Required question |
| --- | --- |
| Tools | Which exact canonical tools measure, mark, cut, hold, shape, move, inspect, clean, and repair? |
| Workholding | What bench, vise, frame, jig, mold, pattern, rack, loom, anvil, hearth, vessel, or fixture constrains the work? |
| Workplace | Which current workplace capability is descriptive, and what physical facility state is still missing? |
| Energy | Is the ordinary source human, animal, water, wind, fuel heat, stored potential, or a bounded magical service? |
| Water / airflow / heat | What source, path, containment, drainage, ventilation, discharge, and environmental range are required? |
| Material movement | How are heavy, hot, wet, fragile, contaminated, or bulky inputs moved and stored? |
| Loss and residues | Which losses are expected, which coproducts are recovered, and where do waste and contamination go? |
| Inspection | What can an operator observe, measure, test, or reject without implying modern instrumentation? |
| Maintenance | What must be cleaned, sharpened, calibrated, patched, relined, cleared, lubricated, replaced, or rebuilt? |
| Failure | What visible degraded result, hazard, interruption, or fallback follows loss of a dependency? |

Wood drying depends on species, dimensions, weather, stacking, airflow, and protection, so exact times cannot be transferred as universal values ([USDA Wood Handbook, chapter 13](https://www.fpl.fs.usda.gov/documnts/fplgtr/fplgtr282/chapter_13_fpl_gtr282.pdf)). Salterns similarly couple source, concentration, evaporation, fuel, vessels, labor, transport, and waste rather than proving a universal salt recipe ([Historic England, Pre-industrial Salterns](https://historicengland.org.uk/images-books/publications/iha-preindustrial-salterns/)).

## 8. Regional And Cultural Variation

Regional variation must change at least one meaningful dependency or relationship. Valid variation may change:

- source species, deposit form, climate, season, water, fuel, or transport access;
- tool or facility form because material, terrain, scale, or maintenance differs;
- process order, preservation route, coproduct destination, or acceptable finish;
- institution, customary access, specialist concentration, security, or trade dependence;
- storage form, packaging, measurement tradition, repair practice, or waste handling;
- ordinary-versus-magical access and fallback.

Rename-only duplicates are rejected. External cultures and technologies may establish possibility or a comparison class, but they do not authorize an in-world people, monopoly, law, industry, placement, product name, or regional practice. Fixed fisheries illustrate the principle: they can be maintained hydrological and cultural systems with collective knowledge and access, not generic resource nodes ([UNESCO, Budj Bim Cultural Landscape](https://whc.unesco.org/en/list/1577)).

## 9. Mundane Baseline And Bounded Magic Framework

Magic is useful only when all of these remain explicit:

1. **Effect:** the exact movement, transfer, storage, release, stabilization, measurement, warning, or containment behavior. Creation remains unsupported.
2. **Affinity:** one canonical owner-translated affinity. Stone crystal ids and earth spell/combat vocabulary describe one affinity across owners.
3. **Vessel:** exact tier, finite capacity, efficiency, stability, attunement, mismatch, reuse, and permanent-enchant consumption posture.
4. **Recharge:** the catalog method plus a future executable action, location, time, security, and persistence owner.
5. **Housing:** mundane container, mount, duct, channel, lens, insulation, refractory, drain, relief, guard, or structural support.
6. **Transmission:** the physical path from source to receiver, including isolation, discharge, and safe stop.
7. **Skill and access:** operator, provider, service, institution, custody, price, and local placement.
8. **Maintenance and failure:** cleaning, inspection, recalibration, repair, replacement, depletion, mismatch, damage, false confidence, and abrupt loss.
9. **Scale and scarcity:** household, local specialist, institutional, strategic, or rare; never inferred from capacity metadata as physical units.
10. **Fallback:** the ordinary process that remains available, slower, less convenient, or more labor-intensive.

The four current services, existing guilds/orders, and current buildings/workplaces must be collision-audited before adding a provider. Derived availability does not prove service effect, placement, affordability, staffing, or access. The Scribes Guild excludes spell inscription; magical books/tomes, scrolls, and enchanter-authored arcane documents remain deferred to their recorded owners.

The strongest future relationships are civic lighting/navigation marks, warded secure storage, assistance to existing water/channel systems, airflow through ordinary ducts, and finite conditioned storage. They are relationship candidates, not executed effects. Free matter, free fuel, perpetual recharge, unlimited cooling/purification/motive power/transport/communication, generic tag-driven spell execution, and magic-as-modern-grid inference remain rejected.

## 10. Ice-Conditioned Container Case Study

An ice-conditioned container is a bounded cold-storage aid, not refrigeration by label.

### Ordinary baseline

- suitable goods are prepared and packed in a clean, intact container;
- insulation, shade, cellar conditions, seasonal ice or cool water, limited opening, drainage, and stock rotation reduce heat gain and moisture damage;
- cold delays some losses but does not restore degraded quality or prove safety ([FAO, Freezing and Refrigerated Storage in Fisheries](https://www.fao.org/4/v3630e/v3630e00.htm)); and
- operators still inspect the goods, container, seals, meltwater/condensate path, contamination, pests, and time out of condition.

### Magical specialty

- use one independently accounted ice vessel for a portable or fixed bounded enclosure;
- use a shard only for a small short-duty container, a crystal for a specialist chest/room-scale fixture, and a cluster only for a rare fixed institutional installation;
- these are relative design bands, not physical temperature, energy, duration, mass, or volume units;
- housing still requires insulation, mounts, protected contact surfaces, condensate/melt drainage, access, cleaning, and a nonmagical fallback;
- `cold_soak` remains metadata until a recharge action owner exists;
- failure modes include depletion, icing, blocked drainage, freeze damage, condensation, leakage, contamination, theft, mismatch, broken housing, and false safety; and
- item-instance condition, temperature, spoilage, service transaction, charge spending/recharge, installation, maintenance, persistence, and UI remain absent.

Utility enchantment names `small_scale_preservation` while its allowed elements exclude ice. Affinity binding allows ice. This is a future collision/authority question, not permission to change either record or infer an ice effect.

## 11. Candidate And Authority Matrix

| Candidate | Classification | Authority | Dependency | Priority | Confidence | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| Preserve source/part/output/state/product/market/runtime separation | `factual_correction` | This synthesis and current owners | None | critical | high | accepted |
| Explicit complete recipe-owned transformations | `authored_input_required` | `crafting.recipes` | Current strict schema/validator and canonical refs | critical | high | accepted for revised `0.6.5` |
| Non-inheriting optional chain links | `factual_correction` | Recipe/production authority | Existing validator | critical | high | accepted |
| Sixteen-row revised static batch | `authored_input_required` | `crafting.recipes` | Section 13 closure | high | high | accepted target |
| Pastry dough from flour alone | `conflicts_with_canon` | none | Missing bounded ingredient/process authority | negative | high | rejected from target |
| Savory meat pie from pastry dough and smoked meat | `authored_input_blocked` | future recipe authoring | Exact bounded compound-food authority | medium | high blocker | deferred, not partially authored |
| Chain/workplace-derived recipe quantities, inputs, outputs, tools, or skills | `conflicts_with_canon` | none | Separate resolver authority decision | negative | high | quarantined |
| Flora part-to-output and source-to-item relationships | `missing_static_relationship` | flora/fauna/resource owners | Schema and authored mapping decision | high | high | later static plan |
| Extraction-method hardening and source/workplace/tool/skill crosswalk | `schema_or_validator_precondition` | extraction authority | Dedicated schema/validator plan | high | high | deferred |
| Resource/mineral/regional-ecology relationships | `schema_or_validator_precondition` | resources/ecology | Paused resource expansion gate | medium | high | deferred |
| Biology scalar reconciliation | `factual_correction` + `schema_or_validator_precondition` | flora/fauna | Dedicated high-risk content/schema audit | critical | high | deferred |
| Process residues with repeated consumers | `optional_depth` | owning item/chain/content layer | Collision and consumer evidence | medium | high rule | conditional |
| Civic light marks and warded storage relations | `missing_static_relationship` + `runtime_owner_required` | magic/service/world owners | Effect, provider, housing, access, state | high | medium/high | verify later |
| Ice-conditioned container | `authored_input_required` + `runtime_owner_required` | magic/storage/item-instance owners | Effect, charge, condition, spoilage, persistence | high | medium | case study only |
| Provider/facility reuse | `missing_static_relationship` | existing service/guild/building/workplace owners | Concrete consumer and placement evidence | high | high | collision audit first |
| Schema/type reconciliation for magic and production metadata | `schema_or_validator_precondition` | focused owner-specific runs | Consumer inventory and decisions | high | high | deferred |
| Gathering, crafting, production, loot, ecology, or magic execution | `runtime_owner_required` | future engine commands/events/state | Dedicated approved runtime design | critical later | high | reserved |
| Free matter/energy, unlimited capacity, automatic purification, universal magic | `conflicts_with_canon` | none | none | negative | high | rejected |

## 12. Production-Chain And Workplace Quarantine

Revised `0.6.5` must not derive recipe admission or fields from:

- `resolveCraftAtSettlement` or any candidate-order result;
- chain input/output fallback, target fallback, default variants, stage order, last-step output, carry assumptions, or byproduct/value propagation;
- workplace I/O quantities, alternative-group scoring, job/tier/progression/upgrades, tool tags, power modes, fuel flags, rates, or costs;
- runtime item values, market prices, transport pricing, or labor-pressure skill association; or
- source/value/tag/name resemblance.

The current chains are not declared factually correct for every physical relationship. They are sufficiently isolated from revised `0.6.5` because each recipe will provide complete positive-integer inputs and outputs, exactly one primary output, canonical fixed workplace/tool/skill references, and an optional existence-checked chain link. If implementation introduces chain inheritance or uses a quarantined resolver field, this decision reverses and the run must stop for the smallest owner-specific correction.

Later corrections remain separate: production loader/type drift, workplace loader/type drift, topology/semantic validation, resolver branch tests, economy documentation, Stonevein extractive placement, and transport baseline diagnosis. None is bundled into the static recipe package.

## 13. Exact Revised 0.6.5 Target

The largest coherent reviewable batch supported without new identities or a chain correction is 16 recipes. It retains the dependency-closed relationships from the failed target, removes both unsupported compound-food rows, and treats all integers as authored game-scale batch units.

Every row is `status: planned`, `recipeSubtype: standard`, has no prerequisite refs, and uses the notes/authority posture required by the installed prompt.

| Recipe id | Family | Exact inputs (quantity, role) | Exact outputs (quantity, role) | Workplace | Tools | Skill / rank | Optional chain | Evidence | Quantity confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `recipe.flax_bundle_to_linen_thread` | tailoring | `flax_bundle` 1 material | `linen_thread` 2 primary | `workplace.loomhouse` | `spindle` | `skill.crafting.weaving` / 1 | `chain.textile.linen` | Canonical state relationship; research separates harvested stems/bundles, fiber preparation, and spinning | `bounded_design_inference` |
| `recipe.wool_fleece_to_yarn` | tailoring | `wool_fleece` 1 material | `yarn` 2 primary | `workplace.loomhouse` | `spindle` | `skill.crafting.weaving` / 1 | `chain.textile.components` | Canonical fleece/yarn relationship and spinning capability | `bounded_design_inference` |
| `recipe.yarn_to_wool_cloth` | tailoring | `yarn` 2 material | `wool_cloth` 1 primary | `workplace.loomhouse` | `weaving_shuttle` | `skill.crafting.weaving` / 1 | `chain.textile.wool` | Canonical yarn/cloth relationship and weaving capability | `bounded_design_inference` |
| `recipe.linen_thread_to_fine_cloth` | tailoring | `linen_thread` 2 material | `fine_cloth` 1 primary | `workplace.loomhouse` | `weaving_shuttle` | `skill.crafting.weaving` / 1 | `chain.textile.cloth_grades` | Canonical thread/cloth relationship; grade remains authored output identity | `bounded_design_inference` |
| `recipe.flour_to_bread_dough` | baking | `flour` 1 ingredient | `bread_dough` 1 primary | `workplace.bakery` | `mixing_spoon` | `skill.crafting.cooking` / 1 | `chain.food.bread` | Exact canonical intermediate relationship; no pastry or sweetener inference | `bounded_design_inference` |
| `recipe.fish_raw_and_salt_crystal_to_smoked_fish` | preserving | `fish_raw` 1 ingredient; `salt_crystal` 1 ingredient | `smoked_fish` 1 primary | `workplace.smokehouse` | `smoking_rack` | `skill.crafting.cooking` / 1 | `chain.food.preserved_fish` | Canonical raw/preserved state relationship; research supports salting/smoking distinction without a universal yield | `bounded_design_inference` |
| `recipe.plank_to_barrel_stave` | cooperage | `plank` 1 material | `barrel_stave` 2 primary | `workplace.coopers_shop` | `cooper_adze` | `skill.crafting.carpentry` / 1 | `chain.cooperage.components` | Canonical shaped-component relationship and cooper capability | `bounded_design_inference` |
| `recipe.barrel_stave_metal_ring_and_resin_pitch_to_cask` | cooperage | `barrel_stave` 4 material; `metal_ring` 2 material; `resin_pitch` 1 material | `cask` 1 primary | `workplace.coopers_shop` | `cooper_adze`, `hoop_anvil` | `skill.crafting.carpentry` / 1 | `chain.cooperage.cask` | Canonical component assembly and sealing relationship | `bounded_design_inference` |
| `recipe.copper_ore_to_copper_ingot` | forging | `copper_ore` 2 material | `copper_ingot` 1 primary | `workplace.smelter_hall` | `crucible_tongs` | `skill.crafting.smelting` / 1 | `chain.metal.copper_ingot` | Canonical ore/refined-metal relationship; fuel/slag remain outside this bounded record | `bounded_design_inference` |
| `recipe.copper_ore_and_tin_ore_to_bronze_ingot` | forging | `copper_ore` 2 material; `tin_ore` 1 material | `bronze_ingot` 2 primary | `workplace.smelter_hall` | `crucible_tongs` | `skill.crafting.smelting` / 1 | `chain.metal.bronze_ingot` | Canonical alloy inputs/output; ratio is game-scale authorship, not historical universal composition | `bounded_design_inference` |
| `recipe.iron_ingot_to_metal_plate` | metalsmithing | `iron_ingot` 1 material | `metal_plate` 1 primary | `workplace.armorers_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` / 1 | `chain.metal.components` | Canonical refined-metal/component shaping relationship | `bounded_design_inference` |
| `recipe.iron_ingot_to_blade_blank` | metalsmithing | `iron_ingot` 1 material | `blade_blank` 1 primary | `workplace.weaponsmith_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` / 1 | `chain.metal.components` | Canonical refined-metal/component shaping relationship | `bounded_design_inference` |
| `recipe.blade_blank_tool_handle_and_leather_strap_to_arming_sword` | assembly | `blade_blank` 1 material; `tool_handle` 1 material; `leather_strap` 1 material | `arming_sword` 1 primary | `workplace.weaponsmith_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` / 1 | `chain.warfare.weapons` | Canonical component-to-finished-good assembly relationship | `bounded_design_inference` |
| `recipe.cured_leather_to_leather_strap` | leatherworking | `cured_leather` 1 material | `leather_strap` 2 primary | `workplace.tannery` | `tanning_scraper` | `skill.crafting.leatherworking` / 1 | `chain.leather.components` | Canonical refined-material/component cutting relationship | `bounded_design_inference` |
| `recipe.cured_leather_to_hardened_leather_panel` | leatherworking | `cured_leather` 1 material | `hardened_leather_panel` 1 primary | `workplace.tannery` | `tanning_scraper` | `skill.crafting.leatherworking` / 1 | `chain.leather.components` | Canonical refined-material/component relationship; process aids remain macro context | `bounded_design_inference` |
| `recipe.metal_ring_and_leather_strap_to_mail_coif` | assembly | `metal_ring` 2 material; `leather_strap` 1 material | `mail_coif` 1 primary | `workplace.armorers_forge` | `blacksmith_hammer` | `skill.crafting.armoring` / 1 | `chain.warfare.armor` | Canonical components and finished armor identity; units are abstract batches | `bounded_design_inference` |

No row is `source_backed` for its integer quantity because the external sources do not authorize universal yields. No row is a `balance_placeholder`; the integers are deliberate bounded game-scale authorship for static structure. No selected row is `authored_input_blocked`. The removed meat-pie row remains blocked; the removed flour-only pastry row is rejected as incomplete.

The implementation may change only `packages/content/base/crafting/recipes.json`, `tests/unit/crafting-recipes-validation.test.mjs`, and necessary coordination documents. It must not add items, values, tools, workplaces, skills, chains, resources, commodities, schemas, validators, lint code, runtime, UI, saves, dependencies, assets, or gameplay.

## 14. Temporary Artifact Disposition

Six temporary research artifacts remain for `0.6.7`. The Gate 6 and production-audit artifacts were removed after accepted `0.6.5` satisfied their sole-consumer conditions. Each disposition remains explicit below.

| Artifact | Gate / result | Sole named consumer | Removal condition |
| --- | --- | --- | --- |
| `docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md` | Gate 1 accepted | `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` | Remove when `0.6.7` confirms all still-needed source/extraction findings are represented in durable authority/backlog and no detailed citation is still required. |
| `docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md` | Gate 2 accepted | `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` | Remove when `0.6.7` confirms all still-needed ecology/output findings are represented durably and no detailed citation is still required. |
| `docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md` | Gate 3 accepted | `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` | Remove when `0.6.7` confirms all still-needed agriculture/husbandry findings are represented durably and no detailed citation is still required. |
| `docs/dev/tmp-materials-refinement-processing-research-2026-07-14.md` | Gate 4 accepted | `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` | Remove when `0.6.7` confirms all still-needed material/process findings are represented durably and no detailed citation is still required. |
| `docs/dev/tmp-food-processing-preservation-research-2026-07-14.md` | Gate 5 accepted | `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` | Remove when `0.6.7` confirms all still-needed food/storage findings are represented durably and no detailed citation is still required. |
| `docs/dev/tmp-crafting-tools-workplaces-production-research-2026-07-14.md` | Gate 6 accepted / audit triggered | Revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` | Removed 2026-07-19 after accepted `0.6.5` preserved resolver quarantine and durable owner-specific routes. |
| `docs/dev/tmp-magitech-production-infrastructure-substitution-research-2026-07-14.md` | Gate 7 accepted | `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` | Remove when `0.6.7` confirms all still-needed magic/infrastructure findings are represented durably and no detailed citation is still required. |
| `docs/dev/tmp-production-chain-workplace-runtime-authority-audit-2026-07-15.md` | `NO_NARROW_CORRECTION_REQUIRED_BEFORE_REVISED_0_6_5` accepted | Revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` | Removed 2026-07-19 after accepted `0.6.5` consumed no quarantined field and durable correction routes remained preserved. |

No remaining temporary artifact is orphaned; Gate 1-5 and Gate 7 remain solely assigned to `0.6.7`.

## 15. Later 0.6.6 And Future Implications

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains reserved behind accepted revised `0.6.5`. It may use this synthesis to improve static source relationships and niche coverage, but must preserve:

- source-local monster drop/loot ownership and exact item/value closure;
- flora/fauna/monster identity separation and no anatomy-by-name inference;
- current biome, habitat, regional ecology, combat role, tactics, action-package, and threat owners;
- no generic loot tables, loot rolls, generated items, spawn execution, population/migration, harvesting, body-part execution, new combat mechanics, magic execution, runtime, UI, saves, or gameplay; and
- the queued docs-first Geographic Knowledge Taxonomy And Location Recognition Contract Plan immediately after `0.6.7`.

Later owner-specific work may address extraction relationships, biology scalar validity, recipe balance, fuel/process-aid policy, production resolver contracts, workplace types, item-instance condition and spoilage, storage lots, crafting work orders, dynamic economy, ecology/population, loot execution, services, magitech effects, charge/recharge, installations, maintenance, and persistence. Research and static metadata do not prove those systems exist.
