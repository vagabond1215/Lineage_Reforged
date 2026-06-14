# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.152 - Knowledge Trial Authored Policy Content Skeleton`
Date: 2026-06-14
Branch/status assumption: `master` at commit `c8cea14` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns the strict structure of one static authored Knowledge trial eligibility policy.
- `packages/content/base/player/knowledge_trial_policies.json` owns the current exact one-record authored Flora Tier 1 eligibility-policy skeleton.
- `docs/design/knowledge-trial-policy-content-plan.md` owns the first content path, wrapper shape, selected one-record Flora Tier 1 slice, registry-null posture, semantic-validation sequence, and Version 0.5.152 acceptance criteria.
- `docs/design/knowledge-trial-schema-plan.md` owns the broader policy/content split, mutable-state exclusions, and deferred readiness posture.
- `tools/content-lint/knowledge-completion.mjs` owns current pure completion decisions.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns current operation-local eligibility evaluation.
- `tools/content-lint/knowledge-trial-readiness.mjs` owns current operation-local readiness evaluation.
- `packages/content/base/player/knowledge_domain_registry.json` owns domain status and nullable trial-policy references.
- `packages/content/base/player/knowledge_snippets.json` owns the current authored snippet inventory.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.152 - Knowledge Trial Authored Policy Content Skeleton`

Immediate next version:

- `Version 0.5.153 - Knowledge Trial Policy Semantic Validator Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.152 Result

- Added `packages/content/base/player/knowledge_trial_policies.json` with exactly one `records` entry.
- Added active character-scoped, tier-scoped `knowledge_trial_policy.flora_tier_1`.
- Required exactly one Flora Tier 1 completion target with `requiredDecision: "candidate"`.
- Kept prerequisite targets empty, `readinessPolicyId` null, and `rewardRefs` empty.
- Preserved the selected two inert notes.
- Added focused structural coverage in `tests/unit/schema-files.test.mjs`.
- Verified exact record parity, schema compliance, excluded behavior fields, registry-null posture, and no normal content-lint registration.
- Kept every registry `trialPolicyRef` null.
- Added no semantic validator, helper adapter, readiness content, fixture, runtime, state, storage, persistence, UI, event, reward, ownership mutation, or gameplay behavior.

## Active Guardrails For Semantic Validator Planning

- Plan semantic validation only; do not implement the validator in Version 0.5.153.
- Treat the existing schema as structural authority and the new policy file as authored content input.
- Define exact wrapper, duplicate identity, active-domain, scope/domain/tier, completion-target, prerequisite-target, readiness-reference, reward-reference, and registry-null checks.
- Keep schema validation ahead of semantic validation.
- Preserve the exact one-record Flora Tier 1 content unchanged.
- Keep all registry `trialPolicyRef` values null until a later separately authorized alignment run.
- Keep Fauna, Minerals, General Lore, and Arcane Lore policy content deferred.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.
- Do not add adapters, readiness content, mutable authority, storage, persistence, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior.

Current follow-up risks:

- No semantic validator or content-to-helper adapter exists.
- Canonical completion-policy content does not exist.
- Readiness schema/content remains deferred.
- Current Flora Tier 1 has one authored counting snippet.
- Registry alignment requires a later separately authorized run.
- `trialUnlockWeight` remains uninterpreted.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.150` | Knowledge Trial Static Policy Schema | `packages/schemas/player/knowledge_trial_policy.schema.json` | Completed |
| 2 | `0.5.151` | Knowledge Trial Policy Content Plan | `docs/design/knowledge-trial-policy-content-plan.md` | Completed |
| 3 | `0.5.152` | Knowledge Trial Authored Policy Content Skeleton | `packages/content/base/player/knowledge_trial_policies.json` | Completed |
| 4 | `0.5.153` | Knowledge Trial Policy Semantic Validator Plan | Future focused design doc | Next |
| 5 | `0.5.x` | Knowledge Trial Policy Semantic Validator | Future focused run | Deferred |
| 6 | `0.5.x` | Knowledge Trial Registry Reference Alignment | Future focused run | Deferred |
| 7 | `0.5.x` | Knowledge Trial Readiness Policy Schema | Future focused run | Deferred |

## Next Prompt Source Stack

For `Version 0.5.153 - Knowledge Trial Policy Semantic Validator Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-policy-content-plan.md`
- `docs/design/knowledge-trial-schema-plan.md`
- `packages/schemas/player/knowledge_trial_policy.schema.json`
- `packages/content/base/player/knowledge_trial_policies.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_snippets.json`
- `tools/content-lint/knowledge-domains.mjs`
- `tools/content-lint/knowledge-snippets.mjs`
- `tools/content-lint/index.mjs`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
