# Backstory Creator Presentation Plan

Source version/run: Version 0.5.57 - Creator Locked Backstory Presentation Plan
Date: 2026-05-18
Status: planning-only creator presentation plan

## Purpose

This document plans how future character creator surfaces should consume Backstory Eligibility Resolver output and present backstory availability states. It is a design document only.

Current branch reality for this pass:

- The live backstory catalog has 27 records.
- Version 0.5.56 added a runtime-owned Backstory Eligibility policy and pure resolver under the game-engine layer.
- The resolver is exported from `packages/engines/game-engine/src/index.ts`.
- `characterCreationCatalog.ts` still builds backstory options from every live record in `packages/content/base/player/backstories.json`.
- `characterCreationForm.ts` still validates that the selected backstory id is known, then checks settlement-start access separately.
- `newGameSnapshot.ts` still applies only the selected live backstory package.
- Creator source files are not wired to `resolveBackstoryEligibility`.

## Non-Goals

This document does not:

- wire the resolver into the creator
- change current backstory availability
- implement locked-backstory UI
- implement hidden, deferred, or special creator surfaces
- add Backstory Legacy purchases
- change starter skills, starting abilities, attributes, or selected backstory effects
- change save/account schemas, Legacy runtime, combat, magic, economy, progression, launcher UI, generated UI output, or live content records
- plan backwards compatibility, old-save preservation, old-account preservation, id aliases, retired-id handling, converted-id handling, historical id preservation, migration-only behavior, old selected backstory preservation, or old-data rescue behavior

Current content ids should continue to validate directly.

## Current Branch Reality

The current creator backstory step renders `backstories.map(...)` from `getBackstoryOptionsForSelection(form.lineageId, selectedWorld)`. That helper currently returns all live `BACKSTORY_TEMPLATES` when the lineage is known.

The current creator validation path:

- checks `isKnownBackstoryId(form.backstoryId)`
- checks the selected continent, region, and settlement
- resolves settlement-start access with the selected backstory id
- does not call the resolver

The current snapshot path:

- resolves `getBackstoryTemplate(form.backstoryId, selectedWorld)`
- writes the selected `backstoryId`
- applies `backstory.startingSkills`
- applies `getStartingAbilityStates(form.backstoryId)`
- writes flags and Chronicle text for the selected backstory only

The resolver currently returns a projection shaped for later creator usage:

- `eligibleBackstoryIds`
- `lockedBackstories`
- `hiddenBackstoryIds`
- `deferredBackstoryIds`
- `specialBackstoryIds`
- `defaultBackstoryIds`
- per-record `state`, `selectable`, `visible`, `reasons`, and `selectedBackstoryEffectPolicy`
- `warnings`

Locked presentation remains deferred.

## Desired Future Creator Flow

The future integration should be a narrow presentation layer over existing catalog data and resolver output.

1. Load the live backstory catalog for names, summaries, descriptions, starter skill display, attribute adjustments, and starting ability display.
2. Build the live id list from the same catalog records the creator already uses.
3. Collect only currently owned, trustworthy evidence inputs.
4. Call `resolveBackstoryEligibility` with live ids, approved runtime policy, and current-data evidence input.
5. Merge resolver records with live catalog templates into a creator presentation view model.
6. Render selectable records from eligible, default, and always-available states.
7. Render locked records only when the resolver marks them visible and their explanation is safe for player-facing copy.
8. Omit hidden and deferred records from normal creator lists.
9. Handle special records conservatively, usually hidden unless a dedicated narrative owner scopes their presentation.
10. Keep settlement-start authorization as a separate validation layer.
11. Keep new-game snapshot effect application unchanged and selected-only.

The creator must not import design metadata, future lane drafts, or non-runtime catalog drafts for availability.

## Availability-State Presentation Policy

| Status | Visible in normal creator? | Selectable? | Badge direction | Detail visibility | Explanation direction | Must not promise |
| --- | --- | --- | --- | --- | --- | --- |
| `always_available` | Yes | Yes | `Available` or no badge | Full live catalog details | Simple available copy if needed | Extra unlocks or stronger effects |
| `default_available` | Yes | Yes | `Default` or no badge | Full live catalog details | Baseline origin copy if needed | Tier unlocks or evidence bypasses |
| `early_legacy` | Yes if safe | Yes only when resolver state is eligible | `Early Legacy` when eligible, `Locked` when unmet | Full or limited live details, depending on copy safety | Needs simple, supported evidence language | Legacy purchase paths until purchases exist |
| `locked` | Yes only when safe to explain | No | `Locked` | Usually full live details with lock treatment; hide details if they imply blocked systems | Explain missing supported evidence or current unavailability | Market passives, contacts, mounts, title systems, magic licensing, medical systems, oath behavior |
| `hidden` | No | No | None | None | None in normal creator | Any hidden mechanic or spoiler |
| `special` | Usually no | No unless resolver explicitly marks eligible and a narrative owner exists | `Special` only when surfaced | Limited, conservative details | Narrative/manual availability only | Ordinary tier progression or account-wide entitlement |
| `deferred` | No | No | None in normal creator | None | None, or conservative debug/admin copy only in a later scoped pass | Future systems as near-term promises |

