# Knowledge Domain Backlog Normalization

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for `Version 0.5.107 - Knowledge Domain Registry Plan`; no source, schema, content JSON, UI, generated output, or runtime behavior changes

## Purpose

Normalize the knowledge-domain backlog into a registry-planning table before Codex creates the durable knowledge-domain registry plan.

This document does not create live registry content. It is a planning aid for grouping, wave order, likely subject types, likely source families, current content relationships, and schema-gap notes.

## Source Basis

Primary sources:

- `docs/future_content_backlog.md`
- `docs/design/knowledge-framework-source-map.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/engines/civilization-engine/src/content.ts`
- `packages/content/base/player/skills.json`

## Wave Definitions

| Wave | Meaning | Registry posture |
| --- | --- | --- |
| Wave 0 | Existing/current domains to retain and formalize. | Should be first-class registry records in the first registry/content-shape pass. |
| Wave 1 | Foundation domains from the high-priority backlog. | Should be planned in the first registry shape, even if live records/content wait. |
| Wave 2 | Runtime-readiness domains that connect to travel, economy, institutions, medicine, magic, religion, and weapons. | Should be validated as future-safe domain ids but may remain inactive/draft. |
| Wave 3 | Expansion domains for advanced world, culture, magic, history, medicine, materials, and military knowledge. | Should remain planned/deferred unless a later content pass explicitly scopes them. |

## Domain Groups

Use these groups for early registry planning:

- `natural_world`
- `geography_travel`
- `settlement_society`
- `monster_combat`
- `economy_materials`
- `medicine_body`
- `magic_arcana`
- `religion_myth`
- `history_culture`
- `military_tactics`
- `general`

## Normalized Domain Table

