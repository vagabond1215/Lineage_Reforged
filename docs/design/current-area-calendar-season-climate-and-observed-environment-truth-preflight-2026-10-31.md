# T3: Current Area Calendar, Seasons, Climate and Observed Environmental Truth

Date: 2026-10-31 (America/New_York)
Status: **CONNECTOR-SAFE SOURCE-VERIFIED FOUNDATION / NO RUNTIME, SCHEMA, CONTENT, ART OR SAVE ACTIVATION**
Track: **T3 / P1** on [parallel-work register](../dev/connector-safe-parallel-progression-register-2026-10-31.md), [held PR #24](https://github.com/vagabond1215/Lineage_Reforged/pull/24).
Selected `master` at audit: `a596112acf3945f2bf7c625e943f2511d12aa710`, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`.
Independent world-clock policy: [PR #46 Live/Attended clocks](https://github.com/vagabond1215/Lineage_Reforged/blob/93e52e90aef8b1aa5a1cffcbd0f6e2f1f22f8547/docs/design/live-attended-world-clocks-gambit-queue-and-generational-continuation-2026-10-29.md).
UI direction: [Current Area and Codex Atlas split](current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md) and [Current Area interaction](current-area-and-atlas-interaction-presentation-detailed-plan-2026-10-26.md).
Foundational earlier references: `calendar-climate-popup-view-model-plan.md`, `calendar-climate-popup-ia-audit.md`, `local-scene-context-projection-decision.md`, `ecology-grounded-contextual-affordance-expansion-plan.md`.

## 1. What is being settled in this pass

**No new owner questions block this connector-safe pass.** Separate what existing data can truthfully say at the **current character's accepted world and location** from: (a) climate expectations and regional ecology descriptions; (b) observed weather; (c) simulated world-time progression; and (d) executable environmental consequences. T3 is a **reader/provenance/negative-test specification**, not an extra calendar, a weather engine, a location climate-assignment pass, or a mandate for regional content edits.

Do **not** implement the old May calendar plan afresh. Current `master` already has the read-only projection `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts`, its `TopStatusBar.tsx` popup and test fixtures. The May plan's example `Winter` initial season is **historical**; the currently selected clock begins **`Deepfrost`**. Trust live source, current tests and accepted later six-season artwork work rather than older proposed implementation milestones.

**Controlling user decisions:** Current Area is the default gameplay view and the calendar stays in the top bar; Atlas is broader but reveals only the character's personally discovered geography. Showing a broad regional *climate reference* on Current Area never authorizes revealing distant mapped terrain, unnamed places, hidden resources, route geometry, past plot information or first-person recognition.

## 2. Measured source and consumer ledger (exact selected master)

| Authority or consumer | Current verified source fact | Safe reading | Forbidden inference |
| --- | --- | --- | --- |
| Shared ticking clock | `packages/shared/time/src/index.ts` blob `a49f38c2fda8743b0da0ec61bcde243321aedf83` | `createInitialClock()` yields tick 0, year 1/month 1/day 1/subday 1/`Deepfrost`; default 6 ticks per subday, 4 subdays per day, 8 days per month, 13 months per year. `advanceClock` owns numeric clock change. | Wall-clock time is not the world time; do not run a second UI/Area clock or a Live/Attended scheduler based on these numbers. |
| Runtime season | Same shared time source and `tests/unit/clock-season-map.test.mjs` | Explicit month-to-season mapping: **1–2 Deepfrost, 3 Thaw, 4–5 Waking, 6–7 Swelter, 8–9 Harvest, 10–11 Withering, 12 Deepfrost, 13 Thaw**. The 13-month mapping is currently temporary and source-owned. | Do not make authored `seasonLengths` override runtime season, reassign month 13, or assume intuitive Earth-style season progression. |
| Calendar names | `packages/content/base/world/calendar.json` blob `25c671c6125df73822006514611d30998833b2cb` | Has numeric months 1–13, six accepted season names, six formal names. Month **display names** such as `Deepfrost/Thawrise` are UI copy in `uiViewModel.ts` and `calendarClimatePresentation.ts`, not calendar-content canon. | Do not make calendar.json a fully authored month-name registry without a separate content/schema decision. |
| Seasonal images | `apps/rpg-ui/src/game-shell/seasonArtwork.ts` blob `0e921292c8f3eb657313530e4f4866dec2c50a84` | Resolves six named art URLs. All six expected `apps/rpg-ui/public/seasons/season-*.png` paths exist in selected master. | Artwork is decoration/season cue, not observer proof of current snow, drought, sunset, precipitation, storm or daylight conditions. |
| Authored climates | `packages/content/base/world/climate_profiles.json` blob `f3c680d3b4769619a86c74b6161995626de17c01` | **18 climate profiles**, all six seasonal temperature bands authored per profile (**108/108 present**), no invalid/reversed numeric bounds in this connector check; these are expected **seasonal bands in Celsius**, not sensed current temperature. | Cannot truthfully say it *is currently* a given temperature or that weather/biological consequences occurred. Profile-specific `seasonLengths` are reference metadata only. |
| Regional ecology climate | `packages/content/base/world/regional_ecology_profiles.json` blob `c12bf6f372216e3fc1c8a0bee45bceea7a4f7914` | **9 macro-regional profiles**, each has one primary and one or more secondary authored climate-profile references. Every inspected climate ID resolves against the 18 records. Regional ecology may explain broad expected climate and ecological plausibility. | A region profile does **not** select the exact present climate for every local settlement/site/hex; secondary climates are not current weather. A suggested plant/animal is not an observed resource stock. |
| Finer climate-zone associations | `settlements.json` `visualMapRef.climateZoneId` and `world_map_features.json` climate-zone `climateProfileId` are documented in accepted May plan | Potential **future** exact authored climate-zone resolver only after the large `settlements.json` (1.26 MB) and visual geometry (9.3 MB) are checked in authenticated checkout as planned by **T1-B**. | Do not guess settlement-specific climate from the parent continent or nearest raster color; large files and registration/anchor quality were **not reverified** in this pass. |
| Existing pure climate projection | `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` blob `973b69012e957b802c146728555aa51e29d10890` | Already supports optional externally supplied `profileSource` with profile, source label, zone, expected seasonal band; missing input gives unavailable and warning rows; `actionIds: []`; no mutation. | This helper having a `profileSource` input does **not** establish an authoritative location-to-profile caller. |
| **Actual active current UI caller** | `apps/rpg-ui/src/runtime/uiViewModel.ts` blob `c152412ebc19511f2e394619c8ee3c979e64b119`, `createUiViewModel`, lines ~2092–2100 | Passes `snapshot.clock`, settlement/region ID and UI-humanized names, and monthLabels into `buildCalendarClimatePopupViewModel`. **It does NOT pass `profileSource`.** Thus the active popup can show calendar/season but normally reports *unknown authoritative climate profile* and unavailable expected seasonal band. | It would be inaccurate to state that regional temperatures or local climate now render for every current settlement, or that the UI has a correct local climate resolver. |
| Current popup host | `apps/rpg-ui/src/components/TopStatusBar.tsx` blob `01822d772184184ab48bb56dfb639f2bd10cb714` | Calendar button, supplied season picture, current time watch, a read-only calendar/climate popover; it explicitly says **`Weather unavailable`**. Source affects no command/actions. | Don't add second Current Area season control, forge weather effects, or silently substitute regional average for weather. |
| Mutable world weather state | `SaveSnapshot.worldState.weatherState` is a generic record; `newGameSnapshot.ts` initializes `weatherState: {}` | No authenticated observed-weather owner has been proved from this UI/data route; render **weather unavailable**. | Generic/demo `weatherState` keys or an unvalidated `climateProfileId` do not prove real rain, storm, visibility, hazard, warmth, crop failure or active weather. |
| World scheduling concept | [held PR #46 Live/Attended clock direction](https://github.com/vagabond1215/Lineage_Reforged/pull/46) | User selected future **Live** (bounded elapsed real-world time) and **Attended** (direct or valid finite queued attendance). One committed world history and clock across characters, not a separate timestamp per character. | Nothing in `createUiViewModel` or the shared tick API makes either schedule **implemented**. Do not infer offline catch-up, auto-gambit, aging beyond current owner, weather generation or queue work. |

**Concrete test inventory already present** on `master` (read, **not executed** in this connector turn): `tests/unit/calendar-climate-presentation.test.mjs` covers supplied/missing profile, legacy season, source labels, immutable inputs, warnings, no actions, informational effects; `tests/unit/clock-season-map.test.mjs` covers month mapping; `tests/unit/season-naming-and-art.test.mjs` checks season names, legacy values and six images; `apps/rpg-ui/tests/top-status-bar-render.test.mjs` exercises the host markup. These are not a substitute for a new local climate resolver test or selected in-game Area display tests.

## 3. Five mutually exclusive meanings of environmental information

| Tier | Actual basis | Safe Current Area text example | Cannot imply |
| --- | --- | --- | --- |
| **A. Current, accepted clock** | Exactly `snapshot.clock` from accepted simulation Save | `Year 1 · Deepfrost · Dawn Watch` when those values are actually present | Weather, climate, environmental heat/cold damage or a world-time mode |
| **B. Broad authored region climate** | An explicitly resolved **parent region** + `regional_ecology_profiles` primary/secondary refs, with quality/provenance | `Regional climate context: dry seasonal patterns are common in Kaelvar` **only if authored wording supports this**, label it **regional reference**, not `here now` | Local measured temperature, site weather, active effect, guaranteed harvestable ecology or discovery of undiscovered areas |
| **C. Verified specific static climate profile** | A validated explicit current-place `climateZoneId -> climateProfileId -> climate_profiles` chain with established spatial source | `Typical Deepfrost range for this mapped climate zone: [authored low] to [authored high] °C` | It is that temperature now; the profile's season lengths drive the game's current clock; whole region has one temperature |
| **D. Accepted current observation** | A separate **real** observer/weather/scene authority: actual observed rain, wind, light, fog, smoke, etc. with tick/location/source and character access | `Rain is falling along the waterfront` **only when admitted and actually observed** | Global forecast, neighboring unknown map reveal, hidden hazards, mechanically slippery terrain unless a domain owner enforces it |
| **E. Accepted runtime effect** | Weather/Body/Travel/Economy/Combat owner has actually applied and retained an effect | `Movement slowed by accepted wet-ground modifier` **only if a real gameplay receipt/source says so** | Any penalty from vague climate adjectives, static expected temperatures, art or color overlays |

**Evidence priority:** E needs an actual effect receipt; D needs actual observation; C needs a true registered location→zone→profile link; B is optional broad reference; A only clock. A user-facing source label must not promote lower-quality data to a stronger fact. Multiple types may coexist, but each gets distinct visual language and provenance.

### Current-safe presentation recommendation

**Current Area** uses the existing top-bar calendar (do not duplicate). An optional compact **Environment** line beneath the current place may show:
1. a real current observer/scene statement where present;
2. otherwise a **clearly labeled regional ecological/climate reference** *only when resolved and character-eligible*;
3. otherwise `Local conditions not established` or no card at all. Never invent precipitation, fog, heat stress, creature movement, currents, snowfall or wind direction.

Even in Tier B, a character does not gain all geography, region names, local plants or precise points merely from standing nearby. Link to Codex → Atlas only for **personally discovered geography**, following [PR #45 discovered-only cartography](https://github.com/vagabond1215/Lineage_Reforged/blob/c722f6f27532f9bae248d96a65ab556605cf77ed/docs/design/player-discovered-cartography-chart-sources-study-and-uncertain-bearings-decision-2026-10-31.md). External carried/posted chart content stays in its separately authorized source view, and its false claims do not become climate facts.

**Do not derive any active status** from the season artwork. Six season emblems remain clock-themed decoration; future generated scenes/seasonal landscape art need actual location, observation and image provenance to depict a specific weather state.

## 4. First implementation-grade reader contract, without schema selection

```text
projectCurrentAreaEnvironment({
  acceptedClock,        // exact selected current snapshot and tick
  currentLocation,      // only actual accepted place identity and precision
  viewerEntitlement,    // current observer + character knowledge / discovery owner
  observedScene?,       // separate observed-now authority, with source and timestamp
  regionalContext?,     // explicitly resolved sourced macro-regional profile
  mappedClimateZone?,   // later, separately validated exact zone/profile link
  appliedEffectRefs?    // actual domain receipts, never calculated by UI
})
  -> {
    currentTime,        // pure shared-time projection
    seasonalArtwork,    // decorative and clock-owned only
    currentObservation?,// only if authenticated/eligible and not stale
    authoredContext?,   // clearly labeled 'regional' or 'typical seasonal'
    gameplayEffects,    // only receipt-backed accepted effects
    unsupportedReason,  // visible when stronger detail is absent
    provenance,         // exact owner, id/revision, tick and spatial precision
    actionIds: []        // presentation has zero mutation rights
  }
```

Illustrative **future projection**, not an accepted TypeScript/Save schema or immediate code change. Prefer composing the **existing** `buildCalendarClimatePopupViewModel` and its owner to creating a second calendar formatter. A future location resolver may give the existing helper the validated `profileSource`, but **must not** turn an ambiguous region-primary source into a definitive settlement climate. UI reads existing item, map, discovery and time owners, never becomes their mutation owner.

**Candidate narrow pilot if selected later:** In one authenticated existing macro-region already known to the character, supply a clearly labeled *regional* primary climate reference to a read-only Area context card. Keep current calendar popup `profileSource` omitted if that projection cannot express `regional_approximate` without implying an exact local climate. An exact climate-zone source can be added only after T1-B proves complete owner chain and map placement. This avoids breaking the current honest `Weather unavailable` UI while making authored environment useful.

## 5. Prospective red-first acceptance matrix (not executed)

| ID | Scenario | Required behavior |
| --- | --- | --- |
| **ENV-01** | Fresh selected clock on new character | Initial season is `Deepfrost`, no legacy `Winter` claim, no current weather claim, Current Area and topbar agree |
| **ENV-02** | Runtime clock crosses one of 13 months | Shared time `SEASON_BY_MONTH` controls read-only season display, irrespective of any climate profile's seasonLengths |
| **ENV-03** | Month 12 followed by month 13 | Displays `Deepfrost` then `Thaw`; month name is UI label; no intuitive-map override |
| **ENV-04** | Subday 1–4, unknown/malformed watch | Displays Dawn Watch, High Sun, Dusk Watch, Night Watch or truthful fallback, no stale invented time |
| **ENV-05** | No `profileSource` at current selected caller | **Weather unavailable**; climate profile unknown and seasonal temperature unavailable; never fill from `weatherState` |
| **ENV-06** | Supplied regional primary climate ref only | Displays **regional reference / possible conditions**, not current-settlement climate or present temperature |
| **ENV-07** | Secondary region climate ref | No silent selection of one exact climate at the character's current site |
| **ENV-08** | Authenticated climate-zone ID points to a known 18-profile record | One *typical seasonal band* if validated chain and viewer permitted; no temperature-now, precipitation or damage |
| **ENV-09** | Missing/unknown zone or malformed id or unverified current site mapping | Fail closed to unavailable or clearly broad regional reference, never map nearest climate by guessed pixel |
| **ENV-10** | One of the 18 profiles or six season bands changes | Recompute source-derived informational projection from new validated data; do not change stored runtime clock or an accepted historical receipt |
| **ENV-11** | Current observer says rain, regional reference is dry | Display actual observed rain separately from broad dry-climate expectation; a profile must not erase admitted observation |
| **ENV-12** | Current observer absent/stale / historical event only | Do not put past weather into today's scene; may show source-tagged Chronicle/history only if independently authorized |
| **ENV-13** | Author background scene/season art depicts snow but no weather source | No current snow, visibility reduction, injury, weather lock or travel penalty projected |
| **ENV-14** | Climate band available, but Body/Travel/Combat lacks accepted effect | Display reference without penalties, stat warnings, resource burn, recipe/farming/crop claims or action ids |
| **ENV-15** | Player has discovered present area but not neighboring geography | Regional context includes no undiscovered place identity, map raster, settlement list, route or hidden biome markers |
| **ENV-16** | Player inspects a temporarily accessible false chart | Chart's claims remain chart-scoped, cannot override actual observed environment or a canonical climate zone |
| **ENV-17** | Another independent character shares the same world clock | One accepted world clock, independent viewer/knowledge permissions; no cross-character perception inheritance |
| **ENV-18** | Future Live mode with offline wall-clock elapsed | UI cannot synthesize ticks, income, weather or aging from elapsed time; only display accepted world-clock/save head |
| **ENV-19** | Future Attended mode with all finite queue tasks stopped | Clock must follow future accepted attendance policy, not a client-local timer; present UI remains read-only |
| **ENV-20** | Save/restart and same accepted head | Time/season/reference remain stable, UI recreation cannot mutate Save, apply climate effects or advance tick |
| **ENV-21** | Existing climate projection is absent clock or profile | Existing warning/unavailable branches preserved, zero commands and no mutated inputs |
| **ENV-22** | Eighteen profiles × six bands / 9 regional refs | Validate names, season bands, referenced IDs, optional secondary links and provenance; no content seeding to satisfy a screenshot |

## 6. Actual decisions, blockers and next named consumer

**No user questions required to close T3 connector preflight**. These are future gate decisions, not prerequisites for the current file:

- **Q-T3A, important before locality-specific climate UI:** Which **authoritative source** maps the exact current settlement/site/route/hex to a climate zone (or certifies only a regional approximation), and what is the provenance when a local map anchor is missing? **Recommendation:** follow T1-B's validated exact climate zone chain; meanwhile show regional context explicitly marked reference-only, not current.
- **Q-T3B, important before actual weather:** Who owns **per-place/time environmental observations and the world's mutable weather**, its generation/resolution and its consequence receipts? **Recommendation:** separate accepted witnessed conditions from authored climate; do not stretch generic `weatherState` into a weather engine.
- **Q-T3C, important before world scheduling:** How do **Live/Attended** mode, day length, offline catch-up, queue eligibility and event budgets convert real time to shared tick head? **Recommendation:** use PR #46 as the selected conceptual rule, but require explicit world/account/Save owner and deterministic server clock; no numeric rate chosen here.
- **Q-T3D, important before active environment game effects:** Which simulation domain first consumes accepted current weather (travel, body-state, agriculture, combat, navigation)? **Recommendation:** no broad universal effects pass; choose one actual consumer, one effect and red-first receipts after its prerequisite sources exist.
- **Q-T3E, important before enriched illustrated Area scenes:** Should seasonal changes be merely illustrative until specific environment observations exist? **Recommendation:** yes; decorate from clock without suggesting actual precipitation or travel hazard. Only scene-specific observed evidence may justify localized weather art.
- **Q-T3F, minor editorial question:** Should the 13 month names move from duplicated UI copy to authored calendar content later? **Recommendation:** defer; current behavior and tests are stable, and calendar.json contains numbers only. Avoid unsolicited schema expansion.

**Owner-selectable bounded future implementation:** an independently accepted `Current Area: read-only regional environment contextual card` reusing the existing topbar/projection, with fail-closed location/knowledge and no live weather. Its source owner must be selected and tested at that time. It may be preferable to add only reader semantics before any climate resolver; local climate-zone mapping needs separate T1-B checkout evidence. This preflight does not create a fresh Codex prompt or alter selected native gear/Save work.

**T3 disposition:** `CONNECTOR_SOURCE_TRUTH_COMPLETE; IMPLEMENTATION_HELD`. Next T3 activity **only** on named future consumer, new location/climate source, new actual observer/weather source, selected world-time owner, or a material changed source SHA; not another broad calendar/climate re-audit.

**Parallel progression next:** T1-B is the largest actual open evidence gap, requiring a repo-capable independent checkout for `settlements.json` and visual geometry; for connector-only work, T4 (one evidence-backed environmental source→item candidate) has a **new positive canon/consumer prerequisite** and remains held. T8 world-instance identity matrix can advance on a new explicit owner decision. If none fires, **stop connector-safe planning rather than multiply design files**.

No source, tests, artwork, content, Save, active Codex prompt/branch, Game milestone, production UI or compiled JavaScript files were modified.
