# Production-Chain And Workplace Runtime-Authority Audit

Run: `CODEX-AUDIT.production-chain-workplace-runtime-authority`

Date: 2026-07-15

Status: completed repository-grounded, documentation-only audit; no implementation permission

## 1. Audit Result

The audit reproduces the Gate 6 inventory and confirms that production chains and workplaces have live macro-economic consumers, but do not own bounded recipe ratios or physical production. All 121 chains are directly resolvable. Their declared outputs, variants, primary skills, step hints, workplace profiles, and runtime-derived cost factors can affect item-value candidates, settlement price views, trade opportunities, transport repricing, consistency reports, and public explanation state. Settlement and institution projections receive the broader market state but currently consume stock/storage context rather than chain-derived prices. No chain or workplace consumes inventory, creates an item instance, selects a worker or active job, selects an active tier or installed upgrade, consumes a fuel item, runs a queue, or persists a batch.

The live data reproduces 121 chains, 58 workplaces, and 12 planned recipes across eight families. The chains contain 322 declared stages and 311 processing steps: 227 workplace steps and 84 extraction steps. Nineteen steps have explicit inputs and 292 are empty; 132 have explicit outputs and 179 are empty. Twenty-eight chains contain 162 variants. The audit reproduced 17 stage declarations without a step across six chains, 11 generic-primary/default-variant conflicts, six variant-input overrides of nonempty explicit inputs, and 17 non-variant chains that omit 62 declared output occurrences because only the final step supplies returned outputs. All 12 live recipes differ from their linked chain's default resolution in input set, output set, or quantity.

The decisive discrepancies are not limited to prose. The value index has 916 declared candidate entries across 435 item keys; 48 candidate entries do not return their indexed target even when that chain and target are requested. Candidate role is recorded but ignored during value choice, the cheapest calculated candidate wins, and associated labor skill comes from the first candidate instead. These branches propagate to settlement market prices and downstream consumers. The workplace resolver unions tool tags across all jobs, uses the first primary job's penalty mode, calculates `blocked` for `no_output`, then discards that state. Numeric workplace I/O, cycle, worker, tier, progression, upgrade, and power data do not participate in craft resolution. Loader types omit validated fields and misrepresent live workplace I/O and processing-cost shapes.

No narrow correction is required before the revised static `0.6.5` package, because every material discrepancy can be isolated through recipe-owned explicit fields, non-inheritance, and an explicit ban on using disputed resolver results for recipe admission or authoring. This is conditional, not an endorsement of the live resolver. Integration must quarantine the disputed fields, define later documentation/type/validator/test/content/runtime work, and reverse this decision if it makes revised `0.6.5` depend on chain-derived quantities, inputs, outputs, tools, workplace I/O, value, or candidate selection. After this artifact is accepted, the next executable route is `GPT-DR.magitech.production-infrastructure-substitution`.

No content JSON, schema, validator, test, runtime, economy, market, transport, UI, save, migration, dependency, asset, generated output, or gameplay behavior changed.

## 2. Method, Authority, And Scope Boundary

The audit used the required authority order: live behavior; schemas, validators, and semantic lint; live content; focused assertions; approved design decisions; current coordination; accepted Gates 1-6; then explicit audit inference. It inspected all 121 production-chain records, all 58 workplace records, all 12 live recipes, the relevant item/value/tool/skill/building/settlement/resource/commodity/extraction/infrastructure catalogs, all direct engine consumers, public contracts, semantic validators, and focused tests.

Read-only probes exercised all chains and every indexed output candidate. They covered explicit targets, declared primaries and byproducts, variant primaries and byproducts, invalid variants, invalid targets, generic targets, multiple candidates, input and output fallback branches, stage closure, final-step closure, recipe comparisons, skill levels, tool/fuel flags, value selection, and local price propagation. The probe source was temporary, was never staged, and is not part of this artifact's authority. Probe results were reconciled against code rather than treated as intended behavior.

The audit separates:

1. item and source identity;
2. process topology and processing-step hints;
3. workplace capability and descriptive workplace profiles;
4. job identity from active job selection;
5. tool capability tags from exact tool items, possession, and condition;
6. skill identity from selected skill and worker rank;
7. macro economic resolution from bounded static recipes;
8. static relationships from work orders, inventory mutation, batches, maintenance, fuel consumption, and physical waste.

Excluded work includes every correction, new test, content edit, schema/validator change, production runtime change, inventory/crafting execution, worker or facility state, fuel/energy system, maintenance/wear system, UI, save, migration, dependency, asset, generator, or gameplay change. The audit does not choose recipe quantities, affinity capabilities, magical infrastructure, or a future physical production owner.

## 3. Live Head And Changed-Since-Gate-6 Review

| Check | Reproduced result | Authority consequence |
| --- | --- | --- |
| Repository | `https://github.com/vagabond1215/Lineage_Reforged.git` | Correct repository. |
| Branch | `master` | Correct branch. |
| Starting head | `19107302631791c17e1a4320e723d88609b8f65f` | Exact expected audit head. |
| Initial tree | Clean; no staged, unstaged, or untracked paths | No ambiguous user changes. |
| Remote alignment | `origin/master` matched the starting head after fetch; divergence `0/0` | No reconciliation required. |
| Gate 6 artifact commit | `1e2f16e2558ee44c64c48eb2844425efdf30f0ca` | Accepted research evidence; final decision `AUDIT_TRIGGERED`. |
| Gate 6 coordination commit | `3f4732f14eff6f6449b784beb3899fae38915dc1` | Changed only current output, handoff, and the two integration-hold prompts. It installed the audit prerequisite. |
| Newer output commit | `19107302631791c17e1a4320e723d88609b8f65f` | Changed only `docs/dev/current-codex-output.md`; prepared this audit without changing evidence. |
| Integration prompt blobs | Both `bf960cab858a8499874ed1dc0e33fb4ee98bd1dc` | Byte-identical holds that already require this accepted audit plus all seven research artifacts. |
| Existing audit artifact | Absent at start | No duplicate or previously accepted audit. |
| Gate 7 artifact | Absent at start | Gate 7 remained blocked until this audit acceptance. |
| Revised `0.6.5` | Still blocked; live recipe count remains 12 | No implementation or correction had landed. |

The two post-Gate-6 commits are documentation-only and compatible. No content, schema, validator, test, loader, type, runtime, market, transport, or consumer path changed after Gate 6, so the reproduced baseline is directly comparable.

## 4. Reproduced Repository Baseline

### Catalog and owner counts

| Authority | Exact live count | Owner / evidence |
| --- | ---: | --- |
| Items | 1,372 | `packages/content/base/items/items.json` |
| Tool-class items | 131 | Item catalog `itemClass: "tool"` |
| Market item values | 1,617 | `packages/content/base/civilization/market_item_values.json` |
| Skills | 121 | `packages/content/base/player/skills.json` |
| Production chains | 121 | `packages/content/base/civilization/production_chains.json` |
| Workplaces | 58 | `packages/content/base/civilization/workplaces.json` |
| Planned recipes | 12 across 8 families | `packages/content/base/crafting/recipes.json` |
| Buildings | 22 | `packages/content/base/civilization/buildings.json` |
| Settlements | 88 | `packages/content/base/world/settlements.json` |
| Resources / commodities | 2 / 2, all planned | `packages/content/base/world/resources.json`; `commodities.json` |
| Extraction methods | 21 distinct chain-referenced `extract.*` IDs | `packages/content/base/civilization/extraction_methods.json` and chain refs |

### Exhaustive chain counts

| Measure | Exact result | Exact record set or owner |
| --- | ---: | --- |
| Declared stages | 322 | Sum of all 121 `stages` arrays |
| Processing steps | 311 | Sum of all 121 `recipeProfile.processingSteps` arrays |
| Workplace / extraction steps | 227 / 84 | `stageRef` prefix split |
| Explicit / empty step inputs | 19 / 292 | Nonempty versus empty `inputs` arrays |
| Explicit / empty step outputs | 132 / 179 | Nonempty versus empty `outputs` arrays; every empty branch obtains a runtime output |
| Variant chains / variants | 28 / 162 | `variantConfig` and nested variants |
| Missing stage occurrences | 17 across 6 chains | Exact set in Section 12 |
| Generic-primary conflicts | 11 chains | Exact set in Section 11 |
| Variant-over-explicit input cases | 6 steps | Exact set in Section 10 |
| Non-variant omission conflicts | 17 chains / 62 occurrences | Exact set in Section 12 |
| Indexed candidate entries / unique output keys | 916 / 435 | Top-level and variant output index |
| Candidate entries not returning indexed target | 48 | Exhaustive explicit chain/target/variant probe |
| Recipe comparisons | 12 of 12 differ | Exact table in Section 18 |
| `carriesForward: true` | 121 of 121 | Live content; zero runtime carry implementation |

The complete Gate 6 classifications also reproduce: C0, F116, R11 chains covering 12 recipes, X72, G11, M6, O17, J121, S54, E94, T121, D30, and A121. Those research codes are evidence groups, not the discrepancy vocabulary used by this audit.

### Exhaustive workplace counts

The 58 workplaces split into 15 extraction, 33 processing, and 10 manufacturing records. They contain 208 job occurrences across 110 job IDs: 64 primary, 98 support, 32 specialist, and 14 management. Jobs contain 298 required-tool-tag occurrences across 100 unique tags. Twenty-one workplaces have 105 progression tiers; 25 have 116 upgrades; five have top-level tier profiles; 10 have efficiency profiles; nine have market profiles; six have integration profiles; one has a plot profile; and 15 have site tags.

The I/O profiles contain 484 input rows, 365 deterministic output rows, six yield groups with 147 grouped outputs, and 16 site requirements. Only eight input and ten output `quantityPerCycle` values are numeric. All 58 `workCycleHours`, all maximum-worker values, all 208 job numeric rate/tier values, all minimum-tool-tier values, all output multipliers, all tier numeric values, and all upgrade effect values are empty-object placeholders. Power-mode metadata across progression tiers is manual 44, animal 16, water 3, wind 2, steam 2, and hybrid 38; none is runtime-active.

Nine workplaces have no declared chain-stage reference: `workplace.anglers_camp`, `workplace.apiary_yard`, `workplace.clay_pit`, `workplace.deep_shaft_mine`, `workplace.flax_stead`, `workplace.herbalist_garden`, `workplace.peat_cutters`, `workplace.quarry_camp`, and `workplace.salt_pans`. This is not automatically a defect because extraction stages are a separate source abstraction.

### Shadowed-path correction and precision

Gate 6's "120 non-shadowed value/market paths" is reproducible only as an index-position statement: 120 chains are either the first indexed chain for at least one declared/variant output or introduce an output not already owned by an earlier chain. `chain.forage.wild_harvest.hut` contributes only `blackberry_berry`, `mushroom_cap`, `herbs_raw`, and `bark`, all already indexed by earlier foraging chains; it is the one fully later-shadowed index path.

That count must not be read as "120 chains are selected by current value resolution." Four chains (`chain.farming.mixed_crop` and the three `chain.forage.wild_harvest*` chains) have no recipe-derived indexed output, because all of their outputs are `source_derived`; source-derived values bypass chain candidates. Across all current values, 12 chains are never the cheapest selected candidate at the global/default context. Candidate participation, first-candidate labor-skill selection, source-derived bypass, and cheapest-candidate value selection are separate behaviors.

## 5. Complete Consumer And Call-Site Inventory

| Layer / exact call site | Direct input | Reproduced use | Authority and propagation |
| --- | --- | --- | --- |
| `content.ts::loadProductionChainContent` | Chain JSON | Raw cast to `ProductionChainRecord[]` | Makes the narrower type a compile-time description, not live-shape validation. |
| `content.ts::loadWorkplaceContent` | Workplace JSON | Raw cast to `WorkplaceContentRecord[]` | Omits most validated fields while runtime can still read nested raw data present in the object. |
| `runtime-economy.ts::createRuntimeIndexes` | Items, values, settlements, skills, chains, workplaces | Builds `chainById`, `workplaceById`, `chainsByOutput`, and `outputItemsBySkill` | Top-level and variant output declarations become candidate and labor-pressure inputs. |
| `resolveCraftAtSettlement` / `estimateCraftResolution` | Exact chain ID plus optional target, variant, selected inputs, skills, tool tags, fuel flag, settlement/market | Resolves every chain and derives inputs, returned outputs, quantity/quality factors, time, labor, material, processing and waste cost, plus explanations | Live macro-economic authority; no physical execution. |
| `resolveItemRuntimeValue` / `resolveItemValueAtSettlement` | Item/value records and `chainsByOutput` | Bypasses chains for `source_derived`; otherwise resolves every output candidate and selects the lowest effective cost | Chain fallback and output discrepancies can change values and selected candidate. Candidate `role` is ignored. |
| `resolveAssociatedSkillId` | First output candidate | Uses only the first candidate chain's `primarySkillId` | Candidate order affects labor pressure even when a different chain wins value selection. |
| `resolveLocalMarketPriceInternal` | Resolved value, stock, demand, labor, processing, import posture | Produces local buy/sell prices and pressure explanations | Chain effects reach market views. |
| `buildSettlementMarketStates` | Settlement economy snapshots | Prices all 1,617 market keys for every requested settlement | Broad fan-out into engine tick state. |
| `index.ts::runCivilizationTick` | Market states | Builds markets, advances transport, evaluates/dispatches trade, stores final states, builds settlement/institution projections, and emits deltas | Production-derived prices enter the authoritative tick through market/transport/trade; later projections do not necessarily read them. |
| `transport-runtime.ts::repriceMarketStates` | Adjusted stock states | Re-runs local price resolution after transport stock adjustments | Transport changes stock and then re-consumes chain-derived values/prices. |
| `trade-runtime.ts::evaluateAutonomousTradeOpportunities` and dispatch | Origin/destination `priceView` and stock | Uses origin local sell and destination local buy prices to score cargo opportunities | Candidate/value differences can change opportunity margin and selection. |
| `institutions-runtime.ts` | Settlement profiles and market states | Builds institution/guild runtime projections using stock-derived settlement context | Structural market-state consumer, but no chain-derived price or labor-pressure read was found. |
| `settlement-simulation.ts` | Market states | Uses stock/storage context for settlement industry and service projections | Structural consumer only for this trace; current building placement can disagree with generic coverage. |
| `simulation-consistency.ts` | Chains, workplaces, buildings, biological sources, items, market/trade state | Collects top-level/variant outputs and authored inputs, checks refs/cycles/source coverage/unused workplaces/building coverage, and evaluates nonviable trade attempts | Static graph consumer; does not validate returned-output or stage-step closure. |
| `tools/content-lint/index.mjs::validateProductionChains` | All 121 chains plus dependencies | Owns structural, enum, identity, reference, and market closure; no standalone chain schema | Strong static authority, but no reverse stage closure, carry, target reachability, or recipe comparison. |
| Workplace schema plus normal lint | All 58 workplaces | Owns strict shape, enum, placeholder, identity, and reference validation | Validation does not activate fields. |
| Crafting recipe schema/validator | 12 recipes | Owns exact item quantities, roles, workplace/tool/skill refs, and optional related-chain existence | `relatedProductionChainId` is non-inheriting. |
| Settlement-economy validator | Workplace and chain refs | Resolves descriptive production relationships | No facility placement or execution. |
| Resource/commodity validators | Optional related-chain refs | Resolves static relationships | No transformation inheritance. |
| Building/workplace coverage lint | Workplace IDs and generic building templates | Proves every workplace has some compatible building template | Does not prove a building can instantiate in every live settlement/site combination. |
| `packages/shared/types/src/contracts.ts` | Public craft/value/market/consistency states | Exposes output, quantity, cost, skill, explanation, and price contracts | Runtime changes are public-contract-sensitive even without save fields. |
| `civilization-engine/src/index.ts` | Public exports | Re-exports craft, value, price, market, transport, trade, institution, and consistency surfaces | Makes the chain resolver externally callable. |
| UI economy-clarity projection | Public value and price states | Can present supplied value/price explanations | Dormant read-only mapper; no live caller and no production authority. |
| Focused tests | Public APIs and validators | Assert five direct runtime behaviors, schema/reference closure, consistency, settlement economy, trade, transport, institutions, and settlement simulation | Coverage is broad but decisive resolver branches are mostly unasserted. |

