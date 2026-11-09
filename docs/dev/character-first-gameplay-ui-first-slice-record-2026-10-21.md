# Character-First Gameplay UI: First Character Slice

Date: 2026-10-21
Repository: `vagabond1215/Lineage_Reforged`
Run: **Character-First Gameplay UI Migration**, unversioned presentation implementation; development impact `none`, Game-version impact `none`.
Inspected and implementation starting head: `master`/`origin/master` `f56229dde859b9374a54368bd8a8fd2a9872daa1`. Branch: `codex/character-first-ui`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; `DEV-0.7.2_NOT_READY` and `GAME_VERSION_NOT_READY` stay in force. Final commit and hosted head are reported after publication.

## Scope and authority

The clean starting checkout was on `codex/human-metabolic-reserve-contract`; an isolated branch was created from current master before editing. Draft PR #5 (`parallel/ui-guidance-consolidation-2026-10-21`, `753afcfb`) is documentation-only and remains unmerged. Its Character-first decision and proposed prompt were compared with master `ui-information-architecture-boundary.md`, the installed `DEV-0.7.2.13` combat prompt and live Character source. PR #6 and the independent reserve contract remain held design inputs. Neither PR was merged or edited. The active combat prompt, output and GPT handoff were preserved.

| Player concern | Before-state source | This slice | Preserved owner/action |
| --- | --- | --- | --- |
| Identity | `CharacterPanel` defaulted to readiness and generic progression cards | Name, actual ancestry, optional backstory and equipped title | `playerState.coreData`, `originProfile`, `titles` |
| Attributes | Separate long list; Overview `Core Stats` included only STR/AGI/SPT | All nine current values in canonical order; one on-demand source/meaning detail | `playerState.attributes`, existing `character.lists.attributes`; separate Attributes section retained for search/selection |
| Skills and growth | Generic metrics and tracked-skill counter | Highest developed ranks and Echo/resource growth | Existing `skills`, `progression`; Skills section unchanged |
| Gear | No compact Overview loadout | Up to four occupied slots, with Equipment route | `buildEquipmentEntries`; Equipment/Inventory item actions unchanged |
| Navigation | Second permanent `SidebarMenu` and `PanelLayout` 220px rail | Character-only scrollable horizontal strip, arrow/Home/End navigation, focus and selected-section state | Six-domain global rail and other panels unchanged |
| Condition and resources | Permanent `ReadinessCard`, repeated HP/MP/ST and mixed Core Stats | Removed from normal Overview | Existing top bar, condition disclosure, Traits/Effects and body-state owners retained |
| Diagnostics and empties | `Runtime Bridge`, Field Shortcuts and zero metric cards | Omitted from normal Overview | No view-model or save data deleted |

## Checks and evidence

- Controlled component server render using the existing demo snapshot: **1/1**. It verifies unchanged snapshot bytes, actual name/ancestry, nine ordered owner values and names, section labels/routes, and absence of former dashboard text. This is fixture rendering, not selected-client proof.
- Character keyboard index test: **1/1**. Arrow/Home/End bounds and ordinary Tab behavior are checked. The component additionally exposes `nav`/section labels, `aria-current`, visible focus styles and selected-section scroll behavior; no live keyboard or screen-reader session was available.
- Focused attribute/equipment-profile/save-roundtrip tests: **43/43**. A later targeted attribute/navigation/save run: **8/8**. Node UI-config typecheck **pass**. App-local Vite production build **pass**, 255 client modules. `git diff --check` **pass**.
- Broad UI typecheck remains failing at **136 diagnostics**, including **18** in CharacterPanel's existing indexed-list and optional-prop patterns; no diagnostic points to a newly introduced expression. It is not a green gate.
- The initial browser inventory had no selected game tab, and the first in-app connection timed out. On the continuation pass, the in-app browser reached the local Vite app at `127.0.0.1:5173`; it displayed Account Login with existing accounts. Selecting `DEV12 selected 300a2b06` exposed a password field and Log In action. No credential was available, so authenticated Character → Skills → Equipment → Inventory operations, keyboard traversal, Save/load and restart remain unverified in a selected client. No account or saved state was changed.

## Disposition and next slice

**CHARACTER_UI_SLICE_IMPLEMENTED_PENDING_SELECTED_INTERACTION_REVIEW.** The new presentation does not alter engines, item mutation helpers, SaveSnapshot, creator, combat, nutrition, Home, global shell, generated/vendor files or `GAME_VERSION`. Retain this branch for review against PR #5 and fresh master/combat overlap before integration. The next bounded UI slice is persistent top-band resource and significant-condition presentation, after this Character slice receives selected navigation and item-action readback. Equipment/Inventory ergonomics and combat/World result feedback remain separate later routes.

Applied guardrails: FP-001 (real component render, selected UI unavailable and disclosed), FP-002 (no parent/Game acceptance), FP-008 (PR #5 semantic review without merge), FP-009 (source, branch and hosted publication identities separated), FP-017 (controlled demo render not promoted to selected reachability). No new reusable failure pattern was found.
