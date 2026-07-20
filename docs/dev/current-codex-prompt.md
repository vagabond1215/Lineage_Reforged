# Current Codex Prompt

## Run Identity

`Rich Culinary And Dietary Research Results Repair And Acceptance Audit`

Run classification: unversioned documentation-only audit and coordination
Milestone impact: `supports_current_band`
Parent version: none

Run this as one bounded repair-and-acceptance audit of the completed culinary research artifacts. Correct the documented defects, incorporate the accepted regional-ration manifest decision, and produce decision-ready artifacts for GPT/human review. Do not implement content, schemas, validators, runtime, UI, saves, economy, or gameplay.

Suggested commit:

`docs(food): repair and accept culinary research results`

## Route Context

The prior unversioned `Rich Flora, Fauna, Culinary, Nutrition, And Dietary Systems Audit And Research` completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`.

Its narrative research is useful, but inspection found blocking defects in repository-path indexing, matrix dispositions, package classification, and package dependency ordering. The user then accepted a more exact ration architecture in `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`.

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled. Its exact prior prompt remains recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and source blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

After this audit completes, stop for GPT/human review. Do not install an implementation prompt, restore `0.6.6`, assign a primary version number, or implement any recommended package.

## Execution Gate

1. Read:
   - `AGENTS.md`;
   - `README.md`;
   - `docs/dev/current-codex-output.md`;
   - `docs/dev/current-gpt-handoff.md`;
   - `docs/dev/current-codex-prompt.md`;
   - `docs/dev/historical-version-and-deferred-route-register.md`;
   - `docs/design/internal-versioning-and-release-milestone-policy.md`;
   - `docs/design/rich-culinary-dietary-system-research-program.md`;
   - `docs/design/packed-food-ration-and-provisions-content-plan.md`;
   - `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
   - `docs/design/cross-domain-production-research-synthesis.md`;
   - the three temporary culinary research artifacts named below;
   - the live repository owners needed to verify any disputed path, id, relationship, or count.
