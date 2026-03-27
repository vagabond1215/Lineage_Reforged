import type { PlayerSexId } from '../../../../packages/shared/types/src/index.js';
import type { ManualSaveSlotId } from './state.js';
import {
  STARTER_BACKGROUND_TEMPLATES,
  STARTER_CLASS_TEMPLATES,
  isKnownLineageId
} from './starterTemplates.js';
import {
  getDefaultWorldSelection,
  getWorldContinentOptions,
  getWorldRegionOptions,
  resolveWorldSelection
} from './worldSelectionCatalog.js';

export type CharacterCreationStepId =
  | 'identity'
  | 'lineage'
  | 'class'
  | 'background'
  | 'continent'
  | 'region'
  | 'settlement'
  | 'review';

export type CharacterCreationField =
  | 'playerName'
  | 'sexId'
  | 'lineageId'
  | 'classId'
  | 'backgroundId'
  | 'continentId'
  | 'regionId'
  | 'startingSettlementId'
  | 'saveSlotId';

export interface CharacterCreationFormState {
  playerName: string;
  sexId: PlayerSexId;
  lineageId: string;
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

export const CHARACTER_CREATION_STEPS: CharacterCreationStepDefinition[] = [
  {
    id: 'identity',
    label: 'Identity',
    description: 'Set the visible name and sex profile for the character.',
    fields: ['playerName', 'sexId']
  },
  {
    id: 'lineage',
    label: 'Lineage',
    description: 'Choose the lineage profile that drives innate growth and attribute variance.',
    fields: ['lineageId']
  },
  {
    id: 'class',
    label: 'Starting Path',
    description: 'Choose the initial class discipline and starter kit focus.',
    fields: ['classId']
  },
  {
    id: 'background',
    label: 'Background',
    description: 'Choose the upbringing or trade origin that seeds job identity, traits, and early skills.',
    fields: ['backgroundId']
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
  const classId = 'class.explorer';
  const backgroundId =
    STARTER_BACKGROUND_TEMPLATES['background.harbor_runner']?.id ??
    Object.keys(STARTER_BACKGROUND_TEMPLATES)[0] ??
    'background.harbor_runner';
  const worldSelection = getDefaultWorldSelection(classId, backgroundId);

  return {
    playerName: '',
    sexId: 'neutral',
    lineageId: 'lineage.human',
    classId,
    backgroundId,
    continentId: worldSelection.continentId,
    regionId: worldSelection.regionId,
    startingSettlementId: worldSelection.settlementId,
    saveSlotId
  };
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

  if (!['male', 'female', 'neutral'].includes(form.sexId)) {
    errors.sexId = 'Choose a valid sex profile.';
  }

  if (!isKnownLineageId(form.lineageId)) {
    errors.lineageId = 'Choose a valid lineage.';
  }

  if (!(form.classId in STARTER_CLASS_TEMPLATES)) {
    errors.classId = 'Choose a valid starting path.';
  }

  if (!(form.backgroundId in STARTER_BACKGROUND_TEMPLATES)) {
    errors.backgroundId = 'Choose a valid background.';
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
    backgroundId: form.backgroundId
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
