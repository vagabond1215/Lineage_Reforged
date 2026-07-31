# Current Codex Output

## Run Identity

- Source run: `Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`
- Date: 2026-07-31
- Branch/status assumption: synchronized `master`; audit coordination changes pending commit at report write
- Inspected base: `e6da77c8495d8b5cbffc966cdc3db5753b7cc89a`
- Audit starting head: `e6da77c8495d8b5cbffc966cdc3db5753b7cc89a`
- Live post-fetch head before audit commit: `e6da77c8495d8b5cbffc966cdc3db5753b7cc89a`
- Final committed head: resolve after this self-referential report is committed; the completion response must state the exact SHA
- Label class: support suffix
- Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`
- Milestone impact: `supports_current_band`
- Suggested commit: `docs(save): audit pending-defeat completion authority`

## Outcome

`AUDIT_REPAIR_REQUIRED`

The `0.6.9` parent remains unaccepted.

Fresh execution accepted the three exact `0.6.9.5` repair targets: multiple pending receipts reject without effects, pending completion uses exact settlement authority, and one valid completion retains the original ledger entry plus one deterministic superseding entry.

Independent adversarial inspection nevertheless proved three further blocking defects:

1. initial automatic defeat resolution uses nonempty current and campaign-start ids directly instead of the shared exact known-safe-settlement validator;
2. exact completed-repair replay after explicit save/load cannot return retained duplicate state and throws `Normal defeat recovery has already completed.`;
3. pending repair accepts corrupted HP, Stamina, MP, source tick, resolved tick, and original ledger acceptance-tick facts.

No finding is waived, deferred, or treated as accepted by green totals. The installed repair is:

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

The Ashen Reef survey receipt-foundation decision remains blocked.

## Files Changed

- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/dev/branch-disposition-register.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/historical-version-and-deferred-route-register.md`

No production code, shared type, schema, save format, test, dependency, content, asset, generated file, or retained temporary audit file changed.

## Finding-To-Test Matrix

| Finding | Fresh evidence | Production surface | Disposition |
| --- | --- | --- | --- |
| Initial automatic destination bypass | ruin-backed current id returned a playable initial defeat instead of rejecting; source inspection shows campaign-start takes the same unchecked direct path | `normal-defeat.ts` `resolveDestination(...)` | blocking repair required |
| Restart duplicate unavailable | one valid completion was explicitly saved/reloaded; exact completion replay threw `already completed` rather than returning current snapshot/control as duplicate | `campaign-session.ts` `completePendingNormalDefeatRecovery(...)` | blocking repair required |
| Original effect provenance incomplete | six independent corruptions—HP, Stamina, MP, source tick, resolved tick, original ledger accepted tick—were all accepted by lower-level repair | `normal-defeat.ts` `repairPendingNormalDefeat(...)` | blocking repair required |
| Multiple pending receipt ambiguity | original and reversed two-pending arrays rejected at both owners with stable count diagnostics and byte-stable input | both repair owners | independently accepted |
| Pending destination authority | explicit/current/start/sole-known valid cases passed; blank, padded, unknown, known-false, non-settlement, duplicate, contradictory, corrupt-current, and ambiguous fallback cases rejected | shared pending destination resolver | independently accepted |
| Correction provenance and exactly-once effects | one valid repair preserved the original entry, appended one exact correction, advanced four ticks once, preserved HP/Stamina during completion, and updated receipt/projections/session once | both repair owners | independently accepted |
| Publication boundary | pending publication rejected; repair remained unpublished until explicit save; receipt, correction, location, clock, and publication survived reload | save manager plus production caller | independently accepted |
| Existing launcher/retry/collision/consumer/migration behavior | fresh focused and prescribed groups | existing owners | preserved |

## Failure-Boundary Matrix

| Boundary | Independent result |
| --- | --- |
| Zero pending and no history | stable retained-receipt rejection |
| Two pending, original/reversed order | stable rejection before effects at production and lower-level owners |
| Completed-only history after restart | no array fallback, but exact replay cannot return durable duplicate state; blocking |
| Valid pending explicit/current/start/sole-known destination | accepted under exact pending-completion rules |
| Blank/padded/unknown/known-false/ruin/wilderness destination | rejected under pending-completion rules |
| Duplicate or contradictory location rows | rejected |
| Corrupt current plus otherwise-safe fallback | rejected without fallback |
| Multiple safe fallback rows in both orders | rejected without array-order winner |
| Initial ruin-backed current id | accepted as playable; blocking |
| Missing/duplicate/conflicting receipt or original ledger identity | rejected before effects |
| Corrupted resource/tick/original-ledger-tick facts | accepted; blocking |
| One valid completion | exactly one four-tick relocation and correction append |
| Duplicate after later accepted mutation | current snapshot/control retained; no rollback or append |
| Duplicate after explicit save/reload | throws instead of returning retained duplicate state; blocking |
| Pending ordinary mutation/publication/manual/quick/retirement | blocked |
| Explicit save after repair | succeeds and roundtrips exact repaired authority |
| New-campaign pre-head/post-head retry, caller loss, restart, changed input, and slot collision | preserved by fresh regression execution |
| Account consumer, migration, control, and terminal behavior | preserved by fresh regression execution |

## Receipt / Provenance / Effect Matrix

