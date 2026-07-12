# Roadmap Post-Government-Jurisdiction Deferral Selection

Source version/run: Version 0.5.344 - Roadmap Post-Government-Jurisdiction Deferral Selection
Date: 2026-07-12
Status: approved documentation-only roadmap selection; no implementation permission

## 1. Selection Result

Select exactly one next route:

- `Version 0.5.345 - Force Public Order Authority Evidence Audit`

Force/public-order identity is the smallest eligible unresolved authority lane. Current repository signals are concrete but mixed: Aurelis Civic Watch quest presentation, fort/watch/garrison place descriptors, synthetic `military_authority` and `authority.*.garrison*` projections, route-security posture, combat/guard vocabulary, and backstory prose. The permanent civic boundary already requires force identity to remain separate from polity, government, jurisdiction, law, institution, office, place, and enforcement runtime.

These signals justify one focused evidence audit, not a schema, content, roster, patrol, enforcement, or runtime pass. The audit may carry forward zero ids.

## 2. Current Gate Summary

- Government/jurisdiction, business, faction, institution, and People/NPC are gated on materially new authored input or a qualifying ready consumer.
- Service, resource/commodity, and combat health are stable, registered, and paused.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- Office remains not schema-ready.
- Law remains downstream of jurisdiction.
- Force/public order remains separate from enforcement/runtime and has not received a dedicated evidence audit.
- Runtime ownership transition remains a `0.6.x` maturity milestone.

## 3. Candidate Lane Inventory

| Lane | Current posture | Smallest possible next step | Eligibility |
| --- | --- | --- | --- |
| Government/jurisdiction | Zero-id authored-input/ready-consumer deferral | Reopen only for a qualifying new input | Blocked |
| Business | Zero-id authored-input deferral with scaffold | Reopen only for qualifying canon | Blocked |
| Faction | Zero-id authored-input deferral with scaffold | Reopen only for qualifying canon | Blocked |
| Institution | Zero-id authored-input deferral with scaffold | Reopen only for qualifying canon | Blocked |
| People/NPC | No canonical named-person seed | Reopen only for qualifying canon | Blocked |
| Service | Stable registered five-record vocabulary | Later provider/access work after identity owners | Paused/dependency-blocked |
| Resource/commodity | Stable registered four-record seed | Later expansion only for a named need | Paused |
| Combat health | Stable registered two-status seed | Later expansion/runtime only for a named need | Paused/runtime-gated |
| Generic POI | Specific place owners preferred | Only a named specialized place family | Rejected/gated |
| Highcrown settlement Knowledge | Current coverage complete | Independently justified new lane only | Closed |
| Force/public order | Mixed quest, place, route-security, derived, combat, prose, and runtime signals; no dedicated authority | Focused evidence audit | Eligible; selected |
| Office | Position/unit/department/force/role/facility meanings unresolved | Later evidence/boundary route with stronger source or consumer | Blocked by semantic ambiguity |
| Law/courts | Jurisdiction remains gated; courts span institution/office/place/people/procedure/runtime | Later work after prerequisites | Dependency-blocked |
| Provider identity | People/business/institution/facility and link/availability owners incomplete | Later owner/link boundary | Dependency-blocked |
| Membership/affiliation/rank/office-holder | People and authority identities plus temporal links incomplete | Later link-authority boundary | Dependency-blocked |
| Local reputation/standing/favorability | Mutable target/link semantics remain incomplete | Later runtime-state boundary | Dependency/runtime-blocked |
| Household/family continuation | People canon and membership/kinship inputs absent | New-input review only when prerequisites change | Dependency-blocked |
| Place specialization | Existing specific owners stable; no named missing family | Narrow audit only for a concrete need | Not selected |
| Property/estate/housing/storage | Crosses place, people/family, economy, account estate, ownership, and contents | Exact research question and consumer first | Research/dependency-gated |
| Construction/projects/fortifications | Crosses site, infrastructure, resource, economy, property, and progress | Exact research question and consumer first | Research/dependency-gated |
| Social/dialogue/relationships/companions | People/NPC and runtime/save prerequisites absent | Later research/boundary work | Blocked |
| Agriculture/land/food/livestock | Resource, production, place, property, economy, and time prerequisites | Deep Research gate with named consumer | Research/dependency-gated |
| Maritime/ships/ports/sea trade | Ship, route, port, economy, service, security, and ownership prerequisites | Deep Research gate with named consumer | Research/dependency-gated |
| Temporal/weather/festivals | Calendar exists; weather/event/recurrence owners remain broad | Deep Research gate with named consumer | Research-gated |
| Progression consolidation | Existing player/skill/Knowledge/trial/magic/guild/service/quest owners need maturity | Later named planning gate | Maturity/dependency-gated |
| Knowledge/magic | Current lane closed or prerequisite/runtime gated under magic guardrails | Owner-specific future decision | Closed/gated |
| Runtime transition | Stable commands/events/session/save ownership not yet proven | Dedicated future readiness audit | Premature |
| Stabilization/support | Required focused validation and normal lint are green | Support suffix only for a concrete defect | Not selected |

