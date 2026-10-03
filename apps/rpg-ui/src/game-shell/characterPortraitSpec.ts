import type { PlayerIdentityAgeBandId } from "../../../../packages/shared/types/src/index.js";
import {
  getCharacterAppearanceDescriptor,
  type CharacterAppearanceDescriptorId
} from "./characterCreationAppearance.js";
import {
  getCharacterProfileTrait,
  type CharacterProfileTraitId
} from "./characterCreationProfileTraits.js";

export type CharacterPortraitRenderProfileId =
  | "portrait_profile.creator_test_v1"
  | "portrait_profile.creator_production_v1";

export interface CharacterPortraitRenderProfile {
  id: CharacterPortraitRenderProfileId;
  promptVersion: number;
  framing: "hips_up" | "waist_up" | "bust" | "full_body";
  aspectRatio: "4:5" | "3:4" | "1:1";
  subjectCount: 1;
  handsPolicy: "exclude" | "allow" | "prefer_hidden";
  heldPropsAllowed: boolean;
  visibleWeaponsAllowed: boolean;
  posePolicy: "neutral" | "reserved" | "dynamic";
  backgroundPolicy: "simple" | "contextual" | "environmental";
  faceSafeCropRequired: boolean;
}

export interface LineagePortraitProfile {
  lineageId: string;
  label: string;
  morphologyFragments: string[];
  proportionFragments: string[];
  sexPresentationFragments: {
    male: string[];
    female: string[];
  };
}

export interface CharacterPortraitPromptSpec {
  version: number;
  lineageId: string;
  sexId: "male" | "female";
  ageBandId: PlayerIdentityAgeBandId;
  heightCm: number | null;
  profileTraitIds: CharacterProfileTraitId[];
  appearanceDescriptorIds: CharacterAppearanceDescriptorId[];
  skinToneId: string;
  hairColorId: string;
  hairHighlightColorId: string | null;
  eyeColorId: string;
  renderProfileId: CharacterPortraitRenderProfileId;
  artDirectionFragments: string[];
  morphologyFragments: string[];
  buildFragments: string[];
  faceFragments: string[];
  hairFragments: string[];
  markingFragments: string[];
  demeanorFragments: string[];
  colorationFragments: string[];
  compositionFragments: string[];
  promptText: string;
}

export interface BuildCharacterPortraitPromptSpecInput {
  lineageId: string;
  sexId: "male" | "female";
  ageBandId: PlayerIdentityAgeBandId;
  heightCm: number | null;
  profileTraitIds: readonly string[];
  appearanceDescriptorIds: readonly string[];
  skinToneId: string;
  skinToneLabel: string;
  hairColorId: string;
  hairColorLabel: string;
  hairHighlightColorId?: string | null;
  hairHighlightColorLabel?: string | null;
  eyeColorId: string;
  eyeColorLabel: string;
  renderProfileId?: CharacterPortraitRenderProfileId;
}

export const CREATOR_TEST_PORTRAIT_RENDER_PROFILE: CharacterPortraitRenderProfile = {
  id: "portrait_profile.creator_test_v1",
  promptVersion: 1,
  framing: "hips_up",
  aspectRatio: "4:5",
  subjectCount: 1,
  handsPolicy: "exclude",
  heldPropsAllowed: false,
  visibleWeaponsAllowed: false,
  posePolicy: "reserved",
  backgroundPolicy: "simple",
  faceSafeCropRequired: true
};

export const CREATOR_PRODUCTION_PORTRAIT_RENDER_PROFILE: CharacterPortraitRenderProfile = {
  id: "portrait_profile.creator_production_v1",
  promptVersion: 1,
  framing: "hips_up",
  aspectRatio: "4:5",
  subjectCount: 1,
  handsPolicy: "prefer_hidden",
  heldPropsAllowed: false,
  visibleWeaponsAllowed: false,
  posePolicy: "reserved",
  backgroundPolicy: "contextual",
  faceSafeCropRequired: true
};

