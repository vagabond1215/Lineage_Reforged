# Current GPT Handoff

Date: 2026-07-24

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and byte-recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- Campaign-rules identity, initial `normal_stakes`, injury/recovery, restricted-Stakes continuity, and Normal Stakes defeat fallback remain accepted documentation authorities; implementation remains unauthorized.
- The comparative mortality, repository narrative/elemental audit, grounded narrative-realization research, and targeted elemental research passes are complete evidence.
- `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision` is complete and controlling as a documentation authority.
- The completed decision artifact is `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`, blob `879c8e0b419eb429fe5af2022ef647f175b130f4`.
- Targeted elemental research is complete at `docs/dev/tmp-grounded-elemental-affinity-ecology-and-magic-stimulus-research-2026-07-24.md`, blob `909b2bc1d36539880780f2a48b473ccc725333dd`.
- The next active route recommendation is the documentation-only `Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision`.
- No decision prompt is installed by the completed research.

## Most Specific Accepted Authorities

1. `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`
2. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`
3. `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`
4. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`
5. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`
6. `docs/design/living-character-manuscript-design-boundary.md`
7. `docs/design/quest-event-chronicle-authority-boundary-decision.md`
8. `docs/design/person-vs-npc-schema-decision.md`
9. `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`
10. `docs/design/combat-status-condition-injury-boundary-decision.md`
11. `docs/design/magic-runtime-boundary-plan.md`

Newer focused decisions control their subjects. Temporary audits and research artifacts are evidence, not authority.

## Accepted Narrative Owner Graph

The controlling graph is:

```text
authoritative domain results
  -> owner-certified event-time narrative evidence
  -> observer / viewpoint projection
  -> scene and beat plan
  -> discourse and referent resolution
  -> locale-specific deterministic realization
  -> validation
  -> accepted presentation or deterministic fallback
  -> Mortal Crisis UI / Chronicle / Manuscript / other consumers
