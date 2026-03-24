import {
  PLAYER_LINEAGE_PROFILES,
  type EquipmentState,
  type InventoryStack,
  type PlayerAbilityState,
  type PlayerAttributeAdjustments,
  type PlayerAttributes,
  type PlayerCurrencyState,
  type PlayerSkillState,
  type PlayerSpellState
} from '../../../../packages/shared/types/src/index.js';

export interface CharacterCreationOption {
  id: string;
  label: string;
  description: string;
  notes: string[];
}

export interface StarterClassTemplate {
  id: string;
  label: string;
  description: string;
  notes: string[];
  baseAttributes: PlayerAttributes;
  skills: PlayerSkillState[];
  spells: PlayerSpellState[];
  abilities: PlayerAbilityState[];
  equipment: Partial<EquipmentState>;
  inventory: InventoryStack[];
  currency: PlayerCurrencyState;
}

export interface StarterBackgroundTemplate extends CharacterCreationOption {
  jobId: string;
  attributeAdjustments: PlayerAttributeAdjustments;
  skillBonuses: PlayerSkillState[];
  traitIds: string[];
  inventoryBonuses: InventoryStack[];
  currencyBonus: PlayerCurrencyState;
}

export interface StarterSettlementTemplate extends CharacterCreationOption {
  regionId: string;
  regionLabel: string;
  settlementId: string;
  siteLabel: string;
  worldMapId: string;
  traitIds: string[];
  knownSettlementIds: string[];
  knownLocationIds: string[];
  worldRecordIds: string[];
  activityRecordIds: string[];
  codexEntryIds: string[];
  questJournalIds: string[];
  chronicleIds: string[];
  currentActivity: {
    id: string;
    label: string;
    category: string;
    detail: string;
  };
}

export const lineageOptions: CharacterCreationOption[] = Object.values(
  PLAYER_LINEAGE_PROFILES
).map((profile) => ({
  id: profile.id,
  label: profile.name,
  description: profile.notes[0] ?? `${profile.name} lineage profile`,
  notes: profile.notes
}));

