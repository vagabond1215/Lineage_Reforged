# Connector Preflight Plan - Version 0.6.11.1 Acceptance Audit

Date: 2026-08-26

Status: ACTIVE

Execution surface: ChatGPT via GitHub Connector, documentation-only/read-only repository inspection

Protected active route: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

## Purpose

Prepare an exact-head Connector orientation/evidence packet for the installed independent `0.6.11.1` audit so a constrained high-reasoning Codex run can spend its local execution window on material independent verification rather than repeating broad repository discovery.

The packet is evidence only. It must not prejudge `PARENT_ACCEPTED`, `REPAIR_REQUIRED`, `REPRESENTATIVE_LOOP_ACCEPTED`, or any `0.7.0` decision.

## Baseline

- implementation starting head: `f68242fae03b22001a73e3a440ccdbf830347aba`;
- Connector evidence correction: `b54ea65b6fddf029f4fb12ea82c5cdc9f8c1e62a`;
- implementation commit: `3ca23d6864541a899ea61a6bf26257665f754e78`;
- implementation coordination head: `b63fc13d9574b419a8ac934db454db035eeaa146`;
- preflight source head after resource-policy updates: `1a5048a052ca6441a2ba41035bc4f664da905d6b`;
- current prompt blob SHA: `064749af0435e839df71fe4619ccc30d7ce4ff35`.

## Outline

1. Prove the delta after the implementation coordination head is workflow documentation only.
2. Inventory the complete `0.6.11` changed-path surface and group it by audit domain.
3. Map each `0.6.11.1` prompt section to exact production files and tracked tests.
4. Record accepted IDs, record shapes, version facts, counts, ordering, and no-proposal expectations visible from current source/tests.
5. Record implementation-reported validation numbers only as baselines to reproduce, never as acceptance evidence.
6. Refresh branch/PR/evidence-ref posture and identify which facts can be delta-checked instead of broadly rediscovered.
7. Define independent removable probes Codex still must execute locally.
8. Map applicable failure-pattern concerns to the audit sections.
9. Produce one exact-head Connector evidence packet with explicit local-verification boundaries.
10. Verify the installed prompt is unchanged and the final Connector diff is documentation-only.

## Success Criteria

The pass succeeds only if:

- the packet names an exact current source head;
- the post-implementation delta is classified completely;
- every major `0.6.11.1` audit domain has a source/test map;
- branch and PR counts/status are refreshed;
- claimed test/build/lint/TypeScript baselines are clearly marked `TO_REPRODUCE`;
- no acceptance result is inferred;
- no production, schema, content, tracked test, prompt, handoff, output, branch, or PR mutation occurs;
- the current prompt blob remains `064749af0435e839df71fe4619ccc30d7ce4ff35`.

## Scope Exclusions

No production edits. No tracked-test edits. No temporary executable probes. No local test/build/typecheck claims. No change to the active prompt or audit outcome. No branch/PR lifecycle mutation. No `0.7.0` assignment.

## Expected Output

- `docs/dev/connector-preflight-0.6.11.1-acceptance-audit-evidence-packet.md`;
- completion appendix in this plan.
