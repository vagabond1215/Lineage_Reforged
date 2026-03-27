import type {
  CivilizationTransportState,
  InvalidSettlementGeographyState,
  SettlementMarketState,
  SimulationConsistencyGoodsCoverageState,
  SimulationConsistencyReportState,
  UnrealisticTradeDispatchState
} from "../../../shared/types/src/index.js";
import {
  loadBuildingContent,
  loadFaunaContent,
  loadFloraContent,
  loadItemContent,
  loadMineralContent,
  loadMonsterContent,
  loadProductionChainContent,
  loadRegionLocalityContent,
  loadSettlementContent,
  loadWorkplaceContent,
  loadWorldHexContent,
  type FaunaContentRecord,
  type FloraContentRecord,
  type ItemContentRecord,
  type MonsterContentRecord,
  type ProductionChainRecord
} from "./content.js";
import { resolveResourceFamilies } from "./resource-taxonomy.js";
import { evaluateAutonomousTradeOpportunities } from "./trade-runtime.js";
import { createEmptyCivilizationTransportState } from "./transport-runtime.js";

type RuntimeItemRecord = ItemContentRecord & {
  aliasKeys?: string[];
  provenance?: {
    sourceType?: string;
  };
};

const ESSENTIAL_GOODS = [
  { groupId: "agricultural_tools", requiredKeys: ["plow", "hoe", "sickle", "scythe", "rake", "shovel", "pitchfork", "flail"] },
  { groupId: "transport_support", requiredKeys: ["harness", "yoke", "reins", "saddle", "pack_frame", "wagon_wheel", "wagon_fittings"] },
  { groupId: "containers", requiredKeys: ["basket", "sack", "crate", "barrel", "jar", "glass_bottle", "glass_jar", "backpack"] },
  { groupId: "clothing", requiredKeys: ["tunic", "cloak", "apron", "gloves", "boots", "work_hat", "hood", "helmet"] },
  { groupId: "survival", requiredKeys: ["candle", "lantern", "oil", "soap", "blanket", "rope"] },
  { groupId: "fuel", requiredKeys: ["firewood", "charcoal"] },
  { groupId: "food", requiredKeys: ["grain", "meat", "fish", "dairy", "produce", "ale", "wine"] },
  { groupId: "wild_resources", requiredKeys: ["hide_raw", "fur", "wild_meat", "herbs_raw"] }
] as const;

const ESSENTIAL_FAMILY_FALLBACKS = new Map<string, string[]>([
  ["grain", ["grain"]],
  ["meat", ["meat"]],
  ["fish", ["fish"]],
  ["produce", ["vegetables", "fruit"]],
  ["fur", ["fur"]]
]);

function uniqueStrings(values: Iterable<string>): string[] {
  return [...new Set([...values].filter((value) => typeof value === "string" && value.length > 0))].sort((left, right) =>
    left.localeCompare(right)
  );
}

function buildAliasMap(items: RuntimeItemRecord[]): Map<string, string> {
  const aliasMap = new Map<string, string>();
  for (const item of items) {
    aliasMap.set(item.itemKey, item.itemKey);
    for (const aliasKey of item.aliasKeys ?? []) {
      aliasMap.set(aliasKey, item.itemKey);
    }
  }
  return aliasMap;
}

function addProducedKeysFromFlora(record: FloraContentRecord, produced: Set<string>): void {
  const template = record.template as Record<string, any> | undefined;
  const harvest = template?.harvest;
  for (const fieldName of ["activeHarvest", "passiveHarvest"]) {
    const block = harvest?.[fieldName];
    const rawOutput = block?.rawOutput;
    for (const key of rawOutput?.materials ?? []) {
      produced.add(key);
    }
    for (const key of rawOutput?.ingredients ?? []) {
      produced.add(key);
    }
    for (const key of rawOutput?.processing?.byProducts?.materials ?? []) {
      produced.add(key);
    }
    for (const key of rawOutput?.processing?.byProducts?.ingredients ?? []) {
      produced.add(key);
    }
  }
}

