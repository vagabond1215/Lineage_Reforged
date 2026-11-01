# Lore-Grounded Naming, Area Prose, And Visual Brief Authoring Plan

Date: 2026-10-26
Status: `NARRATIVE_CONTENT_PLANNING_ONLY; NO_NEW_CANON_AUTHORIZED`
Context: [Default Current Area and Codex Atlas](current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md), [deferred timing map](deferred-and-outstanding-design-consumer-timing-map-2026-10-26.md), Game `0.1.1-prealpha`, `INTEGRATED_LOOP`.
Source-grounding checked against `packages/content/base/world/regions.json` (41 entries including Kaelvar, Valtherion, Serathyl, Draemor and Talmyra), `settlement_districts.json` (14), `settlement_sites.json` (20), `docs/design/static-content-expansion-program.md`, `settlement-expansion-content-shape-plan.md`, `content-generation-boundary-map.md`, `ashen-reef-soundings-authored-canon-decision.md`, `narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md` and `living-character-manuscript-design-boundary.md`.
**No name, biography, geography, hidden landmark, weather, speech quote, image, institution or historical fact in this plan is a newly approved game-content record.**

## 1. Literary/design objective

Make Lineage: Reforged feel like a lived-in, historically layered **grounded medieval-fantasy** world where a place's name, vocabulary and look follow its environment, economy, culture, institutions, passage of time and source-authored history. Avoid standardized fantasy proper nouns, repetitive suffix combinations, random Anglo compounds, cultureless "mystic + substance" names, unexplained pan-world naming similarity, modern technical terms in ordinary dialogue, and copy-paste flavor.

**Variety must be justified, not chaotic.** A polity's formal charter, a pilot's oral harbor name, a fisher's navigational shorthand, a sacred order's title and an outsider's transcription may differ. Do not generate fictitious dialect history simply to add variety. Distinguish accepted canonical name, authenticated colloquial alias, translated rendering, historical form and temporary proposal.

## 2. Canonical source hierarchy and naming/description facts

1. **Highest priority:** exact current content record and accepted authored decision for the specific canonical region/settlement/site/quest/event/entity. Never override a stable accepted name in a UI scene or generated asset prompt. Examples of accepted context: `Soundings of Ashen Reef`, Starfall Harbormaster's Office, survey anchorage/reef passages and ruins; these are already authored, not license to invent another office holder or second shoreline settlement.
2. **Parent context:** region, polity, locality, settlement, districts/sites, map features, routes, marine or upland morphology, climate/biomes, ecology, trade and production, religion, factions and known law. Each is used only where exact owner records support it, with certainty noted.
3. **Observable/current:** character's present place/coarse site label, accepted location/event/quest facts, time/season, true known environmental state, discovered knowledge and recent accepted consequences. A pre-existing storm in quest premise is **not** proof it is raining right now.
4. **Presentation and narrative:** `static-content-expansion-program.md` requires distinct role, parent closure and non-duplicative grounded names; `settlement-expansion-content-shape-plan.md` rules out names suggesting a fort/harbor/mine without matching records. `narrative-realization...` enforces provenance, observer-safe wording, approved fact references and deterministic fallback.
5. **Drafts/research/generation:** proposed names, place atmospheres, suggested actor occupations, color palettes, images, maps and AI output are **not authored canon**. They cannot create a person, provider, location, encounter, event, restriction, route or Knowledge unlock by being displayed.

Do not use a bare quest-contact string or `siteLabel` as an established person's/site's canonical name. Do not infer a protected natural reserve or ongoing magical weather event from Ashen Reef's quest.

## 3. The place/name authoring dossier (mandatory for a new named content record)

| Field | What to prove or explicitly mark unknown |
| --- | --- |
| Owner family and canonical parent | Region/settlement/district/site/semantic map feature/quest definition; stable parent references |
| Accepted facts and sources | Exact file/record ID and field, authored decision, observation/Chronicle source, last-read SHA |
| Function and human use | Why a settlement/site exists: river exchange, fishery, harbor pilotage, pass refuge, quarry, agriculture, court, market, ritual; only where source supports |
| Environmental morphology | Shore/bay/reef/estuary/valley/forest edge/scrub/river/height, hazards and usable resources with precision |
| Cultural register | Local naming/linguistic evidence, scripts/translation policy, institutions, titles, migration/trade influence, names in neighboring regions; **unestablished** until source exists |
| Timeline/layers | Historical founder, conquest, disaster, religious dedication, changed use or trade, if explicitly authored; do not fake eras |
| Proposed name and alternatives | Three **meaningfully distinct** candidates with different plausible etymological premises, not 20 mechanically permuted fantasy syllables |
| Rejection/collision check | Global ID collision, same-parent phonetic collision, semantic repetition, misleading geography, token overuse, nearby theme mismatch |
| Readable short/long display | Area heading, Atlas label, one-line situational description, deeper Codex summary, alt text; all remain traceable |
| Permissions and confidence | Approved canon / directly sourced flavor / conservative paraphrase / provisional proposal / unknown; reviewer and immutable decision reference |
| Asset guidance | Art scene viewpoint, architecture, materials, terrain, activity, climate *as supported*, alt/fallback and `illustrativeConcept` until accepted |

