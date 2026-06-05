# Knowledge Framework Source Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for `Version 0.5.107 - Knowledge Domain Registry Plan`; no source, schema, content JSON, UI, generated output, or runtime behavior changes

## Purpose

Map the current repository sources that already imply knowledge domains, snippet subjects, discovery sources, and ownership boundaries before Codex creates the knowledge-domain registry plan.

This file is a source map, not the registry itself.

## Source Files Inspected

- `packages/schemas/player/knowledge_snippet.schema.json`
- `docs/future_content_backlog.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `packages/engines/civilization-engine/src/content.ts`
- `packages/content/base/player/skills.json`

## Current Knowledge-Related Assets

### Planning schema

`packages/schemas/player/knowledge_snippet.schema.json` is the current planning schema for snippet-based knowledge. It is explicitly not wired into runtime loading.

Current snippet-level concepts:

- `domainId`
- `subjectType`
- `subjectId`
- `tier`
- `category`
- `discoverySources`
- `progression`
- `visibility`
- optional prerequisites
- optional notes

Current subject types:

- `flora`
- `fauna`
- `mineral`
- `settlement`
- `region`
- `culture`
- `institution`
- `spell`
- `item`
- `ruin`
- `historical_event`
- `custom`

Current snippet categories:

- `identification`
- `habitat`
- `behavior`
- `use`
- `byproduct`
- `processing`
- `danger`
- `lookalike`
- `regional_variant`
- `seasonality`
- `trade_value`
- `ritual_use`
- `historical_context`
- `cultural_context`
- `mechanical_application`
- `custom`

Current discovery source types:

- `field_identification`
- `resource_use`
- `crafting_use`
- `combat_observation`
- `travel_observation`
- `book_study`
- `teacher_instruction`
- `institutional_study`
- `scroll_study`
- `tome_study`
- `quest_event`
- `chronicle_record`
- `custom`

### Existing skill relationship

`packages/content/base/player/skills.json` already has skills with `knowledgeDomainId` links for the initial natural-resource knowledge domains:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`

Observed examples include spotting and identify skill specializations for flora, fauna, and minerals.

The future registry should treat these as existing skill relationships, not as proof that knowledge-domain records already exist.

### Existing content interface relationship

`packages/engines/civilization-engine/src/content.ts` already defines a `KnowledgeDomainRecord` interface with older/global resource-identification-oriented fields:

- `id`
- `name`
- `domain`
- `knowledgeSkillId`
- `spottingSkillId`
- `identifySkillId`
- `generalSupportSkillId`
- `supportWeights`
- `identifyDifficulty`
- `autoIdentifyThresholds`

This is important repo reality. The 0.5.107 registry plan should decide whether this older interface is:

- retained as a legacy resource-identification domain shape,
- superseded by a broader registry shape,
- adapted later after a dedicated migration/compatibility-free current-data pass,
- or left untouched until runtime loading is scoped.

Do not refactor this interface in the registry planning pass.

## Implied Domain Sources

The repository already has content shapes that can become knowledge subjects or domain-related source collections later.

| Source area | Current repo source | Implied knowledge domains |
| --- | --- | --- |
| Natural resources | `FloraContentRecord`, `FaunaContentRecord`, `MineralContentRecord`, ecology profiles, skills with `knowledgeDomainId` | flora, fauna, minerals, ecology, habitats, biomes, climate, seasonal patterns, crafting/material processing |
| Geography and travel | regions, localities, world hexes, hex edges, travel routes, travel networks, sea routes | geography, regional geography, locality lore, routes and passes, ocean lanes, climate, biomes, habitats |
| Settlements and institutions | settlements, guilds, buildings, guild presence, magic infrastructure, religions | settlement lore, institutions, guilds, temples, academies, religion, doctrine, local economy, markets |
| Monsters and combat observation | monster content, combat hooks, spell hooks, item use profiles | monster lore, beast lore, undead lore, aberration lore, draconic lore, tactics, weapon lore, armor lore |
| Economy and production | item value profiles, material difficulty profiles, workplaces, production chains, recipes, market value records | trade goods, material processing, crafting materials, smithing materials, textiles, woodworking, leatherworking, alchemy reagents, local economy |
| Magic | spells, conduit profiles, catalyst profiles, magic infrastructure, religions | arcane lore, arcane theory, spellcraft, rituals, wards, catalysts, conduits, elemental/divine/dark/druidic lore |
| History and culture | regions, settlements, religions, guilds, future ledger vocabulary | history, cultures, customs, law, nobility, heraldry, archaeology, ancient languages, genealogy, bloodline lore, relic lore |
| Quest/Chronicle/Reputation | quest templates/definitions, reputation awards, Chronicle vocabulary | quest-event sources, Chronicle-record sources, regional recognition, historical context |

