# Current Codex Prompt

## Run Identity

`Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision`

Run classification: unversioned durable documentation-only design authority decision

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(design): accept narrative realization and fact projection authority`

## Purpose

Accept one durable narrative-realization authority for Lineage Reborn after the completed repository audit and grounded external research.

The decision must establish how authoritative gameplay facts become accurate, connected, context-aware narrative while preserving:

- correct names, titles, aliases, roles, pronouns, grammatical person, semantic cardinality, agreement, possessives, reflexives, tense, and chronology;
- event-time appearance, clothing, armor, visible injuries, held and worn objects, dropped, consumed, removed, damaged, or transferred objects, location, and position;
- observer visibility, recognition, knowledge, diagnosis confidence, uncertainty, and spoiler boundaries;
- deterministic scene and beat planning;
- qualitative urgency without default exposure of hidden timers, percentages, random seeds, rolls, or debug identifiers;
- strict factual provenance and deterministic fallback;
- separation between gameplay truth, narrative evidence, rendered prose, Chronicle, and Living Character Manuscript presentation.

This run must make durable design decisions. It must not remain an options survey where the audit and research already provide sufficient evidence.

This run is documentation-only. It does not implement runtime, schemas, saves, migrations, packages, dependencies, prompts sent to an external model, model integration, UI, tests, content, Mortal Crisis outcomes, elemental systems, combat, health, death, resurrection, Stakes, Prestige, succession, or gameplay.

## Why This Decision Is Ready

The repository audit established that:

- no reusable narrative-realization engine currently exists;
- current prose is scattered interpolation and UI-ready strings;
- `PlayerSexId`, `neutral`, names, titles, lineage, appearance, and deity presentation cannot safely own pronouns;
- current Chronicle and quest strings are presentation rather than canonical event history;
- later regeneration cannot prove event-time equipment, appearance, object transitions, visibility, diagnosis, or position;
- shared events provide useful foundations but not a durable general narrative evidence store;
- Mortal Crisis requires observer-limited connected narrative rather than battle-log output or a visible timer dashboard.

The grounded research found sufficient evidence to accept:

- a staged fact-to-prose pipeline;
- explicit grammatical identity separated from mechanical sex and English surface forms;
- deterministic conservative referent resolution;
- locked deterministic sentence families plus a narrow first English morphology layer;
- mixed event-time evidence retention with exact provenance;
- upstream observer projection;
- layered validation and mandatory deterministic fallback;
- optional bounded generation only as a later rejectable presentation adapter;
- locale-neutral semantic contracts with locale-owned realization.

No further broad narrative research is required before this decision.

## Route Precedence

The active-run portions of `docs/dev/current-gpt-handoff.md` and `docs/dev/historical-version-and-deferred-route-register.md` have been reconciled to this decision run.

This prompt controls the active run. Existing accepted design authorities remain controlling until this decision explicitly retains, narrows, or supplements them.

The completed narrative audit and grounded research are evidence, not authority. The completed elemental audit remains evidence for a separate later lane and must not become elemental canon through this run.

Held `Version 0.6.6` remains paused. Do not restore it.

## Required Repository State

Read first:

- `docs/dev/tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md`;
- `docs/dev/tmp-grounded-narrative-realization-research-2026-07-23.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/living-character-manuscript-design-boundary.md`;
- `docs/design/living-character-manuscript-research-intake-route.md`;
- `docs/design/quest-event-chronicle-authority-boundary-decision.md`;
- `docs/design/person-vs-npc-schema-decision.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
- `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`;
- `docs/design/combat-status-condition-injury-boundary-decision.md`;
- relevant shared event, identity, combat, party, inventory, equipment, route, Chronicle, quest-journal, account-history, and presentation types and consumers;
- workspace/package manifests only to understand current module and dependency constraints;
- `AGENTS.md`;
- `README.md`.

Read the elemental audit only to preserve the separation boundary and next-route order:

- `docs/dev/tmp-elemental-alignment-temperament-and-magic-stimulus-audit-2026-07-23.md`.

Relevant source identities:

- completed grounded-research commit: `902a33597581c18000b7fd1ecee72e06e258762c`;
- narrative audit blob: `6cb28305a3b2c67601568103c6309f33956ecd31`;
- grounded narrative research blob: `878219b57342430a47021c45e343ad27e1db95ac`;
- grounded research output blob: `b852f134745d1e66d07878fb11067293da05667e`;
- elemental audit blob: `974e84f89805ba3e6789331183b474fce7f30d36`;
- Living Character Manuscript boundary blob: `5ad12814696e65c77f893b7d4426731350757245`;
- Quest/Event/Chronicle boundary blob: `38ee8287c4c072807f6590537f361b80afc723fc`;
- Person/NPC schema decision blob: `1f130a3b1d63de8d2b7e607c9215ce13d76ea463`;
- Normal Stakes fallback decision blob: `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`;
- campaign-rules decision blob: `20e72fb280fd67351135e195f75195a592bce9c9`;
- injury/restoration decision blob: `71550ab225cacfea0e8ad00eb29b034dfb86f4ff`;
- restricted-Stakes decision blob: `e1d2ec6b087eb9be7f9222763e25fee86c2f5329`;
- reconciled GPT handoff blob: `802dcf66df93b4c8290cbfe111399049dae460fc`;
- reconciled route-register blob: `186e6b6e0b60ad7c69538c7793c67e2374e23f3e`;
- held `Version 0.6.6` prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Execution Gate

1. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, ending pre-edit commit, and clean/dirty state.
2. Reload and confirm this prompt is active after the pull.
3. Confirm commit `902a33597581c18000b7fd1ecee72e06e258762c` is an ancestor of `HEAD`.
4. Confirm the narrative audit resolves to blob `6cb28305a3b2c67601568103c6309f33956ecd31` and is unmodified.
5. Confirm the grounded research resolves to blob `878219b57342430a47021c45e343ad27e1db95ac` and is unmodified.
6. Confirm the Living Character Manuscript boundary resolves to blob `5ad12814696e65c77f893b7d4426731350757245` and is unmodified.
7. Confirm the Quest/Event/Chronicle boundary resolves to blob `38ee8287c4c072807f6590537f361b80afc723fc` and is unmodified.
8. Confirm the Person/NPC decision resolves to blob `1f130a3b1d63de8d2b7e607c9215ce13d76ea463` and is unmodified.
9. Confirm the campaign, injury, restricted-Stakes, and Normal Stakes fallback decisions resolve to their pinned blobs and remain unmodified.
10. Confirm the elemental audit remains unmodified as blob `974e84f89805ba3e6789331183b474fce7f30d36`.
11. Confirm the reconciled handoff and route register resolve to blobs `802dcf66df93b4c8290cbfe111399049dae460fc` and `186e6b6e0b60ad7c69538c7793c67e2374e23f3e` before this run edits them.
12. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
13. Preserve unrelated work.
14. Do not perform new broad external research. Use the completed research as evidence; verify a source only when necessary to resolve a citation or interpretation defect.
15. If a pinned source identity does not match, update only `docs/dev/current-codex-output.md` with a blocked result and stop.

## Existing Authorities To Preserve

### Gameplay truth remains upstream

Combat, health, injury, equipment, inventory, identity, recognition, travel, treatment, magic, death, and other domain owners determine accepted facts and outcomes.

The narrative authority must not:

- calculate damage, injury, diagnosis, urgency, route viability, treatment, resurrection, or death;
- infer equipment or appearance from current state when event-time evidence is required;
- invent actors, witnesses, objects, actions, motives, emotions, dialogue, causal relationships, or outcomes;
- mutate gameplay state;
- parse prose back into gameplay state.

### Chronicle and Manuscript remain projections

Chronicle, quest-journal, account-history, and Living Character Manuscript prose remain replaceable presentation.

They must not become:

- canonical event records;
- the source of identity, relationship, equipment, health, or location truth;
- a reconstruction input when authoritative evidence is absent;
- an authority that silently overwrites source facts.

### Campaign, defeat, injury, and death authorities remain controlling

This decision must not revise:

- current Difficulty, World Rules, or initial `normal_stakes` identity;
- current manual/quick-save topology;
- accepted Normal Stakes fallback and recovery-receipt behavior;
- restricted-Stakes terminal actual-death closure;
- injury, trauma, normally irreversible harm, magical restoration, or resurrection boundaries;
- Prestige, estate, Chronicle closure, succession, or heir ordering.

Those subjects remain for a later explicit Mortal Crisis/Stakes authority revision.

## Decision Standard

For each required section, the decision must state:

1. the accepted boundary;
2. the owning authority or owner class;
3. inputs and outputs at the conceptual level;
4. what is derived rather than authoritative;
5. persistence or provenance posture;
6. forbidden parallel authorities;
7. failure and fallback behavior;
8. later implementation questions that remain deferred.

