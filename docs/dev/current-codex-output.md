# Current Codex Output

Source version/run: Version 0.5.69 - Backstory Legacy Creator Copy And Handoff Cleanup
Date: 2026-05-21
Branch/status assumption: Ran locally on `master`; initial `git status --short --branch` was clean at `## master...origin/master`.

## Result

Cleaned the post-0.5.68 Backstory Legacy integration surface without adding new behavior. Player-facing creator locked copy now avoids internal terms and current-identity implications, Backstory Eligibility policy metadata is aligned to the current cleanup version, and the stale GPT handoff and roadmap pipeline now reflect that the low-risk account-scoped Backstory Legacy slice has landed.

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
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-legacy-catalog-guard.test.mjs`
- `tests/unit/backstory-legacy-purchase-content-draft.test.mjs`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/legacy-unlocks.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`

## Files Changed

- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Copy / Metadata Cleanup

Creator locked/unavailable copy was left conservative and adjusted only where it exposed internal framing. The visible fallback text now talks about missing records, narrative openings, or origins not being ready for the current creator. It no longer uses player-facing words such as evidence, policy, resolver, source-run, runtime, catalog, draft, guardrail, account-scoped, or raw backstory ids.

The copy does not imply that a purchased backstory makes the new character currently employed as a street vendor, net-tender, gatherer, scribe, kitchen hand, or any other present job or social identity. It also avoids promising family history, institution membership, estate/title ownership, contacts, discounts, items, coin, skills, magic, authority, or obligations.

`BACKSTORY_ELIGIBILITY_POLICY.policyVersion` was updated from `0.5.56` to `0.5.69`. The existing `contentVersion` remains `current-live-backstories-27` because this pass did not change live backstory content. Policy reason text was cleaned to avoid implementation wording such as "resolver use"; rule predicates and resolver behavior were not changed.

Focused tests now assert the updated policy version/content version and enforce the stricter player-facing locked-copy guard.

## Handoff / Roadmap Cleanup

`docs/dev/current-gpt-handoff.md` was replaced with a short current handoff instead of appending to stale material. It now records that:

- `Version 0.5.67 - Backstory Legacy Live Content Migration` migrated the five low-risk records live.
- `Version 0.5.68 - Backstory Legacy Purchase Resolver Integration` wired owned account-scoped purchases into creator availability through `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- The five live mappings are `legacy.backstory.street_vendor` -> `backstory.street_vendor`, `legacy.backstory.net_tender` -> `backstory.net_tender`, `legacy.backstory.gatherer` -> `backstory.gatherer`, `legacy.backstory.scribes_apprentice` -> `backstory.scribes_apprentice`, and `legacy.backstory.kitchen_hand` -> `backstory.kitchen_hand`.
- The creator caller does not infer or supply `familyId`.
- Family/source-run/region/institution/estate/title/heir/preparation scoped Backstory Legacy evidence and higher-risk candidates remain deferred.
- Future Backstory Legacy records must stay formative-past access, not current identity.

`docs/dev/project-roadmap.md` now marks `0.5.64` through `0.5.68` as landed where appropriate, sets `0.5.69` as the current cleanup pass, and sets `Version 0.5.70 - Heirloom And Bequest Systems Plan` as the next recommended direction. The roadmap was not rewritten beyond active-pipeline drift and immediate near-term labels.

`docs/future_content_backlog.md` received a concise run note that this cleanup is complete and that scoped Backstory Legacy evidence, Family Prestige spending, higher-risk candidates, Bloodlines UI, creator purchase UI, generated UI output, and broader creator changes remain deferred.

## Behavior / Runtime Confirmation

- Backstory Eligibility resolver behavior changed: No. This pass changed metadata and explanatory copy only.
- Creator availability behavior changed: No. Owned account-scoped Backstory Legacy purchase behavior remains the 0.5.68 behavior.
- Live Legacy content changed: No. `packages/content/base/player/legacy_unlocks.json` was not edited.
- Account meta purchase behavior changed: No.
- Family-scoped behavior changed: No.
- `backstories.json` changed: No.
- Generated output changed: No. `apps/rpg-ui/dist` was not touched.
- Deferred systems were touched: No runtime/deferred systems were implemented. They were only re-documented as deferred.
- Player-facing locked copy changed: Yes, copy-only, to remove internal terms and current-identity implications.

## Tests / Checks Run

- `npm.cmd run tool:content-lint` - passed; `content-lint: ok (53 files checked)`.
- `node --test tests/unit/backstory-creator-availability.test.mjs` - passed; 18 tests.
- `node --test tests/unit/backstory-eligibility-resolver.test.mjs` - passed; 14 tests.
- `node --test tests/unit/backstory-eligibility-policy.test.mjs` - passed; 8 tests.
- `node --test tests/unit/backstory-legacy-catalog-guard.test.mjs` - passed; 10 tests.
- `node --test tests/unit/backstory-legacy-purchase-content-draft.test.mjs` - passed; 5 tests.
- `node --test tests/unit/backstory-legacy-purchases.test.mjs` - passed; 10 tests.
- `node --test tests/unit/legacy-start-resources.test.mjs` - passed; 8 tests.
- `node --test tests/unit/legacy-unlocks.test.mjs` - passed; 21 tests.
- `node --test tests/unit/legacy-ledger-presentation.test.mjs` - passed; 13 tests.
- `git diff --check` - passed with Windows line-ending warnings only.

Broad typecheck was not run; previous handoffs record known broad workspace typecheck blockers, and this pass stayed to copy, metadata, docs, and focused validation.

## Risks / Follow-Up

- `docs/dev/project-vision-and-continuity-brief.md` still contains older active-pipeline references. It was inspected but left unchanged because this pass was scoped to player copy, policy metadata, GPT handoff, roadmap drift, backlog note, and output reporting.
- Temporary Backstory Legacy guardrail docs still carry useful scoped/family evidence planning details; revisit them when that future work is planned or explicitly promoted into durable docs.
- Future policy metadata updates should keep the policy-version test aligned.
- Broad typecheck remains a separate cleanup/tooling concern.

## Temporary Guardrail Cleanup Decision

Kept `docs/design/backstory-legacy-purchase-content-draft.json` because it still records formative-past copy constraints and deferred higher-risk Backstory Legacy candidates.

Kept `docs/design/backstory-legacy-purchase-integration-plan.md`, `docs/design/backstory-evidence-ownership-plan.md`, and `docs/design/legacy-scope-bloodline-economy-plan.md` because they still preserve family/source-run/scoped evidence boundaries, Bloodline/economy constraints, and future scoped storage guidance that was not fully folded into durable docs in this cleanup pass.

No temporary guardrail files were deleted. The immediately relevant low-risk account-scoped status and next direction were folded into `docs/dev/current-gpt-handoff.md` and `docs/dev/project-roadmap.md`.

## Next Recommended Version

Version 0.5.70 - Heirloom And Bequest Systems Plan

This is the best next step because the low-risk account-scoped Backstory Legacy slice has now been migrated, wired into creator availability, and cleaned up in handoff/roadmap docs. The roadmap should return to the previously planned heirloom/bequest planning sequence before any Bloodlines or scoped Legacy behavior is implemented.

## Suggested Commit Message

docs(dev): align backstory legacy handoff
