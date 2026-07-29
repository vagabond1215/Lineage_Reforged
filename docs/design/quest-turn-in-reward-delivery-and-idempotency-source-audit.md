# Quest Turn-In Reward Delivery And Idempotency Source Audit

Date: 2026-07-29

Source route: ChatGPT via GitHub Connector

Source commit: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Status: connector-only, read-only source audit; no quest, reward, engine, UI, save, content, schema, test, or roadmap change

## 1. Purpose

Characterize the current quest turn-in path before any engine-owned command, reward-delivery receipt, duplicate-protection, correction, or accepted-only UI transition is planned.

This pass is intentionally narrower than a future owner-contract decision. It records current behavior and missing authority only.

It does not include:

- quest acceptance;
- quest tracking;
- Ashen Reef survey advancement;
- generic quest action-tree execution;
- new reward types;
- balance changes;
- implementation authorization.

## 2. Live Entry Points

The live turn-in path is split across:

- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`
  - `isQuestReadyToTurnIn(...)`;
  - `getQuestCommandState(...)`;
  - `turnInQuest(...)`;
  - direct reward and projection helpers;
- `apps/rpg-ui/src/features/QuestsPanel.tsx`
  - button readiness;
  - direct call to `turnInQuest(...)`;
  - snapshot application;
  - section and panel-notice transitions.

No game-engine turn-in module exists alongside the accepted engine-owned travel, quest-acceptance, quest-tracking, and activity-selection packages.

## 3. Supported Turn-In Definitions

Only two hard-coded quest IDs have a ready-to-turn-in path:

1. `quest.ashen_reef_survey`;
2. `quest.rivet_shortfall_relief`.

All other quest IDs return not ready.

### Ashen Reef readiness

Requires:

- a matching quest journal entry;
- category `active`;
- three survey-sector flags;
- the ruins-confirmed flag;
- current location `location.saltmere`.

### Rivet shortfall readiness

Requires:

- a matching quest journal entry;
- category `active`;
- the secured-rivet-cargo flag;
- current location `location.saltmere`.

The readiness helper is deterministic and reads current snapshot facts. It is not a command plan and carries no revision, occurrence, eligibility receipt, or commitment identity.

## 4. Rejection Behavior

`turnInQuest(...)` rejects before cloning for:

- missing quest;
- quest not active;
- ready-to-turn-in check failing.

Each rejection returns:

- the original snapshot object;
- a warning notice.

No mutation occurs inside the function before those returns.

### Missing rejection contract

The result type is the generic local:

`GameplayActionResult`

with only:

- `snapshot`;
- `notice`.

It has no:

- `accepted` discriminator;
- stable reason code;
- command ID;
- expected snapshot revision;
- actual snapshot revision;
- wrong-player or malformed-command posture;
- stale-state result;
- duplicate-delivery result;
- retry equivalence result.

The notice title and prose are therefore the only human-readable rejection distinction.

## 5. Atomicity Posture

After eligibility passes, the function deep-clones the snapshot through serialize/deserialize and performs all mutations on the clone.

It returns only after:

- quest journal mutation;
- rewards and consumption;
- standing and reputation changes;
- operation removal;
- current-activity update;
- flag changes where applicable;
- notification and Chronicle projection;
- tracked-quest reassignment;
- snapshot synchronization.

This provides useful in-function clone-then-apply behavior.

However, it is not an accepted atomic multi-owner transaction because:

- no command/result boundary names the accepted occurrence;
- no owner accepts a typed proposal;
- no delivery receipt records which rewards were applied;
- no persisted transaction identity prevents reapplication;
- no correction or reconciliation contract exists.

The current implementation is atomically assembled by one UI-owned helper, not owner-certified through explicit consequence receipts.

## 6. Quest Completion Mutation

For any supported accepted turn-in, the matching journal entry changes from:

- category `active`;

to:

- category `completed`;
- status label `Turned in`.

This journal mutation is the practical duplicate guard during ordinary single-session use because a second call sees a non-active quest and rejects.

### Limit

The completed category is not a delivery receipt. It proves only the current journal state after mutation. It does not independently prove:

- which reward bundle was applied;
- whether every affected owner accepted it;
- whether item consumption occurred;
- whether a crash happened between consequences;
- whether an imported or corrected snapshot contains a completed quest without rewards;
- whether duplicate delivery occurred before completion state was persisted;
- whether a later correction should reverse or supersede rewards.

## 7. Ashen Reef Reward Bundle

Accepted Ashen Reef turn-in applies:

### Currency

- gold `+5`;
- silver `+8`.

### Skill progression

- attempts General Lore gain of `+1` through the existing breakthrough-gated helper;
- the helper may apply less than one rank gain when blocked by a progression gate.

### Standing

Adds or updates:

- ID `rep.harbor_office`;
- label `Saltmere Harbor Office`;
- score `+8`;
- unlock/effect tags `survey_priority`, `harbor_access`.

### Reputation

Applies the hard-coded award:

- fame axis;
- commercial branch;
- regional direct-earned scope;
- base value `6`;
- origin settlement `settlement.aurelis`;
- fixed meaningful/exposure/attribution/social-value evidence set to true;
- source ID equal to the quest ID;
- tick equal to the current snapshot tick.

### Operation and activity

- removes `operation.quest.ashen_reef_survey`;
- sets current activity to `activity.harbor.turn_in` with local display text.

### Notification and Chronicle

Adds:

- success notification `Survey payout received`;
- a reputation-category Chronicle entry;
- effect text for payout, skill result, Harbor Office standing, and regional fame.

### Boundary finding

The reward bundle is hard-coded in UI game-shell source rather than sourced from an accepted quest reward definition, typed reward proposal, or delivery contract.

## 8. Rivet Shortfall Reward Bundle

Accepted rivet turn-in applies:

### Inventory consumption

Removes quantity `6` of item key:

`deepiron_rivet_crate`

through a direct inventory helper.

The readiness check uses a secured-cargo flag rather than rechecking exact inventory quantity at turn-in admission.

### Currency

- gold `+4`;
- silver `+1`.

### Skill progression

- attempts Mineral Lore gain of `+1` through the breakthrough-gated helper.

### Standing

Adds or updates:

- ID `rep.guild_consortium`;
- label `Guild Consortium`;
- score `+6`;
- tags `priority_bids`, `drydock_discount`.

### Reputation

Applies the hard-coded award:

- fame axis;
- trade branch;
- local direct-earned scope;
- base value `4`;
- origin settlement `settlement.aurelis`;
- fixed qualification evidence set to true;
- source ID equal to the quest ID;
- current tick.

### Operation, activity, and flag

- removes `operation.quest.rivet_shortfall_relief`;
- sets current activity to `activity.drydock.turn_in`;
- removes the secured-cargo flag.

### Notification and Chronicle

Adds:

- success notification `Rivet contract paid`;
- trade-category Chronicle entry;
- effect text for payout, skill result, standing, and fame.

### Boundary finding

Inventory consumption and all rewards are coupled in one UI helper. No inventory reservation, consumption receipt, quest-completion receipt, or reward-delivery receipt exists.

## 9. Affected-Owner Matrix

| Consequence | Current direct writer | Proper owner or acceptance boundary | Current receipt |
| --- | --- | --- | --- |
| Quest completed state | UI gameplay loop | quest runtime/journal owner | none |
| Currency grant | UI gameplay loop | currency/wallet owner | none |
| Skill gain | UI gameplay loop calling progression helper | progression owner | helper result only, not persisted delivery receipt |
| Standing change | UI gameplay loop | standing owner | none |
| Reputation award | UI gameplay loop calling reputation helper | reputation owner | resulting state only |
| Rivet item consumption | UI gameplay loop | inventory owner | none |
| Operation removal | UI gameplay loop | operation owner | none |
| Current activity transition | UI gameplay loop | activity owner | none |
| Quest-specific flag removal | UI gameplay loop | quest/session fact owner | none |
| Notification | UI gameplay loop | presentation projection | no authority intended |
| Chronicle entry | UI gameplay loop | Chronicle projection owner | no authority intended |
| Tracked quest reassignment | UI gameplay loop | quest-tracking owner | direct mutation, bypasses accepted tracking command |
| Snapshot synchronization | game-engine helper invoked by UI loop | synchronization projection | no turn-in occurrence identity |

The turn-in path crosses more owners than the current deterministic survey advancement slice and additionally includes irreversible reward delivery and item consumption.

## 10. Tracked-Quest Boundary

After any accepted turn-in, the helper selects the first other active quest and directly assigns its ID to `sessionState.trackedQuestId`, or clears tracking when none remains.

This bypasses the accepted engine-owned quest-tracking command.

A future turn-in contract must decide whether:

- completion automatically clears only the completed quest;
- selecting a fallback tracked quest is an internal quest-owner consequence;
- fallback selection should use a deterministic policy;
- the accepted tracking owner should accept a proposal;
- no replacement should be selected automatically.

The current “first active quest” array-order rule is behavior to characterize, not automatically promote as durable design.

## 11. UI Application Boundary

`QuestsPanel.tsx` disables the Turn In button unless the current pre-click `questCommandState.canTurnIn` is true.

On click, it:

1. calls `turnInQuest(snapshot, selectedItem.id)`;
2. unconditionally calls `updateSnapshot(result.snapshot)`;
3. unconditionally changes the active section to `completed`;
4. shows the returned notice.

### Risk

There is no accepted discriminator. A stale, incoherent, or otherwise rejected call still causes the panel to switch to `completed`, even though the returned snapshot may be unchanged.

The disabled button makes this unlikely in a single synchronous render, but it is not an accepted-only bridge and would become unsafe under asynchronous command delivery, stale revisions, replay, or cross-tab state.

### Required later behavior

A future result must expose `accepted: true | false` and stable reason codes. The UI should:

- apply the returned snapshot only when accepted;
- switch to the completed section only when accepted;
- preserve selection and show a safe rejection notice otherwise;
- never infer acceptance from notice prose or resulting category inspection.

## 12. Identity And Idempotency Gaps

The current path has no stable identity for:

- command;
- eligibility plan;
- turn-in attempt;
- accepted occurrence;
- completion result;
- reward bundle;
- item-consumption delivery;
- currency delivery;
- skill progression delivery;
- standing delivery;
- reputation delivery;
- operation removal;
- tracked-quest consequence;
- aggregate consequence receipt.

Generic notification IDs and Chronicle IDs are tick/list-position projections and must not become transaction identity.

The quest ID alone is also insufficient because:

- a quest definition may be repeatable later;
- a corrected or reopened quest could have more than one lifecycle occurrence;
- imported snapshots may disagree across journal and reward owners;
- one quest can propose multiple owner-specific consequences.

## 13. Persistence And Restart

The current save snapshot can persist the post-turn-in facts:

- completed journal category;
- currency;
- skill state;
- standing;
- reputation;
- inventory quantity;
- operations;
- current activity;
- flags;
- notifications;
- Chronicle;
- tracked quest.

It does not persist a turn-in occurrence or reward-delivery receipt.

### Consequence

Ordinary save/load after successful completion preserves the final state, but the repository cannot prove or reconcile:

- partial delivery;
- repeated delivery from duplicate messages;
- equivalence of retries;
- correction of a malformed reward bundle;
- supersession of a quest result;
- replay from an accepted occurrence;
- whether current state was produced by the accepted turn-in path or manual/legacy mutation.

## 14. Correction And Rollback

No correction model exists.

A future owner contract must decide:

- whether accepted turn-in is terminal and append-only;
- whether corrections can supersede reward receipts;
- whether consumed items can be restored;
- whether currency, skill, standing, and reputation corrections are compensating consequences rather than state rollback;
- whether Chronicle emits a correction entry while preserving historical output;
- how a completed quest with missing or conflicting delivery receipts is reconciled;
- whether technical recovery may repair state without pretending the original event never occurred.

Do not implement direct snapshot rollback as the default correction model.

## 15. Definition Versus Runtime Authority

Current reward facts are source-code constants and branch logic. The quest journal entries display objectives and reward-facing summaries, but no accepted static reward bundle is proven to own these exact values as runtime inputs.

A future decision must classify each reward fact as one of:

- authored quest-definition authority;
- runtime rule;
- current-behavior compatibility constant;
- progression-owner policy;
- reputation-owner policy;
- UI prose only.

The owner contract should not silently migrate hard-coded UI constants into content without a separate content/schema decision.

## 16. Smallest Safe Next Pass

Recommended future route after the active survey owner decision:

`Quest Turn-In Completion And Reward Receipt Owner Contract Decision`

Classification:

`UNVERSIONED_PREREQUISITE`

The decision should define:

1. normalized turn-in intent and authoritative eligibility plan;
2. deterministic command identity and snapshot revision;
3. accepted/rejected result contract;
4. one turn-in occurrence identity;
5. quest-completion commitment;
6. owner-routed typed consequence proposals;
7. inventory consumption/admission semantics;
8. per-owner consequence receipts plus aggregate completion receipt;
9. duplicate, retry, replay, correction, and reconciliation policy;
10. persistence requirements;
11. accepted-only UI bridge;
12. exact later implementation paths and tests;
13. whether hard-coded reward values remain compatibility behavior or require a separate definition package.

## 17. Implementation Readiness

Result:

`OWNER_CONTRACT_PREREQUISITE_READY`

Implementation result:

`NO_PACKAGE`

The current path is deterministic and clone-then-apply, but the irreversible cross-owner consequences make direct extraction into an engine module unsafe without explicit receipt and persistence decisions.

## 18. Recommended Focused Tests For A Later Package

A later implementation prompt should require at minimum:

- accepted Ashen Reef parity;
- accepted rivet parity;
- exact reward values and owner receipts;
- skill-gate parity;
- inventory quantity and insufficient-cargo rejection;
- missing, inactive, wrong-location, incomplete, malformed, wrong-player, and stale rejection;
- zero mutation on every rejection;
- duplicate delivery does not duplicate any reward or consumption;
- equivalent retry returns the same accepted result/receipt;
- conflicting retry fails closed;
- completed quest cannot pay again;
- accepted-only UI snapshot and section transition;
- save/load persistence of occurrence and receipts;
- synchronization parity;
- direct UI turn-in mutation removed;
- accepted quest-tracking owner boundary preserved;
- notification and Chronicle remain projections.

## 19. User Direction Needed Later

Before reward definitions are promoted from compatibility constants, ask the user:

- whether quest rewards should remain authored fixed bundles or support contextual scaling;
- whether automatic fallback tracking should continue after turn-in;
- whether quest turn-in should be terminal, reversible through administrative correction, or support narrative reopening;
- whether item handoff must require exact physical cargo at admission even when a quest flag says it was secured;
- whether standing and reputation rewards are guaranteed contract terms or can be reduced by outcome quality in later quests.

These choices affect future system behavior and should not be inferred from the current two demo quests.

## 20. Final Disposition

The current turn-in implementation is a useful bounded compatibility path but not accepted runtime authority.

It should remain unchanged until the active Ashen Reef advancement decision completes and a separate turn-in owner-contract route is selected. The immediate value of this audit is to prevent a future extraction from treating journal completion as sufficient idempotency or treating a cloned UI helper as an owner-certified transaction.
