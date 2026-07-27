# Current Codex Output

Date: 2026-07-26

Source run: `0.6.6 BOM Repair Completion Routing`

Run classification: unversioned documentation-only connector inspection and prompt correction

Parent version: `0.6.6`

Milestone impact: `supports_current_band`

## Inspected State

Latest inspected `master` repair commit:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Commit subject:

`Handle BOM-prefixed JSON in unit tests`

The commit changes exactly:

- `tests/unit/region-first-world-data.test.mjs`;
- `tests/unit/slug-content.test.mjs`.

Each reader now parses through the narrow operation:

```js
JSON.parse(raw.replace(/^\uFEFF/, ""))
```

No content, runtime, schema, validator, persistence, UI, dependency, or gameplay file changed in that repair commit.

## Incomplete Support State Found

The code repair landed, but the repository did not contain completion evidence for the full `0.6.6.1` support gate:

- no committed focused-test result;
- no committed content-lint result;
- no committed `146/146` parent-baseline result;
- no committed content byte-identity confirmation;
- no completion updates in current output, handoff, or route register;
- `docs/dev/current-codex-prompt.md` still contained the stale repair prompt instead of the exact parent `0.6.6` prompt.

The old prompt could no longer execute correctly because it required reproduction of the pre-repair four-failure baseline.

## Routing Decision

Activated:

`Version 0.6.6.2 - BOM Repair Post-Validation And Parent Prompt Restoration`

Active prompt blob:

`5d4aa0a0961065f4cfea0968317b8e7f0df4c190`

Prior repair implementation:

`Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`

Expected repair commit:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Preserved exact parent prompt blob:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

`0.6.6.2` is a validation-only support suffix. It may not edit the repaired tests, content, runtime, schemas, validators, saves, dependencies, UI, or gameplay.

## Required Acceptance

The Codex pass must:

1. verify the exact repair range and two-file scope;
2. run the two repaired test files;
3. run normal content lint;
4. rerun the parent baseline and require `146/146` unless a legitimate current count change is fully explained;
5. prove `packages/content` is unchanged from the pre-repair head;
6. pass hygiene and full-diff review;
7. update completion coordination only after all checks pass;
8. restore `docs/dev/current-codex-prompt.md` byte-for-byte from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`;
9. stop without executing the parent content package.

If any gate fails, Codex must leave this prompt active and make no edits.

## Near-Term Sequence

1. complete `0.6.6.2` validation and exact parent-prompt restoration;
2. execute exact `0.6.6 - Monster, Ecology, And Loot Static Content Expansion` in a separate pass;
3. run `0.6.7 - Cross-Content Coherence And Coverage Audit`;
4. run Geographic Knowledge Taxonomy And Location Recognition Contract Plan;
5. run Activity Resolution Existing-System Reuse Audit;
6. run Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision;
7. run bounded physiology/first-aid research only when the receipt contract authorizes it;
8. proceed through separately authorized owner-specific implementation packages.

## Parallel Audit Posture

The isolated `prep/integrated-gameplay-0-7-readiness-audit` branch remains unmerged and noncontrolling. Its findings require a fresh integration inspection after the active static and documentation sequence.

## Active Prompt

`Version 0.6.6.2 - BOM Repair Post-Validation And Parent Prompt Restoration`

Suggested commit:

`docs(routes): accept bom repair and restore 0.6.6`
