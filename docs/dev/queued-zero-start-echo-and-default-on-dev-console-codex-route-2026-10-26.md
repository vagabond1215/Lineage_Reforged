# Queued Codex Route: Zero Starting Echo And Default-On Developer Console

Date: 2026-10-26
Status: `QUEUED_NOT_INSTALLED; OWNER_DIRECTION_RECORDED; SEPARATE_FROM_ACTIVE_GEAR_ROUTE`
Priority: Echo exploit correction first, compact Dev popup with real command registry second, time/spawn/weather functionality staged by valid owner prerequisites.
Game `0.1.1-prealpha`, parked combat `DEV-0.7.2.13`, no automatic merge/deployment.
Source snapshot: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`, gear owner draft PR #20 inspected separately.

## Copyable execution contract

Operate only in `vagabond1215/Lineage_Reforged` following `AGENTS.md`, current active Codex prompt, branch lifecycle, and failure patterns. Fetch/prune and synchronize source; inspect current PR #20 and current source again at execution time. Read `docs/design/zero-inherited-echo-dev-console-and-environment-spawn-test-contract-2026-10-26.md`, `docs/design/founder-backstory-lineage-skill-unlocks-and-dev-item-spawner-intent-2026-10-26.md`, and accepted progression, creator, UI topbar, shared time and world spawn authorities. Do not merge any draft PR or overwrite the active gear cutover without named integration review. Preserve unrelated work.

### Stage A: Repair initial/latent Echo at its true owner (highest priority)

Inspect `packages/engines/player-engine/src/progression.ts`, `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`, `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`, all actual Echo compute consumers and skill/stat development owners. Existing creation initializes progression Echo to zero but injects full starter ranks with `source: "trained"`; `calculatePlayerEcho` uses raw total skill ranks and deviations from global default attributes, ignoring whether those values were granted at creation. After recomputation, that can award Echo and level for uneared starting values.

Implement the smallest coherent **earned-source-only Echo authority** with a persisted origin baseline or authentic earned progression evidence, integrated with actual skill/stat gain events and current-format Save/restart. Founder, unlocked Hunter descendant, World-Stray special and other future backstories always begin with zero `skillContribution`, `statContribution`, `knowledgeContribution`, `echoBase`, `echoAdjusted`, `diversityCount` and Echo-derived level. Qualifying later earned growth adds Echo **only for that earned portion** and exactly once, retaining effective starter competence. Avoid blanket rank-25 subtraction, excluding all `trained` values forever, or creation-time zero resets that fail on next recompute. Do not allow creator origin packages, family inherited competence, trait/age offsets or dev-granted values to mint earned Echo.

Add focused red-before-green tests for start and post-gain under repeated recompute and current-format Save/restart; verify legitimate progression, combat rewards, trials, skills, abilities, Chronicle/run conclusions and dependent Echo thresholds. Make sound decisions about depreciation of earned progress versus irreversible earned-event evidence before patching.

### Stage B: Add a real visible default-on Dev button and extensible popup

Inspect `apps/rpg-ui/src/components/TopStatusBar.tsx`, `apps/rpg-ui/src/game-shell/InGameShell.tsx`, `GameSessionContext.tsx`, responsive styles and existing top-bar popovers. Add a compact text **`Dev`** button in the available right/top-bar space near Settings, and a collapsible/expandable Dev popup component using a simple typed command-group architecture: `Items`, `Time & Calendar`, `Weather & Climate`, `Spawns & Encounters`, `Diagnostics`.

**Owner direction: the button is visible/enabled by default across the current development and preview site**, until the owner manually approves a later policy change near actual playable release. Do not add a default-off environment feature flag, hide it from the preview, or make an opt-in user setting for this stage. The button itself does not authorize arbitrary mutation: all commands must require actual typed owner validation, QA provenance/isolation and accepted Save/caller state. No direct JSON/React mutation of equipment, weatherState, clock, activeEncounter, skills or progression.

Make popup keyboard and pointer accessible, with Escape, focus return, suitable overlay stacking, and no obstruction of existing calendar, resources, notifications, settings or mobile nav. Initial groups may have useful read-only data and clearly labeled `not yet available` states for absent owners; never present a control that claims to change weather if no weather runtime exists. Tests should verify opening, closing, mobile layout and truthful command states.

### Stage C: Supporting QA commands by real owner readiness

- **Time:** `Advance 1 watch`, `Advance N watches`, `Advance N days` only through full accepted shared-clock + body + resource + world/playtick/calendar publication pipeline, never raw clock mutation. An instantaneous `Set Date/Season` is separate and may be held pending world-state rebase semantics; do not equate it to elapsed time.
- **Items:** after live integration of PR #20 native item-instance owner and SaveSnapshot, use authoritative `grantGear`/fungible grant commands for canonical item choice, quantity, per-instance durability, valid bag/overflow/worn destination, idempotency, published readback and QA scenario isolation. Until then, provide read-only diagnostics or a truthful unavailable state.
- **Weather:** current `WorldState.weatherState: Record<string, unknown>`, fresh `weatherState: {}` and top bar `Weather unavailable` show there is no selected typed runtime owner. Begin with informative source status and a separate typed *development scenario override* contract when implemented; region, condition, intensity, duration/expiry, clear, derived display and future filtering must be real. Do not claim climate metadata changes actual weather.
- **Spawn:** current world spawn resolver filters region/habitat/hazard and seeds by tick but `SpawnProfileRecord` has no time, weather or season eligibility. First implement a read-only deterministic candidate/eligibility inspector using existing world spawn owners and actual region/context; explicitly mark unsupported time/weather filters. Later author data-driven daypart/season/weather eligibility with validation and positive/negative tests; only then bind `Set Spawn Context` and `Create Encounter` to authoritative world-to-combat admission. Never fabricate `activeEncounter` directly.
- **Initial character spawn:** separate creator start location, initial clock and ambient region condition from creature/encounter spawn. Future tester can set valid preview inputs and a new-character scenario fixture, without backdating existing campaign history.

Support dry-run/probe mode, safe repeat/stale rejection, condition provenance, current-format Save/restart and result/error readbacks. Debug-origin rewards and actions must not be confused with legitimate family backstory unlocks or earned Echo. Prefer isolated QA saves/accounts when meaningful.

### Stage D: separate future founder / World-Stray balance

No incidental new backstory/skill/World-Stray unlock implementation in these stages. Later creator/Bloodlines route implements low-boon founders and earned profession backstories for verified descendants. World-Stray/isekai stays a special locked option, unlocked via story/continuity evidence **not** skill-only grind, with a distinctive, bounded boon to be decided. All start at zero earned Echo.

## Reporting and limits

Work in an isolated Codex branch with real tests and exact SHA/readback. Compare clean baseline TS diagnostics (historically 115 UI broad diagnostics at inspected head). Run content lint where content changes, Node UI typecheck, focused suites, Vite build, `git diff --check`, source and browser checks when possible. Update focused design decision and exact output/handoff/branch register and future prompt **on the implementation branch**. No Site deployment, automatic master merge, save reset, Game version, content overhaul or protected combat work. Clearly distinguish implemented commands, read-only inspector behavior, unsupported weather/season conditions and selected-client acceptance holds. A partial but working Echo fix plus honest Dev shell is preferable to a large fake command console.

This is **queued supporting route documentation**, not the current installed `docs/dev/current-codex-prompt.md`. Do not start Stage B/C on top of PR #20's running Save cutover without separate source/integration review.
