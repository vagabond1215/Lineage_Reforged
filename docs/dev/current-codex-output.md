# Current Codex Output

Source version/run: `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision`

Date: 2026-07-24

Branch/status assumption: `master`; starting commit and ending pre-edit commit `a6a2b0d2a760ea53a7684fbb2880e3725022b507`; clean initial and post-pull worktree

Label class: unversioned durable documentation-only design authority decision

Parent version: none

Milestone impact: `supports_current_band`

Status: complete; narrative-realization authority accepted; implementation remains unauthorized

## Files Changed

- created `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`;
- updated `docs/dev/current-codex-output.md`;
- updated `docs/dev/current-gpt-handoff.md`;
- updated `docs/dev/historical-version-and-deferred-route-register.md`.

No other path was intentionally modified. The active prompt was not changed.

## Repository And Source-Identity Verification

- Initial branch/upstream: `master...origin/master`; initial `HEAD` `a6a2b0d2a760ea53a7684fbb2880e3725022b507`.
- The required fetch and fast-forward pull completed after approval and reported already up to date.
- The post-pull active prompt remained `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision`.
- Completed grounded-research commit `902a33597581c18000b7fd1ecee72e06e258762c` is an ancestor of `HEAD`.
- Narrative audit matched blob `6cb28305a3b2c67601568103c6309f33956ecd31` and was unmodified.
- Grounded narrative research matched blob `878219b57342430a47021c45e343ad27e1db95ac` and was unmodified.
- Living Character Manuscript boundary matched blob `5ad12814696e65c77f893b7d4426731350757245` and was unmodified.
- Quest/Event/Chronicle boundary matched blob `38ee8287c4c072807f6590537f361b80afc723fc` and was unmodified.
- Person/NPC decision matched blob `1f130a3b1d63de8d2b7e607c9215ce13d76ea463` and was unmodified.
- Normal Stakes fallback, campaign rules, injury/restoration, and restricted-Stakes decisions matched blobs `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`, `20e72fb280fd67351135e195f75195a592bce9c9`, `71550ab225cacfea0e8ad00eb29b034dfb86f4ff`, and `e1d2ec6b087eb9be7f9222763e25fee86c2f5329`.
- Elemental audit matched blob `974e84f89805ba3e6789331183b474fce7f30d36` and was unmodified.
- Pre-edit handoff and route register matched blobs `802dcf66df93b4c8290cbfe111399049dae460fc` and `186e6b6e0b60ad7c69538c7793c67e2374e23f3e`.
- Held `Version 0.6.6` remains available as Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`; `git cat-file` confirmed object type `blob`.
- The new decision artifact resolves in the worktree to blob `879c8e0b419eb429fe5af2022ef647f175b130f4`.

## Accepted Owner Graph

Accepted:

```text
authoritative domain results
  -> owner-certified event-time narrative evidence
  -> observer / viewpoint projection
  -> scene and beat plan
  -> discourse and referent resolution
  -> locale-specific deterministic realization
  -> validation
  -> accepted presentation or deterministic fallback
  -> presentation consumers
