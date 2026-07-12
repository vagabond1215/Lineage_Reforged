# Business Company Authority Evidence Audit

Source version/run: Version 0.5.334 - Business Company Authority Evidence Audit
Date: 2026-07-11
Status: approved documentation-only evidence audit; zero candidate ids; no schema/content permission

## 1. Audit Result

Current repository evidence supports one later business/company owner-boundary decision, but does not support a schema, content collection, migration, or seed.

Carry forward exactly zero business/company candidate ids.

`business` and `company` are unresolved across current surfaces:

- `business` identifies a quest-giver type/anchor, account estate asset type/prefix, UI activity section, and demo/test venture;
- `company` identifies a synthetic settlement property owner/operator type and generated id prefix;
- **Ironwheel Haulage Company** uses a `business.*` quest anchor, showing that display terminology and id vocabulary are not aligned;
- none of these surfaces declares one canonical static identity owner.

Select `Version 0.5.335 - Business Company Authority Boundary Decision` next. That run should decide whether one static commercial-body identity family is justified, whether `business` and `company` are synonyms or distinct layers, and which existing owners/state remain separate. It must not design a schema or approve candidates.

## 2. Current Surface Absence

Fresh repository inspection confirms:

- no dedicated business/company content collection;
- no business/company JSON schema;
- no business/company pure validator or focused validation test;
- no business/company normal content-lint registration;
- no accepted canonical collection name or id prefix;
- no approved static business/company record;
- no migration or adapter between `business.*` and `company.*`.

Current business/company strings are embedded in existing quest, building, workplace, settlement derivation, account estate, shared runtime contracts, UI/demo, and test owners.

## 3. Evidence Inventory And Classification

| Surface | Evidence | Classification | Authority result |
| --- | --- | --- | --- |
| Authored quest definition | Giver type `business`, `entityId: business.ironwheel_haulage_coppergate`, display name **Ironwheel Haulage Company**, contact **Foreman Mira Kell**, and `settlement.coppergate` | Partial authored identity inside presentation/quest owner | Strongest named signal, but the quest record owns giver presentation and behavior. It does not establish a canonical commercial-body record, lifecycle, classification, provenance contract, or preferred id family. Do not promote automatically. |
| Quest narrative | Ironwheel needs an ore convoy moved; failure can reduce business trust | Narrative/behavior context | Describes quest stakes and implied operations. It does not authorize finance, workforce, reputation, contracts, inventory, or static identity fields. |
| Quest archetype giver vocabulary | Reusable `business` giver type | Presentation vocabulary | Identifies a giver category, not a named identity collection. |
| Building content/schema | `triggerBusinessTypes` arrays on building templates | Reusable compatibility/template vocabulary | Describes which generic business types may trigger/use facility templates. It neither names firms nor owns providers, tenants, property, or runtime instances. |
| Workplace content/schema | Optional `businessScale` values such as `small`, `medium`, `large`, and `estate` | Reusable production/template vocabulary | Describes scale on production/workforce templates. It is not company size authority or a named commercial body. |
| Settlement property derivation | Owner/operator type `company`; generated ids such as `company.<settlement>.<districtType>` | Synthetic/derived runtime identity | Deterministic placeholder ownership for simulated property profiles. It combines place/district state and cannot mint authored companies or establish a canonical prefix. |
| `SettlementBusinessState` | `businessId`, `settlementId`, type/category/scale, workforce, goods, dependencies, notes | Derived simulation state | Runtime projection of settlement economic activity. Workforce, flows, dependencies, and current state remain simulation-owned; `businessId` is not proven static identity. |
| Account estate engine | Maps operational type `business` and `business.` prefix into estate assets | Mutable account/property state | Classifies inheritable/claimable operational assets. It owns deposit/claim state, not world identity. A business asset may later reference static identity, but current prefix acceptance is not canon. |
| Account profile storage | Accepts operational `assetType: business`, asset ids, ownership/operating summaries, and location | Mutable persisted account state | Validates account-owned estate assets and lifecycle state; must not become the static catalog owner. |
| Runtime UI view model | Business window expects revenue, expenses, upgrades, workforce, ownership, and live ledgers | Consumer/UI projection | Explicitly identifies missing runtime feeds. Those mutable values must remain outside first static identity authority. |
| Demo snapshot | `business.gannet_cutter`, **Gannet Cutter**, revenue/expenses/upgrades, Healthy status | Demo/UI fixture | Non-canonical demonstration state. It cannot approve the id, name, financials, status, or business type. |
| Account/ledger tests | Reuse `business.gannet_cutter` to verify estate deposit, storage, and presentation | Test fixture | Proves account-state plumbing only. Repetition across tests does not convert the demo id into canon. |
| Guild content | Guild structures, membership policy, benefits, obligations, and some company-related vocabulary | Another owner's canon | Guild identity remains canonical under `civilization.guilds`; a guild is not a business/company by inference. |
| Buildings/workplaces/settlements/districts/sites | Facilities, production templates, and places associated with commerce | Other owners' canon | A facility, workplace template, market district, or settlement specialization is not a commercial body. |
| Services | Provider-independent service vocabulary | Another owner's canon / future consumer | Service identity does not create a provider or company. Provider links remain separate. |
| Institution/faction/polity/religion/order/family/People | Existing or gated identity owners | Protected boundaries | Institutional, political, religious, kin, and person identities must not be duplicated into a commercial-body collection. |
| Broad design/backlog discussion | Businesses, property, providers, storage, economy, ownership, and runtime expectations | Hypothetical/design guidance | Defines future questions and prerequisites, not canonical records. |