```

Gameplay and domain owners remain authoritative for identity, combat, health, injury, equipment, inventory, recognition, travel, treatment, magic, death, and accepted outcomes. Narrative stages are downstream and cannot mutate or reconstruct gameplay.

Prompt/request construction is an optional, separate function after a closed scene plan. Deterministic local prose realization and fallback are mandatory and model-independent.

## Accepted Grammar And Reference Boundary

- Locale-neutral grammatical identity distinguishes person, one entity, explicit coordination, persistent groups, entity kind, reference permissions, pronoun posture, provenance, and event-time revision.
- Personal pronoun paradigms are explicit authored or player-selected facts.
- Mechanical sex, `neutral`, names, aliases, titles, lineage, appearance, roles, professions, and deity presentation cannot infer personal pronouns.
- Singular `they` and plural `they` remain distinct semantic identities despite overlapping English forms.
- Missing or forbidden pronouns degrade to observer-safe event-time names, titles, roles, relationships, or stable descriptions.
- Unknown identity never exposes a backend canonical name.
- A deterministic recency-and-role resolver uses pronouns only when profile, agreement, salience, and unique antecedence are all proved. Conservative repetition is controlling.
- Groups require explicit event-time membership and change or dissolve with membership.

## Accepted English Realization Boundary

- The first posture is locked fully inflected sentence families plus a narrow project-owned morphology/agreement layer.
- Present and simple past are baseline; progressive or perfect appears only where the tested corpus needs it.
- The controlled layer covers corpus-used `be`, `have`, `do`, negation, modals, agreement, regular plural/possessive, articles, punctuation, capitalization, and curated irregulars.
- Default first-corpus prose avoids contractions. Quotation and generated dialogue remain unsupported without separate authority.
- Deterministic alternatives require declared semantic equivalence, static lint, and golden tests.
- Clear connected prose and correct repetition outrank literary variety.
- No production dependency is accepted. A later offline `jsRealB` comparison remains separately gated.

## Accepted Evidence And Provenance Boundary

Keep distinct:

1. authoritative domain events/results;
2. durable owner-certified event-time narrative evidence;
3. observer-projected facts;
4. renderer/template plans;
5. accepted prose;
6. validator-only hidden evidence.

Event-time evidence includes relevant role identities, accepted actions/results, occurrence and order identity, simultaneity, location/route/position, visible appearance, worn/held/object transitions, visible condition/injury evidence, recognition/visibility/diagnosis confidence, explicit unknowns, content revisions, and exact source/projection provenance.

The evidence class is not limited to current template slots and is not a full duplicate snapshot. Current state is not historical proof unless bound to the exact occurrence, beat, order/time, and revision. Event type plus tick cannot identify repeated same-tick occurrences.

Chronicle, journal, Manuscript, generated, locked, or player-edited prose is never provenance.

## Accepted Observer And Secret Boundaries

Observer projection occurs before planning, references, realization, and optional request construction. It consumes upstream visibility, recognition, inspection, diagnosis, and qualitative-urgency decisions and does not calculate them.

Exact diagnosis requires accepted observer knowledge. Reassessment creates a new beat. Hidden timers, percentages, seeds, raw rolls, debug ids, private motives, secret identities, inaccessible diagnoses, future outcomes, and viewpoint-barred facts remain outside the renderer-facing envelope.

Renderer-visible and validator-only evidence are separate channels. Validator-only facts cannot reach realization, request construction, generation, UI, ordinary logs, or telemetry.

## Accepted Planning, Validation, Fallback, And Identity Boundary

- Scene planning may order, group, compress, preserve simultaneity, join accepted action/results, use supported relations, maintain viewpoint/tense, and insert a hard decision pause.
- It cannot invent causality, intention, motive, emotion, strategy, witness, dialogue, action, or outcome.
- Validation covers source/revision, required facts, allowlisted identities/relations, leakage, grammar/reference/order, event-time truth, observer/spoiler policy, unsupported claims, mechanical language, and style budgets.
- Structural, schema, grammar, or learned consistency is not sole factuality proof.
- Material failure rejects, deterministically simplifies, revalidates, and selects the minimum safe fallback.
- Identical normalized inputs and deterministic stage versions reproduce the fallback byte-for-byte.
- Semantic normalization must precede authoritative hashes.
- Regeneration changes presentation only.

## Locked And Player-Edited Presentation

Accepted conceptual statuses are current, locked-current, player-edited-current, stale-source, stale-policy, validation-failed, and superseded.

Locked and player-edited prose is never silently overwritten. Preserve source/presentation versions, validation identity, lock state, and edit lineage. Changed facts or policies mark incompatible text stale or validation-failed and permit later compare, regenerate, relock, or retain-as-personal-text handling.

Player-approved wording remains non-authoritative and cannot block gameplay correction.

## Optional Adapter And Localization

No model or generator is authorized. A later separately approved adapter may improve transitions, compression, rhythm, equivalent lexical variation, or paragraph grouping over a closed allowlisted plan. It may not own facts, order, identity, references, pronouns, visibility, knowledge, diagnosis, urgency, causality, actions, outcomes, or history.

Locale-neutral semantics own roles, identity, person, semantic cardinality, reference permissions, observer knowledge, chronology, relations, intent, urgency categories, and provenance. Locale modules own surface paradigms, agreement, gender/case where needed, articles, inflection, lexicon, word order, punctuation, contractions, register, honorifics, and localized templates.

CLDR plural categories are not entity cardinality. English strings are not the universal profile. No localization dependency is accepted.

## Accepted Campaign Rules

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes";
```

- Difficulty, World Rules, Stakes, and mechanical overrides remain creation-locked.
- Accessibility, presentation, input, localization, and nonmechanical information formatting remain changeable.
- Production creation exposes only implemented and tested combinations.
- Story and Grim remain availability-gated.
- The future restricted-Stakes public name and machine id remain deferred.

## Current Defeat, Death, And Restoration Boundaries

Normal Stakes ordinary HP zero remains defeat or incapacitation, not implicit terminal death:

```text
HP reaches zero
  -> defeated or incapacitated
  -> context-owned nonterminal defeat resolution
  -> campaign identity and saves remain intact
```

The accepted generic fallback and current manual/quick-save topology remain controlling until a later explicit Stakes/Mortal Crisis authority revision retains, narrows, or supersedes them.

Restricted Stakes still treats atomically committed actual death as terminal. A resurrection-permitting actual-death stage requires explicit supersession.

Injury and restoration remain upstream:

- naturally recoverable physical injuries use Minor, Moderate, and Major severity independently from recoverability;
- `Shaken Spirit` remains the broad lore-facing trauma umbrella;
- normally irreversible harm does not fully regenerate through ordinary time or generic healing;
- complete anatomical restoration requires explicitly capable magic;
- resurrection remains separate from ordinary injury treatment.

