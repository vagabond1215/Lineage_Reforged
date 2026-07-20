# Culinary Preparation, Portion, Meal Composition, Food Knowledge, And Historical Ration Integration

Source run: Culinary Preparation, Portion, Meal Composition, Food Knowledge, And Historical Ration Integration Audit

Date: 2026-07-20

Classification: unversioned documentation-only research and design integration

Milestone impact: `supports_current_band`

Implementation permission: none

Related artifacts:

- [Historical energy and ration source index](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md)
- [Machine-readable quantity, container, knowledge, owner, and package audit](tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json)
- [Controlling culinary decision](../design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md)
- [Packed-food plan](../design/packed-food-ration-and-provisions-content-plan.md)
- [Manifest and container-knowledge decision](../design/regional-ration-manifest-and-container-knowledge-decision.md)
- [Item/equipment/inventory authority boundary](../design/item-equipment-inventory-authority-boundary-decision.md)
- [Recipe and production decision](../design/recipe-and-production-schema-decision.md)

## Result

The intended culinary system needs four separate kinds of authority before any taxonomy repair is safe:

1. **Static content:** item identity and authored name; food readiness, process methods, preservation effects, hazards, nutrition, portionability, and container capabilities.
2. **Item-instance state:** canonical and remaining amount, opened/seal state, container contents, true manifest/origin/quality/condition, and per-unit identity beneath visible grouping.
3. **Character-relative state:** observations, certainty, evidence, food-safety cues, dietary exposure, and scoped counterparty knowledge.
4. **Engine-owned commands:** Ready To Eat, Prepare, Cook, Open, Transfer, Inspect, and Consume, including authoritative inventory and body-state deltas.

The live repository does not yet contain the quantity, item-instance, food-state, or observation contracts needed to implement this safely. The old taxonomy/profile correction is therefore not first. No code or content package is implementation-ready.

The smallest later package is a durable **Culinary Quantity, Food-State, And Instance Contract Acceptance Decision**, classified as an unversioned documentation-only decision and currently **design-ready only**. It must close the shared quantity bases, process vocabulary, hazard reduction rules, serving posture, and observation owner questions before schemas or content move.

## Execution Gate And Repository Evidence

- Starting branch: `master`
- Starting commit: `d4d62234578b240b52dae8ad3e10b0155bcc80d4`
- Starting worktree: clean
- Fetch and fast-forward pull: completed; already up to date
- Accepted repair commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5`: confirmed ancestor
- Controlling decision SHA-256: `A4C57268467322A0071FAB5BCD399D93E61748D04A7FA2966487F0825659C4CA`
- Held `0.6.6` source: confirmed blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`
- Gate 1–5 and Gate 7 research artifacts remain assigned solely to `0.6.7`; they were inspected as retained evidence and not edited, consumed, deleted, or repurposed.

Measured live facts:

- `items.json` contains 1,372 records. Food, cask, jar, sack, basket, and bottle identities do not have food-state, portionability, or container-capability profiles.
- Nine consumable profiles expose game-scale energy, protein, carbohydrate, fat, hydration, optional intoxication, and `useVerb`. They do not define servings, remainders, satiety, or safety.
- The body-state rule uses `dailyCalories: 100` game units and `dailyHydration: 72`. Current consumable energy values range from 10 to 38.
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
| Process methods | Controlled methods used or required: baking, boiling, drying, fermenting, frying, pickling, salting, smoking, steaming, sugaring, specialist preparation | The authored display name or automatic safety clearance |
| Preservation effect | Storage-risk reduction or stability resulting from validated method parameters and packaging | A lone manual `isPreserved` assertion |
| Safety/hazard | Biological contamination, parasite, toxin/poisonous part, harmful secretion, spoilage, environmental/chemical contamination, physical hazard, and residual risk | Character certainty or readiness alone |
| Authored presentation | Regional, specialty, quality, luxury, fuel, technique, and serving descriptors | Mechanics derived by parsing the name |

Methods can overlap:

- Smoking may cook, dry, flavor, and preserve, but the result depends on the process. Modern hot-smoking guidance explicitly distinguishes process controls and residual hazards; it does not validate every smoked product ([S15](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s15--hot-smoking-of-fish)).
- Jarring/canning may use heat, make a product ready to eat, and preserve it, yet packaging and process success remain relevant.
- Drying may preserve without cooking.
- Fermenting, curing, salting, sugaring, and pickling may change readiness, flavor, water activity, and storage differently.

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

The body-state engine already supports a variable `dailyEnergyDemand` on top of a 100-unit baseline. Future activity owners should add bounded demand for agricultural labor, construction, military exertion, travel, hunting, gathering, and strenuous craft; sedentary periods should remain near baseline. Body size, age/life stage, health, climate/season, fatigue, and recovery may modify demand only through an accepted player/body/activity owner. Sex should not be a direct gameplay penalty; if relevant, its physiological contribution should be mediated through accepted body composition and life-stage state rather than a crude label.

