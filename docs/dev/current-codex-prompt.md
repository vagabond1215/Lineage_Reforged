# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the documentation-only Living Character Manuscript research integration:

`Version 0.5.344.1 - Living Character Manuscript Research Integration`

## Current accepted repo state

- Latest completed primary: `Version 0.5.345 - Force Public Order Authority Evidence Audit`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Completed Deep Research gate: `GPT-DR.chronicle.living-character-manuscript - Living Character Manuscript / Narrative Chronicle System`.
- Temporary research artifact: `docs/dev/tmp-living-character-manuscript-research-2026-07-12.md`.
- Approved intake route: `docs/design/living-character-manuscript-research-intake-route.md`.
- Immediate support route: `Version 0.5.344.1 - Living Character Manuscript Research Integration`.
- Primary route after integration: `Version 0.5.346 - Force Public Order Authority Boundary Decision`.
- Existing quest, journal, Chronicle, discovery, account run-history, session event, UI projection, save/account, and runtime owners remain authoritative.
- Research is planning input only. It establishes no Lineage canon and authorizes no implementation.

## Purpose

Consume the temporary Living Character Manuscript Deep Research artifact, reconcile it against the live repository, and promote only durable owner-aware guidance into permanent design documentation.

The target concept is a player-facing Living Character Manuscript / Character Chronicle backed by an event-sourced narrative projection. Canonical gameplay facts must remain separate from generated prose. Generated prose, chapter titles, transitions, compression, narrator tone, regeneration, and player edits remain narrative presentation unless a later explicit project decision assigns a different owner.

Do not implement the manuscript system in this run.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md` and `README.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/project-roadmap.md`;
- `docs/future_content_backlog.md`;
- `docs/dev/tmp-living-character-manuscript-research-2026-07-12.md`;
- `docs/design/living-character-manuscript-research-intake-route.md`;
- `docs/design/gpt-deep-research-version-tracking-decision.md`;
- `docs/design/pipeline-roadmap-consolidation-decision.md`;
- `docs/design/quest-event-chronicle-authority-boundary-decision.md`;
- `docs/design/chronicle-run-end-summary-source-audit.md`;
- `docs/design/chronicle-run-end-summary-view-model-plan.md`;
- `docs/design/future-system-design-ledger.md`;
- current Chronicle, quest-journal, discovery, account run-history, session-event, presentation, save-snapshot, shared-contract, and UI sources only as needed to correct repository-state claims and map ownership.

Keep searches targeted. Do not turn this into a broad runtime, UI, storage, quest, event, relationship, or account audit.

## Expected permanent output

Add:

- `docs/design/living-character-manuscript-design-boundary.md`

The permanent document should be a research-backed, repository-corrected design boundary, not a copy of the temporary report. It should contain at minimum:

1. executive decision and conceptual model;
2. live repository ownership map and current gaps;
3. canonical fact versus generated presentation boundary;
4. event eligibility and narrative-treatment model;
5. event clustering and repetition/grind compression rules;
6. narrative memory and continuity requirements;
7. canon, inference, provenance, uncertainty, and anti-fabrication rules;
8. prose quality, editorial, pacing, transition, point-of-view, tense, and tone rules;
9. manuscript, chapter, timeline, appendix, and player-note structures;
10. player editability, regeneration, locking, and output-control boundaries;
11. design-level stored-versus-generated decisions without final schemas;
12. source-system readiness gates and systems that must not feed the manuscript yet;
13. docs-first future roadmap sequence;
14. pitfalls and mitigations;
15. open questions that must be resolved before implementation.

Update `docs/design/future-system-design-ledger.md` only with compact durable criteria that belong in the centralized future-system ledger. Do not duplicate the full research report there.

## Required design decisions

### Conceptual model

- Decide and define the relationship among Story, Chronicle, Living Character Manuscript, character biography, campaign journal, saga, memoir, quest log, and event-sourced narrative projection.
- Prefer one player-facing term and one technical design description without renaming existing live Chronicle owners in this run.

### Source and owner boundaries

- Inventory current authoritative and presentation-only sources relevant to a future manuscript.
- Preserve authored quest definitions/templates/archetypes, mutable quest/journal state, session Chronicle events, discovery Chronicle state, account run history, run-end projections, UI presentation, save/account state, and runtime event/state owners.
- Decide which current sources may be future inputs, which are insufficient, and which must not be treated as canonical manuscript facts.
- Do not create a parallel owner for facts already owned elsewhere.

### Event selection and compression

- Define scene, developed paragraph, summary/montage, brief mention, and omission treatments.
- Define narrative-weight dimensions without implementing a scoring formula.
- Define clustering by goal, quest, relationship, place, time, cause, and consequence.
- Define when mining, crafting, farming, gathering, trading, resting, travel, training, repeated combat, and errands are compressed, skipped, or narratively meaningful.

### Narrative memory and continuity

- Define design-level needs for character identity, goals, unresolved threads, relationships, reputation, places, injuries, losses, titles, affiliations, possessions, moral-choice patterns, prior chapter summaries, voice, and spoiler horizon.
- Keep narrative memory derived and source-linked; it must not replace canonical world, character, relationship, or gameplay state.

### Canon, inference, and provenance

- Define canonical facts, safe literary connective tissue, and non-canonical presentation.
- Forbid unsupported backstory, relationships, dialogue, motives, emotions, witnesses, causality, world facts, hidden information, and future outcomes.
- Require factual claims to be traceable to authoritative sources at design level.
- Preserve ambiguity where state is incomplete.

### Prose and editorial quality

- Define a restrained default voice, consistent tense and point of view, transition rules, detail control, repetition checks, melodrama limits, and chapter-level editorial passes.
- Make tone controls affect diction and rhythm, not facts or moral judgment.

### Player agency and storage boundary

- Decide edit, lock, regenerate, include, exclude, annotate, tone, detail, violence, romance/family, mature-content, spoiler, cadence, chapter-break, and compression controls at design level.
- Keep player edits separate from gameplay canon by default.
- Distinguish canonical event/state retention, curated beats, narrative memory, chapter summaries, generated versions, revisions, and player-edited presentation without designing final schemas.

### Readiness and sequence

- Define a docs-first sequence before any offline prototype or runtime candidate.
- Identify missing event retention, identity, relationship, quest-history, world-history, persistence, provenance, spoiler, and quality owners.
- Keep manuscript runtime work gated until a later explicit readiness decision.

## Temporary artifact cleanup

Make an explicit cleanup decision for:

- `docs/dev/tmp-living-character-manuscript-research-2026-07-12.md`

Delete it in this run if all useful guidance is promoted into the permanent design boundary and central coordination files.

Retain it only if one concrete next consumer and an exact removal condition are documented. It must not remain as a parallel permanent authority.

## Pipeline and roadmap updates

Update as necessary:

- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/project-roadmap.md`;
- `docs/future_content_backlog.md`;
- `docs/design/future-system-design-ledger.md`;
- `docs/design/gpt-deep-research-version-tracking-decision.md` and `docs/design/living-character-manuscript-research-intake-route.md` only if their completed/consumed status needs a narrow correction.

