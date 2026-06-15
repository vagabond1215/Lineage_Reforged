# Current Codex Output

Source version/run: Version 0.5.157 - Knowledge Trial Registry Reference Alignment Plan
Date: 2026-06-15
Branch/status assumption: Ran on `master` from commit `3122bce`. The worktree was clean before edits, and `master` was aligned with `origin/master`.

## Result

Added the documentation-only Knowledge trial registry reference alignment plan.

The plan selects one exact future link:

- `knowledge_domain.flora`
- `trialPolicyRef: "knowledge_trial_policy.flora_tier_1"`

The current registry can represent one selected policy per domain. The referenced policy remains authoritative for `scope: "tier"` and `tier: 1`; lint must not infer tier from policy-id text. Multiple active tier policies for one domain remain blocked until a separate registry-shape plan.

The future `0.5.158` run should reconcile the registry and policy validators, update the single Flora reference, preserve all other null references, and keep normal lint at 56 checked files.

## Files Changed

- `docs/design/knowledge-trial-registry-reference-alignment-plan.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- Conflict-marker scan across changed files
- Trailing-whitespace scan across changed files
- `git diff --check`
- Changed-path scope audit
- Forbidden index/validator/schema/content/test/fixture/helper/adapter/readiness/storage/persistence/runtime/UI/generated-output/event/reward/gameplay/family/religion/ecology/recipe edit audit
- Broad tests and typecheck were not run because this was a documentation-only planning change

## Behavior / Runtime Confirmation

- Documentation only.
- No registry, policy, snippet, schema, validator, index, test, fixture, helper, or adapter changed.
- Every registry `trialPolicyRef` remains null.
- Normal content lint remains registered at 56 checked files.
- No readiness, attempt, checkpoint, outcome, cooldown, reward, unlock, state, storage, persistence, save/account/session/database, UI, runtime, generated output, event, ownership mutation, or gameplay behavior changed.
- Family, religion, ecology, and recipe design documents were not edited.

## Risks / Follow-Up

- The current registry supports one selected policy reference per domain, not a complete tier-policy map.
- A second active policy for one domain requires a separate registry-shape plan.
- Registry alignment will remain content-lint authority only and will not make a trial runnable.
- Readiness policy, content-to-helper adaptation, mutable trial authority, and persistence remain deferred.
- Flora Tier 1 still has one authored counting snippet.
- Rewards remain inert and empty, and `trialUnlockWeight` remains uninterpreted.

## Next Recommended Version

Version 0.5.158 - Knowledge Trial Registry Reference Alignment

## Suggested Commit Message

docs(knowledge): plan trial registry reference alignment
