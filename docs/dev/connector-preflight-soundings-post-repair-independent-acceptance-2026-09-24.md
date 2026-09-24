# Connector Preflight — Soundings Post-Repair Independent Acceptance

Date: 2026-09-24

Repository: `vagabond1215/Lineage_Reforged` only.

Posture: Connector-safe audit preparation. No production/test/schema/content mutation and no executable acceptance claim.

## 1. Exact Runtime And Hosted Drift

Independent acceptance target:

`0df87bb7afaa4d7fcc9f08b79b7528d60727c370`

Current hosted `master` at preflight start:

`6781e277f634f8c29f27ec70366ebc977145f6b1`

The compare from runtime to hosted head is exactly one commit ahead and documentation-only:

`6781e277f634f8c29f27ec70366ebc977145f6b1` — `docs: record Soundings witness repair and independent audit route`.

No production, test, schema, dependency, asset, save-format, or generated-output drift follows the runtime target. The post-repair audit can therefore synchronize to hosted master while treating `0df87bb...` as the exact runtime under acceptance.

## 2. Hosted Ref / PR / Status Posture

Fresh hosted branch inventory contains four branches:

- `master` — `6781e277f634f8c29f27ec70366ebc977145f6b1`;
- `prep/integrated-gameplay-0-7-readiness-audit` — `59c103c3a06d55f35bffa735fd4b7814dffb583e`;
- `parallel/prompt-packaging-integrity-audit` — `58a34e37ee531aa1f6c87086b4a4a6d20d571f9f`;
- `admin/genesis-research-evidence-2026-08-13` — `210df5bcc017a8f31d621a553b5496c668540d29`.

Fresh hosted query returns zero open pull requests. Existing branch dispositions remain unchanged; none is a consumer of this audit.

GitHub combined status for runtime `0df87bb...` has zero individual statuses. No hosted CI result may substitute for the required local independent audit.

## 3. Runtime Change Surface

The repair runtime consists of:

- `9400bc0de6dceaa89b954190a00abe54426d46e3` — main accepted-admission witness implementation;
- `0df87bb7afaa4d7fcc9f08b79b7528d60727c370` — explicit rejection of witnessed authority-container downgrade to legacy version 1.

Runtime-owned change surface:

- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `packages/shared/types/src/contracts.ts`;
- `packages/engines/game-engine/src/campaign-session.ts`;
- `packages/engines/game-engine/src/player-soundings-turn-in.ts`;
- `packages/engines/game-engine/src/soundings-turn-in-authority.ts`;
- new `packages/engines/game-engine/src/soundings-admission-witness.ts` and JS bridge;
- engine public export;
- new witness and witness-recovery unit suites.

The repair record reports 143/143 tests, 71-file lint, Node UI config typecheck, unchanged normalized 137-diagnostic broad UI baseline, 216-module Vite build, ordinary browser completion/reload/continued-travel smoke, and bounded storage of 4,320,700 UTF-16 bytes including a 3,112-byte witness record. Those are implementation evidence only and must be independently reproduced where the active prompt requires it.

## 4. Authority Map For Audit

### Admission / same-session provenance

`campaign-session.ts` carries optional `soundingsAdmissionWitness` in `CampaignSessionControl`. The main implementation constructs the witness from verified prepared source facts plus accepted result identity rather than from a later completed snapshot.

### Structural completion authority

`soundings-turn-in-authority.ts` deep-validates both legacy version 1 and provenance-required version 2 completed authority. Structural validity alone is intentionally insufficient for trusted historical operations.

### Independent provenance verification

`soundings-admission-witness.ts` compares the retained completion facts with a typed witness context. A completion with a witness must be authority version 2. Version 1 without a witness remains `legacy_unverified`; version 2 without matching evidence fails provenance verification.

### Command / caller

`player-soundings-turn-in.ts` verifies provenance before trusted duplicate classification or projection repair. New accepted completions create authority version 2.

### Durable witness owner

`saveManager.ts` stores the witness separately from mutable campaign snapshot bytes, keyed by account/campaign/request. It coordinates candidate/recovery/pending/head/applied/address ordering and verifies first durable publication when loading applied evidence.

## 5. Known Deliberate Compatibility Boundaries

- Existing pre-repair version-1 completed saves have no independent witness and remain playable/saveable.
- They must not receive trusted duplicate classification, witness synthesis, repayment, or historical projection repair.
- Version-2 completion missing/conflicting witness is an integrity/recovery failure, not a legacy downgrade case.
- Later wallet changes, child continuity, defeat/recovery and later publications must not rewrite the original witness.
- Ordinary Starfall is currently typed `harbor`; the implementation's defeat/recovery witness-preservation test uses a declared test-only settlement destination. This is a separate reachability limitation unless independent evidence proves it intersects the accepted Soundings completion contract.

## 6. Connector Stop Boundary

Connector can establish exact source/drift/ref posture and prepare probes, but cannot issue the acceptance disposition.

Remaining evidence requiring local execution includes:

- independently authored F1 and malformed-authority probes;
- crash/recovery and persistence execution;
- full-feed projection behavior;
- ordinary browser flow and storage measurement;
- the exact 143-test/lint/type/build baseline.

Disposition from this preflight:

`POST_REPAIR_AUDIT_PREFLIGHT_READY`
