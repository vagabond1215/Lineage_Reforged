# Native v3 selected EpochApp source and activation hold — 2026-10-31

Source: exact draft PR #56 head `49bdc371ab7878eeb939c8726742cba88de188e8`, stacked on draft #55 `9e7ae00f308851e18477e871648aae2e951bf487`; `master` `a596112acf3945f2bf7c625e943f2511d12aa710`. New isolated draft [PR #57](https://github.com/vagabond1215/Lineage_Reforged/pull/57) contains code commit `e1266d157fd16ad248962d484ea770a1887d4bc1`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; selected production remains v2. The approved `recovery_pending` path may remain latent and owner-tested, with selected-scenario acceptance open.

## Real caller red gate

A disposable browser probe loaded a newly created synthetic native campaign into the **actual `EpochApp`** and expected usable Unequip and Save controls. It failed: both controls were absent. This is an explicit real selected caller failure, not a fixture-green activation claim. The QA account is synthetic; no authenticated selected gameplay was exercised. A focused test for deriving the EpochApp source pair was also red because no such selector existed.

The source confirms four activation blockers: `EpochApp` constructs `CleanEpochFirstCampaignAdapter(owner)` in v2 mode; `InGameShell` returns `NativeCharacterReviewShell` for v3 before the normal gameplay context; that review shell has Character/Inventory inspection only; and selected Save and retirement explicitly reject v3. World/Approach, quest/travel/survey, exploration/combat/resource/defeat and pending lifecycle hosts exist separately but are not connected to one selected UI source. Enabling a subset would create a misleading partial route.

## Verified unactivated dependency

Previously `EpochApp` kept a second native snapshot/control pair in `nativeSelectedSession.current`, alongside the reducer's active pair. The new `readNativeEpochAppSession` derives a transient native session from the **current** reducer snapshot/control, source slot, account revision and observed artifact/publication address. It validates #56's central source-coherence invariant and refuses stale control, missing account revision or changed observed address. `EpochApp` uses it at exact slot entry and before the held native Save boundary; the duplicate ref is removed. v2 returns `null` and follows its established path. This does not expose a native mutation or enable Save.

## Executed checks

| Check | Result |
| --- | --- |
| Real `EpochApp` selected native action/Save activation probe | **RED as expected:** Unequip `false`, Save `false` |
| Focused selected host tests | **5/5** pass after a missing-selector RED |
| Full UI Node tests | **100/100** pass |
| Adjacent root persistence/account/gear/combat/resource/survey tests | **131/131** pass |
| Synthetic local real-`EpochApp` native readback and page restart QA | Pass; v3 controls remain read-only |
| UI Node typecheck, content lint | Pass; lint 72 files |
| Complete-asset direct Vite build, diff check | Pass |
| Broad UI TypeScript vs exact #56 | **115/115**, zero new normalized diagnostics |
| Workspace TypeScript vs exact #56 | **763/763**, zero new normalized diagnostics |

## Disposition

**HOLD_SELECTED_ATOMIC_ACTIVATION.** This pass implements a source-coherence dependency only. It does not prove native v3 selected creator, item Use/equip, World, four survey stages, authored combat/Normal defeat, pending/terminal, mixed-format handling or ordinary selected Save/restart/sign-in. No Site deployment, merge, old-save deletion or Game-version change occurred. The next gate must build a real selected `EpochApp` route from one source pair and prove all required surfaces together before enabling native creator or controls. Do not route v3 through the v2 gameplay context or introduce an equipment shadow.

Applied failure patterns: FP-001 (actual caller red probe), FP-002 (owner/browser fixture passes do not accept the selected route), FP-008/009 (exact stacked source and branch review), FP-011/013 (one current source pair and provenance before action), FP-016 (readback address placement), FP-017 (latent pending is not selected reachability).
