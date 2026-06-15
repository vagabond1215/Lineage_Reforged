# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.168 - Religion Knowledge Schema And Validator Vocabulary`
Date: 2026-06-15
Branch/status assumption: `master` with local 0.5.168 edits after clean start at `2f07904`.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/religion-knowledge-domain-plan.md` owns the broad Religion boundary and hotspot/non-runtime constraints.
- `docs/design/religion-knowledge-vocabulary-validator-plan.md` owns the first direct subject set, schema posture, resolver rules, tests, activation boundary, and 0.5.168 acceptance criteria.
- `packages/schemas/player/knowledge_snippet.schema.json` and `packages/schemas/player/knowledge-domain-registry.schema.json` now include exactly `religion` and `deity` as the first direct Religion subject vocabulary.
- `packages/content/base/player/knowledge_domain_registry.json` keeps Religion `status: "planned"` with null trial, completion, and visibility policy refs.
- `tools/content-lint/knowledge-snippets.mjs` now has duplicate-aware canonical subject authority validation; normal lint loads `world.religions` for top-level religion records and flattened nested deity records.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.168 - Religion Knowledge Schema And Validator Vocabulary`

Immediate next:

- `Version 0.5.169 - Religion Knowledge Domain Seed Content Plan`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.168 Result

- Added exactly `religion` and `deity` to the snippet and registry subject schemas.
- Aligned planned Religion registry metadata to list `religion` and `deity` as direct subjects.
- Preserved the active-domain gate, so live Religion snippets remain blocked until a later activation/seed pass.
- Added normal-lint subject authority for `world.religions` top-level religion ids and flattened nested deity ids.
- Added duplicate and malformed canonical-id rejection for subject authority records.
- Added focused schema, registry, and snippet validation tests for the new vocabulary and authority behavior.
- Added no Religion snippets, hotspot content, world religion content, trial/readiness policy, runtime, UI, storage, persistence, reward, event, command, ownership, faction, law, conversion, Magic Study, family, Prestige, or gameplay behavior.

## Guardrails For 0.5.169

- Plan the first Religion seed content before implementation.
- Keep Religion snippets narrow to the approved `religion` and `deity` authorities unless the new plan explicitly changes that.
- Do not add orders, doctrine, rites, holy days, shrines, sacred sites, hotspots, general blocked-subject enablement, favorability/alignment mechanics, runtime behavior, UI, storage, or gameplay.
- Treat `Religious Favorability And Elemental Alignment Plan` as a future design candidate after the immediate Religion Knowledge seed path, not as permission for this next seed-planning run.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.169` | Religion Knowledge Domain Seed Content Plan | Next |
| 2 | `0.5.170` | Religion Knowledge Domain Seed | Recommended |
| 3 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 4 | `0.5.172` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 5 | `0.5.173` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 6 | `0.5.174` | Offspring Growth Role And Activity Build Plan | Recommended |
| 7 | `0.5.175` | Recipe Ownership And Personal Learning Plan | Recommended |
| 8 | `0.5.176` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
