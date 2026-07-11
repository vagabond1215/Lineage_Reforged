# Organization Faction Guild Authority Evidence Audit

Source version/run: Version 0.5.321 - Organization Faction Guild Authority Evidence Audit
Date: 2026-07-11
Status: documentation-only repository evidence audit

## 1. Audit Summary

The repository has stable canonical owners for broad guilds, polities, religions and their nested religious orders, services, and places. It does not have general organization or faction collections/schemas, and it does not have authored general authorities for civic offices/governments, businesses/companies, or cross-domain institutions.

Current organization-like references split across several evidence classes:

- 18 broad guild records are canonical and validated through existing guild authority;
- 244 settlement `guildPresence` entries describe local presence for the same 18 guild types but do not create new guild identities;
- one religion record owns six nested `religious_order.*` organizations, which magic infrastructure references and normal lint resolves against religion content;
- two polity records own stable political identities but not government, jurisdiction, office, faction, or institution records;
- five quest giver anchors are presentation metadata: one guild, two civic offices, one business, and one individual;
- Knowledge institution/source labels are vocabulary whose direct institution subject authority remains blocked;
- civilization institution profiles, religious presence, business state, owner/operator categories, and shadow/religious-order guild classes are derived runtime projections, not authored institutional records;
- faction ids appear only as future/runtime-shaped fields or forbidden-field guardrails, not canonical faction content.

This unresolved overlap justifies `Version 0.5.322 - Organization Faction Guild Boundary Decision`. It does not justify a schema plan or implementation yet. The next decision should preserve existing guild and religion-owned religious-order authority, distinguish future organization/faction/institution/office/government/business owners, and choose at most one later schema candidate.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.321 - Organization Faction Guild Authority Evidence Audit`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.322 - Organization Faction Guild Boundary Decision`.
- People/NPC, service, resource/commodity, and combat health remain paused.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- No content, schema, validator, registration, membership, reputation, runtime, UI, save/account, or gameplay implementation is authorized.

## 3. Current Institutional Authority Inventory

| Authority/surface | Current posture | Audit result |
| --- | --- | --- |
| Broad guilds | `packages/content/base/civilization/guilds.json`; 18 records; strict schema; normal-lint check and semantic `validateGuilds(...)` | Existing canonical owner; preserve as-is. |
| Polities | `packages/content/base/world/polities.json`; 2 records | Existing political-identity owner; not government, office, jurisdiction, faction, or institution authority. |
| Religions | `packages/content/base/world/religions.json`; 1 religion with deities and six nested religious organizations | Existing religion and religious-order owner; do not duplicate into a general organization collection by inference. |
| Services | Five live provider-independent service vocabulary records | Existing service identity owner; does not own providers or organizations. |
| Settlements/districts/sites | Live place authorities | Own place identity and local descriptors, not general institutional identity. |
| Settlement guild presence | 244 local entries, 60 distinct display names, 18 `guildType` values matching the broad catalog slugs | Descriptive local presence, not new canonical guild/organization records. |
| General organizations | No `packages/content/base/civilization/organizations.json`; no organization schema | Missing general owner; boundary remains unresolved. |
| General factions | No `packages/content/base/civilization/factions.json`; no faction schema | Missing general owner; boundary remains unresolved. |
| Governments/jurisdictions/laws/offices | No general authored collections identified; quest uses two `office.*` anchors | Missing or presentation-only depending on surface; later civic layers remain separate. |
| Businesses/companies | One quest `business.*` anchor plus generated settlement business state and account estate examples | No general authored business/company identity owner established. |
| Knowledge institutions | Registry/evidence vocabulary includes `institution` and `institutional_study`; direct institution subjects remain blocked | Presentation/evidence vocabulary only, not canonical institution authority. |
| Runtime institution profiles | Derived from settlement, guild, religion, magic, economy, property, and operator inputs | Synthetic/derived state only. |
| Membership/affiliation | Guild records contain descriptive membership models; actual member/affiliation ownership is absent | Descriptive guild policy exists; actual membership links/state remain unresolved and deferred. |
| Reputation/standing | Existing broad player fame/notoriety and quest reward/standing surfaces | Existing runtime/player owners do not create faction/guild membership or institution-local reputation authority. |

