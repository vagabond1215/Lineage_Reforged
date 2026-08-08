# Version 0.6.10 - Ashen Reef Survey Advancement Authority

## Run Identity

`Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Label class: primary

Parent version: none

Milestone impact: `advances_current_band`

Suggested commit:

`feat(survey): establish advancement authority`

## Purpose

Implement the accepted Ashen Reef survey occurrence/result/consequence-receipt contract together with the one bounded engine-owned survey advancement command that proves it. Replace only the current Ashen Reef advancement and preview branch with a persisted, continuity-correct, replay-safe, four-stage command/result path and accepted-only UI application.

Do not implement a types-only container. Do not generalize an activity resolver, command bus, effect engine, transaction framework, replay service, correction service, lineage framework, or event bus.

## Required Reading

Read completely before editing:

- `AGENTS.md`;
- `docs/design/ashen-reef-survey-occurrence-result-and-consequence-receipt-foundation-decision.md`;
- `docs/design/ashen-reef-survey-activity-advancement-scope-and-owner-contract-decision.md`;
- `docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-defeat-recovery-completion-lineage-repair-decision.md`;
- `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md`;
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/prompt-execution-platform-tool-selection-policy.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- the complete current output, prompt, handoff, historical/deferred register, planning reconciliation, roadmap, sequenced plan, continuity brief, backlog, and static-content program;
- current campaign rules/session, shared snapshot/event contracts, save/publication, survey caller, gameplay synchronization, player body/resource/stat/skill owners, JS mirrors, and focused tests;
- `docs/dev/connector-ashen-reef-survey-decision-prestage-2026-08-08.md` as historical orientation evidence only;
- through read-only exact-ref Git inspection, without merging or modifying the branches:
  - `parallel/activity-advancement-audit` at `b4cbaea5f4292904bba62f60a0108bb84f2bd405`;
  - `parallel/player-progression-reward-mutation-audit` at `387f2491d0d671ee7834656c28183e72a798f1ca`;
  - `parallel/chronicle-notification-provenance-audit` at `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`;
  - `parallel/knowledge-discovery-visibility-audit` at `46434f31f8b06d49aad9a516543fbe36d188d519`;
- the protected `prep/integrated-gameplay-0-7-readiness-audit` branch at `59c103c3a06d55f35bffa735fd4b7814dffb583e`, read-only, with historical route facts ignored.

## Execution Gate

1. Synchronize clean authenticated `master` with `origin/master`; record inspected base and implementation starting head.
2. Run `git fetch --all --prune`; inventory every local/remote branch and open PR; recheck merge bases, divergence, unique commits, changed paths, current authority, and semantic overlap.
3. Re-run the existing five survey skill-gating tests and the 33 campaign-persistence tests before editing.
4. Add and pass a focused current-behavior characterization for all four survey stages before removing the legacy branch.
5. Build one numbered implementation-finding matrix from the permanent decision and map every row to source, test, and acceptance evidence.
6. Keep all evidence and protected branches read-only. Do not merge, cherry-pick, rebase, force-update, close, or delete them.
7. If the live checkout contradicts the permanent decision on an owner, continuity, persistence, or caller boundary, stop fail-closed with the exact contradiction. Do not guess or broaden.

## Required Implementation

### A. Add the bounded persisted survey authority

Add the optional `CampaignAuthorityLedgerState.ashenReefSurvey` version-1 container with exactly the accepted:

- optional legacy baseline;
- admitted request records;
- occurrences;
- deterministic results;
- affected-owner consequence receipts;
- projection-repair records;
- correction/supersession and per-owner reconciliation records.

Keep target snapshot `lineage.save_snapshot.v2`, envelope version `7`, and campaign ledger version `1`.

Implement strict deep validation for identity uniqueness, campaign/character scope, reachable continuity, referential completeness, unique `(resultId, owner, kind)` tuples, required stage receipt sets, correction acyclicity, projection-repair provenance, and material state coherence.

New/migrated target snapshots may initialize the empty container. Existing target snapshots without it remain valid and must not be rewritten merely to add emptiness. On the first accepted survey command, record a coherent pre-receipt baseline when current survey state predates the container; never infer past requests, occurrences, results, or receipts from flags, notifications, Chronicle rows, ticks, or hashes.

### B. Implement exact identities and retry equivalence

Use:

- `survey_request.<uuid>`;
- `survey_occurrence.<request-uuid>`;
- `survey_result.<request-uuid>`;
- `survey_consequence.<request-uuid>.<kind>`;
- result-derived event, notification, and Chronicle ids;
- namespaced repair and correction ids.

Persist the full normalized request facts and their versioned canonical serialization. Exact structural equality of the named material fields defines an equivalent retry. Whole-snapshot hashes, tick, event ids, projection ids, slot ids, and array position do not.

Look up request identity before stale-state rejection. An exact persisted duplicate returns the original result/receipt evidence with the current authoritative snapshot and performs no effect or projection. Conflicting, missing, duplicated, orphaned, reordered, or incomplete retained evidence fails closed.

Pre-admission rejections return the original snapshot/control and create no persisted request, occurrence, result, or consequence in this package.

### C. Fix the continuity-before-receipt seam

The current `admitCampaignMutation(...)` accepts an already-mutated snapshot and may then create a child continuity. Do not author survey records against the source continuity and let admission rewrite only `campaignIdentity`.

Implement the smallest bounded campaign prepare/commit seam needed so the survey path:

1. validates source artifact/publication/revision and campaign control;
2. selects or creates the accepted continuity exactly once;
3. builds occurrence/result/receipt records against that accepted continuity;
4. atomically commits the candidate and campaign control.

Preserve current callers and Normal-defeat/recovery behavior. Do not turn the seam into a generic workflow framework.

### D. Implement one pure four-stage plan

One resolver must drive preview and execution for:

- `sector_1`;
- `sector_2`;
- `sector_3`;
- `ruins_confirmation`.

Preserve the current intended two ticks, body/metabolic profile, attribute load, natural resource/runtime resolution, explicit Stamina `-10`, MP `-3`, exact skill ids and breakthrough policy, sector/ruins facts, operation values, discovery content, current-activity replacement, text, and presentation caps.

Reject without mutation:

- malformed command;
- wrong account/player/campaign/control;
- wrong artifact or stale revision;
- missing, inactive, or untracked survey quest;
- wrong location;
- unknown/noncontiguous/ruins-before-sectors progress;
- already-complete survey;
- duplicate or mismatched Stormglass discovery entry/flag/source/reference state;
- conflicting retry or pending unresolved correction;
- transition/validation failure.

After completion, preview and execution both report `survey_already_complete`; neither falls through to generic activity advancement.

### E. Apply every owner and record every receipt

Implement the permanent decision's exact owner matrix:

- time;
- body/metabolic state;
- attribute load/stat growth;
- natural and explicit resources;
- General Lore or flora-identification skill progression, including `blocked_at_gate`;
- survey progress and quest synchronization;
- survey operation;
- Stormglass discovery record and compatibility flag;
- conditional existing Codex-row visibility projection;
- final current-activity transition;
- snapshot synchronization postcondition;
- notification, session Chronicle, and typed event projections.

The final survey shift grants no geographic Knowledge, known location, map visibility, travel access, currency, standing, reputation, inventory, or turn-in reward.

All gameplay owner applications and their complete receipts must exist before acceptance. Missing gameplay receipts invalidate the candidate; do not retry a subset of gameplay effects.

### F. Implement bounded projection repair and correction posture

Derive notification, session Chronicle, event, and safe notice facts from the accepted result. Preserve notification cap 8 and session Chronicle cap 48.

If projection work fails after accepted gameplay truth, retain `projection_pending`. Provide a production-reachable, validated repair owner that:

- verifies the source result and current destination;
- replaces only a same-id/same-source malformed row;
- inserts only a still-retention-eligible missing row at deterministic order;
- never resurrects an expired row or overwrites newer/unrelated truth;
- appends a projection-repair record;
- is restart-safe and duplicate-safe.

Implement and validate the correction/supersession record shape and pending-correction block. Do not add correction execution, rollback, reroll, compensating gameplay effects, or a correction UI.

### G. Migrate the real caller

Move only Ashen Reef survey preview/execution authority out of `gameplayLoop.ts`.

`ActivityPanel` must:

- consume the complete shared plan preview;
- show a safe unavailable reason;
- invoke the bounded engine/campaign path;
- apply state only for an accepted result;
- retain the request id across same-delivery rerender/retry;
- never regenerate identity for a technical retry;
- surface safe duplicate, conflict, pending-projection, and correction-pending facts without exposing hidden authority.

Add source guards proving the direct survey mutation branch is gone while unrelated generic activity, procurement, rest, and turn-in behavior remains unchanged.

## Authorized Production Surface

Required:

- `packages/shared/types/src/contracts.ts`;
- `packages/shared/events/src/index.ts` and `index.js`;
- `packages/engines/game-engine/src/campaign-rules.ts` and `.js`;
- `packages/engines/game-engine/src/campaign-session.ts` and `.js`;
- new `packages/engines/game-engine/src/player-survey-activity-advancement.ts` and `.js`;
- `packages/engines/game-engine/src/index.ts` and `.js`;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`;
- focused test and required coordination files.

