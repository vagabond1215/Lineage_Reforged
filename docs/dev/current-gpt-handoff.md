# Current GPT Handoff

Date: 2026-09-06

Status: true game-version architecture installed; game `0.1.0-prealpha` / First Playable; playability `INTEGRATED_LOOP`; owner-only Sites preview current; `DEV-0.7.0` development milestone activation pending

Repository: `vagabond1215/Lineage_Reforged`

Version-architecture migration source head: `21b6cbb10e21f0b150d8810801aa8273ac9a1258`

Canonical game version: root `GAME_VERSION`

Game version: `0.1.0-prealpha`

Game phase: `Early Pre-Alpha / First Playable`

Playability posture: `INTEGRATED_LOOP`

Development milestone:

`DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

Legacy label mapping:

`Version 0.7.0 - Integrated Gameplay Systems Band Entry` -> `DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

Development milestone status: `AUTHORIZED_PENDING_MILESTONE_ACTIVATION`

Readiness result: `BAND_ENTRY_READY`

Accepted representative implementation: `3ca23d6864541a899ea61a6bf26257665f754e78`

Readiness decision starting head: `dc89c8f0421e3e657740f03ecfa611a29ae2f8b3`

Current prompt authority:

`docs/dev/current-codex-prompt.md`

## 0. Version Architecture Authority

Read together:

- root `GAME_VERSION` — canonical current player-facing game version;
- `docs/dev/game-version-roadmap-and-acceptance-policy.md` — actual game-version timeline and acceptance gates;
- `docs/design/internal-versioning-and-release-milestone-policy.md` — development-milestone numbering and historical-label compatibility;
- `docs/dev/playability-posture-and-version-calibration.md` — current player-facing playability classification.

The five identities must remain separate:

1. game version;
2. development milestone;
3. exact build/source SHA;
4. save/world/data version;
5. deployment revision.

Private package versions are package metadata, not canonical game-version authority.

`worldVersion: 0.1.0` is persisted-state authority and must not be changed merely to align with the game version.

The existing `docs/dev/project-roadmap.md` remains historical development chronology/technical sequencing. It is lower precedence than `docs/dev/game-version-roadmap-and-acceptance-policy.md` for actual game-version, pre-alpha/alpha/beta/RC/release, and player-facing acceptance claims.

## 1. Current True Game State

The current accepted game version is:

`0.1.0-prealpha`

This is a First Playable / Early Pre-Alpha build.

The current playability posture is already `INTEGRATED_LOOP`. It does **not** wait for the docs-only development milestone publication because the representative ordinary loop was independently accepted before `DEV-0.7.0` publication.

The accepted ordinary path is:

creator/start-state
→ campaign publication/load
→ quest acceptance/access
→ travel/arrival
→ four survey shifts
→ retained cross-system consequences
→ restart/save restoration
→ durable duplicate.

Soundings remains active and unturned-in.

The game is therefore not a vertical slice, not alpha, not beta, and not approximately 70% complete.

## 2. Current Development Milestone

Execute only:

`DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

This is the prospectively renamed form of the installed legacy `Version 0.7.0` milestone. Historical accepted documents and commits retain their original `Version X.Y.Z` labels and must not be mass-renumbered.

The development milestone is a bounded verification/publication package. It does not add gameplay and must not change `GAME_VERSION`.

On acceptance:

- development milestone becomes `DEV-0.7.x` current;
- Game version remains `0.1.0-prealpha`;
- playability remains `INTEGRATED_LOOP`;
- install unversioned `Game 0.1.x Playability Gap Prioritization Decision`;
- do not automatically assign `DEV-0.7.1` or Game `0.1.1-prealpha`.

On blockage:

- keep the development milestone unaccepted;
- install the smallest exact technical repair;
- keep Game `0.1.0-prealpha` unless an independent game-version decision says otherwise.

## 3. Current Connector Preflight

`docs/dev/connector-preflight-version-0.7.0-current-head-playability-calibration-2026-09-06.md`

Connector disposition: `CONNECTOR_PREFLIGHT_CURRENT_HEAD_COMPLETE_EXECUTION_RESERVED_TO_CODEX`

That packet inspected source head `a2d86f3753fd0ab599760a2cf6e80a0c926ea03b`. Later changes through the version-architecture migration source head are documentation/coordination only. Codex must fetch current `master`, include all later deltas, and independently verify no representative gameplay-owner/test drift.

## 4. Sites Preview Status

The owner-only preview lane is complete for the current purpose.

- preview: `https://lineage-reforged-preview.vagabond1215.chatgpt.site`
- current Sites version: version 2;
- deployed filtered source: `8857c08bb272f36938fde0a72087c5c0865be80b`;
- final Bloodlines active/inactive assets are authoritative in Lineage history at `e58d650203bde7d84a6a56ab1501bfac4e18901c`.

No further Sites run is required unless access policy, deployment source, or asset delivery changes.

## 5. Current Playability Gaps

Material gaps separating Game `0.1.0-prealpha` from the reserved Game `0.2.0-prealpha` vertical-slice gate include:

- authoritative quest turn-in/payout/reward closure;
- individualized item identity/provenance/condition/quality/composition;
- deeper runtime crafting/material choice;
- persistent generated NPC/service ownership;
- representative combat/challenge, inventory/equipment, crafting/economy, NPC/services, and progression breadth;
- UI/accessibility/input hardening for a coherent slice;
- balance and anti-exploit baselines;
- representative content breadth;
- broad UI TypeScript baseline cleanup as technical debt.

These gaps are expected at `0.1.0-prealpha`.

## 6. Post-DEV-0.7.0 Route

After `DEV-0.7.0` acceptance, run the unversioned:

`Game 0.1.x Playability Gap Prioritization Decision`

It must reproduce the real player path and rank missing capabilities by:

- player-facing payoff;
- loop closure;
- dependency closure;
- architectural risk;
- package size;
- regression burden.

Narrow authoritative Soundings turn-in/reward is a strong candidate because it closes the exact existing quest loop, but it is not pre-assigned as Game `0.1.1-prealpha`.

A proposed game-version increment must separately pass the acceptance procedure in `docs/dev/game-version-roadmap-and-acceptance-policy.md`.

## 7. Branch And PR Posture

The latest Connector-visible branch/PR evidence before this version-architecture pass recorded 38 branches total / 37 non-default branches and exactly two open PRs.

- PR #2: `SUPERSEDED_PRESERVE_EVIDENCE`, head `e78dc645cfb658685be12f45f46d34b7c0da1119`;
- PR #3: `SUPERSEDED_PRESERVE_EVIDENCE`, head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- four survey evidence refs remain candidate evidence for broader named consumers;
- readiness/prompt-packaging evidence remains protected;
- administration evidence remains held for its named consumer.

No branch or PR lifecycle action is authorized by the version-architecture migration itself. Codex must refresh live refs locally at the next executable run.

## 8. First Read Order

1. `AGENTS.md`;
2. root `GAME_VERSION`;
3. `docs/dev/current-gpt-handoff.md`;
4. `docs/dev/current-codex-prompt.md`;
5. `docs/dev/current-codex-output.md`;
6. `docs/dev/game-version-roadmap-and-acceptance-policy.md`;
7. `docs/design/internal-versioning-and-release-milestone-policy.md`;
8. `docs/dev/playability-posture-and-version-calibration.md`;
9. `docs/dev/connector-preflight-version-0.7.0-current-head-playability-calibration-2026-09-06.md`;
10. `docs/design/integrated-gameplay-0.7-band-entry-readiness-decision.md`;
11. accepted legacy `0.6.11.1` appendices and representative test.

Fetch live `master`, reconcile any delta after the version-architecture migration source head, and preserve the fail-closed `DEV-0.7.0` gate.
