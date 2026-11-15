# Player-Discovered Cartography, Accessible Charts, Study, and Uncertain Bearings

Date: 2026-10-31 (America/New_York)
Status: **USER-SELECTED PRODUCT DIRECTION; CONNECTOR-SAFE OWNER/PRESENTATION PREFLIGHT; NO CODE, CONTENT, SAVE OR ACTION ACTIVATION**.
Track: **T2 / P0** in the parallel progression register (held [PR #24](https://github.com/vagabond1215/Lineage_Reforged/pull/24)).
Topic home: held [PR #45](https://github.com/vagabond1215/Lineage_Reforged/pull/45) (Current Area / Codex Atlas, cartography and canonical location source).
Source review: selected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; accepted `location-recognition-and-geographic-knowledge-taxonomy.md`, `discovery-poi-boundary-decision.md`, `travel-knowledge-route-source-map.md`; PR #45 cartographic and source-of-place preflights; `apps/rpg-ui/src/runtime/geographicKnowledgePresentation.ts` and current Codex Atlas/Save structures.
**Precedence:** this later, explicit user decision replaces prior PR #24/#45's unresolved **full First World raster disclosure / out-of-character optional world atlas** suggestion *for normal player gameplay*. Developer/QA reference art is a separately protected tool. The accepted **Current Area gameplay / existing Codex → Atlas reference navigation** remains unchanged.

## 1. Selected user decisions, faithfully separated from proposals

**User-selected**:
1. **The character's own Atlas map reveals only geography that the character has personally discovered.** Unknown, unexplored or unrecognized world geography is not exposed merely because an authored reference map, asset or canonical place record exists.
2. **Temporarily accessible external maps may show geography beyond personal discovery.** A possessed map may be inspected while it is accessible as an owned/held/carried object. A posted map (examples: charthouse, guild hall, large wall chart) may be inspected while the character is genuinely present and authorized to access it. These charts are a contextual view of that chart's *own* coverage and quality, **not** the character's newly revealed personal Atlas.
3. **After leaving a posted map**, absent continued possession, the character can retain **vague directions and bearings** rather than automatically preserving its complete map detail. Preserve all geography the character had personally discovered before inspecting it. A chart can be consulted again if encountered again.
4. **A potential `Study` action** may help fill missing details of **already-discovered lands**, with any retained indirect direction/identification limited by source quality and an accepted study/evidence owner. Study and inspection are different. No free instant personal-map completion from opening a chart.
5. **Crude or unreliable charts can contain approximate, missing or erroneous positions, beacons, markers and claims.** Their drawn symbols are *source claims*, not verified canonical places, coordinates, travel routes or actual discoveries.
6. **Location profiles:** approved recommendation to edit existing canonical typed registries through developer-reviewed, validated changes first; a future authoring UI must edit those sources rather than a second location database. The assistant may recommend concrete, source-backed improvements when useful; approval is not blanket permission to invent canon.
7. **District/site geometry:** start with settlement-relative nesting, add exact local points/outlines only through a separate validated geometry owner.
8. **Generated world places:** wait until per-world instance identity, persisted world-state ownership and canonical ID/namespace collision rules are explicitly designed and validated.

**Explicitly *not* selected by the user:** any study success probability, action costs or duration, numerical distortion/decay, automatic cartography skill, specific maps or guild chart rooms in live content, ability to copy/steal/share a posted chart, whether bearing notes can be annotated by the player, exact map resolution/fog renderer or in-world chart market value. These remain future, named-consumer decisions.

## 2. The three independent geographic display/evidence planes

The product should expose *one Codex → Atlas navigation destination*, with a clear **source context** in that view instead of three competing atlases.

| Plane / proposed UI label | Eligibility and temporal scope | What may render | What it must **not** grant |
| --- | --- | --- | --- |
| **Your Map** (character-owned discovery) | Player-specific accepted discovery/map-reveal authority, retained through Save/restart | Authorized personally revealed map cells/footprints, routes, named places, directly learned details, distinct accepted uncertainty/recognition statuses | Global raster, unknown land outlines, all regional lore, instant travel, knowledge snippet mastery or account-wide other-character knowledge |
| **Inspect Chart: [source]** (held/borrowed/posted source) | **Exact accessible physical map instance** or **real present mapped surface** with access and validity at current location/time; chart's own coverage/quality, which may exceed discovery | The accessible item's or fixture's *drawn* terrain, rough or exact chart bearings, names, claims, symbols and legend, source attribution, and advertised uncertainty/quality if discernible | Copy to Your Map, mark visited, permanent knowledge, route command, permission to enter places, or immediate correction of a deceptive chart |
| **Bearings & Reports** (retained limited inference) | Accepted personal notes/evidence after inspecting an external source, hearing reports or performing authorized study | General direction, approximate distance/relative arrangement, rumor/place hypothesis, partial or contradictory clue with confidence and provenance (including knowledge that a chart claimed something) | Precise overlay identical to inaccessible chart, forced canonical ID, verified exact coordinate, irrevocable truth or completed discovery |

**First-person scope:** another character/lineage in the same future world does **not** inherit personal map reveal automatically; chart objects may transfer only through future accepted physical-item/permission/knowledge operations. A world-owned chart may have a stable historical source even while a character's discovery changes. Sharing, inheritance and copying require distinct owners.

**Example 1, guild-hall chart:** a character walks into an actually authored/authorized guild hall with a posted wall chart. `Inspect Chart` shows what that source depicts (potentially far beyond traveled land). Upon exit, the posted chart is no longer accessible: its exact image and fine labels disappear from the character's available chart views. `Your Map` remains unchanged; retained rough bearings, if an observation/result is actually accepted, may appear in reports. Being a guild member or standing near a narrative guild hall does not create the chart fixture.

**Example 2, carried crude chart:** the actual owned chart item is inspectable while accessible. It draws a claimed beacon west of a river that could be inaccurate. Render that beacon as `Reported / Unverified` on the **chart layer only**, optionally with a character-held bearing note; do not register a new `map_feature.*`, settlement, actual light source, dungeon, or route at that point. Selling/loss/transferring the item revokes its *full chart view*, while personally accepted evidence/reports continue under their own owner.

**Example 3, studying a familiar coast:** the character personally knows a stretch of shoreline, but has coarse labels. An authenticated posted coastal chart can offer specific named in-range clues. An independently accepted `Study` attempt could improve remembered local bearings or teach a recognized clue already within discovered space if legibility, source integrity and knowledge-owner policy permit. It does not reveal unseen bays further along the coast merely because the printed chart depicts them.

## 3. Proposed owner and persistence architecture, *not* an approved schema

No generic world-place authority is required. A future bounded implementation can distinguish:

```text
Static / accepted world owner
  -> canonical typed place names and profiles, validated visual geometry
  -> source-map/chart *definitions* (what a given edition depicts and claims)
  -> posted chart fixture relation to an actually authored present scene
  -> physical chart *item instance* with accepted version, identity, holder and accessibility
Mutable owner-specific state
  -> character-owned first-person map reveal/coverage, location discovery and recognition
  -> accepted short-lived posted-chart access (current location, exact fixture and access)
  -> retained character evidence: bearings, rumors, taught clues, supersessions, provenance
Reader-only Atlas projection
  -> selected context Your Map | exact accessible Chart | authorized Bearings & Reports
  -> independently filtered geometry, labels, search, selected detail and accessibility text
```

**Critical boundaries:**
- `world_maps.json` and large `world_map_features.json` are reference geometry/artwork, **not** possessed chart identity or visibility permission. The world-map raster cannot be emitted as the character's revealed map by simply hiding marker components. Unknown terrain is itself a spoiler.
- Existing numeric `playerState.geographicKnowledge` `Unaware/Unfamiliar/Familiar/Knowledgeable/Seasoned/Intimate` is a **legacy three-scope label/level state**, not per-cell revealed geometry, accepted route observation or clue-evidence recognition. `KnownLocationState` and geographicKnowledge must be reconciled for player-facing disclosure; neither can stand alone as a complete fog-of-war owner.
- The accepted 2026-07-28 location-recognition decision explicitly distinguishes canonical subject, teaching source, observed clue, accepted evidence, recognition result, and legacy numeric tier. It classifies `world_map.first_world` as **map metadata, not a possessed/studied source**. Generic Route Charts/item identities do **not** yet have map-teaching authority. Source-teaching may be unreliable or contradictory; it does not grant automatic evidence.
- A real cartographic item must be bound to accepted item instance/physical location owner (ongoing native-v3 Codex work), with source `mapId/edition`, provenance, current holder/permission and durable changes through Save. A posted chart requires an independently accepted **world site/fixture/presence** owner and access, not only a site-type string. **Never touch current gear/Save implementation as part of this documentation**.
- Define source **claims** separately from canonical place identities. A demonstrably false landmark may have a provisional *claim ID scoped to map edition*, NOT a fake global `placeId`. True named subjects can point at canonical IDs only if legitimately known/disclosed; missing/mislabeled subjects must stay unresolved. Corrections preserve prior claims and provenance with explicit supersession rather than rewriting world truth.
- `Inspect` is a read-only authorized context; `Study` is a future, owner-admitted time/skill/language/resource/quality/evidence action **if** it has such requirements. Treat skill-based chance, risks, costs, repeat attempts, learning, illustration/route detail and retention thresholds as separate future product/owner policy, not default simulation.
- If a posted/held chart becomes inaccessible mid-inspection (movement, item transfer, revocation, combat/closed scene, Save reload), revalidate on every view/action; never cache the full chart in permanent person-level Atlas state.
- Travel remains governed by its own route/access owner. A claimed direction/marker may assist exploration UX only after explicit navigation design; it does **not** create a legal destination, travel cost or engine path.
- World-first generation and multiple characters may later vary per-world chart editions and territorial knowledge, but this requires explicit persisted world instance namespace and collision rules, **not** alternate static `locations.json` and no account-wide atlas merge.

### Visibility security: prohibit accidental client disclosure

A full unmasked world raster supplied to the player's browser is **already exposed**, even if a translucent fog overlay or CSS clips it visually. Likewise a full JSON geometry manifest, alternate image switch, client-side source map, hover tooltip, search index, pinned preview, legend, alt text, ARIA label or hidden DOM node can leak undiscovered terrain/names.

**Recommended future implementation:** generate/serve **viewer-authorized map fragments/tiles or masked compositions and independently filtered metadata**, or an explicitly nongeographic unknown-region placeholder. The backend/client asset pipeline must not send undiscovered detailed pixels or chart-only claims except while that specific external chart is presently authorized. If infrastructure cannot enforce that policy, **ship list/known-place-only Atlas before the full cartographic background**; do not claim a CSS mask meets the user rule. This is a design gate, not a claim that a secure map service exists today.

## 4. Proposed representation and Study action gates

### A. Cartographic reliability and relative positioning

Prefer **uncertainty envelopes / qualitative bearings** to lying with an unmarked crisp point:

- `directly_observed`: sourced from actual accepted exploration, accurate only to the observation resolution. Character discovery is not automatically exact civil-survey accuracy.
- `charted_unverified`: accessible chart claims with explicit chart provenance and fidelity/edition; may have drawn coordinates inside the **chart's own frame**, not authority over canonical world coordinates.
- `recalled_bearing`: remembered directional relation with a **coarse cone, landmark relation or area**, without precise pin certainty. Example: `A beacon perhaps northwest of the river mouth`. No silently converted exact pixel point.
- `reported_rumor`: secondhand account, potentially contradictory/false; label as such, not `visited` or `discovered`.
- `confirmed` or `disproven`: only from **accepted later observation/evidence**, retaining where the earlier claim came from.

Use `claim/observation/evidence` records in the future **character Knowledge/rumor/recognition owner**, not a new canonical `world.pois`. Uncertainty could be represented as coarse bounded bearings, relation graph, or fuzzed geometry only after a real owner selects reproducible and fair rules. **Never use arbitrary client jitter/random map displacement**: it changes on re-render and can leak actual answers or produce nonreproducible ambiguity.

### B. Study Map acceptance shape (future, nonexecuting)

```text
source-backed request (character, exact accessible map/fixture instance, study intent,
                       eligible already-discovered area or retained-direction target)
 -> owner checks source access, language/legibility, location, current activity,
                 content/claim revision, finite study scope and anti-repeat policy
 -> accepted bounded study occurrence & outcome (clues understood/failed/conflicted)
 -> distinct evidence acceptance and geographic recognition/reveal proposal
 -> separately authorized character knowledge/bearings update (if any)
 -> source-referenced user feedback; replay and Save/restart consistency
```

**Strong default recommendation:** the *first* active Study implementation should only refine **already-discovered locations** and yield one bounded, source-backed detail (such as a name, landmark relation or better bearing) per accepted attempt. Studying entirely unfamiliar geography may produce only vague directional hypotheses until a later explicitly designed scouting/teaching feature; this preserves the user's distinction between viewing a posted chart and personally mapping the world.

**No automatic roll or farm:** inspection alone does not grant skill XP, Echo, geography Knowledge, maps, discoveries or repeated extractable results; every accepted advancement needs the owning action/evidence/Save contract. A chart can be wrong and should not be resolved against the true canonical world at inspection time merely to tell the character the right answer.

## 5. Prospective test matrix, not executed

| Test ID | Situation | Required expected result |
| --- | --- | --- |
| **CART-01** | Fresh character, only starting-area discovery | Your Map exposes **only actually accepted discovered area**, no full biome/elevation background, distant coastline, hidden world geometry or unknown labels |
| **CART-02** | Player has `geographicKnowledge.level>0` for a continent but no pixel/area reveal | Broad name/tier is not permission to expose all continent pixels; a known ID can show permitted text without global raster |
| **CART-03** | Unaware location appears in `KnownLocationState` or compatibility list | Discovery/knowledge precedence fails closed for player visible Atlas label, search, tooltip, source summary and accessibility tree |
| **CART-04** | Actual accessible guild-hall wall chart shows a distant coastline | Inspect Chart temporarily shows the source's *depiction* without expanding Your Map |
| **CART-05** | Leave hall or lose access to posted chart | Full source depiction immediately becomes unavailable; valid *accepted* retained rough bearings survive; previously discovered terrain remains |
| **CART-06** | Buy/receive and carry a chart instance | Full inspection view persists only while physical ownership/access and edition remain valid; item transfer or removal revokes view without erasing independent evidence |
| **CART-07** | Crude map claims nonexistent beacon | Claim remains chart/rumor-scoped, distinct from canonical place ID, cannot become validated atlas point or travel target |
| **CART-08** | Wrong chart position differs from true source position | Never silently snap claimed marker to canonical coordinates, disclose hidden true point, or use travel engine distance as an accuracy oracle |
| **CART-09** | Study map in a **personally discovered** region | One eligible bounded detail/recognition proposal only after accepted occurrence and evidence; retries/restart cannot duplicate XP/progress |
| **CART-10** | Study unfamiliar land on posted chart | No automatic personal map reveal or exact geometry copied; optional vague bearings after independent accepted result |
| **CART-11** | Chart language/legibility/access unknown | Fail closed to inspection/study scope not justified by source; no free chart completion from location label or guild membership |
| **CART-12** | A different character in same world enters Atlas | Different personal discovery map unless explicit valid sharing/transfer; world seed alone confers no map access |
| **CART-13** | CSS fog overlays full global image, full metadata shipped | **Reject implementation as leaking undiscovered geography**; require viewer-specific asset/metadata gating |
| **CART-14** | Search/pins/map-layer switch/alt/ARIA/URL shares unknown place | No names, placements or full map accessible outside authorized context |
| **CART-15** | Rumor later disproven or verified | Correct uncertainty with accepted provenance/supersession; do not mutate canonical base place identity due to report |
| **CART-16** | Current source map edition changes or scene revokes access during open inspection | Re-evaluate authorization and source revision; stale inspection produces no retained-map grant, unauthorized bytes or new evidence |
| **CART-17** | Settlement site with parent but no exact local point | Visible only as nested settlement-relative entry if known; never invented pixel marker |
| **CART-18** | Lost map, returned after Save/restart with retained bearing | Chart depiction inaccessible, personal map unchanged, owner-accepted coarse bearing retained, no Save copy of map art |

These tests are **candidate red-first contracts** for a future repo-capable Atlas/World/Knowledge/item implementation branch; connector reading has not run them.

## 6. Phased implementation after named owner admission

**Phase 0: THIS DOC, completed.** Accept the user policy, boundaries and test fixtures; park source/style decisions with the right owners. No runtime/Save/geometry mutation.

**Phase 1: Personal map disclosure + Atlas shell.** Implement viewer-validated discovery/known-space projection only **after** selecting authoritative reveal coverage and actual tests. Start known-only list if no lawful geometry fragment owner exists; do not ship full world background. Keep Current Area default, Atlas inspection read-only.

**Phase 2: External chart access.** Choose **one exact authenticated source**: e.g. an accepted authored posted fixture at a verified current location, OR a versioned held map item bound to the eventual native-v3 item owner. Source has a bounded illustration/claims/coverage. The chart inspector uses separate accessibility checks and does not enlarge Your Map. Do not author a guild hall merely to fulfill the hypothetical example.

**Phase 3: Inspect → retained bearings.** One deterministic accepted source-driven observation/evidence contract for recalled *approximate* directions after losing chart access, with provenance, stale corrections and no exact player discovery.

**Phase 4: Study familiar lands.** One limited source/area/skill/evidence outcome that can improve remembered geographic detail only on accepted study. Preserve anti-farm, partial failure, contradictions and restart.

**Phase 5: Crude/unreliable chart content.** Source-owned reliability, edition, relative coordinate frames and optionally misleading markers; secure player distinction between source claim, observed world, and canonical truth. Deeper mapmaking/copying/marketplace rules and world-specific generated chart editions later.

**Phase 6: broader routes, active navigation and world-first variety.** Separate route/Travel, Knowledge, generated world-instance geography and World Clock owner admissions. Not part of the Atlas MVP.

## 7. Decisions still worth asking, at the right gate

| Question | Practical recommendation / timing |
| --- | --- |
| **Q-A: How much does physically visiting reveal?** A single campsite, route corridor or entire coarse world hex? | Start with **bounded witnessed/crossed location and nearby visibility**, not whole macro regions. Decide exact geometry/resolution before Phase 1 persistent fog. |
| **Q-B: How are chart claims shown visually?** Overlay external chart on same projection, or show its own page/frame? | **Separate source-labeled chart view/inspector** first; preserves chart distortions and prevents snapping errors. Potential optional dual comparison after owner disclosure rules. Phase 2. |
| **Q-C: May a player copy/sketch a posted chart?** Under what material/skill/time/property conditions? | Not automatically. Later mapmaking action can produce an owned physical chart with fidelity/provenance; not a universal free screenshot mechanic in game state. Phase 3+ if selected. |
| **Q-D: Does `Study Map` use skill, language, time, cost or a success roll?** | First select one explicit teaching outcome + finite time/evidence; avoid arbitrary random check or hard mastery ladder. Phase 4. |
| **Q-E: How much does character memory retain?** Must bearings decay, or merely remain approximate until improved? | **Retain accepted coarse bearings without automatic real-time decay** initially; forgetting/memory loss is a later named mechanics decision. This is not the same as retaining full chart geometry. Phase 3. |
| **Q-F: Can forged maps intentionally deceive, and how is player fairness maintained?** | Keep chart edition/provenance and visible uncertainty cues where character could reasonably infer them; do not expose hidden truth or guarantee reliability. Phase 5. |
| **Q-G: Who owns world-specific/generated chart definitions and per-character copies?** | Authored world/fixture definitions, accepted item instances and player-scoped evidence must remain separate; wait for world-first instance identity, Save/revision collision rules. Phase 2/5+ when needed. |

No question here blocks recording the user-selected policy. **Q-A blocks concrete revealed-terrain implementation**; **Q-B and a real chart source block Phase 2**; Q-D blocks Study execution, not inspect.

## 8. Parallel register disposition and stop

**T2-P0: USER_POLICY_RECORDED; CONTRACT_PREFLIGHT_COMPLETE; FUTURE IMPLEMENTATION_HELD.** Next connector-safe lane with distinct independent value is **T3 clock/climate/source truth**, not another T1/T2 re-audit. Reopen T2 only with an actual canonical map/posted fixture, native gear/item source, accepted persistent revealed-coverage source, new product direction, or an exact executable Atlas consumer. When that occurs, refresh relevant heads, review changed paths, and apply the **CART-01..18** gates.

This file makes **no** changes to `master`, `docs/dev/current-codex-prompt.md`, selected Save, UI/source/test/schema/content, generated maps, branch disposition or Game version. It is a durable held decision, not a playable feature.
