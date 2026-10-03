# Character Creator Perchance Prototype Provider Plan

## Status

Planning-only companion authority for the character-creator renovation package on branch:

`planning/character-creator-trait-system`

This document records the intended test-era portrait-provider workflow using Perchance as a disposable prototype-generation option while preserving a provider-independent Lineage Reforged character and portrait architecture.

This document does **not** authorize undocumented automation, scraping, DOM manipulation, reverse-engineered endpoints, source implementation, credential handling, or production dependence on Perchance.

A later implementation pass must re-check the provider's current technical and usage terms before enabling any integration path.

## Purpose

During character creation, the player should interact with Lineage Reforged rather than with a general-purpose image-generation interface.

The visible portrait controls should be intentionally minimal:

- **Generate Portrait** when no generated portrait exists;
- **Regenerate Portrait** when a portrait already exists;
- a compact loading state while generation is underway;
- a clear stale indicator when character appearance changes after generation;
- a retry path after generation failure;
- the existing initials fallback whenever no valid portrait asset is available.

The player should not need to manually write prompts, select model parameters, operate style controls, or understand which provider is currently in use.

The provider is infrastructure. The character creator owns the experience.

## Architectural Principle

The Lineage UI must not be built around Perchance-specific controls.

The authority chain remains:

~~~text
canonical character identity
+ mechanical trait portrait fragments
+ cosmetic appearance descriptors
+ lineage morphology
+ render profile
        |
        v
CharacterPortraitPromptSpec
        |
        v
PortraitProvider interface
        |
        +--> prototype / assisted provider
        |
        +--> future production API provider
        |
        v
portrait asset result
~~~

Changing providers must not require changing saved character identity.

## Test-Era Perchance Role

Perchance may be used as a **prototype-generation provider** during development and internal testing because it allows rapid visual iteration without immediately committing the project to a paid production image API.

However, the integration must remain deliberately disposable.

The prototype must not make any of the following canonical:

- Perchance prompt syntax;
- Perchance UI layout;
- Perchance style controls;
- Perchance model identifiers;
- Perchance page DOM structure;
- undocumented request endpoints;
- browser automation assumptions;
- Perchance-specific asset URLs as permanent character identity.

If a reliable automated integration is not permitted or technically supported, Perchance remains a development-assisted provider rather than a hidden backend API.

The Lineage UI should still use the same Generate / Regenerate controls so a future API-backed provider can replace the test provider without redesigning the creator.

## Provider Compliance Boundary

Before implementation, verify the current provider rules again.

The prototype must not depend on:

- scripted access prohibited by the provider;
- automated form submission without an allowed API or messaging contract;
- cross-origin DOM manipulation;
- simulated clicks against a third-party page;
- scraping generated images from undocumented page structure;
- reverse-engineered private endpoints;
- hidden iframe manipulation that depends on implementation details outside Lineage control.

If an official or clearly permitted external integration path becomes available later, the adapter may consume it behind the same `PortraitProvider` interface.

If no such path exists, the Perchance test mode should remain explicitly assisted or developer-only while production uses another provider.

## Preferred Prototype Shape

If Perchance supports an acceptable user-created-generator workflow, prefer a purpose-built Lineage Reforged portrait generator over embedding the generic character generator.

Conceptually:

~~~text
Lineage Reforged
      |
      | deterministic prompt spec
      v
Lineage-specific Perchance test generator
      |
      v
Perchance image generation
      |
      v
portrait asset / assisted import
~~~

The purpose-built generator should contain only the fixed art-direction and generation behavior needed by Lineage Reforged.

Do not expose the generic Perchance character-generation control surface inside the game.

## Player-Facing Portrait Interface

### Empty state

When no portrait exists:

~~~text
+----------------------------------+
|          CHARACTER PORTRAIT      |
|                                  |
|          [ initials ]            |
|                                  |
|        Generate Portrait         |
+----------------------------------+
~~~

Primary action:

**Generate Portrait**

Secondary behavior:

- initials remain visible until generation succeeds;
- character creation remains valid even if the button is never used;
- no warning should imply portrait generation is mandatory.

### Generating state

After the player invokes generation:

~~~text
+----------------------------------+
|          CHARACTER PORTRAIT      |
|                                  |
|       Generating portrait...     |
|                                  |
|          [ progress ]            |
+----------------------------------+
~~~

Requirements:

- disable duplicate Generate / Regenerate submissions while the request is active;
- keep the rest of the character data intact;
- do not lock unrelated creator navigation unless the implementation genuinely requires it;
- do not clear the previous portrait during regeneration;
- preserve initials fallback if no previous portrait exists.

The UI should not invent a percentage unless the provider exposes trustworthy progress information.

A simple indeterminate progress state is preferred.

### Ready state

After successful generation:

~~~text
+----------------------------------+
|          CHARACTER PORTRAIT      |
|                                  |
|         [ portrait image ]       |
|                                  |
|       Regenerate Portrait        |
+----------------------------------+
~~~

Primary action:

**Regenerate Portrait**

The portrait is now an asset representation of the saved canonical identity.

The image is not itself authoritative identity data.

### Stale state

If the player changes portrait-relevant identity after generation:

~~~text
+----------------------------------+
|          CHARACTER PORTRAIT      |
|                                  |
|         [ old portrait ]         |
|                                  |
|     Portrait needs updating      |
|       Regenerate Portrait        |
+----------------------------------+
~~~

The previous image remains visible but is marked stale.

Recommended label:

**Portrait needs updating**

Recommended action:

**Regenerate Portrait**

Do not regenerate automatically when a selector changes.

This is especially important while testing with a free provider or a provider with generation quotas.

### Regenerating state

When replacing an existing portrait:

- keep the previous image visible;
- overlay or accompany it with a generating state;
- do not discard the valid previous asset until the new generation succeeds;
- allow failure to fall back to the previous portrait rather than initials.

This prevents a temporary provider failure from destroying a previously useful portrait.

### Failed initial-generation state

If the first generation attempt fails:

~~~text
+----------------------------------+
|          CHARACTER PORTRAIT      |
|                                  |
|          [ initials ]            |
|                                  |
|      Portrait unavailable        |
|             Retry                |
+----------------------------------+
~~~

The character remains valid.

Recommended action label:

**Retry Portrait**

The failure message should be concise and non-technical unless the creator is running in a developer/debug mode.

### Failed regeneration state

If regeneration fails but an earlier portrait exists:

- continue displaying the earlier portrait;
- retain stale status if identity changed;
- display a compact failure message;
- allow **Regenerate Portrait** again.

Do not replace a valid previous portrait with an error placeholder merely because regeneration failed.

## Button State Machine

Recommended conceptual state:

~~~ts
type CharacterPortraitGenerationStatus =
  | "empty"
  | "generating"
  | "ready"
  | "stale"
  | "regenerating"
  | "failed_empty"
  | "failed_stale";
~~~

Recommended primary action mapping:

| Status | Primary control |
| --- | --- |
| empty | Generate Portrait |
| generating | disabled generating indicator |
| ready | Regenerate Portrait |
| stale | Regenerate Portrait |
| regenerating | disabled generating indicator |
| failed_empty | Retry Portrait |
| failed_stale | Regenerate Portrait |

Avoid adding separate buttons for prompt editing, model selection, advanced settings, provider choice, or style tweaking in ordinary player-facing creation.

Those are development / administration concerns, not character-identity controls.

## No Manual Prompt Controls

The player should never need to type an image prompt during normal character creation.

The prompt is derived from canonical selections.

Example source identity:

~~~text
Human
Female
Mature
Tall
Lithe
Athletic
Graceful
Disciplined
Analytical
Reserved
Angular face
Freckled
Long wavy auburn hair
Green eyes
Scar through right eyebrow
~~~

The portrait adapter turns that into the provider-independent prompt specification.

The renderer then adds the testing composition requirements.

