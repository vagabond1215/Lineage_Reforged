# Dismissible notices across the active app — 2026-10-24

## Scope

Unversioned support pass on `master` from `4d128c651f52ee50c788c27c0439ac10fc56f5a9`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, DEV-0.7.2.13 combat, SaveSnapshot and gameplay owners remain unchanged. This completes the user's in-page dismissible-notification request for the active Epoch app beyond the already deployed in-game toast.

## Caller and repair

`EpochApp` routes the same `GameShellNotice` to Account Access, Main Menu, Character Creation, Load Game, Settings and InGameShell. The previous pass converted only InGameShell; the other screens still received the notice as a permanent inline banner. The active root now withholds inline notices from non-game screens and renders their notice in a shared fixed toast. InGameShell uses that same presentation component for ordinary and body-state notices. The notice owner and reducer are unchanged.

The shared toast defaults to eight seconds, honors a positive explicit timeout, and honors `null` persistence. It pauses while hovered or focused and restarts the bounded interval after interaction ends. The existing Dismiss control remains keyboard operable with a descriptive accessible name; danger notices retain alert semantics. The temporary saving badge moves to the lower left so it does not cover the toast. No notification history or action result is fabricated.

## Checks and limits

- Focused UI suite covering Character, equipment/inventory owner actions, shell/navigation, top bar and notice rendering: **34/34 pass**.
- `npm run typecheck:node`: pass. `npx vite build`: pass. Broad `npm run typecheck`: **117 diagnostics**, the same count as the prior master baseline, with zero in touched files. `git diff --check`: pass.
- A disposable local notice fixture was attempted through the in-app browser at `127.0.0.1:5173`; the browser returned `ERR_CONNECTION_TIMED_OUT`. The fixture and server were removed. The previously published hosted app opens at Account Login, so authenticated selected notice interactions and Save/restart remain unverified. These controlled tests do not establish selected-client acceptance.
- Failure patterns: FP-001 (active `EpochApp` caller trace and real `InGameShell` render), FP-002 (selected acceptance hold), FP-009 (distinguish local/source/deployed identities), FP-016 (popup placement and saving-status overlap).

## Branch and publication

Fetched/pruned and reconfirmed the twelve open Lineage PRs #5–#16. This bounded notice pass does not consume any retained branch/PR review or deletion trigger. No PR merge, retarget, closure, branch deletion, schema or version change is due. The separately authorized companion Site source may receive only the exact matching production files from this pass; record its source SHA, archive and Sites version after publication.

## Publication readback

- Lineage implementation commit `e555c569c33d0fe7b798d3b10be380b5473d847d` was pushed to `origin/master` and read back exactly.
- The separately authorized companion Site source began at remote `b5b78531754bb9bed3d498f61fc7987865d3a280`. Only `EpochApp.tsx`, `InGameShell.tsx` and new `NoticeToast.tsx` were copied; their Git blobs match the Lineage implementation commit. Companion commit `dfb74ac9d2fc102888e43070d441ad4f820abd6d` was pushed and read back exactly.
- Companion Node typecheck and Vite build passed. The emitted `index-CIueNr_4.js` SHA-256 matches the Lineage build (`95C9ECFF6544C81352B6B1FF85299513BF0E317B86568F27E2988E49DE19E383`). The archive contains the client bundle, index and hosting manifest.
- Sites saved **version 6** from that exact companion commit and reported deployment `appgdep_6add105a72c881918a4a06390a2024bd` **succeeded** at `https://lineage-reforged-preview.vagabond1215.chatgpt.site`. Saved-version readback confirmed the same source SHA and archive-backed version. Authenticated selected notice timing remains a separate hold.
