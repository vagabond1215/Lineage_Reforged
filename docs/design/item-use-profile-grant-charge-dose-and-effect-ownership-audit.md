# Item Use-Profile, Grant, Charge/Dose, And Effect-Ownership Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only evidence audit; no local tests, builds, lint, combat execution, content mutation, or item behavior change

## Purpose

Reconcile item `useProfiles`, combat action grants, consumable profiles, equipment profiles, magic and combat hooks, inventory stacks, charges/doses, and owner-routed effects before any medicine, poison, antidote, potion, food, magical item, or combat-item implementation.

This audit does not authorize a universal effect bag, item-instance system, charges, durability, doses, healing behavior, poison behavior, content changes, or combat balance changes.

## Current Classification

`ITEM_ACTION_GRANTS_AND_PROFILE_FAMILIES_EXIST; UNIVERSAL_ITEM_ACTIVATION_AND_QUANTITY_EFFECT_AUTHORITY_ABSENT`

## Existing Authorities

Current repository evidence includes:

- item records with embedded action-bearing `useProfiles`;
- player-engine `resolveItemUseProfile` behavior;
- combat action candidate construction that can consume item use-profile grants;
- combat-hook and magic-metadata support validators;
- item, combat, spell, ability, and effect-channel contracts;
- separate nutrition/consumable profile authority;
- weapon and armor structural-profile schemas and validation helpers;
- inventory bags, stacks, overflow, equipment slots, and some durability-shaped fields;
- body-state consumable helper capability;
- focused tests for progression, combat hooks, equipment mapping, and equipment-profile validation.

These authorities are intentionally separate.

## Boundary Matrix

| Concern | Current authority | What it does not prove |
| --- | --- | --- |
| Embedded item `useProfiles` | item/action contract | possession, activation, quantity consumption, charges, cooldown, or effect application |
| Combat action grant | combat engine candidate action | inventory ownership, item consumption, durability, dose, or out-of-combat use |
| Consumable/nutrition profile | static profile authority | executable item-use command or exact serving/dose owner |
| Weapon/armor structural profile | schema/pure validation | equipped runtime behavior or action grant |
| Inventory stack | quantity and location shape | unique item instance, charge state, dose state, freshness, opened container, or provenance |
| Equipment durability-like fields | equipped item state | general durability command, repair, breakage, or per-stack use |
| Magic/combat hook validator | supported hook vocabulary | successful item activation or resource ownership |
| Body-state consumable helper | calculation/application helper | item identity, eligibility, command/result receipt, quantity removal |

## Current Critical Distinctions

1. **Use profile is not possession.** An item record may advertise a supported action without the actor owning an eligible stack or instance.
2. **Possession is not activation.** Inventory presence does not establish a command, target, timing, cost, or effect result.
3. **Action grant is not consumption.** Combat can derive an action candidate without proving quantity decrement, charge use, durability loss, or container state.
4. **Consumable profile is not a dose.** Nutrition, medicinal, poisonous, or magical profile data does not define serving size, dose identity, partial use, or repeat-use posture.
5. **Effect vocabulary is not effect ownership.** A supported effect channel does not choose the affected owner, duration, stacking, resistance, correction, or persistence behavior.
6. **Stack quantity is not item-instance state.** Charges, durability, contamination, freshness, attunement, inscription, and ownership may require a different identity layer.

## Known Cross-Domain Risks

- treating nutrition profiles as universal item-use authority;
- treating combat grants as proof that an item should be consumed;
- removing one stack quantity when the effect expects a dose, serving, container, or charge;
- applying healing or care without the accepted health/care owner;
- granting magic effects without spell/item hook validation and resource ownership;
- equating structural equipment profiles with combat actions;
- using item keys where stable item-instance or stack identity is required;
- replaying an accepted effect while consuming quantity twice;
- applying an effect successfully but failing the inventory mutation, or vice versa.

## Minimum Future Item-Use Contract

A bounded item-use package should decide:

1. actor, item record, stack or instance, container, and owner identity;
2. activation context: combat, field, rest, crafting, care, or utility;
3. eligibility, target, timing, costs, and blockers;
4. quantity, dose, serving, charge, durability, or nonconsuming posture;
5. exact effect owner and typed result;
6. atomic inventory/effect application;
7. duplicate, replay, correction, interruption, and cancellation behavior;
8. persistence and migration;
9. notification/Chronicle derivation;
10. focused tests for wrong owner, insufficient quantity, unsupported hook, duplicate use, partial failure, and copied/reordered evidence.

## Named Consumers

Future work must inspect this audit when it covers:

- consumable integrity or execution;
- equipment profiles and combat item actions;
- medicine, care, healing items, poison, or antidote behavior;
- food, drink, portions, servings, containers, or doses;
- magical items, spell grants, alchemy, or effect hooks;
- charges, durability, item instances, or inventory consumption.

## Review Trigger

Re-review at any decision or implementation involving item activation, combat grants, healing items, poison/antidote, doses, charges, durability, or effect execution.

## Exclusions

No item, schema, content, source, tests, inventory, combat, health, magic, save, UI, active prompt, roadmap, backlog, or branch register changed in this pass.
