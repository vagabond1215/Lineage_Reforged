# Game 0.1.1-prealpha Publication Acceptance Decision

Date: 2026-09-28. Repository: `vagabond1215/Lineage_Reforged` only.

Decision: **GAME_VERSION_ACCEPTED**. Label: unversioned publication acceptance; parent not applicable; development milestone impact `none`; game-version impact accepted `0.1.1-prealpha`. Posture remains `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x`.

## Exact authority and gate

Inspected clean synchronized source: `3d8f456d4595909098d9cbcc992e82577133b332`. Accepted gameplay build: `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`. Independent audit publication: `d63577396baad2b4eae90280e53c6c043d419398`. The version-bearing publication commit is recorded in current output/handoff after creation; its only non-documentation change is GAME_VERSION.

| Policy requirement | Evidence and disposition |
| --- | --- |
| 1. Proposed version/stage | `0.1.1-prealpha`, First Playable / Early Pre-Alpha patch. |
| 2. Previous version | `0.1.0-prealpha`; Soundings previously ended active/unturned-in. |
| 3. Player-visible delta | Four-tick no-fare return, immediate exact +5g on submission, completed history and cleared tracking, persistent completion without replay, later travel/save. |
| 4. Ordinary path | Reuse post-F3 independent audit and `docs/dev/evidence/soundings-post-f3-acceptance-2026-09-25/browser.md`: ordinary creator, acceptance, four shifts with save/restart, Starfall return tick 12 to 16, 16g8s to 21g8s on submission, reload/Continue, later travel/save. No injected prerequisites. |
| 5. Compatibility | This publication changes only canonical game-version metadata and documentation. No save/world/data/schema/package version or migration changes; accepted gameplay and compatibility behavior remain byte-identical. |
| 6. Checks | Complete Git delta from accepted runtime is docs/evidence only before publication. Reuse 183/183 tests, 71-file lint, Node configuration typecheck, app-local Vite build and independent A/B1/B2/C/D evidence. Broad UI typecheck remains non-green at 137 unchanged diagnostics. No fresh executable run claimed. |
| 7. Limits | Explicit limits below retained; this is a bounded noncombat patch, not the vertical-slice gate. |
| 8. Exact build | Immutable accepted gameplay SHA above; version-bearing publication SHA recorded separately, with source equality verified excluding docs and GAME_VERSION. |
| 9. Distribution | Local development build only. No hosted deployment, package release, deployment revision or distribution acceptance claim. |
| 10. Decision | GAME_VERSION_ACCEPTED: material ordinary player quest closure meets policy patch criterion. |
| 11. Mutation | Root GAME_VERSION becomes `0.1.1-prealpha` only following this gate; no development/posture promotion. |

Authority: `docs/dev/game-version-roadmap-and-acceptance-policy.md`, `docs/design/soundings-playable-build-version-calibration-decision.md`, and `docs/design/soundings-durable-completion-post-f3-independent-acceptance-audit.md`. Audit evidence reuse is explicitly required by the installed prompt when production is unchanged. Git comparison excludes only docs to establish that premise before publication.

## Known limits and exclusions

Measured storage peak 5,076,206 / 5,242,880 UTF-16 bytes leaves only 166,674 bytes; this finite path does not establish unlimited campaign retention. Broad UI has 137 unchanged diagnostics. Ordinary Starfall harbor does not provide the separately fixture-tested safe-settlement defeat/recovery path. Daily Revenue, Window Standards and Unknown Watch presentation debt remains. Comprehensive accessibility, hosted/deployment acceptance, broad combat/balance, inventory/crafting/NPC breadth and the 0.2.0 vertical-slice gate are not accepted here. These limits do not invalidate the demonstrated completion/save/restart/continuation path and are not silently repaired.

## Verification guardrails and branches

FP-008/009: exact runtime/source/publication identities and fresh branch/PR inventory. FP-001/017 and FP-003 through FP-006: retained ordinary-caller, restart, retry and recovery-boundary evidence. FP-002/010 through FP-016: separate independent audit and explicit F1/F2/F3 closure with provenance, prefix/suffix, projection and no-newer-truth-eviction evidence; no new production self-acceptance. Detailed case evidence remains in the focused audit.

One local branch, four hosted branches, zero open PRs. Readiness `59c103c3a06d55f35bffa735fd4b7814dffb583e` and prompt-integrity `58a34e37ee531aa1f6c87086b4a4a6d20d571f9f` remain PROTECTED_REFERENCE; administration `210df5bcc017a8f31d621a553b5496c668540d29` remains HOLD_NAMED_CONSUMER. Merge bases, unique commits and paths match the branch register. Source divergence 418/2, 365/1, 196/1 respectively. No trigger consumed or branch/PR action due/performed.

Next: **Post-Soundings Playability Gap Prioritization Decision**, documentation only, with no preselected gameplay implementation or version increment.
