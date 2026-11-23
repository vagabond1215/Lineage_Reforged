# A3b Chromium matrix recheck

November 22, 2026. Unversioned World UI validation. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. Development impact `supports_current_band`, game-version impact `none`.

## Source and scope

The [independent Connector audit](https://github.com/vagabond1215/Lineage_Reforged/blob/77afc6b51e1057b1dc3b389fbf19f10417a7c925/docs/dev/ui-a3b-independent-source-and-test-coverage-connector-audit-2026-11-22.md) passed source review and identified a viewport coverage gap in the [previous Codex run](ui-a3b-functional-world-creation-receipt-2026-11-22.md). This rerun started from a clean isolated checkout of publication commit `4c38da5905f253cc704176f3f91dd7e7f44a61e6` with runtime `7a46f5771e0785ad7a2d9c1da54ccf200153eeef`. Test commit `2da1d91ab3cdd90c86054aa3cce228f7c34c7435` on `codex/a3b-chromium-matrix-2026-11-22` expands the browser harness. Git comparison found no deltas in application, owner, build, content or manifest paths against the reviewed runtime.

The expanded matrix covers 1440, 1280, 768, 375 and 320 px at 800 px height in both themes, plus 320×568, 375×667 and landscape 667×375 in both themes. Each case exercises Classic/Preview switching, focus on the World Library and Creator headings, keyboard Tab to the visible Create button, keyboard submission, verified owner readback and restart. The harness also compares the stores outside the World/receipt pair and checks compatibility launcher entry.

## Execution

- Built ordinary Vite and `--mode world-owner-review` using the same reviewed sources. For the owner harness, the temporary exact v7 test fixture came from `aae4d65cdc65482032d62acef74316ed59c1eacf` and was removed after the build. The native-staging Vite build used a disposable HTTPS origin and was not published.
- Served the compiled clients on two registered loopback ports. Ran `apps/rpg-ui/tests/first-world-a3b-ui-browser-qa.py` and `apps/rpg-ui/tests/first-world-a2b-browser-qa.py` with `--review-origin http://127.0.0.1:53233 --ordinary-origin http://127.0.0.1:53234` and matching task-owned origin environment variables. Browser engine Chromium Headless Shell 159.0.8154.6 via Playwright 1.65.2, using disposable browser contexts.
- All 37 focused Node tests passed. Node UI typecheck and no-new-hex checks passed. Source verification matched all 55 exact identities, including the historic registry producer. A direct HTTP read compared each of the 22 served canonical assets byte for byte against its pinned Git blob on both origins.
- Fresh `npm --prefix apps/rpg-ui run typecheck -- --pretty false --incremental false` diagnostics were byte-for-byte identical to the previous A3b result. Both had 183 diagnostics and SHA-256 `9b7d269e244352f4d178c5c6501238bffea65188a746fcff3995cd4370c07a67`. `npm run ui:build` exited 2 on those diagnostics. The ordinary, compiled review, and native-staging direct Vite builds passed.

## Results

**All 16 viewport/theme combinations passed.** At every size the keyboard-focused Create button reached the viewport before submission. World creation modified only the World and receipt stores. The reopened card retained the same World ID and enforced the one-World quota. Both short-height portrait layouts and the landscape layout passed in dark and light themes.

The compiled UI suite also passed remembered-session reauthentication, cross-tab sign-out, stale account generation, missing and tampered source, missing receipt, transaction abort and quota failures, lost acknowledgement with exact retry, double submit, competing tabs, separate accounts, v8 backup restore and Classic default admission. The separate owner suite passed exact v7 migration/restore and v8 archive round-trip with native-v3 ready and retired Save histories. The compact archive pair added 50,251 UTF-8 bytes and rebuilt to projection `sha256:9d53637185c5e6e69649177619269bc7fedac55c91fd83b2428563fd44aba062`.

FP-001/017 are covered by real compiled splash-to-World calls. FP-004/005/018/019 are covered by the owner transaction, retry, stale-session and full-graph checks. FP-009 is covered by the exact audited runtime and separate test commit. FP-011/014 are covered by pinned asset delivery, reconstruction and failure cases. FP-002/010 preserve the broader owner and rollout gates. The Connector supplied the independent source review, and this Codex run supplies the fresh browser evidence.

Both registered loopback servers stopped. Listener and task Chromium process verification found none remaining.

## Review boundary

Master `20abe83c`, draft PR #102 `e74f9e14`, draft PR #103 `d6fb21d3`, the A3a UI topic `7624adc2`, and the original A3b integration `4c38da59` are separate retained refs. No integration, activation, branch retirement or deletion is due. An explicit owner decision is required before integrating the World owner or changing rollout status. World-to-Save linkage, Family Library, broader gameplay and game-version advancement remain held.