## 4. Ironwheel Haulage Assessment

Ironwheel Haulage Company is the only current exact authored named business/company-shaped signal outside demo/tests.

Supported directly by the quest record:

- display name: **Ironwheel Haulage Company**;
- quest presentation anchor: `business.ironwheel_haulage_coppergate`;
- giver type: `business`;
- quest context at `settlement.coppergate`;
- contact presentation: **Foreman Mira Kell**;
- narrative association with ore convoy hauling.

Not supported as static authority facts:

- whether `business` or `company` is the canonical identity family;
- whether the suffix `coppergate` belongs in a stable identity or is only a local presentation qualifier;
- lifecycle/status vocabulary;
- commercial category taxonomy;
- public posture or legal/charter form;
- canonical summary independent of quest behavior;
- provenance/notes contract;
- whether it is a firm, brand, operating company, local branch, provider, workplace operator, property holder, or quest-only giver abstraction;
- any ownership, workforce, facilities, inventory, routes, contracts, prices, finances, reputation, contact-person identity, or runtime ledger facts.

Therefore the exact quest anchor is partial authored evidence, not an approved seed id. Carry forward neither `business.ironwheel_haulage_coppergate` nor a normalized `company.*` replacement.

## 5. Business Versus Company Decision Posture

Current usage does not prove synonymy or separation.

Possible interpretations that require the boundary decision:

- one static commercial-body family, with `business` as UI/account terminology and `company` as a category or derived owner label;
- one static family named company, with business representing mutable venture/account activity;
- one broad business identity family with company as a formal subtype;
- separate enterprise identity and operating-venture/property layers;
- no new static authority until authored canon clarifies the distinction.

Do not normalize prefixes, rename fields, or select a collection before that decision.

## 6. Static Identity Versus Separate Owners

A possible future static commercial-body record may own only stable descriptive identity after the boundary is approved. It must remain separate from:

- building, workplace, settlement, district, site, property, plot, and facility identity;
- services and provider associations;
- owners, shareholders, families, guilds, institutions, factions, polities, religions/orders, people, employees, managers, contacts, and membership;
- property ownership, leases, charters, branches, locations, service areas, and operating permissions;
- workforce, staffing, payroll, schedules, production, input/output goods, infrastructure dependencies, and upgrades;
- inventory, stock, storage contents, prices, sales, purchases, contracts, shipments, routes, revenue, expenses, profit, treasury, debt, valuation, and taxes;
- reputation, trust, standing, access, legal status, quests, rewards, events, and relationship state;
- account estate deposits/claims, inheritance, operating state, save data, runtime ledgers, UI, AI, and gameplay.

Later typed links or runtime projections may reference static identity only after their own semantics are approved.

## 7. Protected Owner Boundaries