Do not accept exact runtime interfaces, TypeScript field names, database tables, package paths, or release versions. Conceptual contract names and stable vocabulary are allowed where needed to make the authority unambiguous.

## 1. Accept The Owner Graph

Accept, narrow, or reject the following stage graph:

```text
authoritative domain results
  -> owner-certified event-time narrative evidence
  -> observer / viewpoint projection
  -> scene and beat plan
  -> discourse and referent resolution
  -> locale-specific deterministic realization
  -> validation
  -> accepted presentation or deterministic fallback
  -> Mortal Crisis UI / Chronicle / Manuscript / other presentation consumers
```

A later optional bounded-generation path may branch only after a closed scene plan exists:

```text
closed scene plan
  -> bounded request construction
  -> non-authoritative candidate prose
  -> validation
  -> accepted presentation or deterministic fallback
```

The decision must explicitly separate:

- prompt/request construction;
- prose realization;
- validation;
- presentation storage;
- authoritative event and domain ownership.

Prompt/request construction is optional. Deterministic local prose realization is mandatory.

## 2. Accept The Grammatical-Identity Boundary

Define the minimum durable semantic boundary needed to represent:

- grammatical person;
- one entity, coordinated entities, and persistent groups as distinct semantic cardinalities;
- entity kind;
- allowed reference strategies;
- whether personal pronouns are explicit, unavailable, defaulted by safe non-person kind, or forbidden;
- profile provenance and event-time revision;
- locale-specific surface paradigms separately from language-independent identity.

Required decisions:

- Personal pronoun paradigms are explicit authored or player-selected facts where personal pronouns are allowed.
- Personal pronouns must never be inferred solely from `PlayerSexId`, `neutral`, name, title, lineage, visible appearance, role, profession, or deity presentation.
- Singular `they` and plural `they` must remain semantically distinct even though English surface agreement overlaps.
- A clearly non-person object or entity kind may use an explicitly accepted safe locale default only when the entity-kind authority supports it.
- Entities may forbid pronouns and require names, titles, or descriptions.
- Missing or incomplete personal profiles degrade safely without demographic invention.

Do not decide a universal English-string-only schema. The accepted boundary must remain localization-ready.

## 3. Accept Observer-Safe Reference Resolution

Define deterministic first-pass rules for choosing among:

- observer-known event-time name;
- observer-known event-time alias;
- observer-known title;
- accepted relationship or role description;
- stable observer-local descriptive noun phrase;
- pronoun;
- repeated name or description;
- explicit group reference.

Required safeguards:

- Backend canonical names are never exposed merely because a grammatical profile is missing.
- First mention uses the shortest sufficiently identifying observer-known event-time reference.
- Pronouns are used only when the profile is explicit, the intended antecedent is unambiguous, and no competing live referent creates a material ambiguity.
- Subject, viewpoint, time, location, or actor-set changes may reset salience and force a repeated name or description.
- Two or more actors sharing a pronoun paradigm require conservative repetition until clarity is restored.
- Unknown entities retain stable observer-local description identity and do not reveal hidden canonical identity.
- Groups exist only from explicit event-time membership and dissolve or change when membership changes.
- Repetition is preferable to an incorrect or ambiguous pronoun.

The decision may accept a deterministic recency-and-role state machine as the first resolver, but must not authorize a statistical or model-owned referent authority.

## 4. Accept The First English Realization Scope

Choose a deliberately bounded first posture for English realization.

The decision must address:

- locked fully inflected sentence families;
- a narrow project-owned morphology and agreement layer;
- present and simple past;
- required uses of progressive or perfect aspect only where the accepted first corpus needs them;
- `be`, `have`, `do`, negation, modals, third-person singular, coordinated subjects, regular plural and possessive forms, articles, capitalization, punctuation, and a curated irregular lexicon;
- deterministic lexical alternatives only when semantic equivalence is declared and tested;
- contractions, quotation, and unsupported-dialogue policy;
- static linting and corpus-based golden tests.

The decision must not accept a production dependency.

It may require a later bounded offline comparison of project-owned morphology and `jsRealB`, including bundle size, tree shaking, API stability, deterministic output, Lineage-owned corpus accuracy, lexicon/data licensing, and build implications.

The first accepted quality target should prioritize correct connected prose over unlimited literary variety.

## 5. Accept Event-Time Narrative Evidence And Provenance

Define the durable information classes required for factual later regeneration.

