# Roadmap Post-Business Deferral Selection

Source version/run: Version 0.5.340 - Roadmap Post-Business Deferral Selection
Date: 2026-07-12
Status: approved documentation-only roadmap selection; no implementation permission

## 1. Selection Result

Select exactly one next route:

- `Version 0.5.341 - Government Jurisdiction Authority Evidence Audit`

Government/jurisdiction is the smallest eligible unresolved authority lane after the business deferral. Two planned polity identities and their physical-place anchors are live and normally validated. The permanent civic boundary already separates polity, government, jurisdiction, law, force, and mutable state. Institution/office separation is also complete. What remains unresolved is which current authored sources, if any, support durable government organization or jurisdiction applicability without promoting settlement descriptors, polity form, quest anchors, derived operators, law/runtime labels, or prose.

The next run is an evidence audit only. It must classify government and jurisdiction evidence separately, keep law downstream of jurisdiction, and keep force/enforcement separate. It may carry forward zero candidates and select a fail-closed boundary or deferral route.

## 2. Current Gate Summary

- Business, faction, institution, and People/NPC seed/content lanes are authored-input gated with zero approved ids.
- Service, resource/commodity, and combat health are stable, registered, and paused.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- Office remains not schema-ready and separate from institution, government, force, facility, role, and quest anchors.
- Two planned polity records are live and normally validated; polity identity does not own government or jurisdiction.
- Law must follow jurisdiction authority.
- Force, courts, enforcement, citizenship/legal status, reputation, access, taxation, diplomacy, conflict, and runtime consequences remain separate.
- Runtime ownership transition remains a `0.6.x` maturity milestone.

## 3. Candidate Lane Inventory

| Lane | Current posture | Smallest possible next step | Eligibility |
| --- | --- | --- | --- |
| Business | Schema/validator complete; zero-id authored-input deferral | Reopen only for qualifying new canon | Blocked |
| Faction | Schema/validator complete; zero-id authored-input deferral | Reopen only for qualifying new canon | Blocked |
| Institution | Schema/validator complete; zero-id authored-input deferral | Reopen only for qualifying new canon | Blocked |
| People/NPC | Schemas/validator complete; no canonical named-person seed | Reopen only for qualifying new canon | Blocked |
| Service | Stable registered five-record vocabulary | Later provider/access decision after identity owners | Paused/dependency-blocked |
| Resource/commodity | Stable registered four-record seed | Later expansion only for a named need | Paused |
| Combat health | Stable registered two-status seed | Later expansion/runtime work only for a named need | Paused/runtime-gated |
| Generic POI | Specific place owners remain preferred | Only a named specialized place family | Rejected/gated |
| Highcrown settlement Knowledge | Accepted coverage complete | New independently justified lane only | Closed |
| Government/jurisdiction | Polity identity and civic boundaries exist; current authored evidence remains unclassified under the newer owner separations | Focused repository evidence audit | Eligible; selected |
| Law/courts | Law requires jurisdiction; courts require institution/office/people and procedure boundaries | Later boundary/evidence work after jurisdiction | Dependency-blocked |
| Force/public order | Settlement descriptors and derived military/civic operators are not canonical forces | Later dedicated evidence/boundary audit | Eligible later, but separate from government/jurisdiction |
| Provider identity | Requires canonical people/business/institution/facility owners and link/availability semantics | Later owner/link boundary | Dependency-blocked |
| Membership/affiliation/rank/office-holder | Requires canonical people and authority identities plus temporal link semantics | Later link-authority boundary | Dependency-blocked |
| Local reputation/standing/favorability | Mutable actor-to-authority state lacks stable target/link boundaries | Later runtime-state boundary | Dependency/runtime-blocked |
| Settlement/place specialization | Existing specific owners are stable; no concrete missing family is selected | Narrow audit only for a named need | Not selected |
| Household/family continuation | Schemas/validators exist, but People/NPC canon and membership/kinship inputs remain absent | New-authored-input review only when prerequisites change | Dependency-blocked |
| Property/estate/housing/storage | Static place/property, people/family, economy, estate, ownership, and contents seams remain broad | Exact Deep Research question before broad boundary work | Research/dependency-gated |
| Construction/projects/fortifications | Requires property/site/infrastructure/resource/economy/progress ownership | Exact Deep Research question before broad boundary work | Research/dependency-gated |
| Social/dialogue/relationships/companions | People/NPC and authoritative runtime/save prerequisites remain absent | Later research/boundary work | Blocked |
| Agriculture/land/food/livestock | Requires resource, production, place, property, economy, and temporal decisions | Named Deep Research gate and consumer | Research/dependency-gated |
| Maritime/ships/ports/sea trade | Requires ship, route, place, property, economy, service, security, and ownership decisions | Named Deep Research gate and consumer | Research/dependency-gated |
| Temporal/weather/festivals | Calendar exists, but weather/event/recurrence owners and consumers remain broad | Named Deep Research gate and consumer | Research-gated |
| Progression consolidation | Existing player/skill/Knowledge/trial/magic/guild/service/quest owners need greater maturity | Later named planning gate | Maturity/dependency-gated |
| Remaining Knowledge/magic | Highcrown is closed; other work remains prerequisite- or runtime-gated under magic guardrails | Owner-specific future decision | Closed/gated |
| Runtime ownership transition | Requires a dedicated readiness audit proving stable commands/events/session/save ownership | Dedicated future readiness decision | Premature |
| Stabilization/support | Current focused validation and normal lint are green; no concrete defect is identified | Support suffix only if a real defect appears | Not selected |

## 4. Why Government/Jurisdiction Is Next

This lane now has prerequisites that earlier roadmap selections lacked:

1. `world.polities` provides two explicit planned political identities, `polity.valtherion` and `polity.draemor`, without embedding government or jurisdiction.
2. The civic authority decision permanently separates political identity, government organization, applicability scope, law text, forces, and mutable consequences.
3. The institution/office boundary prevents government bodies, offices, facilities, roles, and presentation anchors from collapsing into one owner.
4. Jurisdiction is an explicit prerequisite for any later law-code or local-law schema.
5. Existing settlement administrative roles, polity forms/place anchors, quest office anchors, derived civil/military operators, property legal labels, and runtime lawful-standing vocabulary require classification before any government or jurisdiction boundary/schema choice.

An evidence audit is safer than a schema plan because it can determine whether either owner has durable authored candidates, whether only vocabulary/boundary evidence exists, and whether government and jurisdiction should proceed together or separately. It authorizes no ids or implementation.

## 5. Required Evidence-Audit Boundaries

The next audit must keep these owners distinct:

- polity identity and descriptive polity form;
- physical region, locality, settlement, district, site, route, map, and geometry;
- government organization and temporal governing arrangement;
- jurisdiction applicability and scope;
- law code, ordinance, custom, charter text, courts, procedure, sanctions, and enforcement;
- institution, office, guild, faction, business, religion/order, family/house, people/NPC, profession/role, service/provider, property, and force identity;
- claims, borders, control, occupation, vassalage, diplomacy, and conflict overlays;
- citizenship, legal status, reputation, standing, access, licenses, taxation, cases, wanted/bounty, patrols, AI, and other mutable runtime/save state.

The audit must not infer government from `polityForm`, a seat anchor, royal/imperial prose, settlement `administrativeRole`, or a synthetic civil authority. It must not infer jurisdiction from a polity/place association, property `legalStatus`, lawful-standing vocabulary, or law/guard prose.

## 6. Serious Alternatives Considered

| Option | Decision | Reason |
| --- | --- | --- |
| Government schema planning now | Rejected | Current canonical organization evidence and cardinality/temporal posture have not been audited. |
| Jurisdiction schema planning now | Rejected | Applicability evidence, scope owners, overlap, priority, and authority anchors remain unclassified. |
| Combined government/jurisdiction implementation | Rejected | The layers are distinct and no content/schema permission exists. |
| Law or court work | Rejected | Jurisdiction must precede law; courts also depend on institution/office/people and procedure decisions. |
| Force/public-order work | Deferred | It deserves a separate evidence/boundary pass and must not be conflated with government or enforcement runtime. |
| Provider/membership/reputation | Deferred | Canonical actor/authority identities and link or mutable-state semantics remain incomplete. |
| Property/construction/agriculture/maritime/temporal | Deferred | These lanes remain broader and research/dependency gated. |
| Runtime-readiness audit | Deferred | Static authority and link/state prerequisites remain unresolved; no `0.6.0` transition is justified. |
| Support suffix | Rejected | No concrete defect, regression, drift, or validation failure exists. |

## 7. Deep Research, User Question, Support, And Version Posture

Deep Research is not required before the selected audit. The immediate question is repository-local ownership and authored evidence. External government or legal taxonomy cannot decide Lineage: Reforged canon.

No explicit user question is required. The audit can fail closed and may identify a later authored-input gate.

No support-suffix run is needed because current validation is green and no repair target exists.

Remain in `v0.5.x`. This is foundation ownership hardening. Do not advance to `0.6.0` without a dedicated runtime-readiness decision.

## 8. Explicit Non-Goals

- no content, schema, validator, test, normal-lint, candidate, alias, reference, migration, adapter, or consumer implementation;
- no business, faction, institution, People/NPC, service, resource/commodity, combat-health, POI, Highcrown Knowledge, office, or other gated-lane reopening;
- no government, jurisdiction, law, court, force, provider, membership, reputation, property, construction, social, agriculture, maritime, temporal, progression, magic, or runtime implementation;
- no Deep Research, temporary research artifact, broad evidence scan, support suffix, or `0.6.0` transition.

## 9. Selection Answers

1. Business, faction, institution, and People/NPC remain authored-input gated.
2. Service, resource/commodity, and combat health remain paused.
3. Generic POI remains rejected and Highcrown settlement Knowledge remains closed.
4. Government/jurisdiction is the strongest eligible docs-first lane.
5. Its smallest safe next step is a focused evidence audit, not a schema or implementation pass.
6. Law remains downstream of jurisdiction.
7. Force/public order remains a separate future owner and audit.
8. Provider, membership, and reputation remain dependency/runtime blocked.
9. Property, construction, agriculture, maritime, and temporal work remain research/dependency gated.
10. Progression, magic, and runtime transition remain maturity/prerequisite gated.
11. No concrete stabilization defect justifies a support run.
12. Deep Research is not required before the selected audit.
13. An explicit user question is not required.
14. A support-suffix run is not required.
15. Remain in `v0.5.x`.
16. Select `Version 0.5.341 - Government Jurisdiction Authority Evidence Audit`.

## 10. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required current handoffs, sequence, roadmap, backlog, authored-input deferrals, stable-lane pauses, POI rejection, Highcrown closure, civic/polity/institution-office boundaries, and current eligibility reads.
- Narrow comparison of serious candidate prerequisites; no completed evidence audit was repeated and no Deep Research artifact was created.
- Required focused tests, schema smoke, normal content lint, docs-only scope, unchanged-owner, gated-lane, artifact, conflict-marker, whitespace, route-pointer, diff, and status checks are recorded in `docs/dev/current-codex-output.md`.

## 11. Next Recommended Version

Version 0.5.341 - Government Jurisdiction Authority Evidence Audit
