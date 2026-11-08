# Native-v3 Contextual Consumption: Connector-Safe First-Sequence Plan

Date: 2026-11-08
Status: connector-reviewed plan for documentation-only implementation; NOT executable gameplay authorization
Source: draft PR #70 at fad907301d85786feaeed9cf8fecf64bc9d37949, stacked on PR #69 at 2b8214476bf0b11433c624fecf4207618b49fe9d
Game: 0.1.1-prealpha, integrated loop
Scope: source inspection and proposed owner/UI reconciliation only

## Objective and constraints

Settle the invocation-surface versus execution-owner boundary for carried food, served food, nearby shared sources and sealed provisions before the next Codex gameplay pass. Produce a source-grounded, auditable recommendation and a narrowly executable successor. Do not assume that an authored item, an icon, a descriptive place, or a proposed action proves a runtime capability.

This work does not authorize UI code, runtime logic, schemas, content, Save migration, testing with user accounts, branch integration, publication, or Game-version changes. The owner's 2026-11-08 report describes authenticated private staging version 6 completing Soundings and five-gold payment; this report is external operational evidence, not independently revalidated through this connector pass. Keep staging version 6 and the currently satisfied exact-artifact publication boundary unchanged; HOLD_SELECTED_ATOMIC_ACTIVATION remains.

## Source register and precedence

1. docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md: accepted item/entity/location invocation rules; explicit inventory Eat/Drink, separate container, culinary-process, social and market owners.
2. docs/design/contextual-player-action-and-command-architecture-decision.md: defined architecture with implementation not yet authorized; source facts -> observation -> domain affordance -> concrete command -> owner revalidation -> admitted state. Presentation descriptors are not authority or idempotency tokens.
3. docs/design/local-scene-context-projection-decision.md: accepted documentation boundary; local scene is an ephemeral, observed projection. Static maps, prose and site labels do not establish exact local instance identity.
4. docs/design/ui-information-architecture-boundary.md: primary contextual actions belong near the selected/inspected context; Home/Current Situation does not invent eligibility.
5. docs/design/item-equipment-inventory-authority-boundary-decision.md: canonical item definition, profile, owned stack/instance, effect and transaction are different authorities.
6. docs/design/packed-food-ration-and-provisions-content-plan.md and docs/design/regional-ration-manifest-and-container-knowledge-decision.md: a sealed pack is not directly edible; its already-resolved named contents and knowledge/manifest are separate. These documents do not authorize a live Open command.
7. docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md: serving and composition/quantity vocabulary; inherited game-scale calories do not decide portion semantics.
8. docs/design/combat-item-consumable-activation-prerequisites-prework-2026-10-20.md: carried-item nutrition use is not an authorized combat-item command; no bypass of combat timing or treatment effects.
9. Exact PR #70 source: apps/rpg-ui/src/features/NativeCharacterPanel.tsx, game-shell/nativeSelectedCharacter.ts, game-shell/nativeSessionItemActions.ts, game-shell/nativeFungibleActions.ts, game-shell/nativeSelectedSession.ts, game-shell/nativeNewGameSnapshot.ts; packages/engines/player-engine/src/body-state.ts; packages/engines/game-engine/src/native-fungible-use-ledger.ts; items/items.json and items/consumable_profiles.json.

Where source documents are explicit, preserve their decisions. Where documentation is aspirational or missing a durable owner, classify the idea as proposed or deferred; never silently promote it to implemented or accepted.

## Work plan with exit checks

| Phase | Specific inspection and reasoning | Evidence product | Exit check |
| --- | --- | --- | --- |
| P0 Freeze source | Confirm exact parent PR head and record baseline paths, deployment/activation boundary | Source and non-goal register | No default-branch assumptions or changes to source |
| P1 Reconcile design | Compare accepted contextual surface, command architecture, local scene, inventory/item and culinary decisions; mark overlaps, precedence and open choices | Accepted / proposed / blocked / deferred matrix | No invented authority or contradiction disguised as a decision |
| P2 Trace current owner | Trace selected inventory Use from visible UI through read model, exact stack request, session admission, body/resource effect, receipt and Save | Current-route call graph and owner table | Every mutable state has a named current owner; no claim that UI is merely display when it executes current action |
| P3 Define UI contract | Specify carried edible, owned meal, served meal, communal pot, sealed pack and kitchen actions. Include action availability, context, source identity and display feedback | Proposed contextual action matrix | UI descriptor is ephemeral and never sufficient for execution |
| P4 Separate domains | Distinguish Eat/Drink, Open/Unpack, Serve/Transfer, Prepare/Cook, Take/Buy/Give and illicit access | Responsibility/dependency matrix | No generic Use command absorbs unrelated authorities |
| P5 Check content reachability | Inspect item/profile links, legacy preparation grants and starter inventory; distinguish authored valid links from ordinary acquisition or safe serving semantics | Candidate and exclusion register | No orphan profile, food label or fixture is treated as proof of real reachability |
| P6 Define implementation gates | Define source owner, permissions, portion/quantity/time, effects, accepted result, retries and publication for each proposed action | Boundary and acceptance scenarios | No proposed command proceeds without exact source and durable mutation owner |
| P7 Independent audit | Try to falsify recommendations using accepted docs, source calls, adversarial examples and preservation requirements | Audit findings / disposition | All critical checks pass, limitations reported rather than filled by guesses |
| P8 Documentation delivery | Create new docs only on isolated child of exact PR #70; review ancestry and changed paths; open draft PR against #70's branch | Source-linked plan and proposed contract | No runtime/content/build/Save/site changes or implied activation |

