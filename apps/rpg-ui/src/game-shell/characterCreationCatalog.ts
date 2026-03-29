import {
  PLAYER_LINEAGE_PROFILES,
  type InventoryStack,
  type PlayerAttributeAdjustments,
  type PlayerAttributes,
  type PlayerCurrencyState,
  type PlayerIdentityBuildId,
  type PlayerSkillState,
  type PlayerSexId
} from "../../../../packages/shared/types/src/index.js";
import {
  STARTER_CLASS_TEMPLATES,
  type CharacterCreationOption,
  type StarterClassTemplate
} from "./starterTemplates.js";
import type { ResolvedWorldSelection } from "./worldSelectionCatalog.js";

export type HeightBandId = "short" | "normal" | "tall";
export type BackstoryArchetypeId =
  | "local"
  | "vagabond"
  | "exile"
  | "merchant"
  | "craftsman"
  | "performer"
  | "minor_noble";

type IdentityCollectionKey = "skinToneOptions" | "hairColorOptions" | "eyeColorOptions";
type IdentityPaletteTone = "skin" | "hair" | "eye";

type LineageIdentitySeed = {
  heightRangeCm: [number, number];
  skinToneOptions: IdentityPaletteOption[];
  hairColorOptions: IdentityPaletteOption[];
  eyeColorOptions: IdentityPaletteOption[];
};

type LineageFlavor = {
  vagabondOrigin: string;
  vagabondMotives: string;
  localFamily: string;
  localUncommonFamily: string;
  localUpbringing: string;
  exileCause: string;
  merchantHouse: string;
  craftsmanTraining: string;
  performerCircles: string;
  nobleFamily: string;
  nobleUncommonFamily: string;
};

type BackstoryMechanics = {
  startAccessProfileId: string;
  jobId: string;
  attributeAdjustments: PlayerAttributeAdjustments;
  skillBonuses: PlayerSkillState[];
  traitIds: string[];
  inventoryBonuses: InventoryStack[];
  currencyBonus: PlayerCurrencyState;
  passiveBonusLabel: string;
};

type LineagePresentation = {
  label: string;
  description: string;
  stats: string;
  notes: string[];
};

type NamePool = {
  male: string[];
  female: string[];
  surnames: string[];
};

export interface SwatchPresentation {
  background: string;
  foreground: string;
  border: string;
}

export interface HeightBandOption {
  id: HeightBandId;
  label: string;
  description: string;
  attributeAdjustments: PlayerAttributeAdjustments;
}

export interface BuildOption {
  id: PlayerIdentityBuildId;
  label: string;
  description: string;
  attributeAdjustments: PlayerAttributeAdjustments;
}

export interface IdentityPaletteOption {
  id: string;
  label: string;
  description: string;
  swatch?: SwatchPresentation;
}

export interface LineageIdentityCatalog {
  lineageId: string;
  lineageLabel: string;
  heightRangeCm: [number, number];
  heightBands: HeightBandOption[];
  buildOptions: BuildOption[];
  skinToneOptions: IdentityPaletteOption[];
  hairColorOptions: IdentityPaletteOption[];
  eyeColorOptions: IdentityPaletteOption[];
}

export interface LineageCardArt {
  imageUrl: string;
  backgroundPosition?: string;
}

export interface StarterBackstoryTemplate extends CharacterCreationOption {
  archetypeId: BackstoryArchetypeId;
  hookLine: string;
  narrativeParagraphs: [string, string];
  passiveBonusLabel: string;
  varianceLines: string[];
  jobId: string;
  attributeAdjustments: PlayerAttributeAdjustments;
  skillBonuses: PlayerSkillState[];
  traitIds: string[];
  inventoryBonuses: InventoryStack[];
  currencyBonus: PlayerCurrencyState;
  startAccessProfileId: string;
}

const PLAYABLE_LINEAGE_IDS = [
  "lineage.human",
  "lineage.dwarf",
  "lineage.gnome",
  "lineage.halfling",
  "lineage.elf",
  "lineage.dark_elf",
  "lineage.half_troll",
  "lineage.half_orc",
  "lineage.half_goblin",
  "lineage.half_merfolk"
] as const;

const DEFAULT_ATTRIBUTE_BASELINE: PlayerAttributes = {
  STR: 10,
  DEX: 10,
  AGI: 10,
  CON: 10,
  VIT: 10,
  WIS: 10,
  INT: 10,
  SPT: 10,
  CHA: 10
};

const ATTRIBUTE_KEYS = Object.keys(DEFAULT_ATTRIBUTE_BASELINE) as Array<keyof PlayerAttributes>;

const HEIGHT_BANDS: HeightBandOption[] = [
  {
    id: "short",
    label: "Short",
    description: "Shorter and quicker for the lineage. +1 AGI, -1 STR.",
    attributeAdjustments: { AGI: 1, STR: -1 }
  },
  {
    id: "normal",
    label: "Normal",
    description: "Near the usual middle height for this lineage. No attribute change.",
    attributeAdjustments: {}
  },
  {
    id: "tall",
    label: "Tall",
    description: "Taller and longer-limbed for the lineage. +1 STR, -1 AGI.",
    attributeAdjustments: { STR: 1, AGI: -1 }
  }
];

const BUILD_OPTIONS: BuildOption[] = [
  {
    id: "petite",
    label: "Petite",
    description: "Light-framed and precise. +1 DEX, -1 STR.",
    attributeAdjustments: { DEX: 1, STR: -1 }
  },
  {
    id: "slim",
    label: "Slim",
    description: "Lean and quick-footed. +1 AGI, -1 CON.",
    attributeAdjustments: { AGI: 1, CON: -1 }
  },
  {
    id: "average",
    label: "Average",
    description: "Balanced build with no attribute change.",
    attributeAdjustments: {}
  },
  {
    id: "muscular",
    label: "Muscular",
    description: "Powerful and dense with less fine control. +1 STR, -1 DEX.",
    attributeAdjustments: { STR: 1, DEX: -1 }
  },
  {
    id: "stocky",
    label: "Stocky",
    description: "Compact and durable with less nimble movement. +1 CON, -1 AGI.",
    attributeAdjustments: { CON: 1, AGI: -1 }
  },
  {
    id: "heavy",
    label: "Heavy",
    description: "Broad and hard to wear down, but less mobile. +1 VIT, -1 AGI.",
    attributeAdjustments: { VIT: 1, AGI: -1 }
  },
  {
    id: "scholarly",
    label: "Scholarly",
    description: "Book-shaped posture and a trained mind. +1 INT, -1 STR.",
    attributeAdjustments: { INT: 1, STR: -1 }
  },
  {
    id: "mystic",
    label: "Mystic",
    description: "Quietly centered and inwardly attuned. +1 SPT, -1 CON.",
    attributeAdjustments: { SPT: 1, CON: -1 }
  },
  {
    id: "poised",
    label: "Poised",
    description: "Composed presence and practiced social grace. +1 CHA, -1 VIT.",
    attributeAdjustments: { CHA: 1, VIT: -1 }
  }
];

const PATH_OVERRIDES: Record<string, Pick<StarterClassTemplate, "label" | "description" | "notes">> = {
  "class.explorer": {
    label: "Scout",
    description: "A practical road-wise path shaped by reconnaissance, travel craft, and field survival.",
    notes: ["Progresses toward swift travel, observation, and adaptable routecraft."]
  },
  "class.warrior": {
    label: "Warrior",
    description: "A martial path built on discipline, weapon confidence, and direct battlefield presence.",
    notes: ["Progresses toward frontline resilience, pressure, and guarded offense."]
  },
  "class.arcanist": {
    label: "Enchanter",
    description: "A mystical path devoted to crafted power, reserve control, and disciplined elemental shaping.",
    notes: ["Progresses toward crystal work, focus, and magical throughput."]
  },
  "class.artisan": {
    label: "Craftsman",
    description: "A maker's path centered on useful workmanship, repair, and patient mastery of material.",
    notes: ["Progresses toward utility, quality work, and practical invention."]
  },
  "class.merchant": {
    label: "Trader",
    description: "A commercial path guided by value, timing, and the leverage of negotiated advantage.",
    notes: ["Progresses toward bargaining strength, appraisal, and market influence."]
  },
  "class.mariner": {
    label: "Hunter",
    description: "A pursuing path shaped by endurance, patience, and the calm pressure of a practiced chase.",
    notes: ["Progresses toward pursuit stamina, ranged discipline, and relentless field craft."]
  }
};

const PATH_TEMPLATE_FALLBACK = "class.explorer";

const PATH_TEMPLATES: Record<string, StarterClassTemplate> = Object.fromEntries(
  Object.entries(STARTER_CLASS_TEMPLATES).map(([id, template]) => [
    id,
    {
      ...template,
      ...(PATH_OVERRIDES[id] ?? {})
    }
  ])
);

function stack(itemKey: string, quantity: number): InventoryStack {
  return {
    itemId: `item.${itemKey}`,
    itemKey,
    quantity
  };
}

function skill(id: string, rank: number): PlayerSkillState {
  return {
    id,
    rank,
    source: "trained"
  };
}

function paletteOption(
  id: string,
  label: string,
  description: string,
  background: string,
  foreground = "#f8fafc",
  border = "rgba(255,255,255,0.22)"
): IdentityPaletteOption {
  return {
    id,
    label,
    description,
    swatch: {
      background,
      foreground,
      border
    }
  };
}

function parseHexColor(
  value: string | undefined
): { r: number; g: number; b: number } | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  const shortMatch = normalized.match(/^#([0-9a-f]{3})$/i);
  const longMatch = normalized.match(/^#([0-9a-f]{6})$/i);

  if (shortMatch) {
    const [r, g, b] = shortMatch[1]!.split("");
    return {
      r: Number.parseInt(`${r}${r}`, 16),
      g: Number.parseInt(`${g}${g}`, 16),
      b: Number.parseInt(`${b}${b}`, 16)
    };
  }

  if (!longMatch) {
    return null;
  }

  return {
    r: Number.parseInt(longMatch[1]!.slice(0, 2), 16),
    g: Number.parseInt(longMatch[1]!.slice(2, 4), 16),
    b: Number.parseInt(longMatch[1]!.slice(4, 6), 16)
  };
}

function rgbToHsl(
  red: number,
  green: number,
  blue: number
): { hue: number; saturation: number; lightness: number } {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return {
      hue: 0,
      saturation: 0,
      lightness
    };
  }

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  switch (max) {
    case r:
      hue = (g - b) / delta + (g < b ? 6 : 0);
      break;
    case g:
      hue = (b - r) / delta + 2;
      break;
    default:
      hue = (r - g) / delta + 4;
      break;
  }

  return {
    hue: hue * 60,
    saturation,
    lightness
  };
}

function getPaletteSortKey(
  option: IdentityPaletteOption,
  tone: IdentityPaletteTone
): [number, number, number, string] {
  const swatch = parseHexColor(option.swatch?.background);

  if (!swatch) {
    return [99, 99, 99, option.label];
  }

  const { hue, saturation, lightness } = rgbToHsl(swatch.r, swatch.g, swatch.b);

  if (tone === "skin") {
    return [0, -lightness, hue, option.label];
  }

  if (saturation < 0.12) {
    if (lightness <= 0.16) {
      return [0, 0, lightness, option.label];
    }
    if (lightness >= 0.8) {
      return [8, 0, -lightness, option.label];
    }
    return [7, 0, -lightness, option.label];
  }

  const hueGroup =
    hue < 45 || hue >= 330
      ? 1
      : hue < 70
        ? 2
        : hue < 150
          ? 3
          : hue < 205
            ? 4
            : hue < 265
              ? 5
              : 6;

  return [hueGroup, hue, -lightness, option.label];
}

function sortIdentityPaletteOptions(
  options: IdentityPaletteOption[],
  tone: IdentityPaletteTone
): IdentityPaletteOption[] {
  return [...options].sort((left, right) => {
    const leftKey = getPaletteSortKey(left, tone);
    const rightKey = getPaletteSortKey(right, tone);

    for (let index = 0; index < leftKey.length; index += 1) {
      if (leftKey[index] === rightKey[index]) {
        continue;
      }

      return leftKey[index]! < rightKey[index]! ? -1 : 1;
    }

    return 0;
  });
}

function createAttributeSet(
  values: Partial<PlayerAttributes> = {}
): PlayerAttributes {
  return {
    ...DEFAULT_ATTRIBUTE_BASELINE,
    ...values
  };
}

function parseLineageStatBlock(value: string): PlayerAttributes {
  const parsed = Array.from(value.matchAll(/([A-Z]{3})\s+(\d+)/g)).reduce<
    Partial<PlayerAttributes>
  >((result, match) => {
    const key = match[1] as keyof PlayerAttributes | undefined;
    const numericValue = Number.parseInt(match[2] ?? "", 10);

    if (!key || Number.isNaN(numericValue) || !ATTRIBUTE_KEYS.includes(key)) {
      return result;
    }

    result[key] = numericValue;
    return result;
  }, {});

  return createAttributeSet(parsed);
}

function buildAttributeAdjustmentsFromTemplate(
  attributes: PlayerAttributes
): PlayerAttributeAdjustments {
  return ATTRIBUTE_KEYS.reduce<PlayerAttributeAdjustments>((result, key) => {
    const delta = attributes[key] - DEFAULT_ATTRIBUTE_BASELINE[key];

    if (delta !== 0) {
      result[key] = delta;
    }

    return result;
  }, {});
}

function titleCase(value: string): string {
  return value
    .split(/[_\s-]+/)
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(" ");
}

function humanizeId(value: string): string {
  const segments = value.split(".");
  return titleCase(segments[segments.length - 1] ?? value);
}

function formatNarrativeList(values: string[], fallback: string): string {
  const filtered = values.filter((value) => value.trim().length > 0);

  if (filtered.length === 0) {
    return fallback;
  }
  if (filtered.length === 1) {
    return filtered[0]!;
  }
  if (filtered.length === 2) {
    return `${filtered[0]} and ${filtered[1]}`;
  }

  return `${filtered.slice(0, -1).join(", ")}, and ${filtered[filtered.length - 1]}`;
}

function pickDeterministic<T>(values: readonly T[], seed: string): T {
  const hash = Array.from(seed).reduce((total, character, index) => {
    return total + character.charCodeAt(0) * (index + 1);
  }, 0);

  return values[Math.abs(hash) % values.length]!;
}

function getLineageKey(lineageId: string): string {
  const segments = lineageId.split(".");
  return segments[segments.length - 1] ?? lineageId;
}

function getBackstoryId(lineageId: string, archetypeId: BackstoryArchetypeId): string {
  return `background.${getLineageKey(lineageId)}.${archetypeId}`;
}

