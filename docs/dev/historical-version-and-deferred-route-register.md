# Historical Version And Deferred Route Register

Date: 2026-07-27
Status: durable coordination authority; documentation only

## Purpose And Precedence

This register is the compact query surface for historical version identity and deferred-route posture. It does not replace detailed chronology, current output, or focused decisions.

For current execution use, in order:

1. `docs/dev/current-codex-prompt.md`;
2. `docs/dev/current-gpt-handoff.md`;
3. `docs/dev/current-codex-output.md`;
4. this register;
5. the most specific focused decision;
6. `docs/design/current-planning-anchor-reconciliation.md` when stale current-anchor wording conflicts with the sources above.

Historical roadmap and sequenced-plan rows remain chronology unless a live current-state section is explicitly refreshed.

## Current Primary Register

| Canonical version | Route | Status | Final disposition | Primary source |
| --- | --- | --- | --- | --- |
| `0.1.x`-`0.5.355` | Foundation, authority, schemas, validation, content, and early runtime transitions | Historical completed range | Use git history and the sequenced plan for exact chronology. | `docs/dev/codex-sequenced-implementation-plan.md` |
| `0.5.356` | Tool Surface Test Boundary Repair | Complete | Accepted repair. | `docs/future_content_backlog.md` |
| `0.5.356.1` | Tool Surface Test Post-Repair Audit | Conditional support | Run only if fresh focused evidence contradicts the accepted repair. | `docs/design/streamlined-pipeline-roadmap-decision.md` |
| `0.5.357` | Runtime Ownership Transition Readiness Consolidation | Complete | Canonical route; selected player travel. | `docs/design/runtime-ownership-transition-readiness-consolidation.md` |
| `0.5.357.1` | Player Travel Boundary Clarification | Complete support suffix | Did not consume a primary label. | `docs/design/player-travel-boundary-clarification.md` |
| `0.6.0`-`0.6.3` | Engine-owned travel, quest acceptance/tracking, and activity selection | Complete and accepted | Runtime ownership accomplishments remain authoritative. | `docs/dev/codex-sequenced-implementation-plan.md` |
| `0.6.4` | World And Settlement Static Content Expansion | Complete and accepted | Exact static package accepted. | `docs/future_content_backlog.md` |
| `0.6.5` | Item, Material, And Recipe Static Content Expansion | Complete and validated | 28 recipes across 10 families. | `docs/design/cross-domain-production-research-synthesis.md` |
| `0.6.6` | Monster, Ecology, And Loot Static Content Expansion | Complete and accepted | Exact nine-monster, nine-lineage, nine-ecology-addition, 28-drop-row package passed 147 focused tests and 67-file lint. | `docs/dev/current-codex-output.md` |
| `0.6.6.1` | UTF-8 BOM Test-Harness Repair | Complete and accepted | Commit `66f12fd6` changes the two intended readers; final acceptance completed in `0.6.6.5`. | `docs/dev/current-codex-output.md` |
| `0.6.6.2` | BOM Repair Post-Validation And Parent Prompt Restoration | Completed fail-closed attempt; superseded | Stopped at `4/5` on the initial climate contract mismatch. | `docs/dev/current-codex-output.md` |
| `0.6.6.3` | Region Climate Tendencies Contract Repair And BOM Acceptance | Partial implementation followed by fail-closed stop; superseded | Schema `56932eec` and focused assertion `e71f8f6b` landed; broader bounded migration was required. | `docs/dev/current-codex-output.md` |
| `0.6.6.4` | Region Climate Data Migration, Population Assertion Repair, And BOM Acceptance | Exact implementation landed; partial validation; superseded | Commit `232d3c2f` changed exactly four authorized files; focused `5/5` and lint `67` passed; the broad workspace audit remained non-green at `173`. | `docs/dev/current-codex-output.md` |
| `0.6.6.5` | Workspace Typecheck Baseline Classification And BOM Acceptance | Complete and accepted | Two fresh captures reproduced the identical `173`-tuple baseline, the four changed-file diagnostics were proven unrelated, the parent baseline passed `146/146`, and exact `0.6.6` was restored. | `docs/dev/current-codex-output.md` |
| `0.6.7` | Cross-Content Coherence And Coverage Audit | Active | Read-first audit; repair only if evidence proves a defect; no static-content or runtime expansion. | `docs/dev/current-codex-prompt.md` |

