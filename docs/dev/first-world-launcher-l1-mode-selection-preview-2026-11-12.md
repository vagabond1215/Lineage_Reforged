## 2026-11-12 owner-approved development-master source integration

**Superseding disposition:** PR [#75](https://github.com/vagabond1215/Lineage_Reforged/pull/75) was explicitly authorized and merged into development `master` at `ef0181fae2850dcb2f19f61d75d711ee90941117`, with first parent `bb17120bca51bd953fb494618d42b75051a1352d` and source preview head `d0393d4ba89ff7a7c893078123b479fddbdd7719`. Base-to-main comparison before integration showed zero source/test versus master documentation path overlap. GitHub post-merge readback confirmed the exact six source/test paths landed; `WelcomeScreen.tsx` blob `17c68d77bc50cc7914338bd23f23161cb15d08d2`, `EpochApp.tsx` blob `6cdad2916e273e920323515733dbf49893209cf0`, mode-card tests blob `875be8518c9ff768c09da20e0a6683f7a45fdf58`. All master design documents were retained. Development feature is still disabled without explicit loopback `?welcomeL1=1` opt-in; old feature-OFF launcher is preserved.

**Integration is complete, but acceptance is not.** The isolated branch and earlier hold statements below are **historical evidence**, not the current branch disposition. No exact-main Node/typecheck/build, browser, two-account Save negative or end-to-end feature-OFF Save/reload evidence was executed here. `L1_SOURCE_IN_MASTER_EXECUTABLE_ACCEPTANCE_HELD`; `HOLD_SELECTED_ATOMIC_ACTIVATION` and `HOLD_STAGING_PUBLICATION` persist. Owner prefers **main-first ongoing development**; the active [Codex task](current-codex-prompt.md) now targets latest exact `origin/master`. Neither historical candidate branch was deleted.

---

# L1 Welcome Mode Selection: isolated UI preview and design recording

Date: 2026-11-12 (America/New_York)  
Game: `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; development/version impact `none` / `none`.  
**Status: `L1_MODE_CARDS_SOURCE_PREVIEW_READY; HOLD_INDEPENDENT_EXECUTABLE_REVIEW; HOLD_L1_INTEGRATION_AND_FULL_ACCEPTANCE`.**  
Owner direction: [World modes, World-owned Hardcore, clock and cross-mode currencies](../design/world-progression-modes-hardcore-time-and-cross-mode-currencies-intent-2026-11-12.md).

## Evidence and exact refs

- Reviewed original L1 candidate unchanged: `codex/l1-branded-welcome-account-entry-2026-11-11` at `14aa6380a3a6bb4aae35e0712169c302758d97d5`. Retain without merge/rewrite.
- New **separate UI candidate**: `codex/l1-welcome-mode-selection-preview-2026-11-12` at `d0393d4ba89ff7a7c893078123b479fddbdd7719`. GitHub compare against the original L1 SHA reports **2 commits ahead, 0 behind**, exactly two changed paths: modified `apps/rpg-ui/src/game-shell/components/WelcomeScreen.tsx`, new `tests/unit/launcher-welcome-mode-cards.test.mjs`.
- The UI candidate remains behind a pre-existing strict native-v3 + `import.meta.env.DEV` + loopback + `?welcomeL1=1` flag, **OFF by default**. It does not change `EpochApp`, `state.ts`, account adapters, storage/Save schema, World registry, game version or hosted route. Original feature-OFF path remains source-unmodified.
- Authenticated Welcome now displays verified profile name, `Choose your journey`, two text-first mode cards. The responsive grid stacks by default and is two columns at `md` width. **Chronicle** is the enabled UI preview and delegates to the *unchanged* `onContinue` owner gate, opening existing **World Library not ready** / Back. **Persistent** is a disabled button displaying **Coming Soon** and has no onclick/write path. Logout remains available.
- New `node:test` source-level checks inspect labels/availability, responsive card and focus markers, Logout/Back, and absence of direct storage/World/Save calls in the new view. Connector read back the exact blob and performed **8/8 narrow static source assertions** (not Node unit execution). The 3 new `node:test` cases are committed but **not executed** by Connector.
- GitHub Connector cannot prove exact-browser rendering, computed responsive layout, keyboard/disabled operation, native account/Save integrity, `npm` build/typecheck or CI for this branch. Source correctness and tests do not close L1-A01…L1-A15.

## Original product intent recorded separately on master

The new linked design record establishes **Chronicle** repeated runs and **Persistent** long-life progression as distinct World progression modes sharing one simulation. World Creation will own the mode, Hardcore commitment and inherited character flags, pause and speed policy; no world-time jump from clicking a timed action. Mode-earned currencies and account/cross-mode specialty benefits are conceptually selected, but the final two-ledger versus third bridge-ledger topology, names, earning sources, exchange and balance are **still proposed**. No currency, shop, World, character inheritance, real-time service, game clock or migration was implemented.

Linked precedence updates cover:
- `docs/design/welcome-world-library-character-entry-and-loading-plan-2026-11-11.md`
- `docs/design/core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md`
- `docs/design/first-world-launcher-l1-welcome-account-entry-implementation-plan-2026-11-11.md`
- `docs/design/first-world-launcher-implementation-process-map-2026-11-11.md`.

## Next bounded verification before acceptance

1. Run `node --test tests/unit/launcher-welcome-mode-cards.test.mjs tests/unit/launcher-welcome-routing.test.mjs tests/unit/launcher-auth.test.mjs` in an **isolated task-owned checkout at the exact UI branch SHA**. Do not assume all commands will pass without actually running them.
2. Run `npm --prefix ./apps/rpg-ui run typecheck:node`, compare any broad TypeScript diagnostics to source baseline, then perform the correct registered direct Vite build.
3. Use a task-owned loopback origin/profile, never the owner's running `127.0.0.1:5240` tab, to witness 375/768/1280 layouts, Tab/Enter/disabled Persistent, Logout, Chronicle → unavailable Worlds → Back, signed-out auth, and unchanged feature-OFF Save/reload. Read exact source identity and retain synthetic data fingerprints.
4. Keep the **original L1 candidate** separate as the pinned subject of the active account/session/Save-integrity work order. The visual variant's independent evidence may later supplement, **not retroactively replace**, the original L1-A01…A15 checks. Any proposed integrated version needs an explicit reconciliation/acceptance decision.
5. No merge, PR, deployment, Game version change, account/Save mutation, World creation, real Prestige/Hardcore activation or source branch deletion in this Connector pass. `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION` and L1 acceptance remain.

