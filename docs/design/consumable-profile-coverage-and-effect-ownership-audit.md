# Consumable Profile Coverage And Effect-Ownership Audit

Date: 2026-07-29

Source route: ChatGPT via GitHub Connector

Source commit: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Status: connector-only, read-only evidence audit; no item, profile, schema, validator, test, runtime, body-state, inventory, health, magic, UI, save, content, or roadmap change

## 1. Purpose

Audit the current consumable-profile authority, item links, runtime meaning, and health/magic/body-state boundaries before any profile cleanup, food-use command, medicine/alchemy expansion, or broad consumable-system implementation.

This pass distinguishes:

- item classification from intake-profile authority;
- linked profiles from orphan profiles;
- static nutrient/intoxication descriptors from executable effects;
- obvious link defects from corrections that still require product and owner decisions;
- food/body intake from offensive, magical, medicinal, or other consumable use cases.

It does not authorize profile edits or consumption behavior.

## 2. Current Inventory

The current repository contains:

- 26 items with `itemClass: consumable`;
- nine records in `packages/content/base/items/consumable_profiles.json`;
- five item records carrying `consumableProfileId`;
- four profile records with no item link;
- a strict profile-record schema;
- normal content-lint registration;
- no accepted general item-use command or general consumable effect executor.

The five linked items are all commodity-class food/beverage identities rather than `itemClass: consumable` records.

This confirms that `itemClass: consumable` and `consumableProfileId` do not currently mean the same thing.

## 3. Current Profile Contract

Each profile may contain:

- `id`;
- calories;
- protein;
- carbohydrate under the field `carbs`;
- fat;
- optional hydration;
- optional intoxication;
- optional use verb.

The schema requires only:

- ID;
- calories;
- protein;
- carbs;
- fat.

All numeric values are non-negative numbers.

### Missing static semantics

The profile contract does not define:

- item identity or reverse item link;
- lifecycle or status;
- semantic version;
- provenance or source notes;
- physical quantity basis;
- serving size;
- remaining amount;
- number of portions;
- whole-only versus portionable posture;
- food readiness or preparation state;
- preservation or food safety;
- consumption time;
- container behavior;
- effect owner;
- body-state proposal type;
- intoxication unit or interpretation;
- health, healing, poison, medicine, antidote, magic, or care semantics;
- runtime use behavior;
- UI presentation beyond a free-form verb.

The numeric fields are legacy game-scale descriptors, not historical calories, physical grams, universal nutritional truth, or direct execution formulas.

## 4. Profile Records

| Profile | Current values summary | Link posture |
| --- | --- | --- |
| `consume.ration_bundle` | food intake descriptor | orphan |
| `consume.traveler_ration` | food intake descriptor | linked to `item.crusty_sausage_roll` |
| `consume.trail_meal` | food intake descriptor | orphan |
| `consume.bread_loaf` | food intake descriptor | linked to `item.bread_loaf` |
| `consume.game_stew` | food intake descriptor | linked to `item.breast_cut` |
| `consume.seafood_stew` | food intake descriptor | orphan |
| `consume.inn_hearty_meal` | food intake descriptor | linked to `item.candied_peel` |
| `consume.tavern_fish_plate` | food intake descriptor | orphan |
| `consume.ale_cask` | food and intoxication descriptor | linked to `item.ale_cask` |

## 5. Exact Item Links

### `item.ale_cask` → `consume.ale_cask`

The item is:

- a commodity;
- beverage branch;
- cask sub-branch;
- roles include ingredient, trade good, and consumable;
- stage finished.

The link resolves by ID, but the profile treats the entire cask as one drink action with one nutrition/hydration/intoxication payload.

Disposition:

`SCALE_AND_PORTION_AUTHORITY_MISSING`

The identity match is plausible, but one cask cannot safely equal one serving without quantity, container, pour, remaining-amount, and portion authority.

### `item.bread_loaf` → `consume.bread_loaf`

The item and profile identity align directly.

Disposition:

`STRUCTURALLY_PLAUSIBLE_PORTION_UNRESOLVED`

The link should not be called fully correct until whole-loaf versus portion consumption and serving basis are decided.

### `item.breast_cut` → `consume.game_stew`

The item is a prepared food identity named `Breast Cut`, while the profile is named `game_stew`.

Disposition:

`SEMANTIC_MISMATCH`

The current link makes a meat cut inherit a stew profile without an authored transformation or identity relation.

### `item.candied_peel` → `consume.inn_hearty_meal`

The item is `Candied Peel`; the profile is an inn hearty meal.

Disposition:

