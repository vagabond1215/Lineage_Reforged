# Current Area integration source evidence and first resource shortlist

Date: 2026-10-26
Status: `CONNECTOR_READ_ONLY_EVIDENCE; REVIEW_HELD; NO_IMPLEMENTATION_OR_CANON_APPROVAL`
Inspected default `master`: `a596112acf3945f2bf7c625e943f2511d12aa710`.
Scope: a narrowly bounded follow-on evidence packet to draft PR #24, NOT a replacement for its 30-family timing map, Area/Atlas design, or queued Codex prompts.
No existing PR, current Codex prompt/handoff/output, source, tests, schema, content, save, deployed Site, protected branch or Game version is changed by this packet.

## 1. PR and merge preflight: actual branches, not numbered merge order

Repository snapshot: 20 open draft PRs #5–#24, 27 named branches at inspection. All #19–#24 compared `ahead` against unchanged master, base/merge base `a596112a`. Their GitHub mergeability against *master alone* is not a cross-branch compatibility result.

| Branches/PRs | Verified overlap / dependency | Disposition |
| --- | --- | --- |
| #19 (clean Save decision) + #20 (native gear owner) | 3 files: `docs/dev/branch-disposition-register.md`, `current-codex-prompt.md`, `current-gpt-handoff.md`. #20's new `gear-instance-owner.ts` is not imported by live gameplay. | **HOLD_INTEGRATION**. Preserve #19 no-obsolete-development-save compatibility direction while retaining #20's new-format instance conservation and test evidence. Do not activate before caller/Save/combat/character/UI fit coverage. |
| #20 (gear) + #22 (Echo/Dev) | 4 files: branch register, current prompt, output, handoff; no shared runtime source among those two PR diffs. | **MANUAL_HANDOFF_RECONCILE**. Do not accept whichever task prompt wins a textual merge. |
| #22 (Echo/Dev) + #16 (compact top bar) | **6 files**, including `apps/rpg-ui/src/components/TopStatusBar.tsx`, `apps/rpg-ui/src/game-shell/InGameShell.tsx`, `apps/rpg-ui/tests/top-status-bar-render.test.mjs`, plus branch register/output/handoff. | **SOURCE_COMPOSITION_REQUIRED**. Topbar layout, default-visible Dev affordance, Settings overlay mutual exclusion, narrow viewport and focus/keyboard need one tested result. |
| #19 + #24 | 5 overlapping documentation paths: current planning anchor, deferred authority, future ledger, open questions, branch register. | **MANUAL_DOC_RECONCILE**, keep fresh-format/no old-save recovery distinction. |
| #21 (founder) + #24 | 5 overlapping documentation paths: planning anchor, future ledger, open questions, UI IA, branch register. | **MANUAL_DOC_RECONCILE**, leave lineage evidence and Dev grants non-live. |
| #17 (deferred attributes/quality) + #24 | 4 shared docs; #17 compares 8 ahead/11 behind master, mergeability false at inspection. | **REBASE/CHERRY-PICK REVIEW**, do not force merge or drop older accepted source. |
| #5 (earlier UI design) + #24 | 4 common docs: future ledger, UI IA, sequenced plan, roadmap. | **MANUAL_DOC_RECONCILE**, #24's Area default supersedes the old World submenu, while historical UI context remains. |
| #18 (gear audit) + #19/#20/#24 | Branch register overlap; the legacy migration/recovery portions in #18 are superseded by #19. | **SOURCE_EVIDENCE_ONLY**, selectively reuse nonlegacy tests, do not reintroduce obsolete-save importer. |
| #7 → #11 → #14 | #11 is stacked on Character #7; #14 on Inventory UX #11. Distinct Character presentation/row identity layers. | **PRESERVE_STACK** and cross-test with true owner repairs. |
| #10 → #12 → #13 | #12 stacked on equipment eligibility #10; #13 on stale consume #12. Exact bag mutation remains paired with presentation safety #14. | **PRESERVE_STACK**, selected Equip/Use/Save/restart evidence still held. |
| #9 → #15, #8 → #16 | Mobile shell/landscape rail and topbar compact layout are stacked UI routes. | **PRESERVE_STACK**; compose #16 with #22 before making Dev/Settings acceptance claims. |

