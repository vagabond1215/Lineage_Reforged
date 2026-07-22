# Restricted Stakes Continuity, Death Closure, And Prestige Decision

Date: 2026-07-22

Status: accepted focused design authority; documentation only; no runtime, save, death, Chronicle, Prestige, succession, UI, schema, or balance implementation is authorized

## 1. Purpose

Define the accepted direction for a future restricted-Stakes campaign mode commonly described as Hardcore without conflating it with:

- Favored, Mortal, or Forsaken difficulty tuning;
- Heroic World or Grim World system selection;
- ordinary Normal Stakes defeat behavior;
- the overloaded legacy `runDifficulty.hardcore` Boolean;
- the unrelated combat-profile `preferredMode: normal | hardcore` field.

The final player-facing name remains open. `Ironbound` remains a working title only.

This decision accepts the mode's save-continuity, rollback, death-closure, and Prestige principles. Exact schemas, cadence, formulas, event catalogs, succession behavior, and implementation versions remain deferred.

## 2. Precedence

This decision is more specific than `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md` for the future restricted-Stakes mode's:

- authoritative save posture;
- player rollback prohibition;
- live or semi-live autosave purpose;
- technical crash-recovery boundary;
- terminal character closure after actual death;
- read-only post-death access;
- death-triggered Prestige settlement;
- public, legal, reputational, publicity, disgrace, and martyrdom factors.

It does not supersede that broader decision for:

- Difficulty, World Rules, and Stakes separation;
- difficulty preset meanings;
- Heroic World and Grim World meanings;
- the rule that Forsaken and Grim World do not automatically activate restricted Stakes;
- Grim World module families;
- Normal Stakes behavior.

It does not supersede `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md` when that future decision is created. The campaign-rules decision should define only accepted initial identity and migration; this focused decision controls later restricted-Stakes semantics.

## 3. Core Identity

The restricted-Stakes mode is a Stakes rule.

It is not:

- a difficulty scalar;
- a world-simulation toggle;
- a combat preference;
- an achievement modifier;
- a hidden consequence of selecting Forsaken;
- a hidden consequence of selecting Grim World.

Conceptually:

```text
Difficulty
  -> forgiveness and tuning

World Rules
  -> simulated systems

Restricted Stakes
  -> authoritative saving, rollback, irreversible death, and terminal continuity
```

The mode may later combine with any implemented Difficulty and World Rules combination that has a complete compatibility contract.

## 4. One Authoritative Continuity Save

Restricted Stakes uses one authoritative campaign continuity stream.

The purpose of saving is:

- session continuation;
- interruption recovery;
- device or application restart;
- technical crash recovery;
- preservation of the current authoritative campaign state over time.

The purpose is not player-selected rollback.

Accepted posture:

- ordinary manual save slots are disabled for this mode;
- quick-save and quick-load rollback are disabled;
- loading an older chosen state is disabled;
- save-scumming through prior checkpoints is unsupported;
- quitting and later continuing resumes the latest authoritative state;
- state is saved live or semi-live through owner-approved deterministic checkpoints;
- accepted commands and meaningful state transitions must become durable without requiring the player to remember to save;
- save-and-exit may force an immediate authoritative checkpoint but does not create a reloadable branch.

The exact implementation may use:

- transactional autosaves;
- a journal;
- append-only events plus snapshots;
- rotating technical generations;
- another save-owner-approved mechanism.

Those are implementation choices. The player-facing invariant is one current continuity state and no chosen rollback.

## 5. Autosave Cadence Direction

The future save owner must select a cadence that is durable without creating excessive writes or exploitable gaps.

Candidate trigger classes include:

- accepted player commands;
- inventory, currency, equipment, quest, combat, travel, and relationship mutations;
- encounter start and resolution boundaries;
- location or scene transitions;
- periodic elapsed-time checkpoints;
- explicit save-and-exit;
- actual death and terminal closure.

The exact cadence is deferred.

Required invariants:

- deterministic execution and preview boundaries remain authoritative;
- an action cannot be rerolled by closing the application after seeing its result;
- an autosave cannot partially persist a transaction;
- a failed write cannot silently destroy the last verified state;
- a crash cannot produce a user-selectable historical save ladder.

## 6. Technical Recovery Is Not Gameplay Rollback

Crash, storage corruption, interrupted writes, and platform failure require protection.

Restricted Stakes therefore permits hidden technical recovery generations or journals when they exist solely to restore the most recent verified authoritative state.

Technical recovery must not provide a normal UI for selecting an earlier favorable state.

Accepted boundary:

```text
technical failure
  -> validate latest generation
  -> recover latest valid authoritative state
  -> record recovery provenance where practical

player dislikes outcome
  -> no rollback
```

