# Character Creator Lineage Sex Dimorphism Plan

## Status

Planning-only companion authority for `docs/design/character-creator-trait-and-portrait-system-plan.md`.

This document refines the biological-sex portion of the character-creator renovation. It records the current racial baselines, current male/female behavior, recommended lineage-specific sex modifiers, balance ceilings, lore implications, and implementation/test expectations.

This document does **not** authorize source edits, save-schema changes, content rewrites, generated-output updates, or test modifications by itself.

It exists on the dedicated `planning/character-creator-trait-system` branch so active implementation work on `master` remains untouched.

## Purpose

The existing creator already treats biological sex as a small starting-stat input, but the current implementation applies the same rule to every playable lineage:

~~~ts
male: {}
female: { STR: -1, AGI: +1 }
~~~

That rule is simple, but it does not actually model lineage biology.

The target system should instead make sexual dimorphism:

- explicit per lineage;
- zero-sum within each sex profile;
- small enough that sex never determines build viability;
- large enough to be legible against attributes centered around roughly 10;
- capable of being absent for lineages where meaningful physical dimorphism is not part of their biology;
- capable of being stronger or differently expressed for fantasy lineages whose biology warrants it;
- restricted primarily to physical attributes unless later lore establishes an unusually strong reason otherwise;
- compatible with the fixed six-trait / 10-profile-point renovation described in the parent plan.

## Current Repo Reality

The playable creator currently exposes ten lineages:

1. Human
2. Dwarf
3. Gnome
4. Halfling
5. Elf
6. Dark Elf
7. Half-Troll
8. Half-Orc
9. Half-Goblin
10. Half-Merfolk

The lineage card stat blocks are parsed into `LINEAGE_BASE_ATTRIBUTES` in:

- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`

The sex adjustment authority is exposed through `PlayerLineageProfileRecord.sexAttributeAdjustments` in:

- `packages/shared/types/src/player-origins.ts`

However, `createPlayableLineage(...)` currently assigns every playable lineage the same shared `NO_ATTRIBUTE_ADJUSTMENTS` record:

~~~ts
const NO_ATTRIBUTE_ADJUSTMENTS: Record<PlayerSexId, PlayerAttributeAdjustments> = {
  male: {},
  female: { AGI: 1, STR: -1 },
  neutral: {}
};
~~~

The name is therefore misleading: it contains a female adjustment and represents universal fallback behavior rather than true lineage-authored biology.

The creator also currently falls back to the Human lineage's sex adjustment if a requested lineage-specific record is absent.

That fallback should not survive the renovation. Missing biological authority should be a development error, not an invitation to silently make another species Human-shaped.

## Important Point-Total Clarification

The lineage stat arrays total **90**, not 100.

The current creator then generates exactly **10 profile points** through Physique / Nature / Focus, producing the 100-point starting character before later Legacy preparation effects.

The planned trait renovation preserves that architecture:

~~~text
90 points from lineage + direct creator modifiers
+ 10 generated trait/profile points
= 100 starting attributes
~~~

Sex modifiers therefore redistribute the 90-point pre-profile base. They should not change its total.

## Terminology For Dimorphism Magnitude

To avoid ambiguity, use three different quantities.

### Per-sex displacement

How far one sex moves away from the lineage midpoint.

Example:

~~~text
Human midpoint STR 10 / AGI 10
Male           STR 11 / AGI  9
Female         STR  9 / AGI 11
~~~

Each sex has a per-sex displacement of two absolute points:

- one point moved into one attribute;
- one point moved out of another.

### Inter-sex attribute gap

The difference between male and female on one attribute.

In the Human example:

- male STR 11 versus female STR 9 = 2-point STR gap;
- female AGI 11 versus male AGI 9 = 2-point AGI gap.

A one-point modifier per sex therefore creates a **two-point male/female difference** on that attribute.

### Total profile separation

The sum of absolute differences across all nine attributes.

For the Human example:

~~~text
|11 - 9| STR = 2
| 9 -11| AGI = 2
Total profile separation = 4
~~~

This terminology should be used in future balance discussion instead of saying only that a lineage has a "two-point difference."

## Current Racial Midpoints And Current Sex Results

Stat order in compact profiles:

~~~text
STR / DEX / AGI / CON / VIT / WIS / INT / SPT / CHA
~~~

Every racial midpoint below totals 90.

Because the current implementation leaves males unchanged and applies `STR -1 / AGI +1` only to females, the existing racial baseline is effectively also the current male baseline.

| Lineage | Racial midpoint / current male | Current female |
| --- | --- | --- |
| Human | 10 / 10 / 10 / 10 / 10 / 10 / 10 / 10 / 10 | 9 / 10 / 11 / 10 / 10 / 10 / 10 / 10 / 10 |
| Dwarf | 11 / 8 / 7 / 12 / 12 / 11 / 10 / 10 / 9 | 10 / 8 / 8 / 12 / 12 / 11 / 10 / 10 / 9 |
| Gnome | 6 / 11 / 11 / 9 / 9 / 10 / 13 / 11 / 10 | 5 / 11 / 12 / 9 / 9 / 10 / 13 / 11 / 10 |
| Halfling | 7 / 12 / 12 / 9 / 10 / 10 / 10 / 9 / 11 | 6 / 12 / 13 / 9 / 10 / 10 / 10 / 9 / 11 |
| Elf | 7 / 13 / 13 / 8 / 9 / 11 / 12 / 9 / 8 | 6 / 13 / 14 / 8 / 9 / 11 / 12 / 9 / 8 |
| Dark Elf | 6 / 13 / 13 / 8 / 9 / 10 / 12 / 10 / 9 | 5 / 13 / 14 / 8 / 9 / 10 / 12 / 10 / 9 |
| Half-Troll | 14 / 7 / 6 / 14 / 13 / 8 / 7 / 9 / 12 | 13 / 7 / 7 / 14 / 13 / 8 / 7 / 9 / 12 |
| Half-Orc | 13 / 9 / 9 / 12 / 11 / 9 / 9 / 10 / 8 | 12 / 9 / 10 / 12 / 11 / 9 / 9 / 10 / 8 |
| Half-Goblin | 8 / 13 / 13 / 9 / 9 / 9 / 11 / 8 / 10 | 7 / 13 / 14 / 9 / 9 / 9 / 11 / 8 / 10 |
| Half-Merfolk | 8 / 11 / 11 / 9 / 10 / 11 / 10 / 11 / 9 | 7 / 11 / 12 / 9 / 10 / 11 / 10 / 11 / 9 |

## Target Modeling Principle: Midpoint, Not Male Baseline

The lineage stat block should represent the **lineage midpoint**, not the male version of the lineage.

Both male and female profiles should derive from that midpoint.

Preferred conceptual rule:

~~~text
lineage midpoint
+ lineage-authored male or female zero-sum modifier
= sex-adjusted racial base
~~~

This gives the stat block a stable semantic meaning and prevents one sex from being treated as "default" while the other is treated as a modification.

## Recommended Dimorphism Tiers

### Tier 0: Mechanically monomorphic

Use when biological sex is visually or reproductively meaningful but does not produce a useful difference in the nine gameplay attributes.

Recommended profile separation:

~~~text
0
~~~

Current recommended Tier 0 lineages:

- Gnome
- Elf

### Tier 1: Moderate dimorphism

Use for most lineages with meaningful but non-dominant physical differences.

Typical per-sex displacement:

~~~text
2 absolute points
~~~

Typical pattern:

~~~text
+1 Attribute A
-1 Attribute B
~~~

Typical inter-sex gap:

~~~text
2 points on each affected attribute
~~~

Typical total profile separation:

~~~text
4
~~~

Current recommended Tier 1 lineages:

- Human
- Dwarf
- Halfling
- Dark Elf
- Half-Goblin
- Half-Merfolk

### Tier 2: Strong fantasy dimorphism

Reserve for lineages whose established physical biology makes a stronger distinction useful and believable.

Typical per-sex displacement:

~~~text
4 absolute points
~~~

Typical total profile separation:

~~~text
8
~~~

Current recommended Tier 2 lineages:

- Half-Troll
- Half-Orc

Tier 2 should remain uncommon. If most species become Tier 2, sex starts competing with the entire individual-trait system for control of the character.

## Recommended Lineage Sex Profiles

All modifiers below sum to zero.

| Lineage | Male modifier | Female modifier | Tier | Profile separation |
| --- | --- | --- | --- | ---: |
| Human | STR +1, AGI -1 | STR -1, AGI +1 | 1 | 4 |
| Dwarf | STR +1, VIT -1 | STR -1, VIT +1 | 1 | 4 |
| Gnome | none | none | 0 | 0 |
| Halfling | VIT +1, DEX -1 | VIT -1, DEX +1 | 1 | 4 |
| Elf | none | none | 0 | 0 |
| Dark Elf | DEX +1, CON -1 | DEX -1, CON +1 | 1 | 4 |
| Half-Troll | STR +2, CON -1, VIT -1 | STR -2, CON +1, VIT +1 | 2 | 8 |
| Half-Orc | STR +1, CON +1, DEX -1, AGI -1 | STR -1, CON -1, DEX +1, AGI +1 | 2 | 8 |
| Half-Goblin | AGI +1, CON -1 | AGI -1, CON +1 | 1 | 4 |
| Half-Merfolk | AGI +1, VIT -1 | AGI -1, VIT +1 | 1 | 4 |

## Recommended Resulting Sex-Adjusted Racial Bases

These are race + sex only.

They are **not** final characters and do not include:

- age;
- height;
- backstory;
- the future six-trait profile allocation;
- Legacy preparation;
- progression.

Stat order:

~~~text
STR / DEX / AGI / CON / VIT / WIS / INT / SPT / CHA
~~~

| Lineage | Recommended male | Recommended female |
| --- | --- | --- |
| Human | 11 / 10 / 9 / 10 / 10 / 10 / 10 / 10 / 10 | 9 / 10 / 11 / 10 / 10 / 10 / 10 / 10 / 10 |
| Dwarf | 12 / 8 / 7 / 12 / 11 / 11 / 10 / 10 / 9 | 10 / 8 / 7 / 12 / 13 / 11 / 10 / 10 / 9 |
| Gnome | 6 / 11 / 11 / 9 / 9 / 10 / 13 / 11 / 10 | 6 / 11 / 11 / 9 / 9 / 10 / 13 / 11 / 10 |
| Halfling | 7 / 11 / 12 / 9 / 11 / 10 / 10 / 9 / 11 | 7 / 13 / 12 / 9 / 9 / 10 / 10 / 9 / 11 |
| Elf | 7 / 13 / 13 / 8 / 9 / 11 / 12 / 9 / 8 | 7 / 13 / 13 / 8 / 9 / 11 / 12 / 9 / 8 |
| Dark Elf | 6 / 14 / 13 / 7 / 9 / 10 / 12 / 10 / 9 | 6 / 12 / 13 / 9 / 9 / 10 / 12 / 10 / 9 |
| Half-Troll | 16 / 7 / 6 / 13 / 12 / 8 / 7 / 9 / 12 | 12 / 7 / 6 / 15 / 14 / 8 / 7 / 9 / 12 |
| Half-Orc | 14 / 8 / 8 / 13 / 11 / 9 / 9 / 10 / 8 | 12 / 10 / 10 / 11 / 11 / 9 / 9 / 10 / 8 |
| Half-Goblin | 8 / 13 / 14 / 8 / 9 / 9 / 11 / 8 / 10 | 8 / 13 / 12 / 10 / 9 / 9 / 11 / 8 / 10 |
| Half-Merfolk | 8 / 11 / 12 / 9 / 9 / 11 / 10 / 11 / 9 | 8 / 11 / 10 / 9 / 11 / 11 / 10 / 11 / 9 |

Every row above remains exactly 90 points for both sexes.

## Lineage Rationale

### Human

Recommended:

~~~text
Male:   STR +1, AGI -1
Female: STR -1, AGI +1
~~~

Humans should establish the ordinary reference case.

The difference is deliberately moderate:

- average males trend toward greater raw force;
- average females trend toward greater agility / flexibility;
- neither sex gains total power;
- the difference is small relative to lineage, selected traits, backstory, equipment, progression, and individual build choices.

This should be the model players intuitively understand before encountering less Human-like lineage biology.

### Dwarf

Recommended:

~~~text
Male:   STR +1, VIT -1
Female: STR -1, VIT +1
~~~

Dwarves should not inherit the Human STR-versus-AGI axis.

The existing Dwarf identity is already heavily grounded in:

- dense build;
- endurance;
- durability;
- labor capacity;
- stone / mountain life;
- high CON and VIT;
- low AGI.

The recommended distinction therefore stays inside Dwarven physicality:

- males trend toward greater peak force;
- females trend toward greater bodily reserve / vitality;
- both remain poor candidates for an agility-based racial stereotype.

This produces different expressions of the same dense Dwarven phenotype rather than making female Dwarves function like scaled Humans.

### Gnome

Recommended:

~~~text
Male:   none
Female: none
~~~

Gnomes should be mechanically monomorphic in v1.

Their baseline STR is already only 6. Applying a universal female STR penalty to them is proportionally much harsher than applying the same -1 to Humans.

Their racial identity is primarily defined by:

- small stature;
- quick movement;
- dexterity;
- intelligence;
- invention;
- magical experimentation.

Sex can remain visually obvious without producing a useful difference in the nine-attribute abstraction.

This is also useful worldbuilding: not every humanoid species should reproduce Human stat patterns.

### Halfling

Recommended:

~~~text
Male:   VIT +1, DEX -1
Female: VIT -1, DEX +1
~~~

Halflings are already physically small and carry high DEX / AGI with low STR.

Further reducing female STR from 7 to 6 simply because the Human rule was reused is undesirable.

The proposed difference instead gives:

- males slightly greater bodily reserve / density;
- females slightly greater fine coordination / dexterity.

AGI remains 12 for both sexes so the lineage's movement identity remains shared.

### Elf

Recommended:

~~~text
Male:   none
Female: none
~~~

Elves should be mechanically monomorphic in v1.

Their current identity emphasizes:

- long life;
- refinement;
- precision;
- agility;
- dexterity;
- magic;
- skill over brute force.

A setting where male and female Elves are visually distinct but exhibit little meaningful difference within the nine broad attributes fits the current racial concept and makes them biologically distinct from Humans.

This does not mean their bodies are identical. It means the differences do not warrant separate starting-attribute modifiers at this resolution.

### Dark Elf

Recommended:

~~~text
Male:   DEX +1, CON -1
Female: DEX -1, CON +1
~~~

This is intentionally counter to simply copying Human dimorphism.

Proposed biological interpretation:

- male Dark Elves trend toward finer, lighter, precision-oriented builds;
- female Dark Elves trend toward somewhat denser constitutions and greater physical robustness;
- both remain equally agile at the racial level.

This would be **new explicit lore**, not merely a mechanical inference from existing text.

If adopted, it should be documented in future lineage lore rather than existing only as a hidden stat table.

If the setting does not want this biological distinction, Dark Elf should fall back to Tier 0 rather than inherit Human STR / AGI behavior.

### Half-Troll

Recommended:

~~~text
Male:   STR +2, CON -1, VIT -1
Female: STR -2, CON +1, VIT +1
~~~

Half-Troll is the strongest candidate for pronounced sexual dimorphism.

Existing Troll ancestry already emphasizes:

- extreme HP expansion;
- blunt staying power;
- STR growth;
- VIT growth;
- low AGI;
- heavy physical survival.

The proposed distinction does **not** turn female Half-Trolls into agile characters.

Instead it produces two expressions of Troll-derived physicality:

- males trend strongly toward peak force;
- females trend toward constitution and sustained bodily reserve.

The resulting female average still has STR 12, which remains physically formidable relative to most playable racial midpoints.

This is the recommended upper edge of starting sexual dimorphism. Avoid making any playable lineage substantially more divergent without a separate balance review.

### Half-Orc

Recommended:

~~~text
Male:   STR +1, CON +1, DEX -1, AGI -1
Female: STR -1, CON -1, DEX +1, AGI +1
~~~

Half-Orcs are also good candidates for stronger-than-Human dimorphism because Orc ancestry already favors STR, CON, pressure tolerance, and physical endurance.

Unlike Half-Trolls, the distinction should spread across several physical attributes rather than creating an extreme single-stat gap.

Interpretation:

- males trend toward mass, strength, and pressure tolerance;
- females trend toward speed, coordination, and mobility;
- both remain recognizably Half-Orc;
- neither profile gains total power.

The resulting female STR remains 12, so the lineage stays physically strong even on the more mobile side of the sex difference.

### Half-Goblin

Recommended:

~~~text
Male:   AGI +1, CON -1
Female: AGI -1, CON +1
~~~

Goblin ancestry already favors:

- motion;
- agility;
- dexterity;
- repeated exertion;
- lower direct toughness.

A useful counterintuitive pattern is therefore:

- males trend even farther toward lightness and rapid movement;
- females trend toward greater robustness / constitution.

This gives Half-Goblins lineage-specific biology instead of a Human template with green skin and different numbers.

This would also be **new explicit lore** and should be documented as such if adopted.

### Half-Merfolk

Recommended:

~~~text
Male:   AGI +1, VIT -1
Female: AGI -1, VIT +1
~~~

Merfolk ancestry already emphasizes:

- aquatic travel;
- bodily rhythm;
- hydration efficiency;
- reserve;
- endurance;
- agility;
- wisdom.

The proposed distinction expresses that biology through:

- slightly greater average male maneuverability / burst movement;
- slightly greater average female reserve / sustained vitality.

This is preferable to importing the Human STR / AGI relationship into a lineage whose defining physiology is aquatic adaptation.

This would be **new explicit lore** and should be made visible in lineage documentation if adopted.

## Why INT, WIS, SPT, And CHA Are Excluded

The initial biological-sex pass should not assign sex modifiers to:

- INT;
- WIS;
- SPT;
- CHA.

Those attributes represent broad gameplay abstractions involving cognition, judgment, will, spirit, social projection, leadership, morale, negotiation, and attention.

For the current setting, physical dimorphism can be represented cleanly through:

- STR;
- DEX;
- AGI;
- CON;
- VIT.

Moving sex into the mental/social attributes would mix biological morphology with culture, upbringing, personality, and role expectations in ways that are neither necessary nor useful for this system.

This is a v1 boundary, not a metaphysical claim that fantasy biology could never affect another attribute.

If a future lineage is genuinely non-Human enough to justify a sex-specific magical, psychic, or spiritual mechanism, that should be an explicit lineage design decision with separate review.

## Relationship To The Six-Trait Character Profile

Sex modifiers are direct structural modifiers.

They do **not** consume trait slots.

They do **not** alter the number of generated trait/profile points.

The intended relationship is:

~~~text
lineage midpoint
+ sex modifier
+ age modifier
+ height modifier
+ backstory modifier
= pre-profile attributes

six selected mechanical traits
-> weighted deterministic resolver
-> exactly 10 generated profile points

pre-profile attributes
+ generated profile points
= 100-point starting character
~~~

The trait system is deliberately strong enough to let an individual character run against the average sex tendency.

Examples:

- a female Human can select strength-oriented frame and physical traits and exceed a male Human who did not;
- a male Dwarf can select endurance-oriented traits and exceed the average female Dwarf in VIT;
- a female Half-Troll can still become an exceptionally high-STR character;
- a male Half-Orc can be built as highly agile despite the racial-sex average.

Sex describes a population tendency at character creation. It is not a cap.

## Recommended Magnitude Ceilings

For the first implementation, use these guardrails.

### Tier 1 ceiling

Maximum per-sex adjustment on any one attribute:

~~~text
1
~~~

Maximum inter-sex gap on any one attribute:

~~~text
2
~~~

Target total profile separation:

~~~text
4
~~~

### Tier 2 ceiling

Maximum per-sex adjustment on any one attribute:

~~~text
2
~~~

Maximum inter-sex gap on any one attribute:

~~~text
4
~~~

Target total profile separation:

~~~text
8
~~~

Do not exceed Tier 2 without a dedicated balance review.

A sex choice that moves more than four absolute points per character begins competing too heavily with the future six-trait system, whose entire generated contribution is only 10 points.

## Recommended Data Ownership

Make sex adjustments explicit in lineage data.

Conceptual target:

~~~ts
type BiologicalSexId = "male" | "female";

interface PlayerLineageProfileRecord {
  // existing lineage fields...
  sexAttributeAdjustments: Record<BiologicalSexId, PlayerAttributeAdjustments>;
}
~~~

Example:

~~~ts
"lineage.human": {
  // ...
  sexAttributeAdjustments: {
    male: { STR: 1, AGI: -1 },
    female: { STR: -1, AGI: 1 }
  }
}
~~~

Do not use a universal fallback.

Do not use the Human table when another lineage is missing data.

A missing male or female adjustment record should fail catalog integrity validation during development.

For a mechanically monomorphic lineage, author the choice explicitly:

~~~ts
sexAttributeAdjustments: {
  male: {},
  female: {}
}
~~~

Explicit emptiness is meaningful. It says the designers intentionally chose Tier 0.

## Hybrid Lineage Rule

The current playable roster includes four hybrids:

- Half-Troll = Human + Troll ancestry
- Half-Orc = Human + Orc ancestry
- Half-Goblin = Human + Goblin ancestry
- Half-Merfolk = Human + Merfolk ancestry

Do **not** automatically average sex-adjustment vectors from the parent lineages in v1.

Reason:

Sexual dimorphism is not safely represented by linear interpolation of two stat vectors. Hybrid reproductive biology can be its own phenotype.

Preferred rule:

> Hybrid lineages explicitly author their own male and female sex-adjustment records, informed by both parents but owned by the hybrid lineage.

Parent data can guide design, but should not be runtime authority.

This keeps Half-Troll, Half-Orc, Half-Goblin, and Half-Merfolk stable even if non-playable Troll, Orc, Goblin, or Merfolk biology changes later.

## Height And Sex

The current creator has lineage-level height ranges and age data contains some sex-specific ranges, but the main height-band stat modifier is currently shared:

~~~text
Short  = AGI +1, STR -1
Normal = no adjustment
Tall   = STR +1, AGI -1
~~~

Sex dimorphism should remain independent of the selected height band.

That means a tall female Human can receive:

~~~text
Female biology: STR -1, AGI +1
Tall stature:   STR +1, AGI -1
Net:            0
~~~

This is desirable.

It prevents sex from acting as destiny and lets an individual's stature naturally counter or reinforce the lineage-sex average.

Future portrait generation may use sex-specific height distributions for visual realism, but the player-facing Short / Normal / Tall choice should continue describing position relative to the relevant lineage distribution.

## Portrait Generation Implications

Biological sex is structural portrait input, not an ordinary appearance tag.

Recommended prompt data should include:

- lineage;
- biological sex;
- age;
- stature;
- frame/body traits;
- physical-condition traits;
- coloration;
- cosmetic descriptors.

Do not translate stat modifiers into prompt language.

Bad:

~~~text
female Half-Troll, STR -2, CON +1, VIT +1
~~~

Good:

~~~text
female Half-Troll, massive troll-descended physiology, dense resilient build
~~~

The portrait should derive visible sexual characteristics from the authored lineage + sex visual specification and selected individual traits.

Individual frame/body tags remain authoritative for the person's visible build.

For example, the population average can say male Half-Trolls trend more force-heavy, while a particular female Half-Troll with Large-Framed + Muscular + Powerful can still visually read as enormously strong.

## Lore Visibility Rule

Any non-obvious dimorphism adopted into mechanics must also exist in setting-facing design documentation.

Especially:

- Dark Elf male precision / female robustness;
- Half-Goblin male agility / female robustness;
- Half-Merfolk maneuverability / vitality distinction;
- pronounced Half-Troll force / resilience distinction.

Do not hide surprising biological lore exclusively in a stat table.

The character creator does not need a biology lecture, but lineage descriptions, tooltips, or future codex material should make the setting internally coherent.

## UI Presentation Rule

Sex selection should show the actual lineage-specific mechanical difference.

Recommended compact treatment:

~~~text
Male
Typical Human physiology
STR +1   AGI -1

Female
Typical Human physiology
STR -1   AGI +1
~~~

For a Tier 0 lineage:

~~~text
Male
No starting attribute difference

Female
No starting attribute difference
~~~

Avoid presenting Tier 0 as if the choice has no value. It still affects:

- identity;
- portrait generation;
- names where applicable;
- lineage presentation;
- future reproductive / family simulation where relevant.

The UI should also make clear that the listed modifier is an average biological tendency, not a maximum or minimum.

## Catalog Integrity Rules

Future validation should require:

1. every playable lineage has an explicit male record;
2. every playable lineage has an explicit female record;
3. every sex-adjustment vector sums to zero;
4. Tier 0 lineages explicitly use empty records;
5. no current v1 sex modifier touches INT, WIS, SPT, or CHA;
6. Tier 1 records stay within the Tier 1 magnitude ceiling;
7. Tier 2 records stay within the Tier 2 magnitude ceiling;
8. every male profile remains the same total as the lineage midpoint;
9. every female profile remains the same total as the lineage midpoint;
10. no lineage silently inherits Human sex data;
11. hybrid lineages own explicit records rather than resolving them dynamically from parents.

## Required Tests

A future implementation should add tests covering at least:

### Data completeness

- every playable lineage defines male and female adjustments;
- no playable lineage relies on fallback behavior;
- monomorphic lineages define intentional empty records.

### Zero-sum behavior

For every playable lineage and each sex:

~~~text
sum(sexAttributeAdjustments) === 0
~~~

### Baseline preservation

For every playable lineage:

~~~text
sum(lineage midpoint) === 90
sum(midpoint + male modifier) === 90
sum(midpoint + female modifier) === 90
~~~

### Proposed exact profiles

Snapshot or direct-value tests should pin the approved male/female base arrays so accidental drift is visible.

### Tier enforcement

- Tier 0 has zero profile separation;
- Tier 1 respects maximum per-attribute and total-separation limits;
- Tier 2 respects maximum per-attribute and total-separation limits.

### Character build freedom

Add focused tests demonstrating that trait selection can reverse population tendencies.

Example expectations:

- a strength-oriented female Human can resolve above a non-strength-oriented male Human in STR;
- a vitality-oriented male Dwarf can resolve above a non-vitality-oriented female Dwarf in VIT;
- a strength-specialized female Half-Troll is not blocked from high STR values.

These do not need to prove every possible build. They prove the sex modifier is a tendency rather than a class lock.

### Determinism

Sex-adjusted baseline + identical other selections must resolve identically across repeated runs.

## Interaction With Age And Stature

The existing creator also applies small zero-sum age and height shifts.

That interaction is desirable, but cumulative structural modifiers should be reviewed for extreme combinations.

Example:

~~~text
Human female       STR -1 / AGI +1
Short stature      STR -1 / AGI +1
Young adult        WIS -1 / AGI +1
~~~

Before trait allocation this character can already lean strongly into AGI.

That is not automatically a problem, because:

- the total remains fixed;
- the player intentionally chose multiple reinforcing traits of identity;
- other attributes pay the opportunity cost.

However, implementation should include a matrix test over:

~~~text
lineage x sex x age x height
~~~

and report minimum / maximum pre-profile values for every attribute.

The purpose is to catch accidental extreme stacks, not to flatten meaningful combinations.

## Relationship To Racial Trait / Growth Systems

Starting sex modifiers should not automatically alter:

- lineage resource growth;
- metabolic profile;
- attribute growth biases;
- racial traits;
- skill growth;
- class growth.

Those are separate systems.

The current recommendation is specifically about **starting attribute distribution**.

If future design wants sex to affect metabolic behavior, lifespan, fertility, resource recovery, pregnancy, body mass, or other simulation systems, those should receive their own explicit contracts rather than being inferred from the starting-stat table.

## Recommended V1 Decisions To Treat As Settled For Implementation Planning

Unless later discussion deliberately changes them, carry these forward as the recommended target:

1. The lineage stat block is a sex-neutral 90-point midpoint.
2. Male and female both derive from that midpoint.
3. Sex modifiers are zero-sum.
4. Human uses symmetric STR / AGI dimorphism.
5. Dwarf uses STR / VIT dimorphism.
6. Gnome is mechanically monomorphic.
7. Halfling uses VIT / DEX dimorphism.
8. Elf is mechanically monomorphic.
9. Dark Elf tentatively uses male DEX / female CON dimorphism, requiring explicit lore adoption.
10. Half-Troll uses strong STR versus CON/VIT dimorphism.
11. Half-Orc uses strong force/robustness versus mobility/coordination dimorphism.
12. Half-Goblin tentatively uses male AGI / female CON dimorphism, requiring explicit lore adoption.
13. Half-Merfolk tentatively uses male AGI / female VIT dimorphism, requiring explicit lore adoption.
14. INT, WIS, SPT, and CHA remain outside biological-sex modifiers in v1.
15. Hybrid lineages explicitly own their sex profiles.
16. Human fallback behavior is removed.
17. Trait choices remain capable of overpowering or reversing average sex tendencies.
18. Tier 2 is the upper balance ceiling without a dedicated future review.

## Open Design Questions

These are the remaining questions worth resolving before implementation begins.

### 1. Dark Elf biology

Choose one:

- adopt DEX-male / CON-female dimorphism;
- make Dark Elves Tier 0;
- author a different physical distinction.

Do not default to Human behavior merely because no decision was made.

### 2. Half-Goblin biology

Choose one:

- adopt male AGI / female CON distinction;
- reduce to Tier 0;
- author another Goblin-derived difference.

### 3. Half-Merfolk biology

Choose one:

- adopt male AGI / female VIT distinction;
- make them Tier 0;
- define another aquatic physiological axis.

### 4. Half-Troll magnitude

The proposed STR 16 male / STR 12 female midpoint-derived split is intentionally visible.

Confirm whether that level of dimorphism fits the intended setting before implementation.

If reduced, prefer reducing Half-Troll to a Tier 1 pattern rather than inventing fractional stats.

### 5. Sex-specific height distributions

Current character identity data does not yet establish a clean lineage-wide sex-specific height authority in the same way this plan proposes for stats.

A future identity pass should decide whether:

- male/female height distributions differ by lineage;
- the player's Short / Normal / Tall choice is normalized within sex;
- portrait generation receives an actual resolved height in centimeters rather than only a band.

This question does not block the stat model.

## Implementation Sequence

When implementation is eventually authorized, prefer this order:

### Step 1: data authority

- replace the shared universal sex-adjustment constant with explicit lineage records;
- make the playable sex type male/female where appropriate;
- remove Human fallback behavior;
- add integrity validation.

### Step 2: exact balance tests

- pin all approved midpoint and sex-adjusted arrays;
- test zero-sum behavior;
- test tier ceilings;
- run lineage x sex x age x height interaction coverage.

### Step 3: creator preview

- show lineage-specific sex modifiers;
- keep live total-stat preview;
- ensure Tier 0 lineages communicate "no attribute difference" cleanly.

### Step 4: trait-system integration

- feed the sex-adjusted structural base into the new six-trait resolver;
- preserve exactly 10 generated profile points;
- verify individual traits can counter average sex tendencies.

### Step 5: portrait/lore integration

- make lineage + sex part of portrait prompt specification;
- author visual biology fragments separately from stat values;
- document any surprising dimorphism in lineage-facing lore.

## Implementation Guardrails

A future coding pass consuming this document should:

- inspect current `master` before editing because adjacent character-creator work may have moved;
- preserve unrelated Codex / GPT changes;
- not infer biology from portrait output;
- not infer stat modifiers from labels or prose;
- not create a universal Human fallback;
- not increase total starting power through sex selection;
- not introduce sex-based hard caps on attributes;
- not make sex a prerequisite for a class, skill, trait, or build;
- not allow a sex modifier to consume or alter the six mechanical-trait slots;
- keep image-generation failure irrelevant to mechanics;
- update setting lore when adopting a non-obvious lineage-specific biological distinction.

## Final Target

The intended model is:

~~~text
               lineage midpoint (90-point racial authority)
                               |
                lineage-authored biological sex
                               |
                      age + stature + history
                               |
                    structural starting base
                               |
                 six individual mechanical traits
                               |
             deterministic 10-point profile allocation
                               |
                   100-point starting character
~~~

Biological sex should be meaningful without being destiny.

Lineage should determine what sexual dimorphism means biologically.

Individual traits should determine what this particular person became within, against, or beyond that population tendency.
