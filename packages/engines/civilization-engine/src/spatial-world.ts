import type {
  HexResourceAvailabilityState,
  ResourceAvailabilityTier,
  RejectedRouteState,
  RouteResolutionState,
  RouteSegmentState,
  SettlementResourceAccessState,
  SettlementSupplyCapabilityState,
  TravelPenaltyState
} from "../../../shared/types/src/index.js";
import {
  loadBiomeContent,
  loadFaunaContent,
  loadFloraContent,
  loadHabitatContent,
  loadMineralContent,
  loadRegionContent,
  loadRegionLocalityContent,
  loadSettlementContent,
  loadTravelNetworkContent,
  loadWorldHexContent,
  loadWorldHexEdgeContent,
  type BiomeContentRecord,
  type FaunaContentRecord,
  type FloraContentRecord,
  type HabitatContentRecord,
  type MineralContentRecord,
  type RegionContentRecord,
  type RegionLocalityContentRecord,
  type ResourceEcologyProfileRecord,
  type SettlementContentRecord,
  type TravelModeProfileRecord,
  type TravelNetworkContentRecord,
  type TravelRouteRecord,
  type WorldHexContentRecord,
  type WorldHexEdgeContentRecord
} from "./content.js";
import { resolveResourceFamilies } from "./resource-taxonomy.js";

const HEX_DISTANCE_KILOMETERS = 24;
const KILOMETERS_PER_MILE = 1.60934;
const SOURCE_DEPENDENT_FAMILIES = new Set([
  "grain",
  "vegetables",
  "fruit",
  "tea",
  "herbs",
  "fish",
  "hides",
  "fur",
  "meat",
  "horse_fodder",
  "wood",
  "minerals",
  "livestock",
  "maritime_goods",
  "luxury_goods"
]);

const TIER_SCORE: Record<ResourceAvailabilityTier, number> = {
  absent: 0,
  rare: 0.45,
  uncommon: 0.7,
  common: 1,
  abundant: 1.25
};

const QUALITY_FACTOR: Record<string, number> = {
  low: 0.82,
  medium: 1,
  high: 1.12
};

const MODE_COST_WEIGHT: Record<string, number> = {
  "travel_mode.foot": 1,
  "travel_mode.horseback": 1.2,
  "travel_mode.pack_animal": 1.1,
  "travel_mode.wagon": 1.3,
  "travel_mode.river_craft": 0.9,
  "travel_mode.sea_vessel": 1.05
};

const BARRIER_BASE_PENALTIES: Record<string, number> = {
  cliff: 1.3,
  marsh: 1.35,
  river_crossing: 1.18,
  ferry_required: 1.1,
  mountain_pass: 1.28,
  pass_country: 1.25,
  dense_forest: 1.18,
  switchbacks: 1.16,
  toll_gate: 1.05,
  open_sea: 1.08,
  bad_weather: 1.08,
  water_only: 1
};

interface DerivedResourceSource {
  sourceType: "flora" | "fauna" | "mineral";
  sourceId: string;
  displayName: string;
  resourceKeys: string[];
  ecologyProfile: ResourceEcologyProfileRecord;
  tagSet: Set<string>;
}

interface SpatialWorldContext {
  regionsById: Map<string, RegionContentRecord>;
  localitiesById: Map<string, RegionLocalityContentRecord>;
  settlementsById: Map<string, SettlementContentRecord>;
  hexesById: Map<string, WorldHexContentRecord>;
  edgesById: Map<string, WorldHexEdgeContentRecord>;
  routesById: Map<string, TravelRouteRecord>;
  routeAdjacencyBySettlementId: Map<string, TravelRouteRecord[]>;
  routeNetwork: TravelNetworkContentRecord;
  modeProfilesById: Map<string, TravelModeProfileRecord>;
  habitatsById: Map<string, HabitatContentRecord>;
  biomesById: Map<string, BiomeContentRecord>;
  resourceSources: DerivedResourceSource[];
  adjacencyByHexId: Map<string, WorldHexEdgeContentRecord[]>;
  hexAvailabilityCache: Map<string, HexResourceAvailabilityState[]>;
  settlementAccessCache: Map<string, SettlementResourceAccessState>;
}

let cachedContext: SpatialWorldContext | null = null;