The decision must distinguish at least:

1. authoritative durable domain events or results where their owners retain them;
2. owner-certified event-time narrative evidence containing presentation-relevant facts and explicit unknowns;
3. observer-projected facts that are safe for a viewpoint;
4. renderer- or template-specific plans;
5. accepted prose presentation;
6. validator-only hidden evidence where necessary to detect leakage.

Required evidence categories include, when relevant:

- actor, patient, observer, threat, helper, carrier, caster, provider, and group identities;
- event roles and accepted actions/results;
- authoritative order, occurrence identity, and explicit simultaneity groups;
- location, route segment, and position;
- event-time visible appearance;
- worn, held, dropped, damaged, consumed, removed, or transferred objects;
- visible injury and condition evidence;
- recognition, visibility, diagnosis confidence, uncertainty, and knowledge provenance;
- immutable content identities and revisions where lookup is safe;
- exact source owner, record, revision, and projection-policy identity.

The durable event-time evidence class must not be limited to the exact slots used by today’s templates. It must preserve the minimum evidence needed for later accurate presentation improvements without becoming a full duplicate world snapshot.

Current snapshots may assist immediate rendering only when they are bound to the exact accepted event, beat, tick/order, and revision. An arbitrary later live-state read is not historical proof.

The decision must require stable occurrence identity beyond event type plus tick. Repeated same-tick events must remain distinguishable through source owner, source event, occurrence/order identity, or an equivalent accepted composition.

Do not accept a final storage schema, retention duration, compaction algorithm, or migration implementation. Accept the ownership and evidence requirements needed to constrain those later decisions.

## 6. Accept Observer, Visibility, Recognition, And Diagnosis Projection

Observer projection must occur before scene planning and lexicalization.

Define the conceptual inputs and output boundary for:

- viewpoint;
- lighting, distance, obstruction, concealment, armor, and visibility results;
- recognition and known identity;
- skill- or magic-supported inspection;
- diagnosis confidence;
- directly perceived, recognized, inferred, reported, and unknown epistemic postures;
- progressive inspection and reassessment;
- qualitative urgency;
- spoiler and private-knowledge filtering.

Required decisions:

- The narrative renderer does not calculate line of sight, health truth, diagnosis, or urgency.
- Exact diagnosis appears only when an upstream owner says the observer knows it.
- Otherwise prose uses visible evidence and a closed, calibrated uncertainty vocabulary.
- Reassessment creates a new accepted beat and does not rewrite earlier uncertainty.
- Hidden timers, percentages, seeds, raw rolls, debug ids, private motives, secret identities, inaccessible diagnoses, future outcomes, and viewpoint-barred facts are excluded from the renderer-facing envelope.
- Qualitative urgency is an upstream projected category, not a renderer inference from a hidden number.

## 7. Accept Scene And Beat Planning

Define the narrative planner as a presentation planner over accepted evidence rather than an outcome resolver.

It may:

- order beats by authoritative chronology;
- preserve explicit simultaneity;
- aggregate repeated equivalent observations;
- combine an accepted action with its accepted visible result;
- use supported temporal succession, continuation, contrast, and explicit cause/result relations;
- maintain tense and viewpoint;
- insert a hard decision pause after sufficient context;
- resume from a later accepted outcome without rewriting locked prior beats;
- apply length, repetition, and paragraph budgets;
- support different compression for immediate Mortal Crisis, Chronicle, and Manuscript consumers.

It must not:

- invent causality, intention, motive, emotion, strategy, witness, or dialogue;
- merge transitions whose order changes meaning;
- turn one backend event into one mandatory battle-log line;
- choose gameplay actions or outcomes;
- expose raw mechanical state as the default player-facing representation.

## 8. Accept Validation, Simplification, And Fallback

Require layered validation for any candidate presentation:

1. source and revision identity;
2. required beat and fact coverage;
3. allowlisted entities, relations, values, and reference identities;
4. forbidden fact and hidden-information leakage;
5. names, titles, pronouns, semantic cardinality, agreement, tense, viewpoint, and order;
6. event-time appearance, equipment, object, injury, magic, location, and position consistency;
7. observer and spoiler policy;
8. unsupported dialogue, motive, emotion, diagnosis, witness, outcome, or causal claim;
9. mechanical-language suppression;
10. length, repetition, and style budgets.

Required decisions:

