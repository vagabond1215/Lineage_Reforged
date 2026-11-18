# Creator attribute totals and lower Identity guide: current source versus next Build design

Date: 2026-11-17 (America/New_York)  
Status: **SOURCE VERIFIED CURRENT CODE + OWNER UI DECISION / STANDALONE DESIGN PREVIEW, NOT PRODUCTION JSX**  
Inspected `master` at `4eee6681712535c9845224fe996f360fc29ecf12`. Prior UX: [Three quiet rail groups](character-creator-attribute-rail-three-group-visual-taxonomy-2026-11-17.md); [World Entry / identity / Build direction](character-creator-world-entry-prestige-supplies-portrait-integration-intent-2026-11-17.md); [future direct stat/trait allocator design](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md).

## 1. Verified current implementation and 90 + 10 question

**Answer: the total is 90 + 10 = 100 today; the 10 are *automatically generated*, not currently manually spent.** It is not a recent change to a manually allocated 10-point budget.

Source `apps/rpg-ui/src/game-shell/characterCreationMath.ts` has:
- `BASE_STAT_TOTAL = 90`
- `FINAL_STAT_TOTAL = 100`
- `GENERATED_PROFILE_POINTS = 10`
- `resolveCharacterCreationAttributes` first derives `baseAttributes` from **lineage**, sex, age, height and the **still-supported current Backstory adjustment**, and requires the sum to be 90.
- **Physique**, **Nature** and **Focus** create weight shares; `resolveGeneratedProfilePointDistribution` deterministically and integrally assigns exactly ten weighted profile points.
- Final values add generated points to the base and require a total of 100 with valid attribute floors.
- `tests/unit/character-creation-profile-resolver.test.mjs` checks every current Physique × Nature × Focus combination for `baseAttributes=90`, `generatedProfilePoints=10`, `finalAttributes=100`. These are real repository test assertions, not values invented for this UI.

`apps/rpg-ui/src/game-shell/characterCreationForm.ts` has **no editable per-attribute allocation/budget array field**. `characterAttributes.ts` contains pure `createEmptyCharacterAttributeAllocation`, `getAllocatedCharacterAttributePoints` and `applyCharacterAttributeAllocation` helpers, but these alone do **not** mean there is a player-facing manual allocator connected to the real form/Save. The live UI derives the values from chosen identity/profile options and Backstory.

**Different future design:** `welcome-world-library-character-entry-and-loading-plan-2026-11-11.md` proposes `TRAITS & ATTRIBUTES` with **direct allocation plus trait effects in one shared budget**. It does **not** define an accepted conversion of the existing auto-generated ten into a manual 10-point pool with exact trait costs, tradeoff constraints or eligible allocations. Source owner must approve this before a working +/- UI or trait ledger may spend points. A safe design starting assumption is **90 base + 10 discretionary profile points replacing, not stacking on, existing auto ten**, but this replacement/tradeoff rule is still a product/economy decision, not an implemented one. Trait bonuses must have independently validated source and no free double credit. The newest **World Entry replacing selectable Backstory/Starting Bundle** direction makes a versioned source compatibility/migration even more important: no hidden stat shifts from suppressing Backstory UI.

## 2. New lower Identity attributes layout

**Replace the prior lower Identity nine-across stat chips with the same quiet one-column layout as the creator left rail.** This is a secondary, more legible detailed readout, not a second allocation editor until engine contract is adopted. **Left side:** 9 vertically aligned abbreviated/full name/value rows, grouped three at a time. Exactly the same visual group order as the rail, vertical subdued group labels in gutter, hairline group separators and tabular values. **Right side:** a short group description and a one-line per-stat gameplay impact grounded in current source tooltips. No permanent paragraphs explaining why the player is in a creator.

