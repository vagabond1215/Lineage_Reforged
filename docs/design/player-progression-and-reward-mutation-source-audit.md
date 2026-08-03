# Player Progression And Reward Mutation Source Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only evidence audit; no local tests, builds, typechecks, linters, simulations, or runtime execution

## Purpose

Map the current owners of noncombat skill gains, attribute load, stat-growth conversion, body/resource changes, standing, reputation, currency, inventory, and multi-owner rewards before another quest, activity, rest, progression, or representative-loop package is planned.

This document does not authorize reward values, balance changes, new progression rules, receipts, commands, UI changes, or persistence edits.

## Current Classification

`PLAYER_ENGINE_CALCULATION_HELPERS_EXIST; MULTI_OWNER_REWARD_ORCHESTRATION_REMAINS_UI_BRIDGE_OWNED`

The current repository separates calculation helpers from gameplay reward orchestration:

- `packages/engines/player-engine` owns reusable policies and synchronization for body state, resources, reputation, skill-rank gating, attribute load, stat-growth conversion, Echo/progression, and geographic Knowledge helpers.
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts` chooses when those helpers run, selects hard-coded reward values, directly rewrites player/session fields, assembles standing and inventory changes, and constructs notices and Chronicle records.
- `GameSessionContext` admits the resulting proposed snapshot through the generic campaign mutation gateway.

Generic campaign admission does not convert the UI bridge into a progression command owner or provide a domain-specific reward receipt.

## Owner Matrix

| Reward/progression concern | Current calculation owner | Current orchestration/application | Missing boundary |
| --- | --- | --- | --- |
| Noncombat skill rank gain | `resolveSkillRankGainPolicy` in player engine | local `addOrUpdateSkill` in UI gameplay bridge | command/result identity, source evidence, duplicate/replay contract |
| Action attribute load | player-engine stat-growth helpers | UI-selected activity/travel profiles and clock loop | authoritative activity result envelope |
| Stat-growth conversion | player engine | invoked during UI-managed recovery clock advancement | recovery result identity and exact conversion receipt |
| Body-state advancement | player engine | UI gameplay bridge advances time and passes profiles | engine-owned action/activity/rest command |
| HP/MP/Stamina changes | shared/player resource resolution plus direct UI helpers | direct travel/activity/rest/quest mutation | owner-specific effect result and correction behavior |
| Standing | no dedicated command owner found | local UI helper computes score labels and effects | standing award contract and durable source identity |
| Reputation | `applyReputationAward` in player engine | UI supplies hard-coded award definition and evidence flags | accepted event/result owner and duplicate protection |
| Currency and inventory | save-shaped player state | direct UI mutation | transaction command and receipt |
| Notifications/Chronicle | session state projections | directly constructed by UI gameplay bridge | derivation from accepted results, stable provenance |
| Operations/current activity | session state | UI upsert/remove/direct replacement | engine-owned lifecycle result |

## Engine Helper Boundary

The player engine exports useful deterministic helpers, including:

- `resolveSkillRankGainPolicy`;
- `applyActionAttributeLoad`;
- `convertPlayerStatGrowthOnRecovery`;
- `applyReputationAward`;
- `advancePlayerBodyState`;
- `syncPlayerRuntimeState`.

These helpers answer calculation questions. They do not, by themselves, establish:

- who authorized a reward;
- which quest/activity/result produced it;
- whether the reward was already applied;
- whether multiple owner changes are atomic;
- how replay, restart, correction, or copied artifacts behave;
- whether the UI may choose source facts or values.

## Current Multi-Owner Reward Bundles

Quest turn-in and activity advancement can change several owners in one proposed snapshot:

- quest state;
- currency;
- inventory;
- skills;
- standing;
- reputation;
- operations;
- current activity;
- flags;
- notifications;
- Chronicle entries;
- body/resources and clock state.

The snapshot proposal is admitted atomically at the campaign layer, but the domain facts are assembled by UI code and lack one typed reward/result authority. A future package must not treat the generic campaign ledger as proof of each individual reward field.

## Required Future Evidence

A bounded reward/progression command should define:

1. command, result, and source occurrence identity;
2. exact actor and affected owners;
3. deterministic eligibility and stale-state checks;
4. exact skill, attribute, stat-growth, resource, standing, reputation, currency, and inventory deltas;
5. atomic application and no partial reward;
6. duplicate/result lookup and restart replay;
7. correction/supersession behavior;
8. derived notice, Chronicle, operation, and UI facts;
9. persistence and migration posture;
10. focused tests for blocked gates, capped values, wrong owner, duplicate reward, and copied/reordered evidence.

## Named Consumers

Future work must inspect this audit when it covers:

- quest or activity reward ownership;
- noncombat skill or attribute progression;
- standing or reputation commands;
- stat-growth conversion or recovery rewards;
- multi-owner reward envelopes;
- representative-loop or `0.7.0` progression evidence.

## Review Trigger

Re-review at the next package that grants skills, attributes, stat growth, resources, standing, reputation, currency, inventory, or any multi-owner reward.

## Exclusions

No reward values, balance tables, thresholds, source code, tests, schemas, content, persistence formats, UI, active prompts, roadmaps, backlogs, or branch registers changed in this pass.
