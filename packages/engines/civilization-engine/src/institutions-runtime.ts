import type {
  SettlementInstitutionProfileState,
  SettlementMarketState
} from "../../../shared/types/src/index.js";
import {
  deriveSettlementInstitutionProfile
} from "../../../shared/types/src/index.js";
import {
  loadCrystalCatalogContent,
  loadGuildContent,
  loadMagicInfrastructureContent,
  loadRegionContent,
  loadRegionLocalityContent,
  loadReligionContent,
  loadSettlementContent
} from "./content.js";
import { buildSettlementSimulationProfiles } from "./settlement-simulation.js";

type InstitutionIndexes = {
  settlementsById: Map<string, ReturnType<typeof loadSettlementContent>[number]>;
  regionsById: Map<string, ReturnType<typeof loadRegionContent>[number]>;
  localitiesById: Map<string, ReturnType<typeof loadRegionLocalityContent>[number]>;
  religionCatalog: ReturnType<typeof loadReligionContent>[number] | null;
  guildCatalog: ReturnType<typeof loadGuildContent>;
  magicCatalog: ReturnType<typeof loadMagicInfrastructureContent>;
  crystalCatalog: ReturnType<typeof loadCrystalCatalogContent>;
};

let institutionIndexesCache: InstitutionIndexes | null = null;

function getIndexes(): InstitutionIndexes {
  if (!institutionIndexesCache) {
    const settlements = loadSettlementContent();
    const regions = loadRegionContent();
    const localities = loadRegionLocalityContent();

    institutionIndexesCache = {
      settlementsById: new Map(settlements.map((record) => [record.id, record])),
      regionsById: new Map(regions.map((record) => [record.id, record])),
      localitiesById: new Map(localities.map((record) => [record.id, record])),
      religionCatalog: loadReligionContent()[0] ?? null,
      guildCatalog: loadGuildContent(),
      magicCatalog: loadMagicInfrastructureContent(),
      crystalCatalog: loadCrystalCatalogContent()
    };
  }

  return institutionIndexesCache;
}

export function buildSettlementInstitutionProfiles(params: {
  settlementIds: string[];
  marketStates: SettlementMarketState[];
}): SettlementInstitutionProfileState[] {
  const indexes = getIndexes();
  const religionCatalog = indexes.religionCatalog;

  if (!religionCatalog) {
    return [];
  }

  const simulationProfiles = buildSettlementSimulationProfiles({
    settlementIds: params.settlementIds,
    marketStates: params.marketStates
  });

  return simulationProfiles.flatMap((simulation) => {
    const settlement = indexes.settlementsById.get(simulation.settlementId);
    const region = settlement ? indexes.regionsById.get(settlement.regionId) : null;
    const locality = settlement ? indexes.localitiesById.get(settlement.localityBandId) : null;

    if (!settlement || !region || !locality) {
      return [];
    }

    return [
      deriveSettlementInstitutionProfile({
        settlement,
        region,
        locality,
        guildCatalog: indexes.guildCatalog,
        religionCatalog,
        magicCatalog: indexes.magicCatalog,
        crystalCatalog: indexes.crystalCatalog,
        simulation
      })
    ];
  });
}

export function resolveSettlementInstitutionProfile(params: {
  settlementId: string;
  marketStates: SettlementMarketState[];
}): SettlementInstitutionProfileState | null {
  return (
    buildSettlementInstitutionProfiles({
      settlementIds: [params.settlementId],
      marketStates: params.marketStates
    })[0] ?? null
  );
}
