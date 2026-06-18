# Open Design Questions Index

Source route: ChatGPT via GitHub Connector  
Date: 2026-06-18  
Status: connector-side durable question index; documentation only; not an implementation handoff

## Purpose

This index consolidates user-facing design questions that remain open after the June 17 and June 18, 2026 user-decision intakes.

Resolved design decisions from those intakes are preserved in:

- `docs/design/user-design-decisions-2026-06-17.md`
- `docs/design/user-design-decisions-2026-06-18.md`

This file is not:

- runtime authority;
- content JSON;
- schema authority;
- a backlog replacement;
- a current implementation handoff;
- permission to broaden a narrow Codex prompt.

Use it when future planning requires user preference, especially before implementing systems that would otherwise force assumptions about survival, builder, MMO, religion, family, inheritance, crafting, ecology, travel, law, NPCs, or UI direction.

## Current Pipeline Context

Current active lane:

1. `Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan` is complete.
2. `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator` remains the next recommended Codex run.
3. This index does not renumber or interrupt that pipeline.
4. No user input is required before `0.5.179` unless the user wants to override the current hotspot Knowledge subject schema/validator plan.

## Resolved Decisions From June 17 And June 18, 2026

The following are no longer open questions unless the user later revises them:

- `0.5.177` should proceed with the current hotspot seed defaults.
- Settlements and regions are unique entities at different organizational levels; settlements fall within regions and should be connected appropriately.
- Religious orders should eventually have ids or placeholder ids and be assigned to elemental branches.
- Base elemental religious-order placeholder ids should use `religious_order.elemental.[element]`, such as `religious_order.elemental.light` and `religious_order.elemental.water`.
- The elemental model should use the standard FFXI-style elements and relationships.
- Earth is the actual element; spell labels may use `stone` or `rock` when emphasizing hardness, stone, or rock manifestation.
- Thunder is the actual element; spell labels may use `lightning` for visible or applied effects.
- Non-religious entities that interact with religion should eventually have religious favorability profiles for elemental branches.
- Favorability is social disposition or relationship; elemental alignment is innate or intrinsic.
- Knowing spells of an element does not by itself change character elemental affinity.
- Spell-learning trials and prominent spell use may affect favorability later.
- Elemental favorability normally floors at `0` for indirect changes.
- Negative elemental favorability can exist only from direct antagonistic action and caps at `-100` per element.
- Negative elemental values do not count against the positive `100` total favorability cap.
- Default elemental favorability values are `0` unless backstory or Prestige unlocks later adjust them.
- Fanatical `100` favorability profiles are benchmarks with benefits and consequences, but should not force permanent compliance.
- Sacred sites are a rare subtype under religious hotspots, not the whole category.
- Religious orders are organizations, not inherently sacred places, though they may control sacred sites.
- Religious legality is location/government-specific, not globally inherent to religion.
- Reputation and religious favorability should remain separate relationship functions, even if displayed together later.
- Relationship systems should use internal numeric values and bands, but player-facing exact values need not be visible.
- Relationship systems should use separate top-level structures by relationship type, such as `relationships.element`, `relationships.renown`, and `relationships.reputation`, rather than one generic ledger as the first posture.
- Relationship progression should require trials or proof events.
- Relationship decay should have diminishing returns and protected checkpoints, except for serious violating actions.
- Initial structure is local single-player; multiplayer is deferred.
- Each starting character has a separate world by default; Prestige can later allow multi-character continuity in a pre-existing world.
- NPC party members should use logic controls similar in spirit to Final Fantasy XII gambits.
- NPCs should use generated role placeholders for now, with NPC name generation and lore-friendly profiles added later.
- Survival state should use descriptive bands plus status effects where appropriate.
- Real building should not be an early feature beyond bushcraft.
- Inventory should account for both weight and volume, organized by container/location.
- Inventory should use weight plus container capacity by item bulk; purses should have coin limits, while coins may also be stored in non-purse containers.
- Player-to-player trade is deferred.
- Character creation difficulty modes should include `Story`, `Adventure`, `Trial`, `Extreme`, and Prestige-locked `Custom`.
- Custom difficulty should expose weighted sliders and a summed difficulty rating.
- Hardcore should be a toggle that modifies the selected difficulty mode.
- Easier difficulty should reduce Prestige gain or make Prestige harder to earn.
- Deep travel planning should wait until the map/grid system is reviewed or overhauled.
- Early adult-age rules should use data-driven race/culture variation.
- Offspring age by birthday, with stat increases divided into smaller periodic increments.
- Offspring stat inheritance should use both parents' weighted stats with RNG weighting.
- Stat inheritance applies to all offspring raised by the family, with special rules for illegitimate and adopted heirs.
- Default orphan caretaker order is adult siblings, then adult uncles/aunts, then grandparents; if no adult records exist, the line enters an end-of-line/adopted-heir posture unless Prestige unlocks a caretaker option.
- Offspring should not be married out until adult; adult married-out offspring create a new family if heir slots are available.

