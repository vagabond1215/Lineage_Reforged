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
