# Activity Revenue Presentation Truthfulness Repair

Date: 2026-09-28. Status: **IMPLEMENTATION_INCOMPLETE** pending the selected survey-context browser check. Repository: `vagabond1215/Lineage_Reforged` only. Inspected clean synchronized source `1f6d513a0c780ff52a8d7b9af6282c3010557d15`; implementation checkpoint `c2d07ac8d4b4e1a404687cbd9d86c533feeb9222`. Unversioned; development milestone impact `none`; game-version impact `none`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, and accepted `DEV-0.7.0` remain unchanged.

## Patch and owner trace

`apps/rpg-ui/src/runtime/uiViewModel.ts` changes only the `daily-revenue` metric from the literal `842` and false session-record claim to `Not tracked` and `Daily revenue is not currently tracked.` The `GameSessionContext` constructs the view model, `UiViewModelContext` supplies it, and `ActivityPanel` renders each metric's label, value, and detail as text. No panel, command, persistence, economic owner, schema, content, or other metric changed. The focused decision remains `docs/design/post-soundings-playability-gap-prioritization-decision.md`.

## Local validation and rendered evidence

- `npm exec -- vite build` from `apps/rpg-ui`: pass, 216 client modules. The initial Vite invocation from the repository root failed to find `index.html`; rerunning from the app directory resolved the invocation error.
- `npm run typecheck:ui:node`: pass. `npm run typecheck:ui`: 137 diagnostics, matching the recorded broad baseline; the edited metric lines have no diagnostic. No claim of green broad UI typecheck.
- `git diff --check` and staged diff review: pass. No behavior test was added for literal copy, and the full accepted Soundings suite was not rerun.
- Browser, `http://127.0.0.1:5173/`: created a separate local QA account and Slot 1 through the ordinary creator, selecting Myridian Chain / Starfall Isle / Starfall Port, Workshop-Raised, and Traveler. No existing account or save was edited. On Activity, the accessibility tree rendered `ACTIVE OPERATIONS 0`, `DAILY REVENUE Not tracked Daily revenue is not currently tracked.`, and `CURRENT ACTIVITY Arriving in Starfall Port`; `Advance Shift` and `Rest` remained present. The Soundings offer was visible in Quests.
- At 1280px the metric and explanation were visually readable in the existing three-card overview. At 390px, the text remained in the accessibility tree and the card retained 24px computed value text, but the existing stacked shell left about 92px of scrollable main-pane height. At 768px it left about 105px. This limits narrow-screen usability; a shell layout repair is outside this selected metric patch. The browser observations and DOM measurements are recorded here; screenshots were inspected in the live browser, not persisted as image files. This is not a comprehensive accessibility audit.

## Blocked acceptance boundary

The browser's automatic approval review rejected `Accept Contract` twice in the new QA campaign. Its stated reason was that accepting the contract changes persistent quest state and was beyond the specifically authorized presentation inspection; it also said the QA account alone did not supply approval. No workaround or indirect mutation was used. Therefore a fresh active Soundings survey state and action-readiness check have **not** been verified in this run. The retained 2026-09-25 ordinary browser audit establishes prior survey reachability, but cannot substitute for this prompt's fresh rendered check.

The smallest next action is user approval for accepting the Soundings contract in this isolated local QA campaign, followed by the active-survey Activity render check. Until then, this is a committed implementation checkpoint, not completed prompt acceptance. Preserve the current prompt and do not select or promote a broader successor.

## Branch and PR review

Fetch/prune found master synchronized at the inspected source, one local and four hosted branches; [the repository's open PR list](https://github.com/vagabond1215/Lineage_Reforged/pulls) showed zero. Retained heads, merge bases, and unique paths were rechecked. Readiness `59c103c3` (421/2), prompt-integrity `58a34e37` (368/1), and administration `210df5bc` (199/1) retain their existing protected/held dispositions and named review triggers. No trigger, integration, deletion, or disposition change was due. FP-001 and FP-017 were applied to the ordinary creator and Activity caller boundary, with the survey limitation above; FP-008/009 were applied to branch review and separate source/checkpoint/publication identities. FP-002 prevents claiming completed acceptance from green mechanical checks alone.