- Closed typed deterministic templates can provide strong first-slice guarantees only within their represented language.
- Schema-valid, grammar-constrained, or structurally valid output is not necessarily factually valid.
- Learned entailment, extraction, round-trip parsing, or consistency scores cannot serve as sole factuality proof.
- Any material failure triggers deterministic simplification or fallback.
- Fallback remains available when optional generation is unavailable, rejected, times out, changes version, or is prohibited.
- Validation reports are presentation support and audit evidence, not gameplay authority.

## 9. Accept Renderer And Validator Secret Separation

The decision must establish a hard conceptual boundary between:

- facts the renderer may lexicalize;
- hidden facts used only to enforce leakage, contradiction, or policy checks.

Validator-only facts must not be available to:

- deterministic lexical choice;
- optional prompt/request construction;
- optional generation services;
- player-facing validation reports;
- UI notices;
- ordinary presentation logs or telemetry;
- cached rejected candidates in a form that creates an exposure path.

Do not require a specific process, database, or service boundary. Require an implementation-verifiable separation with tests.

## 10. Accept Regeneration And Presentation Identity

Define layered identities for:

- normalized source fact set and provenance;
- observer-projection policy/version and projected fact set;
- scene plan and planner version;
- locale, renderer, morphology, lexicon, and template/grammar versions;
- optional request schema, adapter, model, and decoding versions;
- candidate prose and validation report;
- accepted presentation, lock state, and edit lineage.

Required decisions:

- Identical normalized facts and identical deterministic stage versions reproduce the deterministic fallback byte-for-byte.
- Presentation improvements require explicit version changes and scoped regeneration.
- Hashing or canonical JSON cannot define semantic normalization by itself.
- Set ordering, sequence ordering, absent versus null, time representation, content revisions, and role identity must be defined before stable hashes are authoritative.
- Regeneration cannot change gameplay truth.

## 11. Accept Locked And Player-Edited Prose Lifecycle

Define the non-authoritative lifecycle for generated, locked, and player-edited presentation.

Required behavior:

- Never silently overwrite locked or player-edited prose.
- Preserve edit lineage and source/presentation versions.
- When source facts, observer policy, content revisions, or validation rules change, mark incompatible locked text as stale, source-changed, or validation-failed through an accepted presentation status vocabulary.
- A stale player-edited passage may remain visible as explicitly non-authoritative personal presentation, subject to later product policy.
- Provide a conceptual path for compare, regenerate, relock, or retain-as-personal-text decisions.
- Locked prose cannot block correction of gameplay truth.
- Locked prose cannot be treated as evidence merely because a player approved it.

Do not decide exact UI controls or persistence schemas.

## 12. Accept Optional Bounded Generation Non-Authority

A future optional adapter may be evaluated only after separate authorization.

It may improve:

- transitions;
- compression;
- rhythm;
- declared semantically equivalent lexical variety;
- paragraph grouping within a closed scene plan.

It may not own or choose:

- facts;
- event order;
- identity;
- references or pronouns;
- visibility or knowledge;
- diagnosis or urgency;
- causality;
- gameplay action or outcome;
- canonical history.

Required safeguards:

- request construction uses an allowlisted closed plan rather than raw saves or unrestricted repository state;
- untrusted names and authored content remain data, not executable instructions;
- candidate prose is rejectable;
- no candidate is parsed back into gameplay;
- no generated prose becomes provenance;
- deterministic fallback remains the baseline;
- model, vendor, deployment, privacy, caching, and learned-validation choices remain separately gated.

This decision must not select a model, API, vendor, hosted service, local model, or generation dependency.

## 13. Accept Localization Seams

Define what remains locale-neutral now:

- semantic roles and entity identity;
- grammatical person;
- semantic cardinality and coordination;
- permitted reference strategies;
- observer knowledge and provenance;
- event chronology and supported relations;
- beat intent and qualitative urgency categories;
- source, plan, and presentation identities.

Define what belongs to a locale module:

- pronoun surface paradigms;
- agreement behavior;
- grammatical gender or case where required;
- articles and definiteness;
- inflection and irregular lexicon;
- word order;
- punctuation, contractions, register, and honorific realization;
- locale-authored templates and messages.

Required safeguards:

- CLDR plural categories are not entity semantic cardinality.
- English pronoun strings are not the universal grammatical-profile authority.
- MessageFormat or Fluent-like systems may later own localized message resources but do not become scene planners, referent owners, or factuality authorities.
- A locale without a complete realization module uses a later explicitly accepted translated-template or base-locale fallback policy, not ad hoc slot insertion.

