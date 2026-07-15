# Current GPT Handoff

Source route: `CODEX-AUDIT.production-chain-workplace-runtime-authority`

Date: 2026-07-15

## Status

Gates 1-6 and the focused production-authority audit are accepted.

Audit evidence:

- Starting head: `19107302631791c17e1a4320e723d88609b8f65f`
- Accepted evidence ending head: `acfac740396e44160bf47d1f4b16a4e572d554d9`
- Artifact: `docs/dev/tmp-production-chain-workplace-runtime-authority-audit-2026-07-15.md`
- Artifact commit: `acfac740396e44160bf47d1f4b16a4e572d554d9`
- Decision: `NO_NARROW_CORRECTION_REQUIRED_BEFORE_REVISED_0_6_5`
- Scope: documentation-only audit; no content, schema, validator, test, runtime, market, transport, UI, save, dependency, asset, or gameplay behavior changed.

The coordination commit containing this handoff follows the accepted evidence ending head and is intentionally not self-referential. The completion report must provide that exact final repository head.

Latest completed primary:

- `Version 0.6.4 - World And Settlement Static Content Expansion`

Blocked primary:

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
- It remains blocked behind Gate 7 and cross-domain integration.
- Do not author partial recipes, inherit chain/workplace quantities, call the macro resolver for recipe admission, or guess missing ratios.

## Accepted Research And Audit Route

| Gate | Artifact | Commit / decision |
| --- | --- | --- |
| 1. Resources | `docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md` | `780513115686ce9c9f5f3828229cd9e2e4a78d09` |
| 2. Ecology | `docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md` | `fed3b904b03a8233d101935de01322212cb71e5e` |
| 3. Agriculture | `docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md` | `55b687f88df2375d4cefa066aa75bf267e1d48df` |
| 4. Materials | `docs/dev/tmp-materials-refinement-processing-research-2026-07-14.md` | `1efd9a3ff430fe6dfde00ff436c71457c3911ea5` |
| 5. Food | `docs/dev/tmp-food-processing-preservation-research-2026-07-14.md` | `c9b8834bbbf5737b41915d4b94528aa9da51a57f` |
| 6. Crafting/workplaces | `docs/dev/tmp-crafting-tools-workplaces-production-research-2026-07-14.md` | `1e2f16e2558ee44c64c48eb2844425efdf30f0ca`; `AUDIT_TRIGGERED` |
| Focused audit | `docs/dev/tmp-production-chain-workplace-runtime-authority-audit-2026-07-15.md` | `acfac740396e44160bf47d1f4b16a4e572d554d9`; accepted |

All temporary research artifacts remain repository-grounded integration inputs, not direct canon or implementation permission.

## Reproduced Baseline

- 1,372 items; 131 tool-class items; 1,617 market item values; 121 skills.
- 121 production chains; 58 workplaces; 12 planned recipes across eight families.
- 322 declared stages; 311 processing steps: 227 workplace and 84 extraction.
- Step inputs: 19 explicit and 292 empty.
- Step outputs: 132 explicit and 179 empty/runtime-filled.
- 28 variant chains with 162 variants.
- 17 declared stages across six chains have no processing step.
- 11 generic-primary/default-variant conflicts.
- Six selected-variant input flags replace nonempty explicit inputs.
- 17 non-variant chains omit 62 top-level output occurrences from default final results.
- All 121 chains set `carriesForward: true`; runtime carries no step state.
- All 12 live recipes differ from linked default resolver behavior in input set, output set, or quantity.
- Candidate index: 916 entries across 435 keys; 129 keys have multiple candidates; 48 candidate entries do not return their indexed target.
- Gate 6's exact one fully later-shadowed ordered-index path is `chain.forage.wild_harvest.hut`. The `120/1` count is index participation, not current value selection.
- Default values select 109 chains at least once; 12 are never selected.
- Workplaces contain 208 jobs across 110 job IDs, 298 tool-tag occurrences across 100 unique tags, 484 inputs, 365 deterministic outputs, six yield groups with 147 outputs, 105 progression tiers, and 116 upgrades.

