# Current Codex Output

Source version/run: Version 0.5.287 - Service Authority Boundary Decision
Date: 2026-07-07
Branch/status assumption: `master`, clean at start; `git fetch origin` succeeded and `git pull --ff-only origin master` reported already up to date.

## Result

Completed a docs-only service authority boundary decision.

Decision: select a hybrid service model. Current service-like data remains controlled descriptors on existing and future owners. A future narrow static service authority, likely `civilization.services`, is justified in principle only for provider-independent service identity/vocabulary, but no schema, content, validator, runtime, UI, or behavior work is implemented or authorized by this run.

The next primary route is:

- `Version 0.5.288 - Resource And Commodity Schema Decision`

Deferred sequence remains:

- `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`
- `Version 0.5.290 - Static Authority Validation Consolidation Audit`

## Files Changed

- `docs/design/service-authority-boundary-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- Required handoff, roadmap, backlog, and prior queue-review read
- Service/vendor/shop/storage/travel/access/civic/economy/NPC/item/crafting boundary review
- Read-only service-like content descriptor scan
- `node -e "...buildings descriptor summary..."`
- `git diff --check`
- Conflict-marker scan on changed and untracked files
- Trailing-whitespace scan on changed and untracked files
- Changed-path scope audit
- Forbidden-path diff audit
- Stale next-version pointer scan
- `git status --short --branch`

No package tests were run because this was a documentation-only boundary decision.

## Behavior / Runtime Confirmation

Documentation changed only.

No content JSON, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, service content, resource content, combat content, sacred-site/religious-hotspot content, Knowledge snippets, Knowledge registry/domain/trial-policy content, or gameplay behavior changed.

Confirmed current posture:

- Services remain descriptors on current/future owners for now.
- A future service catalog is deferred and may own only static provider-independent service vocabulary.
- Provider identity, availability, access gates, prices, payment, stock, inventory mutation, training/healing/repair effects, lodging/storage/banking effects, travel execution, law/reputation gates, UI menus, and runtime execution remain outside static service authority.
- The Highcrown settlement Knowledge lane remains closed.

## Risks / Follow-Up

- Do not infer permission to implement `civilization.services` from this decision. A separate schema decision and seed plan are required.
- Existing `civilization.buildings.serviceFunctions` and related descriptors remain current source-local descriptors; no migration or replacement was approved.
- Resource/commodity work should use this service boundary to avoid conflating material/trade-class authority with vendor/shop/service behavior.
- Combat status/injury remains deferred and high risk.

## Next Recommended Version

Version 0.5.288 - Resource And Commodity Schema Decision

## Suggested Commit Message

docs(roadmap): decide service authority boundary
