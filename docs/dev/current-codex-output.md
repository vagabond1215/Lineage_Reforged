# Current Codex Output

Source version/run: Version 0.5.67 - Backstory Legacy Live Content Migration
Date: 2026-05-20
Branch/status assumption: `master`; `git status --short` was clean before edits.

## Result

Migrated the five approved low-risk Backstory Legacy purchase candidates from the draft planning catalog into the live Legacy unlock catalog as account-scoped, live, unlock-only ownership/support records.

The records are intentionally visible and purchasable through the existing Legacy/account-meta purchase surface when requirements and account Legacy currency permit. They do not change character creator availability because purchase evidence is still not wired into the Backstory Eligibility resolver caller path.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/backstory-legacy-purchase-content-draft.json`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/dev/prompt-template-hardening-pass.md`
- `docs/future_content_backlog.md`
- `packages/content/base/player/legacy_unlocks.json`
- `packages/content/base/player/backstories.json`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `tests/unit/backstory-legacy-catalog-guard.test.mjs`
- `tests/unit/backstory-legacy-purchase-content-draft.test.mjs`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/legacy-unlocks.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`

## Files Changed

- `docs/dev/current-codex-output.md`
- `docs/future_content_backlog.md`
- `packages/content/base/player/legacy_unlocks.json`
- `tests/unit/backstory-legacy-catalog-guard.test.mjs`
- `tests/unit/backstory-legacy-purchase-content-draft.test.mjs`

## Migrated Records

| Legacy unlock id | Target backstory | Priority | Scope | Cost | Description |
| --- | --- | --- | --- | --- | --- |
| `legacy.backstory.street_vendor` | `backstory.street_vendor` | `live` | `account` | 2 account Legacy | Crowded market lanes, stall work, bargaining, and errand running shaped your practical sense of value and attention. |
| `legacy.backstory.net_tender` | `backstory.net_tender` | `live` | `account` | 2 account Legacy | Nets, wet rope, weather, fish handling, and patient shoreline labor shaped your respect for water and routine. |
| `legacy.backstory.gatherer` | `backstory.gatherer` | `live` | `account` | 2 account Legacy | Field collection, path memory, useful plants, and cautious foraging shaped your patience and practical survival habits. |
| `legacy.backstory.scribes_apprentice` | `backstory.scribes_apprentice` | `live` | `account` | 2 account Legacy | Copying, ledgers, corrections, and administrative patience shaped your habits of memory, accuracy, and record work. |
| `legacy.backstory.kitchen_hand` | `backstory.kitchen_hand` | `live` | `account` | 2 account Legacy | Stores, fires, preparation, cleaning, and service rhythms shaped your discipline, timing, and respect for feeding others. |

Each record uses:

- `kind: "binary"`
- `classification: "permanent"`
- `purchaseMode: "unlock_only"`
- `currency: "account_legacy"`
- `scope: "account"`
- `duration: "permanent"`
- `implementationPriority: "live"`
- tags including `backstory` and `backstory_legacy`
- a single `account_flag` effect keyed to the Legacy unlock id

## Content / Runtime Boundary

- Live content JSON changed intentionally in `packages/content/base/player/legacy_unlocks.json`.
- The Legacy purchase surface changed intentionally because these five records can now appear as purchasable Legacy entries when requirements and currency permit.
- Purchase execution changed intentionally for these five live records because `purchaseLegacyUnlock(...)` can now purchase them as normal account-owned unlocks.
- No Backstory Eligibility resolver semantics changed.
- No resolver caller wiring changed.
- No creator purchase evidence is passed into the resolver yet.
- No creator availability behavior changed.
- No starter skills, starting abilities, attributes, items, coin, contacts, discounts, market effects, business ownership, boats, resource generation, mounts, medicine, magic access, social status, family history, institution membership, legal authority, estate/title ownership, oath behavior, or present employment were added.
- No parent/child backstory stacking was added.

## Behavior / Runtime Confirmation

- Live Backstory Legacy records were added for Street Vendor, Net-Tender, Gatherer, Scribe's Apprentice, and Kitchen Hand.
- The records are visible/purchasable through existing Legacy/account-meta purchase presentation when requirements and currency permit.
- `purchaseLegacyUnlock(...)` can purchase the five migrated records.
- Purchased migrated records create normal account `legacyUnlocks`, not family ownership.
- `resolveOwnedBackstoryLegacyPurchaseIds(...)` can collect the owned ids when they are passed as live runtime definitions and account-owned unlocks.
- Creator availability did not change.
- Backstory Eligibility resolver wiring did not change.
- Family-scoped behavior did not change.
- No Backstory Legacy purchase records were added for higher-risk candidates.
- No Backstory Eligibility policy JSON or design metadata JSON changed.
- No creator UI, account meta React component, family picker, Bloodlines UI, family management, Family Prestige spending, automatic family creation, heir slots, heirlooms, bequests, Chronicle Marks, Lineage Seals, magic runtime, combat math, economy simulation, or generated UI output changed.

## Tests / Checks Run

- `npm.cmd run tool:content-lint` - passed; `content-lint: ok (53 files checked)`.
- `node --test tests\unit\backstory-legacy-catalog-guard.test.mjs` - passed (10 tests).
- `node --test tests\unit\backstory-legacy-purchase-content-draft.test.mjs` - passed (5 tests).
- `node --test tests\unit\backstory-legacy-purchases.test.mjs` - passed (10 tests).
- `node --test tests\unit\backstory-creator-availability.test.mjs` - passed (7 tests).
- `node --test tests\unit\backstory-eligibility*.test.mjs` - passed (21 tests).
- `node --test tests\unit\legacy-start-resources.test.mjs` - passed (8 tests).
- `node --test tests\unit\legacy-unlocks.test.mjs` - passed (21 tests).
- `node --test tests\unit\legacy-ledger-presentation.test.mjs` - passed (13 tests).
- `git diff --check` - passed; PowerShell/Git reported line-ending normalization warnings only.

Broad typecheck was not run for this content migration pass; prior handoffs note broad workspace typecheck has known blockers, and the requested validation set was focused.

## Risks / Follow-Up

- These records are now live/purchasable, but they still do not affect Backstory Eligibility until resolver purchase evidence is wired in a later pass.
- Resolver integration must collect owned purchase ids through `resolveOwnedBackstoryLegacyPurchaseIds(...)`; it should not hand-copy ids from account state or invent family ids.
- Creator availability should only change in the next scoped resolver integration pass, with tests proving account-scoped purchases can unlock only their intended low-risk records.
- The existing draft catalog remains useful as guardrail/source documentation until the migrated records and remaining deferred candidates are folded into a durable design note or rejected.
- Higher-risk candidates remain deferred until their owning evidence systems exist.

## Temporary Guardrail Cleanup Decision

- Keep `docs/design/backstory-legacy-purchase-content-draft.json` for now. The five low-risk candidates have migrated live, but the file still records the formative-past copy rules and explicitly deferred higher-risk candidates.
- Keep `docs/design/backstory-legacy-purchase-integration-plan.md` through resolver integration.
- Keep `docs/design/backstory-evidence-ownership-plan.md` through resolver evidence integration.
- Keep `docs/design/legacy-scope-bloodline-economy-plan.md` for Bloodlines, family-scoped purchase, bequest, and heirloom boundaries.
- Keep `docs/dev/prompt-template-hardening-pass.md` while future prompts still need guardrail scaffolding.
- No temporary guardrail docs were deleted in this pass.

## Next Recommended Version

Version 0.5.68 - Backstory Legacy Purchase Resolver Integration

Wire only owned, account-scoped Backstory Legacy purchase ids from the runtime ownership helper into the Backstory Eligibility resolver caller path so the five migrated low-risk records can affect creator availability without changing resolver policy semantics or adding family evidence.

## Suggested Commit Message

feat(legacy): add live backstory purchase records
