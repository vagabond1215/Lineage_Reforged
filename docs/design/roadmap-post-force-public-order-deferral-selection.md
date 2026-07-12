# Roadmap Post-Force-Public-Order Deferral Selection

Source version/run: Version 0.5.348 - Roadmap Post-Force-Public-Order Deferral Selection
Date: 2026-07-12
Status: approved documentation-only roadmap selection; no implementation permission

## 1. Selection Result

Select exactly one next route:

- `Version 0.5.349 - Diplomacy Conflict Authority Evidence Audit`

Diplomacy/conflict is the smallest eligible unresolved static authority lane. Two planned polity identities are live and normally validated, and the permanent civic boundary already requires diplomatic relations, conflicts, claims/borders, government, jurisdiction, law, force, places, and mutable runtime state to remain distinct.

Current evidence is narrow and mixed: broad `world_maps.json` conflict-zone summaries, polity exclusions, region/settlement political prose, and possible quest/design/runtime vocabulary. A focused audit can classify those already bounded source families and determine whether diplomacy and conflict have any canonical identities or only boundary evidence. It must not create records, schemas, references, relations, conflicts, claims, wars, or runtime behavior and may carry forward zero ids.

## 2. Current Gate Summary

- Force/public order, government/jurisdiction, business, faction, institution, and People/NPC are gated on materially new authored input or a qualifying ready consumer.
- Service, resource/commodity, and combat health are stable, registered, and paused.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- Office remains not schema-ready.
- Law remains downstream of jurisdiction.
- Living Character Manuscript implementation remains gated behind history/provenance/knowledge/persistence/fallback/quality readiness.
- Broad magic runtime remains forbidden without explicit approval.
- Save/account schema and runtime ownership transition remain maturity/high-risk gated.
- No concrete validation defect justifies a support suffix.

## 3. Candidate Lane Inventory

| Lane | Current posture | Smallest possible next step | Eligibility |
| --- | --- | --- | --- |
| Force/public order | One-family zero-id authored-input/ready-consumer deferral | Reopen only for a qualifying new input | Blocked |
| Government/jurisdiction | Zero-id relational/temporal deferral | Reopen only for a qualifying new input | Blocked |
| Business | Zero-id authored-input deferral with scaffold | Reopen only for qualifying canon | Blocked |
| Faction | Zero-id authored-input deferral with scaffold | Reopen only for qualifying canon | Blocked |
| Institution | Zero-id authored-input deferral with scaffold | Reopen only for qualifying canon | Blocked |
| People/NPC | No canonical named-person seed | Reopen only for qualifying canon | Blocked |
| Service | Stable registered five-record vocabulary | Later provider/access work after identity owners | Paused/dependency-blocked |
| Resource/commodity | Stable registered four-record seed | Later expansion only for a named need | Paused |
| Combat health | Stable registered two-status seed | Later expansion/runtime only for a named need | Paused/runtime-gated |
| Generic POI | Specific place owners preferred | Only a named specialized place family | Rejected |
| Highcrown settlement Knowledge | Current coverage complete | Independently justified new lane only | Closed |
| Office | Position/unit/department/force/role/facility meanings unresolved | New input or ready consumer first | Blocked by semantic ambiguity |
| Law/courts | Jurisdiction remains gated; court identity/procedure owners unresolved | Later work after prerequisites | Dependency-blocked |
| Diplomacy/conflict | Stable polity identities plus permanent separate-overlay boundary; current map/prose signals not yet audited under that boundary | Focused repository evidence audit | Eligible; selected |
| Claims/borders/control | Physical/political scope, validity, overlap, and control semantics remain broad | Later focused boundary after stronger evidence/consumer | Not selected |
| Provider identity | People/business/institution/facility and availability owners incomplete | Later owner/link boundary | Dependency-blocked |
| Membership/affiliation/rank/office-holder | People and authority identities plus temporal links incomplete | Later link-authority boundary | Dependency-blocked |
| Local reputation/standing/favorability | Mutable target/link semantics remain incomplete | Later runtime-state boundary | Dependency/runtime-blocked |
| Household/family continuation | People canon and membership/kinship inputs absent | New-input review only when prerequisites change | Dependency-blocked |
| Place specialization | Existing specific owners stable; no named missing family | Narrow audit only for a concrete need | Not selected |
| Property/estate/housing/storage | Crosses place, people/family, economy, account estate, ownership, and contents | Exact research question and consumer first | Research/dependency-gated |
| Construction/projects/fortifications | Crosses site, infrastructure, resource, economy, property, and progress | Exact research question and consumer first | Research/dependency-gated |
| Social/dialogue/relationships/companions | People/NPC and runtime/save prerequisites absent | Later research/boundary work | Blocked |
| Agriculture/land/food/livestock | Resource, production, place, property, economy, and time prerequisites | Deep Research gate with named consumer | Research/dependency-gated |
| Maritime/ships/ports/sea trade | Ship, route, port, economy, service, security, and ownership prerequisites | Deep Research gate with named consumer | Research/dependency-gated |
| Temporal/weather/festivals | Calendar exists; weather/event/recurrence ownership and named consumer remain broad | Research-readiness decision after a concrete consumer | Research-gated |
| Progression consolidation | Player/skill/Knowledge/trial/magic/guild/service/quest owners need maturity | Later named planning gate | Maturity/dependency-gated |
| Living Character Manuscript | Durable boundary exists; event/history retention and provenance gaps remain | Later source-retention/readiness route | Gated |
| Save/account architecture | High-risk schema and persistence work requires dedicated scope | Later dedicated readiness/research route | High-risk/maturity-gated |
| Runtime ownership transition | Stable commands/events/session/save ownership not yet proven | Dedicated future readiness decision | Premature |
| Stabilization/support | Focused validation and normal lint are green | Support suffix only for a concrete defect | Not selected |