## 6. Production, Recipe, Economy, And Runtime Authority Separation

| Concern | Current authority | Explicit non-authority |
| --- | --- | --- |
| Item/source identity | Item, world, ecology, resource, commodity, and source catalogs | Chain fallback cannot create or alias identity. |
| Macro process topology | Production-chain `stages`, `recipeProfile`, variants, and semantic lint | Does not define an executable work order or exact batch ratio. |
| Processing-step hint | `recipeProfile.processingSteps` plus live macro resolver | Does not move prior outputs into later inputs. |
| Workplace capability/profile | Workplace identity, tags, jobs, I/O, progression, upgrades, and descriptive profiles | Does not prove a placed, available, staffed, powered, maintained, or accessible facility. |
| Job and tool vocabulary | Workplace-local jobs/tags; exact portable identity remains in items | No active job, worker assignment, tool possession, condition, wear, or substitution. |
| Macro economic resolution | Civilization runtime craft/value/market functions | Does not consume inventory or create item instances. |
| Bounded static recipe | `crafting.recipes` complete explicit input/output quantities and refs | Does not inherit chain/workplace quantities and does not execute. |
| Market/value | Market values plus runtime value/price/stock/labor pressure | Does not prove recipe availability, stock possession, or physical production. |
| Physical work order/batch | No current owner | Cannot be inferred from `CraftResolutionState`. |
| Inventory, facility state, fuel, maintenance, quality, waste | No production owner for mutation | Cost scalars and descriptive metadata are not state. |

The durable rule is bidirectional: recipes must not inherit disputed chain/workplace fields, and live economic consumers must not be dismissed as inert lore merely because recipes are non-inheriting.

## 7. Production-Chain Field Authority Matrix

There is no production-chain JSON Schema. `tools/content-lint/index.mjs::validateProductionChains` is the live structural and referential authority. `content.ts` then raw-casts JSON to a narrower type; this does not re-run lint or prove the TypeScript surface matches the file.

| Exact field path | Coverage | Required / validator behavior | Loader/type | Runtime consumer, precedence, and fallback | Current economic effect | Recipe and revised `0.6.5` relevance | Focused tests / documentation | Classification | Disposition |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | 121 | Required string; unique | Required and indexed | Exact `chainById` lookup; unknown ID throws | Selects the complete macro projection and explanation | Optional recipe link resolves by ID only | Indirectly covered; docs accurate | `intentional_abstraction` | `preserve` |
| `stages[]` | 322 occurrences | Required nonempty known `extract.*`/`workplace.*`; at least one workplace; step refs must occur here | Required | Craft never iterates it; consistency uses topology/building coverage | None in craft math | Descriptive macro context only | No reverse-closure assertion; docs overstate ordered pipeline | `schema_or_validator_precondition`, `focused_test_gap` | `defer_to_integration` |
| `primaryOutput` | 121 | Required canonical item/value key | Required | Default request target and output index entry | Candidate selection, associated skill, value/price path | Macro analogue, never exact recipe output inheritance | Broad only | `intentional_abstraction` | `preserve` |
| `byProducts[]` | 121 arrays | Required array; every key resolves to item/value | Type marks optional | Indexed; not automatically returned; final-step branch controls result | Candidate/value/labor index even when absent from result | Never inherit recipe byproducts or ratios | No closure assertion | `runtime_implementation_defect`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `facilityStrategy.mode`, `tierRange`, `ownershipModels`, `comboGroupId`, `marketContext.{consumerScope,supplyAccess,riskTolerance,districtTags}` | 8 chains / every listed field | Optional strategy object; complete nested shape and vocabularies validated | Entire object omitted | Ignored | None | Do not infer facility availability, tier, market gate, or recipe gate | Documentation sometimes describes gating | `documentation_defect`, `blocked_pending_later_runtime_ownership` | `document` |
| `variantConfig.variantFlag` | 28 | Required when config exists; slug validated | Omitted | Ignored | None | No recipe substitution authority | Uncovered | `schema_or_validator_precondition` | `document` |
| `variantConfig.defaultVariant` | 28 | Required and must resolve | Optional in type | Used after explicit variant, target match, and selected-input match; then first-variant fallback | Changes inputs, outputs, costs, values | Do not inherit; generic target conflict must be quarantined | Uncovered | `authored_input_requirement`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `variantConfig.variants[].id` | 162 | Required unique local slug | Required | Explicit request; invalid ID returns no selected variant rather than throwing | Can change full projection | Descriptive relation only | Invalid branch uncovered | `authored_input_requirement`, `focused_test_gap` | `defer_to_integration` |
| `variants[].inputItemKeys` | 162 arrays / 486 refs | Required nonempty canonical/value-backed keys | Optional | Selected variant replaces flagged step inputs; selected-input matching picks first intersecting variant | Material cost and recursive value path | Not an exact recipe bill of materials | Six override cases untested | `authored_input_requirement`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `variants[].primaryOutput` | 162 | Required canonical/value key; unique primary within chain | Optional | Target matching and flagged output replacement | Output index, returned output, value candidate | No automatic recipe output | Generic conflicts untested | `runtime_implementation_defect`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `variants[].byProducts` | 162 arrays / 383 refs | Required arrays; refs close | Optional | Target matching; flagged replacement; index entries | Candidate index and returned byproducts | No ratio or recipe inheritance | Uncovered | `authored_input_requirement`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `variants[].laborWeight` | 136 | Optional number-or-empty placeholder | Omitted | Ignored | None | No recipe labor authority | No test; descriptive research only | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `recipeProfile` | 121 | Required object | Required | Container for live macro resolver fields | Central economic projection | Name does not make it a player recipe | Runtime tests broad only | `intentional_abstraction` | `preserve` |
| `recipeProfile.recipeClass` | 121 / 19 values | Required controlled vocabulary | String | Echo/context only | No formula branch | Not the eight live recipe-family authority | Documentation sometimes conflates terms | `documentation_defect` | `document` |
| `recipeProfile.primarySkillId` | 121 / 6 distinct skills | Required canonical skill | Required | Fallback skill and `outputItemsBySkill` grouping | Labor pressure, time/cost fallback, first-candidate price association | Recipe skill remains independent | Broad skill tests only | `authored_input_requirement`, `focused_test_gap` | `defer_to_integration` |
| `recipeProfile.externalInputs[]` | 11 chains / 27 refs | Required array; refs/value closure | Required | Last fallback when explicit/variant/workplace paths fail | One-unit material inputs and recursive costs | Not recipe inputs or quantities | Fallback branch uncovered | `intentional_abstraction`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `recipeProfile.intermediateItems[]` | 8 chains / 9 refs | Required array; refs/value closure | Required | For primary target, only the last named intermediate may become fallback input | One-unit input; never actual carried state | Not a recipe stage or quantity | Carry/fallback uncovered | `documentation_defect`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `processingSteps[].id` | 311 | Required unique local slug | Required | Explanation and cache detail only | No independent value identity | No recipe step inheritance | No exact ID assertions | `intentional_abstraction` | `preserve` |
| `processingSteps[].stageRef` | 311 | Required; must be declared and resolve | Required | Exact workplace lookup for 227 steps; extraction steps have no workplace | Chooses workplace input/output/tool branches | Workplace capability reference only | Reverse completeness absent | `schema_or_validator_precondition`, `focused_test_gap` | `defer_to_integration` |
| `processingSteps[].operation` | 311 | Required controlled vocabulary | Required string | Explanation only | None | Process hint only | No runtime branch | `intentional_abstraction` | `preserve` |
| `processingSteps[].inputs[]` | 19 nonempty / 292 empty | Required arrays; canonical/value refs; empty allowed | Required | Normally first precedence; variant flag can replace; empty paths fall through | One unit per selected occurrence, material/value recursion | Not quantity authority | Exact arrays largely unasserted | `intentional_abstraction`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `processingSteps[].outputs[]` | 132 nonempty / 179 empty | Required arrays; canonical/value refs; empty allowed | Required | Explicit first unless variant flags; target can repartition roles; final step alone returned | Output roles/candidates can diverge | Not recipe result closure | Branch and final closure uncovered | `runtime_implementation_defect`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `usesVariantInputs` | 33 true steps | Optional boolean | Optional | Overrides nonempty explicit inputs in six cases, otherwise fills empty input | Changes material/value cost | Disputed; never inherit | No focused assertion | `authored_input_requirement`, `focused_test_gap` | `defer_to_integration` |
| `usesVariantPrimaryOutput` | 29 true steps | Optional boolean | Optional | Replaces explicit or fallback primary when variant selected | Changes returned target and candidate reachability | No recipe inheritance | Uncovered | `authored_input_requirement`, `focused_test_gap` | `defer_to_integration` |
| `usesVariantByProducts` | 29 true steps | Optional boolean | Optional | Replaces byproducts when variant selected | Changes returned/value basis | No recipe inheritance | Uncovered | `authored_input_requirement`, `focused_test_gap` | `defer_to_integration` |
| `laborIntensity` | 311: light 85, moderate 186, heavy 40 | Required enum | Required | Hard-coded `LABOR_HOURS` branch | Time, labor and processing cost | No worker count or recipe time | Skill/time test only | `intentional_abstraction` | `preserve` |
| `processingIntensity` | 311: minimal 85, standard 126, fuel-heavy 50, precision 50 | Required enum | Required | Hard-coded hours/rates; fuel boolean only affects fuel-heavy | Time and processing cost | No fuel item or recipe time | False-fuel branch uncovered | `intentional_abstraction`, `focused_test_gap` | `document` |
| `difficultyTier` | 311: easy 35, moderate 216, hard 60 | Required enum | Required | Hard-coded multiplier | Time, labor, processing, quality/quantity basis | No recipe gate | Narrow iron/steel assertion | `intentional_abstraction` | `preserve` |
| `materialDifficultyMode` | 311 `input_weighted` | Required supported value | Required | Label is ignored; input item profiles are always averaged | Material difficulty changes formulas independently of label | No recipe material rule | Mode invariance untested | `documentation_defect`, `focused_test_gap` | `document` |
| `skillCheck.skillId` | 227 workplace steps; absent on 84 extraction steps | Required canonical skill on workplace steps | Optional by type | Step skill overrides chain primary | Time, labor, waste, quality and quantity factors | Recipe skill is separate | Low/high rank tested, attribution mostly not | `authored_input_requirement`, `focused_test_gap` | `defer_to_integration` |
| `skillCheck.minimumRank`, `efficiencyRank`, `qualityRank` | 227 each | Required ordered positive integers | Required when skill check exists | Thresholds produce penalties/benefits; never block | Time/cost/waste/quality | Not recipe eligibility | Low/high broad coverage | `intentional_abstraction` | `preserve` |
| `skillCheck.allowedDimensions`, `quantityRank`, `lowSkillOutcome` | Optional dimensions; 2 quantity ranks; low outcome required on 227 | Validated vocabulary/coherence | Represented | Dimensions gate formula factors; outcome string itself does not branch | Quantity only on allowed steps; low-skill output still exists | Not recipe success/failure | Quantity branch narrowly covered | `documentation_defect`, `focused_test_gap` | `document` |
| `valuePropagation.materialCostMode` | 121 `input_sum` | Required exact string | Required | Echoed; formula hard-coded | Material cost is selected one-unit input sum | No recipe quantity | No mode test | `documentation_defect` | `document` |
| `valuePropagation.laborCostMode` | 121 `skill_time_weighted` | Required exact string | Required | Echoed; formula hard-coded | Labor cost | No assigned labor | No mode test | `documentation_defect` | `document` |
| `valuePropagation.processingCostMode` | 109 `fuel_tool_wear`, 11 `fuel_and_tool_wear`, 1 `tool_wear` | All three accepted | Type accepts only `fuel_tool_wear` | Echoed only; one fixed processing formula | Cost label does not select fuel/wear logic | No physical fuel/tool recipe rule | Type drift and branch gap | `schema_or_validator_precondition`, `documentation_defect` | `defer_to_integration` |
| `valuePropagation.difficultyMode` | 121 `step_material_weighted` | Required exact string | Required | Echoed; formula hard-coded | Difficulty cost already applied | No recipe gate | No mode test | `documentation_defect` | `document` |
| `valuePropagation.demandBand` | 121: subsistence 4, common 84, utility 24, specialty 3, luxury 6 | Required enum | Required | Echoed in craft; chain band does not own local price demand band | No craft selection; price uses item/market demand band | No recipe demand authority | Docs can understate separation | `documentation_defect` | `document` |
| `valuePropagation.carriesForward` | 121 true | Required boolean | Required | Echoed only | No carry, inventory, or accumulated output effect | Must not support recipe inheritance | Uncovered | `documentation_defect`, `runtime_implementation_defect`, `focused_test_gap` | `defer_to_integration` |
| Chain quantity fields | Absent | No such fields | None | Runtime supplies one-unit inputs and skill-derived output scalar | Economic estimate only | Cannot provide bounded recipe ratios | Recipe non-inheritance is covered | `authored_input_requirement` | `quarantine_from_revised_0_6_5` |