## Boundary Notes

The current design rules strongly separate knowledge from adjacent systems.

Knowledge should mean discovered understanding. It should not be inferred from:

- skill rank alone
- known-spell ownership
- magic study access
- item possession
- backstory selection
- family or bloodline state
- Chronicle visibility
- reputation/renown
- region visibility
- catalog presence
- UI state

Access creates an opportunity to discover or study. Access does not complete knowledge by itself.

Examples:

- Owning a book does not automatically grant `book_study` completion.
- Meeting a teacher does not automatically grant `teacher_instruction` completion.
- Joining an institution does not automatically grant `institutional_study` completion.
- Possessing a scroll or tome does not automatically grant spell knowledge or knowledge snippets.
- Seeing a region, creature, or resource does not automatically complete deeper tiers.
- A Chronicle record may become a future evidence/source reference but should not silently fabricate knowledge.

## Source Vocabulary Notes

The current snippet schema discovery source vocabulary is broad enough for the first registry plan, but 0.5.107 should decide whether registry-level source policy should group sources into durable families.

Possible source families:

| Family | Existing source types | Notes |
| --- | --- | --- |
| Field observation | `field_identification`, `travel_observation`, `combat_observation` | Observation should reveal or progress specific snippets only under explicit rules. |
| Practical use | `resource_use`, `crafting_use` | Use can teach handling, danger, byproduct, processing, and trade-value snippets. |
| Study | `book_study`, `scroll_study`, `tome_study` | Possession/access is not study completion. |
| Instruction | `teacher_instruction`, `institutional_study` | Teacher/institution access must remain explicit evidence, not automatic grant. |
| Event records | `quest_event`, `chronicle_record` | Should remain future integration points until owners/events exist. |
| Custom | `custom` | Useful escape hatch, but future validation should discourage overuse. |

## Gaps To Resolve In 0.5.107

### Registry shape gap

There is no current broad `knowledge_domains.json` or equivalent registry. The plan should define the registry shape before content creation.

### Domain ownership gap

The registry plan needs to decide which system owns each domain relationship:

- registry-owned stable domain metadata
- snippet-owned subject/category/progression details
- skill-owned support relationships
- runtime-owned completion/evidence state
- UI-owned presentation only

### Subject-type gap

The current subject enum covers many early subjects but not all backlog concepts cleanly.

Potential future subject-type gaps:

- route
- biome
- habitat
- climate
- market
- trade_good
- material
- production_chain
- doctrine
- law
- title_or_nobility
- tactic
- weapon_profile
- armor_profile
- disease
- anatomy
- genealogy
- relic
- sea_lane

The 0.5.107 plan should decide whether these remain `custom` for now or should be planned as future enum/schema expansions.

### Snippet-category gap

The current category enum covers the natural-resource starting point well. It may not fully cover later domains.

Potential future category gaps:

- route_condition
- access_requirement
- market_pattern
- legal_status
- doctrine
- social_protocol
- tactical_counter
- anatomy_detail
- disease_symptom
- treatment_protocol
- genealogy_line
- relic_provenance
- language_fragment
- siege_use

The 0.5.107 plan should not edit the schema, but should flag category expansion as a later schema/content-shape pass.

### Existing legacy interface gap

`KnowledgeDomainRecord` in `civilization-engine/src/content.ts` is narrower than the planned knowledge-domain registry. It is skill/support/difficulty oriented and does not model snippet categories, discovery sources, source families, or visibility/completion policies.

0.5.107 should explicitly avoid runtime/interface refactors and instead record a future decision point.

### Validation gap

Future validation should eventually protect:

- canonical id format: `knowledge_domain.<slug>`
- duplicate ids
- known wave/category values
- supported subject types per domain
- supported discovery source families per domain
- relationship to valid skill ids where declared
- relationship to valid magic schools or content collections where declared
- no automatic completion from access-only sources
- no registry field that implies runtime state mutation

## Recommended 0.5.107 Inputs

Codex should use this file alongside:

- `packages/schemas/player/knowledge_snippet.schema.json`
- `docs/future_content_backlog.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`

## Recommended Next Connector Work

After this source map, the most useful additional connector prep would be:

1. Domain backlog normalization table.
2. Discovery source vocabulary table.
3. Knowledge boundary glossary.
4. Registry-field ownership table.

Do not perform those as part of this source-map pass unless explicitly requested.

## Recommended Next Codex Step

Proceed with:

- `Version 0.5.107 - Knowledge Domain Registry Plan`

That run should create the actual registry plan and decide whether the following run should be:

- `Version 0.5.108 - Knowledge Domain Registry Content Shape`
- `Version 0.5.108 - Knowledge Domain Registry Schema Plan`
- `Version 0.5.108 - Knowledge Domain Validation Plan`
