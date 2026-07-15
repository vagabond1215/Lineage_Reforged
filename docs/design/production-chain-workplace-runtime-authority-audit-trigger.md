# Production-Chain, Workplace, And Runtime-Authority Audit Trigger

Date: 2026-07-14
Status: approved documentation-only route refinement; no implementation permission

## Decision Summary

The accepted Gate 3 agriculture research established that the repository already consumes production-chain and workplace records through live economic resolution. Production chains remain non-inheriting for exact bounded recipe quantities, but they are not wholly inert descriptions.

Keep the seven named `GPT-DR.*` research gates. Do not add an eighth broad external-research gate solely because Gate 3 exposed live-consumer authority conflicts.

After Gate 6, `GPT-DR.crafting.tools-workplaces-production`, perform a mandatory trigger review before Gate 7. When the trigger conditions below are met, run one additional unversioned Codex audit:

`CODEX-AUDIT.production-chain-workplace-runtime-authority`

Expected temporary artifact when required:

`docs/dev/tmp-production-chain-workplace-runtime-authority-audit-YYYY-MM-DD.md`

This audit is a repository-authority and focused-test inspection, not a Deep Research gate and not a `0.6.x` primary version.

## Corrected Conditional Sequence

1. `GPT-DR.resources.gathering-extraction`
2. `GPT-DR.ecology.flora-fauna-byproducts`
3. `GPT-DR.agriculture.land-food-livestock`
4. `GPT-DR.materials.refinement-processing`
5. `GPT-DR.food.processing-preservation`
6. `GPT-DR.crafting.tools-workplaces-production`
7. mandatory audit-trigger review
8. when triggered: `CODEX-AUDIT.production-chain-workplace-runtime-authority`
9. `GPT-DR.magitech.production-infrastructure-substitution`
10. unversioned cross-domain research integration
11. any separately authorized narrow production-chain or workplace correction required by the integration
12. revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`

When the audit trigger is not met, record the skip decision with evidence and continue directly from Gate 6 to Gate 7.

## Gate 3 Evidence Requiring Preservation

Gate 3 verified that:

- `packages/engines/civilization-engine/src/runtime-economy.ts` loads production chains and workplaces for live economic craft and value resolution;
- `resolveCraftAtSettlement` can resolve chain outputs, output quantities, processing time, labor, material, processing, waste, skill, tool, and fuel effects;
- the accepted recipe-authority rule still prohibits automatic inheritance of exact bounded recipe quantities from production-chain profiles;
- `chain.farming.mixed_crop` can fall back from an empty gather step to the requested `crop_bundle` output;
- the mixed-crop chain currently uses Cooking rather than the existing Agriculture skill;
- Farmstead tool checks aggregate required tags across all jobs rather than only the active job and tier;
- these findings identify live integration risks but do not authorize a runtime or content fix.

Future gates and integration must preserve both sides of this authority boundary:

1. production chains and workplaces have live economic consumers;
2. they do not automatically own exact recipe ratios, physical source state, item-instance creation, or gameplay actions.

## Audit Trigger Conditions

Gate 6 must run the audit when one or more of the following remains unresolved after Gates 4-6:

1. multiple proposed recipes, material chains, or food chains depend on uncertain production-chain fallback, output, quantity, skill, tool, workplace-job, workplace-tier, fuel, waste, or cost semantics;
2. current design documentation materially conflicts with live production-chain or workplace consumers;
3. the revised `0.6.5` batch cannot be selected without deciding which production-chain fields are authoritative, descriptive, fallback-only, or runtime-derived;
4. Gate 4, Gate 5, or Gate 6 identifies a factual chain/workplace defect that affects more than one planned recipe or downstream material;
5. current tests do not isolate the behavior needed to distinguish intended abstraction from accidental coupling;
6. the integration would otherwise need to discover and adjudicate live resolver behavior while simultaneously synthesizing all seven research domains.

The audit may be skipped only when Gate 6 demonstrates all of the following:

- exact recipe authority remains separable from every live chain/workplace consumer;
- all resolver semantics relevant to the revised `0.6.5` target are already documented and covered by focused tests;
- no multi-recipe factual correction is pending;
- the integration can classify all chain/workplace candidates without further repository investigation;
- the skip rationale is recorded in the Gate 6 artifact and current coordination.

## Required Audit Scope

When triggered, the audit must inspect at minimum:

- production-chain schemas, records, loaders, validators, and focused tests;
- workplace schemas, records, job/tier definitions, loaders, validators, and focused tests;
- `runtime-economy.ts`, its public exports, call sites, and settlement-market construction;
- output fallback and requested-output behavior;
- processing-step input and output resolution;
- quantity resolution and defaulting;
- skill selection and fallback;
- tool-tag collection and active-job/tier filtering;
- workplace requirements and tier behavior;
- fuel, labor, material, processing, waste, time, and cost resolution;
- production-chain references from recipes, items, workplaces, economy, settlements, tests, and documentation;
- the exact distinction among macro process authority, economic-resolution authority, and bounded recipe authority.

The audit must classify each material discrepancy as one of:

- intentional abstraction;
- factual content defect;
- documentation defect;
- schema or validator precondition;
- focused-test gap;
- runtime implementation defect;
- authored-input requirement;
- non-blocking optional depth;
- blocked pending later runtime ownership.

## Required Audit Output

The temporary audit artifact must include:

1. live repository baseline and changed-since-Gate-6 review;
2. complete consumer and call-site inventory;
3. field-by-field authority matrix for production chains and workplaces;
4. fallback, job, tier, skill, tool, fuel, output, quantity, waste, time, and cost semantics;
5. focused-test coverage and uncovered branches;
6. discrepancy matrix with severity and affected consumers;
7. exact implications for revised `0.6.5`;
8. recommendation to preserve, document, correct, defer, or reject each issue;
9. whether a narrow prerequisite correction is required before revised `0.6.5`;
10. confirmation that no implementation behavior changed during the audit.

## Remaining-Gate Requirements

### Gate 4 — Materials

Gate 4 must distinguish:

- externally supported material-process order;
- canonical item and intermediate identity;
- production-chain static topology;
- live economic resolver behavior;
- exact bounded recipe authority;
- fallback-derived versus explicitly authored outputs;
- multi-consumer chain defects versus recipe-local requirements.

### Gate 5 — Food

Gate 5 must distinguish:

- food preparation and preservation evidence;
- current ingredient and preparation-state identities;
- chain stages and live economic resolution;
- bounded recipe inputs and outputs;
- abstract settlement storage versus future perishable-lot ownership;
- resolver behavior that could alter multiple planned food recipes.

### Gate 6 — Crafting And Production

Gate 6 owns the mandatory audit-trigger decision. It must make live production-chain and workplace consumption a central research lane rather than a footnote.

### Gate 7 — Magitech

Gate 7 runs only after Gate 6 records either:

- an evidence-backed audit skip; or
- an accepted production-authority audit artifact.

This preserves a known mundane production baseline before evaluating magical substitution.

## Integration Prompt Posture

The active and queued cross-domain integration prompts remain seven-research-artifact holds for now.

After Gate 6:

- if the audit is skipped, current coordination must record the evidence-backed skip and the integration prompts need no audit-artifact gate;
- if the audit is required, current coordination and both byte-identical integration prompts must be updated to require the accepted audit artifact before integration can begin.

Until that trigger decision, do not edit the integration prompts merely to add a speculative eighth artifact.

## Non-Goals

This decision does not:

- add an eighth Deep Research gate;
- change content, production chains, workplaces, recipes, schemas, validators, tests, runtime, UI, saves, migrations, dependencies, assets, economy behavior, or gameplay;
- select exact recipe quantities;
- fix mixed-crop, skill, tool, job, tier, fallback, cost, or output behavior;
- authorize a production-chain or workplace correction;
- select an agriculture, crafting, inventory, or economy runtime owner.

It only installs a conditional evidence checkpoint so the later integration does not absorb unresolved live-consumer authority analysis by accident.
