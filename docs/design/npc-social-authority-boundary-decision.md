# NPC And Social Authority Boundary Decision

Version: `Version 0.5.206 - NPC And Social Authority Boundary Decision`

Status: approved documentation-only authority boundary

## 1. Decision Summary

Approve future `civilization.people` as the first NPC/social implementation candidate, beginning with a documentation-only person-vs-NPC schema decision. Keep stable person identity separate from an NPC presence/interactable overlay, social roles, workplaces, schedules, dialogue, relationships, rumors, companion eligibility, and mutable player/runtime state.

Canonical social relationships must use dedicated link records rather than arrays on people or NPC records. Schedules and dialogue topics remain descriptive-only in `0.5.x`; rumors remain authored seeds; companions remain eligibility/characterization authority; service/vendor references remain reference-only.

All new first-pass social records must reject runtime, gameplay, memory, reputation, service-access, player-state, storage, and UI fields. Relationship mutation, social memory, dialogue history, companion party state, service execution, person-local favorability/faction standing, NPC AI, pathfinding, and schedule execution remain deferred to `0.6+`.

This document consumes `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` as planning input, corrects it against the live repository, and does not make that temporary artifact canon.

## 2. Live Repo Reality

Live inspection found no authored people, NPC, dialogue, relationship, social-role, schedule, rumor, or companion collection and no corresponding schema. No existing owner is a better fit for stable named-person identity than future `civilization.people`.

Adjacent owners must be preserved:

- `civilization.workplaces` owns economic facility identity, labor slots, job definitions, tools, and production/workforce behavior. It does not own named workers or people.
- Quest definitions contain giver `type`, free-form `entityId`, `displayName`, `contactName`, and settlement context. Those fields are quest presentation/anchor metadata, not canonical person records.
- Settlement institution/property projections synthesize operator identities such as `npc_household` and `npc_individual`. These are runtime-derived ownership placeholders, not authored people, households, or NPC identities.
- Combat encounters may contain NPC combatants, but combat actor state is not canonical person or NPC content authority.
- The player engine already owns mutable scoped fame/notoriety reputation state and award/decay behavior. This decision preserves that existing runtime owner and does not extend it into person-local relationships, favorability, faction standing, or service access.
- Knowledge registry vocabulary includes character/teacher evidence-owner concepts, but the live snippet subject authority has no canonical person/NPC recognition owner.
- Existing family, civic, guild, religion, settlement, economy, quest, travel, and magic records contain names, roles, offices, services, or affiliations without creating a general person authority.

## 3. NPC / Social Authority Ownership Boundary

NPC/social authority is layered:

- people own stable authored person identity;
- NPC overlays own current authored presence/interactable characterization;
- social roles own reusable role meaning;
- workplaces retain facility/job/economy authority;
- schedules own descriptive routine plans;
- dialogue topics/scenes own authored conversation content;
- relationship links own stable social claims between canonical actors;
- rumors own authored information seeds;
- companion overlays own eligibility/characterization;
- player/runtime owners track memory, history, mutation, party state, reputation, access, current position, AI, and execution.

Cross-references do not transfer ownership. Static social content must not execute another layer's behavior.

## 4. Person Identity Boundary

Future `civilization.people` owns stable authored identity for canon named people: id, slug, name, aliases, public descriptors, broad life/presence status, provenance, and supported references to places or other authorities after their contracts exist.

A person record is not an NPC instance, combat actor, schedule, job assignment, dialogue state, relationship array, inventory, service, vendor, quest state, companion state, or player/runtime character state. Person identity must remain stable when presence, occupation, affiliation, residence, relationship, or interactability changes.

Historical, absent, deceased, or otherwise non-interactable people may still have canonical person records. The next schema decision must choose the minimum identity contract and avoid speculative biography or unsupported cross-system references.

## 5. NPC Overlay Boundary

