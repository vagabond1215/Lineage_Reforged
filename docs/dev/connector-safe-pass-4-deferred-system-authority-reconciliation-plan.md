# Connector-Safe Pass 4 - Deferred-System And Backlog Authority Reconciliation Plan

Date: 2026-08-24

Status: ACTIVE

Execution surface: GitHub Connector, documentation-only

Protected active implementation route: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

## Purpose

Create a compact current authority map for important deferred systems whose intent is currently distributed across the future-content backlog, future-system design ledger, open-design question index, historical/deferred register, roadmap, and focused design decisions.

The goal is not to rewrite those large chronological documents. It is to give future GPT/Codex work one safe lookup surface answering: what owner/boundary already exists, what remains deferred, what evidence or user decision is still missing, and what event should reopen the system.

## Goals

1. Inventory high-value deferred system families that repeatedly appear across backlog/design notes.
2. For each family, identify the most specific current accepted authority and distinguish it from older planning/research material.
3. Record status using one of:
   - `BOUNDARY_ACCEPTED_DEFER_RUNTIME`;
   - `SCHEMA_OR_STATIC_FOUNDATION_EXISTS_DEFER_CONSUMER`;
   - `PRODUCT_DIRECTION_ONLY`;
   - `EVIDENCE_OR_AUTHORED_INPUT_REQUIRED`;
   - `REJECTED_OR_SUPERSEDED_MODEL`;
   - `ACTIVE_ELSEWHERE`.
4. Record the exact reopening trigger rather than a vague “later”.
5. Identify any deferred item that is accidentally competing with current `0.6.11` scope; expected result: none.
6. Preserve the open-design index as the user-question surface, the historical register as version/route history, and the backlog as chronology.
7. Do not rewrite huge authority files from partial Connector fetches.

## Target System Families

At minimum reconcile:

- quest arcs/chains and Quest/Mission/Order/Favor semantics;
- quest turn-in/rewards;
- organizations/factions/guilds/institutions/offices/government/jurisdiction/law/public order;
- travel compatibility cleanup and broader travel/journey/grid/fast-travel work;
- POI/discovery/map reveal;
- precise district/site/building/interior player location;
- NPC generation/persistence/people authority;
- relationships/reputation/favorability/elemental alignment;
- family/heirs/maturation/rearing Prestige;
- inventory/container/stack identity;
- recipes/crafting/cooking/bulk preparation;
- ecology/agriculture/managed breeding;
- effect-bearing magic/catalysts/magic law;
- survival/builder/bushcraft;
- UI common record/search/player notes;
- quest/organization access/service/favor rewards.

## Baseline Benchmarks

Record:

- hosted head after Pass 3;
- current prompt SHA;
- number of system families mapped;
- number with accepted focused boundaries;
- number requiring explicit product/authored input before implementation;
- number that should remain closed until another owner exists;
- number that conflict with current `0.6.11` (expected 0).

## Completion Benchmarks

Pass 4 succeeds only if:

- at least 15 major deferred families receive a current owner/status/reopening trigger;
- each mapping names focused authority where one exists;
- old planning artifacts are not promoted over newer focused decisions;
- unresolved product choices remain unresolved rather than being inferred;
- no new version or implementation route is activated;
- current prompt SHA is unchanged;
- final diff is documentation-only;
- no branch/PR action occurs.

## Evidence Set

Minimum:

- `docs/design/open-design-questions-index.md`;
- `docs/design/future-system-design-ledger.md`;
- `docs/future_content_backlog.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/dev/project-roadmap.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- current prompt/output/handoff;
- focused accepted boundary/decision documents discovered for each target family;
- Pass 2 travel audit and Pass 3 hygiene audit where relevant.

## Method

1. Snapshot head/prompt SHA.
2. Use the open-question index and backlog/ledger as discovery aids, not final authority.
3. Search only this repository for the most specific accepted decision for each family.
4. Create a compact authority matrix with owner, current status, remaining question, reopening trigger, and explicit exclusions.
5. Do not edit the large backlog/ledger unless a tiny unambiguous pointer is necessary; prefer the new reconciliation document.
6. Verify prompt SHA and documentation-only diff.

## Scope Exclusions

No runtime/source/content/schema/test/save/migration/build/dependency/asset/UI implementation.

No new canon or balance values.

No version renumbering or `0.7.0` promotion.

No branch/PR lifecycle mutation.

No replacement of active current prompt/handoff/output.

No broad rewrite of backlog, roadmap, sequenced plan, design ledger, or historical register from partial Connector views.

## Expected Output

Primary:

- `docs/design/deferred-system-authority-reconciliation.md`.

Coordination:

- completion appendix in this plan.
