# Pre-Alpha Save Compatibility And Native-v3 Development Cutover Policy

Date: 2026-11-09  
Repository: `vagabond1215/Lineage_Reforged`  
Status: **OWNER_DIRECTION_RECORDED; RUNTIME_IMPLEMENTATION_AND_ACTIVATION_NOT_AUTHORIZED_BY_THIS_RECORD**  
Read-only repository checkpoint: `fcd3e56efbb52899300b1fcc39551f2d7b2110a6`.

## Product decision

**Backward compatibility with previous pre-alpha Save and account formats is not a development requirement.** Native v3 may replace the v2 development app and persistence format **without implementing a v2→v3 campaign/account converter**. A genuine fresh v3 account/campaign may be required. This is consistent with the already accepted [development-only clean epoch](development-only-clean-persistence-epoch-route-decision.md), which waived old test-data migration and did not require legacy importers. This record refines the old clean-reset *presentation*: **where technically accessible, let old accounts remain visible solely for explicit client-side deletion instead of deleting them merely because a newer app launches.** This does not turn an old account into a valid login or a playable v3 Save, and does not require maintaining old account/auth/session flows. A destructive cleanup remains an intentional user action with confirmed scope.

This policy removes *legacy preservation and migration* as generic integration blockers. It does **not** waive integrity, transactional durability, no-duplication, fail-closed reader admission, same-current-format restart/recovery, exact provenance or coherent item/currency/quest ownership for newly created v3 campaigns. Do not silently mix the v2 and v3 game/save authorities or rewrite incompatible bytes as new format. The currently installed [non-fungible gear owner cutover prompt](../dev/current-codex-prompt.md) and [Stage 2 legacy item-location decision](character-durable-item-location-stage-2-decision-2026-10-26.md) were written before this clarified v3-first integration priority; **reassess their scope explicitly** at the next authorized implementation-package selection. Do not auto-execute a broad old-save converter merely because the older prompt remains installed.

## Distinct version identities

Track and compare **different concerns** rather than equating the public release string with the data schema:

- `GAME_VERSION`: canonical player-facing game release label (currently `0.1.1-prealpha`), recorded as the Save's creation/last-write provenance where reliable.
- `saveFormatVersion` or an existing canonical equivalent: a machine-readable, monotonically governed serialization/reader format discriminator, independent of `GAME_VERSION`; use already accepted v3 artifact/store schema identities rather than inventing a parallel conflicting version owner.
- `accountFormatVersion` or existing account/epoch discriminator when needed: distinguish account/profile and campaign artifact formats. Account metadata listing does not imply campaign admission.
- `worldVersion`, campaign head/revision, immutable publication/receipt and epoch identity retain their own authorities; never relabel them to match a marketing or Game version.

Compatibility is an **explicit reader support policy keyed to actual validated format and required feature/epoch**, not an assumption that the Save's `createdWithGameVersion` must equal the current `GAME_VERSION`. A future public game-version increment alone need not invalidate Saves. No migration implementation is demanded by this pre-alpha policy.

## Fail-closed player-facing state matrix

| Observed state | Admission | UI and available next action |
| --- | --- | --- |
| Valid format that this build explicitly supports | Permit only after full account/Save validation and recovery | **Continue / Play** |
| Recognized older format outside the supported reader set | Never deserialize into live game state or silently convert | **Incompatible Save**; show recorded Save format and creating game version where reliable; offer **Delete** through owner action |
| Recognized newer/unknown format | No downgraded fallback | **Requires a newer game version** or **Unsupported Save version**; preserve bytes; allow scoped user deletion |
| Current/recognized format but malformed, inconsistent or integrity-invalid | Do not invent missing state, auto-reset, or overwrite | **Corrupted Save** or **Damaged Save** with safe explanation and scoped deletion; keep raw bytes until chosen |
| Storage permission, quota, IndexedDB blocked/unavailable, read timeout or transient I/O error | Never infer corruption or empty account list | **Unable to read Save / Retry**; preserve bytes and stop destructive actions until storage authority is reachable |
| Owner-recognized incomplete publication or recoverable interrupted operation | Retain the committed predecessor/receipts and invoke accepted recovery rules | **Recovery required** or automatic owner-verified recovery; never classify as corrupt solely for being pending |

