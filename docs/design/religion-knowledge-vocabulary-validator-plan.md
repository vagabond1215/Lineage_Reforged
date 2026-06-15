# Religion Knowledge Vocabulary And Validator Plan

Source version/run: Version 0.5.167 - Religion Knowledge Vocabulary And Validator Plan
Date: 2026-06-15
Status: documentation-only vocabulary and semantic-validator planning

## 1. Purpose And Status

This plan defines the minimum direct subject vocabulary, schema changes, semantic authority, resolver rules, test posture, registry transition, and implementation sequence required before useful Religion Knowledge snippets can be authored.

This run changes documentation only. It adds no schema vocabulary, validator code, tests, snippets, registry content, world religion content, helpers, adapters, runtime loading, evidence, progress, trials, readiness content, storage, persistence, UI, simulation, events, rewards, commands, ownership mutation, faction, reputation, law, conversion, apostasy, Prestige, family, Magic Study, or gameplay behavior.

`knowledge_domain.religion` remains live registry metadata with `status: "planned"`. No Religion snippets or religious-hotspot content are live.

## 2. Current Authority Recap

- `knowledge_domain.religion` exists in `packages/content/base/player/knowledge_domain_registry.json` as Wave 1 planned metadata.
- Its trial, completion, and visibility policy references are null.
- The snippet catalog contains no Religion records.
- The snippet schema has no direct `religion`, `deity`, `doctrine`, `rite`, `holy_day`, `religious_order`, `shrine`, `sacred_site`, or `religious_hotspot` subject.
- The snippet validator blocks `settlement`, `culture`, `institution`, `historical_event`, and `custom`.
- `packages/content/base/world/religions.json` contains `religion.elemental_pantheon`, eight canonical `deity.*` records, six canonical `religious_order.*` records, and four `religious_site.*` structure types.
- Shrine-related geography exists, including Glasswake records, but it does not author dominant faith, doctrine, pantheon affiliation, mismatch pressure, hotspot severity, or a direct sacred-site identity.
- Knowledge Trial readiness content and implementation remain deferred.
- Normal content lint remains `content-lint: ok (56 files checked)`.

## 3. Vocabulary Strategy Decision

The first implementation should add exactly two direct snippet subject types:

- `religion`
- `deity`

This is the minimum useful set because it supports:

- one whole-tradition or pantheon summary;
- one deity identity, domain, opposition, or relationship fact;
- a clear proof that Religion owns religious facts rather than routing them through General Lore or a generic region subject.

Defer:

- `doctrine`
- `rite`
- `holy_day`
- `religious_order`
- `shrine`
- `sacred_site`
- `religious_hotspot`
- general enablement of `settlement`, `culture`, `institution`, and `historical_event`

Do not use `custom`.

`religious_order` has canonical nested ids today, but it is not required to prove the first domain slice. Keeping it deferred limits nested resolver and seed scope. Current `religious_site.*` records describe structure types, not authored site instances, so they must not be exposed as `shrine` or `sacred_site` subjects.

## 4. Evaluated Subject Types

| Subject | First implementation | Reason |
| --- | --- | --- |
| `religion` | Add | Direct top-level authority exists and supports a pantheon summary. |
| `deity` | Add | Canonical nested ids and authored deity facts exist. |
| `doctrine` | Defer | No doctrine records or canonical ids exist. |
| `rite` | Defer | No rite records or canonical ids exist. |
| `holy_day` | Defer | No holy-day records or canonical ids exist. |
| `religious_order` | Defer | Canonical nested ids exist, but the first seed does not need them. |
| `shrine` | Defer | Current geography is suggestive but lacks direct religious-site identity and affiliation. |
| `sacred_site` | Defer | `religious_site.*` entries are types, not actual sacred places. |
| `religious_hotspot` | Defer | Dominant-faith, mismatch-pressure, and hotspot-severity authority does not exist. |
| `settlement` | Keep blocked | Existing settlements do not provide sufficient religious authority. |
| `culture` | Keep blocked | No dedicated current culture collection exists. |
| `institution` | Keep blocked | No unified institution authority exists for Religion snippets. |
| `historical_event` | Keep blocked | No selected historical-event authority or Religion-specific rule exists. |
| `region` | Retain existing support only | May describe current regional facts, but must not substitute for direct Religion subjects or invent religious pressure. |

## 5. Subject Authority Mapping

### Religion

