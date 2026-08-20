# Ashen Reef Survey Offer, Journal Admission, And Travel-Access Authored-Canon Decision

Date: 2026-08-20

Label class: unversioned documentation-only authored-input decision

Milestone impact: `supports_current_band`

Execution posture: repository-first, docs-only, fail-closed on missing authored input

Accepted parent: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Parent acceptance authority: `950e851446fb75bfbdb717d0ea33e33ec2907d4a`

Reachability dependency decision: `NO_PACKAGE`

Starting representative classification: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`

## Objective

Obtain and record the smallest explicit authored-canon and owner decision needed to make the accepted Ashen Reef survey quest offer and travel access ordinarily reachable. Do not infer the answers from repository ambiguity.

Return exactly one outcome:

- `AUTHORED_INPUT_ACCEPTED` only if an authorized product/canon owner explicitly settles every required quest identity, offer, journal-admission, and travel-access fact;
- `AUTHORED_INPUT_REQUIRED` if any material answer is absent, ambiguous, internally conflicting, or not supplied by an authorized source.

Do not implement production, content, schemas, migrations, tracked tests, or UI in this decision. Do not install an implementation prompt directly.

## Starting Disposition

- parent `0.6.10`: `PARENT_ACCEPTED` through independent `0.6.10.5`;
- ordinary-reachability dependency decision: `NO_PACKAGE`;
- representative loop: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`;
- provisional `Version 0.6.11`: not authorized;
- quest acceptance/tracking, tracked-quest travel activation, survey advancement, accepted-only application, version-7 publication/restart, durable duplicate, correction/repair, and Normal defeat/recovery preservation: accepted downstream seams;
- missing authority: exact Ashen quest canon/offer/journal admission and exact Ashen known-location/travel-access grant;
- survey turn-in/rewards and geographic Knowledge/map proposals: excluded;
- `0.7.0`: `NOT_READY`.

## Authority And Orientation

Read `AGENTS.md` completely and follow the repository-first protocol, prompt-execution platform/tool policy, branch policy/register, and applicable failure-pattern register, especially `FP-001`, `FP-002`, `FP-008`, `FP-009`, `FP-011`, `FP-014`, and `FP-017`.

Read the complete current prompt, handoff, output, historical register, planning reconciliation, the permanent survey acceptance audit, and `docs/design/ashen-reef-survey-ordinary-reachability-and-representative-loop-dependency-closure-decision.md`. Reconcile the accepted quest definition/objective authority, quest acceptance/tracking authority, travel/location-recognition boundary, exact survey `no_proposal` contract, and current authored quest/location content.

Fetch/prune and synchronize clean `master`. Record the inspected base, starting head, documentation commit, pushed remote head, and post-fetch hosted head distinctly.

Use multi-agent work only for bounded, separable read-only inspection. The primary agent owns the authored-input classification and must reverify material claims against the synchronized checkout.

Inventory all local/remote branches and open pull requests. Preserve all registered evidence, superseded, and protected refs; no branch/PR mutation is authorized unless a fresh controlling lifecycle trigger proves it due.

## Fail-Closed Authored-Input Gate

Repository evidence is already exhausted and contains materially conflicting non-authoritative presentations:

- demo-only quest copy says Glasswater and Saltmere Harbor Office;
- runtime `location.ashen_reef` means Starfall Port / Starfall Isle;
- the only authored reef-survey definition is a distinct Brineharbor charter;
- generic frontier-survey offers have different generated identities and no session-journal bridge.

Do not choose among these sources, merge them, or treat any as an implicit product decision. If explicit authored answers are not already present in the run context or a newly accepted repository authority, ask the user concise product questions and stop with `AUTHORED_INPUT_REQUIRED`. Do not repeat source inspection as though it can answer missing canon.

## Required Authored Decisions

### 1. Canonical Quest And Place Identity

Obtain explicit answers for:

- whether exact `quest.ashen_reef_survey` remains the canonical quest id;
- whether current `location.ashen_reef` remains Starfall Port / Starfall Isle / `settlement.starfall_port`;
- canonical title, issuer, delivery surface, region/settlement context, summary, objectives, and non-turn-in offer copy;
- whether the Saltmere/Glasswater demo presentation is replaced, explicitly reconciled, or discarded;
- whether the distinct Brineharbor charter remains separate.

