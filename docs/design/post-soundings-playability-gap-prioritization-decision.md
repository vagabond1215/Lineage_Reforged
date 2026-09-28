# Post-Soundings Playability Gap Prioritization Decision

Date: 2026-09-28. Status: **PLAYABILITY_PRIORITY_SELECTED**; selected Activity presentation repair subsequently verified.

## Selected repair closure

`Activity Revenue Presentation Truthfulness Repair` is complete at implementation commit `c2d07ac8d4b4e1a404687cbd9d86c533feeb9222`. The ordinary creator, accepted contract, travel, and active-survey Activity render were verified in an isolated local QA campaign under explicit user authorization. The metric reads `Not tracked` with a plain explanation while Soundings action readiness and the other Activity metrics remain visible. The focused repair record is `docs/dev/activity-revenue-presentation-truthfulness-repair-2026-09-28.md`. This closure does not consume any reopening trigger in the ranked table below or authorize another candidate's implementation.

Repository: `vagabond1215/Lineage_Reforged` only. Inspected clean synchronized master `35d8dd016e802db42c58185d4699756c13ca0507`. Label class unversioned; parent not applicable; development milestone impact `none`; game-version impact `none`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x` remain unchanged.

## Decision and evidence

Select **Activity Revenue Presentation Truthfulness Repair**, an unversioned bounded presentation repair. Replace the fabricated daily-revenue value with an explicit unavailable state and plain explanation that daily revenue is not currently tracked. Do not show zero as a substitute, derive daily income from the wallet, infer income from quest payment or create a revenue owner. Preserve the other Activity metrics and gameplay controls. This supplies a truthful interpretation of the existing playable loop; it adds no economic gameplay or release maturity.

The original `game-0.1.x-playability-gap-prioritization-decision.md` ranked targeted UI work second after Soundings closure. That first-ranked package is now implemented, independently accepted and published under `game-0.1.1-prealpha-publication-acceptance-decision.md`. Reopening its completed return/payment work would duplicate accepted work. Complete Git comparison from accepted runtime `7c8c980d01892b0f673afc5a5940aec33ad2d7a2` to inspected source has no differences outside docs and GAME_VERSION, so the retained ordinary browser path remains relevant.

Fresh source confirms `apps/rpg-ui/src/runtime/uiViewModel.ts:2570` labels a literal `842` as Daily Revenue and asserts revenue is read from session activity records. There is no calculation in this metric. `UiViewModelContext.tsx` delivers the projection; `apps/rpg-ui/src/features/ActivityPanel.tsx:170` renders its label, value and detail without an unavailable distinction. Independent ordinary browser evidence at `docs/dev/evidence/soundings-post-f3-acceptance-2026-09-25/browser.md` observed the same amount with no business records. The source and preserved observation jointly establish the narrow misleading claim; this decision does not claim a fresh browser run or absence of all economy code.

The accepted `ui-information-architecture-boundary.md` requires read-only owner projections and preservation of uncertainty. Removing a fabricated numeric claim needs no new authored economic terms. The existing wallet remains authoritative currency; the accepted Soundings reward is exactly +5g once, not recurring income.

## Bounded comparison

Ranking is qualitative scope judgment, not an effort estimate or a commitment to implement every row.

| Rank / candidate | Player payoff and dependencies | Risk, size and regression burden | Disposition / reopening trigger |
| --- | --- | --- | --- |
| 1. Activity revenue truthfulness | Corrects a proven monetary claim on the ordinary survey screen; no new domain owner needed | Small projection/copy patch; preserve controls and all other metrics; rendered ordinary path and build verification | Selected exact package above |
| 2. Campaign storage headroom | Protects further multi-session play; measured peak leaves only 166,674 bytes under the probe's 5 MiB limit | Material publication/provenance/retention risk; cannot delete accepted witness or history to gain space; needs bounded growth measurement and retention contract before a repair | Reopen before longer-campaign or additional durable-history expansion, or any ordinary quota failure; finite accepted path remains passing |
| 3. Other targeted presentation/accessibility | Unknown Watch and diagnostic panels impair readability; no broad redesign needed to inspect each | Time label requires clock/caller characterization; hiding diagnostics requires visibility boundary; keyboard/reflow evidence absent | Separate characterized slice; move ahead if a demonstrated issue blocks ordinary play. No blanket cleanup permission |
| 4. Harbor defeat/recovery reachability | Supports failure continuation and future ordinary combat | Existing safe-settlement fixture proof does not establish harbor eligibility; may require location/context or authored recovery decision | Before adding ordinary encounter/defeat exposure; do not silently mark harbor safe |
| 5. Inventory/equipment | Adds meaningful item choice and eventual unique rewards | Existing stack and equipment/stash identities require selected consumer, instance/provenance/save decisions; medium/large regression surface | Select one same-item/unique-item consumer before implementation |
| 6. Combat/challenges | Adds tactical agency using existing engine capability | Ordinary encounter admission, commands, outcomes, defeat/recovery, restart and rewards need a bounded lifecycle | Choose encounter and recovery contract first; screen alone is insufficient |
| 7. Crafting/trade | Makes goods/currency useful | Authored recipes/calculations do not establish atomic player consumption/output/wallet/stock ownership | One selected transaction and accepted owner contract first |
| 8. Lineage, NPC/services, content breadth | Strong identity and broader options | No single next interaction selected; persistence/promotion and consumer dependencies; broad package risk | Select one lineage interaction or persistent-person consumer; add content only for an accepted runtime consumer |

Rows 5-8 reuse the earlier focused inventory/NPC and candidate inspection as planning evidence, not new implementation authority. Unchanged production establishes no intervening implementation that closes those recorded prerequisites. Storage evidence is `docs/dev/evidence/soundings-post-f3-acceptance-2026-09-25/storage-d/README.md`: 45 writes, retained 4,320,700 bytes, peak 5,076,206 / 5,242,880. It proves one finite sequence only. The accepted admission provenance/retention contract owns witness preservation. No capacity failure or ordinary harbor-recovery acceptance is inferred here.

## Selected implementation boundary and acceptance

Owner: existing UI view-model projection, consumed by ActivityPanel. Start with `apps/rpg-ui/src/runtime/uiViewModel.ts`; change ActivityPanel only if the existing text rendering cannot express the truthful state. No new production dependency, generic metric framework, revenue model, schema, save migration or engine change. Preserve six-domain navigation and Activity actions. No Home/search redesign, Window Standards cleanup, Unknown Watch fix, wallet/reward change, combat/recovery change or storage compaction in this package.

Implementation requirements:

1. Daily Revenue conveys unavailable/not tracked, never fabricated 842, false zero, wallet total or projected recurring Soundings payment. Replace the misleading bridge/source explanation with player-facing copy.
2. Verify source path and rendered ordinary Activity page with fresh creator/accepted survey context; preserve action readiness and current-activity/operation summaries. Inspect narrow and wide viewport readability and accessible text; do not claim comprehensive accessibility.
3. Build with the app-local Vite entrypoint; run Node configuration typecheck and compare broad UI diagnostics against the unchanged 137 baseline without calling it green. Check source diff, whitespace and absence of mutation-side changes. This simple literal presentation patch does not need a test that only repeats its string; use rendered evidence and relevant existing tests only if behavior changes.
4. Do not rerun the full accepted 183-test Soundings matrix for a literal presentation-only patch unless the diff changes gameplay or reveals contradictory behavior. Stop and re-scope before crossing owner boundaries.
5. Record exact source/implementation/publication identities, rendered evidence, limits and next route. Do not self-promote the game version or development milestone. Any future version calibration must establish a meaningful playable-build delta separately.

No unresolved product question blocks this selected unavailable-state presentation. Broader economic semantics remain deferred. The next run is implementation, not another open-ended prioritization pass.

## Checks, guardrails and retained branches

Current run: fresh fetch/prune, clean source and source/upstream equality; scoped open-PR query returned zero; one local/four hosted branches. Full non-doc/non-GAME_VERSION delta from accepted runtime empty. Read-only source-to-renderer trace and complete retained evidence comparison; no new executable/browser test run. Known 137 UI diagnostics, finite storage headroom, harbor recovery, presentation debt, absent comprehensive accessibility and hosted acceptance remain.

FP-001/017: distinguish preserved ordinary UI proof from fresh source trace; require rendered next-run proof. FP-002: selection is not implementation acceptance. FP-008/009: exact source and separate later publication, protected branch/PR review. No new persistence repair is undertaken; deeper persistence guardrails remain mandatory for the deferred storage/recovery routes.

Retained refs unchanged: readiness `59c103c3a06d55f35bffa735fd4b7814dffb583e` PROTECTED_REFERENCE until scheduled readiness/regression or protection review; prompt-integrity `58a34e37ee531aa1f6c87086b4a4a6d20d571f9f` PROTECTED_REFERENCE until dedicated prompt/execution-pointer audit; administration `210df5bcc017a8f31d621a553b5496c668540d29` HOLD_NAMED_CONSUMER until administration/template/governance or explicit Lineage retrospective. Merge bases and unique paths unchanged; starting divergence 420/2, 367/1, 198/1 respectively. No trigger consumed, disposition change, integration, deletion, merge, rebase or PR action due/performed.
