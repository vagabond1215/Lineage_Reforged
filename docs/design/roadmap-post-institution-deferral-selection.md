# Roadmap Post-Institution Deferral Selection

Source version/run: Version 0.5.333 - Roadmap Post-Institution Deferral Selection
Date: 2026-07-11
Status: approved documentation-only roadmap selection; no implementation permission

## 1. Selection Result

Select exactly one next route:

- `Version 0.5.334 - Business Company Authority Evidence Audit`

Business/company is the smallest eligible unresolved authority lane because current repository surfaces demonstrate a real future identity need while mixing incompatible owners:

- an authored quest giver anchor names **Ironwheel Haulage Company** as `business.ironwheel_haulage_coppergate`;
- building templates expose `triggerBusinessTypes` and workplaces expose `businessScale`;
- settlement derivation emits synthetic `company.*` owner/operator ids;
- account estate logic recognizes `business.*` asset ids;
- runtime/UI activity projections expect player-linked business ledgers;
- demo state includes `business.gannet_cutter`.

These signals justify one focused evidence audit, not a schema, content, migration, provider, property, ledger, or runtime run. The audit must classify exact authored identity evidence separately from presentation anchors, reusable economy descriptors, mutable account assets, synthetic company ids, and demo/UI state.

## 2. Current Gate Summary

- Institution, faction, and People/NPC seed lanes are authored-input gated with zero approved ids.
- Institution and faction retain content-independent schema/validator/test scaffolds but no live wrappers or normal registration.
- Service, resource/commodity, and combat health are paused after stable registered slices.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- Office remains not schema-ready.
- Runtime ownership transition remains `0.6.x` maturity-gated.
- No candidate id, content implementation, or behavior expansion is authorized by this selection.

## 3. Lane Classification

| Lane | Classification | Selection result |
| --- | --- | --- |
| Institution seed/content | User-authorship-gated | Zero ids; reopening requires new authored canon. Do not rescan. |
| Faction seed/content | User-authorship-gated | Zero ids; reopening requires new authored canon. Do not rescan. |
| People/NPC seed/content | User-authorship-gated | No canonical named-person seed; social and relationship consumers remain blocked. |
| Service expansion/provider integration | Paused / dependency-blocked | Stable five-record registered vocabulary exists. Providers require canonical people, businesses, institutions, facilities, links, availability, and runtime decisions. |
| Resource/commodity expansion | Paused | Stable registered seed exists; no approved expansion need or consumer gap reopens it. |
| Combat health expansion | Paused | Stable registered two-status seed exists; conditions/injuries and runtime semantics remain unapproved. |
| Generic POI | Rejected | Specific place/authority owners remain the accepted model. |
| Highcrown settlement Knowledge | Closed | Accepted parent/district/site coverage is complete. |
| Office | Blocked | Position, unit, department, force, role, facility, and quest-anchor meanings remain unresolved. |
| Government / jurisdiction / law / force | Dependency-blocked | Civic boundaries separate these layers; jurisdiction must precede law, and force/enforcement/runtime require narrower owners and consumers. Current office/civic-watch anchors cannot establish them. |
| Business / company | Eligible for focused evidence audit | Mixed authored, presentation, economy-template, account, derived, and demo/runtime signals need classification before any boundary or schema decision. |
| Provider identity | Dependency-blocked | Provider links depend on canonical people/business/institution/facility owners and separate availability/access semantics. |
| Membership / affiliation / rank / office-holder | Dependency-blocked | Requires canonical people and authority identities plus temporal/link-state semantics. |
| Local reputation / standing / favorability | Dependency- and runtime-blocked | Mutable actor-to-authority state must be separated from membership, recognition, legal status, access, and account history. |
| Settlement/place expansion | Stable with gated follow-ups | Settlement, district, and site owners exist; no immediate evidence-backed new record or validation gap is selected. |
| Property / estate / housing / storage | Research- and dependency-gated | Requires people/household/site/economy/estate ownership seams; mutable ownership and contents remain runtime work. |
| Construction / projects / fortifications | Research- and dependency-gated | Requires site, infrastructure, resource, economy, property, and progress-state decisions. |
| NPC/social/dialogue/relationships | Blocked | People/NPC authored-input gate prevents identity-dependent social links; dialogue and mutable relationships remain later runtime work. |
| Agriculture / land / food / livestock | Research- and dependency-gated | Benefits from stable resource, economy, settlement, property, construction, and temporal boundaries; no narrow current consumer selects it. |
| Maritime / ships / ports / sea trade | Research- and dependency-gated | Requires route/map, settlement-site, resource/economy, security, travel, ship, and ownership clarity. |
| Temporal / weather / festivals | Research-gated | Calendar exists, but weather/event/recurrence authority is broad and lacks a named immediate narrow consumer. |
| Character progression consolidation | Maturity-gated | Current player, skill, Knowledge, trial, magic-study, guild, service, quest, and training owners should mature first. |
| Remaining Knowledge expansion | Closed or prerequisite-gated | Do not reopen Highcrown; other subject/source lanes require specific owner and validator decisions. |
| Magic Study / magic runtime | Prerequisite- and runtime-gated | Institution/teacher canon, item/document owners, policy boundaries, and runtime readiness remain incomplete; magic guardrails still apply. |
| Runtime ownership transition | Runtime-maturity-gated | A dedicated readiness decision must prove stable contracts, commands/events, authoritative session updates, and save/load policy before `0.6.0`. |
| Broad stabilization / metadata cleanup | Not selected | No fresh concrete defect, drift, or validation failure currently requires a support pass. |

