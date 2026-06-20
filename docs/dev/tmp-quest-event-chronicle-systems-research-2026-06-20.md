# Temporary Deep Research: Quests, Contracts, Rumors, Events, Chronicles, Storylets, and Narrative Systems

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research run from the user-provided quests/contracts/rumors/events/chronicles/storylets prompt.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The research pass examined quests, contracts, rumors, events, chronicles, storylets, objectives, rewards, consequences, quest-giver anchors, world-state triggers, player-state progression, and narrative-system planning for Lineage Reforged.

The strongest recommendation is to treat narrative systems as an authority-boundary problem first, not as a quest-runtime implementation problem. The first-pass model should separate:

- quest definitions;
- quest arcs;
- contract/task templates;
- objective definitions;
- condition/prerequisite descriptors;
- reward/consequence descriptors;
- rumor hooks;
- dialogue hooks;
- event/storylet seeds;
- Chronicle/journal templates;
- future player quest/event/Chronicle state.

Do not start with objective tracking, reward payout, map markers, quest UI, Chronicle writing, event scheduling, reputation mutation, item grants, legal-state changes, spell access, Knowledge rewards, or service access. Static narrative content should remain descriptive, validated, and reference-based until runtime owners are explicitly designed.

The next safe Codex pass is:

`Version 0.5.208 - Quest Event Chronicle Authority Boundary Decision`

That pass should be documentation-only and should correct this research artifact against live repository inspection.

## 2. Repository Inspection Caveat

The Deep Research run was based on the uploaded quest/event/Chronicle/narrative specification and adjacent project context. Codex must inspect the live checkout before creating permanent design documents.

Primary target areas from the research specification:

- `packages/content/base/world/**`
- `packages/content/base/civilization/**`
- `packages/content/base/player/**`
- `packages/content/base/quests/**`
- `packages/content/base/events/**`
- `packages/content/base/chronicle/**`
- `packages/content/base/rumors/**`
- `packages/content/base/storylets/**`
- `packages/content/base/dialogue/**`
- `packages/content/base/npc/**`
- `packages/content/base/characters/**`
- `packages/content/base/knowledge/**`
- `packages/content/base/factions/**`
- `packages/content/base/guilds/**`
- `packages/content/base/institutions/**`
- `packages/content/base/religion/**`
- `packages/content/base/family/**`
- `packages/content/base/economy/**`
- `packages/content/base/travel/**`
- `packages/content/base/items/**`
- `packages/content/base/combat/**`
- `packages/content/base/magic/**`
- `packages/schemas/**`
- `tools/content-lint/**`
- `tests/unit/**`
- `docs/design/**`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

Codex should treat all path assumptions in this temporary artifact as candidate guidance until verified against the live repo.

## 3. Current Repo-State Conclusions

Previously inspected project context establishes important adjacent boundaries:

- NPC/social work selects future `civilization.people` first, keeps NPC overlays separate, and treats dialogue, rumors, relationships, companions, and social memory as non-runtime first-pass authorities.
- Magic study work keeps spell identity, study access, Knowledge, trials, Prestige, and runtime spellcasting separate.
- Travel work keeps routes, hazards, security, encounters, discovery, and player journey state separate.
- Civic work keeps polities, governments, jurisdictions, law, factions, guilds, status, and player legal state separate.
- Economy, family, religion, and geography lanes all use narrow descriptive authorities and defer mutable player/runtime behavior.

Narrative systems must reference those lanes without absorbing or executing them.

## 4. Current Gaps And Risks

### 4.1 Quest-definition vs quest-state conflation

A quest definition should describe what a quest is. It must not store whether the player has accepted, progressed, completed, failed, abandoned, or claimed rewards.

### 4.2 Objective-definition vs objective-runtime conflation

Objectives should be authored requirements or descriptive targets. Runtime condition evaluation, counters, markers, discovered/hidden flags, and progress values belong to future player state.

### 4.3 Reward/consequence mutation leakage

Static quest content may describe possible reward families or consequence posture. It should not grant items, money, Knowledge, spells, Prestige, faction standing, religious favor, legal status, property, service access, or family legacy outcomes.

### 4.4 Quest-giver identity risk

Current or future quest contact fields may contain free-form names, display names, or synthetic entity ids. These must not become canonical person/NPC references by inference. Future quests should reference `civilization.people` or NPC overlays only after those authorities exist.

