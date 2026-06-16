# Current GPT Handoff

Source route: Codex local documentation pass after `Version 0.5.171 - Religious Hotspot Knowledge Snippet Plan`
Date: 2026-06-16
Branch/status assumption: `master`; worktree was clean before this documentation-only run.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/religion-knowledge-domain-plan.md` owns the broad Religion boundary and hotspot/non-runtime constraints.
- `docs/design/religion-knowledge-vocabulary-validator-plan.md` owns the `religion` and `deity` schema/validator authority decisions.
- `docs/design/religion-knowledge-domain-seed-content-plan.md` owns the exact first Religion seed content plan and activation path.
- `docs/design/religious-hotspot-knowledge-snippet-plan.md` owns the current hotspot snippet readiness decision and future authority requirements.
- `packages/content/base/player/knowledge_domain_registry.json` keeps Religion `status: "active"` with null trial, completion, and visibility policy refs.
- `packages/content/base/player/knowledge_snippets.json` now contains exactly two Religion snippets: `knowledge_snippet.religion.elemental_pantheon.identification` and `knowledge_snippet.religion.light_lady.identification`.
- `packages/schemas/player/knowledge_snippet.schema.json` and `packages/schemas/player/knowledge-domain-registry.schema.json` include exactly `religion` and `deity` as the first direct Religion subject vocabulary.
- `tools/content-lint/knowledge-snippets.mjs` resolves `world.religions` top-level religion ids and flattened nested deity ids, with duplicate and malformed-id rejection.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.171 - Religious Hotspot Knowledge Snippet Plan`

Immediate next:

- `Version 0.5.172 - Religious Hotspot Content Authority Plan`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.171 Result

- Added `docs/design/religious-hotspot-knowledge-snippet-plan.md`.
- The pass was documentation-only.
- Religious Hotspot Knowledge snippets are blocked for now.
- Current source content mentions shrine-related geography, including `region.glasswake_quay`, `region_locality.lantern_shrine_gardens`, and `settlement.glasswake_shrine`, but does not author exact hotspot place identity, exact religion/deity/institution affiliation, dominant or tolerated faith, hotspot strength/severity, mismatch or visitor-risk posture, or a current snippet subject/source authority for settlement, shrine, sacred-site, or hotspot records.
- `knowledge_domain.religion` remains active.
- Exactly two Religion snippets remain live:
  - `knowledge_snippet.religion.elemental_pantheon.identification`
  - `knowledge_snippet.religion.light_lady.identification`
- All Religion policy refs remain null.
- No live snippets, schema, validator, tests, source content, world religion content, region/locality/settlement content, runtime, UI, storage, trial, readiness, reward, event, command, faction, reputation, law, conversion, apostasy, Prestige, family, Magic Study, favorability, elemental alignment, spell penalty, or gameplay behavior changed.
- `Religious Favorability And Elemental Alignment Plan` remains a future design candidate unless prioritized by the project.
- Knowledge Trial readiness implementation remains deferred.
- Family/heir/recipe/crafting/civil-society/maturation/estate docs remain future roadmap material only.

## Guardrails For 0.5.172

- Plan religious hotspot content authority unless the user explicitly redirects.
- Keep `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` null.
- Do not add live hotspot snippets before explicit place/religion affiliation authority exists.
- Do not use `custom`, `religion`, `deity`, or `region` as a workaround for missing place-specific hotspot authority.
- Do not change schemas, validators, trial/readiness content, runtime, UI, storage, rewards, events, commands, faction/reputation/law/conversion behavior, favorability, elemental alignment, spell penalties, Prestige, Magic Study, family, or gameplay unless a future prompt explicitly scopes a separate pass.
- Normal content lint should remain `content-lint: ok (56 files checked)`.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Completed |
| 2 | `0.5.172` | Religious Hotspot Content Authority Plan | Recommended next |
| 3 | `0.5.173` | Religious Favorability And Elemental Alignment Plan | Optional if prioritized |
| 4 | `0.5.174` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 5 | `0.5.175` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 6 | `0.5.176` | Offspring Growth Role And Activity Build Plan | Recommended |
| 7 | `0.5.177` | Recipe Ownership And Personal Learning Plan | Recommended |
| 8 | `0.5.178` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