## 4. Evidence Source Inventory

| Source | Evidence inspected | Authority value |
| --- | --- | --- |
| `docs/design/civic-authority-boundary-decision.md` | Polity, government, jurisdiction, law, faction, guild, institution, force, diplomacy, conflict, and player-state separation | Permanent boundary authority; requires distinct owners. |
| `docs/design/economy-authority-boundary-decision.md` | Guild/institution, profession, business/economy, market, production, and runtime separation | Permanent boundary authority; protects existing guild/economy owners. |
| Current roadmap, sequence, backlog, consolidation, and research decisions | Deferred institutions, government/jurisdiction/law, reputation, social, property, and runtime lanes | Current sequencing and dependency authority. |
| Live guild content and schema | 18 `guild.*` records, membership models, governed activities, facilities, and quest-board posture | Canonical broad guild authority. |
| Normal content-lint index and schema-file test | Guild wrapper check, semantic guild validation, cross-file guild resolution, and guild schema parse coverage | Confirms existing guild validation/registration posture; no new registration needed. |
| Live polities | Two canonical political identities | Protects polity identity from organizational duplication. |
| Live religion content/schema | One religion with six nested `religious_order.*` organizations | Canonical religious-order owner within religion authority. |
| Magic infrastructure and cross-validation | `requiredGuildTypes` and `requiredReligionOrganizationIds` resolve against live guild slugs and nested religion organizations | Reference consumer only; does not create organization authority. |
| Settlements and settlement schema | 244 `guildPresence` entries with local labels/functions/presence levels | Descriptive local presence linked by guild type. |
| Settlement district/site content | Local place identities and descriptors | Place authority; no general organization records found. |
| Quest definitions | Five giver anchors: guild, government/office, business, and individual | Presentation/anchor metadata; only the guild anchor corresponds to an existing broad owner. |
| Knowledge content and schemas | `institution`, institutional study, evidence-owner vocabulary, and blocked subject notes | Vocabulary/evidence metadata, not canonical institution content. |
| Settlement institution types and runtime tests | Owner/operator categories, guild classes, derived guild/religion/site/property/magic profiles | Synthetic/derived projection; not authored institutional identity. |
| Player/backstory/reputation surfaces | Optional faction-shaped eligibility context, broad standing, fame/notoriety, quest rewards | Runtime/player context only; no canonical faction or membership owner. |
| People/NPC decisions and deferral | Prohibition on inferring people from organizations and delayed affiliations/relationships | Protects person authority and keeps People/NPC paused. |

## 5. Institutional Evidence Classification Table