Record `Version 0.5.344.1 - Living Character Manuscript Research Integration` as a completed support route, not a primary milestone. Do not renumber `0.5.345`.

At the end of this run, restore the active next primary route and rewrite this prompt for:

- `Version 0.5.346 - Force Public Order Authority Boundary Decision`

Use the existing force/public-order boundary-decision scope and guardrails from repository history. Do not perform that decision in this support run.

## Guardrails

Documentation only.

Do not add or edit:

- implementation code;
- final repository schemas;
- content JSON;
- validators or tests;
- normal content-lint registration;
- runtime commands, handlers, event emission, event retention, or state mutation;
- Chronicle, journal, quest, discovery, account, save, storage, or UI behavior;
- generation services, model selection, prompts used at runtime, or networking;
- Lineage canon, named characters, relationships, events, places, organizations, dialogue, motives, emotions, or world facts;
- migrations or compatibility behavior;
- generated output or build artifacts.

Do not treat research examples as project authority. Do not rename or replace current Chronicle owners. Do not let generated prose become canonical. Do not allow manuscript text or player edits to grant, resolve, unlock, mutate, reward, punish, reveal hidden state, or persist gameplay outcomes. Do not reopen gated, paused, rejected, or closed lanes. Do not transition to `0.6.0`.

## Allowed changes

- `docs/design/living-character-manuscript-design-boundary.md`;
- `docs/design/future-system-design-ledger.md`;
- `docs/design/gpt-deep-research-version-tracking-decision.md` if a consumed-status note is needed;
- `docs/design/living-character-manuscript-research-intake-route.md` if a consumed-status note is needed;
- deletion of `docs/dev/tmp-living-character-manuscript-research-2026-07-12.md` when fully consumed;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/project-roadmap.md`;
- `docs/future_content_backlog.md`.

## Validation

Run:

```bash
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify:

- documentation-only scope;
- no code, content, schema, validator, test, normal-lint, contract, runtime, UI, storage, save/account, or gameplay changes;
- live repository owners accurately represented;
- generated prose remains presentation-only;
- canonical facts and literary connective tissue remain distinct;
- no invented Lineage canon;
- no unsupported implementation permission;
- no primary-route renumbering;
- `0.5.346` restored as the next prompt after integration;
- temporary artifact deleted if fully consumed or retained with exactly one named consumer and removal condition;
- no conflict markers, trailing whitespace, or unrelated changes.

## Suggested commit message

`docs(chronicle): integrate living manuscript research`
