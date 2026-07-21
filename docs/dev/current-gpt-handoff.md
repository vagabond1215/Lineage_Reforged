# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- Original culinary research completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`.
- The first culinary results repair completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5` and remains accepted documentation input.
- The unversioned culinary preparation/portion/meal integration audit completed at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`.
- The bounded integration-results repair completed at commit `b92b1344613669114641230a2e67f8ed77e7ae00`.
- GPT/human inspection accepts that repair's percentage, quantity, ration, food-state, preparation-method, container, multi-serving, mystery-assortment, stock-window, contextual-quality, historical-source, and cross-domain direction.
- The repaired artifacts still require one final four-file documentation repair for command ownership, generic item-instance dependencies, selected-package prerequisites, canonical kilocalorie ownership, metadata, and contextual action surfaces.
- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md` is the newest controlling focused authority.
- The active prompt is `Culinary Integration Final Contract And Action-Surface Repair Audit` in `docs/dev/current-codex-prompt.md`.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and recoverable from its held prompt and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Controlling Action-Surface Direction

### General posture

- Prefer contextual item-, entity-, workplace-, and location-driven actions over permanent global food, crafting, trade, or character-action menus.
- The UI surface that exposes an action is not automatically the engine owner that executes it.
- Show only actions valid in the current situation, plus selectively useful unavailable actions with concise reasons.
- Avoid duplicating the same operation across Food, Inventory, Crafting, Party, Shop, and Location menus.
- A filtered ready-food inventory view may later exist as convenience, but it is not a second command owner.

### Inventory and item actions

Selecting a physical item may expose valid actions such as:

- Eat or Drink;
- Open or Close;
- Inspect;
- Split, Combine, Pour, or Transfer;
- Store, Take Out, or Drop;
- Label;
- an eligible hand-crafting verb.

Generic item-instance commands own:

- open/close and seal/unseal;
- split/combine compatible lots;
- pour/transfer between owned or permitted containers;
- move/store/take out/drop;
- custom labels;
- inspection of lawfully held or accessible goods.

They do not own nutrition, recipes, sales, or manifest generation.

### Food consumption

- Ready-to-eat items expose Eat, Drink, or another authored consumption verb from the selected item.
- The food-consumption resolver owns amount selection, whole-only validation, inventory decrement/remainder, nutrition, satiety, food risk, dietary exposure, and morale effects.
- There is no required permanent top-level Food menu.
- `Prepare`, `Cook`, `Preserve`, `Smoke`, `Dry`, `Pickle`, `Ferment`, `Bake`, `Boil`, `Fry`, `Steam`, and similar transformations are crafting/process actions, not permanent food-menu buttons.

### Give, trade, and barter

- Do not place universal Give, Trade, Buy, Sell, or Barter buttons in the ordinary item menu.
- Giving or offering an item/serving starts from a party-member or NPC interaction, then selects the item and amount.
- Buying, selling, and bartering start from a merchant, storefront, market, or NPC transaction context.
- Inventory may provide the item picker, but it does not execute the social or commercial transaction.

### Hand crafting

- Selecting a material, ingredient, component, or suitable tool may expose Craft, Shape, Prepare, Assemble, or another relevant verb when known recipes/processes use it.
- The recipe view may toggle between all known recipes using the selected item and only recipes whose full material/tool/access requirements are currently satisfied.
- Selecting one item does not imply it is the only ingredient.
- The crafting resolver owns knowledge, inputs, tools, time, skill, success/failure, outputs, and inventory mutation.

### Workplace crafting

- Fixed-station crafting appears from an accessible workplace, station, furnishing, location, selected recipe, or appropriate portable apparatus.
- Cooking and preservation require compatible stations, tools, fuel, access, and permission where applicable.
- Presence at a workplace does not prove authority, vacancy, reservation, fuel, staffing, ownership, or permission.
- The future `crafting.food_process_methods` registry owns reusable culinary method identities.

### Multi-serving food preparation

- The selected serving vessels determine output count.
- Uniform Servings is the default; Individual Servings allows per-vessel differences.
- Source allocations cannot exceed available physical amounts.
- Prepared servings may be consumed, stored, placed, or given through a separate party/NPC interaction.

### Location and storefront flow

Accepted documentation-only direction:

1. Select a known building through a district, coordinate, map, or known-building directory.
2. Resolve local travel by distance and ticks through the travel owner.
3. Contextual events may later interrupt travel.
4. Enter automatically when travel resolves and the destination is open and enterable.
5. Present a short entity-aware contextual arrival narrative that does not invent absent facts.
6. Expose a compact first-level location menu such as Browse Goods, Talk to an NPC, Look Around, and Exit.
7. Look Around may reveal selectable people, furniture, displays, counters, cabinets, desks, goods, and exits.
8. Browse Goods presents observable direct lots and persisted mystery assortments.
9. Talk to a merchant may expose Buy, Sell, Barter, Converse, Request Service/Inspection, or Leave where valid.

No location, travel, event, narrative, storefront, NPC, or UI implementation is authorized.

## Command Ownership Matrix

| Player-facing action | Invocation surface | Execution owner direction |
| --- | --- | --- |
| Eat / Drink | Selected inventory item | Food-consumption command |
| Open / Close / Seal | Selected item/container | Generic item-instance command |
| Split / Combine / Pour / owned transfer | Selected item/container | Generic inventory/item-instance command |
| Inspect held item | Selected accessible item | Generic item observation/inspection command |
| Apply custom label | Selected item/container | Generic item-instance labeling command |
| Hand Craft / Shape / Prepare | Selected material, ingredient, or portable apparatus | Crafting/process command |
| Workplace Craft / Cook / Preserve | Accessible station, workplace, or recipe | Crafting/process command using workplace authority |
| Give / Offer | Party-member or NPC interaction | Character interaction plus inventory transfer |
| Browse Goods | Storefront or seller interaction | Market stock presentation |
| Buy / Sell / Barter | Merchant transaction | Economy/market transaction command |
| Inspect seller goods | Merchant interaction after permission | Transaction permission invoking generic inspection |
| Travel to building | District/map/directory context | Travel/activity command |
| Enter / Exit / Look Around | Current location | Location/activity command |

## Required Final Repair

The active Codex run may modify only:

- `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`;
- `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`;
- `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`;
- `docs/dev/current-codex-output.md`.

It must repair:

1. duplicate Open/Transfer/Inspect command ownership;
2. static-food dependency in generic item-instance truth;
3. stale `OD-01 through OD-06` prerequisite language;
4. canonical kilocalorie and nutrition-owner ambiguity;
5. original versus repair metadata;
6. contextual inventory, crafting, workplace, location, NPC, and storefront invocation surfaces.

### Generic instance dependency

- Generic item-instance truth depends on shared quantity and generic container/item-instance foundations.
- It must not depend on static food profiles.
- Food, textiles, leather, wood, metal, seeds, apothecary goods, merchant stock, and mystery assortments consume the same generic instance truth.

### Nutrition ownership

- Canonical authored nutritional energy is kilocalories unless a later durable decision accepts an exact conversion contract.
- Legacy `dailyCalories: 100` is compatibility-only.
- Static profiles own per-basis kcal/macros and later accepted static satiety parameters.
- Meal resolver owns aggregation.
- Dietary exposure state owns monotony/variety history.
- Body state owns intake and physiological effects.
- Difficulty owns feature switches and scalars.

### Explicit open-decision prerequisites

The selected contract-acceptance decision should explicitly depend on:

- OD-01;
- OD-03;
- OD-05;
- OD-06;
- OD-07.

OD-04 belongs there only if that decision intentionally accepts transient versus packaged ad hoc meal persistence.

## Culinary Decisions To Preserve

- Food state is orthogonal: readiness, preparation method, preservation effect, hazard, and authored display name.
- Smoking may cook and preserve; drying may preserve without cooking.
- Names remain authored and are never parsed for mechanics.
- Physical dimensions are count, mass, and volume.
- Serving is an authored culinary reference.
- Percentages are source allocation or derived composition, not calorie points.
- Nutrition derives from physical amount and per-basis values.
- Provisional game-design anchors remain about 2,500 kcal/day for an ordinary active adult and 3,500-4,000 kcal/day for sustained high-intensity labor.
- Accepted ration names are Small, Medium, Large, Party, and Large Party Ration.
- Party rations are short-duration multi-serving assortments; provisions are sustained multi-container logistics.
- Mystery manifests resolve before opening and never reroll.
- Direct known lots coexist with mystery assortments.
- Clearance/standard/select candidate tier weights, contextual quality, finite stock windows, honest-clearance/fraud separation, and cross-domain assortment reuse remain accepted directions.
- Container examples remain non-exhaustive and custom labels never replace true identity.
- Three-segment labels are primaries; support uses a fourth segment and an exact parent.

## Route Guardrails

- The active run is unversioned and documentation-only.
- No implementation number is assigned.
- No item, recipe, ration, provision, assortment, producer, profession, store, NPC, building, event, container, stock, starting bundle, schema, validator, test, runtime, command, inventory, UI, save, economy, travel, narrative, Knowledge, reputation, merchant, difficulty, dependency, asset, or gameplay change is authorized.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- Held `0.6.6` remains recoverable and must not be restored or modified.
- After the final repair, stop for GPT/human inspection before creating the durable contract-acceptance decision or any implementation prompt.