Conditionally allowed only with direct evidence recorded before editing:

- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts` and `.js`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`.

Any other production path requires a fail-closed scope decision.

## Required Validation

Add and run:

- `tests/unit/player-survey-activity-advancement-characterization.test.mjs`;
- `tests/unit/player-survey-activity-advancement-command.test.mjs`;
- focused survey receipt/save/publication coverage;
- `tests/unit/gameplay-loop-skill-gating.test.mjs`;
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- `tests/simulation/save-load-roundtrip.test.mjs`;
- adjacent travel, quest acceptance/tracking, activity selection, body/resource, progression, campaign publication, and UI caller/source-guard tests selected from the validation matrix;
- JS/TS mirror and public export checks;
- the RPG UI production build;
- the applicable bounded TypeScript check, without weakening or claiming the known broad workspace backlog as green;
- serialization/browser-safety probes for every persisted shape;
- `git diff --check`, complete diff inspection, and repository hygiene checks.

The test matrix must include:

- all four stages;
- preview/execution parity;
- every rejection;
- head and non-head first/later mutation;
- exact accepted-continuity binding;
- same-process duplicate, later-state duplicate, caller-state loss, UI rerender, save/restart duplicate, and regenerated-transient conflict;
- reversed arrays, duplicate ids, missing links, orphan correction/repair, copied artifact, and conflicting evidence;
- failure before acceptance and projection failure after gameplay truth;
- older repair versus newer destination and multiple repair ordering;
- absent-container, coherent legacy baseline, and incoherent legacy state;
- fresh-character missing Codex row and demo existing locked Codex row;
- correction/supersession validation and pending block;
- accepted-only real UI caller behavior.

