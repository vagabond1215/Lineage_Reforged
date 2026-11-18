# Character Creator: concise interaction UI, existing profile controls, and ecology-informed geography artwork refresh

Date: 2026-11-17 (America/New_York)  
Status: **OWNER UX REFINEMENT + IMAGE RETENTION INVENTORY + STANDALONE REVISED PROTOTYPE / PRODUCTION REACT AND NEW ART NOT_ACCEPTED**  
Source reviewed: `master` `96d215e462dbf9a2065c34facd985edde41c99d5` before new documentation; previous [Finalize → World Entry integration plan](character-creator-post-finalize-world-entry-integration-plan-2026-11-17.md), [contextual launcher](first-world-contextual-launcher-shell-and-branching-entry-ui-contract-2026-11-17.md), [proposed future build/trait model](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md).  
Source art pin: `apps/rpg-ui/src/game-shell/characterCreatorAssetUrl.ts` pins asset commit `712982fbf72b158280df0ac89dc903d3b1832ab4`.  
Retention: [Complete named 100-file binary asset manifest](character-creator-geography-art-retention-manifest-2026-11-17.json).

## 1. Product correction

**Problem:** Earlier standalone design explains obvious steps to the player (“you are in character creation,” “character choices will eventually be saved”), repeats architecture, and replaces existing meaningful color/build/location controls with generic text placeholders. These details belong in design documentation, not the player-facing flow.

**User-directed behavior:** make the actual choice, image and preview the focus. Keep one understated status cue in **QA mock only** so fake functionality cannot be mistaken for real publication. Do not turn the game into a tutorial wall. Present detailed mechanical explanations as **tooltips, expandable More details, contextual invalid-state messages, or explicit player-requested help**, not permanent paragraphs.

**Lean UI copy table:**

| Surface | Short heading / action | Remove from default visible page | Only show when necessary |
| --- | --- | --- | --- |
| Lineage | `Lineage`; image cards with name and selected state | “Choose playable ancestry that anchors ...” paragraph | Eligibility restriction, important source penalty/benefit via tooltip |
| Identity | `Identity`; Name, Sex, Age, Height, Physique, Nature, Focus, Skin/Hair/Eyes | Re-explaining character creation, randomizer behavior and stat formula | Name error, legal palette constraints, stat changes on hover/details |
| Backstory | `Backstory`; illustrated origin, one-line subtitle, choose | Multiple repeated catalog descriptions as default | Longer background only on selected/Details; locked origin reason |
| Build/Profile | `Profile & Attributes`; nine-attribute + resource and modifier summary | “How to make a build” paragraphs, speculative allocation controls | Source-labeled deltas/tooltip, real trait/point-budget controls only when owner implemented |
| Continent/Region/Settlement | Names and accurate art; compact 2–3 factual ecology/economy chips | Four-paragraph lore walls and “this is a map” reminders | More lore, precise start eligibility, warnings where effective |
| Starting Bundle | Name, starter equipment/coin summary and actual choice controls | Duplicate instructions and items repeated across multiple panels | Ownership/legality constraints and real shortage/weight |
| Finalize | Character name/profile, World, opening title; `Continue to Opening` | Re-explaining publication architecture or “you have selected a character” | One compact `No Save yet` message and validation warnings |
| Story/Result | Authored narrative, meaningful choice A/B, Retry/Back | Debug metadata, World/Save API descriptions, repeated “not real” caveats | QA single discreet label; actual error/recovery state only if necessary |

**Specific real source controls to retain, not simulate in final implementation:**

- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`: **all eight validated stages** and step rail; immediate choice cards; existing `swatches()` helper with lineage-projected color palette, tooltip description, selected outline; name/sex/age/height/physique/nature/focus choices; randomize actions; resource bars; founder/heir and legacy guards; starting settlement eligibility, backstory availability, equipment source, Finalize and overwrite behavior.
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`: `skinToneId`, `hairColorId`, `eyeColorId`, `ageBandId`, `heightBandId`, `physiqueId`, `natureId`, `focusId`, `sexId`, `lineageId`, `backstoryId`, geography and Save slot. Do not wipe or ignore fields to fit a simplified mock.
- `apps/rpg-ui/src/game-shell/characterCreationIdentityOptions.ts`: actual lineage-valid `skinToneOptions/hairColorOptions/eyeColorOptions`, height/physique/nature/focus weights and sex/age modifiers. **Do not hardcode illustrative colors into runtime**; the standalone refined HTML swatches are visual samples only.
- `apps/rpg-ui/src/game-shell/characterAttributes.ts`: nine stats exactly `STR, DEX, AGI, CON, VIT, INT, WIS, SPT, CHA` and source-label explanations; retain owner-derived math, not static placeholder numbers.
- **Newer unaccepted build direction:** proposed traits + nine-point attribute allocation in a **single real budget ledger**; linked source-labeled preview of physique/nature/focus/backstory and selected trait effects. Layout may reserve a right or collapsible Build/Profile pane, but **real traits and direct spend buttons stay disabled/hidden until math, budget, serialization and owner acceptance**. Similarly no unowned portrait upload/editor or trait-reward grants.
- **No avatar image pseudo-truth:** a geometric silhouette can serve as a *layout placeholder* in a standalone preview, but game production must use actual licensed/gated character art and the canonical palette/portrait rules before advertising a saved portrait.