Narrative may present only results accepted by these owners.

## Elemental Lane

The elemental audit and targeted research remain non-canonical evidence. The research supports this conceptual owner graph:

```text
world/magic/site/entity owners
  -> owner-certified affinity contributions and magical occurrences
  -> bounded affinity observation/aggregation
  -> manifestation eligibility and accepted transition
  -> persistent entity/presence identity
  -> perceived/recognized stimulus
  -> temperament + disposition + condition/memory
  -> capability eligibility and deterministic response
  -> accepted upstream action/outcome
  -> elemental interaction evidence
  -> observer projection and narrative realization
```

Evidence-backed boundaries:

- Affinity pressure should be a family of heterogeneous owner-produced evidence with bounded projections, not one universal canonical scalar.
- Source, field/observation, manifestation transition, persistent entity, and target-relative disposition remain separate.
- Stable identity and constitutive axes remain separate from capabilities, relationships, contextual roles, current condition, disposition, and selected action.
- Temperament is a repeatable prior; disposition is target/context specific; condition constrains the present; action is one accepted response.
- Active/passive, authoritative/perceived, direct/observed, source/target/locality, novelty/familiarity, compatibility, ownership/consent, and recognition are the minimum stimulus distinctions.
- The smallest safe first response posture is deterministic eligibility rules plus a small explicit state-transition policy and retained causal reasons.
- Helpful behavior remains explicitly capability-, trigger-, relationship/consent-, access-, cost-, selection-, and upstream-effect-gated.
- Warning cues may be observer-visible while exact temperament, disposition, policy branch, motive, and future action remain hidden.
- Migration, dormancy, dispersal, dissolution, death, runtime unloading, and correction are distinct; despawn is not an in-world outcome.
- Response identity retains normalized stimulus, context/state and policy versions, perception/recognition, candidates, eligibility/rejections, tie posture, authorized randomness, selection, causes, outcomes, and correction lineage.
- Current hostile River and Storm elementals do not establish universal hostility.
- No production dependency is recommended.

The next recommended run is `Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision`. It must decide bounded authority using the audit and research without treating external ecology, animal behavior, mythology, or game precedent as setting canon. Final Light/Darkness grouping, aliases, environmental mappings, entity taxonomy, temperament/capability distributions, response policies, persistence meanings, schemas, values, content, and implementation remain unauthorized.

## Later Mortal Crisis And Stakes Route

After narrative and elemental authorities are complete, a separate documentation-only decision remains required for:

- checkpoint commitment and replay-stable event identity;
- Mortal Crisis phase ownership;
- process-specific stabilization;
- direct versus intermediate care, transport, and reassessment;
- body recovery and preservation;
- resurrection eligibility and post-restoration convalescence;
- actual death versus final closure;
- rollback provenance;
- Prestige, estate, Chronicle, and succession ordering;
- public Stakes distinctions and explicit supersession of conflicting authorities.

The narrative decision did not resolve these gameplay outcomes.

## Implementation Order And Authorization

The accepted future order is grammatical/reference contracts; first English deterministic foundation; discourse resolver; event-time evidence; observer projection; scene planner; validation/fallback/regeneration; appearance/equipment/object/location adapters; Mortal Crisis consumer after later authority; Chronicle/Manuscript consumers; locked-edit lifecycle; optional morphology and localization spikes; optional generation only after separate authorization; and later persistence/UI integration.

Packages for evidence through fallback must form the minimum authoritative end-to-end pipeline before factual production use. No implementation package, release version, runtime schema, dependency, model, save migration, UI, content, or tests are authorized now.

## Temporary Evidence And Held Routes

- Retain both narrative evidence artifacts for the later Mortal Crisis/Stakes revision and narrative-engine implementation prompt.
- Retain the elemental audit and targeted elemental research for the durable elemental decision and later elemental implementation; retain the research also for the later Mortal Crisis/Stakes revision where elemental interaction matters.
- Retain comparative mortality and defeat/injury evidence for their named consumers.
- Held `0.6.6` remains untouched and recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained `0.6.7` artifacts remain untouched.
- No decision prompt, release, primary version, dependency, external model, elemental canon/runtime, Mortal Crisis runtime, save migration, or gameplay implementation is authorized.