### 4.5 Rumor/Knowledge/dialogue confusion

Rumors, Knowledge snippets, and dialogue topics overlap as discovery surfaces. They must not duplicate authority or mutate each other. Rumors are authored seeds, Knowledge is informational understanding, dialogue is authored conversation content, and runtime state owns what the player heard.

### 4.6 Storylet/event runtime leakage

Storylet or event definitions can encode prerequisites and outputs descriptively, but event scheduling, random selection, cooldowns, world-state mutation, and consequence application belong to runtime/save owners.

## 5. Recommended Quest / Event / Chronicle Hierarchy

Recommended hierarchy:

```text
Quest Arc / Narrative Family
  -> Quest Definition
    -> Objective Definitions
    -> Condition / Prerequisite Descriptors
    -> Reward / Consequence Descriptors
    -> Dialogue / Rumor / Knowledge Hooks
    -> Event / Storylet Hook References
      -> Future Generated or Runtime Quest Instance
        -> Player Quest State
        -> Player Objective State
        -> Player Reward Claim State
        -> Chronicle / Journal State
```

Parallel layers:

```text
Contract Template
  -> Generated Contract Instance
    -> Player Contract State

Rumor Seed
  -> Dialogue / Knowledge Delivery
    -> Player Heard / Known State

Event / Storylet Seed
  -> Runtime Event Selection
    -> Player / World Event State

Chronicle Template
  -> Player Chronicle Entry
```

## 6. Quest Authority Model

Quest authority should own stable authored quest definitions, not player progression.

A future quest definition may include:

- id/slug/name/summary/status;
- quest type/category;
- quest arc id if any;
- giver/contact reference if canonical authority exists;
- place/faction/religion/civic/family/economy/travel/magic hooks;
- objective ids or embedded objective descriptors if schema-approved;
- prerequisite descriptors;
- visibility/discovery posture;
- reward/consequence descriptors;
- sourceAuthorityNotes;
- notes.

A quest definition must not own:

- player accepted/completed/failed state;
- objective progress counters;
- active map markers;
- reward claim state;
- inventory mutation;
- reputation/legal/favorability mutation;
- runtime event execution;
- dialogue history;
- Chronicle writing.

## 7. Objective And Condition Model

Objectives should be descriptive and reference-based.

Potential objective categories:

- travel to place;
- discover POI;
- speak to person/NPC;
- retrieve/inspect item;
- deliver item/message;
- craft/produce item;
- defeat/avoid encounter;
- study Knowledge/magic source;
- complete trial;
- investigate rumor;
- report to authority;
- escort/protect;
- survey route/region;
- resolve social/civic/family matter.

Potential condition categories:

- required quest state;
- place/settlement/region condition;
- Knowledge condition;
- NPC/person recognized condition;
- faction/guild/civic/religion/family condition;
- item possession condition;
- time/season condition;
- travel/discovery condition;
- combat/encounter condition;
- dialogue flag condition;
- trial/study condition.

First-pass content should describe required condition kinds, not execute condition evaluation.

## 8. Rewards, Consequences, And Penalties

Reward/consequence definitions should be descriptive envelopes until runtime payout owners exist.

Allowed descriptive reward families:

- item reward candidate;
- currency/value reward candidate;
- Knowledge information candidate;
- faction/guild/civic/religion/family standing candidate;
- service/access candidate;
- title/status candidate;
- property/estate consequence candidate;
- travel/map/discovery consequence candidate;
- magic-study/spell-lore candidate;
- narrative-only outcome.

Forbidden first-pass behavior:

- grant inventory;
- grant money;
- mutate reputation/favorability/standing;
- mutate legal state;
- grant spell access or study progress;
- grant Knowledge progress;
- transfer property;
- unlock services;
- write Chronicle entries;
- apply penalties.

## 9. Contracts, Task Boards, Jobs, And Repeatable Work

Contracts and task-board work should be separate from unique authored quests.

Future contract authority may cover:

- guild commissions;
- civic jobs;
- temple/religious tasks;
- guard/watch requests;
- bounty/wanted contracts only if canon and law boundaries approve;
- trade/delivery contracts;
- crafting commissions;
- resource-gathering work;
- escort/caravan/shipping contracts;
- exploration/survey contracts;
- settlement requests;
- family/estate obligations;
- repeatable template categories.

Separate:

- contract template authority;
- generated contract instance;
- player contract state;
- reward payout;
- expiration and availability runtime.

