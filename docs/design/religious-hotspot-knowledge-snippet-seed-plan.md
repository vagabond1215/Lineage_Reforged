# Religious Hotspot Knowledge Snippet Seed Plan

Version: `0.5.180`
Status: documentation-only planning authority
Date: 2026-06-18

## 1. Purpose And Status

This plan defines the first religious hotspot Knowledge snippet seed path after direct `religious_hotspot` schema and validator support landed in 0.5.179.

This run adds no live snippets, hotspot status changes, registry content changes, schema, validator, source, test, runtime, UI, storage, persistence, event, reward, command, gameplay, sacred-site, religious-order, favorability, alignment, law, or consequence behavior.

## 2. Current Authority

- `religious_hotspot` is present in both Knowledge subject schema vocabularies.
- Knowledge snippet validation resolves hotspot ids through `world.religious_hotspots` and requires referenced hotspot records to be `active`.
- `religious_hotspot.glasswake_shrine_lantern_gardens` and `religious_hotspot.lantern_shrine_gardens` are both live as `planned` records.
- Active-only validation therefore blocks all live hotspot snippets today.
- Live `knowledge_domain.religion` content does not yet advertise `religious_hotspot` or `world.religious_hotspots`.
- No live religious hotspot snippets exist.
- Normal content lint remains `content-lint: ok (57 files checked)`.

## 3. Activation Decision

Activate only `religious_hotspot.glasswake_shrine_lantern_gardens` before the first live snippet.

The settlement-scale record is the stronger first subject because it has a concrete `settlement.glasswake_shrine` anchor, supports a narrow identification claim, and avoids treating the wider locality as uniformly established religious authority. Limiting activation to one record also keeps the first content and validation surface small.

Keep `religious_hotspot.lantern_shrine_gardens` as `planned` until broader locality, point-of-interest, map, or second-snippet needs are clearer.

Alternative: activate both records and author paired settlement/locality snippets. This is broader, risks duplicative claims, and should remain deferred unless a later pass explicitly selects locality-scale coverage.

## 4. Version 0.5.181 Content Status Activation

The immediate next run should be `Version 0.5.181 - Religious Hotspot Content Status Activation`.

That run should:

1. Change only `religious_hotspot.glasswake_shrine_lantern_gardens.status` from `planned` to `active`.
2. Keep `religious_hotspot.lantern_shrine_gardens.status` as `planned`.
3. Update focused hotspot validation tests only if current live-content assertions require it.
4. Update coordination docs.
5. Preserve normal content lint at 57 checked files.
6. Add no Knowledge snippets or registry content changes.
7. Add no sacred-site, order, favorability, alignment, relationship, law, runtime, UI, storage, event, reward, command, or gameplay behavior.

Activation must remain a visible content-authority decision rather than being folded into snippet seeding.

## 5. First Snippet Decision

After activation, seed exactly one Tier 1 identification snippet:

| Field | Planned value |
| --- | --- |
| `id` | `knowledge_snippet.religion.glasswake_shrine_lantern_gardens.identification` |
| `domainId` | `knowledge_domain.religion` |
| `subjectType` | `religious_hotspot` |
| `subjectId` | `religious_hotspot.glasswake_shrine_lantern_gardens` |
| `tier` | `1` |
| `category` | `identification` |
| `title` | `Recognizing the Glasswake Shrine Lantern Gardens` |

The snippet must be descriptive only. It must not imply service access, favorability, law, pilgrimage rewards, sacred-site boons, trial access, spell effects, or religious-order control.

## 6. Registry Update Decision

Do not update live Religion registry content during 0.5.181 activation.

Update `knowledge_domain.religion` in the later live snippet seed run by:

- adding `religious_hotspot` to `canonicalSubjectTypes`;
- adding `world.religious_hotspots` to `relatedContentCollections`;
- preserving all existing canonical subjects and collection references;
- keeping `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` null;
- creating no new `knowledge_domain.religious_hotspots` domain.

Co-locating registry alignment with the first snippet keeps the live registry from advertising an unused subject between runs.

