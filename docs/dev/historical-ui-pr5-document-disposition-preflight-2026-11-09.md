# Historical UI PR #5 — document-level disposition and acceptance-transfer preflight (2026-11-09)

**Status:** `PR5_DOCUMENT_INVENTORY_REVIEWED; SELECTIVE_EXACT_EVIDENCE_ARCHIVED; PR5_HOLD_NAMED_CONSUMER`. Unversioned, repository-scoped coordination and historical source classification, **not** current execution authority, a completed selected-client acceptance, an approval to close or delete PR #5, or a replacement for the branch disposition register.

Repository: `vagabond1215/Lineage_Reforged`. Source: PR #5 head `8980ea3875491bf631a18926feb75f90ffa1b55f` against old merge base `f56229dde859b9374a54368bd8a8fd2a9872daa1`. Connector review began from master `c480961a5d30bdfbf2ae3347e900706641d435bc`; after the four exact PR #5 archives, master was verified at `2c9c4301e82e902877cdf80fb3ea03378c38866a`. All historical files below are source evidence only. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP` and `HOLD_SELECTED_ATOMIC_ACTIVATION` remain unchanged.

## Decision basis and shared-path semantics

PR #5 changes 24 paths: **8 shared master paths and 16 historical files absent from their original locations on master**. GitHub PR-file patches for all 8 shared paths were inspected. Changes to `AGENTS.md`, `README.md`, `docs/design/contextual-player-command-architecture-index.md`, `docs/design/future-system-design-ledger.md`, `docs/dev/codex-sequenced-implementation-plan.md`, `docs/dev/project-roadmap.md` and `docs/dev/project-vision-and-continuity-brief.md` are pointers to the older UI design/migration index, with warnings that it is subordinate to live authority. No obsolete navigation pointer should be copied over contemporary master. The eighth shared path, `docs/design/ui-information-architecture-boundary.md`, adds an old Character-first §23 including now-superseded horizontal subsection routing. The **current** UI boundary §23 re-authored the Character-first priority on October 24; subsequent Character sheet decisions further changed navigation. No original PR #5 shared-path diff is a safe wholesale merge.

The current accepted UI boundary, the current prompt/handoff/output, `docs/dev/ui-safe-integration-and-deployment-review-2026-10-24.md`, published PR #7/#8/#9 historical implementation records and later equipment/owner evidence prevail over PR #5's dated instructions.

## All 16 original missing-path decisions

**Classification meanings:** `ARCHIVED_EXACT` means complete historical bytes are preserved on master under `docs/dev/evidence/historical-ui-pr5/` and read-back Git blob matches; `SUPERSEDED_SUMMARIZED_HOLD` means historical value/source was inspected and mapped to later authority, but original bytes were not promoted, and final PR retirement still requires a named-consumer review. `HISTORICAL_PROMPT_HOLD` means a proposed non-installed execution instruction is obsolete and must never replace the active prompt; preserve its relevant gates through explicit transfer before PR deletion. None means tests were rerun or selected acceptance achieved.

