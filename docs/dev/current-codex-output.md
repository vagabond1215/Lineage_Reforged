# Current Codex Output

Source version/run: Version 0.5.289 - Combat Status Condition And Injury Boundary Decision
Date: 2026-07-07
Branch/status assumption: `master`; worktree clean at start. `git fetch origin` succeeded. `git pull --ff-only origin master` returned the known multi-branch fast-forward ambiguity, then `HEAD`, `origin/master`, and their merge base all resolved to `46e41f9bcce457344c55d0fdeb7fa5100b5db11a`.

## Result

Completed the docs-only combat status/condition/injury boundary decision.

Selected a limited hybrid model: a future typed, non-executing static vocabulary/catalog is justified in principle, with records distinguished as status, condition, or injury. Implementation remains deferred to a later schema plan, fresh live-repo audit, and seed plan.

Active status instances, stacks, magnitudes, actor references, timers, HP/MP/stamina changes, body-state math, wounds, injury instances, disease/poison exposure, treatment, recovery, scars, death, defeat, save/account state, commands, events, rewards, UI, storage, runtime, and gameplay remain outside static authority.

## Files Changed

- `docs/design/combat-status-condition-injury-boundary-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (returned known multi-branch fast-forward ambiguity)
- `git branch -vv`
- `git rev-parse HEAD`
- `git rev-parse origin/master`
- `git merge-base HEAD origin/master`
- read-only inspections of current roadmap, handoff, backlog, combat/item/magic/resource/service design docs, live combat-adjacent content summaries, and focused runtime type surfaces
- `git diff --check`
- `git diff --name-only -- packages apps tools tests`
- conflict-marker scan over changed docs
- `rg -n "Latest completed version: \`Version 0\.5\.288|Next recommended version: \`Version 0\.5\.289|Immediate next primary route:\s*$|Keep \`Version 0\.5\.289 - Combat Status Condition And Injury Boundary Decision\` as the immediate next recommended run|1\. \`0\.5\.289 - Combat Status Condition And Injury Boundary Decision\`|Route: Codex local sequencing alignment after \`Version 0\.5\.288" docs/dev/project-roadmap.md docs/dev/codex-sequenced-implementation-plan.md docs/dev/current-gpt-handoff.md docs/dev/current-codex-output.md`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`
- `rg -n "Version 0\.5\.289|Version 0\.5\.290|typed|static vocabulary|status/condition/injury|combat status" docs/design/combat-status-condition-injury-boundary-decision.md docs/dev/current-gpt-handoff.md docs/dev/codex-sequenced-implementation-plan.md docs/dev/project-roadmap.md docs/future_content_backlog.md`

## Behavior / Runtime Confirmation

No runtime, JSON content, schema, validator, test, UI, storage, command, event, reward, migration, save/account, combat, health/resource, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, settlement/district/site, service/resource/commodity, Knowledge, sacred-site/religious-hotspot, or gameplay behavior changed.

## Risks / Follow-Up

- Future status/condition/injury implementation still requires a separate docs-first schema plan, fresh live-repo audit, and seed plan.
- The future schema plan must reconcile the typed static vocabulary with current `CombatStatusEffectState`, `PlayerResourceModifierState`, `PlayerResourceChangeRequestState`, `PlayerBodyState`, `activeEffects`, spell hook classifications, item `useProfiles`, monster action packages, and future health/injury persistence.
- Static authority validation consolidation is now the immediate next docs-first route.

## Next Recommended Version

Version 0.5.290 - Static Authority Validation Consolidation Audit

## Suggested Commit Message

docs(roadmap): decide combat status injury boundary