Other draft PRs may share `docs/dev/branch-disposition-register.md`; preserve all independent review and acceptance records with deliberate integration. Do not use a single global "latest handoff" or direct fast-forward of those files as evidence. Before any merge, refresh SHAs, inspect diff hunks (overlap is not necessarily a conflicting edit), create a disposable *review* composition, run tests, and secure selected-client evidence. No such merge or build was executed by this connector audit.

## 2. Current Area source-to-action adapter matrix

Source baseline is current `master`, not draft #24 runtime. In `apps/rpg-ui/src/game-shell/InGameShell.tsx`, the default `activeTab` is `'character'` and toggling a selected tab to `null` currently renders a blank panel. Thus implementing default Area needs both initial navigation and the null/default branch. `WorldPanel.tsx` begins on `world-map`, uses six `SidebarMenu` sections, places illustrative map pins at `worldData.locations[x,y]` CSS percentages, and exposes real travel/nearby/combat actions *among* informational UI. Do not treat CSS map positions or compatibility `KnownLocationState.x/y` as authoritative local geometry. `CodexPanel.tsx` already has an `atlas` section fed by geographic knowledge; expand it as reference-only.

| Current operation | Concrete current caller and authority | Area presentation / safe first pass | Legality, effects and next consumer |
| --- | --- | --- | --- |
| Actual current title | `gameplayLoop.getCurrentLocationLabel/getKnownLocationId`; location facts in `packages/engines/game-engine/src/player-travel-rules.ts`; snapshot | Dynamic heading and truthfully coarse breadcrumb | `siteLabel` is not a canonical room/site; never derive exact scene from Atlas selection. |
| Travel | `WorldPanel` → `gameplayLoop.previewTravelToKnownLocation/travelToKnownLocation` → `player-travel`, `player-travel-rules`; accepted snapshot through `GameSessionContext.updateSnapshot` | Area destination picker, preview and real confirmation; Atlas can link back to Area | Known location and current accepted revision, body/time costs and risk; no map-click teleport. |
| Nearby explore | `WorldPanel` → `resolveNearbyExplorationPlan`, `useGameSession().exploreNearby()` → nearby exploration caller | Visible available/blocked action and real result | One watch, authored access, 2 Stamina as current World copy states; do not promise encounter. |
| Approach | Current nearby candidate → `admitNearbyEncounter()` in `GameSessionContext` | Primary action only when candidate exists and admission permits | Do not create encounter from an atmosphere illustration. |
| Combat/continue | `listLegalPlayerCombatCommands(activeEncounter)`, `advanceNearbyEncounter(actionType,targetId)` | Active-encounter mode with legal target/cost, continue and accepted results | No self-authored attack/target, enemy hidden numbers, or freely enabled travel/rest in combat. |
| Quest accept/track | `QuestsPanel` → `gameplayLoop.acceptQuest/toggleTrackedQuest`, quest planning owners | Contextual Quests shortcut or reviewed direct delegate | Preserve actual offer/track eligibility and source result. |
| Exact Soundings submit | `QuestsPanel` → `resolvePlayerSoundingsTurnIn`, `submitSoundingsTurnIn(requestId)` via `GameSessionContext` | At return site, show ready/blocked and route to existing owner, optionally direct only after one safe adapter | Exactly one accepted 5-gold payment/receipt, no generic reward source or second submission. |
| Survey shift | `ActivityPanel` → `resolvePlayerSurveyActivityAdvancementPlan`, `advanceAshenReefSurvey(requestId)` | Active-activity mode with genuine stage/status and Activity route | Four authored stages; preserve request identity, preview, one accepted step/revision. |
| Rest / ordinary shift | `ActivityPanel` → `previewRestAtCurrentSettlement/restAtCurrentSettlement`, `previewAdvanceCurrentActivity/advanceCurrentActivity` | Area shortcut with truthful projected time/body effect; direct only through existing owner | Avoid a raw Advance Watch clock mutation and any bypass of body/admission checks. |
| Equipment/use | `CharacterPanel`, `characterPanelState` and legacy inventory; prospective #20 owner | Shortcut to selected Character/Inventory; no invented item action on Area G1 | Native gear instances and new-format Save/combat ownership must be connected first. |
| Recent | Snapshot/Chronicle accepted entries in `uiViewModel`; limited retained history | 3–6 genuine source-result snippets if present, otherwise calm absence | Do not invent per-place chronology or event timestamps absent source. |
| Codex geography | `CodexPanel` `atlas` based on `viewModel.character.lists.geographicKnowledge` | Reference place browser and optional known-destination deep link | Viewing a place never mutates presence, position, discovery, access or quest state. |
| Local markets/people | Present World/Activity static reference cards; no selected merchant/provider mutation | No Shop/Talk buttons without source-backed currently present service/person | Keep for G4+ with canonical provider, authorization and transaction receipts. |