| Domain id | Wave | Group | Likely subject types | Likely source families | Current content relationships | Schema-gap notes |
| --- | --- | --- | --- | --- | --- | --- |
| `knowledge_domain.flora` | 0 | natural_world | `flora`, `region`, `item` | field observation, practical use, study, instruction | Skills already reference this domain through spotting/identify flora; flora records and habitat/ecology profiles exist. | Good fit for current schema. |
| `knowledge_domain.fauna` | 0 | natural_world | `fauna`, `region`, `item` | field observation, combat observation, practical use, study, instruction | Skills already reference this domain through spotting/identify fauna; fauna records and habitat/ecology profiles exist. | Good fit for current schema. |
| `knowledge_domain.minerals` | 0 | natural_world | `mineral`, `region`, `item` | field observation, resource use, crafting use, study, instruction | Skills already reference this domain through spotting/identify minerals; mineral records and deposit/extraction data exist. | Good fit for current schema. |
| `knowledge_domain.arcane_lore` | 0 | magic_arcana | `spell`, `item`, `institution`, `custom` | study, instruction, event records | Spell, conduit, catalyst, magic infrastructure, and religion content exist. | Later schema may need `magic_school`, `conduit`, `catalyst`, or `ritual` subject types. |
| `knowledge_domain.general_lore` | 0 | general | `custom`, `historical_event`, `culture`, `region` | study, instruction, quest event, Chronicle record | Durable ledger uses broad Knowledge vocabulary. | Should remain broad catch-all; avoid overuse where a specific domain exists. |
| `knowledge_domain.ecology` | 1 | natural_world | `flora`, `fauna`, `mineral`, `region` | field observation, travel observation, study | Regional ecology and resource ecology profiles exist. | Good fit, but may need domain relationships to biome/habitat. |
| `knowledge_domain.geography` | 1 | geography_travel | `region`, `settlement`, `custom` | travel observation, study, quest event, Chronicle record | Region, world map, world hex, locality, edge, and route records exist. | Later schema may need `route`, `hex`, or `map` subject types. |
| `knowledge_domain.settlement_lore` | 1 | settlement_society | `settlement`, `institution`, `culture` | travel observation, study, instruction, quest event | Settlement records include economy, survival, trade, guild presence, and infrastructure. | Good fit; may need `building` subject type later. |
| `knowledge_domain.monster_lore` | 1 | monster_combat | `fauna`, `custom`, `item` | combat observation, field observation, study, instruction | Monster records include class, threat, habitat, behavior, drops, and loot. | Later schema may need `monster` subject type instead of `custom` or `fauna`. |
| `knowledge_domain.trade_goods` | 1 | economy_materials | `item`, `settlement`, `region` | resource use, crafting use, travel observation, study | Items, markets, settlement domestic resource profiles, and trade flows exist. | Good fit, but later `trade_good` subject type may help. |
| `knowledge_domain.material_processing` | 1 | economy_materials | `item`, `mineral`, `flora`, `fauna` | crafting use, resource use, study, instruction | Item value profiles, material difficulty profiles, recipes, workplaces, production chains exist. | Later `production_chain` or `material` subject types may help. |
| `knowledge_domain.medicine` | 1 | medicine_body | `flora`, `fauna`, `item`, `custom` | field observation, resource use, study, instruction, quest event | Body-state and study-event planning references medicine/anatomy support. | Later `disease`, `injury`, or `body_system` subject types may help. |
| `knowledge_domain.arcane_theory` | 1 | magic_arcana | `spell`, `institution`, `item`, `custom` | book study, scroll/tome study, teacher/institution study | Magic study planning references arcane knowledge support; spells and magic infrastructure exist. | Later `magic_school` and `theory_principle` subject types may help. |
| `knowledge_domain.catalysts` | 1 | magic_arcana | `item`, `spell`, `custom` | resource use, crafting use, study, instruction | Catalyst profile types and crystal catalog records exist. | Later `catalyst` subject type may help. |
| `knowledge_domain.conduits` | 1 | magic_arcana | `item`, `spell`, `custom` | resource use, crafting use, study, instruction | Conduit profile types and item conduit profiles exist. | Later `conduit` subject type may help. |
| `knowledge_domain.institutions` | 1 | settlement_society | `institution`, `settlement`, `culture` | institutional study, teacher instruction, travel observation, quest event | Guild, religion organization, magic infrastructure, and settlement records exist. | Good fit. |
| `knowledge_domain.cultures` | 1 | history_culture | `culture`, `settlement`, `region`, `historical_event` | travel observation, study, instruction, Chronicle record | Culture is a current subject type; broader authored culture records are not clearly live yet. | May remain registry-only until culture content exists. |
| `knowledge_domain.history` | 1 | history_culture | `historical_event`, `ruin`, `region`, `culture` | book study, travel observation, quest event, Chronicle record | `historical_event` and `ruin` are current subject types; Chronicle vocabulary exists. | Good fit, but live subject records may be sparse. |
| `knowledge_domain.tactics` | 1 | military_tactics | `custom`, `item`, `spell` | combat observation, study, instruction | Combat hooks, abilities, skills, spells, and item use profiles exist. | Later `tactic` subject type may help. |
| `knowledge_domain.regional_geography` | 2 | geography_travel | `region`, `settlement`, `custom` | travel observation, study, quest event | Region profiles and locality/hex records exist. | Later `map` or `hex` subject type may help. |
| `knowledge_domain.routes_and_passes` | 2 | geography_travel | `region`, `settlement`, `custom` | travel observation, study, quest event | Route, edge, barrier, pass, and travel network records exist. | Strong candidate for future `route` subject type. |
| `knowledge_domain.locality_lore` | 2 | geography_travel | `region`, `settlement`, `custom` | travel observation, field observation, study | Region locality records exist. | Later `locality` subject type may help. |
| `knowledge_domain.biomes` | 2 | natural_world | `region`, `flora`, `fauna`, `custom` | field observation, travel observation, study | Biome and ecology records exist. | Strong candidate for future `biome` subject type. |
| `knowledge_domain.habitats` | 2 | natural_world | `flora`, `fauna`, `region`, `custom` | field observation, travel observation, study | Habitat records and flora/fauna habitat links exist. | Strong candidate for future `habitat` subject type. |
| `knowledge_domain.climate` | 2 | geography_travel | `region`, `custom` | travel observation, study, Chronicle record | Region environment profiles, biome climate bands, and climate popup planning exist. | Strong candidate for future `climate` subject type. |
| `knowledge_domain.seasonal_patterns` | 2 | natural_world | `flora`, `fauna`, `region`, `custom` | field observation, travel observation, study | Snippet category `seasonality` already exists. | Good fit; may need seasonal calendar subject later. |
| `knowledge_domain.guilds` | 2 | settlement_society | `institution`, `settlement`, `culture` | institutional study, teacher instruction, quest event | Guild content and settlement guild presence exist. | Good fit. |
| `knowledge_domain.orders` | 2 | settlement_society | `institution`, `culture`, `historical_event` | institutional study, teacher instruction, study | Religion organizations and institutions imply orders. | Good fit if authored institution ids exist. |
| `knowledge_domain.temples` | 2 | religion_myth | `institution`, `settlement`, `culture` | institutional study, teacher instruction, travel observation | Religion structure types exist. | Good fit; may need building/structure subject later. |
| `knowledge_domain.academies` | 2 | settlement_society | `institution`, `settlement`, `spell` | institutional study, teacher instruction, book/tome study | Magic infrastructure and institution/guild concepts exist. | Good fit; live academy content may be sparse. |
| `knowledge_domain.markets` | 2 | economy_materials | `settlement`, `item`, `institution` | travel observation, study, quest event | Market tiers, market value records, settlement economy data exist. | Later `market` subject type may help. |
| `knowledge_domain.local_economy` | 2 | economy_materials | `settlement`, `region`, `item` | travel observation, study, quest event | Settlement economic model, domestic trade flows, regional economy profiles exist. | Good fit. |
| `knowledge_domain.caravan_routes` | 2 | geography_travel | `region`, `settlement`, `custom` | travel observation, quest event, study | Travel route records include route class/type and available modes. | Future `route` subject type likely. |
| `knowledge_domain.crafting_materials` | 2 | economy_materials | `item`, `flora`, `fauna`, `mineral` | crafting use, resource use, study | Item processing/material profiles and resource records exist. | Good fit. |
| `knowledge_domain.anatomy` | 2 | medicine_body | `fauna`, `custom` | field observation, combat observation, study, instruction | Medicine planning references anatomy support. | Future `anatomy` or `body_system` subject type may help. |
| `knowledge_domain.herbalism` | 2 | medicine_body | `flora`, `item` | field observation, resource use, crafting use, study | Flora records and consumable profiles exist. | Good fit. |
| `knowledge_domain.toxicology` | 2 | medicine_body | `flora`, `fauna`, `item` | field observation, combat observation, study, resource use | Danger and use snippet categories exist. | Later `condition`/`poison` subject may help. |
| `knowledge_domain.spellcraft` | 2 | magic_arcana | `spell`, `item`, `institution` | book/scroll/tome study, teacher/institution study | Spell records and magic study planning exist. | Good fit. |
| `knowledge_domain.rituals` | 2 | magic_arcana | `spell`, `institution`, `historical_event`, `custom` | supervised ritual, study, instruction | Magic study planning includes supervised ritual source mode. | Current snippet schema has `ritual_use`, but no `supervised_ritual` discovery source; consider later. |
| `knowledge_domain.wards` | 2 | magic_arcana | `spell`, `item`, `institution` | study, instruction, field observation | Warding appears in study examples. | Good fit. |
| `knowledge_domain.religion` | 2 | religion_myth | `culture`, `institution`, `historical_event` | institutional study, teacher instruction, study, travel observation | Religion content records exist. | Good fit. |
| `knowledge_domain.doctrine` | 2 | religion_myth | `culture`, `institution`, `historical_event` | study, instruction, institutional study | Religion organizations/deities exist. | Later `doctrine` category/subject may help. |
| `knowledge_domain.myth` | 2 | religion_myth | `historical_event`, `culture`, `custom` | study, instruction, Chronicle record | Religion and historical vocabulary exist. | Good fit. |
| `knowledge_domain.weapon_lore` | 2 | military_tactics | `item`, `custom` | combat observation, crafting use, study, instruction | Item use profiles, combat hooks, skills exist. | Future `weapon_profile` subject type may help. |
| `knowledge_domain.armor_lore` | 2 | military_tactics | `item`, `custom` | combat observation, crafting use, study, instruction | Item use profiles and material profiles exist. | Future `armor_profile` subject type may help. |
| `knowledge_domain.ocean_lanes` | 3 | geography_travel | `region`, `custom`, `settlement` | travel observation, study, quest event | Inter-port ship routes and sea region ids exist. | Future `sea_lane` or `route` subject type likely. |
| `knowledge_domain.beast_lore` | 3 | monster_combat | `fauna`, `custom` | field observation, combat observation, study | Monster/fauna records exist. | Could be subdomain of monster/fauna; decide later. |
| `knowledge_domain.undead_lore` | 3 | monster_combat | `custom`, `historical_event`, `spell` | combat observation, study, instruction | Monster class may support undead. | Future `monster` subject type likely. |
| `knowledge_domain.aberration_lore` | 3 | monster_combat | `custom`, `spell` | combat observation, study, instruction | Monster class may support aberrations. | Future `monster` subject type likely. |
| `knowledge_domain.draconic_lore` | 3 | monster_combat | `custom`, `historical_event`, `culture` | combat observation, study, instruction | Monster class/culture/history may support it later. | Future `monster` or `creature_type` subject type likely. |
| `knowledge_domain.customs` | 3 | history_culture | `culture`, `settlement`, `institution` | travel observation, study, instruction | Culture subject exists; live records unclear. | Good fit once culture records exist. |
| `knowledge_domain.law` | 3 | settlement_society | `culture`, `settlement`, `institution` | study, instruction, quest event | Reputation/notoriety fields and settlement institutions imply legal systems. | Future `law` or `legal_code` subject/category may help. |
| `knowledge_domain.nobility` | 3 | settlement_society | `culture`, `institution`, `historical_event` | study, instruction, Chronicle record | Future estate/title/status systems implied by ledger. | Future `title_or_nobility` subject type may help. |
| `knowledge_domain.local_politics` | 3 | settlement_society | `settlement`, `institution`, `culture` | travel observation, quest event, study | Settlement administration and reputation systems exist. | Good fit. |
| `knowledge_domain.heraldry` | 3 | history_culture | `culture`, `institution`, `item` | study, instruction, travel observation | Future nobility/family systems imply heraldry. | Future emblem/title subject may help. |
| `knowledge_domain.underworld` | 3 | settlement_society | `institution`, `settlement`, `culture` | quest event, travel observation, teacher instruction | Notoriety categories and settlement/guild structures imply underworld. | Good fit but future owner/content unclear. |
| `knowledge_domain.smithing_materials` | 3 | economy_materials | `item`, `mineral` | crafting use, resource use, study | Material difficulty profiles include metal; recipes/production chains exist. | Good fit. |
| `knowledge_domain.alchemy_reagents` | 3 | economy_materials | `item`, `flora`, `fauna`, `mineral` | resource use, crafting use, study | Herbs/reagents coverage and consumables exist. | Good fit. |
| `knowledge_domain.textiles` | 3 | economy_materials | `item`, `flora`, `fauna` | crafting use, resource use, study | Material difficulty profiles include textile. | Good fit. |
| `knowledge_domain.woodworking_materials` | 3 | economy_materials | `item`, `flora` | crafting use, resource use, study | Material difficulty profiles include wood. | Good fit. |
| `knowledge_domain.leatherworking_materials` | 3 | economy_materials | `item`, `fauna` | crafting use, resource use, study | Material difficulty profiles include leather. | Good fit. |
| `knowledge_domain.disease` | 3 | medicine_body | `custom`, `fauna`, `flora` | field observation, study, instruction, quest event | Body-state planning exists, but disease records not clearly live. | Future `disease` subject type likely. |
| `knowledge_domain.field_surgery` | 3 | medicine_body | `custom`, `fauna`, `item` | teacher instruction, study, combat observation | Medicine and body-state planning imply it. | Future treatment/procedure subject/category likely. |
| `knowledge_domain.elemental_lore` | 3 | magic_arcana | `spell`, `item`, `culture` | study, instruction, field observation | Spell elements and religion elements exist. | Good fit. |
| `knowledge_domain.divine_lore` | 3 | magic_arcana | `spell`, `institution`, `culture` | institutional study, teacher instruction, study | Religion content and divine study examples exist. | Good fit. |
| `knowledge_domain.dark_lore` | 3 | magic_arcana | `spell`, `historical_event`, `custom` | study, instruction, quest event | Dark/forbidden study examples exist. | Good fit. |
| `knowledge_domain.druidic_lore` | 3 | magic_arcana | `flora`, `fauna`, `region`, `spell` | field observation, study, instruction | Natural-world and magic overlap. | Good fit. |
| `knowledge_domain.saints_and_relics` | 3 | religion_myth | `historical_event`, `item`, `institution` | study, instruction, Chronicle record | Religion and relic/future item identity systems imply it. | Future `relic` subject type likely. |
| `knowledge_domain.cults` | 3 | religion_myth | `institution`, `culture`, `historical_event` | quest event, study, instruction | Religion organizations include cult/order-like possibilities. | Good fit. |
| `knowledge_domain.archaeology` | 3 | history_culture | `ruin`, `historical_event`, `item`, `region` | travel observation, study, quest event | `ruin` and `historical_event` subject types exist. | Good fit. |
| `knowledge_domain.ancient_languages` | 3 | history_culture | `custom`, `ruin`, `historical_event` | study, instruction, travel observation | No clear language subject records yet. | Future `language` subject/category likely. |
| `knowledge_domain.genealogy` | 3 | history_culture | `historical_event`, `culture`, `custom` | study, Chronicle record, instruction | Bloodlines/family ledger vocabulary exists. | Future `family` or `genealogy_line` subject likely. |
| `knowledge_domain.bloodline_lore` | 3 | history_culture | `historical_event`, `culture`, `custom` | Chronicle record, study, instruction | Bloodlines vocabulary exists, but knowledge must not fabricate family history. | Must guard against automatic family-history grants. |
| `knowledge_domain.relic_lore` | 3 | history_culture | `item`, `ruin`, `historical_event` | study, travel observation, quest event, Chronicle record | Heirloom/relic vocabulary and item records exist. | Future `relic` subject type likely. |
| `knowledge_domain.siegecraft` | 3 | military_tactics | `item`, `settlement`, `custom` | study, instruction, combat observation | Combat and settlement fortification records exist. | Future `siege_engine` or `tactic` subject type may help. |
| `knowledge_domain.military_orders` | 3 | military_tactics | `institution`, `culture`, `historical_event` | institutional study, teacher instruction, quest event | Institution/guild/order structures imply it. | Good fit. |