```

Gameplay/domain owners continue to own identity, combat, health, injury, equipment, inventory, recognition, travel, treatment, magic, death, and all accepted outcomes. Narrative planning, realization, validation, and storage are downstream presentation stages.

Prompt/request construction is a separate optional adapter after a closed scene plan. Local deterministic realization is mandatory and model-independent.

## Accepted Grammar And Referent Boundary

- Locale-neutral grammatical identity distinguishes grammatical person, one entity, explicit coordination, persistent groups, entity kind, permitted reference strategies, pronoun posture, provenance, and event-time revision.
- Personal pronoun paradigms are explicit authored or player-selected facts. Mechanical sex, `neutral`, name, title, lineage, appearance, role, profession, and deity presentation cannot infer them.
- Singular `they` and plural `they` remain distinct semantic cardinalities despite overlapping English agreement.
- Missing or forbidden personal pronouns degrade to the shortest observer-safe event-time name, title, role, relationship, or stable description.
- Backend canonical names are never exposed merely because a profile is missing.
- The first resolver is a deterministic recency-and-role state machine. Competing same-paradigm actors, subject/viewpoint changes, or uncertainty force conservative repetition.
- Groups require explicit event-time membership and change identity when membership changes.

## Accepted First English Realization Posture

- Locked fully inflected sentence families plus a narrow project-owned morphology/agreement layer.
- Present and simple past; progressive or perfect only where the tested first corpus requires them.
- Controlled `be`, `have`, `do`, negation, modals, third-person singular, coordination, plural, possessive, article, capitalization, punctuation, and curated irregular behavior.
- Default no contractions for the first corpus. Quotation and generated dialogue are unsupported without separate upstream and realization authority.
- Deterministic lexical alternatives require declared semantic equivalence and tests.
- Static linting and corpus golden tests are mandatory.
- Correct connected prose and clear controlled repetition outrank unlimited literary variety.
- No production dependency is accepted. A later offline `jsRealB` comparison remains optional and separately gated.

## Accepted Event-Time Evidence And Provenance Boundary

Six classes remain distinct:

1. authoritative domain events/results;
2. owner-certified durable event-time narrative evidence;
3. observer-projected facts;
4. renderer/template plans;
5. accepted prose;
6. validator-only hidden evidence.

Durable evidence retains, when relevant, role-bound identities, accepted actions/results, stable occurrence and order identity, explicit simultaneity, location/route/position, visible appearance, worn/held/object transitions, visible injury/condition evidence, observer knowledge and confidence, content revisions, and exact source/projection provenance.

Evidence is not limited to today's template slots and is not a duplicate world snapshot. Current snapshots are usable only when bound to the exact accepted occurrence, beat, order/time, and revision. Event type plus tick is insufficient for repeated same-tick events.

## Accepted Observer Projection Boundary

Observer projection precedes planning and realization. It consumes upstream visibility, lighting, distance, obstruction, concealment, armor, recognition, inspection, diagnosis, and qualitative-urgency results.

The renderer does not calculate line of sight, health truth, diagnosis, severity, urgency, or future outcomes. Exact diagnosis requires upstream observer knowledge. Otherwise, presentation uses visible evidence and a closed uncertainty vocabulary.

Reassessment is a new beat. Hidden timers, percentages, seeds, raw rolls, debug ids, private motives, secret identities, inaccessible diagnoses, future outcomes, and viewpoint-barred facts remain outside the renderer envelope.

## Accepted Planning, Validation, Fallback, And Regeneration Posture

- The planner orders accepted facts, preserves simultaneity, groups compatible beats, uses only supported relations, applies consumer budgets, and inserts a hard decision pause.
- It cannot invent causality, intention, motive, emotion, strategy, witness, dialogue, action, or outcome.
- Validation covers source/revision, fact coverage, allowlisted identities/relations/values, leakage, grammar/reference/order, event-time truth, observer/spoiler policy, unsupported claims, mechanical-language suppression, and style budgets.
- Structural or grammar validity is not factual validity. Learned checks cannot be the sole proof.
- Material failure rejects, deterministically simplifies, revalidates, and falls back to the minimum safe factual presentation.
- Identical normalized inputs and deterministic stage versions reproduce the fallback byte-for-byte.
- Semantic normalization must define set/sequence ordering, absent versus unknown, time, content revision, and roles before hashes become authoritative.
- Regeneration changes presentation only.

## Accepted Locked-Prose Lifecycle

Accepted conceptual statuses are current, locked-current, player-edited-current, stale-source, stale-policy, validation-failed, and superseded.

Locked or player-edited prose is never silently overwritten. Source, presentation, validation, and edit lineage remain attached. Changed facts or policies mark incompatible text stale or validation-failed and support later compare, regenerate, relock, or retain-as-personal-text choices.

Locked/player-edited prose remains non-authoritative and cannot block gameplay corrections or become evidence.

## Accepted Optional-Adapter Non-Authority

No generator is authorized. A separately approved future adapter may improve transitions, compression, rhythm, equivalent lexical variation, or paragraph grouping over a closed plan.

It may not own facts, order, identity, references, pronouns, visibility, knowledge, diagnosis, urgency, causality, actions, outcomes, or history. Request construction uses allowlisted plan data, never raw saves, unrestricted repository state, or validator-only evidence. Candidate prose is rejectable, never parsed into gameplay, and never provenance.

## Accepted Localization Boundary

Locale-neutral semantics own roles, identity, grammatical person, semantic cardinality, reference permissions, observer knowledge, chronology, supported relations, beat intent, urgency categories, and provenance.

Locale modules own pronoun surfaces, agreement, grammatical gender/case where required, articles, inflection, irregular lexicon, word order, punctuation, contractions, register, honorifics, and localized templates/messages.

CLDR plural categories are not entity cardinality. English strings are not the universal profile. MessageFormat- or Fluent-like systems may later own resources but not planning, references, or factuality. No localization dependency is accepted.

## Authority Retention And Supersession

- Living Character Manuscript, Quest/Event/Chronicle, Person/NPC, combat, party, equipment, inventory, campaign, Normal Stakes fallback, injury/restoration, restricted-Stakes, status/condition/injury, and magic authorities are retained and clarified.
- Existing Chronicle, journal, notice, account-history, and UI strings remain presentation but are narrowed explicitly: they are not event provenance, grammar authority, or historical reconstruction input.
- No save, defeat, death, resurrection, Stakes, Chronicle persistence, authored-content, or gameplay authority is superseded.
- Mortal Crisis narrative can present only accepted upstream outcomes and cannot own crisis resolution.

## Implementation-Package Order

1. grammatical identity and locale-neutral reference contracts;
2. English profiles, locked templates, and narrow morphology;
3. deterministic discourse/referent resolver;
4. event-time narrative evidence and provenance;
5. observer/recognition/diagnosis projection;
6. scene and beat planner;
7. validation, simplification, fallback, and regeneration identity;
8. appearance/equipment/object/location/position adapters;
9. Mortal Crisis adapter only after later crisis authority;
10. Chronicle and Manuscript adapters;
11. locked/player-edited lifecycle;
12. morphology-library comparison;
13. localization-resource spike;
14. optional bounded-generation spike after separate authorization;
15. separately approved save/migration/UI integration.

Packages 1-3 may use non-canonical fixtures. Packages 4-7 are the minimum atomic authoritative pipeline before factual production use. No implementation is authorized and no release version is assigned.

## Tests Required

Future non-canonical fixtures must cover:

- all required pronoun/cardinality profiles, forbidden/incomplete profiles, ambiguous actors, viewpoint resets, groups, unknown identities, event-time labels, tense, agreement, and irregular morphology;
- held, worn, dropped, released, consumed, removed, damaged, and transferred objects; two-hand release before carrying; concealment; location/position; bound snapshots; later state drift; same-tick occurrences; simultaneity; corrections;
- unknown identity, limited diagnosis, reassessment, qualitative urgency, hidden facts, and validator-channel isolation;
- connected scenes, decision pauses, supported relations, rejection of invented claims, deterministic reproduction, fallback, mechanical-language rejection, and stale marking;
- locked/player-edited lineage and seamless optional-adapter fallback.

## Unresolved Implementation Questions

- exact profile fields and entity-category owners;
- exact English corpus, irregular lexicon, reflexive/modals/style budgets;
- evidence retention owner, lifetime, compaction, privacy, save/account boundary, storage, and migration;
- semantic normalization and occurrence identity composition;
- upstream visibility, recognition, diagnosis, and urgency contracts;
- supported causal vocabulary and aggregation budgets;
- presentation persistence and stale-status storage;
- project-owned morphology versus `jsRealB`;
- localization resource choice;
- whether learned validation or bounded generation is ever authorized;
- exact compare/regenerate/relock/personal-text product controls.

These are later focused questions, not reasons for more broad narrative research.

## Elemental-Lane Separation

The elemental audit remains evidence only. No elemental alignment, manifestation, ecology, temperament, stimulus, beneficial capability, taxonomy, AI, fae, spirit, guardian, construct, animal, or monster behavior is accepted.

The next recommended run is `Elemental Affinity Ecology, Environmental Manifestation, Temperament, And Magic-Stimulus Research`. The later durable elemental decision and later Mortal Crisis/Stakes revision remain separate.

## Temporary Artifacts And Held Routes

Both narrative evidence artifacts remain retained for the later Mortal Crisis/Stakes revision and narrative-engine implementation prompt. The elemental audit remains retained for targeted research, the elemental decision, and later implementation. Comparative mortality and defeat/injury evidence remain retained for their named consumers.

Held `Version 0.6.6` remains paused and byte-recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`. Retained `0.6.7` posture is unchanged.

