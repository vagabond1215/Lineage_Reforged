# Connector Preflight - Version 0.7.0 Current-Head And Playability Calibration

Date: 2026-09-06

Status: `CONNECTOR_PREFLIGHT_CURRENT_HEAD_COMPLETE_EXECUTION_RESERVED_TO_CODEX`

Execution surface: ChatGPT via GitHub Connector; documentation/evidence preparation only

Inspected hosted `master`: `a2d86f3753fd0ab599760a2cf6e80a0c926ea03b`

Readiness-decision source head: `dc89c8f0421e3e657740f03ecfa611a29ae2f8b3`

Accepted representative implementation: `3ca23d6864541a899ea61a6bf26257665f754e78`

Accepted readiness result: `BAND_ENTRY_READY`

Active route: `Version 0.7.0 - Integrated Gameplay Systems Band Entry`

Final milestone authority remains reserved to Codex:

- `MILESTONE_ENTRY_ACCEPTED`; or
- `MILESTONE_ENTRY_BLOCKED`.

## 1. Purpose

Refresh the installed milestone package against the actual current hosted head after Sites deployment and launcher-asset work, while separately calibrating internal maturity against real player-facing playability.

This packet supersedes the 2026-08-28 Connector preflight for current-head orientation only. The older packet remains historical evidence for the earlier hosting state.

## 2. Current Site And Deployment State

Preview-hosting support is complete for the current intended owner-only preview lane.

Current durable evidence records:

- ChatGPT Sites project linked through `apps/rpg-ui/.openai/hosting.json`;
- owner-only preview at `https://lineage-reforged-preview.vagabond1215.chatgpt.site`;
- Sites version 2 sourced from filtered deployment commit `8857c08bb272f36938fde0a72087c5c0865be80b`;
- final Bloodlines active/inactive launcher PNGs migrated back into authoritative Lineage history at `e58d650203bde7d84a6a56ab1501bfac4e18901c`;
- documentation reconciliation at current head `a2d86f3753fd0ab599760a2cf6e80a0c926ea03b`.

No further preview-hosting package is required unless access policy, deployment source, or asset delivery changes.

## 3. Complete Post-Readiness Delta

GitHub comparison from `dc89c8f0421e3e657740f03ecfa611a29ae2f8b3` to current head `a2d86f3753fd0ab599760a2cf6e80a0c926ea03b` reports:

- status: `ahead`;
- commits: 11;
- behind: 0.

The delta consists of:

1. readiness publication and route coordination;
2. future material-property design documentation;
3. Sites/Vite/Cloudflare hosting dependency and build configuration;
4. Connector preflight documentation and correction;
5. hosting blocker documentation;
6. production-only character-creator asset URL routing plus focused unit test;
7. private Sites deployment documentation;
8. Bloodlines launcher mapping/assets plus focused unit test;
9. exact deployed Bloodlines asset migration;
10. final migration documentation.

Changed runtime/application surfaces are limited to hosting/build configuration and presentation/asset delivery:

- `apps/rpg-ui/package*.json`;
- Vite/TypeScript/Worker/Wrangler hosting configuration;
- `characterCreatorAssetUrl.ts`;
- asset-source calls in `CharacterCreationNarrativeScreen.tsx`;
- launcher Bloodlines asset mapping in `AppShell.tsx`;
- launcher/creator image files;
- two focused asset tests.

No post-readiness commit changes:

- game-engine survey advancement ownership;
- campaign admission/persistence authority;
- quest acceptance/access ownership;
- travel/arrival ownership;
- representative ordinary-reachability integration test;
- survey command/persistence tests;
- campaign persistence tests.

Connector inspection therefore finds no direct semantic drift in the accepted representative gameplay loop. Codex must still independently verify that conclusion locally before milestone publication.

## 4. Hosted Validation Evidence

Current hosted head has:

- no combined commit status entries;
- no GitHub Actions workflow run attached to the head through the available commit-run query.

Repository history records successful direct local checks for the Sites/Bloodlines work, including focused asset tests, Node-side typecheck, direct Vite build, local HTTP response, Sites readback, and exact deployed asset matching. Those are predecessor evidence, not fresh current-head executable proof.

