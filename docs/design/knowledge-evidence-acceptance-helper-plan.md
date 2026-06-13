# Knowledge Evidence Acceptance Helper Plan

Source version/run: Version 0.5.139 - Knowledge Evidence Acceptance Helper Plan
Date: 2026-06-13
Status: Planning-only contract for a future pure one-candidate Knowledge evidence acceptance helper.

## 1. Purpose And Status

This plan defines the narrow contract for moving one already-produced Knowledge evidence candidate across an explicit acceptance boundary.

It selects a future pure helper and focused test surface. It does not implement that helper, create evidence state, assign persistence ownership, or authorize runtime behavior.

The plan refines the broader acceptance options in `docs/design/knowledge-storage-persistence-boundary-plan.md` for the first helper only. In particular, every existing `evidenceId` match is rejected; storage-level idempotency remains a later owner decision.

## 2. Current State

The repository currently has:

- authored Knowledge snippet and domain registry authorities;
- a strict Knowledge evidence schema;
- a pure evidence semantic validator;
- a pure observation evidence candidate producer;
- a pure zero-state progress initialization proposal helper;
- a pure evidence-to-progress proposal helper;
- planning boundaries for storage, persistence, and future fixtures.

The repository does not have:

- an accepted-evidence collection;
- an acceptance helper or acceptance owner;
- a canonical storage or persistence owner;
- evidence application or progress mutation;
- completion, trial, UI, or runtime ownership.

## 3. Acceptance Problem

A valid candidate is not automatically accepted evidence. Acceptance must answer, deterministically and without mutation:

1. Is the candidate structurally and semantically valid against current authorities?
2. Is the current accepted-evidence wrapper itself valid?
3. Does the current wrapper already contain the candidate `evidenceId`?
4. If accepted, what exact record may a later owner append?

The helper must not treat validation, production, initialization, progress proposal, storage, or persistence as implicit acceptance.

## 4. Terminology

- **Candidate evidence:** one schema-shaped record proposed by a producer but not yet accepted.
- **Current accepted wrapper:** the caller-supplied snapshot `{ "records": [...] }` containing already accepted evidence.
- **Accepted evidence:** a value-equivalent copy of a valid candidate that passed the first-helper duplicate gate.
- **Rejected candidate:** a valid candidate blocked by acceptance policy, initially duplicate `evidenceId`.
- **Acceptance decision:** the inert helper result describing acceptance or rejection.
- **Persistence:** durable storage performed by a future owner after acceptance.
- **Replay:** a later attempt carrying an `evidenceId` already present in the current accepted wrapper.
- **Occurrence equivalence:** a possible relationship between distinct ids that appear to describe the same underlying observation. This helper does not infer it.

## 5. Recommended Pure One-Candidate Helper Posture

The first helper should:

- accept exactly one candidate record per invocation;
- require all authority inputs explicitly;
- require the current accepted wrapper explicitly;
- validate before applying acceptance policy;
- return a new inert decision object;
- never mutate any input;
- never read files, clocks, randomness, environment state, counters, UI state, session state, or global state;
- never write accepted evidence, progress, fixtures, generated output, or persistence artifacts.

Batch acceptance, transaction grouping, conflict retries, and storage commits are outside this helper.

## 6. Candidate Authority

The candidate input should be one plain evidence record, not an arbitrary multi-record wrapper.

The helper should construct a temporary one-record wrapper and validate it through the existing evidence validator. The candidate remains authoritative for:

- `evidenceId`;
- target and domain snapshots;
- owner fields;
- acquisition sequence;
- source and context fields;
- notes.

The helper must not invent, default, normalize, repair, or enrich candidate fields.

## 7. Current Accepted Wrapper Authority

The current accepted wrapper is a required explicit input:

```json
{
  "records": []
}
```

An empty wrapper is valid when passed intentionally. Omission, `null`, a bare array, or an inferred ambient collection is invalid.

The wrapper is a read-only snapshot for validation and duplicate checks. The helper does not append to it and does not return a replacement collection.

## 8. Acceptance Owner

The future helper owns only deterministic acceptance evaluation.

A future caller or storage component must own:

- selecting the current accepted snapshot;
- handling concurrency or stale snapshots;
- invoking the helper;
- appending an accepted record;
- assigning any storage metadata;
- committing or rolling back durable state;
- coordinating later progress operations.

No current save, account, session, character, database, or runtime subsystem is selected as that owner by this plan.

## 9. Acceptance Sequence

The helper should execute in this order:

1. Validate invocation shape and explicit authority inputs.
2. Validate the current accepted wrapper with empty records allowed.
3. Validate the candidate through a temporary one-record wrapper.
4. Compare the candidate `evidenceId` against current accepted records.
5. Reject an existing id or return a copied accepted record.
6. Return deterministic issues and safety flags.

No later stage should run after an earlier validation failure.

