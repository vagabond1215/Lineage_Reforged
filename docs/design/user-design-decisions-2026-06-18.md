# User Design Decisions Intake - Elemental Relationships And Early Systems

Source route: ChatGPT via GitHub Connector  
Date: 2026-06-18  
Status: connector-side user-decision intake; documentation only; not an implementation handoff

## Purpose

This document preserves user-provided design decisions from June 18, 2026. It updates open question posture for elemental religious orders, elemental relationships, relationship structures, favorability profile values, difficulty settings, NPC approach, inventory, and travel planning order.

This file is not:

- runtime authority;
- schema authority;
- content JSON;
- save data;
- a backlog replacement;
- permission to implement broad systems without a scoped prompt.

## External Reference Posture

The elemental framework should use the standard Final Fantasy XI elemental model as a reference point for element names and relationships.

Reference pages provided by the user:

- `https://ffxiclopedia.fandom.com/wiki/Element`
- `https://www.bg-wiki.com/ffxi/Category:Elements`

Reference relationship to preserve in future planning:

- Fire is ascendant against Ice.
- Ice is ascendant against Wind.
- Wind is ascendant against Earth.
- Earth is ascendant against Thunder/Lightning.
- Thunder/Lightning is ascendant against Water.
- Water is ascendant against Fire.
- Light and Darkness are opposed.

## Elemental Order Placeholder Ids

Base elemental religious-order placeholder ids should use this pattern:

- `religious_order.elemental.light`
- `religious_order.elemental.water`
- `religious_order.elemental.fire`
- `religious_order.elemental.earth`
- etc.

Do not use placeholder names that imply final order names before those names are authored.

## Element Names And Lore Labels

Use the standard FFXI-style elemental branches and relationships as the starting model.

Earth is the actual element.

Spell names or spell labels may use `stone` or `rock` instead of `earth` when the spell concept emphasizes hardness, impact, rock, or stone manifestation.

Elemental vessels and intrinsic elemental references should use `Earth` because they refer to the actual element itself.

Thunder is the actual element.

Spell names or spell labels may use `lightning` when referring to the visible or applied effect.

If useful for lore, other elements may also have applied spell labels distinct from the intrinsic element name, but the core elemental branch should remain stable.

## Relationship Structure

Relationship systems should use separate top-level structures by relationship type rather than a single generic typed ledger as the first planned posture.

Relationship categories may have multiple subtypes.

Examples:

- `relationships.element.earth`
- `relationships.element.fire`
- `relationships.renown.continent.[continent_id_or_slug]`
- `relationships.renown.region.[region_id_or_slug]`
- `relationships.reputation.[entity_id_or_slug]`

Future relationship work must preserve place hierarchy:

- settlements associate to regions;
- regions associate to continents or macro regions;
- kingdoms eventually need their own structure;
- kingdom structure may overlap existing region/settlement structures and may change over time.

## Elemental Favorability Values

Elemental favorability normally floors at `0` for indirect changes.

Positive favorability uses a positive-sum cap of `100`, representing 100% allocated favorability across positive elemental relationships.

Negative favorability values can exist but do not count against the positive `100` cap.

Example valid profile:

- Fire: `100`
- Ice: `-73`
- Darkness: `-32`
- all other elements: `0`

There is no maximum negative sum across all elements.

A single elemental branch has a negative cap of `-100`.

At `-100`, that element should essentially become unusable by the character until future recovery systems allow otherwise.

Negative values should usually be light. Strong negative values should promote aggressive or hostile behavior proportional to the negative value.

Negative elemental favorability can only be attained by direct actions against the element, such as:

- desecrating a sacred site;
- killing elementals;
- other explicitly antagonistic acts.

Indirect actions should not push values below `0`.

Adversarial relationships may also have benefits, such as:

- increased damage against that element;
- positive relationship bonuses with an element that is strong against the opposed element;
- other future explicit mechanics.

## Default Favorability Values And Unlocks

Default elemental favorability values should be `0`.

Backstories and Prestige unlocks may adjust starting values when those systems are unlocked and scoped.

Do not assign actual organization or entity favorability profiles yet; infrastructure/framework comes first.

## Fanatical Profiles And 100 Percent Benchmarks

Fanatical or exclusive profiles should use a hybrid posture.

A `100` favorability benchmark gives significant boons for the associated element and may be required for important roles in some elemental organizations.

Losing the `100` benchmark can be grounds for:

- expulsion from a job;
- expulsion from an organization;
- loss of elemental benefits;
- other scoped consequences.

However, backstories and profiles should not force permanent 100% compliance. Characters should be free to change, with all associated benefits and consequences.

## Difficulty Settings

Character creation should support these difficulty modes:

- `Story`
- `Adventure`
- `Trial`
- `Extreme`
- `Custom`

`Custom` difficulty should be locked behind an account Prestige unlock.

`Custom` should allow difficulty-mechanic weighting with sliders.

`Custom` should have a difficulty rating that sums the individual difficulty factor of each selected mechanic.

A hardcore toggle should exist and affect the selected difficulty mode.

Any calculation that affects player interaction or growth should be affected by difficulty.

Lower difficulty should make gameplay easier.

Prestige gains should be inversely affected by difficulty: easier modes should make it more difficult to gain Prestige points.

## NPC Approach

NPCs should use generated role placeholders for now.

A later system should add:

- NPC name generation;
- lore-friendly NPC profiles;
- common-sense NPC life profiles.

Generated NPCs should support ordinary, uneventful lives by default, with some exceptions for notable or eventful profiles.

## Inventory Model

Inventory should use weight plus container capacity by item bulk.

Container location remains important.

Coins are special:

- a purse should have a coin limit;
- coins exceeding purse limits should need to be converted or moved;
- coins can be placed in non-purse containers when appropriate.

## Travel Planning Order

Do not plan deep travel implementation before overhauling or confirming the map and grid system.

The map/grid system should be reviewed and overhauled first.

Travel planning can resume after that foundation is reliable.
