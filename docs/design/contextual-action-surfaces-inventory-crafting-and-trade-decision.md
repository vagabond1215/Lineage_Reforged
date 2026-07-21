# Contextual Action Surfaces, Inventory, Crafting, And Trade Decision

Date: 2026-07-21

Status: accepted documentation-only cross-domain design authority; no schema, validator, runtime, UI, save, content, economy, balance, or gameplay implementation permission

Run classification: unversioned focused action-surface and ownership decision

Milestone impact: `supports_current_band`

## 1. Purpose And Precedence

This decision records the accepted player-facing direction for item use, food consumption, preparation, crafting, containers, workplaces, location entry, storefront browsing, NPC interaction, and trade actions.

It supplements:

- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/crafting-authority-boundary-decision.md`;
- `docs/design/recipe-and-production-schema-decision.md`;
- `docs/design/economy-authority-boundary-decision.md`;
- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
- `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
- `docs/design/artisan-mystery-assortment-stock-and-quality-decision.md`;
- `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
- `docs/design/player-travel-boundary-clarification.md`.

Where this decision is more specific, it controls the player-facing surface from which an action is requested. It does not transfer the underlying simulation authority to the UI surface.

## 2. Accepted Direction

Adopt a contextual item-, entity-, workplace-, and location-driven action model rather than a permanent global food or crafting command menu.

The preferred direction is closest to the previously discussed Option 3, with one important distinction:

- the interface surface that exposes an action is contextual;
- the engine owner that validates and executes the action remains domain-specific.

Selecting an item in inventory may expose `Eat`, `Drink`, `Open`, `Inspect`, `Drop`, `Store`, `Split`, `Pour`, `Label`, `Craft`, or another valid action. This does not make inventory the owner of nutrition, crafting, inspection evidence, or container physics. Inventory is the selection and presentation surface; the appropriate engine command owns execution.

Do not create a permanent top-level `Food` menu that redundantly exposes Eat, Cook, Prepare, Preserve, Inspect, Trade, Give, and container commands regardless of current context.

A filtered food inventory view may later exist as a convenience surface, but it must not become a second command owner or bypass ordinary item, crafting, workplace, character-interaction, and transaction rules.

## 3. Contextual Action Resolver

The future UI should request a context-sensitive action list from authoritative state rather than showing every theoretically possible command.

Candidate eligibility inputs include:

- selected entity or item instance;
- item identity, profile references, remaining amount, condition, opened/sealed state, and observed knowledge;
- current holder, ownership, access, and permissions;
- current location, workplace, furniture, tools, fuel, containers, and environmental resources;
- known recipes, skills, Knowledge, trials, and other accepted prerequisites;
- nearby NPCs or party members and the current interaction context;
- whether the player is traveling, interrupted, in combat, trespassing, restrained, overloaded, or otherwise unable to act;
- difficulty and accessibility settings where relevant.

Only valid or meaningfully explainable unavailable actions should appear. The default posture is to omit impossible actions rather than clutter the interface with disabled buttons.

Where showing an unavailable action teaches the player something useful, it may appear with a concise reason such as `Requires a knife`, `Requires permission to use this kitchen`, or `No known recipes use this item`. This is a presentation choice, not permission to leak hidden information.

## 4. Inventory And Item Actions

Selecting a physical item instance in inventory is the ordinary surface for actions concerning that item.

Candidate generic item actions include, where valid:

- inspect;
- open or close;
- seal or unseal;
- split or combine compatible lots;
- pour, transfer, or decant between owned or permitted containers;
- take out, put away, store, or move;
- drop;
- equip, unequip, wear, wield, or ready where supported;
- rename through a custom label or mark where supported;
- consume through `Eat`, `Drink`, or another item-appropriate verb;
- initiate eligible hand crafting from the selected material or component.

The list is illustrative and non-exhaustive.

### 4.1 Generic item-instance command owner

A generic item/inventory instance command family should own operations whose meaning is not culinary or commercial:

- open and close;
- seal and unseal;
- split and combine compatible lots;
- pour or transfer between permitted containers;
- move, store, take out, and drop;
- apply or remove a custom label;
- inspect an item the character lawfully holds or can access, producing only contextually available observations.

This generic owner operates against item-instance truth, container capabilities, permissions, and character-relative observations. It must not generate merchant stock, resolve a sale, calculate nutrition, execute a recipe, or reroll a hidden manifest.

### 4.2 Food consumption from inventory

A ready-to-eat item exposes `Eat`, `Drink`, or another authored consumption verb when the character can reasonably consume it.

The inventory surface invokes the food-consumption resolver, which owns:

- amount selection where the item is portionable;
- whole-only validation;
- exact inventory decrement or remainder;
- aggregated nutrient and satiety application;
- food-safety and character-knowledge consequences;
- dietary exposure and morale effects where enabled.

The item context menu does not calculate those results itself.

There is no need for a separate top-level food menu merely to list directly consumable items. A convenience filter may show ready foods, but selection still resolves through the item instance.

### 4.3 Give and trade are not generic item buttons

Do not place universal `Give`, `Trade`, `Buy`, `Sell`, or `Barter` actions in the ordinary item menu.

Giving an item or prepared serving is initiated from a party-member or NPC interaction context. The interaction selects the recipient and then the offered item or amount.

Buying, selling, and bartering are initiated through a storefront, merchant, market, or NPC transaction context. The transaction may subsequently open an inventory picker, but inventory is not the transaction owner.

## 5. Crafting And Preparation Surfaces

Crafting is exposed from the physical source of the activity rather than through one mandatory universal crafting menu.

Two major surfaces are accepted.

### 5.1 Hand crafting from selected items or nearby materials

When a selected inventory item or accessible environmental material can participate in one or more known hand-crafting recipes, its context actions may expose `Craft`, `Shape`, `Prepare`, `Assemble`, or another recipe-family-appropriate verb.

Example:

- select a suitable stone;
- choose `Craft`;
- view known recipes that use that stone as an input, such as a stone arrowhead where repository authority later supports it.

The recipe list may offer a toggle:

- show all known recipes using the selected item;
- show only recipes for which all required materials, tools, access, and conditions are currently satisfied.

Selecting one ingredient does not imply that it is the sole input. The resolver gathers the remaining required item instances, tools, and environmental materials through an explicit selection step.

Hand crafting remains recipe- and command-owned. The item menu is only its invocation surface.

### 5.2 Workplace and location crafting

Fixed-station crafting appears through the current location, workplace, furniture, or facility context.

A cooking action should become available only when the character has access to an appropriate kitchen, hearth, campfire, fireplace, oven, smokehouse, drying area, worktable, or other accepted station and satisfies required permissions, availability, tools, fuel, and recipe prerequisites.

The same rule applies across trades:

- forge and anvil work appears at an accessible smithing workplace;
- loom work appears at a suitable textile workplace;
- tanning appears at an appropriate facility;
- alchemy appears at a supported alchemical station;
- food cooking, preparation, and preservation appear at compatible stations or through hand processes where the recipe explicitly permits them.

A workplace action surface may list only the recipes currently relevant to that station. It may also permit filtering by known recipes, available ingredients, output family, time, or other accepted criteria.

Do not treat workplace presence as automatic permission. Access may depend on ownership, employment, rental, invitation, institutional authority, trespass, schedule, occupation, reservation, or another accepted social/economy rule.

### 5.3 Culinary actions under crafting ownership

`Prepare`, `Cook`, `Preserve`, `Smoke`, `Dry`, `Pickle`, `Ferment`, `Bake`, `Boil`, `Fry`, `Steam`, and similar transformations are crafting/process actions, not permanent global food-menu buttons.

They may surface through:

- a selected ingredient or material when the process is hand-permitted;
- a selected tool or portable apparatus;
- an accessible workplace or station;
- an already selected recipe or work order.

The future `crafting.food_process_methods` registry owns reusable method identities. Recipes and process commands own transformations and execution. Item food-state profiles own the resulting readiness, preservation, and hazard outcomes.

## 6. Prepared Meals And Multiple Servings

The accepted multi-serving preparation model remains unchanged, but it is invoked through an eligible crafting/preparation context rather than a universal food menu.

The number of selected compatible serving vessels determines the number of prepared servings. Uniform and individual allocations remain available.

After preparation, servings may be:

- consumed by the preparer;
- stored in supported containers;
- selected from a party or NPC interaction and given to another character;
- placed in an accessible shared location;
- used by another accepted command.

The preparation command creates the servings. A party/NPC interaction command transfers a serving to its recipient. These are distinct operations.

## 7. Storefront And Merchant Interaction

Trade begins from a location and counterparty context, not from a global character-action or food menu.

A player may navigate through a known district, coordinate, map, or directory of known buildings and select a destination such as a bakery. Travel to that destination resolves through the accepted travel owner using distance and ticks.

During local travel, the system may later support contextual interruptions such as:

- attempted theft or pickpocketing;
- finding coins or goods;
- overheard information;
- quest or encounter initiation;
- obstruction, closure, weather, or civic events.

Prestige or incremental unlocks may later modify local travel speed or tick cost only through an accepted progression/travel decision.

If travel resolves without interruption and the location is open and enterable, the character may automatically enter.

### 7.1 Arrival presentation

On entry, present a short entity-aware contextual narrative assembled from authored location, time, condition, occupants, activity, stock posture, and relationship facts. It should not repeat one invariant paragraph on every visit.

The arrival presentation may include general NPC greetings or actions directed toward the character when contextually appropriate.

Narrative variation must not invent entities, stock, relationships, or events that are absent from authoritative state.

### 7.2 Default location actions

A shop or comparable interior may initially expose a compact action set such as:

- `Browse Goods`;
- `Talk to [NPC]`;
- `Look Around`;
- `Exit`.

Only contextually valid actions appear.

`Look Around` may provide a more detailed account of visible characters, displays, furniture, counters, cabinets, desks, goods, exits, and other points of interaction. It may then reveal selectable entities and their own contextual actions without placing every possible interaction in the initial menu.

### 7.3 Browse goods

`Browse Goods`, `Browse Wares`, `Browse Equipment`, or another venue-appropriate label opens the seller's currently observable stock presentation.

This is where exact direct lots and constrained mystery assortments may appear, including known goods such as a dozen muffins and producer assortments such as a Baker's Basket.

Browsing does not transfer ownership. The seller's claim, listed identity, observed sample, price quote, stock instance, and true manifest remain separate authorities.

### 7.4 Talk, buy, sell, and barter

Selecting `Talk to [shop NPC]` may expose contextually available options such as:

- buy with currency;
- sell for currency;
- barter with items, currency, or both;
- converse;
- request services or inspection where supported;
- leave the interaction.

The exact vocabulary may vary by venue and relationship.

The market/transaction owner validates seller availability, permissions, accepted goods, stock, prices, funds, barter terms, reputation, fraud, inspection, and ownership transfer.

The inventory UI may be used to select what the player offers or receives, but it must not execute the transaction independently.

## 8. Inspection Boundaries

Inspection has two related but distinct contexts.

### 8.1 Held or owned-item inspection

Selecting an accessible item may expose `Inspect`. The generic item/observation command determines what the character can learn through ordinary visual or permitted physical examination.

The result depends on item capabilities, access, current observations, character skill and Knowledge, condition, concealment, and whether deeper or destructive examination is attempted.

### 8.2 Transactional inspection

Inspecting goods controlled by a seller is part of the merchant interaction. The buyer may request a sample, deeper view, opening, weighing, smelling, tasting, seal/document review, or another contextually valid examination.

The transaction context owns permission, refusal, deposits, offense, trust, timing, and whether the seller allows destructive access. The underlying item inspection resolver may be reused once access is granted.

This avoids duplicate `Inspect` implementations while preserving the social and commercial consequences of inspecting another person's property.

## 9. Command Ownership Matrix

| Player-facing action | Invocation surface | Execution owner direction |
| --- | --- | --- |
| Eat / Drink | Selected inventory item or ready-food filter | Player food-consumption command |
| Open / Close / Seal | Selected item or container | Generic item-instance command |
| Split / Combine / Pour / Transfer between owned containers | Selected item/container | Generic inventory/item-instance command |
| Inspect held item | Selected accessible item | Generic item observation/inspection command |
| Apply custom label | Selected accessible container/item | Generic item-instance labeling command |
| Hand Craft / Shape / Prepare | Selected material, ingredient, tool, or portable apparatus | Player crafting/process command |
| Workplace Craft / Cook / Preserve | Selected accessible workplace, station, or recipe | Player crafting/process command using workplace authority |
| Give / Offer | Selected party member or NPC interaction | Character/party interaction plus inventory transfer command |
| Browse goods | Entered storefront or seller interaction | Market stock presentation |
| Buy / Sell / Barter | Merchant or storefront transaction | Economy/market transaction command |
| Inspect seller goods | Merchant transaction after permission | Transaction permission layer invoking generic item inspection |
| Travel to building | District, coordinate, map, or known-building directory | Travel/activity command |
| Enter / Exit / Look Around | Current location context | Location/activity command |

No package should claim all of these commands merely because it provides one menu surface.

## 10. Package And Dependency Corrections

The active culinary integration repair must apply these consequences:

1. Remove `Open`, generic `Transfer`, and generic `Inspect` from a food-actions package.
2. Remove generic `Open` and owned-item `Transfer` from an assortment-transaction package.
3. Keep food actions focused on Eat/Drink consumption and meal/process outcomes where applicable.
4. Keep generic item-instance commands responsible for open/close, owned-container transfers, split/combine, labeling, and held-item inspection.
5. Keep market commands responsible for Browse, Buy, Sell, Barter, seller-controlled inspection permission, and transaction ownership transfer.
6. Permit market inspection to invoke the generic item observation resolver after access is granted.
7. Keep crafting commands responsible for hand crafting, preparation, cooking, and preservation transformations.
8. Make generic item-instance truth independent of static food profiles. It may depend on shared quantity and generic container/item-instance contracts. Food, textiles, wood, metal, seeds, apothecary goods, and mystery assortments consume the same generic instance truth.
9. Keep canonical authored nutritional energy in kilocalories or an explicit accepted conversion contract. Treat legacy `dailyCalories: 100` as a compatibility concern, not canonical food truth.
10. Separate static nutrient values, meal aggregation, dietary exposure, body-state effects, and difficulty controls into their correct owners.

## 11. Simplicity And Action Clutter Rules

Player actions should remain simple and physically grounded.

- Show actions relevant to the selected thing and current situation.
- Prefer a small first-level action set and reveal detailed interactions after the player selects a person, item, workstation, furnishing, or point of interest.
- Do not repeat the same operation in global Food, Crafting, Inventory, Party, and Shop menus.
- Do not expose trade without an available counterparty or market context.
- Do not expose fixed-station crafting without the required station and access.
- Do not expose consumption for food that is not ready as presented.
- Do not expose opening for a non-container or an inaccessible sealed object.
- Do not expose hidden recipe outputs merely because an unknown item technically participates in them.
- Do not make UI visibility proof that execution will succeed; the engine resolver remains authoritative.

## 12. Non-Goals

This decision does not implement or authorize:

- a new UI, menu, inventory screen, food screen, crafting screen, shop screen, map, directory, or narrative generator;
- item, food, recipe, workplace, store, NPC, building, district, event, assortment, stock, or container content;
- schemas, validators, tests, loaders, commands, runtime, save, migration, or balance;
- exact local-travel tick costs, encounter chances, prestige speed bonuses, opening hours, shop schedules, prices, or stock quantities;
- a universal action registry detached from owner-specific commands;
- automatic permission to use another character's workplace, tools, property, goods, or containers.

## 13. Route Consequence

The completed culinary integration repair at commit `b92b1344613669114641230a2e67f8ed77e7ae00` requires one final bounded documentation repair before durable promotion.

That repair should modify only the same four temporary/output artifacts and should correct:

- duplicate command ownership;
- food-profile coupling in the generic item-instance package;
- stale selected-package prerequisites;
- canonical kilocalorie and nutrition-owner wording;
- repair metadata;
- contextual item, crafting, workplace, location, and merchant invocation surfaces.

After that repair, stop for GPT/human inspection. No implementation prompt or primary version is authorized by this decision.
