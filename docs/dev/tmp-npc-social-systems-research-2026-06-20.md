# Temporary Deep Research: NPCs, Dialogue, Schedules, Relationships, Memory, and Social Simulation

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research run from the user-provided NPC/dialogue/social-systems prompt.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The research pass examined NPCs, characters, dialogue, schedules, relationships, memory, companions, social simulation, social roles, settlement life, interaction history, reputation, social standing, faction/guild/family/religion/civic ties, and player-facing conversation or relationship loops for Lineage Reforged.

The strongest recommendation is to treat NPC/social work as an authority-boundary problem first, not a simulation problem. The first-pass model should separate:

- person identity;
- NPC presence / role overlay;
- social-role overlays;
- workplace anchors;
- schedule descriptors;
- dialogue topics / authored scenes;
- relationship links;
- rumor seeds;
- future runtime state for memory, affinity, reputation, companion membership, and conversation history.

The next safe Codex pass is:

`Version 0.5.206 - NPC And Social Authority Boundary Decision`

That pass should be documentation-only, should correct this research artifact against live repository inspection, and should not implement schemas, validators, content records, tests, NPC AI, dialogue runtime, schedules, pathfinding, memory, reputation, companion state, service access, or gameplay behavior.

## 2. Repository Inspection Caveat

The Deep Research report used the uploaded specification and adjacent project context. The available connector did not provide a fully reliable directory census of private repository paths during the research run. Therefore, this artifact distinguishes project-method conclusions from exact live collection facts.

Codex must inspect the live checkout before creating any permanent design document.

Primary target areas from the research specification:

- `packages/content/base/world/**`
- `packages/content/base/civilization/**`
- `packages/content/base/player/**`
- `packages/content/base/characters/**`
- `packages/content/base/npc/**`
- `packages/content/base/dialogue/**`
- `packages/content/base/relationships/**`
- `packages/content/base/social/**`
- `packages/content/base/factions/**`
- `packages/content/base/guilds/**`
- `packages/content/base/institutions/**`
- `packages/content/base/family/**`
- `packages/content/base/lineage/**`
- `packages/content/base/religion/**`
- `packages/content/base/economy/**`
- `packages/content/base/quests/**`
- `packages/content/base/knowledge/**`
- `packages/content/base/travel/**`
- `packages/content/base/items/**`
- `packages/schemas/**`
- `tools/content-lint/**`
- `tests/unit/**`
- `docs/design/**`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## 3. Current Repo-State Conclusions

Confirmed project-method signals:

- Recent adjacent lanes consistently use docs-first, schema-first, content-lint-aware, test-aware planning.
- Adjacent boundaries already exist for geography, economy, family, civic authority, travel, and magic study.
- NPC/social systems must reference, not absorb, family, civic, religion, economy, travel, and magic authorities.
- Runtime simulation and mutable player state are consistently deferred in adjacent lanes.

Unverified in-session and requiring live Codex inspection:

- exact person/NPC/character collections;
- exact dialogue topic/tree collections;
- exact relationship/social-memory collections;
- exact companion/follower systems;
- exact schedule/routine systems;
- exact validators/tests/docs for NPC, dialogue, relationship, companion, memory, reputation, social access, or settlement life.

The next Codex pass must explicitly correct this artifact where live repo files differ.

## 4. Current Gaps And Risks

### 4.1 Authority duplication

NPC/social work can easily duplicate family, civic, faction, guild, religion, economy, travel, quest, or Knowledge authority. The first permanent decision should define ownership before schema work.

### 4.2 Person/NPC conflation

A person identity and an interactable NPC overlay are not the same. A canon person may be historical, absent, dead, named, generated once, or currently interactable. An NPC overlay may describe how a person appears in the world.

### 4.3 Dialogue/runtime conflation

Dialogue topics and authored scenes should not execute services, grant rewards, mutate reputation, mark memory, or change player state. Runtime conversation history belongs to future player state.

### 4.4 Schedule/AI conflation

Schedule records should not become AI packages, pathfinding scripts, current map positions, live occupancy, or minute-by-minute simulation.

### 4.5 Social memory leakage

Remembered actions, witnessed events, rumors spreading, player promises, relationship changes, and reputation shifts are mutable runtime/save-state concerns.

