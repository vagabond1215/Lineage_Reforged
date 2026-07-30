# Version 0.6.9 - Normal Stakes Campaign Persistence Foundation

## Run Identity

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Label class: primary

Parent version: not applicable

Milestone impact: `advances_current_band`

Suggested commit:

`feat(save): add Normal campaign persistence authority`

## Purpose

Implement the accepted atomic Normal-only campaign persistence foundation:

1. campaign-rules semantic version 2 and stable campaign/continuity/character identity;
2. storage envelope version 7 with verified candidate publication and version-6 migration;
3. first-accepted-mutation child continuity after loading a non-head artifact;
4. engine-owned nonterminal Normal Stakes defeat and active legacy HP-zero repair;
5. publication-anchored, idempotent account history/achievement/Legacy/retirement consumers.

This package must leave the repository with one coherent authority boundary. Do not land a partial state in which campaign rules activate while ordinary HP zero still archives/deletes, or account value can publish from an unpublished branch.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, and static-content program;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`;
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`;
- `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- every current snapshot writer, save/load/delete path, lifecycle path, achievement/account consumer, new-game path, and relevant focused test;
- the isolated readiness branch through read-only Git inspection only.

## Execution Gate

1. Verify branch, clean worktree, upstream, current head, and active prompt.
2. Run `git fetch --all --prune`; inventory branches and open PRs; refresh the branch register for proven changes.
3. Confirm the source decision is `PACKAGE_READY` for exact `Version 0.6.9`.
4. Confirm no branch contains a newer overlapping implementation requiring integration.
5. Reproduce the current 107-test focused baseline named in the source output.
6. Reproduce the complete persisted-snapshot mutation matrix and current HP-zero/account-save ordering.
7. Stop before production edits if the worktree is dirty, a required authority conflicts, or the atomic package cannot remain within the authorized boundary.

## Required Implementation

### A. Campaign and save contracts

- Add campaign-rules version 2 with Normal-only live activation, policy revision 1, canonical migrated Difficulty, `heroic_world`, typed provenance, and registered compatibility overrides only.
- Add stable account/campaign/continuity/character/artifact/generation/publication/head-revision identities.
- Add the versioned persisted authority-ledger container without inventing survey records or retroactive receipts for existing commands.
- Use target snapshot-format identity `lineage.save_snapshot.v2`, and keep it, storage-schema version 7, campaign-rules version 2, Stakes policy revision 1, and workflow `0.6.9` distinct.
- Use `crypto.randomUUID()` or fail closed. No weak fallback.

### B. Envelope version 7 and publication

- Introduce storage envelope version 7 and campaign-control/head records.
- Preserve 128 manual addresses and quick-save.
- Write candidates under non-head keys.
- Read back exact bytes, run semantic validation, publish the head, then verify the publication.
- Retain the immediately prior verified compatible artifact required for recovery.
- Update address metadata and other projections after publication.
- UI save success requires verified publication.
- Saving an unchanged non-head artifact binds/copies that artifact and must not advance campaign head or create a child.

### C. Version-6 migration

- Preserve original version-6 bytes.
- Write/reuse one pending owner-certified migration receipt with stable target ids and per-source artifact mapping.
- Group sources only through complete account/history/player/start/rules/fingerprint evidence.
- Certify the initial head only when there is one source artifact or one unique envelope `savedAt` exactly matching the account profile's `lastPlayedAt` inside the validated group.
- Quarantine ambiguous multi-artifact groups.
- Map legacy difficulty and Hardcore exactly as accepted.
- Rekey active history to the target character only after target publication.
- Keep migration idempotent across interruption and retry.

### D. Campaign session and first mutation

- Carry `CampaignSessionControl` beside the in-game snapshot.
- Load verified head/non-head posture from save authority.
- Accept structured mutation submissions with stable ids, source revision, owner/bridge kind, accepted posture, and proposed snapshot.
- Preserve engine-owned accepted discriminators and correlation.
- Use explicit temporary legacy bridge admission; source-snapshot identity means rejection/no-change only where locked by tests.
- Rejected, duplicate, or stale submissions must not mutate, fork, mark dirty, evaluate account state, or trigger defeat.
- Create exactly one in-memory child continuity before the first accepted mutation from a non-head artifact.
- Reuse that child for later accepted mutations.
- Make it durable only on verified publication.
- Discard it and every provisional account calculation when unsaved play exits.

All persisted snapshot changes, including current pin/favorite preferences while they remain in the snapshot, participate in the same divergence rule.

### E. Normal Stakes defeat

- Add one engine-owned Normal defeat resolver and typed retained receipt/result.
- Run it after accepted mutation admission when resulting HP is zero.
- Clear active encounter and transient combat bindings.
- Use the accepted destination chain.
- For playable fallback, advance exactly four ticks.
- Set HP to `min(maxHP, max(1, ceil(maxHP * 0.25)))`.
- Set Stamina to `min(maxStamina, max(currentStamina, 12))`.
- Preserve MP and body state.
- Preserve inventory, equipment, currency, quests, party membership, attributes, injury/trauma, and permanent truth.
- Produce one Chronicle projection and notice from the retained result.
- Make duplicate resolution idempotent.
- Keep ordinary defeat unsaved.
- Keep `recovery_pending` nonterminal and diagnostic.
- Remove ordinary HP-zero access to terminal archival, payout, estate, and save deletion.

### F. Active legacy HP-zero repair

- Block archived/deleted history first.
- Migrate rules and identity.
- Resolve one `unknown_or_legacy` defeat.
- Publish the repaired target artifact at the loaded address before play.
- Advance the campaign head only when the repaired source was the certified head.
- Keep repaired non-head sources non-head.
- Do not create a player-divergence child for owner-certified repair.
- On any required write/consumer failure, preserve source, block entry, and retry from retained receipts.

### G. Account publication

- Stop persisting account progress from ordinary `onSnapshotChange`.
- Prepare character-owned achievement state inside the campaign snapshot before publication.
- Apply active history, account metrics, account achievements, Legacy rewards, preparation consumption, inheritance-use consumption, and `lastPlayedAt` only after verified publication.
- Key each account consumer by publication id plus registered consumer kind.
- Store applied/pending consumer receipts and make retries idempotent.
- Conflicting payload under one consumer id fails closed.
- A projection failure after publication leaves gameplay truth published and creates a repairable pending consumer.
- Mandatory new-game preparation/inheritance consumers block entry and further preparation use until repaired.
- Startup/account selection repairs mandatory pending consumers before exposing duplicable account value.

### H. Explicit retirement

- Keep the current explicit confirmation and terminal semantics.
- Publish and verify a terminal retirement campaign artifact/control result before existing account settlement.
- Apply existing retirement history, payout, Legacy, and estate behavior through publication-keyed idempotent consumers.
- Remove player-continuable address bindings only after mandatory consumers succeed.
- Retain hidden closed authority for duplicate prevention.
- Do not change retirement balance, estate contents, inheritance counts, or user-facing intent.

## Authorized Production Scope

Use only the necessary subset of:

- `packages/shared/types/src/contracts.ts`;
- `packages/shared/persistence/src/index.ts` and `.js`;
- `packages/engines/game-engine/src/save-snapshot.ts` and `.js`;
- `packages/engines/game-engine/src/index.ts` and `.js`;
- new mirrored campaign-rules, save-authority, account-publication, and Normal-defeat owner modules;
- `packages/engines/game-engine/src/achievements.ts` and `.js`;
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`;
- `apps/rpg-ui/src/game-shell/state.ts`;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`;
- `apps/rpg-ui/src/game-shell/InGameShell.tsx`;
- `apps/rpg-ui/src/features/WorldPanel.tsx`;
- `apps/rpg-ui/src/features/QuestsPanel.tsx`;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`;
- `apps/rpg-ui/src/features/CharacterPanel.tsx`;
- `apps/rpg-ui/src/App.tsx`;
- focused existing and new tests beside the current save, migration, lifecycle, achievement, command, and combat tests.