| # | Original unique PR #5 path | Git blob SHA | Preliminary disposition / rationale |
| --- | --- | --- | --- |
| 1 | `docs/design/character-top-bar-cross-slice-integration-and-visual-coherence-preflight-2026-10-22.md` | `e41c670c00d4230a837bf194ef2f739d3a3a62ca` | `SUPERSEDED_SUMMARIZED_HOLD`. Old proposed combined rehearsal; PR #9 repair record and current-main UI integration supersede its executable next task |
| 2 | `docs/design/combined-ui-rehearsal-outcome-and-mobile-viewport-gate-2026-10-22.md` | `a94b483dd89e0ed2e19b613cdfa0f62ff1ab14de` | `ARCHIVED_EXACT`. Distinct reported 106px intermediate failure and rehearsal provenance |
| 3 | `docs/design/equipment-inventory-ui-owner-projection-and-pr-stack-preflight-2026-10-22.md` | `1a092d99781d5d7f7ff145cdeeb4d254f2efedc3` | `SUPERSEDED_SUMMARIZED_HOLD`. Old UI owner/source map and suggested stack order; owner repairs #10→#12→#13, UI #11→#14 and current master prevail |
| 4 | `docs/design/gameplay-ui-redesign-character-priority-and-first-migration-decision-2026-10-21.md` | `827c52d62b9a6562208f3a3d50fa4c46de7aa398` | `ARCHIVED_EXACT`. Original user-directed Character-first product priority and dated acceptance matrix; current UI boundary remains the accepted design |
| 5 | `docs/design/top-status-bar-resource-and-condition-presentation-preflight-2026-10-21.md` | `06ac2d3aeffc1b4e4e1c293d36c9c8c4407a68d1` | `SUPERSEDED_SUMMARIZED_HOLD`. Historical implementation proposal; PR #8 exact implementation record now preserved on master |
| 6 | `docs/design/ui-design-intent-and-migration-guidance-index.md` | `426b9d4b36e225a4255e291fa3c30ccfbe7c6c5a` | `SUPERSEDED_SUMMARIZED_HOLD`. Old navigation map repeatedly describes pending October tasks; current UI boundary, owner decisions and current handoff control |
| 7 | `docs/dev/inventory-duplicate-bag-exact-container-connector-preflight-2026-10-23.md` | `39047756c49fa8901422ebdb45e6e7aa146b5733` | `ARCHIVED_EXACT`. Original pre-fix wrong-bag source and reproducer map |
| 8 | `docs/dev/proposed-character-top-bar-combined-ui-rehearsal-codex-prompt-2026-10-22.md` | `25e1f5ffa18d43d31b08ad2e85b5472146af3b04` | `HISTORICAL_PROMPT_HOLD`. Controlled composite rehearsal completed by later evidence; don't reinstall |
| 9 | `docs/dev/proposed-character-ui-selected-acceptance-codex-prompt-2026-10-21.md` | `7387f3c3cd38dd5e9da3153ddb0041ec80b85188` | `HISTORICAL_PROMPT_HOLD`. Selected Character keyboard/owner/Save obligations still need a contemporary master-owned acceptance route |
| 10 | `docs/dev/proposed-equipment-inventory-selected-client-acceptance-codex-prompt-2026-10-22.md` | `adaee38beec1a696a7592bcc094bc2500feb5002` | `ARCHIVED_EXACT`, **non-installed checklist**. Concrete legitimate selected Equip/Unequip/Use/Save and source-target integrity matrix; must not execute on outdated stacked sources |
| 11 | `docs/dev/proposed-equipment-inventory-ux-stacked-first-slice-codex-prompt-2026-10-22.md` | `4a6e1c96d9275f044031e82025d073631764f8de` | `HISTORICAL_PROMPT_HOLD`. Old PR #7-based UX implementation route, superseded by re-authored current master |
| 12 | `docs/dev/proposed-gameplay-ui-character-first-codex-prompt-2026-10-21.md` | `68d8afcdd2b6c9915bfec491fe1b4c1e664d6ba2` | `HISTORICAL_PROMPT_HOLD`. Original Character migration proposal was implemented/re-authored; no replay |
| 13 | `docs/dev/proposed-inventory-bag-exact-target-owner-repair-codex-prompt-2026-10-23.md` | `228e4c2d54227ccb132df8c0e3315908922b35c0` | `HISTORICAL_PROMPT_HOLD`. Owner fix represented by PR #13, later master source and current owner contract |
| 14 | `docs/dev/proposed-inventory-ui-selection-identity-safety-codex-prompt-2026-10-23.md` | `c9b3df4259982c31505572f4e6d47e9e08bc6de7` | `HISTORICAL_PROMPT_HOLD`. UI fix represented by PR #14 and later master source; exact-main acceptance still separate |
| 15 | `docs/dev/proposed-mobile-shell-usable-height-repair-codex-prompt-2026-10-22.md` | `47ffd8eef651c750644678065866b5274dc28287` | `HISTORICAL_PROMPT_HOLD`. Repaired by PR #9; historical record, controlled fixture and eight PNGs now preserved on master |
| 16 | `docs/dev/proposed-persistent-top-bar-ui-codex-prompt-2026-10-21.md` | `5743ac9dc28f17ce9bdd582bf9281f5eb4cd0445` | `HISTORICAL_PROMPT_HOLD`. Historical PR #8 implementation record preserved, active resource/condition acceptance unresolved |