## 2. Proposed responsive composition

**Desktop (1280+):** Existing `AppShell` top account/clock and current eight-step left rail (18.48rem). Main content starts at current step title. Identity uses 2/3 form and 1/3 live portrait/profile reference; name, physical profile and colors are compact grouped inputs. Build/Profile stats summarize in a lower or sticky right panel, **not a competing navigation rail**. Geo selection is image-led cards, two or three per row if room. Color and attribute panels get contextual More details rather than competing with primary CTAs.

**Tablet (768):** existing `AppShell` responsive rail behavior; image cards often two per row; appearance preview after controls if necessary. No duplicate second rail.

**Phone (375/320):** scrollable step chips, full-width controls, wrapped real color swatches with accessibility label, portrait below selection, nine stats in 3×3 grid, compact bottom primary action in normal flow. The long two-column creator should never cause horizontal document overflow. No text-dependent swatch distinction: named tooltips/`aria-label` and active ring; keyboard radio semantics need final implementation review.

**Character Build vs Profile:** **Profile** is name/lineage/sex/age/height/physique/nature/focus/color and presentation. **Build** is the numerical consequences and eventually governed trait/budget choices; one derived-preview computation and clear provenance, not a second form with conflicting stats. **Foundation/Backstory** determines thematic narrative origin and available intro; it is not the same axis as World gameplay mode or Hardcore.

## 3. Geography art inventory and safe retention

Current creator art catalog is `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts` with exact paths under `apps/rpg-ui/public/character-creator/`. At pinned 2026-11-17 inspected source revision `712982fb...`:

| Category | Physical PNG files | Notes |
| --- | ---: | --- |
| Continent | **18** | 9 geographic images + 9 `-selected` file names; each selected/unselected pair has identical Git blob SHA, so selected treatment can be CSS, not a new bitmap |
| Region | **13** | Only 13 of the 41 region records have existing named region card art; do not assume unillustrated subregions already have correct art |
| Settlement | **69** | 69 named images vs 88 canonical settlement records; **Starfall Port is not in the art mapping** |
| **Total** | **100** | **91 unique blobs; 376,654,809 bytes referenced** in pinned tree |

The [retention manifest](character-creator-geography-art-retention-manifest-2026-11-17.json) records **every exact original relative path, representative filename, Git blob SHA, byte size, proposed archive filename/path, and duplicate pairs**, and the pinned source commit remains available. **No binary file was deleted, moved, replaced or copied into an archive directory in this Connector run.** This is a retention witness, not a claim of physically archived new files. This avoids silently doubling roughly 377 MB of Git-tracked binaries without a repository storage review.

**Physical archive/promotion protocol (requires synchronized checkout, write mode and exact binary checks):**

1. Verify `git cat-file -p <blob>` or `git hash-object` for every current PNG against the manifest. Preserve **representative filename** under `archive/pre-ecology-refresh-2026-11-17/{continents|regions|settlements}/original-filename.png`, or a reviewed immutable tagged/asset-bundle archive if repo storage policy prefers zero duplicate blob imports.
2. Never delete current `public/character-creator/{...}` filenames or update `worldSelectionCatalog.ts`/production CDN pin before **all referenced old bytes are restorable**. Existing unmodified Git tree and pinned commit remain the recovery baseline even before physical archive.
3. Put regenerated art in **parallel candidate paths**, e.g. `public/character-creator/candidates/ecology-2026-11-17/...original-filename.png`, not active runtime paths. Record candidate SHA256, generation prompt, content pin/region ID, visual review result, crop sizes and alt/contrast checks. Candidate filenames must not imply approval.
4. Compare new image against canonical region biome/vegetation/flora/fauna, settlement economy/site class, coastline and authored mapping. Preserve correct macro names, island distribution and settlement identity. Reject visually attractive but ecologically implausible or geographically misleading imagery. **No rendered AI concept is automatically map or gameplay canon.**
5. Promote only accepted individual images after old-file archive/readback, updating the exact `worldSelectionCatalog.ts` entry and asset pin/renderer seam together; keep same public names only if an atomic, verified replacement/rollback is possible. Verify dark/light/cropped states, selection overlays and 320/375/768/1280 responsiveness, content lint and production build. Rollback by exact old Git blob SHA, not by visually guessing a replacement.

