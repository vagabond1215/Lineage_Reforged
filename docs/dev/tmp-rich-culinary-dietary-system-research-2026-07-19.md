# Rich Flora, Fauna, Culinary, Nutrition, And Dietary Systems Audit And Research

- Run class: unversioned documentation-only research
- Parent: none
- Milestone impact: `supports_current_band`
- Date: 2026-07-20
- Starting commit: `6d99e96474bf8a74ae54f80701c15be0c76dc9e1`
- Branch/status assumption: `master`, clean at start; `git fetch` and `git pull` reported up to date
- Held route: `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused and unmodified

## Executive Summary

The repository already contains a broad biological and economic vocabulary but not a coherent culinary authority. The strongest foundation is the item/source/ecology graph: 1,372 items, 117 flora, 132 fauna, nine regional ecology profiles, 121 production chains, 58 workplaces, and an engine-owned body-state model. The narrowest weakness is factual: three food-named sausage items are assigned to lighting or stationery branches, four of five item-to-consumable-profile links are semantically wrong or container-scaled, and four of nine consumable profiles are orphaned.

The larger structural gap is topology. There are 190 food/beverage-or-ingredient-role items and 103 prepared/preserved/baked/milled/cask/infusion/dairy/processed foodish identities, but only five food-adjacent recipes—four direct baking/preservation transformations plus one generic milling transformation. Ninety-nine prepared foodish identities have no recipe producer. Production chains describe many relevant paths, but repository policy correctly prevents their broad, sometimes incomplete `recipeProfile` data from becoming recipe authority.

Nutrition is both present and intentionally narrow. Nine consumable profiles feed calories, protein, carbs, fat, hydration, and intoxication into engine-owned body state. There is no portion contract, fullness/satiety signal, food-group diversity, dietary restriction, storage, spoilage, contamination, or safety state. Current external evidence supports separating energy/nutrient contribution from fullness, using coarse portion/volume, protein, texture/form, and carefully bounded fibre evidence rather than claiming a scientific equation. The recommended candidate is the moderate model below; it keeps daily micromanagement low and adds no micronutrient simulation.

Packed foods should remain containers of named foods, never a single edible super-item and never an aggregate nutrition profile. “Hearty” should mean a more filling and nutritionally complementary composition; “luxury” should mean quality, variety, rarity, origin, labor, prestige, or packaging. A future open-pack action must be an atomic engine-owned inventory command, not another UI-side mutation.

The smallest first implementation package recommended for later review is **Food-Named Taxonomy And Consumable Profile Link Integrity**: correct only the three proven sausage taxonomy collisions and the four proven profile-link collisions, retain the coherent `bread_loaf` link, and add narrow validation. It is independent of paused `0.6.6`, creates no food system, and should run only after the required results audit confirms the exact corrections.

## Baseline And Method

### Route and recovery checks

- The active prompt was confirmed as this unversioned research run.
- `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` remains the exact held prompt.
- `git ls-tree 6394443f1628d9053b3417e926e581b7a444386c -- docs/dev/current-codex-prompt.md` resolved source blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`; `git cat-file -t` confirmed it is a blob and `git show` confirmed the held `0.6.6` title.
- No Gate 1–5 or Gate 7 temporary artifact was edited, deleted, consumed, or repurposed.

### Repository method

The audit parsed live JSON rather than counting prose references. Items were classified by exact fields, roles, branches, subbranches, stages, profile links, recipe inputs/outputs, flora/fauna output relationships, ecology references, and starter-bundle contents. String-pattern counts were used only as overlapping discovery aids, never additive cardinalities. Runtime ownership was traced from item/profile content through player-engine application and UI inventory mutation. All matrix repository ids, keys, and paths are intended to be machine-verifiable against the starting tree.

External research used official nutrition/food-safety sources, peer-reviewed satiety evidence, and museum/university historical syntheses. It informs distinctions and candidate abstractions only. It does not turn real-world claims into Lineage canon. The companion [source index](tmp-rich-culinary-dietary-source-index-2026-07-19.md) records dates, limitations, and narrative use.

### Exact inventory highlights

