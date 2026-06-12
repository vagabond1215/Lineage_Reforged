# Knowledge Evidence Producers Plan

Version: `Version 0.5.133 - Knowledge Evidence Producers Plan`

Status: Planning authority only.

## 1. Purpose And Status

This document defines the future ownership and contract boundaries for producing Knowledge evidence candidates from explicit game or system occurrences.

This is a planning-only authority. It does not implement producers, evidence persistence, progress mutation, completion, trials, runtime wiring, save integration, UI behavior, generated outputs, or content changes.

## 2. Current State

The repository currently provides:

- authored Knowledge snippets and their validator;
- a Knowledge evidence schema and validation helper;
- a Knowledge progress schema and validation helper; and
- an evidence-to-progress proposal helper.

These foundations are pure, in-memory, and unregistered. The repository does not yet provide:

- canonical evidence or progress storage;
- an evidence producer;
- evidence or progress persistence;
- completion rules;
- trials;
- Knowledge UI;
- runtime or session integration; or
- a Knowledge save shape.

The existing evidence-to-progress helper proposes an inert progress delta. It does not establish how evidence is produced or accepted.

## 3. Producer Categories

Future evidence producers may be organized into these categories:

- observation;
- travel or context;
- study or training;
- teacher or institution;
- document, book, scroll, or tome; and
- quest or event.

These categories are planning boundaries, not implementation approval. This plan selects only a narrow observation producer as the recommended next implementation.

## 4. Producer Boundary

A future producer is a pure or runtime-adjacent owner that proposes a candidate Knowledge evidence record from one explicit game or system occurrence.

The producer boundary is:

1. An authoritative game or system owner supplies an explicit occurrence and the required Knowledge inputs.
2. A producer deterministically proposes one candidate evidence record.
3. The candidate must pass the current Knowledge evidence schema and validation helper.
4. Any progress proposal remains a separate operation owned by the evidence-to-progress helper.

A candidate is not a persisted fact merely because it validates. The producer does not:

- mutate a progress record;
- mark Knowledge complete;
- create or resolve trials;
- update UI state;
- grant rewards;
- establish evidence ownership beyond the explicit validated owner fields; or
- persist evidence or progress.

## 5. Minimal Candidate Output

A producer candidate must contain exactly the current evidence record fields:

1. `evidenceId`
2. `snippetId`
3. `domainId`
4. `subjectType`
5. `subjectId`
6. `ownerScope`
7. `ownerId`
8. `sourceType`
9. `sourceId`
10. `acquisitionContext`
11. `acquiredSequence`
12. `notes`

The candidate must not add producer-specific fields, embed a progress record, duplicate snippet content, include a runtime event payload, or carry UI state.

Producer occurrence identity may be an input to deterministic construction, but it is not an additional evidence output field.

## 6. Evidence Identity

Future producer identity must satisfy all of these rules:

- the same accepted occurrence replayed with the same authoritative inputs produces the same `evidenceId`;
- distinct accepted occurrences produce distinct `evidenceId` values;
- every id uses the `knowledge_evidence.` prefix;
- subject, domain, and snippet identity remain recognizable in the id in a form consistent with the current schema;
- ids do not depend on randomness, wall-clock time, UI state, or an unowned process-local counter; and
- identity construction remains pure and deterministic.

The exact producer suffix policy is deferred until the first producer is implemented. The observation producer pass must freeze a narrow suffix rule and test it.

Occurrence equivalence remains a material risk. A producer cannot reliably distinguish a replay from a distinct occurrence unless its owning system supplies a stable event, action, or occurrence identity.

## 7. Acquisition Sequence

`acquiredSequence` is an explicit deterministic authority supplied to the producer.

It must not be derived from:

- a wall clock;
- filesystem order;
- randomness;
- UI order; or
- a hidden mutable counter.

The first producer may accept an explicit in-memory sequence parameter. That is sufficient for candidate validation, but it is not a canonical sequence authority. The owning persisted or runtime sequence is deferred to a later storage and persistence boundary pass.

## 8. Owner Rules

The current producer boundary supports character-owned evidence only:

- `ownerScope` must be `character`;
- `ownerId` must satisfy the current schema and validator pattern;
- owner values must be explicit producer inputs;
- the producer must not infer an owner from account, family, party, active UI selection, or ambient session state; and
- producing a candidate does not mutate the owner or any owner-held collection.

The current owner-id pattern is only a validation constraint. Canonical character identity authority remains future work.

