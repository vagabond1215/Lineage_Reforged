# Character Entry + DEV Scoped Save Export: Candidate Implementation Handoff

Date: 2026-11-17, America/New_York  
Status: **STANDALONE SOURCE CANDIDATE LOCALLY UNIT-TESTED / PRODUCTION REPOSITORY INTEGRATION NOT_RUN**  
Inspected source `master` `aa742eafab628ebb3c75e9eff92e6c20adf6ec78`, documentation head before this handoff `7474f097cb64d14e5acdf34f027dac4467561cd5`; PR #102 was open/draft, code head `d3cd548f6b21aff11c40637c3e16026502f8e6e2`.  
Parent: [Detailed existing creator Finalize→World Entry integration plan](../design/character-creator-post-finalize-world-entry-integration-plan-2026-11-17.md).  
Preserve `L3B_BROWSER_CREATE_HELD`, `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION`.

## 1. User request

Continue with plan implementation. Also add a **developer command export icon (icon-only, accessible label/tooltip)** to World and character Save slots/cards to help validate Save data. Do not add an unscoped full-epoch backup under a Save row.

### Source checkout blocker in this session

The current ChatGPT container has `node`, `tsc`, Python Playwright and Chromium for isolated code tests, **but no authenticated synchronized repository checkout**. `git ls-remote https://github.com/vagabond1215/Lineage_Reforged.git HEAD` fails DNS lookup. The GitHub Connector can inspect/update repository documentation but cannot perform the required source-checkout/typecheck/game E2E and cannot safely claim production integration. Therefore **no production TSX, World owner, Save owner, state-machine or account code was committed** in this pass. Existing PR #102 was not changed. This is the correct fail-closed disposition under repository-first protocol.

## 2. Actual candidate code prepared outside the repo

A downloadable **38KB ZIP** named `lineage-character-entry-dev-export-candidate.zip` is attached in the current ChatGPT conversation, SHA-256:

`8fac087c027f75ee65582b69e4d16afac29b5a4c0ec814623561fb18a301a322`

The ZIP contains source candidate TypeScript/TSX and pure tests, a manifest, integration instructions, and the self-contained navigable QA HTML. **This ZIP is a handoff artifact, not merged or source accepted.** Do not invent a GitHub URL for it or claim it is in `master`.

| Candidate source file (inside ZIP) | Intended use and current status |
| --- | --- |
| `src/game-shell/characterEntryPrologue.ts` | Pure v1 sample graph for Local/World-Stray, four Isekai variants, finite refusal, one explicit rewind, bad end, eligibility input requirement. **Compiled by local `tsc`, tests PASS**; candidate story texts not canonical source. |
| `src/game-shell/devSaveDiagnostic.ts` | Pure allowlisted root packet builder for verified World+receipt or verified character+ready Save, stale/mismatched account/world/character/head rejection, forbidden auth-key rejection, portable JSON, 24MB cap, SHA-256. **Compiled by local `tsc`, tests PASS**. |
| `src/game-shell/components/CharacterFinalizeOpeningPanel.tsx` | Additive `Your Opening Awaits` Finalize panel, without replacing eight current creator steps. **TSX syntax transpiled only**; no app typecheck. |
| `src/game-shell/components/CharacterWorldEntryScreen.tsx` | No-rail story scene with choice cards and disabled `Enter the World` unless an approved callback exists. **TSX syntax transpiled only**. |
| `src/game-shell/components/CharacterEntryResultScreen.tsx` | Parody 0/100 terminal *pre-publication* result; retry/back; no actual death. **TSX syntax transpiled only**. |
| `src/game-shell/components/DevSaveDiagnosticIconButton.tsx` | Small icon-only DEV download control with `title`, `aria-label`, pending state, `stopPropagation()`, Blob local download. **TSX syntax transpiled only**. |
| `tests/*.test.mjs` | Pure narrative route + negative export validation + SHA-256 tests: **14/14 PASS** locally. |
| `preview/lineage-integrated-dev-export-preview.html` | Entire standalone launcher QA route with **DEV download icon** at World cards/Overview and illustrative character card/roster. Uses only in-memory sample records, never real auth/IndexedDB/Save; exported file format `lineage.dev-diagnostic.mock.v1` with `sampleDataOnly:true`. |

