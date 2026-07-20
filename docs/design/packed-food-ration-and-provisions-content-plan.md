# Packed Food, Ration, And Provisions Content Plan

Date: 2026-07-19
Status: accepted documentation-only design authority; no content or runtime implementation permission
Run classification: unversioned cross-cutting content and ownership plan
Milestone impact: `supports_current_band`

## 1. Decision Summary

Generic labels such as `ration_bundle`, `trail_meal`, and `traveler_ration` must not remain the primary identities of directly consumed food.

The project should distinguish:

1. **named food items**, which identify what the character actually eats or drinks;
2. **prepared composite foods**, which are one authored food made from several ingredients;
3. **provisions packs**, which are openable containers or bundles containing several named food items; and
4. **consumable profiles**, which describe the body-state effect of one exact directly consumed item.

A provisions pack may have a generic logistical name because it is packaging, not the food itself. Its contents must be explicit. A directly consumed item must use a food or preparation name such as `mixed_nuts`, `preserved_fruit`, `smoked_meat`, or `smoked_fish`, with more source-specific names used when source identity materially matters.

## 2. Current Repository Implications

The current repository uses `item.ration_bundle` in six starting bundles. The current item schema can describe an item and an optional `consumableProfileId`, but it has no bundle contents, open action, nested inventory, or content-release field.

The consumable-profile catalog currently includes generic profiles such as:

- `consume.ration_bundle`;
- `consume.traveler_ration`; and
- `consume.trail_meal`.

Those profiles should not be newly linked to generic pack identities. Existing mismatched or generic links must be audited before any new consumption pass.

This plan does not authorize changing starting bundles, items, profiles, recipes, schemas, runtime, UI, or saves during active `0.6.6`.

## 3. Canonical Authority Separation

### Named food item

Owns:

- stable food identity;
- preparation or preservation identity;
- item value and market posture;
- ingredient/consumable roles where appropriate;
- one exact consumable-profile reference when direct consumption is supported.

Does not own:

- its source organism merely because names resemble one another;
- a recipe unless an explicit recipe record exists;
- mutable freshness, contamination, temperature, or spoilage;
- an inventory-opening action.

### Prepared composite food

A single edible product made through one explicit bounded recipe, such as a nut-and-fruit cake or a smoked-meat grain loaf.

It may receive one exact consumable profile because the product itself is consumed. Its recipe must own all exact inputs, quantities, workplace, tools, skill, and output. It must not inherit composition from a production chain or from a provisions pack.

### Provisions pack

A sealed or wrapped inventory unit containing explicit named foods.

It is not directly edible and must not have a nutrition profile. Opening it should consume or transform the pack and create its listed contents through a future authoritative inventory command.

### Consumable profile

Owns only the body-state values for one exact directly consumed food or drink. It does not define ingredients, packaging, preparation, safety, quality, source, or recipe composition.

## 4. Naming Rules

### Directly consumed foods

Use names that identify the food or preparation:

- `mixed_nuts`;
- `preserved_fruit` or a source-specific preserved-fruit identity;
- `smoked_meat`;
- `smoked_fish`;
- dried fruit slices, fruit leather, nut cakes, grain cakes, hard breads, cheeses, preserved vegetables, or comparable exact identities when canon and dependencies support them.

Prefer source-specific names when source affects value, availability, risk, culture, recipe, or nutrition. A broad identity is acceptable only when the project deliberately treats the sources as interchangeable at that layer.

### Packs and bundles

Generic logistical names are acceptable because the item is packaging:

- standard preserved provisions pack;
- hearty travel provisions pack;
- luxury wayfarer provisions pack;
- regional or institutional provisions pack.

The display name must not imply that the packaging itself is eaten. UI copy should use `Open`, `Unpack`, or equivalent language rather than `Eat`.

### Avoid

Do not use vague directly consumed identities such as:

- generic ration;
- meal bundle;
- trail meal;
- traveler ration;
- hearty meal;
- luxury meal;

unless the record is explicitly a pack/container or the name is replaced by an authored composition.

## 5. Food And Pack Tiers

Tier is a content and value classification, not a universal numerical multiplier.

### Light snack

Usually one food group or one small preserved item.

Examples:

- mixed nuts;
- preserved fruit;
- a smoked-meat portion;
- a smoked-fish portion.

Purpose: portable supplementation, low preparation burden, modest nutrition.

### Standard preserved meal

Usually two complementary foods or one prepared composite product.

Examples:

- smoked meat plus a durable grain product;
- smoked fish plus a durable grain product;
- nuts plus preserved fruit;
- a named preserved composite food.

Purpose: ordinary travel sustenance with better balance than a single snack.

### Hearty provisions pack

Contains several named foods spanning multiple nutritional roles, generally including:

- a protein-rich preserved food;
- a durable carbohydrate or grain food;
- a fruit, vegetable, nut, or comparable supplementary food.

`Hearty` should indicate greater filling value and nutritional completeness than the standard pack. It may be heavier, more expensive, and less space-efficient.

### Luxury provisions pack