**Important coverage distinction:** Regen 9 continent images does not solve 13/41 regional coverage or 69/88 settlement coverage. Author new images for missing locations only after **separate content/source brief** and explicit approval; missing art should show a graceful, named placeholder, not a wrong neighbor image.

## 4. First ecology-grounded artwork review pilot: Myridian Chain → Starfall Isle → Starfall Port

Source: `packages/content/base/world/regions.json`, `region_localities.json`, `regional_ecology_profiles.json`. Exact profile SHA `c12bf6f372216e3fc1c8a0bee45bceea7a4f7914`; regions blob `04516952ad97d830d2f49d915137197947e22b3a`.

**Continent/top-level `region.myridian_chain`:** rugged maritime archipelago, **mixed forest islands + temperate rainforest + marine shelf**, mild wet maritime; working harbor chains, sparse interior ridges, seafood and pearls, ship repair and maritime trade. Imports bulk grain, timber and metals. New continent card should be a broad island-system landscape and sea passages, *not* one massive city, dry Mediterranean coast, all-tropical palm resort or a walkable street map.

**Subregion `region.starfall_isle`:** sheltering coves, wet mixed forest/rainforest, upland ridges, fog-prone deepwater bay, bonded quays, ferry slips and customs warehouses; modest agriculture, major maritime services. Proposed new region card: medium-distance harbor island coast with believable rain/fog, forests and working docks, while retaining broad forested island identity.

**Settlement `settlement.starfall_port`:** a representative customs/ship-repair harbor image consistent with the endorsed World/source; anchored sea links and shipbuilding, practical quays with fishing crates, sealed cargo and repair yards, not a fake in-game walkable local area. **There is no existing `settlement-starfall-port.png`** in the present 69-file mapping. New settlement illustration requires checking the settlement content record/source and local shoreline approval, not inferring room geometry or a guaranteed pier from macro coordinate. Wet-harbor fauna/flora may include native cod, oyster, crab, reef lobster, coconut palm, orange tree, flax, river reed; these species are canonical to the **macro region** but **do not prove precise placement on a particular dock**. Avoid populating every image with all species; compose only ecologically plausible signs.

**Visual system:** high-quality painterly fantasy environment art, dramatic yet realistic natural light, readable at small card scale, no typography/no labels/no UI, recognizable composition and climate by tier, no random monumental architecture or fantastical overgrowth. Consistent framing/crops: maintain wide 16:9 full art master and ~2:1 card crop safety; keep main environmental landmarks away from overlayed card titles. Use restrained colors compatible with existing charcoal/bronze/parchment chrome, but let biomes remain naturally distinct.

**Full refresh:** generate and review in **batches by region identity**, locking shared art direction, source revision and negative constraints; start Myridian pilot then 9 continent scenes, 13 existing region images + missing-region prioritization, 69 settlement images + missing-site candidates. Each candidate needs QA provenance; no bulk automatic replacement.

## 5. Evidence from this conversation

A standalone refined HTML layout `lineage-character-creator-refined-layout.html` was generated outside the repo, based on the previous integrated mock. It now has a slimmed creator with named skintone/hair/eye swatches, responsive 2-column identity + portrait mock, Age/Height/Physique/Nature/Focus selections, the existing eight navigation steps, 9-attribute preview and explicitly disabled future trait allocation, and art-card geography mapping using **existing pinned asset URLs** where available. Missing Starfall art is a clearly labeled empty card rather than fabricated imagery. `node --check` of embedded preview JavaScript **PASS**; isolated Chromium Playwright `page.set_content` **PASS** for selection/step navigation/color persistence, ecology pilot geography selection, post-Finalize Isekai mock, no page errors/no horizontal overflow at **1280×850, 768×980, 375×812, 320×700**. **Not the React bundle, game owner state or real geometry/image raster acceptance.** All displayed profile/stat values and color palette samples in HTML are illustrative, not the owner-approved palette/stat calculation.

**Image generation outcome:** A native image-generation attempt for new geography candidates was blocked because there was **no usable existing image target** available to the image-generation surface. No regenerated PNGs were produced, no artwork candidate approved or promoted. Obtain actual source image bytes/reference in a supported image-edit generation context, then create **new staged candidates only**. Do not substitute composited placeholder screenshots for finished region art.

**Source status:** All code owner/Save gates remain held, including draft PR #102. This was source-informed design + standalone HTML preview + JSON retention metadata. **No binary archive move/copy, source React change, game Save write, canonical ecology alteration, real export, activation or staged deployment was performed.**
