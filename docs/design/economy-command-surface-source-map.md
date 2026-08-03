# Economy Command Surface Source Map

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only source audit; no local tests, builds, typechecks, linters, generators, or runtime execution

## Purpose

Refresh the economy command and transaction boundary against current master before any shop, trade, craft, caravan, market, inventory-transfer, reward-transaction, estate-transfer, or workplace-execution package is planned.

This document is evidence only. It does not authorize implementation, mutate repository authority, or replace a focused owner decision.

## Current Classification

`STATIC_ECONOMY_AND_PROJECTIONS_EXIST; BOUNDED_UI_REWARD_MUTATIONS_EXIST; GENERAL_TRANSACTION_COMMANDS_AND_RECEIPTS_ABSENT`

The repository now has three distinct layers that must not be conflated:

1. **Static and projected economy facts** — settlement economy, domestic trade flows, market values, item value profiles, workplaces, recipes, production chains, routes, and read-only UI projections.
2. **Bounded gameplay-loop mutations** — current quest and rest flows directly alter currency and inventory inside `apps/rpg-ui/src/game-shell/gameplayLoop.ts`, then submit the resulting snapshot through the generic campaign mutation gateway.
3. **General economy commands** — shop, trade, craft, caravan, vendor offer, workplace cycle, estate transfer, and market-simulation commands remain absent.

Generic campaign admission proves that a proposed campaign mutation was admitted under persistence rules. It does not provide economy-specific ownership, stale-offer validation, atomic transaction identity, inventory provenance, or a replay/correction receipt.

## Current Mutation Inventory

| Concern | Current owner/path | Present posture | Missing authority |
| --- | --- | --- | --- |
| Quest payout currency | UI gameplay bridge | Direct `gold`/`silver` mutation during quest turn-in | engine command/result identity, payout receipt, duplicate protection |
| Rest payment | UI gameplay bridge | Direct `silver` subtraction before rest mutation | service offer, price authority, payment receipt, refund/correction posture |
| Quest cargo inventory | UI gameplay bridge | Direct stack insertion/removal across bags and overflow | inventory command owner, item-instance/stack transaction receipt, capacity rejection contract |
| Static market/value facts | content and projection owners | Read-only evidence | vendor offer and transaction authority |
| Recipes and production chains | static content | Transformation descriptions | executable crafting owner, input reservation/consumption, output delivery |
| Workplaces | static content and projections | Capability and planning facts | cycle command, worker/input/output/time ownership |
| Routes and caravan modes | world/static authorities | Feasibility context | dispatch, cargo, crew, risk, arrival, and failure owner |
| Estate/account vocabulary | account and design owners | Account-side structures and plans exist | item/property transfer command and campaign/account publication boundary |
| Campaign admission | game-engine persistence gateway | Admits accepted proposed snapshots and records campaign mutation authority | domain transaction semantics, offer freshness, economic receipt |

## Direct UI Bridge Findings

Current `gameplayLoop.ts` contains local helpers for:

- adding currency;
- spending currency;
- adding inventory stacks;
- removing inventory quantities;
- assembling quest payouts and cargo handoff;
- applying standing, reputation, skill, notification, Chronicle, and operation changes in the same proposed snapshot.

These helpers are deterministic compatibility behavior, not reusable economy authority. They lack a shared command envelope, actor/owner identity, offer identity, expected revision, exact input/output receipt, duplicate-result lookup, correction path, and domain-specific rejection codes.

The generic `GameSessionContext.updateSnapshot` path can label accepted engine results, persisted preferences, or legacy bridges. Current rest and quest turn-in use the legacy/default route rather than an economy-specific engine result.

## Projection Versus Command Boundary

A projection or authored record may inform a command, but cannot authorize mutation by itself.

- A displayed price is not an offer.
- An offer is not a completed transaction.
- A recipe is not input reservation or output production.
- A route is not caravan dispatch.
- A workplace is not a production cycle.
- Settlement demand is not a buyer.
- Inventory capacity is not an item-transfer command.
- A campaign mutation ledger entry is not an economy transaction receipt.

## Minimum Future Transaction Evidence

Any future economy command package should decide, per command family:

1. command and result identity;
2. actor, inventory, currency, offer, vendor, market, workplace, route, settlement, estate, or account owner;
3. source artifact/revision and stale-state rejection;
4. exact input quantities and output destination;
5. capacity and overflow behavior;
6. price/quote identity and expiration;
7. accepted, rejected, duplicate, replay, and correction behavior;
8. campaign-versus-account publication boundary;
9. projection and notification derivation;
10. focused tests proving read-only facts cannot mutate state.

## Safe Near-Term Consumer Order

1. focused economy command/current-mutation owner decision;
2. inventory and currency transaction contract;
3. inert offer and transaction-result envelopes;
4. one bounded command family, preferably a quest/reward or vendor transaction already required by the representative loop;
5. read-only UI projection over accepted command facts;
6. broader shop, crafting, trade, workplace, caravan, estate, or market execution only after owner-specific acceptance.

## Mandatory Named Consumers

Future work must inspect this audit when it covers:

- shop, vendor, offer, buy, or sell commands;
- trade, caravan, workplace, or crafting execution;
- currency or inventory mutation;
- quest, activity, or rest transaction receipts;
- estate transfer or account/campaign value publication;
- representative-loop or `0.7.0` claims about an executable economy.

## Review Trigger

Re-review against live master at the next economy command, inventory-transfer, vendor/offer, crafting execution, transactional reward, or estate-transfer decision.

## Exclusions

This pass changed no source, tests, schemas, content, assets, dependencies, generated output, current prompt, current output, current handoff, roadmap, backlog, branch register, price, reward, inventory, or save behavior.