function parseBackstoryId(
  backgroundId: string
): { lineageId: string; archetypeId: BackstoryArchetypeId } | null {
  const segments = backgroundId.split(".");

  if (segments.length !== 3 || segments[0] !== "background") {
    return null;
  }

  const lineageId = `lineage.${segments[1]}`;
  const archetypeId = segments[2] as BackstoryArchetypeId;

  if (!PLAYABLE_LINEAGE_IDS.includes(lineageId as (typeof PLAYABLE_LINEAGE_IDS)[number])) {
    return null;
  }
  if (!BACKSTORY_ARCHETYPE_ORDER.includes(archetypeId)) {
    return null;
  }

  return {
    lineageId,
    archetypeId
  };
}

const COMMON_SKIN_TONES = [
  paletteOption("skin.fair", "Fair", "A lighter skin tone.", "#dcb8a4", "#22150f"),
  paletteOption("skin.warm", "Warm", "A warm mid-tone complexion.", "#c59367", "#23150b"),
  paletteOption("skin.olive", "Olive", "An olive-brown complexion.", "#9f7753", "#fff7ed"),
  paletteOption("skin.deep", "Deep", "A rich deep-brown complexion.", "#6e4732"),
  paletteOption("skin.ashen", "Ashen", "A cooler pale complexion.", "#c8beb8", "#1f1916"),
  paletteOption("skin.sunlit", "Sunlit", "A warm sun-touched complexion.", "#d7ab82", "#241408"),
  paletteOption("skin.sand", "Sand", "A dry golden-tan complexion.", "#b88860", "#241508"),
  paletteOption("skin.umber", "Umber", "A deep umber complexion.", "#5a3828"),
  paletteOption("skin.bronze", "Bronze", "A bronzed complexion with red warmth.", "#8f6247")
] as const;

const HUMAN_HAIR = [
  paletteOption("hair.black", "Black", "Dark black hair.", "#181310"),
  paletteOption("hair.dark_brown", "Dark Brown", "Deep brown hair.", "#4b301f"),
  paletteOption("hair.brown", "Brown", "Balanced brown hair.", "#6e4930"),
  paletteOption("hair.auburn", "Auburn", "Brown-red hair.", "#8f4d32"),
  paletteOption("hair.blonde", "Blonde", "Golden blonde hair.", "#caa35f", "#201507"),
  paletteOption("hair.ash_blonde", "Ash Blonde", "Pale ash-blonde hair.", "#d9d0b2", "#1f1b12"),
  paletteOption("hair.chestnut", "Chestnut", "Warm chestnut hair.", "#7e4d33"),
  paletteOption("hair.walnut", "Walnut", "Dark walnut-brown hair.", "#593726"),
  paletteOption("hair.mahogany", "Mahogany", "Rich mahogany-red hair.", "#6f3528"),
  paletteOption("hair.russet", "Russet", "Dry russet-brown hair.", "#9b5b3b"),
  paletteOption("hair.copper_red", "Copper Red", "Bright copper-red hair.", "#b85d38"),
  paletteOption("hair.ginger", "Ginger", "Light ginger hair.", "#d2804f"),
  paletteOption("hair.sandy_blonde", "Sandy Blonde", "Dusty sandy-blonde hair.", "#cda974", "#1f1609"),
  paletteOption("hair.honey_blonde", "Honey Blonde", "Warm honey-blonde hair.", "#d7b36b", "#221708"),
  paletteOption("hair.platinum", "Platinum", "Bright platinum hair.", "#ece5d5", "#201c16"),
  paletteOption("hair.silver", "Silver", "Silver-gray hair.", "#c2c7cc", "#171b1f"),
  paletteOption("hair.white_blonde", "White Blonde", "Very pale white-blonde hair.", "#efe8d9", "#1f1b14"),
  paletteOption("hair.blue_black", "Blue Black", "Blue-cast black hair.", "#111926")
] as const;

const HUMAN_EYES = [
  paletteOption("eyes.brown", "Brown", "Earth-rich brown eyes.", "#5a3f27"),
  paletteOption("eyes.hazel", "Hazel", "Brown-green eyes.", "#8c6e37"),
  paletteOption("eyes.gray", "Gray", "Cool gray eyes.", "#9aa4b2", "#121923"),
  paletteOption("eyes.blue", "Blue", "Clear blue eyes.", "#6794cf", "#102032"),
  paletteOption("eyes.green", "Green", "Bright green eyes.", "#5e8d4e"),
  paletteOption("eyes.amber", "Amber", "Warm amber eyes.", "#cb9a44", "#231608"),
  paletteOption("eyes.deep_brown", "Deep Brown", "Very dark brown eyes.", "#3f2a1b"),
  paletteOption("eyes.steel_blue", "Steel Blue", "Muted steel-blue eyes.", "#6f86a4", "#13202d"),
  paletteOption("eyes.sea_green", "Sea Green", "Cool blue-green eyes.", "#4f8d80")
] as const;

const ELVEN_SKIN = [
  paletteOption("skin.moon", "Moon", "Very pale skin with cool undertones.", "#efe5dd", "#221915"),
  paletteOption("skin.willow", "Willow", "Soft beige with woodland warmth.", "#ccb396", "#23170f"),
  paletteOption("skin.sun", "Sun Gold", "Warm golden tan.", "#bf9660", "#241608"),
  paletteOption("skin.cedar", "Cedar", "Deep graceful brown.", "#7f5b43"),
  paletteOption("skin.dew", "Dew Fair", "A pale dew-lit complexion.", "#f3ece5", "#201612"),
  paletteOption("skin.dawn", "Dawn Rose", "Soft rose-beige skin.", "#ddc1b0", "#231610"),
  paletteOption("skin.amberleaf", "Amberleaf", "A bright amber-tan complexion.", "#b78958", "#241407"),
  paletteOption("skin.hazelwood", "Hazelwood", "A warm hazel-brown complexion.", "#946748"),
  paletteOption("skin.dusk_gold", "Dusk Gold", "Golden-brown skin with cool undertones.", "#a67a59")
] as const;

const ELVEN_HAIR = [
  paletteOption("hair.silver", "Silver", "Silvery white hair.", "#d7d9e0", "#1b1f28"),
  paletteOption("hair.honey", "Honey", "Fine gold hair.", "#d5b36b", "#201506"),
  paletteOption("hair.copper", "Copper", "Elegant copper-red hair.", "#b3613d"),
  paletteOption("hair.raven", "Raven", "Midnight-dark hair.", "#171a24"),
  paletteOption("hair.white", "White", "Pure white hair.", "#f2f3ef", "#1b1b18"),
  paletteOption("hair.chestnut", "Chestnut", "Chestnut brown hair.", "#7d4d36"),
  paletteOption("hair.moon_blonde", "Moon Blonde", "Pale moonlit blonde hair.", "#e1d7b8", "#1f1a12"),
  paletteOption("hair.pale_gold", "Pale Gold", "Soft pale-gold hair.", "#ddc384", "#211609"),
  paletteOption("hair.ash_gold", "Ash Gold", "Muted ash-gold hair.", "#cfc4a0", "#1c1a13"),
  paletteOption("hair.rose_gold", "Rose Gold", "Rose-gold hair.", "#cfa08a", "#25140f"),
  paletteOption("hair.spring_green", "Spring Green", "Rare leaf-green hair.", "#748768"),
  paletteOption("hair.frost_blue", "Frost Blue", "Pale frost-blue hair.", "#b8c8d9", "#12202c"),
  paletteOption("hair.lilac_silver", "Lilac Silver", "Silver hair with lilac cast.", "#c8bed4", "#1c1a24"),
  paletteOption("hair.birch_brown", "Birch Brown", "Soft birch-brown hair.", "#8a6248"),
  paletteOption("hair.dusk_copper", "Dusk Copper", "Muted dusk-copper hair.", "#9e5e46"),
  paletteOption("hair.obsidian", "Obsidian", "Glass-dark obsidian hair.", "#11151d"),
  paletteOption("hair.pearl", "Pearl", "Pale pearl-white hair.", "#f2eee8", "#1d1a16"),
  paletteOption("hair.dawn_rose", "Dawn Rose", "A soft pink-rose tone.", "#c8a3a8", "#251417")
] as const;

const ELVEN_EYES = [
  paletteOption("eyes.amber", "Amber", "Luminous amber eyes.", "#d7a548", "#231609"),
  paletteOption("eyes.green", "Leaf Green", "Clear green eyes.", "#5d8f57"),
  paletteOption("eyes.blue", "Sky Blue", "Bright clear blue eyes.", "#7aa6d9", "#112030"),
  paletteOption("eyes.violet", "Violet", "Rare violet eyes.", "#8b6fb8"),
  paletteOption("eyes.silver", "Silver", "Pale silver eyes.", "#d6dce6", "#16202a"),
  paletteOption("eyes.gold", "Gold", "Bright gold eyes.", "#cfa43f", "#251808"),
  paletteOption("eyes.turquoise", "Turquoise", "Sea-bright turquoise eyes.", "#57a9a4"),
  paletteOption("eyes.copper", "Copper", "Warm copper eyes.", "#b97544"),
  paletteOption("eyes.moonstone", "Moonstone", "Cool moonstone-gray eyes.", "#b8c3d1", "#15202b")
] as const;

const DARK_ELF_SKIN = [
  paletteOption("skin.dusk", "Dusk Violet", "Muted violet-gray skin.", "#7b6a82"),
  paletteOption("skin.ash_brown", "Ash Brown", "Smoke-touched brown skin.", "#6a524b"),
  paletteOption("skin.obsidian", "Obsidian", "Near-black skin.", "#2b232d"),
  paletteOption("skin.umbral", "Umbral Brown", "Deep umber skin.", "#4d372f"),
  paletteOption("skin.shade", "Shade Gray", "Cool shadowed gray skin.", "#5a5868"),
  paletteOption("skin.moon_ash", "Moon Ash", "Pale ash-violet skin.", "#938494"),
  paletteOption("skin.storm_lilac", "Storm Lilac", "Storm-dark lilac skin.", "#645b78"),
  paletteOption("skin.midnight_umber", "Midnight Umber", "Dark umber skin with violet cast.", "#3f2f39"),
  paletteOption("skin.blue_ashen", "Blue Ash", "Ash-blue gray skin.", "#646c7d")
] as const;

const DARK_ELF_HAIR = [
  paletteOption("hair.ghost_white", "Ghost White", "Striking pale white hair.", "#f1f1ec", "#1d1b18"),
  paletteOption("hair.pale_silver", "Pale Silver", "Cold silver hair.", "#cdd5e4", "#16202c"),
  paletteOption("hair.blue_black", "Blue Black", "Blue-black hair.", "#0f1524"),
  paletteOption("hair.plum", "Plum", "Deep wine-dark hair.", "#4d3047"),
  paletteOption("hair.ink", "Ink", "Near-black ink-dark hair.", "#16131c"),
  paletteOption("hair.amethyst", "Amethyst", "Muted violet hair.", "#6e587d"),
  paletteOption("hair.pale_lilac", "Pale Lilac", "Pale lilac hair.", "#c4b8d2", "#1d1824"),
  paletteOption("hair.frost_blue", "Frost Blue", "Frosted blue-white hair.", "#bdcce0", "#14202e"),
  paletteOption("hair.slate", "Slate", "Dark slate-gray hair.", "#4c5464"),
  paletteOption("hair.dusk_rose", "Dusk Rose", "Dusky rose-purple hair.", "#936d7f"),
  paletteOption("hair.smoke_white", "Smoke White", "Smoky white hair.", "#ddd9d0", "#1b1815"),
  paletteOption("hair.indigo", "Indigo", "Deep indigo hair.", "#28375c"),
  paletteOption("hair.wine_red", "Wine Red", "Wine-dark red hair.", "#612d37"),
  paletteOption("hair.moonsteel", "Moonsteel", "Cold moonsteel silver hair.", "#b6c0d2", "#13202a"),
  paletteOption("hair.charcoal", "Charcoal", "Dense charcoal-black hair.", "#202128"),
  paletteOption("hair.orchid", "Orchid", "Muted orchid-purple hair.", "#83688f"),
  paletteOption("hair.bone_white", "Bone White", "Bone-pale hair.", "#e7dfd1", "#1d1813"),
  paletteOption("hair.sea_black", "Sea Black", "Wet sea-black hair.", "#101820")
] as const;

const DARK_ELF_EYES = [
  paletteOption("eyes.ruby", "Ruby", "Dark red eyes.", "#a33742"),
  paletteOption("eyes.violet", "Night Violet", "Purple eyes.", "#6f56a1"),
  paletteOption("eyes.silver", "Silver", "Cool pale eyes.", "#c7d0dd", "#17212c"),
  paletteOption("eyes.teal", "Teal", "Sea-dark blue-green eyes.", "#2e7d7d"),
  paletteOption("eyes.crimson", "Crimson", "Sharp crimson eyes.", "#a43a4f"),
  paletteOption("eyes.ice", "Ice", "Icy pale eyes.", "#dfe6f0", "#18202b"),
  paletteOption("eyes.ember", "Ember", "Smoldering ember-orange eyes.", "#c26b34"),
  paletteOption("eyes.indigo", "Indigo", "Indigo-dark eyes.", "#475990"),
  paletteOption("eyes.pale_gold", "Pale Gold", "Pale gold eyes.", "#d6c28e", "#231907")
] as const;

const DWARVEN_SKIN = [
  paletteOption("skin.granite", "Granite Fair", "Pale stone-like skin.", "#d5c2b5", "#271a14"),
  paletteOption("skin.hearth", "Hearth Bronze", "Warm bronze skin.", "#b7865c", "#27170d"),
  paletteOption("skin.iron", "Iron Olive", "Earthy olive-brown skin.", "#86654a"),
  paletteOption("skin.ember", "Ember Brown", "Deep brown skin with red warmth.", "#6d4a38"),
  paletteOption("skin.cairn", "Cairn", "Cool weathered stone skin.", "#a48f82", "#201713"),
  paletteOption("skin.oak", "Oak", "Weathered oak-brown skin.", "#8a6247"),
  paletteOption("skin.copper", "Copper", "Rich copper-bronze skin.", "#a66e4d"),
  paletteOption("skin.basalt", "Basalt", "Dark basalt-toned skin.", "#56443b"),
  paletteOption("skin.pale_ash", "Pale Ash", "Pale ash-stone skin.", "#c6b8ac", "#211611")
] as const;

