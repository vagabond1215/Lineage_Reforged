# Sacred Site Knowledge Subject Decision

Version: `0.5.190`
Status: completed documentation-only decision
Date: 2026-06-19

## 1. Subject Vocabulary Decision

Approve direct `sacred_site` subjects for future Religion Knowledge.

`sacred_site` should become a canonical Knowledge subject type only after the Knowledge snippet schema, domain-registry schema vocabulary, validator authority adapter, normal-lint dependency loading, and focused tests land together in a later narrow implementation.

Sacred sites remain within `knowledge_domain.religion`. Do not create `knowledge_domain.sacred_sites`.

This decision implements no schema, validator, registry, content, status, snippet, runtime, UI, storage, or gameplay change.

## 2. Authority Source Decision

Future `subjectType: "sacred_site"` references must resolve `subjectId` against `world.sacred_sites` from `packages/content/base/world/sacred_sites.json`.

The authority contract is:

| Property | Decision |
| --- | --- |
| subject type | `sacred_site` |
| collection id | `world.sacred_sites` |
| id prefix | `sacred_site.` |
| id pattern | `^sacred_site\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$` |
| records | validated `world.sacred_sites` records |
| eligibility | `status: "active"` only |

Planned and deferred site records are not Knowledge-eligible. The current Glasswake Shrine record is planned and must be rejected if a live-style snippet references it.

## 3. Religion Registry Sequencing

Do not update `knowledge_domain.religion` in this run or in the first subject-support implementation.

Specifically, do not yet:

- add `sacred_site` to live `canonicalSubjectTypes`;
- add `world.sacred_sites` to live `relatedContentCollections`;
- create `knowledge_domain.sacred_sites`;
- change Religion trial, completion, or visibility policy refs from null.

Future live registry alignment should happen only after all three conditions are true:

1. direct `sacred_site` schema and validator support has landed;
2. at least one sacred-site record is active through a separate status decision;
3. the first sacred-site snippet seed is ready for the same narrow content pass.

Co-locating registry alignment with the first live snippet avoids advertising an unusable direct subject.

## 4. Version 0.5.191 Support Boundary

`Version 0.5.191 - Sacred Site Knowledge Subject Support` should implement only:

1. add `sacred_site` to `packages/schemas/player/knowledge_snippet.schema.json` at `properties.subjectType.enum`;
2. add `sacred_site` to `packages/schemas/player/knowledge-domain-registry.schema.json` at `properties.canonicalSubjectTypes.items.enum`;
3. load `packages/content/base/world/sacred_sites.json` in normal Knowledge snippet validation without adding a second checked-file count;
4. add a `sacred_site` subject authority using `world.sacred_sites`, the exact prefix, the two-segment suffix pattern, and live records;
5. extend active-only validation to reject planned and deferred sacred-site subjects;
6. add focused schema, registry, and snippet-validator tests.

The run must not change live Religion registry content, sacred-site status, snippets, Knowledge policies, runtime, UI, storage, or gameplay behavior. Normal content lint should remain 58 checked files.

Because live Religion will not advertise `sacred_site` yet, focused validator tests should clone the Religion record in memory, add `sacred_site` and `world.sacred_sites` only to that fixture, and clone site status as needed. This proves the adapter without creating live support prematurely.

## 5. Focused Validation Requirements

The later implementation should prove:

- both Knowledge subject enums include `sacred_site`;
- registry content cannot advertise `sacred_site` if snippet-schema vocabulary is absent;
- unresolved sacred-site ids are rejected;
- malformed and type-only sacred-site ids are rejected;
- planned sacred-site subjects are rejected;
- deferred sacred-site subjects are rejected;
- a cloned active sacred-site subject is accepted when the cloned Religion registry fixture advertises the type and collection;
- `religious_hotspot` ids cannot be used for `sacred_site` subjects;
- `sacred_site` ids cannot be used for `religious_hotspot` subjects;
- settlement names, settlement ids, and hotspot `sacredSiteType` values cannot stand in for sacred-site authority;
- the existing hotspot snippet continues to validate unchanged;
- live Religion registry content remains unaligned and all policy refs remain null;
- normal content lint remains 58 files.

