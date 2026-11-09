# Historical UI PRs #5–#9 — connector preservation and retirement preflight (2026-11-09)

**Status: `UI_BATCH_1_PARTIAL_READY; EXACT_TEXT_RECORDS_PRESERVED; BINARY_EVIDENCE_AND_ACCEPTANCE_TRANSFERS_HELD`.**
Repository: `vagabond1215/Lineage_Reforged`. Unversioned, historical evidence/coordination only. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; `HOLD_SELECTED_ATOMIC_ACTIVATION` unchanged.

This document is an **additive, connector-verified orientation artifact**, not an installed Codex prompt, a branch disposition-register replacement, accepted gameplay design, a selected-client acceptance result, or authority to close/delete any PR. Read `AGENTS.md`, the current prompt/handoff/output, `docs/dev/branch-lifecycle-and-integration-policy.md`, and `docs/dev/ui-safe-integration-and-deployment-review-2026-10-24.md` before any action. The accepted UI boundary and actual current owners prevail over these dated records.

## Live starting refs and downstream consumers

At the first connector checkpoint, master was `01d64d61fe008ef61150534b7cc676cea9a970e6`, which already preserved the historical PR #8 record. An exact `master` comparison was repeated before this report at `83f44309ff676ef52178350377a56ebbdd3e74b4`, following the bounded record/fixture promotions below. No production, owner, schema, Save, account, deployment, or native-v3 files were changed by those publications.

| PR | Exact retained head | Content / independent consumer |
| --- | --- | --- |
| #5 | `8980ea3875491bf631a18926feb75f90ffa1b55f` | Historical UI design/source maps, old non-installed prompts; selective evidence disposition |
| #6 | `8c7f471f3e2da3e0d940c7e23e11f40527000042` | Independent nutrition owner, unit calibration and Save-migration decision; **not a UI closure candidate here** |
| #7 | `8610260fd40a7b371a4789e954f53fc884ad71df` | Character source/testing history; downstream #11 `2d140c4a` → #14 `ce2fc143`; exact-main selected interactions |
| #8 | `20825cce24703e5066fb827075d5f310e847fb34` | Top-bar source/testing history; downstream #16 `c6d52a7a`; exact-main resources/conditions, keyboard, Save |
| #9 | `69215b6fa6b4bcc805363171541120645f365d8c` | Mobile shell history; downstream #15 `7cb72c3d`; responsive and keyboard evidence, screenshot preservation |

Equipment owner stack #10 `9f390e03` → #12 `7b6dccf5` → #13 `c9581eb9` remains a separate named consumer. PRs #5–#9 are all open, draft and unmerged, targeting `master`; GitHub reported `mergeable=false`. GitHub's merged PR discussion timeline and issue-comment endpoint each returned zero comments for all five; the prior local audit returned zero reviews and inline review threads. The shared merge base in the prior exact-ref audit was `f56229dde859b9374a54368bd8a8fd2a9872daa1`; these divergent branches are not automatically integrable.

## Exact text preservation completed on master

These are byte-identical **dated historical artifacts**, intentionally **not rewritten** to claim current acceptance.

| Source PR | Historical source path (same destination on master unless noted) | Git blob SHA | Verified publication commit |
| --- | --- | --- | --- |
| #8 | `docs/dev/persistent-top-bar-ui-implementation-record-2026-10-22.md` | `105c2fc46d1833c56fc5114e48c16cc5f4dcfd3e` | `01d64d61fe008ef61150534b7cc676cea9a970e6` |
| #7 | `docs/dev/character-first-gameplay-ui-first-slice-record-2026-10-21.md` | `14763a4183f2dc21639dceb800d04adc14c023ff` | `f25fb3b32b5dcef9cd3dcd1f86fcb12ecd5414ec` |
| #7 | `docs/dev/character-ui-selected-acceptance-minimal-repair-record-2026-10-21.md` | `7682e12056b702befb09ac0bf17ca96df38c26e9` | `3e990b55978e941e19a7265d118e233c6ff8d545` |
| #9 | `docs/dev/mobile-shell-usable-height-repair-record-2026-10-22.md` | `55b4054a541f5e232984e72bd2b2e68c8d2e4b75` | `d7da99cd2205b8732f3b7155420f2f8457e4050f` |
| #9 | `apps/rpg-ui/combined-ui-check.html` → `docs/dev/evidence/historical-ui-pr9/combined-ui-check.html` | `c476685c84b47f90e351cc66afec4a720b5c1249` | `5b6095e79a1cb667944e5c8854a687ca41f1cbb5` |
| #9 | `apps/rpg-ui/rehearsal/combined-ui-check.tsx` → `docs/dev/evidence/historical-ui-pr9/combined-ui-check.tsx` | `e8a529b11bac5d743577604cf5f42599f5e369e3` | `83f44309ff676ef52178350377a56ebbdd3e74b4` |

