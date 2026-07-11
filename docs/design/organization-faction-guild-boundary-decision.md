# Organization Faction Guild Boundary Decision

Source version/run: Version 0.5.322 - Organization Faction Guild Boundary Decision
Date: 2026-07-11
Status: approved documentation-only boundary decision; no implementation permission

## 1. Decision Summary

Preserve the repository's specific existing institutional owners and reject a general organization umbrella for the current foundation phase.

Select future faction identity as the one narrow unresolved institutional authority ready for a docs-only schema plan:

- `Version 0.5.323 - Faction Authority Schema Plan`

A faction is conceptually distinct when explicit canon identifies a durable named political, social, ideological, criminal, rebel, or pressure-group actor that is not better owned as a guild, polity, government, religion/religious order, business/company, family/noble house, temporary party, military/public-order force, or derived runtime projection.

The next plan may define a future `civilization.factions` contract, but it must not create a schema, validator, content, registration, or candidate seed. Faction records must remain static identity authority only. Membership, affiliation, rank, office holding, reputation, standing, favorability, relationships, services, access, quests, law, diplomacy, conflict, runtime state, UI, save/account, and gameplay remain separate.

No general organization, institution/office, business/company, provider, membership-link, or local-reputation schema plan is selected now.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.322 - Organization Faction Guild Boundary Decision`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.323 - Faction Authority Schema Plan`.
- Existing guild, polity, religion/religious-order, service, place, account-estate, player-reputation, quest, economy, and runtime owners remain unchanged.
- General organization and faction content/schema paths remain absent.
- People/NPC, service, resource/commodity, and combat health remain paused.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- No content, schema, validator, test, normal-lint, runtime, UI, save/account, or gameplay implementation is authorized.

## 3. Protected Existing Owners

| Protected owner | Retained authority | Boundary |
| --- | --- | --- |
| `civilization.guilds` | Eighteen broad guild identities, governed activities, contract types, typical presence, descriptive membership policy, quest-board posture, and facility tiers | Must not be migrated, wrapped, aliased, renamed, reclassified, duplicated, or absorbed into factions/general organizations. |
| `world.religions` | Religion identity, deities, and six nested `religious_order.*` identities | Religious orders remain religion-owned; no general organization duplication or standalone migration is authorized. |
| `world.polities` | Durable political identity and descriptive place anchors | Polities are not factions, organizations, governments, jurisdictions, or offices by default. |
| `world.settlements`, districts, and sites | Place identity and local descriptive fields, including guild presence | Local presence and place descriptors do not mint institutional identity. |
| `civilization.services` | Provider-independent service vocabulary | Service ids do not create providers, businesses, facilities, offices, or organizations. |
| Workplaces, production, economy, property projections, and account estate state | Economic templates, derived settlement businesses/property, and player/account assets within existing owners | These surfaces do not establish authored world-canon companies. |
| Quest definitions | Quest presentation, giver anchors, requirements, rewards, and action-tree content | `office.*`, `business.*`, guild, and individual giver strings do not create institutional authority. |
| Knowledge schemas/registry/content | Subject/evidence/source vocabulary and current supported authorities | `institution` and `institutional_study` labels do not create an institution collection. |
| Player reputation/standing and quest reward owners | Broad mutable fame/notoriety, standing context, and reward declarations | Must not be copied into static faction/guild/institution identity. |
| Civilization/shared runtime projections | Derived institution profiles, guild instances, religious presence/sites, generated businesses, owner/operator categories, access sponsors, and related state | Consumers/projections only; generated ids/classes must not be promoted to canon. |
| People/NPC gate | Canonical named-person evidence requirements and paused content posture | Institutions cannot create people, members, leaders, officers, providers, or NPC overlays by inference. |

## 4. Boundary Decisions

### 4.1 Guild boundary

`civilization.guilds` remains the protected canonical owner for the 18 live broad trade, craft, merchant, gathering, logistics, martial/adventuring, civic, and service-oriented guild identities already authored there.

Do not migrate, wrap, alias, rename, reclassify, or duplicate those records. A guild is not automatically a faction merely because it can exert influence, issue contracts, set membership policy, or participate in civic/economic life.

Settlement `guildPresence` consumes broad guild types and supplies local display name, presence level, functions, and notes. It does not create a new broad guild or general organization. Runtime guild instances likewise consume authored inputs and remain derived state.

