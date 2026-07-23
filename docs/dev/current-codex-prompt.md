# Current Codex Prompt

## Run Identity

`Comparative Checkpoint, Mortal-State, Rescue, Resurrection, And Stakes Research`

Run classification: unversioned bounded external research and repository-integration planning

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(research): compare checkpoint mortality and succession systems`

## Purpose

Perform a deliberately limited comparative research pass before revising Lineage Reborn's accepted save, defeat, death, resurrection, succession, and Prestige authorities.

The research is necessary because the proposed direction materially changes:

1. which saves may be manually loaded;
2. how repeat loading and extreme-RNG fishing are prevented;
3. the distinction between incapacitation, stable critical states, unstable critical states, actual death, magically reversible death, and final lineage closure;
4. how parties, nearby institutions, terrain, enemies, and witnesses affect rescue and body recovery;
5. when resurrection remains possible;
6. when Prestige, estate, Chronicle closure, and heir creation become authoritative;
7. whether multiple Stakes tiers should replace the current single initial `normal_stakes` posture.

This is research and decision-support only. It must not accept a final design, rewrite an authority, restore `0.6.6`, create an implementation prompt, or change runtime behavior.

## Temporary Precedence Note

The active-route lines in `docs/dev/current-gpt-handoff.md` and `docs/dev/historical-version-and-deferred-route-register.md` predate this prompt and are stale only as to the active run identity.

This prompt temporarily controls the active run. All accepted design authorities remain controlling facts and must not be silently overwritten by comparative examples.

## Required Repository State

Read first:

- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
- `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`;
- `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `AGENTS.md`;
- `README.md`.

Relevant source identities:

- accepted defeat-fallback decision commit: `fbd562f3b6dd30ca78d5c418f21149b9af15524f`;
- accepted defeat-fallback decision blob: `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`;
- retained defeat/injury audit blob: `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`;
- held `Version 0.6.6` prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Execution Gate

1. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state.
2. Confirm this prompt is active.
3. Confirm commit `fbd562f3b6dd30ca78d5c418f21149b9af15524f` is an ancestor of `HEAD`.
4. Confirm the accepted defeat-fallback decision resolves to blob `e32ee0eb7a64777e2ca1134600b189d80fd0eafe` and is unmodified in the worktree.
5. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
6. Preserve unrelated work.
7. Confirm reliable external research access exists before making factual claims about other games.
8. If reliable external access is unavailable, do not fabricate or rely on memory. Update only `docs/dev/current-codex-output.md` with a blocked result and stop.

## Proposed Lineage Reborn Direction To Test

Treat the following as the proposal being evaluated, not as accepted authority.

### Checkpoint And Anti-Reroll Proposal

- Manual loading may be limited to checkpoints created after a qualifying major sleep or completed day.
- Short naps need not create manually loadable checkpoints.
- Hidden technical recovery states may exist for crashes or interrupted writes but must not become player-selected rollback points.
- Event outcomes may use committed deterministic seeds or stable draw channels so replaying the same checkpoint and materially identical choices does not reroll rare outcomes.
- Meaningful preparation, route, timing, equipment, party, and tactical changes may alter causal inputs without trivial action-order changes becoming a reroll exploit.
- Prestige, account achievements, Chronicle truth, and other durable projections must remain coherent with the checkpoint containing their source events.

### Proposed Mortal-State Ladder

Evaluate a state model broadly resembling:

```text
active
  -> downed / incapacitated
       -> natural recovery when the threat and injuries permit
       -> continued attack, predation, execution, exposure, or deterioration
       -> critical

critical
  -> stable but aid-required
       -> no immediate death process
       -> cannot return to functional play without aid
  -> unstable
       -> one or more active lethal processes
       -> self-stabilization, basic first aid, professional care, or death

actual death, potentially magically restorable
  -> body recovery and resurrection eligibility
  -> successful restoration
  -> failed, unavailable, abandoned, or expired restoration

final death
  -> terminal character closure
  -> Prestige/Legacy, estate, Chronicle, and heir/succession resolution
```

The research must specifically test whether separating `critical_stable` from `critical_unstable` produces meaningful gameplay or needless complexity.

### Rescue And Context Proposal

A survival/body-recovery resolver may consider:

- whether attackers disengage, execute, feed, guard, capture, or continue attacking;
- territorial versus predatory animal behavior;
- monster and intelligent-enemy goals;
- continuing environmental hazards;
- conscious party members, loyalty, first aid, healing, supplies, carrying capacity, mounts, and escape ability;
- settlement proximity, population, witnesses, patrols, guilds, temples, governments, healers, alchemists, and magical institutions;
- terrain, isolation, weather, travel time, body condition, and resurrection window;
- whether the body can be recovered and transported.