Each was fetched from its exact PR head, source blob-checked, created as a **new path** on master, and read back matching source Git blob and content. The two archived #9 fixture files intentionally moved out of `apps/rpg-ui`: they are old demo-snapshot/controlled warning and synthetic Save-counter code, **not deployable app routes**. Do not execute them as contemporary acceptance or reintroduce them to production.

The November 8 Batch A manifest and the separately archived **32,471-byte TypeScript diagnostic** already reside on master; do not republish the diagnostic.

## PR #9 screenshot-only binary preservation remaining

GitHub returns **15** changed paths for #9: 3 source files, 1 test, 2 fixture files, 1 record and **8 PNG screenshots**. The earlier local audit's 14-path count is an incomplete inventory. The eight images below are confirmed readable on PR #9 head but **not on master**. The SHA values are their **Git blob IDs**, not SHA-256 hashes of file bytes:

| Original branch path (proposed master evidence destination) | Exact Git blob |
| --- | --- |
| `docs/dev/mobile-shell-evidence/after-1440x900.png` | `897b45a48a527a18fd593f386edaca576c4de9e6` |
| `docs/dev/mobile-shell-evidence/after-320x667-stress.png` | `c3d69f695df4bc36d0ca16a648773d735e9f09b3` |
| `docs/dev/mobile-shell-evidence/after-375x667-condition-popup.png` | `a7053ce18ca1481820e8a0092db77262e5cb43a7` |
| `docs/dev/mobile-shell-evidence/after-375x667-critical.png` | `d0d34e8ff29531d47c6233b7c09d18ab470704b5` |
| `docs/dev/mobile-shell-evidence/after-375x667-long-critical.png` | `3b5907aab8777ce78fa0011a58ab06ea954d7857` |
| `docs/dev/mobile-shell-evidence/after-375x812-normal.png` | `9b4f51d1c615ffb0f144c78ebc6984ba53ac7dc0` |
| `docs/dev/mobile-shell-evidence/after-768x1024.png` | `897ddd901a7a95bc2c7c00de0c819eed357950bc` |
| `docs/dev/mobile-shell-evidence/before-375x667-critical.png` | `d4bc720719a0673084bffd05ab65d8870d9dade7` |

Preserve exact binary bytes with a binary-aware authenticated repository operation, compare Git blob IDs/readback, and check intended historical context. Do **not** use UTF-8 text file creation for PNGs or close/delete PR #9 before this evidence is independently retained. Screenshots record a controlled 375×667 repair from ≈66px to 248px working area, **not authenticated gameplay**. Check the November 8 dirty-worktree manifest separately for composition dependencies; it does not replace these eight PR-hosted screenshots.

## PR #5: missing-on-master documentary evidence preflight

The 24-file historical PR #5 diff consists of 8 existing-on-master shared governance/index paths and **16 missing-on-master dated documents** at the initial Batch 1 inspection. None is a current installed prompt; a direct merge would reintroduce stale coordination. Current `docs/design/ui-information-architecture-boundary.md` §23 already re-authors the durable Character-first priority.

Unique design/preflight files with their branch Git blobs (all historical, **pending item-by-item preserve/reject decision**, no blanket promotion):

