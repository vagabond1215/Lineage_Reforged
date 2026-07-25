# Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision

Date: 2026-07-25

Run: `Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision`

Status: accepted documentation-only design authority; no schema, runtime, save, migration, content, AI, spawning, combat, UI, test, dependency, balance, formula, timer, loot, reward, or gameplay implementation is authorized

Classification: unversioned durable documentation-only design-authority decision

Milestone impact: `supports_current_band`

## 1. Status, Scope, And Source Verification

This decision establishes the bounded elemental canon and ownership needed before later elemental implementation or Mortal Crisis integration. It decides identity, aliases, higher alignment, environmental evidence, manifestation categories, magical-entity taxonomy, temperament and disposition boundaries, magical stimuli, directional relationships, deterministic response posture, capability-gated aid, escalation, persistence, and narrative integration.

The execution gate passed on `master` at pre-edit commit `ddfed7497a016496c1f4a2deb71c3128d5260689`, with a clean worktree and `origin/master` at the same commit after fetch and fast-forward pull. The following controlling identities were verified:

- completed elemental research commit `b30119cc5e1d9111e6a8db967e8fc3e7b08b71bf` is an ancestor of `HEAD`;
- elemental audit blob `974e84f89805ba3e6789331183b474fce7f30d36`;
- grounded elemental research blob `909b2bc1d36539880780f2a48b473ccc725333dd`;
- accepted narrative decision blob `879c8e0b419eb429fe5af2022ef647f175b130f4`;
- pre-decision handoff blob `19d4c373975d4030973ef9254bbd6ee3b7e66930`;
- pre-decision route-register blob `d9707336416d1b79c7f6587030a26b0d39a39c16`;
- held `Version 0.6.6` prompt remains available as Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

The audit and research remain evidence. This artifact is the controlling elemental design authority. Existing domain owners remain controlling except where this artifact explicitly clarifies an elemental seam.

## 2. Executive Decision

Accept exactly eight canonical elemental identities:

```text
Fire
Water
Earth
Wind
Thunder
Ice
Light
Darkness
```

Accept this higher alignment:

```text
Light: Water, Wind, Ice
Darkness: Fire, Earth, Thunder
```

Higher alignment is metaphysical compatibility. It is not morality, benevolence, malice, temperature, visible brightness, deity sex or gender, religious obedience, temperament, hostility, helpfulness, sapience, or capability.

Accept this controlling owner graph:

```text
world / magic / site / entity owners
  -> owner-certified affinity contributions and magical occurrences
  -> locality- and time-bounded affinity observation
  -> manifestation eligibility and accepted transition
  -> persistent presence or entity identity
  -> perceived or directly interacting stimulus
  -> temperament + target-relative disposition + condition + scoped memory
  -> capability and precondition eligibility
  -> deterministic response policy
  -> accepted upstream action and outcome
  -> elemental interaction evidence
  -> observer projection and narrative realization
```

No arrow runs backward from prose, display labels, encounter weights, monster tags, hashes, or current presentation into elemental identity, affinity, behavior, capability, or outcome.

## 3. Accepted Vocabulary

- **Canonical element:** one of the eight intrinsic elemental identities accepted by this decision.
- **Applied label:** source vocabulary used for lore, tradition, spell family, material, effect, manifestation, religion, display, or compatibility without creating another canonical element.
- **Affinity contribution:** a provenance-bearing fact supplied by its owning world, magic, site, or entity authority.
- **Affinity observation:** a bounded consumer projection over contributions at a locality and time; it is not a replacement owner.
- **Ambient manifestation:** an accepted elemental condition or phenomenon without independent agent identity.
- **Transient coherent presence:** a locally coherent elemental presence whose identity or persistence remains bounded by its accepted transition.
- **Discrete manifestation:** an accepted identity-bearing transition that creates, attracts, awakens, reveals, or materially changes a presence or entity.
- **Elemental entity:** an identity whose constitutive being is an elemental manifestation or embodiment.
- **Temperament:** an authored or retained repeatable prior across comparable contexts.
- **Disposition:** mutable posture toward a specific actor, group, place, object, activity, relationship, or stimulus.
- **Condition:** current physical, magical, environmental, resource, binding, corruption, injury, empowerment, depletion, or dormancy constraints.
- **Scoped memory or familiarity:** retained causal history relevant to a particular source, actor, place, relationship, or stimulus class.
- **Stimulus:** a normalized accepted magical occurrence, direct interaction, or perceivable cue eligible for a response policy.
- **Response:** the deterministic policy selection made after capability and precondition eligibility.
- **Action request:** a response-owned request to the authoritative action or effect owner.
- **Accepted outcome:** the result committed by the authoritative upstream owner.

These concepts are orthogonal. A stable identity does not prove a role; a role does not grant a capability; temperament does not prove current disposition; disposition does not select an action; and an action does not retroactively prove universal temperament.

## 4. Canonical Element And Alias Authority

Canonical identity and applied vocabulary are separate:

