import type {
  CrystalCatalogRecord,
  InstitutionGuildCatalogRecord,
  InstitutionLocalityRecord,
  InstitutionRegionRecord,
  InstitutionSettlementRecord,
  LandAuthorityType,
  MagicInfrastructureCatalogRecord,
  ReligionCatalogRecord,
  SettlementGuildInstanceState,
  SettlementMagicServiceState,
  SettlementStartAccessState
} from "../../../../packages/shared/types/src/index.js";
import {
  deriveLandAuthorityType,
  deriveSettlementCrystalReserves,
  deriveSettlementGuildInstances,
  deriveSettlementMagicInfrastructure,
  deriveSettlementReligion,
  deriveSettlementStartAccess
} from "../../../../packages/shared/types/src/index.js";
import type { IconName } from "../types.js";
import guildsCatalog from "../../../../packages/content/base/civilization/guilds.json";
import crystalCatalogData from "../../../../packages/content/base/world/crystal_catalog.json";
import magicInfrastructureCatalog from "../../../../packages/content/base/world/magic_infrastructure.json";
import regionLocalitiesCatalog from "../../../../packages/content/base/world/region_localities.json";
import regionsCatalog from "../../../../packages/content/base/world/regions.json";
import religionsCatalog from "../../../../packages/content/base/world/religions.json";
import settlementsCatalog from "../../../../packages/content/base/world/settlements.json";

type RegionRecord = InstitutionRegionRecord & {
  summary?: string;
  tags: string[];
  economicProfile?: {
    supplyStrengths?: string[];
    demandPressures?: string[];
    importBias?: number;
    exportBias?: number;
    majorExports?: string[];
    majorImports?: string[];
  };
};

type SettlementRecord = InstitutionSettlementRecord & {
  macroRegionId: string;
  visualMapRef?: {
    mapId: string;
    pixelX: number;
    pixelY: number;
  };
  domesticResourceProfile: {
    primaryGoods: string[];
    secondaryGoods: string[];
    demandedGoods: string[];
  };
};

type LocalityRecord = InstitutionLocalityRecord;

type RecordsCatalog<T> = {
  records: T[];
};

export interface WorldContinentOption {
  id: string;
  label: string;
  climate: string;
  biomeMix: string[];
  difficultyLabel: string;
  difficultyTone: "success" | "warning" | "danger";
  dominantResources: string[];
  tradeCharacteristics: string[];
  description: string;
}

export interface WorldCardArt {
  imageUrl: string;
  selectedImageUrl?: string;
  backgroundPosition?: string;
  selectedBackgroundPosition?: string;
  backgroundSize?: string;
  selectedBackgroundSize?: string;
}

export type WorldRegionResourceTone =
  | "timber"
  | "fieldCrops"
  | "orchards"
  | "gardenProduce"
  | "fishAndGame"
  | "livestock"
  | "ore"
  | "stone";

export interface WorldRegionResourceIcon {
  tone: WorldRegionResourceTone;
  label: string;
  description: string;
  icon?: IconName;
  imageUrl?: string;
}

export interface WorldRegionOption {
  id: string;
  continentId: string;
  label: string;
  difficultyLabel: string;
  difficultyTone: "success" | "warning" | "danger";
  terrainAndBiome: string;
  resourceAvailability: string[];
  resourceIcons: WorldRegionResourceIcon[];
  populationDensity: string;
  economicProfile: string[];
  description: string;
  descriptionParagraphs: string[];
}

type RegionPresentationOverride = {
  cardArt?: WorldCardArt;
  descriptionParagraphs?: string[];
  resourceIcons?: WorldRegionResourceIcon[];
};

export interface SettlementLandRestrictionSummary {
  authorityLabel: string;
  propertyNarrative: string;
  currentStanding: string;
  purchaseRequirements: string[];
}

export interface WorldSettlementOption {
  id: string;
  regionId: string;
  continentId: string;
  label: string;
  populationSize: string;
  settlementType: string;
  dominantIndustries: string[];
  keyResources: string[];
  resourceIcons: WorldRegionResourceIcon[];
  tradeRole: string;
  developmentLevel: string;
  access: SettlementStartAccessState;
  landAuthorityType: ReturnType<typeof deriveLandAuthorityType>;
  landRestriction: SettlementLandRestrictionSummary;
  guilds: SettlementGuildInstanceState[];
  magic: SettlementMagicServiceState[];
  description: string;
}

export interface ResolvedWorldSelection {
  continent: WorldContinentOption;
  region: WorldRegionOption;
  settlement: WorldSettlementOption;
  settlementRecord: SettlementRecord;
  regionRecord: RegionRecord;
  localityRecord: LocalityRecord;
}

const regionRecords = (regionsCatalog as RecordsCatalog<RegionRecord>).records;
const localityRecords = (regionLocalitiesCatalog as RecordsCatalog<LocalityRecord>).records;
const settlementRecords = (settlementsCatalog as RecordsCatalog<SettlementRecord>).records;
const guildCatalog = (guildsCatalog as RecordsCatalog<InstitutionGuildCatalogRecord>).records;
const religionCatalog = (religionsCatalog as RecordsCatalog<ReligionCatalogRecord>).records[0] ?? null;
const magicCatalog = (magicInfrastructureCatalog as RecordsCatalog<MagicInfrastructureCatalogRecord>).records;
const crystalCatalog = (crystalCatalogData as RecordsCatalog<CrystalCatalogRecord>).records;

const regionById = new Map(regionRecords.map((record) => [record.id, record]));
const localityById = new Map(localityRecords.map((record) => [record.id, record]));

const CONTINENT_CARD_ART: Record<string, WorldCardArt> = {
  "region.kaelvar": {
    imageUrl: "/character-creator/continents/continent-kaelvar.png",
    selectedImageUrl: "/character-creator/continents/continent-kaelvar-selected.png",
    backgroundPosition: "center 18%"
  },
  "region.valtherion": {
    imageUrl: "/character-creator/continents/continent-valtherion.png",
    selectedImageUrl: "/character-creator/continents/continent-valtherion-selected.png",
    backgroundPosition: "center 24%"
  },
  "region.serathyl": {
    imageUrl: "/character-creator/continents/continent-serathyl.png",
    selectedImageUrl: "/character-creator/continents/continent-serathyl-selected.png",
    backgroundPosition: "center 22%"
  },
  "region.draemor": {
    imageUrl: "/character-creator/continents/continent-draemor.png",
    selectedImageUrl: "/character-creator/continents/continent-draemor-selected.png",
    backgroundPosition: "center 20%"
  },
  "region.talmyra": {
    imageUrl: "/character-creator/continents/continent-talmyra.png",
    selectedImageUrl: "/character-creator/continents/continent-talmyra-selected.png",
    backgroundPosition: "center 18%"
  },
  "region.myridian_chain": {
    imageUrl: "/character-creator/continents/continent-myridian-chain.png",
    selectedImageUrl: "/character-creator/continents/continent-myridian-chain-selected.png",
    backgroundPosition: "center 34%"
  },
  "region.lantern_isles": {
    imageUrl: "/character-creator/continents/continent-lantern-isles.png",
    selectedImageUrl: "/character-creator/continents/continent-lantern-isles-selected.png",
    backgroundPosition: "center 32%"
  },
  "region.serpents_wake": {
    imageUrl: "/character-creator/continents/continent-serpents-wake.png",
    selectedImageUrl: "/character-creator/continents/continent-serpents-wake-selected.png",
    backgroundPosition: "center 28%"
  },
  "region.dawnreach_isles": {
    imageUrl: "/character-creator/continents/continent-dawnreach-isles.png",
    selectedImageUrl: "/character-creator/continents/continent-dawnreach-isles-selected.png",
    backgroundPosition: "center 32%"
  }
};

const REGION_RESOURCE_IMAGE_URLS: Record<WorldRegionResourceTone, string> = {
  timber: "/character-creator/region-resources/resource-timber.png",
  fieldCrops: "/character-creator/region-resources/resource-field-crops.png",
  orchards: "/character-creator/region-resources/resource-orchards.png",
  gardenProduce: "/character-creator/region-resources/resource-garden-produce.png",
  fishAndGame: "/character-creator/region-resources/resource-fish-and-game.png",
  livestock: "/character-creator/region-resources/resource-livestock.png",
  ore: "/character-creator/region-resources/resource-ore.png",
  stone: "/character-creator/region-resources/resource-stone.png"
};

