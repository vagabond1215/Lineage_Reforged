# Version 0.6.10.5 - Ashen Reef Survey Progression And Projection Post-Repair Acceptance Audit

Date: 2026-08-13

Label class: support suffix

Parent version: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Milestone impact: `supports_current_band`

Execution posture: independent production-read-only audit with removable temporary probes

Original parent implementation: `008db9c93eb8818aea51652be07fd196df41c45f`

First repair: `59af92629a79e95fa20247959159e336a8dbc88e`

Residual-finding audit authority: `ad4a080acc3d05a4a790c4b219780db11a1be1a1`

Progression/placement repair: `07c57392c8078927e4f9e12efe18d8d89bb1fc70`

## Objective

Independently audit the complete repaired Ashen Reef survey authority, with special emphasis on the two residual defects repaired by `0.6.10.4`:

- `AR-007`: retained progression/Echo must be recomputed from retained authoritative owner inputs before durable duplicate, repair, or publication trust;
- `AR-008`: byte-correct notification and Chronicle rows must also occupy exact total survey-known authority placement and remain explicitly, safely repairable after restart.

Decide whether parent `0.6.10` is accepted. Only after that decision, issue the required representative-loop classification from actual creator-to-eligibility-to-survey evidence. Do not accept from the implementation report, green tracked tests, prior probes, or subagent findings alone.

## Starting Disposition

- `0.6.10`: implemented at `008db9c...`, repaired at `59af926...` and `07c5739...`, but not independently accepted;
- `0.6.10.1`: complete with `REPAIR_REQUIRED`;
- `0.6.10.2`: complete with `IMPLEMENTED_PENDING_POST_REPAIR_AUDIT`;
- `0.6.10.3`: complete with `REPAIR_REQUIRED` after independently proving `AR-007` and `AR-008`;
- `0.6.10.4`: complete with `IMPLEMENTED_PENDING_REAUDIT`;
- survey receipt decision: remains `PACKAGE_READY`;
- accepted `0.6.9`: unchanged;
- representative-loop classification: not yet issued;
- `0.7.0`: `NOT_READY` pending this audit and a later explicit docs-first band-entry decision.

## Authority And Orientation

Read `AGENTS.md` completely, then follow the repository-first protocol, prompt-execution platform/tool policy, branch policy/register, and applicable failure-pattern guardrails. Read the complete current prompt, handoff, output, historical register, planning reconciliation, focused survey receipt decision, permanent acceptance audit and every appendix, accepted occurrence/correction authority, relevant accepted `0.6.9` persistence/recovery authorities, and every production/test file changed by `59af926...` and `07c5739...`.

Fetch/prune and synchronize clean `master`. Record the original implementation, first repair, residual audit, second repair, repair coordination, audit starting head, audit authority/coordination commits, pushed remote head, and post-fetch hosted head distinctly. Stop if the exact authority chain, required tooling, or authenticated synchronized checkout is unavailable.

Use multi-agent work only for bounded, separable read-only inspection. The primary agent must make the acceptance and representative-evidence decisions and reverify every material subagent claim against the synchronized checkout. Do not pause for a routine GPT/Connector pass.

Inventory every local/remote branch and open pull request. Reinspect these exact read-only evidence refs:

- activity advancement: `b4cbaea5f4292904bba62f60a0108bb84f2bd405`;
- progression/reward mutation: `387f2491d0d671ee7834656c28183e72a798f1ca`;
- Chronicle/notification provenance: `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`;
- Knowledge/discovery visibility: `46434f31f8b06d49aad9a516543fbe36d188d519`;
- protected integrated-gameplay readiness: `59c103c3a06d55f35bffa735fd4b7814dffb583e`.

Keep all evidence and protected refs read-only. Do not merge, rebase, force-update, close, delete, or otherwise mutate them or their pull requests unless a fresh controlling lifecycle trigger explicitly makes action due.

## Audit Boundary

This audit is production-read-only. Do not modify production source, shared contracts, tracked tests, serializers, migrations, formats, dependencies, content, assets, UI, or behavior. Temporary executable probes may exist only outside tracked tests and must be removed before the coordination commit.

If any material contract or required validation fails, return `REPAIR_REQUIRED`, install the smallest decision-complete parent-specific support repair, and stop without repairing production in this audit.