Future `civilization.npcs` should remain a separate overlay keyed to a canonical `personId`. It may later describe authored presence/interactable posture, presentation overrides, role references, home/work/place anchors, schedule/dialogue references, service/vendor references, encounter posture, and companion-eligibility references.

An NPC overlay must not duplicate canonical name, aliases, family/kin facts, person biography, workplace/economy definitions, current map position, combat state, inventory, memory, relationship scores, dialogue history, service access, shop state, or party membership.

A person may exist without an NPC overlay. An overlay must not exist without a resolvable person unless a later generated-NPC contract explicitly authorizes that model.

## 6. Named NPC vs Generated NPC Boundary

First-pass authority prioritizes authored canon people and only later authored NPC overlays for socially important, quest-relevant, civic, religious, guild, family, workplace, or companion candidates.

Generated settlement residents, workers, guards, merchants, travelers, and other population members remain future generated-once/save or runtime data. Synthetic `npc_household`, `npc_individual`, combatant, quest contact, or operator strings must not be promoted into people records by inference.

No procedural person generation, generated-id policy, roster generation, persistence, spawn, or population simulation is authorized here.

## 7. Social Role and Workplace Boundary

Future `civilization.social_roles` owns reusable descriptive role meaning such as occupation, office, social function, public duties, or service posture. It remains separate from person identity and NPC presence.

Existing `civilization.workplaces` retains facility identity, workforce/job definitions, labor capacity, tool requirements, outputs, and economy behavior. A workplace job id is not a person, social-role assignment, employee roster, vendor, or service-access grant.

People/NPCs may later reference roles and workplace anchors, but first-pass records must not assign runtime shifts, employment state, wages, production, stock, prices, services, or access. Role membership/assignment ownership requires a later decision if mutable or temporal assignment is needed.

## 8. Schedule and Routine Boundary

Future `civilization.schedules` remains descriptive-only throughout `0.5.x`. A schedule may later describe recurring time blocks, expected place/work/home anchors, seasonal/weekly posture, observances, duties, market days, travel/absence notes, and non-executable overrides.

A schedule is not AI, pathfinding, current position, occupancy, simulation clock state, service availability, dialogue availability, encounter spawning, or a command queue. Exact path nodes, live time advancement, schedule interruption, conflict resolution, and execution belong to runtime systems in `0.6+`.

No schedule schema or content is authorized before people/NPC identity boundaries are stable.

## 9. Dialogue Topic and Scene Boundary

Future `civilization.dialogue_topics` should own authored, descriptive, effect-free conversation subjects, purposes, tags, public/hidden posture, speaker/subject references, optional informational gates, repeatability posture, provenance, and notes. Dense authored branching or line/node structures belong to a separate future dialogue-scene authority.

Dialogue topics/scenes must not execute services, mutate relationships/reputation/legal status, write memory, grant rewards/items/Knowledge, start or complete quests, change companion state, apply choices, or store conversation history. Runtime dialogue consumes authored content later and owns seen/asked/chosen state.

Existing quest contact/display text is not a dialogue-topic or person authority.

## 10. Relationship Link Boundary

Canonical social relationships must live in dedicated `civilization.relationship_links` records rather than duplicated arrays on people or NPC records. Link records should own stable directional or symmetric social claims, actor references, relationship type, visibility, recognition/dispute posture, provenance, supported temporal status, and notes.

Direct parent, child, spouse/partner, guardian, adoption, and foster facts remain owned by the future family `civilization.kinship_links` authority and must not be duplicated as generic social links. Social relationship links may later cover mentor/apprentice, patron/client, employer/employee, friend/rival, debtor/creditor, oath/feud, or similar non-kin ties.

Links must not store mutable scores, decay, memories, access grants, rewards, reputation changes, dialogue history, or player-local state. Mutable relationship state is future runtime/save data.

## 11. Rumor, Gossip, and Social Knowledge Boundary

