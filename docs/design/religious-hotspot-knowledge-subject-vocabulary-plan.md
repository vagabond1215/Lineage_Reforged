# Religious Hotspot Knowledge Subject Vocabulary Plan

Version: `0.5.178`
Status: documentation-only planning authority
Date: 2026-06-18

## 1. Purpose And Status

This plan defines direct `religious_hotspot` Knowledge subject vocabulary for a later implementation run. It does not change schemas, validators, source, tests, content JSON, hotspot status, or live snippets.

Religion remains active with exactly two live Religion snippets, and its trial, completion, and visibility policy references remain null. This run adds no runtime, UI, storage, persistence, event, reward, command, favorability, alignment, relationship, law, consequence, Magic Study, Prestige, family, or gameplay behavior. It does not add `world.sacred_sites` or religious order authority.

## 2. Current Authority

- `packages/content/base/world/religious_hotspots.json` is live with exactly two `planned` records:
  - `religious_hotspot.glasswake_shrine_lantern_gardens`
  - `religious_hotspot.lantern_shrine_gardens`
- `packages/schemas/world/religious-hotspot.schema.json` owns structural hotspot validation.
- `tools/content-lint/religious-hotspots.mjs` owns semantic hotspot validation.
- Normal content lint reports `content-lint: ok (57 files checked)`.
- Direct Religion Knowledge subjects are currently `religion` and `deity` only.
- No direct `religious_hotspot` Knowledge subject support or live hotspot Knowledge snippets exist.

## 3. Vocabulary Decision

Add `religious_hotspot` as a direct Knowledge subject type in a future implementation run.

The dedicated hotspot collection and validator now provide canonical ids and reference authority. A hotspot snippet should therefore identify its subject directly rather than misuse `religion`, `deity`, `region`, `settlement`, `institution`, `custom`, `shrine`, or `sacred_site`.

This subject type is descriptive and reference-only. It does not create relationship state, favorability, alignment, law effects, service access, trials, rewards, commands, UI, storage, runtime, or gameplay behavior.

## 4. Future Schema Touchpoints

`Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator` should:

1. Add `religious_hotspot` to `packages/schemas/player/knowledge_snippet.schema.json` at `properties.subjectType.enum`.
2. Add `religious_hotspot` to `packages/schemas/player/knowledge-domain-registry.schema.json` at `properties.canonicalSubjectTypes.items.enum`, because the registry schema owns an explicit canonical-subject vocabulary.
3. Preserve `religion` and `deity` unchanged.
4. Add no `shrine`, `sacred_site`, `religious_order`, or new `custom` path.
5. Add no `world.sacred_sites` authority.

The schema/validator run should not change live registry records or add snippets.

## 5. Future Validator Touchpoints

Normal Knowledge snippet validation should load `packages/content/base/world/religious_hotspots.json` and expose this authority:

| Field | Value |
| --- | --- |
| `subjectType` | `religious_hotspot` |
| `collectionId` | `world.religious_hotspots` |
| `idPrefix` | `religious_hotspot.` |
| `records` | `religiousHotspots.records` |

`tools/content-lint/knowledge-snippets.mjs` should resolve subject ids against that authority, reject malformed and unresolved ids deterministically, preserve current `religion` and `deity` behavior, and reject `custom`, region/settlement workarounds, and shortcut subject types.

Duplicate hotspot ids remain owned by `tools/content-lint/religious-hotspots.mjs`. Knowledge snippet validation should consume the already validated authority and avoid duplicating the hotspot collection's full semantic rules. The normal lint index must load the hotspot wrapper for Knowledge validation without counting the content file a second time.

Registry validation should continue requiring every advertised canonical subject type to exist in the snippet schema. No additional registry-validator rule is needed unless implementation reveals a narrow deterministic diagnostic gap.

## 6. Record Status Reference Policy

Live Knowledge snippets must reference `active` religious hotspot records. `planned` records are sufficient for content planning and authority-resolution tests, but not for published Knowledge claims.

For 0.5.179:

- implement direct id resolution and an explicit active-status gate for `religious_hotspot` snippet subjects;
- test successful resolution with cloned in-memory hotspot authority whose selected record is set to `active`;
- test rejection when the referenced authority remains `planned`;
- do not change either live hotspot record from `planned` to `active`;
- do not add live snippets.

Before hotspot snippet content is seeded, a separate content-status decision and update must establish which selected hotspot record or records are ready to become `active`. Status activation must not be hidden inside schema or validator work.

## 7. Knowledge Domain Registry Posture

Continue using `knowledge_domain.religion`; do not create `knowledge_domain.religious_hotspots`.

