# Business Authority Schema Plan

Source version/run: Version 0.5.336 - Business Authority Schema Plan
Date: 2026-07-11
Status: approved documentation-only schema plan; no implementation permission

## 1. Plan Summary

Plan a future strict `civilization.businesses` authority for static authored identity belonging to durable named commercial bodies.

The first contract is deliberately narrow: canonical identity, lifecycle, descriptive commercial form, public visibility posture, summary, provenance, and notes only. It contains no owners, people, organizations, places, providers, property, account estate, workforce, production, inventory, prices, contracts, finance, reputation, quests, runtime ledgers, UI, save/account state, or gameplay behavior.

Select `Version 0.5.337 - Business Authority Schema And Validator` next. That run may add only the strict schema, a pure issue-returning in-memory validator, focused tests, and schema-file parse coverage. It must not add live content, normal registration, candidate ids, references, prefix migration, adapters, or consumer enablement.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.336 - Business Authority Schema Plan`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.337 - Business Authority Schema And Validator`.
- One future broad business static identity family is approved in principle.
- Company is a possible business form, not a separate owner.
- No business content, schema, validator, focused test, or normal registration exists.
- Ironwheel, Gannet Cutter, generated `company.*`, quest/account `business.*`, template vocabulary, and runtime business state remain non-canonical or separately owned.
- Exactly zero candidate ids are approved.
- This plan authorizes no implementation.

## 3. Future Authority And Paths

Authority name:

- `civilization.businesses`

Future paths:

- content: `packages/content/base/civilization/businesses.json`
- schema: `packages/schemas/civilization/business.schema.json`
- pure validator: `tools/content-lint/businesses.mjs`
- focused tests: `tests/unit/business-validation.test.mjs`

The schema/validator implementation should add only the schema to existing schema-file parse coverage. It must not create the content path or edit `tools/content-lint/index.mjs`.

## 4. Future Wrapper And Record Contract

### Wrapper

Use the established strict static-authority wrapper:

```json
{
  "records": []
}
```

Require exactly `records`, require an array, and reject additional wrapper properties. Do not add `schemaVersion`, `businesses`, or `companies` wrapper keys.

The future schema may accept an empty in-memory records array for focused testing. Do not create an empty live wrapper; the content file remains absent until a later seed implementation is explicitly authorized.

### Required record fields

Each first-pass record requires exactly:

- `id`
- `slug`
- `name`
- `status`
- `form`
- `publicPosture`
- `summary`
- `sourceAuthorityNotes`
- `notes`

Record objects reject additional properties.

`sourceAuthorityNotes` is a non-empty unique array of trimmed non-empty strings. `notes` is a unique array of trimmed non-empty strings and may be empty.

### Identity

- `id`: `^business\.[a-z0-9]+(?:_[a-z0-9]+)*$`
- `slug`: `^[a-z0-9]+(?:_[a-z0-9]+)*$`
- exact coherence: `id === "business." + slug`
- ids and slugs are independently unique;
- `name` and `summary` are trimmed, non-empty strings.

No alias, former-name, branch suffix, locality suffix, migration, compatibility, or display-name derivation behavior belongs in the first contract.

## 5. Controlled Vocabularies

### Lifecycle

Use the nearby static-authority lifecycle:

- `planned`
- `active`
- `retired`

A first live seed should normally use `planned` unless explicit durable canon supports another current-data posture. `retired` does not authorize aliases, migrations, closed-business runtime state, liquidation, succession, or compatibility behavior.

### Form

Require one descriptive commercial-body form:

- `company`
- `partnership`
- `cooperative`
- `other`
- `unknown`

This field describes authored organizational form only. It does not establish ownership shares, partners, members, governance, charter/legal status, liability, registration, tax treatment, scale, services, property, or operations.

Use `unknown` when durable canon proves an enduring business but does not state its form. Use `other` only when canon states a form outside the narrow vocabulary. Sole traders, merchant houses, brands, branches, ventures, generated operators, guilds, and institutions remain deferred or separately owned; the enum does not admit them by implication.

Do not add a first-pass economic `category`, `industry`, `businessType`, `serviceType`, or `businessScale` field. Those concepts currently belong to workplace/building compatibility or runtime/economy state and would imply unsupported commercial behavior.

### Public posture

Use descriptive outward visibility only:

- `public`
- `semi_public`
- `secret`
- `unknown`

Public posture does not grant discovery, access, trade, service availability, reputation, legality, concealment mechanics, quest visibility, UI visibility, or gameplay effects.

## 6. First-Pass Reference Posture

Allow no references.

