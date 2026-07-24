# Elemental Alignment, Temperament, And Magic-Stimulus Audit

Date: 2026-07-23

Run: `Narrative Realization, Mortal Crisis Presentation, And Elemental Ecology Repository Audit And Contract Planning`

Classification: unversioned large documentation-only repository audit and contract planning

Status: audit complete; recommendations are proposal input, not accepted canon

## 1. Execution And Repository-State Confirmation

- Branch: `master`.
- First observed commit: `d2dff9fdf2b35206b5d7be91716aa614640f1ff3`.
- Required fetch/prune and fast-forward pull advanced the pre-edit state to `8bd6ddecf3714da9c222d71b61f9af06953a6395`.
- Starting worktree: clean.
- All prompt source-identity gates passed, including comparative artifact `26ce50958f348f316ab98bcafe31282393709fd6`, accepted defeat decision `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`, and held `0.6.6` blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- No external research was needed or used.

## 2. Canonical Element, Religion, Magic, And Ecology Inventory

The durable design note `docs/simulation-rules/elemental_combat_and_enchanting.md` names eight canonical combat elements:

`Fire`, `Water`, `Earth`, `Wind`, `Thunder`, `Ice`, `Light`, `Darkness`.

Live repository representations:

| Area | Current representation | Audit finding |
| --- | --- | --- |
| religion | eight deities; `stone` used for Earth; Light/Darkness opposition; six-core dominance cycle | strongest authored cosmology source, but no higher-order alignment field |
| religious orders | Light+Water, Wind+Ice, Fire+Stone, Thunder+Darkness; Prismatic all-eight; Unbound Darkness+Fire+Thunder | supplies a coherent alignment hypothesis but is not explicit alignment authority |
| spells | four rows per element using `fire`, `water`, `air`, `earth`, `lightning`, `ice`, `light`, `shadow`; primary families mirror those legacy names | mechanically useful metadata with incompatible vocabulary |
| crystals/infrastructure | affinity vocabularies include `stone`; some schemas allow both `stone` and `earth`; TypeScript institution types omit `earth` | compatibility seam and mirror/schema contradiction |
| combat action | source carries `spellElement`, spell identity, school/tradition/discipline, scaling/effect channels and stable action id | best current active-magic stimulus seed |
| status direction | burn, soaked, earth pressure, wind displacement, thunder interruption, ice chill, light purge/blind, darkness fear/suppression | descriptive future behavior; not an executable relationship matrix |
| monsters | `monsterClass` supports `elemental`; two current elementals: River and Storm | class exists, but records lack explicit element/origin profiles |
| elemental encounters | `encounter.talmyra.stormscar_manifestation` is explicitly hostile | proves one authored hostile context, not baseline temperament |
| ecology/spawn | habitats, regional ecology, climate, water/hazard values, spawn profiles, encounter templates, terrain-sourced `originProfile` shape | many static inputs; no affinity-pressure resolver |
| sacred/magic sites | shrines, temples, great temples, convergence sites, hotspots and magic infrastructure | possible pressure/access sources; no live convergence state |

The River Elemental is described as violent and territorial; the Storm Elemental as aggressive. Both have habitat and combat tags but no optional `elements`, `originProfile`, temperament state, capability list or stimulus-response matrix.

## 3. Aliases And Contradictions

Required normalization boundary:

| Repository term | Canonical projection | Current posture |
| --- | --- | --- |
| `stone` | Earth | accepted legacy world/religion/crystal alias |
| `air` | Wind | spell-family legacy vocabulary; no central adapter |
| `lightning` / electricity | Thunder | spell-family manifestation; no central adapter |
| `shadow` / void | Darkness | spell/lore family; must not create a ninth element |
| `holy` / `divine_light` | Light-associated tradition/family | not a ninth element and not proof of alignment |

Contradictions and missing owners:

- schema, content and TypeScript unions do not use one canonical vocabulary;
- religion pairs deities and defines dominance but never assigns core elements to Light/Darkness;
- monster class treats elementals as monsters and current records are combat-ready/hostile, but no universal hostility rule exists;
- arbitrary `behaviorTags` can say `territorial` or `aggressive` but cannot express typed conditional disposition;
- active casting retains element but not position/area, committed intensity, residue, environmental amplification, conduit/catalyst use, or passive-versus-active enchantment state in an accepted event;
- no fae/nature-spirit/guardian taxonomy exists; “spirit” appears in prose, and a barrow wight is called a guardian, but those are not typed identities;
- regional ecology is flora/fauna/economy oriented and does not own magical affinity pressure.

