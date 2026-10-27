# Codex PR #25, native gear, and current UI integration preflight

Date: 2026-10-26
Status: `CONNECTOR_SOURCE_PREFLIGHT; NO_EXECUTION_OR_MERGE; REVIEW_HELD`
Source inspection:
- `master` `a596112acf3945f2bf7c625e943f2511d12aa710`;
- PR #22 `codex/echo-dev-console` `8ea456e03f12bb059ab5c12a63101749638786a9`;
- latest Codex PR #25 `codex/echo-dev-hardening` `4ce26ee1b4c3bbb5e2bbd4d77289aca3a79aa2f0`, target #22;
- PR #20 `codex/gear-instance-fresh-epoch` `0d6debe5c381db3835ff8062d88568fda11dee33`;
- PR #19 (fresh-save product direction) `62d6cc7b00fdd9f17a4424aafd6527a754b1906c`;
- old UI #16 `codex/stacked-top-resource-meters` `c6d52a7a14f5f70cddcb7299e63e2a0f3ddb13f6`.
The connector reviewed PR metadata, specific changed-file patches, source files, authored content and prior test records; it did **not** execute tests or a browser.

## 1. What the latest Codex pass actually implemented

PR #25 adds 3 commits/29 paths relative to **PR #22**, and PR #22 itself is a separate 3-commit parent above current master. The #25 implementation is **not on master**.

| System | Verified source path/operation on #25 | Current status and caveat |
| --- | --- | --- |
| Origin evidence | `newGameSnapshot.ts` binds final `characterId` to `originBaseline.characterId`; `progression.ts` adds `echoEvidenceVersion: 1` and `earnedGrowth` ledger | Starting skills/attributes remain usable but do not credit Echo merely by existing. A full selected campaign restart is still unverified. |
| Earned progression | `recordEarnedSkillGrowth` called in `gameplayLoop.ts` (Rivet skill paths), `player-survey-activity-advancement.ts`, and `combat/index.ts`; recovery path records `recordEarnedAttributeGrowth` | Credits only caller-reported deltas above prior peaks, capped by current growth vs creation. Future skill/attribute award callers must likewise be routed, not silently bypass ledger. |
| Echo cache/admission | `campaign-rules.ts:isTargetCampaignSnapshot` checks new-campaign character binding, required evidence, computed Echo fields and level; `progression.ts:calculatePlayerEcho` fails closed without valid evidence | Test coverage includes direct non-earned rank edits, repeated calculation, loss/regain, malformed/wrong-character evidence and forged cache. Not an anti-tamper cryptographic primitive. |
| Old development data | `saveManager.ts` distinguishes an obsolete new-campaign Echo evidence version as `incompatible`; UI copy tells user to begin another campaign without erasing storage | Only missing version is explicitly classified incompatible by that new branch; other malformed, mismatched or forged current-format data is rejected/corrupt, not silently migrated. Preserve valid **new-format** restart and publication history. |
| Dev UI | `TopStatusBar.tsx` coordinates Dev/Settings/Calendar/Conditions/Notifications; `NotificationBell.tsx` gains controlled popup; `InGameShell.tsx` passes active tab key and settings dismissal | Controlled local focus/keyboard/pointer evidence reported. Signed-in selected mobile/desktop acceptance not obtained. Dev popup stays visible by default. |
| Spawn inspector | `world-engine/src/spawn/index.ts` shares encounter-template eligibility failure helper with actual candidate resolver, exposes specific monster/template failures, roll and rate; `DevConsole.tsx` labels seed-zero as illustrative | Read-only; ordinary selectionKey need not equal inspector seed-zero. No time-of-day, season, weather eligibility and no spawn forcing command. |

Codex's self-reported verification: 200 focused passes, 1 clean-master-identical quest assertion mismatch (`warning` vs `success`); 42/42 UI; Node UI typecheck and direct Vite build pass; broad UI TypeScript 115 baseline vs 115 branch, no newly normalized signatures. GitHub combined commit-status endpoint returned **zero status entries** for `4ce26ee1`; this is not an independent CI test result or evidence that no other checks exist. Treat test/run outcomes as *Codex reported*, not connector re-executed. No selected-client or deployed-Site acceptance claim.

