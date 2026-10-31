# Queued Codex Route: Default Current Area and Codex Atlas Playable UI

Date: 2026-10-26
Status: `QUEUED_NOT_INSTALLED; USER_SELECTED_AREA_DIRECTION; IMPLEMENTATION_ROUTE_REVIEW_REQUIRED`
Source: `master` `a596112acf3945f2bf7c625e943f2511d12aa710` inspected before connector planning; **refresh before execution**. This queued file does **not** supersede `docs/dev/current-codex-prompt.md` or current active PR #20 / PR #22 prompts.
No auto-merge, release, Game `0.1.1-prealpha` change, old save migration, Site deployment or browser reset.
Use alongside [timing gate map](../design/deferred-and-outstanding-design-consumer-timing-map-2026-10-26.md), [Area detailed UI](../design/current-area-and-atlas-interaction-presentation-detailed-plan-2026-10-26.md), [Area/Atlas owner decision](../design/current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md), [deferred-system Area audit](../design/area-first-deferred-design-intent-pull-forward-and-dependency-audit-2026-10-26.md), [lore/name plan](../design/lore-grounded-naming-and-area-content-authoring-plan-2026-10-26.md), and [playable acceptance packet](../design/barebones-playable-ui-implementation-sequence-and-acceptance-packet-2026-10-26.md).

## Proposed command (copy/paste once chosen)

Implement the first **Lineage: Reforged default Current Area gameplay and Codex Atlas geography separation** slice in an isolated Codex branch.

### 1. Preflight and conflict management

Fetch/prune the actual latest `master`. Inspect `AGENTS.md`, current handoff, installed prompt and branch register. Review **live heads and contents** of draft PR #19 (clean-fresh-save equipment), #20 (native gear instance), #21 (founder/Dev design), #22 (Echo/Dev implementation), #23 (hardening) and #24 (Area/deferred planning). Do not assume any is merged, current, branch-compatible or test-accepted. Preserve the currently executing prompt/worktree and protected refs. Resolve the source base for **Area-only UI** explicitly; start a **separate isolated branch** from exact selected head. Do not alter historical `master` current prompt, merge PRs or import obsolete development saves.

Read the controlling six design documents linked above and the actual current sources:
`apps/rpg-ui/src/game-shell/InGameShell.tsx`, `src/components/SideNav.tsx`, `src/features/WorldPanel.tsx`, `src/features/CodexPanel.tsx`, `src/runtime/uiViewModel.ts`, `src/runtime/GameSessionContext.tsx`, `src/game-shell/gameplayLoop.ts`, `src/features/ActivityPanel.tsx`, `QuestsPanel.tsx`, and current location/Chronicle/Save types. Prove which legal travel, Explore, Approach, combat, Rest, survey, submit and current item actions still exist on the selected source.

### 2. Minimal scope: one gameplay surface, no duplicate Home

- Change campaign **initial/resume view** to Current Area. No separate Home page. When no domain item is selected, render Area with a clear canonical actual-current-location heading. Provide an obvious accessible Return to Area control or toggle-to-none mechanism. Preserve working Character, Inventory, Activity, Quests, Codex and Chronicle domain links.
- Remove former **World** submenu: World Map, Region, Settlement, Trade Routes, Travel, Local Market. **Do not** re-create those six categories as tabs under Atlas.
- Reuse the current World panel's real owner-backed Travel, Explore, Approach, active combat and action preview/result functionality; reorganize into Area rather than deleting handlers. Link to the actual existing Activity/Quests/Character commands when direct execution is not safely owned by Area.
- Implement a **pure, non-persisted typed Current Area projection** of current player place, coarse precision/breadcrumb, source-known environment, active situation priority, available/blocked legal action identities and short actual retained recent consequences. Use a current accepted campaign revision; re-derive after accepted mutation, Save/restart.
- Preserve `Codex → Atlas` and move **broad geographic reference** to it: known lands, regions, settlements, route/geographic details and any supported reference map. Preserve player-known/revealed visibility. Clicking Atlas detail must **not** move the player. Place current travel departure/confirmation in Area, using the real travel owner.
- Surface simple atmosphere/description from verifiable canon; use a tasteful text/neutral visual fallback until **explicitly approved** art exists. Do not treat current synthetic map pins as canonical current location geometry or generate interactive coordinates.