## 4. Three-And-Three Alignment Options And Recommendation

Exactly three core elements per higher element is a later-decision structural requirement. No mapping is currently canon.

### Working hypothesis from the prompt

```text
Light: Fire, Water, Wind
Darkness: Earth, Ice, Thunder
```

Support:

- Light and Water share the Luminous Tide;
- Darkness and Thunder share the Stormbound Covenant;
- Fire is visibly luminous and Wind commonly carries light/weather imagery.

Tension:

- Gale Veil pairs Wind with Ice;
- Forge Sanctum pairs Fire with Stone/Earth;
- the Unbound explicitly groups Darkness, Fire and Thunder;
- it splits the repository's strongest existing order pairings.

### Stronger repository-coherent alternative

```text
Light: Water, Wind, Ice
Darkness: Fire, Earth, Thunder
```

Support:

- it keeps all four two-deity religious-order pairings on one side: Light+Water, Wind+Ice, Fire+Earth, Thunder+Darkness;
- it matches the current four-female/four-male deity presentation grouping after excluding the higher deity on each side, without treating presentation gender as moral or grammatical authority;
- the Unbound already groups Darkness, Fire and Thunder;
- it preserves the Water>Fire, Ice>Wind, Wind>Earth, Earth>Thunder, Thunder>Water, Fire>Ice dominance cycle across and within alignments without forcing morality.

Tension:

- Darkness-aligned Fire is less immediately intuitive to players who equate visible light with the higher Light element;
- Light-aligned Ice requires clear communication that alignment is metaphysical, not moral warmth;
- deity gender presentation must not become the reason or prose pronoun shortcut for the mapping.

Recommendation for later human/GPT acceptance: prefer `Light = Water, Wind, Ice` and `Darkness = Fire, Earth, Thunder` because it has the strongest internal authored support. Do not accept it without an explicit decision and player-legibility review.

## 5. Environmental Affinity-Pressure Findings

A future resolver should consume typed, time-bounded facts and return a candidate/reinforcement result with provenance, never a generic monster-table roll.

| Element | Candidate pressure inputs |
| --- | --- |
| Fire | active fire/lava/forge, sustained heat/drought, burning vegetation/fuel, volcanic geology, Fire sites/residue |
| Water | rivers, falls, flood, deep/open water, rain, saturated ground, Water sites/residue |
| Earth | exposed rock/ore/clay, quarry/cave/mountain, seismic pressure, masonry mass, Earth sites/residue |
| Wind | exposed altitude/coast/pass, sustained gale, pressure front, open air volume, Wind sites/residue |
| Thunder | active storms/lightning, charged infrastructure, storm coasts/peaks, discharged Thunder magic/residue |
| Ice | freezing climate/season, glacier/snowpack/permafrost, cold water/ice cave, Ice sites/residue |
| Light | rare sustained radiance, accepted sacred/convergence sites, purification/world events, intense aligned core pressure |
| Darkness | rare deep shadow/night convergence, accepted threshold/void sites, world events, intense aligned core pressure |

Contract distinctions:

- core-element environmental manifestation may use ordinary strong environmental pressure;
- Light/Darkness require rarer sacred, convergence, breach or world-event conditions;
- authored encounters bypass dynamic candidacy only because content explicitly places them;
- an existing elemental may be empowered/activated without spawning another;
- active magic/residue is a temporary input with expiry and cannot permanently rewrite ecology;
- candidate generation is separate from encounter selection and AI disposition.

Current data provides terrain, habitat, climate, water/hazard, sacred-site and active-cast fragments. It does not provide one time-aware pressure envelope, magic-residue state or deterministic candidate identity.

## 6. Baseline Temperament And Taxonomy Findings

The proposed passive/curious/territorial/conditionally helpful baseline is compatible with the schema's arbitrary behavior tags but not representable as an authoritative dynamic contract.

Recommended separation:

```text
entity kind
  -> elemental manifestation | fae/nature spirit | summoned/bound entity
     | construct | magical animal | guardian being | ordinary monster

affinities
  -> zero or more canonical elements

baseline temperament
  -> passive | curious | wary | territorial | helpful | predatory | authored hostile

current disposition
  -> derived from context, prior acts, bindings, corruption and stimuli

capabilities
  -> explicit actions, costs, range and eligibility
```

Elemental identity should not be only a `monsterClass` rule. Combat can adapt an elemental into a combatant when hostility or danger requires it. A broader magical-entity authority should own identity, affinities, temperament, capabilities and manifestation; encounter/AI owns current action selection.