## 8. Workplace Field Authority Matrix

The workplace JSON Schema and semantic lint are strong static-shape authorities. Runtime loading is a raw cast to a deliberately incomplete type. “Validated” therefore means static content is well-formed, not that a mechanic consumes it.

| Exact field path | Coverage | Required / schema and lint | Loader/type | Runtime use and fallback | Job/tier/tool/quantity/economic effect | Recipe and revised `0.6.5` relevance | Tests / documentation | Classification | Disposition |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| `id`, `name`, `category` | 58 each | Required; ID/category controlled and unique | Present | Exact ID selects workplace; name/category ignored by craft | ID only | Recipe workplace ref resolves ID as capability | Identity closure covered | `intentional_abstraction` | `preserve` |
| `inputTags[]`, `outputTags[]` | 494 / 543 occurrences across all 58 | Required capability arrays; semantic refs checked | Optional | Craft fallback ignores tags; consistency uses output tags as produced-source evidence | No direct quantity or rate | Pre-authoring tag compatibility is evidence only | Docs can overstate production | `documentation_defect` | `document` |
| `siteTags[]` | 16 refs on 15 records | Optional validated abstractions | Omitted | Ignored | No placement or environmental gate | No recipe site authority | Uncovered | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `laborSlots` | 58 | Required integer-or-empty placeholder | Omitted | Ignored | All placeholders; no capacity | None | Docs can imply active slots | `documentation_defect`, `blocked_pending_later_runtime_ownership` | `document` |
| `workforceProfile.maxConcurrentWorkers` | 58 | Required integer-or-placeholder | Omitted except profile shell | Ignored | All placeholders | None | No test | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `workforceProfile.jobs[].jobId` | 208 / 110 distinct IDs | Required local identity; uniqueness/cross-rules | Present | No active job is selected | All jobs contribute tool tags | Recipe does not reference jobs | No job-selection test | `authored_input_requirement`, `focused_test_gap` | `defer_to_later_runtime` |
| `jobs[].role` | 64 primary, 98 support, 32 specialist, 14 management | Required enum | Present as string | First primary alone selects penalty mode; otherwise ignored | Role does not select outputs/rates | No recipe inheritance | Multiple-primary branch uncovered | `runtime_implementation_defect`, `focused_test_gap` | `defer_to_integration` |
| `jobs[].requiredTier`, `minWorkers`, `maxWorkers`, `recommendedWorkers`, `baseOutputPerWorker`, `diminishingStartsAt`, `diminishingFactor` | 208 each | Required number-or-placeholder shapes | Omitted | Ignored | All placeholders; no active workforce/tier/productivity | Cannot seed recipe quantities | Docs overstate curves | `documentation_defect`, `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `jobs[].unlocks[]`; `replanting.{enabled,outputGainPerWorker,maxOutputGain,effectiveRadiusReductionPerWorker,maxRadiusReduction}` | 208 unlock arrays / 43 refs; one complete replanting entry | Validated capability metadata and placeholder-or-number fields | Omitted | Ignored | No active output, radius, or unlock effect | None | No test | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `toolRequirements.minimumToolTier` | 208 | Required tier-or-placeholder | Typed as object only | Ignored | All placeholders | Exact recipe tool item remains separate | No test | `schema_or_validator_precondition`, `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `toolRequirements.requiredToolTags[]` | 298 refs / 100 tags | Required syntax-only `tool.*`; not item refs | Present | Union across every job; request omission assumes sufficient tools | Missing set affects time/cost | Recipe exact tool keys do not inherit tags | Union untested; five suffixes lack exact item key | `authored_input_requirement`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| `missingToolPenalty.mode` | 208: 68 `no_output`, 140 `reduced_output` | Required enum | Present | Only first primary mode used | Internal `blocked` or factor; caller discards blocked | Must not imply recipe availability | No exact branch test; docs overstate | `runtime_implementation_defect`, `documentation_defect`, `focused_test_gap` | `defer_to_integration` |
| `missingToolPenalty.outputMultiplier` | 208 | Required number-or-placeholder | Object-only type | Ignored | All placeholders | No recipe yield authority | Uncovered | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `ioProfile.workCycleHours` | 58 | Required number-or-placeholder | Object-only type | Ignored | All placeholders; runtime uses chain intensity constants | No recipe time/ratio | Data dictionary incorrectly says it scales rates | `documentation_defect`, `schema_or_validator_precondition` | `document` |
| `ioProfile.inputs[].itemKey` | 484 | Required canonical item key | Present | After explicit/variant input, scored by target; groups alternatives; excludes known chain outputs | One-unit material/value fallback | Not an exact recipe input | Scoring branch uncovered | `intentional_abstraction`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| Input `quantityPerCycle`, `unit`, `consumptionType` | 484 each; 8 numeric quantities | Required scalar-or-placeholder plus vocabulary | Quantity/type mismatch in TS | Ignored | No rate, consumption, or unit effect | Cannot seed recipe quantities | No invariance test; docs overstate | `documentation_defect`, `schema_or_validator_precondition` | `quarantine_from_revised_0_6_5` |
| `ioProfile.outputs[].itemKey` | 365 | Required canonical key | Reuses wrong input record type | Empty-step fallback: requested target if present, else first; other commodity outputs become byproducts | Returned output/value fallback | Not guaranteed recipe output | Exact branches uncovered | `intentional_abstraction`, `focused_test_gap` | `quarantine_from_revised_0_6_5` |
| Output `quantityPerCycle`, `unit`, `productionType` | 365 each; 10 numeric quantities | Required scalar-or-placeholder plus vocabulary | Output type incorrectly expects `consumptionType` | Ignored | No production rate or role from fields | Cannot seed recipe quantities | Uncovered | `documentation_defect`, `schema_or_validator_precondition` | `quarantine_from_revised_0_6_5` |
| `ioProfile.siteRequirements[]` | 16 refs on 15 workplaces | Optional site abstraction refs | Omitted | Ignored | No environment/access gate | No recipe site rule | Uncovered | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `ioProfile.yieldGroups[].{groupId,selectionMode,outputs}`; output `{itemKey,quantityPerCycle,unit,productionType}` | 6 `weighted_pool` groups / 147 outputs; zero weights or draws authored | Optional validated grouped-output evidence; output refs/roles/placeholder quantities checked | Partially typed; output shape drifts | Ignored by craft; consistency counts output keys as source | No roll, draw, weight, or quantity effect | Not recipe substitutions | No runtime test | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `tierProfile.{trackId,tier,tierLabel,upgradesFrom,upgradesTo,techLevel,facilityForm,ownershipModel,wealthBand,regionalSuitability,splitFacility}` | 5 workplaces / every listed field; 5 `facilityForm` values | Optional complete tier/ownership/facility-form relation validated | Entire object omitted | Ignored | No selected tier, facility form, or traversal | No active recipe tier/facility | README/data dictionary imply active progression | `documentation_defect`, `blocked_pending_later_runtime_ownership` | `document` |
| `progressionProfile.maxTier`; `tiers[].{tier,tierLabel,throughputMultiplier,variantSlots,switchLaborCost,powerMode,inputLaborWeights,siteLaborWeights,jobUnlocks,outputUnlocks,variantUnlocks,facilityForm}` and optional facility fields | 21 profiles / 105 tiers; 263 input and 29 site weights; 27 tier `facilityForm` values | Optional profile; structural, vocabulary, reference, and placeholder checks | Entire object omitted | Ignored | No selected tier, facility form, throughput, worker, unlock, or power effect | No active recipe/facility availability | No test; docs overstate | `documentation_defect`, `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `progressionProfile.tiers[].powerMode` | 105: manual 44, animal 16, water 3, wind 2, steam 2, hybrid 38 | Required within profile; controlled vocabulary | Omitted | Ignored | No fuel, grid, motive, capacity, or infrastructure owner | Gate 7 may research bounded substitution only | No activation test | `blocked_pending_later_runtime_ownership` | `defer_to_gate_7` |
| `upgradesProfile.upgradeSlots`, `availableUpgrades[].{id,name,description,category,requiredUpgradeIds,effects,essentialForTierUpgrade}`, `tierUpgradeRequirements[]` | 25 profiles / 116 upgrades / zero tier requirements | Optional validated categories, dependencies, effect shapes, and placeholders | Entire object omitted | Ignored | No installed upgrade, slot, gate, or multiplier; all numeric effects placeholders | No recipe effect | README describes upgrades as feature | `documentation_defect`, `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `efficiencyProfile.{throughputMultiplier,laborEfficiency,wasteMultiplier,comfortScore}` | 10 profiles / all numeric fields placeholders | Optional placeholder-or-number fields validated | Entire object omitted | Ignored | No throughput/labor/waste/comfort effect | None | No test | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| `marketProfile.{businessScale,consumerScope,supplyAccess,riskTolerance,districtTags}` | 9 profiles / every listed field | Optional validated descriptors | Entire object omitted | Craft ignores it | No availability, price, or market gate | No recipe availability | Docs may imply business logic | `documentation_defect` | `document` |
| `integrationProfile.{comboGroupIds,role,comboBonuses}` | 6 profiles / 6 bonuses / 10 workplace refs | Optional validated combo groups, roles, refs, and placeholder multipliers | Entire object omitted | Ignored | No co-location bonus | No recipe combo | Data dictionary says "reward" | `documentation_defect`, `blocked_pending_later_runtime_ownership` | `document` |
| `plotProfile.{allowedPlotTypes,irrigationPolicy,plotCapacity,proportionalAreaScaling,specialtyUpgrades,terrainCompatibility,usableAreaPerPlot}` | 1 complete profile | Optional validated agriculture metadata and irrigation-infrastructure relation | Entire object omitted | Ignored | No plot/tier/capacity effect | None | Data dictionary says it scales plots | `documentation_defect`, `blocked_pending_later_runtime_ownership` | `document` |
| `services.json` `providerAnchorTypes[]`, `allowedOwnerTypes[]` | 5 service records; workplace is an allowed anchor type for lodging/storage only; no exact workplace binding | Service schema/lint validate type-level owner vocabulary | Separate service authority; absent from workplace runtime type | Craft never resolves a service record | No service access or availability | Recipe workplace ID does not imply a service | Static service identity only | `intentional_abstraction` | `preserve` |
| `buildings[].hostedWorkplaceIds[]` | 58 refs / 58 unique workplaces across 22 building records | Building/workplace lint proves generic catalog coverage | Separate building loader | Craft ignores placed buildings; settlement simulation applies compatibility constraints | Generic coverage is not live settlement availability | Recipe station ref proves no placement | Settlement simulation exposes the Stonevein gap | `factual_content_defect`, `focused_test_gap` | `defer_to_integration` |
| Storage/capacity | No first-class active workplace state | Absent except hints/profiles | Absent | None | No current storage/capacity authority | Never infer for recipe/runtime | Later owner only | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |
| Maintenance, repair, calibration, wear | No explicit active fields | Absent or prose only | Absent | Processing-cost label does not implement wear | No condition/state | No recipe mutation | Later owner only | `blocked_pending_later_runtime_ownership` | `defer_to_later_runtime` |

## 9. Chain And Output Indexing Semantics

`createRuntimeIndexes` builds two materially different production indexes. `chainsByOutput` indexes the top-level `primaryOutput`, top-level `byProducts`, every variant primary, and every variant byproduct. It contains 916 candidate entries across 435 unique item keys; 129 keys have more than one candidate. Candidate records retain chain ID, optional variant ID, and declared role, but value selection does not honor the stored role. `outputItemsBySkill` groups declared chain outputs under the chain `recipeProfile.primarySkillId`; it does not use the selected processing-step skill or a planned recipe skill.

An exhaustive candidate request produced this reachability split:

| Indexed-candidate result | Entries | Consequence |
| --- | ---: | --- |
| Requested item returned as primary | 449 | Candidate can provide a direct primary quantity basis. |
| Requested item returned as byproduct | 419 | Candidate remains eligible; item-value resolution prices it from full craft cost rather than its 12% craft byproduct basis. |
| Requested item not returned | 48 | Candidate remains eligible and falls back to the first returned output quantity, so the advertised item can receive an unrelated output's calculated value. |

The 48 unreachable entries are 11 generic-primary/default-variant conflicts, 30 still-unreachable non-variant top-level declarations, and seven variant-generic byproduct declarations. All 916 entries resolve without a missing item or market-value record; the defect is candidate-to-result closure, not identity closure.

Of the 435 indexed keys, 341 have `recipe_derived` value mode and 94 have `source_derived` value mode. Source-derived items bypass production candidates entirely. One hundred seventeen chains have at least one recipe-derived indexed output. The remaining four are `chain.farming.mixed_crop`, `chain.forage.wild_harvest`, `chain.forage.wild_harvest.guild`, and `chain.forage.wild_harvest.hut`; all of their indexed outputs are source-derived.

The Gate 6 `120/1` finding is an ordered-index participation result, not a count of independently selected value paths. The first three source-only chains still introduce at least one new chain-primary-skill output into `outputItemsBySkill`. `chain.forage.wild_harvest.hut` introduces only `blackberry_berry`, `mushroom_cap`, `herbs_raw`, and `bark`, all already introduced by earlier same-skill chains. It is the exact one fully later-shadowed path.

Default item-value resolution actually selects 109 chains as the cheapest candidate at least once. The 12 never selected are:

- `chain.beverage.inn_tea_service`
- `chain.beverage.kitchen_tea_service`
- `chain.beverage.tavern_tea_service`
- `chain.beverage.wine`
- `chain.beverage.wine.segmented`
- `chain.farming.mixed_crop`
- `chain.food.bakery_specials`
- `chain.forage.wild_harvest`
- `chain.forage.wild_harvest.guild`
- `chain.forage.wild_harvest.hut`
- `chain.fuel.firewood_bundle`
- `chain.leather.exotic_curing`

Five later candidate paths are permanently equal-cost/tie-shadowed by chain-ID ordering: the three inn/kitchen/tavern tea services behind bakery tea, segmented wine behind base wine, and exotic curing behind cured leather. Source-only chains are bypassed for a different reason and must not be called tie-shadowed.

For recipe-derived keys, `resolveItemRuntimeValue` evaluates every candidate, sorts by lowest effective calculated cost and then chain ID, and selects the first. Candidate `role` is never read. Local price labor association instead uses the first indexed candidate's chain primary skill. Fifteen keys have mixed candidate skills, and 13 currently select a cheapest chain whose skill differs from that first association: `wax_seal`, `fruit_pomace`, `fruit_must`, `wine_cask`, five variant wine-cask keys, `grape_pomace`, `kiln_shard`, `silt`, and `sack`. For `wine_cask`, integrated wine is the cheap selected value path, while the price explanation and labor pressure use carpentry from the first candidate. This is a live value/market inconsistency, not only an explanation issue.