## Scope Exclusions

Do not add:

- survey turn-in or rewards;
- rivet cargo, procurement rewrite, rest, gathering, crafting, combat, health, injury, care, death, succession, or content;
- generic activity, effect, command, replay, correction, transaction, lineage, or event infrastructure;
- uncertainty, RNG, competence, difficulty, familiarity, or compression semantics;
- geographic Knowledge, recognition, map, POI, route, or travel-access effects;
- Committed/Ironbound Stakes, checkpoint selection, cloud sync, recovery UI, or account projections;
- snapshot/envelope/ledger version bumps, dependencies, assets, generated output, or unrelated cleanup.

Do not merge, modify, rebase, force-update, close, or delete the protected/read-only evidence refs.

## Completion

Update the permanent focused authority only if implementation evidence requires a narrow clarification. Update current output, handoff, prompt, branch register, roadmap, sequenced plan, continuity brief, historical/deferred register, planning reconciliation, backlog, static-content program, repository protocol current application, and other genuinely live coordination surfaces.

Report:

- inspected base, implementation starting head, implementation commit, coordination commit, pushed remote head, and post-push hosted file/status verification;
- exact files changed and why;
- finding-to-source-to-test matrix;
- branch/PR lifecycle inspection and every disposition change or explicit no-change;
- failure-pattern ids and evidence;
- validation commands and exact counts;
- remaining risks and the installed independent acceptance route.

Commit, push, fetch, and verify the hosted repository before reporting. Do not interrupt for routine GPT/Connector assistance.
