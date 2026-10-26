# Character equipment frame refinement and layered-loadout preflight

Date: 2026-10-26
Run: unversioned Character presentation and owner preflight
Base: `master`/`origin/master` `18260c6a5a64eeb918f000cef57e0a0d23eaf768`
Game: `0.1.1-prealpha`; playability: `INTEGRATED_LOOP`; development impact: `supports_current_band`; game-version impact: `none`

Lineage implementation `3c9a71e2d5722101ee45be8b5b1d7e0753cc5c4a` was pushed and read back on `origin/master`. The authorized owner-private companion Site source has only the byte-matched CSS change at pushed/read-back `5ce989ff0a7f4e49be7d95b017854e65513686d9`; Site version **16** deployed successfully as `appgdep_6adf4bca03948191a73097051ad9bf9b` at `https://lineage-reforged-preview.vagabond1215.chatgpt.site`.

## Changed now

- Removed the outer button border/background from the 17 existing Overview equipment slots while retaining an inspectable button and visible keyboard focus ring. Increased item frames from 2.35rem to 3.525rem on standard widths and 1.9rem to 2.85rem at 390px and below. No new slot or item image is fabricated.
- Narrowed nine stat controls to a `3ch / 2ch gap / 3ch` abbreviation/value layout with room for the existing adjustment indicator. Added a three-digit owner-value render case.
- Recorded the newly settled layered/preset/slot/time direction and the actual owner dependencies in [the focused preflight](../design/character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md). No functional loadout selector or Equip action is shown before its owner exists.

## Source and safety finding

Current `EquipmentState` is one 17-slot record. The requested Back, sided Ear/Eye and ten Ring positions are not persisted. Current bag stacks are fungible and equipped durability is stashed without durable instance identity. The requested saved presets and simultaneous clothing/armor cannot safely use those records as copies. One watch is six clock ticks; accepted time actions also advance body and synchronized gameplay. Combat has an active-encounter guard, but swimming, captivity and future bypass abilities lack a general equipment-change permission owner. A UI-only switch would claim behavior the current save and action path cannot perform.

Post-publication isolated owner inspection also found that the historical Ashen Reef survey witness requires exactly the old 17 equipment keys in `campaign-rules.ts`, while `saveManager.ts` has exact `0.6.0` snapshot-format admission checks. A direct slot-union replacement would risk rejecting existing campaign history. The inspection branch had no edits, was never pushed and was deleted after returning to `master`. The next owner pass must explicitly preserve historical witnesses and reconcile those admission gates.

The owner's replies establish layered clothing under armor, left-side legacy migration, real saved positions, a one-watch apply cost, and accessory presets as saved configurations applied by Equip. Draft PR #17's broader physical-fit design remains an unmerged, documentation-only reference. Its identity and fit invariants are preserved; no PR was altered.

## Verification

- `node --test tests/character-overview-render.test.mjs`: 1/1 pass after the final three-digit assertion.
- `node --test tests/*.test.mjs`: 36/36 pass before the final three-digit assertion; the independently rerun affected test passed. Warnings about SSR `useLayoutEffect`, browserslist age and a parallel-test WebSocket port were non-failing.
- `npm run typecheck:node`: pass.
- `npx vite build`: pass; chunk-size/plugin timing warnings only.
- `npm run typecheck`: exit 2, 115 diagnostics, equal to the previously recorded clean-main baseline; changed production file is CSS only.
- Authorized companion Site source Node typecheck and Vite production build passed; source CSS SHA-256 matched Lineage `6F8C6B72383F36EA06B982B8200D843E48AAE64799E4897934ABD21DA0C90305`. Its remote head matched local before and after the one-file publication commit. Site version 16 provenance readback matched that commit.
- Local Vite started at `127.0.0.1:5175`; both local and deployed in-app browser tabs reached Account Login. No password was requested or entered and no authenticated post-change Character screenshot or selected Save/restart was claimed.

## Retained work and next route

Draft UI PRs #5–#16 and deferred physical-fit PR #17 remain open and unchanged; protected, creator and nutrition branches retain their existing dispositions. No branch merge or deletion is due from this presentation change. DEV-0.7.2.13 remains parked, and the Game version is unchanged.

Next: a dedicated item-instance, equipment-slot, saved-preset and atomic apply-command owner pass with versioned migration and denial/time/conservation tests. Only after that owner passes should Overview selectors, context-aware Equip and new slots be rendered as functional gameplay. The existing 100%-zoom Equipment action-reachability issue remains a separate UI repair.
