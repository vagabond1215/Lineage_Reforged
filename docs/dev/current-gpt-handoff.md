# Current GPT Handoff

Source route: Codex local documentation pass after `Version 0.5.176 - Religious Hotspot Content Authority Seed Plan`
Date: 2026-06-16
Branch/status assumption: `master`; worktree was clean before this documentation run.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/religious-hotspot-content-authority-seed-plan.md` owns the selected first future hotspot seed records and validation/registration plan.
- `packages/schemas/world/religious-hotspot.schema.json` is the current structural schema for future religious hotspot content wrappers and records.
- `tools/content-lint/religious-hotspots.mjs` is the current pure focused semantic validator for in-memory religious hotspot fixtures. It is not registered in normal content lint yet.
- `tests/unit/religious-hotspots-validation.test.mjs` owns focused coverage for the hotspot schema/validator boundary.
- `docs/design/religious-hotspot-content-authority-schema-plan.md` owns the original schema and validator contract.
- `docs/design/religious-hotspot-content-authority-plan.md` owns the selected content-authority model: prefer a separate future `world.religious_hotspots` authored collection, keep it descriptive, defer `world.sacred_sites`, and keep favorability/alignment/consequences separate.
- `docs/design/religious-hotspot-knowledge-snippet-plan.md` owns the blocked hotspot snippet decision and missing authority list.
- `docs/design/religion-knowledge-domain-plan.md`, `docs/design/religion-knowledge-vocabulary-validator-plan.md`, and `docs/design/religion-knowledge-domain-seed-content-plan.md` own the Religion Knowledge domain, `religion`/`deity` vocabulary, and first two live Religion snippets.
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` is durable broad genre/system gap context. It is documentation-only, not a backlog replacement, not runtime authority, and not permission to broaden narrow implementation prompts.
- `packages/content/base/player/knowledge_domain_registry.json` keeps Religion `status: "active"` with null trial, completion, and visibility policy refs.
- `packages/content/base/player/knowledge_snippets.json` contains exactly two Religion snippets: `knowledge_snippet.religion.elemental_pantheon.identification` and `knowledge_snippet.religion.light_lady.identification`.
- `packages/schemas/player/knowledge_snippet.schema.json` and `packages/schemas/player/knowledge-domain-registry.schema.json` include exactly `religion` and `deity` as the first direct Religion subject vocabulary.
- `tools/content-lint/knowledge-snippets.mjs` resolves `world.religions` top-level religion records and flattened nested deity records, with duplicate and malformed-id rejection.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.176 - Religious Hotspot Content Authority Seed Plan`

Immediate next:

- `Version 0.5.177 - Religious Hotspot Content Authority Seed`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.176 Result

- Added `docs/design/religious-hotspot-content-authority-seed-plan.md`.
- Selected exactly two future `planned` seed records if both validate unchanged:
  - `religious_hotspot.glasswake_shrine_lantern_gardens`
  - `religious_hotspot.lantern_shrine_gardens`
- Recommended seeding only `religious_hotspot.glasswake_shrine_lantern_gardens` if the locality-scale record becomes ambiguous or fails validation.
- Recommended omitting `deityIds`, `dominantFaithIds`, `toleratedFaithIds`, `restrictedFaithIds`, and `religiousOrderIds` from the first seed records.
- Defined future normal-lint registration: add `packages/content/base/world/religious_hotspots.json`, register it in `tools/content-lint/index.mjs`, load schema/religions/regions/localities/settlements, invoke `validateReligiousHotspots`, and move normal lint from 56 to 57 checked files.
- No live `packages/content/base/world/religious_hotspots.json` file was created.
- No normal content-lint registration was added.
- Normal content lint remains `content-lint: ok (56 files checked)`.
- No source, content JSON, schema, validator, test, Knowledge subject support, snippet, `world.sacred_sites`, runtime, UI, storage, trial/readiness content, reward, event, command, faction, reputation, law, favorability, elemental alignment, conversion, apostasy, spell, Magic Study, Prestige, family, or gameplay behavior changed.

## Guardrails For 0.5.177

- Implement the selected hotspot seed content only if the prompt explicitly asks for `Version 0.5.177 - Religious Hotspot Content Authority Seed`.
- Add live `packages/content/base/world/religious_hotspots.json` with the selected planned records.
- Register the new content file in normal content lint and move the checked-file count from 56 to 57.
- Use the existing schema and `validateReligiousHotspots`; do not change them unless validation exposes a narrow defect.
- Keep records `planned` unless a future prompt explicitly proves active-record requirements are safe.
- Do not add direct `religious_hotspot` Knowledge subject support or live hotspot snippets in the seed implementation.
- Do not add `world.sacred_sites`.
- Do not add `religiousOrderIds` unless a future prompt explicitly scopes the nested-order resolver decision.
- Do not add favorability, alignment, piety, law, faction, conversion, apostasy, service, spell, Prestige, family, Magic Study, consequence, runtime, UI, storage, reward, event, command, or gameplay behavior.
- Do not use the survival/builder/RPG/MMO gap audit to broaden the hotspot seed run.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Completed |
| 2 | `0.5.172` | Religious Hotspot Content Authority Plan | Completed |
| 3 | `0.5.173` | Documentation Authority Consolidation And Gap Audit Integration | Completed |
| 4 | `0.5.174` | Religious Hotspot Content Authority Schema Plan | Completed |
| 5 | `0.5.175` | Religious Hotspot Content Authority Schema And Validator | Completed |
| 6 | `0.5.176` | Religious Hotspot Content Authority Seed Plan | Completed |
| 7 | `0.5.177` | Religious Hotspot Content Authority Seed | Recommended next |
| 8 | `0.5.178` | Religious Hotspot Knowledge Subject Vocabulary Plan | Recommended |
| 9 | `0.5.179` | Religious Hotspot Knowledge Subject Schema And Validator | Recommended |
| 10 | `0.5.180` | Religious Hotspot Knowledge Snippet Seed Plan | Recommended |

Religious Favorability And Elemental Alignment remains optional after the hotspot authority lane or earlier only if explicitly prioritized as design-only work.
