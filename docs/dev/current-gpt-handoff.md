# Current GPT Handoff

## Status

- The unversioned `Cross-Domain Natural Resources, Materials, Production, And Magitech Research Integration` is complete and accepted as documentation only.
- `docs/design/cross-domain-production-research-synthesis.md` remains the durable integration authority for that program.
- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated: 16 exact planned standard recipes were added with resolver quarantine intact.
- The unversioned `Rich Flora, Fauna, Culinary, Nutrition, And Dietary Systems Audit And Research` completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`.
- The unversioned `Rich Culinary And Dietary Research Results Repair And Acceptance Audit` completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5`. GPT/human inspection accepts its repaired paths, matrix semantics, ration architecture, and acyclic package order as documentation input.
- `docs/design/regional-ration-manifest-and-container-knowledge-decision.md` remains the focused authority for ration archetypes, geographic fulfillment, creation-time manifests, contents knowledge, and base pack behavior.
- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md` is the newer controlling authority for preparation/readiness/preservation axes, portions, meal composition, physical containers, variety morale, heterogeneous unknown display groups, fraud/inspection, nutrition, and historical food-safety direction.
- The unversioned `Culinary Preparation, Portion, Meal Composition, Food Knowledge, And Historical Ration Integration Audit` is active in `docs/dev/current-codex-prompt.md`.
- The earlier narrow food-taxonomy/profile correction is not automatically implementation-ready. Sausage and comparable items require an accepted preparation/readiness model rather than a branch-only rename.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and exactly recoverable from its held prompt.

## Integration Baseline

- Items: 1,372 = 24 accessory, 18 armor, 14 clothing, 1,114 commodity, 26 consumable, 131 tool, 10 vehicle, 35 weapon.
- Market values: 1,617 unique keys; all 1,372 item keys plus 245 market-only biological identities.
- Recipes: 28 planned standard records across 10 families; no player crafting runtime consumer.
- Production capability: 58 workplaces, 121 production chains, 121 skills, 22 extraction methods.
- Ecology: 117 flora, 132 fauna, 24 monsters, 93 habitats, 36 biomes, 9 regional ecology profiles, 56 minerals.
- Knowledge: 7 registry rows, 4 legacy domain records, and 28 snippets.
- Difficulty: live `easy`, `normal`, `hard`, and `brutal` tiers plus `hardcore`; current modifiers cover stat growth, progression, body state, recovery, starvation/dehydration escalation, and prestige, but no accepted nutrition/fraud toggles yet.
- Item/inventory authority preserves canonical static items and separate consumable profiles. Runtime/save owns bags, stacks, overflow, quantities, equipped refs, optional durability, and wallets; no mature general item-instance or container-template authority exists.

## Completed 0.6.5 Package

The accepted package added exactly 16 planned standard recipes, taking the catalog from 12 to 28 and represented families from 8 to 10 by adding `cooperage` and `forging`.

Recipes own complete explicit bounded transformations. Production chains own broad macro/economic context. `relatedProductionChainId` is optional, descriptive, existence-checked, and non-inheriting.

Current recipe input/output quantities are authored positive integers. They are not historical yields, physical unit conversions, runtime balance formulas, or proof of serving/mass/volume semantics.

## Accepted Culinary Research Repair

The repair audit:

- corrected the three false repository paths;
- preserved 239 explicit biological source-output relationships;
- moved 377 safety-unknown rows to food-safety authority as their first blocker;
- deferred all four orphan consumable profiles pending exact disposition;
- classified the 99 prepared identities as topology rather than an automatic recipe backlog;
- incorporated the four-layer ration/manifest/knowledge model;
- replaced the circular package route with an acyclic sequence;
- remained within its four-file documentation-only allowance.

The repaired temporary artifacts remain inputs, not implementation authority:

- `docs/dev/tmp-rich-culinary-dietary-system-research-2026-07-19.md`;
- `docs/dev/tmp-rich-culinary-dietary-audit-matrix-2026-07-19.json`;
- `docs/dev/tmp-rich-culinary-dietary-source-index-2026-07-19.md`.

## Expanded Culinary Decisions

### Food state and naming

- Food identity must use orthogonal readiness, preparation-method, preservation-effect, safety/risk, and display-name concepts.
- Do not reduce food to one mutually exclusive `raw/cooked/preserved` branch.
- Smoking may cook and preserve. Canning/jarring may use heat, produce ready-to-eat food, and preserve. Drying may preserve without cooking.
- `isPreserved` should be derived or validated from process/method authority rather than used as a lone manually authored truth.
- Character-facing names should explicitly use authored state/technique terms such as Raw, Uncooked, Cooked, Smoked, Boiled, Baked, Poached, Fried, Steamed, and specialty descriptors such as Applewood-Smoked.
- Mechanical meaning must not be parsed from names.

### Rations and provisions

- A ration is a relatively small portable package intended for personal use or carriage.
- Provisional accepted meaning: a small ration is one meal for one person.
- Medium, large, and possible extra-large meanings require historical calorie and provisioning research.
- Future archetypes must state eater count, meal/day coverage, and bounded energy/portion band rather than relying on size adjectives alone.
- Provisions are bulk supplies. Prefer concrete names such as sacks of grain, crates of fish, baskets of fruit, barrels of meat, and casks of drink.
- A provisions crate may contain personal rations but is not itself a personal ration.

### Quantity and portions

- Culinary quantities must eventually reconcile with cultivation, harvest, gathering, butchery, recipes, inventory, trade, and crafting.
- Current recipe integers do not define count, mass, volume, serving, bundle, batch, or capacity.
- Culinary closure may lead, but the quantity contract must remain extensible to nonculinary systems.
- Direct consumables need a portionability posture: whole-only, portionable, pourable, or stack-divisible.
- UI percentage sliders should map to deterministic integer/fixed-point remaining units; whole-only items expose none/all.

### Meal actions

The intended food action surface has:

1. Ready To Eat;
2. Prepare;
3. Cook.

Ready To Eat supports one eating occasion assembled from multiple accessible foods. Prepare handles non-heated meals and requires a compatible dish/container where physically necessary. Cook requires an accepted station, tools, ingredients, skill, and recipe owner.

A meal preview should summarize ingredients, amounts, calories, protein, fat, carbohydrate, hydration, hunger, satiety/duration, morale, known safety, and container compatibility. Backend carbohydrate remains accurate; lore-friendly UI may present qualitative descriptors without relabeling all carbohydrates as grain.

### Variety and monotony

- Meal diversity should grant bounded morale value.
- Repeated high exposure to the same food should create gradual, dose-sensitive aversion that decays over time.
- Dominant ingredients and repeated days matter more than small components.
- The model must resist exact-item renaming or minor preparation exploits.
- Difficulty may reduce or disable nutrition and monotony pressure.

### Containers and physical inventory

- Ordinary inventory is physical, not a magical list.
- Loose berries, nuts, seeds, grain, flour, powders, and liquids normally require suitable containers.
- Whole items such as apples may fit in a hand, pocket, belt, or pouch when capacity allows.
- Future container templates need capacity, liquid-tightness, food-safe posture, heat tolerance, closure/seal, allowed forms, nesting, visibility, and transfer compatibility.
- Actual contents, remaining capacity, seal, condition, contamination, owner, and position remain item-instance/runtime state.
- Extradimensional containers remain later endgame/replay content.

### Manifest truth and visible grouping

- Creation-time manifest resolution remains the recommended default; transfer and opening do not reroll contents.
- Unknown containers that appear identical may share one visible inventory group even when hidden manifests differ.
- Each unit must preserve its own manifest, origin, quality, condition, and knowledge.
- Identification or opening may split a unit into a more specific visible group.
- Known items stack only with known-equivalent items under the future stack contract.
- Physical instance identity, heterogeneous instance grouping, and UI presentation grouping are separate concepts.

### Fraud, inspection, reputation, and difficulty

- True identity, origin, manifest, quality, and condition are internally known when the source establishes them; character knowledge remains separate.
- Fraud, substitution, smuggling, deceptive packing, and counterfeit presentation are accepted world concepts and must not be removed merely because runtime comes later.
- Future resolution must consider seller claim, character observation, evidence, seller deception, buyer Knowledge/skill/exposure, seller reputation/ethics, transaction context, and difficulty.
- Automatic recognition is appropriate when experience makes identity obvious. Altered, unfamiliar, or contested goods may require checks or inspection.
- Inspection may involve sample viewing, deeper container inspection, smell, taste where safe, weight, marks, seals, documents, or consultation.
- Intrusive inspection may offend honest sellers or require permission, deposits, destructive opening, or delay.
- Difficulty may disable fraud or adjust frequency, sophistication, magnitude, inspection forgiveness, and spoilage/quality substitution severity.
- Merchant reputation must not be globally omniscient to new characters.

### Starting goods

- Starting food and containers may vary by difficulty, spawn region, prestige/incremental legacy upgrades, future background, institution, lineage, or scenario.
- Do not add starting food before naming, ration scale, quantity, and container authority are accepted.
- Fixed starting manifests remain known and balance-stable.

### Fresh, hearty, and luxury naming

- Accepted fresh/prepared naming direction: Market Fruit Bag, Fresh Produce Basket, Prepared Meal, Baker's Bundle.
- Avoid Wrapped Meal, Prepared Meal Parcel, Inn Meal Parcel, and Cookshop Parcel as defaults.
- Venue does not create a distinct recipe identity; cook skill, ingredient quality, condition, serving, and presentation may vary.
- Hearty means a high-energy, protein-supporting, filling, well-made cooked mixed meal with meaningful labor, skill, diversity, and morale value.
- Luxury includes elite display luxury and attainable celebratory luxury for ordinary people.
- The user's historical Earth examples are illustrative only and must not be inserted directly. New content must be lore-native and use repository regions/ingredients where supported.

### Nutrition and food safety

- Use a moderate model with calories, protein, fat, carbohydrate, hydration, portion size, satiety amount, and satiety duration.
- Major macronutrient imbalance may later affect recovery, activity, fatigue, and development through accepted owners.
- Nutrition may be reduced or disabled by difficulty; detailed micronutrients are not the default.
- Character-facing food safety should use historically appropriate knowledge and practices, not modern germ-theory language.
- Hidden engine truth may still model contamination, parasites, toxins, spoilage, and processing risk.
- Dangerous foods may require specialist preparation and may remain hazardous after ordinary cooking.

## Active Integration Audit

The active unversioned audit must:

- research historical energy use and provisioning;
- audit quantity/unit semantics across culinary and adjacent systems;
- propose exact preparation/readiness/preservation/safety owners;
- design partial-consumption and composed-meal contracts;
- reconcile physical containers with gathering and inventory;
- design heterogeneous unknown display groups without losing per-unit truth;
- integrate fraud, inspection, reputation, Knowledge, and difficulty boundaries;
- propose nutrition, variety morale, monotony, and food-risk owners;
- rebuild the package sequence and select the smallest later package only after dependencies are known;
- remain documentation-only and stop for GPT/human review.

It may create only:

- `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`;
- `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`;
- `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`;
- a replacement `docs/dev/current-codex-output.md`.

## Temporary Artifact Guardrails

Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`. Do not edit, delete, consume, or repurpose them.

The earlier culinary artifacts remain accepted inputs and must not be deleted or overwritten by the active integration audit.

## Route And Version Guardrail

- `docs/design/internal-versioning-and-release-milestone-policy.md` controls prospective classification.
- The project remains in `0.6.x`.
- This integration audit is unversioned and does not itself advance the project toward `0.7.0`.
- The next implementation number is not assigned.
- A support suffix must name exactly one primary parent.
- The previous `0.6.5.1` recommendation is not accepted automatically because the required preparation and quantity authority may materially exceed a narrow parent repair.
- Held `0.6.6` remains unchanged and recoverable. Restore it only after this integration route is accepted and an explicit route decision authorizes restoration.

## Validation And Behavior

- The active repository coordination changes are documentation and prompt updates only.
- The active Codex audit is restricted to the three new temporary artifacts and `current-codex-output.md`.
- No item, profile, recipe, source, region, starting bundle, schema, validator, test, runtime, inventory state, UI, save, economy, Knowledge, merchant, reputation, difficulty, dependency, asset, or gameplay behavior is authorized to change.