# Attribute, Skill, Ability, And Spell Responsibility Audit

Date: 2026-08-27

Status: `AUDIT_COMPLETE_PRESERVE_NINE_PENDING_FOCUSED_DESIGN`

Execution surface: ChatGPT via GitHub Connector; documentation-only

Source baseline: `cfb569c7f196e71e2f63451dc583f54ad31cd0b2`

Active route protected during audit: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

## 1. Result

The current nine-attribute model is structurally viable and should **not** be merged, split, or rebalanced from this audit.

The live repository supports a coherent intended distinction among:

- `STR` — force and leverage;
- `DEX` — fine precision and timing;
- `AGI` — whole-body movement and reaction;
- `CON` — exertion tolerance and conditioning;
- `VIT` — hardiness and injury/recovery capacity;
- `WIS` — judgment, discipline, support, and field reading;
- `INT` — analysis, technical/arcane comprehension;
- `SPT` — supernatural resonance and channel stability;
- `CHA` — presence, morale, leadership, and social projection.

However, current implementation maturity is uneven. The most important finding is that the repository has **three different layers of attribute relationship that must not be conflated**:

1. authored descriptive metadata in `attributes.json`, `skills.json`, `abilities.json`, and `spells.json`;
2. actual runtime formulas in resource, combat, creator, Echo, and stat-growth owners;
3. future/intended requirements or scaling relationships that are represented in content but are not yet generally enforced by runtime owners.

No current evidence justifies deleting one of the nine attributes. The correct next posture is to preserve all nine while later focused system work tightens responsibility and wiring.

## 2. Catalog Baseline

Current player catalogs inspected:

| Catalog | Records |
| --- | ---: |
| skills | 121 |
| abilities | 32 |
| spells | 55 |
| traits | 30 |
| backstories | 27 |
| primary attributes | 9 |

All nine attributes have authored default `10` records.

## 3. Declared Governing-Reference Distribution

Counts below are direct current catalog references, not proof that every relationship is executed at runtime.

| Attribute | Governing skills | Governing abilities | Ability minimum-attribute requirements | Governing spells |
| --- | ---: | ---: | ---: | ---: |
| STR | 24 | 12 | 12 | 0 |
| DEX | 35 | 11 | 11 | 6 |
| AGI | 12 | 3 | 3 | 6 |
| CON | 26 | 2 | 2 | 0 |
| VIT | 6 | 0 | 0 | 0 |
| WIS | 56 | 1 | 1 | 7 |
| INT | 53 | 0 | 0 | 32 |
| SPT | 9 | 0 | 0 | 49 |
| CHA | 21 | 3 | 3 | 10 |

### Interpretation

- `WIS` and `INT` dominate skill-governance metadata.
- `STR` and `DEX` dominate authored ability requirements/governance.
- `SPT` dominates spell-governance metadata.
- `VIT` is intentionally narrow in catalog governance and instead carries strong resource/defensive/recovery responsibilities.
- `AGI` is narrower than DEX in catalog counts but has strong runtime speed, ranged, stamina, travel, and movement responsibilities.
- Zero ability/spell counts do not mean an attribute is unused; resource, combat defense, creator, growth, and recovery owners matter separately.

## 4. Attribute Responsibility Profiles

### STR — Strength

Declared role:
- lifting power, leverage, force in melee;
- melee power, carrying, shield control, stamina burst.

Representative skill ownership:
- heavy and direct weapon skills;
- melee fundamentals;
- mining/quarrying/woodcutting;
- climbing;
- blacksmithing and other force-bearing work.

Ability metadata is strongly STR-biased: 12 of 32 abilities govern on and require STR, including Sunder, Cleave, Crushing Blow, Guard Break, Execute, grapple/takedown-style actions, and heavy ranged pressure.

Live runtime responsibilities:
- melee offense uses `STR + DEX + 0.15 * AGI`;
- shield offense uses `STR + CON + 0.15 * WIS`;
- overall combat threat counts STR equally with every other primary stat;
- general labor attribute load trains STR at weight `0.5`;
- stat-growth tension penalizes precision when high STR materially outruns DEX.

Important distinction:
- authored `attributes.json` says STR secondarily influences HP and Stamina;
- the live `player-resources.ts` maximum/regen formulas do **not** currently include STR.

Posture: `DISTINCT_AND_ACTIVE`.

### DEX — Dexterity

