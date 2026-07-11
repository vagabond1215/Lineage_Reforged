# Faction Authority Seed Evidence Audit

Source version/run: Version 0.5.325 - Faction Authority Seed Evidence Audit
Date: 2026-07-11
Status: documentation-only repository evidence audit; no seed or implementation permission

## 1. Audit Summary

No current repository evidence is strong enough to carry a canonical faction candidate into a seed plan.

The audit found no live faction wrapper, no `faction.*` content record, no normal faction content-lint registration, and no durable authored source that supplies an exact named non-sovereign faction plus the complete static record facts required by the accepted gate.

Faction-shaped hooks and labels exist, but they are generic runtime eligibility fields, schema/test guardrails, UI/demo presentation, quest prose, or broad unnamed group descriptors. Named collectives already belong to protected guild, polity, religion/religious-order, place, or other owners. Generated shadow networks and institution profiles are derived runtime projections.

Select `Version 0.5.326 - Faction Authority Seed Evidence Deferral`. It should define a fail-closed reopening gate, prohibit repeated scans without new authored evidence, and route to another roadmap lane. No candidate id is carried forward.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.325 - Faction Authority Seed Evidence Audit`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`.
- The strict faction schema, pure validator, 102 focused tests, and schema parse coverage remain unchanged.
- `packages/content/base/civilization/factions.json` remains absent.
- No `faction.*` id is present in repository content.
- `tools/content-lint/index.mjs` remains without faction registration.
- Existing guild, polity, religion/order, service, place, quest, Knowledge, account, reputation, People/NPC, economy, and runtime owners remain protected.
- People/NPC, service, resource/commodity, and combat health remain paused; generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed.

## 3. Evidence Source Inventory

| Source surface | Evidence inspected | Classification | Audit result |
| --- | --- | --- | --- |
| Faction content path | `packages/content/base/civilization/factions.json` | Absent | No live wrapper or records. |
| Faction schema/validator/tests | Strict future schema, pure helper, focused fixtures and absence assertions | Presentation/guardrail scaffolding | Defines shape only; fixture `faction.river_compact` explicitly disclaims canon. |
| Normal content lint | `tools/content-lint/index.mjs` | Absent registration | No faction import, path/check, helper call, or invocation. |
| Backstory eligibility | Generic `faction` scope and optional `factionId` matching | Weak runtime-shaped hook | Accepts arbitrary caller-supplied strings; supplies no named authored faction or seed facts. |
| Shared discovery/UI types | `factions` category and standing/codex presentation | Presentation/runtime vocabulary | Anticipated consumer surface only. |
| RPG UI demo | `factions.harbor_office` / “Saltmere Harbor Office” | Presentation-only demo metadata | Wrong id family, demo-only, and semantically a civic office rather than faction authority. |
| Quest definitions | “faction retaliation,” “harbor gang,” “harbor bruisers,” bandits, raiders, and criminal-operation prose | Weak/presentation narrative metadata | No exact canonical faction name, id/slug authority, public posture, provenance, or non-implication record facts. |
| World regions/settlements | Pirate states, pirate tribes, pirate havens, raiders, Stormfang Haven, Blackreef Anchorage | Existing place owner plus weak group prose | Named records are places; pirate group labels are generic/aggregate and do not establish a named faction. |
| Guild catalog and settlement guild presence | 18 broad guild records and local descriptive presences | Existing owner, not faction | Protected `civilization.guilds` authority; cannot be duplicated. |
| Polities | Two live polity records | Existing owner, not faction | Protected sovereign political identity. |
| Religions/orders | One religion with six nested `religious_order.*` identities | Existing owner, not faction | Protected religion-owned order identity. |
| Services/economy/business/account | Service vocabulary, workplaces, generated businesses, quest business anchor, account estate state | Existing owner or derived/presentation | Does not establish authored faction identity. |
| People/NPC/family/house/lineage | Paused person authority, family/house/lineage schemas/content, role/name references | Existing owner or deferred gate | Collective faction identity cannot be inferred from these surfaces. |
| Settlement institution projections | Derived guild classes, `shadow_network`, religious presence, organization ids, institution profiles | Synthetic/derived/runtime-only | Computed consumer state; cannot mint canon. |
| Reputation/standing | Player fame/notoriety, quest standing language, UI standing views | Mutable runtime/presentation | Identity is absent and standing is not static faction authority. |
| Design/backlog prose | Boundary language, future faction references, open questions, deferred plans | Planning authority only | Defines constraints and future need, not fictional canon. |

