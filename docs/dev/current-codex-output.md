# Current Codex Output

Date: 2026-07-28

Source version/run: unversioned `Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `48959ba636e8c6df071ae7c0ad9ce2920d1b35a0`; this report describes the validated working tree before the run commit.

## Result

Created:

`docs/design/lethal-process-definition-owner-namespace-and-shared-envelope-schema-plan.md`

Accepted four exact definition/mutable-owner domains:

- `hemorrhage_process`;
- `airway_process`;
- `respiratory_process`;
- `thermal_process`.

Accepted one collision-safe namespace:

`lethal_process.<owner_segment>.<slug>`

One bounded static foundation is `STATIC_PACKAGE_READY`, subject to a separate version-classification gate. Mutable and executable work remain `NO_PACKAGE`.

## Exact First Scope

| Definition id | Owner |
| --- | --- |
| `lethal_process.hemorrhage.external_hemorrhage` | `hemorrhage_process` |
| `lethal_process.hemorrhage.internal_hemorrhage` | `hemorrhage_process` |
| `lethal_process.airway.obstruction` | `airway_process` |
| `lethal_process.respiratory.post_submersion_compromise` | `respiratory_process` |
| `lethal_process.thermal.systemic_hypothermia` | `thermal_process` |
| `lethal_process.thermal.hot_altered_crisis` | `thermal_process` |

`confirmed` is an instance-admission/knowledge boundary, not part of the internal-hemorrhage definition id. Observer suspicion never becomes process truth.

## Schema And Catalog Decision

Exact future catalogs:

- `packages/content/base/game/lethal_process_hemorrhage_definitions.json`;
- `packages/content/base/game/lethal_process_airway_definitions.json`;
- `packages/content/base/game/lethal_process_respiratory_definitions.json`;
- `packages/content/base/game/lethal_process_thermal_definitions.json`.

Exact shared schema:

- `packages/schemas/game/lethal-process-definition.schema.json`.

Exact strict record fields:

- `id`;
- `slug`;
- `name`;
- `definitionOwner`;
- `processFamily`;
- `catalogLifecycle`;
- `semanticVersion`;
- `summary`;
- `references`;
- `tags`;
- `sourceAuthorityNotes`;
- `notes`.

Catalog lifecycle is `planned | canonical | retired`; `active` is forbidden to avoid confusion with instance state. `semanticVersion` is a positive owner-governed definition-meaning version, not a package/save/release version.

## Reference Decision

Directional relations:

- `causal_source`;
- `contributing_source`;
- `coexisting_process`;
- `transition_source`.

Allowed target domains:

- `injury`;
- `body_state`;
- `hazard`;
- `environment`;
- `poison`;
- `respiratory_process`;
- `magic`;
- `lethal_process`.

All six first records must use empty reference arrays because no safe exact target identity is currently accepted. Later non-empty references require canonical target ownership, explicit resolver wiring, focused tests, and no cross-owner mutation.

## Exact Static Package

Allowed future changes:

- the four owner catalogs;
- `packages/schemas/game/lethal-process-definition.schema.json`;
- `tools/content-lint/lethal-process-definitions.mjs`;
- `tools/content-lint/index.mjs`;
- `tests/unit/schema-files.test.mjs`;
- `tests/unit/lethal-process-definition-authority-validation.test.mjs`.

The package contains exactly six static definitions, one strict shared schema, one pure cross-catalog validator, exact-once normal-lint/schema registration, and one focused test. It has no runtime consumer.

No current combat-health content/schema/validator/test may change.

## Migration Boundary

No current id, hook, status, body band, HP fact, active-effect label, item, spell, skill, role, service, event, delta, save field, archive reason, notification, Chronicle entry, or prose migrates or aliases into a lethal-process definition.

## Package Readiness

`STATIC_PACKAGE_READY`

The static package requires version classification before implementation. This run assigns no primary or support version.

`NO_PACKAGE` for:

- mutable instances;
- progression, stages, balance, values, timers, probabilities, or formulas;
- care, diagnosis, observer knowledge, or urgency;
- persistence, migration, replay, or correction;
- death, restoration, closure, or Stakes;
- UI, narrative, Chronicle, or gameplay.

## Files Changed

- added `docs/design/lethal-process-definition-owner-namespace-and-shared-envelope-schema-plan.md`;
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

- repository, branch, clean worktree, upstream, fetch, and divergence;
- required durable-contract and coordination-source inspection;
- current combat-health content/schema/validator/registration/focused-test inspection;
- repository schema title, `$id`, wrapper, strict-record, local-reference, and parse-registration conventions;
- pure validator, normal-lint helper, exact-once registration, and focused-test patterns;
- owner attribution for all six accepted processes;
- namespace and exact-id collision scans;
- exact future-path absence/collision scans;
- static/mutable, care, observer, death, persistence, and migration boundary reconciliation;
- documentation-only changed-path inspection;
- conflict-marker, trailing-whitespace, and `git diff --check` scans;
- complete changed-path and full-diff review.

No build, test, content lint, typecheck, generator, server, package installation, external research, medical protocol, treatment instruction, or gameplay command was run.

## Suggested Commit Message

`docs(health): plan lethal-process definition envelope`

## Risks / Follow-Up Notes

- The ready package is static and non-executing; it must not be treated as runtime health support.
- Exact version class and label remain deliberately unassigned until the installed policy gate.
- Poison families remain blocked by research.
- Shock-like deterioration, serious burns, local freezing injury, and contextual heat illness remain outside the six-definition scope.
- The broad workspace typecheck remains the separately classified 173-diagnostic baseline.

## Next Recommended Run

Unversioned `Lethal-Process Static Foundation Version Classification And Implementation Gate`
