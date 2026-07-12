# Force Public Order Authority Evidence Audit

Source version/run: Version 0.5.345 - Force Public Order Authority Evidence Audit
Date: 2026-07-12
Status: completed documentation-only evidence audit; zero candidate ids; boundary decision selected

## 1. Audit Result

Current repository evidence supports one focused force/public-order owner-boundary decision, but no canonical force candidate and no schema plan.

Carry forward exactly zero `force.*` ids. Select `Version 0.5.346 - Force Public Order Authority Boundary Decision` next.

The current signals do not establish whether guards/watches, militias, garrisons, military forces/orders, and route-security bodies belong to one broad static force identity family or require narrower owners. They do establish that static identity must remain separate from places, offices, institutions, government, jurisdiction, law, route-security posture, combat vocabulary, rosters, patrols, spawning, enforcement, and runtime.

## 2. Authority Surface Posture

- No dedicated force/public-order content collection, schema, validator, focused test, or normal content-lint registration exists.
- No canonical content id matching `force.*` exists.
- The route-security schema and pure validator exist, but live `route_security_profiles.json` and normal registration remain absent.
- Route-security test records such as `route_security.aurelis_vinecross_watch` are explicitly fixture-only.
- Existing polity and institution validators reject force/enforcement crossover fields.
- Government/jurisdiction and office remain gated/not schema-ready and cannot be used to infer force identity.

## 3. Evidence Inventory

| Surface | Exact posture | Classification | Authority result |
| --- | --- | --- | --- |
| `quest_definition.aurelis_counterfeit_ring` | Summary names Aurelis civic watch; giver type `government`; entity `office.civic_watch.aurelis`; display name Aurelis Civic Watch; contact Inspector Halwen Crest | Authored quest presentation | Only named force-like signal, but office/government/institution/force/provider/person meanings remain unresolved. |
| `rep.civic_watch.aurelis` | Quest standing requirement | Mutable reputation-target vocabulary | Does not establish static force identity. |
| Quest arrest/warrant/case language | Soft arrester role, sanctioned exposure, arrest branches, case filing, warrant purse | Quest behavior/presentation | Does not authorize enforcement, law, court, force behavior, or canonical identity. |
| 28 broad settlement matches | Fort/citadel/watch/garrison/guard/military wording across ids, names, types, summaries, contexts, and tags | Authored place descriptors | Establishes fortified/security context, not named organizations. |
| Named settlements such as Sunscar Watch, Stormwatch Citadel, Thornwatch, Watcher's Gate, Whalebone Watch, and Stormhook Watch | Canonical place identities | Place authority | “Watch” in a place name does not imply a force record. |
| Settlement type `fort` / `citadel` and security/garrison prose | Facility/place function and context | Place/infrastructure/economy vocabulary | Cannot mint a garrison or military organization. |
| `military_authority` / `civil_authority` | Reusable owner-type vocabulary | Derived simulation classification | Type vocabulary only, not exact identities. |
| `authority.<settlement>.garrison` / `.garrison_command` | Synthetic property/settlement owner/operator ids | Derived projection | Not authored garrison or command records. |
| Other `authority.*` councils/charters/claims/offices | Synthetic local authority labels | Derived projection | Must not be normalized into force ids. |
| Route-security schema | Static descriptive security posture including patrol presence and response/readiness-like bands | Separate future overlay authority | Describes route posture, not the identity of a watch, guard, or patrol body. |
| Route-security forbidden fields | Rejects patrol units, guard rosters/ids, jurisdiction, courts, law enforcement, AI/runtime fields | Structural guardrail | Confirms owner separation; supplies no force candidate. |
| Route-security test `watch` ids/names | In-memory fixture examples; no live wrapper | Test-only vocabulary | Explicitly non-canonical. |
| Hazard profiles | Static hazard descriptors separate from route security | World overlay authority | No force identity. |
| Combat `guard` skill/abilities/effects | Defense/action/tactics vocabulary | Combat owner | “Guard” means combat posture/action, not civic organization. |
| Combat roles, tactics, encounters, spawns, monsters, equipment | Actor/action/composition/execution owners | Combat/runtime content | Cannot define force organizations or rosters. |
| Garrison Ward and military-service backstory prose | Character-origin narrative | Player/backstory owner | No named organization or authority record. |
| UI/world-selection guard/garrison/security prose | Presentation derived from place/runtime state | UI consumer | Does not create force canon. |
| Design examples | guard, watch, militia, garrison, military order, route-security body, public-order authority | Hypothetical taxonomy | Supports boundary questions only. |

## 4. Aurelis Civic Watch Assessment

The quest provides a stable display phrase but fails a complete canonical force gate:

- `office.civic_watch.aurelis` is explicitly an office-prefixed quest anchor, not a force-prefixed authority id;
- giver type `government` does not distinguish a government unit, office, institution, force, provider, or presentation abstraction;
- Inspector Halwen Crest is a contact name, not a canonical person or office-holder record;
- the quest supplies mutable standing, arrest, evidence, case, and reward behavior that belongs to quest/runtime layers;
- no durable force category, canonical slug authority, lifecycle, public posture, affiliation, mandate boundary, provenance independent of the quest, or non-executing identity summary is provided;
- the record does not clarify whether “Civic Watch” names an enduring force, a government office, a department, a local service, or generic watch personnel.

Do not promote `office.civic_watch.aurelis`, invent `force.aurelis_civic_watch`, or derive any alternative id.

## 5. Place And Facility Assessment

Twenty-eight settlement records contain broad fort/watch/garrison/guard/military signals under a targeted text scan. These signals are deliberately heterogeneous:

- some are settlement types (`fort`, `citadel`, `outpost`);
- some are place names containing Watch, Gate, Bastion, Redoubt, Keep, or Citadel;
- some are summaries/site contexts mentioning guards, walls, garrisons, or military functions;
- some are economic/infrastructure/security descriptors.

They establish where defensive or security activity may occur. They do not name enduring forces, commands, units, rosters, affiliations, mandates, or coverage. A fort is a place; a garrison may be a body located there, but it must be explicitly authored separately.

## 6. Route-Security Assessment

Route security is a separate static descriptive overlay candidate with schema/validator scaffolding only.

Its `securityPosture` may describe patrol presence and response/security bands, but it intentionally rejects patrol units, guard ids/rosters, jurisdiction, courts, law enforcement, AI, encounters, and runtime state. The fixture name `Aurelis-Vinecross Watch` cannot be treated as canon because the test explicitly states that it authors no live route-security content.

A future force might later have a typed relationship to a route-security profile or mandate coverage. That relationship is not approved and cannot be inferred from posture vocabulary.

## 7. Derived, Combat, And Runtime Assessment

- `military_authority` and `civil_authority` classify generated ownership/operating posture.
- `authority.<settlement>.garrison` and `.garrison_command` are deterministic projections.
- combat guard skills/abilities describe defensive actions.
- combat roles/tactics describe actor function and tactical preference.
- encounters/spawns describe composition/execution envelopes.
- patrols, schedules, AI, arrests, enforcement, cases, wanted/bounty state, reputation, access, runtime, UI, save/account, and gameplay are mutable behavior/state.

None of these owners provides static force identity. They must not be combined to manufacture a candidate.

## 8. Family-Boundary Question

The evidence does not yet decide whether these concepts share one future family:

- civic guard/watch;
- militia;
- settlement garrison;
- military force/command;
- military or martial order;
- route-security body;
- other public-order or protective organization.

A later boundary decision should test one broad `civilization.forces`-style identity family against narrower alternatives. It must decide whether “force” is broad enough for civic, military, and route-security bodies without absorbing:

- religion-owned orders or guilds;
- factions/institutions/government offices;
- place/facility identities;
- combat units/parties/encounter groups;
- operational patrol, readiness, roster, command, enforcement, and runtime state.

No collection name or prefix is approved by this audit.

## 9. Candidate And Readiness Decision

- Exact accepted candidate ids: none.
- `office.civic_watch.aurelis`: rejected as a presentation anchor.
- Synthetic `authority.*` ids: rejected as derived projections.
- Route-security fixture ids: rejected as test-only.
- Place names/types/tags: rejected as place authority.
- Combat and backstory/UI vocabulary: rejected as separately owned.

Force/public order is not schema-ready because the identity-family boundary, classification vocabulary, reference posture, and seed evidence gate remain unresolved. It is ready for one docs-only boundary decision using this completed classification.

## 10. Preserved Owner Boundaries

- Polity retains political identity.
- Government/jurisdiction remain gated relational owners.
- Law/courts remain downstream and separate.
- Institution and office remain distinct; office is not schema-ready.
- Guild, faction, religion/order, business, family/house, people/NPC, profession/role, and service/provider retain their owners.
- Settlements/buildings/infrastructure/sites retain place/facility identity.
- Route security/hazards retain descriptive overlay posture.
- Combat, encounter, spawn, tactics, and equipment retain action/composition owners.
- Quests and reputation retain presentation, requirements, consequences, and mutable standing.
- Runtime/save owners retain rosters, assignments, schedules, patrols, readiness, AI, enforcement, cases, access, state, and consequences.

No prefix normalization, alias, migration, compatibility behavior, reference, resolver, adapter, or consumer enablement is approved.

## 11. Research, User Question, Support, And Temporary Docs

Deep Research is not required before the boundary decision. The immediate issue is repository ownership, not comparative military or policing taxonomy.

No explicit user question is required. The decision can fail closed and may select an authored-input deferral.

No support-suffix run is needed. Current validation is green and the audit is decision-complete.

No temporary guardrail document was encountered or created. Permanent civic, route-security, office, roadmap, and backlog documents own the relevant guidance.

## 12. Explicit Non-Goals

- no candidates, content, schema, validator, test, registration, references, migrations, adapters, or consumers;
- no government, jurisdiction, law, court, office, institution, place, route-security, combat, encounter, spawn, reputation, access, roster, patrol, AI, arrest, enforcement, case, runtime, UI, save/account, or gameplay implementation;
- no gated-lane reopening, Deep Research, temporary artifact, support suffix, compatibility behavior, or `0.6.0` transition.

## 13. Audit Answers

1. No dedicated force/public-order authority exists.
2. Exactly zero `force.*` ids carry forward.
3. Aurelis Civic Watch is partial quest presentation, not canonical force identity.
4. Settlement fort/watch/garrison signals remain place descriptors.
5. Route-security posture remains a separate overlay; its watch ids are test fixtures only.
6. Synthetic military/civil authority and garrison ids remain derived projections.
7. Combat guard/role/tactics/encounter/spawn vocabulary remains combat-owned.
8. Backstory/UI/prose and reputation targets remain consumer or mutable vocabulary.
9. Guard/watch, militia, garrison, military force/order, route-security body, and other public-order family placement remains unresolved.
10. Static identity remains separate from affiliation, mandate, coverage, headquarters, readiness, rosters, ranks, office-holders, schedules, patrols, spawning, AI, arrest, enforcement, law, cases, access, reputation, runtime, UI, save/account, and gameplay.
11. A schema plan is premature.
12. One docs-only owner-boundary decision is justified.
13. Deep Research, an explicit user question, and a support suffix are not required.
14. Select `Version 0.5.346 - Force Public Order Authority Boundary Decision`.

## 14. Next Recommended Version

Version 0.5.346 - Force Public Order Authority Boundary Decision
