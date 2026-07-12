# Government Jurisdiction Authority Boundary Decision

Source version/run: Version 0.5.342 - Government Jurisdiction Authority Boundary Decision
Date: 2026-07-12
Status: approved documentation-only owner boundary; zero ids; neither owner schema-ready

## 1. Decision Summary

Government organization and jurisdiction applicability are separate future authorities, but neither is schema-ready.

- Government answers how a polity or other competent authority is governed during a defined posture or period.
- Jurisdiction answers where, over whom, or over which subject matter an authority applies.

Government is not polity identity. Jurisdiction is not physical place, territory, claim, control, or law. Both are inherently relational, and government is also inherently temporal. Current evidence supplies no canonical records and no decision-complete reference model.

Carry forward exactly zero `government.*` ids and zero `jurisdiction.*` ids. Select `Version 0.5.343 - Government Jurisdiction Authority Evidence Deferral` next.

## 2. Current Posture

- `world.polities` contains two planned political identities and explicitly excludes government and jurisdiction.
- No government or jurisdiction collection, schema, validator, focused test, or normal registration exists.
- Two government-typed quest givers use presentation-only `office.*` ids.
- All `authority.*` civil, military, council, charter, claim, garrison, and office strings are synthetic projections.
- Settlement `administrativeRole` remains place-owned.
- Property legal status, start lawful standing, access requirements, and reputation targets remain mutable or consumer-owned.
- The completed evidence audit approved no government or jurisdiction candidate.

## 3. Government Authority Boundary

### Government may eventually own

A future government record may own one explicitly authored governing arrangement or enduring governing organization, including:

- canonical identity and public name when the government is itself a named body;
- a descriptive government/arrangement type;
- a concise non-executing summary of how authority is organized;
- explicit association with the polity or other competent authority being governed;
- authored temporal/lifecycle posture distinguishing record lifecycle from the arrangement's validity;
- public visibility posture, provenance, and non-implication notes;
- later typed relationships to offices, institutions, or administrative units only after those owners exist and the semantics are separately approved.

Government identity must persist independently of any current ruler, office-holder, facility, quest giver, or runtime state.

### Government must not own

- polity identity, polity form, place anchors, claims, borders, control, occupation, recognition, vassalage, diplomacy, or conflict;
- physical regions, settlements, districts, sites, government buildings, offices, courts, or facilities;
- rulers, councils' members, officials, office-holders, appointments, succession outcomes, elections, tenure, rosters, ranks, or people/NPC identity;
- institution, office, department/agency, force, guild, faction, business, religion/order, family/house, profession/role, or provider identity unless a later decision proves one typed relationship;
- jurisdiction applicability, law text, court procedure, sanctions, taxation execution, enforcement, permits, access, citizenship, legal status, reputation, standing, or favorability;
- commands, events, schedules, AI, patrols, cases, rewards, UI, save/account state, or gameplay behavior.

### Government versus adjacent owners

- A polity is the durable political entity; a government is an arrangement or organization governing it.
- An institution is an enduring body not better owned as government; a government department/agency requires later classification and is not automatically an institution.
- An office is a durable position or narrowly defined administrative office; it is not the whole government.
- A ruler or official is a person linked later through appointment/office-holder state.
- A force is an enduring armed/public-order body with a mandate, not the government itself.
- Settlement `administrativeRole` describes place importance, not government organization.
- Quest giver type `government` describes presentation/provider context, not canonical identity.

## 4. Jurisdiction Authority Boundary

### Jurisdiction may eventually own

A future jurisdiction record may own one explicitly authored applicability scope:

- canonical identity/name when the jurisdiction is a durable named scope;
- jurisdiction kind or subject-matter posture;
- one explicit competent authority anchor;
- explicit place, person-class, organization-class, or subject-matter scope under a controlled model;
- overlap and priority posture relative to other jurisdictions;
- public visibility and authored temporal/lifecycle posture;
- concise descriptive summary, provenance, and non-implication notes.

Jurisdiction describes applicability only. It does not execute or adjudicate anything.

### Jurisdiction must not own

- physical place identity, geometry, borders, route topology, map overlays, territory, claim, control, occupation, or political identity;
- government organization, polity form, offices, institutions, courts, forces, guilds, religions/orders, businesses, families, people, or providers;
- law codes, ordinances, customs, charters, offenses, rights, duties, sanctions, procedure, cases, evidence, judgments, punishment, or enforcement;
- property title condition, tax delinquency, access requirement, permit/license state, citizenship, residency, lawful standing, wanted/bounty state, reputation, standing, or favorability;
- patrol/spawn coverage, AI, encounters, commands, events, rewards, UI, save/account state, or gameplay behavior.

### Jurisdiction versus adjacent owners

- Physical place answers where something is; jurisdiction answers whether authority applies there.
- A polity anchor does not automatically make every associated place part of one jurisdiction.
- A government may be an authority anchor later, but government organization and jurisdiction applicability remain different records.
- Claim/control describes asserted or effective political reach; jurisdiction describes recognized applicability and may differ from both.
- Law describes rules applied through a jurisdiction and cannot precede a stable jurisdiction contract.
- Force coverage or patrol area is operational mandate/runtime, not jurisdiction identity.
- Property `LegalStatus`, district access, and start lawful standing are derived/mutable outcomes, not jurisdiction sources.

## 5. Cardinality And Temporal Boundary

Government and jurisdiction cannot safely use timeless one-to-one assumptions.

Future government planning must decide:

- whether a polity may have concurrent governments, layered governments, or only one current governing arrangement;
- whether settlement government is a government record, separate local-administration owner, or later typed specialization;
- how historical/superseded arrangements remain referencable;
- how record lifecycle differs from effective validity;
- whether departments/agencies are embedded description, separate identities, or typed links.

