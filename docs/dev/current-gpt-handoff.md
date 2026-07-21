# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- The original culinary research completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`.
- The first culinary results repair completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5` and remains accepted documentation input.
- The unversioned `Culinary Preparation, Portion, Meal Composition, Food Knowledge, And Historical Ration Integration Audit` completed at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`.
- GPT/human inspection accepts that audit's repository evidence, source discipline, multi-axis food model, partial-consumption direction, physical-container direction, heterogeneous unknown-group direction, fraud/inspection direction, and hazard model.
- The integration audit requires a bounded results repair before durable promotion because of calorie-scale, serving, process-owner, package-boundary, dependency, ration-name, version-class, and mystery-assortment omissions.
- `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md` controls ration, serving, percentage, calorie, process-owner, package-boundary, and physical-label corrections.
- `docs/design/artisan-mystery-assortment-stock-and-quality-decision.md` controls constrained randomized assortments, direct known lots, tier floors/weights, contextual quality, stock windows, producer scope, and cross-domain reuse.
- The active prompt is the unversioned `Culinary Integration Results Repair And Contract Acceptance Audit` in `docs/dev/current-codex-prompt.md`.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and exactly recoverable from its held prompt.

## Controlling Culinary Decisions

### Food state

- Food state remains orthogonal: readiness, preparation method, preservation effect, hazard/safety, and authored display name.
- Smoking may cook and preserve. Drying may preserve without cooking. Canning/jarring may heat, make ready to eat, and preserve.
- Display names remain authored; mechanics never parse names.
- `raw` and `uncooked` may both be used for lexical variety.
- One lone manually authored `isPreserved` flag is insufficient.

### Preparation-method ownership

- Future `crafting.food_process_methods` is the recommended single canonical method registry.
- Item food-state profiles reference methods and own resulting readiness, preservation, hazard, and presentation relationships.
- Recipes and production chains reference the same method identities without copying or inheriting competing definitions.
- Do not create a parallel canonical `items.food_process_methods` registry.

### Percentages and nutrition

- Meal-preparation `0-100%` controls describe ingredient source allocation or derived serving composition.
- They do not define daily calorie points.
- Authoritative nutrients derive from physical amount consumed and nutrient value per basis amount.
- The live `dailyCalories: 100` rule is a legacy game-scale implementation fact, not accepted future calorie authority.
- Provisional user-authored game-balance posture:
  - approximately `2,500 kcal/day` for an ordinary healthy active adult;
  - approximately `3,500-4,000 kcal/day` for sustained high-intensity labor or loaded military activity.
- Exact balance remains later work.

### Quantity

- Physical dimensions: count, mass, volume.
- Serving is an authored culinary reference resolving to count, mass, or volume.
- Bundle, batch, contained lot, and package are aggregation/packaging kinds, not dimensions.
- Amounts use deterministic integer or fixed-point basis units.
- Display percentages and units are not authoritative storage.

### Rations and provisions

Accepted primary ration names:

- Small Ration;
- Medium Ration;
- Large Ration;
- Party Ration;
- Large Party Ration.

Do not prefer Day Ration, Multi-Day Ration, Group Meal Provisions, Group Meal Container, or Extra-Large Group Meal Container as ordinary item names.

Small, medium, and large are convenient portable package sizes, not exclusive eater counts. A medium ration may feed several people during a short outing depending on manifest, appetite, activity, and other food carried.

Party Ration and Large Party Ration are short-duration multi-serving assortments intended to reduce clutter and preparation time. They do not replace sustained expedition provisions.

Provisions remain the broader logistics supply represented through actual sacks, baskets, crates, barrels, casks, ingredients, rations, tools, cookware, fuel, vehicles, and pack animals.

Party rations may be repacked from provisions and stored in crates, wagons, or pack-animal loads.

### Multi-serving preparation

- Extend the future Prepare action; do not create a separate infrastructure system.
- The number of selected serving vessels determines serving count.
- One bowl generally represents one serving.
- Uniform Servings is the default.
- Individual Servings permits per-dish differences such as more protein, no meat, reduced dairy, different portions, or supported substitutions.
- Candidate UI: ingredient-source rows and selected-vessel columns.
- Source allocations across servings cannot exceed available physical amount.
- Serving composition may total 100% as presentation but must not be confused with calories.
- Prepared servings may be consumed, given to party members, or stored where supported.

## Artisan And Producer Assortments

### Direct known lots

- Ordinary direct goods remain available alongside mystery assortments.
- Examples include a loaf, half-dozen or dozen rolls/muffins, measured flour, a known cloth bolt, a known hide, stated boards, or stated metal stock.
- Direct lots have exact manifests unless fraud separately creates a discrepancy.

### Mystery manifests

- Artisan/producer assortments are constrained randomized physical manifests, not merely themed names.
- True contents resolve and persist when merchant stock is generated or, if stock remains abstract, during purchase immediately before ownership transfer.
- Opening-time RNG remains prohibited.
- Opening reveals existing truth; save/load and transfer preserve it.
- Unknown identical-looking assortments may share a presentation group while retaining per-unit truth.

### Reusable tier template

Contextual bands:

