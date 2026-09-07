# NPC Party, Companion, Guest, And Combatant Persistence Readiness Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only readiness audit; no local tests, builds, typechecks, simulations, combat execution, or product-direction decisions

## Purpose

Map current NPC-party, companion, guest, allied-combatant, tactics, health, equipment, recruitment, loyalty, persistence, and post-combat ownership before any party automation, tactics editor, ordered-gambit, or companion package.

This audit does not authorize companion canon, party size, recruitment, loyalty, combat behavior, persistence changes, UI, or an ordered gambit system.

## Current Classification

`TACTICS_AND_PARTY_SHAPES_EXIST; DURABLE_ALLIED_NPC_PARTY_LOOP_INCOMPLETE`

The repository has substantial combat and tactics foundations, but they should not be mistaken for a complete companion system.

## Existing Foundations

Current shared and engine surfaces include:

- `PartyRuntimeState` and combat UI state;
- combatants, allied/enemy disposition, action queues, resources, status, targeting, timing, and combat history;
- player combat profile with per-member preference capacity;
- tactical roles, weighted preferences, spell preferences, target rules, focus/ignore/priority directives, presets, AI/manual control, and temporary manual override;
- allied and guest combatant id fields in encounter contracts;
- deterministic enemy action and target selection;
- save-shaped game state containing party, active encounter, combat profile, and combat history structures.

Default game state still initializes an empty party runtime and an empty member-preference list.

## Current Ordinary Encounter Boundary

Current repository evidence indicates the ordinary encounter construction path creates:

- the player combatant;
- enemies from encounter/spawn authority;
- no durable full allied NPC roster by default.

The contract can represent allied or guest combatants, but representation is not construction, persistence, recruitment, or lifecycle authority.

## Missing Owner Matrix

| Concern | Current evidence | Missing exact owner |
| --- | --- | --- |
| Companion identity | general character/account/content vocabulary exists | canonical companion record and runtime identity |
| Party membership | runtime member shape exists | recruitment, dismissal, join/leave, ordering, leader change |
| Combatant construction | combatant contracts and spawn path exist | conversion from durable companion to encounter combatant |
| Health/resources | combatant and player resource shapes exist | durable per-companion pre/post-combat reconciliation |
| Injury/death | combat status and future health decisions exist | companion injury, defeat, death, recovery, and consequence owner |
| Equipment/inventory | equipment and item shapes exist | per-companion ownership, transfer, persistence, and capacity |
| Skills/spells/abilities | player and combat action grants exist | companion progression/loadout authority |
| Tactics preferences | per-member preference shape exists | stable companion binding, editing, save/load, migration |
| Guest membership | encounter guest ids exist | guest admission, temporary lifecycle, reward/consequence behavior |
| Loyalty/relationships | design vocabulary exists elsewhere | mutable companion relationship owner |
| Post-combat outcome | encounter outcome exists | durable party reconciliation and correction |
| UI presentation | text-first combat plan exists | companion roster, command, tactics, and status view models |

## Tactics Boundary

Weighted tactics AI is real and currently usable for engine-controlled combatants. That does not prove:

- a persisted NPC party exists;
- every member has a durable tactics profile;
- tactics survive recruitment, dismissal, defeat, save/load, or migration;
- the player can edit and understand tactics safely;
- literal ordered `condition -> action` gambits are authorized.

A future ordered-gambit decision should follow, not precede, exact actor, party, persistence, and companion lifecycle authority.

## Required Future Decision Questions

1. What is the durable companion/member identity?
2. Which owner stores roster membership and ordering?
3. How is a member converted into an encounter combatant and reconciled afterward?
4. Which state persists HP, MP, stamina, statuses, injury, death, equipment, and cooldown-like facts?
5. How are guests distinguished from recruitable companions?
6. What happens on disconnect/reload, duplicate outcome application, correction, or copied artifacts?
7. How do per-member tactics bind to actor identity and presets?
8. Which commands are player-issued versus AI-controlled?
9. Which rewards, loot, XP/progression, reputation, and consequences apply to whom?
10. What presentation and accessibility facts are required before UI implementation?

## Safe Future Sequence

1. companion/NPC roster and identity decision;
2. party membership and persistence contract;
3. combatant construction and post-combat reconciliation decision;
4. focused allied-NPC combat fixtures;
5. tactics editing/explanation over the existing weighted model;
6. product direction on ordered gambits;
7. bounded text-first party UI only after authority is accepted.

## Named Consumers

Future work must inspect this audit when it covers:

- companion or NPC recruitment;
- allied/guest combatants;
- party persistence or post-combat reconciliation;
- tactics-per-member editing;
- ordered gambits;
- text-first combat;
- `0.7.0` combat integration claims.

## Review Trigger

Re-review at any package claiming allied NPC combat, companion automation, durable party membership, per-member tactics, or companion health/equipment persistence.

## Exclusions

No source, tests, schemas, content, combat balance, character canon, save format, UI, active prompt, roadmap, backlog, or branch register changed in this pass.
