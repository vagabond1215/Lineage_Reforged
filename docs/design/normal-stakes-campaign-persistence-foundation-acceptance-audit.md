# Normal Stakes Campaign Persistence Foundation Acceptance Audit

Date: 2026-07-30

Parent: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Label class: support suffix

Milestone impact: `supports_current_band`

Current status: `REPAIR_REQUIRED_AFTER_0.6.9.2`

## Decision

The `0.6.9` parent is not accepted.

`Version 0.6.9.2 - Normal Campaign Publication Recovery Repair` repaired the six findings recorded by `0.6.9.1` and added immutable playable-address verification. Its reported focused persistence suite passes 20/20, the prescribed group passes 127/127, and the RPG UI production build passes.

Later inspection of the real launcher and recovery flow found three additional parent-specific authority failures:

1. the real new-campaign retry regenerates character, campaign, and continuity identities after a post-head address failure;
2. a retained recovery can replace a newer valid same-slot address, while multiple same-slot recoveries have no accepted ordering authority;
3. the blocked recovery posture has no production-reachable, authority-valid completion owner.

The controlling post-repair audit is:

`docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`

The exact next repair is:

`Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`

The Ashen Reef survey receipt decision remains blocked until this repair is implemented and independently accepted.

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

`0.6.9.2` added bounded repairs for each item. The new findings are application-level retry, same-slot collision, and reachable validated completion gaps.

## Post-Repair Finding 1: New-Campaign Retry Regenerates Authority

The low-level recovery test retries `publishSave(...)` with the same prepared snapshot. The actual character-creation handler creates a new target snapshot on every user submission.

A new snapshot creates new character, campaign, and continuity identities. When address projection fails after head verification, the handler receives no returned publication and retains no prepared retry state. A second submission can create a second campaign rather than recover the first.

Required repair:

- one stable new-campaign attempt identity;
- retained normalized inputs, prepared snapshot, identities, target slot, consumer plans, and fingerprints;
- retry and restart reuse of the exact hidden verified publication;
- conflicting attempt reuse fails closed.

## Post-Repair Finding 2: Same-Slot Recovery Collision

Recovery records retain target slot ids and startup repair reprojects retained envelopes. An older hidden recovery can replace a newer valid address in the same slot.

Multiple recoveries targeting one slot must not be resolved by storage enumeration order.

Required repair:

- account-and-slot recovery inspection before new publication;
- compatible recovery resume;
- incompatible recovery block and diagnostic;
- deterministic quarantine or explicit bounded resolution for multiple recoveries;
- newer valid address preservation unless exact equivalence or accepted supersession evidence exists.

## Post-Repair Finding 3: Pending Recovery Completion Is Not Reachable

The engine exposes a bounded recovery mutation, but the production application only uses the pending check to block ordinary actions. It does not call the repair mutation.

The helper accepts any nonempty destination id instead of validating a known safe destination from authoritative world facts.

Required repair:

- one bounded production-reachable completion owner;
- authoritative destination derivation or validation;
- unknown and unsafe destination rejection;
- exactly-once campaign mutation admission using the retained pending receipt;
- clear shell state and diagnostic;
- duplicate completion returns the retained result.

## Required `0.6.9.3` Evidence

Add executable coverage for:

- the actual character-creation handler or extracted production coordinator under injected post-head address failure;
- retry and restart reusing the original character, campaign, continuity, artifact, publication, slot, and consumer plan;
- exactly-once active history, preparation, inheritance, achievements, and account value;
- older pending recovery versus newer valid same-slot address;
- multiple same-slot recoveries with deterministic fail-closed behavior independent of storage iteration order;
- compatible and incompatible pending recovery classification;
- production-reachable pending recovery completion using validated destination evidence;
- unknown or unsafe destination rejection;
- duplicate completion replay and conflicting evidence;
- preservation of every existing `0.6.9.2` test and build gate.

## Branch And PR Review

The latest completed repair reported one local branch, seventeen non-default remote branches, and PR #2 as the only open PR. Two protected references and twelve one-document audit branches were retained. No lifecycle action overlapped the persistence repair.

`0.6.9.3` must refresh these facts after fetch/prune and report all integration, closure, and retirement decisions.

## Next Run

`Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`