const DWARVEN_HAIR = [
  paletteOption("hair.coal", "Coal", "Dense black hair.", "#14100d"),
  paletteOption("hair.chestnut", "Chestnut", "Rich forge-brown hair.", "#6a4027"),
  paletteOption("hair.copper", "Copper", "Deep copper-red hair.", "#a34d28"),
  paletteOption("hair.steel", "Steel Gray", "Cold gray hair.", "#9ea7ad", "#12161b"),
  paletteOption("hair.umber", "Umber", "Dark umber hair.", "#4d3427"),
  paletteOption("hair.sand", "Sand", "Dust-light brown hair.", "#c0a07d", "#24180d"),
  paletteOption("hair.iron_black", "Iron Black", "Iron-dark hair.", "#161719"),
  paletteOption("hair.tawny", "Tawny", "Tawny forge-brown hair.", "#9c714b"),
  paletteOption("hair.bronze", "Bronze", "Bronze-toned hair.", "#b36a34"),
  paletteOption("hair.ember_red", "Ember Red", "Ember-red hair.", "#b84e2e"),
  paletteOption("hair.silver_white", "Silver White", "Bright silver-white hair.", "#d7dbe0", "#151a20"),
  paletteOption("hair.slate_black", "Slate Black", "Slate-dark hair.", "#23262d"),
  paletteOption("hair.soot_brown", "Soot Brown", "Soot-brown hair.", "#5f473a"),
  paletteOption("hair.honey", "Honey", "Warm honey hair.", "#cfaa66", "#211607"),
  paletteOption("hair.frost_gray", "Frost Gray", "Pale frost-gray hair.", "#bec4c8", "#181b1d"),
  paletteOption("hair.brassy_blonde", "Brassy Blonde", "Brassy gold hair.", "#c8a05a", "#231507"),
  paletteOption("hair.cinnamon", "Cinnamon", "Cinnamon-red hair.", "#995537"),
  paletteOption("hair.storm_silver", "Storm Silver", "Storm-dark silver hair.", "#8f989f", "#161a1e")
] as const;

const DWARVEN_EYES = [
  paletteOption("eyes.deep_brown", "Deep Brown", "A steady dark brown.", "#5b4029"),
  paletteOption("eyes.slate", "Slate Gray", "Stone-gray eyes.", "#8d96a4", "#17202c"),
  paletteOption("eyes.hazel", "Hazel", "Brown-green eyes.", "#90713c"),
  paletteOption("eyes.gold", "Gold", "Ore-bright golden eyes.", "#c89b3a", "#261807"),
  paletteOption("eyes.green", "Green", "Dark green eyes.", "#59774d"),
  paletteOption("eyes.blue", "Blue", "Cool steel-blue eyes.", "#6985ac", "#102032"),
  paletteOption("eyes.copper", "Copper", "Copper-brown eyes.", "#a96a40"),
  paletteOption("eyes.smoke", "Smoke", "Smoky gray eyes.", "#7f878f", "#182028"),
  paletteOption("eyes.ice_blue", "Ice Blue", "Pale icy blue eyes.", "#9eb8d6", "#112033")
] as const;

const GNOMISH_SKIN = [
  paletteOption("skin.ivory", "Ivory", "A pale clever-looking complexion.", "#ead9cb", "#241712"),
  paletteOption("skin.rose", "Rose", "A pink-warm complexion.", "#d6ad9a", "#261610"),
  paletteOption("skin.tawny", "Tawny", "A bright tawny complexion.", "#c08b66", "#24150b"),
  paletteOption("skin.bronze", "Bronze", "A bronze complexion.", "#9f6e4e"),
  paletteOption("skin.smoke", "Smoke", "A pale smoke-touched complexion.", "#c8c0ba", "#1e1916"),
  paletteOption("skin.apricot", "Apricot", "A bright apricot complexion.", "#d3a07e", "#25140c"),
  paletteOption("skin.freckled_tan", "Freckled Tan", "A warm tan complexion prone to freckles.", "#ba8463"),
  paletteOption("skin.mushroom", "Mushroom", "A cool mushroom-beige complexion.", "#b4a59b", "#201713"),
  paletteOption("skin.soot", "Soot", "A soot-warmed brown complexion.", "#7b5a4a")
] as const;

const GNOMISH_HAIR = [
  paletteOption("hair.copper", "Copper", "Bright copper hair.", "#c16d42"),
  paletteOption("hair.brown", "Brown", "Warm brown hair.", "#724731"),
  paletteOption("hair.blonde", "Blonde", "Lively golden hair.", "#d6b36c", "#1f1608"),
  paletteOption("hair.silver", "Silver", "Pale silver hair.", "#d9dce2", "#1a1d22"),
  paletteOption("hair.green", "Moss Green", "Dyed or natural moss-green hair.", "#60764d"),
  paletteOption("hair.blue", "Indigo", "A deep blue-black hair tone.", "#29395a"),
  paletteOption("hair.rose_gold", "Rose Gold", "Warm rose-gold hair.", "#cb9687", "#24150f"),
  paletteOption("hair.teal", "Teal", "Teal-tinted hair.", "#3e7b7f"),
  paletteOption("hair.white", "White", "Bright white hair.", "#f0ede6", "#1c1915"),
  paletteOption("hair.amber", "Amber", "Amber-gold hair.", "#cf944b", "#231507"),
  paletteOption("hair.violet", "Violet", "Soft violet hair.", "#866da5"),
  paletteOption("hair.charcoal", "Charcoal", "Charcoal-dark hair.", "#2e3138"),
  paletteOption("hair.moss_blonde", "Moss Blonde", "Muted green-gold hair.", "#a69b67", "#1d170b"),
  paletteOption("hair.sunset", "Sunset", "Orange-pink sunset hair.", "#d77a63"),
  paletteOption("hair.brass", "Brass", "Brassy metallic blonde hair.", "#b89d58", "#1e1608"),
  paletteOption("hair.lavender_gray", "Lavender Gray", "Gray hair with lavender cast.", "#b6aebf", "#1d1a22"),
  paletteOption("hair.cherry", "Cherry", "Bright cherry-red hair.", "#a6474b"),
  paletteOption("hair.cream", "Cream", "Soft cream-blonde hair.", "#e7d6b8", "#211809")
] as const;

const GNOMISH_EYES = [
  paletteOption("eyes.blue", "Blue", "Quick bright blue eyes.", "#6b9bd9", "#102032"),
  paletteOption("eyes.green", "Green", "Quick bright green eyes.", "#5e9854"),
  paletteOption("eyes.amber", "Amber", "Inventive amber eyes.", "#d0a04e", "#231607"),
  paletteOption("eyes.gray", "Gray", "Sharp gray eyes.", "#acb3bd", "#182028"),
  paletteOption("eyes.violet", "Violet", "Rare violet eyes.", "#8a6bb5"),
  paletteOption("eyes.brown", "Brown", "Warm brown eyes.", "#5f4029"),
  paletteOption("eyes.teal", "Teal", "Quick teal eyes.", "#4d918b"),
  paletteOption("eyes.gold", "Gold", "Gold-flecked eyes.", "#d0ad52", "#231707"),
  paletteOption("eyes.rose", "Rose", "Rare rose-gray eyes.", "#c597a8", "#211419")
] as const;

const HALFLING_SKIN = [
  paletteOption("skin.fair", "Fair", "A sun-kissed fair complexion.", "#dfbea8", "#24150f"),
  paletteOption("skin.wheat", "Wheat", "A warm wheat-toned complexion.", "#c69a73", "#20150c"),
  paletteOption("skin.honey", "Honey", "A mellow honey-toned complexion.", "#b8865c", "#241608"),
  paletteOption("skin.olive", "Olive", "A soft olive complexion.", "#9a724f"),
  paletteOption("skin.deep", "Deep", "A rich brown complexion.", "#744c38"),
  paletteOption("skin.amber", "Amber", "A bright amber-tan complexion.", "#cf9b6c", "#231507"),
  paletteOption("skin.chestnut", "Chestnut", "A deep chestnut complexion.", "#85563d"),
  paletteOption("skin.peach", "Peach", "A warm peach-fair complexion.", "#e2b7a0", "#23150f"),
  paletteOption("skin.soot", "Soot", "A soot-warmed brown complexion.", "#62463a")
] as const;

const HALFLING_HAIR = [
  paletteOption("hair.brown", "Brown", "Soft brown hair.", "#6a432d"),
  paletteOption("hair.dark_brown", "Dark Brown", "Dark brown hair.", "#4e3224"),
  paletteOption("hair.blonde", "Blonde", "Bright blonde hair.", "#d4b16d", "#201507"),
  paletteOption("hair.red", "Red", "Warm red hair.", "#ab5939"),
  paletteOption("hair.black", "Black", "Dark black hair.", "#17110f"),
  paletteOption("hair.sand", "Sand", "Sand-brown hair.", "#c8a681", "#23180f"),
  paletteOption("hair.chestnut", "Chestnut", "Warm chestnut hair.", "#84543a"),
  paletteOption("hair.honey", "Honey", "Honey-gold hair.", "#d2ab65", "#231708"),
  paletteOption("hair.walnut", "Walnut", "Dark walnut hair.", "#573728"),
  paletteOption("hair.silver", "Silver", "Soft silver hair.", "#c4c7cb", "#181b1f"),
  paletteOption("hair.white", "White", "Pale white hair.", "#efe8dc", "#1e1b16"),
  paletteOption("hair.copper", "Copper", "Copper-red hair.", "#b7603a"),
  paletteOption("hair.ash_brown", "Ash Brown", "Muted ash-brown hair.", "#7a6454"),
  paletteOption("hair.ginger", "Ginger", "Bright ginger hair.", "#cf7b4e"),
  paletteOption("hair.bronze", "Bronze", "Bronze-brown hair.", "#ad7548"),
  paletteOption("hair.smoke", "Smoke", "Smoky gray-brown hair.", "#8d857d", "#1b1815"),
  paletteOption("hair.flax", "Flax", "Pale flax-blonde hair.", "#dec99a", "#211809"),
  paletteOption("hair.raven", "Raven", "Raven-dark hair.", "#15161a")
] as const;

const HALFLING_EYES = [
  paletteOption("eyes.green", "Green", "Sharp green eyes.", "#65934f"),
  paletteOption("eyes.brown", "Brown", "Warm brown eyes.", "#5d432b"),
  paletteOption("eyes.hazel", "Hazel", "Hazel eyes.", "#8b6f3b"),
  paletteOption("eyes.blue", "Blue", "Blue eyes.", "#6c98d6", "#102033"),
  paletteOption("eyes.gray", "Gray", "Pale gray eyes.", "#a8b1be", "#182028"),
  paletteOption("eyes.amber", "Amber", "Amber eyes.", "#d2a14a", "#231607"),
  paletteOption("eyes.olive", "Olive", "Olive-green eyes.", "#7b8f50"),
  paletteOption("eyes.copper", "Copper", "Copper-brown eyes.", "#aa6e46"),
  paletteOption("eyes.sea_blue", "Sea Blue", "Soft sea-blue eyes.", "#7a9dc5", "#122032")
] as const;

const HALF_TROLL_SKIN = [
  paletteOption("skin.marsh", "Marsh Sallow", "Pale olive skin.", "#9d9b70", "#181a0d"),
  paletteOption("skin.bark", "Bark Brown", "Bark-brown skin.", "#6b563f"),
  paletteOption("skin.stone", "River Stone", "Gray-brown skin.", "#7e776d"),
  paletteOption("skin.deep_moss", "Deep Moss", "Dark moss-green-brown skin.", "#4f5a42"),
  paletteOption("skin.sand", "Sallow Sand", "Weathered pale brown skin.", "#b09b6d", "#1f1a0e"),
  paletteOption("skin.peat", "Peat", "Dark peat-brown skin.", "#5a4a38"),
  paletteOption("skin.gray_green", "Gray Green", "Gray-green skin.", "#68705d"),
  paletteOption("skin.swamp_umber", "Swamp Umber", "Swamp-dark umber skin.", "#58493f"),
  paletteOption("skin.moss_gold", "Moss Gold", "Mossy olive-gold skin.", "#8d8a5f", "#1a180b")
] as const;

const HALF_TROLL_HAIR = [
  paletteOption("hair.black", "Black", "Heavy dark hair.", "#171410"),
  paletteOption("hair.mud", "Mud Brown", "Dark clay-brown hair.", "#5d4735"),
  paletteOption("hair.moss", "Moss Green", "Muted green-brown hair.", "#5b6f48"),
  paletteOption("hair.ash", "Ash", "Smoky gray hair.", "#a39c94", "#1a1715"),
  paletteOption("hair.rust", "Rust", "Rust-dark hair.", "#8f5034"),
  paletteOption("hair.bone", "Bone", "Pale bone-white hair.", "#d8ccb0", "#211b13"),
  paletteOption("hair.dark_green", "Dark Green", "Deep reed-green hair.", "#4c6042"),
  paletteOption("hair.peat_brown", "Peat Brown", "Peat-dark brown hair.", "#4b3a2f"),
  paletteOption("hair.charcoal", "Charcoal", "Dense charcoal hair.", "#2a2c2f"),
  paletteOption("hair.ochre", "Ochre", "Ochre-brown hair.", "#aa7a47"),
  paletteOption("hair.dirty_blonde", "Dirty Blonde", "Mud-warmed blonde hair.", "#b8a27b", "#1f190f"),
  paletteOption("hair.stone_white", "Stone White", "Stone-pale hair.", "#d5d0c4", "#1c1a16"),
  paletteOption("hair.river_gray", "River Gray", "Cold river-gray hair.", "#8a8f91", "#191d1f"),
  paletteOption("hair.copper", "Copper", "Oxidized copper hair.", "#a75c3b"),
  paletteOption("hair.soot", "Soot", "Soot-black hair.", "#161617"),
  paletteOption("hair.marsh_reed", "Marsh Reed", "Dried reed-blonde hair.", "#bca271", "#21180b"),
  paletteOption("hair.olive_black", "Olive Black", "Dark olive-black hair.", "#2f382d"),
  paletteOption("hair.sand", "Sand", "Sallow sand hair.", "#c3aa7b", "#1f160c")
] as const;

const HALF_TROLL_EYES = [
  paletteOption("eyes.amber", "Amber", "Predatory amber eyes.", "#c58b2e", "#231706"),
  paletteOption("eyes.green", "Bog Green", "Dark green eyes.", "#5d7742"),
  paletteOption("eyes.gray", "Stone Gray", "Cool gray eyes.", "#9fa7af", "#182029"),
  paletteOption("eyes.brown", "Mud Brown", "Dense brown eyes.", "#59412d"),
  paletteOption("eyes.gold", "Gold", "Yellow-gold eyes.", "#d0a146", "#201507"),
  paletteOption("eyes.blue", "Pale Blue", "Uncommon pale blue eyes.", "#88a8d0", "#102032"),
  paletteOption("eyes.yellow", "Yellow", "Muddy yellow eyes.", "#bfa64a", "#201606"),
  paletteOption("eyes.teal", "Teal", "Dark marsh-teal eyes.", "#467b7d"),
  paletteOption("eyes.red_brown", "Red Brown", "Dark red-brown eyes.", "#7a4636")
] as const;