function addProducedKeysFromFauna(record: FaunaContentRecord, produced: Set<string>): void {
  const template = record.template as Record<string, any> | undefined;
  const output = template?.output;
  for (const fieldName of ["passiveOutput", "slaughterOutput"]) {
    const products = output?.[fieldName]?.products ?? {};
    for (const groupValues of Object.values(products)) {
      for (const itemKey of Array.isArray(groupValues) ? groupValues : []) {
        produced.add(itemKey);
      }
    }
  }
}

function addProducedKeysFromMonster(record: MonsterContentRecord, produced: Set<string>): void {
  for (const drop of record.drops ?? []) {
    if (drop.itemKey) {
      produced.add(drop.itemKey);
    }
  }
  for (const loot of record.loot ?? []) {
    if (loot.itemKey) {
      produced.add(loot.itemKey);
    }
  }
}

function collectChainOutputs(record: ProductionChainRecord): string[] {
  const outputs = [record.primaryOutput, ...(record.byProducts ?? [])];
  for (const variant of record.variantConfig?.variants ?? []) {
    if (variant.primaryOutput) {
      outputs.push(variant.primaryOutput);
    }
    outputs.push(...(variant.byProducts ?? []));
  }
  return uniqueStrings(outputs);
}

function collectChainInputs(record: ProductionChainRecord): string[] {
  const inputs = [...(record.recipeProfile.externalInputs ?? []), ...(record.recipeProfile.intermediateItems ?? [])];
  for (const step of record.recipeProfile.processingSteps ?? []) {
    inputs.push(...(step.inputs ?? []));
  }
  for (const variant of record.variantConfig?.variants ?? []) {
    inputs.push(...(variant.inputItemKeys ?? []));
  }
  return uniqueStrings(inputs);
}

function detectCycles(adjacency: Map<string, string[]>): string[] {
  const visited = new Set<string>();
  const active = new Set<string>();
  const path: string[] = [];
  const cycles = new Set<string>();

  function visit(node: string): void {
    if (active.has(node)) {
      const cycleStart = path.indexOf(node);
      const cycle = [...path.slice(cycleStart), node].join(" -> ");
      cycles.add(cycle);
      return;
    }
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    active.add(node);
    path.push(node);
    for (const next of adjacency.get(node) ?? []) {
      visit(next);
    }
    path.pop();
    active.delete(node);
  }

  for (const node of adjacency.keys()) {
    visit(node);
  }

  return [...cycles].sort((left, right) => left.localeCompare(right));
}

function buildEssentialGoodsCoverage(
  aliasMap: Map<string, string>,
  producedItemKeys: Set<string>,
  producedFamilies: Set<string>
): SimulationConsistencyGoodsCoverageState[] {
  return ESSENTIAL_GOODS.map((group) => {
    const coveredKeys: string[] = [];
    const missingKeys: string[] = [];

    for (const requiredKey of group.requiredKeys) {
      const canonicalKey = aliasMap.get(requiredKey);
      const familyFallbacks = ESSENTIAL_FAMILY_FALLBACKS.get(requiredKey) ?? [];
      const familyCovered = familyFallbacks.some((family) => producedFamilies.has(family));
      if ((canonicalKey && producedItemKeys.has(canonicalKey)) || familyCovered) {
        coveredKeys.push(requiredKey);
      } else {
        missingKeys.push(requiredKey);
      }
    }

    return {
      groupId: group.groupId,
      requiredKeys: [...group.requiredKeys],
      coveredKeys,
      missingKeys
    };
  });
}

