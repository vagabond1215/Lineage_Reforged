# Rest And Recovery UI Mutation Source Audit

Date: 2026-07-29

Source route: ChatGPT via GitHub Connector

Source commit: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Status: connector-only, read-only source audit; no rest, body, resource, health, care, economy, service, UI, engine, save, test, content, or roadmap change

## 1. Purpose

Characterize the current settlement-rest path before any engine-owned rest command, service/access model, recovery result, health reconciliation, persistence receipt, or accepted-only UI flow is planned.

This audit separates:

- current deterministic compatibility behavior;
- metabolic recovery;
- combat-resource restoration;
- care and injury recovery;
- location versus service availability;
- preview versus execution facts;
- presentation versus authority.

It does not authorize a rest implementation package or balance change.

## 2. Live Entry Points

The current rest path is owned by UI game-shell code:

- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`
  - `previewRestAtCurrentSettlement(...)`;
  - `restAtCurrentSettlement(...)`;
  - hard-coded recovery context;
  - clock, body, resource, currency, activity, notification, Chronicle, and synchronization mutation;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`
  - computes preview;
  - optionally asks for risk confirmation;
  - directly invokes rest;
  - unconditionally applies the returned snapshot;
  - shows the returned notice.

No dedicated engine-owned rest command/result module exists.

## 3. Hard-Coded Recovery Context

The UI gameplay loop defines:

`SETTLEMENT_REST_RECOVERY`

with:

- one sleep unit;
- `secure_indoor` camp tier;
- `secure` safety tier;
- meal support `1`;
- water support `1`.

This context is supplied automatically for any admitted rest.

### Boundary finding

The current path does not prove:

- an inn, home, camp, temple, guildhall, barracks, or other provider exists;
- the player has access or admission;
- a bed is available;
- food or water is actually supplied;
- a service record offers lodging;
- local law, danger, siege, weather, capacity, or time permits rest;
- a specific recovery quality was purchased.

Current location presence is being used as a compatibility shortcut for a complete secure-rest package.

## 4. Preview Behavior

`previewRestAtCurrentSettlement(...)`:

1. reads the current location ID;
2. rejects when no location ID exists;
3. clones the snapshot;
4. tests whether four silver can be spent on the clone;
5. if affordable, previews four ticks of clock/body advancement on the original snapshot using the secure settlement recovery context;
6. returns only a body-state preview shape.

### Preview outputs

- available;
- optional reason;
- tick count;
- projected body state;
- body-state timeline.

### Preview omissions

The preview does not expose:

- silver `-4` as an accepted material fact;
- HP restored to maximum;
- MP restored to maximum;
- stamina restored to maximum;
- pending resource changes cleared;
- `lastRestAtTick` update;
- current activity replacement;
- notification;
- Chronicle entry;
- synchronization consequences;
- provider or service identity;
- a stable plan identity.

### Preview/execution location mismatch

Preview checks only whether a current location ID exists.

Execution additionally requires that the location resolve through `getPlayerTravelDestinationFacts(...)`.

A snapshot with a non-null but unsupported location ID can therefore preview as available and execute as unavailable.

Result:

`PREVIEW_EXECUTION_MATERIAL_FACT_MISMATCH`

## 5. Execution Admission

`restAtCurrentSettlement(...)` rejects when:

- there is no current location ID;
- the location ID does not resolve to current destination facts;
- the cloned snapshot cannot spend four silver.

Rejection returns:

- the original snapshot;
- warning notice prose.

### Missing admission facts

There is no explicit check for:

- settlement type;
- lodging service;
- provider;
- room or bed availability;
- access or admission;
- safety state;
- active threat;
- current encounter;
- care need;
- inability to sleep;
- current activity interruption;
- party members;
- supplies;
- consent or policy;
- save/checkpoint consequences.

The execution helper admits rest based on a recognized location and sufficient silver only.

## 6. Accepted Compatibility Consequences

After cloning and spending four silver, the helper:

1. advances four ticks;
2. advances body state each tick under the secure recovery context;
3. performs recovery-time stat-growth conversion at the final step through the current player-engine helper;
4. synchronizes player runtime state each tick;
5. restores HP to maximum;
6. restores MP to maximum;
7. restores stamina to maximum;
8. clears all pending resource changes;
9. sets `lastRestAtTick` to the current tick;
10. replaces current activity with `activity.rest`;
11. adds a success notification;
12. adds a Chronicle entry;
13. synchronizes the gameplay snapshot;
14. returns success notice prose.

The function uses clone-then-apply behavior, which prevents mutation of the caller snapshot during ordinary rejection.

It is still a UI-owned multi-domain transaction without an accepted command/result or consequence-receipt contract.

## 7. Affected-Owner Matrix

| Consequence | Current writer | Current fact owner | Missing future boundary |
| --- | --- | --- | --- |
| Four-silver spend | UI gameplay loop | wallet/currency state | transaction admission and receipt |
| Four ticks | UI gameplay loop via clock helper | clock/time owner | rest occurrence and accepted duration result |
| Metabolic recovery | UI loop via player engine | body-state owner | accepted recovery context and result |
| Stat-growth conversion | UI loop via player engine | progression owner | proposal/application receipt and duplicate protection |
| HP to maximum | UI gameplay loop | combat resource owner | accepted rest-resource proposal and health separation |
| MP to maximum | UI gameplay loop | resource owner | accepted proposal/receipt |
| Stamina to maximum | UI gameplay loop | resource owner | accepted proposal/receipt |
| Pending resource changes cleared | UI gameplay loop | resource runtime owner | exact meaning and safe reconciliation |
| Last-rest tick | UI gameplay loop | save/player metadata | occurrence identity versus convenience timestamp |
| Current activity replaced | UI gameplay loop | activity owner | accepted transition or projection posture |
| Notification | UI gameplay loop | presentation | accepted-result projection only |
| Chronicle | UI gameplay loop | Chronicle presentation/history | accepted-result projection only |
| Snapshot synchronization | engine helper called by UI | synchronization projection | occurrence/result/receipt persistence |

## 8. Currency And Service Boundary

The cost is hard-coded:

- four silver;
- described as board, food, and a secure bunk.

No authored service identity, provider, local price, settlement availability, access rule, stock/capacity, transaction record, or economy policy supplies this amount.

The current `civilization.services` authority is provider-independent static vocabulary and does not execute lodging or prove local availability.

A future rest contract must not infer service access from:

- settlement identity;
- a lodging service existing somewhere in the catalog;
- a building/workplace tag;
- Chronicle or UI prose;
- available currency alone.

A minimal future rest admission needs either:

- an explicitly accepted compatibility lodging offer; or
- a destination/provider availability result owned by the applicable settlement/service/institution domain.

## 9. Body-State Recovery Boundary

The current body-state engine owns metabolic facts such as:

- energy;
- protein;
- hydration;
- fatigue;
- intoxication;
- starvation load;
- recovery effectiveness.

A secure rest context is a legitimate input to metabolic recovery when accepted by an applicable owner.

It does not prove:

- consciousness restoration;
- mobility restoration;
- injury healing;
- lethal-process stabilization;
- treatment;
- anatomical restoration;
- resurrection;
- safe discharge from Mortal Crisis.

The current rest path should be described as metabolic and combat-resource compatibility recovery, not universal health recovery.

## 10. HP Restoration And Health Boundary

The helper restores HP directly to maximum regardless of:

- HP deficit source;
- combat defeat;
- injuries;
- lethal processes;
- care requirements;
- active crisis;
- actual death or restoration eligibility.

Current live health owners for injuries and lethal processes are not yet implemented, so the helper cannot currently erase those states. However, preserving this direct full-HP rule unchanged into a future health-enabled runtime could create a false recovery shortcut.

Accepted design requires:

- HP remain a combat/resource fact;
- injury remain separately owned;
- lethal processes remain separately owned;
- stabilization differ from treatment and recovery;
- actual death differ from HP zero;
- rest not become implicit care, cure, restoration, or resurrection.

