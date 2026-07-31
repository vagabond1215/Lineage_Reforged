# Normal Stakes Campaign Persistence Foundation Acceptance Audit

Date: 2026-07-31

Parent: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Label class: support suffix

Milestone impact: `supports_current_band`

Current status: `REPAIR_REQUIRED_AFTER_0.6.9.4`

## Decision

The `0.6.9` parent is not accepted.

`Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit` independently preserved the reported 23/23 focused tests, 130/130 prescribed tests, 209-module production build, and bounded TypeScript posture. It nevertheless proved all three post-commit audit targets fail:

1. more than one pending defeat receipt is accepted and the first receipt is repaired by array order while another remains pending;
2. a current-location `settlementId` backed only by a known non-settlement location is accepted as safe recovery authority;
3. completion appends no repair/correction authority-ledger provenance.

The required exact repair is:

`Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`

The Ashen Reef survey receipt decision remains blocked. Parent acceptance requires implementation of `0.6.9.5` followed by a separate independent audit.

`Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion` is implemented at `13b79279d07f6e1d06bf44b5b6ddba011694d57c` with reported local evidence of 23/23 focused persistence tests, 130/130 prescribed tests, a passing 209-module production build, and zero bounded TypeScript diagnostics naming changed production files. The implementation adds a durable production new-campaign attempt coordinator, account-and-slot recovery collision authority, and a reachable validated exactly-once pending-defeat repair owner.

This evidence did not accept the parent. Independent acceptance was assigned to:

`Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`

That audit preserved the implementation baseline but found the three additional blocking completion-authority defects recorded above.

`Version 0.6.9.2 - Normal Campaign Publication Recovery Repair` repaired the six findings recorded by `0.6.9.1` and added immutable playable-address verification. Its reported focused persistence suite passes 20/20, the prescribed group passes 127/127, and the RPG UI production build passes.

Later inspection of the real launcher and recovery flow found three additional parent-specific authority failures:

1. the real new-campaign retry regenerated character, campaign, and continuity identities after a post-head address failure;
2. a retained recovery could replace a newer valid same-slot address, while multiple same-slot recoveries had no accepted ordering authority;
3. the blocked recovery posture had no production-reachable, authority-valid completion owner.

The controlling post-repair audit is:

`docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`

The completed support implementation is:

`Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`

The completed independent route was:

`Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`

The active repair route is:

`Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`

The Ashen Reef survey receipt decision remains blocked until the repair is independently accepted.

## Accepted `0.6.9.2` Evidence To Preserve

- durable publication recovery evidence before campaign-head and address transitions;
- same-prepared-snapshot low-level retry without advancing the head;
- immutable artifact verification for playable addresses and recovery;
- durable account-consumer plans outside account storage;
- terminal consumer cleanup ordering;
- separately loaded migrated zero-resource head and non-head repair;
- missing, invalid, closed, stale, changed, and wrong-artifact campaign-control rejection;
- ordinary mutation and publication blocking under the pending recovery posture;
- retained duplicate mutation snapshot/control/result correlation;
- conflicting mutation-id rejection;
- focused persistence suite: 20/20;
- prescribed Node group: 127/127;
- RPG UI production build: passed with 207 modules transformed;
- bounded TypeScript audit: known 173-diagnostic repository baseline with no diagnostic in a changed repair file;
- `git diff --check`: passed.

No hosted GitHub Actions run or commit status was attached to the repair commit; these are local Codex results.

## Original Findings Closed By `0.6.9.2`

The six original findings remain historical evidence:

1. post-head address projection failure lacked deterministic recovery;
2. account-store failure could lose mandatory consumer repair evidence;
3. a separately loaded migrated zero-resource slot could bypass repair;
4. session publication did not fail closed when campaign control disappeared;
5. pending recovery did not block ordinary mutation and publication;
6. duplicate mutation delivery did not return the retained accepted result.

`0.6.9.2` added bounded repairs for each item. The later findings are application-level retry, same-slot collision, and reachable validated completion gaps.

## Post-Repair Finding 1: New-Campaign Retry Regenerated Authority

The low-level recovery test retried `publishSave(...)` with the same prepared snapshot. The actual character-creation handler created a new target snapshot on every user submission.

A new snapshot created new character, campaign, and continuity identities. When address projection failed after head verification, the handler received no returned publication and retained no prepared retry state. A second submission could create a second campaign rather than recover the first.

