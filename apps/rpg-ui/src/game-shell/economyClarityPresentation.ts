import type {
  CraftResolutionState,
  EconomyPressureContribution,
  ItemValueResolutionState,
  SettlementInfrastructureRuntimeState,
  SettlementMarketItemPressureState,
  SettlementMarketLaborPressureState,
  SettlementMarketPriceState,
  SettlementMarketState,
  SettlementSupplyDemandState,
  TradeOpportunityState
} from "../../../../packages/shared/types/src/index.js";

export type EconomyClarityTone =
  | "unknown"
  | "neutral"
  | "favorable"
  | "warning"
  | "blocked";

export type EconomyClarityRow = {
  id: string;
  label: string;
  valueLabel: string;
  detailLabel: string | null;
  tone: EconomyClarityTone;
};

export type EconomyPriceClarityInput = {
  settlementId?: string | null;
  itemKey?: string | null;
  marketState?: SettlementMarketState | null;
  price?: SettlementMarketPriceState | null;
  stockPressure?: SettlementMarketItemPressureState | null;
  laborPressure?: SettlementMarketLaborPressureState | null;
  supplyDemand?: SettlementSupplyDemandState | null;
  infrastructure?: SettlementInfrastructureRuntimeState | null;
  itemValue?: ItemValueResolutionState | null;
  tradeOpportunity?: TradeOpportunityState | null;
};

export type TradeOpportunityClarityInput = {
  opportunity?: TradeOpportunityState | null;
  originMarketState?: SettlementMarketState | null;
  destinationMarketState?: SettlementMarketState | null;
};

export type CraftCostClarityInput = {
  craft?: CraftResolutionState | null;
  itemValue?: ItemValueResolutionState | null;
};

export type EconomyPriceClarityViewModel = {
  title: string;
  subtitle: string;
  priceLabel: string;
  spreadLabel: string;
  scarcityLabels: string[];
  priceRows: EconomyClarityRow[];
  valueRows: EconomyClarityRow[];
  pressureRows: EconomyClarityRow[];
  laborRows: EconomyClarityRow[];
  warningLabels: string[];
  actionIds: [];
};

export type TradeOpportunityClarityViewModel = {
  title: string;
  subtitle: string;
  viabilityLabel: string;
  marginLabel: string;
  routeRows: EconomyClarityRow[];
  quantityLoadRows: EconomyClarityRow[];
  rejectionRows: EconomyClarityRow[];
  explanationRows: EconomyClarityRow[];
  warningLabels: string[];
  actionIds: [];
};

export type CraftCostClarityViewModel = {
  title: string;
  subtitle: string;
  costProfileLabel: string;
  costProfileLabels: string[];
  valueRows: EconomyClarityRow[];
  costProportionRows: EconomyClarityRow[];
  inputRows: EconomyClarityRow[];
  outputRows: EconomyClarityRow[];
  stepSummaryRows: EconomyClarityRow[];
  explanationRows: EconomyClarityRow[];
  warningLabels: string[];
  actionIds: [];
};

const PRICE_UNKNOWN_LABEL = "Unknown";
const SPREAD_UNKNOWN_LABEL = "Unknown spread";
const PRESSURE_UNKNOWN_LABEL = "Unknown pressure";

function emptyActionIds(): [] {
  return [];
}

function createRow(
  id: string,
  label: string,
  valueLabel: string,
  detailLabel: string | null = null,
  tone: EconomyClarityTone = "neutral"
): EconomyClarityRow {
  return {
    id,
    label,
    valueLabel,
    detailLabel,
    tone
  };
}

function isUsefulNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatNumber(value: number | null | undefined): string {
  if (!isUsefulNumber(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value);
}

function formatRatio(value: number | null | undefined): string {
  if (!isUsefulNumber(value)) {
    return "Unavailable";
  }

  return `${formatNumber(value * 100)}%`;
}

function toRowId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "row";
}

function humanizeId(value: string | null | undefined, fallback = "Unavailable"): string {
  if (!value) {
    return fallback;
  }

  const lastSegment = value.split(".").at(-1) ?? value;
  const words = lastSegment
    .split(/[_-]+/g)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return fallback;
  }

  return words
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function includesItem(values: readonly string[] | undefined, itemKey: string | null): boolean {
  return !!itemKey && !!values?.includes(itemKey);
}

