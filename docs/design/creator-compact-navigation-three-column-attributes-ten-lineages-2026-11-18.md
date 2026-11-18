# Creator UI: quiet navigation, synchronized three-column attribute descriptions, and 10 source lineages

Date: **2026-11-18** (America/New_York)  
Status: **Owner-selected standalone visual behavior and source review; PRODUCTION REACT CODE NOT_CHANGED**  
Inspected `master` at `f4db089d95f3cd62d8d95804706ca2a8f6a2b23d`, [previous 90 + 10 source and Identity explanation contract](character-creator-90-base-10-profile-attribute-guide-2026-11-17.md), [quiet left attribute groups](character-creator-attribute-rail-three-group-visual-taxonomy-2026-11-17.md), [current World Entry/portrait route](character-creator-world-entry-prestige-supplies-portrait-integration-intent-2026-11-17.md).  
Companion: [Creator-only weapon-affinity, handling and future combat design](creator-weapon-str-dex-agi-affinity-and-efficiency-intent-2026-11-18.md).  
External in-memory preview: `lineage-creator-clean-attribute-weapon-intent-preview.html` in the user's current conversation, not part of the repository. ZIP `lineage-creator-menu-and-weapon-affinity-review.zip`, SHA-256 `3f3156f9f3457d19806e0e273eb44472865316eaa62b55945761edfb925e59cd`; HTML SHA-256 `99cad1445e740cbbe91c879df3427bdc8c079955568d60463c922b8bf326063c`.

## 1. Remove redundant Creator active-area navigation

The existing numbered creator step rail and top `ShellSubBar` or equivalent contextual breadcrumb are the primary path controls. **No extra step counter `2 / 7` or `Step N` above the main form. No “← Characters” button in the content header, and no Back button in the content footer.** In the mock, `Welcome / Chronicle / Your Worlds / [World] / Characters / New Character` includes a **clickable Characters crumb**. The previous/other creator step is reachable through the numbered left nav. A single main **Next** action remains, and on Identity the centered **dice Random** remains between an empty left slot and the right-aligned Next. Do not remove the top app branding/account/world context or create navigation that bypasses form validation in the real owner.

This is creator UI scope only. Other launcher, World, story result, and in-game Back patterns are not changed.

## 2. Lean Identity attribute explanation block, aligned by band not separately positioned lists

Remove large **Attributes** heading; remove the visible `90 base + 10 profile` explainer and any free-standing `Preview values` or `Manual allocation planned` text from the main creator canvas. The existing 90 + automatically generated 10 = 100 contract remains true; hiding a sentence does not change the math. Tooltip/optional Help may expose it when requested.

**For each one of Power, Prowess, Mind render a single semantic band with three horizontal columns:**

1. **Attribute values:** very narrow vertical group title in gutter, three row labels and right-aligned numeric values as in the left rail. Reduce internal gap between abbreviation, name and value, without squashing the category name.
2. **Category narrative:** one readable, slightly literary sentence, vertically centered within its band; no heading or decorative separator within it.
3. **Individual impact:** exactly three same-height rows for each attribute and its concise game role.

Each band owns **one hairline border across its full width**. No independent borders or padding calculations that cause divider mismatch between the left, center, and right. On wide desktop target an apparently balanced three-column composition; when text needs space, let left values occupy **0.8fr**, center narrative **1fr**, and right effects **1.2fr** rather than truncating explanations. Use the same band height and row rhythm across all three components. In the isolated HTML, stat and effect rows have ~37px min-height. At smaller screen widths, stack values, narrative and effects in that order **within each group**, then one divider, rather than putting all nine values before all explanations.

| Group | Narrative | Canonical keys, concise source role |
| --- | --- | --- |
| **Power** | “Power is your ability to exert and withstand physical force. It governs physical impact, resilience and recovery.” | `STR` physical impact, lifting and bow-draw potential; `CON` guard, injury resistance and hardiness; `VIT` stamina, regeneration and endurance |
| **Prowess** | “Prowess is control in action: precise technique, agile movement and the presence to influence others.” | `DEX` accuracy/handling/fine technique; `AGI` tempo/evasion/balance; `CHA` command/negotiation/influence |
| **Mind** | “Mind is understanding and inner resolve: thought, perception and the strength to sustain magic.” | `INT` spell precision/knowledge/crafting; `WIS` healing/perception/judgment; `SPT` mana/resonance/willpower |