## 10. Duplicate EvidenceId Policy

Any current accepted record with the same `evidenceId` causes deterministic rejection.

This applies whether the existing record is:

- exactly value-equivalent;
- different in non-identity fields;
- from the same producer path;
- from a different attempted replay path.

The first helper must not report an exact duplicate as accepted or idempotently successful. That decision belongs to a future storage owner with atomic write and retry context.

## 11. Occurrence Replay Policy

The helper recognizes replay only by exact `evidenceId`.

It must not:

- parse producer-specific occurrence tokens;
- compare timestamps or sequences as occurrence identity;
- infer equivalent observations from source/context combinations;
- deduplicate distinct evidence ids;
- merge or collapse records.

Distinct ids remain distinct candidates even when their descriptive fields resemble one another. Stronger occurrence-equivalence policy is deferred.

## 12. Source And Context Requirements

Acceptance must preserve the current evidence validator's source and context rules.

The helper should pass the candidate and current accepted wrapper through the unchanged semantic validator with explicit:

- evidence schema;
- Knowledge snippets wrapper;
- Knowledge domain registry wrapper;
- regions wrapper;
- settlements wrapper.

It must not add generic source behavior, broaden acquisition contexts, reinterpret nullable `sourceId`, or bypass current region and settlement authority.

## 13. Accepted Output Record

On acceptance, `acceptedEvidenceRecord` should be a deep value copy of the validated candidate.

The copy must:

- retain every schema field exactly;
- retain the candidate `evidenceId`;
- retain explicit acquisition sequence and notes;
- add no acceptance metadata;
- remain valid through the unchanged current evidence validator.

“Accepted” means the record is eligible for a future owner to append. It does not mean the append or persistence happened.

## 14. Recommended Acceptance Envelope

The future helper should return one stable object:

```js
{
  decision: "accepted" | "rejected",
  acceptedEvidenceRecord: object | null,
  rejectedCandidate: {
    evidenceId: string,
    code: string,
    reason: string
  } | null,
  acceptedEvidenceIds: string[],
  issues: string[],
  safety: {
    noMutation: true,
    noPersistence: true,
    noProgressInitialization: true,
    noProgressProposal: true,
    noProgressApplication: true,
    noCompletion: true,
    noTrialUnlock: true,
    noUiOutput: true,
    noRuntimeEffect: true,
    noGeneratedOutput: true
  }
}
```

For success, `acceptedEvidenceIds` contains only the accepted candidate id. For rejection it is empty.

Invocation or authority validation failures use `issues`. A valid candidate rejected by duplicate policy uses `rejectedCandidate` with a stable duplicate code and reason.

## 15. Evidence Validator Relationship

`tools/content-lint/knowledge-evidence.mjs` remains the sole current structural and semantic acceptance gate.

The future helper should import and invoke `validateKnowledgeEvidence(...)` rather than reproduce its schema, target, owner, source, context, region, settlement, or duplicate-within-wrapper rules.

Recommended calls:

- current accepted wrapper: `allowEmptyRecords: true`;
- temporary candidate wrapper: the normal non-empty posture.

The helper must not edit validator behavior or register itself in normal content lint.

## 16. Producer Relationship

`tools/content-lint/knowledge-evidence-producers.mjs` remains candidate-only.

The acceptance helper may receive a producer result's candidate record, but it must not:

- import or invoke the producer;
- regenerate evidence identity;
- issue occurrence identity;
- choose source or context;
- treat producer success as acceptance;
- expose acceptance back through the producer API.

Producer and acceptance tests remain independently focused.

## 17. Progress Initializer Relationship

`tools/content-lint/knowledge-progress-initialization.mjs` remains a separate zero-state proposal boundary.

Acceptance must not:

- create a progress record;
- inspect current progress;
- invoke initialization;
- select `zero_state` or `first_evidence`;
- persist initialization output.

A future orchestrator may accept evidence and separately request initialization when no progress exists. This helper does not coordinate those operations.

## 18. Progress Proposal And Application Relationship

`tools/content-lint/knowledge-evidence-to-progress.mjs` remains a separate inert proposal boundary that requires existing progress.

The acceptance helper must not:

- invoke evidence-to-progress proposal;
- mark evidence as consumed;
- update counts, sequences, notes, or consumed ids;
- apply a proposal;
- decide atomicity between evidence append and progress mutation.

Future application planning must define how accepted evidence, initialization, proposal, and durable mutation are coordinated.

## 19. Fixture Posture

No fixtures should be added during planning or first-helper implementation.

Focused unit tests should use inline in-memory wrappers and authorities. The future `tests/fixtures/knowledge/` family remains governed by `docs/design/knowledge-storage-fixture-boundary-plan.md` and should be implemented only in a separately scoped run.

Acceptance tests must not make planned fixture paths part of production behavior or normal lint.

## 20. Storage And Persistence Posture

