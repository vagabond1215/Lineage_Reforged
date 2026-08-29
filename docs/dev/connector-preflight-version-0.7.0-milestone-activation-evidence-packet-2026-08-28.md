# Connector Preflight - Version 0.7.0 Milestone Activation Evidence Packet

Date: 2026-08-28

Status: `CONNECTOR_PREFLIGHT_REFRESH_COMPLETE_EXECUTION_RESERVED_TO_CODEX`

Execution surface: ChatGPT via GitHub Connector; repository-aware documentation/evidence preparation only

Inspected hosted `master`: `5f723d2924fef53b749c897440dfd2817499de32`

Readiness-decision starting head: `dc89c8f0421e3e657740f03ecfa611a29ae2f8b3`

Accepted implementation: `3ca23d6864541a899ea61a6bf26257665f754e78`

Accepted readiness decision: `BAND_ENTRY_READY`

Active route: `Version 0.7.0 - Integrated Gameplay Systems Band Entry`

Final milestone authority remains reserved to Codex:

- `MILESTONE_ENTRY_ACCEPTED`; or
- `MILESTONE_ENTRY_BLOCKED`.

This packet is orientation evidence only. It does not execute tests, builds, typechecks, or local worktree checks and must not be cited as milestone acceptance.

## 1. Purpose

Reduce the installed `0.7.0` milestone-activation run to current-head delta verification, focused executable proof, and publication rather than broad repository rediscovery.

The earlier Connector packet at `docs/dev/connector-preflight-integrated-gameplay-0.7-band-entry-evidence-packet.md` supported the now-completed readiness decision. Preserve it as historical predecessor evidence. This packet is the separate refresh for the active milestone-activation route.

## 2. Current Route And Accepted Boundary

The accepted readiness decision at `docs/design/integrated-gameplay-0.7-band-entry-readiness-decision.md` returned `BAND_ENTRY_READY`.

The representative authority remains the injection-free Starfall -> Soundings acceptance/Ashen access -> engine-owned travel/arrival -> four engine-owned survey shifts -> campaign admission -> persistence/restart -> empty-cache durable duplicate loop.

Soundings remains active and unturned-in. Turn-in/rewards, generic reward architecture, inventory instances, generated-person/NPC promotion, class/progression cleanup, attribute rebalance, generic quest/travel/activity/event/effect frameworks, other Stakes modes, and `0.8+` hardening remain outside the milestone package.

The Connector found no evidence that the material-property future-design note changes this route. It is documentation-only future intent and is not implementation authority.

## 3. Complete Post-Readiness Delta

GitHub comparison from readiness-decision starting head `dc89c8f0421e3e657740f03ecfa611a29ae2f8b3` to inspected head `5f723d2924fef53b749c897440dfd2817499de32` reports:

- status: `ahead`;
- commits: 3;
- behind: 0.

The three commits are:

### A. `354cad2fc0d4295b567f5b376fcf5afca3efb4a8` — `docs: approve integrated gameplay band entry`

Documentation/coordination only. It publishes the accepted readiness decision and installs the separate `Version 0.7.0` milestone-activation prompt.

No production, tracked-test, schema, content, dependency, asset, save, or gameplay file is changed by this commit.

### B. `53acee1f95aa27799166d169e48e1e0115e2ef85` — `docs: record material property crafting direction`

Changes only:

- `docs/design/future-system-design-ledger.md`.

This is future design intent only. It explicitly preserves the current fixed-recipe baseline and does not alter crafting runtime, schemas, content, inventory, equipment, economy, or the accepted representative loop.

### C. `5f723d2924fef53b749c897440dfd2817499de32` — `build(ui): enable Sites preview hosting`

This is the only post-readiness non-documentation drift.

Changed paths:

- `.gitignore`;
- `apps/rpg-ui/.openai/hosting.json`;
- `apps/rpg-ui/package-lock.json`;
- `apps/rpg-ui/package.json`;
- `apps/rpg-ui/tsconfig.json`;
- `apps/rpg-ui/tsconfig.node.json`;
- `apps/rpg-ui/vite.config.ts`;
- `apps/rpg-ui/worker/index.ts`;
- `apps/rpg-ui/wrangler.jsonc`.