### 4.6 Reputation scalar risk

A single universal favorability number is too blunt. Prefer relationship-local ties and domain-specific standing descriptors, with simulation deferred.

## 5. Recommended NPC / Social Hierarchy

Recommended hierarchy:

```text
Person Identity
  -> NPC Presence / Role Overlay
    -> Social Role References
    -> Workplace / Home / Settlement Anchors
    -> Schedule Descriptor References
    -> Dialogue Topic References
    -> Companion Eligibility References

Person Identity
  -> Family / Household / Faction / Guild / Religion / Civic Membership References
  -> Relationship Links
  -> Rumor Seeds / Recognition Context

Runtime / Save State Later
  -> Conversation History
  -> Social Memory
  -> Relationship Mutation
  -> Reputation / Standing Mutation
  -> Companion Party State
  -> Schedule Execution
```

## 6. Person, NPC, And Character Authority Model

Recommended boundaries:

- **Person identity** owns stable identity: id, slug, name, aliases, public descriptors, life/presence status, settlement/home/work references, household/family references, faction/guild/religion/civic references.
- **NPC overlay** owns interactable/present role context: role ids, dialogue topic ids, schedule id, service references, availability notes, encounter tags, companion eligibility references.
- **Character runtime state** owns mutable state: current location, combat state, inventory state, memory, relationship values, conversation history, party membership, injuries, schedule execution.

A person can exist without being a current interactable NPC. A generated or minor NPC can later reference a generated-once person id if needed.

## 7. Named NPCs vs Generated NPCs

Recommended categories:

- canon named NPCs: fully authored;
- important historical people: fully authored, not necessarily interactable;
- minor authored NPCs: authored if they carry settlement, quest, institution, or dialogue relevance;
- generated settlement population: generated once and saved later;
- generic vendors/guards/workers: template or generated once, not first-pass canon unless important;
- temporary travelers: runtime/generated later;
- companions: authored eligibility and characterization first, runtime party state later;
- quest-specific actors: authored only when narrative requires.

First-pass authority should prioritize stable named people and social roles, not broad generated populations.

## 8. Schedules And Routines

Schedules should be descriptive time-blocks, not executable AI.

Possible schedule concepts:

- daily routine block;
- weekly/seasonal routine;
- home/workplace anchor;
- market-day participation;
- religious observance;
- guild duty;
- civic duty;
- guard/watch shift;
- shop/vendor availability;
- teacher/mentor availability;
- travel/absence note;
- festival/event override note;
- emergency override note.

Forbidden first-pass schedule fields:

- exact path nodes;
- live map position;
- simulation clock state;
- current occupancy;
- pathfinding instructions;
- AI package execution;
- service availability mutation.

## 9. Dialogue And Conversation Model

Recommended dialogue model: topic-first, scene-capable.

- `dialogue_topics` should own subject, purpose, tags, availability descriptors, Knowledge/social gates, repeatability posture, and references to authored scenes/lines.
- `dialogue_scenes` may later own dense authored node/scene structures.
- Runtime dialogue state owns seen/heard/asked flags and one-time choice state.

Dialogue records must not grant rewards, execute services, mutate reputation, change legal status, trigger quests, or update memory unless later runtime owners consume them explicitly.

## 10. Relationships And Social Links

Relationship links should be canonical pair records, not duplicated arrays on both people.

Possible relationship types:

- kin;
- spouse/partner only if family authority supports it;
- mentor/apprentice;
- patron/client;
- employer/employee;
- guild/faction/religious/civic tie;
- friend/rival;
- debtor/creditor;
- oathbound;
- feud;
- companion candidate;
- teacher/student.

Recommended fields later:

- `id`;
- `status`;
- `personAId`;
- `personBId` or target reference;
- `relationshipType`;
- `visibility`;
- `claimStrength` or `standingBand`;
- `sourceAuthorityNotes`;
- `notes`.

Forbidden first-pass fields:

- mutable score history;
- daily decay timers;
- reward effects;
- access grants;
- reputation mutation;
- memory log entries.

## 11. Social Memory And Event History

