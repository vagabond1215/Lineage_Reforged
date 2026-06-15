# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.160 - Knowledge Trial Readiness Policy Schema Plan`
Date: 2026-06-15
Branch/status assumption: clean `master` at commit `ff6c9e8` before edits, aligned with `origin/master`.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/knowledge-trial-readiness-policy-schema-plan.md` owns the selected readiness schema shape, exclusions, validation boundaries, candidate, and future sequence.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- Current eligibility schema/content and registry alignment remain unchanged authorities.
- `tools/content-lint/knowledge-trial-readiness.mjs` remains an explicit-input helper, not authored content, storage, or runtime authority.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.160 - Knowledge Trial Readiness Policy Schema Plan`

Immediate next:

- `Version 0.5.161 - Knowledge Trial Readiness Policy Schema`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.160 Decision

- Use `packages/schemas/player/knowledge_trial_readiness_policy.schema.json` as the future strict record-level schema.
- Use `packages/content/base/player/knowledge_trial_readiness_policies.json` as the later separate content wrapper.
- Require one `readinessPolicyId`, one singular `trialPolicyId`, character owner scope without `ownerId`, exact domain/scope/tier, `eligible_candidate`, always-only availability, empty prerequisite gates, and notes.
- Do not include slug, raw completion/evidence/progress/known-snippet state, source families, authored blocker outcomes, rewards, attempts, cooldowns, sequence/time, checkpoints, outcomes, runtime, UI, storage, persistence, events, or gameplay fields.
- Select a minimal but meaningful future Flora Tier 1 candidate linked to `knowledge_trial_policy.flora_tier_1`.
- Implement the schema before Ecology planning; Ecology shifts to `0.5.162`.

## Guardrails For 0.5.161

- Add only the readiness-policy record schema and focused schema-file contract coverage.
- Do not add readiness content, semantic validator, normal content-lint registration, or a non-null eligibility-policy `readinessPolicyId`.
- Do not edit the registry, eligibility policy content, snippets, existing validators, or helpers.
- Keep normal content lint at 56 checked files.
- Do not add an adapter or let helpers read content directly.
- Add no attempt, checkpoint, outcome, cooldown, reward, unlock, mutable state, storage, persistence, UI, runtime, generated output, command, event, ownership mutation, or gameplay behavior.
- Keep Arcane Lore blocked and keep Knowledge, Skill Trial, and Spell/Magic Study readiness separate.
- Do not absorb family, heir, religion, ecology, recipe, crafting, civil-society, maturation, or estate implementation.

## Near-Term Sequence

This ordering is recommended direction, not implementation lock-in:

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.161` | Knowledge Trial Readiness Policy Schema | Next |
| 2 | `0.5.162` | Ecology Knowledge Domain Plan | Recommended |
| 3 | `0.5.163` | Ecology Knowledge Domain Seed Content Plan | Recommended |
| 4 | `0.5.164` | Religion Knowledge Domain Plan | Recommended |
| 5 | `0.5.165` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 6 | `0.5.166` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 7 | `0.5.167` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 8 | `0.5.168` | Offspring Growth Role And Activity Build Plan | Recommended |
| 9 | `0.5.169` | Recipe Ownership And Personal Learning Plan | Recommended |
| 10 | `0.5.170` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
