# Current Codex Output

Source version/run: Version 0.5.60 - Legacy Scope And Bloodline Economy Plan
Date: 2026-05-19
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only Legacy Scope and Bloodline Economy Plan. This revises the immediate Backstory Legacy purchase pipeline so family records, family prestige ledgers, Bloodline economy boundaries, and scoped purchase ownership are planned before Backstory Legacy purchase runtime work.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/future_content_backlog.md`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/backstory-creator-presentation-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/backstory-runtime-policy-shape-draft.md`
- `docs/design/backstory-eligibility-resolver-plan.md`
- `docs/design/backstory-tiered-lane-design.md`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `packages/content/base/player/legacy_unlocks.json`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`

## Files Changed

- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Legacy Scope Organization Summary

The plan organizes future Legacy presentation as:

```text
Legacy
  Chronicle
  Bloodlines
```

Chronicle covers account-wide upgrades, cross-family progression, broad system unlocks, global preparation capacity, and account-level marks. Bloodlines covers family lists, family records, family trees, heir slots once owned, family prestige, family-specific upgrades, bloodline preparations, bequests, heirlooms, and family-scoped backstory unlock support.

"New Game+" is not a top-level lore category; those effects should live inside Chronicle or Bloodlines depending on scope.

## Family Tree Planning Summary

Family trees are planned as derived hierarchical presentation over flat records:

- family records
- character/run records tagged with `familyId`
- optional `parentCharacterId`
- later branch, cadet, illegitimate branch, adoption, marriage, or recognition metadata

The plan avoids nested mutable tree storage unless a later implementation proves it is necessary.

## Category Model Summary

Categories are planned as sorting/organization tags, not separate currencies by default.

Recommended categories:

- Renown
- Martial
- Production
- Commerce
- Lore & Faith
- Survival / Utility
- Household / Lineage
- Preparation

The plan explicitly avoids category-specific prestige pools unless later balancing proves they are needed.

## Currency / Marks Model Summary

The plan separates three future resources:

- Family Prestige: earned and spent by a specific family.
- Chronicle Marks: account-wide marks from family accomplishments, reduced family-prestige conversion, or major milestones.
- Lineage Seals: rare benchmark currency from branch closure, heir claim retirement, major family milestones, or high-value sacrifices.

No currency or storage was implemented.

## Family Prestige Ledger Summary

The plan requires ledger-based Family Prestige instead of summing earned prestige per character.

Draft transaction fields include transaction id, family id, character/source-run source, grant/spend kind, amount, category tag, source type/id, timestamp, and summary. Derived totals should include earned, spent, available, and optional category/source presentation totals.

## Chronicle Conversion / Heir Claim Retirement Summary

The plan allows reduced conversion from family success to account-wide Chronicle Marks after explicit unlocks. It also plans future heir claim retirement, branch closure, or line dedication as ways to convert old family momentum into Chronicle Marks or Lineage Seals.

Suggested language includes:

- Enter into the Chronicle
- Preserve the Family Record
- Settle the Line
- Close a Branch
- Dedicate a Branch to the Chronicle

## Bloodline Upgrades Summary

Bloodline upgrades are defined as inherited potential, family tendency, aptitude, temperament, growth, or prestige affinity.

Examples include improved starting stat point chance, family-associated skill growth, increased prestige gain for descendants, improved physique/nature/focus chances, small temperament/resistance bonuses, and better aptitude for production, combat, social, or utility paths.

These are intentionally separate from bequests.

## Bequest Model Summary

Bequests are intentional estate or material transfers: coin, tools, supplies, land parcels, workshop stakes, estate claims, documents, trade licenses, legal writs, or later contacts after contact systems exist.

Bequests should not represent genetic/stat/growth RNG-style upgrades and should not unlock social/status origins by themselves.

## Heirloom System Summary

Heirlooms are planned as a distinct family item-chain system:

- expensive family unlock to register a specific item instance
- family prestige cost to pass it forward
- one eligible holder at a time
- no duplication
- loss, theft, confiscation, destruction, or irreparable breakage interrupts the chain

No item persistence was implemented.

## Backstory Unlock Relationship Summary

The plan explains how Bloodline economy planning supports future Backstory Eligibility work:

- Family Prestige can support family-scoped backstory unlocks.
- Family tree/history can become evidence later.
- Bloodline upgrades can unlock family tendencies without stacking starter effects.
- Bequests and heirlooms should not directly grant backstory identity.
- Minor Noble, Merchant Family, Garrison Ward, Local Champion, and World-Stray remain scoped or blocked according to their existing resolver direction.

No current backstory policy changed.

## Revised Pipeline Summary

The v0.5.59 immediate Backstory Legacy purchase runtime sequence is superseded.

Revised pipeline:

1. Version 0.5.61 - Family Records And Prestige Ledger Runtime Shape
2. Version 0.5.62 - Chronicles Bloodline Tree Presentation Plan
3. Version 0.5.63 - Backstory Legacy Purchase Runtime Shape
4. Version 0.5.64 - Backstory Legacy Purchase Content Draft
5. Version 0.5.65 - Backstory Legacy Purchase Resolver Integration
6. Version 0.5.66 - Heirloom And Bequest Systems Plan

## Checks Run

- `git status --short`
  - Showed only expected docs-only changes:
    - `docs/design/legacy-scope-bloodline-economy-plan.md`
    - `docs/design/backstory-legacy-purchase-integration-plan.md`
    - `docs/future_content_backlog.md`
    - `docs/dev/current-codex-output.md`
- `npm.cmd run tool:content-lint`
  - Passed: `content-lint: ok (53 files checked)`
- `git diff --check`
  - Passed. Git reported line-ending normalization warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No creator behavior changed.
No Legacy purchase behavior changed.
No resolver policy semantics changed.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No starter skill, starting ability, attribute, save/account schema, combat, magic, economy, progression, launcher UI asset, generated UI output, or visible availability behavior changed.
This pass only adds a planning document and revises the future pipeline.

## Risks / Follow-Up

- Family ids do not yet exist on run history records.
- Parent/child lineage links do not yet exist.
- Family prestige storage does not yet exist.
- Chronicle Marks and Lineage Seals do not yet exist.
- Heir slots do not yet exist.
- Heirloom item-instance persistence does not yet exist.
- Estate/title/status systems are still missing.
- Categories should remain sorting tags, not currency fragmentation.
- Bad family-scoped evidence could incorrectly unlock creator backstories because creator now consumes resolver output.
- Broad runtime implementation should not start until the runtime shape is narrow and tested.
- Typecheck remains affected by known workspace/pre-existing TypeScript issues.

## Next Recommended Version

Version 0.5.61 - Family Records And Prestige Ledger Runtime Shape

## Suggested Commit Message

docs(legacy): plan bloodline economy scope