const HALF_ORC_SKIN = [
  paletteOption("skin.bronze", "Bronze", "Warm bronze skin.", "#ae8259", "#23150d"),
  paletteOption("skin.olive", "Iron Olive", "Green-brown olive skin.", "#7f7750"),
  paletteOption("skin.ash", "Ash Brown", "Muted brown with gray cast.", "#7f624c"),
  paletteOption("skin.deep_umber", "Deep Umber", "Dark rich brown skin.", "#5e4030"),
  paletteOption("skin.weathered", "Weathered Tan", "Hard-traveled tan skin.", "#b28561", "#241508"),
  paletteOption("skin.green_tan", "Green Tan", "Muted olive-tan skin.", "#8f8459"),
  paletteOption("skin.clay", "Clay", "Warm clay-brown skin.", "#95654c"),
  paletteOption("skin.forest_umber", "Forest Umber", "Dark forest-umber skin.", "#4e4432"),
  paletteOption("skin.pale_olive", "Pale Olive", "Pale olive skin.", "#a3a07a", "#1b1a0f")
] as const;

const HALF_ORC_HAIR = [
  paletteOption("hair.black", "Black", "Dense black hair.", "#12100d"),
  paletteOption("hair.brown", "Brown", "Dark brown hair.", "#5e3c25"),
  paletteOption("hair.russet", "Russet", "Red-brown hair.", "#8f4b2d"),
  paletteOption("hair.gray", "War Gray", "Premature gray hair.", "#9da0a4", "#1b1c1d"),
  paletteOption("hair.umber", "Umber", "Dark umber hair.", "#4d3628"),
  paletteOption("hair.ash", "Ash", "Pale ash hair.", "#c0b8b2", "#1c1715"),
  paletteOption("hair.coal", "Coal", "Coal-black hair.", "#131315"),
  paletteOption("hair.iron", "Iron", "Iron-gray hair.", "#8d9499", "#1b1d1e"),
  paletteOption("hair.moss", "Moss", "Muted moss-dark hair.", "#5f6c49"),
  paletteOption("hair.ochre", "Ochre", "Dusty ochre-brown hair.", "#ab7a46"),
  paletteOption("hair.pale_blonde", "Pale Blonde", "Pale war-blonde hair.", "#d7c08b", "#21170a"),
  paletteOption("hair.copper", "Copper", "Warm copper hair.", "#b45b38"),
  paletteOption("hair.raven", "Raven", "Raven-dark hair.", "#17171a"),
  paletteOption("hair.smoke", "Smoke", "Smoky gray-brown hair.", "#8f8780", "#1c1815"),
  paletteOption("hair.white", "White", "Battle-white hair.", "#e7e3db", "#1f1b17"),
  paletteOption("hair.tawny", "Tawny", "Tawny brown hair.", "#a1734d"),
  paletteOption("hair.dark_red", "Dark Red", "Deep red hair.", "#7e3c31"),
  paletteOption("hair.olive_black", "Olive Black", "Olive-black hair.", "#2a3025")
] as const;

const HALF_ORC_EYES = [
  paletteOption("eyes.gold", "Gold", "Sharp gold eyes.", "#d0a13c", "#241807"),
  paletteOption("eyes.brown", "Brown", "Deep brown eyes.", "#5a412b"),
  paletteOption("eyes.gray", "Storm Gray", "Steely gray eyes.", "#9ea8b5", "#15202a"),
  paletteOption("eyes.green", "Green", "Yellow-green eyes.", "#6e9641"),
  paletteOption("eyes.amber", "Amber", "Amber eyes.", "#cd9547", "#231607"),
  paletteOption("eyes.blue", "Blue", "Uncommon blue-gray eyes.", "#6f89b4", "#112032"),
  paletteOption("eyes.yellow_green", "Yellow Green", "Harsh yellow-green eyes.", "#95a945", "#1d1808"),
  paletteOption("eyes.copper", "Copper", "Copper-brown eyes.", "#b26e3f"),
  paletteOption("eyes.ice", "Ice", "Pale icy eyes.", "#c7d7e6", "#14202c")
] as const;

const HALF_GOBLIN_SKIN = [
  paletteOption("skin.pale_moss", "Pale Moss", "Muted green-beige skin.", "#a7a478", "#17180d"),
  paletteOption("skin.loam", "Loam Tan", "Brown-tan skin.", "#a07854"),
  paletteOption("skin.olive", "Olive Brown", "Green-brown skin.", "#7c704b"),
  paletteOption("skin.smoke", "Smoke Umber", "Deep umber skin.", "#64554a"),
  paletteOption("skin.sallow", "Sallow", "Pale sallow skin.", "#b2a083", "#1d180f"),
  paletteOption("skin.reed", "Reed", "Dry reed-gold skin.", "#978961", "#1e180c"),
  paletteOption("skin.clay", "Clay", "Warm clay-brown skin.", "#916850"),
  paletteOption("skin.pale_olive", "Pale Olive", "Pale olive skin.", "#9c966f", "#18170d"),
  paletteOption("skin.dusk_green", "Dusk Green", "Gray-green dusk skin.", "#6a6d55")
] as const;

const HALF_GOBLIN_HAIR = [
  paletteOption("hair.soot_black", "Soot Black", "Dark soot-black hair.", "#131110"),
  paletteOption("hair.scrap_brown", "Scrap Brown", "Patchy brown hair.", "#61432f"),
  paletteOption("hair.moss_green", "Moss Green", "Faded moss-green hair.", "#5c7349"),
  paletteOption("hair.tin_silver", "Tin Silver", "Pale metallic gray hair.", "#c7c9ca", "#18191b"),
  paletteOption("hair.rust", "Rust", "Rust-dark hair.", "#964e31"),
  paletteOption("hair.cream", "Cream", "Dirty cream hair.", "#d3c5a8", "#201a13"),
  paletteOption("hair.charcoal", "Charcoal", "Dense charcoal hair.", "#242528"),
  paletteOption("hair.tawny", "Tawny", "Scrub-tawny hair.", "#ad7a50"),
  paletteOption("hair.brass", "Brass", "Brassy yellow hair.", "#c0a25d", "#211607"),
  paletteOption("hair.ash_white", "Ash White", "Ash-white hair.", "#ded9cf", "#1b1815"),
  paletteOption("hair.olive", "Olive", "Muted olive hair.", "#6d7a50"),
  paletteOption("hair.teal", "Teal", "Dirty teal hair.", "#466f76"),
  paletteOption("hair.wine", "Wine", "Stolen-dye wine hair.", "#7c3b4f"),
  paletteOption("hair.dirty_blonde", "Dirty Blonde", "Dusty dirty-blonde hair.", "#c7b08a", "#1f180d"),
  paletteOption("hair.dark_red", "Dark Red", "Dark rust-red hair.", "#8f4433"),
  paletteOption("hair.tin_black", "Tin Black", "Tin-black hair.", "#1c1e23"),
  paletteOption("hair.swamp_brown", "Swamp Brown", "Swamp-brown hair.", "#57463a"),
  paletteOption("hair.pale_green", "Pale Green", "Pale marsh-green hair.", "#98a47b", "#1b190d")
] as const;

const HALF_GOBLIN_EYES = [
  paletteOption("eyes.gold", "Gold", "Quick gold eyes.", "#d6ac45", "#201507"),
  paletteOption("eyes.green", "Sharp Green", "Bright green eyes.", "#71a34b"),
  paletteOption("eyes.brown", "Brown", "Dark brown eyes.", "#59412f"),
  paletteOption("eyes.red", "Red Amber", "Red-amber eyes.", "#a84b37"),
  paletteOption("eyes.gray", "Gray", "Pale gray eyes.", "#aab4c0", "#182129"),
  paletteOption("eyes.blue", "Blue", "Rare blue eyes.", "#6289c6", "#122034"),
  paletteOption("eyes.copper", "Copper", "Quick copper eyes.", "#c07b4b"),
  paletteOption("eyes.teal", "Teal", "Sharp teal eyes.", "#4b8d8d"),
  paletteOption("eyes.violet", "Violet", "Uncommon violet eyes.", "#7a63aa")
] as const;

const HALF_MERFOLK_SKIN = [
  paletteOption("skin.pearl", "Pearl", "Pale skin with sea-light undertones.", "#e6ddd1", "#261d16"),
  paletteOption("skin.tide", "Tide Bronze", "Soft bronze skin.", "#bf9466", "#26160c"),
  paletteOption("skin.seaglass", "Sea Glass", "Muted green-blue undertones.", "#a7b9af", "#171d1a"),
  paletteOption("skin.deep_sand", "Deep Sand", "Golden-brown skin.", "#906848"),
  paletteOption("skin.mist", "Mist Fair", "Pale mist-touched skin.", "#d9d9d5", "#201d18"),
  paletteOption("skin.coral", "Coral", "Soft coral-beige skin.", "#d9aa97", "#24140f"),
  paletteOption("skin.driftwood", "Driftwood", "Sea-weathered driftwood brown skin.", "#856651"),
  paletteOption("skin.kelp_olive", "Kelp Olive", "Kelp-green olive skin.", "#86957a", "#17190f"),
  paletteOption("skin.moon_sand", "Moon Sand", "Cool moon-sand skin.", "#c9c2b4", "#1f1a15")
] as const;

const HALF_MERFOLK_HAIR = [
  paletteOption("hair.black", "Black", "Wet-ink black hair.", "#101318"),
  paletteOption("hair.brown", "Brown", "Sea-weathered brown hair.", "#62442f"),
  paletteOption("hair.deep_blue", "Deep Blue", "Dark blue-black hair.", "#223b69"),
  paletteOption("hair.silver", "Silver", "Bright silver hair.", "#d8dde4", "#17202a"),
  paletteOption("hair.coral", "Coral", "Muted coral-red hair.", "#b86e64"),
  paletteOption("hair.sun", "Sun Gold", "Salt-bright gold hair.", "#d7b567", "#1d1608"),
  paletteOption("hair.seafoam", "Seafoam", "Pale seafoam hair.", "#9bc9bf", "#13201b"),
  paletteOption("hair.pearl", "Pearl", "Pearl-white hair.", "#efe9de", "#1d1915"),
  paletteOption("hair.teal", "Teal", "Deep teal hair.", "#2f7380"),
  paletteOption("hair.aqua", "Aqua", "Aqua-blue hair.", "#58a2ba"),
  paletteOption("hair.storm_gray", "Storm Gray", "Storm-gray hair.", "#9ba8b3", "#15202a"),
  paletteOption("hair.pale_gold", "Pale Gold", "Faded pale-gold hair.", "#e1ca8d", "#211708"),
  paletteOption("hair.ink_blue", "Ink Blue", "Ink-dark blue hair.", "#183150"),
  paletteOption("hair.moss", "Moss", "Sea-moss green hair.", "#607a5a"),
  paletteOption("hair.lavender", "Lavender", "Lavender-silver hair.", "#b8b0cf", "#1a1822"),
  paletteOption("hair.driftwood", "Driftwood", "Driftwood-brown hair.", "#8b6b54"),
  paletteOption("hair.black_coral", "Black Coral", "Black coral hair.", "#151821"),
  paletteOption("hair.silver_blue", "Silver Blue", "Silver-blue hair.", "#aebfd1", "#16202c")
] as const;

const HALF_MERFOLK_EYES = [
  paletteOption("eyes.blue", "Sea Blue", "Deep sea-blue eyes.", "#5d84c4", "#142136"),
  paletteOption("eyes.green", "Lagoon Green", "Blue-green eyes.", "#4b9689"),
  paletteOption("eyes.gray", "Mist Gray", "Pale gray eyes.", "#b7c1cf", "#14202a"),
  paletteOption("eyes.amber", "Amber", "Warm amber eyes.", "#d7a44b", "#221507"),
  paletteOption("eyes.teal", "Teal", "Cool teal eyes.", "#4594a0"),
  paletteOption("eyes.violet", "Violet", "Rare violet eyes.", "#8c79b8"),
  paletteOption("eyes.aqua", "Aqua", "Bright aqua eyes.", "#73c1ca", "#13202a"),
  paletteOption("eyes.gold", "Gold", "Sunlit gold eyes.", "#d8b45a", "#221808"),
  paletteOption("eyes.indigo", "Indigo", "Deep indigo eyes.", "#4b5f93")
] as const;
const LINEAGE_IDENTITY_SEEDS: Record<string, LineageIdentitySeed> = {
  "lineage.human": {
    heightRangeCm: [157, 188],
    skinToneOptions: [...COMMON_SKIN_TONES],
    hairColorOptions: [...HUMAN_HAIR],
    eyeColorOptions: [...HUMAN_EYES]
  },
  "lineage.dwarf": {
    heightRangeCm: [129, 151],
    skinToneOptions: [...DWARVEN_SKIN],
    hairColorOptions: [...DWARVEN_HAIR],
    eyeColorOptions: [...DWARVEN_EYES]
  },
  "lineage.gnome": {
    heightRangeCm: [118, 138],
    skinToneOptions: [...GNOMISH_SKIN],
    hairColorOptions: [...GNOMISH_HAIR],
    eyeColorOptions: [...GNOMISH_EYES]
  },
  "lineage.halfling": {
    heightRangeCm: [102, 124],
    skinToneOptions: [...HALFLING_SKIN],
    hairColorOptions: [...HALFLING_HAIR],
    eyeColorOptions: [...HALFLING_EYES]
  },
  "lineage.elf": {
    heightRangeCm: [165, 193],
    skinToneOptions: [...ELVEN_SKIN],
    hairColorOptions: [...ELVEN_HAIR],
    eyeColorOptions: [...ELVEN_EYES]
  },
  "lineage.dark_elf": {
    heightRangeCm: [160, 189],
    skinToneOptions: [...DARK_ELF_SKIN],
    hairColorOptions: [...DARK_ELF_HAIR],
    eyeColorOptions: [...DARK_ELF_EYES]
  },
  "lineage.half_troll": {
    heightRangeCm: [174, 205],
    skinToneOptions: [...HALF_TROLL_SKIN],
    hairColorOptions: [...HALF_TROLL_HAIR],
    eyeColorOptions: [...HALF_TROLL_EYES]
  },
  "lineage.half_orc": {
    heightRangeCm: [166, 196],
    skinToneOptions: [...HALF_ORC_SKIN],
    hairColorOptions: [...HALF_ORC_HAIR],
    eyeColorOptions: [...HALF_ORC_EYES]
  },
  "lineage.half_goblin": {
    heightRangeCm: [146, 173],
    skinToneOptions: [...HALF_GOBLIN_SKIN],
    hairColorOptions: [...HALF_GOBLIN_HAIR],
    eyeColorOptions: [...HALF_GOBLIN_EYES]
  },
  "lineage.half_merfolk": {
    heightRangeCm: [158, 187],
    skinToneOptions: [...HALF_MERFOLK_SKIN],
    hairColorOptions: [...HALF_MERFOLK_HAIR],
    eyeColorOptions: [...HALF_MERFOLK_EYES]
  }
};

