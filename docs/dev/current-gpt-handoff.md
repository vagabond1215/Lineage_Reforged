# Current GPT Handoff

Date: 2026-07-25

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- Campaign-rules identity, initial `normal_stakes`, injury/recovery, restricted-Stakes continuity, Normal Stakes defeat fallback, narrative realization, and elemental alignment/manifestation remain accepted documentation authorities.
- `Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision` is complete and controlling for elemental canon and ownership.
- The active route is the documentation-only `Checkpoint Commitment, Mortal Crisis Sequence, Resurrection Aftereffects, Final Closure, And Stakes Authority Revision`.
- The active route does not authorize runtime, schema, save, migration, UI, content, test, dependency, balance, or gameplay implementation.

## Most Specific Accepted Authorities

1. `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md`, blob `932f017b75c7cb43539945f5cac3310efa413f75`.
2. `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`, blob `879c8e0b419eb429fe5af2022ef647f175b130f4`.
3. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`, blob `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`.
4. `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`, blob `71550ab225cacfea0e8ad00eb29b034dfb86f4ff`.
5. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`, blob `20e72fb280fd67351135e195f75195a592bce9c9`.
6. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`, blob `e1d2ec6b087eb9be7f9222763e25fee86c2f5329`.
7. `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`, blob `0b2bfc434e586321336bbf5ecb6af55111d6db69`.
8. `docs/design/living-character-manuscript-design-boundary.md`.
9. `docs/design/quest-event-chronicle-authority-boundary-decision.md`.
10. `docs/design/person-vs-npc-schema-decision.md`.
11. `docs/design/combat-status-condition-injury-boundary-decision.md`.
12. `docs/design/magic-runtime-boundary-plan.md`.

Newer focused decisions control their subjects. Temporary audits and research artifacts are evidence, not authority.

## Evidence Required By The Active Route

- Comparative checkpoint/mortality research: `docs/dev/tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md`, blob `26ce50958f348f316ab98bcafe31282393709fd6`.
- Defeat/injury/restoration audit: `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`, blob `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`.
- Grounded elemental research remains relevant only where an elemental or other magical entity supplies an explicitly authorized crisis capability: `docs/dev/tmp-grounded-elemental-affinity-ecology-and-magic-stimulus-research-2026-07-24.md`, blob `909b2bc1d36539880780f2a48b473ccc725333dd`.
- The accepted narrative and elemental decisions remain controlling authorities rather than evidence to be reopened.

## Accepted Campaign Identity

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes";
```

Difficulty, World Rules, Stakes, and mechanical overrides remain creation-locked. Accessibility, presentation, input, localization, and nonmechanical information formatting remain changeable.

`Mortal` is already a Difficulty label and must not be reused as a Stakes name. `Ironbound` remains only a historical working title unless the active decision explicitly accepts it.

## Current Normal Stakes Boundary

Ordinary HP zero is currently accepted as nonterminal defeat or incapacitation:

```text
HP reaches zero
  -> defeated or incapacitated
  -> context-owned nonterminal defeat resolution
  -> campaign identity and saves remain intact
```

The accepted generic fallback remains controlling until explicitly retained, narrowed, or superseded:

- deterministic defeat receipt;
- encounter cleanup;
- deterministic recovery destination or `recovery_pending`;
- bounded time and HP/Stamina recovery;
- preservation of inventory, equipment, currency, quests, party membership, injury state, trauma state, and immutable truth by default;
- no automatic injury, trauma, maiming, capture, item loss, actual death, or magic;
- current ordinary manual/quick-save topology and permissive rollback remain controlling unless the active revision changes them explicitly.

Runtime campaign-rules migration remains prohibited while ordinary HP zero still archives the run and deletes saves.

## Current Restricted-Stakes Boundary

The accepted restricted-Stakes direction currently provides:

- one authoritative continuity stream;
- no player-selected rollback;
- hidden technical recovery only to the latest verified authoritative state;
- actual death distinct from ordinary defeat;
- atomically committed actual death as immediate terminal character closure;
- read-only historical character access;
- idempotent nonzero circumstance-sensitive Prestige settlement;
- estate, Chronicle, and succession inputs after terminal closure;
- final public name, machine id, succession model, formulas, and implementation deferred.

