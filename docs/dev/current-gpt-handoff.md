# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.148 - Knowledge Trial Readiness Helper`
Date: 2026-06-14
Branch/status assumption: `master` at commit `9d4743e` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `tools/content-lint/knowledge-completion.mjs` owns the pure completion decision.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns the pure eligibility decision and exact eligibility envelope.
- `docs/design/knowledge-trial-readiness-boundary-plan.md` owns readiness terminology, authority boundaries, decisions, and downstream exclusions.
- `tools/content-lint/knowledge-trial-readiness.mjs` owns the implemented pure readiness decision over one exact eligibility envelope and explicit operation-local authorities.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns deferred collection, atomicity, and persistence decisions.
- `docs/design/skill-mastery-trial-framework-plan.md` owns the separate Skill Trial and Spell/Magic Study posture.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.148 - Knowledge Trial Readiness Helper`

Immediate next version:

- `Version 0.5.149 - Knowledge Trial Schema Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.148 Result

- Added `evaluateKnowledgeTrialReadiness(...)` as a pure deterministic in-memory helper.
- Consumes one exact current eligibility envelope without calling eligibility or completion.
- Requires exact character owner, readiness policy, eligibility policy, domain, and optional tier parity.
- Supports explicit attempt-limit, cooldown, availability, and sequence/time gates.
- Returns only `ready_candidate`, `not_ready`, or `blocked`.
- Missing/deferred policy and safe unsatisfied gates return `not_ready`.
- Malformed, ambiguous, cross-scope, unsupported, unresolved, or Arcane Lore authority returns `blocked`.
- Reward references remain inert metadata.
- Non-empty prerequisite readiness gates remain unsupported and fail closed.
- Added 83 focused tests including purity, registration, fixture, determinism, and immutability audits.
- Added no schema, content JSON, validator edit, registration, state, persistence, attempt creation, checkpoint/outcome resolution, cooldown mutation, reward grant, UI, runtime, event, or gameplay behavior.

## Active Guardrails For Knowledge Trial Schema Plan

- Plan schema and authored authority only; do not implement a schema or content file unless separately authorized.
- Reconcile the operation-local readiness policy, attempt, cooldown, availability, and sequence/time shapes before selecting canonical ownership.
- Keep eligibility and readiness envelopes as read-only decisions, not persisted state.
- Do not treat `ready_candidate` as attempt permission or create/reserve an attempt.
- Do not add checkpoint, outcome, cooldown mutation, reward, unlock, storage, persistence, save/account/session/database, UI, runtime, generated output, event, ownership mutation, or gameplay behavior.
- Preserve exact character owner and domain/tier isolation.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.
- Keep Arcane Lore blocked and deferred.
- Do not register operation inputs or mutable state in normal authored-content lint without a separate ownership decision.
- Do not edit current completion, eligibility, or readiness helpers during the schema-plan run.

Current follow-up risks:

- No canonical trial policy, attempt, cooldown, availability, or sequence/time schema/content authority exists.
- Attempt lifecycle and status vocabulary remain implementation-local.
- Idempotency, replay, concurrency, reservation, persistence, and atomicity remain undefined.
- Prerequisite readiness gates, checkpoints, outcomes, rewards, storage, runtime, UI, and events remain deferred.
- `trialUnlockWeight` has no approved interpretation.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.146` | Knowledge Trial Eligibility Helper | `tools/content-lint/knowledge-trial-eligibility.mjs` | Completed |
| 2 | `0.5.147` | Knowledge Trial Readiness Boundary Plan | `docs/design/knowledge-trial-readiness-boundary-plan.md` | Completed |
| 3 | `0.5.148` | Knowledge Trial Readiness Helper | `tools/content-lint/knowledge-trial-readiness.mjs` | Completed |
| 4 | `0.5.149` | Knowledge Trial Schema Plan | Current helper and trial boundary sources | Next |
| 5 | `0.5.x` | Knowledge Trial Checkpoint Helper | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.149 - Knowledge Trial Schema Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-boundary-plan.md`
- `docs/design/knowledge-trial-readiness-boundary-plan.md`
- `tools/content-lint/knowledge-trial-eligibility.mjs`
- `tools/content-lint/knowledge-trial-readiness.mjs`
- `tests/unit/knowledge-trial-eligibility.test.mjs`
- `tests/unit/knowledge-trial-readiness.test.mjs`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/design/knowledge-storage-persistence-boundary-plan.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `docs/future_content_backlog.md`
