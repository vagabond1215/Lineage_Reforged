# Current GPT Handoff

Source route: Codex local documentation pass after `Version 0.5.174 - Religious Hotspot Content Authority Schema Plan`
Date: 2026-06-16
Branch/status assumption: `master`; worktree was clean before this documentation-only run.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/religious-hotspot-content-authority-schema-plan.md` owns the future `world.religious_hotspots` schema and semantic-validator contract.
- `docs/design/religious-hotspot-content-authority-plan.md` owns the selected content-authority model: prefer a separate future `world.religious_hotspots` authored collection, keep it descriptive, defer `world.sacred_sites`, and keep favorability/alignment/consequences separate.
- `docs/design/religious-hotspot-knowledge-snippet-plan.md` owns the blocked hotspot snippet decision and missing authority list.
- `docs/design/religion-knowledge-domain-plan.md` owns the broad Religion boundary and hotspot/non-runtime constraints.
- `docs/design/religion-knowledge-vocabulary-validator-plan.md` owns the `religion` and `deity` schema/validator authority decisions.
- `docs/design/religion-knowledge-domain-seed-content-plan.md` owns the exact first Religion seed content plan and activation path.
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` is durable broad genre/system gap context. It is documentation-only, not a backlog replacement, not runtime authority, and not permission to broaden narrow implementation prompts.
- `packages/content/base/player/knowledge_domain_registry.json` keeps Religion `status: "active"` with null trial, completion, and visibility policy refs.
- `packages/content/base/player/knowledge_snippets.json` contains exactly two Religion snippets: `knowledge_snippet.religion.elemental_pantheon.identification` and `knowledge_snippet.religion.light_lady.identification`.
- `packages/schemas/player/knowledge_snippet.schema.json` and `packages/schemas/player/knowledge-domain-registry.schema.json` include exactly `religion` and `deity` as the first direct Religion subject vocabulary.
- `tools/content-lint/knowledge-snippets.mjs` resolves `world.religions` top-level religion ids and flattened nested deity ids, with duplicate and malformed-id rejection.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.174 - Religious Hotspot Content Authority Schema Plan`

Immediate next:

- `Version 0.5.175 - Religious Hotspot Content Authority Schema And Validator`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.174 Result

- Added `docs/design/religious-hotspot-content-authority-schema-plan.md`.
- Defined future paths for `packages/content/base/world/religious_hotspots.json`, `packages/schemas/world/religious-hotspot.schema.json`, `tools/content-lint/religious-hotspots.mjs`, and `tests/unit/religious-hotspots-validation.test.mjs`.
- Selected the strict `records` wrapper, first-version fields, descriptive enum posture, place-anchor coherence rules, religion/deity reference rules, active-record dominant-faith requirement, and normal lint count policy.
- Kept `religiousOrderIds` deferred unless the future implementation explicitly adds a narrow nested-order resolver.
- Kept normal content lint at the current 56-file baseline until a later seed run adds and registers the live hotspot content file.
- Re-sequenced the immediate next run to schema-and-validator implementation before seed planning, seed content, direct `religious_hotspot` subject support, or hotspot snippets.
- No source, content JSON, schema, validator, tests, runtime, UI, storage, trial/readiness content, reward, event, command, faction, reputation, law, favorability, elemental alignment, conversion, apostasy, spell, Magic Study, Prestige, family, or gameplay behavior changed.

## Guardrails For 0.5.175

- Implement only the `world.religious_hotspots` schema and focused semantic validator unless explicitly redirected.
- Use in-memory focused fixtures first; do not add a live empty content file only to reserve the path.
- Do not register normal lint until live hotspot seed content exists, unless the prompt explicitly changes that acceptance criterion.
- Keep normal content lint at `content-lint: ok (56 files checked)` if no live content file is added.
- Do not add live hotspot seed records, direct `religious_hotspot` Knowledge subject support, live hotspot snippets, or `world.sacred_sites`.
- Do not use `custom`, `religion`, `deity`, `region`, settlement, shrine, sacred-site, or institution subjects as a workaround for missing hotspot subject support.
- Do not add favorability, alignment, piety, law, faction, conversion, apostasy, service, spell, Prestige, family, Magic Study, consequence, runtime, UI, storage, reward, event, command, or gameplay behavior.
- Do not use the survival/builder/RPG/MMO gap audit to broaden the hotspot schema-and-validator run.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Completed |
| 2 | `0.5.172` | Religious Hotspot Content Authority Plan | Completed |
| 3 | `0.5.173` | Documentation Authority Consolidation And Gap Audit Integration | Completed |
| 4 | `0.5.174` | Religious Hotspot Content Authority Schema Plan | Completed |
| 5 | `0.5.175` | Religious Hotspot Content Authority Schema And Validator | Recommended next |
| 6 | `0.5.176` | Religious Hotspot Content Authority Seed Plan | Recommended |
| 7 | `0.5.177` | Religious Hotspot Content Authority Seed | Recommended |
| 8 | `0.5.178` | Religious Hotspot Knowledge Subject Vocabulary Plan | Recommended |
| 9 | `0.5.179` | Religious Hotspot Knowledge Subject Schema And Validator | Recommended |
| 10 | `0.5.180` | Religious Hotspot Knowledge Snippet Seed Plan | Recommended |

Religious Favorability And Elemental Alignment remains optional after the hotspot authority lane or earlier only if explicitly prioritized as design-only work.