The sacred-site content validator continues to own site structure and parent/place/religion coherence. Knowledge validation should consume the validated records and add only canonical id resolution plus active-only eligibility.

## 6. Snippet Eligibility Decision

The first future sacred-site snippet must use:

| Field | Required posture |
| --- | --- |
| tier | `1` |
| domain | `knowledge_domain.religion` |
| subject type | `sacred_site` |
| subject id | one active canonical `sacred_site.*.*` id |
| category | `identification`, unless a later plan proves another category |
| discovery source | preferably `book_study`; another current source requires explicit later justification |

The likely future snippet id shape is `knowledge_snippet.religion.<flattened_site_slug>.identification`, but a later seed plan must select the exact id and text.

The snippet must remain descriptive and must not claim:

- deity dedication without explicit site authority;
- religious-order stewardship or control without canonical order authority;
- services, donations, or access rules;
- legal status or consequences;
- pilgrimage route, progress, completion, or rewards;
- favorability, alignment, reputation, or faction effects;
- spell access or Magic Study readiness;
- Prestige, family, or inheritance effects;
- NPC, inventory, map/grid, or travel behavior;
- runtime, UI, storage, command, event, reward, or gameplay effects.

## 7. Active-Only Validation Decision

Future Knowledge validation must:

- reject a missing sacred-site subject id;
- reject planned sacred-site records;
- reject deferred sacred-site records;
- accept active sacred-site records only after direct subject support exists and the domain fixture or live registry advertises the type and collection;
- require the exact `sacred_site.` prefix and two-segment suffix pattern;
- never infer a sacred site from a religious hotspot, settlement name/id, place anchor, or `sacredSiteType` value;
- reject cross-use of `religious_hotspot` and `sacred_site` ids.

A parent hotspot being active does not make its child sacred-site record active or Knowledge-eligible.

## 8. Religious Hotspot Boundary

`religious_hotspot` and `sacred_site` remain separate direct subject types with separate authority collections and id patterns.

The existing Glasswake hotspot snippet remains valid and describes the broader settlement-and-gardens concentration. A future sacred-site snippet would identify the separately named Glasswake Shrine site. It must not be added until the site is active and a later plan proves non-duplicative snippet value.

Hotspot `sacredSiteType` remains descriptive metadata only. It neither creates a sacred-site record nor makes a site Knowledge-eligible.

## 9. Current Glasswake Decision

`sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` remains planned.

It must not be referenced by live Knowledge snippets. It may become the first active sacred-site candidate only through a later dedicated status/activation decision after subject support lands. This run does not activate it.

## 10. Future Sequence

1. `Version 0.5.190 - Sacred Site Knowledge Subject Decision` - completed documentation only.
2. `Version 0.5.191 - Sacred Site Knowledge Subject Support` - schema vocabulary, authority adapter, active-only validation, and focused tests only.
3. Sacred Site Status Activation Decision - planning only; re-audit exactly one site.
4. Sacred Site Content Status Activation - activate one approved site only.
5. Sacred Site Knowledge Snippet Seed Plan - select exact non-duplicative Tier 1 content and discovery source.
6. Sacred Site Religion Registry And Snippet Seed - align Religion and add exactly one snippet.

Each step remains separate unless a later explicit prompt proves that combining two adjacent content-only steps is safer and equally narrow.

## 11. Non-Goals

- no Knowledge schema or validator changes;
- no Knowledge snippet or Religion registry changes;
- no sacred-site content or status changes;
- no religious hotspot changes;
- no runtime, UI, storage, or gameplay changes;
- no pilgrimage, favorability, alignment, law, religious-order, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, command, event, reward, access, service, or donation behavior;
- no transition to `0.6.0`.
