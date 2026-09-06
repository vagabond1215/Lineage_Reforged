# Current Codex Output

Date: 2026-09-06

Source run: `Game Version Architecture And Roadmap Reclassification`

Label class: unversioned coordination/policy migration

Development milestone impact: `none`

Game-version impact: `establishes current accepted classification only; no runtime change`

Game version before: no separate canonical game-version authority

Game version after: `0.1.0-prealpha`

Playability posture: `INTEGRATED_LOOP`

Active development milestone after migration: `DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

Legacy active-label mapping: `Version 0.7.0 - Integrated Gameplay Systems Band Entry` -> `DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

Inspected source head: `21b6cbb10e21f0b150d8810801aa8273ac9a1258`

Disposition: `VERSION_ARCHITECTURE_RECLASSIFIED_GAME_0_1_0_PREALPHA`

## A. Purpose

Separate the real player-facing game version from the repository's historical engineering workflow numbering.

The previous `Version X.Y.Z` sequence remains valid historical development-milestone evidence. It is no longer treated as the actual game version.

The current game is classified from accepted repository playability evidence as First Playable / Early Pre-Alpha.

## B. Files Changed

- root `GAME_VERSION`: new canonical player-facing game-version source, `0.1.0-prealpha`;
- `docs/dev/game-version-roadmap-and-acceptance-policy.md`: new authoritative game-version timeline, semantic increment rules, stage gates, and acceptance procedure;
- `docs/design/internal-versioning-and-release-milestone-policy.md`: converts the engineering numbering system to a prospective `DEV-` milestone track while preserving historical labels;
- `docs/dev/playability-posture-and-version-calibration.md`: records current `INTEGRATED_LOOP` playability independently from development milestone publication;
- `docs/dev/current-codex-prompt.md`: renames the active milestone to `DEV-0.7.0` and forbids game-version advancement inside that docs-only milestone run;
- `docs/dev/current-gpt-handoff.md`: records the five-identity version model, current game/playability state, and post-milestone playability-first route;
- `docs/dev/current-codex-output.md`: this coordination result;
- `AGENTS.md`: prospectively uses `DEV-X.Y.Z` development-milestone labels and points game-version claims to the canonical game-version policy.

No gameplay source, schema, content, test, save, migration, dependency, asset, UI runtime behavior, package dependency, branch, or pull request is changed by this policy migration.

Private npm package `version` fields remain package metadata and are deliberately not promoted to canonical game-version authority.

`worldVersion: 0.1.0` remains persisted world/save authority and is deliberately unchanged.

## C. Current Version Architecture

| Identity | Current value | Authority |
| --- | --- | --- |
| Game version | `0.1.0-prealpha` | root `GAME_VERSION` + game-version policy |
| Game phase | Early Pre-Alpha / First Playable | game-version policy |
| Playability | `INTEGRATED_LOOP` | playability calibration + accepted representative loop |
| Development milestone | `DEV-0.7.0` pending | current prompt + development-milestone policy |
| World/save version | `worldVersion: 0.1.0` where currently authored | save/world-state authority |
| Deployment | Sites version 2 | existing Sites deployment evidence |
| Build | exact Git SHA | repository history |

These identities must not be inferred from each other.

## D. Why Game `0.1.0-prealpha`

Existing accepted evidence already proves an ordinary authoritative player path through:

creator/start-state
→ campaign publication/load
→ quest acceptance/access
→ travel/arrival
→ four survey shifts
→ retained cross-system consequences
→ restart/save restoration
→ durable duplicate.

That is sufficient for First Playable / Early Pre-Alpha and `INTEGRATED_LOOP`.

It is not sufficient for a vertical slice because Soundings remains active/unturned-in and major player-facing loops such as authoritative quest closure/rewards, individualized items, deeper crafting/economy, persistent NPC/services, broader combat/challenge integration, UI/accessibility hardening, balance, and representative content breadth remain incomplete.

## E. Game-Version Roadmap

The accepted player-facing release-stage sequence is now:

- `0.0.x`: prototype/experimental;
- `0.1.x-prealpha`: First Playable / Early Pre-Alpha — current;
- `0.2.0-prealpha`: accepted vertical slice / mature pre-alpha;
- `0.3.x-prealpha`: expanded pre-alpha I;
- `0.4.x-prealpha`: representative core-game pre-alpha;
- `0.5.0-alpha`: alpha entry;
- `0.6.x-alpha` / `0.7.x-alpha`: alpha expansion and stabilization;
- `0.8.0-beta`: beta entry;
- `0.9.x-rc.N`: release candidate;
- `1.0.0`: accepted public release.

Exact acceptance gates live in `docs/dev/game-version-roadmap-and-acceptance-policy.md`.

## F. Development Milestone Handling

Historical `Version X.Y.Z` identifiers are not rewritten.

Prospectively:

- primary engineering milestone: `DEV-X.Y.Z`;
- parent-specific support milestone: `DEV-X.Y.Z.S`;
- cross-cutting research/planning/coordination: unversioned.

The current active milestone is therefore:

`DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

Accepting it does not change Game `0.1.0-prealpha` because the run is a technical publication/verification package with no new player-visible behavior.

## G. Acceptance Criterion Change

A game-version increment now requires a separate explicit player-facing acceptance decision.

Before changing `GAME_VERSION`, the repository must record:

- prior accepted game version;
- proposed version/stage;
- exact player-visible capability delta;
- ordinary play path proving the delta;
- save/data compatibility consequences;
- appropriate regression/acceptance validation;
- known limitations/exclusions;
- exact accepted build/artifact identity;
- explicit `GAME_VERSION_ACCEPTED`, `GAME_VERSION_NOT_READY`, or `GAME_VERSION_BLOCKED` result.

Architecture, schemas, tests, docs, owner migrations, deployments, or branch cleanup do not independently advance the game version.

## H. Validation And Evidence

This was a documentation/policy and canonical-label migration over already accepted gameplay evidence.

Connector checks performed:

- refreshed hosted `master` and source head;
- reread root repository instructions and current prompt/handoff/output;
- reread the existing internal versioning policy and playability calibration;
- inspected the root/UI package-version metadata and confirmed they are separate private package metadata;
- inspected current `worldVersion: 0.1.0` occurrences and classified them as persisted world/save authority, not game-version authority;
- retained the existing branch/PR dispositions; no lifecycle action was authorized by this migration.

No local executable validation was run or claimed because no runtime behavior, executable source, tests, dependency graph, save contract, or build configuration was changed.

## I. Risks And Follow-Up

- historical documents will continue to contain `Version X.Y.Z`; that is intentional and preserves stable evidence identities;
- current agents must read the prospective `DEV-` migration policy before assigning new engineering labels;
- package versions remain independent and may diverge from game versions in the future;
- `worldVersion` must not be casually synchronized to `GAME_VERSION`;
- the existing large `docs/dev/project-roadmap.md` remains useful technical chronology but is lower precedence for game-version/release-stage semantics;
- the next executable run remains `DEV-0.7.0` and must not edit `GAME_VERSION`;
- after `DEV-0.7.0` acceptance, run unversioned `Game 0.1.x Playability Gap Prioritization Decision` before assigning either the next development primary or Game `0.1.1-prealpha`.

Suggested commit message: `docs: establish true game version architecture`

Next recommended executable run: `DEV-0.7.0 - Integrated Gameplay Systems Band Entry`