## 7. Version 0.5.182 Live Snippet Seed

After 0.5.181 activation, `Version 0.5.182 - Religious Hotspot Knowledge Snippet Seed` should:

1. Update `packages/content/base/player/knowledge_domain_registry.json` with the two Religion registry additions above.
2. Update `packages/content/base/player/knowledge_snippets.json` with exactly the one planned hotspot snippet.
3. Preserve both existing Religion snippets unchanged.
4. Target only `religious_hotspot.glasswake_shrine_lantern_gardens`.
5. Keep Religion policy references null and add no Knowledge trial policies.
6. Preserve normal content lint at 57 checked files.
7. Add focused registry/snippet assertions as required, without runtime behavior.

## 8. Snippet Content Posture

Allowed claims are limited to current authority:

- the subject is a religious hotspot centered on Glasswake Shrine and its lantern shrine gardens;
- the settlement sits in the Lantern Shrine Gardens locality of Glasswake Quay;
- supported descriptive context may mention shrine gardens, traveler relief, copied records, herb cultivation, and shrine-adjacent settlement patterns;
- the Elemental Pantheon relationship is planned descriptive religion authority only;
- no deity-specific affiliation is claimed.

Forbidden claims include service or access rights, donations, prayer mechanics, pilgrimage rewards, boons, elemental trials, favorability or alignment changes, religious-order control, law enforcement, faction standing, spell effects, Magic Study, Prestige, family or inheritance, and any runtime UI or gameplay result.

## 9. Discovery Source Posture

Use only source types already allowed by both the current Knowledge snippet schema and live Religion domain registry.

Recommended initial sources:

- `book_study`, for copied records or written descriptions;
- `teacher_instruction`, for instruction by a knowledgeable person or religious educator;
- `travel_observation`, only when the future snippet text and evidence explicitly describe observing the place while traveling.

Do not use `npc_instruction`; the current canonical source is `teacher_instruction`. Do not use `direct_observation` or `map_study`; neither is in the current schema/Religion vocabulary. A future vocabulary pass may consider them, but 0.5.182 must not invent source types.

The seed implementation should choose the smallest supported source set justified by the final snippet text, preferably `book_study` first.

## 10. Open Decisions

- whether `religious_hotspot.lantern_shrine_gardens` should later become active;
- whether a second locality-scale hotspot snippet provides distinct value;
- when sacred-site authority planning should begin after generic hotspot snippets;
- whether religious-order placeholder authority should precede any institutional-control claim;
- whether pilgrimage data fields should be defined before sacred-site mechanics;
- whether future hotspot snippets should include locality-scale discovery evidence;
- whether future point-of-interest or map integration should connect to hotspot snippets.

## 11. Future Sequence

1. `Version 0.5.180 - Religious Hotspot Knowledge Snippet Seed Plan` - completed.
2. `Version 0.5.181 - Religious Hotspot Content Status Activation` - recommended next.
3. `Version 0.5.182 - Religious Hotspot Knowledge Snippet Seed` - recommended after activation.
4. Religious Hotspot Locality Snippet Decision or Sacred Site Authority Plan - later.
5. Religious Order Placeholder Authority Plan - later.
6. Religious Favorability And Elemental Alignment Framework Plan - later.

Sacred-site planning should follow generic hotspot snippets and precede full favorability/alignment mechanics. Pilgrimage is the accepted first sacred-site mechanic, but neither sacred-site authority nor pilgrimage behavior is implemented or specified by this plan.

## 12. Non-Goals

- no live snippets;
- no hotspot activation;
- no live registry content changes;
- no schema, validator, source, or test changes;
- no sacred sites or religious orders;
- no favorability, alignment, relationship ledger, law, consequence, or service access;
- no pilgrimage, trial, boon, spell, or Magic Study mechanics;
- no runtime, UI, storage, persistence, reward, event, command, Prestige, family, difficulty, NPC, inventory, map/grid, travel, or gameplay behavior;
- no transition to `0.6.0`.
