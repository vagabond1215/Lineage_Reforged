# Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision

Date: 2026-07-24

Run: `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision`

Status: accepted documentation-only design authority; no runtime, schema, save, migration, dependency, model, UI, content, test, or gameplay implementation is authorized

Classification: unversioned durable design-authority decision

Milestone impact: `supports_current_band`

## 1. Status, Scope, And Source Evidence

This decision accepts one reusable narrative-realization authority for fact-grounded presentation in Lineage: Reforged. It governs how accepted gameplay facts may become clear, connected, observer-safe prose for immediate Mortal Crisis presentation, Chronicle summaries, the Living Character Manuscript, later elemental encounter narration, and other compatible consumers.

The controlling evidence is:

- the repository audit at `docs/dev/tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md`, verified as blob `6cb28305a3b2c67601568103c6309f33956ecd31`;
- the grounded research at `docs/dev/tmp-grounded-narrative-realization-research-2026-07-23.md`, verified as blob `878219b57342430a47021c45e343ad27e1db95ac`;
- the accepted Living Character Manuscript, Quest/Event/Chronicle, Person/NPC, campaign-rules, Normal Stakes fallback, injury/restoration, restricted-Stakes, combat, party, equipment, inventory, magic, and presentation boundaries named in the active prompt.

The audit proves that the live repository has useful event, combat, identity, equipment, inventory, party, Chronicle, quest, account-history, and presentation seams but no general narrative realizer, grammatical-profile owner, discourse resolver, observer-safe projection, durable event-time narrative evidence, or factual validation pipeline. The research supports a staged deterministic architecture and finds no need for another broad narrative research pass.

This decision owns presentation transformation and its evidence requirements. Gameplay and domain owners continue to own facts and outcomes. Exact interfaces, field names, storage locations, retention durations, packages, dependencies, formulas, and release assignment remain deferred.

## 2. Executive Decision

Accept this mandatory stage graph:

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

An optional future branch may begin only after a closed scene plan exists:

```text
closed scene plan
  -> bounded request construction
  -> non-authoritative candidate prose
  -> validation
  -> accepted presentation or deterministic fallback
```

Deterministic local prose realization is mandatory. Prompt or request construction is optional and separate. No model, vendor, service, production dependency, or optional adapter is accepted by this decision.

The authority is intentionally conservative:

- gameplay truth is always upstream;
- later accurate regeneration requires owner-certified event-time evidence;
- observer projection removes facts before planning and wording;
- personal pronouns are explicit facts, never demographic inference;
- clear repeated names or descriptions are preferred to ambiguous pronouns;
- connected, correct prose is preferred to unlimited variety;
- any material validation failure simplifies or falls back deterministically;
- rendered, generated, locked, or player-edited prose is never provenance.

## 3. Accepted Vocabulary And Conceptual Model

The following terms are controlling:

- **Authoritative domain result:** a committed fact or outcome owned by combat, health, injury, equipment, inventory, identity, recognition, travel, treatment, magic, death, or another gameplay/domain authority.
- **Owner-certified event-time narrative evidence:** a durable, presentation-relevant account of accepted facts, explicit unknowns, ordering, and provenance captured for the exact occurrence. It is evidence, not prose and not a second outcome owner.
- **Observer projection:** the viewpoint-safe subset of evidence, including allowed epistemic posture and qualitative urgency. It consumes upstream visibility, recognition, knowledge, and diagnosis results; it does not calculate them.
- **Scene plan:** a deterministic presentation plan that selects and groups supported beats without resolving gameplay.
- **Beat:** an ordered presentation unit bound to accepted facts, roles, viewpoint, occurrence identity, and supported relations.
- **Discourse state:** scene-local deterministic state used to preserve reference clarity, salience, tense, viewpoint, and repetition bounds.
- **Semantic cardinality:** whether a referent is one entity, an explicit coordination of entities, or a persistent group. It is not a locale plural category.
- **Grammatical identity:** locale-neutral person, semantic cardinality, entity kind, reference permissions, pronoun posture, and provenance.
- **Locale profile:** locale-owned surface paradigm, agreement, inflection, word order, and related realization behavior.
- **Deterministic realization:** project-controlled conversion of a closed plan into prose using locked sentence families and a bounded locale module.
- **Deterministic fallback:** the mandatory, model-independent, validated minimum presentation for the same accepted plan.
- **Candidate presentation:** prose not yet accepted by validation.
- **Accepted presentation:** replaceable prose approved for a specific source/projection/plan/renderer version.
- **Validator-only evidence:** hidden facts available solely to detect leakage, contradiction, or policy violations and unavailable to realization.
- **Locked presentation:** accepted prose protected from automatic replacement.
- **Player-edited presentation:** non-authoritative personal prose with preserved edit lineage.

No prose class becomes canonical merely because it is accepted, locked, edited, persisted, or displayed.

## 4. Authority And Owner Graph