## 4. Why Force/Public Order Is Next

Force/public order has a narrower static identity question than the remaining broad or dependency-blocked lanes:

1. `office.civic_watch.aurelis` and the display name Aurelis Civic Watch provide one authored presentation signal with explicit office/force/government ambiguity.
2. Settlements contain fort, citadel, watch, garrison, guard, military, and security descriptors owned by place/economy content.
3. Settlement simulation generates `military_authority` and `authority.<settlement>.garrison` / `.garrison_command` projections.
4. Route-security content and validators describe threat/security posture while explicitly excluding guard rosters, patrols, jurisdiction, courts, AI, and enforcement.
5. Combat skills/abilities and guard terminology are action vocabulary, not civic force identity.
6. Backstory and UI prose mention garrisons, watches, guards, and military service without establishing canonical organizations.

A focused audit can classify these exact source families and decide whether force/public order is one future owner, several distinct families, or an authored-input deferral. It must not infer candidates from a place name, unit label, generated id, or quest anchor.

## 5. Required Audit Boundaries

The next audit must preserve:

- polity, government, jurisdiction, law, institution, office, guild, faction, religion/order, business, family/house, people/NPC, profession/role, service/provider, and place identities;
- settlement fort/watch/garrison tags and prose as place descriptors;
- route-security/hazard profiles as descriptive overlays;
- combat guard, role, tactics, ability, equipment, encounter, and spawn vocabulary as game/combat owners;
- synthetic military/civil authority ids as derived projections;
- quests and reputation targets as presentation/mutable consumers;
- mandates, coverage, affiliation, headquarters, readiness, rosters, membership, ranks, office-holders, schedules, patrols, spawning, encounters, AI, arrest, enforcement, cases, law, reputation, access, runtime, UI, save/account, and gameplay as distinct later layers.

## 6. Serious Alternatives Considered

| Option | Decision | Reason |
| --- | --- | --- |
| Force schema planning now | Rejected | Exact identity family, authored candidates, mandate/coverage boundaries, and reference posture remain unaudited. |
| Office evidence route | Deferred | Current office evidence is only two quest anchors, one of which is force-ambiguous; force has broader classified-source value first. |
| Provider/membership/reputation | Deferred | Required canonical identities and link/mutable-state semantics remain incomplete. |
| Law/court route | Rejected | Jurisdiction is gated and courts have multiple unresolved owners. |
| Property/construction/agriculture/maritime/temporal | Deferred | Broader research and dependency gates remain unmet. |
| Runtime-readiness audit | Deferred | Static authority/link/state prerequisites remain unresolved. |
| Support suffix | Rejected | No concrete defect, regression, drift, or failing validation target exists. |

## 7. Deep Research, User Question, Support, And Version Posture

Deep Research is not required before the evidence audit. The immediate task is repository-local source classification. External military or policing taxonomy cannot decide project canon.

No explicit user question is required. The audit can fail closed and may identify a later authorship gate.

No support-suffix run is needed. Current focused validation and normal lint are green.

Remain in `v0.5.x`. Static owner classification is foundation stabilization. Do not advance to `0.6.0` without a dedicated runtime-readiness decision.

## 8. Explicit Non-Goals

- no force/public-order candidates, content, schema, validator, test, registration, references, migrations, adapters, rosters, or consumers;
- no enforcement, arrest, patrol, AI, spawn, encounter, combat, law, case, reputation, access, runtime, UI, save/account, or gameplay implementation;
- no gated/paused/rejected/closed-lane reopening;
- no Deep Research, temporary artifact, support suffix, or `0.6.0` transition.

## 9. Selection Answers

1. All current authored-input/ready-consumer gates remain closed.
2. Service, resource/commodity, and combat health remain paused.
3. Generic POI remains rejected and Highcrown Knowledge remains closed.
4. Force/public order is the strongest eligible docs-first lane.
5. Its smallest safe next step is a focused evidence audit.
6. Enforcement/runtime remains separate from static force identity.
7. Office remains not schema-ready and is not selected.
8. Provider, membership, reputation, law/courts, family continuation, property, construction, social, agriculture, maritime, temporal, progression, Knowledge/magic, and runtime remain blocked, gated, or broader.
9. No concrete stabilization defect justifies a support suffix.
10. Deep Research and an explicit user question are not required.
11. Remain in `v0.5.x`.
12. Select `Version 0.5.345 - Force Public Order Authority Evidence Audit`.

## 10. Next Recommended Version

Version 0.5.345 - Force Public Order Authority Evidence Audit
