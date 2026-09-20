# Soundings Durable Completion Implementation Record

Date: 2026-09-18

Repository: `vagabond1215/Lineage_Reforged` only.

Run: Soundings Return, Submission, Payment, And Durable Completion Implementation.

Disposition: `IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE`.

Label class: unversioned bounded implementation; parent decision: Quest Turn-In Completion And Consequence Receipt Owner Contract Decision. Development milestone impact: `supports_current_band`; game-version impact: `none`. Accepted milestone remains `DEV-0.7.0`, current band `DEV-0.7.x`, Game `0.1.0-prealpha`, playability `INTEGRATED_LOOP`. No `DEV-0.7.1` allocation or game-version acceptance decision.

## Authority And Source

Controlling authorities are `AGENTS.md`, the repository-first protocol, authored terms in `soundings-return-submission-and-payment-authored-terms-decision.md`, the accepted `quest-turn-in-completion-and-consequence-receipt-owner-contract-decision.md`, and `ui-information-architecture-boundary.md`.

Recorded decision source: `85747b5fbd2202d2730e6fa27b4547d78423a46c`. Initial synchronized implementation head: `0dfa6835521e60ba3c0ab21888342b5a00ccac1f`. Resumed inspected head: `9bc128c11ff561281a0ba2665efb20cec8c7d108`. Intervening drift was documentation routing, explicit reward/readiness reconciliation, and repository scope banners; no conflicting runtime/owner change. Completed DEV-0.7.0 orientation was reused. Saved implementation edits were preserved across interruptions. The September 18 fetch/prune confirmed local/tracking equality at the inspected head before completion.

Publication identities are recorded in the publication appendix of current output and this record after the implementation commit is created; they must not be confused with these source heads.

## Implemented Boundary

- Existing travel remains the clock/body/movement owner. Only Ashen Reef to Starfall gets the derived four-tick maritime return, no fare and no new knowledge grant. Unrelated origins do not acquire a universal Starfall route.
- The quest-specific `player-soundings-turn-in` owner prepares a stable request and canonical normalized intent, validates the campaign/session and complete four-shift graph, and commits through prepared campaign admission.
- Optional version-one `authorityLedger.soundingsTurnIn` retains one request, occurrence and result plus seven linked consequence receipts. The currency-credit receipt records exactly five gold and zero silver; no standing, fame/reputation, skill, inventory, service or salvage reward is authored.
- The accepted transaction completes Soundings, clears tracking only when Soundings was tracked, removes its operation, changes current activity, and writes one completion Chronicle and notification. It preserves survey authority and Stormglass. The legacy Soundings UI mutation is unreachable and rejects direct use; Rivet behavior remains separate.
- Duplicate classification follows deep authority validation and returns the latest snapshot. Missing or misplaced completion projections are derived from retained receipts and repaired through admitted retry or normal synchronization, with no payment replay. Conflicting rows reject. Repair preserves opaque row order and does not evict rows from full feeds; an explicit retry with a full repair destination fails unchanged. Ordinary synchronization skips full destinations so feed trimming cannot freeze unrelated accepted play; this continuation is tested.
- `GameSessionContext` applies only accepted caller state. Quests uses the authoritative blocker/action; World disables unavailable travel. Current journal synchronization uses the same Starfall readiness resolver.
- Current authored presentation is survey-content version three, including offer, demo, journal, final packet notification and quest-definition prose. Version-one/two retained evidence is unchanged. No save/world version migration, dependencies or broad shell redesign was needed. The static quest's generic `coinBase` remains unspecified because it does not encode the accepted gold denomination; exact payment is expressed by the typed runtime consequence and authored note.

## Storage Failure Found And Closed

The first browser run reached successful submission, but publication/restart exposed a local-storage quota failure. An unlimited test store had hidden repeated full survey graphs inside the new intent. The preliminary ledger was about 869 KB and the tested publication sequence used about 9.4 MB of UTF-16 storage.

The final intent keeps the survey graph only in its existing owner, fingerprints both survey and snapshot with synchronous SHA-256, and retains the other original snapshot facts needed for independent before-state validation. Validation reconstructs the original source with the exact preserved survey graph and checks its fingerprint and semantic campaign validity. Normalized intent serialization remains recursively key ordered. The dedicated digest implementation is checked against Node crypto for empty, ordinary, Unicode, padding boundaries, and one-million-byte input.

The measured final ledger was about 69 KB; the same publication/restart sequence used about 3.1 MB. The ordinary end-to-end integration now enforces a 5 MiB store limit. A separate fresh browser origin reproduced successful completion publication, restart, continued travel and another save. This is evidence for the bounded tested sequence, not a claim of unlimited campaign history capacity.

## Executable Validation

The following combined Node test group passed **123/123**:

```powershell
node --test tests/unit/player-soundings-turn-in.test.mjs tests/unit/player-soundings-turn-in-persistence.test.mjs tests/integration/soundings-durable-completion-ordinary.test.mjs tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/ashen-reef-survey-travel-access.test.mjs tests/unit/soundings-return-travel.test.mjs tests/unit/player-survey-activity-advancement-command.test.mjs tests/unit/player-survey-activity-advancement-persistence.test.mjs tests/unit/player-survey-activity-advancement-characterization.test.mjs tests/unit/campaign-persistence-foundation.test.mjs tests/unit/ashen-reef-survey-authored-content.test.mjs tests/unit/ashen-reef-survey-offer-staging.test.mjs
```

