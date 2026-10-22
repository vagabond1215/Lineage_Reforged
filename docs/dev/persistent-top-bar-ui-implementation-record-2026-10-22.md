# Persistent Top-Bar UI: Bounded Implementation Record

Date: 2026-10-22. Repository: `vagabond1215/Lineage_Reforged`.
Run class: unversioned UI presentation slice. Development milestone impact: `none`. Game-version impact: `none`; `GAME_VERSION` remains `0.1.1-prealpha`, playability posture `INTEGRATED_LOOP`.

## Source and scope

- Source `master`/`origin/master`: `f56229dde859b9374a54368bd8a8fd2a9872daa1`, clean before the new `codex/persistent-top-bar-ui` branch was created. Fetch/prune was repeated before publication. The new branch started from that exact head.
- Draft design PR #5: `parallel/ui-guidance-consolidation-2026-10-21` `74aa434b9d0a0e16994484fea9296ac503ab9c1d` (merge base master, 19 unique documentation commits). Its top-bar preflight and proposed prompt agree with live `TopStatusBar`, `uiViewModel.topBarMeters`, body-state pills and the accepted UI information boundary. The proposal is not the installed combat prompt.
- Draft Character PR #7: `codex/character-first-ui` `8610260fd40a7b371a4789e954f53fc884ad71df` (merge base master, 3 unique commits). It does not overlap the top-bar source paths and retains its own authenticated selected-client hold.
- Draft nutrition PR #6: `parallel/metabolic-reserve-nourishment-ux-decision-2026-10-21` `8c7f471f3e2da3e0d940c7e23e11f40527000042` (merge base master, 9 unique documentation commits). Independent `codex/human-metabolic-reserve-contract` `80c970493c29f2f076312cad07aaf0aca121c1c7` is held. Neither is an implementation source for this slice.
- Active `DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair`, current prompt/output/handoff, owner models, save contracts, global navigation and the protected readiness/prompt-integrity refs remain untouched. No merge, rebase, branch deletion, PR advancement or Game-version decision was performed.

## Patch and owner evidence

`TopStatusBar` continues to receive the three `uiViewModel.topBarMeters` projected from `playerState.resources.hp/mp/stamina` through `InGameShell`. A dedicated top resource meter renders their exact `current / max` labels and bounded visual fill without `.forged-meter` capsules. It uses each owner-supplied color and reports the meter values to assistive technology; invalid maxima do not expose a false range.

The normal condition badge is absent. Warning and critical indicators come only from typed primary/secondary body-state pills and disclose their owner label, severity, trend and tooltip text plus existing recommended actions. Escape and Close restore focus; the disclosure resets when all alerts clear. The calendar/climate, notification and settings/save control paths remain in the bar. Calendar and condition details are scrollable and keyboard reachable on a narrow viewport. No buff catalog, nutrition reserve or combat calculation was added.

## Validation and limits

- Pre-edit regression test failed on the old permanent `Condition: Stable`/capsule presentation; after the patch, `apps/rpg-ui/tests/top-status-bar-render.test.mjs` passed **1/1** with actual demo-snapshot owner meter projection and controlled condition/edge inputs. It checks neutral omission, warning/critical labels, detail text, exact resource values, bounded fill, zero/invalid max, stamina warning, calendar/settings markup and absent fictional nutrition.
- Calendar/climate and body-state owner tests passed **16/16**. Node UI-config typecheck passed. App-local Vite production build passed. `git diff --check` passed.
- Broad UI TypeScript remains red: same-environment clean master **137** diagnostics, branch **136**, no newly introduced diagnostics. The sole removed diagnostic is the old `TopStatusBar` to `ProgressBar` exact-optional-props error. The unrelated legacy presentation test failed **1/13** on both master and branch (`MainMenuScreen` source assertion for `>Empty<`); it was not repaired in this scope.
- Controlled in-app browser fixture at desktop and **375 × 812** used actual demo-snapshot resource projection and explicitly synthetic normal/warning/critical condition inputs. Verified three accessible meters, no neutral badge, two alert buttons, keyboard Return/Escape, Close focus return, full condition detail, calendar scroll with keyboard End/Escape, notifications, settings control access and unclipped responsive resources/popup. The fixture was removed after testing. It did not use an authenticated campaign or exercise a real save action.
- `TOP_BAR_SELECTED_INTERACTION_UNVERIFIED`: no authorized authenticated selected-client session was available. Actual resource changes across a game tick, live warning transitions, shell save/load/restart and selected client responsive interaction remain the later acceptance gate. No credentials were requested, guessed, reset or bypassed.

Applicable failure pattern: `FP-001`—the test renders the actual `TopStatusBar` through `GameSessionProvider` and owner view model, and the controlled browser checks the component interactions. The authenticated `InGameShell` caller/restart portion is explicitly held, not inferred from the fixture.

## Disposition and next integration trigger

Keep this implementation PR draft. Separately obtain an authorized selected session, then verify the real shell's resource update, normal-to-alert-to-normal transition, condition/calendar/notification/settings keyboard paths, save/load/restart and narrow layout. Review the result against current master, design PR #5 and the active combat branch before integration. Character PR #7 retains its own selected acceptance gate. The next separate UI slice may address broader shell hierarchy only after these bounded owner and interaction gates are reviewed.
