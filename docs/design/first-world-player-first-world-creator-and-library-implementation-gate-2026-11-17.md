# First World: player-first World Creator, World Library and Character entry gate

Date: 2026-11-17 (America/New_York)  
Status: **OWNER-DIRECTED UX REVISION / CONNECTOR SOURCE-AND-CI PREFLIGHT / IMPLEMENTATION NOT YET ACCEPTED**  
Source head inspected before this document: `master` `e800b3cf589e364d3f4b3fe9c868af076f238dff`; draft [PR #102](https://github.com/vagabond1215/Lineage_Reforged/pull/102) `d3cd548f6b21aff11c40637c3e16026502f8e6e2`.  
Scope: one authored First World blueprint, many **distinct** account-owned World-instance histories eventually, honest World configuration, actual World/character selection and resume. No source-geography edits, site publication, Save rewrites, production feature activation or draft merge.

## 1. Updated owner intent and decision boundary

The creator does **not** generate an atlas. The user selects an existing authored World *blueprint* (initially fixed First World) and creates their own persistent *instance* and rules commitment from the supported global Chronicle scenario. Identical atlas does not imply identical World history. A World can exist without a character. Creating or selecting a World cannot implicitly create a character, choose a Save slot or resume gameplay.

The player path is:

```
Web page → Sign in / Create account
         → Chronicle (Persistent visibly unavailable)
         → YOUR WORLDS (owner-backed listing; create / select)
             → CREATE WORLD (name + supported World-level rules)
                 → atomic World + receipt → readback → WORLD OVERVIEW
             → EXISTING WORLD → WORLD OVERVIEW
         → CHARACTERS IN THIS WORLD (owner-backed roster; create / select)
             → new founder / eligible heir → existing Character Creator → World Entry
             → existing playable character → choose accepted current head/Save
         → ENTER / CONTINUE GAMEPLAY in this exact World and character
```

When visiting again, login must lead to World selection rather than guessing the latest global Save. The screen can surface a recent World/character shortcut **only when** the full verified association and latest accepted head are unambiguous. Back navigation returns to the correct previous scope; logout drops selected World, character and Save hints.

**Multi-World direction:** the user expressly wants a World selector and **Create New World** alongside it. The previously proposed one-World/account limit is an initial technical rollout cap, **not** a permanent product promise. The revised acceptance contract must distinguish a first one-World safety pilot from a multi-World-enabled result. Before calling the full selector functional, prove creation, selection and isolation of **at least two** separate World instance IDs for the same account. A finite quota must be explicit, owner-enforced and tested; do not invent unlimited instances or silently relax the existing PR #102 single-World receipt graph. If an interim pilot still has capacity one, display Create New World but disable it with “World limit reached” and do **not** call multi-World acceptance complete.

## 2. World Creator: configuration rather than geography generation

### First usable World Creator

- **World name:** editable, trimmed, validated; identity remains `worldInstanceId`, not name. Duplicate display names may be allowed if IDs and selection cards stay unambiguous.
- **World blueprint / geography:** `First World`, read-only canonical `world_map.first_world`, shared authored atlas and settlements. No procedural continent, political map repainting, terrain slider or player seed field.
- **World progression:** `Chronicle`, from the preceding mode choice; `Persistent` remains Coming Soon.
- **Global starting scenario:** `world_scenario.first_world.chronicle_default_v1` version 1, shown read-only when useful. The character's later *World Entry* scene is a different owner and selector.
- **World participation:** `Individual`; `Living World` disabled until the multi-player/shared-coordinator owner exists.
- **Difficulty:** **World-owned** selected preset for every newly created character in that World. Product candidates from accepted design are `Favored`, `Mortal` (default), and `Forsaken`; `Story` has design intent but lacks current campaign-schema support. Expose an enabled choice **only after** its exact supported engine/campaign mapping, replay and locked-after-create policy are tested. Until then, show `Mortal — currently supported` and clearly mark other choices Coming Soon; do not persist an arbitrary cosmetic enum.
- **Hardcore commitment:** belongs to the World, **not** a per-character checkbox. Display **Off** as the only active launch state; a clearly unavailable `Hardcore (Coming Soon)` may explain the future. Enabling it requires a versioned, accepted composition of tougher simulation, verified starting eligibility, death/continuity and Save/stakes semantics. It is **not** synonymous with `Forsaken`, `Grim World`, `Ironbound`, or legacy `runDifficulty.hardcore`. Do not make permanent-death claims until tested.
- **World simulation rules and Stakes:** separate axes; `Heroic World` and `normal_stakes` are the initial actual supported identities. Don't imply the full `Grim World` or `Ironbound` systems exist.
- **Seed:** cryptographically generated internally, versioned, retained and hidden. Reopen/retry uses the stored value, not a new roll. Source/template fingerprint and **full 41-source-set provenance fingerprint** are different obligations; the draft L3b template-only fingerprint is insufficient for complete economy reproducibility.
- **Create action:** disabled during validation/write; stable `creationIntentId` retained across retries; exact same account, rules, name, scenario, seed/source set and intent must read back the same World. A changed rule or source under the same intent conflicts rather than overwrites or rerolls. Show friendly, distinct capacity, stale session, storage blocked, corrupt data and retry outcomes. No success before transaction/readback.

### Later Prestige-gated customizations (not on the launch submit payload)

A future **World Modifiers** section may be unlocked by **verified account Prestige/Legacy entitlements**. Do not simulate access from a local flag or display nonfunctional sliders as if active. Hide the section initially, or use a single informational “World customization — Coming Soon” line.

Candidate independent controls, subject to climate/environment simulation authority:

- **Overall climate tendency:** a bounded tendency (warmer/cooler, wetter/drier) relative to the authored regional baseline; does not physically relocate continents, coasts, biomes, source sites, aquifers or rivers without a separately accepted causally consistent rule.
- **Regional variability and extremes:** degree of variation across places, seasons and years; must honor coastal/inland and elevation/habitat facts rather than uniform global randomization.
- **Climate intensity/contrast:** amplification of already wet/dry or hot/cold regions, with physically sensible caps and clear gameplay consequences.
- **Natural disasters:** master optionality plus **individual supported hazard families**, e.g. hurricane, tornado, volcanic event; hazard eligibility must follow actual geography, season and authored volcanic/tectonic sources. “Disasters off” suppresses admitted *natural-disaster simulation events*, not every dangerous weather condition, encounter, quest or authored historic event.
- **Unlock semantics:** visible requirement/cost/compatibility, deterministic initial parameter version and immutable creation receipt. Prestige spending needs an account-owned atomic ledger/receipt; no up-front speculative purchase interface.

Do not implement a second climate engine, fake weather changes, speculative volcano generation, an unverified catastrophe probability or arbitrary creator-owned map geometry. Treat these as deferred rule contracts and acceptance tests, not commitments to feature flags in the current World row.

## 3. World Library and selected-World character flow

### World Library (first actual screen after Chronicle)

Top bar: `YOUR WORLDS`, account profile/logout, Back to Welcome. Main content is a real, keyboard-accessible **list/grid of World cards** analogous to the existing character-selection presentation. Each card is keyed by `worldInstanceId` and displays verified name, First World source, Chronicle/Individual rules, available difficulty/Hardcore posture, creation/last-played dates, World status and only **owner-derived** character count. No Save-slot number masquerading as a World. Retained corruption/storage block is an error, not an empty list.

A persistent **Create New World** button opens the real form. Capacity/entitlement/unsupported-owner checks make it visibly disabled with a reason when necessary. Selecting a World first opens **World Overview**; it never auto-starts a recent Save.

### World Overview / Character Library

Show World identity/rules and **characters belonging to this World only**, not 128 unrelated global Save addresses. Rows/cards use `characterId`, verified display identity, actual career/lineage, alive/terminal/pending classification, location and eligible accepted campaign head/last played. **Create Character**, **Select Character**, **Continue** (only when unambiguous) and **Back to Worlds** are distinct actions.

A Save slot is a mutable address for an actual campaign/character head, not the character's or World's identity. A single character can have multiple accepted addresses, and a terminal historic character should not disappear because its active slot was cleared. The UI may expose the existing Save-manager controls in a nested details view, but never equate a bare slot with a World.

For first Chronicle Individual play, only validated character/world associations can enter the selected World. Older unassociated native-v3 records remain visible via a separate truthful legacy path or explicit migration flow; **never** automatically assign them to the First World because the character started in a similar region. World switching must clear stale character/Save selection and refuse cross-World load attempts.

### First-player empty-state copy

- Empty Worlds: `You haven't created a World yet.` Primary `Create Your First World`.
- Empty selected World: `This World has no characters yet.` Primary `Create Character`.
- World created/readback complete: `World created. Choose a character or begin a new life.`
- Existing character with valid head: `Continue [character name]` in **this selected World**; for multiple playable characters require explicit choice.
- Disabled Hardcore/customization: concise “Coming Soon” explanation, no active toggle.
- Corrupt/stale/offline store: explicit failure and safe retry; **never** “No Worlds” and never fabricate replacement state.

## 4. Source/CI findings and acceptance BEFORE implementation

Exact inspected code:

- `EpochApp.tsx` routes gated `WELCOME_AUTHENTICATED` to `WORLD_LIBRARY_GATE`; `WelcomeScreen.tsx` says “World Library not ready”. The feature is dev/loopback-opt-in with `?welcomeL1=1`.
- `MainMenuScreen.tsx` lists **SaveSlotSummary** rows and global latest Save; `state.ts` lacks `selectedWorldInstanceId` and a World-scoped roster/screen. `CharacterCreationForm` selects starting *geography*, not a durable `worldInstanceId`.
- Pure `firstWorldCreationContract.ts` enforces `hardcore:false`, `difficultyPreset:null`, `worldRules:null`, `stakesRules:null`, and candidate-only writes.
- Draft `firstWorldDurableRegistry.ts` likewise enforces initial non-Hardcore/null difficulty; draft `cleanEpochAccountStore.ts#createChronicleWorld` rejects a second independent World by design.
- Existing `packages/engines/player-engine/src/difficulty.ts` models old run tiers `easy/normal/hard/brutal` and a legacy hardcore modifier. `packages/engines/game-engine/src/campaign-rules.ts` maps to `favored/mortal/forsaken`, uses `heroic_world` + `normal_stakes`, and rejects other current campaign-rule identities; a true World-owned rules bridge **does not yet exist**.
- Authored world content and scenario manifest already exist; the exact `content.js` loader is Node-filesystem-backed, while its sibling `.js` modules re-export `.ts`. Browser-safe source-parity and full-source-set genesis fencing remain L3b blockers.

Observed historical hosted evidence:

| Gate | Evidence/result |
| --- | --- |
| Pure L2 Genesis owner tests | **PASS**, workflow [#44144222946](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44144222946) at earlier `0ba37e1`, not new UX code |
| Draft v8 synthetic and read-only real Chromium migration | **PASS**, workflow [#44128790998](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44128790998) at PR head `d3cd548f`; no live World create |
| Current master geography guard | **PASS**, workflow [#44174809372](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44174809372) at `e800b3cf` |
| 41/41 source pins | **PASS** connector immutable-blob readback, no local executable verification |
| Fresh exact-current master launcher/typecheck/build | **NOT_RUN** in this connector pass |
| Node ↔ Chromium real tick-zero economy parity | **NOT_RUN** |
| Real Chromium World create/reopen/multi-World quota | **NOT_RUN** |
| World-linked character selection + native-v3 Save/resume | **NOT_RUN** |
| Real Hardcore/difficulty World-rule propagation | **NOT_RUN** |
| 375/768/1280px keyboard/mobile selected E2E | **NOT_RUN** |

Source review and historic CI cannot be promoted into new end-to-end browser acceptance.

## 5. Next implementation plan: smallest safe connected slices

**Implementation owner: authenticated synchronized repository checkout, existing draft PR #102 for its v8 World changes.** Connector docs are preflight; no source/test/schema patch in this document. Re-fetch heads/PRs, inspect active Codex edit state, preserve other 79 draft PRs and all source/Save/production holds. Before code changes run the exact applicable baseline and record failure classifications. Do **not** merge PR #102 or switch default launcher activation based on a green synthetic fixture.

### Slice A — resolve source, provenance and owner rules

1. On the existing PR #102, reconcile current `master` and refresh its source/test baseline safely. Implement a manifest-verified, browser-compatible canonical content path at the **actually resolved** `content.js` import seam, preserving the existing civilization economy algorithms and isolating source caches.
2. Test the complete tick-zero `buildStarfallBaseEconomyPreview(createInitialClock())` in Node and real Chromium with exact pinned inputs, including market/simulation/warnings. Test missing, modified or mismatched source and stale caches fail closed.
3. Update the **unmerged** World/receipt candidate and validation contract to bind `scenarioId/version`, generation seed policy, versioned complete source-set fingerprint and **explicit immutable rule selection**. Avoid a cosmetic difficulty field. Keep actual supported Mortal/Heroic/Normal-stakes/non-Hardcore posture until alternate presets or a Hardcore owner pass their gameplay contracts. Handle `firstWorldCreationContract.ts` and all tests together, not by independently editing a JSON template.
4. Reconcile one-World safety pilot versus multi-World target before accepting the registry. An account can hold distinct World and receipt pairs; no accidental acceptance of orphan pairs. If the implementation moves directly to multi-World, use an explicit finite quota policy and prove two creations under one account and a third/further create refusal at the actual quota. Treat upgrade/export/restore/account reset/delete as one complete graph.

**Slice A exit:** exact-source, revisioned multi-World-capable contract and real browser World create/reopen/rollback parity are accepted, without game/UI activation. If any part fails: **`L3B_BROWSER_CREATE_HELD`**.

### Slice B — truthful World Library + Creator UI

5. Add `WORLD_LIBRARY`, `WORLD_CREATE`, `WORLD_OVERVIEW` states with selected World identity scoped to authenticated account and lifecycle. UI reads only from the owner-backed v8 repository API, not `localStorage`, Save-slot estimates or imported atlas JSON as a pretend registry.
6. Replace the “World Library not ready” branch **only behind the existing development gate** with verified list/create/select/back/logout/error routes. Create form presents names, fixed authored blueprint/scenario, and only the world rules actually honored. User-supplied settings are validated server/owner side as well as in the form.
7. Run Playwright/Chromium from a disposable origin/profile, tab races and multi-account data isolation; keyboard navigation, screen-reader labels, sizes 375/768/1280; stable selected card on refresh; blocked IndexedDB and archive restore. Preserve feature-OFF launcher behavior.

**Slice B exit:** real World Library/Creator acceptance, no character or game entry claim yet.

### Slice C — World-scoped characters and playable entry

8. Define and test versioned account/World/character/campaign/Save association and migration policy with exact native-v3 accepted authority. Read roster per `worldInstanceId`, not slots globally. Preserve and classify unassociated historical records and terminal history.
9. Reuse existing character creator under a selected verified World; character starts at approved actual local Starfall area and inherits versioned World rules. Make one legitimate gameplay command, publish Save with World/campaign/character identity and authoritative action receipt; close/reopen/re-authenticate and resume that exact head. Never reroll economy, World clock, local actors or source geography.
10. Verify two Worlds under one account with distinct characters/campaigns: switch World, isolation/no cross-load; repeat in another account and multiple tabs; stale-world revision rejection, interrupts and full export/restore; unchanged old native-v3 Save histories.

**Slice C exit:** selected account → World → character → authoritative gameplay/save/restart is accepted. This is the first true functional-path milestone, separate from Story, Hardcore, disaster generation and world-editing acceptance.

### Slice D — graduated rule selections, then environmental Prestige

11. Enable `Favored`/`Forsaken` only after World-pinned per-character effective difficulty is executable, with evidence that actual relevant gameplay changes and reload yields identical parameters; preserve Mortal default and clear immutable-after-creation warnings. Story needs an accepted own runtime/schema implementation first.
12. Enable Hardcore only after explicit accepted World-level composite, restricted entry/death/Save/lineage behavior, multi-character consistency, disclosure and failure/restart safety. Do not map it directly to legacy hardcore or destroy Saves merely on a UI toggle.
13. Later propose individually versioned climate/variability/amplification/disaster generation contracts and Prestige entitlements; only then enable real World modifiers with causal/geographic eligibility and deterministic creation receipts. For now hide or mark one compact Coming Soon disclosure.

## 6. Required executable acceptance matrix

Use a **fresh disposable browser origin and isolated database**; no user-owned browser profile, production Save or preview deployment. Preserve one historical v7→v8 fixture and one native-v3 retained fixture. For each slice capture exact base/head/dirty state, tools, commands, PASS/FAIL/NOT_RUN, persisted IDs and digest comparisons (redacted), pre/post account generation/revision and post-browser-reopen proof.

Minimum positive: first account create→World A→empty roster, second World B with same atlas but distinct identity and unshared state, a real selected character in A, save/restart/resume A, fresh character in B, Back→World A selection, unchanged account C, exact backup export/restore, stable rules/provenance.

Minimum negative: disabled unsupported settings, no source pack, mutated economy manifest, stale session/account generation, same intent identical retry, same intent altered rules, two intents same account concurrently, two tabs same World, over-capacity create, missing/orphan World/receipt, missing/out-of-world character, corrupt/unsupported/pending Save, interrupted World or Save commit, blocked upgrade/read, deleted/recreated account, invalid World rules with no partial write, feature-OFF rollback and no cross-account/card leakage.

Suggested baseline commands in synchronized checkout, with versions/profiles recorded:

```sh
node --test tests/unit/first-world-creation-contract.test.mjs tests/unit/starfall-world-template.test.mjs tests/unit/starfall-base-economy.test.mjs tests/unit/launcher-welcome-routing.test.mjs tests/unit/launcher-welcome-mode-cards.test.mjs
npm run tool:no-new-hex-dependencies
npm run typecheck:ui:node
npm run ui:build
```

Draft PR-specific migration/browser workflow additionally runs `node --import tsx --test tests/unit/first-world-l3a-v8-migration.test.mjs` and `node --import tsx apps/rpg-ui/tests/first-world-l3b-real-browser-qa.mjs` with the workflow's disposable Playwright dependencies and exact historical v7 source fixture. **Extend that script to World create and selection assertions rather than treating its current read-only evidence as create acceptance.** Add feature-OFF and native-v3 selected journey probes at the matching slice; the build/TS/lint results must be recorded at the tested commit.

## 7. Holds and integration posture

- **`L2G_SOURCE_CONTRACT_READY`** means documented source inputs only, not player-clickable accepted World creation.
- **`L3B_BROWSER_CREATE_HELD`** persists until real Chromium source parity and atomic World create/reopen/rollback pass.
- **`HOLD_SELECTED_ATOMIC_ACTIVATION`**, **`HOLD_STAGING_PUBLICATION`**, default feature-OFF behavior, existing native-v3 Save rules and geographic source constraints remain unchanged.
- This document revises product placement and implementation order. Existing source code, CI and completed historical acceptance remain historical evidence; they are not falsely recast as updated functional proof.
