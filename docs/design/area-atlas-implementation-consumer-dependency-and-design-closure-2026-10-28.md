# Area / Atlas Implementation Consumer, Dependency Map and Design-Only Closure

> **2026-10-29 owner-direction supersession (design-only):** The `World → [Area] [Atlas]` sibling proposal, second World Atlas, and cold-load Character-as-future-target ambiguity in this historical preflight are **SUPERSEDED** by the explicit user direction in held PR #24: **Current Area is the default gameplay/re-entry surface, with no separate Home or old World submenu; broader known geography belongs in the existing `Codex → Atlas`**. Preserve the source maps, evidence, prospective tests and owner restrictions, adapting navigation-dependent examples. Read `area-atlas-owner-direction-and-source-to-consumer-reconciliation-2026-10-29.md` **first**. No selected UI changed; no Codex source/Save/implementation acceptance is inferred.


Date: 2026-10-28. Status: **CONNECTOR-ONLY INTEGRATION PREFLIGHT / HOLD_NAMED_CONSUMER**. This is not acceptance, Codex execution routing, runtime implementation, selected-client proof, merge authority, or game-version advancement.
Selected `master` evidence base `a596112acf3945f2bf7c625e943f2511d12aa710`; current separate unselected native v3 PR #44 head `022fe22def299cf9fc357058a0214e83875af24b`. Independent docs-only Area/Atlas draft PR #45 is reviewed against the same master base.

## 1. What is closed by connector preplanning

PR #45 develops one coherent proposal: keep existing **World** as a global destination, provide **Area** (present observed situation and immediate legal owner actions) and **Atlas** (disclosed known geography and owner-validated travel planning) as World sibling views; preserve current top band and responsive domain navigation; leave `Codex → Atlas` as a distinct geographic Knowledge reference. **On entering World**, proposed default subview is Area; the application's **cold-start/Home default** remains unapproved and the current selected app starts on Character.

The completed, non-overlapping evidence artifacts are:

| Document | Distinct question answered | New prospective tests |
| --- | --- | ---: |
| `area-atlas-text-first-gameplay-surface-and-command-source-map-2026-10-28.md` | Actual selected World/Activity/Quests commands and Area vs Atlas ownership | AA-01–AA-20 (20) |
| `area-atlas-navigation-wireflows-state-matrix-and-ui-acceptance-2026-10-28.md` | World sibling tabs, responsive wireflows, ephemeral navigation, four journeys | AW-01–AW-24 (24) |
| `area-atlas-observation-knowledge-and-owner-provenance-gate-2026-10-28.md` | What is observed/known/hidden; disclosure risk from known:false; source fallback | AO-01–AO-28 (28) |
| `area-atlas-action-priority-feedback-and-consequence-preflight-2026-10-28.md` | Action priority, legal vs blocked, receipt/feedback, time/risk/result truth | AF-01–AF-26 (26) |
| `area-atlas-text-scene-editorial-cards-and-graceful-fallbacks-2026-10-28.md` | Factual scene writing, uncertainty, deterministic editorial fallbacks and visual limits | AE-01–AE-20 (20) |

Total **118 prospective case definitions**, with overlapping *intentional cross-checks* across groups. They are a **test design inventory**, not 118 independent automated tests or an executed acceptance report. Later Codex should collapse repeats into a minimal red-first suite, rather than implement one test file per written row.

## 2. Critical path and dependencies, not permission to run

```text
Codex selected native v3 App + authenticated Save/restart + source validation gate
       |
       v
Character/Inventory UI and branch-disposition acceptance/review gate
       |
       v
Area/Atlas explicit product/IA decisions (World siblings? Home? Atlas label?)
       |
       v
A1  read-only, observer-safe Area current-situation projection
       |             (no gameplay commands, no new persisted state)
       +-- G-01 known:false disclosure negative test + visibility decision
       |
       v
A2  read-only Atlas disclosed-location list/map + travel outlook parity
       |
       v
A3  exact owner command routing: Explore → candidate/Approach → combat,
       |   Travel, Activity/Survey, Rest and Quests only where existing owner
       |
       v
A4  responsive/UI polish and approved narrative/asset consumption
       |
       v
A5  one future NPC/station/resource/context family at a time
           only after its distinct local identity/permission/action owner exists
```

