# Native-v3 PRs #63–#73: post-source-merge preservation and cleanup inventory

Date: 2026-11-10. Repository `vagabond1215/Lineage_Reforged`. Source `master` `3829281e32e9a22dba9a1a4946be3d76e8e97f00` (includes native-v3 source merge `fc51ebb9` and readiness hold `3829281e`). **`CONNECTOR_LIFECYCLE_EVIDENCE_ONLY; NO_PR_RETIREMENT_AUTHORIZED`.**

This is a bounded GitHub Connector inventory, not a commit/blob-equivalence audit of every source file, local test run, implementation acceptance, staged publication approval, PR closure, merge or deletion. No production source, existing coordination files, staging Site, Save or account is changed. Recheck all refs before any later disposition. The active [pending recovery repair prompt](current-codex-prompt.md) is a separate source task on an isolated branch.

## Exact checked PR status

All eleven PRs below were checked live on GitHub: **open, draft, unmerged**. They are mostly stacked on one another; #71 is a separate documentation child of #70 rather than an ancestor of #72/#73. Their existing held dispositions and branch refs remain intact.

| PR | Exact retained head | Unmerged additions absent at original paths from current master |
| --- | --- | --- |
| [#63](https://github.com/vagabond1215/Lineage_Reforged/pull/63) React Save rollback/recovery | `2558c57d` | 2 documents |
| [#64](https://github.com/vagabond1215/Lineage_Reforged/pull/64) isolated staging | `8932e742` | 4 documents |
| [#65](https://github.com/vagabond1215/Lineage_Reforged/pull/65) staging package optimization | `e4e4e641` | 3 documents/manifests |
| [#66](https://github.com/vagabond1215/Lineage_Reforged/pull/66) publication evidence | `05d1c853` | 2 documents |
| [#67](https://github.com/vagabond1215/Lineage_Reforged/pull/67) Harbormast passenger passage | `747bd6cb` | 4 documents/manifests |
| [#68](https://github.com/vagabond1215/Lineage_Reforged/pull/68) passenger sustenance | `658111ef` | 4 documents/manifests and 1 `.gitattributes` |
| [#69](https://github.com/vagabond1215/Lineage_Reforged/pull/69) Reef return | `2b821447` | 4 documents/manifests |
| [#70](https://github.com/vagabond1215/Lineage_Reforged/pull/70) Soundings payment | `fad90730` | 4 documents/manifests |
| [#71](https://github.com/vagabond1215/Lineage_Reforged/pull/71) contextual consumption prework | `6878141f` | 3 owner-review/design prework documents |
| [#72](https://github.com/vagabond1215/Lineage_Reforged/pull/72) food combat legality | `cc7ad40f` | 1 evidence document |
| [#73](https://github.com/vagabond1215/Lineage_Reforged/pull/73) food selected acceptance | `72df5d6f` | 1 evidence document |

**Method and exact scope.** GitHub PR `/files` was read for each numbered PR and every path reported as `added` was checked against the complete, non-truncated recursive `master` Git tree (2,135 paths). A missing original path is **not** proof its content has no equivalent elsewhere, nor that the runtime implementation was omitted. There are **33 distinct added paths absent**: **32 text documents/manifest files** and **one `.gitattributes`**. Other PR-modified files were not exhaustively compared blob-by-blob, so no conclusion about complete PR semantic consumption follows. This also does not count added files in other earlier PRs.

## Retained evidence that needs source-aware promotion review before retiring refs

**High priority: owner/design intent, not a stale execution task by default.**

- `docs/design/native-v3-selected-react-save-rollback-and-recovery-gate-2026-11-02.md` (#63) describes real React fault/retry/physical gear evidence and its selected-acceptance limits.
- `docs/design/native-v3-isolated-staging-candidate-and-publication-plan-2026-11-02.md` (#64) describes the distinct staging-origin and access/rollback posture. Its historical staging publication gates should not silently become current activation requirements.
- `docs/design/native-v3-harbormast-starfall-passenger-passage-decision-2026-11-04.md` (#67) defines the bounded authored passage. Its original no-provisions observation is explicitly refined by #68.
- `docs/design/native-v3-harbormast-passenger-sustenance-decision-2026-11-05.md` (#68) supplies the subsequent, scoped onboard water/meals direction, with no generic maritime supply grant.
- `docs/design/native-v3-survey-descendant-and-reef-return-decision-2026-11-05.md` (#69) describes the source/ledger gap and Reef return repair; its then-pending native turn-in work was subsequently advanced in #70.
- `docs/design/native-v3-soundings-turn-in-retained-payment-decision-2026-11-06.md` (#70) defines exactly-once five-gold native Soundings completion and immutable source/receipt evidence.
- All three #71 documents, `docs/dev/native-v3-contextual-consumption-authority-audit-2026-11-08.md`, `...first-sequence-plan-2026-11-08.md`, and `...owner-decisions-and-pre-codex-gates-2026-11-08.md`, are absent from master. The owner-reviewed addendum says **product direction is recorded but implementation is not authorized**, and its owner decisions control its own earlier proposal when different. Reconcile with current design authority before promotion, and preserve all three as a connected source set.

**Historical / evidence with named consumers.** Remaining 23 missing document/manifest additions across #63–#73 include staging manifests and publication records, bounded tests/hosted evidence, and numerous `next-native-v3-*` execution prompts. Retain evidence for publication/staging/rollback provenance; treat old `next-*` prompts as historical rather than silently installing them over the current [pending recovery task](current-codex-prompt.md). Prior selected-client claims must remain correctly scoped to their actual origin/account and date.

**Metadata requiring separate justification.** PR #68 introduces a one-line `.gitattributes`: `docs/dev/native-v3-passenger-sustenance-artifact-manifest-2026-11-05.txt -text`. The file is absent from master. Do not blindly cherry-pick it: the referenced manifest is also absent and copying a Git attributes rule alone could be unnecessary or misleading. Check any future retained artifact's exact byte/text treatment before deciding to promote that rule.

## Non-destructive cleanup decision and next named consumer

1. **No source-stack PR retirement now.** Source merge reachability does not prove that each PR's added design/evidence record is preserved or superseded. The integration branch and original PRs #63–#73 stay retained; #71's separate documentation must not be lost. Do not merge/rebase/close/delete PRs or their branch refs without a later exact-ref named-consumer audit and owner-approved disposition.
2. **Later, separately scoped lifecycle pass:** reconcile each of the six original design files and three #71 owner-reviewed documents against current `master` canon/source. Promote only still-authoritative unique decisions as new or updated documents, with explicit historical supersession notes; preserve older contradictory observations in the retained evidence. Classify staging manifests and publication witnesses as retained historical evidence, not current deployment artifacts. Determine whether `.gitattributes` has any live consumer.
3. **After verified preservation and named-consumer closure:** propose exact PR lifecycle transitions individually. Do not bulk-delete or infer retirement from filenames, a successful native-v3 source merge, or a Git clean diff. Keep the active bounded pending-recovery Codex task separate.

No current production behavior, source/test evidence, Game version (`0.1.1-prealpha`), default-v3 selection, Save/account data, hosted Site, PR state, branch or historical evidence has been changed by this document. It is an independent connector-safe cleanup inventory.