## 10. Input Precedence And Fallback Semantics

Variant selection happens before step input resolution. The exact resolver order is:

1. use the requested variant when the ID is valid;
2. otherwise select a variant whose primary or byproducts match the requested target;
3. otherwise select the first variant whose authored inputs intersect `selectedInputItemKeys`;
4. otherwise use `defaultVariant`;
5. otherwise use the first variant.

An invalid requested variant does not fail: it returns no selected variant and continues with generic behavior. `selectedInputItemKeys` is only a variant selector. It is not treated as the caller's direct bill of materials; unrecognized selected keys are ignored if another key selects a variant, and a wholly unrecognized set falls back to the default variant.

For each processing step, the effective input precedence is conditional:

1. when a selected variant exists and `usesVariantInputs` is true, use its inputs and replace any explicit step inputs;
2. otherwise, retain nonempty `processingSteps[].inputs`;
3. otherwise, use the exact referenced workplace's `ioProfile.inputs` heuristic;
4. otherwise, use chain fallback: the last `intermediateItems` entry only when the requested target equals the declared chain primary, then `externalInputs`.

The 311 default step resolutions divide exactly as follows:

| Input branch | Steps | Reproduced behavior |
| --- | ---: | --- |
| Explicit retained | 13 | Each listed occurrence contributes quantity one. |
| Variant replaces explicit | 6 | A true flag discards a nonempty authored step input list. |
| Variant fills empty | 25 | Selected variant inputs become one-unit occurrences. |
| Workplace profile | 171 | A scoring/grouping heuristic selects workplace inputs, excluding declared chain outputs. |
| Last-intermediate fallback | 2 | The final named intermediate is consumed without any prior-step carry. |
| External-input fallback | 94 | One flour extraction step resolves `grain_bundle`; the other 93 resolve no inputs because their external list is empty. |

The six explicit-input replacements are:

| Chain / step | Explicit input discarded | Selected variant input used |
| --- | --- | --- |
| `chain.food.bakery_sausage_rolls` / `bake_pastry_goods` | `pastry_dough` | `sausage_link`, `wheat_flour`, `honeycomb` |
| `chain.food.berry_preserves` / `sweeten_reduce_fruit` | `cane_sugar`, `honeycomb` | `blackberry_berry` |
| `chain.food.flour` / `mill_grain` | `grain_bundle` | `wheat_seed` |
| `chain.food.preserved_fish` / `season_for_cure` | `salt_crystal` | `trout_meat` |
| `chain.food.preserved_meat` / `season_for_cure` | `salt_crystal` | `deer_meat` |
| `chain.food.smoked_sausage` / `season_for_cure` | `salt_crystal` | `sausage_link`, `salt_crystal` |

The code is deterministic, but the repository does not establish that replacement rather than addition is intended. These six cases therefore require authored intent before any resolver correction and are quarantined from recipe authoring.

Workplace input selection is a macro estimator. It scores relationships to the target, groups alternatives, excludes keys declared anywhere as chain outputs, and, when no positive relationship exists, takes the first three authored workplace inputs. It ignores workplace quantities, units, consumption types, capacity, inventory, and facility placement. It cannot establish an exact bill of materials.

The two last-intermediate fallbacks demonstrate reverse rather than carried topology: `chain.food.bread`'s grain-harvest step consumes the final `bread_dough` intermediate, and `chain.food.fresh_cheese`'s milk-collection step consumes final `cheese_curd`. No prior output is moved into a later step. Empty fallback results are accepted and still yield outputs and costs.

## 11. Output, Variant, Requested-Target, And Fallback Semantics

Output resolution has separate explicit and empty-step branches. Across the 311 default step resolutions, the effective source is 104 explicit outputs, 28 variant replacements of explicit primaries, 97 workplace-profile outputs, and 82 requested-target fallbacks.

For a nonempty explicit output list, the list is authoritative unless `usesVariantPrimaryOutput` or `usesVariantByProducts` replaces the applicable portion. If the requested target occurs in the effective explicit list, it alone becomes primary and other commodity-class outputs become byproducts. If it does not occur, every effective explicit output is returned as primary. Authored workplace `productionType` is not used.

For an empty output list, an exact workplace profile is considered before variant or target fallback. If the workplace offers the requested target, that item is primary. Otherwise its first deterministic output becomes primary and remaining commodity-class deterministic outputs become byproducts. Yield groups are not rolled. Without a usable workplace output, the selected variant primary/byproducts are used; otherwise the requested target is returned. Top-level declared primary/byproducts do not close the result.

Requested-target and variant probes established:

- an unknown chain ID throws;
- an invalid variant ID silently produces `selectedVariantId: null` and continues;
- an arbitrary invalid target is accepted and the default variant may still be selected;
- a generic wine target selects the default grape variant and returns `grape_wine_cask`, not `wine_cask`;
- targeting a variant byproduct selects that variant but preserves the item's byproduct role;
- targeting `spent_reagent` on the non-variant adhesive chain promotes it to primary and demotes `adhesive` to byproduct;
- explicit selected inputs select a variant but never replace the full runtime bill of materials directly.

The exact 11 generic-primary/default-variant conflicts are:

- `chain.beverage.wine`
- `chain.beverage.wine.integrated`
- `chain.beverage.wine.segmented`
- `chain.food.berry_preserves`
- `chain.food.flour`
- `chain.food.preserved_fish`
- `chain.food.preserved_meat`
- `chain.hunting.game_supply.camp`
- `chain.hunting.game_supply.guild`
- `chain.lumber.beam`
- `chain.lumber.plank`

The repository contains no accepted decision choosing default-variant substitution, generic abstraction, or failure for these requests. Because the index advertises the generic target while the resolution may not return it, revised `0.6.5` must not use this path for recipe admission, output identity, or quantity.

Final craft state is rebuilt from only the last processing step. Earlier primaries and byproducts are absent unless independently repeated by the last step. This creates the 62 default omissions in Section 12 and helps create the 48 indexed targets that cannot be returned. The item-value fallback from a missing requested primary to `craft.outputs[0]` masks the mismatch rather than repairing it.

## 12. Stage, Step, Intermediate, Byproduct, And Carry Semantics

The runtime executes `recipeProfile.processingSteps` in authored array order. It does not iterate `stages`, group steps by declared stage order, or require every declared stage to execute. Semantic lint checks each step's `stageRef` against the chain's declared stages and the workplace/extraction registry, but it does not enforce the reverse `stages`-to-step closure.

The 17 declared stages without a processing step are:

| Chain | Missing declared stages |
| --- | --- |
| `chain.food.bakery_goods` | `extract.grain.harvest`, `workplace.millhouse`, `workplace.butchers_block`, `workplace.smokehouse` |
| `chain.food.berry_preserves` | `extract.foraging.woodland`, `extract.apiculture.hive_keeper`, `workplace.sugar_boilers_house`, `workplace.pottery_kiln` |
| `chain.food.citrus_marmalade` | `extract.orchard.grove_tender`, `extract.apiculture.hive_keeper`, `workplace.sugar_boilers_house` |
| `chain.food.preserved_fish` | `extract.fishing.river_netter`, `extract.salt.brine_evaporator` |
| `chain.food.preserved_meat` | `extract.hunting.trapper`, `extract.salt.brine_evaporator`, `workplace.butchers_block` |
| `chain.food.smoked_sausage` | `workplace.butchers_block` |

Six chains execute two steps with the same stage reference in array order: berry preserves and citrus marmalade at `workplace.preservers_hearth`; fresh cheese at `workplace.kitchen`; and preserved fish, preserved meat, and smoked sausage at `workplace.smokehouse`. Duplicate stages are permitted and are not themselves a defect. Declared-but-unexecuted stages are a verified content/topology discrepancy, but the intended fix requires author input: add steps, remove declarations, or retain descriptive topology.

All 121 chains set `valuePropagation.carriesForward: true`. Runtime only echoes that flag in explanation state. It does not carry primaries, byproducts, intermediate quantities, quality, waste, tool state, worker state, fuel, or batch state between steps. `intermediateItems` is not a queue: only its final item can be injected as a one-unit fallback into any qualifying step. Extraction-to-processing transitions are likewise independent estimates, not material movement.

Only the last step is re-resolved into the final public output list. Seventeen non-variant chains therefore omit 62 top-level declared output occurrences from the default final result:

| Chain | Top-level outputs omitted from final default result |
| --- | --- |
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
| `chain.tailoring.apparel` | `apron`, `work_hat`, `backpack`, `sack`, `pack_harness`, `sled_harness`, `reins`, `saddle`, `travel_hood`, `work_gloves`, `utility_belt`, `casual_boots`, `cloth_jerkin` |
| `chain.tailoring.cloak` | `casual_cloak`, `blanket`, `padded_gambeson` |
| `chain.textile.components` | `rope` |
| `chain.utility.tools` | `hoe`, `sickle`, `scythe`, `rake`, `shovel`, `pitchfork`, `thresher_flail`, `pickaxe`, `butcher_knife`, `fillet_knife`, `skinning_knife`, `herb_knife`, `pruning_knife`, `steel_tools` |
| `chain.warfare.armor` | `mail_coif`, `plate_helm` |
| `chain.warfare.leather_armor` | `leather_medium_armor`, `leather_heavy_armor`, `leather_greaves` |
| `chain.warfare.weapons` | `war_spear`, `dirk_dagger`, `short_sword`, `arming_sword`, `battle_axe`, `steel_weapons` |

Simulation consistency unions top-level and variant outputs plus authored chain/workplace inputs. It can report zero missing sources or cycles while resolver stage closure, carry, and final-output closure are wrong or unresolved. Passing consistency is therefore identity/graph evidence, not execution evidence.

## 13. Quantity, Quality, Time, Labor, Material, Processing, Waste, And Cost Semantics

The chain catalog has no authored quantity field. The workplace catalog has 18 numeric `quantityPerCycle` values, all equal to one, and 994 empty-object quantity placeholders; the resolver reads none of them. Current quantities are runtime estimates:

- every resolved step-input occurrence contributes exactly one unit; repeated keys increment the total by one;
- each final primary and byproduct receives the mean quantity factor from steps whose allowed dimensions include `quantity`;
- only two fresh-cheese skill checks currently enable quantity, so every other default chain returns quantity `1` per final item;
- default fresh-cheese quantity is `0.9774` per returned final item;
- public `outputQuantity` counts primary items only: number of primary keys multiplied by the final quantity factor;
- neither workplace cycle quantities nor planned-recipe quantities participate.

Quality is likewise a nonpersistent scalar. The resolver averages quality factors only from steps that enable the quality dimension and applies the mean to final value bases. It does not create a quality-bearing item, lot, batch, grade, durability, spoilage, or inventory record. Tool penalties do not alter quantity or quality directly. Skill can alter quantity only on the two quantity-enabled checks and quality only when that dimension is enabled.

The hard-coded time and cost model is:

| Component | Live constants and behavior |
| --- | --- |
| Labor hours | `light 1.25`, `moderate 2.4`, `heavy 4.1` per step. |
| Processing hours | `minimal 0.2`, `standard 0.7`, `fuel_heavy 1.45`, `precision 1.05`. |
| Processing rates | `minimal 0.08`, `standard 0.22`, `fuel_heavy 0.50`, `precision 0.34`. |
| Difficulty | `easy 0.92`, `moderate 1`, `hard 1.22`; the runtime table also contains unused `expert 1.48`. |
| Material difficulty | Average of input-item workability, hardness, refinement difficulty, and processing-cost factors; defaults to `1`. The authored `materialDifficultyMode` label does not branch. |
| Production capacity | Settlement infrastructure, route access, and survival profile produce a clamped `0.9` to `1.6` divisor on processing time. No placed workplace is checked. |
| Tool penalty | Missing required tags produce hard-coded factor `2` for first-primary `no_output`, or `1.3` for `reduced_output`; the authored output multiplier is ignored. |
| Fuel penalty | `fuelAvailable: false` on `fuel_heavy` applies `1.35` in time difficulty and again in processing-cost multiplication. |
| Labor rate | `(0.32 * difficulty + 0.18)` multiplied by skill/labor pressure; labor cost is time times rate. |
| Material cost | Recursive effective value of each one-unit selected input occurrence, summed across every step. |
| Waste cost | Step material cost times only the positive part of the skill waste multiplier above `1`. No waste item is emitted. |
| Processing cost | Processing time times the hard-coded intensity rate times tool factor and fuel factor; processing-mode labels do not select a formula. |
| Total cost | Material + labor + processing + waste across all processing steps. |

Primary `unitValueBasis` divides total cost equally among final primary keys, then multiplies by quality. Each byproduct receives a hard-coded 12% of total cost times quality, without division among byproducts. `totalValueBasis` then multiplies by the derived quantity. Item-value candidate selection does not reuse the byproduct basis: it divides the full craft total cost by requested-primary quantity when present, otherwise by the first returned output quantity. Thus role and cost authority diverge.

These formulas are sufficient for a broad macro-economic estimate, not an exact transformation. They cannot establish recipe ratios, production rates, physical waste, batch yield, throughput, facility capacity, inventory affordability, or whether inputs exist.

## 14. Skills And Low-Skill Semantics

Four distinct skill concepts remain separate:

| Skill source | Current use | Non-authority |
| --- | --- | --- |
| Chain `recipeProfile.primarySkillId` | Fallback skill for unchecked steps; `outputItemsBySkill`; first-candidate labor-pressure association | Does not become a planned recipe skill automatically. |
| Step `skillCheck.skillId` | Overrides chain skill for 227 workplace steps and drives time, labor, waste, quality, and optional quantity factors | Does not block output below minimum. |
| Workplace jobs | Job IDs/roles contribute tool aggregation and penalty-mode selection | No workplace job skill is selected or mapped to a worker. |
| Planned recipe `skillId` | Explicit static recipe reference validated by the recipe owner | Does not execute and does not alter chain resolution. |

The 84 extraction steps have no skill check and use the chain primary skill. With an explicit worker rank they use it; without one they default to rank `60`, with neutral time, waste, quality, and quantity factors apart from labor pressure. A checked step with no explicit rank instead infers `max(0.85 * minimumRank, efficiencyRank / laborPressure)`. This inferred worker can be below minimum.

Minimum rank is a penalty threshold, not a gate. Below-minimum steps still return normal output identities. The runtime changes time, waste, labor rate, and quality according to allowed dimensions. `lowSkillOutcome` is validated and loaded but never read. `effectiveRequiredRank` multiplies the minimum by material difficulty for explanation only; it does not alter the branch decision. The default allowed dimensions are time efficiency, waste, and quality. Quantity applies only when explicitly allowed.