| Fact | Fresh result |
| --- | --- |
| campaign / continuity / character / rules / policy | conflicting identity rejects |
| exactly one pending receipt | zero/two reject; one admits |
| original ledger id / kind / source / count | missing, duplicate, or conflicting identity rejects |
| Chronicle / notification count | duplicate evidence rejects |
| preexisting correction / supersession | rejects |
| HP restored fact | corruption accepted; repair required |
| Stamina restored fact | corruption accepted; repair required |
| MP preserved fact | corruption accepted; repair required |
| source / resolved tick facts | corruption accepted; repair required |
| original ledger accepted tick | corruption accepted; repair required |
| valid original plus correction | original stable; one deterministic correction with exact source and supersession |
| completion resource effects | HP/Stamina unchanged during completion; four ticks and relocation once |
| duplicate current-session effects | no rollback, tick, relocation, resource, projection, ledger, or revision effect |
| duplicate restarted-session effects | fail-closed error; no effects, but required retained duplicate result absent |

## Applicable Verification Guardrails

- `FP-001`: inspected the actual `App.tsx` run-entry caller; fresh execution exercised production completion and explicit publication owners.
- `FP-002`: used fresh adversarial matrices in addition to 26/26 and 133/133 totals; the matrices reopened the parent.
- `FP-003`: production completion remains reachable and exits valid pending state, but restart duplicate completion is incomplete.
- `FP-004`: account-and-slot collision tests and contender ordering passed freshly.
- `FP-005`: new-campaign caller loss, retry, restart, regenerated input, and repair restart paths ran freshly; completed-repair replay failed.
- `FP-006`: older/newer and multiple slot recoveries remain protected; pending destination arrays have no winner; initial destination validation remains incomplete.
- `FP-007`: current output and prompt are complete replacements based on confirmed complete prior reads and must be reread before commit.
- `FP-008`: every remote branch and PR #2 received live merge-base, divergence, path, authority, and semantic-overlap review; none contains this repair.
- `FP-009`: inspected base, audit start, pre-commit live head, and final committed head are distinguished.
- `FP-010`: all three independent findings map to exact code, tests, and an explicit repair disposition above.

## Checks Run

- clean synchronized execution gate: passed at `e6da77c8495d8b5cbffc966cdc3db5753b7cc89a`;
- independent adversarial boundary replay: `7 / 9` accepted; the two failing assertions proved initial unsafe-current acceptance and missing restart duplicate return;
- independent original-effect corruption probe: `6 / 6` corrupted variants were incorrectly accepted;
- focused persistence suite: `26 / 26`;
- prescribed Node regression group: `133 / 133`;
- RPG UI production build: passed, `209` modules transformed; generated audit build directory removed afterward;
- bounded RPG UI TypeScript audit: known-failing with `137` diagnostics and exit code `1`; `0` diagnostics name `normal-defeat`, `campaign-session`, or the focused persistence test;
- root workspace TypeScript inspection also reproduced the historical broader `173`-diagnostic posture; it is not an acceptance gate;
- JavaScript mirrors: Normal-defeat, campaign-session, and new-campaign coordinator remain exact TypeScript re-exports; focused public-export checks passed;
- `git diff --check`: passed before coordination updates; final staged check required before commit;
- production caller, save/publication owner, repair owners, contracts, focused tests, protected readiness reference, and complete live branch paths inspected.

No hosted GitHub Actions run was requested or attached. These are local audit results.

## Branch And PR Lifecycle

- Fetch/prune completed at audit starting head `e6da77c8495d8b5cbffc966cdc3db5753b7cc89a`.
- Local branches: only synchronized `master`.
- Non-default remote branches: seventeen.
- Open PRs: PR #2 only; head `e78dc645cfb658685be12f45f46d34b7c0da1119`, open, non-draft, non-mergeable, and unrelated.
- Live inspected-base/branch-only counts:
  - `feat/main-menu-assets`: `710 / 0`;
  - `main-menu-asset-contract-pass`: `638 / 10`;
  - `main-menu-refinement-pass`: `645 / 2`;
  - eight `bcbe658d` one-document branches: `44 / 1` each;
  - four `3006c968` one-document branches: `46 / 1` each;
  - `parallel/prompt-packaging-integrity-audit`: `73 / 1`;
  - `prep/integrated-gameplay-0-7-readiness-audit`: `126 / 2`.
- The protected integrated-readiness branch was inspected read-only and remains historical/noncontrolling; the prompt-packaging protected reference remained read-only.
- No branch contains overlapping initial-destination, restart-duplicate, or effect-provenance work.
- No disposition changed and no merge, cherry-pick, rebase, PR closure, or branch deletion was due.
- Twelve candidate-document branches retain their owner-specific triggers; protected references retain future `0.7.0` readiness and workflow-integrity triggers; launcher branches and PR #2 retain the launcher-hygiene trigger.

## Risks And Follow-Up

- Initial unsafe location evidence can bypass `recovery_pending` entirely and create a playable initial receipt, so completion-only validation is insufficient.
- Durable completed-repair replay needs explicit stable receipt targeting or equivalent exact evidence; it must not choose completed history by array order.
- Resource/tick validation must remain narrow and derivable from retained snapshot/receipt/ledger facts; do not invent a generic receipt framework.
- The repository-wide TypeScript baseline remains nonzero and outside this support chain.
- Parent acceptance and the Ashen Reef survey decision remain blocked.

## Next Recommended Run

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

Classification: parent-specific support suffix; exact three-finding implementation followed by a separate independent audit.