### Accepted owners

| Stage | Owner class | Conceptual inputs | Conceptual outputs |
| --- | --- | --- | --- |
| Domain resolution | Existing gameplay/domain owners | Commands, state, content, rules | Accepted results and authoritative state |
| Evidence certification | The source owner or an owner-approved evidence adapter | Accepted result, exact event-time view, source revision | Durable narrative evidence and explicit unknowns |
| Observer projection | Presentation projection owner consuming upstream perception/knowledge decisions | Certified evidence, viewpoint, visibility, recognition, diagnosis, spoiler policy | Renderer-safe projected facts plus epistemic posture |
| Scene planning | Narrative presentation owner | Projected facts, chronology, supported relations, consumer budget | Closed ordered beats and decision pause |
| Discourse and reference | Shared narrative presentation owner | Closed plan, grammatical identities, observer-known references | Deterministic reference choices and discourse state |
| Locale realization | Locale module | Closed realized roles/features, locale resources | Deterministic candidate prose |
| Validation and fallback | Narrative validation owner | Source/projection/plan identities, candidate, validator-only channel | Acceptance report, simplification, or fallback |
| Presentation storage | Consumer-compatible presentation owner | Accepted presentation and version lineage | Replaceable view, lock/edit status |
| Consumption | Mortal Crisis, Chronicle, Manuscript, and other UI adapters | Accepted presentation plus source identity | Player-facing presentation only |

Derived outputs include observer phrasing, beat grouping, reference choice, inflection, paragraph structure, and prose. None of those outputs may modify the authoritative inputs.

### Cycle prevention

The graph is one-way. The following cycles are forbidden:

- prose, Chronicle, journal, Manuscript, or UI text feeding gameplay facts;
- narrative output changing visibility, recognition, diagnosis, identity, equipment, or outcome;
- Mortal Crisis presentation selecting actions, routes, care, death, resurrection, or rewards;
- elemental wording driving elemental AI, affinity, disposition, or stimulus response;
- player approval or editing promoting prose into evidence;
- validator reports becoming gameplay results;
- current state being read later to invent an event-time transition.

If an upstream fact is unavailable, the presentation omits it or states only an accepted unknown. It does not repair the missing authority by inference.

## 5. Grammatical-Identity Boundary

Accept a locale-neutral grammatical identity sufficient to distinguish:

- first, second, and third grammatical person;
- one entity, explicitly coordinated entities, and a persistent group;
- person, creature, object, organization, place, collective, and other explicitly supported entity kinds;
- permitted reference strategies: name, alias, title, role, relationship, observer-local description, pronoun, or group expression;
- personal pronouns as explicit, unavailable, forbidden, or inapplicable;
- safe non-person defaults only where the entity-kind authority and locale policy explicitly permit them;
- profile provenance, revision, and the event time at which the profile applies.

Personal pronoun paradigms are authored or player-selected facts wherever personal pronouns are allowed. They must never be inferred solely from mechanical sex, `neutral`, name, title, alias, lineage, visible appearance, role, profession, or deity presentation.

Singular `they` and plural `they` are distinct semantic identities. A one-entity referent may use an explicitly authored singular-`they` English profile; an explicit coordination or persistent group remains plural even where English surface agreement overlaps.

Entities may forbid pronouns and require a name, title, or description. A missing or incomplete personal profile requires a no-pronoun fallback. A clearly non-person entity may use a safe locale default only when both the entity-kind authority and locale module explicitly accept it. No general default converts unknown entities into `it`.

Grammatical identity is not identity canon. Canonical person identity remains with its existing owner; the grammatical boundary supplies only the semantic facts needed for safe reference. Event-time revision is required so a later name, title, alias, profile, or group change does not rewrite earlier presentation evidence.

Exact fields, entity-category storage owners, authoring UI, migration, and validation schema remain deferred.

## 6. Locale-Specific Profile Boundary

The locale-neutral identity supplies semantic person, cardinality, coordination, entity kind, reference permissions, and provenance. A locale profile owns surface realization, including:

- subject and object pronouns;
- possessive determiner and possessive pronoun;
- reflexive form;
- agreement behavior;
- grammatical gender, case, animacy, classifier, honorific, register, or pronoun omission where the locale requires them;
- locale-specific name, title, and description ordering.

English strings are not stored as the universal grammatical authority. An English profile may realize singular `they` with its accepted agreement while retaining one-entity cardinality; plural `they` remains a group or coordination with its own membership identity and reflexive posture.

Profile absence is explicit evidence. It is not silently filled from presentation. Unsupported or incomplete locale profiles fall back to permitted names, titles, roles, or descriptions and omit pronouns.

## 7. Observer-Safe Reference Resolution

Accept a deterministic recency-and-role state machine as the first resolver. It operates per scene and is not statistical or model-owned.

Reference selection follows these rules:

1. First mention uses the shortest sufficiently identifying observer-known event-time reference.
2. Prefer an observer-known event-time name; otherwise use an observer-known alias, title, accepted relationship or role, or stable observer-local description.
3. A pronoun is allowed only when the personal profile is explicit, semantic cardinality and agreement are known, the antecedent is uniquely salient, and no competing live referent creates material ambiguity.
4. Subject, viewpoint, time, location, actor-set, paragraph, or scene-phase changes may reset salience and force a repeated name or description.
5. Two or more live actors sharing a pronoun paradigm require conservative repetition until the resolver can prove clarity.
6. Unknown or unrecognized entities retain a stable observer-local description identity and never expose a backend canonical name.
7. A group exists only from explicit event-time membership. A changed membership creates a revised group identity or dissolves the group.
8. Event-time names, titles, aliases, relationships, and descriptions remain bound to their source revision.
9. When any precondition is not proved, repeat the shortest observer-safe name or description.

Canonical backend names are never a missing-profile fallback. Repetition is preferred to ambiguity. The resolver may update subject, object, focal patient, focal threat, last unambiguous mention, and same-paradigm competitors after each clause, but it may not infer intimacy, identity, demographic facts, or group membership.

## 8. First English Morphology And Template Posture

Accept a hybrid first English posture:

- locked, fully inflected sentence families provide the lowest-risk baseline;
- a narrow project-owned morphology and agreement layer supports controlled composition;
- deterministic alternatives are allowed only when declared semantically equivalent and covered by tests;
- no production dependency is accepted.

The first controlled corpus supports:

- present and simple past;
- progressive aspect only for an accepted continuing state or action required by the corpus;
- perfect aspect only when a tested sentence family requires explicit anteriority;
- `be`, `have`, `do`, negation, and corpus-used modals;
- third-person singular and coordinated/plural subject agreement;
- regular plural and possessive forms plus a curated exception lexicon;
- curated irregular verbs used by the first corpus;
- controlled `a/an`, article intent, capitalization, punctuation, and paragraph joining.

Definiteness is a discourse decision, not a suffix heuristic. `a/an` is realized only within controlled lexical knowledge. The default first-corpus style uses no contractions. Quotation and generated dialogue are unsupported; dialogue may appear only after a separate authority supplies exact authored or accepted speech and a later realization policy admits it.

Static linting must reject missing variants, raw/debug identifiers, unsupported slots, undeclared tense changes, agreement mismatches, forbidden mechanical terms, and alternatives that add facts. Corpus golden tests are mandatory for later implementation.

Correct connected prose is the quality target. Controlled repetition is acceptable. Unlimited literary variation is not.

A later bounded offline comparison may evaluate project-owned morphology against `jsRealB` using a Lineage-owned non-canonical corpus, bundle and tree-shaking measurements, API stability, deterministic output, lexicon/data licensing, corpus accuracy, and build implications. That spike cannot add a production dependency without a separate decision.

## 9. Event-Time Evidence Classes And Provenance

Accept six distinct information classes:

1. **Authoritative durable domain events or results.** Their gameplay/domain owners remain authoritative.
2. **Owner-certified event-time narrative evidence.** This is the durable presentation-relevant evidence needed for later regeneration, including explicit unknowns.
3. **Observer-projected facts.** This is a viewpoint-safe, policy-versioned derivation.
4. **Renderer or template plans.** These are versioned presentation instructions.
5. **Accepted prose presentation.** This is replaceable, non-authoritative output.
6. **Validator-only hidden evidence.** This is a separate, non-renderable channel used only for leakage and contradiction checks.

When relevant, owner-certified evidence must preserve:

- actor, patient, observer, threat, helper, carrier, caster, provider, and group identities and roles;
- accepted actions and results;
- authoritative order, occurrence identity, and explicit simultaneity;
- event-time location, route segment, and position;
- event-time visible appearance;
- worn and held objects and accepted dropped, damaged, consumed, removed, released, or transferred transitions;
- visible injury and condition evidence;
- visibility, recognition, diagnosis confidence, uncertainty, and knowledge provenance;
- immutable content identities and revisions where later lookup is safe;
- exact source owner, source record, source revision, and projection-policy identity.

This evidence is not limited to the slots used by current templates. It must retain the minimum owner-certified facts needed for later accurate presentation improvement without duplicating the whole world snapshot.

Current state may assist immediate rendering only when bound to the exact accepted occurrence, beat, order, tick or equivalent time, and source revision. An arbitrary later live-state read is not historical proof.

Evidence certification may copy presentation-relevant facts, but it does not create a parallel gameplay authority. When the source is corrected, provenance points to the correction and affected presentations become stale; the narrative layer does not rewrite the gameplay record.

Final storage schema, retention lifetime, compaction, privacy, save/account boundary, and migration remain deferred.

## 10. Occurrence, Ordering, Simultaneity, And Revision Identity