The active route must explicitly retain or supersede immediate terminal closure if any restricted or intermediate Stakes mode permits resurrection after actual death.

## Accepted Injury, Trauma, Restoration, And Resurrection Boundary

- Naturally recoverable physical injuries use independent `Minor`, `Moderate`, and `Major` severity.
- Severity and recoverability remain separate.
- `Shaken Spirit` is the broad lore-facing trauma-condition umbrella.
- Normally irreversible harm may be stabilized, adapted to, or compensated for mundanely, but complete anatomical restoration requires explicitly capable exceptional magic.
- Immutable base attributes never change because of injury, trauma, restoration, or resurrection.
- Ordinary healing does not imply regrowth, anatomical restoration, or resurrection.
- Resurrection is a separate magical death-reversal system owned jointly by death, magic, Stakes, body/corpse, causality, Chronicle, succession, estate, and save integrity.
- Under existing authority, Normal Stakes may later permit rare resurrection; restricted Stakes does not reopen atomically terminal death unless explicitly superseded.

## Accepted Mortal-Crisis Direction To Resolve

The active decision should test and durably accept, revise, or reject this owner model:

```text
functional state
  active | downed | unconscious

lethal processes
  zero or more independently owned progressing conditions

care requirement
  none | basic stabilization | professional care | exceptional magic

life state
  alive | actually dead but restoration-eligible | final death

presentation
  stable | unstable | aid required | resurrection possible | closure imminent
```

`stable`, `unstable`, and similar urgency labels should be derived presentation, not redundant mutable health truth.

The proposed Mortal Crisis sequence is:

```text
Threat Resolution
  -> Immediate Stabilization
  -> Extraction
  -> Transit
  -> Treatment Or Restoration
  -> Closure
```

Stages may be skipped only when accepted context makes them inapplicable. The sequence consumes authoritative facts; it does not own injuries, healing, magic, institutions, party capability, travel, or world state.

Possible closure results include natural recovery, stabilized but aid-required, professional recovery underway, actual death with restoration eligibility, successful resurrection, and final death.

## Checkpoint And Event-Commitment Boundary To Resolve

Load topology and event commitment are separate:

- load topology determines which historical states a player may select;
- event commitment determines whether materially identical causes can reroll an accepted outcome;
- technical recovery restores the latest verified state and is not gameplay rollback;
- sleep or other scarce checkpoints do not by themselves prevent RNG fishing;
- one global random stream can become manipulable through unrelated action ordering;
- stable occurrence identity and named draw channels should be considered where uncertainty is later authorized.

The active decision must choose whether the public Stakes axis has two or three materially distinct choices. A middle checkpoint-based choice is justified only if its load, commitment, death/finality, settlement, warning, and recovery contracts differ materially from both Normal and restricted Stakes.

## Actual Death, Restoration Eligibility, And Final Closure To Resolve

For any resurrection-permitting Stakes contract, the active decision should test this sequence:

```text
actual death
  -> retained body and restoration eligibility
  -> recovery, transport, preservation, access, and decision
  -> successful restoration OR eligibility closure
  -> final death transaction only after closure
```

Eligibility should be deterministic and explainable. Access, capability, transport, preservation, institutions, resources, legality, willingness, and risk may remain rare or difficult. Randomly deciding after death whether resurrection exists is disfavored.

Prestige, estate, terminal Chronicle settlement, account rewards, achievements, and heir/successor control must settle only once at authoritative final closure when actual death remains reversible. A mode that prohibits resurrection may collapse actual death and final death into one atomic transaction.

## Post-Restoration Convalescence Direction To Resolve

A successful resurrection should not imply immediate full combat readiness. The active decision should test a typed `Post-Restoration Convalescence` boundary composed from:

- restoration strain;
- unresolved injuries;
- body-condition consequences;
- method-specific complications;
- optional trauma consequences.

Potential effects include rest requirements, temporary Stamina ceiling or regeneration limits, exertion and travel restrictions, delayed consciousness, continuing treatment, vulnerability, and no immediate combat return. These must use current-state adjustments and owner-approved consequences rather than silent immutable base-stat loss or one generic universal near-death debuff.

