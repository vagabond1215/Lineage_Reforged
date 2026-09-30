# DEV-0.7.1 Slice G5 — Inert Clean-Epoch Slot Inventory And Verified First-Head Load

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-30. Internal implementation slice of planned current-band primary `DEV-0.7.1`; parent, Game version and live activation remain held. Read `docs/design/clean-epoch-async-caller-ownership-and-activation-package-decision.md` as the controlling package decision and `docs/design/development-only-clean-persistence-epoch-route-decision.md` as product policy.

## Pre-edit gate

Begin from synchronized `master`, note dirt, complete whole-repository orientation and fresh branch/PR review. Read the complete current prompt/handoff/output, historical/deferred register, planning reconciliation, repository-first protocol, prompt/tool and resource policies, failure-pattern and branch registers, G1-G4 focused records, the two decisions above and relevant save/Soundings tests. Record exact inspected head, branch status, run and Game identities, exclusions and acceptance checks before editing. Preserve unrelated work.

## Implementation package

Add the smallest account-scoped asynchronous clean-epoch slot inventory and verified **first-head** load surface to `apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts`, with only required read support in `campaignIndexedDbStore.ts`. Use the existing account, save-envelope, metadata, session-control and Soundings validators; do not call localStorage or open the old `lineage.campaigns` staging database. The result must distinguish an empty slot from malformed/incomplete authority, pending first-publication consumer recovery, closed/terminal head, descendant head not yet supported by the first-campaign recovery contract, and unavailable/blocked/read-failed IndexedDB. Validate exact account/slot/campaign/head/control/artifact identities and retained first Soundings witness/artifact before returning a playable first-head snapshot/session control. `readRecovery` currently compares the first recovery to the current head; do not generalize it by assumption or silently mark a descendant playable. Specify whether accepted pending recovery is a blocked load or a recoverable typed result; do not mark it playable without completion. Make reads side-effect free and preserve full snapshot world/lineage/Chronicle/nested history. Do not delete, prune, migrate, repair, synthesize or silently replace authority on read.

Use bounded native browser QA with synthetic database names/fixtures to prove multiple accounts and slots, empty versus corrupt, pending versus completed first-campaign recovery, closed head, descendant unsupported/blocked classification, retained Soundings provenance, restart, unavailable/blocked database, read failure and no mutation. Include a non-head retained artifact preservation assertion; exposing historical load is reserved for the descendant/history package. Run the adjacent campaign/Soundings tests, Node UI typecheck and app-local Vite build. Report broad UI TypeScript diagnostics as baseline versus changed-source diagnostics if run. Apply FP-001/002/003/004/005/006/011/012/013/014/015 and FP-008/009 as relevant, with exact evidence.

## Exclusions and handoff

Do not import the new owner into `App.tsx`, launcher/auth, lifecycle or live `saveManager`; do not activate, deploy, reset browser data, change legacy migration/copy/canonical stores, add dependencies, implement descendant publication/general consumers, account reset/delete, backup/restore, combat or Game version. Preserve the sole-user clean reset policy and all post-epoch durability requirements. If a read contract cannot safely classify a state, fail closed and record the bounded next prerequisite rather than inventing a fallback.

Update one focused G5 record, current output/handoff, historical/deferred route, planning reconciliation, branch register and next installed prompt from actual results. State reused versus fresh evidence, branches/PRs inspected and retained review triggers, unresolved long-run capacity and activation gates. Commit, push, fetch and read back exact hosted head. No browser user-data or hosted deployment change.
