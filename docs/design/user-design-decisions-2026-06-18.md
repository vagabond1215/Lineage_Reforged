# User Design Decisions Intake - Elemental Relationships And Early Systems

Source route: ChatGPT via GitHub Connector  
Date: 2026-06-18  
Status: connector-side user-decision intake; documentation only; not an implementation handoff

## Purpose

This document preserves user-provided design decisions from June 18, 2026. It updates open question posture for elemental religious orders, elemental relationships, relationship structures, favorability profile values, difficulty settings, NPC approach, inventory, travel planning order, and accepted recommendations for notable outstanding questions.

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

## Accepted Recommendations For Notable Questions

The user accepted the June 18 recommendations for notable outstanding questions. These recommendations are durable planning posture unless revised later.

### Religious Order References

Defer `religiousOrderIds` until broader organization authority exists, but keep the placeholder id pattern now:

- `religious_order.elemental.fire`
- `religious_order.elemental.ice`
- `religious_order.elemental.wind`
- `religious_order.elemental.earth`
- `religious_order.elemental.thunder`
- `religious_order.elemental.water`
- `religious_order.elemental.light`
- `religious_order.elemental.darkness`

Do not force hotspot records to reference organizations before an organization schema exists.

### Sacred Site Sequence

Plan sacred sites after generic hotspot snippets, but before full favorability/alignment mechanics.

Sacred sites are a subtype of hotspots. They should consume hotspot/snippet authority first, while favorability can later consume sacred-site actions such as pilgrimage, desecration, or trial completion.

### Confluence Sacred Sites

A rare confluence sacred site should require two or more elemental authorities plus one rare trigger.

Possible rare triggers:

- permanent geographic convergence;
- rare cyclic weather or astronomical event;
- opposing-element balance point;
- ancient ritual or artifact binding multiple elements;
- confirmed elemental spawning overlap.

### First Sacred-Site Mechanic

The first sacred-site mechanic should be pilgrimage.

Pilgrimage is safer than immediate elemental boons or spell effects and can remain descriptive before later connecting to favorability, trials, quests, or boons.

### Favorability Bands

Use shared elemental favorability bands first, with optional per-order display labels later.

Initial internal bands:

| Range | Band |
| ---: | --- |
| `-100` | Anathema |
| `-99` to `-60` | Hated |
| `-59` to `-25` | Hostile |
| `-24` to `-1` | Disfavored |
| `0` | Neutral |
| `1` to `24` | Noticed |
| `25` to `49` | Accepted |
| `50` to `74` | Favored |
| `75` to `99` | Devoted |
| `100` | Consecrated / Fanatical |

### Relationship Checkpoints

Use mixed checkpoints: tier-band checkpoints plus hardening segments inside each band.

Example posture:

- reaching `50` enters `Favored`;
- after maintaining it for a required period, `50` becomes protected;
- recent gains above `50` decay faster until hardened;
- serious direct violations can bypass protection.

### Difficulty Mechanics And Weights

The first character-creation difficulty implementation should expose these five mechanics:

| Mechanic | Affects | Suggested weight |
| --- | --- | ---: |
| Combat danger | enemy damage, HP, tactics | 25 |
| Survival pressure | hunger, thirst, climate, fatigue | 20 |
| Economy pressure | prices, wages, scarcity | 15 |
| Progression friction | skill/stat growth, trial difficulty | 20 |
| Consequence severity | injury, death, law, failure costs | 20 |

Total difficulty rating should sum to `100` for baseline weighting.

Modes:

- `Story`: low values, high forgiveness, low Prestige gain.
- `Adventure`: baseline.
- `Trial`: harder, better Prestige.
- `Extreme`: high danger, high Prestige.
- `Custom`: slider-based and Prestige-locked.

### NPC Persistence

Generated role-placeholder NPCs should be disposable by default and persistent when promoted.

An NPC should become persistent when they:

- give or complete a quest;
- join the party;
- marry into a family;
- become a rival or apprentice;
- hold office or become tied to a business, guild, religious order, or law case;
- meaningfully affect character history.

### First Container / Storage Implementation

Start with character containers only, but design the schema to support vehicles and settlement storage later.

First scope:

- backpack;
- pouch;
- purse;
- belt;
- quiver;
- item weight;
- item bulk;
- coin-specific purse limits;
- storage location tracked per stack.

Do not start with settlement storage or vehicles until ownership, storage, and economy seams exist.

### Map/Grid Before Travel

The first travel-adjacent pass should be map/grid authority cleanup and projection, not route travel.

Recommended sequence:

1. Audit map, grid, region, locality, settlement, and hex links.
2. Ensure settlements connect to localities, regions, and macro regions.
3. Ensure known point-of-interest visibility can be represented.
4. Add read-only grid projection if needed.
5. Plan route risk, caravan travel, fast travel, and grid travel actions only after the foundation is reliable.
