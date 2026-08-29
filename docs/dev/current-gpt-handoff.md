# Current GPT Handoff

Date: 2026-08-29

Status: owner-only Sites preview deployed; integrated-gameplay band-entry readiness accepted and milestone activation pending

Repository: `vagabond1215/Lineage_Reforged`

Readiness result: `BAND_ENTRY_READY`

Accepted implementation: `3ca23d6864541a899ea61a6bf26257665f754e78`

Readiness decision starting head: `dc89c8f0421e3e657740f03ecfa611a29ae2f8b3`

Active run:

`Version 0.7.0 - Integrated Gameplay Systems Band Entry`

Current prompt authority:

`docs/dev/current-codex-prompt.md`

`0.7.0`: `AUTHORIZED_PENDING_MILESTONE_ACTIVATION`

## 0. Current Connector Preflight

`docs/dev/connector-preflight-version-0.7.0-milestone-activation-evidence-packet-2026-08-28.md`

Inspected hosted head before the preview asset implementation: `712982fbf72b158280df0ac89dc903d3b1832ab4`

Connector disposition: `CONNECTOR_PREFLIGHT_REFRESH_COMPLETE_EXECUTION_RESERVED_TO_CODEX`

The complete post-readiness delta is three commits. The readiness publication and material-property note are documentation-only. `5f723d2924fef53b749c897440dfd2817499de32` changes the UI hosting/build/dependency surface but not representative gameplay owners or tracked tests. Because GitHub has no workflow run or combined status for that head, Codex must locally characterize the changed Vite/Cloudflare/Sites build and TypeScript surface in addition to the installed focused gameplay gate. This does not prejudge milestone acceptance and does not broaden the route into packaging or `0.8.x` work.

## 0A. Sites Preview Hosting Support Status

Unversioned preview-hosting support is complete. Production character-creator illustrations now resolve from immutable public GitHub commit `712982fbf72b158280df0ac89dc903d3b1832ab4`, while local development retains the existing repository paths and all authored assets. The implementation and focused test are committed and pushed at `7002efa8b4c3320932a623c2f1eae7f84865c676`.

The exact independently buildable Sites source includes `apps/rpg-ui` and its imported `packages` tree, excluding only the hotlinked `apps/rpg-ui/public/character-creator` directory. It built to `20,343,949` bytes, was pushed at `f12274cab9f0fc40fc2c2d322d15128b374e6093`, and replaced the disposable seed before version creation. Sites version 1 and private deployment `appgdep_6a9332384ac881919f37da76fb6463dd` succeeded.

Owner-only preview: `https://lineage-reforged-preview.vagabond1215.chatgpt.site`

The live site and a representative pinned asset both returned HTTP `200`. This preview support does not alter or supersede the active `0.7.0` gameplay prompt. Raw GitHub delivery is a bounded preview choice, not durable public-release CDN authority.

## 1. Accepted Readiness State

The unversioned band-entry decision independently returned `BAND_ENTRY_READY`. Every `0.7.0` policy criterion is satisfied by accepted `0.6.9`, `0.6.10`, `0.6.11`, and `0.6.11.1` authority plus a fresh current-head `77/77` focused gate.

The accepted loop begins with a real Starfall creator, crosses retained new-campaign publication/load, quest acceptance and Ashen access, engine-owned travel and arrival activation, four engine-owned survey shifts, campaign admission, persistence/restart, and empty-cache durable duplicate. Final accepted authority remains 4 requests, 4 occurrences, 4 results, and 48 receipts.

## 2. Boundary To Preserve

Soundings remains active and unturned-in. The accepted survey shifts—not legacy turn-in—supply the required cross-system consequence-bearing interaction. Inventory is an exact non-proposal for this interaction.

Do not reopen or import:

- turn-in, payout, rewards, or generic reward architecture;
- class/progression cleanup or attribute rebalance;
- generic quest/travel/activity/event/effect systems;
- travel-key migration or other Stakes modes;
- inventory-instance or generated-person/NPC promotion work;
- `0.8.x` vertical-slice, accessibility/balance, packaging, alpha, or release gates.

## 3. Next Run Contract

Execute only `Version 0.7.0 - Integrated Gameplay Systems Band Entry`.

It is a bounded milestone activation/publication package over the already accepted loop. It should verify the complete live-head delta, inspect the real path, run the representative plus focused survey/campaign persistence gate, locally characterize the post-readiness UI hosting/toolchain drift recorded in the Connector preflight packet, and then either:

- return `MILESTONE_ENTRY_ACCEPTED`, record `0.7.0` complete, and install one separate next route; or
- return `MILESTONE_ENTRY_BLOCKED`, keep the project in the current band, and install the smallest exact repair.

It must not modify production or invent feature work merely to make the milestone label substantive.

## 4. Branch And PR Posture

The current Connector refresh sees 37 non-default hosted branches and two open PRs; local branch/worktree state remains for Codex to verify. The readiness decision previously found one local branch and 37 non-default remote branches. PR #2 and PR #3 remain `SUPERSEDED_PRESERVE_EVIDENCE`; the four survey evidence refs remain `CANDIDATE_INTEGRATION`; integrated-gameplay readiness and prompt-packaging remain `PROTECTED_REFERENCE`; administration evidence remains `HOLD_NAMED_CONSUMER`.

No lifecycle action was due. Reinspect live refs during the milestone package or an earlier explicit trigger.

## 5. First Read Order

1. `AGENTS.md`;
2. `docs/dev/current-gpt-handoff.md`;
3. `docs/dev/current-codex-prompt.md`;
4. `docs/dev/current-codex-output.md`;
5. `docs/design/integrated-gameplay-0.7-band-entry-readiness-decision.md`;
6. `docs/design/internal-versioning-and-release-milestone-policy.md`;
7. `docs/dev/connector-preflight-version-0.7.0-milestone-activation-evidence-packet-2026-08-28.md`;
8. the accepted `0.6.11.1` appendices and representative test.

Fetch live `master`, verify the complete delta from the readiness decision, and preserve the fail-closed milestone gate.