**Deletion is optional and deliberate.** A failed Read must not silently erase an account, run-wide history, Save slot, or migration evidence. Never allow an incompatible selected Save to be loaded, quick-saved over, or promoted by creating a default snapshot.

## Client-side old-account visibility and deletion

A safe lightweight **legacy account inventory** may read only the minimum metadata necessary for display: display name/identifier where recoverable, origin/epoch provenance, recorded version(s), status and exact owned local-storage/IndexedDB record-family boundaries. Mark entries **Legacy / Incompatible / Delete only**. Do not require the old gameplay loader, old credentials, unlocks, or migration logic to function. If a safe metadata-only read cannot enumerate an old family, display a separately bounded storage-cleanup flow instead of inventing account names or silently adopting malformed records.

Deletion requires a user-selected **exact account** or clearly labeled **clear old development data for this origin**, confirmation describing the scope, a single authorized owner operation that removes only matching account/campaign indexes, artifacts and associated records, recoverable/idempotent retry where required, and **fresh readback** before reporting success. It must never remove newer v3 data, different users, other origins or an unselected Site's browser data. If an old record family cannot be reliably scoped, **do not advertise account-specific deletion**; provide a clearly bounded origin-wide option or manual browser-site-data instructions only after explaining impact.

**Browser origin constraint:** A Site at one origin cannot enumerate or delete IndexedDB/localStorage belonging to another origin. The old v2 primary Site and an independent v3 staging Site may therefore each have separate data. Closing/deleting a provider Site does not itself prove deletion of browser storage for that origin. Site project retirement remains governed by the exact-provider-ID and dependency-review [cleanup hold](../dev/native-v3-spare-staging-site-cleanup-hold-2026-11-09.md), not this Save policy.

## Native-v3 integration sequence affected by this decision

1. Reconcile stacked native-v3 code and current master on an isolated integration branch. Preserve one coherent v3 item/account/Save owner, compile and run focused owner/caller tests; do not apply a historical branch blindly to master.
2. Introduce or verify current Save/version metadata and the fail-closed status matrix, plus *metadata-only* old-account/deletion entry points where safely readable. Do not make legacy v2 gameplay/account imports or repair-by-assumption a merge gate.
3. Verify **fresh** v3 registration/creator, Equipment/Inventory/Use, Soundings payment, combat, Save/restart, stale/retry/recovery and current desktop usability. Verify intentionally incompatible/invalid Save and deletion behaviors in controlled tests. No selected account, old Save or hosted Site is mutated by this policy record.
4. After review, merge validated source into the development master with a separate decision about whether to select v3 as the default entry. Keep old-era historical evidence as documentation where necessary; no arbitrary deletion of older user data.
5. Deploy/rebind a new build only under a separate exact-source, hosting-origin and rollback authorization. Identify the redundant Site by immutable provider ID, verify it has no necessary dependency, then seek explicit approval to delete that exact Site. Do not couple PR merge and hosted Site deletion.

## Required test cases and non-goals

Minimum automated checks: supported current-format Save loads and restarts; older incompatible Save is visible but cannot Play; newer unknown version refuses safely; malformed current-format Save is labeled damaged without mutation; unavailable storage offers Retry, not Delete; recoverable pending transaction follows its existing owner; explicit delete removes only its bounded records and readback confirms; other accounts, active v3 data and wrong-origin assumptions remain untouched. Duplicate/stale commands never mint rewards or overwrite a rejected Save.

**Not required:** backward-compatible v2 execution; reconstruction of impossible old gear provenance; migration of old development campaigns; broad cross-era account import; cosmetic legacy UI; preserving obsolete test accounts indefinitely; automatic Site consolidation; new Game version.

**Precedence:** owner-directed pre-alpha compatibility/product policy here and the prior [clean-epoch decision](development-only-clean-persistence-epoch-route-decision.md) govern old data *policy*, while existing current-format persistence, recovery, versioned owner and Game-version acceptance contracts continue to govern data *integrity*. A future technical integration pass must reconcile exact current sources and choose the concrete metadata/reader/delete owner before any runtime edit or deployment.