## Decision Priority Legend

| Priority | Meaning |
| --- | --- |
| Soon | Likely needed in the next few planning/implementation runs. |
| Later | Can wait until the relevant system lane is selected. |
| Strategic | Broad product direction; answer before major runtime/vertical-slice planning. |

## Soon: Religious Hotspot And Religion Follow-Ups

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| Should `religiousOrderIds` be added through a nested-order resolver before hotspot snippets, or remain deferred until broader organization authority exists? | Still deferred; order ids/placeholders should eventually exist. | Soon |
| Should sacred sites be planned immediately after generic hotspot snippets, or after favorability/alignment framework exists? | Unresolved. | Later |
| What qualifies a rare confluence sacred site that can belong to multiple elements? | Unresolved. | Later |
| What boon/system mechanic should the first sacred site support: pilgrimage, elemental trial, quest, spell interaction, or another mechanic? | Unresolved. | Later |
| Should religious orders be Knowledge subjects, organization records only, or both depending on use case? | User leans organization construct first; Knowledge subject support remains unresolved. | Later |
| Should auspicious environment/weather concepts become religious context records, ecology records, event tags, or hotspot modifiers? | Unresolved. | Later |
| Which religion/element/doctrine knowledge concepts should be seeded next after the current hotspot lane? | Unresolved. | Later |

## Soon: Relationship / Favorability / Alignment Framework Questions

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| Should favorability bands be shared across all elemental branches or customizable per religion/order/institution? | Unresolved. | Later |
| What are the first band names for religious favorability? | Unresolved; examples include initiate/favored-like labels but exact bands need planning. | Later |
| Should relationship checkpoints be tier bands, intermediate segments inside tiers, or a mixed structure? | User allows any; exact first implementation unresolved. | Later |
| How many days should recent relationship gains take to harden against ordinary decay? | Unresolved. | Later |
| Which relationship losses can bypass protected checkpoints beyond sacred-site desecration, elemental killing, crime, and institutional betrayal? | User gave examples; exact taxonomy unresolved. | Later |
| Which NPC or institution types can reveal relationship bands through trials or mystical means? | Unresolved. | Later |
| Should exact relationship values ever be player-visible outside debug, or always represented by labels/bands? | User says exact value need not display; whether it ever can remains unresolved. | Later |
| What positive benefits should adversarial elemental relationships grant, such as increased damage against an element or favor with the strong-against element? | User approved the concept; exact mechanics unresolved. | Later |

## Strategic: Survival / Builder / RPG / MMO Follow-Ups

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| What is the first playable runtime loop after the current knowledge/content authority lane? | Unresolved. | Strategic |
| Which UI surface is required before that first narrow runtime loop? | Unresolved. | Strategic |
| Should the first builder-adjacent slice be bushcraft only, camp utility, survival shelter, or no building at all? | User says no real building early aside from bushcraft; exact first slice unresolved. | Strategic |
| Which difficulty mechanics should the first character-creation difficulty implementation expose, and what weights should they carry? | Modes are decided; mechanic list and weights unresolved. | Strategic |
| How should hardcore modify each difficulty mode? | Toggle is decided; exact effects unresolved. | Strategic |
| How should Prestige gain scale inversely with difficulty? | Direction decided; exact scaling unresolved. | Strategic |
| Should generated NPCs persist across a character world, or be disposable role/profile instances unless promoted by events? | Generated role placeholders are the first posture; persistence rules unresolved. | Strategic |
| What is the first container/storage implementation: character-only containers, vehicle containers, settlement storage, or all via one inventory framework? | Unresolved. | Strategic |
| Should item stacks split automatically by storage location, item condition, ownership, quality, or provenance? | Storage location is required; other split rules unresolved. | Strategic |

