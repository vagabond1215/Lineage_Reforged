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
6. `docs/design/current-planning-anchor-reconciliation.md` when stale current-anchor wording in the roadmap or sequenced plan conflicts with the sources above.

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
| `0.6.6` | Monster, Ecology, And Loot Static Content Expansion | Active parent primary; authoring still fail-closed | Exact content target remains accepted. Begin only after `0.6.6.3` completes every validation and restores the exact parent prompt. | `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` |
| `0.6.6.1` | UTF-8 BOM Test-Harness Repair | Repair implementation landed; acceptance pending | Commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` changes the two intended test readers. Final acceptance is folded into `0.6.6.3`. | `docs/dev/current-codex-output.md` |
| `0.6.6.2` | BOM Repair Post-Validation And Parent Prompt Restoration | Completed fail-closed attempt; superseded | Repair scope and content identity passed, but the focused command stopped at `4/5` because the region climate contract was stale. No files changed and no parent prompt was restored. | `docs/dev/current-codex-output.md` |
| `0.6.6.3` | Region Climate Tendencies Contract Repair And BOM Acceptance | Active support suffix | Align the stale scalar contract to a non-empty normalized string array, rerun all BOM acceptance gates, restore exact `0.6.6`, and stop. | `docs/dev/current-codex-prompt.md` |
| `0.6.7` | Cross-Content Coherence And Coverage Audit | Reserved next | Install only after accepted `0.6.6`; repair only if evidence proves a defect. | `docs/design/static-content-expansion-program.md` |

## Identity Rules

- Three-segment labels are primary roadmap versions. Four-segment labels are support runs attached to one named primary.
- `three-segment support package` is invalid terminology.
- A historical proposed label is an alias only when a durable source maps it to a completed canonical label.
- An absent number is not evidence of missing work. `0.5.211` is an evidenced unused gap.
- GPT Deep Research and unversioned research/integration do not consume primary `0.6.x` numbers.
- Difficulty, World Rules, Stakes, injury, narrative, elemental, Mortal Crisis, save, and occurrence contracts remain unversioned until implementation packages are assigned.
- Stale current-anchor wording in the roadmap or sequenced plan does not override the active prompt, handoff, output, this register, or the planning-anchor reconciliation.

## Deferred Route Register

| Lane | Classification | Completed foundation | Missing layer | Reopening trigger | Near-term posture | Primary source |
| --- | --- | --- | --- | --- | --- | --- |
| Planning-anchor maintenance | accepted correction; full refresh deferred | Current handoff/output/register and refreshed continuity brief | Full roadmap and sequenced-plan current-header maintenance | Dedicated documentation maintenance or next material roadmap rewrite | Do not treat stale headers as execution authority | `docs/design/current-planning-anchor-reconciliation.md` |
| Static world/settlement | expanded-and-validated | Accepted `0.6.4` | None | New proven gap | Complete | `docs/design/static-content-expansion-program.md` |
| Static item/material/recipe | expanded-and-validated | Accepted `0.6.5`: 28 recipes/10 families | None | New proven gap | Complete | `docs/design/cross-domain-production-research-synthesis.md` |
| Static monster/ecology/loot | active parent primary; contract repair and support validation required | Exact matrix and closed references; BOM repair landed; repair scope/content identity passed | Align region climate contract, rerun focused/lint/typecheck/parent baseline, restore exact parent prompt, then run package | Accepted `0.6.6.3` | Contract repair and validation first; no content authoring in support pass | `docs/dev/current-codex-prompt.md` |
| Cross-content coherence | reserved maturity gate | Static lint/validators | Audit `0.6.4`-`0.6.6` | Accepted `0.6.6` | Run `0.6.7` next | `docs/design/static-content-expansion-program.md` |
| Geographic Knowledge/recognition | queued user-directed design gate | Place/Knowledge authorities | Facets, clues, observation, overlays | Accepted `0.6.7` | Run after static audit | `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md` |
| Activity resolution reuse | queued repository audit | Selection, trial, quest, Knowledge, crafting, magic, and occurrence foundations | Repository ownership/reuse audit | Accepted Geography plan plus live route check | Run immediately after Geography; documentation only | `docs/dev/queued-activity-resolution-existing-system-reuse-audit-prompt.md` |
| Injury/trauma/Mortal Crisis/restoration | accepted authority; queued receipt contract | Injury, Mortal Crisis, save, occurrence | Functional/lethal/care/crisis receipts | Accepted Activity reuse audit | Run receipt contract; no catalog/runtime | `docs/design/static-content-restoration-and-mortality-research-sequencing-decision.md` |
| First lethal-process/stabilization catalog | research-gated | Comparative principles and abstract authority | Bounded physiology/first-aid research and owner contract | Receipt contract confirms readiness | Research then plan; no inferred content | `docs/design/static-content-restoration-and-mortality-research-sequencing-decision.md` |
| Difficulty/World/Stakes | accepted; not implemented | Axes, topology, occurrence, commitment, correction | Schemas, persistence, migration, adapters, UI/tests | Separate authorization | Legacy runtime remains | `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md` |
| Narrative realization | accepted; not implemented | Grammar, observer projection, exact occurrence facts | Corpus, persistence, adapters, runtime/UI/tests | Explicit route | Preserve; hide uncertainty internals | `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md` |
| Elemental alignment/stimulus | accepted; not implemented | Canon and response boundaries | Schemas, persistence, adapters, content/UI/tests | Owner authorization | Preserve bounded input | `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md` |
| Ironbound continuity/death/Prestige | accepted; not implemented | One head, commitment, correction, closure | Receipts, persistence, settlement, migration/UI/tests | After Mortal Crisis receipts | Preserve finality | `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md` |
| Rich culinary/dietary | accepted; not implemented | Quantity, rations, metabolism, protein, attributes | Runtime/schema/save/UI | Explicit authorization | No new research now | `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md` |
| Contextual inventory/crafting/trade/actions | accepted; not implemented | Contextual owner surfaces | Owner-specific execution | Focused prompt | No universal menu | `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md` |
| Generic delivery/replay | accepted boundary; not implemented | Request/admission/occurrence/result/correction | Representative adapters, persistence, diagnostics/tests | Separate authorization | Do not prebuild buses | `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md` |
| Activity advancement/preview | consumer gate | Engine-owned selection/body direction | Preview/execution/expenditure/growth | Body-state route | Deferred | `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md` |
| Rest/preview | consumer gate | Travel/activity/sleep direction | Preview/execution/body recovery/Chronicle | Body-state route | Deferred | `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md` |
| Quest turn-in | consumer gate | Acceptance/tracking | Completion, inventory, payout, standing, Chronicle | Static/Geography disposition | Deferred | `docs/future_content_backlog.md` |
| Services | paused | Five planned records/schema/validator/lint | Fresh proven need | Owner proves need | Reuse existing | `docs/design/service-authority-post-registration-audit.md` |
| Resources/commodities | research-integrated; paused | Two resources and pairs | Relationship/schema/seed decision | Dedicated reopening | Existing only | `docs/design/resource-commodity-post-registration-audit.md` |
| People/NPC/social/schedules/companions | authored-input gate | Boundaries/schema | Named authored people and runtime owner | Named source | Deferred | `docs/design/npc-social-authority-boundary-decision.md` |
| Diplomacy/conflict/order/government | authored-input gate | Static boundaries | Canonical inputs/simulation owners | Lane evidence | Deferred | `docs/design/future-system-design-ledger.md` |
| Business/faction/institution | authored-input gate | Ownership boundaries | Canonical catalogs/consumers | Named source | Deferred | `docs/design/future-system-design-ledger.md` |
| Inventory/storage/crafting execution/dynamic economy | consumer gate | Static identities/contextual authority | Instances, execution, pricing, persistence | Owner research/prompt | Static only | `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md` |
| Encounter/spawn/dynamic loot/runtime ecology | consumer gate; uncertainty migration | Static/elemental/occurrence foundations | Selection/population/channels/persistence | Post-`0.6.7` explicit route | Static expansion grants no runtime | `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md` |
| Settlement population/construction/property/tax/law | consumer gate | Static civic descriptions | Mutable systems/obligations | Dedicated owner design | No generic scalars | `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md` |
| Magical books/tomes/scrolls | authored-input gate | Spell database/metadata | Acquisition/item owner | Dedicated approval | Deferred | `docs/future_content_backlog.md` |
| Enchanter documents | authored-input gate | Enchanter owner selected | Spell/document contract | Spell database/prompt | Deferred | `docs/future_content_backlog.md` |
| Region-based maps | authored-input gate | Region/map authority | Cartography/information friction | Approved source | Deferred | `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md` |
| Generic `world.pois` | rejected | Specific owner families | None | Explicit decision | Never infer | `docs/design/discovery-poi-boundary-decision.md` |
| Highcrown Knowledge | closed | Parent/district/site coverage | None | New canon/proven defect | No filler | `docs/future_content_backlog.md` |

## Maintenance Rule

Update this register only when a route identity, gate classification, reopening trigger, or near-term posture materially changes. Historical design documents should remain intact unless they contain a false live pointer that still controls execution.
