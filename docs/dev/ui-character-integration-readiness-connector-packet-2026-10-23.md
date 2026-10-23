# UI Character Stack: Connector Integration And Acceptance Preflight

Date: 2026-10-23. Repository: `vagabond1215/Lineage_Reforged`. **Source-read-only Connector audit; documentation publication only.** This file is not independently executed local, CI or browser evidence. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `DEV-0.7.2_NOT_READY`, `GAME_VERSION_NOT_READY` remain.

## Routing and exact heads at review

At audit start hosted master was `f56229dde859b9374a54368bd8a8fd2a9872daa1`. Publishing this packet and the current prompt will advance master by documentation commits only; refresh its new head before running.

| PR | Role | Head at audit | PR dependency |
| --- | --- | --- | --- |
| #5 | UI intent/docs, guidance | `8980ea3875491bf631a18926feb75f90ffa1b55f` | master |
| #7 | Character Overview, sections | `8610260fd40a7b371a4789e954f53fc884ad71df` | master |
| #8 | Live top bar | `20825cce24703e5066fb827075d5f310e847fb34` | master |
| #9 | Responsive shell | `69215b6fa6b4bcc805363171541120645f365d8c` | master |
| #10 | Equipment resolver and owner | `9f390e03a26011213dee53929da309f470adba62` | master |
| #11 | Equipment/Inventory Character UX | `2d140c4a2693345fa4f8188bb9e2e625b186538f` | #7 |
| #12 | Consume stale-stack owner | `7b6dccf592adbbef05361bb501fceb461dd1f5e5` | #10 |
| #13 | Exact validated source bag | `c9581eb9834d9c1374560b3a4b26bbdf1dae210d` | #12 |
| #14 | UI row selection identity | `ce2fc143e7e5672c986d162d6ed714bad243ac46` | #11 |

All listed PRs were open, draft and unmerged at audit. #6 nutrition remains independent draft and is **not** part of this composition.

**Provenance-safe composite plan:** independently assemble latest #7→#11→#14 Character branch, #10→#12→#13 owner branch, and independent #8 top bar and #9 mobile shell in a disposable local worktree. Source/test composition must be inspected for semantic overlaps; preserve each original `docs/dev/branch-disposition-register.md` history instead of taking a single overlaid copy. Draft GitHub mergeability cannot establish semantic integration. No integration into master or existing PR retarget is authorized by this packet.

## Last confirmed owner/UI repair evidence (Codex-reported)

- PR #10: supported canonical equipment slots, displacement/durability conservation; selected Equip/Unequip/Re-equip held.
- PR #11: Equipment/Inventory usable owner-backed UX and inventory-object-change selection safety; controlled browser-only evidence.
- PR #12: stale Breast Cut entry cannot remove Arrow Bundle and apply unrelated effects.
- PR #13: validates and mutates the same indexed bag, even for duplicate bag IDs; controlled 20/20 owner, 31/31 composed UI, 106/106 game regression; duplicate same-ID UI row selection left held.
- PR #14: `inventoryPresentationId` uses live location+container index+stack index+item ID/key+unchanged entry ID. React key, click selection and selected styling now use this presentation key. Original owner `InventoryEntry` remains unchanged for Equip/Use. Ambiguous persisted row pin controls are disabled. Pre-edit 0/1 (second bag selects first); post-edit 8/8 focused, 32/32 composite with #13, 106/106 game regressions; Node typecheck/Vite builds reported pass, broad UI TS baseline red 136 on UI and 135 composed with zero introduced normalized signatures. **These numbers were not rerun by Connector.**
- GitHub PR #14 had no commit status checks or associated workflow runs in the last inspection. No independent CI/build claim.
- The latest selected acceptance attempt was stopped because the browser policy denied localhost access. This is a **tool/access limitation**; no authorized selected Equip/Use/Save and full client restart/readback was observed. Fixture/state/SSR assertions do not close selected-client gates.
- Current stack model has fungible stacks and no per-instance durable identity. Identical stack compaction and duplicate bag ID semantics remain bounded by the current owner; no new instance identity is approved. Pinning colliding persisted row IDs remains unavailable by design.

## Exact acceptance and reviewer matrix

**Independent code review first:** verify PR #14 source and interaction binding (not only SSR helper tests), PR #13 action target identity/quantity, PR #12 rejection conservation, PR #10 eligibility, #8/#9 non-obscuring mobile shell. Check that real selected row click sends the second bag's **unmodified** `InventoryEntry` to #13, no stale target after quantity mutation, filter, search, sort, favorite or SaveSnapshot reload; verify appropriate pin disable reason. No speculative bug fix without failing reproduction.

**Selected gameplay only if permitted:** before browser steps, verify the execution surface legally permits local web/localhost and a user-authorized isolated game profile/campaign. Do not infer available credentials/session from historical combat records. If access is denied, do not reroute or retry disallowed tooling. Report `EQUIPMENT_INVENTORY_SELECTED_INTERACTION_UNVERIFIED` and the exact practical user/browser handoff. Controlled regression review can continue independently but cannot imply selected proof.

If explicitly authorized access exists, use ordinary player UI for Character Overview→Equipment→Inventory; keyboard and focus; eligible equip→unequip→re-equip; occupied displacement if owned gear permits; authored Use with before/after item quantities and body effects; warnings; Settings Save → close/restart client → sign-in/load same slot → item/equipment/body readback. Measure/observe 320×667, 375×667, 768×1024 and 1440×900, condition popup and zoom where permitted. Classify each datum as selected, controlled, source-based or held. Browser-host HTTP 200, SSR, unit tests and page refresh are **not** full selected Save/restart proof. Lack of a naturally available item means that item-specific row is HELD, not synthetic-selected acceptance.

**Independent review outputs:** exact composition source manifest; conflicts and nonconflicts; focussed regression command/exits, Node typecheck, Vite build, broad TS normalized same-environment baseline; acceptance matrix VERIFIED/FAILED/HELD; branch lifecycle dispositions and preservation of individual register entries; minimal next access/owner blocker; no merge or version advancement absent new explicit authorization.

## Route preservation

The formerly installed `DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair` has **not** run to completion or been accepted merely because the current prompt changes. Its exact prior prompt body is preserved at `docs/dev/deferred-dev-0.7.2.13-combat-action-result-disclosure-prompt-2026-10-23.md`, and the unchanged current combat output/handoff remain historical evidence. Combat result disclosure and DEV parent acceptance stay held for an explicit reactivation.

Connector safe-pass summary: live PR status/base/head inventory, independent diff/record inspection, source and acceptance boundary mapping, prompt route preservation. No production source, schema, test, save, PR base, integration branch or protected ref mutation. No local commands, browser actions, or CI checks run by Connector.
