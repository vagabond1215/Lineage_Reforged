# Quest Event Chronicle Authority Boundary Decision

Version: `Version 0.5.208 - Quest Event Chronicle Authority Boundary Decision`

Status: approved documentation-only authority boundary

## 1. Decision Summary

Preserve `civilization.quest_definitions` as the canonical owner for unique authored quest definitions. Preserve `civilization.quest_archetypes` as reusable authored quest structure and `civilization.quest_templates` as economy/settlement/guild-driven repeatable offer templates.

Keep authored quest definitions separate from player/session quest state. Keep objectives and conditions embedded in their current owning quest/archetype/template shapes for now; do not create separate objective or condition collections until a dedicated schema decision proves reusable authority is needed.

Rewards and consequences remain descriptive envelopes in authored narrative content throughout `0.5.x`. Events/storylets and rumors/hooks remain authored seeds, Chronicle/journal templates remain separate from mutable Chronicle state, and quest-giver/contact fields remain presentation metadata until person/NPC authority lands.

All new first-pass narrative records must reject runtime, gameplay, reward-payout, mutation, player-state, storage, and UI fields. This document consumes `docs/dev/tmp-quest-event-chronicle-systems-research-2026-06-20.md` as planning input, corrects it against the live repository, and does not make that temporary artifact canon.

## 2. Live Repo Reality

The live repository already has a three-layer authored/generated quest model:

- `civilization.quest_definitions` contains five strict unique authored quest records with giver metadata, requirements, scheduling, classification, deployment, logistics, rewards, and embedded action trees.
- `civilization.quest_archetypes` contains eight reusable authored structures with requirements, outcome/failure/reward-driver descriptors, scaling, and embedded action trees.
- `civilization.quest_templates` contains 36 repeatable economy/settlement/guild-facing templates with generation source, targets, thresholds, and reward profiles.
- Civilization quest generation already consumes templates and current economy/settlement/guild context to produce mutable `QuestOfferState` records with objectives and reward/reputation previews. This runtime owner is unchanged.
- Player/session contracts already include `activeQuestIds`, `completedQuestIds`, `QuestJournalEntryState[]`, and mutable civilization active offers.
- Chronicle-related mutable/presentation owners already include player discovery Chronicle entries, session `ChronicleEventState[]`, account run-history Chronicle projections, and Chronicle UI projections. No authored Chronicle-template collection exists.
- No authored quest-arc, event, storylet, rumor/hook, dialogue, or Chronicle-template collection exists under the proposed top-level paths.
- Existing quest giver fields are free-form presentation/anchor metadata (`type`, `entityId`, `displayName`, `contactName`, and settlement), not canonical people/NPC references.

The temporary research underestimates existing quest and player/Chronicle state ownership. This decision preserves those live owners rather than introducing a parallel `player.quests` collection.

## 3. Quest / Event / Chronicle Authority Ownership Boundary

Narrative authority is layered:

- quest definitions own unique authored quest identity and descriptive structure;
- quest arcs own future multi-quest grouping/ordering context;
- archetypes own reusable quest structure;
- templates own repeatable/generatable offer inputs;
- objectives/conditions remain embedded descriptive components until a later decision proves separate reuse;
- reward/consequence fields describe possible outcomes;
- events/storylets and rumors/hooks own authored narrative seeds;
- Chronicle/journal templates own future authored entry shapes;
- runtime/player/session/account owners track offers, acceptance, progress, outcomes, reward claims, journals, Chronicles, and history.

References across layers do not execute behavior or transfer ownership.

## 4. Quest Definition Boundary

`civilization.quest_definitions` already owns authored quest definitions and remains canonical. It owns stable quest identity, summary/category, giver presentation metadata, eligibility/requirements, scheduling/classification, deployment/logistics, descriptive reward envelope, notes, and embedded authored action-tree structure.