Future `civilization.rumors` remains authored seed authority only. A rumor seed may describe a claim/topic, source/provenance, subject references, initial place/group context, visibility/credibility posture, and notes.

Rumor acquisition, propagation, mutation, distortion, decay, belief, witness state, social memory, dialogue delivery, reputation effects, quest effects, and player knowledge belong to future runtime/save owners. Static rumors must not contain propagation graphs or current hearer lists.

Knowledge may later represent learned rumor information only after a dedicated subject/evidence decision; rumor content itself must not mutate Knowledge progress.

## 12. Companion, Follower, Hireling, and Retainer Boundary

Future `civilization.companions` remains eligibility and authored-characterization authority only. A companion overlay may later reference a person, descriptive role tags, narrative hooks, eligibility posture, informational prerequisites, affiliations, dialogue references, provenance, and availability notes.

Companion eligibility must not create active party membership, loyalty, inventory, wages, contracts, orders, AI, combat behavior, injuries, travel behavior, dismissal state, memory, relationship mutation, rewards, or service access. Followers, hirelings, retainers, wards, heirs, and family members retain their distinct family/economy/civic/legal relationships and must not be flattened into companion identity.

All active companion/party state remains deferred to `0.6+`.

## 13. Reputation, Favorability, Standing, and Access Boundary

Existing player fame/notoriety reputation state, rules, award evaluation, propagation, and decay retain their current runtime owner unchanged. Static people/NPC/social records must not duplicate or mutate that system.

Future person-local familiarity, trust, respect, fear, friendship, rivalry, loyalty, favorability, faction/guild/institution/religion/civic standing, legal status, and access are separate mutable domains. They must not be collapsed into one universal scalar or stored on authored person/NPC records.

First-pass social content may describe public posture or eligibility only. It must not grant services, discounts, prices, dialogue outcomes, quest access, legal treatment, faction standing, rewards, or reputation/favorability changes.

## 14. Settlement, Economy, Service, Vendor, and Job Integration Boundary

Settlements/buildings own place and facility identity; workplaces own jobs, labor, tools, and production; guilds own guild identity; economy owners retain goods, stock, prices, value, trade, and simulation; runtime service/shop systems later own availability and execution.

People/NPC/social records may later reference canonical settlement, workplace, building, job, shop, vendor, or service anchors. References remain reference-only and must not duplicate economy authority, create stock, set prices, perform production, assign workers, execute training/healing/trade, grant access, collect payment, or mutate inventories.

Quest giver/contact metadata and settlement service tags remain their current presentation/descriptive owners until explicit canonical person/service references are approved.

## 15. Faction, Guild, Institution, Law, Religion, and Family Integration Boundary

Social content may later reference canonical faction, guild, institution, polity/government/office, jurisdiction/law, religion/order, household/family/lineage, estate, or kinship authorities after they exist.

Person/NPC records must not redefine those entities, embed membership history arrays, infer affiliations from roles/prose, mutate standing/legal/religious/family state, grant offices/titles, enforce law, provide services, or execute marriage/romance/children behavior.

Generic authored faction, institution, people/teacher, household/family, and several civic authorities do not yet exist. First-pass schemas must fail closed rather than use free-form references as canonical substitutes.

## 16. Quest, Event, Chronicle, and Knowledge Integration Boundary

People/NPCs may later provide canonical anchors for quest givers/targets, authored events, Chronicle subjects, Knowledge recognition, dialogue topics, rumors, witnesses, and social consequences. Existing quest-giver strings remain quest metadata and are not silently migrated by this decision.

Knowledge recognition remains informational only. No person/NPC/relationship/rumor subject support is approved here, and existing character/teacher evidence-owner vocabulary does not establish person subject authority. Knowledge must not grant relationships, companion eligibility, services, reputation, standing, legal status, rewards, or dialogue outcomes.

Quest/event/reward execution, Chronicle writing, Knowledge progress mutation, and social consequence application remain separate runtime owners.