Static content may define memory-relevant context, rumor seeds, testimony topics, or event provenance. It must not store mutable memory.

Future runtime state may later track:

- remembered player actions;
- witnessed events;
- social promises;
- favors/debts;
- rumor acquisition;
- rumor spread;
- conversation history;
- quest outcomes;
- crimes/legal incidents;
- companion reactions.

## 12. Reputation, Favorability, Standing, And Access

Recommended two-layer future model:

1. Domain standing: faction, guild, religion, civic, family prestige, locality notoriety.
2. Local tie: person-to-player familiarity, trust, respect, fear, friendship, rivalry, loyalty.

First-pass static content may describe public posture or standing bands. It must not mutate reputation, grant services, alter prices, change legal status, apply rewards, or trigger faction standing.

## 13. Companions, Followers, Hirelings, And Retainers

Companion content should begin as eligibility and authored characterization only.

Possible descriptive fields later:

- person id;
- companion role tags;
- eligibility posture;
- narrative hooks;
- relationship prerequisites as descriptors;
- dialogue topic refs;
- availability notes;
- family/faction/guild/religion/civic constraints;
- sourceAuthorityNotes;
- notes.

Deferred to runtime:

- active party membership;
- loyalty value;
- dismissal state;
- companion inventory;
- combat AI;
- injuries;
- relationship mutation;
- companion memory;
- party travel behavior.

## 14. Settlement Life And Social Roles

NPC/social authority should reference settlement infrastructure without replacing it.

Useful anchors:

- households;
- workplaces;
- shops;
- guild halls;
- temples;
- courts;
- guard posts;
- inns;
- markets;
- schools;
- farms/workshops;
- civic offices;
- religious sites;
- family estates.

Settlement authority owns place/facility identity. NPC/social authority owns who is associated with those anchors and what social role they fill.

## 15. Economy, Services, Vendors, And Jobs

NPC/social systems may describe merchant/vendor/teacher/worker roles, but economy/service behavior stays outside NPC identity.

Separate:

- person identity;
- social role;
- workplace anchor;
- service availability descriptor;
- economy-owned inventory/value/production behavior;
- runtime shop/service state.

First-pass NPC records must not own stock simulation, prices, production, training execution, or service access.

## 16. Factions, Guilds, Institutions, Law, And Religion Integration

NPC/social records may reference:

- faction membership;
- guild membership;
- institution role;
- religious office;
- civic office;
- law/court/guard actor role;
- military role;
- noble-house/clan/dynasty affiliation.

They must not own the faction/guild/institution/religion/civic authority itself, and must not mutate standing or legal/religious status.

## 17. Knowledge And Recognition Integration

Knowledge may later support:

- recognizing a person;
- knowing a title/role;
- knowing family/lineage affiliation;
- knowing guild/faction/religion/civic affiliation;
- learning rumors;
- learning hidden relationships;
- identifying a teacher/mentor;
- understanding a service/institution;
- discovering a companion backstory;
- unlocking dialogue topics as a runtime/content query.

Knowledge snippets should reveal information only. They should not grant relationship changes, services, rewards, companion state, legal status, or reputation.

## 18. Quests, Events, Rumors, And Chronicles Integration

NPC/social systems may provide stable anchors for:

- quest-givers;
- quest targets;
- rumor seeds;
- social consequences;
- faction events;
- travel encounters;
- settlement events;
- family events;
- civic/legal events;
- companion events;
- chronicle references.

Runtime event execution, reward mutation, quest state, rumor propagation, and chronicle writing remain separate.

## 19. Proposed Content Collections And Schema Concepts

Recommended candidates:

| Collection | Likely path | Priority | Purpose |
|---|---|---:|---|
| `civilization.people` | `packages/content/base/civilization/people.json` or equivalent | 1 | canonical named person identity |
| `civilization.npcs` | `packages/content/base/civilization/npcs.json` | 2 | interactable/present NPC overlay |
| `civilization.social_roles` | `packages/content/base/civilization/social_roles.json` | 3 | reusable roles/offices/service descriptors |
| `civilization.workplaces` | `packages/content/base/civilization/workplaces.json` | 4 | home/work/service anchors where not already owned elsewhere |
| `civilization.relationship_links` | `packages/content/base/civilization/relationship_links.json` | 5 | canonical pair or actor relationship records |
| `civilization.dialogue_topics` | `packages/content/base/civilization/dialogue_topics.json` | 6 | topic-level authored conversation authority |
| `civilization.dialogue_scenes` | `packages/content/base/civilization/dialogue_scenes.json` | later | dense authored node/scene structures |
| `civilization.schedules` | `packages/content/base/civilization/schedules.json` | later | descriptive routine blocks |
| `civilization.rumors` | `packages/content/base/civilization/rumors.json` | later | authored rumor seeds |
| `civilization.companions` | `packages/content/base/civilization/companions.json` | later | companion eligibility and characterization |
| `player.relationship_state` | runtime/save | 0.6+ | mutable relationship state |
| `player.companion_state` | runtime/save | 0.6+ | active companion/party state |
| `player.dialogue_state` | runtime/save | 0.6+ | conversation history and once-state |
| `player.social_memory` | runtime/save | 0.6+ | witnessed actions/memory/rumor acquisition |
| `player.reputation_state` | runtime/save | 0.6+ | mutable standing/notoriety |

The next boundary decision should decide whether `civilization.people` is the first implementation candidate or whether live repo conventions identify a better existing owner.

## 20. Validation And Test Strategy

Future validators should eventually enforce:

1. strict records-only wrappers and id/slug agreement;
2. active anchor references for settlement, family, household, faction, guild, religion, civic, workplace, service, and Knowledge where supported;
3. `npc.personId` resolution and no duplicate identity fields outside approved presentation overrides;
4. relationship link canonical pair ordering and duplicate inverse prevention;
5. no self-links unless explicitly allowed by relationship type;
6. schedule block recurrence/location coherence;
7. dialogue topic subject type/id coherence;
8. Knowledge gate references are valid and informational;
9. companion eligibility does not imply active party state;
10. service/vendor references do not duplicate economy authority;
11. no mutable relationship, memory, reputation, dialogue-state, service execution, schedule execution, AI, pathfinding, runtime, UI, storage, command, event, reward, or gameplay fields.

Forbidden first-pass fields:

- `currentLocation`;
- `aiPackage`;
- `pathfindingScript`;
- `relationshipScore`;
- `favorabilityDelta`;
- `reputationMutation`;
- `conversationHistory`;
- `memoryLog`;
- `rumorPropagationState`;
- `activePartyState`;
- `companionLoyaltyRuntime`;
- `serviceAccessGrant`;
- `shopInventoryRuntime`;
- `questReward`;
- `legalStatusMutation`;
- `runtimeState`;
- `uiState`;
- `storageState`;
- `gameplayEffects`.

## 21. Authored-Vs-Generated Strategy

Fully authored:

- named story NPCs;
- civic officials;
- clergy;
- guild officers;
- companion candidates;
- important family/household members;
- core social roles;
- critical dialogue topics;
- important relationships;
- notable rumor seeds.

Generated once and saved later:

- minor residents;
- generic workers;
- minor merchants;
- guard rosters;
- workplace populations;
- ambient rumor variants.

Derived:

- honorifics/titles from civic/faction/family/religion authorities;
- workplace service summaries from economy/service owners;
- household/family rollups;
- relationship summaries;
- known-person lists.

Runtime/save later:

- current positions;
- schedule execution;
- dialogue history;
- memory and witnessed events;
- relationship mutation;
- reputation/standing mutation;
- companion party membership;
- service access;
- rumor propagation.

## 22. Gameplay Integration Roadmap

Near term:

- NPC and Social Authority Boundary Decision;
- Person vs NPC Schema Decision;
- Relationship Link Schema Decision;
- Dialogue Topic Schema Decision;
- Schedule Descriptor Schema Decision.

Mid term:

- first named person/NPC seeds;
- social role and workplace seeds;
- dialogue topic and rumor seeds;
- companion eligibility planning;
- Knowledge recognition subject decision.

Long term:

- dialogue UI;
- schedule execution;
- companion UI and party systems;
- service/vendor integration;
- social memory;
- relationship meters;
- faction/guild/institution standing;
- rumor propagation;
- NPC routines;
- runtime social simulation.