Event type plus tick is not sufficient occurrence identity. Repeated same-type events within one tick must remain distinguishable through an accepted composition that includes source owner, source record or event, occurrence/order identity, and revision, or an equivalent durable identity.

The authority requires:

- a stable occurrence identity;
- authoritative sequence ordering where order matters;
- explicit simultaneity groups where actions are concurrent;
- beat identity derived from selected source occurrences and planner version, not prose text;
- content and source revision identity;
- explicit correction/supersession links without deleting prior presentation lineage.

Set ordering and sequence ordering must remain distinct. Absent and explicit unknown must remain distinct. Time representation, role identity, content revision, and semantic normalization must be defined before hashes or canonical serialization become authoritative.

The planner may preserve or compress order; it may never invent it. A correction can mark presentation stale and produce a new fact-set identity, but it cannot retroactively turn the old prose into evidence.

## 11. Observer, Visibility, Recognition, Diagnosis, Uncertainty, And Urgency Projection

Observer projection occurs before scene planning, referent choice, lexicalization, or optional request construction.

Its conceptual inputs are:

- viewpoint and observer identity;
- owner-approved lighting, distance, obstruction, concealment, armor, and visibility results;
- owner-approved recognition and known-identity state;
- skill-, treatment-, investigation-, or magic-supported inspection results;
- diagnosis confidence and knowledge provenance;
- spoiler, private-knowledge, and audience policy;
- owner-projected qualitative urgency.

Its output is a closed renderer-facing set of claims labeled as directly perceived, recognized, inferred under an accepted rule, reported by an accepted source, or unknown.

The projection owner does not calculate line of sight, health truth, diagnosis, severity, urgency, or future outcome. Exact diagnosis appears only when an upstream owner establishes that the observer knows it. Otherwise, prose uses visible evidence and a closed calibrated uncertainty vocabulary.

Reassessment is a new accepted beat with new evidence and confidence. It does not rewrite the uncertainty of an earlier observation.

Hidden timers, exact percentages, seeds, raw rolls, debug identifiers, private motives, secret identities, inaccessible diagnoses, future outcomes, and viewpoint-barred facts are excluded from the renderer-facing envelope. Qualitative urgency is an upstream projected category; it is never inferred by the renderer from a hidden number.

If projection cannot prove a claim safe, the claim becomes unknown or is omitted. Presentation failure cannot widen observer knowledge.

## 12. Scene And Beat Planning

The scene planner is a presentation planner over immutable accepted evidence. It may:

- order beats by authoritative chronology;
- preserve explicit simultaneity;
- aggregate repeated equivalent observations;
- combine an accepted action with its accepted visible result;
- use temporal succession, continuation, contrast, and cause/result only where the relation is explicitly supported;
- maintain accepted tense and viewpoint;
- preserve object, appearance, location, and position transitions;
- separate new knowledge from earlier uncertainty;
- apply consumer-specific length, repetition, sentence, and paragraph budgets;
- insert a hard decision pause after sufficient context;
- resume from a later accepted result without regenerating locked prior beats.

It must not:

- invent causality, intention, motive, emotion, strategy, witness, or dialogue;
- merge transitions where order changes meaning;
- turn every backend event into a mandatory battle-log line;
- choose gameplay action or outcome;
- expose raw mechanics as the default presentation.

Immediate Mortal Crisis may use a fuller scene plan; Chronicle and Manuscript may compress or cluster the same supported evidence. Consumer-specific compression cannot change truth, reference identity, chronology, or provenance.

If a supported relation is unavailable, the planner uses neutral temporal succession or separate sentences. Literary smoothness never justifies an unsupported causal connective.

## 13. Deterministic Realization

The deterministic realizer consumes only a closed scene plan, resolved references, locale profile, and versioned controlled resources. It cannot query arbitrary live state or validator-only evidence.

The baseline produces connected sentence and paragraph families rather than one line per backend event. For a future first Mortal Crisis corpus, likely families include collapse or unresponsiveness, threat posture, helper access, visible assessment, accepted treatment action/result, carrying or extraction, direct or intermediate route, reassessment, and a decision lead-in. These families are scope examples, not implemented content or crisis outcomes.

Slots accept typed semantic roles and realized noun/verb features, not arbitrary prose fragments. Alternative wording requires declared semantic equivalence and deterministic selection tied to normalized source identity and renderer/template version.

For identical normalized facts, projection, plan, locale, morphology, lexicon, template, and renderer versions, the deterministic fallback must reproduce byte-for-byte.

If the requested locale or construction is unsupported, the realizer uses an explicitly accepted locale fallback policy and the smallest supported sentence family. It never guesses morphology or inserts raw backend text.

## 14. Validation, Simplification, And Fallback

Every candidate presentation, including deterministic output, must pass layered validation:

