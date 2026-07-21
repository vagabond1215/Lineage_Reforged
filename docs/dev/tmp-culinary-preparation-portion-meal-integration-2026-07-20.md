# Culinary Preparation, Portion, Meal Composition, Food Knowledge, And Historical Ration Integration

Source run: Culinary Integration Results Repair And Contract Acceptance Audit

Date: 2026-07-20

Classification: unversioned documentation-only research and design integration

Milestone impact: `supports_current_band`

Implementation permission: none

Related artifacts:

- [Historical energy and ration source index](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md)
- [Machine-readable quantity, container, knowledge, owner, and package audit](tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json)
- [Controlling culinary decision](../design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md)
- [Focused ration, serving, preparation, and labeling correction](../design/culinary-ration-serving-preparation-and-container-labeling-decision.md)
- [Focused artisan assortment, stock, and quality correction](../design/artisan-mystery-assortment-stock-and-quality-decision.md)
- [Packed-food plan](../design/packed-food-ration-and-provisions-content-plan.md)
- [Manifest and container-knowledge decision](../design/regional-ration-manifest-and-container-knowledge-decision.md)
- [Item/equipment/inventory authority boundary](../design/item-equipment-inventory-authority-boundary-decision.md)
- [Recipe and production decision](../design/recipe-and-production-schema-decision.md)

## Result

The intended culinary system needs four separate kinds of authority before any taxonomy repair is safe:

1. **Static content:** item identity and authored name; food readiness, crafting-owned process-method references, preservation effects, hazards, portionability, and container capabilities. Serving-basis nutrition and satiety remain a separate later consumable-profile authority.
2. **Item-instance state:** canonical and remaining amount, opened/seal state, container contents, true manifest/origin/quality/condition, and per-unit identity beneath visible grouping.
3. **Character-relative state:** observations, certainty, evidence, food-safety cues, dietary exposure, and scoped counterparty knowledge.
4. **Engine-owned commands:** Ready To Eat, Prepare, Cook, Open, Transfer, Inspect, and Consume, including authoritative inventory and body-state deltas.

The live repository does not yet contain the quantity, item-instance, food-state, or observation contracts needed to implement this safely. The old taxonomy/profile correction is therefore not first. No code or content package is implementation-ready.

The smallest later package is a durable **Culinary Quantity, Food-State, And Instance Contract Acceptance Decision**, classified as an unversioned documentation-only decision and currently **design-ready only**. Serving is already accepted as a culinary reference and reusable method identities are already assigned to future `crafting.food_process_methods`; the decision must still close exact quantity bases, first method vocabulary and parameters, hazard-reduction rules, representative fixtures, and observation persistence before schemas or content move.

## Execution Gate And Repository Evidence

- Starting branch: `master`
- Starting commit: `d37bbdb6651d4b7c63a8838b8a4c0aa1d15f9d42`
- Starting worktree: clean
- Fetch and fast-forward pull: completed; already up to date
- Integration audit commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`: confirmed ancestor
- Focused correction SHA-256 values: ration/serving `3FCB04C970A7EA410FE8361F0ED36DBB146C243A9E6A082456CD211BDBC9F062`; assortment/stock `DBFC2286D8103F06FC0D0A07EAA585FE7BD5A2CA672E6F93E2E1E9E8662DB8A2`
- Held `0.6.6` source: hold file still resolves to existing blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`
- Gate 1–5 and Gate 7 research artifacts remain assigned solely to `0.6.7`; they were inspected as retained evidence and not edited, consumed, deleted, or repurposed.

Measured live facts:

- `items.json` contains 1,372 records. Food, cask, jar, sack, basket, and bottle identities do not have food-state, portionability, or container-capability profiles.
- Nine consumable profiles expose game-scale energy, protein, carbohydrate, fat, hydration, optional intoxication, and `useVerb`. They do not define servings, remainders, satiety, or safety.
- The body-state rule uses legacy `dailyCalories: 100` game-scale units and `dailyHydration: 72`. The calorie field is an observed current rule, not accepted future kilocalorie or ration-percentage authority. Current consumable energy values range from 10 to 38 legacy game units.
- Twenty-eight recipes use positive integer quantities with no physical units. This proves authored ratios only.
- Fifty-eight workplace records use more than fifty IO unit labels, including `item`, `bundle`, `portion`, `liter`, `pot`, `cask`, `crate`, `basket`, `cut`, and `batch`. Many quantitative fields are placeholders.
- Flora, fauna, monster, and extraction data use different yield shapes: placeholders, product lists, count ranges, and multipliers.
- `InventoryStack` contains `itemId`, `itemKey`, and integer `quantity`; it has no instance id, manifest, remaining amount, observed identity, or heterogeneous-group identity.
- Starter inventory is currently assembled in the UI into one `bag.traveler_satchel`. Six of seven starting bundles contain one `item.ration_bundle`.
- `skill.crafting.cooking` exists. The live Knowledge registry contains natural-world, arcane, religion, and general-lore domains, but no culinary or trade-appraisal domain.
- Player reputation is scoped fame/notoriety. It is not seller truth and must not become an omniscient merchant score.

The detailed owner evidence is recorded in the JSON artifact.

## 1. Orthogonal Food State, Preparation, Preservation, Safety, And Naming

One mutually exclusive `raw/cooked/preserved` branch is insufficient. The minimum model is orthogonal:

