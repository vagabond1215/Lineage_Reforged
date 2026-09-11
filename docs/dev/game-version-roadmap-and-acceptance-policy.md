# Game Version Roadmap And Acceptance Policy

Date: 2026-09-06

Status: authoritative player-facing game-version and release-stage roadmap

Canonical current game version: root `GAME_VERSION`

Current value: `0.1.0-prealpha`

Companion development-milestone authority: `docs/design/internal-versioning-and-release-milestone-policy.md`

Companion playability authority: `docs/dev/playability-posture-and-version-calibration.md`

## 1. Purpose

Define the actual Lineage: Reforged game-version track in terms of what a player can meaningfully start, do, complete, repeat, and retain.

This roadmap is separate from development-milestone numbering. Development milestones measure engineering capability and authority closure. Game versions measure accepted playable-build maturity.

The existing `docs/dev/project-roadmap.md` remains useful as historical development chronology and technical sequencing. It is lower precedence than this document for any claim about the current game version, pre-alpha/alpha/beta/release stage, or the acceptance criteria for advancing the player-facing game version.

## 2. Version Identities Must Stay Separate

Every current-status surface should distinguish at least these identities when relevant:

1. **Game version** — player-facing playable-build maturity. Canonical source: `GAME_VERSION`.
2. **Development milestone** — internal engineering/capability progression. Prospectively labeled `DEV-X.Y.Z` or `DEV-X.Y.Z.S`.
3. **Build identity** — exact immutable Git commit SHA or packaged artifact identity.
4. **World/save/data version** — compatibility, migration, schema, or persisted-state authority such as `worldVersion`. It is not the game version.
5. **Deployment revision** — hosted or packaged deployment identity such as a ChatGPT Sites version/deployment.

Do not infer one from another.

In particular:

- `worldVersion: "0.1.0"` remains save/world-state authority and must not be changed merely because the game release version changes;
- private npm package `version` fields are package metadata, not canonical game-version authority;
- a deployment revision can change without changing the game version;
- a development milestone can advance without changing the game version;
- many development milestones may occur inside one accepted game version.

## 3. Current True Game State

The repository is currently classified as:

- **Game version:** `0.1.0-prealpha`
- **Development phase:** Early Pre-Alpha / First Playable
- **Playability posture:** `INTEGRATED_LOOP`
- **Development milestone:** `DEV-0.7.0 - Integrated Gameplay Systems Band Entry` is complete with `MILESTONE_ENTRY_ACCEPTED` on 2026-09-11
- **Deployment posture:** owner-only Sites preview operational

`0.1.0-prealpha` is accepted as the current game version because the repository already proves an ordinary authoritative player path from character creation/start-state through campaign publication/load, quest acceptance/access, travel/arrival, four survey shifts, persistence/restart, and durable duplicate behavior.

That path is real but narrow. Soundings remains active and unturned-in. The current build is therefore a first playable, not a vertical slice and not a broad pre-alpha representation of the intended final game.

## 4. Core Game-Version Rule

> Advance the game version only when the accepted playable build materially changes for the player.

The question for every proposed game-version increment is:

> What can a player meaningfully do, complete, understand, or retain in this accepted build that they could not meaningfully do in the previous accepted game version?

Architecture, tests, schemas, audits, refactors, persistence hardening, build-system work, content validation, or engine-owner migration may be necessary for a future game version, but they do not independently require a game-version increment.

## 5. Semantic Use Of Game-Version Numbers

### Patch increment: `0.M.P -> 0.M.(P+1)`

Use a patch increment for an accepted coherent playable-build improvement that remains inside the same development stage and does not satisfy the next minor-stage gate.

Examples may include:

- closing an existing quest lifecycle through authoritative turn-in/reward;
- adding a meaningful player-facing inventory/equipment loop;
- adding a bounded crafting/economy interaction that materially expands the current playable path;
- shipping a substantial bug-fix/polish build that changes ordinary play reliability;
- expanding one accepted region/adventure without crossing the next stage gate.

