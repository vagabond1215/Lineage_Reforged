import type {
  AccountProfileState,
  PlayerIdentityAgeBandId,
  PlayerIdentityFocusId,
  PlayerIdentityNatureId,
  PlayerIdentityPhysiqueId,
  PlayerSexId
} from "../../../../packages/shared/types/src/index.js";
import type { ManualSaveSlotId } from "./state.js";
import {
  hasValidStartingBundleChoiceSelections,
  type HeightBandId,
  getLineageIdentityCatalog,
  isKnownBackstoryId,
  isKnownLineageId,
  isKnownStartingBundleId,
  isSelectableBackstoryId,
  resolveCanonicalAgeBandId,
  resolveCanonicalFocusId,
  resolveCanonicalNatureId,
  resolveCanonicalPhysiqueId,
  validateStartingBundleChoiceSelections,
  type StartingBundleChoiceSelections
} from "./characterCreationCatalog.js";
import { resolveCharacterCreationAttributes } from "./characterCreationMath.js";
import {
  getWorldContinentOptions,
  getWorldRegionOptions,
  getWorldSettlementOptions,
  resolveWorldSelection
} from "./worldSelectionCatalog.js";

export type CharacterCreationSexId = "" | Extract<PlayerSexId, "male" | "female">;
export type CharacterCreationAgeBandId = "" | PlayerIdentityAgeBandId;
export type CharacterCreationHeightBandId = "" | HeightBandId;
export type CharacterCreationPhysiqueId = "" | PlayerIdentityPhysiqueId;
export type CharacterCreationNatureId = "" | PlayerIdentityNatureId;
export type CharacterCreationFocusId = "" | PlayerIdentityFocusId;

export type CharacterCreationStepId =
  | "lineage"
  | "identity"
  | "continent"
  | "region"
  | "settlement"
  | "backstory"
  | "starting_bundle"
  | "review";

export type CharacterCreationField =
  | "playerName"
  | "sexId"
  | "lineageId"
  | "ageBandId"
  | "heightBandId"
  | "physiqueId"
  | "natureId"
  | "focusId"
  | "hairColorId"
  | "eyeColorId"
  | "skinToneId"
  | "startingBundleId"
  | "backstoryId"
  | "continentId"
  | "regionId"
  | "startingSettlementId"
  | "sourceRunId"
  | "saveSlotId";

export interface CharacterCreationFormState {
  playerName: string;
  sexId: CharacterCreationSexId;
  lineageId: string;
  ageBandId: CharacterCreationAgeBandId;
  heightBandId: CharacterCreationHeightBandId;
  physiqueId: CharacterCreationPhysiqueId;
  natureId: CharacterCreationNatureId;
  focusId: CharacterCreationFocusId;
  hairColorId: string;
  eyeColorId: string;
  skinToneId: string;
  startingBundleId: string;
  startingBundleChoiceSelections: StartingBundleChoiceSelections;
  backstoryId: string;
  continentId: string;
  regionId: string;
  startingSettlementId: string;
  sourceRunId: string;
  saveSlotId: ManualSaveSlotId;
}

export interface CharacterCreationStepDefinition {
  id: CharacterCreationStepId;
  label: string;
  description: string;
  fields: CharacterCreationField[];
}

export interface CharacterCreationValidationResult {
  isValid: boolean;
  errors: Partial<Record<CharacterCreationField, string>>;
}

export interface CharacterCreationValidationOptions {
  accountProfile?: AccountProfileState | null;
}

export interface CompleteCharacterCreationFormState extends CharacterCreationFormState {
  sexId: Extract<PlayerSexId, "male" | "female">;
  ageBandId: PlayerIdentityAgeBandId;
  heightBandId: HeightBandId;
  physiqueId: PlayerIdentityPhysiqueId;
  natureId: PlayerIdentityNatureId;
  focusId: PlayerIdentityFocusId;
}