**Local executable checks completed:** `tsc --project tsconfig.json` PASS for the two pure modules; `node --test tests/*.test.mjs` **14/14 PASS**; TypeScript `transpileModule` syntax checks for all four TSX components PASS, **NOT** a real application typecheck/build; browser Playwright against system Chromium via `page.set_content` at 1280,768,375,320 PASS on explicit World and character mock JSON downloads, exact mock identity/scope, no unwanted navigation, JS errors, or page overflow. A mobile screenshot audit found a cramped character row after inserting the dev icon; the isolated responsive grid was corrected and rechecked. Browser source game, real World create, owner Save readback, React integration and full native-v3 E2E **NOT_RUN**.

## 3. Developer diagnostic placement and safety

- **World Library World card:** tiny export icon beside `Open World`, or in World Overview near Back. Label `DEV export World diagnostic JSON` via tooltip and `aria-label` (visible glyph only plus optional small DEV mark). User chooses exact World. It exports **owner-verified World+paired creation receipt**; not a character Save or a full account archive.
- **Character Library / selected ready Save row:** same tiny icon beside the exact `ready` Save/head. Label `DEV export Character Save diagnostic JSON`. Export actual selected snapshot, campaign control/head identities and slot metadata after current authenticated account/World/character association revalidation; not all 128 global Save slots treated as characters.
- **Gate:** `import.meta.env.DEV` **AND** an explicit isolated QA/debug gate. Hidden for production/feature-off/anonymous sessions. Disable when source absent, incompatible, corrupt, prepared/uncommitted, account stale, receipt missing, or World-character association not yet accepted. The proposed v8 `listChronicleWorlds` read method does not expose a paired receipt directly, so a checked **read-only World+receipt API** is a prerequisite, not an invitation to bypass the owner and query raw IndexedDB.
- **Privacy:** `CleanEpochAccountStore.exportArchive()` is a whole-epoch export of accounts and other stores (including credential verifier data). **Do not use it on these controls.** The candidate scoped builder excludes complete account owner records, rejects authenticator material if unexpectedly present, and downloads locally only after explicit click. The resulting character JSON may still contain personal player-given names and activity history, so include an appropriate diagnostic-data disclosure. SHA-256 is export-byte integrity only, not authoritative Save provenance.
- **No mutation:** downloads do not call `prepare`, `resume`, `start`, Save, World create, clock tick, reward, account archive restore or Game commands. On real integration, record before/after retained World/account/Save digests and verify equality at real owner head.
- **Existing creator:** `CharacterCreationNarrativeScreen` currently Finalize/Begin Journey calls `onCreateGame` → `EpochApp.createCampaign` → `services.first.start()`. Even `first.prepare()` writes a prepared attempt and reserves a slot. Never call it on prologue entry, failure, retry or export. Keep normal existing creator/overwrite feature-off path unchanged.

## 4. Required next repository-capable Codex execution

1. Fetch/prune exact live master and PR #102, verify clean worktree, owner and tests. Read candidate ZIP from the conversation artifact if available in the Codex runtime (do not assume cross-platform file visibility); otherwise reconstruct from the attached source by the user-authorized transfer route. Validate candidate against the real checked-out repository, not remembered API shapes.
2. **First bounded checkpoint:** Implement `CharacterFinalizeOpeningPanel` and pure story graph only on isolated QA path, preserving all eight actual character-creator steps, `onCreateGame` feature-off, existing Backstory eligibility, and current `needsOverwrite`. Add real Jest/Node + React/Chromium QA tests. No DB write.
3. Implement story/result presentation under the same guarded QA source. Add screen-level contract and keyboard/theme/mobile tests; no accepted game entry without owner publication.
4. Implement **read-only scoped diagnostic exporter** as a separate, testable dev-only slice: world + receipt exact owner read (after v8 acceptance); character + accepted artifact/head read (after World association acceptance); stale/race/restart and zero-mutation digests; privacy regression. Use actual icon-only affordance and tooltip on World cards / ready Save rows; do not invent World Save slots.
5. Only after independent PR #102 L3b World engine/browser/full-source parity and atomic ownership gates, wire actual prologue success to exact-once World→character→campaign/native-v3 Save publication. Hard holds and production publication remain unless separately accepted.

**Owner-reported milestone:** no new maturity band or release; route is `supports_current_band` only as future acceptance may support. The available Connector is useful for docs/handoff; an authenticated source-capable Codex implementation session with Node/Vite/Chromium is the valid integration/validation surface. Exact model/effort selection depends on that session's actual available capabilities and resource budget.
