import type {
  PlayerAttributeKey,
  PlayerAttributes
} from '../../../../packages/shared/types/src/index.js';

export type CharacterCreationAttributeAllocation = Record<PlayerAttributeKey, number>;

export type CharacterAttributeTooltipPresentation = {
  body: string;
  footer: string;
};

export type CharacterAttributePresentation = {
  key: PlayerAttributeKey;
  abbr: PlayerAttributeKey;
  fullName: string;
  compactMeaning: string;
  tooltip: CharacterAttributeTooltipPresentation;
};

export const CHARACTER_ATTRIBUTE_ORDER: PlayerAttributeKey[] = [
  'STR',
  'DEX',
  'AGI',
  'CON',
  'VIT',
  'INT',
  'WIS',
  'SPT',
  'CHA'
];

export const CHARACTER_ATTRIBUTE_PRESENTATIONS: Record<
  PlayerAttributeKey,
  CharacterAttributePresentation
> = {
  STR: {
    key: 'STR',
    abbr: 'STR',
    fullName: 'Strength',
    compactMeaning: 'Melee damage, stagger force, carry weight, heavy-weapon pressure',
    tooltip: {
      body: 'Strength is the force of muscle and frame: the power to drive a blow through guard, bear heavy burdens, and make your presence felt in raw physical contests.',
      footer: 'Major systems: melee damage, stagger force, carry weight, heavy-weapon pressure.'
    }
  },
  DEX: {
    key: 'DEX',
    abbr: 'DEX',
    fullName: 'Dexterity',
    compactMeaning: 'Ranged damage, hit rate, crit rate, finesse and tool precision',
    tooltip: {
      body: 'Dexterity is control in the hands and eye: the steadiness to place a shot, guide a fine blade, and work tools with exacting precision when errors matter.',
      footer: 'Major systems: ranged accuracy, finesse handling, crit rate, tool precision.'
    }
  },
  AGI: {
    key: 'AGI',
    abbr: 'AGI',
    fullName: 'Agility',
    compactMeaning: 'Attack speed, evasion, movement speed, balance, action tempo',
    tooltip: {
      body: 'Agility is quickness in motion: the balance, timing, and coordinated speed that let you evade danger, reposition cleanly, and act before slower bodies can answer.',
      footer: 'Major systems: attack speed, evasion, movement speed, balance, action tempo.'
    }
  },
  CON: {
    key: 'CON',
    abbr: 'CON',
    fullName: 'Constitution',
    compactMeaning: 'HP, guard strength, stamina stability, effect resistance, survivability',
    tooltip: {
      body: 'Constitution is bodily resilience: the toughness that lets you endure strain, resist harm, and keep functioning when lesser frames would falter under punishment or hardship.',
      footer: 'Major systems: HP, guard stability, effect resistance, survivability under strain.'
    }
  },
  VIT: {
    key: 'VIT',
    abbr: 'VIT',
    fullName: 'Vitality',
    compactMeaning: 'HP, stamina, regeneration, injury tolerance, long-fight endurance',
    tooltip: {
      body: 'Vitality is the living spark of endurance: the depth of recovery, staying power, and hardiness that carries you through drawn-out effort, injury, and exhaustion.',
      footer: 'Major systems: HP, stamina, regeneration, injury tolerance, long-fight endurance.'
    }
  },
  INT: {
    key: 'INT',
    abbr: 'INT',
    fullName: 'Intelligence',
    compactMeaning: 'Spell power, MP, elemental control, crafting logic, knowledge checks',
    tooltip: {
      body: 'Intelligence is disciplined understanding: the theory, calculation, and precise control needed to master complex workings, shape advanced spellcraft, and solve difficult problems correctly.',
      footer: 'Major systems: spell theory, advanced spell precision, crafting logic, knowledge checks, MP support.'
    }
  },
  WIS: {
    key: 'WIS',
    abbr: 'WIS',
    fullName: 'Wisdom',
    compactMeaning: 'Healing power, spell resistance, perception, medicine, control resistance',
    tooltip: {
      body: 'Wisdom is attuned judgment: the insight to read people and situations, the calm to guide healing hands, and the sensitivity to feel the right flow of life and magic.',
      footer: 'Major systems: healing power, perception, medicine, insight, attunement and spell resistance.'
    }
  },
  SPT: {
    key: 'SPT',
    abbr: 'SPT',
    fullName: 'Spirit',
    compactMeaning: 'Spell power, mana recovery, spell resistance, resonance, willpower',
    tooltip: {
      body: 'Spirit is inner power made steady: the reserve of will and mana that sustains magic over time, anchors the self, and keeps supernatural effort from collapsing under pressure.',
      footer: 'Major systems: mana reserve, mana recovery, sustained magic, resonance, willpower, spell stability.'
    }
  },
  CHA: {
    key: 'CHA',
    abbr: 'CHA',
    fullName: 'Charisma',
    compactMeaning: 'Command strength, party support, negotiation, prices, social leverage',
    tooltip: {
      body: 'Charisma is force of presence: the ability to sway hearts, command attention, and shape outcomes through bearing, speech, and the confidence others cannot easily ignore.',
      footer: 'Major systems: negotiation, command strength, party support, prices, social leverage.'
    }
  }
};

export function isCharacterAttributeKey(value: string): value is PlayerAttributeKey {
  return CHARACTER_ATTRIBUTE_ORDER.includes(value as PlayerAttributeKey);
}

export function getCharacterAttributePresentation(
  attributeKey: PlayerAttributeKey
): CharacterAttributePresentation {
  return CHARACTER_ATTRIBUTE_PRESENTATIONS[attributeKey];
}

export function getCharacterAttributeLabel(
  attributeKey: PlayerAttributeKey,
  mode: 'compact' | 'full' = 'compact'
): string {
  const presentation = getCharacterAttributePresentation(attributeKey);
  return mode === 'compact' ? presentation.abbr : presentation.fullName;
}

export function getCharacterAttributeTooltipContent(attributeKey: PlayerAttributeKey): {
  title: string;
  body: string;
  footer: string;
} {
  const presentation = getCharacterAttributePresentation(attributeKey);

  return {
    title: `${presentation.abbr} \u2014 ${presentation.fullName}`,
    body: presentation.tooltip.body,
    footer: presentation.tooltip.footer
  };
}

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
    const key = match[1];
    const numericValue = Number.parseInt(match[2] ?? '', 10);

    if (!key || !isCharacterAttributeKey(key) || Number.isNaN(numericValue)) {
      return [];
    }

    return [{ key, value: numericValue }];
  });

  return CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const entry = parsed.find((item) => item.key === attributeKey);
    return entry ? [entry] : [];
  });
}