### Stakes-Tier Proposal

Research patterns relevant to a possible three-tier structure such as:

- broad rollback with reduced or absent mortality-derived Prestige;
- sleep-checkpoint rollback with explicit rollback provenance and bounded Prestige consequences;
- no chosen rollback with technical continuity only and the strongest continuity recognition.

The names `Open`, `Anchored`, and `Ironbound` are working examples only. Do not accept names, ids, exact rewards, or availability in this run.

## Research Limit

This is not a market survey.

Use:

- no more than **six games**;
- no more than **two principal sources per game**;
- no more than **four additional cross-game technical or developer sources**;
- a final temporary artifact no longer than approximately **4,000 words**, excluding source metadata and compact tables.

Select games because they provide strong evidence for one or more required patterns. Do not force every game to cover the whole model.

The final selection must collectively cover:

1. at least two commitment, ironman, checkpoint, or restricted-loading systems;
2. at least two downed, unconscious, bleeding, stabilization, or aid-required systems;
3. at least one meaningful continued-threat, party rescue, extraction, or body-recovery system;
4. at least one rare resurrection or post-death restoration system;
5. at least one heir, succession, lineage, retirement, or legacy-continuation system.

Candidate examples may include RimWorld, Kenshi, Battle Brothers, Darkest Dungeon, Wildermyth, Crusader Kings III, XCOM, State of Decay, or another better evidenced comparison. These are examples, not required inclusions.

## Source Quality Rules

Prefer, in order:

1. official manuals, support pages, game guides, patch notes, developer posts, or official wikis;
2. high-quality community wikis when official documentation is insufficient;
3. reputable technical analysis or developer interviews.

Do not use forum anecdotes, unsourced listicles, AI-generated summaries, or memory as primary evidence.

For every material factual claim, preserve:

- game and mechanic;
- source title;
- publisher or site;
- publication/update date when available;
- access date;
- direct URL;
- source-quality classification.

Paraphrase. Use only minimal short quotations when a source's exact terminology is necessary.

If sources conflict, record the conflict rather than choosing the more convenient result.

## Research Questions

### 1. Save And Checkpoint Integrity

For each relevant comparison, determine:

- which states are manually loadable;
- whether saving is continuous, checkpoint-based, sleep/rest-based, slot-based, or ironman;
- whether crash recovery differs from chosen rollback;
- whether loading affects achievements, rankings, rewards, or campaign classification;
- whether the game prevents rerolling by deterministic seeds, committed rolls, fixed encounter state, restricted loading, or another method;
- whether changing action order can unintentionally reseed outcomes;
- which anti-reroll technique remains understandable and fair to players.

### 2. Downed, Unconscious, And Critical States

Determine whether compared games distinguish:

- unable to act but naturally recoverable;
- unconscious but stable;
- bleeding out or otherwise unstable;
- aid-required but not immediately dying;
- stabilization versus definitive treatment;
- self-stabilization or natural coagulation;
- multiple independent lethal processes such as bleeding, poison, suffocation, exposure, or continued attack;
- HP recovery while consciousness or functional recovery remains unresolved.

Explicitly answer:

> Is a separate stable aid-required critical state mechanically meaningful, or can the same result be represented more clearly as an unconscious state plus independent injury and stabilization requirements?

### 3. Continued Threat And Rescue

Determine how games handle:

- enemies continuing to attack a downed target;
- executions, predation, capture, abandonment, or rescue;
- party members extracting or carrying incapacitated characters;
- location, population, faction, patrol, or institutional effects on survival;
- deterministic versus random rescue resolution;
- avoiding opaque rescue rolls that feel arbitrary.

### 4. Actual Death, Bodies, And Resurrection

Determine how games distinguish:

- catastrophic immediate death;
- death following failed stabilization;
- corpse or body state;
- body recovery and transport;
- resurrection windows or eligibility;
- ordinary healing versus resurrection;
- rare items, healers, institutions, costs, or conditions;
- final closure after restoration becomes impossible or is declined.

### 5. Succession, Legacy, And Reward Settlement

Determine how games handle:

- heir or successor continuation;
- retirement versus death;
- inherited assets, relationships, traits, or world state;
- when final rewards or lineage recognition settle;
- whether rollback disqualifies or reduces achievements, rankings, or legacy rewards;
- how the system avoids rewarding a death that is later rolled back.

### 6. Player Communication

Identify effective patterns for explaining:

- current life state;
- active lethal processes;
- stabilization needs;
- care level required;
- remaining time or uncertainty;
- rescue likelihood inputs;
- resurrection eligibility;
- checkpoint and rollback consequences;
- when final death and heir creation become irreversible.

## Required Analysis

For every observed mechanic, classify it as one of:

- `directly_transferable_principle`;
- `adaptable_pattern`;
- `caution_or_antipattern`;
- `not_applicable`.

Do not recommend copying proprietary terminology, exact formulas, percentages, timers, or content.

Produce a cross-game matrix covering:

- save topology;
- anti-reroll method;
- downed/critical state depth;
- stabilization and care;
- threat continuation;
- rescue/body recovery;
- resurrection;
- succession/legacy;
- reward or achievement integrity;
- player-facing clarity;
- principal lesson for Lineage Reborn.

Then provide bounded answers to these Lineage Reborn questions:

1. Should manually loadable sleep checkpoints be sufficient, or must deterministic event commitment also exist?
2. Should technical crash recovery be hidden and nonselectable?
3. Should stable aid-required critical state be explicit, derived, or omitted?
4. Should stabilization be basic first aid while definitive recovery remains a separate care requirement?
5. Should lethal processes own separate timers rather than one universal bleed-out timer?
6. Which context inputs are useful for rescue without creating an opaque all-purpose RNG roll?
7. When should actual death become final death?
8. How should resurrection eligibility remain rare without becoming arbitrary?
9. How should rollback provenance interact with Prestige without creating exploitable account-side rewards?
10. Does a three-tier Stakes model have enough mechanical distinction to justify three public choices?

## Guardrails

- Comparative mechanics are evidence, not authority.
- Do not revise accepted decisions in this run.
- Do not assume popularity proves suitability.
- Do not infer that a mechanic is patented, standard, or legally safe without a qualified source.
- Do not produce legal conclusions.
- Do not recommend exact numerical balance.
- Do not research monetization, sales, reviews, player counts, or general market positioning.
- Do not expand into a complete medical simulation.
- Do not create a comprehensive psychiatric, injury, disease, spell, healer, or resurrection catalog.
- Do not treat HP zero as synonymous with actual death.
- Do not weaken the accepted requirement that generic healing cannot imply regrowth or resurrection.
- Do not silently reopen restricted-Stakes terminal closure; instead flag where the new proposal would require an explicit superseding decision.
- Do not persist external source text beyond necessary citations and short terminology notes.

## Required Output

On successful completion, modify exactly:

1. create `docs/dev/tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md`;
2. update `docs/dev/current-codex-output.md`.

The temporary research artifact must contain:

1. execution and access confirmation;
2. research necessity statement;
3. selected games and selection rationale;
4. source ledger with quality classifications;
5. cross-game comparison matrix;
6. save/checkpoint and anti-reroll findings;
7. mortal-state and stabilization findings;
8. continued-threat, rescue, and body-recovery findings;
9. resurrection and final-closure findings;
10. succession, legacy, and reward-integrity findings;
11. player-communication findings;
12. directly transferable principles;
13. adaptable patterns;
14. cautions and anti-patterns;
15. bounded answers to the ten Lineage Reborn questions;
16. explicit unresolved decisions;
17. explicit non-decisions and research limitations.

Update `docs/dev/current-codex-output.md` with:

- source run identity;
- branch/start/end state;
- exact changed paths;
- whether external access was available;
- selected comparison set;
- strongest evidence-backed findings;
- findings that support the proposal;
- findings that argue for simplification or caution;
- conflicts with current accepted authorities;
- exact decisions still requiring human/GPT acceptance;
- held `0.6.6` confirmation;
- checks run;
- next recommended decision run.

The next recommended run should be a documentation-only combined decision or authority-revision pass. It must not be a runtime implementation prompt or the `0.6.6` restoration gate unless the research finds no material reason to revise current Stakes/death authority.

## Forbidden Scope

Do not modify:

- this prompt;
- current GPT handoff;
- route register;
- roadmap;
- sequenced plan;
- continuity brief;
- accepted design authorities;
- retained temporary defeat/injury audit;
- held `0.6.6`;
- retained `0.6.7` artifacts;
- runtime;
- shared types;
- schemas;
- saves;
- migrations;
- tests;
- UI;
- content;
- package manifests;
- generated files;
- gameplay.

## Stop Conditions

Stop after the exact two documentation outputs.

Do not:

- accept final Stakes names or ids;
- accept exact save, checkpoint, seed, timer, rescue, resurrection, Prestige, or succession rules;
- rewrite the Normal Stakes defeat decision;
- repair projection/persistence semantics;
- implement deterministic RNG;
- implement sleep saves;
- implement mortal states;
- implement first aid, treatment, rescue, body recovery, resurrection, heirs, or Prestige changes;
- assign a release or primary version;
- restore `0.6.6`;
- create an implementation prompt;
- exceed the research limits without recording why the run must stop instead.

Report the ending commit, exact changed paths, repository state, source-access status, and any contradiction or access failure that prevented completion.
