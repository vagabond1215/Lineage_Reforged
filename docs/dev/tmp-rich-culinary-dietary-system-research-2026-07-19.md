# Rich Culinary And Dietary Research Results Repair And Acceptance Audit

- Run class: unversioned documentation-only repair audit
- Parent: none
- Milestone impact: `supports_current_band`
- Date: 2026-07-20
- Starting commit: `1656585f154a79684d815cb67d391d2a9338100f`
- Branch/status assumption: `master`, clean at start; `git fetch` and `git pull --ff-only` completed without changing the tree
- Held route: `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused and unmodified
- Acceptance posture: repaired artifacts are ready for GPT/human inspection, not implementation authorization

## Executive Summary

This audit repairs the prior research result without implementing content, schema, runtime, UI, balance, or lore. The repository baseline remains 1,372 items, 190 food/beverage-or-ingredient-role audit identities, nine consumable profiles with five links, 28 recipes with five food-adjacent records, and 103 prepared-state foodish identities of which 99 lack a recipe producer.

The earlier result overstated readiness in five ways. It placed a generic ration/profile cleanup before the provision schema needed to define it; described explicit biological source-output relationships as missing; treated four orphan consumable profiles as ready to link; gave mixed recommendations repository-fact confidence; and described all 99 prepared identities as a recipe backlog. Those defects are repaired in the matrix and this narrative.

The accepted ration decision is now the controlling design constraint. A provision uses four separate layers: provision archetype, geographic fulfillment profile, locked creation-time manifest, and mutable contents-knowledge state. Random selection may occur only when a manifest is created. The exact result is then stored; opening consumes that stored manifest without rerolling. Self-packed, starting, and issue provisions use fixed manifests. Knowledge is `unknown`, `category_known`, or `manifest_known`. Stack compatibility includes provision profile, origin, exact manifest, knowledge state, seal state, and quality state. Initial fulfillment is preserved-food-first; fresh items require explicit support; bulk containers remain separate. A pack never owns aggregate nutrition.

The first possible implementation package is **Food-Named Taxonomy And Consumable-Profile Integrity**, but it is only `design-ready-only`. Exact retain/remove/replace decisions for the three sausage taxonomy collisions, four bad profile links, cask serving scale, and orphan profiles remain unresolved. Its recommended label class is a new three-segment current-band primary capability. A support label is valid only if exact evidence shows that the work directly repairs `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`; the current audit does not establish that parent relationship. No version number is assigned.

## Repair Acceptance Status

### Repaired findings

- Explicit flora/fauna culinary output relationships are recorded as existing; they are not mislabeled as missing.
- `consumable` and culinary-looking names are no longer treated as proof of edibility or direct-serving eligibility. Food-safety authority precedes consumable-profile authorship.
- The four orphan profiles—`consume.ration_bundle`, `consume.trail_meal`, `consume.seafood_stew`, and `consume.tavern_fish_plate`—are deferred pending exact retain/retire/replace decisions.
- Mixed recommendation rows use `medium` confidence and `authored_input_required`; unresolved orphan decisions use `low` and `unresolved`.
- The 99 prepared identities are classified into topology categories rather than asserted to require 99 recipes.
- The package sequence follows schema and state ownership dependencies before catalog migration or runtime commands.
- The version-class recommendation now names the only possible support parent and the evidence required to use it.

### Remaining blockers

- Exact taxonomy and profile corrections are not authored.
- Biological part/state edibility and preparation safety are not authored.
- Provision sizes, allowed combinations, geographic scopes, fallback, origin handling, value, packaging, knowledge progression, and stack behavior are not accepted implementation contracts.
- Nutrition/satiety model and persistence ownership remain undecided.
- Regional cuisine requires an explicit lore/culture owner and may not be inferred from ecology.

These blockers prevent an implementation prompt. The next action is GPT/human acceptance or revision of this repaired result.

## Baseline And Authority Boundaries

| Measure | Count |
|---|---:|
| All items | 1,372 |
| Explicit `ingredient` role | 186 |
| Explicit `consumable` role | 144 |
| Food/beverage branch or ingredient-role audit set | 190 |
| Items with `consumableProfileId` | 5 |
| Consumable profiles / orphan profiles | 9 / 4 |
| Recipes / food-adjacent recipes | 28 / 5 |
| Prepared-state foodish identities | 103 |
| Prepared-state foodish identities without a recipe producer | 99 |
| Flora / fauna / monsters | 117 / 132 / 24 |
| Regional ecology profiles / starting bundles | 9 / 7 |
| Starting bundles containing one `ration_bundle` | 6; Traveler is the exception |
| Production chains / workplaces / services / extraction methods | 121 / 58 / 5 / 22 |

The repository has strong identity and reference closure but weak culinary authority. Item roles are cross-domain capability metadata. Flora, fauna, and monster outputs prove source relationships, not human edibility. Production-chain `recipeProfile` prose is descriptive macro topology, not player-recipe authority. Ecology profiles prove regional opportunity, not cuisine canon. Consumable profiles supply body-state inputs, not portion, safety, satiety, or pack semantics.

The required source chain is:

`biological identity -> explicit output relationship -> canonical item -> food-grade part/state and safety authority -> preparation/recipe -> direct-serving profile`

The matrix now distinguishes the explicit relationships that already exist from the safety authority that does not.

## Domain Findings

### 1. Ingredient, edibility, and safety authority

No identity may become food merely because its key looks culinary or its roles include `ingredient` or `consumable`. Raw meat, fish, shellfish, eggs, milk, mushrooms, and unfamiliar plant parts require explicit food-grade part/state and preparation authority. Useful future relationship states remain `edible_raw`, `edible_after_cooking`, `edible_after_processing`, `conditionally_edible`, `medicinal_or_reagent_only`, `animal_feed_only`, `industrial_only`, `toxic_or_hazardous`, and fail-closed `unknown`.

This is the prerequisite for direct-serving profile decisions. The matrix therefore uses `needs_food_safety_authority` for 377 mixed-evidence records. It retains the live biological output relationship where one exists and does not fabricate its meaning.

### 2. Food state and preparation vocabulary

Add a tradeable state only when it changes safety, storage, value, quality, transport, recipe use, regional identity, or player choice. Salting, drying, hot smoking, cold smoking, smoke-drying, pickling, fermenting, and candying must not collapse into one generic safety promise. Runtime freshness, age, contamination, temperature, and spoilage remain deferred until inventory-instance time/storage ownership exists.

### 3. Recipe and topology evidence

The five food-adjacent recipe records are `recipe.grain_bundle_to_flour`, `recipe.flour_to_bread_dough`, `recipe.bread_dough_to_bread_loaf`, `recipe.butchered_meat_to_smoked_meat`, and `recipe.fish_raw_and_salt_crystal_to_smoked_fish`. They are explicit, planned, and non-executing. Production chains expose candidate families but cannot supply missing inputs, quantities, safety, or recipe authority.

Earlier candidate recipes such as a berry preserve, hot-smoked oyster provision, and milk-to-curd transformation remain blocked recommendations, not implementation-ready records. Their source/reference closure does not settle safety process, ingredients, byproducts, retained containers, integer quantities, or profile authority.

The 99 prepared identities without recipe producers are topology evidence, classified as:

| Topology category | Count | Meaning |
|---|---:|---|
| Finished food or direct-serving candidate | 72 | Requires exact role/profile/recipe review; not automatically a missing recipe. |
| Intermediate or process input | 12 | May legitimately be produced by macro systems or future transformations. |
| Bulk or serving container | 9 | Needs serving-scale/container semantics before consumption. |
| Service or presentation identity | 5 | May belong to hospitality/menu ownership rather than crafting. |
| Cross-domain false positive or taxonomy review | 1 | Requires correction/reclassification, not recipe authorship. |

### 4. Nutrition and satiety

The live profile supports calories, protein, carbs, fat, hydration, intoxication, and a use verb. It has no portion, fullness, satiety duration, food-group diversity, restriction, storage, spoilage, contamination, or safety contract.

Two bounded future candidates remain open:

- Model A: authored portion class, fullness units, and duration band, with no derived equation.
- Model B: Model A plus coarse authored protein, fibre, water/volume, texture/form, and optional meal-role contributions.

External evidence supports keeping energy and fullness separate and treating protein, volume, energy density, texture, and fibre as distinct and uncertain contributors. It does not establish fantasy balance numbers. No aggregate nutrition belongs on a provision pack; named contents retain their own profiles. The nutrition package remains behind explicit model, balance, state, save, and UI decisions.

### 5. Dietary restrictions

Restrictions require independent owners for character or lineage needs, institutional or religious rules, recipe composition, runtime compatibility, and UI disclosure. Ecology and item names cannot invent setting taboos, allergies, or religious canon. No restriction runtime is authorized by this audit.

### 6. Regional cuisine and lore

The nine regional ecology profiles support ingredient opportunity and trade pressure only. They do not authorize everyday dishes, feasts, taboos, naming, preservation customs, or hospitality menus. Regional cuisine stays behind named lore/culture ownership and must avoid changing ecology authority.

### 7. Naming and serving scale

Prefer source plus preparation/form for foods and add place, maker, institution, season, or prestige only after authority exists. `hearty` describes a filling, complementary composition; `luxury` describes origin, rarity, labor, variety, quality, prestige, or packaging. A cask, jar, crock, bundle, board, plate, and individual serving are not interchangeable consumption scales.

### 8. Accepted provision architecture

The accepted authority is `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`. Its four layers are mandatory:

1. **Provision archetype** — purpose and broad promise, independent of a specific region.
2. **Geographic fulfillment profile** — allowed local substitutions for a defined geographic scope.
3. **Locked manifest** — exact item ids and positive integer quantities selected or assigned at creation.
4. **Mutable contents knowledge** — what the player currently knows about the already-locked contents.

Contract rules:

- Archetype size bands are `small`, `medium`, and `large`; size is serving/capacity posture, never quality.
- Composition families may include `fruit`, `fruit_and_nut`, `preserved_protein`, `mixed`, `meal_provisions`, `hearty_provisions`, and `luxury_provisions`; the initial catalog need not implement every size/composition permutation.
- Regional variants normally share one primary character-facing name. Origin remains visible through subtitle, provenance, or inspection detail.
- Geographic fulfillment may conceptually scope to region, country, continent, institution, or global, but may reference only canonical live ids. Fallback is explicit and authored, never inferred from a name or map position.
- Origin comes from the creation source/profile, never the character's location when the provision is opened.
- Randomness occurs only when a randomized provision instance is created.
- The exact manifest is stored on the instance; inspection, transfer, save/load, and opening never reroll it.
- Valid creation points include purchase, self-packing, starting grant, institutional issue, loot generation, merchant stock, and quest/event award.
- Self-packed, starting, and institutional issue provisions use fixed manifests at creation/grant time.
- Commercial or scavenged assortments may use constrained regional RNG through typed required slots and weighted candidate lists. Initial work should prefer fixed manifests or narrow weighted lists until instance metadata and stacking are proven.
- Knowledge is exactly `unknown`, `category_known`, or `manifest_known`; knowledge changes do not change contents.
- A future `verified` state or knowledge source remains deferred until inspection, deception, counterfeit labeling, appraisal, or merchant trust provides an owner.
- Stack compatibility includes provision profile, origin, exact manifest, knowledge state, seal state, and quality state.
- Initial geographic fulfillment uses preserved named foods. Fresh foods require explicit storage/duration support.
- Bulk food and drink containers remain a separate contract from travel provisions and individual servings.
- Packs have no aggregate calories, macros, hydration, fullness, or consume effect.
- Opening must be an atomic engine-owned inventory command that consumes the stored manifest and handles capacity failure without duplication or loss.

The current `ration_bundle` in six starting bundles is not sufficient authority for any of these layers. Traveler's lack of one may be intentional and requires an explicit start-balance decision.

### 9. Food safety, storage, and spoilage

Static food-grade and preparation-safety authority is required early. Runtime storage/spoilage is package 10 and remains deferred because the repository has no accepted inventory-instance age, storage context, contamination, time/temperature exposure, stack split/merge, warning, or save owner. No invisible random poisoning, per-microbe simulation, copied modern shelf-life tables, or `smoked = safe forever` rule is recommended.

## Profile And Taxonomy Corrections Requiring Decisions

| Item/profile | Current conflict | Decision required before implementation |
|---|---|---|
| `sausage_coil` | lighting / oil-wax taxonomy | Exact food branch/subbranch and whether identity remains distinct. |
| `sausage_link` | stationery / ink taxonomy | Exact food branch/subbranch and identity relation. |
| `smoked_sausage_link` | stationery / ink taxonomy | Exact food branch/subbranch and identity relation. |
| `bread_loaf -> consume.bread_loaf` | coherent direct-serving link | Preserve. |
| `breast_cut -> consume.game_stew` | raw cut mapped to finished stew | Remove or name the exact replacement profile. |
| `candied_peel -> consume.inn_hearty_meal` | small sweet mapped to complete meal | Remove or name the exact replacement profile. |
| `crusty_sausage_roll -> consume.traveler_ration` | named food mapped to generic ration | Remove or name the exact replacement profile. |
| `ale_cask -> consume.ale_cask` | bulk container consumed as one serving | Decide bulk-only versus separate serving identity/profile. |
| Four orphan profiles | existence without linked item authority | Exact retain, retire, or replace decision for each. |

Validation must be semantic and non-name-fragile: exact known corrections plus owner/scale/reference invariants, not generic substring rules.

## Owner And Dependency Order

| Capability | Required owner | Must precede / depend on |
|---|---|---|
| Food taxonomy and profile integrity | item/profile content plus focused validator | First correction package; blocked on exact decisions. |
| Food-grade part/state and safety | source/item relationship authority | Precedes direct-serving profiles and named preserved foods. |
| Provision archetype/geographic schema | new static provision authority | Precedes ration catalog/migration and runtime open-pack. |
| Locked manifest/knowledge/stack state | inventory instance/shared contract | Depends on provision schema; precedes variable packs and open-pack. |
| Named preserved foods | item/source/value authority | Depends on safety and geographic fulfillment needs. |
| Ration catalog/start migration | provision content and start-state authority | Depends on schema, named foods, manifest, knowledge, and stack contracts. |
| Open pack | player-engine inventory command | Depends on exact stored manifests and atomic capacity behavior. |
| Nutrition/satiety | profile schema, player engine, balance, save/UI as needed | Independent of pack aggregate nutrition; depends on accepted model. |
| Regional cuisine | lore/culture authority | Depends on ecology/trade evidence but does not rewrite it. |
| Spoilage | inventory-instance time/storage plus save/UI | Deferred until repeated gameplay value and owners exist. |

## Corrected Package Sequence

| Order | Package | Readiness and label posture |
|---:|---|---|
| 1 | This repair and acceptance audit | Unversioned documentation-only; complete pending GPT/human acceptance. |
| 2 | Food-Named Taxonomy And Consumable-Profile Integrity | Selected first; `design-ready-only`, blocked on exact corrections. Recommend new three-segment current-band primary. Support only with proof of direct repair to `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`. |
| 3 | Provision Archetype And Geographic Fulfillment Schema | Blocked on sizes, combinations, scopes, fallback, origin, value, and packaging. |
| 4 | Named Preserved Food Foundation | Blocked on package 3 demands plus safety/source authorship. |
| 5 | Inventory Manifest, Knowledge, And Stack Contract | Blocked on inventory-instance ownership and exact stack semantics. |
| 6 | Ration Catalog And Starting-Bundle Migration | Blocked on packages 3–5, orphan-profile decisions, and Traveler intent. |
| 7 | Engine-Owned Open-Pack Command | Blocked on packages 5–6; must use the stored manifest with no reroll. |
| 8 | Nutrition And Satiety Authority | `design-ready-only`; blocked on model, balance, and transient/persisted state. No aggregate pack nutrition. |
| 9 | Regional Cuisine And Food Lore | Blocked on exact lore/culture ownership; ecology remains evidence only. |
| 10 | Storage, Spoilage, And Food-Safety Runtime | Deferred; no current instance-time/storage owner or accepted gameplay need. |

This sequence is dependency-ordered: schema before catalog, manifest/knowledge/stack before migration and opening, and catalog before runtime execution. The sequence does not restore, replace, or consume paused `0.6.6`.

## Version-Class Decision

The prior phrase “support run attached to nearest authority” is invalid because support labels require an exact accepted parent and direct repair evidence. The known defects predate this audit and cross item taxonomy, profile semantics, container scale, and validation. The default recommendation for package 2 is therefore a **new three-segment current-band primary capability**, with no numeric version selected here.

The only support alternative under review is a four-segment child of `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`. That alternative becomes valid only if history or the parent output proves the exact taxonomy/profile defects were introduced by, or were explicit acceptance defects of, that parent. The current evidence does not prove this. No other vague or nearest-owner support classification is acceptable.

## Open Questions For Acceptance

1. What exact serving quantities distinguish the accepted `small`, `medium`, and `large` size bands?
2. Which archetype/size combinations are allowed?
3. Does “large” mean more days, more consumers, more variety, or some explicit combination?
4. Which canonical live region, country, continent, institution, or global scope ids may initial fulfillment profiles use?
5. What deterministic fallback applies when a geographic profile cannot fulfill an archetype?
6. How is unknown, mixed, or unavailable provision origin represented?
7. Are deliberately false labels, concealment, or tampering excluded from the first knowledge contract?
8. Is provision value derived from exact contents plus packaging, authored on the profile, or calculated by another exact rule?
9. Which packaging identities and seal states exist in the first schema?
10. Is Traveler's missing `ration_bundle` intentional, and what fixed starting provision should it receive, if any?
11. May a “hearty” provision exist before nutrition/satiety authority, or must that label wait?
12. What exact stack rules apply across manifest, origin, knowledge, seal, and quality differences?
13. Does package 2 use a new three-segment primary label, or is there exact evidence for a support child of `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`?
14. For each orphan profile, is the exact disposition retain, retire, or replace?
15. What exact branch/subbranch should `sausage_coil`, `sausage_link`, and `smoked_sausage_link` use, and are all three distinct foods?
16. For `ale_cask`, `breast_cut`, `candied_peel`, and `crusty_sausage_roll`, should the link be removed or replaced by which exact profile?
17. Should casks remain bulk trade/storage containers only, with a separate serving identity?
18. Which flora/fauna/monster-derived parts are food-grade, preparation-required, toxic, medicinal-only, feed-only, industrial-only, or unresolved?
19. Does acceptance select nutrition Model A or Model B, and is fullness transient or persisted?
20. Which exact lore/culture owner may author regional cuisine without changing ecology authority?

## Rejected Complexity And Stop Conditions

- No content dump, generic recipe inference, automatic edibility, or generic tag-driven execution.
- No micronutrient simulation or scientific-looking fullness equation.
- No aggregate provision nutrition, nested packs, inspection rerolls, or UI-owned inventory mutation.
- No cuisine inferred from biome/native-source lists and no invented taboo/religion/allergy canon.
- No backward compatibility, migration aliases, or old-save preservation unless explicitly requested later.
- No implementation prompt, active-prompt replacement, or restoration of `0.6.6` from this audit.

## Conclusion

The repaired research result is internally ordered and explicit about what the repository proves versus what still requires authorship. Package 2 is the narrowest candidate implementation, but unresolved exact taxonomy/profile decisions keep it at `design-ready-only`. The next step is GPT/human acceptance of these four repaired artifacts and answers to the blocking questions. This run stops there: it does not authorize implementation, assign a version number, generate the next implementation prompt, or restore paused `0.6.6`.