| Measure | Count |
|---|---:|
| All items | 1,372 |
| Item classes | 1,114 commodity; 131 tool; 35 weapon; 26 consumable; 24 accessory; 18 armor; 14 clothing; 10 vehicle |
| Explicit `ingredient` role | 186 |
| Explicit `consumable` role | 144 |
| Both roles | 136 |
| Food/beverage branch or ingredient-role audit set | 190 |
| Items with `consumableProfileId` | 5 |
| Consumable profiles | 9 |
| Orphan profiles | 4 |
| Recipes | 28 |
| Food-adjacent recipes | 5: four direct cooking/baking/preserving plus one milling |
| Prepared-state foodish identities | 103 |
| Prepared-state foodish identities without a recipe producer | 99 |
| Raw consumable-role identities | 27 |
| Recipe outputs with no downstream recipe consumer | 16 overall; 3 culinary |
| Flora / fauna / monsters | 117 / 132 / 24 |
| Regional ecology profiles / starting bundles | 9 / 7 |
| Starting bundles containing one `ration_bundle` | 6; Traveler is the exception |
| Production chains / workplaces / services / extraction methods | 121 / 58 / 5 / 22 |

Ingredient-role branches are food 144, beverage 21, lighting 6, botanical 6, fungal 4, animal 3, and stationery 2. Consumable-role branches are food 116, beverage 15, alchemy 8, animal 2, stationery 2, and lighting 1. This confirms that roles are cross-domain capability metadata, not proof of human edibility.

The 144 consumable-role states are preserved 55, raw 27, food 11, prepared 8, compound 8, cask 8, milled 7, infusion 7, baked 5, ink 2, ingredient 2, egg 1, dairy 1, processed 1, and oil/wax 1. The two ink and one oil/wax “consumables” are concrete taxonomy defects, not culinary breadth.

## Authority Map

| Concern | Current owner | What it proves | What it does not prove |
|---|---|---|---|
| Item identity/taxonomy/value | `items.json` and market values | Key, name, class, branch, subbranch, roles, tags, stage, value | Edibility, safety, portion, recipe, cuisine |
| Biological source | `flora.json`, `fauna.json`, `monsters.json` | Authored harvest/slaughter/drop output relationship | Human edibility, toxicity, preparation safety |
| Regional opportunity | `regional_ecology_profiles.json` | Native sources, coverage, strengths, pressures, trade biases | Cuisine, taboo, feast, recipe, serving style |
| Recipe transformation | `recipes.json` | Exact integer inputs/outputs and explicit references | Runtime execution, nutrition propagation, spoilage |
| Macro production | production chains, workplaces, extraction methods | Descriptive stages/capabilities | Recipe inheritance or quantities |
| Nutrition input | `consumable_profiles.json` and schema | Six numeric body-state inputs plus use verb | Portion semantics, satiety, safety, diversity |
| Body-state effects | player engine `body-state.ts`/`.js` | Normalization, daily demand/deficit, consumable application | Inventory ownership, meal history, spoilage |
| Current consume inventory mutation | `characterPanelState.ts` | UI-side one-unit stack decrement and engine call | Engine-owned atomic consume command |
| Pack start placement | `starting_bundles.json` | Exact starter item quantities | Pack contents or aggregate nutrition |
| Hospitality vocabulary | `services.json` | Provider-independent service term | Menu, provider, transaction, meal execution |

## Domain 1 — Ingredient And Edibility Authority

Flora and fauna expose large numbers of culinary-looking ingredient keys, and every culinary-looking source output key found by this audit resolves to an item. That is strong reference closure, not edibility closure. The repository does not distinguish edible part, preparation-required part, toxic part, medicinal-only part, animal feed, industrial input, or culturally prohibited food.

The correct source chain is:

`biological identity → qualified harvest/slaughter part → canonical item → edibility/safety posture → preparation/recipe → direct serving profile`

