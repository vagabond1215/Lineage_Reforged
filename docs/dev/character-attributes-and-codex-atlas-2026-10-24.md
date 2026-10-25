# Character Attributes And Codex Atlas

**Run:** 2026-10-24, unversioned UI navigation change on `master` from `7428c66dc0bb6e59f699f68585a0cec6a309481a`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; development milestone impact `none`; game-version impact `none`. DEV-0.7.2.13 remains parked.

## Scope and owner boundary

The nine attribute values and selectable details already appear on Character Overview. Remove only the redundant Attributes subsection. Move the existing read-only `playerState.geographicKnowledge` projection from the Character subsection to **Codex → Atlas**. Known lands, regions and settlements retain their visibility tiers, source identities and detail groups. Atlas does not add a map, travel actions, weather, save fields or gameplay ownership. Standing, reputation and discoveries remain Character subsections.

## Validation

The Atlas and Overview render tests were added before the routing change and failed on the original navigation. After the change, all **35/35** UI tests pass, including Character, Equipment, Inventory, shell and top bar. Character keyboard navigation and geographic-knowledge unit tests pass **4/4**. UI Node typecheck passes. Vite production build passes with 257 client modules. Broad UI TypeScript reports **117 diagnostics**, matching the documented clean-main baseline of 117 after fixing one new nullable-count diagnostic. `git diff --check` passes.

FP-001: full `CharacterPanel` and `CodexPanel` renders use the actual session view model, with owner-backed counts and empty-state checks. FP-002: render/build evidence is not authenticated selected-client proof. FP-009: exact source and Site publication heads require readback. FP-016: selected narrow-screen navigation/overflow remains to be checked when an authorized session is available.

## Branch disposition and acceptance

Fetched/pruned `master` was synchronized before editing; the tracked tree was clean, while pre-existing untracked rehearsal directories and `node_modules` were preserved. Draft UI PRs #5–#16 remain held for their named evidence and selected-client consumers. This bounded route change consumes no PR retirement trigger; no branch merge, rebase, close or deletion is due. Authenticated gameplay, click/keyboard navigation, and Save/restart are not proven by these controlled tests.

## Publication readback

Pending exact Lineage and companion Site source commit, remote-head and deployment identities.