Existing hostile River/Storm records remain valid authored or disturbed manifestations. They do not establish that all elementals are hostile.

## 7. Active-Magic Stimulus Findings

Current `CombatActionState` provides:

- stable action id and tick ordering;
- source caster/combatant and targets;
- spell id, school, tradition, discipline and element;
- scaling/effect channels;
- item source and resolution hooks.

It does not adequately provide:

- resolved canonical element after alias normalization;
- spatial origin, area/shape coordinates or distance;
- committed intensity/power band after resolution;
- duration/residue and environmental amplification;
- conduit/catalyst actually consumed or used;
- passive, activated, leaking or discharged enchantment state;
- one retained cast-result event with accepted outcome.

Smallest future authority: a magic-stimulus response resolver consumes an accepted cast/enchantment-result envelope plus an elemental's explicit relationship contract and current context. It returns a typed response intent/effect for AI/encounter handling. It must not duplicate spell resolution or AI action choice.

Response categories should remain distinct: resonance, higher-aligned tolerance, assimilative/nourishing pursuit, countering/disruptive defense, foreign/unresolved caution, and passive-enchantment tolerance.

## 8. Per-Element Relationship Recommendations

These are structured proposals for a later decision, not accepted matrices. “Assimilate” may mean incorporate environmental material, charge or active magic; it does not mean moral hostility.

| Element | Alignment candidate | Same element | Nourishing/assimilable candidates | Countering candidates | Useful capability examples | Hazards / calming inputs |
| --- | --- | --- | --- | --- | --- | --- |
| Fire | Darkness | tolerate/empower | Wind/oxygen; Thunder/charge; dry fuel | Water quenching; Ice/cold; Earth smothering | warmth, light, cautery only if explicit, controlled burning | ignition/smoke; fuel removal, containment, compatible offering |
| Water | Light | tolerate/merge | Ice melt; Earth minerals/sediment; rain/current | Fire vaporization/heat; Thunder conduction danger; hostile freezing | cooling, purification, hydration, transport/current aid | flood/drowning/erosion; channeling, clean basin, flow release |
| Earth | Darkness | tolerate/incorporate | Ice/stone mass; Water-borne sediment; Fire ash/mineral change | Wind erosion/displacement; Water undermining; Thunder fracture | grounding, shelter, brace, path/structure support | collapse/entombment; stable foundation, returned material, reduced vibration |
| Wind | Light | tolerate/expand | Fire/thermal uplift; Thunder/storm charge | Earth barriers; Ice-laden drag; hostile pressure disruption | breathable air, cooling, clearing smoke, movement assistance | falls/exposure/debris; open path, pressure equalization, quiet air |
| Thunder | Darkness | tolerate/charge | Wind/storm motion; Water conduction; Fire/energetic discharge | Earth grounding; insulating Ice; dispersal by controlled sinks | signal, stimulation only if explicit, power/ignition, hazard warning | shock/fire/interrupt; grounding, discharge path, charge dissipation |
| Ice | Light | tolerate/crystallize | Water mass; Wind/cold; Earth/mineral lattice | Fire/heat; Thunder fracture; Water flow/erosion at phase change | preservation, cooling, swelling control if explicit, stable surface | freezing/brittleness/entrapment; controlled warmth, insulation, reduced flow |

Directional behavior matters. Wind may nourish Fire while Fire does not “consume Wind” symmetrically; Water conducts Thunder without nourishing Water; Earth may ground Thunder while Thunder fractures Earth. Do not force a symmetric rock-paper-scissors table.

Immediate aggression should require an explicit high-confidence countering active stimulus within relevant range/intensity or another authored trigger. Passive equipment remains tolerated unless activated, leaking, deliberately presented, overwhelming or environmentally destabilizing.

## 9. Beneficial Capability Findings

Static spells and setting content provide vocabulary for warmth, water breathing/mending, air support, earth renewal, lightning surge, ice preservation, Light restoration and shadow concealment/drain. Those names do not authorize an elemental to execute them.

Future capability families may include warming/shelter, cooling, purification, breathable air, grounding, illumination, concealment, path guidance, hazard warning, poison suppression, process-specific stabilization, wards, transport, body preservation and aligned amplification.

Every aid result requires:

- present entity and stable identity;
- explicit capability;
- current disposition/cooperation;
- knowledge and communication/trigger;
- range, target and environmental prerequisites;
- cost/resource and accepted event id;
- an owner-approved health/magic effect.

`benevolent`, `helpful`, passive or aligned is never itself a healing hook. Generic healing cannot regrow anatomy or resurrect. Resurrection remains death/Stakes/magic authority.