- Subject type: `religion`
- Id pattern: `^religion\.[a-z0-9]+(?:_[a-z0-9]+)*$`
- Collection: `world.religions`
- Source: top-level records in `packages/content/base/world/religions.json`
- Resolution: exact `record.id` match
- Existence: required
- Duplicate ids: rejected before lookup
- Status: the current world religion schema has no status field; existence in validated base content is sufficient
- Planned or inactive authority: not applicable until world religion content gains an explicit status model
- Immediate snippet suitability: yes, after schema/validator implementation and Religion domain activation in the later seed run

### Deity

- Subject type: `deity`
- Id pattern: `^deity\.[a-z0-9]+(?:_[a-z0-9]+)*$`
- Collection: `world.religions`
- Source: every `deities` array nested inside top-level religion records
- Resolution: flatten nested deity records into one read-only authority list, then exact `deity.id` match
- Existence: required
- Duplicate ids: reject a duplicate across or within religion records before lookup; do not silently overwrite
- Parent requirement: the containing religion record must exist in the validated `world.religions` wrapper
- Status: neither religion nor deity records currently have status fields; validated existence is sufficient
- Planned or inactive authority: not applicable under the current schema
- Immediate snippet suitability: yes, after schema/validator implementation and Religion domain activation in the later seed run

### Deferred Nested Authorities

`religious_order` could later use the same nested-authority pattern over `organizations`, with prefix `religious_order.` and collection `world.religions`. It should receive a separate approval because order facts, categories, favored deity references, and seed scope require their own focused tests.

`religious_site.*` structure types must not be treated as actual shrine or sacred-site instances.

## 6. Schema Posture

The next implementation requires both schema and semantic-validator changes.

### Knowledge Snippet Schema

Add `religion` and `deity` to:

- `packages/schemas/player/knowledge_snippet.schema.json`
- `properties.subjectType.enum`

Update focused schema tests to prove both values are accepted and unknown values remain rejected.

### Knowledge Domain Registry Schema

Direct subjects must also be legal registry metadata because the registry validator requires every domain subject to exist in the snippet vocabulary.

Add `religion` and `deity` to:

- `packages/schemas/player/knowledge-domain-registry.schema.json`
- `properties.canonicalSubjectTypes.items.enum`

Update the Religion registry record in the implementation run so `canonicalSubjectTypes` includes `religion` and `deity`. Keep the existing planned contextual subjects unchanged unless that implementation finds a real validation conflict.

This registry schema expansion is required. Without it, the Religion record cannot declare the direct subjects that future snippets must use.

### Schema Tests

`tests/unit/schema-files.test.mjs` already registers both schema files. No new schema file or registration is needed. Future tests should add focused enum assertions rather than a new file-registration path.

### Normal Lint

No new checked content file is required. Loading `world.religions` as a snippet dependency does not change the checked-file count because it is already part of base content validation. Expected successful normal lint remains 56 files.

## 7. Semantic Validator Plan

Future implementation should update `tools/content-lint/knowledge-snippets.mjs` and its existing callers without creating a Religion-specific validator.

### Accepted Subjects

Add support for:

- `religion`
- `deity`

Keep blocked:

- `settlement`
- `culture`
- `institution`
- `historical_event`
- `custom`
- all other currently blocked subjects

### Resolver Inputs

`tools/content-lint/index.mjs` should load:

- `packages/content/base/world/religions.json`

It should pass:

- top-level religion records for `religion`;
- a deterministic flattened deity list for `deity`, or the religion wrapper from which the validator derives that list.

The preferred boundary is explicit subject-authority inputs matching the current validator design:

- `religion`: collection `world.religions`, prefix `religion.`, top-level records;
- `deity`: collection `world.religions`, prefix `deity.`, flattened nested records.

The validator remains pure and receives parsed data. It should not read files itself.

### Duplicate Handling

The implementation must fail closed on:

- duplicate top-level religion ids;
- duplicate deity ids within one religion;
- duplicate deity ids across religions;
- malformed nested records that cannot provide a canonical id.

Do not rely on `Map` overwrite behavior for new nested authority.

### Domain Interaction

Keep the existing rule that snippets may reference only a domain with `status: "active"`.

Do not create an exception allowing Religion snippets while `knowledge_domain.religion` remains planned. Vocabulary support and content permission are separate:

- `0.5.168` may add schemas, resolver authority, tests, and planned registry vocabulary;
- the later first snippet implementation should change Religion to `active` in the same narrow content run that adds approved snippets.

All Religion policy references remain null.

### Collection Coherence

Both direct subjects resolve through `world.religions`, which is already listed in Religion's `relatedContentCollections`.

The validator should continue requiring:

- subject type listed in the domain's `canonicalSubjectTypes`;
- source collection listed in `relatedContentCollections`;
- source collection present in current base content;
- exact subject id existence;
- category and discovery source supported by the domain;
- null discovery `sourceId` under the current rules.

## 8. Registry Status Transition

Religion remains `planned` until at least one approved snippet seed:

- uses explicit `religion` or `deity` authority;
- passes the expanded schemas;
- passes the expanded semantic validator;
- has an authored category and discovery source supported by the registry;
- invents no world facts or runtime implications.

Preferred transition:

- change `knowledge_domain.religion.status` from `planned` to `active` in the same content implementation that adds the first approved Religion snippets.

An immediately preceding status-only run is not justified under current findings.

The transition must not set trial, completion, or visibility policy references.

## 9. First Viable Snippet Directions

Do not author these in this run.

### Elemental Pantheon Summary

- Subject type: `religion`
- Subject id: `religion.elemental_pantheon`
- Likely category: `cultural_context` or `identification`
- Authority: top-level religion summary, deity list, dualities, dominance cycle, organizations, and structure types
- Constraint: describe authored pantheon structure only; do not imply worship state, access, reputation, law, or magic

This is the strongest first snippet because its authority is direct and complete.

### Deity Identity

- Subject type: `deity`
- Candidate subject id: one current `deity.*` id
- Likely category: `identification`
- Authority: deity name, element, domains, and opposed-deity reference
- Constraint: do not infer doctrine, worship requirements, spell access, Divine/Druidic training, or runtime effects

### Deity Opposition

- Subject type: `deity`
- Likely category: `behavior` or `cultural_context`
- Authority: explicit `opposedDeityId` and `dualities`
- Constraint: a seed plan must choose wording that matches the authored relationship exactly

### Deferred Candidates

- Religious organization snippets wait for `religious_order` approval.
- Shrine or holy-site snippets wait for actual site identity and affiliation authority.
- Region-backed snippets may repeat current geography only; they must not substitute for `religion`/`deity` or invent dominant-faith pressure.

## 10. Religious Hotspot Boundary

Defer `religious_hotspot` vocabulary and snippets.

Prerequisites:

- dominant and tolerated faith authority;
- exact religion, deity, order, or doctrine affiliation;
- hotspot severity or mismatch-pressure content;
- direct place identity for the affected region, locality, settlement, shrine, or sacred site;
- separate ownership and runtime plans for any consequences.

Hotspot content must not imply Renown loss, reputation mutation, faction state, law enforcement, persecution, access denial, conversion, apostasy, family conflict, or UI behavior.

## 11. World Religion Content Boundary

Do not change `packages/content/base/world/religions.json` during this plan.

Current content is sufficient for:

- a pantheon summary using `religion.elemental_pantheon`;
- deity identity and opposition facts using current `deity.*` ids.

Current deity ids are canonical enough because the world religion schema enforces their pattern and every deity is an authored nested record.

A world religion authority-hardening run is not required before the first `religion` and `deity` vocabulary implementation.

Separate authority work is required before:

- doctrine, rite, or holy-day subjects;
- actual shrine or sacred-site subjects;
- hotspot affiliation and pressure;
- broader order content if nested organization identity or relationships need expansion.

Do not mix those changes into the first Knowledge vocabulary implementation.

## 12. Future Test Plan

The implementation should update existing focused tests.

### Schema Tests

- snippet schema accepts `religion`;
- snippet schema accepts `deity`;
- registry schema accepts both direct subjects;
- unknown subject types remain rejected;
- schema files remain parseable through existing registration.

### Registry Validation Tests

- Religion planned metadata accepts `religion` and `deity` in `canonicalSubjectTypes`;
- current policy references remain null;
- existing registry vocabulary checks still reject values absent from the snippet enum.

### Snippet Validation Tests

