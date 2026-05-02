import type {
  EquipmentState,
  InventoryStack,
  PlayerAttributeAdjustments,
  PlayerCurrencyState,
  PlayerInventoryState,
  PlayerResourceKey,
  PlayerResourceModifierState
} from '../../../../packages/shared/types/src/index.js';
import { getLegacyPreparationChoiceLabel } from '../../../../packages/engines/game-engine/src/legacy-unlocks.js';

export type LegacyPreparationApplicationStatus = 'applied' | 'inert' | 'skipped';

export type LegacyPreparationReviewEntry = {
  unlockId: string;
  title: string;
  status: LegacyPreparationApplicationStatus;
  statusLabel: string;
  detail: string;
  bonusLabels: string[];
};

export type LegacyPreparationApplicationResult = {
  appliedPreparationIds: string[];
  appliedPreparationChoices: Record<string, string>;
  attributeAdjustments: PlayerAttributeAdjustments;
  currency: PlayerCurrencyState;
  inventory: PlayerInventoryState;
  resourceModifiers: PlayerResourceModifierState[];
  fillResourceIds: PlayerResourceKey[];
  reviewEntries: LegacyPreparationReviewEntry[];
};

type LegacyPreparationApplicationParams = {
  preparationIds: string[];
  preparationChoices?: Record<string, string>;
  currency: PlayerCurrencyState;
  equipment: EquipmentState;
  inventory: PlayerInventoryState;
};

const PREPARATION_TITLES: Record<string, string> = {
  'legacy.unlock.preparation.storehouse_keys': 'Storehouse Keys',
  'legacy.unlock.preparation.merchant_purse': 'Merchant Purse',
  'legacy.unlock.preparation.camp_supplies': 'Camp Supplies',
  'legacy.unlock.preparation.martial_legacy': 'Martial Legacy',
  'legacy.unlock.preparation.learned_legacy': 'Learned Legacy',
  'legacy.unlock.preparation.noble_legacy': 'Noble Legacy',
  'legacy.unlock.preparation.vital_legacy': 'Vital Legacy',
  'legacy.unlock.preparation.awakened_spark': 'Awakened Spark',
  'legacy.unlock.preparation.letters_of_passage': 'Letters of Passage',
  'legacy.unlock.preparation.veteran_escort': 'Veteran Escort'
};

const TRAVELER_RATION: InventoryStack = {
  itemId: 'item.traveler_ration',
  itemKey: 'traveler_ration',
  quantity: 1
};

const BEDROLL_KIT: InventoryStack = {
  itemId: 'item.bedroll_kit',
  itemKey: 'bedroll_kit',
  quantity: 1
};

function normalizePreparationIds(preparationIds: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const preparationId of preparationIds) {
    if (typeof preparationId !== 'string') {
      continue;
    }

    const trimmed = preparationId.trim();
    if (!trimmed || seen.has(trimmed) || !(trimmed in PREPARATION_TITLES)) {
      continue;
    }

    seen.add(trimmed);
    normalized.push(trimmed);
  }

  return normalized;
}

function normalizePreparationChoices(
  preparationIds: string[],
  preparationChoices: Record<string, string> | undefined
): Record<string, string> {
  if (!preparationChoices || typeof preparationChoices !== 'object') {
    return {};
  }

  const normalized: Record<string, string> = {};

  for (const preparationId of preparationIds) {
    const rawChoice = preparationChoices[preparationId];

    if (typeof rawChoice !== 'string') {
      continue;
    }

    const choiceId = rawChoice.trim();

    if (!choiceId || !getLegacyPreparationChoiceLabel(preparationId, choiceId)) {
      continue;
    }

    normalized[preparationId] = choiceId;
  }

  return normalized;
}

function isAttributePreparationChoice(
  unlockId: string,
  choiceId: string
): choiceId is 'STR' | 'DEX' | 'AGI' | 'CON' | 'INT' | 'WIS' | 'SPT' {
  if (
    unlockId !== 'legacy.unlock.preparation.martial_legacy' &&
    unlockId !== 'legacy.unlock.preparation.learned_legacy'
  ) {
    return false;
  }

  return ['STR', 'DEX', 'AGI', 'CON', 'INT', 'WIS', 'SPT'].includes(choiceId);
}