The commit:

- adds OpenAI Sites and Cloudflare Vite/Workers dependencies;
- upgrades Vite and the React Vite plugin;
- changes TypeScript configuration;
- makes the application config load Sites and Cloudflare build plugins;
- adds a minimal asset-serving worker and Wrangler configuration;
- does not modify the existing `apps/rpg-ui/src/**` gameplay/runtime caller paths;
- does not modify any `packages/engines/**` gameplay owner;
- does not modify any tracked representative, survey, or campaign-persistence test.

Therefore the Connector found **no direct representative-gameplay semantic drift** after the accepted readiness decision. The build/toolchain drift still requires local executable characterization because it can affect whether the current application builds and typechecks.

## 4. Current Build And Validation Surface

Current root scripts include:

- `npm run typecheck:ui`;
- `npm run typecheck:ui:node`;
- `npm run ui:build`;
- `npm test`.

Current `apps/rpg-ui/package.json` has:

- `typecheck`: `tsc --noEmit -p tsconfig.json`;
- `typecheck:node`: `tsc --noEmit --tsBuildInfoFile ../../.tmp-rpg-ui-node.tsbuildinfo -p tsconfig.node.json`;
- `build`: `tsc -p tsconfig.json && vite build`.

The accepted predecessor recorded a nonzero bounded TypeScript baseline, so a nonzero broad UI typecheck must not be treated as a new blocker merely by count. Codex should compare diagnostics semantically against the accepted baseline and specifically identify whether the hosting/toolchain changed paths introduce new diagnostics.

Because the Vite/Cloudflare/Sites configuration changed after readiness, Codex should also execute the current production build path or an equivalent current Vite build that actually loads the new build plugins. If the ordinary `ui:build` command is blocked only by the pre-existing TypeScript baseline, Codex should separately characterize that baseline and still execute the Vite build portion needed to prove the new configuration.

GitHub reports:

- no combined commit statuses on `5f723d2924fef53b749c897440dfd2817499de32`;
- no workflow runs attached to `5f723d2924fef53b749c897440dfd2817499de32`.

There is therefore no hosted executable evidence that can replace local validation.

## 5. Exact Codex Local Verification Recommended

The installed prompt remains controlling. In addition to its required checks, the current-head drift warrants this bounded local sequence:

1. fetch/prune and verify repository identity, `master`, upstream, synchronized HEAD, and clean/understood worktree;
2. verify the complete delta from `dc89c8f...` through the synchronized local head, including any Connector documentation commits after this packet's source head;
3. confirm no intervening commit changed the representative gameplay owners or tracked tests;
4. re-read the real creator, campaign admission/publication, quest acceptance/access, travel, survey owner, real caller, accepted-only session application, and persistence paths required by the active prompt;
5. run the representative ordinary-reachability test;
6. run the survey advancement command and persistence tests;
7. run the campaign persistence focused test required by the prompt;
8. verify the representative test still imports no `demoSnapshot`, injects no eligibility state, finishes Soundings active/unturned-in, and asserts the durable duplicate plus exact authority graph;
9. run/characterize `npm run typecheck:ui:node` for the changed Vite/Node configuration;
10. run/characterize `npm run typecheck:ui` against the accepted nonzero diagnostic baseline, with special attention to changed hosting/worker/config files;
11. execute the current Vite/production build path so `@openai/sites-vite-plugin` and `@cloudflare/vite-plugin` are actually loaded;
12. inspect `git diff --check`, final status, and final branch/upstream state before publication.

If the hosting/toolchain drift produces a real current-head build or type-contract defect that prevents the milestone's playable current application from being validated, fail closed and classify the smallest exact repair rather than silently ignoring it.

Do not broaden this into packaging, deployment acceptance, `0.8.x` hosting hardening, or release work. The purpose is only to characterize post-readiness drift strongly enough to decide the installed `0.7.0` gate.