No package above may infer accepted v3 from PR #44 or require a v2 shadow after native cutover. The implementation authority is a **new reviewed selected App work package**, never this docs-only branch. A later selected-format change may invalidate current `SaveSnapshot`-specific projections: re-verify owner APIs and UI source before code.

## 3. Minimum first executable slice (preferred future Codex package)

**A1 is intentionally read-only**. The smallest meaningful selected-UI slice is a World sibling tab UI with Area's place/context/encounter/activity and no new mutation entry points. It should not rename all world sections, migrate `TabId`, add Home, add routes/real-time position, rewrite SideNav, or build a general narrator. If World sibling tab implementation itself overlaps the selected v3 App branch, park the whole A1 source edit instead of manufacturing a proxy runtime.

**Source to consume after owner gate:**
- `apps/rpg-ui/src/game-shell/InGameShell.tsx`: current `world` is one of seven root `TabId` values; global nav state is ephemeral and currently starts Character.
- `apps/rpg-ui/src/features/WorldPanel.tsx`: actual World surface, map placeholder, Explore/candidate/combat/Travel, record sublists, detail selection.
- `apps/rpg-ui/src/runtime/uiViewModel.ts`: `world.locations`, `world.lists`, `knownLocations` and Codex Atlas source projection.
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`: selected current snapshot/control, authoritative caller availability; do **not** create a second campaign mutation owner.
- `packages/shared/types/src/contracts.ts`: coarse player location, KnownLocationState, nearby context/candidate, activity and encounter source shapes.
- `apps/rpg-ui/src/components/SideNav.tsx`, `components/layout/AppLayout.tsx`, `components/layout/PanelLayout.tsx`, `styles/mobile-shell.css`: responsive and accessible existing shell; do not presuppose a permanent vertical rail in portrait.

**A1 success boundary:** selecting Area, Atlas or detail changes **only** UI state; Area shows current known facts, candidate/encounter precedence and helpful no-data fallback; World Atlas is not yet a second executor; no new saved location, pin flag, unseen NPC, action receipt, time advancement, UI-persisted descriptor or hidden-data disclosure. This is a useful UI staging slice only once the selected format/owner integration is clean.

## 4. Non-negotiable review gates before each later slice

| Gate | Evidence to inspect | Failure disposition |
| --- | --- | --- |
| G0 Source/branch identity | Current master, Codex latest child, selected App format, PR #45 exact diff, branch register | Stop if base/head or ownership drifted; redo delta orientation |
| G1 Selected Save owner | Authenticated fresh creator, mutation, ordinary/terminal/pending defeat, Save/readback/restart and mixed-format policy | Hold Area source integration; docs remain valid design candidate |
| G2 Known:false visibility | Actual meaning of `KnownLocationState.known` plus controlled hidden row and current World map/list behavior | Do not ship Atlas projection that reveals hidden identity |
| G3 Place and provenance | Exact accepted coarse place and typed source head/tick; distinguish current/nearby/remote | No exact local target if owner missing |
| G4 Command owner routing | Current Explore, Approach, legal combat, travel plan, Activity/Survey, Quest/Rest callers | Use owner link/inspection only; no fake Area action |
| G5 Result durability | Accepted mutation and source result vs queued step, effect, retained Save/account receipt | Avoid “hit”, “won” or “saved” on mere request accepted |
| G6 UI/accessibility | Keyboard/map-list parity, reflow, focus/announcement, reduced motion, portrait vs landscape nav | Keep text/list fallback and unmodified selected shell |
| G7 Future scene content | Concrete observed entity/station/resource identity and rights/cost/action owner | Reference-only card; no new service verb |
| G8 Narrative and visuals | Existing deterministic factual labels or future accepted narrative renderer and observed art subject | Safe factual fallback, no invented sensory details |

## 5. Prioritized execution checks (subset of 118 prospective rows)

Recommended **minimal planning set**, to be consolidated in a real red-first test suite later, in dependency order:

| Priority | Test-group rows | What they must prove |
| --- | --- | --- |
| 1 | AO-01, AO-02, AE-03 | Undiscovered names/notes/coordinates/inspector and alt text are not exposed |
| 2 | AW-01, AW-02, AW-03, AW-04 | World modes share one root; portrait/landscape navigation; no mutation on switching |
| 3 | AO-06, AO-07, AO-08, AE-02 | Missing/unmapped local identity and incoherent snapshots fail safe |
| 4 | AW-06, AO-03, AO-05, AF-09, AF-10 | Disclosed destination, map/list selection, current-origin travel plan, confirmation reset |
| 5 | AA-06, AA-07, AF-01–AF-05 | Explore/candidate/combat transitions and correct cost/priority |
| 6 | AF-06–AF-08, AE-10, AE-11 | Accepted/queued combat step is not a fabricated hit or victory |
| 7 | AW-15, AF-14, AO-18 | Activity/Soundings ownership, one retained request, no fake generic work |
| 8 | AF-18–AF-20, AO-21, AW-18 | One invocation/receipt, retries, source invalidation and Save/restart |
| 9 | AO-16, AO-17, AO-19, AO-28 | No imaginary local clerk, forge, merchant, resource or board |
| 10 | AW-20, AW-21, AE-19, AF-24 | Screen-reader, focus, reduced motion, accessible non-map fallback |

Tests proposed for current selected v2 behavior can only be adapted after the **actual current selected format** is confirmed at the time of execution. Live selected-client authentication and Save/restart evidence must be labeled separately from synthetic fixtures or source review. The `known:false` display path is a conditional risk, **not a confirmed real-world data leak**.

## 6. PR and edit-surface conflict preflight

At this source audit:
- `master` stays `a596112acf3945f2bf7c625e943f2511d12aa710`.
- Native v3 PR #44 (draft, stacked on PR #43, head `022fe22def299cf9fc357058a0214e83875af24b`) modifies native publication/account/recovery adapters, tests, design and Codex current output/handoff/register. It is **unselected**.
- PR #40 is separate draft documentation for held tools, apparatus, holsters and carry rules; no source effect implied.
- PR #45 is a **unique docs/design/area-atlas-*.md-only** design candidate. It must not rebase/merge into Codex's stacked native branch to appear implemented; do not edit current prompt, handoff, output, branch register, `EpochApp`, `GameSessionContext`, `WorldPanel`, `uiViewModel`, Save, data, schema, tests or protected refs.
- **No shared changed file with PR #44** at this inspected head. There remains a *future semantic* integration dependency: PR #44's successors are expected to change selected App/owner/Save APIs. Recheck before implementing Area, and do not treat a clean docs-file diff as authorization to merge.

The PR description and explicit named consumer are the branch-retention signal for this separate connector pass while Codex owns the coordination register. Register/reconcile PR #45 in `docs/dev/branch-disposition-register.md` at the next **coordination-owned** checkpoint; do not race Codex's registered changes. Retain this draft until future Area/LocalScene World UI owner consumes the documents or deliberately supersedes them.

## 7. Owner decisions still required

The user has asked to continue the recommended design direction, which supports doing this **documentation**. It does **not** establish:
1. Approval to replace the selected cold-load Character default with Home or World→Area. Proposed interim behavior only defaults the World subview to Area *when World is opened*.
2. Approval to rename Codex Atlas or promote Area/Atlas into top-level `TabId` routes. Proposed sibling World modes preserve current global nav.
3. A `known:false` semantics/visibility model for all world content. The display projection may be conditional leakage; owner must decide and test.
4. A local scene actor/structure/resource instance schema or a license to display richer environmental prose as current observed truth.
5. Independent acceptance of selected native v3 and future direct owner action routing.
6. A general action ranking algorithm, narrative generation system, new discovery policy, timing model, market or guild service, broader combat rules or balance.

## 8. Stop condition: remaining work is no longer connector-safe design expansion

After this closure, current selected-source action map, sibling navigation states, disclosure/knowledge, owner action priority/feedback, editorial fallbacks and staged executable handoff have each been separately recorded. Additional source-only documents on the *same* model would duplicate evidence and inflate the future test inventory.

The next value-producing work is **one of**: (a) an explicit user/owner decision on the remaining UI questions; (b) selected native v3 + Character integration result and reinspection; (c) local executable hidden-location negative test and narrow UI repair when authorized; or (d) a separate future NPC/resource/scene identity contract under its own owner, not a World presentation document. No more PR #45 documentation should be created merely to fill a waiting period.

No tests/build/typecheck/browser checks were run by this connector pass. **HOLD_NAMED_CONSUMER; no merge, deploy, reset, old-save conversion or Game version advancement.**
