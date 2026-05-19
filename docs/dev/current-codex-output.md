# Current Codex Output

Source version/run: Version 0.5.59 - Backstory Legacy Purchase Integration Plan
Date: 2026-05-19
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only Backstory Legacy Purchase Integration Plan for future Backstory Legacy purchase work now that the character creator consumes resolver-backed backstory availability.

The plan keeps Legacy purchases as support for resolver eligibility, not a substitute for scoped evidence or blocked owner systems. It does not add purchase records, change runtime behavior, change resolver policy semantics, or change creator availability.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/design/backstory-creator-presentation-plan.md`
- `docs/design/backstory-eligibility-resolver-test-plan.md`
- `docs/design/backstory-runtime-policy-shape-draft.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/backstory-eligibility-resolver-plan.md`
- `docs/design/backstory-tiered-lane-design.md`
- `docs/design/backstory-policy-metadata.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/index.ts`
- `packages/content/base/player/backstories.json`
- `packages/content/base/player/legacy_unlocks.json`
- `packages/shared/types/src/contracts.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `docs/dev/current-codex-output.md`

## Files Changed

- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Core Purchase Principle Summary

The new plan defines the central rule: Legacy purchase can support access, but it must not create unsupported history.

For Tier 2 and Tier 3 origins, purchase alone must fail. Matching evidence still needs to exist, and purchase acts as support, recognition, authorization, or investment rather than invented competence, status, or institutional membership.

## Scope Model Summary

The plan separates purchase scopes:

- account scope for broad low-risk Tier 1 access only
- family scope for household, family, trade, craft, garrison, or inherited origins
- region scope for local renown or regional access
- institution scope for temple, scholar, guild, oath, or order origins after ownership exists
- estate/title scope for noble, heir, and recognized-claim origins after ownership exists
- source-run support only after source-run evidence is durable

It explicitly keeps Minor Noble, Merchant Family, Garrison Ward, Local Champion, and World-Stray from becoming account-wide shortcuts.

## Tier Rule Summary

- Tier 1: some low-risk origins may be early-Legacy or account-level unlocks when no blocked owner is needed.
- Tier 2: requires scoped evidence plus purchase/support; purchase alone fails.
- Tier 3: long-term, evidence-heavy, and usually blocked until family/status/institution/estate/renown owners exist.
- Special: narrative/manual/story-owned; usually not ordinary Legacy purchases.
- Deferred: no purchase path until required owner systems exist.

## Evidence And Blocked-Owner Summary

The plan keeps `requiresLegacyPurchase` as support for `requiresEvidence`, `requiresAny`, and `requiresAll`.

Blocked owners remain blocked:

- family skill maxima
- family backstory history
- heir legitimacy/status
- estate/title ownership
- regional renown storage if not durable/scoped
- institutional membership
- patronage/contact systems
- adoption
- marriage
- mounted behavior and mount ownership
- market/economy effects
- magic licensing/acquisition
- medical/injury systems
- oath and paladin behavior

Legacy purchase must not bypass these owners.

## Resolver Integration Planning Summary

The resolver already accepts `legacyPurchaseIds` and evaluates `requiresLegacyPurchase`.

Future integration should pass only purchase ids owned by account/family/region/institution/storage once those owners exist. The creator should continue consuming resolver output rather than checking purchase state directly.

## Legacy Runtime Integration Planning Summary

Future runtime work should:

- add Backstory Legacy unlock records only after the runtime shape is approved
- classify purchase mode, scope, currency, duration, and implementation priority explicitly
- validate requirements before purchase
- treat unsupported requirements as blocked
- avoid starter skill, attribute, ability, item, money, contact, market, mount, magic, medical, title, or oath effects
- preserve selected-backstory-only starter effects and no parent/child stacking

## Creator/UI Planning Summary

The plan keeps purchases out of the creator until a real purchase path exists. The account/Legacy surface is the likely purchase location. Creator locked copy should stay conservative and should not promise unsupported systems or purchase buttons ahead of implementation.

## Future Storage Planning Summary

Future storage may need account-level purchased ids for low-risk Tier 1 access and scoped purchased ids for family, region, institution, estate/title, or source-run support. Missing storage should resolve as absent, not inferred from account Legacy points.

No save/account schema changes were made.

## Testing Plan Summary

The plan calls for future tests proving:

- Tier 1 early-Legacy purchase paths work only when policy allows
- Tier 2/Tier 3 purchase alone fails
- wrong-scope purchases fail
- blocked evidence plus purchase fails or defers
- family-scoped purchases do not work account-wide
- account purchases cannot unlock Minor Noble/status/institution/magic/mount/medical/oath origins
- creator passes only owned purchase ids
- purchases grant no starter effects by themselves
- no parent/child backstory stacking
- no design metadata imports
- no compatibility rescue behavior

## Initial Candidate Purchase Matrix Summary

The plan classifies all 27 current live backstories:

- Default/no purchase: Local, Vagabond, Exile, Farmhand, Amnesiac, plus current common always-available Workshop-Raised and Street-Raised.
- Possible low-risk Tier 1 early-Legacy: Street Vendor, Net-Tender, Gatherer, Drover's Hand, Kitchen Hand, Militia Levy, Scribe's Apprentice.
- Tier 2 purchase plus evidence: Merchant Family, Carpenter Household, Miner's Kin, Village Hunter, Scout's Ward, Garrison Ward.
- Hidden/deferred due blocked systems: Troupe-Raised, Scholar's Apprentice, Temple Acolyte, Hedge Adept.
- Tier 3/deferred owner blocked: Minor Noble.
- Special/manual: Local Champion and World-Stray.

No live policy was changed.

## Recommended Next Pipeline

1. Version 0.5.60 - Backstory Legacy Purchase Runtime Shape
2. Version 0.5.61 - Backstory Legacy Purchase Content Draft
3. Version 0.5.62 - Backstory Legacy Purchase Resolver Integration
4. Version 0.5.63 - Backstory Legacy Purchase UI/Account Presentation Plan

## Checks Run

- `git status --short`
  - Showed only expected docs-only changes:
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
This pass only adds a planning document for future Backstory Legacy purchase integration.

## Risks / Follow-Up

- Family/source-run ledgers remain missing.
- Earned skill maxima storage remains missing.
- Scoped purchase storage remains missing.
- Existing Legacy runtime may not yet represent family-scoped backstory purchases cleanly.
- Broad achievements remain too loose for narrow Tier 2/Tier 3 unlocks without explicit mapping.
- Creator now consumes resolver output, so bad purchase evidence could visibly unlock content.
- Blocked owner bypass remains the main risk.
- Typecheck remains affected by known workspace/pre-existing TypeScript issues from the previous handoff.

## Next Recommended Version

Version 0.5.60 - Backstory Legacy Purchase Runtime Shape

## Suggested Commit Message

docs(legacy): plan backstory purchase integration