## 6. Branch And PR Snapshot

Connector-visible hosted inventory at `5f723d2924fef53b749c897440dfd2817499de32`:

- 38 hosted branches total;
- 37 non-default branches;
- 2 open pull requests.

Open pull requests:

- PR #2, `Add launcher asset contract and sidebar metadata`, open non-draft, head `main-menu-asset-contract-pass` at `e78dc645cfb658685be12f45f46d34b7c0da1119`;
- PR #3, `Evidence only: preserve 0.6.9.7 repair bundle`, open draft, head `parallel/0.6.9.7-repair-bundle` at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`.

Relevant exact evidence refs remain unchanged:

- `parallel/activity-advancement-audit`: `b4cbaea5f4292904bba62f60a0108bb84f2bd405`;
- `parallel/player-progression-reward-mutation-audit`: `387f2491d0d671ee7834656c28183e72a798f1ca`;
- `parallel/chronicle-notification-provenance-audit`: `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`;
- `parallel/knowledge-discovery-visibility-audit`: `46434f31f8b06d49aad9a516543fbe36d188d519`;
- `parallel/prompt-packaging-integrity-audit`: `58a34e37ee531aa1f6c87086b4a4a6d20d571f9f`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `59c103c3a06d55f35bffa735fd4b7814dffb583e`;
- `admin/genesis-research-evidence-2026-08-13`: `210df5bcc017a8f31d621a553b5496c668540d29`.

Current dispositions remain:

- PR #2 and PR #3: `SUPERSEDED_PRESERVE_EVIDENCE`;
- four survey evidence refs: `CANDIDATE_INTEGRATION` only for broader named consumers;
- integrated-gameplay readiness and prompt-packaging refs: `PROTECTED_REFERENCE`;
- administration evidence: `HOLD_NAMED_CONSUMER`.

No Connector-visible lifecycle fact justifies merge, cherry-pick, rebase, force update, PR mutation, closure, or branch deletion in the active milestone package.

Local-only branch/worktree state cannot be verified by the Connector and remains a mandatory Codex preflight item.

## 7. Failure-Pattern Mapping

At minimum retain the installed prompt's:

- `FP-001` — prove the real caller rather than helper/fixture behavior;
- `FP-002` — green counts do not replace semantic current-head inspection;
- `FP-008` — Connector/branch/PR artifacts remain evidence only;
- `FP-009` — distinguish inspected, decision, coordination, committed, pushed, tracking, and hosted identities;
- `FP-013` — preserve nested accepted survey authority across later persistence/recovery owners;
- `FP-014` — preserve deep semantic/canonical authority and projection placement;
- `FP-017` — representative reachability must remain injection-free.

For the new hosting/toolchain drift, `FP-002` is especially important: an unchanged gameplay test set does not by itself prove the changed build configuration is valid.

## 8. Package Size And Codex Handoff

Recommended Codex package size after this preflight: `S`.

Reason:

- the milestone decision is already made at readiness level;
- no gameplay implementation is authorized;
- Connector reconnaissance and remote branch/PR inventory are complete at an exact source head;
- the remaining work is one bounded current-head validation/publication concern.

Expected first durable checkpoint:

- synchronized current head;
- focused gameplay gate reproduced;
- post-readiness hosting/toolchain drift locally characterized.

Codex should use this packet for orientation acceleration only. It must independently verify every material claim needed for its final disposition and run all executable proof itself.

## 9. Connector Disposition

`CONNECTOR_PREFLIGHT_REFRESH_COMPLETE_EXECUTION_RESERVED_TO_CODEX`

No milestone outcome is issued.

No production, tracked test, schema, content, save, migration, gameplay, dependency, asset, UI runtime source, branch, or PR was mutated by this Connector pass.

Next action requiring a stronger execution surface:

`Version 0.7.0 - Integrated Gameplay Systems Band Entry` in an authenticated Codex/local repository checkout.
