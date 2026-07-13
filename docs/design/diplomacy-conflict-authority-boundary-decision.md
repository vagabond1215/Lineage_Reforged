# Diplomacy Conflict Authority Boundary Decision

Source version/run: Version 0.5.350 - Diplomacy Conflict Authority Boundary Decision
Date: 2026-07-12
Status: approved documentation-only owner boundary; separate future owners; zero ids; neither owner schema-ready

## 1. Decision Summary

Preserve two separate future static authorities:

- **diplomatic relation** owns one explicitly authored relationship posture between canonical actors during a supported effective period;
- **conflict identity/history** owns one explicitly authored dispute, war, rebellion, occupation struggle, succession conflict, or other conflict identity plus supported participant and historical posture.

Do not create a generic political-state umbrella and do not embed either owner as mutable arrays on polity records.

Carry forward exactly zero diplomatic-relation ids and zero `conflict.*` ids. No collection path or diplomatic-relation prefix is approved. Actor/participant references, direction/cardinality, and effective temporal semantics are intrinsic to both owners and remain unproven. Neither owner is schema-ready.

Select fail-closed `Version 0.5.351 - Diplomacy Conflict Authority Evidence Deferral` next.

## 2. Diplomatic Relation Boundary

A future diplomatic-relation record may eventually own:

- stable record identity if the approved contract requires one;
- exact canonical actor references;
- a controlled relation kind or posture;
- directionality or symmetry semantics appropriate to that kind;
- public/known/secret or other approved visibility posture;
- record lifecycle separate from effective temporal validity;
- supported start/end/open-ended validity posture;
- concise non-executing summary, provenance, and non-implication notes;
- later references to an authored treaty/agreement or conflict only after those owners exist and the relationship is explicitly approved.

A diplomatic relation describes an authored relationship, not current sentiment or behavior. It must remain independently reviewable from runtime reputation, hostility, negotiation, treaty execution, trade access, military cooperation, or AI.

### Actor boundary

Potential actors may later include polities or other canonical authorities only after a schema decision approves exact actor types. Current live polity records are potential targets, not evidence that a relation exists.

Do not infer a relation from:

- adjacency, shared place anchors, routes, trade, region overlap, or map placement;
- polity form, names, summaries, or planned status;
- a shared conflict-zone region;
- common enemies, similar religions/cultures, guild presence, or economic ties;
- combat ally/enemy arrays, spawn hostility, reputation, UI, creator prose, quests, or design examples.

### Direction and symmetry boundary

Direction/symmetry is semantic, not cosmetic:

- some future relations might be symmetric only when both sides share the same recognized posture;
- recognition, suzerainty/vassalage, protection, tribute, guarantee, or dependency-like relations may be directed or role-based;
- one actor's claimed posture must not silently become the other actor's accepted relation;
- inverse records, pair ordering, duplicate prevention, and contradictory concurrent relations require explicit rules.

No direction, role, inverse, or pair-key contract is approved here.

### Relation kind boundary

Alliance, rivalry, recognition, non-recognition, neutrality, truce, peace, guarantee, vassalage, suzerainty, tributary posture, and other examples remain hypothetical taxonomy. They are not approved enums or Lineage canon.

A treaty or agreement is not automatically the diplomatic relation itself. A treaty may later be a separate authored document/commitment owner. A truce may be represented as a relation, an agreement, a conflict phase, or a derived state only after a dedicated contract decides the owner.

## 3. Conflict Identity And History Boundary

A future conflict record may eventually own:

- stable canonical conflict identity, name/aliases when authored, and non-executing summary;
- controlled conflict kind after evidence supports vocabulary;
- canonical participant references and explicit roles;
- record lifecycle separate from historical/effective temporal posture;
- supported start/end/open-ended or uncertain-date posture;
- high-level historical phase or outcome facts only when explicitly authored and non-mutable;
- provenance, uncertainty, public visibility, and non-implication notes;
- later references to claims, places, diplomatic relations, agreements, or historical events only after their owners and semantics exist.

Conflict identity/history is not the current war simulation. It records authored identity and supported historical facts without owning current armies, fronts, battles, occupation, control, objectives, war score, or consequences.

### Identity threshold

A conflict record must represent one distinguishable authored conflict, not:

- a geographic danger area;
- generic raiding, piracy, banditry, crime, unrest, or rivalry;
- one combat encounter, battle, quest branch, arrest raid, or spawn group;
- a broad era label without decision-complete identity boundaries;
- current hostility between actors;
- an inferred conflict from a map name or place prose.

The four current map conflict-zone names fail this threshold. `Talmyra Frontier Wars` may describe one conflict, a series, an era, or a display label; current data does not decide.

### Participant and role boundary