The player sees only:

~~~text
Generate Portrait
~~~

or:

~~~text
Regenerate Portrait
~~~

## Test Render Profile

The Perchance prototype should consume the test-era render profile already defined by the appearance plan.

Recommended profile ID:

`portrait_profile.creator_test_v1`

Composition requirements:

- one character;
- hips-up framing;
- portrait orientation;
- preferred 4:5 composition;
- face fully visible;
- shoulders fully visible;
- torso visible enough to communicate build and clothing silhouette;
- hands outside frame;
- wrists preferably outside frame;
- no held weapons;
- no held props;
- no action pose;
- simple or subdued background;
- clear facial readability;
- enough headroom for lineage morphology such as ears or hair volume;
- composition safe for later square / compact UI cropping.

The test profile intentionally minimizes common free-model anatomy failures, particularly hand malformation.

## Negative / Constraint Language

Provider serialization may need concise negative or constraint language such as:

~~~text
single character,
hips-up portrait,
hands and wrists outside frame,
no visible hands,
no held objects,
no weapon in hand,
no extra limbs,
no duplicated person,
clear face,
simple background
~~~

The exact syntax is provider-specific and belongs in the provider serializer, not canonical character data.

A future production provider may need different negative-prompt syntax or no explicit negative prompt at all.

## CharacterPortraitPromptSpec Boundary

Recommended provider-independent shape:

~~~ts
interface CharacterPortraitPromptSpec {
  promptVersion: number;

  subject: {
    lineageId: string;
    lineageVisualFragments: string[];
    sexId: "male" | "female";
    ageBandId: PlayerIdentityAgeBandId;
    heightDescription: string;
  };

  mechanicalTraitFragments: string[];
  appearanceFragments: string[];
  colorationFragments: string[];
  derivedExpressionFragments: string[];

  renderProfileId: string;
}
~~~

No Perchance-specific fields belong in this interface.

## Provider Adapter Boundary

Recommended conceptual contract:

~~~ts
interface PortraitProvider {
  id: string;

  generate(
    request: CharacterPortraitGenerationRequest
  ): Promise<CharacterPortraitGenerationResult>;
}

interface CharacterPortraitGenerationRequest {
  promptSpec: CharacterPortraitPromptSpec;
  identityFingerprint: string;
  previousAssetRef?: string | null;
}

interface CharacterPortraitGenerationResult {
  providerId: string;
  generationId: string | null;
  assetRef: string;
  width: number | null;
  height: number | null;
}
~~~

The exact implementation may differ, but the provider must remain downstream of canonical identity.

## Prototype Provider Modes

The architecture should allow at least two test modes.

### Automated provider mode

Use only when a provider exposes an acceptable documented or otherwise clearly permitted integration path.

Flow:

~~~text
Generate Portrait
    |
    v
Lineage server / adapter
    |
    v
provider generation request
    |
    v
asset persistence
    |
    v
portrait appears
~~~

This is the ideal eventual experience.

### Assisted provider mode

Use when Perchance remains useful for development but cannot be safely treated as an automated backend.

Flow may require a development-side handoff or import step while preserving the same player-facing portrait state model.

The assisted path is explicitly temporary infrastructure.

It must not leak into save semantics or character identity.

## Seamless UI Does Not Require Provider Coupling

The game can present a seamless Generate / Regenerate experience even though the prototype provider may later be replaced.

The UI owns:

- button labels;
- loading state;
- stale state;
- error state;
- portrait preview;
- initials fallback;
- identity fingerprinting.

The provider owns only:

- serialization of the prompt spec;
- generation transport;
- response normalization;
- provider-specific error translation.

This separation is intentional.

## Portrait Asset Persistence

Do not persist generated image bytes directly inside the save snapshot.

Store a stable asset reference and generation metadata.

Recommended direction:

~~~ts
interface PlayerPortraitState {
  assetRef: string | null;
  identityFingerprint: string | null;
  promptVersion: number | null;
  renderProfileId: string | null;
  providerId: string | null;
  generationId: string | null;
  generatedAt: string | null;
}
~~~

