# Current Codex Output

Date: 2026-07-28

Source version/run: unversioned `First Lethal-Process Definition And Catalog Plan`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `599cef0d1dc2f1f05080c0a61a1686005bf017e1`; this report describes the validated working tree before the run commit.

## Result

Created `docs/design/first-lethal-process-definition-and-catalog-plan.md`.

The existing combined combat-health vocabulary cannot safely host lethal-process definitions. The accepted direction is a shared structural envelope with owner-specific definition catalogs. Exact implementation remains `NO_PACKAGE`.

## Live Vocabulary Inventory

- Content: `packages/content/base/game/combat_health_vocabulary.json`.
- Exactly two records: `combat_status.stagger` and `combat_status.bind`.
- Both are `kind: status`, `status: planned`, `family: control`.
- Zero live condition and injury records.
- Strict eleven-field records: id, slug, name, kind, status, family, summary, allowed owner types, tags, authority notes, and notes.
- Exact kinds: status, condition, injury.
- Exact prefixes: `combat_status.`, `combat_condition.`, `combat_injury.`.
- Pure focused validator, exact-once normal-lint registration, and 13 focused tests.
- No production import of the canonical records.
- Runtime uses separate `status.*` hooks, mutable combat status effects, plain `activeEffects` labels, HP-zero defeat/incapacitation, body-state projections, and save snapshots. None is lethal-process authority.

## Catalog And Owner Decision

Rejected:

- adding a lethal-process kind to `combat_health_vocabulary`;
- reclassifying lethal processes as status, condition, or injury;
- one universal lethal-process catalog or resolver;
- multiple unrelated owner catalogs without a shared identity envelope.

Accepted conceptually:

- a shared structural envelope for collision-safe identity, owner declaration, definition lifecycle, provenance, and bounded references;
- owner-specific catalogs for definition meaning;
- owner-specific mutable instances and accepted results;
- strict separation from observer projection, care resolution, death, persistence, UI, and Chronicle.

No exact fields, enums, prefixes, paths, or schema were accepted.

## First Definition Scope

Selected conceptually:

1. external hemorrhage;
2. confirmed internal hemorrhage;
3. airway obstruction;
4. post-submersion respiratory compromise;
5. systemic hypothermia;
6. hot-altered heat crisis.

Outside the first scope:

- suspected internal bleeding is observer-only;
- shock-like circulatory deterioration remains an owner question;
- poison families remain a research/design gap;
- local freezing and superficial burns remain injury-owned;
- non-stroke heat illness remains contextual;
- serious burns retain split injury/body/respiratory/mechanism ownership;
- chemical, electrical, and inhalation distinctions remain source-domain inputs unless later accepted as distinct processes.

## Static, Mutable, Observer, Care, And Language Boundaries

Static definitions may eventually carry stable identity, owner, lifecycle, provenance, meaning, and bounded references only.

Static definitions must not carry current actor state, severity, stage, timer, probability, diagnosis, care attempt, treatment progress, inventory or magic use, functional state, death, save, event, correction, UI, Chronicle, or gameplay behavior.

Observer suspicion never becomes process truth automatically. Later care work must use explicit capability and owner-specific result/receipt boundaries.

Precise internal technical language may remain hidden. Player-facing labels, dialogue, narrative, status text, and Chronicle output must use brief, concrete, setting-appropriate wording; ordinary observation, trained judgment, and magical sensing must remain distinct. Modern clinical jargon and pseudo-scientific exposition are not default display language.

## Package Readiness

`NO_PACKAGE`

Missing authority includes exact owner namespaces and paths, shared fields/enums, cross-owner reference rules, the care-capability/process-effect contract, mutable instances, persistence/migration/correction, the circulatory and burn splits, poison families, and presentation validation.

## Research Consumption And Retention

This plan is the second named consumer of:

`docs/dev/tmp-grounded-lethal-process-stabilization-and-first-aid-research-2026-07-28.md`

Verified:

- 58,943 UTF-8 bytes;
- SHA-256 `95760de325004f7e19c030e0177e2022873ff8ff1690a0924974bd3b9674da6d`.

The artifact remains unchanged.

Outstanding named consumers are exactly:

1. the first care-capability and stabilization contract/package;
2. the first observer-safe crisis assessment/presentation package.

## Files Changed

- added `docs/design/first-lethal-process-definition-and-catalog-plan.md`;
- updated `docs/dev/current-codex-output.md`;
- updated `docs/dev/current-codex-prompt.md`;
- updated `docs/dev/current-gpt-handoff.md`;
- updated `docs/dev/codex-sequenced-implementation-plan.md`;
- updated `docs/dev/project-roadmap.md`;
- updated `docs/dev/project-vision-and-continuity-brief.md`;
- updated `docs/dev/historical-version-and-deferred-route-register.md`;
- updated `docs/design/current-planning-anchor-reconciliation.md`;
- updated `docs/design/static-content-expansion-program.md`;
- updated `docs/future_content_backlog.md`.

## Checks Run

- repository, branch, worktree, upstream, fetch, and tracking alignment;
- research integration acceptance and artifact presence;
- exact research-artifact byte length and SHA-256;
- exact combat-health content count, ids, kinds, fields, enums, prefixes, validator rules, registration, and focused-test count;
- production reference, import, runtime, body-state, persistence, and presentation searches;
- required design-authority reconciliation;
- referenced-path and documentation-only scope checks;
- conflict-marker, trailing-whitespace, and `git diff --check` scans;
- complete changed-path and full-diff review.

No build, content lint, typecheck, test, generator, server, package installation, external research, medical protocol, or gameplay command was run.

## Suggested Commit Message

`docs(health): plan first lethal process catalog`

## Risks / Follow-Up Notes

- Current HP-zero defeat/archive/save-deletion behavior remains a rejected target behavior outside this run.
- No active functional-state, lethal-process, care, crisis-receipt, death/restoration, persistence, or correction owner exists.
- Exact poison taxonomy and detailed burn/process representation remain unresolved.
- The catalog cannot be implemented safely until care capability and process-effect references are decided.
- The broad workspace typecheck remains the separately classified 173-diagnostic baseline.

## Next Recommended Run

Unversioned `Care Capability, Stabilization, And Process-Effect Contract Decision`
