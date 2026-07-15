# GPT-DR.crafting.tools-workplaces-production Research

- Date: 2026-07-14
- Gate: `GPT-DR.crafting.tools-workplaces-production`
- Repository baseline: `581c80d6fadc61451a583ff65479b22aba9aef87` on clean, remote-aligned `master`
- Status: temporary cited research artifact; non-canonical until cross-domain integration dispositions it
- Scope: research and documentation only; no content, schema, validator, test, runtime, economy, market, crafting, inventory, UI, save, migration, dependency, asset, or gameplay implementation

## 1. Gate Result

`AUDIT_TRIGGERED`

Gate 6 passes as a research gate and mechanically triggers `CODEX-AUDIT.production-chain-workplace-runtime-authority`. It does not authorize a content record, correction, schema change, recipe, quantity, tool, workplace, job, skill, production action, economy change, or mutable state.

The decisive repository fact is that production chains and workplaces are neither inert lore nor executable recipes. All 121 chains are directly resolvable by the civilization economy; 120 participate in a non-shadowed value/market path. The resolver derives inputs, last-step outputs, quantity and quality factors, time, labor, material, processing, waste, and price explanations. It creates no inventory and selects no physical worker, job, tier, tool instance, fuel item, queue, or batch. Those boundaries are current live behavior, not a proposed design ([production chains](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/production_chains.json), [workplaces](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/workplaces.json), [runtime economy](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/runtime-economy.ts)).

The complete audit found 121 chains, 322 declared stages, and 311 processing steps: 227 workplace steps and 84 extraction steps. Only 19 steps have explicit inputs; 292 are empty. Of 311 outputs, 132 are explicit and 179 are empty; every empty output is filled at runtime. Seventeen stage declarations across six chains have no processing step. Twenty-eight chains contain 162 variants. Eleven variant chains return a default variant instead of a requested generic primary. Seventeen non-variant chains omit 62 declared primary/byproduct occurrences from the final result because the resolver returns only the last step. Variant inputs replace nonempty authored inputs in six default steps. These effects reach craft estimates, value lookup, settlement market prices, transport pricing, consistency reports, and integration candidate selection.

Workplace data is similarly mixed-authority. Fifty-eight records contain 208 jobs and 298 required-tool-tag occurrences. Every job's numeric workforce fields is an empty-object placeholder. The resolver unions tool requirements across all jobs, takes missing-tool behavior from the first primary job, computes a `blocked` result that it never enforces, and applies the tool multiplier only to difficulty, time, and processing cost. It does not select a job, role, tier, progression state, upgrade, capacity, service, facility, site, layout, or authored per-cycle quantity. Therefore all 121 chains inherit tool/job/tier ambiguity through their workplace steps.

The 12 planned recipes remain separate, complete, non-inheriting static transformations. Comparison with their related chains exposes multiple input mismatches; for example, live flour resolution substitutes the default variant input for the explicit grain input, while several metal, leather, textile, and woodworking links do not share the recipe's exact input relation. Existing tests prove broad value/skill behavior and recipe validation, but do not isolate the variant, fallback, omitted-output, stage-closure, job/tool/tier, fuel, or authored-quantity branches ([recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/crafting/recipes.json), [recipe validator](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/crafting-recipes.mjs), [runtime tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-runtime-economy.test.mjs)).

All six approved trigger conditions remain unresolved and all five skip criteria fail. Integration cannot safely decide revised `0.6.5` authority while simultaneously discovering which chain/workplace fields are authored, fallback-only, descriptive, placeholder, runtime-derived, or accidentally coupled. The required next route is `CODEX-AUDIT.production-chain-workplace-runtime-authority`; its expected artifact is `docs/dev/tmp-production-chain-workplace-runtime-authority-audit-2026-07-15.md`. Gate 7 remains blocked until that audit is accepted.

The external corpus contains 41 distinct works: 1 A1, 5 A2, 27 B1, and 8 B2. It supports qualitative capability, infrastructure, maintenance, residue, safety, and technology-compatibility findings. It never supplies repository canon or operational process instructions. Section 30 additionally hands Gate 7 a bounded physical-demand inventory without establishing any magical capability.

## 2. Method, Authority, Source Quality, And Safety Boundary

### Route and repository verification

The run began from clean, remote-aligned `master` at the prompt's exact expected commit, `581c80d6fadc61451a583ff65479b22aba9aef87`. Gates 1-5 were accepted, Gate 6 was the immediate next gate, the Gate 6 artifact did not exist, revised `0.6.5` and Gate 7 were blocked, and the production-authority trigger was undecided. The active and queued integration prompts were byte-identical Git blobs at `9ce61594efe498c78b0b6d0d08fdafccf7cc0c54` ([current handoff](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-gpt-handoff.md), [current output](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-output.md), [active prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-prompt.md), [queued prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/queued-cross-domain-production-research-integration-prompt.md)).

### Claim and authority categories

- **Repository fact:** reproduced from current content, validation, loader, runtime, test, or coordination state; controlling for this project.
- **External evidence:** cited archaeological, historical, heritage, conservation, metrology, engineering, government, or intergovernmental evidence; informative but never canonical.
- **Design inference:** an explicitly bounded interpretation that connects repository facts and external evidence without creating authority.
- **Integration candidate:** a principle, conditional correction, relationship, precondition, authored question, or reservation awaiting the later integration.
- **Runtime reservation:** action, quantity, item transfer, worker assignment, time, quality, wear, fuel use, energy, state, inventory mutation, or persistence that static research cannot own.

Authority order is live code and content, focused accepted decisions, current coordination, accepted Gates 1-5, external evidence, then explicit inference. Similar names, historical possibility, a workplace input list, a chain stage, or a market value never establishes an alias, recipe, source, quantity, regional placement, or executable capability.

### Repository method

- Read the current coordination, research program, recipe reconciliation, audit trigger, crafting authority, economy authority, roadmap, backlog, all five accepted research artifacts, active/queued integration hold, relevant content, validation, runtime, and focused tests.
- Parsed every one of the 121 chain records and 58 workplace records, including nested variants, steps, jobs, tool requirements, input/output profiles, progression, upgrades, site requirements, and optional profiles.
- Reproduced namespace, stage, step, input, output, variant, skill, tool, job, quantity-placeholder, market, recipe-link, and test counts.
- Called the public craft resolver for every chain's declared primary output, and compared requested targets, explicit fields, variant substitution, workplace fallback, chain fallback, final returned outputs, and value/index participation.
- Traced every live loader, runtime, consistency, lint, schema/validator, content-link, public export, and focused-test consumer found by repository-wide search.
- Applied the approved six-condition trigger and five-criterion skip matrices mechanically to the complete Gates 3-6 evidence set.

### External method and source quality

- **A1 - primary authority:** first-party historical source or normative primary authority.
- **A2 - peer reviewed:** peer-reviewed research or scholarly synthesis.
- **B1 - official evidence:** government, intergovernmental, or formal official technical evidence.
- **B2 - institutional evidence:** museum, heritage, conservation, university, or comparable institutional evidence with narrower authority.
- **C - contextual analogue:** contextual support only; none was needed in the final corpus.

The final register contains 41 works across 41 direct URLs: 1 A1, 5 A2, 27 B1, and 8 B2. Every registered external work is used inline. Modern industrial and safety sources support dependency, hazard, residue, maintenance, and separation claims only. Archaeological and heritage evidence establishes possibility and variation, never universal adoption, affordability, exact chronology, or Lineage: Reforged canon.

### Safety boundary

This artifact provides no weapon-construction procedure, furnace charge, high-temperature schedule, alloy percentage, pressure-vessel instruction, caustic formula, hazardous-gas method, poison preparation, waste-treatment procedure, exact dimension, tolerance, ratio, yield, loss rate, time, capacity, or quality formula. Heat, fuel, pressure, dust, fumes, wastewater, toxic material, fire, lifting, and machinery appear only as qualitative capability, housing, maintenance, residue, and runtime-owner requirements.

## 3. Live Repository Baseline And Owners

### Exact live baseline

| Catalog or owner | Exact state | Authority and limit |
|---|---:|---|
| Items | 1,372 | Portable/static identities; no recipe or source relationship follows from a name |
| Market values | 1,617 | Economy value identities, including 245 market-only biological identities; not physical stock |
| Production chains | 121 | Macro economic topology and live resolver input |
| Declared chain stages | 322 | Ordered declarations; validation does not require one step per stage |
| Processing steps | 311: 227 workplace, 84 extraction | Runtime cost/output stages, not physical work orders |
| Step inputs | 19 explicit, 292 empty | Empty arrays invoke fallback; six explicit arrays can be variant-overridden |
| Step outputs | 132 explicit, 179 empty | All empty outputs are runtime-derived |
| Variant chains / variants | 28 / 162 | Variant metadata can replace inputs, primary, and byproducts |
| Missing stage executions | 17 declarations in 6 chains | Declared topology without a matching processing step |
| Workplaces | 58 | Capability/profile records and fallback I/O/tool source |
| Workplace jobs | 208: 64 primary, 98 support, 32 specialist, 14 management | Static role vocabulary; no runtime job selection |
| Unique job IDs | 110 | Identity vocabulary only |
| Required tool-tag occurrences | 298 / 100 unique | Aggregated across all jobs by resolver; not tool-item possession |
| Tool items | 131 | Canonical item identities; tag matching is a separate relation |
| Skills | 121 | Canonical skill identities; chains use only six primary crafting skills |
| Planned recipes | 12 across 8 families | Complete static, non-executing, non-inheriting transformations |
| Buildings | 22 | All workplace identities have compatible building coverage; no active workplace instance |
| Settlements / regions / ecology profiles | 88 / 41 / 9 | Spatial/economic context; no generic regional production placement follows |
| Flora / fauna / monsters | 117 / 132 / 24 | Source identity/output possibilities; not process authority |
| Knowledge snippets | 28 | Lore/recognition only |
| Magic services / crystals | 4 / 27 | Bounded descriptive magic metadata; no generic production execution |

These counts were reproduced from [items](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/items.json), [market values](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/market_item_values.json), [chains](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/production_chains.json), [workplaces](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/workplaces.json), [recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/crafting/recipes.json), [skills](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/skills.json), [buildings](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/buildings.json), [settlements](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/settlements.json), [regions](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regions.json), [regional ecology](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regional_ecology_profiles.json), [flora](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/flora.json), [fauna](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/fauna.json), [monsters](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/monsters.json), [Knowledge](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/knowledge_snippets.json), [magic services](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/magic_infrastructure.json), and [crystals](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/crystal_catalog.json).

### Current owner boundaries

| Concern | Current owner | Not owned |
|---|---|---|
| Item identity | `items.items` | Source, recipe, quantity, instance, quality |
| Source/material authority | World resource, flora, fauna, item, and prior-gate evidence | Physical recovery or depletion |
| Macro process topology | `civilization.production_chains` | Exact player recipe or work-order execution |
| Workplace capability/profile | `civilization.workplaces` | Instantiated facility state or selected job/tier |
| Skill identity | `player.skills` | Which skill should govern a disputed transformation |
| Tool identity | Tool-class item records | Tag capability, possession, wear, or active selection |
| Bounded static transformation | `crafting.recipes` | Execution, inventory mutation, inherited chain fields |
| Economic craft/value resolution | Civilization runtime economy | Item creation, material transfer, queue, worker, or batch |
| Market value and price | Market-value content plus settlement runtime economy | Physical production or inventory |
| Consistency and content closure | Semantic/content lint and simulation consistency | Intended resolver semantics |
| Mutable execution state | No production owner exists | Queue, lot, fuel stock, workplace condition, job assignment, tool instance, quality history |

The loader's production TypeScript surface is narrower than the validated data: its `processingCostMode` contract names only `fuel_tool_wear`, while live content contains 109 `fuel_tool_wear`, 11 `fuel_and_tool_wear`, and one `tool_wear`; runtime merely reports the string. There is no standalone production-chain JSON Schema. Custom content lint is the structural/semantic authority ([loader/contracts](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/content.ts), [content lint](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/index.mjs), [shared contracts](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/shared/types/src/contracts.ts)).

## 4. Continuity With Gates 1–5

### Gate 1 — resources, gathering, and extraction

Preserved: source identity, source entity/site, recoverable output, prepared stock, commodity, chain, runtime action, and mutable depletion/access remain separate. Extraction-like chain stages do not create a gathering site, resource state, yield, ownership, access, or item. Gate 6 confirms that all 84 extraction steps have empty input arrays and 82 have empty output arrays, so they are especially fallback-dependent ([Gate 1 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md)).

### Gate 2 — ecology, flora, fauna, and byproducts

Preserved: living organism, harvested/recovered output, anatomical or shed byproduct, hazard, population state, material grade, chain input, and runtime item remain separate. Workplace input or chain fallback cannot canonize a biological source or make a byproduct edible, safe, common, or renewable ([Gate 2 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md)).

### Gate 3 — agriculture, land, food, and livestock

Preserved: land, soil, water, crop/livestock identity, producing state, harvest/feed/manure, farm process, food process, recipe, and execution remain separate. Qualified: Gate 3's mixed-crop and workplace skill/tool concerns are not isolated exceptions; the complete audit shows 78 chains with at least one missing or differing step skill and all 121 chains with shared workplace job/tool/tier ambiguity ([Gate 3 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md)).

### Gate 4 — materials, refinement, and processing

Preserved: raw, prepared, refined, intermediate, component, product, process aid, fuel, coproduct, recoverable residue, waste, market identity, chain output, recipe output, and runtime instance remain separate. Confirmed and broadened: fallback, generic/variant output, stage closure, and last-step omission affect all production namespaces, not only material chains ([Gate 4 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-materials-refinement-processing-research-2026-07-14.md)).

### Gate 5 — food processing and preservation

Preserved: food grade, cleaned/stabilized/preserved state, ingredient, process aid, ferment, dish, feed, spoilage, lot, storage condition, recipe output, and runtime item remain separate. Gate 5's 41-chain predicate remains a valid analytical subset, but Gate 6 replaces it as the exhaustive production boundary. The same defects extend to metal, textile, wood, stationery, warfare, alchemy, household, and other namespaces ([Gate 5 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-food-processing-preservation-research-2026-07-14.md)).

### Forward disposition

No earlier accepted artifact is contradicted. Gate 6 qualifies scope, reproduces complete live effects, and triggers the focused audit. The audit owns resolver and field-authority reconciliation; Gate 7 owns detailed elemental substitution; integration owns cross-domain promotion/correction/rejection; later implementation owns schema, validation, content, runtime, and mutable-state changes.

## 5. Required Production-State And Authority Separation

| State or authority | Meaning | Current or future owner | Must not collapse into |
|---|---|---|---|
| Source identity | Canonical organism, deposit, landscape source, recovered stock, or supplier context | World/resource/ecology/item authority | Chain stage or workplace input |
| Material identity/state | Raw, prepared, refined, intermediate, component, aid, fuel, product, residue | Item/material authority | Similar name or runtime fallback |
| Process topology | High-level ordered/parallel production context | Production chain | Exact quantities or executable order |
| Processing step | Economic resolution unit with stage, intensity, difficulty, skill, and I/O hints | Chain `recipeProfile.processingSteps` | Physical action or recipe step |
| Workplace capability | What a workplace can broadly accept, produce, host, or require | Workplace content | Instantiated facility or universal regional availability |
| Job identity/role | Authored workforce vocabulary and organizational role | Workplace profile | Selected worker, active assignment, or output entitlement |
| Tool identity | Canonical portable item | Item catalog | Tool tag, workplace fixture, consumable aid, or possession |
| Tool capability/tag | Broad requirement used by workplace jobs | Workplace/job relationship | Exact item alias or condition |
| Skill identity | Canonical proficiency | Skill catalog | Correct skill assignment for every process |
| Macro economic resolution | Derived cost, time, quantity, quality, and explanation | Civilization runtime | Physical material transfer |
| Market/value authority | Base values, local prices, supply/demand pressure | Market content and runtime | Recipe ratio or item availability |
| Bounded static recipe | Complete authored input/output/quantity/workplace/tool/skill relationship | `crafting.recipes` | Inherited chain/workplace fallback |
| Work order/execution | Selected recipe, actors, tools, station, inputs, fuel, duration, outputs | No current owner | Static chain resolution |
| Inventory mutation | Consume input instances and create/move output instances | No production owner | Value calculation |
| Workplace instance state | Capacity, installed upgrades, condition, queues, staffing, storage | No current owner | Descriptive profile |
| Batch/lot state | Quantity, quality, provenance, contamination, temperature, age, state | No current owner | Static item identity |
| Maintenance/wear | Tool/facility condition, service, repair, replacement | No production owner | Textual processing-cost label |
| Waste/residue state | Generated discard, recoverable stream, hazard, location, handling | No production owner | Economic waste scalar or declared byproduct |

Production chains and workplaces may inform later recipes, but they cannot silently supply exact ratios, active tools, fuel consumption, workforce, tier, site, quality, capacity, or inventory behavior. Conversely, the existence of a future recipe must not erase live macro-economic consumers.

## 6. Complete Consumer And Call-Site Inventory

| Consumer / call site | Exact use | Authority effect | Gate 6 implication |
|---|---|---|---|
| Civilization content loader | Loads chain/workplace JSON into runtime records | Preserves raw nested data but exposes a narrower typed surface | Loader/runtime/type mismatch belongs in audit |
| Runtime-economy index builder | Indexes chains by declared primary, byproducts, and variants; groups outputs by primary skill | Makes declared outputs and primary skills market/value-selectable | Top-level declarations affect selection even when final outputs differ |
| `resolveCraftAtSettlement` | Selects a chain, resolves fallback inputs/outputs, skills/tools/fuel, quantity/quality/time/cost/waste | Live economic authority | Central focused-audit target |
| Item-value resolver | Chooses base or production-derived value candidates | Chain inputs/costs can affect item value | Resolver ambiguities are not recipe-local |
| Settlement market-state builder | Produces local price rows from value, supply, demand, and settlement context | Propagates chain-derived values into markets | 120 chains can influence a non-shadowed path |
| Local price and trade projections | Exposes buy/sell/value explanations | Consumes market state, not chain JSON directly | Downstream economic effect remains real |
| Transport runtime | Uses local prices and cargo context | Chain effects can propagate into transport pricing | Cross-domain consumer |
| Simulation consistency | Loads chains/workplaces, checks input/output source coverage, cycles, references, unused workplaces, building coverage | Reports static graph consistency | Does not prove intended runtime semantics |
| Production semantic lint | Validates record shape, IDs, refs, enums, stages, variants, workplace steps, skills, item/value closure, and value modes | Current chain structural authority; no standalone schema | Omits stage-step completeness and returned-output closure |
| Workplace JSON Schema and lint | Validates workplace shape, profiles, jobs, tool tags, placeholders, I/O, progression, upgrades, sites, and cross-references | Strong static shape authority | Does not make optional profiles runtime-active |
| Crafting recipe validator | Validates exact recipe shape and item/workplace/tool/skill/optional chain refs | Bounded recipe authority | Chain link is existence-only and non-inheriting |
| Settlement-economy validator | Resolves workplace and production-chain refs in settlement economic profiles | Descriptive cross-reference consumer | Does not establish active production |
| Resource/commodity validator | Resolves optional related production-chain IDs | Static relationship consumer | Does not inherit inputs/outputs |
| Building coverage lint | Ensures workplaces have compatible building coverage | Capability coverage only | No facility instance/tier selection |
| Resource-stage lint | Resolves extraction/source-stage vocabulary used by chains | Reference closure | No extraction execution |
| Commodity/content relations | Resolve related chain IDs and canonical item keys | Static graph only | No transformation |
| Civilization public index | Exports craft/value/market functions | Makes resolver a public engine surface | Changes require compatibility-focused audit |
| Runtime-economy unit tests | Exercise skill, time, cost, value, price, bread, and cheese behavior | Five broad tests | Missing branch isolation is trigger evidence |
| Crafting-recipe tests | Exercise schema/validator and 12-record seed | Proves non-inheritance and ref closure | Does not test chain resolver |
| Civilization consistency tests | Exercise graph/settlement consistency | Detects selected static failures | Does not prove target/fallback intent |
| Trade/settlement/institution tests | Consume derived market states | Indirect downstream regression surface | Resolver changes may have broad effects |

