# Temporary Deep Research: Civic Authority, Polities, Law, Factions, and Public Order

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research run from the user-provided civic/polity/law/faction prompt.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The research pass examined polities, governance, law, civil authority, factions, institutions, guild power, courts, crime, justice, citizenship/status, diplomacy, conflict, military authority, public order, and social-power systems for Lineage Reforged.

The main conclusion is that Lineage Reforged should not begin civic work with crime mechanics, faction reputation effects, guard AI, legal status mutation, diplomacy runtime, taxation mechanics, or law enforcement behavior. It should begin with a docs-only authority boundary decision that places civic and political authority on top of existing geography, economy, religion, and family lanes without duplicating their ownership.

Recommended first architecture:

1. Physical geography remains owned by existing world/geography authority.
2. Polities become world-level political identities.
3. Governments become civic-organizational owners of offices and authority style.
4. Jurisdictions define where and to whom law applies.
5. Law codes and local laws remain descriptive text authorities.
6. Factions, guilds, and institutions remain distinct social/civic actors.
7. Guard/garrison/public-order records remain descriptive.
8. Diplomatic relations and conflicts become relation overlays.
9. Player legal status and faction reputation remain future runtime/save state.
10. Knowledge remains informational until a dedicated subject decision.

The best next Codex pass is:

`Version 0.5.201 - Civic Authority Boundary Decision`

## 2. Repository Inspection Caveat

The Deep Research report noted that GitHub was enabled, but the repository file tree for the polity/law lane was not cleanly enumerated into the research context. Repo-derived findings in the report therefore rely on already-inspected design docs and the current research brief rather than direct full-tree inspection.

Codex must treat this artifact as planning input, not proof that any path or collection exists. The live checkout must be inspected before any permanent design document is written.

The user-provided research specification targeted these areas:

- `packages/content/base/world/**`
- `packages/content/base/civilization/**`
- `packages/content/base/player/**`
- `packages/content/base/factions/**`
- `packages/content/base/polity/**`
- `packages/content/base/law/**`
- `packages/content/base/governance/**`
- `packages/content/base/institutions/**`
- `packages/content/base/guilds/**`
- `packages/content/base/religion/**`
- `packages/content/base/economy/**`
- `packages/content/base/settlements/**`
- `packages/content/base/military/**`
- `packages/content/base/crime/**`
- `packages/content/base/quests/**`
- `packages/schemas/**`
- `tools/content-lint/**`
- `tests/unit/**`
- `docs/design/**`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## 3. Previously Verified Repo Context

Earlier inspected design documents establish important adjacent boundaries:

- Geography already has substantial place/spatial support: `world.regions`, `world.region_localities`, settlements, `world.world_map_features`, `world.world_hexes`, `world.world_hex_edges`, `world.travel_networks`, ecology/climate/biome content, flora/fauna, encounter/spawn layers, religious hotspots, and sacred sites.
- Economy already has settlement economy fields, workplaces, production chains, guilds, market item values, economy rules, ecology/trade metadata, and runtime economy/trade systems.
- Family work already distinguishes player ancestry/species `lineageId` from genealogical lineage, and it treats account families, Family Prestige, estate state, source-run inheritance, and Bloodlines UI as mutable state/presentation, not static civilization authority.

Civic authority must sit on top of those lanes without taking over their data.

## 4. Current Gaps And Risks

### Main risks

1. **Authority duplication**
   Polities, governments, jurisdictions, laws, guilds, factions, institutions, guard forces, and diplomacy can easily duplicate each other unless boundaries are explicit.

2. **Polity/faction collapse**
   A polity is not just a faction. A guild is not just a faction. A government is not the same as a polity. An institution is not the same as a guild.

3. **Law/runtime conflation**
   Law records should not execute arrests, penalties, bounties, guard responses, wanted status, faction reputation effects, tax collection, or court outcomes.

4. **Settlement-government ambiguity**
   Settlements may have local offices, charters, market rights, militia/watch structure, and courts without being sovereign polities.

5. **Overlapping jurisdiction complexity**
   Civil, customary, guild, religious, military, road/port, and settlement jurisdictions may overlap. This should be modeled deliberately rather than flattened into a single law owner.

