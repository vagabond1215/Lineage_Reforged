# Faction Authority Schema Plan

Source version/run: Version 0.5.323 - Faction Authority Schema Plan
Date: 2026-07-11
Status: approved documentation-only schema plan; no implementation permission

## 1. Plan Summary

Plan a future strict `civilization.factions` authority for static authored identity belonging to durable named non-sovereign political, social, ideological, criminal, rebel, resistance, advocacy, pressure-group, or similar organized collectives.

The first contract should be deliberately narrow: canonical identity, lifecycle, minimal classification, public posture, provenance, and notes only. It should not contain cross-authority references, membership, affiliation, leaders, ranks, relationships, reputation, services, law, territory, quests, runtime state, UI, save/account state, or gameplay behavior.

Select `Version 0.5.324 - Faction Authority Schema And Validator` next. That run may add only the strict schema, a pure in-memory validator, focused tests, and schema-file parse coverage. It must not add live content or normal content-lint registration.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.323 - Faction Authority Schema Plan`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.324 - Faction Authority Schema And Validator`.
- Existing guild, polity, religion/religious-order, service, place, economy, account, reputation, People/NPC, Knowledge, quest, and runtime owners remain protected.
- A general organization umbrella remains rejected.
- Institution/office, government/jurisdiction/law/force, business/company, provider, membership/affiliation, and local-reputation authorities remain deferred.
- People/NPC, service, resource/commodity, and combat health remain paused; generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed.
- No content, schema, validator, test, registration, Deep Research, runtime, UI, save/account, or gameplay implementation is authorized by this plan.

## 3. Existing Faction Surface Absence Check

Fresh repository inspection confirms:

- no live `packages/content/base/civilization/factions.json`;
- no `packages/schemas/civilization/faction.schema.json`;
- no `tools/content-lint/factions.mjs`;
- no `tests/unit/faction-validation.test.mjs`;
- no faction import, check entry, helper invocation, or file registration in `tools/content-lint/index.mjs`;
- no approved live `faction.*` record or candidate list.

Current `factionId` eligibility fields, `factionIds` forbidden-field checks, quest prose, standing/reputation language, and faction-shaped runtime/design references are consumers, placeholders, or guardrails. They do not establish content authority or approve records. Guilds, polities, religion-owned orders, quest anchors, settlements, shadow networks, generated groups, movement/ideology labels, businesses, families/houses, and runtime standing likewise provide no safe faction seed.

## 4. Future Authority And File Layout

Authority name:

- `civilization.factions`

Future paths:

- content: `packages/content/base/civilization/factions.json`
- schema: `packages/schemas/civilization/faction.schema.json`
- pure validator: `tools/content-lint/factions.mjs`
- focused tests: `tests/unit/faction-validation.test.mjs`

The schema/validator run should also add the schema to existing schema-file parse coverage. It should not create the content path or edit the normal content-lint index.

## 5. Future Wrapper And Record Contract

### Wrapper

Use the repository's established static-authority wrapper:

```json
{
  "records": []
}
```

The wrapper must require exactly `records`, require it to be an array, and reject additional properties. Do not add `schemaVersion` or a collection-specific `factions` key. Nearby polity, person, service, resource, commodity, and other static authorities use records-only wrappers; matching that convention is safer than creating a one-off wrapper shape.

The future schema may permit an empty records array so focused in-memory validation and pre-seed tooling remain possible. Do not create an empty live wrapper; the file remains absent until a later content run is explicitly authorized.

### Required record fields

Each first-pass record should require exactly:

- `id`
- `slug`
- `name`
- `status`
- `category`
- `publicPosture`
- `summary`
- `sourceAuthorityNotes`
- `notes`

`sourceAuthorityNotes` should be a non-empty unique array of non-empty strings. `notes` should be a unique array of non-empty strings and may be empty. Record objects must reject additional properties.

### Identity rules

- `id`: `^faction\.[a-z0-9]+(?:_[a-z0-9]+)*$`
- `slug`: `^[a-z0-9]+(?:_[a-z0-9]+)*$`
- the validator must require `id === "faction." + slug`;
- `name`: trimmed, non-empty canonical display name;
- `summary`: trimmed, non-empty, non-invented static identity summary;
- ids and slugs must each be unique across the wrapper.

