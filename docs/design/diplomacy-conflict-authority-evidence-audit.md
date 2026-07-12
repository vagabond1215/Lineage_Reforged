# Diplomacy Conflict Authority Evidence Audit

Source version/run: Version 0.5.349 - Diplomacy Conflict Authority Evidence Audit
Date: 2026-07-12
Status: completed documentation-only evidence audit; zero candidate ids; owner-boundary decision selected

## 1. Audit Result

Current repository evidence supports one focused diplomacy-versus-conflict owner-boundary decision, but no canonical diplomatic relation, conflict identity/history record, or schema plan.

Carry forward exactly zero diplomatic-relation ids and zero `conflict.*` ids. No collection name or diplomatic-relation prefix is approved. Select `Version 0.5.350 - Diplomacy Conflict Authority Boundary Decision` next.

Diplomacy and conflict require separate future owners because they answer different questions:

- diplomacy describes a relation or recognized posture between canonical actors;
- conflict describes a distinct dispute, war, rebellion, occupation struggle, or other historical/ongoing conflict identity and its supported participants/history.

Neither owns claims, borders, territorial control, government, jurisdiction, law, forces, factions, places, battles, current hostility, negotiation execution, war simulation, or mutable world/player state.

## 2. Authority Surface Posture

- No dedicated diplomacy or conflict content collection exists.
- No diplomacy or conflict schema, validator, focused test, loader, or normal content-lint registration exists.
- No exact `diplomatic_relation.*`, `diplomacy.*`, `conflict.*`, or other approved relation/conflict id exists in canonical content.
- `world.polities` contains exactly two planned static identities, `polity.valtherion` and `polity.draemor`, and explicitly excludes diplomacy/conflict fields.
- `world_maps.json` contains four embedded `conflictZones` display summaries.
- The world-map schema and normal validator require each conflict-zone summary to have only `name`, `summary`, and resolving `regionIds`; they do not establish conflict identity or participants.
- The focused polity test explicitly proves a conflict-zone display name is not a valid polity/place authority id.
- No runtime diplomacy, war-state, treaty, negotiation, occupation, or political-conflict owner exists.

## 3. Evidence Inventory

| Surface | Exact posture | Classification | Authority result |
| --- | --- | --- | --- |
| `polity.valtherion` and `polity.draemor` | Two planned static polity identities with place anchors | Canonical static actor identities | Potential future relation/conflict participants only; no relation between them is authored. |
| Polity notes | Explicitly exclude diplomacy, claims, borders, control, runtime, events, and gameplay | Structural non-implication | Prevents inference from polity identity or form. |
| `world_maps.json` `conflictZones` | Four named summaries with region ids | Map display/reference descriptors | No stable conflict ids, canonical actors, participants, dates, status, cause, outcome, or history. |
| `Kaelvar Interior` | Settled southern powers compete with mobile tribal groups for routes, grazing, and minerals | Broad geographic pressure summary | Groups are unnamed and not canonical participant references. |
| `Talmyra Frontier Wars` | Confederacies, enclaves, and colonial outposts struggle over valleys | Broad geographic/historical-style summary | Name sounds conflict-like but lacks id, actors, dates, status, provenance, and outcome. |
| `Valtherion Border Kingdoms` | Border belts are prone to raids and succession wars | Broad regional risk/history summary | `region.valtherion` and `polity.valtherion` do not identify specific kingdoms, parties, wars, or diplomatic relations. |
| `Serpent's Wake Piracy Lanes` | Storms, raiders, and undersea powers create persistent hazard | Mixed route/hazard/security summary | Does not identify a conflict body, participants, polity pair, or diplomatic relation. |
| World-map schema/normal validation | Validates summary shape and region resolution | Map-authority guardrail | Makes the summaries valid map data, not canonical conflict records. |
| Polity focused test | `world-map conflict zones remain display summaries only` | Explicit non-inference test | Confirms zone names cannot become polity/place authority. |
| Region strategic notes | Kaelvar natural conflict zone; Valtherion border kingdoms/chokepoints | Region/place descriptors | No conflict or diplomacy identity. |
| Settlement raid/raider/piracy matches | Fort defense, anti-raider work, raider holds, pirate post, raid exposure | Place, economy, security, and activity descriptors | No diplomatic pair, conflict identity, participant graph, or history. |
| Quest raider note | Draws raiders away from wagons | Quest/tactical presentation | Encounter activity, not political conflict authority. |
| Quest counterfeit-ring raid | Raid scatters a criminal ring and affects a case | Quest branch/consequence presentation | Local enforcement activity, not war/conflict identity. |
| UI `diplomacy` description | “Conversations, diplomacy, and civic interactions” | Generic presentation vocabulary | No canonical relation, actor pair, or state owner. |
| Character-creator diplomacy/warfare/rivalry prose | Species/family flavor and generated-profile text | Presentation/backstory vocabulary | Cannot establish political actors, relations, or conflicts. |
| Encounter `alliedTemplateIds`, combat allies, and spawn `hostilityWeights` | Composition/disposition/selection vocabulary | Combat/encounter/spawn owners | “Allied” and hostility describe combat grouping, not diplomacy. |
| Reputation `wartime` modifier vocabulary | Mutable notoriety context | Reputation/runtime vocabulary | Does not establish a war or conflict identity. |
| Polity/faction forbidden `diplomacy` fields | Strict unknown/forbidden-field validation | Structural guardrail | Confirms owner separation; supplies no relation authority. |
| Civic and roadmap design examples | Alliance, rivalry, vassalage, recognition, truce, war, rebellion, occupation | Hypothetical future taxonomy | Supports boundary questions only; not canon or schema permission. |

