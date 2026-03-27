import type {
  CrystalCatalogRecord,
  InstitutionGuildCatalogRecord,
  InstitutionLocalityRecord,
  InstitutionRegionRecord,
  InstitutionSettlementRecord,
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
  survivabilityLabel: string;
  dominantResources: string[];
  tradeCharacteristics: string[];
  description: string;
}

export interface WorldRegionOption {
  id: string;
  continentId: string;
  label: string;
  terrainAndBiome: string;
  resourceAvailability: string[];
  populationDensity: string;
  economicProfile: string[];
  description: string;
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

function titleCase(value: string): string {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatPopulation(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function deriveSurvivabilityLabel(score: number | undefined): string {
  if ((score ?? 0) >= 80) {
    return "High";
  }
  if ((score ?? 0) >= 60) {
    return "Moderate";
  }
  return "Harsh";
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
    .map((record) => ({
      id: record.id,
      label: record.name,
      climate: Array.isArray(record.environmentProfile?.climateTendencies)
        ? record.environmentProfile?.climateTendencies.join(", ")
        : record.environmentProfile?.climateTendencies ?? "Unknown climate",
      biomeMix: record.environmentProfile?.dominantBiomeMix ?? [],
      survivabilityLabel: deriveSurvivabilityLabel(record.simulationProfile?.habitationScore),
      dominantResources:
        record.economicProfile?.majorExports?.slice(0, 4) ??
        record.economicProfile?.supplyStrengths?.slice(0, 4) ??
        [],
      tradeCharacteristics:
        record.economicProfile?.majorImports?.slice(0, 2) ??
        record.economicProfile?.demandPressures?.slice(0, 2) ??
        [],
      description: record.summary ?? `${record.name} is a major world landmass.`
    }));
}

export function getWorldRegionOptions(continentId: string): WorldRegionOption[] {
  const childRegions = regionRecords.filter((record) => record.parentRegionId === continentId && record.regionType === "subregion");
  const sourceRegions =
    childRegions.length > 0
      ? childRegions
      : regionRecords.filter((record) => record.id === continentId && record.regionType === "island_system");

  return sourceRegions
    .map((record) => ({
      id: record.id,
      continentId,
      label: record.name,
      terrainAndBiome: `${record.environmentProfile?.elevationProfile ?? "mixed terrain"} | ${(record.environmentProfile?.dominantBiomeMix ?? []).join(", ")}`,
      resourceAvailability:
        record.economicProfile?.supplyStrengths?.slice(0, 4) ?? record.economicProfile?.majorExports?.slice(0, 4) ?? [],
      populationDensity: titleCase(record.simulationProfile?.densityBand ?? "moderate"),
      economicProfile: [
        record.economicProfile?.majorExports?.[0],
        record.economicProfile?.majorImports?.[0]
      ].filter((value): value is string => Boolean(value)),
      description: record.summary ?? `${record.name} is a derived regional start area.`
    }));
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
        guilds: details.guilds,
        magic: details.magic,
        description: record.summary
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