## 23. Recommended Versioned Implementation Sequence

Suggested sequence after the current magic-study source schema decision:

1. `0.5.206 - NPC And Social Authority Boundary Decision`
   - docs-only;
   - define ownership among people, NPC overlays, roles, workplaces, schedules, dialogue, relationships, rumors, companions, and player social runtime state.

2. `0.5.207 - Person vs NPC Schema Decision`
   - docs-only;
   - decide whether `civilization.people` is first and whether NPC overlay remains separate.

3. `0.5.208 - Relationship Link Schema Decision`
   - docs-only;
   - prevent relationship duplication.

4. `0.5.209 - Dialogue Topic Schema Decision`
   - docs-only;
   - topic-first conversation contract.

5. `0.5.210 - Schedule Descriptor Schema Decision`
   - docs-only;
   - descriptive routine contract.

6. `0.5.211 - First Named NPC / Person Content Seed Plan`
   - docs-only.

7. `0.5.212 - First Named NPC / Person Content Seed`
   - narrow content seed and focused tests after schema/validator work.

8. `0.5.213 - Social Role And Workplace Seed Plan`
   - docs-only.

9. `0.5.214 - Dialogue And Rumor Seed Planning`
   - docs-only.

10. `0.6+`
    - runtime social memory, relationship mutation, dialogue history, schedule execution, companion state, reputation state, and NPC behavior.

## 24. Open Questions

- Does the repo already have a canonical person or character authority that should supersede `civilization.people`?
- Should dead/historical/non-present people share the same person authority as present NPCs?
- Should `civilization.npcs` be required, or can person records carry a present/interactable profile without conflation?
- Should relationship links cover family/kinship too, or should family-specific kinship links remain separate as previously planned?
- Should dialogue topics live under `civilization`, `quests`, `knowledge`, or a future `dialogue` namespace?
- Should workplaces belong to economy, settlement, or social authority?
- Should rumors be Knowledge snippets, dialogue topics, or standalone rumor seeds?
- Which single named person/NPC is safest for a first content seed?

## 25. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.206 - NPC And Social Authority Boundary Decision`

Goal:
Create a docs-only design decision defining the canonical boundary among `civilization.people`, future `civilization.npcs`, `civilization.social_roles`, `civilization.workplaces`, future `civilization.schedules`, future `civilization.dialogue_topics`, future `civilization.relationship_links`, future `civilization.rumors`, future `civilization.companions`, and future player-owned social runtime state.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/npc-social-authority-boundary-decision.md`

Required decisions:

1. Whether `civilization.people` is the first implementation candidate.
2. Whether people and NPC overlays remain separate.
3. Whether relationships must live in dedicated link records rather than arrays on people/NPC records.
4. Whether schedules remain descriptive-only in `0.5.x`.
5. Whether dialogue topics remain descriptive and effect-free in `0.5.x`.
6. Whether rumors remain authored seeds only.
7. Whether companions remain eligibility-only.
8. Whether service/vendor references remain reference-only and do not duplicate economy authority.
9. Whether Knowledge recognition remains informational only.
10. Whether all first-pass social records reject runtime/gameplay/memory/reputation/service-access fields.
11. Which schema decision should come next after the boundary document.

Suggested commit message:

`docs(npc): decide social authority boundaries`

## External References Used By Deep Research

- Ink documentation: https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md
- Yarn Spinner nodes/lines/options: https://docs.yarnspinner.dev/write-yarn-scripts/scripting-fundamentals/lines-nodes-and-options
- Yarn Spinner commands/functions: https://docs.yarnspinner.dev/yarn-spinner-for-unity/creating-commands-functions
- Yarn Spinner line groups: https://docs.yarnspinner.dev/write-yarn-scripts/scripting-fundamentals/line-groups
- Yarn Spinner once: https://docs.yarnspinner.dev/write-yarn-scripts/scripting-fundamentals/once
- Social Practices: a Complete Formalization: https://arxiv.org/abs/2206.06088
- Generative Agents: Interactive Simulacra of Human Behavior: https://arxiv.org/abs/2304.03442
- A mechanistic model of gossip, reputations, and cooperation: https://arxiv.org/abs/2312.10821
