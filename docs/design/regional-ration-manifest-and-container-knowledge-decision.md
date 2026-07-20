# Regional Ration Manifest And Container Knowledge Decision

Date: 2026-07-20
Status: accepted documentation-only design authority; no content, schema, validator, runtime, UI, save, economy, or gameplay implementation permission
Run classification: unversioned cross-cutting design decision
Milestone impact: `supports_current_band`

## 1. Purpose And Precedence

This decision refines `docs/design/packed-food-ration-and-provisions-content-plan.md` after the completed culinary research and GPT/human inspection.

Where this focused decision is more specific, it controls ration archetypes, geographic fulfillment, manifest generation, container-content knowledge, stacking, fresh-package naming, and the corrected implementation sequence. It does not authorize implementation.

## 2. Accepted Model

A provisions package has four separate layers:

1. **Ration archetype** — the character-facing size and composition promise.
2. **Geographic fulfillment profile** — the region-, country-, continent-, institution-, or global-scoped list that can satisfy the archetype.
3. **Resolved manifest** — the exact named item ids and quantities contained by one physical package instance.
4. **Contents knowledge** — what the character currently knows about that already-resolved manifest.

The pack itself is not edible and owns no aggregate nutrition. Named contents own direct-consumption profiles.

## 3. Ration Archetypes

### Size

Use `small`, `medium`, and `large` as package-capacity or serving bands, not quality tiers.

Recommended initial interpretation:

- `small`: one or two servings;
- `medium`: three or four servings;
- `large`: several components or a multi-meal/group-oriented package.

Exact quantities remain balance authority and must not be inferred from these recommendations.

### Composition

Initial composition families may include:

- `fruit`;
- `fruit_and_nut`;
- `preserved_protein`;
- `mixed`;
- `meal_provisions`;
- `hearty_provisions`;
- `luxury_provisions`.

Do not create every size-by-composition permutation. Add only combinations with a clear player use, repeated content support, and manageable catalog cost.

### Character-facing names

Regional variants should normally share one primary display name, such as:

- Small Fruit Ration;
- Medium Fruit-and-Nut Ration;
- Small Preserved-Protein Ration;
- Medium Mixed Ration;
- Large Mixed Provisions;
- Hearty Provisions Pack;
- Luxury Provisions Hamper.

Origin should remain visible in a subtitle, inspection field, provenance line, or comparable presentation, for example `Packed in Kaelvar`.

A shared display name must not erase backend identity, manifest, origin, value, weight, restriction, or stacking differences.

## 4. Geographic Fulfillment Profiles

A fulfillment profile should define at minimum:

- stable profile id;
- ration archetype id;
- geographic or institutional scope type;
- canonical scope id;
- required content slots;
- fixed candidates or weighted candidate lists for each slot;
- exact positive quantity rules;
- preservation expectations;
- packaging disposition;
- value/weight posture or the owner that supplies them;
- fallback posture, if any.

Conceptual scope types may include `region`, `country`, `continent`, `institution`, and `global`, but implementation may use only canonical geography/institution owners that actually exist in the repository.

A pack's origin comes from its creation source or authored profile. It must never be recomputed from the character's location when opened.

Fallback must be explicit and authored. Do not infer a country, continent, culture, or cuisine from names or map position.

## 5. Manifest Resolution

### Generation time

Resolve and lock the exact manifest when a specific pack instance enters the world or ownership graph, including when it is:

- purchased;
- crafted or self-packed;
- granted in a starting bundle;
- issued by an institution;
- generated as loot;
- created in merchant stock;
- awarded by a quest or event.

Subsequent transfer between characters, merchants, containers, or regions must not reroll or replace the manifest.

### Opening

Opening must be deterministic:

`remove one sealed pack instance -> add its already-resolved named contents`

Opening-time RNG is rejected. It would permit location-dependent contents, save/reload rerolls, unstable value and weight, unclear dietary disclosure, and replay ambiguity.

### Fixed and random manifests

Support both:

- **explicit manifests** for self-packed goods, fixed starting provisions, standard military/institutional issue, and other known-content packages;
- **constrained regional RNG** for commercial assortments, scavenged provisions, or other authored variable packages.

Random fulfillment must use typed required slots rather than unrestricted rolls. A `medium_fruit_and_nut` profile should guarantee its authored fruit and nut slots even when the exact regional foods vary.

The initial implementation should prefer fixed manifests or very narrow weighted lists until inventory-instance metadata, deterministic generation, and stacking are proven.

## 6. Self-Packed And Known-Content Packages

Player- or character-packed containers use exact selected contents and no random generation.

A self-packed package may reuse a general archetype only when its actual manifest satisfies that archetype's validated slot contract. Otherwise it should use a generic parcel/container identity without falsely promising a composition.

Self-packed contents begin as `manifest_known` unless a later deception, memory, or ownership system explicitly proves another behavior.

## 7. Truth Versus Character Knowledge

The authoritative manifest and character knowledge are separate.

Every generated package instance must have an actual resolved manifest even when the character does not know it.

Minimum recommended instance state:

- `unknown` — neither category nor exact manifest is known;
- `category_known` — the ration archetype/composition is known, but exact contents are not;
- `manifest_known` — exact item ids and quantities are known.

A future `verified` state and `knowledgeSource` field may be added only when inspection, counterfeit labels, merchant trust, appraisal, deception, or evidence provenance justify them.

Recommended defaults:

- self-packed package: `manifest_known`;
- fixed starting provision: `manifest_known`;
- reputable labeled commercial ration: `category_known`;
- unmarked or damaged loot parcel: `unknown`;
- inspected package: `manifest_known`.

`contentsKnowledge` is mutable inventory-instance state, not a static item tag.

## 8. Stacking And Identity

Packages may stack only when their effective physical and knowledge identity is compatible.

At minimum, future stack compatibility must consider:

- archetype or bundle profile;
- origin/fulfillment profile;
- resolved manifest or manifest hash;
- contents-knowledge state;
- seal/open state;
- quality and condition when those owners exist.

Do not merge a known-manifest pack with an unknown pack, or two packs with materially different manifests, unless the stack can retain per-unit manifests and knowledge.

If the current inventory cannot preserve per-unit metadata, use fixed backend variants or prohibit stacking for variable-manifest packages.

## 9. Fresh Packages And Bulk Storage

### Fresh produce and prepared meals

Preserved rations should be the first package family.

Do not create a persistent item that promises `fresh` behavior until freshness, age, storage, and presentation have an accepted owner. Before that authority exists, prefer provider- or market-facing names such as:

- Market Fruit Bag;
- Produce Basket;
- Prepared Meal Parcel;
- Inn Meal Parcel;
- Cookshop Meal Parcel.

Even those names must not imply executable spoilage or temperature behavior.

Immediate-use service/event parcels may be considered separately, with the lack of persistence/spoilage behavior stated honestly.

### Bulk storage

Bulk sacks, barrels, casks, crates, and workplace storage are not automatically personal rations.

Keep separate semantic families for:

- bulk storage and trade;
- personal rations;
- group/expedition provisions;
- fresh market packages;
- hospitality/prepared-meal parcels.

They may later share container infrastructure, but they must not share meaning merely because each contains items.

## 10. Corrected Package Sequence

The inspected research sequence contained an invalid dependency cycle: generic ration reconciliation required explicit contents before the separate bundle-profile owner existed, while the bundle-profile package depended on ration reconciliation.

Use this corrected order for future review:

1. **Research Results Repair And Acceptance Audit**
   - repair paths, matrix semantics, label classification, and package dependencies;
   - incorporate this accepted decision;
   - remain documentation-only.

2. **Food-Named Taxonomy And Consumable-Profile Integrity**
   - correct only proven taxonomy and profile-link defects;
   - use a valid exact parent if classified as support, or a primary classification if it materially creates new authority.

3. **Provision Archetype And Geographic Fulfillment Schema**
   - define static archetypes, slot contracts, geographic profiles, fixed/weighted candidate lists, and validation;
   - do not require the nutrition/satiety package.

4. **Named Preserved Food Foundation**
   - add only exact named contents required by accepted initial fulfillment profiles.

5. **Inventory Manifest, Knowledge, And Stack Contract**
   - define instance manifest truth, generation timing, contents knowledge, and stack identity before variable packages execute.

6. **Ration Catalog And Starting-Bundle Migration**
   - convert, replace, or retire generic ration identities only after archetype/profile/content owners exist.

7. **Engine-Owned Open-Pack Command**
   - open deterministically from the stored manifest with atomic inventory behavior.

8. **Nutrition And Satiety Authority**
   - remain independent of aggregate pack nutrition;
   - may proceed after static/profile semantics are stable.

9. **Regional Cuisine And Food Lore**
   - use ecology and trade as opportunity evidence only;
   - require a selected lore/culture owner.

10. **Storage, Spoilage, And Food-Safety Runtime**
    - defer until a repeated gameplay decision justifies inventory-instance time/storage/save/UI cost.

## 11. Validation Requirements For Later Implementation

Future static and runtime owners must reject or test at minimum:

- missing archetype, geography, item, or profile references;
- invalid scope types or noncanonical scope ids;
- empty required slots;
- nonpositive quantities or weights;
- weighted lists with invalid or zero total weight;
- slot candidates that violate the promised composition;
- nested packs or cycles unless a later decision explicitly permits them;
- pack items with direct-consumption profiles;
- generation without a stored manifest;
- opening-time rerolls;
- nondeterministic replay/save behavior;
- stack merges across incompatible manifests or knowledge states;
- partial inventory mutation on rejection or capacity failure.

## 12. Remaining User Context Decisions

These remain open and should be surfaced by the results audit rather than guessed:

- exact initial size-to-serving quantities;
- which size/composition combinations enter the first catalog;
- whether `large` means personal multi-day supply, party supply, or separate variants;
- canonical geography scopes currently available for fulfillment;
- exact fallback behavior when a local profile is absent;
- whether origin is always visible or can itself be unknown;
- whether commercial labels may be inaccurate before deception systems exist;
- whether package value is authored per fulfillment profile or derived from manifest plus packaging;
- whether packaging is consumed, retained, or replaced;
- whether the Traveler starting bundle intentionally lacks provisions;
- whether `hearty` guarantees authored meal-role coverage before the satiety system exists;
- whether variable-manifest packs may stack before per-unit inventory metadata exists;
- the exact version classification of the first correction implementation.

## 13. Route And Behavior

The completed culinary research remains temporary and requires a repair-and-acceptance audit before implementation.

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and recoverable from its held prompt. No new implementation version is assigned by this decision.

This document changes no item, profile, recipe, bundle, starting loadout, schema, validator, inventory instance, command, runtime, UI, save, economy, region, lore, dependency, asset, or gameplay behavior.