## 17. Player Social Runtime State Boundary

Future player/social runtime or save state may track known/recognized people, current relationships, familiarity/trust/respect/fear, memories, witnessed events, promises/debts, conversation history, rumor knowledge, companion/party state, service access, faction/guild/religion/civic standing, and person-local reactions.

Existing player fame/notoriety state remains the only live broad reputation owner identified in this pass and is unchanged. It must not be treated as person-local relationship memory or as permission to add new social mutations.

Current location, schedule execution, NPC AI, pathfinding, dialogue execution, relationship mutation, social memory, party membership, service state, and new standing/favorability behavior remain deferred to `0.6+`.

## 18. First Implementation Candidate

The first implementation candidate is future `civilization.people`, beginning with a documentation-only `Person vs NPC Schema Decision` rather than a schema file.

People come first because the live repository has many names, quest contacts, role labels, synthetic operator ids, combat NPCs, workplaces, and affiliations but no stable canonical owner for authored named-person identity. NPC overlays, relationships, dialogue, schedules, rumors, companions, and Knowledge recognition all require that identity boundary.

The candidate does not authorize schema, validator, content, test, loader, migration, generated people, runtime, UI, storage, or gameplay changes.

## 19. Future Validation Direction

Later schema and validator work should be staged separately and eventually enforce:

1. strict records-only wrappers and canonical person id/slug agreement;
2. unique stable person identities and conservative life/presence status;
3. NPC overlays require valid canonical `personId` and do not duplicate identity fields;
4. active place, role, workplace, family/kinship, faction/guild/institution, civic/law, Religion, quest, dialogue, schedule, rumor, companion, and Knowledge references only after each authority exists;
5. canonical social links with pair/direction semantics, no invalid self-links, duplicate/inverse prevention, visibility, recognition/dispute, provenance, and supported temporal posture;
6. direct kin/care facts remain in kinship links, not social links;
7. schedules/dialogue/rumors/companions remain descriptive and non-executable;
8. service/vendor/job references do not duplicate economy/workplace authority;
9. no inference of people from free-form names, quest contacts, synthetic operator ids, combatants, roles, titles, or prose;
10. rejection of AI, pathfinding, current position, schedule execution, relationship score/mutation, memory/history, rumor propagation, companion party state, service access/execution, reputation/favorability/standing/legal-status mutation, runtime, storage, UI, command, event, reward, or gameplay fields.

No schema, validator, test, content, or content-lint change is authorized by this decision.

## 20. Temporary Research Artifact Handling

`docs/dev/tmp-npc-social-systems-research-2026-06-20.md` was consumed as planning input and remains temporary, not final canon.

Keep it through the next person-vs-NPC schema-decision pass because it contains candidate fields and later role, schedule, dialogue, relationship, rumor, companion, reputation, service, Knowledge, and generated-NPC questions not fully promoted here. That pass must delete it if all useful guidance is promoted, or retain it only with a named next concrete consumer and removal condition.

## 21. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no economy, family, civic, travel, geography, religion, or magic authority changes;
- no runtime system, UI, storage, NPC AI, pathfinding, schedule simulation, relationship mutation, companion party state, dialogue runtime, social-memory mutation, service access, reputation/favorability/faction-standing/legal-status mutation, quest/event/reward execution, or gameplay behavior;
- no shop/vendor stock or price behavior, romance, marriage, children, generated population, migration, compatibility alias, or data rename;
- no command, event, reward, or transition to `0.6.0`.

## 22. Next Recommended Version

`Version 0.5.207 - Person vs NPC Schema Decision`

That run should remain documentation-only and decide exact `civilization.people`/future NPC paths, wrapper, ids, minimum person fields, life/presence status, person-vs-overlay duplication rules, supported references, generated-person posture, forbidden fields, validation ownership, staged implementation order, and temporary-artifact cleanup without implementation.