## 4. Candidate Evidence Classification Table

| Located evidence | Candidate-like reading | Classification | Gate failure |
| --- | --- | --- | --- |
| `faction.river_compact` test fixture | Could look like an exact faction id/name | Presentation-only test fixture | Explicitly in-memory and non-canonical; invented solely to test validation. |
| `factions.harbor_office` / Saltmere Harbor Office | Could look like a named civic faction | Presentation-only demo metadata; better office owner | Pluralized non-contract id, demo source, office semantics, unsupported lifecycle/category/public posture/provenance. |
| Gullsreach “harbor gang” | Could imply a criminal faction | Weak quest prose | Unnamed generic group; no exact id/name, stable identity proof, public posture, or provenance authority. |
| “faction retaliation” quest failure text | Could imply an opposing faction | Presentation-only generic label | Names no entity and supplies no identity facts. |
| Pirate tribes/states/havens/raiders | Could imply criminal/political factions | Weak aggregate prose or existing place/polity context | Generic plural descriptors; named records are regions/settlements, not faction collectives. |
| Stormfang Haven / Blackreef Anchorage | Could be mistaken for pirate organizations | Existing place owner | Canonical settlement identity only; place descriptions do not create factions. |
| 18 guild records | Organized named collectives | Existing owner, not faction | Protected guild authority with trade/craft/service remit. |
| Six `religious_order.*` identities | Organized named collectives | Existing owner, not faction | Protected religion-owned orders; no separate faction identity proven. |
| `polity.valtherion`, `polity.draemor` | Political named actors | Existing owner, not faction | Sovereign polity identity is explicitly separate. |
| Quest office/business anchors | Named institutional actors | Presentation-only/missing specific owner | Anchor metadata cannot establish faction canon and is better routed to office/business decisions. |
| Backstory `factionId` | Exact field capable of holding ids | Weak runtime hook | No enumerated values, source registry, or authored records. |
| Derived `shadow_network` guild class | Criminal-network-shaped collective | Synthetic/runtime-only | Generated projection, not authored stable identity. |
| UI faction/standing categories | Future consumer need | Presentation/runtime-only | Category labels and mutable standing do not supply identity. |

## 5. Strong Candidate Assessment

No strong candidate exists.

No located source supplies all of the following without invention: exact canonical faction name, authority for a matching `faction.<slug>` id, proof of a durable named non-sovereign organized collective, non-invented summary, supported category, public posture or explicit unknown posture, lifecycle, durable provenance, and explicit non-implication notes.

Accordingly, this audit carries forward zero candidate ids and does not authorize a seed plan.

## 6. Weak / Insufficient Evidence Analysis

### Generic faction hooks

Backstory eligibility accepts a generic faction scope and arbitrary `factionId`. This proves only that a future consumer may need canonical faction ids. It provides no registry, values, names, record facts, or provenance.

### Quest prose

The Gullsreach criminal-operation quest mentions “faction retaliation,” a “harbor gang,” and “harbor bruisers.” These phrases establish narrative pressure, not a stable named authored collective. The quest giver is an individual presentation anchor and People/NPC remains paused. Deriving a faction name, slug, category, posture, or provenance would be invention.

### Pirate and raider descriptors

