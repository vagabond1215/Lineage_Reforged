# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and byte-recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- The campaign-rules acceptance decision completed at commit `764f7ef5e4028e82fc76af6ae0381cc1eab00e20`.
- The authoritative initial campaign identity is Story/Favored/Mortal/Forsaken, Heroic/Grim, and only `normal_stakes` initially.
- Normal Stakes ordinary HP zero is accepted as defeat or incapacitation, not implicit terminal death, archival, save deletion, or terminal payout.
- The live runtime still archives HP-zero runs and deletes saves. Runtime migration to `normal_stakes` is prohibited until the nonterminal defeat boundary lands before or atomically with migration.
- Future restricted Stakes remains controlled by `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`.
- Injury, trauma, normally irreversible harm, magical restoration, and resurrection boundaries are now controlled by `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`.
- The active Codex run is `Normal Stakes Defeat, Injury, Trauma, And Magical Restoration Repository Audit And Contract Planning` in `docs/dev/current-codex-prompt.md`.
- The active run is documentation-only and may modify exactly `docs/dev/current-codex-output.md` plus one new temporary audit.
- No runtime, schema, save, migration, combat, health, injury, trauma, treatment, magic, resurrection, UI, test, content, service, spell, or balance implementation is authorized.

## Most Specific Current Authorities

1. `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`
2. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`
3. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`
4. `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`
5. `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`
6. `docs/design/combat-status-condition-injury-boundary-decision.md`
7. `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`
8. `docs/design/magic-runtime-boundary-plan.md`

The injury decision is more specific than the older combat status/condition/injury boundary for recovery classes, trauma semantics, magical restoration, and defeat integration. The older decision still controls the separation between static vocabulary and active runtime state.

## Accepted Campaign Rules

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes";
```

Initial rules:

- Difficulty, World Rules, Stakes, and mechanical overrides are creation-locked.
- Accessibility, presentation, input, localization, and nonmechanical information formatting remain changeable.
- Production creation exposes only implemented and tested combinations.
- Story remains unavailable until all active owners have Story adapters.
- Grim remains unavailable until at least one real typed persisted Grim module exists with required adapters.
- The future restricted-Stakes name and machine id remain deferred.

## Normal Stakes Defeat Boundary

Accepted semantic boundary:

```text
HP reaches zero
  -> defeated or incapacitated
  -> context-owned nonterminal defeat resolution
  -> campaign identity and saves remain intact
```

Ordinary HP zero is not:

- automatic actual death;
- campaign archival;
- character deletion;
- save deletion;
- terminal Prestige or Legacy settlement;
- retirement.

The active audit must identify the smallest live seam where this resolver can replace terminal archival without creating a second HP authority.

## Injury Classification

Severity and recoverability are separate.

Naturally recoverable physical injuries use:

- `Minor`;
- `Moderate`;
- `Major`.

All three may reach complete functional recovery when uncomplicated. Severity controls immediate burden, recovery duration, reduced-use needs, treatment value, and complication risk; it does not determine permanence.

Naturally recoverable injuries:

- may heal without professional treatment;
- may recover faster or more safely with treatment;
- may require ordinary, reduced, or protected nonuse depending on the injury;
- do not change immutable base attributes;
- may leave cosmetic scars without permanent functional impairment;
- may causally convert to another state through overuse, reinjury, contamination, or failed stabilization, but must not become chronic through a hidden roll.

## Trauma Direction

Accepted broad player-facing umbrella:

**Shaken Spirit**

`Shaken Spirit` is a lore-facing trauma condition, not:

- magical soul damage;
- possession;
- insanity;
- moral weakness;
- a comprehensive modern diagnosis catalog.

Possible descriptive expressions include dread, nightmares, intrusive recollection, vigilance, avoidance, suspiciousness, startle, withdrawal, and event-linked panic.

Trauma may:

- self-resolve with time and safety;
- improve through companionship, counsel, spiritual care, ritual, a healer, a confessor, a mentor, or other lore-appropriate support;
- require focused treatment or event resolution;
- persist or remain unresolved during the campaign.

Trauma must be event- and trigger-linked, proportional, explainable, and respectful of character agency. It must not rewrite immutable attributes or authored personality.

## Normally Irreversible Harm

Normally irreversible harm does not fully regenerate through ordinary time or generic healing.

Potential examples include lost limbs, destroyed eyes or organs, severe tissue loss, normally permanent sensory loss, severe nerve or spinal harm, and explicitly authored magical injuries.

Mundane treatment may stabilize, protect, rehabilitate, reduce pain, preserve function, and enable adaptation. Prostheses and assistive equipment may restore capability but do not recreate anatomy.

Complete restoration requires explicitly capable magic.

## Magical Restoration

Exceptional magical restoration direction:

- generic healing does not imply limb or organ regrowth;
- regrowth and restoration capabilities must be explicit;
- capable healers are extremely rare;
- access is exceptionally expensive or resource-intensive;
- travel, standing, patronage, faith, law, ritual, rare materials, or institutional permission may matter;
- exact spells, prices, healer counts, success rules, and requirements remain deferred.

## Resurrection Boundary

Resurrection is a death-and-magic system, not ordinary injury treatment.

Under Normal Stakes, a later focused decision may permit extremely rare and expensive resurrection.

Under the accepted restricted-Stakes authority, actual death is irreversible once atomically committed as terminal. The injury decision does not reopen a terminal restricted-Stakes character.

## Attribute And Body Integration

Immutable base attributes never change because of injury or trauma.

```text
current attribute
  = immutable base
  + developed adjustment
  + structural-loss adjustment
  + reversible body-condition adjustments
  + physical-injury adjustments
  + trauma-condition adjustments
  + equipment, magic, status, and contextual adjustments
