# Character UI Selected-Client Acceptance And Minimal Repair

Date: 2026-10-21. Repository: `vagabond1215/Lineage_Reforged`. Run class: unversioned Character UI acceptance support; development and Game-version impact: `none`. Game remains `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, with `DEV-0.7.2_NOT_READY` and `GAME_VERSION_NOT_READY`. Active `DEV-0.7.2.13` combat prompt/output/handoff were not changed.

## Source and disposition

Fetched/pruned `origin/master` `f56229dde859b9374a54368bd8a8fd2a9872daa1`; clean starting PR #7 head `06e9ff02311f93c3d9accb5da819d6ae1378ec28` on `codex/character-first-ui`. Draft PR #7 remains the isolated implementation branch. Draft PR #5 design head `cafe0ff1c66db530116dafc147d09e6f4ad03e49` and its proposed selected-acceptance prompt were read; neither PR was merged or made ready.

| Accepted Character intent | PR #7 live source and this pass |
| --- | --- |
| Authentic identity | Snapshot name and `originProfile.lineageLabel`; this pass repairs Background to use the authored `backstoryOptions` label, omitting unknown IDs. Equipped title remains conditional. |
| Nine attributes | `CHARACTER_ATTRIBUTE_ORDER` drives all current snapshot values in a responsive one/two/three-column matrix. Existing `uiViewModel` attribute detail provides description, current value, origin adjustment and threshold band. The separate Attributes route remains. |
| Capabilities and gear | Developed skill ranks, Echo/resource growth and up to four occupied equipment entries use existing snapshot/state builders; empty skills and absent gear do not invent values. |
| Navigation and actions | Character-only horizontal strip retains ten sections with Arrow/Home/End and ordinary Tab behavior. Skills, Equipment and Inventory routes remain; item operations still call the pre-existing shared `characterPanelState` actions. |
| Removed duplication | No permanent Overview ReadinessCard, repeated HP/MP/ST, partial Core Stats, empty progression metrics or Runtime Bridge. Global top band and other domains were not edited. |

## Independent diagnostics and repair evidence

With the same installed UI dependencies and `npm run typecheck:ui`, a detached clean `origin/master` checkout produced **137** TS diagnostics and PR #7 produced **136**. After the repair, the UI branch still produces **136**. Signature comparison after ignoring line/column movement found one changed `TS2375` text at `PanelDetailStack` because the inferred `primary` type changed; the same exact-optional-prop problem already exists on master. PR #7 also removed master's `string[].at` `TS2550`. No new TypeScript failure category was introduced. The broad typecheck remains failing and was not described as green.

Pre-edit controlled render failed when `backstory.local_hero` displayed `Local Hero` instead of the authored `Local Champion`. Fourteen catalog backstory IDs have labels that differ from naive ID capitalization. The minimal repair selects the catalog's canonical label and hides unknown IDs. The render regression now passes and checks both positive/negative origin adjustments, all nine independently changed current values, null titles, empty equipment/inventory routes and no invented Background.

Controlled owner-action test: existing demo `composite_bow` was unequipped into Inventory; an authored `arming_sword` stack added to a cloned fixture was equipped through the existing owner action and displaced the bow into Inventory; an authored `bread_loaf` stack was consumed through the existing action, reducing quantity from 2 to 1. Source snapshot remained unchanged. This is **controlled fixture/owner-path evidence**, not ordinary selected-client action or Save/restart proof. The existing demo bow has no `inferEquipmentSlot` mapping on master, so re-equipping that particular demo item is a pre-existing Equipment/Inventory limitation left for its own owner review.

Checks: app SSR/action tests **2/2**; root focused navigation/attribute/equipment-profile/SaveSnapshot tests **44/44**; `npm run typecheck:ui:node` **pass**; app-local `npm exec -- vite build` **pass** (255 client modules); broad UI typecheck **136 diagnostics**; `git diff --check` **pass**. Static accessibility checks cover named section navigation, `aria-current`, expandable attribute buttons/detail region, focus-visible styles, adaptive grid classes and keyboard index behavior. Authenticated keyboard, reflow and screen-reader interaction remain unverified.

## Selected-client boundary and next trigger

**SELECTED_INTERACTION_UNVERIFIED.** The only exposed local browser tab reaches Account Login. An existing `DEV12 selected 300a2b06` account requires a password; no authorized authenticated session or credential is available. No credential was requested, guessed, printed, reset or bypassed. No account, save or gameplay state was changed. Character → Attributes detail → Skills → Equipment → Inventory traversal, real item actions, narrow viewport, keyboard focus, Save/load and restart therefore remain the exact selected acceptance hold. Keep PR #7 **draft**. The next UI slice (persistent resources/significant conditions) is not ready to start as accepted Character work until this selected readback and PR #5/master overlap review pass. The pre-existing demo bow mapping should be reviewed with the Equipment/Inventory owner separately.

Branch review: PR #5 remains draft `CANDIDATE_INTEGRATION` pending semantic review; PR #6 and independent nutrition contract remain held; readiness/prompt-integrity refs remain protected; creator/admin refs retain prior holds. No merge, rebase, deletion or retargeting was due. Applied FP-001 (real caller/controlled versus selected boundary), FP-002 (no parent/Game acceptance), FP-008 (semantic PR review), FP-009 (exact source/branch identities), FP-017 (fixture proof not promoted). No new failure-pattern entry is needed.
