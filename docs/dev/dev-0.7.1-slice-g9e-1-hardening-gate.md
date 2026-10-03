# DEV-0.7.1 Slice G9E.1 — Slot Generation Hardening Gate

Date: 2026-10-02. Source: hosted `master` after G9E implementation commit `618c8e5dfe4aac961467df92e9e08f3064273a0b` and hosted readback `3335261c6e700e711aa688ebb931af0d3f7ac2f5`. Internal support slice of planned primary `DEV-0.7.1`; G9F, G10, parent acceptance, deployment and Game-version change remain held until this gate is closed.

## Closure — 2026-10-03

**G9E_1_HARDENING_VERIFIED; G9F_NEXT; ACTIVATION_HELD.** Starting from synchronized hosted `master` `2614b788`, the focused QA now rejects an accepted envelope/recovery `generationId` as a slot-generation CAS identity. A published, witnessed two-address v5 campaign upgrades to ready v6 with its first recovery, consumer receipts, artifact, control and witness retained through restart; disagreeing migration aborts. Two-address terminal cleanup rolled back at all eight transactional writes under both abort and quota injection, then completed on exact retry after restart. A separate lost post-commit readback retained the same closure marker, two receipts and account revision without duplicate mutation. The selected App refreshes inventory before its delete notice: an exact old-generation retry after Slot 1 reuse reported the newer occupant, while current deletion reported empty. Synthetic QA accounts were used; no user campaign was changed.

Fresh native Chromium G9E **13/13**, hardened G9D **14/14** and adjacent owner/browser **130/130** passed. Selected-App old-generation exact retry, current deletion and retirement were exercised. Focused campaign/Soundings/survey Node suites passed **174/174**; Node UI-config typecheck, app-local Vite build and diff check passed. Broad UI typecheck retained **137 known diagnostics**, none in the changed App file. Full workspace `npm test` was not used as a green gate under the validation matrix. The accepted G9F prompt is reinstalled only after this gate; G9F implementation has not begun. G10, parent acceptance, deployment and Game-version change remain held.

## Initial disposition — 2026-10-02

**G9E_IMPLEMENTATION_RETAINED; G9E_1_HARDENING_REQUIRED_BEFORE_G9F.** Do not unwind the additive v6 design. The inspected implementation follows the accepted campaign-keyed first-authority and slot-generation architecture, retains historical evidence, supports physical-slot reuse, closes terminal addresses after settlement and preserves archival-retirement semantics. The remaining work is a narrow hardening pass, not a schema redesign.

## Required hardening

1. Prove the authority identity boundary directly. `slotGenerationId` is one physical-slot occupancy identity and must remain distinct from save/publication `generationId`. Add focused QA that reads actual accepted envelope/recovery `generationId` values and asserts they cannot satisfy slot-generation CAS. Do not substitute artifact ID, campaign ID or publication ID for this proof.
2. Add a real published v5-to-v6 migration case, not only a prepared-attempt case. Seed a valid v5 account with completed first publication authority, control, address and consumer receipts; preferably include a second address when practical. Upgrade to v6 and prove current ready readback, campaign-keyed historical first recovery, pointer identity, retained immutable artifact/control/witness evidence and restart. Malformed/disagreeing migration must still abort.
3. Expand terminal-cleanup fault injection across every write in the multi-address transaction. Two-address closure currently performs account write + three writes per address + terminal-recovery write, so exercise all write positions, not only the one-address five-write boundary. Every abort/quota fault must preserve the pre-closure closed campaign and permit exact retry.
4. Add a distinct lost post-commit readback case for terminal address closure. Fail only after the terminal-closure transaction has durably committed, then reopen/retry and prove the same completed `addressClosure`, receipts and account revision are retained without duplicate mutation.
5. Correct selected-App stale deletion presentation. An exact historical `same_source_retry` for an old slot generation can coexist with a newer campaign occupying the same physical slot. The UI must not unconditionally report that the physical slot is empty. After deletion/retry, refresh authoritative inventory and report a message consistent with the observed current slot state.
6. Repair current coordination ordering. `current-codex-output.md` and `current-gpt-handoff.md` currently open with the older G9E prerequisite / `DELETION_HELD` entry even though later entries record G9E completion. Make the current top entry reflect `G9E_SLOT_GENERATION_AND_ADDRESS_DELETION_VERIFIED; G9E_1_HARDENING; G9F_HELD` while preserving chronology below.

## Verification

Run focused native G9E QA including the new cases, hardened G9D terminal QA, adjacent owner/browser suites and the selected-App deletion/retirement cases. Re-run the focused campaign/Soundings/survey Node suites, Node UI-config typecheck, app-local Vite build and broad UI baseline characterization. Do not treat the repository-wide `npm test` command as a universal green gate; if run, report it under the repository validation matrix and do not claim a pass unless it actually meets the applicable baseline.

G9F may begin only after the new focused cases pass and the current routing documents agree that G9E.1 is closed. No account reset/delete implementation belongs in this hardening pass.