## Identity Rules

- Three-segment labels are primary roadmap versions. Four-segment labels are support runs attached to one named primary.
- `three-segment support package` is invalid terminology.
- A historical proposed label is an alias only when a durable source maps it to a completed canonical label.
- An absent number is not evidence of missing work. `0.5.211` is an evidenced unused gap.
- GPT Deep Research and unversioned research/integration do not consume primary `0.6.x` numbers.
- Difficulty, World Rules, Stakes, injury, narrative, elemental, Mortal Crisis, save, and occurrence contracts remain unversioned until implementation packages are assigned.
- Stale current-anchor wording does not override the active prompt, handoff, output, this register, or planning-anchor reconciliation.

## Deferred Route Register

| Lane | Classification | Completed foundation | Missing layer | Reopening trigger | Near-term posture | Primary source |
| --- | --- | --- | --- | --- | --- | --- |
| Planning-anchor maintenance | accepted correction; full refresh deferred | Current handoff/output/register and refreshed continuity brief | Full roadmap and sequenced-plan current-header maintenance | Dedicated documentation maintenance or next material roadmap rewrite | Do not treat stale headers as execution authority | `docs/design/current-planning-anchor-reconciliation.md` |
| Validation/typecheck | known-failing audit with separate cleanup tracks | Approved command matrix, source map, blocker triage, and reproduced identical `173`-tuple captures | Dedicated JSON import, environment typing, root-config/JSX, target/lib, module, and strict optional cleanup | Explicit tooling/typecheck route | Preserve the accepted audit classification; do not mix broad cleanup into static content | `docs/design/validation-command-matrix-plan.md` |
| Static world/settlement | expanded-and-validated | Accepted `0.6.4`; exact repair commit `232d3c2f`; focused `5/5`; lint `67`; parent baseline `146/146`; diff/hygiene accepted | None | New proven defect | Complete | `docs/dev/current-codex-output.md` |
| Static item/material/recipe | expanded-and-validated | Accepted `0.6.5`: 28 recipes/10 families | None | New proven gap | Complete | `docs/design/cross-domain-production-research-synthesis.md` |
| Static monster/ecology/loot | expanded-and-validated | Accepted `0.6.6`: 33 monsters, 9 fauna lineages, 9 ecology additions, 77 drop rows | None | New proven defect | Complete | `docs/dev/current-codex-output.md` |
| Cross-content coherence | active maturity gate | Accepted `0.6.4`-`0.6.6`, static lint/validators, retained research artifacts | Complete read-first audit and artifact decisions | Accepted `0.6.6` | Run exact `0.6.7` now | `docs/dev/current-codex-prompt.md` |
| Geographic Knowledge/recognition | queued user-directed design gate | Place/Knowledge authorities | Facets, clues, observation, overlays | Accepted `0.6.7` | Run after static audit | `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md` |
| Activity resolution reuse | queued repository audit | Selection, trial, quest, Knowledge, crafting, magic, and occurrence foundations | Repository ownership/reuse audit | Accepted Geography plan plus live route check | Run immediately after Geography; documentation only | `docs/dev/queued-activity-resolution-existing-system-reuse-audit-prompt.md` |
| Injury/trauma/Mortal Crisis/restoration | accepted authority; queued receipt contract | Injury, Mortal Crisis, save, occurrence | Functional/lethal/care/crisis receipts | Accepted Activity reuse audit | Run receipt contract; no catalog/runtime | `docs/design/static-content-restoration-and-mortality-research-sequencing-decision.md` |
| Generic `world.pois` | rejected | Specific owner families | None | Explicit decision | Never infer | `docs/design/discovery-poi-boundary-decision.md` |

## Maintenance Rule

Update this register only when a route identity, gate classification, reopening trigger, or near-term posture materially changes. Historical design documents should remain intact unless they contain a false live pointer that still controls execution.
