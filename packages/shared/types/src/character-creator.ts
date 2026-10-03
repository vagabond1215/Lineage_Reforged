import "./contracts.js";

declare module "./contracts.js" {
  interface PlayerIdentityProfile {
    /** Creator-profile stat-shaping traits. Distinct from PlayerState.traits runtime passives. */
    profileTraitIds?: string[];
    /** Appearance-only durable character facts used by portrait/rendering systems. */
    appearanceDescriptorIds?: string[];
  }
}

export type CharacterProfileTraitId = `profile_trait.${string}`;
export type CharacterAppearanceDescriptorId = `appearance.${string}`;
