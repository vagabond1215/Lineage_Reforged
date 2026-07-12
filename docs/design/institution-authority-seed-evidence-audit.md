# Institution Authority Seed Evidence Audit

Source version/run: Version 0.5.331 - Institution Authority Seed Evidence Audit
Date: 2026-07-11
Status: approved documentation-only evidence audit; zero candidate ids; no content permission

## 1. Audit Result

No current repository source provides a complete, durable canonical institution candidate.

Carry forward exactly zero `institution.*` ids. Do not create `packages/content/base/civilization/institutions.json`, register institution validation in normal content lint, enable any consumer, or infer institution records from existing specific owners, place names, generic nouns, hooks, prose, tests, or runtime projections.

Select `Version 0.5.332 - Institution Authority Seed Evidence Deferral` next. That run should fix the authored-input reopening gate and prevent repeated weak-source scans.

## 2. Current Authority Posture

- Strict `packages/schemas/civilization/institution.schema.json` exists.
- Pure `tools/content-lint/institutions.mjs` exists.
- Focused `tests/unit/institution-validation.test.mjs` and schema parse coverage exist.
- Live institution content and normal registration remain absent.
- The first contract permits only static identity, lifecycle, category, public visibility posture, summary, provenance, and notes.
- It permits no references, offices, people, membership, services, access, finance, Knowledge/magic behavior, runtime, UI, save/account, or gameplay fields.
- Office remains separate and not schema-ready.

## 3. Complete Seed Gate

Every proposed record must provide all of the following from durable authored canon:

1. an exact canonical display name;
2. proof that the entity is an enduring organized body, not a place, facility, office, government unit, force, guild, faction, religion/order, business, family, profession/role, service, person, or projection;
3. unambiguous authority for a lower-snake slug and exact `institution.<slug>` id, or explicit user authority to derive them;
4. a non-invented static identity summary;
5. one supported category from `civic|administrative|judicial|scholarly|charitable|educational|archival|medical|other`;
6. one supported descriptive public posture from `public|semi_public|secret|unknown`;
7. one supported lifecycle value from `planned|active|retired`, normally `planned` for a first seed;
8. at least one durable provenance note identifying the source authority;
9. notes explicitly preventing inference of offices, facilities, staff, membership, services, access, finance, Knowledge/magic behavior, runtime state, or gameplay;
10. confirmation that no first-pass reference or mutable field is required to make the identity coherent.

Failure of any item rejects the candidate. Similarity to an institution, a plausible name, or a future consumer need is insufficient.

## 4. Evidence Classification

| Current source | Classification | Seed result |
| --- | --- | --- |
| `settlement_district.highcrown.archive_districts` / **Archive Districts** | Another owner's canon | Exact named district identity under `world.settlement_districts`; its summary mentions archives and institutions, but it is a plural place record and explicitly excludes archive service, staffing, access, and behavior. It cannot be duplicated as an institution. |
| `settlement_district.highcrown.market_courts` / **Market Courts** | Another owner's canon | Exact named civic-commercial district, not proof of a judicial or administrative body. Its notes explicitly exclude court/law mechanics and services. |
| Highcrown and other settlement prose mentioning archives, courts, hospice, archive orders, or institutional sites | Partial/place prose | Provides setting texture and facility/settlement specialization only. It does not consistently supply an exact body name, owner boundary, category, visibility, lifecycle, or provenance for an institution record. |
| Generic building/workplace tiers such as archive bindery, paper works, parchmentery, and scriptorium | Another owner's reusable vocabulary | Production/facility templates and tier labels, not durable named bodies. |
| Eighteen live `guild.*` records, including the Scribes Guild | Another owner's canon | Canonical guild identities remain under `civilization.guilds`; institutional characteristics do not permit duplication. |
| Six `religious_order.*` records under `world.religions` | Another owner's canon | Canonical religion-owned orders remain nested under religion authority; they are not institution seed candidates. |
| Polities, settlements, districts, sites, businesses, families, and factions | Another owner's canon or blocked owner | Existing specific owners remain authoritative; no migration or duplicate record is permitted. |
| Quest `office.harbor_master.brineharbor` and `office.civic_watch.aurelis` anchors | Presentation metadata | Office anchors do not prove institution identity, and office semantics remain unresolved. |
| Quest `archive.highcrown_catacomb_records` and archive-related quest prose | Presentation/narrative metadata | A quest anchor or record label is not an enduring organized body and supplies no complete seed facts. |
| Knowledge `institution`, `institutional_study`, and registry prose | Consumer vocabulary | Anticipates a subject/source owner but remains explicitly blocked or informational. It supplies no identity record or candidate. |
| Magic Study institution/teacher posture | Fail-closed consumer plan | Explicitly waits for canonical institution authority and forbids free-form ids; it cannot manufacture the identities it would consume. |
| Backstory `institutionId`, institutional membership/acceptance, and explanatory strings | Consumer/eligibility vocabulary | Structural hooks and policy text only; no named institution canon or seed facts. |
| Service `institution` provider-anchor type and `future.institutions` allowed-owner value | Future consumer vocabulary | Declares a possible owner type without any provider identity, availability, or candidate. |
| `buildSettlementInstitutionProfiles` and `SettlementInstitutionProfileState` | Synthetic/derived/runtime projection | Derives settlement profiles from settlement, region, locality, guild, religion, magic, crystal, and simulation data; it does not load or mint static institution records. |
| Demo/UI archive and faction-like entries | Presentation/demo state | Non-canonical presentation fixtures cannot seed content. |
| Broad design ledgers and user design decisions discussing civic/religious institutions, academies, courts, and membership | Hypothetical/design guidance | Establish future system intent and boundaries, not exact authored entities with complete record facts. |
| Institution schema/test fixture `institution.lantern_archive` | Test-only hypothetical | The fixture explicitly states that it does not authorize live content. It must never be carried into a seed. |