Direct implementation sources are [content loader](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/content.ts), [runtime economy](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/runtime-economy.ts), [simulation consistency](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/simulation-consistency.ts), [transport runtime](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/transport-runtime.ts), [public index](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/index.ts), [workplace schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/civilization/workplace.schema.json), [recipe schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/crafting/recipe.schema.json), [recipe validator](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/crafting-recipes.mjs), [settlement-economy validator](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/settlement-economies.mjs), [resource/commodity validator](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/commodities.mjs), [runtime tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-runtime-economy.test.mjs), [recipe tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/crafting-recipes-validation.test.mjs), and [consistency tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-system-consistency.test.mjs).

## 7. All-Chain Baseline And Classification

### Aggregate derivation

The exhaustive parse covers 30 namespaces: alchemy 4, apiary 1, beverage 10, brewing 1, ceramics 1, cooperage 2, farming 1, food 22, forage 3, fuel 2, glass 1, hospitality 1, household 2, hunting 2, leather 4, logistics 1, lumber 4, masonry 2, materials 1, medicine 4, metal 12, ranged 2, reed 1, riverside 1, stationery 23, sugar 1, tailoring 2, textile 5, utility 1, and warfare 4.

The 121 chains contain 322 stages and 311 steps. The 227 workplace steps all have a skill check; the 84 extraction steps have none. The step-input split is 19 explicit workplace steps with 26 references and 292 empty steps (208 workplace, 84 extraction). The output split is 132 explicit steps with 353 references and 179 empty steps (97 workplace, 82 extraction); all 179 receive runtime output. Twenty-eight chains have 162 variants, 486 variant-input references, and 383 variant-byproduct references. Eleven chains have 27 `externalInputs` references; eight have nine `intermediateItems` references. All static item, workplace, extraction, skill, and market-value references resolve.

No chain qualifies as fully `dependency-closed enough for macro economic abstraction` under the Gate 6 test. Even the five chains without empty arrays fail closure: three omit declared stages; sausage rolls variant-override the authored pastry intermediate; and bakery specials declare inputs that no step consumes. The other 116 are `fallback-dependent but intentionally abstract`, with “intentionally abstract” describing documented macro intent rather than proof that the selected fallback is factually correct.

### Classification legend and counts

| Code | Exact classification | Count |
|---|---|---:|
| C | `dependency-closed enough for macro economic abstraction` | 0 |
| F | `fallback-dependent but intentionally abstract` | 116 |
| R | `recipe-local mismatch` | 11 chains / 12 linked recipes |
| X | `cross-domain mismatch` | 72 |
| G | `generic/variant output conflict` | 11 |
| M | `missing stage execution` | 6 |
| O | `omitted-output conflict` | 17 |
| J | `tool/job/tier ambiguity` | 121 |
| S | `skill ambiguity` | 54 |
| E | `fuel or energy ambiguity` | 94 |
| T | `test gap` | 121 |
| D | `possible factual content defect` | 30 |
| A | `requires the focused audit` | 121 |

`X` uses a reproducible conservative rule: the default resolver selects at least one cross-namespace chain-produced input absent from the chain's explicit step, variant, external-input, or intermediate authoring. `S` includes 40 mechanical primary/step/linked-recipe mismatches and 14 domain-specific cases where a more specific canonical skill exists. `E` is the union of fuel-heavy chains, ignored non-manual progression power, fuel-producing lanes, and default-selected fuel-role inputs. `D` is a candidate finding, never permission to correct content.

### Complete 121-chain classification

Every row also records the namespace through grouping. Its codes are the exact classifications above; therefore every chain's authority disposition includes the focused audit.

```text
[alchemy]
chain.alchemy.adhesive FXJSETA
chain.alchemy.lamp_oil FXJETA
chain.alchemy.tonic FXOJETA
chain.alchemy.utility_salve FXJSETA
[apiary]
chain.apiary.candles FXJSETDA
[beverage]
chain.beverage.bakery_tea_service FJETA
chain.beverage.cider FXJSETA
chain.beverage.coffee_roast FXJETDA
chain.beverage.inn_tea_service FJETA
chain.beverage.kitchen_tea_service FJETA
chain.beverage.tavern_tea_service FJETA
chain.beverage.tea_house_service FXJETA
chain.beverage.wine FXGJSETA
chain.beverage.wine.integrated FGJETA
chain.beverage.wine.segmented FXGJSETA
[brewing]
chain.brewing.ale FXJSTA
[ceramics]
chain.ceramics.vessel FXJSETDA
[cooperage]
chain.cooperage.cask FXJSTA
chain.cooperage.components FXJTA
[farming]
chain.farming.mixed_crop FJSETA
[food]
chain.food.bakery_goods MJETDA
chain.food.bakery_sausage_rolls JETA
chain.food.bakery_specials JETA
chain.food.berry_preserves GMJETDA
chain.food.bread FROJETA
chain.food.butchery_bulk_cuts FJETA
chain.food.butchery_retail_cuts FJETA
chain.food.citrus_marmalade MJETDA
chain.food.cocoa_mass FXJETDA
chain.food.flour FRGJSETA
chain.food.fresh_cheese FJETA
chain.food.inn_board FXJETA
chain.food.inn_sausage_board FJETA
chain.food.kitchen_cutlets FJETA
chain.food.kitchen_hearty_stews FJETA
chain.food.preserved_fish FGMJETDA
chain.food.preserved_meat FRGMJETDA
chain.food.sausage_links FJETA
chain.food.sausage_pack_coil FJETA
chain.food.smoked_sausage FMJETDA
chain.food.tavern_bulk_roasts FJETA
chain.food.tavern_platters FJETA
[forage]
chain.forage.wild_harvest FJETA
chain.forage.wild_harvest.guild FJETA
chain.forage.wild_harvest.hut FJETA
[fuel]
chain.fuel.charcoal FJSETDA
chain.fuel.firewood_bundle FJSETA
[glass]
chain.glass.vial FXOJSETDA
[hospitality]
chain.hospitality.bath_house_service FXOJETA
[household]
chain.household.lantern FXOJSETA
chain.household.storage FXOJSETA
[hunting]
chain.hunting.game_supply.camp FGJETA
chain.hunting.game_supply.guild FXGJETA
[leather]
chain.leather.components FRXJTA
chain.leather.cured FRJSTDA
chain.leather.exotic_curing FJSTDA
chain.leather.grades FXJTA
[logistics]
chain.logistics.cart FXJSETA
[lumber]
chain.lumber.beam FGJTA
chain.lumber.components FRJTA
chain.lumber.plank FRGJTA
chain.lumber.specialty_stock FJTA
[masonry]
chain.masonry.cut_stone FJSTA
chain.masonry.fired_brick FJSTA
[materials]
chain.materials.shell_lime FJSETDA
[medicine]
chain.medicine.apothecary_retail FXOJSETA
chain.medicine.cured_tea_leaf FJSTA
chain.medicine.herbal_preparations FXOJSTA
chain.medicine.restorative_poultice FXOJSTA
[metal]
chain.metal.aetherite_ingot FXJSETDA
chain.metal.brass_ingot FXJSETDA
chain.metal.bronze_ingot FXJSETDA
chain.metal.components FRXJETA
chain.metal.copper_ingot FXJSETDA
chain.metal.gold_ingot FXJSETDA
chain.metal.iron_ingot FRXJSETDA
chain.metal.mithrite_ingot FXJSETDA
chain.metal.moon_silver_ingot FXJSETDA
chain.metal.orichalcum_ingot FXJSETDA
chain.metal.silver_ingot FXJSETDA
chain.metal.steel_ingot FXJSETDA
[ranged]
chain.ranged.arrows FXJSTA
chain.ranged.bows FXOJSETA
[reed]
chain.reed.thatch FXJSTA
[riverside]
chain.riverside.crawfish FJTA
[stationery]
chain.stationery.black_pigment FXJETA
chain.stationery.blank_book FXJSETA
chain.stationery.blank_scroll FXJSETA
chain.stationery.blue_pigment FXJETA
chain.stationery.blue_writing_ink FXJETA
chain.stationery.fine_paper FXJETA
chain.stationery.green_pigment FXJETA
chain.stationery.green_writing_ink FXJETA
chain.stationery.ledger_binding FXJSETA
chain.stationery.paper_sheet FXJETA
chain.stationery.parchment_sheet FXJSETDA
chain.stationery.pigment_paste FXJETA
chain.stationery.purple_pigment FXJETA
chain.stationery.purple_writing_ink FXJETA
chain.stationery.quill_bundle FXJTDA
chain.stationery.record_book FXJSETA
chain.stationery.record_scroll FXJSETA
chain.stationery.red_pigment FXJETA
chain.stationery.red_writing_ink FXJETA
chain.stationery.reference_book FXJSETA
chain.stationery.writing_ink FXJETA
chain.stationery.yellow_pigment FXJETA
chain.stationery.yellow_writing_ink FXJETA
[sugar]
chain.sugar.cane_refining FJETA
[tailoring]
chain.tailoring.apparel FXOJSETA
chain.tailoring.cloak FXOJSTA
[textile]
chain.textile.cloth_grades FRJTA
chain.textile.components FOJTA
chain.textile.dyed_cloth FJTA
chain.textile.linen FJTDA
chain.textile.wool FJTDA
[utility]
chain.utility.tools FRXOJSETA
[warfare]
chain.warfare.armor FXOJSETA
chain.warfare.leather_armor FXOJSTA
chain.warfare.scale_armor FXJSETA
chain.warfare.weapons FXOJSETA
```

### Exact exception sets

The 11 generic-primary conflicts are `chain.beverage.wine`, `chain.beverage.wine.integrated`, `chain.beverage.wine.segmented`, `chain.food.berry_preserves`, `chain.food.flour`, `chain.food.preserved_fish`, `chain.food.preserved_meat`, `chain.hunting.game_supply.camp`, `chain.hunting.game_supply.guild`, `chain.lumber.beam`, and `chain.lumber.plank`.

The 17 missing stage occurrences are:

- `chain.food.bakery_goods`: `extract.grain.harvest`, `workplace.millhouse`, `workplace.butchers_block`, `workplace.smokehouse`.
- `chain.food.berry_preserves`: `extract.foraging.woodland`, `extract.apiculture.hive_keeper`, `workplace.sugar_boilers_house`, `workplace.pottery_kiln`.
- `chain.food.citrus_marmalade`: `extract.orchard.grove_tender`, `extract.apiculture.hive_keeper`, `workplace.sugar_boilers_house`.
- `chain.food.preserved_fish`: `extract.fishing.river_netter`, `extract.salt.brine_evaporator`.
- `chain.food.preserved_meat`: `extract.hunting.trapper`, `extract.salt.brine_evaporator`, `workplace.butchers_block`.
- `chain.food.smoked_sausage`: `workplace.butchers_block`.

The 17 non-variant omission chains return only the last-step outputs and drop 62 declared occurrences:

| Chain | Declared occurrence omitted from final result |
|---|---|
| `chain.alchemy.tonic` | `stimulant_draught` |
| `chain.food.bread` | `bran` |
| `chain.glass.vial` | `glass_bottle`, `glass_jar` |
| `chain.hospitality.bath_house_service` | `herbal_bath` |
| `chain.household.lantern` | `lamp` |
| `chain.household.storage` | `basket`, `bucket`, `cellar_rack`, `sack`, `jar`, `pack_frame`, `wagon_wheel`, `wagon_fittings` |
| `chain.medicine.apothecary_retail` | `traveler_remedy_kit` |
| `chain.medicine.herbal_preparations` | `bitter_tincture` |
| `chain.medicine.restorative_poultice` | `bitter_tincture` |
| `chain.ranged.bows` | `long_bow`, `composite_bow`, `light_crossbow` |
| `chain.tailoring.apparel` | 13 apparel, pack, harness, rein, saddle, glove, belt, boot, and jerkin outputs |
| `chain.tailoring.cloak` | `casual_cloak`, `blanket`, `padded_gambeson` |
| `chain.textile.components` | `rope` |
| `chain.utility.tools` | 14 farm, extraction, butchery, herb, pruning, and aggregate tool outputs |
| `chain.warfare.armor` | `mail_coif`, `plate_helm` |
| `chain.warfare.leather_armor` | three medium/heavy/greave outputs |
| `chain.warfare.weapons` | six spear, dagger, sword, axe, and aggregate weapon outputs |

All 12 current recipe rows mismatch their linked default chain resolver in input set, output set, or quantity. The 11 linked chains are `food.bread`, `food.preserved_meat`, `leather.components`, `textile.cloth_grades`, `food.flour`, `leather.cured`, `metal.components`, `metal.iron_ingot`, `lumber.plank`, `utility.tools`, and `lumber.components` (two recipes). This does not invalidate the recipes: their exact, non-inheriting shape is the bounded static authority. It proves only that chain fallback cannot supply their fields.

The 30 conservative possible-defect candidates are apiary candles; coffee roast; ceramic vessel; bakery goods; berry preserves; citrus marmalade; cocoa mass; preserved fish/meat; smoked sausage; charcoal; glass vial; cured and exotic leather; shell lime; all 11 specialized ingot lanes; parchment sheet; quill bundle; linen; and wool. The focused audit must decide whether each issue belongs to content, runtime, validation, documentation, or intentional abstraction.

## 8. Production-Chain Field Authority Matrix

Production chains have no standalone JSON Schema. `tools/content-lint/index.mjs` is their structural and referential authority; `content.ts` casts the live JSON into a narrower runtime type. The validator permits empty I/O arrays, checks step-to-declared-stage membership, and does not require declared-stage-to-step completeness, dependency carry, exact returned-output closure, recipe correspondence, or tool/job/tier/fuel ownership.

| Actual field | Static meaning / required | Validation and loader | Runtime / fallback behavior | Value, recipe, and `0.6.5` effect | Posture, tests, unresolved issue |
|---|---|---|---|---|---|
| `id` | Required chain identity | Pattern, uniqueness and refs validated; loaded/indexed | Selects chain and explanations | Candidate/value index; recipe link target | Authoritative identity; tested indirectly |
| `stages[]` | Required declared topology | Nonempty known stage refs; step refs must belong | Craft does not iterate it | Consistency/topology only | Descriptive; 17 declarations lack steps |
| `primaryOutput` | Required macro target | Canonical item/value ref | Default requested target and candidate index | Live value/market selection; recipe analogy only | Authoritative macro target, not exact recipe output |
| `byProducts[]` | Required array of macro secondary outputs | Canonical item/value refs | Indexed, but only last-step returned outputs survive | Can affect value candidates even when craft omits them | Descriptive macro output; return closure untested |
| `facilityStrategy` | Optional facility/market strategy on 8 chains | Shape/vocabulary validated | Omitted from runtime type and ignored | None current | Unused descriptive field; audit type/intent |
| `variantConfig.variantFlag` | Optional variant vocabulary label | Validated | Omitted from type and ignored | None | Unused metadata |
| `variantConfig.defaultVariant` | Declared default variant | Must identify a variant | Used after explicit/request/input selection | Changes resolved inputs/outputs and values | Live fallback authority; target behavior untested |
| `variantConfig.variants[].id` | Variant identity | Unique in chain | Explicit request may select; invalid ID silently yields no explicit match | Candidate selection | Live local identity; invalid-request behavior untested |
| `inputItemKeys` | Variant input pool | Canonical refs | Used when selected and flag permits; may override explicit inputs | Material cost/value and recipe divergence | Live economic input, not exact quantity |
| Variant `primaryOutput`, `byProducts` | Variant output set | Canonical refs | May replace explicit/declared outputs | Indexed and priced | Live economic output; generic target conflict in 11 chains |
| Variant `laborWeight` | Intended variant labor descriptor | Placeholder/shape validated | Omitted/ignored | None | Placeholder/unused |
| `recipeProfile.recipeClass` | Macro class | Required vocabulary | Echoed in explanation only | Classification context | Descriptive, not planned-recipe family authority |
| `primarySkillId` | Macro chain skill | Required canonical skill | Fallback skill and output-by-skill index | Labor pressure, value/market effect; not recipe skill inheritance | Live economic field; only six skills across 121 chains |
| `externalInputs[]` | Authored chain-level source inputs | Required array; canonical refs | Late fallback only | Can become value inputs | Fallback-only, not exact recipe input |
| `intermediateItems[]` | Authored intermediate vocabulary | Required array; canonical refs | Late fallback only; no carry state | Can become selected input | Fallback-only; name does not create sequential execution |
| `processingSteps[].id` | Step-local identity | Required/unique | Explanation only | No independent value identity | Descriptive identifier |
| `stageRef` | Workplace or extraction stage | Required, known, must occur in stages | Selects workplace behavior and step kind | Drives fallback/tool/cost | Live resolution key; reverse completeness absent |
| `operation` | Operation label | Required string/vocabulary posture | Explanation only | None direct | Descriptive |
| `inputs[]` | Explicit economic step dependencies | Required array; canonical refs; may be empty | First precedence unless variant flag replaces | One unit each for costs; relevant to recipe comparison | Live economic input, not quantity authority |
| `outputs[]` | Explicit economic step outputs | Required array; canonical refs; may be empty | First output branch unless variant flags; final step only returned | Candidate/value implications differ from final return | Live economic output, not item creation |
| `usesVariantInputs` | Switch for variant input substitution | Optional boolean | Selected variant overrides even nonempty explicit inputs | Six exact default overrides affect food recipes/values | Live switch; two chains have inert flags without config |
| `usesVariantPrimaryOutput` | Switch for variant primary | Optional boolean | Replaces explicit/workplace primary | Generic target may fail | Live switch; branch tests absent |
| `usesVariantByProducts` | Switch for variant byproducts | Optional boolean | Replaces explicit/workplace secondary outputs | Value/output effects | Live switch; carry semantics absent |
| Request `targetOutputItemKey` | Runtime request, not content | Checked against candidate indexes | Influences chain/variant selection, explicit/workplace output partition | Direct craft/value/market path | Runtime-derived; generic/output precedence needs audit |
| `laborIntensity` | Qualitative step labor band | Required enum | Hard-coded time/labor scalar | Cost and value | Live economic configuration; not worker count |
| `processingIntensity` | Qualitative processing/fuel band | Required enum | Hard-coded processing/time scalar; `fuel_heavy` sees request boolean | Cost/value, no item fuel | Live abstraction; fuel identity unresolved |
| `difficultyTier` | Qualitative difficulty band | Required enum | Hard-coded scalar | Quantity, quality, time, costs | Live economic configuration; not recipe gate |
| `materialDifficultyMode` | Material-difficulty label | Required supported value | Currently ignored in selection/math | No distinct effect | Descriptive/unused despite name |
| `skillCheck.skillId` | Step skill | Required on workplace steps; canonical | Drives rank-based scalar | Time, labor, waste, quality, quantity | Live economic field; minimum is penalty threshold, not block |
| `minimumRank`, `efficiencyRank`, `qualityRank`, `lowSkillOutcome` | Skill thresholds/outcome label | Validated | Hard-coded interpolation/penalty | Cost/quantity/quality | Runtime-derived scalar; no action eligibility |
| `valuePropagation.materialCostMode` | `input_sum` label | Required exact value | Runtime calculation is hard-coded | Explanation/value | Descriptive configuration |
| `laborCostMode` | `skill_time_weighted` label | Required exact value | Hard-coded labor formula | Explanation/value | Descriptive configuration |
| `processingCostMode` | Fuel/tool-wear label | Three live values accepted | Echoed; runtime formula separately hard-coded | Explanation/value | Type drift; no physical fuel or wear |
| `difficultyMode` | `step_material_weighted` label | Required exact value | Hard-coded math; label echoed | Explanation/value | Descriptive configuration |
| `demandBand` | Macro demand band | Required enum | Echoed, not resolver selection | Descriptive market context | Does not create settlement demand |
| `carriesForward` | Intended propagation posture; true on all 121 | Required boolean | Echoed only; no step output carries to next step | Misleading for recipe integration | Descriptive/unused; needs audit |
| Quantity fields | No chain quantity field exists | N/A | One per selected input; hard-coded output scalar/byproduct share | Cannot seed `0.6.5` | Runtime-derived only |

