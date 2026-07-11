# People NPC Authority Evidence Audit

Source version/run: Version 0.5.318 - People NPC Authority Evidence Audit
Date: 2026-07-11
Status: documentation-only evidence audit; no live People/NPC content authorized

## 1. Audit Summary

The repository still does not contain enough explicit canonical named-person evidence to justify a tiny people-only seed plan. The fresh audit found five quest contact names, one legacy-shaped `npc.corin_ash` quest string, generated settlement operator categories and ids, player/account and combat identities, deity labels, organization/place names, Knowledge vocabulary, prose references, and test fixtures. None is a durable authored person authority under the existing boundary and schema decisions.

No exact `person.*` or `npc.*` candidate is carried forward. NPC overlays remain deferred because no canonical person identity is established and no independent stable presence/interaction posture is proven. Live People/NPC content and normal content-lint registration remain unauthorized.

Select `Version 0.5.319 - People NPC Seed Evidence Deferral` next. That run should remain docs-only and record the minimum explicit authored seed list or future canonical source required before content can proceed.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.318 - People NPC Authority Evidence Audit`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.319 - People NPC Seed Evidence Deferral`.
- Service, resource/commodity, and combat health remain stable and paused.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- Runtime, UI, save/account, and gameplay remain out of scope.

## 3. People/NPC Authority Infrastructure

- `docs/design/npc-social-authority-boundary-decision.md` makes `civilization.people` the owner of stable authored person identity, separates optional NPC overlays, and rejects inference from quest contacts, synthetic operators, combatants, roles, titles, and prose.
- `docs/design/person-vs-npc-schema-decision.md` fixes separate people and NPC collections, requires a resolvable person before an overlay, and keeps both descriptive-only.
- `packages/schemas/civilization/person.schema.json` exists and requires canonical `person.<slug>` identity fields plus provenance.
- `packages/schemas/civilization/npc.schema.json` exists and requires `npc.<person-slug>`, a resolving `personId`, and narrow presence/interaction posture.
- `tools/content-lint/people-npcs.mjs` exists as the pure focused validator.
- `tests/unit/people-npc-validation.test.mjs` exists and proves the contracts with in-memory fixtures while explicitly proving live files and normal registration remain absent.
- `docs/design/first-people-npc-content-seed-plan.md` recommends people-only first, defers overlays, approves no exact ids, and authorizes no live seed list.

## 4. Live Surface Absence Check

- `packages/content/base/civilization/people.json` is absent.
- `packages/content/base/civilization/npcs.json` is absent.
- `tools/content-lint/index.mjs` contains no People/NPC validator import, content path, check registration, helper call, or `main()` invocation.
- `tests/unit/schema-files.test.mjs` still registers both schema files for parse coverage; this is schema coverage, not live content registration.

Normal-lint absence is correct while both live wrappers are absent. This audit does not authorize changing that posture.

## 5. Evidence Source Inventory

