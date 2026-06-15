# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.159 - Knowledge Trial Registry Reference Alignment`
Date: 2026-06-15
Branch/status assumption: `master` at commit `535d1e7` before edits; the worktree was clean and aligned with `origin/master`.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order, candidate lanes, maturity direction, and unresolved roadmap questions.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `packages/content/base/player/knowledge_domain_registry.json` owns registry references.
- `packages/content/base/player/knowledge_trial_policies.json` owns the unchanged Flora Tier 1 policy.
- `tools/content-lint/knowledge-domain-registry.mjs` owns registry-local validation.
- `tools/content-lint/knowledge-trial-policies.mjs` owns policy semantics and cross-file registry-reference coherence.
- `tools/content-lint/index.mjs` remains the unchanged normal-lint orchestrator.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.159 - Knowledge Trial Registry Reference Alignment`

Immediate next version:

- `Version 0.5.160 - Knowledge Trial Readiness Policy Schema Plan`

The project remains in `0.5.x` foundation stabilization and ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.159 Result

- Set only `knowledge_domain.flora.trialPolicyRef` to `knowledge_trial_policy.flora_tier_1`.
- Kept every other registry trial reference null and kept all completion/visibility references null.
- Permitted registry-local trial references only for active non-Arcane domains.
- Added exact cross-file policy resolution, active-status, domain-parity, unique-reference, and active-policy representation checks.
- Preserved policy scope/tier, completion-target, readiness-null, reward-empty, snippet, Arcane-blocking, purity, and helper-isolation rules.
- Preserved normal lint at `content-lint: ok (56 files checked)`.
- Changed no schema, index, policy content, snippet content, helper, adapter, readiness, storage, persistence, runtime, UI, reward, event, ownership mutation, or gameplay behavior.

## Active Guardrails For 0.5.160

- Keep registry alignment as content-lint authority only; it does not make a Knowledge trial runnable.
- Plan readiness policy schema/content authority before implementing either.
- Do not add content-to-helper adaptation, trial attempts, checkpoints, outcomes, cooldowns, rewards, unlock processing, mutable state, storage, persistence, UI, runtime, generated output, commands, events, ownership mutation, or gameplay behavior without explicit later authorization.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.
- Keep Arcane Lore planned, blocked, and deferred.
- Keep the one-policy-per-domain registry limitation explicit; do not add a second active Flora policy without a separate registry-shape plan.
- Do not absorb family, heir, religion, ecology, recipe, crafting, civil-society, maturation, or estate implementation into the readiness-planning run.

Current follow-up risks:

- The registry has one policy pointer per domain and cannot represent multiple tier policies.
- No content-to-helper adapter exists.
- Readiness schema/content and mutable trial authority remain deferred.
- Flora Tier 1 has one authored counting snippet.
- Rewards remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.

## Near-Term Sequence

This ordering is recommended direction, not implementation lock-in:

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.160` | Knowledge Trial Readiness Policy Schema Plan | Next |
| 2 | `0.5.161` | Ecology Knowledge Domain Plan | Recommended |
| 3 | `0.5.162` | Ecology Knowledge Domain Seed Content Plan | Recommended |
| 4 | `0.5.163` | Religion Knowledge Domain Plan | Recommended |
| 5 | `0.5.164` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 6 | `0.5.165` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 7 | `0.5.166` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 8 | `0.5.167` | Offspring Growth Role And Activity Build Plan | Recommended |
| 9 | `0.5.168` | Recipe Ownership And Personal Learning Plan | Recommended |
| 10 | `0.5.169` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
