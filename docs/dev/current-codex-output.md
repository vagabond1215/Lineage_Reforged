# Current Codex Output

Source version/run: Version 0.5.65 - Backstory Legacy Live Content Readiness Decision
Date: 2026-05-20
Branch/status assumption: `master`; `git status --short` was clean before this pass, and the intended only file change is this handoff.

## Result
Decision: choose Route B for the next implementation. The five draft records are good formative-past candidates, but live Backstory Legacy content should not be added to `packages/content/base/player/legacy_unlocks.json` until a minimal live-catalog visibility/purchase guard exists and is tested.

Recommended next implementation:

`Version 0.5.66 - Backstory Legacy Live Catalog Guard`

Purpose: add the smallest Legacy catalog guard proving backstory-tagged `catalog_only` / `backlog` / draft-style records cannot appear as ordinary account-meta purchase buttons and cannot be purchased until intentionally exposed.

## Current Repo State Confirmed
- Latest exact Codex handoff is `Version 0.5.64 - Backstory Legacy Purchase Content Draft`.
- 0.5.64 landed Route A: `docs/design/backstory-legacy-purchase-content-draft.json` is draft-only, non-runtime content outside the live Legacy catalog.
- The draft contains exactly five low-risk Tier 1 candidates: `legacy.backstory.street_vendor`, `legacy.backstory.net_tender`, `legacy.backstory.gatherer`, `legacy.backstory.scribes_apprentice`, and `legacy.backstory.kitchen_hand`.
- Connector-side follow-up after 0.5.64 is present locally: draft records now use `playerFacingSummary` and `implementationSummary`, and tests guard against player-facing implementation wording.
- No draft ids are live Legacy definitions.
- No draft ids are purchasable through `purchaseLegacyUnlock(...)`.
- No draft ids appear in account meta.
- No draft ids enter resolver evidence.
- No draft ids alter creator availability.
- `packages/content/base/player/legacy_unlocks.json` remains the live imported Legacy catalog.
- `accountMetaPresentation.ts` maps `resolveLegacyUnlockStates(...)` output into visible unlock entries.
- `purchaseLegacyUnlock(...)` resolves directly from live catalog definitions.
- `implementationPriority`, `catalog_only`, and `backlog` are not currently sufficient visibility/purchase safety guards for Backstory Legacy records unless runtime/UI code enforces them.
- `docs/dev/project-roadmap.md` is stale for the immediate next step: it still says 0.5.64 is next and 0.5.65 is resolver integration. Newer `docs/dev/current-codex-output.md` and `docs/dev/current-gpt-handoff.md` supersede that sequence.

## Checks Run
- `git status --short` - clean before this pass
- `npm.cmd run tool:content-lint` - passed (`content-lint: ok`, 53 files checked)
- `node --test tests\unit\backstory-legacy-purchase-content-draft.test.mjs` - passed (8 tests)
- `node --test tests\unit\backstory-legacy-purchases.test.mjs` - passed (8 tests)
- `node --test tests\unit\backstory-creator-availability.test.mjs` - passed (7 tests)
- `node --test tests\unit\backstory-eligibility*.test.mjs` - passed (21 tests)
- `node --test tests\unit\legacy-start-resources.test.mjs` - passed (8 tests)
- `git diff --check` - passed with Git line-ending normalization warning only for `docs/dev/current-codex-output.md`

Broad typecheck was not run. Previous handoffs record known broad workspace typecheck blockers, and this pass did not change TypeScript source.

## Draft Content Review
The five draft records are suitable as formative-past concepts.

- `Market-Learned Habits` safely frames Street Vendor as crowded market lanes, stall work, bargaining, and errand running that shaped practical attention.
- `Water-Work Lessons` safely frames Net-Tender as wet rope, weather, fish handling, and shoreline labor that shaped routine and respect for water.
- `Field-Gathering Habits` safely frames Gatherer as field collection, path memory, useful plants, and cautious foraging that shaped practical survival habits.
- `Records-Room Training` safely frames Scribe's Apprentice as copying, ledgers, corrections, and administrative patience that shaped memory, accuracy, and record work.
- `Kitchen-Service Discipline` safely frames Kitchen Hand as stores, fires, preparation, cleaning, and service rhythms that shaped discipline and timing.

Checklist answers:

1. Are the five draft records suitable as formative-past concepts? Yes.
2. Are their `playerFacingSummary` fields safe for future player-facing use? Yes. They describe past shaping pressure and avoid current-job/current-status framing.
3. Is `implementationSummary` clearly internal-only? Yes. It uses internal draft wording and remains separated from future player-facing copy.
4. Are the records still inert and non-runtime? Yes. They live only under `docs/design/`, have `runtimeImportAllowed: false`, and are covered by inertness tests.
5. Is live `legacy_unlocks.json` currently safe to receive backstory records without new guards? No.
6. Would adding the five records live today accidentally expose purchase UI? It could. Live catalog definitions flow into account meta entries, and ordinary purchase buttons appear when catalog state reports `canPurchase`.
7. Would adding the five records live today make `purchaseLegacyUnlock(...)` accept them? Yes, if they are valid live definitions and their normal requirements/cost/eligibility pass. The function resolves directly by live catalog id.
8. Is resolver integration meaningful before live purchase records exist? Not for production behavior. The resolver can consume `legacyPurchaseIds`, but there are no live Backstory Legacy purchases to own those ids.
9. Should resolver integration be delayed until after live content ownership/exposure is settled? Yes.
10. Which exact route should the next implementation take? Route B: prepare live guarded content by adding the live-catalog visibility/purchase guard first.