The current recipe/chain-primary differences are legitimate evidence of non-inheritance, not automatic defects: grain-to-flour uses recipe milling versus chain cooking; hide-to-cured-leather uses recipe tanning versus chain leatherworking; iron-ore-to-ingot uses recipe smelting versus chain blacksmithing; and hammer uses recipe basic crafting versus chain blacksmithing. Revised `0.6.5` must keep its skill IDs explicit and justify them from the bounded transformation, not copy chain primary or step skill mechanically.

Focused tests cover broad low/high skill effects for bread and a narrow quantity difference for bread versus cheese. They do not cover extraction fallback, missing-rank inference, below-minimum output persistence, `lowSkillOutcome` non-use, per-dimension gating, recipe/chain differences, or first-candidate labor-skill mismatch.

## 15. Tools, Jobs, Roles, Tiers, Progression, Upgrades, And Blocking

The 58 workplaces define 208 jobs: 64 primary, 98 support, 32 specialist, and 14 management. Runtime does not select an active job. It unions all 298 `requiredToolTags` across every job in the referenced workplace, deduplicates them, and compares the union with the request. `availableToolTags: undefined` means all tools are assumed sufficient; an empty array means no tools are available.

Ninety-five of the 100 tool-tag suffixes exactly match a tool item key. Five do not: `tool.axe`, `tool.cooking_pot`, `tool.kitchen_knife`, `tool.ladle`, and `tool.serving_tray`. Nearby items are not accepted aliases and must not be inferred. Tool tags are capability vocabulary, while recipe tools are exact item identities; possession, condition, tier, wear, replacement, and inventory are absent.

When any tag is missing, only the first job with role `primary` selects the penalty mode. Forty-five workplaces therefore use first-primary `no_output`; 13 use first-primary `reduced_output`. Forty-seven workplaces contain mixed modes, and multiple-primary workplaces can contain later modes that never control the result. The authored `minimumToolTier` and `outputMultiplier` are ignored.

For `no_output`, runtime creates an internal `blocked: true` and factor `2`; for `reduced_output`, it creates `blocked: false` and factor `1.3`. The caller reads only the factor and notes. `blocked` is discarded and is absent from `CraftResolutionStepState` and public `CraftResolutionState`. Both modes return unchanged output identities and quantities; they only increase time, labor, and processing cost. A direct atelier probe that omitted only support-job `tool.hammer` still returned `oil_flask` and `spent_reagent` at quantity one while time doubled and total cost rose. This disproves the literal `no_output` label under current behavior.

Every job's required tier, worker bounds, productivity, diminishing-return fields, and tool tier is an empty-object placeholder. All 58 labor slots, maximum concurrent workers, and work-cycle hours are placeholders. The five tier profiles, 21 progression profiles with 105 tiers, 25 upgrade profiles with 116 upgrades, ten efficiency profiles, nine market profiles, six integration profiles, and one plot profile are validated static metadata but omitted from the runtime type and ignored by craft resolution. No tier is selected, no upgrade is installed, and no power or throughput state is applied.

Every workplace appears in at least one generic building template, but craft resolution checks only the exact workplace ID from the step. It never checks that a compatible building is placed, accessible, staffed, serviced, powered, maintained, or in usable condition. Nine extraction workplaces have no chain-stage reference, which is permitted because extraction stages use a separate abstraction.

If a missing `workplace.*` reference evaded semantic lint, the runtime map lookup would return `undefined`, silently skip workplace inputs, outputs, and tools, fall through to chain input fallback, and use selected-variant or requested-target output fallback. Current live records do not exercise that branch because lint closes every step reference; this is a code-path finding, not permission to add an invalid fixture.

The current Stonevein simulation failure demonstrates the difference between generic catalog coverage and live placement: Stonevein is a subterranean city with mining businesses but instantiates zero buildings. The extraction yard supports subterranean sites but not cities; forge, stoneworks, and warehouse templates support cities but only surface sites. The test establishes that an extractive building is intended, but not which compatibility field should change. This is a high-confidence factual content defect reserved for integration, not permission to change workplace or recipe data here.

## 16. Fuel, Power, Infrastructure, And Environmental Authority

Fifty processing steps in 37 chains use `processingIntensity: fuel_heavy`. The request has one optional boolean, `fuelAvailable`. `true` and omission are equivalent. `false` applies a `1.35` factor once inside processing-time difficulty and again inside processing-cost calculation; labor rises transitively because time rises. Material cost, waste multiplier, output identities, output quantity, and quality are unchanged. The explanation records only that a fuel shortfall penalty was applied.

No runtime branch selects a fuel item, calculates fuel quantity, checks inventory, consumes fuel, chooses a fuel grade, generates ash or emissions, or persists energy state. Automatic item-value and market-value resolution always calls the craft estimator with fuel available, so current fuel penalties do not enter normal item values, settlement prices, transport prices, or trade unless an external caller directly requests a fuel-shortfall estimate.

Workplace progression contains 105 descriptive power modes: manual 44, animal 16, water 3, wind 2, steam 2, and hybrid 38. No tier is selected and none of these modes affects chain resolution. Water, wind, animal, steam, and hybrid power are not evidence of an active grid, mover, fuel, infrastructure, capacity, recharge, or substitution mechanic.

One separate infrastructure input is active: settlement infrastructure tiers, route access, and survival properties form a clamped `0.9`-to-`1.6` production-capacity modifier that divides processing time. It is a settlement macro modifier, not workplace availability or power. Item `materialDifficultyProfile` also affects time/cost through input-material averages. Workplace site tags, site requirements, plot profile, building placement, services, weather, local resource access, and environmental limits are not consulted by craft resolution.

Gate 7 may research bounded magitech substitution against the ordinary-production baseline, but it must treat all current workplace power modes and the fuel boolean as descriptive or estimator-only evidence. It must not infer an active energy system or solve the resolver discrepancies. Matter/energy conservation, finite capacity, recharge, mundane housing, maintenance, failure, scarcity, and institutional access remain mandatory boundaries.

## 17. Value, Market, Settlement, Trade, And Transport Propagation

The live semantic propagation is:

`chain/workplace declarations -> runtime indexes -> macro craft estimate -> recipe-derived item value -> local market priceView -> transport repricing -> trade margin/opportunity/dispatch`

The exact behavior by layer is:

1. `resolveItemRuntimeValue` bypasses chains for `source_derived` keys. For other indexed keys it executes every candidate with tools assumed sufficient, fuel available, and inferred skills; lowest effective cost wins, with chain ID as tie-breaker.
2. The candidate role is ignored. When the requested item is absent from the returned output, value calculation falls back to the first returned output quantity. Byproduct candidate values use full craft total cost rather than the craft result's 12% byproduct basis.
3. `resolveAssociatedSkillId` separately uses the first indexed candidate's chain primary skill, so labor pressure can be attributed to a different process than the cheapest value winner.
4. `buildSettlementMarketStates` builds a price view for all 1,617 market keys for each requested settlement. Local buy/sell price combines resolved value with stock, demand, labor, processing, import, and settlement posture.
5. Transport applies stock movement and then calls local price resolution again. Chain-derived value therefore survives repricing even though the stock movement itself is not a production batch.
6. Autonomous trade reads origin local sell and destination local buy prices to calculate margins, rank opportunities, select cargo, and dispatch orders. Resolver differences can change opportunity viability and choice.

These propagation paths mean output reachability, one-unit inputs, tool assumptions, candidate role, cheapest-candidate choice, and skill association can affect multiple macro-economic consumers. They do not mean a physical craft occurred.

Two structural consumers must be stated narrowly. Settlement simulation receives market states but currently reads stock/storage context rather than `priceView` or chain-derived labor pressure. Institution runtime also receives settlement market state but does not read production-chain price fields. Current chain cost/value defects therefore do not directly alter their semantic projections. The UI economy-clarity mapper can render supplied craft/value/price explanation objects, but no live caller was found; it is a dormant presentation surface, not a current production consumer.

Focused trade and institution tests pass. The directly relevant transport test currently has four pre-existing failures out of seven: mule/`pack_train` compatibility, the expected draft-animal diagnostic, and two grain-availability assertions. Those failures do not prove a chain resolver defect, but they prevent claiming a fully green downstream transport baseline. The settlement simulation test separately fails the Stonevein placed-building assertion described in Section 15.

## 18. Recipe Non-Inheritance And Revised 0.6.5 Implications

The recipe schema and validator make every planned transformation complete and explicit: inputs and outputs carry integer quantities and roles; workplaces, tool item keys, and skill requirements are explicit; and `relatedProductionChainId` is an optional existence-checked reference. No loader or validator copies chain/workplace inputs, outputs, quantities, tools, jobs, tiers, skills, value, cost, or fallback behavior into a recipe. The civilization engine does not load `crafting.recipes`.

All 12 current recipes differ from a direct default resolution of their linked chain:

| Planned recipe / linked chain | Recipe-owned transformation | Reproduced default chain difference |
| --- | --- | --- |
| `recipe.bread_dough_to_bread_loaf` / `chain.food.bread` | `bread_dough 1 -> bread_loaf 1` | Runtime consumes two dough occurrences plus flour and grain, and returns loaf plus hardtack. |
| `recipe.butchered_meat_to_smoked_meat` / `chain.food.preserved_meat` | `butchered_meat 1 + salt_crystal 1 -> smoked_meat 1` | Default deer variant consumes deer-meat occurrences and returns a deer-specific primary plus hide/bone/blood/dripping byproducts. |
| `recipe.cured_leather_to_leather_panel` / `chain.leather.components` | `cured_leather 1 -> leather_panel 2` | Runtime also consumes tallow, returns one panel scalar plus four other outputs. |
| `recipe.fiber_to_cloth` / `chain.textile.cloth_grades` | `fiber 2 -> cloth 1` | Runtime selects flax/linen/wool/yarn inputs and coarse/fine cloth outputs. |
| `recipe.grain_bundle_to_flour` / `chain.food.flour` | `grain_bundle 1 -> flour 1` | Variant replacement yields grain plus wheat-seed inputs and wheat-flour/bran/straw outputs. |
| `recipe.hide_raw_to_cured_leather` / `chain.leather.cured` | `hide_raw 1 -> cured_leather 1` | Default runtime resolves no inputs and returns cured leather plus three byproducts. |
| `recipe.iron_ingot_to_metal_rod` / `chain.metal.components` | `iron_ingot 1 -> metal_rod 2` | Workplace fallback selects a broad 14-key input set and returns one-unit rod plus 11 other outputs. |
| `recipe.iron_ore_to_iron_ingot` / `chain.metal.iron_ingot` | `iron_ore 2 -> iron_ingot 1` | Runtime selects multiple ore/pig-iron/charcoal inputs and returns ingot plus slag/scale. |
| `recipe.log_to_plank` / `chain.lumber.plank` | `log 1 -> plank 2` | Input identity matches, but default variant returns one softwood-plank scalar plus resin/sawdust instead of generic plank quantity two. |
| `recipe.metal_rod_and_tool_handle_to_hammer` / `chain.utility.tools` | `metal_rod 1 + tool_handle 1 -> hammer 1` | Hammer output matches, but workplace fallback selects a broad 20-key input set. |
| `recipe.plank_to_tool_handle` / `chain.lumber.components` | `plank 1 -> tool_handle 2` | Runtime selects broad lumber inputs and returns wood shaft plus five other outputs; tool handle is not the final primary. |
| `recipe.plank_to_wood_shaft` / `chain.lumber.components` | `plank 1 -> wood_shaft 2` | Runtime uses the same broad inputs/outputs and returns one derived scalar rather than quantity two. |

These differences do not invalidate the recipes; they demonstrate non-inheritance. They do invalidate any attempt to use the linked resolver as the recipe's hidden execution, quantity, validation, or value-admission authority.

The blocked historical `0.6.5` target named 18 proposed rows. All 18 lack chain/workplace quantity authority. Fifteen also name at least one input absent from the complete named-chain input/intermediate/step/variant vocabulary:

- `recipe.flax_bundle_to_linen_thread`
- `recipe.wool_fleece_to_yarn`
- `recipe.yarn_to_wool_cloth`
- `recipe.linen_thread_to_fine_cloth`
- `recipe.fish_raw_and_salt_crystal_to_smoked_fish`
- `recipe.plank_to_barrel_stave`
- `recipe.barrel_stave_metal_ring_and_resin_pitch_to_cask`
- `recipe.copper_ore_to_copper_ingot`
- `recipe.copper_ore_and_tin_ore_to_bronze_ingot`
- `recipe.iron_ingot_to_metal_plate`
- `recipe.iron_ingot_to_blade_blank`
- `recipe.blade_blank_tool_handle_and_leather_strap_to_arming_sword`
- `recipe.cured_leather_to_leather_strap`
- `recipe.cured_leather_to_hardened_leather_panel`
- `recipe.metal_ring_and_leather_strap_to_mail_coif`

The other three remain individually blocked for authored static evidence: `recipe.flour_to_bread_dough` is the only exact chain input/output step shape but has no authoritative ratio; `recipe.flour_to_pastry_dough` omits chain-declared `honeycomb`; and `recipe.pastry_dough_and_smoked_meat_to_savory_meat_pie` has no exact chain step consuming `smoked_meat`. Identity closure alone does not resolve those questions.

Revised `0.6.5` can proceed after all seven research artifacts are integrated only if every selected row is dependency-closed from recipe-owned evidence and explicitly authored integer quantities. It must treat the chain link as descriptive, avoid all runtime resolver/value/candidate calls for admission, avoid copying workplace tags or I/O as an exact bill, and record quantity confidence. A row without sufficient evidence must be omitted or held, not filled from a fallback. This isolation is the basis for the no-prerequisite decision in Section 22.

## 19. Documentation, Loader, Type, Schema, And Validator Reconciliation

### Accurate authority statements

The crafting authority and recipe-schema decisions accurately separate recipe-owned explicit transformations from production-chain macro context and from future physical execution. They also accurately preserve current chain consumers rather than migrating them. The economy authority decision accurately identifies live value, price, stock, transport, and trade runtime owners and forbids descriptive economy records from becoming execution state. The current research program and Gates 3-6 accurately warn that validated content is not automatically runtime-active.

### Stale or overstated documentation

