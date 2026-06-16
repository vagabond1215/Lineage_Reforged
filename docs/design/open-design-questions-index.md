# Open Design Questions Index

Source route: ChatGPT via GitHub Connector  
Date: 2026-06-16  
Status: connector-side durable question index; documentation only; not an implementation handoff

## Purpose

This index consolidates user-facing design questions that are currently open across recent planning documents. It is meant to prevent unresolved decisions from being lost while keeping the active Codex pipeline narrow.

This file is not:

- runtime authority;
- content JSON;
- schema authority;
- a backlog replacement;
- a current implementation handoff;
- permission to broaden a narrow Codex prompt.

Use it when future planning requires user preference, especially before implementing systems that would otherwise force assumptions about survival, builder, MMO, religion, family, inheritance, crafting, ecology, or UI direction.

## Current Pipeline Context

Current active lane:

1. `Version 0.5.176 - Religious Hotspot Content Authority Seed Plan` is complete.
2. `Version 0.5.177 - Religious Hotspot Content Authority Seed` remains the next recommended Codex run.
3. This index does not renumber or interrupt that pipeline.
4. The current seed plan already gives safe defaults for `0.5.177`; user input is only required before `0.5.177` if the user wants to override those defaults.

## Decision Priority Legend

| Priority | Meaning |
| --- | --- |
| Immediate override only | The current plan has a safe recommendation; answer only if changing the next run. |
| Soon | Likely needed in the next few planning/implementation runs. |
| Later | Can wait until the relevant system lane is selected. |
| Strategic | Broad product direction; answer before major runtime/MMO/vertical-slice planning. |

## Immediate Religious Hotspot Questions

These questions relate to the active `world.religious_hotspots` lane.

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Should the first live hotspot seed include one record or two? | Seed exactly two `planned` records if both validate: `religious_hotspot.glasswake_shrine_lantern_gardens` and `religious_hotspot.lantern_shrine_gardens`; fall back to only the Glasswake Shrine record if locality-scale authority becomes ambiguous. | Immediate override only |
| Is `religion.elemental_pantheon` sufficiently explicit for both first hotspot records? | Yes, as a planned authored relationship only, not as an existing place-authored dominant faith. | Immediate override only |
| Is `deity.light_lady` sufficiently explicit for either first hotspot record? | No. Omit `deityIds` until place authority proves a specific deity affiliation. | Immediate override only |
| Should first seed records include `dominantFaithIds`? | No. Omit while records remain `planned`; add only when records become active or source authority supports it. | Immediate override only |
| Should `settlement.glasswake_shrine` and `region_locality.lantern_shrine_gardens` be separate hotspot records? | Keep both only if future snippets need settlement-scale and locality-scale context; otherwise use only the stronger Glasswake Shrine record. | Soon |
| Should first seed implementation add new focused tests for live content, or rely on normal lint registration and existing validator tests? | Rely on normal lint first; add focused tests only for registration or live-fixture failure modes. | Immediate override only |
| Should hotspot records become `active` before direct `religious_hotspot` Knowledge subject support exists? | No. Keep first records `planned`; wait until subject support and snippet reference validation exist. | Immediate override only |
| Should `religiousOrderIds` be added through a nested-order resolver soon, or stay deferred? | Stay deferred unless a future prompt explicitly scopes nested-order authority. | Soon |
| Should `world.sacred_sites` split from `world.religious_hotspots` later for relics, routes, maps, services, and pilgrimage inventory? | Defer until richer sacred-site inventory is needed. | Later |
| Should Religious Favorability And Elemental Alignment come after hotspot seed content or after hotspot Knowledge snippets? | Keep optional after the hotspot authority lane unless explicitly prioritized as design-only work. | Soon |