A future rest result may restore some or all combat HP only when the combat-resource owner accepts the rule. UI and player-facing wording must not claim that wounds, bleeding, breathing distress, burns, poisoning, or other causal conditions are resolved merely because HP is full.

## 11. MP And Stamina Restoration

Full MP and stamina restoration are current compatibility behavior.

A future rule must decide whether restoration is:

- always full;
- recovery-context dependent;
- duration dependent;
- affected by body state;
- affected by environment, safety, food, water, or interruption;
- limited by magical strain or other owner facts;
- balance-scaled by run difficulty.

Do not infer these decisions from the current hard-coded full restore.

## 12. Pending Resource Changes

The helper sets:

`playerState.resourceRuntime.pendingChanges = []`

This is broad.

The audit could not prove from this call site whether every pending resource change is intended to settle or expire through rest.

Potential risks include discarding:

- delayed costs;
- deferred regeneration;
- scheduled drains;
- owner-specific pending effects;
- compatibility changes unrelated to rest.

This is not safe to change through the connector because the full pending-change contract and tests require local inspection.

A future owner decision must classify each pending-change family and decide whether rest:

- applies it first;
- cancels it;
- preserves it;
- supersedes it through an accepted resource result;
- rejects while incompatible changes remain.

## 13. Current-Activity Boundary

After rest completes, current activity becomes:

- ID `activity.rest`;
- label `Resting In <location>`;
- category `Recovery`;
- detail saying resources, nerves, and field notes are being restored.

This state is set after the four-tick rest has already completed and the success notification has been produced.

### Ambiguity

The snapshot therefore records “Resting” as current activity after rest completion rather than:

- no current activity;
- resumed prior activity;
- a completed rest record;
- a post-rest idle state.

A future decision should classify whether this is:

- a compatibility display placeholder;
- a durable current-activity transition;
- a projection that should not be persisted;
- a completed occurrence summary.

Do not promote the current label/detail as authoritative lifecycle semantics.

## 14. Notification And Chronicle Boundary

The rest path projects:

- notification `Rest complete`;
- Chronicle statement that a bunk, meal, and dry roof restored reserves;
- effect lines for silver and full resources;
- final notice `Recovered`.

These are presentation outputs.

They currently overstate admitted facts because the path does not prove an actual bunk, meal provider, water source, or care context beyond the hard-coded recovery object.

Future prose should be generated only from accepted result and receipt facts.

When health systems exist, player-facing text must remain plain and in-world while avoiding the claim that all causal health problems are gone.

## 15. Persistence And Replay

The resulting snapshot can persist:

- reduced currency;
- advanced clock;
- body state;
- resource maxima;
- cleared pending changes;
- last-rest tick;
- current activity;
- notification;
- Chronicle;
- synchronized projections.

It does not persist:

- rest command ID;
- plan ID;
- lodging/service offer;
- access/admission result;
- payment transaction receipt;
- rest occurrence;
- recovery result;
- owner-specific consequence receipts;
- interruption history;
- duplicate/retry status;
- correction lineage.

`lastRestAtTick` is a convenience fact and cannot serve as occurrence, transaction, or replay identity.

A duplicate invocation after an accepted rest can spend another four silver and repeat the full restoration. That may be a valid new rest only if it is admitted as a new occurrence. The current helper has no command identity to distinguish deliberate repetition from duplicate delivery.

## 16. UI Boundary

`ActivityPanel.tsx`:

- computes a body-state preview;
- uses risk-tier confirmation when the presentation marks the preview risky;
- invokes `restAtCurrentSettlement(...)`;
- unconditionally applies `result.snapshot`;
- shows the notice.

The generic result has no `accepted` discriminator.

On ordinary rejection, the original snapshot is returned, so unconditional application is mostly harmless in the current synchronous flow. It is still not an accepted-only bridge and would be unsafe for stale commands, asynchronous delivery, duplicate handling, or partial results.

A future result must provide:

- accepted/rejected discriminator;
- stable reason code;
- command and revision identity;
- exact applied result/receipts when accepted;
- no snapshot application on rejection.

## 17. Risk Confirmation Boundary

The UI asks for confirmation only when the projected body-state outcome is classified as risky.

