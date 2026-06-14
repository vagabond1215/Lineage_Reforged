# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.149 - Knowledge Trial Schema Plan`
Date: 2026-06-14
Branch/status assumption: `master` at commit `4418322` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `tools/content-lint/knowledge-completion.mjs` owns the pure completion decision.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns the current operation-local eligibility contract.
- `tools/content-lint/knowledge-trial-readiness.mjs` owns the current operation-local readiness contract.
- `docs/design/knowledge-trial-schema-plan.md` owns the static-policy schema/content split, proposed fields, path decisions, mutable-state exclusions, validation sequence, and Version 0.5.150 acceptance criteria.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns deferred state, sequence, atomicity, and persistence decisions.
- `docs/design/skill-mastery-trial-framework-plan.md` owns the separate Skill Trial and Spell/Magic Study posture.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.149 - Knowledge Trial Schema Plan`

Immediate next version:

- `Version 0.5.150 - Knowledge Trial Static Policy Schema`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.149 Result

- Added `docs/design/knowledge-trial-schema-plan.md`.
- Selected `packages/schemas/player/knowledge_trial_policy.schema.json` as the first static eligibility-policy record schema.
- Kept concrete `ownerId` out of authored policy; owner ids remain operation inputs for a later adapter.
- Removed operation-only status placeholders from the proposed authored policy shape.
- Defined exact domain/tier and snippet/tier/domain completion requirement variants.
- Recommended split future content paths for eligibility and readiness policy.
- Rejected `packages/content/base/player/trials.json` as the Knowledge policy authority because it mixes trial families and embeds state-like fields.
- Deferred readiness schema until attempt lifecycle and status vocabulary are canonical.
- Kept attempts, cooldowns, availability facts, sequence/time snapshots, envelopes, checkpoints, outcomes, rewards, state, storage, runtime, and UI outside authored policy.
- Added no schema, content, validator, helper, test, fixture, registration, state, or behavior.

## Active Guardrails For Static Policy Schema

- Add only `packages/schemas/player/knowledge_trial_policy.schema.json` and focused schema-file/contract coverage required by repository convention.
- Implement a strict record-level schema, not a wrapper or content collection.
- Require static eligibility-policy fields only.
- Use `knowledge_trial_policy.*`, `knowledge_domain.*`, and exact `knowledge_snippet.*` patterns.
- Require `ownerScope: "character"` and reject concrete `ownerId`.
- Require exact domain/tier conditional shapes.
- Require exact snippet/tier/domain completion requirement variants with `requiredDecision: "candidate"`.
- Permit nullable inert `readinessPolicyId`, unique inert `rewardRefs`, and strict notes.
- Reject operation-envelope fields, mutable state, attempts, cooldowns, availability facts, sequence/time snapshots, checkpoints, outcomes, UI, runtime, events, persistence, Skill Trial, and Spell/Magic Study fields.
- Do not add content JSON, semantic validators, helper adapters, fixtures, or normal content-lint registration.
- Do not edit current completion, eligibility, or readiness helpers.
- Keep Arcane Lore blocked at the later semantic layer; do not add active Arcane policy content.

Current follow-up risks:

- No canonical policy content exists.
- Readiness schema remains deferred.
- Attempt lifecycle/status vocabulary is not canonical.
- Prerequisite readiness gates remain empty-only in the current helper.
- Mutable authority and persistence ownership remain undefined.
- Current snippet completion envelopes do not carry tier.
- `trialUnlockWeight` remains uninterpreted.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.147` | Knowledge Trial Readiness Boundary Plan | `docs/design/knowledge-trial-readiness-boundary-plan.md` | Completed |
| 2 | `0.5.148` | Knowledge Trial Readiness Helper | `tools/content-lint/knowledge-trial-readiness.mjs` | Completed |
| 3 | `0.5.149` | Knowledge Trial Schema Plan | `docs/design/knowledge-trial-schema-plan.md` | Completed |
| 4 | `0.5.150` | Knowledge Trial Static Policy Schema | `docs/design/knowledge-trial-schema-plan.md` | Next |
| 5 | `0.5.x` | Knowledge Trial Authored Policy Content | Future focused run | Deferred |
| 6 | `0.5.x` | Knowledge Trial Readiness Policy Schema | Future focused run | Deferred |

## Next Prompt Source Stack

For `Version 0.5.150 - Knowledge Trial Static Policy Schema`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-schema-plan.md`
- `docs/design/knowledge-trial-boundary-plan.md`
- `tools/content-lint/knowledge-trial-eligibility.mjs`
- `tests/unit/knowledge-trial-eligibility.test.mjs`
- `packages/schemas/player/knowledge-domain-registry.schema.json`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `tests/unit/schema-files.test.mjs`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/future_content_backlog.md`