The loader type also narrows `processingCostMode` to `fuel_tool_wear`, while live validated content uses 109 `fuel_tool_wear`, 11 `fuel_and_tool_wear`, and one `tool_wear`. It omits `facilityStrategy`, `variantFlag`, and variant `laborWeight`. Because loading is a raw cast, TypeScript does not validate those live shapes.

## 9. Workplace Field Authority Matrix

The workplace JSON Schema and semantic lint are strong static-shape authorities, but the runtime loader intentionally exposes only part of the data. Fifty-eight workplaces comprise 15 extraction, 33 processing, and 10 manufacturing records.

| Actual field | Required / static meaning | Validation and loader | Runtime / fallback use | Value, job, tier, tool, recipe, `0.6.5` effect | Posture and unresolved issue |
|---|---|---|---|---|---|
| `id`, `name`, `category` | Required identity/display/category | Schema and refs validate; loaded | ID selects exact workplace; name/category no craft math | Recipe/workplace refs use ID | ID authoritative; display descriptive |
| `inputTags[]`, `outputTags[]` | Required canonical capability tags | Item/source semantics checked | Craft fallback ignores tags; consistency uses output tags | Graph/source evidence | Descriptive capability, not executable I/O |
| `siteTags[]` | Optional site abstractions on 15 records | Must resolve abstraction vocabulary | Ignored by craft | Regional/site candidate context only | Descriptive; no placement |
| `laborSlots` | Required capacity-like field | Placeholder accepted | Omitted/ignored | None | All 58 are `{}`; placeholder |
| `workforceProfile.maxConcurrentWorkers` | Required maximum | Placeholder accepted | Ignored | None | All 58 placeholders |
| `jobs[].jobId` | Embedded job identity | Syntax/uniqueness/cross-refs | No active job selected | Tool tags aggregated from all jobs | Descriptive local slot; not global profession catalog |
| `jobs[].role` | Primary/support/specialist/management | Enum validated | Only first primary chosen for penalty mode | Does not alter rate/outputs | Mostly descriptive |
| `requiredTier` and worker/rate/diminishing fields | Intended eligibility/curve | Numeric-or-placeholder validation | Ignored | No tier/workforce effect | All 208 are placeholders |
| `unlocks`, `replanting` | Capability/progression descriptors | Structurally/cross-ref validated where applicable | Ignored | No active output unlock | Descriptive |
| `toolRequirements.minimumToolTier` | Intended tool tier | Placeholder accepted | Ignored | No tier effect | All placeholders |
| `requiredToolTags[]` | Broad job tool requirements | Syntax-only `tool.*`; not item refs | Unioned across every job | Missing-set affects time/cost only | 100 unique tags; five suffixes lack exact tool item keys |
| `missingToolPenalty.mode` | `no_output` or `reduced_output` | Enum validated | Reads first primary only; returns `blocked` but caller ignores it | Time/cost multiplier survives; output never blocked | Live contradiction |
| `missingToolPenalty.outputMultiplier` | Intended output factor | Placeholder accepted | Ignored | None | All placeholders |
| `ioProfile.workCycleHours` | Intended cycle duration | Required placeholder/numeric shape | Ignored | No time authority | All 58 placeholders |
| `ioProfile.inputs[].itemKey` | Broad workplace input candidates | Canonical refs | Heuristic fallback pool after explicit/variant input | One-unit material/value effect | Live fallback, not recipe input |
| Input `quantityPerCycle`, `unit`, `consumptionType` | Authored physical I/O metadata | Validated; only 8 quantities numeric | Ignored | Cannot seed recipe quantities | Mostly placeholders |
| `ioProfile.outputs[].itemKey` | Broad workplace output candidates | Canonical refs | Exact requested target if available, else first output plus other commodity outputs | Returned/value fallback | Live fallback, not guaranteed production |
| Output `quantityPerCycle`, `unit`, `productionType` | Authored output metadata | Validated; only 10 quantities numeric | Ignored | Cannot seed recipes | Loader type incorrectly expects input shape |
| `siteRequirements[]` | Abstract site dependencies | 16 refs validated | Ignored | Site/region question | Descriptive |
| `yieldGroups[]` | Alternative/grouped output evidence | Six groups / 147 grouped outputs validate | Craft ignores; consistency treats as source evidence | Graph only | Descriptive, not output roll |
| `tierProfile` | Optional facility/ownership/tech/wealth profile on 5 | Validated/cross-checked | Omitted/ignored | No tier selection | Tier values placeholders; no traversable upgrade path |
| `progressionProfile` | Optional five-tier description on 21 | 105 tiers validated | Omitted/ignored | No power/capacity/unlock effect | All numeric effects placeholders |
| `upgradesProfile` | Optional 116 upgrades on 25 workplaces | Categories, refs and shapes validate | Omitted/ignored | No installed-upgrade state | Slots/effects placeholders; zero tier requirements |
| `efficiencyProfile` | Optional efficiency descriptors on 10 | Validated | Ignored | No throughput/waste effect | Descriptive |
| `marketProfile` | Optional business/market descriptors on 9 | Validated | Ignored by craft | No price or availability gate | Descriptive |
| `integrationProfile` | Optional combo metadata on 6 | Validated | Ignored | No facility combo | Descriptive |
| `plotProfile` | Optional agricultural plot metadata on 1 | Validated | Ignored by craft | No plot/capacity effect | Descriptive |
| Services/facilities/buildings | External relationships | All workplaces have one compatible building; selected service owner types exist | Craft checks no placed building, service, storage, infrastructure, or settlement workplace | No active facility availability | Relationship authority outside workplace runtime |
| Storage/capacity/environment | Not first-class workplace fields | Absent except external building/profile hints | None | Cannot seed production state | Missing owner |
| Maintenance/repair/calibration/wear | No explicit fields | Absent; prose only | None; cost label is not wear | No runtime state | Reserved for later authority |

Numeric workplace I/O exists only for seven Bakehouse inputs and four outputs, two Bakery outputs, one Kitchen input and three outputs, and one Preservers Hearth output. Runtime ignores each quantity and unit. The loader's `WorkplaceIoItemRecord` requires `consumptionType` and types `quantityPerCycle` as an object, then reuses that type for JSON outputs that actually carry `productionType` and sometimes numbers; the raw cast masks the mismatch.

The 21 progression profiles contain 105 qualitative power-mode entries: manual 44, animal 16, water 3, wind 2, steam 2, and hybrid 38. No power source, infrastructure, transmission, availability, capacity, fuel item, maintenance, or failure owner follows. The two high-tier `steam` entries remain technology-review questions.

### Complete 58-workplace audit index

All IDs below have the workplace. prefix. Columns are category; declared chain-stage references; jobs by primary/support/specialist/management; distinct required tool tags; deterministic I/O counts; progression tiers; and upgrades. This is coverage evidence, not activation authority.

~~~text
alchemists_atelier | processing | 23 | 1/1/1/0 | 5 | 48/19 | 0 | 0
anglers_camp | extraction | 0 | 1/3/1/1 | 8 | 0/0 | 5 | 10
apiary_yard | extraction | 0 | 1/1/1/0 | 5 | 0/2 | 0 | 0
apothecary_shop | processing | 1 | 1/1/1/0 | 4 | 7/2 | 5 | 3
armorers_forge | manufacturing | 5 | 1/2/0/0 | 3 | 24/15 | 0 | 0
bakehouse | processing | 4 | 1/1/0/0 | 3 | 8/7 | 5 | 3
bakery | processing | 5 | 1/1/0/0 | 3 | 12/7 | 5 | 3
bath_house | processing | 1 | 1/1/1/0 | 5 | 6/2 | 5 | 3
bloomery_forge | processing | 12 | 1/2/1/0 | 3 | 3/3 | 0 | 3
bookbindery | manufacturing | 4 | 1/2/0/1 | 4 | 9/3 | 5 | 3
brewery | processing | 1 | 1/2/1/0 | 3 | 2/2 | 0 | 0
brickworks | processing | 1 | 1/2/1/0 | 3 | 2/3 | 0 | 0
butchers_block | processing | 9 | 1/2/0/0 | 3 | 51/35 | 5 | 4
cartwright_yard | manufacturing | 2 | 1/1/1/0 | 3 | 13/5 | 0 | 0
chandlery | processing | 2 | 1/2/0/0 | 4 | 8/4 | 0 | 0
charcoal_kiln | processing | 2 | 1/1/0/0 | 3 | 1/3 | 0 | 0
clay_pit | extraction | 0 | 1/2/0/0 | 5 | 0/2 | 0 | 0
coopers_shop | manufacturing | 6 | 1/1/1/0 | 3 | 8/4 | 0 | 2
deep_shaft_mine | extraction | 0 | 1/2/1/1 | 9 | 0/3 | 0 | 3
dye_house | processing | 2 | 1/1/1/0 | 3 | 8/2 | 0 | 0
flax_stead | extraction | 0 | 1/2/0/0 | 6 | 0/2 | 0 | 0
fletchers_shop | manufacturing | 2 | 1/1/0/0 | 2 | 13/6 | 0 | 0
fuel_yard | processing | 1 | 1/1/0/0 | 3 | 3/3 | 0 | 0
garden_plots | extraction | 1 | 5/2/5/2 | 15 | 0/0 | 5 | 8
gatherers_hut | extraction | 3 | 1/2/1/1 | 8 | 0/0 | 5 | 10
glassworks | processing | 3 | 1/1/1/0 | 3 | 2/3 | 0 | 0
herbalist_garden | extraction | 0 | 1/1/0/0 | 3 | 0/0 | 0 | 0
hunters_camp | extraction | 2 | 1/2/2/1 | 10 | 0/0 | 5 | 10
inn | processing | 3 | 1/1/0/0 | 2 | 11/8 | 5 | 3
kitchen | processing | 4 | 1/1/0/0 | 3 | 18/12 | 5 | 3
lime_kiln | processing | 2 | 1/1/0/0 | 2 | 8/2 | 0 | 0
loomhouse | processing | 18 | 1/2/1/0 | 3 | 5/9 | 0 | 0
masons_yard | processing | 1 | 1/2/0/0 | 2 | 1/3 | 0 | 0
millhouse | processing | 3 | 1/2/0/0 | 3 | 1/8 | 5 | 4
paper_mill | manufacturing | 4 | 1/2/0/1 | 4 | 7/2 | 5 | 3
parchment_house | processing | 3 | 1/2/0/1 | 4 | 11/1 | 5 | 3
peat_cutters | extraction | 0 | 1/2/0/0 | 4 | 0/2 | 0 | 0
physickers_conservatory | processing | 4 | 1/1/1/0 | 4 | 15/6 | 0 | 0
pottery_kiln | processing | 2 | 1/1/1/0 | 3 | 2/3 | 0 | 0
preservers_hearth | processing | 2 | 1/2/0/0 | 3 | 12/13 | 0 | 0
quarry_camp | extraction | 0 | 1/2/1/1 | 8 | 0/2 | 0 | 3
reed_weaving_shed | manufacturing | 2 | 1/2/0/0 | 3 | 2/3 | 0 | 0
riverbank_gatherers | extraction | 2 | 1/2/0/0 | 4 | 0/0 | 0 | 0
roasters_kilnhouse | processing | 2 | 1/1/1/0 | 2 | 4/5 | 0 | 0
salt_pans | extraction | 0 | 1/2/0/0 | 5 | 0/2 | 0 | 0
sawmill | processing | 12 | 1/4/0/0 | 5 | 7/15 | 0 | 0
scriptorium | manufacturing | 4 | 1/2/0/1 | 3 | 12/4 | 5 | 3
sheepfold | extraction | 1 | 1/2/1/0 | 6 | 0/2 | 0 | 0
smelter_hall | processing | 15 | 1/2/1/1 | 5 | 11/11 | 0 | 0
smokehouse | processing | 5 | 1/2/0/0 | 3 | 44/44 | 5 | 3
sugar_boilers_house | processing | 3 | 1/2/0/0 | 3 | 3/3 | 0 | 0
tailors_hall | manufacturing | 8 | 1/1/0/0 | 2 | 18/10 | 0 | 0
tannery | processing | 20 | 1/2/0/0 | 3 | 10/10 | 0 | 0
tavern | processing | 3 | 1/1/0/0 | 2 | 12/9 | 5 | 3
tea_house | processing | 1 | 1/1/1/0 | 4 | 8/2 | 5 | 3
vintners_press | processing | 4 | 3/4/1/1 | 10 | 16/10 | 5 | 10
weaponsmith_forge | manufacturing | 8 | 1/2/1/0 | 4 | 18/23 | 0 | 0
woodcutters_camp | extraction | 1 | 1/2/1/1 | 8 | 0/4 | 5 | 10
~~~

The nine workplaces with zero declared chain-stage references are Anglers Camp, Apiary Yard, Clay Pit, Deep Shaft Mine, Flax Stead, Herbalist Garden, Peat Cutters, Quarry Camp, and Salt Pans. They may be intentional extraction/source abstractions; no automatic stage addition is authorized.

## 10. Explicit, Variant, Workplace, Fallback, And Requested-Output Semantics

### Variant selection

The resolver tries: explicit `variantId`; requested output matching a variant primary or byproduct; selected-input intersection with the first matching variant; declared default; then first variant. An invalid explicit variant does not throw; it simply supplies no explicit match.

### Input precedence

1. A nonempty explicit step `inputs` array normally wins.
2. If `usesVariantInputs` and a selected variant has inputs, those inputs replace even nonempty explicit inputs.
3. An empty flagged step uses selected variant inputs.
4. A workplace step then selects a scored subset of workplace `ioProfile.inputs`, excluding known chain/variant outputs.
5. Remaining fallback uses chain `externalInputs`, then prior-named intermediates in selected conditions; it does not carry actual prior output.

The six exact default overrides of nonempty authored input are sausage-roll baking, berry preserving, flour, preserved fish, preserved meat, and smoked sausage. This is why an explicit array is not uniformly authoritative.

Workplace input scoring uses requested item branch/subbranch/tags/groups, otherwise the first candidates. It groups some ingot, leather, and cloth alternatives and chooses an exact-looking or lower-source-value member. This is a heuristic economic resolver, not an authored recipe.

### Output precedence

1. Nonempty explicit outputs are used unless variant-output flags replace them.
2. If the requested target appears in the explicit set, it becomes primary and other commodity outputs become byproducts; otherwise every explicit output is primary.
3. An empty workplace step returns the requested target when the workplace offers it; otherwise it uses the first workplace output and exposes other commodity outputs as byproducts.
4. An empty non-workplace step uses variant output where available, otherwise the requested target.
5. The final craft response is recomputed from the final processing step only.

The requested target is therefore both a selection input and an output-partition input. It is not a chain content field. Eleven generic-primary requests select default variant identities instead of the generic primary. Values further index top-level declared outputs and variants, so an output can influence price candidates even when the final craft response does not return it.

## 11. Stage, Step, Intermediate, Byproduct, And Final-Output Semantics

Declared `stages` are validated reference topology; runtime executes `processingSteps` in array order and uses each step's `stageRef`. Validation proves every step stage is declared, but not that every declared stage has a step. The 17 missing declarations in six chains therefore pass.

Declared workplace-stage occurrences total 229 while workplace processing-step occurrences total 227, but the near-equality conceals both omissions and repetitions. Butchers Block, Millhouse, Pottery Kiln, and Sugar Boilers House have more declarations than steps; Kitchen, Preservers Hearth, and Smokehouse have more steps than declarations at the cross-catalog aggregate level. Closure must be checked per chain, not from totals.

Every processing step is costed independently. A prior step's output is never placed into the next step's input. `intermediateItems` is a late fallback vocabulary, not mutable intermediate stock. All 121 `carriesForward` fields are true, but runtime merely echoes the label.

Top-level `byProducts` and variant byproducts participate in output indexes and value candidates. Returned byproducts come from final-step resolution and receive the same scalar output quantity as primary outputs. They are not waste, residue, inventory, or proof of a downstream consumer.