Do not reintroduce `retired`, `converted`, alias rescue behavior, or old-data rescue states.

## Locked Explanation Rules

Locked explanations should use player-safe language and avoid raw policy ids, raw evidence ids, and unsupported system promises.

Safe copy direction:

- "Requires a matching family history."
- "Requires earned trade evidence."
- "Not available in the current creator."
- "Requires a future system that is not active yet."
- "Requires a relevant previous character record."
- "Requires scoped local recognition."

Unsafe copy direction:

- "Buy this later with Legacy points" unless that purchase path is implemented.
- "Earn noble title ownership" unless title and estate ownership are live.
- "Join a temple order" unless institution membership is live.
- "Use market contacts" unless contacts and market/economy effects are live.
- "Unlock a mount" unless mount ownership and mounted behavior are live.
- "Gain licensed magic" unless magic acquisition/licensing is live.

The creator should distinguish "not enough evidence" from "not currently supported" without exposing implementation details. If the missing requirement is blocked by an owner that does not exist, the normal creator should hide or defer the record rather than display a near-term unlock promise.

## Default And New-Account Safety Presentation

The default set should never be empty when the baseline live records exist.

Baseline defaults:

| Backstory | Id |
| --- | --- |
| Local | `backstory.local` |
| Vagabond | `backstory.vagabond` |
| Exile | `backstory.exile` |
| Farmhand | `backstory.farmhand` |
| Amnesiac | `backstory.amnesiac` |

Presentation rules:

- Default records remain visible and selectable when optional evidence is missing.
- Missing family, lineage, source-run, or earned-skill evidence must not dead-end creation.
- Default safety must not bypass settlement-start authorization.
- Default presentation must not unlock Tier 2, Tier 3, special, hidden, or deferred origins.
- If resolver warnings indicate that default ids are missing from live content, the integration should fail current-data validation rather than invent fallback ids.

Possible future default or early-Legacy candidates remain presentation decisions for a later implementation pass:

- Street Vendor
- Net-Tender
- Gatherer
- Drover's Hand
- Kitchen Hand
- Militia Levy
- Scribe's Apprentice

This plan does not change current availability.

## Hidden, Deferred, And Special Handling

Hidden records should not appear in normal creator lists. They may exist for future spoiler, narrative, debug, or admin handling, but that must be a separate scoped pass.

Deferred records should not appear in normal creator lists. If a future debug/admin surface is approved, deferred records should use conservative copy such as "Requires a future system that is not active yet."

Special records should not be ordinary selectable origins. They should either stay hidden or be surfaced only after a dedicated narrative owner defines how they become eligible.

Representative handling:

- World-Stray should remain special/manual or hidden.
- Local Champion should remain special or region/achievement/story scoped, not broad default.
- Minor Noble should remain blocked or deferred until family, estate, title, and status evidence owners exist.
- Magic-bearing or institution-dependent origins should not expose acquisition, licensing, or membership promises until those systems are live.

## Creator Data Shape

Future creator integration can project a view model that merges live catalog presentation with resolver availability.

Draft shape only:

```ts
type BackstoryCreatorPresentation = {
  id: string;
  name: string;
  summary: string;
  description: string;
  starterSkills: string[];
  attributeAdjustments: Record<string, number>;
  startingAbilityIds: string[];
  availabilityState:
    | "eligible"
    | "locked"
    | "hidden"
    | "deferred"
    | "special";
  selectable: boolean;
  visible: boolean;
  badge: string | null;
  lockedReason: string | null;
  unlockHint: string | null;
  isDefault: boolean;
  isSpecial: boolean;
  isDeferred: boolean;
  sortGroup: string;
};
```

The view model should be derived in creator/app code from runtime resolver output plus live catalog records. It should not become a new content source or a replacement for canonical backstory records.

## Sorting And Grouping Plan

The future creator should preserve a stable order so availability changes do not cause avoidable UI jumping.

Recommended grouping:

1. Default and always-available selectable records.
2. Other eligible records.
3. Early-Legacy or locked records that are safe to show.
4. Special records only when explicitly surfaced.
5. Hidden and deferred records omitted from normal lists.