## 10. Events And Storylets

Event and storylet authority should describe narrative possibility space, not execute it.

Potential event/storylet concepts:

- world event seed;
- settlement event seed;
- travel event seed;
- encounter event seed;
- social event seed;
- family event seed;
- civic/legal event seed;
- religious event seed;
- economy/shortage event seed;
- magic/trial event seed;
- prerequisite descriptors;
- output/consequence descriptors;
- recurrence/visibility posture;
- source/provenance.

Runtime owns selection, scheduling, randomization, cooldowns, event state, world-state changes, and player outcomes.

## 11. Chronicle, Journal, And History Integration

Chronicle and journal systems should distinguish:

- authored history records;
- Chronicle templates;
- quest-log templates;
- discovered lore/journal entries;
- rumor-log entry templates;
- completed quest summaries;
- failed/abandoned quest summaries;
- player-generated family legacy records;
- travel log templates;
- civic/religious/economic event history templates.

Player Chronicle state should remain mutable runtime/save data. Static Chronicle templates must not mark entries as written, known, revealed, completed, failed, or archived.

## 12. Rumors, Hooks, And Discovery

Rumors are discovery surfaces and narrative hook seeds.

Future rumor/hook authority may include:

- rumor id/slug/title/status;
- claim text or summary;
- reliability/credibility posture;
- source type/channel;
- subject references;
- delivery surfaces such as tavern, market, temple, guildhall, road, port, shrine, NPC, or Knowledge;
- linked quest/event/storylet candidate;
- notes/provenance.

Rumor runtime owns who heard it, how it propagated, whether it was distorted, whether it was believed, and whether it revealed/accepted a quest.

## 13. NPC, Dialogue, And Social Integration

Quest systems should reference future person/NPC/dialogue authorities rather than embed them.

Allowed future references:

- canonical person id;
- NPC overlay id;
- dialogue topic id;
- rumor id;
- relationship-link id;
- companion eligibility id;
- social-role id;
- workplace/service anchor.

Forbidden first-pass behavior:

- mutate relationship state;
- write social memory;
- add conversation history;
- force companion membership;
- execute services;
- infer canonical people from quest contact strings.

## 14. Faction, Guild, Civic, Law, And Reputation Integration

Narrative systems may reference:

- faction/guild requests;
- civic jobs;
- legal/court/watch tasks;
- guard requests;
- political errands;
- diplomacy/conflict tasks;
- social rank/status gates;
- restricted tasks.

Static quest/contract content must not mutate faction reputation, guild standing, civic/legal state, wanted/bounty state, guard behavior, court behavior, or diplomacy state. Bounties/wanted content should remain deferred unless law/civic boundaries and canon explicitly authorize it.

## 15. Economy, Crafting, Items, And Trade Integration

Narrative systems may reference:

- delivery tasks;
- crafting commissions;
- resource gathering;
- market shortages;
- trade contracts;
- caravan/shipping contracts;
- settlement economy tasks;
- item reward candidates;
- payment/value descriptors.

Static quest/contract content must not execute inventory mutation, payment, item generation, price calculation, crafting, production, stock changes, or ownership transfer.

## 16. Travel, Exploration, And Encounter Integration

Narrative systems may reference:

- exploration objectives;
- survey tasks;
- route discovery;
- POI discovery;
- escorts;
- caravan journeys;
- pilgrimage routes;
- travel encounters;
- camp/waystation hooks;
- hazard/security tasks;
- map reveal candidates.

Static quest content must not mutate travel state, pathfinding, route state, encounter spawning, discovery flags, map reveal, or survival mechanics.

## 17. Religion, Magic, Knowledge, And Trials Integration

Narrative systems may reference:

- religious tasks;
- sacred-site tasks;
- pilgrimage hooks;
- ritual tasks;
- magic-study tasks;
- trial prerequisites;
- Knowledge-gated objectives;
- spell/lore discovery;
- temple/monastery requests;
- religious restrictions;
- magical item/reagent tasks.

Static quest/event content must not grant religious favor, alignment, spell access, study progress, trial completion, Knowledge rewards, magical rewards, or magic runtime behavior.

## 18. Family, Estate, And Legacy Integration

Narrative systems may reference:

- family tasks;
- household requests;
- inheritance disputes;
- estate obligations;
- heirloom quests;
- family reputation consequences;
- legacy or Chronicle hooks.

