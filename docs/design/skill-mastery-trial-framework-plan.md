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

## Magic Learning And Study Event Framework

Magic learning should use the same checkpoint-style advancement architecture as skill trials, but it should be modeled as a parallel study-event path instead of a replacement for skill band progression.

Purpose:

- make learning magic an event-driven progression activity
- distinguish self-study, paid teaching, and institutional study
- support scroll/tome/grimoire learning without automatic spell ownership
- feed future known-spell acquisition evidence
- preserve the current character-scoped spell ownership rules

### Magic Learning Flow

```text
Access Source
  -> Study Event
  -> Checkpoint Resolution
  -> Study Completion
  -> Acquisition Evidence
  -> Known Spell Ownership
  -> Cast Readiness
  -> Runtime Casting
```

Access creates opportunity. Study creates progress. Only validated acquisition evidence should later create known-spell ownership.

### Study Source Modes

| Source mode | Cost / access profile | Mechanical identity |
| --- | --- | --- |
| `self_study` | Cheapest and most available; requires a scroll, tome, grimoire, notes, or prior exposure. | Slowest progress, highest misunderstanding risk, weakest recovery help. |
| `paid_teacher` | Requires an NPC teacher, cost, availability, and possibly reputation or prerequisites. | Moderate progress, better recovery chance, reduced hard-failure risk. |
| `institutional_study` | Requires admission, fees, sponsorship, rank, renown, or faction/institution access. | Most consistent progress, strongest checkpoint support, best advanced-study eligibility. |
| `supervised_ritual` | Requires a teacher, institution, cult, order, or specialist environment. | High-stakes study for complex or dangerous spells; strong support but severe failure consequences. |
| `field_discovery` | Tied to exploration, ruins, artifacts, rare events, or quest discoveries. | Irregular access, high variance, strong Chronicle/Renown potential later. |

### Magic Study Inputs

Study events should be weighted by:

- `INT` for comprehension, theory, pattern reading, and correction
- `WIS` for judgment, interpretation, caution, and diagnosis
- `SPT` for control, stability, focus, and endurance
- school-specific attributes where appropriate
- associated magic school skill rank
- core magic skill rank, if present
- arcane or domain knowledge support
- teacher quality
- institution quality
- text/source quality
- conduit/catalyst familiarity, if relevant later
- fatigue, injury, hydration, intoxication, stress, and other body-state penalties
- prior soft-failure state

### School-Specific Weighting Examples

| School / study type | Likely primary weights | Notes |
| --- | --- | --- |
| Elemental | `INT`, `SPT`, elemental school skill, arcane knowledge | Pattern control, force shaping, stability. |
| Healing / divine | `WIS`, `SPT`, healing/divine skill, anatomy or doctrine support | Diagnosis, intent, safe channeling. |
| Illusion / influence | `INT`, `CHA`, school skill, perception/social support | Pattern deception, timing, presentation. |
| Warding / protection | `WIS`, `SPT`, warding skill, symbol/lore support | Structure, patience, stability. |
| Dark / forbidden | `INT`, `SPT`, forbidden knowledge, resistance/support context | Higher hard-failure risk and stricter access gates. |
| Utility / ritual | `INT`, `WIS`, relevant school skill, tool/text quality | Methodical interpretation and execution. |

These examples are planning guidance only. Final weights should be authored per study event or spell family.

### Study Checkpoints

A magic study event should eventually define checkpoints such as:

- read the theory
- identify the pattern
- prepare the medium
- shape the flow
- stabilize the effect
- recover from feedback
- complete the working

Each checkpoint should support:

- narrative prompt
- pass value
- soft-fail value
- hard-fail value, when appropriate
- recovery branch
- optional player choices
- source-mode modifiers
- teacher/institution/source-quality modifiers

### Magic Soft Failure And Recovery

Soft failures should represent partial misunderstanding or instability, not immediate total collapse.

Examples:

- misread glyph
- unstable flow
- flawed pronunciation
- imprecise gesture
- drifting focus
- partial feedback
- theory contradiction

Recovery branches may include:

- re-read the passage
- ask the teacher
- meditate and stabilize
- re-draw the glyph
- reduce the effect scale
- replace the catalyst
- pause and rest

Rules:

- A soft failure branches to a recovery/save event.
- A second consecutive soft failure becomes a hard failure.
- A success after a soft failure returns the player to the main study route.

### Magic Hard Failure

Hard failures should immediately fail the study attempt and start a retry delay.