Rest normally improves body state, so confirmation is unlikely to gate:

- spending four silver;
- interrupting an activity;
- changing time by four ticks;
- clearing pending resource changes;
- losing a time-sensitive opportunity;
- becoming vulnerable to an event;
- saving/checkpoint consequences.

Risk confirmation currently reflects only the body-state projection, not all material rest consequences.

A future plan should expose accepted material facts and identify which consequences warrant confirmation.

## 18. Safe Bug-Fix Assessment

The preview/execution location mismatch and incomplete preview are concrete.

They are not safe connector fixes because:

- the active route is already deciding save identity/publication for survey advancement;
- rest ownership remains blocked by health/care and service/access decisions;
- changing preview behavior may require new result types and local tests;
- exact settlement/location support needs engine and content inspection;
- full-resource restoration and pending-change semantics are not accepted target behavior.

Result:

`DEFECTS_CONFIRMED_CODE_FIX_DEFERRED_TO_OWNER_DECISION`

## 19. Smallest Safe Next Pass

Recommended route only after the active survey/save-identity chain is accepted:

`Rest, Lodging, Recovery, And Health Boundary Owner Contract Decision`

Classification:

`UNVERSIONED_PREREQUISITE`

It must decide:

1. exact rest intent and duration;
2. destination/provider offer and availability;
3. access, admission, cost, and transaction receipt;
4. shared preview/execution material-fact plan;
5. command, occurrence, result, and receipt identities;
6. clock and interruption behavior;
7. body-state recovery proposal;
8. HP/MP/stamina restoration rules;
9. pending resource-change posture;
10. activity interruption/resumption;
11. injury, lethal-process, care, crisis, actual-death, and restoration boundaries;
12. persistence, duplicate, replay, correction, and reconciliation;
13. accepted-only UI and safe player-facing wording;
14. exact later implementation paths and tests;
15. whether current four-silver/full-resource behavior is preserved as compatibility or intentionally redesigned.

## 20. Required Later Tests

A later implementation package should cover:

- exact admission and rejection reasons;
- unsupported-location preview/execution parity;
- provider/service availability;
- insufficient currency;
- accepted payment receipt;
- exact time advancement;
- metabolic recovery parity;
- resource restoration policy;
- pending-change behavior;
- current-activity behavior;
- active threat or encounter rejection;
- injury/lethal-process non-resolution;
- actual-death/restoration boundary;
- duplicate delivery and deliberate repeat distinction;
- stale revision and wrong-player rejection;
- zero mutation on rejection;
- accepted-only UI application;
- save/load persistence of occurrence/results/receipts;
- notification/Chronicle projection from accepted facts only;
- focused source guards proving UI direct mutation removal.

## 21. User Input Required

Before the owner contract, ask the user:

1. Should ordinary inn rest fully restore HP, MP, and stamina, or provide context-dependent recovery?
2. Should HP recovery be reduced or blocked by injuries and unresolved lethal processes?
3. Should rest require an authored lodging/service provider, or may every settlement offer a baseline abstract rest option?
4. Should the price remain a fixed four silver, vary by settlement/service quality, or be selected later through economy authority?
5. Should the player choose sleep duration and lodging quality?
6. Should rest resume the prior activity, clear it, or leave a completed rest record?
7. Should rest create a checkpoint/autosave under future save-topology rules?
8. Should camping, owned property, barracks, temples, guild lodging, and inns share one command with different offers or remain domain-specific actions?
9. How punitive should unsafe or interrupted rest be?

These are core gameplay and pacing decisions and should not be inferred from the demo helper.

## 22. Final Disposition

Current behavior:

`UI_OWNED_COMPATIBILITY_REST`

Preview parity:

`INCOMPLETE`

Health/service ownership:

`BLOCKED`

Documentation readiness:

`OWNER_CONTRACT_PREREQUISITE_IDENTIFIED`

Implementation:

`NO_PACKAGE`

The current helper should remain unchanged until the active save-publication work and a dedicated rest owner decision close its service, recovery, health, persistence, and accepted-only UI boundaries.