`CHA` in Prowess remains a **provisional visual membership**, not a physically skilled combat formula. The engine's canonical original order `STR DEX AGI CON VIT INT WIS SPT CHA` is unchanged. Visual grouping never creates new aggregate scores, allocations, Save properties or traits.

**STR wording correction:** current `characterAttributes.ts` presents `STR.compactMeaning` as “Melee damage, stagger force, carry weight, heavy-weapon pressure.” That understates the owner's intended physical role; the Creator-oriented copy should say **“Physical impact, lifting/carrying and bow draw strength”**, without falsely declaring a *currently implemented* bow damage scaling. Physical force is not restricted to melee: draw strength is relevant to bow requirements and potential output; accuracy/timing remain distinct. Implement any creator tooltip copy adjustment after reviewing current tests, but **defer ALL ranged/combat execution and damage logic** to its own owner and test route. Do not change `damage.melee` versus `damage.ranged` mechanically in this creator UI slice.

## 3. Expand Lineage chooser with actual present source, not invented options

`apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` `PLAYABLE_LINEAGE_IDS`, `LINEAGE_PRESENTATIONS`, and `LINEAGE_CARD_ART` confirm **10** currently allowed creator lineages. Render them all in the preview:

| Source ID | Current creator label | Current artwork pathname |
| --- | --- | --- |
| `lineage.human` | Human | `/character-creator/lineages/lineage-human.png` |
| `lineage.dwarf` | Dwarf | `/character-creator/lineages/lineage-dwarf.png` |
| `lineage.gnome` | Gnome | `/character-creator/lineages/lineage-gnome.png` |
| `lineage.halfling` | Halfling | `/character-creator/lineages/lineage-halfling.png` |
| `lineage.elf` | Elf | `/character-creator/lineages/lineage-elf.png` |
| `lineage.dark_elf` | Dark Elf | `/character-creator/lineages/lineage-dark-elf.png` |
| `lineage.half_troll` | Half Troll | `/character-creator/lineages/lineage-half-troll.png` |
| `lineage.half_orc` | Half Orc | `/character-creator/lineages/lineage-half-orc.png` |
| `lineage.half_goblin` | Half Goblin | `/character-creator/lineages/lineage-half-goblin.png` |
| `lineage.half_merfolk` | Half Merfolk | `/character-creator/lineages/lineage-half-merfolk.png` |

The original images continue under their unchanged pinned source `712982fbf72b158280df0ac89dc903d3b1832ab4`. The offline prototype uses an initial-letter fallback when GitHub image loads cannot complete; no portrait or ecology replacement was silently substituted. Source labels and **per-lineage base 90-stat profile** were copied into the isolated demo for comparison, but this is **not** the real `characterCreationMath` implementation: derived numbers, swatches, adult-age mapping and World eligibility in the HTML are illustrative, and production should use the actual catalog, validation and full `buildCharacterCreationPreview` result. Changing selected lineage in production must recheck dependent legal palettes/age ranges/special source, not blindly preserve invalid colors.

## 4. QA and implementation boundary

Isolated external prototype/test authored and executed in this conversation:

- `node --check` of extracted inline JavaScript: **PASS**.
- Playwright `page.set_content` Chromium 1280×850, 1024×768, 768×980, 375×812, 320×700: **PASS** for all 10 lineage cards and selection, 3 bands of 3 vertical values, 3 columns on desktop, aligned group hairlines, 9 effect rows, no old heading/paging/creator Back, clickable top Characters crumb, centered Identity Random and Next, live demo rail/detail sync, 100-point demo total, no horizontal document overflow or JavaScript page errors. This is **not** real app React/Vite/Save or combat validation.
- **No production code/TSX, combat, Save, item schema, world data, original image asset or PR #102 change** occurred here. No real user credentials or Saves touched. The existing first-campaign World/Save and publication holds continue.

**Repo-capable implementation route:** On a synchronized checkout, inspect exact latest source/PR and current prompt, then implement only the minimal current creator JSX/menu layout + descriptive text (content-only semantics) in `CharacterCreationNarrativeScreen.tsx` and `characterAttributes.ts`, preserving all existing real form/backstory/bundle validations, feature-off route and current Save/campaign action. Run focused creator unit/component tests, repo typecheck/build, keyboard+screen-reader checks and real Chromium at 320/375/768/1280; do not activate World Entry/Backstory/Bundle source migrations merely to match prototype navigation.

Design affects *Creator UI and descriptive copy only*, not the weapon/combat/ranged resolver; see [weapon affinity follow-up](creator-weapon-str-dex-agi-affinity-and-efficiency-intent-2026-11-18.md).
