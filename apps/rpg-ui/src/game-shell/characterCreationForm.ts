import type { PlayerSexId } from '../../../../packages/shared/types/src/index.js';
import type { ManualSaveSlotId } from './state.js';
import {
  STARTER_BACKGROUND_TEMPLATES,
  STARTER_CLASS_TEMPLATES,
  STARTER_SETTLEMENT_TEMPLATES,
  isKnownLineageId
} from './starterTemplates.js';

export type CharacterCreationStepId =
  | 'identity'
  | 'lineage'
  | 'class'
  | 'background'
  | 'homeland'
  | 'review';

export type CharacterCreationField =
  | 'playerName'
  | 'sexId'
  | 'lineageId'
  | 'classId'
  | 'backgroundId'
  | 'startingSettlementId'
  | 'saveSlotId';

export interface CharacterCreationFormState {
  playerName: string;
  sexId: PlayerSexId;
  lineageId: string;
  classId: string;
  backgroundId: string;
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
    id: 'homeland',
    label: 'Starting Ground',
    description: 'Choose the first settlement or district where the campaign opens.',
    fields: ['startingSettlementId']
  },
  {
    id: 'review',
    label: 'Finalize',
    description: 'Review the generated starter state, choose a save slot, and begin the campaign.',
    fields: ['saveSlotId', 'playerName', 'sexId', 'lineageId', 'classId', 'backgroundId', 'startingSettlementId']
  }
];

const CHARACTER_CREATION_STEP_SEQUENCE = CHARACTER_CREATION_STEPS.map((step) => step.id);

export function createDefaultCharacterCreationFormState(
  saveSlotId: ManualSaveSlotId
): CharacterCreationFormState {
  return {
    playerName: '',
    sexId: 'neutral',
    lineageId: 'lineage.human',
    classId: 'class.explorer',
    backgroundId: Object.keys(STARTER_BACKGROUND_TEMPLATES)[0] ?? 'background.harbor_runner',
    startingSettlementId:
      Object.keys(STARTER_SETTLEMENT_TEMPLATES)[0] ?? 'start.saltmere_harbor',
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

  if (!(form.startingSettlementId in STARTER_SETTLEMENT_TEMPLATES)) {
    errors.startingSettlementId = 'Choose a valid starting settlement.';
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