## Registry Planning Notes

### First registry should include stable wave/group fields

The first registry shape should probably include:

- `id`
- `name`
- `group`
- `wave`
- `status`
- `summary`
- `canonicalSubjectTypes`
- `supportedDiscoverySourceFamilies`
- `relatedContentCollections`
- `relatedSkillIds`
- `schemaGapNotes`

### Subject and category gaps should not block 0.5.107

The current snippet schema has a `custom` escape hatch. The registry plan can record future enum expansion without changing schemas or content in 0.5.107.

### Avoid automatic knowledge grants

Every domain should inherit the same boundary:

- access can create opportunity
- observation can create evidence only when scoped
- possession does not complete knowledge
- skill rank can support checks but does not auto-complete knowledge
- Chronicle/reputation can reference events but must not fabricate knowledge

## Recommended 0.5.107 Use

Codex should use this normalization table to avoid re-deriving waves and groups from the backlog. It should still make the official registry plan in:

- `docs/design/knowledge-domain-registry-plan.md`

## Recommended Next Connector Work

The next connector-only prep pass should be one of:

1. `Discovery Source Vocabulary Audit`
2. `Knowledge Boundary Glossary`
3. `Registry Field Ownership Table`

Preferred next pass:

- `Discovery Source Vocabulary Audit`

Rationale: the registry plan needs clear source-family vocabulary before deciding validation policy.