const REGION_RESOURCE_FALLBACK_ICONS: Record<WorldRegionResourceTone, IconName> = {
  timber: "tree",
  fieldCrops: "grain",
  orchards: "fruit",
  gardenProduce: "vegetable",
  fishAndGame: "animal",
  livestock: "animal",
  ore: "coin",
  stone: "queue"
};

function createRegionResourceIcon(params: {
  tone: WorldRegionResourceTone;
  label: string;
  description: string;
  icon?: IconName;
}): WorldRegionResourceIcon {
  return {
    tone: params.tone,
    label: params.label,
    description: params.description,
    icon: params.icon ?? REGION_RESOURCE_FALLBACK_ICONS[params.tone],
    imageUrl: REGION_RESOURCE_IMAGE_URLS[params.tone]
  };
}

const REGION_PRESENTATION_OVERRIDES: Record<string, RegionPresentationOverride> = {
  "region.auric_marches": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-auric-marches.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "Travelers who cross into the Auric Marches quickly learn that this is a land that gives nothing freely. The wind runs constant across the uplands, carrying dust from the ore ridges and the distant glow of smelters that never fully go dark. Settlements are few, and none exist by accident; each one stands where the ground yields copper, iron, or stone enough to justify the cost of keeping people alive.",
      "Food is not grown here in any reliable quantity. A few hardy herds graze the tougher stretches of land, and small plots cling to sheltered basins, but most meals arrive by caravan. Grain, wine, oil, and preserved goods travel north from the southern peninsula, and their arrival is watched as closely as any shipment of ore. A delayed caravan is not an inconvenience; it is a problem that spreads quickly.",
      "What the Marches lack in comfort, they repay in material wealth. Copper veins run broad and accessible in places, while iron is drawn from deeper workings, especially in the great dwarven delves such as Stonevein. Quarry stone, charcoal, and metal goods move constantly along the caravan roads, forming the backbone of Kaelvar's industry.",
      "To travel here is to move between wells, forts, and waystations spaced carefully along known routes. Stray from them, and the land reminds you very quickly why so few try to tame it. Those who remain are practical people; miners, haulers, and guards drawn not by the land itself, but by what lies beneath it."
    ]
  },
  "region.verdant_thalos": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-verdant-thalos.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "Verdant Thalos is often described as the gentlest face of Kaelvar, though its ease is the result of careful tending rather than fortune alone. The southern peninsula stretches through rolling hills and sheltered coasts, where vineyards, olive groves, and orchards shape the land as much as the seasons do.",
      "Inland, the estates are orderly and productive. Wheat and barley fields spread between low terraces, flanked by grazing land and orchard belts. Villages such as Oliveford and market towns like Vinecross serve as the quiet machinery of the region, gathering fruit, oil, wool, and grain before sending them along well-kept roads toward the coast. Dairy, vegetables, and livestock are common, and few settlements here lack a stable local food supply.",
      "Along the bays, the landscape shifts from field to harbor. Cities like Aurelis rise where the land meets calm water, their docks filled with ships carrying oil, wine, cloth, and timber outward across the sea. These ports also draw in what the region cannot fully provide on its own; additional grain, metals from the Marches, and rarer goods from beyond Kaelvar.",
      "Despite its abundance, Verdant Thalos is not isolated in its prosperity. Its tools depend on imported ore, its markets rely on steady trade, and its balance is maintained through constant exchange. To visitors, it appears orderly and welcoming; to those who understand it, it is a carefully managed system where land, labor, and trade are all expected to perform."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "fieldCrops",
        label: "Field Crops",
        description:
          "Wheat, barley, and other staple harvests anchor the peninsula's estate belts and local granaries."
      }),
      createRegionResourceIcon({
        tone: "orchards",
        label: "Orchards",
        description:
          "Olive groves, orchards, vineyards, and oil crops shape both the landscape and the export economy."
      }),
      createRegionResourceIcon({
        tone: "gardenProduce",
        label: "Garden Produce",
        description:
          "Vegetables, herbs, dairy gardens, and smaller market crops fill the gaps between the larger estate harvests."
      }),
      createRegionResourceIcon({
        tone: "livestock",
        label: "Livestock",
        description:
          "Grazing herds, wool flocks, and dairy stock make the peninsula's agricultural belt resilient and tradable."
      }),
      createRegionResourceIcon({
        tone: "timber",
        label: "Timber",
        description:
          "Managed woodlands and ship-facing lumber yards provide structural timber for estates, workshops, and coastal trade."
      })
    ]
  },
  "region.shattercap_isles": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-shattercap-isles.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "North of the mainland, the Shattercap Isles rise from cold waters in a scatter of broken stone and narrow harbors. The sea defines everything here; the weather, the work, and the limits of where people can live.",
      "Most settlements cling to deep, reliable harbors where ships can anchor safely against the unpredictable northern waters. Fishing fleets leave at first light and return with cod and other cold-water catch, much of it salted and packed for shipment south. Salt itself is gathered in quantity along the coasts, making it one of the Isles' most consistent exports.",
      "The land offers little beyond this. Soil is thin, and what pasture exists supports only small herds. A handful of hardy crops grow in sheltered pockets, but they are not enough to sustain the population. Grain, vegetables, and wine arrive by ship from Verdant Thalos, and few island communities could endure long without that connection.",
      "Beyond the harbors, the terrain grows harsher. Beacon cliffs rise along the outer edges, crowned with watch posts and signal towers that keep constant vigil over the surrounding seas. These are not places of comfort, but of necessity; warning of storms, guiding ships, and marking the boundaries of safe passage. To an outsider, the Isles can feel stark and unforgiving. To those who live there, they are simply honest. The sea provides, the land endures, and everything else comes by sail."
    ]
  },
  "region.crownlands": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-crownlands.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "The Crownlands stand as the old heart of Valtherion, a region where the land has long been settled and carefully kept. Broad forest vales open into cultivated clearings, and rivers run steady between towns that seem as though they were placed with deliberate care rather than chance. Roads are reliable, settlements enduring, and the sense of continuity is felt in both stone and timber alike.",
      "The land provides well enough for those who dwell here, though never in excess. Grain and root crops are raised in the valleys, while livestock and managed game supplement the table. Rivers offer fish in steady supply, and the forests yield herbs and forage to those who know where to look. Few communities go without, though few would claim abundance.",
      "In materials, the Crownlands are better favored. Timber is plentiful and well-managed, iron is worked in moderate quantity, and stone is drawn where needed for walls, halls, and roads. Furs and smoked fish are common exports, and craftsmen here are known more for reliability than extravagance.",
      "Travelers often remark that the Crownlands feel older than the rest of Valtherion; not in years alone, but in habit. Things are maintained, not rebuilt; improved, not replaced. It is a land that endures by design."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "fieldCrops",
        label: "Field Crops",
        description:
          "Grain and root harvests from the river vales keep most Crownlands communities provisioned without true surplus."
      }),
      createRegionResourceIcon({
        tone: "fishAndGame",
        label: "Fish And Game",
        description:
          "Managed hunting grounds, river fish, furs, and smoked catch remain part of both the table and the trade roads."
      }),
      createRegionResourceIcon({
        tone: "timber",
        label: "Timber",
        description:
          "Old, carefully managed forests provide the beams, planks, and fuel that keep the region built to last."
      }),
      createRegionResourceIcon({
        tone: "ore",
        label: "Ore",
        description:
          "Iron is worked in moderate quantity, supporting dependable smithing rather than spectacular mineral wealth."
      }),
      createRegionResourceIcon({
        tone: "stone",
        label: "Stone",
        description:
          "Local quarries and cut-stone works support the roads, walls, bridges, and halls that define the old realm."
      })
    ]
  },
  "region.embersteppe": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-embersteppe.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "The Embersteppe spreads wide beneath an open sky, a land of grass and wind where distance is measured not in miles, but in days between water. The soil runs dry and red in places, and the horizon is rarely broken except by herds, low settlements, or the faint glow of controlled burns that renew the grazing lands.",
      "Life here follows the movement of animals more than the rhythm of crops. Herds of cattle, sheep, and horses form the foundation of both sustenance and wealth, and the people of the steppe are as skilled in their care as any farmer is with plow or field. Grain is grown where it can be, but it is never enough to stand alone, and much of it arrives from outside.",
      "The land offers little in timber or worked material, and so tools, wood, and finer goods are brought in through caravan trade. In return, the Embersteppe yields hides, wool, livestock, and the finest horse stock in Valtherion. Copper is found in places, though it is not the region's defining strength.",
      "Settlements gather where water allows; around wells, crossings, and guarded routes, but much of life remains in motion. To travel here is to feel the scale of the land and the independence of those who live upon it, where survival depends not on walls, but on knowledge of wind, grass, and season."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "livestock",
        label: "Livestock",
        description:
          "Cattle, sheep, and horse herds are the core wealth of the steppe and the first measure of local stability."
      }),
      createRegionResourceIcon({
        tone: "fieldCrops",
        label: "Field Crops",
        description:
          "Limited grain harvests appear where water and soil allow, but they do not carry the region on their own."
      }),
      createRegionResourceIcon({
        tone: "ore",
        label: "Ore",
        description:
          "Copper is worked in scattered pockets, adding trade value without replacing the steppe's pastoral identity."
      })
    ]
  },
  "region.sapphire_rivers": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-sapphire-rivers.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "The Sapphire Rivers form the great living network of Valtherion, a region where water and land work in constant partnership. Wide channels wind through fertile plains, feeding fields, orchards, and settlements that stretch in near-continuous succession along their banks.",
      "Here, the land yields generously. Grain grows in abundance, vegetables and flax fill the fields, and the river itself provides fish enough to sustain both local populations and trade beyond. Food is not merely sufficient; it is surplus, and much of it travels outward to support regions less fortunate.",
      "Settlements cluster at crossings, bends, and tributaries, where bridges and docks give rise to markets, mills, and thriving towns. Barges move steadily along the water, carrying grain, cloth, and crafted goods between communities. The river is both road and resource, and its flow dictates the pace of life as surely as any law.",
      "Stone, clay, and reeds are drawn easily from the land, supporting construction and craft, while metals are brought in from elsewhere. Yet it is not materials that define the Sapphire Rivers, but motion; of water, of goods, and of people. Travelers often find the region lively and full, a place where nearly every stretch of land serves a purpose, and where the work of the continent is plainly visible."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "fieldCrops",
        label: "Field Crops",
        description:
          "Grain, flax, and broad river-fed harvests make the basin one of Valtherion's major surplus producers."
      }),
      createRegionResourceIcon({
        tone: "orchards",
        label: "Orchards",
        description:
          "Fruit belts along the wider channels add steady value to the already fertile plain."
      }),
      createRegionResourceIcon({
        tone: "gardenProduce",
        label: "Garden Produce",
        description:
          "Vegetables, flax, reeds, and other water-favored crops fill the lands between the larger grain tracts."
      }),
      createRegionResourceIcon({
        tone: "fishAndGame",
        label: "Fish And Game",
        description:
          "River fisheries support both local food security and outward trade from the busiest crossings."
      }),
      createRegionResourceIcon({
        tone: "stone",
        label: "Stone",
        description:
          "Stone, clay, and riverbank building materials are easy to draw from the basin for roads, docks, and mills."
      })
    ]
  },
  "region.jade_expanse": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-jade-expanse.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "The Jade Expanse stretches across the southern reaches of Valtherion as a broad and fertile heartland, where fields, orchards, and pasturelands extend farther than the eye can follow. In season, the land takes on a deep green hue that gives the region its name, broken only by roads, farmsteads, and the distant rise of market towns.",
      "This is a land of abundance, though of a particular kind. Grain is grown in great quantity, supported by wide, open plains and well-managed fields. Orchard belts produce fruit in equal measure, and livestock, especially horses, are raised across the pasturelands that lie between cultivated zones. Brewing, storage, and trade define much of daily life, with granaries and cask houses standing as prominently as any hall or tower.",
      "Yet for all its richness in food and animal stock, the Jade Expanse lacks certain materials. Timber is scarce, and metal is not found in useful quantity, requiring both to be brought in from other regions. In this way, the Expanse trades its surplus harvest for the tools and structures it cannot produce itself.",
      "Settlements are numerous and well-spaced, tied together by wagon roads that carry grain, livestock, and goods toward distant markets. To the traveler, the region presents itself as generous and open, its wealth visible not in hidden resources, but in the sheer scale of what it produces. It is said that if Valtherion has a granary, it lies here, and that much of the continent eats, in some part, from the fields of the Jade Expanse."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "fieldCrops",
        label: "Field Crops",
        description:
          "Broad grain harvests and brewing grain dominate the Expanse and feed markets well beyond its own roads."
      }),
      createRegionResourceIcon({
        tone: "orchards",
        label: "Orchards",
        description:
          "Fruit belts and cask-bound orchard output are the region's second great food strength after grain."
      }),
      createRegionResourceIcon({
        tone: "livestock",
        label: "Livestock",
        description:
          "Pasturelands support cattle and horse breeding on a scale few regions of Valtherion can match."
      })
    ]
  },
  "region.sailors_verge": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-sailors-verge.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "Along the western and southern coasts of Serathyl stretches the Sailor's Verge, a region where land and sea meet in constant exchange. Estuaries widen into deep harbors, and the coastline is lined with ports whose masts form forests of their own. Here, trade is not an activity but a condition of life; ships arrive, depart, and are rebuilt in an unbroken cycle that defines the rhythm of the region.",
      "The Verge is fed by both water and land. Fisheries provide a steady yield, and coastal estates cultivate citrus groves, grain fields, and flax, supplying both food and sailcloth to the ports they serve. Yet the land alone does not sustain the region. Much of what is required to build and maintain its fleets, including iron, stone, and additional grain, must be brought in through the very trade networks the region commands.",
      "Shipyards, ropewalks, and curing houses dominate the working districts of its cities, while quieter hinterlands feed them with produce and fiber. Salt is gathered and used in preservation, and the smell of brine and timber is never far from any harbor street.",
      "To travelers, the Sailor's Verge appears vibrant and restless, a place where wealth flows in tides and fortunes are made as quickly as they are spent. It is the outward face of Serathyl, and the point through which the continent meets the wider world."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "fishAndGame",
        label: "Fish And Game",
        description:
          "Coastal fisheries provide a steady catch that feeds the ports and supports preserved exports."
      }),
      createRegionResourceIcon({
        tone: "orchards",
        label: "Orchards",
        description:
          "Citrus groves and other coastal estate fruit harvests thrive along the milder sea-facing lands."
      }),
      createRegionResourceIcon({
        tone: "fieldCrops",
        label: "Field Crops",
        description:
          "Grain fields and staple coastal harvests help provision the ports even if trade still carries the larger burden."
      }),
      createRegionResourceIcon({
        tone: "gardenProduce",
        label: "Garden Produce",
        description:
          "Flax, salt-cured produce, and other smaller estate goods support sailcloth, markets, and preservation work."
      })
    ]
  },
  "region.green_reach": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-green-reach.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "Inland from the coast lies the Green Reach, a region of deep forest and careful stewardship where the land is neither wild nor fully subdued. Towering hardwoods dominate the interior, broken by rivers that carry both water and timber toward the lowlands. The forest is worked, but not recklessly; its value lies as much in continuity as in yield.",
      "Settlements gather along the forest's edges and river routes, where logs can be cut, bound, and floated downstream to distant markets. Within the deeper heartwood, quieter communities tend to craft, herbal study, and the long management of the forest itself. Dyes, resins, and rare botanical goods are drawn from these woods, often as valuable as the timber that defines the region.",
      "Food is present, but never abundant. Small clearings and riverbanks support limited agriculture, while fishing and foraging supplement what cannot be grown. Grain and heavier goods are commonly brought in from beyond the forest, exchanged for lumber and crafted materials.",
      "The Green Reach is a place of patience. Its roads are fewer, its growth deliberate, and its people accustomed to working within the boundaries the forest allows. To pass through it is to move beneath a living canopy that shapes not only the land, but the lives built within it."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "timber",
        label: "Timber",
        description:
          "Hardwood, managed logging, and river-borne lumber are the Reach's defining material strength."
      }),
      createRegionResourceIcon({
        tone: "gardenProduce",
        label: "Garden Produce",
        description:
          "Dyes, resins, herbs, and other botanical goods make the worked forest valuable beyond straight lumber."
      }),
      createRegionResourceIcon({
        tone: "fishAndGame",
        label: "Fish And Game",
        description:
          "Fishing, foraging, and woodland game help cover the food the deeper forest cannot reliably grow."
      })
    ]
  },
  "region.windward_spine": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-windward-spine.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "Rising along Serathyl's northern reaches, the Windward Spine forms a jagged mountain chain that governs both weather and passage across the continent. Its peaks are cold, its passes narrow, and its slopes carved into terraces, holds, and fortified routes that serve as the only reliable crossings.",
      "Life here is shaped by necessity rather than comfort. Agriculture is nearly absent, and what little food exists locally is drawn from sparse grazing and stored provisions. Most sustenance arrives from lower lands, carried along guarded routes that are as valuable as the goods they transport.",
      "In contrast, the mountains yield considerable wealth in material. Stone is abundant and well-worked, while iron and silver are drawn from deep veins within the range. Settlements such as mountain holds anchor themselves directly into the rock, combining habitation, industry, and defense into a single structure. Along the higher passes, forts and outposts stand watch, controlling movement and exacting toll from those who cross.",
      "To travelers, the Windward Spine is both barrier and gateway. It is a land that resists settlement yet commands importance, where every road is deliberate and every hold serves a purpose. Few remain longer than they must, but all who cross it remember the journey."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "ore",
        label: "Ore",
        description:
          "Iron and silver veins make the Spine materially wealthy even where daily life remains austere."
      }),
      createRegionResourceIcon({
        tone: "stone",
        label: "Stone",
        description:
          "Quarry stone and worked mountain rock shape the holds, forts, and pass roads cut through the range."
      }),
      createRegionResourceIcon({
        tone: "livestock",
        label: "Livestock",
        description:
          "Sparse grazing and mountain wool are modest but necessary supports for the highland settlements."
      })
    ]
  },
  "region.heart_basin": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-heart-basin.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "At the center of Draemor lies the Heart Basin, a vast and fertile river network that defines the continent's identity as surely as any crown or banner. Wide, slow-moving waterways branch across the land, feeding floodplains that yield harvests in remarkable abundance. Fields stretch uninterrupted for miles, broken only by granaries, mills, and the clustered rooftops of farming towns.",
      "The Basin is first and foremost a producer of food. Grain dominates the landscape, supported by vegetables, livestock, and orchard belts that fill in the margins between river and road. Storage is as important as growth; granaries rise as prominently as halls, and much of the region's labor is devoted not to cultivation alone, but to preserving and distributing what is grown.",
      "Trade flows outward along the rivers. Barges heavy with grain and produce move steadily toward distant markets, supplying regions that cannot sustain themselves. While the Basin produces in excess, it still draws in what it cannot easily provide, including refined tools, worked metals, and certain finished goods, but these needs are minor compared to the scale of its exports.",
      "To the traveler, the Heart Basin feels expansive and grounded. It is a land defined not by landmarks, but by continuity; field after field, river after river, all working toward a single purpose: to feed."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "fieldCrops",
        label: "Field Crops",
        description:
          "Broad grain harvests dominate the Basin and make it the primary food-exporting heartland of Draemor."
      }),
      createRegionResourceIcon({
        tone: "gardenProduce",
        label: "Garden Produce",
        description:
          "Vegetables and other river-fed produce fill the margins between the grain tracts and the market roads."
      }),
      createRegionResourceIcon({
        tone: "livestock",
        label: "Livestock",
        description:
          "Cattle and other herd stock help diversify the Basin's food surplus and keep the market towns provisioned."
      }),
      createRegionResourceIcon({
        tone: "orchards",
        label: "Orchards",
        description:
          "Orchard belts and managed fruit lands round out the Basin's dependable harvest economy."
      })
    ]
  },
  "region.emerald_mantle": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-emerald-mantle.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "Encircling the Basin is the Emerald Mantle, a broad lowland belt where the land shifts from pure cultivation to a more varied and balanced countryside. Here, pasturelands, villages, and working roads define the region, creating a network of settlements that support both local life and the demands of the inner basin.",
      "The Mantle produces a wide range of goods, though rarely in the overwhelming quantities seen at the center. Livestock is common, with cattle and herd animals grazing across open fields, while orchards and managed groves provide fruit and secondary crops. Timber appears here in meaningful quantity, alongside hides and other products tied to animal husbandry.",
      "Unlike the Basin, the Emerald Mantle is less about scale and more about distribution. Market towns and road networks connect the interior to the outer regions, moving goods in all directions; food outward, materials inward, and everything in between. It serves as both buffer and bridge, ensuring that the productivity of Draemor does not remain isolated.",
      "Visitors often find the Mantle the most approachable part of the continent. It is neither as vast as the Basin nor as harsh as the coast, but instead a lived-in landscape of villages, trade routes, and steady work."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "livestock",
        label: "Livestock",
        description:
          "Cattle, herd stock, hides, and other husbandry goods are common across the Mantle's open lowlands."
      }),
      createRegionResourceIcon({
        tone: "orchards",
        label: "Orchards",
        description:
          "Fruit belts and managed groves support the Mantle's secondary harvests and market-road trade."
      }),
      createRegionResourceIcon({
        tone: "timber",
        label: "Timber",
        description:
          "Usable woodland and worked lumber appear here in meaningful quantity, unlike the more field-bound inner basin."
      }),
      createRegionResourceIcon({
        tone: "gardenProduce",
        label: "Garden Produce",
        description:
          "Herbs and smaller mixed-country harvests add variety to the Mantle's steadier flow of village goods."
      })
    ]
  },
  "region.stormcap_coast": {
    cardArt: {
      imageUrl: "/character-creator/regions/region-stormcap-coast.png",
      backgroundPosition: "center center",
      selectedBackgroundPosition: "right center"
    },
    descriptionParagraphs: [
      "At Draemor's southern edge, the Stormcap Coast meets the sea with a harsher face than the inland plains might suggest. Winds roll in unchecked, storms gather quickly, and the shoreline is shaped more by endurance than by ease of settlement. Harbors exist where they must, not where they are most convenient.",
      "The sea defines the region's output. Fisheries provide a steady and reliable yield, with cold-water catches forming the backbone of local sustenance and trade. Salt, drawn from coastal works and used in preservation, ensures that fish can travel inland to the Basin and beyond. Ports here are practical and hardened, built to withstand both weather and the demands of constant use.",
      "Agriculture exists only in limited form, constrained by terrain and climate, and much of the region's food is supplemented by shipments from the interior. In return, the Coast supplies what the inland cannot: marine goods, preserved fish, and access to open sea trade.",
      "To travelers, the Stormcap Coast feels like a boundary. It is where the ordered productivity of Draemor gives way to something less predictable, where the land ends and the wider world begins. Its ports are not the grandest, but they are among the most resilient."
    ],
    resourceIcons: [
      createRegionResourceIcon({
        tone: "fishAndGame",
        label: "Fish And Game",
        description:
          "Cold-water fisheries and preserved catches are the Coast's defining sustenance and its most dependable outward trade."
      })
    ]
  }
};