## AR-007: Owner-Derived Progression Coherence

Independently prove that the shared semantic authority gate:

1. retains all existing deep progression, reputation, origin, clock-month-13, and recursive canonical checks;
2. calls the repository-authoritative progression/Echo resolver using the retained attributes, complete skill collection, and retained progression inputs;
3. requires exact semantic equality with the full owner-derived progression before durable duplicate lookup, repair, mutation, publication, or load authority can trust the graph;
4. rejects internally coherent zero, stale, alternate-contribution, diversity, adjusted-Echo, level, and legacy-growth contradictions even when every exposed canonical string is caller-recomputed;
5. accepts legitimate owner-derived attribute/skill/progression variants and recursively key-order-equivalent intent;
6. preserves clean same-process and restart duplicates without replay or rollback;
7. quarantines forged retained authority and prevents a failed publication from replacing the last valid head.

Use a fresh removable adversarial probe in addition to tracked tests. Corrupt both command inputs and already-retained requests. Prove rejection is no-throw, atomic, precedes duplicate identity, and survives raw serialization plus version-7 publication/readback/restart.

## AR-008: Projection Placement Authority

Independently prove that notification and Chronicle projection inspection validates exact row content and exact placement among survey-known rows under one total `(appliedTick desc, stable resultId asc)` order.

Verify all of the following:

1. reversed or otherwise permuted byte-correct survey-known rows are discoverable after initial application, insertion, replacement, a prior reorder, and restart;
2. repair sorts only survey-known rows and writes them only into survey-known slots, preserving every opaque row's exact object, serialized bytes, and index;
3. an explicit exact `misordered` / `reordered` persisted posture is deep-valid, round-trips, remains nonterminal for later drift, and is invalid for event projections or mismatched pairs;
4. different-tick and same-tick result-id ordering converges through either affected result and either repair invocation order;
5. subsequent repair is already-correct/idempotent with no new record or emission;
6. caps never evict retained truth merely to repair placement;
7. full capped missing-plus-opaque destinations retain terminal `retention_expired` behavior without mutation;
8. pending-only event re-emission, correction-pending blocks, completed/superseded correction authority, deterministic ordinals, malformed-row replacement, legitimate eviction, and ambiguous-state fail-closed behavior remain intact;
9. version-7 publish/load preserves drift before explicit repair and exact repaired rows/records afterward.

Use fresh removable probes with two genuine accepted results, notification and Chronicle destinations, different and equal ticks, interspersed opaque rows, caps, both invocation orders, and raw plus published restart boundaries.

## Retained Parent Contract

Re-audit every retained `AR-001` through `AR-006` contract and the original package:

1. deep semantic/canonical owner authority, including progression, reputation, origin, resources/runtime, body/stat inputs, and valid month 13;
2. mandatory nonempty correction evidence, exact owner reconciliation, evidence linkage, acyclicity, uniqueness, and pending blocks;
3. deterministic projection insertion/repair, no newer/opaque eviction, later-drift discovery, and pending-only single event repair;
4. exception-total typed preparation, durable duplicate lookup before stale/domain rejection, real-caller technical-retry identity, rerender-equivalent retry, terminal clearing, and accepted-only state application;
5. the exact persisted nine-field `no_proposal` contract and byte-stable Knowledge/location/map/travel/currency/standing/inventory/reputation/turn-in-reward boundaries, including General Lore;
6. actual positive, breakthrough-blocked, and unblocked maximum-rank unchanged skill presentation through panel-facing production facts;
7. optional survey-container initialization/validation, continuity-before-receipt prepare/commit, complete receipts, legacy baseline, corrections, and projection-only repair;
8. all four survey stages, exact two one-tick owner applications, natural resource resolution before explicit costs, changing maxima, skill gates, discovery/Codex/activity behavior, source immutability, and preview/execution parity;
9. head/non-head continuity, durable later-state duplicates, raw serialization, version-6 migration, version-7 publication/readback/restart, browser safety, and same-command/later Normal defeat/recovery preservation.

## Representative-Loop Evidence