| Source claim | Live contradiction | Recommended narrow reconciliation |
| --- | --- | --- |
| `docs/data-dictionary/economy.md` says workplace `workCycleHours` and per-cycle quantities make rates scale consistently. | All cycle values are placeholders; quantities are mostly placeholders and all are ignored. | Label these as validated future/profile fields, not current rate authority. |
| It presents tier-gated jobs, per-worker rates, tool penalties, tier profiles, plot capacity, progression, and upgrades as mechanics. | Jobs are not selected; numeric fields are placeholders; tier/progression/upgrade/plot profiles are omitted and ignored. | Distinguish catalog metadata from live runtime fields. |
| It says `integrationProfile` bonuses reward co-location. | Multipliers are placeholders and no profile consumer exists. | Describe intended metadata only. |
| It assigns `irrigationProfile` and `irrigated_plot` to workplaces. | Normal lint explicitly rejects both on workplaces; infrastructure owns the irrigation flag. | Correct the owner to civilization infrastructure. |
| `no_output` and `reduced_output` names imply output effects. | Runtime preserves outputs and changes only time/cost; internal blocked state is discarded. | Document present behavior pending a contract decision; do not rename or fix in this audit. |
| Chain `stages` and `carriesForward` imply ordered material progression. | Steps execute in array order independently; 17 stages do not execute and nothing carries. | State macro topology versus estimator behavior explicitly. |
| Market/integration/workplace profile names imply price or availability authority. | The craft resolver ignores those profiles; market pricing uses separate value/settlement state. | Remove activation implications. |

Older historical prose stating that no crafting directory or recipe owner existed is preserved as chronology where clearly dated. It must not control current execution after `crafting.recipes` was added.

### Loader and TypeScript drift

Both production and workplace loaders use raw generic JSON casts; neither runs schema or semantic validation. `ProductionChainRecord` omits all eight `facilityStrategy` records, all 28 `variantFlag` fields, and all 136 authored variant `laborWeight` fields. It narrows `processingCostMode` to `fuel_tool_wear`, while validated live content contains 109 `fuel_tool_wear`, 11 `fuel_and_tool_wear`, and one `tool_wear`. The omitted metadata is currently ignored, but the enum mismatch makes the type factually incomplete.

`WorkplaceContentRecord` omits most validated profiles and state-like placeholders. Its required live fields are often optional in TypeScript. `WorkplaceIoItemRecord.quantityPerCycle` is typed as `Record<string, number>` even though 18 live values are numbers; the output collection reuses an input type requiring `consumptionType`, while live outputs carry `productionType`; yield-output typing also omits `productionType`. The raw cast hides these contradictions. Public `CraftResolutionState` also omits the resolver's internal `blocked` value.

### Schema and validator gaps

Production chains have strong custom semantic lint but no standalone strict JSON Schema. Lint verifies step-to-stage references, not reverse stage completeness, returned-target reachability, final-output closure, carry semantics, candidate role behavior, or recipe comparison. Workplace JSON has a strict schema with `additionalProperties: false`, but normal content lint does not execute schema conformance; `schema-files.test.mjs` proves only that schemas parse and expose a top-level type. Custom workplace lint validates most known fields and relationships but does not generally enforce the full schema, map tool tags to tool items, or prove placed-building access.

The crafting recipe schema and validator correctly enforce complete explicit records and non-inheriting chain existence. Resource and commodity validators similarly treat related chains as static links. The resource validator accepts only nested processing-step stage references, so the 17 unused top-level chain stages cannot be treated as validated resource stages. Settlement-economy validation resolves static references but does not create facility placement or production execution.

The smallest future reconciliation is documentation plus type/schema/validator/focused-test clarification before any resolver change. It must not activate omitted fields merely to make types look complete, and it is not a prerequisite for an isolated static recipe package.

## 20. Focused-Test Coverage Matrix

Passing broad tests count only where an assertion reaches the named branch. "Prerequisite" means prerequisite to changing that behavior, not to the quarantined static recipe package.

| Behavior | Implementation location | Existing test / assertion | Coverage | Intended result | Recommended focused test | Prerequisite | Downstream consumers |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Chain index and exact chain selection | `createRuntimeIndexes`; `resolveCraftAtSettlement` | `tests/unit/civilization-runtime-economy.test.mjs` — "material difficulty increases resolved production cost for harder metals" and "craft resolution uses worker skill to reduce time and cost" use known records but do not assert index contents | partially covered | Known ID resolves; unknown throws | Assert exact candidate list, order, duplicate-key candidates, unknown ID | yes | craft, value, market |
| Generic target selection | `resolveVariant`; `resolveStepOutputs` | None | uncovered | unresolved for 11 conflicts | Generic primary against default variant and expected failure/substitution contract | yes | output, value, market |
| Explicit variant selection | `resolveVariant` | None | uncovered | valid explicit ID selects variant | One primary and one byproduct target per variant | yes | output, candidate value |
| Invalid variant | `resolveVariant` | None | uncovered | live silent null; intent unresolved | Invalid ID result/error contract | yes | public craft callers |
| Target-selected variant | `resolveVariant` | None | uncovered | live primary/byproduct match | Assert primary and byproduct target behavior and role | yes | candidate closure |
| Selected-input variant | `resolveVariant` | None | uncovered | selected keys are selector only | Known, mixed-known, and unknown key sets | yes | input and value |
| Explicit step input | `resolveStepInputs` | None; the bread cost test does not assert resolved input source | uncovered | explicit list normally first | Exact retained list and one-unit occurrence count | yes | material cost/value |
| Variant input override | `resolveStepInputs` | None | uncovered | authored intent unresolved in six cases | All six replacements plus add-vs-replace decision | yes | material/value/recipes |
| Workplace input fallback | `resolveStepInputs`; workplace scoring | None | uncovered | macro heuristic is live | Positive score, alternative group, first-three, output exclusion | yes | cost/value |
| Chain external fallback | `resolveStepInputs` | None | uncovered | live final fallback | Empty and nonempty external lists; target-dependent branch | yes | cost/value |
| Last-intermediate fallback | `resolveStepInputs` | None | uncovered | reverse behavior likely defective | Bread and fresh-cheese exact first-step inputs | yes | cost/value/topology |
| Explicit step output | `resolveStepOutputs` | None; no existing test asserts resolved output identity or role branch | uncovered | list first unless variant flags | Target present/absent and commodity role partition | yes | output/value |
| Variant output replacement | `resolveStepOutputs` | None | uncovered | live flags replace; intent unresolved | Primary-only, byproduct-only, both flags | yes | output/value |
| Workplace output fallback | `resolveStepOutputs` | None | uncovered | first/requested plus item-class role heuristic | Target offered, target absent, no target, noncommodity remainder | yes | output/value |
| Requested-target fallback | `resolveStepOutputs` | None | uncovered | live target accepted | Valid and invalid arbitrary target | yes | output/value |
| Empty-output closure | `resolveStepOutputs` | Consistency aggregate does not call resolver | uncovered | every live step currently resolves something | Cover all empty branch sources and no-source fixture | yes | craft/value |
| Stage reverse closure | production-chain lint; resolver loop | None | uncovered | unresolved for 17 declarations | Assert declared stages without steps are accepted/rejected per decision | yes | topology/docs |
| Duplicate-stage ordering | resolver loop | None | uncovered | array order is live | Six duplicate-stage chains retain order | yes | cost/explanation |
| Final-step-only result | final re-resolution in craft estimator | None | uncovered | live but disputed | Earlier outputs absent/preserved per decided contract | yes | output/value |
| Byproduct omission and role | final output map; value resolver | None | uncovered | live omission/role divergence | All 62 omissions; byproduct 12% versus item value basis | yes | value/market |
| Intermediate and byproduct carry | resolver loop | None | uncovered | no carry is live; intent conflicts with label | Multi-step fixture with explicit intermediate/byproduct | yes | topology/future runtime |
| `carriesForward` | explanation only | None; `tests/unit/civilization-runtime-economy.test.mjs` — "market and craft results expose structured explanations" asserts only nonempty breakdown | uncovered | intent unresolved | True/false invariance or implemented carry after decision | yes | docs/runtime |
| Chain/step skill fallback | `createSkillEffect` | `tests/unit/civilization-runtime-economy.test.mjs` — "craft resolution uses worker skill to reduce time and cost" covers a checked bread skill, not extraction/chain fallback | partially covered | checked step override is live | Checked, unchecked extraction, chain fallback, recipe mismatch | yes | time/cost/labor pressure |
| Missing skill rank | `createSkillEffect` | None | uncovered | live inference/defaults known | Checked inference and unchecked rank 60 | yes | time/cost |
| Low skill and minimum | `createSkillEffect` | `tests/unit/civilization-runtime-economy.test.mjs` — "craft resolution uses worker skill to reduce time and cost" compares rank 22/120 but does not assert minimum/output contract | partially covered | output persists; label ignored | Below-minimum outputs, each dimension, `lowSkillOutcome` non-use | yes | cost/quality/quantity |
| Missing tools | `getWorkplaceToolPenalty` | None | uncovered | live cost-only penalty | Undefined, empty, complete, partial tag sets | yes | time/cost/public state |
| All-job tool aggregation | `getWorkplaceRequiredToolTags` | None | uncovered | live union | Primary-only versus support-only missing tags | yes | time/cost |
| First-primary penalty | `getWorkplaceToolPenalty` | None | uncovered | live first-primary; intent unresolved | Multiple-primary and mixed-mode workplaces | yes | time/cost/block |
| `blocked` and `no_output` | internal tool result; public state | None | uncovered | live discard conflicts with label | Assert public result/error/output contract | yes | external caller |
| Active job selection | no implementation | None | uncovered | later owner | Explicit non-activation now; stateful selection later | no | future production |
| Tier selection | no implementation | None | uncovered | later owner | Explicit non-activation until numeric/state owner exists | no | future production |
| Progression and upgrades | no implementation | None | uncovered | later owner | Invariance/non-activation test before any activation | no | future facility state |
| Numeric workplace quantities | ignored in resolver | Recipe validator tests recipe quantities only | uncovered | non-inheritance is intended | Numeric workplace values do not alter craft quantity | yes | revised `0.6.5`, value |
| Workplace `productionType` | ignored in resolver | None | uncovered | intent unresolved | Primary/byproduct authored role versus live heuristic | yes | output/value |
| Fuel | craft-estimator penalty | None | uncovered | boolean estimator behavior known | `fuel_heavy` true/false/undefined and ordinary-step invariance | yes | direct craft; not normal value |
| Processing-cost mode | explanation label only | None; `tests/unit/civilization-runtime-economy.test.mjs` — "market and craft results expose structured explanations" does not assert the mode | uncovered | no mode branch is live | Three live values produce same formula or branch after decision | yes | cost/value/docs |
| Quantity | `createSkillEffect`; final mean | `tests/unit/civilization-runtime-economy.test.mjs` — "recipe dimensions only affect quantity when the recipe allows it" compares bread and fresh cheese | partially covered | formula known; no exact batch authority | Two enabled steps, no enabled steps, multiple primaries/byproducts | yes | craft/value |
| Quality | `createSkillEffect`; final mean | Bread low/high cost test does not assert quality | uncovered | formula known; no persistent quality | Dimension gating, mean, value-basis application | yes | craft/value |
| Item value candidate choice | `resolveItemRuntimeValue` | `tests/unit/civilization-runtime-economy.test.mjs` — "material difficulty increases resolved production cost for harder metals" reaches item-value resolution but not candidate ordering/role | partially covered | cheapest/tie/source bypass live | Cheapest, tie, source-derived, missing target, candidate role | yes | item value/market |
| Associated labor skill | `resolveAssociatedSkillId` | None; `tests/unit/civilization-runtime-economy.test.mjs` — "local market prices respond to settlement supply and demand pressure" does not assert skill attribution | uncovered | first-candidate behavior live but inconsistent | Mixed-skill candidate where cheapest differs | yes | local price |
| Market propagation | `buildSettlementMarketStates`; local pricing | `tests/unit/civilization-runtime-economy.test.mjs` — "local market prices respond to settlement supply and demand pressure" and "market and craft results expose structured explanations" | partially covered | price response known | Force production-candidate cost change and assert local buy/sell delta | yes | market/trade |
| Transport repricing | `repriceMarketStates` | None; `tests/unit/civilization-transport-runtime.test.mjs` exercises movement but never asserts production-value repricing | uncovered | stock reprice known; red baseline | Exact chain-value-to-reprice assertion after transport failures resolved | yes | transport/trade |
| Trade propagation | trade opportunity/dispatch | `tests/unit/civilization-trade-runtime.test.mjs` — "autonomous trade evaluation produces viable, explained opportunities" and "autonomous trade dispatch creates caravans, reservations, and origin stock changes" | partially covered | price margin use known | Candidate/value difference changes viability and selected cargo | yes | trade orders |
| Institution/settlement semantic use | institution and settlement simulation | `tests/unit/civilization-institutions-runtime.test.mjs` — "institution profiles derive ownership, guilds, religion, magic, and crystal state from settlement simulation"; `tests/unit/civilization-settlement-simulation.test.mjs` — "settlement simulation profiles derive non-uniform labor mixes and businesses from geography" | partially covered | stock-only for chain trace | Assert price changes alone do not alter these projections | no | projections |
| Consistency behavior | `simulation-consistency.ts` | `tests/unit/civilization-system-consistency.test.mjs` — "system consistency report closes essential goods, geography, and building coverage" asserts aggregate zeros | partially covered | graph behavior known | Fixture with resolver-unreachable output and missing reverse stage | yes | audit/diagnostics |
| Recipe non-inheritance | recipe validator/schema | `tests/unit/crafting-recipes-validation.test.mjs` — "accepts optional relatedProductionChainId as a non-inheriting cross-reference" and "validates the live first planned recipe content seed" | covered | explicit recipe ownership accepted | Retain and add invariance against chain/workplace changes | yes for later changes | revised `0.6.5` |
| All 12 recipe/chain comparisons | audit probe only | None | uncovered | differences accepted under non-inheritance | Table-driven exact input/output/quantity comparison | no for static authoring; yes for coupling changes | integration |
| Placed workplace/building access | settlement simulation | `tests/unit/civilization-settlement-simulation.test.mjs` — "settlement simulation profiles derive non-uniform labor mixes and businesses from geography", assertion `stonevein.buildings.some(... category === "extractive")`, currently fails | partially covered | extractive presence intended; exact fix unresolved | Approved subterranean-city compatibility plus craft non-use | yes for placement correction | settlement projection |

Required minimum focused-test groups before a future resolver correction are: candidate/tie/source/role; complete variant selection; all six input sources; all output branches; stage/final/carry closure; tool/job/block behavior; skill fallback/dimensions; fuel; quantity/quality/byproduct value; value-to-market-to-transport-to-trade propagation; and the 12 non-inheritance comparisons. Static revised `0.6.5` needs only the existing recipe validation plus explicit quarantine assertions in its implementation gate.