| Reference/surface | Classification | Current owner or gap | Rationale |
| --- | --- | --- | --- |
| `guild.merchant_guild` through `guild.scribes_guild` | Existing canonical owner | `civilization.guilds` | Eighteen strict broad guild identities are live and normal-lint checked. |
| Guild membership models | Existing canonical descriptive owner | Individual guild records | Own entry method, requirements, benefits, and obligations as authored guild policy; do not prove actual members or mutable standing. |
| `polity.valtherion`, `polity.draemor` | Existing canonical owner | `world.polities` | Political identity only; must not be recast as organizations/factions. |
| Elemental Pantheon and six `religious_order.*` records | Existing canonical owner | `world.religions` nested organizations | Religion schema and validator own these religious identities; magic references resolve to them. |
| Five service ids | Existing canonical owner | `civilization.services` | Provider-independent service vocabulary only; organizations/providers remain separate. |
| Settlements, districts, and sites | Existing canonical owner | World place collections | Place identity and descriptors, not institutions. |
| Settlement `guildPresence` | Descriptive local presence | `world.settlements` referencing guild types | Local display name, presence level, functions, and notes do not mint a new broad guild or organization identity. |
| Quest `adventurers_guild` giver anchor | Presentation-only metadata with an adjacent canonical guild | Quest definition plus broad guild catalog | The quest field is not a canonical reference contract and must not expand guild authority. |
| Quest `office.harbor_master.brineharbor` and `office.civic_watch.aurelis` | Presentation-only / missing owner | Quest giver metadata; future office/government boundary | Full office authority cannot be inferred from quest anchors. |
| Quest `business.ironwheel_haulage_coppergate` | Presentation-only / missing owner | Quest giver metadata; future business/company boundary | No authored business/company collection resolves the id. |
| Quest `npc.corin_ash` | Presentation-only metadata | People/NPC remains paused | Not institutional evidence and not person canon. |
| Knowledge `institution`, `institutional_study`, and owner scopes | Presentation/evidence vocabulary | Knowledge schemas/registry | Registry notes explicitly keep institution subject authority blocked. |
| Magic `requiredGuildTypes` | Reference metadata to existing owner | Guild catalog | Cross-validator resolves slugs; does not create guilds. |
| Magic `requiredReligionOrganizationIds` | Reference metadata to existing owner | Religion-owned nested organizations | Cross-validator resolves exact religious-order ids against religion content. |
| Derived settlement guild instances, religious sites, organization ids, owner/operator ids, shadow networks, and access sponsors | Synthetic/derived projection | Civilization runtime/shared types | Computed from authored inputs and runtime rules; not content authority. |
| Generated settlement businesses | Synthetic/derived projection | Settlement simulation/runtime | Business categories/state do not establish authored companies. |
| Account estate `business.*` examples/state | Existing account/save owner | Account estate/runtime | Player/account assets are not world-canon business identity. |
| Optional `factionId` eligibility context and forbidden `factionIds` fields | Missing/unresolved owner indicator | Future faction authority/runtime boundary | Structural context and guardrails prove a gap, not canonical factions. |
| Player fame/notoriety and quest standing/reputation rewards | Existing runtime/player owner | Player/reputation and quest owners | Broad mutable state must not be copied into guild/faction/institution content. |
| General organization/faction collections | Missing/unresolved owner | No current collection/schema | Requires a boundary decision before any schema candidate. |

## 6. Existing Owners And Protected Boundaries

### Guild authority

Preserve live guild authority as-is. Broad guild records already own canonical guild id/name/category, governed and excluded activities, contract types, typical presence, membership model, quest-board posture, and facility tiers. Local settlement presences and runtime guild instances consume that authority; they do not replace it.

No guild expansion, migration, reclassification, new alias, or general-organization wrapping is authorized. The next boundary decision must treat `civilization.guilds` as an existing protected owner.

### Religion and religious orders

Religion content already owns six nested `religious_order.*` identities. Magic infrastructure and settlement-religion derivation consume those exact records. A future general institution/organization authority must not duplicate or silently migrate them. Whether religious orders ever need promotion to a standalone collection is a separate migration/ownership question and is not authorized here.

### Polities and future civic layers

Polities own durable political identity. Governments, jurisdictions, laws, offices, factions, forces, diplomacy, and conflicts remain separate future civic layers under the permanent civic decision. Quest office strings and derived `civil_authority` categories do not instantiate those layers.

### Places, services, economy, and businesses

Settlements/districts/sites own place identity. Services own provider-independent vocabulary. Workplaces/production/economy and settlement simulation own economic templates and derived business state. No current surface proves a general authored company/business collection.

### People, membership, affiliation, and reputation

People/NPC remains paused. Institutional names cannot create people, officers, members, providers, or leaders. Guild membership models are descriptive policy, not actual membership records. Player fame/notoriety and quest standing rewards remain mutable player/runtime authority, not faction or guild reputation content.

## 7. Missing / Unresolved Owner Analysis

The repository has enough unresolved overlap for a boundary decision, but not enough clarity for a schema plan.

### General organization versus institution