const LINEAGE_PRESENTATIONS: Record<string, LineagePresentation> = {
  "lineage.human": {
    label: "Human",
    description:
      "Humans are the most widespread and adaptable people in the world, found in nearly every land from dense cities to remote frontier villages. Their numbers and ambition make them the dominant force across most regions, constantly expanding, trading, and rebuilding. While they lack extreme specialization, they excel through flexibility—quick to learn, quick to organize, and quick to rise. Whether as rulers, merchants, soldiers, or pioneers, humans thrive wherever opportunity exists.",
    stats: "STR 10 / DEX 10 / CON 10 / VIT 10 / AGI 10 / INT 10 / WIS 10 / SPT 10 / CHA 10",
    notes: ["Widespread and adaptable across nearly every settled land."]
  },
  "lineage.dwarf": {
    label: "Dwarf",
    description:
      "Dwarves are a common but regionally concentrated people, most often found in mountain ranges, deep caverns, and heavily fortified strongholds carved into stone. Their societies are built on endurance, tradition, and craft, with entire lifetimes devoted to perfecting a trade or defending ancestral halls. They excel in resilience, engineering, and defensive warfare, standing unyielding against both time and enemy alike. Though slow to trust outsiders, their loyalty—once earned—is as unbreakable as the stone they shape.",
    stats: "STR 11 / DEX 8 / CON 12 / VIT 12 / AGI 7 / INT 10 / WIS 11 / SPT 10 / CHA 9",
    notes: ["Common in mountain and cavern strongholds, but rarely spread evenly."]
  },
  "lineage.gnome": {
    label: "Gnome",
    description:
      "Gnomes are an uncommon and often elusive people, typically found in hidden enclaves, forest workshops, or tucked within the edges of larger cities where their talents are in demand. Driven by curiosity, they constantly experiment with alchemy, magic, and mechanical invention, often blending the three in unpredictable ways. They excel in problem-solving, tinkering, and magical innovation, pushing boundaries others are too cautious to approach.",
    stats: "STR 6 / DEX 11 / CON 9 / VIT 9 / AGI 11 / INT 13 / WIS 10 / SPT 11 / CHA 10",
    notes: ["Uncommon, ingenious, and often found where invention is prized."]
  },
  "lineage.halfling": {
    label: "Halfling",
    description:
      "Halflings are a common yet often overlooked people, living in quiet rural communities, riverlands, and farmland nestled near larger civilizations. They favor comfort and simplicity, but beneath that lies a natural resilience and uncanny ability to survive hardship. They excel in stealth, evasion, and adaptability, slipping through danger rather than confronting it directly. Many underestimate halflings—few make that mistake twice.",
    stats: "STR 7 / DEX 12 / CON 9 / VIT 10 / AGI 12 / INT 10 / WIS 10 / SPT 9 / CHA 11",
    notes: ["Common in rural lands, river settlements, and quiet farming country."]
  },
  "lineage.elf": {
    label: "Elf",
    description:
      "Elves are an uncommon and ancient people, most often found in secluded forests, hidden sanctuaries, or regions rich with magic. Their long lives grant them deep perspective, and their culture emphasizes mastery, balance, and refinement. They excel in precision—whether in archery, magic, or movement—and favor skill and discipline over brute strength. Elven settlements are rarely seen, but their influence is quietly felt across the world.",
    stats: "STR 7 / DEX 13 / CON 8 / VIT 9 / AGI 13 / INT 12 / WIS 11 / SPT 9 / CHA 8",
    notes: ["Uncommon, long-lived, and strongly tied to old forests and magic-rich lands."]
  },
  "lineage.dark_elf": {
    label: "Dark Elf",
    description:
      "Dark Elves are a rare and secretive people, most often found in the deep underground, shadowed forests, or hidden enclaves far from the reach of surface kingdoms. Shaped by harsh environments and internal rivalries, their society values cunning, precision, and quiet power. They are not numerous, but their influence spreads through subtle means—assassins, spies, mages, and unseen hands that shift events from the dark. Dark Elves excel in stealth, agility, and shadow-aligned magic, favoring speed, control, and calculated strikes over direct confrontation. While often mistrusted or feared, their discipline and mastery make them among the most dangerous individuals in the world when operating within their element.",
    stats: "STR 6 / DEX 13 / CON 8 / VIT 9 / AGI 13 / INT 12 / WIS 10 / SPT 10 / CHA 9",
    notes: ["Rare, secretive, and most at home in darkness, hidden enclaves, and deep places."]
  },
  "lineage.half_troll": {
    label: "Half Troll",
    description:
      "Half Trolls are rare and often isolated, found in harsh wilderness, frontier territories, or among mercenary groups where strength is valued over origin. Their bodies carry immense power and resilience, allowing them to endure wounds and conditions that would break others. They excel in brute strength and prolonged combat, thriving in drawn-out fights where endurance decides survival. Though often feared or mistrusted, those who master their nature become nearly unstoppable forces.",
    stats: "STR 14 / DEX 7 / CON 14 / VIT 13 / AGI 6 / INT 7 / WIS 8 / SPT 9 / CHA 12",
    notes: ["Rare, isolated, and most accepted where raw power matters more than origin."]
  },
  "lineage.half_orc": {
    label: "Half Orc",
    description:
      "Half Orcs are an uncommon people, most often found in borderlands, war-torn regions, or mixed settlements where cultures collide. They live between worlds, combining raw physical power with learned discipline. They excel in frontline combat, survival, and intimidation, often rising as warriors, enforcers, or battlefield leaders. While some struggle against prejudice, many carve their place through strength and presence alone.",
    stats: "STR 13 / DEX 9 / CON 12 / VIT 11 / AGI 9 / INT 9 / WIS 9 / SPT 10 / CHA 8",
    notes: ["Uncommon, strong, and most often found where borders and cultures clash."]
  },
  "lineage.half_goblin": {
    label: "Half Goblin",
    description:
      "Half Goblins are an adaptable and opportunistic people, found most often in trade cities, slums, caravan routes, and unstable frontier regions. Their environment shapes them—they learn quickly, move quickly, and exploit any advantage they can find. They excel in speed, cunning, and improvisation, thriving in chaos where rigid systems fail. Whether as traders, scavengers, or fixers, they survive by staying one step ahead.",
    stats: "STR 8 / DEX 13 / CON 9 / VIT 9 / AGI 13 / INT 11 / WIS 9 / SPT 8 / CHA 10",
    notes: ["Adaptable and opportunistic, especially in trade cities and unstable frontiers."]
  },
  "lineage.half_merfolk": {
    label: "Half Merfolk",
    description:
      "Half Merfolk are rare and typically found along coastlines, island chains, river deltas, and major ports where land and sea meet. They carry a fluid nature in both body and temperament, moving easily between cultures and environments. They excel in swimming, navigation, and spirit-aligned magic, often serving as traders, guides, or intermediaries between distant peoples. Their presence is calm and compelling, like the tide—subtle, but powerful.",
    stats: "STR 8 / DEX 11 / CON 9 / VIT 10 / AGI 11 / INT 10 / WIS 11 / SPT 11 / CHA 9",
    notes: ["Rare and most often found where coast, river, and trade traffic converge."]
  }
};

const LINEAGE_FLAVORS: Record<string, LineageFlavor> = {
  "lineage.human": {
    vagabondOrigin: "in a household that expected you to accept the same debts, duties, and ordinary bargains as everyone before you",
    vagabondMotives: "war, politics, poor prospects, and choices made by elders convinced you the road promised more than obedience ever would",
    localFamily: "your family knew this city's labor, markets, shrines, and neighbors well enough to call it home without hesitation",
    localUncommonFamily: "your parents settled here after migration, hard luck, or the long work of carving out a better life",
    localUpbringing: "market bells, ward gossip, and the steady rhythm of common work",
    exileCause: "you refused the oath, levy, marriage, or duty your own people treated as nonnegotiable",
    merchantHouse: "a trading household where value, timing, and reputation mattered as much as coin itself",
    craftsmanTraining: "hands-on lessons in practical craft, maintenance, and the pride of useful work",
    performerCircles: "market stages, tavern rooms, festival courts, and the circles where applause opens doors",
    nobleFamily: "a recognized but modest house accustomed to expectations larger than its actual holdings",
    nobleUncommonFamily: "a titled line tied to embassy work, merchant wealth, or old service to the local court"
  },
  "lineage.dwarf": {
    vagabondOrigin: "in a clan-minded household that valued craft, oath, and long memory above youthful restlessness",
    vagabondMotives: "feuds, burdensome duty, better prospects, or a refusal to live out a life already chosen for you sent you onto the road",
    localFamily: "your household built its place here through honest work, durable craft, and the stubborn habit of staying put",
    localUncommonFamily: "your parents left a hold for freer contracts or a less suffocating life and chose to root themselves here instead",
    localUpbringing: "hearth discipline, measured labor, and the belief that worthy things are repaired rather than discarded",
    exileCause: "you were stripped of hearth-right over a broken oath, unpaid obligation, or a judgment you refused to accept",
    merchantHouse: "a practical family moving metal, stonework, casks, and reliable contracts between safer roads and stubborn places",
    craftsmanTraining: "years of exacting lessons in stone, metal, joinery, or the maintenance of things meant to outlast their makers",
    performerCircles: "ale halls, feast tables, honor recitals, and the loud proud gatherings where song and story preserve memory",
    nobleFamily: "a cadet branch of a respected house or thane-line where honor and scrutiny were equally abundant",
    nobleUncommonFamily: "a family recognized for war service, monster conquest, or such profitable work that formal rank followed"
  },
  "lineage.gnome": {
    vagabondOrigin: "among curious kin who saw every workshop, hedge-lab, and clockwork bench as a reason to stay close to home",
    vagabondMotives: "you wanted wider prospects, stranger theories, better tools, and freedom from the elders who insisted your talents be used their way",
    localFamily: "your family built a careful place here through useful invention, repair work, and making themselves too valuable to ignore",
    localUncommonFamily: "your parents arrived as hired minds, alchemical workers, or tinkerers and then quietly stayed",
    localUpbringing: "clever hands, too many questions, and the expectation that every problem could be improved upon",
    exileCause: "you crossed a line of dangerous curiosity, broke a guild taboo, or refused to stop prying where wiser heads warned you away",
    merchantHouse: "a quick-witted family dealing in curios, inks, reagents, mechanisms, and the margins where strange goods become profitable",
    craftsmanTraining: "restless lessons in small tools, delicate mechanisms, alchemical safety, and making broken things better than before",
    performerCircles: "lecture halls, festival stages, satirical salons, illusion shows, and the rooms where wit matters as much as melody",
    nobleFamily: "a clever but lesser house of chartered inventors, patrons, or advisors whose status rests on usefulness more than age",
    nobleUncommonFamily: "a family of envoy-scholars, fabulously successful merchants, or honored innovators whose title needed explanation before it won respect"
  },
  "lineage.halfling": {
    vagabondOrigin: "in a household that prized comfort, kinship, and familiar roads over grand adventures",
    vagabondMotives: "family expectation, shrinking prospects, political pressure, or the simple pull of better chances beyond the hedgerow drew you away by choice",
    localFamily: "your kin were the sort who knew neighbors by name, seasons by smell, and a whole district by footpath",
    localUncommonFamily: "your parents settled here after trade, migration, or the hope that a quieter beginning might finally hold",
    localUpbringing: "small comforts, practical caution, and learning how to avoid trouble before it ever turned its head your way",
    exileCause: "you were turned out after breaking trust, refusing an obligation, or bringing the wrong sort of danger to a people who value peace",
    merchantHouse: "a tidy and alert household that understood provisions, river trade, small luxuries, and the quiet profit of dependable service",
    craftsmanTraining: "patient work in useful trades, kitchen tools, leather, wood, and all the little crafts that make a household run well",
    performerCircles: "inn hearths, festival greens, river markets, story circles, and the warm crowded places where a good performance travels farther than a wagon",
    nobleFamily: "a modest but legitimate house of riverward patrons, prosperous landholders, or highly regarded civic hosts",
    nobleUncommonFamily: "a well-connected family whose title came through wealth, service, or ties to greater courts that found them unexpectedly useful"
  },
  "lineage.elf": {
    vagabondOrigin: "among patient kin who measured life in generations and expected you to accept that deliberate pace without complaint",
    vagabondMotives: "you grew tired of old obligations, long waiting, and futures drafted by elders who thought time itself would wear your will down",
    localFamily: "your household lived quietly but gracefully here, making a place through craft, letters, and disciplined reserve",
    localUncommonFamily: "your parents left a woodland enclave as envoys, artisans, or lovers unwilling to be parted by old custom",
    localUpbringing: "long memory, careful discipline, and the expectation that skill should always outrun impulse",
    exileCause: "you broke an oath of patience, discipline, or propriety that your kin judged sacred",
    merchantHouse: "a refined trade family moving wines, inks, silverwork, rare wood, and goods bought partly for memory and status",
    craftsmanTraining: "patient instruction in precise workmanship where quality mattered more than speed and failure was corrected rather than excused",
    performerCircles: "moonlit courts, ceremonial halls, refined salons, and old festivals where beauty and precision are inseparable",
    nobleFamily: "a minor elven house bound to old patronage, ceremony, and obligations older than many human kingdoms",
    nobleUncommonFamily: "an envoy family whose rank is respected abroad because diplomacy, artistry, and long service made them useful"
  },
  "lineage.dark_elf": {
    vagabondOrigin: "inside a culture where silence, reputation, and family intrigue often mattered as much as survival",
    vagabondMotives: "house politics, temple pressure, and a life of careful masks became too narrow a prison to endure",
    localFamily: "your household won its place here through caution, competence, and years spent proving it meant no trouble",
    localUncommonFamily: "your parents escaped harsher courts elsewhere and built a freer but more precarious life here",
    localUpbringing: "quiet discipline, close reading of motive, and the habit of knowing when not to answer the first question asked",
    exileCause: "you rejected a house command or sacred duty your people treated as binding",
    merchantHouse: "a shadow-wise family of gem brokers, silk dealers, and discreet negotiators who understand dangerous markets",
    craftsmanTraining: "instruction in fine detail work, subtle finish, and patient craft where control mattered more than noise",
    performerCircles: "private salons, masked revels, hidden courts, and circles where performance is judged as much by control as by spectacle",
    nobleFamily: "a house of rank where favor, insult, and obligation were counted with chilling precision",
    nobleUncommonFamily: "a dark elven line holding recognized status through embassy duty, purchased charter, or martial service so valuable it could not be denied"
  },
  "lineage.half_troll": {
    vagabondOrigin: "on the edge of hard country where strength was valued, but never enough to make life gentle",
    vagabondMotives: "you left before rough labor, violent tempers, or other people's plans for your body became the whole shape of your future",
    localFamily: "your household earned its place here through raw effort, reliability, and refusing to be driven off",
    localUncommonFamily: "your parents were freed folk, reclaimed frontier hands, or stubborn settlers who stayed long enough to become part of the place",
    localUpbringing: "hard work, blunt honesty, and learning when patience wins more than anger",
    exileCause: "you defied the brute authority of kin or elders who thought strength alone should settle every dispute",
    merchantHouse: "a rough but practical family dealing in heavy freight, hides, herbs, salvage, and the goods carried where better roads fail",
    craftsmanTraining: "work that taught you to shape with force, repair with persistence, and value durability over polish",
    performerCircles: "wrestling pits, frontier fairs, roughhouse stages, and loud gatherings where spectacle and sheer presence carry a crowd",
    nobleFamily: "a hard-won titled household whose elders earned standing through border defense, conquest, or indispensable service",
    nobleUncommonFamily: "a family of frontier distinction or formalized heroism whose title is accepted only because it proved too useful to deny"
  },
  "lineage.half_orc": {
    vagabondOrigin: "among border people who respected grit but expected you to accept the life your strength and blood already seemed to promise",
    vagabondMotives: "a levy, warband, family command, or unwanted future of compulsory service made the road feel like freedom",
    localFamily: "your household earned belonging through usefulness, discipline, and being too dependable to ignore",
    localUncommonFamily: "your parents arrived as immigrants, escorts, or discharged soldiers and slowly turned survival into permanence",
    localUpbringing: "watchfulness, physical discipline, and learning that many people notice your temper before they notice your intent",
    exileCause: "you rejected the authority of kin, chief, or household over a matter they believed settled by blood",
    merchantHouse: "a sturdy trade family dealing in caravan freight, iron goods, leather, and contracts needing firm hands as much as sharp numbers",
    craftsmanTraining: "trade lessons grounded in durability, maintenance, and the sort of work that earns respect because it survives use",
    performerCircles: "drum circles, war dances, athletic games, and public contests where presence matters as much as skill",
    nobleFamily: "a martial house whose status rests on service, retained land, and remembered victories more than court polish",
    nobleUncommonFamily: "a household granted title through war service, dungeon victories, or a fortune substantial enough to make skeptical courts accept the arrangement"
  },
  "lineage.half_goblin": {
    vagabondOrigin: "in crowded streets, tunnels, and makeshift quarters where quick wits mattered more than pedigree",
    vagabondMotives: "debt, gang pressure, shrinking prospects, or somebody else's plans for you made leaving the smartest choice available",
    localFamily: "your household carved out belonging through repair work, hustle, and making itself indispensable",
    localUncommonFamily: "your parents arrived as migrants or escaped poverty elsewhere and turned usefulness into legitimacy",
    localUpbringing: "improvisation, sharp eyes, and learning that status often belongs to whoever solves the ugliest problem",
    exileCause: "you crossed the wrong boss, broke a bargain, or refused the practical obedience your own people expected",
    merchantHouse: "a nimble family moving salvage, curios, reagents, spare parts, and odd lots richer merchants ignored until they needed them",
    craftsmanTraining: "fast practical instruction in repair, tinkering, salvage, and making the most of imperfect material",
    performerCircles: "street crowds, market corners, tavern circuits, satire acts, and the lively spaces where audacity earns coin",
    nobleFamily: "an upstart but legitimate house built on conquest, invention, chartered wealth, or success too dramatic to overlook",
    nobleUncommonFamily: "a wealthy family whose title was purchased, earned through war, or recognized after spectacular success in ventures others failed to survive"
  },
  "lineage.half_merfolk": {
    vagabondOrigin: "between shore and tide where kin expected you to accept a life shaped by current, family duty, and old coastal custom",
    vagabondMotives: "storm loss, family quarrel, politics, or the promise of wider horizons drew you onto strange shores by your own choice",
    localFamily: "your household made its place through harbor work, fish trade, courier work, or the steady labor of arriving and departing",
    localUncommonFamily: "your parents settled from some other coast, reef, or shipboard life and finally chose this city as their mooring",
    localUpbringing: "tide tables, harbor gossip, and measuring any promise by whether it could weather a hard season",
    exileCause: "you were banished from kin or custom after defying a duty of tide, family, or sacred boundary treated as inviolable",
    merchantHouse: "a maritime family dealing in shell dyes, pearlwork, preserved goods, charts, and all the little trades that live by harbor timing",
    craftsmanTraining: "coastal trades, rope, sail, tackle, carving, and the habit of making useful things that stand up to water and salt",
    performerCircles: "harbor taverns, noble courts hungry for novelty, festival piers, and the public spaces where voice and presence travel like tide",
    nobleFamily: "a sea-linked line of charter holders, respected captains, or coastal patrons with influence beyond one harbor",
    nobleUncommonFamily: "a family of envoys, wealthy sea traders, or decorated coastal defenders whose status is accepted because their reach extends beyond a single shore"
  }
};

