# Connector Preflight — Soundings Durable Completion Independent Acceptance

Date: 2026-09-20

Status: `CONNECTOR_PREFLIGHT_COMPLETE_EXECUTABLE_DISPOSITION_RESERVED_TO_CODEX`

Repository: `vagabond1215/Lineage_Reforged` only.

Hosted source head inspected: `fb8e5df153bc744c06510493be28d129492697af`.

Tested implementation source: `af0954c294d222bc1f8667266e4549b8619d5484`.

Active route: **Soundings Durable Completion Independent Acceptance Audit**.

This packet is Connector evidence and orientation only. It does not execute tests, builds, browser probes, local worktree checks, or the independent acceptance disposition.

## 1. Head And Drift Lock

Hosted `master` resolved to `fb8e5df153bc744c06510493be28d129492697af` during this pass.

Comparison from tested implementation `af0954c294d222bc1f8667266e4549b8619d5484` to hosted head shows exactly one later commit. Its changed paths are documentation only:

- `docs/design/soundings-durable-completion-implementation-record.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`.

No production, schema, content, test, persistence, dependency, asset, or runtime file changed after the tested implementation commit according to the hosted comparison.

Codex must still fetch/prune locally and inspect any delta from this packet head before relying on it.

## 2. Current Authority

Current output records:

- implementation disposition: `IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE`;
- Game `0.1.0-prealpha`;
- playability `INTEGRATED_LOOP`;
- accepted milestone `DEV-0.7.0`;
- current development band `DEV-0.7.x`;
- no `DEV-0.7.1` allocation;
- no game-version change.

Current prompt is the independent audit and reserves the final result to exactly one of:

- `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED`;
- `REPAIR_REQUIRED`.

Do not infer acceptance from this preflight.

## 3. Hosted Branch And PR Snapshot

Hosted branch inventory at this pass:

- `master` → `fb8e5df153bc744c06510493be28d129492697af`;
- `prep/integrated-gameplay-0-7-readiness-audit` → `59c103c3a06d55f35bffa735fd4b7814dffb583e`;
- `parallel/prompt-packaging-integrity-audit` → `58a34e37ee531aa1f6c87086b4a4a6d20d571f9f`;
- `admin/genesis-research-evidence-2026-08-13` → `210df5bcc017a8f31d621a553b5496c668540d29`.

Open pull requests: **0**.

Existing dispositions remain controlling until fresh local/hosted inspection proves otherwise:

- readiness ref: protected reference;
- prompt-integrity ref: protected reference;
- administration evidence: held for named consumer.

No branch mutation is indicated by this preflight.

## 4. Material Implementation Surface

The implementation delta from the pre-implementation coordination head includes the following gameplay-critical paths.

### UI / caller

- `apps/rpg-ui/src/features/QuestsPanel.tsx`
- `apps/rpg-ui/src/features/WorldPanel.tsx`
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`
- `apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts`
- `apps/rpg-ui/src/runtime/soundingsTurnInCaller.js`
- `apps/rpg-ui/src/runtime/demoSnapshot.ts`

### Game-engine ownership

- `packages/engines/game-engine/src/player-soundings-turn-in.ts`
- `packages/engines/game-engine/src/player-soundings-turn-in.js`
- `packages/engines/game-engine/src/soundings-turn-in-authority.ts`
- `packages/engines/game-engine/src/soundings-turn-in-authority.js`
- `packages/engines/game-engine/src/soundings-turn-in-readiness.ts`
- `packages/engines/game-engine/src/soundings-turn-in-readiness.js`
- `packages/engines/game-engine/src/soundings-fingerprint.ts`
- `packages/engines/game-engine/src/soundings-fingerprint.js`
- `packages/engines/game-engine/src/player-travel-rules.ts`
- `packages/engines/game-engine/src/player-travel.ts`
- `packages/engines/game-engine/src/campaign-session.ts`
- `packages/engines/game-engine/src/campaign-rules.ts`
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`
- `packages/engines/game-engine/src/index.ts`

### Shared contract/content

- `packages/shared/types/src/contracts.ts`
- `packages/content/base/civilization/quest_definitions.json`
- `packages/engines/game-engine/src/ashen-reef-survey-content.ts`
- `packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts`

### Focused tests/helpers

- `tests/helpers/soundings-ordinary-campaign.mjs`
- `tests/integration/soundings-durable-completion-ordinary.test.mjs`
- `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`
- `tests/unit/player-soundings-turn-in.test.mjs`
- `tests/unit/player-soundings-turn-in-persistence.test.mjs`
- `tests/unit/soundings-return-travel.test.mjs`
- adjacent survey/travel/content/persistence tests named by the implementation record.

## 5. Ownership Map

### Return travel

`player-travel-rules.ts` resolves the special destination `settlement.starfall_port` only when the origin is `location.ashen_reef` and the Soundings route context is coherent. The return profile is derived from the existing Ashen maritime profile rather than creating a universal Starfall travel cost.

`player-travel.ts` remains the movement, clock, body/resource, location, event and synchronization owner.

### Turn-in readiness

`soundings-turn-in-readiness.ts` requires:

- a semantically valid target campaign snapshot;
- exactly one Soundings journal row;
- active and not already consumed lifecycle;
- no required pending survey correction/projection repair;
- exactly four survey requests, four occurrences, four results and 48 survey consequence receipts;
- ordered stages `sector_1,sector_2,sector_3,ruins_confirmation`;
- ruins confirmed;
- Starfall Port as both resolved travel location and player settlement context.

