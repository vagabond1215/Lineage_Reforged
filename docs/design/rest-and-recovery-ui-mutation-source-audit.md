# Rest And Recovery UI Mutation Source Audit

Date: 2026-08-03

Source route: ChatGPT via GitHub Connector

Original branch baseline: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Inspected live master: `91bd8c2c89c85fb9ea7257b2c96b68ab41231b04`

Branch: `parallel/rest-recovery-mutation-audit`

Status: `REFRESHED_CONNECTOR_EVIDENCE_CANDIDATE_INTEGRATION`

Execution posture: connector-only, read-only source audit; no rest, body, resource, health, care, economy, service, UI, engine, save, test, content, roadmap, or active-route change

## Purpose

Refresh the settlement-rest source map after campaign mutation admission and save authority changed, while preserving the distinction between compatibility behavior and an accepted rest/service/recovery command.

## Material Post-Baseline Changes

The session context now submits proposed snapshots through `admitCampaignMutation(...)`. This means rest is no longer applied by a completely unconstrained outer snapshot replacement.

However, `restAtCurrentSettlement(...)` still lives in UI game-shell code and returns only a snapshot plus notice. `ActivityPanel` calls `updateSnapshot(result.snapshot)` without an engine command/result identity, so the proposal remains a default `legacy_bridge` mutation.

Result:

`REST_REMAINS_UI_GAMEPLAY_LOOP_OWNED_AND_GENERICALLY_ADMISSION_GATED`

## Current Preview And Admission

`previewRestAtCurrentSettlement(...)` currently:

- requires a current location ID;
- clones the snapshot and checks whether four silver can be spent;
- projects four ticks using a fixed recovery context;
- provides body-state outcome data for the UI risk preview.

`ActivityPanel` may require a second click when the projected outcome is classified as risky. This is presentation confirmation, not a durable command commitment.

The preview does not prove:

- a lodging provider exists;
- the player has access or admission;
- a bed, food, or water is available;
- the quoted price belongs to a service record;
- capacity, law, danger, siege, weather, time, reputation, or faction rules permit rest;
- the execution will use a retained preview or request identity.

## Current Execution

`restAtCurrentSettlement(...)` currently:

1. resolves the current travel destination;
2. clones the snapshot;
3. spends four silver;
4. advances four ticks with a hard-coded secure-indoor recovery context;
5. sets HP, MP, and Stamina to maximum;
6. clears pending resource changes;
7. records `lastRestAtTick`;
8. replaces current activity with a rest activity;
9. appends notification and Chronicle projections;
10. synchronizes the snapshot;
11. returns a notice.

The fixed context assumes:

- one sleep unit;
- secure indoor camp tier;
- secure safety tier;
- meal support `1`;
- water support `1`.

Current location is therefore acting as a compatibility shortcut for a complete service and recovery package.

## Owner Boundaries

The current helper combines:

- settlement/location eligibility;
- price and payment;
- clock advancement;
- body-state recovery;
- HP/MP/Stamina restoration;
- pending-resource cleanup;
- activity mutation;
- Chronicle and notification projection;
- snapshot synchronization.

These effects span travel/location, service/economy, time, body, resources, health/care, activity, projection, and persistence owners.

The helper has no typed plan, occurrence, result, service receipt, payment receipt, recovery receipt, duplicate key, correction posture, or retained replay result.

## Health And Care Boundary

Full HP restoration is still compatibility behavior. The rest path does not inspect or resolve:

- injuries;
- lethal processes;
- care requirements;
- stabilization;
- treatment capability;
- diagnosis or observer knowledge;
- convalescence;
- anatomical restoration.

Body-state recovery and combat-resource restoration must not be described as accepted injury or care resolution.

## Accepted-Only UI Boundary

`ActivityPanel` invokes rest and then unconditionally submits the returned snapshot and displays the returned notice.

The generic campaign gateway rejects unchanged proposals, but the rest helper supplies no explicit accepted result and no command/result IDs. UI confirmation state is cleared when the snapshot changes, not when a durable rest result is replayed.

## Current Classification

| Boundary | Classification |
| --- | --- |
| Rest preview | `UI_GAMEPLAY_LOOP_DETERMINISTIC_PREVIEW` |
| Rest execution | `UI_GAMEPLAY_LOOP_LEGACY_BRIDGE` |
| Campaign mutation admission | `PRESENT_GENERIC_GATEWAY` |
| Service/provider/access authority | `ABSENT` |
| Payment/service receipt | `ABSENT` |
| Recovery result/receipt | `ABSENT` |
| Injury/care resolution | `NOT_AUTHORIZED` |
| Duplicate/restart/correction | `ABSENT` |
| Accepted-only UI result | `INCOMPLETE` |

## Smallest Safe Future Decision

A dedicated rest/service/recovery owner decision must define:

1. provider, location, service, price, access, capacity, and admission identity;
2. preview/request fingerprint and stale-state rules;
3. exact clock, payment, body, resource, health, care, activity, and projection owners;
4. the difference between ordinary rest, lodging, camp, medical care, and magical recovery;
5. accepted result and owner-specific receipts;
6. equivalent retry, restart, conflict, correction, and later-state replay;
7. campaign mutation and verified publication integration;
8. accepted-only UI application;
9. a bounded first package that does not invent a generic service framework.

## Named Consumer And Review Trigger

This audit must be read by:

- a settlement rest/service/recovery owner-contract decision;
- a body-state or resource-recovery integration package;
- a health/care boundary review involving rest;
- a representative-loop or `0.7.0` audit claiming rest is engine-owned and replay-safe;
- a cleanup proposing removal of rest `legacy_bridge` paths.

The consuming run must cite this branch head or an integrated successor and re-inspect `gameplayLoop.ts`, `ActivityPanel.tsx`, campaign-session admission, save publication, and current body/health contracts from its own head.

## Branch Disposition

`CANDIDATE_INTEGRATION`

Integration condition: compare against then-current rest, service, recovery, and persistence authority and integrate or re-author during a named consumer or dedicated parallel-document coordinator pass.

Retirement condition: all findings are integrated or superseded, named consumers can reach equivalent evidence on master, and the exact branch head is verified.

No local tests, builds, typechecks, body-state simulations, save/restart probes, or UI interaction were performed.