const RENDER_PROFILES: Record<CharacterPortraitRenderProfileId, CharacterPortraitRenderProfile> = {
  [CREATOR_TEST_PORTRAIT_RENDER_PROFILE.id]: CREATOR_TEST_PORTRAIT_RENDER_PROFILE,
  [CREATOR_PRODUCTION_PORTRAIT_RENDER_PROFILE.id]: CREATOR_PRODUCTION_PORTRAIT_RENDER_PROFILE
};

export const LINEAGE_PORTRAIT_PROFILES: Record<string, LineagePortraitProfile> = {
  "lineage.human": {
    lineageId: "lineage.human",
    label: "Human",
    morphologyFragments: ["human facial anatomy"],
    proportionFragments: ["natural human proportions"],
    sexPresentationFragments: { male: ["adult man"], female: ["adult woman"] }
  },
  "lineage.dwarf": {
    lineageId: "lineage.dwarf",
    label: "Dwarf",
    morphologyFragments: ["dwarven facial anatomy", "broad sturdy facial structure"],
    proportionFragments: ["short compact proportions", "dense sturdy torso"],
    sexPresentationFragments: { male: ["adult dwarven man"], female: ["adult dwarven woman"] }
  },
  "lineage.gnome": {
    lineageId: "lineage.gnome",
    label: "Gnome",
    morphologyFragments: ["gnomish facial anatomy", "small refined facial proportions"],
    proportionFragments: ["very short compact proportions"],
    sexPresentationFragments: { male: ["adult gnomish man"], female: ["adult gnomish woman"] }
  },
  "lineage.halfling": {
    lineageId: "lineage.halfling",
    label: "Halfling",
    morphologyFragments: ["halfling facial anatomy", "humanlike rounded facial proportions"],
    proportionFragments: ["very short compact humanlike proportions"],
    sexPresentationFragments: { male: ["adult halfling man"], female: ["adult halfling woman"] }
  },
  "lineage.elf": {
    lineageId: "lineage.elf",
    label: "Elf",
    morphologyFragments: ["elven facial anatomy", "clearly pointed elegant ears", "refined facial planes"],
    proportionFragments: ["tall light elven proportions"],
    sexPresentationFragments: { male: ["adult elven man"], female: ["adult elven woman"] }
  },
  "lineage.dark_elf": {
    lineageId: "lineage.dark_elf",
    label: "Dark Elf",
    morphologyFragments: ["dark-elven facial anatomy", "clearly pointed ears", "angular refined facial planes"],
    proportionFragments: ["tall light dark-elven proportions"],
    sexPresentationFragments: { male: ["adult dark-elven man"], female: ["adult dark-elven woman"] }
  },
  "lineage.half_troll": {
    lineageId: "lineage.half_troll",
    label: "Half-Troll",
    morphologyFragments: ["human and troll blended facial anatomy", "heavy brow", "broad powerful jaw", "recognizably humanoid face"],
    proportionFragments: ["very tall heavy proportions", "substantial torso and neck"],
    sexPresentationFragments: { male: ["adult half-troll man"], female: ["adult half-troll woman"] }
  },
  "lineage.half_orc": {
    lineageId: "lineage.half_orc",
    label: "Half-Orc",
    morphologyFragments: ["human and orc blended facial anatomy", "strong jaw", "small visible lower tusks", "recognizably humanoid face"],
    proportionFragments: ["tall strong proportions"],
    sexPresentationFragments: { male: ["adult half-orc man"], female: ["adult half-orc woman"] }
  },
  "lineage.half_goblin": {
    lineageId: "lineage.half_goblin",
    label: "Half-Goblin",
    morphologyFragments: ["human and goblin blended facial anatomy", "slightly pointed ears", "compact sharp facial proportions", "recognizably humanoid face"],
    proportionFragments: ["short lean proportions"],
    sexPresentationFragments: { male: ["adult half-goblin man"], female: ["adult half-goblin woman"] }
  },
  "lineage.half_merfolk": {
    lineageId: "lineage.half_merfolk",
    label: "Half-Merfolk",
    morphologyFragments: ["human and merfolk blended facial anatomy", "subtle paired gill slits at the sides of the neck", "faint aquatic skin texture", "recognizably humanoid face"],
    proportionFragments: ["fluid balanced humanlike proportions"],
    sexPresentationFragments: { male: ["adult half-merfolk man"], female: ["adult half-merfolk woman"] }
  }
};