function createSettlementCardArt(assetSlug: string): WorldCardArt {
  return {
    imageUrl: `/character-creator/settlements/settlement-${assetSlug}.png`,
    backgroundPosition: "center 22%",
    selectedBackgroundPosition: "center 24%",
    selectedBackgroundSize: "auto 126%"
  };
}

const SETTLEMENT_CARD_ART_IDS = [
  "settlement.applemarsh",
  "settlement.ashsaddle",
  "settlement.aurelis",
  "settlement.barkmill_hamlet",
  "settlement.barleyhearth_estate",
  "settlement.basinford",
  "settlement.blackglass_camp",
  "settlement.blueflow",
  "settlement.breaksail",
  "settlement.bridgewatch_ferry",
  "settlement.brineharbor",
  "settlement.caskbank_estate",
  "settlement.cliffsalt_priory",
  "settlement.coalspur",
  "settlement.confederate_ford",
  "settlement.coppergate",
  "settlement.deepecho_camp",
  "settlement.dockreed_estate",
  "settlement.golden_barrow",
  "settlement.granary_crown",
  "settlement.greenharrow",
  "settlement.gullsreach",
  "settlement.harvestrest",
  "settlement.haywarden_estate",
  "settlement.headwater_bastion",
  "settlement.highcrown",
  "settlement.islemarket",
  "settlement.kelpnet_hamlet",
  "settlement.kingsbridge",
  "settlement.ledgerford",
  "settlement.longmeadow",
  "settlement.mastfield",
  "settlement.millrun",
  "settlement.mistfen_landing",
  "settlement.moonwell_grove",
  "settlement.northhook_keep",
  "settlement.northpass_redoubt",
  "settlement.obsidian_stair",
  "settlement.oliveford",
  "settlement.orchardhome",
  "settlement.passglass_hold",
  "settlement.pasturemeet",
  "settlement.quarrymule_camp",
  "settlement.redcliff_quay",
  "settlement.redreed_ford",
  "settlement.redroot_warrens",
  "settlement.riverthrone",
  "settlement.saltfang_anchorage",
  "settlement.seabanner",
  "settlement.silvergrove",
  "settlement.silvermere",
  "settlement.slatewake",
  "settlement.southlight",
  "settlement.southlock_ferry",
  "settlement.spicehook",
  "settlement.stepwell_redoubt",
  "settlement.stonevein",
  "settlement.stormwatch_citadel",
  "settlement.sunmeadow",
  "settlement.sunpasture_estate",
  "settlement.sunscar_watch",
  "settlement.sunspire_reach",
  "settlement.thornwatch",
  "settlement.tidecrown",
  "settlement.timbercross",
  "settlement.verdeward",
  "settlement.vinecross",
  "settlement.watchers_gate",
  "settlement.whitebark_gate"
] as const;

