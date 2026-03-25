import type {
  CraftResolutionExplanationState,
  CraftResolutionInputState,
  CraftResolutionState,
  EconomyLedgerSnapshot,
  EconomyPressureContribution,
  ItemValueResolutionState,
  SettlementMarketItemPressureState,
  SettlementMarketLaborPressureState,
  SettlementMarketPriceState,
  SettlementMarketState,
  SimulationClock
} from "../../../shared/types/src/index.js";
import {
  loadItemContent,
  loadMarketItemValues,
  loadProductionChainContent,
  loadSettlementContent,
  loadSkillContent,
  loadWorkplaceContent,
  type ItemContentRecord,
  type MarketItemValueRecord,
  type MaterialDifficultyProfileRecord,
  type ProductionChainRecord,
  type RecipeProcessingStepRecord,
  type RecipeSkillCheckRecord,
  type SettlementContentRecord,
  type WorkplaceContentRecord,
  type WorkplaceIoItemRecord
} from "./content.js";

const LABOR_HOURS: Record<"light" | "moderate" | "heavy", number> = {
  light: 1.25,
  moderate: 2.4,
  heavy: 4.1
};

const PROCESSING_HOURS: Record<"minimal" | "standard" | "fuel_heavy" | "precision", number> = {
  minimal: 0.2,
  standard: 0.7,
  fuel_heavy: 1.45,
  precision: 1.05
};

const PROCESSING_COST_RATES: Record<"minimal" | "standard" | "fuel_heavy" | "precision", number> = {
  minimal: 0.08,
  standard: 0.22,
  fuel_heavy: 0.5,
  precision: 0.34
};

const DIFFICULTY_MULTIPLIERS: Record<"easy" | "moderate" | "hard" | "expert", number> = {
  easy: 0.92,
  moderate: 1,
  hard: 1.22,
  expert: 1.48
};

const DEMAND_BAND_VALUE_FACTORS: Record<"subsistence" | "common" | "utility" | "specialty" | "luxury", number> = {
  subsistence: 0.95,
  common: 1,
  utility: 1.08,
  specialty: 1.18,
  luxury: 1.32
};

const WORKABILITY_FACTORS: Record<"easy" | "moderate" | "hard", number> = {
  easy: 0.94,
  moderate: 1,
  hard: 1.12
};

const HARDNESS_FACTORS: Record<"soft" | "medium" | "hard", number> = {
  soft: 0.95,
  medium: 1,
  hard: 1.08
};

const REFINEMENT_FACTORS: Record<"low" | "moderate" | "high", number> = {
  low: 0.94,
  moderate: 1,
  high: 1.12
};

const COST_IMPACT_FACTORS: Record<"light" | "moderate" | "heavy", number> = {
  light: 0.95,
  moderate: 1,
  heavy: 1.12
};

const COMPONENT_CLASS_HINTS: Record<string, string[]> = {
  weapon: ["blade_blank", "tool_handle", "wood_pole", "leather_strap", "ferrule", "metal_rod", "nail", "hinge"],
  armor: ["metal_wire", "metal_ring", "rivet", "buckle", "metal_plate", "leather_panel", "leather_strap", "leather_lace", "hardened_leather_panel"],
  tool: ["blade_blank", "tool_handle", "metal_rod", "ferrule", "leather_strap", "hinge", "nail"],
  clothing: ["coarse_cloth", "fine_cloth", "binding_strip", "light_leather", "leather_strap"],
  consumable: ["adhesive", "preserve_base", "bread_dough", "cheese_curd", "cream", "rendered_tallow", "wick"],
  container: ["barrel_stave", "wood_stave", "tool_handle", "hinge", "nail", "leather_strap"],
  accessory: ["metal_ring", "buckle", "leather_strap", "binding_strip"]
};

interface RuntimeIndexes {
  itemByKey: Map<string, ItemContentRecord>;
  marketByItemKey: Map<string, MarketItemValueRecord>;
  workplaceById: Map<string, WorkplaceContentRecord>;
  settlementById: Map<string, SettlementContentRecord>;
  chainById: Map<string, ProductionChainRecord>;
  skillIds: Set<string>;
  chainsByOutput: Map<string, Array<{ chain: ProductionChainRecord; role: "primary" | "byproduct"; variantId: string | null }>>;
  outputItemsBySkill: Map<string, Set<string>>;
}

interface ResolveValueContext {
  settlementId: string | null;
  marketState: SettlementMarketState | null;
  valueMemo: Map<string, ItemValueResolutionState>;
  chainMemo: Map<string, CraftResolutionState>;
  stack: string[];
}

interface BuildMarketStatesOptions {
  settlementIds: string[];
  snapshots: EconomyLedgerSnapshot[];
  clock: SimulationClock;
}

export interface CraftResolutionRequest {
  chainId: string;
  settlementId?: string | null;
  marketState?: SettlementMarketState | null;
  targetOutputItemKey?: string;
  variantId?: string;
  selectedInputItemKeys?: string[];
  workerSkills?: Record<string, number>;
  availableToolTags?: string[];
  fuelAvailable?: boolean;
}

interface SkillEffectResult {
  skillId: string;
  skillRank: number;
  minimumRank: number | null;
  effectiveRequiredRank: number;
  timeFactor: number;
  wasteMultiplier: number;
  laborRateFactor: number;
  notes: string[];
}

let runtimeIndexesCache: RuntimeIndexes | null = null;