### Lifecycle

Use the nearby static-authority lifecycle vocabulary:

- `planned`
- `active`
- `retired`

A first live seed should normally use `planned` unless later explicit evidence supports another current-data posture. `retired` does not authorize aliases, migrations, or compatibility behavior.

## 6. Enum And Optional-Reference Posture

### Category

Require one tightly scoped descriptive category:

- `political`
- `social`
- `ideological`
- `criminal`
- `rebel`
- `resistance`
- `advocacy`
- `pressure_group`
- `other`

`other` is a fail-closed descriptive escape only when durable evidence proves faction identity but does not support a narrower category. It must not absorb guilds, polities, governments, religions/orders, businesses, families/houses, movements, ideologies without an organized collective, or temporary groups.

### Public posture

Require one descriptive visibility posture:

- `public`
- `semi_public`
- `secret`
- `unknown`

This field describes authored outward visibility only. It does not grant discovery, concealment, access, law, hostility, membership, AI, or gameplay effects. Use `unknown` when the canonical source does not establish posture.

### Optional references

Allow no reference fields in the first contract.

Although polities, religions, and guilds are stable owners, fields such as `primaryPolityId`, `primaryReligionId`, and `relatedGuildIds` would introduce undefined semantics around affiliation, sponsorship, control, membership, relationship, or primacy. The first schema should reject them as unknown fields rather than imply a link contract.

References to people/NPCs, offices, governments, jurisdictions, laws, forces, businesses, companies, institutions, families/houses/lineages, memberships, locations/sites, services/providers, quests, or runtime state remain forbidden or deferred because their owner, link semantics, or mutation boundary is missing or outside static faction identity.

A later reference-expansion decision may add a narrowly named optional link only after it defines one non-implicating semantic, identifies an existing stable owner, names a consumer, and supplies dependency-injected resolver validation. No such expansion is pre-approved.

## 7. Explicit Forbidden Fields

The strict first schema must reject all unplanned fields through `additionalProperties: false`. Focused semantic tests should explicitly prove rejection for representative fields from these families:

- membership/people: `members`, `memberIds`, `leaders`, `leaderIds`, `officers`, `officerIds`, `ranks`, `affiliations`, `relationships`;
- cross-authority links: `primaryPolityId`, `primaryReligionId`, `relatedGuildIds`, `organizationId`, `institutionId`, `governmentId`, `officeIds`, `businessIds`, `companyIds`, `familyIds`, `houseIds`, `lineageIds`;
- mutable social/player state: `standing`, `reputation`, `favorability`, `trust`, `membershipState`, `playerStanding`;
- providers/economy/access: `services`, `providers`, `accessRules`, `prices`, `stock`, `inventory`, `contracts`, `treasury`;
- narrative/legal/political behavior: `quests`, `laws`, `jurisdictions`, `diplomacy`, `conflicts`, `claims`, `territory`, `borders`, `control`, `taxes`, `enforcement`;
- place/runtime/actor behavior: `sites`, `currentLocation`, `runtime`, `ai`, `combatProfiles`, `dialogue`, `schedule`, `effects`, `saveState`, `accountState`.

The list is illustrative guardrail coverage, not permission for any omitted field. Every field outside the exact first-pass contract remains invalid.

## 8. Future Validator Plan

`tools/content-lint/factions.mjs` should export a pure validation helper usable with in-memory fixtures. It should not read the live filesystem, require a live content wrapper, import the normal lint index, or depend on runtime/UI/save systems.

The validator should:

1. validate the exact records-only wrapper shape;
2. enforce required record fields and reject unknown wrapper/record fields;
3. enforce faction id and lower-snake-case slug patterns;
4. enforce exact id/slug coherence;
5. enforce unique ids and unique slugs;
6. reject blank or whitespace-only `name`, `summary`, provenance entries, and note entries;
7. enforce lifecycle, category, and public-posture enums;
8. enforce unique `sourceAuthorityNotes` and `notes`, with at least one provenance note;
9. reject all first-pass reference/link, behavioral, mutable-state, runtime, UI, save/account, and gameplay fields through strict shape validation and focused guardrail cases;
10. accept an absent live file posture because focused tests call the helper with fixtures rather than loading content.