## 5. Candidate Decision

Strong canonical candidates meeting the complete gate: none.

Exact ids approved for a later seed: none.

Partial signals do not combine into a record. For example, the Archive Districts place record, archive service vocabulary, a scriptorium workplace tier, institutional-study hooks, and an in-memory Lantern Archive fixture cannot be assembled into one invented archive institution. Each source has a different owner and none supplies complete canonical body identity.

The audit therefore carries forward zero ids.

## 6. Rejected Inference Rules

Do not infer a record from:

- office or quest anchors;
- school, academy, archive, hospital, hospice, court, charity, monastery, temple, library, college, university, infirmary, or institutional-site nouns;
- generic buildings, workplaces, districts, sites, settlement specializations, or place prose;
- guilds, factions, religious orders, polities, businesses, families, professions, services, or people/NPCs;
- Knowledge, Magic Study, backstory, service-provider, quest, or schema vocabulary;
- generated companies, settlement profiles, runtime indexes, simulation fields, demos, UI, tests, examples, or hypothetical design text;
- a plausible id/slug generated from a descriptive label;
- external historical analogies or common fantasy conventions.

Evidence from separate owners must not be merged to fill missing seed fields.

## 7. Content, Registration, And Consumer Posture

Keep all of the following absent or unchanged:

- `packages/content/base/civilization/institutions.json`;
- institution normal content-lint registration;
- institution reference fields or resolver logic;
- Knowledge institution subject activation;
- Magic Study institution source activation;
- backstory, service-provider, quest, runtime, UI, save/account, or gameplay integration;
- office schema/content work.

The existing schema, pure validator, focused tests, and schema parse entry remain valid content-independent scaffolding.

## 8. Reopening Evidence

A later seed audit should run only after one of these new durable inputs exists:

- an explicit user-authored institution list with exact names and enough record facts to satisfy the complete gate;
- a new canonical content/design source that intentionally names enduring institution bodies and distinguishes them from facilities, offices, and existing owners;
- a focused authored-content pass that is explicitly authorized to establish institution canon.

New consumer code, more generic prose, another repository-wide search, or external research alone is not a reopening input.

## 9. Deep Research / Support / User Question

Deep Research is not required. The blocker is missing project canon, not external taxonomy. External sources cannot name or authorize Lineage: Reforged institutions.

No support-suffix run is needed. The audit completed successfully and found a decision-complete zero-candidate result.

No immediate explicit user question is required before the next run because `0.5.332` can formalize the deferral. A future institution seed requires explicit user-authored canon or another durable authored source before reopening.

## 10. Explicit Non-Goals

- no content, candidates, empty wrapper, registration, schema/validator/test changes, references, or consumers;
- no office, government, law, force, guild, faction, religion/order, business, family, place/facility, service/provider, profession/role, People/NPC, membership, reputation, access, Knowledge, magic, runtime, UI, save/account, or gameplay work;
- no aliases, migration, compatibility, derived ids, Deep Research, temporary research artifact, or closed-lane reopening.

## 11. Audit Question Answers

1. The complete seed gate is the ten-item gate in section 3; every item is mandatory.
2. No current source meets it.
3. Archive Districts and Market Courts are place canon, not institution canon.
4. Guilds and religious orders retain their existing canonical owners.
5. Office anchors and quest archive labels are presentation metadata.
6. Knowledge, Magic Study, backstory, and service fields are consumer vocabulary.
7. Settlement profiles and runtime indexes are derived consumers.
8. Generic buildings, workplaces, facilities, and design nouns are not named bodies.
9. No exact candidate id is approved.
10. Exactly zero ids carry forward.
11. Live institution content remains absent.
12. Normal institution registration remains absent.
13. References, resolvers, and consumers remain closed.
14. Office remains not schema-ready.
15. Deep Research is not required.
16. A support-suffix run is not needed.
17. An explicit user question is not needed before formal deferral.
18. Select `Version 0.5.332 - Institution Authority Seed Evidence Deferral`.

## 12. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required plan, boundary, schema, validator, focused tests, coordination docs, faction evidence/deferral patterns, and relevant canonical/consumer/runtime sources.
- Focused repository scans for exact ids, named places, guilds/orders, office/quest anchors, institution vocabulary, generic facilities, derived profiles, normal registration, and candidate records.
- Required focused tests, schema smoke, normal content lint, docs-only scope, artifact, conflict-marker, whitespace, route-pointer, diff, and status checks are recorded in `docs/dev/current-codex-output.md`.

## 13. Next Recommended Version

Version 0.5.332 - Institution Authority Seed Evidence Deferral