| Axis | Owns | Does not own |
| --- | --- | --- |
| Item identity | Authored item id/key/name, lore identity, class/branch, static profile references | Current amount, observed truth, or action execution |
| Readiness | Ready to eat, requires preparation, requires cooking, conditionally edible, not edible as presented | Preservation success or absence of hazards |
| Process methods | Reusable identities owned by future `crafting.food_process_methods`: baking, boiling, drying, fermenting, frying, pickling, salting, smoking, steaming, sugaring, specialist preparation | Item-state ownership, the authored display name, or automatic safety clearance |
| Preservation effect | Storage-risk reduction or stability resulting from validated method parameters and packaging | A lone manual `isPreserved` assertion |
| Safety/hazard | Biological contamination, parasite, toxin/poisonous part, harmful secretion, spoilage, environmental/chemical contamination, physical hazard, and residual risk | Character certainty or readiness alone |
| Authored presentation | Regional, specialty, quality, luxury, fuel, technique, and serving descriptors | Mechanics derived by parsing the name |

Methods can overlap:

- Smoking may cook, dry, flavor, and preserve, but the result depends on the process. Modern hot-smoking guidance explicitly distinguishes process controls and residual hazards; it does not validate every smoked product ([S15](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s15--hot-smoking-of-fish)).
- Jarring/canning may use heat, make a product ready to eat, and preserve it, yet packaging and process success remain relevant.
- Drying may preserve without cooking.
- Fermenting, curing, salting, sugaring, and pickling may change readiness, flavor, water activity, and storage differently.

The owner direction is closed: future `crafting.food_process_methods` owns the one canonical reusable registry. Item food-state profiles reference those identities and own resulting readiness, preservation effect, hazard outcome, and presentation relationship. Recipes and production chains reference the same identities; they do not inherit from one another and must not create parallel registries. The exact first vocabulary and parameter shapes remain open, but a competing `items.food_process_methods` owner is rejected.

Recommended lexical mapping:

| Authored wording | Controlled reference posture | Rule |
| --- | --- | --- |
| Raw / uncooked | Readiness and process-history fields explicitly authored | Do not infer from the word alone |
| Cooked | A successful cooking outcome with one or more method refs | Does not clear unrelated toxins or contamination automatically |
| Smoked | `smoke` method plus authored process grade/effects | May also reference cooked and preservation outcomes when validated |
| Boiled / baked / poached / fried / steamed | One controlled method ref plus outcome profile | Method remains separate from quality and display name |
| Specialty name | Authored item name plus explicit method/ingredient/quality references | No name parsing or automatic generation |
| Applewood-Smoked Sausage Links | Authored name; explicit sausage identity, smoke method, fuel/technique descriptor, readiness, preservation, and hazard outcome | Fuel wording is presentation metadata, not the method detector |

### Sausage and comparable collisions

The live `item.sausage_link` and `item.smoked_sausage_link` are classified under stationery/ink, and `item.sausage_coil` under lighting/oil-wax. `item.skillet_sausage`, `item.inn_sausage_board`, and `item.tavern_sausage_board` use `preserved` even where a cooked/served posture may be more important. Production chains reference these records in smoking, cooking, and meal-assembly contexts.

These are real integrity problems, but a branch-only rename would encode another incomplete model. The repair package must follow accepted readiness/process/preservation/hazard contracts. It should then repair only the affected records and references, preserving authored names unless a separate content decision changes them.

## 2. Historical Energy, Activity, Provisioning, And Ration Scale

### Evidence posture

Modern energy guidance supports body- and activity-sensitive demand, not one universal number ([S01](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s01--human-energy-requirements), [S02](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s02--energy-requirements-of-adults)). Historical accounts vary by era, place, status, labor, institution, season, and what was recorded. Early medieval feast lists can represent unusually large supplies rather than routine consumption ([S04](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s04--food-and-power-in-early-medieval-england-rethinking-feorm)). English labor, field-crop, and household evidence is useful but locally scoped ([S03](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s03--food-energy-and-the-creation-of-industriousness), [S05](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s05--consumption-of-field-crops-in-late-medieval-england), [S06](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s06--the-medieval-household-at-goodrich-castle)).

The game model should use this measurement ladder:

```text
acquired/supplied -> issued/allocated -> carried/stored -> prepared
-> edible after inedible parts and process loss -> served -> actually consumed
```

No step is interchangeable. FAO supply methodology expressly distinguishes availability from actual individual intake ([S10](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s10--food-balance-sheets-a-handbook)). Modern operational research likewise documents underconsumption despite provision ([S11](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s11--not-eating-enough-overcoming-underconsumption-of-military-operational-rations)).

The body-state engine already supports a variable `dailyEnergyDemand` on top of the observed legacy `dailyCalories: 100` game-scale rule. That value is not a 100-kilocalorie target, a 100-point authoring recommendation, or a percentage scale for ration energy. Future activity owners should add bounded demand for agricultural labor, construction, military exertion, travel, hunting, gathering, and strenuous craft; sedentary periods should remain near the relevant body-state baseline. Body size, age/life stage, health, climate/season, fatigue, load, terrain, pace, combat, training, and recovery may modify demand only through an accepted player/body/activity owner. Sex should not be a direct gameplay penalty; if relevant, its physiological contribution should be mediated through accepted body composition and life-stage state rather than a crude label.

### Provisional kilocalorie posture

The following values are user-authored game-design approximations, not universal historical findings:

- approximately `2,500 kcal/day` for an ordinary healthy active adult;
- approximately `3,500-4,000 kcal/day` for sustained high-intensity labor, loaded marching, armored military activity, heavy farming, threshing, construction, or comparable exertion.

These anchors still require activity, body, climate, injury, illness, age/life-stage, load, terrain, pace, combat, training, and recovery modifiers under accepted owners. They do not establish exact ration kilocalorie bands or manifests.

### Accepted ration semantics

Use these primary names: `Small Ration`, `Medium Ration`, `Large Ration`, `Party Ration`, and `Large Party Ration`. Small, medium, and large describe logical portable package sizes, not fixed eater counts or day ledgers. `Small Ration` is approximately one ordinary meal-sized package, but any ration may be shared or divided. A medium ration may serve multiple people during a short outing depending on appetite, activity, other food carried, and the actual manifest.

`Party Ration` and `Large Party Ration` are convenient short-duration multi-serving assortments. They reduce inventory clutter and preparation time, but they do not replace expedition provisions. Party rations may be repacked from bulk provisions, and multiple nonperishable party rations may be stored in crates, wagons, pack-animal loads, or other logistics storage.

Do not recommend `Day Ration`, `Multi-Day Ration`, `Group Meal Provisions`, `Group Meal Container`, `Extra-Large Group Meal Container`, or redundant generic `Meal Pack`/`Ration Pack` suffixes as ordinary item names. Provisions remain multi-container logistics supply for sustained travel, households, guilds, military forces, expeditions, caravans, and vessels. Prefer the actual container/content identities of constituent goods.

No exact ration kilocalorie, size, component-count, or coverage bands are accepted in this audit. Live values such as `ration_bundle` energy `24`, `traveler_ration` `22`, and `trail_meal` `30` are repository observations only. A modern MRE remains a comparison for a self-contained multi-component meal, not a naming, technology, or calibration authority ([S09](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s09--meal-ready-to-eat)). Large historical food lists may be household, feast, ship, or institution supply rather than an individual's intake; maritime biscuit allowances likewise describe issue context, not actual eating ([S07](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s07--ships-biscuit)).

### Provisioning contexts and limits

- **Household and noble:** shared stores, service hierarchy, guests, servants, and unequal portions. Better supply, staff, storage, inspection, water access, and ability to discard suspect food can reduce risk without modern science.
- **Military:** issue, local purchase, requisition, forage, carriage, cooking access, and activity all vary. Do not equate paper allowance with intake.
- **Maritime:** durable staples and centralized issue are especially salient; voyage length, infestation, storage, water, and substitution matter.
- **Pilgrimage/travel:** portable foods, purchases, lodging, hospitality, and route access make consumption episodic; no single universal pack.
- **Market:** purchased amount can be short-weight, substituted, spoiled, or inspected.
- **Institution/monastery/college:** aggregate allowances may serve many people or encode status, rules, feasts, and leftovers.
- **Season/climate/health:** work demand, availability, spoilage, appetite, and preparation opportunity vary. No historical source justifies one fixed modifier.

## 3. Cross-Domain Quantity And Unit Contract

Current recipe integers are legacy authored units. They do not mean kilograms, liters, servings, or historically reconstructed amounts.

The smallest coherent future contract should separate:

```text
physical dimension: count | mass | volume
culinary reference: serving -> points to a count/mass/volume amount
aggregation kind: whole | divisible | bundle | batch | contained lot
amount: integer or fixed-point canonical basis units
display unit: authored/localized presentation only
capacity: dimension + maximum canonical amount
fill posture: fixed count | variable fill | full/partial lot
density: optional explicit conversion, never assumed globally
```

`bundle` and `batch` are not physical dimensions. `Serving` is best treated as a culinary reference amount that resolves to a physical basis, not as a universal conversion. This allows one loaf serving to differ from a liquid serving while nutrition scales deterministically.

This is accepted rather than open: the only physical dimensions are `count`, `mass`, and `volume`. Serving is an authored culinary reference; bundle, batch, contained lot, and package are aggregation or packaging kinds. Capacity is a dimension plus maximum canonical amount, authoritative amount is integer or fixed-point canonical basis units, display units are presentation only, and density is an explicit optional conversion rather than an assumption.

Recommended owner boundary:

- Shared types and a game-level unit registry own dimensions, basis units, deterministic amounts, and conversion validity.
- Item food-portion profiles own canonical total amount, minimum meaningful portion, and serving references.
- Container templates own capacity and allowed physical forms.
- Recipes/workplaces/resource outputs reference compatible quantity descriptors but retain domain authority for transformations and yields.
- Inventory instances own current amount.
- Market commands quote physical/lot amounts; static market value does not own contents.

Nonculinary flora, fauna, monster, extraction, and workplace migrations may be deferred behind explicit adapters. Debt: recipes and inventory still cannot compare or transfer their quantities physically across those owners until migrated. Culinary code must not create private conversions that make this debt invisible.

## 4. Partial Consumption And Remaining Amount

Static profiles should define:

- `portionMode`: `whole_only`, `portionable_solid`, `pourable`, or `stack_divisible`;
- canonical total basis and amount;
- minimum meaningful portion;
- allowed cutting/pouring/preparation needs;
- nutrition basis.

Instances should define `totalAmount`, `remainingAmount`, and explicit opened/seal state in the same canonical basis. A UI slider may show percentage, but it converts to a permitted integer/fixed-point amount before preview or execution. Floating percentages are never authoritative.