| Source | What was inspected | Person-canon authority result |
| --- | --- | --- |
| Boundary and schema decisions | Person identity ownership, NPC overlay prerequisites, forbidden inference sources | Authoritative for boundaries; they explicitly reject weak references as canon. |
| Prior seed plan and completed `0.5.247` records in roadmap/sequence/backlog | Earlier candidate scan, exact-id posture, deferred implementation result | Authoritative for prior decisions; no exact ids or seed list were approved. |
| Person/NPC schemas, pure validator, focused tests, schema parse list, normal lint index | Current contract and registration posture | Authoritative for structure only; examples and fixtures are not content. |
| `packages/content/base/civilization/quest_definitions.json` | All giver contact fields and person-shaped ids | Authored quest presentation/anchor metadata, not canonical person authority. |
| Quest archetypes/templates and quest documentation | Giver types, clients, contacts, structural labels | Template vocabulary only; no stable named-person records. |
| `packages/content/base/civilization/guilds.json` and other civilization content | Guild, workplace, job, service, institution, and operator references | Own their respective entities or roles, not named people. |
| `packages/content/base/world/settlements.json`, `settlement_districts.json`, `settlement_sites.json`, `religions.json`, `religious_hotspots.json`, and `sacred_sites.json` | Place prose, institutions, religious labels, deities, and associations | Places/religions/deities remain their own authorities; no person identity record was found. |
| `packages/content/base/player/knowledge_snippets.json`, `knowledge_domains.json`, `knowledge_domain_registry.json`, `knowledge_trial_policies.json`, and `trials.json` | Subjects, character/teacher/source vocabulary, named religious/place concepts | Informational vocabulary and non-person subjects only; no person subject authority or named teacher record. |
| Player/account/runtime and combat surfaces | Player ids, archived character identity, generated operators, combatants, encounter actors | Mutable, generated, synthetic, or player-owned identity; not `civilization.people`. |
| Repository-wide `person.*`, `npc.*`, `npc_individual`, and `npc_household` scans | Person-shaped ids and operator categories in content, tests, tools, apps, and docs | Only the weak Corin quest id, synthetic operator forms, examples, and test fixtures were found. |
| Relevant lore/design, settlement/site, organization, family, quest/Chronicle, and backlog references | Prose names and prior guardrails | Useful context, but no source explicitly canonized a named person for People authority. |

## 6. Candidate Evidence Table

| Reference/name/id | Source path | Evidence type | Status | Rationale |
| --- | --- | --- | --- | --- |
| Harbormaster Sel Varn | `packages/content/base/civilization/quest_definitions.json` | Quest contact display name | Insufficient | Appears only in giver metadata anchored to a harbor office; title, role, life status, and person authority cannot be inferred. |
| Foreman Mira Kell | `packages/content/base/civilization/quest_definitions.json` | Quest contact display name | Insufficient | Appears only in business giver metadata; the foreman role and company context do not establish canonical person identity. |
| Archivist-Provost Lysa Mar | `packages/content/base/civilization/quest_definitions.json` | Quest contact display name | Insufficient | Appears only as guild contact metadata; title and contact text do not authorize a person record. |
| Inspector Halwen Crest | `packages/content/base/civilization/quest_definitions.json` | Quest contact display name | Insufficient | Appears only in civic quest giver metadata; office/role presentation is not person authority. |
| Corin Ash / `npc.corin_ash` | `packages/content/base/civilization/quest_definitions.json` | Individual giver display/contact name plus legacy-shaped id | Insufficient | The giver is typed `individual`, but the durable schema decisions explicitly classify this unresolved quest string as presentation metadata, not a canonical person or NPC record. No independent identity source exists. |
| Elda Mire / `person.elda_mire` / `npc.elda_mire` | `tests/unit/people-npc-validation.test.mjs`; `tests/unit/magic-study-source-validation.test.mjs` | In-memory test fixture/example | Rejected | Tests state that Elda is a fixture only. Examples validate shape and must not become content. |
| `npc_individual`, `npc_household`, generated operator ids | `packages/shared/types/src/settlement-institutions.ts` and related tests/docs | Generated settlement projection/operator categories | Rejected | Synthetic runtime/projection ownership placeholders are not authored people or NPC overlays. |
| Lady of Light and other elemental Ladies/Lords | `packages/content/base/world/religions.json`; `packages/content/base/player/knowledge_snippets.json` | Canonical deity/religious labels | Rejected | These are deity authority, not evidence that the entities are people/NPCs. |
| Guilds, civic offices, businesses, religions/orders, settlements, districts, and sites | Civilization/world content | Organization, faction-like, office, and place identity | Rejected | Their names canonize non-person authorities only. |
| Player characters, account history names/ids, combatants, encounter actors | Player/account/runtime/combat surfaces | Mutable or generated actor identity | Rejected | These owners do not establish authored canonical `civilization.people`. |
| Character, teacher, source, and quest-giver vocabulary | Knowledge registry, schemas, tests, quest templates | Structural vocabulary | Rejected | Vocabulary describes evidence or template roles and contains no named canonical person. |