**First safe Area UI implementation boundary (G1):** pure source-provenance view projection, actual-title routing, legal/blocked route descriptors, null/default navigation, restrained environmental fallback and Atlas isolation. Route to existing panels when a direct adapter would duplicate mutation. Test stale head, unknown place, active encounter, selected Atlas location, return-to-area and Save/restart rendering. Do not move action ownership into React.

## 3. Lore and locality evidence pilot: approved facts versus attractive inventions

| Place | Verified sources and allowable scene information | Disallowed without new authored/observed source |
| --- | --- | --- |
| **Starfall Port**, `settlement.starfall_port`, `region.starfall_isle` | `regions.json` calls Starfall Isle the customs island of the Myridian Chain, with relay harbors, warehouses/ferry slips and northern deepwater port. `region_localities.json` has `region_locality.myridian_ports`, archipelago port geography, trade/shipbuilding/customs, strong *regional fishery catchment*. `ashen-reef-soundings-authored-canon-decision.md` accepts the Harbormaster's Office and one civic hydrographic commission. | A named duty officer, observed market seller, exact quay building, currently stormy weather, visible fish stock, new institution ID or shop interaction. |
| **Ashen Reef**, `location.ashen_reef` | `ashen-reef-survey-travel-access.ts` describes a known survey anchorage/reef approach under Starfall Isle (runtime location type `ruin`). Accepted Soundings narrative identifies working passages, breakers, depth reports, sector I Inshore Approach, II Working Reef, III Outer Passage, IV Ruin Markers; post-storm uncertainty motivates the chart. | A separate reef city, present storm, protected marine reserve, automatic Stormglass Bloom harvest, mapped precise hazard positions, a new salvage reward, new NPC. |
| **Stonevein**, `settlement.stonevein` / compatibility destination `location.westreach` | `player-travel-rules.ts` labels Stonevein and `Market Ward` arrival in `region.auric_marches`; `regions.json` describes the Auric Marches as dry mineral-bearing uplands and plains. `region_localities.json` contains regional Ore Ridge Uplands and Caravan Marches, but exact Stonevein sublocality must be proved. | Claiming the character is inside a particular mine, a presently trading broker, local ore source or owner-authored Market Ward site geometry. |
| **Sunspire Reach**, `settlement.sunspire_reach` / `location.crown_bastion` | `player-travel-rules.ts` labels Sunspire Reach and `Gate Muster` arrival in `region.silver_valleys`; `regions.json` defines interior river valleys and denser contested agriculture. | Assigning a specific ford, garrison officer, passable field, crop yield, route closure or enterable site without a true exact-place/observation owner. |

Provisional *conditional* copy, **not production canon**:
- Starfall with an actually offered Soundings quest: "Starfall's harbor approaches carry trade and ferry traffic. The Harbormaster's Office is seeking fresh soundings of Ashen Reef before the older chart is trusted again."
- Ashen while the player's survey activity is live: "The survey anchorage gives access to the reef's working approaches. Your chart packet still requires the stages shown in the active survey record."
- Stonevein at coarse arrival precision: "Stonevein, in the Auric Marches. The current arrival is labeled Market Ward; finer local surroundings have not yet been established."

These descriptions must be *conditioned on actual player position, quest status and observer visibility*. The environmental statement cannot imply resources or NPCs currently visible. No new proper names are proposed: existing canon supplies the immediate scene labels. Preserve full lore-proof dossiers and editorial gates in PR #24's `lore-grounded-naming-and-area-content-authoring-plan-2026-10-26.md`.

## 4. Real item / resource / recipe audit