## Organizations, Factions, Law, And Quests

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| Should factions, guilds, institutions, governments, and religious orders use one shared organization schema with typed extensions, or separate schema families? | User wants balance between minimizing schemas and avoiding unused variables; exact structure unresolved. | Soon |
| Should law authority be modeled as location-owned law profiles, government law profiles, enforcement contracts, or a layered structure? | User described layered local/government enforcement; exact structure unresolved. | Soon |
| How should outsourced law enforcement be represented? | User gave examples: religious sect in sacred sites, trusted factions/guilds in frontier towns; exact structure unresolved. | Later |
| How should notoriety trigger higher-authority patrols or investigations? | Unresolved. | Later |
| Should quests use one hybrid quest authority, or separate authorities for work orders, contracts, event quests, and authored quests? | User selected hybrid quest posture; exact structure unresolved. | Soon |
| Which basic ordinary-work quests should be seeded first? | Examples include sewer cleaning, pest control, patrols; exact first set unresolved. | Later |
| What inputs should hybrid quests consume first: monster activity, crime, climate, supply/demand, trade-route activity, or events? | Unresolved. | Later |

## Map, Grid, Travel, And Points Of Interest

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| What map/grid overhaul is required before serious travel planning? | User says map/grid overhaul must come first; exact scope unresolved. | Strategic |
| Should the first travel-adjacent implementation be map/grid authority cleanup, grid projection, route-risk projection, or another preparatory pass? | Unresolved. | Strategic |
| What success-rate model should eventually gate fast travel, and should the initial threshold be `95%` with Prestige reducing by `1%` per upgrade? | User suggested this; exact model needs planning after map/grid. | Later |
| What action set should grid travel eventually support first: hunting, scouting, sneaking, mounted movement, climbing, swimming, or a smaller subset? | Unresolved; defer until after map/grid overhaul. | Later |
| Should caravan travel use minigame/trial events before regular grid travel is implemented? | Unresolved; defer until after map/grid overhaul. | Later |
| Should merchant auto-trade routes use the same travel-risk engine as player-present routes but auto-resolve events? | User suggested yes; exact structure unresolved. | Later |
| What qualifies a point of interest for registration: any gameplay value, only visited/known places, or both with visibility state? | User says POIs must be known; exact data structure unresolved. | Later |
| What discovery evidence should reveal POIs: word of mouth, maps, scrolls, pictures, history text, direct visit, or all? | User listed all; exact first implementation unresolved. | Later |
| Should ruins, lairs, dungeons, sacred sites, shrines, and event locations share one POI authority with type filters? | User leans all gameplay-value locations as POIs; exact schema unresolved. | Later |

## Family, Heirs, Adult Age, And Maturation

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| What exact adult ages should each race/culture use? | User selected data-driven race/culture variation; values unresolved. | Later |
| Should offspring stat growth be applied semi-annually, quarterly, monthly, or another cadence? | User accepts smaller increments; recommended cadence unresolved. | Later |
| Should quarter-by-quarter offspring status be the default unless day-by-day is easier? | User leans quarterly; implementation cost needs investigation. | Later |
| What RNG weighting range should both-parent stat inheritance use? | Unresolved. | Later |
| How should chronic illness integrate with existing build/status systems? | Unresolved. | Later |
| Should original character creation retain build choice, or should builds move into the heir system with Prestige unlocking original-character build choice? | User raised this as possible; unresolved. | Later |
| What exact penalty reductions should Prestige provide for illegitimate and adopted heir stat growth? | Unresolved. | Later |
| What exact orphan/adopted-heir workflow should occur after end-of-line with no adult caretakers? | User defined posture; implementation flow unresolved. | Later |
| What heir-slot rules determine whether an adult married-out offspring creates a new family? | Unresolved. | Later |

