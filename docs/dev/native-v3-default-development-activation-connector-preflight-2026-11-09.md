# Native-v3 default development activation — Connector source preflight

Date: 2026-11-09 (America/New_York). Repository: `vagabond1215/Lineage_Reforged`.
Inspected exact `master`: `fc51ebb9efeecff427fc0b8b5d80dacfb36d1d73`.
Classification: **`CONNECTOR_ACTIVATION_PREFLIGHT_COMPLETE; ACTIVATION_READINESS_LOCAL_REVIEW_REQUIRED`**.
This is **GitHub Connector read-only source/caller evidence** packaged as one documentation file. It is not local checkout verification, an executed test/build, accepted activation, a new Save/owner contract, deployment permission, a Game-version decision, or replacement for the active Codex prompt. Recheck the complete delta if master moves.

## 1. Verified current route and controlling decisions

- Native-v3 implementation was merged into development `master` in the two-parent commit `fc51ebb9` (parents `0c0b5c3` and `eb6ceb1`). The source-branch merge review and local synthetic Save/restart witness are recorded in [exact-source review](native-v3-development-master-exact-source-merge-review-2026-11-09.md) and [disposable browser witness](native-v3-disposable-local-save-restart-witness-2026-11-09.md). The merge preserved newer Core World Entry and Hardcore/succession design guidance.
- The **normal app has not activated v3**: `apps/rpg-ui/src/main.tsx` mounts `App`; at the end of `apps/rpg-ui/src/App.tsx`, `App` returns `<EpochApp />`. In `EpochApp.tsx`, `candidateNativeV3=false`, `stagingNativeV3=false`, and `nativeCandidate = stagingNativeV3 || (candidateNativeV3 && import.meta.env.DEV && pathname.endsWith('/native-selected-session-qa.html'))`. Merely passing `candidateNativeV3` from normal `App` **will not activate ordinary index routes**, and relying on a QA query parameter would be wrong.
- `apps/rpg-ui/src/nativeV3Staging.tsx` separately mounts `<EpochApp stagingNativeV3 />` after an exact origin guard. `nativeStagingOrigin.ts` forbids using the existing preview Site as that separate staging origin. The staging entry/build is **not** the normal app entry or an authorization to deploy.
- Controlling policy: [pre-alpha Save compatibility and v3 cutover](../design/prealpha-save-format-compatibility-and-native-v3-cutover-policy-2026-11-09.md), [current active Codex prompt](current-codex-prompt.md), [Core World Entry future intent](../design/core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md), and repository/branch lifecycle policies. Do not make unfinished Core narrative, Hardcore, visual redesign, historical v2 migration or 200% zoom acceptance a prerequisite to a functional pre-alpha development cutover.
- Game remains `0.1.1-prealpha`; retain `HOLD_SELECTED_ATOMIC_ACTIVATION` until a separate accepted decision. Original historical/native PRs and the extra Site are separate lifecycle matters.

## 2. Existing native route and caller ownership

| Boundary | Current source | What the activation review must preserve |
| --- | --- | --- |
| Creator | `EpochApp.initialize` selects `CleanEpochFirstCampaignAdapter(owner, nativeCandidate ? 'native_v3' : 'v2')`; `createCampaign` calls its `start` | Genuine native creator, validated account and actual v3 snapshot/first publication |
| Accounts | `CleanEpochAccountAdapter.selectSession/signIn/deleteAccount`; `cleanEpochAccountStore.ts` | Credentialed current-epoch identities, exact revisions/generations, scoped deletion; do not infer old storage families are safely reachable |
| Formats | `EpochApp.slotSummaries`, `admitBeforeRecovery`, `cleanEpochLauncherRead.ts` | v3 ready; recognized v2 incompatible; future unknown unsupported; malformed graph blocked without repair or overwrite; unavailable storage Retry |
| Selected gameplay | `EpochApp.enter/nativeAction`; `InGameShell` uses `nativeCandidate` to supply controls to `NativeCharacterReviewShell` | Native item, quest, travel, survey, Soundings, combat and session source must remain coupled to current retained account/slot authority |
| Save and terminal | `EpochApp.save/retire`; `nativeSelectedSession.ts` and `nativeSelectedTerminal.ts` | v3 Save currently *requires* `nativeCandidate`; preserve exact source/destination addresses, publication, physical gear, retirement/recovery and stale-retry integrity |
| Persistence | `cleanEpochAccountStore.ts`, `campaignIndexedDbStore.ts`, `saveManager.ts` | Native snapshot `lineage.save_snapshot.v3`, native envelope v8, clean-epoch IndexedDB `lineage.campaigns.epoch1` schema 7; separate release label |