function getRequestedItemKey(input: EconomyPriceClarityInput): string | null {
  return (
    input.itemKey ??
    input.price?.itemKey ??
    input.stockPressure?.itemKey ??
    input.itemValue?.itemKey ??
    input.tradeOpportunity?.itemKey ??
    null
  );
}

function getPrice(input: EconomyPriceClarityInput, itemKey: string | null): SettlementMarketPriceState | null {
  if (input.price) {
    return input.price;
  }

  if (!itemKey) {
    return null;
  }

  return input.marketState?.priceView.find((entry) => entry.itemKey === itemKey) ?? null;
}

function getStockPressure(
  input: EconomyPriceClarityInput,
  itemKey: string | null,
  warningLabels: string[]
): SettlementMarketItemPressureState | null {
  if (input.stockPressure) {
    if (itemKey && input.stockPressure.itemKey !== itemKey) {
      warningLabels.push("Stock pressure item does not match the requested item.");
      return null;
    }

    return input.stockPressure;
  }

  if (!itemKey) {
    return null;
  }

  return input.marketState?.stock.find((entry) => entry.itemKey === itemKey) ?? null;
}

function getSupplyDemand(
  input: EconomyPriceClarityInput,
  settlementId: string | null,
  warningLabels: string[]
): SettlementSupplyDemandState | null {
  if (!input.supplyDemand) {
    return null;
  }

  if (settlementId && input.supplyDemand.settlementId !== settlementId) {
    warningLabels.push("Supply and demand data does not match the requested settlement.");
    return null;
  }

  return input.supplyDemand;
}

function getSettlementId(input: EconomyPriceClarityInput): string | null {
  return (
    input.settlementId ??
    input.marketState?.settlementId ??
    input.supplyDemand?.settlementId ??
    input.infrastructure?.settlementId ??
    null
  );
}

function resolvePriceLabel(price: SettlementMarketPriceState | null): string {
  if (!price || !isUsefulNumber(price.estimatedMarketValue) || price.estimatedMarketValue <= 0) {
    return PRICE_UNKNOWN_LABEL;
  }

  const ratio = price.localBuyPrice / price.estimatedMarketValue;
  if (ratio <= 0.92) {
    return "Cheap";
  }
  if (ratio >= 1.12) {
    return "Expensive";
  }
  return "Fair";
}

function resolveSpreadLabel(price: SettlementMarketPriceState | null): string {
  if (!price || !isUsefulNumber(price.spread) || !isUsefulNumber(price.estimatedMarketValue) || price.estimatedMarketValue <= 0) {
    return SPREAD_UNKNOWN_LABEL;
  }

  const ratio = price.spread / price.estimatedMarketValue;
  if (ratio <= 0.12) {
    return "Tight spread";
  }
  if (ratio >= 0.24) {
    return "Wide spread";
  }
  return "Normal spread";
}

function buildPriceRows(price: SettlementMarketPriceState | null): EconomyClarityRow[] {
  if (!price) {
    return [
      createRow("price-unavailable", "Price", "Unavailable", "No current price row was supplied.", "unknown")
    ];
  }

  return [
    createRow("local-buy-price", "Local buy price", formatNumber(price.localBuyPrice), null, "neutral"),
    createRow("local-sell-price", "Local sell price", formatNumber(price.localSellPrice), "Resale context only; not a profit promise.", "neutral"),
    createRow("estimated-market-value", "Estimated value", formatNumber(price.estimatedMarketValue), null, "neutral"),
    createRow("effective-production-cost", "Production cost", formatNumber(price.effectiveProductionCost), null, "neutral"),
    createRow("price-spread", "Spread", formatNumber(price.spread), resolveSpreadLabel(price), price.spread > 0 ? "warning" : "neutral")
  ];
}

function toneForPressure(source: EconomyPressureContribution): EconomyClarityTone {
  if (source.impact > 0.05) {
    return "warning";
  }
  if (source.impact < -0.05) {
    return "favorable";
  }
  return "neutral";
}