No localization dependency is accepted in this run.

## 14. Accept Consumer Boundaries

The decision must apply the shared authority to:

- immediate Mortal Crisis narrative;
- Chronicle summaries;
- Living Character Manuscript projection;
- later elemental encounter narration;
- other fact-grounded presentation consumers.

The shared engine must prevent separate crisis-only, elemental-only, Chronicle-only, or Manuscript-only pronoun and grammar authorities.

### Mortal Crisis application

The narrative system may present accepted facts about:

- a character collapsing or becoming unresponsive;
- a threat continuing, disengaging, intercepting, capturing, or being redirected;
- party access, assessment, treatment, carrying, and extraction;
- progressive visible deterioration or stabilization;
- direct travel versus an intermediate healer, supplies, transport, or diagnosis stop;
- accurate equipment and object changes;
- observer uncertainty and improving diagnosis;
- qualitative urgency;
- a separate contextual player decision;
- later treatment, resurrection, convalescence, or closure only after upstream acceptance.

It cannot own lethal-process timers, route optimization, care capability, treatment outcome, death, resurrection, saving, Stakes, Prestige, succession, or rewards.

Player-facing narrative must not default to exact hidden survival timers or system-log labels. Exact time may appear only when an upstream source makes it naturally knowable in-world.

## 15. Accept First Implementation-Package Order Without Authorizing Implementation

Provide a dependency-aware future package order. Evaluate this recommended sequence:

1. grammatical identity and locale-neutral reference contracts;
2. first English profile, morphology, and locked-template foundation;
3. deterministic referent/discourse resolver;
4. owner-certified event-time narrative evidence and provenance;
5. observer/visibility/recognition/diagnosis projection boundary;
6. scene and beat planner;
7. validation, simplification, deterministic fallback, and regeneration identity;
8. appearance, equipment, object, location, and position evidence adapters;
9. first Mortal Crisis narrative adapter after the later crisis authority accepts outcomes;
10. Chronicle and Manuscript adapters;
11. locked/player-edited presentation lifecycle;
12. bounded morphology-library spike;
13. localization-resource spike;
14. optional bounded-generation spike only after separate authorization;
15. save/migration/UI integration and focused tests after their owners are approved.

The decision may revise this order where repository evidence requires it. It must identify prerequisites, atomicity requirements, and packages that may be separated safely.

Do not assign a release version or create an implementation prompt.

## 16. Required Test And Acceptance Matrix

Define future tests for at least:

### Grammar and reference

- male singular, female singular, singular `they`, plural `they`, and non-person profiles;
- a profile forbidding pronouns;
- incomplete profile with safe no-pronoun fallback;
- two same-pronoun actors;
- subject and viewpoint changes;
- coordinated subjects and explicit groups;
- unknown identity and observer-local description;
- title/name/alias change across event time;
- present and past tense;
- irregular verbs used by the first corpus.

### Event-time truth

- equipment held, dropped, consumed, removed, damaged, and transferred across beats;
- a two-handed object released before carrying a patient;
- clothing or armor concealing appearance;
- immediate rendering snapshot bound to the same accepted beat;
- later current state differing from historical evidence;
- repeated same-tick events with distinct occurrence identities;
- content revision and source correction.

### Observer projection

- unseen or unrecognized identity remains hidden;
- insufficient diagnosis shows visible evidence and uncertainty;
- skilled reassessment produces a new more precise beat;
- hidden timer becomes qualitative urgency only;
- future outcome and private motive remain barred;
- validator-only facts cannot reach rendering or request construction.

### Planning and validation

- connected multi-sentence scene rather than one line per event;
- explicit simultaneous actions;
- unsupported causal connective rejected;
- unsupported dialogue, emotion, motive, witness, object, or diagnosis rejected;
- deterministic reproduction for identical facts and versions;
- material validation failure selects deterministic fallback;
- mechanical-language leakage rejected.

### Presentation lifecycle

- versioned regeneration without gameplay mutation;
- locked prose preserved;
- source-corrected locked prose marked stale rather than overwritten;
- player-edited passage retains edit lineage and non-authoritative status;
- optional adapter unavailable or rejected with seamless fallback.

Tests should use explicitly non-canonical fixtures. They must not add Lineage canon by implication.

## 17. Required Authority And Supersession Matrix

The decision must state how it relates to:

- Living Character Manuscript design boundary;
- Quest/Event/Chronicle authority boundary;
- Person/NPC schema posture;
- combat and party presentation;
- equipment and inventory authorities;
- Normal Stakes fallback;
- campaign rules;
- injury and restoration;
- restricted Stakes;
- elemental audit and later elemental authority;
- current Chronicle, journal, notice, account-history, and UI strings.

For each, mark:

- retained;
- clarified;
- narrowed;
- explicitly deferred;
- superseded only where a direct contradiction is intentionally resolved.

Do not silently supersede save, defeat, death, resurrection, Stakes, Chronicle persistence, or authored-content authorities.

## Mandatory Decision Conclusions

The durable decision must explicitly accept or reject each statement:

1. Gameplay truth remains upstream of narrative projection.
2. Owner-certified event-time narrative evidence is required for accurate later regeneration.
3. Current snapshots are not historical proof unless bound to the exact accepted event or beat.
4. Narrative evidence is durable evidence, not merely today’s template slots.
5. Observer projection precedes scene planning and realization.
6. Personal pronouns are explicit and are not inferred from mechanical sex or descriptive identity.
7. Singular `they` and plural `they` remain semantically distinct.
8. Ambiguous pronouns fall back to observer-safe names or descriptions.
9. Prompt construction and prose realization are separate functions.
10. Deterministic model-independent fallback is mandatory.
11. Renderer-visible facts and validator-only secrets are separate channels.
12. Generated prose, Chronicle prose, and Manuscript prose are not provenance.
13. Material validation failure causes simplification or fallback.
14. Locked or player-edited prose is never silently overwritten.
15. Stale locked prose is marked and compared rather than treated as truth.
16. Optional bounded generation has presentation-only non-authority.
17. English realization remains behind a locale-neutral semantic boundary.
18. No production dependency or model is accepted by this decision.
19. Mortal Crisis narrative does not own crisis outcomes.
20. Elemental ecology and stimulus behavior remain a separate later authority lane.

## Required Decision Artifact

Create:

`docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`

The artifact must contain:

1. status, scope, and source evidence;
2. executive decision;
3. accepted vocabulary and conceptual model;
4. authority and owner graph;
5. grammatical-identity boundary;
6. locale-specific profile boundary;
7. observer-safe reference resolution;
8. first English morphology and template posture;
9. event-time evidence classes and provenance;
10. occurrence, ordering, simultaneity, and revision identity;
11. observer, visibility, recognition, diagnosis, uncertainty, and urgency projection;
12. scene and beat planning;
13. deterministic realization;
14. validation, simplification, and fallback;
15. renderer versus validator-secret separation;
16. regeneration and idempotence;
17. locked and player-edited prose lifecycle;
18. optional bounded-generation non-authority;
19. localization seams;
20. Mortal Crisis, Chronicle, Manuscript, and elemental-consumer boundaries;
21. forbidden parallel authorities and cycle prevention;
22. implementation-package order without implementation permission;
23. test and acceptance matrix;
24. authority retention/supersession matrix;
25. temporary-artifact retention and removal conditions;
26. unresolved implementation decisions;
27. explicit non-decisions.

The document should be decisive but avoid exact runtime field names, schemas, package paths, formulas, model choices, or release assignment.

## Required Coordination Updates

### `docs/dev/current-codex-output.md`

Update with:

- source run identity;
- branch, starting commit, ending pre-edit commit, and repository state;
- exact changed paths;
- source-identity verification;
- accepted owner graph;
- accepted grammar and referent boundary;
- accepted first English realization posture;
- accepted event-time evidence and provenance boundary;
- accepted observer projection boundary;
- accepted scene planning, validation, fallback, and regeneration posture;
- accepted locked-prose lifecycle;
- accepted optional-adapter non-authority;
- localization boundary;
- authority retention/supersession summary;
- implementation-package order;
- tests required;
- exact unresolved implementation questions;
- elemental-lane separation;
- held `0.6.6` confirmation;
- checks run;
- next recommended run.

### `docs/dev/current-gpt-handoff.md`

Update after the decision to:

- mark this narrative decision complete and controlling;
- add the decision artifact and exact blob identity to the most-specific authorities;
- summarize the accepted owner, grammar, evidence, observer, validation, fallback, staleness, optional-adapter, and localization boundaries;
- preserve current campaign, defeat, injury, restoration, and restricted-Stakes authorities;
- make the targeted elemental research pass the next active route recommendation;
- preserve held `0.6.6` and retained `0.6.7` posture;
- state that implementation remains unauthorized.

