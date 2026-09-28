# Independent ordinary browser evidence

Execution began September 25 and completed September 28, 2026. Source `567d250cae46a43c1c87123d63478aa9f47183f9`; runtime `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`. Production remained unchanged. A Vite server from `apps/rpg-ui` served a separate origin, `http://127.0.0.1:5201/`, leaving the preexisting 5198 origin untouched.

All prerequisites came through visible ordinary UI controls. No save editing, prerequisite injection or direct command invocation was used in this browser flow. The disposable local account was F3 Independent Audit; character F3 Surveyor, Human, Workshop-Raised, Traveler, Myridian Chain / Starfall Isle / Starfall Port. Observations below came from browser accessibility and DOM snapshots during interaction, not inferred from unit tests.

| Checkpoint | Observed result |
| --- | --- |
| Creator and Begin Journey | Slot 1 created; tick 0; wallet 16g 8s 0c. |
| Contracts / Accept Contract | One Soundings offer; becomes Active 1 / Tracked 1. Four-shift prerequisite blocks submission. |
| Travel to Ashen | Ordinary risk confirmation; arrives at Ashen and survey activity activates. |
| First two shifts | Two risk confirmations; two sectors retained, next stage sector 3. Explicit Save reports All Changes Saved. |
| Restart across interruption | New browser session and server restart; ordinary sign-in/Continue loads tick 8, 16g 8s, two completed sectors and next stage sector 3. |
| Final two shifts | Sector 3 then ruins confirmation; Survey Packet Ready, Advance Shift disabled. |
| Ashen submission blocker | Submit Soundings disabled; return-to-Starfall guidance states 5 gold. |
| Return | Character tick 12 before, 16 after; wallet stays 16g 8s 0c. Travel Chronicle says 4 ticks. |
| Submission | Enabled at Starfall; immediate Soundings completed — 5 gold received. Completed 1, Tracked 0, Active 0; Submit disabled. |
| Payment and history | Wallet 21g 8s 0c, tick 16. One completion Chronicle row, Soundings submitted at Starfall, with +5 gold and office acceptance. |
| Explicit save and browser reload | Save successful. Fresh sign-in shows Slot 1 at Harbormaster's Office, 21g 8s and 16 ticks. Continue loads correctly. Completed 1 / Tracked 0 persist; completed quest says pays once and Submit remains disabled. Exactly one completion-row button counted. |
| Later ordinary play | After another browser/server interruption, loaded the same completed save; ordinary confirmed travel to Ashen succeeds. Explicit Save reports All Changes Saved at September 28, 10:29 AM. |

Result: **ORDINARY_BROWSER_FLOW_PASS**. No observed storage/quota error. Every-write bounded UTF-16 measurement is separate executable evidence in `storage-d/README.md`; browser storage internals were not read or injected. The interruption before later-travel confirmation did not establish accepted travel, so it was retried from the last verified durable save and completed.

Observed nonblocking presentation debt remains: diagnostic/Window Standards panels, Daily Revenue 842 with no business records, and Unknown Watch after later travel. These were not repaired or promoted into canonical earnings/time facts. This is not a comprehensive accessibility, balance, long-campaign capacity or defeat-recovery browser audit. The test-only account/save is retained on the isolated origin; user saves were preserved.