function buildPressureRows(price: SettlementMarketPriceState | null): EconomyClarityRow[] {
  if (!price || price.pressureSources.length === 0) {
    return [
      createRow("pressure-unavailable", "Pressure", "Unavailable", "No current pressure source rows were supplied.", "unknown")
    ];
  }

  return price.pressureSources.map((source, index) =>
    createRow(
      `pressure-${toRowId(source.source)}-${index}`,
      humanizeId(source.source, "Pressure"),
      `Factor ${formatNumber(source.factor)}`,
      source.note || null,
      toneForPressure(source)
    )
  );
}

function buildValueRows(itemValue: ItemValueResolutionState | null | undefined): EconomyClarityRow[] {
  if (!itemValue) {
    return [];
  }

  return [
    createRow("value-estimated-market", "Value estimate", formatNumber(itemValue.estimatedMarketValue), "Read-only value estimate.", "neutral"),
    createRow("value-production-cost", "Production cost", formatNumber(itemValue.effectiveProductionCost), null, "neutral"),
    createRow("value-profit-estimate", "Profit estimate", formatNumber(itemValue.profitMarginEstimate), "Production estimate only; not a resale promise.", "neutral"),
    createRow(
      "value-resolution-path",
      "Resolution path",
      itemValue.resolutionPath.length > 0 ? itemValue.resolutionPath.map((entry) => humanizeId(entry, entry)).join(", ") : "Unavailable",
      null,
      itemValue.resolutionPath.length > 0 ? "neutral" : "unknown"
    )
  ];
}

function hasDependency(
  supplyDemand: SettlementSupplyDemandState | null,
  itemKey: string | null,
  direction: "import" | "export"
): boolean {
  return !!itemKey && !!supplyDemand?.tradeDependencies.some((dependency) => dependency.direction === direction && dependency.itemKey === itemKey);
}

function buildScarcityLabels(input: {
  itemKey: string | null;
  stockPressure: SettlementMarketItemPressureState | null;
  supplyDemand: SettlementSupplyDemandState | null;
  tradeOpportunity: TradeOpportunityState | null | undefined;
}): string[] {
  const labels: string[] = [];
  const { itemKey, stockPressure, supplyDemand, tradeOpportunity } = input;
  const hasAnyPressureData = !!stockPressure || !!supplyDemand || !!tradeOpportunity;

  if (
    includesItem(supplyDemand?.shortageGoods, itemKey) ||
    (stockPressure ? stockPressure.unmetDemandPerTick > 0.1 || stockPressure.demandPressure >= 0.18 : false)
  ) {
    labels.push("Scarce");
  }

  if (includesItem(supplyDemand?.importGoods, itemKey) || hasDependency(supplyDemand, itemKey, "import")) {
    labels.push("Import dependent");
  }

  if (
    includesItem(supplyDemand?.surplusGoods, itemKey) ||
    (stockPressure ? stockPressure.tradeSurplusPerTick > 0.1 || stockPressure.netPerTick > 0.12 : false)
  ) {
    labels.push("Surplus");
  }

  if (includesItem(supplyDemand?.exportGoods, itemKey) || hasDependency(supplyDemand, itemKey, "export")) {
    labels.push("Export ready");
  }

  if (
    tradeOpportunity &&
    tradeOpportunity.protectedReserve > 0 &&
    (tradeOpportunity.exportableSurplus <= tradeOpportunity.protectedReserve ||
      tradeOpportunity.rejectionReasons.some((reason) => /reserve/i.test(reason)))
  ) {
    labels.push("Protected reserve");
  }

  return labels.length > 0 ? labels : hasAnyPressureData ? [] : [PRESSURE_UNKNOWN_LABEL];
}

function resolveLaborLabel(laborPressure: SettlementMarketLaborPressureState | null | undefined): string {
  if (!laborPressure) {
    return "Labor data unavailable";
  }
  if (laborPressure.pressure >= 1.12 || laborPressure.shortfallPerTick > 0.1) {
    return "Labor constrained";
  }
  if (laborPressure.pressure <= 0.9 && laborPressure.availability >= 1.05) {
    return "Skilled labor available";
  }
  return "Stable labor";
}

