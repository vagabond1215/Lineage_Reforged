# Eight Core World Entry profiles: branching Creator UI and evidence-gated authoring

Date: **2026-11-18** (America/New_York)  
Status: **OWNER REQUEST IMPLEMENTED IN STANDALONE CREATOR PREVIEW / REAL WORLD ENTRY, CONTENT REGISTRATION, SAVE AND HARDCORE NOT_RUN**  
Reviewed live master `3adb2e1b12a0c617ef92c185d95369e946887604`, PR #102 open/draft code head `d3cd548f6b21aff11c40637c3e16026502f8e6e2`.  
Controlling primary source: [Core World Entry owner product direction](core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md), [eight working scenario IDs and four drafted full scenes](core-world-entry-scenario-contract-and-editorial-seed-2026-11-09.md), [exact geographic source anchors and local-site gaps](core-world-entry-exact-geography-anchor-candidate-inventory-2026-11-09.md), [latest character creator / World Entry profile direction](character-creator-world-entry-prestige-supplies-portrait-integration-intent-2026-11-17.md), [complete creator presentation](creator-expanded-lineage-palette-geography-and-portrait-placement-2026-11-18.md).  
This document distinguishes new authoring draft from existing canon, and no attached QA file is assumed to exist in the repository.

## Source decisions retained

**Core ≠ Backstory ≠ a World genesis scenario.** Core is a low-standing present beginning with no substantial estate, property or reliable advantages. A past formative Backstory may still exist in historical production source; the latest UX direction suppresses player-selected Backstory/Starting Bundle and moves origin and contextual supplies into **World Entry**. Do not silently remove existing Save fields, unlock a special Backstory, or erase the old identity rules before versioned compatibility is accepted.

**Core ≠ Isekai comedy.** The owner asks for the Core profiles in the same interactive **authored opening → A/B action-shaped continuations → review/try again** presentation used for Isekai. The Isekai mock's forced 0/100 parody endings must **not** be copied into grounded Core, where abstaining should not be a game-over judgement or a free death/rewind. No narrative preview command spends time, grants loot, changes location, completes training, or prepares a Save.

**Ordinary versus Hardcore:** Ordinary Core offers a supported way into society with little current support. Hardcore Core requires an actual isolated wilderness start, viable discoverable escape and accepted **World-created Hardcore commitment and terminal-death owner**, not merely dry/icy prose or a Forsaken difficulty slider. The standalone demo has Hardcore Off, so the Wilderness card tab is **read-only narrative review**, not available actual world mode.

**Authored 2–4 connected paragraph openings.** Four catalog entries already have full proposed editorial prose in the original November 9 source; four are distinct working premises awaiting approved authoring. A candidate may have an environmental variant only if verified exact world facts justify it. The standalone prose is newly adapted review text, not imported canonical scenario source. Each branch is finite and distinct; a zero source fact never magically becomes true based on settlement title or macro biome.

## Eight IDs, existing source status and proposed UI continuation

| Working source ID | Pool | Source editorial status | Review-only first choice A / B | Required real source |
| --- | --- | --- | --- | --- |
| `core.room_paid` | Ordinary | Existing full editorial seed | Examine parcel / ask keeper | Real inhabited inn room, actual keeper, lawful gift object and exit |
| `core.last_bed` | Ordinary | Existing full editorial seed | Inspect donated bundle / ask where to go | Actual communal shelter, caretaker, donated good owner and exit |
| `core.journeys_end` | Ordinary | Catalog identity/premise only; new review prose | Inspect settlement approach / inquire about cart route | Compatible history, actual overland arrival and legal town approach |
| `core.roadside_kindness` | Ordinary | Catalog identity/premise only; new review prose | Request directions / observe road | Actual inhabited road, lawful aid actor/source, grounded route |
| `core.broken_wagon` | Hardcore | Existing full editorial seed | Inspect wreck / study wagon ruts | Real isolated wreck, compatible transport, traversable survival exit |
| `core.washed_ashore` | Hardcore | Existing full editorial seed | Examine shoreline / study inland rise | True shoreline/water type, compatible craft wreck, owner-backed safe route |
| `core.abandoned_camp` | Hardcore | Catalog identity/premise only; new review prose | Inspect camp / survey trails | Real isolated camp, confirmed vacancy, legitimate ownership/stock and route |
| `core.lost_trail` | Hardcore | Catalog identity/premise only; new review prose | Look for last trail sign / orient by land | Real remote path/source, believable separation, navigable connection |

**Candidate state graph** (not a new approved Save schema):

```text
World Entry page
  → ordinary 4 cards | wilderness 4 review-only cards
  → editorial sample chosen (explicit, no hidden reroll)
  → Finalize · Read Opening
  → opening 2–3 complete paragraphs
       A/B → distinct continuation
         A: "Continue to verified [inspect, aid, route]" → editorial ready ending
         B: defer action → no-loss pause/retry ending
  → Return to Finalize / restart same opening
  → real "Enter World" remains DISABLED until accepted owner can admit and read back exact scene
```

Each candidate has stable working ID, `pool`, proposed `requires[]` placeholders, `sourceStatus`, opening paragraph array, two action-intent choice labels, two distinct continuations, bounded `ready/defer` terminal outcomes, and `realWorldReady:false`. These are **pure review data**, not accepted `worldEntryScenarioId` content schema or executable game commands. The terminal ready state means “editorial handoff reviewed,” **not** a real accepted game start. No implicit bundle equipment is generated; even a described parcel or canteen must be inspected and acquired through actual owner action before the game may call it inventory.

