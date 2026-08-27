# Quest Turn-In And Reward Readiness Audit

Date: 2026-08-27

Status: `AUDIT_COMPLETE_OWNER_CONTRACT_READY_AFTER_PARENT_ACCEPTANCE_AND_AUTHORED_TERMS`

Execution surface: ChatGPT via GitHub Connector; documentation-only/read-only source audit

Source baseline: `a1829aaffdd549e2f941d479b0367a970ba6fe88`

Active route protected during audit: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

Historical evidence ref inspected read-only:

- branch: `parallel/quest-turn-in-reward-source-audit`;
- head: `470e8aca48510f68824f7a5aa8f603d0b13bbc1f`;
- disposition remains evidence-only / candidate integration by re-authoring when a named consumer exists.

## 1. Result

The repository is ready for a **future focused quest turn-in owner-contract decision**, but it is **not ready for Soundings payout implementation**.

Two gates remain before an implementation package can be authorized:

1. the independent `0.6.11.1` audit must first accept parent `0.6.11` and the representative creator-to-survey path, or any resulting repair must close first;
2. exact authored turn-in terms for **Soundings of Ashen Reef** must be supplied by product/canon authority.

The current hard-coded Ashen turn-in in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` is:

`LEGACY_BRIDGE_CHARACTERIZATION_ONLY`

It must **not** be promoted into current Soundings canon.

The recommended future architecture is a narrow engine-owned turn-in for one concrete quest before considering any generic reward framework.

## 2. Current Live Turn-In Surface

Current source still splits turn-in behavior across:

- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- `apps/rpg-ui/src/features/QuestsPanel.tsx`;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx` for generic campaign admission.

There is no dedicated game-engine turn-in module alongside the existing engine-owned quest acceptance and quest tracking commands.

### Supported quest ids

Exactly two current quest ids have hard-coded ready/turn-in behavior:

- `quest.ashen_reef_survey`;
- `quest.rivet_shortfall_relief`.

Every other quest id is not turn-in ready through this helper.

## 3. Work Completion Is Not Turn-In

The current Soundings representative path intentionally ends after the four survey shifts with:

- four accepted requests;
- four occurrences;
- four results;
- 48 survey consequence receipts;
- three sectors plus ruins confirmation;
- completed survey operation;
- return activity;
- quest still `active`;
- no turn-in;
- no payout;
- no currency delivery;
- no standing delivery;
- no inventory reward;
- no extra General Lore turn-in gain.

That state is **field-work completion**, not quest turn-in.

Future architecture must keep these states distinct:

1. **work/objective completion evidence** — the requested field work is complete;
2. **turn-in eligibility** — the player is in a valid state/place/context to submit it;
3. **turn-in command/request** — a specific player intent against a specific source revision;
4. **accepted turn-in occurrence/result** — the authority accepted that exact request;
5. **quest lifecycle completion** — the active quest becomes completed;
6. **consequence delivery** — each currency/item/standing/reputation/service/access/etc owner applies its authorized consequence;
7. **projection** — Chronicle, notifications and journal presentation reflect accepted authority.

A completed journal category cannot prove that rewards were delivered.

## 4. Current Legacy Readiness

### Ashen legacy readiness

The existing helper requires:

- matching journal row;
- category `active`;
- all three survey-sector flags;
- ruins-confirmed flag;
- current compatibility location `location.saltmere`.

That last condition belongs to the pre-Soundings compatibility path.

Current Soundings canon instead returns the player toward the **Starfall Harbormaster's Office** and deliberately does not implement turn-in.

Therefore the old Saltmere readiness rule is characterization only and cannot be used as the future Soundings admission rule.

### Rivet readiness

The existing Rivet path requires:

- matching active quest;
- secured-cargo flag;
- `location.saltmere`.

This remains useful evidence of the old helper's shape, not proof that flags are sufficient evidence for future item handoff.

## 5. Current Legacy Ashen Reward Branch

The old UI/game-shell helper still hard-codes an Ashen reward bundle including:

- +5 gold;
- +8 silver;
- General Lore +1 attempt through the skill-gating helper;
- `rep.harbor_office` / `Saltmere Harbor Office` standing +8;
- `survey_priority` and `harbor_access` tags;
- regional commercial fame +6 originating from `settlement.aurelis`;
- removal of the survey operation;
- `activity.harbor.turn_in`;
- a payout notification;
- a Saltmere-oriented Chronicle entry.

None of those values or Saltmere identities are current Soundings payout authority.

The current authored Soundings definition explicitly has:

- numeric reward values `null`;
- item rewards empty;
- unlocks empty;
- no reputation award;
- paid-civic-contract prose with exact turn-in terms deferred.

Disposition:

`DO_NOT_PROMOTE_LEGACY_ASHEN_REWARD_CONSTANTS`

The older `580 crown + salvage rights` presentation is likewise excluded by current canon.

## 6. Current Legacy Rivet Reward Branch

The Rivet turn-in currently demonstrates the breadth of affected owners:

- removes six `deepiron_rivet_crate`;
- grants currency;
- attempts Mineral Lore progression;
- grants standing;
- applies reputation;
- removes an operation;
- changes current activity;
- removes a quest flag;
- emits notification and Chronicle projections.

This is useful as a cross-owner source map.

It does not establish a durable receipt or generic reward architecture.

## 7. Current Result Contract

`turnInQuest(snapshot, questId)` returns the local generic `GameplayActionResult`:

- `snapshot`;
- `notice`.

It does not return a typed turn-in contract containing:

- `accepted`;
- stable rejection code;
- command id;
- expected/source revision;
- result id;
- turn-in occurrence id;
- consequence plan identity;
- reward receipt ids;
- duplicate/replay classification.

This is the largest structural difference from engine-owned acceptance/tracking.

## 8. Current Mutation And Admission Boundary

The helper itself:

1. checks readiness;
2. deep-clones the snapshot;
3. directly mutates quest state and all quest-specific consequences;
4. synchronizes the resulting snapshot;
5. returns it to UI.

`QuestsPanel` then calls:

`updateSnapshot(result.snapshot)`

without an explicit engine-result owner, command id or result id.

`GameSessionContext.updateSnapshot(...)` does pass the proposal through `admitCampaignMutation(...)`, but the default owner becomes:

`legacy_bridge`

and the mutation id is generated at that presentation boundary.

Therefore the current state is:

- generic campaign admission: **present**;
- quest-turn-in authority identity: **absent**;
- typed accepted turn-in result: **absent**;
- durable turn-in/reward receipt: **absent**.

Campaign admission does not substitute for quest-domain consequence receipts.

## 9. Accepted-Only UI Gap

Acceptance and quest tracking already use explicit engine results and update the session only when `result.accepted`.

Turn-in does not.

Current Turn In click behavior:

1. calls `turnInQuest(...)`;
2. unconditionally calls `updateSnapshot(result.snapshot)`;
3. unconditionally switches the panel to `completed`;
4. displays the notice.

For a rejection, the unchanged snapshot generally prevents campaign mutation acceptance, but the panel transition itself is still inferred from UI/button state rather than a typed accepted result.

Future requirement:

- apply turn-in state only when `accepted === true`;
- switch to completed presentation only when accepted;
- retain selection/current section on rejection;
- show typed rejection reason without inferring semantics from notice prose.

## 10. Current Duplicate Protection Is Insufficient

The current helper gets one useful local property from the journal:

- after successful completion, the quest is no longer `active`, so a later direct call rejects.

That is not a durable delivery receipt.

It cannot independently answer:

- whether every consequence was delivered;
- whether currency but not standing was applied;
- whether an item was consumed before interruption;
- whether a retry is the same intent;
- whether a duplicate request arrived after restart;
- whether a completed quest was imported without its reward consequences;
- whether a later unrelated mutation has occurred since the original result;
- whether a correction should compensate/supersede prior consequences.

Future turn-in must use stable request/result/consequence identities rather than treating `category: completed` as proof of exact delivery.

## 11. Existing Downstream Owners

### Quest lifecycle and tracking

Current owners:
- game-engine quest acceptance/tracking;
- session quest journal/tracked quest state;
- campaign admission.

Future turn-in should add an engine-owned command/result rather than direct UI mutation.

### Skill progression

Existing owner:
- player-engine `resolveSkillRankGainPolicy(...)` and current skill state.