const SETTLEMENT_CARD_ART: Record<string, WorldCardArt> = Object.fromEntries(
  SETTLEMENT_CARD_ART_IDS.map((settlementId) => [
    settlementId,
    createSettlementCardArt(
      settlementId.replace(/^settlement\./, "").replaceAll("_", "-")
    )
  ])
) as Record<string, WorldCardArt>;

function titleCase(value: string): string {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function ensureSentence(value: string): string {
  if (value.trim().length === 0) {
    return "";
  }

  return /[.!?]$/.test(value.trim()) ? value.trim() : `${value.trim()}.`;
}

function formatPopulation(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatNarrativeList(values: string[], emptyValue: string): string {
  const filtered = values.filter((value) => value.trim().length > 0);

  if (filtered.length === 0) {
    return emptyValue;
  }

  if (filtered.length === 1) {
    return filtered[0]!;
  }

  if (filtered.length === 2) {
    return `${filtered[0]} and ${filtered[1]}`;
  }

  return `${filtered.slice(0, -1).join(", ")}, and ${filtered[filtered.length - 1]}`;
}

function narrativePhrase(value: string): string {
  return titleCase(value).toLowerCase();
}

function uniqueNarrativeValues(
  values: Array<string | null | undefined>,
  limit: number
): string[] {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => Boolean(value && value.trim().length > 0))
        .map((value) => narrativePhrase(value))
    )
  ).slice(0, limit);
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickSeeded<T>(seedBase: string, salt: string, values: readonly T[]): T {
  return values[hashString(`${seedBase}:${salt}`) % values.length]!;
}