Family-owned and account-owned Knowledge evidence are not authorized by this plan.

## 9. Source And Acquisition Context

Producers must honor the current validator posture:

- `sourceId` remains null-only;
- only currently supported `sourceType` and `acquisitionContext` combinations may be emitted;
- unsupported source or context combinations remain blocked; and
- no schema or validator changes are authorized by this plan.

Future source authorities may include events, actions, items, documents, teachers, institutions, quests, Chronicle entries, skills, or spells. Those authorities are planning examples only. They require dedicated contracts and validator changes before a producer may emit their identifiers.

An input-only occurrence key used for deterministic evidence identity must not be copied into a currently blocked evidence field.

## 10. Producer Categories And Examples

### Observation

An observation producer represents an explicit identification occurrence for a supported flora, fauna, mineral, or general Knowledge subject.

It requires an explicit owner, snippet, target subject, supported acquisition context, and acquisition sequence. Merely being present on a map, near a target, or inside a region must not passively produce evidence.

### Travel Or Context

A travel or context producer must be tied to a supported snippet and a specific accepted context occurrence. Location presence alone does not produce progress.

Kaelvar is an illustrative settlement travel target only where the current validator supports the corresponding source and acquisition context.

### Study Or Training

A study or training occurrence may eventually produce valid evidence. It does not directly create progress.

Known spells, skill ranks, existing inventory, or elapsed training time must not automatically produce evidence without an explicit accepted study or training occurrence and an authorized producer contract.

### Teacher Or Institution

Teacher and institution producers require authoritative instruction-occurrence contracts and supported source identifiers. They remain deferred because those authorities do not exist in the current evidence validator contract.

### Document, Book, Scroll, Or Tome

Possessing a document, book, scroll, or tome is not evidence. A future reading or study occurrence must own the candidate proposal.

Document identity, study identity, and supported source authority are deferred. Magical books, tomes, and scrolls remain further gated on the spell database and their owning content systems.

### Quest Or Event

A quest or event producer must receive explicit occurrence identity and acquisition sequence from its owning system.

It must not emit Chronicle or Renown progress, rewards, or completion effects. Knowledge evidence remains a separate validated candidate.

## 11. Relationship To Evidence-To-Progress

The producer proposes a candidate evidence record only.

The existing evidence-to-progress helper separately:

- validates the accepted evidence and current progress inputs;
- determines eligibility;
- proposes an inert `+1` progress delta when eligible; and
- returns no state mutation, evidence consumption, or updated progress record.

The intended future pipeline is:

`producer -> evidence validator -> progress validator -> evidence-to-progress proposal`

That pipeline is not implemented or registered by this plan.

## 12. Storage And Persistence

There is no canonical:

- evidence collection path;
- progress record collection path;
- session integration;
- save integration;
- database integration;
- migration policy; or
- persisted acquisition sequence authority.

Producer output therefore remains an in-memory candidate. A later storage and persistence boundary plan must decide acceptance ownership, duplicate handling, replay behavior, record initialization, and save/session placement before runtime wiring.

No compatibility or migration behavior is authorized.

## 13. Completion, Trials, UI, And Generated Outputs

Evidence is not:

- progress;
- completion;
- a trial result;
- a runtime event;
- a UI badge;
- a codex entry;
- a map pin;
- a notification;
- a reward; or
- generated content.

Producing evidence must not imply or trigger any of those outcomes. Completion rules, trials, UI presentation, generated projections, and reward integration require later dedicated authorities.

## 14. First Recommended Implementation

The next recommended run is:

`Version 0.5.134 - Knowledge Observation Evidence Producer`

That run should add a pure in-memory candidate helper with focused unit tests:

- `tools/content-lint/knowledge-evidence-producers.mjs`
- `tests/unit/knowledge-evidence-producers.test.mjs`

The first implementation should:

- support narrow observation candidate proposals for Aloe, Badger, Iron Ore, and Kaelvar where their current authored snippet and validator contracts permit;
- keep Arcane blocked because its domain is planned and lacks an authorized current snippet path;
- validate the proposed candidate through the current evidence helper;
- require explicit owner, subject, occurrence identity, acquisition context, and sequence inputs;
- return deterministic inert data; and
- remain unregistered and in-memory.

It must not add:

- persistence;
- runtime or UI wiring;
- lint-index registration;
- automatic evidence-to-progress invocation;
- progress mutation;
- completion or trials;
- source-authority expansion; or
- schema or validator changes.

## 15. Future Test Coverage