Two percentage views must remain distinct:

1. **Source allocation** states how much of an available ingredient source is allocated across selected servings. The total allocation cannot exceed the available physical amount.
2. **Serving composition** is a normalized presentation of the completed serving's ingredient shares on an explicitly labeled physical basis.

Neither percentage is stored nutritional truth or a daily-calorie scale. Nutrition derives from physical consumption:

```text
ingredient contribution
  = amount consumed
  / nutrition basis amount
  * nutrient value per basis amount

meal total
  = sum of all ingredient contributions
```

The same calculation applies to kilocalories, protein, fat, carbohydrate, hydration, and later accepted nutrition fields.

Representative posture:

- Apple: whole-only in the first coherent slice; persistent bitten fruit waits for intentional leftover/spoilage design.
- Bread loaf: portionable solid by authored slice/segment basis.
- Meat cut: portionable with an appropriate Prepare/cutting action; cutting does not make it safe.
- Bowl of food: portionable or pourable according to output basis and available dishes.
- Drinks: pourable volume; the live `ale_cask` profile is not evidence that a cask is one drink.
- Loose nuts/berries: discrete stack-divisible count or authored mass basis; carriage normally requires a suitable container.
- Sweets: whole pieces or stack-divisible pieces; a bag is a container, not automatically one indivisible food.

Whole-only means exactly none or all. It is a validation constraint, not merely a UI choice.

## 5. Meal Actions And Composition

One player-facing surface should expose three intentions:

### Ready To Eat

- Select one or more currently ready foods and deterministic amounts.
- Preview one eating occasion.
- Execute through an engine command that decrements or removes exact instances/lots, records exposure, and applies one aggregated body-state result.
- No cooking or false “recipe” is created.

### Prepare

- Covers non-heated cutting, peeling where required, salads, sandwiches, mixed rations, bowls, and combinations of ready foods.
- Requires a compatible dish/container when the result physically needs one.
- Uses supported tools, time, and skill only when an accepted preparation contract requires them.
- May create an immediate eating occasion or a packaged composed-meal instance; the persistence choice remains open.

The selected dishes or other serving vessels determine output count: one bowl creates one serving; two bowls create two; two bowls and one plate create three; other compatible vessel combinations create the corresponding count. The candidate UI is an ingredient-source row by selected-vessel column grid with deterministic amount controls; UI implementation is not authorized.

`Uniform Servings` is the default. It divides selected ingredients equally among compatible vessels, subject to available physical amounts, capacity, whole-only constraints, minimum portions, physical form, and dietary exclusions. For example, if a source sack holds an amount equal to 90% of its capacity, dividing it equally among three servings contributes the physical amount equivalent to 30% of that sack's capacity to each. The backend stores those physical amounts, not percentages.

`Individual Servings` permits per-vessel allocation: more protein and less fruit, no meat, reduced dairy, different portion sizes, and supported substitutions or omissions. Across all vessels, allocations cannot exceed each source's available amount. Prepared servings may be consumed, given to party members, stored where supported, or handled by another accepted action.

### Cook

- Uses accepted recipe/workplace/tool/skill boundaries.
- A later engine command owns fuel, time, access, quality, failure, inventory mutation, and output creation.
- Static recipes describe transformations; UI does not execute them.

Preview contract:

- ingredients and amounts;
- energy, protein, fat, carbohydrate, and hydration;
- hunger reduction;
- satiety amount and estimated duration;
- morale/diversity effect with uncertainty where applicable;
- stamina/energy/recovery effects only when the body-state/activity owner supports them;
- safety and uncertainty known to the character, not hidden pathogen labels;
- required/selected container capacity and compatibility.

Lore presentation may say “fruit sugars,” “milk-rich,” “root-heavy,” “grain-based,” or another food-appropriate phrase, but backend carbohydrate truth remains carbohydrate. `Grain` or `starch` cannot replace carbohydrate when the source is fruit, honey, milk, roots, or another non-grain food.

## 6. Variety Morale And Food Fatigue

Evidence supports a cautious model: variety and acceptability can affect intake, but effect sizes and contexts vary ([S11](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s11--not-eating-enough-overcoming-underconsumption-of-military-operational-rations), [S12](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s12--effect-of-food-variety-on-intake-of-a-meal)). The game should not equate “more ingredients” with an automatic large buff.

Smallest bounded model:

- Primary exposure key: food source/ingredient family.
- Secondary facets: exact item and preparation method, retained for presentation and modest differentiation.
- Meal contribution weight: actual consumed dose and energy share.
- Dominant ingredients receive more weight than minor components.
- Token ingredients below one meaningful portion or a candidate 5–10% share do not add diversity.
- Candidate dominant threshold: 30–40% of meal energy/amount; exact threshold is balance work.
- Repeated exposure uses a rolling candidate 3–7 day window and decays over a candidate 7–14 days; exact values are open.
- Preparation variation can soften, but not erase, repeated-source exposure. Renaming smoked meat as fried meat does not reset meat-family fatigue.
- Varied meals may grant a small morale benefit; repeated dominant exposure gradually reduces that benefit and may create a bounded aversion penalty.
- Difficulty can disable the system or reduce exposure gain, penalty magnitude, and persistence.

This prevents trivial garnish, renaming, and method-swapping exploits without tracking every molecule or micronutrient.

## 7. Containers, Gathering, And Physical Inventory

