# Codex Resource Budget And Execution Slicing Policy

Date: 2026-08-26

Status: durable repository workflow authority

Applies to: prompt preparation, Connector assistance, Codex implementation, Codex repair, independent acceptance audits, and any other repository-capable agent run where a constrained short-window quota, rate limit, expensive high-reasoning model, or materially limited execution pool is known or user-declared

## 1. Purpose

Lineage: Reforged should spend scarce repository-capable/high-reasoning execution on work that actually requires it.

When a capable Connector or other lower-cost repository-aware surface can safely perform inspection, reconciliation, documentation, source mapping, acceptance planning, branch/PR review, or product-question closure, that work should normally happen before Codex begins.

When Codex or another authenticated local-worktree agent is required, the prompt should be small enough to reach a useful durable checkpoint within the currently known short-window execution allowance whenever practical.

This policy does not lower implementation or acceptance standards. It changes where preparation happens and how large an executable package may be before it must be decomposed.

## 2. Authority Relationship

This policy supplements:

- `AGENTS.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/prompt-execution-platform-tool-selection-policy.md`;
- `docs/dev/gpt-connector-assistance-policy.md`;
- the current Codex prompt, handoff, output, branch policy/register, failure-pattern register, and focused authority for the active route.

A more specific active prompt may impose stricter independent verification, changed-path, validation, or publication requirements. This policy must not be used to weaken those requirements.

It may, however, require an oversized future prompt to be decomposed before execution when the same semantic capability can be delivered through bounded slices without violating atomicity or acceptance independence.

## 3. Fresh Resource Preflight

Before installing or recommending any Codex prompt, record the resource posture that is actually known at that time.

At minimum consider:

1. whether Codex/GPT Work or the selected repository-capable surface has a short-window rate or usage limit;
2. whether a separate weekly, monthly, credit, or product-pool limit also applies;
3. whether the recommended reasoning/model tier is materially more expensive than lighter supported tiers;
4. whether the current user explicitly wants to conserve a product pool;
5. whether the task can be decomposed without losing atomicity or independent acceptance value;
6. whether ChatGPT via GitHub Connector, Deep Research, regular ChatGPT, or another surface can safely remove preparation work first;
7. whether the previous Codex thread already paid a substantial orientation cost that should be preserved rather than repeated.

Do not invent quota numbers. Treat user-observed limits as current operating constraints until they are contradicted by fresh product evidence or the user says they changed.

## 4. Connector-First Preparation Gate

Before sending a nontrivial package to Codex, ChatGPT via GitHub Connector should perform every useful safe preparation step that does not require the local worktree or executable proof.

Depending on the route, prepare as much of the following as is useful:

- exact source head and recent-commit delta;
- current prompt/handoff/output and focused-authority reconciliation;
- exact changed-file or likely-edit-file inventory;
- production caller and owner map;
- schema/content/shared-contract ownership map;
- persistence, migration, publication, retry, restart, duplicate, conflict, correction, and repair owner map;
- test-file and validation-command inventory;
- known baseline failures/non-gates;
- branch/PR/evidence-ref inventory and dispositions;
- protected paths and scope exclusions;
- accepted IDs, counts, ordering, version facts, and compatibility invariants;
- expected before/after behavior matrix;
- acceptance criteria and adversarial cases;
- likely failure patterns from the permanent register;
- product/canon/UX/balance questions that repository evidence cannot answer;
- an exact Codex handoff identifying what Connector evidence is orientation aid versus what Codex must independently reproduce.

The Connector should not implement production code or claim executable validation merely to satisfy this gate.

## 5. Orientation Packet And Delta Verification

A current Connector-prepared orientation packet may satisfy the broad read-only inventory portion of repository orientation when all of the following are true:

1. it names an exact source commit;
2. it was produced from this repository only;
3. it identifies the current prompt/handoff/output and focused authority;
4. it inventories the material branches/PRs/evidence refs or explicitly records any bounded connector limitation;
5. it maps the relevant production callers, owners, changed paths, tests, and validation surface;
6. it clearly marks Connector claims as evidence rather than implementation/acceptance authority;
7. Codex begins from the same commit, or first reviews the complete delta between the packet head and its synchronized local head.