The helper is not a collection manager, repository, transaction, save adapter, or persistence API.

It must not:

- write to disk;
- select canonical storage paths;
- alter save/account/session schemas;
- return persisted-state claims;
- assign storage version, acceptance time, transaction id, or commit sequence;
- promise concurrency safety or idempotent writes.

The caller must recheck or serialize duplicates at the eventual mutation boundary.

## 21. Completion, Trials, UI, And Runtime Posture

Acceptance has no direct effect on:

- Knowledge completion;
- Knowledge trials;
- Skill Trials;
- Spell or Magic Study trials;
- rewards, Chronicle, Renown, quests, or events;
- UI display, notification, menus, maps, or codex views;
- runtime commands, ticks, sessions, or gameplay.

Those lanes remain separate and deferred. Accepted evidence is data eligibility only.

## 22. Future Helper Shape

The next implementation should add only:

- `tools/content-lint/knowledge-evidence-acceptance.mjs`;
- `tests/unit/knowledge-evidence-acceptance.test.mjs`;
- required handoff, roadmap, sequence, and backlog updates.

Recommended public export:

```js
export function proposeKnowledgeEvidenceAcceptance(inputs) {
  // Pure one-candidate acceptance decision.
}
```

The exact name may be adjusted only if repository naming conventions require it. The module should remain unregistered from normal content lint.

## 23. Focused Test Plan

The focused suite should cover at least:

- valid acceptance for representative Aloe, Badger, Iron Ore, and Kaelvar candidates;
- explicit empty current wrapper;
- valid non-empty current wrapper with a distinct id;
- exact duplicate id rejection;
- same id with conflicting fields rejection;
- distinct ids with similar occurrence fields remaining independently eligible;
- missing, null, bare-array, and malformed current wrapper rejection;
- invalid candidate schema and semantic cases;
- invalid current accepted records;
- inactive, unknown, or mismatched snippet/domain authority;
- owner mismatch and unsupported owner type;
- invalid source/context, region, settlement, and `sourceId`;
- immutable candidate, wrapper, and authority inputs;
- deterministic repeated output;
- accepted-record validation through the unchanged evidence helper;
- no filesystem, clock, randomness, persistence, progress, UI, runtime, fixture, or normal-lint coupling;
- stable envelope and complete safety flags.

Existing evidence, producer, initializer, proposal, schema, snippet, and registry suites should also remain green.

## 24. Implementation Acceptance Criteria

The future implementation is complete only when:

- one candidate is accepted or rejected deterministically;
- both candidate and current wrapper pass the existing evidence validator before policy evaluation;
- explicit `{ "records": [] }` is supported and omission is rejected;
- every current `evidenceId` match is rejected;
- accepted output is a deep value copy with no added metadata;
- no input is mutated;
- the envelope distinguishes validation issues from duplicate-policy rejection;
- no state, storage, persistence, fixtures, registration, progress behavior, completion, trials, UI, runtime, generated output, or gameplay behavior is added;
- focused and existing related tests pass;
- source and scope audits confirm the narrow boundary.

## 25. Next Version

The next recommended run is:

`Version 0.5.140 - Knowledge Evidence Acceptance Helper`

That run should implement only the pure helper and focused unit tests defined here.

## 26. Subsequent Sequence

After `0.5.140`, the recommended order is:

1. Knowledge Progress Application Plan.
2. Knowledge Progress Application Helper.
3. Knowledge Completion Rules Plan.
4. Knowledge Completion Helper.
5. Knowledge Trial Boundary Plan.

Storage placement, persistence, fixtures, and runtime integration should remain separately scoped unless a later authority deliberately reorders the roadmap.

## 27. Risks And Follow-Up

- The current accepted wrapper is caller-supplied and may be stale; the pure helper cannot prevent concurrent duplicate writes.
- Exact-id rejection does not resolve occurrence equivalence across distinct ids.
- Acceptance sequence is copied from the candidate and is not a durable commit order.
- Character owner and sequence authority remain explicit-input patterns without a canonical state owner.
- No accepted-evidence storage collection or persistence owner exists.
- Atomic coordination with initialization, progress proposal, and future application is unresolved.
- `first_evidence` initialization remains deferred.
- Arcane Lore remains blocked while its broad domain is planned.

These are deliberate boundaries, not permission to broaden the first implementation.

## 28. Non-Goals

This plan does not authorize:

- implementation during `0.5.139`;
- batch or multi-candidate acceptance;
- canonical evidence/progress JSON;
- fixtures or fixture loaders;
- schema, validator, producer, initializer, or proposal edits;
- idempotent storage success;
- occurrence-equivalence inference;
- save/account/session/database changes;
- migration or backwards-compatibility behavior;
- evidence consumption or progress application;
- completion, trial, reward, event, UI, runtime, generated output, or gameplay behavior;
- magic runtime expansion or tag-driven spell execution.