function roundNumber(value: number): number {
  return Number(value.toFixed(4));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function createRuntimeIndexes(): RuntimeIndexes {
  const items = loadItemContent();
  const markets = loadMarketItemValues();
  const workplaces = loadWorkplaceContent();
  const settlements = loadSettlementContent();
  const chains = loadProductionChainContent();
  const skills = loadSkillContent();

  const itemByKey = new Map(items.map((record) => [record.itemKey, record]));
  const marketByItemKey = new Map(markets.map((record) => [record.itemKey, record]));
  const workplaceById = new Map(workplaces.map((record) => [record.id, record]));
  const settlementById = new Map(settlements.map((record) => [record.id, record]));
  const chainById = new Map(chains.map((record) => [record.id, record]));
  const skillIds = new Set(skills.map((record) => record.id));
  const chainsByOutput = new Map<string, Array<{ chain: ProductionChainRecord; role: "primary" | "byproduct"; variantId: string | null }>>();
  const outputItemsBySkill = new Map<string, Set<string>>();

  const addOutputCandidate = (itemKey: string, chain: ProductionChainRecord, role: "primary" | "byproduct", variantId: string | null): void => {
    const entries = chainsByOutput.get(itemKey) ?? [];
    entries.push({ chain, role, variantId });
    chainsByOutput.set(itemKey, entries);
  };

  for (const chain of chains) {
    addOutputCandidate(chain.primaryOutput, chain, "primary", null);
    for (const byProduct of chain.byProducts ?? []) {
      addOutputCandidate(byProduct, chain, "byproduct", null);
    }
    for (const variant of chain.variantConfig?.variants ?? []) {
      if (variant.primaryOutput) {
        addOutputCandidate(variant.primaryOutput, chain, "primary", variant.id);
      }
      for (const byProduct of variant.byProducts ?? []) {
        addOutputCandidate(byProduct, chain, "byproduct", variant.id);
      }
    }

    const outputs = outputItemsBySkill.get(chain.recipeProfile.primarySkillId) ?? new Set<string>();
    outputs.add(chain.primaryOutput);
    for (const byProduct of chain.byProducts ?? []) {
      outputs.add(byProduct);
    }
    for (const variant of chain.variantConfig?.variants ?? []) {
      if (variant.primaryOutput) {
        outputs.add(variant.primaryOutput);
      }
      for (const byProduct of variant.byProducts ?? []) {
        outputs.add(byProduct);
      }
    }
    outputItemsBySkill.set(chain.recipeProfile.primarySkillId, outputs);
  }

  return {
    itemByKey,
    marketByItemKey,
    workplaceById,
    settlementById,
    chainById,
    skillIds,
    chainsByOutput,
    outputItemsBySkill
  };
}

function getRuntimeIndexes(): RuntimeIndexes {
  if (!runtimeIndexesCache) {
    runtimeIndexesCache = createRuntimeIndexes();
  }
  return runtimeIndexesCache;
}

function getDemandBandFactor(demandBand: "subsistence" | "common" | "utility" | "specialty" | "luxury"): number {
  return DEMAND_BAND_VALUE_FACTORS[demandBand];
}

function getMarketStockMap(marketState: SettlementMarketState | null): Map<string, SettlementMarketItemPressureState> {
  return new Map((marketState?.stock ?? []).map((entry) => [entry.itemKey, entry]));
}

function getLaborPressureMap(marketState: SettlementMarketState | null): Map<string, SettlementMarketLaborPressureState> {
  return new Map((marketState?.laborPressure ?? []).map((entry) => [entry.skillId, entry]));
}

function getSourceValueAnchor(item: ItemContentRecord | undefined, market: MarketItemValueRecord | undefined): number {
  const itemBase = item?.baseValue ?? 0;
  const marketBase = market?.baseValue ?? 0;
  return roundNumber(Math.max(itemBase, marketBase, 1));
}

function getMaterialDifficultyFactor(items: Array<ItemContentRecord | undefined>): { factor: number; note: string } {
  const profiles = items
    .map((record) => record?.materialDifficultyProfile)
    .filter((profile): profile is MaterialDifficultyProfileRecord => profile !== undefined);

  if (profiles.length === 0) {
    return { factor: 1, note: "no_material_difficulty_profile" };
  }

  const average =
    profiles.reduce((sum, profile) => {
      return (
        sum +
        WORKABILITY_FACTORS[profile.workability] +
        HARDNESS_FACTORS[profile.hardness] +
        REFINEMENT_FACTORS[profile.refinementDifficulty] +
        COST_IMPACT_FACTORS[profile.processingCostImpact]
      );
    }, 0) /
    (profiles.length * 4);

  return { factor: roundNumber(average), note: `${profiles.length} material profiles weighted` };
}

function getWorkplaceRequiredToolTags(workplace: WorkplaceContentRecord | undefined): string[] {
  if (!workplace?.workforceProfile?.jobs) {
    return [];
  }

  const tags = new Set<string>();
  for (const job of workplace.workforceProfile.jobs) {
    for (const toolTag of job.toolRequirements?.requiredToolTags ?? []) {
      tags.add(toolTag);
    }
  }
  return [...tags].sort();
}

function getWorkplaceToolPenalty(
  workplace: WorkplaceContentRecord | undefined,
  availableToolTags: string[] | undefined
): { blocked: boolean; factor: number; notes: string[] } {
  if (!workplace) {
    return { blocked: false, factor: 1, notes: [] };
  }

  const requiredTags = getWorkplaceRequiredToolTags(workplace);
  if (requiredTags.length === 0 || !availableToolTags) {
    return { blocked: false, factor: 1, notes: [] };
  }

  const available = new Set(availableToolTags);
  const missing = requiredTags.filter((tag) => !available.has(tag));
  if (missing.length === 0) {
    return { blocked: false, factor: 1, notes: [] };
  }

  const primaryJob = workplace.workforceProfile?.jobs?.find((job) => job.role === "primary");
  const penaltyMode = primaryJob?.toolRequirements?.missingToolPenalty.mode ?? "reduced_output";
  if (penaltyMode === "no_output") {
    return {
      blocked: true,
      factor: 2,
      notes: [`missing critical tools: ${missing.join(", ")}`]
    };
  }

  return {
    blocked: false,
    factor: 1.3,
    notes: [`missing supportive tools: ${missing.join(", ")}`]
  };
}

function buildPressureContribution(source: string, factor: number, note: string): EconomyPressureContribution {
  return {
    source,
    factor: roundNumber(factor),
    impact: roundNumber(factor - 1),
    note
  };
}

function resolveVariant(
  chain: ProductionChainRecord,
  requestedVariantId: string | undefined,
  selectedInputItemKeys: string[] | undefined,
  targetOutputItemKey: string | undefined
): { id: string; inputItemKeys?: string[]; primaryOutput?: string; byProducts?: string[] } | null {
  const variants = chain.variantConfig?.variants ?? [];
  if (variants.length === 0) {
    return null;
  }

  if (requestedVariantId) {
    return variants.find((variant) => variant.id === requestedVariantId) ?? null;
  }

  if (targetOutputItemKey) {
    const byOutput = variants.find((variant) => variant.primaryOutput === targetOutputItemKey || variant.byProducts?.includes(targetOutputItemKey));
    if (byOutput) {
      return byOutput;
    }
  }

  if (selectedInputItemKeys && selectedInputItemKeys.length > 0) {
    const selected = new Set(selectedInputItemKeys);
    const byInputs = variants.find((variant) => (variant.inputItemKeys ?? []).some((itemKey) => selected.has(itemKey)));
    if (byInputs) {
      return byInputs;
    }
  }

  if (chain.variantConfig?.defaultVariant) {
    return variants.find((variant) => variant.id === chain.variantConfig?.defaultVariant) ?? null;
  }

  return variants[0] ?? null;
}

function getFallbackStageInputs(chain: ProductionChainRecord, targetOutputItemKey: string | undefined): string[] {
  if (targetOutputItemKey && chain.primaryOutput === targetOutputItemKey) {
    return chain.recipeProfile.intermediateItems.length > 0 ? [chain.recipeProfile.intermediateItems.at(-1) ?? chain.primaryOutput] : chain.recipeProfile.externalInputs;
  }
  return chain.recipeProfile.externalInputs;
}

function getRelevantInputScore(targetItem: ItemContentRecord | undefined, inputItem: ItemContentRecord | undefined, inputKey: string): number {
  if (!targetItem || !inputItem) {
    return 0;
  }

  let score = 0;
  if ((COMPONENT_CLASS_HINTS[targetItem.itemClass] ?? []).includes(inputKey)) {
    score += 5;
  }
  if (targetItem.itemBranch && inputItem.itemBranch === targetItem.itemBranch) {
    score += 3;
  }
  if (targetItem.itemSubBranch && inputItem.itemSubBranch === targetItem.itemSubBranch) {
    score += 2;
  }

  const targetTags = new Set(targetItem.tags ?? []);
  if ((inputItem.tags ?? []).some((tag) => targetTags.has(tag))) {
    score += 3;
  }

  if (targetItem.processingGroups && inputItem.processingGroups) {
    const matchingProcessingGroup = inputItem.processingGroups.some((group) => targetItem.processingGroups?.includes(group));
    if (matchingProcessingGroup) {
      score += 2;
    }
  }

  if (inputItem.stage === "processed" || inputItem.stage === "refined") {
    score += 1;
  }

  return score;
}

function chooseAlternativeInputKeys(
  targetOutputItemKey: string | undefined,
  relevantInputs: WorkplaceIoItemRecord[],
  indexes: RuntimeIndexes
): WorkplaceIoItemRecord[] {
  const targetLower = targetOutputItemKey?.toLowerCase() ?? "";
  const grouped = new Map<string, WorkplaceIoItemRecord[]>();

  const getGroupKey = (item: ItemContentRecord | undefined, itemKey: string): string => {
    if (!item) {
      return `item:${itemKey}`;
    }
    if (item.itemSubBranch === "ingot") {
      return "material:ingot";
    }
    if (item.itemKey.endsWith("_leather")) {
      return "material:leather_grade";
    }
    if (item.itemKey.endsWith("_cloth")) {
      return "material:cloth_grade";
    }
    return `item:${item.itemKey}`;
  };

  for (const input of relevantInputs) {
    const item = indexes.itemByKey.get(input.itemKey);
    const groupKey = getGroupKey(item, input.itemKey);
    const entries = grouped.get(groupKey) ?? [];
    entries.push(input);
    grouped.set(groupKey, entries);
  }

  const chooseBest = (entries: WorkplaceIoItemRecord[]): WorkplaceIoItemRecord => {
    if (entries.length === 1) {
      return entries[0];
    }

    const exactMatch = entries.find((entry) => {
      const normalized = entry.itemKey.toLowerCase();
      return targetLower.includes(normalized) || targetLower.includes(normalized.split("_")[0]);
    });
    if (exactMatch) {
      return exactMatch;
    }

    return entries
      .slice()
      .sort((left, right) => {
        const leftItem = indexes.itemByKey.get(left.itemKey);
        const rightItem = indexes.itemByKey.get(right.itemKey);
        const leftBase = getSourceValueAnchor(leftItem, indexes.marketByItemKey.get(left.itemKey));
        const rightBase = getSourceValueAnchor(rightItem, indexes.marketByItemKey.get(right.itemKey));
        return leftBase - rightBase || left.itemKey.localeCompare(right.itemKey);
      })[0];
  };

  return [...grouped.values()].map((entries) => chooseBest(entries));
}

function selectRelevantWorkplaceInputs(
  workplace: WorkplaceContentRecord | undefined,
  targetOutputItemKey: string | undefined,
  indexes: RuntimeIndexes
): string[] {
  const inputs = workplace?.ioProfile?.inputs ?? [];
  if (inputs.length === 0) {
    return [];
  }

  const targetItem = targetOutputItemKey ? indexes.itemByKey.get(targetOutputItemKey) : undefined;
  if (!targetItem) {
    return inputs.map((entry) => entry.itemKey);
  }

  const scored = inputs
    .map((entry) => ({
      entry,
      score: getRelevantInputScore(targetItem, indexes.itemByKey.get(entry.itemKey), entry.itemKey)
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.entry.itemKey.localeCompare(right.entry.itemKey));

  const relevantEntries = scored.length > 0 ? scored.map((entry) => entry.entry) : inputs.slice(0, Math.min(3, inputs.length));
  return chooseAlternativeInputKeys(targetOutputItemKey, relevantEntries, indexes).map((entry) => entry.itemKey);
}

function selectRelevantWorkplaceOutputs(
  workplace: WorkplaceContentRecord | undefined,
  targetOutputItemKey: string | undefined,
  indexes: RuntimeIndexes
): { primaryOutputs: string[]; byproducts: string[] } {
  const outputs = workplace?.ioProfile?.outputs?.map((entry) => entry.itemKey) ?? [];
  if (outputs.length === 0) {
    return { primaryOutputs: targetOutputItemKey ? [targetOutputItemKey] : [], byproducts: [] };
  }

  if (!targetOutputItemKey) {
    return { primaryOutputs: outputs, byproducts: [] };
  }

  const primaryOutputs = outputs.includes(targetOutputItemKey) ? [targetOutputItemKey] : outputs.slice(0, 1);
  const byproducts = outputs.filter((itemKey) => {
    if (primaryOutputs.includes(itemKey)) {
      return false;
    }
    const item = indexes.itemByKey.get(itemKey);
    return item?.itemClass === "commodity";
  });
  return { primaryOutputs, byproducts };
}

function resolveStepInputs(
  step: RecipeProcessingStepRecord,
  chain: ProductionChainRecord,
  workplace: WorkplaceContentRecord | undefined,
  variant: { id: string; inputItemKeys?: string[]; primaryOutput?: string; byProducts?: string[] } | null,
  targetOutputItemKey: string | undefined,
  indexes: RuntimeIndexes
): string[] {
  const chainOutputSet = new Set<string>([
    chain.primaryOutput,
    ...(chain.byProducts ?? []),
    ...(chain.variantConfig?.variants.flatMap((entry) => [entry.primaryOutput, ...(entry.byProducts ?? [])].filter(Boolean) as string[]) ?? [])
  ]);

  if (step.inputs.length > 0) {
    if (step.usesVariantInputs && variant?.inputItemKeys && variant.inputItemKeys.length > 0) {
      return variant.inputItemKeys;
    }
    return step.inputs;
  }

  if (step.usesVariantInputs && variant?.inputItemKeys && variant.inputItemKeys.length > 0) {
    return variant.inputItemKeys;
  }

  if (workplace) {
    const relevantInputs = selectRelevantWorkplaceInputs(workplace, targetOutputItemKey, indexes).filter(
      (itemKey) => !chainOutputSet.has(itemKey)
    );
    if (relevantInputs.length > 0) {
      return relevantInputs;
    }
  }

  return getFallbackStageInputs(chain, targetOutputItemKey);
}

function resolveStepOutputs(
  step: RecipeProcessingStepRecord,
  workplace: WorkplaceContentRecord | undefined,
  variant: { id: string; inputItemKeys?: string[]; primaryOutput?: string; byProducts?: string[] } | null,
  targetOutputItemKey: string | undefined,
  indexes: RuntimeIndexes
): { primaryOutputs: string[]; byproducts: string[] } {
  if (step.outputs.length > 0) {
    const primaryOutputs = targetOutputItemKey && step.outputs.includes(targetOutputItemKey) ? [targetOutputItemKey] : step.outputs.slice();
    const byproducts = step.outputs.filter((itemKey) => {
      if (primaryOutputs.includes(itemKey)) {
        return false;
      }
      const item = indexes.itemByKey.get(itemKey);
      return item?.itemClass === "commodity";
    });

    if (step.usesVariantPrimaryOutput && variant?.primaryOutput) {
      return {
        primaryOutputs: [variant.primaryOutput],
        byproducts: step.usesVariantByProducts ? variant.byProducts ?? byproducts : byproducts
      };
    }

    if (step.usesVariantByProducts && variant?.byProducts) {
      return { primaryOutputs, byproducts: variant.byProducts };
    }

    return { primaryOutputs, byproducts };
  }

  if (workplace) {
    return selectRelevantWorkplaceOutputs(workplace, targetOutputItemKey, indexes);
  }

  if (step.usesVariantPrimaryOutput && variant?.primaryOutput) {
    return {
      primaryOutputs: [variant.primaryOutput],
      byproducts: step.usesVariantByProducts ? variant.byProducts ?? [] : []
    };
  }

  return targetOutputItemKey ? { primaryOutputs: [targetOutputItemKey], byproducts: [] } : { primaryOutputs: [], byproducts: [] };
}

function createSkillEffect(
  skillCheck: RecipeSkillCheckRecord | undefined,
  chainPrimarySkillId: string,
  workerSkills: Record<string, number> | undefined,
  laborPressureMap: Map<string, SettlementMarketLaborPressureState>
): SkillEffectResult {
  const skillId = skillCheck?.skillId ?? chainPrimarySkillId;
  const laborPressure = laborPressureMap.get(skillId)?.pressure ?? 1;
  const explicitRank = workerSkills?.[skillId];

  if (!skillCheck) {
    return {
      skillId,
      skillRank: explicitRank ?? 60,
      minimumRank: null,
      effectiveRequiredRank: 0,
      timeFactor: 1,
      wasteMultiplier: 1,
      laborRateFactor: laborPressure,
      notes: explicitRank === undefined ? ["no explicit skill gate on step"] : []
    };
  }

  const inferredRank = explicitRank ?? Math.max(skillCheck.minimumRank * 0.85, skillCheck.efficiencyRank / laborPressure);
  let timeFactor = 1;
  let wasteMultiplier = 1;
  let laborRateFactor = laborPressure;
  const notes: string[] = [];

  if (inferredRank >= skillCheck.efficiencyRank) {
    const overageRatio = clamp(
      (inferredRank - skillCheck.efficiencyRank) / Math.max(skillCheck.qualityRank - skillCheck.efficiencyRank, 1),
      0,
      1
    );
    timeFactor = roundNumber(0.88 - overageRatio * 0.11);
    wasteMultiplier = 1;
    laborRateFactor = roundNumber(laborPressure * (0.95 - overageRatio * 0.08));
    notes.push("worker exceeds efficiency threshold");
  } else if (inferredRank >= skillCheck.minimumRank) {
    const progressRatio = clamp(
      (inferredRank - skillCheck.minimumRank) / Math.max(skillCheck.efficiencyRank - skillCheck.minimumRank, 1),
      0,
      1
    );
    timeFactor = roundNumber(1.14 - progressRatio * 0.26);
    wasteMultiplier = roundNumber(1.08 - progressRatio * 0.08);
    laborRateFactor = roundNumber(laborPressure * (1.04 - progressRatio * 0.09));
    notes.push("worker clears minimum threshold but has remaining inefficiency");
  } else {
    const shortfallRatio = clamp((skillCheck.minimumRank - inferredRank) / Math.max(skillCheck.minimumRank, 1), 0, 1.5);
    timeFactor = roundNumber(1.22 + shortfallRatio * 0.75);
    wasteMultiplier = roundNumber(1.14 + shortfallRatio * 0.36);
    laborRateFactor = roundNumber(laborPressure * (1.08 + shortfallRatio * 0.24));
    notes.push("worker is below minimum threshold");
  }

  return {
    skillId,
    skillRank: roundNumber(inferredRank),
    minimumRank: skillCheck.minimumRank,
    effectiveRequiredRank: skillCheck.minimumRank,
    timeFactor,
    wasteMultiplier,
    laborRateFactor,
    notes
  };
}

function getProductionCapacityModifier(settlement: SettlementContentRecord | undefined): number {
  if (!settlement) {
    return 1;
  }

  const profile = settlement.infrastructureProfile;
  const survival = settlement.survivalModel;
  const routeAccess = settlement.tradeDependencyProfile?.routeAccess;
  const routeAverage = routeAccess
    ? (routeAccess.road + routeAccess.river + routeAccess.coastal + routeAccess.caravan + routeAccess.pass + routeAccess.seaLane) / 6
    : 0.8;
  const survivalModifier =
    0.95 +
    survival.habitationScore / 420 +
    survival.foodSecurity / 900 +
    survival.waterSecurity / 900 -
    survival.climateBurden / 1500 -
    survival.hazardPressure / 1350 -
    survival.infrastructureDifficulty / 1600;
  const modifier =
    0.84 +
    profile.marketTier * 0.05 +
    profile.roadTier * 0.025 +
    profile.waterTier * 0.02 +
    profile.harborTier * 0.02 +
    profile.fortificationTier * 0.01 +
    routeAverage * 0.08 +
    (survivalModifier - 1) * 0.35;
  return roundNumber(clamp(modifier, 0.9, 1.6));
}

function buildStockPressureEntries(snapshot: EconomyLedgerSnapshot | undefined): SettlementMarketItemPressureState[] {
  if (!snapshot) {
    return [];
  }

  return snapshot.balances
    .map((balance) => {
      const totalActivity = Math.max(balance.supplyPerTick + balance.demandPerTick, 1);
      const supplyPressure = roundNumber(clamp((balance.shortfallPerTick - balance.tradeSurplusPerTick) / totalActivity, -1, 1));
      const demandPressure = roundNumber(clamp((balance.unmetDemandPerTick - balance.reservePerTick) / totalActivity, -1, 1));
      return {
        itemKey: balance.itemKey,
        stockLevel: roundNumber(balance.reservePerTick + balance.tradeSurplusPerTick),
        reservePerTick: balance.reservePerTick,
        tradeSurplusPerTick: balance.tradeSurplusPerTick,
        unmetDemandPerTick: balance.unmetDemandPerTick,
        netPerTick: balance.netPerTick,
        supplyPressure,
        demandPressure
      };
    })
    .sort((left, right) => left.itemKey.localeCompare(right.itemKey));
}

function buildLaborPressureEntries(
  settlement: SettlementContentRecord | undefined,
  snapshot: EconomyLedgerSnapshot | undefined,
  indexes: RuntimeIndexes
): SettlementMarketLaborPressureState[] {
  const balancesByItem = new Map((snapshot?.balances ?? []).map((balance) => [balance.itemKey, balance]));
  const availabilityBoost = settlement ? getProductionCapacityModifier(settlement) : 1;

  return [...indexes.outputItemsBySkill.entries()]
    .map(([skillId, outputItems]) => {
      let supportingSupplyPerTick = 0;
      let shortfallPerTick = 0;
      for (const itemKey of outputItems) {
        const balance = balancesByItem.get(itemKey);
        if (!balance) {
          continue;
        }
        supportingSupplyPerTick += balance.tradeSurplusPerTick + balance.reservePerTick;
        shortfallPerTick += balance.shortfallPerTick;
      }

      const rawAvailability = availabilityBoost + supportingSupplyPerTick * 0.015 - shortfallPerTick * 0.02;
      const availability = roundNumber(clamp(rawAvailability, 0.7, 1.35));
      return {
        skillId,
        availability,
        pressure: roundNumber(1 / availability),
        supportingSupplyPerTick: roundNumber(supportingSupplyPerTick),
        shortfallPerTick: roundNumber(shortfallPerTick)
      };
    })
    .sort((left, right) => left.skillId.localeCompare(right.skillId));
}

function fallbackValueResolution(
  itemKey: string,
  item: ItemContentRecord | undefined,
  market: MarketItemValueRecord | undefined,
  note: string
): ItemValueResolutionState {
  const anchor = getSourceValueAnchor(item, market);
  return {
    itemKey,
    baseProductionCost: anchor,
    effectiveProductionCost: anchor,
    estimatedMarketValue: roundNumber(anchor * getDemandBandFactor(market?.pricingProfile.demandBand ?? item?.valueProfile.demandBand ?? "common")),
    profitMarginEstimate: 0,
    resolutionPath: [note],
    explanation: [buildPressureContribution("fallback_anchor", 1, note)]
  };
}

function resolveItemRuntimeValue(
  request: { itemKey: string; settlementId?: string | null; marketState?: SettlementMarketState | null },
  context?: ResolveValueContext
): ItemValueResolutionState {
  const indexes = getRuntimeIndexes();
  const settlementId = request.settlementId ?? request.marketState?.settlementId ?? null;
  const marketState = request.marketState ?? context?.marketState ?? null;
  const activeContext =
    context ??
    {
      settlementId,
      marketState,
      valueMemo: new Map<string, ItemValueResolutionState>(),
      chainMemo: new Map<string, CraftResolutionState>(),
      stack: []
    };
  const cacheKey = `${settlementId ?? "global"}::${request.itemKey}`;
  const cached = activeContext.valueMemo.get(cacheKey);
  if (cached) {
    return cached;
  }

  const item = indexes.itemByKey.get(request.itemKey);
  const market = indexes.marketByItemKey.get(request.itemKey);
  if (activeContext.stack.includes(request.itemKey)) {
    const fallback = fallbackValueResolution(request.itemKey, item, market, "cycle_guard");
    activeContext.valueMemo.set(cacheKey, fallback);
    return fallback;
  }

  activeContext.stack.push(request.itemKey);
  let resolved: ItemValueResolutionState;

  const outputCandidates = indexes.chainsByOutput.get(request.itemKey) ?? [];
  if (!item || !market) {
    resolved = fallbackValueResolution(request.itemKey, item, market, "missing_content_record");
  } else if (item.valueProfile.valueMode === "source_derived" || outputCandidates.length === 0) {
    const stockMap = getMarketStockMap(marketState);
    const stockEntry = stockMap.get(request.itemKey);
    const baseProductionCost = getSourceValueAnchor(item, market);
    const sourcingFactor = roundNumber(
      1 +
      Math.max(stockEntry?.demandPressure ?? 0, 0) * 0.18 -
      Math.max(-(stockEntry?.supplyPressure ?? 0), 0) * 0.12
    );
    const effectiveProductionCost = roundNumber(baseProductionCost * clamp(sourcingFactor, 0.82, 1.35));
    const demandFactor = getDemandBandFactor(market.pricingProfile.demandBand);
    const estimatedMarketValue = roundNumber(effectiveProductionCost * demandFactor);
    resolved = {
      itemKey: request.itemKey,
      baseProductionCost,
      effectiveProductionCost,
      estimatedMarketValue,
      profitMarginEstimate: roundNumber(estimatedMarketValue - effectiveProductionCost),
      resolutionPath: ["source_anchor"],
      explanation: [
        buildPressureContribution("source_anchor", 1, "raw or source-derived item anchor"),
        buildPressureContribution("local_sourcing", sourcingFactor, "local stock pressure adjusted source effort"),
        buildPressureContribution("demand_band", demandFactor, `demand band ${market.pricingProfile.demandBand}`)
      ]
    };
  } else {
    const candidateResolutions = outputCandidates.map((candidate) => {
      const craft = estimateCraftResolution(candidate.chain, activeContext, {
        chainId: candidate.chain.id,
        settlementId,
        marketState,
        targetOutputItemKey: request.itemKey,
        variantId: candidate.variantId ?? undefined,
        workerSkills: undefined,
        availableToolTags: undefined,
        fuelAvailable: true
      });
      const primaryOutput = craft.outputs.find((output) => output.itemKey === request.itemKey && output.role === "primary") ?? craft.outputs[0];
      const baseProductionCost = roundNumber(craft.totalCost / Math.max(primaryOutput?.quantity ?? 1, 1));
      const demandFactor = getDemandBandFactor(market.pricingProfile.demandBand);
      return {
        craft,
        baseProductionCost,
        effectiveProductionCost: baseProductionCost,
        estimatedMarketValue: roundNumber(baseProductionCost * demandFactor)
      };
    });

    const chosen = candidateResolutions.sort(
      (left, right) => left.effectiveProductionCost - right.effectiveProductionCost || left.craft.chainId.localeCompare(right.craft.chainId)
    )[0];
    resolved = {
      itemKey: request.itemKey,
      baseProductionCost: roundNumber(chosen.baseProductionCost),
      effectiveProductionCost: roundNumber(chosen.effectiveProductionCost),
      estimatedMarketValue: roundNumber(chosen.estimatedMarketValue),
      profitMarginEstimate: roundNumber(chosen.estimatedMarketValue - chosen.effectiveProductionCost),
      resolutionPath: [chosen.craft.chainId, ...chosen.craft.explanation.stepBreakdown.map((step) => step.stepId)],
      explanation: [
        buildPressureContribution("recipe_chain", 1, `derived from ${chosen.craft.chainId}`),
        buildPressureContribution("demand_band", getDemandBandFactor(market.pricingProfile.demandBand), `demand band ${market.pricingProfile.demandBand}`)
      ]
    };
  }

  activeContext.stack.pop();
  activeContext.valueMemo.set(cacheKey, resolved);
  return resolved;
}

function estimateCraftResolution(
  chain: ProductionChainRecord,
  context: ResolveValueContext,
  request: CraftResolutionRequest & { targetOutputItemKey: string }
): CraftResolutionState {
  const indexes = getRuntimeIndexes();
  const cacheKey = [
    context.settlementId ?? "global",
    chain.id,
    request.targetOutputItemKey,
    request.variantId ?? "default",
    request.selectedInputItemKeys?.join(",") ?? "auto",
    request.workerSkills ? Object.entries(request.workerSkills).sort(([left], [right]) => left.localeCompare(right)).join("|") : "estimated"
  ].join("::");
  const cached = context.chainMemo.get(cacheKey);
  if (cached) {
    return cached;
  }

  const variant = resolveVariant(chain, request.variantId, request.selectedInputItemKeys, request.targetOutputItemKey);
  const laborPressureMap = getLaborPressureMap(context.marketState);
  const settlement = context.settlementId ? indexes.settlementById.get(context.settlementId) : undefined;
  const productionCapacityModifier = getProductionCapacityModifier(settlement);

  const inputConsumption = new Map<string, CraftResolutionInputState>();
  const outputs = new Map<string, { itemKey: string; quantity: number; role: "primary" | "byproduct" | "waste"; unitValueBasis: number; totalValueBasis: number }>();
  const stepBreakdown = [] as CraftResolutionExplanationState["stepBreakdown"];

  let totalTime = 0;
  let totalMaterialCost = 0;
  let totalLaborCost = 0;
  let totalProcessingCost = 0;
  let totalWasteCost = 0;

  for (const step of chain.recipeProfile.processingSteps) {
    const workplace = step.stageRef.startsWith("workplace.") ? indexes.workplaceById.get(step.stageRef) : undefined;
    const stepInputs = resolveStepInputs(step, chain, workplace, variant, request.targetOutputItemKey, indexes);
    const stepOutputs = resolveStepOutputs(step, workplace, variant, request.targetOutputItemKey, indexes);
    const inputItems = stepInputs.map((itemKey) => indexes.itemByKey.get(itemKey));
    const materialDifficulty = getMaterialDifficultyFactor(inputItems);

    const skillEffect = createSkillEffect(step.skillCheck, chain.recipeProfile.primarySkillId, request.workerSkills, laborPressureMap);
    const effectiveRequiredRank = roundNumber(skillEffect.minimumRank === null ? 0 : skillEffect.minimumRank * materialDifficulty.factor);
    const toolPenalty = getWorkplaceToolPenalty(workplace, request.availableToolTags);
    const fuelPenalty = step.processingIntensity === "fuel_heavy" && request.fuelAvailable === false ? 1.35 : 1;

    let stepMaterialCost = 0;
    for (const itemKey of stepInputs) {
      const itemValue = resolveItemRuntimeValue(
        {
          itemKey,
          settlementId: context.settlementId,
          marketState: context.marketState
        },
        context
      );
      stepMaterialCost += itemValue.effectiveProductionCost;
      const existing = inputConsumption.get(itemKey);
      if (existing) {
        existing.quantity += 1;
        existing.totalCost = roundNumber(existing.totalCost + itemValue.effectiveProductionCost);
      } else {
        inputConsumption.set(itemKey, {
          itemKey,
          quantity: 1,
          unitCost: itemValue.effectiveProductionCost,
          totalCost: itemValue.effectiveProductionCost
        });
      }
    }

    const wasteCost = roundNumber(stepMaterialCost * Math.max(0, skillEffect.wasteMultiplier - 1));
    const baseHours = LABOR_HOURS[step.laborIntensity] + PROCESSING_HOURS[step.processingIntensity];
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[step.difficultyTier] * materialDifficulty.factor * toolPenalty.factor * fuelPenalty;
    const processingTimeHours = roundNumber((baseHours * difficultyMultiplier * skillEffect.timeFactor) / productionCapacityModifier);
    const laborRate = roundNumber((0.32 * DIFFICULTY_MULTIPLIERS[step.difficultyTier] + 0.18) * skillEffect.laborRateFactor);
    const laborCost = roundNumber(processingTimeHours * laborRate);
    const processingCost = roundNumber(
      processingTimeHours * PROCESSING_COST_RATES[step.processingIntensity] * toolPenalty.factor * fuelPenalty
    );

    totalTime += processingTimeHours;
    totalMaterialCost += stepMaterialCost;
    totalLaborCost += laborCost;
    totalProcessingCost += processingCost;
    totalWasteCost += wasteCost;

    const stepNotes = [
      ...skillEffect.notes,
      materialDifficulty.note,
      ...toolPenalty.notes
    ];
    if (request.fuelAvailable === false && step.processingIntensity === "fuel_heavy") {
      stepNotes.push("fuel shortfall increased time and processing overhead");
    }

    stepBreakdown.push({
      stepId: step.id,
      stageRef: step.stageRef,
      operation: step.operation,
      skillId: skillEffect.skillId,
      skillRank: skillEffect.skillRank,
      minimumRank: skillEffect.minimumRank,
      effectiveRequiredRank,
      inputItems: stepInputs,
      outputItems: [...stepOutputs.primaryOutputs, ...stepOutputs.byproducts],
      materialCost: roundNumber(stepMaterialCost),
      laborCost,
      processingCost,
      wasteCost,
      processingTimeHours,
      materialDifficultyFactor: materialDifficulty.factor,
      skillTimeFactor: skillEffect.timeFactor,
      laborRate,
      notes: stepNotes
    });
  }

  const totalCost = roundNumber(totalMaterialCost + totalLaborCost + totalProcessingCost + totalWasteCost);
  const lastStep = chain.recipeProfile.processingSteps.at(-1);
  const lastWorkplace = lastStep?.stageRef.startsWith("workplace.") ? indexes.workplaceById.get(lastStep.stageRef) : undefined;
  const finalOutputs = lastStep
    ? resolveStepOutputs(lastStep, lastWorkplace, variant, request.targetOutputItemKey, indexes)
    : { primaryOutputs: [request.targetOutputItemKey], byproducts: [] };

  for (const itemKey of finalOutputs.primaryOutputs) {
    outputs.set(itemKey, {
      itemKey,
      quantity: 1,
      role: "primary",
      unitValueBasis: roundNumber(totalCost / Math.max(finalOutputs.primaryOutputs.length, 1)),
      totalValueBasis: roundNumber(totalCost / Math.max(finalOutputs.primaryOutputs.length, 1))
    });
  }

  for (const itemKey of finalOutputs.byproducts) {
    outputs.set(itemKey, {
      itemKey,
      quantity: 1,
      role: "byproduct",
      unitValueBasis: roundNumber(totalCost * 0.12),
      totalValueBasis: roundNumber(totalCost * 0.12)
    });
  }

  const result: CraftResolutionState = {
    chainId: chain.id,
    settlementId: context.settlementId,
    primarySkillId: chain.recipeProfile.primarySkillId,
    targetOutputItemKey: request.targetOutputItemKey,
    outputQuantity: finalOutputs.primaryOutputs.length,
    processingTimeHours: roundNumber(totalTime),
    laborCost: roundNumber(totalLaborCost),
    materialCost: roundNumber(totalMaterialCost),
    processingCost: roundNumber(totalProcessingCost),
    wasteCost: roundNumber(totalWasteCost),
    totalCost,
    inputConsumption: [...inputConsumption.values()].sort((left, right) => left.itemKey.localeCompare(right.itemKey)),
    outputs: [...outputs.values()].sort((left, right) => left.itemKey.localeCompare(right.itemKey)),
    explanation: {
      selectedVariantId: variant?.id ?? null,
      valuePropagation: {
        materialCostMode: chain.recipeProfile.valuePropagation.materialCostMode,
        laborCostMode: chain.recipeProfile.valuePropagation.laborCostMode,
        processingCostMode: chain.recipeProfile.valuePropagation.processingCostMode,
        difficultyMode: chain.recipeProfile.valuePropagation.difficultyMode,
        demandBand: chain.recipeProfile.valuePropagation.demandBand,
        carriesForward: chain.recipeProfile.valuePropagation.carriesForward
      },
      stepBreakdown,
      notes: [
        `production capacity modifier ${productionCapacityModifier}`,
        request.fuelAvailable === false ? "fuel penalties applied where relevant" : "fuel assumptions satisfied",
        request.availableToolTags ? "tool availability evaluated against workplace requirements" : "tool availability assumed sufficient"
      ]
    }
  };

  context.chainMemo.set(cacheKey, result);
  return result;
}

function resolveAssociatedSkillId(itemKey: string, indexes: RuntimeIndexes): string | null {
  const outputCandidates = indexes.chainsByOutput.get(itemKey) ?? [];
  if (outputCandidates.length === 0) {
    return null;
  }
  return outputCandidates[0].chain.recipeProfile.primarySkillId;
}

function resolveLocalMarketPriceInternal(
  options: {
    itemKey: string;
    settlementId?: string | null;
    marketState?: SettlementMarketState | null;
  },
  context?: ResolveValueContext
): SettlementMarketPriceState {
  const indexes = getRuntimeIndexes();
  const settlementId = options.settlementId ?? options.marketState?.settlementId ?? null;
  const marketState = options.marketState ?? context?.marketState ?? null;
  const item = indexes.itemByKey.get(options.itemKey);
  const market = indexes.marketByItemKey.get(options.itemKey);
  const valueResolution = resolveItemRuntimeValue({ itemKey: options.itemKey, settlementId, marketState }, context);
  const stockMap = getMarketStockMap(marketState);
  const stockEntry = stockMap.get(options.itemKey);
  const associatedSkillId = resolveAssociatedSkillId(options.itemKey, indexes);
  const laborPressure = associatedSkillId ? getLaborPressureMap(marketState).get(associatedSkillId)?.pressure ?? 1 : 1;
  const demandBand = market?.pricingProfile.demandBand ?? item?.valueProfile.demandBand ?? "common";
  const demandFactor = getDemandBandFactor(demandBand);
  const supplyFactor = roundNumber(1 + Math.max(stockEntry?.supplyPressure ?? 0, 0) * 0.14);
  const demandPressureFactor = roundNumber(1 + Math.max(stockEntry?.demandPressure ?? 0, 0) * 0.18);
  const localShortfallFactor = roundNumber(1 + Math.max(stockEntry?.unmetDemandPerTick ?? 0, 0) * 0.01);
  const processingFactor = roundNumber(
    (item ? 1 + (DIFFICULTY_MULTIPLIERS[item.valueProfile.difficultyTier] - 1) * 0.35 : 1) *
      (item?.valueProfile.processingIntensity === "fuel_heavy"
        ? 1.08
        : item?.valueProfile.processingIntensity === "precision"
          ? 1.06
          : 1)
  );
  const importFactor = roundNumber(stockEntry && stockEntry.stockLevel > 0 ? 1 : 1.08);
  const estimatedMarketValue = roundNumber(
    valueResolution.effectiveProductionCost *
      demandFactor *
      supplyFactor *
      demandPressureFactor *
      laborPressure *
      processingFactor *
      localShortfallFactor *
      importFactor
  );
  const spreadFactor = roundNumber(
    0.16 +
      Math.max(Math.abs(stockEntry?.demandPressure ?? 0), Math.abs(stockEntry?.supplyPressure ?? 0)) * 0.08 +
      (demandBand === "luxury" ? 0.04 : demandBand === "specialty" ? 0.02 : 0)
  );
  const localSellPrice = roundNumber(estimatedMarketValue * (1 - spreadFactor / 2));
  const localBuyPrice = roundNumber(estimatedMarketValue * (1 + spreadFactor / 2));

  return {
    itemKey: options.itemKey,
    baseProductionCost: valueResolution.baseProductionCost,
    effectiveProductionCost: valueResolution.effectiveProductionCost,
    estimatedMarketValue,
    localBuyPrice,
    localSellPrice,
    spread: roundNumber(localBuyPrice - localSellPrice),
    pressureSources: [
      buildPressureContribution("demand_band", demandFactor, `demand band ${demandBand}`),
      buildPressureContribution("supply_pressure", supplyFactor, "local reserve and trade surplus pressure"),
      buildPressureContribution("demand_pressure", demandPressureFactor, "local unmet demand pressure"),
      buildPressureContribution("labor_pressure", laborPressure, associatedSkillId ? `labor pressure for ${associatedSkillId}` : "no associated skill pressure"),
      buildPressureContribution("processing_pressure", processingFactor, "difficulty and processing overhead"),
      buildPressureContribution("import_pressure", importFactor, stockEntry && stockEntry.stockLevel > 0 ? "local stock available" : "import fallback applied")
    ]
  };
}

export function resolveLocalMarketPrice(options: {
  itemKey: string;
  settlementId?: string | null;
  marketState?: SettlementMarketState | null;
}): SettlementMarketPriceState {
  return resolveLocalMarketPriceInternal(options);
}

export function buildSettlementMarketStates(options: BuildMarketStatesOptions): SettlementMarketState[] {
  const indexes = getRuntimeIndexes();
  const snapshotsBySettlementId = new Map(
    options.snapshots
      .filter((snapshot) => snapshot.level === "settlement" && snapshot.settlementId)
      .map((snapshot) => [snapshot.settlementId as string, snapshot])
  );

  const skeletonStates = options.settlementIds
    .map((settlementId) => {
      const settlement = indexes.settlementById.get(settlementId);
      const snapshot = snapshotsBySettlementId.get(settlementId);
      return {
        settlementId,
        tick: options.clock.tick,
        productionCapacityModifier: getProductionCapacityModifier(settlement),
        stock: buildStockPressureEntries(snapshot),
        laborPressure: buildLaborPressureEntries(settlement, snapshot, indexes),
        priceView: []
      } satisfies SettlementMarketState;
    })
    .sort((left, right) => left.settlementId.localeCompare(right.settlementId));

  for (const state of skeletonStates) {
    const context: ResolveValueContext = {
      settlementId: state.settlementId,
      marketState: state,
      valueMemo: new Map<string, ItemValueResolutionState>(),
      chainMemo: new Map<string, CraftResolutionState>(),
      stack: []
    };
    state.priceView = [...indexes.marketByItemKey.keys()]
      .sort((left, right) => left.localeCompare(right))
      .map((itemKey) => resolveLocalMarketPriceInternal({ itemKey, settlementId: state.settlementId, marketState: state }, context));
  }

  return skeletonStates;
}

export function resolveCraftAtSettlement(request: CraftResolutionRequest): CraftResolutionState {
  const indexes = getRuntimeIndexes();
  const chain = indexes.chainById.get(request.chainId);
  if (!chain) {
    throw new Error(`Unknown production chain ${request.chainId}`);
  }

  const targetOutputItemKey = request.targetOutputItemKey ?? chain.primaryOutput;
  const context: ResolveValueContext = {
    settlementId: request.settlementId ?? request.marketState?.settlementId ?? null,
    marketState: request.marketState ?? null,
    valueMemo: new Map<string, ItemValueResolutionState>(),
    chainMemo: new Map<string, CraftResolutionState>(),
    stack: []
  };

  return estimateCraftResolution(chain, context, {
    ...request,
    targetOutputItemKey
  });
}

export function resolveItemValueAtSettlement(options: {
  itemKey: string;
  settlementId?: string | null;
  marketState?: SettlementMarketState | null;
}): ItemValueResolutionState {
  return resolveItemRuntimeValue(options);
}
