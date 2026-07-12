# Living Character Manuscript Research Intake Route

Source route: `GPT-DR.chronicle.living-character-manuscript`
Date: 2026-07-12
Status: approved documentation-only research intake; no implementation permission

## 1. Intake Decision

The completed Deep Research report is committed as:

- `docs/dev/tmp-living-character-manuscript-research-2026-07-12.md`

Its pipeline label is:

- `GPT-DR.chronicle.living-character-manuscript - Living Character Manuscript / Narrative Chronicle System`

The report is non-canonical planning input. It does not override current repository authorities, does not establish Lineage canon, and does not authorize schemas, content, validators, tests, runtime, UI, save/account, storage, generation, or gameplay behavior.

Select one immediate support route:

- `Version 0.5.344.1 - Living Character Manuscript Research Integration`

After that support route is completed, return the primary queue to:

- `Version 0.5.345 - Force Public Order Authority Evidence Audit`

The support suffix does not consume or renumber the next primary route.

## 2. Why A Support Integration Route Is Required

The report contains useful broad design guidance, but it was produced outside the repository and includes general recommendations that must be corrected against live owners before becoming durable project guidance.

The repository already separates several adjacent concerns:

- authored quest definitions, archetypes, and templates;
- mutable quest and journal state;
- session Chronicle events;
- player discovery Chronicle state;
- account run-history Chronicle projections;
- run-end Chronicle presentation;
- UI projections and current runtime/session owners.

A focused integration pass is needed to preserve these owners, identify missing historical sources, and promote only the durable manuscript-specific boundaries.

## 3. Required Integration Result

The integration pass should add one permanent design document:

- `docs/design/living-character-manuscript-design-boundary.md`

That permanent document should define, at design level:

1. the player-facing Living Character Manuscript / Character Chronicle model;
2. the internal event-sourced narrative-projection model;
3. canonical gameplay facts versus generated narrative presentation;
4. event eligibility, importance, treatment, clustering, and omission;
5. repetition and grind compression;
6. narrative memory, continuity, unresolved-thread, relationship, place, title, injury, and possession requirements;
7. safe inference, provenance, spoiler, and anti-fabrication rules;
8. prose quality, editorial, pacing, point-of-view, tense, and tone rules;
9. manuscript, chapter, timeline, appendix, and player-note structures;
10. player editability, regeneration, locking, tone, detail, and content controls;
11. design-level storage versus generation boundaries;
12. readiness gates and a docs-first future sequence without immediate runtime work.

The pass must reconcile every recommendation against live repository state. It should correct or reject research claims that do not match current owners.

## 4. Pipeline And Roadmap Coordination

The integration pass should update the central coordination files where the resulting durable boundary changes future planning:

- `docs/design/future-system-design-ledger.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/project-roadmap.md`;
- `docs/future_content_backlog.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-codex-output.md`.

The central roadmap should treat a future manuscript lane as gated, not active runtime work. No manuscript implementation should displace the current authority sequence merely because research exists.

## 5. Required Ownership Boundaries

The integration must preserve these distinctions:

- canonical authored content versus mutable gameplay history;
- raw or authoritative gameplay facts versus selected narrative beats;
- Chronicle/account/run-history state versus manuscript prose;
- quest history versus a narrative projection of quest history;
- event emission versus event retention;
- narrative memory versus canonical world or character state;
- generated text versus player-edited presentation;
- presentation settings versus gameplay state;
- UI display/edit interaction versus canonical mutation;
- current state versus historical state;
- player-known facts versus hidden or spoiler-bearing state.

The manuscript layer may later consume stable sources. It must not become the owner of quest outcomes, combat results, relationships, reputation, titles, injuries, property, inheritance, Knowledge, magic, law, faction state, or other gameplay facts.

## 6. Canon And Generation Posture

The durable design must keep:

- canonical facts traceable to authoritative gameplay events, persisted state, or authored content;
- generated prose presentation-only and replaceable;
- player prose edits presentation-only by default;
- literary connective tissue bounded by explicit safe-inference rules;
- unsupported motives, emotions, dialogue, backstory, relationships, witnesses, world facts, and hidden information forbidden;
- regeneration unable to alter gameplay truth;
- prose generation unable to grant, resolve, unlock, mutate, reward, punish, or persist gameplay outcomes.

## 7. Temporary Artifact Decision

The integration pass must make an explicit cleanup decision for:

- `docs/dev/tmp-living-character-manuscript-research-2026-07-12.md`

Preferred result:

- delete the temporary artifact after all useful guidance is promoted into the permanent design boundary and coordination files.

It may remain only if the integration names one concrete next consumer and an exact removal condition. It must never become a parallel permanent authority.

## 8. Explicit Non-Goals

- no implementation code;
- no final repository schema design;
- no content JSON;
- no validator or test changes;
- no normal-lint registration;
- no runtime event capture or retention changes;
- no save/account or storage changes;
- no Chronicle, journal, quest, account, or UI implementation changes;
- no language-model service selection;
- no generated manuscript samples that invent Lineage canon;
- no current owner replacement;
- no migration or compatibility behavior;
- no `0.6.0` transition;
- no change to the primary `0.5.345` route after the support integration completes.

## 9. Next Route

Immediate support route:

- `Version 0.5.344.1 - Living Character Manuscript Research Integration`

Primary route after integration:

- `Version 0.5.345 - Force Public Order Authority Evidence Audit`