A future turn-in may propose a skill consequence only if authored policy permits it. The progression owner must still apply its gate semantics.

For Soundings, **no turn-in skill gain is currently authorized**.

### Reputation

Existing owner:
- player-engine `applyReputationAward(...)`.

A future turn-in must not invent reputation simply because the legacy helper did so.

### Standing

Standing already exists in player state and has direct mutation helpers in legacy gameplay code, but no dedicated turn-in consequence receipt owner was found.

A future contract must either:
- define a bounded standing consequence application/receipt;
- or exclude standing for the first turn-in.

### Currency

Wallet state exists and legacy helpers mutate it directly.

No dedicated quest-turn-in currency command/receipt owner was found.

A future turn-in must make currency delivery explicit and replay-safe.

### Inventory / item transfer

Runtime player inventory owns bags/stacks/quantities.

Static item identity does not own runtime reward delivery.

No generic turn-in inventory reservation/consumption/delivery receipt exists.

A future item handoff must define exact inventory evidence and atomicity; a quest flag alone must not automatically stand in for physical item evidence unless a focused authority explicitly says so.

### Operations / activity / session flags

Current legacy turn-in directly mutates these session surfaces.

A future engine turn-in should name which are authoritative consequences and which are projections/derived state.

### Chronicle and notifications

These are presentation/projection surfaces.

They must reflect accepted turn-in authority but must not become transaction identity or reward-delivery proof.

### Access / service / membership / vouchers

Current quest architecture allows these as future consequence categories, but each requires a real downstream owner.

No generic static reward envelope can execute such grants by itself.

## 12. Consequence Ownership Matrix

| Consequence | Current legacy writer | Future ownership requirement | Soundings currently authorized? |
| --- | --- | --- | --- |
| quest completion | UI gameplay loop | engine quest turn-in result/receipt | lifecycle only after future turn-in |
| currency | UI helper | wallet consequence + durable receipt | amount not authored |
| skill gain | UI -> player progression helper | progression owner + turn-in receipt | no |
| standing | UI helper | standing owner/typed consequence | not authored |
| reputation | UI -> reputation helper | reputation owner + receipt | no |
| item consumption | UI helper for Rivet | inventory owner + exact evidence/receipt | no current Soundings item handoff |
| item reward | none for current Soundings | inventory owner + receipt | no |
| operation removal | UI helper | quest/activity consequence contract | future decision |
| activity transition | UI helper | activity/session consequence | future decision |
| access/service grant | no generic owner | named downstream owner | no |
| notification | UI helper | projection from accepted result | presentation only |
| Chronicle | UI helper | projection from accepted result | presentation only |
| tracked-quest fallback | direct UI/helper mutation | deterministic quest-tracking policy | undecided |

## 13. Required Future Identity Model

The smallest safe engine-owned turn-in should define at least:

### Request / command

- stable command id;
- player/campaign identity;
- quest runtime identity;
- source snapshot/artifact/revision;
- canonical normalized intent;
- exact request fingerprint.

### Plan

- current quest lifecycle;
- objective/work completion evidence;
- turn-in place/context;
- any item/cargo evidence;
- authored consequence specification version;
- deterministic proposed consequences;
- explicit non-proposals.

### Result

- accepted/rejected discriminator;
- stable reason code;
- result id;
- turn-in occurrence id;
- resulting quest lifecycle;
- consequence receipt ids;
- projection ids where useful;
- current/latest state on durable duplicate.

### Receipts

At minimum:
- quest completion receipt;
- one receipt per actual affected authoritative owner;
- projection receipts only where repair/restart semantics require them.

Do not create receipts for excluded consequence categories merely to fill a generic schema.

## 14. Required Failure And Retry Semantics

A future package must explicitly cover:

- missing quest;
- not active;
- objective work incomplete;
- wrong return location/context;
- wrong player/campaign;
- malformed command;
- stale source revision;
- incoherent quest evidence;
- missing required inventory evidence;
- consequence-owner rejection;
- campaign-admission failure;
- publication failure;
- restart before retry;
- exact equivalent retry;
- same request id with conflicting normalized intent;
- retry after later unrelated accepted mutation;
- partially present/conflicting retained receipt graph;
- projection repair if projections are repairable;
- correction/supersession policy if accepted consequences require later compensation.

