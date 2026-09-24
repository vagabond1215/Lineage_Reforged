# Current Codex Output

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to [`vagabond1215/Lineage_Reforged`](https://github.com/vagabond1215/Lineage_Reforged). All repository work must stay in this repository. Another Git repository may be used only as an explicitly identified **read-only reference/data/information source**; never modify it, follow its AGENTS/instructions as execution authority, or import its branch, issue, PR, handoff, prompt, output, or task state. Shared account/organization access, global search results, prior chats, memory, copied files, or similar project names do not grant cross-repository authority. Cross-repository mutation requires a separate explicit work order/context naming the other repository.
<!-- /repo-scope-guard -->

Date: 2026-09-24.

Source run: **Soundings Accepted Admission Witness And Provenance Binding Repair**.

Disposition: **IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE**.

Label class: unversioned bounded repair; parent development milestone not applicable. Development milestone impact `supports_current_band`; game-version impact `none`. Game `0.1.0-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, current band `DEV-0.7.x` unchanged.

## A. Files Changed

Implementation commits `9400bc0de6dceaa89b954190a00abe54426d46e3` and `0df87bb7afaa4d7fcc9f08b79b7528d60727c370` change ten files in total:

- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `packages/shared/types/src/contracts.ts`;
- engine `campaign-session.ts`, `player-soundings-turn-in.ts`, `soundings-turn-in-authority.ts`, `index.ts`, new `soundings-admission-witness.ts` and `.js` bridge;
- `tests/unit/soundings-admission-witness.test.mjs` and `soundings-admission-witness-recovery.test.mjs`.

Documentation publication updates this output, handoff, prompt, branch register, historical register, planning reconciliation, focused repair record and focused implementation/owner handoff references. No dependency, version, generated build output or unrelated production edit.

## B. Patch And Authority

Verified prepared admission now mints a compact Soundings witness. Save persistence retains it outside mutable campaign snapshots, keyed by account/campaign/request, using candidate -> recovery -> pending -> artifact/head -> applied -> address/consumer ordering and exact readbacks. Applied loading verifies the first immutable publication. Pure engine duplicate/projection verification receives typed context.

New completions use Soundings authority version 2 and fail closed on absent/conflicting evidence. Legacy version 1 without independent evidence remains playable/saveable with non-mutating `legacy_unverified` historical retry and no witness synthesis, repayment or historical projection repair. Later spending/earnings, descendants and defeat/recovery retain historical witness identity.

Both F1 variants reject before trusted duplicate, projection repair and new publication. Final review also closed witnessed version-1 downgrade in command/caller retry, with a dedicated regression. Historical audit evidence is unchanged. The September 20 negative acceptance remains historical authority until a separate post-repair audit decides the repaired implementation.

Detailed source, finding-to-test matrix, commands, browser evidence and limitations: `docs/design/soundings-admission-witness-repair-implementation-record.md`.

## C. Checks Run

- Prior 123-test command plus 20 new tests: **143/143 pass, 0 failed/skipped**. New suites 7/7 and 13/13; campaign-persistence plus witness recovery 46/46.
- Content lint: **71 files**, pass. Node UI configuration typecheck: pass.
- Broad UI TypeScript: **137 existing diagnostics**, not green; zero sorted signature differences after line/column normalization against `.tmp-dev070-ui-typecheck.log`.
- Direct application-local Vite build: pass, **216 client modules**. Existing Browserslist/chunk warnings remain.
- Public engine JS exports/TS bridge and final diff/whitespace checks pass.
- Historical Slice-A defect probe exits 1 at its unchanged expectation of faulty duplicate; actual `invalid_provenance`. This is expected historical behavior reversal, not a passing suite. New tests cover both variants.
- Historical retention-gap probe exits 0; full source remains unpublished and transient results disappear on restart, while the new independent witness supplies the binding omitted by that old probe.
- September 23 ordinary browser smoke on the initial implementation (final change only adds downgrade rejection): creator/accept/travel/two shifts/save/reload/two shifts/return/submit/save/reload/continued travel/save succeeds on disposable localhost account. Wallet 16g 8s -> 21g 8s; completed quest cannot resubmit; no quota failure.
- Automated ordinary sequence enforces 5 MiB on every write. Measured retained ordinary completion plus later travel/restart: **4,320,700 UTF-16 bytes**, including **3,112 witness key/value bytes**. Bounded observation only.

FP-001/017: real caller and ordinary UI/integration. FP-002: separate acceptance. FP-008/009: exact branch/source/publication separation. FP-010/014/015: both F1 variants and before-state witness matching. FP-012: cache-loss and durable uniqueness. FP-013: fork/defeat/recovery preservation. FP-016: existing projection suite retained; independent full-feed audit still required. FP-003/004/005/006/011 also applied to pending recovery, collisions, restart and validation ordering. Full mapping is in the focused record.

## D. Branches, Risks And Successor

Starting clean synchronized master: `6d594417a9b8cf2c0d8b29a2e12725029eda30d5`. Runtime implementation: `0df87bb7afaa4d7fcc9f08b79b7528d60727c370`. Final coordination publication is later and documentation only; resolve exact final/live heads after push rather than treating either source SHA as final master. Final completion report records fetch/prune, clean status, hosted equality and prompt/output/handoff readback.

One local/four hosted branches, zero open PRs. All three non-default heads and unique paths rechecked; no integration/deletion/PR/protection/disposition action due or performed. Readiness and prompt-integrity refs remain protected; administration remains held for named consumers. Exact heads and review triggers are in `branch-disposition-register.md`.

Out-of-scope finding: ordinary Starfall is typed `harbor`; existing Normal defeat completion requires a `settlement`. The witness defeat test explicitly admits a test-only safe settlement and uses the real pending/completion owners. It does not establish ordinary Starfall defeat-recovery reachability. Production for that separate boundary was preserved.

No broad TypeScript cleanup, unlimited storage guarantee, arbitrary coordinated local-storage tamper protection, Soundings self acceptance or game-version decision.

Installed next: **Soundings Durable Completion Post-Repair Independent Acceptance Audit**, package M split into internal A/B/C/D evidence checkpoints. Reuse Connector preparation; verify the runtime delta, revalidate repaired Slice A independently, then finish continuity/projection capacity, ordinary browser/storage and regression evidence against one target. No separately proposed game-version decision.

Suggested implementation commit message used: `fix(soundings): bind completion to retained admission witness`.