Participants are intrinsic. A future contract must distinguish roles such as opposing party, coalition member, claimant, rebel/insurgent, intervener, guarantor, occupied party, or other supported semantics without presuming a universal two-sided war model.

All role examples are provisional. Current broad groups—powers, tribes, confederacies, enclaves, kingdoms, raiders, and undersea powers—are not canonical actor references and cannot seed participant records.

### Historical versus current-state boundary

Static conflict history may later store explicitly authored dates or uncertain/open-ended temporal posture. Runtime/save owners must retain:

- current phase, escalation, fronts, objectives, mobilization, war score, strength, supply, casualties, and morale;
- current participants, defections, alliances, occupations, territorial control, battles, incidents, ceasefires, negotiations, and enforcement;
- AI, commands, events, rewards, reputation, access, economy effects, quest consequences, visibility, and player knowledge.

A static `active` record lifecycle must not be used as a substitute for current war state. Record lifecycle and effective/historical status require separate semantics.

## 4. Diplomacy And Conflict Relationship

Diplomacy and conflict may later reference one another only through explicit supported relationships.

- A diplomatic relation can exist without a conflict.
- A conflict can exist when broader diplomatic posture is unknown, disputed, asymmetric, or changes over time.
- A conflict's start does not automatically create rivalry, non-recognition, or war relation records.
- A ceasefire or conflict end does not automatically create peace, recognition, alliance, friendship, or normalized relations.
- An alliance does not prove participation in every conflict involving an ally.
- Shared conflict participation does not prove a lasting alliance.
- A vassalage/recognition posture does not prove claims, control, or military participation.

No automatic derivation, inverse creation, cascade update, or state synchronization is approved.

## 5. Claims, Borders, Territory, Control, And Occupation

Keep these concepts outside both owners:

- **claim**: an asserted interest/right over an authority or target;
- **border**: a political boundary relationship to physical geography;
- **territory**: a political scope/association distinct from place identity;
- **control**: current or time-bounded exercise of control over a target;
- **occupation**: a control/conflict posture that may have historical and runtime dimensions.

A conflict may later reference a claim or occupation fact, but does not own the claim/control model. A diplomatic relation may later recognize or dispute a claim, but does not create it. Map region lists do not establish borders, participants, claims, or control.

No claim/border/territory/control/occupation schema, evidence route, content, or runtime is approved here.

## 6. Adjacent Owner Boundaries

- **Polity/faction/guild/institution/religion/business/family/People** own actor identity.
- **Government** owns a governing arrangement/organization after its gate reopens.
- **Jurisdiction** owns applicability after its gate reopens.
- **Law/court** owns descriptive rules and judicial authority, not diplomatic/conflict execution.
- **Force** owns future static armed/protective body identity, not armies or war state.
- **Place/map/route** owns physical identity, geometry, display/reference summaries, and topology.
- **Route security/hazards** own descriptive corridor safety and environmental pressure.
- **Quest/event/Chronicle/Knowledge** retain authored narrative, occurrences, history projections, and informational presentation under their current/future owners.
- **Reputation/standing/favorability** own mutable actor/player-facing standing, not inter-authority diplomacy.
- **Combat/encounter/spawn/tactics/party** own immediate actors, allies/enemies, composition, actions, and outcomes.
- **Runtime/save** owns current political relations, war state, simulation, visibility, consequences, and player knowledge when implemented.

References do not transfer ownership. A future diplomatic or conflict record must not duplicate actor, place, claim, law, force, event, or runtime data.

## 7. Evidence Classification Preserved

- `polity.valtherion` and `polity.draemor` remain planned actor identities with no authored relation.
- The four `world_maps.json` conflict zones remain map display/reference summaries.
- `Kaelvar Interior`, `Talmyra Frontier Wars`, `Valtherion Border Kingdoms`, and `Serpent's Wake Piracy Lanes` are not conflict ids.
- Region conflict-zone and border-kingdom prose remains place/strategic context.
- Settlement raid, raider, piracy, fort, escort, and defense prose remains place/economy/security context.
- Quest raid/raider language remains encounter, branch, case, and consequence presentation.
- UI/creator diplomacy, warfare, envoy, and rivalry language remains presentation/backstory vocabulary.
- Encounter allies, combat ally/enemy arrays, and spawn hostility remain combat/spawn vocabulary.
- Reputation `wartime` remains mutable modifier vocabulary.
- World-map validation and polity/faction forbidden-field tests remain structural guardrails.
- Civic examples remain hypothetical design taxonomy.

Exactly zero diplomatic-relation ids and zero `conflict.*` ids carry forward. Do not normalize any current name or string into a new prefix.

## 8. Reference-Free Contract And Schema Readiness

