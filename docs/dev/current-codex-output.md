# Current Codex Output

Date: 2026-08-13

Source run: `Version 0.6.10.4 - Ashen Reef Survey Progression Coherence And Projection Placement Repair`

Parent version: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Label class: support suffix

Milestone impact: `supports_current_band`

Branch/status assumption: clean synchronized `master == origin/master` at start `2c760eedd41e221fdfbd4caba9611cf0156af0b8`; direct-to-`master` implementation workflow authorized by the active prompt

Implementation commit: `07c57392c8078927e4f9e12efe18d8d89bb1fc70`

Final coordination commit: the exact pushed follow-up HEAD is reported in the completion response because a commit cannot contain its own identity

Disposition: `IMPLEMENTED_PENDING_REAUDIT`

Next route: `Version 0.6.10.5 - Ashen Reef Survey Progression And Projection Post-Repair Acceptance Audit`

## A. Files Changed

Production and focused tests:

- `packages/engines/game-engine/src/campaign-rules.ts`
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts`
- `packages/shared/types/src/contracts.ts`
- `tests/unit/gameplay-loop-skill-gating.test.mjs`
- `tests/unit/player-survey-activity-advancement-command.test.mjs`
- `tests/unit/player-survey-activity-advancement-persistence.test.mjs`

Repository coordination:

- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/design/ashen-reef-survey-advancement-authority-acceptance-audit.md`
- `docs/dev/repository-first-agent-work-protocol.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/design/static-content-expansion-program.md`
- `docs/dev/branch-disposition-register.md`

No UI/context/gameplay-loop production path, JavaScript pass-through mirror, index, save format, migration, Normal defeat/recovery owner, content, canon, asset, dependency, generic projection system, branch, pull request, or evidence ref changed.

## B. Patch Summary

`AR-007` is closed at the shared survey semantic gate. Retained progression still passes its existing deep structural and arithmetic checks, then must equal the authoritative `resolvePlayerEchoProgression(...)` result derived from the retained attributes, complete skills, and progression inputs. Forged but internally coherent Echo, contribution, diversity, or level facts now fail before durable duplicate resolution, repair, publication, or mutation. Legitimate owner-derived variants and exact clean retries remain accepted/duplicate as appropriate.

`AR-008` is closed with explicit persisted placement authority. Notification and Chronicle inspection now validates exact content and exact order among survey-known rows. Repair sorts those known rows by `(appliedTick desc, resultId asc)` and scatters them only into their existing known-row slots, preserving every opaque row's object, bytes, and index. Exact misplaced rows record `misordered` / `reordered`; the pairing is deep-validated, nonterminal for later drift, invalid for events, restart-safe, and idempotent. Missing-at-full-with-opaque retention expiry, pending-only event repair, correction gates, caps, and initial accepted projection behavior remain unchanged.

The tracked `.js` counterparts remain intentionally unchanged because the two game-engine mirrors re-export their TypeScript source and `contracts.js` is type-erased. The adjacent skill-gating fixture now recomputes owner-derived progression after deliberate skill mutation; no gameplay balance changed.

This implementation does not accept parent `0.6.10`, issue a representative-loop classification, or advance the project to `0.7.0`. It installs a separate production-read-only re-audit.

## C. Tests And Checks Run

- fresh pre-repair probes reproduced both blockers: owner-incoherent progression validated and controlled durable retry identity; reversed byte-correct notification/Chronicle rows were undiscoverable and survived restart;
- post-repair adversarial selection: `6/6` passed for owner-derived progression, different/equal-tick placement, repair-history ordinals, and version-7 quarantine/restart repair;
- focused survey characterization/command/persistence: `41/41` passed;
- prescribed focused and adjacent runtime/caller/persistence matrix: `175/175` passed; companion `achievements.test.mjs`: `8/8`, for `183/183` total;
- additional account/run/legacy/deterministic coverage: `72/72` passed;
- Knowledge evidence matrix: `132/132` passed; an additional all-knowledge run passed `764/764`;
- clock/schema matrix: `107/107` passed;
- RPG UI Vite `5.4.21` production build: passed with `212` transformed modules and only the registered large-chunk advisory; temporary output removed;
- bounded application TypeScript: exit `2`, exact registered baseline `137` diagnostics; the repaired engine/contracts surface introduced no diagnostic and only the same two pre-existing `ActivityPanel` TS2375 findings appeared in the relevant caller surface;
- `npm run build` stopped at that registered TypeScript baseline before Vite, while the controlling direct Vite production build passed;
- one optional exploratory legacy-ledger source-guard grouping was `40/41` because its pre-existing App-copy regex expects `Lineage Source Unavailable`; the required matrices and changed surfaces do not use or alter that stale guard;
- `git diff --check`, staged diff inspection, source/mirror guards, raw serialization, version-7 publication/readback/restart, correction gating, cap/opaque preservation, and final temporary-artifact hygiene passed.

## D. Applicable Failure Patterns, Risks, And Follow-Up

- `FP-001`: executable caller/source guards remained green; caller production code was unchanged.
- `FP-002`: green implementation evidence installs, but does not replace, independent `0.6.10.5` acceptance.
- `FP-003`: placement drift is now discoverable, repairable, persisted, restart-safe, and completion-idempotent.
- `FP-005`: technical-retry request identity and accepted-only state application remain unchanged and covered.
- `FP-006`: repair preserves opaque indices/bytes and does not evict retained truth.
- `FP-008`: all Connector and protected refs remained read-only evidence.
- `FP-009`: start, implementation, coordination, remote, and hosted identities are reported separately.
- `FP-011`: semantic progression validation runs before duplicate resolution or mutation.
- `FP-012`: well-shaped but owner-incoherent derived authority now fails closed.
- `FP-013`: raw and version-7 persistence/restart retain valid survey and repair authority; forged authority cannot replace the valid published head.
- `FP-014`: caller-recomputed canonical strings cannot authorize false owner semantics.
- `FP-015`: authoritative progression is recomputed from retained owner inputs.
- `FP-016`: exact row bytes no longer bypass placement inspection.

No new generalized failure pattern was warranted; the active repair directly closes `FP-015` and `FP-016` while preserving the others.

Risk: parent `0.6.10` remains unaccepted until production-read-only `0.6.10.5` independently reproduces both repaired boundaries and the retained contract matrix. Ordinary creator-to-quest-to-travel-to-survey reachability remains outside this repair and must not be inferred from injected fixtures. The broad TypeScript baseline and one unrelated stale exploratory source guard remain repository limitations, not repaired claims.

## Branch And Pull-Request Lifecycle Review

Fresh orientation fetched/pruned and inspected one local branch, 36 non-default remote branches, both open pull requests, all four exact Connector evidence refs, and the protected readiness ref. PR #2 remains open non-draft at `e78dc645cfb658685be12f45f46d34b7c0da1119`; PR #3 remains open draft at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Both remain `SUPERSEDED_PRESERVE_EVIDENCE`. The four Connector refs remain `CANDIDATE_INTEGRATION` only for their broader named consumers; the readiness ref remains `PROTECTED_REFERENCE`.

No disposition changed and no merge, cherry-pick, rebase, force update, PR mutation, closure, deletion, or evidence-ref mutation was due. Reinspect during `0.6.10.5` orientation or an earlier explicit lifecycle trigger.

Suggested coordination commit message: `docs(survey): install progression and projection re-audit`

Next recommended version/run: `Version 0.6.10.5 - Ashen Reef Survey Progression And Projection Post-Repair Acceptance Audit`
