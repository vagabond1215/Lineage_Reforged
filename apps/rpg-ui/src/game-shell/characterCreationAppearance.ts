export type CharacterAppearanceCategory =
  | "face.shape"
  | "face.jaw"
  | "face.cheekbones"
  | "face.nose"
  | "face.eye_shape"
  | "face.brows"
  | "complexion.detail"
  | "hair.length"
  | "hair.texture"
  | "hair.density"
  | "hair.primary_style"
  | "facial_hair.primary_style"
  | "marking.facial_scar"
  | "marking.birthmark"
  | "marking.tattoo"
  | "adornment.piercing"
  | "adornment.identity";

export type CharacterAppearanceDescriptorId = `appearance.${string}`;
export type CharacterHairLengthRank = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CharacterAppearanceSexId = "male" | "female";

export type CharacterAppearanceRequirement =
  | { type: "hair_length_at_least"; value: CharacterHairLengthRank }
  | { type: "hair_length_at_most"; value: CharacterHairLengthRank }
  | { type: "sex"; value: CharacterAppearanceSexId }
  | { type: "lineage"; value: string }
  | { type: "descriptor"; value: CharacterAppearanceDescriptorId }
  | { type: "not_descriptor"; value: CharacterAppearanceDescriptorId };

export interface CharacterAppearanceDescriptorDefinition {
  id: CharacterAppearanceDescriptorId;
  category: CharacterAppearanceCategory;
  label: string;
  description: string;
  portraitFragments: string[];
  exclusiveGroupId?: string;
  conflictsWith?: CharacterAppearanceDescriptorId[];
  requiresAll?: CharacterAppearanceRequirement[];
  requiresAny?: CharacterAppearanceRequirement[];
  allowedSexIds?: CharacterAppearanceSexId[];
  allowedLineageIds?: string[];
  blockedLineageIds?: string[];
  selectionLimitGroupId?: string;
  promptPriority?: number;
  hairLengthRank?: CharacterHairLengthRank;
}

export interface CharacterAppearanceValidationResult {
  isValid: boolean;
  errors: string[];
}

const selectionLimits: Record<string, number> = {
  "appearance.complexion.detail": 2,
  "appearance.marking.facial_scar": 2,
  "appearance.marking.birthmark": 1,
  "appearance.marking.tattoo": 2,
  "appearance.adornment.piercing": 2,
  "appearance.adornment.identity": 2
};

function descriptor(
  value: CharacterAppearanceDescriptorDefinition
): CharacterAppearanceDescriptorDefinition {
  return value;
}

