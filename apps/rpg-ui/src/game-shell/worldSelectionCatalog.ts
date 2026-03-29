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
}

export interface WorldRegionResourceIcon {
  icon: IconName;
  label: string;
  description: string;
}

export interface WorldRegionOption {
  id: string;
  continentId: string;
  label: string;
  terrainAndBiome: string;
  resourceAvailability: string[];
  resourceIcons: WorldRegionResourceIcon[];
  populationDensity: string;
  economicProfile: string[];
  description: string;
  descriptionParagraphs: string[];
}

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
  icon: IconName;
  label: string;
  description: string;
  test: RegExp;
}> = [
  {
    icon: "tree",
    label: "Timber",
    description:
      "Wood, lumber, resin, and other forest materials are easy to source here.",
    test: /(timber|wood|forest|grove|lumber|tree|hardwood|rare_hardwood|resin|resin_timber|paper_inputs)/
  },
  {
    icon: "grain",
    label: "Field Crops",
    description:
      "Staple grains and broad farm harvests support food stores and everyday trade.",
    test: /(grain|wheat|barley|rye|farm|field|crop|flax|valley_produce|beer)/
  },
  {
    icon: "fruit",
    label: "Orchards",
    description:
      "Fruit trees, orchard goods, oil crops, or vineyard harvests are part of the region's output.",
    test: /(fruit|orchard|apple|pear|berry|vine|citrus|olive_oil|wine|tropical_fruit)/
  },
  {
    icon: "vegetable",
    label: "Garden Produce",
    description:
      "Vegetables, herbs, dyes, and smaller cultivated goods are commonly worked here.",
    test: /(vegetable|root|herb|garden|bean|onion|turnip|dyes|spices)/
  },
  {
    icon: "animal",
    label: "Herd And Catch",
    description:
      "Livestock, wool, hides, fish, or hunted game help sustain local livelihoods.",
    test: /(livestock|animal|cattle|horse|sheep|goat|game|hunt|fish|furs|hides|leather|wool|goat_wool|mountain_wool|pack_animals|horses|cold_fish|river_fish|smoked_fish)/
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

function deriveRegionResourceIcons(record: RegionRecord): WorldRegionResourceIcon[] {
  const keywords = [
    ...(record.economicProfile?.supplyStrengths ?? []),
    ...(record.economicProfile?.majorExports ?? []),
    ...(record.environmentProfile?.dominantBiomeMix ?? [])
  ]
    .join(" ")
    .toLowerCase();

  return REGION_RESOURCE_ICON_RULES.filter((rule) => rule.test.test(keywords))
    .slice(0, 4)
    .map(({ icon, label, description }) => ({
      icon,
      label,
      description
    }));
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
  hasPathAndBackstory: boolean;
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

  const currentStanding = !params.hasPathAndBackstory
    ? "No clerk or magistrate has judged your standing here yet. Declare both your past and your chosen path before the city can speak on what place, if any, may be granted to you."
    : params.access.accessStatus === "allowed"
      ? "As matters now stand, you would be admitted lawfully and your petition for residence or purchase would at least be heard."
      : `As matters now stand, this city would not yet grant you a lawful place within its bounds. ${params.access.notes[0] ?? "A different past, path, or destination would be needed."}`;

  return {
    authorityLabel,
    propertyNarrative,
    currentStanding,
    purchaseRequirements: params.hasPathAndBackstory ? purchaseRequirements : []
  };
}

function deriveSettlementDetails(
  settlement: SettlementRecord,
  region: RegionRecord,
  locality: LocalityRecord,
  classId: string,
  backgroundId: string
): Pick<WorldSettlementOption, "access" | "landAuthorityType" | "guilds" | "magic"> {
  const landAuthorityType = deriveLandAuthorityType(settlement);
  const access = deriveSettlementStartAccess({
    settlement,
    landAuthorityType,
    classId,
    backgroundId
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

export function getWorldRegionOptions(continentId: string): WorldRegionOption[] {
  const childRegions = regionRecords.filter((record) => record.parentRegionId === continentId && record.regionType === "subregion");
  const sourceRegions =
    childRegions.length > 0
      ? childRegions
      : regionRecords.filter((record) => record.id === continentId && record.regionType === "island_system");

  return sourceRegions
    .map((record) => {
      const descriptionParagraphs = buildRegionDescriptionParagraphs(record);

      return {
        id: record.id,
        continentId,
        label: record.name,
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
  classId: string;
  backgroundId: string;
}): WorldSettlementOption[] {
  return settlementRecords
    .filter((record) => record.macroRegionId === params.continentId && record.regionId === params.regionId)
    .map((record) => {
      const region = regionById.get(record.regionId);
      const locality = localityById.get(record.localityBandId);

      if (!region || !locality) {
        return null;
      }

      const details = deriveSettlementDetails(record, region, locality, params.classId, params.backgroundId);
      const hasPathAndBackstory = params.classId.trim().length > 0 && params.backgroundId.trim().length > 0;

      return {
        id: record.id,
        regionId: record.regionId,
        continentId: record.macroRegionId,
        label: record.name,
        populationSize: formatPopulation(record.populationTotal),
        settlementType: titleCase(record.settlementType),
        dominantIndustries: [record.economicModel.dominantRole, ...record.economicModel.secondaryRoles].slice(0, 4).map(titleCase),
        keyResources: [...record.domesticResourceProfile.primaryGoods, ...record.domesticResourceProfile.secondaryGoods].slice(0, 4),
        tradeRole: deriveTradeRole(record),
        developmentLevel: deriveDevelopmentLevel(record),
        access: details.access,
        landAuthorityType: details.landAuthorityType,
        landRestriction: deriveLandRestrictionSummary({
          settlement: record,
          landAuthorityType: details.landAuthorityType,
          access: details.access,
          hasPathAndBackstory
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
  classId: string;
  backgroundId: string;
}): WorldSettlementOption | null {
  const options = getWorldSettlementOptions(params);

  return options.find((option) => option.access.accessStatus === "allowed") ?? options[0] ?? null;
}

export function getDefaultWorldSelection(classId: string, backgroundId: string): {
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
          classId,
          backgroundId
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
          classId,
          backgroundId
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
  classId: string;
  backgroundId: string;
}): ResolvedWorldSelection | null {
  const continent = getWorldContinentOptions().find((record) => record.id === params.continentId);
  const regionOption = getWorldRegionOptions(params.continentId).find((record) => record.id === params.regionId);
  const settlementOption = getWorldSettlementOptions({
    continentId: params.continentId,
    regionId: params.regionId,
    classId: params.classId,
    backgroundId: params.backgroundId
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