function buildLaborRows(laborPressure: SettlementMarketLaborPressureState | null | undefined): EconomyClarityRow[] {
  const label = resolveLaborLabel(laborPressure);
  if (!laborPressure) {
    return [
      createRow("labor-unavailable", "Labor", label, "No explicit labor pressure row was supplied.", "unknown")
    ];
  }

  return [
    createRow(
      `labor-${toRowId(laborPressure.skillId)}`,
      humanizeId(laborPressure.skillId, "Labor"),
      label,
      `Availability ${formatNumber(laborPressure.availability)}; pressure ${formatNumber(laborPressure.pressure)}.`,
      label === "Labor constrained" ? "warning" : label === "Skilled labor available" ? "favorable" : "neutral"
    )
  ];
}

function buildPriceWarnings(input: EconomyPriceClarityInput, itemKey: string | null, price: SettlementMarketPriceState | null): string[] {
  const warnings: string[] = [];
  const settlementId = getSettlementId(input);

  if (!itemKey) {
    warnings.push("No item key was supplied.");
  }
  if (!price) {
    warnings.push("No current price data was supplied.");
  }
  if (itemKey && price && price.itemKey !== itemKey) {
    warnings.push("Price item does not match the requested item.");
  }
  if (itemKey && input.itemValue && input.itemValue.itemKey !== itemKey) {
    warnings.push("Item value data does not match the requested item.");
  }
  if (input.settlementId && input.marketState && input.marketState.settlementId !== input.settlementId) {
    warnings.push("Market state does not match the requested settlement.");
  }
  if (settlementId && input.infrastructure && input.infrastructure.settlementId !== settlementId) {
    warnings.push("Infrastructure data does not match the requested settlement.");
  }

  return warnings;
}

export function buildEconomyPriceClarityViewModel(input: EconomyPriceClarityInput): EconomyPriceClarityViewModel {
  const itemKey = getRequestedItemKey(input);
  const price = getPrice(input, itemKey);
  const warningLabels = buildPriceWarnings(input, itemKey, price);
  const settlementId = getSettlementId(input);
  const stockPressure = getStockPressure(input, itemKey, warningLabels);
  const supplyDemand = getSupplyDemand(input, settlementId, warningLabels);
  const priceLabel = resolvePriceLabel(price);
  const spreadLabel = resolveSpreadLabel(price);
  const scarcityLabels = buildScarcityLabels({
    itemKey,
    stockPressure,
    supplyDemand,
    tradeOpportunity: input.tradeOpportunity
  });

  return {
    title: itemKey ? `${humanizeId(itemKey)} price clarity` : "Price clarity unavailable",
    subtitle: settlementId ? `Settlement-local market context for ${humanizeId(settlementId)}.` : "No settlement context supplied.",
    priceLabel,
    spreadLabel,
    scarcityLabels,
    priceRows: buildPriceRows(price),
    valueRows: buildValueRows(input.itemValue),
    pressureRows: buildPressureRows(price),
    laborRows: buildLaborRows(input.laborPressure),
    warningLabels,
    actionIds: emptyActionIds()
  };
}

function resolveTradeViabilityLabel(opportunity: TradeOpportunityState | null | undefined): string {
  if (!opportunity) {
    return "Needs review";
  }
  if (opportunity.viable && opportunity.strategicNecessity) {
    return "Strategic necessity";
  }
  if (opportunity.viable) {
    return "Viable route";
  }
  if (opportunity.rejectionReasons.length > 0) {
    return "Blocked route";
  }
  return "Needs review";
}

function resolveTradeMarginLabel(opportunity: TradeOpportunityState | null | undefined): string {
  if (!opportunity) {
    return "Unknown margin";
  }
  if (!opportunity.viable) {
    return "Blocked";
  }
  if (opportunity.projectedNetMargin < 0) {
    return "Losing route";
  }
  if (!isUsefulNumber(opportunity.projectedGrossMargin) || opportunity.projectedGrossMargin <= 0) {
    return "Unknown margin";
  }

  const ratio = opportunity.projectedNetMargin / opportunity.projectedGrossMargin;
  if (ratio <= 0.15) {
    return "Thin margin";
  }
  if (ratio >= 0.35) {
    return "Strong margin";
  }
  return "Fair margin";
}

function resolveFillLabel(fillRatio: number): string {
  if (fillRatio < 0.45) {
    return "Light load";
  }
  if (fillRatio >= 0.8) {
    return "Full load";
  }
  return "Useful load";
}