Do not classify representative evidence unless the parent is first accepted. Then inspect the actual production path from ordinary character creation through save/load, quest availability/acquisition/tracking, known-location/travel, activity selection, four survey shifts, accepted-only UI/session application, persistence, and restart.

Issue exactly one classification:

- `REPRESENTATIVE_LOOP_ACCEPTED` only if that ordinary production path is complete, repeatable, and proven without manually injected eligibility state;
- `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE` if the engine-owned survey package is valid but ordinary creator-to-survey reachability or its representative test evidence remains incomplete.

Do not treat demo fixtures, direct quest/location/activity injection, or a protected readiness proposal as ordinary reachability. A representative-evidence gap does not by itself reverse a fully passing parent-authority decision, but it must keep `0.7.0` `NOT_READY` and route the smallest current-band evidence/reachability prerequisite.

## Required Validation

Run and report exact counts/results for:

1. fresh independent removable adversarial probes for `AR-007`, `AR-008`, and retained high-risk contracts;
2. all three focused survey test files;
3. `gameplay-loop-skill-gating`, campaign persistence, save/load round trip, and the same adjacent travel, quest acceptance/tracking, activity selection, body/resources, stat/progression/reputation, publication, caller, and achievements matrix used by `0.6.10.4`;
4. the Knowledge `132` evidence matrix and clock/schema `107` matrix;
5. RPG UI production Vite build;
6. bounded TypeScript audit against the exact registered baseline, identifying every changed-surface diagnostic;
7. raw serialization, version-6 migration, version-7 publication/readback/restart, browser safety, public exports/mirrors, and parent-ledger preservation;
8. ordinary creator/save-load/quest/travel/activity/survey reachability probes for the representative classification, but only after the parent decision;
9. `git diff --check`, complete implementation diff/hygiene inspection, clean final worktree, branch/upstream, fetch/remote-head, hosted file/status, and workflow-availability checks.

Treat the registered broad-suite and TypeScript baselines accurately. Green counts do not replace independent semantic, caller, retry, restart, repair-order, retention, or creator-reachability evidence. Apply at minimum `FP-001`, `FP-002`, `FP-003`, `FP-005`, `FP-006`, `FP-008`, `FP-009`, `FP-011`, `FP-012`, `FP-013`, `FP-014`, `FP-015`, and `FP-016`.

## Outcomes

Return exactly one parent result.

### `PARENT_ACCEPTED`

Use only if both repaired findings, every retained positive contract, and every required parent gate pass independently. Then:

- append independent acceptance evidence to the permanent audit record;
- mark `0.6.10.5` complete and parent `0.6.10` accepted;
- issue exactly one representative-loop classification from the production evidence above;
- if representative evidence is accepted, install an unversioned docs-first `Integrated Gameplay 0.7 Band-Entry Readiness Decision`; do not assign or implement `0.7.0` in this audit;
- if representative evidence is incomplete, install the smallest current-band reachability/evidence route and keep `0.7.0` `NOT_READY`.

### `REPAIR_REQUIRED`

Use if either repaired finding, any retained material contract, or any required parent validation gate fails. Do not repair production. Record one numbered finding-to-owner-to-test matrix and install only the smallest parent-specific support repair. Do not issue a representative-loop classification while the parent remains unaccepted.

## Required Coordination And Publication

Update current prompt/output/handoff, the focused permanent acceptance audit, repository-first Current Application, historical register, planning reconciliation, roadmap, sequenced plan, continuity brief, backlog, static program, failure-pattern register when warranted, and branch register. Preserve dated history and exact supersession language.

Commit only intended documentation and removable-probe cleanup, push `master`, fetch again, verify `HEAD == origin/master`, retrieve hosted prompt/output/handoff, inspect hosted status/check/workflow evidence, and finish with a clean worktree. Report exact inspected implementation, repair, audit, coordination, remote, and hosted identities separately.

## Scope Exclusions

Do not repair production in this audit; implement survey turn-in/rewards; add geographic Knowledge/map/recognition behavior; change generic activity, effect, transaction, replay, correction-execution, lineage, or event infrastructure; add other Stakes modes, checkpoint/cloud/death/succession work; change versions, dependencies, content, assets, generated output, or unrelated UI/runtime; or mutate/integrate/close/delete/rebase/force-update branches or pull requests.
