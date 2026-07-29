# Combat AI And Gambit Current-State Audit

Date: 2026-07-29

Status: documentation-only current-state audit; no implementation permission

Source commit inspected: `acdfc3db363692130917ac896abc5d65d711ee00`

## 1. Executive Result

The repository has substantial deterministic combat-AI and tactics infrastructure. It is not merely a placeholder.

Current state:

- weighted role-and-preference combat AI exists;
- target-ranking logic exists;
- AI/manual control modes and temporary manual overrides exist;
- static tactics presets and combat roles exist;
- combat encounters call the AI queue every active tick;
- player combat preferences are represented in shared state and save-shaped contracts;
- enemy combatants receive role-derived presets;
- the intended Final Fantasy XII-like party-control direction is preserved in durable design documentation.

Not yet present:

- a literal ordered `condition -> action` gambit language;
- rule ordering, fallthrough, conflict resolution, validation, or interpreter authority;
- a player-facing tactics/gambit editor;
- explanatory AI-choice receipts or a durable decision trace;
- ordinary encounter construction for a full NPC party with persisted member health and action ownership;
- focused proof that every advertised target rule and tactics preference materially affects runtime behavior;
- a complete companion/NPC combat-state, persistence, recruitment, loyalty, or injury owner.

Classification:

`WEIGHTED_TACTICS_AI_EXISTS; ORDERED_GAMBIT_SYSTEM_DEFERRED`

## 2. Preserved User Direction

The durable user-design intake states that party members should largely be NPC characters with logic controls similar in spirit to Final Fantasy XII gambits.

The accepted UI information-architecture boundary preserves that as an interaction goal while explicitly keeping current authority in the weighted tactics model. Literal ordered condition/action gambits remain deferred pending a separate authority and runtime-interpreter decision.

This distinction is important:

- the current system chooses actions and targets by scoring supported preferences;
- a traditional gambit system evaluates an ordered list of explicit conditions and actions until one rule admits.

The former is live. The latter is not authorized or implemented.

## 3. Shared Tactics Contracts

`packages/shared/types/src/tactics.ts` defines:

- `CombatControlMode`: `ai | manual`;
- nine tactical roles:
  - frontliner;
  - disruptor;
  - ranged pressure;
  - healer;
  - support buffer;
  - debuffer/controller;
  - opportunist;
  - tank/protector;
  - flexible/adaptive;
- five bias bands: `avoid | low | normal | high | critical`;
- target rules for HP, MP, stamina, maximum resources, threat, casting, interruptibility, current player target, explicit ignore lists, and melee/ranged/magic focus or avoidance;
- focus, ignore, priority, and deprioritized target directives;
- action-family preferences for damage, healing, interruption, conservation, weakness use, buffs, debuffs, area pressure, single-target pressure, melee, ranged, and magic;
- spell-school, element, tier, buff/debuff, MP-threshold, and stamina-threshold preferences;
- per-actor role, control mode, preset, and full tactics state;
- a player combat profile containing member preferences;
- static combat-role and tactics-preset record shapes.

`packages/engines/game-engine/src/combat/state.ts` supplies deterministic defaults, empty directives, default 25% MP/stamina conservation thresholds, an empty player member-preference list, and empty party/combat-UI state.

## 4. Static Presets And Role Content

The repository contains:

- `packages/content/base/game/combat_roles.json`;
- `packages/content/base/game/tactics_presets.json`;
- strict combat-role and tactics-preset schemas;
- content loading and validation paths.

Representative presets include:

- `preset.ally.expedition_balanced`;
- `preset.ally.triage_healer`;
- `preset.ally.guard_wall`;
- enemy role presets such as `preset.enemy.frontliner`.

The presets carry real preference weights, resource thresholds, target rules, and focus-directive shapes. For example, the triage-healer preset sets healing urgency to `critical`, prefers healing and enhancing schools, and weights lowest-HP allies heavily.

These are static defaults and policy inputs. They are not an ordered gambit program.

## 5. Runtime AI Action Selection

`packages/engines/game-engine/src/combat/index.ts` implements the current runtime AI.

### Candidate actions

The engine builds candidate action types from:

- item use-profile grants;
- spell action grants;
- ability action grants;
- monster role/action packages;
- a basic melee fallback when no grant supplies an action.

### Action scoring

The engine scores each candidate using:

- action classification as healing, enhancing, enfeebling, interrupt, magic, ranged, or melee;
- tactical preference biases;
- whether allies are below 80% HP;
- whether an interruptible enemy action is currently executing or channeling;
- preferred spell schools;
- MP and stamina conservation thresholds;
- role-specific bonuses for healer, support buffer, disruptor, and ranged-pressure roles.