const NAME_POOLS: Record<string, NamePool> = {
  "lineage.human": {
    male: [
      "Aldren",
      "Alric",
      "Bennet",
      "Corin",
      "Darian",
      "Dorian",
      "Evren",
      "Galen",
      "Hadric",
      "Jorren",
      "Lucan",
      "Marten",
      "Merek",
      "Rowan",
      "Soren",
      "Tavian"
    ],
    female: [
      "Adelyn",
      "Alina",
      "Brynna",
      "Catrin",
      "Delia",
      "Elira",
      "Ilya",
      "Isolde",
      "Jessa",
      "Maris",
      "Roslyn",
      "Selene",
      "Talia",
      "Vera",
      "Wenna",
      "Ysolde"
    ],
    surnames: [
      "Ashford",
      "Blackmere",
      "Dovewell",
      "Fairmarch",
      "Fenmere",
      "Harrowfield",
      "Lark",
      "Rooke",
      "Stone",
      "Thorne",
      "Vale",
      "Westmere"
    ]
  },
  "lineage.dwarf": {
    male: [
      "Baern",
      "Borin",
      "Dain",
      "Dolgrin",
      "Eirik",
      "Fargrim",
      "Garrum",
      "Hadrik",
      "Karrik",
      "Kazdrin",
      "Morgran",
      "Odrik",
      "Orik",
      "Rurik",
      "Storr",
      "Thoren"
    ],
    female: [
      "Astrid",
      "Brina",
      "Brena",
      "Dagna",
      "Dagni",
      "Eirna",
      "Gudrun",
      "Helja",
      "Hildi",
      "Ingra",
      "Marda",
      "Revna",
      "Sigrun",
      "Svala",
      "Thyra",
      "Torvi"
    ],
    surnames: [
      "Anvilguard",
      "Brassbeard",
      "Deepdelve",
      "Embermantle",
      "Forgeborn",
      "Goldfurnace",
      "Granitehall",
      "Hammerfall",
      "Ironvein",
      "Oathcarver",
      "Runebrand",
      "Stonehand"
    ]
  },
  "lineage.gnome": {
    male: [
      "Alwick",
      "Bimble",
      "Boddle",
      "Caper",
      "Corlo",
      "Dimmik",
      "Ello",
      "Fennik",
      "Frizzet",
      "Ivro",
      "Jibben",
      "Kelwin",
      "Nimrick",
      "Ozzle",
      "Perrin",
      "Tollo"
    ],
    female: [
      "Ariette",
      "Bellis",
      "Bixie",
      "Dotti",
      "Elsette",
      "Fenna",
      "Fizzra",
      "Jori",
      "Kesset",
      "Luma",
      "Miri",
      "Nissa",
      "Pippa",
      "Quilla",
      "Tessik",
      "Wrenna"
    ],
    surnames: [
      "Brasswick",
      "Brightgear",
      "Cogwhistle",
      "Coppercoil",
      "Dappleclock",
      "Fizzlefen",
      "Gearglow",
      "Hushspring",
      "Inkfuse",
      "Pipettle",
      "Threadspark",
      "Wickerbolt"
    ]
  },
  "lineage.halfling": {
    male: [
      "Alby",
      "Bram",
      "Carden",
      "Corby",
      "Dovin",
      "Ellis",
      "Emmet",
      "Farlan",
      "Jory",
      "Linden",
      "Merrit",
      "Milo",
      "Olan",
      "Perrin",
      "Tobin",
      "Wilby"
    ],
    female: [
      "Anwen",
      "Bria",
      "Cora",
      "Daisy",
      "Elsin",
      "Faye",
      "Holly",
      "Jessa",
      "Kella",
      "Lina",
      "Mara",
      "Nori",
      "Poppy",
      "Rosie",
      "Tessa",
      "Willa"
    ],
    surnames: [
      "Applebrook",
      "Berrybank",
      "Cloverfield",
      "Fernfoot",
      "Goodbarrel",
      "Hearthlane",
      "Mossbutton",
      "Pebbledown",
      "Reedbarrow",
      "Softstep",
      "Underbough",
      "Willowmere"
    ]
  },
  "lineage.elf": {
    male: [
      "Aelar",
      "Aerendyl",
      "Caelir",
      "Caladrel",
      "Elarion",
      "Eryndor",
      "Faelar",
      "Ilyrion",
      "Laeroth",
      "Lethan",
      "Myrion",
      "Saelith",
      "Sylarion",
      "Thalanor",
      "Theron",
      "Vaelis"
    ],
    female: [
      "Aelene",
      "Aeris",
      "Caelyth",
      "Elaria",
      "Elyra",
      "Faelora",
      "Ilyrana",
      "Liora",
      "Lysara",
      "Maeriel",
      "Naevys",
      "Nymeris",
      "Saelora",
      "Serelis",
      "Thalienne",
      "Vaela"
    ],
    surnames: [
      "Amberleaf",
      "Brightwater",
      "Dawnweave",
      "Eversong",
      "Evenmist",
      "Goldbough",
      "Moonbranch",
      "Silverbloom",
      "Silverfrond",
      "Starwillow",
      "Sunshadow",
      "Whisperglade"
    ]
  },
  "lineage.dark_elf": {
    male: [
      "Aethon",
      "Azael",
      "Drazir",
      "Draven",
      "Kaelith",
      "Kaevor",
      "Kyras",
      "Maleth",
      "Malver",
      "Nethis",
      "Rhaevyn",
      "Sevren",
      "Soryn",
      "Veyr",
      "Voren",
      "Zevrin"
    ],
    female: [
      "Aevra",
      "Arieth",
      "Drusyl",
      "Kaelyra",
      "Lysra",
      "Malys",
      "Nerezza",
      "Nyxara",
      "Rhyssa",
      "Sariel",
      "Sevra",
      "Syra",
      "Velis",
      "Vespera",
      "Xyris",
      "Zerith"
    ],
    surnames: [
      "Ashsable",
      "Blacksilk",
      "Dreadspire",
      "Duskwire",
      "Gloamshade",
      "Hollowveil",
      "Nightveil",
      "Ruinweave",
      "Shadeglass",
      "Umbralyn",
      "Velourne",
      "Vesperthorn"
    ]
  },
  "lineage.half_troll": {
    male: [
      "Arvek",
      "Brakk",
      "Brokk",
      "Drov",
      "Drogan",
      "Gorr",
      "Hargen",
      "Hask",
      "Jorv",
      "Kargen",
      "Korr",
      "Marn",
      "Morv",
      "Rask",
      "Sturn",
      "Tovek"
    ],
    female: [
      "Asha",
      "Brakka",
      "Bruga",
      "Dorga",
      "Hessa",
      "Karga",
      "Kessa",
      "Mara",
      "Morga",
      "Raska",
      "Runa",
      "Sura",
      "Torga",
      "Tova",
      "Urga",
      "Vessa"
    ],
    surnames: [
      "Bogrunner",
      "Brinebog",
      "Coldmarsh",
      "Fenmaul",
      "Fenstride",
      "Gravelhide",
      "Marshtread",
      "Mireborn",
      "Mosshide",
      "Mudthorn",
      "Reedscar",
      "Stoneback"
    ]
  },
  "lineage.half_orc": {
    male: [
      "Brakkar",
      "Drok",
      "Drogan",
      "Garran",
      "Garrok",
      "Harl",
      "Korven",
      "Korrin",
      "Marek",
      "Murgan",
      "Orvek",
      "Raskor",
      "Rovan",
      "Thorek",
      "Torren",
      "Vargan"
    ],
    female: [
      "Asha",
      "Brakka",
      "Drena",
      "Gora",
      "Hessa",
      "Kora",
      "Korra",
      "Lurra",
      "Marza",
      "Mira",
      "Nura",
      "Raska",
      "Rava",
      "Sarka",
      "Tavri",
      "Vasha"
    ],
    surnames: [
      "Ashmaw",
      "Blackreed",
      "Bonecleft",
      "Breakspear",
      "Cragrunner",
      "Grimtusk",
      "Ironjaw",
      "Ironreed",
      "Redscar",
      "Stonefist",
      "Varr",
      "Warglen"
    ]
  },
  "lineage.half_goblin": {
    male: [
      "Bex",
      "Clink",
      "Dax",
      "Fivver",
      "Jarik",
      "Jex",
      "Kep",
      "Kiv",
      "Miv",
      "Nib",
      "Pask",
      "Rekk",
      "Rilo",
      "Skit",
      "Tekk",
      "Tivik"
    ],
    female: [
      "Avi",
      "Brixa",
      "Delli",
      "Fira",
      "Jessa",
      "Jix",
      "Kiri",
      "Lix",
      "Mina",
      "Miri",
      "Nelli",
      "Pixa",
      "Rina",
      "Sela",
      "Tavi",
      "Vixi"
    ],
    surnames: [
      "Brassnail",
      "Crowfix",
      "Cinderclip",
      "Dustratchet",
      "Jingleshard",
      "Knifepenny",
      "Latch",
      "Pennycog",
      "Quickwire",
      "Ragbolt",
      "Rookscrap",
      "Tinsprocket"
    ]
  },
  "lineage.half_merfolk": {
    male: [
      "Alaris",
      "Aren",
      "Ceryn",
      "Coris",
      "Delmar",
      "Eiran",
      "Kaelis",
      "Maren",
      "Nerin",
      "Nerio",
      "Oris",
      "Pelion",
      "Sareth",
      "Soren",
      "Thalor",
      "Varen"
    ],
    female: [
      "Aela",
      "Aelune",
      "Coral",
      "Cerys",
      "Eirene",
      "Faelis",
      "Isola",
      "Lyris",
      "Marielle",
      "Mira",
      "Nerina",
      "Nerissa",
      "Osyra",
      "Saela",
      "Sereia",
      "Thessa"
    ],
    surnames: [
      "Bluewake",
      "Brinehaven",
      "Coralwind",
      "Deepcurrent",
      "Foamrider",
      "Harbormist",
      "Moontide",
      "Reefsong",
      "Saltmere",
      "Seaglass",
      "Tideborne",
      "Wavecrest"
    ]
  }
};

