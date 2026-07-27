# Current Planning Anchor Reconciliation

Date: 2026-07-27

Status: accepted narrow documentation-only coordination authority

Milestone impact: `supports_current_band`

## Purpose

This document reconciles stale current-state headers in long-lived planning documents without rewriting their historical chronology. It changes no runtime, content, schema, validator, test, save, migration, dependency, UI, or gameplay authority.

## Proven Stale Headers

The following files contain current-anchor text that predates completion of `Version 0.6.5` and the later support sequence:

- `docs/dev/project-roadmap.md` still identifies `Version 0.6.4 - World And Settlement Static Content Expansion` as the latest completed primary in its top override section;
- `docs/dev/codex-sequenced-implementation-plan.md` still identifies `Version 0.6.4` as the latest completed primary in its current-anchor section.

The roadmap and sequenced plan remain valuable historical and version-band records. Their stale current-anchor lines are not execution authority.

## Controlling Current Anchor

Until the roadmap and sequenced plan receive a dedicated full-document maintenance pass, use the following precedence for current execution and routing:

1. `docs/dev/current-codex-prompt.md` for the active executable prompt;
2. `docs/dev/current-gpt-handoff.md` for immediate guardrails and route order;
3. `docs/dev/current-codex-output.md` for the latest completed inspection or implementation state;
4. `docs/dev/historical-version-and-deferred-route-register.md` for canonical route identity, active/deferred posture, and reopening triggers;
5. the most specific focused decision;
6. this reconciliation for conflicts limited to stale current-anchor wording in the roadmap or sequenced plan;
7. the roadmap and sequenced plan for historical chronology, version-band meaning, and non-conflicting long-term context.

## Accepted Current State

- latest completed primary: `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`;
- active parent primary: `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`;
- landed but not yet accepted BOM repair: `Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair` at commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01`;
- completed fail-closed attempt: `Version 0.6.6.2`, which passed repair-scope/content-identity gates and stopped at `4/5` on the initial climate contract mismatch;
- partial then fail-closed attempt: `Version 0.6.6.3`, with schema commit `56932eecedd7b28216b23cb5bf211fea7b01df46` and focused climate assertion commit `e71f8f6b625f7b6744492cc8b19ab695f788d89c`; validation remained `4/5`, five scalar climate records required bounded migration, and the test asserted population capacity at the wrong profile path;
- active support suffix: `Version 0.6.6.4 - Region Climate Data Migration, Population Assertion Repair, And BOM Acceptance`;
- active support prompt blob: `1fce964f515a64f0b7e97ea96a5604e858d7b9f0`;
- preserved exact parent prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`;
- reserved next primary: `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`.

`0.6.6` remains the current parent primary. Its content authoring remains fail-closed until `0.6.6.4` performs exactly five scalar-to-singleton-array migrations, repairs the population-capacity assertion, aligns the remaining static types, passes focused tests, content lint, workspace typecheck, the parent baseline, exact content-diff and hygiene gates, and restores the exact parent prompt.

## Accepted Near-Term Order

1. complete the bounded region climate migration and BOM acceptance gate, then restore exact `0.6.6` through `0.6.6.4`;
2. execute exact `0.6.6` in a separate pass;
3. run `0.6.7` cross-content audit;
4. run Geographic Knowledge Taxonomy And Location Recognition Contract Plan;
5. run Activity Resolution Existing-System Reuse Audit;
6. run Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision;
7. run bounded physiology/first-aid research only before the first executable or balance-bearing lethal-process catalog;
8. proceed through separately authorized owner-specific implementation packages.

## Maintenance Rule

Do not edit historical roadmap rows merely because their wording is old. Correct only live current-state headers, false active pointers, broken references, or contradictions that can misroute execution. A later dedicated roadmap/sequence maintenance pass should update their top current-anchor sections and then mark this reconciliation as consumed or retained only for audit history.
