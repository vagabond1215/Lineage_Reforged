# Force Public Order Authority Boundary Decision

Source version/run: Version 0.5.346 - Force Public Order Authority Boundary Decision
Date: 2026-07-12
Status: approved documentation-only owner boundary; one broad future family; zero ids; schema planning deferred

## 1. Decision Summary

Select one broad future static **force identity** family for enduring organized bodies whose primary identity is armed defense, civic protection, military service, or organized route protection.

The family may eventually distinguish civic guard/watch, militia, garrison, standing military force/command, and route-security body as typed forms. A martial or military order belongs only when its primary canonical identity is the armed/protective body itself and no existing religion, guild, institution, faction, or business owner is the better identity authority.

Do not create separate first-pass collections for watches, militias, garrisons, military forces, or route-security bodies. Their differences are classification and relationship semantics, not evidence for five duplicate identity authorities.

Carry forward exactly zero `force.*` ids. Do not approve a collection path, prefix contract, schema plan, content, references, migrations, or consumers. Affiliation, mandate, coverage, and headquarters relationships are intrinsic to distinguishing a force from a generic organization, and current evidence proves neither canonical records nor a decision-complete reference contract. Select a fail-closed `Version 0.5.347 - Force Public Order Authority Evidence Deferral` next.

## 2. Broad Family Boundary

A future force record may identify one enduring organized armed or public-order body across changes in personnel, deployment, readiness, or leadership.

Potential typed forms, not approved schema enums, are:

- civic guard or watch;
- militia;
- garrison;
- standing military force or command;
- route-security body;
- another explicitly authored protective or armed body that passes the owner test.

The owner test is primary identity:

- if the record answers **which enduring armed/protective organization exists**, force is the likely owner;
- if it answers where activity occurs, place owns it;
- if it answers which office, institution, guild, religion, faction, or business exists, that specific authority owns it;
- if it answers who is deployed, how they fight, or what happens now, combat/runtime owns it;
- if it answers route safety conditions, route security owns the overlay;
- if it answers which laws apply or how they are enforced, jurisdiction/law/runtime owns it.

One entity may later reference a distinct force, but references do not merge identities. A temple order, trade guild, political faction, civic institution, government office, or mercenary business must not be duplicated as a force merely because it has armed members.

## 3. Static Force Identity May Eventually Own

Subject to a later schema decision and proven references, static force authority may own:

- stable canonical identity, slug, display name, and non-executing summary;
- typed force form and broad public/protective posture;
- lifecycle/provenance posture independent of current deployment;
- explicit affiliation to a polity, government, institution, faction, guild, religion/order, business, or other competent authority after that owner and relationship are approved;
- a descriptive authored mandate distinct from executable law or orders;
- canonical coverage and headquarters/site relationships after supported place/route/jurisdiction targets exist;
- public-facing role and non-implication notes.

These are static authored facts. They must remain valid independently of current members, officers, patrols, encounters, or readiness.

## 4. Relationship And Mutable-State Boundary

### Affiliation

Affiliation is a typed relationship to another canonical authority, not a replacement for that authority. A force may serve, answer to, be chartered by, be sponsored by, or remain independent only when canon explicitly states that posture. Do not infer affiliation from a settlement, quest giver type, synthetic owner id, guild presence, religious site, or prose.

### Mandate

A static mandate may later describe an authored public purpose such as civic protection, territorial defense, garrison duty, military campaigning, or route protection. It must not contain executable orders, arrest powers, legal tests, targets, schedules, rewards, punishments, AI priorities, or current objectives.

### Coverage

Coverage is a relationship to supported places, routes/lanes, jurisdictions, or other future scope authorities. It does not transfer ownership of those targets and does not prove actual patrol presence, control, response, access, or enforcement. Route-security posture remains the owner of descriptive corridor safety.

### Headquarters

Headquarters is a place/facility relationship. The place owner retains settlement, district, site, building, infrastructure, and facility identity. A headquarters reference does not create ownership, property, access, storage, spawn, roster, or schedule behavior.

### Public Posture And Readiness

Static force identity may later carry a broad authored public role or doctrinal posture. Current readiness, strength, morale, supply, alert level, mobilization, losses, deployment, and response capacity are mutable runtime/simulation state and must not be stored as static identity. Route-security `publicReliability` and patrol-presence bands remain overlay posture, not force readiness.

## 5. Organization, Membership, Rank, And Office Boundary

Force identity does not own current people or organizational execution:

- membership eligibility and organization type may be described only after a dedicated relationship decision;
- current members, recruits, officers, casualties, vacancies, and assignments are rosters/personnel state;
- rank names and hierarchies require a separate vocabulary/structure decision if reuse is proven;
- an office is a durable role/seat, not the force itself;
- an office-holder is a person-to-office relationship, not force identity;
- a command structure or administrative unit must not be inferred from names such as command, watch, garrison, cohort, company, or order.

The future force family must not absorb people/NPC, profession/role, title, institution, or office authority.

## 6. Enforcement, Law, And Case Boundary

A force may later be related to a government, jurisdiction, law, court, office, or institution. It does not own their authority.

Static force records must not contain or execute:

- arrest, detention, search, seizure, pursuit, interrogation, evidence, warrant, bounty, wanted, court, sentencing, punishment, fine, or case behavior;
- legal applicability, law text, legal powers, immunity, rights, duties, exemptions, or jurisdiction priority;
- reputation, notoriety, standing, hostility, access, service, quest, reward, or consequence mutation;
- crime resolution, law enforcement, procedural rules, or player legal status.

Jurisdiction answers where/over whom authority applies. Law answers which rules exist. Runtime owners later decide whether and how an eligible actor enforces them. A force identity never makes enforcement executable by itself.

## 7. Place, Facility, And Route-Security Boundary

Settlements, forts, citadels, keeps, watchtowers, gates, bastions, redoubts, barracks, roads, ports, checkpoints, and other sites/facilities remain place, infrastructure, route, or future facility authority.

- A place named Watch is not a watch organization.
- A fort or garrison site does not prove an authored garrison body.
- Security, military, guard, garrison, or watch prose on a settlement remains descriptive place context.
- Synthetic `authority.<settlement>.garrison` and `.garrison_command` ids remain derived ownership/operation projections.

`world.route_security_profiles` remains a separate descriptive overlay for patrol presence, maintenance, checkpoints, toll posture, escort availability, organized danger, conflict disruption, and public reliability. A route-security body may later be a force identity, but the force does not own the route's security posture and the overlay does not create the force.

No route-security fixture id or name is canonical force evidence.

## 8. Combat, Unit, Party, Encounter, And Runtime Boundary

Force identity is not a combatant, unit, party, squad, encounter group, spawn profile, tactics profile, or equipment loadout.

Combat/runtime retains:

- current units, parties, formations, members, leaders, positions, health, effects, morale, supplies, and equipment;
- spawn candidates, encounter composition, disposition, hostility, tactics, actions, targets, and outcomes;
- deployments, patrol routes, schedules, shifts, assignments, mobilization, reinforcement, response, and AI;
- current strength, readiness, losses, occupation, control, incidents, and world/player consequences.

Combat `guard` vocabulary means defensive posture/action. It must not be normalized into force identity. A future runtime force instance or detachment may reference static force identity only after a dedicated integration contract exists.

## 9. Adjacent Identity Authorities

- **Polity** owns durable political identity.
- **Government** owns an explicitly authored governing arrangement or organization when its relational/temporal model is ready.
- **Jurisdiction** owns applicability of authority.
- **Law/court** owns descriptive rules and judicial authority, not execution.
- **Institution** owns a durable structured body not better covered by a specific owner.
- **Office** owns a durable role or seat after that authority becomes schema-ready.
- **Guild** owns existing trade/craft/merchant corporate identity.
- **Religion/religious order** owns doctrine, worship, and religious identity.
- **Faction** owns political, ideological, social, criminal, rebel, or pressure-group identity.
- **Business** owns commercial enterprise identity.
- **Place/facility** owns physical anchors.
- **Profession/role/title** owns personal role/status vocabulary.
- **Quest/reputation** owns authored presentation, requirements, consequences, and mutable standing through their current owners.

A mixed organization must have one primary canonical identity owner. A later explicit relationship may connect it to a force; duplicate records and prefix conversions are forbidden.

## 10. Evidence Classification Preserved

- `office.civic_watch.aurelis` remains a quest presentation anchor. It does not establish an office record or force record.
- Aurelis Civic Watch remains ambiguous among a force, office, institution, government unit, provider, or presentation abstraction.
- Inspector Halwen Crest remains a contact string, not a canonical person or office-holder.
- `rep.civic_watch.aurelis` remains mutable reputation-target vocabulary.
- Quest arrest, warrant, case, evidence, and reward language remains quest/runtime presentation.
- All 28 settlement matches remain heterogeneous place descriptors.
- Route-security watch ids remain test-only fixtures.
- `military_authority`, `civil_authority`, and `authority.*` garrison/command ids remain derived projections.
- Combat, backstory, UI, reputation, consumer, test, and runtime strings remain separately owned.