### Recommended ration semantics

The bands below are **game-design ranges**, not historical calorie facts. Energy is expressed against the live 100-point baseline before activity demand and difficulty modifiers.

| Recommended name | Eaters | Coverage | Candidate energy band | Candidate physical portion/component band | Use |
| --- | ---: | --- | ---: | --- | --- |
| Meal Ration | 1 | One eating occasion | 22–38 points, approximately 22–38% of baseline day | 1–3 meaningful portions or components | Accepted replacement for “small ration” semantics |
| Day Ration | 1 | One day / about three eating occasions | 90–115 points | 5–9 meaningful portions/components, normally subdivided | Personal daily carriage |
| Multi-Day Ration | 1 | Two to three days | 180–330 points | 2–3 day packs or 10–24 components | Personal journey supply; should not be one indivisible consumable |
| Shared Meal Pack | 2–3 | One meal per eater | 44–114 total points | At least one meaningful portion per eater plus shared components | Shared meal, not “large personal ration” |
| Group Meal Provisions | 4–6 | One meal per eater | 88–228 total points | 4–18 meaningful portions/components | Name by actual basket/crate/sack/cask and contents where known |

Why these bands are bounded this way:

- Current live one-person consumables already span 18–38 points; `ration_bundle` is 24, `traveler_ration` 22, and `trail_meal` 30.
- A modern MRE is explicitly one person's meal and has multiple components, but its approximately 1,250 kcal average is comparison-only and is not copied into the game ([S09](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s09--meal-ready-to-eat)).
- Large historical food lists may be household, feast, ship, or institution supply rather than an individual's intake. Maritime biscuit allowances likewise describe issue context, not actual eating ([S07](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s07--ships-biscuit)).

Recommendation: retire size-only semantics in later authored content. `Large Ration` is ambiguous between a multi-day personal supply and a shared meal. Use Meal Ration, Day Ration, Multi-Day Ration, Shared Meal Pack, or an exact group provision/container name. Modern protein bars, granola packs, bentos, packed lunches, and picnics are form analogies only; none imports calories, technology, or Earth naming.

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
- visibility/inspectability;
- transfer/contamination posture.

Mutable instance/runtime state separately owns current contents/fill, open/closed/sealed/locked/resealed state, nesting relationships, contamination/condition, and ownership. Transfer is an engine command that enforces capacity, physical form, access, and later contamination rules.

Physical intent:

- Loose berries, nuts, seeds, grain, flour, powders, and similar goods normally need a suitable pouch, basket, sack, jar, or other container.
- Liquids need liquid-tight containers.
- Some whole items can be carried in a hand, pocket, belt, or pouch.
- Bulk goods need actual sacks, baskets, crates, barrels, carts, wagons, pack animals, or storage.
- Ordinary inventory has no magical weight/volume exemption.
- Extradimensional containers remain later endgame/replay content.

## 8. Ration, Provision, Mixed, Hearty, Luxury, And Fresh Naming

Accepted semantics are preserved:

- **Ration:** relatively small portable food package for personal use or carriage.
- **Provisions:** bulk supplies. Prefer exact container/content names: sack of grain, crate of fish, basket of fruit, barrel of meat, cask of drink.
- A provisions crate may contain personal rations; it is not itself a personal ration.
- Use `Fresh Mixed Berries`, `Dried Mixed Berries`, `Mixed Nuts`, `Nuts and Berries` or a lore-native equivalent, and exact pairs such as `Smoked Meat and Dried Berries` when known.
- Use `Mixed Ration` only for broader or deliberately undisclosed assortments.
- **Hearty:** high-energy, protein-supporting, filling, well-made cooked mixed meal with meaningful labor/skill, ingredient diversity, and morale value. Sauce/gravy may contribute but is not mandatory.
- **Luxury:** supports both elite display luxury and attainable celebratory luxury for ordinary people.
- Accept `Market Fruit Bag`, `Fresh Produce Basket`, `Prepared Meal`, and `Baker's Bundle` as directions.
- Avoid `Wrapped Meal`, `Prepared Meal Parcel`, `Inn Meal Parcel`, and `Cookshop Parcel` as defaults.
- Venue does not create a new recipe identity. Skill, ingredients, condition, service, and presentation can differ.

Historical Earth examples in the evidence index remain comparison-only. No Earth proper-name dish, place, product, or recipe is proposed as repository content. Any new cuisine or specialty requires lore-native authored input.

## 9. Manifest Truth, Unknown Groups, And Stacking

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

## 10. True Identity, Knowledge, Fraud, Inspection, And Reputation

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

## 11. Starting Goods And Difficulty

Current starting bundles are fixed content, but construction is UI-owned and creates simple stacks. Later starting food/container choices may vary by:

- run difficulty;
- spawn region;
- prestige/incremental Legacy unlocks;
- future background, institution, lineage, or scenario only when those owners explicitly support the choice.

