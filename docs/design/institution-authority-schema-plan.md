# Institution Authority Schema Plan

Source version/run: Version 0.5.329 - Institution Authority Schema Plan
Date: 2026-07-11
Status: approved documentation-only schema plan; no implementation permission

## 1. Plan Summary

Plan a future strict `civilization.institutions` authority for static authored identity belonging to durable named civic, administrative, judicial, scholarly, charitable, educational, archival, medical, or similar bodies that are not better owned elsewhere.

The first contract is deliberately narrow: canonical identity, lifecycle, descriptive category, public visibility posture, summary, provenance, and notes only. It contains no cross-authority references, office structure, people, membership, services, access, finance, schedules, Knowledge or Magic Study mutation, runtime state, UI, save/account state, or gameplay behavior.

Select `Version 0.5.330 - Institution Authority Schema And Validator` next. That run may add only the strict schema, a pure in-memory validator, focused tests, and schema-file parse coverage. It must not add live content, candidate ids, resolver logic, consumer enablement, or normal content-lint registration.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.329 - Institution Authority Schema Plan`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.330 - Institution Authority Schema And Validator`.
- Institution and office are separate; office remains not schema-ready.
- Existing polity, government, jurisdiction, law, force, guild, faction, religion/order, business, family, place/facility, service/provider, profession/role, People/NPC, Knowledge, magic, quest, economy, account, reputation, and runtime owners remain protected.
- No institution content, schema, validator, focused test, normal registration, or approved candidate id exists.
- Faction and People/NPC remain authored-input blocked; service, resource/commodity, and combat health remain paused; generic `world.pois` remains rejected; Highcrown Knowledge remains closed.
- This plan authorizes no implementation.

## 3. Current Surface Absence And Consumer Check

Fresh repository inspection confirms:

- no `packages/content/base/civilization/institutions.json`;
- no `packages/schemas/civilization/institution.schema.json`;
- no `tools/content-lint/institutions.mjs`;
- no `tests/unit/institution-validation.test.mjs`;
- no institution import, check entry, helper call, or content-file registration in `tools/content-lint/index.mjs`;
- no approved live `institution.*` record or candidate list.

Knowledge registry vocabulary, backstory eligibility fields, Magic Study hooks, service provider-anchor vocabulary, quest office anchors, prose, generic buildings, generated settlement institution profiles, and runtime institution indexes are consumers, placeholders, presentation metadata, or derived state. They do not establish institution identity or approve records. All remain unchanged and fail closed.

## 4. Future Authority And Paths

Authority name:

- `civilization.institutions`

Future paths:

- content: `packages/content/base/civilization/institutions.json`
- schema: `packages/schemas/civilization/institution.schema.json`
- pure validator: `tools/content-lint/institutions.mjs`
- focused tests: `tests/unit/institution-validation.test.mjs`

The schema/validator run should also add the schema to existing schema-file parse coverage. It must not create the content path or edit the normal content-lint index.

## 5. Future Wrapper And Record Contract

### Wrapper

Use the established strict static-authority wrapper:

```json
{
  "records": []
}
```

The wrapper requires exactly `records`, requires an array, and rejects additional properties. Do not add `schemaVersion` or an `institutions` collection key. The future schema may accept an empty in-memory records array for focused testing, but an empty live wrapper must not be created before approved content exists.

### Required record fields

Each first-pass record requires exactly:

- `id`
- `slug`
- `name`
- `status`
- `category`
- `publicPosture`
- `summary`
- `sourceAuthorityNotes`
- `notes`

`sourceAuthorityNotes` is a non-empty unique array of trimmed non-empty strings. `notes` is a unique array of trimmed non-empty strings and may be empty. Record objects reject additional properties.

### Identity and lifecycle

- `id`: `^institution\.[a-z0-9]+(?:_[a-z0-9]+)*$`
- `slug`: `^[a-z0-9]+(?:_[a-z0-9]+)*$`
- validator coherence: `id === "institution." + slug`
- ids and slugs are independently unique;
- `name` and `summary` are trimmed, non-empty static identity text;
- lifecycle: `planned | active | retired`.

A first live seed should normally use `planned` unless later explicit canon supports another current-data posture. `retired` does not authorize aliases, migrations, or compatibility behavior.

## 6. Controlled Vocabularies

### Category

Require exactly one descriptive category:

- `civic`
- `administrative`
- `judicial`
- `scholarly`
- `charitable`
- `educational`
- `archival`
- `medical`
- `other`