The smallest static authority remains future `items.container_templates`. It should own:

- physical capacity, separate from bag slot capacity;
- personal/hand-carried/pack/cart-or-wagon/storage posture;
- liquid-tightness and food-contact posture;
- heat tolerance;
- closable, sealable, lockable, and resealable capabilities;
- allowed forms: discrete solids, loose solids, powders, pastes, liquids;
- nesting permission;
- inherent visibility and access capabilities: open-view, translucent, opaque, sample-accessible, non-destructively openable, destructively inspectable, sealable, and lockable;
- transfer/contamination posture.

Mutable instance/runtime state separately owns current contents/fill, open/closed/sealed/locked/resealed state, nesting relationships, contamination/condition, and ownership. Transfer is an engine command that enforces capacity, physical form, access, and later contamination rules.

Static visibility/access capabilities do not depend on character observation. Later observation and inspection systems consume those capabilities and record character-relative evidence; the dependency never points backward from a container template to `knowledge.observation`.

Physical intent:

- Loose berries, nuts, seeds, grain, flour, powders, and similar goods normally need a suitable pouch, basket, sack, jar, or other container.
- Liquids need liquid-tight containers.
- Some whole items can be carried in a hand, pocket, belt, or pouch.
- Bulk goods need actual sacks, baskets, crates, barrels, carts, wagons, pack animals, or storage.
- Ordinary inventory has no magical weight/volume exemption.
- Extradimensional containers remain later endgame/replay content.

Physical vocabulary is illustrative and explicitly non-exhaustive: pouch, packet, bag, sack, satchel, bundle, basket, bushel container, hamper, box, case, chest, crate, jar, bottle, flask, jug, crock, pot, keg, cask, barrel, bale, bolt, roll, rack, and other suitable personal, storage, or transport containers. Package identity must match the actual goods and capabilities; a basket is not chosen merely because it sounds artisanal.

Future custom labels are mutable item-instance presentation metadata, gated by appropriate materials, tools, access, literacy or symbol knowledge, and ability. Written tags, paint, engraving, carving, burning, branding, stamping, plaques, and seals are possible methods. A label such as `Smoked Meats` on a true `Wooden Crate`, or `Grains` on a true `Hemp Sack`, never replaces true identity, manifest, origin, condition, ownership, or character-relative knowledge.

## 8. Ration, Provision, Mixed, Hearty, Luxury, And Fresh Naming

Accepted semantics are:

- **Ration:** a logical portable food package. Primary size names are `Small Ration`, `Medium Ration`, and `Large Ration`; any may be divided or shared. `Party Ration` and `Large Party Ration` are short-duration multi-serving assortments.
- **Provisions:** sustained multi-container logistics supplies. Prefer exact container/content names: sack of grain, crate of fish, basket of fruit, barrel of meat, cask of drink.
- A provisions crate may contain personal rations; it is not itself a personal ration.
- Use `Fresh Mixed Berries`, `Dried Mixed Berries`, `Mixed Nuts`, `Nuts and Berries` or a lore-native equivalent, and exact pairs such as `Smoked Meat and Dried Berries` when known.
- Use `Mixed Ration` only for broader or deliberately undisclosed assortments.
- **Hearty:** high-energy, protein-supporting, filling, well-made cooked mixed meal with meaningful labor/skill, ingredient diversity, and morale value. Sauce/gravy may contribute but is not mandatory.
- **Luxury:** supports both elite display luxury and attainable celebratory luxury for ordinary people.
- Accept `Market Fruit Bag`, `Fresh Produce Basket`, and `Prepared Meal` as directions when they match physical truth. A producer assortment such as `Baker's Bundle` is governed by the constrained mystery-assortment rules below when its contents vary.
- Avoid `Wrapped Meal`, `Prepared Meal Parcel`, `Inn Meal Parcel`, and `Cookshop Parcel` as defaults.
- Venue does not create a new recipe identity. Skill, ingredients, condition, service, and presentation can differ.

Historical Earth examples in the evidence index remain comparison-only. No Earth proper-name dish, place, product, or recipe is proposed as repository content. Any new cuisine or specialty requires lore-native authored input.

## 9. Artisan And Producer Assortments

Direct known lots coexist with mystery assortments. A loaf, half-dozen or dozen rolls or muffins, measured sack, known bolt of cloth, known hide, stated boards, or stated metal stock has an exact known manifest unless fraud separately creates a discrepancy.

A mystery assortment is a constrained physical package whose true manifest resolves and persists when merchant stock is generated. If future stock remains abstract until purchase, resolution may occur during the sale transaction immediately before ownership transfer. Opening only reveals existing truth and never rolls or rerolls contents. Save/load, transfer, inspection, weight, value, fraud, and provenance all operate against the persisted manifest. An artisan assortment is not automatically a meal, ration, or venue-based identity; its physical contents and producer/category profile determine what it is.

### Reusable tier template

The default template uses contextual selection bands. A producer may expose only two tiers when appropriate, but each exposed tier must map explicitly.

| Offer tier | `band_0` | `band_1` | `band_2` | `band_3` | Floor |
| --- | ---: | ---: | ---: | ---: | --- |
| Clearance | 68% | 27% | 4% | 1% | `band_0` |
| Standard Artisan | 0% | 72% | 23% | 5% | `band_1` |
| Select | 0% | 0% | 80% | 20% | `band_2` |