function roundNumber(value: number): number {
  return Number(value.toFixed(4));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function uniqueStrings(values: Iterable<string | null | undefined>): string[] {
  return [...new Set([...values].filter((value): value is string => typeof value === "string" && value.length > 0))];
}

function getModeKey(modeId: string): string {
  return modeId.replace(/^travel_mode\./, "");
}

function getModeKilometersPerDay(mode: TravelModeProfileRecord): number {
  return mode.baseKilometersPerDay ?? roundNumber(mode.baseMilesPerDay * KILOMETERS_PER_MILE);
}

function keywordPresence(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function deriveElevationBand(text: string): string | null {
  if (keywordPresence(text, ["subterranean", "underdark", "cave", "depth", "warrens_below"])) {
    return "subterranean";
  }
  if (keywordPresence(text, ["alpine", "mountain", "highland", "ridge", "peak", "pass", "cliff"])) {
    return text.includes("alpine") ? "alpine" : "highland";
  }
  if (keywordPresence(text, ["upland", "hill", "foothill", "march"])) {
    return "upland";
  }
  if (keywordPresence(text, ["coast", "delta", "bay", "floodplain", "basin", "plain", "vale", "river", "marsh", "harbor"])) {
    return "lowland";
  }
  return null;
}

function deriveFreshwaterAffinity(text: string): ResourceEcologyProfileRecord["freshwaterAffinity"] {
  if (keywordPresence(text, ["coast", "marine", "reef", "bay", "harbor", "sea", "tidal"])) {
    return "coast";
  }
  if (keywordPresence(text, ["marsh", "bog", "swamp", "mangrove"])) {
    return "marsh";
  }
  if (keywordPresence(text, ["river", "ford", "delta", "floodplain", "headwater", "lake"])) {
    return "river";
  }
  if (keywordPresence(text, ["stream", "brook", "spring"])) {
    return "stream";
  }
  return "none";
}

function deriveLocalityCompatibility(text: string): string[] {
  const tags = new Set<string>();
  if (keywordPresence(text, ["coast", "bay", "harbor", "delta", "estuary", "reef", "anchorage"])) {
    tags.add("coastal_bay");
    tags.add("harbor");
  }
  if (keywordPresence(text, ["river", "ford", "bridge", "floodplain", "headwater"])) {
    tags.add("river_plain");
    tags.add("river_corridor");
  }
  if (keywordPresence(text, ["marsh", "bog", "mangrove", "swamp"])) {
    tags.add("marsh_edge");
  }
  if (keywordPresence(text, ["forest", "wood", "timber", "rainforest", "taiga", "grove"])) {
    tags.add("forest_edge");
  }
  if (keywordPresence(text, ["plain", "prairie", "steppe", "savanna", "granary", "farmbelt"])) {
    tags.add("interior_basin");
    tags.add("river_plain");
  }
  if (keywordPresence(text, ["upland", "march", "hill"])) {
    tags.add("upland_march");
  }
  if (keywordPresence(text, ["alpine", "mountain", "pass", "cliff", "ridge"])) {
    tags.add("alpine_pass");
  }
  if (keywordPresence(text, ["cave", "subterranean", "underhold", "warrens_below"])) {
    tags.add("subterranean");
  }
  return [...tags];
}

function rarityFromBreadth(count: number): ResourceEcologyProfileRecord["rarityTendency"] {
  if (count >= 4) {
    return "abundant";
  }
  if (count >= 2) {
    return "common";
  }
  return "uncommon";
}

function deriveEcologyProfileFromHabitats(
  habitatIds: string[],
  habitatsById: Map<string, HabitatContentRecord>,
  biomesById: Map<string, BiomeContentRecord>
): ResourceEcologyProfileRecord {
  const compatibleBiomeIds = new Set<string>();
  const compatibleClimateBands = new Set<string>();
  const compatibleElevationBands = new Set<string>();
  const compatibleLocalityTags = new Set<string>();
  const freshwaterCounts = new Map<string, number>();

  for (const habitatId of habitatIds) {
    const habitat = habitatsById.get(habitatId);
    if (!habitat) {
      continue;
    }
    const habitatBiomeIds = uniqueStrings([habitat.biomeId, ...(habitat.biomeIds ?? [])]);
    for (const biomeId of habitatBiomeIds) {
      compatibleBiomeIds.add(biomeId);
      const biome = biomesById.get(biomeId);
      if (biome?.climateBand) {
        compatibleClimateBands.add(biome.climateBand);
      }
    }
    const sourceText = `${habitat.id} ${habitat.slug} ${habitat.name} ${habitatBiomeIds.join(" ")}`.toLowerCase();
    const elevationBand = deriveElevationBand(sourceText);
    if (elevationBand) {
      compatibleElevationBands.add(elevationBand);
    }
    for (const localityTag of deriveLocalityCompatibility(sourceText)) {
      compatibleLocalityTags.add(localityTag);
    }
    const freshwaterAffinity = deriveFreshwaterAffinity(sourceText) ?? "none";
    freshwaterCounts.set(freshwaterAffinity, (freshwaterCounts.get(freshwaterAffinity) ?? 0) + 1);
  }

  const freshwaterAffinity =
    [...freshwaterCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ??
    ("none" as ResourceEcologyProfileRecord["freshwaterAffinity"]);

  return {
    compatibleBiomeIds: [...compatibleBiomeIds],
    compatibleClimateBands: [...compatibleClimateBands],
    compatibleElevationBands: [...compatibleElevationBands],
    compatibleLocalityTags: [...compatibleLocalityTags],
    freshwaterAffinity,
    rarityTendency: rarityFromBreadth(habitatIds.length)
  };
}

function deriveMineralEcologyProfile(record: MineralContentRecord): ResourceEcologyProfileRecord {
  const slug = record.slug.toLowerCase();
  const depositText = `${slug} ${record.depositForms.join(" ")} ${record.extractionTypes.join(" ")}`.toLowerCase();
  const compatibleElevationBands = new Set<string>();
  const compatibleLocalityTags = new Set<string>();
  const compatibleClimateBands = new Set<string>();

  if (keywordPresence(depositText, ["salt", "brine"])) {
    compatibleLocalityTags.add("coastal_bay");
    compatibleLocalityTags.add("marsh_edge");
  }
  if (keywordPresence(depositText, ["river", "sand", "clay"])) {
    compatibleLocalityTags.add("river_plain");
    compatibleElevationBands.add("lowland");
  }
  if (keywordPresence(depositText, ["vein", "lode", "pocket", "outcrop", "ridge", "ore", "gem", "obsidian"])) {
    compatibleLocalityTags.add("upland_march");
    compatibleLocalityTags.add("alpine_pass");
    compatibleElevationBands.add("highland");
  }
  if (keywordPresence(depositText, ["coal", "chalk", "limestone", "field", "seam"])) {
    compatibleLocalityTags.add("interior_basin");
    compatibleElevationBands.add("upland");
    compatibleElevationBands.add("lowland");
  }
  if (compatibleElevationBands.size === 0) {
    compatibleElevationBands.add("highland");
  }

  if (keywordPresence(slug, ["amber", "salt", "river_sand"])) {
    compatibleClimateBands.add("temperate");
  }

  let rarityTendency: ResourceEcologyProfileRecord["rarityTendency"] = "common";
  if (record.tier >= 3 || keywordPresence(slug, ["gold", "silver", "gem", "mith", "orich", "aether", "moon_silver"])) {
    rarityTendency = "rare";
  } else if (record.tier === 2 || keywordPresence(slug, ["cobalt", "tin", "amber", "quartz"])) {
    rarityTendency = "uncommon";
  }

  return {
    compatibleBiomeIds: [],
    compatibleClimateBands: [...compatibleClimateBands],
    compatibleElevationBands: [...compatibleElevationBands],
    compatibleLocalityTags: [...compatibleLocalityTags],
    freshwaterAffinity: keywordPresence(slug, ["salt", "brine"]) ? "coast" : keywordPresence(slug, ["river", "sand", "clay"]) ? "river" : "none",
    rarityTendency
  };
}

function collectResourceKeys(value: unknown, parentKey: string | null, bucket: Set<string>): void {
  if (Array.isArray(value)) {
    if (parentKey && ["materials", "ingredients", "byproducts", "items"].includes(parentKey)) {
      for (const entry of value) {
        if (typeof entry === "string" && /^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(entry)) {
          bucket.add(entry);
        }
      }
      return;
    }
    for (const entry of value) {
      collectResourceKeys(entry, parentKey, bucket);
    }
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    collectResourceKeys(nested, key, bucket);
  }
}

function buildResourceTags(resourceKeys: string[], slug: string, fallbackTags: string[]): Set<string> {
  const tags = new Set<string>(fallbackTags);
  for (const resourceKey of resourceKeys) {
    for (const family of resolveResourceFamilies(resourceKey)) {
      tags.add(family);
    }
    if (resourceKey.includes("fish") || resourceKey.includes("roe") || resourceKey.includes("shell")) {
      tags.add("fishery");
    }
    if (resourceKey.includes("wood") || resourceKey.includes("timber") || resourceKey.includes("bark")) {
      tags.add("timber");
    }
    if (resourceKey.includes("ore") || resourceKey.includes("stone") || resourceKey.includes("clay") || resourceKey.includes("salt")) {
      tags.add("ore");
      tags.add("stone");
    }
  }

  for (const token of slug.split("_")) {
    tags.add(token);
  }
  return tags;
}

function buildDerivedResourceSources(
  flora: FloraContentRecord[],
  fauna: FaunaContentRecord[],
  minerals: MineralContentRecord[],
  habitatsById: Map<string, HabitatContentRecord>,
  biomesById: Map<string, BiomeContentRecord>
): DerivedResourceSource[] {
  const resources: DerivedResourceSource[] = [];

  for (const record of flora) {
    const resourceKeys = new Set<string>();
    collectResourceKeys(record.template ?? {}, null, resourceKeys);
    const ecologyProfile = record.ecologyProfile ?? deriveEcologyProfileFromHabitats(record.habitatIds, habitatsById, biomesById);
    resources.push({
      sourceType: "flora",
      sourceId: record.id,
      displayName: record.name,
      resourceKeys: [...resourceKeys],
      ecologyProfile,
      tagSet: buildResourceTags([...resourceKeys], record.slug, [record.type])
    });
  }

  for (const record of fauna) {
    const resourceKeys = new Set<string>();
    collectResourceKeys(record.template ?? {}, null, resourceKeys);
    const ecologyProfile = record.ecologyProfile ?? deriveEcologyProfileFromHabitats(record.habitatIds, habitatsById, biomesById);
    resources.push({
      sourceType: "fauna",
      sourceId: record.id,
      displayName: record.name,
      resourceKeys: [...resourceKeys],
      ecologyProfile,
      tagSet: buildResourceTags([...resourceKeys], record.slug, [record.type, record.dangerClass])
    });
  }

  for (const record of minerals) {
    const ecologyProfile = record.ecologyProfile ?? deriveMineralEcologyProfile(record);
    resources.push({
      sourceType: "mineral",
      sourceId: record.id,
      displayName: record.name,
      resourceKeys: [record.itemKey],
      ecologyProfile,
      tagSet: buildResourceTags([record.itemKey], record.slug, ["minerals"])
    });
  }

  return resources;
}

function availabilityFromScore(score: number): ResourceAvailabilityTier {
  if (score >= 0.78) {
    return "abundant";
  }
  if (score >= 0.58) {
    return "common";
  }
  if (score >= 0.38) {
    return "uncommon";
  }
  if (score >= 0.2) {
    return "rare";
  }
  return "absent";
}

function rarityMultiplier(rarity: ResourceEcologyProfileRecord["rarityTendency"]): number {
  switch (rarity) {
    case "abundant":
      return 1.08;
    case "common":
      return 1;
    case "uncommon":
      return 0.88;
    case "rare":
      return 0.72;
    default:
      return 1;
  }
}

function getHexClimateBand(hex: WorldHexContentRecord): string {
  const value = hex.biomeFamily.toLowerCase();
  if (value.includes("desert")) {
    return "desert";
  }
  if (value.includes("tundra") || value.includes("taiga") || value.includes("cold")) {
    return "cold";
  }
  if (value.includes("tropical") || value.includes("savanna") || value.includes("mangrove")) {
    return "tropical";
  }
  if (value.includes("subterranean")) {
    return "subterranean";
  }
  if (value.includes("marine")) {
    return "marine";
  }
  return "temperate";
}

function matchesBiome(hex: WorldHexContentRecord, resource: DerivedResourceSource, biomesById: Map<string, BiomeContentRecord>): boolean {
  const compatibleBiomeIds = resource.ecologyProfile.compatibleBiomeIds ?? [];
  if (compatibleBiomeIds.length === 0) {
    return false;
  }

  const hexBiome = hex.biomeFamily.toLowerCase();
  return compatibleBiomeIds.some((biomeId) => {
    const biome = biomesById.get(biomeId);
    const biomeSlug = biome?.slug ?? biomeId.split(".").pop() ?? biomeId;
    return hexBiome.includes(biomeSlug.toLowerCase()) || biomeSlug.toLowerCase().includes(hexBiome);
  });
}

function matchesClimate(hex: WorldHexContentRecord, resource: DerivedResourceSource): boolean {
  return (resource.ecologyProfile.compatibleClimateBands ?? []).includes(getHexClimateBand(hex));
}

function matchesElevation(hex: WorldHexContentRecord, resource: DerivedResourceSource): boolean {
  return (resource.ecologyProfile.compatibleElevationBands ?? []).includes(hex.elevationBand);
}

function matchesFreshwater(hex: WorldHexContentRecord, resource: DerivedResourceSource): boolean {
  const affinity = resource.ecologyProfile.freshwaterAffinity ?? "any";
  return affinity === "any" || affinity === hex.freshwaterType;
}

function matchesLocality(hex: WorldHexContentRecord, locality: RegionLocalityContentRecord | undefined, resource: DerivedResourceSource): boolean {
  const compatibleLocalityTags = resource.ecologyProfile.compatibleLocalityTags ?? [];
  if (compatibleLocalityTags.length === 0) {
    return false;
  }
  const localityText = `${hex.terrainType} ${locality?.localityType ?? ""} ${locality?.dominantIndustries?.join(" ") ?? ""}`.toLowerCase();
  return compatibleLocalityTags.some((tag) => localityText.includes(tag.toLowerCase()));
}

function matchesAffinityTags(hex: WorldHexContentRecord, resource: DerivedResourceSource): boolean {
  const affinityTags = new Set(hex.resourceAffinityTags);
  for (const tag of resource.tagSet) {
    if (affinityTags.has(tag)) {
      return true;
    }
  }
  return false;
}

function scoreResourceAgainstHex(context: SpatialWorldContext, hex: WorldHexContentRecord, resource: DerivedResourceSource): HexResourceAvailabilityState {
  const locality = context.localitiesById.get(hex.localityBandId);
  const notes: string[] = [];
  let score = 0.08;

  if (matchesBiome(hex, resource, context.biomesById)) {
    score += 0.34;
    notes.push("Biome family is directly compatible.");
  } else if (matchesClimate(hex, resource)) {
    score += 0.16;
    notes.push("Climate band is compatible.");
  } else {
    notes.push("Biome and climate are only weakly aligned.");
  }

  if (matchesElevation(hex, resource)) {
    score += 0.18;
    notes.push("Elevation band supports this resource.");
  }

  if (matchesFreshwater(hex, resource)) {
    score += 0.14;
    notes.push("Freshwater context matches.");
  }

  if (matchesLocality(hex, locality, resource)) {
    score += 0.14;
    notes.push("Locality band is a direct ecological fit.");
  }

  if (matchesAffinityTags(hex, resource)) {
    score += 0.18;
    notes.push("Hex resource affinities reinforce local availability.");
  }

  score *= rarityMultiplier(resource.ecologyProfile.rarityTendency);
  score = clamp(score, 0, 1);

  return {
    hexId: hex.id,
    sourceType: resource.sourceType,
    sourceId: resource.sourceId,
    displayName: resource.displayName,
    resourceKeys: resource.resourceKeys,
    availabilityTier: availabilityFromScore(score),
    compatibilityScore: roundNumber(score),
    notes
  };
}

function getContext(): SpatialWorldContext {
  if (cachedContext) {
    return cachedContext;
  }

  const regions = loadRegionContent();
  const localities = loadRegionLocalityContent();
  const settlements = loadSettlementContent();
  const hexes = loadWorldHexContent();
  const edges = loadWorldHexEdgeContent();
  const travelNetwork = loadTravelNetworkContent()[0];
  const habitats = loadHabitatContent();
  const biomes = loadBiomeContent();
  const flora = loadFloraContent();
  const fauna = loadFaunaContent();
  const minerals = loadMineralContent();

  const routes = [...travelNetwork.routeRecords, ...travelNetwork.interPortShipRoutes];
  const routeAdjacencyBySettlementId = new Map<string, TravelRouteRecord[]>();
  for (const route of routes) {
    const fromRoutes = routeAdjacencyBySettlementId.get(route.fromSettlementId) ?? [];
    fromRoutes.push(route);
    routeAdjacencyBySettlementId.set(route.fromSettlementId, fromRoutes);
    const toRoutes = routeAdjacencyBySettlementId.get(route.toSettlementId) ?? [];
    toRoutes.push(route);
    routeAdjacencyBySettlementId.set(route.toSettlementId, toRoutes);
  }

  const adjacencyByHexId = new Map<string, WorldHexEdgeContentRecord[]>();
  for (const edge of edges) {
    const fromList = adjacencyByHexId.get(edge.fromHexId) ?? [];
    fromList.push(edge);
    adjacencyByHexId.set(edge.fromHexId, fromList);
    const toList = adjacencyByHexId.get(edge.toHexId) ?? [];
    toList.push(edge);
    adjacencyByHexId.set(edge.toHexId, toList);
  }

  cachedContext = {
    regionsById: new Map(regions.map((record) => [record.id, record])),
    localitiesById: new Map(localities.map((record) => [record.id, record])),
    settlementsById: new Map(settlements.map((record) => [record.id, record])),
    hexesById: new Map(hexes.map((record) => [record.id, record])),
    edgesById: new Map(edges.map((record) => [record.id, record])),
    routesById: new Map(routes.map((record) => [record.id, record])),
    routeAdjacencyBySettlementId,
    routeNetwork: travelNetwork,
    modeProfilesById: new Map(travelNetwork.modeProfiles.map((record) => [record.id, record])),
    habitatsById: new Map(habitats.map((record) => [record.id, record])),
    biomesById: new Map(biomes.map((record) => [record.id, record])),
    resourceSources: buildDerivedResourceSources(
      flora,
      fauna,
      minerals,
      new Map(habitats.map((record) => [record.id, record])),
      new Map(biomes.map((record) => [record.id, record]))
    ),
    adjacencyByHexId,
    hexAvailabilityCache: new Map(),
    settlementAccessCache: new Map()
  };

  return cachedContext;
}

function getHexAvailability(context: SpatialWorldContext, hexId: string): HexResourceAvailabilityState[] {
  const cached = context.hexAvailabilityCache.get(hexId);
  if (cached) {
    return cached;
  }

  const hex = context.hexesById.get(hexId);
  if (!hex) {
    return [];
  }

  const resolved = context.resourceSources
    .map((resource) => scoreResourceAgainstHex(context, hex, resource))
    .sort((left, right) => right.compatibilityScore - left.compatibilityScore || left.sourceId.localeCompare(right.sourceId));

  context.hexAvailabilityCache.set(hexId, resolved);
  return resolved;
}

function getSettlementReachSteps(settlement: SettlementContentRecord): number {
  const base =
    settlement.populationBand === "major"
      ? 3
      : settlement.populationBand === "large"
        ? 3
        : settlement.populationBand === "modest"
          ? 2
          : 1;
  const infraLift =
    (settlement.infrastructureProfile.roadTier >= 3 ? 1 : 0) +
    (settlement.infrastructureProfile.harborTier >= 2 ? 1 : 0) +
    (settlement.infrastructureProfile.waterTier >= 2 ? 1 : 0);
  return Math.max(1, Math.min(4, base + infraLift));
}

function getReachableHexIds(context: SpatialWorldContext, settlement: SettlementContentRecord): string[] {
  const startHexId = settlement.hexAnchorId;
  if (!context.hexesById.has(startHexId)) {
    return [];
  }

  const maxSteps = getSettlementReachSteps(settlement);
  const visited = new Set<string>([startHexId]);
  const queue: Array<{ hexId: string; depth: number }> = [{ hexId: startHexId, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || current.depth >= maxSteps) {
      continue;
    }

    for (const edge of context.adjacencyByHexId.get(current.hexId) ?? []) {
      const nextHexId = edge.fromHexId === current.hexId ? edge.toHexId : edge.fromHexId;
      if (visited.has(nextHexId)) {
        continue;
      }

      const waterLocked = edge.edgeType === "sea_lane" || edge.edgeType === "river";
      if (
        waterLocked &&
        settlement.tradeDependencyProfile.routeAccess.coastal < 0.5 &&
        settlement.tradeDependencyProfile.routeAccess.river < 0.5 &&
        settlement.infrastructureProfile.harborTier < 1
      ) {
        continue;
      }

      visited.add(nextHexId);
      queue.push({ hexId: nextHexId, depth: current.depth + 1 });
    }
  }

  return [...visited];
}

function aggregateFamilyTier(entries: HexResourceAvailabilityState[], families: string[]): ResourceAvailabilityTier {
  let best = 0;
  for (const entry of entries) {
    const entryFamilies = new Set(entry.resourceKeys.flatMap((resourceKey) => resolveResourceFamilies(resourceKey)));
    if (families.some((family) => entryFamilies.has(family))) {
      best = Math.max(best, TIER_SCORE[entry.availabilityTier]);
    }
  }

  if (best >= 1.2) {
    return "abundant";
  }
  if (best >= 1) {
    return "common";
  }
  if (best >= 0.7) {
    return "uncommon";
  }
  if (best > 0) {
    return "rare";
  }
  return "absent";
}

function hasRole(settlement: SettlementContentRecord, roles: string[]): boolean {
  const combined = new Set([
    settlement.economicModel.dominantRole,
    ...settlement.economicModel.secondaryRoles,
    ...settlement.purposeTags,
    ...settlement.identityTags
  ]);
  return roles.some((role) => combined.has(role));
}

function computeInfrastructureGate(
  settlement: SettlementContentRecord,
  locality: RegionLocalityContentRecord | undefined,
  families: string[]
): { factor: number; notes: string[] } {
  const notes: string[] = [];
  let factor = 1;

  if (families.some((family) => family === "fish" || family === "maritime_goods")) {
    const enabled =
      settlement.infrastructureProfile.harborTier >= 1 ||
      settlement.infrastructureProfile.waterTier >= 2 ||
      settlement.tradeDependencyProfile.routeAccess.coastal >= 0.7 ||
      settlement.tradeDependencyProfile.routeAccess.river >= 0.7;
    factor *= enabled ? 1 : 0.2;
    notes.push(enabled ? "Water access supports fisheries and maritime extraction." : "Water infrastructure is too weak for meaningful fishery output.");
  }

  if (families.some((family) => family === "minerals")) {
    const enabled =
      hasRole(settlement, ["mining", "quarrying", "extractive", "frontier_support"]) ||
      keywordPresence((locality?.dominantIndustries ?? []).join(" ").toLowerCase(), ["mining", "quarry", "salt", "stone"]);
    factor *= enabled ? 1 : 0.45;
    notes.push(enabled ? "Settlement role supports extractive production." : "Extractive infrastructure is limited here.");
  }

  if (families.some((family) => family === "wood")) {
    const enabled =
      hasRole(settlement, ["timber", "woodworking", "shipbuilding"]) ||
      keywordPresence((locality?.dominantIndustries ?? []).join(" ").toLowerCase(), ["timber", "wood", "ship"]);
    factor *= enabled ? 1 : 0.6;
    notes.push(enabled ? "Wood extraction or woodcraft roles are present." : "Timber is accessible but not fully industrialized.");
  }

  if (families.some((family) => ["grain", "vegetables", "fruit", "tea", "herbs", "horse_fodder"].includes(family))) {
    const arable = locality?.resourceCatchment.arableLand ?? "none";
    const enabled = settlement.siteClass === "surface" && arable !== "none";
    factor *= enabled ? 1 : 0.35;
    notes.push(enabled ? "Surface agriculture is supported by local catchment." : "Agricultural catchment is too weak for strong staple output.");
  }

  if (families.some((family) => ["livestock", "hides", "fur", "meat"].includes(family))) {
    const pasture = locality?.resourceCatchment.pasture ?? "none";
    const enabled = pasture !== "none" || hasRole(settlement, ["livestock", "pastoral", "hunting", "frontier_support"]);
    factor *= enabled ? 1 : 0.5;
    notes.push(enabled ? "Pasture or hunting support is present." : "Animal-resource infrastructure is weak.");
  }

  if (settlement.infrastructureProfile.overallLevel === "rudimentary") {
    factor *= 0.9;
    notes.push("Rudimentary infrastructure limits dependable output.");
  }

  return { factor: clamp(factor, 0, 1.25), notes };
}

export function resolveHexResourceAvailability(input: { hexId: string; includeAbsent?: boolean }): HexResourceAvailabilityState[] {
  const context = getContext();
  const entries = getHexAvailability(context, input.hexId);
  return input.includeAbsent ? entries : entries.filter((entry) => entry.availabilityTier !== "absent");
}

export function resolveSettlementResourceAccess(input: { settlementId: string }): SettlementResourceAccessState {
  const context = getContext();
  const cached = context.settlementAccessCache.get(input.settlementId);
  if (cached) {
    return cached;
  }

  const settlement = context.settlementsById.get(input.settlementId);
  if (!settlement) {
    throw new Error(`Unknown settlement '${input.settlementId}'`);
  }

  const locality = context.localitiesById.get(settlement.localityBandId);
  const accessibleHexIds = getReachableHexIds(context, settlement);
  const bestResourceBySource = new Map<string, HexResourceAvailabilityState>();

  for (const hexId of accessibleHexIds) {
    for (const availability of getHexAvailability(context, hexId)) {
      const existing = bestResourceBySource.get(availability.sourceId);
      if (!existing || availability.compatibilityScore > existing.compatibilityScore) {
        bestResourceBySource.set(availability.sourceId, availability);
      }
    }
  }

  const accessibleResources = [...bestResourceBySource.values()].filter((entry) => entry.availabilityTier !== "absent");
  const usableResources = accessibleResources.filter((entry) => {
    const families = uniqueStrings(entry.resourceKeys.flatMap((itemKey) => resolveResourceFamilies(itemKey)));
    const gate = computeInfrastructureGate(settlement, locality, families);
    return gate.factor >= 0.55;
  });

  const familyDefinitions = [
    "grain",
    "vegetables",
    "fruit",
    "tea",
    "herbs",
    "fish",
    "wood",
    "minerals",
    "livestock",
    "hides",
    "fur",
    "meat",
    "maritime_goods",
    "luxury_goods"
  ];

  const familyAvailability = familyDefinitions
    .map((family) => {
      const accessibleTier = aggregateFamilyTier(accessibleResources, [family]);
      const usableTier = aggregateFamilyTier(usableResources, [family]);
      const gate = computeInfrastructureGate(settlement, locality, [family]);
      return {
        family,
        accessibleTier,
        usableTier,
        notes: gate.notes
      };
    })
    .filter((entry) => entry.accessibleTier !== "absent" || entry.usableTier !== "absent");

  const blockedFamilies = familyAvailability
    .filter((entry) => entry.accessibleTier !== "absent" && entry.usableTier === "absent")
    .map((entry) => entry.family);

  const accessState: SettlementResourceAccessState = {
    settlementId: settlement.id,
    localityBandId: settlement.localityBandId,
    homeHexId: settlement.hexAnchorId,
    accessibleHexIds,
    accessibleResources,
    usableResources,
    familyAvailability,
    explanation: {
      blockedFamilies,
      infrastructureNotes: uniqueStrings(familyAvailability.flatMap((entry) => entry.notes)),
      notes: [
        `${settlement.name} reaches ${accessibleHexIds.length} hexes from ${settlement.hexAnchorId}.`,
        `${usableResources.length} ecology-matched resource sources remain usable after infrastructure gating.`
      ]
    }
  };

  context.settlementAccessCache.set(input.settlementId, accessState);
  return accessState;
}

function getSettlementCapabilityFromAccess(
  settlement: SettlementContentRecord,
  accessState: SettlementResourceAccessState,
  itemKey: string
): SettlementSupplyCapabilityState {
  const families = uniqueStrings(resolveResourceFamilies(itemKey));
  const isSourceDependent = families.some((family) => SOURCE_DEPENDENT_FAMILIES.has(family));

  if (!isSourceDependent) {
    return {
      settlementId: settlement.id,
      itemKey,
      accessible: true,
      usable: true,
      supplyFactor: 1,
      reason: ["Manufactured or service output; not directly source-gated by terrain ecology."]
    };
  }

  const matchingFamilies = accessState.familyAvailability.filter((entry) => families.includes(entry.family));
  const accessibleTier = matchingFamilies.reduce<ResourceAvailabilityTier>(
    (best, entry) => (TIER_SCORE[entry.accessibleTier] > TIER_SCORE[best] ? entry.accessibleTier : best),
    "absent"
  );
  const usableTier = matchingFamilies.reduce<ResourceAvailabilityTier>(
    (best, entry) => (TIER_SCORE[entry.usableTier] > TIER_SCORE[best] ? entry.usableTier : best),
    "absent"
  );

  return {
    settlementId: settlement.id,
    itemKey,
    accessible: accessibleTier !== "absent",
    usable: usableTier !== "absent",
    supplyFactor: roundNumber(usableTier === "absent" ? 0 : TIER_SCORE[usableTier]),
    reason: matchingFamilies.flatMap((entry) => [`${entry.family}: accessible=${entry.accessibleTier}, usable=${entry.usableTier}`, ...entry.notes])
  };
}

export function resolveSettlementSupplyCapability(input: {
  settlementId: string;
  itemKey: string;
}): SettlementSupplyCapabilityState {
  const context = getContext();
  const settlement = context.settlementsById.get(input.settlementId);
  if (!settlement) {
    throw new Error(`Unknown settlement '${input.settlementId}'`);
  }
  return getSettlementCapabilityFromAccess(settlement, resolveSettlementResourceAccess({ settlementId: input.settlementId }), input.itemKey);
}

function findEdgeBetween(context: SpatialWorldContext, fromHexId: string, toHexId: string): WorldHexEdgeContentRecord | null {
  return (
    (context.adjacencyByHexId.get(fromHexId) ?? []).find(
      (edge) =>
        (edge.fromHexId === fromHexId && edge.toHexId === toHexId) ||
        (edge.fromHexId === toHexId && edge.toHexId === fromHexId)
    ) ?? null
  );
}

function getBarrierPenalty(modeId: string, barrierTags: string[]): { factor: number; penalties: TravelPenaltyState[] } {
  const penalties: TravelPenaltyState[] = [];
  let factor = 1;
  const modeKey = getModeKey(modeId);
  const sensitivityMultiplier =
    modeKey === "wagon" ? 1.18 : modeKey === "horseback" || modeKey === "pack_animal" ? 1.08 : modeKey.includes("vessel") || modeKey.includes("craft") ? 0.95 : 1;

  for (const tag of barrierTags) {
    const penalty = BARRIER_BASE_PENALTIES[tag] ?? 1;
    const appliedPenalty = roundNumber(1 + (penalty - 1) * sensitivityMultiplier);
    factor *= appliedPenalty;
    penalties.push({
      source: tag,
      factor: appliedPenalty,
      note: `Barrier '${tag}' increases travel burden on this segment.`
    });
  }

  return { factor: roundNumber(factor), penalties };
}

function buildRouteSegments(
  context: SpatialWorldContext,
  route: TravelRouteRecord,
  fromSettlementId: string,
  modeId: string
): { segments: RouteSegmentState[]; rejection: string | null } {
  const mode = context.modeProfilesById.get(modeId);
  if (!mode) {
    return { segments: [], rejection: `Mode '${modeId}' is not defined.` };
  }
  if (!route.availableModeIds.includes(modeId)) {
    return { segments: [], rejection: `${route.id} does not allow ${modeId}.` };
  }
  if ((route.accessRequirements ?? []).includes("water_only") && mode.domain !== "water") {
    return { segments: [], rejection: `${route.id} is water-only.` };
  }

  const orderedHexIds = route.orderedHexIds ?? [];
  const edgeIds = route.edgeIds ?? [];
  const baseSpeedKilometersPerDay = getModeKilometersPerDay(mode);
  const segments: RouteSegmentState[] = [];

  if (edgeIds.length > 0) {
    for (const [index, edgeId] of edgeIds.entries()) {
      const edge = context.edgesById.get(edgeId);
      if (!edge) {
        return { segments: [], rejection: `${route.id} references missing edge '${edgeId}'.` };
      }
      if (!edge.allowedTravelModes.includes(modeId)) {
        return { segments: [], rejection: `${route.id} edge '${edgeId}' blocks ${modeId}.` };
      }
      const fromHex = context.hexesById.get(edge.fromHexId);
      const toHex = context.hexesById.get(edge.toHexId);
      if (!fromHex || !toHex) {
        return { segments: [], rejection: `${route.id} edge '${edgeId}' references missing hexes.` };
      }

      const modeKey = getModeKey(modeId);
      const friction = ((fromHex.frictionByMode[modeKey] ?? 1) + (toHex.frictionByMode[modeKey] ?? 1)) / 2;
      const barrierResult = getBarrierPenalty(modeId, [...edge.barrierTags, ...(route.accessRequirements ?? [])]);
      const routeQualityFactor = QUALITY_FACTOR[edge.routeQuality] ?? 1;
      const riskLevel = roundNumber((fromHex.hazardTags.length + toHex.hazardTags.length + edge.barrierTags.length) / 6);
      const effectiveSpeedKilometersPerDay = roundNumber(
        clamp((baseSpeedKilometersPerDay * routeQualityFactor) / (friction * edge.crossingDifficulty * barrierResult.factor), 2, 220)
      );
      const distanceKilometers = roundNumber(edge.hexSpan * HEX_DISTANCE_KILOMETERS);

      segments.push({
        segmentIndex: index,
        routeId: route.id,
        edgeId,
        fromHexId: edge.fromHexId,
        toHexId: edge.toHexId,
        edgeType: edge.edgeType,
        distanceKilometers,
        terrain: `${fromHex.terrainType} -> ${toHex.terrainType}`,
        barrierTags: [...edge.barrierTags],
        riskLevel,
        allowedTravelModes: [...edge.allowedTravelModes],
        baseSpeedKilometersPerDay,
        effectiveSpeedKilometersPerDay,
        timeDays: roundNumber(distanceKilometers / effectiveSpeedKilometersPerDay),
        penalties: [
          {
            source: "terrain_friction",
            factor: roundNumber(friction),
            note: `Dominant terrain friction from ${fromHex.terrainType} and ${toHex.terrainType}.`
          },
          {
            source: "route_quality",
            factor: roundNumber(1 / routeQualityFactor),
            note: `Route quality '${edge.routeQuality}' modifies practical speed.`
          },
          {
            source: "crossing_difficulty",
            factor: roundNumber(edge.crossingDifficulty),
            note: `Crossing difficulty on ${edge.edgeType} edge.`
          },
          ...barrierResult.penalties
        ],
        notes: [
          fromSettlementId === route.fromSettlementId ? route.signage?.forward ?? "" : route.signage?.reverse ?? "",
          edge.corridorName
        ].filter(Boolean)
      });
    }

    return { segments, rejection: null };
  }

  if (orderedHexIds.length === 1 && route.intraHexDistanceKm) {
    const hex = context.hexesById.get(orderedHexIds[0]);
    if (!hex) {
      return { segments: [], rejection: `${route.id} references missing intra-hex '${orderedHexIds[0]}'.` };
    }

    const modeKey = getModeKey(modeId);
    const friction = hex.frictionByMode[modeKey] ?? 1;
    const barrierResult = getBarrierPenalty(modeId, [...hex.barrierTags, ...(route.accessRequirements ?? [])]);
    const effectiveSpeedKilometersPerDay = roundNumber(clamp(baseSpeedKilometersPerDay / (friction * barrierResult.factor), 2, 220));
    segments.push({
      segmentIndex: 0,
      routeId: route.id,
      edgeId: null,
      fromHexId: hex.id,
      toHexId: hex.id,
      edgeType: route.routeType ?? route.routeClass,
      distanceKilometers: roundNumber(route.intraHexDistanceKm),
      terrain: hex.terrainType,
      barrierTags: [...hex.barrierTags],
      riskLevel: roundNumber(hex.hazardTags.length / 4),
      allowedTravelModes: [...route.availableModeIds],
      baseSpeedKilometersPerDay,
      effectiveSpeedKilometersPerDay,
      timeDays: roundNumber(route.intraHexDistanceKm / effectiveSpeedKilometersPerDay),
      penalties: [
        {
          source: "terrain_friction",
          factor: roundNumber(friction),
          note: `Intra-hex travel friction within ${hex.terrainType}.`
        },
        ...barrierResult.penalties
      ],
      notes: [route.signage?.corridorName ?? route.name]
    });
    return { segments, rejection: null };
  }

  if (orderedHexIds.length >= 2) {
    for (let index = 0; index < orderedHexIds.length - 1; index += 1) {
      const fromHexId = orderedHexIds[index];
      const toHexId = orderedHexIds[index + 1];
      const edge = findEdgeBetween(context, fromHexId, toHexId);
      if (!edge) {
        return { segments: [], rejection: `${route.id} cannot traverse missing adjacency ${fromHexId} -> ${toHexId}.` };
      }
      const nested = buildRouteSegments(context, { ...route, edgeIds: [edge.id], orderedHexIds: [fromHexId, toHexId] }, fromSettlementId, modeId);
      if (nested.rejection) {
        return nested;
      }
      segments.push(...nested.segments.map((segment) => ({ ...segment, segmentIndex: segments.length + segment.segmentIndex })));
    }
    return { segments, rejection: null };
  }

  return { segments: [], rejection: `${route.id} has no usable segment data.` };
}

function routeWeightForStrategy(strategy: "fastest" | "lowest_risk" | "lowest_cost", segments: RouteSegmentState[], modeId: string): number {
  const totalTimeDays = segments.reduce((sum, segment) => sum + segment.timeDays, 0);
  const totalRisk = segments.reduce((sum, segment) => sum + segment.riskLevel, 0);
  const costWeight = totalTimeDays * (MODE_COST_WEIGHT[modeId] ?? 1) + totalRisk * 0.3;

  switch (strategy) {
    case "lowest_risk":
      return roundNumber(totalRisk * 10 + totalTimeDays * 0.2);
    case "lowest_cost":
      return roundNumber(costWeight);
    case "fastest":
    default:
      return roundNumber(totalTimeDays);
  }
}

export function resolveBestRoute(input: {
  fromSettlementId: string;
  toSettlementId: string;
  modeId: string;
  strategy?: "fastest" | "lowest_risk" | "lowest_cost";
}): RouteResolutionState {
  const context = getContext();
  const strategy = input.strategy ?? "fastest";
  const rejectedRoutes: RejectedRouteState[] = [];
  const frontier = new Map<string, { weight: number; segments: RouteSegmentState[] }>();
  const visited = new Set<string>();

  if (!context.settlementsById.has(input.fromSettlementId)) {
    throw new Error(`Unknown fromSettlementId '${input.fromSettlementId}'`);
  }
  if (!context.settlementsById.has(input.toSettlementId)) {
    throw new Error(`Unknown toSettlementId '${input.toSettlementId}'`);
  }

  frontier.set(input.fromSettlementId, { weight: 0, segments: [] });

  while (frontier.size > 0) {
    const currentEntry = [...frontier.entries()].sort((left, right) => left[1].weight - right[1].weight)[0];
    const [currentSettlementId, currentState] = currentEntry;
    frontier.delete(currentSettlementId);
    if (visited.has(currentSettlementId)) {
      continue;
    }
    visited.add(currentSettlementId);

    if (currentSettlementId === input.toSettlementId) {
      const routeIds = currentState.segments.map((segment) => segment.routeId);
      const uniqueRouteIds = routeIds.filter((routeId, index) => routeIds.indexOf(routeId) === index);
      const totalDistanceKilometers = roundNumber(currentState.segments.reduce((sum, segment) => sum + segment.distanceKilometers, 0));
      const totalTimeDays = roundNumber(currentState.segments.reduce((sum, segment) => sum + segment.timeDays, 0));
      const totalRisk = roundNumber(currentState.segments.reduce((sum, segment) => sum + segment.riskLevel, 0));
      return {
        fromSettlementId: input.fromSettlementId,
        toSettlementId: input.toSettlementId,
        modeId: input.modeId,
        strategy,
        routeIds: uniqueRouteIds,
        totalDistanceKilometers,
        totalTimeDays,
        totalRisk,
        totalCostWeight: roundNumber(totalTimeDays * (MODE_COST_WEIGHT[input.modeId] ?? 1) + totalRisk * 0.3),
        segments: currentState.segments,
        rejectedRoutes,
        explanation: [
          `Resolved ${strategy} route from ${input.fromSettlementId} to ${input.toSettlementId}.`,
          `Selected ${uniqueRouteIds.length} authored corridor(s) for ${input.modeId}.`
        ]
      };
    }

    for (const route of context.routeAdjacencyBySettlementId.get(currentSettlementId) ?? []) {
      const nextSettlementId = route.fromSettlementId === currentSettlementId ? route.toSettlementId : route.fromSettlementId;
      if (visited.has(nextSettlementId)) {
        continue;
      }

      const segmentResult = buildRouteSegments(context, route, currentSettlementId, input.modeId);
      if (segmentResult.rejection) {
        rejectedRoutes.push({ routeId: route.id, reason: segmentResult.rejection });
        continue;
      }

      const totalWeight = currentState.weight + routeWeightForStrategy(strategy, segmentResult.segments, input.modeId);
      const existing = frontier.get(nextSettlementId);
      if (!existing || totalWeight < existing.weight) {
        frontier.set(nextSettlementId, {
          weight: totalWeight,
          segments: [...currentState.segments, ...segmentResult.segments]
        });
      }
    }
  }

  throw new Error(`No valid ${input.modeId} route from ${input.fromSettlementId} to ${input.toSettlementId}.`);
}

export function describeRouteDirection(input: { routeId: string; fromSettlementId: string }): string {
  const context = getContext();
  const route = context.routesById.get(input.routeId);
  if (!route) {
    throw new Error(`Unknown route '${input.routeId}'`);
  }
  if (input.fromSettlementId === route.fromSettlementId) {
    return route.signage?.forward ?? route.name;
  }
  if (input.fromSettlementId === route.toSettlementId) {
    return route.signage?.reverse ?? route.name;
  }
  return route.signage?.corridorName ?? route.name;
}

export function buildSpatialWorldContext(): {
  hexCount: number;
  edgeCount: number;
  routeCount: number;
  settlementCount: number;
  localityCount: number;
} {
  const context = getContext();
  return {
    hexCount: context.hexesById.size,
    edgeCount: context.edgesById.size,
    routeCount: context.routesById.size,
    settlementCount: context.settlementsById.size,
    localityCount: context.localitiesById.size
  };
}
