import {
  PLAYER_LINEAGE_PROFILES,
  type EquipmentState,
  type InventoryStack,
  type PlayerAbilityCategory,
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

export interface IdentityPaletteOption {
  id: string;
  label: string;
  description: string;
}

export interface LineageIdentityCatalog {
  lineageId: string;
  heightRangeCm: [number, number];
  buildOptions: IdentityPaletteOption[];
  skinToneOptions: IdentityPaletteOption[];
  hairColorOptions: IdentityPaletteOption[];
  hairHighlightOptions: IdentityPaletteOption[];
  eyeColorOptions: IdentityPaletteOption[];
}

export interface StarterPathTemplate {
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

export interface StarterBackstoryTemplate extends CharacterCreationOption {
  lineageIds: string[];
  startAccessBackgroundId: string;
  jobId: string;
  attributeAdjustments: PlayerAttributeAdjustments;
  skillBonuses: PlayerSkillState[];
  traitIds: string[];
  inventoryBonuses: InventoryStack[];
  currencyBonus: PlayerCurrencyState;
}

const DEFAULT_BACKSTORY_ID = 'background.human.harbor_courier';
const DEFAULT_START_ACCESS_BACKGROUND_ID = 'background.harbor_runner';

function option(id: string, label: string, description: string): IdentityPaletteOption {
  return { id, label, description };
}

function stack(itemKey: string, quantity: number): InventoryStack {
  return {
    itemId: `item.${itemKey}`,
    itemKey,
    quantity
  };
}

function skill(id: string, rank = 1): PlayerSkillState {
  return {
    id,
    rank,
    source: 'trained'
  };
}

function spell(
  id: string,
  school: string,
  rank = 1,
  element?: string
): PlayerSpellState {
  return {
    id,
    school,
    rank,
    source: 'learned',
    ...(element ? { element } : {})
  };
}

function ability(
  id: string,
  category: PlayerAbilityCategory,
  rank = 1
): PlayerAbilityState {
  return {
    id,
    category,
    rank,
    source: 'learned'
  };
}

function coin(gold: number, silver: number, copper: number): PlayerCurrencyState {
  return { gold, silver, copper };
}

function notes(passiveBonus: string, ...hooks: string[]): string[] {
  return [
    `Passive: ${passiveBonus}`,
    `Hooks: ${hooks.join(', ')}`
  ];
}

function createBackstory(params: StarterBackstoryTemplate): StarterBackstoryTemplate {
  return params;
}

const BUILD_OPTIONS: IdentityPaletteOption[] = [
  option('slim', 'Slim', 'Light frame with lean movement and narrow shoulders.'),
  option('average', 'Average', 'Balanced proportions with no strong silhouette bias.'),
  option('heavy', 'Heavy', 'Broader build with visible weight and grounded presence.'),
  option('muscular', 'Muscular', 'Defined frame built around labor, training, or dense physical strength.')
];

const HIGHLIGHT_OPTIONS: IdentityPaletteOption[] = [
  option('highlight.sunlit_gold', 'Sunlit Gold', 'Warm metallic streaks that catch bright light.'),
  option('highlight.copper_glint', 'Copper Glint', 'Reddish metallic threads suited to earth-toned hair.'),
  option('highlight.moon_silver', 'Moon Silver', 'Cold silver highlights with a muted shimmer.'),
  option('highlight.sea_glass', 'Sea Glass', 'Soft green-blue streaks with a sea-worn hue.'),
  option('highlight.ember_red', 'Ember Red', 'Deep ember accents that read hot in torchlight.')
];

const LINEAGE_IDENTITY_CATALOGS: Record<string, LineageIdentityCatalog> = {
  'lineage.human': {
    lineageId: 'lineage.human',
    heightRangeCm: [158, 196],
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: [
      option('skin.human.fair_rose', 'Fair Rose', 'Light skin with pink warmth.'),
      option('skin.human.warm_beige', 'Warm Beige', 'Balanced warm skin common across inland cultures.'),
      option('skin.human.sun_bronze', 'Sun Bronze', 'Sun-touched bronze skin with golden undertones.'),
      option('skin.human.deep_umber', 'Deep Umber', 'Dark umber skin with rich warmth.')
    ],
    hairColorOptions: [
      option('hair.human.black', 'Black', 'Dense black hair with a neutral sheen.'),
      option('hair.human.chestnut', 'Chestnut', 'Brown hair with warm red undertones.'),
      option('hair.human.ash_brown', 'Ash Brown', 'Cool brown hair with muted grey notes.'),
      option('hair.human.auburn', 'Auburn', 'Warm red-brown hair.'),
      option('hair.human.dark_blonde', 'Dark Blonde', 'Golden-brown hair with a muted lift.')
    ],
    hairHighlightOptions: HIGHLIGHT_OPTIONS,
    eyeColorOptions: [
      option('eyes.human.brown', 'Brown', 'Dark brown eyes with a grounded tone.'),
      option('eyes.human.hazel', 'Hazel', 'Mixed brown-green eyes.'),
      option('eyes.human.grey', 'Grey', 'Soft steel-grey eyes.'),
      option('eyes.human.green', 'Green', 'Natural green eyes with forest warmth.'),
      option('eyes.human.blue', 'Blue', 'Clear blue eyes.')
    ]
  },
  'lineage.elf': {
    lineageId: 'lineage.elf',
    heightRangeCm: [166, 205],
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: [
      option('skin.elf.moonlit_cream', 'Moonlit Cream', 'Very light skin with cool ivory light.'),
      option('skin.elf.golden_olive', 'Golden Olive', 'Golden skin with calm olive depth.'),
      option('skin.elf.sunleaf_bronze', 'Sunleaf Bronze', 'Soft bronze skin with subtle green undertones.'),
      option('skin.elf.ashen_tan', 'Ashen Tan', 'Muted tan skin with cool ash tones.')
    ],
    hairColorOptions: [
      option('hair.elf.silver', 'Silver', 'Bright silver hair with soft light scatter.'),
      option('hair.elf.ash_blonde', 'Ash Blonde', 'Pale blonde hair with cool depth.'),
      option('hair.elf.raven', 'Raven', 'Blue-black hair with a glassy sheen.'),
      option('hair.elf.leaf_brown', 'Leaf Brown', 'Neutral brown hair with faint green warmth.'),
      option('hair.elf.white_gold', 'White Gold', 'Very pale gold hair.')
    ],
    hairHighlightOptions: HIGHLIGHT_OPTIONS,
    eyeColorOptions: [
      option('eyes.elf.emerald', 'Emerald', 'Rich green eyes with strong saturation.'),
      option('eyes.elf.sky', 'Sky', 'Pale blue eyes with a glass-clear edge.'),
      option('eyes.elf.amber', 'Amber', 'Warm amber eyes with luminous depth.'),
      option('eyes.elf.violet', 'Violet', 'Rare violet eyes with muted bloom.'),
      option('eyes.elf.silver', 'Silver', 'Light silver-grey eyes.')
    ]
  },
  'lineage.dark_elf': {
    lineageId: 'lineage.dark_elf',
    heightRangeCm: [162, 198],
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: [
      option('skin.dark_elf.obsidian', 'Obsidian', 'Deep cool skin with polished-stone light.'),
      option('skin.dark_elf.ash_violet', 'Ash Violet', 'Muted violet-grey skin.'),
      option('skin.dark_elf.smoked_bronze', 'Smoked Bronze', 'Dark bronze skin with soot-softened warmth.'),
      option('skin.dark_elf.night_umber', 'Night Umber', 'Very dark brown skin with cool undertones.')
    ],
    hairColorOptions: [
      option('hair.dark_elf.white', 'White', 'Bone-white hair with a stark contrast.'),
      option('hair.dark_elf.blue_black', 'Blue Black', 'Cool black hair with blue light.'),
      option('hair.dark_elf.deep_plum', 'Deep Plum', 'Dark plum hair with muted crimson undertones.'),
      option('hair.dark_elf.silver', 'Silver', 'Soft silver hair.'),
      option('hair.dark_elf.smoke_grey', 'Smoke Grey', 'Grey hair with charcoal depth.')
    ],
    hairHighlightOptions: HIGHLIGHT_OPTIONS,
    eyeColorOptions: [
      option('eyes.dark_elf.crimson', 'Crimson', 'Dark red eyes with an ember core.'),
      option('eyes.dark_elf.violet', 'Violet', 'Deep violet eyes.'),
      option('eyes.dark_elf.teal', 'Teal', 'Cold blue-green eyes.'),
      option('eyes.dark_elf.silver', 'Silver', 'Sharp silver eyes.'),
      option('eyes.dark_elf.amber', 'Amber', 'Warm amber eyes with a low glow.')
    ]
  },
  'lineage.dwarf': {
    lineageId: 'lineage.dwarf',
    heightRangeCm: [132, 156],
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: [
      option('skin.dwarf.ruddy_cream', 'Ruddy Cream', 'Light skin with a wind-burned flush.'),
      option('skin.dwarf.stone_beige', 'Stone Beige', 'Weathered beige skin with muted cool tones.'),
      option('skin.dwarf.copper_bronze', 'Copper Bronze', 'Warm bronze skin with red undertones.'),
      option('skin.dwarf.deep_slate', 'Deep Slate', 'Dark stone-brown skin with mineral coolness.')
    ],
    hairColorOptions: [
      option('hair.dwarf.iron_black', 'Iron Black', 'Dense black hair with low shine.'),
      option('hair.dwarf.auburn', 'Auburn', 'Warm red-brown hair.'),
      option('hair.dwarf.copper', 'Copper', 'Rich copper hair.'),
      option('hair.dwarf.chestnut', 'Chestnut', 'Heavy chestnut hair with natural warmth.'),
      option('hair.dwarf.iron_grey', 'Iron Grey', 'Grey hair with a metallic cast.')
    ],
    hairHighlightOptions: HIGHLIGHT_OPTIONS,
    eyeColorOptions: [
      option('eyes.dwarf.hazel', 'Hazel', 'Warm hazel eyes.'),
      option('eyes.dwarf.amber', 'Amber', 'Amber eyes with furnace warmth.'),
      option('eyes.dwarf.slate', 'Slate', 'Cool slate-grey eyes.'),
      option('eyes.dwarf.green', 'Green', 'Deep green eyes.'),
      option('eyes.dwarf.brown', 'Brown', 'Dark brown eyes.')
    ]
  },
  'lineage.half_troll': {
    lineageId: 'lineage.half_troll',
    heightRangeCm: [178, 220],
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: [
      option('skin.half_troll.fen_olive', 'Fen Olive', 'Muted olive skin with marsh depth.'),
      option('skin.half_troll.peat_brown', 'Peat Brown', 'Dark brown skin with wet-earth warmth.'),
      option('skin.half_troll.storm_grey', 'Storm Grey', 'Grey-tinted skin with a cool cast.'),
      option('skin.half_troll.deep_moss', 'Deep Moss', 'Dark green-brown skin with mossy undertones.')
    ],
    hairColorOptions: [
      option('hair.half_troll.black', 'Black', 'Heavy black hair.'),
      option('hair.half_troll.dark_auburn', 'Dark Auburn', 'Rough red-brown hair.'),
      option('hair.half_troll.moss_brown', 'Moss Brown', 'Earthy brown hair with green undertones.'),
      option('hair.half_troll.steel_grey', 'Steel Grey', 'Grey hair with cold depth.')
    ],
    hairHighlightOptions: HIGHLIGHT_OPTIONS,
    eyeColorOptions: [
      option('eyes.half_troll.amber', 'Amber', 'Warm amber eyes.'),
      option('eyes.half_troll.green', 'Green', 'Muted green eyes.'),
      option('eyes.half_troll.grey', 'Grey', 'Stone-grey eyes.'),
      option('eyes.half_troll.pale_blue', 'Pale Blue', 'Cool pale blue eyes.')
    ]
  },
  'lineage.half_orc': {
    lineageId: 'lineage.half_orc',
    heightRangeCm: [168, 206],
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: [
      option('skin.half_orc.olive', 'Olive', 'Balanced olive skin with warm depth.'),
      option('skin.half_orc.burnished_bronze', 'Burnished Bronze', 'Bronze skin with copper warmth.'),
      option('skin.half_orc.ash_olive', 'Ash Olive', 'Cool olive skin with a dusted cast.'),
      option('skin.half_orc.deep_umber', 'Deep Umber', 'Dark umber skin with grounded warmth.')
    ],
    hairColorOptions: [
      option('hair.half_orc.black', 'Black', 'Dense black hair with a matte finish.'),
      option('hair.half_orc.iron_brown', 'Iron Brown', 'Dark brown hair with cool weight.'),
      option('hair.half_orc.auburn', 'Auburn', 'Red-brown hair with a stronger ember note.'),
      option('hair.half_orc.ash_grey', 'Ash Grey', 'Grey hair with soft charcoal depth.')
    ],
    hairHighlightOptions: HIGHLIGHT_OPTIONS,
    eyeColorOptions: [
      option('eyes.half_orc.gold', 'Gold', 'Golden eyes with strong contrast.'),
      option('eyes.half_orc.brown', 'Brown', 'Dark brown eyes.'),
      option('eyes.half_orc.green', 'Green', 'Low-saturation green eyes.'),
      option('eyes.half_orc.steel', 'Steel', 'Steel-grey eyes.')
    ]
  },
  'lineage.half_goblin': {
    lineageId: 'lineage.half_goblin',
    heightRangeCm: [148, 182],
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: [
      option('skin.half_goblin.dusk_tan', 'Dusk Tan', 'Muted tan skin with soot-soft edges.'),
      option('skin.half_goblin.olive_grey', 'Olive Grey', 'Grey-green skin with tunnel pallor.'),
      option('skin.half_goblin.copper', 'Copper', 'Warm copper skin with lively contrast.'),
      option('skin.half_goblin.soot_brown', 'Soot Brown', 'Dark brown skin with smoky undertones.')
    ],
    hairColorOptions: [
      option('hair.half_goblin.black', 'Black', 'Soft black hair.'),
      option('hair.half_goblin.ash_brown', 'Ash Brown', 'Cool brown hair with dusted grey notes.'),
      option('hair.half_goblin.bottle_green', 'Bottle Green', 'Rare deep green hair tone.'),
      option('hair.half_goblin.auburn', 'Auburn', 'Warm auburn hair.')
    ],
    hairHighlightOptions: HIGHLIGHT_OPTIONS,
    eyeColorOptions: [
      option('eyes.half_goblin.amber', 'Amber', 'Bright amber eyes.'),
      option('eyes.half_goblin.hazel', 'Hazel', 'Mixed green-brown eyes.'),
      option('eyes.half_goblin.lime', 'Lime', 'Rare yellow-green eyes.'),
      option('eyes.half_goblin.slate', 'Slate', 'Muted slate-grey eyes.')
    ]
  },
  'lineage.half_merfolk': {
    lineageId: 'lineage.half_merfolk',
    heightRangeCm: [160, 199],
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: [
      option('skin.half_merfolk.pearl', 'Pearl', 'Pale skin with a cool luminous cast.'),
      option('skin.half_merfolk.sea_bronze', 'Sea Bronze', 'Bronze skin with salt-softened warmth.'),
      option('skin.half_merfolk.tide_olive', 'Tide Olive', 'Olive skin with cool sea undertones.'),
      option('skin.half_merfolk.storm_blue_grey', 'Storm Blue-Grey', 'Grey skin with a faint blue wash.')
    ],
    hairColorOptions: [
      option('hair.half_merfolk.black', 'Black', 'Dark hair with wet shine.'),
      option('hair.half_merfolk.dark_brown', 'Dark Brown', 'Dense brown hair with sea-dark depth.'),
      option('hair.half_merfolk.silver', 'Silver', 'Soft silver hair.'),
      option('hair.half_merfolk.sea_green', 'Sea Green', 'Rare muted green hair tone.'),
      option('hair.half_merfolk.coral_auburn', 'Coral Auburn', 'Red-brown hair with coral warmth.')
    ],
    hairHighlightOptions: HIGHLIGHT_OPTIONS,
    eyeColorOptions: [
      option('eyes.half_merfolk.aqua', 'Aqua', 'Bright blue-green eyes.'),
      option('eyes.half_merfolk.teal', 'Teal', 'Deep teal eyes.'),
      option('eyes.half_merfolk.grey', 'Grey', 'Storm-grey eyes.'),
      option('eyes.half_merfolk.green', 'Sea Green', 'Green eyes with sea-glass depth.')
    ]
  }
};

export const lineageOptions: CharacterCreationOption[] = Object.values(PLAYER_LINEAGE_PROFILES).map((profile) => ({
  id: profile.id,
  label: profile.name,
  description: profile.notes[0] ?? `${profile.name} lineage profile`,
  notes: profile.notes
}));

export const STARTER_PATH_TEMPLATES: Record<string, StarterPathTemplate> = {
  'class.explorer': {
    id: 'class.explorer',
    label: 'Scout',
    description: 'Field-first path for recon, travel, and controlled risk at the edge of the map.',
    notes: ['Leans on mobility, route memory, and practical wilderness readiness.'],
    baseAttributes: { STR: 10, DEX: 11, AGI: 12, CON: 10, VIT: 10, WIS: 11, INT: 11, SPT: 9, CHA: 10 },
    skills: [skill('skill.navigation', 2), skill('skill.survival', 1), skill('skill.defense.evasion', 1)],
    spells: [],
    abilities: [ability('ability.skirmisher.flee', 'general')],
    equipment: {
      'slot.weapon.right': { itemId: 'item.wayfinder_knife', itemKey: 'wayfinder_knife', quantity: 1, durability: 1 },
      'slot.accessory.waist': { itemId: 'item.field_chart_case', itemKey: 'field_chart_case', quantity: 1, durability: 1 },
      'slot.armor.chest': { itemId: 'item.travel_cloak', itemKey: 'travel_cloak', quantity: 1, durability: 1 }
    },
    inventory: [stack('ration_pack', 4), stack('marker_chalk', 1), stack('lantern', 1)],
    currency: coin(120, 8, 4)
  },
  'class.warrior': {
    id: 'class.warrior',
    label: 'Warrior',
    description: 'Frontline path built around direct combat pressure, guard work, and reliable armor.',
    notes: ['Starts with harder edges, stronger protection, and steadier first-fight durability.'],
    baseAttributes: { STR: 12, DEX: 10, AGI: 10, CON: 12, VIT: 11, WIS: 9, INT: 8, SPT: 9, CHA: 9 },
    skills: [skill('skill.weapon.sword', 2), skill('skill.defense.guard', 1), skill('skill.defense.shield', 1)],
    spells: [],
    abilities: [ability('ability.martial.shield_bash', 'weapon')],
    equipment: {
      'slot.weapon.right': { itemId: 'item.militia_sword', itemKey: 'militia_sword', quantity: 1, durability: 1 },
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
    inventory: [stack('ration_pack', 6), stack('bandage', 2), stack('whetstone', 1)],
    currency: coin(90, 2, 6)
  },
  'class.arcanist': {
    id: 'class.arcanist',
    label: 'Enchanter',
    description: 'Magic-facing path for attunement, channeling, and careful reserve management.',
    notes: ['Begins with an elemental focus and enough kit to start binding practical magic.'],
    baseAttributes: { STR: 8, DEX: 10, AGI: 10, CON: 9, VIT: 9, WIS: 11, INT: 13, SPT: 13, CHA: 9 },
    skills: [skill('skill.magic.elemental_magic', 2), skill('skill.magic.enhancing_magic', 1), skill('skill.inscription', 1)],
    spells: [spell('spell.black.elemental.stone', 'black_magic', 1, 'earth')],
    abilities: [ability('ability.samurai.meditate', 'class')],
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
            notes: ['A charged focus steadies casting rhythm and returns a little reserve each tick.']
          }
        ]
      }
    },
    inventory: [stack('novice_grimoire', 1), stack('ink_vial', 2), stack('ration_pack', 3)],
    currency: coin(70, 6, 9)
  },
  'class.artisan': {
    id: 'class.artisan',
    label: 'Craftsman',
    description: 'Production-minded path built around finish work, repair, and controlled material value.',
    notes: ['Opens with practical workshop tools and a steadier hand on material loss.'],
    baseAttributes: { STR: 10, DEX: 12, AGI: 9, CON: 10, VIT: 10, WIS: 11, INT: 12, SPT: 9, CHA: 9 },
    skills: [skill('skill.craft.smithing', 1), skill('skill.craft.woodworking', 1), skill('skill.repair', 1)],
    spells: [],
    abilities: [ability('ability.general.steady_hands', 'general')],
    equipment: {
      'slot.armor.hand': { itemId: 'item.craft_gloves', itemKey: 'craft_gloves', quantity: 1, durability: 1 }
    },
    inventory: [stack('tool_roll', 1), stack('wax_thread', 2), stack('ration_pack', 4)],
    currency: coin(95, 4, 1)
  },
  'class.merchant': {
    id: 'class.merchant',
    label: 'Trader',
    description: 'Commercial path with stronger appraisal, contract literacy, and liquid starting coin.',
    notes: ['Built for negotiated leverage, portable value, and smart early market reads.'],
    baseAttributes: { STR: 9, DEX: 10, AGI: 10, CON: 9, VIT: 9, WIS: 11, INT: 12, SPT: 9, CHA: 13 },
    skills: [skill('skill.mercantile', 2), skill('skill.appraisal', 2), skill('skill.etiquette', 1)],
    spells: [],
    abilities: [ability('ability.general.quick_ledger', 'general')],
    equipment: {
      'slot.accessory.arms': { itemId: 'item.trade_ledger', itemKey: 'trade_ledger', quantity: 1, durability: 1 }
    },
    inventory: [stack('trade_scales', 1), stack('sealed_contract', 2), stack('ration_pack', 3)],
    currency: coin(160, 14, 0)
  },
  'class.mariner': {
    id: 'class.mariner',
    label: 'Hunter',
    description: 'Pursuit path focused on ranged pressure, field dressing, and long-haul stamina.',
    notes: ['Starts with a bow, travel gear, and enough self-sufficiency for a cold opening.'],
    baseAttributes: { STR: 10, DEX: 12, AGI: 11, CON: 10, VIT: 10, WIS: 11, INT: 9, SPT: 8, CHA: 9 },
    skills: [skill('skill.weapon.archery', 2), skill('skill.tracking', 1), skill('skill.survival', 1)],
    spells: [],
    abilities: [ability('ability.ranger.barrage', 'weapon')],
    equipment: {
      'slot.weapon.right': { itemId: 'item.short_bow', itemKey: 'short_bow', quantity: 1, durability: 1 },
      'slot.armor.chest': { itemId: 'item.travel_cloak', itemKey: 'travel_cloak', quantity: 1, durability: 1 }
    },
    inventory: [stack('dried_meat_pack', 2), stack('rope_coil', 1), stack('skinning_knife', 1)],
    currency: coin(88, 6, 5)
  }
};