Exactly zero `force.*` ids carry forward. Do not invent `force.aurelis_civic_watch` or normalize any current string.

## 11. Reference-Free Contract And Schema Readiness

A reference-free identity shell containing only id, name, summary, form, lifecycle, public posture, and provenance would be syntactically possible but semantically unsafe.

Without explicit relationship semantics, it could not reliably distinguish:

- a force from an institution, office, guild, religion/order, faction, or business;
- a force body from a place, facility, combat unit, or route-security overlay;
- public-order identity from a generic organization with armed members;
- enduring identity from a temporary detachment, patrol, encounter group, or runtime projection.

Affiliation, mandate, coverage, and headquarters are therefore intrinsic boundary concepts. Their exact required/optional cardinality and targets remain unproven because government, jurisdiction, office, People/NPC, and several adjacent owners are gated and no canonical force seed exists.

Force authority is boundary-ready but not schema-ready. Do not select a schema plan until new authored evidence or a ready consumer proves the smallest coherent static relationship contract.

## 12. Reopening And Deferral Posture

The next pass should be `Version 0.5.347 - Force Public Order Authority Evidence Deferral`.

That pass should fix exact reopening conditions, including at least one of:

- an explicitly approved authored force seed list;
- materially new canonical content that clearly names an enduring armed/protective body and its primary owner;
- an authorized civic authorship pass that supplies a decision-complete force identity plus affiliation/mandate/coverage/headquarters posture;
- a ready consumer that proves why a minimal static force reference contract is required and identifies supported target authorities.

It should prohibit repeated scans of unchanged quest, place, route-security, derived, combat, backstory, UI, test, and runtime evidence. Schema, content, registration, references, migrations, consumers, and runtime must remain separate future gates.

## 13. Deep Research, User Question, Support, And Cleanup

Deep Research is not required. The unresolved input is project canon and repository relationships, not external policing or military taxonomy.

No explicit user question is required now. The lane can fail closed until authored evidence or a ready consumer exists. A future user question is appropriate only if the user chooses to author exact force canon or approve a seed list.

No support suffix is required. The evidence audit and this boundary decision are decision-complete.

No temporary guardrail document was created or remains for this lane. `docs/design/force-public-order-authority-evidence-audit.md` remains the permanent classified evidence source until superseded by materially new canon. This decision is the permanent owner boundary. No cleanup deletion is warranted.

## 14. Explicit Non-Goals

- no content, schema, validator, test, normal lint, collection/prefix, candidate, seed, reference, resolver, adapter, consumer, migration, alias, or compatibility behavior;
- no polity, government, jurisdiction, law, court, institution, office, guild, religion/order, faction, business, place, route-security, profession, role, title, quest, or reputation authority change;
- no roster, membership, rank, office-holder, deployment, readiness, patrol, schedule, spawn, encounter, combat, AI, arrest, enforcement, case, access, runtime, UI, storage, save/account, event, command, reward, or gameplay behavior;
- no gated-lane reopening, Deep Research, temporary artifact, support suffix, or `0.6.0` transition.

## 15. Decision Answers

1. Use one broad future force identity family, not separate watch/militia/garrison/military/route-security-body collections.
2. Include a martial/military order only when its primary identity is the armed/protective body and no specific existing owner fits better.
3. Static force identity may eventually own stable identity, form, summary, lifecycle, public posture, provenance, and approved relationships.
4. Affiliation, mandate, coverage, and headquarters are intrinsic relationship concepts but their contract is unproven.
5. Current readiness, strength, deployment, roster, rank assignments, schedules, patrols, spawning, encounters, AI, enforcement, and consequences remain outside static identity.
6. Polity, government, jurisdiction, law, institution, office, guild/religion/faction/business, place/facility, profession/role/title, combat, route-security, quest/reputation, runtime, UI, and save/account owners remain separate.
7. Aurelis Civic Watch, settlement descriptors, route-security fixtures, and synthetic garrison/military ids remain non-canonical force evidence.
8. Exactly zero `force.*` ids carry forward.
9. A reference-free first-pass contract is not semantically coherent enough for schema planning.
10. Force authority is boundary-ready but not schema-ready.
11. Select a fail-closed evidence deferral, not a schema plan.
12. Deep Research, an explicit user question, and a support suffix are not required.
13. No temporary guardrail needs deletion.
14. Select `Version 0.5.347 - Force Public Order Authority Evidence Deferral` next.

## 16. Next Recommended Version

Version 0.5.347 - Force Public Order Authority Evidence Deferral