export const STARTER_CLASS_TEMPLATES: Record<string, StarterClassTemplate> = {
  'class.explorer': {
    id: 'class.explorer',
    label: 'Explorer',
    description: 'Balanced routecraft path for survey, travel, and broad utility.',
    notes: ['Focuses on movement, recon, and practical field readiness.'],
    baseAttributes: {
      STR: 10,
      DEX: 11,
      AGI: 12,
      CON: 10,
      VIT: 10,
      WIS: 11,
      INT: 11,
      SPT: 9,
      CHA: 10
    },
    skills: [
      { id: 'skill.navigation', rank: 2, source: 'trained' },
      { id: 'skill.survival', rank: 1, source: 'trained' },
      { id: 'skill.mercantile', rank: 1, source: 'trained' }
    ],
    spells: [],
    abilities: [{ id: 'ability.mobility.combat_roll', category: 'general', rank: 1, source: 'learned' }],
    equipment: {
      'slot.weapon.right': {
        itemId: 'item.wayfinder_knife',
        itemKey: 'wayfinder_knife',
        quantity: 1,
        durability: 1
      },
      'slot.accessory.waist': {
        itemId: 'item.field_chart_case',
        itemKey: 'field_chart_case',
        quantity: 1,
        durability: 1
      }
    },
    inventory: [
      { itemId: 'item.ration_pack', itemKey: 'ration_pack', quantity: 4 },
      { itemId: 'item.bandage', itemKey: 'bandage', quantity: 3 },
      { itemId: 'item.marker_chalk', itemKey: 'marker_chalk', quantity: 1 }
    ],
    currency: { gold: 120, silver: 8, copper: 4 }
  },
  'class.warrior': {
    id: 'class.warrior',
    label: 'Warrior',
    description: 'Frontline path built around durable gear and direct combat pressure.',
    notes: ['Starts with heavier protection and martial fundamentals.'],
    baseAttributes: {
      STR: 12,
      DEX: 10,
      AGI: 10,
      CON: 12,
      VIT: 11,
      WIS: 9,
      INT: 8,
      SPT: 9,
      CHA: 9
    },
    skills: [
      { id: 'skill.blades', rank: 2, source: 'trained' },
      { id: 'skill.guard', rank: 1, source: 'trained' },
      { id: 'skill.endurance', rank: 1, source: 'trained' }
    ],
    spells: [],
    abilities: [{ id: 'ability.combat.shield_bash', category: 'weapon', rank: 1, source: 'learned' }],
    equipment: {
      'slot.weapon.right': {
        itemId: 'item.militia_sword',
        itemKey: 'militia_sword',
        quantity: 1,
        durability: 1
      },
      'slot.armor.chest': {
        itemId: 'item.militia_brigandine',
        itemKey: 'militia_brigandine',
        quantity: 1,
        durability: 1,
        resourceModifiers: [
          {
            id: 'equipment.militia_brigandine',
            label: 'Militia Brigandine',
            sourceType: 'equipment',
            sourceId: 'item.militia_brigandine',
            maxFlat: { hp: 8 },
            maxPercent: {},
            tickDeltaFlat: {},
            notes: ['Layered padding and riveted plates help new soldiers take a first hard hit.']
          }
        ]
      }
    },
    inventory: [
      { itemId: 'item.ration_pack', itemKey: 'ration_pack', quantity: 6 },
      { itemId: 'item.bandage', itemKey: 'bandage', quantity: 2 },
      { itemId: 'item.whetstone', itemKey: 'whetstone', quantity: 1 }
    ],
    currency: { gold: 90, silver: 2, copper: 6 }
  },
  'class.arcanist': {
    id: 'class.arcanist',
    label: 'Arcanist',
    description: 'Reserve-focused magical path with early elemental access.',
    notes: ['Trades physical staying power for better magical reserves.'],
    baseAttributes: {
      STR: 8,
      DEX: 10,
      AGI: 10,
      CON: 9,
      VIT: 9,
      WIS: 11,
      INT: 13,
      SPT: 13,
      CHA: 9
    },
    skills: [
      { id: 'skill.arcana', rank: 2, source: 'trained' },
      { id: 'skill.inscription', rank: 1, source: 'trained' },
      { id: 'skill.meditation', rank: 1, source: 'trained' }
    ],
    spells: [
      {
        id: 'spell.storm.shock_spear',
        school: 'elemental',
        element: 'lightning',
        rank: 1,
        source: 'learned'
      }
    ],
    abilities: [{ id: 'ability.general.focus_breath', category: 'general', rank: 1, source: 'learned' }],
    equipment: {
      'slot.accessory.neck': {
        itemId: 'item.apprentice_focus',
        itemKey: 'apprentice_focus',
        quantity: 1,
        durability: 1,
        resourceModifiers: [
          {
            id: 'equipment.apprentice_focus',
            label: 'Apprentice Focus',
            sourceType: 'equipment',
            sourceId: 'item.apprentice_focus',
            maxFlat: { mp: 6 },
            maxPercent: {},
            tickDeltaFlat: { mp: 1 },
            notes: ['A charged focus crystal steadies breathing and returns a little reserve each tick.']
          }
        ]
      }
    },
    inventory: [
      { itemId: 'item.novice_grimoire', itemKey: 'novice_grimoire', quantity: 1 },
      { itemId: 'item.ink_vial', itemKey: 'ink_vial', quantity: 2 },
      { itemId: 'item.ration_pack', itemKey: 'ration_pack', quantity: 3 }
    ],
    currency: { gold: 70, silver: 6, copper: 9 }
  },
  'class.artisan': {
    id: 'class.artisan',
    label: 'Artisan',
    description: 'Steady crafter path built around repair, finish work, and value extraction.',
    notes: ['Opens with reliable utility gear and practical workshop skills.'],
    baseAttributes: {
      STR: 10,
      DEX: 12,
      AGI: 9,
      CON: 10,
      VIT: 10,
      WIS: 11,
      INT: 12,
      SPT: 9,
      CHA: 9
    },
    skills: [
      { id: 'skill.crafting', rank: 2, source: 'trained' },
      { id: 'skill.repair', rank: 1, source: 'trained' },
      { id: 'skill.appraisal', rank: 1, source: 'trained' }
    ],
    spells: [],
    abilities: [{ id: 'ability.general.steady_hands', category: 'general', rank: 1, source: 'learned' }],
    equipment: {
      'slot.armor.hand': {
        itemId: 'item.craft_gloves',
        itemKey: 'craft_gloves',
        quantity: 1,
        durability: 1
      }
    },
    inventory: [
      { itemId: 'item.tool_roll', itemKey: 'tool_roll', quantity: 1 },
      { itemId: 'item.wax_thread', itemKey: 'wax_thread', quantity: 2 },
      { itemId: 'item.ration_pack', itemKey: 'ration_pack', quantity: 4 }
    ],
    currency: { gold: 95, silver: 4, copper: 1 }
  },
  'class.merchant': {
    id: 'class.merchant',
    label: 'Merchant',
    description: 'Trade and negotiation path with stronger appraisal and liquid coin.',
    notes: ['Starts with contract tools and commercial leverage.'],
    baseAttributes: {
      STR: 9,
      DEX: 10,
      AGI: 10,
      CON: 9,
      VIT: 9,
      WIS: 11,
      INT: 12,
      SPT: 9,
      CHA: 13
    },
    skills: [
      { id: 'skill.mercantile', rank: 2, source: 'trained' },
      { id: 'skill.appraisal', rank: 2, source: 'trained' },
      { id: 'skill.etiquette', rank: 1, source: 'trained' }
    ],
    spells: [],
    abilities: [{ id: 'ability.general.quick_ledger', category: 'general', rank: 1, source: 'learned' }],
    equipment: {
      'slot.accessory.arms': {
        itemId: 'item.trade_ledger',
        itemKey: 'trade_ledger',
        quantity: 1,
        durability: 1
      }
    },
    inventory: [
      { itemId: 'item.trade_scales', itemKey: 'trade_scales', quantity: 1 },
      { itemId: 'item.sealed_contract', itemKey: 'sealed_contract', quantity: 2 },
      { itemId: 'item.ration_pack', itemKey: 'ration_pack', quantity: 3 }
    ],
    currency: { gold: 160, silver: 14, copper: 0 }
  },
  'class.mariner': {
    id: 'class.mariner',
    label: 'Mariner',
    description: 'Sea-going path tuned for shipboard endurance and weathered movement.',
    notes: ['Opens with practical deck gear and travel-focused stamina.'],
    baseAttributes: {
      STR: 10,
      DEX: 10,
      AGI: 11,
      CON: 11,
      VIT: 11,
      WIS: 10,
      INT: 9,
      SPT: 8,
      CHA: 10
    },
    skills: [
      { id: 'skill.seamanship', rank: 2, source: 'trained' },
      { id: 'skill.navigation', rank: 1, source: 'trained' },
      { id: 'skill.endurance', rank: 1, source: 'trained' }
    ],
    spells: [],
    abilities: [{ id: 'ability.general.sea_legs', category: 'general', rank: 1, source: 'learned' }],
    equipment: {
      'slot.armor.chest': {
        itemId: 'item.oilskin_coat',
        itemKey: 'oilskin_coat',
        quantity: 1,
        durability: 1
      },
      'slot.weapon.right': {
        itemId: 'item.deck_hook',
        itemKey: 'deck_hook',
        quantity: 1,
        durability: 1
      }
    },
    inventory: [
      { itemId: 'item.rope_coil', itemKey: 'rope_coil', quantity: 1 },
      { itemId: 'item.dried_fish', itemKey: 'dried_fish', quantity: 4 },
      { itemId: 'item.bandage', itemKey: 'bandage', quantity: 2 }
    ],
    currency: { gold: 105, silver: 7, copper: 3 }
  }
};

