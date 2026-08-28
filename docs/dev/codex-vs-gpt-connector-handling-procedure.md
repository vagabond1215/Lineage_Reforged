# Codex Versus GPT Connector Handling Procedure

Date: 2026-08-27

Status: durable repository workflow authority

Applies to: Lineage: Reforged repository work divided between ChatGPT via GitHub Connector and Codex or another authenticated local-worktree repository agent

Companion authorities:

- `AGENTS.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/gpt-connector-assistance-policy.md`;
- `docs/dev/codex-resource-budget-and-execution-slicing-policy.md`;
- `docs/dev/codex-connector-segmentation-and-independent-review-policy.md`;
- `docs/dev/prompt-execution-platform-tool-selection-policy.md`.

## 1. Purpose

Use GPT/Connector for repository work it can complete safely and cheaply, and reserve Codex for work that materially requires:

- the authenticated local worktree;
- production/source/schema/content/test mutation;
- executable commands, tests, lint, builds, generators, simulations, or browser/runtime probes;
- local branch/rebase/integration work;
- independent executable acceptance;
- final implementation or acceptance publication whose claims depend on local execution.

The purpose is not to minimize Codex usage at any cost. The purpose is to avoid spending scarce high-reasoning/local-execution capacity on repository archaeology, clerical reconciliation, documentation packaging, product ambiguity, or branch/PR inventory that GPT/Connector can resolve first.

When a short-window quota, rate limit, expensive reasoning tier, or user-declared resource constraint is active, higher GPT/Connector back-and-forth is explicitly acceptable when it materially reduces Codex rediscovery, package size, or interruption risk.

Do not encode a permanent product-limit number in repository authority. Treat currently observed resource limits as operating constraints until rechecked.

## 2. Core Ownership Rule

### GPT/Connector normally owns

- hosted `master`/commit/ref/PR inspection;
- current prompt/output/handoff and authority reconciliation;
- branch/PR/evidence-ref inventory and disposition preparation;
- focused source/caller/owner/test maps;
- changed-path inventories and implementation-delta summaries;
- stale/superseded documentation classification;
- documentation-only audits and narrow complete-file documentation repairs;
- prompt hardening and package decomposition;
- exact IDs/counts/order/version/compatibility expectation matrices;
- acceptance checklists and adversarial-probe plans;
- product/canon/UX/balance questions that must be settled before implementation;
- exact-head orientation/evidence packets;
- post-run claim-to-evidence review;
- handoff preparation.

### Codex normally owns

- local HEAD/upstream/worktree truth;
- implementation and executable repair;
- source/schema/content/test/migration/generated-output edits;
- local build/test/lint/typecheck/generator/simulation/browser execution;
- temporary executable probes;
- branch rebase/merge/conflict resolution requiring the checkout;
- deciding whether a local failure is new, baseline, environmental, or package-caused;
- run-specific executable evidence;
- independent acceptance decisions reserved by the active prompt;
- final substantive commit/push/publication verification.

Connector evidence may reduce Codex discovery but never substitutes for executable proof where executable proof is required.

## 3. Standard Execution Sequence

### Phase A — Live-head lock and active-route protection

Before Connector preparation:

1. verify hosted `master` head;
2. verify the active Codex prompt, current output, and current GPT handoff;
3. identify the exact active route and files it protects;
4. determine whether Codex is already actively editing the same surface;
5. avoid Connector writes that would invalidate or compete with an active Codex worktree.

If Codex is parked and the worktree is known clean, documentation-only preparation may proceed on hosted `master` when authorized.

### Phase B — Connector-first preparation

Run as many **bounded, useful** Connector passes as are needed to make the Codex slice execution-ready.

There is no arbitrary one-prepass ceiling when constrained high-reasoning/local execution makes additional preparation materially valuable.

Each pass must:

- answer one concrete repository question;
- name its exact source head;
- avoid production/test/schema/content mutation unless separately authorized under tiny-fix rules;
- avoid prejudging an independent acceptance result;
- reduce uncertainty, Codex discovery, package size, or future implementation risk;
- stop when its output no longer materially improves the next executable slice.

Typical sequence:

1. authority/current-state reconciliation;
2. source/caller/owner map;
3. compatibility/persistence/branch evidence map;
4. product-question closure;
5. test/adversarial matrix;
6. exact-head Codex orientation packet.

Several passes may be combined when small. Several separate passes are preferred when one giant audit would become difficult to verify or maintain.

### Phase C — Codex package classification

Before launch classify the proposed Codex work using:

- `XS` — tiny atomic patch;
- `S` — one owner/one atomic behavior;
- `M` — several coupled owners;
- `L` — cross-system package;
- `XL` — feature plus representative evidence/acceptance/publication.

Preferred implementation unit: `S`.

Under a known constrained high-reasoning window:

- `M` splits by default;
- `L`/`XL` must be decomposed unless documented atomicity or explicit user approval justifies one run;
- if the strongest/highest-cost reasoning tier is required, reduce scope further rather than assigning it more discovery.

Independent acceptance may remain broad when independence genuinely requires one final disposition, but its internal evidence gathering should be checkpointed into bounded audit slices.

### Phase D — Codex launch packet

Before Codex starts, provide or point it to an exact-head packet that states:

- source head;
- active prompt;
- relevant focused authorities;
- implementation delta or intended edit surface;
- source/caller/test map;
- accepted IDs/counts/order/version facts;
- branch/PR/evidence posture;
- known validation baselines and non-gates;
- required adversarial checks;
- scope exclusions;
- applicable failure-pattern IDs;
- what Connector has already established;
- what Codex must independently verify locally;
- expected first durable checkpoint;
- interruption/resume behavior.

