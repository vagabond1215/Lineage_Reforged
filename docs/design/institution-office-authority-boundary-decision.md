# Institution Office Authority Boundary Decision

Source version/run: Version 0.5.328 - Institution Office Authority Boundary Decision
Date: 2026-07-11
Status: approved documentation-only owner boundary; no implementation permission

## 1. Decision Summary

Treat institution and office as distinct possible static identity owners.

An institution may own stable authored identity for a durable named civic, administrative, judicial, scholarly, charitable, educational, archival, medical, or similar body whose primary identity is organizational and is not better owned as a polity, government, jurisdiction, law, force, guild, faction, religion/order, business/company, family/house, profession, facility/site, service/provider, school building, person/NPC, or derived projection.

An office may eventually own stable identity for a durable civic position or explicitly named administrative office, separate from its office-holder. Office is not schema-ready now because current evidence does not resolve position versus administrative unit, government department, public-order body, social role, or quest presentation anchor.

Select one later route only:

- `Version 0.5.329 - Institution Authority Schema Plan`

The plan must remain content-free, reject a generic organization umbrella, allow no candidate ids, and preserve office, government, services, membership, reputation, and runtime as separate.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.328 - Institution Office Authority Boundary Decision`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.329 - Institution Authority Schema Plan`.
- No institution or office content collection or schema exists.
- Existing guild, polity, religion/order, faction, service, place, family/household/lineage, economy, account, reputation, quest, Knowledge, People/NPC, and runtime owners remain unchanged.
- Faction and People/NPC remain authored-input blocked; service, resource/commodity, and combat health remain paused; generic `world.pois` remains rejected; Highcrown Knowledge remains closed.
- No content, schema, validator, test, normal registration, runtime, UI, save/account, or gameplay implementation is authorized.

## 3. Current Evidence Classification

| Surface | Classification | Boundary result |
| --- | --- | --- |
| Missing `civilization.institutions` collection/schema | Missing owner | Supports a future narrow contract, not content. |
| Missing office collection/schema | Missing owner | Does not resolve whether office means position, unit, department, or force. |
| Knowledge `institution`, `institutional_study`, `institutionId` vocabulary | Consumer/structural vocabulary | Shows anticipated references; does not establish identity records. |
| Magic Study institution anchor type and disabled resolver path | Fail-closed future consumer hook | Supports a future canonical institution owner; remains disabled and supplies no candidates. |
| Quest `office.harbor_master.brineharbor` | Presentation-only anchor | Harbor-office presentation cannot mint office, institution, government, or person identity. |
| Quest `office.civic_watch.aurelis` | Presentation-only anchor with force/office ambiguity | Civic watch may be office, force, government unit, or presentation label; no canonical owner is proven. |
| Quest `business.ironwheel_haulage_coppergate` | Presentation-only business anchor | Business/company boundary, not institution. |
| Knowledge/backstory prose mentioning institutions | Natural-language context | No exact named institution authority or record facts. |
| Buildings, workplaces, settlements, districts, sites | Existing place/facility/economy owners | Facilities and locations do not create institutions. |
| Guilds and religion-owned orders | Existing institutional identities under specific owners | Must not be duplicated or migrated. |
| Settlement institution profiles, shadow networks, generated companies, civil/military authority ids | Synthetic/derived/runtime projections | Consumers only; cannot mint authored records. |

## 4. Institution Authority Boundary

### Institution may own

A future institution record may own only stable descriptive identity for a durable named body:

- canonical id, slug, name, aliases posture, status, summary, provenance, and notes;
- a narrow descriptive institution family only when supported;
- descriptive public posture only when supported or explicitly unknown;
- optional reference posture only after a schema plan proves a stable owner and non-implicating semantics.

Examples of potentially eligible kinds in principle include named civic, administrative, judicial, scholarly, archival, charitable, educational, or medical bodies. These are categories for contract planning, not candidate approval.

### Institution must not own

- sovereign polity identity or government structure;
- jurisdiction, law, court procedure, enforcement, public-order/military force, territory, claim, diplomacy, conflict, tax, or finance execution;
- civic position, office-holder, title, role assignment, department hierarchy, or chain of command;
- guild trade/craft/service corporate identity;
- faction political/social pressure-group identity;
- religion or religion-owned order identity;
- business/company commercial identity, workplace production, property, stock, prices, contracts, or account assets;
- family, clan, house, dynasty, lineage, household, or kinship identity;
- building, facility, settlement, district, site, school building, hospital building, archive building, court building, or other place identity;
- service vocabulary, provider association, availability, access, payment, effects, or gameplay;
- people, NPCs, members, leaders, employees, teachers, healers, judges, officers, or rosters;
- membership, affiliation, rank, employment, office holding, leadership, relationship, reputation, standing, favorability, recognition, or access state;
- schedules, dialogue, quests, Knowledge mutation, magic acquisition, curriculum execution, runtime, AI, UI, save/account, or gameplay behavior.

