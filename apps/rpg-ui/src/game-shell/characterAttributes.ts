import type {
  PlayerAttributeKey,
  PlayerAttributes
} from '../../../../packages/shared/types/src/index.js';

export type CharacterCreationAttributeAllocation = Record<PlayerAttributeKey, number>;

export type CharacterAttributePresentation = {
  key: PlayerAttributeKey;
  label: string;
  shortEffect: string;
  gameplayEffect: string;
};

export const CHARACTER_ATTRIBUTE_ORDER: PlayerAttributeKey[] = [
  'STR',
  'DEX',
  'AGI',
  'CON',
  'VIT',
  'WIS',
  'INT',
  'SPT',
  'CHA'
];

export const CHARACTER_ATTRIBUTE_PRESENTATIONS: Record<
  PlayerAttributeKey,
  CharacterAttributePresentation
> = {
  STR: {
    key: 'STR',
    label: 'Strength',
    shortEffect: 'Physical power, carrying, and impact.',
    gameplayEffect:
      'Improves hard labor, heavy hits, hauling, and other force-driven checks.'
  },
  DEX: {
    key: 'DEX',
    label: 'Dexterity',
    shortEffect: 'Precision, tool handling, and ranged control.',
    gameplayEffect:
      'Supports accurate strikes, fine craft work, delicate interactions, and steady aim.'
  },
  AGI: {
    key: 'AGI',
    label: 'Agility',
    shortEffect: 'Movement speed, balance, and evasion.',
    gameplayEffect:
      'Helps traversal, balance, dodge-heavy play, and contributes to stamina recovery.'
  },
  CON: {
    key: 'CON',
    label: 'Constitution',
    shortEffect: 'Resistance to strain and injury.',
    gameplayEffect:
      'Feeds HP and stamina recovery while improving survival under punishment and fatigue.'
  },
  VIT: {
    key: 'VIT',
    label: 'Vitality',
    shortEffect: 'Endurance, recovery, and hardiness.',
    gameplayEffect:
      'Strengthens long-haul resilience and also feeds HP and stamina recovery.'
  },
  WIS: {
    key: 'WIS',
    label: 'Wisdom',
    shortEffect: 'Judgment, medicine, and perception.',
    gameplayEffect:
      'Supports observation, treatment, disciplined choices, and practical field awareness.'
  },
  INT: {
    key: 'INT',
    label: 'Intelligence',
    shortEffect: 'Planning, analysis, and technical learning.',
    gameplayEffect:
      'Improves scholarship, crafting logic, technical problem solving, and MP recovery.'
  },
  SPT: {
    key: 'SPT',
    label: 'Spirit',
    shortEffect: 'Will, attunement, and magical stability.',
    gameplayEffect:
      'Supports spell control, attunement, mental steadiness, and MP recovery.'
  },
  CHA: {
    key: 'CHA',
    label: 'Charisma',
    shortEffect: 'Influence, command, and negotiation.',
    gameplayEffect:
      'Improves bargaining, leadership, persuasion, and other social leverage checks.'
  }
};

export function createEmptyCharacterAttributeAllocation(): CharacterCreationAttributeAllocation {
  return {
    STR: 0,
    DEX: 0,
    AGI: 0,
    CON: 0,
    VIT: 0,
    WIS: 0,
    INT: 0,
    SPT: 0,
    CHA: 0
  };
}

export function getAllocatedCharacterAttributePoints(
  allocation: CharacterCreationAttributeAllocation
): number {
  return CHARACTER_ATTRIBUTE_ORDER.reduce(
    (total, attributeKey) => total + (allocation[attributeKey] ?? 0),
    0
  );
}

export function applyCharacterAttributeAllocation(
  baseAttributes: PlayerAttributes,
  allocation: CharacterCreationAttributeAllocation
): PlayerAttributes {
  return {
    STR: baseAttributes.STR + (allocation.STR ?? 0),
    DEX: baseAttributes.DEX + (allocation.DEX ?? 0),
    AGI: baseAttributes.AGI + (allocation.AGI ?? 0),
    CON: baseAttributes.CON + (allocation.CON ?? 0),
    VIT: baseAttributes.VIT + (allocation.VIT ?? 0),
    WIS: baseAttributes.WIS + (allocation.WIS ?? 0),
    INT: baseAttributes.INT + (allocation.INT ?? 0),
    SPT: baseAttributes.SPT + (allocation.SPT ?? 0),
    CHA: baseAttributes.CHA + (allocation.CHA ?? 0)
  };
}

export function parsePresentedAttributeValues(
  value: string
): Array<{ key: PlayerAttributeKey; value: number }> {
  const matches = Array.from(value.matchAll(/([A-Z]{3})\s+(\d+)/g));
  const parsed = matches.flatMap((match) => {
    const key = match[1] as PlayerAttributeKey | undefined;
    const numericValue = Number.parseInt(match[2] ?? '', 10);

    if (!key || !CHARACTER_ATTRIBUTE_ORDER.includes(key) || Number.isNaN(numericValue)) {
      return [];
    }

    return [{ key, value: numericValue }];
  });

  return CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const entry = parsed.find((item) => item.key === attributeKey);
    return entry ? [entry] : [];
  });
}