Do not author rewards or turn-in behavior in this run.

### 2. Availability And Eligibility

Obtain explicit answers for:

- the ordinary accepted occurrence that first makes the offer available;
- required campaign, location, progression, reputation, or other eligibility facts;
- one-time versus repeatable posture;
- offer retention, expiry, decline, and re-offer rules;
- whether availability is deterministic for the representative path and under which user choices.

### 3. Stable Offer And Journal Admission

Decide only after the authored facts are supplied:

- stable authored-definition and runtime offer-instance identities;
- the bounded owner that idempotently projects one `contracts` row into `sessionState.questJournal`;
- duplicate, stale, retry, and conflicting-offer behavior;
- whether existing quest acceptance owns only `contracts -> active/tracked`, as it does today;
- what evidence persists across version-7 publication/restart before acceptance.

Do not create a generic quest-offer framework.

### 4. Travel-Access Grant

Obtain an explicit selection for the accepted occurrence that creates known/travelable `location.ashen_reef`:

- offer presentation;
- quest acceptance; or
- a separate authored interaction.

Record the exact owner, source facts, row identity, idempotency, rejection, and persistence posture. Preserve the accepted separation among geographic Knowledge, Codex/map presentation, known-location state, and travel admission. Survey advancement must retain all nine exact `no_proposal` fields.

### 5. Downstream Reuse

Unless explicit authored direction contradicts current accepted authority, preserve:

- quest acceptance/tracking as consumers of an existing `contracts` row;
- travel admission as a consumer of an existing known-location row;
- the tracked-quest Ashen travel hook as the direct survey activity/operation activation boundary;
- no separate activity-record selection edge on the straight representative path;
- current survey command, caller, campaign admission, publication/restart, duplicate, correction, repair, and defeat/recovery behavior.

If an authored answer requires changing one of these settled seams, return `AUTHORED_INPUT_REQUIRED` and name the exact contradiction rather than broadening this decision.

## Required Output For `AUTHORED_INPUT_ACCEPTED`

Create or update one durable focused authored-canon decision that records:

1. every explicit user/author answer and its authority source;
2. accepted identities, copy boundaries, issuer/place context, eligibility, recurrence, and access occurrence;
3. rejected alternatives and why they are non-authoritative;
4. the bounded offer, journal-admission, and access owner graph;
5. stable identity, retry, duplicate, stale, conflict, atomicity, and persistence rules;
6. downstream seams preserved unchanged;
7. turn-in/reward, Knowledge/map, generic infrastructure, and band-entry exclusions;
8. the smallest unresolved implementation-package questions.

Then install a separate unversioned `Ashen Reef Survey Ordinary Reachability Implementation Package Decision`. Do not assign or activate `Version 0.6.11` yet, and do not install an implementation prompt.

## Required Output For `AUTHORED_INPUT_REQUIRED`

Record:

- each missing or contradictory authored answer;
- the exact repository evidence already exhausted;
- the unsafe inference prohibited;
- the concise user/product questions still requiring answers;
- confirmation that no implementation package, version label, content change, or test insertion was authorized.

Keep this authored-canon decision active. Do not route elsewhere merely because input is pending.

## Required Coordination And Publication

This run may change only documentation and removable temporary probes. Update current prompt/output/handoff, the focused reachability decision or a new authored-canon decision, repository-first Current Application, historical register, planning reconciliation, roadmap, sequenced plan, continuity brief, backlog, static program, failure-pattern register only if warranted, and branch register.

Commit only intended documentation and removable-probe cleanup, push `master`, fetch again, verify `HEAD == origin/master`, retrieve hosted prompt/output/handoff, inspect hosted status/check/workflow evidence, and finish with a clean worktree.

## Scope Exclusions

Do not implement quest offers, journal admission, known-location access, survey reachability, tracked tests, schemas, validators, serializers, migration, content records, UI, rewards, or turn-in; change survey balance or four-stage behavior; add geographic Knowledge, map, recognition, fog, generic discovery, or generic travel-access behavior; add generic quest/activity/effect/event/replay/correction infrastructure; add other Stakes modes, checkpoint/cloud/death/succession work; assign `0.6.11`; advance `0.7.0`; change dependencies, formats, assets, or generated output; or mutate/integrate/close/delete/rebase/force-update branches or pull requests.