`organization` appears as a broad natural-language and field label, especially for religion-owned orders, while `institution` appears in civic design, Knowledge vocabulary, and runtime projection naming. A future decision must determine whether organization is an umbrella identity family, whether institution is a narrower civic/scholarly/religious body, or whether specific owner families should remain separate without a general umbrella collection.

### Factions

No canonical faction record exists. Faction-shaped runtime/backstory context and forbidden-field guardrails show anticipated use, while the civic decision defines a faction as an organized political, social, ideological, criminal, rebel, or pressure-group identity. A boundary decision must distinguish factions from polities, governments, guilds, religions/orders, noble houses, businesses, parties, and runtime player standing before any schema plan.

### Civic institutions, offices, governments, and jurisdictions

Quest office anchors and derived civil/military authority categories do not provide authored identity. The civic decision already separates government, jurisdiction, law, institution, public-order force, and office concerns. The next decision must avoid collapsing those layers into a generic organization record.

### Businesses and companies

The quest business anchor, generated settlement business state, owner/operator types, workplaces, and account estate assets have different owners. No source currently proves a stable authored company/business identity collection. The boundary decision must state whether business identity belongs to a later company authority, a property/economy owner, or remains out of scope.

### Membership, affiliation, and reputation

Actual membership, affiliation, rank, office holding, and institution-local reputation are link or mutable-state questions, not identity fields. They must remain outside the first identity boundary and cannot be inferred from guild policy, quest contact, backstory, settlement origin, service access, or player fame/notoriety.

### Derived institutions

Settlement institution profiles combine place, guild, religion, magic, economy, property, and operator inputs. They are projections and should remain consumers. The boundary decision must explicitly prohibit promotion of generated profile ids, guild classes, shadow networks, religious-order presences, business categories, or owner/operator ids into authored records by inference.

## 8. Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Preserve guild-only status and pause | Not selected yet | Existing guilds are stable, but unresolved factions, institutions, offices/governments, businesses, and cross-domain organization vocabulary warrant one boundary decision. |
| Docs-only organization/faction/guild boundary decision | Selected | Multiple protected owners and unresolved gaps overlap; a boundary decision can separate them without implementation. |
| Docs-only organization-only schema plan | Rejected now | `organization` may overlap religion-owned orders, institutions, businesses, offices, guilds, and factions; the owner is not clear enough. |
| Docs-only faction-only schema plan | Rejected now | No canonical faction evidence or final distinction from civic/social/criminal/religious/business owners exists. |
| Docs-only institution/office boundary decision | Too narrow as immediate route | Civic institution/office is part of the overlap but does not resolve guild, faction, religious-order, business, and umbrella-organization boundaries alone. |
| Deep Research | Rejected before immediate route | Current need is repository ownership, not external institutional comparison. |
| Live implementation | Rejected | No new authority, schema, seed, or registration has been approved. |

## 9. Selected Option And Rationale

Proceed with `Version 0.5.322 - Organization Faction Guild Boundary Decision`.

That run should remain docs-only and decide:

- whether any general organization umbrella should exist;
- exact distinctions among guild, faction, institution, civic office, government, jurisdiction, religious order, business/company, and derived projection;
- protected existing owners and forbidden duplication/migration;
- identity versus membership/affiliation/rank/office/reputation boundaries;
- whether one future authority is sufficiently clear to receive a later schema plan first;
- whether the safer result is to preserve existing specific owners and pause broader institutional expansion.

It must not presume that a schema is required. It may validly conclude that guilds and religion-owned orders should remain the only live authored institutional identities for now.

## 10. Deep Research Posture

Deep Research is not required before `0.5.322`. Permanent civic/economy/social decisions and live repository evidence are sufficient to decide ownership boundaries.

External research may later help with institutional simulation, governance models, historical guild structures, faction behavior, membership, reputation, or social dynamics. It cannot decide the repository's canonical owner families and should run only after a boundary decision identifies a concrete external question and named consumer.

No Deep Research was run and no temporary research artifact was created.