6. **Sensitive law/crime content**
   Crime and punishment content should remain category-level and descriptive until canon requires detail and a dedicated implementation pass exists.

## 5. Recommended Civic / Political Hierarchy

Recommended layered hierarchy:

- physical geography and place anchors;
- polities;
- governments;
- political regions / claims;
- jurisdictions;
- law codes;
- local laws / ordinances;
- courts and offices;
- guard forces / garrisons / public-order descriptors;
- factions;
- guilds;
- institutions;
- diplomatic relations;
- conflicts;
- future player legal status;
- future faction reputation.

A polity owns political identity. A government owns how authority is organized. A jurisdiction owns legal scope. A law code owns descriptive legal doctrine or customs. A faction owns organized social/political interest. A guild owns trade/craft/merchant corporate identity. An institution owns civic/religious/administrative body identity. Runtime systems later consume these authorities but do not define them.

## 6. Polity Authority Model

A future `world.polities` collection should cover more than kingdoms.

Possible polity forms:

- kingdom;
- realm;
- city-state;
- confederation;
- tribe/tribal confederacy;
- empire;
- council republic if canon supports it;
- noble domain;
- religious temporal authority if canon supports it;
- trade league;
- autonomous settlement;
- vassal entity;
- frontier zone or occupied/disputed territory as overlay.

Recommended boundary:

- Polity owns stable political identity.
- Region/locality owns physical place identity.
- Government owns offices/authority style.
- Faction owns organized interest or pressure group.
- Political region/claim owns territorial control or claim relationship.

## 7. Governance And Settlement Authority

Settlement government should be descriptive and local.

Possible future concepts:

- ruler;
- council;
- magistrate;
- settlement charter/status;
- local offices;
- guard/militia authority;
- tax/toll/fee posture;
- market rights;
- guild privileges;
- religious privileges;
- local laws;
- courts;
- jail/prison presence;
- public works;
- emergency powers;
- wartime control;
- autonomy from larger polity.

Do not make settlement-government records enforce law, collect taxes, grant permissions, create access, or mutate player status.

## 8. Law And Jurisdiction Model

Recommended law model:

- `civilization.jurisdictions` define where and to whom law applies.
- `civilization.law_codes` define broader legal/customary/religious/guild/military law packages.
- `civilization.local_laws` or ordinances define narrower scoped law statements.
- Courts and institutions reference jurisdictions.
- Jurisdictions may overlap and should include priority/conflict notes when needed.

Possible law scopes:

- civil law;
- customary law;
- local ordinances;
- guild law;
- religious law/custom;
- military law;
- noble privilege;
- court jurisdiction;
- settlement jurisdiction;
- road/port/customs jurisdiction.

Descriptive-only first pass. No enforcement, penalties, bounties, arrests, UI flags, or legal-state mutation.

## 9. Crime, Justice, And Punishment

First-pass crime/justice content should be category-level and optional.

Possible descriptive categories:

- theft;
- trespass;
- assault/violence;
- smuggling/restricted goods;
- debt/default;
- fraud;
- sacrilege or religious offense only if setting canon requires it;
- outlawry/exile;
- public-order offenses.

Possible sanction families:

- fine;
- restitution;
- temporary detention;
- exile/outlawry;
- imprisonment;
- corporal punishment only if canon explicitly requires it and later implementation boundaries are set.

Do not implement wanted status, guard AI, bounty systems, arrest mechanics, court procedures, punishment mechanics, or faction/favorability effects.

## 10. Factions, Institutions, And Guilds

Keep these separate:

- **Factions**: organized political/social interests, pressure groups, criminal groups if canon supports them, rebel/civic/ideological actors.
- **Guilds**: trade/craft/merchant corporate bodies, apprenticeship/standards/market power, local presences.
- **Institutions**: civic, religious, administrative, scholarly, judicial, charitable, or mercantile bodies that are not necessarily guilds or factions.
- **Noble houses/clans/dynasties**: family/political overlays that should not replace polities or governments.
- **Military orders/guard forces**: armed organization descriptors, not combat/AI owners.

A single entity may have cross-links, but one canonical owner must be declared. Validation should prevent duplicate ownership across faction/guild/institution records.

## 11. Military And Public Order Authority

Future descriptive collections may include:

- `civilization.guard_forces`;
- `civilization.garrisons`;
- `civilization.military_orders`;
- militias;
- watchmen/watch forces;
- naval forces;
- fortress commands;
- border patrols;
- mercenary companies;
- route-security authorities.

These records may describe affiliation, coverage, readiness band, public-order posture, and route-security notes.

They must not spawn NPCs, generate encounters, run patrols, enforce law, create arrests, resolve combat, or mutate player state.

## 12. Citizenship, Status, Rank, And Rights

Future `civilization.statuses` or equivalent can describe:

- citizenship;
- subjecthood;
- residency;
- noble status;
- commoner status;
- guild membership status;
- clergy status;
- outlaw/exile status;
- guest/foreigner status;
- chartered rights;
- market rights;
- tax obligations;
- military obligations;
- family/clan/noble-house status.

Keep rights/status descriptive in `0.5.x`. No access grants, discounts, law exemptions, faction reputation effects, or guard behavior.

## 13. Diplomacy, Claims, Borders, And Conflict

Diplomacy and conflict should be overlays, not embedded polity facts.

Future relation layers may include:

- political claims;
- borders;
- disputed regions;
- control/occupation overlays;
- vassal relationships;
- alliances;
- rivalries;
- truces;
- wars;
- succession disputes;
- trade disputes;
- religious conflicts;
- frontier/borderland postures.

Static records may describe relationships and history. Dynamic diplomacy runtime, war simulation, border mutation, and conflict events are future-only.

## 14. Economy, Trade, And Law Integration

Civic authority may later reference:

- taxes;
- tariffs;
- tolls;
- customs;
- market rights;
- guild monopolies;
- port fees;
- trade restrictions;
- restricted goods;
- smuggling;
- estate obligations;
- labor duties;
- road/bridge maintenance obligations;
- wartime requisition;
- famine/shortage legal responses.

Do not implement economic/legal mechanics in the civic pass. Economy owns production, values, and runtime trade/economy behavior. Civic authority may only describe legal/political overlays.

## 15. Family, Lineage, And Polity Integration

Civic authority may later reference:

- noble houses;
- clans;
- dynasties;
- succession claims;
- household status;
- family prestige;
- estate authority;
- marriage alliances;
- inheritance disputes;
- patronage;
- feud status.

Family and polity authorities must stay separate. Noble-house or dynastic records should not replace polity/government records. Player family/prestige/estate runtime state remains separate.

## 16. Religion And Civil Authority Integration

Civic authority may later reference:

- religious institutions;
- religious legal/social authorities;
- temple jurisdictions if canon supports them;
- sacred-site protections;
- religious exemptions;
- oaths/vows;
- religious courts/customs if canon supports them;
- pilgrimage-route protections;
- clergy privileges;
- conflicts between civil and religious law.

Religion/sacred-site authorities remain descriptive and non-mechanical unless a later dedicated religion-law decision changes that.

## 17. Knowledge System Integration

Possible future Knowledge subjects:

- `polity`;
- `government`;
- `jurisdiction`;
- `law_code`;
- `local_law`;
- `faction`;
- `guild`;
- `institution`;
- `status`;
- `diplomatic_relation`;
- `conflict_history`.

Knowledge should reveal identities, histories, scope, law summaries, faction/institution context, public vs hidden claims, and legal/status context.

Knowledge must not grant legal immunity, tax discounts, diplomacy standing, faction reputation, guard behavior changes, access, rank, reward, or gameplay benefits in the first pass.

## 18. Proposed Collections And Schema Concepts

Recommended candidates:

| Collection | Likely path | First-pass priority | Purpose |
|---|---|---:|---|
| `world.polities` | `packages/content/base/world/polities.json` | 1 | stable political identities |
| `world.political_regions` | `packages/content/base/world/political_regions.json` | 2 | claims/control overlays on geography |
| `civilization.governments` | `packages/content/base/civilization/governments.json` | 3 | authority style, offices, government organization |
| `civilization.jurisdictions` | `packages/content/base/civilization/jurisdictions.json` | 4 | legal scope and applicability |
| `civilization.law_codes` | `packages/content/base/civilization/law_codes.json` | 5 | descriptive law/custom packages |
| `civilization.local_laws` | `packages/content/base/civilization/local_laws.json` | 6 | narrower ordinances/rules |
| `civilization.courts` | `packages/content/base/civilization/courts.json` | later | court institutions and jurisdiction links |
| `civilization.factions` | `packages/content/base/civilization/factions.json` | later | social/political actors |
| `civilization.institutions` | `packages/content/base/civilization/institutions.json` | later | civic/religious/administrative bodies |
| `civilization.guilds` | existing or future normalized path | later | guild identities/presences |
| `civilization.guard_forces` | `packages/content/base/civilization/guard_forces.json` | later | public-order descriptors |
| `civilization.garrisons` | `packages/content/base/civilization/garrisons.json` | later | military-site descriptors |
| `civilization.statuses` | `packages/content/base/civilization/statuses.json` | later | civic/legal/social status vocabulary |
| `civilization.diplomatic_relations` | `packages/content/base/civilization/diplomatic_relations.json` | later | polity/faction relation overlays |
| `civilization.conflicts` | `packages/content/base/civilization/conflicts.json` | later | historical/descriptive conflict overlays |
| `player.legal_status` | runtime/save state | 0.6+ | mutable player legal state |
| `player.faction_reputation` | runtime/save state | 0.6+ | mutable player faction standing |

## 19. Validation And Test Strategy

Future validators should eventually enforce:

1. strict records-only wrappers and canonical id/slug agreement;
2. active parent authority and valid anchor references;
3. polity/region/settlement reference coherence;
4. jurisdiction owner and scope coherence;
5. law-code owner coherence;
6. local law references to valid jurisdiction and optional law code;
7. court/judge/official references only after those authorities exist;
8. faction/guild/institution duplicate-ownership checks;
9. guard/military force settlement or polity anchors;
10. border/claim/dispute coherence;
11. no invalid self-relations in diplomacy/conflict records;
12. no runtime enforcement fields in law authority;
13. no gameplay reward or reputation-effect fields in faction authority;
14. no crime/punishment/wanted/bounty mechanics in descriptive authority;
15. no tax/toll/tariff collection mechanics in descriptive authority.

Forbidden first-pass fields include:

- `wantedLevel`;
- `bountyAmount`;
- `arrestBehavior`;
- `guardAi`;
- `courtOutcomeTable`;
- `punishmentMechanics`;
- `fineCalculation`;
- `taxRateRuntime`;
- `tollCollectionRuntime`;
- `factionReputationDelta`;
- `legalStatusMutation`;
- `diplomacyTick`;
- `warSimulation`;
- `patrolSpawnTable`;
- `runtimeState`;
- `uiState`;
- `storageState`;
- `gameplayEffects`.

## 20. Authored-Vs-Generated Data Strategy

Fully authored:

- polities;
- governments;
- jurisdiction descriptions;
- law-code summaries;
- local law summaries;
- guild/faction/institution identities;
- major guard/garrison descriptors;
- formal diplomacy relationships;
- historical conflicts;
- civic statuses.

Derived:

- polity membership indexes;
- law lookup by jurisdiction;
- status/right tag rollups;
- jurisdiction overlap summaries;
- faction/guild/institution cross-reference indexes.

Generated once and saved later:

- minor settlement office rosters;
- inferred civic indexes;
- route-security bands from existing route/geography data.

Runtime-generated much later:

- wanted state;
- bounty/warrant records;
- guard patrols;
- active crime reports;
- court cases;
- dynamic diplomacy drift;
- war/conflict event state;
- player legal status;
- faction reputation changes.

## 21. Gameplay Integration Roadmap

Near term:

- descriptive civic authority;
- validated political identities;
- law/jurisdiction summaries;
- future Knowledge support.

Mid term:

- faction/guild/institution visibility;
- settlement governance context;
- diplomacy/conflict history;
- route-security descriptors;
- status/right vocabulary.

Long term:

- player legal status;
- wanted/bounty systems;
- guards and courts;
- fines/punishments;
- faction reputation;
- guild membership;
- political favor;
- noble status;
- taxation/tolls;
- diplomacy/war runtime;
- law/religion/economy/family integration.

## 22. Recommended Versioned Implementation Sequence

Suggested sequence:

1. `0.5.201 - Civic Authority Boundary Decision`
   - docs-only;
   - decide ownership for polities, governments, jurisdictions, laws, factions, guilds, institutions, guard forces, diplomacy/conflict, and player legal status.

2. `0.5.202 - Polity Schema Decision`
   - docs-only;
   - decide whether `world.polities` is the first schema lane.

3. `0.5.203 - Polity Schema And Validator`
   - schema/validator/tests;
   - no broad content seed.

4. `0.5.204 - First Polity Content Seed Plan`
   - docs-only;
   - select one safe polity candidate.

5. `0.5.205 - First Polity Content Seed`
   - add one narrow content seed and focused tests.

6. `0.5.206 - Government vs Jurisdiction Schema Decision`
   - docs-only;
   - prevent sovereignty/government/jurisdiction conflation.

7. `0.5.207 - Law Code And Local Law Schema Decision`
   - docs-only.

8. `0.5.208 - Faction Guild Institution Boundary Decision`
   - docs-only;
   - prevent duplicate ownership.

9. `0.5.209 - Diplomacy And Conflict Overlay Decision`
   - docs-only.

10. `0.6+`
    - player legal status;
    - faction reputation;
    - guards/courts/crime runtime;
    - diplomacy runtime;
    - war/conflict simulation;
    - taxation/toll runtime;
    - public-order UI.

## 23. Open Questions

- Does the repo already have hidden or non-obvious polity/governance/law/faction schemas?
- Are any political actors currently represented through guild, settlement, or runtime systems?
- Are settlement governments embedded in settlement records?
- Does current canon need kingdoms first, or should the first polity be a city-state/trade polity?
- Do any religious authorities currently assert civil/legal authority?
- Does the setting require courts and formal laws, or mostly customary law?
- Should civic Knowledge live under an existing Knowledge domain or a future political/social domain?
- Should legal status be player-only runtime state or also NPC runtime state later?
- Which collection is the safest first implementation candidate after the boundary decision?

## 24. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.201 - Civic Authority Boundary Decision`

Goal:
Create a docs-only decision defining the canonical boundary between `world.polities`, settlement government, jurisdictions, law codes, local laws, factions, guilds, institutions, guard/garrison descriptors, diplomatic relations, conflicts, and future player legal status.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/civic-authority-boundary-decision.md`

Required decisions:

1. Whether `world.polities` is the first implementation candidate.
2. Whether polity and government must remain separate.
3. Whether jurisdictions must exist before law-code schemas.
4. Whether factions, guilds, and institutions must remain distinct layers.
5. Whether diplomatic relations and conflicts are separate overlays.
6. Whether citizenship/status is descriptive-only in `0.5.x`.
7. Whether player legal status and faction reputation are deferred to `0.6+`.
8. Whether first-pass civic records reject runtime/gameplay/enforcement fields.
9. Which schema decision should come next after the boundary document.

Suggested commit message:

`docs(civics): decide polity and law authority boundaries`

## External References Used By Deep Research

- Legal pluralism: https://en.wikipedia.org/wiki/Legal_pluralism
- Decretum Gratiani: https://en.wikipedia.org/wiki/Decretum_Gratiani
- Jus commune: https://en.wikipedia.org/wiki/Jus_commune
- Municipal charter: https://en.wikipedia.org/wiki/Municipal_charter
- Magdeburg rights: https://en.wikipedia.org/wiki/Magdeburg_rights
- Luebeck law: https://en.wikipedia.org/wiki/L%C3%BCbeck_law
- Magna Carta: https://en.wikipedia.org/wiki/Magna_Carta
- Gild Merchant: https://en.wikipedia.org/wiki/Gild_Merchant
- Guilds in medieval Europe: https://en.wikipedia.org/wiki/Guilds_in_medieval_Europe
- Hanseatic League: https://en.wikipedia.org/wiki/Hanseatic_League
- ACLED Codebook: https://acleddata.com/knowledge-base/codebook/
- Correlates of War datasets: https://correlatesofwar.org/data-sets/
- China Historical GIS: https://chgis.fas.harvard.edu/
- Networks of border zones: https://arxiv.org/abs/1703.07526
- Complex Societies and the Growth of the Law: https://arxiv.org/abs/2005.07646
- Network Analysis in the Legal Domain: https://arxiv.org/abs/1501.05237