Declared role:
- fine hand control, release timing, precision with weapons/tools/gestures;
- accuracy, critical rate, fine crafting, trap handling.

Catalog role:
- 35 governing-skill references;
- 11 ability governance/requirement references;
- 6 spell references, currently concentrated in ninjutsu-style placeholder content.

Live runtime:
- action speed uses AGI + DEX;
- melee offense uses DEX materially;
- ranged offense uses `DEX + AGI + 0.2 * WIS`;
- procurement field work trains DEX at `0.4`;
- high STR relative to DEX creates precision tension.

Posture: `DISTINCT_AND_ACTIVE`.

### AGI — Agility

Declared role:
- balance, footwork, reaction speed, movement economy;
- evasion, initiative, movement speed, stamina efficiency.

Catalog role is narrower than DEX:
- 12 governing skills;
- 3 governed/required abilities;
- 6 ninjutsu-style spell records.

Live runtime is stronger than the catalog count suggests:
- action execution speed uses AGI + DEX;
- ranged offense uses AGI directly;
- physical/ranged defense uses AGI as a secondary component;
- Stamina max/regen uses AGI;
- travel and survey load train AGI at `0.7`;
- procurement trains AGI at `0.3`;
- high CON/VIT bulk relative to AGI creates mobility tension.

Posture: `DISTINCT_AND_ACTIVE`.

### CON — Constitution

Declared role:
- exertion tolerance, endurance, repeated strain;
- stamina capacity, fatigue resistance, poise, illness resistance.

Catalog:
- 26 governing skills across labor, survival, armor/defense and production;
- only 2 direct ability requirements/governance records.

Live runtime:
- HP maximum and natural regeneration;
- Stamina maximum and natural regeneration;
- all physical/ranged defense as a primary component;
- magic defense as a substantial component;
- shield offense;
- recovery capacity for converting accumulated stat load;
- travel/survey/labor/procurement attribute load;
- CON and VIT jointly form the bulk term for mobility tension.

Posture: `DISTINCT_AND_HIGHLY_ACTIVE`.

### VIT — Vitality

Declared role:
- hardiness, biological recovery, remaining functional through injury/attrition;
- HP capacity/regeneration, damage soak, wound recovery.

Catalog governance is intentionally sparse:
- 6 governing skills;
- no direct ability requirement;
- no governing spells.

Live runtime is materially stronger:
- HP max/regen;
- Stamina max/regen;
- physical, ranged and magic defense;
- recovery capacity has the strongest current attribute weight on VIT (`1.1`);
- travel/survey load weight `0.4`;
- labor load `0.5`;
- participates with CON in bulk-versus-AGI tension.

CON/VIT are therefore **not presently duplicates**:
- CON is broader exertion/stamina/conditioning;
- VIT is narrower hardiness/recovery/soak;
- they overlap intentionally in resource and defense formulas.

Risk:
- player-facing presentation must keep this distinction explicit because many formulas consume both.

Posture: `DISTINCT_BUT_PRESENTATION_SENSITIVE`.

### WIS — Wisdom

Declared role:
- judgment, discipline, sustained beneficial magic, field decisions;
- healing potency, status resistance, support duration, hazard reading.

Catalog:
- 56 governing skills, the highest count;
- 7 governing spells;
- 1 governed/required ability;
- broad coverage across resource work, survival, knowledge, healing/support, leadership and practical domains.

Live runtime:
- magic offense uses WIS alongside INT/SPT;
- healing uses `WIS + SPT + 0.1 * INT`;
- support-family offense uses WIS + CHA;
- all defensive families include WIS secondarily;
- recovery capacity uses WIS;
- travel/survey/procurement/labor growth profiles all train WIS;
- high SPT relative to WIS creates stability tension.

Important mismatch:
- authored resource metadata lists WIS as a primary MP driver;
- live resource maxima/regeneration currently use only INT + SPT for MP.

Posture: `DISTINCT_BUT_OVERBROAD_METADATA`.

### INT — Intelligence

Declared role:
- analysis, arcane comprehension, high-complexity spells/processes;
- spell accuracy/power, formula efficiency, knowledge checks.

Catalog:
- 53 governing skills;
- 32 governing spells;
- no authored direct ability minimum/governance records.

Live runtime:
- MP max/regen;
- magic offense;
- healing has a small INT contribution;
- Echo tracks INT equally with other stats;
- stat-growth engine supports INT fully;
- high STR-vs-DEX precision tension can partially suppress INT load generation.