| Existing term | Accepted posture |
| --- | --- |
| `stone` | Earth legacy world, religion, crystal, material, or applied label |
| `air` | Wind legacy spell-family or applied manifestation label |
| `lightning` / electricity | Thunder manifestation, effect family, or applied label |
| `shadow` / void | Darkness-associated manifestation or lore label where source context establishes the association |
| `holy` / `divine_light` | Light-associated tradition, effect, religious, or presentation label; never a ninth element |

Aliases do not create additional elements and cannot independently determine behavior. Future canonical-identity authority owns intrinsic element identity. Existing content owners retain their authored labels, and later adapters may preserve the source term, source identity, revision, and projection to a canonical element. Display, lore, religion, tradition, spell-family, effect, manifestation, material, and legacy labels remain with their existing owners.

No immediate migration, rename, union edit, schema change, or content rewrite is required or authorized. Ambiguous `shadow`, `void`, `holy`, or similar language must remain an applied label unless its owner explicitly establishes the canonical projection.

## 5. Accepted Three-And-Three Mapping And Rejected Alternative

The accepted mapping is:

| Higher element | Aligned core elements |
| --- | --- |
| Light | Water, Wind, Ice |
| Darkness | Fire, Earth, Thunder |

This mapping preserves the repository's strongest authored pairings: Light with Water, Wind with Ice, Fire with Earth/Stone, and Thunder with Darkness. It also matches the Unbound grouping of Darkness, Fire, and Thunder.

The rejected alternative was:

```text
Light: Fire, Water, Wind
Darkness: Earth, Ice, Thunder
```

That alternative preserved a conditional Fire-Light example and an intuitive association between flame and visible radiance, but it split the stronger religious-order pairings and the Unbound grouping. The earlier Fire-Light example was conditional and remains useful only for directional relationship semantics.

Player-facing material must make clear that Light-aligned Ice can be dangerous and Darkness-aligned Fire can be helpful. Visible brightness, warmth, cold, deity presentation, and familiar good/evil symbolism are not alignment tests. Existing content remains compatible through alias projection and authored context; this decision does not rewrite religion or spell records.

## 6. Higher-Element Compatibility And Rarity

Default compatibility sets are:

```text
Light: Light, Water, Wind, Ice
Darkness: Darkness, Fire, Earth, Thunder
```

A higher elemental ordinarily tolerates itself and its three aligned core elements. A core elemental ordinarily tolerates or resonates with itself and ordinarily tolerates, defers to, or cooperates with its aligned higher element when authored context and current conditions permit.

“Tolerates” means element identity alone does not trigger a response. It does not suppress direct attack, binding, corruption, territorial conflict, resource competition, authored hostility, incompatible intensity, or another accepted cause.

The opposite higher element and nonaligned cores require explicit directional policy. No automatic moral opposition is inferred. Light and Darkness manifestations are rarer than core manifestations. Ordinary terrain alone is normally insufficient; a higher manifestation ordinarily requires an accepted sacred or convergence site, breach, exceptional world event, rare sustained aligned phenomenon, or intense convergent aligned-core evidence.

Alignment grants no healing, corruption, religion, sapience, hostility, helpfulness, communication, or other capability.

## 7. Owner Graph And Cycle Prevention

| Layer | Owner responsibility |
| --- | --- |
| World, environment, settlement, site, magic, and entity owners | Produce source-certified facts and accepted occurrences |
| Affinity observation | Project relevant contributions for a bounded locality, time, and question |
| Manifestation transition | Determine candidacy and accept or reject an ambient or identity-bearing transition |
| Presence/entity identity | Retain origin, identity, locality, persistence, capabilities, condition, relationships, and transitions |
| Perception/recognition | Establish what interaction or cue the entity can detect or recognize |
| Temperament/disposition/memory | Supply retained priors and current target-relative context |
| Response policy | Determine eligible responses and select one deterministically |
| Action/effect owners | Accept or reject action requests and commit outcomes |
| Elemental evidence adapter | Certify event-time facts and provenance for downstream presentation |
| Narrative authority | Project observer-safe facts and realize validated presentation |

Forbidden cycles include:

- an entity's existence proving the source that created it;
- narrative, Chronicle, Manuscript, UI, or display labels creating elemental facts;
- encounter hostility or spawn weighting defining species temperament;
- arbitrary tags or spell labels selecting behavior;
- response selection manufacturing capability;
- current state reconstructing an unretained historical transition;
- runtime loading state becoming in-world persistence;
- aid, alignment, or benevolence mutating another owner's state directly.

An entity may affect its environment only through a separately accepted effect recorded as a new contribution with its own cause. That new contribution may later affect observation without circularly proving the entity's origin.

## 8. Affinity Evidence-Family Boundary

Affinity is a heterogeneous family of owner-certified evidence, not one universal canonical scalar.

Every future contribution conceptually needs a source owner and revision, canonical element or supported applied projection, locality or extent, effective or observation interval, intensity category, persistence posture, and cause. A bounded observer may aggregate only the contributions relevant to its task. It must preserve provenance and must not replace terrain, climate, weather, water, geology, vegetation, settlement, sacred-site, magic, or entity truth.