```

Requirements:

- naturally recoverable injuries use reversible injury adjustments;
- trauma uses condition- and trigger-owned adjustments;
- normally irreversible harm may use persistent injury/capability adjustments;
- magical restoration removes or transforms injury-owned state through one authoritative resolver;
- injury, body condition, and nutrition-derived structural loss must not be double-counted.

## Defeat Consequence Guardrails

Normal Stakes defeat may result in:

- no injury;
- a naturally recoverable physical injury;
- Shaken Spirit;
- both physical and trauma consequences;
- another context-owned nonterminal consequence.

It must not guarantee injury, trauma, item loss, or permanent maiming as a generic tax.

Minor and Moderate injuries may be common where context supports them. Major injuries require proportionate causes. Normally irreversible or magic-only harm must be exceptional, strongly causal, and clearly surfaced.

The default fallback must prevent repeated-defeat soft locks and preserve campaign continuation.

## Difficulty, Story, Grim, And Stakes

Difficulty may tune owner-approved consequence weighting, recovery duration, reduced-use burden, treatment effectiveness, complication resistance, trauma recovery/support, warnings, and forecast precision.

Difficulty does not change physical truth, anatomy, immutable base attributes, magical capability, or the selected Stakes death/resurrection boundary.

Story may use coarse, generous injury and trauma projections and should not routinely produce normally irreversible harm from defeat.

Grim may later deepen infection, sanitation, treatment scarcity, institutional access, or stigma through distinct owner contracts. Grim does not make all injury permanent or all trauma ubiquitous.

## Active Codex Audit

The active run must inspect:

- every live HP-zero and archival path;
- encounter defeat and incapacitation state;
- party and companion handling;
- safe-location, travel, rest, and recovery surfaces;
- current status, active-effect, body-state, attribute, and save representations;
- healing, service, spell, magic, death, and resurrection foundations;
- TypeScript/JavaScript mirror requirements.

It must produce:

1. `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`;
2. an updated `docs/dev/current-codex-output.md`.

It must not modify the active prompt, this handoff, route register, accepted decisions, runtime, shared types, schemas, saves, migrations, tests, UI, content, spells, services, generated files, or gameplay.

## Required Audit Outcomes

The audit must provide:

- the exact live call flow from HP zero to archival and save deletion;
- the smallest replacement seam for Normal Stakes defeat;
- fallback defeat options and one recommendation;
- injury, trauma, irreversible-harm, magical-restoration, and resurrection owner plans;
- persistence and migration risks;
- difficulty/world/stakes interactions;
- implementation package sequence;
- validation matrix;
- exact remaining user decisions;
- explicit non-decisions.

## Held And Deferred Routes

- Held `0.6.6` remains untouched and recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained `0.6.7` artifacts remain untouched.
- Restricted Stakes remains future work with no accepted live id.
- Exact injury catalogs, trauma expressions, healing formulas, magical restoration capabilities, and resurrection mechanics remain deferred.
- No release version or milestone is assigned to the active audit.