References to people, owners, guilds, institutions, factions, polities, religions/orders, families, settlements, districts, sites, buildings, workplaces, services, providers, account assets, quests, or other businesses would introduce undefined ownership, affiliation, location, branch, provider, sponsor, control, employment, or presentation semantics.

The strict schema should reject every such field. A later reference-expansion decision may approve one narrowly named link only after it identifies a stable target owner, defines non-implicating semantics, names a consumer, and specifies dependency-injected fail-closed validation.

## 7. Explicit Forbidden Fields

`additionalProperties: false` must reject every field outside the exact contract. Focused tests should include representative fields from these families:

- people/ownership/governance: `ownerIds`, `founderIds`, `shareholderIds`, `partnerIds`, `managerIds`, `contactIds`, `employeeIds`, `members`, `leadership`, `governance`;
- organization links: `guildId`, `institutionId`, `factionId`, `polityId`, `governmentId`, `religionId`, `orderId`, `familyId`, `householdId`;
- place/facility/branch: `settlementId`, `districtId`, `siteIds`, `buildingIds`, `workplaceIds`, `propertyIds`, `branchIds`, `locations`, `headquarters`;
- service/provider/access: `services`, `serviceIds`, `providerTypes`, `availability`, `serviceArea`, `accessRules`, `licenses`, `permissions`;
- workforce/production: `businessType`, `businessScale`, `industry`, `workforce`, `jobs`, `staffing`, `payroll`, `schedules`, `inputs`, `outputs`, `production`, `upgrades`;
- inventory/economy/finance: `inventory`, `stock`, `storage`, `prices`, `sales`, `purchases`, `contracts`, `shipments`, `routes`, `revenue`, `expenses`, `profit`, `treasury`, `debt`, `valuation`, `taxes`;
- property/account: `ownershipState`, `operatingState`, `estateAssetId`, `sourceRunId`, `inheritance`, `claimState`, `storedValueSummary`;
- narrative/social: `questIds`, `giverType`, `contactName`, `reputation`, `trust`, `standing`, `favorability`, `legalStatus`, `recognition`, `dialogue`, `events`, `rewards`;
- runtime/storage: `runtime`, `ledger`, `health`, `ai`, `effects`, `commands`, `currentActivity`, `ui`, `saveState`, `accountState`;
- deferred commercial identities: `parentBusinessId`, `brandIds`, `ventureIds`, `merchantHouseId`, `soleTraderPersonId`, `generatedCompanyId`.

The list is illustrative guardrail coverage, not permission for omitted fields.

## 8. Existing-String And Candidate Posture

The schema/validator work must not promote or normalize:

- `business.ironwheel_haulage_coppergate`;
- `business.gannet_cutter`;
- generated `company.<settlement>.<districtType>` ids;
- account estate `business.*` asset ids;
- quest giver type `business`;
- building `triggerBusinessTypes`;
- workplace `businessScale`;
- `SettlementBusinessState.businessId` or `businessType`;
- UI business section ids or demo/test fixtures.

The planned `business.` pattern is a future contract namespace, not an assertion that current strings resolve to catalog records.

## 9. Future Validator Plan

`tools/content-lint/businesses.mjs` should export a pure issue-returning helper usable with in-memory fixtures. It must not read the filesystem, require live content, import normal lint, inspect quests/account/runtime/UI, or invoke consumers.

The validator should:

1. validate the exact records-only wrapper;
2. require the exact record fields and reject unknown wrapper/record fields;
3. enforce business-id and lower-snake slug patterns;
4. enforce exact id/slug coherence;
5. enforce unique ids and unique slugs;
6. reject blank or untrimmed name, summary, provenance, and note entries;
7. enforce lifecycle, form, and public-posture enums;
8. require at least one unique provenance note and unique optional notes;
9. reject reference, template, property/account, economy, finance, narrative, runtime, UI, save/account, and gameplay fields through strict shape validation and focused cases;
10. accept an empty in-memory records array while live content remains absent.

Because the first contract has no references, no resolver input is needed.

## 10. Future Focused-Test Plan

`tests/unit/business-validation.test.mjs` should cover:

- valid minimal and empty in-memory wrappers;
- invalid wrapper shapes and unknown wrapper fields;
- non-object records and every missing required field;
- id/slug pattern, exact coherence, and duplicate failures;
- blank/untrimmed name, summary, provenance, and notes;
- all valid lifecycle, form, and public-posture values plus invalid values;
- empty/duplicate provenance and duplicate notes;
- representative forbidden fields from every family in section 7;
- proof that the validator is filesystem-independent and does not import normal lint;
- proof that live business content remains absent;
- proof that normal business registration remains absent;
- proof that no live canonical business id is created or inferred;
- explicit non-promotion posture for Ironwheel, Gannet Cutter, generated company ids, account assets, and consumer/template vocabulary.