1. source and revision identity;
2. required beat and fact coverage;
3. allowlisted entities, relations, values, and reference identities;
4. forbidden fact and hidden-information leakage;
5. names, titles, pronouns, semantic cardinality, agreement, tense, viewpoint, and order;
6. event-time appearance, equipment, object, injury, magic, location, and position consistency;
7. observer and spoiler policy;
8. unsupported dialogue, motive, emotion, diagnosis, witness, outcome, or causal claims;
9. mechanical-language suppression;
10. length, repetition, and style budgets.

Closed typed deterministic sentence families provide strong guarantees only within their represented language. Schema-valid, grammar-constrained, structurally valid, or fluent prose is not necessarily factually valid. Learned entailment, extraction, round-trip parsing, and consistency scores may never be the sole factuality proof.

On a material failure:

1. reject the candidate;
2. deterministically simplify to smaller supported beats or sentence families;
3. validate again;
4. if necessary, emit the minimum validated factual fallback from the safe fact subset and keep any player decision separate;
5. omit unsupported claims and record a presentation failure report without changing gameplay.

Fallback remains available when any optional adapter is absent, prohibited, times out, changes version, or fails validation. Validation reports are presentation audit evidence, not gameplay authority.

## 15. Renderer Versus Validator-Secret Separation

Renderer-visible facts and validator-only evidence are separate conceptual channels.

Validator-only evidence may detect that candidate prose leaked or contradicted:

- a secret identity;
- an inaccessible diagnosis;
- a hidden timer or percentage;
- a private motive;
- a future result;
- another viewpoint-barred fact.

Validator-only evidence must not be available to deterministic lexical choice, scene planning, optional request construction, optional generation, player-facing reports, UI notices, ordinary presentation logs, or telemetry. Rejected candidates must not be cached in a form that creates an exposure path.

This decision does not require a particular process, service, database, or table separation. Later implementation must prove the separation through architecture review and tests. If separation cannot be verified, optional candidate generation is unavailable and deterministic realization receives only renderer-safe facts.

## 16. Regeneration And Idempotence

Accept layered identities for:

- normalized source fact set and provenance;
- observer policy/version and projected fact set;
- scene plan and planner version;
- locale, renderer, morphology, lexicon, and template/grammar versions;
- optional request schema, adapter, model, and decoding versions if later authorized;
- candidate prose and validation report;
- accepted presentation, lock state, and edit lineage.

Hashing or canonical JSON may encode an identity only after semantic normalization is defined. Serialization cannot decide which facts are equivalent.

Identical normalized facts and identical deterministic stage versions reproduce the fallback byte-for-byte. Presentation improvements require explicit version changes and scoped regeneration. Regeneration may change presentation only; it cannot change gameplay truth, source evidence, observer knowledge at the event time, or locked/player-edited text.

Failures preserve the prior accepted presentation where policy permits, mark its status accurately, and make the deterministic fallback available for comparison.

## 17. Locked And Player-Edited Prose Lifecycle

Accept this conceptual presentation-status vocabulary:

- **current:** presentation matches its source, projection, plan, validator, and renderer identities;
- **locked-current:** current presentation protected from automatic replacement;
- **player-edited-current:** player-edited presentation whose source identities remain current but whose wording is personal and non-authoritative;
- **stale-source:** source facts or revisions changed;
- **stale-policy:** observer, content, planner, locale, or validation policy changed incompatibly;
- **validation-failed:** the stored wording no longer passes current mandatory validation;
- **superseded:** a newer accepted presentation exists while lineage is retained.

Locked and player-edited prose is never silently overwritten. Preserve its source/presentation versions, edit lineage, and lock status.

When source facts, observer policy, content revisions, or validation rules change, incompatible prose is marked stale or validation-failed. A stale player-edited passage may remain visible only as explicitly non-authoritative personal presentation under later product policy.

A future product surface must support the conceptual choices to compare, regenerate, relock, accept a new deterministic presentation, or retain personal text. Exact controls are deferred.

Locked prose cannot block correction of gameplay truth. Player approval does not make prose evidence. Regeneration never uses player-edited wording to infer missing facts.

## 18. Optional Bounded-Generation Non-Authority

No bounded generator is authorized now. A future adapter requires a separate decision covering model/vendor, deployment, privacy, caching, request security, versioning, and validation.

If later authorized, it may improve only:

- transitions;
- compression;
- rhythm;
- declared semantically equivalent lexical variety;
- paragraph grouping within a closed scene plan.

It may not own or choose facts, event order, identity, references, pronouns, visibility, knowledge, diagnosis, urgency, causality, gameplay action, outcome, or canonical history.

Its request constructor receives an allowlisted closed plan, never raw saves, unrestricted repository state, or validator-only evidence. Names and authored content remain inert data, not executable instructions. Candidate prose is always rejectable, is never parsed back into gameplay, and never becomes provenance.

The deterministic fallback remains the baseline. If an optional adapter is unavailable or rejected, the user receives the same authoritative gameplay result and a validated deterministic presentation.

