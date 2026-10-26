# Character UI Stack: Independent Integration Readiness And Access-Gated Selected Acceptance

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. Other Git repositories may be used solely as clearly identified read-only references unless a separate explicit work order authorizes mutation.
<!-- /repo-scope-guard -->

**Date / route:** 2026-10-23, unversioned UI readiness and selected-acceptance coordination; development impact `supports_current_band`, game-version impact `none`. User explicitly advanced the current Codex route to the UI stack after PR #14. **The former `DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair` is unfinished and parked, not completed:** its exact previously installed prompt is preserved in `docs/dev/deferred-dev-0.7.2.13-combat-action-result-disclosure-prompt-2026-10-23.md`. Reinstatement requires a later explicit route decision. Preserve the outstanding combat result-disclosure failure and parent re-audit gate. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `DEV-0.7.2_NOT_READY`, `GAME_VERSION_NOT_READY` stay unchanged.

## Mission and existing Connector work

Independently review the complete drafted Character-first gameplay UI stack and its owner dependencies, establish truthful integration readiness, and, **only with legitimate browser and authorized isolated campaign access**, verify real selected Character/Equipment/Inventory actions and Save/client restart/readback. Produce a clear VERIFIED/FAILED/HELD gate matrix and safe next routing. This is **not** permission to merge or rewrite all UI, and is not a request for another speculative repair branch.

Read the already published Connector packet `docs/dev/ui-character-integration-readiness-connector-packet-2026-10-23.md` before broad source archaeology. It identifies the exact source heads, owner/consumer map, previous red-to-green repairs, selected access blockers, and tests. Verify its delta against live refs instead of redoing its entire hosted search. Apply `AGENTS.md`, repository-first protocol, applicable failure-pattern register, accepted UI IA/owner authority, branch-disposition policy and current output/handoff. Preserve #5 design, #6 nutrition, unrelated creator, protected and combat branches, and all named consumers.

## Gate 0: execution environment, access and authorized scope

First fetch/prune; inspect working tree/worktrees, live master, remote PR heads, merge bases and changed paths. Identify the real local execution capabilities and whether this Codex surface is **explicitly permitted to use an ordinary browser/localhost** and an existing **user-authorized isolated local gameplay profile/campaign**. A previous selected acceptance attempt was blocked by browser-use policy. **Do not repeat, bypass or route around any denied browser access**; do not guess/access account credentials or protected data. Prior historical combat selected profiles are not assumed accessible.

- If browser access is prohibited/unavailable, or no authorized selected campaign is present, explicitly hold selected gates. Carry out only the **independently useful semantic composite review and targeted tests** described below; do not repeat broad fixture tests just to imply new selected evidence. Return a decision-complete access handoff, including what legitimate environment/user-assisted step is needed. Do not publish a hollow implementation PR or claim selected proof.
- If legitimately authorized browser access is available, proceed to selected gameplay only after an independently checked exact-source composition. A user may authorize sign-in through their own supported interface; do not collect, print or reset passwords.

## Gate 1: exact-source UI/owner composition and independent review

Inspect **live**, not presumed immutable, versions of:
- #7 Character parent → #11 Equipment/Inventory UX → #14 duplicate-bag UI selection safety;
- #10 Equipment resolver/owner → #12 stale-consume owner → #13 exact indexed-bag Equip/Consume;
- independent #8 top status bar, #9 responsive shell;
- documentation #5 as design reference only. #6 nutrition is out of scope.

The Connector packet records last inspected heads: #7 `8610260f`, #8 `20825cce`, #9 `69215b6f`, #10 `9f390e03`, #11 `2d140c4a`, #12 `7b6dccf5`, #13 `c9581eb9`, #14 `ce2fc143`. Refresh full SHAs and compare changed paths and merge bases. Do not treat GitHub's mergeable flag or isolated branch-local green tests as semantic integration acceptance.

Use a **disposable isolated checkout/worktree** to assemble both stacked lines plus #8/#9. Document source/test SHAs, overlay order, provenance and any conflicts. Keep each PR's historical `docs/dev/branch-disposition-register.md` additions intact for any later integration. Do not commit synthetic combined source to master, retarget existing PRs or squash away their evidence.

Independently inspect actual `CharacterPanel` call sites and React click/focus behavior: PR #14's ephemeral inventory presentation identity must distinguish identical bag IDs/items without changing the real `InventoryEntry` passed to PR #13's Equip/Consume owner. PR #13 must mutate the exact validated bag; PR #12 must reject stale/wrong-item consumption before effects; PR #10 equipment legality/displacement must remain canonical. Review selection clearing after immutable changes, search/filter/sort, unique/ambiguous pin controls, favorites, overflow, correct warning/disabled reasons, accessible labels, topbar/condition exposure and constrained mobile workspace. Preserve no-new-schema/no-fabricated-identity boundaries.