Adding a narrowly named owner or focused test beside these paths is allowed. Stop before using an unrelated production path.

Keep tracked TypeScript/JavaScript mirrors aligned. Add no production dependency.

## Prohibited Scope

Do not:

- implement Ashen Reef survey advancement or survey receipts;
- rewrite quest turn-in, rest, equipment, inventory, or activity mechanics beyond required mutation-admission metadata;
- implement Committed, Ironbound, checkpoint selection, or save-browser redesign;
- implement actual death, succession, resurrection, injury, trauma, care, or estate redesign;
- expose Story or Grim;
- add a generic command bus, transaction framework, replay service, effect engine, cloud merge, encryption, anti-cheat, or telemetry;
- edit content catalogs, schemas, assets, generated files, or unrelated UI;
- merge or delete protected branches;
- integrate unrelated candidate branches;
- run broad workspace typecheck as the acceptance gate.

## Required Tests

Add focused tests for every obligation in Section 15 of the source dependency-closure decision, including:

- target new-game/save/load roundtrip;
- every migration mapping, retry, source retention, unique-head proof, and ambiguity quarantine;
- head/non-head load and first-mutation behavior across engine, legacy, preference, rejected, duplicate, and stale submissions;
- unchanged non-head save behavior;
- candidate/readback/publication failures;
- publication-before-account ordering and consumer retry/idempotency;
- new-game preparation/inheritance repair;
- combat and noncombat Normal defeat, exact fallback values, preservation, idempotency, and no forced save;
- active legacy HP-zero head and non-head repair;
- explicit retirement publication-before-settlement;
- copied-artifact identity;
- source guards for removed ordinary HP-zero archival and no eager account persistence;
- TypeScript/JavaScript mirror/export parity.

Re-run the existing focused baseline:

```text
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs
```

Run additional focused tests created by the package. Run a bounded TypeScript check only if it can target the changed project without turning the known 173-diagnostic workspace audit into a gate.

## Documentation And Completion

- Add a focused implementation document only if needed for durable field/path detail not already captured by the source decision.
- Update current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning anchor, backlog, static-content program, and branch register for proven results.
- Install a parent-specific `Version 0.6.9.1 - Normal Stakes Campaign Persistence Foundation Acceptance Audit` prompt after implementation and green focused validation.
- If implementation or a required gate fails, install the smallest exact parent-specific repair or audit prompt and do not claim parent acceptance.
- Do not install a survey implementation prompt directly from this run.

## Completion Report

Report:

- starting and final commits;
- repository/branch/PR actions and retained triggers;
- exact files changed;
- campaign/session/save identities and format revisions;
- migration and unique-head behavior;
- first-mutation behavior;
- defeat and legacy-repair behavior;
- account publication and retry behavior;
- retirement ordering;
- tests/checks run with counts;
- any failed or skipped gate;
- risks and follow-up notes;
- installed support prompt.