Guild `membershipModel` fields own descriptive entry policy, requirements, benefits, and obligations only. They do not create actual member links, current membership, rank, office holding, dues state, favorability, standing, access, or player affiliation.

### 4.2 Religion and religious-order boundary

`world.religions` remains the owner of its six nested `religious_order.*` identities. Magic `requiredReligionOrganizationIds` continues to reference and validate against those religion-owned records.

Religious orders must not be duplicated into future factions or a general organization collection by inference. An order may become a faction only if a later explicit canon source establishes a separate faction identity rather than merely restating the religious order.

Any later proposal to move nested religious orders into a standalone collection requires a separate migration/ownership decision explicitly requested by the user. No migration, alias, compatibility layer, or standalone religious-order schema is approved here.

### 4.3 Polity, government, jurisdiction, law, office, and force boundary

`world.polities` retains political identity. A polity is not a faction or generic organization by default.

Future government, jurisdiction, law, civic office, and public-order/military-force layers remain separate:

- government describes organized governing structure and authority style;
- jurisdiction describes applicability and scope;
- law owns descriptive rules/customs after jurisdiction exists;
- office owns a durable civic position or administrative unit only after its own boundary is decided;
- public-order/military force owns a stable enforcement or armed-body identity when later approved.

Quest `office.harbor_master.brineharbor` and `office.civic_watch.aurelis` are presentation anchors, not authored office, government, jurisdiction, law, or force authority. Derived `civil_authority` and `military_authority` owner/operator categories are runtime classifications, not records.

No government/jurisdiction/law/office/force schema plan is selected by this decision.

### 4.4 Faction boundary

Approve future `civilization.factions` conceptually as a distinct static identity authority, subject to `0.5.323` schema planning.

A future faction may own only stable authored identity for a durable named organized collective whose primary authored posture is political, social, ideological, criminal, rebel, resistance, advocacy, pressure-group, or similar non-sovereign collective action.

A faction must not duplicate or substitute for:

- a guild's trade/craft/merchant/service corporate identity;
- a polity's sovereign/political identity;
- a government's governing structure;
- a jurisdiction, law code, civic office, or public-order force;
- a religion or religion-owned religious order;
- a business/company's commercial identity;
- a family, clan, noble house, dynasty, or genealogical lineage;
- a temporary party, adventuring group, quest team, crowd, movement label, ideology, or profession;
- a generated shadow network, derived institution profile, runtime actor group, or player standing bucket.

One real-world-like entity could have multiple relationships, but authored repo identity must have one canonical owner. Cross-authority sponsorship, opposition, alliance, control, or overlap belongs to later link/relationship authorities and cannot justify duplicate records.

The next schema plan is justified because the permanent civic decision already defines faction as distinct, no live collection conflicts with that owner, and current faction-shaped hooks demonstrate a future reference need. The plan must remain fail-closed: no faction records may be inferred from guilds, religious orders, quest anchors, backstory eligibility fields, settlement prose, shadow-network projections, polities, businesses, or runtime reputation.

### 4.5 Organization and institution boundary

Do not create a general organization umbrella now.

`organization` remains a broad descriptive concept, not a canonical collection. Current specific owners—guild, polity, religion/religious order, service, place, family, and future faction/government/business/office owners—are safer and more auditable than one generic identity bucket.

`institution` remains a narrower future possibility for a durable civic, administrative, judicial, scholarly, charitable, or similar body not better owned elsewhere. Religion-owned orders remain protected and are not moved into institution authority. Knowledge `institution` vocabulary and runtime `SettlementInstitutionProfileState` naming do not establish static institution content.

Institution is not schema-ready. A future institution/office boundary decision should first separate institution identity from government, office, facility/site, guild, religion/order, school/academy, service provider, business, and runtime projection. That route is not selected now.

### 4.6 Business and company boundary

Business/company identity remains deferred.

Quest `business.ironwheel_haulage_coppergate`, generated settlement businesses, workplace/economy templates, owner/operator categories, and account estate `business.*` state belong to different presentation, runtime, economy/property, or account owners. None may be promoted into authored company canon by inference.

A later business/company boundary decision must decide whether stable company identity belongs to a dedicated `civilization.companies`-like owner, property/economy authority, a provider layer, or another specific family. It must preserve workplaces, production, property, account assets, prices, stock, contracts, and runtime businesses. Business schema planning is not ready now.

### 4.7 Provider and service-organization boundary

`civilization.services` remains provider-independent vocabulary. A service id answers what service category exists; it does not answer who provides it, where it is currently available, whether access is granted, what it costs, or what effect occurs.

