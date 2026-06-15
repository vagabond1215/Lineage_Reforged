# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.156 - Knowledge Trial Policy Normal Lint Registration`
Date: 2026-06-15
Branch/status assumption: `master` at commit `8982c79` before edits; the worktree was clean and the branch was five commits behind `origin/master`.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `tools/content-lint/index.mjs` now owns normal Knowledge trial policy loading and orchestration.
- `tools/content-lint/knowledge-trial-policies.mjs` remains the unchanged pure semantic validator and performs no file I/O.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns static policy record structure.
- `packages/content/base/player/knowledge_trial_policies.json` owns the exact one-record Flora Tier 1 policy wrapper.
- `packages/content/base/player/knowledge_domain_registry.json` owns domain status and nullable trial-policy references.
- `packages/content/base/player/knowledge_snippets.json` owns the current authored snippet inventory.
- `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md` remains the consumed registration source.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.156 - Knowledge Trial Policy Normal Lint Registration`

Immediate next version:

- `Version 0.5.157 - Knowledge Trial Registry Reference Alignment Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.156 Result

- Imported `validateKnowledgeTrialPolicies` into normal content lint.
- Added `packages/content/base/player/knowledge_trial_policies.json` exactly once to checked content.
- Loaded policy content, policy schema, domain registry, and snippets explicitly in index orchestration.
- Invoked the unchanged validator after existing registry and snippet semantic validation.
- Preserved top-level normal lint failure propagation.
- Changed successful normal lint output from 55 to 56 checked files.
- Updated focused and integration coverage for registration, dependency loading, invocation order, purity, failure propagation posture, and exact count.
- Kept every registry `trialPolicyRef` null.
- Changed no policy/schema/registry/snippet/helper/adapter/readiness/storage/persistence/runtime/UI/reward/event/gameplay authority.

## Active Guardrails For 0.5.157

- The next run is planning-only registry-reference alignment.
- Do not edit registry references until the plan explicitly reconciles current null-enforcement behavior in both registry and policy validators.
- Keep the current one-record Flora Tier 1 policy unchanged.
- Keep the policy schema, snippets, Knowledge helpers, adapters, readiness content, state, storage, persistence, UI, runtime, rewards, events, and gameplay unchanged.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.
- Keep Arcane Lore planned, blocked, and deferred.
- Treat family/religion/ecology/recipe expansion notes as future roadmap material outside the Knowledge trial alignment run.

Current follow-up risks:

- Registry and policy validators currently require every `trialPolicyRef` to remain null.
- No content-to-helper adapter exists.
- Canonical completion-policy content does not exist.
- Readiness schema/content remains deferred.
- Current Flora Tier 1 has one authored counting snippet.
- Reward references remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.
- Mutable authority and persistence remain undefined.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.154` | Knowledge Trial Policy Semantic Validator | `tools/content-lint/knowledge-trial-policies.mjs` | Completed |
| 2 | `0.5.155` | Knowledge Trial Policy Normal Lint Registration Plan | `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md` | Completed |
| 3 | `0.5.156` | Knowledge Trial Policy Normal Lint Registration | `tools/content-lint/index.mjs` | Completed |
| 4 | `0.5.157` | Knowledge Trial Registry Reference Alignment Plan | Future focused plan | Next |
| 5 | `0.5.x` | Knowledge Trial Registry Reference Alignment | Future focused implementation | Deferred |
| 6 | `0.5.x` | Knowledge Trial Readiness Policy Schema | Future focused plan/run | Deferred |