`SEMANTIC_MISMATCH`

The item cannot safely inherit the full-meal profile by name, tags, or generic food role.

### `item.crusty_sausage_roll` → `consume.traveler_ration`

The item is one baked sausage roll; the profile is a traveler ration.

Disposition:

`SEMANTIC_MISMATCH`

A single prepared item may be part of a ration, but that does not make it the ration package or prove the same intake values.

## 6. Orphan Profiles

The current orphan profiles are:

- `consume.ration_bundle`;
- `consume.trail_meal`;
- `consume.seafood_stew`;
- `consume.tavern_fish_plate`.

Their existence is accepted by current validation. They are not executable and do not prove that matching items should be created or linked.

Each needs one explicit disposition:

- retain as future profile vocabulary;
- link to an existing exact item after evidence;
- replace with a differently named profile;
- retire/delete after migration planning;
- defer until meal/provision runtime owners exist.

Do not create item identities merely to eliminate orphan counts.

## 7. Item-Class Boundary

The repository contains 26 `itemClass: consumable` identities, including non-food use cases such as offensive consumables.

The nine current profiles describe only food, drink, hydration, and intoxication.

Therefore:

- `itemClass: consumable` means an item-category identity, not a guarantee of a food/body intake profile;
- `consumableProfileId` currently means a narrow intake descriptor, not a universal consumable effect contract;
- an acid vial, potion, medicine, antidote, magical charge, bomb, or utility consumable must not receive calorie/macronutrient fields merely because it is consumable;
- a commodity-class food may have an intake profile without becoming `itemClass: consumable`.

A future naming pass should consider whether `consumable_profiles` is too broad for an authority that currently means nutritional/body-intake profile.

No rename or migration is authorized here.

## 8. Validation Posture

Normal content lint registers `consumable_profiles.json` with `validateConsumableProfiles: true`.

The current profile schema provides structural validation and ID shape.

The current repaired culinary audit proves:

- nine profile records;
- five item links;
- four orphans;
- four problematic linked-profile cases when cask scale is included;
- no accepted exact correction set.

### Missing validation

The current system does not fail on:

- orphan profiles;
- semantically mismatched item/profile names;
- item scale versus profile serving scale;
- prepared item versus meal-package mismatch;
- an item linking to a profile whose identity does not correspond to the item;
- food-safety or preparation-state contradiction;
- profile values without a declared physical/serving basis.

A future validator should not attempt to infer semantic correctness from strings. It needs an accepted item-to-profile relation and exact authoring rules first.

## 9. Runtime And Effect Ownership

The accepted static-content program classifies consumable profiles as static descriptors with no effect execution.

No current profile field authorizes:

- inventory consumption;
- item-instance mutation;
- opened or remaining quantity;
- body-state change;
- HP healing;
- condition treatment;
- lethal-process stabilization;
- care capability;
- poison or antidote behavior;
- spell or magical effect;
- intoxication progression;
- Chronicle or notification creation;
- save mutation.

### Future command boundary

A future food or consumable use flow requires an engine-owned command that decides:

1. actor and item-instance identity;
2. access and inventory ownership;
3. selected physical amount;
4. eligibility and preparation/safety state;
5. container/open/remaining behavior;
6. normalized profile and semantic version;
7. typed body/intoxication/health/magic proposals;
8. inventory consumption or remaining-amount receipt;
9. accepted result and owner-specific receipts;
10. persistence, replay, duplicate, and correction behavior;
11. accepted-only UI application.

The static profile may be an input to that flow, but it cannot apply its own numbers.

## 10. Body-State Boundary

Current body-state rules use game-scale daily energy and hydration values. The culinary integration explicitly rejects treating these as historical kilocalorie or universal human-nutrition authority.

A future intake result may propose bounded changes to:

- energy;
- protein support;
- hydration;
- intoxication.

The body-state owner must accept those consequences under a versioned rule.

The profile alone does not decide:

- satiety;
- digestion;
- recovery;
- morale;
- food fatigue;
- spoilage harm;
- poisoning;
- healing;
- disease;
- long-term nutrition.

## 11. Health, Medicine, And Care Boundary

The health design chain separates:

- HP/resource restoration;
- body state;
- injuries;
- lethal processes;
- care capabilities and attempts;
- stabilization;
- definitive treatment;
- functional recovery;
- anatomical restoration;
- resurrection.

A future medicine or care item must carry explicit capability and owner contracts. It cannot become healing or treatment authority through:

- `itemClass: consumable`;
- an item name such as potion, tonic, salve, antidote, or medicine;
- nutrition-profile existence;
- `heal.hp` compatibility;
- tags or lore text alone.