Other checks:

- `npm run typecheck:ui:node`: passed.
- `npm run typecheck:ui`: non-green, **137 diagnostics**, identical diagnostic signatures to `.tmp-dev070-ui-typecheck.log` after normalizing line/column locations. QuestsPanel and WorldPanel each retain two existing strict-optional prop errors; no new diagnostic signatures and none in the new owner/caller/fingerprint modules. Broad cleanup remains deferred.
- `npm run tool:content-lint`: passed, **71 files**.
- From `apps/rpg-ui`, `node node_modules/vite/bin/vite.js build`: passed, **214 client modules**. Existing stale Browserslist and large-bundle warnings remain.
- `git diff --check`: passed. Public engine export and TS/JS re-export bridges included. No generated build outputs staged.

### Ordinary Browser Evidence

Fresh local account/character, Human / Workshop-Raised / Traveler / Starfall Port, no injected eligibility or developer fixture. Starting wallet **16g 8s 0c**. Accepted Soundings, traveled to Ashen, advanced two shifts, explicitly saved, reloaded and continued; completed the remaining shifts. At Ashen, submission was disabled and the packet-ready blocker directed return to Starfall. Travel returned to the Harbormaster's Office. Submission completed immediately, clearing tracking and showing **5 gold received**; wallet became **21g 8s 0c**. Chronicle showed one `Soundings submitted at Starfall`, at tick **16**, payment **+5 gold**. Saved and restarted: slot retained 21g 8s at tick 16; completed quest and Chronicle persisted; Submit stayed disabled. Further Ashen travel and explicit saving succeeded. Executable tests separately exercised direct duplicate commands after restart and after later travel because the ordinary completed UI correctly disables resubmission.

### Failure And Guardrail Matrix

| Boundary / guardrail | Evidence |
| --- | --- |
| FP-001 / FP-017: real caller and ordinary reachability | Fresh browser flow plus creator/publication/acceptance/travel/four shifts/caller integration without injected prerequisites; UI accepted-only source guards. |
| FP-002: implementation is not independent acceptance | Separate successor audit installed. Lower-level green tests did not conceal the browser quota failure; it was reproduced and repaired before disposition. |
| FP-009 / FP-008: source/publication and branch boundaries | Exact inspected heads above; retained branches reviewed without integration/deletion; publication appendix separately records committed/remote identities. |
| FP-013: nested authority preservation | Absent-ledger compatibility, serialization, publication/restart, first non-head submission, later non-head travel fork, defeat-ledger rewrite, later travel and repeated publication preserve exact nested receipts. Existing campaign/survey regressions remain green. No migration rewrite is introduced. |
| FP-014 / FP-015: semantic validation | Malformed command, wrong account/player/campaign, stale intent, missing/inactive/consumed quest, incomplete/deeply malformed survey, pending/conflicting correction, forged result/currency/receipt identity and recomputed strings reject unchanged before duplicate or payment. Retained source fingerprint independently binds before facts. Prepared admission rejects an extra wallet credit. |
| FP-012: durable duplicate | Exact request, restarted request and later-state request return latest state with no reward replay; conflicting intent rejects. |
| FP-016: projections | Missing-row restart repair, byte-correct misplaced-row convergence, repeated duplicate and full-feed no-eviction rejection preserve payment and authority. |

## Branch Review And Limits

September 18: one local branch (`master`), four hosted branches total, zero open PRs. Non-default heads are unchanged: protected readiness `59c103c3a06d55f35bffa735fd4b7814dffb583e`, protected prompt-integrity `58a34e37ee531aa1f6c87086b4a4a6d20d571f9f`, and held administration evidence `210df5bcc017a8f31d621a553b5496c668540d29`. No branch actions due or performed; exact triggers remain in the branch register.

Local implementation/validation used the authenticated checkout, shell, GitHub readback and in-app browser. Bounded owner/test agents contributed before interruption; the coordinating run inspected and validated the final shared files. This is not an independent audit. Hosted CI and unlimited-save retention are not claimed. Follow the separately installed **Soundings Durable Completion Independent Acceptance Audit**; broad UI redesign, generic reward architecture, future content and version advancement remain deferred.

## Publication Checkpoint — 2026-09-18

Implementation commit: `af0954c294d222bc1f8667266e4549b8619d5484`. Pushed to origin/master; fetch/prune confirmed HEAD = origin/master with 0 ahead / 0 behind and clean tracked/untracked status. Hosted GitHub retrieval matched local Git blobs for current prompt `ac85ad8d167eb95945373c0bcedb86b5435067ca`, current output `69df23f3ea75bf44b6de283d0271f4aab4908196`, and handoff `99394fceb1d6384b00c737c2ef9a6c69ba9eba7d` at that implementation head.

This follow-up publication-record commit changes documentation only and pins the audit source to the implementation SHA. Its exact identity is the commit containing this appendix (resolve with git log -1 -- docs/dev/current-codex-output.md), separate from the tested implementation. Final post-push fetch, hosted readback and clean status are reported in the completion message; no self-referential commit identity is fabricated.
