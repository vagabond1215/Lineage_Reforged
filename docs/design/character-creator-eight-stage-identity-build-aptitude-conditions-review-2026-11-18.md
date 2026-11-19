# Character creator: eight-stage Identity, Build/Aptitude and elective Conditions review

Date: **2026-11-18 (America/New_York)**  
Authority: **Owner-selected latest standalone-preview UI direction.** This document preserves the design for later review, **not** authorization to implement gameplay, change Save schemas, activate new traits, or replace the current React creator.  
Inspected production baseline: `master` **bd61f780d7f33ab4b74ade7ea18bd4f9d6355d79**.  
Standalone preview reviewed: `lineage_creator_build_aptitude_preview.html`, SHA-256 **9995132b71fab9b2e3c1c7047cd92181b26ac05fbcefee3ea587c48e7b8487ab**. Its **exact interactive HTML source is preserved in the repo** as [docs/prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html) at archival commit **0b7c67ade6478f01d850ab1b9698f55a6dd39c32**. This is **documentation/prototype only**, not part of the production React build or a Save owner.  
Cross-thread decision inbox: [Issue #74](https://github.com/vagabond1215/Lineage_Reforged/issues/74), especially 2026-11-10 curated/expanded traits and 2026-11-11 world-entry blueprint. Previous [November 17 World Entry-first preview direction](character-creator-world-entry-prestige-supplies-portrait-integration-intent-2026-11-17.md), [grouped stats layout](character-creator-attribute-rail-three-group-visual-taxonomy-2026-11-17.md), [compact navigation](creator-compact-navigation-three-column-attributes-ten-lineages-2026-11-18.md), [source math](../../apps/rpg-ui/src/game-shell/characterCreationMath.ts), [current identity catalog](../../apps/rpg-ui/src/game-shell/characterCreationIdentityOptions.ts), and [30 shipped lineage traits](../../packages/content/base/player/traits.json) remain mandatory reconciliation sources.

## 1. Precedence and exact present status

- This November 18 record is the **latest owner-selected standalone creator layout direction** where earlier proposed seven-step, old Backstory, Starting Bundle, Focus or separately staged narrative patterns conflict. It does **not** supersede gameplay code, the active Codex prompt, first-World owner gates, actual Save integrity, or approved content eligibility.
- Current production React remains its existing **eight source stages**, including Backstory and Starting Bundle fields and validators. The standalone prototype's eight **visible** stages are a different, proposed presentation sequence. No silent deletion, blanking, automatic privilege or replacement of historical Backstory records/Saves.
- All new Build/Aptitude weighting, elective Conditions and the step-8 first-choice commit seam are **design candidates**. The prototype uses in-memory calculations and makes **no account, first-campaign, World, item, Prestige, trait or Save writes**.
- Preserve `L3B_BROWSER_CREATE_HELD`, `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION`. In particular, existing `CleanEpochFirstCampaignAdapter.prepare()` reserves retained attempt/Save capacity: never call it from a story preview or from a merely inspected first-choice tile.

## 2. Eight visible stages: unchanged current design order

1. **Lineage**: ten source playable ancestries (Human, Dwarf, Gnome, Halfling, Elf, Dark Elf, Half Troll, Half Orc, Half Goblin, Half Merfolk), appropriate lineage art and retained 90-point base.
2. **Identity**: first/last name, sex, four adult age bands, height, nine physical Builds, nine Aptitudes, optional narrative-only Disposition, separate negative and positive Conditions groups, lineage-valid skin/hair/eye colors, source-driven attribute guide, portrait prompt panel at bottom.
3. **Continent**: source-authorized macro geography, with no duplicate heading/subtitle above cards.
4. **Region**: dependent geography; revalidate on continent change.
5. **Settlement**: dependent locality; no invented site when fixture/owner is missing.
6. **World Entry**: eligible authored scenario and its circumstances, not an extra visible Backstory or Starting Bundle step. Ordinary Core editorial cards may be selected for review; Hardcore/wilderness and World-Stray/Prestige entries stay unselectable without source-backed authority.
7. **Summary**: formerly Finalize; consolidated named narrative, effective attributes, resources, selected World Entry, and explicit pending Legacy/gear/slot ownership.
8. **Opening**: authored World Entry narrative; the **first meaningful choice is intended to be the atomic character-creation submission and opening-circumstance choice** after authoritative validation. In the standalone HTML it records a reversible in-memory choice only. No real gameplay continuation, claim, item transfer or Save.

Keep separate primary TopBar and contextual ShellSubBar with breadcrumbs; left character summary retains Name, HP/MP/Stamina and nine attributes in three quiet **Power / Prowess / Mind** vertical bands, followed by numbered navigation. On mobile, rail summary may collapse without losing accessible identity or navigation. Remove redundant large stage headers/kickers/subtitles on all creator pages; stage name already lives in the rail. Keep the portrait and Generate prompt handoff inline **at the bottom of Identity** after colors and attribute guide, not beside the selectors.

The existing Power / Prowess / Mind grouping is **visual only**, not three new canonical attributes or Save fields. Current visual keys: Power STR/CON/VIT; Prowess DEX/AGI/CHA; Mind INT/WIS/SPT. CHA remains a social attribute despite its temporary visual Prowess placement. Issue #74's earlier Prowess/Acumen/Presence taxonomy is a historical proposal, not permission to reinterpret these later visual headings as engine categories.

## 3. Identity geometry, copy and controls

- Widen the main Identity content to a single full-width selection column with slim, **vertically written left-side labels** for Name, Sex, Age, Height, Build and Aptitude. Put concise, responsive **choice-specific narrative on the right**, with a clearly labeled actual source-derived delta underneath. Narratives may use safe first name, pronouns, lineage and selected age, and must not invent lore or claim unrealized mechanics.
- **Name** is inline with a required `firstName` and optional `lastName`, plus a **name-only dice**. Display the combined name in the sidebar, Summary, Opening and portrait prompt caption. The separate Identity randomizer changes eligible Identity fields, **not name, lineage, geography, World Entry or Save context**.
- **Sex** currently matches source: Male has no change, Female shifts **−1 STR / +1 AGI**, regardless of lineage. The owner accepted a *future* lineage-specific female shift matrix in Issue #74, but it was not installed in the checked master. Do not present its values as live.
- **Age** current zero-sum shifts: Young Adult +1 AGI/−1 WIS; Prime +1 STR/−1 AGI; Mature +1 WIS/−1 STR; Senior +1 WIS/−1 VIT. **Height**: Short +1 AGI/−1 STR, Normal 0, Tall +1 STR/−1 AGI. Descriptions should explain those specific choices in ordinary narrative prose, not frame measured intelligence as memorized knowledge or make unverified biological claims.
- **Build** appears as **3 × 3 compact buttons**, each showing a conditional calculated physical delta. It describes **appearance and physical Power-vs-Prowess distribution**, not illness, education, spiritual training or sexuality.
- **Aptitude** appears as **3 × 3 compact buttons**, each showing conditional actual generated Mind deltas and the fixed Physical/Mind split. It describes **natural ability**, not formal schooling or a previously earned profession. `INT` = reasoning, analysis and complex comprehension; `WIS` = judgment, perception and practical understanding; `SPT` = will, supernatural resonance and magical steadiness. Knowledge, skills, spells and specialized practice belong to validated history/world experience, not a made-up IQ or Focus score.
- The older **Focus** selector is removed from Identity. Historical training specialization belongs with **Prestige/eligibility-validated World Entry**, without reintroducing selectable Backstory as another page.
- Optional collapsed **Disposition** is portrayal-only (Not set, Curious, Gentle, Resolute, Reserved), influencing descriptive copy/portrait expression only. It is not a third hidden point allocator, moral alignment, compulsion or condition.
- Vertical section labels **Negative** and **Positive** flank two separately visible grids of small inspection tiles. A right-hand detail inspector shows name, narrative, intended effect, possible attribute relationship, owner/dependency, and conflict/stacking concern. On mobile the detail panel follows its tiles. These tiles are **inspect-only**: no selecting into character state, bonus, flaw credit, price, grant, Save or altered 90+10 arithmetic.
- Skin/Hair/Eye palettes follow Conditions. The standalone demo uses illustrative swatches and source-derived names; actual React must use the **lineage-valid** catalogs (18/27/18 per lineage) rather than pretend one global palette is authoritative.
- Summary should render one coherent sentence, e.g. “Aerin Vale is a short, lithe woman of Elf lineage in her prime, with an analytical aptitude.” It updates with the choices without asserting special training or an active condition.

## 4. Nine Build definitions (standalone balance candidate)

Build's `power` is the fraction used to divide **only the physical part** of the ten generated points; a 0-point physical aptitude still displays the selected frame without granting physical generated points. Power uses STR/CON/VIT; physical Prowess uses DEX/AGI. CHA is excluded from both physical weighting sets.

| Build | Appearance intent | Fraction to Power | Power STR/CON/VIT weights | Prowess DEX/AGI weights |
| --- | --- | ---: | --- | --- |
| Broad | Wide shoulders, substantial frame | 0.85 | 4/3/2 | 1/1 |
| Muscular | Defined muscle and force | 0.75 | 5/3/2 | 2/1 |
| Stocky | Dense grounded proportions | 0.70 | 2/4/3 | 1/1 |
| Compact | Close-built and economical | 0.55 | 1/3/2 | 2/3 |
| Proportioned | Even physical proportions | 0.50 | 2/2/2 | 2/2 |
| Lean | Light frame, moderate muscle | 0.45 | 1/2/2 | 3/2 |
| Slender | Narrow, lightly built | 0.35 | 1/1/1 | 4/3 |
| Wiry | Spare frame, taut muscle | 0.30 | 1/1/1 | 3/4 |
| Lithe | Light, supple frame | 0.20 | 1/1/1 | 4/5 |

Do not restore **Sickly** as a physique; it is an optional proposed negative Condition. **Frail** is likewise not an automatic physique. **Hardy** is better reviewed as a positive ability/trait, and **Sluggish** should not conflate body shape with disadvantage.

## 5. Nine Aptitudes and exact automatic distribution (standalone candidate)

| Aptitude | Physical points | Mind points | Mind INT/WIS/SPT weights | Natural inclination |
| --- | ---: | ---: | --- | --- |
| Fully Physical | 10 | 0 | 1/1/1 (unused) | Bodily aptitude only among generated points |
| Hands-On | 7 | 3 | 1/1/1 | Learns by doing |
| Instinctive | 6 | 4 | 1/4/2 | Quick situational judgment |
| Versatile | 5 | 5 | 1/1/1 | Even physical and mental starting tendencies |
| Inventive | 4 | 6 | 4/1/2 | Imaginative problem solving |
| Analytical | 3 | 7 | 5/2/1 | Pattern reasoning |
| Perceptive | 3 | 7 | 2/5/1 | Subtle observation and judgment |
| Strong-Willed | 3 | 7 | 1/2/5 | Resolve and channel stability |
| Fully Mind | 0 | 10 | 1/1/1 | Mind-only generated points |

**Algorithm used by the standalone HTML**, not current React math:
1. Start from each lineage's source-checked 90-point vector; apply current zero-sum sex/age/height differences. The source's existing Backstory shifts remain separate historical compatibility data, not a visible selector.
2. Read selected Aptitude's Physical + Mind totals, which always equal 10; the budget is **not manually assignable**.
3. Compute physical Power point count as `Math.round(aptitude.physical * build.power)`; remaining physical points go to Prowess.
4. Distribute each of those three budgets among its respective attribute weights by **largest remainders**, with stable original key-order tie break. Mind INT/WIS/SPT uses the chosen Aptitude weights.
5. Add all ten generated points to the nine base values. Do not use a second independent Summary/sidebar calculator, and do not let condition inspection alter any of these values.

**Verification in standalone:** 10 lineages × 9 Builds × 9 Aptitudes = **810 combinations**, all retain 90 base + 10 generated = 100. These tests verify arithmetic **in the preview only**. Partial resource projections use source-informed maxima deltas: HP +4 per CON/VIT above 10, MP +4 per INT/SPT above 10, Stamina +3 per AGI/CON/VIT above 10, with illustrative lineage origins; real runtime includes body/equipment/Legacy/World/active modifiers and may differ.

**Balance gaps requiring deliberate decision:** no generated point goes to CHA in this current candidate because neither physical weights nor Mind weights contain CHA; the project explicitly values meaningful CHA builds. Review this before approving a production formula. Also review Build/lineage interactions, strong aptitude extremes, attribute floors, actual authoritative resource parity, age/sex source policy, and whether display deltas should be relative to race baseline, direct inputs or previous selection. Do not silently “fix” these in shipped code.

## 6. Elective Conditions: purpose and catalog policy

A Condition is an optional **authored character trait profile**, not a current sickness/injury status and not the lineage's three inherited traits. Both negative and positive candidates may have **zero, one or multiple** primary-attribute deltas plus persistent or conditional gameplay channels. Source nature (congenital, inherited, learned habit, acquired, current status), ownership, applicability, permanence, treatment and compensation must be explicit. No fixed “one minus stat earns one point” rule is accepted. The original optional direct-attribute-spend design from Issue #74 is **not** enabled by the current auto-10-point Identity prototype.

Visible review-only selection is now **14 Negative + 14 Positive** rather than six each. The full **48-research-candidate** context lives in Issue #74: its 38-profile November 10 expansion plus ten later diet/values concepts. The additional Composed exemplar came from an earlier shortlist; thus the preview is a **curated UI review subset**, not a one-to-one publication of the 38.

### Negative Conditions: 14 visible research profiles

| Name | Distinct gameplay intent | Candidate stat relationship (not priced) | Owner/dependency / conflict |
| --- | --- | --- | --- |
| Sickly | Susceptible to *actual* illness, slower supported recovery; no automatic disease | Could be stat-free | TM-11; compare Quick Healer |
| Frail | Greater consequences from verified injury and impact, not body size | Possible VIT downside | TM-11; distinct from Sickly |
| Easily Winded | Sustained exertion consumes more Stamina | Possible CON downside | TM-08; no double fatigue |
| Clumsy | Precision/tool errors in actual delicate actions | Possible DEX downside | TM-15; compare Deft, separate proficiency “Clumsy” |
| Unobservant | Less likely to notice real subtle cues | Possible WIS downside | TM-16; compare Keen-Eyed |
| Slow Study | More work to master legitimate complex study | INT relation or stat-free | TM-17; compare Quick Study, no lost knowledge |
| Underpowered | Greater burden in heavy force/lift maneuvers | Possible STR downside | TM-03; compare Mighty, distinct from grip |
| Weak Grip | Harder holds, hanging, disarm/retention | Possible STR/DEX downsides | TM-03; distinct from raw force |
| Stumbling | Worse footing and knockback recovery | Possible AGI downside | TM-02; compare Surefooted |
| Faltering | Genuine spell-channel interruption susceptibility | Possible SPT downside | TM-06; compare Attuned |
| Mana-Hungry | Higher real costs for eligible spell workings | SPT relation or stat-free | TM-06; cost vs mana-regen stacking |
| Awkward | More difficulty in first-contact rapport | CHA relation or stat-free | TM-05; not attractiveness or compelled dialogue |
| Hard Gainer | Slower real strength-growth conversion from meaningful training | May be stat-free | TM-09/TM-10; compare Hard Worker |
| Gullible | Vulnerability in supported deception/offer judgment | May be stat-free | TM-05; player always chooses response |

### Positive Conditions / Boons: 14 visible research profiles

| Name | Distinct gameplay intent | Candidate stat relationship (not priced) | Owner/dependency / conflict |
| --- | --- | --- | --- |
| Quick Healer | Better healing after real injury and care | VIT relation or stat-free | TM-07/TM-11; lineage and Sickly stacking |
| Surefooted | More reliable balance and footing | AGI relation or stat-free | TM-02; compare Stumbling |
| Keen-Eyed | Better legitimate subtle-cue detection | WIS relation | TM-16; lineage Keen Senses overlap |
| Vigorous | Stronger actual exertion/stamina recovery economy | CON relation or stat-free | TM-07; lineage stamina overlap |
| Composed | More resilient under actual pressure | Stat-free possible | TM-05; no forced temperament |
| Mighty | Enhanced validated bodily force | Possible paid STR benefit | TM-03; compare Underpowered |
| Deft | Finer control of tools and delicate actions | Possible DEX benefit | TM-15; compare Clumsy |
| Fleetfooted | Better pursuit and repositioning economy | AGI relation or stat-free | TM-02; distinct from footing |
| Softstep | Less actual movement noise | Stat-free possible | TM-04; Halfling Quiet Step overlap |
| Silver-Tongued | Better negotiation and persuasion in real contests | CHA relation or stat-free | TM-05; no guaranteed NPC compliance |
| Attuned | Greater magic/channel stability | SPT relation | TM-06; no free spells, compare Faltering |
| Wellspring | Bounded genuine MP recovery | Stat-free possible | TM-07; mana/lineage stacking |
| Quick Study | Faster actual complex learning through study | INT relation or stat-free | TM-17; compare Slow Study |
| Hard Worker | Better recovery-gated conversion of meaningful strength training | Stat-free possible | TM-09/TM-10; no grind, compare Hard Gainer |

Not yet displayed but retained as research: **Negative** Unsteady, Lumbering, Anemic, Unconvincing, Slow Metabolism; **Positive** Deadeye, Guarded, Elusive, Steadfast, Spellwise, Iron Stomach. Later **Diet/Values** ten include No Shellfish, High Protein, Plain Fare, Picky, Materialistic, Thrifty, Generous, Covetous, Fair Dealer, Lavish. These are not silently discarded; refer to Issue #74 for their fuller descriptions and TM-18–TM-22 dependencies. Names may require editorial refinement.

### Before any condition becomes selectable, purchasable or randomized

- A typed, versioned creator-trait source, persistence ID and owner must exist separately from the 30 lineage-granted traits and temporary active statuses.
- Author exact **positive costs / negative credits**, each trait's mixed +/− vector, frequency, stacking, caps, treatment and conflict rules; protect against buy-and-cancel arbitrage or buying back a penalty for free. A stat-free drawback must have a real, ordinarily encountered downside before earning credits.
- Verify each required combat, social, movement, knowledge, health/disease, nutrition, magic or recovery **TM** hook end-to-end. Narrative data or a shared trait modifier channel alone is not proof of effect execution.
- Do not invent disease, NPC assent, hidden knowledge, injuries, food ingredients, property, training or spells. No forced personality, gender/lineage disadvantage or irreversible cap from a label.
- Enforce founder/heir source invariants, legal selected scenario, old-physique ID compatibility (`frail`, `sickly`, `sluggish`), lineage traits, conflict resolution, exact-once application, Save/restart readback and sourced stat/resource parity.
- Until then, tiles are **inspection only** and Summary must continue to say Conditions are unavailable.

## 7. World Entry and the first-choice transaction

**Backstories stay out of visible creator navigation.** Existing 27 Backstory records can remain source data with attributes/skills or narrative predicates as the future World Entry schema is reconciled, but they must not be re-added as a separate screen. Prestige histories such as World-Stray are gated by real entitlement, mode, source site, story graph and account evidence. Do not turn every historical Backstory into an ordinary Core start or invent a career/property guarantee.

Step 6 chooses an eligible proposed World Entry; step 7 Summary reviews; step 8 tells its actual opening narrative and presents the first meaningful choice. Only after a future authoritative complete-draft validator and actual World, actor, scene, item and Save owners exist may that decision serve as an **atomic one-time character + entry-circumstance publication**. Preserve return-to-Summary, clear previous choice when earlier identity/lineage/locale/entry changes, and prohibit double attempt or rerolls of committed scenes. The offline preview records a local choice but never calls `prepare`, `start` or `resume`.

## 8. Test evidence and next authorized work

Reviewed standalone HTML: inline-script syntax pass; condition panels contain 14 inspect-only negative and 14 inspect-only positive records; inspector changes do not affect the 100-point total. **810/810** lineage × Build × Aptitude combinations retain 90+10. Headless Chromium checks at **1280, 768, 375 and 320 CSS pixels** covered both condition groups, inspecting non-default Weak Grip/Wellspring, unchanged stat math, eight-stage render smoke, no JavaScript errors and no horizontal document overflow. QA does **not** certify production assets, comprehensive runtime mechanics, accessibility audit, actual World/Create/Save, condition effect execution or published gameplay.

Recommended **separate future source gates**, only on fresh synchronized exact master and independent owner authorization: (1) approve attribute/CHA and sex/age balance; (2) approve condition roster, real runtime mechanics and individual cost/credit economy; (3) versioned creator inputs and old-Save compatibility; (4) feature-gated React visual UI with validated sources; (5) World Entry scenario/site and exact-once first-choice publication; (6) keyboard/a11y, owner-matched preview/Save, 320/375/768/1280 browser and restart regression. Never modify the active Codex prompt or activate a held World route just to match this standalone design.

## 9. Cross-thread reading order

1. **This file** for the latest eight-stage Identity layout, nine/nine auto-allocation, 28-condition preview shortlist, copy posture and integration holds; and the [exact archived HTML prototype](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html) for the fully reconstructible styling, behavior, option text and selectors.
2. [Issue #74](https://github.com/vagabond1215/Lineage_Reforged/issues/74) for full 48-candidate research, previous alternatives and dated acceptance/supersession chain.
3. [November 17 World Entry-first intent](character-creator-world-entry-prestige-supplies-portrait-integration-intent-2026-11-17.md), [Core World Entry source contract](core-world-entry-scenario-contract-and-editorial-seed-2026-11-09.md), [eight Core UI candidate](core-world-entry-eight-branching-profiles-ui-candidate-2026-11-18.md).
4. Actual `characterCreationForm.ts`, `characterCreationIdentityOptions.ts`, `characterCreationMath.ts`, `newGameSnapshot.ts`, `player-resources.ts`, account/World/Save owners and current active Codex prompt to determine what is implemented **today**.

**No gameplay, schema, legacy Save, lineage trait catalog, active prompt, World source or production React change is authorized by this documentation.**

## 10. November 18 follow-up: resource bars and attribute detail toggle

**Status:** Owner-directed standalone creator UI refinement, not production mechanics or Save activation. Exact HTML source remains archived in [the creator prototype](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html), updated at [commit a7001bba](https://github.com/vagabond1215/Lineage_Reforged/commit/a7001bba6222e55057a5ae4d0c8777dfb6074a40), with strict repo readback matching the exported preview.

- Sidebar comparative resource bars are **50% taller**, from 7px to **10.5px**, and presented on one row as **left label / center bar / right numeric value**. Labels become **HP, MP, ST**. ST abbreviates Stamina only for the rail label; the underlying resource key remains stamina. The preview's comparative, non-current/max values are unchanged.
- A **Show details** eye button appears in the contextual ShellSubBar next to the crumbs. It starts off (`aria-pressed=false`) and reveals only the automatic attribute allocations **inside all nine Build and nine Aptitude tiles**. When activated it reads **Hide details** (`aria-pressed=true`); clicking again hides the annotations. The selected option, right-hand narrative and current-choice effect text remain visible either way.
- Tile text drops the **Physical:** and **Mind:** prefixes and inter-attribute bullet separators. Expanded annotations are compact space-separated +N ATTR tokens (or **No generated points** where applicable). Display toggling does not modify attributes, generated point totals, Conditions, character state, narrative, World Entry or Save. The flag is transient UI state, not a saved character fact.
- Isolated Chromium checks passed at **1280, 1024, 768, 375 and 320** pixels for exactly 10.5px bars, proper label/bar/value alignment, 18 tile annotations on and zero off, unchanged nine attribute values, navigable Lineage and Identity stages, no JavaScript errors and no horizontal overflow.

**Integration gate:** Keep the independent TopBar and ShellSubBar, actual source-derived resources, and the current World/Save publication holds. This recorded preview behavior does not authorize runtime integration.

## 11. November 18 follow-up: direct modifier tile details, Apex Aptitude names and Disposition removal

**Latest owner-directed standalone creator visual revision.** Exact source archived in [the current HTML prototype](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html), updated at [commit `94d14eb1`](https://github.com/vagabond1215/Lineage_Reforged/commit/94d14eb1a3c647602281ce3e721def3208f1632d). As before, this is not the production resolver, approved trait economy or runtime Save.

- The existing ShellSubBar **Show details / Hide details** eye now governs **all 27 selector buttons**: Sex (2), Age (4), Height (3), Build (9) and Aptitude (9). Sex, Age and Height show actual current zero-sum source shifts on each button with details enabled, e.g. Female `+1 AGI −1 STR`, Senior `+1 WIS −1 VIT`, Normal height `No stat change`. This is the same disclosure behavior as the Build/Aptitude generated bonus annotations. Off mode removes only tile details and preserves the right-hand narrative/selected-choice effect text and character math. Show details remains initially off.
- The duplicated visual hairline and blank space between **Name** and **Sex** are removed. Name has no bottom border; the Sex row supplies the single horizontal divider with no separate empty spacer.
- The three Aptitude **presentation labels** change without modifying their stable prototype IDs, allocations or weight vectors: `fully_physical` **Fully Physical → Brawn-Driven** (10 Physical / 0 Mind, favors exertion and action rather than abstract study); `hands_on` **Hands-On → Action-Oriented** (7 Physical / 3 Mind, describes physical priority rather than a learning technique); `fully_mind` **Fully Mind → Savant** (0 Physical / 10 Mind, unusual natural capacity, not automatically acquired schooling, skills or spells). All explanatory/summary/portrait copy uses the new meaning. These descriptions do **not** impose a lifelong learning disability or class restriction.
- **Disposition is removed entirely** from visible Identity controls, mutable draft state, randomization and the portrait prompt. No hidden disposition bias or narrative personality is injected. Optional future characterization may be reconsidered separately.
- The original eight-stage visual flow, split first/last name, 9×9 Build/Aptitude candidate allocation, separate inspect-only Conditions, 90 lineage-and-identity base + 10 automatically generated points, portrait at bottom, World Entry, Summary and Opening remain unchanged.
- **Browser validation:** the inline script passes syntax check; Chromium at **1280/1024/768/375/320** px confirms 27 tile adjustments when on, zero when off, correct Female/Senior/Normal details, unchanged attributes on toggling, a single Name→Sex border, no Disposition, nine Aptitude labels, eight stages, 10 Lineage choices, no JS errors or horizontal overflow. All **810/810** lineage × Build × Aptitude combinations still yield 90 base + exactly 10 generated points.

**Runtime and compatibility holds persist:** These are standalone-copy and visual changes only; no production React/trait schema/Save or current source point resolver changes. Preserve the above named-ID compatibility through any later authorized implementation.

## 12. November 18 follow-up: compact uniform Identity selection tiles

**Latest owner-selected preview refinement.** No production mechanics, option IDs or Save changes. The [archived interactive prototype](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html) was updated at [commit `f089d004`](https://github.com/vagabond1215/Lineage_Reforged/commit/f089d004d01f08cc7ac4073a931576339e373c59).

- **Build and Aptitude:** both 3×3 selector grids use **52px** tile height on desktop and tablet, down from **69px** (~25%).
- **Sex, Age and Height:** their 2/4/3 buttons now match the Build and Aptitude tile height at **52px** (previously 44px). All five groups share one CSS size token to prevent later drift.
- **Small screens ≤550px:** all five groups use matching **51px** button height, down from the previous **68px** Build/Aptitude mobile minimum (25% reduction). Typography, padding and gap tightened while retaining option names and Show details numbers.
- The Show details eye remains purely presentational, and all numeric attribute effects, 90 + 10 derivation, Conditions inspector, 8-stage navigation and character state are unchanged.
- **Browser proof:** isolated Chromium at 1280, 768, 375 and 320px in both Show details states measured identical actual tile heights across all 27 Sex/Age/Height/Build/Aptitude controls; none had measured internal text clipping; no horizontal overflow or JavaScript page errors. This does not claim production acceptance.

**Boundary:** This adjustment applies to the isolated HTML prototype and the documented visual contract, not the running RPG UI, World Entry, first Save or published gameplay.

## 12. November 18 follow-up: lineage-aware vertical Skin/Hair/Eyes color rows

**Latest owner-directed standalone Identity palette revision.** The exact reviewed HTML has been archived at [docs/prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html), commit [36ef18b1](https://github.com/vagabond1215/Lineage_Reforged/commit/36ef18b1dfa3d8976045dfa3aec71f0872d28726). This is an in-memory prototype and a proposal for color-catalog expansion, **not** production artwork, legal form IDs, native Save/persistence or a changed game creator.

- Replace three horizontal Skin/Hair/Eyes field labels with the same narrow **vertical left-gutter labels** used by Identity/Conditions. The swatches are in one aligned form panel, with the selected color's authored name in a quiet header; every swatch has its own descriptive title, `aria-label` and `aria-pressed` selection indication.
- Use the **selected lineage's actual catalog** rather than a universal human-color sample. The source seed and expansion in `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` contain **18 skin, 27 hair, 18 eye** label/hex pairs per lineage (Human, Dwarf, Gnome, Halfling, Elf, Dark Elf, Half Troll, Half Orc, Half Goblin, Half Merfolk). The standalone fixture copies **label and swatch hex only**, not source IDs, full descriptive text or any legal Save-valid projection. For production, always query `getLineageIdentityCatalog(lineageId)` and preserve its IDs, legality, ordering and validation.
- On wide desktop, Skin is **one full row of 18**. Hair and Eyes each show **two full rows of 14** for 28 visible colors apiece. This includes exactly **one review-only new hair concept** and **ten review-only new eye concepts per lineage**, explicitly flagged with dashed borders/diamond marks and an `unapproved design concept` title/inspector notice. They are not silently represented as live selectable source IDs.
- Source colors and proposed review accents are **sorted by color family and hue**, with skin sorted broadly light-to-deep; named examples include Ruby, Emerald, Sapphire, Topaz, Copper, Silver, Gold, Slate, Cobalt, Sage and Periwinkle, filtered to the lineage's authored or proposed palette. Avoid universal gemstone color allocation to every race, unsupported lore claims or synthetic permanent Save IDs. Several named colors occur in actual source only for certain lineages; **Periwinkle** is a proposed expansion, not an existing production record.
- Tablet and mobile gracefully wrap to additional rows: at 768px, Skin 2 and Hair/Eyes 3; at 375px, Skin 2 and Hair/Eyes 4; at 320px, Skin 3 and Hair/Eyes 5. The compact row count requirement is desktop-specific; never force swatches to shrink to unusable touch targets or produce horizontal page overflow on phones.
- Switching Lineage resets all three selections to valid **source** colors; the separate Identity randomizer draws only source colors, not unapproved concepts. A user may inspect/select a marked preview concept without granting a source-legitimate cosmetic ID or modifying primary stats; the page warns visibly while it is selected. The prompt-only portrait handoff now includes the selected actual color **names**; changing lineage or a color invalidates any temporary illustrative portrait state.
- Isolated Chromium passed at **1440, 1280, 1024, 768, 375 and 320** CSS pixels: all **10 × (18 skin + 28 hair + 28 eyes)** swatches rendered; wide 1/2/2 rows; 10 source-only eye + 1 hair proposal per lineage flagged; swatch click, concept notice, source-only randomizer, ancestry switching, unchanged 100-point stats, correct vertical labels, no JavaScript errors or horizontal overflow. Inline JS syntax check passed. These are **prototype checks**, not actual engine, React, browser-asset, portrait generation or Save acceptance.

**Authorization boundary:** This documentation does not approve the 110 additional concept color options, change canonical color IDs, change production palettes, or authorize world/game publication. A separately reviewed catalog/content/Save migration must precede any real implementation.

## 13. November 18 follow-up: three-row Hair/Eyes and full source geography audit

**Owner-selected standalone preview refinement, design/catalog audit only.** The reviewed interactive HTML is preserved in [docs/prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html), updated at [commit `a09fc8c5`](https://github.com/vagabond1215/Lineage_Reforged/commit/a09fc8c56989cf0f57ca68036cd567352a0e8ab3). This is **not a canonical color-content revision, source region ID migration, authorized spawn, or production React/Save change**.

### Color rows

- Keep the narrow vertical Skin / Hair / Eyes labels and one 18-swatch desktop Skin row. **Hair and Eyes each expand from 28 to 42 swatches**, filling **three desktop rows of 14** instead of two. Colors remain sorted by family/hue, with selected names, accessible per-swatch names and marked selection states. The actual source palette remains **18 skin / 27 hair / 18 eyes per lineage** in `getLineageIdentityCatalog(lineageId)`.
- The standalone prototype retains all legal source label/hex pairs. Each lineage now has **15 preview-only Hair concepts** (one older plus fourteen new) and **24 preview-only Eye concepts** (ten older plus fourteen new). This amounts to **14 additional Hair + 14 additional Eye concepts in each of the ten lineage panels**, not globally approved options. New concepts include lineage-appropriate treatments of minerals, metals, gemstones and muted colors, such as Ruby, Emerald, Topaz, Sapphire, Jade, Copper, Gold, Silver, Cobalt, Sage, Slate and Periwinkle. Every proposed swatch remains marked visually and announced as unapproved; the Identity randomizer continues to select only original source colors.
- Responsive behavior deliberately wraps on smaller viewports rather than preserving three rows at unusable sizes. Chromium measured **Skin/Hair/Eyes rows**: 1440/1280/1024 = **1/3/3**, 768 = **2/5/5**, 375 = **2/6/6**, 320 = **3/7/7**, with no horizontal document overflow or JS errors. Selecting a concept does not change primary stats, skill ownership or the ability to Save.

### Geography completeness and correction

Source-backed inputs inspected: `packages/content/base/world/regions.json` (blob `04516952ad97d830d2f49d915137197947e22b3a`), `packages/content/base/world/settlements.json` (blob `7e00f4243e96909e161ec09a2e8a4c3395f89216`), and `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts` for source ownership/entry limitations.

| Inventory | Actual catalog | Previous standalone preview | Updated standalone preview |
| --- | ---: | ---: | ---: |
| Top-level continents and island systems | 9 | 9 | 9 |
| Nested subregions | 28 | 28 | 28 |
| Catalog settlements | 88 | **4** (only 2 populated subregions) | **88** (all 28 subregions) |
| Ocean entries | 4 | 0 | 0 (intentionally excluded from starting landmass choices) |

- The former preview `geoKnown` contained only **Starfall Isle** (Starfall Port, Harbormast Quay, Foammarket Ferry) and **The Sapphire Rivers** (Highcrown). The remaining **84** authored settlements were absent from the preview. All 84 have now been added beneath their proper, source-verified subregions.
- Exact generated preview region-to-settlement map was compared against all **28** source subregions and their **88** `settlements.json` records. The comparison returned **0 missing, 0 extra, 0 name/order or parent mismatches**. Example: **The Sapphire Rivers** now lists Highcrown, Blueflow, Ledgerford, Kingsbridge and Bridgewatch Ferry (5); **Verdant Thalos** now lists Aurelis, Vinecross, Oliveford, Sunmeadow, Redcliff Quay and Caskbank Estate (6). Original nine macro and twenty-eight subregion names were already complete, so no additional macro/region definitions were invented.
- The standalone preview continues to store name-based geography state for illustration; it must **not** be treated as a source-valid `regionId`/`settlementId` payload. Production must obtain stable IDs, authored access, parent filtering and start eligibility from `worldSelectionCatalog.ts`, actual World selection and Save owners.
- UI settlement cards now state **Catalog settlement · start unverified**, with a visible caution that inventory is not proof of an accepted player spawn, scenario, actor, site, items or playable scene. Core World Entry selections in the standalone HTML remain editorial mock narratives and must not grant authenticated Save publication or gameplay.

### Focused QA and remaining gates

- Standalone inline JS syntax: **PASS**. Chromium `set_content` at **1440/1280/1024/768/375/320**: full 18/42/42 per-lineage swatches, proper column wrapping and vertical labels, source-only randomization, concept notice and unchanged attribute values; all **9/28/88** geography counts and per-region selector mapping; no detected JS page errors or horizontal overflow. These results validate prototype behavior only and do not constitute real React, engine, accessibility or Save acceptance.
- Before any implementation: review and approve individual proposed color IDs and lineage legality, validate full `getLineageIdentityCatalog` and source rendering, reconcile source geography IDs, confirm each World Entry start/site/scene and exact-once Save owner, and run real 320/375/768/1280 keyboard/a11y/World/Save regression. Keep all existing activation and publication holds.

## 14. November 19 continuation: complete expanded color palettes for all ten playable lineages

**Owner-requested standalone visual extension. Not canonical color content, an approved cosmetic migration, or runtime Save/publication authorization.** The exact interactive HTML now lives in [the archived creator prototype](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html), updated at [commit 416de634](https://github.com/vagabond1215/Lineage_Reforged/commit/416de634b5a9dbe4d173f97ecd1d370f0ec91316). All ten current playable lineage IDs in the runtime are represented explicitly, not replaced by a universal/shared palette.

**Per-lineage visible counts:** Skin **18**, Hair **56** (four desktop rows of 14), Eyes **56** (four desktop rows of 14). The current **source-approved** catalog remains **18 skin / 27 hair / 18 eyes per lineage**. The prior preview had 42 Hair / 42 Eyes: this revision adds **14 new Hair and 14 new Eye review-only variants per lineage**, i.e., **140 additional Hair and 140 additional Eye concepts** across the ten lineages. Every source record (label, hex and source/concept marking) from the previous preview is retained without modification; each newly proposed swatch is marked as an **unapproved design concept**, not a legitimate Save color ID.

### Racial variety examples

| Lineage | Examples among the 14 newly added Hair shades | Examples among the 14 newly added Eye shades |
| --- | --- | --- |
| Human | Sable Brown, Sunlit Copper, Ashwood, Antique Gold | Fire Opal, Honey Topaz, Saffron Gold, Rhodolite |
| Dwarf | Ruddy Copper, Furnace Ember, Oak Bronze, Burnished Brass | Furnace Ember, Amberglass, Runic Gold, Bloodstone |
| Gnome | Pearl Coral, Amberglass, Saffron Gold, Rhodolite | Burnished Brass, Rhodolite, Rose Garnet, Mint Jade |
| Halfling | Sable Brown, Sunlit Copper, Ashwood, Oak Bronze | Sunlit Copper, Honey Topaz, Saffron Gold, Pearl Rose |
| Elf | Saffron Gold, Pearl Rose, Mint Jade, Emerald Mist | Fire Opal, Amberglass, Honey Topaz, Deep Ruby |
| Dark Elf | Copper Ember, Garnet Wine, Deep Ruby, Deep Jade | Copper Ember, Garnet Wine, Bloodstone, Deep Ruby |
| Half Troll | River Clay, Barkstone, Bog Amber, Iron Moss | River Clay, Copper Ember, Barkstone, Lichen Green |
| Half Orc | Ember Garnet, Furnace Ember, Sundown Bronze, Oak Bronze | Ember Garnet, Furnace Ember, Sundown Bronze, Bloodstone |
| Half Goblin | Ember Garnet, Ruddy Copper, Gold Fleck, Rhodolite | Gold Fleck, Rhodolite, Bloodstone, Scrap Brass |
| Half Merfolk | Pearl Coral, Coral Garnet, Kelp Green, Mint Jade | Sun Coral, Pearl Rose, Coral Garnet, Kelp Green |

**Color-family behavior:** Preserve lineage character (Human neutral/warm and occasional rare gems; Dwarf iron, ore, forge bronze and mineral colors; Gnome bright prismatic colors; Halfling natural and subdued tones; Elf jewel, leaf and moon shades; Dark Elf obsidian and twilight jewel colors; Half Troll marsh, stone, moss and river shades; Half Orc iron, bronze and ember shades; Half Goblin scrap metals and vivid greens; Half Merfolk pearl, reef, lagoon and ocean shades). The actual named colors in each source-backed set and new concepts are sorted by visual family/hue, with existing accessible names, selected state and a visible concept warning. Color examples are **editorial visual direction**, not lore claims that a race cannot have a particular eye or hair color.

**Selection and validation:** Switching ancestry resets to lineage-valid **source** colors; the Identity randomizer chooses only those original source colors. Explicit inspection of a concept is allowed in standalone preview but neither grants a legal color ID nor changes stats. Name, Build, Aptitude, Conditions, World Entry and the eight-stage creator route are unchanged. The source-valid production owner continues to be `getLineageIdentityCatalog(lineageId)`, not the indexed in-memory HTML fixture.

**QA:** Source preservation audit for all ten lineages confirmed all existing 18/27/18 source colors and all prior preview concepts remain present, no duplicated labels within a lineage and exact new 14/14 concept increments. Headless Chromium at **1440, 1280, 1024, 768, 375, 320** px, with **all ten lineages checked at 1280 and 375**: counts 18/56/56, desktop 1/4/4 rows, vertical labels, concept warning, source-only randomizer, unchanged 100-point attributes, still 9/28/88 geography, eight nav steps, no detected JS errors or horizontal overflow. Narrow viewports wrap into more rows rather than shrinking swatches into inaccessible targets. This is isolated prototype QA and **not a production React/assets/browser/Save acceptance test**.

**Hold:** Do not copy the concept colors into canonical identity form IDs or publish World Entry. Their actual content IDs, individual lineage legality, accessibility at 200% zoom, persistence and appearance asset generation require a separately authorized source migration.

## 15. November 19 continuation: diagonal palette sorting, equal spacing and two Skin rows

**Owner-directed UI design continuation only.** Exact standalone HTML archived at [docs/prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html](../prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html), commit [`55cd389d`](https://github.com/vagabond1215/Lineage_Reforged/commit/55cd389d2028dfdf8c8317cdd5fc18982343ff8c). Local conversation artifact: `lineage_creator_diagonal_palette_2026-11-19.html`, SHA-256 `4c12c4036f451d38ccc6433d12a131a70da73e4eeea448b32b145978bb24c7c0`. This is a reviewable prototype, not canonical palette content or a Save/runtime modification.

- **Color flow is now column-major across color families**: the sorted sequence begins at the upper-left, continues downward within each column, and progresses across columns toward the lower-right. Unlike the previous row-major layout, it does not complete one entire row before restarting at the far left of the next row. Skin is sorted broadly light to deep, while Hair and Eyes are grouped by hue and neutral value. The CSS uses `grid-auto-flow:column` with a fixed number of responsive grid rows; the logical DOM/tab order follows the visible flow.
- **Actual swatch spacing is equal in both axes**: desktop circles 31px wide/high with `gap:8px` horizontally and vertically; phone circles 26px with `gap:7px` both ways. Fixed-size grid cells remove the former large extra whitespace caused by `repeat(..., 1fr)` and `justify-items:center`. The wider 21-column desktop presentation uses most of the color region without artificially stretching the swatches.
- **Full desktop rows per selected lineage**: Skin expands **18 → 42** selections (**two rows of 21**); Hair expands **56 → 84** (**four rows of 21**); Eyes expands **56 → 84** (**four rows of 21**). Every source-approved entry remains intact, and the previous review-only variants are also retained. Added since the previous prototype: **24 Skin + 28 Hair + 28 Eye** review concepts *per lineage*, all visibly marked as design concepts. Over all ten lineages that is 800 new preview candidates (240/280/280); **none is a newly approved production color ID**. The source catalog still authorizes **18 Skin / 27 Hair / 18 Eye** per lineage.
- Additional candidate hues are derived as distinguishable lightness/undertone shifts of each lineage's existing color spectrum, so Human, Dwarf, Gnome, Halfling, Elf, Dark Elf, Half Troll, Half Orc, Half Goblin and Half Merfolk retain their own palettes. Concept names are mock editorial color names, not a declaration of lineage physiology, rarity or Save legality. The color picker and portrait prompt report the chosen name; randomization continues to choose only source colors.
- **Responsive rows adapt rather than clipping:** at 1440 and 1280 CSS px, Skin/Hair/Eyes = **2/4/4** and 21 columns in each group; at 1024 = **3/6/6**; 768 = **4/8/8**; 700 = **5/10/10**; 550/375 = **6/12/12**; 320 = **7/14/14**. Swatch spacing remains equal in both axes at all tested sizes.
- **QA:** extracted JavaScript syntax check passed. Isolated Chromium at 1440/1280/1024/768/700/550/375/320 checked correct counts, precise equal spacing, column-major DOM placement, 100-point stat total, and no JavaScript errors or horizontal document overflow. A separate ten-lineage pass at 1280 and 375 confirmed **42/84/84 for each**, original **18/27/18 source counts**, selected source-color legality and stable stats. Selecting a proposed color displays its warning without affecting attributes; switching lineage returns to source colors. These are preview checks, not full keyboard/200%-zoom, actual React asset rendering, source-authorized color IDs, portrait generation, or Save acceptance.

**Do not merge concepts into live `getLineageIdentityCatalog`**, serialize preview array indices to `CharacterCreationFormState`, call the first-campaign owner, or lift any World Entry/Save publication hold on the strength of this palette preview. Separate source catalog, lineage legality and stable-ID approval is required.
