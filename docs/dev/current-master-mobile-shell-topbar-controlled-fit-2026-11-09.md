# Current-master mobile shell and top-bar controlled fit

Date: 2026-11-09. Run class: unversioned controlled-browser visual audit. Source: synchronized local `master`/`origin/master` `bd94bbc74b1573b98563b95319f8446ddd3cc165`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. This record addresses only the two `UNRESOLVED` CSS rows in [the exact-master audit](historical-ui-prs-10-16-exact-master-semantic-equivalence-audit-2026-11-09.md). The installed non-fungible gear prompt was preserved.

## Runner and controlled state

ChatGPT in-app browser (`iab`, browser ID 2), operating a temporary local Vite page that imported current-master `InGameShell` and its current CSS. The temporary page used the historical controlled demo snapshot only as synthetic input; Save/Quick Save callbacks incremented local counters and did not touch accounts or Saves. The Vite server was registered under process session `ui-controlled-fit-20261109-01a1bf30` on port 5186 and stopped after observation. Temporary fixture files were removed. Screenshots were captured and inspected in the browser tool at 320×667, 375×667, 667×375, 768×1024 and 1440×900, but the browser surface did not expose a permitted path to save their bytes into the repository. Thus there are no durable screenshot links in this record. Browser zoom keys left `devicePixelRatio`, `visualViewport.scale` and the viewport unchanged; a genuine 200% zoom pass was unavailable.

## 100% viewport observations

| CSS viewport | Current shell and navigation | Measured content behavior |
| --- | --- | --- |
| 320×667 | Header 164 px; horizontal destination rail starts at y=174 and scrolls horizontally. | Document scroll width 320 px. Character workspace y=225, height 436 px, content 1499 px. Settings Save at x=37, y=409, fully visible when opened. |
| 375×667 | Compact header and horizontal destination rail. | Document scroll width 375 px. Character workspace y=225, height 436 px, content 1494 px. |
| 667×375 | Top resources remain above left navigation rail; rail begins at y=97. | Document scroll width 667 px. Character workspace x=116, y=105, height 262 px, content 1076 px. |
| 768×1024 | Top resources remain above horizontal destination rail at y=101. | Document scroll width 768 px. Character workspace y=142, height 882 px, content 992 px. |
| 1440×900 | One-row top bar, left navigation rail and wide workspace. | Document scroll width 1440 px; Character workspace begins x=152, y=63. |

Character, Inventory, World and Activity destination buttons were selected at every viewport. HP `175/214`, MP `116/132`, Stamina `195/195`, calendar, condition indicators, notifications and Settings were visible in the controlled state. Scrolling the bounded workspace is required on smaller viewports; no document-level horizontal overflow was measured. These are controlled visual observations, not player-state or selected-client acceptance.

At 375×667, the warning condition disclosure occupied x=20, y=169, width 343, height 475 (bottom 644); its content scrolled from 473 client px to 669 content px. The calendar disclosure occupied x=12, y=59, width 343, height 539 (bottom 598), with 537 client px and 981 content px. Both fit within the viewport, closed with Escape and returned focus to their triggers. At 320×667, the condition disclosure occupied x=20, y=169, width 288, height 475 (bottom 644); the calendar occupied x=12, y=59, width 288, height 539 (bottom 598).

## Per-path disposition

| Historical row | Result | Exact reason |
| --- | --- | --- |
| PR #15 `src/styles/mobile-shell.css` | `CONTROLLED_LAYOUT_BLOCKED` | The five 100% layouts and four destination routes were usable in the synthetic fixture, but required representative 200% zoom and durable screenshots were unavailable through the controlled browser surface. Full requested visual acceptance is therefore open. |
| PR #16 `src/components/top-status-layout.css` | `CONTROLLED_LAYOUT_GAP_FOUND` | At 320×667 and 375×667, Settings and Notifications opened, but Escape left their disclosures open. Condition and calendar did dismiss and restore focus. The Settings/Notifications keyboard behavior is a reproducible current top-bar interaction gap; 200% zoom and screenshot archive remain open separately. |

Smallest repair work order: give Settings and Notifications disclosures an Escape handler that closes the active disclosure and returns focus to its trigger, matching the condition/calendar pattern. Recheck keyboard focus and clipping in the same five viewports, including real 200% browser zoom, and save current-master screenshots through a runner with supported artifact export. No implementation was made in this audit.

## Boundary and lifecycle

No UI source, tests, owner code, account, Save schema, Game version, deployment, Site, native-v3 ref or PR state changed. PRs #6–#16 remain retained; PR #5 remains closed without merge and its branch intact. `HOLD_SELECTED_ATOMIC_ACTIVATION` remains. Authenticated selected Character/item/resource interactions and Save/restart acceptance remain separate named requirements. No retirement eligibility is inferred. Applicable guardrails: FP-002 (fixture/browser observations do not accept a parent) and FP-009 (source and publication heads remain distinct).
