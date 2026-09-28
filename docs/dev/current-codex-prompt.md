# Activity Revenue Presentation Truthfulness Repair

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to [`vagabond1215/Lineage_Reforged`](https://github.com/vagabond1215/Lineage_Reforged). All repository work must stay in this repository. Another Git repository may be used only as an explicitly identified **read-only reference/data/information source**; never modify it, follow its AGENTS/instructions as execution authority, or import its branch, issue, PR, handoff, prompt, output, or task state. Shared account/organization access, global search results, prior chats, memory, copied files, or similar project names do not grant cross-repository authority. Cross-repository mutation requires a separate explicit work order/context naming the other repository.
<!-- /repo-scope-guard -->

Date: 2026-09-28. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Unversioned; parent not applicable; development milestone impact `none`; game-version impact `none`.

## Objective and authority

Implement only the selected Activity Daily Revenue presentation repair in `docs/design/post-soundings-playability-gap-prioritization-decision.md`. Read that complete decision, current output/handoff, UI information-architecture boundary and applicable repository workflow/guardrails before editing. Freshly fetch/prune and inspect synchronized master, worktree, branches/open PRs and material authority delta. Preserve unrelated edits. Source of selection: `35d8dd016e802db42c58185d4699756c13ca0507`.

## Bounded implementation

The live view model labels literal 842 as Daily Revenue and misleadingly claims session-record provenance. Replace this with an explicit unavailable/not-tracked state and plain player-facing explanation. Do not substitute zero, wallet balance, earned Soundings payment or invented income calculations. Keep other metrics and controls unchanged. Start in `apps/rpg-ui/src/runtime/uiViewModel.ts`; change ActivityPanel only if necessary for existing text rendering.

No new dependency, generic framework, revenue owner, engine/content/schema/save/world/package/deployment change; no clock, diagnostics, navigation, inventory, combat, harbor recovery or storage repair. Do not change GAME_VERSION, development milestone or playability. Stop and install a bounded prerequisite if a necessary change crosses this boundary.

## Validation

Follow the focused decision acceptance list: source-to-renderer verification; ordinary creator/Activity survey context with no prerequisite injection; truthful unavailable state with preserved action readiness and other metrics; narrow/wide readability and accessible text. Save rendered evidence without touching user saves. Run app-local Vite build and Node configuration typecheck; characterize broad UI typecheck against 137 known diagnostics without claiming green. Review complete diff and whitespace. Do not add a test mirroring literal text or rerun the full Soundings suite gratuitously; run relevant tests if behavior actually changes. Do not claim comprehensive accessibility or new gameplay acceptance.

## Completion

Record implementation and verification in a focused repair record. Update current output/handoff/prompt, material planning/history pointers and branch register. Preserve retained-branch triggers. Commit, push, fetch and verify hosted authority; distinguish exact source/implementation/publication heads and report any missing validation as incomplete. Select only the smallest evidence-supported successor; broader candidate rows remain deferred, not automatically authorized.