export const classOptions: CharacterCreationOption[] = Object.values(
  STARTER_CLASS_TEMPLATES
).map((template) => ({
  id: template.id,
  label: template.label,
  description: template.description,
  notes: template.notes
}));

export const STARTER_BACKGROUND_TEMPLATES: Record<string, StarterBackgroundTemplate> = {
  'background.harbor_runner': {
    id: 'background.harbor_runner',
    label: 'Harbor Runner',
    description: 'Raised between piers, manifests, and tide calls.',
    notes: ['Tidewise instincts and fast hands suit courier and dock work.'],
    jobId: 'job.harbor_runner',
    attributeAdjustments: { AGI: 1, WIS: 1, STR: -1 },
    skillBonuses: [
      { id: 'skill.navigation', rank: 1, source: 'trained' },
      { id: 'skill.mercantile', rank: 1, source: 'trained' }
    ],
    traitIds: ['trait.tidewise', 'trait.quick_hands'],
    inventoryBonuses: [
      { itemId: 'item.rope_coil', itemKey: 'rope_coil', quantity: 1 },
      { itemId: 'item.dried_fish', itemKey: 'dried_fish', quantity: 2 }
    ],
    currencyBonus: { gold: 18, silver: 4, copper: 0 }
  },
  'background.ledger_apprentice': {
    id: 'background.ledger_apprentice',
    label: 'Ledger Apprentice',
    description: 'Trained in tallies, seals, and careful merchant correspondence.',
    notes: ['Brings better coin sense and a more formal commercial education.'],
    jobId: 'job.ledger_apprentice',
    attributeAdjustments: { INT: 1, CHA: 1, STR: -1 },
    skillBonuses: [
      { id: 'skill.mercantile', rank: 1, source: 'trained' },
      { id: 'skill.appraisal', rank: 1, source: 'trained' },
      { id: 'skill.inscription', rank: 1, source: 'trained' }
    ],
    traitIds: ['trait.ledger_mind', 'trait.guild_lettered'],
    inventoryBonuses: [
      { itemId: 'item.ink_vial', itemKey: 'ink_vial', quantity: 1 },
      { itemId: 'item.sealed_contract', itemKey: 'sealed_contract', quantity: 1 }
    ],
    currencyBonus: { gold: 24, silver: 6, copper: 0 }
  },
  'background.militia_retainer': {
    id: 'background.militia_retainer',
    label: 'Militia Retainer',
    description: 'Camp life and gate rotations taught early discipline.',
    notes: ['Starts with stronger watch duty habits and practical field toughness.'],
    jobId: 'job.militia_retainer',
    attributeAdjustments: { STR: 1, CON: 1, CHA: -1 },
    skillBonuses: [
      { id: 'skill.guard', rank: 1, source: 'trained' },
      { id: 'skill.endurance', rank: 1, source: 'trained' },
      { id: 'skill.blades', rank: 1, source: 'trained' }
    ],
    traitIds: ['trait.drill_hardened', 'trait.watchful'],
    inventoryBonuses: [
      { itemId: 'item.bandage', itemKey: 'bandage', quantity: 2 },
      { itemId: 'item.whetstone', itemKey: 'whetstone', quantity: 1 }
    ],
    currencyBonus: { gold: 12, silver: 3, copper: 0 }
  },
  'background.wayfinder_apprentice': {
    id: 'background.wayfinder_apprentice',
    label: 'Wayfinder Apprentice',
    description: 'Survey markers, road lore, and field notes shaped your youth.',
    notes: ['Adds sharper route memory and a better eye for the practical journey.'],
    jobId: 'job.wayfinder_apprentice',
    attributeAdjustments: { AGI: 1, INT: 1, CHA: -1 },
    skillBonuses: [
      { id: 'skill.navigation', rank: 1, source: 'trained' },
      { id: 'skill.survival', rank: 1, source: 'trained' },
      { id: 'skill.appraisal', rank: 1, source: 'trained' }
    ],
    traitIds: ['trait.fieldwise', 'trait.route_memory'],
    inventoryBonuses: [
      { itemId: 'item.marker_chalk', itemKey: 'marker_chalk', quantity: 1 },
      { itemId: 'item.survey_note', itemKey: 'survey_note', quantity: 1 },
      { itemId: 'item.ration_pack', itemKey: 'ration_pack', quantity: 1 }
    ],
    currencyBonus: { gold: 15, silver: 5, copper: 2 }
  }
};