| Visual group | Group summary (right) | Attribute | Short source-grounded impact |
| --- | --- | --- | --- |
| **Power** | Force, resilience and endurance | STR Strength | Melee force and carrying capacity |
| | | CON Constitution | Guard, resistance and survivability |
| | | VIT Vitality | Recovery, stamina and staying power |
| **Prowess** | Precision, movement and presence | DEX Dexterity | Accuracy, finesse and tool precision |
| | | AGI Agility | Evasion, speed and balance |
| | | CHA Charisma | Negotiation, command and social influence |
| **Mind** | Knowledge, insight and inner power | INT Intelligence | Spell control, crafting and MP support |
| | | WIS Wisdom | Healing, perception and resistance |
| | | SPT Spirit | Mana recovery, will and spell stability |

These summaries derive from `apps/rpg-ui/src/game-shell/characterAttributes.ts`, without claiming new formulas. The visual placement of CHA in **Prowess** remains **provisional**; it is social presence, not a physical-dexterity or player-power classification. Do not introduce summed group scores, new Save group fields, costs, formulas or canonical stat ordering. Rail and lower detail panel must use the **same single real resolver result**.

**Design tone:** single line `Attributes`; small upper right `90 base + 10 profile` and `automatically assigned` in live mode while appropriate. No “Live stats” or bulky Build explanation heading, no separate attribute tiles. Right description column is aligned to left Power/Prowess/Mind sections with matched thin separators; on desktop two columns, on phone stacked left nine rows then right explanation groups. Use semantic `<section>` and real group accessible names, good contrast for muted labels, keyboard/200% zoom, no horizontal overflow.

**Point-spend acceptance:** Until an approved trait/attribute budget owner exists, there is **no enabled Allocate or +/-**. In the current auto mode, display **90 + 10 automatically assigned** and optional per-source tooltip. In the approved future manual mode, replace caption with `10 points to assign` and a tested live remaining budget, plus approved trait consumption, without continuing to award the old ten automatically. Every change recalculates derived HP/MP/Stamina and is checked against the verified 100-point total and all game rule constraints.

## 3. Isolated browser preview and limits

The current conversation produced `lineage-identity-attribute-guide-preview.html` outside the source tree. On the **Identity** page only, the lower readout now mirrors the rail as one column (STR/CON/VIT, DEX/AGI/CHA, INT/WIS/SPT) beside the one-line group+attribute effects; the rest of launcher screens remain from the previous standalone UI. The prototype uses a **demonstration** deterministic distribution with 90 starting sample points, balanced age/height changes and ten profile-weighted points, so its 9 values now sum to 100; this is **not** the canonical `characterCreationMath` function nor the true actual source lineages/option lists. Identity Random changes that demonstration and keeps the name; the numbers match between its rail and lower panel.

`node --check` PASS for extracted inline script. System Chromium / Playwright `page.set_content` checks **1280×850, 768×980, 375×812, 320×700** PASS: nine strictly vertical aligned attribute rows in three groups, three explanation sections with 9 detailed rows, old 9-across grid absent for Identity, 90/+10/automatic note, no page JavaScript errors or horizontal overflow, profile randomization redraw, name unchanged and lower values exactly match rail. The demo is an **isolated HTML preview**; no app React build/renderer, real portrait Perchance link, source attribute test execution inside authenticated checkout, Save/World create, preview persistence, actual game UI routing, native-v3 migration or production runtime was changed or acceptance-tested here.

## 4. Repository implementation boundary

- QA-only first slice: replace **Identity lower display** from stat tiles to the grouped two-column explanation layout while retaining current existing player/portrait controls, and use the real `preview.attributeMetrics` + `characterCreationMath` and `CHARACTER_ATTRIBUTE_PRESENTATIONS` from current source. The optional left creator-rail grouping is a separate existing UI contract; keep live values synchronized from one preview.
- No trait/point spend controls until one accepted budget contract specifies whether ten points are now discretionary, and how trait costs and adjustments preserve the 100-point invariant.
- World Entry/Backstory migration and Save/first-publication remains held. Feature-off original eight-step creator is preserved. Any new World-bound design route requires independent runnable repository checkout, TypeScript/Vite/tests/Chromium, Playwright responsive/a11y and owner-verified Save data.
- No production TSX, game math, source assets, World or Save schema changed in this document pass.