No row qualifies as a strong candidate. Therefore no candidate `person.*` or `npc.*` id is approved or carried forward.

## 7. Insufficient-Source Classifications

- Quest contacts: display and anchor metadata can change with quest presentation and do not prove stable person identity.
- `npc.*` strings: a syntactically person-shaped id is not a resolving canonical record; `npc.corin_ash` is explicitly rejected by existing decisions.
- Generated operators: `npc_individual`, `npc_household`, and derived ids are synthetic projection/runtime ownership placeholders.
- Combatants: encounter actors and combat state do not own durable person identity.
- Player/account identities: player-created and archived run identities remain player/account/save authority.
- Roles, titles, jobs, services, and workplaces: these describe functions or facilities, not enduring people.
- Deities and religious labels: religions own deity identities; no current source establishes them as people/NPCs.
- Organizations, factions, guilds, offices, and businesses: these are collective or institutional authorities.
- Settlements, districts, sites, and other locations: place identity does not imply a same-named person.
- Knowledge vocabulary labels: character/teacher/source labels describe evidence or acquisition categories, not named person subjects.
- Prose-only names: prose without an explicit person-authority role cannot supply durable provenance or minimum identity fields.
- Tests, schemas, and examples: fixtures such as Elda Mire prove contract behavior only and explicitly disclaim live canon.

## 8. Seed-Plan Readiness Decision

### People-only plan

Not justified as the immediate route. No candidate meets the existing evidence policy, and a plan with zero safe candidates would only repeat the prior conditional seed plan.

Missing evidence is an explicit authored source that identifies one or more stable named people as canonical and supplies enough context for `id`, matching `slug`, `name`, a short non-invented `summary`, `lifeStatus` posture (which may explicitly be `unknown`), provenance notes, and descriptive notes without inferring roles, affiliations, relationships, schedules, dialogue, services, runtime, or gameplay.

### NPC overlay plan

Not justified. No canonical person candidate exists, and no independent source proves stable `presenceMode`, optional settlement association, or `interactionPosture`. NPC overlays remain deferred.

### Live implementation and normal lint

Not authorized. Neither content wrapper may be created, and absent files must not be registered in normal content lint.

## 9. Deep Research Posture

Deep Research is not required before the immediate next route. External research may inform later social-system or demographic design, but it cannot manufacture repository canon, approve fictional identities, or replace explicit user authorship.

No Deep Research artifacts were created.

## 10. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. The evidence result is decision-complete and can advance through the primary docs-first route.

No explicit user question is required before `0.5.319`. If the deferral gate confirms no new repository source will be authored first, an explicit user-authored canonical seed list will be required before any live content implementation. That list must identify the intended canonical people and enough minimum identity facts; it must not require Codex to infer canon from the weak sources cataloged here.

## 11. Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| No-safe-candidate deferral | Selected | Matches the fresh evidence and avoids inventing canon. |
| Docs-only people seed plan | Rejected now | No strong candidate exists; the prior plan already defines conditional authoring rules. |
| Docs-only NPC overlay plan | Rejected | Neither canonical person identity nor overlay posture is proven. |
| Request explicit authored seed list | Deferred into the selected gate | Likely prerequisite for live content, but the next docs-only run should state the exact evidence gate cleanly. |
| Deep Research | Rejected | Cannot create project canon. |
| Live implementation | Rejected | Explicitly outside scope and unsupported by evidence. |

## 12. Selected Option And Rationale

Select `Version 0.5.319 - People NPC Seed Evidence Deferral`.

This option records a clear fail-closed gate without pretending that weak quest metadata or examples are authored identity. It should define the acceptable future inputs: an explicit user-authored seed list, a new durable canonical lore/content source that clearly owns named people, or another later repository source that meets the same standard. It should preserve the existing people-first posture and keep all overlays and live implementation deferred.

