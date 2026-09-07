# Consumable Profile Coverage And Effect-Ownership Audit

Date: 2026-08-03

Source route: ChatGPT via GitHub Connector

Original branch baseline: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Inspected live master: `91bd8c2c89c85fb9ea7257b2c96b68ab41231b04`

Branch: `parallel/consumable-profile-coverage-audit`

Status: `REFRESHED_CONNECTOR_EVIDENCE_CANDIDATE_INTEGRATION`

Execution posture: connector-only, read-only evidence refresh; no item, profile, schema, validator, test, runtime, body-state, inventory, health, magic, UI, save, content, roadmap, or active-route change

## Purpose

Refresh the consumable-profile inventory and owner boundaries against current master without authorizing a content correction or consumable-use implementation.

This audit remains useful for later food-use, medicine, alchemy, body-intake, inventory-instance, and consumable-profile integrity decisions. It does not control the active `0.6.9` acceptance-reopening route.

## Freshness Review

The connector comparison from the original baseline to inspected master spans 84 commits.

No changed path in that range belongs to:

- `packages/content/base/items/consumable_profiles.json`;
- the consumable-profile schema or validator;
- canonical item content carrying `consumableProfileId`;
- a general item-use or consumable-effect command;
- an inventory-instance quantity, serving, dose, charge, or container owner.

The intervening work materially expanded campaign persistence, publication, defeat recovery, and application save coordination. Those changes do not create consumable execution authority.

Result:

`DOMAIN_EVIDENCE_UNCHANGED_ROUTE_CONTEXT_UPDATED`

## Retained Reproducible Inventory

The prior connector audit established the current static posture as:

- 26 items classified with `itemClass: consumable`;
- nine consumable-profile records;
- five canonical item records carrying `consumableProfileId`;
- four orphan profile records;
- strict structural profile validation and normal content-lint registration;
- no accepted general consumable-use command or general effect executor.

Because no relevant content/schema path changed after the baseline, these remain the operative connector-inspected counts for planning. A future implementation or acceptance run must reproduce them locally rather than treating this document as executed validation.

## Current Authority Boundary

`itemClass: consumable` and `consumableProfileId` remain different concepts:

- the item class is broad category identity and includes non-food use cases;
- the profile is a narrow food, drink, hydration, nutrition, or intoxication descriptor;
- the profile is not a universal executable effect contract.

The profile does not authorize:

- inventory consumption;
- item-instance quantity mutation;
- portion, serving, dose, remaining amount, charge, or container changes;
- body-state, HP, injury, lethal-process, care, poison, antidote, magic, or alchemical effects;
- persistence receipts, duplicate replay, correction, Chronicle, notification, or accepted-only UI application.

The accepted campaign persistence foundation supplies infrastructure that a future command may reuse, but it does not resolve these domain-specific owners.

## Link-Integrity Findings Preserved

The prior audit identified three direct semantic mismatches and one scale mismatch:

- `item.breast_cut` -> `consume.game_stew`;
- `item.candied_peel` -> `consume.inn_hearty_meal`;
- `item.crusty_sausage_roll` -> `consume.traveler_ration`;
- `item.ale_cask` -> `consume.ale_cask`, where whole-cask versus serving authority is absent.

`item.bread_loaf` -> `consume.bread_loaf` remains the strongest structurally plausible link, but whole-item versus portion semantics are still unresolved.

No connector edit is authorized because repository evidence does not decide whether each defect should be fixed by unlinking, replacing, creating a new exact profile, reclassifying the item, or waiting for quantity and meal-composition authority.

Disposition:

`BUGS_CONFIRMED_CANONICAL_REPAIR_UNDECIDED`

## Orphan-Profile Posture

The four previously identified orphan profiles remain planning evidence, not proof that matching items should be invented:

- `consume.ration_bundle`;
- `consume.trail_meal`;
- `consume.seafood_stew`;
- `consume.tavern_fish_plate`.

A future decision must classify each as retained vocabulary, exact future item relation, replacement candidate, obsolete demo residue, or deferred meal/provision concept.

## Required Future Owners

A safe consumable-use path still requires explicit owners for:

1. actor and item-instance identity;
2. access and inventory possession;
3. physical amount, serving, dose, charge, and remaining quantity;
4. preparation, spoilage, safety, and eligibility;
5. container and opened-state behavior;
6. normalized profile identity and version;
7. typed owner proposals for body, intoxication, health, care, poison, antidote, magic, or alchemy;
8. accepted inventory and effect receipts;
9. duplicate, restart, conflict, correction, and persistence behavior;
10. accepted-only UI application.

Do not widen the existing nutrition-oriented profile into a generic effect bag.

## Current Classification

| Boundary | Classification |
| --- | --- |
| Profile structure | `STATIC_NARROW_AND_VALIDATED` |
| Item/profile links | `KNOWN_DEFECTS_UNRESOLVED` |
| Serving and quantity authority | `ABSENT` |
| General execution authority | `ABSENT` |
| Connector-safe repair | `NO_UNAMBIGUOUS_PATCH` |
| Next planning posture | `DOCUMENTATION_PREREQUISITE_READY` |

## Named Consumer And Review Trigger

This document must be read when any of the following opens:

- `Food-Named Taxonomy And Consumable-Profile Integrity Decision`;
- a food-use or body-intake command decision;
- medicine, antidote, poison, alchemy, or magical consumable ownership planning;
- an inventory-instance quantity, portion, dose, or container contract;
- a consumable-profile content repair or retirement pass.

The consuming run must cite this branch head or an integrated successor, reproduce current counts from its own live head, and state which findings remain current.

## Branch Disposition

`CANDIDATE_INTEGRATION`

Integration condition:

- compare this refreshed document against the then-current master authority;
- confirm no later consumable/profile implementation supersedes it;
- integrate or re-author the document during the next named consumer or a dedicated parallel-document coordinator pass.

Retirement condition:

- every retained finding is integrated or superseded by a durable decision;
- no named consumer still depends on this branch-only document;
- exact branch head and preservation are verified.

No local tests, builds, typechecks, linters, or content validation were run in this connector-only refresh.