The existing schema-file smoke suite should parse the future business schema. Normal content lint must continue passing without business registration.

## 11. Content, Registration, And Seed Gates

### Content posture

Do not create `packages/content/base/civilization/businesses.json` during schema/validator implementation. An absent live wrapper is the required state.

### Registration posture

Do not edit `tools/content-lint/index.mjs` during schema/validator implementation. Normal registration remains a separate decision after approved live content exists. It must later prove exact-once import, checks entry, validator call, and invocation while preserving accepted content unchanged.

### Seed gate

No seed or candidate id is approved.

A later seed audit/plan must require, for every proposed record:

- exact canonical display name;
- proof of an enduring commercial body distinct from a person, family/house, guild, institution, faction, polity, religion/order, provider role, facility, workplace template, property, account asset, quest anchor, generated operator, or runtime venture;
- unambiguous `business.<slug>` authority or explicit authority to derive it;
- non-invented static summary;
- supported lifecycle, form, and public posture;
- durable provenance;
- explicit non-implication notes for owners, workers, places, providers, property, operations, finance, reputation, quests, runtime, UI, and save/account state;
- confirmation that no reference or mutable field is needed for coherent first-pass identity.

Current Ironwheel, Gannet, generated-company, account, quest, template, runtime, UI, and test surfaces do not meet this complete gate.

## 12. Route Decision

Schema/validator implementation is the next safe route because the strict wrapper, fields, enums, identity rules, no-reference posture, pure validator behavior, focused tests, absent-content posture, and separate seed/registration gates are decision-complete.

Select `Version 0.5.337 - Business Authority Schema And Validator`.

That run must implement validation scaffolding only.

## 13. Deep Research / User Question / Support Posture

Deep Research is not required. The contract follows accepted repository-local authority boundaries and validation conventions.

No explicit user question is required before schema/validator scaffolding. User authorship may be required before any seed.

No support-suffix run is needed. The plan is decision-complete and current validation is green.

## 14. Explicit Non-Goals

- no content, schema, validator, test, schema parse, or normal registration implementation in this run;
- no candidate list, aliases, migrations, compatibility ids, adapters, or prefix normalization;
- no current quest/account/demo/generated id promotion;
- no reference, provider, property, ownership, workforce, production, inventory, pricing, contract, finance, reputation, quest, ledger, runtime, UI, save/account, or gameplay work;
- no gated/paused/rejected/closed-lane reopening, Deep Research, temporary artifact, support suffix, or `0.6.0` transition.

## 15. Plan Question Answers

1. Use `civilization.businesses`.
2. Use `packages/content/base/civilization/businesses.json` for future content.
3. Use `packages/schemas/civilization/business.schema.json`.
4. Use `tools/content-lint/businesses.mjs`.
5. Use `tests/unit/business-validation.test.mjs`.
6. Use the strict `{ "records": [...] }` wrapper and do not create an empty live file.
7. Require `id`, `slug`, `name`, `status`, `form`, `publicPosture`, `summary`, `sourceAuthorityNotes`, and `notes`.
8. Require `business.<lower_snake_slug>`, exact id/slug coherence, and unique ids/slugs.
9. Use lifecycle `planned|active|retired`.
10. Use form `company|partnership|cooperative|other|unknown`.
11. Use public posture `public|semi_public|secret|unknown` as visibility only.
12. Do not add category, industry, business type, or scale in the first contract.
13. Allow no first-pass references.
14. Reject all field families listed in section 7.
15. Use a pure issue-returning fixture-driven validator with no resolver.
16. Use the focused-test matrix in section 10 and add schema parse coverage.
17. Do not add normal content-lint registration during schema/validator implementation.
18. No live seed or candidate id is approved.
19. Ironwheel, Gannet Cutter, generated company ids, account assets, and template/consumer strings remain unpromoted.
20. Schema/validator implementation is the next safe route.
21. Deep Research is not required.
22. An explicit user question is not required before implementation.
23. A support-suffix run is not needed.
24. Select `Version 0.5.337 - Business Authority Schema And Validator`.

## 16. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required boundary/audit, nearby institution/faction plans and scaffolds, schema-test/normal-lint conventions, exact current business/company surfaces, coordination, roadmap, and backlog reads.
- No candidate evidence discovery was repeated.
- Required focused tests, schema smoke, normal content lint, docs-only scope, unchanged content/contracts/runtime/UI/account/quest state, zero-candidate, no-prefix-migration/consumer-enablement, artifact, conflict-marker, whitespace, route-pointer, diff, and status checks are recorded in `docs/dev/current-codex-output.md`.

## 17. Next Recommended Version

Version 0.5.337 - Business Authority Schema And Validator
