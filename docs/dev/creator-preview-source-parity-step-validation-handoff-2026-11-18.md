# Creator preview functionality-parity: validation and Core story safety slice

Date: **2026-11-18**, America/New_York  
Status: **STANDALONE QA PREVIEW IMPLEMENTED / VALIDATION-LIKE BEHAVIOR BROWSER-TESTED / PRODUCTION REACT AND OWNER-SAVE NOT_CHANGED**  
Source inspected: `master` `3d084f3f21ce28082c1fd532889e99a7ac4e4ae1` and draft PR #102 head `d3cd548f6b21aff11c40637c3e16026502f8e6e2`.  
Audit basis: current conversation `lineage-preview-vs-current-react-functional-audit-2026-11-18.md`, compared against actual repository `CharacterCreationNarrativeScreen.tsx`, `characterCreationForm.ts`, `characterCreationCatalog.ts`, `characterCreationMath.ts`, `worldSelectionCatalog.ts`, `EpochApp.tsx`, `MainMenuScreen.tsx`, `LocalAccountAccessScreen.tsx` and `SettingsScreen.tsx`.  
Parent: [Eight Core World Entry review-only profiles](../design/core-world-entry-eight-branching-profiles-ui-candidate-2026-11-18.md), [World Entry-first Creator intent](../design/character-creator-world-entry-prestige-supplies-portrait-integration-intent-2026-11-17.md).

## 1. What was actually implemented in this pass

The standalone HTML **`lineage-creator-validation-parity-preview.html`** (in conversation artifacts, not committed to the React tree), SHA-256 **`829d45a0ed90463aeaa8aff9a4a19ab1e14800677b56faf3e9a35165fc4a6466`**, derives from the prior `lineage-creator-core-world-entry-branching-preview.html`. The source review ZIP **`lineage-creator-validation-parity-review.zip`**, SHA-256 **`60376028c65d91b4a809d2fbd9ede72ec3d58fd15f8e8ab68a0b67f9322340a3`**, contains source HTML, `patch_creator_parity.py`, `test_creator_validation_parity.py`, screenshot script and images, results, previous audit, and README. This is an **external code-candidate/QA attachment**, not a repository merge or accepted source.

The preview now:

1. Uses an in-memory `creatorValidation` helper to enforce **seven proposed visual stage dependencies**. The Next action reports a role-alert error and focuses empty name instead of silently advancing. Numbered left-rail steps beyond the earliest invalid prerequisite are disabled until repaired.
2. Checks a nonblank name and currently presented sex/age/height/physique/nature/focus values; checks the selected color against the current *sample lineage palette* and current continent → subregion → settlement parent membership. These constraints approximate current form integrity for **preview testing only**.
3. Invalidates previously selected Core origin on World Entry pool switch, lineage/identity/appearance change and geography change. Old story branch state is cleared; Finalize becomes locked instead of retaining an origin that can no longer be trusted.
4. Makes all four **Hardcore-Off wilderness entries nonselectable** as character origins. A distinct `Read editorial draft` action still exercises their two-choice review narrative while leaving `entryId` empty and **Enter World disabled**. Ordinary Core editorial review remains available with correct input. All game publication remains blocked.
5. Keeps the **ten real lineage labels**, sample source color subsets, full authored geo list and matched parents, compact grouped stats, Identity/Finalize portrait prompt handoff and existing in-memory fake launcher. No account/game/Save API calls were added.
6. Removes the extra implementation caveat from the creator active canvas in line with the owner's player-facing copy-reduction direction; mock-only account/story labeling still makes prototype status clear.

### Evidence executed

- `node --check` of extracted preview JavaScript **PASS**.
- Chromium via Python Playwright `page.set_content` at **1280×850, 768×980, 375×812 and 320×700 PASS**. For **each viewport**: empty name blocks later navigation; accessible error/focus appears; corrected name unlocks; eligible ordinary profile can be read; pool switch clears selected profile; Hardcore has four read-draft actions but zero selectable gameplay cards; A→continuation→result still cannot enter World; return from draft cannot unlock Finalize; lineage change clears origin; settlement change clears origin; zero page JS errors and no horizontal overflow.
- Test result file in review ZIP `lineage-creator-validation-parity-test-results.json`: 4 viewport records, each PASS.
- **NOT_RUN:** current application React rendering, Node/Vite/TypeScript repository build, real `validateCharacterCreationForm` imported into the HTML, full canonical palette, actual account World/Save inventory, real World Create, source scene actions, Native-v3 publication, destructive flow, source PR merge or staging.

## 2. Remaining P0/P1 gaps versus current live React source