## 13. Risks And Mitigations

- Risk: repeated audits could circle the same weak names. Mitigation: `0.5.319` should record a concrete stop condition and required authored input.
- Risk: quest presentation may be mistaken for person canon because it uses full names. Mitigation: retain the explicit quest-contact classification and require an independent authority source.
- Risk: an `npc.*` token may be mistaken for a resolvable overlay. Mitigation: require a canonical person record first and separate proof for overlay posture.
- Risk: tests/examples may leak into content. Mitigation: preserve their explicit fixture-only status and prohibit candidate promotion from examples.
- Risk: deferral may broaden into another lane. Mitigation: keep `0.5.319` docs-only and do not reopen paused, rejected, or closed lanes.

## 14. Explicit Non-Goals

- no `people.json` or `npcs.json`;
- no people or NPC records, ids, aliases, relationships, affiliations, schedules, dialogue, services, companions, combat profiles, inventory, or AI;
- no schema, validator, focused-test, schema-test, or normal-lint index edits;
- no quest contact migration or legacy-id normalization;
- no generated people, social simulation, runtime, UI, save/account, or gameplay;
- no organization/faction/guild or location/POI implementation;
- no reopening generic `world.pois` or Highcrown Knowledge;
- no service, resource/commodity, or combat-health expansion;
- no Deep Research or temporary research artifact;
- no transition to `0.6.0`.

## 15. Audit Question Answers

1. Yes. Both live files are still absent.
2. Yes. Both schemas still exist.
3. Yes. The pure validator still exists.
4. Yes. Focused tests still exist.
5. Yes. Normal People/NPC content-lint registration is still absent.
6. No. The prior seed plan approved no exact people or NPC ids.
7. No. It authorized no live seed list.
8. Sources inspected are listed in the Evidence Source Inventory, including authority docs, schemas/validation, quest content, civilization/guild content, world settlement/site/religion content, Knowledge content, player/account/runtime/combat surfaces, tests, roadmap/sequence/backlog history, and repository-wide person-shaped reference scans.
9. The found person-like references are the five quest contacts, `npc.corin_ash`, Elda Mire test fixtures, synthetic operator forms, player/account/combat actors, deity labels, and structural character/teacher vocabulary.
10. All are insufficient or rejected for the reasons in the candidate table and classification section.
11. No reference is strong enough for a later people-only seed plan.
12. Not applicable; no exact candidate id or name is carried forward.
13. Missing evidence is an explicit durable person-authority source or user-authored seed list that canonizes identity and supplies the minimum non-invented descriptive facts.
14. Yes. NPC overlays should remain deferred.
15. No. A people-only seed plan is not justified as the next route.
16. No. An NPC seed plan is not justified as the next route.
17. No. Live People/NPC implementation is not authorized.
18. No. Normal content-lint registration is not authorized while the live files are absent.
19. No. Deep Research is not required before the immediate next route.
20. No. Deep Research cannot manufacture repository canon.
21. No. A support-suffix run is not needed.
22. Yes. If no new durable canonical source is authored, an explicit user-authored seed list is required before live content.
23. Proceed with `Version 0.5.319 - People NPC Seed Evidence Deferral`.

## 16. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required authority, handoff, roadmap, sequence, backlog, schema, validator, focused-test, normal-lint index, and schema-test reads.
- Focused scans of quest, lore/design, Knowledge, settlement/site, civilization/guild, player/account/runtime, combat, legacy/backlog, and test/example evidence.
- Live-file, normal-registration, and person-shaped reference scans.
- Required validation and final scope/whitespace/conflict/stale-route checks are recorded in `docs/dev/current-codex-output.md`.

## 17. Next Recommended Version

Version 0.5.319 - People NPC Seed Evidence Deferral
