# Queued Codex: Current Situation / World Context Source Prep

Date: 2026-10-26
Status: `QUEUED_PREPLANNING_ONLY; NOT_INSTALLED; NO_EXECUTION_AUTHORIZED_BY_THIS_FILE`
Current inspected `master`: `a596112acf3945f2bf7c625e943f2511d12aa710`; Game `0.1.1-prealpha`.
Source packets: [cross-domain gap audit](../design/barebones-playable-ui-cross-domain-gap-and-pull-forward-audit-2026-10-26.md), [implementation and selected-client acceptance sequence](../design/barebones-playable-ui-implementation-sequence-and-acceptance-packet-2026-10-26.md).
This is the **next UI prework candidate**, not a replacement for current PR #20/#22 implementation, PR #23 hardening, or parked `DEV-0.7.2.13`.

## Proposed copy/paste source-prep task (later when selected)

Read the latest `AGENTS.md`, `docs/dev/current-gpt-handoff.md`, current branch disposition, exact PR #19–#23 changes, `docs/design/ui-information-architecture-boundary.md`, `docs/design/local-scene-context-projection-decision.md`, `docs/design/contextual-player-action-and-command-architecture-decision.md`, `docs/design/contextual-player-affordance-and-owner-matrices.md`, and both connected playable-UI planning packets.

From a clean synchronized source checkout, inspect:
- `apps/rpg-ui/src/game-shell/InGameShell.tsx`, `components/SideNav.tsx`, `components/layout/AppLayout.tsx`, `components/TopStatusBar.tsx`, `runtime/uiViewModel.ts` and `runtime/GameSessionContext.tsx`;
- `features/WorldPanel.tsx`, `ActivityPanel.tsx`, `QuestsPanel.tsx`, `CharacterPanel.tsx`, plus real combat/legal-action and Soundings commands;
- current-format `SaveSnapshot`, campaign admission, locale/context known-location and current activity/encounter owner facts.

Prepare **one source-verified pure read-only Current Situation / local-scene projection** over real existing facts and legal actions, with an explicit mapping table from every Home link/shortcut to the existing owner function and panel entry. It must never mint new `activity`, `npc`, `site`, `resource`, `quest` or `action` identity, and must never persist a second scene/action state. One canonical source of current campaign head/tick/revision controls freshness; resolve after each admitted transition and restart.

Propose at most six representative situations:
1. Fresh newly created character with accepted location, current health and actual Soundings offer;
2. Accepted tracked contract, known Travel to Ashen;
3. Active Soundings with legal next shift and actual energy cost;
4. Completed survey back at Starfall with accepted one-time Submit and receipt;
5. Nearby candidate / active encounter with legal owner actions, possible Normal-Stakes recovery;
6. No immediate quest/encounter: honest rest/explore/inspect or only navigation, not invented activity.

Each situation must expose owner-backed **primary action**, 2–3 secondary legal actions (if any), source cost/reason/disclosure, correct link to World/Quests/Activity/Character, and a truthful empty state. Include compact portrait/status/topbar and meaningful Chronicle consequence sources, preserving desktop/mobile constraints. Distinguish what the player **knows** from hidden world facts; an ecology hint is not a resource instance and a settlement record is not a present NPC.

Use existing data flow to prevent double command execution. Initially prefer **navigate-to-existing-panel** over executing commands from Home; direct actions require a separately accepted command adapter, stale/revision validation and exact mutation receipts.

If a future user/route authorizes limited UI implementation, the **smallest reversible first slice** is one Current Situation view consuming a pure resolver and existing navigation. It must not alter combat, Save schema, inventory, quest payment, clock, weather, legal action ownership or the source layout's fundamental shell. Keep separate active Dev popup and gear branches intact.

**Tests and acceptance plan:** pure projection fixtures from actual new-campaign, active survey, returned submission, encounter and neutral states; hide secrets; no phantom effects; rederive after Save/restart; ordinary user click routes to the same existing owner entry; keyboard and narrow viewport; actual selected-client desktop/narrow test; source-level clean baseline typecheck/Vite and diagnostic comparison. Report a precise blocked source/required owner where a truthful action cannot yet be projected. Do not manufacture readiness from static catalogs, an imagined UI prototype, or a partial demo.

Preserve all active draft PRs #5–#23 and any later heads, `master`, protected branches, parked `DEV-0.7.2.13`, Game `0.1.1-prealpha`, and the deployed Site. No forced Game-version acceptance, automatic merge, cleanup/reset, or retrograde old-save importer. Commit documentation-only source prep on a separate branch and await an explicit UI implementation route rather than changing the active installed Codex prompt.

**Prework deliverables:** (1) exact source-to-projection ownership table; (2) six-state wireframe/action matrix; (3) minimal typed pure projection contract; (4) existing test/selected-client acceptance mapping; (5) one self-contained UI implementation route with blockers/merge order. Do not produce endless duplicate planners after those five artifacts are complete.