At inspected `master`:
- `packages/content/base/items/items.json` has **1,372** static item records, including `item.fiber` (raw botanical material), `item.river_reed` (raw textile), `item.marsh_fiber` (raw textile), `item.bark`, `item.fish_raw`, `item.iron_ore`, `item.grain_bundle`.
- `packages/content/base/world/resources.json` has **two** static **planned** resource identity records: `resource.iron_ore` and `resource.grain`, expressly no resource stock, nodes or extraction runtime.
- `packages/content/base/crafting/recipes.json` has **28** static **planned** recipes. All 28 carry a nonempty `requiredWorkplaceIds` set. `recipe.fiber_to_cloth` needs `workplace.loomhouse` and weaving rank 1; `recipe.fish_raw_and_salt_crystal_to_smoked_fish` needs `workplace.smokehouse`, `smoking_rack` and cooking rank 1. Neither is a ready hand-crafting command.
- Regional resource catchments are ecology/economy potential, not an observed, owned, depletable quantity at current player location. A real source-instance and actor/action owner is still missing. This is consistent with PR #24's G3 plan.

| Candidate | Item/content closure | Local-context / method gap | Decision |
| --- | --- | --- | --- |
| **A: bounded botanical fiber** → `item.fiber` | Valid existing fungible item, no need to invent a recipe. `item.bark` is another catalog material but requires separate source method. | No verified current scene/source ID, accepted observation, permitted method, ownership/access, quantity/depletion or extraction result; Starfall port label does not supply these. | **CONDITIONAL G3 FAVORITE** only after one authored accessible observed source fixture and true owner. Gather → item, no cloth crafting yet. |
| **B: bounded waterside reed** → `item.river_reed` or `item.marsh_fiber` | Both exact valid raw item keys. The Silver Valleys contain regional river valleys/ford corridors. | Must identify a specific actual playable river/marsh approach with habitat fit, legal access, observation and a harvest method. Cannot put freshwater reeds at Ashen Reef based on marine proximity. | **CONDITIONAL G3 ALTERNATE**; potentially good contrasting inland scene, not ready to execute. |
| **C: fish** → `item.fish_raw` | Starfall regional fishery context and item identity exist; later smokehouse recipe is statically defined. | Fishing needs specific stock/water ownership, gear/method, catch result, capacity and likely extra risk/context; smokehouse is not a live provider. | **HOLD** for first loop: too much new owner and workplace breadth. |
| **D: ore** → `item.iron_ore` | Only material with matching static `resource.iron_ore`; Auric region has ore ridges. | Planned resource is not a node; no verified accessible mine/permission/tool/resource-stock owner; bloomery recipe also requires forge, hammer and rank. | **HOLD** until an actual mining site/service and conservation rules are authored. |

**Admission recommendation:** first implement the source/action/output contract, but *do not select a canonical locality or resource fixture on ecological plausibility alone*. Exactly one of A or B can be a G3 implementation candidate after the place/source/access and inventory Save prerequisites are authenticated. No present candidate is already an actionable live gather loop.

Minimum expected G3 fixture: accepted current place and observed source ID → owner-approved method and quantity → one idempotent attempt → exact source decrement and fungible inventory increment (or explicit truthful overflow) → body/time/Chronicle result exactly once → Save/restart same source, bag quantity and history. Stale, wrong-place, no capacity, duplicate request, missing tool, active combat and debug-granted evidence are negative tests. Do not confer legitimate Echo/lineage evidence from dev fixtures.

## 5. Art and interface acceptance boundary

`packages/content/base/world/map_assets/` presently contains `First World Biome.png` and `First World Elevation.png`. They are **world-scale** reference rasters, not validated Starfall/Ashen local-area maps or clickable geometry. `WorldPanel.tsx` current CSS-percent markers are visual UI placeholders. G1 may use a compact textual/neutral visual fallback. A later illustrative image must carry exact source brief, alt text, non-authoritative asset flag and selected approval. Atlas may use grounded macro world assets, but never derive precise route/POI positions from them.

Acceptance packet to hand to the *next selected* Codex run (not executed here):
1. Fresh campaign: default Area has actual coarse place, no blank null selection or forced Character tab; relevant legal/blocked actions and no invented NPC/merchant/harvest.
2. Soundings: accept, travel, four distinct shifts, return and **one 5-gold submit**, then Save/restart with identical state, selected Area title and actual recent receipts.
3. Nearby: no-candidate state, Explore, observed candidate → Approach → real legal combat commands; correct paused/defeat/result behavior, not fabricated enemy details.
4. Gear/Save: same-type different-instance equipment durability and one physical location, exact bag target/consumption, worn contribution and fresh-format Save/restart; no obsolete developer-save migration.
5. Echo/Dev: origin baseline excludes starter gains; no QA-earned family evidence; Dev default-on; topbar/Settings two-way exclusion; item/time/weather commands remain disabled until authoritative owners are proven.
6. Atlas and narrow UI: reference-only selection, true known/unknown geography, tab-toggle default Area, no invented map geometry, keyboard/focus/escape, 375px and landscape workspace, image-absent primary action visibility.