## 19. Localization Seams

Locale-neutral authority owns:

- semantic roles and entity identity;
- grammatical person;
- semantic cardinality and coordination;
- permitted reference strategies;
- observer knowledge and provenance;
- event chronology and supported relations;
- beat intent and qualitative urgency category;
- source, plan, and presentation identities.

A locale module owns:

- pronoun surface paradigms;
- agreement behavior;
- grammatical gender, case, animacy, classifiers, or omission where required;
- articles and definiteness realization;
- inflection and irregular lexicon;
- word order;
- punctuation, contractions, register, and honorific realization;
- locale-authored templates and messages.

CLDR plural categories are not entity semantic cardinality. English pronoun strings are not the universal profile. A future MessageFormat- or Fluent-like resource system may own localized messages but may not become the scene planner, referent owner, or factuality authority.

A locale without a complete realization module must use a separately accepted translated locked-template policy or an explicitly identified base-locale fallback. It must never use ad hoc slot insertion. The exact product fallback and localization dependency remain deferred.

## 20. Mortal Crisis, Chronicle, Manuscript, And Elemental Consumer Boundaries

All compatible consumers share the same grammatical, referent, evidence, observer, validation, and fallback authority. Crisis-only, Chronicle-only, Manuscript-only, and elemental-only parallel pronoun or grammar owners are forbidden.

### Mortal Crisis

Narrative may present accepted upstream facts about collapse or unresponsiveness; threat continuation, disengagement, interception, capture, or redirection; party access; assessment; treatment; carrying; extraction; progressive visible deterioration or stabilization; direct or intermediate care stops; equipment and object changes; observer uncertainty; improving diagnosis; qualitative urgency; a separate contextual decision; and later treatment, resurrection, convalescence, or closure only after their owners accept them.

Narrative does not own lethal-process timers, route optimization, care capability, treatment outcome, death, resurrection, saving, Stakes, Prestige, succession, estate, or rewards. Exact hidden survival time and system-log labels are not default player-facing presentation. Exact time appears only when an upstream owner establishes that it is naturally knowable in-world.

### Chronicle

Chronicle may consume and compress accepted evidence or accepted presentations. Existing Chronicle summaries remain presentation. Chronicle prose, titles, entity strings, and result strings are not event provenance and cannot reconstruct missing history.

### Living Character Manuscript

The Manuscript remains an editorial projection. It may cluster, compress, arrange, summarize, regenerate, lock, and permit personal edits within its accepted boundary. It cannot own facts, relationships, equipment, identity, chronology, or gameplay state.

### Elemental narration

Later elemental encounters may consume this shared presentation authority only after a separate elemental decision accepts elemental facts and behavior. This decision does not decide affinity, alignment, manifestation, disposition, stimulus, capability, taxonomy, or AI.

## 21. Forbidden Parallel Authorities And Failure Boundaries

The following are explicitly forbidden:

- domain-specific pronoun, morphology, or ambiguity rules outside the shared authority;
- Chronicle or Manuscript prose as canonical history;
- a generator or prompt builder as fact selector;
- current snapshots as unbound historical evidence;
- backend canonical names as unknown-identity fallback;
- prose-derived equipment, appearance, diagnosis, intent, emotion, witness, causality, or outcome;
- model, statistical, or learned referent ownership;
- validator-secret access from renderers or request builders;
- UI labels or debug identifiers as stable semantic identities;
- optional-adapter availability as a prerequisite for gameplay or minimum prose.

When an upstream authority is absent, the narrative path degrades by omission, explicit unknown, safe repeated description, simplification, or deterministic fallback. It does not create a substitute authority.

## 22. Implementation-Package Order Without Implementation Permission

The accepted dependency order is:

1. grammatical identity and locale-neutral reference contracts;
2. first English profiles, locked templates, and narrow morphology foundation;
3. deterministic discourse and referent resolver;
4. owner-certified event-time narrative evidence and provenance boundary;
5. observer, visibility, recognition, diagnosis, uncertainty, and urgency projection boundary;
6. scene and beat planner;
7. layered validation, simplification, deterministic fallback, and regeneration identity;
8. appearance, equipment, object, location, and position evidence adapters;
9. first Mortal Crisis narrative adapter only after the later crisis authority accepts outcomes;
10. Chronicle and Manuscript adapters;
11. locked and player-edited presentation lifecycle;
12. bounded morphology-library comparison spike;
13. localization-resource spike;
14. optional bounded-generation spike only after separate authorization;
15. save, migration, UI, and focused integration after their owners are approved.

Packages 1-3 may be developed and tested against explicitly non-canonical fixtures. Packages 4-7 form the minimum authoritative end-to-end contract and must be accepted atomically before a factual production consumer can rely on the pipeline. Package 8 adapters may be separated by source owner but may not invent missing event-time transitions.

