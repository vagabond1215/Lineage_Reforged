# Native v3 real creator defeat, terminal and failure gate — 2026-11-01

Source: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; exact draft #59 `760e78d9f649a6c74e5aca677e50c8b2ae9abd0b`; isolated child `codex/native-v3-selected-use-defeat-failure` code commit `a5feaaa04e4679034436469d801f936a9b687b7d`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`.

## Bounded implementation

The local development-only native candidate now exposes **Retire Character** and passes the current `EpochApp` snapshot/control/source slot/account revision/observed address to `retireNativeSelectedSession`. The existing terminal owner publishes and settles the retirement; the UI clears its observed source only after completion and returns to the account menu. The ordinary v2 retirement path is unchanged. Default native v3 review stays read-only, and normal creator entry stays v2. No new Save, item, combat, quest or terminal owner was added.

The real-creator retirement browser test was red before this binding: the selected candidate lacked an enabled retirement control. After the repair, keyboard Enter invokes the control, one confirmation is handled, the slot closes and the **same active run record** becomes archived with `archiveReason: retired`. Restart retains that history. The control fits without page-wide horizontal overflow at 375×667, 768 and 1440.

## Connected local evidence

All browser accounts are disposable local QA accounts; they use the real `EpochApp` creator controls, not preseeded character/encounter/quest state.

- A creator selection of Kaelvar → The Auric Marches → Stonevein with Hunter Bundle reaches the authored nearby encounter. A legal Short Bow action pays a retained Stamina cost. Selected combat advancement reaches an ordinary HP-zero **playable Normal defeat** at Stonevein; the one owner receipt, restored HP, resource values, physical gear and campaign publication survive Save/restart. This route passed repeatedly with randomized identities.
- Real Starfall/Hunter first publication makes a native v3 cross-slot Quick Save. Slot 1 and Quick Save retain the same campaign, exact gear and separate publication IDs after restart. A normal creator then makes a v2 campaign in slot 2 of the **same account** without altering either v3 slot.
- After a real selected Unequip, an independent account-profile owner write advances the account revision. Selected Save rejects the stale observed revision and leaves the retained slot/publication/gear unchanged. Reloading the exact campaign, repeating Unequip and Saving publishes one new descendant with the same bow ID/durability and bag location; restart reads it back. This simulates an external revision change, rather than claiming two visible browser sessions.
- The prior #59 real Starfall creator → quest → Ashen travel → four survey stages → Save/restart regression also passes on this child.

UI Node tests **100/100**, focused root gear/survey **53/53**, Node UI typecheck, content lint **72 files**, direct complete-asset Vite build and diff check passed. Broad UI TypeScript diagnostics **115/115** and workspace **763/763** match exact #59 after normalizing worktree paths; zero new diagnostics. The inherited broad UI TypeScript errors still prevent the `tsc && vite` script from being a green gate. No authenticated hosted account or production selected v3 route was used.

## Atomic disposition

**HOLD_SELECTED_ATOMIC_ACTIVATION.** Successful selected Inventory Use remains unproven through ordinary authored acquisition: none of the seven starter bundles includes an item with a supported consumable profile, and the candidate shell has no acquisition control. Do not grant a test item to pass the selected route or invent an effect. Connected selected interrupted publication before/after write, rollback/exact retry, duplicate request identity, and obsolete development-save rejection without deletion remain open. Existing owner-level tests support these fences but do not close the selected caller. Authenticated selected-client Save/restart remains held. Pending defeat may stay latent owner-tested under the approved disposition, with selected-scenario acceptance open.

Preserve Current Area/Codex Atlas authority and personally discovered map limits. No Area/Atlas implementation, browser-origin reset, obsolete-save migration, Site deployment, branch merge, parked `DEV-0.7.2.13` combat change or Game-version change occurred. Applied FP-001 (real creator/retirement red then green), FP-002 (partial gates do not accept activation), FP-005 (fresh retry after stale Save), FP-008/009 (exact stacked source), FP-011/013 (one current pair and physical gear), FP-016 (retained publication/readback), FP-017 (ordinary Use acquisition remains open).