Entry and persistence or exit conditions may differ. Current observation alone cannot reconstruct why a transition occurred. Active magic and residue are temporary unless a world owner separately accepts a durable change. Correction of a contribution must be traceable into affected observations and candidates.

Exact fields, weights, equations, thresholds, decay, recovery, accumulation, and public terminology remain deferred.

## 9. Environmental Source Categories And Locality

Accepted candidate evidence classes are:

| Element | Candidate environmental evidence |
| --- | --- |
| Fire | active fire, lava, forge heat, sustained heat or drought, burning fuel, volcanic geology, Fire sites or residue |
| Water | rivers, falls, floods, deep or open water, rain, saturated ground, Water sites or residue |
| Earth | exposed rock, ore, clay, quarry, cave, mountain, seismic pressure, masonry mass, Earth sites or residue |
| Wind | exposed altitude, coast, pass, sustained gale, pressure front, open-air volume, Wind sites or residue |
| Thunder | active storm, lightning, charged infrastructure, storm coast or peak, discharged Thunder magic or residue |
| Ice | freezing climate or season, glacier, snowpack, permafrost, cold water, ice cave, Ice sites or residue |
| Light | rare sustained radiance, accepted sacred or convergence site, purification or world event, intense aligned-core evidence |
| Darkness | rare deep-shadow or night convergence, accepted threshold or void site, world event, intense aligned-core evidence |

These are evidence candidates, not guarantees or spawn formulas. Potential contributing owners include terrain, geology, water, climate, weather, vegetation and fuel, settlement industry, infrastructure, sacred sites, convergence, breaches, world events, active magic, residue, and existing entities' accepted effects.

Locality must be explicit enough for the consuming decision: object, actor, site, cell, route segment, settlement, habitat, region, or another bounded area; overlap and adjacency remain distinct. Observation time, effective interval, historical residue, and authoritative extent remain distinct.

## 10. Ambient Versus Discrete Manifestation

These states and origins remain separate:

1. ambient elemental condition or phenomenon without an agent identity;
2. transient coherent presence;
3. discrete persistent entity;
4. authored placed entity;
5. summoned or bound entity;
6. existing entity reinforced, awakened, revealed, or activated by environmental evidence.

Strong evidence may create candidacy without guaranteeing a transition or encounter. Authored placement is a content decision, dynamic manifestation is a transition decision, encounter selection is a consumer decision, and reinforcement changes an existing identity rather than duplicating it.

Ambient effects do not silently become characters. A discrete identity requires an accepted identity-bearing transition with provenance. Removing a source may change support, condition, eligibility, or persistence, but it does not silently destroy an independently persistent entity.

## 11. Persistent Entity Identity And Reinforcement

An elemental presence or entity retains enough conceptual identity to distinguish origin or arrival, locality, support dependency, accepted reinforcement and depletion, scoped memory, current condition and posture, last transition, causal evidence, policy version, and recoverability where persistence later requires them.

Reinforcement may strengthen, awaken, stabilize, reveal, or activate an existing identity only through an accepted effect. It must not create a duplicate identity, reset consequences, or rewrite origin. Source recreation, repeated stimulus, save/load, or unload/reload must not duplicate identity, drops, favorability, capabilities, rewards, or consequences.

Exact identity composition, storage, conservation, respawn, anti-farming, reward, and reappearance rules remain with later owners.

## 12. Magical-Entity Taxonomy

The following categories are distinct conceptual identity postures:

1. **Environmental elemental manifestation:** identity is fundamentally tied to elemental manifestation or embodiment.
2. **Fae or nature spirit:** may have elemental affinities but possesses independent identity, culture, relationship, or behavioral foundations.
3. **Summoned or bound entity:** controller, summoner, contract, service, or binding is materially relevant.
4. **Construct:** material, crafted structure, program, animating principle, or binding is materially relevant.
5. **Magical animal:** biological or species ecology remains primary despite magical capability or affinity.
6. **Guardian being:** duty, site, institution, oath, relationship, or protection role is primary rather than elemental substance.
7. **Corrupted, transformed, or altered variant:** modification and its provenance remain separate from base identity.
8. **Ordinary monster or creature with elemental affinity:** affinity does not convert entity kind.

These categories may overlap only through explicitly separate axes. Stable identity, embodiment, constitutive origin, provenance, agency limits, and persistence remain distinct from affinities, capabilities, roles, relationships, service or binding posture, condition, temperament, disposition, action, and combatant adaptation.

`guardian`, `territorial`, `helpful`, `predatory`, `defensive`, `hostile`, `benevolent`, and `aggressive` are not substance or moral classes by default. `monsterClass` and combatant adaptation do not own broader entity identity. Fae, pixies, spirits, guardians, constructs, magical animals, monsters, and elementals may each be helpful or hostile according to identity, capability, relationship, and context.