These are accepted candidate defaults for later balancing, not implemented values. `band_0` means clearance, scrap, day-old, irregular, seconds, or least desirable but honestly saleable goods; `band_1` ordinary/fresh/serviceable trade quality; `band_2` fine/select/premium/specialty or unusually useful/expensive quality; `band_3` rare/exceptional/prestige/luxury/masterwork-adjacent outcomes. Floors and rare chance increase by tier.

Bands select outcomes but do not replace category-specific quality truth. Baker, pastry, and confectionery quality may reflect freshness, flour refinement, enrichment, bake, decoration, ingredient rarity, size, and consistency. Butcher, fish, and cheese quality may reflect freshness, cut, yield, fat/cure/smoke/aging, source rarity, and condition. Apothecary, herb, spice, and alchemy quality may reflect purity, potency, provenance, processing, contamination, and seals. Textile/leather, wood, and metal categories retain their own material, dimensions, processing, defect, finish, scarcity, and workmanship attributes.

A future static profile must constrain slot pools, quantities, duplicate rules, value bounds, producer/trade eligibility, region/season/event conditions, package identity, and knowledge posture. It must never select arbitrary catalog items. Finished-output pools and ingredient/material-surplus pools remain distinct; a producer surplus bag may contain only inputs the producer actually uses or stocks.

The reusable owner must serve culinary producers—baker, pastrymaker, confectioner, lore-native chocolatier, butcher, fishmonger, cheesemaker, brewer, spice merchant, grocer, farmer, orchardist, herbalist, apothecary, alchemist, and specialty preserver where later authority supports them—and nonculinary consumers. Examples include textile/leather scraps or fine selections, wood offcuts or select joinery stock, metal scrap or fine processed stock, and later-authorized potter, glassworker, cooper, fletcher, chandler, scribe/bookbinder, mason, jeweler, lapidary, enchanter, or magitech assortments. These examples authorize no content, profession, or system.

### Stock, fraud, and pricing boundaries

Tier and stock posture are separate. Clearance/day-old/surplus/scrap/seconds stock is finite, normally has no same-day replenishment, and has a short release/withdrawal window. Fresh/standard stock is finite production-batch stock with authored replenishment intervals. Select/luxury/event stock is very limited and may appear only during narrow hours, busy periods, market days, festivals, commissions, catering, noble/guild events, or leftovers; it may be absent on ordinary days. Until simulated demand exists, deterministic finite stock and withdrawal/expiry windows are valid, but this audit does not claim live NPC sell-through.

Honest clearance is not automatically rotten, unsafe, fraudulent, or useless. Undisclosed rot, contamination, false origin, unusable filler, or deceptive top layers belong to fraud and inspection, and no declared tier may yield below its floor. Clearance is usually discounted for age, irregularity, uncertainty, or mixed usability; standard remains near ordinary expected trade value with variance; select may charge for its higher floor, scarcity, convenience, prestige, packaging, or rare chance. Exact prices remain open, and future expected-value bounds plus duplicate caps must prevent trivial infinite-profit loops.

## 10. Manifest Truth, Unknown Groups, And Stacking

Creation-time manifest resolution remains the repository-wide default:

```text
physical unit/lot identity
  -> immutable creation-time true manifest/origin/quality
  -> mutable condition and container state
  -> character-specific observations/evidence
  -> visible inventory presentation group
```

- Physical stack identity means units are actually compatible for storage/transfer semantics.
- A heterogeneous instance group is a collection of individually truthful units that look equivalent to the character.
- A UI presentation group is only a visible slot/listing; it never erases unit ids or manifests.
- Unknown identical-looking containers may share one visible group even when hidden manifests differ.
- Opening or identifying one unit reveals existing truth and may split the group.
- Known units stack only when observed identity is compatible.
- Bulk lots may intentionally have identical or correlated contents when the creation source says so.
- Opening-time RNG remains rejected. Opening never rerolls true contents.

The live integer-only `InventoryStack` cannot currently preserve this model. That is a prerequisite gap, not permission for the UI to fake it.

## 11. True Identity, Knowledge, Fraud, Inspection, And Reputation

Fraud, smuggling, substitution, counterfeit presentation, and deceptive packing remain valid setting concepts. Historical English bread regulation demonstrates that weight, quality, inspection, claims, and enforcement can be distinct concerns, while remaining locally and institutionally scoped ([S16](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s16--from-the-bakehouse-to-the-courthouse)).

Required separation:

| Layer | Owner direction |
| --- | --- |
| True identity/origin/manifest/quality/condition | Item/lot instance truth |
| Seller claim, label, sample, or document | Transaction/context state |
| Character observation and certainty | Character-relative item observation/evidence |
| Deception method and sophistication | Static trade-deception profile plus context command |
| Buyer recognition | Knowledge, skill, exposure, evidence, and contextual difficulty |
| Seller ethics/tendency | NPC/social owner; never proof of a particular item |
| Seller/institution reputation | Scoped counterparty memory and existing local/regional reputation boundaries |
| Inspection resolution | Engine-owned contextual action |
| Fraud frequency/forgiveness | Difficulty rule |

Ordinary recognition should resolve automatically when exposure and skill make the answer obvious. Checks are for altered, unfamiliar, concealed, or contested goods.

Contextual inspection actions may include viewing a sample, deeper sack/crate inspection, smell, taste, weighing, seal/mark/document review, or consultation. Availability and consequences depend on access, destructive opening, seller permission, deposits, transaction timing, offense, trust, and refusal. A marketplace UI cannot silently grant all observations.

