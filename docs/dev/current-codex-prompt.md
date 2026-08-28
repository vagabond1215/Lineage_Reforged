# Integrated Gameplay 0.7 Band-Entry Readiness Decision

Date: 2026-08-27

Label class: unversioned documentation-only decision

Milestone impact: `band_entry_candidate`

Execution posture: synchronized repository-first docs-only readiness decision; production, schemas, content, tests, saves, migrations, dependencies, assets, and gameplay behavior are read-only

Accepted predecessor: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

Acceptance authority: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

Representative classification: `REPRESENTATIVE_LOOP_ACCEPTED`

Starting `0.7.0` posture: `NOT_READY`

## Objective

Independently decide whether every repository-defined `0.7.x` band-entry criterion is satisfied by accepted current authority, or whether one or more bounded current-band prerequisites remain. Return exactly one result:

- `BAND_ENTRY_READY`; or
- `BAND_ENTRY_NOT_READY`.

This run is a decision, not `Version 0.7.0` implementation. Do not assign, implement, or claim `0.7.0` unless the evidence supports `BAND_ENTRY_READY` and the decision installs a separate exact implementation route.

## Required Orientation

Follow `AGENTS.md`, the repository-first protocol, Codex-versus-Connector handling procedure, platform/tool policy, resource-slicing policy, branch policy/register, and applicable failure-pattern register. Fetch/prune, synchronize clean `master`, inventory branches and open pull requests, and distinguish inspected, decision, coordination, pushed, tracking, and hosted heads.

Read completely:

- current prompt, handoff, output, historical register, and planning reconciliation;
- the internal versioning and release-milestone policy;
- accepted `0.6.9`, `0.6.10`, `0.6.11`, and representative-loop acceptance authorities;
- the protected integrated-gameplay readiness reference as read-only historical evidence;
- current architecture, caller, persistence, event/result, save/load, UI-application, and representative integration tests relevant to the band gate.

Connector passes and protected/evidence branches remain supporting evidence only. Reverify every material current-state claim against live `master`.

## Decision Gate

Evaluate every accepted `0.7.x` entry criterion separately and as an integrated whole. At minimum prove or disprove:

1. an engine-owned gameplay loop with authoritative advancement and typed results/events;
2. persistence through the current save/publication/load/restart path;
3. typed cross-system consequences with deep owner validation, durable duplicate behavior, correction/repair posture, and no hidden UI authority;
4. accepted-only UI/session application through the real production caller;
5. an ordinary injection-free creator-to-loop path with every prerequisite acquired through its production owner;
6. representative integration coverage for success, rejection, retry, restart, stale/conflicting state, durable duplicate, and preserved nested authority;
7. explicit boundaries for what the representative loop does and does not prove, including active unturned-in Soundings and deferred turn-in/reward work;
8. no unresolved blocker that the milestone policy defines as mandatory for band entry.

Do not treat one accepted representative path as proof that unrelated quest turn-in, rewards, class/progression cleanup, attribute balancing, generic quest architecture, travel-key migration, other Stakes modes, or pre-alpha breadth is implemented. Conversely, do not require `0.8.x` vertical-slice hardening criteria for `0.7.x` entry.

## Evidence Requirements

- Trace the accepted ordinary creator -> publication/load -> quest acceptance/access -> travel/activation -> four shifts -> restart -> durable duplicate path through current production owners.
- Reconfirm current typed command/result/event, campaign admission, persistence, projection, duplicate, correction/repair, and Normal defeat/recovery boundaries.
- Inspect the exact accepted representative tests and run only the executable checks necessary to validate current gate facts; this docs-first decision must not mutate tracked tests or production.
- Build one criterion-to-authority-to-evidence-to-gap matrix. Every criterion must be `satisfied`, `not_satisfied`, or `not_required_for_entry`, with exact sources.
- Separate accepted band-entry facts from later `0.8.x`, `0.9.x`, and `1.0.0` requirements.
- Apply at minimum `FP-001`, `FP-002`, `FP-008`, `FP-009`, `FP-013`, `FP-014`, and `FP-017` where relevant.

## Outcomes

### `BAND_ENTRY_READY`

Use only if every `0.7.x` entry criterion is satisfied with current accepted authority and no mandatory blocker remains. Record the exact evidence, keep later-band criteria deferred, and install a separate smallest coherent `Version 0.7.0 - <Short Name>` implementation prompt. Do not implement it in this decision.

### `BAND_ENTRY_NOT_READY`

Use if any mandatory criterion is incomplete. Record one numbered gap-to-owner-to-evidence-to-next-route matrix and install only the smallest current-band prerequisite or decision. Do not assign `0.7.0`.

## Coordination And Publication

Update current prompt/output/handoff, the milestone/readiness authority, historical register, planning reconciliation, branch register, and lower-precedence live headers needed to preserve one route. Preserve dated history. Commit only intended documentation, push `master`, fetch/prune, verify `HEAD == origin/master`, retrieve hosted prompt/output/handoff, and finish clean.

## Scope Exclusions

Do not modify production, shared contracts, schemas, serializers, migrations, tests, content, dependencies, assets, UI, or saves; implement quest turn-in/reward behavior; perform class/progression or attribute rebalance work; create generic quest/travel/activity infrastructure; migrate travel keys; add other Stakes modes; perform `0.8.x` slice hardening; mutate evidence/protected branches or PRs; or infer public-release readiness.