function resolveRouteTimeLabel(routeTimeDays: number): string {
  if (routeTimeDays <= 3) {
    return "Short route";
  }
  if (routeTimeDays <= 10) {
    return "Regional route";
  }
  return "Long route";
}

function buildTradeWarnings(input: TradeOpportunityClarityInput): string[] {
  const opportunity = input.opportunity;
  const warnings: string[] = [];
  if (!opportunity) {
    warnings.push("No current trade opportunity was supplied.");
    return warnings;
  }
  if (input.originMarketState && input.originMarketState.settlementId !== opportunity.originSettlementId) {
    warnings.push("Origin market state does not match the trade opportunity.");
  }
  if (input.destinationMarketState && input.destinationMarketState.settlementId !== opportunity.destinationSettlementId) {
    warnings.push("Destination market state does not match the trade opportunity.");
  }
  return warnings;
}

function buildRouteRows(opportunity: TradeOpportunityState): EconomyClarityRow[] {
  return [
    createRow("trade-origin", "Origin", humanizeId(opportunity.originSettlementId), opportunity.originSettlementId, "neutral"),
    createRow("trade-destination", "Destination", humanizeId(opportunity.destinationSettlementId), opportunity.destinationSettlementId, "neutral"),
    createRow("trade-route-time", "Route time", `${formatNumber(opportunity.routeTimeDays)} days`, resolveRouteTimeLabel(opportunity.routeTimeDays), "neutral"),
    createRow("trade-cycle-time", "Cycle time", `${formatNumber(opportunity.cycleDays)} days`, null, "neutral"),
    createRow(
      "trade-routes",
      "Routes",
      opportunity.routeIds.length > 0 ? opportunity.routeIds.map((routeId) => humanizeId(routeId, routeId)).join(", ") : "Unavailable",
      null,
      opportunity.routeIds.length > 0 ? "neutral" : "unknown"
    )
  ];
}

function buildQuantityLoadRows(opportunity: TradeOpportunityState): EconomyClarityRow[] {
  return [
    createRow("trade-projected-quantity", "Projected quantity", formatNumber(opportunity.projectedQuantity), null, "neutral"),
    createRow("trade-load-units", "Projected load", formatNumber(opportunity.projectedLoadUnits), resolveFillLabel(opportunity.fillRatio), "neutral"),
    createRow("trade-fill-ratio", "Fill ratio", formatRatio(opportunity.fillRatio), resolveFillLabel(opportunity.fillRatio), "neutral"),
    createRow("trade-exportable-surplus", "Exportable surplus", formatNumber(opportunity.exportableSurplus), null, "neutral"),
    createRow("trade-protected-reserve", "Protected reserve", formatNumber(opportunity.protectedReserve), null, opportunity.protectedReserve > 0 ? "warning" : "neutral"),
    createRow("trade-destination-absorption", "Destination absorption", formatNumber(opportunity.destinationAbsorption), null, "neutral"),
    createRow("trade-origin-sell-price", "Origin sell price", formatNumber(opportunity.originSellPrice), null, "neutral"),
    createRow("trade-destination-buy-price", "Destination buy price", formatNumber(opportunity.destinationBuyPrice), null, "neutral"),
    createRow("trade-unit-margin", "Unit margin", formatNumber(opportunity.unitMargin), null, opportunity.unitMargin < 0 ? "warning" : "neutral"),
    createRow("trade-net-margin", "Projected net margin", formatNumber(opportunity.projectedNetMargin), resolveTradeMarginLabel(opportunity), opportunity.projectedNetMargin < 0 ? "warning" : "neutral")
  ];
}

function buildRejectionRows(opportunity: TradeOpportunityState): EconomyClarityRow[] {
  return opportunity.rejectionReasons.map((reason, index) =>
    createRow(`trade-rejection-${index + 1}`, `Rejection ${index + 1}`, reason, null, "blocked")
  );
}

function buildExplanationRows(prefix: string, lines: readonly string[]): EconomyClarityRow[] {
  return lines.map((line, index) =>
    createRow(`${prefix}-explanation-${index + 1}`, `Explanation ${index + 1}`, line, null, "neutral")
  );
}