Quest definitions must remain separate from player quest state. They must not store accepted, active, tracked, completed, failed, abandoned, reward-claimed, objective-progress, map-marker, dialogue-history, Chronicle-written, or player-specific availability state.

No new quest-definition collection, namespace migration, schema replacement, validator change, or content rewrite is authorized here.

## 5. Quest Arc Boundary

Future quest arcs should be a separate authored grouping authority rather than arrays of mutable progression state inside quest definitions. An arc may later describe stable identity, ordered or prerequisite quest references, branching posture, public/hidden status, thematic context, provenance, and notes.

An arc must not track the player's current quest, branch choice, completion, failure, rewards, unlocked nodes, or narrative consequences. Runtime state later records which arc path a player has taken.

No quest-arc authority is required before the next objective/condition decision, and no arc schema or content is authorized here.

## 6. Objective and Condition Boundary

Objectives and conditions should remain embedded in their current owners for now:

- unique definitions and archetypes retain embedded requirements, action-tree nodes, checks, branches, and completion references;
- repeatable template generation retains its template inputs and produces runtime offer objectives;
- player/session state retains objective display/progress state where already modeled.

Do not create separate objective or condition collections in this pass. The next schema decision must reconcile authored action-tree nodes/branch conditions, quest requirements, archetype reuse, generated `QuestOfferObjective` types, and future player tracking before deciding whether any component deserves reusable authority.

Embedded objective/condition descriptors remain non-executable in `0.5.x`. They must not evaluate state, increment counters, reveal markers, select branches, or mutate quests.

## 7. Reward and Consequence Boundary

Rewards and consequences remain descriptive envelopes in authored quest definitions, archetypes, templates, events, storylets, rumors, and future Chronicle templates throughout `0.5.x`.

Current quest templates may continue feeding existing generated-offer reward/reputation previews. That existing generation owner is unchanged and does not authorize payout or consequence execution.

Authored narrative records must not grant items/currency/Knowledge/spells/Prestige, mutate reputation/favorability/standing/legal status, unlock services, transfer property, update family/Legacy state, apply penalties, write Chronicle entries, or mark rewards claimed.

## 8. Contract, Task Board, and Repeatable Work Boundary

Contracts/task-board work remains separate from unique authored quests. Existing `civilization.quest_templates` is the current repeatable-offer template owner, and civilization quest generation owns generated `QuestOfferState` instances.

Future contract or task-board authorities may add stable distribution surfaces, issuer references, availability posture, expiration descriptors, or contract families only after a dedicated decision proves those concepts are not already covered by quest templates/guild/settlement content.

Generated contract/offer instances, refresh timing, acceptance, expiration, objective progress, payout, standing changes, and board UI are runtime/state concerns. Static unique quest definitions must not absorb them.

## 9. Event and Storylet Boundary

Future events and storylets remain authored seeds, not runtime event execution. A seed may describe stable narrative possibility, scope, prerequisite descriptors, candidate outcomes, recurrence/visibility posture, references, provenance, and notes.

Runtime owns event selection, scheduling, randomization, cooldowns, activation, branch evaluation, current state, commands, emitted events, world/player mutation, rewards, and follow-up generation.

Existing engine/shared event contracts and `ChronicleEventState` naming do not establish an authored storylet/event content collection. No event/storylet schema or seed is authorized here.

## 10. Rumor, Hook, and Discovery Boundary

Rumors and hooks remain authored discovery seeds only. A future seed may describe a claim/lead, credibility/public posture, source/channel, subjects, delivery contexts, candidate quest/event/storylet references, provenance, and notes.

Rumor propagation, distortion, decay, belief, who heard it, discovery flags, quest reveal/acceptance, dialogue delivery, Knowledge progress, map markers, and social/reputation consequences belong to future runtime/save owners.

NPC/social rumor authority and narrative hook authority require a later ownership decision to avoid duplicate rumor collections.

## 11. Chronicle, Journal, and History Boundary