## 5. Office Authority Boundary

Office is conceptually distinct from institution and from its holder.

A future office owner might describe a durable named civic position such as a harbormaster office, or an explicitly named administrative office that persists across holders. It must never use a person's identity as the office id, embed the current office-holder, or treat appointment/tenure as identity.

Office remains not schema-ready because current repository evidence leaves these meanings unresolved:

- durable position versus administrative unit;
- social role/title versus civic office identity;
- government department/agency versus office;
- public-order force versus office;
- physical office/facility versus institutional body;
- generic quest-giver anchor versus canonical office.

The two quest `office.*` anchors cannot settle those questions. A later office evidence/boundary route requires a concrete consumer or durable authored source before schema planning.

## 6. Institution Versus Office

Institution and office must remain separate:

- institution identifies an enduring organized body;
- office identifies a durable position or narrowly defined administrative office independent of its holder;
- office-holder/appointment links connect a person to an office later;
- an office may belong to an institution or government only through a later typed relationship;
- an institution may contain offices only through later links, not embedded identity duplication.

No inheritance, nesting, control, sponsorship, parent-child, or membership relationship is authorized in the first institution contract.

## 7. Government, Jurisdiction, Law, And Force Boundary

Government owns governing structure and authority style. Jurisdiction owns where and over whom authority applies. Law owns descriptive rules/customs after jurisdiction exists. Public-order and military-force owners identify enduring armed/enforcement bodies. Runtime owners execute enforcement, cases, punishment, patrols, conflict, taxation, and state change.

Government departments and agencies remain deferred. Do not classify them as institutions or offices by default. A later government boundary must decide when a named department is part of government structure, a separate institution, an office/administrative unit, or a public-order force.

Courts may describe a judicial institution only when explicit canon identifies an enduring named body distinct from its courthouse place, jurisdiction, applicable law, judges/office-holders, procedure, and case runtime. No such candidate is approved here.

## 8. Existing Specific Owner Boundaries

- Guilds retain all 18 live broad identities and local guild-presence consumption.
- Religions retain religion identity and six nested religious orders.
- Factions retain their future narrow non-sovereign political/social actor contract and authored-input seed gate.
- Businesses/companies remain a separate commercial identity decision.
- Families/houses/lineages/households retain genealogical and domestic identity.
- Places retain settlements, districts, sites, facilities, buildings, workplaces, schools/academies as places/facilities when no separate named body is proven.
- Services retain provider-independent vocabulary.
- People/NPC retain identity/presence gates and cannot be inferred from institution/office names.
- Professions/social roles retain reusable occupational/function vocabulary and assignments.

One entity name may appear across layers, but each authored identity must have one canonical owner. Later typed links cannot justify duplicate records.

## 9. School, Academy, Archive, Hospital, Court, And Charity Posture

Names such as school, academy, archive, hospital, court, or charity do not automatically establish institution identity.

The evidence must distinguish:

- the enduring named body;
- the building/site where it operates;
- the service it offers;
- its workplace/economic functions;
- any government/jurisdiction/law authority;
- its people, teachers, healers, judges, staff, members, or office-holders;
- its curriculum, schedules, access, prices, inventory, cases, treatment, Knowledge, magic, runtime, and gameplay behavior.

Only the first of these may belong to institution identity. Current generic buildings/workplaces and vocabulary do not approve candidates.

## 10. Link And Mutable-State Boundary

Keep all actual membership, affiliation, employment, rank, leadership, office holding, appointment, tenure, recognition, sponsorship, control, relationship, reputation, standing, favorability, access, and service-provider association out of institution and office identity.

These require later link or mutable-state decisions after canonical people and authority identities exist. People/NPC remains blocked, so no member, employee, leader, teacher, judge, healer, officer, or office-holder inference is permitted.

## 11. Schema-Readiness Decision

Institution is ready for one docs-only schema plan because:

- its static identity boundary is now narrow;
- it has future fail-closed consumers in Knowledge and Magic Study without requiring immediate activation;
- it can exclude office, government, facilities, services, people, links, behavior, and runtime;
- no live collection conflicts with the owner;
- a plan can define a content-independent contract without selecting candidates.

Office is not schema-ready. Its identity meaning and government/role/force/facility overlap require later concrete evidence or a narrower consumer decision.

The institution schema plan must not approve content or enable Knowledge/Magic Study institution references automatically.

## 12. Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Institution authority schema plan | Selected | The body-identity boundary is narrow and supports content-independent planning with strict exclusions. |
| Office authority schema plan | Rejected now | Position/unit/department/force/role/facility meanings remain unresolved. |
| Combined institution/office schema | Rejected | Would collapse body identity with position/unit identity and office-holder semantics. |
| Focused evidence audit | Rejected before next route | Existing evidence is sufficient for institution schema planning; office can remain deferred. |
| Preservation gate for both | Rejected | Safe but unnecessarily stalls a decision-complete institution contract. |
| Implementation | Rejected | No schema, content, validator, test, registration, consumer enablement, or behavior is authorized. |

## 13. Selected Option And Rationale

Select `Version 0.5.329 - Institution Authority Schema Plan`.

The plan should define a strict records-only future `civilization.institutions` contract, minimum static fields, narrow category/public-posture vocabulary, provenance, forbidden fields, pure validator/test posture, normal-registration deferral, and seed evidence gate. It should allow no first-pass office/government/place/service/person or other cross-authority references unless a non-implicating need is proven; fail-closed no-reference posture is preferred.

No institution candidates or office follow-up are selected concurrently.

## 14. Deep Research Posture

Deep Research is not required before `0.5.329`. The next task is repository contract planning, not comparative institutional design. External research cannot create project canon or resolve current owner placement.

## 15. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. The decision is complete and selects a normal primary schema-plan route.

No explicit user question is needed. The plan can remain content-free and fail closed without deciding candidates or office semantics.

## 16. Explicit Non-Goals

- no institution/office content, ids, candidates, aliases, migrations, schemas, validators, tests, registration, Knowledge/Magic Study enablement, or loader changes;
- no government, jurisdiction, law, force, guild, faction, religion/order, business, family, place, service/provider, profession, social-role, People/NPC, membership, employment, office-holder, reputation, access, runtime, UI, save/account, or gameplay implementation;
- no paused/blocked/rejected/closed-lane reopening; no Deep Research or `0.6.0` transition.

## 17. Decision Question Answers

1. No. No canonical institution collection exists.
2. No. No canonical office collection exists.
3. Yes. Institution body identity is distinct from office position/unit identity.
4. Institution may own only stable descriptive identity for an explicitly authored durable named body not better owned elsewhere.
5. Office may eventually own a durable civic position or narrowly defined administrative office independent of its holder, but its exact contract remains deferred.
6. Government structure, jurisdiction, law, public-order/military force, departments/agencies pending classification, and enforcement behavior remain outside institution/office identity.
7. Guild, religion/order, faction, business, family, place/facility, service, profession/role, and person owners retain their identities and behavior.
8. No. Quest office anchors are presentation metadata.
9. No. Knowledge institution vocabulary is consumer vocabulary, not identity canon.
10. No. Derived profiles and generated ids are synthetic consumers.
11. No. Members, office-holders, leaders, ranks, employment, and affiliation require later links/state.
12. No. Services, access, reputation, law, territory, runtime, and gameplay are excluded.
13. Yes, for a docs-only schema plan with no content or candidates.
14. No. Office is not schema-ready.
15. No. No institution or office candidate id is approved.
16. No. Implementation is not authorized.
17. No. Deep Research is not required before the next route.
18. No. A support-suffix run is not needed.
19. No. An explicit user question is not needed.
20. Select `Version 0.5.329 - Institution Authority Schema Plan`.

## 18. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required handoff, active prompt, sequence, roadmap, backlog, roadmap selection, institutional audit/boundary, civic/economy/social/People boundaries, and relevant live owner/consumer reads.
- Narrow absence and classification checks confirmed no institution/office collections or schemas; two quest office anchors; Knowledge/Magic Study consumer vocabulary; and derived-only institution profiles.
- Required schema tests, normal content lint, docs-only scope, conflict-marker, whitespace, artifact, stale-route, diff, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 19. Next Recommended Version

Version 0.5.329 - Institution Authority Schema Plan
