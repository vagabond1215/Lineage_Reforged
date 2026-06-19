# Religion System Expansion Research Plan

Version: `0.5.185`
Status: completed documentation-only research integration
Date: 2026-06-19

## 1. Executive Summary

The integrated research supports a Religion architecture that is knowledge-first, authority-layered, descriptive before mechanical, and delivered through narrow sequenced runs.

Religion is not ready for broad runtime, UI, favorability, alignment, law, pilgrimage, worship, services, or Magic Study coupling. Authored identities and relationships must exist and validate before Knowledge can reference them; Knowledge must remain descriptive until explicit runtime owners are separately planned and implemented.

This document integrates the useful findings from the Deep Research report, `Religion System Planning And Expansion For Lineage_Reforged`, as project planning guidance. It creates no live schema, content, validator, snippet, state, behavior, or compatibility requirement and does not replace the more focused sacred-site authority plan.

## 2. Confirmed Current State

- Religion exists as authored world content and active Knowledge domain infrastructure.
- `knowledge_domain.religion` supports direct `religion`, `deity`, and `religious_hotspot` subjects.
- Religion references `world.religions` and `world.religious_hotspots`.
- Religion trial, completion, and visibility policy references remain null.
- Exactly one live hotspot snippet exists: `knowledge_snippet.religion.glasswake_shrine_lantern_gardens.identification`.
- `religious_hotspot.glasswake_shrine_lantern_gardens` is active.
- `religious_hotspot.lantern_shrine_gardens` remains planned without `dominantFaithIds` and unreferenced.
- `sacredSiteType` remains descriptive hotspot metadata only.
- `docs/design/sacred-site-authority-plan.md` selects a future separate named-site authority linked to parent religious hotspots, but no sacred-site collection exists.
- No sacred-site, religious-order, doctrine, rite, taboo, holy-day, religious-text, pilgrimage, favorability, law, worship, conversion, runtime, or UI implementation exists.

## 3. Recommended Layered Model

These are planning recommendations, not live schema or implementation permission.

| Layer | Planned meaning |
| --- | --- |
| `religion` | Broad faith tradition, pantheon, or religious system. |
| `deity` | Named divine figure, aspect, or canonical divine identity. |
| `religious_hotspot` | Broad place-centered concentration of religious significance. |
| `sacred_site` | Future named canonical sacred place linked to a parent hotspot. |
| `religious_order` | Future organized steward, clergy body, monastic order, temple administration, sect, or chapter. |
| `doctrine` | Future normative belief, rule, or interpretive authority. |
| `rite` | Future formal religious practice with authored ownership. |
| `holy_day` | Future calendar observance owned by a religion or order. |
| `taboo` | Future prohibited act, purity boundary, or doctrine-linked restriction. |
| `religious_text` | Future canonical, copied, commentarial, or institutional text authority. |
| `pilgrimage_route` | Future journey authority between explicit anchors and a named sacred-site destination. |

The layered model is additive. A later layer must reference existing canonical owners rather than embed copies or infer relationships from names.

## 4. Critical Distinctions

| Concept | Distinction |
| --- | --- |
| religious hotspot | Broad religious significance around a place; may contain no named sacred site. |
| sacred site | Specifically named canonical place with its own future authority record. |
| settlement/locality anchor | Geographic context only; it does not prove religious identity or sacredness. |
| pilgrimage route | Later authored journey with origin, destination, and route authority; never implied by a site flag. |
| religious-order stewardship | Optional organizational relationship requiring canonical order authority; never inferred from religion or hotspot association. |

Required principles:

- Do not infer a named sacred site from `sacredSiteType: "shrine"`.
- Do not infer pilgrimage from sacred-site or hotspot metadata.
- Do not infer institutional control from religion, deity, place, hotspot, or sacred-site data.
- Do not infer runtime effects from Knowledge snippets or descriptive authority records.

## 5. Future Feature Lanes