2. Run `git status`, fetch, and fast-forward pull. Record starting commit, branch, and clean/dirty state. Preserve unrelated work.
3. Confirm the active prompt is this repair-and-acceptance audit.
4. Confirm the completed research commit is an ancestor of the current branch and the three temporary artifacts exist.
5. Confirm the held `0.6.6` prompt still resolves to source blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
6. Confirm the new regional-ration decision is present and unchanged before repairing the artifacts.
7. Confirm retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`; do not edit, delete, consume, or repurpose them.
8. Stop without editing if repository authority has materially changed so the correction rules below are false. Report the smallest coordination repair required.

## Purpose

Repair the temporary research artifacts so they accurately distinguish:

- repository fact from design readiness;
- source-output closure from edibility/safety closure;
- direct-consumption foods from containers and bulk storage;
- global ration archetypes from geographic fulfillment profiles;
- generated physical manifests from character knowledge;
- fixed manifests from constrained regional RNG;
- static bundle authority from inventory-instance and open-command authority;
- valid version classes from vague or parentless support labels.

The result must be a coherent reviewed basis for selecting the smallest later implementation package. It must not itself authorize implementation.

## Required Repair 1: Repository Path Index

Correct every nonexistent, stale, or renamed repository path in the source index and narrative.

At minimum replace these incorrect paths:

- `docs/dev/internal-versioning-and-run-labeling-policy.md` -> `docs/design/internal-versioning-and-release-milestone-policy.md`;
- `docs/design/rich-flora-fauna-culinary-nutrition-dietary-research-program.md` -> `docs/design/rich-culinary-dietary-system-research-program.md`;
- `docs/design/packed-food-itemization-and-nutrition-semantics-plan.md` -> `docs/design/packed-food-ration-and-provisions-content-plan.md`.

Add `docs/design/regional-ration-manifest-and-container-knowledge-decision.md` to the authority index with its exact scope.

Verify every repository path listed in the source index against the live tree. Do not report path verification as passed unless every listed local path resolves.

## Required Repair 2: Matrix Semantics

Retain the stable JSON shape where practical, but correct dispositions, confidence, provenance, required authorities, evidence notes, and summary counts.

### Food safety before profile readiness

A raw, biologically derived, conditionally edible, or safety-unknown identity must not be classified as merely `needs_consumable_profile` when edibility/preparation/safety is the prior blocker.

Use `needs_food_safety_authority`, `needs_source_relationship`, `collision_or_misclassification`, or `defer` as appropriate.

Examples requiring review include raw meats, raw fish/shellfish, milk, eggs, mushrooms, unfamiliar plant parts, and monster-derived biological outputs.

A repository `consumable` role is capability metadata and does not prove safe direct consumption.

### Existing source-output relationships

Do not classify a flora/fauna/monster record as `needs_source_relationship` merely because edibility is unknown when it already explicitly emits a resolved item key.

Distinguish:

- source/output relationship exists;
- source-part qualification is incomplete;
- food-grade edibility is unknown;
- preparation or safety authority is missing.

Use dispositions and `requiredAuthorities` that name the missing layer rather than denying an existing relationship.

### Orphan profiles

Do not classify an orphan consumable profile as `ready_profile_link_after_correction` solely because a similarly named item could be created later.

Each orphan profile must be classified as one of:

- retain pending exact named direct-serving identity;
- retire;
- replace;
- authored-input-required;
- defer.

Use the permitted disposition vocabulary honestly. Profile existence is not authority to create or relink an item.

### Confidence and provenance

`confidence: high` may describe a repository fact such as an existing field or reference. It must not imply high confidence in a design disposition that still requires authorship.

Where one row mixes fact and recommendation, make the evidence notes and provenance explicit or lower the confidence.

### Prepared food without recipe

Keep `preparedFoodishItemsWithoutRecipeProducer` as a topology signal, not a recipe backlog.

Distinguish finished foods, intermediates, casks, service/presentation identities, possible taxonomy errors, and legitimate source products. Do not imply that all 99 records require recipes.

## Required Repair 3: Accepted Ration Architecture

Integrate the following accepted decisions into the narrative, matrix candidate packages, open questions, and package sequence.

### Four-layer model

1. ration archetype;
2. geographic fulfillment profile;
3. resolved physical manifest;
4. mutable contents-knowledge state.

### Archetypes

- size bands: `small`, `medium`, `large`;
- composition families may include `fruit`, `fruit_and_nut`, `preserved_protein`, `mixed`, `meal_provisions`, `hearty_provisions`, and `luxury_provisions`;
- size describes serving/capacity posture, not quality;
- do not require every size/composition permutation;
- regional variants normally share a primary character-facing name;
- origin remains visible through subtitle, provenance, or inspection detail.

### Geographic fulfillment

- profiles may conceptually scope to region, country, continent, institution, or global;
- use only canonical live geography/institution ids;
- origin comes from the pack creation source/profile, never the character's opening location;
- fallback must be explicit and authored, never inferred from names or map position.

### Manifest generation

- generate and lock the manifest when the physical pack instance enters the world/ownership graph;
- valid generation points include purchase, self-packing, starting grant, institutional issue, loot generation, merchant stock, and quest/event award;
- opening-time RNG is rejected;
- transfer must not reroll contents;
- opening deterministically replaces one pack with its already-resolved contents.

### Fixed and random contents

- self-packed, fixed starting, and standard issue packages use explicit manifests;
- commercial or scavenged assortments may use constrained regional RNG;
- RNG operates through typed required slots and weighted candidate lists;
- the exact rolled manifest is stored;
- initial implementation should prefer fixed manifests or narrow weighted lists until inventory-instance metadata and stacking are proven.

### Contents knowledge

Treat `contentsKnowledge` as mutable instance state, not a static item tag.

Minimum candidate states:

- `unknown`;
- `category_known`;
- `manifest_known`.

The actual manifest always exists independently of character knowledge. A future `verified` state or `knowledgeSource` may be deferred until inspection, deception, counterfeit labeling, appraisal, or merchant trust justify it.

### Stacking

Future stack compatibility must consider archetype/profile, origin, manifest or manifest hash, knowledge state, seal state, and later quality/condition.

Do not merge incompatible manifests or known and unknown packages unless per-unit metadata is preserved.

### Fresh and bulk packages

- preserved rations come first;
- do not promise persistent `fresh` behavior before age/storage/freshness ownership exists;
- market or hospitality package names may be proposed without claiming spoilage execution;
- bulk sacks, barrels, casks, and crates remain separate from personal rations even if future infrastructure is shared.

## Required Repair 4: Package Sequence And Dependencies

Replace the prior circular sequence with this reviewed candidate order:

1. Research Results Repair And Acceptance Audit — this run;
2. Food-Named Taxonomy And Consumable-Profile Integrity;
3. Provision Archetype And Geographic Fulfillment Schema;
4. Named Preserved Food Foundation;
5. Inventory Manifest, Knowledge, And Stack Contract;
6. Ration Catalog And Starting-Bundle Migration;
7. Engine-Owned Open-Pack Command;
8. Nutrition And Satiety Authority;
9. Regional Cuisine And Food Lore;
10. Storage, Spoilage, And Food-Safety Runtime, deferred unless justified.

Required dependency corrections:

- ration migration must not promise explicit contents before the archetype/fulfillment owner exists;
- the provision schema must not depend on the nutrition/satiety package because packs own no aggregate nutrition;
- variable regional packages must not execute before manifest/knowledge/stack ownership exists;
- the open command must consume a stored manifest and never roll contents;
- regional cuisine must name a valid lore/culture owner before editing ecology authority.

For every package report:

- label-class recommendation without assigning a number;
- exact owner and scope;
- prerequisites;
- proposed files;
- required validation;
- risks;
- rollback boundary;
- relation to queued `0.6.6`;
- provenance;
- whether the package is implementation-ready, design-ready only, or blocked.

## Required Repair 5: Version Classification

The prior recommendation `four-segment support run attached to the nearest accepted body-state/content authority` is invalid.

A support suffix must name exactly one primary parent and be required to repair, validate, clarify, or accept that parent.

For the first taxonomy/profile-link correction package, evaluate:

- support suffix attached specifically to accepted `0.6.5`, if the defects are proven consequences or acceptance repairs of that exact static-content package; versus
- a new current-band three-segment primary capability, if the package materially creates or changes durable cross-content authority beyond parent repair.

Do not assign the actual version number. State the recommended class, exact parent if support, and evidence required for acceptance.

## Required First-Package Recommendation

After repairs, select the smallest coherent later implementation package.

The expected candidate remains the proven food-taxonomy and consumable-profile integrity correction, but do not preserve that conclusion automatically. Re-evaluate whether:

- all exact corrections are known;
- removal versus relinking is decided;
- the sausage identities have exact intended branch/subbranch values;
- cask-scale serving identity is sufficiently resolved;
- validation can be narrow and non-name-fragile;
- its version class is valid.

If any exact edit remains unresolved, mark the package design-ready but not implementation-ready and list the missing user decisions.

## User Context Questions To Preserve

Do not guess unresolved choices. At minimum retain or refine questions for:

- exact initial size-to-serving quantities;
- initial size/composition combinations;
- whether `large` means personal multi-day supply, party supply, or separate variants;
- canonical geography scopes currently available;
- explicit profile fallback behavior;
- whether origin can itself be unknown;
- whether inaccurate commercial labels are deferred;
- authored versus manifest-derived package value;
- packaging consumed/retained/replaced posture;
- whether the Traveler starting bundle intentionally lacks provisions;
- whether `hearty` guarantees meal-role coverage before satiety exists;
- variable-pack stacking before per-unit metadata;
- exact first correction version class;
- exact retain/retire/replace disposition of each orphan profile;
- exact intended taxonomy of the three sausage records;
- removal versus exact relink for each bad profile link.

## Required Artifacts

Repair and replace exactly these three temporary artifacts:

1. `docs/dev/tmp-rich-culinary-dietary-system-research-2026-07-19.md`
2. `docs/dev/tmp-rich-culinary-dietary-audit-matrix-2026-07-19.json`
3. `docs/dev/tmp-rich-culinary-dietary-source-index-2026-07-19.md`

Also overwrite:

4. `docs/dev/current-codex-output.md`

The artifacts remain temporary after this run. Do not promote them into a new durable synthesis, delete them, or install an implementation prompt. GPT/human review owns final acceptance and disposition.

## Allowed Tracked Files

Modify only:

- `docs/dev/tmp-rich-culinary-dietary-system-research-2026-07-19.md`;
- `docs/dev/tmp-rich-culinary-dietary-audit-matrix-2026-07-19.json`;
- `docs/dev/tmp-rich-culinary-dietary-source-index-2026-07-19.md`;
- `docs/dev/current-codex-output.md`.

Do not modify:

- this prompt;
- the new regional-ration decision;
- the packed-food plan;
- the research program;
- handoff, route register, roadmap, sequence, backlog, or `AGENTS.md`;
- held `0.6.6` prompt;
- source content, schemas, validators, tests, runtime, UI, saves, dependencies, assets, or generated outputs;
- retained Gate 1-5 or Gate 7 artifacts.

Untracked scratch scripts may be used for analysis but must not be committed and must be removed before completion.

## Prohibited Scope

Do not add, remove, rename, or modify any item, profile, recipe, flora, fauna, monster, ecology, region, geography record, starting bundle, workplace, service, production chain, schema, validator, test, engine, command, event, inventory state, body state, UI, save, migration, economy, dependency, asset, or gameplay behavior.

Do not assign nutritional numbers, serving quantities, regional contents, weights, values, RNG weights, fallback ids, or freshness durations as implemented facts.

Do not implement manifests, knowledge states, stack rules, pack opening, or regional selection.

## Validation

1. Parse the repaired matrix with a strict JSON parser.
2. Verify every repository id, key, and path cited in the matrix against the live repository.
3. Verify every local path in the source index exists.
4. Verify all disposition, confidence, and provenance values use the permitted vocabulary.
5. Confirm `needs_food_safety_authority` is used where safety is the actual first blocker and not merely mentioned in prose.
6. Sample and review every disposition family, not only aggregate counts.
7. Verify rows with explicit source outputs do not falsely claim the source relationship is absent.
8. Verify orphan profiles are not automatically marked ready to link.
9. Reconcile summary counts with row data and narrative statements.
10. Verify all nine future implementation packages plus this audit are represented consistently in the narrative and matrix.
11. Verify no package dependency cycle remains.
12. Verify no support recommendation lacks an exact parent.
13. Verify the ration architecture matches the focused decision exactly.
14. Check local Markdown links.
15. Run conflict-marker and trailing-whitespace searches.
16. Run `git diff --check`.
17. Review the complete changed-path set and full diff.
18. Confirm exactly the four allowed tracked files changed.

Do not run builds, typechecks, dependency installation, servers, generators, content lint, or automated test suites. This remains a documentation audit.

## Stop Conditions

Stop and report instead of guessing when:

- the exact intended taxonomy for a collision is not established;
- an orphan profile lacks a retain/retire/replace decision;
- a geographic scope id or hierarchy is not canonical;
- a regional fulfillment rule would invent cuisine or trade canon;
- an item looks edible but safety/preparation is unresolved;
- an exact package dependency cannot be made acyclic;
- a support label cannot name one exact parent;
- matrix automation cannot distinguish repository fact from design readiness;
- the corrected summary cannot reconcile with the row data.

A clearly bounded partial repair is preferable to fabricated acceptance.

## Documentation And Completion

Overwrite `docs/dev/current-codex-output.md` with:

- run identity and date;
- branch and starting commit;
- label class `unversioned`;
- parent `none`;
- milestone impact `supports_current_band`;
- files changed;
- commands and checks run;
- exact artifact paths;
- defects repaired;
- remaining blockers;
- corrected ration/manifest/knowledge model;
- corrected package sequence;
- first later implementation-package recommendation and readiness state;
- version-class recommendation without assigning a number;
- confirmation that no content or behavior changed;
- next recommended run: GPT/human acceptance inspection of the repaired artifacts;
- suggested commit.

Do not overwrite this current prompt. Do not install the implementation or held `0.6.6` prompt.

## Completion Report

Report starting commit/state, exact files repaired, path-index corrections, matrix semantic changes and revised counts, ration architecture incorporation, package-sequence corrections, version-class posture, selected first package and blockers, checks, unchanged content/runtime behavior, unresolved user decisions, and suggested commit.