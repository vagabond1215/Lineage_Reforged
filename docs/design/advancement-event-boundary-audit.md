# Advancement Event Boundary Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future skill mastery trial, magic study event, knowledge trial, and progression event work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Map event and ownership boundaries for future advancement systems before any runtime helper, save/account/session state, skill trial execution, magic study execution, knowledge trial behavior, Chronicle/Renown output, or UI command work is scoped.

This document is a planning source. It does not authorize implementation.

## Current Advancement Reality

Existing planning and scaffolding already distinguish several advancement-adjacent systems:

- skill mastery trials are planned
- magic study events are planned
- known-spell acquisition uses explicit character-scoped `training_event` evidence in pure helper form
- knowledge snippets and knowledge domains are being planned separately
- combat skill gains exist in current combat runtime, but broad advancement event ownership remains deferred
- Chronicle/Renown output remains deferred

## Core Boundary Rule

An advancement event is not an automatic reward.

A study/training/trial/observation/combat/quest event may later provide evidence, blockers, or proposed outputs, but it must not silently mutate skills, spells, knowledge, Chronicle, Renown, Prestige, inventory, account, family, or save/session state unless a dedicated command/result owner exists.

## Event Vocabulary

| Event family | Examples | Boundary |
| --- | --- | --- |
| `training_event` | known-spell acquisition evidence, formal training, teacher-led practice | Can prove scoped acquisition only when explicit; not a generic grant. |
| `study_event` | book, tome, scroll, academy, institution, ritual, research | Access does not equal completion. |
| `skill_trial_event` | breakthrough trial, mastery checkpoint, rank-gated test | Trial visibility does not equal pass/completion. |
| `knowledge_trial_event` | domain/tier knowledge checkpoint | Deferred; must not reuse skill trial behavior automatically. |
| `combat_event` | resolved action, encounter observation, combat skill gain candidate | Combat participation does not automatically grant knowledge or mastery. |
| `quest_event` | quest outcome, reward proof, narrative milestone | Quest visibility/acceptance is not reward evidence. |
| `chronicle_event` | recorded run summary, milestone record, historical marker | Record visibility is not a grant. |
| `renown_event` | fame/notoriety award, public recognition | Recognition is not knowledge, Prestige, ownership, or skill progress. |
| `crafting_event` | recipe attempt, workplace cycle, material processing | Recipe/content visibility is not crafting progress. |
| `travel_event` | route traversal, region visit, biome/locality observation | Visibility is not geography knowledge completion. |
| `family_event` | inheritance, bequest, heir recognition, family claim | Family display is not ownership evidence. |
| `custom` | special authored event | Requires explicit owner, target, and validation notes. |

## Owner Scopes

Future advancement events should always declare an owner scope before they can be consumed.

| Owner scope | Use | Non-grant rule |
| --- | --- | --- |
| `character` | skill, known spell, personal study, combat participation | Does not imply account/family ownership. |
| `account` | account-wide projection/read-only meta | Does not imply character/family progression. |
| `family` | family-scoped achievements or inheritance | Must not be inferred from selected character or lineage text. |
| `source_run` | run-local event source | Does not equal persistent family/account state. |
| `institution` | guild/academy/temple/order study owner | Membership/access is not completion. |
| `teacher` | instructor/mentor source | Hiring/access is not instruction completion. |
| `quest` | quest outcome source | Visibility/acceptance is not completion. |
| `chronicle_record` | recorded evidence source | Record text is not parsed into grants. |
| `item_instance` | book/scroll/tome/relic/material source | Possession is not study/use completion. |
| `location` | region/locality/route/biome observation | Presence is not full knowledge. |
| `custom` | explicit special owner | Requires notes and validation. |

## Target Systems

Advancement events should declare what they can affect before any mutation is possible.