| Lane | Purpose | Required prior authority | Safe first step | Non-goals | Primary risk |
| --- | --- | --- | --- | --- | --- |
| Sacred sites | Canonical named sacred-place identity. | Religion, parent hotspot, place anchor. | Complete the sacred-site schema decision. | No pilgrimage, favor, law, or effects. | Treating type metadata as identity. |
| Religious orders | Canonical organization and stewardship identity. | Religion plus organization ownership decision. | Placeholder authority plan. | No membership, ranks, control, or AI. | Conflating organizations with places or factions. |
| Doctrine / rites / taboos | Separate belief, practice, and prohibition authorities. | Religion; order authority where ownership requires it. | Authority-boundary plan defining identity and ownership. | No compliance checks, punishments, buffs, or conversion. | Encoding mechanics inside lore fields. |
| Holy days | Canonical observances tied to the calendar. | Religion/order identity and calendar authority. | Calendar-reference and ownership plan. | No automatic events, attendance, or rewards. | Making every calendar occurrence a runtime event. |
| Religious texts | Canonical texts and copied-document relationships. | Religion/order/doctrine authority; document ownership decision. | Text authority plan aligned with enchanter-authored document boundaries. | No inventory items, reading progress, or automatic Knowledge. | Duplicating item/book authority or granting knowledge by possession. |
| Pilgrimage | Authored journeys to named sacred sites. | Active named site, route/origin authority, travel boundary. | Pilgrimage authority plan after sacred-site identity lands. | No movement, completion, rewards, or favor. | Building travel mechanics from descriptive metadata. |
| Favorability / alignment | Explicit relationship systems for religions/elements. | Stable religion/site/action authorities and relationship-owner plan. | Documentation-only framework plan. | No implicit values from lore or Knowledge. | Collapsing favor, reputation, and elemental alignment. |
| Law / access consequences | Location-specific rules and permissions. | Government/location law authority plus organization and relationship contracts. | Consequence ownership plan. | No enforcement, bans, arrests, or access gates. | Treating religion as globally legal or illegal. |
| Worship / prayer / offerings / donations | Later intentional religious actions. | Religion/site/service authority and command/state ownership. | Action-contract plan after runtime ownership matures. | No passive worship or automatic resource mutation. | Hidden state mutation and economy coupling. |
| Temple services | Authored service catalogs at valid institutions/sites. | Named provider, institution/order authority, economy/service contract. | Service authority plan. | No healing, training, trade, or access behavior. | Using a place label as a service provider. |
| Relics / miracles / omens | Rare authored religious objects and events. | Item/event authority, religion/deity/site identity. | Separate vocabulary and ownership audit. | No buffs, drops, miracles, or event execution. | Unbounded magic and reward expansion. |
| Magic Study interface | Explicit bridge from religious authority to magic-learning prerequisites. | Spell acquisition, Magic Study, doctrine/site/order authority. | Interface plan only after both systems have stable contracts. | No spell grants or readiness from Religion Knowledge. | Bypassing known-spell and Magic Study owners. |
| UI/runtime interface | Project authored data through explicit state and commands. | Mature authority, state, command, event, persistence, and projection contracts. | Candidate-plan audit late in the sequence. | No broad Religion screen or command implementation. | UI becoming the author of domain state. |

## 6. Naming Recommendations

These are future candidates. Existing ids must not be renamed, aliased, or migrated by this planning pass.

| Authority | Candidate convention | Current-data note |
| --- | --- | --- |
| religion | `religion.<slug>` | Matches current authority. |
| deity | `deity.<religion_slug>.<deity_slug>` | Research candidate only; current repo uses flatter ids such as `deity.light_lady`, so continuity should remain flat unless a dedicated current-data decision explicitly changes future records. |
| religious hotspot | `religious_hotspot.<place_or_anchor_slug>` | Matches the current place-oriented posture. |
| sacred site | `sacred_site.<place_or_region_slug>.<site_slug>` | Candidate for the 0.5.186 schema decision; 0.5.184 leaves the exact suffix pattern open. |
| religious order | `religious_order.<religion_or_region_slug>.<order_slug>` | Future organization authority only. |
| doctrine | `doctrine.<religion_or_shared_slug>.<doctrine_slug>` | Future authority only. |
| rite | `rite.<religion_or_order_slug>.<rite_slug>` | Future authority only. |
| holy day | `holy_day.<religion_or_order_slug>.<day_slug>` | Future authority only. |
| religious text | `religious_text.<religion_or_order_slug>.<text_slug>` | Future authority only. |
| taboo | `taboo.<religion_or_shared_slug>.<taboo_slug>` | Future authority only. |
| pilgrimage route | `pilgrimage_route.<origin_or_region_slug>.<destination_site_slug>` | Requires canonical origin and destination authority. |
| Religion snippet | `knowledge_snippet.religion.<subject_slug>.<category>` | Preserve current canonical snippet ids; subject-specific planning must avoid collisions. |

