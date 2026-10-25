# Character sheet selected completion — 2026-10-25

**Route:** unversioned Character UI presentation completion on `master`; Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. DEV-0.7.2.13 combat remains parked. Development-milestone impact `none`; game-version impact `none`.

## Scope and source

Fresh fetched/pruned Lineage `master` began at `f7685d49cdd440db07f5d3538efe910ade5d76bf`, with only preexisting untracked task directories and `node_modules`. The accepted compact-sheet source and tests were reconciled with the live hosted UI. Only the Character layout, its Character/Inventory routing, focused tests and evidence changed. No save schema, item owner, combat, nutrition owner, creator, or game version changed.

Lineage source commits pushed and read back on `master`:

- `77ed9747ae03f2754bb9b6361026d241a31a4f17`: square bounded illustration; place expanded attribute detail and progression in the right sheet area instead of a narrow left column.
- `0882a026175510bdea24da6f7ff75259116844a4`: give the main Character and Inventory destinations distinct React component keys. Selected gameplay had shown the Inventory heading with stale Equipment content.
- `03f668795d0c331944471c030f8fb054890ab865`: constrain the right profile grid to `minmax(0, 1fr)`. At 375px, the previous implicit track had `clientWidth=295`, `scrollWidth=719`; the corrected deployed track measured `295/295` after refresh.

## Validation

- Red-before-green Overview layout assertion: failed before the first repair; passed after it. Red-before-green navigation key assertion: failed before the routing repair; passed after it. Red-before-green profile containment assertion: failed before the mobile CSS repair; passed after it.
- `cd apps/rpg-ui && node --test tests/*.test.mjs`: **36 tests, 36 pass, 0 fail** on the final source.
- `cd apps/rpg-ui && npm run typecheck:node`: pass.
- `cd apps/rpg-ui && npx vite build`: pass; final client CSS `index-W1uhDEKP.css`, JS `index-BigDpnG-.js`.
- Broad UI `npm run typecheck`: **115 existing TypeScript diagnostics**, equal to the prior clean-master count; none from touched files. This broad check is not green.
- `git diff --check`: pass before source commits.

## Selected client, owner actions and responsive evidence

The user authorized the already signed-in new Brave test account. No credential was requested, entered, stored or bypassed. Its real saved Slot 1 opened as **Merrit Softstep**, a Level 6 Halfling Exile. The hosted Character Overview showed the saved identity, all nine attributes, all 17 equipment slots, four Skills, three Traits and expandable Effects/Echo sections. Clicking Strength opened the full breakdown in the right sheet; Enter on the focused control closed and reopened it.

The selected Pickaxe began in Weapon Right, quantity 1, durability 100%. Unequip moved it into Traveler Satchel bag 1 as one Pickaxe; an explicit Save returned “Saved to Slot 1 and verified its exact ready address.” After browser restart and same-slot load, Inventory displayed that exact stack and Weapon Right was empty. Equip from the saved bag stack returned one Pickaxe to Weapon Right at 100% durability, removed the carried Pickaxe stack, and left the other two carried stacks intact. A second explicit Save and browser restart read back Weapon Right: Pickaxe on the same character. These observations prove this selected Pickaxe route, not all equipment rules or accounts.

Selected visual checks: desktop at 1541×991, tablet at 768×812 and mobile at 375×667. At mobile width the portrait precedes all nine stacked attributes, followed by identity, a three-column equipment matrix and progression; all remain reachable by vertical scrolling. The post-deployment right profile has no internal horizontal overflow (`295/295`), while primary and subsection navigation retain their intentional horizontal scrolling at narrow width. Evidence:

- [Desktop selected sheet](evidence/character-sheet-desktop-selected-2026-10-25.png)
- [375×667 initial sheet](evidence/character-sheet-mobile-375x667-selected-2026-10-25.png)
- [375×667 equipment and progression](evidence/character-sheet-mobile-equipment-375x667-selected-2026-10-25.png)

## Publication, branch disposition and follow-up

The separately authorized owner-private companion Site source received only corresponding production UI files, passed Node typecheck and Vite build, and was pushed/read back at `89c52e14a3794749b053defff57b899e9e3e36eb`. Site version **13** deployed successfully as `appgdep_6ade1f6cfe608191a6921ad562639724` at `https://lineage-reforged-preview.vagabond1215.chatgpt.site/`; version readback ties the archive and source commit. An earlier source-only version 12 deployment attempt failed because the archive argument was omitted; the same source was republished successfully with its package before version 13. No access policy changed.

Draft PRs #5–#16, protected refs, creator and nutrition work retain their existing `HOLD_NAMED_CONSUMER` or protected dispositions. This exact-main selected evidence can inform their later review, but does not automatically accept or merge their historical heads. No branch merge, retarget, closure or deletion was due. Recheck exact refs when their unique evidence is promoted and named consumers close.

At 100% desktop zoom, Equipment's selected-slot action appeared below the clipped loadout and wheel scrolling did not reveal it in this session; the selected round trip used 80% zoom to reach the control. Treat normal-zoom Equipment action reachability as a separate bounded UI follow-up. Item artwork is not authored, so occupied slots retain the restrained fallback. Weather art still needs an owner-backed weather mapping, and the marked nutrition bars remain a prototype.

Applied failure patterns: **FP-001** actual owner-backed selected caller and Save/restart; **FP-002** preserved action identity/quantity/durability across equip transitions; **FP-009** exact source and deployment readback plus screenshots; **FP-016** selected responsive and keyboard observations separated from controlled tests. Suggested final documentation commit: `docs(dev): record selected Character sheet completion`. Next bounded run: make Equipment selected-slot actions reachable at normal desktop zoom, then separately consider authored item artwork.
