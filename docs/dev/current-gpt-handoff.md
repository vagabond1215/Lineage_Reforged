# Current GPT Handoff

Source version/run: Version 0.5.353 - Validation Source Map
Date: 2026-07-12

## Status

Latest completed primary:

- `Version 0.5.353 - Validation Source Map`

Latest completed support/audit run:

- `Version 0.5.344.1 - Living Character Manuscript Research Integration`

Immediate next primary route:

- `Version 0.5.354 - Validation Command Matrix Plan`

## Source Map Result

Focused tests and standalone content lint are the current green confidence path. Normal content lint passes with 67 files. The schema suite passes with 105 tests.

The observed full suite passed 3,456 of 3,471 tests and failed 15 across tool-surface drift, Backstory draft assertions, settlement/transport, route security, region-first world, Renown, and BOM parsing. It also executes DB build through integration coverage, so it is not strictly read-only. Both default/UI and workspace typechecks exit 1 on established broad debt.

## Remaining Guardrails

The next pass must define a docs-only command matrix by change class: minimum/conditional/prohibited commands, green versus known-failing semantics, focused-test selection, side-effect labels, generated-output policy, and environment-versus-repository reporting.

It must not fix the stale content-lint expectation or any other failure, and must not edit scripts, tests, configs, dependencies, source, schemas, content, generated output, runtime, UI, or save/account behavior. All prior roadmap gates remain intact.

Suggested next commit:

`docs(validation): define validation command matrix`
