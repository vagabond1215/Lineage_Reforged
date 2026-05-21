# Current Codex Output

Source version/run: Version 0.5.68 - Backstory Legacy Purchase Resolver Integration
Date: 2026-05-21
Branch/status assumption: Ran locally on `master`; initial `git status --short --branch` was clean (`## master...origin/master`) before edits.

## Result
Integrated owned account-scoped Backstory Legacy purchases into the character creator availability caller path. The creator now accepts the current account profile through `BackstoryCreatorAvailabilityOptions`, resolves owned live Backstory Legacy purchase ids with `resolveOwnedBackstoryLegacyPurchaseIds(...)`, and passes only those `legacyPurchaseIds` into the existing Backstory Eligibility evidence path.

The five live low-risk Backstory Legacy purchases can now make their matching formative backstories selectable when owned by the current account:

- `legacy.backstory.street_vendor` -> `backstory.street_vendor`
- `legacy.backstory.net_tender` -> `backstory.net_tender`
- `legacy.backstory.gatherer` -> `backstory.gatherer`
- `legacy.backstory.scribes_apprentice` -> `backstory.scribes_apprentice`
- `legacy.backstory.kitchen_hand` -> `backstory.kitchen_hand`

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
- `apps/rpg-ui/src/App.tsx`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `tests/unit/backstory-legacy-catalog-guard.test.mjs`
- `tests/unit/backstory-legacy-purchase-content-draft.test.mjs`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/legacy-unlocks.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`

## Files Changed
- `apps/rpg-ui/src/App.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Integration Design
Creator availability receives account evidence through the existing `BackstoryCreatorAvailabilityOptions` path in `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`. The options type now accepts `accountProfile` and an optional `legacyUnlockDefinitions` override for focused tests.

`buildBackstoryEligibilityEvidenceInput(...)` calls `resolveOwnedBackstoryLegacyPurchaseIds(...)` only when an account profile is supplied. It passes the current account profile and either the supplied test definitions or the live runtime definitions from `getLegacyUnlockDefinitions()`. The creator does not read `profile.legacy.legacyUnlocks` directly.

Only the helper result's `legacyPurchaseIds` are copied into `BackstoryEligibilityEvidenceInput`. Those ids flow through the existing `resolveBackstoryEligibility(...)` caller seam.

When no account profile is supplied, no purchase evidence is resolved or passed, so creator availability remains on the pre-existing achievement/source-run evidence path.

No `familyId` is supplied in this pass because the current creator path has no explicit real family-selection context. The integration intentionally does not infer family context from source run ids, lineage ids, account ids, selected characters, selected backstories, or UI state.

The policy/resolver change is narrow: the five live Tier 1 low-risk Backstory Legacy targets now carry account-scoped purchase requirements, and Tier 1 rules can be satisfied by their matching account purchase id. Tier 2 and higher rules still require their scoped evidence and are not unlocked by purchase evidence alone.

## Behavior / Runtime Confirmation
- Creator availability now changes for owned account-scoped Backstory Legacy purchases: each of the five live account-owned purchases makes only its matching backstory selectable.
- Unowned live low-risk Backstory Legacy records remain locked.
- Higher-risk candidates remain locked, hidden, or special according to existing policy.
- Resolver policy semantics changed only for the narrow Tier 1 account purchase-evidence path needed by this integration; existing no-evidence behavior, source-run requirements, family rules, and Tier 2+ purchase behavior remain covered by tests.
- Family-scoped behavior did not change. Family-owned records do not unlock creator availability without an explicit matching family context, and the creator caller does not supply one.
- Account meta purchase visibility and purchase behavior were not redesigned or edited; focused Legacy/account tests remain passing.
- Live `packages/content/base/player/legacy_unlocks.json` content did not change.
- `packages/content/base/player/backstories.json` did not change.
- Generated `apps/rpg-ui/dist` output was not touched.
- Family/source-run purchase evidence, Family Prestige spending, scoped purchase storage, purchase UI redesign, higher-risk Backstory Legacy candidates, Bloodlines UI, heir systems, magic runtime, combat math, economy simulation, and broader creator changes remain deferred.
- `docs/dev/current-gpt-handoff.md` and `docs/dev/project-roadmap.md` were not updated.

## Tests / Checks Run
- `node --test tests/unit/backstory-creator-availability.test.mjs` - passed, 18 tests.
- `node --test tests/unit/backstory-eligibility-resolver.test.mjs` - passed, 14 tests.
- `node --test tests/unit/backstory-legacy-purchases.test.mjs` - passed, 10 tests.
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `node --test tests/unit/backstory-legacy-catalog-guard.test.mjs` - passed, 10 tests.
- `node --test tests/unit/backstory-legacy-purchase-content-draft.test.mjs` - passed, 5 tests.
- `node --test tests/unit/backstory-eligibility*.test.mjs` - passed, 22 tests.
- `node --test tests/unit/legacy-start-resources.test.mjs` - passed, 8 tests.
- `node --test tests/unit/legacy-unlocks.test.mjs` - passed, 21 tests.
- `node --test tests/unit/legacy-ledger-presentation.test.mjs` - passed, 13 tests.
- `git diff --check` - passed; Git reported line-ending conversion warnings only for modified text files.

## Risks / Follow-Up
- The creator now depends on an account profile being passed through validation and start-snapshot creation; any future creator entry point must pass the profile when account-scoped purchases should affect availability.
- The new Tier 1 purchase path is intentionally narrow. Future Backstory Legacy candidates with family, source-run, region, institution, estate/title, heir, preparation, or higher-risk requirements still need dedicated scoped evidence design before they can affect creator availability.
- Creator locked copy remains conservative and does not explain purchase mechanics. A follow-up copy/handoff cleanup pass should verify whether any player-facing text should mention formative-background access without implying current employment or live social identity.
- Broad workspace typecheck was not run in this pass; previous handoffs note known broad typecheck blockers.

## Temporary Guardrail Cleanup Decision
Keep `docs/design/backstory-legacy-purchase-content-draft.json` and the related Backstory Legacy guardrail/planning docs for now. This run consumed the account-scoped low-risk resolver integration guidance, but the docs still preserve deferred higher-risk candidates, family/source-run evidence boundaries, copy guidance, and cleanup context for the next handoff pass. Revisit cleanup or promotion after the creator copy and handoff cleanup run.

## Next Recommended Version
Version 0.5.69 - Backstory Legacy Creator Copy And Handoff Cleanup

## Suggested Commit Message
feat(backstory): wire legacy purchase evidence into creator availability