const BACKSTORY_ARCHETYPE_ORDER: BackstoryArchetypeId[] = [
  "local",
  "vagabond",
  "exile",
  "merchant",
  "craftsman",
  "performer",
  "minor_noble"
];

const BACKSTORY_MECHANICS: Record<BackstoryArchetypeId, BackstoryMechanics> = {
  local: {
    startAccessProfileId: "background.harbor_runner",
    jobId: "job.local_born",
    attributeAdjustments: { WIS: 1, CHA: 1 },
    skillBonuses: [skill("skill.story.community_ties", 1)],
    traitIds: ["trait.story.known_face", "trait.story.modest_holding"],
    inventoryBonuses: [stack("modest_holding_deed", 1), stack("work_clothes", 1), stack("food_rations", 3)],
    currencyBonus: { gold: 18, silver: 4, copper: 0 },
    passiveBonusLabel:
      "Known Face: Increase fame gain and wages by 5% in the local area, and decrease action time there by 10%."
  },
  vagabond: {
    startAccessProfileId: "background.wayfinder_apprentice",
    jobId: "job.vagabond",
    attributeAdjustments: { AGI: 1, WIS: 1 },
    skillBonuses: [skill("skill.story.scavenge", 1)],
    traitIds: ["trait.story.road_hardened", "trait.story.worn_mount"],
    inventoryBonuses: [stack("worn_mount", 1), stack("bedroll", 1), stack("flint_and_tinder", 1)],
    currencyBonus: { gold: 8, silver: 2, copper: 0 },
    passiveBonusLabel: "Road-Hardened: Reduced survival penalties."
  },
  exile: {
    startAccessProfileId: "background.wayfinder_apprentice",
    jobId: "job.exile",
    attributeAdjustments: { CON: 1, WIS: 1 },
    skillBonuses: [skill("skill.story.endure", 1)],
    traitIds: ["trait.story.marked", "trait.story.exile_heirloom"],
    inventoryBonuses: [stack("exile_heirloom", 1), stack("worn_clothing", 1), stack("food_rations", 1)],
    currencyBonus: { gold: 0, silver: 0, copper: 0 },
    passiveBonusLabel: "Marked: Higher suspicion, stronger intimidation."
  },
  merchant: {
    startAccessProfileId: "background.ledger_apprentice",
    jobId: "job.merchant_house",
    attributeAdjustments: { INT: 1, CHA: 1 },
    skillBonuses: [skill("skill.story.barter", 1)],
    traitIds: ["trait.story.appraiser"],
    inventoryBonuses: [stack("market_stall_permit", 1), stack("ledger_and_writing_tools", 1), stack("travel_clothes", 1)],
    currencyBonus: { gold: 36, silver: 8, copper: 0 },
    passiveBonusLabel:
      "Appraiser: Can estimate item value and avoid being overcharged or underpaid."
  },
  craftsman: {
    startAccessProfileId: "background.ledger_apprentice",
    jobId: "job.apprentice_craftsman",
    attributeAdjustments: { DEX: 1, INT: 1 },
    skillBonuses: [skill("skill.story.field_repair", 1)],
    traitIds: ["trait.story.skilled_hands"],
    inventoryBonuses: [stack("trade_tools", 1), stack("raw_materials", 1), stack("durable_work_clothes", 1)],
    currencyBonus: { gold: 20, silver: 5, copper: 0 },
    passiveBonusLabel:
      "Skilled Hands: Items you craft have slightly improved durability or quality."
  },
  performer: {
    startAccessProfileId: "background.ledger_apprentice",
    jobId: "job.performer",
    attributeAdjustments: { CHA: 1, DEX: 1 },
    skillBonuses: [skill("skill.story.perform", 1)],
    traitIds: ["trait.story.captivating_presence", "trait.story.performers_guild_token"],
    inventoryBonuses: [stack("performers_guild_token", 1), stack("performance_focus", 1), stack("themed_outfit", 1)],
    currencyBonus: { gold: 24, silver: 9, copper: 0 },
    passiveBonusLabel: "Captivating Presence: Improved success in social and crowd-based interactions."
  },
  minor_noble: {
    startAccessProfileId: "background.ledger_apprentice",
    jobId: "job.minor_noble",
    attributeAdjustments: { CHA: 1, WIS: 1 },
    skillBonuses: [skill("skill.story.invoke_status", 1)],
    traitIds: ["trait.story.noble_bearing", "trait.story.signet_of_standing"],
    inventoryBonuses: [stack("signet_ring_of_standing", 1), stack("fine_clothing_house_colors", 1), stack("letter_of_introduction", 1)],
    currencyBonus: { gold: 60, silver: 12, copper: 0 },
    passiveBonusLabel:
      "Noble Bearing: Strong advantage in formal, structured, and hierarchical interactions."
  }
};

function getSettlementLabel(selectedWorld?: ResolvedWorldSelection | null): string {
  return selectedWorld?.settlement.label ?? "the chosen city";
}

function getRegionLabel(selectedWorld?: ResolvedWorldSelection | null): string {
  return selectedWorld?.region.label ?? "the surrounding region";
}

function getSettlementOpportunity(selectedWorld?: ResolvedWorldSelection | null): string {
  if (!selectedWorld) {
    return "trade, labor, and uncertain opportunity";
  }

  const pieces = [
    ...selectedWorld.settlement.dominantIndustries.slice(0, 2).map(titleCase),
    ...selectedWorld.settlement.keyResources.slice(0, 2).map(titleCase)
  ];

  return formatNarrativeList(pieces, "trade, labor, and uncertain opportunity").toLowerCase();
}

function isUncommonLineageInSettlement(
  lineageId: string,
  selectedWorld?: ResolvedWorldSelection | null
): boolean {
  if (!selectedWorld || lineageId === "lineage.human") {
    return false;
  }

  const haystack = [
    selectedWorld.settlementRecord.settlementType,
    selectedWorld.settlementRecord.siteClass,
    selectedWorld.settlementRecord.terrainContext,
    selectedWorld.settlementRecord.summary,
    ...selectedWorld.settlementRecord.identityTags,
    ...selectedWorld.settlementRecord.purposeTags,
    selectedWorld.settlementRecord.economicModel.dominantRole,
    ...selectedWorld.settlementRecord.economicModel.secondaryRoles,
    selectedWorld.regionRecord.name,
    ...(selectedWorld.regionRecord.tags ?? []),
    selectedWorld.localityRecord.localityType,
    selectedWorld.localityRecord.summary,
    ...selectedWorld.localityRecord.dominantIndustries
  ]
    .join(" ")
    .toLowerCase();

  const hasAny = (...needles: string[]) => needles.some((needle) => haystack.includes(needle));

  switch (lineageId) {
    case "lineage.dwarf":
      return !hasAny("mountain", "stone", "mine", "quarry", "forge", "citadel", "fort");
    case "lineage.gnome":
      return !hasAny("workshop", "market", "scholar", "garden", "forest", "craft", "alchemy");
    case "lineage.halfling":
      return !hasAny("farm", "river", "field", "village", "market", "grain", "orchard");
    case "lineage.elf":
      return !hasAny("forest", "grove", "wood", "garden", "scholar", "court", "harbor", "port");
    case "lineage.dark_elf":
      return !hasAny("subterr", "cavern", "tunnel", "shadow", "night", "obsidian", "dusk");
    case "lineage.half_troll":
      return !hasAny("swamp", "marsh", "bog", "frontier", "wild", "river");
    case "lineage.half_orc":
      return !hasAny("frontier", "fort", "garrison", "military", "border", "caravan");
    case "lineage.half_goblin":
      return !hasAny("market", "trade", "workshop", "dock", "harbor", "tunnel", "salvage");
    case "lineage.half_merfolk":
      return !hasAny("coast", "harbor", "port", "sea", "river", "island", "ferry", "underwater");
    default:
      return false;
  }
}

function getUncommonContext(
  archetypeId: "local" | "minor_noble",
  lineageId: string,
  selectedWorld?: ResolvedWorldSelection | null
): string {
  const settlementLabel = getSettlementLabel(selectedWorld);

  if (archetypeId === "local") {
    return pickDeterministic(
      [
        `Your family was remembered as immigrants who chose ${settlementLabel} over the burdens of their old home.`,
        `People still recall that your parents settled here after hardship elsewhere and slowly made themselves indispensable.`,
        `The tale most often told is that your household arrived seeking a freer and steadier life than the old country offered.`,
        `Your family was spoken of as newcomers once, though time and persistence have mostly worn that label smooth.`
      ],
      `${lineageId}.${settlementLabel}.local`
    );
  }

  return pickDeterministic(
    [
      `Your household's rank is explained through embassy service, lucrative trade, or a title earned where old houses could not ignore the result.`,
      `Older families still note that your standing was won by useful service rather than unquestioned inheritance, even if the law now recognizes it plainly.`,
      `Some remember that your house gained rank through conquest, contract, or wealth before it ever gained easy acceptance.`,
      `Your family's name opens doors, though many still remember when it first had to justify why such doors should open at all.`
    ],
    `${lineageId}.${settlementLabel}.minor_noble`
  );
}

function getVarianceLines(archetypeId: BackstoryArchetypeId): string[] {
  switch (archetypeId) {
    case "local":
      return [
        "Major Item — Modest Holding: A small shack or cabin within your home region. Provides safe storage and rest, can be improved over time, and is recognized as yours by locals.",
        "Starting Items: Simple Weapon (Choose 1): Club / Knife / Short Spear; Tool Kit (Choose 1): Farming Tools / Wood Axe / Utility Kit; Work Clothes; Food Rations (3 days); Coin (Low).",
        "Passive — Known Face: Increase fame gain and wages by 5% in local area. Decrease action time of actions in the local area by 10%.",
        "Skill — Community Ties: Local NPCs are more trusting; reduced costs and increased success in basic interactions within your home region."
      ];
    case "vagabond":
      return [
        "Major Item — Worn Mount: A hardy but aging mount that increases travel speed, offers limited carry support, and requires food and care.",
        "Starting Items: Weapon Set (Choose 1): Rusted Sword / Sword + Buckler / Dual Knives / Staff; Tattered Cloak; Bedroll; Flint & Tinder; Food Rations (1 day); Coin (Very Low).",
        "Passive — Road-Hardened: Reduced survival penalties.",
        "Skill — Scavenge: Find usable scraps or supplies."
      ];
    case "exile":
      return [
        "Major Item — Heirloom: Ashbound Ring, Aether Thread Charm, Ironpulse Chain, or Warden's Token. The heirloom grants a small sustaining benefit and may open or complicate certain dealings among outcasts, criminals, and wary authorities.",
        "Starting Items: Improvised Weapon (Choose 1): Broken Blade / Heavy Stick / Stone Knife; Worn Clothing; Hidden Keepsake (Ring / Token / Letter); Food Rations (1 day); Coin (None).",
        "Passive — Marked: Higher suspicion, stronger intimidation.",
        "Skill — Endure: Ignore pain or fatigue briefly."
      ];
    case "merchant":
      return [
        "Starting Items: Market Stall Permit; Ledger and Writing Tools (5% buy-sell bonus); Travel Clothes; Moderate Coin Pouch.",
        "Passive — Appraiser: Can estimate item value and avoid being overcharged or underpaid.",
        "Skill — Barter: Temporarily improve trade outcomes or negotiate better deals."
      ];
    case "craftsman":
      return [
        "Starting Items: Trade Tools (based on specialization); Basic Weapon (often self-made); Durable Work Clothes; Small Stock of Raw Materials; Modest Coin.",
        "Passive — Skilled Hands: Items you craft have slightly improved durability or quality.",
        "Skill — Field Repair: Repair damaged gear or create simple items from available materials."
      ];
    case "performer":
      return [
        "Major Item — Performer's Guild Token: A recognized symbol of guild membership that grants access to taverns, courts, and performance venues and is acknowledged across many settlements.",
        "Starting Items: Performance Focus (Choose 1): Lute / Flute / Drum / Story Kit; Themed Outfit; Light Weapon (Choose 1): Dagger / Decorative Blade; Trinkets and Props; Coin (Low to Moderate).",
        "Passive — Captivating Presence: Improved success in social and crowd-based interactions.",
        "Skill — Perform: Earn coin, gather rumors, or influence mood and attention."
      ];
    case "minor_noble":
    default:
      return [
        "Major Item — Signet Ring of Standing: A formal symbol of lineage and status recognized by officials, merchants, and nobility. It grants broad lawful movement within the country and serves as proof of identity and rank.",
        "Starting Items: Fine Clothing (House Colors); Weapon (Choose 1): Rapier / Short Sword; Letter of Introduction; Personal Item (Choose 1): Family Heirloom / Debt Ledger / Sealed Correspondence; Coin (High relative to other starts).",
        "Passive — Noble Bearing: Strong advantage in formal, structured, and hierarchical interactions.",
        "Skill — Invoke Status: Leverage rank to gain access, favor, or temporary authority."
      ];
  }
}

