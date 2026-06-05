# Future Content Backlog

This file tracks content and systems that are intentionally deferred.

## Update Policy

- Review this file alongside `README.md` before substantial Codex command runs or content edits so deferred intent is considered up front.
- Update this file on every Codex run that adds, defers, narrows, or re-scopes future content.
- Add new backlog items as soon as they are deferred.
- Revise prerequisites and implementation notes when the plan changes.
- Remove items only when the underlying content and wiring are actually implemented.

## Run Notes

- 2026-06-05: Completed the read-only Spell Hook Classification Audit for `Version 0.5.104`. Browser-safe hook support constants cleanup, exact parity/subset and readiness-precedence tests, a pure six-class hook support projection helper, legacy combat spell-staging ownership, multi-effect spell resolution, status-approximation review, executable hook-owner planning, active casting, hook execution, target resolution, runtime events, and resource/catalyst/inventory mutation remain deferred.
- 2026-06-05: Added the planning-only Spell Hook Support Expansion Plan for `Version 0.5.103`. Hook classification audit, hook support constants cleanup, a pure hook support projection helper, executable hook-owner plans, active casting, target resolution, effect execution, runtime events, resource/catalyst/inventory mutation, Chronicle/Renown/quest outputs, knowledge snippet runtime behavior, skill trial runtime behavior, magic study runtime behavior, and teacher/institution/scroll/tome/document acquisition routes remain deferred.
- 2026-06-04: Added the pure Magic Resolver Inert Envelope Helper for `Version 0.5.102`. Active runtime cast resolver implementation, emitted events, command handlers, UI dispatch, target resolution, spell effect application, resource payment, catalyst consumption/reservation, inventory mutation, combat/Chronicle/quest/account/save/UI event creation, save/account/session schema changes, control/failure/backlash behavior, knowledge snippet runtime behavior, skill trial runtime behavior, magic study event runtime behavior, scroll/tome/document/teacher/institution/family/Legacy acquisition routes, broader owner scopes, and `PlayerSpellState[]` replacement remain deferred.
- 2026-06-04: Added the planning-only Magic Resolver Planned Output Envelope Plan for `Version 0.5.101`. The future pure inert envelope helper, active runtime cast resolver implementation, emitted events, command handlers, UI dispatch, target resolution, effect application, resource payment, catalyst consumption/reservation, inventory mutation, combat/Chronicle/quest/account/save/UI event creation, save/account/session schema changes, control/failure/backlash behavior, knowledge snippet runtime behavior, skill trial runtime behavior, magic study event runtime behavior, scroll/tome/document/teacher/institution/family/Legacy acquisition routes, broader owner scopes, and `PlayerSpellState[]` replacement remain deferred.
- 2026-06-04: Added snippet-based knowledge domain backlog after creating the planning-only `packages/schemas/player/knowledge_snippet.schema.json`. The schema is not wired into runtime content loading. Knowledge snippets, domain completion, knowledge trials, book/teacher/institution discovery, travel-gated knowledge, Chronicle/Renown outputs, and UI remain deferred.
- 2026-06-04: Added the pure Runtime Cast Resolver Readiness Helper for `Version 0.5.100`. Active runtime cast resolver implementation, planned output envelope implementation, command handlers, UI dispatch, effect application, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, combat/Chronicle/quest/account/save/UI event creation, save/account/session schema changes, control/failure/backlash behavior, scroll/tome/document teaching, broader acquisition routes, broader owner scopes, and `PlayerSpellState[]` replacement remain deferred.

## Knowledge Systems

### Snippet-based knowledge domains