Current consumable profiles should remain free of diagnosis, treatment, stabilization, cure, resurrection, and hidden health-process fields.

## 12. Magic And Alchemy Boundary

Magic and alchemy may later contribute to consumable effects, but require separate authority for:

- effect identity;
- spell/alchemical source;
- capability and access;
- activation/use command;
- cost and consumption;
- target;
- owner-routed consequences;
- failure and uncertainty;
- persistence and correction.

Do not widen the current nutrition profile into a universal effect bag.

A future system may need distinct authorities such as:

- nutritional intake profiles;
- item use/action profiles;
- medicine/care capability grants;
- alchemical effect definitions;
- poison/antidote definitions;
- item-instance doses or charges.

The exact split requires a focused decision.

## 13. Safe Bug-Fix Assessment

The three semantic mismatches are concrete:

- breast cut → game stew;
- candied peel → inn hearty meal;
- crusty sausage roll → traveler ration.

The ale-cask link is also unsafe at current serving scale.

However, a connector fix is **not** authorized because the intended replacements are not unambiguous.

For each mismatch, several technically possible corrections exist:

- remove the profile link;
- create a new exact profile;
- link to another existing profile;
- rename/reclassify the item;
- treat the item as a component rather than directly consumable;
- defer until quantity and meal composition exist.

The repaired culinary authority explicitly states that exact retain/remove/replace decisions remain unresolved.

Result:

`BUG_CONFIRMED_FIX_REQUIRES_DIRECTION`

## 14. Smallest Safe Next Pass

The already identified next route remains appropriate:

`Food-Named Taxonomy And Consumable-Profile Integrity Decision`

Classification:

`UNVERSIONED_PREREQUISITE`

It should decide exactly:

1. disposition of the four orphan profiles;
2. disposition of each of the five current item links;
3. whether `bread_loaf` remains linked before portion authority;
4. whether `ale_cask` link is removed until serving/container support exists;
5. exact replacement profile IDs, if any;
6. whether profile IDs should be item-key aligned;
7. lifecycle/provenance needs;
8. whether `consumable_profiles` should remain the authority name;
9. exact migration and compatibility posture;
10. validator/test changes;
11. whether a tiny content repair package is dependency-closed.

Implementation remains blocked until that decision and the quantity/food-state/instance boundary are reconciled.

## 15. Recommended Record Classification

| Current record/link | Recommended planning classification |
| --- | --- |
| `consume.ration_bundle` orphan | retain only if provision/ration authority still plans this exact identity |
| `consume.traveler_ration` linked to sausage roll | unlink or replace after exact item/profile decision |
| `consume.trail_meal` orphan | decide whether it is a meal identity, profile vocabulary, or obsolete demo residue |
| `consume.bread_loaf` linked to bread loaf | strongest retain candidate, but serving basis unresolved |
| `consume.game_stew` linked to breast cut | remove/replace mismatch; do not preserve as correct |
| `consume.seafood_stew` orphan | retain only with exact future item/meal authority |
| `consume.inn_hearty_meal` linked to candied peel | remove/replace mismatch; do not preserve as correct |
| `consume.tavern_fish_plate` orphan | retain only with exact future item/meal authority |
| `consume.ale_cask` linked to cask | profile identity plausible, direct-serving semantics unsafe |

## 16. User Input Required

Before the integrity decision, obtain concrete user direction on:

1. Should profiles represent one serving, one whole item, or a declared quantity basis?
2. Should a loaf or cask be consumed partially, or remain unusable until portion/container state exists?
3. Should demo meal profiles such as `inn_hearty_meal` and `tavern_fish_plate` remain planned future concepts or be retired?
4. Should item/profile IDs normally align one-to-one, or may many items share a generic intake profile?
5. Should nutrition detail remain numeric, become mostly qualitative, or support both views?
6. Should ordinary foods provide only body-state intake, while healing/medicine/alchemy use separate effect authorities?
7. Is correcting the three mismatched links a near-term cleanup priority, or should all links remain frozen until the broader culinary quantity contract opens?

These choices materially determine the safe repair.

## 17. Final Disposition

Current profile authority:

`STATIC_NARROW_AND_VALIDATED`

Current link integrity:

`KNOWN_DEFECTS_UNRESOLVED`

Execution authority:

`ABSENT`

Next planning posture:

`DOCUMENTATION_PREREQUISITE_READY`

Implementation:

`NO_PACKAGE`

No connector content fix was made because the defects are clear but the intended canonical correction is not.