## 4. World-Map Conflict-Zone Assessment

The four `conflictZones` are canonical **map descriptors** but not canonical **conflict records**.

Their exact contract requires:

- a free-standing display `name`;
- a descriptive `summary`;
- one or more resolving region ids.

It does not provide:

- stable record id or slug;
- canonical participant/actor references;
- relation to either live polity record;
- conflict kind under a controlled authority vocabulary;
- origin, cause, stakes, or claims;
- start/end/ongoing temporal posture;
- lifecycle distinct from historical validity;
- outcome, settlement, truce, occupation, or current status;
- provenance/non-implication posture;
- separation of historical summary from present conflict state.

The zone names must not be converted into ids. `Talmyra Frontier Wars` in particular sounds like a named conflict family, but its data shape does not prove whether it is one war, recurring conflicts, a map label, or a broad era descriptor. The correct posture is fail closed.

## 5. Diplomatic-Relation Assessment

A diplomatic relation would require at least two supported canonical actor references or another explicitly approved relation model, plus relation semantics and temporal/public posture. Current content supplies none.

- The two live planned polities are not stated to be allied, hostile, recognized, unrecognized, vassal-related, negotiating, or at war with one another.
- Region and map prose names broad groups such as powers, tribes, confederacies, enclaves, kingdoms, raiders, and undersea powers without canonical actor ids.
- “Allied” combat templates and combatant arrays are encounter composition, not political relations.
- UI, creator, reputation, test, and design vocabulary does not own a diplomatic pair or history.

No pair may be invented from geographic adjacency, polity form, region overlap, conflict-zone co-location, trade routes, shared enemies, prose, or genre convention.

## 6. Conflict Identity And History Assessment

A static conflict authority would need to distinguish one enduring or historical conflict identity from current combat, map pressure, a broad era, or runtime war state.

Current sources do not provide a complete gate:

- map zones have labels and summaries but no identity contract or participants;
- region/settlement prose describes threat, raiding, piracy, defense, and strategic pressure;
- quests describe local encounters, raids, cases, and tactical outcomes;
- combat/encounter/spawn systems own immediate actors, allies, hostility, composition, and outcomes;
- no durable conflict chronology, participant history, phase, resolution, or provenance exists;
- no static-versus-current state boundary is implemented.

Battles, raids, pirate activity, criminal actions, encounter groups, and combat results are not automatically political conflicts. A future conflict may reference them only after separate event/history owners exist.

## 7. Diplomacy Versus Conflict Boundary Question

The evidence supports separate future owner questions:

- **Diplomatic relation**: a relationship between canonical actors, potentially with kind, recognition/public posture, lifecycle/effective validity, provenance, and non-executing notes.
- **Conflict identity/history**: one canonical dispute/war/rebellion/occupation-struggle identity, participants and roles, supported temporal posture/history, provenance, and non-executing notes.

A diplomatic relation can exist without a conflict. A conflict can involve actors whose broader diplomatic relation is unknown, disputed, or changes over time. Ending a conflict does not automatically establish peace, alliance, recognition, or another diplomatic relation. Neither owner should absorb the other.

The next decision must determine whether either owner is content-independently schema-ready, whether references and temporal semantics are intrinsic, and whether both should fail closed pending authored input.

## 8. Claims, Borders, Control, And Occupation Boundary

Claims, borders, territory, control, and occupation remain separate overlays/state:

- a claim asserts a supported interest or right over a target;
- a border describes a political boundary relationship to physical geography;
- control/occupation describes a current or time-bounded political posture over a place;
- diplomacy describes actor relations;
- conflict describes a dispute/war identity and history.

These concepts may later reference one another, but none creates another. Map conflict regions do not establish borders or control. A war summary does not prove a claim. Occupation as a conflict event or state must not be stored as static conflict identity without an explicit history/state model.

No claim/border/control/occupation evidence audit or implementation is authorized here.

