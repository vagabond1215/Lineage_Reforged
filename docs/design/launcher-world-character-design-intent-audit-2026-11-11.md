# Launcher, World, Character, and First-World Start: Design-Intent Disposition Audit

Date: 2026-11-11  
Scope: source-checked design intents related to account entry, world selection/creation, character selection/creator, Save/load and actual local start generation.  
Status: **documentation audit and targeted supersession record only**.  
Controlling consolidated plan: [Welcome, World Library, Character Entry and World Loading](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md).  
Owner-decision ledger: [Issue #74](https://github.com/vagabond1215/Lineage_Reforged/issues/74).

## 1. Audit approach and precedence

Reviewed relevant current repository design docs and real launcher/world/Save implementation files on default `master`. A document's prior acceptance as an *authority boundary* is not overturned merely because a newer UX plan exists. Prefer most recent explicit **owner product direction** for UX and product options, current specific **technical owner contract** for Save/clock/estate/scene rules, and **actual source** for implemented capabilities. Historical plans remain useful evidence, but are not active implementation prompts. The current execution gate is [current Codex prompt](../dev/current-codex-prompt.md), separate from this work.

**Terms used:**
- **ADOPT:** valid current direction applicable without changing its technical owner.
- **ADAPT:** valuable intent, but its place/wording must change for the new navigation.
- **SUPERSEDED-IN-PART:** retain historical file but explicitly stop using named older product behaviors.
- **HISTORICAL:** informative source or already-consumed implementation decision, not today's task.
- **DEFER:** potentially valuable feature, but not eligible for near-term launch.
- **OPEN CONTRACT GAP:** no accepted current owner/schema/working runtime capability; do not present as implemented.

## 2. Source-document disposition matrix

| Source | Disposition | Useful concept to carry | Stale/overridden/deferred aspect and action |
| --- | --- | --- | --- |
| `unified-shell-and-creator-refinement-plan.md` | **SUPERSEDED-IN-PART** | Shared launcher/creator visual grammar, sidebar discoverability, source-labeled nine-stat preview, accessibility, backstory eligibility awareness | Its separate Review page with Begin Journey/overwrite/heir choice, Starting Bundle page/summary, and non-submitting, repeatedly rerollable `Full Randomize` are **not** the selected product behavior. Later plan has no Review, founder/heir context first, World Entry and atomic Surprise Me. Add prominent supersession header to old file. |
| `ui-information-architecture-boundary.md` | **ADOPT** (domain scope) | Reusable hierarchy, clarity, accessible controls, no fake gameplay commands, concise Home and context | Its in-game **Home/re-entry surface** is not the pre-auth **Welcome splash** or the World Library. Do not force gameplay six-domain layout onto login. No intrusive change to its game-shell rules; cross-reference it from new plan. |
| `user-design-decisions-2026-06-17.md` | **ADAPT / HISTORICAL** | Initial single-player/Individual World assumption, context-grounded relationships and future broader multi-character progression | `At first start, each character should have a separate world` predates the new **World Library** and actual world-ID idea. Interpret present launch as character-dedicated Individual World, while still listing/selecting world instances independently from Saves. Future shared Living World is later; do not mechanically add world per Save slot. Add a narrow note at top, preserve older text for provenance. |
| `open-design-questions-index.md` | **ADAPT / HISTORICAL SECTIONS** | Deferred-trigger discipline, no arbitrary new authority, exact owner questions | Its 2026-11-09 override is older than this UX/world-entry direction; old `Current Pipeline Context` still names Soundings, while active Codex prompt is different. Add current dated redirect; preserve historical counts and question rows rather than recalculating without full rebaseline. |
| `core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md` | **ADOPT with newer scoped priorities** | Backstory != present arrival; Standard civilization-adjacent and Hardcore genuine wilderness; real intro actions; world-owned clock, no fake heirs; owned items | Later owner selected one authored First World first, login/world library before character slots, and deferred world variants/time skips. These refine *priority*, not the document's eventual clock invariant or Hardcore permanence. |
| `core-world-entry-scenario-contract-and-editorial-seed-2026-11-09.md` | **ADOPT AS DRAFT ONLY** | Eight scenario IDs, authored narratives and typed compatibility concepts | Not live scenario registration or actual Starfall NPC/room/shipwreck. Four fully written editorials and four outline candidates still need real site/action owner; never call these eight playable. |
| `core-world-entry-environmental-feasibility-and-authoring-gap-review-2026-11-09.md` | **ADOPT** | Exact environmental facts, safe checks and missing real local instance ownership | An environment description is not a walkable local scene or resource. Keep its hard blocker. |
| `core-world-entry-exact-geography-anchor-candidate-inventory-2026-11-09.md` | **ADOPT** | Existing First World geographic links, Starfall Port source-backed pilot, no false rooms/wilderness instances | Starfall is a **candidate** start area, not a certified local grid. Static place links alone do not create interactables. |
| `world-geography-authority-boundary-decision.md` | **ADOPT** | Canonical places independent of pixel/map representation; distinct route, biome, ecology, polity and site owners | Do not turn visual height/biome pixels into editable player terrain or a source of instantly spawned actors. |
| `map-grid-distance-source-map.md` | **ADOPT AS MAP-SCALE INPUT** | Existing region/locality/hex/edge/travel assumptions and validation hooks | No authority for an invented new `12×8` real local grid, runtime collision map or changing existing hex scale. |
| `local-scene-context-projection-decision.md` | **ADOPT** | Observed local actions read from real owners; no generic command executor; observable vs rumored and valid reference semantics | Current `PlayerLocationState` is coarse and cannot support exact room, shop, camp or road-edge spawn without another authority. |
| `contextual-interaction-endpoints-and-contract-station-routing-decision.md` | **ADOPT** | Actual reachable crafter/clerk/station/contract endpoint; same owner command for shortcuts | Guild description/workplace label does not instantiate an NPC or economic action. Defer unowned services. |
| `difficulty-presets-grim-world-rules-and-stakes-separation-decision.md` | **ADOPT** | Three separate axes: difficulty, world rules, Stakes; thematic Hardcore composition needs deliberate rule/UX mapping | `Standard Core` opening should not be confused with `Mortal` difficulty, `Heroic World`, or unrestricted Save. No automatic Hardcore activation in source. |
| `offspring-heir-family-continuity-owner-plan.md` | **ADOPT** | Real offspring/heir identity, life-stage readiness and heir-slot capacity/parentage; no synthetic heirs | Bloodlines in World Overview is an eligible-source selector, not an heir generator or Review-page substitute. |
| `stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md` | **ADOPT TECHNICAL AUTHORITY** | Distinct account/campaign/continuity/character/artifact/checkpoint/head identities, failure and rollback semantics | Does not supply a new world registry nor imply a campaign Saved state can be a shared world head. |
| `clean-epoch-async-caller-ownership-and-activation-package-decision.md` | **HISTORICAL IMPLEMENTATION ROADMAP** | Async account/slot exact readback and no fallback, receipt/consumer recovery, stable attempt identity | Its G5/G6 era chronology and assertions about what App imports were absent are not current native-v3 runtime observations. Use current source and current Codex prompt, not this as active handoff. |
| `normal-campaign-new-game-retry-and-recovery-collision-audit.md` | **HISTORICAL NEGATIVE TEST INPUT** | Retry must reuse original attempt, occupied-slot recovery must not rewrite newer campaign | Earlier defects/tests don't prove today's code still has those defects; retain as regression requirement. |
| `functional-regional-playthrough-skeleton-priority-and-roadmap-2026-11-09.md` | **ADAPT / SPECIFIC OVERRIDE** | Prefer a small actually playable geographically grounded loop rather than broad content | Historical `optional/skippable` Core intro is explicitly superseded by newer mandatory-for-eligible-Core direction; prioritize local Starfall reproducibility. |
| `first-world-map-feature-content-seed-plan.md` / `world-map-feature-schema-decision.md` | **ADOPT BOUNDARY ONLY** | Authoritative named features and map/visual cross-references | Do not infer local physical objects or a world generator from descriptive planned schemas. |
| `pilot-region-selection-criteria-plan.md` | **HISTORICAL / ADAPT** | Small bounded pilot criteria and no planet-scale rollout | It targets settlement population-center *expansion*, not the first playable local scene; Starfall area pilot should not add cities to satisfy old settlement-count targets. |
| `survival-builder-rpg-mmo-content-gap-audit.md` / `crafting-authority-boundary-decision.md` | **ADOPT GAP LIMIT** | Future craft/service/station/gameplay requirements | Not evidence that active local craft vendors, player recipe consumption or building ownership are implemented. |
| `current-planning-anchor-reconciliation.md` | **HISTORICAL CHRONICLE** | Prior accepted implementation evidence and owner boundaries | Its earlier-next-task headers are not an executable plan; current Codex prompt controls. |

## 3. Real code check: present vs target

| Component/owner observed | Present | Target work |
| --- | --- | --- |
| `LocalAccountAccessScreen.tsx` | Local account picker/create/sign-in with password and stay-signed-in | Embed in high-contrast branded Welcome panel; return signed-in Welcome instead of direct slots |
| `cleanEpochAccountAdapter.ts`, `cleanEpochLauncherRead.ts` | Native epoch account/session validation and account-scoped slot inventory/read | Reuse unchanged auth; add world list/select transaction through a **new valid owner**, no duplicate password store |
| `MainMenuScreen.tsx` | Account meta, Continue, directly displayed character slots | Split into signed-in Welcome, World Library/Overview and nested Character Library; retain useful account panels where correctly scoped |
| `state.ts`, `EpochApp.tsx` | Account/Main Menu/Creator/Load/Settings/In-game routing | New dedicated welcome/world setup/world overview/character library states, guarded selection and loading |
| `characterCreationForm.ts` and related UI | Old eight-step flow with separate location, Backstory, Starting Bundle and final Review, limited randomization | Four-tab accepted creator with founder/heir launch context, trait/stat owner, Backstory + World Entry selection and atomic Start Journey / Surprise Me |
| `cleanEpochFirstCampaignAdapter.ts` and descendant owner | Native prepared first publication and retained recovery semantics | Add verified world and area association *after* new registry and schema/migration contract; never weaken idempotency |
| `cleanEpochAccountStore.ts` | Account/campaign/slot/artifact persistence, versioned IndexedDB epoch | Add real world registry/head only through scoped owner design and versioned migration; do not fake world IDs in slot labels |
| `world_maps.json`, settlements, hexes, regions, routes, ecology | Fixed authored First World and coarse environment reference | One actual local site/geometry and owner-backed flora/fauna/monster zone/travel/provider materialization; persisted once |
| `world-engine/src/spawn` and `spawn_profiles.json` | Deterministic candidate selection; five current profiles, none Myridian-specific | Source-approved exact Starfall encounter zone and persisted encounters, not random enemies near login spawn |

## 4. Specific contradictions resolved

1. **Pre-slot screen vs existing Main Menu:** Add Welcome before World Library, not another Save-slot skin. A valid persisted session still shows Welcome; user explicitly presses Continue to Worlds.
2. **World vs Save:** World is an independent persistent instance; geographic First World is the blueprint; characters/campaigns have Save addresses. Multiple Save slots do not imply multiple geographic maps; multiple world cards do not imply multiplayer/Living World.
3. **World builder vs player editor:** internal authored/local-area tooling only. Prior standalone paint-grid demo is not a production UX/content contract.
4. **Creator old review/random/bundle:** no Review, no shopping-style Core starting kit, top bar Start Journey, Surprise Me immediate atomic publication; exact inherited/heir facts cannot be shuffled.
5. **Core origins:** the prior seven free Backstories are not seven valid Core displaced starts. Local/Farmhand/Workshop histories do not automatically meet no-estate/no-safety-net; Exile/Amnesiac strong, Vagabond conditional, World-Stray special.
6. **World Entry stories vs actual spawn:** eight named editorials cannot be offered without a specific real site and lawful first actions. Standard near civilization, Hardcore actual isolated wilderness.
7. **Mortal vs Standard:** `Mortal` is difficulty, `Standard Core` is intro mode. Separate world and Stakes owners, no implicit permanent death toggle.
8. **Seed replay vs Save:** seed/recipe may eventually make fresh similar starts; current Load restores exact world and local entities, not reroll terrain or rewards.
9. **Time skip vs current sprint:** world-owned synchronized time rule is retained as future design, but historical mutation, eras, Prestige world variants, extra maps and packs are now **WIP / Coming Soon**.
10. **World Library vs active runtime:** world selection requires new versioned account-world authority, world-head/Save association and recovery. A frontend card-only implementation cannot satisfy this contract.

## 5. Implementation risk ledger and blockers

| Risk | Severity | Owner-dependent mitigation |
| --- | --- | --- |
| Wrong world/account character selected after persistent login or account switch | Critical | Verify selected session + account-world/character affiliation for every read/write, clear transient selection on auth change |
| World display is only a renamed Save slot | High | New durable `worldInstanceId` and empty-world lifecycle, independent of campaign/artifact identity |
| Two characters mutate independent world clocks under one world name | Critical | Individual World only initially; Living World until one shared authoritative clock/world head and participant gate |
| Accidental save overwrite or losing first campaign on retry | Critical | Stable create/publish intent, head CAS, exact readback, recovery and original consumer receipts |
| Blank or synthetic starting city | High | Actual local site, geometry, route/scene and owner-backed actors/resources; fail-closed missing prereqs |
| Authoring a wrong coast/monster/ecology/crafter in the starter area | High | Region/locality/hex/habitat/source join; owner-backed placed instances and monster safety zone |
| Starting bundle duplicates scene gifts | High | One goods provenance/claim owner, exact once item grants, no invented Core safety net |
| A future feature appears buyable but can't function | Medium | Coming Soon disabled with no Prestige price/charge until owner and proof exist |
| Legacy documentation mistakenly used as active Codex task | High | Cross-link newer audit/consolidated plan; preserve current exact-master prompt and held integration gate |

## 6. Recommended documentation changes in this pass

1. **Create** the controlling detailed [Welcome, World Library, Character Entry and Loading plan](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md).
2. **Create** this audit/disposition register; do not delete useful previous notes or rewrite source history.
3. **Prefix** `unified-shell-and-creator-refinement-plan.md` with a specific supersession notice for Review, Starting Bundle and Randomize and link to controlling plan.
4. **Prefix** `user-design-decisions-2026-06-17.md` with narrow world-library interpretation note, without changing its historical product decisions.
5. **Prefix** `open-design-questions-index.md` with current 2026-11-11 focus/redirect; leave its older pipeline rows clearly historical.
6. **Summarize/link** in [Issue #74](https://github.com/vagabond1215/Lineage_Reforged/issues/74) rather than append another full duplicate implementation specification.
7. **Do not alter** the current Codex prompt, production source, Save schema, map content, browser data, tests, staging or deployment in this docs-only pass.

## 7. Follow-up only after active native-v3 gate

This audit **does not authorize implementation**. The first future executable package should be bounded: verify exact-master native-v3 account/slot readiness; establish a clean separate world registry/identity owner and full failure-state table; then implement Welcome + World Library on top of existing auth. The local Starfall authoritative start-site, World Entry, creator rework, world-load and first-publication integration follow with independent tests and explicit activation/Save cutover choices. No broader world generator or historical time simulation is needed for the first playable world.
