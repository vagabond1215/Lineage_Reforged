# Current GPT Handoff

Date: 2026-07-24

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and byte-recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- Campaign-rules identity, initial `normal_stakes`, injury/recovery, restricted-Stakes continuity, and Normal Stakes defeat fallback are accepted documentation authorities; implementation remains unauthorized.
- The comparative mortality, repository narrative/elemental audit, and grounded narrative-realization research passes are complete and retained as evidence.
- The active Codex run is `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision` in `docs/dev/current-codex-prompt.md`.
- The active run is documentation-only. It must accept a durable narrative authority without implementing runtime, schemas, saves, UI, tests, dependencies, external-model integration, Mortal Crisis outcomes, elemental systems, or gameplay.

## Active Run Outputs

The active run may modify exactly:

1. create `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`;
2. update `docs/dev/current-codex-output.md`;
3. update `docs/dev/current-gpt-handoff.md`;
4. update `docs/dev/historical-version-and-deferred-route-register.md`.

It must not modify `docs/dev/current-codex-prompt.md` during execution.

## Controlling Evidence For The Active Decision

- Narrative/Mortal Crisis repository audit: `docs/dev/tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md`, blob `6cb28305a3b2c67601568103c6309f33956ecd31`.
- Grounded narrative research: `docs/dev/tmp-grounded-narrative-realization-research-2026-07-23.md`, blob `878219b57342430a47021c45e343ad27e1db95ac`.
- Completed research commit: `902a33597581c18000b7fd1ecee72e06e258762c`.
- Living Character Manuscript boundary: `docs/design/living-character-manuscript-design-boundary.md`, blob `5ad12814696e65c77f893b7d4426731350757245`.
- Quest/Event/Chronicle boundary: `docs/design/quest-event-chronicle-authority-boundary-decision.md`, blob `38ee8287c4c072807f6590537f361b80afc723fc`.
- Person/NPC schema posture: `docs/design/person-vs-npc-schema-decision.md`, blob `1f130a3b1d63de8d2b7e607c9215ce13d76ea463`.

The elemental audit remains evidence for a separate later lane and must not be converted into accepted elemental authority by the active narrative decision.

## Most Specific Accepted Authorities

1. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`
2. `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`
3. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`
4. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`
5. `docs/design/living-character-manuscript-design-boundary.md`
6. `docs/design/quest-event-chronicle-authority-boundary-decision.md`
7. `docs/design/person-vs-npc-schema-decision.md`
8. `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`
9. `docs/design/combat-status-condition-injury-boundary-decision.md`
10. `docs/design/magic-runtime-boundary-plan.md`

Newer focused decisions control their subjects. Temporary audits and research artifacts are evidence, not authority.

## Accepted Campaign Rules

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes";
```

- Difficulty, World Rules, Stakes, and mechanical overrides are creation-locked.
- Accessibility, presentation, input, localization, and nonmechanical information formatting remain changeable.
- Production creation exposes only implemented and tested combinations.
- Story and Grim remain availability-gated.
- The future restricted-Stakes public name and machine id remain deferred.

## Current Defeat, Death, And Restoration Boundaries

Normal Stakes ordinary HP zero means defeat or incapacitation, not implicit terminal death:

```text
HP reaches zero
  -> defeated or incapacitated
  -> context-owned nonterminal defeat resolution
  -> campaign identity and saves remain intact
```

Ordinary HP zero is not automatic archival, character deletion, save deletion, terminal Prestige settlement, retirement, or succession.

The accepted generic fallback and current manual/quick-save topology remain controlling until a later explicit Stakes/Mortal Crisis authority revision retains, narrows, or supersedes them.

Restricted Stakes currently treats atomically committed actual death as terminal. A later resurrection-permitting actual-death stage would require explicit supersession; the active narrative decision cannot make that change.

Injury and restoration remain controlled by the accepted injury decision:

- naturally recoverable physical injuries use Minor, Moderate, and Major severity independent from recoverability;
- `Shaken Spirit` is the broad lore-facing trauma umbrella;
- normally irreversible harm does not fully regenerate through ordinary time or generic healing;
- complete anatomical restoration requires explicitly capable magic;
- resurrection is separate from ordinary injury treatment.

## Active Narrative Decision Requirements