function joinSentences(values: string[]): string {
  return values
    .filter((value) => value.trim().length > 0)
    .map((value) => ensureSentence(value))
    .join(" ");
}

const REGION_RESOURCE_ICON_RULES: ReadonlyArray<{
  tone: WorldRegionResourceTone;
  label: string;
  description: string;
  test: RegExp;
}> = [
  {
    tone: "timber",
    label: "Timber",
    description:
      "Wood, lumber, resin, and other forest materials are easy to source here.",
    test: /(timber|wood|forest|grove|lumber|tree|hardwood|rare_hardwood|resin|resin_timber|paper_inputs)/
  },
  {
    tone: "fieldCrops",
    label: "Field Crops",
    description:
      "Staple grains and broad farm harvests support food stores and everyday trade.",
    test: /(grain|wheat|barley|rye|farm|field|crop|flax|valley_produce|beer)/
  },
  {
    tone: "orchards",
    label: "Orchards",
    description:
      "Fruit trees, orchard goods, oil crops, or vineyard harvests are part of the region's output.",
    test: /(fruit|orchard|apple|pear|berry|vine|citrus|olive_oil|wine|tropical_fruit)/
  },
  {
    tone: "gardenProduce",
    label: "Garden Produce",
    description:
      "Vegetables, herbs, dyes, and smaller cultivated goods are commonly worked here.",
    test: /(vegetable|root|herb|garden|bean|onion|turnip|dyes|spices)/
  },
  {
    tone: "livestock",
    label: "Livestock",
    description:
      "Grazing herds, wool, hides, and animal stock are central to the region's day-to-day economy.",
    test: /(livestock|animal|cattle|horse|sheep|goat|hides|leather|wool|goat_wool|mountain_wool|pack_animals|horses)/
  },
  {
    tone: "fishAndGame",
    label: "Fish And Game",
    description:
      "Fisheries, furs, smoked catch, and hunted game help sustain local livelihoods.",
    test: /(game|hunt|fish|furs|cold_fish|river_fish|smoked_fish)/
  },
  {
    tone: "ore",
    label: "Ore",
    description:
      "Metal-bearing ground supports mining, smelting, or ore-haul trade in this region.",
    test: /(copper|iron|ore|gold|silver|tin|precious_metals|gems)/
  },
  {
    tone: "stone",
    label: "Stone",
    description:
      "Quarry stone, workable rock, clay, or other hard building materials are easy to draw from the land.",
    test: /(stone|quarry|granite|marble|clay|slate)/
  }
];

function deriveDifficulty(score: number | undefined): {
  label: "Gentle" | "Mild" | "Harsh";
  tone: "success" | "warning" | "danger";
} {
  if ((score ?? 0) >= 80) {
    return { label: "Gentle", tone: "success" };
  }
  if ((score ?? 0) >= 60) {
    return { label: "Mild", tone: "warning" };
  }
  return { label: "Harsh", tone: "danger" };
}

function deriveRegionDifficulty(record: RegionRecord): {
  label: "Gentle" | "Mild" | "Harsh";
  tone: "success" | "warning" | "danger";
} {
  const profile = record.simulationProfile;
  const stabilityScore =
    (profile?.foodProductionCapacity ?? 0) * 0.4 +
    (profile?.waterAvailability ?? 0) * 0.25 +
    (100 - (profile?.climateBurden ?? 100)) * 0.2 +
    (100 - (profile?.hazardPressure ?? 100)) * 0.15;

  if (stabilityScore >= 75) {
    return { label: "Gentle", tone: "success" };
  }

  if (stabilityScore >= 52) {
    return { label: "Mild", tone: "warning" };
  }

  return { label: "Harsh", tone: "danger" };
}

function deriveTradeRole(settlement: SettlementRecord): string {
  if (settlement.tradeDependencyProfile.exportBias - settlement.tradeDependencyProfile.importBias >= 0.18) {
    return "Exporter";
  }
  if (settlement.tradeDependencyProfile.importBias - settlement.tradeDependencyProfile.exportBias >= 0.18) {
    return "Importer";
  }
  return "Mixed";
}

function deriveDevelopmentLevel(settlement: SettlementRecord): string {
  const infra = settlement.infrastructureProfile;
  if (settlement.populationBand === "major" || infra.marketTier >= 4 || infra.overallLevel === "civic") {
    return "High";
  }
  if (settlement.populationBand === "large" || infra.marketTier >= 2 || infra.overallLevel === "established") {
    return "Moderate";
  }
  return "Low";
}

