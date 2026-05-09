# Magic System Charter

Status: Design-only charter (no runtime activation)
Last updated: 2026-05-09

## A. Core Magic Identity

This charter defines the intended long-term direction for magic before any broad runtime expansion.

Core identity:

- The game remains classless.
- Magic access is not locked behind jobs/classes.
- Required prepared spell slots are **not** the primary limiter.
- Spell execution stays narrow and deterministic in runtime slices.
- Current spell hook vocabulary remains validation-first until specific runtime slices are intentionally approved.

Primary casting model:

**known spell + equipped item/weapon casting tags + optional catalyst + character control capacity = final cast profile**

Design implications:

- Characters may know spells without being “mage class” characters.
- Equipped conduits determine which known spells are practical in combat right now.
- Tag overlap between weapon/item families is expected and desired.
- The same spell can cast differently by conduit and catalyst context.
- Catalysts are optional amplifiers/helpers, not universal hard requirements.
- Freecasting remains possible for many spells but is intentionally inefficient, risky, and harder to control.

## B. Stat Model

Magic is governed by multi-stat interaction, not a single attribute.

Primary stat responsibilities:

- **INT**: theory, formula construction, inscription literacy, shape complexity, arcane comprehension.
- **WIS**: perception, restraint, diagnosis, natural/divine alignment, safe decision-making.
- **SPT**: will and channel pressure, sustained shaping, spiritual throughput, backlash resistance while casting.

Secondary/support contributions:

- **DEX**: gesture precision, wand alignment, sigil-line quality, fine delivery control.
- **CON/VIT**: body strain tolerance, overchannel endurance, ritual fatigue management.
- **CHA**: performance and command modalities, morale-linked support casting, social-ritual presence.

Control capacity should be multi-factor and later tuned per spell family rather than hardcoded to INT-only scaling.

## C. Tradition / School Taxonomy

Current authored magic-adjacent areas include:

- elemental
- enfeebling
- enhancing
- healing
- control
- utility
- arcane
- druidic
- ninjutsu
- performance
- divine
- dark
- summoning
- enchantment

Recommended taxonomy for clean evolution:

### Traditions (source and worldview layer)

- arcane
- divine
- druidic
- performance
- ninjutsu
- dark

Traditions influence learning access, instruction paths, and familiarity bonuses/penalties.

### Schools (mechanical spell-function layer)

- elemental
- healing
- enfeebling
- enhancing
- control
- utility
- warding (explicitly promoted from implicit defensive behavior)

Schools define gameplay grouping for compatibility and future balancing.

### Disciplines (specialized implementation tracks)

- summoning (high-complexity control and entity-binding discipline)
- enchantment (item/document inscription and persistent effect discipline)

Disciplines should stay narrower than schools and often require stronger prerequisites.

### Classifier-only for now (non-runtime execution owners)

- broad lore/style classifiers attached to spells or hooks that describe intent but do not execute runtime logic.

### Gameplay-significant later

- tradition familiarity and school focus effects on control capacity, failure profile, and training efficiency.

## D. Conduit / Casting Tag Model

Tags are compatibility and modifier signals only.

**Tags must never directly execute effects** (for example `magic.elemental` must not itself apply damage).

### Magic family tags

- `magic.elemental`
- `magic.divine`
- `magic.healing`
- `magic.enfeebling`
- `magic.enhancing`
- `magic.control`
- `magic.druidic`
- `magic.performance`
- `magic.dark`
- `magic.utility`
- `magic.warding`

### Range tags

- `range.touch`
- `range.short`
- `range.medium`
- `range.long`
- `range.aura`

### Delivery tags

- `delivery.projectile`
- `delivery.touch`
- `delivery.area`
- `delivery.beam`
- `delivery.self`
- `delivery.ally`
- `delivery.ward`

### Casting behavior tags

- `cast.fast`
- `cast.stable`
- `cast.precise`
- `cast.risky`
- `cast.slow`
- `cast.ritual`
- `cast.rhythmic`

### Power/control tags

- `power.low`
- `power.medium`
- `power.high`
- `control.easy`
- `control.moderate`
- `control.hard`

