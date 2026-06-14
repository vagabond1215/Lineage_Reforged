# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.145 - Knowledge Trial Boundary Plan`
Date: 2026-06-14
Branch/status assumption: `master` at commit `a553226` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-completion-rules-plan.md` owns completion terminology, threshold authority, aggregation, and completion safety.
- `tools/content-lint/knowledge-completion.mjs` owns the implemented pure completion decision.
- `docs/design/knowledge-trial-boundary-plan.md` owns completion-envelope input authority, separate eligibility/readiness phases, trial terminology, isolation rules, inert safety posture, and eligibility-helper acceptance criteria.
- `docs/design/skill-mastery-trial-framework-plan.md` owns the separate Skill Trial and Spell/Magic Study framework posture.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns deferred collection, atomicity, and persistence decisions.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.145 - Knowledge Trial Boundary Plan`

Immediate next version:

- `Version 0.5.146 - Knowledge Trial Eligibility Helper`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.145 Result

- Added `docs/design/knowledge-trial-boundary-plan.md`.
- Defined completion candidate, eligibility candidate, readiness, attempt, checkpoint, outcome, cooldown, reward, and trial envelope terminology.
- Selected separate eligibility and readiness phases.
- Requires exact inert completion envelopes and separate explicit trial policy.
- Defines `eligible_candidate`, `not_eligible`, and `blocked` for the first helper.
- Reserves `ready_candidate`, `not_ready`, and `blocked` for a later readiness helper.
- Keeps owner, domain, tier, and snippet prerequisites exact and isolated.
- Treats attempt, cooldown, and reward policy as inert planned authority only.
- Forbids inference from `trialUnlockWeight`, completion metadata, catalog size, UI/runtime state, Skill Trial metadata, Spell/Magic Study metadata, or Arcane Lore skill references.
- Keeps Arcane Lore planned, blocked, and deferred.
- Added no helper, test, fixture, schema/content/validator edit, registration, trial state or behavior, storage, persistence, UI, runtime, generated output, event, reward, ownership mutation, or gameplay behavior.

## Active Guardrails For Knowledge Trial Eligibility Helper

- Add only a pure deterministic in-memory eligibility helper and focused tests.
- Consume explicit completion envelopes; do not call completion or inspect raw progress.
- Require exact implementation-local eligibility policy.
- Support only `eligible_candidate`, `not_eligible`, and `blocked`.
- Validate every current completion safety flag as `true`.
- Return `not_eligible` for well-formed incomplete, blocked, or mismatched completion inputs.
- Return `blocked` for malformed or unsafe completion envelopes and missing, duplicate, conflicting, malformed, deferred, unresolved, or Arcane Lore policy.
- Keep owner, domain, tier, and snippet prerequisite matching exact.
- Leave readiness, attempt, cooldown, and reward observations inert and not evaluated.
- Do not edit schemas, content JSON, validators, existing Knowledge helpers, fixtures, storage, persistence, normal lint registration, UI, runtime, generated output, events, rewards, ownership, or gameplay behavior.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.

Current follow-up risks:

- No canonical Knowledge trial policy schema, content path, or id pattern exists.
- Completion and eligibility decisions remain in-memory outputs, not persisted state.
- No canonical completion, eligibility, readiness, attempt, checkpoint, outcome, cooldown, or reward collection exists.
- Character owner, sequence, time, storage, persistence, replay, and concurrency authorities remain unresolved.
- Checkpoint scoring, recovery, outcomes, cooldowns, rewards, and runtime integration remain undefined.
- `trialUnlockWeight` has no approved interpretation.
- Arcane Lore remains blocked.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.143` | Knowledge Completion Rules Plan | `docs/design/knowledge-completion-rules-plan.md` | Completed |
| 2 | `0.5.144` | Knowledge Completion Helper | `tools/content-lint/knowledge-completion.mjs` | Completed |
| 3 | `0.5.145` | Knowledge Trial Boundary Plan | `docs/design/knowledge-trial-boundary-plan.md` | Completed |
| 4 | `0.5.146` | Knowledge Trial Eligibility Helper | `docs/design/knowledge-trial-boundary-plan.md` | Next |
| 5 | `0.5.x` | Knowledge Trial Schema Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.146 - Knowledge Trial Eligibility Helper`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-boundary-plan.md`
- `docs/design/knowledge-completion-rules-plan.md`
- `tools/content-lint/knowledge-completion.mjs`
- `tests/unit/knowledge-completion.test.mjs`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/design/knowledge-storage-persistence-boundary-plan.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- related Knowledge helper focused tests
- `docs/future_content_backlog.md`