### `docs/dev/historical-version-and-deferred-route-register.md`

Update after the decision to:

- mark the active narrative authority row complete;
- point it to the new durable decision artifact;
- update the narrative lane classification to accepted design authority, not implemented;
- retain targeted elemental research as the next lane;
- preserve the later Mortal Crisis/Stakes authority-revision dependency;
- preserve held `0.6.6` and `0.6.7` posture.

Do not rewrite unrelated historical rows.

## Next Route Rule

If the decision completes successfully, recommend the separate substantial research run:

`Elemental Affinity Ecology, Environmental Manifestation, Temperament, And Magic-Stimulus Research`

That later research should consume the elemental audit and investigate:

- environmental affinity-pressure manifestation;
- passive, curious, territorial, cooperative, helpful, assimilative, defensive, predatory, and guardian dispositions;
- active versus passive magical stimuli;
- utility-, goal-, or rule-based response architecture;
- deterministic response identity;
- beneficial capability authorization without deus ex machina;
- player-readable warning and escalation;
- persistence, reinforcement, decay, and despawning;
- fae, spirit, guardian, construct, magical-animal, and elemental taxonomy patterns.

It must not decide the setting-specific three-and-three alignment by external popularity or mythology. That mapping remains a project canon decision informed by repository religion, magic, and content evidence.

After that research, the later durable decision remains:

`Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision`

After narrative and elemental authorities are complete, the later gameplay authority revision remains:

`Checkpoint Commitment, Mortal Crisis Sequence, Resurrection Aftereffects, Final Closure, And Stakes Authority Revision`

Do not install any of those later prompts in this run.

## Temporary Artifact Retention

Retain:

- `docs/dev/tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md` until consumed by this decision, the later Mortal Crisis/Stakes revision, and a later narrative-engine implementation prompt;
- `docs/dev/tmp-grounded-narrative-realization-research-2026-07-23.md` until consumed by this decision, the later Mortal Crisis/Stakes revision, and a later narrative-engine implementation prompt;
- `docs/dev/tmp-elemental-alignment-temperament-and-magic-stimulus-audit-2026-07-23.md` for the elemental research, elemental decision, and later elemental implementation prompts;
- comparative mortality research and retained defeat/injury audit until their named later consumers complete.

This decision may define exact future removal conditions but must not delete these artifacts.

## Authorized Output

On successful completion, modify exactly:

1. create `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`;
2. update `docs/dev/current-codex-output.md`;
3. update `docs/dev/current-gpt-handoff.md`;
4. update `docs/dev/historical-version-and-deferred-route-register.md`.

Do not modify this prompt.

## Forbidden Scope

Do not modify:

- `docs/dev/current-codex-prompt.md`;
- completed audit or research artifacts;
- accepted campaign, defeat, injury, restoration, restricted-Stakes, Chronicle, Manuscript, person/NPC, combat, equipment, or other design authorities;
- roadmap;
- sequenced plan;
- project continuity brief;
- held `0.6.6`;
- retained `0.6.7` artifacts;
- runtime;
- shared types;
- schemas;
- package manifests or lockfiles;
- dependencies;
- saves or migrations;
- tests;
- UI;
- content;
- generated files;
- gameplay.

Do not:

- implement narrative realization;
- accept exact runtime field names, interfaces, packages, or storage locations;
- add a morphology, localization, narrative, validation, or model dependency;
- select a model, API, vendor, hosted service, or local model;
- send repository data to an external generation service;
- create a prompt template intended for live generation;
- infer pronouns from sex, name, lineage, title, appearance, or deity presentation;
- make Chronicle, journal, Manuscript, generated prose, or player-edited prose canonical evidence;
- decide Mortal Crisis outcomes, timers, route calculations, care results, death, resurrection, Stakes, Prestige, estate, succession, or rewards;
- decide elemental alignment, temperament, manifestation, stimuli, fae, or monster behavior;
- restore `0.6.6`;
- assign a release version;
- create an implementation prompt or the next research prompt.

## Stop Conditions

Stop after the exact four documentation outputs.

If pinned source identities do not match, update only `docs/dev/current-codex-output.md` with the contradiction and stop.

If a material decision remains unsupported despite the completed audit and research, accept the smallest safe boundary and name one narrow later implementation spike or focused decision. Do not reopen a broad narrative research survey.

Report the ending commit, exact changed paths, repository state, accepted authority, retained and superseded boundaries, unresolved implementation questions, held-route status, and next recommended run.