Future providers may be people/NPCs, businesses, guilds, institutions, offices, facilities/sites, or other explicitly approved owners. Provider associations and availability require a separate link/runtime decision after those identities exist. No provider/service-organization authority is selected now.

### 4.8 Membership, affiliation, rank, and office-holder link boundary

Keep actual membership, affiliation, rank, and office holding out of first identity schemas.

These are actor-to-authority or authority-to-authority links with potential temporal, visibility, recognition, dispute, source, and mutable-state concerns. A future dedicated link authority must decide whether stable authored claims and runtime/current state need separate owners.

Do not infer members, leaders, officers, ranks, affiliations, sponsors, employees, or relationships from guild membership policy, organization/faction names, quest contacts, settlement origin/presence, services, backstories, player state, or People/NPC names. People/NPC remains paused.

### 4.9 Reputation, standing, and favorability boundary

Preserve existing player/runtime/quest owners for broad fame, notoriety, standing context, and rewards.

Faction-, guild-, institution-, office-, business-, religion-, polity-, or person-local reputation/standing/favorability remains future mutable state. It is not an identity field and is not approved as static content here.

A later reputation boundary must separate public reputation, membership status, legal status, access, trust/favorability, relationship state, recognition, rank, and account history. No local-reputation schema or behavior is selected now.

### 4.10 Derived projection boundary

Runtime institution profiles, generated settlement businesses, property owner/operator categories, derived guild instances/classes, shadow networks, religious presence/sites, organization-id lists, access sponsors, and current availability/state remain consumers or projections.

They must not mint authored `faction.*`, `organization.*`, `institution.*`, `guild.*`, `office.*`, `business.*`, or people/NPC records. A later adapter may reference authored identities only after an explicit owner and mapping contract exists; no adapter or projection change is authorized here.

## 5. Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Preserve and pause all institutional expansion | Not selected | Safe, but faction has a distinct permanent boundary, no conflicting live owner, and enough future reference evidence for docs-only schema planning. |
| Faction authority schema plan | Selected | Faction is the clearest distinct unresolved static identity family and can be planned without content, external research, or changing protected owners. |
| General organization schema plan | Rejected | A generic umbrella would risk duplicating guilds, religious orders, polities, businesses, offices, institutions, and future factions. |
| Institution/office schema plan | Rejected now | Institution, government, office, facility, service provider, religion/order, and runtime projection boundaries need a narrower decision first. |
| Business/company boundary or schema plan | Deferred | Current evidence mixes presentation anchors, generated businesses, economy/workplaces, property, and account estate state. |
| Deep Research | Rejected before immediate route | Repository ownership is decision-complete enough for a faction schema plan; external institutional comparison is not needed. |
| Implementation | Rejected | No schema, validator, content, registration, link, runtime, or gameplay implementation is authorized. |

## 6. Selected Option And Rationale

Select `Version 0.5.323 - Faction Authority Schema Plan`.

The plan should decide the exact future collection path, records wrapper, `faction.<slug>` identity pattern, minimum descriptive fields, lifecycle/status posture, provenance, category/public-posture vocabulary only if repository evidence supports it, allowed references only to existing protected owners, forbidden inference sources, forbidden behavioral/link/state fields, validation ownership, staged schema/validator/test sequence, and seed-readiness gate.

The plan must not select live faction candidates or treat current hooks as canon. It should explicitly allow a later no-safe-seed result if no durable authored factions exist.

No other institutional schema plan is approved concurrently.

## 7. Future Evidence Gates

### Faction schema-plan gate

`0.5.323` may plan a schema from permanent boundaries and current reference needs, but it must:

- preserve all protected existing owners;
- define a narrow static identity contract rather than behavior or membership;
- avoid a universal organization bucket;
- reject guild, polity, government, religion/order, business, family/house, party, profession, movement-label, ideology-only, quest-anchor, derived projection, and runtime-standing inference;
- keep references optional and fail-closed until their owners are stable;
- keep normal lint absent until a later live wrapper and separate registration decision;
- define a later seed evidence requirement without approving candidates.

### Faction seed gate

No future seed plan should proceed until a separate evidence audit finds an explicit durable canonical faction source with an exact name, unambiguous id/slug authority, proof of faction identity, non-invented summary, lifecycle/status posture, provenance, notes, and explicit non-implication boundaries. Current `factionId` hooks, forbidden-field lists, prose, guilds, religious orders, quests, settlements, runtime groups, and reputation state are insufficient.