Critical maturity gap:
- current production action-load profiles inspected for travel, survey, general labor and procurement do not train INT.
- there is therefore an engine path for INT growth, but the currently wired ordinary action set does not provide an INT-bearing growth profile.

Posture: `DISTINCT_ACTIVE_FORMULA_GROWTH_SOURCE_GAP`.

### SPT — Spirit

Declared role:
- spiritual resonance, focus under pressure, supernatural channel stability;
- MP regeneration, concentration, aura stability, ritual control.

Catalog:
- only 9 governing skills;
- 49 governing spells, the highest spell count;
- no direct ability minimum/governance records.

Live runtime:
- MP max/regen;
- magic offense;
- healing;
- magic defense;
- recovery capacity;
- Echo and stat growth;
- high SPT relative to WIS creates stability tension.

Critical maturity gap:
- none of the currently inspected ordinary production action-load profiles train SPT.

WIS/SPT are not currently duplicates:
- WIS is broad practical judgment/support;
- SPT is narrower supernatural channel/resonance.
- they are deliberately coupled in magic/healing/recovery, with tension preventing extreme Spirit from fully outrunning Wisdom.

Posture: `DISTINCT_ACTIVE_FORMULA_GROWTH_SOURCE_GAP`.

### CHA — Charisma

Declared role:
- presence, emotional projection, ally steadiness, attention direction;
- morale, threat control, party support, negotiation pressure.

Catalog:
- 21 governing skills;
- 3 command abilities;
- 10 performance-magic spells;
- broad backstory adjustment exposure.

Live runtime:
- support-family combat offense uses WIS + CHA;
- total combat threat includes CHA like every stat;
- Echo tracks CHA;
- stat-growth engine supports CHA.

Critical maturity gaps:
- live resource maxima/regen do not use CHA despite authored MP resource metadata naming CHA as secondary;
- current production action-load profiles inspected do not train CHA;
- broad social-resolution runtime is not yet mature enough to demonstrate CHA's full intended role.

Posture: `DISTINCT_BUT_RUNTIME_VERTICAL_INCOMPLETE`.

## 5. Runtime Resource Authority Versus Attribute Metadata

This is a material authority distinction.

### Authored metadata in `packages/content/base/player/attributes.json`

It currently describes:

- HP: VIT + CON, secondary STR;
- MP: INT + WIS + SPT, secondary CHA;
- Stamina: CON + AGI, secondary STR.

Individual records additionally contain per-point resource influence hints, including small DEX/CHA/etc values.

### Actual live resource engine in `packages/shared/types/src/player-resources.ts`

Current resource maxima use:

- HP: CON + VIT, 4 per point above/below baseline 10;
- MP: INT + SPT, 4 per point;
- Stamina: AGI + CON + VIT, 3 per point.

Natural regeneration uses the same attribute groupings plus origin growth and body-state effects.

Therefore:
- STR is not currently a runtime HP/Stamina maximum/regen contributor;
- WIS and CHA are not current runtime MP maximum/regen contributors;
- VIT is a runtime Stamina contributor even though the top-level authored binding calls STR secondary instead;
- the per-point `resourceInfluence` object is not currently consumed by runtime code.

Disposition: `METADATA_RUNTIME_DRIFT_REQUIRES_FUTURE_FOCUSED_RECONCILIATION`.

Do not fix this casually. A future decision must choose whether:
1. the runtime formula is the intended authority and metadata should be corrected;
2. the richer authored metadata should become executable;
3. a new explicit shared resource formula authority should replace both.

## 6. Skills: Learned Proficiency Versus Attribute Capability

The current architecture correctly keeps skills separate from attributes.

Examples:
- Spotting: WIS + DEX;
- Identify: INT + WIS;
- weapon, armor, survival, knowledge, magic, settlement and crafting skills each declare governing attributes.

Skill rank is independently progressed on the 1-125 scale with breakthrough gates around 30, 55, 80, and 100.

Current execution caveat:
- repository search found `governingAttributes` consumed by schema/content authorities but not by the generic skill-rank gain resolver as a universal attribute multiplier.
- current skill gain therefore remains owner-specific; the governing-attribute arrays are primarily authored relationship metadata today.

This is acceptable at current maturity, but future generalized skill checks/gain must decide whether governing attributes affect:
- action success;
- learning rate;
- maximum potential;
- breakthrough trials;
- only presentation/suitability;
- or a bounded combination.