export function buildTradeOpportunityClarityViewModel(input: TradeOpportunityClarityInput): TradeOpportunityClarityViewModel {
  const opportunity = input.opportunity ?? null;
  const warningLabels = buildTradeWarnings(input);

  if (!opportunity) {
    return {
      title: "Trade opportunity unavailable",
      subtitle: "No current trade opportunity was supplied.",
      viabilityLabel: resolveTradeViabilityLabel(null),
      marginLabel: resolveTradeMarginLabel(null),
      routeRows: [],
      quantityLoadRows: [],
      rejectionRows: [],
      explanationRows: [],
      warningLabels,
      actionIds: emptyActionIds()
    };
  }

  return {
    title: `${humanizeId(opportunity.itemKey)} trade clarity`,
    subtitle: `${humanizeId(opportunity.originSettlementId)} to ${humanizeId(opportunity.destinationSettlementId)}.`,
    viabilityLabel: resolveTradeViabilityLabel(opportunity),
    marginLabel: resolveTradeMarginLabel(opportunity),
    routeRows: buildRouteRows(opportunity),
    quantityLoadRows: buildQuantityLoadRows(opportunity),
    rejectionRows: buildRejectionRows(opportunity),
    explanationRows: buildExplanationRows("trade", opportunity.explanation),
    warningLabels,
    actionIds: emptyActionIds()
  };
}

function ratioOf(value: number, total: number): number {
  return total > 0 ? value / total : 0;
}

function costTone(value: number, total: number): EconomyClarityTone {
  return ratioOf(value, total) >= 0.45 ? "warning" : "neutral";
}

function hasStepNote(craft: CraftResolutionState, pattern: RegExp): boolean {
  return (
    craft.explanation.notes.some((note) => pattern.test(note)) ||
    craft.explanation.stepBreakdown.some((step) => step.notes.some((note) => pattern.test(note)))
  );
}

function buildCraftLabels(craft: CraftResolutionState | null, itemValue: ItemValueResolutionState | null | undefined): string[] {
  if (!craft || craft.totalCost <= 0) {
    return itemValue ? [] : ["Value estimate unavailable"];
  }

  const labels: string[] = [];
  const components = [
    { label: "Material-heavy", value: craft.materialCost, threshold: 0.45 },
    { label: "Labor-heavy", value: craft.laborCost, threshold: 0.35 },
    { label: "Processing-heavy", value: craft.processingCost, threshold: 0.3 }
  ];
  const largest = components.reduce((current, next) => (next.value > current.value ? next : current), components[0]);

  for (const component of components) {
    if (component === largest || ratioOf(component.value, craft.totalCost) >= component.threshold) {
      labels.push(component.label);
    }
  }
  if (ratioOf(craft.wasteCost, craft.totalCost) >= 0.12 || hasStepNote(craft, /waste/i)) {
    labels.push("Waste-sensitive");
  }
  if (hasStepNote(craft, /fuel/i)) {
    labels.push("Fuel-sensitive");
  }
  if (hasStepNote(craft, /tool/i)) {
    labels.push("Tool-sensitive");
  }
  if (craft.explanation.stepBreakdown.some((step) => (step.minimumRank ?? 0) > 0 || step.effectiveRequiredRank > 0)) {
    labels.push("Skill-sensitive");
  }
  if (!itemValue) {
    labels.push("Value estimate unavailable");
  }

  return [...new Set(labels)];
}

function buildCraftCostRows(craft: CraftResolutionState): EconomyClarityRow[] {
  return [
    createRow("craft-material-cost", "Material cost", formatNumber(craft.materialCost), formatRatio(ratioOf(craft.materialCost, craft.totalCost)), costTone(craft.materialCost, craft.totalCost)),
    createRow("craft-labor-cost", "Labor cost", formatNumber(craft.laborCost), formatRatio(ratioOf(craft.laborCost, craft.totalCost)), costTone(craft.laborCost, craft.totalCost)),
    createRow("craft-processing-cost", "Processing cost", formatNumber(craft.processingCost), formatRatio(ratioOf(craft.processingCost, craft.totalCost)), costTone(craft.processingCost, craft.totalCost)),
    createRow("craft-waste-cost", "Waste cost", formatNumber(craft.wasteCost), formatRatio(ratioOf(craft.wasteCost, craft.totalCost)), craft.wasteCost > 0 ? "warning" : "neutral"),
    createRow("craft-total-cost", "Total cost", formatNumber(craft.totalCost), null, "neutral"),
    createRow("craft-time", "Processing time", `${formatNumber(craft.processingTimeHours)} hours`, null, "neutral")
  ];
}