The packet must be smaller than the discovery work it replaces.

Codex should verify packet freshness and material claims, not recreate the entire packet by default.

### Phase E — One coherent Codex local/executable slice

Once launched, avoid routine GPT/Connector ping-pong during the slice.

Codex should:

1. verify repository identity, synchronized HEAD/upstream, and worktree;
2. inspect the complete delta from the packet head if its local head differs;
3. independently inspect the exact production/test files relevant to the claim;
4. execute the assigned implementation/repair/audit slice;
5. run the required local evidence;
6. reach the named durable checkpoint as early as safely practical;
7. publish the run-specific output/handoff/coordination required by the active prompt.

Interrupt and return to GPT/Connector before normal completion only for:

- a product/canon/UX/balance question the repository cannot answer;
- scope-invalidating new evidence;
- an acceptance-critical defect;
- a capability/access problem;
- a resource interruption where repeating orientation would be wasteful;
- a newly discovered dependency large enough that the package should be re-sliced.

Do not return every minor observation as a separate handoff.

### Phase F — Connector post-run review

After Codex pushes a substantive implementation, repair, or decision, GPT/Connector should normally inspect the exact hosted commit.

Review:

- prompt/requirement compliance;
- changed-path and forbidden-scope compliance;
- source/test/claim consistency;
- output/handoff/prompt/routing consistency;
- branch/PR/ref posture;
- overclaims or missing evidence;
- whether another Codex run is actually necessary.

Batch findings into one disposition/follow-up rather than creating a chain of minor repairs.

## 4. Resource-Constrained High-Reasoning Rule

When the user reports that the recommended high-reasoning model can rapidly exhaust a short-window allowance:

1. treat that observation as an active planning constraint;
2. maximize safe Connector work before Codex;
3. avoid asking Codex to rediscover branch/PR/source-map/authority facts already captured at the exact head;
4. give Codex the smallest coherent mutation or acceptance slice;
5. make the first durable checkpoint explicit;
6. preserve the same Codex thread/worktree after a rate interruption when possible;
7. if an interrupted run has a clean worktree and lost its substantive orientation context, stop rather than pay to repeat broad discovery; return to Connector decomposition;
8. if partial valid work exists, preserve it and resume from the first incomplete requirement after inspecting status/diff/commits.

The highest-cost model is not automatically required for every slice of a difficult feature.

Use the strongest reasoning only where the slice actually needs it, such as:

- multi-owner semantic conflicts;
- persistence/idempotency/correction;
- complex migration;
- representative integration;
- adversarial independent acceptance.

Deterministic mechanical follow-up should use a lighter supported tier when quality and repository policy permit.

## 5. Independent Acceptance Boundary

Connector preparation may be extensive for an acceptance audit, but must not decide:

- `PARENT_ACCEPTED`;
- `REPAIR_REQUIRED`;
- representative-loop acceptance;
- maturity-band entry;
- any other outcome explicitly reserved for independent executable review.

Connector may provide:

- the exact implementation delta;
- authority-to-test matrix;
- branch/PR snapshot;
- expected identities/counts;
- probe matrix;
- known baselines;
- potential failure patterns.

Codex must still independently execute and assess the material acceptance evidence.

## 6. Documentation And Coordination Ownership

Connector may maintain durable workflow/docs when:

- the edit is complete and reviewable remotely;
- no local execution is needed to establish correctness;
- it does not compete with the active Codex edit surface.

Codex should not be used merely to:

- update a stale pointer already proven by Connector evidence;
- write a documentation-only audit;
- reconstruct branch/PR metadata;
- re-map exact source paths already captured in a current orientation packet;
- ask product questions that could have been resolved before launch.

Conversely, Connector must not write run-specific executable claims that only Codex can prove.

## 7. Stop Conditions For Connector-First Work

Stop opening additional Connector passes when any of the following is true:

1. the remaining task materially requires local execution or production mutation;
2. the next action is independent acceptance;
3. a product/canon/UX/balance decision is required;
4. the next Codex slice is already `XS` or `S` and sufficiently prepared;
5. another Connector pass would substantially duplicate existing evidence;
6. active Codex owns the same files/behavior;
7. additional preparation is likely to become stale before use.

At a stop condition, record the next owner and exact trigger.

## 8. New-Thread Handoff Standard

A GPT new-thread handoff should be concise but execution-complete. It must state:

- repository and hosted head;
- active prompt and route;
- latest implementation/acceptance state;
- current representative/milestone classification;
- Connector passes completed since the last Codex run;
- exact files/packets the next thread should read first;
- what must not be reopened;
- next Codex action and why it requires Codex;
- package size/resource posture;
- what the next GPT thread should do after Codex pushes.

Do not copy entire historical narratives into the handoff when stable authority files already contain them.

## 9. Anti-Ping-Pong Rule

The resource-aware policy permits **more Connector passes before Codex**, not arbitrary alternation during implementation.

Preferred rhythm:

`Connector preparation -> one bounded Codex slice -> Connector review -> next decision`

When another Connector pass is needed before the next Codex slice, do it before launch.

Mid-slice tool switching should be exceptional and blocker-driven.

## 10. Precedence

If this procedure conflicts with:

- a more specific active prompt;
- an accepted focused owner decision;
- independent-audit requirements;
- repository branch/persistence/version policy;

the more specific authority controls.

If an older workflow document says Codex should broadly rediscover work that a current exact-head Connector packet has already mapped, use the resource-aware repository-first delta-verification rule unless independent verification of that fact is itself material to the active claim.
