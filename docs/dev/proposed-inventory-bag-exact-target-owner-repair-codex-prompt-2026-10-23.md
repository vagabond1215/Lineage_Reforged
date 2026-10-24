# Proposed Codex Task: Inventory Bag Exact-Target Equip/Consume Repair

**Status:** proposed parallel owner repair, **not installed** as the active Codex combat prompt. **Date:** 2026-10-23. **Repository:** `vagabond1215/Lineage_Reforged`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; development impact `supports_current_band`, Game-version impact `none`. Do not change the DEV-0.7.2.13 combat route, Game version or its current output/handoff.

## Mission and preflight

Repair the source-target mismatch discovered in a controlled duplicate-bag snapshot: Inventory Equip and Consume validate an indexed bag, then mutate the **first bag with the same ID**, which can be a different bag. Use the smallest coherent owner-level correction and independent failing-then-passing tests. No new item-instance, bag-UUID, save-schema, inventory transaction service or broad UI feature is authorized.

Read `AGENTS.md`, relevant branch/governance and failure-pattern rules, plus:
- `docs/dev/inventory-duplicate-bag-exact-container-connector-preflight-2026-10-23.md` on `parallel/ui-guidance-consolidation-2026-10-21`;
- `docs/dev/inventory-consume-stale-stack-repair-record-2026-10-22.md` on PR #12;
- PR #10 equipment-owner tests/record and PR #11 UI selection-hardening record;
- `packages/shared/types/src/contracts.ts`, `packages/shared/persistence/src/index.ts`, `apps/rpg-ui/src/features/characterPanelState.ts` and real CharacterPanel callers.

Fetch/prune and inspect actual synchronized master, local dirty worktrees, open PRs, protected/held refs, exact heads/merge bases and branch register. Connector-inspected starting points: master `f56229dd`; #7 `8610260f`; #8 `20825cce`; #9 `69215b6f`; #10 `9f390e03`; #11 `2d140c4a`; #12 `7b6dccf5`. Refresh live refs, do not assume stale source identity. PR #5 is documentation guidance, not production authority.

## A. Reproduce before editing

From the exact current PR #12-based owner source, write focused failing regression tests using **actual `buildInventoryEntries` projections**. Test two bags with the same `id` but different carried item stacks. Select an entry belonging to the *second* bag while the first contains a distinct item, and record before/after inventories, equipment and body-state effects.

Required failures:
1. **Equip:** an eligible Short Bow from the second bag must not equip the first bag's Arrow Bundle, decrement an unrelated stack, or misreport success.
2. **Consume:** Breast Cut selected from the second bag must not remove the first bag's Arrow Bundle while applying Breast Cut's authored effect.
3. Repeat with reversed bag order and varying index/quantity where relevant.
4. Include missing bag, stale index, mismatched bag ID, invalid/zero quantity, different current item ID/key and bag identity mismatches.

Use the most minimal representable SaveSnapshot; no fake new fields. The last local Codex preflight reported a disposable `duplicate-bag-acceptance-probe.test.mjs` at 0/2, but that uncommitted file is not assumed to be on GitHub or available in this worktree. Reproduce independently and show actual failing assertion output rather than referring to a historical local file.

## B. Decide and implement exact source ownership

Trace original validation, cloned inventory and mutation paths in both `equipInventoryItem` and `consumeInventoryItem`. The cloned `bags` array preserves bag ordering. After checking the live selected bag/index against entry identity, ensure mutation addresses that **same validated logical bag and current stack**, never an unrelated first ID match.

Select one explicitly justified owner policy:
- For a valid unambiguous indexed entry, mutate its same-index cloned bag with exact current-stack revalidation; OR
- Where duplicate IDs make ownership untrustworthy, **fail closed** with `Inventory Changed`, original snapshot reference and no effects or changes.

Neither choice may fall back to another bag on mismatch. State which policy applies to duplicate IDs, unique IDs and overflow, with tests for each. Do not silently trust a display-derived row ID as durable identity; `inventory.<bagId>.<itemId>.<stackIndex>` can collide across duplicate-ID bags. If the UI cannot uniquely select such rows, record a separate selected-UI hold instead of inventing instance identities.