function buildInvalidSettlementGeography(): InvalidSettlementGeographyState[] {
  const settlements = loadSettlementContent();
  const localitiesById = new Map(loadRegionLocalityContent().map((record) => [record.id, record]));
  const hexesById = new Map(loadWorldHexContent().map((record) => [record.id, record]));

  return settlements
    .map((settlement) => {
      const reasons: string[] = [];
      const locality = localitiesById.get(settlement.localityBandId);
      const hex = hexesById.get(settlement.hexAnchorId);

      if (!locality) {
        reasons.push(`Missing locality ${settlement.localityBandId}.`);
      } else {
        if (locality.regionId !== settlement.regionId) {
          reasons.push(`Locality region ${locality.regionId} does not match settlement region ${settlement.regionId}.`);
        }
        if (locality.macroRegionId !== settlement.macroRegionId) {
          reasons.push(`Locality macro region ${locality.macroRegionId} does not match settlement macro region ${settlement.macroRegionId}.`);
        }
        if (!locality.supportedSiteClasses.includes(settlement.siteClass)) {
          reasons.push(`Site class ${settlement.siteClass} is not supported by locality ${settlement.localityBandId}.`);
        }
        if (locality.localityType !== settlement.terrainContext) {
          reasons.push(`Terrain context ${settlement.terrainContext} does not match locality type ${locality.localityType}.`);
        }
      }

      if (!hex) {
        reasons.push(`Missing hex ${settlement.hexAnchorId}.`);
      } else {
        if (hex.regionId !== settlement.regionId) {
          reasons.push(`Hex region ${hex.regionId} does not match settlement region ${settlement.regionId}.`);
        }
        if (hex.localityBandId !== settlement.localityBandId) {
          reasons.push(`Hex locality ${hex.localityBandId} does not match settlement locality ${settlement.localityBandId}.`);
        }
        if (!(hex.anchoredSettlementIds ?? []).includes(settlement.id)) {
          reasons.push(`Hex ${settlement.hexAnchorId} does not anchor settlement ${settlement.id}.`);
        }
      }

      return reasons.length > 0 ? { settlementId: settlement.id, reasons } : null;
    })
    .filter((entry): entry is InvalidSettlementGeographyState => entry !== null);
}