## 4. Why Business/Company Is Next

Business/company has stronger current repository evidence than the other unresolved owner lanes, but its evidence is not yet decision-safe:

- **Authored presentation:** the Ironwheel Haulage Company quest giver supplies an exact display name and a `business.*` anchor, but quest presentation does not automatically establish canonical static identity.
- **Reusable templates:** `triggerBusinessTypes` and `businessScale` describe building/workplace compatibility and scale, not named firms.
- **Synthetic settlement state:** generated `company.<settlement>.<district>` ids are derived owner/operator placeholders and cannot mint authored canon.
- **Mutable account estate:** `business.*` asset classification concerns account ownership/state, not necessarily world identity.
- **Runtime/UI projections:** business windows expect revenue, expenses, upgrades, workforce, and ownership state; those are behavior/state consumers, not static identity authority.
- **Demo state:** `business.gannet_cutter` is explicitly a demo fixture.

A fresh focused audit should decide whether business and company are synonyms, separate families, or different layers; which current sources are canonical, partial, presentation-only, derived, mutable, or hypothetical; and whether enough evidence exists for a later boundary decision. It must carry forward no candidate id unless the audit proves exact canonical authority and owner placement.

## 5. Required Business/Company Audit Boundaries

The next audit must preserve:

- workplaces as production/workforce templates;
- buildings as facility templates;
- settlement/district/site as place identity;
- services as provider-independent vocabulary;
- guilds, institutions, factions, polities, religions/orders, families, and people as distinct owners;
- account estate as mutable account-owned asset state;
- property/ownership, contracts, stock, prices, finance, workforce, upgrades, provider availability, reputation, quests, runtime ledgers, UI, save/account, and gameplay as separate layers;
- generated `company.*` and demo `business.*` ids as non-canonical until explicitly proven otherwise.

The audit is not permission to create `civilization.businesses`, `civilization.companies`, or any other collection.

## 6. Deep Research / User Question / Support Posture

Deep Research is not required before `0.5.334`. The immediate question is repository-local evidence ownership. External corporate history or medieval commerce research cannot decide which existing Lineage: Reforged surfaces are canonical.

No explicit user question is required before the audit. It can classify evidence and may conclude that authorship is required later.

No support-suffix run is needed. Current validation is green and no workflow drift or repair blocker was found.

## 7. Version-Band Decision

Remain in `v0.5.x`.

Do not advance to `0.6.0`. The runtime ownership transition still lacks a dedicated readiness decision and multiple owner/link/state prerequisites remain gated. A business/company evidence audit is foundation ownership hardening, squarely within `v0.5.x`.

## 8. Explicit Non-Goals

- no business/company content, schema, validator, test, registration, candidates, aliases, migrations, or adapters;
- no provider, property, ownership, estate, membership, reputation, finance, contract, stock, price, workforce, upgrade, quest, runtime ledger, UI, save/account, or gameplay implementation;
- no gated/paused/rejected/closed-lane reopening;
- no repeated institution/faction/People audit, Deep Research, temporary research artifact, support suffix, or `0.6.0` transition.

## 9. Selection Question Answers

1. Office is blocked and not schema-ready.
2. Government/jurisdiction/law/force is dependency-blocked.
3. Business/company is eligible for a focused repository evidence audit only.
4. Provider identity is blocked on canonical providers and link/availability semantics.
5. Membership/affiliation/office-holder links are blocked on People and authority identities.
6. Local reputation/standing is mutable-state and dependency blocked.
7. Place owners are stable; property/construction remain research/dependency gated.
8. Social systems remain blocked on People/NPC and runtime ownership.
9. Agriculture and maritime remain research/dependency gated.
10. Temporal/weather/festivals remains broad and research-gated.
11. Progression consolidation remains maturity-gated.
12. Remaining Knowledge/magic work is closed, prerequisite-gated, or runtime-gated.
13. Runtime ownership remains `0.6.x` maturity-gated.
14. No support repair is currently needed.
15. Deep Research is not required before the selected route.
16. An explicit user question is not required before the selected route.
17. A support-suffix run is not required.
18. Remain in `v0.5.x`.
19. Select `Version 0.5.334 - Business Company Authority Evidence Audit`.

## 10. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required current handoffs, roadmap, sequence, backlog, institution/faction/People deferrals, service/resource/combat gates, POI rejection, Highcrown closure, civic/economy/social boundaries, consolidation, research policy, and future-system ledger reads.
- Narrow business/company surface checks confirmed one authored quest anchor, reusable business descriptors, synthetic company owner/operator ids, account estate classification, UI/runtime expectations, and demo state, with no dedicated content/schema/validator path.
- No completed evidence audit was repeated and no Deep Research artifact was created.
- Required focused tests, schema smoke, normal content lint, docs-only scope, conflict-marker, whitespace, route-pointer, diff, and status checks are recorded in `docs/dev/current-codex-output.md`.

## 11. Next Recommended Version

Version 0.5.334 - Business Company Authority Evidence Audit