## Checks Run

- inspected initial branch, status, upstream, and `HEAD`;
- ran the required fetch and fast-forward pull;
- reloaded and confirmed the active prompt;
- verified the required ancestor and all pinned evidence/authority identities;
- confirmed the held `0.6.6` Git object;
- read the required audits, research, coordination documents, accepted design boundaries, `AGENTS.md`, and `README.md`;
- inspected relevant event, identity, combat, party, equipment, inventory, Chronicle, journal, account-history, save, and presentation types/consumers plus workspace manifests;
- verified the decision contains all required authority, evidence, grammar, observer, planning, validation, regeneration, lifecycle, localization, consumer, package-order, test, retention, unresolved, and non-decision sections;
- verified exact four-path change scope and protected-input status;
- ran whitespace/error-marker and targeted content checks after editing;
- no build, typecheck, runtime test, dependency install, generator, external research, or application server was run because this was documentation-only.

## Risks / Follow-Up Notes

The principal future risks are treating current state as event-time proof, allowing display strings to become identity or provenance, overloading English pronouns as universal grammar, and mistaking structurally valid optional prose for factual prose.

Later implementation must preserve the atomic evidence/projection/planning/validation boundary and must not adopt a production dependency before a Lineage-owned corpus, licensing review, bundle measurement, and deterministic evaluation.

## Suggested Commit Message

`docs(design): accept narrative realization and fact projection authority`

## Next Recommended Run

Run the separate substantial research pass `Elemental Affinity Ecology, Environmental Manifestation, Temperament, And Magic-Stimulus Research`.