First-pass content must not implement inheritance, marriage/alliance mechanics, property transfer, family Prestige mutation, heirs, bequests, or legacy continuation.

## 19. Proposed Content Collections And Schema Concepts

Recommended candidates:

| Collection | Likely path | Priority | Purpose |
|---|---|---:|---|
| `player.quests` or existing quest collection | verify live path | 1 | authored quest definitions |
| `player.quest_arcs` | future player/content path | 2 | multi-quest narrative grouping |
| `player.quest_objectives` | future or embedded | 3 | reusable objective definitions |
| `player.quest_rewards` | future or embedded | 4 | descriptive reward/consequence envelopes |
| `civilization.contracts` | future civ path | 5 | guild/civic/economy/repeatable contract templates |
| `civilization.task_boards` | future civ path | later | contract distribution surfaces |
| `world.events` | future world path | later | world/settlement/travel event seeds |
| `world.storylets` | future world/player path | later | quality/prerequisite-driven narrative seeds |
| `world.rumor_hooks` or `civilization.rumors` | future path, decide later | later | authored rumor/hook seeds |
| `player.chronicle_templates` | future player path | later | Chronicle/journal templates |
| `player.quest_state` | runtime/save | 0.6+ | mutable quest progress |
| `player.event_state` | runtime/save | 0.6+ | mutable event outcomes |
| `player.chronicle_state` | runtime/save | 0.6+ | written/read Chronicle state |
| `player.contract_state` | runtime/save | 0.6+ | generated/accepted contract state |
| `knowledge.quest_snippets` | Knowledge path | later | informational quest/hook recognition only |

The next boundary decision should determine whether existing quest definitions already have a stable owner and whether `player.quests` is actually the correct namespace.

## 20. Validation And Test Strategy

Future validators should eventually enforce:

1. strict records-only wrappers and canonical id/slug agreement;
2. valid quest arc, quest, objective, condition, reward, event, rumor, dialogue, person/NPC, settlement/place, faction/guild/civic/religion/family/economy/travel/magic/item references only after each authority exists;
3. no free-form quest-giver/contact names as canonical person ids;
4. objective graph/stage coherence and no invalid cycles;
5. optional/hidden/failure objective coherence;
6. condition descriptors reference supported condition families;
7. reward descriptors reference supported reward families without executing them;
8. contract template vs generated contract instance separation;
9. storylet prerequisite/output coherence without runtime scheduling;
10. Chronicle template references resolve without marking player state;
11. no reward mutation, inventory mutation, reputation/favorability/standing/legal-state/spell-access/service-access/Knowledge-progress mutation in static content;
12. no runtime quest state, event state, objective progress, map marker, quest UI, dialogue history, Chronicle writing, storage, command, event, or gameplay fields.

Forbidden first-pass fields:

- `acceptedByPlayer`;
- `currentStage`;
- `objectiveProgress`;
- `completed`;
- `failed`;
- `abandoned`;
- `rewardClaimed`;
- `grantItem`;
- `grantCurrency`;
- `grantKnowledge`;
- `grantSpell`;
- `grantPrestige`;
- `mutateReputation`;
- `mutateLegalStatus`;
- `unlockService`;
- `writeChronicleEntry`;
- `spawnEvent`;
- `mapMarkerRuntime`;
- `questLogState`;
- `uiState`;
- `storageState`;
- `gameplayEffects`.

## 21. Authored-Vs-Generated Strategy

Fully authored:

- main quest definitions;
- quest arcs;
- major objectives;
- narrative hooks;
- important quest contacts once person/NPC authority exists;
- major rumors;
- significant event/storylet seeds;
- Chronicle templates for major outcomes.

Generated once and saved later:

- minor contracts;
- daily/weekly tasks;
- task-board offerings;
- settlement request variants;
- generated rumor variants;
- procedural event candidates.

Derived:

- quest availability summaries;
- objective display summaries;
- reward preview summaries;
- known hooks from Knowledge/dialogue/rumors;
- quest-giver display from person/NPC authority.

Runtime/save later:

- accepted/completed/failed quest state;
- objective progress;
- generated contract instances;
- event outcomes;
- reward claims;
- Chronicle entries;
- dialogue-triggered flags;
- rumor-heard state;
- map markers;
- consequence application.

## 22. Gameplay Integration Roadmap

Near term:

- Quest Event Chronicle Authority Boundary Decision;
- Quest Definition Schema Decision;
- Objective/Condition Schema Decision;
- Reward/Consequence Descriptor Decision.

Mid term:

- first quest seed plan;
- first quest content seed;
- contract/task-board schema planning;
- event/storylet boundary decision;
- Chronicle template decision;
- rumor hook decision;
- Knowledge quest-recognition subject decision.

Long term:

- quest log UI;
- objective tracking;
- reward execution;
- generated contracts;
- event scheduling;
- Chronicle writing;
- map markers;
- narrative consequences;
- runtime state integration.

## 23. Recommended Versioned Implementation Sequence

Suggested sequence after the current NPC/social and magic/civic/travel queues:

1. `0.5.208 - Quest Event Chronicle Authority Boundary Decision`
   - docs-only;
   - define ownership among quest definitions, objectives, contracts, events, storylets, rumors, Chronicle templates, rewards/consequences, and player runtime state.

2. `0.5.209 - Quest Definition Schema Decision`
   - docs-only;
   - decide collection path, wrapper, id pattern, status, giver/contact posture, and non-goals.

3. `0.5.210 - Objective And Condition Schema Decision`
   - docs-only;
   - decide whether objectives are embedded or separate records and how conditions are represented.

4. `0.5.211 - Reward And Consequence Descriptor Decision`
   - docs-only;
   - descriptive reward/consequence envelopes only.

5. `0.5.212 - Quest Schema And Validator`
   - schema/validator/tests only after decisions land.

6. `0.5.213 - First Quest Content Seed Plan`
   - docs-only.

7. `0.5.214 - First Quest Content Seed`
   - narrow seed and focused tests.

8. `0.5.215 - Contract And Task Board Boundary Decision`
   - docs-only.

9. `0.5.216 - Event Storylet Chronicle Boundary Decision`
   - docs-only.

10. `0.6+`
    - quest state, objective tracking, reward payout, event scheduling, map markers, Chronicle writing, quest UI, generated contract instances, narrative consequences.

## 24. Open Questions

- Does the repo already have a live quest definition collection? If so, where and with what current schema?
- Are quest objectives currently embedded or separate?
- Are rewards already executable anywhere, or descriptive only?
- Are quest-giver ids currently free-form or resolvable to an authority?
- Should first quest authority live under `player`, `civilization`, `world`, or another existing namespace?
- Should contracts be a subtype of quest or a separate template authority?
- Should storylets live under `world`, `player`, or `civilization`?
- Should Chronicle templates be narrative authority or player runtime state templates?
- How should rumors relate to NPC/social rumor seeds and Knowledge snippets?
- Which single existing or planned quest is safest for a first content seed?

## 25. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.208 - Quest Event Chronicle Authority Boundary Decision`

Goal:
Create a docs-only design decision defining the canonical boundary among quest definitions, quest arcs, objectives, conditions, reward/consequence descriptors, contracts/task boards, events/storylets, rumor hooks, Chronicle/journal templates, NPC/dialogue/Knowledge hooks, and future player quest/event/Chronicle runtime state.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/quest-event-chronicle-authority-boundary-decision.md`

Required decisions:

1. Whether an existing quest collection already owns authored quest definitions.
2. Whether quest definitions and player quest state must remain separate.
3. Whether objectives and conditions should be embedded or future separate authorities.
4. Whether rewards/consequences remain descriptive envelopes in `0.5.x`.
5. Whether contracts/task boards remain separate from unique authored quests.
6. Whether events/storylets remain authored seeds and not runtime event execution.
7. Whether Chronicle/journal templates remain separate from player Chronicle state.
8. Whether rumors/hooks remain authored discovery seeds only.
9. Whether quest-giver/contact references must wait for person/NPC authority or remain presentation metadata.
10. Whether all first-pass narrative records reject runtime/gameplay/reward/state fields.
11. Which schema decision should come next after the boundary document.

Suggested commit message:

`docs(quests): decide narrative authority boundaries`

## External References Used By Deep Research

- Failbetter StoryNexus / quality-based narrative public design material
- Ink and Yarn Spinner documentation for authored branching text concepts
- Tabletop fronts, clocks, and adventure-hook design patterns
- MMO quest-board and repeatable-task patterns
- Open-world event-hook and radiant/procedural quest patterns
- CRPG journal/objective/stage models
- General reward-design and content-authority validation guidance