`other` is a fail-closed classification only when durable evidence proves institution identity but not a narrower category. Category does not create government authority, office hierarchy, services, facilities, staff, membership, access, or behavior. A school, academy, archive, hospital, court, or charity label alone does not prove a record.

### Public posture

Reuse the nearby descriptive visibility vocabulary:

- `public`
- `semi_public`
- `secret`
- `unknown`

This describes authored outward visibility only. It does not grant discovery, recognition, entry, service access, legal standing, secrecy mechanics, reputation, or gameplay effects. Use `unknown` when canon does not establish visibility.

## 7. First-Pass Reference Posture

Allow no reference fields.

Even references to stable polities, settlements, districts, sites, guilds, religions, factions, buildings, or services would introduce undefined semantics such as location, jurisdiction, sponsorship, control, affiliation, ownership, provider association, or access. The strict schema should reject those fields rather than imply a link contract.

People/NPC, office, government, jurisdiction, law, force, business/company, family/house/lineage, profession/role, membership, employment, leadership, reputation, access, Knowledge, magic, quest, and runtime references remain forbidden or deferred.

A later reference-expansion decision may approve one narrowly named link only after it defines a non-implicating semantic, identifies a stable owner and consumer, and specifies dependency-injected resolver validation. No reference expansion is pre-approved.

## 8. Explicit Forbidden Fields And Inference Sources

`additionalProperties: false` must reject all fields outside the exact contract. Focused tests should include representative fields from these families:

- office/government/legal/force: `officeIds`, `governmentId`, `jurisdictionIds`, `laws`, `courtProcedures`, `forceIds`, `enforcement`, `territory`, `taxes`;
- organization links: `polityId`, `guildIds`, `factionIds`, `religionIds`, `orderIds`, `businessIds`, `companyIds`, `familyIds`, `houseIds`;
- place/facility: `settlementId`, `districtId`, `siteIds`, `buildingIds`, `facilities`, `location`;
- people and links: `members`, `memberIds`, `leaders`, `leaderIds`, `staff`, `employeeIds`, `officeHolders`, `teachers`, `healers`, `judges`, `ranks`, `affiliations`, `relationships`;
- service/economy/access: `services`, `providerTypes`, `availability`, `accessRules`, `prices`, `fees`, `stock`, `inventory`, `contracts`, `treasury`, `schedule`;
- mutable state: `reputation`, `standing`, `favorability`, `recognition`, `membershipState`, `employmentState`, `accessState`;
- Knowledge/magic/narrative: `knowledgeSubjects`, `knowledgeRewards`, `magicStudySources`, `curriculum`, `spells`, `quests`, `dialogue`;
- execution and storage: `runtime`, `ai`, `effects`, `commands`, `events`, `saveState`, `accountState`, `ui`.

The list is illustrative, not permission for omitted fields.

Do not infer institution records from quest `office.*` anchors, Knowledge or Magic Study vocabulary, backstory eligibility hooks, service owner/provider types, generic building/workplace names, settlement prose, school/academy/archive/hospital/court/charity nouns, guilds, factions, religious orders, polities, businesses, generated companies, derived institution profiles, runtime indexes, demo/UI entries, tests, examples, or design hypotheticals.

## 9. Future Validator Plan

`tools/content-lint/institutions.mjs` should export a pure issue-returning helper usable with in-memory fixtures. It must not read the filesystem, require live content, import normal lint, invoke consumers, or depend on runtime/UI/save systems.

The validator should:

1. validate the exact records-only wrapper;
2. require the exact record fields and reject unknown wrapper/record fields;
3. enforce institution-id and lower-snake slug patterns;
4. enforce exact id/slug coherence;
5. enforce unique ids and slugs;
6. reject blank, untrimmed name, summary, provenance, and note text;
7. enforce lifecycle, category, and public-posture enums;
8. require at least one unique provenance note and unique optional notes;
9. reject references, links, behavior, mutable state, runtime, UI, save/account, and gameplay fields through strict shape validation and focused cases;
10. work with empty in-memory records while live content remains absent.

Because the first contract has no references, no owner resolver is needed.

## 10. Future Focused-Test Plan

`tests/unit/institution-validation.test.mjs` should cover:

- valid minimal and empty in-memory wrappers;
- invalid wrapper shapes and unknown wrapper fields;
- non-object records and every missing required field;
- id/slug pattern, exact-coherence, and duplicate failures;
- blank or untrimmed name, summary, provenance, and note text;
- invalid lifecycle, category, and public-posture values;
- empty/duplicate provenance and duplicate notes;
- unknown fields and representative forbidden fields from every family;
- rejection of office, government, legal/force, organization, place/facility, people/link, service/economy/access, Knowledge/magic, and runtime references;
- proof that live institution content remains absent;
- proof that normal content-lint registration remains absent;
- proof that no `institution.*` candidate is created.

The schema-file smoke suite should parse the future schema. Normal content lint should keep passing without institution registration or consumer changes.

## 11. Content, Registration, And Consumer Gates

Normal content-lint registration must not accompany schema/validator implementation. Registration remains a separate later decision after approved live content exists. It must then prove exact-once import, check entry, helper call, and invocation without changing the accepted seed.

No live seed or candidate id is approved. A later seed plan must require exact canonical name, unambiguous identity authority, proof of institution rather than another owner, non-invented summary, supported category/posture/status, durable provenance, and explicit non-implication notes.

This plan does not enable Knowledge subjects, institutional study, Magic Study institution anchors, backstory eligibility, service provider associations, or any other consumer. Those require separate owner-specific decisions after live content and registration are accepted.

Office remains closed and not schema-ready.

## 12. Route Decision

Schema/validator implementation is the next safe route because the strict contract, enums, no-reference posture, pure validation behavior, focused test matrix, absent-content posture, and registration gate are resolved without candidates or external research.

Select `Version 0.5.330 - Institution Authority Schema And Validator`.

No Deep Research, support-suffix run, or explicit user question is required. The next run is repository-local and fail closed. Explicit authored canon will still be required before a seed plan can approve records.

## 13. Explicit Non-Goals

- no content, candidates, empty live wrapper, schema, validator, tests, parse registration, or normal lint implementation in this run;
- no office, government, jurisdiction, law, force, guild, faction, religion/order, business, family, place/facility, service/provider, profession/role, People/NPC, membership, employment, leadership, reputation, access, finance, schedule, Knowledge, magic, quest, runtime, UI, save/account, or gameplay work;
- no aliases, migrations, compatibility ids, adapters, resolver logic, or consumer enablement;
- no paused, blocked, rejected, or closed-lane reopening; no Deep Research or `0.6.0` transition.

## 14. Plan Question Answers

1. No. Live institution content is absent.
2. No. Institution schema, validator, and focused test are absent.
3. No. Normal institution registration is absent.
4. Use `civilization.institutions`, `packages/content/base/civilization/institutions.json`, `packages/schemas/civilization/institution.schema.json`, `tools/content-lint/institutions.mjs`, and `tests/unit/institution-validation.test.mjs`.
5. Use strict `{ "records": [...] }`; require `id`, `slug`, `name`, `status`, `category`, `publicPosture`, `summary`, `sourceAuthorityNotes`, and `notes`.
6. Require `institution.<lower_snake_slug>`, exact id/slug coherence, unique identities, and `planned|active|retired`.
7. Category is `civic|administrative|judicial|scholarly|charitable|educational|archival|medical|other`; public posture is `public|semi_public|secret|unknown`.
8. No first-pass references are allowed.
9. Forbid every owner/link/state/behavior family and inference source listed in this plan.
10. Enforce strict shapes, identity patterns/coherence/uniqueness, trimmed required text, enums, provenance/note rules, and forbidden-field rejection using pure fixtures.
11. Cover valid/empty fixtures, all structural and semantic failures, forbidden families, absent live content/registration, and no candidate creation.
12. No. Normal registration must remain absent during schema/validator implementation.
13. No. No seed or candidate id is approved.
14. No. Knowledge and Magic Study institution references remain disabled/non-authoritative.
15. No. Office work remains deferred.
16. No. Deep Research is not required.
17. No. A support-suffix run is not needed.
18. No. An explicit user question is not needed.
19. Select `Version 0.5.330 - Institution Authority Schema And Validator`.

## 15. Checks Run

- Required status, fetch, and fast-forward pull.
- Required handoff, prompt, sequence, roadmap, backlog, institution/office boundary, nearby faction plan, civic/economy/social/People/service/Knowledge/Magic boundaries, schema, pure validator, focused-test, schema-parse, and normal-lint convention reads.
- Fresh absence and consumer scans confirmed no institution content/schema/validator/test/registration/candidate and no authorized consumer.
- Required schema tests, normal content lint, scope, artifact, conflict-marker, whitespace, route-pointer, diff, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 16. Next Recommended Version

Version 0.5.330 - Institution Authority Schema And Validator