Because the first contract has no references, it needs no owner resolver. If a later schema revision authorizes references, its validator must accept explicit resolver inputs, validate only against approved stable owners, and fail closed for missing or deferred owners.

## 9. Future Focused-Test Plan

`tests/unit/faction-validation.test.mjs` should cover at minimum:

- a valid minimal planned faction fixture;
- empty in-memory records acceptance without creating live content;
- invalid wrapper shape and unknown wrapper fields;
- id/slug pattern and exact-match failures;
- duplicate ids and duplicate slugs;
- every missing required field;
- blank name, summary, provenance, and note entries;
- invalid `status`, `category`, and `publicPosture` values;
- duplicate provenance and note entries;
- unknown fields and representative forbidden fields from every family above;
- rejection of `primaryPolityId`, `primaryReligionId`, `relatedGuildIds`, people/NPC, office/government, business/institution, membership, place, and runtime references;
- proof that the live wrapper remains absent before content authorization;
- proof that normal content-lint registration remains absent before a later registration run;
- proof that no candidate content or `faction.*` id is created by schema/validator work.

The existing schema-file smoke suite should parse the future schema. Normal content lint should continue passing without faction registration.

## 10. Normal Content-Lint Posture

Do not register `factions.json` in normal content lint during schema/validator implementation.

Registration remains a separate later decision after live content exists. It must then prove exactly one import, one checks entry, one semantic-validator call, and one invocation in the normal lint path, while preserving the already accepted seed unchanged. An absent file must never be registered merely because its schema and focused validator exist.

## 11. Seed-Readiness Gate

No live seed is authorized now, and no candidate id is approved.

A later faction seed plan must require, for every proposed record:

- exact canonical faction name;
- an unambiguous `faction.<slug>` id or explicit authority to derive it;
- proof that the entity satisfies the accepted faction boundary and is not better owned elsewhere;
- a non-invented summary;
- supported category, using `other` only when faction identity is proven but narrower classification is not;
- supported public posture, using `unknown` when visibility is not authored;
- lifecycle posture, normally `planned`;
- non-empty durable provenance notes;
- notes stating explicit non-implication boundaries;
- confirmation that no members, leaders, affiliations, relationships, standing, services, law, territory, runtime state, or gameplay behavior is inferred.

Current `factionId` hooks, forbidden-field lists, prose references, guilds, religious orders, quest anchors, settlements, shadow networks, runtime groups, movement/ideology labels, and reputation/standing state are insufficient.

## 12. Deep Research Posture

Deep Research is not required before `0.5.324`. The accepted boundary and repository conventions are sufficient to implement a narrow schema and pure validator. External research cannot create project canon and has no named immediate consumer here.

No Deep Research was run and no temporary research artifact was created.

## 13. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. The plan is decision-complete and selects a normal primary implementation route.

No explicit user question is needed before `0.5.324`. The strict no-content, no-reference implementation can proceed from repository-local conventions. Explicit user authorship or a new durable canonical source will still be required before any seed plan can approve records.

## 14. Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Schema/validator next | Selected | The boundary, identity shape, enums, strict exclusions, validator behavior, and test posture are decision-complete without content. |
| Evidence audit before schema | Rejected | Candidate evidence is unnecessary for a content-independent static identity schema, and the repository evidence audit is already current. |
| Seed plan | Rejected | No durable canonical faction evidence or candidate id is approved. |
| Normal registration | Rejected | No live wrapper exists; registration must follow content and a separate decision. |
| Preserve and pause | Rejected | The schema/validator can be implemented safely without reopening content or runtime lanes. |
| Deep Research | Rejected | No external question or immediate downstream consumer is identified. |
| Implementation in this run | Rejected | This run is documentation only. |

## 15. Selected Option And Rationale