export function buildSimulationConsistencyReport(input: {
  settlementIds: string[];
  marketStates: SettlementMarketState[];
  transportState?: CivilizationTransportState;
}): SimulationConsistencyReportState {
  const items = loadItemContent() as RuntimeItemRecord[];
  const workplaces = loadWorkplaceContent();
  const buildings = loadBuildingContent();
  const chains = loadProductionChainContent();
  const flora = loadFloraContent();
  const fauna = loadFaunaContent();
  const minerals = loadMineralContent();
  const monsters = loadMonsterContent();

  const itemKeys = new Set(items.map((item) => item.itemKey));
  const aliasMap = buildAliasMap(items);
  const producedItemKeys = new Set<string>();

  for (const chain of chains) {
    for (const itemKey of collectChainOutputs(chain)) {
      producedItemKeys.add(itemKey);
    }
  }

  for (const workplace of workplaces) {
    for (const itemKey of workplace.outputTags ?? []) {
      producedItemKeys.add(itemKey);
    }
    for (const output of workplace.ioProfile?.outputs ?? []) {
      producedItemKeys.add(output.itemKey);
    }
    for (const group of workplace.ioProfile?.yieldGroups ?? []) {
      for (const output of group.outputs ?? []) {
        producedItemKeys.add(output.itemKey);
      }
    }
  }

  for (const record of flora) {
    addProducedKeysFromFlora(record, producedItemKeys);
  }
  for (const record of fauna) {
    addProducedKeysFromFauna(record, producedItemKeys);
  }
  for (const record of minerals) {
    producedItemKeys.add(record.itemKey);
  }
  for (const record of monsters) {
    addProducedKeysFromMonster(record, producedItemKeys);
  }
  const producedFamilies = new Set<string>();
  for (const itemKey of producedItemKeys) {
    for (const family of resolveResourceFamilies(itemKey)) {
      producedFamilies.add(family);
    }
  }

  const itemsWithoutProductionSource = items
    .filter((item) => item.provenance?.sourceType === "recipe_derived" && !producedItemKeys.has(item.itemKey))
    .map((item) => item.itemKey)
    .sort((left, right) => left.localeCompare(right));

  const workplaceIds = new Set(workplaces.map((workplace) => workplace.id));
  const hostedWorkplaceIds = new Set(buildings.flatMap((building) => building.hostedWorkplaceIds));
  const workplacesReferencedByChains = new Set(
    chains.flatMap((chain) => chain.stages.filter((stageRef) => stageRef.startsWith("workplace.")))
  );

  const missingRecipeDependencies = new Set<string>();
  const chainOutputKeys = new Set<string>();
  for (const chain of chains) {
    for (const outputKey of collectChainOutputs(chain)) {
      chainOutputKeys.add(outputKey);
    }
  }

  const adjacency = new Map<string, string[]>();
  for (const chain of chains) {
    const chainOutputs = collectChainOutputs(chain);
    const chainInputs = collectChainInputs(chain);

    for (const stageRef of chain.stages) {
      if (stageRef.startsWith("workplace.") && !workplaceIds.has(stageRef)) {
        missingRecipeDependencies.add(`${chain.id}: missing workplace stage ${stageRef}`);
      }
    }

    for (const itemKey of [...chainOutputs, ...chainInputs]) {
      if (!itemKeys.has(itemKey)) {
        missingRecipeDependencies.add(`${chain.id}: missing item ${itemKey}`);
      }
    }

    for (const outputKey of chainOutputs) {
      const dependentInputs = chainInputs.filter((itemKey) => chainOutputKeys.has(itemKey) && itemKey !== outputKey);
      adjacency.set(outputKey, uniqueStrings([...(adjacency.get(outputKey) ?? []), ...dependentInputs]));
    }
  }

  const cyclicProductionDependencies = detectCycles(adjacency);

  const workplacesWithoutDefinedFunction = workplaces
    .filter((workplace) => {
      const hasOutputs =
        (workplace.outputTags?.length ?? 0) > 0 ||
        (workplace.ioProfile?.outputs?.length ?? 0) > 0 ||
        (workplace.ioProfile?.yieldGroups?.length ?? 0) > 0;
      return !hasOutputs && !workplacesReferencedByChains.has(workplace.id);
    })
    .map((workplace) => workplace.id)
    .sort((left, right) => left.localeCompare(right));

  const unusedWorkplaces = workplaces
    .filter((workplace) => !workplacesReferencedByChains.has(workplace.id))
    .map((workplace) => workplace.id)
    .sort((left, right) => left.localeCompare(right));

  const workplacesWithoutBuildingCoverage = workplaces
    .filter((workplace) => !hostedWorkplaceIds.has(workplace.id))
    .map((workplace) => workplace.id)
    .sort((left, right) => left.localeCompare(right));

  const buildingsWithoutFunction = buildings
    .filter((building) => building.hostedWorkplaceIds.length === 0 && building.serviceFunctions.length === 0)
    .map((building) => building.id)
    .sort((left, right) => left.localeCompare(right));

  const essentialGoodsCoverage = buildEssentialGoodsCoverage(aliasMap, producedItemKeys, producedFamilies);
  const invalidSettlementGeography = buildInvalidSettlementGeography();

  const evaluated = evaluateAutonomousTradeOpportunities({
    settlementIds: input.settlementIds,
    marketStates: input.marketStates,
    transportState: input.transportState ?? createEmptyCivilizationTransportState()
  });

  const unrealisticTradeDispatchAttempts = evaluated.opportunities
    .filter((opportunity) => !opportunity.viable && opportunity.rejectionReasons.length > 0)
    .slice(0, 24)
    .map<UnrealisticTradeDispatchState>((opportunity) => ({
      opportunityId: opportunity.opportunityId,
      originSettlementId: opportunity.originSettlementId,
      destinationSettlementId: opportunity.destinationSettlementId,
      itemKey: opportunity.itemKey,
      vehicleId: opportunity.vehicleId,
      rejectionReasons: [...opportunity.rejectionReasons],
      explanation: [...opportunity.explanation]
    }));

  return {
    essentialGoodsCoverage,
    itemsWithoutProductionSource,
    missingRecipeDependencies: [...missingRecipeDependencies].sort((left, right) => left.localeCompare(right)),
    cyclicProductionDependencies,
    workplacesWithoutDefinedFunction,
    unusedWorkplaces,
    workplacesWithoutBuildingCoverage,
    buildingsWithoutFunction,
    invalidSettlementGeography,
    unrealisticTradeDispatchAttempts,
    explanation: [
      `${producedItemKeys.size} produced or source-derived item identities were observed across chains, workplaces, flora, fauna, minerals, and monsters.`,
      `${essentialGoodsCoverage.filter((group) => group.missingKeys.length === 0).length}/${essentialGoodsCoverage.length} essential goods groups resolve through canonical items and live production or extraction sources.`,
      `${unrealisticTradeDispatchAttempts.length} non-viable trade opportunities were captured with explicit rejection reasons for debugging.`
    ]
  };
}
