# Current Codex Output

Source version/run: Version 0.5.62 - Chronicles Bloodline Tree Presentation Plan
Date: 2026-05-19
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only Chronicles/Bloodline tree presentation plan. The plan keeps Bloodlines under the account meta/Chronicles recordkeeping surface, derives future family trees from current flat family and run-history records, and keeps heirs, bequests, heirlooms, family management, family evidence, and UI implementation deferred.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/future_content_backlog.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `packages/engines/game-engine/src/account-family.js`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/index.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `tests/unit/account-family.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`

## Files Changed

- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Bloodline Presentation Summary

The plan places future Bloodlines presentation inside the account meta/Chronicles area rather than character creator.

Recommended structure:

```text
Chronicles
  Bloodlines
    Family List
      Family Detail
        Tree
        Heirs
        Prestige
        Upgrades
        Bequests
        Heirlooms
```

The initial implementation direction is read-only, view-model-first, and tied to current `AccountProfileState.families` plus linked `AccountRunHistoryRecord` data.

## Family Tree Planning Summary

Family trees should be derived from flat current-data records:

- `AccountFamilyRecord`
- `AccountRunHistoryRecord.familyId`
- `AccountRunHistoryRecord.parentCharacterId`
- `AccountFamilyRecord.rootCharacterId`
- current family member ids

The plan avoids nested mutable tree storage, lineage-id inference, automatic family creation, hidden children, spouse/adoption/legitimacy claims, or creator-side family browsing.

## Presentation Boundary Summary

Future Bloodlines UI should show:

- family list
- family overview/detail
- derived tree
- Family Prestige summary and category totals
- recent family prestige transactions

It should omit or conservatively mark inactive:

- heirs
- family upgrades
- bequests
- heirlooms
- Backstory Eligibility support
- family management actions

## Prestige Presentation Summary

Family Prestige should display as family-scoped, ledger-derived totals:

- available
- lifetime earned
- lifetime spent
- category totals
- recent transactions

Category tags remain presentation grouping, not separate currencies. The plan does not add Family Prestige earning, spending, Backstory unlock support, or purchase behavior.

## Guardrail Summary

The plan states:

- Bloodlines is not a character creator build screen.
- Family tree display must not unlock backstories by itself.
- Family records should not become resolver evidence without an approved evidence owner.
- Bequests and heirlooms should not directly grant backstory identity.
- Current account/profile/save ids validate directly.
- No backwards-compatibility or old-data rescue behavior is planned.

## Backlog Update

Updated `docs/future_content_backlog.md` with a concise v0.5.62 run note. Deferred items remain:

- Bloodlines UI implementation
- family management
- automatic family creation
- heir slots and heir generation
- heirlooms
- bequests
- Chronicle Marks
- Lineage Seals
- family evidence into Backstory Eligibility
- Backstory Legacy purchase records
- content JSON and schema changes
- generated UI output

## Recommended Next Pipeline

1. Version 0.5.63 - Backstory Legacy Purchase Runtime Shape
2. Version 0.5.64 - Backstory Legacy Purchase Content Draft
3. Version 0.5.65 - Backstory Legacy Purchase Resolver Integration
4. Version 0.5.66 - Heirloom And Bequest Systems Plan
5. Version 0.5.67 - Bloodlines View Model Implementation Plan
6. Version 0.5.68 - Bloodlines Read-Only Account Meta UI

## Checks Run

- `git status --short`
  - Initially clean before edits.
- `rg -n "backwards compatibility|backward compatibility|old-save|old save|old-account|old account|migration|migrate|alias|retired-id|converted-id|historical id|old selected|old-data|rescue" docs\design\chronicles-bloodline-tree-presentation-plan.md docs\future_content_backlog.md`
  - Found only intentional no-compatibility guardrail language in the new plan and older backlog history.
- `npm.cmd run tool:content-lint`
  - Passed: `content-lint: ok (53 files checked)`.
- `git diff --check`
  - Passed. Git reported line-ending normalization warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No creator behavior changed.
No Legacy purchase behavior changed.
No Backstory Eligibility resolver policy semantics changed.
No content JSON changed.
No account profile schema/types changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No starter skill, starting ability, attribute, save/account schema, combat, magic, economy, progression, launcher UI asset, generated UI output, or visible availability behavior changed.
This pass only adds a planning document and updates docs output/backlog.

## Risks / Follow-Up

- Bloodlines presentation will remain empty until runtime flows create family records.
- Family tree usefulness depends on reliable `familyId`, `parentCharacterId`, root, and member data.
- Account meta UI is already dense; implementation should start with a pure view-model pass before React changes.
- Family Prestige has totals but no earning/spending owner.
- Heirs, bequests, heirlooms, Chronicle Marks, Lineage Seals, and family-scoped backstory evidence remain deferred.
- Bad future family evidence could visibly unlock backstories because creator availability is resolver-backed.

## Next Recommended Version

Version 0.5.63 - Backstory Legacy Purchase Runtime Shape

## Suggested Commit Message

docs(ui): plan bloodline tree presentation