A technical recovery may restore the immediately preceding verified generation only when the latest generation is invalid or incomplete. It must not be usable as a discretionary rewind mechanic.

Exact recovery depth, storage strategy, and audit trail remain save-owner decisions.

## 7. Defeat Versus Death

Restricted Stakes makes **actual death irreversible**. It does not require every HP-zero result in every context to be death.

The health/combat/event owner still distinguishes:

- incapacitation;
- defeat;
- rescue;
- capture;
- retreat;
- severe injury;
- actual death.

Normal Stakes treats ordinary HP zero as nonterminal defeat according to its accepted contract.

Restricted Stakes may use harsher context-owned death likelihood or consequences when later accepted, but this decision does not redefine all HP-zero events as death.

Once an authoritative owner resolves actual character death under restricted Stakes, the result is terminal for that character.

## 8. Immediate Terminal Save Flag

Actual restricted-Stakes death must immediately create and persist a terminal character state.

Conceptually:

```text
actual death accepted
  -> commit terminal death record atomically
  -> flag character continuity as closed
  -> prohibit further gameplay mutation for that character
  -> settle Chronicle, estate, Prestige, and later succession inputs
  -> expose informational read-only access
```

Requirements:

- death cannot be escaped by closing the application before a later manual save;
- death cannot be reversed by loading an older save;
- all live character commands become unavailable after terminal closure;
- the terminal state must survive restart and save discovery;
- old or copied save material cannot reopen the character as active;
- terminal closure and Prestige settlement must be idempotent;
- duplicate loading or recovery cannot pay Prestige twice;
- technical corruption recovery must preserve the terminal state once a verified death transaction exists.

## 9. Informational-Only Character Access

A dead restricted-Stakes character is not deleted from the player's history.

The closed character remains available through an informational projection such as:

- Chronicle summary;
- biography;
- lineage and house relations;
- final attributes and developed condition;
- major achievements and failures;
- possessions, estate, debts, titles, offices, and allegiances where allowed;
- cause, place, witnesses, and circumstances of death;
- public and legal reputation at death;
- resulting Prestige settlement;
- maps, discoveries, journals, or records where inheritance rules permit later use.

The exact informational surfaces remain UI and Chronicle decisions.

The invariant is:

- read-only historical access remains;
- active character play does not.

The character's terminal save or archival snapshot must not be physically deleted merely because the character died.

## 10. Character, House, And Line Continuity

Restricted-Stakes death closes the character, not necessarily the entire account, house, lineage, or campaign world.

Possible later continuation models include:

- begin a successor in the same house or line;
- continue through an heir;
- select another eligible household member;
- preserve the world and start a new linked character;
- end the campaign when no accepted successor exists.

This decision does not select the exact succession model.

It establishes that terminal character closure and broader lineage/campaign continuation are separate concerns.

Prestige settlement must be capable of affecting the relevant account, house, line, estate, or Legacy owner even though the dead character can no longer act.

## 11. Death Does Not Zero Prestige

The legacy `deathZeroesPrestige` posture is rejected for the future restricted-Stakes mode.

Every restricted-Stakes character who dies receives some nonzero Prestige or Legacy recognition for the completed life and campaign history.

Death triggers settlement; it does not erase all accumulated significance.

A disgraced death may sharply reduce the final award, but the result retains a positive floor.

A celebrated, heroic, sacrificial, or martyring death may increase the final award.

Exact minimums, caps, formulas, and currencies remain deferred.

## 12. Prestige Settlement Pipeline

The future Prestige owner should resolve a bounded terminal settlement equivalent to:

```text
completed-life significance
  + achievements and offices
  + house, lineage, and world impact
  + death-circumstance assessment
  + public-perception assessment
  + legal-perception assessment
  + publicity and evidence assessment
  + martyrdom, sacrifice, disgrace, or infamy assessment
  -> bounded nonzero Prestige settlement
```

This is a factor model, not an accepted arithmetic formula.

Prestige must not depend only on the final combat encounter. A long life remains relevant even when death is ignominious.

The death circumstances may materially alter, but not erase, the character's completed-life value.

## 13. Distinct Death-Assessment Factors

### 13.1 Manner and cause of death

Candidate factors include:

- combat;
- execution;
- assassination;
- illness;
- starvation or exposure;
- accident;
- self-sacrifice;
- betrayal;
- criminal activity;
- public duty;
- rescue of others;
- reckless negligence;
- abandonment of obligations;
- defense of household, polity, faith, settlement, or companions.

The cause alone does not determine moral or social meaning. Context matters.

### 13.2 Conduct leading to death

The resolver may consider:

- lawful duty;
- oath fulfillment or betrayal;
- cowardice or courage;
- unnecessary cruelty;
- protection of innocents;
- personal gain;
- sacrifice;
- recklessness;
- responsibility for preventable harm;
- accepted cultural, religious, military, guild, household, or political obligations.

These judgments must derive from recorded actions, relationships, laws, customs, and events rather than an arbitrary global morality roll.

### 13.3 Public perception

Public reputation is distinct from legal judgment.

Examples:

- an outlaw may be admired by common people;
- a lawful official may be despised publicly;
- a vigilante may be condemned institutionally but celebrated locally;
- a defeated ruler may be mocked, mourned, or mythologized;
- a Robin Hood-like figure may receive negative legal standing and positive popular Prestige.

Public perception may vary by settlement, region, class, faction, culture, faith, and affected group.

No one universal public opinion is required.

### 13.4 Legal and institutional perception

Legal perception may consider:

- conviction or accusation;
- lawful service;
- treason;
- outlaw status;
- pardon;
- office;
- military duty;
- guild or religious judgment;
- jurisdiction;
- whether the authority was considered legitimate by the relevant audience.

Legal condemnation is not automatically universal disgrace. Legal praise is not automatically public admiration.

### 13.5 Publicity and information reach

The effect of an act depends partly on whether it became known.

Candidate inputs include:

- witnesses;
- evidence;
- testimony credibility;
- written records;
- official proclamations;
- rumors;
- songs, memorials, sermons, or propaganda;
- geographic reach;
- social importance of observers;
- suppression or distortion of news;
- elapsed time before settlement if delayed information is supported.

A private act may affect close companions or household memory without creating broad public Prestige.

A highly public act may produce larger positive or negative effects.

### 13.6 Disgrace

Potential disgrace factors include:

- betrayal of trusted companions or sworn obligations;
- publicly exposed cowardice under accepted duty;
- atrocities;
- fraud or corruption that materially harmed dependents;
- abandoning a house, settlement, army, crew, or family in crisis;
- a humiliating death caused by notorious misconduct.

Disgrace may reduce terminal Prestige substantially but must not reduce the settlement to zero.

Disgrace must be evidence- and audience-aware. Secret misconduct does not create universal public disgrace unless it becomes known, though it may affect private, divine, magical, or Chronicle-owned evaluations where separately accepted.

### 13.7 Martyrdom and sacrifice

A death may increase Prestige when the character knowingly accepts severe risk or death for a cause recognized by an audience.

Candidate martyrdom factors include:

- protecting others;
- refusing an unjust command at fatal cost;
- dying for a faith, polity, household, movement, or principle;
- buying time for escape or victory;
- exposing corruption or danger despite lethal retaliation;
- a public execution that strengthens the condemned character's cause;
- sacrifice whose meaning becomes widely known.

Martyrdom is not automatic merely because death occurred during a cause-related action. Intent, consequence, evidence, audience, and resulting narrative matter.

## 14. Multiple Audience Resolution

Prestige should not collapse every audience into one moral score.

A future owner may track or derive distinct assessments such as:

- household or lineage memory;
- companion perception;
- local public opinion;
- regional or cultural reputation;
- faction standing;
- legal standing by jurisdiction;
- religious standing;
- elite or institutional reputation;
- broad legendary reputation.

The final account/house/Legacy payout may aggregate these through an accepted bounded rule while retaining explanatory detail.

The player should be able to understand why a death increased or reduced Prestige.

## 15. Causality And Anti-Exploit Requirements

Restricted-Stakes Prestige must satisfy:

- no rerolling the death outcome through reload;
- no duplicate payout through repeated terminal processing;
- no farming martyrdom through trivial self-destruction;
- no universal positive multiplier merely for dying in combat;
- no hidden disgrace without recorded causal evidence;
- no global legal judgment detached from jurisdiction;
- no public-opinion modifier when nobody plausibly knows what occurred;
- no post-death save mutation that changes the authoritative cause after settlement;
- no deletion of a disliked dead character to reroll account history;
- deterministic settlement for the same state, evidence, and rules version.

A martyrdom or sacrifice bonus requires meaningful stakes, accepted causal effect, and sufficient audience/evidence conditions.

## 16. Player Presentation

Before campaign creation, the restricted-Stakes warning must state plainly that:

- one authoritative continuity save is maintained;
- prior saves cannot be loaded for rollback;
- autosaving is continuous or frequent;
- actual death permanently closes the character;
- the dead character remains viewable but not playable;
- Prestige is settled at death and may rise or fall based on conduct, reputation, law, publicity, disgrace, and martyrdom;
- technical crash protection does not provide discretionary rollback.

After death, the informational summary should explain:

- what happened;
- why the death was terminal;
- what audiences knew or believed;
- how legal and public assessments differed;
- what increased or reduced Prestige;
- what was transferred to house, line, estate, Chronicle, or Legacy;
- whether a successor route is available when later implemented.

## 17. Difficulty And World-Rule Interaction

Restricted Stakes does not change authored truth merely because it is selected.

Difficulty may still tune:

- challenge;
- recovery;
- resource pressure;
- warning clarity;
- death-risk inputs where their owners permit it.

World Rules may still determine which hazards, institutions, diseases, crimes, and other systemic risks exist.

Restricted Stakes determines:

- no chosen rollback;
- authoritative continuity saving;
- irreversible actual death;
- terminal character closure;
- death-time Prestige settlement.

Forsaken plus Restricted Stakes may be extremely demanding but remains a combination of separate axes.

Grim World plus Restricted Stakes adds more systemic causes and contexts but does not alter the save/death owner boundary.

Favored plus Restricted Stakes remains conceptually valid: the world may be forgiving while actual death remains irreversible.

## 18. Ownership

| Concern | Owner |
|---|---|
| restricted-Stakes identity | campaign-rules/Stakes owner |
| authoritative continuity save | save owner |
| autosave cadence and transactions | save owner plus command/event owners |
| crash/corruption recovery | save owner |
| defeat versus actual death | combat, health, event, and death-resolution owners |
| terminal character closure | Stakes/run-lifecycle owner |
| read-only dead-character projection | Chronicle/UI owners |
| completed-life significance | Chronicle/achievement/Legacy owners |
| death-circumstance facts | combat, event, health, law, and world owners |
| public perception | reputation/social/Knowledge/event owners |
| legal perception | law/polity/institution owners |
| publicity and evidence | Knowledge/news/rumor/Chronicle owners |
| Prestige settlement | Prestige/Legacy owner |
| estate and inheritance | estate/household/lineage owners |
| succession | future lineage/campaign-continuity owner |

No save owner independently invents moral meaning. No Prestige owner rewrites the factual cause of death. No UI projection changes the terminal state.

## 19. Required Later Validation

A future implementation must prove:

- only one active continuity state exists for the character;
- prior player-chosen rollback is unavailable;
- save-and-exit resumes the latest state;
- accepted commands are durably committed at defined boundaries;
- interrupted writes recover the latest verified state;
- crash recovery cannot be used as ordinary rollback;
- actual death commits atomically and cannot be escaped by closing the application;
- terminal state blocks gameplay commands;
- dead-character information remains accessible;
- old or copied save material cannot reactivate the character;
- Prestige settlement occurs exactly once;
- every death yields a positive Prestige floor;
- disgrace can reduce but not erase Prestige;
- martyrdom can increase Prestige only under meaningful causal and evidence conditions;
- public and legal assessments may disagree;
- publicity limits broad reputation effects;
- historical facts and death cause remain deterministic across load and projection;
- difficulty and World Rules remain independent axes;
- Normal Stakes behavior is unchanged by this mode's existence.

## 20. Deferred Decisions

The following remain open:

- final player-facing mode name and machine id;
- exact autosave cadence;
- exact journal/snapshot/rotation strategy;
- exact technical recovery depth;
- whether network or cloud synchronization exists;
- exact death-resolution contexts and lethality rules;
- party and companion permanent-death rules;
- exact succession and same-world continuation rules;
- exact estate and inheritance transfer;
- exact Prestige base, floor, caps, curves, and formulas;
- exact public, legal, religious, factional, and household reputation aggregation;
- exact publicity/news propagation implementation;
- exact martyrdom and disgrace thresholds;
- exact achievements and eligibility rules;
- implementation version and package boundaries.

## 21. Explicit Non-Decisions

This decision does not:

- add a restricted-Stakes id to live contracts;
- accept `Ironbound` as the final name;
- modify Normal Stakes;
- make HP zero automatically equal death;
- make Forsaken or Grim World activate restricted Stakes;
- implement autosaves or disable loading;
- modify existing save slots;
- close any current character;
- alter Prestige values;
- add public-opinion, law, news, martyrdom, or disgrace runtime;
- define succession;
- authorize runtime, schema, save, UI, test, or content changes.

## 22. Next Consumers

- the active campaign-rules identity and Normal Stakes acceptance decision should cite this as the controlling future restricted-Stakes direction while keeping only `normal_stakes` in the initial contract;
- a future save-authority decision should select the continuity and recovery mechanism;
- a future death/succession decision should define actual death, party permanence, and successor control;
- a future Prestige/Legacy decision should define the terminal settlement model and audience inputs;
- implementation must not begin until those owner contracts and a final campaign-rule identity are accepted.