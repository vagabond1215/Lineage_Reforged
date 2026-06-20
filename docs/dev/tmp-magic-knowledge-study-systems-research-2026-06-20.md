# Temporary Deep Research: Magic, Knowledge, Study, Trials, Prestige, and Learning Systems

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research run from the user-provided magic/Knowledge/study/trials/Prestige prompt.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The research pass examined magic, Knowledge, study, spell access, trials, Prestige, magical traditions, magical institutions, spellcasting readiness, ritual learning, discovery, progression, rewards, magical items, religious/magical overlap, guild/institution overlap, and player advancement for Lineage Reforged.

The repository is not a blank slate for magic. It already contains several live or planned magic-adjacent authorities:

- live spell catalog and spell metadata under player spell authority;
- known-spell ownership validation/projection helpers;
- world-level magic service descriptors through `world.magic_infrastructure`;
- simple skill-mastery trials including magic and knowledge trial examples;
- item magic metadata such as conduits, catalysts, casting tags, and compatibility support;
- a Knowledge framework with planned `knowledge_domain.arcane_lore`, `spell` subject support, discovery sources, progression weights, evidence, and readiness-policy concepts;
- strict boundary language separating access, ownership, understanding, evidence, readiness, and runtime execution.

The strongest recommendation is to preserve and sharpen that layered architecture. Do not create a single monolithic magic authority. Instead, keep:

1. spell identity separate from spell ownership;
2. spell ownership separate from study access;
3. study access separate from Knowledge understanding;
4. Knowledge understanding separate from readiness;
5. readiness separate from runtime spellcasting;
6. rituals separate from ordinary spell access;
7. magical institutions separate from spell authority;
8. Prestige/renown separate from magic until a dedicated recognition system exists.

The safest next Codex pass is:

`Version 0.5.204 - Magic Study Authority Boundary Decision`

This should be documentation-only.

## 2. Repo-State Boundary

The Deep Research report had direct evidence for several magic, Knowledge, spell, trial, item-magic, and boundary artifacts, but Codex must inspect the live checkout before creating any permanent design document.

Important live areas to verify again:

- `packages/content/base/world/magic_infrastructure.json`
- `packages/content/base/player/spells*` or equivalent spell catalog paths
- known-spell helpers and tests
- player trial content and shared trial contracts
- `packages/content/base/knowledge/**`
- Knowledge registry/snippet/evidence/readiness policy schemas and validators
- item magic metadata validators and support files
- spell hook support validators
- Religion and sacred-site decisions that explicitly forbid religious Knowledge or sacred sites from granting spell access
- civic/economy/family/travel boundary docs that constrain institutions, guilds, family Prestige, and runtime state

Codex must treat this artifact as planning input, not final canon and not proof that a future collection exists.

## 3. Current Gaps And Risks

### Main risks

1. **Monolithic magic authority**
   Collapsing spell catalog, study, rituals, institutions, Knowledge, Prestige, and runtime casting into one collection would violate existing boundary doctrine.

2. **Knowledge-to-spell-access leakage**
   Knowledge snippets may reveal spell facts, lore, patterns, components, or study context. They must not grant known-spell ownership, spell readiness, Prestige, rewards, or runtime casting.

3. **Access-to-ownership leakage**
   A book, teacher, institution, sacred site, ritual, item, or guild relationship may provide access or evidence, but must not silently create a known-spell record.

4. **Religion-to-magic leakage**
   Religious Knowledge, sacred sites, deity association, religious hotspots, and future religious orders must not grant spell access, spell readiness, alignment effects, favorability, or services without a later dedicated decision.

5. **Prestige ambiguity**
   Family Prestige, account prestige, civic/faction reputation, institutional standing, and magic recognition must not be merged into a magic unlock economy prematurely.

6. **Runtime state leakage**
   Player spellbook state, spell readiness, trial attempts, study completion, Prestige totals/spends, attunement, spell preparation, casting cooldowns, magical fatigue, and rewards are future runtime/save concerns.

## 4. Recommended Magic / Knowledge / Progression Hierarchy

Recommended hierarchy:

```text
Spell Catalog / Spell Identity
  -> Study Source Access
    -> Study Policy / Study Path
      -> Acquisition Evidence
        -> Known Spell Ownership
          -> Cast Readiness
            -> Runtime Cast Resolver

Arcane Lore Knowledge informs understanding, not ownership.
Institutions provide venue/teacher/sponsorship, not automatic ownership.
Items provide conduit/catalyst/focus compatibility, not automatic ownership.
Rituals form a separate high-ceremony procedure lane.
Prestige remains separate until a dedicated recognition authority exists.
```

Recommended ownership split:

- existing spell catalog owns spell identity;
- known-spell helpers or future known-spell records own character-scoped ownership;
- future magic-study authority owns learning pathways and evidence posture;
- Knowledge owns semantic understanding and discoverable facts;
- item authority owns magical tools, conduits, catalysts, focuses, reagents, and compatibility metadata;
- world magic infrastructure owns descriptive service context;
- future institutions are owned by civic/institution authority;
- player runtime/save owners later track active spellbook, trial attempts, study state, Prestige state, readiness, and casting.

## 5. Magic Authority Model

Magic authority should remain layered.

Current or future magic identity should distinguish:

- spell;
- spell family;
- magic domain or school;
- tradition/practice;
- study source;
- study path or study policy;
- ritual;
- magical service/infrastructure;
- magical institution;
- conduit/catalyst/focus/reagent;
- known-spell ownership;
- runtime spell state.

A future `magic.traditions` or equivalent collection should not be the first implementation candidate unless the live repo proves it is needed. The first implementation should be closer to the known gap: magic study access and evidence.

## 6. Spell And Spell-Access Model

Recommended conceptual model:

- **spell identity**: static spell authority;
- **spell facts**: revealed through Knowledge;
- **spell access pathway**: source that may support learning;
- **study requirement**: work needed to convert access into evidence;
- **trial requirement**: optional challenge gate;
- **known spell ownership**: explicit character-owned record;
- **readiness**: computed state from ownership, conduit/catalyst/control/hook support, and runtime constraints;
- **execution**: future runtime resolver.

Do not allow spell records to own:

- player-specific known/unknown state;
- active preparation;
- current cooldowns;
- spellbook contents;
- automatic rewards;
- current attunement;
- current fatigue/cost;
- runtime casting behavior.

## 7. Knowledge And Discovery Integration

Arcane Lore should be the main Knowledge-side layer for magic understanding.

Knowledge may reveal:

- spell identity;
- spell category;
- associated domain/school/tradition;
- required catalyst/focus families;
- visible casting pattern;
- study hints;
- institution or teacher context;
- ritual context;
- historical or religious associations;
- risks/restrictions in descriptive form.

Knowledge must not directly grant:

- known spell ownership;
- spell access mutation;
- spell readiness;
- spellbook entries;
- Prestige;
- rewards;
- favorability;
- alignment effects;
- services;
- item creation;
- runtime casting.

Future Arcane Lore snippets should use existing Knowledge snippet schema rules and discovery sources such as book study, teacher instruction, institutional study, scroll study, tome study, combat observation, travel observation, or ritual discovery only where supported by live schema vocabulary.

## 8. Magic Study Model

Magic study should become the next focused boundary.

Recommended study-source modes:

- book study;
- scroll study;
- tome study;
- teacher instruction;
- institutional study;
- supervised practice;
- ritual participation;
- combat observation;
- field observation;
- sacred-site or religious study where canon supports it;
- experimental study if later approved.

Recommended first-pass concepts:

- source mode;
- source kind;
- allowed subject kinds;
- required Knowledge;
- required skill/trial state;
- support/scaffolding profile;
- risk profile;
- evidence output rule;
- no direct ownership or runtime mutation.

Potential future collection:

`player.magic_study_sources` or similar, subject to live repo conventions.

## 9. Trials And Challenge Gates

Trials already exist in simple form. Future trial planning should keep trials separate from study and ownership.

Trials may later represent:

- Knowledge trials;
- magic trials;
- religious trials;
- institution admission trials;
- spell-readiness trials;
- rite-of-passage trials;
- field trials;
- combat trials;
- crafting/alchemy trials.

A trial may provide evidence or meet a prerequisite. It must not automatically grant rewards, Prestige, spell ownership, spell access, item creation, Chronicle output, or runtime effects unless a later implementation explicitly allows that path.

## 10. Prestige And Progression Boundaries

Prestige must remain outside first-pass magic authority.

Relevant prestige-like systems may include:

- family/account Prestige;
- institution standing;
- guild rank;
- religious reputation;
- civic/faction reputation;
- magical recognition;
- trial recognition;
- player progression.

Do not use Prestige as a side channel for spell access in `0.5.x`.

Future magic-recognition or renown may be considered only after:

- Prestige/renown authority is designed;
- family Prestige boundaries are preserved;
- civic/faction reputation boundaries are preserved;
- institution/guild membership boundaries are designed;
- Knowledge and study evidence remain separate.

## 11. Religion, Sacred Sites, And Magic Overlap

Religion and magic can reference each other but must not absorb each other.

Allowed future descriptive links:

- deity-associated magical lore;
- sacred-site learning context;
- temple/monastery instruction context;
- religious ritual associations;
- religious taboo/prohibition notes;
- pilgrimage as study context;
- religious order as institutional sponsor where approved.

Forbidden first-pass effects:

- religious favor grants spell access;
- sacred-site visit grants known spell;
- hotspot dominance implies spell school;
- deity association grants spell readiness;
- religious Knowledge grants Magic Study completion;
- pilgrimage grants spell/reward/favorability/alignment.

## 12. Institutions, Guilds, And Teachers

Magical institutions should not be stored inside spell records.

Future magical institutions may include:

- schools;
- academies;
- circles;
- guilds;
- religious orders;
- temples;
- monasteries;
- mentor lineages;
- apprenticeships;
- family traditions;
- licensed or restricted practices.

Recommended boundary:

- civic/institution authority owns institution identity;
- guild authority owns guild identity;
- family authority owns family/tradition context;
- religion owns religious identity;
- magic study authority references those as sources or sponsors;
- spell authority does not own teachers or institutions directly except through supported reference fields.

## 13. Items, Crafting, Alchemy, And Magical Tools

Magic already touches item metadata through conduit and catalyst profiles.

Recommended separation:

- items own physical object identity;
- magic metadata owns conduit/catalyst/focus compatibility;
- crafting owns transformation/recipe authority;
- economy owns commodities/value/availability;
- Knowledge owns item/spell/lore understanding;
- magic study may require tools or reagents;
- runtime casting consumes or checks items later.

Potential future item-adjacent concepts:

- focuses;
- catalysts;
- conduits;
- reagents;
- scrolls;
- grimoires;
- ritual tools;
- enchanted equipment;
- alchemical ingredients;
- recipe/spell discovery links.

Do not implement item consumption, catalyst depletion, spell component costs, or enchanted-item effects in the study boundary pass.

## 14. Player State And Runtime Progression

Future player runtime/save state may track:

- known spells;
- studied topics;
- study attempts;
- study evidence;
- trial attempts/completions;
- spell readiness;
- prepared spells;
- attunement;
- magical fatigue/cost;
- active restrictions;
- teacher/institution memberships;
- discovered Knowledge;
- hidden or partial spell facts;
- Prestige or recognition if later approved.

Static content must not store mutable player state.

## 15. Proposed Content Collections And Schema Concepts

Recommended future candidates:

| Collection | Likely path | Priority | Purpose |
|---|---|---:|---|
| existing spell catalog | live player/content path | current | authored spell identity |
| existing known-spell helper/records | live helper/state path | current | character-scoped ownership validation |
| existing `knowledge_domain.arcane_lore` | Knowledge registry | near | semantic arcane understanding |
| `player.magic_study_sources` | future player/content path | high | stable source/access descriptors |
| `player.magic_study_policies` | future player/content path | high | requirements and evidence rules |
| `player.magic_study_templates` | future player/content path | later | narrative/checkpoint study shapes |
| `player.rituals` or `magic.rituals` | future path, decide later | later | high-ceremony magical procedures |
| `civilization.institutions` | future civic path | later | magical institutions via generic institution authority |
| `player.arcane_lore_snippets` or Knowledge snippets | existing Knowledge path | after activation | Arcane Lore snippet content |
| `player.magic_state` | runtime/save | 0.6+ | mutable player magic state |
| `player.spellbook` | runtime/save | 0.6+ | active spellbook/preparation state |
| `player.study_state` | runtime/save | 0.6+ | mutable study progress |
| `player.trial_state` | runtime/save | 0.6+ or existing trial state owner | mutable trial progress |
| `player.prestige_state` | runtime/save | defer | Prestige/recognition totals/spends if ever approved |

The next permanent decision should choose the first implementation candidate between `magic_study_sources`, `magic_study_policies`, or a combined decision.

## 16. Validation And Test Strategy

Future validators should eventually enforce:

1. strict records-only wrappers;
2. canonical id/slug agreement;
3. supported source modes;
4. supported source kinds;
5. supported subject kinds;
6. source references resolve only when source authorities exist;
7. spell references resolve to active spell authority;
8. Knowledge references align with subject/domain rules;
9. study prerequisite references resolve;
10. trial references resolve and remain separate from execution;
11. item/focus/reagent references resolve to valid item authorities;
12. sacred-site/religion references are active and descriptive-only;
13. institution/teacher references are not free strings once authority exists;
14. no player state fields in static content;
15. no direct spell ownership grants;
16. no spell readiness or runtime casting fields;
17. no Prestige spending/granting in first-pass records;
18. no reward/effect/favorability/alignment fields unless later explicitly approved.

Forbidden first-pass fields:

- `knownSpellGrant`;
- `spellbookMutation`;
- `spellAccessMutation`;
- `readyToCast`;
- `castRuntimeEffect`;
- `prestigeAward`;
- `prestigeCost`;
- `trialExecution`;
- `religiousFavorEffect`;
- `alignmentEffect`;
- `questReward`;
- `inventoryMutation`;
- `studyProgressState`;
- `playerMagicState`;
- `uiState`;
- `storageState`;
- `gameplayEffects`.

## 17. Authored-Vs-Generated Strategy

Fully authored:

- spells;
- world magic infrastructure;
- study source descriptors;
- study policies;
- ritual descriptors;
- Arcane Lore snippets;
- institution identities when that authority exists;
- item magic metadata.

Derived:

- readiness summaries;
- eligible study sources;
- Knowledge progress summaries;
- prerequisite satisfaction summaries;
- study advice/availability projections.

Generated once and saved later:

- minor study texts;
- scroll/tome descriptors;
- teacher/institution offerings;
- ritual variants;
- lore seed candidates.

Runtime/save later:

- known spell acquisition;
- study attempts;
- evidence acquisition;
- trial results;
- casting history;
- spellbook/prepared state;
- Prestige totals/spends;
- magical fatigue/cost;
- UI projections.

## 18. Gameplay Integration Roadmap

Near term:

- Magic Study Authority Boundary Decision;
- Arcane Lore activation or boundary decision;
- study-source schema decision;
- study-policy schema decision;
- narrow validators.

Mid term:

- Arcane Lore snippet seeds;
- study-source/policy schema and validators;
- study evidence proposal helpers;
- ritual boundary decision;
- ritual schema decision;
- institution reference policy.

Long term:

- player magic study state;
- known-spell acquisition connection;
- spellbook UI;
- study UI;
- trial UI;
- spell readiness UI;
- runtime casting resolver;
- Prestige/recognition integration if approved;
- ritual execution runtime.

## 19. Recommended Versioned Implementation Sequence

Suggested sequence after the current queue:

1. `0.5.204 - Magic Study Authority Boundary Decision`
   - docs-only;
   - decide boundaries among spell catalog, known-spell ownership, Arcane Lore, study sources, study policies, rituals, institutions, items, Prestige, and player runtime state.