Validation at the exact starting head reproduced: the mandatory four-file group passed 136/136; schema-file checks passed 105/105; normal content lint reported `content-lint: ok (67 files checked)`; trade and institution runtime tests passed 4/4. The combined transport/settlement group passed 3/8 and failed 5/8: transport passed 3/7 and failed the four pre-existing cases described in Section 17, while settlement simulation failed 0/1 on Stonevein. No test or content file was changed, and no temporary probe remained.

| Validation command | Result |
| --- | --- |
| `node --test tests/unit/civilization-runtime-economy.test.mjs tests/unit/crafting-recipes-validation.test.mjs tests/unit/civilization-system-consistency.test.mjs tests/unit/settlement-economy-validation.test.mjs` | 136 passed, 0 failed |
| `node --test tests/unit/schema-files.test.mjs` | 105 passed, 0 failed |
| `npm.cmd run tool:content-lint` | `content-lint: ok (67 files checked)` |
| `node --test tests/unit/civilization-trade-runtime.test.mjs tests/unit/civilization-institutions-runtime.test.mjs` | 4 passed, 0 failed |
| `node --test tests/unit/civilization-transport-runtime.test.mjs tests/unit/civilization-settlement-simulation.test.mjs` | 3 passed, 5 failed: transport 3/7 and settlement simulation 0/1, all exact failures disclosed above |

## 21. Discrepancy Matrix

Each row uses only the approved classification, severity, and disposition vocabulary. Multiple classifications indicate separate aspects of one reproduced discrepancy; severity is assigned once per row.

| ID | Title | Exact fields / paths | Affected records | Affected consumers | Reproduced behavior | Intended-behavior evidence | Classification | Severity | Confidence | Revised `0.6.5` relevance | Disposition | Required tests | Correction boundary | Unresolved authored question |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PC-01 | Reverse stage closure absent | `stages[]`; `recipeProfile.processingSteps[].stageRef`; production-chain lint | 17 stages / 6 chains | lint, resolver, consistency, docs | Every step must name a declared stage; declared stages need no step | Topology prose implies meaningful stages; no rule requires one step each | `schema_or_validator_precondition`, `authored_input_requirement`, `focused_test_gap` | medium | high | Never infer missing recipe stages | `defer_to_integration` | Missing-stage and duplicate-stage fixtures | Decide validator/content/doc owner only; no execution | Add steps, remove stages, or preserve descriptive topology? |
| PC-02 | Generic primary selects default variant | `primaryOutput`; `defaultVariant`; variant outputs; `resolveVariant` | 11 chains | craft, candidate value, market | Generic request can return only variant-specific output | No accepted generic-versus-variant contract | `runtime_implementation_defect`, `authored_input_requirement`, `focused_test_gap` | high | high | Do not use resolver output identity | `quarantine_from_revised_0_6_5` | All 11 generic targets | Resolver/content contract only after author decision | Generic abstraction, default substitution, or failure? |
| PC-03 | Variant input replaces explicit input | `processingSteps[].inputs`; `usesVariantInputs`; variant `inputs` | 6 steps | craft material cost, value, market | Nonempty explicit list is discarded | Flag name proves variant use, not replace-versus-add | `authored_input_requirement`, `focused_test_gap` | high | high | Recipe bills must remain explicit | `quarantine_from_revised_0_6_5` | All six cases, add-versus-replace | No content/runtime edit without authored intent | Replace, merge, or select per step? |
| PC-04 | Declared output does not close final result | top-level/variant outputs; final `resolveStepOutputs`; candidate fallback | 17 chains / 62 omissions; 48 unreachable candidates | craft, item value, market, trade | Last step alone returns outputs; missing target falls back to first returned quantity | Indexing advertises targets; no accepted final-closure rule | `runtime_implementation_defect`, `schema_or_validator_precondition`, `focused_test_gap` | high | high | Never derive outputs or admit rows from resolver | `quarantine_from_revised_0_6_5` | 62 omissions, 48 candidate entries, role branches | Coordinate index/resolver/validator/public contract | Top-level closure, accumulated steps, or target-specific abstraction? |
| PC-05 | `carriesForward` has no effect | `valuePropagation.carriesForward`; step loop; public explanation | 121 chains | craft explanation, docs, integration | True is echoed; no material/output/quality state carries | Field name and docs imply propagation; no executable specification | `documentation_defect`, `runtime_implementation_defect`, `focused_test_gap` | high | high | Explicitly prohibit inheritance/carry assumptions | `defer_to_integration` | True/false invariance and multi-step carry fixture | Clarify docs or define later work-order semantics | Descriptive, obsolete, or intended but unimplemented? |
| PC-06 | Last-intermediate fallback runs in reverse | `intermediateItems`; `resolveStepInputs` | 2 default steps | material cost, value, explanations | Early bread/cheese steps consume the final named intermediate | Macro topology gives no evidence for reverse consumption | `runtime_implementation_defect`, `focused_test_gap` | high | high | Do not copy fallback inputs | `quarantine_from_revised_0_6_5` | Bread and fresh-cheese exact inputs | Resolver-only correction after topology decision | Should intermediates be inputs, outputs, or descriptive vocabulary? |
| PC-07 | Broad workplace/external fallback is economic input authority | empty step inputs; workplace `ioProfile.inputs`; `externalInputs` | 171 workplace steps; 94 external branches, 93 empty | material cost, value, market | Heuristic takes scored alternatives or first three; most external fallbacks are empty | Accepted chain owner is macro context, not exact bill | `intentional_abstraction`, `authored_input_requirement`, `focused_test_gap` | high | high | Exclude fallback from recipe evidence | `quarantine_from_revised_0_6_5` | Every input branch and representative families | Preserve estimator until separate resolver work | Which broad inputs are substitutes versus cumulative requirements? |
| PC-08 | Chain/workplace quantities are not batch authority | absent chain quantity; workplace `quantityPerCycle`; runtime one-unit scalar | 121 chains; 1,012 workplace I/O rows | craft, value, recipe integration | One unit per input occurrence; 18 numeric workplace values ignored; output scalar mostly one | Recipe decision assigns exact quantities to recipes | `intentional_abstraction`, `authored_input_requirement`, `documentation_defect`, `focused_test_gap` | high | high | All selected quantities need recipe-owned evidence | `quarantine_from_revised_0_6_5` | Quantity non-inheritance and scalar branches | No rate activation or quantity copying | What game-scale integers should each selected row use? |
| PC-09 | Candidate role and returned target are ignored by value choice | candidate `role`; `CraftResolutionState.outputs`; item-value fallback | 916 entries; 419 byproduct returns; 48 missing returns | item value, local price, transport, trade | Full total cost prices byproduct/missing target; 12% craft basis unused | Public role/basis suggests distinction, but no value contract states it | `runtime_implementation_defect`, `focused_test_gap` | high | high | No value-based recipe admission | `defer_to_integration` | Primary/byproduct/missing-target candidate cases | Value/resolver contract and regression tests | Should byproducts use marginal, allocated, or full process cost? |
| PC-10 | Labor pressure uses first candidate, not value winner | `resolveAssociatedSkillId`; `chainsByOutput` order | 13 current mismatched keys | local labor pressure, buy/sell price, explanations | Cheapest process wins value; first process supplies skill | No accepted split-authority rationale | `runtime_implementation_defect`, `focused_test_gap` | high | high | Do not select recipe skill from price association | `defer_to_integration` | Mixed-skill candidate including `wine_cask` | Value/market-only correction | Skill of cheapest chain, target process, or aggregate? |
| PC-11 | Gate 6 shadow wording conflates index and selection | `chainsByOutput`; `outputItemsBySkill`; source mode; tie order | 120/1 index paths; 12 never chosen; 5 tie-shadowed | coordination, integration reasoning | Exact one is foraging hut for ordered-index participation, not value choice | Audit probes establish three distinct mechanisms | `documentation_defect`, `non_blocking_optional_depth`, `focused_test_gap` | medium | high | Use precise index language only | `document` | Tie/order/source-derived regression | Documentation and diagnostics only | Whether candidate ordering should be stable policy remains later work |
| PC-12 | Invalid variant and arbitrary target are accepted | request `variantId`; `targetOutputItemKey`; `resolveVariant` | Public resolver surface | external craft callers, candidate probe | Invalid variant yields null; arbitrary target continues | No documented validation/error contract | `authored_input_requirement`, `focused_test_gap` | medium | high | Revised package must not call resolver | `defer_to_integration` | Invalid chain/variant/target matrix | Public API decision before behavior change | Strict failure or permissive estimator? |
| PC-13 | Skill authorities diverge and low-skill outcome is inert | chain/step/recipe skills; `lowSkillOutcome`; rank inference | 227 checked + 84 unchecked steps; Gate 6 S54 set | time, labor, waste, quality, quantity, price | Step overrides chain; extraction defaults; below minimum never blocks; outcome ignored | Recipe skill is explicitly independent; exact chain intent incomplete | `intentional_abstraction`, `authored_input_requirement`, `documentation_defect`, `focused_test_gap` | medium | high | Keep recipe skill explicit | `quarantine_from_revised_0_6_5` | Fallback, inference, below-minimum, dimension tests | Skill reconciliation without eligibility activation | Which skill belongs to each macro process? |
| WP-01 | All-job tool union and first-primary policy | jobs, roles, required tags, penalty mode | 208 jobs / 58 workplaces; 47 mixed modes | craft time/cost | All jobs contribute tags; first primary alone chooses mode | No active-job policy exists | `authored_input_requirement`, `focused_test_gap`, `blocked_pending_later_runtime_ownership` | high | high | Recipe tools must remain exact and independent | `quarantine_from_revised_0_6_5` | Union, support-only miss, multiple-primary mode | Future job/facility owner; do not infer active job | Which jobs are active for a given operation? |
| WP-02 | `no_output` computes then discards block | missing-tool penalty; internal `blocked`; public contracts | 68 job penalties; 45 first-primary workplaces | public craft estimate, time/cost | Outputs persist; only factor/notes survive | Literal label and docs conflict with result | `runtime_implementation_defect`, `documentation_defect`, `focused_test_gap` | high | high | Do not use tool penalty as recipe gate | `defer_to_integration` | Undefined/empty tools, no-output public state | Decide failure/output contract before runtime edit | Block, reduce output, or rename as inefficiency? |
| WP-03 | Tool tags lack exact item identity | `requiredToolTags` | 5 of 100 unique tags | craft requests, recipe comparison | Capability tags have no exact suffix-matching tool item | Nearby names are not aliases | `authored_input_requirement`, `schema_or_validator_precondition` | medium | high | Never convert these tags into recipe tools | `quarantine_from_revised_0_6_5` | Tool-tag/item closure test after decision | Content identity/alias decision, no guesses | Add canonical tools, approved aliases, or keep abstract tags? |
| WP-04 | Workforce, tier, progression, and upgrades are inactive placeholders | labor/jobs numeric fields; tier/progression/upgrade/efficiency/integration profiles | All 58; 105 tiers; 116 upgrades | docs; future facility runtime | Fields are placeholders or ignored; no state selected | Research and owner decisions reserve later runtime | `intentional_abstraction`, `blocked_pending_later_runtime_ownership` | medium | high | Capability references only | `defer_to_later_runtime` | Explicit non-activation before later implementation | Future facility/job/tier owner | What state model and numeric authoring are intended? |
| WP-05 | Power modes are descriptive, not production energy | progression `powerMode`; site/infrastructure relations | 105 tier entries | docs, Gate 7, future runtime | No mode changes resolver or consumes power | Gate 7 requires ordinary baseline and conservation | `blocked_pending_later_runtime_ownership`, `documentation_defect` | medium | high | Do not treat mode as recipe availability | `defer_to_gate_7` | Non-activation assertion; later state tests | Gate 7 research only; runtime remains later | Which substitutions are plausible without activating them? |
| PC-14 | Fuel boolean is a cost-only assumption | `fuelAvailable`; `fuel_heavy`; processing formula | 50 steps / 37 chains | direct craft estimates | False applies 1.35 twice; no item or energy consumed; normal value assumes true | Macro estimator supports a shortage scalar only | `intentional_abstraction`, `documentation_defect`, `focused_test_gap` | medium | high | No recipe fuel derivation | `document` | Fuel true/false/undefined and ordinary step | Preserve until an owner-specific fuel decision | Should a future recipe name fuel, service, or neither? |
| PC-15 | Chain loader type is incomplete | `facilityStrategy`; `variantFlag`; `laborWeight`; `processingCostMode` | 8, 28, 136 fields; 12 non-narrow enum rows | loader, TypeScript consumers, docs | Raw cast accepts omitted fields and three live modes; runtime mostly ignores them | Semantic lint explicitly accepts live shapes | `schema_or_validator_precondition`, `documentation_defect` | high | high | Quarantine omitted fields | `defer_to_integration` | Loader/type fixture for all live shapes | Type reconciliation without activation | Should ignored metadata remain loaded raw or become typed? |
| WP-06 | Workplace loader/type contradicts live I/O | `WorkplaceContentRecord`; `WorkplaceIoItemRecord`; numeric quantities; `productionType` | All 58; 18 numeric quantities; 365 outputs | loader, resolver, future consumers | Raw cast hides omitted fields, numeric/object mismatch, wrong output shape | Strict schema and semantic lint describe live JSON | `schema_or_validator_precondition`, `documentation_defect` | high | high | Do not rely on TypeScript shape for recipes | `defer_to_integration` | Full live workplace type/schema conformance fixture | Type-only correction must not activate mechanics | Which fields belong in runtime type versus a separate content type? |
| VAL-01 | Normal validation misses strict schema and resolver topology | workplace schema; chain lint; consistency report | 58 workplaces; 121 chains | CI/lint, integration | Schema parse test is not data conformance; graph lint misses reverse/final closure | Validation goals favor strict authored content | `schema_or_validator_precondition`, `focused_test_gap` | high | high | Keep implementation gate explicit | `defer_to_integration` | Schema conformance and topology fixtures | Validator/test only unless content policy changes | Which topology mismatches should fail content lint? |
| DOC-01 | Economy dictionary overstates activation and has stale irrigation owner | `docs/data-dictionary/economy.md`; README feature descriptions | Direction-bearing docs | developers, integration, Gate 7 | Rates, jobs, tiers, bonuses, plot/power presented actively; irrigation contradicts lint owner | Live runtime and lint provide direct contrary evidence | `documentation_defect` | medium | high | Do not use prose as recipe evidence | `defer_to_integration` | Documentation assertion/search checks if available | Documentation-only correction | Which descriptions are intended future design versus current state? |
| CNT-01 | Stonevein has no placed extractive building | settlement/site class; building compatibility | Stonevein plus relevant building templates | settlement simulation | Subterranean city instantiates zero buildings despite mining businesses | Existing focused test requires an extractive building | `factual_content_defect` | high | high | Workplace recipe refs remain capability-only | `defer_to_integration` | Existing failure plus approved compatibility case | Narrow settlement/building content correction | Which underground-city building pattern is canonical? |
| REC-01 | Current linked recipes intentionally differ from macro resolver | all 12 recipe records and related chains | 12 recipes / 8 families | recipe validator, integration | Every comparison differs in input, output, or quantity | Explicit non-inheritance decision and recipe notes | `intentional_abstraction` | low | high | Preserve complete recipe ownership | `preserve` | Retain non-inheritance test; optional comparison table | No correction from difference alone | None for accepted 12; balance remains later |
| REC-02 | Historical 18-row target lacks bounded authoring evidence | proposed inputs/outputs/quantities and chain links | 18 rows; 15 chain-input gaps; 3 special cases | revised `0.6.5` integration | Identities resolve, but exact relationships/ratios do not | Recipe reconciliation requires explicit, evidence-backed integers | `authored_input_requirement` | high | high | Select, revise, or omit rows from integrated evidence; quarantine disputed chain-derived evidence | `defer_to_integration` | Dependency closure and quantity-confidence checks | Static recipe authoring only | What exact bounded rows and integers survive seven-gate synthesis? |
| TST-01 | Resolver branch coverage is materially incomplete | tests listed in Section 20 | All 121 chains touch at least one uncovered branch class | every resolver/downstream consumer | Five direct tests leave precedence, variants, carry, tools, fuel, value roles, and propagation unasserted | Audit probes reproduce behavior but are not regression tests | `focused_test_gap` | high | high | Static package must not depend on uncovered behavior | `defer_to_integration` | Section 20 minimum group | Tests before any resolver correction | Which disputed behaviors will integration choose to preserve first? |
| TST-02 | Downstream transport baseline is red | `civilization-transport-runtime.test.mjs` | 4 of 7 tests | transport and trade confidence | Harness/diagnostic/grain availability assertions fail | Test expectations are direct but outside production authority scope | `runtime_implementation_defect` | medium | high | No recipe dependence; disclose only | `reject_as_scope` | Repair within a separate transport run | Transport-only; no audit fix | Are failures content, fixture, or transport runtime defects? |
| CONS-01 | Consistency aggregate can pass despite resolver mismatch | `simulation-consistency.ts`; consistency test | 121 chains / 58 workplaces | diagnostics, coordination | Union graph reports closure without executing target/stage/carry semantics | Current test intentionally asserts aggregate graph only | `intentional_abstraction`, `documentation_defect`, `focused_test_gap` | medium | high | Do not treat report as recipe compatibility | `document` | Resolver-unreachable and missing-stage fixture | Extend diagnostics only after authority decision | Should consistency expose a second resolver-closure report? |