Future authored Chronicle/journal templates must remain separate from mutable player/session/account Chronicle state. A template may later describe entry category, title/summary shape, entity/result fields, provenance, and candidate source references without asserting that an entry exists.

Existing `PlayerDiscoveryChronicleState`, session `QuestJournalEntryState[]` and `ChronicleEventState[]`, account run-history Chronicle projections, and Chronicle UI presentation retain their current mutable/projection owners. They are not authored template authority.

Static narrative content must not write, reveal, archive, pin, track, complete, fail, or delete Chronicle/journal entries.

## 12. NPC, Dialogue, and Social Integration Boundary

Quest content may later reference canonical person ids, NPC overlays, social roles, dialogue topics/scenes, relationship links, rumors, companion eligibility, or workplace/service anchors after those authorities exist.

Current quest-giver/contact fields remain presentation metadata. The unlanded person-vs-NPC schema decision means names and entity ids must not be treated as canonical people/NPC references or migrated by inference.

Narrative records must not mutate relationships, memory, conversation history, companion/party state, favorability, service access, schedules, AI, or social state.

## 13. Faction, Guild, Civic, Law, and Reputation Integration Boundary

Narrative records may later reference canonical factions, existing guilds, future institutions, polities/governments, jurisdictions/laws, offices, guards, conflicts, and status authorities after those owners exist.

Existing player fame/notoriety and standing state retain their current runtime owners. Static quest/reward/consequence records must not apply reputation awards, favorability/standing changes, legal status, wanted/bounty state, arrests, punishment, diplomacy, faction membership, guild rank, access, or enforcement.

Bounty/wanted contracts remain deferred until civic/law authority and explicit canon approve them.

## 14. Economy, Crafting, Item, and Trade Integration Boundary

Quests, archetypes, and templates may reference existing items, guilds, settlements, markets, workplaces, production/crafting context, trade routes, shortages/surpluses, deliveries, commissions, and reward candidates through supported fields.

Economy/crafting/item owners retain stock, prices, value, production, recipes, transformations, ownership, and simulation. Narrative content must not grant/remove items/currency, calculate prices, craft goods, consume materials, mutate inventory/stock, transfer property, execute trade, or pay rewards.

Existing economy-driven quest-offer generation remains unchanged and must not be confused with fulfillment or payout.

## 15. Travel, Exploration, and Encounter Integration Boundary

Narrative records may reference canonical regions, settlements, map features, routes/lanes, hexes/edges, hazards/security, camps/POIs, travel networks, encounter templates, or spawn profiles after their authorities support those references.

They must not execute pathfinding, travel time, journey state, encounter spawning, discovery/map reveal, map markers, camp/survival mechanics, route mutation, or travel UI.

Objective descriptors may name travel/exploration/encounter intent without owning the runtime that proves completion.

## 16. Religion, Magic, Knowledge, and Trial Integration Boundary

Narrative records may reference religions, religious hotspots, sacred sites, future orders/institutions, spells, magic-study sources/policies, rituals, Knowledge subjects/snippets, skills, or trials after explicit support exists.

Knowledge hooks remain informational, and trial/study/objective references remain descriptive. Narrative content must not grant Knowledge progress, spell access/ownership/readiness, trial completion, study progress, religious favor/alignment, services, Prestige, magical rewards, or runtime effects.

The unlanded magic-study source schema decision remains a separate deferred lane.

## 17. Family, Estate, and Legacy Integration Boundary

Narrative records may later reference canonical people, households, families, kinship links, genealogical lineages, estates/property, inheritance disputes, heirlooms/bequests, family reputation, or Legacy context after their authorities exist.

They must not execute marriage/romance/children, inheritance, succession, property transfer, bequests, family Prestige, account unlocks, heir creation, source-run transfer, or legacy continuation.

Chronicle references do not authorize writing account/run history or mutating Bloodlines/Legacy presentation state.

