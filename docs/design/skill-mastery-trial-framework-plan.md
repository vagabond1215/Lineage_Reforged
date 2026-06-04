# Skill Mastery Trial Framework Plan

Date: 2026-06-04
Route: ChatGPT via GitHub Connector
Status: roadmap/design structure only; no source, schema, content JSON, UI, or runtime behavior changes

## Purpose

Define the durable structure for expanding the existing skill progression infrastructure into narrative skill trials without replacing the current band, title, rank, and breakthrough model.

This plan exists so future runs can fill out individual skill/trial narratives in a consistent structure.

## Existing Infrastructure To Preserve

The current skill system already has a working foundation. Future trial work must preserve it unless a later dedicated balance pass explicitly changes it.

Current hard limits and bands:

| Band id | Title | Effective progression role | Rank span | Soft cap | Gate behavior |
| --- | --- | --- | --- | --- | --- |
| `clumsy` | Clumsy | Starting band | 1-30 | 30 | No breakthrough required. |
| `familiar` | Familiar | First unlocked band | 25-55 | 55 | Requires breakthrough at rank 30. |
| `proficient` | Proficient | Second unlocked band | 50-80 | 80 | Requires breakthrough at rank 55. |
| `skilled` | Skilled | Third unlocked band | 75-100 | 100 | Requires breakthrough at rank 80. |
| `mastery` | Mastery | Final current band | 100-125 | 125 | Requires breakthrough at rank 100 and mastery trial support. |

Rules to preserve:

- Skill rank maximum remains 125.
- Breakthrough gates remain 30, 55, 80, and 100.
- Band ids remain `clumsy`, `familiar`, `proficient`, `skilled`, and `mastery`.
- Existing title/milestone handling remains tied to current rank and mastery-trial state.
- Existing track-level gain models and breakthrough source weights remain authoritative until a dedicated balance pass changes them.
- Existing trial records remain valid but are treated as early/simple trial content.

## Current Trial Reality

Current trials support:

- associated skill id
- Echo requirement
- threshold to pass
- current progress
- max potential
- checkpoint labels/thresholds
- rewards
- penalties
- simple pass/fail based on progress and remaining potential

Current trials do not yet support:

- checkpoint-specific pass, soft-fail, and hard-fail bands
- soft-failure save branches
- consecutive soft-failure escalation
- player choice branches
- character-specific RNG modifiers
- attempt cooldowns
- teacher, NPC, institution, scroll, tome, or document sources
- Chronicle event output
- per-skill narrative template structure

## Target Trial Model

A future trial should be a narrative event chain that uses the existing skill bands as its advancement gates.

Each trial should define:

- `trialId`
- `associatedSkillId`
- target band unlock, such as `familiar`, `proficient`, `skilled`, or `mastery`
- rank gate being tested, such as 30, 55, 80, or 100
- eligibility requirements
- attempt cooldown / retry delay
- checkpoint sequence
- narrative beats
- input mode
- RNG/stat/skill weighting profile
- success rewards
- soft-failure consequences
- hard-failure consequences
- Chronicle hooks, when later event owners exist

## Checkpoint Structure

Each checkpoint should eventually define:

- checkpoint id
- label
- narrative prompt
- primary skill weight
- supporting skill weights
- governing stat weights
- environment modifiers
- pass value
- soft-fail value
- optional hard-fail value
- recovery branch id for soft failures
- meaningful player choices, if any

Result bands:

| Result | Meaning |
| --- | --- |
| Pass | Continue on the main route. |
| Soft failure | Branch to a save/recovery event. |
| Hard failure | Trial fails immediately. |

Soft-failure rule:

- A soft failure records the previous failure context.
- A second soft failure in a row is treated as a hard failure.
- A success after a soft failure returns the player to the correct trial path.

## Player Input Modes

Trial content should support three input styles:

| Input mode | Use case |
| --- | --- |
| `automatic` | Early tiers, routine tests, low-choice checks. |
| `limited_choice` | Mid-tier trials with one or two meaningful branch choices. |
| `directed_choice` | Higher-tier or signature trials with multiple meaningful choices across checkpoints. |

