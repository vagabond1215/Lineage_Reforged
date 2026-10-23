# Proposed Codex Prompt: Equipment/Inventory Selected-Client Acceptance and Integration Rehearsal

**Date:** 2026-10-22. **Repository:** `vagabond1215/Lineage_Reforged`. **Classification:** unversioned, parallel UI acceptance proposal on draft design PR #5; **not installed** as `docs/dev/current-codex-prompt.md`. The independent active `DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair` remains untouched. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `DEV-0.7.2_NOT_READY`, and `GAME_VERSION_NOT_READY` remain unchanged.

## Mission

Independently test the current Character-first Equipment/Inventory stack through an **authorized authenticated selected campaign**, real owner actions, and Save/client restart/readback. In an isolated local disposable composition, assemble the exact PRs below and reconcile their semantic compatibility before any acceptance decision. **This task does not authorize merging or integrating into master.** Do not implement another UI feature or invent a new inventory owner.

## Hosted source inventory, revalidate before execution

| PR | Responsibility | Inspected head | Base |
| --- | --- | --- | --- |
| #5 | Design/routing guidance only | `1522bb2dd902e8aa918dbe740cbd6c9f02d47c4d` | master |
| #7 | Character Overview and horizontal subsections | `8610260fd40a7b371a4789e954f53fc884ad71df` | master |
| #8 | Top bar resource/condition projection | `20825cce24703e5066fb827075d5f310e847fb34` | master |
| #9 | Mobile shell and controlled fixture | `69215b6fa6b4bcc805363171541120645f365d8c` | master |
| #10 | Equipment canonical slot resolver/revalidation | `9f390e03a26011213dee53929da309f470adba62` | master |
| #11 | Equipment/Inventory presentation and selection hardening | `2d140c4a2693345fa4f8188bb9e2e625b186538f` | #7 |
| #12 | Consume live-stack rejection and owner conservation | `7b6dccf592adbbef05361bb501fceb461dd1f5e5` | #10 |

The last inspected hosted `master` was `f56229dde859b9374a54368bd8a8fd2a9872daa1`. All these PRs were draft and unmerged. Refresh live heads and compare with this packet, rather than trusting it after publication. PR #6 nutrition, creator work, protected/held refs and active combat are separate.

Read `AGENTS.md`, branch/integration policy, failure-pattern register, the current output/handoff/active combat prompt **read-only**, design PR #5's accepted UI decisions and owner-projection preflight, PR #9 mobile evidence, PR #10 equipment repair record, PR #11 integration hardening record, and PR #12 consume repair record.

## 0. Access gate: do not spend a full execution pass without a selected session

Before repeating existing deterministic suites, establish whether an **authorized isolated local gameplay account/profile and selected campaign** can be opened in the actual client. Historical selected combat records on master used user-authorized isolated local Chrome/Brave profiles, but those sessions and credentials are **not assumed to exist in this environment**.

- Use only a session, local test account, or user-assisted sign-in explicitly authorized for this run. Do not guess, request the disclosure of, reset or bypass passwords; do not access production/protected accounts.
- If a legitimate selected session is unavailable, document the exact access blocker and required user-assisted handoff, retain all selected gates, and **stop the selected-acceptance portion**. You may complete a narrowly useful semantic integration preflight but must not create another redundant browser-fixture run to disguise the missing selected evidence.
- Never treat a synthetic controlled fixture, a server HTTP 200, a screenshot, or a direct owner test as selected-client proof.

## 1. Exact composite worktree and semantic preflight

Fetch/prune; inspect clean/dirty state, relevant local worktrees, remote heads and merge bases. Build a **disposable integration worktree** with exact #7 → #11 UI, #10 → #12 owner code, and independent #8/#9 top-bar/mobile changes. Report the concrete composition method, source refs, overlaps, conflicts, and source provenance. Preserve all distinct `docs/dev/branch-disposition-register.md` histories; do not replace them with whichever copy merged last.

Before selected actions, inspect:
- Character Equipment/Inventory actual owner callers and session update path; ensure PR #11 uses PR #12's consume owner when composed.
- Starter and current Composite Bow/Short Bow equipment eligibility; display vs actual slot authority.
- Bag identity/uniqueness assumptions: PR #12 pre-validates a bag using `containerIndex` and later mutates by `containerId`. Verify existing model uniqueness guarantees or document the exact unresolved invariant. Do not widen this task into an inventory-instance/schema migration.
- PR #11 selection invalidation versus PR #12 live-stack revalidation; duplicate same-ID/key/quantity compaction remains formally indistinguishable under the current schema.
- SaveSnapshot and slot address/readback path, reusing established legitimate selected-game workflow.

If semantic conflicts are found, write a minimal reproducible issue/hold with exact affected paths and stop the disputed acceptance row. Do not silently cherry-pick fixes into an existing draft branch.

