# Duplicate-Bag Exact-Container Inventory Owner Preflight (Connector)

Date: 2026-10-23. Repository: `vagabond1215/Lineage_Reforged`. Classification: **read-only source analysis and documentation-only Codex preparation**, not executable proof, schema acceptance or gameplay acceptance. Documentation branch: draft PR #5 `parallel/ui-guidance-consolidation-2026-10-21`.

## Live refs and protected route

Hosted master `f56229dde859b9374a54368bd8a8fd2a9872daa1`; PR #5 prior source `a9cb100bd1c440b9139eea93d6f2105ac37bd36d`; Character #7 `8610260fd40a7b371a4789e954f53fc884ad71df`; top bar #8 `20825cce24703e5066fb827075d5f310e847fb34`; shell #9 `69215b6fa6b4bcc805363171541120645f365d8c`; equipment owner #10 `9f390e03a26011213dee53929da309f470adba62`; UX #11 `2d140c4a2693345fa4f8188bb9e2e625b186538f`; consume owner #12 `7b6dccf592adbbef05361bb501fceb461dd1f5e5`. All open/draft/unmerged at connector inspection. Refresh live heads before Codex implementation.

Installed `docs/dev/current-codex-prompt.md` on master remains **DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair**. This separate UI/owner prompt is **proposed, not installed**, and must not replace current combat output, handoff, prompt, game version, or planned route. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `DEV-0.7.2_NOT_READY`, `GAME_VERSION_NOT_READY`.

## Exact source map

- `packages/shared/types/src/contracts.ts`: `InventoryBag` has `id: string`, label, capacity, stacks. No distinct ID uniqueness invariant is encoded in the type. `PlayerInventoryState` stores `bags: InventoryBag[]` and overflow.
- `packages/shared/persistence/src/index.ts`: snapshot serialization is `JSON.stringify` / `JSON.parse` and does not itself enforce unique bag IDs. The selected acceptance preflight's local-only duplicate-bag probe was described in the user-supplied Codex output; it was not published to an implementation PR and has **not been rerun by this connector**.
- `apps/rpg-ui/src/features/characterPanelState.ts` on PR #12: `buildInventoryEntries` generates a bag entry containing `containerIndex`, `containerId`, `stackIndex`, item ID/key and quantity. Its derived UI row ID includes bag **ID**, item ID and stack index, **not bag array index**.
- `equipInventoryItem` (PR #10 / inherited by #12): validates `snapshot.playerState.inventory.bags[entry.containerIndex]` and its selected stack; after clone, mutates `nextInventory.bags.find(candidate => candidate.id === entry.containerId)`. With duplicate bag IDs, this can mutate a different bag than the validated one.
- `consumeInventoryItem` (PR #12): similarly validates indexed original bag and its item key, ID, quantity, catalog identity and generated row ID; after clone, locates by first matching `bag.id`. With duplicate bag IDs, it can remove an unrelated item while applying the selected item's authored effect.
- `cloneInventory` copies bags **in their original order** by mapping over the bag array, so a validated original index can be used to locate the corresponding cloned bag, subject to explicit revalidation. `addStackToInventory` separately chooses matching/open bag per existing fungible distribution rules; do not conflate intentionally distributed returned/displaced items with the **selected source bag**.
- PR #11's `CharacterPanel` selection guard invalidates on changed inventory object, but bag-index-agnostic UI row IDs can still collide if two bags share an ID and contain matching item/position. It does not prove distinct user-selected bag identity in duplicate-ID data.

## Test matrix and scope decision

Pre-fix tests **must fail meaningfully** on current PR #12 source, reproducing both wrong-bag Equip and Consume using two bags with same ID and distinct items. Use `buildInventoryEntries` to generate real entries for the intended second bag and assert actual initial selection. Test both bag orders and both actions. Check that no wrong item moves/consumes, no mismatched body effects apply, and rejection returns original snapshot/reference when used. Include legitimate unique-ID bags, bag reorder/stale container index/ID, missing bag/stack, overflow, quantity >1, final-unit consumption, slot displacement and supported SaveSnapshot serialize/reload.

Decide and document a consistent **fail-closed or exact-index owner policy** for duplicate IDs. The minimum invariant is: never read item data from one validated bag then mutate another bag. If exact-index repair is chosen, mutate only the cloned bag corresponding to the validated source index; do not fall back to the first ID match. If indistinguishable UI row IDs make action provenance ambiguous, retain a separate UI acceptance hold or reject ambiguous selections rather than claiming selected-player correctness. Inspect legitimate bag construction/loading for duplicate-ID production paths before broadening any contract. Do not add bag UUIDs, stack instances or schema migration for this bounded repair.

## Execution and branch route

Suggested implementation base: **exact current draft PR #12 tip** (already includes PR #10 owner behavior) into a new isolated owner repair worktree, e.g. `codex/inventory-bag-exact-target-repair`; publish a draft stacked PR against `codex/inventory-consume-stale-guard` only after local tests pass. Leave PR #10/#12 untouched. Compose with exact #7+#11 and #8/#9 in a **disposable validation checkout**. Preserve branch-register history and all open selected-client acceptance holds. Do not merge, rebase, retarget or delete prior PRs.

Browser-policy access failed in the last selected-client attempt. A browser-inaccessible Codex run must **not** relaunch selected-acceptance attempts or claim real actions/Save/client-restart proof. This is a local owner+regression slice; selected evidence belongs to a later authorized browser-capable surface.

Codex should run focused owner tests, UI composition and applicable SaveSnapshot/creator/body/combat caller suites, UI Node typecheck, Vite build, broad TS against same-environment baseline and `git diff --check`. Historical typecheck is red; distinguish introduced normalized signatures from counts. Codex should report pre/post failing proof, exact files/commit, copy-safe draft PR linkage and held acceptance gates. No connector tests/builds/CI were executed in this pass.

## Connector disposition

Current responsible next executable owner: **bag source-target alignment in Equip/Consume**. The previous selected-acceptance proposal is **temporarily deferred** until this owner gap is repaired and an authorized selected-client environment is actually available. Existing active DEV combat prompt and all implementation PR heads are retained.