Select `Version 0.5.324 - Faction Authority Schema And Validator`.

The next run can safely create a strict records-only schema, pure fixture-driven validator, focused tests, and schema parse coverage because this plan resolves the contract without relying on live candidates or cross-owner links. Keeping references out of the first pass materially limits ambiguity and preserves every existing authority. Live content and normal registration remain separate later gates.

## 16. Explicit Non-Goals

- no faction, organization, guild, polity, religion/order, institution, office, government, jurisdiction, law, force, business/company, family/house/lineage, service/provider, place, quest, Knowledge, People/NPC, resource/commodity, or combat-health content;
- no schema, validator, test, schema-file test, or normal-lint implementation in this run;
- no candidate list, aliases, migrations, compatibility ids, or empty live wrapper;
- no membership, affiliation, leader/officer/rank, relationship, reputation, standing, favorability, service, provider, access, price, stock, quest, law, diplomacy, conflict, territory, site, runtime, AI, dialogue, schedule, inventory, combat, UI, save/account, or gameplay behavior;
- no inference from existing authorities, prose, hooks, derived projections, tests, examples, or runtime state;
- no generic `world.pois`, Highcrown Knowledge reopening, People/NPC reopening, paused-lane expansion, Deep Research, temporary research artifact, or `0.6.0` transition.

## 17. Plan Question Answers

1. No. Live faction content is not present.
2. No. A faction schema is not present.
3. No. A faction validator is not present.
4. No. Normal faction content-lint registration is not present.
5. Use `packages/content/base/civilization/factions.json`.
6. Use `packages/schemas/civilization/faction.schema.json`.
7. Use `tools/content-lint/factions.mjs`.
8. Use `tests/unit/faction-validation.test.mjs`.
9. Plan the established strict `{ "records": [...] }` wrapper, not `schemaVersion` plus `factions`.
10. Require `id`, `slug`, `name`, `status`, `category`, `publicPosture`, `summary`, `sourceAuthorityNotes`, and `notes`.
11. Require `faction.<lower_snake_slug>`, a lower-snake-case slug, exact id/slug coherence, and unique ids/slugs.
12. Use lifecycle `planned|active|retired`; category `political|social|ideological|criminal|rebel|resistance|advocacy|pressure_group|other`; public posture `public|semi_public|secret|unknown`.
13. Allow no optional references in the first contract.
14. Keep all polity/religion/guild, people/NPC, office/government/law/force, business/institution, family/house/lineage, membership, place, service/provider, quest, and runtime references forbidden or deferred.
15. Explicitly reject the membership, cross-authority, mutable-state, provider/economy, legal/political behavior, place, runtime, UI, save/account, and gameplay fields listed in this plan.
16. Enforce strict wrapper/record shapes, identity coherence and uniqueness, required non-blank fields, enum values, provenance/note list rules, forbidden-field rejection, and pure fixture-driven operation.
17. Cover valid minimal/empty fixtures, wrapper failures, id/slug failures, duplicates, missing/blank required data, invalid enums, duplicate notes, forbidden/unknown fields, rejected references, absent live content/registration, and no candidate creation.
18. No. Normal registration must not be added during schema/validator implementation.
19. No. No live faction seed is authorized now.
20. No. No candidate faction ids are approved now.
21. No. Deep Research is not required before the immediate next route.
22. No. A support-suffix run is not needed.
23. No. An explicit user question is not needed before the next numbered route.
24. The immediate next route is `Version 0.5.324 - Faction Authority Schema And Validator`.

## 18. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required handoff, roadmap, sequence, backlog, authority-boundary, evidence-audit, pause/gate, consolidation, Deep Research policy, live guild/polity/religion/settlement/quest, schema, normal-lint, and schema-test reads.
- Fresh scans for faction content, schema, validator, focused tests, normal registration, faction-like hooks, forbidden inference sources, lifecycle/provenance conventions, and stable owner boundaries.
- Required schema tests, normal content lint, diff/scope, conflict-marker, whitespace, stale-route, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 19. Next Recommended Version

Version 0.5.324 - Faction Authority Schema And Validator