function describeContinent(record: RegionRecord): string {
  const summary = ensureSentence(record.summary ?? `${record.name} is a major world landmass`);
  const biomeNarrative = formatNarrativeList(
    (record.environmentProfile?.dominantBiomeMix ?? []).map(titleCase),
    "varied terrain"
  ).toLowerCase();
  const exportNarrative = formatNarrativeList(
    (record.economicProfile?.majorExports?.slice(0, 3) ?? record.economicProfile?.supplyStrengths?.slice(0, 3) ?? []).map(titleCase),
    "mixed staples"
  ).toLowerCase();
  const importNarrative = formatNarrativeList(
    (record.economicProfile?.majorImports?.slice(0, 2) ?? record.economicProfile?.demandPressures?.slice(0, 2) ?? []).map(titleCase),
    ""
  ).toLowerCase();

  return [
    summary,
    `It is a continent of ${biomeNarrative}.`,
    `${titleCase(record.name)} is best known for ${exportNarrative}.`,
    importNarrative ? `Merchants crossing its roads and shores often seek ${importNarrative} from beyond its own holdings.` : ""
  ]
    .filter((entry) => entry.length > 0)
    .join(" ");
}

function buildRegionTradeSentence(
  seedBase: string,
  context: {
    name: string;
    resourceList: string;
    primary: string;
    secondary: string;
    frontier: boolean;
    coastal: boolean;
    riverland: boolean;
  }
): string {
  if (context.frontier) {
    return pickSeeded(seedBase, "trade-frontier", [
      `Trade tends to stay practical rather than ornate, with routes valued for reliability more than luxury.`,
      `Markets favor durable goods and steady turnover, because distance and exposure punish anything too fragile.`,
      `Commerce is shaped by necessity first, so dependable shipments matter more than fashionable surplus.`
    ]);
  }

  if (context.coastal) {
    return pickSeeded(seedBase, "trade-coastal", [
      `Harbor traffic and shoreline exchange keep ${context.resourceList} circulating well beyond the nearest town.`,
      `Coastwise movement gives ${context.primary} and ${context.secondary} a broader market than the inland roads alone could support.`,
      `Sea-facing trade helps carry local output outward, turning nearby landfall and dock traffic into steady demand.`
    ]);
  }

  if (context.riverland) {
    return pickSeeded(seedBase, "trade-river", [
      `River movement keeps prices and supply tied together, so useful goods rarely stay isolated for long.`,
      `Waterborne traffic gives local markets an easier rhythm, letting everyday output move with unusual regularity.`,
      `Boats, ferries, and river settlements help keep trade nimble even when the roads are slower.`
    ]);
  }

  return pickSeeded(seedBase, "trade-general", [
    `Regional markets revolve around ${context.resourceList}, giving the area a practical economy with few idle trades.`,
    `Workshops, storehouses, and caravans all end up leaning on ${context.primary} and ${context.secondary} before long.`,
    `That balance gives the region a stable working economy instead of one narrow export story.`
  ]);
}

function buildRegionScarcitySentence(
  seedBase: string,
  context: {
    tertiary: string | null;
    fringe: string | null;
    climateList: string;
  }
): string {
  if (context.tertiary && context.fringe && context.tertiary !== context.fringe) {
    return pickSeeded(seedBase, "scarcity-paired", [
      `${context.tertiary} and ${context.fringe} show up in smaller pockets, so strangers usually do better with local guidance than guesswork.`,
      `Beyond the better-known staples, ${context.tertiary} and ${context.fringe} tend to appear by district, season, or local knowledge.`,
      `${context.tertiary} and ${context.fringe} are both present, but usually in a more selective and uneven spread than the leading goods.`
    ]);
  }

  if (context.tertiary) {
    return pickSeeded(seedBase, "scarcity-single", [
      `${context.tertiary} is still worth noting, though finding it consistently usually depends on knowing which pockets of land to trust.`,
      `${context.tertiary} appears often enough to matter, but not so evenly that newcomers can count on it everywhere.`,
      `${context.tertiary} remains part of the regional picture, usually in smaller runs or narrower local bands.`
    ]);
  }

  if (context.climateList.length > 0) {
    return pickSeeded(seedBase, "scarcity-climate", [
      `Travel planning still bends around ${context.climateList}, which can matter as much as inventory when someone moves through the district.`,
      `Weather remains part of the local bargaining logic, because ${context.climateList} can change what is easy to move from one stop to the next.`,
      `Even without a rare specialty good, the region still rewards people who respect its ${context.climateList} conditions.`
    ]);
  }

  return pickSeeded(seedBase, "scarcity-fallback", [
    `Local knowledge matters more than rumor once someone starts looking beyond the main staples.`,
    `The broad picture is easy enough to read, but the best opportunities still sit with people who know the ground well.`,
    `Visitors usually learn that the obvious goods are only part of the story once they start asking the right locals.`
  ]);
}

function buildRegionGeographySentence(
  seedBase: string,
  context: {
    name: string;
    elevation: string;
    biomeList: string;
    climateList: string;
  }
): string {
  const climateClause =
    context.climateList.length > 0
      ? ` under ${context.climateList} conditions`
      : "";

  return pickSeeded(seedBase, "geography", [
    `${context.name} stretches across ${context.elevation}, with ${context.biomeList} giving most of the landscape its character${climateClause}.`,
    `Most of the region is ${context.elevation}, and ${context.biomeList} set the tone of travel, settlement, and field work${climateClause}.`,
    `${titleCase(context.elevation)} shapes the region first, while ${context.biomeList} fill in the day-to-day feel of the land${climateClause}.`
  ]);
}

function buildRegionDescriptionParagraphs(record: RegionRecord): string[] {
  const override = REGION_PRESENTATION_OVERRIDES[record.id]?.descriptionParagraphs;

  if (override) {
    return override;
  }

  const seedBase = `${record.id}:${record.name}`;
  const summary = ensureSentence(record.summary ?? `${record.name} is a regional start area`);
  const climateEntries = Array.isArray(record.environmentProfile?.climateTendencies)
    ? record.environmentProfile?.climateTendencies
    : [record.environmentProfile?.climateTendencies];
  const biomes = uniqueNarrativeValues(
    record.environmentProfile?.dominantBiomeMix ?? [],
    3
  );
  const climates = uniqueNarrativeValues(climateEntries, 2);
  const resources = uniqueNarrativeValues(
    [
      ...(record.economicProfile?.supplyStrengths ?? []),
      ...(record.economicProfile?.majorExports ?? [])
    ],
    4
  );
  const elevation = narrativePhrase(
    record.environmentProfile?.elevationProfile ?? "mixed terrain"
  );
  const biomeList = formatNarrativeList(biomes, "mixed country");
  const climateList = formatNarrativeList(climates, "");
  const resourceList = formatNarrativeList(resources.slice(0, 3), "mixed staples");
  const primary = resources[0] ?? "mixed staples";
  const secondary = resources[1] ?? primary;
  const tertiary = resources[2] ?? null;
  const fringe = resources[3] ?? null;
  const geographySentence = buildRegionGeographySentence(seedBase, {
    name: record.name,
    elevation,
    biomeList,
    climateList
  });
  const tradeSentence = buildRegionTradeSentence(seedBase, {
    name: record.name,
    resourceList,
    primary,
    secondary,
    frontier:
      climates.includes("frontier") || record.tags.some((tag) => tag.includes("frontier")),
    coastal: /(coast|marine|shoals|estuary|mangrove)/.test(
      `${record.environmentProfile?.elevationProfile ?? ""} ${(record.environmentProfile?.dominantBiomeMix ?? []).join(" ")}`
    ),
    riverland: /(river|floodplain|marsh)/.test(
      (record.environmentProfile?.dominantBiomeMix ?? []).join(" ")
    )
  });
  const scarcitySentence = buildRegionScarcitySentence(seedBase, {
    tertiary,
    fringe,
    climateList
  });
  const identitySentence = pickSeeded(seedBase, "identity", [
    `${record.name} reads as a working region where ${resourceList} matter more than ornament.`,
    `The region carries itself like a practical country of ${biomeList} and useful output rather than idle excess.`,
    `${record.name} feels defined by what its land can sustain, not by any one ceremonial image.`
  ]);
  const resourceSentence = pickSeeded(seedBase, "resource", [
    `Local labor leans hardest on ${primary}, while ${secondary} is never far from the next bargain, workshop, or storehouse.`,
    `${primary} anchors much of the region's daily output, with ${secondary} adding steady value once goods begin to move.`,
    `The surest local wealth starts with ${primary}, and ${secondary} usually follows close behind in common trade.`
  ]);
  const travelerSentence = pickSeeded(seedBase, "traveler", [
    `A traveler notices the economy as quickly as the scenery, because useful goods sit close to everyday life here.`,
    `Visitors usually read the region through its roads, stalls, and working ground as much as through any formal border.`,
    `The place introduces itself through its labor and terrain at the same time, which makes it feel lived-in rather than staged.`
  ]);
  const paragraphs = pickSeeded(seedBase, "template", [
    [
      joinSentences([summary, geographySentence]),
      joinSentences([resourceSentence, tradeSentence, scarcitySentence])
    ],
    [
      joinSentences([summary, resourceSentence]),
      joinSentences([geographySentence, tradeSentence, scarcitySentence])
    ],
    [
      joinSentences([summary, travelerSentence]),
      joinSentences([geographySentence, resourceSentence, scarcitySentence])
    ],
    [
      joinSentences([summary, identitySentence]),
      joinSentences([resourceSentence, tradeSentence, scarcitySentence])
    ]
  ]);

  return paragraphs.filter((paragraph) => paragraph.trim().length > 0);
}