function collectLoadoutItemKeys(
  equipment: EquipmentState,
  inventory: PlayerInventoryState
): Set<string> {
  const keys = new Set<string>();

  for (const item of Object.values(equipment)) {
    if (!item) {
      continue;
    }

    keys.add(item.itemId);
    keys.add(item.itemKey);
  }

  for (const bag of inventory.bags) {
    for (const stack of bag.stacks) {
      keys.add(stack.itemId);
      keys.add(stack.itemKey);
    }
  }

  for (const stack of inventory.overflow) {
    keys.add(stack.itemId);
    keys.add(stack.itemKey);
  }

  return keys;
}

function appendInventoryStack(
  inventory: PlayerInventoryState,
  stack: InventoryStack
): PlayerInventoryState {
  const fallbackBag: PlayerInventoryState['bags'][number] = {
    id: 'bag.traveler_satchel',
    label: 'Traveler Satchel',
    slotCapacity: 20,
    stacks: []
  };
  const bags =
    inventory.bags.length > 0
      ? inventory.bags
      : [fallbackBag];
  const firstBag = bags[0] ?? fallbackBag;
  const restBags = bags.slice(1);
  const mergedStacks = [...firstBag.stacks];
  const existingStackIndex = mergedStacks.findIndex(
    (entry) => entry.itemId === stack.itemId && entry.itemKey === stack.itemKey
  );

  if (existingStackIndex >= 0) {
    const existingStack = mergedStacks[existingStackIndex]!;
    mergedStacks[existingStackIndex] = {
      ...existingStack,
      quantity: existingStack.quantity + stack.quantity
    };
  } else {
    mergedStacks.push({ ...stack });
  }

  return {
    ...inventory,
    bags: [{ ...firstBag, stacks: mergedStacks }, ...restBags]
  };
}

function addReviewEntry(params: {
  reviewEntries: LegacyPreparationReviewEntry[];
  unlockId: string;
  status: LegacyPreparationApplicationStatus;
  detail: string;
  bonusLabels?: string[];
}): void {
  const statusLabel =
    params.status === 'applied'
      ? 'Applied'
      : params.status === 'skipped'
        ? 'Covered'
        : 'Pending';

  params.reviewEntries.push({
    unlockId: params.unlockId,
    title: PREPARATION_TITLES[params.unlockId] ?? 'Legacy Preparation',
    status: params.status,
    statusLabel,
    detail: params.detail,
    bonusLabels: params.bonusLabels ?? []
  });
}