## Gating and candidate source API

External candidate files, created in this conversation rather than GitHub source:

- `lineage-creator-core-world-entry-branching-preview.html`, SHA256 **`a6e86f410c260dcbc38f714d6af27e714e452f8c6b439d614ac0761630ff49c9`**, extends the latest lineage/color/9–28–88 geography prototype. Keeps Identity/Finalize portrait Generation, full-width Lineage cards and previous mock DEV exports, while replacing three fake location-specific gear starts with Core scenario selection. A World-Stray / Isekai special option remains **locked**.
- `lineage-core-world-entry-editorial-profiles.json`, SHA256 **`6ac53f020ff722d63b54ca65982f24e1435f56ae0ac7e56a01ca7127ecc4ae09`**, exact 8 source IDs plus authored review continuations and requirements.
- `lineage-core-world-entry-editorial-profiles.mjs`, portable pure catalog/negative predicate helpers and bounded branch chooser, no game owner writes.
- `coreWorldEntryEditorialProfiles.ts`, SHA256 **`5366c87568a38af9c728dfc4f96f76c6c6e6d05a99f898091b9bbba4ffb48246`**, typed standalone *candidate* for source-capable import, not repository-integrated.
- `test_core_world_entry_profiles.mjs`, `test_core_world_entry_browser.py`, source assembly scripts, screenshots and a detailed README in conversation review ZIP `lineage-core-world-entry-eight-profiles-review.zip`, SHA256 **`2a12a59741bbc72f49da0d8bcd37ce70aa8ea40f770ceb154583fbe9c60996f8`**.

**Read-only prototype eligibility:** any absent source fact, invalid ID, or mismatch between World Hardcore and scenario pool fails closed. No settlement name, coast climate, "inn" noun, old Save slot, original Backstory, character gender or UI Preview flag is allowed to manufacture source evidence. The 8 `requires` strings are conceptual predicates only, not engine schema; an actual owner must re-author them against supported typed facts, site revisions, item and access identities.

**Authority reality:** The exact-geography inventory knows 88 settlement records, 20 static sites, 47 world hexes and 49 hex edges but confirms no playable inn-room/clinic/wreck/shoreline salvage/wilderness instance from those records. Even the Starfall Port first-pilot candidate has no accepted site-specific room or donation actor. The first true deployment requires one such site and command owner, not a broad map reskin.

## Verification completed in this conversation

- Embedded HTML JavaScript `node --check`: **PASS**.
- `tsc -p tsconfig.core-entry.json` (candidate TypeScript only): **PASS**; not real application TypeScript.
- `node --test test_core_world_entry_profiles.mjs`: **8 / 8 PASS** on 8 exact IDs, correct two pools, original source status, bounded branch graph, unknown and malformed facts, absent source, ordinary and Hardcore mismatch.
- Chromium Playwright against standalone `page.set_content` at **1280×850, 1024×768, 768×980, 375×812, 320×700**: **PASS**. At each viewport, tested all **8** story cards and both branch continuations, defer/retry, pending gameplay button disabled, no 0/100 gameplay score, and region/settlement change invalidating selected narrative. No JS page errors or horizontal document overflow.
- **NOT_RUN:** actual synchronized repository build/typecheck, production `EpochApp`/React or browser World Create, real location owner/actor/loot or native-v3 Save publication, compliant Hardcore world mode, terminal death and owner recovery, actual starter item commands, feature-flag activation, content registration and PR merge.

## Exact next source-capable work

1. Reinspect live `master`, PR #102 and required active docs/test/owner chain in an authenticated checkout. Read this contract and the conversation candidate ZIP if transferred. Compare editorial identities to current canonical authoring and reject unsupported source facts, not just missing text.
2. Bounded QA slice: port the pure typed candidate plus 8 source fixture tests, then mount the Core cards and rail-free branching narrative only in an **isolated feature-gated QA creator** using the real AppShell. Preserve the current **feature-OFF eight-step creator** and real historical Backstory/Bundle source. Keep no side rail in story scenes; keep World-Stray locked.
3. Resolve first **ordinary** Core start at one actual site with complete owner manifest/scene/commands; source inventory suggests Starfall Port as geographic investigation, not verified admission. Author at least two distinct legal ordinary starts only if real interiors/actor/item owners exist. Honest locked/unavailable UI when they do not.
4. Separate later acceptance for **Hardcore** true wilderness site, survivable path, weather/food/health reality and **immediate irreversible terminal-death** owner. An editorial setting cannot simply enable Hardcore in World Creator.
5. On accepted success only, revalidate `accountId, worldInstanceId/revision, founder/heir, actor/site/route, scene version/outcome, approved starter item manifest, Save slot and account lifecycle`, then bind one exact-once first publication. Critically `CleanEpochFirstCampaignAdapter.prepare()` **reserves a retained slot**, so **never call prepare/start/resume on story open/choice/refuse/retry**. Two tabs, restart, interrupted readback and old Save/archive parity require real tests. Prestige/Surprise Me rewards remain held.

**Disposition:** The eight Core narrative profiles now exist as working standalone *UI implementation candidates*. No repository production TSX/game/Save/content/schema/World/source assets or PR #102 code was changed. Existing `L3B_BROWSER_CREATE_HELD`, `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION` remain in force.