When those conditions hold, Codex should not spend a constrained high-reasoning window repeating broad repository discovery merely for duplication.

Codex still must independently verify locally:

- repository identity, synchronized HEAD/upstream, and clean/understood worktree;
- the current active prompt and any authority changed since the packet;
- the exact production files it will modify or audit;
- every material Connector claim on which implementation or acceptance depends;
- local callers, tests, build/typecheck/lint commands, generated/mirror posture, and runtime behavior required for the actual claim;
- any branch/PR/ref whose state changed since the packet;
- all executable proof required by the active prompt.

Independent acceptance audits remain independent. An orientation packet may reduce clerical discovery, but it cannot substitute for fresh adversarial execution or acceptance evidence.

## 6. Codex Package Size Classes

Every proposed Codex package should be classified before execution.

### `XS` — tiny atomic patch

Typical posture:

- one narrow defect or deterministic correction;
- usually 1-3 implementation files plus focused tests/mirrors when required;
- low discovery burden;
- clear local validation.

Normally suitable for one Codex run.

### `S` — one owner or one atomic behavior

Typical posture:

- one engine/service owner, adapter, schema behavior, migration edge, or acceptance concern;
- a bounded caller path;
- focused tests and a small adjacent regression set;
- one useful commit/checkpoint is expected.

Preferred Codex implementation unit.

### `M` — several coupled owners

Typical posture:

- multiple runtime owners, persistence plus caller integration, schema plus runtime behavior, or a broad acceptance matrix;
- material orientation and adversarial work;
- several logical checkpoints are visible.

Split into `S` slices by default. Keep whole only when a documented atomicity reason makes decomposition riskier than one run.

### `L` — cross-system package

Typical posture:

- schema/content/runtime/migration/UI/integration together;
- broad regression and publication work;
- several distinct implementation owners or substantial acceptance domains.

Must be decomposed before a constrained high-reasoning Codex run unless the user explicitly approves the cost and an accepted authority proves that one atomic run is necessary.

### `XL` — feature plus representative evidence plus acceptance/publication

Typical posture:

- end-to-end feature implementation, broad adversarial validation, representative-loop proof, publication, and/or independent acceptance in one prompt.

Do not install as one constrained Ultra/highest-reasoning execution prompt. Decompose into implementation/checkpoint slices and keep independent acceptance separate.

## 7. High-Reasoning / High-Cost Model Rule

The fact that the overall feature is difficult does not mean every slice requires the strongest available reasoning tier.

When the strongest/highest-cost tier is required or recommended:

- reduce scope further rather than expanding it;
- prefer `XS` or `S` packages;
- move reconnaissance and documentation to Connector work first;
- state the expected durable checkpoint;
- avoid broad subagent discovery that merely repeats an accepted Connector packet;
- reserve the strongest tier for owner conflicts, persistence/atomicity, complex migration, representative integration, or genuinely adversarial acceptance reasoning.

Use a lighter supported reasoning/model tier for deterministic bounded implementation or mechanical follow-up when quality and safety are preserved.

Do not split one atomic state transition across runs merely to save quota. When atomicity requires coupled changes, document that reason and keep the smallest coherent atomic package.

## 8. Checkpoint Requirement

Every nontrivial Codex prompt should name at least one durable checkpoint that can survive an interruption.

A checkpoint may be:

- a focused implementation commit with its tests green;
- one owner fully implemented with a clearly deferred next owner;
- a completed read-only audit result and durable finding matrix;
- a repair commit plus the exact failing/green focused gate;
- a finalized migration/schema step whose downstream consumer is intentionally deferred;
- a publication/coordination commit after implementation is already durable.

When current rate limits are known to be severe, prompts should be designed so the first meaningful checkpoint is reached early rather than after repository-wide analysis.

A prompt that cannot plausibly reach any useful checkpoint within one known short-window allowance should be decomposed before execution unless a documented atomicity or independent-audit requirement prevents it.