export const pathOptions: CharacterCreationOption[] = Object.values(STARTER_PATH_TEMPLATES).map((template) => ({
  id: template.id,
  label: template.label,
  description: template.description,
  notes: template.notes
}));

const BACKSTORY_DEFINITIONS: StarterBackstoryTemplate[] = [
  createBackstory({
    id: 'background.human.city_ward',
    label: 'City Ward',
    description: 'Raised among gates, patrol bells, and the practical order of a defended town.',
    notes: notes('+5% guard steadiness in the opening hours.', 'civic wardens', 'gate barracks'),
    lineageIds: ['lineage.human'],
    startAccessBackgroundId: 'background.militia_retainer',
    jobId: 'job.city_ward',
    attributeAdjustments: { STR: 1, CON: 1, CHA: -1 },
    skillBonuses: [skill('skill.defense.guard', 1), skill('skill.weapon.sword', 1)],
    traitIds: ['trait.watchful', 'trait.drill_hardened'],
    inventoryBonuses: [stack('bandage', 2), stack('whetstone', 1)],
    currencyBonus: coin(12, 3, 0)
  }),
  createBackstory({
    id: 'background.human.guild_scribe',
    label: 'Guild Scribe',
    description: 'Contracts, measures, and seals taught you how power moves through a ledger.',
    notes: notes('+5% appraisal accuracy on common goods.', 'merchant guilds', 'counting houses'),
    lineageIds: ['lineage.human'],
    startAccessBackgroundId: 'background.ledger_apprentice',
    jobId: 'job.guild_scribe',
    attributeAdjustments: { INT: 1, CHA: 1, STR: -1 },
    skillBonuses: [skill('skill.mercantile', 1), skill('skill.appraisal', 1), skill('skill.inscription', 1)],
    traitIds: ['trait.ledger_mind', 'trait.guild_lettered'],
    inventoryBonuses: [stack('ink_vial', 1), stack('sealed_contract', 1)],
    currencyBonus: coin(24, 6, 0)
  }),
  createBackstory({
    id: 'background.human.road_warden',
    label: 'Road Warden',
    description: 'Milestones, toll lanes, and wayposts gave you a practical sense for distance and danger.',
    notes: notes('+5% route memory while traveling known roads.', 'waystations', 'road patrols'),
    lineageIds: ['lineage.human'],
    startAccessBackgroundId: 'background.wayfinder_apprentice',
    jobId: 'job.road_warden',
    attributeAdjustments: { AGI: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.survival', 1), skill('skill.appraisal', 1)],
    traitIds: ['trait.fieldwise', 'trait.route_memory'],
    inventoryBonuses: [stack('marker_chalk', 1), stack('survey_note', 1), stack('ration_pack', 1)],
    currencyBonus: coin(15, 5, 2)
  }),
  createBackstory({
    id: 'background.human.harbor_courier',
    label: 'Harbor Courier',
    description: 'Piers, manifests, and shouted tide calls shaped a fast and practical early life.',
    notes: notes('+5% movement speed around docks and ferries.', 'harbor offices', 'dock crews'),
    lineageIds: ['lineage.human'],
    startAccessBackgroundId: 'background.harbor_runner',
    jobId: 'job.harbor_courier',
    attributeAdjustments: { AGI: 1, WIS: 1, STR: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.mercantile', 1)],
    traitIds: ['trait.tidewise', 'trait.quick_hands'],
    inventoryBonuses: [stack('rope_coil', 1), stack('dried_fish', 2)],
    currencyBonus: coin(18, 4, 0)
  }),
  createBackstory({
    id: 'background.elf.moon_sentinel',
    label: 'Moon Sentinel',
    description: 'Night watches beneath pale boughs taught stillness, discipline, and controlled force.',
    notes: notes('+5% detection at night.', 'watch circles', 'warden lodges'),
    lineageIds: ['lineage.elf'],
    startAccessBackgroundId: 'background.militia_retainer',
    jobId: 'job.moon_sentinel',
    attributeAdjustments: { AGI: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.defense.evasion', 1), skill('skill.weapon.archery', 1)],
    traitIds: ['trait.watchful', 'trait.night_ready'],
    inventoryBonuses: [stack('bandage', 1), stack('marker_chalk', 1)],
    currencyBonus: coin(11, 5, 0)
  }),
  createBackstory({
    id: 'background.elf.star_attendant',
    label: 'Star Attendant',
    description: 'You learned ritual tallies, civic memory, and the patience of observatories and shrines.',
    notes: notes('+5% scroll and note comprehension in the early game.', 'temple archives', 'astral courts'),
    lineageIds: ['lineage.elf'],
    startAccessBackgroundId: 'background.ledger_apprentice',
    jobId: 'job.star_attendant',
    attributeAdjustments: { INT: 1, SPT: 1, STR: -1 },
    skillBonuses: [skill('skill.inscription', 1), skill('skill.appraisal', 1), skill('skill.meditation', 1)],
    traitIds: ['trait.calm_reader', 'trait.star_taught'],
    inventoryBonuses: [stack('ink_vial', 1), stack('novice_grimoire', 1)],
    currencyBonus: coin(19, 6, 2)
  }),
  createBackstory({
    id: 'background.elf.glade_runner',
    label: 'Glade Runner',
    description: 'You grew up reading wind lanes, root paths, and the quiet logic of the woods.',
    notes: notes('+5% travel pace through wild terrain.', 'forest outposts', 'messenger trails'),
    lineageIds: ['lineage.elf'],
    startAccessBackgroundId: 'background.wayfinder_apprentice',
    jobId: 'job.glade_runner',
    attributeAdjustments: { AGI: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.survival', 1), skill('skill.foraging', 1)],
    traitIds: ['trait.light_step', 'trait.route_memory'],
    inventoryBonuses: [stack('marker_chalk', 1), stack('ration_pack', 1), stack('herb_knife', 1)],
    currencyBonus: coin(14, 5, 0)
  }),
  createBackstory({
    id: 'background.elf.reed_navigator',
    label: 'Reed Navigator',
    description: 'Marsh channels and reed-laced waterways made you quick with currents and shallow craft.',
    notes: notes('+5% stamina on ferries, skiffs, and river crossings.', 'reed ports', 'river pilots'),
    lineageIds: ['lineage.elf'],
    startAccessBackgroundId: 'background.harbor_runner',
    jobId: 'job.reed_navigator',
    attributeAdjustments: { WIS: 1, AGI: 1, STR: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.innate.swim', 1)],
    traitIds: ['trait.tidewise', 'trait.flood_memory'],
    inventoryBonuses: [stack('rope_coil', 1), stack('dried_fish', 1)],
    currencyBonus: coin(16, 4, 2)
  }),
  createBackstory({
    id: 'background.dark_elf.night_watch',
    label: 'Night Watch',
    description: 'House alleys, cavern gates, and disciplined midnight patrols taught wary precision.',
    notes: notes('+5% reaction speed against ambushes.', 'cavern watch posts', 'house guards'),
    lineageIds: ['lineage.dark_elf'],
    startAccessBackgroundId: 'background.militia_retainer',
    jobId: 'job.night_watch',
    attributeAdjustments: { AGI: 1, INT: 1, CHA: -1 },
    skillBonuses: [skill('skill.defense.evasion', 1), skill('skill.weapon.throwing', 1)],
    traitIds: ['trait.watchful', 'trait.shadow_ready'],
    inventoryBonuses: [stack('bandage', 1), stack('throwing_knife', 1)],
    currencyBonus: coin(12, 5, 0)
  }),
  createBackstory({
    id: 'background.dark_elf.house_envoy',
    label: 'House Envoy',
    description: 'Formal speech, coded promises, and careful records were part of your upbringing.',
    notes: notes('+5% negotiation composure in tense first meetings.', 'noble houses', 'trade envoys'),
    lineageIds: ['lineage.dark_elf'],
    startAccessBackgroundId: 'background.ledger_apprentice',
    jobId: 'job.house_envoy',
    attributeAdjustments: { CHA: 1, INT: 1, STR: -1 },
    skillBonuses: [skill('skill.etiquette', 1), skill('skill.inscription', 1), skill('skill.appraisal', 1)],
    traitIds: ['trait.silver_tongue', 'trait.ledger_mind'],
    inventoryBonuses: [stack('sealed_contract', 1), stack('ink_vial', 1)],
    currencyBonus: coin(22, 5, 0)
  }),
  createBackstory({
    id: 'background.dark_elf.cavern_scout',
    label: 'Cavern Scout',
    description: 'Deep routes, fungus lights, and vertical tunnels taught you to move with caution and intent.',
    notes: notes('+5% navigation in caves and enclosed routes.', 'tunnel pickets', 'deep waystones'),
    lineageIds: ['lineage.dark_elf'],
    startAccessBackgroundId: 'background.wayfinder_apprentice',
    jobId: 'job.cavern_scout',
    attributeAdjustments: { AGI: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.survival', 1), skill('skill.stealth', 1)],
    traitIds: ['trait.route_memory', 'trait.deep_sight'],
    inventoryBonuses: [stack('lantern', 1), stack('marker_chalk', 1)],
    currencyBonus: coin(14, 4, 1)
  }),
  createBackstory({
    id: 'background.dark_elf.tide_smuggler',
    label: 'Tide Smuggler',
    description: 'Hidden coves and off-book cargo taught you the rhythms of coastal entry and escape.',
    notes: notes('+5% evasion while carrying contraband or quest cargo.', 'hidden docks', 'black markets'),
    lineageIds: ['lineage.dark_elf'],
    startAccessBackgroundId: 'background.harbor_runner',
    jobId: 'job.tide_smuggler',
    attributeAdjustments: { AGI: 1, CHA: 1, STR: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.mercantile', 1), skill('skill.stealth', 1)],
    traitIds: ['trait.quick_hands', 'trait.low_profile'],
    inventoryBonuses: [stack('rope_coil', 1), stack('sealed_contract', 1)],
    currencyBonus: coin(20, 4, 3)
  }),
  createBackstory({
    id: 'background.dwarf.tunnel_guard',
    label: 'Tunnel Guard',
    description: 'Gate holds, convoy doors, and close-ranked defense were the discipline of your youth.',
    notes: notes('+5% block strength against the first heavy hit.', 'fortified adits', 'mine garrisons'),
    lineageIds: ['lineage.dwarf'],
    startAccessBackgroundId: 'background.militia_retainer',
    jobId: 'job.tunnel_guard',
    attributeAdjustments: { STR: 1, VIT: 1, CHA: -1 },
    skillBonuses: [skill('skill.defense.shield', 1), skill('skill.defense.guard', 1)],
    traitIds: ['trait.steady_feet', 'trait.watchful'],
    inventoryBonuses: [stack('bandage', 2), stack('whetstone', 1)],
    currencyBonus: coin(13, 3, 1)
  }),
  createBackstory({
    id: 'background.dwarf.forge_apprentice',
    label: 'Forge Apprentice',
    description: 'The forge taught you rhythm, value, and what good metal feels like in the hand.',
    notes: notes('+5% first-tier smithing yield.', 'smith guilds', 'forge rows'),
    lineageIds: ['lineage.dwarf'],
    startAccessBackgroundId: 'background.ledger_apprentice',
    jobId: 'job.forge_apprentice',
    attributeAdjustments: { STR: 1, INT: 1, CHA: -1 },
    skillBonuses: [skill('skill.craft.smithing', 1), skill('skill.appraisal', 1), skill('skill.repair', 1)],
    traitIds: ['trait.steady_hands', 'trait.material_eye'],
    inventoryBonuses: [stack('tool_roll', 1), stack('whetstone', 1)],
    currencyBonus: coin(17, 5, 0)
  }),
  createBackstory({
    id: 'background.dwarf.delver_scout',
    label: 'Delver Scout',
    description: 'You learned to read stone, air, and danger long before anyone else stepped into a shaft.',
    notes: notes('+5% hazard detection underground.', 'survey crews', 'ore tunnels'),
    lineageIds: ['lineage.dwarf'],
    startAccessBackgroundId: 'background.wayfinder_apprentice',
    jobId: 'job.delver_scout',
    attributeAdjustments: { WIS: 1, INT: 1, CHA: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.survival', 1), skill('skill.appraisal', 1)],
    traitIds: ['trait.fieldwise', 'trait.stone_sense'],
    inventoryBonuses: [stack('lantern', 1), stack('pickaxe', 1)],
    currencyBonus: coin(15, 4, 0)
  }),
  createBackstory({
    id: 'background.dwarf.cask_teamster',
    label: 'Cask Teamster',
    description: 'Cart yards and cellar lanes taught you freight balance, route timing, and stubborn patience.',
    notes: notes('+5% load stability on caravan starts.', 'brew halls', 'teamster guilds'),
    lineageIds: ['lineage.dwarf'],
    startAccessBackgroundId: 'background.harbor_runner',
    jobId: 'job.cask_teamster',
    attributeAdjustments: { CON: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.mercantile', 1)],
    traitIds: ['trait.pack_sense', 'trait.route_memory'],
    inventoryBonuses: [stack('rope_coil', 1), stack('ration_pack', 1)],
    currencyBonus: coin(16, 4, 2)
  }),
  createBackstory({
    id: 'background.half_troll.pit_bruiser',
    label: 'Pit Bruiser',
    description: 'Crowded rings and rough crowds taught you how to stay standing and end a fight fast.',
    notes: notes('+5% stagger chance on the opening exchange.', 'fighting pits', 'crowd handlers'),
    lineageIds: ['lineage.half_troll'],
    startAccessBackgroundId: 'background.militia_retainer',
    jobId: 'job.pit_bruiser',
    attributeAdjustments: { STR: 1, CON: 1, INT: -1 },
    skillBonuses: [skill('skill.defense.guard', 1), skill('skill.endurance', 1)],
    traitIds: ['trait.bruiser', 'trait.crowd_hardened'],
    inventoryBonuses: [stack('bandage', 2), stack('dried_meat_pack', 1)],
    currencyBonus: coin(10, 4, 2)
  }),
  createBackstory({
    id: 'background.half_troll.bridge_keeper_kin',
    label: "Bridge Keeper's Kin",
    description: 'Toll ledgers, river threats, and stubborn disputes were part of your family trade.',
    notes: notes('+5% block and shove strength on bridges or narrow lanes.', 'toll keeps', 'river checkpoints'),
    lineageIds: ['lineage.half_troll'],
    startAccessBackgroundId: 'background.ledger_apprentice',
    jobId: 'job.bridge_keeper_kin',
    attributeAdjustments: { WIS: 1, CON: 1, CHA: -1 },
    skillBonuses: [skill('skill.appraisal', 1), skill('skill.defense.guard', 1), skill('skill.mercantile', 1)],
    traitIds: ['trait.watchful', 'trait.steady_feet'],
    inventoryBonuses: [stack('sealed_contract', 1), stack('rope_coil', 1)],
    currencyBonus: coin(14, 4, 0)
  }),
  createBackstory({
    id: 'background.half_troll.swamp_outcast',
    label: 'Swamp Outcast',
    description: 'Marsh channels and cold camps taught you to read rot, water, and where not to step.',
    notes: notes('+5% poison resistance in the opening chapters.', 'marsh camps', 'forager tracks'),
    lineageIds: ['lineage.half_troll'],
    startAccessBackgroundId: 'background.wayfinder_apprentice',
    jobId: 'job.swamp_outcast',
    attributeAdjustments: { WIS: 1, AGI: 1, CHA: -1 },
    skillBonuses: [skill('skill.survival', 1), skill('skill.foraging', 1), skill('skill.navigation', 1)],
    traitIds: ['trait.swampwise', 'trait.fieldwise'],
    inventoryBonuses: [stack('herb_knife', 1), stack('ration_pack', 1)],
    currencyBonus: coin(9, 5, 1)
  }),
  createBackstory({
    id: 'background.half_troll.bog_ferry_loader',
    label: 'Bog Ferry Loader',
    description: 'Flatboats, cargo poles, and rough river work made you strong, practical, and hard to surprise.',
    notes: notes('+5% stamina while hauling or ferrying cargo.', 'bog ferries', 'river barges'),
    lineageIds: ['lineage.half_troll'],
    startAccessBackgroundId: 'background.harbor_runner',
    jobId: 'job.bog_ferry_loader',
    attributeAdjustments: { STR: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.endurance', 1)],
    traitIds: ['trait.quick_hands', 'trait.pack_sense'],
    inventoryBonuses: [stack('rope_coil', 1), stack('dried_fish', 2)],
    currencyBonus: coin(13, 4, 1)
  }),
  createBackstory({
    id: 'background.half_orc.border_guard',
    label: 'Border Guard',
    description: 'Fence lines, patrol fires, and sudden alarms taught you to meet violence with discipline.',
    notes: notes('+5% first-contact detection near roads and gates.', 'march forts', 'frontier towers'),
    lineageIds: ['lineage.half_orc'],
    startAccessBackgroundId: 'background.militia_retainer',
    jobId: 'job.border_guard',
    attributeAdjustments: { STR: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.weapon.polearm', 1), skill('skill.defense.guard', 1)],
    traitIds: ['trait.watchful', 'trait.drill_hardened'],
    inventoryBonuses: [stack('bandage', 2), stack('whetstone', 1)],
    currencyBonus: coin(12, 3, 2)
  }),
  createBackstory({
    id: 'background.half_orc.iron_legate',
    label: 'Iron Legate',
    description: 'You were trained to carry demands, reckon dues, and keep a stronger face than the room around you.',
    notes: notes('+5% intimidation on formal demands and debt collection.', 'mercenary ledgers', 'trade houses'),
    lineageIds: ['lineage.half_orc'],
    startAccessBackgroundId: 'background.ledger_apprentice',
    jobId: 'job.iron_legate',
    attributeAdjustments: { CHA: 1, INT: 1, AGI: -1 },
    skillBonuses: [skill('skill.mercantile', 1), skill('skill.appraisal', 1), skill('skill.etiquette', 1)],
    traitIds: ['trait.hard_bargainer', 'trait.ledger_mind'],
    inventoryBonuses: [stack('sealed_contract', 1), stack('trade_scales', 1)],
    currencyBonus: coin(21, 5, 0)
  }),
  createBackstory({
    id: 'background.half_orc.clan_exile',
    label: 'Clan Exile',
    description: 'The road taught you self-reliance, caution, and how to keep moving without sympathy.',
    notes: notes('+5% evasion on the first day after arriving in a new region.', 'road camps', 'wilderness trails'),
    lineageIds: ['lineage.half_orc'],
    startAccessBackgroundId: 'background.wayfinder_apprentice',
    jobId: 'job.clan_exile',
    attributeAdjustments: { AGI: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.survival', 1), skill('skill.tracking', 1), skill('skill.navigation', 1)],
    traitIds: ['trait.route_memory', 'trait.hard_to_corner'],
    inventoryBonuses: [stack('ration_pack', 1), stack('travel_cloak', 1)],
    currencyBonus: coin(10, 4, 2)
  }),
  createBackstory({
    id: 'background.half_orc.caravan_enforcer',
    label: 'Caravan Enforcer',
    description: 'Long trains and tight margins taught you when to talk, when to stare, and when to swing.',
    notes: notes('+5% threat generation while protecting allied freight.', 'caravan guards', 'warehouse yards'),
    lineageIds: ['lineage.half_orc'],
    startAccessBackgroundId: 'background.harbor_runner',
    jobId: 'job.caravan_enforcer',
    attributeAdjustments: { STR: 1, CHA: 1, INT: -1 },
    skillBonuses: [skill('skill.defense.guard', 1), skill('skill.mercantile', 1)],
    traitIds: ['trait.pack_sense', 'trait.hard_bargainer'],
    inventoryBonuses: [stack('rope_coil', 1), stack('dried_meat_pack', 1)],
    currencyBonus: coin(16, 4, 0)
  }),
  createBackstory({
    id: 'background.half_goblin.tunnel_sapper',
    label: 'Tunnel Sapper',
    description: 'Collapsed routes and cramped fights taught you how to work under pressure and in bad air.',
    notes: notes('+5% stagger resistance in enclosed spaces.', 'sapper crews', 'breach teams'),
    lineageIds: ['lineage.half_goblin'],
    startAccessBackgroundId: 'background.militia_retainer',
    jobId: 'job.tunnel_sapper',
    attributeAdjustments: { AGI: 1, INT: 1, CHA: -1 },
    skillBonuses: [skill('skill.weapon.throwing', 1), skill('skill.repair', 1)],
    traitIds: ['trait.quick_hands', 'trait.crowd_hardened'],
    inventoryBonuses: [stack('lantern', 1), stack('bandage', 1)],
    currencyBonus: coin(10, 5, 1)
  }),
  createBackstory({
    id: 'background.half_goblin.tinker_apprentice',
    label: 'Tinker Apprentice',
    description: 'Scrap bins and tiny mechanisms taught you how to see value in broken things.',
    notes: notes('+5% repair speed on low-tier gear.', 'tinker rows', 'repair stalls'),
    lineageIds: ['lineage.half_goblin'],
    startAccessBackgroundId: 'background.ledger_apprentice',
    jobId: 'job.tinker_apprentice',
    attributeAdjustments: { INT: 1, DEX: 1, STR: -1 },
    skillBonuses: [skill('skill.repair', 1), skill('skill.appraisal', 1), skill('skill.crafting', 1)],
    traitIds: ['trait.steady_hands', 'trait.material_eye'],
    inventoryBonuses: [stack('tool_roll', 1), stack('wax_thread', 1)],
    currencyBonus: coin(18, 5, 0)
  }),
  createBackstory({
    id: 'background.half_goblin.scrap_runner',
    label: 'Scrap Runner',
    description: 'Fast feet and hungry eyes kept you alive on the edge of salvage lanes and refuse heaps.',
    notes: notes('+5% salvage yield from mundane wreckage.', 'salvage yards', 'outer ruins'),
    lineageIds: ['lineage.half_goblin'],
    startAccessBackgroundId: 'background.wayfinder_apprentice',
    jobId: 'job.scrap_runner',
    attributeAdjustments: { AGI: 1, WIS: 1, CHA: -1 },
    skillBonuses: [skill('skill.survival', 1), skill('skill.appraisal', 1), skill('skill.stealth', 1)],
    traitIds: ['trait.low_profile', 'trait.fieldwise'],
    inventoryBonuses: [stack('marker_chalk', 1), stack('throwing_knife', 1)],
    currencyBonus: coin(12, 6, 1)
  }),
  createBackstory({
    id: 'background.half_goblin.dockside_cutpurse',
    label: 'Dockside Cutpurse',
    description: 'Busy quays and distracted merchants taught you exactly when hands become quicker than eyes.',
    notes: notes('+5% dodge after disengaging from melee.', 'dock alleys', 'market piers'),
    lineageIds: ['lineage.half_goblin'],
    startAccessBackgroundId: 'background.harbor_runner',
    jobId: 'job.dockside_cutpurse',
    attributeAdjustments: { AGI: 1, CHA: 1, STR: -1 },
    skillBonuses: [skill('skill.stealth', 1), skill('skill.navigation', 1), skill('skill.mercantile', 1)],
    traitIds: ['trait.quick_hands', 'trait.low_profile'],
    inventoryBonuses: [stack('rope_coil', 1), stack('sealed_contract', 1)],
    currencyBonus: coin(15, 6, 2)
  }),
  createBackstory({
    id: 'background.half_merfolk.shoal_guard',
    label: 'Shoal Guard',
    description: 'Tide barriers, warning buoys, and reef warding shaped your first sense of duty.',
    notes: notes('+5% guard strength near water or slick terrain.', 'shoal towers', 'coastal wardens'),
    lineageIds: ['lineage.half_merfolk'],
    startAccessBackgroundId: 'background.militia_retainer',
    jobId: 'job.shoal_guard',
    attributeAdjustments: { WIS: 1, CON: 1, CHA: -1 },
    skillBonuses: [skill('skill.defense.guard', 1), skill('skill.innate.swim', 1)],
    traitIds: ['trait.tidewise', 'trait.watchful'],
    inventoryBonuses: [stack('bandage', 1), stack('rope_coil', 1)],
    currencyBonus: coin(12, 4, 1)
  }),
  createBackstory({
    id: 'background.half_merfolk.wreck_registrar',
    label: 'Wreck Registrar',
    description: 'You learned to catalogue salvage, weigh claims, and recognize the value of a drowned cargo hold.',
    notes: notes('+5% value on the first salvaged rare item sold.', 'salvage courts', 'harbor clerks'),
    lineageIds: ['lineage.half_merfolk'],
    startAccessBackgroundId: 'background.ledger_apprentice',
    jobId: 'job.wreck_registrar',
    attributeAdjustments: { INT: 1, WIS: 1, STR: -1 },
    skillBonuses: [skill('skill.appraisal', 1), skill('skill.inscription', 1), skill('skill.navigation', 1)],
    traitIds: ['trait.ledger_mind', 'trait.salvage_eye'],
    inventoryBonuses: [stack('ink_vial', 1), stack('survey_note', 1)],
    currencyBonus: coin(20, 5, 0)
  }),
  createBackstory({
    id: 'background.half_merfolk.reef_gatherer',
    label: 'Reef Gatherer',
    description: 'Shallow shelves and cold channels taught you patience, breath control, and careful harvest work.',
    notes: notes('+5% coastal gather yield.', 'reef shelves', 'gathering skiffs'),
    lineageIds: ['lineage.half_merfolk'],
    startAccessBackgroundId: 'background.wayfinder_apprentice',
    jobId: 'job.reef_gatherer',
    attributeAdjustments: { WIS: 1, AGI: 1, CHA: -1 },
    skillBonuses: [skill('skill.foraging', 1), skill('skill.innate.swim', 1), skill('skill.navigation', 1)],
    traitIds: ['trait.fieldwise', 'trait.tidewise'],
    inventoryBonuses: [stack('herb_knife', 1), stack('dried_fish', 1)],
    currencyBonus: coin(13, 5, 1)
  }),
  createBackstory({
    id: 'background.half_merfolk.coastal_drifter',
    label: 'Coastal Drifter',
    description: 'You moved between jetties, tide villages, and whatever work a shoreline would tolerate.',
    notes: notes('+5% stamina recovery near water.', 'ferry slips', 'coastal camps'),
    lineageIds: ['lineage.half_merfolk'],
    startAccessBackgroundId: 'background.harbor_runner',
    jobId: 'job.coastal_drifter',
    attributeAdjustments: { AGI: 1, WIS: 1, STR: -1 },
    skillBonuses: [skill('skill.navigation', 1), skill('skill.innate.swim', 1), skill('skill.mercantile', 1)],
    traitIds: ['trait.tidewise', 'trait.quick_hands'],
    inventoryBonuses: [stack('rope_coil', 1), stack('dried_fish', 2)],
    currencyBonus: coin(16, 4, 2)
  })
];

export const STARTER_BACKSTORY_TEMPLATES: Record<string, StarterBackstoryTemplate> = Object.fromEntries(
  BACKSTORY_DEFINITIONS.map((template) => [template.id, template])
);

export function isKnownLineageId(lineageId: string): boolean {
  return lineageId in PLAYER_LINEAGE_PROFILES;
}

export function getLineageIdentityCatalog(lineageId: string): LineageIdentityCatalog | null {
  return LINEAGE_IDENTITY_CATALOGS[lineageId] ?? null;
}

export function getIdentityOptionLabel(
  lineageId: string,
  category: keyof Pick<LineageIdentityCatalog, 'buildOptions' | 'skinToneOptions' | 'hairColorOptions' | 'hairHighlightOptions' | 'eyeColorOptions'>,
  optionId: string
): string | null {
  const catalog = getLineageIdentityCatalog(lineageId);

  if (!catalog || !optionId) {
    return null;
  }

  return catalog[category].find((entry) => entry.id === optionId)?.label ?? null;
}

export function getBackstoryOptionsForLineage(lineageId: string): CharacterCreationOption[] {
  if (!lineageId) {
    return [];
  }

  return BACKSTORY_DEFINITIONS.filter((template) => template.lineageIds.includes(lineageId)).map((template) => ({
    id: template.id,
    label: template.label,
    description: template.description,
    notes: template.notes
  }));
}

export function isCompatibleBackstorySelection(lineageId: string, backstoryId: string): boolean {
  if (!backstoryId) {
    return false;
  }

  const backstory = STARTER_BACKSTORY_TEMPLATES[backstoryId];
  return Boolean(backstory && backstory.lineageIds.includes(lineageId));
}

export function getPathTemplate(pathId: string): StarterPathTemplate {
  return STARTER_PATH_TEMPLATES[pathId] ?? STARTER_PATH_TEMPLATES['class.explorer']!;
}

export function getBackstoryTemplate(backstoryId: string): StarterBackstoryTemplate {
  return STARTER_BACKSTORY_TEMPLATES[backstoryId] ?? STARTER_BACKSTORY_TEMPLATES[DEFAULT_BACKSTORY_ID]!;
}

export function getBackstoryStartAccessProfileId(backstoryId: string): string {
  return STARTER_BACKSTORY_TEMPLATES[backstoryId]?.startAccessBackgroundId ?? DEFAULT_START_ACCESS_BACKGROUND_ID;
}

export function isKnownPathId(pathId: string): boolean {
  return pathId in STARTER_PATH_TEMPLATES;
}
