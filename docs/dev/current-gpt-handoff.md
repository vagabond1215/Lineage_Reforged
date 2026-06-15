# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.161 - Knowledge Trial Readiness Policy Schema`
Date: 2026-06-15
Branch/status assumption: clean `master` at commit `c8e73bb` before edits, aligned with `origin/master`.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `packages/schemas/player/knowledge_trial_readiness_policy.schema.json` owns the strict readiness-policy record structure.
- `docs/design/knowledge-trial-readiness-policy-schema-plan.md` retains downstream content, validator, reference-alignment, and adapter boundaries.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.161 - Knowledge Trial Readiness Policy Schema`

Immediate next:

- `Version 0.5.162 - Ecology Knowledge Domain Plan`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.161 Result

- Added only the strict record-level readiness-policy schema and focused schema-file tests.
- Enforced character owner scope, singular eligibility linkage, exact domain/tier branches, `eligible_candidate`, always-only availability, empty prerequisite gates, and unique non-empty notes.
- Rejected mutable owner ids, raw state authority, lifecycle fields, rewards, helpers, adapters, runtime, UI, storage, persistence, events, commands, and gameplay fields.
- Added no readiness content, semantic validator, normal-lint registration, reference alignment, helper, adapter, fixture, or runtime behavior.
- Normal content lint remains `content-lint: ok (56 files checked)`.
- Registry alignment remains content-lint authority only and Knowledge trials remain non-runnable.

## Guardrails For 0.5.162

- Keep Ecology work documentation-only.
- Do not add Ecology registry content, snippets, schema changes, validators, runtime loading, evidence, progress, trials, UI, storage, persistence, events, or gameplay behavior.
- Do not absorb readiness content or downstream readiness implementation.
- Keep Arcane Lore blocked and keep Knowledge, Skill Trial, and Spell/Magic Study readiness separate.
- Family, religion, ecology, recipe, crafting, civil-society, maturation, and estate source documents remain future roadmap material until explicitly scoped.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.162` | Ecology Knowledge Domain Plan | Next |
| 2 | `0.5.163` | Ecology Knowledge Domain Seed Content Plan | Recommended |
| 3 | `0.5.164` | Religion Knowledge Domain Plan | Recommended |
| 4 | `0.5.165` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 5 | `0.5.166` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 6 | `0.5.167` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 7 | `0.5.168` | Offspring Growth Role And Activity Build Plan | Recommended |
| 8 | `0.5.169` | Recipe Ownership And Personal Learning Plan | Recommended |
| 9 | `0.5.170` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