2. `0.5.205 - Magic Study Source Schema Decision`
   - docs-only;
   - decide first source-mode vocabulary and wrapper path.

3. `0.5.206 - Magic Study Policy Schema Decision`
   - docs-only;
   - decide prerequisites/evidence output posture.

4. `0.5.207 - Arcane Lore Activation Decision`
   - docs-only or content decision, depending on live registry status.

5. `0.5.208 - Magic Study Source Schema And Validator`
   - schema/validator/tests;
   - no broad content seed.

6. `0.5.209 - Magic Study Policy Schema And Validator`
   - schema/validator/tests.

7. `0.5.210 - First Arcane Lore Snippet Seed Plan`
   - docs-only.

8. `0.5.211 - First Arcane Lore Snippet Seed`
   - narrow content seed only.

9. Later `0.5.x`
   - ritual authority boundary;
   - institution reference policy;
   - magic study evidence helper;
   - known-spell acquisition integration decision.

10. `0.6+`
    - player spellbook state;
    - spellcasting runtime;
    - study runtime;
    - trial execution expansion;
    - Prestige/recognition integration;
    - spell UI.

## 20. Open Questions

- Should the first magic implementation candidate be `magic_study_sources`, `magic_study_policies`, or both?
- Should Arcane Lore activation happen before study-source schema work?
- Is `player.*` the correct namespace for future static magic-study records, or should a `magic.*` authority namespace be introduced?
- How should study evidence connect to existing `training_event` acquisition evidence?
- Should rituals live under `magic`, `player`, `religion`, or a separate procedure authority?
- Should magical institutions wait for generic `civilization.institutions`?
- Should Prestige ever influence magic, or remain purely external recognition?
- How should religious magic be represented without leaking religious favor into spell access?
- Which current spell is safest for an Arcane Lore snippet seed?

## 21. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.204 - Magic Study Authority Boundary Decision`

Goal:
Create a docs-only decision defining the canonical boundary between existing spell catalog authority, known-spell ownership, Arcane Lore Knowledge, magic study sources, magic study policies, rituals, institutions/teachers, item magic metadata, Prestige/recognition, and future player magic runtime state.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/magic-study-authority-boundary-decision.md`

Required decisions:

1. Whether magic study should be the first implementation candidate after this research.
2. Whether `magic_study_sources`, `magic_study_policies`, or a combined path should be the first schema-decision target.
3. Whether Arcane Lore activation should happen before or after study-source schema work.
4. Whether spell catalog authority remains separate from known-spell ownership.
5. Whether known-spell ownership remains separate from study access and study evidence.
6. Whether rituals are a separate future authority from spells and study sources.
7. Whether magical institutions must wait for generic institution authority.
8. Whether item magic metadata can be referenced without item consumption/runtime behavior.
9. Whether Prestige remains outside magic in `0.5.x`.
10. Whether Knowledge snippets remain informational and never grant spell access, spell readiness, Prestige, or rewards.
11. Which schema decision should come next after the boundary document.

Suggested commit message:

`docs(magic): decide study authority boundaries`

## External References Used By Deep Research

- Magic in Dungeons & Dragons: https://en.wikipedia.org/wiki/Magic_in_Dungeons_%26_Dragons
- Ars Magica: https://en.wikipedia.org/wiki/Ars_Magica
- Wenger-Trayner Introduction to Communities of Practice: https://wenger-trayner.com/introduction-to-communities-of-practice/
- Cognitive apprenticeship: https://en.wikipedia.org/wiki/Cognitive_apprenticeship
- A Framework for Facilitating Self-Regulation in Responsive Open Learning Environments: https://arxiv.org/abs/1407.5891
- Munich Manual of Demonic Magic: https://en.wikipedia.org/wiki/Munich_Manual_of_Demonic_Magic
- The Sword of Moses: https://en.wikipedia.org/wiki/The_Sword_of_Moses
- Character class / prestige-class context in Dungeons & Dragons: https://en.wikipedia.org/wiki/Character_class_%28Dungeons_%26_Dragons%29
- MDA framework: https://en.wikipedia.org/wiki/MDA_framework