## 4. Why Diplomacy/Conflict Is Next

This lane has enough stable prerequisites for evidence classification without reopening another gate:

1. `world.polities` contains exactly two planned, normally validated political identities and explicitly excludes diplomacy/conflict fields.
2. The civic boundary already separates diplomatic relations, conflicts, claims/borders/control, government, jurisdiction, law, forces, and runtime.
3. `world_maps.json` contains broad conflict-zone summaries that are explicitly map descriptors, not canonical conflict records.
4. Existing region, settlement, quest, map, design, and runtime language may contain alliance, rivalry, raid, succession-war, occupation, rebellion, or hostile-relation signals whose owner posture has not been consolidated under the completed civic sequence.
5. A narrow audit can distinguish a static diplomatic relation from a conflict identity/history and distinguish both from claim/control/map/runtime state.
6. The audit can fail closed with zero ids and select a later boundary or deferral without schemas, content, or simulation.

Government and jurisdiction are not prerequisites for asking whether a relation or conflict identity is canonically authored between stable polities. They remain prerequisites for any later semantics that specifically depend on governing arrangements, applicability, law, or enforcement.

## 5. Required Audit Boundaries

The next audit must keep distinct:

- polity and other canonical actor identity;
- physical region, locality, settlement, site, route, map, and geometry;
- government organization, jurisdiction applicability, law, court, and force identity;
- political claims, borders, control, occupation, recognition, vassalage, diplomacy, and conflict;
- a diplomatic relation versus a conflict identity, historical event, current war state, or runtime hostility;
- faction/guild/religion/institution/business/family/People identity and their future relationships;
- map `conflictZones`, place prose, quest prose, backstory, Knowledge, UI, tests, and design examples as non-authoritative until a specific owner is proven;
- current alliance/hostility, war progress, armies, battles, occupation, treaties, truces, negotiation, reputation, access, AI, events, commands, save/account, and gameplay as runtime/state concerns.

No current map zone, polity pair, place string, quest phrase, or runtime label may be normalized into `diplomatic_relation.*`, `conflict.*`, or any other new id by inference.

## 6. Serious Alternatives Considered

| Option | Decision | Reason |
| --- | --- | --- |
| Reopen force or another gated identity lane | Rejected | Exact reopening inputs are absent. |
| Law/court evidence | Rejected | Jurisdiction and court owner prerequisites remain unresolved. |
| Claims/borders/control audit | Deferred | Scope, temporal validity, overlap, and physical/political semantics are broader than diplomacy/conflict classification. |
| Provider/membership/reputation | Deferred | Canonical identity and link/state prerequisites remain incomplete. |
| Property/construction/agriculture/maritime/temporal research | Deferred | No narrow named consumer and complete prerequisite chain is ready. |
| Manuscript source-retention planning | Deferred | Important but larger and still gated; it does not displace the static authority sequence now. |
| Runtime-readiness audit | Deferred | Static/link/state and persistence prerequisites remain unresolved. |
| Support suffix | Rejected | No concrete defect, drift, or failing validation target exists. |

## 7. Deep Research, User Question, Support, And Cleanup

Deep Research is not required before the evidence audit. The immediate work is repository-local source and owner classification. External diplomacy or war-system taxonomy cannot establish project canon.

No explicit user question is required. The audit may carry zero ids and fail closed. Ask the user later only if exact diplomatic/conflict canon must be authored.

No support suffix is needed. Current validation is green and this roadmap selection is decision-complete.

No temporary guardrail or research artifact is needed. The next audit should be a permanent focused design document and must not create a temporary evidence dump.

Remain in `v0.5.x`. No dedicated runtime-readiness decision has approved transition to `0.6.0`.

## 8. Explicit Non-Goals

- no diplomacy, conflict, claim, border, control, occupation, treaty, alliance, truce, war, battle, government, jurisdiction, law, force, faction, institution, or person candidates/content;
- no schema, validator, test, normal-lint, reference, resolver, migration, adapter, or consumer changes;
- no politics, diplomacy, war, AI, armies, combat, occupation, reputation, access, event, command, runtime, UI, save/account, or gameplay behavior;
- no gated/paused/rejected/closed-lane reopening;
- no Deep Research, temporary artifact, support suffix, user-authored canon inference, or `0.6.0` transition.

## 9. Selection Answers

1. Force/public order and all prior authored-input/ready-consumer gates remain closed.
2. Service, resource/commodity, and combat health remain paused.
3. Generic POI remains rejected and Highcrown Knowledge remains closed.
4. Office, law/courts, providers, membership, reputation, household/family continuation, and broad later systems remain blocked or gated.
5. Diplomacy/conflict is the strongest eligible docs-first authority lane.
6. Stable polity identities and a permanent separate-overlay boundary make a focused audit dependency-correct.
7. Existing map conflict zones remain descriptors and are not candidate conflicts.
8. Claims/borders/control remain separate and are not combined into the selected audit.
9. The next audit may carry forward zero ids and authorize no schema or implementation.
10. Deep Research, an explicit user question, and a support suffix are not required.
11. No temporary artifact is needed.
12. Remain in `v0.5.x`.
13. Select `Version 0.5.349 - Diplomacy Conflict Authority Evidence Audit`.

## 10. Next Recommended Version

Version 0.5.349 - Diplomacy Conflict Authority Evidence Audit