function buildCraftInputRows(craft: CraftResolutionState): EconomyClarityRow[] {
  return craft.inputConsumption.map((input, index) =>
    createRow(
      `craft-input-${toRowId(input.itemKey)}-${index + 1}`,
      humanizeId(input.itemKey),
      `${formatNumber(input.quantity)} @ ${formatNumber(input.unitCost)}`,
      `Total cost ${formatNumber(input.totalCost)}.`,
      "neutral"
    )
  );
}

function buildCraftOutputRows(craft: CraftResolutionState): EconomyClarityRow[] {
  return craft.outputs.map((output, index) =>
    createRow(
      `craft-output-${toRowId(output.itemKey)}-${index + 1}`,
      humanizeId(output.itemKey),
      `${formatNumber(output.quantity)} ${humanizeId(output.role, output.role)}`,
      `Value basis ${formatNumber(output.totalValueBasis)}.`,
      output.role === "waste" ? "warning" : "neutral"
    )
  );
}

function buildStepSummaryRows(craft: CraftResolutionState): EconomyClarityRow[] {
  return craft.explanation.stepBreakdown.map((step, index) =>
    createRow(
      `craft-step-${toRowId(step.stepId)}-${index + 1}`,
      humanizeId(step.operation, `Step ${index + 1}`),
      `${formatNumber(step.processingTimeHours)} hours`,
      `${humanizeId(step.skillId)} rank ${formatNumber(step.skillRank)}; cost ${formatNumber(step.materialCost + step.laborCost + step.processingCost + step.wasteCost)}.`,
      step.notes.some((note) => /missing|shortfall|waste|fuel/i.test(note)) ? "warning" : "neutral"
    )
  );
}

function buildCraftWarnings(input: CraftCostClarityInput): string[] {
  const warnings: string[] = [];
  if (!input.craft) {
    warnings.push("No current craft estimate was supplied.");
  }
  if (input.craft && input.itemValue && input.itemValue.itemKey !== input.craft.targetOutputItemKey) {
    warnings.push("Item value data does not match the craft target output.");
  }
  if (input.craft && input.craft.totalCost <= 0) {
    warnings.push("Craft estimate has no positive total cost.");
  }
  if (input.craft && !input.itemValue) {
    warnings.push("No current item value estimate was supplied.");
  }
  return warnings;
}

export function buildCraftCostClarityViewModel(input: CraftCostClarityInput): CraftCostClarityViewModel {
  const craft = input.craft ?? null;
  const warningLabels = buildCraftWarnings(input);

  if (!craft) {
    return {
      title: "Craft estimate unavailable",
      subtitle: "No current craft estimate was supplied.",
      costProfileLabel: "No current craft estimate",
      costProfileLabels: buildCraftLabels(null, input.itemValue),
      valueRows: buildValueRows(input.itemValue),
      costProportionRows: [],
      inputRows: [],
      outputRows: [],
      stepSummaryRows: [],
      explanationRows: [],
      warningLabels,
      actionIds: emptyActionIds()
    };
  }

  const costProfileLabels = buildCraftLabels(craft, input.itemValue);

  return {
    title: `${humanizeId(craft.targetOutputItemKey)} craft clarity`,
    subtitle: `Read-only estimate for ${humanizeId(craft.chainId)}.`,
    costProfileLabel: costProfileLabels[0] ?? "Balanced cost profile",
    costProfileLabels,
    valueRows: buildValueRows(input.itemValue),
    costProportionRows: buildCraftCostRows(craft),
    inputRows: buildCraftInputRows(craft),
    outputRows: buildCraftOutputRows(craft),
    stepSummaryRows: buildStepSummaryRows(craft),
    explanationRows: buildExplanationRows("craft", craft.explanation.notes),
    warningLabels,
    actionIds: emptyActionIds()
  };
}