### Other institutional gates

- General organization: remains rejected until a later decision proves an umbrella adds authority without duplication.
- Institution/office: requires its own boundary decision before schema planning.
- Business/company: requires a boundary decision across economy, workplace, property, provider, account, and runtime owners.
- Membership/affiliation/rank/office links: require a dedicated link-authority decision after actor and institution identities exist.
- Local reputation/standing/favorability: requires a mutable-state boundary decision; not static identity content.
- Religious-order migration: requires explicit user authorization and a dedicated migration/ownership decision.

## 8. Deep Research Posture

Deep Research is not required before `0.5.323`. The next task is to plan a repository-local static identity contract from accepted civic boundaries and current owner gaps.

External research may later inform faction taxonomies, governance, membership, political dynamics, criminal networks, or reputation systems, but it should not run until a concrete question and downstream consumer are named. It cannot manufacture project canon.

No Deep Research was run and no temporary research artifact was created.

## 9. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. This boundary decision is complete and selects a new primary docs-only schema-plan route.

No explicit user question is required before `0.5.323`. The schema plan can define a fail-closed future contract without authoring factions. Explicit user authorship may be needed later before any seed.

## 10. Explicit Non-Goals

- no organization, faction, guild, institution, office, government, jurisdiction, law, force, religious-order, business/company, provider, membership, affiliation, rank, reputation, standing, favorability, or people/NPC content;
- no edits to live guild, polity, religion, settlement/district/site, quest, Knowledge, magic, service, resource/commodity, combat-health, People/NPC, economy, account, reputation, or runtime surfaces;
- no schema, validator, test, normal-lint, alias, migration, adapter, or projection implementation;
- no selected faction seed ids or live candidate list;
- no member/leader/officer inference and no People/NPC reopening;
- no service provider, access, pricing, stock, quest, legal, diplomatic, conflict, enforcement, tax, economy, runtime, AI, UI, save/account, command, event, reward, or gameplay behavior;
- no generic `world.pois`, Highcrown Knowledge, paused-lane reopening, Deep Research, or `0.6.0` transition.

## 11. Decision Question Answers

1. Yes. Existing broad guild authority is preserved as-is.
2. No. The 18 live guild records are not changed, migrated, wrapped, aliased, or duplicated.
3. No. Settlement `guildPresence` creates no new guild or organization identity.
4. No. Guild membership fields describe policy only; they do not create member links or mutable standing.
5. Yes. Religion-owned `religious_order.*` identities remain under `world.religions`.
6. No. Religious orders are not duplicated into general organization authority.
7. Yes. Polities remain political identities.
8. Yes. Government, jurisdiction, law, office, and force layers remain separate from polity identity.
9. No. Quest `office.*` anchors create no office/government authority.
10. Yes. Faction is conceptually distinct under the narrow boundary in this decision.
11. Yes, for a later docs-only schema plan only. No content or implementation is approved.
12. No. A general organization umbrella should not be created now.
13. No. Institution should remain a future possible static owner pending a narrower institution/office boundary decision.
14. No. Businesses/companies are not ready for schema planning.
15. No. Service ids create neither providers nor organizations.
16. No. Membership, affiliation, rank, and office-holder links are out of scope.
17. No. Local reputation/standing authority is out of scope.
18. No. Runtime projections are not authored identity.
19. No. People/NPC remains paused.
20. No. No content implementation is authorized.
21. No. No schema/validator implementation is authorized in this run.
22. No. No new normal content-lint registration is authorized.
23. No. Deep Research is not required before the immediate next route.
24. No. A support-suffix run is not needed.
25. No. An explicit user question is not needed before the next numbered route.
26. Select `Version 0.5.323 - Faction Authority Schema Plan` as the only future schema plan now.
27. The immediate next route is `Version 0.5.323 - Faction Authority Schema Plan`.

## 12. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required authority audit, selection, civic/economy/social, pause/gate, roadmap, sequence, backlog, consolidation, and Deep Research decision reads.
- Fresh live checks confirmed 18 guild records, unchanged guild schema presence, absent general organization/faction content/schema paths, existing guild lint/schema-test posture, religion-owned orders, faction-shaped future hooks, and protected runtime/player boundaries.
- Required schema tests, normal content lint, scope, conflict-marker, whitespace, stale-route, diff, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 13. Next Recommended Version

Version 0.5.323 - Faction Authority Schema Plan