Whether `generatedAt` is needed in canonical persistence can be decided later.

The important authority is:

- asset reference;
- identity fingerprint;
- prompt version;
- render profile;
- provider provenance.

## Identity Fingerprint

The fingerprint should be derived only from portrait-relevant canonical data.

Include:

- lineage;
- biological sex;
- age;
- height/stature representation used by portraits;
- mechanical traits with visual fragments;
- appearance descriptor IDs;
- skin tone;
- eye color;
- hair color;
- hair highlight color if supported;
- any lineage morphology variant that is genuinely player-selectable.

Exclude:

- provider ID;
- provider model;
- output dimensions;
- seed unless later deliberately used as a stable visual identity feature;
- UI crop;
- Generate / Regenerate count;
- ordinary equipment;
- current HP/MP/stamina;
- temporary conditions;
- world location.

If the current fingerprint differs from the portrait's source fingerprint, the portrait is stale.

## Regeneration Semantics

Regeneration means:

> produce another visual interpretation of the current canonical character.

It does not mean:

- reroll the character;
- change traits;
- change appearance descriptors;
- mutate stats;
- select new lineage morphology;
- replace canonical colors.

The underlying character remains unchanged.

A provider may produce visual variation between generations, but all outputs should represent the same identity facts.

## Random Seeds

Do not make a provider seed part of canonical character identity in v1.

Reasons:

- different providers represent seeds differently;
- some providers expose no useful seed control;
- a provider migration should not invalidate portrait identity;
- regeneration should be allowed to create another interpretation.

If a production provider later supports deterministic image regeneration usefully, store its seed as provider metadata rather than a character fact.

## Generation Cost / Quota Behavior

Because the prototype may use a free service and production may later incur per-image cost, the UI should already encourage deliberate generation.

Recommended behavior:

- no auto-generation while clicking appearance options;
- no automatic regeneration after each identity change;
- stale marker instead;
- one explicit Generate / Regenerate action;
- disable duplicate concurrent submissions;
- optional short cooldown only if required by provider rate limits;
- never make generation necessary to proceed with the campaign.

## Review-Step Behavior

The creator review step should display whichever portrait state exists.

Possible cases:

### Ready

Show the generated portrait.

### Stale

Show the old portrait with a small "Portrait needs updating" label and Regenerate control.

The player may still finalize the character without regenerating.

### None

Show initials and Generate Portrait.

The player may still finalize without generating.

### Failure

Show fallback presentation and retry control.

The player may still finalize.

## Post-Creation Behavior

The initial implementation may restrict portrait generation to character creation.

However, the state model should not prevent later support for portrait regeneration from the character profile screen.

If post-creation appearance editing is ever supported, the same fingerprint / stale-state model should be reused.

Do not create a second portrait authority for the runtime character sheet.

## Provider Choice Must Not Be Player Choice

Ordinary users should not select:

- Perchance;
- Provider A;
- Provider B;
- model versions;
- sampler settings;
- inference steps;
- guidance scale;
- negative-prompt syntax.

Provider routing belongs in application configuration.

A development/debug build may expose diagnostics separately.

## Diagnostics

Developer mode may expose:

- provider ID;
- prompt version;
- render profile ID;
- identity fingerprint;
- request status;
- normalized provider error code;
- generation ID;
- asset reference;
- optional serialized prompt preview.

Do not show this clutter in normal character creation.

## Error Categories

Normalize provider failures into a small application-owned set.

Recommended examples:

~~~ts
type PortraitGenerationErrorCode =
  | "provider_unavailable"
  | "rate_limited"
  | "request_rejected"
  | "generation_failed"
  | "asset_persistence_failed"
  | "unknown";
~~~

The provider adapter translates provider-specific errors into these application-level categories.

## Failure UX

Normal-user copy should remain simple.

Examples:

**Provider unavailable**

> Portrait generation is unavailable right now. Your character is still ready to use.

