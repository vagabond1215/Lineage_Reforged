# Current GPT Handoff

Source route: Codex local documentation pass after `Version 0.5.173 - Documentation Authority Consolidation And Gap Audit Integration`
Date: 2026-06-16
Branch/status assumption: `master`; worktree was clean before this documentation-only run.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` is durable broad genre/system gap context. It is documentation-only, not a backlog replacement, not runtime authority, and not permission to broaden narrow implementation prompts.
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

- `Version 0.5.173 - Documentation Authority Consolidation And Gap Audit Integration`

Immediate next:

- `Version 0.5.174 - Religious Hotspot Content Authority Schema Plan`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.173 Result

- Integrated `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` into source-map, ledger, roadmap, sequence, backlog, and handoff docs.
- The pass was documentation-only.
- The audit is now recorded as durable design context for broad survival/builder/RPG/MMO gap planning.
- The audit is not a backlog replacement, runtime authority, content authority, schema authority, or implementation handoff.
- The audit identifies later planning lanes such as inventory/storage, survival needs, builder construction, NPC population, factions/institutions, reputation/favorability, quests/contracts, travel/POIs, law/crime, and estate/succession.
- The audit can inform a later `Survival Builder RPG MMO Content Gap Roadmap`.
- The active Religion/hotspot sequence remains intact.
- The previously recommended 0.5.173 hotspot schema-planning label shifted to `Version 0.5.174 - Religious Hotspot Content Authority Schema Plan`.
- `Religious Favorability And Elemental Alignment Plan` shifted to optional `Version 0.5.175` unless explicitly prioritized.
- No source, content JSON, schema, validator, tests, runtime, UI, storage, trial/readiness content, reward, event, command, faction, reputation, law, favorability, alignment, spell, Magic Study, Prestige, family, or gameplay behavior changed.

## Guardrails For 0.5.174

- Plan the `world.religious_hotspots` schema and semantic-validator contract unless the user explicitly redirects.
- Keep `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` null.
- Do not add live hotspot snippets, live hotspot content, or direct `religious_hotspot` snippet subject support until the schema/validator direction is explicit.
- Do not use `custom`, `religion`, `deity`, `region`, settlement, shrine, sacred-site, or institution subjects as a workaround for missing hotspot authority.
- Do not implement `world.sacred_sites` unless the prompt explicitly changes the selected model.
- Do not use the survival/builder/RPG/MMO gap audit to broaden the hotspot schema prompt.
- Do not add favorability, alignment, piety, law, faction, conversion, apostasy, service, spell, Prestige, family, Magic Study, consequence, runtime, UI, storage, reward, event, command, or gameplay behavior.
- Normal content lint should remain `content-lint: ok (56 files checked)` unless a future implementation intentionally adds a checked content file.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Completed |
| 2 | `0.5.172` | Religious Hotspot Content Authority Plan | Completed |
| 3 | `0.5.173` | Documentation Authority Consolidation And Gap Audit Integration | Completed |
| 4 | `0.5.174` | Religious Hotspot Content Authority Schema Plan | Recommended next |
| 5 | `0.5.175` | Religious Favorability And Elemental Alignment Plan | Optional if prioritized |
| 6 | `0.5.176` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 7 | `0.5.177` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 8 | `0.5.178` | Offspring Growth Role And Activity Build Plan | Recommended |
| 9 | `0.5.179` | Recipe Ownership And Personal Learning Plan | Recommended |
| 10 | `0.5.180` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