- valid active Religion snippet resolves `religion.elemental_pantheon`;
- valid active Religion snippet resolves one nested `deity.*`;
- unknown religion id is rejected;
- unknown deity id is rejected;
- duplicate top-level religion id is rejected;
- duplicate nested deity id is rejected;
- planned Religion domain is rejected for snippets;
- active Religion domain is accepted for otherwise valid snippets;
- `settlement`, `culture`, `institution`, `historical_event`, and `custom` remain blocked;
- `world.religions` collection coherence is enforced;
- null policy references and non-runnable trial posture remain unchanged.

### Integration Posture

- normal content lint remains 56 checked files unless a genuinely new checked file is registered;
- no new validator entrypoint is added;
- no runtime or helper tests are required.

## 13. Knowledge Trial And Readiness Posture

This plan creates no:

- `trialPolicyRef`;
- trial policy content;
- readiness policy id or content;
- readiness semantic validator;
- attempts, checkpoints, outcomes, cooldowns, rewards, or unlocks;
- runtime eligibility or readiness checks.

Any Religion trial or readiness policy requires a separate plan after Religion is active and sufficient validated snippets exist.

## 14. Non-Goals

- no content edits;
- no schema edits;
- no validator edits;
- no tests or fixtures;
- no helper or adapter;
- no runtime loading;
- no simulation;
- no evidence, progress, completion, trial, or readiness behavior;
- no readiness content;
- no UI or generated output;
- no storage or persistence;
- no reward, event, command, ownership mutation, or gameplay behavior;
- no faith, faction, reputation, law, conversion, or apostasy mechanics;
- no Prestige or backstory implementation;
- no family, heir, marriage, inheritance, adoption, legitimacy, or generation implementation;
- no world religion content changes;
- no Skill Trial or Spell/Magic Study work;
- no unrelated cleanup.

## 15. Open Questions

- Should the first seed contain only the pantheon summary, or pair it with one deity record?
- Which deity best proves the domain without implying runtime magic or worship behavior?
- Should religious organizations become direct subjects immediately after the first seed or wait for more authored order relationships?
- Should settlement, culture, institution, and historical-event subjects remain globally blocked or gain domain-specific authority later?
- Should Religion activation and the first snippet seed remain one implementation run? Current recommendation: yes.
- Which authored fields should eventually define hotspot severity and mismatch pressure?
- Should actual sacred places use new top-level site records or affiliations on existing geography?
- Should Divine and Druidic Magic remain fully disconnected from Religion Knowledge snippets? Current recommendation: yes.

## 16. Future Sequence

Immediate next:

1. `Version 0.5.168 - Religion Knowledge Schema And Validator Vocabulary`

Recommended follow-up:

2. `Version 0.5.169 - Religion Knowledge Domain Seed Content Plan`
3. `Version 0.5.170 - Religion Knowledge Domain Seed`
4. `Version 0.5.171 - Religious Hotspot Knowledge Snippet Plan`
5. `Version 0.5.172 - Family Visibility And Heir Slot Projection Plan`
6. `Version 0.5.173 - Race-Specific Adult Age And Maturation Plan`
7. `Version 0.5.174 - Offspring Growth Role And Activity Build Plan`
8. `Version 0.5.175 - Recipe Ownership And Personal Learning Plan`
9. `Version 0.5.176 - 0.6.0 Runtime Ownership Transition Reassessment`

`0.5.168` is selected because the required schema enums, registry vocabulary, nested authority resolver, index dependency, and focused tests are now exact. World religion authority hardening is not required for the selected `religion` and `deity` subjects.

## 17. Acceptance Criteria For Version 0.5.168

The implementation is complete only when it:

- adds exactly `religion` and `deity` to snippet and registry subject vocabulary;
- updates the planned Religion registry metadata to declare both direct subjects;
- adds explicit `world.religions` authority for top-level religions and nested deities;
- rejects duplicate and unknown religion/deity ids;
- preserves the active-domain requirement, leaving Religion planned and without snippets;
- keeps `custom`, settlement, culture, institution, historical-event, order, site, and hotspot support blocked;
- changes no world religion content;
- keeps all Religion policy references null;
- passes focused schema/validator tests and normal content lint at 56 files;
- adds no runtime, UI, storage, persistence, trial, readiness, reward, event, command, ownership, faction, reputation, law, conversion, apostasy, Prestige, family, Magic Study, or gameplay behavior.

## 18. Temporary Guardrail Decision

Retain this plan through the schema/validator vocabulary implementation and first seed-content planning. After those runs, move durable resolver rules into the current handoff or a broader validation authority and remove this temporary plan when it no longer prevents repeated analysis.