function deriveResourceIconsFromKeywords(
  keywords: string,
  fallback: WorldRegionResourceIcon[] = []
): WorldRegionResourceIcon[] {
  const matched = REGION_RESOURCE_ICON_RULES.filter((rule) => rule.test.test(keywords))
    .slice(0, 4)
    .map(({ tone, label, description }) =>
      createRegionResourceIcon({
        tone,
        label,
        description
      })
    );

  if (matched.length > 0) {
    return matched;
  }

  return fallback.slice(0, 4);
}

function deriveRegionResourceIcons(record: RegionRecord): WorldRegionResourceIcon[] {
  const override = REGION_PRESENTATION_OVERRIDES[record.id]?.resourceIcons;

  if (override) {
    return override;
  }

  const keywords = [
    ...(record.economicProfile?.supplyStrengths ?? []),
    ...(record.economicProfile?.majorExports ?? []),
    ...(record.environmentProfile?.dominantBiomeMix ?? [])
  ]
    .join(" ")
    .toLowerCase();

  return deriveResourceIconsFromKeywords(keywords);
}

function deriveSettlementResourceIcons(
  settlement: SettlementRecord,
  region: RegionRecord
): WorldRegionResourceIcon[] {
  const fallback = deriveRegionResourceIcons(region);
  const keywords = [
    settlement.settlementType,
    settlement.economicModel.dominantRole,
    ...(settlement.economicModel.secondaryRoles ?? []),
    ...(settlement.domesticResourceProfile.primaryGoods ?? []),
    ...(settlement.domesticResourceProfile.secondaryGoods ?? []),
    ...(settlement.identityTags ?? []),
    ...(settlement.purposeTags ?? []),
    ...(region.economicProfile?.supplyStrengths ?? [])
  ]
    .join(" ")
    .toLowerCase();

  return deriveResourceIconsFromKeywords(keywords, fallback);
}

function deriveAuthorityLabel(settlement: SettlementRecord, landAuthorityType: LandAuthorityType): string {
  if (settlement.identityTags.includes("monastery") || settlement.purposeTags.includes("pilgrimage")) {
    return `${settlement.name} Temple Estates`;
  }

  switch (landAuthorityType) {
    case "military_control":
      return `${settlement.name} Garrison Command`;
    case "guild_controlled":
      return `${settlement.name} Market Charter`;
    case "frontier_claim":
      return `${settlement.name} Frontier Office`;
    case "noble_direct":
      return `${settlement.name} Estate Holders`;
    case "mixed":
      return `${settlement.name} Mixed Council`;
    default:
      return `${settlement.name} Civic Council`;
  }
}

function deriveLandRestrictionSummary(params: {
  settlement: SettlementRecord;
  landAuthorityType: LandAuthorityType;
  access: SettlementStartAccessState;
  hasBackstorySelection: boolean;
}): SettlementLandRestrictionSummary {
  const authorityLabel = deriveAuthorityLabel(params.settlement, params.landAuthorityType);
  const purchaseRequirements: string[] = [];
  let propertyNarrative = "";

  if (params.landAuthorityType === "military_control") {
    propertyNarrative = `Plots here are held by ${authorityLabel}, and they do not sell land within the walls. Any holding near the garrison is granted only through service, favor, or formal sponsorship.`;
  } else if (params.landAuthorityType === "guild_controlled") {
    propertyNarrative = `Plots here are held by ${authorityLabel}, and they do not sell city lots freely. Workshop frontage and central holdings are leased only through charter, while some outer wards may be opened to proven petitioners.`;
    purchaseRequirements.push("coin", "guild standing", "a declared business plan", "working capital");
  } else if (params.landAuthorityType === "frontier_claim") {
    propertyNarrative = `Plots here are marked by ${authorityLabel}, and they will hear claims for rough land beyond the safest streets. Holdings are easier to secure, but the burden of clearing and defending them falls on the buyer.`;
    purchaseRequirements.push("coin", "tools or labor", "proof of intent to improve the claim");
  } else if (params.landAuthorityType === "noble_direct") {
    propertyNarrative = `Plots here are held by ${authorityLabel}, and they do not part with choice land lightly. Some fringe estates may be granted or leased, but the inner wards remain in the hands of titled houses and their retainers.`;
    purchaseRequirements.push("coin", "standing", "sponsorship", "proof of usefulness");
  } else if (params.landAuthorityType === "mixed") {
    propertyNarrative = `Plots here are divided under ${authorityLabel}. Some city parcels change hands through council petition, while outer holdings are more easily bought or leased by households with good standing.`;
    purchaseRequirements.push("coin", "local standing", "declared household or trade purpose");
  } else if (params.settlement.identityTags.includes("monastery") || params.settlement.purposeTags.includes("pilgrimage")) {
    propertyNarrative = `Plots here are watched by ${authorityLabel}, and they do not sell the sacred precincts. A few outer plots may be leased to trusted households who do not disturb the holy order.`;
    purchaseRequirements.push("coin", "good standing", "temple approval");
  } else {
    propertyNarrative = `Plots here are held by ${authorityLabel}, and they will hear petitions for private lots within and beyond the settled wards. The nearer the market streets, the more carefully each claim is weighed.`;
    purchaseRequirements.push("coin", "good standing", "declared trade or household purpose");
  }

  const currentStanding = !params.hasBackstorySelection
    ? "No clerk or magistrate has judged your standing here yet. Declare your backstory and lawful standing before the city can speak on what place, if any, may be granted to you."
    : params.access.accessStatus === "allowed"
      ? "As matters now stand, you would be admitted lawfully and your petition for residence or purchase would at least be heard."
      : `As matters now stand, this city would not yet grant you a lawful place within its bounds. ${params.access.notes[0] ?? "A different backstory, sponsor, or destination would be needed."}`;

  return {
    authorityLabel,
    propertyNarrative,
    currentStanding,
    purchaseRequirements: params.hasBackstorySelection ? purchaseRequirements : []
  };
}