A future registry content update may add `religious_hotspot` to Religion's `canonicalSubjectTypes` only after schema and validator support exists. That update should also add `world.religious_hotspots` to `relatedContentCollections` if not already present and justified by the live collection. Religion trial, completion, and visibility policy references must remain null. No readiness or trial policy should be added.

## 8. Future Snippet Posture

The later snippet seed plan should decide whether one or both hotspot records become active and receive snippets. Any live hotspot snippet must:

- use `subjectType: "religious_hotspot"`;
- use an active canonical `subjectId` from `world.religious_hotspots`;
- use current schema categories and discovery-source vocabulary;
- keep Religion policy references null unless a separate policy lane changes them;
- remain descriptive and supported by hotspot/place/religion authority;
- avoid deity, order, favorability, alignment, law, consequence, sacred-site mechanic, pilgrimage boon, elemental trial, quest unlock, access gate, service, or spell claims absent from authority;
- avoid `custom` and shortcut subjects.

No final snippet records are drafted by this plan.

## 9. Sacred Site Boundary

Sacred sites are a later rare subtype under religious hotspots. Existing `sacredSiteType: "shrine"` values are descriptive only. This lane must not introduce `world.sacred_sites` or sacred-site-specific Knowledge vocabulary.

Pilgrimage, elemental trials, quests, boons, and other sacred-site mechanics require separate content authority and system planning.

## 10. Religious Order Boundary

Religious orders should eventually have canonical ids or placeholders and elemental assignments. This run adds neither order records nor `religiousOrderIds`.

Orders may later control or sponsor hotspots and sacred sites, but organizations are not themselves sacred places. Direct religious-order Knowledge subject support remains a separate future decision.

## 11. Favorability, Alignment, And Relationships

Religious favorability and elemental alignment are distinct future systems. Direct hotspot subject vocabulary implements neither.

No relationship ledger, favorability profile, elemental affinity, spell penalty, relationship display, law behavior, or NPC trial/check behavior belongs in this lane. These remain future framework planning after the hotspot Knowledge subject lane unless explicitly reprioritized.

## 12. Future Validation And Test Plan

Focused 0.5.179 coverage should prove:

1. `religious_hotspot` appears in both required subject enums.
2. Registry content cannot advertise it before snippet-schema vocabulary supports it.
3. An in-memory snippet fixture resolves `religious_hotspot.glasswake_shrine_lantern_gardens` when the cloned authority record is `active`.
4. The locality record resolves under the same active fixture policy.
5. A live-style snippet targeting a `planned` hotspot is rejected deterministically.
6. Unresolved and malformed hotspot ids are rejected.
7. `custom`, `shrine`, and `sacred_site` are not accepted as substitutes.
8. Region and settlement subjects cannot stand in for a hotspot id.
9. Existing `religion` and `deity` snippets still pass unchanged.
10. Religion policy references remain null.
11. No trial, readiness, reward, runtime, UI, storage, event, command, or gameplay behavior is introduced.

No live snippet or registry content update belongs in 0.5.179.

## 13. Non-Goals

- no live snippets;
- no schema, validator, source, or test implementation in 0.5.178;
- no content JSON or hotspot status changes;
- no sacred-site collection, records, vocabulary, or mechanics;
- no religious order records, ids, or subject vocabulary;
- no favorability, alignment, relationship ledger, law, consequence, or service access;
- no pilgrimage, trial, boon, quest, or spell mechanics;
- no runtime, UI, storage, persistence, reward, event, command, Magic Study, Prestige, family, or gameplay behavior;
- no transition to `0.6.0`.

## 14. Open Questions

The status policy is decided for this lane: live snippets require active hotspot records. Remaining questions are:

- Should live hotspot snippets require active records or reference planned records? Resolved for this plan: they require `active` records.
- Should the first hotspot snippet seed activate and use one hotspot record or both?
- Should the settlement and locality hotspot records remain separate long-term, or should the locality-scale record remain planned or be deferred?
- Should religious order placeholder ids be planned before any hotspot snippet mentions institutional control?
- Should sacred-site-specific vocabulary wait until generic hotspot snippets land?
- Should auspicious environment or weather context later belong to hotspot modifiers, event tags, ecology records, or religious context records?

## 15. Future Sequence

1. `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator`
2. `Version 0.5.180 - Religious Hotspot Knowledge Snippet Seed Plan`
3. A content-status update before any live hotspot snippet seed, if 0.5.180 selects records for activation.
4. Religious Hotspot Knowledge Snippet Seed.

Optional later planning:

- Religious Order Placeholder Authority Plan
- Sacred Site Authority Plan
- Religious Favorability And Elemental Alignment Framework Plan

This sequence remains in `v0.5.x` until the repository reaches the explicit runtime-ownership milestone for `v0.6.x`.
