# Creator rail: three quiet attribute groups (design proposal)

Date: 2026-11-17, America/New_York  
Status: **Owner UX direction + reviewed standalone interaction / no production React implementation or game rule change**  
Source: current `apps/rpg-ui/src/game-shell/characterAttributes.ts` and the previous [World Entry + live rail design intent](character-creator-world-entry-prestige-supplies-portrait-integration-intent-2026-11-17.md), with `master` at `ac24faca8123325310e06bcf8876b3bb849edb46` before this documentation pass.

## Selected UI intent

The creator left-rail summary should read as **character name → HP/MP/Stamina → nine attributes**, all inside the same existing sidebar summary. Remove the literal **“Live stats”** title. Keep the values in **one vertical column, exactly nine small rows** in three groups of three. Small, muted vertical labels in the left margin and faint separators between groups are sufficient. Avoid a new heading, cards per stat, bright-colored badges, thick framed sections, large icons or another navigation layer.

| Proposed visual group | Source attributes | Group meaning and rationale |
| --- | --- | --- |
| **Power** | `STR` Strength · `CON` Constitution · `VIT` Vitality | Physical force, resistance/endurance and living recovery |
| **Prowess** | `DEX` Dexterity · `AGI` Agility · `CHA` Charisma | Fine motor accuracy, practiced movement and interpersonal/social finesse |
| **Mind** | `INT` Intelligence · `WIS` Wisdom · `SPT` Spirit | Understanding, insight and mana/spiritual will |

**Taxonomy is proposed visual organization only, not a canonical game-engine stat category.** The canonical attribute set and its tooltips already exist and must remain authoritative. `CHA` under Prowess is **provisional**, as Charisma has social/command effects rather than manual or athletic effects; the final category semantics should be explicitly reviewed if later used by builds, traits, affinity math, budgets, formulas or progression. Do **not** automatically add `Power/Prowess/Mind` as saved fields or multiply stats into aggregate scores because the layout groups them.

Keep each row legible in a rail roughly `18.48rem` wide: abbreviated key, low-contrast full attribute name, right-aligned tabular numeral. One CSS grid row per attribute. The group name may appear as a small vertical low-contrast gutter tag, not an interactive button. Use `aria-label` at the group section and `aria-label="Character attributes"` on the enclosing region. Never rely on a rotated label alone for screen readers. Suppress redundant tooltip/narration except on hover/focus.

When identity/profile controls change, update the **same nine source-derived preview values** and HP/MP/Stamina without creating a second calculator. The currently active stat ordering in `characterAttributes.ts` is `STR, DEX, AGI, CON, VIT, INT, WIS, SPT, CHA`; the new display order **reorders visual rendering only**, not the engine's canonical order, serialized records, stat allocation or trait source. The future Build/Profile panel may continue to use its own source order until explicitly redesigned.

**Responsive:** Desktop maintains the vertical, lightly grouped left sidebar. Below tablet breakpoint, the creator summary becomes the responsive rail-top card before step navigation, but the nine attributes still stay in a **single vertical column** (no 3×3 or 9-across compact-grid escape). Reduce vertical padding instead of shortening names out of existence. At 200% zoom preserve reading order and allow natural page scroll; don't create a nested mini-scrollbar solely for stats.

## Isolated preview evidence (not production acceptance)

The current conversation generated `lineage-character-creator-grouped-attributes-preview.html`, SHA-256 `81e5ba2848f3da9c7e3c24a069d463e844fb54221a5ebb71f3c9c7eb2b2a79d9`. It makes a **targeted change only** to the prior World Entry/portrait preview: removes `<summary>Live stats</summary>`, the `railStatGrid` 3×3 and mobile 9-column variants; replaces them with three semantic `railAttributeGroup` sections, 9 vertical rows, subtle vertical Power/Prowess/Mind tags, and fine horizontal dividers. Previous Identity random, Name dice, portrait Perchance handoff, World Entry cards and mock exports remain intact.

`node --check` on extracted client JavaScript: **PASS**. Isolated Chromium `page.set_content` at **1280×850 / 768×980 / 375×812 / 320×700: PASS** for three groups, 3 rows per group, strict single x-coordinate/strict increasing y-coordinate for all 9 stats, no old label, source preview reactivity to Identity randomizer, unchanged Name, no horizontal overflow and zero JS page errors. Screenshots `lineage-grouped-stats-rail-top-{1280,768,375,320}.png` are conversation artifacts, not committed gameplay screenshots. All mock stat numbers are illustrative.

**Source/runtime gates:** no actual React, Save, World, Backstory/Bundle migration, native-v3 model, artwork or PR #102 code changed. The previous production activation/World create and publication holds stay in effect. Next repo-capable source slice should move the real `buildCharacterCreationPreview`-derived stat/HP/MP/Stamina values into the grouped rail, preserve account source and old feature-off behavior, and verify React integration at 320/375/768/1280 plus keyboard/a11y before any deployment.
