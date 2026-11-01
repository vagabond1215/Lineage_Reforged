# T7: Chronicle, Heir Handoff, World History and Private Memory Source Boundary

Date: 2026-11-01 (America/New_York)
Status: **CONNECTOR-SAFE TARGETED SOURCE-TO-CONSUMER PREFLIGHT COMPLETE / NO RUNTIME, SAVE, HEIR OR UI CHANGE**.
Scope: one new narrow source-driven T7 pass triggered by the user's **universal World Save, world runtime first, character/heir second** direction. T7 is the run-end and Chronicle **read-only UI/authority** lane, not T8's world persistence, T2's cartography, or an initiative to generate unretained story events.
Home: held draft [PR #24](https://github.com/vagabond1215/Lineage_Reforged/pull/24), [live cross-PR register](../dev/connector-safe-parallel-progression-register-2026-10-31.md).
Selection boundary: `master` `a596112acf3945f2bf7c625e943f2511d12aa710` (not active native-v3 draft PR #57). No test suite was run by connector.

## 1. Named consumer and why this is new evidence, not T8 duplication

User direction on held PR #46 is to **load one persistent world and its authoritative simulation first, then attach an authorized character or heir to that world**. See [world-first and heir World Save topology](https://github.com/vagabond1215/Lineage_Reforged/blob/f4aaf24d19de768b4be154f85773e7532c450359/docs/design/universal-world-save-heir-handoff-and-living-world-continuity-proposal-2026-10-31.md). The world can have a real history that outlives the founder, while the heir's knowledge remains separately earned. The **read-side consequence** is not only a World Save operation: the player must be able to read an authorized distinction between (i) enduring facts that changed the world, (ii) account-visible archived histories and family evidence, (iii) the current character's observed/known history and (iv) a manuscript-style narrative.

The narrow source question here: **What can the existing Chronicle actually prove today, and what must an heir-era UI decline to infer?** The previous `chronicle-run-end-summary-view-model-plan.md` is a **historical planning document** for a projection already implemented. The source-backed implementation and its tests are now the primary reader reference.

No World Save has been implemented on selected master, and no existing account Chronicle data is automatically promoted into a future world event log. This file does not create world story events, heir eligibility, family records, alternate Knowledge or an heir-screen UI.

## 2. Live source-to-display facts, exact selected master

| Existing source / fingerprint | Verified capability | Evidence-limited future read side |
| --- | --- | --- |
| `packages/shared/types/src/contracts.ts` blob `4b3910f3dc5a78f3a45dfb5bfc0ffdb512d681ec` | `AccountRunHistoryRecord` has `characterId`, `name`, `lineageId`, optional `familyId`, `parentCharacterId`, `sourceRunId`, `crossLineageStart`, `startedAt/lastSeenAt/endedAt`, outcome, archive reason, Echo, deeds, Legacy, `inheritanceUsesRemaining`, slot refs. `AccountEstateState` has deposits and assets keyed to source run. `PlayerDiscoveryChronicleState` and `PlayerGeographicKnowledgeState` are **player-private**. `SessionState.chronicle` is a separate `ChronicleEventState[]`. | Source record/related family fields can support a **read-only account lineage history** with limited explicit parent/family evidence. Neither this Account type nor current `SaveSnapshot` has a committed independent world head/history or durable world event timeline. |
| `apps/rpg-ui/src/game-shell/runLifecycle.ts` blob `d75df9ee0bd51d08c068ac7a11767b62d2df0423` | `isRunChronicleVisible`: active/retired/archived only; `isRunDeleted`: deleted non-authoritative. `isRunProgressionAuthoritative`: retired/archived. `isRunLineageAuthoritative`: **retired** with positive normalized `inheritanceUsesRemaining`. `resolveEligibleHeirSources` ranks those available **run sources**; `retainRetiredRun` and `consumeRetiredRunInheritanceUse` own current retained-run transitions. `archiveActiveRun` is a separate terminal path. | The current **run-source eligibility** is not complete future user-selected offspring/adoption/Prestige/legal heir eligibility. A character listing a retained source is not proof that a real offspring or adopted heir exists. No world-head mutation can be inferred from a run archive. |
| `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts` blob `b92c2fd12f63275e3e20f55af00380c7ab665465` | **Already implemented** pure read-only run-end detail projection for explicit `AccountRunHistoryRecord`, account profile and optional lifecycle result. Resolves stored payout, estate deposits/assets, run outcomes, warnings, explicit parent/family fields and source run. Has `actionIds: []`. `sourceRunId` row explicitly says source context does not create parent/child copy. | Reuse projection for **run/character/account archive facts**, not as a world event log, new inheritance grant, or current-map/character-secret feed. Avoid rerunning the May version `0.5.76` plan as a fresh implementation prompt. |
| `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts` blob `9852e75d594f658a65f548696fecbb55721340ca` | Builds account Chronicle tiles, statuses, filters and stored Legacy/estate context from account `runRecords`. Sorts tiles by **lastSeenAt, then endedAt** timestamps. Exposes source/lineage cues. | Account last-seen UI recency is **not** global world chronology, world tick, final-seen location, or the order of all world events. A cross-world archive would need world-scoped owner evidence. |
| `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx` blob `78e771032b844f9acc96f442196974c81d91cf5d` | The existing account Chronicles surface actually calls `buildChronicleRunEndSummaryViewModel` for a selected run, displays its rows, and uses Chronicle tile badges. This is **not merely a future plan**. | The account-facing UI should not become the default in-character “what my heir knows” feed or offer invented payout, heir choice or estate claim mutations. |
| `apps/rpg-ui/src/runtime/uiViewModel.ts` blob `c152412ebc19511f2e394619c8ee3c979e64b119`, and `apps/rpg-ui/src/features/ChroniclePanel.tsx` blob `448f6e68ebf40898ec069183dbb741f02d4a273d` | Current gameplay Chronicle is projected from **`snapshot.sessionState.chronicle`** and consumed as a session timeline. Player discovery and geographic Knowledge are separately owned and cannot be inferred from this session list. | Session feed may show current/retained accepted session entries with truthful timestamp precision, **not** a permanent full World Save event journal. Heir cannot be given founder's session feed as own observations merely because the world is shared. |
| `docs/design/living-character-manuscript-design-boundary.md` | A manuscript is a **derived event-sourced editorial presentation**, not authority for facts, relationships, memories or history. No full general quest/event/relationship source currently exists. | A future readable life story or family saga can quote only eligible retained facts. Narrative prose, chapter naming or evocative imagery cannot create a world event, claimed discovery, NPC memory or inherited legal right. |
| `docs/design/offspring-heir-family-continuity-owner-plan.md` | A playable heir requires actual recorded offspring or eligible adopted child plus future Prestige/eligibility. Capacity alone does not create a child or family. | Source run reference, positive inheritance uses, account-wide species/lineage, surname and Prestige rank are not substitutes for true heir evidence. |
| `docs/design/quest-event-chronicle-authority-boundary-decision.md` | Static story/quest/event/Chronicle *templates* do not own accepted player/world event outcomes or mutation. | Do not manufacture “the founder conquered X” from an available quest definition, authored rumor or a future manuscript sentence. |

## 3. Specific contradictory current UI wording found in source (high-value T7 finding)

**Observed cross-projection inconsistency, not an executed failing test:**

- `accountMetaPresentation.ts` `buildChronicleContinuityLabels` creates **`Descended from ${sourceRecord.name}`** whenever the record's `sourceRunId` resolves to a non-deleted run, even without `parentCharacterId` or actual proven family/heir relationship. It also adds **`Founded from this line`** when another run points at the source run.
- `chronicleRunEndSummaryPresentation.ts` `buildContinuityRows` correctly states: **“Source context only; source run id alone does not create parent or child copy.”** It displays **Explicit parent** only if `parentCharacterId` exists and **Explicit family** only if `familyId` exists.
- Existing `tests/unit/chronicle-run-end-summary-presentation.test.mjs` explicitly tests that a child with `sourceRunId` and no `parentCharacterId` has a source row but **no** parent copy.
- Thus the **account Chronicle tile currently implies ancestry on weaker evidence than its detail view accepts.** This may confuse a genuine adopted heir, an unrelated retained-run continuation, and future isekai/cross-lineage character creation.

**Recommended future bounded Code/QA owner action (not undertaken here):** In the selected current account presentation owner, require the **same explicit parent/family evidence gate** for actual “descended from / ancestor / heir” copy as run-end detail; otherwise neutral source wording such as **“Continues from [run name]”** or **“Linked run source”** may be displayed when source linkage is valid. Add one focused dual-view red-first fixture: A archived source run, B referencing `sourceRunId`, **no** explicit parent/family; both tile and detail must not claim biological descent. Add explicit-parent and legally authorized adopted-child cases after their respective real owner records are selected. **Do not** wholesale rename existing family relationships, change `sourceRunId` semantics, auto-create offspring or mutate account history.

This exact mismatch is a **legitimate selected-client review candidate** for future Codex, rather than another general lineage taxonomy audit.

## 4. Four future Chronicle visibility/read planes at world load and heir selection

| Reader plane | World- or actor-owned fact | Who may safely read | Current evidence / absence |
| --- | --- | --- | --- |
| **A. World chronological facts** | Committed world event, changes to settlement control, real dungeon/faction/market outcomes, shared date/tick, authorized public consequence | Future world head provides only appropriately **public/observable** world facts; some world truths remain unknown to player | **Absent as an independent persisted World Save/history**. World engine event envelopes do not equal a durable authorized world history viewer. |
| **B. Account-level run archive and family** | Retired/archived run identity, stored Legacy payout, estate deposit, explicit `parentCharacterId/familyId`, authorized account progression | Account owner in a meta/history/lineage browser | **Already partially implemented**, but source run is not itself parentage and account archive is not character-memory data. |
| **C. Current character's known history** | Own current observed actions, discovery Chronicle, personally learned geography, permitted inherited journal/physical chart clues, accepted received testimony | Only this character through knowledge/observer policies | Session Chronicle and player discovery/knowledge have sources. **No auto-copy from A to B**, even if B is a legal heir in the same world. |
| **D. Narrative life story/manuscript** | Derived source-linked editorial summary of A or B or a family, with explicit era/context/uncertainty | Subject to account/character access and spoiler filters, depending on view | Planning-only manuscript; no writer or persistent complete world story history selected. Text must not mint facts. |

**World head versus per-character knowledge:** a real world event may still affect an heir's actions even if the heir has never heard the story. For example, an ancestor's lawful building destruction may leave the building absent in W1, but an heir need not learn who caused it without an observed record/source. Likewise, accepted ancestor quest success does not automatically mark the heir's personal quest as completed.

**World Save first, heir second:** load verified World Save and world history, then validate/load heir/character Save and private knowledge. The **Chronicle UI must filter after actor binding**, not render unfiltered world history while a loading screen/roster is pending. Account owner may have separate privileged meta/history access, which is not a first-person map privilege.

## 5. One concrete two-record source comparison (future test fixture, not executed)

**Source A:** an account run record has `characterId=player.source`, `name=Source Vale`, `outcome=archived` and a stored `archiveReason=retired`. These are the exact *type of inputs* used in existing `chronicle-run-end-summary-presentation.test.mjs`'s `sourceRunId can display source context without creating parent-child copy` test.

**Continuation B:** a run record has `characterId=player.child`, `name=Child Vale`, and `sourceRunId=resolveRunHistorySourceId(A)`, **but lacks `parentCharacterId` and `familyId`**. The “Child Vale” fixture name is just a display name, not parentage evidence.

| Consumer | Expected read truth | Existing selected code |
| --- | --- | --- |
| Run-end detail for B | `Source run: Source Vale`; no `Explicit parent`, no `Explicit family` | Correct behavior locked by existing unit fixture. |
| Account Chronicle tile for B | A neutral run-source relation only; **no “Descended from Source Vale”** | **Current copy contradicts evidence gate**. Future fix needed in owning presentation/test. |
| Player A/B in a future shared world | W1 accepted public effects persist, but A and B maintain independent Knowledge, map, assets and session feeds | **World Save and two-character attachment not implemented**; future owner must supply authenticated reader data. |
| Family/archive navigator | Show biological or adoptive parent only from explicit accepted family/offspring/adoption source | Existing record has optional parent/family strings; full accepted future family relationship lifecycle not yet available. |
| Estate/Prestige preview | Only stored deposits and account grant/uses, no in-UI asset transfer | Existing run-end presentation is read-only. |

**Recency caveat:** Both run records have wall-clock `startedAt/lastSeenAt/endedAt` metadata for the account archive. A newer last-opened record might refer to an earlier in-world era; **do not sort a future W1 World Chronicle by account lastSeenAt and call it world chronology**. World-head tick/event ordering must be sourced from accepted W1 world authority.

## 6. Prospective acceptance tests, none run in this connector pass

| ID | Case | Future gate |
| --- | --- | --- |
| **CH-01** | Account tile B refers to A only via `sourceRunId`, without actual parent/family | Tile says neutral `Linked run source`, not biological descent; run-end detail has no Explicit parent |
| **CH-02** | B carries explicit `parentCharacterId` with real accepted family evidence | Only proper owner may allow **parent/descended** copy; no inferred family from account surname or lineage species |
| **CH-03** | B is adopted through accepted future adoption record | Label adoptive relation precisely; do not silently call biological descent |
| **CH-04** | Deleted A remains a referenced source | Deleted A non-authoritative; no lineage/Prestige/estate/inheritance grant or automatic family claim |
| **CH-05** | A retired with positive inheritance uses but no eligible offspring/adopted child | Existing source-use UI may say run-source available, **not** playable heir or guaranteed family line |
| **CH-06** | A archived with stored payout/estate receipt | Run-end detail renders **stored** payout/estate only; no recalculation, deposit, claim, inheritance or reward button |
| **CH-07** | Retired A subsequently archived | Reconcile status and retained-run/slot claims from actual lifecycle; do not display both selectable current source and final death at once |
| **CH-08** | A has `sourceRunId` and `crossLineageStart` | Neutral source provenance; cannot conclude ancestry, same-world identity, world import or personal knowledge transfer |
| **CH-09** | World W1 is restored before B joins | Read-only World Chronicle stays unavailable until future accepted world event source/head; after B binds, player feed filters by B's entitlement |
| **CH-10** | A witnesses a hidden confluence, B has never seen its location | B's Atlas/Chronicle has no hidden pin or personal eyewitness narrative from world registry/history |
| **CH-11** | A passes a genuine chart/family journal to B | B learns only owner-admitted chart/Study/testimony evidence; accessible chart may display temporary inaccurate geography |
| **CH-12** | A's market action changes W1 | B sees market consequences through appropriate current public source, not automatically A's private explanation or deed story |
| **CH-13** | Two runs are loaded/saved in reverse wall-clock order | Account UI may sort by `lastSeenAt`; future World Chronicle uses accepted world tick/revision and never claims account recency is global order |
| **CH-14** | World retains no independent general story history | UI says `World history unavailable` or shows actual existing source-limited run/session rows, not generated campaign lore |
| **CH-15** | One account controls several worlds | Show world-specific actor/world history only after verified world membership; no cross-world log or map leakage from account aggregate |
| **CH-16** | Run-end summary is rendered with missing record | Existing projection unavailable branches remain, `actionIds: []`, no guessed memorial |
| **CH-17** | Manuscript text says ancestor founded a castle without retained event | Narrative cannot create world castle, ownership, Chronicle receipt, family eligibility or descendant memory |
| **CH-18** | Founder's death/retirement and heir admission crash between world and actor publications | Future world/save owner guarantees idempotent world/head/estate/character receipt, no duplicated heirs, Legacy or asset transfers |

## 7. Correct implementation order and requested owner questions

**Source-evidence conclusion:** Existing account Chronicle and run-end projection already provide useful **account meta and run archive**. The **selected World Save/World Runtime heir design creates a new future display consumer**, but **no selected full durable world history owner or heir/observer audience is runnable**. Current session Chronicle and player discovery are not substitutes.

**Next proposed bounded change when selected:** after active Codex native-v3 selected state is stable, a **single read-only presentation copy test/fix** for `accountMetaPresentation.ts` source-run “Descended from” mismatch is the most precise immediate QA target. This does not need a World Save implementation, although it must be scheduled by the current selected presentation owner, not by this docs-only PR.

**Later blocking design choices, not invented here:**
1. Does the World Save expose a **public world Chronicle** distinct from player session/account archives, with what event retention and spoiler visibility? Recommendation: world event ledger remains authoritative and viewer-specific projections redact unknown/private facts.
2. Does account meta Chronicle show privileged true lineage history across worlds while the character's **in-world Chronicle** shows only received/observed memory? Recommendation: separate clearly, not “one universal chronicle.”
3. What is actual accepted heir eligibility and transaction order with world head, offspring/adoption, estate and character admission? Recommendation: rely on future named family/account/world/Save owners and receipts, never `sourceRunId` alone.
4. How do manuscript and published family chronicle citations link back to accepted source events? Recommendation: stable evidence IDs with provenance/era and permission, not prose authority.

**T7 disposition:** `TARGETED_SOURCE_TO_CONSUMER_COMPLETE; ONE_COPY_CONFLICT_FOUND; RUNTIME_AND_FULL_WORLD_HISTORY_HELD`. Reopen **only** for selected Chronicle read/UI copy owner, approved World Save event ledger/observer disclosure, actual heir/estate lifecycle source delta, or user decision. Do not repeat entire Chronicle research taxonomy or general history inventory. The old `chronicle-run-end-summary-view-model-plan.md` remains historical context, not a new queued pure projection.

**Parallel safety:** Source and UI tests **read only**. No component, campaign Save, run source, account history, item/gear, family, map, World Save, clock, Codex prompt or `master` modified. Preserve held PR #46 as future world identity/clock owner and PR #45 for discovered-only geography.