## 6. Recommended next gates and proof labels

- **Ready now for connector-safe review:** this PR overlap/source matrix, two candidate resource shapes, canonical Starfall/Ashen contrasts, and asset inventory. These are evidence, not runnable gameplay.
- **G0 integration first:** compose #16/#22 topbar source; reconcile #19/#20/#22 prompt writes; preserve #7→#11→#14 and #10→#12→#13 stacks; adopt fresh-format Save decision without weakening new-format durability, survey and restart. Review #17's diverged docs separately.
- **G1 UI after explicit branch selection:** one pure Current Area view/resolver and shell default, no mutation owner rewrite. Use PR #24's queued exact-source prompt, not this document as another installed prompt.
- **G2 authenticated playable acceptance:** selected UI actions, rewards, combat, equipment and Save/restart. Existing fixture tests and reports are not a substitute.
- **G3 one new material loop:** only after one genuinely observed and permissioned local source, an exact output item, action receipt/atomicity and integrated inventory Save owner.
- **G4+** first actual service/NPC/descendant/weather/crafting consumer as source evidence warrants.

Evidence method: GitHub connector PR metadata, per-PR changed-file lists, comparisons to master, readback of named source files and parsed static JSON. No checkout, test run, authenticated browser, build, gameplay interaction, Save migration, environment mutation, schema/content approval, PR merging or deployment was performed. Future recheck at exact PR heads required.


## 7. Late-arriving implementation: draft PR #25 (discovered after the initial census)

**Repository changed during this audit.** The initial 20-open-PR / 27-branch count above is a **point-in-time** count *before* PR #25 and this evidence PR #26 were opened, not the current total. At PR #26 creation the open draft count reached 22, with new head branches `codex/echo-dev-hardening` and `connector/area-integration-source-evidence-2026-10-26`. Do not treat an earlier census as a standing merge queue.

PR **#25, Echo earned-growth integrity and Dev console hardening** (`codex/echo-dev-hardening`, head inspected `4ce26ee1b4c3bbb5e2bbd4d77289aca3a79aa2f0`), is **stacked on PR #22**, not based on `master`. Compare against #22's `8ea456e0` head showed 3 ahead, 0 behind and **29 files changed relative to #22**. Its checkpoint `docs/design/echo-integrity-and-dev-console-hardening-checkpoint-2026-10-26.md` states:
- Fresh creation requires character-bound origin and earned-growth evidence; only accepted advancement callers credit positive growth; no starter Echo, direct QA/script rank edit Echo or rank-loss/retraining replay.
- Dev remains visible; Dev, Settings, Calendar, Conditions and Notifications mutually dismiss, with controlled keyboard/focus/outside-pointer checks. Spawn inspection gains more template/monster rejection and selection parity.
- Generic idle Advance Watch, Dev item grants and weather overrides **remain unavailable**, with real owner, QA and Save requirements still open.
- Reported focused tests: 200 pass/1 pre-existing quest assertion failure also on clean master; UI 42/42; Node typecheck and Vite build pass; broad TS 115/115 existing diagnostics. **Authenticated selected-client/mobile and hosted restart not proved.**

Recomputed changed-path overlaps for PR #25:
- **#25 vs #16: 5 shared files**, including source `TopStatusBar.tsx` and `InGameShell.tsx`. Previous #22/#16 conflict remains and must now compose with the **#22→#25 stack**, not just #22.
- **#25 vs #20: 4 shared docs**, the branch register, current Codex prompt/output/handoff. Do not drop current gear or Echo task history.
- **#25 vs #19: 3 shared docs**, the branch register, current prompt and handoff. Keep accepted fresh-format compatibility boundary.
- **#25 vs #24: branch-disposition-register only**; Area planning still has no runtime implementation collision with #25 yet.

**Updated G0 recommendation:** independent acceptance should now treat Echo/Dev as the exact #22→#25 stacked source, with #23 as prior source-audit guidance, and compose #16 topbar and #19/#20 gear/Save decisions intentionally. This does not merge #22 or #25, install its queued prompt, authorize Dev mutation, or close selected-client proof.