### Conduit examples and expected profile overlap

- **Staff**: medium/long range, stable, higher power ceiling, slower cadence, weak touch/melee delivery.
- **Wand**: short/medium range, fast and precise, lower top-end power, weaker large-catalyst scaling.
- **Holy symbol / relic / charm**: divine/healing/warding support, stable ally/self effects.
- **Ritual dagger / focus knife**: touch/short precision with risky binding or dark/enfeebling support.
- **Instrument**: performance/enhancing/control with aura/medium rhythmic support.
- **Shield / sigil board**: warding/protection stability, defensive skew, constrained offense.
- **Bow / crossbow / thrown weapon**: imbued projectile delivery lane only; not full-spectrum casting.
- **Offhand focus / crystal / torch / herb pouch**: secondary conduit support and catalyst handling.

Overlap is expected: staff and wand can both support spells like Firebolt/Fireball but with divergent profiles.

## E. Spell Compatibility Model

Each spell should define compatibility via:

- **requiredTags**
- **preferredTags**
- **discouragedTags**

Tags govern:

- whether a cast profile is legal
- efficiency and stability modifiers
- pacing and risk differences

Tags do **not** govern direct effect resolution logic.

Example compatibility targets:

- **Firebolt**: requires `magic.elemental` and one of `range.short|range.medium|range.long`; prefers `cast.fast` or `cast.precise`.
- **Fireball**: requires `magic.elemental` and one of `range.medium|range.long`; prefers `cast.stable` and `power.medium|power.high`.
- **Healing Touch**: requires `magic.healing` and one of `range.touch|range.short`; prefers `magic.divine` or `magic.druidic`.
- **Ward Circle**: requires `magic.warding` and `cast.stable`; prefers staff/relic/sigil-board style tag bundles.

## F. Catalyst Tier Model

Catalysts are optional anchors/fuel/amplifiers.

Catalyst tiers:

- **Tier 0**: No Catalyst
- **Tier 1**: Trace Catalyst
- **Tier 2**: Small Catalyst
- **Tier 3**: Medium Catalyst
- **Tier 4**: Large Catalyst
- **Tier 5**: Bulk Catalyst

Likely directional effects by tier (subject to balancing):

- Higher tiers can reduce effective MP inefficiency for compatible spells.
- Higher tiers can shift stamina strain from raw self-channeling into shaping/control work.
- Higher tiers can improve potency/area/duration ceilings if control supports it.
- Higher tiers can increase baseline instability and collateral/backlash risk when over capacity.
- Larger catalyst tiers can increase setup/cast time when shaping exceeds caster control.

Core equations:

- **Raw Spell Potential** = spell base power + catalyst tier + catalyst quality + environmental advantage
- **Control Capacity** = relevant magic skill + primary stat + SPT + conduit quality + tradition familiarity
- **Final Spell Output** is limited by Control Capacity
- **Excess Catalyst Power** becomes waste, instability, cast delay, backlash risk, collateral risk, or shaping failure

Fire model example:

- Fire can be freecast from understanding and internal resource expenditure alone (possible but taxing).
- Existing fuel (alcohol/oil/coal/flame) lowers practical burden and can improve shaping reliability.
- A large fuel source increases potential, not guaranteed output; novice control can still fail dangerously.

## G. Known / Combat-Ready / Freecasting / Ritual Model

### Known Spells

Learned spell knowledge retained on the character regardless of current equipment.

### Combat-Ready Spells

Subset of known spells currently supported by equipped conduit tags and control profile.

### Freecasting

Casting without suitable conduit and/or catalyst remains possible for many spells, but with penalties:

- higher MP and stamina burden
- longer cast time
- lower potency/scale ceiling
- higher interruption and backlash risk
- greater collateral risk on failed shaping

### Ritual Casting (later)

Slower, noncombat-oriented casting path for large, persistent, or complex outcomes.

### Scroll Casting (later)

Separate from conduit-first combat-ready flow; document-bound casting remains deferred.

## H. Spell Acquisition Model (Future, Not Implemented)