Difficulty must be able to disable fraud or tune frequency, sophistication, magnitude, inspection forgiveness, and quality/spoilage substitution severity. True manifest is unchanged by difficulty.

No new character receives a global omniscient merchant-reputation score. Existing player fame/notoriety is not seller truth.

## 12. Starting Goods And Difficulty

Current starting bundles are fixed content, but construction is UI-owned and creates simple stacks. Later starting food/container choices may vary by:

- run difficulty;
- spawn region;
- prestige/incremental Legacy unlocks;
- future background, institution, lineage, or scenario only when those owners explicitly support the choice.

Do not add items now. First accept ration/container nomenclature, quantity semantics, and instance-manifest construction. Starting manifests should be fixed, known to the new character, deterministic, and balance-stable. Difficulty can change which authored bundle is selected; it must not make the first opening reroll its contents.

## 13. Moderate Nutrition, Satiety, Body State, And Difficulty

Retain backend:

- game-scale energy;
- protein;
- fat;
- carbohydrate;
- hydration;
- consumed portion size;
- satiety amount;
- satiety duration.

The later consumable-profile v2 and meal/nutrition/difficulty package owns serving-basis nutrient values, satiety amount/duration, meal aggregation results, dietary exposure/monotony contracts, body-state integration, and difficulty controls. Static food-state profiles own readiness, crafting process-method references, preservation outcomes, hazard profiles, and portionability only; they must not duplicate nutrient or satiety fields. Player-engine body state owns intake, energy demand, protein/hydration coverage, fatigue, starvation, and recovery effects. A future moderate extension may apply nutrition to recovery, sustained activity, fatigue, muscle development, strength adaptation, and coarse deficiency only through those accepted owners.

Detailed micronutrients are not the default. WHO's diversity/balance guidance is modern comparison, not a medieval menu or numeric game prescription ([S17](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s17--healthy-diet)). Numeric macros may remain hidden or summarized until character knowledge supports precision.

Difficulty should independently tune or disable:

- nutrition-pressure consequences;
- satiety/hunger forgiveness;
- monotony/exposure pressure;
- food-risk severity and information forgiveness;
- fraud frequency and inspection forgiveness.

Existing difficulty/body-state scalars are the correct owner family, but values require a dedicated balance package.

## 14. Historical Food Safety And Dangerous Foods

Modern safety evidence shows that cleanliness, separation, cooking, temperature, water/materials, and process detail address different hazards ([S13](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s13--five-keys-to-safer-food-manual), [S14](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s14--safe-food-handling)). Those are hidden engine truths. Characters should reason through smell, visible condition, season, trusted source, household discipline, preservation tradition, preparation success, and experience—not pathogens, germ theory, exact refrigerator temperatures, or modern regulatory labels.

Noble-house safety should emerge from better supply, staff specialization, cleaner water/access, storage, inspection, ingredients, preparation consistency, and willingness to discard suspect food. It is not universal modern scientific knowledge.

Minimum orthogonal hazard model:

| Presentation/readiness | Hidden hazard dimensions | Process outcome |
| --- | --- | --- |
| Safe as presented | No material known residual under current condition | May be eaten directly |
| Requires ordinary cooking | Heat-sensitive ordinary risk | Successful supported cook process reduces specified risks only |
| Requires non-heat processing | Washing, soaking, leaching, peeling, drying, fermenting, curing, or other authored need | Required process may reduce specified hazard |
| Requires specialist preparation | Technique/part selection/dose/sequence critical | Skill and success determine residual risk |
| Conditionally edible | Season, life stage, part, dose, condition, or combination matters | Resolver checks conditions |
| Unknown | Character lacks reliable observation | Hidden truth still exists |

Hazard dimensions include biological contamination/pathogen, parasite, toxin/poisonous part, harmful secretion or venom where fantasy biology supports it, spoilage, environmental/chemical contamination, physical hazards, and residual risk after processing.

Ordinary cooking must not automatically make every mushroom, fish, plant, animal, monster part, toxin, venom, or secretion safe. Some foods remain dangerous after heat, require selected parts or dose limits, or depend on specialist success. Fantasy hazards require lore-native authorship; this audit invents none.

## 15. Owner Matrix And Rebuilt Package Sequence

### Owner matrix