No universal formula is authorized by this audit.

## 7. Abilities: Technique Layer

Ability records already model a useful classless contract:

- skill-rank requirements;
- minimum attributes;
- handling/equipment context;
- governing skill ids;
- governing attribute ids;
- stamina/resource costs;
- target profile;
- execution/recovery;
- effect and resolution hooks.

Example pattern:
- Sunder requires Axe rank and minimum STR, then carries Axe/Melee governance and STR metadata.

Current execution caveat:
- combat grants actions from abilities already present in `playerState.abilities`;
- the grant path consumes governing skill ids, action timing, costs, targets and hooks;
- no generic action-time resolver was found that re-evaluates every authored minimum skill/attribute/equipment requirement before granting the learned ability action.

Therefore ability requirements currently look more like **content/unlock eligibility intent** than a universal runtime action gate.

Disposition: `GOOD_CLASSLESS_SCHEMA_PARTIALLY_WIRED`.

## 8. Spells: Discipline Plus Attribute Metadata

Spell records distinguish:
- governing magic skill;
- governing attributes;
- school/tradition/element;
- scaling channels;
- MP/Stamina cost;
- targeting;
- compatibility metadata;
- effect/resolution hooks.

Examples:
- many elemental/arcane records use INT + SPT;
- druidic records can use WIS;
- performance magic uses CHA;
- ninjutsu placeholder records use DEX/AGI.

Current execution distinction:
- combat uses spell governing skill and scaling-channel metadata;
- direct combat attribute scaling is presently family-level, e.g. magic offense uses INT plus WIS/SPT rather than reading each spell record's exact `governingAttributes` as a general formula.

Disposition: `RICH_METADATA_RUNTIME_SCALING_STILL_COARSE`.

## 9. Traits

Traits primarily modify downstream channels rather than replacing attributes.

Current examples include:
- skill gain/breakthrough gain;
- resource maxima/regeneration;
- effective skill rank bonuses;
- awareness/movement/combat channels.

The inspected trait catalog does not directly rewrite primary attribute identities as its dominant pattern.

Disposition: `ORTHOGONAL_MODIFIER_LAYER`.

## 10. Character Creation And Origin

The current creator is classless for ordinary new campaigns:

- `newGameSnapshot.ts` resolves the origin with `classId: null`;
- legacy class level is initialized to `0`;
- no class growth is applied to an ordinary new creator.

Attribute creation is instead built from:
1. lineage base attributes;
2. sex/age/height adjustments;
3. backstory adjustments;
4. physique/nature/focus profile weights;
5. exactly 10 generated profile points;
6. an invariant final total of 100.

Important compatibility debt:
- `packages/shared/types/src/player-origins.ts` still contains `PlayerClassProfileRecord`, `PLAYER_CLASS_PROFILES`, class-level resource growth, and related notes.
- those profiles are dormant for ordinary new creators but remain live compatibility scaffolding and must not be mistaken for current product direction.

## 11. Use-Driven Attribute Growth

The stat-growth engine supports all nine attributes with:
- per-attribute load thresholds;
- progress-per-point;
- daily soft caps;
- diminishing returns;
- activity variety;
- lineage growth biases;
- body/nutrition/focus modifiers;
- recovery conversion;
- deterministic variance;
- recovery capacity;
- attribute tension.

Current production load profiles inspected:

| Source | STR | DEX | AGI | CON | VIT | WIS | INT | SPT | CHA |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| travel | 0 | 0 | 0.7 | 0.6 | 0.4 | 0.3 | 0 | 0 | 0 |
| Ashen survey | 0 | 0 | 0.7 | 0.6 | 0.4 | 0.3 | 0 | 0 | 0 |
| general labor | 0.5 | 0 | 0 | 0.6 | 0.5 | 0.2 | 0 | 0 | 0 |
| procurement field | 0 | 0.4 | 0.3 | 0.4 | 0 | 0.3 | 0 | 0 | 0 |

Current production coverage therefore exercises:
- STR, DEX, AGI, CON, VIT, WIS.

It does not yet provide an inspected production load source for:
- INT;
- SPT;
- CHA.

This is not a reason to remove those stats. It is evidence that magic/study/social/crafting verticals have not yet completed their use-driven stat-growth integration.

## 12. Attribute Tension

The current tension system provides useful anti-extreme specialization relationships:

- high STR materially above DEX -> precision penalty;
- high average CON/VIT materially above AGI -> mobility penalty;
- high SPT materially above WIS -> stability penalty.

This helps differentiate the paired attributes rather than making one stat a strict upgrade over another.

Disposition: `PRESERVE_AND_REVISIT_WITH_BALANCE_EVIDENCE`.

## 13. Echo

Current Echo balance tracks all nine attributes and combines three broad components:

- skills: weight `0.5`;
- stats: weight `0.3`;
- knowledge: weight `0.2`.

Every primary attribute appears in the tracked-stat normalization set.

This supports the classless direction: overall development is a composite of practiced skill, developed attributes and knowledge rather than a class-level identity.

## 14. Pairwise Redundancy Review

### DEX versus AGI

Preserve both.

- DEX = fine precision/control.
- AGI = body movement/reflex/economy.
- combat speed uses both;
- melee emphasizes DEX with small AGI;
- ranged uses both;
- growth sources distinguish procurement DEX from movement-heavy AGI;
- tension can make excessive power reduce precision independently of mobility.

Risk: future content must avoid assigning both automatically to every finesse action.

### CON versus VIT

Preserve both.

- CON = sustained exertion/conditioning/stamina.
- VIT = hardiness/recovery/soak.
- both share HP/defense;
- CON is much broader in skill governance and stamina/labor;
- VIT has stronger recovery-capacity and hardiness identity.

Risk: player-facing tooltips and future health systems must make the distinction visible.

### WIS versus SPT

Preserve both.

- WIS = judgment/discipline/practical support.
- SPT = supernatural resonance/channeling.
- magic/healing deliberately combine them;
- SPT/WIS tension encodes unstable raw resonance without judgment.

Risk: WIS currently governs too many unrelated skills while SPT has very narrow skill governance and huge spell governance.

### INT versus WIS

Preserve both.

- INT = analytical/theoretical/process comprehension.
- WIS = practical judgment/discipline/context.
- Identify appropriately uses both;
- magic distinguishes INT-heavy arcane versus WIS-support/druidic roles;
- healing places WIS/SPT above INT.

Risk: knowledge skills must be assigned deliberately rather than defaulting every knowledge domain to INT+WIS.

## 15. Primary Findings

### F-01 — Resource metadata and runtime formulas have drifted

Severity: architecture clarity debt, not current-route blocker.

Owner trigger: next focused resource/attribute integration or player-stat presentation pass.

### F-02 — Skill governing attributes are rich metadata but not yet a universal execution contract

Severity: expected maturity gap.

Owner trigger: first generic skill-check, training, or cross-domain skill-resolution owner.

### F-03 — Ability requirement/governing metadata is ahead of generic runtime gating

Severity: expected maturity gap.

Owner trigger: first ability unlock/eligibility/action-admission authority.

### F-04 — Spell governing-attribute metadata is more granular than current family-level combat scaling

Severity: expected maturity gap.

Owner trigger: effect-bearing spell scaling/balance integration.

### F-05 — INT, SPT, and CHA have stat-growth infrastructure but no inspected ordinary production action-load source

Severity: vertical-integration gap.

Owner trigger: study/crafting/magic/social action owner.

### F-06 — WIS is currently the broadest skill-governance attribute

Severity: balance/content-design watch item.

Do not rebalance from count alone; many WIS references reflect practical perception/judgment domains.

### F-07 — Live class-resource scaffolding remains despite ordinary creator being classless

Severity: compatibility/provenance debt.

Ordinary new creators use `classId: null` and class level `0`; do not reintroduce class gates.

Owner trigger: dedicated legacy class compatibility retirement audit.

## 16. Decision

`PRESERVE_NINE_ATTRIBUTES`

This is **not** a permanent balance acceptance. It means:

- no current attribute is proven redundant;
- all nine have a coherent distinct conceptual role;
- current implementation has enough unique runtime responsibility to retain the model;
- identified wiring/maturity gaps should be resolved by their owning future systems rather than by collapsing the stat model now.

## 17. Recommended Follow-Up

The immediate connector-safe successor should be:

**Classless Progression And Placeholder Provenance Audit**

That pass should classify remaining class/job/FFXI-era player-stat, skill, ability, spell and trait material as:
- current architecture;
- current compatibility scaffold;
- placeholder content;
- historical guidance;
- superseded terminology;
- or future replacement candidate.

It must not delete or rewrite live compatibility structures while `0.6.11.1` is pending.