### Turn-in transaction

`player-soundings-turn-in.ts` owns preparation/execution of `player.soundings.turn_in`.

The accepted transaction:

- persists one request, occurrence and result;
- creates seven typed receipts;
- completes Soundings;
- clears Soundings tracking when applicable;
- credits exactly 5 gold;
- removes the survey operation;
- changes current activity;
- adds one Chronicle and one notification projection;
- synchronizes gameplay state;
- commits through the prepared campaign mutation boundary.

### Durable authority

`soundings-turn-in-authority.ts` owns:

- canonical recursive key-ordered intent serialization;
- stable Soundings command/occurrence/result/receipt/projection identities;
- SHA-256 fingerprints;
- reconstruction/validation of the retained pre-turn-in source;
- exact seven-receipt validation;
- completion-projection validation and repair.

The retained source omits the already-owned `ashenReefSurvey` graph and fingerprints the survey separately to avoid duplicating the large graph in the turn-in intent.

### Campaign admission

`campaign-session.ts` reuses the prepared survey mutation seam for Soundings so accepted continuity is known before immutable turn-in evidence is authored. It checks candidate Soundings evidence and exact five-gold post-state before commit.

Generic later `admitCampaignMutation(...)` may preserve valid Soundings authority but may not rewrite it.

### Real caller / UI

`soundingsTurnInCaller.ts` prepares/caches a request command, submits the engine result, and exposes `acceptedState` only when the engine result is accepted.

`GameSessionContext.tsx` applies the returned snapshot/control only when `acceptedState` exists.

`QuestsPanel.tsx` routes Soundings through `submitSoundingsTurnIn(...)`; the legacy `gameplayLoop.turnInQuest(...)` Soundings branch is blocked and no longer pays the old Saltmere rewards.

## 6. Required Durable Identity Facts

Current accepted implementation shape expects:

- one Soundings turn-in request;
- one occurrence;
- one result;
- exactly seven consequence receipts:
  1. `quest_completion`;
  2. `currency_credit`;
  3. `tracking_clear`;
  4. `operation_close`;
  5. `activity_transition`;
  6. `chronicle_projection`;
  7. `notification_projection`.

The payment result is exactly `{ gold: 5, silver: 0 }`.

Survey authority remains separately retained at the accepted representative shape: four requests, four occurrences, four results and 48 survey receipts.

## 7. Implementation-Reported Validation Baselines

These are implementation-run claims to reproduce/inspect independently, not Connector-executed results:

- combined focused/adjacent Node tests: **123/123**;
- content lint: **71 files**;
- Node UI configuration typecheck: pass;
- broad UI TypeScript: **137 known diagnostics**, no new normalized signatures claimed;
- direct Vite production build: **214 client modules**;
- ordinary browser flow: starting wallet `16g 8s 0c`, completion wallet `21g 8s 0c`, one completion Chronicle, save/restart and continued play;
- initial browser persistence attempt exposed about 9.4 MB usage from repeated graphs;
- repaired tested sequence measured about 3.1 MB;
- ordinary integration now enforces a **5 MiB** store cap.

The audit should reproduce the executable evidence required by the current prompt rather than trusting these counts.

## 8. Known Non-Gates / Limits

Do not convert these into unrelated repair work during acceptance:

- broad UI TypeScript is already non-green at the known 137-diagnostic baseline;
- QuestsPanel/WorldPanel retain pre-existing strict-optional diagnostics according to implementation evidence;
- stale Browserslist and bundle-size warnings are existing build warnings;
- arbitrary/unlimited campaign-history storage capacity is not claimed;
- broad shell redesign is excluded;
- generic reward, wallet, travel or quest frameworks are excluded;
- no `worldVersion` or `GAME_VERSION` migration belongs to this audit.

## 9. Independent Audit Hot Paths

Codex should spend independent reasoning/execution primarily on:

1. exact real caller/admission path rather than helper-only success;
2. deep authority validation before duplicate classification;
3. canonical-intent/request conflict behavior;
4. source-snapshot and survey fingerprint binding;
5. first non-head submission and continuity fork preservation;
6. defeat/recovery and later mutation preservation;
7. projection loss, misplacement, full-feed repair, restart and no-payment-replay behavior;
8. route specificity and unsupported-origin behavior;
9. storage capacity in a real browser/save path;
10. excluded consequence owners remaining unchanged;
11. current content/UI saying 5 gold while retained historical v1/v2 evidence remains stable.

## 10. Codex Delta-Verification Rule

If local synchronized `HEAD` equals `fb8e5df153bc744c06510493be28d129492697af`, Codex should treat this packet as orientation aid and avoid repeating broad repository archaeology.

It must still independently verify:

- repository identity, upstream and clean/understood worktree;
- current prompt and controlling focused authorities;
- the material source files named above;
- all executable/adversarial evidence required by the active audit;
- live branch/PR state if it changed after this packet;
- final disposition.

If local head differs, inspect the complete delta from this packet head before using the packet.

## 11. Stop Boundary

Connector preflight stops short of:

- running local tests/builds/typechecks/browser probes;
- changing production/test/schema/content files;
- deciding `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED` or `REPAIR_REQUIRED`.

Those remain owned by the independent executable audit.