- Status: deferred
- Source planning: `packages/schemas/player/knowledge_snippet.schema.json` and `docs/design/skill-mastery-trial-framework-plan.md`
- Prerequisite: knowledge-domain registry/content plan, knowledge snippet content, pure completion/progression helpers, and later trial/checkpoint integration
- Intended owner: player progression/knowledge content, future codex/map/resource UI, travel/exploration systems, economy/material systems, magic study systems, and Chronicle/Renown projection layers
- Intended implementation:
  - use snippet-based knowledge rather than whole-record-only discovery
  - track domain/tier completion from authored snippets such as identification, habitat, use, byproduct, processing, danger, lookalike, regional variant, ritual use, historical context, and cultural context
  - allow snippets to come from field identification, resource use, crafting use, combat observation, travel observation, book study, teacher instruction, institutional study, scroll/tome study, quest events, and Chronicle records
  - keep book, scroll, tome, teacher, institution, and travel access as study/discovery sources only; possession or access must not automatically grant knowledge
  - use knowledge trials to unlock deeper tiers when enough tier completion is reached
  - keep knowledge distinct from skills and magic: skills represent action capability, magic study represents spell acquisition, knowledge represents discovered understanding

#### Canonical domain backlog

Initial/current domains to retain and formalize:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.arcane_lore`
- `knowledge_domain.general_lore`

High-priority missing domains for the first registry pass:

- `knowledge_domain.ecology`
- `knowledge_domain.geography`
- `knowledge_domain.settlement_lore`
- `knowledge_domain.monster_lore`
- `knowledge_domain.trade_goods`
- `knowledge_domain.material_processing`
- `knowledge_domain.medicine`
- `knowledge_domain.arcane_theory`
- `knowledge_domain.catalysts`
- `knowledge_domain.conduits`
- `knowledge_domain.institutions`
- `knowledge_domain.cultures`
- `knowledge_domain.history`
- `knowledge_domain.tactics`

Full candidate backlog for later domain expansion:

- `knowledge_domain.regional_geography`
- `knowledge_domain.routes_and_passes`
- `knowledge_domain.ocean_lanes`
- `knowledge_domain.locality_lore`
- `knowledge_domain.biomes`
- `knowledge_domain.habitats`
- `knowledge_domain.climate`
- `knowledge_domain.seasonal_patterns`
- `knowledge_domain.beast_lore`
- `knowledge_domain.undead_lore`
- `knowledge_domain.aberration_lore`
- `knowledge_domain.draconic_lore`
- `knowledge_domain.customs`
- `knowledge_domain.law`
- `knowledge_domain.nobility`
- `knowledge_domain.local_politics`
- `knowledge_domain.heraldry`
- `knowledge_domain.guilds`
- `knowledge_domain.orders`
- `knowledge_domain.temples`
- `knowledge_domain.academies`
- `knowledge_domain.underworld`
- `knowledge_domain.markets`
- `knowledge_domain.local_economy`
- `knowledge_domain.caravan_routes`
- `knowledge_domain.crafting_materials`
- `knowledge_domain.smithing_materials`
- `knowledge_domain.alchemy_reagents`
- `knowledge_domain.textiles`
- `knowledge_domain.woodworking_materials`
- `knowledge_domain.leatherworking_materials`
- `knowledge_domain.anatomy`
- `knowledge_domain.herbalism`
- `knowledge_domain.toxicology`
- `knowledge_domain.disease`
- `knowledge_domain.field_surgery`
- `knowledge_domain.spellcraft`
- `knowledge_domain.rituals`
- `knowledge_domain.wards`
- `knowledge_domain.elemental_lore`
- `knowledge_domain.divine_lore`
- `knowledge_domain.dark_lore`
- `knowledge_domain.druidic_lore`
- `knowledge_domain.religion`
- `knowledge_domain.doctrine`
- `knowledge_domain.myth`
- `knowledge_domain.saints_and_relics`
- `knowledge_domain.cults`
- `knowledge_domain.archaeology`
- `knowledge_domain.ancient_languages`
- `knowledge_domain.genealogy`
- `knowledge_domain.bloodline_lore`
- `knowledge_domain.relic_lore`
- `knowledge_domain.weapon_lore`
- `knowledge_domain.armor_lore`
- `knowledge_domain.siegecraft`
- `knowledge_domain.military_orders`

## Cleanup Notes

This backlog was intentionally compacted on 2026-06-04 to remove stale long-form historical run notes that had already been processed into current handoffs, roadmap entries, design plans, or retained historical audit documents. Durable current guidance should live in the specific design documents and handoffs referenced above rather than remaining duplicated as old run-note paragraphs here.