## 5. Live Branch And PR Snapshot

Connector-visible hosted inventory remains:

- 38 branches total;
- 37 non-default branches;
- exactly 2 open pull requests.

Open PRs remain:

- PR #2 — launcher asset contract evidence, head `e78dc645cfb658685be12f45f46d34b7c0da1119`, `SUPERSEDED_PRESERVE_EVIDENCE`;
- PR #3 — historical `0.6.9.7` repair bundle evidence, head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`, `SUPERSEDED_PRESERVE_EVIDENCE`.

The four survey evidence refs remain candidate evidence for broader named consumers; readiness and prompt-packaging refs remain protected evidence; administration evidence remains held for its named consumer. No Connector-visible lifecycle fact justifies merge, cherry-pick, rebase, force update, PR mutation, closure, or branch deletion in the milestone package.

Local branch/worktree state remains mandatory Codex verification.

## 6. Playability Calibration

Use `docs/dev/playability-posture-and-version-calibration.md` with the internal versioning policy.

Current calibration before milestone publication:

- internal maturity: `0.6.x`, with `0.7.0` authorized pending publication;
- playability posture: `INTEGRATED_LOOP_PENDING_PUBLICATION`;
- deployment posture: owner-only preview operational.

If `0.7.0` is accepted, the correct playability posture becomes `INTEGRATED_LOOP`.

It does **not** become `VERTICAL_SLICE`, `PRE_ALPHA`, or “70% complete.”

The representative path remains deliberately narrow and ends with Soundings active/unturned-in. Important playability gaps remain in quest closure/rewards, individualized inventory, crafting runtime depth, persistent generated NPCs/services, broader combat/economy integration, UI/accessibility hardening, balance, and content breadth.

These gaps do not invalidate the accepted `0.7.0` criteria. They do require the next planning route to optimize for actual playable depth rather than version-number momentum.

## 7. Exact Codex Current-Head Verification

The installed prompt remains controlling. Codex should at minimum:

1. fetch/prune and verify repository identity, clean/understood worktree, synchronized `master`, and upstream;
2. inspect the complete 11-commit delta from `dc89c8f...` to synchronized live head;
3. verify the post-readiness UI/hosting changes do not alter the representative gameplay owners or tests;
4. reinspect the real creator, publication/load, quest acceptance/access, travel/arrival, survey owner, campaign admission, real caller, accepted-only session bridge, persistence, and representative integration;
5. run the representative ordinary-reachability test;
6. run the focused survey-command and survey-persistence tests;
7. run the focused campaign-persistence tests required by the milestone prompt;
8. run `tests/unit/character-creator-asset-url.test.mjs` and `tests/unit/launcher-bloodlines-asset.test.mjs` because those are the current-head tracked tests added after readiness;
9. run the Node-side UI configuration typecheck;
10. run a direct Vite production build or equivalent current build path that exercises the Sites/Cloudflare configuration, while characterizing the known broad TypeScript baseline rather than silently treating it as green;
11. verify final diff/worktree/branch state before documentation publication.

Expand only if drift or failure requires it.

## 8. Post-Acceptance Route

If the milestone returns `MILESTONE_ENTRY_ACCEPTED`, do not automatically assign `0.7.1`.

Install the separate unversioned route:

`0.7.x Playability Gap Prioritization Decision`

That decision must compare player-facing payoff and dependency closure across the remaining gaps before selecting the next primary capability. A narrow authoritative Soundings turn-in/reward lane is a strong candidate because it closes the current representative quest loop, but it should not be assigned solely from version-sequence momentum.

`0.8.0` remains reserved for the independently proven vertical-slice gate.

## 9. Connector Disposition

`CONNECTOR_PREFLIGHT_CURRENT_HEAD_COMPLETE_EXECUTION_RESERVED_TO_CODEX`

No milestone result is issued.

No production, test, schema, content, save, migration, dependency, asset, branch, or PR was mutated by this Connector preflight.
