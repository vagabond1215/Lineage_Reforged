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