Exact schemas, inheritance, unions, collections, content records, sapience bands, communication, reproduction, mortality, and binding rules remain deferred.

## 13. Temperament, Disposition, Condition, Memory, And Action

The accepted layers are:

1. **Temperament prior:** repeatable authored or retained tendency across comparable contexts.
2. **Target-relative disposition:** mutable posture toward a particular actor, group, place, object, activity, relationship, or stimulus.
3. **Condition and scoped memory:** current constraints, resources, familiarity, habituation, sensitization, corruption, binding, injury, depletion, empowerment, or dormancy.
4. **Selected response or action:** one deterministic policy result.

`passive`, `curious`, and `wary` may describe temperament or current posture only when the owner states which. `territorial` and `guardian-like` require a boundary, resource, charge, duty, place, or relationship. `cooperative` and `helpful` require a target and eligible capability. `assimilative`, `defensive`, `predatory`, and `authored-hostile` describe a relationship or response posture only with an object, cause, and context; they are not moral identities.

Habituation and sensitization are stimulus-specific, causally retained, and capable of context-specific recovery or renewed escalation. No global pacification or hostility value is accepted.

The River and Storm elementals remain valid hostile authored examples. They do not establish universal hostility, morality, sapience, temperament, or species behavior.

## 14. Active/Passive And Authoritative/Perceived Stimulus Boundary

A future stimulus boundary must distinguish:

- active casting, channeling, ritual, attack, healing, warding, summoning, dispelling, or deliberate manipulation;
- passive enchantment, carried artifact, ward, residue, ambient field, attunement, lineage trait, or latent capability;
- authoritative occurrence from perceived or recognized cue;
- direct magical interaction from observation;
- source, target, locality, area, range, and duration;
- canonical element from applied manifestation or alias;
- committed intensity or power category after upstream resolution;
- novelty, familiarity, habituation, and sensitization;
- directional compatibility;
- ownership, consent, binding, deliberate presentation, and hostile targeting where relevant;
- activated, leaking, discharged, dormant, or merely carried enchantment state;
- recognition confidence and observer knowledge.

The stimulus owner consumes accepted magic results. It does not resolve spells, create effects, infer elements from prose, or execute arbitrary tags.

Passive equipment is not casting. It is ordinarily tolerated unless an accepted policy qualifies activation, leakage, deliberate presentation, overwhelming intensity, direct contact, or environmental destabilization as a stimulus. Direct magical contact may qualify without prior visual recognition where the policy and authoritative interaction allow it.

## 15. Directional Relationship Categories

Accept these conceptual categories:

- same-element resonance or tolerance;
- aligned-higher tolerance, deference, attraction, or cooperation;
- assimilable, nourishing, incorporable, or resource-seeking stimulus;
- countering, quenching, grounding, disruptive, defensive, or adversarial stimulus;
- foreign, unresolved, cautious, or observation-only stimulus;
- passive-enchantment tolerance;
- authored relationship, corruption, binding, territorial, or exceptional-context override.

Relationships are directional. One side's nourishment may be the other side's hazard. Context, range, intensity, target, consent, ownership, current condition, and locality matter. A relationship category does not itself select attack, aid, pursuit, assimilation, warning, or withdrawal.

Assimilation may involve magic, charge, heat, moisture, material, motion, or another accepted environmental resource. It is not automatically hunger, hatred, combat, or moral aggression. Countering may produce avoidance, suppression, warning, defense, or attack only after policy eligibility.

## 16. Accepted Six-Core Directional Matrix

| Element | Higher alignment | Same element | Assimilable or nourishing candidates | Countering or disruptive candidates |
| --- | --- | --- | --- | --- |
| Fire | Darkness | tolerate, resonate, empower | Wind or oxygen, Thunder or charge, suitable dry fuel | Water, Ice or cold, Earth or smothering mass |
| Water | Light | tolerate, merge, flow | Ice melt, Earth minerals or sediment, rain or current | Fire or intense heat, hostile Thunder conduction, hostile freezing |
| Earth | Darkness | tolerate, incorporate, stabilize | Water-borne sediment, Fire ash or mineral change, compatible stone or Ice mass | Wind erosion or displacement, Water undermining, Thunder fracture |
| Wind | Light | tolerate, expand, circulate | Fire thermal uplift, Thunder or storm motion | Earth barriers, Ice-laden drag, hostile pressure disruption |
| Thunder | Darkness | tolerate, charge, discharge | Wind or storm motion, Water conduction, Fire or energetic discharge | Earth grounding, insulating Ice, controlled sinks or dissipation |
| Ice | Light | tolerate, crystallize, preserve | Water mass, Wind or cold, compatible Earth or mineral lattice | Fire or heat, Thunder fracture, disruptive Water flow or phase change |

This matrix is conceptual and directional. It does not establish symmetry, scores, priorities, formulas, probabilities, damage relationships, AI actions, or balance values.

## 17. First Deterministic Response Posture

Accept the smallest safe first posture:

```text
normalized accepted stimulus and context
  -> capability and precondition eligibility
  -> small explicit response-state policy
  -> deterministic candidate ordering and tie posture
  -> selected response
  -> accepted action request and upstream outcome
  -> retained causal evidence
```

Capability and preconditions determine eligibility before ranking. Selection cannot manufacture capability. Utility may later rank already eligible responses only after a separate need is proven. Behavior trees may later orchestrate broader reactive behavior only after a bounded evaluation proves need.

GOAP, BDI, full planners, external ontology engines, production behavior-tree or AI libraries, and canonical-serialization dependencies are not accepted. If randomness is later authorized, it requires stable event and draw identity plus deterministic tie behavior. Hashing or canonical serialization cannot define semantic equivalence.

## 18. Response Identity And Provenance

Future response identity conceptually retains:

- normalized stimulus identity and semantic version;
- authoritative context and event time;
- entity identity and state revision;
- policy identity and version;
- perception and recognition result;
- candidate responses;
- material eligibility and rejection reasons;
- ordering or score components where applicable;
- tie-break posture;
- authorized random identity if later accepted;
- selected response;
- causal parents;
- accepted action and outcome;
- correction or supersession lineage.

Determinism means that the same accepted initial state, policy version, normalized inputs, event order, and authorized random identity produce the same selection. It does not mean all entities behave identically.

Exact interfaces, storage, serialization, seeds, hashing, formulas, and packages remain deferred.

## 19. Helpful And Benevolent Capability Gates

Every helpful outcome requires:

1. a present entity or accepted presence identity;
2. an explicitly possessed capability applicable to the target or problem;
3. a qualifying perceived or direct trigger;
4. disposition, relationship, role, consent, and policy eligibility;
5. range, access, environment, knowledge, and current-condition eligibility;
6. resource, cost, cooldown, sacrifice, risk, or comparable constraint where applicable;
7. deterministic response selection;
8. acceptance by the owning treatment, health, magic, travel, quest, economy, inventory, or environmental system;
9. retained capability, trigger, cost, action, and outcome evidence.

Potential future capability families include warning, guidance, illumination, concealment, warmth, cooling, breathable air, purification, grounding, shelter, preservation, wards, transport assistance, resource provision, process-specific stabilization, and aligned amplification. These are vocabulary candidates, not universal grants or executable effects.

`benevolent`, `helpful`, `passive`, `aligned`, `fae`, `pixie`, `spirit`, or `guardian` is never a healing hook. Generic aid cannot regrow anatomy or resurrect. Elemental intervention cannot appear after defeat without a present eligible entity, qualifying cause, deterministic selection, and accepted upstream outcome. Aid cannot bypass treatment, route, quest, economy, inventory, consent, cost, consequence, or death authorities.

## 20. Warning, Escalation, And De-Escalation

Accept an authored graph of eligible postures and actions:

```text
presence -> attention -> boundary or warning display -> guarded posture
         -> aid | withdrawal | interception | pursuit | attack | dormancy
```

This is not a universal linear ladder. Severe accepted stimuli may skip warning stages. De-escalation requires an accepted cause such as withdrawal, consent, restitution, recognized familiarity, changed conditions, resource relief, successful communication, or binding release.

Observer-visible orientation, movement, distance, cue, boundary behavior, action, and outcome remain separate from hidden temperament, exact disposition, policy branch, motive, scores, future action, and unrecognized identity. Warning does not guarantee attack; absence of warning does not prove friendliness. Habituation and renewed escalation remain scoped and causal.

No universal hostility meter owns aid, warning, pursuit, attack, retreat, or relationship.

## 21. Migration, Dormancy, Dispersal, Dissolution, Death, Unloading, And Correction

- **Migration or displacement:** the same identity changes locality through an accepted transition.
- **Dormancy:** identity persists while activity, perception, or action is suspended or bounded.
- **Dispersal:** a coherent presence loses local concentration; its identity consequences remain with its owner.
- **Dissolution or transformation:** an accepted in-world terminal or identity-changing outcome.
- **Death or destruction:** an upstream consequence owner accepts a terminal outcome.
- **Binding or release:** relationship or control state changes through accepted authority.
- **Corruption, purification, or alteration:** a retained transformation distinct from base identity.
- **Runtime unloading or despawn:** an implementation optimization only, never an in-world outcome.
- **Correction or supersession:** invalid or revised state is corrected with provenance, not narrated as death or dissolution.

Persistence later must retain enough origin, locality, support, reinforcement, depletion, memory, posture, transition, causal, policy, and recoverability evidence to distinguish these outcomes. Exact timers, respawn, conservation, loot, rewards, and anti-farming rules remain deferred.

## 22. Narrative And Observer Integration

The accepted narrative pipeline remains:

```text
accepted elemental facts and outcomes
  -> owner-certified event-time elemental interaction evidence
  -> observer projection
  -> scene and beat planning
  -> referent and grammar resolution
  -> deterministic realization
  -> validation and fallback
  -> UI / Chronicle / Manuscript
```

