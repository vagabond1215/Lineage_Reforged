# Native-v3 Harbormast passenger route evidence

Source: isolated [draft #67](https://github.com/vagabond1215/Lineage_Reforged/pull/67), implementation `a8f108c8ffa2ed7dea47b6d987d61a5cf2f83656`, child of draft #66 `05d1c8533afe2295d29808a8cd7868a3db263738`. Master observed `a596112acf3945f2bf7c625e943f2511d12aa710`; #64/#65 and the parked routes were not modified. Game `0.1.1-prealpha`. Holds: `HOLD_STAGING_PUBLICATION` and `HOLD_SELECTED_ATOMIC_ACTIVATION`.

## Implemented

- Exact authored Harbormast–Starfall passenger route, 120 ticks, no direct resource or currency debit, through the existing player travel command.
- One Starfall arrival/known-location row and the authored one-time Soundings offer through the existing offer owner inside that travel transition.
- A selected World passage button derived from owner facts. Chartered Starfall creation remains denied.
- [Focused design boundary](../design/native-v3-harbormast-starfall-passenger-passage-decision-2026-11-04.md).

## Checks

| Check | Result |
| --- | --- |
| New real-creator, selected World/travel, quest, v3 artifact preparation/readback, rejection, v2 regression | 4/4 pass; red before code repair |
| Adjacent selected gameplay/session host | 10/10 pass |
| Native gear, creator, Character reader, four-stage survey source | 20/20 pass |
| Adjacent root travel/offer/quest/ordinary survey | 25/26 pass; one characterization hash failure reproduces unchanged on exact parent |
| UI Node typecheck | Pass |
| UI broad TypeScript | Exit 2; exact parent and child each 194 diagnostic lines, zero line difference |
| Content lint | Pass, 72 files |
| Direct normal v2 Vite build | Pass, 285 client modules; shared owner change intentionally changes bundle bytes |
| Native staging Vite build | Pass, 284 modules, exact origin configured |
| `git diff --check` | Pass before documentation commit |

The failing inherited `player-travel-characterization.test.mjs` expects `87ba29b3…` for a Westreach snapshot but produces `2ed66585…` on both the parent and child. It is not evidence of a new route regression.

The complete staging output has 36 files / 31,678,238 bytes. [Per-file SHA-256 manifest](native-v3-harbormast-staging-artifact-manifest-2026-11-04.txt) digest: `01bb20fa5871ed7f1c22c4d337745a95f4616dc326a6eb61ac36cb667a48fe12`. The measured local tar is 31,708,672 bytes, SHA-256 `2b24221cefadaa6641e1f779965b19b9323eaf0b33fc53475364e8434040e136`, below 256 MiB. Against the prior 36-file staging manifest, 34 same-path files are hash-identical; `index.html` and the hashed JS asset path/content change as expected. No creator PNG copies or QA/fixture files enter the package. The 128 source creator PNGs and pinned GitHub artwork source are unchanged. This is a **new, unapproved artifact**; no publication occurred.

## Acceptance limits

Owner tests prove an executable voyage, native-v3 artifact preparation and Save reader round trip. They do not prove an authenticated browser session or durable hosted account publication. Local UI control reached a genuine creator screen, but the browser tool could not activate a visible continent card, so local end-to-end browser QA is incomplete. Private staging still serves maintenance v1 after the prior rollback. Arrival hydration reaches 0 under the existing body owner, with severe dehydration. A private selected run must evaluate its practical gameplay consequences; this implementation does not grant unsupported provisions or alter metabolism.

Applied failure patterns: FP-001 real caller and owner boundary; FP-002 source/parent evidence separation; FP-009 persistence/retry; FP-017 staging publication hold. All older drafts remain retained; no merge, rebase, retarget, deletion, Site mutation, account reset, Game-version change or protected-branch change.