Within each group, preserve the live catalog order unless a later UI pass defines a stable authored sort key. Avoid sorting by volatile evidence counts, warning counts, or transient lock text.

## Selection Behavior Plan

Future selection behavior should be direct and current-data oriented:

- Selecting eligible, default, or always-available records works normally.
- Locked records are visible only when safe but cannot be selected.
- Hidden and deferred records are not selectable.
- Special records cannot be selected unless the resolver marks them eligible and a narrative owner has approved their creator presentation.
- If the selected id is not in resolver eligible output, the creator should require a valid current selectable id.
- Selection errors should be direct current-data validation errors, not compatibility rescue behavior.
- Settlement-start authorization remains separate from backstory eligibility.

The creator should avoid auto-selecting a newly unlocked record. If the current selected id becomes invalid under resolver output, it should prompt for a valid visible selectable choice.

## New-Game Snapshot Boundary

The resolver should affect availability only.

Snapshot creation should continue to apply exactly one selected live backstory package:

- selected backstory id
- selected backstory starting skills
- selected backstory attribute adjustments through existing character math
- selected backstory allowlisted starting abilities
- selected backstory flags and Chronicle text

Parent and child backstory effects must not stack. Unlocking a higher-tier origin should not grant lower-tier starter skills, attributes, abilities, or package effects. Historical or parent backstories are access evidence only when separately recorded and accepted by policy.

Do not change `newGameSnapshot.ts` as part of presentation wiring unless a later implementation pass explicitly scopes that work.

## Evidence Input Boundary

The first creator integration should pass only evidence the app already owns safely.

Potentially safe inputs:

- live backstory ids
- current selected id, only if needed for resolver warnings
- account id if already available in the creator path
- current family, lineage, source-run, region, faction, institution, or estate/title fields only if their owning storage exists and their values are trustworthy
- current Legacy purchase ids only after Backstory Legacy purchases exist and are approved for this resolver

Do not pass:

- invented evidence
- fake Legacy purchases
- dummy family evidence
- starter-granted skills as earned maxima
- blocked evidence owner stubs that unlock content
- broad account flags as stand-ins for family, status, institution, title, estate, magic, mount, medical, contact, or economy evidence

If evidence owners are missing, pass no evidence and rely on default-safe resolver behavior.

## Blocked Evidence UI Guardrails

Blocked evidence cannot unlock content and should not become a near-term UI promise.

The creator presentation should hide, defer, or conservatively explain records blocked by:

- family skill maxima
- family backstory history
- heir legitimacy/status
- estate/title ownership
- regional renown storage if not durable and scoped
- institutional membership
- patronage/contact systems
- adoption
- marriage
- mounted behavior and mount ownership
- market/economy effects
- magic licensing/acquisition
- medical/injury systems
- oath and paladin behavior

Legacy points, Echo, or Prestige must not bypass blocked family, title, institution, magic, mount, economy, medical, or oath owners.

## Future Implementation Test Plan

The later creator integration pass should add focused tests before or alongside UI wiring.

Expected future assertions:

- creator view model uses resolver projection
- eligible records are selectable
- locked records are visible but not selectable when safe to show
- hidden records are omitted
- deferred records are omitted from normal lists
- special records are not ordinary selectable origins
- default records remain selectable when evidence is missing
- selection cannot bypass resolver output
- settlement-start validation remains separate
- snapshot creation applies only the selected backstory package
- creator code does not import design metadata
- creator code does not import non-runtime planning drafts
- no backwards-compatibility rescue behavior is introduced
- visible copy does not promise blocked systems
- generated UI output remains untouched unless a later build pass explicitly scopes it

Do not implement these tests in this planning pass.

## Implementation Sequencing

Recommended next pipeline:

1. Version 0.5.58 - Creator Backstory Resolver Integration
2. Version 0.5.59 - Backstory Legacy Purchase Integration Plan

Do not jump directly to Backstory Legacy purchase integration before the creator consumes resolver output. The next implementation should be narrow: derive a creator presentation projection from resolver output, keep snapshot behavior selected-only, and keep settlement-start authorization separate.

## Risks And Blocked Systems

- The creator currently still shows raw live catalog availability.
- Evidence inputs are limited until family, lineage, source-run, and earned-skill ledgers exist.
- Locked explanation copy must not promise unsupported systems.
- Broad creator rewrites are high risk and should be avoided.
- Generated UI output should remain untouched.
- The previous handoff noted known workspace TypeScript issues; this docs-only pass does not run typecheck and does not address them.
- Backstory Legacy purchase integration remains deferred.
- Family/source-run evidence ledgers, earned skill maxima storage, institution/status/estate/title ownership, magic licensing, mounts, contacts, market/economy effects, medical systems, and oath/paladin behavior remain blocked until owned systems exist.