Elemental evidence may include entity identity and kind; observer-safe name and grammatical identity; manifestation provenance; observed form or material; stimulus identity, canonical element, applied label, source, target, locality, and visible effect; perception and recognition; selected response and accepted action; material actually incorporated or affected; explicit capability and accepted outcome; chronology, intervening actors, corrections, policy identity, and observer-allowed facts.

Narrative may present only accepted visible orientation, movement, warning, withdrawal, pursuit, attack, aid, material incorporation, environmental change, or dormancy. It may not infer hatred, gratitude, hunger, guardianship, sapience, strategy, religion, morality, capability, intent, or future behavior from response categories.

Chronicle and Manuscript remain projections. Neither may reconstruct elemental state after reload or become the source of affinity, identity, disposition, response, or outcome.

## 23. Campaign, Defeat, Injury, Restoration, Death, Resurrection, And Stakes Boundary

Campaign rules, initial `normal_stakes`, current save topology, Normal Stakes defeat fallback, injury and trauma, magical restoration, restricted-Stakes death closure, resurrection, Prestige, estate, and succession remain upstream and unchanged.

Normal Stakes ordinary HP zero remains defeat or incapacitation rather than implicit terminal death under current authority. Restricted Stakes retains atomically committed actual death as terminal under its current authority. This elemental decision grants no resurrection exception, generic anatomical restoration, automatic rescue, post-defeat intervention, rollback, new public Stakes tier, Prestige rule, or succession outcome.

Elemental capability families may later request owner-approved effects only. They do not own crisis timing, route selection, treatment, death, resurrection eligibility or aftereffects, final closure, checkpoint commitment, rewards, or continuity.

## 24. Authority Retention And Supersession Matrix

| Existing authority or seam | Disposition | Effect of this decision |
| --- | --- | --- |
| Elemental combat and enchanting rules | retained and clarified | Eight intrinsic elements and Earth/stone posture remain; combat/status resolution and balance remain deferred |
| Religion and religious-order content | retained and clarified | Authored labels and pairings support the accepted three-and-three mapping; religion does not own behavior or morality |
| Spell and applied-element vocabularies | retained and narrowed as identity authority | Existing labels remain compatible; they cannot create canonical identities or select responses |
| Crystals and infrastructure | retained and clarified | Existing affinity labels and infrastructure may later contribute owner-certified evidence; no migration or effect is authorized |
| Magic charter and runtime boundary | retained | Magic owners resolve casts and effects; elemental stimulus consumes accepted results |
| Monster record/class and River/Storm elementals | retained and narrowed as universal authority | Records remain valid authored hostile examples; `monsterClass` and tags do not own broad elemental identity or temperament |
| Encounter hostility and spawn selectors | retained and narrowed | They select authored encounter contexts; they do not define entity identity, manifestation, or universal disposition |
| Habitat, climate, terrain, water, hazard, sacred/convergence, and ecology content | retained and clarified | May supply owner-certified evidence; no field, weight, threshold, or dynamic manifestation is implemented |
| Favorability and relationship seams | retained; integration deferred | May later contribute target-relative relationship facts but do not replace elemental disposition or response authority |
| Knowledge, Chronicle, Manuscript, and presentation | retained and narrowed | Remain projections and cannot reconstruct or own elemental facts |
| Accepted narrative-realization decision | retained and controlling downstream | Supplies shared evidence, observer, grammar, realization, validation, and fallback authority |
| Campaign, defeat, injury/restoration, death, resurrection, and Stakes authorities | retained | Remain upstream; no outcome or exception changes |
| Held `0.6.6` and retained `0.6.7` routes | retained unchanged | No restoration, regeneration, reassignment, or implementation authorization |

The deliberate supersession is conceptual only: any earlier implication that aliases are separate elements, that River/Storm hostility is universal, that `monsterClass` owns elemental identity, that passive equipment equals casting, or that despawn is an in-world removal is rejected. No existing file is edited or migrated by this decision.

## 25. Future Implementation-Package Order Without Permission

If separately authorized, later work should proceed in this order:

1. canonical element and alias contracts;
2. magical-entity identity, affinity, role, capability, and relationship boundaries;
3. owner-certified affinity-contribution vocabulary;
4. bounded locality/time observation and manifestation-transition contracts;
5. persistent presence/entity state and provenance;
6. active/passive magic-stimulus result boundary;
7. temperament, disposition, condition, memory, and response policy;
8. capability eligibility and upstream effect adapters;
9. deterministic response identity and correction handling;
10. warning and escalation observer facts;
11. elemental-interaction narrative-evidence adapter;
12. encounter, combat, and spawn consumers only after their owners approve them;
13. persistence, saves, migrations, UI, content, and tests only after separate authorization.

This order assigns no version, package path, interface, schema, dependency, implementation prompt, or release milestone.

## 26. Future Test And Validation Matrix

All future fixtures must be explicitly non-canonical.

### Canon and aliases