export const CHARACTER_CREATION_STEPS: CharacterCreationStepDefinition[] = [
  {
    id: "lineage",
    label: "Lineage",
    description:
      "Choose the playable lineage that anchors ancestry, growth, and the identity palettes available in the next step.",
    fields: ["lineageId"]
  },
  {
    id: "identity",
    label: "Identity",
    description:
      "Choose name, sex, age, stature, physique, nature, focus, and lineage-valid coloration from the shared identity profile system.",
    fields: [
      "playerName",
      "sexId",
      "ageBandId",
      "heightBandId",
      "physiqueId",
      "natureId",
      "focusId",
      "hairColorId",
      "eyeColorId",
      "skinToneId"
    ]
  },
  {
    id: "continent",
    label: "Continent",
    description:
      "Choose the starting landmass and its broad climate, resource, and trade character.",
    fields: ["continentId"]
  },
  {
    id: "region",
    label: "Region",
    description:
      "Choose the regional terrain pocket, economy, and survivability band inside that continent.",
    fields: ["regionId"]
  },
  {
    id: "settlement",
    label: "Settlement",
    description:
      "Choose the exact settlement where the campaign opens and validate whether you can legally start there.",
    fields: ["startingSettlementId"]
  },
  {
    id: "backstory",
    label: "Backstory",
    description:
      "Choose the character's past. Backstories seed narrative identity, starting skills, geographic knowledge, and rare thematic abilities.",
    fields: ["backstoryId"]
  },
  {
    id: "starting_bundle",
    label: "Starting Bundle",
    description:
      "Choose the starter kit that determines opening gear, tools, consumables, and coin only.",
    fields: ["startingBundleId"]
  },
  {
    id: "review",
    label: "Finalize",
    description: "Review the generated starter state and begin the campaign.",
    fields: [
      "playerName",
      "sexId",
      "lineageId",
      "ageBandId",
      "heightBandId",
      "physiqueId",
      "natureId",
      "focusId",
      "hairColorId",
      "eyeColorId",
      "skinToneId",
      "startingBundleId",
      "backstoryId",
      "continentId",
      "regionId",
      "startingSettlementId"
    ]
  }
];

const CHARACTER_CREATION_STEP_SEQUENCE = CHARACTER_CREATION_STEPS.map((step) => step.id);

export function createDefaultCharacterCreationFormState(
  saveSlotId: ManualSaveSlotId
): CharacterCreationFormState {
  return {
    playerName: "",
    sexId: "male",
    lineageId: "lineage.human",
    ageBandId: "prime",
    heightBandId: "normal",
    physiqueId: "stocky",
    natureId: "disciplined",
    focusId: "balanced",
    hairColorId: "",
    eyeColorId: "",
    skinToneId: "",
    startingBundleId: "",
    startingBundleChoiceSelections: {},
    backstoryId: "",
    continentId: "",
    regionId: "",
    startingSettlementId: "",
    sourceRunId: "",
    saveSlotId
  };
}

export function hasCompleteCharacterCreationSelections(
  form: CharacterCreationFormState
): form is CompleteCharacterCreationFormState {
  return Boolean(
    form.sexId &&
      form.lineageId.trim() &&
      resolveCanonicalAgeBandId(form.ageBandId) &&
      form.heightBandId &&
      resolveCanonicalPhysiqueId(form.physiqueId) &&
      resolveCanonicalNatureId(form.natureId) &&
      resolveCanonicalFocusId(form.focusId) &&
      form.hairColorId.trim() &&
      form.eyeColorId.trim() &&
      form.skinToneId.trim() &&
      form.backstoryId.trim() &&
      form.startingBundleId.trim() &&
      hasValidStartingBundleChoiceSelections(
        form.startingBundleId,
        form.startingBundleChoiceSelections
      ) &&
      form.continentId.trim() &&
      form.regionId.trim() &&
      form.startingSettlementId.trim()
  );
}

