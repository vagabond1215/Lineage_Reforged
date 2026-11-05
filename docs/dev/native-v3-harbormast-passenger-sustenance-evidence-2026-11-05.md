# Native-v3 Harbormast passenger sustenance evidence

Source: draft [#68](https://github.com/vagabond1215/Lineage_Reforged/pull/68), isolated child of exact draft #67 `747bd6cba50370c7891a72d6f2b958d1df1d8e2d`. Implementation commit `6f6f5c7efb67c10a754f7e20447bd2c02ecf23b9`. Master observed `a596112acf3945f2bf7c625e943f2511d12aa710`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`. [Focused decision](../design/native-v3-harbormast-passenger-sustenance-decision-2026-11-05.md).

## Implemented and measured

- Only the admitted Harbormast-to-Starfall passenger transition applies the vessel service: four clock-anchored opportunities per 24 ticks, 20 over 120 ticks. Nominal total: 500 calories, 90 protein, 200 carbohydrates, 100 fat and 360 hydration. Day-one through day-five 23rd-tick counters each show 100/18/40/20/72; daily rollover resets them. Departure at tick five yields 75 calories on its first partial day, 100 on each four complete middle days and 25 on its final partial day.
- Preview and accepted execution produce identical final body state. Fresh Human/Local/Hunter hydration 80 to about 89, optimal at arrival; protein and energy remain supported. Fatigue debt 10 to 10. HP 132 to 132 and MP 72 to 72; Stamina 99 to 104 is the existing body-derived resource-maxima projection, not direct cost or special recovery. Gear, currency, inventory and one Soundings offer are conserved.
- No body, item, account or Save schema change. Existing passive body losses, lineage metabolic factors, difficulty and daily rollover remain. No recovery context, invented inventory Use or general sea-travel rule.

## Verification

| Check | Result |
| --- | --- |
| Red-before-green real creator/selected World passage | Before: daily calories 0 versus expected 100; after: 6/6 pass, including 20-service total, offset schedule, lineage math, rejects, v2 and native Save reader |
| Adjacent root travel/offer/access | 15/15 pass |
| Adjacent selected host and survey source | 17/17 pass; two parallel Vite tests reported a harmless shared WebSocket-port warning |
| UI Node typecheck | Pass |
| UI broad TypeScript | Exit 2; exact #67 parent and child each 194 diagnostic lines, text-identical; zero delta |
| Content lint | Pass, 72 files |
| Direct normal v2 Vite build | Pass, 285 client modules |
| Optimized native staging Vite build | Pass, 284 modules; exact distinct origin configured |
| `git diff --check` | Pass |

Complete staging output: 36 files, 31,678,657 bytes. [Per-file SHA-256 manifest](native-v3-passenger-sustenance-artifact-manifest-2026-11-05.txt) digest `621201b51ffc32f3fb145c21575437231edec4385f4793cae93840d0a28a60a9`. Measured local tar: 31,708,672 bytes, SHA-256 `f38959902b9e650e4f3bfe6076d88a9b9a7a0095010895de005f50401a610733`, below 256 MiB. The previous #67 manifest was independently recomputed from its 36-file output and matched `01bb20fa5871ed7f1c22c4d337745a95f4616dc326a6eb61ac36cb667a48fe12`. Against that parent, 34 same-path files are hash-identical; only `index.html` and the hashed JavaScript asset change. No creator PNG copies, QA entrypoint or synthetic fixture entered the new package. The original 128 source PNGs and pinned GitHub source commit `712982fbf72b158280df0ac89dc903d3b1832ab4` were not changed.

## Acceptance boundary

The tests cover actual creator and selected owner calls plus controlled Save reader/artifact round trips. They do not prove publication to the private Site, authenticated browser actions, durable hosted account Save/restart, or hosted survival and quest continuation. The private staging Site remains on maintenance v1; production v2 Site and accounts were not touched. The new artifact is unpublished and **not approved for publication**. `HOLD_STAGING_PUBLICATION` and `HOLD_SELECTED_ATOMIC_ACTIVATION` remain.

Applied failure patterns: FP-001 real selected caller; FP-002 automated results do not close hosted acceptance; FP-005/009 stale, retry and exact source identity; FP-017 ordinary fresh creator reachability. Drafts #64–#67 and parked/protected work remain retained. No integration, merge, rebase, retarget, closure or branch deletion was performed. Review trigger: exact draft #68 review, separate owner approval naming this manifest and private target, then authenticated selected-client acceptance.
