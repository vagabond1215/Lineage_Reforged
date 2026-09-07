# Combat AI Scoring And Test-Coverage Current-State Audit

Date: 2026-08-03

Execution surface: ChatGPT through GitHub Connector only

Source head inspected: `8214327906fbc2edf7ab4d02168cf94b3abc7e6f`

Status: `CANDIDATE_INTEGRATION`; documentation-only evidence; no implementation permission

## Executive Result

The repository has a real deterministic weighted combat-AI foundation. It is not an ordered gambit interpreter, and current repository evidence does not prove that every advertised tactics field materially affects action or target selection.

Classification:

`WEIGHTED_TACTICS_RUNTIME_EXISTS; ORDERED_GAMBITS_AND_COMPLETE_BEHAVIOR_COVERAGE_DEFERRED`

## Live Authority

Current shared and engine surfaces provide:

- AI and manual control modes;
- tactical roles and preference bands;
- spell-school, element, tier, buff, debuff, conservation, engagement, damage, healing, interrupt, and weakness preferences;
- target preferences using resources, threat, casting state, interruptibility, current player target, and explicit focus/ignore/priority directives;
- static combat-role and tactics-preset content;
- deterministic default combat, party, player-combat-profile, and UI state;
- candidate actions sourced from item-use grants, spells, abilities, monster packages, and a basic melee fallback;
- active-tick AI action and target selection;
- manual command override and queued-action integration.

These are functioning runtime inputs. Static preset existence does not by itself prove runtime effect, balanced influence, or player-facing usability.

## Scoring Boundary

The current AI is a weighted scorer rather than an ordered rule program.

A future audit or implementation must preserve the distinction between:

- candidate eligibility;
- action-family classification;
- preference and role weighting;
- resource affordability and conservation;
- target eligibility;
- target ranking;
- deterministic tie-breaking;
- manual override and AI resumption;
- action execution and outcome resolution.

No single preference should silently grant eligibility, bypass costs, invent targets, or override unsupported action hooks.

## Current Evidence Strength

Repository source supports the following claims:

1. Combat AI is invoked during active combat ticks for eligible actors.
2. Busy, defeated, incapacitated, controlled, manually overridden, or not-ready actors are excluded.
3. The engine selects from bounded candidate actions and targets.
4. Role and preference values contribute to scoring.
5. Focus, ignore, priority, and deprioritized target directives are represented.
6. Manual commands can temporarily replace AI control.
7. Static allied and enemy tactics presets exist.

Connector inspection does not establish fresh executable proof for all of those paths.

## Coverage Gaps

The repository should not claim complete tactics support until focused deterministic fixtures prove at least:

- healing choice with no wounded ally, one wounded ally, and multiple wounded allies;
- interrupt choice inside and outside the valid interrupt window;
- MP and stamina conservation thresholds at, below, and above boundaries;
- each role-specific scoring adjustment;
- preferred and disfavored spell schools and elements;
- melee, ranged, and magic engagement preferences;
- focus, ignore, priority, and deprioritized directives;
- current-player-target preference;
- HP, MP, stamina, maximum-resource, threat, casting, and interruptibility target rules;
- stable action and target tie-breaking;
- no affordable action;
- no valid target;
- unsupported or missing action grants;
- manual override duration and deterministic AI resumption;
- queued-action replacement versus append behavior;
- identical-state replay producing identical choice;
- full allied NPC-party behavior once durable allied actors exist.

Existing broad combat, hook, spawn, equipment, and content tests are surrounding evidence, not substitutes for a named scoring and target-ranking suite.

## Ordered Gambit Boundary

A literal gambit system remains absent. A future decision must define:

- rule identity and ownership;
- condition vocabulary and admitted facts;
- action references and eligibility;
- ordering, first-match, fallthrough, and conflict semantics;
- disabled, invalid, blocked, and unavailable rules;
- relation to weighted roles, preferences, focus directives, and manual commands;
- deterministic evaluation timing;
- persistence, migration, and per-member ownership;
- explanation and debugging projections;
- bounded complexity and anti-loop behavior.

Do not describe the current weighted scorer as an ordered gambit interpreter.

## Party Dependency

Current party and allied/guest shapes do not establish a durable recruited companion roster with complete health, equipment, ability, injury, persistence, and post-combat lifecycle authority.

The dedicated NPC-party evidence branch is a mandatory companion source for any ordinary allied-party or per-member tactics consumer:

`parallel/npc-party-companion-readiness-audit` at `c3092bcd02ff8530481f8cd4d16819f0a275c4a6`

## Presentation Dependency

The text-first combat evidence branch remains applicable to any combat view-model, tactics explanation, or player-facing decision-trace work:

`parallel/text-first-combat-view-model-audit` at `b605175e6edce6889171e067a5c899e4c7a59788`

Accessibility work must also inspect:

`parallel/ui-accessibility-input-source-audit` at `adbf2cef04b8423a9eedc2921e862b4c3e5f1410`

## Mandatory Consumers

Future work must inspect this audit when it concerns:

- combat AI scoring or target ranking;
- tactical roles or preset behavior;
- conservation thresholds;
- manual/AI mixed control;
- ordered gambits;
- AI explanation or decision traces;
- allied NPC automation;
- claims that all tactics fields are runtime-effective;
- combat-AI acceptance or regression testing.

## Review Trigger

Re-review when any of these occurs:

- focused AI scoring or target-ranking tests land;
- action or target selection logic changes;
- ordered gambit contracts are proposed;
- durable allied NPC party construction lands;
- manual override/resumption semantics change;
- a milestone claims complete tactics or gambit readiness.

## Validation Limits

This refresh used GitHub Connector source and document inspection only. It ran no tests, builds, typechecks, simulations, browser checks, or local Git commands.

No runtime behavior, tests, schemas, content, UI, prompt, handoff, roadmap, or branch register changed.