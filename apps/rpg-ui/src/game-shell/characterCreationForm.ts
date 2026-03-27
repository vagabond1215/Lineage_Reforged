import type { PlayerSexId } from '../../../../packages/shared/types/src/index.js';
import type { ManualSaveSlotId } from './state.js';
import {
  getBackstoryStartAccessProfileId,
  getLineageIdentityCatalog,
  isCompatibleBackstorySelection,
  isKnownLineageId,
  isKnownPathId
} from './characterCreationCatalog.js';
import {
  getWorldContinentOptions,
  getWorldRegionOptions,
  resolveWorldSelection
} from './worldSelectionCatalog.js';

export type CharacterCreationSexId = '' | Extract<PlayerSexId, 'male' | 'female'>;

export type CharacterCreationStepId =
  | 'lineage'
  | 'identity'
  | 'backstory'
  | 'path'
  | 'continent'
  | 'region'
  | 'settlement'
  | 'review';

export type CharacterCreationField =
  | 'playerName'
  | 'sexId'
  | 'lineageId'
  | 'heightCm'
  | 'buildId'
  | 'hairColorId'
  | 'hairHighlightColorId'
  | 'eyeColorId'
  | 'skinToneId'
  | 'classId'
  | 'backgroundId'
  | 'continentId'
  | 'regionId'
  | 'startingSettlementId'
  | 'saveSlotId';