Only the last step determines `outputs` and `byProducts` in `CraftResolutionState`. This produces the 62 omitted declared occurrences. The system can thus price a declared output through an indexed chain candidate while the same chain, when directly resolved, returns a different final set. The audit must decide whether the intended authority is top-level declaration, final explicit step, accumulated steps, target-specific output, or a documented macro abstraction.

## 12. Quantity, Time, Labor, Material, Processing, Waste, Cost, And Quality Semantics

| Dimension | Live resolution | What it is not |
|---|---|---|
| Input quantity | Every selected input occurrence is quantity 1 | Authored recipe or workplace quantity |
| Primary output quantity | Hard-coded scalar multiplied by number of returned primary keys | Physical yield or stock mutation |
| Byproduct quantity | Same scalar applied to each returned byproduct | Authored coproduct ratio |
| Time | Hard-coded combination of step intensity, skill, tool and fuel factors | Workplace cycle time, queue duration, worker schedule |
| Labor | Monetary/abstract scalar from intensity, time and skill | Assigned workers, jobs, wages or capacity |
| Material cost | Sum of selected one-unit input values | Inventory consumption or exact bill of materials |
| Processing cost | Hard-coded intensity/tool/fuel-related scalar | Fuel item consumption or tool wear |
| Waste cost | Skill-derived monetary uplift | Generated waste item, amount, residue, cleanup or disposal |
| Quality | Averaged scalar/value basis | Persistent item grade, defect, affix or quality roll |
| Quantity factor | Skill/difficulty-derived scalar | Batch size, machine capacity or workplace throughput |
| Fuel | Request boolean penalizes `fuel_heavy` time/processing when false | Fuel identity, amount, storage or consumption |
| Missing tools | Missing-tag factor multiplies time/cost; `blocked` ignored | Tool possession, active job selection or output prevention |

The minimum skill rank is a penalty threshold, never an eligibility gate. Market-value resolution normally calls craft with tool availability unspecified and fuel true, effectively assuming sufficiency. A read-only probe with no tool tags and no fuel still returned bread, wine, and lumber. Wine consumed a broad fallback cask while returning a wine cask; lumber returned output despite an unresolved axe tag. These facts are economic behavior, not proof that physical production succeeds.

## 13. Jobs, Roles, Tiers, Progression, And Upgrades

The 58 workplaces embed 208 job occurrences across 110 IDs: 64 primary, 98 support, 32 specialist, and 14 management. Those IDs are local authored workforce vocabulary, not a validated global profession catalog. The resolver does not select an active job. It unions all jobs' tool tags, then finds the first primary job only to choose `no_output` versus `reduced_output`. Multiple-primary workplaces make even that precedence material: Garden Plots has five primaries and Vintner's Press three.

Every job's `requiredTier`, worker counts, base output, diminishing threshold/factor, minimum tool tier, and output multiplier is `{}`. All 58 maximum-worker fields are also placeholders. Consequently roles, staffing curves, tier eligibility, and per-worker output have no live numerical authority.

Twenty-one progression profiles contain five tiers each. Their labels, facility forms, ownership models, qualitative power modes, notes, unlock lists, and district/site hints are descriptive. Tier numbers, throughput, slots, labor switching, and worker capacity are placeholders; runtime selects none.

Twenty-five upgrade profiles define 116 upgrades: 21 infrastructure, 16 logistics, 28 operations, 24 quality, one safety, 12 storage, and 14 tooling. Their slots, gates, and effect multipliers remain placeholders; tier-upgrade requirement arrays are empty. Five top-level tier profiles likewise have placeholder tier numbers and no traversable `upgradesFrom`/`upgradesTo` path.

Documentation describes workplace tiers, upgrades, workforce curves, and tool penalties as economy features, while live craft ignores active tiers/upgrades/rates/quantities and never honors the computed output block. That is a material design/runtime conflict and trigger evidence, not an instruction to implement all placeholders.

## 14. Skills And Specialization

Chain primary skills use only six of 121 canonical skills:

| Primary skill | Chains |
|---|---:|
| `skill.crafting.alchemy` | 21 |
| `skill.crafting.blacksmithing` | 17 |
| `skill.crafting.carpentry` | 14 |
| `skill.crafting.cooking` | 49 |
| `skill.crafting.leatherworking` | 4 |
| `skill.crafting.weaving` | 16 |

Sixty-one processing steps across 37 chains use a skill different from the chain primary; 84 extraction steps have no skill check. Seventy-eight chains contain at least one missing or different step skill under the broader diagnostic. The conservative classification marks 54 chains as skill-ambiguous because their primary/step/linked-recipe pairing mechanically conflicts or their domain has a more specific canonical skill.

Examples include mixed crops using Cooking despite an Agriculture skill; shell lime and some masonry using Cooking with Blacksmithing steps; drinks using Carpentry with Cooking steps; medicine using Cooking with Alchemy steps; fuel using Cooking with Carpentry; and parchment combining Cooking, Blacksmithing, and Leatherworking. Planned recipes separately reference Milling, Smelting, Tanning, Basic Crafting, and other exact skills. Recipe skill remains recipe-owned; chain skill remains macro-economic unless the audit proves a correction.

External craft plausibility may inform specialization boundaries, but Gate 6 creates no skill or job. The audit should determine whether chain primary skill means commercial organizing skill, final-step skill, value-index skill, or a content error; integration should not guess from names.

## 15. Tools, Measuring, Marking, Calibration, And Inspection

The repository separates portable tool items, workplace tool tags, chain skill checks, and planned-recipe tool-item references. Planned recipes reference exact canonical tool item keys; workplace jobs use syntax-only tags. Of 100 unique workplace tags, 95 suffixes match an item key and five do not: `axe`, `cooking_pot`, `kitchen_knife`, `ladle`, and `serving_tray`. Similarity cannot create aliases.

Current measuring/inspection identities include `measuring_rod`, `compass`, `ledger`, `plumb_line`, `survey_staff`, `surveyor_kit`, `testing_thief`, `tracking_lens`, `reference_book`, `route_charts`, and `production_toolset`. Workplace tags use `measuring_rod` 18 times, `ledger` 19, `reference_book` seven, and `compass` twice; several occur once, while `plumb_line`, `surveyor_kit`, and `production_toolset` are unused. None has calibration, tolerance, inspection-result, or quality-mutation semantics.