Packages 9 and 10 are consumers, not new grammar or truth owners. Package 11 may follow once accepted presentation identity exists. Packages 12-14 are optional evaluations and cannot block the deterministic baseline. Package 15 remains separately gated by persistence and product owners.

No release version, implementation prompt, package path, or runtime interface is assigned here.

## 23. Test And Acceptance Matrix

All future fixtures must be explicitly non-canonical.

### Grammar and reference

- male singular, female singular, singular `they`, plural `they`, and non-person profiles;
- a profile forbidding pronouns;
- incomplete personal profile with safe no-pronoun fallback;
- two same-pronoun actors and conservative repetition;
- subject, paragraph, location, time, and viewpoint changes;
- coordinated subjects and explicit persistent groups;
- changed group membership;
- unknown identity with stable observer-local description;
- observer-known name, title, alias, and role changes across event time;
- present and simple past;
- only corpus-required progressive or perfect constructions;
- `be`, `have`, `do`, negation, modals, agreement, plural, possessive, article, punctuation, and curated irregular forms.

### Event-time truth

- worn, held, dropped, released, consumed, removed, damaged, and transferred objects across beats;
- a two-handed object released before carrying a patient;
- clothing or armor concealing appearance;
- position and location transitions;
- an immediate snapshot bound to the exact accepted beat;
- later current state differing from historical evidence;
- repeated same-tick events with distinct occurrence identities;
- explicit simultaneity;
- content revision and source correction;
- explicit unknown versus absent evidence.

### Observer projection

- unseen or unrecognized identity remains hidden;
- insufficient diagnosis yields visible evidence and calibrated uncertainty;
- skilled reassessment produces a new, more precise beat;
- hidden timer becomes qualitative urgency only;
- future outcome, secret identity, private motive, and inaccessible diagnosis remain barred;
- reported versus directly perceived evidence remains distinguishable;
- validator-only facts cannot reach planning, realization, requests, UI, or logs.

### Planning and validation

- connected multi-sentence scene rather than one line per event;
- supported simultaneous actions;
- decision pause after sufficient context;
- unsupported causal connective rejected;
- unsupported dialogue, emotion, motive, witness, object, appearance, diagnosis, or outcome rejected;
- deterministic byte-for-byte reproduction for identical facts and versions;
- material validation failure selects simplification or deterministic fallback;
- mechanical-language leakage rejected;
- source correction marks prior presentation stale without gameplay mutation.

### Presentation lifecycle and optional adapter

- versioned regeneration without gameplay mutation;
- locked prose preserved;
- source-corrected locked prose marked stale rather than overwritten;
- player-edited passage retains edit lineage and non-authoritative status;
- compare, regenerate, relock, and personal-retention states preserve lineage;
- optional adapter unavailable, prohibited, timed out, version-changed, or rejected with seamless fallback;
- candidate prose never becomes provenance or gameplay input.

## 24. Authority Retention And Supersession Matrix

| Existing authority or seam | Disposition | Effect of this decision |
| --- | --- | --- |
| Living Character Manuscript design boundary | retained and clarified | Manuscript remains a downstream editorial projection; this decision supplies its shared future grammar, evidence, observer, validation, and staleness authority |
| Quest/Event/Chronicle boundary | retained and clarified | Quests/events retain their owners; Chronicle and journal prose remain presentation and cannot become provenance |
| Person/NPC schema posture | retained and clarified | Canonical person identity remains separate; later grammatical identity must reference, not duplicate or infer, person facts |
| Combat and party presentation | retained and clarified | Combat/party own accepted actors, actions, and results; display names alone do not establish grammatical or historical authority |
| Equipment and inventory authorities | retained and clarified | They own item truth and transitions; narrative needs exact event-time certified evidence and cannot infer from later current state |
| Normal Stakes fallback | retained; later revision explicitly deferred | Generic nonterminal fallback and recovery receipt remain controlling; narrative presents only accepted outcomes |
| Campaign rules | retained | Difficulty, World Rules, initial `normal_stakes`, locks, availability, and save posture are unchanged |
| Injury and restoration | retained | Injury, trauma, irreversible harm, restoration, and resurrection boundaries remain upstream |
| Restricted Stakes | retained; later revision explicitly deferred | Current terminal actual-death closure, continuity, Prestige, and succession posture remain unchanged |
| Elemental audit and later authority | explicitly deferred | Audit remains evidence only; no elemental canon or behavior is accepted |
| Current Chronicle, journal, notice, account-history, and UI strings | narrowed as authority, otherwise retained | Existing text remains usable presentation but is explicitly disqualified as event provenance, grammar authority, or reconstruction input |
| Combat status/condition/injury boundary | retained | Narrative may name only accepted upstream vocabulary and observer-safe evidence |
| Magic and treatment boundaries | retained | Narrative cannot infer capability, eligibility, outcome, diagnosis, or urgency |