## 9. Internal Slices Do Not Require Version Inflation

One semantic primary/support version may be implemented through several internal execution slices.

Use descriptive internal labels such as:

- `Slice A - Authored/schema contract`;
- `Slice B - Runtime owner`;
- `Slice C - Caller/persistence integration`;
- `Slice D - Representative regression`;
- `Slice E - Publication`.

Internal slices do not independently become primary version numbers unless they materially add/close durable capability under the normal version policy.

The final semantic version disposition is recorded only when its accepted package requirements are satisfied.

## 10. Interruption And Resume Policy

When a Codex run stops because of quota/rate/resource exhaustion:

### If the worktree contains valid partial work

- preserve the same thread/worktree when possible;
- do not reset or restart automatically;
- on resume, first inspect HEAD, `git status`, staged/unstaged/untracked changes, and any commits made during the interrupted turn;
- identify the first incomplete requirement and continue from there;
- rerun only the validation necessary to establish the final result, while preserving required independent checks.

### If the worktree is clean and only orientation was completed

- prefer resuming the same thread if it retains substantive findings;
- do not repeat expensive broad orientation merely because the execution window reset;
- if context is lost and the agent would need to start discovery over, stop and return to Connector preparation/decomposition before spending another constrained high-reasoning window.

### Context-retention gate

When useful, ask the resumed agent to state from existing context—without commands—whether it retains the substantive findings needed to continue. If not, stop before it performs another large inspection pass.

## 11. Acceptance Audit Sizing

Independent acceptance remains mandatory where the repository requires it, but acceptance prompts should also be resource-aware.

Before Codex acceptance:

- Connector may prepare an exact implementation-diff inventory, authority-to-test matrix, branch/PR snapshot, expected probe list, baseline diagnostics, and changed-surface map;
- Codex must independently verify the material implementation claims and run fresh executable/adversarial evidence;
- the audit should focus high-reasoning effort on semantic correctness, failure boundaries, real callers, persistence, and independent probes rather than rediscovering known file locations;
- if one acceptance prompt spans several independently auditable domains and current limits make completion unlikely, use internal audit slices with one final primary-agent disposition only after all slices are complete and synchronized to the same accepted implementation head.

Never let Connector preparation prejudge `PARENT_ACCEPTED`, `REPAIR_REQUIRED`, representative acceptance, milestone entry, or any other outcome reserved to the independent audit.

## 12. Prompt Generation Requirements

For every nontrivial Codex prompt generated under a known constrained resource posture, the outside-prompt recommendation should additionally state:

- package size class (`XS`/`S`/`M`/`L`/`XL`);
- whether Connector-first preparation is complete;
- expected first durable checkpoint;
- whether the strongest reasoning tier is truly required for this slice;
- what work was deliberately moved out of Codex;
- interruption/resume instruction when material.

If the proposed package is `L` or `XL`, do not simply recommend Ultra/highest reasoning. First present a decomposition plan.

## 13. Connector Completion Standard Under Resource Constraints

When the user has authorized Connector-first work, ChatGPT should continue bounded Connector-safe passes until one of these stop conditions applies:

1. remaining work materially requires local execution or production mutation;
2. a product/canon/UX/balance decision is required from the user;
3. further Connector work would duplicate existing evidence without independent-verification value;
4. the next useful action is a sufficiently small Codex slice;
5. current active Codex work owns the same files/behavior and parallel modification would create conflict.

Higher back-and-forth is acceptable when it materially reduces expensive Codex rediscovery or package size.

## 14. Current Operating Lesson

The `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence` implementation demonstrated the cost risk of a large high-reasoning prompt under a restored short-window usage limit: the first constrained turn completed substantial orientation but reached the rate limit before repository mutation began.

That historical observation is evidence for this policy, not a permanent product-limit claim. Future routing must re-check current limits and capabilities.

The implementation later completed successfully, but future packages should use Connector-first evidence packets and smaller execution slices when the same result can be achieved without compromising atomicity, validation, or independent acceptance.