## Live Content Readiness Decision
Route B is the right next route.

Do not keep drifting on Route A alone: the draft candidates and copy are ready enough to preserve as intended future content. Do not choose Route C yet: making the records live and purchasable would be a visible behavior change, and the current live catalog path does not yet have a Backstory-specific exposure guard.

The next implementation should add a minimal live-catalog guard before migrating the five records. That guard should ensure backstory-tagged records with non-live/draft/catalog-only/backlog priority cannot:

- appear as ordinary account-meta purchase buttons;
- be purchased through `purchaseLegacyUnlock(...)`;
- enter `resolveOwnedBackstoryLegacyPurchaseIds(...)` as owned resolver evidence unless explicitly live and owned;
- alter creator availability.

After that guard passes, a follow-up pass can migrate the five low-risk records into live runtime-owned Legacy content with deliberate scope, category, purchase mode, cost, visibility, and tests.

## Resolver Integration Readiness
Resolver integration is not ready now.

The resolver seam already exists and can evaluate `legacyPurchaseIds`, but integration should wait until there is approved live purchase content or a deliberate live ownership path. Wiring the resolver now would either have no production effect or would require fabricated purchase ids, which violates the trust-boundary guardrail.

Must land before resolver integration:

- a live-catalog guard for Backstory Legacy purchase records;
- explicit decision about whether the five records are hidden/catalog-only or intentionally visible;
- tests proving non-live backstory-tagged records are not visible/purchasable;
- tests proving only owned live Backstory Legacy definitions can become resolver `legacyPurchaseIds`;
- tests proving creator availability changes only through real owned purchase input.

## Recommended Next Version
Version 0.5.66 - Backstory Legacy Live Catalog Guard

Add a minimal Legacy catalog visibility/purchase guard so Backstory Legacy records can be migrated safely in a later pass without accidental account-meta exposure or purchase execution.

## Guardrails For Next Prompt
- Do not migrate draft records into `packages/content/base/player/legacy_unlocks.json` until the guard exists or the prompt explicitly scopes migration after the guard.
- Do not wire `resolveOwnedBackstoryLegacyPurchaseIds(...)` into the creator or resolver yet.
- Do not pass `legacyPurchaseIds` into resolver evidence yet.
- Do not add creator purchase buttons, account purchase UI redesign, family picker, Bloodlines UI, family management, Family Prestige spending, automatic family creation, heirs, heirlooms, bequests, Chronicle Marks, or Lineage Seals.
- Do not change Backstory Eligibility policy semantics unless a focused guard test proves a narrow issue.
- Do not change content JSON except in the later live-content migration pass.
- Treat `implementationPriority: "catalog_only"` and `"backlog"` as unsafe unless enforced by runtime/UI/purchase tests.
- Preserve current-data/no-compatibility behavior.
- Keep generated `apps/rpg-ui/dist` untouched.
- Required next tests should cover account meta visibility, `purchaseLegacyUnlock(...)` blocking, non-backstory Legacy unlock stability, draft catalog inertness, resolver evidence absence, creator availability stability, and existing Legacy start-resource behavior.

## Files Changed
- `docs/dev/current-codex-output.md`

No runtime source, live content JSON, schemas, UI, roadmap, handoff, backlog, or tests were edited.

## Behavior / Runtime Confirmation
No runtime source changed.
No live content JSON changed.
No schemas changed.
No UI changed.
No creator behavior changed.
No resolver behavior changed.
No purchase behavior changed.
No generated output changed.
No Backstory Legacy purchase records were migrated into the live Legacy catalog.
No resolver purchase wiring was added.
No visible backstory availability changed.

This pass only records the readiness decision and focused validation results.

## Risks / Follow-Up
- The roadmap remains stale until a separate docs maintenance pass updates the 0.5.65/0.5.66 sequence.
- The current live Legacy catalog path would expose/accept valid live records unless a guard blocks non-live Backstory records.
- Resolver integration remains easy to misuse if a future prompt fabricates `legacyPurchaseIds` instead of collecting them from owned live definitions.
- The five draft records are low-risk, but their future live migration still needs deliberate category, cost, scope, purchase mode, and exposure decisions.
- Family-scoped, region-scoped, institution-scoped, estate/title-scoped, and source-run-scoped Backstory Legacy purchases remain deferred.

## Suggested Commit Message
docs(legacy): record backstory live-content readiness decision