## Offspring Growth Roles And Rearing Prestige

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| Should annual growth roles be broken into semi-annual, quarterly, or monthly rates? | User says use whichever is easiest to track accurately; recommended cadence unresolved. | Later |
| What are the first growth focus categories, and how do they map onto current character-creator stat profiles? | Unresolved. | Later |
| How should zero-sum growth focus reallocations be calculated? | User wants zero-sum by default; formula unresolved. | Later |
| Should the `.05` Prestige improvement apply to focus variance, total role effect, or both? | User specified `.05` per upgrade for zero-sum adjustment; exact implementation unresolved. | Later |
| What is the standard habitual-activity definition: minimum time per day and days per week? | User requested recommended structures; unresolved. | Later |
| Should family-specific rearing Prestige use separate unlock tracks for total growth and role efficiency? | User says both, with different unlocks; exact tracks unresolved. | Later |
| If using 100 incremental upgrades, should benchmarks be 25/50/75/100 or 33/66/100? | User asks to use recommended; unresolved. | Later |
| When should percentile upgrades unlock relative to flat upgrades? | User says first tier of flat upgrades; exact tier structure unresolved. | Later |

## Recipes, Crafting, Cooking, And Bulk Preparation

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| Should recipe learning trials be required for all recipes or only non-trivial recipes? | Unresolved. | Later |
| What should recipe quality labels be for cooking versus crafting? | Unresolved. | Later |
| Should food and crafting share quality labels, or diverge by domain/culture? | Unresolved. | Later |
| Should bulk preparation be account-wide, family-specific, guild-specific, or split by recipe/craft type? | Unresolved. | Later |
| Should family recipes be visible to all family members, only household members, only apprentices, or only those with access rights? | Unresolved. | Later |
| Should a married-out heir keep personally learned family recipes by default? | Current posture says personally learned recipes can remain; exact default and exceptions unresolved. | Later |
| Should recipe inheritance preserve one recipe, multiple recipes, quality flags, or only access rights? | Unresolved. | Later |
| Should crafting trials apply to every craft or only meaningful/high-risk/high-value work? | Unresolved. | Later |

## Ecology, Agriculture, And Managed Breeding

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| Should macro flora/fauna population use exact counts, abundance bands, or hidden estimates? | Unresolved. | Later |
| Should agriculture use exact counts, abundance bands, or hidden estimates? | Unresolved. | Later |
| Which managed ecology lane should come first: livestock, crops/gardens, alchemy herbs, or another managed domain? | User says micro breeding can start later after seams; exact first domain unresolved. | Later |
| Should managed breeding support genetic/quality traits? | Only if future design supports them; unresolved. | Later |

## Magic Runtime And Catalysts

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| Which spell should be the first effectful runtime candidate? | Unresolved. | Later |
| Should catalysts be reserved, consumed, or paid only after successful resolution? | Unresolved. | Later |
| Should future magic crime/licensing tie into law, faction, religion, or separate magic authority? | Unresolved. | Later |

## UI, Journal, Map, And Relationship Display

| Question | Current recommendation / known posture | Priority |
| --- | --- | --- |
| Should the first gameplay shell present read-only state only? | Current project posture prefers read-only projection before mutation, but exact gameplay shell scope is unresolved. | Strategic |
| Which UI surface is required before the first narrow runtime loop? | Unresolved. | Strategic |
| Should knowledge, quest, map, reputation, and relationship journals share a common record-browser UI? | Unresolved. | Later |
| What are the first player-facing labels for each relationship band by relationship type? | Unresolved. | Later |
| Which NPC types can reveal relationship bands: fortune teller, institution officer, civil official, guild clerk, temple official, or others? | Unresolved. | Later |

## Questions That Do Not Need Input Before `0.5.179`

The current hotspot Knowledge subject schema/validator defaults stand:

- Add `religious_hotspot` to Knowledge subject vocabularies.
- Preserve `religion` and `deity` subject behavior.
- Validate hotspot snippet subjects against live `world.religious_hotspots` authority.
- Enforce active-only policy for live hotspot snippet references.
- Do not activate live hotspot records in `0.5.179`.
- Do not add live hotspot snippets in `0.5.179`.
- Do not add sacred sites, religious orders, favorability, alignment, law, consequence, runtime, UI, storage, reward, event, command, Magic Study, Prestige, family, or gameplay behavior in `0.5.179`.