## Complete Consumer Boundary

Direct and transitive production consumers are:

1. raw chain/workplace content loaders;
2. runtime indexes for chain IDs, output candidates, and chain-primary-skill output groupings;
3. `resolveCraftAtSettlement` / macro craft estimation;
4. recipe-derived item-value resolution and cheapest-candidate selection;
5. local settlement market price views;
6. authoritative civilization tick market construction;
7. transport stock adjustment and repricing;
8. autonomous trade margin, opportunity, cargo, and dispatch logic;
9. simulation-consistency graph/source/reference reporting;
10. semantic lint and recipe, settlement-economy, resource, commodity, and building/workplace validators;
11. public shared craft/value/market contracts and engine exports;
12. a dormant UI economy-clarity mapper with no live caller;
13. focused runtime, recipe, consistency, settlement, trade, transport, and institution tests.

Settlement simulation and institution runtime receive market state structurally but currently read stock/storage context, not chain-derived `priceView` or labor-pressure values. Do not claim current chain cost defects directly change those projections.

## Major Authority Findings

- Production chains own macro process/economic context, not exact bounded recipe ratios or physical execution.
- Planned recipes own complete explicit static inputs, outputs, integer quantities, roles, workplaces, exact tool item keys, skills, and an optional non-inheriting chain link. The civilization engine does not load recipes.
- Effective input precedence is selected flagged variant inputs (replacing explicit), otherwise explicit inputs, otherwise workplace heuristic inputs, otherwise chain intermediate/external fallback.
- Output precedence separates explicit and empty-step branches. Workplace outputs can outrank variants on empty workplace steps; only the last step supplies the final public result.
- Stages are not iterated; processing steps execute in array order. Intermediates and byproducts do not carry.
- Every selected input occurrence counts as one. Workplace per-cycle quantities, cycle time, worker rates, capacity, tiers, progression, upgrades, and output roles are ignored.
- Runtime quantity/quality, time, labor, material, processing, waste, and total cost are hard-coded macro estimates. They do not mutate inventory or create batches/items.
- Step skill can override chain skill; below-minimum skill never blocks output; `lowSkillOutcome` is ignored. Recipe skill remains independent.
- Tool tags are unioned across every workplace job; the first primary job chooses penalty mode. `no_output` computes `blocked` and then discards it, so output persists.
- Five tool tags have no exact item-key counterpart; never infer aliases.
- Fuel shortage is a cost/time scalar for 50 fuel-heavy steps in 37 chains. No fuel item is selected or consumed. Workplace power modes are inactive metadata.
- Candidate role is ignored by item-value choice; missing requested outputs fall back to the first returned quantity. Associated labor skill uses the first candidate rather than the cheapest winner.
- Value effects propagate into market prices, transport repricing, and trade. They do not prove physical production.
- Raw loader casts hide production-chain and workplace TypeScript drift. Normal lint does not execute strict workplace schema conformance and does not validate resolver topology.
- Stonevein's subterranean-city compatibility produces zero placed buildings despite an existing extractive-building assertion. The exact content fix remains an integration-authored question.

## Discrepancies And Focused Tests

The audit records 29 discrepancy rows.

Classification counts are non-exclusive:

- `intentional_abstraction`: 7
- `factual_content_defect`: 1
- `documentation_defect`: 11
- `schema_or_validator_precondition`: 6
- `focused_test_gap`: 19
- `runtime_implementation_defect`: 8
- `authored_input_requirement`: 10
- `non_blocking_optional_depth`: 1
- `blocked_pending_later_runtime_ownership`: 3

Severity counts:

- critical: 0
- high: 17
- medium: 11
- low: 1

Disposition counts:

- preserve: 1
- document: 3
- quarantine from revised `0.6.5`: 9
- defer to integration: 13
- defer to Gate 7: 1
- defer to later runtime: 1
- reject as scope: 1
- correct before revised `0.6.5`: 0

The 48-row branch matrix has one covered behavior, 10 partially covered behaviors, and 37 uncovered behaviors. Exact tests are required before any later resolver correction for candidate/tie/source/role behavior; all variant branches; all input/output branches; stage/final/carry closure; tools/jobs/blocking; skill fallback/dimensions; fuel; quantity/quality/byproduct value; downstream propagation; and the 12 non-inheritance comparisons.

Reproduced checks:

- Mandatory four-file group: 136/136 passed.
- Schema-file checks: 105/105 passed.
- Normal content lint: `content-lint: ok (67 files checked)`.
- Trade and institution runtime tests: 4/4 passed.
- Transport and settlement simulation: 3/8 passed. Transport remains 3/7 with four pre-existing failures; settlement simulation remains 0/1 on Stonevein.
- All temporary audit probes were removed. The older ignored `.tmp-rpg-ui-node.tsbuildinfo` predates the audit and was preserved.

## Narrow-Correction And Revised 0.6.5 Boundary

No narrow correction is required before the revised static package only because every disputed resolver field can be quarantined.

Integration must:

1. author every selected recipe as a complete explicit record;
2. keep `relatedProductionChainId` descriptive and non-inheriting;
3. avoid using chain resolver, runtime value, market price, candidate order, workplace I/O, tags, or fallback for recipe admission or quantities;
4. select, revise, or omit the 18 historical candidates only from integrated authored evidence;
5. preserve quantity-confidence notes and dependency closure;
6. reverse the audit decision and route a prerequisite correction if any selected package depends on disputed resolver behavior.

Historical blocker remains:

- 15 proposed rows name inputs absent from their named chain vocabulary.
- `recipe.flour_to_bread_dough` has the sole exact input/output step shape but no authoritative ratio.
- `recipe.flour_to_pastry_dough` omits chain-declared `honeycomb`.
- `recipe.pastry_dough_and_smoked_meat_to_savory_meat_pie` has no exact chain step consuming `smoked_meat`.

Integration may schedule narrow documentation, type, validator, test, content, or runtime corrections separately. The audit authorizes none.

## Immediate Next Executable Work

Active next route:

`GPT-DR.magitech.production-infrastructure-substitution`

Expected artifact:

`docs/dev/tmp-magitech-production-infrastructure-substitution-research-2026-07-14.md`

Gate 7 must preserve all 43 physical-demand categories, 11 multi-affinity questions, nine canonical affinities, 11 domain contexts, the ordinary-production baseline, matter/energy conservation, finite capacity, recharge, mundane housing, maintenance, observable failure, scarcity, institutional access, and ordinary fallback.

Current workplace power modes, fuel flags, output quantities, and infrastructure modifiers are demand/context evidence only. They do not prove magical capability or an active production-energy system.

Suggested Gate 7 commits:

1. `docs/research): add magitech substitution gate findings`
2. `docs(coordination): advance production research to integration`

## Integration Holds

`docs/dev/current-codex-prompt.md` and `docs/dev/queued-cross-domain-production-research-integration-prompt.md` remain byte-identical Git blobs:

`bf960cab858a8499874ed1dc0e33fb4ee98bd1dc`

Do not run or edit either hold for Gate 7. They already require all seven accepted research artifacts plus the accepted audit artifact. Cross-domain integration remains blocked until Gate 7 is accepted.

## Route

1. Gates 1-6 research — complete
2. Focused production-authority audit — complete
3. Gate 7 magitech research — active next
4. Cross-domain integration — blocked
5. Any separately authorized narrow correction selected by integration
6. Revised `Version 0.6.5`
7. `Version 0.6.6`
8. `Version 0.6.7`
9. Geographic Knowledge Taxonomy And Location Recognition Contract Plan
