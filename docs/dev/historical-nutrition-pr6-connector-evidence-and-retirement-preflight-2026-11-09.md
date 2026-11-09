# Historical Nutrition PR #6 — connector evidence and owner-gate preflight (2026-11-09)

**Result:** `PR6_SUBSTANTIVE_TEXT_EVIDENCE_PRESERVED; PR6_HOLD_NAMED_CONSUMER`. Unversioned historical nutrition design/evidence review only, not numerical calibration, source integration, selected acceptance, Save migration, game balancing, UI implementation, or authorization to retire the branch.

**Repository:** `vagabond1215/Lineage_Reforged`. Starting live master for this focused review `cd848d5b0f1c4d2a4a0e77c56461415af7bc3635`; after the two exact archive publications, synchronized master was `8850818db1a977bfb03497ad830fadf9d64d3963`. PR #6 exact unchanged head `8c7f471f3e2da3e0d940c7e23e11f40527000042` (9 PR-only commits, 58 master-only commits at starting comparison; common base `f56229dde859b9374a54368bd8a8fd2a9872daa1`). PR #6 is open/draft/unmerged, reported not directly mergeable, and had zero comments/reviews in the merged GitHub discussion timeline. Its 6 changed files are **documentation only**. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, and `HOLD_SELECTED_ATOMIC_ACTIVATION` remain unchanged.

## Exact source paths and provisional disposition

| PR #6 path | Original Git blob | Evidence decision |
| --- | --- | --- |
| `docs/design/metabolic-reserve-and-nourishment-quick-glance-design-decision-2026-10-21.md` | `d05886b1ef958de8e913efb994dcac4f674091c2` | **`ARCHIVED_EXACT_HISTORICAL_PROPOSAL`**: original user-requested zero-centered Energy and available Carbs/Fat/Protein/Hydration presentation is preserved, explicitly **not accepted live owner-backed pools** |
| `docs/design/normalized-metabolic-units-food-conversion-and-save-migration-preflight-2026-10-21.md` | `8fbe67c72c18c2ad217568d3a179df2fb25a5d7d` | **`ARCHIVED_EXACT_HISTORICAL_SOURCE_AUDIT`**: historical nine-food, lineage, expenditure, rest, duplicate consumption, day-rollover and old-save analysis retained; source values require contemporary verification |
| `docs/dev/proposed-human-normalized-metabolic-owner-codex-prompt-2026-10-21.md` | `3005a79875bab84191569d28a79830ac050a9b3e` | **`HISTORICAL_PROMPT_HELD_FOR_LIFECYCLE_REVIEW`**: non-installed dated execution proposal, not current Codex route; unique execution requirements must be checked against future owner decision before approving retirement, and its bytes remain on PR #6 |
| `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md` | Shared path | Navigation-only link to old proposed presentation; accepted metabolic/fat owner decision on master remains controlling |
| `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md` | Shared path | Navigation-only link to old proposed presentation; accepted metabolic owner decision on master remains controlling |
| `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md` | Shared path | Navigation-only link to old proposed presentation; accepted recovery/protein owner decision on master remains controlling |

The three shared-path additions were inspected through the six-file PR patch. Each is a **dated cross-reference**, not an independent numerical or Save owner decision. Do not merge them blindly or rewire the current owner decisions toward an unapproved proposal.

## Exact text preservation on master

Both substantive unique documents were copied **byte-for-byte, with matching Git blob IDs and content readback**, to:

- [Historical Nourishment design proposal](evidence/historical-nutrition-pr6/metabolic-reserve-and-nourishment-quick-glance-design-decision-2026-10-21.md): publication `6f43440d94004d5d5a93cb537e4d460f60cfa0e0`.
- [Historical units/food/Save source preflight](evidence/historical-nutrition-pr6/normalized-metabolic-units-food-conversion-and-save-migration-preflight-2026-10-21.md): publication `8850818db1a977bfb03497ad830fadf9d64d3963`.

The documents remain immutable **historic snapshots** under `docs/dev/evidence/` and cannot be treated as endorsed simulation parameters or live instructions. Original relative links may point to the previous `docs/design/` directory layout. The historical proposed Codex prompt is deliberately **not** installed, and its source remains on the retained PR head for a future item-specific retirement review.

## Distinct owner contract and unresolved decisions

A separate retained `codex/human-metabolic-reserve-contract` branch contains the [Human-Normalized Metabolic Reserve Owner Contract](https://github.com/vagabond1215/Lineage_Reforged/blob/80c970493c29f2f076312cad07aaf0aca121c1c7/docs/design/human-normalized-metabolic-reserve-owner-contract-2026-10-21.md), original blob `b56c3ab1249b59bb7a44d64d322a18b3f711b08b`. Its stated status is `STRUCTURAL_CONTRACT_DEFINED; IMPLEMENTATION_HELD_ON_CALIBRATION_AND_SAVE_MIGRATION`. The branch still exists; reading its historical document here **does not mean** its contract was merged, numerically accepted, or implemented.

Later current-master UI boundary and marked nutrition previews are presentation-only and do **not** justify relabeling daily intake totals or abstract `energyReserve.quick/stored` as actual currently usable carbohydrates, dietary fat, protein, or stored body fat.

**Named next consumer:** a dedicated **Normalized Metabolic Units, Food Conversion, And Save Migration Decision**, after the independent owner-contract audit and latest current-master source/caller verification. It must explicitly accept/reject or hold a coherent unit basis, macro-energy conservation, digestion/release/rate/cap policy, Human and lineage calibration, old SaveSnapshot compatibility/migration, rest `mealSupport` provenance, and consumption/tick retry/exactly-once behavior. The eight historical fixed-point examples are inputs to that decision, **not preselected outcomes**. Only a separately accepted owner-and-migration decision can authorize later runtime or Nourishment UI work.

No nutrition runtime, schema, save, derived body-state projection, site, deployment, Game-version, native-v3 or active Codex prompt change was made. No tests or local worktree cleanup were performed. PR #6 and the separate Human-normalized owner-contract branch are **retained**. Before later lifecycle action: independently review the remaining historic prompt, resolve genuine open owner decisions or explicitly transfer their pending responsibility, and separately authorize PR closure and branch-ref deletion. This preflight does not approve either.

## UI cleanup independence

PR #5's [independent lifecycle approval](historical-ui-pr5-independent-lifecycle-approval-2026-11-09.md) already records `PR5_SUPERSESSION_APPROVED; CLOSURE_NOT_EXECUTED`. It remains a **separate closure decision**. Do not attach PR #6 nutrition implementation, the Human-normalized owner branch, or native-v3 staging Site cleanup to PR #5 closure or the broader historical UI branch-retirement batch.