The matrix has 29 rows. Classification counts are non-exclusive: `intentional_abstraction` 7, `factual_content_defect` 1, `documentation_defect` 11, `schema_or_validator_precondition` 6, `focused_test_gap` 19, `runtime_implementation_defect` 8, `authored_input_requirement` 10, `non_blocking_optional_depth` 1, and `blocked_pending_later_runtime_ownership` 3. Severity counts are `critical` 0, `high` 17, `medium` 11, and `low` 1.

There are no critical rows: the audit found no unquarantinable convergence or corruption risk for a static, non-executing recipe package. High severity identifies live economic or authoring effects; it does not override the conditional isolation decision.

## 22. Narrow Prerequisite Correction Decision

The verified discrepancies do affect multiple chains, materials, item values, settlement prices, transport repricing, and trade. Several deserve later documentation, type, validator, focused-test, content, or runtime correction. They nevertheless fail the mandatory prerequisite test's third condition: none must be consumed by a bounded static recipe package.

Current recipes are complete, explicit, non-inheriting records; the civilization engine does not load them; the recipe validator checks only related-chain existence; and revised `0.6.5` can select dependency-closed relationships from the seven research artifacts without calling the chain resolver. The disputed chain/workplace inputs, outputs, quantities, skills, tool tags, jobs, tiers, progression, power, costs, values, and candidate order can all be excluded. Stonevein placement and the red transport baseline are also independent of static recipe validity.

The decision is conditional on all of the following integration gates:

1. every recipe owns complete input/output roles and positive integer quantities;
2. every item, tool, workplace, skill, and optional chain reference resolves canonically;
3. `relatedProductionChainId` remains descriptive and non-inheriting;
4. no row, quantity, role, tool, skill, workplace, or admission decision is derived from `resolveCraftAtSettlement`, runtime item value, market price, candidate ordering, workplace I/O, or chain fallback;
5. the 15 historical input-gap rows and three special rows are selected, revised, or omitted only from integrated authored evidence;
6. disputed resolver behavior is explicitly quarantined and the focused corrections remain separately scoped;
7. if integration violates any of these conditions, it must reverse this decision and route the smallest prerequisite correction before authoring.

`NO_NARROW_CORRECTION_REQUIRED_BEFORE_REVISED_0_6_5`

This token authorizes neither revised `0.6.5` nor a correction. Gate 7 and cross-domain integration still must be accepted first.

## 23. Gate 7 Handoff

The next executable route after this audit is accepted is:

`GPT-DR.magitech.production-infrastructure-substitution`

Expected artifact:

`docs/dev/tmp-magitech-production-infrastructure-substitution-research-2026-07-14.md`

Gate 7 inherits the complete Gate 6 physical-demand handoff unchanged: 43 physical-demand categories; 11 required multi-affinity questions; nine canonical affinities (`neutral`, `light`, `water`, `wind`, `ice`, `darkness`, `fire`, `stone/earth`, `thunder`); and 11 contexts (`Production`, `Agriculture`, `Food`, `Storage`, `Transport`, `Civic infrastructure`, `Expedition support`, `Combat-adjacent use`, `Medicine`, `Communication`, `Security`).

The 11 combinations remain fire + water, fire + wind, water + wind, water + ice, ice + wind, fire + ice, water + stone/earth, wind + stone/earth, thunder + conductive material, light + darkness, and neutral + any affinity. Each is a question, not a capability.

The ordinary-production baseline remains primary. Gate 7 must preserve matter and energy conservation, finite capacity, recharge, mundane housing and transmission, maintenance, observable failure, scarcity, institutional access, and an ordinary fallback. It must separately consider creation, extraction, movement, concentration, conversion, transfer, storage, release, stabilization, measurement, warning, and containment.

This audit adds one dependency: current chain/workplace power modes, fuel flags, value estimates, output quantities, site profiles, and infrastructure modifiers do not prove a magical production capability or an executable mundane production rate. Gate 7 may use them as demand/context evidence only. It must not decide affinity capabilities, crystal/shard/cluster suitability, vessel capacity, recharge balance, combinations, service routing, matter creation, energy generation, production substitution, or combat/civic/workshop/institutional magic balance in advance of its research.

## 24. Integration Disposition

| Action | Exact integration disposition |
| --- | --- |
| Preserve | Recipe-owned explicit transformations; chain macro context; workplace capability; item/source/material identity separation; live economy consumers; ordinary production baseline; non-inheritance; no physical execution inference. |
| Verify | All seven accepted research artifacts; canonical identity and dependency closure; quantity-confidence notes; every selected recipe row; prompt-hold hashes; audit counts; Gate 7's full 43/11/9/11 handoff. |
| Correct | Reconcile stale economy documentation, raw loader/type drift, validator/test gaps, candidate/value semantics, tool/block contract, and Stonevein placement only in separately authorized, owner-specific scopes. None is silently bundled into static recipes. |
| Quarantine | Chain/workplace-derived quantities, input/output fallback, variant replacement, stage/carry inference, workplace I/O roles/rates, job/tier/progression/upgrades, tool tags, fuel/power, resolver value/candidate results, and generic target behavior from revised `0.6.5`. |
| Defer | Gate 7 affinity research to the named next route; physical work orders, inventory, batches, facility state, active jobs/tiers, tools/condition, fuel/energy, capacity, maintenance, waste, persistent quality, queues, UI, save, and migration to later runtime owners. |
| Reject | Name-based aliases, chain-derived recipe integers, automatic workplace-tag-to-tool conversion, treating source/value closure as physical availability, exhaustive speculative catalogs, free matter/energy, infinite capacity, perfect quality/purification, and magic bypass of mundane dependencies. |

Integration must decide whether each temporary research/audit artifact still guards an upcoming implementation, should be promoted into a durable authority decision, or can be removed after its useful guidance is consumed. It must not edit the active or queued integration hold merely to install Gate 7; those files remain byte-identical holds until the seven-artifact gate is satisfied.

## 25. Uncertainty And Confidence

### High confidence

- Repository/branch/head/alignment, prompt-hold blob identity, accepted Gate status, and unchanged implementation baseline.
- All catalog counts and exhaustive inspection of 121 chains, 58 workplaces, 12 recipes, 311 steps, 162 variants, 916 candidate entries, and every stated exact record set.
- Live resolver precedence, stage iteration, no carry, final-step output, quantity/quality formulas, tool/fuel/skill behavior, candidate selection, value/market propagation, and non-consumption of inventory.
- Raw-cast loader/type drift, schema/lint boundaries, public contract shape, and recipe non-inheritance.
- Existing test coverage and the reproduced green/red results recorded in Section 20.
- The conditional conclusion that a static recipe package can exclude every disputed resolver field.

### Medium confidence

- Which documentation wording best distinguishes current estimator behavior from intended future production mechanics.
- Whether each live resolver mismatch is best corrected in content, runtime, validator, type, or documentation; the audit establishes the mismatch but deliberately does not choose all owners.
- The precise Stonevein compatibility edit. The intended extractive presence is high confidence, but extraction-yard city support versus underground variants for other buildings is an authored world/content choice.
- Which focused-test groups integration should promote first when it schedules resolver work.

### Low confidence or intentionally unresolved

- Intended generic-versus-default-variant semantics, add-versus-replace variant inputs, top-level-versus-final output closure, and the original meaning of `carriesForward`.
- Correct process skill for every Gate 6 S54 candidate, active-job policy, tool-tag aliases, tier/progression numeric design, physical fuel relationships, byproduct cost allocation, and future production-state ownership.
- Final recipe selection and integer quantities for revised `0.6.5`; those require seven-artifact integration, not this audit.
- Every Gate 7 affinity, combination, vessel, capacity, recharge, infrastructure, failure, scarcity, institutional-access, and substitution question.

No uncertainty was promoted into content fact. Deterministic live behavior was not automatically labeled intentional, and implausible behavior was not automatically labeled a factual defect.

## 26. Sources

### Repository and coordination authority

- `AGENTS.md`
- `README.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/queued-cross-domain-production-research-integration-prompt.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- Git history and changed-path inspection from Gate 6 artifact/coordination commits through starting head `19107302631791c17e1a4320e723d88609b8f65f`
- Historical `0.6.5` prompt at `e40f94971f082dbb92ce776b1a2c856543b42aeb:docs/dev/current-codex-prompt.md`
- Historical fail-closed output at `aa0d7cd0:docs/dev/current-codex-output.md`

### Durable design and route decisions

- `docs/design/production-chain-workplace-runtime-authority-audit-trigger.md`
- `docs/design/0.6.5-research-prerequisite-and-recipe-authority-reconciliation.md`
- `docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md`
- `docs/design/crafting-authority-boundary-decision.md`
- `docs/design/recipe-and-production-schema-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/settlement-economy-schema-decision.md`
- `docs/design/streamlined-pipeline-roadmap-decision.md`
- `docs/data-dictionary/economy.md`

### Accepted research evidence

- `docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md`
- `docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md`
- `docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md`
- `docs/dev/tmp-materials-refinement-processing-research-2026-07-14.md`
- `docs/dev/tmp-food-processing-preservation-research-2026-07-14.md`
- `docs/dev/tmp-crafting-tools-workplaces-production-research-2026-07-14.md`

### Live content and schemas

- `packages/content/base/civilization/production_chains.json`
- `packages/content/base/civilization/workplaces.json`
- `packages/content/base/civilization/workplace_abstractions.json`
- `packages/content/base/civilization/market_item_values.json`
- `packages/content/base/civilization/buildings.json`
- `packages/content/base/civilization/services.json`
- `packages/content/base/civilization/extraction_methods.json`
- `packages/content/base/civilization/infrastructure.json`
- `packages/content/base/crafting/recipes.json`
- `packages/content/base/items/items.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/world/settlements.json`
- `packages/content/base/world/resources.json`
- `packages/content/base/world/commodities.json`
- `packages/schemas/civilization/workplace.schema.json`
- `packages/schemas/civilization/infrastructure.schema.json`
- `packages/schemas/crafting/recipe.schema.json`
- `packages/schemas/world/resource.schema.json`
- `packages/schemas/world/commodity.schema.json`
- `packages/schemas/world/settlement-economy.schema.json`

### Validation, runtime, contracts, and consumers

- `tools/content-lint/index.mjs`
- `tools/content-lint/crafting-recipes.mjs`
- `tools/content-lint/resources.mjs`
- `tools/content-lint/commodities.mjs`
- `tools/content-lint/settlement-economies.mjs`
- `packages/engines/civilization-engine/src/content.ts`
- `packages/engines/civilization-engine/src/runtime-economy.ts`
- `packages/engines/civilization-engine/src/simulation-consistency.ts`
- `packages/engines/civilization-engine/src/transport-runtime.ts`
- `packages/engines/civilization-engine/src/trade-runtime.ts`
- `packages/engines/civilization-engine/src/settlement-simulation.ts`
- `packages/engines/civilization-engine/src/institutions-runtime.ts`
- `packages/engines/civilization-engine/src/index.ts`
- `packages/shared/types/src/contracts.ts`
- `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts` and its repository call-site search results

### Focused tests and read-only probes

- `tests/unit/civilization-runtime-economy.test.mjs`
- `tests/unit/crafting-recipes-validation.test.mjs`
- `tests/unit/civilization-system-consistency.test.mjs`
- `tests/unit/settlement-economy-validation.test.mjs`
- `tests/unit/civilization-transport-runtime.test.mjs`
- `tests/unit/civilization-trade-runtime.test.mjs`
- `tests/unit/civilization-institutions-runtime.test.mjs`
- `tests/unit/civilization-settlement-simulation.test.mjs`
- `tests/unit/schema-files.test.mjs`
- Temporary local read-only chain/candidate/workplace probes described in Section 2; all removed before completion and not authority files

No external source was necessary. Repository facts, accepted research evidence, and direct behavior were sufficient.