**No automatic name adoption** from a concept drawing, asset filename, notebook draft or generated prose.

## 4. Naming style rules without a cookie-cutter generator

- **Function before phonetics.** Ask why locals name this: who would use the place, what feature distinguishes it, what practical danger/convenience matters, how the name appears in old charters versus common speech?
- **Region-specific cadence.** Use actual existing neighboring names as a reference corpus rather than forcing every culture into one syllabic palette. The live world already mixes names such as Kaelvar, Valtherion, Serathyl, Draemor, Talmyra, Aurelis, Vinecross, Redcliff Quay, Riverthrone, Millrun, Breaksail, Stormwatch Citadel and Cliffsalt Priory. This **demonstrates variety**, but it does not prove a formally defined language or dialect for any region.
- **Mix name origins intentionally.** Topographic/working names (ford, reef, quay, pass), founder/person names where that person truly exists, charter/institutional titles where canon exists, older/borrowed cultural names when a migration record exists, and navigational/folk names when in-setting usage is plausible. Do not make every site a `<color> + <mineral> + <fort>` or `<mystic> + <natural feature>`.
- **Semantic consistency.** A salt flat need not be a port; a citadel must have fortification context; a quay implies water/landing; a chapel/priory implies religious authority; a market court implies trade/social use. Do not smuggle these functions into new canon with a name alone.
- **Cultural nuance without stereotypes.** If regional language evidence is sparse, use an ordinary descriptive provisional label rather than fabricated "exotic" phonemes, caricatured accents or false ethnolinguistic claims. Exonyms and endonyms require source acceptance.
- **Historical layers only when earned.** Relic words, old dynastic names, ruins, saints and named battles need explicit history, not generic epic prose. Real political/social discontinuities may support renaming later, but need an owner.
- **Uniqueness without awkwardness.** Search normalized spellings, phonetic similarity and local neighbors. Avoid reused suffixes like `-fall`, `-crown`, `-watch` in contiguous newly authored groups unless shared cultural/historical evidence warrants it.
- **Narrative roles remain specific.** A harbormaster's office can be real institutional context without an invented named harbormaster NPC. A fisher, lookout, courier, healer or exile may appear in prose only if actually authored/observed or the wording is safely impersonal ("working craft use this approach") without claiming a live interactable.
- **Technical diction matters.** Starfall/Ashen is civic-hydrographic: sounding lines, piloting, bearings, shoals, reef marks, tides, chart packets and small-craft seamanship. Avoid modern hydrophones/GPS/sonar or automatic cosmic explanations. Magic is not a general map-data authority.
- **No reward/name gameplay leak.** A clever scene label cannot generate discovery, Echo, reputation, access, loot, faction status or quest eligibility.

## 5. Narrative copy tiers for Area and Atlas

| Tier | Length/role | Allowed source | Forbidden invention |
| --- | --- | --- | --- |
| Place header | 1 canonical named line + optional precision breadcrumb | Current accepted location owner | UI-selected Atlas page becomes physical current location |
| Immediate impression | 1–2 short atmospheric sentences | Authored place, biome/climate/habitat **as presently established/observable** | Guaranteed nearby resource, active NPC, exact weather, present storm |
| Situation | 1 concise condition/objective sentence | Current quest, activity, encounter, body/readiness | Fictional recent action, new quest objective, hidden trap |
| Action/cost | Compact owner-derived labels | Accepted legal action list and owner preview | Invented costs, success chances or effect guarantees |
| Recent results | 3–6 source-linked entries if actually retained | Accepted campaign/Chronicle result identities | Infinite location history, fabricated dialogue or casual retroactive causality |
| Atlas entry | Short geography summary + detail on demand | Known geography and accepted content references | Fog-of-war leak, active provider/travel teleporter |
| Optional scene art brief | 1 grounded visual subject & alt | Approved canonical place + observed layer | Invented overhead geometry, institutions, precise POI positions |

A place whose source has only a title/region gets a **plain, honest fallback**; absence is better than procedural filler. Generated contextual paraphrases, if later accepted, must pass the deterministic realization and observer-safe facts design before they become live output.

## 6. Narrative scene and asset pilot, without authoring fake canon

First test candidates must come from a fresh exact-source shortlist:

- **Starfall Port:** current settlement scene with working harbor context **only where existing accepted Starfall content supports it**, pilotage and the specific accepted civic survey motive. No invented named clerk, exact quay/site graph, shop or market action.
- **Ashen Reef survey anchorage:** local sea/reef approach rather than an independent city, with established post-storm hazard/reef-mark premise. Label the current observation's precision correctly; no automatic present storm/weather. The previously accepted shift sectors can support *authored quest-stage descriptions*, not maps of exact navigational coordinates.
- **Stonevein / contrasting inland context:** use only an actual verified region/current location/encounter source; do not assume a specified settlement if only region/nearby exploration exists.
- **Non-coastal comparator:** choose an actual authored region/locality and source labels rather than invented placeholder geography, to ensure varied terrain/culture and non-maritime action vocabulary.

For each, author a **two-column fact ledger**: "source allows us to say" vs "tempting but unsupported". Write at most three distinct short scene-copy candidates **outside runtime content**, with reviewer-selected one or rejection. For visual assets, create separate landscape/isometric/overhead briefs only after geometry and visibility are known; mark `illustrativeConcept`, artist prompts and alt text. A generated image itself must not become a world-map coordinate source.

## 7. Narrative review workflow and quality gates

1. **Retrieve exact sources** and verify the place's hierarchy, authored facts, temporal context, player-known visibility and current game state; name owner/reviewer. Build a small regional vocabulary list from confirmed neighboring canon, map/economy/climate and settled era.
2. **Set information contract**: what this character currently knows, observes, merely hears about and cannot know. Separate scene prose from a codex reference description and a Chronicle event report.
3. **Author focused candidates**: 2–3 names **only if needed**, 2–3 meaningful short variants for copy; at least one literal/conservative alternative. Record origin of each motif and cross-check that neighboring locations do not receive near-identical names.
4. **Critique in-setting plausibility**: can a fisher, cartwright, border patrol, clerk or local speaker reasonably use the name? Does economy/terrain/technology justify it? Are magic/religion/politics present only through established facts? Does any term read like generic RPG marketing?
5. **Verify collisions & continuity**: normalize IDs, place hierarchy, chronological names, nearby phonetic/semantic patterns, quest/story language, static validator and source family; no implicit geography rewrite.
6. **Trace every concrete claim** in copy/asset brief to content/source or explicitly label provisional interpretation. No fabricated architecture, named characters, events, weather, danger, routes, resources, shops or local objects.
7. **Separate editor acceptance from generation**: user/editor approval promotes selected text to an authored-content implementation package; direct generated output is never auto-committed to JSON. Run schema/content lint and in-game knowledge/visibility checks on later authored change.
8. **Evaluate live rendering** on Area and Atlas independently, including concise prose, line length, image absence, contrast, narrow screens, alt descriptions, locales and whether player actions remain visible.
9. **Archive proposals** with disposition (accepted/rejected/held) to avoid reuse of rejected tropes. Revisit when source canon legitimately changes, not on every repaint of the UI.

### Proposed narrative quality checklist

- Distinct identity and plausible cause for the name; no implausible role/location.
- At least two specific world ties: geography plus economy, culture plus history, environment plus travel, etc., *both sourced*.
- No hidden/player-unknown facts revealed in the immediate scene.
- Does not reuse a dominant trope or formula already overrepresented among neighboring names.
- Layered voice: scene speaks as current situation; Codex as reference; Chronicle as factual retrospective.
- Real action outcome reports never masquerade as color narration; zero starter Echo/backstory boons not retconned as achievements.
- Correct source tier: approved name versus provisional copy; no generated content masquerading as authored canon.
- Works without a map image, NPC portrait, dynamically generated dialogue or rich audio.

## 8. Timing, non-goals and expected output

**Now / Area source prep (G1):** compile existing names, exact scene-fact dossiers, one grounded trial copy and visual asset brief, fallbacks and collision rules. **No actual new place/name needed** to implement named Current Area.

**During accepted Area UI (G2):** optionally approve **one** illustrative, non-authoritative image and one reviewed short description for a genuinely canonical starting place if it improves playability; compare to plain-text fallback.

**For first gather/playable content (G3):** authored resource scene/feature name only after source instance/site identity exists; avoid writing enticing harvest copy for a nonexistent source.

**For new NPC/service, clan and religion/world arcs (G4–G6):** one separate content authoring package per canonical owner, with names derived from actual in-world culture and source relationships. Do not pre-populate an imaginary town with twenty fantasy NPCs.

No universal language generator, town-name generator, LLM-produced persistent Chronicle, procedural backstory boon, canonized plot, local 2D coordinate fabricator or Site asset publication is authorized here. This is the **plan for making names and descriptions meaningful**, not a bulk naming output.