Required closure:

- one stable new-campaign attempt identity;
- retained normalized inputs, prepared snapshot, identities, target slot, consumer plans, and fingerprints;
- retry and restart reuse of the exact hidden verified publication;
- conflicting attempt reuse fails closed.

`0.6.9.3` reported this closure; `0.6.9.4` independently reproduced it successfully.

## Post-Repair Finding 2: Same-Slot Recovery Collision

Recovery records retain target slot ids and startup repair reprojects retained envelopes. An older hidden recovery could replace a newer valid address in the same slot.

Multiple recoveries targeting one slot must not be resolved by storage enumeration order.

Required closure:

- account-and-slot recovery inspection before new publication;
- compatible recovery resume;
- incompatible recovery block and diagnostic;
- deterministic quarantine or explicit bounded resolution for multiple recoveries;
- newer valid address preservation unless exact equivalence or accepted supersession evidence exists.

`0.6.9.3` reported this closure; `0.6.9.4` independently reproduced it successfully.

## Post-Repair Finding 3: Pending Recovery Completion Was Not Reachable

The engine exposed a bounded recovery mutation, but the production application only used the pending check to block ordinary actions. It did not call the repair mutation.

The helper accepted any nonempty destination id instead of validating a known safe destination from authoritative world facts.

Required closure:

- one bounded production-reachable completion owner;
- authoritative destination derivation or validation;
- unknown and unsafe destination rejection;
- exactly-once campaign mutation admission using the retained pending receipt;
- clear shell state and diagnostic;
- duplicate completion returns the retained result.

`0.6.9.3` reported the reachable owner; `0.6.9.4` confirmed reachability but proved its multiple-receipt, current-location, and ledger validation incomplete.

## Post-Commit Audit Targets Decided By `0.6.9.4`

Connector inspection of the committed implementation identified three additional boundaries requiring explicit independent evidence before acceptance:

1. more than one pending defeat receipt must fail closed rather than selecting the first receipt by array order;
2. a malformed or non-settlement current-location `settlementId` must not become safe recovery authority merely because it is nonempty;
3. recovery completion must have an exactly-once accepted provenance trail, including the retained receipt and the authority ledger or accepted correction mechanism.

The audit must also prove HP, Stamina, recovery ticks, relocation, Chronicle, notification, and session revision occur exactly once across initial pending resolution plus completion.

Fresh executable evidence decided all three as blocking violations. The audit constructed multiple pending receipts, a current-location ruin masquerading through `settlementId`, and a valid repair whose ledger remained unchanged. No target is waived or deferred.

## Required `0.6.9.5` Repair And Successor Evidence

The repair and its independent successor audit must cover:

- the actual character-creation handler or extracted production coordinator under injected post-head address failure;
- retry and restart reusing the original character, campaign, continuity, artifact, publication, slot, and consumer plan;
- exactly-once active history, preparation, inheritance, achievements, and account value;
- older pending recovery versus newer valid same-slot address;
- multiple same-slot recoveries with deterministic fail-closed behavior independent of storage iteration order;
- compatible and incompatible pending recovery classification;
- production-reachable pending recovery completion using validated destination evidence;
- unknown, unsafe, malformed, and conflicting destination rejection, including malformed current-location settlement authority;
- multiple pending defeat receipts failing closed;
- repair provenance and ledger/correction evidence exactly once;
- all resource, time, relocation, projection, and session effects exactly once across pending resolution and completion;
- duplicate completion replay and conflicting evidence;
- preservation of every existing `0.6.9.2` and `0.6.9.3` test and build gate.

The repair must also prove multiple-pending rejection is order-independent and side-effect-free, current-location authority requires exact known settlement evidence, the original defeat ledger entry is preserved, and exactly one deterministic superseding repair entry is appended.

## Branch And PR Review

The completed `0.6.9.3` run reported one local branch, seventeen non-default remote branches, and PR #2 as the only open PR. Two protected references and twelve one-document audit branches were retained. No lifecycle action overlapped the persistence repair.

`0.6.9.4` refreshed these facts after fetch/prune: one local branch, seventeen non-default remote branches, and PR #2 as the only open PR. No disposition or lifecycle action changed. `0.6.9.5` must refresh them again before implementation.

## Next Run

`Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`