**Review-only risk probes, not established defects:**
1. Exercise every actual skill/attribute mutation and the `gameplay-snapshot-sync` path before concluding earned Echo coverage is complete. Evidence recording must be coupled to an accepted owner action; pure recomputation cannot infer history later.
2. Exercise obsolete save `incompatible` vs current-format **corrupt** paths, artifact verification, publication recovery and no implicit deletion. A failed cache/evidence check is not an invitation to synthesize earned history.
3. Preserve source-attributed advancement evidence when activity/combat results are replayed or Save publication is interrupted; verify idempotency at the real caller, not only repeated pure Echo math.
4. Inspect actual selected popup layout at narrow/landscape widths and keyboard focus through Save settings, then verify Dev remains visible after tab/nav switch.
5. Verify spawn inspector's ordinary real selectionKey and exact encounter candidate eligibility under real world context. A seed-zero preview is diagnostic, not a deterministic guarantee of a playable encounter.

## 2. Why the older UI branches must not be merged blindly

GitHub comparisons against current master showed the following old branches **diverged**, each 39 master commits behind the shared `f56229dde859b9374a54368bd8a8fd2a9872daa1` base:
- `codex/character-first-ui` (#7): 3 ahead / 39 behind.
- `codex/persistent-top-bar-ui` (#8): 2 / 39.
- `codex/mobile-shell-usable-height` (#9): 1 / 39.
- `codex/equipment-slot-reequip-repair` (#10): 1 / 39.
- `codex/equipment-inventory-ux-stacked` (#11): 5 / 39.
- `codex/inventory-consume-stale-guard` (#12): 4 / 39.
- `codex/inventory-bag-exact-target-repair` (#13): 6 / 39.
- `codex/inventory-ui-selection-safety` (#14): 6 / 39.
- `codex/compact-landscape-domain-rail` (#15): 4 / 39.
- `codex/stacked-top-resource-meters` (#16): 7 / 39.

These heads have historical test value but are not an automatic forward-merging queue. Master now has later selected Character/Inventory/Equipment/Atlas and six-season calendar changes. **Review missing behavior and selectively re-author against current master.** Preserve the original PR test/repair provenance but do not reinstall older component files over newer source.

A concrete semantic example:
- Old #16 `TopStatusBar.tsx` still renders the character `name` as the dominant header and uses a local independent `NotificationBell` popup with only Settings in its control group.
- Current master and #25 render a compact six-season calendar/time/weather-unavailable header, and #25 adds the default-on Dev button plus shared popup exclusion and controlled Notifications.
- Old #16's valuable compact HP/MP/ST bars, energy/water/climate visual layout and responsive styles need **selective review**. Copying its whole `TopStatusBar.tsx`, `InGameShell.tsx` or test suite would regress current source identities and Dev behavior. Its #8 parent is also old.
- #16 and #25 share five changed file names relative to their respective bases, including `TopStatusBar.tsx` and `InGameShell.tsx`, but file overlap alone does not prove an actual merge conflict.

First UI composite to test: **current master + exact #22→#25 earned-Echo/Dev source**, then independently reconcile still-missing compact bar behavior from #16, with current `InGameShell` activeTab/Character/Inventory routes, calendar icon, accepted resource owner and narrow-shell layouts all preserved. Do not compose obsolete Character components simply to match old fixture screenshots.

## 3. Native gear founder/creator coverage gate: actual authored items

Source catalog `packages/content/base/player/starting_bundles.json` has seven starting bundles; the **union of their 19 distinct item IDs** is:
- Laborer: `lumber_axe`, `casual_tunic`, `rope`, `ration_bundle`.
- Hunter: `short_bow`, `arrow_bundle`, `skinning_knife`, `field_bandage`, `ration_bundle`.
- Warrior: `buckler_shield`, `leather_light_armor`, `ration_bundle`.
- Crafter: `casual_tunic`, `field_bandage`, `ration_bundle`.
- Arcanist: `battle_staff`, `casual_tunic`, `herb_pouch`, `focus_draught`, `ration_bundle`.
- Traveler: `butcher_knife`, `travel_cloak`, `bedroll_kit`, `rope`, `compass`.
- Trader: `ledger`, `travel_pouch`, `casual_tunic`, `compass`, `ration_bundle`.

The **19 distinct starter item keys** in the seven bundles above have been de-duplicated across bundles. Their quantities and starter destinations still require separate owner-level grant tests.

PR #20 `equipment_fit_profiles.json` seeds only `composite_bow`, `short_bow`, `arming_sword`, `pickaxe`, `casual_tunic`, `leather_light_armor`. Of those, only `short_bow`, `casual_tunic`, `leather_light_armor` are starter bundle matches. The class-level catalog identifies `buckler_shield` as armor, `battle_staff` as weapon, `travel_cloak` as clothing, `herb_pouch` and `travel_pouch` as accessories, and various creator tools as tool-class items. It would be a mistake to claim all seven bundles are migrated based on the six-profile owner test.

**Owner decision before full cutover:** explicitly classify each starting item as nonfungible gear, fungible bulk or other **durable tool/container** with appropriate ownership; author fit for every worn/equippable item, not a heuristic derived from item name. Tools that are carried but not wearable still need a coherent item-instance/accessibility rule where durability and physical location matter. Preserve ordinary consumable and commodity stack behavior. Verify every creator bundle and starter effect, not only Traveler.

PR #20 `validateGearOwner` demands **unique bag IDs** and counts fungible stack occupied slots plus native gear instances. Historical #13/#14 prove duplicate-bag-ID fixtures existed and required exact-bag selection/owner repairs, although no normal gameplay producer of duplicate IDs was established. Fresh-format cutover should reject or deliberately canonicalize *new* ambiguous bag identity before native owner admission, then test exact bag targeting. Do not silently choose first matching `bagId`.

Its graph is still wholly unimported by `newGameSnapshot.ts`, `characterPanelState.ts`, `SaveManager`, combat, resources and survey witnesses. A new gear field alongside active `playerState.equipment` would create two authorities. Next implementation must atomically align creator grants, equip/unequip, effective-worn projections, combat/resources, survey witness version, snapshot/envelope and Save/restart. PR #19 waives *obsolete development-save* compatibility, **not** preservation of accepted new-format campaigns.

## 4. Prompt/handoff precedence and merge hazards

The installed `master/docs/dev/current-codex-prompt.md` still explicitly demands recovery/migration of old type-stash and 0.6.0/17-slot development saves. The accepted owner decision on draft PR #19 waives that requirement. PR #25 deliberately appends only a branch-local explanatory note and **does not replace** the installed gear task. None of these draft prompts automatically controls another implementation branch.

Files `docs/dev/current-codex-prompt.md`, `current-codex-output.md`, `current-gpt-handoff.md` and `branch-disposition-register.md` overlap heavily among #19, #20, #22 and #25. Future selected integration must:
- choose an active task **explicitly** instead of letting a merge choose the winning content;
- preserve dated outcome/evidence entries in the historical handoff and branch register;
- keep #19's fresh-format policy authoritative over obsolete-save migration *without editing master from this audit*;
- keep #23 as source evidence, #22→#25 as one stacked implementation, #20 as separate gear foundation, #24 as planning, and old #16 as selective UI evidence.

## 5. Named implementation/test admission matrix (not executed)

| Named pass | Must demonstrate | Reject / stop |
| --- | --- | --- |
| Echo source and origin | Fresh Local, basic origins, available advanced descendants when legitimately eligible; zero initial Echo/level, skill usability preserved; real earned combat/survey/noncombat gains survive recompute and Save | Direct scripted changes creating earned Echo, loss/regain replay, wrong-character or forged cache accepted, illegitimate QA lineage evidence |
| Dev + compact topbar | Real six-season calendar, HP/MP/ST, energy/hydration/climate, Dev and Settings, narrow/landscape navigation; reciprocal popup closure, Escape, return focus and outside click | Restored obsolete name header or missing Dev, overlapping persistent overlays, hidden primary action, clipped save control |
| Gear item owner | All seven actual starter bundles classify and grant correctly; sided/layered fit only where authored; two same-type different-durability copies, worn/overflow/bag, safe displacement; survey/combat effective-worn parity | Parallel old stash writer, duplicate bag ID ambiguity, one item in two physical places, new-format save corruption or missing survey provenance |
| Cross-cut Save | Stale request, duplicate retry, interrupted publication, selected client full restart, incompatible *old* development save notice and untouched retained browser data | Treat source-compatible current-format save as expendable, silent data deletion, inherited test evidence, false "ready" claim |
| Spawn | Exact ordinary selectionKey and inspected rejection explanation, missing context/template/monster negative cases | Seed-zero preview called a guaranteed encounter, unsupported weather/season filters marked active |
| Branch/review | Exact source SHA, reproducible rerun and named divergence strategy against master | Auto-merge #16 or entire 39-behind UI stack because individual old tests passed |

## Disposition

**Connector-safe source review is complete for the inspected Codex/gear/topbar slice.** Further progress needs an isolated local checkout/test composition and selected-client/browser work, or a new explicit owner decision. This document changes no branch under implementation, current prompts, tests, source, content/schema, player saves, Site or Game version. Stop, preserve review-only evidence, and refresh live heads before any future Codex run.