Exact patterns belong to each focused schema decision. No hierarchical naming proposal overrides current-data-first rules or authorizes compatibility aliases.

## 7. Recommended Relationship Map

| Relationship | Future rule |
| --- | --- |
| religion to deity | Explicit canonical membership or association owned by religion authority. |
| religion to hotspot | Explicit association; dominant/tolerated/restricted posture requires its own supported fields. |
| religion to sacred site | Explicit association on canonical site authority. |
| hotspot to sacred site | Sacred site references one canonical parent hotspot; not every hotspot has a site. |
| sacred site to place anchor | Exact supported geographic attachment, coherent with the parent hotspot. |
| sacred site to deity | Optional explicit references only when deity authority proves the relationship. |
| sacred site to religious order | Optional explicit stewardship/control reference only after organization authority exists. |
| religion to doctrine | Explicit ownership or adoption relationship. |
| doctrine to taboo | Explicit normative relationship; no runtime enforcement implied. |
| religion/order to rite | Explicit owner or sponsor relationship. |
| religion/order to holy day | Explicit observance ownership and calendar reference. |
| sacred site to pilgrimage route | Route references a canonical active destination; site metadata does not create a route. |
| Knowledge snippet to subject | Direct canonical subject id resolved through the subject's authority collection. |
| player runtime state to authored world state | Future explicit state, command, event, and persistence layers only; authored content remains immutable authority input. |

## 8. Staged Roadmap

This broad research sequence does not replace the more granular gates in `docs/design/sacred-site-authority-plan.md`. Each step requires its own scoped prompt.

| Step | Purpose | Likely files | Blocked by | Non-goals | Validation strategy | Type |
| --- | --- | --- | --- | --- | --- | --- |
| Sacred Site Authority Schema Decision | Finalize wrapper, record, enums, references, and semantic ownership. | `docs/design/sacred-site-authority-schema-decision.md` plus coordination docs. | 0.5.184 and this integration. | No schema, validator, test, or content. | Docs hygiene, authority parity, decision completeness. | docs-only |
| Sacred Site Content Seed Plan | Select named records and prove source authority before live data. | Future seed plan plus world/religion/place authorities read-only. | Approved schema decision. | No content file or activation. | Draft records checked against planned contract. | docs-only |
| Sacred Site Schema And Validator | Implement strict structural and semantic authority. | `packages/schemas/world/*`, `tools/content-lint/*`, focused tests. | Approved schema decision and seed-plan needs. | No live records or Knowledge support. | Focused schema/validator tests; lint count unchanged until registration is intended. | schema/validator |
| First Sacred Site Content Seed | Add only approved named authority records at planned status. | `packages/content/base/world/sacred_sites.json`, focused registration/test files. | Schema/validator and seed plan. | No Knowledge snippet, pilgrimage, or runtime. | Focused content tests and full content lint. | content-only |
| Sacred Site Knowledge Subject Decision | Decide direct `sacred_site` vocabulary, active policy, and Religion registry posture. | Focused design plan and coordination docs. | Canonical site authority exists. | No schema or live snippet. | Docs audit against live vocabularies. | docs-only |
| Sacred Site Knowledge Subject Support | Add direct schema/validator authority resolution. | Knowledge schemas, validator, focused tests. | Subject decision and canonical site collection. | No site activation or snippet content. | Focused schema, registry, snippet tests and lint. | schema/validator |
| First Sacred Site Knowledge Snippet Seed | Plan and then add one non-duplicative active-site snippet through separately approved narrow gates. | Knowledge snippets, registry only if required, focused tests. | Active canonical site and subject support. | No pilgrimage, effects, policies, or runtime. | Focused snippet/registry tests and content lint. | content-only |
| Religious Order Placeholder Authority Plan | Decide organization identity and references needed by sites and rites. | New design plan and coordination docs. | Stable sacred-site identity; organization questions. | No order records, membership, ranks, or control. | Docs decision audit. | docs-only |
| Religious Order Schema Decision | Finalize order record ownership and relationship boundaries. | New schema-decision doc. | Placeholder authority plan. | No schema, validator, content, faction, or AI. | Docs contract audit. | docs-only |
| Doctrine Rite Taboo Authority Plan | Separate normative beliefs, practices, and prohibitions. | New design plan. | Stable religion and optional order identity. | No compliance or consequences. | Vocabulary, ownership, and cycle audit. | docs-only |
| Pilgrimage Authority Plan | Define route identity and descriptive pilgrimage contracts. | New design plan; site/place/travel authorities read-only. | Named active sites and route/place authority. | No travel, progress, rewards, or favor. | Route/reference decision audit. | docs-only |
| Favorability Alignment Framework Plan | Separate religious favor, elemental alignment, and reputation. | New design plan. | Stable actions and target authorities. | No values, mutation, decay, UI, or effects. | Ownership and invariant review. | docs-only |
| Religion Law And Access Consequence Plan | Assign location/government-specific rule and consequence ownership. | New design plan; future law authority references. | Law/government and organization boundaries. | No enforcement or gates. | Cross-owner decision audit. | docs-only |
| Religion Magic Study Interface Plan | Define explicit read-only prerequisites between Religion authority and Magic Study. | New design plan; Magic Study and known-spell contracts read-only. | Stable doctrine/site/order and Magic Study owners. | No spell grant, readiness, or casting. | Interface and non-coupling audit. | docs-only |
| Religion UI Runtime Candidate Plan | Decide whether enough authority/state contracts exist for a narrow projection. | New candidate plan; runtime/UI contracts read-only. | Prior authority, state, command, event, persistence layers. | No UI or runtime implementation in the plan. | Readiness checklist and blocker audit. | docs-only |