The existing disposable local browser witness passed real QA-route native character → Unequip → Save → full navigation restart and exact gear/publication readback. This **does not prove ordinary default-index activation**, hosted account sessions, or actual mixed-format account behavior; the longer QA reference script also failed after the required core assertions at an optional sign-in selector.

## 3. One specific unproven activation gate: inventory-time recovery ordering

`EpochApp.initialize`, `showMenu` and `load` call `inventory`, which invokes `completePending` **before** mode-specific `slotSummaries`/loaded-snapshot admission. `completePending` can call:
- `next.first.resume` for a retained first-campaign recovery (the adapter is format-selected and validates creator format);
- `next.descendant.resumeCurrent` for a retained descendant pending-consumer record;
- `next.terminal.resumePending` and `next.owner.closePendingTerminalAddressesForAccount` for pending terminal state.

The prior focused regression proves `admitBeforeRecovery(true, pendingV2, recover)` refuses the **later v2 Normal-Stakes load-recovery callback** without invoking it. It does **not**, by itself, prove that earlier inventory-time retained-consumer writers are inert or safely authorized for incompatible v2 data when native becomes the default. Nor does it establish behavior when the stored account contains both native-v3 ready and historical v2 pending addresses.

**Targeted Codex gate:** inspect the format and exact-authority constraints on these *pre-admission* recovery paths. With disposable same-origin synthetic records, either prove that rejected historical-format pending records cannot trigger an unauthorized write or fail-closed block that makes the healthy v3 neighbor unusable, or implement the smallest owner-consistent guard and one focused regression. Preserve lawful current-v3 pending recovery and existing exact-once consumers. Do not weaken graph validation, globally discard accepted pending consumers, or silently delete old records. This is a **risk to resolve**, not a proven exploit or independently reproduced bug.

Also verify the `activateSlot` prepared branch cannot publish a retained incompatible v2 attempt through the native-selected `first.resume` path. Its format check is present, but no fresh normal-entry mixed-format test has been run in this Connector pass.

## 4. Smallest proposed activation and rollback shape (not implementation)

1. Use an **explicit source/config-owned normal-entry native mode** with a distinct name from the QA-only `candidateNativeV3` and origin-guarded `stagingNativeV3` flags. Wire `App`/ordinary `EpochApp` entry deliberately; do not make a URL query, localStorage toggle, Site rebind, or staging origin requirement control the default development mode.
2. Keep the v2 implementation source available for bounded source rollback **without resetting or migrating existing accounts/Saves**. A rollback of the default UI mode is not proof that newly authored v3 Saves are playable in v2; the v2 default may be unable to act on those Saves. Report that limitation truthfully.
3. Preserve the native owner/reader and existing Save/account version identities. A current v3 publication must still round-trip with the same slot/head/item/currency/receipt; a rejected v2/future/invalid record must not be overwritable or relabeled as a new v3 Save.
4. Preserve the separate native staging configuration, unchanged browser origins, current provider Sites, original PR evidence and `GAME_VERSION`.

## 5. Minimum local verification for the active Codex readiness review / later approved cutover

- **Review-only first:** recheck synchronized `master`, actual worktree, active route, exact default/candidate/staging entry and the pre-admission recovery ordering above. State `ACTIVATION_READY` or `ACTIVATION_BLOCKED` with a precise blocker and path.
- **On later approved activation change:** one disposable **normal `index.html`** fresh account → native creator → one owner-backed gear/item action → Save → reload/readback, without QA auto-seeding or query-gated candidate route.
- One targeted mixed-format/pending consumer test checking fail-closed status, no unexpected v2 mutation, and healthy neighboring v3 record continuity; use the existing focused tests for later `admitBeforeRecovery` and owner Save integrity where unchanged.
- One appropriate Node UI typecheck and direct ordinary Vite build after changing normal entry. Inspect only new diagnostics/changed-source failures. No exhaustive old Save migration, hosted deployment, 200% zoom or full monorepo suite solely for pre-alpha cutover.
- Confirm source/config rollback is possible without data mutation. Document that deployment and user-origin storage remain separate held decisions.

## 6. Connector boundary and next exact consumer

This packet did **not** change `App`, `EpochApp`, account/store writers, Save formats, UI, tests, selected Site, browser data, Game version or branch/PR lifecycle; **no local test, build, browser smoke or checkout-state validation was run here**. The source facts above come from GitHub Connector reads at the exact inspected merge SHA. This new document itself is evidence only, not an activation acceptance result.

**Next:** the already installed [Native-v3 Default Development App Activation Readiness Review](current-codex-prompt.md) should independently verify the source delta, evaluate the bounded inventory-time recovery gate, and record a decision-complete local readiness result. Any actual normal-entry activation requires a later explicit owner decision and separate Codex implementation/validation. No broad rediscovery or new feature implementation is needed for this preflight.