const ART_DIRECTION = [
  "grounded medieval historical-fantasy character portrait",
  "believable anatomy",
  "natural materials and restrained visual effects",
  "no modern clothing or technology",
  "no text or lettering inside the image"
];

function getRenderProfile(id: CharacterPortraitRenderProfileId): CharacterPortraitRenderProfile {
  return RENDER_PROFILES[id];
}

function ageFragments(ageBandId: PlayerIdentityAgeBandId): string[] {
  switch (ageBandId) {
    case "young_adult":
      return ["young adult, clearly adult, not adolescent", "minimal age lines"];
    case "prime":
      return ["fully mature adult"];
    case "mature":
      return ["mature adult", "modest natural age lines"];
    case "senior":
      return ["older adult", "clear natural age lines and mature skin texture"];
    default:
      return ["adult"];
  }
}

function appearanceGroup(
  ids: readonly string[],
  categories: readonly string[]
): string[] {
  return ids.flatMap((id) => {
    const entry = getCharacterAppearanceDescriptor(id);
    if (!entry || !categories.includes(entry.category)) return [];
    return entry.portraitFragments;
  });
}

function buildFragments(profileTraitIds: readonly string[]): {
  build: string[];
  demeanor: string[];
} {
  const resolved = profileTraitIds.flatMap((id) => {
    const entry = getCharacterProfileTrait(id);
    return entry ? [entry] : [];
  });
  const build = resolved
    .filter((entry) => ["body.frame", "physical.aptitude", "physical.condition"].includes(entry.category))
    .flatMap((entry) => entry.portraitFragments)
    .slice(0, 4);

  const categoryPriority = ["presence", "temperament", "cognition"] as const;
  const demeanor: string[] = [];
  for (const category of categoryPriority) {
    const match = resolved.find((entry) => entry.category === category);
    if (match) demeanor.push(...match.portraitFragments.slice(0, 1));
  }
  return { build, demeanor: demeanor.slice(0, 2) };
}

function compositionFragments(profile: CharacterPortraitRenderProfile): string[] {
  const fragments = ["single character only"];
  if (profile.framing === "hips_up") fragments.push("hips-up portrait framing");
  if (profile.framing === "waist_up") fragments.push("waist-up portrait framing");
  if (profile.framing === "bust") fragments.push("bust portrait framing");
  if (profile.framing === "full_body") fragments.push("full-body framing");
  if (profile.handsPolicy === "exclude") fragments.push("arms continue below the crop, hands and wrists fully outside the frame");
  if (profile.handsPolicy === "prefer_hidden") fragments.push("hands hidden or outside the frame");
  if (!profile.heldPropsAllowed) fragments.push("no held props");
  if (!profile.visibleWeaponsAllowed) fragments.push("no held weapons");
  if (profile.posePolicy === "reserved") fragments.push("neutral reserved pose");
  if (profile.backgroundPolicy === "simple") fragments.push("simple subdued background");
  if (profile.faceSafeCropRequired) fragments.push("face fully visible with safe headroom for square avatar cropping");
  return fragments;
}

