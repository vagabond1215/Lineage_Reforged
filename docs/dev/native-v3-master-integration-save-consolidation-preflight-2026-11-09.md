# Native-v3 → master integration and Save consolidation — connector preflight

Date: 2026-11-09  
Repo: `vagabond1215/Lineage_Reforged`  
Verified connector master: `60641a4edc43ccf0b36f9e93bf42d9b8dda82b41`  
Status: **`V3_INTEGRATION_SOURCE_MAPPED; CODEX_ISOLATED_INTEGRATION_NEXT; MERGE_ACTIVATION_SITE_HELD`**

This is a source/read-only connector preflight and **active-task orientation**. It is not an accepted merge, gameplay test, hosted staging review, account action or branch retirement authorization. Fresh local Git fetch/prune and authenticated checkout verification are required before Codex edits code. The [owner's policy](../design/prealpha-save-format-compatibility-and-native-v3-cutover-policy-2026-11-09.md) explicitly waives playable v2 Save compatibility, but not current-v3 Save validity, retry correctness, exact item/currency/survey ownership, or legitimate account deletion isolation.

## Live source relationships

| Ref | Verified exact head | Status and relation |
| --- | --- | --- |
| `master` | `60641a4edc43ccf0b36f9e93bf42d9b8dda82b41` | Accepted development baseline when this packet was generated |
| #63 `codex/native-v3-selected-fault-recovery` | `2558c57da07a37fa2e0aebed77ffbfba37351e08` | Retained staged predecessor; open draft |
| #64–#66 | `8932e7422e4aeb406c2c5fbeecacf4e59c834fb6`; `e4e4e641e763cd1b7c2046a0d8775c06ab9837cd`; `05d1c8533afe2295d29808a8cd7868a3db263738` | Private staging candidate, packaging and publication evidence; retained draft dependencies |
| #67–#68 | `747bd6cba50370c7891a72d6f2b958d1df1d8e2d`; `658111eff37a21fb02cee8831251a4f28b36ef3c` | Harbormast passenger travel/sustenance; retained drafts |
| #69 `codex/native-v3-reef-return-repair` | `2b8214476bf0b11433c624fecf4207618b49fe9d` | Retained stage, based on separate #68 hosted-evidence child |
| #70 `codex/native-v3-soundings-turn-in` | `fad907301d85786feaeed9cf8fecf64bc9d37949` | Real native Soundings payment and retained-source replay; open draft |
| #71 `codex/native-v3-contextual-consumption-prework` | `6878141f7d27727a0b443cdbf08abe1a2d51b2d9` | **Separate documentation-only** design branch on #70, **not** a code parent of #72 |
| #72 `codex/native-v3-food-combat-legality` | `cc7ad40f6669b7063521e1170214fe5aa0f0e95c` | Runtime legality repair, descends directly from #70 |
| #73 `codex/native-v3-food-selected-acceptance` | `72df5d6fb01c12447a0a131dfae6975b20dd2a53` | Latest QA-only child, descends #72; evidence is **not** accepted production deployment |

Live `master...#73` comparison: **diverged**; merge base `a596112acf3945f2bf7c625e943f2511d12aa710`; **112 tip-only** and **47 master-only** commits; GitHub compare reports **215 changed paths** (109 app/engine/test/script; 104 docs; 2 other). These counts describe a Git history/diff, **not** 112 indispensable features or a safe cherry-pick list. The exact #70→#73 comparison is only six commits ahead with focused gameplay/QA, and does not include #71's separate docs. Revalidate all these numbers at start; connected branch heads can move. The source tip contains many historical `current-codex-output`, `current-gpt-handoff` and register variants, which **must not overwrite newer master coordination**.

## Owner and format crosswalk

| Source | Existing authority | Integration requirement |
| --- | --- | --- |
| Native creator and session | `nativeNewGameSnapshot.ts` + `nativeEpochAppSession.ts`; snapshot `lineage.save_snapshot.v3` | Prefer fresh native campaigns and one authenticated native route; never mint ambiguous old equipment |
| Native artifact and replay | `saveManager.ts` supports native envelope v8 on draft; `campaignIndexedDbStore.ts` validates immutable source and survey/Soundings replay | Preserve retained immutable head/receipt and exactly-once payment, retries and recovery |
| Clean-epoch account | `cleanEpochAccountStore.ts`; `lineage.campaigns.epoch1` IndexedDB with schema v7 | Do not conflate database schema v7 with old campaign envelope v7 or public `GAME_VERSION` |
| Current master | v2 `InGameShell`, `App`, Character UI/Save and relevant newer historical UI/roadmap work | Compare changed overlapping source paths; preserve newer master fixes, main CLI/scripts and current master docs |
| Independent v3 staging | `nativeV3Staging.tsx`, `vite.native-staging.config.ts`, `nativeStagingOrigin.ts` | Origin guard and separate staging artifact are **not** a production toggle. Do not retarget, deploy or remove staging without explicit authorization |

**Policy and categorization:** supported current v3 → Play after full validation; recognized unsupported old/new format → Incompatible/Unsupported, **never Play**; known-format invalid → Corrupt; unavailable storage → Retry; owner-recoverable interrupted transaction → Recovery. Show separate technical format version and game-release provenance only where reliable. A Save's game-release label by itself must not determine compatibility. Legacy account metadata may be shown **delete-only** within the same browser origin if safely enumerable. **Never** imply browser cross-origin read/delete, or delete other accounts, current v3 records or hosted Site objects.

## Exact package boundaries, deliberately split

1. **Checkpoint A: code integration candidate**. Start an isolated worktree/branch at fresh `origin/master`; reconcile the stack through the #73 tip while preserving current-master source/contract changes, exact heads, historical proof and build ownership. Verify no accidental activation, no hosted/publication change, no broad copy of stale branch handoffs. Run focused owner/Save/creator/item/quest/combat suites and baseline-relative typecheck/build. Produce a durable tested branch/PR candidate and a gap matrix. If this is too large, stop after reproducible, committed staged source integration and explicit remaining tests, not a false merge-ready claim.
2. **Checkpoint B: current-format and legacy classification**. On the same candidate only **after Checkpoint A owner coherence**, implement the smallest missing format inspection/reader admission and scoped metadata-only old-account deletion UX if legally enumerable. Proven current v3 status, unavailable/unknown/corrupt/recoverable classification, no wrong-slot writes or data erasure and fresh v3 Save/restart are required. If it needs a second bounded Codex run, leave Checkpoint A durable and install a separately scoped successor; do not weaken atomic save checks to force one window.
3. **Independent acceptance**. Review exact combined source, test results, a real selected local campaign under authorized disposable data, desktop viability, recovery/rollback and data non-interference. Explicit review/authorization precedes **merging candidate into master**.
4. **Separate default activation**. Change primary app entry only with a second exact-source decision/validation. The user wants v3 to become the default **development** app, but integration alone does not authorize silent activation or overwrite protected selected browser data.
5. **Separate deployment/Sites consolidation**. Hosted primary Site source, origin, rollback and browser data must be verified before deployment. The extra Site `Lineage: Reforged Native V3 Staging` lacks independently verified **immutable provider ID**; preserve until confirmed redundant and separately deletion-authorized.

## Legacy documentation disposition

The older [October Stage 2 item-location decision](../design/character-durable-item-location-stage-2-decision-2026-10-26.md) still proves v2 merged-stack provenance defects but explicitly bears a newer November supersession notice: **playable old v2 Save conversion is not a gate**. This also supersedes the old directive in the previously installed `current-codex-prompt.md` to implement a complete legacy v2 Saved-gear migration merely to preserve old campaigns. Historical code, traces and acceptance records remain available for diagnostics, not a second active owner. The development-only [clean epoch decision](../design/development-only-clean-persistence-epoch-route-decision.md) permits starting fresh; its clarification prefers discoverable delete-only old accounts rather than automatic deletion.

No code tests, local worktree clean, actual browser selection, account data classification, Site inventory or deployment were executed by this connector packet. All native-v3 PRs and protected refs are retained.
