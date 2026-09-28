# Independent storage and Slice D evidence

Executed 2026-09-28 at source `567d250cae46a43c1c87123d63478aa9f47183f9`, runtime `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`. Production and test files unchanged. This folder's date preserves the audit checkpoint directory; execution resumed September 28.

## Bounded storage

`node docs/dev/evidence/soundings-post-f3-acceptance-2026-09-25/storage-d/storage.mjs` exited 0. Independent instrumentation calculates UTF-16 key plus value size before **every** `setItem`, including temporary writes, with the helper storage separately enforcing 5 MiB. The ordinary helper uses production creator, acceptance, travel and shift callers; it saves/restarts after shift two and after shift four. The probe then returns four ticks, submits, publishes/restarts, checks duplicate, travels and saves/restarts again without injecting prerequisites.

- 45 writes; 15 retained keys.
- Retained: 4,320,700 bytes.
- Peak intermediate: 5,076,206 bytes, below 5,242,880 by 166,674 bytes.
- Applied witness: 2,716 value bytes; 3,112 including its storage key. Witness remains byte-identical after descendant publication.
- Exact +5 gold, unchanged silver, no repayment after restart.
- Status `BOUNDED_UTF16_STORAGE_PASS`. Finite sequence only; not unlimited history or browser evidence. Root audit owns ordinary browser execution.

## Mechanical regression

Combined exact 16-file baseline plus focused F3 suite (single fresh complete run; `tests.log`):

```powershell
node --test tests/unit/player-soundings-turn-in.test.mjs tests/unit/player-soundings-turn-in-persistence.test.mjs tests/integration/soundings-durable-completion-ordinary.test.mjs tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/ashen-reef-survey-travel-access.test.mjs tests/unit/soundings-return-travel.test.mjs tests/unit/player-survey-activity-advancement-command.test.mjs tests/unit/player-survey-activity-advancement-persistence.test.mjs tests/unit/player-survey-activity-advancement-characterization.test.mjs tests/unit/campaign-persistence-foundation.test.mjs tests/unit/ashen-reef-survey-authored-content.test.mjs tests/unit/ashen-reef-survey-offer-staging.test.mjs tests/unit/soundings-admission-witness.test.mjs tests/unit/soundings-admission-witness-recovery.test.mjs tests/unit/soundings-survey-repair-compatibility.test.mjs
```

183 tests passed, zero failed/cancelled/skipped/todo, 154,872.2459 ms. `REGRESSION_BASELINE_REPRODUCED`.

- `npm run tool:content-lint`: 71 files, pass (`lint.log`).
- `npm run typecheck:ui:node`: pass (`node-typecheck.log`).
- `npm run typecheck:ui`: expected nonzero, 137 diagnostics (`ui-typecheck.log`). Filter `error TS\d+`, replace `\(\d+,\d+\)` with `(line,column)`, sort; `Compare-Object` against `.tmp-dev070-ui-typecheck.log` yields no differences. This is known debt, not a green broad typecheck.
- From `apps/rpg-ui`, `node node_modules/vite/bin/vite.js build`: pass, 4 server / 216 client modules (`build-app.log`). Existing Browserslist/chunk/plugin timing warnings. Initial invocation from repository root failed because root has no Vite module (`build.log`); corrected application-local invocation completed. An initial tool invocation setting app working directory could not open the evidence output; running `Set-Location apps/rpg-ui` from workspace root resolved it.
- JS import bridge: `campaign-rules.js` exports `validateAshenReefSurveyAuthority`; `index.js` exports `verifySoundingsAdmissionProvenance` and `isSoundingsAdmissionWitness`, all functions. Command exited 0.
- `git diff --check`: pass; no tracked changes at this checkpoint. Root owns final intended-file review and publication whitespace check after audit documentation is written.

No runtime repair, test edits, commits, acceptance decision or coordination changes were performed by this bounded audit slice.

Publication hygiene: trailing whitespace and final blank lines were normalized in build-app.log and node-typecheck.log; diagnostics and results are unchanged.