World content mentions pirate states, tribes, havens, anchorages, raiders, bandits, and privateering pressure. These are aggregate demographic, hazard, economy, or place descriptors. Stormfang Haven and Blackreef Anchorage are canonical settlements, while pirate tribes and raiders remain unnamed plural groups. None satisfies the identity gate.

### Demo and test identities

The UI demo entry `factions.harbor_office` and focused-test fixture `faction.river_compact` exist to exercise presentation and validation. Neither is live authored content. Promoting either would leak demo/test invention into canon.

### Planning vocabulary

Design documents define what factions may eventually own and reference possible political, social, ideological, criminal, rebel, resistance, advocacy, and pressure-group categories. Taxonomy and future-need prose does not identify a fictional faction.

## 7. Existing-Owner Exclusions

- Guilds: all 18 broad records remain canonical `civilization.guilds`; influence, contracts, membership policy, and local presence do not make them faction seeds.
- Religious orders: all six nested order identities remain owned by `world.religions`; no distinct faction identity is authored.
- Polities: Valtherion and Draemor remain sovereign political identity under `world.polities`.
- Governments/offices/forces: no general authored authority exists; quest and demo office strings are presentation only and cannot be redirected into factions.
- Businesses/companies: workplace/economy content, generated businesses, account estate state, and quest anchors retain their current or future specific owners.
- Families/houses/lineages: genealogical identity remains separate and cannot substitute for faction authority.
- Services: provider-independent vocabulary cannot create providers or factions.
- Places: regions, settlements, districts, sites, havens, anchorages, and enclaves retain place identity even when prose describes political/criminal occupants.
- People/NPC: names, roles, and quest contacts cannot create collective authority; the lane remains paused.

## 8. Synthetic / Runtime / Presentation Exclusions

Generated shadow networks, derived institution profiles, guild classes, religion organization lists, generated businesses, owner/operator categories, runtime actor groups, player reputation/standing, and access projections are synthetic consumers or mutable state. They cannot establish authored identity.

UI Codex categories, standing panels, demo snapshots, warning labels such as “Needs canonical faction refs,” schemas, validators, tests, examples, and forbidden-field lists are presentation or guardrail material. They prove a gap or anticipated consumer, not a candidate.

Quest anchors and prose are presentation/narrative metadata unless a separate durable content owner explicitly canonizes the collective. None does so here.

## 9. Seed-Readiness Decision

The faction lane is not seed-ready.

Reopening requires at least one new durable authored input that explicitly names a faction and supplies or authorizes every accepted static record fact. Acceptable inputs include an explicit user-authored faction seed list or a new canonical lore/content source clearly responsible for named faction identity.

Do not repeat broad repository scans, draft a seed plan, or create a live wrapper unless new authored evidence enters the repository or the user explicitly supplies it. Schema/validator readiness alone is not seed evidence.

## 10. Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Faction seed plan | Rejected | Zero candidates pass the complete evidence gate. |
| Seed evidence deferral/preservation gate | Selected | Records the missing authored-input prerequisite and prevents weak-source inference or repeated scans. |
| Repeat schema/validator work | Rejected | Validation scaffolding is complete and passing; no issue was observed. |
| Normal content-lint registration | Rejected | The live wrapper is absent and registration requires content plus a separate decision. |
| Deep Research | Rejected | External research cannot create project canon; no external question or named immediate consumer exists. |
| Live implementation | Rejected | No candidate is approved and this run is documentation only. |

## 11. Selected Option And Rationale

Select `Version 0.5.326 - Faction Authority Seed Evidence Deferral`.

The repository has a valid future contract but no canonical data source. A concise deferral should preserve the exact reopening gate, carry forward no candidate ids, prohibit repeated weak-source audits, and route to another roadmap lane without disturbing protected owners.

## 12. Deep Research Posture

Deep Research is not required before `0.5.326`. The blocker is missing project canon, not missing real-world taxonomy or systems comparison. External research cannot name or authorize fictional Lineage: Reforged factions.

No Deep Research was run and no temporary research artifact was created.