## 10. Fae, Spirit, And Guardian Separation

Repository search found no typed fae/faye, pixie, sprite, familiar, sacred-beast or nature-spirit records. “Spirit” occurs in the prose descriptions of the two elementals, and “guardian” occurs descriptively for a barrow wight and institutions. These do not establish taxonomy.

Minimum future taxonomy must distinguish:

- true environmental elemental manifestations;
- fae/nature spirits with affinities but independent culture/behavior;
- summoned or bound entities whose controller/contract matters;
- constructs whose material/program/binding matters;
- magical animals whose species ecology remains primary;
- guardian beings whose duty/site is primary;
- corrupted/altered variants;
- ordinary monsters with elemental affinity.

All may have affinities, temperament, capabilities, manifestation requirements and cultural/religious associations. None becomes an elemental merely by using elemental magic.

## 11. Mortal Crisis And Narrative Integration

Elemental facts eligible for a narrative envelope:

- entity id/kind, observer-safe name and grammatical profile;
- accepted presence/manifestation provenance;
- visible form/material only when observed;
- cast stimulus id, canonical element, source, place/area and visible effects;
- accepted response category and action;
- environmental material actually incorporated;
- intervening actors/actions and chronology;
- explicit beneficial capability and accepted outcome;
- observer recognition/knowledge and hidden-fact list.

Hidden engine truth includes raw pressure values, seeds, private intent, unobserved relationship rules and exact AI scores. Prose may say a Fire elemental turned toward Selene's gust and drew nearby flame/brush into itself only when those actions/materials are accepted facts. It must not invent hunger, anger or strategy from `assimilative_pursuit`.

Elemental projection uses the shared narrative engine; it must not generate independent combat-log strings as a second prose authority.

## 12. Recommended Owner Graph

```text
canonical element + alias authority
  -> authored entity identity / affinities / temperament / capabilities

environment + sacred/magic events
  -> affinity-pressure resolver
      -> deterministic manifestation candidate
          -> encounter selection and entity presence

accepted cast/enchantment result
  + elemental relationship contract
  + current environment/disposition
      -> stimulus-response result
          -> AI/encounter action selection
              -> retained factual event
                  -> shared narrative fact envelope
```

Forbidden parallel authorities:

- spell tags independently choosing elemental AI behavior;
- encounter hostility redefining species-wide temperament;
- narrative prose inventing intent/capability;
- Light/Darkness alignment implying moral good/evil;
- beneficial disposition directly mutating health;
- magic residue permanently editing ecology without an accepted world event.

## 13. Future Test Matrix

- eight canonical elements and `stone -> earth`, `air -> wind`, `lightning -> thunder`, `shadow -> darkness`;
- exactly three core alignments per higher element after acceptance;
- higher element tolerates itself and its three aligned cores;
- same-element resonance;
- assimilative response distinct from defensive hostility;
- directional relationship behavior;
- passive enchantment tolerated; activated/leaking incompatible enchantment responds;
- insufficient pressure yields no dynamic candidate;
- strong terrain/weather/sacred pressure yields deterministic candidate;
- higher element requires rarer convergence;
- existing elemental can strengthen without duplicate spawn;
- temporary residue expires without permanent ecology mutation;
- helpful action requires explicit capability and present entity;
- authored hostile elemental remains valid;
- benevolent Darkness-aligned and hazardous Light-aligned fixtures;
- fae/guardian affinity does not change entity kind;
- same source event produces stable response across replay;
- narrative projection preserves entity, cast, equipment, environment and observer knowledge.

## 14. Unresolved Decisions

- final three-and-three mapping;
- canonical alias adapter ownership and migration posture;
- magical-entity taxonomy and relationship to `monster`;
- pressure input vocabulary, accumulation/decay and candidate identity;
- per-element relationship matrices and directional semantics;
- baseline temperament vocabulary and context overrides;
- accepted cast-result, residue and enchantment-activation contracts;
- beneficial capability catalog and health/magic adapters;
- first fae/spirit/guardian content authority;
- which static monster/ecology route, if any, consumes the later decision.

## 15. Explicit Non-Decisions And Limitations

This audit does not accept the recommended alignment, relationship tables, temperaments, capabilities, spawn rules, probabilities or taxonomy field names. It does not modify religion, monsters, spells, schemas, runtime, AI, encounters, saves, tests or content.

The artifact is retained for:

1. `Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision`;
2. a later elemental ecology/spawn implementation prompt;
3. a later magic-stimulus/AI behavior implementation prompt;
4. the held static monster/ecology route only if a later explicit integration decision requires it.

