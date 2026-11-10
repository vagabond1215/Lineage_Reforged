# Native-v3 pending-recovery exact-source merge: connector prework

Date: 2026-11-10. Repository `vagabond1215/Lineage_Reforged`.
**Classification: `CONNECTOR_MERGE_ORIENTATION_COMPLETE; SOURCE_MERGE_NOT_AUTHORIZED`.**
This is a GitHub Connector-only **read-only source/file/coordination audit** packaged as an isolated documentation addition. It is not a computed Git merge-tree, executable verification, local checkout/worktree check, merge approval, runtime change, default-native-v3 activation or hosted acceptance.

## Exact live identities checked before this packet

- Common merge base: `6fb1f233b47b7e9e5e805c1a4f21b5f49b4ce424`.
- Development `master`: `a6c95f5d905ead0dece6f405d1e2d4987d836d15` (one documentation-only commit since the common base).
- Independently reviewed repair branch `codex/native-v3-pre-admission-recovery-2026-11-10`: `c6794b0fc8b9cbf4f4b4cb28dae09b9b42d3e395` (two commits ahead and one behind master).
- Branch source/test commits: `22a5bc4b80d34cbd6640a6b86774255ad241ac38` `fix(ui): gate native inventory recovery by retained format`; `c6794b0fc8b9cbf4f4b4cb28dae09b9b42d3e395` `test(v3): verify terminal recovery format boundary`.
- `master` unique commit: `a6c95f5d905ead0dece6f405d1e2d4987d836d15`, `docs(v3): map real terminal closure fixtures for independent recovery review`.
- GitHub recursive file-tree inventories for all three refs were complete/nontruncated. Compared against the common base: **10 distinct branch-changed file paths, one master-only added document, zero overlapping paths**. A path/blob union by original refs would retain **1,986 unique file paths** (1,983 at common base + 2 branch additions + 1 master addition). This is a proposed file-content union, not a Git-generated final merged tree or proof of semantic compatibility.

## Source delta and expected ownership

| Scope | Exact changed paths | Merge recommendation |
| --- | --- | --- |
| Production: inventory caller | `apps/rpg-ui/src/EpochApp.tsx` | Use reviewed branch blob `2cc24ab6e7243bf325c0252cecb5dbd286f26d94`; contains `recoverPendingInventory` with native-mode retained format checks |
| Production: retained owner | `apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts` | Use reviewed branch blob `a8b185ddaef0b59c508f1b8e767a05a3a4a2f1b6`; version check and pending terminal closure filter |
| Production: terminal caller | `apps/rpg-ui/src/game-shell/cleanEpochTerminalAdapter.ts` | Use reviewed branch blob `0deddc7c2d7e07dca16651195994d45d69a7a2b2`; pending settlement filter |
| Disposable QA | `apps/rpg-ui/src/nativeSelectedSessionQa.tsx`; `apps/rpg-ui/tests/native-pre-admission-recovery.test.mjs` | Preserve both exact tested branch files; no QA route becomes the ordinary app entry |
| Focused evidence | `docs/dev/native-v3-pre-admission-pending-recovery-repair-2026-11-10.md` | Preserve final branch report and `INDEPENDENT_RECOVERY_REPAIR_VERIFIED` classification, scoped to disposable local tests |
| Live coordination | `docs/dev/current-codex-prompt.md`, `current-codex-output.md`, `current-gpt-handoff.md`, `branch-disposition-register.md` | **Semantic routing required**, described below; do not mechanically preserve an obsolete task prompt as current |
| Master-only source map | `docs/dev/native-v3-pending-recovery-terminal-closure-connector-source-map-2026-11-10.md` | Preserve exact master blob `f141cd4993aa1a15b2f5dd31cb593893ab0ca50a`; historical pre-review evidence, not a reason to repeat the completed independent fixture |

No other path was changed on either side since the common base. Especially, `apps/rpg-ui/src/main.tsx`, `apps/rpg-ui/src/App.tsx`, the separate native staging entry/origin/Vite configuration, `cleanEpochFirstCampaignAdapter.ts`, `cleanEpochDescendantAdapter.ts`, `cleanEpochLauncherRead.ts`, and `docs/design/prealpha-save-format-compatibility-and-native-v3-cutover-policy-2026-11-09.md` have **identical Git blobs** on base, master and branch. Default normal entry is still `<EpochApp />` (v2 default), not v3. This packet does not introduce a migration, account/Save owner, Site change or release version.

## Routing reconciliation required for an eventual separately authorized merge

1. The **current master prompt** at the inspected base still asks Codex to perform the pending recovery repair. The **branch prompt** asks for an exact-source merge decision. After that decision and any separate authorized source merge, **neither prompt should remain installed as the next task**. Replace with a new, explicitly scoped **normal-entry native-v3 activation readiness** prompt that preserves `HOLD_SELECTED_ATOMIC_ACTIVATION`; it must not actually activate v3 or publish a Site without new authorization.
2. Append the branch's repair + independent-review results to master `current-codex-output.md` and `current-gpt-handoff.md`, retaining existing history and adding an accurate **final master merge identity and scope only after a real merge**. Do not claim a hypothetical combined tree or source merge was already committed.
3. Update `branch-disposition-register.md` only on the actual lifecycle transition. Until merge approval and exact merged-source confirmation, the recovery branch remains a **retained independently verified source candidate**. Original PRs #63–#73, separate #71 owner-reviewed design files, historical UI PRs and other protected refs remain retained with named consumers.
4. Retain the master-only fixture source map and the earlier [PR retention audit](native-v3-post-source-merge-pr63-73-retention-audit-2026-11-10.md). Do not let stale branch coordination override newer master-only documents and the active Core World Entry direction.

## Evidence available, limits and final local check

The branch-local [independent recovery record](https://github.com/vagabond1215/Lineage_Reforged/blob/codex/native-v3-pre-admission-recovery-2026-11-10/docs/dev/native-v3-pre-admission-pending-recovery-repair-2026-11-10.md) reports a fresh disposable real-IndexedDB browser proof: v2 pending first/descendant/terminal and settled-but-unclosed terminal preserved; independent v3 ready slot loadable; lawful v3 closure once with exact deletion receipt and restart; malformed source blocked without writes. Focused **15/15**, Node UI typecheck and direct Vite build passed. Broad UI diagnostic counts **115 branch / 115 base**; zero changed-file diagnostics. This connector audit **did not rerun any of these**; commit-status API returned zero reported status checks on inspected refs, which neither confirms nor invalidates local evidence.

**Smallest next Codex slice:** (a) sync and inspect current refs and worktrees; (b) calculate the *actual Git combined tree*, source diff and coordination resolution; (c) compare it to this zero-overlap path/blob inventory, retaining the master-only fixture map; (d) run only focused new validation if changed callers/semantic integration warrants it, recording the inherited broad diagnostic baseline; (e) publish a decision-complete merge record with exact rollback parents, expected source effects and the post-merge routing plan; **then ask for separate, exact-branch authorization before merging**. If any source overlap or material mismatch appears, refresh this packet and repair on the isolated branch first. The verified independent recovery test is not permission to skip exact combined-tree review.

No implementation, PR action, deployment, default selection, account or Save mutation, `GAME_VERSION` change or merge is authorized by this packet. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, and `HOLD_SELECTED_ATOMIC_ACTIVATION` remain.