## Rescue And Care Routing Direction To Resolve

Rescue should consume factual owner-specific inputs rather than one opaque chance:

- remaining threat goals and disposition;
- active hazards and lethal processes;
- conscious helpers, permissions, relationships, skill, supplies, carrying capacity, mounts, vehicles, and magical capabilities;
- body transportability;
- route, terrain, weather, distance, and travel time;
- intermediate safe sites and care providers;
- destination institution capabilities and access.

The unconscious or actually dead character does not perform reflex minigame inputs. Decisions belong to the party, campaign controller, or another authorized actor. Basic stabilization addresses named processes; it does not imply consciousness, mobility, complete recovery, or definitive care.

## Narrative And Observer Boundary

The accepted narrative authority remains controlling:

```text
authoritative crisis facts and outcomes
  -> owner-certified event-time evidence
  -> observer projection
  -> scene and beat planning
  -> discourse and referent resolution
  -> deterministic realization
  -> validation and fallback
  -> UI / Chronicle / Manuscript
```

Player-facing Mortal Crisis presentation should use connected observer-limited prose, qualitative urgency, explicit contextual choices, and progressive reassessment. It must not expose raw timers, seeds, percentages, hidden diagnosis, inaccessible motives, or future outcomes by default.

The renderer cannot decide survival, injury, diagnosis, treatment, rescue, resurrection eligibility, finality, elemental behavior, or institutional capability. Appearance, held/worn objects, grammar, pronouns, tense, chronology, and recognition remain governed by the narrative decision.

## Elemental And Magical-Entity Crisis Boundary

Elementals, fae, nature spirits, constructs, magical animals, guardian beings, or other entities may assist only through the accepted elemental capability gates:

- present identity;
- explicit applicable capability;
- qualifying perceived or direct trigger;
- disposition, relationship, role, consent, and policy eligibility;
- range, access, environment, knowledge, and current condition;
- cost, risk, sacrifice, cooldown, or comparable constraint where applicable;
- deterministic selection;
- acceptance by the health, magic, travel, quest, inventory, or other owning system;
- retained causal evidence.

Benevolence, alignment, fae identity, or guardian role cannot create unexplained rescue, healing, regrowth, resurrection, supplies, transport, or quest completion.

## Active Prompt Scope

The active documentation-only decision must resolve:

1. load topology versus event commitment;
2. hidden technical recovery;
3. stable event/draw identity and replay equivalence;
4. public Stakes tier count, semantics, names, ids, and warnings where supportable;
5. functional state, lethal processes, care requirements, life state, and derived urgency;
6. Mortal Crisis phase ownership and stage skipping;
7. process-specific stabilization;
8. rescue, extraction, transit, intermediate care, and definitive treatment;
9. actual death, body state, recovery, preservation, and restoration eligibility;
10. informed restoration abandonment and eligibility closure;
11. resurrection capability, success, complications, and post-restoration convalescence;
12. actual death versus final death;
13. rollback provenance and anti-duplication;
14. Prestige, estate, Chronicle, account reward, achievement, and succession ordering;
15. explicit retention, narrowing, or supersession of current campaign, Normal Stakes, restricted-Stakes, injury/restoration, narrative, and elemental authorities;
16. future package order and test matrix without implementation permission.

## Implementation And Authorization

No runtime, shared type, schema, validator, save, migration, UI, content, test, dependency, model, formula, timer, probability, balance, reward, Prestige, estate, succession, injury, trauma, magic, resurrection, or gameplay implementation is authorized.

No release version is assigned. The active route must not restore held `0.6.6`, alter retained `0.6.7`, or install its own implementation prompt.

## Temporary Evidence And Held Routes

- Retain comparative mortality research through this decision and later implementation prompts that consume checkpoint, rescue, resurrection, or succession conclusions.
- Retain the defeat/injury/restoration audit through this decision and the first relevant implementation package.
- Retain narrative evidence for Mortal Crisis and narrative-engine implementation consumers.
- Retain elemental audit/research for later elemental implementation and for this route only where magical-entity crisis interaction matters.
- Held `0.6.6` remains recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained `0.6.7` artifacts remain untouched.