export const CHARACTER_APPEARANCE_DESCRIPTORS: readonly CharacterAppearanceDescriptorDefinition[] = [
  descriptor({ id: "appearance.face.shape.oval", category: "face.shape", label: "Oval", description: "An oval facial outline.", portraitFragments: ["oval face"], exclusiveGroupId: "appearance.face.shape", promptPriority: 70 }),
  descriptor({ id: "appearance.face.shape.angular", category: "face.shape", label: "Angular", description: "A face with angular planes and defined edges.", portraitFragments: ["angular face with defined planes"], exclusiveGroupId: "appearance.face.shape", promptPriority: 70 }),
  descriptor({ id: "appearance.face.shape.round", category: "face.shape", label: "Round", description: "A softly rounded facial outline.", portraitFragments: ["round face"], exclusiveGroupId: "appearance.face.shape", promptPriority: 70 }),
  descriptor({ id: "appearance.face.shape.square", category: "face.shape", label: "Square", description: "A square facial outline with balanced width.", portraitFragments: ["square face"], exclusiveGroupId: "appearance.face.shape", promptPriority: 70 }),
  descriptor({ id: "appearance.face.shape.long", category: "face.shape", label: "Long", description: "A longer, narrower facial outline.", portraitFragments: ["long narrow face"], exclusiveGroupId: "appearance.face.shape", promptPriority: 70 }),
  descriptor({ id: "appearance.face.shape.broad", category: "face.shape", label: "Broad", description: "A broad facial structure.", portraitFragments: ["broad face"], exclusiveGroupId: "appearance.face.shape", promptPriority: 70 }),
  descriptor({ id: "appearance.face.shape.heart", category: "face.shape", label: "Heart-Shaped", description: "A heart-shaped facial outline.", portraitFragments: ["heart-shaped face"], exclusiveGroupId: "appearance.face.shape", promptPriority: 70 }),

  descriptor({ id: "appearance.face.jaw.strong", category: "face.jaw", label: "Strong Jaw", description: "A strong, clearly defined jaw.", portraitFragments: ["strong defined jaw"], exclusiveGroupId: "appearance.face.jaw", promptPriority: 45 }),
  descriptor({ id: "appearance.face.jaw.broad", category: "face.jaw", label: "Broad Jaw", description: "A broad jawline.", portraitFragments: ["broad jawline"], exclusiveGroupId: "appearance.face.jaw", promptPriority: 45 }),
  descriptor({ id: "appearance.face.jaw.narrow", category: "face.jaw", label: "Narrow Jaw", description: "A narrow jawline.", portraitFragments: ["narrow jawline"], exclusiveGroupId: "appearance.face.jaw", promptPriority: 45 }),
  descriptor({ id: "appearance.face.jaw.soft", category: "face.jaw", label: "Soft Jaw", description: "A softer rounded jawline.", portraitFragments: ["soft rounded jawline"], exclusiveGroupId: "appearance.face.jaw", promptPriority: 45 }),
  descriptor({ id: "appearance.face.jaw.pointed", category: "face.jaw", label: "Pointed Chin", description: "A tapered jaw ending in a pointed chin.", portraitFragments: ["tapered jaw with pointed chin"], exclusiveGroupId: "appearance.face.jaw", promptPriority: 45 }),

  descriptor({ id: "appearance.face.cheekbones.high", category: "face.cheekbones", label: "High Cheekbones", description: "High-set cheekbones.", portraitFragments: ["high cheekbones"], exclusiveGroupId: "appearance.face.cheekbones", promptPriority: 45 }),
  descriptor({ id: "appearance.face.cheekbones.pronounced", category: "face.cheekbones", label: "Pronounced", description: "Pronounced cheekbone structure.", portraitFragments: ["pronounced cheekbones"], exclusiveGroupId: "appearance.face.cheekbones", promptPriority: 45 }),
  descriptor({ id: "appearance.face.cheekbones.broad", category: "face.cheekbones", label: "Broad", description: "Broad cheek structure.", portraitFragments: ["broad cheek structure"], exclusiveGroupId: "appearance.face.cheekbones", promptPriority: 45 }),
  descriptor({ id: "appearance.face.cheekbones.soft", category: "face.cheekbones", label: "Soft", description: "Soft cheek contours.", portraitFragments: ["soft cheek contours"], exclusiveGroupId: "appearance.face.cheekbones", promptPriority: 45 }),

  descriptor({ id: "appearance.face.nose.straight", category: "face.nose", label: "Straight", description: "A straight nose profile.", portraitFragments: ["straight nose"], exclusiveGroupId: "appearance.face.nose", promptPriority: 50 }),
  descriptor({ id: "appearance.face.nose.aquiline", category: "face.nose", label: "Aquiline", description: "An aquiline nose profile.", portraitFragments: ["aquiline nose"], exclusiveGroupId: "appearance.face.nose", promptPriority: 50 }),
  descriptor({ id: "appearance.face.nose.broad", category: "face.nose", label: "Broad", description: "A broad nose.", portraitFragments: ["broad nose"], exclusiveGroupId: "appearance.face.nose", promptPriority: 50 }),
  descriptor({ id: "appearance.face.nose.narrow", category: "face.nose", label: "Narrow", description: "A narrow nose.", portraitFragments: ["narrow nose"], exclusiveGroupId: "appearance.face.nose", promptPriority: 50 }),
  descriptor({ id: "appearance.face.nose.hooked", category: "face.nose", label: "Hooked", description: "A hooked nose profile.", portraitFragments: ["hooked nose"], exclusiveGroupId: "appearance.face.nose", promptPriority: 50 }),
  descriptor({ id: "appearance.face.nose.upturned", category: "face.nose", label: "Upturned", description: "A slightly upturned nose.", portraitFragments: ["slightly upturned nose"], exclusiveGroupId: "appearance.face.nose", promptPriority: 50 }),
  descriptor({ id: "appearance.face.nose.crooked", category: "face.nose", label: "Crooked", description: "A naturally crooked nose.", portraitFragments: ["naturally crooked nose"], exclusiveGroupId: "appearance.face.nose", promptPriority: 50 }),

  descriptor({ id: "appearance.face.eye_shape.almond", category: "face.eye_shape", label: "Almond", description: "Almond-shaped eyes.", portraitFragments: ["almond-shaped eyes"], exclusiveGroupId: "appearance.face.eye_shape", promptPriority: 60 }),
  descriptor({ id: "appearance.face.eye_shape.round", category: "face.eye_shape", label: "Round", description: "Round eyes.", portraitFragments: ["round eyes"], exclusiveGroupId: "appearance.face.eye_shape", promptPriority: 60 }),
  descriptor({ id: "appearance.face.eye_shape.narrow", category: "face.eye_shape", label: "Narrow", description: "Narrow eye shape.", portraitFragments: ["narrow eyes"], exclusiveGroupId: "appearance.face.eye_shape", promptPriority: 60 }),
  descriptor({ id: "appearance.face.eye_shape.deep_set", category: "face.eye_shape", label: "Deep-Set", description: "Deep-set eyes.", portraitFragments: ["deep-set eyes"], exclusiveGroupId: "appearance.face.eye_shape", promptPriority: 60 }),
  descriptor({ id: "appearance.face.eye_shape.hooded", category: "face.eye_shape", label: "Hooded", description: "Hooded eyes.", portraitFragments: ["hooded eyes"], exclusiveGroupId: "appearance.face.eye_shape", promptPriority: 60 }),
  descriptor({ id: "appearance.face.eye_shape.wide_set", category: "face.eye_shape", label: "Wide-Set", description: "Widely spaced eyes.", portraitFragments: ["widely spaced eyes"], exclusiveGroupId: "appearance.face.eye_shape", promptPriority: 60 }),

  descriptor({ id: "appearance.face.brows.straight", category: "face.brows", label: "Straight", description: "Straight brows.", portraitFragments: ["straight brows"], exclusiveGroupId: "appearance.face.brows", promptPriority: 35 }),
  descriptor({ id: "appearance.face.brows.arched", category: "face.brows", label: "Arched", description: "Arched brows.", portraitFragments: ["arched brows"], exclusiveGroupId: "appearance.face.brows", promptPriority: 35 }),
  descriptor({ id: "appearance.face.brows.thick", category: "face.brows", label: "Thick", description: "Thick prominent brows.", portraitFragments: ["thick prominent brows"], exclusiveGroupId: "appearance.face.brows", promptPriority: 35 }),
  descriptor({ id: "appearance.face.brows.fine", category: "face.brows", label: "Fine", description: "Fine brows.", portraitFragments: ["fine brows"], exclusiveGroupId: "appearance.face.brows", promptPriority: 35 }),
  descriptor({ id: "appearance.face.brows.heavy", category: "face.brows", label: "Heavy", description: "Heavy-set brows.", portraitFragments: ["heavy-set brows"], exclusiveGroupId: "appearance.face.brows", promptPriority: 35 }),

  descriptor({ id: "appearance.complexion.freckled", category: "complexion.detail", label: "Freckled", description: "Natural facial freckles.", portraitFragments: ["natural facial freckles"], selectionLimitGroupId: "appearance.complexion.detail", promptPriority: 55 }),
  descriptor({ id: "appearance.complexion.weathered", category: "complexion.detail", label: "Weathered", description: "Weathered skin texture.", portraitFragments: ["weathered skin texture"], selectionLimitGroupId: "appearance.complexion.detail", promptPriority: 40, conflictsWith: ["appearance.complexion.smooth"] }),
  descriptor({ id: "appearance.complexion.sun_lined", category: "complexion.detail", label: "Sun-Lined", description: "Fine sun and weather lines.", portraitFragments: ["fine sun and weather lines"], selectionLimitGroupId: "appearance.complexion.detail", promptPriority: 40 }),
  descriptor({ id: "appearance.complexion.rosy", category: "complexion.detail", label: "Rosy", description: "Naturally rosy cheeks.", portraitFragments: ["naturally rosy cheeks"], selectionLimitGroupId: "appearance.complexion.detail", promptPriority: 35 }),
  descriptor({ id: "appearance.complexion.pockmarked", category: "complexion.detail", label: "Pockmarked", description: "Subtle old pockmark scarring.", portraitFragments: ["subtle old pockmark scarring"], selectionLimitGroupId: "appearance.complexion.detail", promptPriority: 40, conflictsWith: ["appearance.complexion.smooth"] }),
  descriptor({ id: "appearance.complexion.smooth", category: "complexion.detail", label: "Smooth", description: "Smooth even facial complexion.", portraitFragments: ["smooth even facial complexion"], selectionLimitGroupId: "appearance.complexion.detail", promptPriority: 30, conflictsWith: ["appearance.complexion.weathered", "appearance.complexion.pockmarked"] }),

  descriptor({ id: "appearance.hair.length.shaved", category: "hair.length", label: "Shaved", description: "Shaved or nearly shaved hair.", portraitFragments: ["shaved head or nearly shaved hair"], exclusiveGroupId: "appearance.hair.length", hairLengthRank: 0, promptPriority: 80 }),
  descriptor({ id: "appearance.hair.length.cropped", category: "hair.length", label: "Cropped", description: "Close-cropped hair.", portraitFragments: ["close-cropped hair"], exclusiveGroupId: "appearance.hair.length", hairLengthRank: 1, promptPriority: 80 }),
  descriptor({ id: "appearance.hair.length.short", category: "hair.length", label: "Short", description: "Short hair.", portraitFragments: ["short hair"], exclusiveGroupId: "appearance.hair.length", hairLengthRank: 2, promptPriority: 80 }),
  descriptor({ id: "appearance.hair.length.medium", category: "hair.length", label: "Medium", description: "Medium-length hair.", portraitFragments: ["medium-length hair"], exclusiveGroupId: "appearance.hair.length", hairLengthRank: 3, promptPriority: 80 }),
  descriptor({ id: "appearance.hair.length.shoulder", category: "hair.length", label: "Shoulder-Length", description: "Shoulder-length hair.", portraitFragments: ["shoulder-length hair"], exclusiveGroupId: "appearance.hair.length", hairLengthRank: 4, promptPriority: 80 }),
  descriptor({ id: "appearance.hair.length.long", category: "hair.length", label: "Long", description: "Long hair below the shoulders.", portraitFragments: ["long hair"], exclusiveGroupId: "appearance.hair.length", hairLengthRank: 5, promptPriority: 80 }),
  descriptor({ id: "appearance.hair.length.very_long", category: "hair.length", label: "Very Long", description: "Very long hair extending well below the shoulders.", portraitFragments: ["very long hair extending well below the shoulders"], exclusiveGroupId: "appearance.hair.length", hairLengthRank: 6, promptPriority: 80 }),

  descriptor({ id: "appearance.hair.texture.straight", category: "hair.texture", label: "Straight", description: "Naturally straight hair.", portraitFragments: ["straight hair texture"], exclusiveGroupId: "appearance.hair.texture", promptPriority: 70 }),
  descriptor({ id: "appearance.hair.texture.wavy", category: "hair.texture", label: "Wavy", description: "Naturally wavy hair.", portraitFragments: ["naturally wavy hair"], exclusiveGroupId: "appearance.hair.texture", promptPriority: 70 }),
  descriptor({ id: "appearance.hair.texture.curly", category: "hair.texture", label: "Curly", description: "Naturally curly hair.", portraitFragments: ["naturally curly hair"], exclusiveGroupId: "appearance.hair.texture", promptPriority: 70 }),
  descriptor({ id: "appearance.hair.texture.coiled", category: "hair.texture", label: "Coiled", description: "Tightly coiled hair.", portraitFragments: ["tightly coiled hair"], exclusiveGroupId: "appearance.hair.texture", promptPriority: 70 }),

  descriptor({ id: "appearance.hair.density.fine", category: "hair.density", label: "Fine", description: "Fine, light hair density.", portraitFragments: ["fine light hair density"], exclusiveGroupId: "appearance.hair.density", promptPriority: 25 }),
  descriptor({ id: "appearance.hair.density.average", category: "hair.density", label: "Average", description: "Natural medium hair density.", portraitFragments: ["natural medium hair density"], exclusiveGroupId: "appearance.hair.density", promptPriority: 25 }),
  descriptor({ id: "appearance.hair.density.thick", category: "hair.density", label: "Thick", description: "Thick, dense hair.", portraitFragments: ["thick dense hair"], exclusiveGroupId: "appearance.hair.density", promptPriority: 25 }),

  descriptor({ id: "appearance.hair.style.loose", category: "hair.primary_style", label: "Loose", description: "Hair worn loose.", portraitFragments: ["hair worn loose"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 2 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.side_part", category: "hair.primary_style", label: "Side Part", description: "Hair arranged with a side part.", portraitFragments: ["side-parted hair"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 2 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.swept_back", category: "hair.primary_style", label: "Swept Back", description: "Hair swept back from the face.", portraitFragments: ["hair swept back from the face"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 2 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.tied_back", category: "hair.primary_style", label: "Tied Back", description: "Hair tied back simply.", portraitFragments: ["hair tied back"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 3 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.ponytail", category: "hair.primary_style", label: "Ponytail", description: "Hair gathered into a ponytail.", portraitFragments: ["hair gathered into a ponytail"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 4 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.single_braid", category: "hair.primary_style", label: "Single Braid", description: "Hair arranged in a single braid.", portraitFragments: ["hair arranged in a single braid"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 4 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.twin_braids", category: "hair.primary_style", label: "Twin Braids", description: "Hair arranged in two braids.", portraitFragments: ["hair arranged in two braids"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 4 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.multiple_braids", category: "hair.primary_style", label: "Multiple Braids", description: "Hair arranged in several braids.", portraitFragments: ["hair arranged in several braids"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 4 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.bun", category: "hair.primary_style", label: "Bun", description: "Hair gathered into a bun.", portraitFragments: ["hair gathered into a bun"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 4 }], promptPriority: 65 }),
  descriptor({ id: "appearance.hair.style.topknot", category: "hair.primary_style", label: "Topknot", description: "Hair gathered into a topknot.", portraitFragments: ["hair gathered into a topknot"], exclusiveGroupId: "appearance.hair.primary_style", requiresAll: [{ type: "hair_length_at_least", value: 3 }], promptPriority: 65 }),

  descriptor({ id: "appearance.facial_hair.clean_shaven", category: "facial_hair.primary_style", label: "Clean-Shaven", description: "No visible facial hair.", portraitFragments: ["clean-shaven face"], exclusiveGroupId: "appearance.facial_hair.primary_style", allowedSexIds: ["male"], promptPriority: 60 }),
  descriptor({ id: "appearance.facial_hair.stubble", category: "facial_hair.primary_style", label: "Stubble", description: "Short facial stubble.", portraitFragments: ["short facial stubble"], exclusiveGroupId: "appearance.facial_hair.primary_style", allowedSexIds: ["male"], promptPriority: 60 }),
  descriptor({ id: "appearance.facial_hair.mustache", category: "facial_hair.primary_style", label: "Mustache", description: "A distinct mustache.", portraitFragments: ["distinct mustache"], exclusiveGroupId: "appearance.facial_hair.primary_style", allowedSexIds: ["male"], promptPriority: 60 }),
  descriptor({ id: "appearance.facial_hair.goatee", category: "facial_hair.primary_style", label: "Goatee", description: "A trimmed goatee.", portraitFragments: ["trimmed goatee"], exclusiveGroupId: "appearance.facial_hair.primary_style", allowedSexIds: ["male"], promptPriority: 60 }),
  descriptor({ id: "appearance.facial_hair.short_beard", category: "facial_hair.primary_style", label: "Short Beard", description: "A short full beard.", portraitFragments: ["short full beard"], exclusiveGroupId: "appearance.facial_hair.primary_style", allowedSexIds: ["male"], promptPriority: 60 }),
  descriptor({ id: "appearance.facial_hair.full_beard", category: "facial_hair.primary_style", label: "Full Beard", description: "A full beard.", portraitFragments: ["full beard"], exclusiveGroupId: "appearance.facial_hair.primary_style", allowedSexIds: ["male"], promptPriority: 60 }),
  descriptor({ id: "appearance.facial_hair.long_beard", category: "facial_hair.primary_style", label: "Long Beard", description: "A long full beard.", portraitFragments: ["long full beard"], exclusiveGroupId: "appearance.facial_hair.primary_style", allowedSexIds: ["male"], promptPriority: 60 }),
  descriptor({ id: "appearance.facial_hair.braided_beard", category: "facial_hair.primary_style", label: "Braided Beard", description: "A long beard arranged in braids.", portraitFragments: ["long beard arranged in braids"], exclusiveGroupId: "appearance.facial_hair.primary_style", allowedSexIds: ["male"], promptPriority: 60 }),

  descriptor({ id: "appearance.scar.left_eyebrow", category: "marking.facial_scar", label: "Left Brow Scar", description: "A small old scar crossing the left eyebrow.", portraitFragments: ["small old scar crossing the left eyebrow"], selectionLimitGroupId: "appearance.marking.facial_scar", promptPriority: 58 }),
  descriptor({ id: "appearance.scar.right_eyebrow", category: "marking.facial_scar", label: "Right Brow Scar", description: "A small old scar crossing the right eyebrow.", portraitFragments: ["small old scar crossing the right eyebrow"], selectionLimitGroupId: "appearance.marking.facial_scar", promptPriority: 58 }),
  descriptor({ id: "appearance.scar.left_cheek", category: "marking.facial_scar", label: "Left Cheek Scar", description: "A visible old scar across the left cheek.", portraitFragments: ["visible old scar across the left cheek"], selectionLimitGroupId: "appearance.marking.facial_scar", promptPriority: 58 }),
  descriptor({ id: "appearance.scar.right_cheek", category: "marking.facial_scar", label: "Right Cheek Scar", description: "A visible old scar across the right cheek.", portraitFragments: ["visible old scar across the right cheek"], selectionLimitGroupId: "appearance.marking.facial_scar", promptPriority: 58 }),
  descriptor({ id: "appearance.scar.nose_bridge", category: "marking.facial_scar", label: "Nose Bridge Scar", description: "An old scar over the bridge of the nose.", portraitFragments: ["old scar over the bridge of the nose"], selectionLimitGroupId: "appearance.marking.facial_scar", promptPriority: 58 }),
  descriptor({ id: "appearance.scar.upper_lip", category: "marking.facial_scar", label: "Lip Scar", description: "A small scar crossing the upper lip.", portraitFragments: ["small scar crossing the upper lip"], selectionLimitGroupId: "appearance.marking.facial_scar", promptPriority: 58 }),
  descriptor({ id: "appearance.scar.temple", category: "marking.facial_scar", label: "Temple Scar", description: "An old scar at the temple.", portraitFragments: ["old scar at the temple"], selectionLimitGroupId: "appearance.marking.facial_scar", promptPriority: 58 }),
  descriptor({ id: "appearance.scar.burn_patch", category: "marking.facial_scar", label: "Burn Scar", description: "A localized old facial burn scar.", portraitFragments: ["localized old facial burn scar"], selectionLimitGroupId: "appearance.marking.facial_scar", promptPriority: 58 }),

  descriptor({ id: "appearance.birthmark.cheek", category: "marking.birthmark", label: "Cheek Birthmark", description: "A visible natural birthmark on one cheek.", portraitFragments: ["visible natural birthmark on one cheek"], selectionLimitGroupId: "appearance.marking.birthmark", promptPriority: 42 }),
  descriptor({ id: "appearance.birthmark.temple", category: "marking.birthmark", label: "Temple Birthmark", description: "A natural birthmark near the temple.", portraitFragments: ["natural birthmark near the temple"], selectionLimitGroupId: "appearance.marking.birthmark", promptPriority: 42 }),
  descriptor({ id: "appearance.birthmark.neck", category: "marking.birthmark", label: "Neck Birthmark", description: "A visible natural birthmark along the neck.", portraitFragments: ["visible natural birthmark along the neck"], selectionLimitGroupId: "appearance.marking.birthmark", promptPriority: 42 }),

  descriptor({ id: "appearance.tattoo.temple", category: "marking.tattoo", label: "Temple Tattoo", description: "A small tattoo at the temple.", portraitFragments: ["small tattoo at the temple"], selectionLimitGroupId: "appearance.marking.tattoo", promptPriority: 38 }),
  descriptor({ id: "appearance.tattoo.cheek", category: "marking.tattoo", label: "Cheek Tattoo", description: "A small facial tattoo on the cheek.", portraitFragments: ["small facial tattoo on the cheek"], selectionLimitGroupId: "appearance.marking.tattoo", promptPriority: 38 }),
  descriptor({ id: "appearance.tattoo.neck", category: "marking.tattoo", label: "Neck Tattoo", description: "A visible tattoo along the neck.", portraitFragments: ["visible tattoo along the neck"], selectionLimitGroupId: "appearance.marking.tattoo", promptPriority: 38 }),
  descriptor({ id: "appearance.tattoo.throat", category: "marking.tattoo", label: "Throat Tattoo", description: "A visible tattoo at the throat.", portraitFragments: ["visible tattoo at the throat"], selectionLimitGroupId: "appearance.marking.tattoo", promptPriority: 38 }),

  descriptor({ id: "appearance.piercing.single_ear", category: "adornment.piercing", label: "Single Ear Piercing", description: "A single simple ear piercing.", portraitFragments: ["single simple ear piercing"], selectionLimitGroupId: "appearance.adornment.piercing", promptPriority: 30 }),
  descriptor({ id: "appearance.piercing.multiple_ear", category: "adornment.piercing", label: "Multiple Ear Piercings", description: "Several small ear piercings.", portraitFragments: ["several small ear piercings"], selectionLimitGroupId: "appearance.adornment.piercing", promptPriority: 30 }),
  descriptor({ id: "appearance.piercing.nose_ring", category: "adornment.piercing", label: "Nose Ring", description: "A small nose ring.", portraitFragments: ["small nose ring"], selectionLimitGroupId: "appearance.adornment.piercing", promptPriority: 30 }),
  descriptor({ id: "appearance.piercing.brow", category: "adornment.piercing", label: "Brow Piercing", description: "A small eyebrow piercing.", portraitFragments: ["small eyebrow piercing"], selectionLimitGroupId: "appearance.adornment.piercing", promptPriority: 30 }),

  descriptor({ id: "appearance.adornment.hair_beads", category: "adornment.identity", label: "Hair Beads", description: "A few simple beads worked into the hair.", portraitFragments: ["a few simple beads worked into the hair"], selectionLimitGroupId: "appearance.adornment.identity", requiresAll: [{ type: "hair_length_at_least", value: 3 }], promptPriority: 24 }),
  descriptor({ id: "appearance.adornment.beard_beads", category: "adornment.identity", label: "Beard Beads", description: "A few simple beads worked into a beard.", portraitFragments: ["a few simple beads worked into the beard"], selectionLimitGroupId: "appearance.adornment.identity", allowedSexIds: ["male"], requiresAny: [{ type: "descriptor", value: "appearance.facial_hair.full_beard" }, { type: "descriptor", value: "appearance.facial_hair.long_beard" }, { type: "descriptor", value: "appearance.facial_hair.braided_beard" }], promptPriority: 24 }),
  descriptor({ id: "appearance.adornment.simple_earrings", category: "adornment.identity", label: "Simple Earrings", description: "Simple understated earrings.", portraitFragments: ["simple understated earrings"], selectionLimitGroupId: "appearance.adornment.identity", promptPriority: 24 }),
  descriptor({ id: "appearance.adornment.neck_cord", category: "adornment.identity", label: "Neck Cord", description: "A simple cord necklace.", portraitFragments: ["simple cord necklace"], selectionLimitGroupId: "appearance.adornment.identity", promptPriority: 24 }),
  descriptor({ id: "appearance.adornment.headband", category: "adornment.identity", label: "Headband", description: "A plain practical headband.", portraitFragments: ["plain practical headband"], selectionLimitGroupId: "appearance.adornment.identity", requiresAll: [{ type: "hair_length_at_least", value: 1 }], promptPriority: 24 })
] as const;

const BY_ID = new Map(CHARACTER_APPEARANCE_DESCRIPTORS.map((entry) => [entry.id, entry]));

export const DEFAULT_CHARACTER_APPEARANCE_DESCRIPTOR_IDS: CharacterAppearanceDescriptorId[] = [
  "appearance.face.shape.oval",
  "appearance.hair.length.medium",
  "appearance.hair.texture.straight",
  "appearance.hair.density.average",
  "appearance.hair.style.loose"
];

export function getCharacterAppearanceDescriptor(
  id: string | null | undefined
): CharacterAppearanceDescriptorDefinition | null {
  if (!id) return null;
  return BY_ID.get(id as CharacterAppearanceDescriptorId) ?? null;
}

export function getCharacterAppearanceDescriptorsByCategory(
  category: CharacterAppearanceCategory
): CharacterAppearanceDescriptorDefinition[] {
  return CHARACTER_APPEARANCE_DESCRIPTORS.filter((entry) => entry.category === category);
}

function getHairLengthRank(selected: readonly CharacterAppearanceDescriptorDefinition[]): CharacterHairLengthRank | null {
  return selected.find((entry) => entry.category === "hair.length")?.hairLengthRank ?? null;
}

function requirementSatisfied(
  requirement: CharacterAppearanceRequirement,
  selected: readonly CharacterAppearanceDescriptorDefinition[],
  context: { sexId: CharacterAppearanceSexId; lineageId: string }
): boolean {
  const ids = new Set(selected.map((entry) => entry.id));
  const hairLengthRank = getHairLengthRank(selected);
  switch (requirement.type) {
    case "hair_length_at_least":
      return hairLengthRank !== null && hairLengthRank >= requirement.value;
    case "hair_length_at_most":
      return hairLengthRank !== null && hairLengthRank <= requirement.value;
    case "sex":
      return context.sexId === requirement.value;
    case "lineage":
      return context.lineageId === requirement.value;
    case "descriptor":
      return ids.has(requirement.value);
    case "not_descriptor":
      return !ids.has(requirement.value);
    default:
      return false;
  }
}

export function validateCharacterAppearanceCatalog(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const entry of CHARACTER_APPEARANCE_DESCRIPTORS) {
    if (seen.has(entry.id)) errors.push(`Duplicate appearance descriptor id: ${entry.id}`);
    seen.add(entry.id);
    for (const conflictId of entry.conflictsWith ?? []) {
      if (!BY_ID.has(conflictId)) errors.push(`${entry.id} references unknown conflict ${conflictId}.`);
    }
    for (const requirement of [...(entry.requiresAll ?? []), ...(entry.requiresAny ?? [])]) {
      if ((requirement.type === "descriptor" || requirement.type === "not_descriptor") && !BY_ID.has(requirement.value)) {
        errors.push(`${entry.id} references unknown requirement ${requirement.value}.`);
      }
    }
    if (entry.selectionLimitGroupId && selectionLimits[entry.selectionLimitGroupId] === undefined) {
      errors.push(`${entry.id} references unknown selection-limit group ${entry.selectionLimitGroupId}.`);
    }
  }
  return errors;
}

export function validateCharacterAppearanceSelection(
  ids: readonly string[],
  context: { sexId: CharacterAppearanceSexId; lineageId: string }
): CharacterAppearanceValidationResult {
  const errors: string[] = [];
  const unique = new Set(ids);
  if (unique.size !== ids.length) errors.push("Appearance descriptors cannot be selected more than once.");

  const selected = ids.flatMap((id) => {
    const entry = getCharacterAppearanceDescriptor(id);
    if (!entry) {
      errors.push(`Unknown appearance descriptor: ${id}`);
      return [];
    }
    return [entry];
  });

  const exclusive = new Map<string, CharacterAppearanceDescriptorDefinition[]>();
  const limited = new Map<string, CharacterAppearanceDescriptorDefinition[]>();
  const selectedIds = new Set(selected.map((entry) => entry.id));

  for (const entry of selected) {
    if (entry.exclusiveGroupId) {
      exclusive.set(entry.exclusiveGroupId, [...(exclusive.get(entry.exclusiveGroupId) ?? []), entry]);
    }
    if (entry.selectionLimitGroupId) {
      limited.set(entry.selectionLimitGroupId, [...(limited.get(entry.selectionLimitGroupId) ?? []), entry]);
    }
    if (entry.allowedSexIds && !entry.allowedSexIds.includes(context.sexId)) {
      errors.push(`${entry.label} is not available for the selected sex.`);
    }
    if (entry.allowedLineageIds && !entry.allowedLineageIds.includes(context.lineageId)) {
      errors.push(`${entry.label} is not available for the selected lineage.`);
    }
    if (entry.blockedLineageIds?.includes(context.lineageId)) {
      errors.push(`${entry.label} is blocked for the selected lineage.`);
    }
    for (const conflictId of entry.conflictsWith ?? []) {
      if (selectedIds.has(conflictId)) {
        errors.push(`${entry.label} conflicts with ${getCharacterAppearanceDescriptor(conflictId)?.label ?? conflictId}.`);
      }
    }
    if ((entry.requiresAll ?? []).some((requirement) => !requirementSatisfied(requirement, selected, context))) {
      errors.push(`${entry.label} has an unmet appearance requirement.`);
    }
    if ((entry.requiresAny?.length ?? 0) > 0 && !entry.requiresAny!.some((requirement) => requirementSatisfied(requirement, selected, context))) {
      errors.push(`${entry.label} requires another compatible appearance choice.`);
    }
  }

  for (const [groupId, entries] of exclusive) {
    if (entries.length > 1) errors.push(`Choose at most one appearance descriptor from ${groupId}.`);
  }
  for (const [groupId, entries] of limited) {
    const limit = selectionLimits[groupId]!;
    if (entries.length > limit) errors.push(`Choose at most ${limit} appearance descriptors from ${groupId}.`);
  }

  const hairLength = selected.filter((entry) => entry.category === "hair.length");
  if (hairLength.length !== 1) errors.push("Choose exactly one hair length.");
  const texture = selected.filter((entry) => entry.category === "hair.texture");
  if (texture.length > 1) errors.push("Choose at most one hair texture.");
  const shaved = hairLength[0]?.hairLengthRank === 0;
  const styles = selected.filter((entry) => entry.category === "hair.primary_style");
  if (shaved && styles.length > 0) errors.push("Shaved hair cannot use a primary hairstyle.");

  return { isValid: errors.length === 0, errors };
}

function pickIndex(length: number, rng: () => number): number {
  if (length <= 1) return 0;
  return Math.min(length - 1, Math.floor(Math.max(0, Math.min(0.999999999, rng())) * length));
}

function pickOne<T>(values: readonly T[], rng: () => number): T | null {
  return values[pickIndex(values.length, rng)] ?? null;
}

function maybe(probability: number, rng: () => number): boolean {
  return rng() < probability;
}

export function generateRandomCharacterAppearanceDescriptorIds(
  context: { sexId: CharacterAppearanceSexId; lineageId: string },
  rng: () => number = Math.random
): CharacterAppearanceDescriptorId[] {
  const selected: CharacterAppearanceDescriptorId[] = [];
  const faceShape = pickOne(getCharacterAppearanceDescriptorsByCategory("face.shape"), rng);
  if (faceShape) selected.push(faceShape.id);

  const hairLength = pickOne(getCharacterAppearanceDescriptorsByCategory("hair.length"), rng);
  if (!hairLength) throw new Error("Appearance catalog has no hair-length options.");
  selected.push(hairLength.id);

  if ((hairLength.hairLengthRank ?? 0) > 0) {
    const texture = pickOne(getCharacterAppearanceDescriptorsByCategory("hair.texture"), rng);
    const density = pickOne(getCharacterAppearanceDescriptorsByCategory("hair.density"), rng);
    if (texture) selected.push(texture.id);
    if (density) selected.push(density.id);

    const styles = getCharacterAppearanceDescriptorsByCategory("hair.primary_style").filter((entry) =>
      validateCharacterAppearanceSelection([...selected, entry.id], context).errors.every((error) => !error.includes(entry.label))
    );
    const style = pickOne(styles, rng);
    if (style) selected.push(style.id);
  }

  if (context.sexId === "male") {
    const facialHair = pickOne(getCharacterAppearanceDescriptorsByCategory("facial_hair.primary_style"), rng);
    if (facialHair) selected.push(facialHair.id);
  }

  if (maybe(0.45, rng)) {
    const complexion = pickOne(getCharacterAppearanceDescriptorsByCategory("complexion.detail"), rng);
    if (complexion) selected.push(complexion.id);
  }
  if (maybe(0.22, rng)) {
    const scar = pickOne(getCharacterAppearanceDescriptorsByCategory("marking.facial_scar"), rng);
    if (scar) selected.push(scar.id);
  }
  if (maybe(0.12, rng)) {
    const piercing = pickOne(getCharacterAppearanceDescriptorsByCategory("adornment.piercing"), rng);
    if (piercing) selected.push(piercing.id);
  }

  const validation = validateCharacterAppearanceSelection(selected, context);
  if (!validation.isValid) {
    throw new Error(`Appearance randomization produced an invalid selection: ${validation.errors.join(" | ")}`);
  }
  return selected;
}