The decision must establish a reusable narrative-realization authority for Mortal Crisis, Chronicle, Manuscript, elemental encounters, and later fact-grounded prose consumers without becoming any gameplay owner.

It must decide:

- the owner graph from authoritative domain results through retained event-time evidence, observer projection, scene planning, reference selection, realization, validation, fallback, and downstream presentation;
- a locale-neutral grammatical-profile boundary separated from mechanical sex, gender presentation, English pronoun strings, and entity cardinality;
- explicit personal-pronoun authoring and conservative no-pronoun fallback;
- singular `they` and plural `they` as distinct semantic referents despite shared English agreement;
- observer-known event-time naming, title, alias, role, and description rules;
- deterministic ambiguity handling that repeats a safe name or description rather than guessing a pronoun;
- a deliberately bounded first English morphology and locked-template scope;
- event-time appearance, clothing, armor, held/worn/dropped/consumed/removed/transferred objects, injury evidence, location, and position requirements;
- durable narrative evidence that is not limited to today’s template slots;
- exact temporal binding for any current snapshot used as an immediate rendering aid;
- observer visibility, recognition, diagnosis confidence, uncertainty, qualitative urgency, and spoiler filtering before prose planning;
- scene/beat ordering, supported causal language, decision pauses, deterministic regeneration, and presentation-version identity;
- layered validation and deterministic simplification/fallback;
- a hard separation between renderer-visible facts and validator-only hidden facts;
- locked and player-edited prose staleness, invalidation, comparison, and explicit regeneration behavior;
- optional bounded generation as a separately authorized, rejectable presentation adapter with no fact, order, identity, pronoun, diagnosis, outcome, or history authority;
- localization seams and later bounded dependency-evaluation gates.

The decision must not accept exact runtime field names, final schemas, storage tables, package names, a production dependency, a model/vendor, or an implementation version.

## Narrative Non-Negotiables

- Gameplay owners resolve truth before narrative projection.
- Generated or templated prose is replaceable presentation, never canonical evidence.
- Prose is never parsed back into gameplay state.
- Chronicle, quest-journal, and Manuscript strings do not become event provenance.
- Personal pronouns are never inferred from `PlayerSexId`, `neutral`, name, title, lineage, appearance, or deity presentation.
- Unknown identity degrades to an observer-safe event-time description, not a backend canonical name.
- Hidden timers, percentages, seeds, debug ids, private motives, inaccessible diagnoses, and future outcomes are excluded from the renderer-facing envelope.
- Player-facing Mortal Crisis output defaults to connected narrative and qualitative urgency, not battle-log lines or a timer dashboard.
- Any material validation failure produces deterministic simplification or fallback.
- No external model is required for minimum viable output.

## Elemental Lane

The repository elemental audit is complete but non-canonical:

- canonical aliases remain fragmented across Earth/stone, Wind/air, Thunder/lightning, and Darkness/shadow;
- the final three-and-three Light/Darkness core alignment is unresolved;
- environmental affinity pressure, manifestation, baseline temperament, current disposition, magic stimuli, beneficial capabilities, and fae/spirit/guardian taxonomy remain undecided;
- current hostile River and Storm elementals are valid authored encounters but do not establish universal elemental hostility.

After the narrative decision, the next recommended run is targeted external research for elemental affinity ecology, manifestation, temperament, and magic-stimulus behavior. That research must precede the durable elemental decision.

## Later Mortal Crisis And Stakes Route

After the narrative and elemental authority lanes are complete, a separate documentation-only decision must address:

- checkpoint commitment and replay-stable event identity;
- Mortal Crisis phase ownership;
- process-specific stabilization;
- direct versus intermediate-care routing and transport;
- body recovery and preservation;
- resurrection eligibility and post-restoration convalescence;
- actual death versus final closure;
- rollback provenance;
- Prestige, estate, Chronicle, and succession ordering;
- public Stakes distinctions and explicit supersession of conflicting authorities.

The active narrative decision cannot resolve these gameplay outcomes.

## Held And Deferred Routes

- Held `0.6.6` remains untouched and recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained `0.6.7` artifacts remain untouched.
- No release or primary version is assigned to the active narrative decision.
- No narrative dependency, external model, localization system, elemental runtime, Mortal Crisis runtime, save migration, or gameplay implementation is authorized.