**Do NOT call this preview functionally equivalent to the existing source.** The real current eight stages are `Lineage → Identity → Continent → Region → Settlement → Backstory → Starting Bundle → Finalize`; the new seven-stage product design replaces the last two with a source-owned World Entry, but no migration has been accepted.

| Gap | Source-grounded real behavior | Source-capable next work |
| --- | --- | --- |
| **Real form validation and step-state guard** | `characterCreationForm.ts` `validateCharacterCreationForm`, `buildCharacterCreationStepStates`, `getNextAvailableCharacterCreationStepId` enforce specific errors and locked/completed step states; colors and age use canonical IDs, access uses source owners | **Use these exact current functions in a gated React UI**, not the prototype's simplified name/hex/label helper; add focused unit/React tests |
| **Identity and stats** | `characterCreationCatalog.ts` `getLineageIdentityCatalog` uses **18 skin/27 hair/18 eyes per lineage** plus true lineage sex/age restrictions; math computes **90 base + 10 automatically distributed profile = 100** from source; real resource values have authoritative calculation | Bind UI swatches to IDs, preserve full palette and exact profile resolver; remove illustrative HTML stat arithmetic |
| **Source Backstory replacement** | The real form uses `backstoryId` and selectability; some starting skill/lore/unlocks, access and **base stats** depend on it | Approve a versioned Core/Prestige World Entry source and Backstory compatibility projection, not a hidden empty/default Backstory |
| **Starting Bundle replacement** | Source validates bundle ID, optional specific item choices, currency and equipment. The real Finalize previews choice groups and starter policies | Source-owned scene grants; do not invent a parcel, lawful item or choose arbitrary starter gear by settlement label |
| **Heir/Legacy** | Real Finalize can select **Fresh Start / Heir Start** and eligible run source; selected Legacy preparations/choices affect resolved starter state | Preserve real account evidence, sourceRun, eligibility and preparation effects; show verified source on new Finalize |
| **Save-slot collision and overwrite** | `EpochApp.createCampaign` checks the slot and revalidates; overwrite is **unsupported** despite a UI confirmation affordance. `CleanEpochFirstCampaignAdapter.prepare()` writes a retained attempt and reserves a slot | Never call `prepare/start/resume` when entering/choosing/defer/retry a story. Source-own first publication only after accepted scenario + World + account + character + Save; exact-once receipt and reload/race recovery |
| **Geography and origin readiness** | World selection owner reports source difficulty, population, resources, lawful start access and restricts some destinations; 88 settlements **do not** establish 88 playable start scenes | Restore compact source preview details and validate actual eligible start site/actor/items/route; no new Game command from editorial prose |
| **Launcher fidelity** | Real account password/stay-signed-in/deletion/archive restore, 128 manual Save slots, Quick Save and Legacy screens, settings/time preferences; World Library currently held | Use existing authenticated/Save paths under contextual shell rather than the mock login/worlds/cards |

The UI-only preview introduced a separate `Read editorial draft` path for locked Hardcore. **Do not translate this path into game state.** Actual Hardcore needs World-created commitment, isolated wilderness site, survival path and irreversible terminal death acceptance. A reversible narrative score or QA view is not Hardcore.

## 3. Next bounded repository-capable slice

1. In a **real synchronized authenticated checkout**, pull latest `master`, read `AGENTS.md` and active Codex routing, inspect PR #102 overlap, and run the existing creator/account/Save/World baseline tests before edits. No connector-only untested TSX mutation.
2. On a feature-off-safe QA branch, **port only the presentation and dependency UX to `CharacterCreationNarrativeScreen.tsx`**, reusing current form/identity/World/preview/step functions. Preserve current eight-step source while World Entry replacement remains held. Add blank-name, invalid color, age/lineage and restricted settlement tests for both the visible rail and Finalize.
3. Bring the new lower/left stats views to **the same authoritative `buildCharacterCreationPreview`** and source tooltip; optional labeled 90+10 breakdown only in player-requested help. Preserve current Backstory-driven effects until approved replacement. No arbitrary manual stat allocation or trait balance.
4. Restore Legacy/heir/starter gear/choice groups/source and save-slot warnings to the new contextual Finalize as **verified owner-backed projections**. Do not build a fake selectable Save source from sample cards.
5. Keep Core/Hardcore narrative QA-only until at least one real ordinary accepted scene owns exact world/site/actor/item/legal-route predicates; later bind approved World Entry+Prestige+Heir/Legacy+Save first publication in separately owned, idempotent atomic work, with 2-tab/reload/archive parity tests. Hardcore separate later.

**Hard holds unchanged:** `L3B_BROWSER_CREATE_HELD`, `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION`. No app code, schema, Save, account records, game content, geography assets, item/combat/economy or PR merge/activation was performed in this ChatGPT run.