## 13. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. The audit is complete and its result fits a normal primary deferral route.

No explicit user question is needed before `0.5.326`; that run can record the fail-closed gate and route elsewhere. An explicit user-authored faction list or new canonical source will be required before any later seed plan.

## 14. Explicit Non-Goals

- no faction or organization content, candidate ids, draft records, aliases, migrations, or compatibility behavior;
- no schema, validator, test, schema-file test, or normal content-lint changes;
- no edits to guild, polity, religion/order, settlement/place, quest, Knowledge, service, resource/commodity, combat health, People/NPC, economy, account, reputation, runtime, UI, save/account, or gameplay surfaces;
- no cross-authority references, resolvers, memberships, affiliations, leaders, ranks, offices, relationships, standing, reputation, favorability, providers, services, law, jurisdiction, diplomacy, conflict, territory, AI, dialogue, schedules, or effects;
- no inference from hooks, prose, tests, examples, demo data, existing owners, or derived state;
- no generic `world.pois`, Highcrown Knowledge reopening, paused-lane expansion, Deep Research, temporary research artifact, or `0.6.0` transition.

## 15. Audit Question Answers

1. No. Live faction content is not present.
2. No. No `faction.*` record exists in repository content.
3. No. Current evidence approves no canonical faction candidate.
4. Scanned faction ids/fields, schema/validator/tests, normal lint, backstory hooks, quests, regions/settlements, guilds, polities, religions/orders, services/economy/account, People/NPC/family surfaces, derived institutions/shadow networks, standing/reputation, UI/demo data, and planning docs.
5. None. No evidence is strong enough to carry forward.
6. Generic faction hooks, quest gang/retaliation prose, pirate/raider descriptors, and future taxonomy language are weak or insufficient.
7. Guilds, polities, religions/orders, services, places, family/lineage, economy/account, Knowledge, quests, and People/NPC gates retain their own authority.
8. Shadow networks, institution profiles, guild classes, generated businesses, runtime groups, organization lists, owner/operator categories, and standing/reputation projections are synthetic or runtime-only.
9. Quest anchors/prose, UI categories, demo snapshots, schemas, tests, examples, and guardrail wording are presentation-only metadata.
10. No. Guilds are protected existing authority, not faction seed evidence.
11. No. Religious orders are protected religion-owned authority.
12. No. Polities, governments, offices, businesses, families/houses, and services are separate owners, missing specific owners, or presentation only.
13. No. Quest anchors and backstory hooks do not supply canonical faction identity.
14. No. Shadow networks, runtime groups, standing/reputation, and generated projections cannot supply seed evidence.
15. No. Tests, schemas, examples, and guardrails define contract behavior or anticipated use, not canon.
16. No. The audit does not approve a later faction seed plan.
17. No. Live faction content implementation is not approved.
18. No. Normal content-lint registration is not approved.
19. No. Deep Research is not required before the immediate next route.
20. No. A support-suffix run is not needed.
21. No. An explicit user question is not needed before the deferral route; later seed work requires new authored input.
22. Select `Version 0.5.326 - Faction Authority Seed Evidence Deferral`.

## 16. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required handoff, active prompt, roadmap, sequence, backlog, faction contract/boundary/audit, civic/economy, People/NPC, validation consolidation, pipeline, schema, validator, focused-test, schema-test, and normal-lint reads.
- Fresh scans across content, engine/shared runtime, UI/demo, tests/examples, and planning documents for faction ids/fields, standing/reputation, institutional owners, quest anchors/prose, pirate/criminal/rebel-like collectives, and synthetic projections.
- Confirmed 18 guilds, two polities, six religion-owned orders, absent faction content, absent content `faction.*` ids, and absent normal registration.
- Required validation, scope, conflict-marker, whitespace, artifact, stale-route, diff, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 17. Next Recommended Version

Version 0.5.326 - Faction Authority Seed Evidence Deferral
