# Runtime State Ownership Ledger Prep

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future save/account/session/runtime ownership work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Prepare a cross-pillar ownership ledger for future runtime state work before any save/account/session schema, command mutation, event output, UI dispatch, or generated output is scoped.

This document is a planning source. It does not authorize implementation.

## Core Boundary Rule

State ownership must be explicit before mutation.

No future feature should mutate account, family, character, session, inventory, economy, combat, knowledge, Chronicle/Renown, magic, or UI-derived state until the owner scope, command authority, event output, persistence policy, and validation path are defined.

## State Owner Vocabulary

| Owner scope | Meaning | Examples | Boundary |
| --- | --- | --- | --- |
| `account` | profile-wide durable state | account meta, account-scoped Legacy purchases | does not imply family/character state |
| `family` | durable family/lineage state | heirs, bequests, Family Prestige, family evidence | must not be inferred from account or character |
| `character` | individual character state | skills, known spells, inventory, resources | does not imply account/family ownership |
| `session` | active run/session state | current encounter, active route, temporary actions | does not imply durable persistence |
| `encounter` | active combat/local encounter state | combatants, action queue, statuses | no save mutation unless owner exists |
| `inventory` | item/container/currency owner | item instances, equipment, shop inputs | catalog item id is not ownership |
| `market` | market/vendor/settlement economy state | offers, prices, demand, supply | projections are not transactions |
| `workplace` | production/crafting owner | recipes, inputs, outputs, workers | recipes do not mutate items alone |
| `route` | travel/caravan route owner | caravan dispatch, hazards, arrival | route visibility is not command authority |
| `knowledge` | discovery/progress state | snippets, domain/tier completion, evidence refs | registry/snippets are not progress state |
| `chronicle` | historical/event record state | run summaries, marks, seals | record visibility is not grant authority |
| `renown` | recognition/reputation state | fame/notoriety awards | not Family Prestige or knowledge |
| `ui` | local presentation state | selected ids, filters, layout | never mutation authority |

## Mutation Authority Levels

Future helpers and events should distinguish authority level.

| Authority | Meaning | Can mutate? |
| --- | --- | --- |
| `display_only` | read-only presentation/projection | no |
| `evidence_only` | proof candidate for another system | no direct mutation |
| `proposal_only` | deterministic proposed output/blockers | no |
| `command_intent` | user/system requested action, not yet resolved | no until validated |
| `validated_command` | command passed ownership/readiness checks | only through scoped handler |
| `runtime_result` | resolved action result from owner system | only owner-approved mutations |
| `persisted_record` | saved durable record | already persisted by owner |

## Cross-Pillar State Boundaries

| Pillar | State it may eventually own | Must not own |
| --- | --- | --- |
| Magic | known spell readiness, cast command intent, resolver result envelopes | combat effects, inventory mutation, Chronicle/Renown output, UI authority |
| Combat | encounter state, action queues, combat statuses, combat skill-gain attempts | known-spell ownership, final magic semantics, knowledge, Chronicle output unless scoped |
| Economy | offers, transaction readiness, market/workplace/caravan command state | inventory/currency mutation without command owner, generated output |
| Knowledge | snippet discovery/progress, evidence refs, tier/domain completion | skills, magic study, Chronicle text, UI visibility |
| Advancement | skill trial/study/training evidence and proposed outputs | automatic rewards, save mutation without owner |
| Family | family evidence, heirs, bequests, Prestige, estate claims | account/character state by inference |
| Chronicle/Renown | event records, fame/notoriety, evidence pointers | grants, knowledge, ownership, Prestige by visibility |
| UI Shell | presentation, navigation, selected ids, filters | command authority, evidence creation, state mutation |
| Save/Account | durable persistence boundaries | feature logic or inferred ownership |

## Required Questions Before Runtime Work

Every future runtime pass should answer:

1. What owner scope owns the state?
2. What id identifies the owner?
3. What command or event is authorized to mutate it?
4. Is the action display-only, evidence-only, proposal-only, or mutation-authorized?
5. What validation prevents wrong-owner mutation?
6. What validation prevents stale/read-only projections from mutating state?
7. What event/result envelope records the outcome?
8. What persistence policy applies?
9. What tests prove UI cannot fabricate authority?
10. What tests prove catalog/content visibility cannot mutate state?

## Future Ledger Shape Candidate

Planning-only sketch:

```json
{
  "stateKey": "known_spell.records",
  "ownerScope": "character",
  "ownerIdSource": "explicit_character_id",
  "authority": "validated_command",
  "mutationOwner": "known_spell_acquisition",
  "persistencePolicy": "character_save",
  "allowedSources": ["training_event"],
  "forbiddenInferences": ["account", "family", "ui", "catalog_presence"],
  "validationRefs": ["known_spell_acquisition_event"],
  "notes": "Planning only; not live schema."
}
```

Do not implement this shape until a dedicated schema/runtime pass is scoped.

## Non-Mutation Rules

- Read-only projection is not state authority.
- Content/catalog presence is not ownership.
- UI selected id is not owner id proof.
- Account ownership does not imply family ownership.
- Family ownership does not imply character ownership.
- Character ownership does not imply account/family state.
- Chronicle visibility does not grant rewards.
- Market price display does not spend currency.
- Knowledge registry/snippets do not store progress state.
- Magic readiness does not execute effects.
- Combat recognition is not full magic ownership.

## Validation Rules To Plan Later

Future state-ownership validation should protect:

- known owner scopes only
- explicit owner ids
- compatible owner scope and target system
- authority level gating before mutation
- display-only/proposal-only records cannot mutate
- wrong-owner commands fail
- stale projections fail
- UI-provided ids are treated as selection only unless backed by command validation
- catalog/content ids are not treated as owned instances
- persistence policy matches owner scope
- cross-pillar outputs require explicit event contracts

## Recommended Future Pass Order

Recommended sequence when this area becomes active:

1. `Runtime State Ownership Source Map`
   - inspect current save/account/session/player/combat/economy/magic/chronicle state shapes
   - docs-only
2. `Runtime State Ownership Ledger Plan`
   - define durable ledger fields and owner scopes
   - planning only
3. `Owner Scope Validation Helper Plan`
   - plan pure validation helpers for owner scope/id/authority levels
4. `Read-Only State Ownership Projection Helper`
   - pure projection only over explicit inputs
5. `Narrow Runtime Mutation Contract Plan`
   - command/result contracts for one pillar at a time
6. `First Runtime Mutation Integration`
   - only after owner scopes, persistence, validation, and event output are explicit

## Forbidden Until Explicitly Scoped

Do not add or change:

- save/account/session schema
- runtime mutation handlers
- command dispatch
- event output mutation
- inventory/currency mutation
- family/knowledge/Chronicle state
- UI command authority
- generated output
- content JSON records
- broad refactors

## Recommended Next Connector Work

The next useful connector-only pass is:

- `Validation Blocker Inventory`

Rationale: broad typecheck and validation debt remain known blockers. A docs-only inventory can separate current unrelated strictness issues from future pillar work.

## Recommended Future Codex Work

Do not schedule runtime state ownership ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Runtime State Ownership Source Map`

It should remain docs-only/read-only and should not alter save/account/session, runtime, content, UI, generated output, or command behavior.
