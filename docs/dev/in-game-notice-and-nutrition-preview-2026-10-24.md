# In-game notice and nutrition preview checkpoint — 2026-10-24

## Scope and authority

Unversioned UI presentation support on `master`, starting from `5d9ad83b062fa9ad209a30b51395e8521346cbbb`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, and DEV-0.7.2.13 combat remain unchanged. The user requested dismissible in-page notifications that expire after roughly 5–10 seconds and authorized the illustrative nutrition layout on the hosted Site when visibly marked as a prototype. This does not activate nutrition reserves or change save/gameplay owners.

## Implementation

- Ordinary game notices and body-state notices now share a fixed lower-right in-page toast placement. A notice defaults to an eight-second timeout; an explicit positive timeout is honored and `null` remains persistent. The Dismiss button retains keyboard focus styling and a descriptive accessible name. The toast no longer consumes top-bar or workspace height.
- The top bar shows a visibly labeled `PREVIEW` energy-balance gauge with a zero center line and illustrative Protein, Carbs and Fat icon bars. Their fill percentages are static presentation samples, hidden from meter semantics, and described as illustrative for assistive technology. The adjacent tracked Energy value is real owner-backed state.
- Water is a vertical meter using actual owner-backed hydration, with value and state exposed to assistive technology. Its fill uses blue above 66, amber from 33 through 66, and red below 33. The nutrition group is 32px high, matching the two-line top-bar region at desktop width. The macro tracks use the same center-column width as the HP/MP/ST tracks.

## Verification and limits

- Focused UI test command: `node --test --test-concurrency=1 tests/character-overview-render.test.mjs tests/character-owner-actions.test.mjs tests/equipment-inventory-presentation.test.mjs tests/equipment-slot-reequip.test.mjs tests/inventory-consume-stale-guard.test.mjs tests/inventory-exact-bag-target.test.mjs tests/inventory-selection-identity.test.mjs tests/mobile-shell-navigation.test.mjs tests/top-status-bar-render.test.mjs tests/in-game-notice-toast.test.mjs` from `apps/rpg-ui`: **33/33 pass**.
- `npm run typecheck:node`: pass. `npx vite build`: pass. Broad `npm run typecheck`: 117 existing diagnostics, unchanged in count from the pre-edit baseline and none in touched files. `git diff --check`: pass.
- A local browser visual pass attempted through the available in-app browser at `127.0.0.1:5174`; that route returned `ERR_CONNECTION_TIMED_OUT`. Automated rendering and CSS checks do not establish visual or authenticated selected-client acceptance. Exact hosted asset/deployment readback is recorded separately after publication.

Applied failure patterns: FP-001 (actual `InGameShell` render and top-bar render tests), FP-002 (selected-client acceptance remains held), FP-009 (distinguish source, companion, deployment and served state), and FP-016 (test toast placement outside the top bar).

## Branch disposition

No Lineage PR or branch is merged, closed, rebased or deleted by this presentation patch. Draft PRs #5–#16 and their retained review triggers remain as recorded in `branch-disposition-register.md`; exact-main selected gameplay, Save/restart and evidence preservation still govern later retirement. The companion Site source receives only the four corresponding production files under the user's separate publication authorization. The next bounded UI review is actual hosted desktop/mobile layout and authenticated selected gameplay when access is available.