- Workplaces remain production/workforce templates.
- Buildings remain facility templates.
- Settlements, districts, sites, and plots remain place/property anchors.
- Services remain provider-independent vocabulary.
- Guilds, institutions, factions, polities, religions/orders, families/households, and People/NPC retain their identities.
- Professions/roles remain reusable vocabulary or actor assignments.
- Account estate retains mutable inherited operational-asset state.
- Quest definitions retain giver presentation, scheduling, requirements, branching, and outcomes.
- Settlement simulation retains derived businesses, owners/operators, workforce, goods, and current economic state.
- UI/demo/tests remain projections and fixtures.

No current owner should be migrated or duplicated by default.

## 8. Candidate Decision

Strong canonical candidates meeting a complete static identity gate: none.

Exact ids approved for a later seed: none.

Carry forward exactly zero ids. The boundary decision may define what evidence a future schema/seed would require, but it must not retroactively approve Ironwheel or Gannet Cutter.

## 9. Next Decision And Research Posture

A later boundary decision is justified because:

- multiple real consumers expect a commercial identity concept;
- exact authored and synthetic signals use conflicting `business` and `company` vocabularies;
- existing owners can be protected through a narrow static-identity boundary;
- deciding whether a new authority is justified does not require content or external facts.

Select `Version 0.5.335 - Business Company Authority Boundary Decision`.

Deep Research is not required. The next question is repository ownership, terminology, and non-implication—not medieval corporate history.

No explicit user question is required before the boundary decision. It can remain fail closed and choose preservation if evidence is insufficient. User authorship may be required later before a seed.

No support-suffix run is needed. The evidence audit completed without a workflow or validation blocker.

## 10. Explicit Non-Goals

- no business/company content, schema, validator, test, registration, candidate, prefix normalization, rename, migration, alias, or adapter;
- no Ironwheel or Gannet Cutter promotion;
- no building/workplace/service/provider/property/account/quest/runtime/UI changes;
- no ownership, workforce, stock, price, contract, finance, reputation, quest, ledger, save/account, or gameplay behavior;
- no gated/paused/rejected/closed-lane reopening, Deep Research, temporary artifact, support suffix, or `0.6.0` transition.

## 11. Audit Question Answers

1. Dedicated business/company content is absent.
2. Dedicated schema, validator, focused tests, and normal registration are absent.
3. Ironwheel Haulage Company is partial authored identity inside a quest presentation owner, not approved static canon.
4. Building `triggerBusinessTypes` is reusable template vocabulary.
5. Workplace `businessScale` is reusable production/template vocabulary.
6. Generated `company.*` owner/operator ids are synthetic derived state.
7. `SettlementBusinessState` is runtime simulation state.
8. Account estate `business` assets are mutable persisted ownership/inheritance state.
9. Business UI windows are consumers of future ledgers/state.
10. `business.gannet_cutter` is demo/test-only.
11. `business` and `company` are unresolved; current usage proves neither synonymy nor separation.
12. Static identity must remain separate from every owner/state family listed in section 6.
13. Existing guild, institution, faction, polity, religion/order, family/household, People/NPC, place/facility, service, profession/role, quest, account, and runtime owners remain protected.
14. No exact candidate id is approved.
15. Exactly zero ids carry forward.
16. A later owner-boundary decision is justified.
17. Deep Research is not required.
18. An explicit user question is not required before the boundary decision.
19. A support-suffix run is not needed.
20. Select `Version 0.5.335 - Business Company Authority Boundary Decision`.

## 12. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required roadmap selection, organization/economy/settlement/service/family/social/civic boundaries, exact quest record, building/workplace schemas and content, settlement derivation, shared simulation contracts, account estate/storage, UI/demo, focused tests, coordination, roadmap, and backlog reads.
- Narrow absence and vocabulary scans confirmed no dedicated business/company authority files or registration and classified exact `business.*`/`company.*` occurrences.
- Required focused tests, schema smoke, normal content lint, docs-only scope, unchanged content/contracts/runtime/UI/account state, artifact, conflict-marker, whitespace, route-pointer, diff, and status checks are recorded in `docs/dev/current-codex-output.md`.

## 13. Next Recommended Version

Version 0.5.335 - Business Company Authority Boundary Decision
