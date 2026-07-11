# Roadmap Post-Faction Deferral Selection

Source version/run: Version 0.5.327 - Roadmap Post-Faction Deferral Selection
Date: 2026-07-11
Status: documentation-only roadmap and authority-lane selection

## 1. Selection Summary

Select one narrow institutional boundary route next:

- `Version 0.5.328 - Institution Office Authority Boundary Decision`

The faction and People/NPC lanes are authored-input blocked; service, resource/commodity, and combat health are stable and paused; generic `world.pois` is rejected; Highcrown settlement Knowledge is closed. Among remaining candidates, institution/office has the clearest unresolved identity boundary and enough repository-local evidence for a decision without new content or Deep Research.

The existing organization/faction/guild audit already identifies Knowledge institution vocabulary, two quest `office.*` anchors, derived settlement institution profiles, protected guild/religion/polity/place/service owners, and missing institution/office authority. The accepted organization boundary explicitly requires a narrower institution/office boundary decision before schema planning. That decision is now the smallest safe next step.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.328 - Institution Office Authority Boundary Decision`.
- Faction and People/NPC retain durable new-authored-input reopening gates.
- Service, resource/commodity, and combat health remain stable, registered, and paused.
- Generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed.
- A general organization umbrella remains rejected.
- No content, schema, validator, test, registration, runtime, UI, save/account, or gameplay implementation is authorized.

## 3. Guardrails Carried Forward

- Preserve guild, polity, religion/religious-order, service, place, family/household/lineage, economy, account, reputation, quest, Knowledge, and runtime owners.
- Do not promote quest anchors, Knowledge vocabulary, tests/examples, demo data, generated ids, settlement profiles, guild classes, shadow networks, businesses, owner/operator categories, or runtime projections into canon.
- Institution and office must remain distinct from government, jurisdiction, law, public-order/military force, facility/site, guild, religion/order, school/academy, business/company, service/provider, family/house, faction, and person/NPC identity unless the next decision proves one narrow owner.
- Membership, affiliation, rank, employment, office holding, leadership, relationships, reputation, standing, favorability, access, services, law, diplomacy, conflict, runtime, UI, save/account, and gameplay remain separate.
- Do not reopen paused, rejected, closed, or authored-input-blocked lanes.

## 4. Candidate Lane Inventory

| Lane | Current posture | Smallest possible next step | Immediate eligibility |
| --- | --- | --- | --- |
| Faction | Schema/validator complete; seed authored-input blocked | Readiness review only after new canon | Blocked |
| People/NPC | Schemas/validator complete; seed authored-input blocked | Readiness review only after new canon | Blocked |
| Service | Five-record registered seed; post-registration stable | Later provider/access research or integration gate | Paused |
| Resource/commodity | Four-record registered seed; expansion gate closed for now | Later candidate audit or gathering research when needed | Paused |
| Combat health | Two-status registered seed; expansion gate closed | Later tiny status plan or health research when needed | Paused |
| Generic POI/discovery | Generic `world.pois` rejected; specific place owners preferred | Only a named specialized place need | Rejected/gated |
| Highcrown Knowledge | Completed and explicitly closed | New independently justified coverage need | Closed |
| General organization umbrella | Rejected in favor of specific owners | New boundary evidence proving non-duplication | Rejected |
| Institution/office | Missing canonical owner; current evidence already consolidated | Narrow identity/owner boundary decision | Eligible; selected |
| Government/jurisdiction/law/force | Permanent civic separation exists; multiple dependent layers remain | Narrow evidence/boundary route per layer | Eligible but broader |
| Business/company | Quest anchor, economy/property/account/runtime evidence split | Business/company boundary decision | Eligible but ownership evidence is more mixed |
| Provider/service organization | Services exist; provider identities incomplete | Provider/link boundary after identity owners | Dependency-blocked |
| Membership/affiliation/rank/office holder | Link/state semantics unresolved; People/NPC blocked | Dedicated link-authority boundary after identities | Dependency-blocked |
| Local reputation/standing/favorability | Existing broad player state; local owners absent | Mutable-state boundary after identities | Dependency-blocked/runtime-adjacent |
| Location/place specialization | Strong specific place authorities; no named new specialization selected | Narrow evidence audit for a concrete family | Eligible only with named need |
| Family/lineage/household | Schemas and existing owners present; actor/kinship continuations intersect People/NPC | Focused evidence/gate for a concrete continuation | Partially blocked |
| Property/construction/building ownership | Building/workplace/place/account/economy owners overlap | Boundary decision, likely after research gate | Eligible later; high cross-owner breadth |
| Social/relationship/dialogue/companion | People/NPC and runtime/save prerequisites absent | Later research/boundary work | Blocked |
| Agriculture | Resource/production/economy/place dependencies; research gate exists | Deep Research before broad authority work | Research-gated |
| Maritime | Route/place/economy/resource/service dependencies; research gate exists | Deep Research before broad authority work | Research-gated |
| Temporal/weather/festivals | Multiple world/runtime consumers; research gate exists | Deep Research before boundary work | Research-gated |
| Progression/advancement | Existing advancement framework; later broad research gate | Named planning decision after current authority work | Research/dependency-gated |
| Runtime ownership transition | `0.6.x` milestone requires dedicated readiness decision | Runtime-readiness audit/decision | Premature |

## 5. Candidate Comparison

| Serious candidate | Repository evidence | Unmet prerequisite | Deep Research now? | Decision |
| --- | --- | --- | --- | --- |
| Institution/office boundary | Knowledge institution labels; quest office anchors; derived institution profiles; protected owners; prior institutional audit | Exact distinction among institution, office, government, facility, guild, order, school, provider, business, projection | No | Select. Evidence is current and the prior boundary explicitly names this decision. |
| Government/jurisdiction/law/force boundary | Permanent civic decision and office/authority hooks | Scope must be split across several layers; institution/office boundary affects overlap | No for a later narrow route | Defer until institution/office separation is clearer. |
| Business/company boundary | Quest business anchor; workplaces/economy/property/account/generated businesses | Canonical company identity owner is mixed across economic/property/provider/runtime surfaces | No for a boundary, possibly later property research | Eligible later, but less decision-ready. |
| Provider/service-organization boundary | Stable service vocabulary; many possible provider types | People, business, institution, office, and facility identities incomplete | Not yet | Defer behind identity owners. |
| Membership/affiliation/rank/office links | Guild policy and future actor/institution needs | People/NPC and institution/office identity; temporal/mutable link semantics | Not yet | Defer. |
| Local reputation/standing/favorability | Existing broad fame/notoriety and UI/quest standing surfaces | Canonical local targets and mutable-state separation | Not yet | Defer; runtime-adjacent. |
| Property/construction ownership | Buildings, workplaces, settlements, economy, account estate, generated owner/operator state | Broad property/construction boundary and likely research | Likely before broad work | Defer. |
| Location specialization | Existing specific place authority and rejected generic umbrella | No concrete missing place family currently selected | No | Do not invent a lane; defer until a named need exists. |

## 6. Rejected / Paused / Closed Lane Explanations

Faction and People/NPC cannot proceed without new authored canon. Repeating evidence scans would violate their deferral gates.

Service, resource/commodity, and combat health completed their current foundation sequences and have explicit pause decisions. No changed prerequisite justifies reopening them.

Generic `world.pois` remains rejected because specific place families are safer. No concrete new place specialization is named. Highcrown Knowledge is complete and closed.

Agriculture, maritime, temporal/weather/festivals, property/construction breadth, progression breadth, social/dialogue/companions, and runtime ownership transition have research, identity, integration, or maturity prerequisites that make them larger and less immediate.

## 7. Eligible Lane Analysis

Institution/office, government/civic layers, business/company, and narrow property/location boundary work are conceptually eligible for docs-only decisions. Institution/office is strongest because:

1. the repository already contains a focused institutional evidence inventory;
2. the organization/faction/guild boundary decision explicitly identifies institution/office as the next unresolved specific-owner distinction;
3. the decision can be made without canonizing quest anchors or runtime projections;
4. it precedes provider, membership/office-holder, local reputation, and some civic overlap decisions;
5. it is narrower than government/jurisdiction/law/force or property/construction;
6. it requires no Deep Research, user question, or implementation.

The next decision should be allowed to preserve and defer both institution and office if the evidence does not support a safe schema candidate. It must not presume implementation.

## 8. Selected Option And Rationale

Select `Version 0.5.328 - Institution Office Authority Boundary Decision`.

This route should decide whether institution and office are separate static identity owners, whether either is schema-ready, and how they remain distinct from existing and future authorities. It should use the current institutional audit rather than repeat broad discovery, and it should select at most one later schema/evidence route.

No institution or office candidate id, schema, content, registration, membership, provider, civic behavior, or runtime integration is authorized.

## 9. Deep Research Posture

Deep Research is not required before `0.5.328`. The immediate question is repository ownership: how existing specific authorities, presentation anchors, and derived profiles should remain separated. External institutional models would not resolve canonical owner boundaries.

Later research may help with governance, bureaucracy, institutional simulation, property, services, or social systems after a decision names a concrete consumer.

## 10. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. This selection is complete and advances to a normal primary docs-first boundary decision.

No explicit user question is required before `0.5.328`; the decision can fail closed and select preservation if no schema-ready owner emerges.

## 11. Explicit Non-Goals

- no content, schema, validator, test, registration, alias, migration, or candidate implementation;
- no institution, office, government, law, force, business, provider, membership, reputation, place, family, property, social, agriculture, maritime, temporal, progression, runtime, UI, save/account, or gameplay implementation;
- no faction or People/NPC reopening; no service/resource/combat expansion; no generic `world.pois`; no Highcrown Knowledge reopening;
- no Deep Research, temporary artifact, user-authored canon inference, or `0.6.0` transition.

## 12. Selection Question Answers

1. Faction and People/NPC are authored-input blocked; service, resource/commodity, and combat health are paused; generic POI is rejected/gated; Highcrown Knowledge is closed; broad later systems are dependency/research gated.
2. Institution/office, narrower civic layers, business/company, and some concrete owner-boundary lanes are docs-only eligible.
3. Institution/office has the clearest unresolved owner boundary.
4. Institution/office has enough current repository evidence for a boundary decision without another broad audit.
5. `Version 0.5.328 - Institution Office Authority Boundary Decision` is the smallest safe route.
6. No. Deep Research is not required first.
7. No. A support-suffix run is not needed.
8. No. An explicit user question is not needed.
9. No. The selected route authorizes no content, schema, validator, test, registration, runtime, UI, save/account, or gameplay implementation.
10. Select `Version 0.5.328 - Institution Office Authority Boundary Decision`.
11. Preserve all specific owners; reject anchors/projections as canon; keep institution distinct from office/government/facility/guild/order/business/provider; exclude membership/reputation/services/runtime; select at most one later route.

## 13. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required handoff, active prompt, sequence, roadmap, backlog, faction/People deferrals, service/resource/combat gates, civic/economy/institutional boundaries, validation consolidation, pipeline, and Deep Research policy reads.
- Narrow current-state checks of serious candidate prerequisites and existing institutional evidence; no completed audit was repeated.
- Required schema tests, normal content lint, docs-only scope, conflict-marker, whitespace, artifact, stale-route, diff, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 14. Next Recommended Version

Version 0.5.328 - Institution Office Authority Boundary Decision