**Generation failed**

> The portrait could not be generated. You can try again or continue without it.

**Regeneration failed**

> The new portrait could not be generated. Your previous portrait has been kept.

Do not expose raw third-party error payloads in ordinary UI.

## Existing Initials Fallback

The current runtime already derives portrait initials from the player name.

That behavior should remain available.

Recommended priority:

~~~text
valid non-stale or stale portrait asset
        |
        v
portrait image

otherwise
        |
        v
existing initials fallback
~~~

A stale image may remain visible because it is still a valid prior asset, but the UI should mark it as outdated.

## Testing Requirements

A future implementation should include tests for:

- empty state renders Generate Portrait;
- successful generation transitions to ready state;
- ready state renders Regenerate Portrait;
- changing portrait-relevant identity transitions ready to stale;
- stale state retains the previous image;
- stale state exposes Regenerate Portrait;
- changing non-portrait state does not mark portrait stale;
- generation cannot mutate character stats;
- generation cannot mutate trait IDs;
- generation cannot mutate appearance descriptor IDs;
- failed first generation preserves initials fallback;
- failed regeneration preserves prior portrait;
- duplicate concurrent clicks do not submit duplicate requests;
- generation failure never invalidates character creation;
- provider-specific errors normalize into app-owned categories;
- prompt generation is deterministic for the same canonical identity;
- prompt spec remains provider-independent;
- provider swap does not alter the identity fingerprint;
- test render profile requests hips-up framing;
- test render profile excludes visible hands and held objects;
- ordinary equipment changes do not stale the v1 identity portrait;
- provider metadata does not enter gameplay stat resolution.

## Implementation Sequence

### Phase 1: provider-neutral UI state

Implement the portrait card and Generate / Regenerate state machine using a fake or deterministic local stub provider.

This proves UI and persistence boundaries before coupling to any external generation service.

### Phase 2: prompt-spec serializer

Implement deterministic conversion from canonical character data to `CharacterPortraitPromptSpec`.

### Phase 3: test render profile

Implement `portrait_profile.creator_test_v1` with hips-up, hands-out-of-frame constraints.

### Phase 4: prototype provider adapter

Only after re-checking current provider rules, determine whether Perchance can participate as:

- a permitted automated adapter;
- a purpose-built embedded test generator;
- or an assisted development provider.

Do not force an unsupported integration shape.

### Phase 5: asset persistence

Persist the resulting portrait asset through Lineage-owned storage or another stable asset mechanism rather than treating a transient provider page as permanent storage.

### Phase 6: production provider replacement

When the project enters production, introduce a reliable API-backed provider behind the same interface.

The visible Generate / Regenerate UI should not need to change.

## Explicit Non-Goals For The Perchance Prototype

Do not use the prototype to build:

- a general AI art workstation inside the game;
- free-form player prompt editing;
- a model-selection UI;
- advanced generation controls;
- equipment paper-doll regeneration;
- automatic portraits on every appearance click;
- portrait-derived character mechanics;
- a permanent dependency on one free web generator.

## Production Migration Requirement

The production transition is successful if the project can replace the prototype provider while leaving these unchanged:

- `PlayerIdentityProfile`;
- trait IDs;
- appearance descriptor IDs;
- lineage morphology IDs;
- identity fingerprint semantics;
- Generate / Regenerate controls;
- stale-state behavior;
- portrait asset presentation;
- save validity when no portrait exists.

Only the provider adapter, renderer configuration, and potentially asset-storage implementation should need to change.

## Recommended V1 UX Decision

The portrait portion of character creation should present exactly one principal action at a time:

~~~text
NO PORTRAIT
Generate Portrait

PORTRAIT READY
Regenerate Portrait

PORTRAIT STALE
Regenerate Portrait

GENERATION FAILED
Retry Portrait
~~~

No manual prompt field.

No style picker.

No provider picker.

No model settings.

No requirement to generate before continuing.

The character creator determines who the character is.

The image provider only supplies a portrait of that character.