Every rejection before durable acceptance must leave source state unchanged.

## 15. First Implementation Should Be Quest-Specific

The repository does **not** need a generic quest-reward framework before the first safe turn-in.

Recommended scope:

`ONE_QUEST_SPECIFIC_ENGINE_TURN_IN_OWNER`

Why:

- only two hard-coded legacy turn-ins currently exist;
- Soundings has a fully developed field-work evidence graph but intentionally deferred reward terms;
- a narrow first owner can establish request/result/receipt/persistence semantics without predicting every future Quest/Mission/Order/Favor consequence;
- a second or third materially different consumer can later justify reusable consequence infrastructure.

Do not build a universal reward DSL merely because several consequence categories are imaginable.

## 16. Soundings-Specific Gate

Before a Soundings implementation prompt is created, obtain authored answers for at least:

1. exact monetary payout, if any;
2. whether any standing change is contractual;
3. whether any public reputation/fame change occurs;
4. whether the field packet itself is represented as an inventory item, retained authority evidence only, or presentation;
5. whether any item reward exists;
6. whether any service/access/permit/introduction consequence exists;
7. exact return/turn-in context at the Starfall Harbormaster's Office;
8. whether the quest completes immediately upon accepted packet submission or has any further administrative step.

The repository already establishes that:
- this is a paid civic contract;
- the old Saltmere payout is not current authority;
- exact terms are deferred.

Do not infer the missing terms.

## 17. Tracked-Quest Fallback Question

The legacy helper automatically chooses the first remaining active quest after turn-in.

That array-order behavior should not automatically become durable architecture.

Future decision should choose one of:

- clear tracking only;
- deterministic fallback by an explicit quest-tracking policy;
- preserve current tracked quest if it refers to another still-active quest;
- ask/leave UI selection to the player.

This question does not block defining the core receipt model if the first implementation simply clears the completed quest's tracking safely.

## 18. Historical Evidence Branch

The preserved branch `parallel/quest-turn-in-reward-source-audit` at `470e8aca...` remains useful evidence because it captured the transition point where acceptance/tracking had become engine-owned while turn-in had not.

Current master independently confirms the material findings still hold.

Do not merge the branch wholesale.

Future named turn-in work may:
- cite it as historical evidence;
- re-author still-current findings against live master;
- retire it only under the branch lifecycle policy after equivalent preservation is proven.

## 19. Recommended Sequencing

### Gate A — finish current parent audit

Run `0.6.11.1`.

If:
- `PARENT_ACCEPTED` + representative accepted -> proceed to docs-first next-route decisions;
- `REPAIR_REQUIRED` -> repair parent first; do not open turn-in implementation in parallel.

### Gate B — authored Soundings turn-in terms

Use a user/product decision, not legacy constants.

### Gate C — focused owner-contract decision

Create an unversioned docs-first decision:

**Quest Turn-In Completion And Consequence Receipt Owner Contract Decision**

It should define the first quest-specific command/result/receipt boundary and explicitly reject unnecessary genericization.

### Gate D — small Codex implementation slice

Preferred resource class: `S` or bounded `M`.

Codex-only work should be limited to:
- new engine turn-in owner;
- exact affected runtime integration;
- focused tracked tests;
- accepted-only UI bridge;
- persistence/restart/duplicate probes.

Connector should prepare all source maps, exact files, expected identities, failure matrix, and product terms first.

### Gate E — independent acceptance

Run a separate production-read-only support audit if the turn-in changes durable reward authority.

## 20. Current Readiness Classification

`OWNER_CONTRACT_READY_AFTER_PARENT_ACCEPTANCE_AND_AUTHORED_TERMS`

Meaning:

- the technical source map is sufficiently clear;
- existing owners and missing identities are known;
- a generic framework is not required;
- implementation must still wait for current parent acceptance and exact authored consequence terms.

## 21. Safe Stop

This audit does not:
- change the active `0.6.11.1` route;
- authorize a payout;
- copy legacy Saltmere values into Soundings;
- mutate production, content, schema or tests;
- merge the evidence branch;
- assign a new primary version;
- claim `0.7.0` readiness.