## Exactly archived PR #5 sources

All four files were fetched at exact PR #5 head, verified against the Git blob above, copied **without textual rewrite** to `docs/dev/evidence/historical-ui-pr5/` and independently read back by content and SHA:

- `gameplay-ui-redesign-character-priority-and-first-migration-decision-2026-10-21.md`: `f98f858abb447d65ce4b5d83139144f9bd39dfcd`
- `combined-ui-rehearsal-outcome-and-mobile-viewport-gate-2026-10-22.md`: `88b51d18752870449439a354b158d3421c19c850`
- `inventory-duplicate-bag-exact-container-connector-preflight-2026-10-23.md`: `dfdae096c3553d7a8ba34d31ad395ac5433f1cbf`
- `proposed-equipment-inventory-selected-client-acceptance-codex-prompt-2026-10-22.md`: `2c9c4301e82e902877cdf80fb3ea03378c38866a`

Archived contents are historical snapshots. Relative links inside those snapshots may refer to their old directory layout and must not be interpreted as live execution pointers. The other twelve documents remain accessible through the retained PR #5 branch, with source blob IDs and dated dispositions above; **this preflight does not declare their source bytes permanently preserved** or prove it is safe to delete PR #5.

## Proposed current-master acceptance consumer transfer, not yet authorized closure

1. **Character and action route (#7 with #11/#14; owner #10/#12/#13):** authenticated ordinary campaign/supported item actions and return to Character, equipment/Inventory selection including duplicate-bag targets, keyboard/focus, actual Save/load/restart and exact state conservation. This must use current master and current owner contracts, not restore the old horizontal Character section helper.
2. **Resources/conditions (#8 with #16):** live player HP/MP/ST progression, real warning/critical/normal transitions, owner-backed disclosure/tooltips, calendar/notifications/settings accessibility and persistence/restart where applicable.
3. **Shell/responsive (#9 with #15):** current-master selected narrow portrait, landscape and desktop views; workspace/action reachability at ordinary zoom, document overflow, keyboard focus and popup return; Save control remains reachable. Historical 375×667 screenshot's 248px measurement is not current-master acceptance.

Assign a specific current-master owner/run, acceptance environment and evidence publication path **before** marking these obligations transferred. A transfer of a test obligation does not mean that the underlying gameplay behavior passed. This transfer proposal is not itself completion of any selected-client gate.

## Retention and next lifecycle decision

PR #5 is still `HOLD_NAMED_CONSUMER` for the twelve summarized-but-not-exact-promoted documents, any surviving genuinely unique guidance, and the explicit disposition of its prior selected-client consumers. Do not merge the PR's eight shared governance paths or reinstall old prompts. Before a later `SUPERSEDED_PRESERVE_EVIDENCE` → close review:

- Reinspect exact live PR #5 head/metadata/discussion, branch dependencies and master.
- Independently approve whether the twelve summarized documents can be retired using the item-level rationale here, or selectively preserve any remaining unique bytes.
- Assign and record a durable master-owned acceptance consumer for still-open selected behavior without claiming that behavior was accepted.
- Update the full current disposition register and PR metadata with exact preservation/retirement links; review PR closure separately from remote branch deletion.

No PR was closed, merged, rebased, retargeted or deleted during this connector work. No code, tests, Save, account, Site deployment, native-v3 or staging was changed. No local execution or acceptance test was performed. FP-002, FP-008, FP-009 and FP-016 apply.