export function getCharacterCreationStepIndex(stepId: CharacterCreationStepId): number {
  return CHARACTER_CREATION_STEP_SEQUENCE.indexOf(stepId);
}

export function getNextCharacterCreationStepId(
  stepId: CharacterCreationStepId
): CharacterCreationStepId | null {
  const currentIndex = getCharacterCreationStepIndex(stepId);

  if (currentIndex < 0 || currentIndex >= CHARACTER_CREATION_STEP_SEQUENCE.length - 1) {
    return null;
  }

  return CHARACTER_CREATION_STEP_SEQUENCE[currentIndex + 1] ?? null;
}

export function getPreviousCharacterCreationStepId(
  stepId: CharacterCreationStepId
): CharacterCreationStepId | null {
  const currentIndex = getCharacterCreationStepIndex(stepId);

  if (currentIndex <= 0) {
    return null;
  }

  return CHARACTER_CREATION_STEP_SEQUENCE[currentIndex - 1] ?? null;
}

export function validateCharacterCreationForm(
  form: CharacterCreationFormState,
  options: CharacterCreationValidationOptions = {}
): CharacterCreationValidationResult {
  const errors: Partial<Record<CharacterCreationField, string>> = {};

  if (form.playerName.trim().length === 0) {
    errors.playerName = "Enter a character name before continuing.";
  }

  if (form.sexId !== "male" && form.sexId !== "female") {
    errors.sexId = "Choose a valid sex profile.";
  }

  if (!isKnownLineageId(form.lineageId)) {
    errors.lineageId = "Choose a valid lineage.";
  }

  const identityCatalog = getLineageIdentityCatalog(form.lineageId);
  const normalizedAgeBandId = resolveCanonicalAgeBandId(form.ageBandId);
  const normalizedPhysiqueId = resolveCanonicalPhysiqueId(form.physiqueId);
  const normalizedNatureId = resolveCanonicalNatureId(form.natureId);
  const normalizedFocusId = resolveCanonicalFocusId(form.focusId);

  if (!identityCatalog) {
    errors.ageBandId = "Choose a lineage before setting identity details.";
    errors.heightBandId = "Choose a lineage before setting identity details.";
    errors.physiqueId = "Choose a lineage before setting identity details.";
    errors.natureId = "Choose a lineage before setting identity details.";
    errors.focusId = "Choose a lineage before setting identity details.";
    errors.hairColorId = "Choose a lineage before setting identity details.";
    errors.eyeColorId = "Choose a lineage before setting identity details.";
    errors.skinToneId = "Choose a lineage before setting identity details.";
  } else {
    if (!identityCatalog.ageBands.some((option) => option.id === normalizedAgeBandId)) {
      errors.ageBandId = "Choose a valid age profile.";
    }

    if (!identityCatalog.heightBands.some((option) => option.id === form.heightBandId)) {
      errors.heightBandId = "Choose a valid height profile.";
    }

    if (
      !identityCatalog.physiqueOptions.some(
        (option) => option.id === normalizedPhysiqueId
      )
    ) {
      errors.physiqueId = "Choose a valid physique profile.";
    }

    if (!identityCatalog.natureOptions.some((option) => option.id === normalizedNatureId)) {
      errors.natureId = "Choose a valid nature profile.";
    }

    if (!identityCatalog.focusOptions.some((option) => option.id === normalizedFocusId)) {
      errors.focusId = "Choose a valid focus profile.";
    }

    if (!identityCatalog.hairColorOptions.some((option) => option.id === form.hairColorId)) {
      errors.hairColorId = "Choose a valid hair color.";
    }

    if (!identityCatalog.eyeColorOptions.some((option) => option.id === form.eyeColorId)) {
      errors.eyeColorId = "Choose a valid eye color.";
    }

    if (!identityCatalog.skinToneOptions.some((option) => option.id === form.skinToneId)) {
      errors.skinToneId = "Choose a valid skin tone.";
    }
  }

  if (!isKnownBackstoryId(form.backstoryId)) {
    errors.backstoryId = "Choose a valid backstory.";
  } else if (
    !isSelectableBackstoryId(form.backstoryId, {
      ...(options.accountProfile ? { accountProfile: options.accountProfile } : {}),
      selectedBackstoryId: form.backstoryId,
      sourceRunIds: form.sourceRunId.trim().length > 0 ? [form.sourceRunId] : []
    })
  ) {
    errors.backstoryId = "Choose an available backstory.";
  }

  if (!isKnownStartingBundleId(form.startingBundleId)) {
    errors.startingBundleId = "Choose a valid starting bundle.";
  } else {
    const startingBundleChoiceError = validateStartingBundleChoiceSelections(
      form.startingBundleId,
      form.startingBundleChoiceSelections
    );

    if (startingBundleChoiceError) {
      errors.startingBundleId = startingBundleChoiceError;
    }
  }

  if (!getWorldContinentOptions().some((continent) => continent.id === form.continentId)) {
    errors.continentId = "Choose a valid continent.";
  }

  if (!getWorldRegionOptions(form.continentId).some((region) => region.id === form.regionId)) {
    errors.regionId = "Choose a valid region for the selected continent.";
  }

  const basicSettlementOptions = getWorldSettlementOptions({
    continentId: form.continentId,
    regionId: form.regionId,
    backstoryId: ""
  });
  const hasSettlementSelection = basicSettlementOptions.some(
    (settlement) => settlement.id === form.startingSettlementId
  );

  if (!hasSettlementSelection) {
    errors.startingSettlementId = "Choose a valid starting settlement.";
  } else if (isKnownBackstoryId(form.backstoryId)) {
    const resolvedSelection = resolveWorldSelection({
      continentId: form.continentId,
      regionId: form.regionId,
      settlementId: form.startingSettlementId,
      backstoryId: form.backstoryId
    });

    if (!resolvedSelection) {
      errors.startingSettlementId = "Choose a valid starting settlement.";
    } else if (resolvedSelection.settlement.access.accessStatus !== "allowed") {
      errors.startingSettlementId =
        resolvedSelection.settlement.access.notes[0] ?? "This start is restricted.";
    }
  }

  const attributeResolution = resolveCharacterCreationAttributes({
    lineageId: form.lineageId.trim() || "lineage.human",
    sexId: form.sexId,
    ageBandId: form.ageBandId,
    heightBandId: form.heightBandId,
    physiqueId: form.physiqueId,
    natureId: form.natureId,
    focusId: form.focusId,
    backstoryId: form.backstoryId
  });

  if (attributeResolution.errors.length > 0) {
    const [firstProfileError] = attributeResolution.errors;
    if (firstProfileError) {
      errors.focusId = firstProfileError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateCharacterCreationStep(
  form: CharacterCreationFormState,
  stepId: CharacterCreationStepId,
  options: CharacterCreationValidationOptions = {}
): CharacterCreationValidationResult {
  if (stepId === "settlement") {
    const errors: Partial<Record<CharacterCreationField, string>> = {};
    const settlementOptions = getWorldSettlementOptions({
      continentId: form.continentId,
      regionId: form.regionId,
      backstoryId: ""
    });

    if (!settlementOptions.some((settlement) => settlement.id === form.startingSettlementId)) {
      errors.startingSettlementId = "Choose a settlement before continuing.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  const fullValidation = validateCharacterCreationForm(form, options);
  const step = CHARACTER_CREATION_STEPS.find((item) => item.id === stepId);

  if (!step) {
    return fullValidation;
  }

  const errors = step.fields.reduce<Partial<Record<CharacterCreationField, string>>>(
    (result, field) => {
      const error = fullValidation.errors[field];

      if (error) {
        result[field] = error;
      }

      return result;
    },
    {}
  );

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