| Concept | Current owner | Proposed owner category | Key boundary |
| --- | --- | --- | --- |
| Static item identity/name | `items.items` | Static | Authored identity, never parsed for mechanics |
| Readiness/process/preservation | Partial descriptive chain context; otherwise none | Static food-state plus crafting registry | Food state owns outcomes; future `crafting.food_process_methods` owns reusable method identities |
| Safety/hazard | None | Static plus engine resolver | Hazard truth separate from character cues |
| Nutrition | `items.consumable_profiles` | Static | Per-basis values, no action execution |
| Portionability | None | Static | Mode, total basis, minimum portion |
| Remaining amount/opened state | None | Instance | Deterministic per-unit/lot amount and state |
| Composed meal | Descriptive chains only | Command and optional instance | Immediate occasion unless deliberately packaged |
| Dietary exposure | None | Character-relative | Dose/dominance/recency history |
| Container template | None | Static | Capabilities/capacity, no contents |
| Inventory unit/group | Simple shared stack | Instance/presentation | Per-unit truth beneath visible grouping |
| True/observed identity | None | Instance versus character-relative | Truth never overwritten by observation |
| Seller claim/reputation | Context only | Instance/context versus scoped memory | No omniscient score |
| Inspection | None | Command | Permission, evidence, access, consequences |
| Prepare/Cook/Open/Consume | UI/demo mutations or absent | Command | Engine owns authoritative deltas |
| Body state | Player engine | Dynamic player state | Receives resolved meal/consumption outcomes |
| Difficulty | Player engine/global rules | Static rule plus run state | Feature switches and bounded scalars |
| Static assortment profile | None | Reusable market/economy assortment static authority | Tier, pools, weights, floors, quantities, duplicates, value bounds, eligibility, package ref |
| Contextual quality mapping | Domain records only | Reusable static producer/category mapping | Bands select; category attributes retain physical quality truth |
| Merchant stock instance | Market context only | Economy/inventory instance | Resolved manifest, condition, quote, availability window, seller claim, stock identity |
| Production/stock schedule | Descriptive production/economy context | Economy/production schedule | Batch generation, replenishment, withdrawal, event release, later demand/sell-through |
| Assortment knowledge | None | Character-relative observation/evidence | Known tier, observed contents, appraisal evidence, certainty |
| Purchase/open/inspect | Absent or UI-adjacent | Engine commands | Transfer or reveal existing truth; never reroll |

### Dependency sequence

```text
P1 contract acceptance decision
  -> P2 shared quantity foundation
      -> P3 static food-state profiles
      -> P4 static container templates
          -> P5 item-instance truth and presentation groups
              -> P6 knowledge/fraud/inspection contract
              -> P8 meal/nutrition/difficulty contract
      P3 + P4 -> P7 culinary catalog integrity
      P4 -> A1 reusable static assortment profiles and contextual-quality mappings
  A1 + P5 -> A2 merchant stock instances
  A1 + A2 -> A3 production/replenishment/withdrawal schedule
  A2 + P6 -> A4 purchase/transfer/open/inspect commands
  P6 + P7 + P8 -> P9 engine-owned food actions
  P5 + P7 + P8 -> P10 starting food manifest variants
```

The graph is acyclic. Static assortment authorship does not require stock scheduling; stock truth exists before opening; commands consume rather than create manifest truth. The best future direction is one reusable market/economy assortment authority with culinary and nonculinary consumers, not a culinary-only random-box owner. Full package fields—label class, exact scope, prerequisites, proposed files, validation, checks, risks, rollback, `0.6.6` relation, provenance, and readiness—are in the JSON artifact.

P1 is selected as the smallest later package because P2 cannot safely choose basis units, P3 cannot safely encode process outcomes, and P7 cannot safely repair sausage/profile collisions until the remaining contract decisions are accepted. P1 is design-ready only. P2–P10 are blocked. There are zero implementation-ready packages.

## Open Decisions For GPT/Human Review

1. Accept exact mass/volume basis units, scales, and display conversions.
2. Accept the first controlled culinary process-method vocabulary and parameters under the already accepted future `crafting.food_process_methods` owner.
3. Decide whether ad hoc prepared meals persist only when packaged or can also exist as transient eating occasions.
4. Accept method-to-hazard reduction and residual-risk rules without universal heat clearance.
5. Select minimal representative food/container fixtures.
6. Decide whether item observations are a distinct player collection or Knowledge evidence records.
7. Select appraisal/inspection skill and Knowledge owners.
8. Set non-token/dominance/decay bands for food exposure.
9. Map difficulty tiers to fraud, monotony, nutrition, and food-risk switches.
10. Set exact ration manifests, sizes, kilocalories, serving potential, and balance.
11. Set exact assortment slot counts, quantity ranges, and any later simulation adjustment to the candidate tier weights.
12. Select exact reusable static assortment/contextual-quality owner paths and exact stock-generation, replenishment, event-release, and demand owners.
13. Select producer/category catalogs, lore-native names, and expected-value/price-variance bounds.

These decisions require user/GPT authorship. The audit does not guess them into implementation.

## Risks And Deferrals

- Cross-domain quantity migration can become broad and high-risk; the shared foundation should introduce contracts before migrating existing content.
- Item-instance truth touches inventory and save state. No backward-compatibility or migration work is authorized for this pre-release project.
- The current UI owns starter construction and some inventory mutation; runtime work must be an explicit ownership-transition package.
- Food safety and spoilage are different: hazard metadata can precede time-based spoilage runtime.
- Fraud concepts are retained now, but transaction runtime waits for Knowledge/social/service/economy owner decisions.
- Historic numeric evidence is too context-dependent to finalize balance. The provisional `2,500` and `3,500-4,000 kcal/day` anchors are user-authored approximations, not historical findings or ration bands.
- The three new artifacts are temporary guardrails. The next decision run must either promote accepted guidance into one durable authority or retain each artifact with a named consumer/removal condition.
- Held `Version 0.6.6` remains paused and unchanged. This audit neither restores nor cancels it.

## Validation Posture

This audit is documentation-only. Required validation covers strict JSON parsing, count reconciliation, local paths/live ids, future prefixes, Markdown links, owner/state/readiness coverage, source scope/limitations, prohibited modeling patterns, manifest truth, acyclic package dependencies, exact changed paths, conflict markers, whitespace, and diff checks. It does not require builds, typechecks, application lint, generators, servers, dependency installation, or runtime tests.
