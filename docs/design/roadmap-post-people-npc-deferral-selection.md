# Roadmap Post-People-NPC Deferral Selection

Source version/run: Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection
Date: 2026-07-11
Status: documentation-only authority-lane selection

## 1. Selection Summary

Select organization/faction/guild authority for the next docs-first evidence run:

- `Version 0.5.321 - Organization Faction Guild Authority Evidence Audit`

This is the safest useful next lane because the repository already has 18 live broad guild records and a strict guild schema, while general organization and faction collections/schemas are absent. Polities and religions have separate live owners, settlement records embed local guild presence, quest and magic content contain organization-like references, and civilization runtime derives institution projections. The permanent civic and economy decisions require guilds, factions, and institutions to remain distinct, but no current audit consolidates the live evidence and unresolved ownership gaps for those institutional layers.

The next run should inspect repository evidence and decide whether any broader organization, faction, institution, or guild-boundary planning is justified. It must not create records, schemas, validators, registration, memberships, reputation, runtime behavior, or gameplay.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.321 - Organization Faction Guild Authority Evidence Audit`.
- People/NPC is paused behind the new-authored-input gate from `0.5.319`.
- Service, resource/commodity, and combat health are stable and paused.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- Runtime, UI, save/account, mutation, and gameplay remain outside this selection.

## 3. Stable Paused Lanes

### People/NPC

People/NPC remains paused. Live `people.json` and `npcs.json` and normal registration remain absent. No exact candidate is carried forward. The lane may reopen only after an explicit user-authored canonical seed list or genuinely new durable repository person-authority source exists. Organization names must not be used to infer people.

### Combat health

Combat health remains stable with exactly `combat_status.stagger` and `combat_status.bind`, registered through normal content lint. No status expansion, condition/injury planning, or health runtime work is authorized. Broad health/injury/recovery work remains gated by `GPT-DR.health.injury-recovery`.

### Resource/commodity

Resource/commodity remains stable with exactly `resource.iron_ore`, `resource.grain`, `commodity.iron_ore_lots`, and `commodity.grain_bundles`. No expansion is authorized. Broad gathering/extraction work remains gated by `GPT-DR.resources.gathering-extraction`.

### Service

Service remains stable with exactly `service.lodging`, `service.market_exchange`, `service.storage_warehouse`, `service.archives`, and `service.contract_board`. Its post-registration audit found no immediate follow-up. No provider, access, price, stock, effect, or service-runtime work is authorized.

No registration follow-up is needed for any of these paused lanes.

## 4. Rejected / Closed Lanes

- Generic `world.pois` remains rejected. Specific authority families retain identity; discovery state, map reveal, and markers remain separate runtime/save/UI concerns.
- Highcrown settlement Knowledge remains closed. No settlement, district, or site snippet work is reopened.
- People/NPC cannot reopen without a new authored input.
- Runtime ownership transition remains a later maturity change requiring a dedicated readiness decision; this run does not route to `0.6.0`.

## 5. Candidate Lane Comparison

| Candidate lane | Current repository posture | Selection result |
| --- | --- | --- |
| People/NPC continuation | Paused by `0.5.319`; no candidates, live wrappers, or registration; new authored input required. | Not selected; preserve pause. |
| Combat health continuation | Stable registered two-status seed and explicit expansion pause; broad work research-gated. | Not selected. |
| Resource/commodity continuation | Stable registered paired seed; broad gathering/extraction work requires Deep Research. | Not selected. |
| Service continuation | Stable registered five-service vocabulary; no immediate follow-up. | Not selected. |
| Generic discovery/POI | Generic `world.pois` is explicitly rejected. | Rejected. |
| Highcrown Knowledge | Parent settlement/district/site lane is closed. | Rejected. |
| Organization/faction/guild authority | Eighteen live validated guild identities; separate live polity and religion owners; absent general organization/faction collections and schemas; existing civic decision distinguishes factions, guilds, and institutions; organization-like references and derived projections need an owner audit. | Selected for repository-evidence audit only. |
| Location/region/settlement gaps | Settlement, district, site, semantic map-feature, route, and place foundations exist; no specific non-POI, non-Highcrown gap is currently selected. | Defer until a named gap is identified. |
| Family/lineage/household | Household/family decisions, schemas, validator, and tests exist, but durable membership/kinship depends on canonical people; genealogical lineage remains explicitly separate and deferred. | Defer while People/NPC canon is paused. |
| Property/construction/building ownership | Property depends on people/household/site evidence and focused research; construction depends on sites, infrastructure, resources, economy, and property boundaries. | Defer; research/dependency gated. |
| Dialogue/companions/social memory | Depends on stable People/NPC and relationship authority and belongs before later social runtime integration. | Defer. |
| Agriculture | Depends on resource/gathering, economy, settlement, property, construction, and temporal boundaries; dedicated high-mode research gate exists. | Defer. |
| Maritime | Depends on routes/maps, settlements/sites, resources, economy, security, and dedicated high-mode research. | Defer. |
| Time/weather/festivals | Has a dedicated later research gate and crosses calendar, events, agriculture, travel, civic, and religion. | Defer. |
| Progression consolidation | Prompt-pack policy says it can wait until player, Knowledge, trial, magic-study, guild, service, quest, and training authorities mature. | Defer. |
| Runtime ownership transition | Requires stable static contracts, command/state ownership, save/load policy, and a dedicated readiness decision. | Rejected as current route. |
| Other deferred lanes | Jurisdictions/laws, governments, containers/loot, trade overlays, repair/salvage, magic-study policies, and hazard overlays remain valid later candidates with their own prerequisites. | Not stronger than the selected institutional evidence gap today. |

## 6. Selected Lane And Rationale

Select organization/faction/guild authority for `0.5.321`.

Current evidence supporting an audit:

- `packages/content/base/civilization/guilds.json` contains 18 live broad guild records.
- `packages/schemas/civilization/guild.schema.json` is a strict existing guild contract.
- `world.polities` and `world.religions` already own political and religious identities and must not be duplicated.
- General `civilization.organizations` and `civilization.factions` content and schema paths are absent.
- Settlement `guildPresence` is local descriptive presence, not a replacement for the broad guild catalog or proof of a general institution.
- Quest giver metadata includes guilds, civic offices, businesses, government anchors, and individuals, but those presentation anchors are not automatically canonical institutions.
- Magic infrastructure uses religion-organization reference vocabulary that requires owner review rather than inferred records.
- Civilization runtime derives institution profiles from settlement, guild, religion, magic, and economy inputs; those projections are not authored institution identity.
- Knowledge uses generic institution/source vocabulary that does not establish a canonical institution collection.
- `docs/design/civic-authority-boundary-decision.md` explicitly separates factions, existing guilds, and future institutions.
- `docs/design/economy-authority-boundary-decision.md` preserves guilds/institutions separately from professions and runtime economy.

These surfaces provide enough repository evidence for a narrow boundary/evidence audit without approving a new collection. The audit should determine:

- which existing guild authority is complete and must be preserved;
- whether `organization`, `faction`, and `institution` are distinct future owners or overlapping vocabulary;
- which organization-like references are canonical, descriptive, synthetic, or presentation-only;
- whether businesses, civic offices, governments, religions/orders, guilds, and derived institution profiles already have sufficient owners;
- whether any future schema decision is justified, and for which single authority first;
- what explicit evidence would be required before any seed plan.

The next audit must not infer people from organization names, duplicate guilds/polities/religions/businesses/places, or treat runtime projections as authored canon.

## 7. Deep Research Posture

Deep Research is not required before `0.5.321`. The immediate question is repository authority and overlap: current guild content/schema, polity/religion owners, settlement guild presence, organization-like content references, derived projections, and permanent civic/economy boundaries.

External comparative research could later inform institutional simulation, faction reputation, governance, membership, or social dynamics, but it is unnecessary for a docs-only repository evidence audit and cannot override current owners.

No Deep Research should run and no temporary research artifact should be created in the selected route.

## 8. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. `0.5.321` is a new primary docs-first authority audit, not a repair or retry.

No explicit user question is needed before the audit. The repository can establish its current authority gaps without user-authored institutional content. If a later seed needs new canon, that later decision may request explicit authorship.

## 9. Non-Goals

This selection does not authorize:

- organization, faction, guild, institution, government, office, business, religion/order, polity, or people/NPC records;
- edits to live guild, polity, religion, settlement, quest, magic, Knowledge, service, resource/commodity, or combat-health content;
- schemas, validators, tests, normal content-lint registration, migrations, aliases, or generated projections;
- memberships, affiliations, roles, ranks, offices, reputation/standing, favorability, access, services, prices, stock, quests, law, diplomacy, conflict, tax, or economy execution;
- People/NPC reopening or person inference from institutional names;
- generic `world.pois` or Highcrown Knowledge reopening;
- Deep Research, runtime, UI, save/account, commands, events, rewards, AI, or gameplay;
- transition to `0.6.0`.

## 10. Selection Question Answers

1. Yes. People/NPC, combat health, resource/commodity, and service are stable enough to remain paused.
2. No. No registration follow-up is needed for those lanes.
3. No. People/NPC is not authorized to reopen without a new authored input.
4. No. Combat health continuation is not authorized now.
5. No. Resource/commodity expansion is not authorized now.
6. No. Service expansion is not authorized now.
7. No. Generic `world.pois` is not authorized.
8. No. Highcrown Knowledge is not authorized to reopen.
9. Compared lanes are listed in the candidate table: paused People/NPC, combat health, resource/commodity, service, rejected/closed POI and Highcrown lanes, organization/faction/guild, location, family/lineage/household, property/construction, dialogue/companions/social memory, agriculture, maritime, temporal/weather, progression, runtime transition, and other deferred authorities.
10. Organization/faction/guild authority is selected next.
11. It has substantial current repository evidence and an unresolved cross-owner boundary, while an evidence audit requires no content or runtime implementation and no external research.
12. No. The selected route does not require Deep Research before it starts.
13. No. It does not require a support-suffix run.
14. No. It does not require an explicit user question.
15. It must not implement content, schemas, validators, tests, registration, memberships, reputation, services, runtime, UI, save/account, gameplay, or infer people/organizations from weak references.
16. Select `Version 0.5.321 - Organization Faction Guild Authority Evidence Audit`.

## 11. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required handoff, roadmap, sequence, backlog, People/NPC, service, resource/commodity, combat-health, consolidation, and Deep Research decision reads.
- Deferred-lane scans for organization/faction/guild, locations, family/lineage/households, property/construction, social systems, agriculture, maritime, temporal/weather, progression, and runtime transition.
- Institutional surface scan covering live guild content/schema, polity/religion owners, settlement presence, quest/magic/Knowledge references, and derived institution projections.
- Live/absent organization/faction/guild path checks and current normal-lint/schema-test posture checks.
- Required focused tests, schema tests, normal content lint, scope, conflict-marker, whitespace, stale-route, diff, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 12. Next Recommended Version

Version 0.5.321 - Organization Faction Guild Authority Evidence Audit