export const backgroundOptions: CharacterCreationOption[] = Object.values(
  STARTER_BACKGROUND_TEMPLATES
).map((template) => ({
  id: template.id,
  label: template.label,
  description: template.description,
  notes: template.notes
}));

export const STARTER_SETTLEMENT_TEMPLATES: Record<string, StarterSettlementTemplate> = {
  'start.saltmere_harbor': {
    id: 'start.saltmere_harbor',
    label: 'Saltmere Harbor',
    description: 'A storm-worn port quarter of contracts, cutters, and reef traffic.',
    notes: ['Best suited for coastal trade, navigation work, and harbor office contacts.'],
    regionId: 'region.sable_coast',
    regionLabel: 'Sable Coast',
    settlementId: 'settlement.saltmere',
    siteLabel: 'Harbor Quarter',
    worldMapId: 'world_map.first_world',
    traitIds: ['trait.saltmere_local'],
    knownSettlementIds: ['settlement.saltmere', 'settlement.westreach', 'settlement.crown_bastion'],
    knownLocationIds: ['location.saltmere', 'location.ashen_reef', 'location.westreach'],
    worldRecordIds: [
      'region.sable_coast',
      'settlement.saltmere',
      'route.saltmere_westreach',
      'route.saltmere_ashen_reef',
      'travel.scout_ashen_reef',
      'market.dock_rope',
      'market.iron_rivets'
    ],
    activityRecordIds: [
      'job.harbor_surveyor',
      'business.gannet_cutter',
      'craft.waterproof_chart_case',
      'contract.ashen_reef',
      'naval.harbor_patrol',
      'operations.drydock_queue'
    ],
    codexEntryIds: ['items.survey_kit', 'factions.harbor_office', 'notes.reef_survey', 'flora.unknown_bloom'],
    questJournalIds: ['quest.ashen_reef_survey', 'quest.rivet_shortfall_relief'],
    chronicleIds: ['chronicle.salt_convoy', 'chronicle.harbor_reputation', 'chronicle.tideglass_discovery'],
    currentActivity: {
      id: 'activity.arrival.saltmere',
      label: 'Entering Saltmere',
      category: 'Arrival',
      detail: 'Securing berth papers, harbor rumors, and a first line of local work.'
    }
  },
  'start.westreach_market': {
    id: 'start.westreach_market',
    label: 'Westreach Market Ward',
    description: 'An upland trade town of smelters, assay offices, and convoy yards.',
    notes: ['A stronger opening for inland logistics, ore trade, and road contracts.'],
    regionId: 'region.stoneward_march',
    regionLabel: 'Stoneward March',
    settlementId: 'settlement.westreach',
    siteLabel: 'Market Ward',
    worldMapId: 'world_map.first_world',
    traitIds: ['trait.stoneward_local'],
    knownSettlementIds: ['settlement.westreach', 'settlement.saltmere', 'settlement.crown_bastion'],
    knownLocationIds: ['location.westreach', 'location.saltmere', 'location.crown_bastion'],
    worldRecordIds: [
      'region.stoneward_march',
      'settlement.westreach',
      'route.saltmere_westreach',
      'travel.manifest_relay',
      'market.iron_rivets'
    ],
    activityRecordIds: [
      'trade.amber_salt_convoy',
      'contract.ashen_reef',
      'military.third_banner_drill',
      'operations.drydock_queue'
    ],
    codexEntryIds: ['minerals.deepiron', 'fauna.galehound', 'items.survey_kit', 'flora.unknown_bloom'],
    questJournalIds: ['quest.rivet_shortfall_relief', 'quest.ledger_recovery'],
    chronicleIds: ['chronicle.salt_convoy', 'chronicle.keel_refit'],
    currentActivity: {
      id: 'activity.arrival.westreach',
      label: 'Checking Convoy Manifests',
      category: 'Arrival',
      detail: 'Reading freight notices, ore prices, and the next inland shipment window.'
    }
  },
  'start.saltmere_exchange': {
    id: 'start.saltmere_exchange',
    label: 'Saltmere Guild Exchange',
    description: 'The commercial heart of Saltmere, crowded with ledgers, bids, and charter work.',
    notes: ['A denser start for crafters, merchants, and contract-seeking crews.'],
    regionId: 'region.sable_coast',
    regionLabel: 'Sable Coast',
    settlementId: 'settlement.saltmere',
    siteLabel: 'Guild Exchange',
    worldMapId: 'world_map.first_world',
    traitIds: ['trait.exchange_local'],
    knownSettlementIds: ['settlement.saltmere', 'settlement.westreach', 'settlement.crown_bastion'],
    knownLocationIds: ['location.saltmere', 'location.westreach', 'location.ashen_reef'],
    worldRecordIds: [
      'region.sable_coast',
      'settlement.saltmere',
      'route.saltmere_westreach',
      'route.saltmere_ashen_reef',
      'market.dock_rope',
      'market.iron_rivets'
    ],
    activityRecordIds: [
      'business.gannet_cutter',
      'trade.amber_salt_convoy',
      'craft.waterproof_chart_case',
      'contract.ashen_reef'
    ],
    codexEntryIds: ['items.survey_kit', 'recipes.saltproof_varnish', 'factions.harbor_office', 'flora.unknown_bloom'],
    questJournalIds: ['quest.rivet_shortfall_relief', 'quest.ashen_reef_survey'],
    chronicleIds: ['chronicle.harbor_reputation', 'chronicle.salt_convoy', 'chronicle.keel_refit'],
    currentActivity: {
      id: 'activity.arrival.exchange',
      label: 'Reporting At The Exchange',
      category: 'Arrival',
      detail: 'Taking stock of guild bids, contract chatter, and dockside price shifts.'
    }
  }
};

export const settlementOptions: CharacterCreationOption[] = Object.values(
  STARTER_SETTLEMENT_TEMPLATES
).map((template) => ({
  id: template.id,
  label: template.label,
  description: `${template.regionLabel} | ${template.description}`,
  notes: template.notes
}));

export function getStarterClassTemplate(classId: string): StarterClassTemplate {
  return STARTER_CLASS_TEMPLATES[classId] ?? STARTER_CLASS_TEMPLATES['class.explorer']!;
}

export function getStarterBackgroundTemplate(
  backgroundId: string
): StarterBackgroundTemplate {
  return (
    STARTER_BACKGROUND_TEMPLATES[backgroundId] ??
    STARTER_BACKGROUND_TEMPLATES['background.harbor_runner']!
  );
}

export function getStarterSettlementTemplate(
  settlementId: string
): StarterSettlementTemplate {
  return (
    STARTER_SETTLEMENT_TEMPLATES[settlementId] ??
    STARTER_SETTLEMENT_TEMPLATES['start.saltmere_harbor']!
  );
}

export function isKnownLineageId(lineageId: string): boolean {
  return lineageId in PLAYER_LINEAGE_PROFILES;
}