- all eight canonical elements and every accepted alias projection;
- aliases preserved as labels without becoming identities;
- exactly three Light-aligned and three Darkness-aligned cores;
- hazardous Light-aligned and helpful Darkness-aligned examples;
- alignment without moral, thermal, religious, or temperamental inference.

### Manifestation and persistence

- insufficient evidence yields no candidate;
- strong core evidence yields candidacy without guaranteed placement;
- higher-element candidacy requires exceptional evidence;
- authored placement remains distinct from dynamic manifestation;
- ambient effect without agent identity;
- discrete transition with stable identity;
- source removal while an independently persistent entity remains;
- reinforcement without duplicate identity;
- temporary residue expiry without durable ecology mutation;
- migration, dormancy, dispersal, dissolution, death, unloading, and correction remain distinct;
- unload/reload and save/load do not duplicate identity or consequences.

### Taxonomy

- elemental versus fae or nature spirit;
- elemental versus construct or summoned/bound entity;
- magical animal remains an animal;
- guardian role does not redefine substance;
- corrupted variant retains base and alteration provenance;
- combatant adaptation does not replace entity identity.

### Temperament and disposition

- passive temperament with defensive disposition;
- hostile authored context without universal hostility;
- target-specific cooperation and hostility coexist;
- scoped habituation, spontaneous recovery, and sensitization;
- condition or resource state changes eligibility without rewriting temperament.

### Stimulus and response

- same-element resonance and aligned-higher tolerance;
- assimilation distinct from defensive hostility;
- asymmetric directional results;
- passive carried enchantment tolerated;
- activated or leaking incompatible enchantment qualifies where policy permits;
- hidden authoritative stimulus is not automatically perceived;
- direct magical contact response without visual recognition where accepted;
- capability/precondition rejection before ranking;
- deterministic candidates, ties, selection, response identity, replay, and correction.

### Helpful behavior and escalation

- aid requires present identity and explicit applicable capability;
- disposition alone cannot heal;
- consent, range, knowledge, resource, cost, and upstream effect gates;
- refusal and failure remain causally explainable;
- no generic regrowth, resurrection, or unexplained post-defeat rescue;
- entity-kind boundaries remain intact when fae, guardians, elementals, constructs, or magical animals aid;
- readable warning without hidden-state leakage;
- severe direct attack may skip warning;
- withdrawal, restitution, familiarity, or condition change may de-escalate;
- warning does not guarantee attack.

### Narrative integration

- observer-safe identity and cues;
- hidden motive and disposition remain hidden;
- assimilation without invented hunger;
- aid without invented gratitude;
- canonical element and applied manifestation remain distinct;
- chronology, material changes, actors, equipment, environment, response, and outcomes remain source-linked;
- Chronicle and Manuscript cannot reconstruct elemental state.

## 27. Temporary-Artifact Retention And Removal Conditions

Retain `docs/dev/tmp-elemental-alignment-temperament-and-magic-stimulus-audit-2026-07-23.md` until this decision, later elemental implementation prompts, and any explicitly named static or ecology integration consumer have consumed it.

Retain `docs/dev/tmp-grounded-elemental-affinity-ecology-and-magic-stimulus-research-2026-07-24.md` until this decision, the later Mortal Crisis/Stakes authority revision where elemental interaction matters, and later elemental implementation prompts have consumed it.

This decision consumes the first named use of both artifacts but deletes neither. Removal requires confirmation that every remaining named consumer has promoted the necessary evidence into durable authority or explicitly no longer needs it.

Narrative audit and research, comparative mortality research, and defeat/injury evidence retain their separately named consumers and remain untouched.

## 28. Unresolved Implementation Questions

- exact schemas, interfaces, packages, owners, storage, saves, and migration posture;
- exact canonicalization adapter, alias ambiguity rules, and display/localization behavior;
- exact contribution vocabulary, locality model, accumulation, depletion, recovery, threshold, and persistence rules;
- exact ambient and transient-presence categories and identity composition;
- exact entity taxonomy representation, sapience, communication, reproduction, mortality, summoning, binding, and transformation rules;
- exact temperament vocabulary, authored distributions, disposition and favorability integration, memory scopes, recognition, and perception;
- exact response states, ordering, ties, priorities, optional utility need, and any authorized randomness;
- exact capabilities, costs, consent, knowledge, range, treatment/magic adapters, and failure outcomes;
- exact reinforcement, migration, dormancy, dispersal, dissolution, conservation, anti-farming, loot, reward, and reappearance rules;
- exact narrative evidence shape, retention, observer cues, and consumer adapters;
- whether a later bounded behavior-tree, vocabulary, or canonical-serialization evaluation is justified by concrete implementation breadth.

These are focused implementation questions. They do not reopen the eight-element canon, accepted aliases, three-and-three mapping, owner graph, deterministic first posture, or broad research.

## 29. Explicit Non-Decisions

This decision does not:

- implement or authorize schemas, runtime, shared types, saves, migrations, content, AI, spawning, encounters, combat behavior, UI, tests, dependencies, formulas, probabilities, timers, balance, loot, rewards, or gameplay;
- select exact field names, packages, interfaces, storage, seeds, hashes, or serialization;
- create or edit elementals, fae, pixies, spirits, guardians, constructs, animals, monsters, spells, religions, encounters, sites, or ecology;
- rewrite current aliases, unions, schemas, TypeScript mirrors, validators, or content;
- make Light or Darkness moral;
- infer universal hostility from current elementals;
- permit tags, prose, encounter weights, or display labels to select behavior;
- treat passive equipment as active casting;
- let utility create capability or eligibility;
- equate runtime despawn with death, dissolution, migration, or dispersal;
- create generic healing, anatomical regrowth, resurrection, or unexplained rescue;
- change campaign rules, Normal Stakes fallback, restricted-Stakes closure, resurrection, Prestige, estate, succession, or rewards;
- restore held `0.6.6`, alter retained `0.6.7`, assign a release version, or create an implementation prompt.

## 30. Mandatory Decision Conclusions

| # | Statement | Decision |
| --- | --- | --- |
| 1 | The canonical set is Fire, Water, Earth, Wind, Thunder, Ice, Light, and Darkness. | Accepted |
| 2 | Stone, air, lightning/electricity, shadow/void, and holy/divine-light are aliases, manifestations, traditions, or applied labels rather than additional elements. | Accepted |
| 3 | Exactly three core elements align with Light and three with Darkness. | Accepted |
| 4 | Light aligns with Water, Wind, and Ice; Darkness aligns with Fire, Earth, and Thunder. | Accepted |
| 5 | Higher alignment is metaphysical, not moral, thermal, demographic, religious, or temperamental. | Accepted |
| 6 | A higher elemental ordinarily tolerates itself and its three aligned cores. | Accepted |
| 7 | Affinity uses heterogeneous owner-certified evidence and bounded projections, not one canonical scalar. | Accepted |
| 8 | Source, observation, ambient manifestation, transition, entity, encounter selection, and disposition are separate. | Accepted |
| 9 | Source removal does not silently delete an independently persistent entity. | Accepted |
| 10 | Ambient phenomena do not automatically possess agent identity. | Accepted |
| 11 | Elemental identity is broader than `monsterClass` and combatant adaptation. | Accepted |
| 12 | Other magical-entity kinds remain distinct from environmental elementals. | Accepted |
| 13 | Guardian, territorial, helpful, predatory, defensive, hostile, and benevolent are not substance or moral classes by default. | Accepted |
| 14 | Temperament, target-relative disposition, condition/memory, and action are separate. | Accepted |
| 15 | River and Storm elementals do not establish universal hostility. | Accepted |
| 16 | Active/passive, authoritative/perceived, direct/observed, and enchantment-state distinctions are required. | Accepted |
| 17 | Passive enchanted equipment is not casting. | Accepted |
| 18 | Directional resonance, tolerance, assimilation, countering, caution, and overrides are distinct. | Accepted |
| 19 | The six-core directional matrix is accepted conceptually without formulas or symmetry. | Accepted |
| 20 | Capability and preconditions determine eligibility before utility, priority, or action choice. | Accepted |
| 21 | The first response posture is closed deterministic eligibility plus a small explicit response policy with retained reasons. | Accepted |
| 22 | No production AI, behavior-tree, planner, ontology, or canonical-serialization dependency is accepted. | Accepted |
| 23 | Helpful behavior requires explicit capability, trigger, relationship/consent, access, cost, deterministic selection, and upstream acceptance. | Accepted |
| 24 | Benevolence, alignment, fae identity, or guardian role never directly creates healing or rescue. | Accepted |
| 25 | Observer-readable escalation uses accepted cues and actions, not a universal hostility meter. | Accepted |
| 26 | Migration, dormancy, dispersal, dissolution, death/destruction, unloading, and correction are separate. | Accepted |
| 27 | Runtime despawn is not an in-world outcome. | Accepted |
| 28 | Response provenance retains normalized inputs, versions, candidates, eligibility, ties, selection, causes, outcomes, and correction lineage. | Accepted |
| 29 | Narrative remains downstream and cannot infer elemental motive, morality, identity, capability, or future action. | Accepted |
| 30 | No implementation is authorized. | Accepted |
| 31 | Held `0.6.6` and retained `0.6.7` remain unchanged. | Accepted |
| 32 | The later Mortal Crisis/Stakes authority revision remains a separate next route. | Accepted |

## 31. Next Recommended Route

The next recommended documentation route is:

`Checkpoint Commitment, Mortal Crisis Sequence, Resurrection Aftereffects, Final Closure, And Stakes Authority Revision`

That later decision must reconcile checkpoint commitment, Mortal Crisis phases, rescue, care routing, body recovery, resurrection eligibility and aftereffects, actual versus final death, rollback provenance, Prestige, estate, Chronicle settlement, succession, and public Stakes distinctions. It may consume elemental interaction boundaries where relevant but must not infer elemental implementation.

No next prompt is installed by this decision.