Focused tests for `tests/unit/knowledge-evidence-producers.test.mjs` should cover these positive cases:

- deterministic Aloe observation candidate;
- deterministic Badger observation candidate;
- deterministic Iron Ore observation candidate;
- valid Kaelvar travel or context candidate when current validator support permits it;
- replay of the same authoritative occurrence yields the same `evidenceId`;
- distinct occurrence identities yield distinct `evidenceId` values;
- explicit owner and acquisition sequence are preserved;
- output contains exactly the current evidence fields; and
- every returned candidate passes the current evidence validation helper.

Negative cases should cover:

- Arcane production is rejected;
- unsupported snippet, domain, subject type, or subject id is rejected;
- snippet and subject mismatches are rejected;
- unsupported source or acquisition context is rejected;
- non-null `sourceId` is rejected;
- absent or invalid owner inputs are rejected;
- absent, negative, or invalid acquisition sequence is rejected;
- absent or invalid occurrence identity is rejected;
- random, clock-derived, UI-derived, or implicit identity inputs are not supported;
- passive map or location presence cannot produce evidence;
- known spell or skill state cannot produce evidence;
- duplicate extra output fields are not emitted;
- no progress proposal is invoked; and
- no input object is mutated.

## 16. Acceptance Criteria For Version 0.5.134

`Version 0.5.134 - Knowledge Observation Evidence Producer` is acceptable only when:

- the helper is pure, deterministic, in-memory, and unregistered;
- only the scoped observation and currently supported travel/context examples can produce candidates;
- candidate output contains exactly the current evidence fields;
- all candidates pass the existing evidence schema and validation helper;
- `evidenceId` replay and distinct-occurrence behavior are covered by tests;
- owner and acquisition sequence are explicit inputs;
- unsupported Arcane, source, context, owner, identity, and sequence paths fail closed;
- no progress helper is invoked;
- no state, input, evidence collection, or progress record is mutated;
- no persistence, save, runtime, UI, completion, trial, reward, generated, or lint-registration work is added; and
- the existing snippet, evidence, progress, schema, and evidence-to-progress checks remain green.

## 17. Recommended Sequence

1. `Version 0.5.133 - Knowledge Evidence Producers Plan`
2. `Version 0.5.134 - Knowledge Observation Evidence Producer`
3. Knowledge Storage And Persistence Boundary Plan
4. Knowledge Progress Record Initialization Plan
5. Knowledge Completion Rules Plan
6. Knowledge Trials Plan
7. Knowledge UI Plan
8. Later temporary-guardrail cleanup decision

Each step requires its own narrow scope and validation. Completing an earlier step does not authorize later work.

## 18. Risks

- Occurrence equivalence is unresolved without a producer-issued stable event, action, or occurrence identity.
- `acquiredSequence` has no canonical persisted authority.
- Character identity is constrained only by the current owner-id pattern.
- `sourceId` remains null-only, limiting future source attribution.
- Current source and acquisition-context combinations intentionally block several future producer categories.
- A validating candidate could be mistaken for accepted or persisted evidence unless the acceptance boundary stays explicit.
- Evidence-to-progress proposals could be invoked prematurely and mistaken for mutation.
- Passive observation, inventory possession, known spells, skill ranks, location presence, Chronicle state, or Renown state could be misused as implicit evidence.
- Completion, trials, rewards, UI, and generated projections could be coupled too early.
- Magical books, tomes, scrolls, and Arcane examples could be implemented before their prerequisite spell and content authorities exist.

## 19. Non-Goals

This plan does not authorize:

- producer implementation in this run;
- evidence or progress persistence;
- save, session, account, family, or database integration;
- progress record initialization;
- evidence acceptance or duplicate-storage policy;
- runtime event registration;
- UI or main-menu changes;
- completion rules;
- trials;
- rewards;
- Chronicle or Renown integration;
- generated outputs;
- lint-index registration;
- schema or validator changes;
- new snippets, domains, skills, spells, or registry entries;
- Arcane evidence production;
- generic tag-driven spell behavior;
- magic skill gain or Magic Legacy power;
- books, tomes, scrolls, spellbooks, reading systems, or acquisition systems;
- teacher, institution, quest, event, document, skill, or spell source-id support;
- family-owned or account-owned evidence;
- passive map, region, settlement, inventory, spell, or skill evidence;
- backwards compatibility, migration aliases, retired-id support, or old-save preservation; or
- cleanup or removal of existing planning authorities.