## UI and ownership questions to answer

- Carried food: what exact inventory target, profile and owned amount can be offered as Eat/Drink? Does current Use cover whole-stack-unit only?
- Served food: what creates and owns one exact serving and its access/right to consume? Is it in character inventory, a location item instance, or unresolved?
- Shared cauldron: does the player own a serving, need permission to take one, or merely observe a descriptive scene? Does Serve/Transfer precede Eat?
- Sealed provisions: when is its exact manifest resolved? Which generic item-instance owner can Open/Unpack without rerolling at open time?
- Contextual affordance: when does a label appear, require expansion for quantity, show an explained blocker, or get omitted?
- Time and combat: what does nutrition action cost and who gates active encounter, incapacitation and interruption? No inferred combat action.
- Reuse: which calculations are genuinely source-independent, and which inventory fingerprint/receipt/admission paths must not be generalized without proof?

## Required scenario matrix

1. Owned, directly edible, exact stack and valid profile: one accepted Use produces one authorized decrement plus supported body/resource effect, then survives Save/restart.
2. Duplicate request: one accepted outcome, no second debit or effect; conflicting same ID rejected.
3. Stale slot, reordered bag, changed quantity or publication head: reject without retargeting another stack.
4. Label-only consumable, orphan profile, field bandage and sealed pack: cannot be eaten through generic profile inference.
5. Described but uninstantiated nearby food: not actionable even if the location text mentions it.
6. Served food with exact local instance but missing access/quantity owner: informational or blocked, not mutation.
7. Shared cauldron: Serve/Transfer and Consume remain distinct and reject unavailable/unauthorized portions.
8. Active combat or pending defeat: do not infer free out-of-turn nutrition use.
9. Save/reload: reconstruct read-only scene/action descriptors from accepted head; never persist descriptor as gameplay truth.
10. v2 and native-v3 historical authority: remain distinct with no cast-based shortcut or migration.

These are specification and future Codex acceptance scenarios, not tests executed in this connector pass.

## Quality audit rubric

Each must pass for documentation-only approval:

- Precedence: accepted source directions preserved, proposal visibly separated.
- Ownership: no second item, body-state, container, social, activity or campaign owner.
- Physical proof: every executable candidate has item/serving source identity, quantity and legitimate availability.
- Transaction safety: source/debit/effect atomicity, stale request and exact-once protection are explicit.
- UI: Inventory and Current Area are alternative read/selection surfaces; no monolithic command engine or permanent Food menu.
- Version/privacy: no v2 weakening; private staging version 6, accounts and publication artifacts are untouched.
- Scope: first Codex implementation candidate can stand alone; missing environmental and container owners deferred.
- Evidence: cite specific paths and mark untested ordinary acquisition/hosted behavior as unverified.

If any critical rule fails, produce a blocker decision instead of implementation authorization.

## Expected successor, subject to separate approval

The first executable Codex task should inspect and validate the existing native selected inventory-use path with one truly eligible, lawfully acquired directly edible item, without changing the packaged starter Ration Bundle. If no such item is ordinarily reachable, report an acquisition/serving owner decision first. Later, independently authorize local-scene food instances, serving/transfer, provisions-manifest/Open and combat legality. This packet alone approves none of those features.

## Delivery

Companion audit and proposed contract: native-v3-contextual-consumption-authority-audit-2026-11-08.md. Use it as the detailed findings and challenge report. This plan stays source-pinned even if a future PR advances; review against a new head before converting any recommendation into code.