function buildNarrative(
  lineageId: string,
  archetypeId: BackstoryArchetypeId,
  selectedWorld?: ResolvedWorldSelection | null
): {
  label: string;
  hookLine: string;
  description: string;
  narrativeParagraphs: [string, string];
  worldHookLine: string;
} {
  const flavor = LINEAGE_FLAVORS[lineageId] ?? LINEAGE_FLAVORS["lineage.human"]!;
  const settlementLabel = getSettlementLabel(selectedWorld);
  const regionLabel = getRegionLabel(selectedWorld);
  const opportunity = getSettlementOpportunity(selectedWorld);
  const uncommon = isUncommonLineageInSettlement(lineageId, selectedWorld);

  switch (archetypeId) {
    case "local":
      return {
        label: "Local",
        hookLine: `You were born in ${settlementLabel}, and its streets, customs, and burdens are all familiar to you.`,
        description: uncommon
          ? `You were raised in ${settlementLabel}. ${getUncommonContext("local", lineageId, selectedWorld)}`
          : `You were raised in ${settlementLabel}, where family, place, and memory are tightly braided together.`,
        narrativeParagraphs: [
          `You were born here. ${flavor.localFamily}. Your upbringing was shaped by ${flavor.localUpbringing}, and by the quiet certainty that this place would always know your face before it knew your ambitions. ${uncommon ? getUncommonContext("local", lineageId, selectedWorld) : ""}`,
          `${settlementLabel} is known for ${opportunity}, and no one needs to explain that promise to you. As childhood gives way to adulthood, roots alone no longer feel like enough. You stand ready to choose a real path with home beneath your feet instead of rumor beneath your boots.`
        ],
        worldHookLine: `You know ${settlementLabel} from the inside and understand what life in ${regionLabel} truly asks of its people.`
      };
    case "vagabond":
      return {
        label: "Vagabond",
        hookLine: "You chose the road of your own will and learned to survive by motion rather than permanence.",
        description: `You were born elsewhere, but for reasons of your own choosing you now make for ${settlementLabel}.`,
        narrativeParagraphs: [
          `You were born ${flavor.vagabondOrigin}. In time, ${flavor.vagabondMotives}, and you stepped onto the road before duty, marriage, levy, or habit could decide the rest of your life for you. Since then, you have learned to judge places quickly and keep only what can survive weather, bad company, and long travel.`,
          `${settlementLabel} drew your attention because word travels far about ${opportunity}. In ${regionLabel}, a self-made wanderer may yet trade uncertainty for a better beginning. You arrive by choice, not because you have nowhere else to go, but because you intend to claim something better here than what was waiting behind you.`
        ],
        worldHookLine: `${settlementLabel} offers the kind of opportunity that can tempt a willing wanderer to stop and begin again.`
      };
    case "exile":
      return {
        label: "Exile",
        hookLine: "You were cast out, and whatever was once yours now survives only in memory, rumor, and what little you could carry.",
        description: "The road did not take you by invitation. It took you because returning ceased to be an option.",
        narrativeParagraphs: [
          `You were cast out. ${flavor.exileCause}. Exile leaves more than distance behind it; it leaves judgment, silence, and the cold knowledge that the world you knew can close without ever reopening.`,
          `${settlementLabel} is not home, but in ${regionLabel} usefulness can still outweigh old disgrace. The city is known for ${opportunity}, and that makes room for one more capable stranger willing to endure. Whatever future you build here will be built without inherited shelter, and that has already taught you how to value every inch of firm ground.`
        ],
        worldHookLine: `${settlementLabel} cannot erase the past, but it may still let an exile carve out a future.`
      };
    case "merchant":
      return {
        label: "Merchant",
        hookLine: "Trade shaped your youth, and you learned early that information, timing, and value are all forms of leverage.",
        description: "You come from buying, selling, and negotiation rather than from open war or inherited land.",
        narrativeParagraphs: [
          `You were raised within ${flavor.merchantHouse}. There, every meal carried talk of risk, margins, supply, and the small differences that turn fair trade into real profit. You learned to read posture, judge quality, and treat a careless promise as a liability as much as a courtesy.`,
          `${settlementLabel} is a fitting place for that training to become something truly your own. The city prospers on ${opportunity}, and a person who understands value can turn its flow of goods and rumor into lasting advantage. You stand at the threshold between family trade and personal ambition, ready to see which one defines you.`
        ],
        worldHookLine: `${settlementLabel} offers steady opportunity to someone schooled in value, timing, and negotiated advantage.`
      };
    case "craftsman":
      return {
        label: "Craftsman",
        hookLine: "You were trained in useful work, and your hands learned to solve problems long before your future was fully named.",
        description: "You come from practiced labor and skilled trade, not from present office or current employment.",
        narrativeParagraphs: [
          `You were raised among ${flavor.craftsmanTraining}. Skill was not something admired from afar in your household; it was practiced until the hand knew what the eye still struggled to name. You learned the difference between haste and efficiency, and between something merely finished and something truly well made.`,
          `${settlementLabel} is known for ${opportunity}, which means there is always demand for work that is steady, useful, and worth paying for. As your youth gives way to a life of your own choosing, you arrive ready to turn practiced craft into livelihood, reputation, and perhaps something greater.`
        ],
        worldHookLine: `${settlementLabel} rewards useful workmanship, and your training gives you a real foothold there.`
      };
    case "performer":
      return {
        label: "Performer",
        hookLine: "You live by presence, story, music, or spectacle, and recognition tends to arrive before certainty does.",
        description: "Your upbringing taught you how attention moves, how crowds feel, and how names begin to travel.",
        narrativeParagraphs: [
          `You grew up in or around ${flavor.performerCircles}. Whether through song, story, instrument, satire, dance, or persona, you learned that a room can be won before it fully understands why it has chosen to listen. Fame is fickle, but presence is a craft of its own, and you have spent years learning it.`,
          `${settlementLabel} is exactly the sort of place where recognition can become livelihood. The city's reputation for ${opportunity} means crowds gather, patrons spend, and rumor moves quickly. If you are careful, that can become influence as easily as it becomes coin.`
        ],
        worldHookLine: `${settlementLabel} offers stages, listeners, and the kind of attention from which reputations are made.`
      };
    case "minor_noble":
    default:
      return {
        label: "Minor Noble",
        hookLine: "You were born to a recognized house, minor but legitimate, and your name still carries a weight others notice.",
        description: uncommon
          ? `You were raised with rank in ${settlementLabel}, though your household's place is still remembered as something once unusual here.`
          : `You were raised with education, scrutiny, and expectations that were never truly optional.`,
        narrativeParagraphs: [
          uncommon
            ? `You were born to ${flavor.nobleUncommonFamily}. Courtesy was extended to your house, but never without curiosity, memory, or a little scrutiny. From childhood onward you were taught letters, manners, and representation because your name meant something even when others were not sure what they wished it to mean. ${getUncommonContext("minor_noble", lineageId, selectedWorld)}`
            : `You were born to ${flavor.nobleFamily}. Tutors, retainers, and measured freedoms shaped your youth, and every gesture was quietly weighed for what it revealed about discipline, worth, and family honor. A noble upbringing is rarely carefree; it is an education in visible composure and inherited expectation.`,
          `${settlementLabel} is known for ${opportunity}, and that makes it an apt place for inherited promise to harden into real action. Whether you intend to uphold your house, escape its burdens with grace, or redefine its future entirely, you have reached the point where rank alone is no longer enough.`
        ],
        worldHookLine: `${settlementLabel} offers enough opportunity for a minor noble to prove whether standing can become substance.`
      };
  }
}

export const lineageOptions: CharacterCreationOption[] = PLAYABLE_LINEAGE_IDS.map((lineageId) => {
  const presentation = LINEAGE_PRESENTATIONS[lineageId]!;
  return {
    id: lineageId,
    label: presentation.label,
    description: presentation.description,
    notes: [presentation.stats, ...(presentation.notes ?? [])]
  };
});

export const pathOptions: CharacterCreationOption[] = Object.values(PATH_TEMPLATES).map((template) => ({
  id: template.id,
  label: template.label,
  description: template.description,
  notes: template.notes
}));

const LINEAGE_BASE_ATTRIBUTES: Record<string, PlayerAttributes> = Object.fromEntries(
  Object.entries(LINEAGE_PRESENTATIONS).map(([lineageId, presentation]) => [
    lineageId,
    parseLineageStatBlock(presentation.stats)
  ])
);

const LINEAGE_CARD_ART: Record<string, LineageCardArt> = {
  "lineage.human": {
    imageUrl: "/character-creator/lineages/lineage-human.png",
    backgroundPosition: "center 22%"
  },
  "lineage.dwarf": {
    imageUrl: "/character-creator/lineages/lineage-dwarf.png",
    backgroundPosition: "center 28%"
  },
  "lineage.gnome": {
    imageUrl: "/character-creator/lineages/lineage-gnome.png",
    backgroundPosition: "center 24%"
  },
  "lineage.halfling": {
    imageUrl: "/character-creator/lineages/lineage-halfling.png",
    backgroundPosition: "center 24%"
  },
  "lineage.elf": {
    imageUrl: "/character-creator/lineages/lineage-elf.png",
    backgroundPosition: "center 22%"
  },
  "lineage.dark_elf": {
    imageUrl: "/character-creator/lineages/lineage-dark-elf.png",
    backgroundPosition: "center 18%"
  },
  "lineage.half_troll": {
    imageUrl: "/character-creator/lineages/lineage-half-troll.png",
    backgroundPosition: "center 24%"
  },
  "lineage.half_orc": {
    imageUrl: "/character-creator/lineages/lineage-half-orc.png",
    backgroundPosition: "center 20%"
  },
  "lineage.half_goblin": {
    imageUrl: "/character-creator/lineages/lineage-half-goblin.png",
    backgroundPosition: "center 22%"
  },
  "lineage.half_merfolk": {
    imageUrl: "/character-creator/lineages/lineage-half-merfolk.png",
    backgroundPosition: "center 18%"
  }
};

export function isKnownLineageId(lineageId: string): boolean {
  return lineageId in PLAYER_LINEAGE_PROFILES && lineageId in LINEAGE_IDENTITY_SEEDS;
}

export function isKnownPathId(pathId: string): boolean {
  return pathId in PATH_TEMPLATES;
}

export function getPathTemplate(classId: string): StarterClassTemplate {
  return PATH_TEMPLATES[classId] ?? PATH_TEMPLATES[PATH_TEMPLATE_FALLBACK]!;
}

export function getPathAttributeAdjustments(
  classId: string
): PlayerAttributeAdjustments {
  return buildAttributeAdjustmentsFromTemplate(getPathTemplate(classId).baseAttributes);
}

export function getLineageBaseAttributes(lineageId: string): PlayerAttributes {
  return LINEAGE_BASE_ATTRIBUTES[lineageId] ?? DEFAULT_ATTRIBUTE_BASELINE;
}

export function getLineageCardArt(lineageId: string): LineageCardArt | null {
  return LINEAGE_CARD_ART[lineageId] ?? null;
}

export function getLineageIdentityCatalog(lineageId: string): LineageIdentityCatalog | null {
  const profile = PLAYER_LINEAGE_PROFILES[lineageId];
  const seed = LINEAGE_IDENTITY_SEEDS[lineageId];

  if (!profile || !seed) {
    return null;
  }

  return {
    lineageId,
    lineageLabel: profile.name,
    heightRangeCm: seed.heightRangeCm,
    heightBands: HEIGHT_BANDS,
    buildOptions: BUILD_OPTIONS,
    skinToneOptions: sortIdentityPaletteOptions(seed.skinToneOptions, "skin"),
    hairColorOptions: sortIdentityPaletteOptions(seed.hairColorOptions, "hair"),
    eyeColorOptions: sortIdentityPaletteOptions(seed.eyeColorOptions, "eye")
  };
}

export function getRepresentativeHeightCm(lineageId: string, heightBandId: HeightBandId): number {
  const catalog = getLineageIdentityCatalog(lineageId);
  if (!catalog) {
    return 170;
  }

  const [minHeight, maxHeight] = catalog.heightRangeCm;

  switch (heightBandId) {
    case "short":
      return minHeight;
    case "tall":
      return maxHeight;
    case "normal":
    default:
      return Math.floor((minHeight + maxHeight) / 2);
  }
}

export function getHeightBandLabel(heightBandId: HeightBandId | "" | null): string | null {
  if (!heightBandId) {
    return null;
  }

  return HEIGHT_BANDS.find((option) => option.id === heightBandId)?.label ?? null;
}

export function getHeightBandAttributeAdjustments(
  heightBandId: HeightBandId | "" | null
): PlayerAttributeAdjustments {
  return HEIGHT_BANDS.find((option) => option.id === heightBandId)?.attributeAdjustments ?? {};
}

export function getBuildLabel(
  buildId: PlayerIdentityBuildId | "" | null
): string | null {
  if (!buildId) {
    return null;
  }

  return BUILD_OPTIONS.find((option) => option.id === buildId)?.label ?? null;
}

export function getBuildAttributeAdjustments(
  buildId: PlayerIdentityBuildId | "" | null
): PlayerAttributeAdjustments {
  return BUILD_OPTIONS.find((option) => option.id === buildId)?.attributeAdjustments ?? {};
}

export function getIdentityOptionLabel(
  lineageId: string,
  collectionKey: IdentityCollectionKey,
  optionId: string
): string | null {
  const catalog = getLineageIdentityCatalog(lineageId);
  if (!catalog) {
    return null;
  }

  return catalog[collectionKey].find((option) => option.id === optionId)?.label ?? null;
}

export function isCompatibleBackstorySelection(lineageId: string, backgroundId: string): boolean {
  const parsed = parseBackstoryId(backgroundId);
  return parsed !== null && parsed.lineageId === lineageId;
}

export function getBackstoryStartAccessProfileId(backgroundId: string): string {
  const parsed = parseBackstoryId(backgroundId);
  return parsed
    ? BACKSTORY_MECHANICS[parsed.archetypeId].startAccessProfileId
    : "background.wayfinder_apprentice";
}

export function getBackstoryTemplate(
  backgroundId: string,
  selectedWorld?: ResolvedWorldSelection | null
): StarterBackstoryTemplate {
  const parsed = parseBackstoryId(backgroundId) ?? {
    lineageId: "lineage.human",
    archetypeId: "local" as const
  };
  const template = buildBackstoryTemplate(parsed.lineageId, parsed.archetypeId, selectedWorld);
  return template;
}

export function getBackstoryOptionsForSelection(
  lineageId: string,
  selectedWorld?: ResolvedWorldSelection | null
): StarterBackstoryTemplate[] {
  if (!isKnownLineageId(lineageId)) {
    return [];
  }

  return BACKSTORY_ARCHETYPE_ORDER.map((archetypeId) =>
    buildBackstoryTemplate(lineageId, archetypeId, selectedWorld)
  );
}

export function generateRandomCharacterName(
  lineageId: string,
  sexId: Extract<PlayerSexId, "male" | "female"> | ""
): string {
  const pool = NAME_POOLS[lineageId] ?? NAME_POOLS["lineage.human"]!;
  const resolvedSex = sexId === "female" ? "female" : "male";
  const firstName = pickDeterministic(pool[resolvedSex], `${lineageId}.${resolvedSex}.${Math.random()}`);
  const surname = pickDeterministic(pool.surnames, `${lineageId}.surname.${Math.random()}`);
  return `${firstName} ${surname}`;
}

function buildBackstoryTemplate(
  lineageId: string,
  archetypeId: BackstoryArchetypeId,
  selectedWorld?: ResolvedWorldSelection | null
): StarterBackstoryTemplate {
  const mechanics = BACKSTORY_MECHANICS[archetypeId];
  const narrative = buildNarrative(lineageId, archetypeId, selectedWorld);

  return {
    id: getBackstoryId(lineageId, archetypeId),
    label: narrative.label,
    description: narrative.description,
    notes: [narrative.worldHookLine, mechanics.passiveBonusLabel],
    archetypeId,
    hookLine: narrative.hookLine,
    narrativeParagraphs: narrative.narrativeParagraphs,
    passiveBonusLabel: mechanics.passiveBonusLabel,
    varianceLines: getVarianceLines(archetypeId),
    jobId: mechanics.jobId,
    attributeAdjustments: mechanics.attributeAdjustments,
    skillBonuses: mechanics.skillBonuses,
    traitIds: mechanics.traitIds,
    inventoryBonuses: mechanics.inventoryBonuses,
    currencyBonus: mechanics.currencyBonus,
    startAccessProfileId: mechanics.startAccessProfileId
  };
}