Current data often has only the first three nodes. Common names alone are inadequate for real-species verification: Kew’s taxonomy method separates accepted names, synonyms, distribution, and cited uses, while FishBase similarly carries taxonomy, common names, ecology, and use information ([Kew/WCVP](https://powo.science.kew.org/about-wcvp), [FishBase manual](https://www.fishbase.se/manual/english/)). Fictional species still require project authorship.

Recommended relationship classes:

- `edible_raw` — explicit safe direct consumption in the stated part/state;
- `edible_after_cooking` — heat/preparation required;
- `edible_after_processing` — detoxification, soaking, leaching, fermenting, drying, or other explicit process required;
- `conditionally_edible` — life stage, part, season, freshness, or dose matters;
- `medicinal_or_reagent_only`;
- `animal_feed_only`;
- `industrial_only`;
- `toxic_or_hazardous`;
- `unknown` — fail closed.

No current identity should be auto-promoted from a culinary-looking key. Raw meat, fish, shellfish, eggs, milk, mushrooms, and unfamiliar plant parts especially require explicit safety authority. WHO’s safety framework treats clean handling, raw/cooked separation, cooking, temperature, and safe materials as distinct controls ([WHO Five Keys](https://www.who.int/publications/i/item/9789241594639)).

## Domain 2 — Food-State And Preparation Vocabulary

The catalog should add a state only when it changes safety, storage, value, quality, transport, recipe use, regional identity, or player choice. The recommended vocabulary is layered rather than a flat list:

| Layer | Candidate vocabulary | Rule |
|---|---|---|
| Source form | whole fruit, cluster, pod, root, bunch, harvest bundle, carcass, butchered cut, whole catch, shell-on catch, milk, egg | Identity only when form changes handling or consumers |
| Cleaned/raw | washed, trimmed, gutted, scaled, shelled, deboned, minced, curd, dough, must | Prefer recipe/intermediate states only with repeated consumers |
| Cooked | boiled, baked, roasted, griddled, fried, stewed | A finished dish should be named, not merely “cooked food” |
| Preserved | salted, brined, dried, hot-smoked, cold-smoked, smoke-dried, pickled, fermented, candied | Do not collapse these into one safety promise |
| Packed | wrapped portion, sealed jar, cask, crock, travel pack | Container scale and contents must be explicit |
| Condition | fresh, aging, stale, suspect, spoiled | Runtime only after time/storage ownership exists |

FAO/Codex distinguishes salting, drying, hot smoking, cold smoking, and smoke-drying and ties outcomes to hazards, moisture, heat, hygiene, packaging, and storage ([Codex fish code](https://www.fao.org/4/i2382e/i2382e.pdf)). Therefore `preserved` is a useful catalog group but an inadequate future safety state.

Avoid one item per trivial cut, cooking degree, temperature, or decay tick. Use relationships/tags for incidental states; use items for tradeable or reusable forms with repeated consumers.

## Domain 3 — Recipes And Culinary Topology

The live recipe graph is intentionally small. The five food-adjacent records are:

1. `recipe.grain_bundle_to_flour`;
2. `recipe.flour_to_bread_dough`;
3. `recipe.bread_dough_to_bread_loaf`;
4. `recipe.butchered_meat_to_smoked_meat`;
5. `recipe.fish_raw_and_salt_crystal_to_smoked_fish`.

All are `planned`, `standard`, explicit, and non-executing. Bread dough is the only culinary output consumed by another recipe. `bread_loaf`, `smoked_meat`, and `smoked_fish` are culinary output dead ends. Ninety-nine prepared-state foodish items lack any recipe producer; the machine matrix lists them exactly.

Production chains expose many plausible families—bread, flour, cheese, preserves, citrus marmalade, sausage, tavern/inn dishes, tea, wine, ale, fish, game, and crawfish—but cannot fill the gap automatically. Several chains omit biologically important inputs or point to misclassified outputs. For example, berry-preserve chain steps do not name berries, and sausage chains target `sausage_link`/`smoked_sausage_link`, which currently sit in stationery/ink. This is evidence for correction and later recipe authorship, not for importing chain quantities.

### High-readiness recommendation candidates

These are proposals only. Every integer below is `bounded_design_inference`, not historical/scientific fact, and every candidate remains blocked by the listed dependency.

| Candidate | Inputs | Outputs | Workplace / tools / skill | Chain reference | Evidence and unresolved dependency |
|---|---|---|---|---|---|
| Specific berry preserve | `blackberry_berry` ×2 ingredient; `preserve_base` ×1 ingredient; `clay_vessel` ×1 container | `blackberry_preserve_jar` ×1 primary | `workplace.preservers_hearth`; no current required tool; `skill.crafting.cooking` rank 1 | optional non-inheriting `chain.food.berry_preserves` | Existing source/item/output/workplace/skill close. Exact sugar/honey composition, safety process, vessel retention, and quantities need audit. Pattern may later substitute other accepted berry/output pairs. |
| Oyster hot-smoked provision | `oyster_meat` ×1 ingredient; `salt_crystal` ×1 ingredient | `oyster_smoked_shellfish` ×1 primary | `workplace.smokehouse`; no current required tool; `skill.crafting.cooking` rank 1 | optional non-inheriting `chain.food.preserved_fish` | Existing source/output and smokehouse pattern close. Must explicitly choose hot-smoked versus cold-smoked/smoke-dried and author safety/storage posture. |
| Milk to curd | `milk_raw` ×2 ingredient | `cheese_curd` ×1 primary | `workplace.kitchen`; no current required tool; `skill.crafting.cooking` rank 1 | optional non-inheriting `chain.food.fresh_cheese` | Current chain names the transformation. Coagulant/culture/acid, heat treatment, byproduct, and quantity authority are unresolved, so it is lower readiness than its reference closure suggests. |

Do not add tavern boards, inn meals, generic stews, or luxury pastries first. They require multiple named components, serving/plate identity decisions, and nutrition composition, while the source-to-preserved-food path is more auditable.

## Domain 4 — Nutrition And Satiety

### Current behavior

The schema requires `calories`, `protein`, `carbs`, and `fat`, and optionally accepts `hydration`, `intoxication`, and `useVerb`. Engine application scales those inputs through lineage metabolism/tag biases and updates daily consumption, quick/stored energy, hydration, intoxication, and resolved recovery. Daily rollover uses energy/protein coverage and deficit loads. There is no fullness, satiation, satiety duration, portion, fibre, food group, meal window, restriction, allergen, vitamin/mineral, or preparation-loss contract.

USDA FoodData Central demonstrates why portion and provenance matter: nutrient values are tied to identified foods, serving context, samples, and analytical metadata, not generic fantasy labels ([USDA FoodData Central](https://fdc.nal.usda.gov/help/)). EFSA’s reference-value program covers energy, water, macronutrients, fibre, vitamins, and minerals but also cautions that scientific reference values are not individual prescriptions ([EFSA](https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values)). The game should therefore model useful decision signals, not pretend to be a dietary calculator.

Satiety evidence supports multiple axes. Protein is generally more satiating than fat/carbohydrate in reviewed trials, but source and study results vary ([Bendtsen et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC3941822/)). Volume can affect satiety independently of energy ([Rolls et al.](https://pubmed.ncbi.nlm.nih.gov/9625090/)); energy density and portion size also act independently in meal context ([Williams et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC3874079/)). Texture/form matters in meta-analysis, while fibre effects are heterogeneous and often absent in acute studies ([Appleton et al.](https://pubmed.ncbi.nlm.nih.gov/33754456/), [Clark and Slavin](https://pubmed.ncbi.nlm.nih.gov/23885994/)).

### Candidate model A — Minimal profile extension

- Keep current nutrient fields.
- Add explicit `portionClass`: `sip`, `small`, `standard`, `large`.
- Add authored `fullnessUnits` and `fullnessDurationBand`: `brief`, `standard`, `long`.
- No nutrient-derived formula; content authors balance serving outcomes directly.
- Classification: `balance_placeholder` backed by external evidence that energy and fullness are not identical.
- Strength: smallest schema/runtime surface.
- Weakness: authors may assign inconsistent fullness without composition guidance.

### Candidate model B — Moderate portion and meal-balance model (recommended)

- Keep current nutrients and intoxication.
- Add explicit `portionClass`, `fullnessBase`, and `fullnessDurationBand`.
- Add coarse, authored contribution bands—not inferred from item names—for `proteinSupport`, `fibreSupport`, `waterVolumeSupport`, and `textureForm` (`liquid`, `soft`, `mixed`, `solid`).
- Optional `mealRoleTags`: `staple`, `protein`, `produce`, `fat`, `fermented`, `treat`, `drink`.
- Candidate balance equation: `fullnessDelta = clamp(fullnessBase + proteinSupport + fibreSupport + waterVolumeSupport + textureAdjustment, 0, cap)`. This is **bounded design inference and a balance placeholder**, not a scientific formula. Exact weights require a dedicated balance run.
- Use diversity only as a rolling meal-composition bonus/deficiency-warning input, never the FAO MDD-W five-of-ten threshold. FAO validates that threshold for a specific population indicator, not universal individuals ([FAO MDD-W](https://www.fao.org/nutrition/assessment/tools/minimum-dietary-diversity-women)).
- Strength: supports “hearty” composition and meaningful food form without micronutrient micromanagement.
- Weakness: new explicit fields and a possible short-lived fullness state require owner/save decisions.

### Candidate model C — Rich meal-window model

- Model named serving portions, fullness magnitude and decay, coarse food-group diversity, repeated-diet monotony, preparation quality, restriction compatibility, and recovery meal windows.
- Evaluate a meal as a composition rather than summing isolated items; keep luxury/value separate from nutrition.
- Classification: mixed `external_evidence` for qualitative factors plus `bounded_design_inference` for all game equations.
- Strength: strongest long-term cuisine and provisioning expression.
- Weakness: crosses profile schema, body state, inventory consumption, meal history, UI, save state, and balance. It is premature.

Model B is recommended as the research direction, but Model A may be the safer first contract if results review concludes that any persisted fullness state is too expensive. Do not infer satiety from existing free-form item tags; author it in the profile owner.

## Domain 5 — Dietary Patterns And Restrictions

Potential patterns include ordinary mixed diet, meat-limited/fasting diet, fish-permitted fast, vegetarian, dairy-free, alcohol-avoiding, species-specific taboo, lineage intolerance, institutional rule, scarcity diet, and medically constrained diet. None is current canon.

Restriction authority must be split:

- character/lineage physiology owns intolerances or metabolic constraints;
- religion/faction/institution lore owns observance rules;
- item/recipe content owns explicit ingredient/component tags;
- runtime owns compatibility evaluation only after both sides exist;
- UI owns disclosure, substitution, and warning presentation.

Historical evidence shows restrictions can reorganize whole ingredient networks—fish, pulses, nuts, vegetables, and substitutes—rather than act as a generic penalty ([Fitzwilliam Museum](https://feast-and-fast.fitzmuseum.cam.ac.uk/discover/to-eat-or-not)). This is inspiration, not permission to invent a Lineage religion.

Avoid hidden punitive mechanics, real-world allergy claims for fictional species, universal moral alignment, and hard class gates. The project remains classless unless a dedicated design pass says otherwise.

## Domain 6 — Regional Cuisine And Food Lore

The nine ecology profiles provide opportunity evidence, not cuisine canon. The following matrix intentionally uses `authored_input_required` language.

| Region | Existing opportunity | Candidate everyday pattern | Candidate preservation/hospitality identity | Evidence still needed |
|---|---|---|---|---|
| Kaelvar | grapes, wheat/barley, sheep/goat, salt, moderate sea food; grain reliability pressure | coarse grain bread, goat/sheep dairy, orchard/vine accompaniments | salted meat/fish, wine-house board | local names, olive source closure, class/season rules |
| Valtherion | surplus grain, cattle/sheep, river fish, apples/pears | bread/pottage, cheese, orchard fruit, modest meat/fish additions | bakehouse loaves, river-fish dishes, institutional feasts | settlement/class differences, grain species choices, feast canon |
| Serathyl | strong fisheries, citrus, vineyards, herbs, limited bulk grain | fish/shellfish with citrus/herbs; imported-grain staple | preserved seafood, citrus preserves, port hospitality | exact marine species, trade accessibility, named ports/institutions |
| Draemor | grain, beer, cattle, vegetables; limited prestige imports | grain-and-vegetable pottage, bread, dairy/beef accents | alehouse fare, winter preserves | vegetable identities, beer serving identity, rural/urban distinction |
| Talmyra | spices, tropical fruit, goats, shellfish; grain/cloth imports | fruit/spice-accented grain imports, goat foods, coastal shellfish | spiced preserves, market-house drinks | canonical spice/fruit sources, price/access, cultural authorship |
| Myridian Chain | fish, pearls, maritime services; grain/metal/timber pressure | fish-centered meals with imported staple | shipboard dried/salted provisions, harbor plates | storage/shipboard constraints, exact islands and trade routes |
| Lantern Isles | fish, citrus, spices, goat; grain/iron/draft pressure | citrus fish, goat dairy/meat, imported bread/grain | bright citrus preserves, fisher packs | avoid aesthetic-only canon; exact sources and settlement traditions |
| Serpent’s Wake | salt fish, strong maritime foods, scarce staples | salt-fish and imported grain, opportunistic shellfish | passage provisions and preserved-fish trade | water/safety conditions, local flora gaps, social ownership |
| Dawnreach Isles | cold fish, seal/rabbit, scarce staples | cold-water fish with imported grain; limited local animal food | dried/smoke-dried fish, cold-route packs | seal-use canon, conservation/ecology limits, fuel/storage infrastructure |

Historical evidence supports keeping everyday meals separate from exceptional feasts: Cambridge’s synthesis describes cereal-based ordinary diets and cautions that large food-rent lists were occasional events, not daily elite menus ([University of Cambridge](https://www.arch.cam.ac.uk/news/early-medieval-england-food-and-diet-explored-new-bioarchaeological-studies)). English Heritage likewise shows bread grades, fish-day demand, winter salting, spices, labor, and status interacting in one household ([English Heritage](https://www.english-heritage.org.uk/castles/life-in-a-castle/)). These sources guide dimensions, not regional facts.

## Domain 7 — Lore-Friendly Naming

### Naming rules

1. Name the food players perceive and trade, not an internal nutrient category.
2. Prefer source + preparation/form: `smoked trout`, `barley loaf`, `pickled onion`.
3. Add place only after regional authorship: `[Place] salt cod`, not a fabricated demonym.
4. Add maker/institution only when the producer exists: `[Inn] board`, `[Abbey] fast loaf`.
5. Add season/occasion when it changes availability or meaning: `winter pear preserve`, `harvest cake`.
6. Use quality words for observable quality: `coarse`, `fine`, `well-aged`, `spiced`; never encode raw stats in names.
7. Reserve `hearty` for a filling/complementary serving or pack, not a numeric tier.
8. Reserve `luxury` for rarity, origin, labor, prestige, variety, presentation, or packaging—not maximal calories.
9. Use container names at container scale: cask, jar, crock, bundle, wrapped portion. A cask is not one drink.
10. Avoid generic fantasy adjectives (`eldritch stew`, `royal ration`) unless lore authority names the source of that identity.

### Candidate matrices

| Identity type | Preferred structure | Good candidate style | Reject |
|---|---|---|---|
| Ingredient | source + part/form | `goat milk`, `oyster meat`, `blackberry` | `food ingredient`, invented edible plant part |
| Preserved food | process + source + container if relevant | `smoked trout`, `blackberry preserve jar` | `preserved food`, process-free safety promise |
| Dish | dominant source/form + technique | `barley-and-leek pottage` | `balanced meal`, `protein stew` |
| Pack | use/route + pack | `ferryman’s provision pack` after canon | `ration_bundle` as edible serving |
| Hospitality | institution/place + board/plate/course | `dockside fish plate` after canon | profile id used as item name |
| Luxury | origin/maker/season + crafted form | `spiced orchard conserve` after source closure | “luxury meal” defined only by stats |

## Domain 8 — Provision Packs

The durable packed-food decision is sound: a pack/container opens into named foods through a future atomic inventory command. The pack has no calories, protein, fullness, or consume verb. Contents carry those properties.

### Pack principles

- Every pack lists positive integer quantities of named item ids.
- No nested provision packs.
- Contents must fit a declared use duration and encumbrance/space posture before balance.
- Basic packs prioritize reliability and portability.
- Hearty packs cover several meal roles and higher fullness, not simply more calories.
- Luxury packs add variety, origin, rarity, quality, labor, prestige, or packaging.
- Regional packs require regional authorship and supply/trade closure.
- Opening is explicit; eating remains item-by-item or meal-composition behavior.

### Candidate compositions

These are composition examples, not approved content. `future:` marks a required identity that does not yet have accepted authority.

| Candidate pack | Explicit contents | Rationale / blockers |
|---|---|---|
| Basic road pack | `bread_loaf` ×1; `smoked_meat` ×1; `future:dried_orchard_fruit_portion` ×1 | Existing bread/meat topology plus one produce role. Needs dried-fruit identity, pack duration/weight, and profile authority. |
| Basic coastal pack | `bread_loaf` ×1; `smoked_fish` ×1; `future:dried_or_pickled_produce_portion` ×1 | Source substitution without generic nutrition. Needs regional supply and named produce. |
| Hearty worker pack | `bread_loaf` ×1; `smoked_meat` ×1; `fresh_cheese` ×1; `future:dried_fruit_portion` ×1 | Staple + protein/fat + produce variety. “Hearty” depends on accepted satiety/meal-role model. |
| Luxury hospitality hamper | `future:fine_spiced_loaf` ×1; `future:origin_named_cheese` ×1; `future:orchard_conserve_jar` ×1; `future:wrapped_sweet` ×2 | Luxury comes from craft, origin, variety, and packaging. All identities and producer/origin lore require authorship. |

The current `ration_bundle` appears in six of seven starting bundles, while the Traveler bundle contains none. That asymmetry may be deliberate or accidental; do not normalize it without a start-balance decision.

## Domain 9 — Food Safety, Storage, And Spoilage

The correct depth now is **static safety vocabulary and authored prerequisites only**. Runtime spoilage is not justified yet because there is no inventory-instance age, storage-context, contamination, time/temperature exposure, stack split/merge, warning, or save owner.

Future static safety dimensions may include:

- source risk: ordinary, perishable, conditionally edible, toxin risk, parasite risk, unknown;
- required preparation: clean, separate, cook, soak/leach, ferment, salt/dry/smoke, discard unsafe part;
- storage class: dry, cool, cold-chain, sealed, ventilated, brined, consume promptly;
- packaging integrity: open, wrapped, sealed, damaged;
- observable condition: fresh, aging, stale, suspect, spoiled.

WHO’s five-part framework shows that hygiene, separation, cooking, temperature, and raw materials are independent controls ([WHO](https://www.who.int/publications/i/item/9789241594639)). FDA guidance confirms that refrigeration slows rather than permanently prevents risk and that perishables require time/temperature context ([FDA](https://www.fda.gov/consumers/consumer-updates/are-you-storing-food-safely)). These modern limits should not be copied as exact medieval-fantasy timers. A future game abstraction should use a few transparent bands based on travel/storage decisions.

Reject invisible random poisoning, per-stack microbial simulation, copied household refrigerator tables, universal shelf-life numbers, and automatic “smoked = safe forever.”

## Domain 10 — Economy, Services, And Gameplay Ownership

Food richness can use existing value, ecology, production, workplace, service, inventory, body-state, and regional structures, but each has a narrow role:

- source relationships belong to flora/fauna/monster and item authority;
- tradeable state/value belongs to items and market-value authority;
- explicit transformations belong to recipes;
- production chains/workplaces describe macro topology/capability only;
- future portion/nutrition/satiety belongs to consumable profiles plus engine application;
- provision contents belong to a new static pack owner;
- opening packs belongs to an engine-owned inventory command;
- regional cuisine belongs to regional lore/content authorship;
- hospitality menus and purchases need a future provider/service/economy owner;
- spoilage needs inventory-instance time/storage plus save/UI ownership.

The current consume flow is split: `characterPanelState.ts` decrements one inventory unit, then calls engine-owned `applyConsumableToBodyState`. This is adequate characterization evidence but not a pattern to expand. Pack opening or richer consumption must enter the runtime ownership transition deliberately.

The five service records are provider-independent vocabulary. Only lodging intersects food via room-and-board language; no menu, transaction, or meal execution exists. Do not turn service prose into items or effects.

## Underused Ingredients And Topology

The 99 prepared-state items without recipe producers are the central authoring opportunity, but not a 99-recipe mandate. They include flour variants, casks/infusions, preserves, shellfish products, bakery items, sausage products, stews/boards, byproducts, and cross-domain false positives. Candidate selection should prioritize:

1. facts/collisions that make existing chains wrong;
2. source-qualified inputs with explicit item closure;
3. outputs with repeated pack, hospitality, trade, or body-state consumers;
4. a small number of intermediate states reused across recipes;
5. regional substitutions only after cuisine authorship.

Low-value topology includes single-use garnish records, every species/cut combination, every cooking degree, duplicate generic/specific foods without substitution rules, and outputs whose only consumer would be a newly invented recipe.

## Profile Mismatches And Taxonomy Collisions

### Item-to-profile links

| Item | Current profile | Finding |
|---|---|---|
| `bread_loaf` | `consume.bread_loaf` | Coherent direct-serving link. Preserve. |
| `breast_cut` | `consume.game_stew` | Raw/cut identity mapped to a finished stew profile. |
| `candied_peel` | `consume.inn_hearty_meal` | Small sweet ingredient mapped to a complete meal. |
| `crusty_sausage_roll` | `consume.traveler_ration` | Named baked item mapped to generic ration semantics. |
| `ale_cask` | `consume.ale_cask` | Name matches, but the item is a cask/container scale while runtime consumes one inventory unit as one drink/effect. |

Orphan profiles are `consume.ration_bundle`, `consume.trail_meal`, `consume.seafood_stew`, and `consume.tavern_fish_plate`. Their existence is not authority to create or relink items. They need named-item reconciliation or an explicit retirement decision.

### Taxonomy/name collisions

- `sausage_coil` is `itemBranch: lighting`, `itemSubBranch: oil_wax`, while its food name and roles include ingredient/consumable.
- `sausage_link` and `smoked_sausage_link` are `itemBranch: stationery`, `itemSubBranch: ink`; production chains target them as food outputs.
- `sheep_milk` and `wild_turkey_egg` are consumable/ingredient records under `animal`; this may be intentional source taxonomy, so it requires review rather than automatic correction.
- `herbal_bath` is an alchemy consumable, demonstrating why item class/role alone cannot mean “eat/drink.”
- `bark`, `resin`, `beeswax`, `lanolin`, `tallow`, fungal reagents, and stationery/lighting collisions demonstrate why `ingredient` is cross-domain metadata.

## Owner And Dependency Matrix

| Proposed capability | Exact owner needed | Prerequisites | Failure if skipped |
|---|---|---|---|
| Correct food taxonomy/profile links | item/profile content + validator | results audit and exact correction decision | bad consume effects; wrong chain targets |
| Edibility | source/item relationship owner | part/state/safety authorship | food names treated as safe facts |
| Named preserved foods | item/source/value authority | repeated consumers and collision review | catalog noise and unsafe implication |
| Culinary recipes | recipe authority | all refs, integer quantities, safety posture | chain inference leakage |
| Nutrition/satiety | profile schema + balance + player engine | accepted model and portion semantics | false precision and balance drift |
| Dietary restriction | lineage/character + institution/religion + recipe composition | explicit canon and disclosure rules | hidden punitive or invented lore |
| Pack contents | new static provision-bundle owner | named items and profile closure | aggregate edible bundles |
| Open pack | player-engine inventory command | pack schema, atomic capacity behavior | duplication/loss and UI authority expansion |
| Regional cuisine | region/lore content | ecology/trade evidence plus authorship | opportunity mistaken for canon |
| Hospitality menu/effect | provider/service/economy owner | provider, menu, price, meal identity | prose drives runtime |
| Spoilage | inventory-instance time/storage + save/UI | justified repeated gameplay decision | micromanagement and migration blast radius |

## Candidate Implementation Packages

The machine matrix records all nine packages with owner, files, validation, risk, rollback, label class, and relation to `0.6.6`.

| Order | Package | Label-class recommendation | Route posture |
|---:|---|---|---|
| 1 | Food-Named Taxonomy And Consumable Profile Link Integrity | Four-segment support run attached to nearest accepted body-state/content authority after results audit | **Selected first**; independent of `0.6.6` |
| 2 | Generic Ration And Profile Reconciliation | Three-segment primary capability | Independent; do not reorder route without review |
| 3 | Named Preserved Food And Ingredient Foundation | Three-segment primary capability | Review fauna/monster overlap before sequencing against `0.6.6` |
| 4 | Bounded Culinary Recipe Expansion | Three-segment primary capability | Independent after shared-content collision review |
| 5 | Nutrition And Satiety Authority | Three-segment primary capability | High risk; wait behind static corrections |
| 6 | Provision Bundle Profile Schema And Validation | Three-segment primary capability | Independent |
| 7 | Engine-Owned Open-Pack Inventory Command | Three-segment primary capability | Re-evaluate within runtime transition sequence |
| 8 | Regional Cuisine And Food Lore | Three-segment primary capability | Ecology overlap review required |
| 9 | Storage, Spoilage, And Food-Safety Runtime | Defer; later primary capability only if justified | Independent and far later than `0.6.6` |

Package 1 should correct exactly the three proven sausage branch/subbranch errors and four bad profile links, preserve `bread_loaf`, and add focused guards. The results audit must decide exact replacements/removals; this report intentionally does not prescribe edits or assign a version number.

## Rejected Complexity

- Micronutrient-by-micronutrient simulation, deficiency diseases, or modern dietary targets.
- A scientific-looking satiety equation derived from calories alone.
- Universal strong fibre bonuses despite heterogeneous evidence.
- Per-bite, per-temperature, per-microbe, or per-decay-tick inventory state.
- Automatic edibility from species name, output key, `ingredient`, or `consumable`.
- Generic tag-driven recipe execution or production-chain inheritance.
- One item for every cut, doneness, garnish, species substitution, or spoilage stage.
- Aggregate pack nutrition or direct consumption of casks/bundles.
- Luxury defined as highest calories/fullness.
- Regional cuisine inferred directly from biome/native-source lists.
- Real-world religion, taboo, allergy, or diet imported into setting canon.
- Backward compatibility, migrations, aliases, or old-save preservation unless later explicitly requested.

## Uncertainties And Questions For Results Review

1. Should the four bad profile links be removed first, or are exact direct-serving replacement items already intended?
2. What are the intended branch/subbranch values for `sausage_coil`, `sausage_link`, and `smoked_sausage_link`, and are all three distinct foods?
3. Should casks remain trade/container items only, with serving items introduced later?
4. Which orphan profiles should be retained for future named items versus retired?
5. Is the Traveler’s lack of `ration_bundle` intentional?
6. Which flora/fauna parts are canonically edible, preparation-required, toxic, medicinal-only, feed-only, or industrial?
7. Does results review prefer Model A’s authored fullness simplicity or Model B’s coarse composition axes?
8. Can fullness be transient/derived, or must any duration require a new persisted body-state field?
9. Which regional opportunities are ready for canon authorship, and which must remain economic implications?
10. Is there a repeated gameplay decision that justifies spoilage at all before inventory-instance ownership matures?

## Research Conclusion

The repository does not need a broad food-content dump. It needs factual correction, explicit source/edibility relationships, a small recipe graph with closed consumers, and a deliberately abstract nutrition/satiety contract. The next required run is the unversioned **Rich Culinary And Dietary Research Results Audit**. That audit should accept, narrow, reject, or reorder these findings, then authorize at most the smallest coherent first implementation package. It should not install an implementation prompt during this research run, and paused `0.6.6` remains preserved.