- `band_0`: clearance, scrap, day-old, irregular, seconds, or least desirable but honestly saleable goods;
- `band_1`: ordinary, standard, fresh, or serviceable trade quality;
- `band_2`: fine, select, premium, specialty, or unusually useful/expensive quality;
- `band_3`: rare, exceptional, prestige, luxury, or masterwork-adjacent outcome.

Candidate default per-slot weights:

| Tier | `band_0` | `band_1` | `band_2` | `band_3` | Floor |
| --- | ---: | ---: | ---: | ---: | --- |
| Clearance | 68% | 27% | 4% | 1% | `band_0` |
| Standard Artisan | 0% | 72% | 23% | 5% | `band_1` |
| Select | 0% | 0% | 80% | 20% | `band_2` |

- These are candidate balance defaults, not implemented numbers.
- A producer may expose two or three tiers, but every offered tier must map explicitly.
- Tier increases the minimum eligible band and rare/expensive chance.
- Slot pools remain constrained by producer, category, region, season, stock source, quantity, duplicate rules, and value bounds.

### Contextual quality

- Assortment bands do not replace domain-specific quality truth.
- Bakery quality may use freshness, flour refinement, enrichment, bake/finish, rarity, decoration, size, and consistency.
- Butcher/fish/cheese quality may use freshness, cut/yield, cure/smoke/aging, source rarity, and condition.
- Apothecary/spice/alchemy quality may use purity, potency, freshness, provenance, processing, adulteration, and seals.
- Textile/leather quality may use fiber/hide, dimensions, weave/tan/dye/finish, condition, and rarity.
- Wood quality may use species, dryness, straightness, dimensions, defects, finish, and scarcity.
- Metal quality may use alloy/material, purity, mass/dimensions, defects, processing stage, finish, scarcity, and workmanship.

### Producer scope

- Culinary examples may include baker, pastrymaker, confectioner, chocolatier or lore-native equivalent, butcher, fishmonger, cheesemaker, brewer, spice merchant, grocer, farmer, orchardist, herbalist, apothecary, alchemist, and specialty preservers where supported.
- Nonculinary reuse may include textile/leather scraps and selections, wood offcuts and select stock, metal scrap and processed stock, potter's seconds, glassworker remnants, cooper/fletcher/chandler/scribe/mason/jeweler/lapidary/enchanter/magitech assortments where later authority permits.
- These are directions only and do not authorize content.
- Ingredient/material surplus pools remain separate from finished-output pools and may only use actual production inputs or stock.

### Stock and time windows

- Clearance/day-old/surplus/scrap/seconds stock is finite, often released at opening or production rollover, normally not replenished that day, and available for a short window.
- Fresh/standard stock is finite by production batch and replenishes at authored intervals.
- Select/luxury/event stock is very limited and may appear only during narrow hours, market days, festivals, commissions, catering, noble/guild events, or leftovers from such work.
- Do not claim live NPC sell-through exists. Deterministic finite stock and withdrawal windows may stand in until economy/runtime demand owns sell-through.
- Low-tier assortments are not automatically unsafe, fraudulent, rotten, or useless. Undisclosed defects belong to fraud and inspection.

### Pricing direction

- Clearance is normally discounted for age, irregularity, uncertainty, or mixed usability.
- Standard aims near ordinary expected trade value with variance.
- Select may charge a premium for its higher floor, rare chance, scarcity, convenience, prestige, or packaging.
- Expected-value bounds and duplicate caps should prevent trivial profit loops.
- Exact prices, stock, schedules, RNG, and economy behavior remain unimplemented.

### Container identity and labels

- Container examples are explicitly non-exhaustive.
- Physical forms may include pouches, packets, bags, sacks, satchels, bundles, baskets, bushel containers, hampers, boxes, cases, chests, crates, jars, bottles, flasks, jugs, crocks, pots, kegs, casks, barrels, bales, bolts, rolls, racks, and later bulk transport forms where supported.
- The physical container must suit the goods; `Basket` is not used only because it sounds artisanal.
- Custom labels are mutable item-instance presentation metadata and never replace true identity or contents.

## Package Boundaries And Labels

- Static food profiles own readiness, method references, preservation outcomes, hazards, and portionability.
- Meal/nutrition/difficulty work owns serving-basis nutrients, satiety, aggregation results, dietary exposure, body-state integration, and difficulty controls.
- Static container visibility/access capabilities do not depend on character observation; inspection consumes those capabilities later.
- There is no valid three-segment support package.
- Three-segment runs are primaries; support runs use a fourth segment and name one exact primary parent.
- The reusable artisan mystery-assortment owner must serve culinary and nonculinary consumers rather than creating separate random-box systems per domain.

## Active Repair Scope

The active Codex run may modify only:

- `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`;
- `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`;
- `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`;
- `docs/dev/current-codex-output.md`.

It must repair the completed audit rather than add new research or implementation.

## Route Guardrails

- The active run is unversioned and documentation-only.
- No implementation number is assigned.
- No item, recipe, profile, ration, provision, direct store lot, mystery assortment, producer, profession, store stock, container, starting bundle, schema, validator, test, runtime, inventory, UI, save, economy, Knowledge, reputation, merchant, difficulty, dependency, asset, or gameplay change is authorized.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- Held `0.6.6` remains byte-for-byte recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` and must not be restored or modified by the repair.
- After the repair, stop for GPT/human inspection before creating the durable contract-acceptance decision or any implementation prompt.