### 3. Six situation fixtures and strict non-inference

Prove: fresh Starfall/start; known tracked Soundings destination/travel; active four-shift survey; correct Starfall return/one-time 5g submission; nearby candidate/active encounter/Normal-Stakes recovery; neutral place without a legal mutation. Test a broad region-only player, Ashen reef anchorage compatibility key, unknown siteLabel, multiple place names and missing art. **Place/Atlas display must not imply** a canonical new settlement, currently raining weather, present live NPC, station, merchant, resource node, shop, POI, loot or permission. Source tier should distinguish ecologically plausible, player observed and actually interactable.

Active combat must take precedence over unguarded Travel/Rest/Explore. Never fabricate damage/HP/status, event chronology or generic quest payout. Session Chronicle is bounded, not infinite canonical event history. For first implementation, a `Recent` panel of actually retained evidence with a Chronicle link is enough. Exact recent-place association only when the source owns it.

### 4. Acceptance and no-scope-creep

Write failing tests for Area default/return, old World sidebar absence, actual canonical place identity, Atlas known-only selection versus travel mutation, source legal actions/blocked reasons, full Soundings 5g retry/restart, nearby legal combat and recovery, no fake local provider/resource/weather, accurate action preview, focus and mobile. Run focused UI/gameplay/quest/Save suites, Node UI typecheck, Vite build and clean-baseline broad TypeScript diagnostics; `git diff --check`. Verify an actual signed-in selected campaign on desktop and narrow screens when possible; distinguish fixtures from selected-client proof. No catastrophic full CSS rewrite or new world-owner data.

Preserve native gear/Save and Echo/Dev changes from their correct reviewed source if integrated, but **do not** opportunistically merge, mutate or reinstall those separate in-progress implementations. Do not unlock timed loadouts, creator family inheritance, dynamic weather, NPC dialog, services, commerce, broad resource gathering, Magic, combat balance or `DEV-0.7.2.13` merely to fill empty Area cards.

### 5. Delivery and handoff

Commit and push one coherent tested Area UI source slice on its own branch; update its focused decision, exact output, branch disposition, next prompt and handoff **on that branch only**. State precise head, tests, blocked source prerequisites, actual selected-client acceptance and gaps. Keep the current Game version, protected branches and hosted Site intact. No merge or deployment without named review.

**Main acceptance:** from normal campaign entry the player lands in an accurate named Area, sees legal current-surroundings actions and outcomes, travels through authoritative commands, finds wider geography in Codex Atlas, and resumes a coherent Area after Save/restart. No separate Home, six-item World submenu, invented local target or clickable synthetic map.

## Suggested subsequent separate bounded prompts (not installed)

- `AREA.RESULT-DISCLOSURE`: after explicit selection, consume parked `DEV-0.7.2.13` combat text-first source results and current Normal-Stakes recovery.
- `AREA.RESOURCE-INSTANCE-GATHER`: only after native bag/instance/Save and observed resource/attempt/depletion owners; see [first resource loop](../design/first-playable-resource-interaction-and-small-craft-loop-preimplementation-plan-2026-10-26.md).
- `AREA.CANON-ART-ONE-PLACE`: only after place dossier and lore editor approval, one illustrative 16:9 or overhead **non-authoritative** asset with accessibility fallback.
- `AREA.SERVICES-ONE-REAL-PROVIDER`: only when a canonical present person/station/provider and actual command owner exist, separate from basic Area.

This file is a **queued future route**, not an override of active Codex work and not proof of a runnable Area UI.
