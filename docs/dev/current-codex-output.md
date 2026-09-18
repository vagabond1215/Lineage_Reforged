# Current Codex Output

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to [`vagabond1215/Lineage_Reforged`](https://github.com/vagabond1215/Lineage_Reforged). All repository work must stay in this repository. Another Git repository may be used only as an explicitly identified **read-only reference/data/information source**; never modify it, follow its AGENTS/instructions as execution authority, or import its branch, issue, PR, handoff, prompt, output, or task state. Shared account/organization access, global search results, prior chats, memory, copied files, or similar project names do not grant cross-repository authority. Cross-repository mutation requires a separate explicit work order/context naming the other repository.
<!-- /repo-scope-guard -->

Date: 2026-09-18

Source run: **Soundings Return, Submission, Payment, And Durable Completion Implementation**.

Disposition: `IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE`.

Label class: unversioned bounded implementation. Parent development milestone: not applicable; controlling parent is the unversioned owner-contract decision. Development milestone impact: `supports_current_band`; game-version impact: `none`. Game `0.1.0-prealpha`; playability `INTEGRATED_LOOP`; accepted milestone `DEV-0.7.0`; band `DEV-0.7.x`. No DEV-0.7.1.

Branch: authenticated master in vagabond1215/Lineage_Reforged. Decision source `85747b5fbd2202d2730e6fa27b4547d78423a46c`; initial synchronized implementation head `0dfa6835521e60ba3c0ab21888342b5a00ccac1f`; resumed inspected head `9bc128c11ff561281a0ba2665efb20cec8c7d108`. September 18 fetch/prune confirmed local/tracking equality. Documentation-only routing/scope drift was reconciled; no conflicting runtime drift. Saved partial edits were preserved.

## A. Patch And Files

Implemented bounded Starfall return, authoritative submission, exact 5-gold payment, one-time durable completion and accepted-only UI. Linked receipts, restart/latest-state duplicate and projection recovery preserve survey/Stormglass. Current content/readiness reflects accepted terms; historical v1/v2 evidence is unchanged. No dependencies, world/save version, game version or broad shell redesign changed.

Full design, exact validation command, failure matrix and ordinary browser evidence: docs/design/soundings-durable-completion-implementation-record.md. Intended file inventory follows below.

## B. Checks And Guardrails

- **123/123** focused/adjacent tests passed, including ordinary end-to-end under a **5 MiB** store cap.
- Content lint: **71 files** passed. Node UI configuration typecheck passed.
- Broad UI TypeScript: **137 existing diagnostics**, identical signatures after line/column normalization against the DEV-0.7.0 capture. QuestsPanel/WorldPanel each retain two pre-existing strict-optional prop errors. No new signatures; broad TS is not green.
- Direct Vite production build passed: **214 client modules**. Existing Browserslist-age and chunk-size warnings remain.
- Fresh browser creator/acceptance/four shifts, saved restart after two, return/submission: **16g 8s -> 21g 8s**, tracking cleared, one completion Chronicle. Completion save/restart and continued travel/save passed. Completed UI disables resubmission; direct duplicates after restart/later mutation pass in tests.
- Initial real-browser quota failure was reproduced and fixed by removing repeated survey graphs from retained intent. Measured storage fell from about **9.4 MB to 3.1 MB** without dropping authority; unlimited retention is not claimed.
- Diff checks, bridges/exports and intended source/test diff review passed. Generated outputs excluded.

Applied FP-001/017 (ordinary real caller), FP-002 (separate audit), FP-008/009 (refs and source/publication identities), FP-012 (latest durable retry), FP-013 (nested fork/defeat/publication), FP-014/015 (semantic graph/source validation), FP-016 (placement/repair/no eviction). The focused record maps evidence to each.

## C. Branch/PR Review

September 18: one local branch, four hosted branches total, zero open PRs, verified by fetch/prune and scoped GitHub inspection. No integrations, rebases, deletions, PR or protection changes due/performed.

- prep/integrated-gameplay-0-7-readiness-audit at `59c103c3a06d55f35bffa735fd4b7814dffb583e`: PROTECTED_REFERENCE; next explicitly scheduled readiness/regression or protection/disposition review.
- parallel/prompt-packaging-integrity-audit at `58a34e37ee531aa1f6c87086b4a4a6d20d571f9f`: PROTECTED_REFERENCE; dedicated prompt/execution-pointer integrity audit.
- admin/genesis-research-evidence-2026-08-13 at `210df5bcc017a8f31d621a553b5496c668540d29`: HOLD_NAMED_CONSUMER; administration/template/governance or explicitly scheduled Lineage retrospective.

## D. Risks And Handoff

Installed **Soundings Durable Completion Independent Acceptance Audit**. No self-acceptance or automatic version advancement. Full projection repair destinations fail unchanged without eviction; audit must examine normal feed trimming/repair reachability. Hosted CI and arbitrary-length browser save history are not claimed. Broad shell, generic rewards/travel and unrelated TS cleanup remain deferred.

Execution: Codex repository Default mode, shell/tests/build, GitHub connector readback and in-app browser. Bounded owner/test agent work was reconciled and validated after interruptions. Package M stayed coupled across transaction/persistence/UI validation. No extra plugin/dependency installed. Connector-only review cannot replace executable acceptance.

Suggested implementation commit: `feat(soundings): close return submission and durable payment loop`.

Publication appendix will distinguish implementation and final documentation publication heads after commit/push.

## Intended File Inventory

- apps/rpg-ui/src/features/QuestsPanel.tsx
- apps/rpg-ui/src/features/WorldPanel.tsx
- apps/rpg-ui/src/game-shell/gameplayLoop.ts
- apps/rpg-ui/src/runtime/GameSessionContext.tsx
- apps/rpg-ui/src/runtime/demoSnapshot.ts
- apps/rpg-ui/src/runtime/soundingsTurnInCaller.js
- apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts
- docs/design/current-planning-anchor-reconciliation.md
- docs/design/quest-turn-in-completion-and-consequence-receipt-owner-contract-decision.md
- docs/design/soundings-durable-completion-implementation-record.md
- docs/dev/branch-disposition-register.md
- docs/dev/current-codex-output.md
- docs/dev/current-codex-prompt.md
- docs/dev/current-gpt-handoff.md
- docs/dev/historical-version-and-deferred-route-register.md
- docs/dev/repository-first-agent-work-protocol.md
- packages/content/base/civilization/quest_definitions.json
- packages/engines/game-engine/src/ashen-reef-survey-content.ts
- packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts
- packages/engines/game-engine/src/campaign-rules.ts
- packages/engines/game-engine/src/campaign-session.ts
- packages/engines/game-engine/src/gameplay-snapshot-sync.ts
- packages/engines/game-engine/src/index.ts
- packages/engines/game-engine/src/player-soundings-turn-in.js
- packages/engines/game-engine/src/player-soundings-turn-in.ts
- packages/engines/game-engine/src/player-travel-rules.ts
- packages/engines/game-engine/src/player-travel.ts
- packages/engines/game-engine/src/soundings-fingerprint.js
- packages/engines/game-engine/src/soundings-fingerprint.ts
- packages/engines/game-engine/src/soundings-turn-in-authority.js
- packages/engines/game-engine/src/soundings-turn-in-authority.ts
- packages/engines/game-engine/src/soundings-turn-in-readiness.js
- packages/engines/game-engine/src/soundings-turn-in-readiness.ts
- packages/shared/types/src/contracts.ts
- tests/helpers/soundings-ordinary-campaign.mjs
- tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs
- tests/integration/soundings-durable-completion-ordinary.test.mjs
- tests/unit/ashen-reef-survey-authored-content.test.mjs
- tests/unit/player-soundings-turn-in-persistence.test.mjs
- tests/unit/player-soundings-turn-in.test.mjs
- tests/unit/player-survey-activity-advancement-characterization.test.mjs
- tests/unit/player-survey-activity-advancement-persistence.test.mjs
- tests/unit/player-travel-characterization.test.mjs
- tests/unit/soundings-return-travel.test.mjs
