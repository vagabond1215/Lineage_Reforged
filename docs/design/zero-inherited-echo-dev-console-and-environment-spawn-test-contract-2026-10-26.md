# Zero Origin Echo, Default-On Dev Console, and Environment/Spawn Test Commands

Date: 2026-10-26
Status: `OWNER_DIRECTION_ACCEPTED; SOURCE_AUDIT; IMPLEMENTATION_NOT_ACTIVATED`
Inspected active default head: `a596112acf3945f2bf7c625e943f2511d12aa710`.
Inspected new-gear candidate: `codex/gear-instance-fresh-epoch` (draft PR #20); its gear instance owner is not yet integrated into live gameplay.
Route: connector-safe design + implementation preflight; no code, runtime, rules JSON, UI, browser data or Game version changes.
Current Game `0.1.1-prealpha`; parked combat route `DEV-0.7.2.13` remains held.

## 1. Accepted owner clarifications

1. **Every newly created character, founder or heir, starts with zero earned/latent Echo.** Starting backstory proficiency, even from later unlocked Hunter or another advanced family origin, is **capability only** and never counts as earned Echo, Echo diversity, or starting Echo-derived level. Other creation-time bonuses (attributes, knowledge, starter bundle, passive Legacy grant, developer rank/attribute edit) must likewise not create Echo. This prevents repeated character-creation farming. Genuine progression achieved after creation can add Echo under the accepted gameplay growth rules.
2. **World-Stray / Isekai is a special unlocked backstory, not in the ordinary free founder pool.** It cannot be unlocked simply by generic skill-grinding. A future world/story/Chronicle event, unusual continuity proof, or other special narrative authority may unlock it. It should have a **distinct but bounded boon** once earned, with exact effect and acquisition trigger deferred for an authored decision. Neither an advanced science/magic dump nor inherited full skill ranks is authorized; do not invent event flags or rewards to implement it now.
3. Place a compact visible **`Dev` button in unused space of the gameplay top menu bar**, opening an expandable popup with grouped testing commands. **Enabled by default for the current development/testing project and preview**. Do not remove, hide or switch it to opt-in merely because the game starts becoming more complete. **Only a later explicit owner decision** changes this default-on policy closer to playable release.
4. Make the console extensible for **Items**, **Time & Calendar**, **Weather & Climate**, **Spawn Conditions / Encounters**, and later **Diagnostics**. Implement actually backed commands in stages, not nonfunctional buttons disguised as supported gameplay.
5. Build supporting environment/time/weather/spawn test commands to permit reproduction of conditions and encounter candidates. The current systems do not yet own a complete runtime weather simulation or weather/time-gated encounter eligibility. That missing owner must be developed deliberately, not replaced with a UI flag pretending to affect the world.

## 2. Concrete Echo defect traced to live source

`apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` converts each authored backstory starting skill to `PlayerSkillState` with `source: "trained"`. `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` initializes `progression` using `createPlayerProgressionState()` (zero Echo and level) **but also saves backstory starting skills and the creation-resolved attributes**. This initialization is correct only until Echo gets recomputed.

`packages/engines/player-engine/src/progression.ts:calculatePlayerEcho` currently loops over **every skill rank** and all attribute deviations from static reference defaults; `skill.source`, creation origin, starter skills, skill gain provenance and individual attribute base are **not consulted**. The formula also includes those skills in diversity counts. `resolvePlayerEchoProgression` recomputes Echo and level from these totals. When the game next calculates/rebuilds progression, a freshly created character can acquire nonzero Echo and level from uneared starter proficiency/character-creation adjustments. Merely forcing `echoAdjusted = 0` in the creator or hiding the UI number would not repair a later recomputation.

**Proposed authoritative repair for Codex to validate:** persist an explicit origin baseline/evidence record separating starting rank/attribute/knowledge/legacy values from **earned growth**. Echo uses only admissible earned progression signals or earned deltas above immutable creation baselines, after accounting for source changes, stat-development ownership and legitimate loss/decay. Keep the player's effective proficiency intact. Do **not** subtract a blanket rank-25 constant or rely only on `source: "trained"`, because real trained ranks may be earned after creation and the source field does not encode the full award history. Origin evidence must survive current-format Save/restart, recomputation, descendant backstory use and any legitimate progression mutation.

**Important formula choice to settle before code:** Should Echo be based on the present rank gained above creation baseline (which can be reduced by subsequent loss), an append-only earned-work ledger, or source-authorized earned units? Choose one consistent rule that aligns with progression and avoids repeatedly awarding Echo for toggling/storing/restoring skills. Echo must remain a gameplay metric independent of starter familiarities and debug modifications; effective skills still drive their appropriate gameplay actions.

Future chosen backstory's boon must **not** be automatically interpreted as earned skill or statistic progress. Any special World-Stray benefit must obey the same exclusion. Developer-created scenarios must not leak earned Echo to a legitimate lineage/account. No creation/restart or repeated recomputation may mint Echo.

### Required red-before-green regression matrix

| Case | Required result |
| --- | --- |
| Fresh Local, Vagabond, Exile, Amnesiac, unlocked Hunter or World-Stray starter | `echoBase = 0`, `echoAdjusted = 0`, skill/stat/knowledge contributions = 0, `diversityCount = 0`, and Echo-derived `level = 0` at first stable gameplay/readback |
| Character with arbitrary starter ranks or +/- creation attributes | Effective proficiency remains, still no origin Echo |
| One accepted earned Hunting or Archery gain after character creation | Only qualified earned progression contributes; previous starter rank does not suddenly re-enter the full formula |
| Earned and starter skill share the same item/skill ID | Origin tranche excluded, earned tranche counted without identity/source confusion |
| Skill growth followed by recomputation, Save/restart, load/replay, ability award | No double counting; identical earned Echo after restart |
| Backstory descendant origin + Legacy preparatory/starting bonuses | No inherited latent Echo, even when skill starting level increases |
| Developer skill/attribute or item grant and QA-driven simulated activity | Test evidence remains isolated; never credits genuine Echo/backstory unlocks for real campaigns |
| Existing skills, trial gates and earned combat/activity effects | Preserve legitimate gameplay progression and threshold meaning after rework |

### Current-code questions

Check `calculatePlayerEcho` callers through `resolvePlayerEchoProgression`, activity/combat/survey awards, `player-engine` run summary, trials and level presentation. Skill source attribution in `PlayerSkillState` is too coarse on its own. Compare how `statGrowth` records developed/structural adjustments and how backstory/age/sex/height/physique/focus offsets are resolved so only genuinely earned attribute changes contribute. Do not convert every attribute exceeding a global reference value into earned Echo.

## 3. Dev top-bar UI

**Source placement:** `apps/rpg-ui/src/components/TopStatusBar.tsx` renders the actual shell top bar, with `InGameShell.tsx` assembling props from `GameSessionContext.tsx`. The right-side `top-status-controls` currently holds NotificationBell and Settings. Add a compact text-labeled `Dev` button in the available horizontal space, ideally just before notifications/settings; do not displace resource, calendar/climate or condition indicators. Respect responsive/mobile status layouts.

**UI behavior:**

- Default visible/on in current project runtime including the development preview. The Dev popup initially presents **expandable sections** and only enables wired commands; sections without accepted owners should explain their status without claiming success.
- Open/close, focus return, outside-click and Escape, keyboard/assistive-tech semantics; coordinate popup layering with Settings, Calendar and Conditions, and avoid clipping by the sticky header.
- Current target can use a single durable `DevConsole` React component and command registry with per-group registration and owner-facing results. No need for generic scripting/eval or a second shell routing framework.
- A development context and provenance label should remain legible. Default-on access **does not make unsafe commands normal gameplay**: any mutation is gated by typed command validation, QA campaign/fixture identity and authoritative caller permissions. Do not rely only on hiding a button for security. When the owner later retires public access, use an explicit product policy change rather than silent opt-out.
- Present the **result, current values and structured errors**, not just optimistic notifications. On each accepted command, use the existing campaign mutation/publication/session owner rather than mutating a `SaveSnapshot` object directly from a React component.
- The popup can expand as systems arrive, with command groups separated from developer observational diagnostics.

Suggested first visible groups:

| Group | First real commands / presentation | Prerequisite |
| --- | --- | --- |
| Items | Find canonical item by ID/search; grant N independent durable gear instances or fungible quantity, optional durability, valid bag/overflow/worn destination | PR #20 gear owner integrated with current-format Save and grant caller |
| Time & Calendar | Show calendar/tick/watch; advance 1 watch, N watches or N days **through the existing full simulation time owner**; optional controlled jump to a target day/season/year only under separately specified rebase semantics | Time/body/world advancement contract, publication |
| Weather & Climate | Show actual climate metadata, current weather status and test override when defined; choose validated condition/duration/intensity/region, clear override | Typed weather/environment authority first; current weatherState is untyped/empty |
| Spawn & Encounter | Inspect current region/habitat/hazard candidates and why each is eligible; seed a deterministic encounter test; optionally force a particular eligible encounter through normal admission | Current spawn context/candidate/encounter owners; new weather/time restrictions if invoked |
| Diagnostics | View read-only current-format snapshot/owner revisions, provenance, spawn explanation and error receipts | Existing projection/readback |

## 4. Time and weather source boundaries

`packages/shared/time/src/index.ts` currently owns a 13-month, six-season clock. Its default tick cadence is six ticks per subday, four subdays per day. `apps/rpg-ui/src/game-shell/gameplayLoop.ts` advances the clock **together with** body state, stat/attribute load, total play ticks and other effects. Never expose `snapshot.clock.tick += N` as a Dev action. An ordinary `Advance N watches` must go through a single accepted full time pipeline, not just a clock helper, and its effects must be observable. An instantaneous **Set calendar** is categorically different from elapsed gameplay time, and needs separate dev-only snapshot rebase contract to avoid inconsistent body/resource, quest deadlines, campaign history and economy/transport timestamps.

`packages/shared/types/src/contracts.ts` currently defines `WorldState.weatherState: Record<string, unknown>`, and `newGameSnapshot.ts` initializes it to `{}`. `TopStatusBar.tsx` explicitly displays **Weather unavailable**; `calendarClimatePresentation.ts` is an **informational-only** projection, not a runtime weather simulator. A selectable `Rain` label should not imply environmental gameplay outcomes unless an owner explicitly supports them.

Proposed weather progression stages:

1. Read-only climate, season, regional weather owner/source status; no made-up live condition.
2. Typed **QA environmental scenario override** with explicit region, condition ID, intensity, duration/expiration, source `dev`, precedence and clear/reset command. It may render the condition and supply candidate filters even before full dynamic weather simulation if the scenario authority is explicitly accepted. Override values are not general world-generation rolls.
3. Real time-dependent regional condition transition rules, environment effects and spawn/weather gating following authored climate/habitat/season rules, tested deterministically with seeded conditions. Do not claim those effects in stage 2.

## 5. Encounter spawn conditions and QA forcing

`packages/engines/world-engine/src/spawn/index.ts:resolveSpawnCandidates` currently matches region ancestry, settlement/site/hex/habitat/hazard and uses `tick` and seed for candidate selection. `SpawnProfileRecord` in `packages/shared/types/src/encounters.ts` lacks **time-of-day, season and weather eligibility fields**. Combat/world authority keeps spawning outside combat; don't implement spawn filters by hardcoding weather checks into UI or combatant creation.

Future authored spawn extension candidates: allowed watch/daypart, allowed season/month, regional weather IDs/severity, temperature/hazard bands, biome/habitat, rare-event conditions and density/availability. Define the interaction with existing spawn rate/density, hostility weights, movement modes, campaign seed and encounter continuity before activation. Eligibility must be explainable in a Dev inspector and deterministic under fixed inputs. If a filter is not implemented, say `not implemented` rather than `passed`.

**Dev command candidates:**

- `Inspect spawn eligibility`: side-effect-free list of candidates and failure reasons under current or chosen explicit **QA simulation inputs**, clearly labeled preview versus actual world state.
- `Set spawn test context`: select valid region/settlement/habitat/hazard/movement and seed for a sandbox fixture, with explicit reversion and provenance. Do not teleport live player, create a family heir or mutate global world state by changing an inspector filter.
- `Create eligible encounter`: route an explicit scenario through authoritative world encounter admission and the normal combat engine; seeded and repeat-safe; restore/reset test scenarios by owner-backed commands. Never directly insert fabricated `activeEncounter` or bypass constraints silently.
- `Test rejected condition`: run representative day/night, storm/clear, warm/cold, unsuitable habitat, wrong season and hazard thresholds once supported, confirming the candidate is rejected for the authored reason.

**Spawn-condition caveat:** The owner's request to work on other *spawn conditions* can include both **initial character spawn settings** (start time/region/weather/environment) and **world/monster encounter spawning**. The Dev architecture should accommodate both without conflating creator start location/clock with encounter candidate selection. Founder starting origin, climate and spawn point should eventually be configured by their respective creator/world owners.

## 6. Implementation order and scope isolation

1. **Priority correction: Echo exploit.** Dedicated progression/creator/source-evidence repair with actual new-character tests. Preserve effective starting proficiencies and current-format Save/restart. Do not paper over with an initial zero or UI display-only fix.
2. **Dev shell affordance.** Add default-on `Dev` top-bar button and expandable popup UI in a bounded independent branch. Begin with read-only diagnostics and supported command registration; no fake controls.
3. **Time controls.** Add full-owner-backed watch advance and readbacks; leave calendar teleport as a separately reviewed dev action if it cannot be safely bounded.
4. **Item grant.** Activate when current-format non-fungible gear owner is live; then bind to its actual mutation and Save path, while maintaining fungible stack policy.
5. **Weather scenario and spawn tests.** Typed scenario owner followed by authored time/weather spawn filters; validate regional conditions, seeds and normal encounter admission.
6. **Founder/descendant backstory.** Implement separate ancestry-scoped earned-skill unlock and founder rebalancing lane, with World-Stray special narrative event and boon held until an accepted focused source. Developer QA results must never be mistaken for legitimate earned lineage evidence.

Use separate implementation branches or bounded checks for each independent owner and review gate. **Do not insert these changes into active PR #20's gear owner foundation while it is held for source+Save integration.** The installed `docs/dev/current-codex-prompt.md` on `master` and PR #20's next prompt remain their existing gear routes. A future route can select this packet explicitly without overwriting those active instructions.

### Required acceptance checks

- Echo zero on **all** new starter profiles, zero after restart, earned gains count once, no creator/unlocked origin trick can farm Echo; skill usability unchanged.
- `Dev` default-on and visible on top bar in current development preview and local client, desktop/mobile accessible, expandable popup and truthful per-command state; regression checks for Settings/calendar/menu overlap.
- Valid watch advance updates clock, body, resources, calendar and dependent world state; unsafe warp denied or isolated, stale/duplicate requests no effects.
- Canonical gear/dev grants preserve item-instance ID, condition, bag overflow, fungible stack separation, next Save/restart; QA modifications labeled and isolated from reward evidence.
- Weather clearly reads unavailable until scenario owner exists; chosen QA condition has explicit expiry/clear, geography/seed and source, not an unexplained global modifier.
- Spawn-condition tests verify positive **and negative** gating with actual owner-authorized inputs and seeded deterministic candidate sets, without fabricated combat active state.
- Incompatible old development saves need no special migration; current-format history/readback remains reliable under Dev QA scenarios.

No implementation, compiled application, working dev popup, mutation command, engine integration, authored weather schema or deployed Site has been delivered by this connector decision.