Planned acquisition channels:

- teachers and apprenticeships
- guild instruction tracks
- temple or shrine instruction
- field discovery and experimentation
- tomes and codified manuals (post spell database maturity)
- scrolls and copied manuscripts (post inscription/document systems)
- ritual learn paths
- regional/cultural unlock routes
- bloodline/heir inheritance lanes (later)

No runtime behavior is added by this charter; this is target design only.

## I. Spell Progression Model

Recommended direction:

- spells may support ranks or mastery states later
- magic skills should modify control/cost/potency stability envelopes
- spell use may train magic skills later through explicit progression routes

Policy constraints:

- all future magic skill gain must route through `resolveSkillRankGainPolicy`
- combat magic skill gain remains blocked until weapon combat skill gain and encounter cap behavior stabilize further
- direct magic skill-rank grants remain disallowed in early slices

## J. Affinity / Resistance Model

### Runtime-now boundary

- no broad affinity/resistance runtime execution expansion in this pass
- current deterministic subset stays narrow

### Later model goals

- elemental affinities per actor/material/context
- resistances/vulnerabilities with bounded scaling
- terrain/weather influence on spell shaping and stability
- creature/material interaction tables
- crystal/essence interaction modifiers

All of the above should enter via phased slices with strict validation-first guardrails.

## K. Item / Crafting / Catalyst Ecosystem Model

Future item-role ownership:

- blank books (document substrate)
- scrolls (single-use or charge-based document lane)
- tomes (repeatable authored knowledge/media lane)
- inks and inscription media
- crystals and essence storage
- arcane vessels and safe catalyst containers
- focus draught and concentration supports
- enchanted items and bound conduits
- magic infrastructure services (scriptorium, bookbindery, shrines, labs)

Ownership intent:

- spell-bearing documents stay on the enchanter-authored arcane-document path rather than split generic ownership.

## L. Magic Legacy Policy

### Allowed later (gated)

- unlock access lanes to teachers or traditions
- unlock starter permission lanes
- improve safe-casting thresholds and recovery/preparation support
- optionally unlock known-spell slot capacity constraints later if ever needed

### Forbidden early

- direct spell power bonuses
- direct magic skill-rank grants
- free starter spell bundles that bypass acquisition intent
- generic magic effect execution
- bypassing catalyst/control constraints
- bypassing MP/strain constraints

## M. Runtime Implementation Phases

1. Design charter only (this document).
2. Data shapes for conduit/casting tags and catalyst tiers.
3. Validation/lint guardrails for new spell/conduit/catalyst metadata.
4. Read-only UI preview of spell compatibility (no runtime execution changes).
5. Known-spell acquisition model wiring (narrow, deterministic).
6. One narrow freecast/conduit runtime spell slice.
7. Catalyst modifier slice for that narrow runtime lane.
8. Magic skill gain integration later (policy-gated).
9. Scroll/tome behavior later (document systems).
10. Magic Legacy interactions much later.

## N. Deferred / Forbidden List

Deferred:

- broad runtime spell execution expansion
- scroll/tome runtime behavior
- ritual runtime behavior
- magic combat skill gain
- affinity/resistance runtime matrix
- direct magic Legacy power execution

Forbidden in early phases:

- required prepared spell slot model as core limiter
- weapon-defined classes or job requirements
- generic tag-driven effect execution
- direct Legacy magic power bonuses
- direct magic skill-rank grants

## O. Recommended Next Codex Prompt

"Implement Phase 2 (data-shape only) from `docs/design/magic-system-charter.md`:

- add additive data structures for conduit/casting tags on compatible weapon/item records
- add additive metadata structures for spell compatibility (`requiredTags`, `preferredTags`, `discouragedTags`)
- add additive catalyst tier vocabulary constants (Tier 0-5) in content schemas
- add/adjust focused validation rules so tags are validated as vocabulary only
- do **not** change runtime spell effect execution, combat resolution, Legacy power, or skill-rank mutation behavior
- run `npm.cmd run tool:content-lint` and report only schema/lint impacts"