## 2. Selected gameplay acceptance matrix

Record baseline character, campaign/slot address, tick, inventory stacks (item IDs/keys and quantities), Equipment slots, relevant durability (only where representable), body-state projection and save state. Use ordinary player UI interactions, not injected fixture commands.

1. **Character navigation:** Overview → Equipment → Inventory and back, current labels, focus, keyboard section movement, selected row, pin/favorite independence.
2. **Equipment roundtrip:** on a supported authored item, Equip → Unequip → Re-equip, including a Composite Bow or Short Bow when legitimately available; record before/after occupied slot and bag/overflow quantity. Do not fabricate access to an item.
3. **Occupied-slot displacement:** if a legitimate alternative item is available, equip into an occupied supported slot and verify the displaced item returns to carried inventory. If the setup is unavailable, mark this row held, not passed.
4. **Authored Use:** select an existing profile-backed item, including Breast Cut where legitimately present; inspect pre-action quantity/body-state preview, click `Use Item`, and observe the real notice, decremented stack and body-state change. Verify against the authored owner, not category heuristics or invented nutrient effects.
5. **Selection and rejection:** after a real mutation, confirm that previously selected stale rows cannot silently target a different stack. Do not deliberately corrupt a real selected campaign to reproduce a stale internal entry; PR #12's isolated owner tests are the safety evidence for tampered/stale entries.
6. **Save/restart/readback:** Save through actual Settings, verify slot/address acknowledgement, close and reopen the client/session using authorized means, sign in if needed, load the same slot, and compare quantities, equipment, body state and relevant conditions. A page refresh alone is not a full client restart.
7. **Top bar and responsive:** verify actual owner-backed HP/MP/Stamina and conditions, popup Escape/focus return, action reachability, no document overflow, and scrolling at 320×667, 375×667, 768×1024, 1440×900, plus zoom where supported. State which viewports are selected-client and which are controlled-only. Do not equate PR #9's 248px baseline with PR #11's 286px controlled workspace when fixture conditions differ.

Capture observations, screenshots and slot readbacks only when genuinely seen. Explicitly distinguish **selected observation**, **controlled fixture**, **owner/test inference**, and **not verified** for each row.

## 3. Regression baseline and reporting

After exact composition and access preflight, run focused PR #7/#8/#9/#10/#11/#12 UI and owner suites, SaveSnapshot persistence and relevant creator/body/combat/navigation suites, `npm run typecheck:node`, app-local `npm exec -- vite build`, broad `npm run typecheck` with normalized diagnostic comparison to the same-environment baselines, and `git diff --check` where a diff exists. Report exact commands, directories, exit codes, counts, failures and environment limitations. Historical PR #12 results of **12/12 owner**, **23/23 composed UI**, **106/106 focused game** and **137 broad diagnostics on owner / 135 composed** are reference evidence, not this run's test results. Never report an existing-red broad typecheck as green.

## 4. Integration and change boundaries

This is an **evidence-first acceptance** run. No merge, rebase, retarget, force-push, PR closure/deletion, branch retirement, release/version advancement, new item-instance IDs, new slot/handedness rules, nutrition balance, creator, combat, Home or UI feature additions. Do not change active `DEV-0.7.2.13` prompt/output/handoff or `GAME_VERSION`.

If a new source defect is conclusively reproduced, first record the failing selected observation and owner/repro test, then state the smallest proposed owner branch and acceptance impact; **do not silently broaden this run into implementation**. Historical scoped evidence on draft PRs must survive later authorized integration.

Keep #5/#7–#12 draft unless a separate explicit integration authorization is supplied. GitHub mergeability and a clean disposable composition do not confer that authority.

## 5. Required final output

Provide:
- **A. Exact live refs and composition:** master, PR heads, source paths, branch register preservation, conflicts, and any changes made.
- **B. Selected-session access:** whether an authorized real campaign was available, what access gate was satisfied, and unambiguous fixture-vs-selected classification.
- **C. Gameplay matrix:** each action/notice/before-after item and body-state receipt, Save/client-restart/readback, keyboard, zoom and viewport evidence, or explicit HELD reason.
- **D. Executable checks:** test results and normalized TypeScript comparison; no fabricated reruns.
- **E. Acceptance decision:** which bounded gates have newly earned selected proof, which remain `EQUIPMENT_INVENTORY_SELECTED_INTERACTION_UNVERIFIED`, and which PRs stay draft.
- **F. Next decision:** a concrete, minimal authorized integration review plan **only if** the necessary selected gates have actually closed; otherwise the exact access or owner defect that must be resolved next. State no merges or branch lifecycle changes if none occurred.

**Success is truthful, independently observed selected-client acceptance or a decision-complete access/semantic blocker, not another unneeded UI commit.**