The highest-scoring candidate is selected deterministically.

### Target scoring

The engine ranks targets using:

- focus directives;
- ignore directives;
- priority and deprioritized directives;
- current player target;
- missing HP for ally-directed actions;
- target-preference rules and weights;
- HP, MP, stamina, maximum resources, threat, casting state, and interrupt window;
- melee, ranged, and magic focus/ignore rules.

It then selects one target or a bounded multi-target slice when the action template supports party, line, or arc targeting.

### Tick integration

For every active combat tick, the engine:

1. skips AI for defeated, incapacitated, controlled, manually overridden, already-busy, or not-ready combatants;
2. chooses an AI action type;
3. chooses targets;
4. creates and queues the action;
5. starts ready actions;
6. resolves finished actions;
7. finalizes recovery and outcome state.

This is functioning combat AI, not presentation-only metadata.

## 6. Manual Override And Mixed Control

Manual combat commands:

- can append or replace queued actions;
- set the actor to manual control;
- stage an authoritative combat action;
- temporarily suspend AI through a manual override window;
- retain selected-target and last-issued-command UI state.

The architecture therefore already supports mixed automated and manual control in principle.

What remains unclear is the intended player experience for returning an actor from manual control to AI, editing tactics during combat, and persisting per-NPC preferences across party membership and save/load.

## 7. NPC And Party Limitation

The ordinary encounter-construction path currently creates:

- one player combatant;
- enemy combatants from encounter templates and spawn candidates.

The party runtime stores member metadata and transient combatant bindings, but ordinary encounter creation does not yet construct a durable full NPC allied roster. `alliedCombatantIds` begins with only the player, and allied guest combatant IDs begin empty.

Consequences:

- enemy AI is the clearest live consumer of the scoring system;
- player-owned AI preference contracts exist, but ordinary NPC-party automation is not yet a complete playable system;
- companion health, injury, death, persistence, equipment, abilities, and post-combat consequences remain incomplete owners;
- a gambit editor should not be implemented before the actor/party/persistence boundary is exact.

## 8. Known Contract Gaps

A separate ordered-gambit decision must define at minimum:

1. rule identity and owner;
2. condition vocabulary and source facts;
3. action references and eligibility;
4. ordering and first-match/fallthrough behavior;
5. disabled, invalid, blocked, and unavailable rule posture;
6. conflict resolution with roles, weighted preferences, focus directives, and manual commands;
7. deterministic evaluation timing;
8. prevention of UI-owned combat truth;
9. validation and schema ownership;
10. persistence and migration;
11. per-character, per-role, per-preset, or party-shared scope;
12. explanation and debugging projections;
13. replay/correction behavior where combat results become durable;
14. accessibility and text-first editing UI;
15. bounded complexity and anti-loop guarantees.

The decision must also choose whether ordered gambits replace weighted scoring, precede it, constrain it, or provide explicit high-priority rules with weighted fallback.

## 9. Test And Evidence Gaps

Existing combat, schema, content, and save-roundtrip tests cover important surrounding foundations. Connector search did not find a focused test suite named around AI action scoring, target ranking, gambit evaluation, or tactics explanation.

Before expanding the system, Codex should establish focused deterministic fixtures for:

- healer action choice with and without wounded allies;
- interrupt choice inside and outside the valid window;
- resource-conservation thresholds;
- role bonuses;
- focus, ignore, priority, and deprioritized targets;
- every supported target-rule family;
- stable tie-breaking;
- no valid target or no affordable action;
- manual override and AI resumption;
- multi-target limits;
- enemy versus allied relative disposition;
- save/load preservation of member preferences;
- future NPC-party actor construction.

## 10. Recommended Sequence

Do not interrupt the active minimum-save identity/publication route.

Recommended later order:

1. integrate and refresh the text-first combat view-model audit;
2. perform a focused combat-AI scoring and test-coverage audit;
3. decide NPC/companion combatant ownership and persistence;
4. decide tactics editing and explanation projections over the existing weighted model;
5. obtain user direction on ordered gambits versus weighted fallback;
6. create a separate ordered-gambit authority decision only if still desired;
7. implement the smallest deterministic slice with focused tests;
8. add text-first editor and combat explanations only after engine authority exists.

## 11. User Direction Needed Before Ordered Gambits

The most important future question is:

Should literal ordered gambits be:

- the primary decision engine;
- high-priority explicit rules followed by the current weighted tactics fallback;
- an optional advanced mode alongside simpler role/preset controls; or
- deferred in favor of improving the existing weighted tactics system?

Repository evidence cannot safely choose among those product directions.