## Religion, Favorability, And Alignment Questions

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Should religious favorability be prioritized before or after hotspot content authority? | Current lane keeps it after hotspot authority unless explicitly redirected. | Soon |
| Should reputation/favorability use one scoped relationship ledger or separate ledgers per system? | Unresolved. | Later |
| Should favorability use numeric scores with display bands, or display bands only? | Unresolved. | Later |
| Which actions should create irreversible debt rather than ordinary score loss? | Unresolved. | Later |
| Which standings can decay, and which require checkpoints/trials to preserve? | Unresolved. | Later |
| Should spell penalties from religion/favorability ever affect all magic or only divine/druidic/elemental lanes? | Unresolved; do not implement until a dedicated plan. | Later |
| Should religious orders become direct subjects before sacred places? | Unresolved. | Later |
| Should rites and holy days be global religion records or local variants? | Unresolved. | Later |
| Should conversion/apostasy be modeled as relationship state, legal status, religious state, or backstory path? | Unresolved. | Later |
| Which religion/element/doctrine knowledge concepts should be seeded next after the current hotspot lane? | Unresolved. | Later |
| Should religious hotspots be recorded under Ecology, Culture, Religion, Settlement Lore, or multiple domains? | Current lane uses dedicated `world.religious_hotspots` content authority before Knowledge subject support; broader domain placement remains unresolved. | Later |

## Survival / Builder / RPG / MMO Strategic Questions

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Is the first intended playable slice single-player/local, co-op/private server, or MMO-authoritative? | Unresolved. | Strategic |
| Should survival state use exact meters, descriptive bands, or mostly hidden values? | Unresolved. | Strategic |
| Should the first builder scope be camp, homestead, family estate, village, or larger settlement? | Unresolved. | Strategic |
| Should inventory be stack-first, item-instance-first, or hybrid from the start? | Unresolved. | Strategic |
| Should NPC population start as authored named records, generated persistent records, or role placeholders? | Unresolved. | Strategic |
| Should factions, guilds, institutions, and religious orders share one schema family? | Unresolved. | Strategic |
| Should law be settlement-owned, regional, kingdom-level, religious, factional, or layered? | Unresolved. | Strategic |
| Should quests be authored, generated from contracts/work orders, or hybrid? | Unresolved. | Strategic |
| Should travel be route-based abstraction first or step-by-step map movement? | Unresolved. | Strategic |
| Should ruins, lairs, dungeons, and sacred sites share one point-of-interest authority? | Unresolved. | Strategic |
| Should player-to-player trade be deferred until item provenance and transaction logs exist? | Current safety posture implies yes, but the MMO timeline is unresolved. | Strategic |
| Which UI surface is required before the first narrow runtime loop? | Unresolved. | Strategic |

## Family, Heirs, Adult Age, And Maturation Questions

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Should early adult-age rules use one default adult age, or data-driven race/culture variation immediately? | Use a single default unless variation is actually needed by current content; exact value unresolved. | Later |
| Should offspring maturation step by year, birthday tick, season/year abstraction, level, or another time step? | Unresolved. | Later |
| Should offspring stat inheritance use active parent only, both parents, weighted parents, or another evidence model? | Current notes emphasize active parent stats at birth; broader parent-source model unresolved. | Later |
| Should family-specific rearing Prestige apply to all offspring or selected offspring only? | Unresolved. | Later |
| Should illegitimate/adopted heirs receive the same rearing bonuses? | Unresolved. | Later |
| Should war, poverty, travel, illness, estate instability, or similar conditions reduce rearing benefits? | Unresolved. | Later |
| How many flat rearing-upgrade tiers should exist before percentage scaling starts? | Unresolved. | Later |
| What cost curve should active-parent rearing Prestige use? | Unresolved. | Later |
| What should the percentage rearing-scaling cap be? | Unresolved. | Later |
| If an offspring is orphaned with high estate value, who should become default caretaker? | Current hierarchy exists, but exact high-estate caretaker handling remains future owner work. | Later |
| Should married-out offspring remain eligible for heir creation by exception, or remain ineligible by default? | Default is ineligible unless later exception; exact exceptions unresolved. | Later |