If a **new** defect is concretely reproduced, record a focused regression and owner with before/after evidence. Do not widen this acceptance run into source repair without a separate scoped route decision.

## Gate 2: executable independent checks, bounded by evidence need

Use the existing PR #14 8/8 UI, 32/32 composed UI/owner, and 106/106 creator/body/combat/persistence reported results as **prior evidence, not this run's tests**. Re-run the smallest meaningful independent focused UI selection/owner/action and SaveSnapshot sets on the exact current composition; expand only if a changed dependency or failure demands it. Run applicable `npm run typecheck:node`, app-local Vite build and `git diff --check`. For broad `npm run typecheck`, compare exact same-environment normalized diagnostic signatures with applicable clean baselines; historical full UI typecheck is red (PR #14 branch 136 and composed 135 diagnostics), and no new signatures should be concealed. Report exact commands, cwd, totals, exit codes and limitations. Never convert SSR/render tests into claims that a user actually clicked a button.

## Gate 3: selected client, only if Gate 0 grants it

Through ordinary authorized game UI, observe and record:
1. Actual Character Overview, Equipment, Inventory transitions, focus/tab/keyboard use, second-row selection when safe/representable, owner-backed feedback, empty/disabled states and ambiguous pin handling.
2. Equip → Unequip → Re-equip with a legitimately carried supported item, slot and inventory quantity before/after; occupied-slot displacement only when an actual second item exists; no injected gear.
3. Authored Use of an actually available item, pre/post exact location, quantity, related body state and notice, without changing a different stack. Include Breast Cut if legitimately available, otherwise mark that subrow HELD rather than making a fixture claim.
4. Settings Save to actual selected slot/address, fully close/reopen the client, sign in if required, load the same campaign and compare equipped items, inventory counts, body state, tick and relevant conditions. A refresh or `JSON.stringify` round trip alone is not selected client restart proof.
5. Responsive/action reachability at 320×667, 375×667, 768×1024, 1440×900 plus zoom when supported, with non-normal conditions, focus restoration, popup Escape, keyboard navigation and no horizontal overflow. Separate controlled fixture measurements from selected client observations.

For each row classify evidence as **selected interaction**, **controlled executable**, **static source**, or **HELD/FAILED**, and retain exact screenshots only if actually captured. Respect access/consent and do not bypass a denied localhost/browser route.

## Publication and stopping rules

No merge, rebase, retarget, force-push, PR closure/deletion, source/schema/game-content/editorial redesign, combat implementation, nutrition change or Game-version promotion is authorized. Keep PRs #5/#7–#14 draft; PR #6 stays independent. No new feature PR solely for this review. Do not overwrite the preserved uncompleted DEV-0.7.2.13 combat route. Preserve unrelated dirty files and protected refs.

If a meaningful new reproducible defect or fresh selected evidence emerges, publish a focused review record on an appropriate isolated **documentation-only** review branch/PR following repository branch policy; otherwise a complete final report with exact refs and holds is sufficient, without an empty commit. When preparing the successor prompt/output/handoff, honor current repository authority and explicitly preserve the paused combat route, along with its reactivation trigger. Never claim a later combat task was executed by this UI run.

Required final report:
- **A. Source identity and composition:** exact master and #5/#7–#14 heads/bases, worktree, semantic overlaps, diff provenance and branch histories/dispositions.
- **B. Independent review findings:** UI selection→owner argument, exact-bag/consume/equip ownership, keyboard/accessibility/pin, shell/topbar integration; concrete new defects with reproduction or explicit none.
- **C. Actual validation:** commands, exit codes, counts, broad TS normalized differences, what is newly verified versus reused evidence.
- **D. Selected access and action matrix:** explicit allowed/denied browser posture, actual observations and Save/restart/viewport evidence or exact HELD reason.
- **E. Gate decision and next owner:** distinguish controlled readiness from `EQUIPMENT_INVENTORY_SELECTED_INTERACTION_UNVERIFIED`; propose staged integration **only after** each required selected gate has closed and separately authorized merge review; otherwise name the single next material access or code blocker and the smallest follow-up.
- **F. Routing preservation:** untouched combat DEV-0.7.2.13 active-result gap, `DEV-0.7.2_NOT_READY`, `GAME_VERSION_NOT_READY`, no unauthorized lifecycle changes.

**Success:** an independent, dependency-correct evidence and readiness decision, with selected acceptance only if legitimate selected client actions and full restart/readback were observed. A truthful access hold is a valid terminal outcome; a new UI feature is not the goal.
