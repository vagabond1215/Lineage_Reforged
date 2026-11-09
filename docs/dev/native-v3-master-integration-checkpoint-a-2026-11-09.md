# Native-v3 master integration — Checkpoint A

Date: 2026-11-09. Classification: **`V3_INTEGRATION_PARTIAL`**. Branch `codex/native-v3-master-integration-2026-11-09` was created in a new isolated worktree from verified `origin/master` `0522161fb955a9e3128585766723b7f3fc04c4a8`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; no default activation or Game-version change.

## Exact source and reconciliation

Fetched/pruned remote source tip #73 `72df5d6fb01c12447a0a131dfae6975b20dd2a53`; #72 `cc7ad40f6669b7063521e1170214fe5aa0f0e95c` descends from #70 `fad907301d85786feaeed9cf8fecf64bc9d37949`, and #73 descends from #72. #71 is separate documentation prework. Merge base with master: `a596112acf3945f2bf7c625e943f2511d12aa710`; 55 master-only and 112 source-only commits. Of 56 master-changed and 215 v3-changed paths since that base, **only four overlap**, all current coordination files: `current-codex-prompt.md`, `current-codex-output.md`, `current-gpt-handoff.md`, `branch-disposition-register.md`. No app, engine, content, test or packaging path overlaps current master changes since the base.

The candidate imports the 110 non-document `.gitignore`, app, engine, content and focused/QA test paths from the verified #73 tree. It excludes all 104 historical source-branch docs and `.gitattributes` (whose rules only concern excluded historical artifact manifests). Master `AGENTS.md`, active prompt body, version policy, primary UI entry, and November decisions remain master-derived; branch-local output/handoff/register and a short Checkpoint B continuation note were updated. `.gitignore` adds only the native staging build output. `apps/rpg-ui/package.json` adds the optional staging build command; `tsconfig.node.json` covers the staging config/origin validator. `EpochApp` keeps its default `candidateNativeV3=false`, and the test candidate route is explicit; the staging config requires a distinct HTTPS origin. Source and staging configuration were reviewed against the master side before import.

| Owner set | Imported candidate | Master boundary |
| --- | --- | --- |
| Native creator, selected session and gear | `nativeNewGameSnapshot`, `nativeEpochAppSession`, `nativeSessionItemActions`, native physical boundary, gear instance owner and worn projection | Existing v2 default remains; v3 gear does not flow through v2 stash mutation. |
| Campaign/account and Save | `campaignIndexedDbStore`, clean epoch account/adapters, `saveManager` native envelope support, selected Save/session callers | v3 is candidate-only; Checkpoint B format classification and legacy listing remain open. |
| Gameplay | native quest, travel, survey, Soundings, fungible Use, combat and Normal-Stakes callers/owners | No site deployment or hosted selected acceptance. |
| UI and packaging | native candidate panel/Character review, guarded `EpochApp` route, staging entry/origin guard | Main `App`/entry remains v2 default; no origin rebind or publication. |

## Executed validation

The first concurrent focused test attempt failed before two files ran because Vite instances shared an optimizer cache (`EPERM` cache rename); the exact same five files were rerun **serially** and passed **19/19**. Additional serial focused runs passed **17/17** native item/gear/survey cases, **17/17** Soundings persistence/payment cases, and **4/4** native Character/current top-bar render cases. Total final focused assertions: **57/57**. These cover real native creator to admitted campaign, gear displacement/bag/overflow and stale/duplicate actions, fungible Use, survey and once-only five-gold Soundings payout, combat food legality, selected-host source checks, and Save JSON/readback. They are local fixtures, not hosted or authenticated selected-client proof.

`npm run typecheck:node` passed. Direct default Vite production build passed; native staging build passed using a synthetic distinct `https://staging.example.invalid` **build-only** origin. Neither build was deployed. Both builds report nonblocking dynamic-import/chunk-size warnings. No broad TypeScript matrix was run, so no broad diagnostic delta is claimed. No running server was started; tests used short-lived Vite instances. The task-only dependency junction and both generated build output directories were removed after validation.

## Remaining gate and next package

Checkpoint A is a tested source candidate, **not** independent acceptance or merge readiness. The critical positive path was covered by focused automated fixtures; a disposable selected local browser run and independent diff/source review remain for later acceptance. Checkpoint B has not run: the v3 launcher still needs explicit supported/incompatible/damaged/unavailable/recoverable admission and, only if safely enumerable on the same origin, metadata-only old-account delete scope. Implement and test that as one bounded successor package on this branch; do not overwrite rejected bytes or real account data. Preserve `HOLD_SELECTED_ATOMIC_ACTIVATION`. No PR merge, closure, retarget, rebase or branch deletion occurred.
