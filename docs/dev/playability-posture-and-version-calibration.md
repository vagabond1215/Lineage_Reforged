# Playability Posture And Version Calibration

Date: 2026-09-06

Status: durable player-facing playability coordination authority

Current game version: `0.1.0-prealpha`

Canonical game-version source: root `GAME_VERSION`

Game-version roadmap: `docs/dev/game-version-roadmap-and-acceptance-policy.md`

Development-milestone policy: `docs/design/internal-versioning-and-release-milestone-policy.md`

## 1. Purpose

Track what Lineage: Reforged can actually support as a playable experience independently from engineering milestone numbering.

The current game version, playability posture, development milestone, save/world version, build SHA, and deployment revision are separate identities.

## 2. Core Rule

> Playability describes the accepted player experience. Development milestones describe engineering maturity.

Consequences:

- `DEV-0.7.0` does not mean Game `0.7.0` or 70% complete;
- accepting a docs-only development milestone does not change playability if no playable behavior changed;
- a deployment can be current while the game remains early pre-alpha;
- a technically mature subsystem does not imply broad game completeness;
- future route selection should explicitly measure player-facing loop depth and closure.

## 3. Playability Postures

### `FOUNDATION_ONLY`

Substantial technical foundations exist, but no accepted ordinary end-to-end gameplay loop represents current play.

### `INTEGRATED_LOOP`

At least one ordinary path crosses multiple authoritative systems, produces meaningful retained consequences, persists correctly, and is reproducible through real product callers.

This does not require a complete quest lifecycle, broad content, balanced combat, individualized items, full crafting, persistent NPC services, or a polished region.

### `VERTICAL_SLICE`

One narrow but coherent repeatable settlement/region/adventure path expresses the intended game identity across the agreed gameplay subset, content, persistence, UI/accessibility, balance baseline, and regression protection.

This is the playability posture expected for Game `0.2.0-prealpha` acceptance.

### `ALPHA_TESTABLE`

The agreed alpha scope can support sustained external multi-session play with reliable packaging/launch, diagnostics, saves, performance posture, accessibility/input, known limitations, and no ordinary-use critical blocker.

This is the playability posture expected for Game `0.5.0-alpha` acceptance.

### `BETA_TESTABLE`

Major launch-scope gameplay pillars are present or explicitly cut; testing focus has shifted primarily toward content completion, balance, exploits, performance, usability, compatibility, and release quality.

This is the playability posture expected for Game `0.8.0-beta` acceptance.

### `RELEASE_CANDIDATE`

An exact candidate build is feature-complete for accepted launch scope and undergoing release acceptance rather than ordinary feature development.

This is the posture expected for Game `0.9.x-rc.N`.

### `RELEASE_READY`

The exact public-release candidate satisfies the accepted launch, QA, persistence, packaging, accessibility, performance, support, and operational criteria.

This is the posture required for Game `1.0.0`.

## 4. Current Calibration

Current Lineage: Reforged state:

- **Game version:** `0.1.0-prealpha`
- **Game phase:** Early Pre-Alpha / First Playable
- **Playability posture:** `INTEGRATED_LOOP`
- **Development milestone:** `DEV-0.7.0 - Integrated Gameplay Systems Band Entry` complete and accepted on 2026-09-11
- **Deployment posture:** owner-only Sites preview operational

The playability posture is already `INTEGRATED_LOOP` because the representative ordinary loop was independently accepted before the now-completed development-milestone publication package.

Accepting `DEV-0.7.0` did not promote playability; it formalized the corresponding technical development band `DEV-0.7.x`. The installed next route is the unversioned `Game 0.1.x Playability Gap Prioritization Decision`.

## 5. Current Accepted Player Path

The current representative path proves:

character creation/start-state
→ campaign publication/load
→ quest acceptance and Ashen access
→ travel/arrival
→ four authoritative survey shifts
→ retained cross-system consequences
→ restart/save restoration
→ durable duplicate behavior.

The path intentionally ends with Soundings active and unturned-in.

That is sufficient for First Playable / `INTEGRATED_LOOP`, but insufficient for `VERTICAL_SLICE`.

## 6. Current Playability Gaps

Material gaps separating the current game from a coherent vertical slice include:

- Soundings fieldwork does not yet close through authoritative turn-in/payout/reward delivery;
- player inventory remains a fungible stack model without durable individualized item identity, provenance, condition, quality, composition, or repair history;
- crafting remains based on fixed authored transformations rather than a richer runtime material-selection/substitution loop;
- generated-person/NPC persistence and promotion ownership remain absent;
- the representative path does not yet contain the agreed vertical-slice breadth of combat/challenges, inventory/equipment, crafting/economy, NPC/services, and progression consequences;
- UI/accessibility/input and balance/anti-exploit posture have not passed a vertical-slice acceptance gate;
- representative content breadth remains intentionally narrow;
- the broad UI TypeScript diagnostic baseline remains technical debt even though direct Vite/Sites builds are executable.

These gaps are expected for `0.1.0-prealpha`.

## 7. Playability-First Routing Rule

After `DEV-0.7.0` acceptance, install an unversioned:

`Game 0.1.x Playability Gap Prioritization Decision`

That decision should:

1. reproduce what a player can actually do from fresh character creation through the current ordinary path;
2. identify where the experience stops, becomes placeholder-driven, lacks meaningful choice, or fails to close a gameplay loop;
3. rank candidate capabilities by player-facing payoff, dependency closure, architectural risk, implementation size, and regression burden;
4. prefer closing/deepening an existing playable loop when its payoff is higher than adding unrelated framework breadth;
5. select the smallest coherent player-visible package;
6. decide only after implementation/acceptance whether the resulting build warrants `0.1.1-prealpha`;
7. keep `0.2.0-prealpha` reserved for the vertical-slice gate.

A narrow authoritative Soundings turn-in/reward lane remains a strong candidate because it closes the exact representative quest loop, but it is not pre-assigned as the next game version.

## 8. Reporting Rule

Current status reports should state, when relevant:

- `Game version: ...`
- `Game phase: ...`
- `Playability posture: ...`
- `Development milestone: ...`
- `Build SHA: ...`
- `World/save version: ...` only when relevant
- `Deployment revision: ...` only when relevant

Do not express playability as a percentage unless a future dedicated metric defines a measurable denominator and methodology.