Contains higher-value, rarer, fresher-looking, more varied, culturally prestigious, or specialist-prepared foods.

`Luxury` must not automatically mean the highest calories or every nutritional value. Its distinction may instead come from:

- variety;
- ingredient quality;
- rarity or regional origin;
- preparation labor;
- prestige;
- packaging;
- higher market value.

Any morale, comfort, reputation, social, or quality effect remains deferred until an explicit owner exists.

## 6. Initial Candidate Posture

### Existing high-readiness food identities

The following existing recipe outputs are strong later pack-content candidates because their bounded preservation relationships already exist:

- `smoked_meat`;
- `smoked_fish`.

Species-specific preserved foods may also be candidates after source, profile, and intended abstraction are audited.

### Missing or unresolved named identities

The following user-directed food identities are desirable but require a fresh exact catalog and source audit before creation:

- `mixed_nuts`;
- `preserved_fruit` and any source-specific variants;
- durable grain portions suitable for packed meals;
- named multi-food composite provisions.

For each proposed food, verify:

- exact source or ingredient identities;
- item/value closure;
- preparation or preservation relationship;
- direct-consumption posture;
- recipe and workplace/tool/skill closure where preparation is represented;
- regional/cultural fit where the identity is not intended to be universal.

### Current generic identities

- `ration_bundle` is the strongest candidate to retain as a future container identity because starting bundles already reference it.
- `trail_meal` and `traveler_ration` should not receive new direct-consumption links. A later migration must decide whether to convert them into pack identities, replace their references with exact named foods/packs, or retire them with compatibility handling.
- Generic consumable profiles should be retired, replaced, or explicitly migrated rather than silently attached to new named foods.

## 7. Future Bundle Profile Contract

Do not model opening a provisions pack as crafting.

A future static bundle-profile owner should define at minimum:

- stable bundle profile id;
- owning item id;
- explicit content item ids and positive quantities;
- pack tier;
- whether packaging is consumed, retained, or replaced;
- optional authored region/institution restrictions;
- notes preserving the non-nutrition and non-recipe boundary.

A candidate shape is a separate validated catalog such as `item_bundle_profiles`, referenced by an optional item field. The exact schema and path require a dedicated owner-specific plan.

Validation should reject:

- missing item references;
- zero or negative quantities;
- direct or indirect bundle cycles;
- a bundle that contains itself;
- a pack with a `consumableProfileId`;
- a directly consumed food that points to a semantically unrelated profile;
- duplicate content rows unless explicitly aggregated by the contract.

## 8. Future Open-Pack Runtime Contract

Opening a pack requires an engine-owned inventory transition. It must eventually own:

- command identity and revision/stale protection;
- pack existence and quantity validation;
- atomic pack consumption and content creation;
- capacity/overflow handling;
- deterministic event facts;
- accepted-only UI application;
- save/load and replay posture;
- failure without partial inventory mutation.

Current item content must not pretend this behavior exists.

## 9. Starting-Bundle Direction

Until open-pack runtime exists, starting-bundle content has two acceptable future directions:

1. continue granting `item.ration_bundle` as a non-consumable placeholder, with UI/opening unavailable and clearly deferred; or
2. replace the generic bundle in a dedicated migration with explicit named food items already supported by consumption authority.

Do not convert `item.ration_bundle` into a directly edible item merely to make the starting loadout usable.

Once pack opening exists, starting bundles may grant different explicit pack tiers or compositions by background. For example, a hunter, laborer, trader, or arcanist may receive distinct contents without changing the general pack-opening contract.

## 10. Required Future Passes

1. **Generic Food And Consumable Profile Reconciliation Audit**
   - enumerate every generic meal/ration item and profile;
   - identify every current link and mismatch;
   - classify retain-as-pack, rename, replace, retire, or exact-food conversion;
   - select the smallest safe migration order.

2. **Named Preserved Food Content Plan**
   - select exact first-batch foods such as mixed nuts, preserved fruit, smoked foods, and durable grain foods;
   - establish source, recipe, item, value, profile, and regional closure;
   - avoid automatic edibility inference from flora/fauna names.

3. **Bundle Profile Schema And Validation Plan**
   - define static pack contents without crafting or runtime mutation.

4. **Open-Pack Inventory Command Plan**
   - define the atomic runtime transition after inventory ownership prerequisites are ready.

5. **Packed Meal Balance And Presentation Pass**
   - author exact nutrition only after item/profile semantics are correct;
   - distinguish hearty nutrition from luxury variety/value;
   - provide contents preview and accessible UI language.

## 11. Route And Scope

- Active `Version 0.6.6` remains unchanged.
- `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` should inspect and disposition the generic ration/profile inconsistencies but should not invent pack-opening runtime or unsupported recipes.
- The docs-first Geography/recognition plan and later activity-resolution reuse audit retain their established order.
- No future primary version number is assigned by this plan. Implementation must be classified under the internal versioning policy after the active route and readiness evidence determine the correct parent or primary package.

This document changes no items, profiles, recipes, starting bundles, schemas, validators, runtime, UI, saves, economy, or gameplay behavior.