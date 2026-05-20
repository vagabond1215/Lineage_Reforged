# Current Codex Output

Source version/run: Version 0.5.64 - Backstory Legacy Purchase Content Draft
Date: 2026-05-20
Branch/status assumption: `master`; working tree was clean before initial edits, and current changes are limited to this pass.

## Result
Added an inert, draft-only Backstory Legacy purchase content catalog outside the live Legacy unlock catalog, plus focused guard tests proving it is not imported, visible, purchasable, passed into resolver evidence, or reflected in creator availability.

## Route Chosen
Route A was chosen.

`packages/content/base/player/legacy_unlocks.json` is a live catalog consumed by `getLegacyUnlockDefinitions()`, account meta presentation, and `purchaseLegacyUnlock()`. Adding `legacy.backstory.*` records there without a guard would risk visible purchase cards and purchasable runtime unlocks. The safer route is a draft-only non-runtime catalog in `docs/design/backstory-legacy-purchase-content-draft.json`, with tests proving it stays inert.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/dev/prompt-template-hardening-pass.md`
- `packages/content/base/player/legacy_unlocks.json`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`

## Files Changed
- `docs/design/backstory-legacy-purchase-content-draft.json`
- `tests/unit/backstory-legacy-purchase-content-draft.test.mjs`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Content / Runtime Boundary
Added draft-only design JSON, not live runtime content JSON. No runtime source behavior changed. The live Legacy catalog, Backstory Eligibility policy, resolver behavior, creator projection, account meta UI, schemas, and generated UI output were not changed.

The new draft catalog contains five low-risk Tier 1 candidate records:

- `legacy.backstory.street_vendor` -> `backstory.street_vendor`
- `legacy.backstory.net_tender` -> `backstory.net_tender`
- `legacy.backstory.gatherer` -> `backstory.gatherer`
- `legacy.backstory.scribes_apprentice` -> `backstory.scribes_apprentice`
- `legacy.backstory.kitchen_hand` -> `backstory.kitchen_hand`

The draft explicitly excludes medium-risk or blocked candidates such as Drover's Hand, Militia Levy, Merchant Family, Garrison Ward, Minor Noble, Local Champion, World-Stray, Hedge Adept, Temple Acolyte, Scholar's Apprentice, and Performer.

## Behavior / Runtime Confirmation
- Backstory Legacy purchase records were added only as draft-only non-runtime records in `docs/design/backstory-legacy-purchase-content-draft.json`.
- No live records were added to `packages/content/base/player/legacy_unlocks.json`.
- The records are draft-only, not live-catalog guarded records.
- Account meta purchase visibility did not change.
- Purchase execution did not change; draft ids return `unknown_unlock` through `purchaseLegacyUnlock()`.
- Creator availability did not change.
- Resolver evidence did not change; draft ids do not resolve into `legacyPurchaseIds`.
- Family-scoped behavior did not change; existing helper tests now also assert wrong-family isolation for a second family.
- No deferred systems were touched: no purchase UI, family picker, Bloodlines UI, family management, Family Prestige spending, automatic family creation, heirs, heirlooms, bequests, Chronicle Marks, Lineage Seals, magic runtime, combat math, economy simulation, generated UI output, or resolver/creator wiring changed.

## Tests / Checks Run
- `npm.cmd run tool:content-lint` - passed (`content-lint: ok`, 53 files checked)
- `node --test tests\unit\backstory-legacy-purchase-content-draft.test.mjs` - passed (7 tests)
- `node --test tests\unit\backstory-legacy-purchases.test.mjs` - passed (8 tests)
- `node --test tests\unit\backstory-creator-availability.test.mjs` - passed (7 tests)
- `node --test tests\unit\backstory-eligibility*.test.mjs` - passed (21 tests)
- `node --test tests\unit\legacy-start-resources.test.mjs` - passed (8 tests)
- `git diff --check` - passed with Git line-ending normalization warnings only for edited tracked files

Broad typecheck was not run for this content/guard-only pass; the previous handoff records known broad workspace typecheck issues, and this pass did not change TypeScript source.

## Risks / Follow-Up
- The draft catalog is intentionally inert. A later live content pass must deliberately migrate approved records into runtime-owned Legacy content with visibility, purchase, scope, storage, resolver, and UI tests.
- Route A avoids live exposure now, but the next resolver-integration prompt should not assume these draft ids are runtime-owned purchase ids.
- Backstory Legacy purchase resolver integration remains blocked until live purchase content, evidence ownership, and scope behavior are explicitly approved.
- Region, institution, estate/title, heir-only, next-run, and preparation-scoped purchase storage remain deferred.
- Family/source-run evidence and Family Prestige spending remain deferred.

## Temporary Guardrail Cleanup Decision
- `docs/dev/current-gpt-handoff.md`: keep for the current pipeline and 0.5.65 guardrails.
- `docs/dev/project-roadmap.md`: keep as the current roadmap source.
- `docs/dev/project-vision-and-continuity-brief.md`: keep as strategic continuity context.
- `docs/design/future-system-design-ledger.md`: keep as durable future-system criteria.
- `docs/design/backstory-legacy-purchase-integration-plan.md`: keep through Backstory Legacy purchase resolver integration.
- `docs/design/legacy-scope-bloodline-economy-plan.md`: keep through Bloodlines and Legacy scope work.
- `docs/design/backstory-evidence-ownership-plan.md`: keep for resolver evidence integration and blocked-owner constraints.
- `docs/dev/prompt-template-hardening-pass.md`: keep as a prompt guardrail; fold later only after its durable guidance is moved.
- `docs/design/backstory-legacy-purchase-content-draft.json`: keep until draft records are either migrated into approved runtime-owned Legacy content or rejected in a later reviewed pass.

No temporary guardrail or audit docs were deleted in this pass.

## Next Recommended Version
Version 0.5.65 - Backstory Legacy Purchase Resolver Integration

## Suggested Commit Message
docs(legacy): draft inert backstory purchase content