| Target system | Examples | Required boundary |
| --- | --- | --- |
| `skill` | rank gain, breakthrough, mastery trial | Skill owner, cap policy, trial policy, save mutation owner. |
| `known_spell` | acquisition, availability, validation | Character-scoped known-spell owner and acquisition evidence. |
| `magic_study` | research progress, spell study, ritual study | Study event owner; not known-spell ownership by itself. |
| `knowledge` | snippet discovery/progress, domain/tier completion | Knowledge evidence/completion owner; no auto-completion. |
| `chronicle` | recorded milestone | Event-output owner; no grants by visibility. |
| `renown` | fame/notoriety/recognition | Reputation owner; not Prestige/knowledge. |
| `family` | heir, bequest, estate, bloodline context | Explicit family/evidence owner. |
| `economy` | crafting/trade/workplace progress | Inventory/currency/workplace command owner. |
| `inventory` | item transfer, item generation | Item-instance/inventory owner. |
| `session` | temporary runtime state | Session mutation owner. |

## Non-Grant Rules

- Training access does not grant a known spell.
- Study access does not complete study.
- Trial visibility does not pass a trial.
- Combat participation does not grant tactics knowledge or mastery by itself.
- Quest visibility or acceptance does not grant advancement.
- Chronicle visibility does not grant rewards.
- Renown does not grant Family Prestige.
- Item possession does not grant study or knowledge.
- Institution membership does not grant study completion.
- UI selection does not create an event.
- Pure helper outputs are proposals/blockers, not mutation authority.

## Future Validation Rules

Future advancement-event validation should protect:

- known event family only
- known owner scope only
- owner id present and valid for owner scope
- target system compatibility
- target id compatibility
- event authority level: display-only, evidence-only, proposal-only, mutation-authorized
- wrong-owner event fails
- missing-owner event fails
- display-only event cannot mutate state
- duplicate event id handling is deterministic
- runtime mutation requires explicit command/result owner
- UI-provided ids are not accepted as authority

## Candidate Event Shape

Planning-only sketch:

```json
{
  "eventId": "advancement_event.example",
  "eventFamily": "training_event",
  "ownerScope": "character",
  "ownerId": "character.example",
  "sourceSystem": "magic_study",
  "sourceId": "training_event.example",
  "targetSystem": "known_spell",
  "targetId": "spell.example",
  "authority": "evidence_only",
  "persistencePolicy": "character_save",
  "notes": "Planning only; not live content."
}
```

Do not implement this shape until a dedicated schema/runtime pass is scoped.

## Recommended Future Pass Order

Recommended sequence when this pillar becomes active:

1. `Advancement Event Source Map`
   - inspect skill trial, known-spell acquisition, magic study, combat skill gain, knowledge, Chronicle, and reputation sources
   - docs-only
2. `Advancement Event Owner Vocabulary Plan`
   - define owner scopes, target systems, and authority levels
   - planning only
3. `Skill Trial Event Contract Plan`
   - define trial request/result/evidence boundaries
   - planning only
4. `Magic Study Event Contract Plan`
   - define study/training/ritual evidence before mutation
   - planning only
5. `Knowledge Trial Event Contract Plan`
   - define knowledge-specific trial/checkpoint semantics separately from skill trials
   - planning only
6. `Advancement Event Validation Helper`
   - pure helper returning blockers over explicit event input
7. `Advancement Event Projection Helper`
   - pure read-only projection over explicit events
8. `Narrow Runtime Integration`
   - only after command/result, save/session, and event-output owners are explicit

## Forbidden Until Explicitly Scoped

Do not add or change:

- skill trial runtime behavior
- magic study runtime behavior
- knowledge trial runtime behavior
- known-spell acquisition mutation beyond existing pure helpers
- skill rank mutation beyond current explicit combat path
- Chronicle/Renown event output
- save/account/session schema
- item/inventory mutation
- Family Prestige behavior
- UI command dispatch
- generated output
- content JSON records
- broad progression rebalance

## Recommended Next Connector Work

The next useful connector-only pass is:

- `Runtime State Ownership Ledger Prep`

Rationale: many deferred systems require save/account/session ownership. A ledger prep pass can reduce future state sprawl before runtime integration work.

## Recommended Future Codex Work

Do not schedule advancement event work ahead of the active knowledge-domain sequence unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Advancement Event Source Map`

It should remain docs-only/read-only and should not alter progression runtime, save/account/session, content, UI, generated output, or current combat skill-gain behavior.