The next numbered run is `Version 0.5.186 - Sacred Site Authority Schema Decision`, documentation-only. The inserted research integration changes the version number, not the 0.5.184 sacred-site decision or its narrow sequencing.

## 9. Research Comparison Summary

- CK3-style lesson: faith identity, doctrines, clergy rules, holy sites, pilgrimage, and head-of-faith structures should remain separate authorities or systems rather than one overloaded religion record.
- RimWorld Ideology-style lesson: belief rules, roles, rituals, relics, and conversion pressure benefit from distinct substructures and ownership boundaries.
- Civilization-style lesson: religion can be gameplay-forward, but city spread, pressure, yields, and similar mechanics are premature until authored authority and runtime ownership layers exist.
- Religious-hotspot research lesson: hotspots are broader and potentially more dynamic than named sacred sites or pilgrimage destinations; they should not be collapsed into one identity.
- Pilgrimage and sacred-place lesson: pilgrimage needs canonical named destinations plus route authority, not a generic hotspot or `pilgrimageStatus` flag.

These are design lessons summarized for this repository, not copied external rules or implementation mandates.

## 10. Guardrails

- Lore and authority records produce no runtime effects.
- Religion snippets do not create worship, prayer, offerings, donations, services, favorability, faction standing, law, conversion, apostasy, pilgrimage rewards, spell access, Magic Study readiness, Prestige, family, NPC, inventory, map/grid, travel, UI, storage, commands, events, or gameplay behavior.
- Descriptive content cannot create player state, access state, relationship state, legal state, or service availability.
- No broad implementation leap may skip authority, schema, validation, content, Knowledge, state, command, event, persistence, and projection boundaries.
- No existing ids are renamed and no compatibility aliases are added.
- The project remains in `v0.5.x`; do not transition to `0.6.0`.

## 11. Non-Goals

- no live content, schema, validator, test, Knowledge snippet, registry, or hotspot changes;
- no sacred-site, order, doctrine, rite, taboo, holy-day, religious-text, pilgrimage-route, or relationship implementation;
- no runtime, UI, storage, gameplay, command, event, reward, pilgrimage, favorability, law, worship, Magic Study, Prestige, family, NPC, inventory, map/grid, or travel behavior.