| Exact path | Git blob |
| --- | --- |
| `docs/design/character-top-bar-cross-slice-integration-and-visual-coherence-preflight-2026-10-22.md` | `e41c670c00d4230a837bf194ef2f739d3a3a62ca` |
| `docs/design/combined-ui-rehearsal-outcome-and-mobile-viewport-gate-2026-10-22.md` | `a94b483dd89e0ed2e19b613cdfa0f62ff1ab14de` |
| `docs/design/equipment-inventory-ui-owner-projection-and-pr-stack-preflight-2026-10-22.md` | `1a092d99781d5d7f7ff145cdeeb4d254f2efedc3` |
| `docs/design/gameplay-ui-redesign-character-priority-and-first-migration-decision-2026-10-21.md` | `827c52d62b9a6562208f3a3d50fa4c46de7aa398` |
| `docs/design/top-status-bar-resource-and-condition-presentation-preflight-2026-10-21.md` | `06ac2d3aeffc1b4e4e1c293d36c9c8c4407a68d1` |
| `docs/design/ui-design-intent-and-migration-guidance-index.md` | `426b9d4b36e225a4255e291fa3c30ccfbe7c6c5a` |
| `docs/dev/inventory-duplicate-bag-exact-container-connector-preflight-2026-10-23.md` | `39047756c49fa8901422ebdb45e6e7aa146b5733` |

The other **9 absent paths** are `docs/dev/proposed-*-codex-prompt-2026-10-{21,22,23}.md`, all explicitly historical non-installed prompts. They were source/blob-inspected in the connector review and should **not** replace `docs/dev/current-codex-prompt.md`. Treat the proposed acceptance checklist as possible historical test planning input only. Before retirement, record a deliberate item-by-item `PROMOTE_HISTORICAL`, `SUMMARIZED_ALREADY`, or `REJECT_SUPERSEDED` reason for all 16, then recheck the seven still-useful design/source-map documents against contemporary owners. Git blob retention on the old branch is not proof of permanent preservation after deletion.

## PR #7–#9 source/acceptance disposition

- **#7:** current master re-authored Character presentation and retains some tests; the historical helper `apps/rpg-ui/src/features/characterSectionNavigation.ts` (blob `1ab1cadc94301a8a03cd47dce35d89915d29c561`) and `tests/unit/character-section-navigation.test.mjs` (blob `9b65d82c10e8457175627076ec2e1ade1b85f112`) are absent. Later current-main navigation removed the redundant horizontal subsection bar, so do not reintroduce the obsolete helper/test without a contemporary independent reason. Selected real Character, equipment/inventory actions and Save/restart need exact-main evidence or an explicit durable owner transfer.
- **#8:** record now exactly preserved; current resource/condition production code differs from historical blobs. Real selected resource ticks, condition transitions, focus/disclosure and Save/restart remain separate acceptance tasks; existing controlled tests are not proof.
- **#9:** historical record and original demo fixture bytes are preserved as non-runtime evidence. Eight screenshots remain unpromoted. Responsive narrow/landscape portrait, keyboard/focus, popup/clipping and selected Save/restart obligations remain held on exact main, potentially combined with later #15 and #16 review.

## Smallest safe next executable/checkpointed action

1. **XS/S binary-evidence checkpoint only:** on an authenticated clean or understood checkout, verify the new master and PR #9 head; promote the **eight exact PNG files** to their explicit evidence paths on current master (or separately reviewed historical evidence directory); compare Git blob SHA for every file, confirm no unrelated source changes, `git diff --check`, commit/push/read back. If repository conventions or evidence classification make a particular path unsuitable, stop and report the path-specific reason instead. This step does not require a build, account access or synthetic replay.
2. **Connector-first before any further Codex:** complete PR #5's 16-artifact disposition and PR #6's independent nutrition decision **separately**; do not repeat a wide branch audit. Preserve only unique, durable evidence, not stale executable prompts.
3. After exact evidence is preserved, make a **separate explicit lifecycle/acceptance-obligation transfer** review. A transferred selected-client requirement must identify the contemporary master-owned task, person/run, proof and next trigger; it is not silently satisfied by transfer. Keep branch head/PR open until the register and linked PR metadata support a policy-compliant supersession decision. Closing a PR and deleting a ref are distinct, separately reviewed actions.

## Boundaries

No PR was merged, retargeted, rebased, closed, or deleted. No binary evidence was published in this connector pass. No tracked runtime, test, schema, dependency, Save, account, native-v3 staging/production publication, rollback, or activation state was changed. No local worktree check or executable test was performed. Production v2 and protected native-v3 remain separate; `HOLD_SELECTED_ATOMIC_ACTIVATION` persists. Failure patterns FP-002, FP-008, FP-009 and FP-016 apply. The large `docs/dev/branch-disposition-register.md` and current handoff/output were intentionally not rewritten from partial connector reads; their next update must be based on full current files and exact new commits.
