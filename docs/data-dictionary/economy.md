# Economy

This project is best served by a hybrid ownership model:

- domain records (`flora`, `fauna`, `minerals`) own simulation identity and ecological behavior
- economy records own tradable/processable commodity definitions and value

## Ownership Model

- extraction methods: resource-domain specific gathering logic
- workplace transforms: input tags -> output tags with labor slots
- production chains: staged pipelines, byproducts, and optional variant flags (`variantConfig`) for input-driven outputs (for example blackberry preserve vs raspberry preserve)
- market rules: floor/ceiling/volatility/elasticity
- currency system: canonical denomination and base-unit conversion
- market item values: canonical registry for tradable/processable keys plus standardized base valuation (copper-penny scale)
## Facility Progression

- workplaces may define `tierProfile` to model upgrade tracks (for example Camp -> Hut -> Cabin -> Lodge -> Guild)
- workplaces may define `upgradesProfile` to define purchasable improvements, performance effects, and tier-gate prerequisites
- tiered workplaces can require specific upgrades via `tierUpgradeRequirements` before upgrading into target workplaces
- workplaces may define `efficiencyProfile` to express throughput, labor efficiency, waste, and worker comfort by tier
- workplaces must define `workforceProfile` with `maxConcurrentWorkers`, tier-gated jobs (`requiredTier`), per-worker output rates, required job tools (`toolRequirements`), and missing-tool penalties (`reduced_output` or `no_output`)
- workplaces must define `ioProfile` with `workCycleHours` and per-item `inputs`/`outputs` (`itemKey`, `quantityPerCycle`, `unit`) so extraction and processing rates scale consistently; `consumptionType` and `productionType` classify consumed/access inputs and primary/byproduct outputs.
- irrigation now uses an access flag model (`irrigated_plot`) instead of transported water volume; irrigation workplaces apply the flag and define source/latency/construction scaling in `irrigationProfile`.
- agriculture workplaces may define `plotProfile` to model tiered plot capacity and proportional usable area; tier 1 supports garden only, tier 2 supports farmland/orchard, and tier 3+ unlocks farmland, raised beds, orchard, terraced farm/orchard, and greenhouse plot modes with irrigation-tier scaling bonuses.
- forestry workplaces at Lodge tier and above should expose a `job.forester` role with `feature.replanting` enabled
- workplaces may define `integrationProfile` and combo bonuses to reward co-located operations (fewer handoffs, lower logistics, less waste)
- workplaces may define `marketProfile` to encode business scale, consumer scope, supply access, risk tolerance, and district fit
- production chains may define `facilityStrategy` to distinguish segmented small-business pipelines from vertically integrated estates
- production-chain `facilityStrategy` may include `marketContext` so chain variants can be gated by local demand, supply conditions, and district risk


## Recommended Placement

- species-level output logic (for example dairy, eggs, wool, hides, slaughter yields) should live in fauna records
- plant-level harvest and regrowth logic should live in flora records
- canonical object identity should live in `packages/content/base/items/items.json`, including multi-role commodities that can act as materials, ingredients, reagents, consumables, or trade goods
- processed goods, intermediates, and byproducts should be referenced as canonical item keys and valued in `market_item_values.json`
- avoid separate micro-databases per byproduct family; use one canonical economy item-key space

## Propagules

- do not use generic `seeds` entries
- use crop-specific propagules such as `<crop>_seed`, `<plant>_bulb`, `<plant>_start`, `<fungus>_spore`