No save, defeat, death, resurrection, Stakes, Chronicle persistence, authored-content, or gameplay authority is superseded. The only intentional narrowing is that existing rendered strings and display labels cannot be treated as factual or grammatical authority.

## 25. Temporary-Artifact Retention And Removal Conditions

Retain:

- `docs/dev/tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md` until this decision, the later Mortal Crisis/Stakes authority revision, and a later narrative-engine implementation prompt have all consumed it;
- `docs/dev/tmp-grounded-narrative-realization-research-2026-07-23.md` until the same three consumers have completed;
- `docs/dev/tmp-elemental-alignment-temperament-and-magic-stimulus-audit-2026-07-23.md` until the targeted elemental research, durable elemental decision, and later elemental implementation prompts have consumed it;
- comparative mortality research and the retained defeat/injury audit until their named later consumers complete.

This decision consumes the first narrative-decision use but does not delete any artifact. Removal requires confirmation that every named remaining consumer has promoted necessary evidence into durable authority or no longer needs it.

## 26. Unresolved Implementation Decisions

The following remain intentionally unresolved and require later focused decisions or spikes:

- exact grammatical-profile fields and ownership for players, authored people, transient actors, deities, objects, organizations, coordinations, and persistent groups;
- exact English sentence corpus, curated irregular lexicon, reflexive policy, supported modals, and style budgets;
- exact evidence retention owner, lifetime, compaction, privacy, save/account boundary, storage, and migration;
- exact semantic normalization and occurrence-identity composition;
- exact upstream visibility, recognition, diagnosis, and urgency owner contracts;
- exact supported causal-relation vocabulary and aggregation budgets;
- exact presentation persistence and stale-status storage;
- project-owned morphology versus a later `jsRealB` adoption after the bounded comparison;
- later localization resource choice;
- whether optional learned validation or bounded generation is ever authorized;
- exact product controls for compare, regenerate, relock, and retain-as-personal-text.

These questions do not reopen broad narrative research and do not weaken the accepted authority boundary.

## 27. Explicit Non-Decisions

This decision does not:

- implement runtime, shared types, schemas, saves, migrations, storage, UI, tests, content, or generated files;
- select exact field names, interfaces, package paths, tables, retention durations, formulas, or release versions;
- add or accept a production dependency;
- select a model, API, vendor, hosted service, local model, generation prompt, privacy posture, or deployment;
- authorize sending repository data to an external generation service;
- decide Mortal Crisis actions, timers, routes, transport, care, treatment, death, resurrection, recovery, closure, Stakes, Prestige, estate, succession, or rewards;
- change campaign rules, save topology, Normal Stakes fallback, injury/restoration, or restricted-Stakes authority;
- decide elemental alignment, ecology, manifestation, temperament, magic stimulus, beneficial capability, fae, spirit, guardian, construct, animal, or monster behavior;
- restore held `Version 0.6.6` or change retained `0.6.7`;
- create an implementation prompt or the next research prompt.

## 28. Mandatory Decision Conclusions

| # | Statement | Decision |
| --- | --- | --- |
| 1 | Gameplay truth remains upstream of narrative projection. | Accepted |
| 2 | Owner-certified event-time narrative evidence is required for accurate later regeneration. | Accepted |
| 3 | Current snapshots are not historical proof unless bound to the exact accepted event or beat. | Accepted |
| 4 | Narrative evidence is durable evidence, not merely today's template slots. | Accepted |
| 5 | Observer projection precedes scene planning and realization. | Accepted |
| 6 | Personal pronouns are explicit and are not inferred from mechanical sex or descriptive identity. | Accepted |
| 7 | Singular `they` and plural `they` remain semantically distinct. | Accepted |
| 8 | Ambiguous pronouns fall back to observer-safe names or descriptions. | Accepted |
| 9 | Prompt construction and prose realization are separate functions. | Accepted |
| 10 | Deterministic model-independent fallback is mandatory. | Accepted |
| 11 | Renderer-visible facts and validator-only secrets are separate channels. | Accepted |
| 12 | Generated prose, Chronicle prose, and Manuscript prose are not provenance. | Accepted |
| 13 | Material validation failure causes simplification or fallback. | Accepted |
| 14 | Locked or player-edited prose is never silently overwritten. | Accepted |
| 15 | Stale locked prose is marked and compared rather than treated as truth. | Accepted |
| 16 | Optional bounded generation has presentation-only non-authority. | Accepted |
| 17 | English realization remains behind a locale-neutral semantic boundary. | Accepted |
| 18 | No production dependency or model is accepted by this decision. | Accepted |
| 19 | Mortal Crisis narrative does not own crisis outcomes. | Accepted |
| 20 | Elemental ecology and stimulus behavior remain a separate later authority lane. | Accepted |

The next recommended run is the separate substantial research pass `Elemental Affinity Ecology, Environmental Manifestation, Temperament, And Magic-Stimulus Research`. This decision does not install its prompt.