Player choices should be sparse and meaningful. They should not become repetitive clicking.

Choices should be simple path choices such as:

- dodge back / dodge to the side
- thrust / slash / parry
- reheat / hammer / quench
- observe / classify / test
- stabilize / operate / prepare remedy

Correctness can be deterministic, RNG-influenced, or context-dependent, but it must be explainable by the scenario and character build.

## Tier-Based Choice Guidance

| Target band | Recommended input density |
| --- | --- |
| `familiar` | Mostly automatic; tutorial-level narration. |
| `proficient` | Limited choice, usually one meaningful decision. |
| `skilled` | Several checkpoints may include choices. |
| `mastery` | Signature trial; choices may meaningfully alter path, risk, or scoring. |

## RNG And Character Weighting

Trials should have RNG, but character build must matter more than luck.

Recommended future balance principle:

- mostly determined by related skill, governing stats, supporting skills, body state, equipment, preparation, teacher/institution support, and environment
- smaller RNG range to preserve uncertainty
- no pure coin-flip advancement gates

Relevant modifier families:

- primary skill rank
- supporting skill ranks
- governing attributes
- fatigue, hydration, injury, intoxication, body-state penalties
- equipment/tool quality
- teacher/NPC support
- institution support
- scroll/tome/document study preparation
- environment and difficulty
- prior soft failure state

## Magical Teaching And Text Sources

Magic progression must eventually include explicit sources for learning. These sources should provide access, study context, or acquisition evidence, not automatic ownership.

Required future source families:

- NPC teachers
- guilds, schools, temples, cults, orders, or institutions
- scrolls
- tomes
- grimoires
- documents/tablets/research notes
- supervised training events

Rules:

- A scroll or teacher should not directly create known-spell ownership without validated acquisition evidence.
- Magic text ownership should not imply spell knowledge by itself.
- NPC teaching should feed explicit training/study/acquisition evidence.
- These routes must eventually connect to known-spell acquisition boundaries without bypassing character-scoped ownership.

## Trial Narrative Fill-Out Template

Use this template for future per-skill/per-trial narrative work:

```text
Skill:
Progression track:
Target band:
Gate rank:
Trial title:
Source type: automatic / teacher / institution / scroll / tome / event
Eligibility:
Retry delay:
Input mode: automatic / limited_choice / directed_choice
Primary skill weights:
Supporting skill weights:
Governing attributes:
Checkpoint list:
  - checkpoint id
  - narrative beat
  - pass value
  - soft-fail value
  - hard-fail value, if any
  - recovery branch, if any
  - player choices, if any
Success result:
Soft-failure result:
Hard-failure result:
Chronicle note:
Renown note:
Legacy note:
```

## Roadmap Placement

This framework should become a mandatory `0.6` readiness pillar, but implementation should remain in the `0.5.x` foundation line until each boundary is planned and validated.

Recommended sequence after the current magic handoff stabilizes:

1. Skill Trial Framework Plan. Landed by this document.
2. Trial schema expansion plan.
3. Pure checkpoint outcome helper.
4. Trial attempt cooldown/readiness helper.
5. Trial narrative content template pass.
6. First concrete skill trial family, preferably one combat, one crafting, one knowledge, and one magic trial.
7. Magic teaching source plan for NPCs, scrolls, tomes, and institutions.
8. Known-spell acquisition source integration for teaching/study routes.
9. Chronicle/Renown hooks for trial outcomes.

## Forbidden Until Explicitly Scoped

- Do not replace the existing five skill bands.
- Do not change the 125 rank maximum.
- Do not change gate ranks without a dedicated balance pass.
- Do not add broad source/schema migration in the same pass as narrative writing.
- Do not make scrolls, tomes, documents, NPCs, institutions, or Legacy data automatically grant skills or spells.
- Do not add UI minigames before pure trial helpers and schemas exist.
- Do not create Chronicle/Renown events before event-owner boundaries exist.
- Do not make trial choices busywork.
