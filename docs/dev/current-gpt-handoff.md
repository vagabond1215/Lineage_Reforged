# Current GPT Handoff

Source version/run: Version 0.5.222 - Quest Objective And Condition Schema Decision
Date: 2026-06-21
Status: documentation-only decision completed; no implementation occurred

## Authority Rules

- `civilization.quest_definitions` remains canonical for unique authored quests.
- `civilization.quest_archetypes` remains canonical reusable authored quest structure.
- `civilization.quest_templates` remains canonical repeatable-offer generation input.
- Objectives and conditions remain embedded; future shared JSON Schema components may remove duplication but do not create content collections or global objective/condition ids.
- Definition and archetype action-tree/check/requirement shapes may share schema components. Templates retain a distinct generator-input contract.
- Generated `QuestOfferObjective` and `QuestOfferState` values remain civilization runtime output, not authored quest content.
- Current quest item relationships use canonical `itemKey`.
- Rewards, consequences, failure effects, and unlock candidates remain source-local descriptive envelopes without payout or mutation.
- Player/session/runtime owners retain quest acceptance/progress/completion, condition satisfaction, cooldowns/timers, reward claims, journal entries, Chronicle records, events, and UI.
- Quest giver/contact strings and synthetic entity ids are not canonical people.

## Current Anchor

Latest completed:

- `Version 0.5.222 - Quest Objective And Condition Schema Decision`

Immediate next:

- `Version 0.5.223 - Person vs NPC Schema Decision`

## Quest Decision Result

- Live inventory: five definitions, eight archetypes, 36 templates.
- Definitions and archetypes duplicate an embedded action-tree/check contract and closely related requirement structures.
- Templates contain economic/security/frontier generation inputs rather than authored action trees.
- Future reusable sub-schemas are approved only for duplicated static structures; standalone objective/condition records are rejected.
- The conditional implementation candidate remains `0.5.234 - Quest Objective And Condition Validation Pass` after the docs-first queue.
- `docs/dev/tmp-quest-event-chronicle-systems-research-2026-06-20.md` was deleted after full promotion and has no remaining consumer.

## Consolidated Near-Term Queue

1. `0.5.223 - Person vs NPC Schema Decision`
2. `0.5.224 - Magic Study Source Schema Decision`
3. `0.5.225 - Polity Schema Decision`
4. `0.5.226 - Household vs Family Schema Decision`
5. `0.5.227 - Settlement Economy Schema Decision`
6. `0.5.228 - World Map Feature Authority Schema Decision`
7. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. GPT-DR labels remain non-Codex labels and do not consume `0.5.x` numbers. The permanent prompt-pack guidance remains active but does not interrupt the numbered queue.

## Next Route Boundary

`Version 0.5.223 - Person vs NPC Schema Decision` remains documentation-only. It must inspect live people-adjacent identities and generated/runtime character owners, define person versus NPC-overlay schema posture and references, preserve existing quest giver/contact strings as non-canonical metadata, and decide the NPC/social research artifact's retirement.

It must not implement schemas, validators, content, tests, NPC runtime, schedules, dialogue, relationships, services, UI, storage, migration, or gameplay behavior.