## Offspring Growth Role Questions

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Should offspring yearly growth roles be player-selected, inferred from environment, event-assigned, or mixed? | Unresolved. | Later |
| Should each year have one primary growth role, or primary plus secondary? | Unresolved. | Later |
| Should family-specific rearing Prestige increase total growth, improve role efficiency, or both? | Unresolved. | Later |
| What source evidence proves an offspring activity is habitual enough to count? | Unresolved. | Later |
| What minimum duration should a growth role require? | Unresolved. | Later |
| What opportunity costs or caps should growth roles carry? | Unresolved. | Later |
| How should growth roles interact with legitimate, illegitimate, adopted, ward, orphan, and married-off statuses? | Unresolved. | Later |

## Recipes, Crafting, Cooking, And Bulk Preparation Questions

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Should recipe learning trials be required for all recipes or only non-trivial recipes? | Unresolved. | Later |
| What should recipe quality labels be for cooking versus crafting? | Unresolved. | Later |
| Should food and crafting share quality labels, or diverge by domain/culture? | Unresolved. | Later |
| Should bulk preparation be account-wide, family-specific, guild-specific, or split by recipe/craft type? | Unresolved. | Later |
| Should family recipes be visible to all family members, only household members, only apprentices, or only those with access rights? | Unresolved. | Later |
| Should a married-out heir keep personally learned family recipes by default? | Current posture says personally learned recipes can remain; exact default and exceptions unresolved. | Later |
| Should recipe inheritance preserve one recipe, multiple recipes, quality flags, or only access rights? | Unresolved. | Later |
| Should crafting trials apply to every craft or only meaningful/high-risk/high-value work? | Unresolved. | Later |

## Ecology, Agriculture, And Managed Breeding Questions

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Should macro flora/fauna population use exact counts, abundance bands, or hidden estimates? | Unresolved. | Later |
| Should agriculture use exact counts, abundance bands, or hidden estimates? | Unresolved. | Later |
| Should micro breeding start with livestock, crops/gardens, alchemy herbs, or remain fully deferred until estate systems? | Current guardrail defers micro breeding until estate, workplace, ownership, storage, and economy seams exist; starting domain unresolved. | Later |
| Should managed breeding support genetic/quality traits? | Only if future design supports them; unresolved. | Later |
| Which managed ecology lane should come first: farms, ranches, gardens, orchards, kennels, stables, apiaries, breeding pens, alchemy gardens, herb plots, or rare beasts? | Unresolved. | Later |

## Magic Runtime And Catalyst Questions

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Which spell should be the first effectful runtime candidate? | Unresolved. | Later |
| Should catalysts be reserved, consumed, or paid only after successful resolution? | Unresolved. | Later |
| Should future magic crime/licensing tie into law, faction, religion, or separate magic authority? | Unresolved. | Later |

## UI / Journal / Map Questions

| Question | Current recommendation | Priority |
| --- | --- | --- |
| Should the first gameplay shell present read-only state only? | Current project posture prefers read-only projection before mutation, but exact gameplay shell scope is unresolved. | Strategic |
| Which UI surface is required before the first narrow runtime loop? | Unresolved. | Strategic |
| Should knowledge, quest, map, and reputation journals share a common record-browser UI? | Unresolved. | Later |

## Questions That Do Not Need Immediate User Input Before `0.5.177`

The following have safe current defaults for the immediate next Codex run:

- Seed two planned hotspot records if both validate.
- Omit `deityIds`.
- Omit `dominantFaithIds` while records are planned.
- Omit `toleratedFaithIds`.
- Omit `restrictedFaithIds`.
- Omit `religiousOrderIds`.
- Keep both seed records `planned`, not `active`.
- Do not add Knowledge subject support or snippets in `0.5.177`.
- Do not add favorability/alignment/law/consequence/runtime behavior in `0.5.177`.

User input is only needed before `0.5.177` if one of these defaults should change.
