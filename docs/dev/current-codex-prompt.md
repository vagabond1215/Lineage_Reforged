# DEV-0.7.0 - Integrated Gameplay Systems Band Entry

Date: 2026-09-06

Label class: primary development-band entry milestone

Development milestone impact: `band_entry_candidate`

Game version: `0.1.0-prealpha`

Game-version impact: `none unless a separate game-version acceptance gate is explicitly added and passes`

Playability posture: `INTEGRATED_LOOP`

Execution posture: synchronized repository-first milestone activation/publication; production, schemas, content, tests, saves, migrations, dependencies, assets, and gameplay behavior are read-only

Legacy label mapping: `Version 0.7.0 - Integrated Gameplay Systems Band Entry` -> `DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

Accepted readiness decision: `docs/design/integrated-gameplay-0.7-band-entry-readiness-decision.md`

Readiness result: `BAND_ENTRY_READY`

Accepted representative authority: legacy `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

Current-head Connector preflight: `docs/dev/connector-preflight-version-0.7.0-current-head-playability-calibration-2026-09-06.md`

Version architecture:

- `docs/design/internal-versioning-and-release-milestone-policy.md`
- `docs/dev/game-version-roadmap-and-acceptance-policy.md`
- `docs/dev/playability-posture-and-version-calibration.md`
- root `GAME_VERSION`

## Objective

Activate and publish the reserved `DEV-0.7.0 - Integrated Gameplay Systems` development milestone over the already accepted bounded representative loop. Reverify that the live head has not invalidated the accepted readiness matrix, run the smallest focused executable confirmation, and update durable coordination so the engineering project has formally crossed the Integrated Gameplay development gate.

This is a bounded development-milestone acceptance package, not a new feature package and not a game-release package.

The current true game version is `0.1.0-prealpha`, with playability posture `INTEGRATED_LOOP`. This run must not change either merely because `DEV-0.7.0` is accepted.

Return exactly one development-milestone result:

- `MILESTONE_ENTRY_ACCEPTED`; or
- `MILESTONE_ENTRY_BLOCKED`.

Do not issue `GAME_VERSION_ACCEPTED` in this run.

## Required Orientation

Follow `AGENTS.md`, the repository-first protocol, Codex-versus-Connector handling procedure, platform/tool policy, resource-slicing policy, branch policy/register, and applicable failure-pattern register. Fetch/prune, synchronize clean `master`, inventory live branches and pull-request refs, and distinguish:

- game version;
- development milestone;
- build/source SHA;
- save/world/data version;
- deployment revision;
- accepted implementation;
- readiness-decision head;
- inspected/coordination/pushed/tracking/hosted heads;
- external Sites source identity.

Read completely:

- current prompt, handoff, output, historical register, and planning reconciliation;
- `docs/design/integrated-gameplay-0.7-band-entry-readiness-decision.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- `docs/dev/game-version-roadmap-and-acceptance-policy.md`;
- `docs/dev/playability-posture-and-version-calibration.md`;
- `docs/dev/connector-preflight-version-0.7.0-current-head-playability-calibration-2026-09-06.md`;
- accepted legacy `0.6.9`, `0.6.10`, `0.6.11`, and `0.6.11.1` authorities;
- current representative source/caller/persistence/test paths and the complete delta since the readiness decision.

Historical `Version X.Y.Z` labels remain stable evidence. Interpret them as legacy development-milestone identifiers; do not mass-rename historical files, commits, or accepted decisions.

The existing `docs/dev/project-roadmap.md` remains development chronology. `docs/dev/game-version-roadmap-and-acceptance-policy.md` controls actual game-version/release-stage claims.

## Acceptance Gate

Use `MILESTONE_ENTRY_ACCEPTED` only if all of the following remain true at the synchronized live head:

1. no post-readiness production or tracked-test drift invalidates any development-gate criterion;
2. the ordinary creator -> publication/load -> quest acceptance/access -> travel/arrival -> four survey shifts -> restart -> durable duplicate path remains executable;
3. engine-owned commands/results/events, campaign admission, persistence, typed consequences, stale/conflict rejection, correction/repair, nested-owner preservation, and accepted-only real-caller application remain coherent;
4. Soundings remains active and unturned-in, with no legacy turn-in/reward behavior promoted into milestone canon;
5. the focused current-head validation passes;
6. every documented omission remains outside the representative interaction or explicitly deferred;
7. no new mandatory technical blocker is found.

If any criterion fails, return `MILESTONE_ENTRY_BLOCKED`, do not record `DEV-0.7.0` as accepted/current, identify the exact failed criterion and smallest coherent repair/decision, and fail closed.

The game version remains `0.1.0-prealpha` whether this development milestone is accepted or blocked, unless a separate future game-version gate explicitly changes it.

## Required Evidence

- Inspect the complete diff from readiness-decision source head `dc89c8f0421e3e657740f03ecfa611a29ae2f8b3` to synchronized live head, including all later documentation-only version-architecture coordination.
- Reinspect the real creator, new-campaign attempt/publication, quest acceptance/access, travel/arrival, survey owner, campaign admission, real caller, accepted-only session bridge, persistence, and representative test.
- Run the representative ordinary-reachability test plus the focused survey-command, survey-persistence, and campaign-persistence tests. Expand only if drift or failure requires it.
- Run the post-readiness focused tracked tests `tests/unit/character-creator-asset-url.test.mjs` and `tests/unit/launcher-bloodlines-asset.test.mjs`.
- Run the Node-side UI configuration typecheck and a direct current Vite production build or equivalent build path that loads the Sites/Cloudflare configuration. Characterize the known broad UI TypeScript baseline explicitly; do not silently claim it is green.
- Confirm the representative test imports no `demoSnapshot`, injects no eligibility state, ends with the quest active/unturned-in, and asserts the durable duplicate and exact authority graph.
- Verify root `GAME_VERSION` is `0.1.0-prealpha` and do not modify it in this run.
- Confirm `worldVersion` remains separate persisted-state authority and is not edited for version-number alignment.
- Apply at minimum `FP-001`, `FP-002`, `FP-008`, `FP-009`, `FP-013`, `FP-014`, and `FP-017`.

## Coordination And Publication

On `MILESTONE_ENTRY_ACCEPTED`:

- record `DEV-0.7.0 - Integrated Gameplay Systems Band Entry` as complete and accepted;
- set the current **development milestone band** to `DEV-0.7.x` without claiming any higher game release stage;
- keep `Game version: 0.1.0-prealpha` unchanged;
- keep `Playability posture: INTEGRATED_LOOP` unchanged unless independent runtime evidence requires a different classification;
- explicitly state that accepting `DEV-0.7.0` does not create Game `0.7.0`, Game `0.2.0`, vertical-slice acceptance, alpha, beta, or a percentage-complete claim;
- preserve the accepted representative-loop boundary and all later-system deferrals;
- install one separate next route, without implementing it in this run: unversioned `Game 0.1.x Playability Gap Prioritization Decision`;
- do **not** automatically allocate `DEV-0.7.1` or Game `0.1.1-prealpha` during milestone publication;
- require the playability decision to reproduce the actual player path and rank missing player-facing loop closure by playability gain, dependency closure, architectural risk, package size, and regression burden;
- treat narrow authoritative Soundings turn-in/reward as a strong candidate to compare, not a predetermined versioned implementation;
- update current prompt/output/handoff, readiness decision as appropriate, historical register/planning reconciliation/live headers where needed, and branch register according to repository policy;
- commit only intended documentation, push `master`, fetch/prune, verify `HEAD == origin/master`, retrieve hosted prompt/output/handoff, and finish clean.

On `MILESTONE_ENTRY_BLOCKED`, update the same coordination surfaces with the fail-closed development result and smallest repair route. Do not install the playability-prioritization route until the development milestone is accepted.

## Scope Exclusions

Do not modify production, shared contracts, schemas, serializers, migrations, tracked tests, content, dependencies, assets, UI, saves, `GAME_VERSION`, or `worldVersion`; implement quest turn-in/rewards; perform class/progression cleanup or attribute rebalancing; create generic quest/travel/activity/event/effect infrastructure; migrate travel keys; add inventory instances, NPC promotion, other Stakes modes, vertical-slice hardening, alpha/beta packaging, or release work; or mutate evidence/protected branches or pull requests.