export function applyLegacyPreparationBonuses(
  params: LegacyPreparationApplicationParams
): LegacyPreparationApplicationResult {
  const appliedPreparationIds = normalizePreparationIds(params.preparationIds);
  const appliedPreparationChoices = normalizePreparationChoices(
    appliedPreparationIds,
    params.preparationChoices
  );
  const attributeAdjustments: PlayerAttributeAdjustments = {};
  let currency: PlayerCurrencyState = { ...params.currency };
  let inventory: PlayerInventoryState = {
    ...params.inventory,
    bags: params.inventory.bags.map((bag) => ({
      ...bag,
      stacks: bag.stacks.map((stack) => ({ ...stack }))
    })),
    overflow: params.inventory.overflow.map((stack) => ({ ...stack }))
  };
  const loadoutItemKeys = collectLoadoutItemKeys(params.equipment, inventory);
  const resourceModifiers: PlayerResourceModifierState[] = [];
  const fillResourceIds: PlayerResourceKey[] = [];
  const reviewEntries: LegacyPreparationReviewEntry[] = [];

  const addDedupeAwareStack = (stack: InventoryStack): boolean => {
    if (loadoutItemKeys.has(stack.itemId) || loadoutItemKeys.has(stack.itemKey)) {
      return false;
    }

    inventory = appendInventoryStack(inventory, stack);
    loadoutItemKeys.add(stack.itemId);
    loadoutItemKeys.add(stack.itemKey);
    return true;
  };

  for (const unlockId of appliedPreparationIds) {
    const selectedChoiceId = appliedPreparationChoices[unlockId];

    if (unlockId === 'legacy.unlock.preparation.merchant_purse') {
      currency = { ...currency, silver: currency.silver + 2 };
      addReviewEntry({
        reviewEntries,
        unlockId,
        status: 'applied',
        detail: 'Adds 2 silver to starting funds.',
        bonusLabels: ['+2 silver']
      });
      continue;
    }

    if (unlockId === 'legacy.unlock.preparation.storehouse_keys') {
      const added = addDedupeAwareStack(TRAVELER_RATION);
      addReviewEntry({
        reviewEntries,
        unlockId,
        status: added ? 'applied' : 'skipped',
        detail: added
          ? 'Adds Traveler Ration x1 to the starting pack.'
          : 'Already covered by the starting loadout.',
        bonusLabels: added ? ['Traveler Ration x1'] : []
      });
      continue;
    }

    if (unlockId === 'legacy.unlock.preparation.camp_supplies') {
      const addedBedroll = addDedupeAwareStack(BEDROLL_KIT);
      const addedFallbackRation = addedBedroll
        ? false
        : addDedupeAwareStack(TRAVELER_RATION);
      addReviewEntry({
        reviewEntries,
        unlockId,
        status: addedBedroll || addedFallbackRation ? 'applied' : 'skipped',
        detail: addedBedroll
          ? 'Adds Bedroll Kit x1 to the starting pack.'
          : addedFallbackRation
            ? 'Adds Traveler Ration x1 to the starting pack.'
            : 'Already covered by the starting loadout.',
        bonusLabels: addedBedroll
          ? ['Bedroll Kit x1']
          : addedFallbackRation
            ? ['Traveler Ration x1']
            : []
      });
      continue;
    }

    if (unlockId === 'legacy.unlock.preparation.awakened_spark') {
      resourceModifiers.push({
        id: 'legacy.preparation.awakened_spark.mp',
        label: 'Awakened Spark',
        sourceType: 'system',
        sourceId: unlockId,
        maxFlat: { mp: 5 },
        maxPercent: {},
        tickDeltaFlat: {},
        notes: ['Legacy preparation applied at run start.']
      });
      fillResourceIds.push('mp');
      addReviewEntry({
        reviewEntries,
        unlockId,
        status: 'applied',
        detail: 'Adds 5 MP at run start.',
        bonusLabels: ['+5 MP']
      });
      continue;
    }

    if (
      unlockId === 'legacy.unlock.preparation.martial_legacy' ||
      unlockId === 'legacy.unlock.preparation.learned_legacy'
    ) {
      if (selectedChoiceId && isAttributePreparationChoice(unlockId, selectedChoiceId)) {
        attributeAdjustments[selectedChoiceId] =
          (attributeAdjustments[selectedChoiceId] ?? 0) + 1;
        addReviewEntry({
          reviewEntries,
          unlockId,
          status: 'applied',
          detail: `Adds 1 ${selectedChoiceId} at run start.`,
          bonusLabels: [`${selectedChoiceId} (+1 ${selectedChoiceId})`]
        });
      } else {
        addReviewEntry({
          reviewEntries,
          unlockId,
          status: 'inert',
          detail: 'Recorded for this run; no valid choice was selected.'
        });
      }
      continue;
    }

    if (unlockId === 'legacy.unlock.preparation.vital_legacy') {
      if (selectedChoiceId === 'hp' || selectedChoiceId === 'mp' || selectedChoiceId === 'stamina') {
        const choiceLabel = getLegacyPreparationChoiceLabel(unlockId, selectedChoiceId) ?? selectedChoiceId;
        resourceModifiers.push({
          id: `legacy.preparation.vital_legacy.${selectedChoiceId}`,
          label: 'Vital Legacy',
          sourceType: 'system',
          sourceId: unlockId,
          maxFlat: { [selectedChoiceId]: 5 },
          maxPercent: {},
          tickDeltaFlat: {},
          notes: ['Legacy preparation applied at run start.']
        });
        fillResourceIds.push(selectedChoiceId);
        addReviewEntry({
          reviewEntries,
          unlockId,
          status: 'applied',
          detail: `Adds 5 ${choiceLabel} at run start.`,
          bonusLabels: [`${choiceLabel} (+5 ${choiceLabel})`]
        });
      } else {
        addReviewEntry({
          reviewEntries,
          unlockId,
          status: 'inert',
          detail: 'Recorded for this run; no valid choice was selected.'
        });
      }
      continue;
    }

    addReviewEntry({
      reviewEntries,
      unlockId,
      status: 'inert',
      detail: 'Recorded for this run; no simple creation bonus is active yet.'
    });
  }

  return {
    appliedPreparationIds,
    appliedPreparationChoices,
    attributeAdjustments,
    currency,
    inventory,
    resourceModifiers,
    fillResourceIds,
    reviewEntries
  };
}
