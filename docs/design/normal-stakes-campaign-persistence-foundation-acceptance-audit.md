# Normal Stakes Campaign Persistence Foundation Acceptance Audit

Date: 2026-07-30

Run: `Version 0.6.9.1 - Normal Stakes Campaign Persistence Foundation Acceptance Audit`

Parent: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Label class: support suffix

Milestone impact: `supports_current_band`

Status: `REPAIR_REQUIRED`

## Decision

The `0.6.9` parent is not accepted.

The prescribed 120-test regression group and the RPG UI production build pass, and the implemented package remains correctly bounded. Independent inspection nevertheless found four parent-specific persistence failures not covered by the landed suite. They affect recovery after partial publication, mandatory account repair, active legacy HP-zero repair, and stale-session closure. These are authority defects rather than documentation-only gaps, so the next run is exact support repair `0.6.9.2`.

No survey implementation or later-Stakes work is authorized while this repair remains open.

## Passing Evidence

- Starting and parent head: `ca707f5e13cd38632beb71274a3772722e1cf12f`.
- Parent range inspected: `fb9a2f9c2868d5789991e6d03401e8d8d609e47f..ca707f5e13cd38632beb71274a3772722e1cf12f`.
- The parent changes 42 files as one campaign/save/Normal-defeat/account-publication package.
- No dependency, generated-output, content-catalog, asset, survey, Committed/Ironbound, checkpoint, cloud, or generic command-framework change was found.
- Prescribed Node group: 120/120 passed.
- RPG UI production build: passed with 207 modules transformed; temporary output was removed.
- Bounded TypeScript audit reproduced the known 173-diagnostic repository backlog with zero diagnostics in the changed core persistence/session/account/lifecycle modules.
- Candidate write/readback failure and campaign-control write failure retain the prior verified head in the existing focused tests.
- Migration interruption reuses stable identities and retains source bytes in the existing focused tests.
- Normal defeat, first-mutation continuity, consumer-id conflict closure, and TypeScript/JavaScript mirror checks pass in the existing focused tests.

## Blocking Findings

### 1. Verified head publication can strand the caller before address projection

`publishSave(...)` writes and verifies the new campaign control before writing the playable slot address. If the later address write fails, the campaign head has already advanced, but the function throws before returning the verified publication or updated session control.

Consequences:

- UI does not report save success, but durable gameplay authority changed;
- the in-memory session remains based on the old head and becomes stale;
- new-game publication can become hidden without a playable address;
- the caller cannot create a publication-keyed repair receipt because it never receives the publication;
- retry does not have a decision-complete recovery path.

The repair must either complete/repair address projection after verified publication or persist enough stable pending projection evidence to recover the exact published artifact without rolling gameplay truth back.

### 2. Account-store failure can lose the mandatory repair receipt

New-game, ordinary-save, quick-save, and retirement catch paths attempt to write a pending consumer receipt back into the same account profile store after post-publication account work fails. If account persistence itself is the failing component, that second write can fail too; the code catches and discards that failure.

The campaign artifact/control contains no durable `account_repair_pending` plan from which startup can reconstruct the mandatory consumers. A verified campaign may therefore survive without the preparation, inheritance, retirement, or other publication consumer receipt required to repair and block duplicate value.

The repair must durably anchor the prepared consumer plan outside the failing account write, preserve stable publication-plus-kind ids and payload fingerprints, and prove restart/account-selection repair.

### 3. A legacy HP-zero slot can bypass same-slot repair after another slot migrates the group

Version-6 migration converts and projects every grouped slot but applies `unknown_or_legacy` defeat repair only to the slot that triggered migration. The other converted slots no longer pass through the version-6 migration path. A later `loadSaveWithAuthority(...)` of one of those version-7 HP-zero artifacts returns it without repair.

This contradicts the accepted same-slot rule: another slot should remain untouched until separately loaded, then receive exactly one persisted repair before play. The repair must preserve certified head/non-head posture: a repaired head may advance only its campaign head, while a repaired non-head must remain non-head.

### 4. A session does not fail closed when its campaign control disappears

The stale-head guard compares the session with live control only when `existingControl` is non-null. If the control is removed or becomes unreadable after session admission, `publishSave(...)` treats the campaign as having no prior head and publishes revision 1.

The repair must reject any session-owned publication when its certified campaign control is missing, invalid, closed, or mismatched.

## Required Repair Evidence

`0.6.9.2` must add focused executable tests that inject:

- address projection failure after verified campaign-control publication, followed by deterministic recovery;
- account profile persistence failure after publication, followed by durable pending-receipt discovery and idempotent restart repair;
- migration through one slot followed by separate HP-zero head and non-head loads;
- missing, invalid, closed, and mismatched campaign control for a live session.

It must also preserve the already-green candidate/control failure, migration interruption, ambiguity quarantine, first-mutation continuity, Normal defeat, retirement ordering, browser build, and mirror checks.

## Branch And PR Review

Codex fetched and pruned before the audit and reinspected all live refs.

- Local branches: only `master`.
- Non-default remote branches: 17.
- Open PRs: PR #2 only.
- No branch or PR overlaps the required persistence repair.
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE`; GitHub currently reports it non-mergeable.
- Both protected branches remain read-only.
- All twelve one-document audit branches remain retained for their named triggers.
- No merge, rebase, cherry-pick, PR closure, or branch deletion was due or performed.

## Next Run

`Version 0.6.9.2 - Normal Campaign Publication Recovery Repair`