## 9. Runtime, Consumer, And Presentation Assessment

No current runtime system owns diplomacy or political conflict state.

The following remain separately owned or absent:

- combat ally/enemy disposition and encounter hostility;
- spawn hostility weights and candidate selection;
- quest branches, cases, rewards, reputation effects, and encounters;
- fame/notoriety and `wartime` modifier vocabulary;
- UI social/diplomacy labels and creator prose;
- current treaty, negotiation, recognition, alliance, rivalry, hostility, war phase, armies, battles, occupation, control, AI, events, and consequences;
- save/account history, Chronicle, Knowledge, map reveal, and player-known political state.

Consumer demand, a UI tab, an event label, or a runtime hook cannot mint diplomacy/conflict canon.

## 10. Candidate And Readiness Decision

- Accepted diplomatic-relation candidate ids: none.
- Accepted conflict candidate ids: none.
- Approved diplomacy/conflict collection paths or prefixes: none.
- Map conflict-zone names: rejected as candidate ids.
- Polity pair inference: rejected.
- Region/settlement/quest/creator/UI/combat/runtime vocabulary: rejected as separately owned or presentation-only.

Neither diplomacy nor conflict is schema-ready because actor/participant reference posture, cardinality, lifecycle versus effective temporal validity, historical-versus-current state, identity criteria, and overlap semantics remain unresolved.

One docs-only boundary decision is justified because permanent civic guidance already separates the owners and the completed audit now identifies the exact missing contract questions. A schema plan is premature.

## 11. Preserved Owner Boundaries

- Polity, faction, guild, institution, religion/order, business, family/house, and People/NPC retain actor identity.
- Regions, settlements, sites, maps, routes, and geometry retain physical/place identity and display summaries.
- Government, jurisdiction, law, court, and force remain distinct gated owners.
- Claims, borders, territory, recognition, vassalage, control, and occupation remain separate relationship/overlay questions.
- Quest, event, Chronicle, Knowledge, reputation, and UI retain their present content/state/presentation owners.
- Combat, encounter, spawn, tactics, parties, and equipment retain immediate action/composition owners.
- Runtime/save owners retain current relations, hostility, negotiation, treaties, war state, participants, armies, battles, occupation/control, AI, consequences, visibility, and player knowledge when such owners later exist.

No prefix normalization, alias, migration, compatibility behavior, reference, resolver, adapter, or consumer enablement is approved.

## 12. Research, User Question, Support, And Temporary Docs

Deep Research is not required before the boundary decision. The immediate issue is repository owner semantics, not comparative diplomacy or war taxonomy.

No explicit user question is required. The boundary decision can fail closed and may select an authored-input/ready-consumer deferral.

No support-suffix run is needed. Current validation is green and the audit is decision-complete.

No temporary diplomacy/conflict guardrail or research artifact was encountered or created. This permanent audit retains the classified evidence until materially new canon supersedes it.

## 13. Explicit Non-Goals

- no candidates, collection/prefix, content, schema, validator, test, registration, references, migrations, adapters, or consumers;
- no claims, borders, control, occupation, government, jurisdiction, law, court, force, faction, institution, place, map, quest, reputation, combat, event, runtime, UI, save/account, Chronicle, Knowledge, or gameplay implementation;
- no treaties, alliances, rivalries, recognition, vassalage, negotiation, current hostility, war state, armies, battles, AI, diplomacy tick, conflict simulation, consequences, or player political state;
- no gated-lane reopening, Deep Research, temporary artifact, support suffix, compatibility behavior, or `0.6.0` transition.

## 14. Audit Answers

1. No dedicated diplomacy or conflict authority exists.
2. No diplomacy/conflict schema, validator, focused test, content, or normal registration exists.
3. Exactly zero diplomatic-relation ids carry forward.
4. Exactly zero `conflict.*` ids carry forward.
5. The two live polities supply actor identity only and have no authored relation.
6. Four map conflict zones remain display/reference summaries, not conflict records.
7. Region/settlement raid, border, piracy, and threat prose remains place/security/economy context.
8. Quest raid and raider language remains quest/encounter presentation.
9. UI/creator diplomacy, warfare, and rivalry prose remains presentation.
10. Combat allies, encounter composition, spawn hostility, and reputation `wartime` vocabulary remain their existing owners.
11. Diplomacy and conflict require separate future owners.
12. Claims/borders/control/occupation remain separate.
13. Neither owner is schema-ready; a schema plan is premature.
14. One docs-only owner-boundary decision is justified.
15. Deep Research, an explicit user question, and a support suffix are not required.
16. No temporary artifact needs cleanup.
17. Select `Version 0.5.350 - Diplomacy Conflict Authority Boundary Decision`.

## 15. Next Recommended Version

Version 0.5.350 - Diplomacy Conflict Authority Boundary Decision
