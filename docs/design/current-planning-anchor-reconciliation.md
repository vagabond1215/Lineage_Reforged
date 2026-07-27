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
6. this reconciliation for conflicts limited to stale current-anchor wording;
7. the roadmap and sequenced plan for historical chronology, version-band meaning, and non-conflicting long-term context.

## Accepted Current State

- latest completed primary: `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`;
- active parent primary: `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`;
- accepted BOM repair: `Version 0.6.6.1` at `66f12fd6f649f8f218f7f49fc721a8fe545a7a01`;
- completed fail-closed `0.6.6.2` attempt at `4/5` on the initial climate contract mismatch;
- partial then fail-closed `0.6.6.3` attempt with schema commit `56932eec` and focused assertion commit `e71f8f6b`;
- exact `0.6.6.4` implementation commit: `232d3c2f466e3ec18e620e29a47f4466ae05b84d`, changing four authorized files;
- `0.6.6.4` focused tests passed `5/5` and content lint passed `67`;
- corrected `0.6.6.5` ran the workspace audit twice and reproduced an identical `173`-tuple baseline with exactly four proven-unrelated changed-file diagnostics and zero climate-contract mentions;
- the deferred parent baseline passed `146/146`, and all content-diff and hygiene gates passed;
- first unexecuted `0.6.6.5` prompt blob `ff436c355268d21783f2dd5d87835e75b7542d92` incorrectly required zero changed-file diagnostics;
- second unexecuted prompt blob `b78d495068e41e4f8ed026fe194e0cafbe4b9b5f` required a complete prior capture that does not exist;
- corrected `Version 0.6.6.5 - Workspace Typecheck Baseline Classification And BOM Acceptance` is complete and accepted;
- active parent prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`;
- reserved next primary: `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`.

`0.6.6` is active and unblocked after corrected `0.6.6.5` completed every acceptance condition and restored the exact parent prompt. It must execute in a separate pass.

The broad TypeScript backlog remains a separate tooling/config cleanup route. It must not be repaired or weakened inside the static-content support chain.

## Accepted Near-Term Order

1. execute exact `0.6.6` in a separate pass;
2. run `0.6.7` cross-content audit;
3. run Geographic Knowledge Taxonomy And Location Recognition Contract Plan;
4. run Activity Resolution Existing-System Reuse Audit;
5. run Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision;
6. run bounded physiology/first-aid research only before the first executable or balance-bearing lethal-process catalog;
7. proceed through separately authorized owner-specific implementation packages.

## Maintenance Rule

Do not edit historical roadmap rows merely because their wording is old. Correct only live current-state headers, false active pointers, broken references, or contradictions that can misroute execution. A later dedicated roadmap/sequence maintenance pass should update their top current-anchor sections and then mark this reconciliation as consumed or retained only for audit history.