Do not allocate a patch merely because an internal development task completed.

### Minor increment: `0.M.x -> 0.(M+1).0`

Use a minor increment only when the corresponding playable-development-stage acceptance gate below is independently satisfied.

### Major release: `1.0.0`

Reserve `1.0.0` for the accepted public release. No development-milestone sequence or patch count can force it.

### Pre-release labels

Use stage labels where they add clarity:

- `prealpha` for early and expanded pre-alpha;
- `alpha` when alpha acceptance is reached;
- `beta` when beta acceptance is reached;
- `rc.N` for release-candidate builds.

The canonical current value is `0.1.0-prealpha`.

## 6. Game-Version Timeline And Acceptance Gates

### `0.0.x` — Prototype / Experimental

Purpose: exploratory runtime, isolated systems, proof-of-concept UI, and foundations before a durable ordinary gameplay loop exists.

Acceptance posture:

- may boot or run locally;
- may have substantial systems or content;
- no accepted ordinary end-to-end player path is required;
- save/restart and real-caller authority may still be incomplete.

Lineage: Reforged has passed this stage.

### `0.1.x-prealpha` — First Playable / Early Pre-Alpha

Purpose: establish and deepen the first real playable game rather than only proving architecture.

`0.1.0-prealpha` entry criteria:

- a fresh player can create/start a real campaign through ordinary product UI or the accepted product caller path;
- at least one meaningful gameplay objective can be accepted or entered through authoritative runtime ownership;
- the player can perform multiple consequential actions through real gameplay callers;
- the loop crosses more than one game system and produces retained consequences;
- save/load or equivalent restart persistence preserves the loop's required state;
- duplicate/retry behavior is bounded enough that ordinary replay does not corrupt the accepted path;
- the build is runnable on the current supported preview/development surface;
- known missing systems and incomplete loop closure are documented rather than hidden behind false claims.

Current status: **accepted**.

`0.1.x` continuation priorities should emphasize actual playable depth. Candidate increments may close the current quest loop, deepen inventory/equipment, add meaningful crafting/economy, improve encounters/combat, or add NPC/service interaction, but the exact ordering must come from playability prioritization rather than milestone-number momentum.

### `0.2.0-prealpha` — Accepted Vertical Slice / Mature Pre-Alpha

Purpose: prove that one bounded region/adventure path feels recognizably like Lineage: Reforged as a game, not merely as an integrated technical demonstration.

Minimum acceptance criteria:

- one repeatable bounded settlement/region/adventure path has enough authored content to express the intended game identity;
- fresh character creation/start enters the slice without fixture-only eligibility or demo mutation authority;
- the slice contains an agreed representative subset of character development, travel/exploration, challenge or combat, quests/contracts, inventory/equipment, crafting/economy, NPC/services, and persistence;
- at least one quest/opportunity can be accepted, advanced, completed, turned in or otherwise authoritatively closed, and produce durable consequences/rewards appropriate to its design;
- the player can make more than one meaningful choice with observable consequences inside the slice;
- save/load/restart repeatedly preserves the slice from beginning through post-objective continuation;
- UI communicates readiness, failure, consequences, and navigation clearly enough for ordinary play;
- keyboard/controller/input posture and accessibility basics are defined and pass the selected slice gate;
- representative balance and anti-exploit baselines exist for the included systems;
- critical placeholders, fixture-only shortcuts, and duplicated mutation authority do not control the slice;
- regression coverage protects the end-to-end slice;
- a human-oriented playthrough review confirms the slice can be played as a coherent game experience.

Content outside the chosen slice need not be complete.

### `0.3.x-prealpha` — Expanded Pre-Alpha I

Purpose: widen the accepted vertical slice into multiple meaningful player routes while preserving coherence.

Typical acceptance direction:

- additional quests/opportunities and locations;
- broader encounter/combat variety;
- deeper inventory/equipment and crafting/economy interactions;
- more meaningful progression/Knowledge/reputation consequences;
- NPC/service breadth sufficient to support different play choices;
- longer durable campaign continuity.

A `0.3.0-prealpha` proposal must define a concrete expansion gate rather than assuming that more content alone justifies promotion.

### `0.4.x-prealpha` — Expanded Pre-Alpha II / Representative Core Game

Purpose: make the core intended game loop representative across more than one narrow developer-controlled route.

Typical acceptance direction:

- multiple viable playstyles or progression approaches;
- stronger lineage/legacy consequences visible in ordinary play;
- broader economy, crafting, exploration, encounter, social, and quest interactions;
- sufficient content and systemic interaction to expose balance and exploit problems before alpha.

The exact `0.4.0-prealpha` gate must be authored later against the then-current intended alpha scope.

### `0.5.0-alpha` — Alpha Entry

Purpose: begin sustained external alpha testing of the actual game rather than a single curated slice.

Minimum acceptance criteria:

- the agreed alpha-scope major gameplay systems have functional runtime owners and are integrated or explicitly cut from alpha scope;
- players can begin, progress, fail/recover where designed, save, quit, return, and continue over meaningful multi-session play;
- the build supports multiple ordinary player routes without requiring developer fixture manipulation;
- current-data save creation/load/overwrite/restart/corruption or error behavior is defined and reliable enough for alpha;
- packaging/launch and diagnostic or issue-reporting posture support repeated external testing;
- accessibility/input requirements for alpha are met;
- performance budgets and representative stress cases are defined and acceptable for alpha scope;
- progression, economy, combat/challenges, and resource loops do not immediately collapse under ordinary repeated play;
- known limitations are documented;
- no known critical blocker makes ordinary alpha participation nonfunctional.

### `0.6.x-alpha` and `0.7.x-alpha` — Alpha Expansion And Stabilization

Purpose: broaden and stabilize the game after alpha entry.

Typical focus:

- content breadth and replayability;
- systemic interaction depth;
- lineage/dynasty consequences;
- economy and production depth;
- progression and build diversity;
- encounter/combat breadth;
- NPC/social/service depth;
- performance, accessibility, save reliability, and exploit closure.

Minor promotion inside this range must still be tied to a named playable-scope acceptance decision, not task count.

### `0.8.0-beta` — Beta Entry

Purpose: transition from adding major launch-scope gameplay pillars to finishing, balancing, optimizing, and validating the planned product.

Minimum acceptance criteria:

- all major systems intended for launch are present in playable form or explicitly cut with product approval;
- no foundational launch gameplay pillar remains represented only by placeholder/demo ownership;
- the agreed launch-content path is substantially complete enough for broad testing;
- save compatibility/current-data policy, packaging, installation/update/launch, diagnostics, accessibility, and performance are reliable for beta scale;
- balance/exploit work is systematic across progression, combat/challenges, economy, crafting, and rewards;
- broad regression and repeated external play do not reveal ordinary-use critical blockers;
- user-facing onboarding/settings/help posture is sufficient for beta participants.

### `0.9.x-rc.N` — Release Candidate

Purpose: validate exact release candidates rather than continue ordinary feature development.

Minimum acceptance criteria for the first RC:

- launch scope is feature-complete or explicitly cut;
- candidate build/artifacts are exact and reproducible enough for release review;
- release-candidate QA has no unresolved critical defects;
- save, install/update/launch, input, accessibility, performance, failure recovery, and platform behavior meet release criteria;
- balance/exploit posture is accepted for launch;
- support, credits, legal notices, privacy/telemetry/account/network posture, and release documentation are complete or explicitly not applicable;
- rollback/hotfix posture and known-issue disposition are documented.

Subsequent `rc.N` increments require a new exact candidate build and regression decision.

### `1.0.0` — Accepted Public Release

Purpose: the first accepted public release of Lineage: Reforged.

Minimum acceptance criteria:

- the exact release candidate has passed the release-readiness audit;
- launch scope and content are complete or deliberately cut with explicit product approval;
- all launch-critical runtime owners and persistence paths are accepted;
- packaging, installation/update/launch, input, accessibility, performance, saves, error handling, and platform behavior meet release criteria;
- release QA has no unresolved critical defect and lower-severity defects have accepted disposition;
- progression, economy, combat/challenges, crafting, rewards, and access loops meet launch balance/exploit standards;
- user-facing onboarding, settings, credits, legal/support information, and release notes are ready;
- operational, privacy, telemetry, crash-reporting, network/account, and support requirements are accepted or explicitly out of scope;
- release authority records the exact commit/artifacts, validation, known issues, rollback posture, and approval.

## 7. Acceptance Procedure For Any New Game Version

Before changing `GAME_VERSION`:

1. name the proposed game version and stage;
2. identify the previously accepted game version;
3. state the exact player-visible capability delta;
4. reproduce the ordinary play path that proves the delta;
5. identify required save/data compatibility or migration consequences;
6. run the regression/acceptance checks appropriate to the changed playable surface;
7. record known limitations and explicitly excluded systems;
8. identify the exact build SHA/artifact accepted for the game version;
9. record deployment/package identity when a distribution surface is part of the acceptance claim;
10. issue an explicit `GAME_VERSION_ACCEPTED`, `GAME_VERSION_NOT_READY`, or `GAME_VERSION_BLOCKED` decision;
11. update `GAME_VERSION` only on `GAME_VERSION_ACCEPTED`.

A documentation-only classification may establish the initial current version when it merely labels already-accepted playable evidence and changes no runtime behavior. That is the basis for the present `0.1.0-prealpha` classification.

## 8. Anti-Inflation Guardrails

Do not advance `GAME_VERSION` because:

- another development milestone completed;
- test count increased;
- a schema or validator was added;
- an engine owner replaced UI/demo ownership without changing accepted player-visible capability;
- a deployment was republished with equivalent gameplay;
- documentation volume increased;
- branch/PR cleanup completed;
- internal milestone numbers look visually high.

Tests and architecture are required evidence where relevant, but they are not substitutes for a meaningful playable-build delta.

## 9. Development Milestone Crosswalk

Historical labels such as `Version 0.6.11` remain stable references. They are now interpreted as **legacy development-milestone identifiers**, not historical game versions.

Prospectively use:

- `DEV-X.Y.Z - Short Name` for a primary development milestone;
- `DEV-X.Y.Z.S - Short Name` for a support suffix;
- unversioned names for cross-cutting research, planning, coordination, or audits that do not themselves advance a development milestone.

Current crosswalk:

- legacy `Version 0.6.11` -> development milestone `DEV-0.6.11` when discussed prospectively;
- legacy/current `Version 0.7.0 - Integrated Gameplay Systems Band Entry` -> `DEV-0.7.0 - Integrated Gameplay Systems Band Entry`;
- the existing readiness decision remains valid evidence and does not need historical renumbering.

## 10. Current Near-Term Route

The current sequence is:

1. keep game version at `0.1.0-prealpha`;
2. preserve accepted `DEV-0.7.0 - Integrated Gameplay Systems Band Entry` and current development band `DEV-0.7.x`;
3. on development-milestone acceptance, do **not** change `GAME_VERSION` merely because `DEV-0.7.0` was accepted;
4. execute the installed unversioned `Game 0.1.x Playability Gap Prioritization Decision`;
5. compare actual player-facing payoff across quest closure/rewards, inventory/equipment identity, crafting/economy, combat/challenges, NPC/services, progression, UI/accessibility, and content breadth;
6. select the smallest coherent player-visible package;
7. only after that package is accepted decide whether it warrants `0.1.1-prealpha` or remains internal development work inside `0.1.0-prealpha`.

`0.2.0-prealpha` remains reserved for the accepted vertical-slice gate above.