Do not add items now. First accept ration/container nomenclature, quantity semantics, and instance-manifest construction. Starting manifests should be fixed, known to the new character, deterministic, and balance-stable. Difficulty can change which authored bundle is selected; it must not make the first opening reroll its contents.

## 12. Moderate Nutrition, Satiety, Body State, And Difficulty

Retain backend:

- game-scale energy;
- protein;
- fat;
- carbohydrate;
- hydration;
- consumed portion size;
- satiety amount;
- satiety duration.

The current consumable profile owns static nutrient values. Player-engine body state owns intake, energy demand, protein/hydration coverage, fatigue, starvation, and recovery effects. A future moderate extension may apply nutrition to recovery, sustained activity, fatigue, muscle development, strength adaptation, and coarse deficiency only through those accepted owners.

Detailed micronutrients are not the default. WHO's diversity/balance guidance is modern comparison, not a medieval menu or numeric game prescription ([S17](tmp-culinary-historical-energy-ration-source-index-2026-07-20.md#s17--healthy-diet)). Numeric macros may remain hidden or summarized until character knowledge supports precision.

Difficulty should independently tune or disable:

- nutrition-pressure consequences;
- satiety/hunger forgiveness;
- monotony/exposure pressure;
- food-risk severity and information forgiveness;
- fraud frequency and inspection forgiveness.

Existing difficulty/body-state scalars are the correct owner family, but values require a dedicated balance package.

## 13. Historical Food Safety And Dangerous Foods

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

## 14. Owner Matrix And Rebuilt Package Sequence

### Owner matrix

| Concept | Current owner | Proposed owner category | Key boundary |
| --- | --- | --- | --- |
| Static item identity/name | `items.items` | Static | Authored identity, never parsed for mechanics |
| Readiness/process/preservation | Partial descriptive chain context; otherwise none | Static | Orthogonal profiles and controlled methods |
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

### Dependency sequence

```text
P1 contract acceptance decision
  -> P2 shared quantity foundation
      -> P3 static food profiles
      -> P4 static container templates
          -> P5 item-instance truth and presentation groups
              -> P6 culinary knowledge/fraud/inspection contract
              -> P8 meal/nutrition/difficulty contract
      P3 + P4 -> P7 culinary catalog integrity
  P6 + P7 + P8 -> P9 engine-owned food actions
  P5 + P7 + P8 -> P10 starting food manifest variants
```

The graph is acyclic. Full package fields—label class, exact scope, prerequisites, proposed files, validation, checks, risks, rollback, `0.6.6` relation, provenance, and readiness—are in the JSON artifact.

P1 is selected as the smallest later package because P2 cannot safely choose basis units, P3 cannot safely encode process outcomes, and P7 cannot safely repair sausage/profile collisions until the remaining contract decisions are accepted. P1 is design-ready only. P2–P10 are blocked. There are zero implementation-ready packages.

## Open Decisions For GPT/Human Review

1. Accept exact mass/volume basis units, scales, and display conversions.
2. Confirm that serving is a culinary reference amount pointing to count/mass/volume rather than a universal physical dimension.
3. Accept the first controlled process-method vocabulary and registry owner.
4. Decide whether ad hoc prepared meals persist only when packaged or can also exist as transient eating occasions.
5. Accept method-to-hazard reduction and residual-risk rules without universal heat clearance.
6. Select minimal representative food/container fixtures.
7. Decide whether item observations are a distinct player collection or Knowledge evidence records.
8. Select appraisal/inspection skill and Knowledge owners.
9. Set non-token/dominance/decay bands for food exposure.
10. Map difficulty tiers to fraud, monotony, nutrition, and food-risk switches.

These decisions require user/GPT authorship. The audit does not guess them into implementation.

## Risks And Deferrals

- Cross-domain quantity migration can become broad and high-risk; the shared foundation should introduce contracts before migrating existing content.
- Item-instance truth touches inventory and save state. No backward-compatibility or migration work is authorized for this pre-release project.
- The current UI owns starter construction and some inventory mutation; runtime work must be an explicit ownership-transition package.
- Food safety and spoilage are different: hazard metadata can precede time-based spoilage runtime.
- Fraud concepts are retained now, but transaction runtime waits for Knowledge/social/service/economy owner decisions.
- Historic numeric evidence is too context-dependent to finalize balance. Game bands remain bounded recommendations.
- The three new artifacts are temporary guardrails. The next decision run must either promote accepted guidance into one durable authority or retain each artifact with a named consumer/removal condition.
- Held `Version 0.6.6` remains paused and unchanged. This audit neither restores nor cancels it.

## Validation Posture

This audit is documentation-only. Required validation covers strict JSON parsing, count reconciliation, local paths/live ids, future prefixes, Markdown links, owner/state/readiness coverage, source scope/limitations, prohibited modeling patterns, manifest truth, acyclic package dependencies, exact changed paths, conflict markers, whitespace, and diff checks. It does not require builds, typechecks, application lint, generators, servers, dependency installation, or runtime tests.