Keep item quantity, equipped slot, displaced item, stash metadata, session flags and authored consumption effects conserved by existing owners. The standard `addStackToInventory` placement/merge behavior for displaced/returned items is separate from source-stack targeting and should not be globally rewritten.

Inspect whether current starter construction, legacy preparation and loading enforce or break bag-ID uniqueness. The type contract and `JSON.parse` serialization alone do **not** prove uniqueness. Document actual known construction vs representable malformed/synthetic states. Do not add broad schema validation or migration unless the focused invariant cannot otherwise be preserved; if so, stop with a decision-complete owner hold.

## C. Owner and integrated regression

After production repair, run:
- Newly failing-before/repaired-after duplicate-bag Equip and Consume tests, including original-snapshot preservation for rejected requests;
- PR #10 equipment slot/occupied displacement/quantity/durability/overflow tests;
- PR #12 stale Breast Cut vs Arrow Bundle, authored Bread Loaf/Breast Cut consumption, stack compaction, and SaveSnapshot roundtrips;
- Reordered bags, two legitimate unique-ID bags and missing/stale bags;
- A **disposable** source composition with #7+#11 Character, #10+#12+new owner repair, and #8+#9 top-bar/mobile;
- Relevant creator, body-state, combat and campaign persistence callers.

Run focused Node suites serially where Vite shares ports, app-local `npm run typecheck:node`, `npm exec -- vite build`, broad UI `npm run typecheck` with same-environment clean/stacked normalized diagnostic comparisons, and `git diff --check`. Record exact commands, cwd, exit code, pass totals and introduced diagnostic signatures. Existing broad TS is red: never call it green simply because counts match. Do not claim CI execution that was not observed.

## D. Isolation and output

Create an isolated owner-scoped branch from the **verified current PR #12 tip**, suggested `codex/inventory-bag-exact-target-repair`, with a **draft stacked PR targeting `codex/inventory-consume-stale-guard`** when all focused evidence supports publication. This retains both PR #10 equipment and #12 consume owners. Do not modify/rebase/merge/retarget PR #10 or #12, copy code into PR #11, or change any existing draft, historical register entry or protected ref. Preserve branch register history in composite worktrees. New files should be restricted to owner, focused tests and narrow evidence/register entries.

No selected-browser or authenticated gameplay acceptance is required for this bounded owner repair. The prior selected-client attempt was blocked by browser-use policy; do **not** retry a disallowed browser route, borrow credentials or claim real Equip/Use/Save/restart. Keep `EQUIPMENT_INVENTORY_SELECTED_INTERACTION_UNVERIFIED`, top-bar/responsive/zoom and Save/client restart gates open.

Do not edit active `docs/dev/current-codex-prompt.md` / combat current output/handoff, Game version, combat, creator, nutrition, content, schema, Home or UX layout. If a defect demands a second owner, report it and retain a held review trigger rather than expanding the patch without evidence.

## E. Final evidence

Report:
- **A. Exact refs and branch scope:** master/PR heads, worktree and files changed, final commit, draft PR base/head, unchanged pre-existing PRs, lifecycle actions (or explicitly none).
- **B. Pre-fix reproduction:** exact selected bags/entries, wrong-bag outcomes and failing tests.
- **C. Corrected owner invariant:** validation/mutation same-bag mechanism, duplicate-ID policy, wrong-target rejection/state conservation, limitations of UI row identity.
- **D. Tests/build:** commands, totals, exit statuses, broad TS baseline signature comparison, composition and serialization evidence.
- **E. Decision:** `DUPLICATE_BAG_WRONG_TARGET_REPRODUCED_AND_REPAIRED` only if no cross-bag removal/effect is possible in tested supported states; otherwise precise HELD status.
- **F. Next route:** independent review of this owner patch followed by actual selected-client Equipment/Inventory and Save/restart acceptance **only on an authorized browser-capable surface**, and then separately authorized multi-PR integration review.

Successful completion is the smallest truthfully tested exact-bag mutation fix with no acceptance overclaim. Do not manufacture a commit merely to repeat earlier evidence.