export interface CharacterCreationFormState {
  playerName: string;
  sexId: CharacterCreationSexId;
  lineageId: string;
  heightCm: number | null;
  buildId: string;
  hairColorId: string;
  hairHighlightColorId: string;
  eyeColorId: string;
  skinToneId: string;
  classId: string;
  backgroundId: string;
  continentId: string;
  regionId: string;
  startingSettlementId: string;
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

export interface CompleteCharacterCreationFormState extends CharacterCreationFormState {
  sexId: Extract<PlayerSexId, 'male' | 'female'>;
  heightCm: number;
}

export const CHARACTER_CREATION_STEPS: CharacterCreationStepDefinition[] = [
  {
    id: 'lineage',
    label: 'Lineage',
    description: 'Choose the playable lineage that anchors ancestry, growth, and the identity palettes available in the next step.',
    fields: ['lineageId']
  },
  {
    id: 'identity',
    label: 'Identity',
    description: 'Choose visible presentation only: name, sex, height, build, and lineage-valid coloration.',
    fields: ['playerName', 'sexId', 'heightCm', 'buildId', 'hairColorId', 'hairHighlightColorId', 'eyeColorId', 'skinToneId']
  },
  {
    id: 'backstory',
    label: 'Backstory',
    description: 'Choose the character\'s past. Backstories seed job identity, traits, skills, and starting kit by lineage.',
    fields: ['backgroundId']
  },
  {
    id: 'path',
    label: 'Path',
    description: 'Choose the character\'s future direction and starting specialization.',
    fields: ['classId']
  },
  {
    id: 'continent',
    label: 'Continent',
    description: 'Choose the starting landmass and its broad climate, resource, and trade character.',
    fields: ['continentId']
  },
  {
    id: 'region',
    label: 'Region',
    description: 'Choose the regional terrain pocket, economy, and survivability band inside that continent.',
    fields: ['regionId']
  },
  {
    id: 'settlement',
    label: 'Settlement',
    description: 'Choose the exact settlement where the campaign opens and validate whether you can legally start there.',
    fields: ['startingSettlementId']
  },
  {
    id: 'review',
    label: 'Finalize',
    description: 'Review the generated starter state, choose a save slot, and begin the campaign.',
    fields: [
      'saveSlotId',
      'playerName',
      'sexId',
      'lineageId',
      'heightCm',
      'buildId',
      'hairColorId',
      'hairHighlightColorId',
      'eyeColorId',
      'skinToneId',
      'classId',
      'backgroundId',
      'continentId',
      'regionId',
      'startingSettlementId'
    ]
  }
];

const CHARACTER_CREATION_STEP_SEQUENCE = CHARACTER_CREATION_STEPS.map((step) => step.id);

export function createDefaultCharacterCreationFormState(
  saveSlotId: ManualSaveSlotId
): CharacterCreationFormState {
  return {
    playerName: '',
    sexId: '',
    lineageId: '',
    heightCm: null,
    buildId: '',
    hairColorId: '',
    hairHighlightColorId: '',
    eyeColorId: '',
    skinToneId: '',
    classId: '',
    backgroundId: '',
    continentId: '',
    regionId: '',
    startingSettlementId: '',
    saveSlotId
  };
}

export function hasCompleteCharacterCreationSelections(
  form: CharacterCreationFormState
): form is CompleteCharacterCreationFormState {
  return Boolean(
    form.sexId &&
      form.lineageId.trim() &&
      form.heightCm !== null &&
      form.buildId.trim() &&
      form.hairColorId.trim() &&
      form.eyeColorId.trim() &&
      form.skinToneId.trim() &&
      form.backgroundId.trim() &&
      form.classId.trim() &&
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
  form: CharacterCreationFormState
): CharacterCreationValidationResult {
  const errors: Partial<Record<CharacterCreationField, string>> = {};

  if (form.playerName.trim().length === 0) {
    errors.playerName = 'Enter a character name before continuing.';
  }

  if (form.sexId !== 'male' && form.sexId !== 'female') {
    errors.sexId = 'Choose a valid sex profile.';
  }

  if (!isKnownLineageId(form.lineageId)) {
    errors.lineageId = 'Choose a valid lineage.';
  }

  const identityCatalog = getLineageIdentityCatalog(form.lineageId);

  if (!identityCatalog) {
    errors.heightCm = 'Choose a lineage before setting identity details.';
    errors.buildId = 'Choose a lineage before setting identity details.';
    errors.hairColorId = 'Choose a lineage before setting identity details.';
    errors.eyeColorId = 'Choose a lineage before setting identity details.';
    errors.skinToneId = 'Choose a lineage before setting identity details.';
  } else {
    if (form.heightCm === null) {
      errors.heightCm = 'Choose a height option.';
    } else if (form.heightCm < identityCatalog.heightRangeCm[0] || form.heightCm > identityCatalog.heightRangeCm[1]) {
      errors.heightCm = 'Choose a height inside the selected lineage range.';
    }

    if (!identityCatalog.buildOptions.some((option) => option.id === form.buildId)) {
      errors.buildId = 'Choose a valid build.';
    }

    if (!identityCatalog.hairColorOptions.some((option) => option.id === form.hairColorId)) {
      errors.hairColorId = 'Choose a valid hair color.';
    }

    if (
      form.hairHighlightColorId &&
      !identityCatalog.hairHighlightOptions.some((option) => option.id === form.hairHighlightColorId)
    ) {
      errors.hairHighlightColorId = 'Choose a valid highlight color or leave it empty.';
    }

    if (!identityCatalog.eyeColorOptions.some((option) => option.id === form.eyeColorId)) {
      errors.eyeColorId = 'Choose a valid eye color.';
    }

    if (!identityCatalog.skinToneOptions.some((option) => option.id === form.skinToneId)) {
      errors.skinToneId = 'Choose a valid skin tone.';
    }
  }

  if (!isCompatibleBackstorySelection(form.lineageId, form.backgroundId)) {
    errors.backgroundId = 'Choose a valid backstory for the selected lineage.';
  }

  if (!isKnownPathId(form.classId)) {
    errors.classId = 'Choose a valid path.';
  }

  if (!getWorldContinentOptions().some((continent) => continent.id === form.continentId)) {
    errors.continentId = 'Choose a valid continent.';
  }

  if (!getWorldRegionOptions(form.continentId).some((region) => region.id === form.regionId)) {
    errors.regionId = 'Choose a valid region for the selected continent.';
  }

  const resolvedSelection = resolveWorldSelection({
    continentId: form.continentId,
    regionId: form.regionId,
    settlementId: form.startingSettlementId,
    classId: form.classId,
    backgroundId: getBackstoryStartAccessProfileId(form.backgroundId)
  });

  if (!resolvedSelection) {
    errors.startingSettlementId = 'Choose a valid starting settlement.';
  } else if (resolvedSelection.settlement.access.accessStatus !== 'allowed') {
    errors.startingSettlementId = resolvedSelection.settlement.access.notes[0] ?? 'This start is restricted.';
  }

  if (!form.saveSlotId) {
    errors.saveSlotId = 'Choose a save slot.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateCharacterCreationStep(
  form: CharacterCreationFormState,
  stepId: CharacterCreationStepId
): CharacterCreationValidationResult {
  const fullValidation = validateCharacterCreationForm(form);
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