### Diplomatic relation

A reference-free diplomatic record is incoherent. The owner exists only as a relationship among canonical actors. Actor types, cardinality, direction/symmetry, inverse behavior, relation-kind semantics, lifecycle/effective validity, overlap, contradiction, and visibility are intrinsic.

### Conflict identity/history

A reference-free conflict shell with only a name, summary, kind, lifecycle, and provenance is semantically unsafe. Participants/roles and temporal identity boundaries are intrinsic to distinguishing a conflict from a map label, broad era, threat descriptor, encounter, or runtime state.

### Combined schema

Rejected. A combined diplomacy/conflict collection would collapse relationship posture with conflict identity/history and encourage unsafe derivation of war, peace, alliance, rivalry, recognition, claims, or current state.

### Readiness result

Neither owner is schema-ready. Current evidence proves no candidates and no decision-complete actor/participant, direction/cardinality, temporal, overlap, or reference contract. Do not select a schema plan.

## 9. Reopening Conditions

The next deferral should permit reopening only after one materially new input exists:

1. an explicit user-authored or approved canonical diplomatic-relation and/or conflict list with complete actor/participant and temporal facts;
2. a new durable repository source intentionally defining one or more diplomatic relations or conflicts with the required contract facts;
3. an explicitly authorized civic/political-content authorship pass; or
4. a concrete ready consumer whose stable target owners and use case prove one minimal static relation or conflict contract with fail-closed validation.

A ready consumer may reopen schema review but cannot mint actors, relations, conflicts, or historical facts. Map summaries, prose, generated ids, UI, combat/runtime vocabulary, external research, or another unchanged-source scan do not qualify.

Schema, validator, seed/content, registration, references, migrations, consumers, and runtime must remain separate future gates.

## 10. Deep Research, User Question, Support, And Cleanup

Deep Research is not required. The blocker is project-specific canon and relation/participant/temporal semantics, not external diplomacy or war taxonomy.

No explicit user question is required now. Ask only when political canon is intentionally prioritized or a ready consumer requires these owners.

No support-suffix run is needed. The evidence audit and this boundary are decision-complete.

No temporary diplomacy/conflict guardrail or research artifact exists. `docs/design/diplomacy-conflict-authority-evidence-audit.md` remains the permanent classified evidence source. This decision is the permanent owner boundary. No cleanup deletion is warranted.

## 11. Explicit Non-Goals

- no candidate ids, collection paths, prefix contract, schema plan, schema, content, validator, test, normal registration, references, migrations, adapters, or consumers;
- no actors, diplomatic pairs, relation kinds, conflicts, participants, roles, dates, causes, outcomes, claims, borders, territory, control, occupation, treaties, alliances, rivalries, recognition, vassalage, peace, truces, wars, or canon;
- no government, jurisdiction, law, court, force, faction, institution, place, map, route-security, quest, event, Chronicle, Knowledge, reputation, combat, runtime, UI, save/account, or gameplay work;
- no political simulation, current hostility, negotiation, armies, battles, fronts, AI, events, commands, rewards, consequences, or player political state;
- no gated-lane reopening, Deep Research, temporary artifact, support suffix, compatibility behavior, or `0.6.0` transition.

## 12. Decision Answers

1. Diplomacy and conflict remain separate future owners.
2. No generic political-state umbrella is approved.
3. A diplomatic relation owns an authored actor relationship posture, not current sentiment or behavior.
4. Conflict owns identity and supported history, not current war simulation.
5. Actor references, direction/symmetry, cardinality, relation kind, visibility, lifecycle, and effective validity are intrinsic to diplomacy.
6. Participant references/roles, identity threshold, conflict kind, temporal history, lifecycle, and provenance are intrinsic to conflict.
7. Diplomacy and conflict may reference but never automatically derive one another.
8. Claims/borders/territory/control/occupation remain separate.
9. Government, jurisdiction, law, force, places, quests/events, reputation, combat, runtime, UI, and save/account remain separate.
10. Four map conflict zones and all other audited strings remain non-canonical relation/conflict evidence.
11. Exactly zero diplomatic-relation ids carry forward.
12. Exactly zero `conflict.*` ids carry forward.
13. Reference-free first-pass contracts are incoherent for both owners.
14. A combined schema is rejected.
15. Neither owner is schema-ready.
16. Select a fail-closed evidence deferral, not a schema plan.
17. Deep Research, an explicit user question, and a support suffix are not required.
18. No temporary guardrail needs deletion.
19. Select `Version 0.5.351 - Diplomacy Conflict Authority Evidence Deferral`.

## 13. Next Recommended Version

Version 0.5.351 - Diplomacy Conflict Authority Evidence Deferral