function deriveSettlementDetails(
  settlement: SettlementRecord,
  region: RegionRecord,
  locality: LocalityRecord,
  backstoryId: string
): Pick<WorldSettlementOption, "access" | "landAuthorityType" | "guilds" | "magic"> {
  const landAuthorityType = deriveLandAuthorityType(settlement);
  const access = deriveSettlementStartAccess({
    settlement,
    landAuthorityType,
    backstoryId
  });

  if (!religionCatalog) {
    return {
      access,
      landAuthorityType,
      guilds: [],
      magic: []
    };
  }

  const religion = deriveSettlementReligion({
    settlement,
    region,
    locality,
    religionCatalog
  });
  const guilds = deriveSettlementGuildInstances({
    settlement,
    guildCatalog,
    religionOrganizationIds: religion.organizationIds
  });
  const crystalReserves = deriveSettlementCrystalReserves({
    settlement,
    region,
    locality,
    religion,
    crystalCatalog
  });
  const magic = deriveSettlementMagicInfrastructure({
    settlement,
    guilds,
    religion,
    crystalReserves,
    magicCatalog
  });

  return {
    access,
    landAuthorityType,
    guilds,
    magic
  };
}

export function getWorldContinentOptions(): WorldContinentOption[] {
  return regionRecords
    .filter((record) => record.regionType === "continent" || record.regionType === "island_system")
    .map((record) => {
      const difficulty = deriveDifficulty(record.simulationProfile?.habitationScore);

      return {
        id: record.id,
        label: record.name,
        climate: Array.isArray(record.environmentProfile?.climateTendencies)
          ? record.environmentProfile?.climateTendencies.join(", ")
          : record.environmentProfile?.climateTendencies ?? "Unknown climate",
        biomeMix: record.environmentProfile?.dominantBiomeMix ?? [],
        difficultyLabel: difficulty.label,
        difficultyTone: difficulty.tone,
        dominantResources:
          record.economicProfile?.majorExports?.slice(0, 4) ??
          record.economicProfile?.supplyStrengths?.slice(0, 4) ??
          [],
        tradeCharacteristics:
          record.economicProfile?.majorImports?.slice(0, 2) ??
          record.economicProfile?.demandPressures?.slice(0, 2) ??
          [],
        description: describeContinent(record)
      };
    });
}

export function getContinentCardArt(continentId: string): WorldCardArt | null {
  return CONTINENT_CARD_ART[continentId] ?? null;
}

export function getRegionCardArt(regionId: string): WorldCardArt | null {
  return REGION_PRESENTATION_OVERRIDES[regionId]?.cardArt ?? null;
}

export function getSettlementCardArt(settlementId: string): WorldCardArt | null {
  return SETTLEMENT_CARD_ART[settlementId] ?? null;
}

export function getWorldRegionOptions(continentId: string): WorldRegionOption[] {
  const childRegions = regionRecords.filter((record) => record.parentRegionId === continentId && record.regionType === "subregion");
  const sourceRegions =
    childRegions.length > 0
      ? childRegions
      : regionRecords.filter((record) => record.id === continentId && record.regionType === "island_system");

  return sourceRegions
    .map((record) => {
      const descriptionParagraphs = buildRegionDescriptionParagraphs(record);
      const difficulty = deriveRegionDifficulty(record);

      return {
        id: record.id,
        continentId,
        label: record.name,
        difficultyLabel: difficulty.label,
        difficultyTone: difficulty.tone,
        terrainAndBiome: `${record.environmentProfile?.elevationProfile ?? "mixed terrain"} | ${(record.environmentProfile?.dominantBiomeMix ?? []).join(", ")}`,
        resourceAvailability:
          record.economicProfile?.supplyStrengths?.slice(0, 4) ?? record.economicProfile?.majorExports?.slice(0, 4) ?? [],
        resourceIcons: deriveRegionResourceIcons(record),
        populationDensity: titleCase(record.simulationProfile?.densityBand ?? "moderate"),
        economicProfile: [
          record.economicProfile?.majorExports?.[0],
          record.economicProfile?.majorImports?.[0]
        ].filter((value): value is string => Boolean(value)),
        description: descriptionParagraphs.join(" "),
        descriptionParagraphs
      };
    });
}

export function getWorldSettlementOptions(params: {
  continentId: string;
  regionId: string;
  backstoryId: string;
}): WorldSettlementOption[] {
  return settlementRecords
    .filter((record) => record.macroRegionId === params.continentId && record.regionId === params.regionId)
    .map((record) => {
      const region = regionById.get(record.regionId);
      const locality = localityById.get(record.localityBandId);

      if (!region || !locality) {
        return null;
      }

      const details = deriveSettlementDetails(record, region, locality, params.backstoryId);
      const hasBackstorySelection = params.backstoryId.trim().length > 0;

      return {
        id: record.id,
        regionId: record.regionId,
        continentId: record.macroRegionId,
        label: record.name,
        populationSize: formatPopulation(record.populationTotal),
        settlementType: titleCase(record.settlementType),
        dominantIndustries: [record.economicModel.dominantRole, ...record.economicModel.secondaryRoles].slice(0, 4).map(titleCase),
        keyResources: [...record.domesticResourceProfile.primaryGoods, ...record.domesticResourceProfile.secondaryGoods].slice(0, 4),
        resourceIcons: deriveSettlementResourceIcons(record, region),
        tradeRole: deriveTradeRole(record),
        developmentLevel: deriveDevelopmentLevel(record),
        access: details.access,
        landAuthorityType: details.landAuthorityType,
        landRestriction: deriveLandRestrictionSummary({
          settlement: record,
          landAuthorityType: details.landAuthorityType,
          access: details.access,
          hasBackstorySelection
        }),
        guilds: details.guilds,
        magic: details.magic,
        description: ensureSentence(record.summary)
      };
    })
    .filter((record): record is WorldSettlementOption => record !== null);
}

export function getPreferredWorldSettlementOption(params: {
  continentId: string;
  regionId: string;
  backstoryId: string;
}): WorldSettlementOption | null {
  const options = getWorldSettlementOptions(params);

  return options.find((option) => option.access.accessStatus === "allowed") ?? options[0] ?? null;
}

export function getDefaultWorldSelection(backstoryId: string): {
  continentId: string;
  regionId: string;
  settlementId: string;
} {
  const continents = getWorldContinentOptions();
  const firstAllowedSelection = continents
    .flatMap((continent) =>
      getWorldRegionOptions(continent.id).map((region) => ({
        continent,
        region,
        settlement: getPreferredWorldSettlementOption({
          continentId: continent.id,
          regionId: region.id,
          backstoryId
        })
      }))
    )
    .find((selection) => selection.settlement?.access.accessStatus === "allowed");
  const fallbackContinent = continents[0] ?? null;
  const fallbackRegion = fallbackContinent ? getWorldRegionOptions(fallbackContinent.id)[0] ?? null : null;
  const fallbackSettlement =
    fallbackContinent && fallbackRegion
      ? getPreferredWorldSettlementOption({
          continentId: fallbackContinent.id,
          regionId: fallbackRegion.id,
          backstoryId
        })
      : null;
  const continent = firstAllowedSelection?.continent ?? fallbackContinent;
  const region = firstAllowedSelection?.region ?? fallbackRegion;
  const settlement = firstAllowedSelection?.settlement ?? fallbackSettlement;

  return {
    continentId: continent?.id ?? "",
    regionId: region?.id ?? "",
    settlementId: settlement?.id ?? ""
  };
}

export function resolveWorldSelection(params: {
  continentId: string;
  regionId: string;
  settlementId: string;
  backstoryId: string;
}): ResolvedWorldSelection | null {
  const continent = getWorldContinentOptions().find((record) => record.id === params.continentId);
  const regionOption = getWorldRegionOptions(params.continentId).find((record) => record.id === params.regionId);
  const settlementOption = getWorldSettlementOptions({
    continentId: params.continentId,
    regionId: params.regionId,
    backstoryId: params.backstoryId
  }).find((record) => record.id === params.settlementId);
  const settlementRecord = settlementRecords.find((record) => record.id === params.settlementId);
  const regionRecord = settlementRecord ? regionById.get(settlementRecord.regionId) : null;
  const localityRecord = settlementRecord ? localityById.get(settlementRecord.localityBandId) : null;

  if (!continent || !regionOption || !settlementOption || !settlementRecord || !regionRecord || !localityRecord) {
    return null;
  }

  return {
    continent,
    region: regionOption,
    settlement: settlementOption,
    settlementRecord,
    regionRecord,
    localityRecord
  };
}