Possible hard-failure outcomes:

- severe magical feedback
- mana burn
- broken focus
- corrupted working
- catalyst destruction
- damaged text/source
- institutional censure
- teacher refusal until cooldown ends
- temporary study block

Hard failure consequences should stay narrative and readiness-level until effect owners exist. Do not add injury, item destruction, resource loss, reputation loss, or event creation without later owner systems.

### Study Cooldowns And Delays

Magic study should include retry delays so players cannot spam attempts.

Future cooldowns should depend on:

- spell complexity
- source mode
- failure type
- teacher/institution policy
- body state
- available materials
- current study fatigue

Suggested planning scale:

| Spell complexity | Self-study delay | Teacher delay | Institutional delay |
| --- | ---: | ---: | ---: |
| Simple | short | shorter | shortest |
| Intermediate | moderate | short/moderate | short |
| Advanced | long | moderate | moderate |
| Expert | very long | long | moderate/long |
| Master / forbidden | special access required | special access required | special access required |

Exact durations should be authored later after time-scale and economy balance are reviewed.

### Spell Complexity

Study events should support spell complexity tiers:

- `simple`
- `intermediate`
- `advanced`
- `expert`
- `master`
- `forbidden`

Complexity should affect:

- checkpoint count
- pass thresholds
- soft-failure margin
- hard-failure severity
- retry delay
- access requirements
- teacher/institution requirements
- source quality requirements
- Chronicle/Renown significance later

### Player Choice In Magic Study

Magic study choices should be sparse and scenario-specific.

Examples:

- stabilize the pattern / push more power
- re-check the diagram / trust memory
- ask the teacher / continue alone
- simplify the working / attempt full structure
- replace the catalyst / risk the current one
- pause to meditate / continue before focus fades

Choice correctness can be:

- deterministic from the narrative clue
- weighted by character build
- affected by teacher/institution support
- affected by source quality
- affected by previous checkpoint results

Choices should not become routine clicking.

### Chronicle, Renown, And Legacy Notes

Magic study events should eventually support outputs for:

- learned a spell
- failed a dangerous study attempt
- completed an institutional examination
- earned recognition from a teacher/order/school
- discovered a rare magical pattern
- completed a forbidden or high-risk study event

These are planning hooks only until Chronicle, Renown, institution, and Legacy owner boundaries are implemented.

### Spell Ownership Boundary

Magic study does not equal known-spell ownership by itself.

A completed study event should produce future acquisition evidence. That evidence can later feed character-scoped known-spell ownership helpers.

Forbidden inference:

- owning a scroll does not mean knowing the spell
- owning a tome does not mean knowing the spell
- paying a teacher does not mean knowing the spell
- entering an institution does not mean knowing the spell
- seeing a spell in a catalog or Arcane Compendium does not mean knowing the spell
- Legacy access does not mean knowing the spell

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

## Magic Study Fill-Out Template

Use this template for future spell-learning study events:

```text
Spell:
School / family:
Complexity:
Study event title:
Source mode: self_study / paid_teacher / institutional_study / supervised_ritual / field_discovery
Access source:
Eligibility:
Cost / admission / reputation requirement:
Retry delay:
Input mode: automatic / limited_choice / directed_choice
Primary attributes:
Associated magic skills:
Supporting knowledge skills:
Teacher or institution modifiers:
Source text quality:
Checkpoint list:
  - checkpoint id
  - narrative beat
  - pass value
  - soft-fail value
  - hard-fail value, if any
  - recovery branch, if any
  - player choices, if any
Study success result:
Soft-failure result:
Hard-failure result:
Acquisition evidence note:
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
7. Magic study event plan for self-study, paid teachers, institutions, scrolls, tomes, grimoires, and field discoveries.
8. Magic teaching source plan for NPCs, scrolls, tomes, and institutions.
9. Known-spell acquisition source integration for teaching/study routes.
10. Chronicle/Renown hooks for trial and study outcomes.

## Forbidden Until Explicitly Scoped

- Do not replace the existing five skill bands.
- Do not change the 125 rank maximum.
- Do not change gate ranks without a dedicated balance pass.
- Do not add broad source/schema migration in the same pass as narrative writing.
- Do not make scrolls, tomes, documents, NPCs, institutions, or Legacy data automatically grant skills or spells.
- Do not add UI minigames before pure trial helpers and schemas exist.
- Do not create Chronicle/Renown events before event-owner boundaries exist.
- Do not make trial choices busywork.