Future jurisdiction planning must decide:

- how many authority and scope anchors are permitted;
- whether place, subject-matter, personal, guild, religious, military, route, port, or customary jurisdictions share one family or require later specializations;
- how overlap and priority are represented without executing conflict resolution;
- how historical, planned, suspended, superseded, or disputed applicability differs from record lifecycle;
- how a jurisdiction remains coherent when authority or geography changes.

None of these questions may be guessed in a first schema.

## 6. First-Pass Reference Decision

No reference-free first-pass schema is approved for either owner.

- A government record without an explicit governed polity/authority and temporal posture would be an unmoored generic organization record.
- A jurisdiction record without explicit authority and scope references would not describe applicability.

No referenced first-pass schema is approved either, because current canon does not prove the required reference types, cardinality, validity, or overlap semantics. Reference planning must wait for qualifying authored input or a concrete ready consumer that exposes the minimum coherent contract.

## 7. Current Evidence Classification Preserved

- `office.harbor_master.brineharbor` remains a quest presentation anchor, not a government, jurisdiction, office, institution, person, or provider record.
- `office.civic_watch.aurelis` remains a quest presentation anchor with unresolved office/force/government/institution meaning.
- `authority.<settlement>.*` ids remain synthetic settlement/property projections.
- `rep.harbor_authority.brineharbor` and `rep.civic_watch.aurelis` remain quest/reputation target vocabulary.
- Polity forms and place anchors remain polity-owned.
- Settlement administrative roles remain place-owned.
- Legal status, lawful standing, access requirements, and UI prose remain derived/mutable/consumer-owned.

No existing string is promoted, renamed, normalized, aliased, migrated, or treated as a future candidate.

## 8. Law, Court, Force, And Runtime Sequencing

Jurisdiction must be decision- and schema-ready before law-code or local-law schemas are considered. This decision does not make jurisdiction ready.

Courts remain split among possible judicial institution identity, office/office-holder identity, courthouse place, jurisdiction, law/procedure, and case runtime.

Force/public-order identity requires its own evidence and boundary decision. Government does not absorb watches, guards, militias, garrisons, military orders, or enforcement bodies.

Enforcement, arrests, warrants, cases, punishments, patrols, AI, wanted/bounty state, taxation, access, citizenship/legal status, reputation consequences, diplomacy, conflict, and mutation remain `0.6+` runtime/save concerns unless a later narrow static decision explicitly says otherwise.

## 9. Readiness Decision

### Government

Not schema-ready. The owner boundary is conceptually clear, but current evidence does not establish a canonical governing arrangement, stable reference/cardinality model, or temporal contract.

### Jurisdiction

Not schema-ready. The applicability boundary is conceptually clear, but a coherent record inherently requires unproven authority/scope references, overlap semantics, and temporal posture.

### Combined schema

Rejected. Combining the two would collapse organization with applicability and make later government change, layered jurisdiction, law, and runtime ownership unsafe.

### Selected route

Select a fail-closed authored-input deferral for both layers. No schema-planning route is approved.

## 10. Reopening Conditions

The next deferral should permit reopening only after one of these materially new inputs exists:

1. an explicit user-authored or approved canonical government/jurisdiction list with the required relationship and temporal facts;
2. a new durable repository source intentionally defining a governing arrangement or applicability scope;
3. an explicitly authorized civic-content authorship pass; or
4. a concrete ready consumer whose contract requires one minimal static relationship and whose stable referenced owners already exist.

Consumer vocabulary alone, generated ids, quest anchors, prose, external research, or another unchanged-source scan does not qualify.

## 11. Deep Research, User Question, Support, And Temporary Docs

Deep Research is not required. The blocker is project-specific canon and reference semantics, not external taxonomy.

No explicit user question is required now. Ask only when civic canon is intentionally prioritized or a ready consumer requires these identities/scopes.

No support-suffix run is needed. The boundary is decision-complete.

Keep `docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` retired. No temporary guardrail document is needed.

## 12. Explicit Non-Goals

- no candidates, content, schemas, validators, tests, registration, references, resolvers, migrations, adapters, or consumers;
- no law, court, force, office, institution, polity, settlement, property, access, reputation, tax, claim/control, diplomacy, conflict, runtime, UI, save/account, or gameplay implementation;
- no existing-gate reopening, Deep Research, temporary artifact, compatibility behavior, support suffix, or `0.6.0` transition.

## 13. Decision Answers

1. Government and jurisdiction are separate owners.
2. Government owns a governing arrangement/organization, not polity identity or runtime governance behavior.
3. Jurisdiction owns applicability, not place, claim/control, law, or enforcement.
4. Government cardinality and temporal validity remain unresolved.
5. Jurisdiction authority/scope cardinality, overlap, priority, and temporal validity remain unresolved.
6. A reference-free schema would be incoherent for either owner.
7. A referenced schema would be premature because its contract is not evidence-backed.
8. The two quest `office.*` anchors remain presentation-only.
9. All synthetic `authority.*` ids remain derived.
10. Exactly zero government ids carry forward.
11. Exactly zero jurisdiction ids carry forward.
12. Law remains downstream of jurisdiction.
13. Force/public order and enforcement remain separate.
14. Neither owner is schema-ready.
15. Deep Research, an explicit user question, and a support suffix are not required now.
16. Select `Version 0.5.343 - Government Jurisdiction Authority Evidence Deferral`.

## 14. Next Recommended Version

Version 0.5.343 - Government Jurisdiction Authority Evidence Deferral
