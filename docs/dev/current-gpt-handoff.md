# Current GPT Handoff

Source route: Codex local documentation pass after `Version 0.5.172 - Religious Hotspot Content Authority Plan`
Date: 2026-06-16
Branch/status assumption: `master`; worktree was clean before this documentation-only run.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/religion-knowledge-domain-plan.md` owns the broad Religion boundary and hotspot/non-runtime constraints.
- `docs/design/religion-knowledge-vocabulary-validator-plan.md` owns the `religion` and `deity` schema/validator authority decisions.
- `docs/design/religion-knowledge-domain-seed-content-plan.md` owns the exact first Religion seed content plan and activation path.
- `docs/design/religious-hotspot-knowledge-snippet-plan.md` owns the blocked hotspot snippet decision and missing authority list.
- `docs/design/religious-hotspot-content-authority-plan.md` owns the current religious hotspot content-authority recommendation: prefer a separate future `world.religious_hotspots` authored collection, keep it descriptive, defer `world.sacred_sites` as a later specialization, and keep favorability/alignment/consequences separate.
- `packages/content/base/player/knowledge_domain_registry.json` keeps Religion `status: "active"` with null trial, completion, and visibility policy refs.
- `packages/content/base/player/knowledge_snippets.json` contains exactly two Religion snippets: `knowledge_snippet.religion.elemental_pantheon.identification` and `knowledge_snippet.religion.light_lady.identification`.
- `packages/schemas/player/knowledge_snippet.schema.json` and `packages/schemas/player/knowledge-domain-registry.schema.json` include exactly `religion` and `deity` as the first direct Religion subject vocabulary.
- `tools/content-lint/knowledge-snippets.mjs` resolves `world.religions` top-level religion ids and flattened nested deity ids, with duplicate and malformed-id rejection.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.172 - Religious Hotspot Content Authority Plan`

Immediate next:

- `Version 0.5.173 - Religious Hotspot Content Authority Schema Plan`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.172 Result

- Added `docs/design/religious-hotspot-content-authority-plan.md`.
- The pass was documentation-only.
- Preferred future model: add a separate authored `world.religious_hotspots` collection as the umbrella authority between existing place anchors and existing religion/deity/order authority.
- `world.sacred_sites` remains deferred as a possible later specialized collection for richer named-site, relic, route, quest, map, service, or pilgrimage inventory.
- Candidate future hotspot records are future-only sketches anchored on `region.glasswake_quay`, `region_locality.lantern_shrine_gardens`, and `settlement.glasswake_shrine`; they are not live content.
- `knowledge_domain.religion` remains active.
- Exactly two Religion snippets remain live:
  - `knowledge_snippet.religion.elemental_pantheon.identification`
  - `knowledge_snippet.religion.light_lady.identification`
- All Religion policy refs remain null.
- No live snippets, registry content, content JSON, schema, validator, tests, source files, world religion content, region/locality/settlement content, runtime, UI, storage, trial, readiness, reward, event, command, faction, reputation, law, conversion, apostasy, Prestige, family, Magic Study, favorability, elemental alignment, spell penalty, or gameplay behavior changed.
- Religious Favorability And Elemental Alignment remains a separate future design candidate, not part of hotspot authority.
- Knowledge Trial readiness implementation remains deferred.
- Family/heir/recipe/crafting/civil-society/maturation/estate docs remain future roadmap material only.

## Guardrails For 0.5.173

- Plan the `world.religious_hotspots` schema and semantic-validator contract unless the user explicitly redirects.
- Keep `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` null.
- Do not add live hotspot snippets, live hotspot content, or direct `religious_hotspot` snippet subject support until the schema/validator direction is explicit.
- Do not use `custom`, `religion`, `deity`, `region`, settlement, shrine, sacred-site, or institution subjects as a workaround for missing hotspot authority.
- Do not implement `world.sacred_sites` unless the prompt explicitly changes the selected model.
- Do not add favorability, alignment, piety, law, faction, conversion, apostasy, service, spell, Prestige, family, Magic Study, consequence, runtime, UI, storage, reward, event, command, or gameplay behavior.
- Normal content lint should remain `content-lint: ok (56 files checked)` unless a future implementation intentionally adds a checked content file.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Completed |
| 2 | `0.5.172` | Religious Hotspot Content Authority Plan | Completed |
| 3 | `0.5.173` | Religious Hotspot Content Authority Schema Plan | Recommended next |
| 4 | `0.5.174` | Religious Favorability And Elemental Alignment Plan | Optional if prioritized |
| 5 | `0.5.175` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 6 | `0.5.176` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 7 | `0.5.177` | Offspring Growth Role And Activity Build Plan | Recommended |
| 8 | `0.5.178` | Recipe Ownership And Personal Learning Plan | Recommended |
| 9 | `0.5.179` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