Modern metrology supports separating an instrument, maintained reference, comparison/calibration practice, traceability, operator skill, and decision from one another. It does not authorize modern precision or equipment in repository workshops ([NIST, *Metrology*](https://www.nist.gov/metrology), G6-E29).

| Capability | Static authority | Reserved authority |
|---|---|---|
| Cutting, scraping, drilling, striking, shaping, filing, grinding, sewing, stirring | Exact item or verified capability tag | Action, condition, wear, breakage |
| Length, angle, level, plumb, mass, volume | Exact tool where present; otherwise authored capability question | Tolerance, calibration value, automatic precision |
| Marking, pattern transfer, fit comparison | Tool, pattern/template, reference, workplace practice | Flawless replication or quality roll |
| Thermal indication and timing | Missing or future exact indicator relation | Exact value, schedule, automatic control |
| Inspection | Skill, reference, light, sample, workplace practice | Defect detection and item-quality mutation |
| Calibration | Maintained comparison against a reference | Drift state, interval, certification |

## 16. Workholding, Jigs, Forms, Molds, Patterns, And Consumable Tooling

Existing durable identities include `anvil`, `hoop_anvil`, `brick_mold`, `candle_mold`, `cellar_rack`, `curing_rack`, `smoking_rack`, `pottery_wheel`, `wheel_jig`, `spindle`, `shuttle`, and `weaving_shuttle`. No canonical clamp, vise, fixture, last, form, pattern, or template tool identity was found. Upgrade prose mentions frames, jigs, and racks, but upgrades are inactive metadata. Missing names are not permission to add items.

Archaeological pottery, glassworking, metallurgical, and lapidary evidence supports forms, kiln furniture, crucibles, molds, supports, holding, drilling fixtures, and abrasive-assisted work as separate dependencies ([Historic England pottery guidance](https://historicengland.org.uk/images-books/publications/archaeological-and-historic-pottery-production-sites/heag019-pottery-production-sites/), G6-E18; [Historic England glassworking guidance](https://historicengland.org.uk/images-books/publications/glassworkingguidelines/heag259-archaeological-evidence-for-glassworking/), G6-E20; [Historic England archaeometallurgy guidance](https://historicengland.org.uk/images-books/publications/archaeometallurgy-guidelines-best-practice/heag003-archaeometallurgy-guidelines/), G6-E22; [Metropolitan Museum of Art](https://www.metmuseum.org/met-publications/cameo-appearances), G6-E26; [Groman-Yaroslavski and Bar-Yosef Mayer](https://doi.org/10.1016/j.jas.2015.03.030), G6-E27).

| Tooling class | Meaning | Authority posture |
|---|---|---|
| Bench, vise, clamp, frame, support | Durable workholding | Workplace fixture unless portability and repeated consumers justify an item |
| Jig, guide, template | Repetition/alignment aid | Separate from measuring reference and finished component |
| Pattern, last, form | Shape-transfer authority | Durable or degrading according to authored material/use |
| Mold, die | Receives or shapes material | Durable, expendable, or damaged; not automatically a product |
| Crucible, kiln furniture, refractory lining | Heat-facing consumable tooling | Not cookware, fuel, ingredient, or permanent station |
| Filter, cloth, wick, abrasive, polishing medium | Depleting process aid candidate | Not a durable tool merely because handled |
| Broken mold, worn lining, spent abrasive | Residue/recovery question | Not automatically a market byproduct |

## 17. Textile, Leather, Biological-Material, And Soft-Goods Production

Bast-fiber routes require source-authorized plant stock followed by distinct retting, separation, cleaning, and refining states; route choice changes water, energy, and effluent needs ([Angulu and Gusovius](https://doi.org/10.3390/fib12030028), G6-E01; [van der Werf and Turunen](https://doi.org/10.1016/j.indcrop.2007.05.003), G6-E02). Hallstatt evidence shows skilled preparation, hand spinning, and loom weaving as one contextual package, not universal adoption ([Natural History Museum Vienna](https://www.nhm.at/hallstatt/en/textiles/technology), G6-E03). Wool scouring adds sorting, water, grease recovery, drying, and wastewater dependencies ([UNIDO](https://www.unido.org/publications/ot/9646100), G6-E04).

Hide, leather, parchment, and glue are separate routes. Initial hide preservation and grading do not make leather ([FAO](https://www.fao.org/unfao/bodies/ccp/hs/98/w9700e.htm), G6-E05); parchment is untanned worked skin, not thin leather ([Codex Sinaiticus Project](https://www.codexsinaiticus.org/en/project/conservation_parchment.aspx), G6-E06); collagen adhesives vary with source and condition ([Schellmann](https://doi.org/10.1179/sic.2007.52.Supplement-1.55), G6-E07). Tanning adds water, containment, ventilation, drainage, dust/odor, and managed residue demands that a generic Tannery identity cannot supply alone ([World Bank Group](https://documents1.worldbank.org/curated/en/874161491555046600/pdf/114073-WP-ENGLISH-Tanning-and-Leather-Finishing-PUBLIC.pdf), G6-E08).

| Lane | Dependency-closed categorical route | Unresolved authority |
|---|---|---|
| Bast fiber | Source output → prepared stalk/fiber → separated fiber → yarn → woven/corded product | Source relation, retting owner, water and residue destinations |
| Wool | Producing fauna → fleece → sorted/scoured fiber → yarn → woven/felted/fulled product | Producing state, grease/wash-water destination, workplace closure |
| Felt | Prepared fiber → assembled mat → consolidated felt | Water, pressure/agitation, drying, tools |
| Leather | Slaughter output → preserved hide → prepared hide → tanned/cured stock → component | Source, aids, water, residue, exact recipe |
| Parchment | Suitable skin → prepared/tensioned stock → finished sheet | Suitability, frame, scraper, drying/finishing |
| Glue | Canonical collagen-bearing input → prepared adhesive stock | Source, heat, water, vessel, grade, residue |
| Bone/horn/shell/chitin/sinew/feather | Anatomical output → cleaned/stabilized stock → component | Food/material boundary, repeated consumer, collision audit |

## 18. Wood, Plant-Material, Paper, Resin, And Related Production

Green wood, seasoned stock, boards, poles, and finished components require separate states because moisture and environment affect dimensional behavior ([USDA Forest Products Laboratory](https://research.fs.usda.gov/treesearch/62261), G6-E09). Charcoal adds bounded conversion, cooling, screening, storage, and transport dependencies without authorizing a kiln design or yield ([FAO](https://www.fao.org/4/X5328e/x5328e02.htm), G6-E10). Tar and pitch terminology depends on source, process, and consistency ([Schmidt et al.](https://doi.org/10.1111/arcm.12820), G6-E11); natural resin remains distinct from gum, rosin, tar, and pitch ([MFA Boston CAMEO](https://cameo.mfa.org/wiki/Natural_resin), G6-E12).

Papermaking requires prepared fiber/rag stock, pulp or slurry, sheet formation, pressing, drying, and—where supported—sizing. Museum/conservation evidence establishes a capability sequence, not a universal regional industry ([German Museum of Technology](https://technikmuseum.berlin/en/exhibitions/permanent-exhibition/papermaking/), G6-E13; [Library of Congress](https://www.loc.gov/preservation/outreach/tops/albro/index.html), G6-E14).

| Lane | Capability package | Missing/reserved authority |
|---|---|---|
| Lumber | Sorting, splitting/hewing/sawing, seasoning, storage, marking, joinery | Source-to-stock transform, drying state, runtime deformation |
| Bent/turned wood | Prepared stock, conditional heat/moisture, form, holding | Canonical compatibility and exact tooling |
| Charcoal | Wood stock, conversion enclosure, heat/air control, cooling, storage | Fuel relation, yield, firing state |
| Resin family | Canonical exudate, collection, separation, destination | Source and resin/gum/rosin/pitch collision |
| Tar/pitch | Canonical feedstock, heat-facing enclosure/vessel, collection, storage | Technology, hazard, region |
| Paper | Fiber/rag, pulp, vat, screen, press, drying, optional sizing | Water, binder, source, workplace, recipe |
| Cordage/basketry | Flexible stock, preparation, twisting/plaiting, drying | Tool, skill, source closure |

## 19. Stone, Masonry, Lime, Clay, Ceramic, Glass, And Refractory Production

Stone, aggregate, lime, plaster, mortar, clay, ceramic, glass, and refractory materials cannot share one refinement state. Lime systems have distinct material states and substrate/compatibility requirements ([Getty Conservation Institute](https://www.getty.edu/projects/lime-mortars-plasters/), G6-E15). Aggregate production separates crushing, screening, grading, conveying, and storage; mineral cutting/crushing/grinding also creates qualitative dust hazards ([US EPA](https://www.epa.gov/sites/default/files/2020-10/documents/c11s1902.pdf), G6-E16; [US OSHA](https://www.osha.gov/silica-crystalline), G6-E17).

Pottery evidence distinguishes clay preparation, forming, drying, firing, kiln furniture, grog, and wasters ([Historic England](https://historicengland.org.uk/images-books/publications/archaeological-and-historic-pottery-production-sites/heag019-pottery-production-sites/), G6-E18). Refractory production is its own material/maintenance lane ([US EPA](https://www.epa.gov/sites/default/files/2020-10/documents/c11s05.pdf), G6-E19). Glassworking separates primary production from secondary forming and identifies batch, cullet, furnace, crucible, and annealing capabilities ([Historic England](https://historicengland.org.uk/images-books/publications/glassworkingguidelines/heag259-archaeological-evidence-for-glassworking/), G6-E20). Modern glass evidence supports only qualitative energy, water, airflow, emission, waste, and recycling dependencies ([European Commission JRC](https://doi.org/10.2791/69502), G6-E21).

| Distinction | Required relationship |
|---|---|
| Quarried stone / dressed stone / component | Source, transport, holding, cutting/dressing, inspection |
| Aggregate / graded aggregate / mortar input | Crushing, screening, grading, dust handling, storage |
| Carbonate stone / burned lime state / conditioned binder / mortar or plaster | Explicit transitions, water, heat, compatible vessel, curing context |
| Raw clay / prepared body / formed greenware / dried ware / fired ceramic | Preparation, forming, drying, kiln, fuel, waster destination |
| Ordinary ceramic / refractory ceramic | Separate source suitability, heat exposure, replacement purpose |
| Batch or glass stock / cullet / formed glass / annealed/finished glass | Batch authority, furnace, forming, annealing, recovery/reject handling |

No firing schedule, temperature, glaze formula, mortar ratio, or hazardous chemistry is supplied.

## 20. Metallurgical, Metalworking, Gem, And Lapidary Production

Archaeometallurgical evidence separates ore preparation, furnace product, bloom or metal mass, refining, casting, smithing, and diagnostic residues ([Historic England](https://historicengland.org.uk/images-books/publications/archaeometallurgy-guidelines-best-practice/heag003-archaeometallurgy-guidelines/), G6-E22). Modern non-ferrous and foundry evidence supports only categorical primary/secondary inputs, heat, airflow, water, mold, scrap, and residue distinctions ([European Commission non-ferrous BREF](https://eippcb.jrc.ec.europa.eu/reference/non-ferrous-metals-industries-0), G6-E23; [European Commission smitheries/foundries BREF](https://eippcb.jrc.ec.europa.eu/reference/smitheries-and-foundries-industry), G6-E25). Toxic-metal evidence supplies a qualitative containment/contamination warning, not operating guidance ([US OSHA](https://www.osha.gov/toxic-metals), G6-E24).

Lapidary work requires source-specific stock, holding, abrasion, drilling, polishing, and inspection. Cameo and archaeological bead evidence demonstrates specialized routes without universal tool or precision claims ([Metropolitan Museum of Art](https://www.metmuseum.org/met-publications/cameo-appearances), G6-E26; [Groman-Yaroslavski and Bar-Yosef Mayer](https://doi.org/10.1016/j.jas.2015.03.030), G6-E27). Cutting/polishing is separate from later gem treatment ([Gemological Institute of America](https://www.gia.edu/gem-treatment?lang=en), G6-E28). The rare Saugus rolling/slitting installation demonstrates a specialist semi-finished-metal route, not an ordinary default ([US National Park Service](https://www.nps.gov/places/mill.htm), G6-E38).

| Lane | Categorical sequence | Reserved boundary |
|---|---|---|
| Ferrous metallurgy | Ore stock → prepared charge materials → furnace product → consolidated/refined stock → component | Charge, temperature, alloy, weapon procedure, runtime |
| Non-ferrous metallurgy | Canonical ore/concentrate or scrap → prepared input → recovered metal/alloy → component | Chemistry, alloy ratio, hazardous treatment |
| Casting | Suitable stock → mold capability → cast blank → cleaned/finished component | Mold recipe, exact heat, failure, execution |
| Forging | Suitable stock → worked blank → shaped component → finishing | Weapon construction, heat treatment, action |
| Sheet/wire/rod/bar | Compatible stock → repeated forming/drawing/rolling → semi-finished form | Technology and scale compatibility |
| Gem/lapidary | Canonical stone → selected blank → held/abraded/drilled form → polished/set component | Treatment, conductance, precision, value mutation |
| Recovery | Identified scrap → sorted compatible stock → remelt/reuse candidate | Contamination, loss, slag/dross destination |

## 21. Food-Production Capability Synthesis

Gate 5 remains the food-state and safety authority. Gate 6 adds only tools, workplace capability, process order, environmental dependencies, and maintenance. A Millhouse, Bakehouse, Kitchen, Smokehouse, Dairy, Brewery, Presshouse, cellar, or granary does not create ingredients, safe food, recipes, lots, or spoilage behavior.

Pressing separates cleaned feedstock, liquid product, press cake/pomace, settling or filtering, and storage. Small-scale oilseed evidence supports that categorical sequence without repository recipes, equipment dimensions, yields, or food-safety transfer ([FAO](https://www.fao.org/4/v5380e/V5380E07.HTM), G6-E41).

| Workplace | Capability posture | Principal unresolved dependency |
|---|---|---|
| Millhouse | Crushing, grinding, separation, handling | Source, input precedence, intermediate, returned byproduct |
| Bakehouse/oven | Mixing, shaping, bounded fermentation where supported, baking, cooling | Fuel, tools/vessels, recipe, returned outputs |
| Kitchen | Cutting, holding, heating, vessel handling, assembly | Broad fallback, food grade, execution |
| Smokehouse | Smoke exposure, airflow, holding, fire management | Preparation, salt, fuel/smoke source, safety |
| Dairy | Collection, separation, curd handling, drainage, cool storage | Producing state, water, vessels, whey, contamination |
| Brewery | Substrate handling, vessel, fermentation space, storage | Starter, intermediate, water, residue, execution |
| Presshouse | Force, holding, collection, separation, storage | Feedstock, press type, grade, cake/pomace, maintenance |
| Cellar/granary | Protected storage capability | Lots, moisture, pests, temperature, inventory condition |

## 22. Mills, Wheels, Presses, Rotary Machinery, Pumps, Cranes, Hoists, And Material Movement

Repository identities include Millhouse, Sawmill, Vintner's Press, kilns, forges, `crane_hook`, `well_winch`, `press_screw_key`, `mill_rake`, `pottery_wheel`, `wheel_jig`, and `furnace_poker`. They are capability identities/descriptions, not an operating machinery or transmission model.

Historic mill evidence supports site-dependent water/wind power, wheels, gearing, road access, and specialist maintenance ([Historic England](https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/), G6-E30). FAO supplies qualitative distinctions among buckets, windlasses, wheels, screws, pumps, and human/animal/water/wind prime movers ([FAO](https://www.fao.org/4/ah810e/AH810E00.htm), G6-E31). Vitruvius is primary evidence for levers, pulleys, hoists, and water machinery, not universal adoption or safe construction ([Perseus Digital Library](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.02.0073%3Abook%3D10), G6-E32).

The Harwich treadwheel crane demonstrates a large framed structure, treadwheels, chain, jib, specialized siting, and maintenance ([Historic England](https://historicengland.org.uk/listing/the-list/list-entry/1017202), G6-E33). Peirce Mill demonstrates trained millwrights, variable water, shaft/gearing condition, and catastrophic mechanical failure ([US National Park Service](https://www.nps.gov/rocr/learn/historyculture/peirce-mill-history.htm), G6-E37).

| Capability | Mandatory dependencies | Scale posture |
|---|---|---|
| Hand mill/quern | Working surfaces, feed control, operator, receiver | Household/village |
| Animal mill/pump | Animal, harness, sweep/tread, transmission, site | Village/institutional |
| Watermill | Flow/head, channel/race, wheel, gearing, foundation, drainage, access | Site-bound village/institutional |
| Windmill | Exposure, rotor/sail, control structure, gearing, access | Site-bound specialist |
| Press | Lever/screw, rigid frame, platen, holding, receiver, drainage | Household/specialist |
| Rotary crusher/grinder | Prime mover, shaft, bearing, working surfaces, feed, protection | Village/institutional |
| Pump/water lift | Source, lift, prime mover, seals/valves where applicable, discharge | Portable/fixed/civic |
| Hoist/crane | Anchor/frame, rope/chain, pulley/drum, brake, clear path, inspection | Fixed/civic/strategic |
| Cart/sledge/rollers | Load platform, traction, surface, loading/storage access | Transport, not process execution |

Exact capacity, gearing, dimensions, efficiency, construction, runtime motion, and failure probability remain excluded.

## 23. Heat, Fuel, Water, Airflow, Drainage, Drying, Cooling, And Environmental Control

Environmental control is a dependency network, not the request's `fuelAvailable` boolean. Textile and leather routes can create significant water/effluent demands ([van der Werf and Turunen](https://doi.org/10.1016/j.indcrop.2007.05.003), G6-E02; [UNIDO](https://www.unido.org/publications/ot/9646100), G6-E04; [World Bank tanning guidance](https://documents1.worldbank.org/curated/en/874161491555046600/pdf/114073-WP-ENGLISH-Tanning-and-Leather-Finishing-PUBLIC.pdf), G6-E08). Wood seasoning depends on moisture and environment; charcoal adds heat, smoke, cooling, and protected storage ([USDA](https://research.fs.usda.gov/treesearch/62261), G6-E09; [FAO](https://www.fao.org/4/X5328e/x5328e02.htm), G6-E10).

Mineral, refractory, glass, and metal lanes add dust, intense heat, ventilation, water, and residue pressures ([US EPA crushed stone](https://www.epa.gov/sites/default/files/2020-10/documents/c11s1902.pdf), G6-E16; [US OSHA silica](https://www.osha.gov/silica-crystalline), G6-E17; [US EPA refractory](https://www.epa.gov/sites/default/files/2020-10/documents/c11s05.pdf), G6-E19; [European Commission glass](https://doi.org/10.2791/69502), G6-E21; [European Commission non-ferrous](https://eippcb.jrc.ec.europa.eu/reference/non-ferrous-metals-industries-0), G6-E23; [European Commission foundries](https://eippcb.jrc.ec.europa.eu/reference/smitheries-and-foundries-industry), G6-E25). General official guidance supports keeping air, water, energy, wastewater, hazardous material, waste, structural, and fire needs separate ([IFC/World Bank Group](https://www.ifc.org/en/insights-reports/general-environmental-health-and-safety-guidelines), G6-E36).

| Demand | Mundane owner | Failure questions |
|---|---|---|
| Heat/ignition | Fuel stock, hearth/oven/kiln/furnace, refractory, operator | Insufficient/runaway/uneven heat, fumes, fire |
| Draft/airflow | Bellows, openings, flue, chimney, fan, natural wind | Backdraft, smoke/dust spread, overcooling |
| Water supply | Source, well/cistern, channel, vessel, transport | Depletion, contamination, interruption |
| Movement/lifting | Gravity, bucket, pump, wheel, animal/human power | Leakage, backflow, flood, failure |
| Drainage | Slope, channel, sump, outlet, maintenance | Blockage, contaminated discharge, erosion |
| Drying | Rack, spacing, shelter, heat/airflow, storage | Mold, cracking, distortion, fire |
| Cooling | Shade, cellar, water, evaporation, seasonal ice, insulation | Condensation, cold damage, false safety |
| Humidity | Ventilation, heat, desiccant, condensing surface | Overdrying, corrosion, swelling, mold |
| Smoke/dust removal | Hood, flue, vent, separation, cleaning | Exposure, ignition, environmental spread |

No workplace field currently owns clean/process water, airflow, ventilation, drainage, cooling, humidity, temperature, waste containment, environmental capacity, or condition. Building descriptions may signal context but are not craft preconditions.

## 24. Human, Animal, Water, Wind, Fuel, And Bounded Magical Energy

Historic evidence supports multiple prime movers and equally strong site, transmission, scale, and maintenance limits ([Historic England mills](https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/), G6-E30; [FAO water lifting](https://www.fao.org/4/ah810e/AH810E00.htm), G6-E31; [Vitruvius Book X](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.02.0073%3Abook%3D10), G6-E32).

| Energy source | Compatible posture | Constraints |
|---|---|---|
| Human | Portable tools, treadle, crank, short lift | Fatigue, workforce, duty cycle, skill |
| Animal | Traction, sweep, tread, haul | Feed, housing, harness, path, care, intermittency |
| Water | Fixed rotary/lifting works | Flow, head, season, channel, flood, maintenance |
| Wind | Mill, ventilation, sail, drying | Exposure, intermittency, storm, control |
| Fuel heat | Hearth, oven, kiln, furnace | Feedstock, storage, airflow, smoke, ash, fire |
| Stored mechanics | Counterweight, tension, bounded smoothing | Containment, release, fatigue, inspection |
| Bounded magic | Indication, transfer, stabilization, or assistance only if Gate 7 proves it | Capacity, recharge, vessel, housing, failure, scarcity, access |

Progression metadata lists manual 44, animal 16, water 3, wind 2, steam 2, and hybrid 38 tier modes, but no tier is selected and no source/transmission owner exists. Steam remains an unresolved specialist technology question. Magic cannot be a generic prime mover, create matter, erase fuel, replace transmission, or guarantee quality.

## 25. Workplace Layout, Scale, Institutional Support, And Regional Variation

All 58 workplaces have compatible building coverage across 22 building records. Buildings own placeability, infrastructure hints, water/coast/river/route constraints, and eight aggregate storage profiles in seven buildings; craft checks none. Five service records exist, but there is no workplace-service assignment or runtime service gate. Region/settlement records do not instantiate active workplaces for craft; market states price every market item at every settlement.

Industrial-heritage principles support treating a production site as a linked system of buildings, machinery, power, circulation, skills, storage, and maintenance rather than one station name ([ICOMOS–TICCIH Dublin Principles](https://ticcih.org/about/about-ticcih/dublin-principles/), G6-E35).

| Capability band | Posture | Gate 6 compatibility question |
|---|---|---|
| 1. Household/subsistence | Portable tools, shared hearth, small stores | Can the lane operate without dedicated machinery? |
| 2. Village/ordinary town | Fixed bench, oven, kiln, mill, press | Are input, maintenance, and waste routes locally supportable? |
| 3. Urban specialist | Dedicated zones, skilled roles, controlled storage | Does repeated demand justify fixtures and aids? |
| 4. Guild/temple/academy/military/estate/major merchant | Linked workplaces, security, maintenance staff | Is institutional access explicitly authored? |
| 5. Elite/strategic/capital | High-throughput infrastructure, imports, guarded stores | Are transport, fuel, water, and ownership explicit? |
| 6. Rare/exceptional/relic/legendary | Scarce or nonreplicable capability | Does ordinary production remain viable without it? |

A dependency-closed site distinguishes receiving, dirty preparation, clean/precision work, active process, heat/fire, cooling/drying, finishing, inspection, storage, aids, waste, drainage, ventilation, security, and maintenance access as applicable.

Hallstatt textiles, Fabriano paper, English pottery/metal sites, mills, and the Harwich crane illustrate contextual packages, not repository placements ([Hallstatt](https://www.nhm.at/hallstatt/en/textiles/technology), G6-E03; [Fabriano](https://www.loc.gov/preservation/outreach/tops/albro/index.html), G6-E14; [pottery](https://historicengland.org.uk/images-books/publications/archaeological-and-historic-pottery-production-sites/heag019-pottery-production-sites/), G6-E18; [archaeometallurgy](https://historicengland.org.uk/images-books/publications/archaeometallurgy-guidelines-best-practice/heag003-archaeometallurgy-guidelines/), G6-E22; [mills](https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/), G6-E30; [crane](https://historicengland.org.uk/listing/the-list/list-entry/1017202), G6-E33). Live regional material, fuel, water, wind, climate, transport, trade, and settlement evidence must control any later placement.

## 26. Maintenance, Calibration, Repair, Replacement, And Service Boundaries

The live resolver has no wear, calibration, maintenance, repair, replacement, downtime, or facility-condition state. `fuel_tool_wear` is an explanation label around fixed cost math, not tool wear.

Lubrication evidence supports bearing/axle wear, contamination, corrosion, cleaning, and compatible-maintenance dependencies ([Canadian Conservation Institute](https://www.canada.ca/en/conservation-institute/services/conservation-preservation-publications/canadian-conservation-institute-notes/lubrication-industrial-collections.html), G6-E34). Broader industrial collections evidence treats machinery, shelter, records, deterioration, and maintenance practice as one care system ([Canadian Conservation Institute](https://www.canada.ca/en/conservation-institute/services/care-objects/industrial-collections.html), G6-E40). Peirce Mill shows trained maintainers, variable water, and shaft condition determining operability ([US National Park Service](https://www.nps.gov/rocr/learn/historyculture/peirce-mill-history.htm), G6-E37).

| Need | Static expression | Runtime reservation |
|---|---|---|
| Sharpening/dressing | Capability or service relation | Edge condition and action |
| Alignment/calibration | Reference, tool, maintenance note | Drift, tolerance, interval |
| Lubrication | Compatible aid and dependency | Consumption, contamination, wear |
| Cleaning/drain clearing | Workplace requirement | Scheduling, labor, blockage |
| Re-facing working surfaces | Specialist maintenance | Surface condition, quality effect |
| Re-lining heat equipment | Refractory replacement relation | Wear, thermal history, shutdown |
| Re-tensioning loom/rope/belt/frame | Maintenance capability | Persistent tension, failure |
| Handles/ropes/seals/molds/bearings | Spare component or service | Inventory use, downtime |
| Structure/channel/machine repair | Skill, material, access, service | Damage state, execution |

A service is not a spare part; a spare is not an automatically consumed process aid. No durability mechanic is authorized.

## 27. Losses, Offcuts, Scrap, Slag, Ash, Wastewater, Recovery, And Catalog-Noise Filter

Physical loss, economic waste cost, chain byproduct, returned output, reusable offcut, scrap, slag, ash, dust, wastewater, spent bath, broken mold, worn refractory, and hazardous residue require separate dispositions. Modern regulatory evidence reinforces that recycling, byproduct, and waste are not interchangeable, without transferring a legal classification into canon ([US EPA](https://www.epa.gov/hw/frequent-questions-related-hazardous-waste-recycling-definition-solid-waste-and-other-exemptions), G6-E39).

Lane evidence identifies tanning residues ([World Bank Group](https://documents1.worldbank.org/curated/en/874161491555046600/pdf/114073-WP-ENGLISH-Tanning-and-Leather-Finishing-PUBLIC.pdf), G6-E08), mineral dust ([US EPA](https://www.epa.gov/sites/default/files/2020-10/documents/c11s1902.pdf), G6-E16), refractory waste ([US EPA](https://www.epa.gov/sites/default/files/2020-10/documents/c11s05.pdf), G6-E19), glass cullet/furnace waste ([European Commission JRC](https://doi.org/10.2791/69502), G6-E21), and metal scrap/slag/dross/contaminated streams ([European Commission non-ferrous](https://eippcb.jrc.ec.europa.eu/reference/non-ferrous-metals-industries-0), G6-E23; [European Commission foundries](https://eippcb.jrc.ec.europa.eu/reference/smitheries-and-foundries-industry), G6-E25). General guidance supports separate wastewater, hazardous-material, and ordinary-waste owners ([IFC/World Bank Group](https://www.ifc.org/en/insights-reports/general-environmental-health-and-safety-guidelines), G6-E36).

| Catalog-noise filter | Required question |
|---|---|
| Canonical source | Is the producing material/process established? |
| Repeated consumer | Does an accepted chain/recipe consume it? |
| Stable identity | Is it consistent enough to merit an item? |
| Hazard | Does recovery require specialist containment or excluded procedure? |
| Market | Is value supported beyond one byproduct list? |
| Food/feed | Is suitability explicit? |
| Recovery | Can it re-enter a compatible route without erasing contamination/loss? |
| Gameplay | Does it support trade, scarcity, recognition, consequence? |
| Runtime | Is mutable cleanup/condition approved? |

Current `waste` is monetary uplift, not a residue. Byproducts are output candidates with hard-coded shares. Name-based catalog expansion is rejected.

## 28. Recipe Abstraction And Revised 0.6.5 Implications

| Authority | May own | Must not become |
|---|---|---|
| Production chain | Macro topology, variants, economic I/O, stages, cost/value posture | Exact player recipe or item transfer |
| Workplace | Capability, jobs, tags, broad I/O, progression/upgrades | Proof every field is selected/enforced |
| Planned recipe | Exact static inputs/outputs/integer quantities, tools, workplace, skill, optional chain link | Executable crafting or chain inheritance |
| Runtime economy | Economic fallback, variant selection, costs, time, quantity/quality factors | Physical crafting executor |
| Future craft runtime | Commands, eligibility, queue, resource consumption, output creation, state | Authorized by this gate |

All 12 planned recipes are complete and non-inheriting. Their exact quantities, exact item keys, tool item keys, workplace, skill, family, and link remain recipe-owned. A chain link must not import fallback inputs, variants, quantities, output sets, tools, jobs, tiers, fuel, waste, cost, or skill.

Revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` remains blocked. Before it can safely select final relationships, the audit must decide or explicitly quarantine precedence, stage closure, last-output omission, tag/item mapping, active job/tier semantics, ineffective `no_output`, skill attribution, and value/market coupling. Gate 6 does not broaden `0.6.5` into a runtime correction.

## 29. Technology Compatibility Without A Century Label

Capability is evaluated by canonical material, tool material/repairability, workholding, measurement/precision, prime mover/transmission, heat/fuel, water/air/drainage, transport/storage, maintenance, workforce, institution, environment, waste, and failure—not a date.

The corpus spans household hand work, Hallstatt textiles, Fabriano paper, archaeological pottery/metallurgy, water/wind mills, ancient lifting descriptions, a treadwheel crane, and a rare rolling/slitting mill ([Hallstatt](https://www.nhm.at/hallstatt/en/textiles/technology), G6-E03; [Fabriano](https://www.loc.gov/preservation/outreach/tops/albro/index.html), G6-E14; [pottery](https://historicengland.org.uk/images-books/publications/archaeological-and-historic-pottery-production-sites/heag019-pottery-production-sites/), G6-E18; [archaeometallurgy](https://historicengland.org.uk/images-books/publications/archaeometallurgy-guidelines-best-practice/heag003-archaeometallurgy-guidelines/), G6-E22; [mills](https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/), G6-E30; [water lifting](https://www.fao.org/4/ah810e/AH810E00.htm), G6-E31; [Vitruvius](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.02.0073%3Abook%3D10), G6-E32; [crane](https://historicengland.org.uk/listing/the-list/list-entry/1017202), G6-E33; [Saugus mill](https://www.nps.gov/places/mill.htm), G6-E38). This proves variation and institutional cost, not universal availability.

The six scale bands in Section 25 provide compatibility vocabulary. Current `techLevel`, `facilityForm`, `ownershipModel`, `wealthBand`, and `powerMode` are partial qualitative hints on a minority of workplaces, not runtime proof. A process is compatible only if its full dependency package fits an authored region/institution. Historical existence never establishes affordability, portability, throughput, precision, safety, or ordinary access.

## 30. Magic Interaction Classification

Ordinary production is `mundane_only` until a later authority proves otherwise. Gate 7 may investigate `mundane_baseline_magic_assisted`, `parallel_magical_specialty`, or `magic_equivalent_institutional` routes. `magic_exclusive` requires explicit canon and cannot be inferred from a physical demand. Any route implying free matter, unlimited energy, perfect measurement/quality/containment, automatic maintenance/repair, universal purification/sterilization, or bypassed source/tool/skill/infrastructure/scarcity is `unstable_or_prohibited`.

Gate 7 must separately classify creation, extraction, movement, concentration, conversion, transfer, storage, release, stabilization, measurement, warning, and containment. Water does not mean creation; fire does not mean fuel-free industrial heat; wind does not mean unlimited motive power; thunder does not establish a grid; stone/earth does not create building matter; ice does not guarantee preservation; light does not sterilize; darkness does not remove heat or matter.

Every affinity, combination, vessel, deployment, and service route below is an unresolved research question. No row canonizes a capability. Scale uses household, village/town, urban specialist, institutional, and strategic postures; continuity is stated separately. Maintenance/recharge, scarcity/access, and the mundane fallback are retained in every row.

#### Gate 7 Physical-Demand Matrix

| Production lane | Workplace or infrastructure | Physical demand | Mundane baseline | Scale / continuity | Matter, energy, information posture | Candidate single affinity | Candidate combination | Vessel / deployment | Required mundane housing | Principal hazard; maintenance/access/baseline | Exact Gate 7 question |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Food, dye, ceramic, glass, metal | Hearth, oven, kiln, furnace | Heat input | Fuel, firebox/hearth, operator | Household–institutional; batch/continuous | Matter consumed; energy converted/transferred | fire — potentially applicable | fire+wind; fire+water; fire+ice | Cluster unresolved; fixed/institutional | Refractory, insulation, fuel path, draft, exhaust | Fire/fumes/shock; lining/flue and finite recharge; ordinary fuel retained | Can finite heat transfer without erasing fuel, housing, loss, or visible failure? |
| Hot process, cooling, storage | Cooling surface, quench/cooling area | Heat removal | Air/water contact, spacing, shade | Household–institutional; batch/sustained | Matter/energy transferred; condition stabilized | water, ice, wind — potentially applicable | water+ice; ice+wind; fire+ice | Crystal/cluster unresolved; fixed | Reservoir/air path, drains, resistant vessel | Steam/cracking/condensation; drain/vessel service; heat sink retained | Where is removed heat released or stored, at what finite capacity? |
| All fuel-heated lanes, expedition | Protected ignition point | Ignition | Ember, flame, tinder, fuel | Household–institutional; intermittent | Matter consumed; energy converted/transferred | fire — potentially applicable | thunder+conductive material — combination-only | Shard/crystal unresolved; portable/fixed | Fuel isolation, protected point | Flash/fire spread; testing/recharge; ordinary ignition retained | Can ignition be supplied without continuing heat or fuel bypass? |
| Kiln, oven, vat, store | Controlled enclosure | Temperature maintenance | Fuel regulation, insulation, watch | Household–institutional; sustained | Energy transferred/stored; condition stabilized | fire, ice, neutral — unresolved | fire+wind; fire+ice; water+ice | Crystal/cluster unresolved; fixed | Insulation, seals, indicator, exhaust/drain | Runaway/overshoot; calibration/recharge; mundane control retained | Can a bounded condition be stabilized with finite energy and visible failure? |
| Kiln, forge, food/store | Inspection point | Thermal indication | Observation, witness material, reference | Household–institutional; periodic/continuous | Information supplied | light, neutral — indirect or control-only | neutral+any; light+darkness | Shard/crystal unresolved; portable/fixed | Protected sensor/view | Drift/glare; reference checks/recharge; ordinary inspection retained | Does canon support indication only, and with what accuracy/failure state? |
| Agriculture, food, textile, leather, civic | Well, cistern, channel | Water supply | Existing source, vessel, carrier | Household–strategic; intermittent/continuous | Existing matter transferred | water — potentially applicable | water+stone/earth | Cluster unresolved; fixed/civic | Source, channel, cistern, seals | Depletion/leak/contamination; channel service; source retained | Can existing water move without creating water, and what source constrains it? |
| Mills, washing, irrigation, drainage | Sluice, channel, pump | Water movement | Gravity, sluice, bucket, pump | Village–strategic; sustained | Matter/energy transferred | water, wind — potentially applicable | water+wind; water+stone/earth | Cluster unresolved; fixed/civic | Channel, pipe, valve, embankment | Flood/erosion/backflow; clearing/seals; mundane conveyance retained | What finite flow/head and transmission loss can canon support? |
| Mine, well, irrigation, civic | Windlass, wheel, pump | Water lifting | Bucket, windlass, wheel, screw, pump | Household–strategic; cyclic/continuous | Matter moved; energy converted/transferred | water, wind, thunder — unresolved | water+stone/earth; thunder+conductive material | Cluster unresolved; fixed/civic | Shaft, frame, pump, conduit, discharge | Fall/rupture/flood; rope/bearing/seal service; lift retained | Can finite lift occur without created water or unlimited work? |
| Tannery, dyehouse, mine, cellar | Floor drain, ditch, sump | Drainage | Grade, ditch, drain, sump/pump | Household–strategic; standby/sustained | Matter transferred; condition stabilized | water, stone/earth — indirect or control-only | water+stone/earth | Crystal/cluster unresolved; fixed/civic | Slope, channel, sump, outlet | Backflow/dirty discharge; clearing/recharge; physical outlet retained | Can magic assist movement/warning while an ordinary outlet remains mandatory? |
| Food, dairy, paper, civic water | Filter/settling station | Purification | Segregation, settling, screening, filtering, bounded heat | Household–institutional; batch | Matter transferred/consumed; information supplied | water, light — indirect or control-only | water+stone/earth; neutral+any | Crystal/cluster unresolved; fixed | Filter, vessel, waste outlet | False assurance/concentrated residue; filter/recharge; ordinary treatment retained | Which specified contaminant can be detected or separated, and what cannot? |
| Grain, ore, clay, pulp, oil, wool, scrap | Sorting/screening/press line | Separation | Sorting, sieve, settling, filter, press | Household–institutional; batch/continuous | Matter transferred; energy converted; information supplied | water, wind, stone/earth — potentially applicable | water+wind; neutral+any | Crystal/cluster unresolved; fixed | Screens, bins, channels, receivers | Cross-mixing/dust/loss; media/alignment service; mechanical baseline retained | Which separation principle is supported and where do rejects/coproducts go? |
| Press, forge, glass, paper, oil, pumping | Press/bellows/pump | Pressure | Lever/screw, bellows, piston, weights | Village–institutional; cyclic | Energy converted/transferred/stored | stone/earth, thunder — unresolved | fire+water; neutral+any | Cluster unresolved; fixed | Frame, seals, vessel, relief path | Rupture/crush/release; frame/seal inspection; mechanical press retained | Can bounded pressure be generated or regulated without unsafe containment assumptions? |
| Food, dye, sanitation, motive research | Managed heated-water vessel | Steam | Existing water plus heat and vent | Village–institutional; batch/continuous | Matter transferred; energy converted/transferred | No single affinity — inappropriate | fire+water — combination-only | Cluster unresolved; fixed/institutional | Heat-resistant vessel, vent, drain | Burn/pressure/rupture; vessel/vent service; ordinary heat/water retained | Can fire+water support bounded vapor without a pressure-vessel shortcut? |
| Textile, leather, paper, wood, storage | Humidifying space | Humidity addition | Wetting, mist, vapor, enclosure | Household–institutional; intermittent/sustained | Matter/energy transferred; condition stabilized | water — potentially applicable | fire+water; water+wind | Crystal/cluster unresolved; fixed | Existing water, vessel, airflow, drain | Mold/swelling/condensation; cleaning/recharge; water retained | Can existing water be dispersed at controlled scale without creation? |
| Drying room, store, archive | Vent/dry/cold surface | Humidity removal | Ventilation, heat, desiccant, condensation | Household–institutional; sustained | Matter/energy transferred; condition stabilized | wind, ice, fire — potentially applicable | water+ice; ice+wind; fire+wind | Crystal/cluster unresolved; fixed | Air path, drain, insulation, collector | Overdrying/frost/displaced water; service/recharge; mundane drying retained | Where do removed water and transferred heat go? |
| Recovery, cooling, storage | Condensing surface | Condensation | Cool surface, cover, drain | Village–institutional; batch/sustained | Matter/energy transferred | ice, water — potentially applicable | water+ice; fire+ice | Crystal/cluster unresolved; fixed | Surface, seals, drain, receiver | Contamination/corrosion/shock; surface/drain service; condenser retained | Can a bounded gradient conserve mass and expose failure? |
| Salt, dye, paper, food, clay | Pan/rack/drying area | Evaporation | Surface, heat, airflow | Household–institutional; batch/sustained | Matter transferred; energy converted/transferred | fire, wind — potentially applicable | fire+wind; water+wind | Crystal/cluster unresolved; fixed | Pan/rack, air path, exhaust | Concentration/humidity/fire; surface/exhaust service; baseline retained | Can evaporation accelerate without deleting water or heat cost? |
| Heated, dusty, wet, drying lanes | Duct, fan, bellows | Airflow | Openings, fan, bellows, duct | Household–institutional; intermittent/continuous | Matter/energy transferred | wind — potentially applicable | wind+stone/earth; water+wind | Shard/cluster unresolved; portable/fixed | Duct, opening, fan housing | Dust/fire spread/overcool; duct/fan service; passive/mechanical air retained | What bounded flow and pressure can wind support through mundane ducts? |
| Forge, furnace, kiln, oven | Flue/chimney/tuyere | Draft | Chimney, flue, bellows, stack effect | Village–institutional; continuous during firing | Matter/energy transferred; condition stabilized | wind — potentially applicable | fire+wind | Cluster unresolved; fixed | Flue, tuyere, chimney, refractory | Backdraft/runaway/fumes; flue service; chimney retained | Can wind regulate draft without unlimited heat or bypassed flue design? |
| Tannery, dyehouse, mine, forge, store | Vents/shafts/ducts | Ventilation | Openings, shafts, ducts | Household–strategic; sustained/standby | Matter/energy transferred; condition stabilized | wind — potentially applicable | wind+stone/earth | Cluster unresolved; fixed/civic | Ducts, shafts, weather protection | Contaminant/fire spread; clearing/recharge; designed path retained | Can magic assist, rather than replace, designed ventilation? |
| Hearth, kiln, furnace, smokehouse | Hood/flue/chimney | Smoke removal | Hood, chimney, roof vent | Household–institutional; sustained | Matter/energy transferred | wind — potentially applicable | fire+wind; wind+stone/earth | Cluster unresolved; fixed | Fire-resistant hood/flue/chimney | Backflow/sparks/exposure; soot service; physical exhaust retained | Can smoke move without hiding combustion hazards or spreading fire? |
| Textile, leather, wood, paper, clay, food | Rack/tenter/drying room | Drying | Rack, shed, sun, airflow, controlled heat | Household–institutional; batch/seasonal | Matter/energy transferred; condition stabilized | wind, fire, ice — potentially applicable | fire+wind; water+wind; ice+wind | Crystal/cluster unresolved; fixed | Rack, shelter, spacing, air/drain path | Crack/mold/fire; rack/airway service; ordinary drying retained | Can drying be controlled without exact schedules, perfect quality, or zero loss? |
| Food, storage, metal, glass, medicine transport | Cellar/cooling area | Cooling | Shade, cellar, water, evaporation, seasonal ice | Household–institutional; batch/sustained | Energy transferred/stored; condition stabilized | ice, water, wind — potentially applicable | water+ice; ice+wind; fire+ice | Crystal/cluster unresolved; portable/fixed | Insulation, seals, drainage, heat sink | Condensation/damage/false safety; insulation/recharge; mundane cooling retained | What finite cold budget and heat sink constrain cooling? |
| Storage and conditional food/medicine lanes | Icehouse/cold store | Freezing | Seasonal cold, ice, exposed cold store | Village–institutional; seasonal/batch | Energy transferred/stored; condition stabilized | ice — potentially applicable | water+ice | Crystal/cluster unresolved; fixed/institutional | Insulation, drainage, expansion-safe vessel | Freeze damage/false preservation; thaw planning/recharge; seasonal baseline retained | Does canon support phase change at bounded mass and energy cost? |
| Food, medicine, frozen material | Controlled warming area | Thawing | Ambient warming, water contact, bounded heat | Household–institutional; batch | Energy transferred; condition stabilized | fire, water — indirect or control-only | fire+ice; fire+water | Crystal unresolved; portable/fixed | Drain, receiver, thermal indication | Uneven thaw/contamination/shock; vessel/recharge; mundane thaw retained | Can thawing be moderated without erasing prior spoilage or damage? |
| Every workshop, store, route | Lamp/daylight point | Illumination | Daylight, lamp, candle, torch | Household–strategic; intermittent/sustained | Energy converted/transferred; information supplied | light — potentially applicable | light+darkness | Shard/crystal unresolved; portable/fixed/civic | Mount, shade, conduit or fuel | Glare/shadow/fire/false color; cleaning/recharge; ordinary light retained | Can bounded illumination exist without heat, sterilization, or infinite duration? |
| Mills, cranes, transport, civic, security | Beacon/bell/flag route | Signaling | Flag, bell, beacon, smoke, runner | Household–strategic; intermittent/standby | Energy transferred; information supplied | light, thunder, wind — potentially applicable | light+darkness; thunder+conductive material | Shard/crystal unresolved; portable/fixed | Sightline or resonator/conductor, code, operator | False/intercepted signal; testing/recharge; ordinary signals retained | What information, range, capacity, and failure state are supported? |
| All production/maintenance/storage | Inspection bench | Inspection | Light, gauge, template, witness sample | Household–institutional; periodic | Information supplied | light, neutral — potentially applicable | light+darkness; neutral+any | Shard/crystal unresolved; portable/fixed | Stable mount, clean view, maintained reference | False negative/drift/glare; reference/recharge; ordinary inspection retained | Does an affinity reveal only observable properties, and how is accuracy checked? |
| Mills, pumps, presses, saws, hoists | Prime mover/transmission | Motive force | Human/animal, waterwheel, windmill, crank, treadle | Village–strategic; cyclic/continuous | Energy converted/transferred/stored | wind, water, thunder — unresolved | water+wind; thunder+conductive material; neutral+any | Cluster unresolved; fixed/institutional | Wheel, shaft, gearing, bearing, transmission | Overspeed/entanglement/failure; bearing/recharge; mundane mover retained | Can finite work be delivered without unlimited power or a grid inference? |
| Quarry, dock, mine, construction, warehouse | Hoist/crane | Lifting | Lever, pulley, tackle, capstan, treadwheel | Household–strategic; cyclic | Energy converted/transferred/stored | wind, thunder, stone/earth — unresolved | thunder+conductive material; neutral+any | Crystal/cluster unresolved; portable/fixed | Frame, rope/chain, brake, anchor, clear path | Dropped load/crush; rope/frame/recharge; ordinary lifting retained | What mass, height, duty cycle, and safe failure limit can canon support? |
| Shaping, drilling, assembly, finishing | Bench/fixture | Holding | Clamp, vise, jig, weight, frame | Household–institutional; task-sustained | Energy stored; condition stabilized | stone/earth, neutral — potentially applicable | neutral+any | Shard/crystal unresolved; portable/fixed | Bench, frame, contact pads, release | Crush/trap/release; fixture/recharge; mechanical holding retained | Can finite force include a safe release while mundane fixtures remain? |
| Masonry, carpentry, millwright, metal, loom | Reference/guide | Alignment | Line, square, level, plumb, jig | Household–institutional; periodic/continuous | Condition stabilized; information supplied | neutral, light, stone/earth — potentially applicable | light+darkness; neutral+any | Shard/crystal unresolved; portable/fixed | Reference surface, mount, sightline | Drift/false reference; calibration/recharge; ordinary guides retained | Against what maintained reference is alignment indicated or stabilized? |
| Ore, grain, clay, machinery, finishing | Vibrating/tamping/rotary frame | Vibration | Hammer, sieve motion, tamping, balanced rotation | Village–institutional; cyclic | Energy converted/transferred; condition stabilized | thunder — unresolved | thunder+conductive material; neutral+any | Crystal/cluster unresolved; fixed | Frame, isolation, fasteners, containment | Fatigue/loosening/dust; balance/recharge; mechanical source retained | Can bounded vibration be delivered or damped without structural/operator harm? |
| Ore, aggregate, grain, clay, fiber, waste | Crusher/mill/press | Crushing or compaction | Hammer, quern, millstone, roller, press, rammer | Household–institutional; batch/continuous | Energy converted/transferred | stone/earth, thunder, water, wind — unresolved | water+stone/earth; wind+stone/earth | Cluster unresolved; fixed | Bed, frame, drive, guards, dust path | Ejection/dust/overload; wear/recharge; mechanical crusher retained | Can force transfer assist without creating material or eliminating wear? |
| Kiln, mill, crane, channel, mine, store | Foundation/retaining work | Structural stabilization | Foundation, brace, tie, anchor, drainage | Village–strategic; continuous | Energy stored; condition stabilized | stone/earth, neutral — potentially applicable | water+stone/earth; wind+stone/earth; neutral+any | Cluster unresolved; fixed/civic | Foundation, frame, anchors, drainage | Hidden overload/erosion; inspection/recharge; sound structure retained | What visible, safe failure occurs when assistance ends? |
| Hot/liquid/granular/waste/storage lanes | Vessel/bin/wall | Containment | Vessel, crucible, mold, barrel, wall | Household–strategic; batch/sustained | Matter transferred; energy stored; condition stabilized | stone/earth, neutral — potentially applicable | neutral+any | Crystal/cluster unresolved; portable/fixed | Compatible vessel, seals, lining, vent/drain | Leak/rupture/incompatibility; seal/recharge; physical containment retained | What substance, force, and duration can be imperfectly contained? |
| Food, dairy, leather, textile, medicine, civic | Wash/cleaning area | Sanitation | Cleaning, segregated water, heat, drying, waste removal | Household–institutional; repeated | Matter/energy transferred/consumed; condition stabilized | water, fire, light — indirect or control-only | fire+water | Crystal/cluster unresolved; portable/fixed | Water, washable surface, drain, waste route | False sterilization/cross-contamination; cleaning/recharge; sanitation retained | Can magic assist washing/heat while explicitly not guaranteeing sterilization? |
| Food, water, dye, metal, medicine, store | Sampling/record point | Contamination warning | Inspection, records, witness sample, segregated lot | Household–institutional; periodic/standby | Information supplied | light, neutral — potentially applicable | light+darkness; neutral+any | Shard/crystal unresolved; portable/fixed | Sample interface, indicator, reference, record | False assurance/missed hazard; test/recharge; ordinary testing retained | Which specified property can be warned about, and what remains invisible? |
| Agriculture, mills, shipping, drying, expedition | Observation/signal station | Weather warning | Observation, vane, cloud watch, record, messenger | Village–strategic; continuous watch/standby | Information supplied | wind, water, thunder, light — unresolved | water+wind; neutral+any | Shard/crystal unresolved; portable/civic | Exposure point, reference, signal route | False alarm/missed storm; test/recharge; human watch retained | Can bounded local conditions be indicated without perfect prediction? |
| Trade, transport, civic routes, expedition | Map/beacon/pilot station | Navigation | Landmark, map, maintained direction reference, pilot | Household–strategic; intermittent/continuous | Information supplied | light, wind, water, neutral — unresolved | light+darkness; neutral+any | Shard/crystal unresolved; portable/fixed beacon | Map/reference, mount, sightline | Drift/interference/misdirection; reference/recharge; pilot retained | What observable reference, range, and failure mode are supported? |
| Production coordination, civic, transport, security | Message/relay route | Communication | Messenger, record, bell code, flag, beacon | Household–strategic; intermittent/standby | Energy transferred; information supplied | light, thunder, wind, neutral — unresolved | thunder+conductive material; light+darkness; neutral+any | Shard/crystal/cluster unresolved; portable/fixed | Encoding, operator, relay, conductor or sightline | Interception/distortion/false attribution; testing/recharge; messages retained | Does canon permit transmission, signaling only, or neither, at what capacity? |
| Store, workshop, civic, expedition, security | Boundary/guard point | Warding | Guard, lock, seal, wall, watch, procedure | Household–strategic; continuous/standby | Energy stored; condition stabilized; information supplied | neutral, light, darkness, stone/earth — unresolved | neutral+any; light+darkness | Crystal/cluster unresolved; fixed/institutional | Boundary, anchor, access rule, alarm route | False security/lockout/hidden failure; inspection/recharge; guards retained | Which canonical ward function exists, what boundary, and what bypass? |
| Tool, material, food, medicine, record stock | Store/vault | Secure storage | Lock, vault, seal, inventory, guard, suitable environment | Household–strategic; continuous | Energy stored; condition stabilized; information supplied | stone/earth, darkness, light, neutral — unresolved | light+darkness; neutral+any | Crystal/cluster unresolved; fixed/institutional | Walls, lock, seal, shelving, ventilation, drainage | Theft/concealed hazard/false condition; inventory/recharge; custody retained | Can magic supplement warning/access without replacing the store and custody chain? |

### Required multi-affinity question register

| Combination | Gate 7 question | Conservation and safety constraint |
|---|---|---|
| fire + water | Can finite heat enter existing water for vapor, humidity, washing, thermal transfer, cooking, sanitation, or motive assistance? | No water creation, free heat, or pressure shortcut; account for condensate, pressure, burns |
| fire + wind | Can bounded airflow regulate combustion, forced-air heat, drying, or smoke? | No unlimited furnace; account for sparks, spread, fumes, draft failure |
| water + wind | Can existing water/air support mist, cooling, irrigation, or assisted drying? | Preserve water mass; account for humidity, drift, contamination |
| water + ice | Can existing water act as finite cold store/cooling medium? | Account for heat extraction, meltwater, condensation, freeze damage |
| ice + wind | Can cold air circulate or frost distribution be moderated? | Account for condensation, icing, overdrying, injury |
| fire + ice | Can opposed finite transfers stabilize a thermal gradient? | Account for loss, shock, condensation; no effortless equilibrium |
| water + stone/earth | Can existing water move through pumps, channels, drains, or slurry works? | No created water/stone; account for pressure, erosion, blockage, loading |
| wind + stone/earth | Can airflow use fixed ducts for ventilation or dust movement? | Account for erosion, redistributed dust, structural load, transmission loss |
| thunder + conductive material | Can canonical thunder support bounded signaling, indication, ignition, or motive research? | No modern grid; require containment, shock/fire analysis, grounding analogue |
| light + darkness | Can contrast support illumination, glare control, signaling, inspection, concealment boundaries, or ward indication? | Darkness is not cooling/removal; light is not sterilization |
| neutral + any affinity | Can neutral regulate, buffer, attune, stabilize, or expose mismatch? | First prove neutral authority; preserve loss, finite capacity, vessel compatibility |

#### Affinity Coverage Register

Every cell is a Gate 7 research posture, not a capability. The full allowed status vocabulary is used without forcing utility.

| Affinity | Production | Agriculture | Food | Storage | Transport | Civic infrastructure | Expedition support | Combat-adjacent use | Medicine | Communication | Security |
|---|---|---|---|---|---|---|---|---|---|---|---|
| neutral | combination-only — regulation | combination-only — condition control | combination-only — stabilization | potentially applicable — condition/ward control | combination-only — transmission control | combination-only — service regulation | unresolved — adaptable vessel | indirect or control-only — shared-vessel demand | combination-only — indication, not healing | combination-only — relay/control | unresolved — ward/mismatch indication |
| light | potentially applicable — illumination/inspection | indirect or control-only — inspection/signal | indirect or control-only — inspection, not sanitation | potentially applicable — alarm/inspection | potentially applicable — beacon/navigation | potentially applicable — light/signal | potentially applicable — light/navigation | indirect or control-only — shared illumination | indirect or control-only — inspection, not cure | potentially applicable — visual signal | potentially applicable — alarm/ward indication |
| water | potentially applicable — existing-water movement | potentially applicable — irrigation, no creation | potentially applicable — washing/thermal transfer | indirect or control-only — humidity/response | potentially applicable — channel/cargo condition | potentially applicable — supply/drainage | potentially applicable — water handling | indirect or control-only — shared supply/recharge | indirect or control-only — washing/cooling, not cure | combination-only — hydraulic signal | combination-only — containment/response |
| wind | potentially applicable — airflow/draft | potentially applicable — drying/weather indication | potentially applicable — drying/ventilation | potentially applicable — ventilation | unresolved — sail/motive | potentially applicable — ventilation/smoke | potentially applicable — airflow/weather | indirect or control-only — shared airflow | indirect or control-only — ventilation | unresolved — sound/signal carriage | indirect or control-only — warning |
| ice | potentially applicable — heat removal | indirect or control-only — frost warning/control | potentially applicable — cooling, no safety guarantee | potentially applicable — cold holding | potentially applicable — bounded cold cargo | indirect or control-only — seasonal service | potentially applicable — food/medicine case | inappropriate — no combat redesign | potentially applicable — cold case, not treatment | inappropriate — no supported communication role | indirect or control-only — cold-condition warning |
| darkness | indirect or control-only — glare/exclusion | inappropriate — no authored demand | inappropriate — no food-safety role | indirect or control-only — light exclusion | indirect or control-only — concealment boundary | indirect or control-only — glare balance | indirect or control-only — concealment with navigation cost | indirect or control-only — shared scarcity | inappropriate — no treatment claim | combination-only — contrast signal | unresolved — concealment/ward boundary |
| fire | potentially applicable — heat/ignition | indirect or control-only — bounded heat/dry | potentially applicable — cooking, no sanitation guarantee | indirect or control-only — frost response/fire risk | indirect or control-only — beacon/warmth | potentially applicable — heat/light service | potentially applicable — warmth/light | indirect or control-only — shared fuel/recharge | indirect or control-only — heat, not cure | potentially applicable — beacon | indirect or control-only — alarm/fire risk |
| stone/earth | potentially applicable — holding/structure | potentially applicable — channel/compaction | indirect or control-only — hearth/store structure | potentially applicable — cellar/vault | potentially applicable — road/anchor support | potentially applicable — foundation/drainage | indirect or control-only — shelter/anchor | indirect or control-only — shared fortification | indirect or control-only — stable housing | indirect or control-only — fixed relay | potentially applicable — barrier/vault anchor |
| thunder | unresolved — motive/ignition/measurement | indirect or control-only — weather/motive research | indirect or control-only — indication/ignition hazard | indirect or control-only — alarm | unresolved — motive/signal | canonically unsupported — no grid authority | unresolved — signal | indirect or control-only — shared scarcity, no combat redesign | indirect or control-only — indication/shock | unresolved — transmission/signal | unresolved — contained alarm |

Validation of the handoff: all 43 required demand categories, all nine canonical affinity rows, all 11 domain columns, and all 11 required combinations appear. Matter creation and unlimited energy are rejected. Workshop, civic, institutional, expedition, and combat-adjacent routes remain distinct; no combat magic is redesigned and no magical capability is canonical.

## 31. Content Candidate And Authority Matrix

Every row is conditional. None directly authorizes a record, alias, correction, schema, validator, test, runtime change, or implementation.

| # | candidate | classification | proposed authority | gameplay value | confidence | disposition | dependencies | blockers | relevant later route | audit-trigger relevance |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | Preserve exact, complete, non-inheriting recipe transforms | `authored_input_required` | `crafting.recipes` | critical | high | accept | accepted recipe decisions/schema | revised recipe authoring blocked | audit → integration → `0.6.5` | Direct: recipe fields cannot come from fallback |
| 2 | Preserve chain `recipeProfile` as macro economic topology | `lore_or_description_only` | production chains plus runtime economy | critical | high | accept | current consumers | resolver meaning disputed | focused audit | Direct: live economic consumer |
| 3 | Correct documentation that implies active tiers/workforce/tool blocking | `factual_correction` | README/data dictionary/authority docs | high | high | correct | audit conclusion | precise intended semantics unknown | focused audit | Trigger 2 |
| 4 | Reconcile chain/workplace loader types with validated JSON | `schema_or_validator_precondition` | loader/contracts/validator owners | high | high | correct | exact field-authority decision | runtime compatibility | focused audit | Triggers 2, 3, 5 |
| 5 | Enforce or explicitly waive declared-stage completeness | `schema_or_validator_precondition` | chain validation | high | high | verify | 17 missing declarations classified | content-versus-validator intent | focused audit | Triggers 1, 4, 5 |
| 6 | Define accumulated versus last-step returned-output authority | `runtime_owner_required` | runtime economy | critical | high | verify | declared/step output reconciliation | 62 omissions/17 chains | focused audit | Triggers 1, 3, 4, 6 |
| 7 | Resolve generic requested primary versus default variant | `factual_correction` | chain/runtime owner | high | high | verify | intended generic/variant contract | 11 conflicts | focused audit | Triggers 1, 4, 5 |
| 8 | Decide when variant input may override explicit input | `authored_input_required` | chain/runtime contract | high | high | verify | six affected food rows | recipe/value consequences | focused audit | Triggers 1, 3, 5 |
| 9 | Map workplace tool tags to exact tool items, if intended | `schema_or_validator_precondition` + `authored_input_required` | workplace/item relationship | high | high | collision-audit | exact identity, repeated consumer | five unmatched suffixes; alias guessing forbidden | focused audit → integration | Triggers 1, 3 |
| 10 | Select active job and tier semantics | `runtime_owner_required` | future production/economy runtime | critical | high | reserve | authored numeric fields and policy | all values placeholders | focused audit → later runtime | Triggers 1, 2, 3 |
| 11 | Make `no_output` truthful or rename/redefine it | `factual_correction` + `runtime_owner_required` | runtime economy | critical | high | correct | intended penalty contract/tests | `blocked` ignored | focused audit | Triggers 1, 2, 4, 5 |
| 12 | Decide authority of numeric workplace I/O values | `authored_input_required` | workplace versus recipe decision | high | high | verify | 18 numeric entries reviewed | runtime ignores them | focused audit → integration | Triggers 1, 3 |
| 13 | Derive exact recipe quantities from current chain/workplace fallback | `conflicts_with_canon` | none | negative | high | reject | none | chain has no quantity authority | all later routes | Prevents unsafe `0.6.5` shortcut |
| 14 | Reconcile chain, step, workplace, and recipe skills | `authored_input_required` | respective static owners | high | high | verify | canonical skill meanings | 54 ambiguous chains | focused audit → integration | Triggers 1, 3, 4 |
| 15 | Add explicit fuel/material relationships where gameplay-relevant | `missing_static_relationship` + `runtime_owner_required` | items/chains/recipes plus later runtime | high | medium | defer | canonical fuel, quantities, workplace | boolean-only behavior; no owner | audit → integration → later runtime | Triggers 1, 3 |
| 16 | Treat progression `powerMode` as active production capacity | `runtime_owner_required` | future facility runtime | medium | high | reject | active tier/power infrastructure | no selection/state; placeholders | focused audit → later runtime | Trigger 2 |
| 17 | Maintenance, calibration, repair, wear, replacement state | `runtime_owner_required` + `optional_depth` | later production runtime | medium | high | reserve | approved gameplay loop, items/services | no present owner | later runtime | Not for `0.6.5`; supports field boundaries |
| 18 | Conditional clamp/vise/form/pattern/last identities | `missing_static_identity` + `optional_depth` | item or workplace fixture owner | medium | medium | collision-audit | repeated consumers, portability, values | catalog-growth/noise risk | integration | Not independently triggering |
| 19 | Exact measuring/reference/calibration relationships | `missing_static_relationship` | tools/workplaces/skills | medium | medium | defer | reference and inspection design | no quality owner | integration → later runtime | Field-authority relevance |
| 20 | Nine workplaces absent from chain stages | `missing_static_relationship` | chains/workplace/source abstraction | medium | high | verify | intent per extraction lane | may be intentionally separate | focused audit → integration | Trigger 4 candidate |
| 21 | Thirty possible chain factual defects | `factual_correction` | chain/runtime/validator as classified | high | medium | verify | exact blame and consumer review | shared fallback obscures source | focused audit | Triggers 4, 6 |
| 22 | Conditional offcut/scrap/residue identities | `missing_static_identity` + `optional_depth` | item/material authority | low | medium | collision-audit | source, stable state, repeated consumer/value | catalog noise/hazard | integration | Not automatic trigger |
| 23 | Exhaustive tools, fixtures, residues, and waste catalogs | `rejected_complexity` | none | negative | high | reject | none | low value and duplication | integration | Prevents scope growth |
| 24 | Assign technology by century label | `conflicts_with_canon` | none | negative | high | reject | none | capability varies by dependencies | integration | Avoids false classification |
| 25 | Gate 7 elemental demand research | `authored_input_required` | Gate 7 research artifact | high | high | defer | accepted production audit | Gate 7 blocked | Gate 7 | Audit must precede it |
| 26 | Free matter/energy, perfect quality, universal purification | `conflicts_with_canon` | none | negative | high | reject | none | violates ordinary baseline/guardrails | Gate 7 | Prevents magic bypass |
| 27 | Physical work orders, inventory transfer, batch/lot state | `runtime_owner_required` | future crafting/production engine | critical | high | reserve | approved command/state/schema design | absent today | later runtime | Separates audit from implementation |
| 28 | Region-specific workplace/industry placement | `authored_input_required` + `missing_static_relationship` | world/settlement/economy authority | medium | medium | defer | canonical material/site/trade evidence | no active placement owner | integration | Prevents generic placement |
| 29 | Focused branch tests for fallback/variant/stage/tool/tier/fuel/output | `schema_or_validator_precondition` | audit-owned tests | critical | high | promote | chosen intended behavior | current five tests insufficient | focused audit | Trigger 5 |
| 30 | Keep integration from discovering resolver authority inline | `runtime_owner_required` | coordination/audit route | critical | high | accept | accepted audit artifact | audit not yet run | focused audit | Trigger 6 |

## 32. Audit Trigger Condition Matrix

| condition | live evidence | affected consumers | resolved or unresolved | rationale | implication |
|---|---|---|---|---|---|
| 1. Multiple recipes/material/food chains depend on uncertain fallback, output, quantity, skill, tool, job, tier, fuel, waste, or cost | 116 F; 11 R covering 12 recipes; 11 G; 17 O; 121 J; 54 S; 94 E | craft, values, markets, transport, integration | unresolved | Documentation of behavior does not establish intent | Audit required |
| 2. Design documentation materially conflicts with live consumers | Ordered/carry-forward/tier/workforce/tool-penalty descriptions conflict with skipped stages, no carry, ignored profiles, ineffective block | developers, integration, runtime consumers | unresolved | Material authority claims overstate implementation | Audit required |
| 3. Revised `0.6.5` cannot select authoritative/descriptive/fallback/runtime-derived fields | 15 of 18 proposed rows lack named-chain inputs and no chain has authoritative quantities; field matrices show mixed posture | recipe selection, items, chain/workplace integration | unresolved | Static authoring would otherwise guess | Audit required |
| 4. A factual defect affects multiple recipes or downstream materials | Shared smelter/workplace fallback affects 11 ingot lanes and iron/component/hammer recipe lanes; stage/output issues recur | recipes, values, markets, materials | unresolved | Exact blame—content, runtime, validator, docs—needs focus | Audit required |
| 5. Current tests do not isolate behavior needed to distinguish abstraction from accidental coupling | Five runtime tests omit precedence, variants, stage closure, job/tier, block, quantities, fuel identity, output carry | runtime, market, transport regressions | unresolved | Passing broad tests are not branch proof | Audit required |
| 6. Integration would otherwise discover/adjudicate live resolver while synthesizing seven domains | All 121 require audit; every domain produces candidates touching shared resolver authority | cross-domain integration | unresolved | Combining investigation and synthesis risks corruption/drift | Audit required before Gate 7/integration |

## 33. Audit Skip Criterion Matrix

| criterion | required proof | evidence found | passed or failed | rationale |
|---|---|---|---|---|
| 1. Exact recipe authority separable from every live chain/workplace consumer | Non-inheritance plus proof live consumers cannot affect candidate selection/value/market | Static recipes are separate, but linked chains/workplaces still drive values, markets, and classification | failed | Separation is only partial |
| 2. Every relevant resolver semantic documented and focused-tested | Branch-specific contract and tests for all relevant paths | Field behavior reproduced; decisive branches untested and docs conflict | failed | Observation is not intended-contract proof |
| 3. No multi-recipe factual correction pending | Complete proof no shared defect crosses recipe/material lanes | Shared metal, food, stage, tool, and output candidates remain | failed | Precise disposition is pending |
| 4. Integration can classify every candidate without more repository investigation | Complete authoritative field/consumer mapping with no unresolved blame | 121 chains require focused audit; mixed fields remain | failed | Integration would have to investigate |
| 5. Complete skip rationale recorded | All four earlier criteria affirmatively pass and rationale is recorded | Trigger evidence instead | failed | “All” cannot be weakened; criteria 1–4 fail |

## 34. Final Audit-Trigger Decision

`AUDIT_TRIGGERED`

All six trigger conditions remain unresolved and all five skip criteria fail. Any one unresolved trigger or any one failed skip criterion is sufficient. The focused audit must classify intended authority, reconcile documentation/types/runtime/tests, and decide narrow corrections or quarantines before cross-domain synthesis. Gate 6 does not perform that audit.

Expected artifact: `docs/dev/tmp-production-chain-workplace-runtime-authority-audit-2026-07-15.md`.

Next route: `CODEX-AUDIT.production-chain-workplace-runtime-authority`.

Gate 7 and revised `0.6.5` remain blocked until the audit is accepted.

## 35. Uncertainty And Confidence

### High confidence

Counts, record shapes, validation behavior, loader drift, resolver precedence, output/cost behavior, ignored placeholders, ineffective blocking, live call sites, recipe non-inheritance, and focused test gaps were directly reproduced at the fixed commit.

### Medium confidence

Whether the nine chain-unreferenced workplaces are intentional abstractions; whether five unmatched tool tags need aliases, corrected identities, or deliberate generic tags; whether high-tier `steam` is intended canon; and which of the 30 possible defects belongs to content versus runtime.

### Low or unresolved

The intended active job/tier policy; exact workplace-tag/item mapping; intended byproduct/intermediate carry; physical fuel/environment/capacity ownership; and the desired compatibility posture for changing public economic behavior.

### Source cautions

Modern industrial/safety sources supply qualitative dependency and hazard evidence only. Archaeological, museum, conservation, and historic-site evidence is contextual. No source proves universal adoption, precise scale, a region placement, repository identity, or an executable procedure.

### Repository claims requiring later verification

The audit must re-run every affected resolver branch, verify the one shadowed market path, decide candidate-role behavior, confirm type/loader intent, and review documentation claims against the selected correction.

### Issues reserved for the audit

Precedence; missing stages; returned-output closure; variant/generic behavior; chain/workplace field authority; tag/item mapping; job/tier selection; `no_output`; skill attribution; fuel/value coupling; focused tests; and narrow documentation/type corrections.

### Issues deferred to Gate 7

All affinity capability, vessel, service, recharge, capacity, combination, institutional access, scarcity, failure, and substitution questions from Section 30.

### Issues reserved for integration

Cross-domain candidate promotion, canonical identities/relationships, regional placement, collision audits, catalog-noise rejection, final revised recipe scope, and temporary-artifact cleanup disposition.

### Later runtime ownership

Physical execution, inventory mutation, worker/job assignment, workplace instance/tier/upgrades, capacity, queues, time, fuel consumption, energy, quality, wear, maintenance, repair, waste generation, lot/batch state, persistence, UI, and saves.

## 36. Integration Disposition

- **accept** exact recipe/chain/workplace/economy separation, ordinary production baseline, source/material/state distinctions, and the binary trigger.
- **verify** all chain/workplace field meanings, shared factual candidates, unreferenced workplaces, and tag/item relations through the focused audit.
- **correct** only audit-proven documentation, type, validation, content, test, or runtime mismatches in separately authorized scope.
- **promote** focused tests and durable authority decisions after the audit proves intended behavior.
- **defer** Gate 7 magic research, regional placements, optional identities, and revised `0.6.5` authoring until prerequisites are accepted.
- **reject** chain-derived recipe quantities, name-based aliases, century labels, exhaustive low-value catalogs, free matter/energy, and magic bypass.
- **collision-audit** every conditional item, tool, fixture, residue, byproduct, skill, source, workplace, and regional relationship before promotion.
- **reserve** execution, inventory, batch, workplace state, capacity, maintenance, quality, waste, persistence, UI, and save behavior for later runtime owners.

Next route: `CODEX-AUDIT.production-chain-workplace-runtime-authority`.

The audit must land and its artifact be accepted before `GPT-DR.magitech.production-infrastructure-substitution`. Cross-domain integration must require all seven accepted research artifacts plus the accepted audit artifact. It must not absorb the audit itself.

## 37. Sources

### Repository source register

| Source | Findings supported |
|---|---|
| [README](https://github.com/vagabond1215/Lineage_Reforged/blob/master/README.md) | Project and economy feature claims |
| [Current GPT handoff](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-gpt-handoff.md) | Gate route and accepted state |
| [Current Codex output](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-output.md) | Fixed launch evidence |
| [Active integration hold](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-prompt.md) | Later integration scope |
| [Queued integration hold](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/queued-cross-domain-production-research-integration-prompt.md) | Byte-identical later scope |
| [Research program](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md) | Seven-gate boundaries |
| [Audit trigger](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/production-chain-workplace-runtime-authority-audit-trigger.md) | Six trigger conditions and five skip criteria |
| [0.6.5 reconciliation](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/0.6.5-research-prerequisite-and-recipe-authority-reconciliation.md) | Blocked recipe/static-content prerequisite |
| [Crafting authority decision](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/crafting-authority-boundary-decision.md) | Chain/workplace/recipe/runtime separation |
| [Recipe/production schema decision](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/recipe-and-production-schema-decision.md) | Recipe non-inheritance |
| [Economy authority boundary](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/economy-authority-boundary-decision.md) | Price/value/transformation ownership |
| [Economy data dictionary](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/data-dictionary/economy.md) | Documented tier/workforce/tool posture |
| [Gate 1 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md) | Source/extraction continuity |
| [Gate 2 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md) | Ecology/biological-source continuity |
| [Gate 3 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md) | Agriculture/land/livestock continuity |
| [Gate 4 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-materials-refinement-processing-research-2026-07-14.md) | Material/refinement continuity |
| [Gate 5 artifact](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/tmp-food-processing-preservation-research-2026-07-14.md) | Food/state/storage continuity |
| [Items](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/items.json) | Item/tool/material identities and catalog noise |
| [Market values](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/market_item_values.json) | Canonical value coverage |
| [Production chains](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/production_chains.json) | All 121 chain records and nested fields |
| [Workplaces](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/workplaces.json) | All 58 workplace records and nested fields |
| [Planned recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/crafting/recipes.json) | Twelve exact bounded transforms |
| [Skills](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/skills.json) | Canonical skill vocabulary |
| [Buildings](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/buildings.json) | Workplace coverage/infrastructure/storage context |
| [Settlements](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/settlements.json) | Settlement/spatial context |
| [Regions](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regions.json) | Regional identities |
| [Regional ecology](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regional_ecology_profiles.json) | Material/climate/import context |
| [Flora](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/flora.json) | Plant source/output authority |
| [Fauna](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/fauna.json) | Animal source/output authority |
| [Monsters](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/monsters.json) | Exceptional biological-output context |
| [Knowledge snippets](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/knowledge_snippets.json) | Lore-only boundary |
| [Magic infrastructure](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/magic_infrastructure.json) | Existing bounded service metadata |
| [Crystal catalog](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/crystal_catalog.json) | Canonical affinities/vessel identities |
| [Content loader](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/content.ts) | Runtime record types and raw JSON loading |
| [Runtime economy](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/runtime-economy.ts) | Resolver precedence, cost, output, value, and market behavior |
| [Simulation consistency](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/simulation-consistency.ts) | Static production-source/cycle/reference checks |
| [Transport runtime](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/transport-runtime.ts) | Downstream price use |
| [Civilization public index](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/index.ts) | Public economic surface/tick path |
| [Shared contracts](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/shared/types/src/contracts.ts) | Public production/value result contracts |
| [Workplace schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/civilization/workplace.schema.json) | Workplace structural authority |
| [Recipe schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/crafting/recipe.schema.json) | Exact static recipe shape |
| [Content lint](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/index.mjs) | Chain/workplace semantic validation |
| [Recipe validator](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/crafting-recipes.mjs) | Exact recipe refs/non-inheritance |
| [Settlement-economy validator](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/settlement-economies.mjs) | Chain/workplace cross-references |
| [Commodity validator](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tools/content-lint/commodities.mjs) | Related-chain references |
| [Runtime-economy tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-runtime-economy.test.mjs) | Existing five-test coverage |
| [Recipe tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/crafting-recipes-validation.test.mjs) | Static recipe shape/ref coverage |
| [Consistency tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-system-consistency.test.mjs) | Aggregate consistency coverage |

### External source register

The external corpus contains exactly 41 works: 1 A1, 5 A2, 27 B1, and 8 B2.

| ID | Title; author/organization | Class | Direct link | Supported findings | Transferability limitation |
|---|---|:---:|---|---|---|
| G6-E01 | *Retting of Bast Fiber Crops Like Hemp and Flax*; Angulu and Gusovius | A2 | https://doi.org/10.3390/fib12030028 | Retting, separation, cleaning, refining | Modern review; no historical duration, yield, recipe |
| G6-E02 | *Environmental Impacts of Hemp and Flax Textile Yarn*; van der Werf and Turunen | A2 | https://doi.org/10.1016/j.indcrop.2007.05.003 | Route-specific water, energy, effluent | Modern life-cycle comparison |
| G6-E03 | *Hallstatt Textile Technology*; Natural History Museum Vienna | B2 | https://www.nhm.at/hallstatt/en/textiles/technology | Preparation, spinning, loom weaving, skill | Hallstatt-specific |
| G6-E04 | *Survey of Argentine Wool Scouring Methods*; UNIDO | B1 | https://www.unido.org/publications/ot/9646100 | Sorting, scouring, grease recovery, drying, effluent | Modern industrial survey |
| G6-E05 | *Hides and Skins Sector Guidance*; FAO | B1 | https://www.fao.org/unfao/bodies/ccp/hs/98/w9700e.htm | Initial preservation, handling, grading | Development guidance; no tanning formula |
| G6-E06 | *Parchment Conservation*; Codex Sinaiticus Project | B2 | https://www.codexsinaiticus.org/en/project/conservation_parchment.aspx | Parchment as untanned worked skin | Manuscript-grade context |
| G6-E07 | *Animal Glues: A Review of Their Key Properties Relevant to Conservation*; Nanke Schellmann | A2 | https://doi.org/10.1179/sic.2007.52.Supplement-1.55 | Source-dependent collagen adhesives | Conservation focus; no extraction procedure |
| G6-E08 | *Environmental, Health, and Safety Guidelines for Tanning and Leather Finishing*; World Bank Group | B1 | https://documents1.worldbank.org/curated/en/874161491555046600/pdf/114073-WP-ENGLISH-Tanning-and-Leather-Finishing-PUBLIC.pdf | Water, effluent, dust, odor, containment, residues | Modern industrial safety analogue |
| G6-E09 | *Wood Handbook*, chapter 13; USDA Forest Products Laboratory | B1 | https://research.fs.usda.gov/treesearch/62261 | Seasoning, moisture, humidity, dimensional stability | Modern engineering; no schedule |
| G6-E10 | *Charcoal Making and Logistics*; FAO | B1 | https://www.fao.org/4/X5328e/x5328e02.htm | Conversion, cooling, screening, storage, transport | No temperature, yield, kiln prescription |
| G6-E11 | *Birch-Tar Terminology and Production*; Schmidt et al. | A2 | https://doi.org/10.1111/arcm.12820 | Tar/pitch source and consistency distinctions | Birch-focused experimental archaeology |
| G6-E12 | *Natural Resin*; MFA Boston CAMEO | B2 | https://cameo.mfa.org/wiki/Natural_resin | Resin/gum/rosin/tar/pitch distinction | Conservation glossary |
| G6-E13 | *Papermaking*; German Museum of Technology | B2 | https://technikmuseum.berlin/en/exhibitions/permanent-exhibition/papermaking/ | Pulp, sheet forming, pressing, drying | Museum overview |
| G6-E14 | *Papermaking at Fabriano*; Library of Congress | B2 | https://www.loc.gov/preservation/outreach/tops/albro/index.html | Rag preparation, stamping, forming, pressing, sizing | Renaissance Italian specialist context |
| G6-E15 | *Lime Mortars and Plasters*; Getty Conservation Institute | B2 | https://www.getty.edu/projects/lime-mortars-plasters/ | Lime states, substrate, compatibility | Conservation context; no formula |
| G6-E16 | *AP-42: Crushed Stone Processing and Pulverized Mineral Processing*; US EPA | B1 | https://www.epa.gov/sites/default/files/2020-10/documents/c11s1902.pdf | Crushing, screening, grading, conveying, dust | Modern industrial scale |
| G6-E17 | *Crystalline Silica*; US OSHA | B1 | https://www.osha.gov/silica-crystalline | Cutting/crushing/grinding dust hazard | Modern safety analogue |
| G6-E18 | *Archaeological and Historic Pottery Production Sites*; Historic England | B1 | https://historicengland.org.uk/images-books/publications/archaeological-and-historic-pottery-production-sites/heag019-pottery-production-sites/ | Clay preparation, forming, drying, kilns, furniture, grog, wasters | English archaeological scope |
| G6-E19 | *AP-42: Refractory Manufacturing*; US EPA | B1 | https://www.epa.gov/sites/default/files/2020-10/documents/c11s05.pdf | Refractory function, preparation, forming, firing, residues | Modern materials may be incompatible |
| G6-E20 | *Archaeological Evidence for Glassworking*; Historic England | B1 | https://historicengland.org.uk/images-books/publications/glassworkingguidelines/heag259-archaeological-evidence-for-glassworking/ | Primary/secondary glass, cullet, furnaces, crucibles, annealing | British archaeological chronology |
| G6-E21 | *BAT Reference Document for the Manufacture of Glass*; European Commission JRC | B1 | https://doi.org/10.2791/69502 | Energy, water, airflow, emissions, waste, recycling | Modern large installations |
| G6-E22 | *Archaeometallurgy: Guidelines for Best Practice*; Historic England | B1 | https://historicengland.org.uk/images-books/publications/archaeometallurgy-guidelines-best-practice/heag003-archaeometallurgy-guidelines/ | Ore preparation, refining, casting, smithing, residues | Varies by ore, site, chronology |
| G6-E23 | *Non-Ferrous Metals Industries BREF*; European Commission JRC | B1 | https://eippcb.jrc.ec.europa.eu/reference/non-ferrous-metals-industries-0 | Primary/secondary routes, heat, air, water, residues | Modern industrial scope |
| G6-E24 | *Toxic Metals*; US OSHA | B1 | https://www.osha.gov/toxic-metals | Qualitative toxic-metal/contamination hazards | Modern safety analogue |
| G6-E25 | *Smitheries and Foundries Industry BREF*; European Commission JRC | B1 | https://eippcb.jrc.ec.europa.eu/reference/smitheries-and-foundries-industry | Forge/foundry distinction, molds, heat, ventilation, scrap, waste | Modern large-scale context |
| G6-E26 | *Cameo Appearances*; James David Draper, Metropolitan Museum of Art | B2 | https://www.metmuseum.org/met-publications/cameo-appearances | Hardstone holding, drilling, abrasion, engraving, mounting | Cameo tradition |
| G6-E27 | *Lapidary Technology of Carnelian Beads*; Groman-Yaroslavski and Bar-Yosef Mayer | A2 | https://doi.org/10.1016/j.jas.2015.03.030 | Multi-stage abrasion, drilling, tumbling, inspection | One archaeological context |
| G6-E28 | *Introduction to Gem Treatments*; Gemological Institute of America | B2 | https://www.gia.edu/gem-treatment?lang=en | Cutting/polishing versus later treatment | Modern gem trade |
| G6-E29 | *Metrology*; NIST | B1 | https://www.nist.gov/metrology | Measurement, reference, calibration, traceability | Modern precision system |
| G6-E30 | *Mills: Introductions to Heritage Assets*; Historic England | B1 | https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/ | Water/wind siting, wheel, gearing, access | English evidence |
| G6-E31 | *Water Lifting Devices*; P. L. Fraenkel, FAO | B1 | https://www.fao.org/4/ah810e/AH810E00.htm | Pumps, wheels, transmission, prime movers, maintenance | Includes later technology; taxonomy only |
| G6-E32 | *The Ten Books on Architecture*, Book X; Vitruvius | A1 | https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.02.0073%3Abook%3D10 | Primary evidence for levers, hoists, water machinery | Ancient text; not universal adoption |
| G6-E33 | *Harwich Treadwheel Crane*, NHLE 1017202; Historic England | B1 | https://historicengland.org.uk/listing/the-list/list-entry/1017202 | Treadwheel crane, frame, chain, jib, siting | Exceptional English survivor |
| G6-E34 | *Lubrication for Industrial Collections*; Canadian Conservation Institute | B1 | https://www.canada.ca/en/conservation-institute/services/conservation-preservation-publications/canadian-conservation-institute-notes/lubrication-industrial-collections.html | Bearing wear, lubrication, contamination, corrosion | Museum setting/modern lubricants |
| G6-E35 | *Joint ICOMOS–TICCIH Principles for the Conservation of Industrial Heritage* | B1 | https://ticcih.org/about/about-ticcih/dublin-principles/ | Workplaces as linked systems | Conservation doctrine |
| G6-E36 | *General Environmental, Health, and Safety Guidelines*; IFC/World Bank Group | B1 | https://www.ifc.org/en/insights-reports/general-environmental-health-and-safety-guidelines | Air, water, energy, wastewater, waste, structure, fire | Modern framework |
| G6-E37 | *History of Peirce Mill*; US National Park Service | B1 | https://www.nps.gov/rocr/learn/historyculture/peirce-mill-history.htm | Water, gearing, millwright skill, failure | US mill history |
| G6-E38 | *Rolling and Slitting Mill*; US National Park Service | B1 | https://www.nps.gov/places/mill.htm | Water-powered rolling/slitting, reheating, semi-finished stock | Rare specialist installation |
| G6-E39 | *Frequent Questions Related to Hazardous Waste Recycling*; US EPA | B1 | https://www.epa.gov/hw/frequent-questions-related-hazardous-waste-recycling-definition-solid-waste-and-other-exemptions | Scrap, slag, dross, sludge, recoverability | US regulatory analogy |
| G6-E40 | *Industrial Collections*; Canadian Conservation Institute | B1 | https://www.canada.ca/en/conservation-institute/services/care-objects/industrial-collections.html | Machinery storage, shelter, documentation, maintenance | Museum care |
| G6-E41 | *Small-Scale Oilseed Processing*; FAO | B1 | https://www.fao.org/4/v5380e/V5380E07.HTM | Cleaning, pressing, settling/filtering, storage, press cake | No dimensions, yields, food-safety transfer |
