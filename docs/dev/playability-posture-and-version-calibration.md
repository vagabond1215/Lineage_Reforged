# Playability Posture And Internal Version Calibration

Date: 2026-09-06

Status: durable coordination policy supplement

Applies to: live handoff, milestone publication, roadmap routing, and post-`0.7.0` capability selection

Companion authority: `docs/design/internal-versioning-and-release-milestone-policy.md`

## 1. Purpose

Prevent Lineage: Reforged internal workflow versions from being mistaken for a percentage-complete or player-facing playability score.

The existing versioning policy remains authoritative: internal versions measure accepted maturity and durable capability. This document adds an orthogonal playability posture so a label such as `0.7.0` cannot be read as "70% complete" or "70% playable."

## 2. Core Rule

> Internal version and player-facing playability are different dimensions.

Consequences:

- `0.7.0` means the repository has crossed the accepted Integrated Gameplay Systems gate; it does not mean the game is approximately 70% complete.
- A private or public Sites deployment proves a runnable presentation/deployment surface only; it does not by itself advance gameplay maturity.
- A large number of schemas, validators, tests, docs, or narrow engine owners may improve technical maturity without producing a proportionate increase in what a player can meaningfully do.
- Future live coordination should state both the internal maturity band and the current playability posture.
- New primary versions inside `0.7.x` should be chosen with explicit attention to player-facing loop depth and closure, not merely because another bounded authority can be implemented.

## 3. Playability Postures

Use descriptive posture labels rather than another numeric version.

### `FOUNDATION_ONLY`

The repository has substantial technical foundations but no accepted end-to-end gameplay loop suitable as the current representative experience.

### `INTEGRATED_LOOP`

At least one bounded ordinary path crosses multiple authoritative systems, persists correctly, and can be reproduced through real caller paths.

This does not require a complete quest lifecycle, broad content, balanced combat, durable item instances, full crafting, persistent NPC services, or a polished region.

### `VERTICAL_SLICE`

One narrow but coherent repeatable adventure/region path contains the agreed gameplay subset, content, persistence, UI/accessibility posture, balance baseline, and regression protection. This aligns conceptually with the repository's `0.8.0` pre-alpha gate.

### `ALPHA_TESTABLE`

The agreed alpha scope can support sustained external play with reliable packaging, diagnostics, saves, performance posture, known limitations, and no ordinary-use critical blocker. This aligns conceptually with the `0.9.0` gate.

### `RELEASE_READY`

The accepted public-release scope, QA, packaging, accessibility, performance, support, and operational requirements are satisfied. This aligns with `1.0.0`.

## 4. Current Calibration

Before `Version 0.7.0 - Integrated Gameplay Systems Band Entry` is formally accepted, the repository is best described as:

- internal maturity: `0.6.x`, with `0.7.0` authorized pending milestone publication;
- playability posture: `INTEGRATED_LOOP_PENDING_PUBLICATION`;
- deployment posture: owner-only Sites preview operational.

If the installed `0.7.0` package returns `MILESTONE_ENTRY_ACCEPTED`, the correct resulting playability posture is:

`INTEGRATED_LOOP`

—not `VERTICAL_SLICE`, not `PRE_ALPHA`, and not any percentage-complete claim.

The accepted representative path proves creator/start-state -> campaign publication/load -> quest acceptance/access -> travel/arrival -> four survey shifts -> restart -> durable duplicate. It intentionally ends with Soundings active and unturned-in.

## 5. Current Playability Gaps

Known gaps that materially separate the present integrated loop from a coherent vertical slice include:

- Soundings fieldwork does not yet close through authoritative turn-in/payout/reward delivery;
- player inventory remains a fungible stack model without durable individualized item identity, provenance, condition, quality, composition, or repair history;
- crafting remains based on fixed authored recipe transformations and does not yet provide the richer runtime material-selection/substitution loop;
- generated-person/NPC persistence and promotion ownership remain absent;
- the `0.8.0` agreed subset of combat, inventory/equipment, crafting/economy, NPC/services, UI/accessibility, balance, anti-exploit posture, and representative content breadth has not been accepted;
- the broad UI TypeScript diagnostic baseline remains known technical debt even though direct Vite/Sites builds are executable.

These gaps do not invalidate the narrow `0.7.0` gate. They do explain why the resulting game can still feel much less playable than the version number might intuitively suggest.

## 6. Post-0.7 Routing Rule

After `0.7.0` acceptance, do not automatically allocate `0.7.1` merely because the next task exists.

Install an unversioned `0.7.x Playability Gap Prioritization Decision` first. That decision should:

1. reproduce what a player can actually do from fresh character creation through the current ordinary loop;
2. identify where the loop stops, becomes placeholder-driven, or loses meaningful choice/consequence;
3. rank missing player-facing capabilities by playability gain, dependency closure, architectural risk, and implementation size;
4. prefer closing or deepening an existing playable loop over adding unrelated framework breadth when the payoff is higher;
5. select the smallest next primary capability only after that comparison;
6. leave `0.8.0` reserved until the full vertical-slice gate is independently satisfied.

Current evidence suggests a narrow authoritative Soundings turn-in/reward lane is a strong candidate because it closes the exact representative quest loop, but the prioritization decision must compare it against other high-payoff blockers before assigning a primary version.

## 7. Reporting Rule

After `0.7.0`, live handoffs and milestone reports should include both:

- `Internal maturity band: ...`
- `Playability posture: ...`

Do not express playability as a percentage unless a future dedicated product metric defines a measurable denominator and methodology.
