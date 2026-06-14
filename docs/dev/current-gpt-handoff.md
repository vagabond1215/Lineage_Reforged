# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.155 - Knowledge Trial Policy Normal Lint Registration Plan`
Date: 2026-06-14
Branch/status assumption: `master` at commit `3fc0eed` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md` owns exact future index registration, dependency loading, 55-to-56 checked-file accounting, failure propagation, focused test updates, and `0.5.156` acceptance criteria.
- `tools/content-lint/index.mjs` owns normal content-lint orchestration and remains unchanged in `0.5.155`.
- `tools/content-lint/knowledge-trial-policies.mjs` owns current pure semantic validation and must remain file-I/O-free.
- `tests/unit/knowledge-trial-policies-validation.test.mjs` owns focused validator coverage.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns static policy record structure.
- `packages/content/base/player/knowledge_trial_policies.json` owns the exact one-record Flora Tier 1 policy wrapper.
- `packages/content/base/player/knowledge_domain_registry.json` owns domain status and nullable trial-policy references.
- `packages/content/base/player/knowledge_snippets.json` owns the current authored snippet inventory.
- `docs/design/knowledge-trial-policy-semantic-validator-plan.md` remains the validator semantic-rule source.
- `docs/design/knowledge-trial-schema-plan.md` owns the broader policy/content split, mutable-state exclusions, and deferred readiness posture.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.155 - Knowledge Trial Policy Normal Lint Registration Plan`

Immediate next version:

- `Version 0.5.156 - Knowledge Trial Policy Normal Lint Registration`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.155 Result

- Added `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md`.
- Selected a conservative one-step registration in `tools/content-lint/index.mjs`.
- Selected exact explicit loads for policy content, policy schema, registry, and snippets.
- Preserved the validator's current explicit five-argument contract and file-I/O-free boundary.
- Selected invocation after existing registry and snippet semantic validation.
- Chose `knowledge_trial_policies.json` as one new checked file.
- Froze the expected normal lint count change from 55 to 56.
- Kept the policy schema dependency-only and avoided recounting registry/snippets.
- Defined top-level failure propagation and focused test updates.
- Changed no index, validator, schema, content, registry, snippet, test, fixture, helper, adapter, readiness policy, runtime, storage, UI, reward, event, ownership, or gameplay behavior.

## Active Guardrails For 0.5.156

- Register the existing validator; do not rewrite it.
- Add the exact import from `./knowledge-trial-policies.mjs`.
- Add `knowledge_trial_policies.json` exactly once to `checks`.
- Load and parse the policy wrapper, policy schema, domain registry, and snippets only in index orchestration.
- Await policy validation after existing registry and snippet validators and before the success log.
- Preserve current top-level `content-lint: failed` handling.
- Expect successful normal lint output to change from 55 to 56 files checked.
- Replace tests that currently assert the policy is unregistered.
- Keep existing registry and snippet semantic validation active.
- Keep all registry `trialPolicyRef` values null.
- Keep policy content, schema, registry, snippets, and Knowledge helpers unchanged.
- Do not add a content-to-helper adapter, readiness policy, state, storage, persistence, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.
- Keep Arcane Lore planned, blocked, and deferred.

Current follow-up risks:

- No content-to-helper adapter exists.
- Canonical completion-policy content does not exist.
- Readiness schema/content remains deferred.
- Current Flora Tier 1 has one authored counting snippet.
- Registry alignment remains a later separately authorized run.
- Reward references remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.
- Mutable authority and persistence remain undefined.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.152` | Knowledge Trial Authored Policy Content Skeleton | `packages/content/base/player/knowledge_trial_policies.json` | Completed |
| 2 | `0.5.153` | Knowledge Trial Policy Semantic Validator Plan | `docs/design/knowledge-trial-policy-semantic-validator-plan.md` | Completed |
| 3 | `0.5.154` | Knowledge Trial Policy Semantic Validator | `tools/content-lint/knowledge-trial-policies.mjs` | Completed |
| 4 | `0.5.155` | Knowledge Trial Policy Normal Lint Registration Plan | `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md` | Completed |
| 5 | `0.5.156` | Knowledge Trial Policy Normal Lint Registration | `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md` | Next |
| 6 | `0.5.x` | Knowledge Trial Registry Reference Alignment | Future focused plan/run | Deferred |
| 7 | `0.5.x` | Knowledge Trial Readiness Policy Schema | Future focused plan/run | Deferred |

## Next Prompt Source Stack

For `Version 0.5.156 - Knowledge Trial Policy Normal Lint Registration`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md`
- `docs/design/knowledge-trial-policy-semantic-validator-plan.md`
- `packages/schemas/player/knowledge_trial_policy.schema.json`
- `packages/content/base/player/knowledge_trial_policies.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_snippets.json`
- `tools/content-lint/knowledge-domain-registry.mjs`
- `tools/content-lint/knowledge-snippets.mjs`
- `tools/content-lint/knowledge-trial-policies.mjs`
- `tools/content-lint/index.mjs`
- `tests/unit/knowledge-domain-registry-validation.test.mjs`
- `tests/unit/knowledge-snippets-validation.test.mjs`
- `tests/unit/knowledge-trial-policies-validation.test.mjs`
- `tests/unit/schema-files.test.mjs`
- `tests/integration/tool-surfaces.test.mjs`
- `docs/future_content_backlog.md`
