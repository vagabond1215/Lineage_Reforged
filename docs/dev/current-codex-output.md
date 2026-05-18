# Current Codex Output

Source version/run: Version 0.5.57 - Creator Locked Backstory Presentation Plan
Date: 2026-05-18
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only design document for future creator presentation of Backstory Eligibility Resolver states.

The plan defines how creator surfaces should eventually merge live backstory catalog data with resolver output for available, locked, hidden, deferred, and special states without wiring the resolver into the creator yet.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/design/backstory-eligibility-resolver-test-plan.md`
- `docs/design/backstory-runtime-policy-shape-draft.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/backstory-eligibility-resolver-plan.md`
- `docs/design/backstory-tiered-lane-design.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/index.ts`
- `packages/content/base/player/backstories.json`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/player-identity-content.test.mjs`
- `docs/dev/current-codex-output.md`

## Files Changed

- `docs/design/backstory-creator-presentation-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Creator Presentation Planning Summary

The new plan documents a future flow where the creator loads live backstory catalog data for labels, descriptions, starter skill display, attributes, and selected effects, then calls the runtime-owned resolver with current-data evidence and merges the resolver projection into a presentation view model.

The plan keeps settlement-start authorization separate and keeps selected backstory effect application unchanged.

## Availability-State Presentation Summary

The plan covers the current resolver statuses:

- `always_available`
- `default_available`
- `early_legacy`
- `locked`
- `hidden`
- `special`
- `deferred`

It defines visibility, selectability, badge direction, detail visibility, safe explanation direction, and unsupported promises to avoid for each status.

The plan does not reintroduce `retired`, `converted`, alias rescue behavior, or old-data rescue states.

## Locked Explanation Rules

Locked explanations should use player-safe language, avoid raw policy/evidence ids, and avoid promising blocked systems.

Safe examples include:

- "Requires a matching family history."
- "Requires earned trade evidence."
- "Not available in the current creator."
- "Requires a future system that is not active yet."

Unsafe examples include Legacy purchase promises before purchase support exists, title/estate ownership promises before those systems exist, and institution/contact/mount/magic/medical/oath promises before their owners exist.

## Default Safety Presentation Summary

The plan preserves the baseline default ids as the current default safety set:

- `backstory.local`
- `backstory.vagabond`
- `backstory.exile`
- `backstory.farmhand`
- `backstory.amnesiac`

Missing optional evidence must not dead-end creation, must not bypass settlement-start authorization, and must not unlock Tier 2, Tier 3, special, hidden, or deferred origins.

## Hidden / Deferred / Special Handling

The plan says hidden and deferred records should be omitted from normal creator lists.

Special records should usually remain hidden unless a dedicated narrative owner scopes their presentation. World-Stray remains special/manual or hidden, Local Champion remains special or region/achievement/story scoped, and Minor Noble remains blocked or deferred until family, estate, title, and status evidence owners exist.

## Future View-Model Shape Summary

The plan drafts a future creator presentation view model with fields for:

- id/name/summary/description
- starter skill, attribute, and starting ability display
- availability state
- selectable and visible booleans
- badge, locked reason, and unlock hint
- default/special/deferred flags
- sort group

This remains planning only and is not implemented.

## Selection / Snapshot Boundary Summary

Future selection should allow only resolver-eligible/default/always records. Locked, hidden, deferred, and ordinary special records cannot be selected unless resolver output and a scoped owner allow it.

Snapshot creation remains selected-only: the resolver affects availability, not starter skills, attributes, abilities, flags, or Chronicle effect logic. Parent and child backstory effects must not stack.

## Evidence Input Boundary Summary

The first future integration should pass only evidence that the app already owns safely, such as live ids, selected id for warnings, account id if available, and owned scoped fields only when their storage exists.

The creator must not pass invented evidence, fake Legacy purchases, dummy family evidence, starter-granted skills as earned maxima, or blocked owner stubs that unlock content.

## Future Implementation Test Plan

Future creator integration tests should prove:

- creator view model uses resolver projection
- eligible records are selectable
- locked records are visible but not selectable when safe to show
- hidden and deferred records are omitted from normal lists
- special records are not ordinary selectable origins
- default records remain selectable when evidence is missing
- selection cannot bypass resolver output
- settlement-start validation remains separate
- snapshot creation applies only the selected backstory package
- creator code does not import design metadata or planning drafts
- no backwards-compatibility rescue behavior is introduced
- visible copy does not promise blocked systems

## Recommended Next Pipeline

1. Version 0.5.58 - Creator Backstory Resolver Integration
2. Version 0.5.59 - Backstory Legacy Purchase Integration Plan

Creator resolver integration should come before Backstory Legacy purchase integration.

## Checks Run

- `git status --short`
  - Showed only the expected docs changes:
    - `M docs/dev/current-codex-output.md`
    - `M docs/future_content_backlog.md`
    - `?? docs/design/backstory-creator-presentation-plan.md`
- `npm.cmd run tool:content-lint`
  - Passed: `content-lint: ok (53 files checked)`
- `git diff --check`
  - Passed. Git reported line-ending normalization warnings for `docs/dev/current-codex-output.md` and `docs/future_content_backlog.md`.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No creator behavior changed.
No resolver wiring was added.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No starter skill, Legacy purchase, save/account schema, combat, magic, economy, progression, launcher UI, generated UI output, or visible availability behavior changed.
This pass only adds a planning document for future creator locked-backstory presentation.

## Risks / Follow-Up

- Creator currently still shows raw live catalog availability.
- Evidence inputs remain limited until family/source-run/earned-skill ledgers exist.
- Locked explanations must not promise unsupported systems.
- Broad creator rewrites remain high risk.
- Generated UI output should remain untouched.
- The previous handoff noted known workspace TypeScript issues; this docs-only pass does not run typecheck or address them.
- Backstory Legacy purchase integration remains deferred.

## Next Recommended Version

Version 0.5.58 - Creator Backstory Resolver Integration

## Suggested Commit Message

docs(ui): plan creator backstory availability presentation