export function buildCharacterPortraitPromptSpec(
  input: BuildCharacterPortraitPromptSpecInput
): CharacterPortraitPromptSpec {
  const renderProfile = getRenderProfile(input.renderProfileId ?? CREATOR_TEST_PORTRAIT_RENDER_PROFILE.id);
  const lineage = LINEAGE_PORTRAIT_PROFILES[input.lineageId] ?? LINEAGE_PORTRAIT_PROFILES["lineage.human"]!;
  const profileFragments = buildFragments(input.profileTraitIds);
  const sortedAppearanceIds = [...input.appearanceDescriptorIds].sort() as CharacterAppearanceDescriptorId[];
  const sortedProfileTraitIds = [...input.profileTraitIds].sort() as CharacterProfileTraitId[];

  const faceFragments = appearanceGroup(sortedAppearanceIds, [
    "face.shape", "face.jaw", "face.cheekbones", "face.nose", "face.eye_shape", "face.brows", "complexion.detail"
  ]);
  const hairFragments = appearanceGroup(sortedAppearanceIds, [
    "hair.length", "hair.texture", "hair.density", "hair.primary_style", "facial_hair.primary_style"
  ]);
  const markingFragments = appearanceGroup(sortedAppearanceIds, [
    "marking.facial_scar", "marking.birthmark", "marking.tattoo", "adornment.piercing", "adornment.identity"
  ]);
  const colorationFragments = [
    `${input.skinToneLabel} skin tone`,
    `${input.eyeColorLabel} eyes`,
    `${input.hairColorLabel} hair`,
    ...(input.hairHighlightColorLabel ? [`${input.hairHighlightColorLabel} hair highlights`] : [])
  ];
  const morphologyFragments = [
    ...lineage.sexPresentationFragments[input.sexId],
    ...lineage.morphologyFragments,
    ...lineage.proportionFragments,
    ...ageFragments(input.ageBandId)
  ];
  const composition = compositionFragments(renderProfile);
  const promptParts = [
    ...ART_DIRECTION,
    ...composition,
    ...morphologyFragments,
    ...profileFragments.build,
    ...faceFragments,
    ...colorationFragments,
    ...hairFragments,
    ...markingFragments,
    ...profileFragments.demeanor,
    "practical setting-appropriate clothing"
  ].filter(Boolean);

  return {
    version: renderProfile.promptVersion,
    lineageId: input.lineageId,
    sexId: input.sexId,
    ageBandId: input.ageBandId,
    heightCm: input.heightCm,
    profileTraitIds: sortedProfileTraitIds,
    appearanceDescriptorIds: sortedAppearanceIds,
    skinToneId: input.skinToneId,
    hairColorId: input.hairColorId,
    hairHighlightColorId: input.hairHighlightColorId ?? null,
    eyeColorId: input.eyeColorId,
    renderProfileId: renderProfile.id,
    artDirectionFragments: [...ART_DIRECTION],
    morphologyFragments,
    buildFragments: profileFragments.build,
    faceFragments,
    hairFragments,
    markingFragments,
    demeanorFragments: profileFragments.demeanor,
    colorationFragments,
    compositionFragments: composition,
    promptText: promptParts.join("; ")
  };
}

function stableStringifyPortraitIdentity(spec: CharacterPortraitPromptSpec): string {
  return JSON.stringify({
    version: spec.version,
    lineageId: spec.lineageId,
    sexId: spec.sexId,
    ageBandId: spec.ageBandId,
    heightCm: spec.heightCm,
    profileTraitIds: [...spec.profileTraitIds].sort(),
    appearanceDescriptorIds: [...spec.appearanceDescriptorIds].sort(),
    skinToneId: spec.skinToneId,
    hairColorId: spec.hairColorId,
    hairHighlightColorId: spec.hairHighlightColorId,
    eyeColorId: spec.eyeColorId
  });
}

function fnv1a32(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function createCharacterPortraitIdentityFingerprint(
  spec: CharacterPortraitPromptSpec
): string {
  return `portrait_identity.v${spec.version}.${fnv1a32(stableStringifyPortraitIdentity(spec))}`;
}