## 11. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. The evidence audit is complete and selects a new primary docs-only boundary decision.

No explicit user question is required before `0.5.322`. Current repository owners are sufficient to decide the boundary. Explicit authorship may be needed later before content seeds, but no seed is selected now.

## 12. Explicit Non-Goals

- no organization, faction, guild, institution, office, government, jurisdiction, law, religious-order, business, company, provider, or people/NPC content;
- no edits to guild, polity, religion, settlement, district, site, quest, Knowledge, magic, service, resource/commodity, combat-health, or People/NPC content;
- no schemas, validators, tests, normal-lint changes, aliases, migrations, or generated projections;
- no memberships, affiliations, relationships, ranks, offices, reputation, standing, favorability, access, providers, prices, stock, services, taxes, diplomacy, conflict, enforcement, or economy behavior;
- no People/NPC reopening or person inference from institutions;
- no runtime, AI, UI, save/account, commands, events, rewards, or gameplay;
- no generic `world.pois` or Highcrown Knowledge reopening;
- no Deep Research or transition to `0.6.0`.

## 13. Audit Question Answers

1. Yes. Live broad guild content exists.
2. Yes. A strict guild schema exists.
3. There are exactly 18 live guild records.
4. No. General `civilization.organizations` content/schema paths are absent.
5. No. General `civilization.factions` content/schema paths are absent.
6. Yes. Polities are separately owned by `world.polities`.
7. Yes. Religions and their nested religious-order organizations are owned by `world.religions`.
8. No. Settlement `guildPresence` describes local presence and does not create new guild or organization identity.
9. No. Quest giver anchors are presentation/anchor metadata; they do not create canonical organization/faction/guild records.
10. No. Knowledge and magic labels are vocabulary or references. Magic organization ids resolve to religion-owned orders; neither surface creates a general authority.
11. No. Runtime institution projections are derived state, not authored institution records.
12. Existing owners include broad guilds, polities, religions and nested religious orders, services, settlements/districts/sites, economy/workplace surfaces, account estate state, and player reputation state within their narrow boundaries.
13. Settlement guild presence and other local place descriptors are descriptive local presence.
14. Quest giver anchors and Knowledge institution/source vocabulary are presentation-only or evidence metadata.
15. Settlement institution profiles, guild instances, religious presence/sites, generated businesses, owner/operator ids, shadow networks, and access sponsors are synthetic/derived.
16. Missing/unresolved owners include general organizations, factions, civic institutions/offices, governments/jurisdictions/laws beyond polity identity, authored businesses/companies, actual membership/affiliation/rank/office links, and institution-local reputation/standing.
17. Yes. Live guild authority should be preserved as-is.
18. No. General organization content implementation is not authorized.
19. No. Faction content implementation is not authorized.
20. No. Guild expansion implementation is not authorized.
21. No. Schema/validator implementation is not authorized.
22. No new normal content-lint registration is authorized. Existing guild normal-lint coverage remains preserved.
23. No. Deep Research is not required before the immediate next route.
24. No. A support-suffix run is not needed.
25. No. An explicit user question is not needed before the next numbered route.
26. Proceed with `Version 0.5.322 - Organization Faction Guild Boundary Decision`.

## 14. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required handoff, roadmap, sequence, backlog, authority, pause/gate, consolidation, and Deep Research decision reads.
- Live guild content/schema, polity, religion, settlement/district/site, quest, Knowledge, magic, normal-lint, schema-test, and runtime projection reads/scans.
- Exact counts: 18 guild records; 244 settlement guild-presence entries; 60 distinct local guild-presence display names; 18 guild types; two polities; one religion; six nested religious-order organizations; five quest giver anchors.
- General organization and faction content/schema absence checks.
- Guild normal-lint/schema-test posture and institutional magic cross-reference checks.
- Required schema tests, normal content lint, scope, conflict-marker, whitespace, stale-route, diff, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 15. Next Recommended Version

Version 0.5.322 - Organization Faction Guild Boundary Decision
