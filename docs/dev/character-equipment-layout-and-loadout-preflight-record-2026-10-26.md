# Character equipment frame refinement and layered-loadout preflight

Date: 2026-10-26
Run: unversioned Character presentation and owner preflight
Base: `master`/`origin/master` `18260c6a5a64eeb918f000cef57e0a0d23eaf768`
Game: `0.1.1-prealpha`; playability: `INTEGRATED_LOOP`; development impact: `supports_current_band`; game-version impact: `none`

## Changed now

- Removed the outer button border/background from the 17 existing Overview equipment slots while retaining an inspectable button and visible keyboard focus ring. Increased item frames from 2.35rem to 3.525rem on standard widths and 1.9rem to 2.85rem at 390px and below. No new slot or item image is fabricated.
- Narrowed nine stat controls to a `3ch / 2ch gap / 3ch` abbreviation/value layout with room for the existing adjustment indicator. Added a three-digit owner-value render case.
- Recorded the newly settled layered/preset/slot/time direction and the actual owner dependencies in [the focused preflight](../design/character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md). No functional loadout selector or Equip action is shown before its owner exists.

## Source and safety finding

Current `EquipmentState` is one 17-slot record. The requested Back, sided Ear/Eye and ten Ring positions are not persisted. Current bag stacks are fungible and equipped durability is stashed without durable instance identity. The requested saved presets and simultaneous clothing/armor cannot safely use those records as copies. One watch is six clock ticks; accepted time actions also advance body and synchronized gameplay. Combat has an active-encounter guard, but swimming, captivity and future bypass abilities lack a general equipment-change permission owner. A UI-only switch would claim behavior the current save and action path cannot perform.

The owner's replies establish layered clothing under armor, left-side legacy migration, real saved positions, a one-watch apply cost, and accessory presets as saved configurations applied by Equip. Draft PR #17's broader physical-fit design remains an unmerged, documentation-only reference. Its identity and fit invariants are preserved; no PR was altered.

## Verification

- `node --test tests/character-overview-render.test.mjs`: 1/1 pass after the CSS change. Re-run after the three-digit assertion in the final validation set.
- `node --test tests/*.test.mjs`: 36/36 pass before the final three-digit assertion; warnings about SSR `useLayoutEffect`, browserslist age and a parallel-test WebSocket port were non-failing.
- `npm run typecheck:node`: pass.
- `npx vite build`: pass; chunk-size/plugin timing warnings only.
- `npm run typecheck`: exit 2, 115 diagnostics, equal to the previously recorded clean-main baseline; changed production file is CSS only.
- Local Vite started at `127.0.0.1:5175`; browser reached Account Login. No password was requested or entered and no authenticated post-change Character screenshot or selected Save/restart was claimed.

## Retained work and next route

Draft UI PRs #5–#16 and deferred physical-fit PR #17 remain open and unchanged; protected, creator and nutrition branches retain their existing dispositions. No branch merge or deletion is due from this presentation change. DEV-0.7.2.13 remains parked, and the Game version is unchanged.

Next: a dedicated item-instance, equipment-slot, saved-preset and atomic apply-command owner pass with versioned migration and denial/time/conservation tests. Only after that owner passes should Overview selectors, context-aware Equip and new slots be rendered as functional gameplay. The existing 100%-zoom Equipment action-reachability issue remains a separate UI repair.