## 18. Player Quest/Event/Chronicle Runtime State Boundary

Existing mutable owners already include civilization active quest offers, player active/completed quest ids, session quest-journal entries, session Chronicle events, player discovery Chronicle entries, account run history, and associated projections/UI. This decision preserves them unchanged.

Future runtime/save owners may expand accepted/failed/abandoned state, objective counters, hidden/revealed flags, branch choices, generated contract instances, event/storylet outcomes, rumor-heard state, reward claims, map markers, dialogue hooks, and Chronicle/journal writing.

Static quest/arc/objective/condition/reward/event/storylet/rumor/template records must not contain mutable player/session/account state or directly execute it. New objective tracking, payout, event execution, Chronicle writing, and narrative consequences remain deferred to `0.6+`.

## 19. First Implementation Candidate

Existing `civilization.quest_definitions` already implements authored quest-definition authority, so a new quest-definition schema is not the next candidate.

The next implementation candidate is a documentation-only `Quest Objective And Condition Schema Decision`. It must decide whether existing embedded requirements/action-tree components remain sufficient, require schema refinement, or justify later reusable objective/condition authorities while preserving archetypes, templates, generated offers, and player state.

This candidate does not authorize schema, validator, content, test, runtime, UI, storage, migration, reward, or gameplay changes.

## 20. Future Validation Direction

Later schema and validator work should be staged separately and eventually enforce:

1. preservation of strict wrappers and unique quest/archetype/template ids/slugs;
2. valid action-tree entry/completion/node/branch coherence without runtime execution;
3. explicit quest-arc references only after arc authority exists;
4. objective/condition vocabulary and reference coherence across definitions, archetypes, templates, and generated offers;
5. valid person/NPC/dialogue/rumor/event/Chronicle/place/faction/guild/civic/religion/family/economy/travel/magic/item/trial references only after each owner exists;
6. quest-giver/contact presentation fields are not canonical person references;
7. descriptive reward/consequence envelopes remain non-executing;
8. repeatable templates remain separate from unique definitions and generated instances;
9. authored event/storylet/rumor/template records remain separate from player/session/account state;
10. rejection of accepted/current/completed/failed/abandoned state, objective progress, reward claim/payout, item/currency/Knowledge/spell/Prestige grants, reputation/favorability/standing/legal/service mutation, event execution, Chronicle writing, map markers, runtime, storage, UI, command, event, reward, or gameplay fields.

No schema, validator, test, content, or content-lint change is authorized by this decision.

## 21. Temporary Research Artifact Handling

`docs/dev/tmp-quest-event-chronicle-systems-research-2026-06-20.md` was consumed as planning input and remains temporary, not final canon.

Keep it through the next objective/condition schema-decision pass because it contains candidate fields and later quest-arc, contract/task-board, event/storylet, rumor/hook, Chronicle-template, integration, and runtime-state questions not fully promoted here. That pass must delete it if all useful guidance is promoted, or retain it only with a named next concrete consumer and removal condition.

## 22. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no NPC/social, economy, family, civic, travel, geography, religion, or magic authority changes;
- no runtime system, UI, storage, quest-state mutation, objective tracking, event execution, reward payout, item grant, reputation/favorability/standing/legal-status mutation, spell access, Knowledge reward, service access, map marker, Chronicle writing, generated contract instance, command, event, reward, or gameplay behavior;
- no bounty/wanted, romance/marriage, punitive legal, sensitive social consequence, migration, compatibility alias, collection rename, or data rewrite;
- no transition to `0.6.0`.

## 23. Next Recommended Version

`Version 0.5.209 - Quest Objective And Condition Schema Decision`

That run should remain documentation-only and decide the exact embedded objective/condition ownership across quest definitions, archetypes, templates, and generated offers; supported vocabularies/references; reuse thresholds; runtime-state separation; forbidden fields; validation ownership; future schema sequence; and temporary-artifact cleanup without implementation.
